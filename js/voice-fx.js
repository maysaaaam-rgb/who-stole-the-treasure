/* Voice Changer (teacher toolkit): speak into the microphone and the speakers play your voice as a character.
   Everything is live Web Audio on this computer: nothing is recorded, saved or sent anywhere.
   Hold to talk (Space) is the default so the speakers cannot squeal back into the microphone; "Always on" is optional.
   VoiceFX.toggle() opens or closes the panel. */
(function (root) {
  'use strict';

  /* ---------- the characters ---------- */
  var FX = [
    { id: 'normal',  e: '🎤', n: 'My voice' },
    { id: 'chip',    e: '🐿️', n: 'Chipmunk',  pitch: 1.75 },
    { id: 'fairy',   e: '🧚', n: 'Fairy',     pitch: 1.45, echo: [0.16, 0.35, 0.3] },
    { id: 'alien',   e: '👽', n: 'Alien',     pitch: 1.3, trem: [8, 0.55] },
    { id: 'robot',   e: '🤖', n: 'Robot',     ring: 55, echo: [0.05, 0.45, 0.35] },
    { id: 'monster', e: '👹', n: 'Monster',   pitch: 0.62, drive: true, lp: 2600 },
    { id: 'giant',   e: '🦕', n: 'Giant',     pitch: 0.5, echo: [0.22, 0.4, 0.3] },
    { id: 'cave',    e: '🏔️', n: 'Cave',      echo: [0.28, 0.55, 0.45] },
    { id: 'radio',   e: '📻', n: 'Walkie-talkie', band: [500, 3200], drive: true },
    { id: 'ghost',   e: '👻', n: 'Ghost',     pitch: 0.8, trem: [4, 0.4], echo: [0.3, 0.5, 0.5] }
  ];

  /* ---------- pitch shifter: two delay lines whose delay time slides, cross-faded so there is no click ----------
     A delay that grows steadily plays the sound slower (lower); one that shrinks plays it faster (higher). ratio 2 = one octave up. */
  var CYCLE = 0.1;   // seconds per slide
  function pitchShifter(ctx, input, ratio, keep, srcs) {
    var sr = ctx.sampleRate, len = Math.round(CYCLE * sr), half = len / 2, up = ratio > 1;
    function buf(fn) { var b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0); for (var i = 0; i < len; i++) d[i] = fn(i); return b; }
    var ramp = buf(function (i) { return up ? 1 - i / len : i / len; });                       // 0..1 slide of the delay time
    var fade = buf(function (i) { return i < half ? Math.sqrt(i / half) : Math.sqrt(1 - (i - half) / half); });   // equal-power cross-fade
    var depth = CYCLE * Math.abs(ratio - 1), out = ctx.createGain(), t0 = ctx.currentTime + 0.05;
    keep.push(out);
    [0, CYCLE / 2].forEach(function (offset) {
      var d = ctx.createDelay(1), mod = ctx.createBufferSource(), mg = ctx.createGain(), f = ctx.createBufferSource(), mix = ctx.createGain();
      mod.buffer = ramp; mod.loop = true; mg.gain.value = depth; mod.connect(mg); mg.connect(d.delayTime);
      f.buffer = fade; f.loop = true; mix.gain.value = 0; f.connect(mix.gain);
      input.connect(d); d.connect(mix); mix.connect(out);
      mod.start(t0 + offset); f.start(t0 + offset);
      srcs.push(mod, f); keep.push(d, mg, mix);
    });
    return out;
  }

  /* ---------- one character = one chain of nodes from `input` to `out` ---------- */
  function build(ctx, input, out, fx) {
    var keep = [], srcs = [];
    function node(n) { keep.push(n); return n; }
    function gain(v) { var g = node(ctx.createGain()); g.gain.value = v; return g; }
    function filt(type, f, q) { var b = node(ctx.createBiquadFilter()); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; }
    function osc(hz) { var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = hz; o.start(); srcs.push(o); return o; }
    var cur = filt('highpass', 110); input.connect(cur);                                  // cut room rumble and mic bumps
    if (fx.pitch) { var ps = pitchShifter(ctx, cur, fx.pitch, keep, srcs); cur = ps; }
    if (fx.ring) { var rg = gain(0); osc(fx.ring).connect(rg.gain); cur.connect(rg); cur = rg; }   // ring modulation = robot
    if (fx.trem) { var tg = gain(1 - fx.trem[1] / 2), lg = gain(fx.trem[1] / 2); osc(fx.trem[0]).connect(lg); lg.connect(tg.gain); cur.connect(tg); cur = tg; }
    if (fx.band) { var hp = filt('highpass', fx.band[0]), lp = filt('lowpass', fx.band[1]); cur.connect(hp); hp.connect(lp); cur = lp; }
    if (fx.lp) { var l2 = filt('lowpass', fx.lp); cur.connect(l2); cur = l2; }
    if (fx.drive) {
      var ws = node(ctx.createWaveShaper()), c = new Float32Array(1024);
      for (var i = 0; i < c.length; i++) { var x = i / 512 - 1; c[i] = Math.tanh(x * 3) * 0.85; }
      ws.curve = c; cur.connect(ws); cur = ws;
    }
    if (fx.echo) {                                                    // [delay seconds, feedback, wet amount]
      var d = node(ctx.createDelay(1)), fb = gain(fx.echo[1]), tone = filt('lowpass', 2800), wet = gain(fx.echo[2]), dry = gain(1);
      d.delayTime.value = fx.echo[0];
      cur.connect(dry); dry.connect(out);
      cur.connect(d); d.connect(tone); tone.connect(fb); fb.connect(d); tone.connect(wet); wet.connect(out);
    } else cur.connect(out);
    return { stop: function () { srcs.forEach(function (s) { try { s.stop(); } catch (e) { /* already stopped */ } }); keep.forEach(function (n) { try { n.disconnect(); } catch (e) { /* ignore */ } }); try { input.disconnect(keep[0]); } catch (e) { /* ignore */ } } };
  }

  /* ---------- the live tool ---------- */
  var KEY = 'eaa_voicefx_v1';
  var prefs = { fx: 'chip', mode: 'hold', mic: '', out: '', vol: 0.8 };
  try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* private window */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ } }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var ctx = null, stream = null, src = null, gate = null, master = null, analyser = null, chain = null, raf = 0;
  var panel = null, live = false, talking = false, hot = 0, mutedUntil = 0, tab = 'live';

  function fxById(id) { return FX.filter(function (f) { return f.id === id; })[0] || FX[0]; }
  function $(s) { return panel && panel.querySelector(s); }
  function setMsg(t) { var m = $('#vfx-msg'); if (m) m.innerHTML = t; }

  function css() {
    if (document.getElementById('vfx-css')) return;
    var s = document.createElement('style'); s.id = 'vfx-css';
    s.textContent =
      '#vfx{position:fixed;right:16px;bottom:92px;width:min(580px,94vw);z-index:9000;background:rgba(15,23,42,.94);backdrop-filter:blur(14px);border:1px solid rgba(148,163,184,.3);border-radius:22px;padding:14px 16px 16px;color:#f8fafc;font:500 .95rem Fredoka,"Segoe UI",system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.6)}' +
      '#vfx *{box-sizing:border-box}#vfx h3{margin:0;font-size:1.1rem;display:flex;align-items:center;gap:8px}#vfx h3 .x{margin-left:auto}' +
      '#vfx button{font:inherit;color:#fff;cursor:pointer;border:0;border-bottom:5px solid #1e293b;border-radius:14px;background:#334155;padding:8px 12px;font-weight:700;transition:transform .2s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .2s}' +
      '#vfx button:active{transform:translateY(4px);border-bottom-width:1px}' +
      '#vfx .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:12px 0}' +
      '#vfx .grid.cast{grid-template-columns:repeat(6,1fr)}#vfx .note{font-size:.85rem;line-height:1.45;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.3);border-radius:12px;padding:10px 12px;margin:10px 0;color:#e2e8f0}#vfx .note ol{margin:6px 0 6px 20px;padding:0}#vfx .note b{color:#fde047}' +
      '#vfx .tabs{display:inline-flex;gap:6px;margin-left:8px}#vfx .tabs button{padding:5px 11px;font-size:.8rem;background:#1e293b;border-bottom-width:3px}#vfx .tabs button.on{background:#a855f7;border-bottom-color:#6b21a8}' +
      '#vfx .fx{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;background:#1e3a5f;border-bottom-color:#0f2742;font-size:.78rem;line-height:1.15}#vfx .fx b{font-size:1.9rem;line-height:1.1}' +
      '#vfx .fx.on{background:#0e7490;border-bottom-color:#164e63;outline:3px solid #fde047}' +
      '#vfx .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0;font-size:.82rem}' +
      '#vfx select{flex:1;min-width:0;background:#0f172a;color:#e2e8f0;border:1px solid #475569;border-radius:10px;padding:6px 8px;font:inherit}' +
      '#vfx input[type=range]{flex:1;accent-color:#38bdf8}' +
      '#vfx .lvl{height:14px;flex:1;border-radius:99px;background:#1e293b;border:1px solid #334155;overflow:hidden}#vfx .lvl i{display:block;height:100%;width:0;background:linear-gradient(90deg,#10b981,#f59e0b 70%,#f43f5e);transition:width .06s linear}' +
      '#vfx .seg button{padding:6px 10px;font-size:.8rem}#vfx .seg button.on{background:#a855f7;border-bottom-color:#6b21a8}' +
      '#vfx .talk{width:100%;font-size:1.25rem;padding:14px;background:#10b981;border-bottom-color:#065f46;user-select:none;touch-action:none}' +
      '#vfx .talk.live{background:#f43f5e;border-bottom-color:#9f1239;animation:vfxp .8s infinite}#vfx .talk.off{background:#0ea5e9;border-bottom-color:#075985}#vfx .talk.mute{background:#475569;border-bottom-color:#1e293b}' +
      '@keyframes vfxp{50%{box-shadow:0 0 0 10px rgba(244,63,94,.28)}}' +
      '#vfx #vfx-msg{font-size:.82rem;color:#cbd5e1;min-height:2.4em;margin-top:6px}#vfx #vfx-msg b{color:#fde047}' +
      '@media(max-width:560px){#vfx .grid{grid-template-columns:repeat(4,1fr)}}';
    document.head.appendChild(s);
  }

  // The ElevenLabs Studio tab is built but switched off. Set STUDIO_ON to true (and finish the Supabase setup) to bring it back.
  var STUDIO_ON = false;
  function head() {
    if (!STUDIO_ON) return '<h3>🎙️ Voice Changer<small style="font-weight:500;color:#94a3b8;font-size:.72rem;margin-left:8px">your voice, a funny character</small><button class="x" id="vfx-x" title="Close">✕</button></h3>';
    return '<h3>🎙️ Voice Changer<span class="tabs"><button type="button" data-tab="live" class="' + (tab === 'live' ? 'on' : '') + '">⚡ Live</button><button type="button" data-tab="studio" class="' + (tab === 'studio' ? 'on' : '') + '">✨ Studio</button></span><button class="x" id="vfx-x" title="Close">✕</button></h3>';
  }
  function wireHead() {
    $('#vfx-x').onclick = close;
    panel.querySelectorAll('[data-tab]').forEach(function (b) { b.onclick = function () { if (tab === b.dataset.tab) return; stopMic(); studioStop(); tab = b.dataset.tab; render(); }; });
  }
  function render() {
    css();
    if (!panel) { panel = document.createElement('div'); panel.id = 'vfx'; document.body.appendChild(panel); }
    if (tab === 'studio') { panel.innerHTML = head() + '<div id="vfx-body"></div>'; wireHead(); renderStudio(); return; }
    panel.innerHTML =
      head() +
      '<div class="grid">' + FX.map(function (f) { return '<button type="button" class="fx' + (f.id === prefs.fx ? ' on' : '') + '" data-fx="' + f.id + '"><b>' + f.e + '</b>' + esc(f.n) + '</button>'; }).join('') + '</div>' +
      '<div class="row"><span>🎙️</span><select id="vfx-mic" title="Microphone"><option value="">Default microphone</option></select></div>' +
      '<div class="row" id="vfx-outrow" style="display:none"><span>🔈</span><select id="vfx-out" title="Speakers"><option value="">Default speakers</option></select></div>' +
      '<div class="row"><span>🔊</span><input type="range" id="vfx-vol" min="0" max="1" step="0.05" value="' + prefs.vol + '"><div class="lvl" title="Your voice"><i id="vfx-lvl"></i></div></div>' +
      '<div class="row seg"><button type="button" data-mode="hold" class="' + (prefs.mode === 'hold' ? 'on' : '') + '">✋ Hold to talk (Space)</button><button type="button" data-mode="live" class="' + (prefs.mode === 'live' ? 'on' : '') + '">🔴 Always on</button></div>' +
      '<button type="button" class="talk ' + (live ? '' : 'off') + '" id="vfx-talk"></button>' +
      '<div id="vfx-msg"></div>';
    wireHead();
    panel.querySelectorAll('[data-fx]').forEach(function (b) { b.onclick = function () { setFx(b.dataset.fx); }; });
    panel.querySelectorAll('[data-mode]').forEach(function (b) { b.onclick = function () { setMode(b.dataset.mode); }; });
    $('#vfx-vol').oninput = function () { prefs.vol = +this.value; save(); if (master) master.gain.value = prefs.vol * 1.6; };
    $('#vfx-mic').onchange = function () { prefs.mic = this.value; save(); if (live) { stopMic(); startMic(); } };
    $('#vfx-out').onchange = function () { prefs.out = this.value; save(); applySink(); };
    paintTalk();
    var t = $('#vfx-talk');
    t.onpointerdown = function (e) { if (!live) { startMic(); return; } if (prefs.mode === 'hold') { e.preventDefault(); try { t.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } talk(true); } };
    t.onpointerup = t.onpointercancel = function () { if (live && prefs.mode === 'hold') talk(false); };
    if (live) { fillDevices(); setMsg(hint()); } else setMsg('Press the blue button to turn the microphone on. <b>Tip:</b> keep the microphone away from the speakers, or use headphones, so it does not squeal.');
  }
  function hint() { return prefs.mode === 'hold' ? '✋ Hold the green button (or the <b>Space</b> key) and talk. Let go to stop.' : '🔴 The microphone is always on. If it squeals, move the microphone away from the speakers or switch to Hold to talk.'; }
  function paintTalk() {
    var t = $('#vfx-talk'); if (!t) return;
    t.className = 'talk ' + (!live ? 'off' : talking ? 'live' : prefs.mode === 'live' ? 'mute' : '');
    t.textContent = !live ? '🎙️ Turn on the microphone' : prefs.mode === 'live' ? (talking ? '🔴 Live: you sound like ' + fxById(prefs.fx).n + '!' : '🔇 Muted (feedback stop)') : (talking ? '🔴 Talking… let go to stop' : '🎤 HOLD TO TALK');
  }

  /* ---------- audio ---------- */
  function applySink() {
    if (!ctx || !ctx.setSinkId) return;
    try { ctx.setSinkId(prefs.out || '').catch(function () { setMsg('🔈 This speaker cannot be used. The default speakers are playing.'); }); } catch (e) { /* ignore */ }
  }
  function fillDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    navigator.mediaDevices.enumerateDevices().then(function (list) {
      var mic = $('#vfx-mic'), out = $('#vfx-out'); if (!mic) return;
      var ins = list.filter(function (d) { return d.kind === 'audioinput'; }), outs = list.filter(function (d) { return d.kind === 'audiooutput'; });
      mic.innerHTML = '<option value="">Default microphone</option>' + ins.map(function (d, i) { return '<option value="' + esc(d.deviceId) + '">' + esc(d.label || 'Microphone ' + (i + 1)) + '</option>'; }).join('');
      mic.value = ins.some(function (d) { return d.deviceId === prefs.mic; }) ? prefs.mic : '';
      if (outs.length && ctx && ctx.setSinkId) {
        $('#vfx-outrow').style.display = 'flex';
        out.innerHTML = '<option value="">Default speakers</option>' + outs.map(function (d, i) { return '<option value="' + esc(d.deviceId) + '">' + esc(d.label || 'Speakers ' + (i + 1)) + '</option>'; }).join('');
        out.value = outs.some(function (d) { return d.deviceId === prefs.out; }) ? prefs.out : '';
      }
    }, function () { /* labels need permission: they appear after the microphone is on */ });
  }
  function connectChain() {
    if (chain) chain.stop();
    chain = build(ctx, gate, master, fxById(prefs.fx));
  }
  function startMic() {
    if (live) return;
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setMsg('🤔 This browser cannot use the microphone. Use Chrome or Edge.'); return; }
    setMsg('🎙️ Asking for the microphone… press <b>Allow</b>.');
    var audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: false };
    if (prefs.mic) audio.deviceId = { exact: prefs.mic };
    navigator.mediaDevices.getUserMedia({ audio: audio }).then(function (s) {
      stream = s; ctx = new AC({ latencyHint: 'interactive' }); if (ctx.state === 'suspended') ctx.resume();
      src = ctx.createMediaStreamSource(s);
      gate = ctx.createGain(); gate.gain.value = prefs.mode === 'live' ? 1 : 0;
      master = ctx.createGain(); master.gain.value = prefs.vol * 1.6;
      var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 10; comp.attack.value = 0.003; comp.release.value = 0.15;
      analyser = ctx.createAnalyser(); analyser.fftSize = 512;
      src.connect(analyser); src.connect(gate); master.connect(comp); comp.connect(ctx.destination);
      connectChain(); applySink();
      live = true; talking = prefs.mode === 'live'; hot = 0; paintTalk(); fillDevices(); setMsg(hint()); meter();
      s.getAudioTracks().forEach(function (t) { t.onended = function () { stopMic(); setMsg('🔌 The microphone was unplugged. Press the blue button to start again.'); }; });
    }, function (e) {
      var n = e && e.name;
      setMsg(n === 'NotAllowedError' || n === 'SecurityError' ? '🔒 The microphone is blocked. Click the lock next to the address, allow the microphone, then try again.'
        : n === 'NotFoundError' || n === 'OverconstrainedError' ? '🎙️ That microphone was not found. Plug it in, or choose another one in the list.' : '🤔 The microphone could not start (' + esc(n || 'error') + ').');
    });
  }
  function stopMic() {
    cancelAnimationFrame(raf); live = false; talking = false;
    if (chain) { chain.stop(); chain = null; }
    if (stream) { stream.getTracks().forEach(function (t) { t.onended = null; t.stop(); }); stream = null; }
    if (ctx) { try { ctx.close(); } catch (e) { /* ignore */ } ctx = null; }
    src = gate = master = analyser = null; paintTalk(); var l = $('#vfx-lvl'); if (l) l.style.width = '0%';
  }
  function talk(on) {
    if (!live || !gate) return; talking = !!on;
    gate.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.015); paintTalk();
  }
  function setFx(id) {
    prefs.fx = id; save();
    panel && panel.querySelectorAll('[data-fx]').forEach(function (b) { b.classList.toggle('on', b.dataset.fx === id); });
    if (live) { connectChain(); paintTalk(); }
    setMsg('You are now: <b>' + fxById(id).e + ' ' + esc(fxById(id).n) + '</b>. ' + (live ? hint() : 'Turn on the microphone to try it.'));
  }
  function setMode(m) {
    prefs.mode = m; save();
    panel && panel.querySelectorAll('[data-mode]').forEach(function (b) { b.classList.toggle('on', b.dataset.mode === m); });
    if (live) { talking = m === 'live'; gate.gain.setTargetAtTime(talking ? 1 : 0, ctx.currentTime, 0.015); hot = 0; }
    paintTalk(); setMsg(hint());
  }
  // live level bar; in "Always on" mode a long, very loud signal is feedback, so the microphone is muted for a moment
  function meter() {
    if (!analyser) return;
    var buf = new Uint8Array(analyser.fftSize), sum = 0, i;
    analyser.getByteTimeDomainData(buf); for (i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
    var rms = Math.sqrt(sum / buf.length), l = $('#vfx-lvl'); if (l) l.style.width = Math.min(100, Math.round(rms * 380)) + '%';
    if (prefs.mode === 'live' && gate) {
      var now = Date.now();
      if (mutedUntil && now > mutedUntil) { mutedUntil = 0; talking = true; gate.gain.setTargetAtTime(1, ctx.currentTime, 0.02); paintTalk(); }
      else if (!mutedUntil) {
        hot = rms > 0.6 ? hot + 1 : 0;
        if (hot > 70) { hot = 0; mutedUntil = now + 2500; talking = false; gate.gain.setTargetAtTime(0, ctx.currentTime, 0.01); paintTalk(); setMsg('🔇 <b>Squeal stopped!</b> The speakers were feeding back into the microphone. Move the microphone away, or use Hold to talk.'); }
      }
    }
    raf = requestAnimationFrame(meter);
  }

  /* ---------- Studio: hold to record YOUR voice, ElevenLabs turns it into a character, then it plays on the speakers ----------
     Needs the voice-changer function in Supabase (secrets: ELEVENLABS_API_KEY, STUDIO_PIN). The key never reaches this page.
     Teacher's voice only: the recording is sent to ElevenLabs to change it and is not saved here or on our server. */
  var CAST = [
    { k: 'owl', e: '🦉', n: 'Wise Owl' },
    { k: 'dragon', e: '🐉', n: 'Dragon', post: { pitch: 0.85, echo: [0.2, 0.35, 0.25] } },
    { k: 'fairy', e: '🧚', n: 'Fairy', post: { echo: [0.16, 0.3, 0.22] } },
    { k: 'robot', e: '🤖', n: 'Robot', post: { trem: [38, 0.55], echo: [0.05, 0.4, 0.3] } },
    { k: 'witch', e: '🧙', n: 'Witch', post: { trem: [5, 0.25], echo: [0.2, 0.3, 0.2] } },
    { k: 'hero', e: '🦸', n: 'Hero' }
  ];
  var PIN_KEY = 'eaa_studio_pin_v1', MAX_REC = 15000;
  var st = { pick: 'owl', ui: '', stream: null, rec: null, chunks: [], t0: 0, stopT: 0, pctx: null, last: null, play: null, busy: false, left: null, credits: null };

  function getPin() { try { return sessionStorage.getItem(PIN_KEY) || localStorage.getItem(PIN_KEY) || ''; } catch (e) { return ''; } }
  function setPin(p, remember) { try { sessionStorage.setItem(PIN_KEY, p); if (remember) localStorage.setItem(PIN_KEY, p); else localStorage.removeItem(PIN_KEY); } catch (e) { /* ignore */ } }
  function clearPin() { try { sessionStorage.removeItem(PIN_KEY); localStorage.removeItem(PIN_KEY); } catch (e) { /* ignore */ } }
  function fnUrl() { var c = root.SUPABASE_CONFIG || {}; return c.url ? c.url.replace(/\/$/, '') + '/functions/v1/voice-changer' : ''; }
  function hdrs(extra) { var c = root.SUPABASE_CONFIG || {}, h = {}; if (c.anonKey) h.apikey = c.anonKey; var p = getPin(); if (p) h['x-studio-pin'] = p; return Object.assign(h, extra || {}); }
  function sbox(html) { var b = $('#vfx-body'); if (b) b.innerHTML = html; }
  function smsg(t) { var m = $('#vfx-smsg'); if (m) m.innerHTML = t; }
  function castOf(k) { return CAST.filter(function (c) { return c.k === k; })[0] || CAST[0]; }

  function renderStudio() {
    st.ui = 'loading';
    sbox('<div class="note">✨ Checking the Studio…</div>');
    if (!fnUrl()) { setupCard(['the Supabase address'], 'This page has no Supabase address.'); return; }
    fetch(fnUrl() + '?action=status', { headers: hdrs() }).then(function (r) { return r.json().then(function (d) { return { s: r.status, d: d }; }); }).then(function (x) {
      if (!panel || tab !== 'studio') return;
      if (x.s === 404 || (x.d && x.d.code === 'NOT_FOUND')) { setupCard(['deploy the voice-changer function'], ''); return; }
      if (x.d && x.d.missing && x.d.missing.length) { setupCard(x.d.missing, ''); return; }
      if (x.s === 401) { clearPin(); pinCard(x.d && x.d.error === 'bad_pin' ? '🔒 Wrong PIN. Try again.' : ''); return; }
      if (x.s === 429) { pinCard('⏳ ' + esc((x.d && x.d.message) || 'Wait a minute.')); return; }
      if (!getPin()) { pinCard(''); return; }
      if (x.d && x.d.ready) { st.left = x.d.left; st.credits = x.d.credits; mainCard(); return; }
      pinCard('');
    }, function () { if (panel && tab === 'studio') setupCard([], 'Could not reach the Studio. Check the internet, then try again.'); });
  }
  function setupCard(missing, why) {
    st.ui = 'setup';
    sbox('<div class="note"><b>✨ Studio is not set up yet</b><br>' + (why ? esc(why) + '<br>' : '') +
      'It needs a one-time setup in Supabase (about 5 minutes):<ol><li>Deploy the <b>voice-changer</b> function (Verify JWT off).</li><li>Add the secrets <b>ELEVENLABS_API_KEY</b> and <b>STUDIO_PIN</b>.</li><li>Run <b>voice_usage.sql</b> once.</li></ol>' +
      (missing.length ? 'Still missing: <b>' + missing.map(esc).join(', ') + '</b><br>' : '') +
      'Steps are in <b>supabase/functions/voice-changer/README.md</b>. The ⚡ Live tab works without any setup.</div><div class="row"><button type="button" id="vfx-again2">🔄 Check again</button></div>');
    $('#vfx-again2').onclick = renderStudio;
  }
  function pinCard(msg) {
    st.ui = 'pin';
    sbox('<div class="note">🔒 Enter your Studio PIN (the one you set in Supabase).' + (msg ? '<br><b>' + msg + '</b>' : '') + '</div>' +
      '<div class="row"><input type="password" id="vfx-pin" inputmode="numeric" autocomplete="off" placeholder="PIN" style="flex:1;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:10px;padding:10px;font:inherit"><button type="button" id="vfx-unlock" class="amber" style="background:#f59e0b;border-bottom-color:#92400e;color:#1c1004">Unlock</button></div>' +
      '<label class="row" style="gap:6px"><input type="checkbox" id="vfx-rem"> Remember on this computer</label>');
    var go = function () { var p = $('#vfx-pin').value.trim(); if (!p) return; setPin(p, $('#vfx-rem').checked); renderStudio(); };
    $('#vfx-unlock').onclick = go; $('#vfx-pin').onkeydown = function (e) { if (e.key === 'Enter') go(); };
    setTimeout(function () { var i = $('#vfx-pin'); if (i) i.focus(); }, 50);
  }
  function mainCard() {
    st.ui = 'main';
    var cr = st.credits && st.credits.limit ? ' · credits used ' + Math.round(st.credits.used / st.credits.limit * 100) + '%' : '';
    sbox('<div class="note" id="vfx-left"></div>' +
      '<div class="grid cast">' + CAST.map(function (c) { return '<button type="button" class="fx' + (c.k === st.pick ? ' on' : '') + '" data-cast="' + c.k + '"><b>' + c.e + '</b>' + esc(c.n) + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="talk off" id="vfx-rec"></button>' +
      '<div class="row"><button type="button" id="vfx-replay">▶ Play again</button><button type="button" id="vfx-lock">🔒 Lock</button></div>' +
      '<div id="vfx-smsg"></div>');
    paintLeft(cr);
    panel.querySelectorAll('[data-cast]').forEach(function (b) { b.onclick = function () { st.pick = b.dataset.cast; panel.querySelectorAll('[data-cast]').forEach(function (x) { x.classList.toggle('on', x === b); }); paintRec(); }; });
    $('#vfx-replay').onclick = function () { if (st.last) playLast(); else smsg('Nothing to play yet. Record something first!'); };
    $('#vfx-lock').onclick = function () { clearPin(); studioStop(); renderStudio(); };
    var t = $('#vfx-rec');
    t.onpointerdown = function (e) { e.preventDefault(); if (!st.stream) { micOn(); return; } try { t.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } recStart(); };
    t.onpointerup = t.onpointercancel = function () { recStop(); };
    paintRec();
    smsg(st.stream ? '✋ Hold the button (or <b>Space</b>), say a sentence, let go.' : '🔒 Only <b>your</b> voice. It goes to ElevenLabs to be changed and is not saved.');
  }
  function paintLeft(cr) {
    var el = $('#vfx-left'); if (!el) return;
    el.innerHTML = '✨ <b>' + (st.left == null ? '?' : st.left) + '</b> changes left today' + (cr == null ? '' : cr);
  }
  function paintRec() {
    var t = $('#vfx-rec'); if (!t) return; var c = castOf(st.pick);
    var rec = st.rec && st.rec.state === 'recording';
    t.className = 'talk ' + (st.busy ? 'mute' : rec ? 'live' : st.stream ? '' : 'off');
    t.textContent = st.busy ? '🪄 Turning you into ' + c.n + '…' : rec ? '🔴 Recording… let go when done' : st.stream ? '🎤 HOLD TO RECORD · ' + c.e + ' ' + c.n : '🎙️ Turn on the microphone';
  }
  function micOn() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !root.MediaRecorder) { smsg('🤔 This browser cannot record. Use Chrome or Edge.'); return; }
    var audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true }; if (prefs.mic) audio.deviceId = { exact: prefs.mic };
    smsg('🎙️ Asking for the microphone… press <b>Allow</b>.');
    navigator.mediaDevices.getUserMedia({ audio: audio }).then(function (s) { if (!panel || tab !== 'studio') { s.getTracks().forEach(function (t) { t.stop(); }); return; } st.stream = s; paintRec(); smsg('✋ Hold the button (or <b>Space</b>), say a sentence, let go.'); },
      function (e) { smsg(e && e.name === 'NotAllowedError' ? '🔒 The microphone is blocked. Click the lock next to the address, allow it, then try again.' : '🎙️ The microphone could not start.'); });
  }
  function recStart() {
    if (st.busy || (st.rec && st.rec.state === 'recording')) return;
    stopPlay(); st.chunks = [];
    try {
      var mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].filter(function (m) { return root.MediaRecorder.isTypeSupported && root.MediaRecorder.isTypeSupported(m); })[0];
      st.rec = new root.MediaRecorder(st.stream, mime ? { mimeType: mime } : undefined);
    } catch (e) { smsg('🤔 Recording could not start.'); return; }
    st.rec.ondataavailable = function (e) { if (e.data && e.data.size) st.chunks.push(e.data); };
    st.rec.start(); st.t0 = Date.now(); st.stopT = setTimeout(recStop, MAX_REC); paintRec(); smsg('🔴 Recording… (up to 15 seconds)');
  }
  function recStop() {
    if (!st.rec || st.rec.state !== 'recording') return;
    clearTimeout(st.stopT); var rec = st.rec;
    rec.onstop = function () {
      if (Date.now() - st.t0 < 700) { paintRec(); smsg('⏱️ That was too short. Hold the button the whole time you talk.'); return; }
      convert(new Blob(st.chunks, { type: rec.mimeType || 'audio/webm' }));
    };
    rec.stop();
  }
  // decode what was recorded and write a small WAV (mono, 22 kHz): the format ElevenLabs reads best
  function toWav(blob) {
    var AC = root.AudioContext || root.webkitAudioContext;
    return blob.arrayBuffer().then(function (ab) { var c = new AC(); return c.decodeAudioData(ab).then(function (b) { try { c.close(); } catch (e) { /* ignore */ } return b; }); }).then(function (buf) {
      var sr = 22050, oc = new root.OfflineAudioContext(1, Math.max(sr, Math.ceil(buf.duration * sr)), sr), s = oc.createBufferSource();
      s.buffer = buf; s.connect(oc.destination); s.start(); return oc.startRendering();
    }).then(function (r) {
      var d = r.getChannelData(0), peak = 0, i; for (i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
      var g = peak > 0.01 && peak < 0.5 ? 0.8 / peak : 1;                                  // quiet microphone: lift it
      var out = new DataView(new ArrayBuffer(44 + d.length * 2)); function w(o, t) { for (var k = 0; k < t.length; k++) out.setUint8(o + k, t.charCodeAt(k)); }
      w(0, 'RIFF'); out.setUint32(4, 36 + d.length * 2, true); w(8, 'WAVEfmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
      out.setUint32(24, r.sampleRate, true); out.setUint32(28, r.sampleRate * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, d.length * 2, true);
      for (i = 0; i < d.length; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i] * g)) * 32767, true);
      return { blob: new Blob([out], { type: 'audio/wav' }), peak: peak };
    });
  }
  function convert(blob) {
    st.busy = true; paintRec(); smsg('🪄 Sending your voice to the character studio… (a few seconds)');
    var c = castOf(st.pick);
    toWav(blob).then(function (w) {
      if (w.peak < 0.015) throw { soft: '🤔 I could not hear you. Check the microphone, then try again.' };
      var fd = new FormData(); fd.append('character', c.k); fd.append('audio', w.blob, 'voice.wav');
      return fetch(fnUrl(), { method: 'POST', headers: hdrs(), body: fd });
    }).then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (d) { throw { status: r.status, d: d }; });
      var left = r.headers.get('x-left-today'); if (left != null) { st.left = Number(left); paintLeft(); }
      return r.arrayBuffer();
    }).then(function (ab) { return decode(ab); }).then(function (buf) {
      st.last = buf; st.busy = false; paintRec(); smsg('🎉 You are the <b>' + esc(c.n) + '</b>! Press ▶ to hear it again.'); playLast();
    }).catch(function (e) {
      st.busy = false; paintRec();
      if (e && e.soft) { smsg(e.soft); return; }
      if (e && e.status === 401) { clearPin(); studioStop(); pinCard('🔒 Wrong PIN.'); return; }
      if (e && e.status === 503) { studioStop(); setupCard((e.d && e.d.missing) || [], ''); return; }
      smsg('😕 ' + esc((e && e.d && e.d.message) || 'Something went wrong. Check the internet and try again.'));
    });
  }
  function pctx() {
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!st.pctx) { st.pctx = new AC(); if (st.pctx.setSinkId && prefs.out) { try { st.pctx.setSinkId(prefs.out).catch(function () { /* default speakers */ }); } catch (e) { /* ignore */ } } }
    if (st.pctx.state === 'suspended') st.pctx.resume();
    return st.pctx;
  }
  function decode(ab) { var c = pctx(); return new Promise(function (ok, no) { c.decodeAudioData(ab, ok, no); }); }
  function stopPlay() { if (st.play) { st.play(); st.play = null; } }
  function playLast() {
    if (!st.last) return; stopPlay();
    var c = pctx(), src = c.createBufferSource(), inp = c.createGain(), master = c.createGain(), comp = c.createDynamicsCompressor();
    master.gain.value = Math.max(0.3, prefs.vol) * 1.3; comp.threshold.value = -18; comp.ratio.value = 8;
    src.buffer = st.last; src.connect(inp); master.connect(comp); comp.connect(c.destination);
    var post = castOf(st.pick).post, chain = post ? build(c, inp, master, post) : null; if (!post) inp.connect(master);
    var done = false, stop = function () { if (done) return; done = true; try { src.stop(); } catch (e) { /* ended */ } try { src.disconnect(); inp.disconnect(); master.disconnect(); comp.disconnect(); } catch (e) { /* ignore */ } if (chain) chain.stop(); };
    src.onended = function () { setTimeout(function () { if (st.play === stop) st.play = null; stop(); }, post && post.echo ? 1800 : 100); };
    st.play = stop; src.start();
  }
  function studioStop() {
    clearTimeout(st.stopT); stopPlay();
    if (st.rec && st.rec.state === 'recording') { st.rec.onstop = null; try { st.rec.stop(); } catch (e) { /* ignore */ } }
    st.rec = null; st.busy = false;
    if (st.stream) { st.stream.getTracks().forEach(function (t) { t.stop(); }); st.stream = null; }
    if (st.pctx) { try { st.pctx.close(); } catch (e) { /* ignore */ } st.pctx = null; }
    st.last = null;
  }

  function open(which) {
    if (which === 'studio' && !STUDIO_ON) which = 'live';
    if ((which === 'live' || which === 'studio') && tab !== which) { stopMic(); studioStop(); tab = which; }
    render();
  }
  function close() { stopMic(); studioStop(); if (panel) { panel.remove(); panel = null; } tab = 'live'; }
  function toggle() { if (panel) close(); else open(); }

  // Space = hold to talk (only while the panel is open and the microphone is on)
  function typing(e) { var t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); }
  document.addEventListener('keydown', function (e) {
    if (!panel || e.code !== 'Space' || e.repeat || typing(e)) return;
    if (tab === 'live' && live && prefs.mode === 'hold') { e.preventDefault(); e.stopImmediatePropagation(); talk(true); }
    else if (tab === 'studio' && st.ui === 'main' && st.stream) { e.preventDefault(); e.stopImmediatePropagation(); recStart(); }
  }, true);
  document.addEventListener('keyup', function (e) {
    if (!panel || e.code !== 'Space') return;
    if (tab === 'live' && live && prefs.mode === 'hold') { e.preventDefault(); talk(false); }
    else if (tab === 'studio' && st.ui === 'main') { e.preventDefault(); recStop(); }
  }, true);
  window.addEventListener('pagehide', function () { stopMic(); studioStop(); });

  root.VoiceFX = { open: open, close: close, toggle: toggle, characters: FX, _build: build };
})(typeof window !== 'undefined' ? window : this);
