// Smart Board AI for English Adventure Academy.
// The smartboard page (smart-board/index.html) sends short teacher requests here; this function asks Google Gemini
// and returns kid-level English (neat handwriting, word cards, sentences, quizzes, stories, translations) or a picture.
//
// Secrets (Supabase dashboard > Edge Functions > Secrets). The Gemini key is only ever stored there:
//   GEMINI_API_KEY     your key from Google AI Studio (aistudio.google.com > Get API key)
//   BOARD_PIN          a PIN only you know (6 or more digits). If not set, STUDIO_PIN (Voice Studio) is used.
//   TEXT_DAILY_CAP     optional, text requests per day (default 300)
//   IMAGE_DAILY_CAP    optional, pictures per day (default 30). Pictures cost money, so keep this small.
//   TEXT_MODEL         optional (default gemini-3.5-flash, falls back to gemini-2.5-flash)
//   IMAGE_MODEL        optional (default gemini-3.1-flash-image, falls back to gemini-2.5-flash-image)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are added by Supabase automatically.
// Deploy with "Verify JWT" switched OFF (the PIN is the lock).
//
// Privacy: no names, no voices, no pupil data are sent. Only the teacher's typed words or a picture of what was
// written on the board. Nothing is stored here except a daily counter.

const ALLOWED_ORIGINS = [
  'https://maysaaaam-rgb.github.io',
  'http://localhost:8137', 'http://localhost:8098', 'http://127.0.0.1:8137', 'http://localhost:8766'
];
const MAX_BODY = 3_000_000;
const GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models/';

type Env = (key: string) => string | undefined;
type Json = Record<string, unknown>;
let fails = 0, lockedUntil = 0;

const CLASSROOM = [
  'You help an English teacher in Bursa, Türkiye, on a classroom smartboard.',
  'The learners are 8 and 9 years old (Grade 3 and 4), level Pre-A1 to A1. Their first language is Turkish.',
  'Use very simple, common English words and short sentences (CEFR Pre-A1/A1). Be warm, kind and encouraging.',
  'Everything must be safe and happy for young children: no violence, no scary, sad or adult topics, no brands, no real people.',
  'If a request does not suit a primary classroom, quietly answer with a gentle, safe classroom alternative instead.',
  'Never ask for or include personal information.'
].join(' ');

const S = (type: string, extra: Json = {}): Json => ({ type, ...extra });
const ARR = (items: Json, extra: Json = {}): Json => ({ type: 'ARRAY', items, ...extra });
const OBJ = (props: Record<string, Json>, required: string[]): Json => ({ type: 'OBJECT', properties: props, required });

