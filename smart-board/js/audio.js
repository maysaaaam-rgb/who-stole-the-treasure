/* Smart Board sounds and voice.
   Every sound is a small chord (two oscillators with a soft envelope), never a raw beep.
   Audio and speech start only after the first tap or key press. */
(function (root) {
  'use strict';

  const SBAudio = {
    ctx: null,
    muted: false,
    voice: null,
    speakOn: true,

    init() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch (e) { this.ctx = null; }
      this.pickVoice();
      if (root.speechSynthesis && 'onvoiceschanged' in root.speechSynthesis) {
        root.speechSynthesis.onvoiceschanged = () => this.pickVoice();
      }
    },

    note(freq, start, dur, type, gain) {
      const c = this.ctx; if (!c || this.muted) return;
      const t0 = c.currentTime + start;
      [0, 3].forEach((detune, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = i === 0 ? (type || 'sine') : 'triangle';
        o.frequency.value = freq; o.detune.value = detune;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime((gain || 0.16) / (i + 1), t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(c.destination);
        o.start(t0); o.stop(t0 + dur + 0.05);
      });
    },

    chord(freqs, gap, dur, type, gain) {
      this.init();
      freqs.forEach((f, i) => this.note(f, i * (gap || 0), dur || 0.35, type, gain));
    },

    correct() { this.chord([523.25, 659.25, 783.99, 1046.5], 0.08, 0.45, 'sine', 0.15); },
    softFail() { this.chord([246.94, 220], 0.16, 0.45, 'sine', 0.13); },
    sparkle() { this.chord([1046.5, 1318.5, 1568, 2093], 0.045, 0.3, 'sine', 0.07); },
    pop() { this.chord([659.25, 987.77], 0.03, 0.18, 'triangle', 0.1); },
    tick() { this.chord([1318.5, 1975.5], 0, 0.06, 'sine', 0.05); },
    chime() { this.chord([1200, 1850, 2400], 0.12, 1.6, 'sine', 0.09); },
    fanfare() { this.chord([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.11, 0.6, 'triangle', 0.13); },

    clack() { this.chord([196, 293.66], 0.025, 0.12, 'triangle', 0.11); },

    /* Board sounds made from filtered noise (no recordings): the felt duster's soft swish and the
       light scratch of chalk. Each is a quiet loop whose volume follows how fast the hand moves. */
    loops: {},
    noise() {
      if (this._noise) return this._noise;
      const c = this.ctx, n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      let brown = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        brown = (brown + 0.02 * w) / 1.02;
        d[i] = w * 0.55 + brown * 2.6;
      }
      this._noise = b;
      return b;
    },
    loop(name) {
      if (this.loops[name]) return this.loops[name];
      const c = this.ctx, src = c.createBufferSource(), g = c.createGain();
      src.buffer = this.noise(); src.loop = true;
      src.playbackRate.value = name === 'chalk' ? 1.6 : 0.9;
      let node = src;
      const filters = name === 'chalk'
        ? [['highpass', 2200, 0.7], ['bandpass', 3600, 2.2]]
        : [['lowpass', 2600, 0.6], ['bandpass', 950, 0.6]];
      filters.forEach(([type, f, q]) => { const bq = c.createBiquadFilter(); bq.type = type; bq.frequency.value = f; bq.Q.value = q; node.connect(bq); node = bq; });
      g.gain.value = 0.0001;
      node.connect(g); g.connect(c.destination);
      src.start();
      const L = { src, g, stop: null };
      this.loops[name] = L;
      return L;
    },
    level(name, v) {
      this.init();
      const c = this.ctx;
      if (!c || this.muted) return;
      const L = this.loop(name);
      clearTimeout(L.stop);
      L.g.gain.setTargetAtTime(Math.max(0.0001, v), c.currentTime, 0.03);
      L.stop = setTimeout(() => this.quiet(name), 160); // the hand stopped moving
    },
    quiet(name) {
      const L = this.loops[name], c = this.ctx;
      if (!L || !c) return;
      clearTimeout(L.stop);
      L.g.gain.setTargetAtTime(0.0001, c.currentTime, 0.05);
      L.stop = setTimeout(() => { try { L.src.stop(); } catch (e) { /* already stopped */ } delete this.loops[name]; }, 600);
    },
    wipe(v) { this.level('wipe', 0.05 + v * 0.2); },
    chalk(v) { if (v > 0.05) this.level('chalk', v * 0.045 * (0.7 + Math.random() * 0.6)); },

    pickVoice() {
      const s = root.speechSynthesis; if (!s) return;
      const vs = s.getVoices().filter((v) => /^en[-_]US/i.test(v.lang));
      const pref = ['Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Samantha', 'Microsoft Ava', 'Microsoft Zira'];
      this.voice = pref.map((p) => vs.find((v) => v.name.indexOf(p) === 0)).find(Boolean) || vs[0] || null;
    },

    speak(text, opts) {
      const s = root.speechSynthesis;
      if (!s || !text || this.muted) return;
      this.init();
      try {
        s.cancel();
        const u = new SpeechSynthesisUtterance(String(text).replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, ''));
        u.lang = 'en-US'; u.rate = (opts && opts.rate) || 0.88; u.pitch = 1.05;
        if (this.voice) u.voice = this.voice;
        if (opts && opts.onend) u.onend = opts.onend;
        s.speak(u);
      } catch (e) { /* speech is a bonus, never a blocker */ }
    },

    stopSpeaking() { try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  };

  ['pointerdown', 'keydown'].forEach((ev) => root.addEventListener(ev, function once() {
    SBAudio.init();
    root.removeEventListener(ev, once, true);
  }, true));

  root.SBAudio = SBAudio;
})(window);
