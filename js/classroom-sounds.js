/**
 * English Adventure Academy - Classroom Soundboard Engine v2
 * Pure Native Web Audio API, zero external audio files. Global singleton: window.classSoundboard
 *
 * What is new in v2
 *  - One shared output chain for every sound: master volume (saved) + soft limiter, so nothing is too loud or clips.
 *  - Mute and "Stop all" that really stop sounds already playing.
 *  - 21 classroom sounds in 5 groups (get attention, time and transitions, celebrate, feedback, fun).
 *  - Every sound is built from chords, bell partials, soft noise or filtered pulses (no raw single-frequency beeps).
 *  - Fixes: playCoinReward and playCardFlip were called all over the platform but did not exist.
 */
(function (root) {
  'use strict';

  var PREF_KEY = 'eaa_sfx_v2';

  // The registry drives the dock flyout, the Sound Lab page, the hotkeys and the tests.
  var SOUND_LIST = [
    { key: 'bell', emoji: '🔔', label: 'Attention Bell', group: 'attention', hot: '2', method: 'playAttentionBell', desc: 'Clear desk bell: "eyes on me"' },
    { key: 'listen', emoji: '👂', label: 'Listen Up', group: 'attention', hot: '8', method: 'playListenUp', desc: 'Three rising notes: "listen, please"' },
    { key: 'whistle', emoji: '🛑', label: 'Freeze Whistle', group: 'attention', hot: '9', method: 'playWhistle', desc: 'Soft sports whistle: stop and freeze' },
    { key: 'shhh', emoji: '🤫', label: 'Quiet Bowl', group: 'attention', hot: '3', method: 'playQuietChime', desc: 'Warm singing bowl: calm down' },
    { key: 'tick', emoji: '⏳', label: '10-Second Tick', group: 'time', hot: 't', method: 'playTicking', desc: 'Ticking countdown, then time is up (press again to stop)' },
    { key: 'go', emoji: '🏁', label: '3-2-1 GO!', group: 'time', hot: 'g', method: 'playGo', desc: 'Three pips and a bright GO' },
    { key: 'buzzer', emoji: '⏰', label: "Time's Up", group: 'time', hot: '4', method: 'playCountdownBuzzer', desc: 'Three pips, then a warm low horn and gong' },
    { key: 'cleanup', emoji: '🧹', label: 'Clean-Up Time', group: 'time', hot: 'u', method: 'playCleanUp', desc: 'Happy 4-second tidy-up jingle' },
    { key: 'party', emoji: '🥳', label: 'Party Horn', group: 'celebrate', hot: '1', alt: 'p', method: 'playPartyHorn', desc: 'Party blower with a confetti pop' },
    { key: 'clap', emoji: '👏', label: 'Applause', group: 'celebrate', hot: '5', method: 'playApplause', desc: 'A room full of clapping hands' },
    { key: 'fanfare', emoji: '🎺', label: 'Victory Fanfare', group: 'celebrate', hot: '7', method: 'playFanfare', desc: 'Big warm winner chord' },
    { key: 'levelup', emoji: '⭐', label: 'Level Up', group: 'celebrate', hot: 'l', method: 'playLevelUp', desc: 'Sparkly rising arpeggio' },
    { key: 'tada', emoji: '🥁', label: 'Drumroll + Ta-da', group: 'celebrate', hot: 'd', method: 'playTaDa', desc: 'Drumroll, cymbal, then the reveal' },
    { key: 'pop', emoji: '🎉', label: 'Confetti Pop', group: 'celebrate', hot: 'k', method: 'playConfettiPop', desc: 'Pop and falling sparkles' },
    { key: 'correct', emoji: '✅', label: 'Correct!', group: 'feedback', hot: 'c', method: 'playCorrect', desc: 'Happy rising chord' },
    { key: 'tryagain', emoji: '🔁', label: 'Try Again', group: 'feedback', hot: 'x', method: 'playTryAgain', desc: 'Gentle two-tone chime, never scary' },
    { key: 'coin', emoji: '🪙', label: 'Coin Chime', group: 'feedback', hot: '6', method: 'playCoinChime', desc: 'Two-note coin ding' },
    { key: 'sparkle', emoji: '✨', label: 'Sparkle', group: 'feedback', hot: 's', method: 'playSparkle', desc: 'Magic twinkle' },
    { key: 'whoosh', emoji: '💨', label: 'Whoosh', group: 'fun', hot: 'w', method: 'playWhoosh', desc: 'Swoosh for swaps and changes' },
    { key: 'boing', emoji: '🪀', label: 'Boing', group: 'fun', hot: 'b', method: 'playBoing', desc: 'Silly spring' },
    { key: 'flip', emoji: '🃏', label: 'Card Flip', group: 'fun', hot: 'f', method: 'playCardFlip', desc: 'Card snap' }
  ];
  var GROUPS = { attention: '📣 Get attention', time: '⏱ Time and transitions', celebrate: '🎉 Celebrate', feedback: '✅ Feedback', fun: '🎲 Fun' };

  // Loudness balance (measured offline): each sound is scaled so they all sit within a few dB of each other.
  var LEVELS = { bell: 1, listen: 1.05, whistle: 1, shhh: 0.8, tick: 1.7, go: 0.64, buzzer: 0.66, cleanup: 0.68, party: 2.3, clap: 1.6, fanfare: 0.85, levelup: 1.5, tada: 0.52, pop: 3.3, correct: 1, tryagain: 1, coin: 1.6, sparkle: 3.6, whoosh: 2.8, boing: 2.5, flip: 4.4 };

  function loadPrefs() { try { var p = JSON.parse(root.localStorage.getItem(PREF_KEY) || '{}'); return { volume: typeof p.volume === 'number' ? Math.min(1, Math.max(0, p.volume)) : 0.8, muted: !!p.muted }; } catch (e) { return { volume: 0.8, muted: false }; } }
  function savePrefs(o) { try { root.localStorage.setItem(PREF_KEY, JSON.stringify({ volume: o.volume, muted: o.muted })); } catch (e) { /* storage may be blocked */ } }

  class ClassroomSoundboard {
    constructor() {
      var p = loadPrefs();
      this.ctx = null; this.master = null; this.comp = null; this._noise = null; this._rev = null;
      this.volume = p.volume; this.muted = p.muted;
      this.active = new Set(); this._ticking = false;
      this.initHotkeys();
    }

    /* ---------------- engine core ---------------- */
    init() {
      if (!this.ctx) {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (AC) { this.ctx = new AC(); this._build(); }
      }
      var offline = typeof OfflineAudioContext !== 'undefined' && this.ctx instanceof OfflineAudioContext;
      if (this.ctx && !offline && this.ctx.state === 'suspended') this.ctx.resume();
    }
    _build() {
      var c = this.ctx;
      this.master = c.createGain(); this.master.gain.value = this.muted ? 0 : this.volume;
      var comp = c.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 20; comp.ratio.value = 8; comp.attack.value = 0.003; comp.release.value = 0.2;
      this.master.connect(comp); comp.connect(c.destination); this.comp = comp;
      var len = Math.floor(c.sampleRate * 2), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0), i;
      for (i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this._noise = buf;
    }
    _useContext(ctx) { this.ctx = ctx; this._build(); this.muted = false; this.volume = 1; this.master.gain.value = 1; } // used by the offline test
    _begin(key) {
      this.triggerVisualFeedback(key); this.init();
      this._lvl = LEVELS[key] || 1;
      return !(this.muted || !this.ctx);
    }
    // each sound plays through its own gain node so Stop all can fade it out
    _voice(level, dur) {
      var g = this.ctx.createGain(), self = this; g.gain.value = (level == null ? 1 : level) * (this._lvl || 1); g.connect(this.master); this.active.add(g);
      setTimeout(function () { try { g.disconnect(); } catch (e) { /* ignore */ } self.active.delete(g); }, ((dur || 3) + 0.6) * 1000);
      return g;
    }
    // one soft note: sine plus a quiet triangle layer, attack and exponential decay
    _note(out, f, t, dur, vol, o) {
      o = o || {}; var c = this.ctx, a = o.attack == null ? 0.012 : o.attack, layers = [[o.type || 'sine', 0, 1], [o.type2 || 'triangle', 5, o.mix2 == null ? 0.3 : o.mix2]];
      layers.forEach(function (L) {
        if (!L[2]) return;
        var os = c.createOscillator(), g = c.createGain(), fl = null;
        os.type = L[0]; os.detune.value = L[1]; os.frequency.setValueAtTime(f, t);
        if (o.glideTo) os.frequency.exponentialRampToValueAtTime(o.glideTo, t + dur);
        if (o.lowpass) { fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lowpass; }
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol * L[2], t + a);
        if (o.sustain) g.gain.setValueAtTime(vol * L[2], t + o.sustain);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        if (fl) { os.connect(fl); fl.connect(g); } else os.connect(g);
        g.connect(out); os.start(t); os.stop(t + dur + 0.05);
      });
    }
    // bell: inharmonic partials for a real metal ring
    _bell(out, f, t, vol, decay) {
      var self = this;
      [[1, 1, 1], [2.0, 0.5, 0.75], [2.76, 0.32, 0.6], [5.4, 0.12, 0.35]].forEach(function (p) {
        self._note(out, f * p[0], t, decay * p[2], vol * p[1], { attack: 0.004, type2: 'sine', mix2: 0 });
      });
    }
    // filtered noise burst or sweep
    _noiseBurst(out, t, dur, vol, o) {
      o = o || {}; var c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = this._noise; f.type = o.type || 'lowpass'; f.frequency.setValueAtTime(o.f0 || 1500, t); f.Q.value = o.q || 0.8;
      if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
      var a = o.attack == null ? 0.004 : o.attack;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + a);
      if (o.peakAt) { g.gain.linearRampToValueAtTime(vol, t + o.peakAt); }
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    }
    _reverb() {
      if (this._rev) return this._rev;
      var c = this.ctx, len = Math.floor(c.sampleRate * 0.9), buf = c.createBuffer(2, len, c.sampleRate), ch, i;
      for (ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch); for (i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      var cv = c.createConvolver(); cv.buffer = buf; this._rev = cv; cv.connect(this.master); return cv;
    }

    stopAll() {
      this._ticking = false;
      if (!this.ctx) return;
      var now = this.ctx.currentTime, self = this;
      this.active.forEach(function (g) {
        try { g.gain.cancelScheduledValues(now); g.gain.setTargetAtTime(0, now, 0.03); } catch (e) { /* ignore */ }
        setTimeout(function () { try { g.disconnect(); } catch (e) { /* ignore */ } self.active.delete(g); }, 250);
      });
      this.syncUI();
    }
    setVolume(v) {
      this.volume = Math.min(1, Math.max(0, +v || 0)); savePrefs(this);
      if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
      this.syncUI();
    }
    setMuted(m) {
      this.muted = !!m; savePrefs(this);
      if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
      if (this.muted) this.stopAll(); else this.syncUI();
    }
    toggleMute() { this.setMuted(!this.muted); }
    play(key) { var s = SOUND_LIST.filter(function (x) { return x.key === key; })[0]; if (s && typeof this[s.method] === 'function') this[s.method](); }

    triggerVisualFeedback(soundKey) {
      if (typeof document === 'undefined') return;
      document.querySelectorAll('.sfx-btn[data-sound="' + soundKey + '"], .sfx-flyout-item[data-sound="' + soundKey + '"], .sfx-card[data-sound="' + soundKey + '"]').forEach(function (btn) {
        btn.classList.add('is-active-press'); setTimeout(function () { btn.classList.remove('is-active-press'); }, 180);
      });
    }

    /* ======================= ATTENTION ======================= */
    // 2. Attention bell: desk bell with a metal ring (1200 Hz base, inharmonic partials)
    playAttentionBell() {
      if (!this._begin('bell')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 2.6);
      this._bell(v, 1200, t, 0.3, 2.4);
      this._noiseBurst(v, t, 0.04, 0.08, { type: 'highpass', f0: 4000, q: 0.5 });
    }
    // 8. Listen up: three rising soft notes
    playListenUp() {
      if (!this._begin('listen')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 1.6), self = this;
      [[783.99, 0], [987.77, 0.16], [1174.66, 0.32]].forEach(function (n) { self._note(v, n[0], t + n[1], 0.7, 0.22, { attack: 0.02 }); self._note(v, n[0] * 2, t + n[1], 0.4, 0.05, { type2: 'sine', mix2: 0 }); });
    }
    // 9. Freeze whistle: gentle pea-whistle trill with breath noise
    playWhistle() {
      if (!this._begin('whistle')) return;
      var c = this.ctx, t = c.currentTime + 0.01, v = this._voice(0.55, 1.2);
      var os = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(), lp = c.createBiquadFilter();
      os.type = 'sine'; os.frequency.setValueAtTime(2500, t); os.frequency.linearRampToValueAtTime(2750, t + 0.12); os.frequency.setValueAtTime(2750, t + 0.7);
      lfo.frequency.value = 30; lg.gain.value = 140; lfo.connect(lg); lg.connect(os.frequency);
      lp.type = 'lowpass'; lp.frequency.value = 3800;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.3, t + 0.03); g.gain.setValueAtTime(0.3, t + 0.65); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      os.connect(lp); lp.connect(g); g.connect(v); lfo.start(t); os.start(t); lfo.stop(t + 0.85); os.stop(t + 0.85);
      this._noiseBurst(v, t, 0.78, 0.07, { type: 'bandpass', f0: 3200, q: 2, attack: 0.03 });
    }
    // 3. Quiet bowl: warm singing bowl with slow beating
    playQuietChime() {
      if (!this._begin('shhh')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 4.4), self = this;
      [[432, 0.26, 4.0], [434.6, 0.2, 4.0], [432 * 2.71, 0.07, 2.6], [432 * 5.15, 0.025, 1.6]].forEach(function (p) { self._note(v, p[0], t, p[2], p[1], { attack: 0.22, type2: 'sine', mix2: 0 }); });
    }

    /* ======================= TIME ======================= */
    _tick(v, t, high) {
      this._noiseBurst(v, t, 0.04, 0.32, { type: 'bandpass', f0: high ? 2100 : 1500, q: 7, attack: 0.002 });
      this._note(v, high ? 1000 : 760, t, 0.06, 0.12, { attack: 0.002, type2: 'sine', mix2: 0 });
    }
    _pip(v, t, f, strong) { this._note(v, f, t, 0.22, strong ? 0.2 : 0.15, { attack: 0.008 }); this._note(v, f * 1.5, t, 0.16, strong ? 0.08 : 0.05, { type2: 'sine', mix2: 0 }); }
    // t: 10-second ticking countdown (press again to stop), ends with the time's up sound
    playTicking(seconds) {
      if (this._ticking) { this.stopAll(); return; }
      if (!this._begin('tick')) return;
      var n = seconds || 10, t = this.ctx.currentTime + 0.05, v = this._voice(0.9, n + 4), self = this, i;
      this._ticking = true;
      for (i = 0; i < n; i++) {
        if (i >= n - 3) this._pip(v, t + i, 880, i === n - 1); else this._tick(v, t + i, i % 2 === 0);
      }
      var lv = this._lvl; this._lvl = LEVELS.buzzer; var v2 = this._voice(0.9, 4); this._lvl = lv;
      this._timesUp(v2, t + n);
      setTimeout(function () { self._ticking = false; self.syncUI(); }, (n + 3) * 1000);
      this.syncUI();
    }
    // one wooden tick for countdown timers elsewhere in the platform
    playTick() {
      if (!this._begin('tick')) return;
      this._tickAlt = !this._tickAlt; this._tick(this._voice(0.9, 0.5), this.ctx.currentTime + 0.005, this._tickAlt);
    }
    // 4. Time's up: three soft pips, then a warm low horn and a gong
    _timesUp(v, t0) {
      var self = this;
      [0, 0.24, 0.48].forEach(function (o) { self._pip(v, t0 + o, 880, false); });
      var tb = t0 + 0.72;
      [[140, 'sawtooth', 0.1], [140, 'triangle', 0.22], [70, 'sine', 0.2], [210, 'triangle', 0.08]].forEach(function (p) { self._note(v, p[0], tb, 0.85, p[2], { type: p[1], type2: 'sine', mix2: 0, attack: 0.04, sustain: 0.5, lowpass: 650 }); });
      this._bell(v, 220, tb, 0.18, 2.2);
    }
    playCountdownBuzzer() {
      if (!this._begin('buzzer')) return;
      this._timesUp(this._voice(0.9, 3.4), this.ctx.currentTime + 0.01);
    }
    // g: 3-2-1 GO
    playGo() {
      if (!this._begin('go')) return;
      var t = this.ctx.currentTime + 0.02, v = this._voice(0.9, 2.2), self = this;
      [0, 0.8, 1.6].forEach(function (o) { self._pip(v, t + o, 660, false); });
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, k) { self._note(v, f, t + 2.4, 0.9, 0.17, { attack: 0.015 }); });
    }
    // u: clean-up jingle (about 4 seconds), cheerful C major tune with a bass and a soft shaker
    playCleanUp() {
      if (!this._begin('cleanup')) return;
      var t = this.ctx.currentTime + 0.03, v = this._voice(0.85, 5.2), self = this, q = 0.24;
      var melody = [523.25, 659.25, 783.99, 659.25, 523.25, 392, 440, 523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25];
      melody.forEach(function (f, i) { self._note(v, f, t + i * q, 0.3, 0.18, { attack: 0.008, mix2: 0.45 }); if (i % 4 === 0) self._note(v, f / 2, t + i * q, 0.9, 0.14, { attack: 0.01, type2: 'sine', mix2: 0 }); self._noiseBurst(v, t + i * q + 0.12, 0.06, 0.03, { type: 'bandpass', f0: 7000, q: 0.8, attack: 0.012 }); });
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f) { self._note(v, f, t + 16 * q, 1.0, 0.13, { attack: 0.015 }); });
    }

    /* ======================= CELEBRATE ======================= */
    // 1. Party horn: soft blower (filtered, not harsh) plus a confetti pop
    playPartyHorn() {
      if (!this._begin('party')) return;
      var c = this.ctx, t = c.currentTime + 0.01, v = this._voice(0.8, 1.2);
      this._noiseBurst(v, t, 0.07, 0.35, { type: 'lowpass', f0: 1100, q: 0.7 });
      [[260, 0], [263, 4]].forEach(function (p) {
        var os = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(), lfo = c.createOscillator(), lg = c.createGain();
        os.type = 'sawtooth'; os.detune.value = p[1]; os.frequency.setValueAtTime(p[0], t + 0.05); os.frequency.exponentialRampToValueAtTime(460, t + 0.17); os.frequency.linearRampToValueAtTime(410, t + 0.6);
        lfo.frequency.value = 18; lg.gain.value = 22; lfo.connect(lg); lg.connect(os.frequency);
        lp.type = 'lowpass'; lp.frequency.value = 1700; lp.Q.value = 0.6;
        g.gain.setValueAtTime(0.0001, t + 0.05); g.gain.linearRampToValueAtTime(0.13, t + 0.14); g.gain.setValueAtTime(0.13, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.72);
        os.connect(lp); lp.connect(g); g.connect(v); lfo.start(t + 0.05); os.start(t + 0.05); lfo.stop(t + 0.75); os.stop(t + 0.75);
      });
      this._noiseBurst(v, t + 0.05, 0.6, 0.05, { type: 'bandpass', f0: 2600, q: 1.2, attack: 0.05 });
    }
    // 5. Applause: many separate claps in a room (dense in the middle, fading out)
    playApplause() {
      if (!this._begin('clap')) return;
      var c = this.ctx, t = c.currentTime + 0.02, dur = 3.0, v = this._voice(0.9, dur + 1.2), rv = this._reverb(), i, n = 150, wet = c.createGain();
      wet.gain.value = 0.35; wet.connect(rv); v.connect(wet);
      for (i = 0; i < n; i++) {
        var p = Math.random(), env = Math.sin(Math.PI * Math.pow(p, 0.8)); if (Math.random() > env * 0.95 + 0.05) continue;
        var tt = t + p * dur;
        this._noiseBurst(v, tt, 0.03 + Math.random() * 0.03, 0.12 + Math.random() * 0.3, { type: 'bandpass', f0: 1100 + Math.random() * 1600, q: 1.2 + Math.random() * 1.5, attack: 0.001 });
      }
      this._noiseBurst(v, t, dur, 0.04, { type: 'bandpass', f0: 1400, q: 0.6, attack: 0.6 });
    }
    // 7. Victory fanfare: warm stacked chord
    playFanfare() {
      if (!this._begin('fanfare')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 1.9), self = this;
      [[523.25, 0], [659.25, 0.1], [783.99, 0.2], [1046.5, 0.3]].forEach(function (n, i) {
        var fin = i === 3, d = fin ? 1.4 : 0.55;
        self._note(v, n[0], t + n[1], d, 0.16, { attack: 0.02, type: 'triangle', type2: 'sine', mix2: 0.7, sustain: fin ? 0.5 : 0.15 });
        self._note(v, n[0] / 2, t + n[1], d, 0.07, { attack: 0.03, type2: 'sine', mix2: 0 });
      });
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f) { self._note(v, f, t + 0.3, 1.4, 0.07, { attack: 0.05, type2: 'sine', mix2: 0 }); });
    }
    // l: level up
    playLevelUp() {
      if (!this._begin('levelup')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.85, 1.9), self = this;
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach(function (f, i) { self._note(v, f, t + i * 0.075, 0.5 + i * 0.05, 0.14, { attack: 0.008 }); });
      for (var k = 0; k < 6; k++) this._note(v, 2093 + Math.random() * 1500, t + 0.45 + k * 0.08, 0.28, 0.035, { attack: 0.004, type2: 'sine', mix2: 0 });
    }
    // d: drumroll that builds, a cymbal, then a big "ta-da" chord
    playTaDa() {
      if (!this._begin('tada')) return;
      var t = this.ctx.currentTime + 0.02, v = this._voice(0.9, 4), self = this, roll = 1.5, tt = 0, i = 0;
      while (tt < roll) {
        var prog = tt / roll, gap = 0.07 - 0.04 * prog, vol = 0.1 + 0.22 * prog;
        this._noiseBurst(v, t + tt, 0.05, vol, { type: 'bandpass', f0: 900, q: 0.9, attack: 0.002 });
        this._note(v, 170, t + tt, 0.06, vol * 0.5, { attack: 0.002, type2: 'sine', mix2: 0 });
        tt += gap; i++;
      }
      var tr = t + roll;
      this._noiseBurst(v, tr, 1.6, 0.18, { type: 'highpass', f0: 5000, q: 0.5, attack: 0.003 });
      [523.25, 783.99, 1046.5, 1318.5].forEach(function (f) { self._note(v, f, tr, 1.4, 0.15, { attack: 0.015, type: 'triangle', type2: 'sine', mix2: 0.7 }); });
    }
    // k: confetti pop and falling sparkles
    playConfettiPop() {
      if (!this._begin('pop')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 1.6), self = this;
      this._noiseBurst(v, t, 0.09, 0.4, { type: 'lowpass', f0: 2400, f1: 500, q: 0.7, attack: 0.001 });
      this._note(v, 420, t, 0.12, 0.2, { attack: 0.002, glideTo: 110, type2: 'sine', mix2: 0 });
      var pent = [1046.5, 1174.66, 1318.5, 1567.98, 1760, 2093];
      for (var k = 0; k < 9; k++) self._note(v, pent[Math.floor(Math.random() * pent.length)], t + 0.12 + k * 0.07 + Math.random() * 0.03, 0.4, 0.06, { attack: 0.004, type2: 'sine', mix2: 0 });
    }

    /* ======================= FEEDBACK ======================= */
    // c: correct (C major pentatonic chord, rising)
    playCorrect() {
      if (!this._begin('correct')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 1.4), self = this;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { self._note(v, f, t + i * 0.09, 0.7, 0.16, { attack: 0.01 }); });
    }
    // x: try again (soft-fail two-tone chime, 246.94 Hz to 220 Hz, kind and never scary)
    playTryAgain() {
      if (!this._begin('tryagain')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.9, 1.3), self = this;
      this._note(v, 246.94, t, 0.55, 0.2, { attack: 0.015, type2: 'sine', mix2: 0.4 }); this._note(v, 220, t + 0.22, 0.75, 0.2, { attack: 0.015, type2: 'sine', mix2: 0.4 });
      this._note(v, 493.88, t, 0.4, 0.04, { type2: 'sine', mix2: 0 });
    }
    // 6. Coin chime (987.77 Hz then 1318.5 Hz)
    playCoinChime() {
      if (!this._begin('coin')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.8, 1.0);
      this._note(v, 987.77, t, 0.22, 0.17, { attack: 0.004 }); this._note(v, 1318.5, t + 0.09, 0.6, 0.2, { attack: 0.004 }); this._note(v, 2637, t + 0.09, 0.25, 0.04, { type2: 'sine', mix2: 0 });
    }
    // used all over the platform when XP or coins are awarded (this method did not exist before v2)
    playCoinReward() {
      if (!this._begin('coin')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.8, 1.3);
      this._noiseBurst(v, t, 0.03, 0.12, { type: 'bandpass', f0: 4200, q: 6, attack: 0.001 });
      [[987.77, 0], [1318.5, 0.08], [1975.5, 0.17]].forEach(function (n, i) { this._note(v, n[0], t + n[1], 0.5 + i * 0.1, 0.15 - i * 0.015, { attack: 0.004 }); }, this);
      this._note(v, 3951, t + 0.17, 0.3, 0.03, { type2: 'sine', mix2: 0 });
    }
    // s: sparkle
    playSparkle() {
      if (!this._begin('sparkle')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.8, 1.3), pent = [1318.5, 1567.98, 1760, 2093, 2349.3, 2637], k;
      for (k = 0; k < 9; k++) this._note(v, pent[Math.floor(Math.random() * pent.length)], t + k * 0.07 + Math.random() * 0.03, 0.35, 0.07, { attack: 0.004, type2: 'sine', mix2: 0 });
    }

    /* ======================= FUN ======================= */
    // w: whoosh
    playWhoosh() {
      if (!this._begin('whoosh')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.8, 0.9);
      this._noiseBurst(v, t, 0.6, 0.3, { type: 'bandpass', f0: 380, f1: 3200, q: 1.1, attack: 0.18 });
      this._noiseBurst(v, t + 0.28, 0.4, 0.15, { type: 'bandpass', f0: 3200, f1: 500, q: 1.0, attack: 0.02 });
    }
    // b: boing
    playBoing() {
      if (!this._begin('boing')) return;
      var c = this.ctx, t = c.currentTime + 0.01, v = this._voice(0.8, 0.9);
      var os = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(), lp = c.createBiquadFilter();
      os.type = 'triangle'; os.frequency.setValueAtTime(260, t); os.frequency.exponentialRampToValueAtTime(620, t + 0.1); os.frequency.exponentialRampToValueAtTime(180, t + 0.7);
      lfo.frequency.setValueAtTime(11, t); lfo.frequency.linearRampToValueAtTime(4, t + 0.7); lg.gain.setValueAtTime(70, t); lg.gain.linearRampToValueAtTime(8, t + 0.7); lfo.connect(lg); lg.connect(os.frequency);
      lp.type = 'lowpass'; lp.frequency.value = 1800;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.28, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
      os.connect(lp); lp.connect(g); g.connect(v); lfo.start(t); os.start(t); lfo.stop(t + 0.8); os.stop(t + 0.8);
    }
    // f: card flip (low-pass filtered noise snap), used by the Class Board (did not exist before v2)
    playCardFlip() {
      if (!this._begin('flip')) return;
      var t = this.ctx.currentTime + 0.01, v = this._voice(0.8, 0.4);
      this._noiseBurst(v, t, 0.07, 0.4, { type: 'lowpass', f0: 3200, f1: 700, q: 0.8, attack: 0.001 });
      this._noiseBurst(v, t + 0.055, 0.05, 0.22, { type: 'bandpass', f0: 1800, q: 3, attack: 0.001 });
      this._note(v, 340, t, 0.05, 0.06, { attack: 0.002, type2: 'sine', mix2: 0 });
    }

    /* ======================= USER INTERFACE ======================= */
    _btnHTML(s, cls) {
      return '<button type="button" class="' + cls + '" data-sound="' + s.key + '" onclick="window.classSoundboard.play(\'' + s.key + '\')" title="' + s.label + ' (' + s.hot.toUpperCase() + ') - ' + s.desc + '">' +
        '<span class="sfx-emo">' + s.emoji + '</span><span class="sfx-lab">' + s.label + '</span><kbd class="sfx-kbd">' + s.hot.toUpperCase() + '</kbd></button>';
    }
    _controlsHTML() {
      return '<div class="sfx-controls">' +
        '<button type="button" class="sfx-mute-btn" onclick="window.classSoundboard.toggleMute()" title="Mute or unmute all sounds">' + (this.muted ? '🔇 Muted' : '🔊 On') + '</button>' +
        '<input class="sfx-vol" type="range" min="0" max="100" value="' + Math.round(this.volume * 100) + '" oninput="window.classSoundboard.setVolume(this.value/100)" aria-label="Volume">' +
        '<button type="button" class="sfx-stop-btn" onclick="window.classSoundboard.stopAll()" title="Stop all sounds (0)">⏹ Stop (0)</button></div>';
    }
    renderFlyoutHTML() {
      var self = this, html = this._controlsHTML();
      Object.keys(GROUPS).forEach(function (g) {
        html += '<div class="sfx-group-title">' + GROUPS[g] + '</div><div class="sfx-grid">' + SOUND_LIST.filter(function (s) { return s.group === g; }).map(function (s) { return self._btnHTML(s, 'sfx-flyout-item'); }).join('') + '</div>';
      });
      return html;
    }
    renderLabHTML() {
      var self = this, html = '<div class="sfx-lab-wrap"><div class="sfx-lab-head"><div><h3>Classroom Soundboard</h3><p>' + SOUND_LIST.length + ' soft, safe sounds for managing and celebrating. No audio files needed, works offline.</p></div><div class="sfx-lab-keys">⌨️ Press the key shown on each button. 0 stops everything.</div></div>' + this._controlsHTML();
      Object.keys(GROUPS).forEach(function (g) {
        html += '<div class="sfx-group-title">' + GROUPS[g] + '</div><div class="sfx-lab-grid">' + SOUND_LIST.filter(function (s) { return s.group === g; }).map(function (s) {
          return '<div class="sfx-card" data-sound="' + s.key + '" onclick="window.classSoundboard.play(\'' + s.key + '\')" role="button" tabindex="0"><div class="sfx-card-top"><span class="sfx-card-emo">' + s.emoji + '</span><kbd class="sfx-kbd">' + s.hot.toUpperCase() + '</kbd></div><strong>' + s.label + '</strong><span>' + s.desc + '</span></div>';
        }).join('') + '</div>';
      });
      return html + '</div>';
    }
    mountFlyout() {
      if (typeof document === 'undefined') return;
      var el = document.getElementById('sfx-flyout-menu'); if (!el) return;
      el.innerHTML = this.renderFlyoutHTML();
      // clicks inside the menu must not close it (the page closes it on outside clicks only)
    }
    syncUI() {
      if (typeof document === 'undefined') return;
      var self = this;
      document.querySelectorAll('.sfx-mute-btn').forEach(function (b) { b.textContent = self.muted ? '🔇 Muted' : '🔊 On'; b.classList.toggle('is-muted', self.muted); });
      document.querySelectorAll('.sfx-vol').forEach(function (r) { if (+r.value !== Math.round(self.volume * 100)) r.value = Math.round(self.volume * 100); });
      document.querySelectorAll('[data-sound="tick"]').forEach(function (b) { b.classList.toggle('is-running', self._ticking); });
    }

    /* ======================= HOTKEYS ======================= */
    // Number keys keep their old jobs (1 party, 2 bell, 3 quiet, 4 time's up, 5 applause, 6 coin, 7 fanfare).
    // New: 8 listen up, 9 freeze whistle, 0 stop all, T tick, G go, U clean-up, L level up, D drumroll, K pop, C correct, X try again, S sparkle, W whoosh, B boing, F flip, P party.
    initHotkeys() {
      if (typeof window === 'undefined' || this._hotkeysOn) return;
      this._hotkeysOn = true;
      var self = this;
      window.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target;
        if (t) { var tag = (t.tagName || '').toUpperCase(); if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable) return; }
        var key = (e.key || '').toLowerCase();
        if (key === '0') { e.preventDefault(); self.stopAll(); return; }
        var s = SOUND_LIST.filter(function (x) { return x.hot === key || x.alt === key; })[0];
        if (s) { e.preventDefault(); self[s.method](); }
      });
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { self.mountFlyout(); }); else setTimeout(function () { self.mountFlyout(); }, 0);
    }
  }

  // Export singleton (quiz-engine.js keeps its own old copy only if this file failed to load)
  var instance = new ClassroomSoundboard();
  root.ClassroomSoundboard = ClassroomSoundboard;
  root.ClassroomSoundList = SOUND_LIST;
  root.classSoundboard = instance;

  // Direct helper aliases for global scripts
  ['playPartyHorn', 'playAttentionBell', 'playQuietChime', 'playCountdownBuzzer', 'playApplause', 'playCoinChime', 'playCoinReward', 'playFanfare', 'playCardFlip'].forEach(function (m) {
    root[m] = function () { return root.classSoundboard[m](); };
  });
})(typeof window !== 'undefined' ? window : this);