// One entry per board command: what to ask, and the exact JSON shape that must come back.
const TASKS: Record<string, { max: number; prompt: (t: string, n: number) => string; schema: Json; temp?: number }> = {
  word: {
    max: 40,
    prompt: (t) => `Make a word card for the English word or short phrase "${t}". If it is misspelled, use the correct spelling. ` +
      'Give: the word, its syllables split with a middle dot (e.g. el·e·phant), the part of speech in one easy word (noun, verb, adjective...), ' +
      'one very easy example sentence (max 8 words) that uses the word, the Turkish meaning, and one emoji that fits.',
    schema: OBJ({ word: S('STRING'), syllables: S('STRING'), partOfSpeech: S('STRING'), sentence: S('STRING'), turkish: S('STRING'), emoji: S('STRING') },
      ['word', 'syllables', 'partOfSpeech', 'sentence', 'turkish', 'emoji'])
  },
  sentences: {
    max: 300,
    prompt: (t, n) => `Write ${n} different very easy example sentences (max 8 words each) for young learners about or using: "${t}". ` +
      'Use present simple where possible. Also give the key word or pattern being practised.',
    schema: OBJ({ focus: S('STRING'), sentences: ARR(S('STRING'), { minItems: 1, maxItems: 6 }) }, ['focus', 'sentences'])
  },
  quiz: {
    max: 300,
    prompt: (t, n) => `Make ${n} quick multiple-choice questions for a whole-class smartboard quiz about: "${t}". ` +
      'Each question is short (max 9 words) with exactly 3 short options and one correct answer copied exactly from the options. Add one fitting emoji per question.',
    schema: OBJ({
      topic: S('STRING'),
      questions: ARR(OBJ({ q: S('STRING'), options: ARR(S('STRING'), { minItems: 3, maxItems: 3 }), answer: S('STRING'), emoji: S('STRING') },
        ['q', 'options', 'answer', 'emoji']), { minItems: 1, maxItems: 8 })
    }, ['topic', 'questions']),
    temp: 0.7
  },
  story: {
    max: 120,
    prompt: (t) => `Write a tiny, cheerful story for young learners about: "${t}". 4 to 6 sentences, max 9 words each, present simple, ` +
      'with a happy ending. Give a short title and 3 to 5 key words from the story.',
    schema: OBJ({ title: S('STRING'), sentences: ARR(S('STRING'), { minItems: 3, maxItems: 7 }), keywords: ARR(S('STRING'), { minItems: 1, maxItems: 6 }) },
      ['title', 'sentences', 'keywords']),
    temp: 0.9
  },
  tr: {
    max: 200,
    prompt: (t) => `Translate this for an English class. If it is Turkish, translate to simple English. If it is English, translate to Turkish. ` +
      `Text: "${t}". Say which language it was in ("Turkish" or "English").`,
    schema: OBJ({ from: S('STRING'), to: S('STRING'), translation: S('STRING') }, ['from', 'to', 'translation']),
    temp: 0.2
  },
  check: {
    max: 200,
    prompt: (t) => `A young learner wrote this English: "${t}". Correct spelling, capital letters, punctuation and grammar, ` +
      'changing as little as possible. Say if it was already correct. Give one short, kind tip (max 12 words) about the most important change, ' +
      'or a short praise if it was correct. List each change as "wrong → right".',
    schema: OBJ({ ok: S('BOOLEAN'), corrected: S('STRING'), tip: S('STRING'), changes: ARR(S('STRING'), { maxItems: 6 }) },
      ['ok', 'corrected', 'tip', 'changes']),
    temp: 0.1
  },
  ask: {
    max: 200,
    prompt: (t) => `The teacher asks (answer so the whole class can understand, max 3 short sentences, simple English): "${t}"`,
    schema: OBJ({ answer: S('STRING'), emoji: S('STRING') }, ['answer', 'emoji']),
    temp: 0.5
  }
};

function neatPrompt(hints: string[]): string {
  return 'This picture is ENGLISH handwriting (or a drawing) written with a finger or pen on a classroom smartboard, by a teacher or an 8-10 year old English learner. ' +
    'The strokes can be wobbly, big and joined. Read it letter by letter. ' +
    (hints.length ? `Words from this week's lesson are likely: ${hints.join(', ')}. Prefer one of these ONLY if the letter shapes really fit; never invent words that are not written. ` : '') +
    'If it is writing: put exactly what is written in "read" (keep the child\'s spelling), and the correct English spelling, capital letters and punctuation in "corrected" ' +
    '(only fix real mistakes; do not add words), split into the same lines as written. ' +
    'Set changed=true only if "corrected" differs from what was written (ignore letter size). Give one short kind tip (max 10 words) if changed. ' +
    'Set sure=false if ANY letter is doubtful, and give up to 3 other likely readings in "alternatives". ' +
    'If it is a drawing and not words, set kind="drawing" and guess what it shows in 1 to 3 simple English words in drawingGuess. ' +
    'If you cannot read it, set kind="unclear".';
}
const NEAT_SCHEMA = OBJ({
  kind: S('STRING', { enum: ['text', 'drawing', 'unclear'] }),
  read: S('STRING'),
  corrected: S('STRING'),
  lines: ARR(S('STRING'), { maxItems: 6 }),
  changed: S('BOOLEAN'),
  sure: S('BOOLEAN'),
  alternatives: ARR(S('STRING'), { maxItems: 3 }),
  tip: S('STRING'),
  drawingGuess: S('STRING')
}, ['kind', 'read', 'corrected', 'lines', 'changed', 'sure', 'alternatives', 'tip', 'drawingGuess']);

