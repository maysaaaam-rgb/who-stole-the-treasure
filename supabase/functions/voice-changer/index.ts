// Voice Changer (Studio) for the teacher toolkit.
// The browser sends a short recording of the TEACHER's voice and a character name; this function sends it to
// ElevenLabs "Speech to Speech" and returns the same words in the character's voice (MP3).
//
// Secrets (Supabase dashboard > Edge Functions > Secrets). The ElevenLabs key is only ever stored there:
//   ELEVENLABS_API_KEY   your ElevenLabs key
//   STUDIO_PIN           a PIN only you know (6 or more digits). Without it nobody can use your credits.
//   DAILY_CAP            optional, how many transformations per day (default 30)
//   VOICE_OWL, VOICE_DRAGON, VOICE_FAIRY, VOICE_ROBOT, VOICE_WITCH, VOICE_HERO   optional ElevenLabs voice ids
//                        (if not set, a voice is picked by name from the voices in your ElevenLabs account)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are added by Supabase automatically.
// Deploy with "Verify JWT" switched OFF (the PIN is the lock).

const ALLOWED_ORIGINS = ['https://maysaaaam-rgb.github.io', 'http://localhost:8137', 'http://localhost:8098', 'http://127.0.0.1:8137'];
const MAX_BYTES = 2_000_000;      // about 45 seconds of 22 kHz mono WAV; the page records 15 s at most

const CHARACTERS: Record<string, { env: string; names: string[] }> = {
  owl:    { env: 'VOICE_OWL',    names: ['Bill', 'George', 'Daniel'] },
  dragon: { env: 'VOICE_DRAGON', names: ['Callum', 'Clyde', 'Arnold'] },
  fairy:  { env: 'VOICE_FAIRY',  names: ['Gigi', 'Lily', 'Jessie', 'Matilda'] },
  robot:  { env: 'VOICE_ROBOT',  names: ['Brian', 'Adam', 'Antoni'] },
  witch:  { env: 'VOICE_WITCH',  names: ['Glinda', 'Dorothy', 'Nicole'] },
  hero:   { env: 'VOICE_HERO',   names: ['Harry', 'Josh', 'Ethan'] }
};

type Env = (key: string) => string | undefined;
let voiceCache: { at: number; list: any[] } | null = null;
let fails = 0, lockedUntil = 0;

function cors(req: Request): Record<string, string> {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-studio-pin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin'
  };
}
function json(req: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(req), 'Content-Type': 'application/json' } });
}
function same(a: string, b: string): boolean {            // constant-time compare
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}
function today(): string { return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' }); }

async function usage(env: Env, doFetch: typeof fetch): Promise<{ used: number; ok: boolean }> {
  const url = env('SUPABASE_URL'), key = env('SUPABASE_SERVICE_ROLE_KEY'); if (!url || !key) return { used: 0, ok: false };
  try {
    const r = await doFetch(`${url}/rest/v1/voice_usage?day=eq.${today()}&select=n`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return { used: 0, ok: false };
    const rows = await r.json();
    return { used: rows && rows[0] ? Number(rows[0].n) || 0 : 0, ok: true };
  } catch { return { used: 0, ok: false }; }
}
async function addUsage(env: Env, doFetch: typeof fetch, n: number): Promise<void> {
  const url = env('SUPABASE_URL'), key = env('SUPABASE_SERVICE_ROLE_KEY'); if (!url || !key) return;
  try {
    await doFetch(`${url}/rest/v1/voice_usage`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ day: today(), n })
    });
  } catch { /* the call already worked; the counter is best effort */ }
}
async function voices(env: Env, doFetch: typeof fetch): Promise<any[]> {
  if (voiceCache && Date.now() - voiceCache.at < 600_000) return voiceCache.list;
  const r = await doFetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': env('ELEVENLABS_API_KEY') || '' } });
  if (!r.ok) throw new Error('voices ' + r.status);
  const d = await r.json(); voiceCache = { at: Date.now(), list: d.voices || [] };
  return voiceCache.list;
}
async function pick(env: Env, doFetch: typeof fetch, who: string): Promise<{ id: string; name: string } | null> {
  const c = CHARACTERS[who]; if (!c) return null;
  const forced = env(c.env); if (forced) return { id: forced, name: 'your choice' };
  const list = await voices(env, doFetch);
  for (const n of c.names) {
    const v = list.find((x: any) => String(x.name || '').toLowerCase().startsWith(n.toLowerCase()));
    if (v) return { id: v.voice_id, name: String(v.name) };
  }
  const premade = list.filter((x: any) => x.category === 'premade');
  const any = premade[Object.keys(CHARACTERS).indexOf(who) % Math.max(1, premade.length)] || list[0];
  return any ? { id: any.voice_id, name: String(any.name) } : null;
}

