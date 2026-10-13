#!/usr/bin/env node
/**
 * Generates the Tea Party voice clips with Gemini text-to-speech (British female teacher voice).
 * Writes one 24 kHz WAV per line of text: <outDir>/<hash>.wav  (same hash as js/voice.js and make-audio.js).
 * Safe to stop and re-run: clips that already exist are skipped.
 *
 *   GEMINI_API_KEY=... node make-audio-gemini.js <outDir> [--voice Kore] [--limit N]
 *
 * The API key is read from the environment only. It is never written to any file.
 */
'use strict';
const fs = require('fs'), path = require('path');

const key = process.env.GEMINI_API_KEY;
if (!key) { console.error('Set GEMINI_API_KEY first.'); process.exit(1); }

const args = process.argv.slice(2);
const outDir = args.find(a => !a.startsWith('--')) || path.join(__dirname, 'audio-src');
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const voice = opt('--voice', 'Kore');
const limit = parseInt(opt('--limit', '0'), 10) || 0;
const model = opt('--model', 'gemini-2.5-flash-preview-tts');
fs.mkdirSync(outDir, { recursive: true });

global.window = {};
new Function('window', fs.readFileSync(path.join(__dirname, 'party-data.js'), 'utf8'))(global.window);
const P = global.window.PARTY;

function hash(text) {
  const s = String(text).trim(); let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; }
  return ('00000000' + h.toString(16)).slice(-8);
}

const texts = new Set();
Object.values(P.roles).forEach(r => {
  r.sentences.forEach(t => texts.add(t));
  r.words.forEach(w => texts.add(w[0]));
  texts.add('Well done! You win the ' + r.short + ' card!');
});
Object.values(P.dialogues).forEach(d => d.forEach(l => texts.add(l[1])));
let list = [...texts].map(t => ({ text: t, h: hash(t) }));
list.sort((a, b) => (a.text.split(' ').length === 1) - (b.text.split(' ').length === 1));   // single words last (they are the fussiest)
if (limit) list = list.slice(0, limit);

const STYLE = 'Speak in a warm, clear, friendly British English accent (southern England), as a kind female primary-school English teacher speaking slowly and clearly to young learners: ';

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Free tier = 3 requests per minute, so keep at least 21 s between requests.
const MIN_GAP_MS = parseInt(opt('--gap', '21000'), 10);
let lastCall = 0;
async function pace() { const wait = lastCall + MIN_GAP_MS - Date.now(); if (wait > 0) await sleep(wait); lastCall = Date.now(); }
// Very short texts sometimes come back with no audio; retry them with slightly different wording.
function variants(text) {
  const t = text.trim();
  const withStop = /[.!?]$/.test(t) ? t : t + '.';
  return [STYLE + t, STYLE + withStop, STYLE + '"' + t + '"'];
}

async function synth(text) {
  const vs = variants(text);
  for (let attempt = 1; attempt <= 8; attempt++) {
    await pace();
    const prompt = vs[(attempt - 1) % vs.length];
    let j;
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
        })
      });
      j = await r.json();
    } catch (e) { await sleep(3000 * attempt); continue; }
    if (j.error) {
      const retry = /retry in ([\d.]+)s/i.exec(j.error.message || '');
      if (j.error.code === 429 || j.error.code >= 500) {
        if (/PerDay/i.test(JSON.stringify(j.error))) throw new Error('DAILY QUOTA REACHED - run again tomorrow (finished clips are kept)');
        await sleep((retry ? parseFloat(retry[1]) * 1000 + 1500 : 8000 * attempt)); continue;
      }
      throw new Error(j.error.code + ' ' + (j.error.message || '').slice(0, 160));
    }
    const part = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts.find(p => p.inlineData);
    if (part) return Buffer.from(part.inlineData.data, 'base64');
    // no audio this time: try the next wording
  }
  throw new Error('gave up on: ' + text);
}

(async () => {
  console.log(list.length + ' clips, voice ' + voice + ', output ' + outDir);
  let made = 0, kept = 0, failed = [];
  for (const x of list) {
    const file = path.join(outDir, x.h + '.wav');
    if (fs.existsSync(file) && fs.statSync(file).size > 2000) { kept++; continue; }
    try {
      const pcm = await synth(x.text);
      fs.writeFileSync(file, wav(pcm)); made++;
    } catch (e) {
      failed.push(x.text + ' -> ' + e.message);
      if (/DAILY QUOTA/.test(e.message)) { console.log(e.message); break; }
    }
    console.log((made + kept + failed.length) + '/' + list.length + ' made ' + made + ' failed ' + failed.length + '  [' + x.text.slice(0, 40) + ']');
  }
  console.log('DONE. made ' + made + ', already had ' + kept + ', failed ' + failed.length);
  failed.forEach(f => console.log('  FAILED: ' + f));
  fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify(list.map(x => ({ h: x.h, text: x.text })), null, 0));
})();
