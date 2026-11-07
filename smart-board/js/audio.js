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