export async function handle(req: Request, env: Env, doFetch: typeof fetch = fetch): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
  const url = new URL(req.url), action = url.searchParams.get('action') || 'convert';
  const pin = env('STUDIO_PIN') || '', key = env('ELEVENLABS_API_KEY') || '', cap = Number(env('DAILY_CAP')) || 30;
  const missing: string[] = []; if (!key) missing.push('ELEVENLABS_API_KEY'); if (pin.length < 4) missing.push('STUDIO_PIN');
  const u = await usage(env, doFetch); if (!u.ok) missing.push('voice_usage table');

  if (action === 'status' && !req.headers.get('x-studio-pin')) return json(req, 200, { ready: missing.length === 0, missing });
  if (missing.some((m) => m !== 'voice_usage table')) return json(req, 503, { error: 'not_set_up', message: 'The Studio is not set up yet.', missing });

  if (Date.now() < lockedUntil) return json(req, 429, { error: 'locked', message: 'Too many wrong PINs. Wait a minute.' });
  if (!same(req.headers.get('x-studio-pin') || '', pin)) {
    if (++fails >= 8) { lockedUntil = Date.now() + 60_000; fails = 0; }
    return json(req, 401, { error: 'bad_pin', message: 'Wrong PIN.' });
  }
  fails = 0;

  if (action === 'status') {
    let names: Record<string, string> = {}, credits: unknown = null;
    try { for (const k of Object.keys(CHARACTERS)) { const v = await pick(env, doFetch, k); names[k] = v ? v.name : '?'; } } catch { names = {}; }
    try {
      const s = await doFetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } });
      if (s.ok) { const d = await s.json(); credits = { used: d.character_count, limit: d.character_limit }; }
    } catch { /* optional */ }
    return json(req, 200, { ready: missing.length === 0, missing, used: u.used, cap, left: Math.max(0, cap - u.used), voices: names, credits });
  }

  if (req.method !== 'POST') return json(req, 405, { error: 'method', message: 'Use POST.' });
  if (!u.ok) return json(req, 503, { error: 'not_set_up', message: 'Run the one SQL step (voice_usage table) first.', missing });
  if (u.used >= cap) return json(req, 429, { error: 'daily_cap', message: `Today's limit of ${cap} is used up. It resets tomorrow.` });

  let form: FormData;
  try { form = await req.formData(); } catch { return json(req, 400, { error: 'bad_form', message: 'Send the recording as a form.' }); }
  const who = String(form.get('character') || ''), file = form.get('audio');
  if (!CHARACTERS[who]) return json(req, 400, { error: 'bad_character', message: 'Unknown character.' });
  if (!(file instanceof Blob) || file.size < 2000) return json(req, 400, { error: 'no_audio', message: 'The recording was empty.' });
  if (file.size > MAX_BYTES) return json(req, 413, { error: 'too_big', message: 'The recording is too long. Keep it under 15 seconds.' });

  let voice: { id: string; name: string } | null;
  try { voice = await pick(env, doFetch, who); } catch { return json(req, 502, { error: 'voices', message: 'Could not read your ElevenLabs voices. Check the key.' }); }
  if (!voice) return json(req, 502, { error: 'no_voice', message: 'No voice found in your ElevenLabs account.' });

  const out = new FormData();
  out.append('audio', file, 'voice.wav');
  out.append('model_id', env('STS_MODEL') || 'eleven_multilingual_sts_v2');
  out.append('remove_background_noise', 'true');
  out.append('voice_settings', JSON.stringify({ stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true }));
  let r: Response;
  try { r = await doFetch(`https://api.elevenlabs.io/v1/speech-to-speech/${encodeURIComponent(voice.id)}?output_format=mp3_44100_128`, { method: 'POST', headers: { 'xi-api-key': key }, body: out }); }
  catch { return json(req, 502, { error: 'network', message: 'Could not reach ElevenLabs.' }); }
  if (!r.ok) {
    const t = (await r.text()).slice(0, 300);
    const quota = r.status === 402 || /quota|credit/i.test(t);
    return json(req, quota ? 402 : r.status === 401 ? 502 : 502, { error: quota ? 'credits' : r.status === 401 ? 'bad_key' : 'upstream',
      message: quota ? 'Your ElevenLabs credits are used up.' : r.status === 401 ? 'The ElevenLabs key was not accepted.' : 'ElevenLabs could not change the voice (' + r.status + ').' });
  }
  await addUsage(env, doFetch, u.used + 1);
  return new Response(r.body, { status: 200, headers: { ...cors(req), 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store', 'x-voice-name': voice.name, 'x-left-today': String(Math.max(0, cap - u.used - 1)), 'Access-Control-Expose-Headers': 'x-voice-name, x-left-today' } });
}

// @ts-ignore: Deno exists on Supabase, not in the local test
if (typeof Deno !== 'undefined') Deno.serve((req: Request) => handle(req, (k: string) => Deno.env.get(k)));
