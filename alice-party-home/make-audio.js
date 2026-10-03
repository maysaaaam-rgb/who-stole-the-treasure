#!/usr/bin/env node
/**
 * Generates natural-voice MP3 recordings for every line the Tea Party homework can speak.
 * Files are written to ./audio/<hash>.mp3 and ./audio/manifest.json (read by js/voice.js).
 * Nothing is sent anywhere unless you run a provider; --dry only counts.
 *
 * Usage (run from this folder; keys are read from environment variables, never saved in files):
 *
 *   node make-audio.js --dry                       # count clips + characters, no network
 *   AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=uksouth node make-audio.js azure
 *   ELEVEN_API_KEY=... ELEVEN_VOICE_ID=... node make-audio.js elevenlabs
 *
 * Options:  --force (re-make existing files)   --voice en-GB-LibbyNeural (azure)   --rate -12% (azure speed)
 */
'use strict';
const fs = require('fs'), path = require('path');

// ---- load the homework data (same file the web pages use) ----
global.window = {};
new Function('window', fs.readFileSync(path.join(__dirname, 'party-data.js'), 'utf8'))(global.window);
const P = global.window.PARTY;

// ---- same hash as js/voice.js (FNV-1a 32-bit of trimmed text) ----
function hash(text) {
  const s = String(text).trim(); let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; }
  return ('00000000' + h.toString(16)).slice(-8);
}

// ---- every text the app can speak ----
const texts = new Set();
Object.values(P.roles).forEach(r => {
  r.sentences.forEach(t => texts.add(t));
  r.words.forEach(w => texts.add(w[0]));
  texts.add('Well done! You win the ' + r.short + ' card!');
});
Object.values(P.dialogues).forEach(d => d.forEach(l => texts.add(l[1])));
const list = [...texts].map(t => ({ text: t, h: hash(t) }));
const dup = list.length - new Set(list.map(x => x.h)).size;
if (dup) { console.error('Hash collision detected - stop and tell the developer.'); process.exit(1); }

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const provider = args.find(a => !a.startsWith('--') && ['azure', 'elevenlabs'].includes(a));
const outDir = path.join(__dirname, 'audio');
const chars = list.reduce((n, x) => n + x.text.length, 0);

console.log(list.length + ' clips, ' + chars + ' characters in total.');
if (flag('--dry') || !provider) {
  if (!provider) console.log('No provider given: nothing generated. Use "azure" or "elevenlabs" (see the header of this file).');
  process.exit(0);
}
fs.mkdirSync(outDir, { recursive: true });

async function azure(text) {
  const key = process.env.AZURE_SPEECH_KEY, region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION');
  const voice = opt('--voice', 'en-GB-SoniaNeural'), rate = opt('--rate', '-12%');
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ssml = `<speak version="1.0" xml:lang="en-GB" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="${voice}"><prosody rate="${rate}">${esc}</prosody></voice></speak>`;
  const r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'eaa-make-audio' },
    body: ssml
  });
  if (!r.ok) throw new Error('Azure ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return Buffer.from(await r.arrayBuffer());
}

async function elevenlabs(text) {
  const key = process.env.ELEVEN_API_KEY, voice = process.env.ELEVEN_VOICE_ID;
  if (!key || !voice) throw new Error('Set ELEVEN_API_KEY and ELEVEN_VOICE_ID (pick a British female voice in ElevenLabs)');
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.6, similarity_boost: 0.75, speed: 0.9 } })
  });
  if (!r.ok) throw new Error('ElevenLabs ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  const synth = provider === 'azure' ? azure : elevenlabs;
  let made = 0, skipped = 0;
  for (const x of list) {
    const file = path.join(outDir, x.h + '.mp3');
    if (!flag('--force') && fs.existsSync(file) && fs.statSync(file).size > 500) { skipped++; continue; }
    const buf = await synth(x.text);
    fs.writeFileSync(file, buf); made++;
    process.stdout.write('\r' + (made + skipped) + '/' + list.length + '  ');
    await new Promise(r => setTimeout(r, 120));
  }
  const files = list.map(x => x.h).filter(h => fs.existsSync(path.join(outDir, h + '.mp3')));
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ voice: provider, files }, null, 0));
  console.log('\nDone. Made ' + made + ', kept ' + skipped + '. manifest.json lists ' + files.length + ' clips.');
})().catch(e => { console.error('\nFAILED: ' + e.message); process.exit(1); });