const PICTURE_STYLE =
  'Style: bright, glossy 3D cartoon like a modern children\'s picture book, soft rounded shapes, friendly big eyes if it is a living thing, ' +
  'gentle lighting, one clear subject in the centre and fully visible, plain soft pastel background, ' +
  'NO text, NO letters, NO numbers, NO words, NO watermark, NO frame. Happy and safe for 8-year-old children.';

function cors(req: Request): Record<string, string> {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-board-pin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin'
  };
}
function json(req: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(req), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
function same(a: string, b: string): boolean { // constant-time compare
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}
function today(): string { return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' }); }
function clean(s: unknown, max: number): string {
  return String(s ?? '').replace(/[\u0000-\u001f"\\`]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
function isB64Image(s: unknown): s is string {
  return typeof s === 'string' && s.length > 100 && s.length < MAX_BODY && /^[A-Za-z0-9+/=]+$/.test(s.slice(0, 200));
}

async function usage(env: Env, doFetch: typeof fetch): Promise<{ text: number; image: number; ok: boolean }> {
  const url = env('SUPABASE_URL'), key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return { text: 0, image: 0, ok: false };
  try {
    const r = await doFetch(`${url}/rest/v1/ai_usage?day=eq.${today()}&select=kind,n`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return { text: 0, image: 0, ok: false };
    const rows = (await r.json()) as { kind: string; n: number }[];
    const get = (k: string) => Number((rows.find((x) => x.kind === k) || { n: 0 }).n) || 0;
    return { text: get('text'), image: get('image'), ok: true };
  } catch { return { text: 0, image: 0, ok: false }; }
}
async function addUsage(env: Env, doFetch: typeof fetch, kind: string, n: number): Promise<void> {
  const url = env('SUPABASE_URL'), key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return;
  try {
    await doFetch(`${url}/rest/v1/ai_usage?on_conflict=day,kind`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ day: today(), kind, n })
    });
  } catch { /* the request already worked; the counter is best effort */ }
}

// Calls Gemini; if the chosen model does not exist (renamed or retired), tries the fallback model once.
// waitMs: give each model only this long, then try the next one (a busy model must not keep the board waiting).
async function gemini(env: Env, doFetch: typeof fetch, models: string[], body: (model: string) => Json, waitMs = 20000):
  Promise<{ ok: true; data: any } | { ok: false; status: number; error: string; message: string }> {
  const key = env('GEMINI_API_KEY') || '';
  let last = { ok: false as const, status: 502, error: 'upstream', message: 'The AI did not answer.' };
  for (const model of models) {
    let r: Response;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), waitMs);
    try {
      r = await doFetch(`${GEMINI}${encodeURIComponent(model)}:generateContent`, {
        method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body(model)), signal: ctrl.signal
      });
    } catch (e) {
      clearTimeout(timer);
      console.error('gemini', model, ctrl.signal.aborted ? 'too slow' : 'network', String(e).slice(0, 120));
      last = { ok: false, status: 504, error: 'slow', message: 'The AI is slow right now. Try again.' };
      continue;
    }
    clearTimeout(timer);
    if (r.ok) return { ok: true, data: await r.json() };
    const t = (await r.text()).slice(0, 600);
    console.error('gemini', model, r.status, t.slice(0, 200));
    const missingModel = r.status === 404 || (r.status === 400 && /not found|not supported|unknown model|is not available/i.test(t));
    if (missingModel) { last = { ok: false, status: 502, error: 'model', message: `The AI model "${model}" is not available.` }; continue; }
    if (r.status >= 500) { last = { ok: false, status: 502, error: 'busy', message: 'The AI is busy. Try again in a minute.' }; continue; }
    if (r.status === 400 && /api key/i.test(t)) return { ok: false, status: 502, error: 'bad_key', message: 'The Gemini key was not accepted. Check GEMINI_API_KEY.' };
    if (r.status === 401 || r.status === 403) {
      const billing = /billing|free tier|not available in your|paid/i.test(t);
      return { ok: false, status: 502, error: billing ? 'billing' : 'bad_key',
        message: billing ? 'Pictures need billing switched on in Google AI Studio.' : 'The Gemini key was not accepted. Check GEMINI_API_KEY.' };
    }
    if (r.status === 429) {
      const billing = /free tier|limit: 0|billing/i.test(t);
      if (!billing) { last = { ok: false, status: 429, error: 'busy', message: 'The AI is busy. Try again in a minute.' }; continue; }
      return { ok: false, status: 429, error: 'billing', message: 'Pictures need billing switched on in Google AI Studio.' };
    }
    return { ok: false, status: 502, error: 'upstream', message: `The AI could not answer (${r.status}).` };
  }
  return last;
}
function blocked(data: any): boolean {
  const c = data && data.candidates && data.candidates[0];
  return !!((data && data.promptFeedback && data.promptFeedback.blockReason) || (c && /SAFETY|PROHIBITED|BLOCK|IMAGE_SAFETY/i.test(String(c.finishReason || ''))));
}
function partsOf(data: any): any[] { return (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || []; }
function parseJson(data: any): Json | null {
  const text = partsOf(data).filter((p: any) => !p.thought).map((p: any) => p.text || '').join('').trim();
  if (!text) return null;
  try { return JSON.parse(text); } catch { /* fall through */ }
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* ignore */ } }
  return null;
}

