/* Alley Fling sound effects.
   Short, rounded, pitched "cartoon" sounds made with the Web Audio API (no samples, no internet).
   Rules: every sound starts with a soft fade-in (no clicks), is mostly pitched (no hiss),
   goes through one limiter so nothing is too loud or clips, and the loudness of all sounds is balanced.
   SFX.init(audioContext) once, then SFX.play('name'). The same code can be rendered offline for testing. */
(function (root) {
  var ctx = null, master = null, out = null;
  var SFX = { names: ['click', 'correct', 'wrong', 'fling', 'windgust', 'knock', 'bonk', 'rockhit', 'splat', 'hit', 'graze', 'boing', 'tink', 'thud', 'shield', 'double', 'streak', 'countdown', 'go', 'win', 'cheer'] };

  SFX.init = function (audioCtx) {
    ctx = audioCtx;
    master = ctx.createGain();
    master.gain.value = 0.9;
    var comp = ctx.createDynamicsCompressor();      // acts as a limiter: loud moments are tamed, never clip
    comp.threshold.value = -16; comp.knee.value = 20; comp.ratio.value = 8; comp.attack.value = 0.002; comp.release.value = 0.15;
    master.connect(comp); comp.connect(ctx.destination);
    out = master;
  };

  SFX.setVolume = function (v) { if (master) master.gain.value = Math.max(0, Math.min(1, v)); };

  /* one pitched note: sliding sine/triangle with a soft attack and a smooth fall */
  function tone(t, f0, f1, dur, type, peak, attack) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    attack = attack || 0.008;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.05);
  }
  /* a bell / marimba note: a fundamental plus a quiet bright partial, rings and fades */
  function bell(t, f, peak, decay, bright) {
    tone(t, f, f, decay, 'sine', peak, 0.006);
    tone(t, f * (bright || 2.76), f * (bright || 2.76), decay * 0.45, 'sine', peak * 0.28, 0.004);
  }
  /* wood block: a short pitched "tok" */
  function wood(t, f, peak) {
    tone(t, f * 1.5, f, 0.05, 'triangle', peak, 0.002);
    tone(t, f * 2.3, f * 2.3, 0.035, 'sine', peak * 0.4, 0.002);
  }
  /* a very soft puff of air: low-passed noise, quiet, used only for texture */
  function puff(t, dur, cutoff, peak) {
    var len = Math.floor(ctx.sampleRate * (dur + 0.05)), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
    var s = ctx.createBufferSource(); s.buffer = buf;
    var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff, t); f.frequency.exponentialRampToValueAtTime(Math.max(120, cutoff * 0.35), t + dur);
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + dur + 0.05);
  }

  var N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, E6: 1318.5, G6: 1568 };

  var recipes = {
    click: function (t) { tone(t, 880, 700, 0.06, 'sine', 0.16, 0.004); },
    correct: function (t) { [N.C5, N.E5, N.G5, N.C6].forEach(function (f, i) { bell(t + i * 0.085, f, 0.2, 0.32); }); },
    wrong: function (t) { tone(t, 392, 392, 0.2, 'sine', 0.2, 0.01); tone(t + 0.17, 311, 294, 0.3, 'sine', 0.2, 0.01); },
    fling: function (t) {   // "whoop": a smooth rising glide with a little airy tail
      tone(t, 280, 1100, 0.3, 'sine', 0.2, 0.03); tone(t, 420, 1650, 0.3, 'sine', 0.06, 0.03); puff(t + 0.02, 0.28, 2600, 0.035);
    },
    windgust: function (t) { tone(t, 150, 190, 0.9, 'sine', 0.05, 0.4); tone(t, 225, 260, 0.9, 'sine', 0.03, 0.4); puff(t, 0.9, 700, 0.025); },
    knock: function (t) { wood(t, 330, 0.5); wood(t + 0.07, 290, 0.3); },                    // knock-knock on the fence
    bonk: function (t) {    // cartoon boing + bonk + a tiny sparkle
      tone(t, 520, 200, 0.14, 'triangle', 0.36, 0.004); wood(t, 220, 0.4); bell(t + 0.1, N.G5, 0.09, 0.25); bell(t + 0.16, N.C6, 0.08, 0.3);
    },
    rockhit: function (t) { tone(t, 190, 80, 0.2, 'sine', 0.5, 0.004); wood(t, 160, 0.45); puff(t, 0.12, 900, 0.06); },
    splat: function (t) {   // wet "blup-blup"
      tone(t, 800, 220, 0.11, 'sine', 0.34, 0.004); tone(t + 0.1, 520, 880, 0.09, 'sine', 0.2, 0.004); tone(t + 0.17, 420, 180, 0.1, 'sine', 0.16, 0.004);
    },
    hit: function (t) { tone(t, 420, 160, 0.16, 'triangle', 0.36, 0.004); wood(t, 240, 0.35); bell(t + 0.08, N.E5, 0.1, 0.25); },
    graze: function (t) { wood(t, 380, 0.25); bell(t + 0.05, N.A5, 0.1, 0.2); },
    boing: function (t) {   // a springy bounce
      var o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(620, t + 0.12); o.frequency.exponentialRampToValueAtTime(260, t + 0.3);
      lfo.frequency.value = 32; lg.gain.value = 24; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.3, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.connect(g); g.connect(out); o.start(t); lfo.start(t); o.stop(t + 0.35); lfo.stop(t + 0.35);
    },
    tink: function (t) { bell(t, 1175, 0.16, 0.22); },
    thud: function (t) { tone(t, 120, 62, 0.18, 'sine', 0.38, 0.006); puff(t, 0.1, 600, 0.05); },
    shield: function (t) { bell(t, N.A5, 0.18, 0.55); bell(t + 0.06, 1318.5, 0.14, 0.6); bell(t + 0.12, 1760, 0.1, 0.6); },
    double: function (t) { tone(t, 440, 660, 0.09, 'triangle', 0.22, 0.006); tone(t + 0.09, 660, 990, 0.12, 'triangle', 0.22, 0.006); bell(t + 0.2, N.C6, 0.14, 0.3); },
    streak: function (t) { [N.G5, N.B5, N.D5 * 2, N.G6].forEach(function (f, i) { bell(t + i * 0.07, f, 0.17, 0.35); }); },
    countdown: function (t) { wood(t, 520, 0.28); },
    go: function (t) { [N.C5, N.E5, N.G5].forEach(function (f, i) { bell(t + i * 0.06, f, 0.2, 0.4); }); bell(t + 0.2, N.C6, 0.22, 0.6); },
    win: function (t) {
      [[N.C5, 0], [N.E5, 0.14], [N.G5, 0.28], [N.C6, 0.42]].forEach(function (p) { bell(t + p[1], p[0], 0.22, 0.5); });
      [N.C5, N.E5, N.G5, N.C6].forEach(function (f) { tone(t + 0.6, f, f, 0.9, 'triangle', 0.09, 0.02); });
    },
    cheer: function (t) { [N.C5, N.E5, N.G5, N.C6, N.E6].forEach(function (f, i) { bell(t + i * 0.075, f, 0.17, 0.38); }); tone(t + 0.45, N.C6, N.C6, 0.6, 'triangle', 0.08, 0.02); }
  };

  /* loudness balance: every sound gets its own level so impacts are clearly heard and nothing is too loud */
  var LEVEL = { click: 8.3, correct: 1.2, wrong: 1.36, fling: 3.3, windgust: 1.5, knock: 1.8, bonk: 3.4, rockhit: 4.1, splat: 2.2, hit: 3.9, graze: 3.3, boing: 4.7, tink: 7, thud: 5.3, shield: 1.6, double: 1.6, streak: 1.3, countdown: 3.8, go: 1.1, win: 1.3, cheer: 1.25 };
  SFX.LEVEL = LEVEL;

  SFX.play = function (name, when) {
    if (!ctx || !recipes[name]) return false;
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    var bus = ctx.createGain(); bus.gain.value = LEVEL[name] || 1; bus.connect(master);
    out = bus;
    try { recipes[name](typeof when === 'number' ? when : ctx.currentTime); } finally { out = master; }
    return true;
  };
  root.SFX = SFX;
})(typeof window !== 'undefined' ? window : this);