export async function handle(req: Request, env: Env, doFetch: typeof fetch = fetch): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
  const pin = env('BOARD_PIN') || env('STUDIO_PIN') || '', key = env('GEMINI_API_KEY') || '';
  const textCap = Number(env('TEXT_DAILY_CAP')) || 300, imageCap = Number(env('IMAGE_DAILY_CAP')) || 30;
  const missing: string[] = [];
  if (!key) missing.push('GEMINI_API_KEY');
  if (pin.length < 4) missing.push('BOARD_PIN');
  const u = await usage(env, doFetch);
  if (!u.ok) missing.push('ai_usage table');
  const left = () => ({ text: Math.max(0, textCap - u.text), image: Math.max(0, imageCap - u.image) });

  const isStatus = req.method === 'GET' || new URL(req.url).searchParams.get('action') === 'status';
  if (isStatus && !req.headers.get('x-board-pin')) return json(req, 200, { ready: missing.length === 0, missing });
  if (missing.length) return json(req, 503, { error: 'not_set_up', message: 'The Smart Board AI is not set up yet.', missing });

  if (Date.now() < lockedUntil) return json(req, 429, { error: 'locked', message: 'Too many wrong PINs. Wait a minute.' });
  if (!same(req.headers.get('x-board-pin') || '', pin)) {
    if (++fails >= 8) { lockedUntil = Date.now() + 60_000; fails = 0; }
    return json(req, 401, { error: 'bad_pin', message: 'Wrong PIN.' });
  }
  fails = 0;
  if (isStatus) return json(req, 200, { ready: true, missing: [], used: { text: u.text, image: u.image }, caps: { text: textCap, image: imageCap }, left: left() });
  if (req.method !== 'POST') return json(req, 405, { error: 'method', message: 'Use POST.' });

  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) return json(req, 413, { error: 'too_big', message: 'That is too big to send.' });
  let body: Json;
  try { body = await req.json(); } catch { return json(req, 400, { error: 'bad_json', message: 'Bad request.' }); }
  const task = String(body.task || '');
  // gemini-2.5-flash is closed to new keys, so the back-ups are the always-current flash and flash-lite aliases.
  const textModels = [env('TEXT_MODEL') || 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];
  const imageModels = [env('IMAGE_MODEL') || 'gemini-3.1-flash-image', 'gemini-2.5-flash-image'];

  // ---------- Picture (from words, or from a sketch on the board) ----------
  if (task === 'draw') {
    if (u.image >= imageCap) return json(req, 429, { error: 'daily_cap', message: `Today's ${imageCap} pictures are used up. More tomorrow!`, left: left() });
    const subject = clean(body.subject, 80);
    if (!subject) return json(req, 400, { error: 'empty', message: 'Say what to draw, for example /draw bird.' });
    const sketch = isB64Image(body.sketch) ? body.sketch : '';
    const prompt = sketch
      ? `Turn this whiteboard sketch into a finished picture of: ${subject}. Keep the same idea, pose and layout as the sketch. ${PICTURE_STYLE}`
      : `A picture of: ${subject}. Make it cute and friendly for a children's English lesson. ${PICTURE_STYLE}`;
    const res = await gemini(env, doFetch, imageModels, (model) => ({
      contents: [{ role: 'user', parts: sketch ? [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: sketch } }] : [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: /^gemini-2\./.test(model) ? { aspectRatio: '1:1' } : { aspectRatio: '1:1', imageSize: '1K' }
      }
    }));
    if (!res.ok) return json(req, res.status, { error: res.error, message: res.message, left: left() });
    if (blocked(res.data)) return json(req, 422, { error: 'blocked', message: 'Let\'s draw something else! 🙂', left: left() });
    const img = partsOf(res.data).find((p: any) => p.inlineData && p.inlineData.data);
    if (!img) return json(req, 502, { error: 'no_image', message: 'The AI did not make a picture. Try other words.', left: left() });
    u.image += 1;
    await addUsage(env, doFetch, 'image', u.image);
    return json(req, 200, { ok: true, task, data: { image: img.inlineData.data, mime: img.inlineData.mimeType || 'image/png', subject }, left: left() });
  }

  // ---------- Everything else is a text request ----------
  if (u.text >= textCap) return json(req, 429, { error: 'daily_cap', message: `Today's ${textCap} AI requests are used up. More tomorrow!`, left: left() });

  let contents: Json[], schema: Json, temp = 0.4;
  if (task === 'neat') {
    if (!isB64Image(body.image)) return json(req, 400, { error: 'no_image', message: 'Nothing to read.' });
    const hints = (Array.isArray(body.hintWords) ? body.hintWords : []).slice(0, 40).map((w) => clean(w, 30)).filter(Boolean);
    contents = [{ role: 'user', parts: [{ text: neatPrompt(hints) }, { inlineData: { mimeType: 'image/png', data: body.image } }] }];
    schema = NEAT_SCHEMA; temp = 0;
  } else if (TASKS[task]) {
    const t = TASKS[task], text = clean(body.text, t.max);
    if (!text) return json(req, 400, { error: 'empty', message: 'Type something after the command.' });
    const n = Math.min(8, Math.max(1, Number(body.n) || (task === 'quiz' ? 5 : 3)));
    contents = [{ role: 'user', parts: [{ text: t.prompt(text, n) }] }];
    schema = t.schema; temp = t.temp ?? 0.4;
  } else {
    return json(req, 400, { error: 'bad_task', message: 'Unknown command.' });
  }

  // Handwriting must feel instant: the main model gets 6 s, then the fast lite model takes over.
  const models = task === 'neat' ? [textModels[0], 'gemini-flash-lite-latest'] : textModels;
  const res = await gemini(env, doFetch, models, () => ({
    systemInstruction: { parts: [{ text: CLASSROOM }] },
    contents,
    generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: temp, maxOutputTokens: 4096 }
  }), task === 'neat' ? 6000 : 12000);
  if (!res.ok) return json(req, res.status, { error: res.error, message: res.message, left: left() });
  if (blocked(res.data)) return json(req, 422, { error: 'blocked', message: 'Let\'s try something else! 🙂', left: left() });
  const data = parseJson(res.data);
  if (!data) return json(req, 502, { error: 'bad_answer', message: 'The AI answer was not clear. Try again.', left: left() });
  if (task === 'neat') (data as Json).src = 'gemini';
  u.text += 1;
  await addUsage(env, doFetch, 'text', u.text);
  return json(req, 200, { ok: true, task, data, left: left() });
}

// @ts-ignore: Deno exists on Supabase, not in the local test
if (typeof Deno !== 'undefined') Deno.serve((req: Request) => handle(req, (k: string) => Deno.env.get(k)));
