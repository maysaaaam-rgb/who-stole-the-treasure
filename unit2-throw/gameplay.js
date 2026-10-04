/* ==========================================================================
   ALLEY FLING: CATS VS DOGS - FULL GAMEPLAY ENGINE (gameplay.js)
   ESL Grades 3 & 4 (A1 Level)
   ========================================================================== */

function $(id) { return document.getElementById(id); }
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* URL parameters */
var urlParams = new URLSearchParams(window.location.search);
var paramGrade = urlParams.get('grade');

/* Load Saved Settings from LocalStorage */
var savedSettings = {};
try {
  var rawSaved = localStorage.getItem('alley_fling_settings_v2');
  if (rawSaved) savedSettings = JSON.parse(rawSaved) || {};
} catch (e) { savedSettings = {}; }

/* Game Configuration */
var cfg = {
  grade: (paramGrade === '4' || savedSettings.grade === '4') ? '4' : '3',
  mode: savedSettings.mode || 'team', // 'team', 'coop', 'quick', 'practice'
  arena: savedSettings.arena || 'alley', // 'alley', 'harvest', 'forest', 'moon', 'rooftop'
  turnsEach: Number(savedSettings.turnsEach) || 10,
  qType: savedSettings.qType || 'all',
  sound: (savedSettings.sound !== undefined) ? savedSettings.sound : true,
  music: (savedSettings.music !== undefined) ? savedSettings.music : false,
  calm: (savedSettings.calm !== undefined) ? savedSettings.calm : false,
  turnTimer: Number(savedSettings.turnTimer) || 0 // 0: off, 20, 40
};

/* ---------- AMMO: each throwable behaves differently ---------- */
var WIND_K = 42; // how strongly one wind step pushes a throw
var AMMO = {
  rock: { label: 'Rock',  emoji: '🪨', dmg: 35, wind: 0.25, grav: 1.18, speed: 0.93, bounce: 0, note: 'Heavy: hits hard, wind barely moves it', hit: 'rockhit' },
  fish: { label: 'Fish',  emoji: '🐟', dmg: 20, wind: 1.5,  grav: 0.86, speed: 1.06, bounce: 0, note: 'Light: flies far, wind pushes it a lot', art: 'fish', hit: 'splat' },
  yarn: { label: 'Yarn',  emoji: '🧶', dmg: 25, wind: 1.0,  grav: 1.0,  speed: 1.0,  bounce: 1, note: 'Bounces once on the ground', art: 'yarn', hit: 'bonk' },
  ball: { label: 'Ball',  emoji: '🎾', dmg: 25, wind: 0.9,  grav: 0.95, speed: 1.02, bounce: 2, note: 'Bounces twice', art: 'ball', hit: 'bonk' },
  bone: { label: 'Bone',  emoji: '🦴', dmg: 30, wind: 0.8,  grav: 1.0,  speed: 1.1,  bounce: 1, note: 'Fast and spinning', art: 'bone', hit: 'bonk' }
};
var AMMO_BY_SIDE = { cat: ['rock', 'fish', 'yarn'], dog: ['rock', 'bone', 'ball'] };

function saveConfig() {
  try {
    localStorage.setItem('alley_fling_settings_v2', JSON.stringify({
      grade: cfg.grade,
      mode: cfg.mode,
      arena: cfg.arena,
      turnsEach: cfg.turnsEach,
      qType: cfg.qType,
      sound: cfg.sound,
      music: cfg.music,
      calm: cfg.calm,
      turnTimer: cfg.turnTimer
    }));
  } catch (e) {}
}

/* Question Banks & Mastery Engine */
var compiledBanks = (typeof EXTRA_ENGINE !== 'undefined') ?
  EXTRA_ENGINE.compileBanks(window.ARC || {}, window.BQ || {}) : null;
var mastery = (typeof EXTRA_ENGINE !== 'undefined') ?
  EXTRA_ENGINE.createMasteryTracker() : null;
var taskSelector = (typeof EXTRA_ENGINE !== 'undefined') ?
  EXTRA_ENGINE.createTaskSelector(compiledBanks, cfg.grade) : null;

/* Game State */
var state = {
  turnCount: 0,
  maxTurns: 20,
  activeSide: 'cat', // 'cat' or 'dog'
  level: 1,
  wind: 0,
  ammo: { cat: 'fish', dog: 'ball' },
  lastAmmo: 'fish',
  energy: { cat: 100, dog: 100 },
  doubles: { cat: 1, dog: 1 },
  shields: { cat: 1, dog: 1 },
  askClass: { cat: 1, dog: 1 },
  doubleActive: { cat: false, dog: false },
  shieldActive: { cat: false, dog: false },
  streak: { cat: 0, dog: 0 },
  streakBonusGiven: { cat: false, dog: false },
  teammateBoost: { cat: false, dog: false },
  luckyWind: { cat: false, dog: false },
  comebackAssist: { cat: false, dog: false },
  comebackTurnsLeft: { cat: 0, dog: 0 },
  starsEarned: 0,
  angle: 45,
  power: 75,
  catRoster: [],
  dogRoster: [],
  outRoster: [],
  catIdx: 0,
  dogIdx: 0,
  currentTask: null,
  currentReward: 'normal',
  qAttempt: 1,
  builderPicked: [],
  spellingPicked: [],
  isAiming: false,
  isFlying: false,
  isPaused: false,
  turnTimerInterval: null,
  turnTimeRemaining: 0,
  quickTimerInterval: null,
  quickTimeRemaining: 300,
  quickHits: { cat: 0, dog: 0 },
  bossHP: 150,
  bossPhase: 1,
  obstacleActive: false,
  trampolineActive: false,
  crateActive: false,
  crateBonusGiven: false,
  lastWinningThrow: null,
  isSlowmoReplay: false,
  slingshotDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  handHintSeen: false
};

/* ==========================================================================
   WEB AUDIO API POLYPHONIC SYNTHESIZER
   ========================================================================== */
var audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) { audioCtx = new AudioContextClass(); if (window.SFX) SFX.init(audioCtx); }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function chord(freqs, duration, type, gainVal) {
  if (!cfg.sound) return;
  var ctx = getAudioContext();
  if (!ctx) return;

  type = type || 'triangle';
  gainVal = gainVal || 0.12;

  var masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.012);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  freqs.forEach(function (f) {
    var osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f, ctx.currentTime);
    osc.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  });
}

var sfxLast = {};
var noiseBuffer = null;
function getNoise(ctx) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
    var d = noiseBuffer.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}
// filtered noise burst: o = {dur, type, f0, f1, q, gain, attack}
function playNoise(o) {
  var ctx = getAudioContext();
  if (!ctx || !cfg.sound) return;
  var src = ctx.createBufferSource(); src.buffer = getNoise(ctx);
  var f = ctx.createBiquadFilter(); f.type = o.type || 'bandpass'; f.Q.value = o.q || 1;
  var t0 = ctx.currentTime, atk = o.attack || 0.01;
  f.frequency.setValueAtTime(o.f0, t0);
  f.frequency.exponentialRampToValueAtTime(Math.max(40, o.f1 || o.f0), t0 + o.dur);
  var g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(o.gain || 0.3, t0 + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(f); f.connect(g); g.connect(ctx.destination);
  src.start(t0); src.stop(t0 + o.dur + 0.05);
}
// quick tone with a pitch slide (for thumps and boings)
function playSlide(f0, f1, dur, type, gain) {
  var ctx = getAudioContext();
  if (!ctx || !cfg.sound) return;
  var o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime;
  o.type = type || 'sine';
  o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(gain || 0.3, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + dur + 0.03);
}

var lastTouchClickAt = -9999;
function sfx(name) {
  if (!cfg.sound) return;
  var nowMs = performance.now();
  if (name === 'click' && nowMs - lastTouchClickAt < 700) return;   // already played on touch-down
  if (sfxLast[name] && nowMs - sfxLast[name] < 160) return;
  sfxLast[name] = nowMs;
  var ctx = getAudioContext();
  if (!ctx) return;
  if (window.SFX && SFX.play(name)) return;   // the new sound set (sfx.js); the old code below is only a fallback

  switch (name) {
    case 'click':
      chord([523.25, 659.25], 0.08, 'sine', 0.08);
      break;
    case 'correct':
      // Ascending C-Major pentatonic chord
      chord([523.25, 659.25, 783.99, 1046.50], 0.45, 'triangle', 0.16);
      break;
    case 'wrong':
      // Warm descending two-tone chime
      chord([246.94, 220.00], 0.55, 'sine', 0.14);
      break;
    case 'fling':
      playNoise({ dur: 0.45, type: 'bandpass', f0: 500, f1: 2400, q: 1.4, gain: 0.45, attack: 0.05 });
      playSlide(260, 620, 0.3, 'sine', 0.12);
      break;
    case 'windgust':
      playNoise({ dur: 1.0, type: 'bandpass', f0: 300, f1: 900, q: 0.8, gain: 0.22, attack: 0.35 });
      break;
    case 'knock':
      playNoise({ dur: 0.14, type: 'lowpass', f0: 1400, f1: 500, q: 0.7, gain: 0.55 });
      playSlide(190, 120, 0.18, 'triangle', 0.4);
      break;
    case 'bonk':
      playSlide(380, 110, 0.24, 'triangle', 0.5);
      playNoise({ dur: 0.08, type: 'lowpass', f0: 2200, f1: 800, gain: 0.35 });
      chord([523.25, 659.25, 783.99], 0.4, 'triangle', 0.14);
      break;
    case 'rockhit':
      playSlide(160, 55, 0.3, 'sine', 0.7);
      playNoise({ dur: 0.16, type: 'lowpass', f0: 1800, f1: 400, gain: 0.5 });
      chord([392, 523.25], 0.3, 'triangle', 0.1);
      break;
    case 'splat':
      playNoise({ dur: 0.34, type: 'bandpass', f0: 1500, f1: 350, q: 1.2, gain: 0.55 });
      playSlide(300, 120, 0.2, 'sine', 0.3);
      chord([440, 554.37], 0.3, 'triangle', 0.1);
      break;
    case 'cheer':
      playNoise({ dur: 0.9, type: 'bandpass', f0: 1800, f1: 2400, q: 0.6, gain: 0.3, attack: 0.15 });
      chord([523.25, 659.25, 783.99, 1046.5], 0.7, 'triangle', 0.18);
      break;
    case 'hit':
      chord([261.63, 329.63, 523.25], 0.35, 'triangle', 0.18);
      break;
    case 'graze':
      chord([440, 554.37], 0.22, 'sine', 0.12);
      break;
    case 'boing':
      var bOsc = ctx.createOscillator();
      var bGain = ctx.createGain();
      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(180, ctx.currentTime);
      bOsc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.25);
      bGain.gain.setValueAtTime(0.15, ctx.currentTime);
      bGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      bOsc.connect(bGain);
      bGain.connect(ctx.destination);
      bOsc.start();
      bOsc.stop(ctx.currentTime + 0.25);
      break;
    case 'tink':
      chord([784, 1174.66], 0.22, 'sine', 0.08);
      break;
    case 'thud':
      playSlide(110, 50, 0.28, 'sine', 0.6);
      playNoise({ dur: 0.18, type: 'lowpass', f0: 700, f1: 200, gain: 0.45 });
      break;
    case 'shield':
      chord([659.25, 880, 1318.51], 0.4, 'sine', 0.15);
      break;
    case 'double':
      chord([440, 554.37, 659.25], 0.3, 'triangle', 0.14);
      break;
    case 'win':
      chord([523.25, 659.25, 783.99, 1046.50, 1318.51], 0.8, 'triangle', 0.2);
      break;
    case 'countdown':
      chord([440, 554.37], 0.12, 'sine', 0.1);
      break;
    case 'go':
      chord([523.25, 659.25, 783.99, 1046.5], 0.45, 'triangle', 0.22);
      break;
  }
}

function speakText(txt) {
  if (!cfg.sound || !window.speechSynthesis || !txt) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(txt);
  u.rate = 0.88;
  u.pitch = 1.05;
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

/* ==========================================================================
   PICTURE LOADER & ASSET POOL
   ========================================================================== */
var artAssets = {
  boss: {},
  cat: { idle: null, throw: null, hit: null, win: null },
  dog: { idle: null, throw: null, hit: null, win: null },
  projectiles: { yarn: null, fish: null, ball: null, bone: null },
  props: { bin: null, box: null, bowl: null, fence: null },
  bg: null
};

function tryLoadImage(paths, onSuccess, onFail) {
  var idx = 0;
  function attempt() {
    if (idx >= paths.length) {
      if (onFail) onFail();
      return;
    }
    var p = paths[idx];
    var img = new Image();
    img.onload = function () { onSuccess(p); };
    img.onerror = function () {
      idx++;
      attempt();
    };
    img.src = p;
  }
  attempt();
}

function loadArtAssets() {
  tryLoadImage(['art/cat.webp', 'art-new/cat.png'], function (p) {
    artAssets.cat.idle = p;
    updateCharacterPose('cat', 'idle');
    var mascot = $('title-cat-mascot');
    if (mascot) mascot.innerHTML = '<img src="' + p + '" alt="Cat">';
  });
  tryLoadImage(['art/cat_throw.webp', 'art-new/cat_throw.png'], function (p) { artAssets.cat.throw = p; });
  tryLoadImage(['art/cat_hit.webp', 'art-new/cat_hit.png'], function (p) { artAssets.cat.hit = p; });
  tryLoadImage(['art/cat_win.webp', 'art-new/cat_win.png'], function (p) { artAssets.cat.win = p; });

  tryLoadImage(['art/dog.webp', 'art-new/dog.png'], function (p) {
    artAssets.dog.idle = p;
    updateCharacterPose('dog', 'idle');
    var mascot = $('title-dog-mascot');
    if (mascot) mascot.innerHTML = '<img src="' + p + '" alt="Dog">';
  });
  tryLoadImage(['art/dog_throw.webp', 'art-new/dog_throw.png'], function (p) { artAssets.dog.throw = p; });
  tryLoadImage(['art/dog_hit.webp', 'art-new/dog_hit.png'], function (p) { artAssets.dog.hit = p; });
  tryLoadImage(['art/dog_win.webp', 'art-new/dog_win.png'], function (p) { artAssets.dog.win = p; });

  tryLoadImage(['art/yarn.webp', 'art-new/yarn.png'], function (p) { artAssets.projectiles.yarn = p; });
  tryLoadImage(['art/fish.webp', 'art-new/fish.png'], function (p) { artAssets.projectiles.fish = p; });
  tryLoadImage(['art/ball.webp', 'art-new/ball.png'], function (p) { artAssets.projectiles.ball = p; });
  tryLoadImage(['art/bone.webp', 'art-new/bone.png'], function (p) { artAssets.projectiles.bone = p; });

  tryLoadImage(['art/bin.webp', 'art-new/bin.png'], function (p) {
    artAssets.props.bin = p;
    var slot = $('bin-prop-slot');
    if (slot) slot.innerHTML = '<img src="' + p + '" style="max-height:10vh;" alt="Bin">';
  });
  tryLoadImage(['art/box.webp', 'art-new/box.png'], function (p) {
    artAssets.props.box = p;
    var slot = $('box-prop-slot');
    if (slot) slot.innerHTML = '<img src="' + p + '" style="max-height:9vh;" alt="Box">';
  });
  tryLoadImage(['art/bowl.webp', 'art-new/bowl.png'], function (p) {
    artAssets.props.bowl = p;
    var slot = $('bowl-prop-slot');
    if (slot) slot.innerHTML = '<img src="' + p + '" style="max-height:6vh;" alt="Bowl">';
  });
  buildFence();
  [['idle', 'boss'], ['throw', 'boss_throw'], ['hit', 'boss_hit'], ['phase2', 'boss_phase2'], ['phase3', 'boss_phase3'], ['win', 'boss_win']].forEach(function (pair) {
    tryLoadImage(['art/' + pair[1] + '.webp', 'art-new/' + pair[1] + '.png'], function (p) { artAssets.boss[pair[0]] = p; updateBossPose('idle', true); });
  });
  tryLoadImage(['art/bg.webp', 'art-new/bg.png'], function (p) {
    artAssets.bg = p;
    applyArenaTheme();
  });
}

/* Bin Boss: picture by pose (idle changes with the phase), emoji if no picture exists */
function updateBossPose(pose, force) {
  var sp = $('bin-boss-sprite');
  if (!sp) return;
  var key = pose;
  if (pose === 'idle') key = (state.bossPhase === 3 && artAssets.boss.phase3) ? 'phase3' : ((state.bossPhase === 2 && artAssets.boss.phase2) ? 'phase2' : 'idle');
  if (!force && sp.dataset.pose === key) return;
  sp.dataset.pose = key;
  var src = artAssets.boss[key] || artAssets.boss.idle;
  if (src) {
    sp.innerHTML = '<img src="' + src + '" alt="Bin Boss" style="width:100%;height:100%;object-fit:contain;">';
    sp.style.fontSize = '';
  } else {
    sp.textContent = pose === 'hit' ? '😵🗑️' : (pose === 'win' ? '🏳️🦝' : '🦝🗑️');
  }
}

function updateCharacterPose(side, pose) {
  var box = (side === 'cat') ? $('cat-art-box') : $('dog-art-box');
  if (!box) return;
  var imgPath = artAssets[side][pose];
  if (imgPath) {
    box.innerHTML = '<img src="' + imgPath + '" alt="' + side + ' ' + pose + '">';
  } else {
    var fallback = (side === 'cat') ? '🐱' : '🐶';
    if (pose === 'hit') fallback = '😵';
    if (pose === 'win') fallback = '🎉';
    if (pose === 'throw') fallback = (side === 'cat') ? '😼' : '🐕';
    box.innerHTML = '<div class="char-sticker-fallback">' + fallback + '</div>';
  }
}

/* ==========================================================================
   REACTION MEMES & EMOTES
   ========================================================================== */
var memeCache = {};
function triggerMeme(type, side) {
  var overlay = $('meme-overlay');
  var picBox = $('meme-pic-box');
  var capBox = $('meme-caption');
  var animal = (side === 'cat') ? 'cat' : 'dog';

  var faces = {
    win: ['cool', 'laugh', 'celebrate'],
    wrong: ['oops', 'shocked'],
    shield: ['cool'],
    graze: ['laugh', 'cool'],
    miss: ['oops']
  };
  var face = pick(faces[type] || ['cool']);
  var captions = {
    win: ['SUPER HIT!', 'WOW!', 'AMAZING!'],
    wrong: ['NICE TRY!', 'SO CLOSE!', 'KEEP GOING!'],
    shield: ['SHIELD SAVED!', 'NO DAMAGE!'],
    graze: ['GRAZED IT!', 'TAGGED!'],
    miss: ['BONK THE FENCE!', 'NEXT TIME!']
  };
  var caption = pick(captions[type] || ['GREAT!']);

  if (capBox) capBox.textContent = caption;
  var src = '../bamboozle/memes/' + animal + '_' + face + '.webp';

  function showOverlay() {
    overlay.classList.add('active');
    setTimeout(function () { overlay.classList.remove('active'); }, 1200);
  }
  function renderFallback() {
    var emojis = { cat: '🐱', dog: '🐶' };
    if (picBox) picBox.innerHTML = '<div class="char-sticker-fallback" style="width:140px;height:140px;font-size:80px;">' + (emojis[animal] || '🐱') + '</div>';
  }

  if (memeCache[src] === 'ok') {
    if (picBox) picBox.innerHTML = '<img src="' + src + '" alt="">';
    showOverlay();
  } else if (memeCache[src] === 'no') {
    renderFallback();
    showOverlay();
  } else {
    var img = new Image();
    img.onload = function () {
      memeCache[src] = 'ok';
      if (picBox) picBox.innerHTML = '<img src="' + src + '" alt="">';
      showOverlay();
    };
    img.onerror = function () {
      memeCache[src] = 'no';
      renderFallback();
      showOverlay();
    };
    img.src = src;
  }
}

/* ==========================================================================
   CLASS ROSTER & STORE INTEGRATION
   ========================================================================== */
var schoolHost = null;
try { schoolHost = (window.opener && window.opener.schoolStore) || null; } catch (e) { schoolHost = null; }
var schoolData = { classes: [], students: [], active: null };

(function initRosterData() {
  try {
    if (schoolHost) {
      schoolData.classes = schoolHost.getClasses() || [];
      schoolData.students = schoolHost.getStudents ? schoolHost.getStudents() : [];
      schoolData.active = schoolHost.getActiveClass && schoolHost.getActiveClass() && schoolHost.getActiveClass().id;
      if (!schoolData.students.length && schoolHost.getStudentsByClass) {
        schoolData.classes.forEach(function (c) {
          schoolData.students = schoolData.students.concat(schoolHost.getStudentsByClass(c.id));
        });
      }
    } else {
      var raw = localStorage.getItem('eaa_master_school_v6');
      if (raw) {
        var parsed = JSON.parse(raw);
        parsed = parsed.state || parsed;
        schoolData.classes = parsed.classes || [];
        schoolData.students = parsed.students || [];
        schoolData.active = parsed.activeClassId || null;
      }
    }
  } catch (e) { schoolData = { classes: [], students: [], active: null }; }
  schoolData.classes = (schoolData.classes || []).filter(function (c) {
    return c && !c.archived && c.grade !== 'System' && c.id;
  });
})();

var fallbackPupilNames = [
  'Alex', 'Bella', 'Charlie', 'Daisy', 'Ethan', 'Emma', 'George', 'Grace',
  'Harry', 'Jack', 'Leo', 'Lily', 'Maya', 'Noah', 'Oliver', 'Sophie'
];

function populateClasses() {
  var sel = $('class-select');
  if (!sel) return;
  if (schoolData.classes.length) {
    sel.innerHTML = schoolData.classes.map(function (c) {
      return '<option value="' + c.id + '">' + c.name + '</option>';
    }).join('');
    var matchGrade = schoolData.classes.filter(function (c) {
      return new RegExp(cfg.grade).test(c.name || '');
    });
    sel.value = (matchGrade[0] && matchGrade[0].id) || schoolData.classes[0].id;
  } else {
    sel.innerHTML = '<option value="">Default Class Roster</option>';
  }
  loadRosterAndSplit();
}

function loadRosterAndSplit() {
  var sel = $('class-select');
  var cid = sel ? sel.value : '';
  var names = [];
  if (cid) {
    names = schoolData.students
      .filter(function (s) { return s && !s.archived && s.classId === cid; })
      .map(function (s) {
        var fn = s.firstName || s.name || 'Pupil';
        return fn.split(' ')[0].trim();
      })
      .filter(Boolean);
  }
  if (!names.length) {
    names = fallbackPupilNames.slice();
  }

  var shuffled = shuffle(names);
  var mid = Math.ceil(shuffled.length / 2);
  state.catRoster = shuffled.slice(0, mid);
  state.dogRoster = shuffled.slice(mid);

  state.outRoster = [];
  if (!state.catRoster.length) state.catRoster = ['Cat Pupil'];
  if (!state.dogRoster.length) state.dogRoster = ['Dog Pupil'];

  renderTeamRosters();
}

function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

function renderTeamRosters() {
  var cc = $('cat-count'); if (cc) cc.textContent = state.catRoster.length;
  var dc = $('dog-count'); if (dc) dc.textContent = state.dogRoster.length;
  function pills(list, side) {
    return list.map(function (n, i) {
      return '<span class="roster-pill team-pill" data-side="' + side + '" data-i="' + i + '" title="Tap to move to the other team">' +
        '<b class="rp-name">' + esc(n) + '</b><button class="rp-x" data-act="out" title="Not playing today">✕</button></span>';
    }).join('');
  }
  var cr = $('cat-roster-names'); if (cr) cr.innerHTML = pills(state.catRoster, 'cat');
  var dr = $('dog-roster-names'); if (dr) dr.innerHTML = pills(state.dogRoster, 'dog');
  var orr = $('out-roster-names');
  if (orr) {
    orr.innerHTML = state.outRoster.length ? state.outRoster.map(function (n, i) {
      return '<span class="roster-pill out-pill" data-i="' + i + '"><b class="rp-name">' + esc(n) + '</b>' +
        '<button class="rp-to" data-to="cat" title="Add to Cats">🐱</button><button class="rp-to" data-to="dog" title="Add to Dogs">🐶</button></span>';
    }).join('') : '<span class="roster-empty">Nobody here. Tap ✕ on a name to take a pupil out.</span>';
  }
  var oc = $('out-count'); if (oc) oc.textContent = state.outRoster.length;
  var w = $('team-warning');
  if (w) w.textContent = (!state.catRoster.length || !state.dogRoster.length) ? '⚠️ Each team needs at least one pupil.' : '';
}

/* manual team editing: tap a name to swap team, ✕ to remove, 🐱/🐶 to add, type a name into a team */
function moveName(from, i, to) {
  var src = from === 'cat' ? state.catRoster : (from === 'dog' ? state.dogRoster : state.outRoster);
  var dst = to === 'cat' ? state.catRoster : (to === 'dog' ? state.dogRoster : state.outRoster);
  if (i < 0 || i >= src.length) return;
  dst.push(src.splice(i, 1)[0]);
  renderTeamRosters();
}
function addTypedName(side) {
  var inp = $(side + '-add-input');
  if (!inp) return;
  var name = inp.value.trim().split(/\s+/)[0];
  if (!name) return;
  (side === 'cat' ? state.catRoster : state.dogRoster).push(name);
  inp.value = '';
  sfx('click');
  renderTeamRosters();
  inp.focus();
}
function setupTeamEditing() {
  ['cat', 'dog'].forEach(function (side) {
    var box = $(side + '-roster-names');
    if (box) box.addEventListener('click', function (e) {
      var pill = e.target.closest('.team-pill'); if (!pill) return;
      var i = Number(pill.dataset.i);
      sfx('click');
      if (e.target.closest('.rp-x')) moveName(side, i, 'out');
      else moveName(side, i, side === 'cat' ? 'dog' : 'cat');
    });
    var btn = $(side + '-add-btn'); if (btn) btn.onclick = function () { addTypedName(side); };
    var inp = $(side + '-add-input'); if (inp) inp.onkeydown = function (e) { if (e.key === 'Enter') addTypedName(side); };
  });
  var ob = $('out-roster-names');
  if (ob) ob.addEventListener('click', function (e) {
    var b = e.target.closest('.rp-to'); if (!b) return;
    var pill = b.closest('.out-pill');
    sfx('click');
    moveName('out', Number(pill.dataset.i), b.dataset.to);
  });
  var pick = $('btn-pick-teams');
  if (pick) pick.onclick = function () {
    sfx('click');
    state.outRoster = state.outRoster.concat(state.catRoster, state.dogRoster);
    state.catRoster = []; state.dogRoster = [];
    renderTeamRosters();
  };
}

/* ==========================================================================
   GAMEPLAY & TURN CONTROLLER
   ========================================================================== */

function getActivePupilName() {
  if (cfg.mode === 'coop') {
    var allPupils = state.catRoster.concat(state.dogRoster);
    return allPupils[(state.catIdx + state.dogIdx) % allPupils.length];
  }
  if (state.activeSide === 'cat') {
    return state.catRoster[state.catIdx % state.catRoster.length];
  } else {
    return state.dogRoster[state.dogIdx % state.dogRoster.length];
  }
}

function applyArenaTheme() {
  var stage = $('alley-stage');
  if (!stage) return;
  stage.className = '';
  if (cfg.arena === 'harvest') stage.classList.add('arena-harvest');
  else if (cfg.arena === 'forest') stage.classList.add('arena-forest');
  else if (cfg.arena === 'moon') stage.classList.add('arena-moon');
  else if (cfg.arena === 'rooftop') stage.classList.add('arena-rooftop');
  else stage.classList.add('arena-alley');

  stage.style.backgroundImage = '';
  if (artAssets.bg) {
    stage.style.setProperty('--arena-bg', 'url("' + artAssets.bg + '")');
    stage.classList.add('has-bg');
  }
  var deco = $('arena-deco');
  if (deco) {
    var d = { moon: '🌙', harvest: '🌻', forest: '🌲', rooftop: '🌈' }[cfg.arena] || '';
    deco.textContent = d;
    deco.style.display = d ? 'block' : 'none';
  }
}

function updateHUD() {
  if (cfg.mode === 'coop') {
    $('cat-team-badge').textContent = '⭐ CLASS TEAM';
    $('dog-team-badge').textContent = '🦝 BIN BOSS';
    $('cat-team-badge').className = 'hud-team-badge cat-badge';
    $('dog-team-badge').className = 'hud-team-badge boss-badge';

    var catPct = Math.max(0, Math.min(100, state.energy.cat));
    var bossPct = Math.max(0, Math.min(100, Math.round((state.bossHP / 150) * 100)));

    $('cat-energy-fill').style.width = catPct + '%';
    $('cat-energy-txt').textContent = catPct + ' / 100';

    var bossFill = $('dog-energy-fill');
    bossFill.className = 'hud-energy-fill boss-energy';
    bossFill.style.width = bossPct + '%';
    $('dog-energy-txt').textContent = state.bossHP + ' / 150 (P' + state.bossPhase + ')';

    $('dog-active-name').textContent = 'Phase ' + state.bossPhase;
    $('bin-boss-zone').style.display = 'flex';
    updateBossPose('idle');
    $('dog-zone').style.display = 'none';

  } else {
    $('cat-team-badge').textContent = '🐱 CATS';
    $('dog-team-badge').textContent = 'DOGS 🐶';
    $('cat-team-badge').className = 'hud-team-badge cat-badge';
    $('dog-team-badge').className = 'hud-team-badge dog-badge';

    var catPct = Math.max(0, Math.min(100, state.energy.cat));
    var dogPct = Math.max(0, Math.min(100, state.energy.dog));

    $('cat-energy-fill').style.width = catPct + '%';
    $('cat-energy-fill').classList.toggle('energy-low', catPct <= 25);
    $('cat-energy-txt').textContent = catPct + ' / 100';

    var dogFill = $('dog-energy-fill');
    dogFill.className = 'hud-energy-fill dog-energy';
    dogFill.style.width = dogPct + '%';
    dogFill.classList.toggle('energy-low', dogPct <= 25);
    $('dog-energy-txt').textContent = dogPct + ' / 100';

    $('dog-active-name').textContent = state.dogRoster[state.dogIdx % state.dogRoster.length];
    $('bin-boss-zone').style.display = 'none';
    $('dog-zone').style.display = 'flex';
  }

  $('cat-active-name').textContent = (cfg.mode === 'coop') ? getActivePupilName() : state.catRoster[state.catIdx % state.catRoster.length];

  // Streak & Powerups
  $('cat-streak-badge').textContent = '🔥 Streak: ' + state.streak.cat;
  $('dog-streak-badge').textContent = '🔥 Streak: ' + state.streak.dog;

  $('cat-double-cnt').textContent = state.doubles.cat;
  $('dog-double-cnt').textContent = state.doubles.dog;
  $('cat-btn-double').disabled = (state.doubles.cat <= 0 || state.activeSide !== 'cat' || !state.isAiming);
  $('dog-btn-double').disabled = (state.doubles.dog <= 0 || state.activeSide !== 'dog' || !state.isAiming);
  $('cat-btn-double').classList.toggle('active', state.doubleActive.cat);
  $('dog-btn-double').classList.toggle('active', state.doubleActive.dog);

  $('cat-shield-cnt').textContent = state.shields.cat;
  $('dog-shield-cnt').textContent = state.shields.dog;
  $('cat-btn-shield').disabled = (state.shields.cat <= 0 || state.shieldActive.cat);
  $('dog-btn-shield').disabled = (state.shields.dog <= 0 || state.shieldActive.dog);
  $('cat-btn-shield').classList.toggle('shield-active', state.shieldActive.cat);
  $('dog-btn-shield').classList.toggle('shield-active', state.shieldActive.dog);
  $('cat-shield-bubble').classList.toggle('active', state.shieldActive.cat);
  $('dog-shield-bubble').classList.toggle('active', state.shieldActive.dog);

  $('cat-ask-cnt').textContent = state.askClass.cat;
  $('dog-ask-cnt').textContent = state.askClass.dog;
  $('cat-btn-ask').disabled = (state.askClass.cat <= 0 || state.activeSide !== 'cat' || state.isAiming);
  $('dog-btn-ask').disabled = (state.askClass.dog <= 0 || state.activeSide !== 'dog' || state.isAiming);

  // Round / Time Indicator
  if (cfg.mode === 'quick') {
    var m = Math.floor(state.quickTimeRemaining / 60);
    var s = state.quickTimeRemaining % 60;
    $('round-indicator').textContent = '⏱ ' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  } else if (cfg.mode === 'practice') {
    $('round-indicator').textContent = '🎯 PRACTICE';
  } else {
    var roundNum = Math.floor(state.turnCount / 2) + 1;
    var maxRounds = cfg.turnsEach;
    $('round-indicator').textContent = 'ROUND ' + Math.min(roundNum, maxRounds) + ' / ' + maxRounds;
  }

  // Wind Gauge
  var w = state.wind;
  var windAbs = Math.abs(w);
  $('wind-value-txt').textContent = 'WIND: ' + (w > 0 ? '+' : '') + w;
  $('wind-arrow-icon').textContent = (w > 0) ? '➡' : (w < 0 ? '⬅' : '●');
  $('wind-arrow-icon').style.color = (w > 0) ? '#0284c7' : (w < 0 ? '#ef4444' : '#64748b');

  var fillPct = (windAbs / 6) * 50;
  var fillLeft = (w >= 0) ? 50 : (50 - fillPct);
  $('wind-meter-fill').style.left = fillLeft + '%';
  $('wind-meter-fill').style.width = fillPct + '%';
  $('wind-meter-fill').style.background = (w > 0) ? '#0284c7' : '#ef4444';
  updateWindFx();
}

/* flag and blowing leaves show the wind on the scene */
function updateWindFx() {
  var w = state.wind, a = Math.min(6, Math.abs(w));
  var flag = $('wind-flag');
  if (flag) {
    flag.style.setProperty('--wdir', w < 0 ? -1 : 1);
    flag.style.setProperty('--wspeed', (2.8 - a * 0.22).toFixed(2) + 's');
    flag.style.setProperty('--wlift', (a * 12) + 'deg');
    flag.className = 'wind-flag' + (w === 0 ? ' calm' : '');
    var t = $('wind-flag-txt');
    if (t) t.textContent = w === 0 ? 'No wind' : (w < 0 ? '⬅ ' : '') + 'Wind ' + a + (w > 0 ? ' ➡' : '');
  }
  var lc = $('wind-leaves');
  if (lc && lc.dataset.w !== String(w)) {
    lc.dataset.w = String(w);
    lc.innerHTML = '';
    lc.className = 'wind-leaves ' + (w < 0 ? 'left' : 'right');
    var n = (a >= 1 && !cfg.calm) ? Math.min(5, 1 + Math.ceil(a / 2)) : 0;
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('span');
      sp.className = 'wind-leaf';
      sp.textContent = ['🍃', '🍂', '🍃'][i % 3];
      sp.style.top = (8 + Math.random() * 62) + '%';
      sp.style.animationDuration = Math.max(7, 15 - a * 1.2).toFixed(1) + 's';
      sp.style.animationDelay = (-Math.random() * 12).toFixed(1) + 's';
      lc.appendChild(sp);
    }
  }
}

function randomWind(minAbs, maxAbs) {
  var m = minAbs + Math.floor(Math.random() * (maxAbs - minAbs + 1));
  return (Math.random() < 0.5 ? -1 : 1) * m;
}

function updateDifficultyRamp() {
  var prevLevel = state.level;
  if (state.turnCount <= 3) {
    state.level = 1;
    state.wind = Math.floor(Math.random() * 5) - 2;      // -2 .. +2
  } else if (state.turnCount <= 8) {
    state.level = 2;
    state.wind = randomWind(1, 4);                       // always some wind
  } else {
    state.level = 3;
    state.wind = randomWind(3, 6);                       // strong wind
  }

  var fenceWrap = $('fence-wrap');
  if (fenceWrap) {
    if (state.level === 1) {
      fenceWrap.style.height = '34vh';
      $('fence-level-label').textContent = 'Level 1';
    } else if (state.level === 2) {
      fenceWrap.style.height = '46vh';
      $('fence-level-label').textContent = 'Level 2';
    } else {
      fenceWrap.style.height = '58vh';
      $('fence-level-label').textContent = 'Level 3';
    }
  }

  // Moving obstacle (Level 2+)
  var obs = $('moving-obstacle');
  if (obs) {
    if (state.level >= 2) {
      obs.style.display = 'flex';
      state.obstacleActive = true;
    } else {
      obs.style.display = 'none';
      state.obstacleActive = false;
    }
  }

  // Mystery crate (Every 3-4 turns)
  var crate = $('mystery-crate');
  if (crate) {
    if (state.turnCount > 1 && state.turnCount % 3 === 0 && !state.crateBonusGiven) {
      crate.style.display = 'flex';
      state.crateActive = true;
    } else {
      crate.style.display = 'none';
      state.crateActive = false;
    }
  }

  // Trampoline
  var tramp = $('trampoline-prop');
  if (tramp) {
    if (state.level === 3 && state.turnCount % 2 === 1) {
      tramp.style.display = 'block';
      state.trampolineActive = true;
    } else {
      tramp.style.display = 'none';
      state.trampolineActive = false;
    }
  }

  if (state.level > prevLevel) {
    sfx('win');
  }
}

function startTurn() {
  if (checkGameOver()) return;
  hidePullZone();

  state.isAiming = false;
  state.isFlying = false;
  $('aim-dock').classList.remove('active');
  $('q-overlay').classList.remove('active');
  $('aim-hand-hint').style.display = 'none';

  updateCharacterPose('cat', 'idle');
  updateCharacterPose('dog', 'idle');

  updateDifficultyRamp();
  updateHUD();

  var pupil = getActivePupilName();
  var teamName = (cfg.mode === 'coop') ? '⭐ Class Team' :
    ((state.activeSide === 'cat') ? '🐱 Cats' : '🐶 Dogs');

  // Pupil Highlight Card
  var popup = $('pupil-highlight-popup');
  if (popup) {
    $('pupil-hl-team').textContent = teamName + ' Turn';
    $('pupil-hl-name').textContent = pupil;
    popup.style.display = 'block';
  }

  sfx('click');

  setTimeout(function () {
    if (popup) popup.style.display = 'none';
    presentQuestion();
  }, 900);
}

function getNextTask() {
  var enabled = [];
  if (cfg.qType === 'all') {
    enabled = ['listen', 'word_pic', 'builder', 'spelling', 'speaking', 'grammar', 'reading'];
  } else {
    enabled = [cfg.qType];
  }
  if (!taskSelector && typeof EXTRA_ENGINE !== 'undefined') {
    taskSelector = EXTRA_ENGINE.createTaskSelector(compiledBanks, cfg.grade);
  }
  return taskSelector ? taskSelector.getNextTask(state.level, enabled) : null;
}

function presentQuestion(optionalTask) {
  state.currentTask = optionalTask || getNextTask();
  if (!state.currentTask) {
    passTurnToNext();
    return;
  }

  state.qAttempt = 1;
  state.builderPicked = [];
  state.spellingPicked = [];

  var isCat = (state.activeSide === 'cat');
  var pill = $('q-team-pill');
  pill.textContent = (cfg.mode === 'coop' ? '⭐ Class · ' : (isCat ? '🐱 Cats · ' : '🐶 Dogs · ')) + getActivePupilName();
  pill.className = 'q-team-pill ' + (isCat ? '' : 'dog-team');

  // Badges
  $('q-skill-badge').textContent = state.currentTask.skill;
  var rewardLabels = {
    normal: '🐟 Fish/Bone (Normal)',
    quick: '⚡ Quick Throw',
    big: '🍉 Big Throw (35 DMG)',
    curve: '🌀 Curve Throw',
    rainbow: '🌈 Rainbow Throw (40 DMG)',
    shield_breaker: '⚡ Shield-Breaker'
  };
  $('q-reward-badge').textContent = rewardLabels[state.currentTask.reward] || '🎯 Normal Throw';
  state.currentReward = state.currentTask.reward || 'normal';

  $('q-text-box').textContent = state.currentTask.q;
  $('q-msg-box').textContent = '';

  // Reading Passage
  var passBox = $('q-passage-box');
  if (state.currentTask.passage) {
    passBox.textContent = state.currentTask.passage;
    passBox.style.display = 'block';
  } else {
    passBox.style.display = 'none';
  }

  // Pic Box
  var picBox = $('q-pic-box');
  if (state.currentTask.pic) {
    picBox.textContent = state.currentTask.pic;
    picBox.style.display = 'block';
  } else {
    picBox.style.display = 'none';
  }

  // Hide all task containers first
  $('q-options-box').style.display = 'none';
  $('q-builder-container').style.display = 'none';
  $('q-spelling-container').style.display = 'none';
  $('q-speaking-container').style.display = 'none';

  // 1. Sentence Builder
  if (state.currentTask.type === 'builder') {
    renderBuilderTask(state.currentTask);
  }
  // 2. Spelling Builder
  else if (state.currentTask.type === 'spelling') {
    renderSpellingTask(state.currentTask);
  }
  // 3. Speaking Oral Task
  else if (state.currentTask.type === 'speaking') {
    renderSpeakingTask(state.currentTask);
  }
  // 4. Multiple Choice (Listen, Word-Pic, Grammar, Reading)
  else {
    renderMultipleChoiceTask(state.currentTask);
  }

  $('q-overlay').classList.add('active');

  // Turn Timer
  if (cfg.turnTimer > 0) {
    startTurnTimer(cfg.turnTimer);
  }

  // Audio prompt for listening
  if (state.currentTask.skill === 'Listening' && state.currentTask.say) {
    setTimeout(function () {
      speakText(state.currentTask.say);
    }, 400);
  }
}

function renderMultipleChoiceTask(task) {
  var optsBox = $('q-options-box');
  optsBox.style.display = 'grid';
  optsBox.innerHTML = task.options.map(function (optText, i) {
    var letters = ['A', 'B', 'C', 'D'];
    return '<button class="q-opt' + (/^[^A-Za-z0-9]+$/.test(String(optText).trim()) ? ' emoji-opt' : '') + '" data-opt="' + optText.replace(/"/g, '&quot;') + '" data-idx="' + i + '">' +
      '<span style="opacity:0.8; margin-right:0.6vw;">' + letters[i] + ')</span> ' + optText +
      '</button>';
  }).join('');

  document.querySelectorAll('.q-opt').forEach(function (btn) {
    btn.onclick = function () {
      handleAnswerClick(btn.dataset.opt, btn);
    };
  });
}

function renderBuilderTask(task) {
  var container = $('q-builder-container');
  container.style.display = 'flex';

  var tray = $('builder-tray');
  var bank = $('builder-bank');
  tray.innerHTML = '<span style="opacity:0.5; font-style:italic;">Tap words below in order...</span>';

  bank.innerHTML = task.tokens.map(function (tok, idx) {
    return '<button class="builder-tile" data-token="' + tok.replace(/"/g, '&quot;') + '" data-idx="' + idx + '">' + tok + '</button>';
  }).join('');

  state.builderPicked = [];

  function updateTray() {
    if (!state.builderPicked.length) {
      tray.innerHTML = '<span style="opacity:0.5; font-style:italic;">Tap words below in order...</span>';
    } else {
      tray.innerHTML = state.builderPicked.map(function (tok) {
        return '<span class="builder-tile" style="cursor:default;">' + tok + '</span>';
      }).join('');
    }
  }

  document.querySelectorAll('.builder-bank .builder-tile').forEach(function (btn) {
    btn.onclick = function () {
      sfx('click');
      btn.classList.add('used');
      state.builderPicked.push(btn.dataset.token);
      updateTray();
    };
  });

  $('btn-builder-undo').onclick = function () {
    if (!state.builderPicked.length) return;
    sfx('click');
    var popped = state.builderPicked.pop();
    updateTray();
    var usedBtns = document.querySelectorAll('.builder-bank .builder-tile.used');
    for (var i = usedBtns.length - 1; i >= 0; i--) {
      if (usedBtns[i].dataset.token === popped) {
        usedBtns[i].classList.remove('used');
        break;
      }
    }
  };

  $('btn-builder-clear').onclick = function () {
    sfx('click');
    state.builderPicked = [];
    updateTray();
    document.querySelectorAll('.builder-bank .builder-tile.used').forEach(function (b) {
      b.classList.remove('used');
    });
  };

  $('btn-builder-check').onclick = function () {
    var pupilSentence = state.builderPicked.join(' ');
    var isCorrect = (pupilSentence === task.a);
    handleTaskAnswer(isCorrect, pupilSentence, task.a);
  };
}

function renderSpellingTask(task) {
  var container = $('q-spelling-container');
  container.style.display = 'flex';

  var slotsBox = $('spelling-slots');
  var poolBox = $('spelling-pool');

  var targetLen = task.targetWord.length;
  slotsBox.innerHTML = '';
  for (var i = 0; i < targetLen; i++) {
    slotsBox.innerHTML += '<div class="spelling-slot" id="spell-slot-' + i + '">_</div>';
  }

  poolBox.innerHTML = task.letters.map(function (ch, idx) {
    return '<button class="spelling-letter-btn" data-char="' + ch + '" data-idx="' + idx + '">' + ch + '</button>';
  }).join('');

  state.spellingPicked = [];

  function updateSlots() {
    for (var i = 0; i < targetLen; i++) {
      var slot = $('spell-slot-' + i);
      if (slot) slot.textContent = state.spellingPicked[i] ? state.spellingPicked[i].ch : '_';
    }
  }

  document.querySelectorAll('.spelling-letter-btn').forEach(function (btn) {
    btn.onclick = function () {
      if (state.spellingPicked.length >= targetLen) return;
      sfx('click');
      btn.classList.add('used');
      state.spellingPicked.push({ ch: btn.dataset.char, btn: btn });
      updateSlots();
    };
  });

  $('btn-spelling-back').onclick = function () {
    if (!state.spellingPicked.length) return;
    sfx('click');
    var popped = state.spellingPicked.pop();
    if (popped && popped.btn) popped.btn.classList.remove('used');
    updateSlots();
  };

  $('btn-spelling-clear').onclick = function () {
    sfx('click');
    state.spellingPicked.forEach(function (item) {
      if (item && item.btn) item.btn.classList.remove('used');
    });
    state.spellingPicked = [];
    updateSlots();
  };

  $('btn-spelling-check').onclick = function () {
    var pupilWord = state.spellingPicked.map(function (x) { return x.ch; }).join('');
    var isCorrect = (pupilWord === task.targetWord);
    handleTaskAnswer(isCorrect, pupilWord, task.targetWord);
  };
}

function renderSpeakingTask(task) {
  var container = $('q-speaking-container');
  container.style.display = 'flex';

  $('speaking-prompt-box').textContent = '🗣️ ' + task.q;
  $('speaking-model-hint').textContent = 'Teacher hint: "' + task.modelSentence + '"';

  $('btn-speaking-pass').onclick = function () {
    sfx('correct');
    handleTaskAnswer(true, task.word, task.word);
  };
  $('btn-speaking-retry').onclick = function () {
    sfx('wrong');
    handleTaskAnswer(false, 'retry', task.word);
  };
}

function handleAnswerClick(selectedOption, optButton) {
  var task = state.currentTask;
  var isCorrect = (selectedOption === task.a);
  if (optButton) {
    if (isCorrect) optButton.classList.add('correct-reveal');
    else optButton.classList.add('wrong');
  }
  handleTaskAnswer(isCorrect, selectedOption, task.a);
}

function handleTaskAnswer(isCorrect, pupilAnswer, correctAnswer) {
  var task = state.currentTask;
  var side = state.activeSide;

  if (state.turnTimerInterval) {
    clearInterval(state.turnTimerInterval);
    state.turnTimerInterval = null;
  }

  if (isCorrect) {
    sfx('correct');
    triggerMeme('win', side);

    var isFirst = (state.qAttempt === 1);
    if (mastery) mastery.recordAttempt(task, 'correct', isFirst);

    if (isFirst) {
      state.streak[side]++;
      state.starsEarned++;

      if (state.streak[side] === 3) {
        state.doubles[side]++;
        $('q-msg-box').textContent = '🔥 3 in a row! Bonus ×2 Double earned!';
      } else if (state.streak[side] === 5) {
        state.luckyWind[side] = true;
        $('q-msg-box').textContent = '🍀 5 Streak! Lucky Wind earned (no wind on next throw)!';
      } else {
        $('q-msg-box').textContent = '⭐ Correct! Full power throw earned!';
      }
    } else {
      $('q-msg-box').textContent = '✔ Good job! Throw ready!';
    }

    setTimeout(function () {
      $('q-overlay').classList.remove('active');
      openAimingTray(state.qAttempt === 1 ? 100 : 80);
    }, 1200);

  } else {
    sfx('wrong');
    state.streak[side] = 0;

    if (state.qAttempt === 1) {
      state.qAttempt = 2;
      $('q-msg-box').textContent = 'Oops! Try again!';
      triggerMeme('wrong', side);
    } else {
      if (mastery) mastery.recordAttempt(task, 'wrong', false);
      $('q-msg-box').textContent = 'Good try! The answer was: ' + correctAnswer;
      speakText('The answer is: ' + correctAnswer);

      setTimeout(function () {
        $('q-overlay').classList.remove('active');
        passTurnToNext();
      }, 2200);
    }
  }
  updateHUD();
}

function startTurnTimer(seconds) {
  if (state.turnTimerInterval) clearInterval(state.turnTimerInterval);
  state.turnTimeRemaining = seconds;
  var tb = $('tt-timer');
  if (tb) tb.textContent = '⏱ ' + state.turnTimeRemaining + 's';

  state.turnTimerInterval = setInterval(function () {
    if (state.isPaused) return;
    state.turnTimeRemaining--;
    if (tb) tb.textContent = '⏱ ' + state.turnTimeRemaining + 's';
    if (state.turnTimeRemaining <= 0) {
      clearInterval(state.turnTimerInterval);
      state.turnTimerInterval = null;
      if (tb) tb.textContent = '⏱ 0s';
      sfx('wrong');
      $('q-msg-box').textContent = 'Time up! Passing to next turn!';
      setTimeout(function () {
        $('q-overlay').classList.remove('active');
        passTurnToNext();
      }, 1500);
    }
  }, 1000);
}

function buildAmmoPicker() {
  var row = $('ammo-row');
  if (!row) return;
  var side = state.activeSide, keys = AMMO_BY_SIDE[side] || AMMO_BY_SIDE.cat;
  if (keys.indexOf(state.ammo[side]) < 0) state.ammo[side] = keys[0];
  row.innerHTML = '';
  keys.forEach(function (k) {
    var a = AMMO[k], b = document.createElement('button');
    b.className = 'ammo-btn' + (state.ammo[side] === k ? ' sel' : '');
    b.innerHTML = '<span class="am-e">' + a.emoji + '</span><span class="am-t">' + a.label + ' · ' + a.dmg + '<small>' + a.note + '</small></span>';
    b.title = a.note;
    b.onclick = function () {
      state.ammo[side] = k; sfx('click'); showAmmoNote();
      Array.prototype.forEach.call(row.children, function (c) { c.classList.remove('sel'); });
      b.classList.add('sel');
    };
    row.appendChild(b);
  });
  showAmmoNote();
}

function showAmmoNote() {
  var h = $('aim-wind-hint'), a = AMMO[state.ammo[state.activeSide]];
  if (h && a) h.textContent = a.emoji + ' ' + a.note;
}

function openAimingTray(maxPowerCap) {
  state.isAiming = true;
  state.isFlying = false;

  var pupil = getActivePupilName();
  var charName = (state.activeSide === 'cat') ? 'Cat' : 'Dog';
  $('aim-guide-txt').textContent = '👆 ' + pupil + ': touch, pull back and let go!';

  // Comeback assist check
  var myEnergy = state.energy[state.activeSide];
  var oppSide = (state.activeSide === 'cat') ? 'dog' : 'cat';
  var oppEnergy = state.energy[oppSide];
  if (oppEnergy - myEnergy >= 50 && state.comebackTurnsLeft[state.activeSide] <= 0) {
    state.comebackAssist[state.activeSide] = true;
    state.comebackTurnsLeft[state.activeSide] = 2;
    state.doubles[state.activeSide]++;
    showComicBubble('Super comeback power! 💪', 500, 300);
  }

  $('power-slider').max = maxPowerCap;
  if (state.power > maxPowerCap) state.power = maxPowerCap;
  $('power-slider').value = state.power;
  $('aim-power-val').textContent = state.power + '%';

  buildAmmoPicker();
  if (Math.abs(state.wind) >= 2) sfx('windgust');
  $('aim-dock').classList.add('active');
  setTimeout(showPullZone, 60);
  updateHUD();
  drawPreviewArc();

  if (!state.handHintSeen) {
    state.handHintSeen = true;
    var activeBox = (state.activeSide === 'cat') ? $('cat-char-box') : $('dog-char-box');
    if (activeBox) {
      var rect = activeBox.getBoundingClientRect();
      var stageRect = $('alley-stage').getBoundingClientRect();
      var hint = $('aim-hand-hint');
      if (hint) {
        hint.style.left = (rect.left - stageRect.left + rect.width * 0.4) + 'px';
        hint.style.top = (rect.top - stageRect.top + rect.height * 0.3) + 'px';
        hint.style.display = 'block';
        setTimeout(function () { hint.style.display = 'none'; }, 2600);
      }
    }
  }
}

/* ==========================================================================
   PHYSICS SIMULATION & FLING ANIMATION
   ========================================================================== */

var canvas = $('physics-canvas');
var ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
  var stage = $('alley-stage');
  if (!canvas || !stage) return;
  canvas.width = stage.clientWidth;
  canvas.height = stage.clientHeight;
  drawPreviewArc();
}
window.addEventListener('resize', resizeCanvas);

function toCanvasCoords(vx, vy) {
  if (!canvas) return { x: vx, y: vy };
  return {
    x: (vx / 1000) * canvas.width,
    y: (vy / 600) * canvas.height
  };
}

/* Real geometry: positions are measured from the characters and fence that are actually drawn,
   so what you see is exactly what the physics uses (virtual space is 1000 x 600 over the canvas). */
function buildFence() {
  var slot = $('fence-display');
  if (!slot || slot.dataset.built) return;
  slot.dataset.built = '1';
  var boards = '';
  for (var i = 0; i < 5; i++) boards += '<div class="fz-board"></div>';
  slot.innerHTML = '<div class="fz"><div class="fz-boards">' + boards + '</div><div class="fz-rail r1"></div><div class="fz-rail r2"></div><div class="fz-post pl"></div><div class="fz-post pr"></div></div>';
}

function getGeom(fromCat) {
  var r = canvas.getBoundingClientRect();
  function V(cx, cy) { return { x: (cx - r.left) / r.width * 1000, y: (cy - r.top) / r.height * 600 }; }
  function box(id) { var e = $(id); return e ? e.getBoundingClientRect() : null; }
  var catB = box('cat-art-box'), dogB = box('dog-art-box'), fenceB = box('fence-wrap');
  var oppB = (cfg.mode === 'coop') ? (box('bin-boss-sprite') || dogB) : (fromCat ? dogB : catB);
  var myB = fromCat ? catB : dogB;
  var g = { r: r, V: V };
  g.start = V(myB.left + myB.width * (fromCat ? 0.80 : 0.20), myB.top + myB.height * 0.30);
  g.opp = {
    cx: oppB.left + oppB.width / 2, cy: oppB.top + oppB.height * 0.55,
    rx: Math.max(22, oppB.width * 0.34), ry: Math.max(22, oppB.height * 0.40)
  };
  var oc = V(g.opp.cx, g.opp.cy); g.opp.vx = oc.x; g.opp.vy = oc.y;
  var fx1 = V(fenceB.left + fenceB.width * 0.22, 0), fx2 = V(fenceB.right - fenceB.width * 0.22, 0), ft = V(0, fenceB.top + fenceB.height * 0.05);
  g.fence = { x1: fx1.x, x2: fx2.x, topY: ft.y };
  var gr = V(0, Math.max(catB.bottom, dogB.bottom) - catB.height * 0.04);
  g.groundY = gr.y;
  return g;
}

function getFenceVirtualBounds() {
  var g = getGeom(true);
  return { x1: g.fence.x1, x2: g.fence.x2, topY: g.fence.topY };
}

function drawPreviewArc() {
  if (!canvas || !ctx) return;
  if (!state.isAiming || state.isFlying) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var isCat = (state.activeSide === 'cat');
  var PG = getGeom(isCat);
  var startX = PG.start.x;
  var startY = PG.start.y;

  if (state.slingshotDragging && state.dragNow) {
    var anchorX = PG.r.left + startX / 1000 * PG.r.width - PG.r.left, anchorY = PG.r.top + startY / 600 * PG.r.height - PG.r.top;
    var ddx = state.dragNow.x - state.dragStartX, ddy = state.dragNow.y - state.dragStartY;
    var px = anchorX + ddx, py = anchorY + ddy;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3d220e'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(anchorX, anchorY); ctx.lineTo(px, py); ctx.stroke();
    ctx.strokeStyle = '#c98a4b'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(anchorX, anchorY); ctx.lineTo(px, py); ctx.stroke();
    ctx.font = Math.round(Math.max(30, canvas.height * 0.06)) + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText((AMMO[state.ammo[state.activeSide]] || AMMO.fish).emoji, px, py);
    var label = 'Power ' + state.power + '%   Angle ' + state.angle + '°';
    ctx.font = '800 ' + Math.round(Math.max(16, canvas.height * 0.032)) + 'px sans-serif';
    ctx.lineWidth = 6; ctx.strokeStyle = '#26215c'; ctx.fillStyle = '#fff';
    var ly = Math.max(24, anchorY - canvas.height * 0.22);
    var lw = ctx.measureText(label).width, lx = Math.max(lw / 2 + 12, Math.min(canvas.width - lw / 2 - 12, anchorX));
    ctx.strokeText(label, lx, ly); ctx.fillText(label, lx, ly);
    ctx.restore();
  }

  var angleRad = state.angle * Math.PI / 180;
  var v0 = 500 + (state.power / 100) * 650;
  var vx = (isCat ? 1 : -1) * v0 * Math.cos(angleRad);
  var vy = -v0 * Math.sin(angleRad);

  var effectiveWind = state.luckyWind[state.activeSide] ? 0 : state.wind;
  var aw = effectiveWind * 20;
  var g = 950;
  var dt = 0.02;

  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 5;
  ctx.strokeStyle = isCat ? '#ea580c' : '#2563eb';

  ctx.beginPath();
  var p0 = toCanvasCoords(startX, startY);
  ctx.moveTo(p0.x, p0.y);

  var curX = startX, curY = startY;
  // Arc displays initial portion of flight
  var stubSteps = (state.level === 1) ? 5 : 2;
  for (var i = 0; i < stubSteps; i++) {
    var gustF = (state.level === 3) ? 1 + 0.3 * Math.sin((performance.now() - flightStart) / 330) : 1;
    vx += aw * gustF * dt;
    vy += g * dt;
    curX += vx * dt;
    curY += vy * dt;
    var pt = toCanvasCoords(curX, curY);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
  ctx.restore();
}

function launchFling() {
  if (!state.isAiming || state.isFlying) return;
  hidePullZone();
  state.isAiming = false;
  state.isFlying = true;
  $('aim-dock').classList.remove('active');
  $('aim-hand-hint').style.display = 'none';

  sfx('fling');
  var isCat = (state.activeSide === 'cat');
  var throwSide = isCat ? 'cat' : 'dog';
  var throwBox = isCat ? $('cat-char-box') : $('dog-char-box');

  updateCharacterPose(throwSide, 'throw');
  if (throwBox) {
    throwBox.classList.add('throw');
    setTimeout(function () {
      throwBox.classList.remove('throw');
      updateCharacterPose(throwSide, 'idle');
    }, 600);
  }

  var G = getGeom(isCat);
  var startX = G.start.x;
  var startY = G.start.y;
  var angleRad = state.angle * Math.PI / 180;

  var speedFactor = (state.currentReward === 'quick') ? 1.25 :
    ((state.currentReward === 'big') ? 0.88 : 1.0);
  var ammoKey = state.ammo[state.activeSide] || 'fish';
  var AM = AMMO[ammoKey] || AMMO.fish;
  state.lastAmmo = ammoKey;
  var v0 = (500 + (state.power / 100) * 650) * speedFactor * AM.speed;
  var vx = (isCat ? 1 : -1) * v0 * Math.cos(angleRad);
  var vy = -v0 * Math.sin(angleRad);

  var effectiveWind = state.luckyWind[state.activeSide] ? 0 : state.wind;
  state.luckyWind[state.activeSide] = false;
  var aw = effectiveWind * WIND_K * AM.wind;
  var g = 950 * AM.grav;

  var opponentX = G.opp.vx;
  var opponentY = G.opp.vy;
  var hitScale = (state.currentReward === 'big') ? 1.35 :
    (state.comebackAssist[state.activeSide] ? 1.2 : 1.0);
  function oppNorm(px, py) {
    var sx = G.r.left + px / 1000 * G.r.width, sy = G.r.top + py / 600 * G.r.height;
    var ddx = (sx - G.opp.cx) / (G.opp.rx * hitScale), ddy = (sy - G.opp.cy) / (G.opp.ry * hitScale);
    return { d: Math.hypot(ddx, ddy), dy: ddy };
  }
  var groundY = G.groundY;
  var fence = G.fence;
  // does the flying object touch a drawn element (bird, trampoline, crate)? Uses the live position on screen.
  function touchesEl(id, px, py, pad) {
    var e = $(id); if (!e) return false;
    var b = e.getBoundingClientRect(); if (!b.width) return false;
    var sx = G.r.left + px / 1000 * G.r.width, sy = G.r.top + py / 600 * G.r.height;
    return sx >= b.left - pad && sx <= b.right + pad && sy >= b.top - pad && sy <= b.bottom + pad;
  }

  // Projectile appearance: the chosen ammo, unless a special reward replaces it
  var projImg = AM.art ? artAssets.projectiles[AM.art] : null;
  var projEmoji = AM.emoji;
  if (state.currentReward === 'rainbow') { projEmoji = '🌈'; projImg = null; }
  if (state.currentReward === 'big') { projEmoji = '🍉'; projImg = null; }

  var curX = startX, curY = startY;
  var rotation = 0;
  var bounces = 0;
  var lastTime = performance.now();
  var dodgeTriggered = false;
  var birdHit = false, trampHit = false, fenceBounced = false, flightStart = performance.now();

  function animLoop(now) {
    // Small fixed steps (about 8 ms): the result never depends on the frame rate, and the
    // object cannot jump over the fence or a character on a slow computer.
    var dtFull = (now - lastTime) / 1000;
    if (dtFull > 0.05) dtFull = 0.05;
    lastTime = now;
    var nSteps = Math.max(1, Math.ceil(dtFull / 0.008));
    var dt = dtFull / nSteps;
    for (var stepI = 0; stepI < nSteps; stepI++) {
    vx += aw * dt;
    vy += g * dt;

    // Curve throw lift effect
    if (state.currentReward === 'curve') {
      vy -= 260 * dt;
    }

    curX += vx * dt;
    curY += vy * dt;
    rotation += (isCat ? 9 : -9) * dt;

    // Defending character dodge animation when near
    var oppN = oppNorm(curX, curY);
    if (oppN.d <= 2.6 && !dodgeTriggered) {
      dodgeTriggered = true;
      var defBox = isCat ? $('dog-char-box') : $('cat-char-box');
      if (defBox) {
        defBox.classList.add('dodge');
        setTimeout(function () { defBox.classList.remove('dodge'); }, 500);
      }
    }

    // Moving Obstacle Collision (Bird)
    if (state.obstacleActive && !birdHit && touchesEl('moving-obstacle', curX, curY, 10)) {
      birdHit = true;
      sfx('tink');
      showComicBubble('TWEET! 🐦 Deflected!', curX, curY);
      vy = -Math.abs(vy) * 0.6;
      vx = vx * 0.75;
    }

    // Trampoline Boost Collision
    if (state.trampolineActive && !trampHit && touchesEl('trampoline-prop', curX, curY, 8)) {
      trampHit = true;
      sfx('boing');
      showComicBubble('SUPER BOING! 🚀', curX, curY);
      vy = -Math.abs(vy) * 1.35;
      vx = vx * 1.1;
    }

    // Mystery Crate Collision
    if (state.crateActive && touchesEl('mystery-crate', curX, curY, 10)) {
      state.crateActive = false;
      state.crateBonusGiven = true;
      var mc = $('mystery-crate');
      if (mc) mc.style.display = 'none';
      sfx('win');
      awardCrateBonus(state.activeSide, curX, curY);
    }

    // Fence Collision
    if (curX < fence.x1 - 6 || curX > fence.x2 + 6) fenceBounced = false;
    if (curX >= fence.x1 && curX <= fence.x2 && !fenceBounced) {
      if (curY >= fence.topY) {
        // Rainbow throw or fence clip deflection
        if (state.currentReward === 'rainbow' || curY <= fence.topY + 22) {
          sfx('tink');
          showComicBubble('TINK! 🪵 Bounced over!', curX, curY);
          vy = -Math.abs(vy) * 0.55;
          vx = (isCat ? 1 : -1) * Math.max(Math.abs(vx), 260);
          curY = fence.topY - 8;
          fenceBounced = true;
        } else {
          handleProjectileHit('fence', curX, curY);
          return;
        }
      }
    }

    // Opponent Hit Check
    if (oppN.d <= 1) {
      var hitZone = (oppN.dy < -0.45) ? 'head' : (oppN.dy > 0.5 ? 'feet' : 'body');
      handleProjectileHit(hitZone, opponentX, opponentY);
      return;
    }

    // Ground Collision (Bounce once)
    if (curY >= groundY) {
      if (bounces < AM.bounce && ((isCat && curX < fence.x1) || (!isCat && curX > fence.x2))) {
        bounces++;
        sfx('boing');
        showComicBubble('BOING! 🪃', curX, groundY);
        vy = -Math.abs(vy) * (AM.bounce > 1 ? 0.7 : 0.58);
        vx = vx * 0.78;
        curY = groundY - 5;
      } else {
        handleProjectileHit('ground', curX, groundY);
        return;
      }
    }

    // Out of bounds check (also a safety stop so a throw can never hang in the air)
    if (curX < -50 || curX > 1050 || curY < -200 || performance.now() - flightStart > 6000) {
      handleProjectileHit('out', curX, curY);
      return;
    }

    }

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var pt = toCanvasCoords(curX, curY);
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(rotation);

      if (ammoKey === 'rock' && state.currentReward === 'normal') {
        var rs = Math.max(22, canvas.height * 0.042);
        ctx.fillStyle = '#7b8190'; ctx.strokeStyle = '#2b2f3a'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-rs * 0.9, rs * 0.1); ctx.lineTo(-rs * 0.5, -rs * 0.7); ctx.lineTo(rs * 0.3, -rs * 0.85); ctx.lineTo(rs * 0.95, -rs * 0.15); ctx.lineTo(rs * 0.6, rs * 0.7); ctx.lineTo(-rs * 0.4, rs * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-rs * 0.2, -rs * 0.35, rs * 0.35, rs * 0.18, -0.5, 0, 6.3); ctx.fill();
      } else if (projImg && projImg.complete && projImg.naturalWidth > 0 && state.currentReward === 'normal') {
        var pSize = Math.max(46, canvas.height * 0.10);
        ctx.drawImage(projImg, -pSize / 2, -pSize / 2, pSize, pSize);
      } else {
        ctx.font = Math.round(Math.max(46, canvas.height * 0.10)) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(projEmoji, 0, 0);
      }
      ctx.restore();
    }

    requestAnimationFrame(animLoop);
  }

  requestAnimationFrame(animLoop);
}

function awardCrateBonus(side, vx, vy) {
  var perks = ['double', 'shield', 'refill', 'wind_off'];
  var perk = pick(perks);
  if (perk === 'double') {
    state.doubles[side]++;
    showComicBubble('🎁 BONUS: +1 Double!', vx, vy);
  } else if (perk === 'shield') {
    state.shields[side]++;
    showComicBubble('🎁 BONUS: +1 Shield!', vx, vy);
  } else if (perk === 'refill') {
    state.energy[side] = Math.min(100, state.energy[side] + 20);
    showComicBubble('🎁 BONUS: +20 Energy!', vx, vy);
  } else {
    state.wind = 0;
    showComicBubble('🎁 BONUS: Wind Stopped!', vx, vy);
  }
  updateHUD();
}

function showComicBubble(text, vx, vy) {
  var pt = toCanvasCoords(vx, vy);
  var b = document.createElement('div');
  b.className = 'comic-bubble';
  b.textContent = text;
  b.style.left = pt.x + 'px';
  b.style.top = pt.y + 'px';
  var stage = $('alley-stage');
  if (stage) {
    stage.querySelectorAll('.comic-bubble').forEach(function (el) { el.remove(); });
    stage.appendChild(b);
  }
  setTimeout(function () { b.remove(); }, 1400);
}

function handleProjectileHit(zone, vx, vy) {
  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  var targetSide = (state.activeSide === 'cat') ? 'dog' : 'cat';
  var targetChar = (targetSide === 'dog') ? $('dog-char-box') : $('cat-char-box');
  var isDouble = state.doubleActive[state.activeSide];
  state.doubleActive[state.activeSide] = false;

  // Track hits for quick mode
  if (zone === 'head' || zone === 'body' || zone === 'feet') {
    state.quickHits[state.activeSide]++;
  }

  // Co-op mode against Bin Boss
  if (cfg.mode === 'coop') {
    handleBossHit(zone, vx, vy, isDouble);
    return;
  }

  if (zone === 'head' || zone === 'body' || zone === 'feet') {
    // Shield breaker bypasses shield directly
    if (state.shieldActive[targetSide] && state.currentReward !== 'shield_breaker') {
      state.shieldActive[targetSide] = false;
      sfx('shield');
      showComicBubble('🛡️ SHIELD BLOCKED!', vx, vy);
      triggerMeme('shield', targetSide);
    } else {
      if (state.currentReward === 'shield_breaker' && state.shieldActive[targetSide]) {
        state.shieldActive[targetSide] = false;
        showComicBubble('⚡ SHIELD SHATTERED!', vx, vy);
      }

      var AMD = AMMO[state.lastAmmo] || AMMO.fish;
      var baseDmg = AMD.dmg;
      var zoneLabel = AMD.label.toUpperCase() + ' BONK!';
      if (zone === 'head') { baseDmg = AMD.dmg + 5; zoneLabel = 'TOP HIT! 🎯'; }
      else if (zone === 'feet') { baseDmg = Math.round(AMD.dmg * 0.4); zoneLabel = 'TOE GRAZE! 🐾'; }

      if (state.currentReward === 'rainbow') baseDmg = 40;
      if (state.currentReward === 'big') baseDmg = 35;

      var totalDmg = isDouble ? (baseDmg * 2) : baseDmg;
      if (state.streak[state.activeSide] >= 3) totalDmg += 5;

      state.energy[targetSide] = Math.max(0, state.energy[targetSide] - totalDmg);
      updateHUD();

      updateCharacterPose(targetSide, 'hit');
      if (targetChar) {
        targetChar.classList.add('hit');
        setTimeout(function () {
          targetChar.classList.remove('hit');
          updateCharacterPose(targetSide, 'idle');
        }, 1000);
      }

      sfx((AMMO[state.lastAmmo] || AMMO.fish).hit);
      showComicBubble((isDouble ? '💥 DOUBLE ' : '💥 ') + zoneLabel + ' −' + totalDmg, vx, vy);
      triggerMeme('win', state.activeSide);
    }
  } else if (zone === 'fence') {
    sfx('knock');
    showComicBubble('🪵 THUD! Hit the fence!', vx, vy);
    triggerMeme('miss', state.activeSide);
  } else {
    sfx('thud');
    showComicBubble('💨 MISS! Landed in the alley!', vx, vy);
    triggerMeme('miss', state.activeSide);
  }

  setTimeout(function () {
    passTurnToNext();
  }, 2800);
}

function handleBossHit(zone, vx, vy, isDouble) {
  var baseDmg = 30;
  if (zone === 'head') baseDmg = 40;
  if (zone === 'feet') baseDmg = 15;
  var totalDmg = isDouble ? (baseDmg * 2) : baseDmg;

  state.bossHP = Math.max(0, state.bossHP - totalDmg);

  if (state.bossHP > 100) state.bossPhase = 1;
  else if (state.bossHP > 50) state.bossPhase = 2;
  else if (state.bossHP > 0) state.bossPhase = 3;

  updateHUD();
  sfx('hit');
  showComicBubble('💥 BOSS HIT! −' + totalDmg, vx, vy);
  var bsp = $('bin-boss-sprite');
  if (state.bossHP > 0) {
    updateBossPose('hit');
    if (bsp) { bsp.classList.add('boss-hit'); setTimeout(function () { bsp.classList.remove('boss-hit'); }, 900); }
  } else {
    updateBossPose('win');
  }

  setTimeout(function () {
    if (state.bossHP > 0) updateBossPose('throw');
    showComicBubble('🍌 SPLAT! Harmless banana peel! −0', 140, 455);
    setTimeout(function () {
      if (state.bossHP > 0) updateBossPose('idle');
      passTurnToNext();
    }, 1200);
  }, 1000);
}

function passTurnToNext() {
  if (checkGameOver()) return;

  state.turnCount++;

  if (state.comebackTurnsLeft[state.activeSide] > 0) {
    state.comebackTurnsLeft[state.activeSide]--;
    if (state.comebackTurnsLeft[state.activeSide] === 0) {
      state.comebackAssist[state.activeSide] = false;
    }
  }

  if (state.activeSide === 'cat') {
    state.catIdx++;
    state.activeSide = (cfg.mode === 'coop') ? 'cat' : 'dog';
  } else {
    state.dogIdx++;
    state.activeSide = 'cat';
  }

  startTurn();
}

function checkGameOver() {
  if (cfg.mode === 'practice') return false;

  var isOver = false;
  var reason = 'turns';

  if (cfg.mode === 'coop') {
    if (state.bossHP <= 0) { isOver = true; reason = 'boss_win'; }
    else if (state.energy.cat <= 0) { isOver = true; reason = 'boss_draw'; }
  } else if (cfg.mode === 'quick') {
    if (state.quickTimeRemaining <= 0) { isOver = true; reason = 'quick_time'; }
  } else {
    if (state.energy.cat <= 0 || state.energy.dog <= 0) {
      isOver = true;
      reason = 'knockout';
    } else if (state.turnCount >= state.maxTurns) {
      isOver = true;
      reason = 'turns';
    }
  }

  if (isOver) {
    endGame(false, reason);
    return true;
  }
  return false;
}

function endGame(forced, reason) {
  if (state.turnTimerInterval) clearInterval(state.turnTimerInterval);
  if (state.quickTimerInterval) clearInterval(state.quickTimerInterval);

  showScreen('screen-end');
  sfx('win');
  spawnConfetti();

  var title = $('end-title-txt');
  var podium = $('end-podium-wrap');

  if (cfg.mode === 'coop') {
    title.textContent = '🏆 Fantastic Victory! Bin Boss Defeated! 🦝';
    podium.innerHTML = '<div class="end-podium-card gold"><span class="podium-icon">⭐</span><b>1st Place: Class Team</b><span>Fantastic Teamwork!</span></div>';
  } else {
    var catHP = state.energy.cat;
    var dogHP = state.energy.dog;

    if (cfg.mode === 'quick') {
      catHP = state.quickHits.cat;
      dogHP = state.quickHits.dog;
    }

    if (catHP > dogHP) {
      title.textContent = '🐱 Cats Win the Alley Match! 🏆';
      podium.innerHTML = '<div class="end-podium-card gold"><span class="podium-icon">🐱</span><b>1st Place: Cats</b><span>' + catHP + ' Score</span></div>' +
        '<div class="end-podium-card friendly"><span class="podium-icon">🐶</span><b>Great Game: Dogs</b><span>' + dogHP + ' Score</span></div>';
    } else if (dogHP > catHP) {
      title.textContent = '🐶 Dogs Win the Alley Match! 🏆';
      podium.innerHTML = '<div class="end-podium-card gold"><span class="podium-icon">🐶</span><b>1st Place: Dogs</b><span>' + dogHP + ' Score</span></div>' +
        '<div class="end-podium-card friendly"><span class="podium-icon">🐱</span><b>Great Game: Cats</b><span>' + catHP + ' Score</span></div>';
    } else {
      title.textContent = '🤝 It\'s a Friendly Tie! Great Teamwork! 🤝';
      podium.innerHTML = '<div class="end-podium-card gold"><span class="podium-icon">🐱</span><b>Cats</b><span>' + catHP + ' Score</span></div>' +
        '<div class="end-podium-card gold"><span class="podium-icon">🐶</span><b>Dogs</b><span>' + dogHP + ' Score</span></div>';
    }
  }

  // Populate Skill Report
  var skillRep = mastery ? mastery.getSkillReport() : [];
  var grid = $('end-skill-report-grid');
  if (grid) {
    var asked = skillRep.filter(function (s) { return s.total > 0; });
    grid.innerHTML = !asked.length ? '<div class="skill-bar-row"><span>No questions were asked this time.</span></div>' : asked.map(function (s) {
      return '<div class="skill-bar-row">' +
        '<span class="skill-bar-name">' + s.skill + '</span>' +
        '<div class="skill-bar-track"><div class="skill-bar-fill" style="width:' + s.percent + '%;"></div></div>' +
        '<span>' + s.percent + '%</span>' +
        '</div>';
    }).join('');
  }

  var bestSkill = mastery ? mastery.getBestSkill() : 'Listening';
  var bsh = $('end-best-skill-highlight');
  if (bsh) bsh.textContent = '⭐ Super at ' + bestSkill + '!';

  // Words to Practise Next
  var missedWords = mastery ? mastery.getWordsToPractise(6) : [];
  var wordsList = $('end-words-practice-list');
  if (wordsList) {
    if (missedWords.length) {
      wordsList.innerHTML = missedWords.map(function (w) {
        return '<div class="word-practice-chip">' +
          '<span>' + (w.emoji || '📖') + ' ' + w.word + '</span>' +
          '<button class="btn-say-mini" onclick="speakText(\'' + w.word + '\')">🔊</button>' +
          '</div>';
      }).join('');
    } else {
      wordsList.innerHTML = '<span style="font-weight:700; color:#059669;">🌟 Perfect record! Zero missed words!</span>';
    }
  }

  // Stars & Badges
  var se = $('end-stars-earned');
  if (se) se.textContent = '⭐ ' + state.starsEarned + ' Stars Earned';
  var badges = ['Word Wizards', 'Sentence Builders', 'Super Speakers', 'Alley Champions'];
  var cb = $('end-class-badge');
  if (cb) cb.textContent = '🏅 ' + pick(badges) + ' Badge';

  // All Pupil Names
  var allPupils = state.catRoster.concat(state.dogRoster);
  var nl = $('end-names-list');
  if (nl) {
    nl.innerHTML = allPupils.map(function (n) {
      return '<span class="roster-pill">⭐ ' + n + '</span>';
    }).join('');
  }
}

function spawnConfetti() {
  var colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
  for (var i = 0; i < 40; i++) {
    var c = document.createElement('div');
    c.className = 'conf-bit';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(colors);
    c.style.width = (Math.random() * 10 + 8) + 'px';
    c.style.height = (Math.random() * 14 + 10) + 'px';
    c.style.animationDuration = (Math.random() * 2 + 1.8) + 's';
    c.style.animationDelay = (Math.random() * 0.6) + 's';
    document.body.appendChild(c);
    setTimeout(function () { c.remove(); }, 4000);
  }
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
  var target = $(screenId);
  if (target) target.classList.add('active');
  if (screenId === 'screen-game') {
    resizeCanvas();
  }
}

/* ==========================================================================
   EVENT HANDLERS & SETUP LOGIC
   ========================================================================== */

function setupEventHandlers() {
  // Grade Selection
  document.querySelectorAll('.grade-card').forEach(function (btn) {
    btn.onclick = function () {
      sfx('click');
      document.querySelectorAll('.grade-card').forEach(function (b) { b.classList.remove('sel'); });
      btn.classList.add('sel');
      cfg.grade = btn.dataset.grade;
      saveConfig();
      if (typeof EXTRA_ENGINE !== 'undefined') {
        taskSelector = EXTRA_ENGINE.createTaskSelector(compiledBanks, cfg.grade);
      }
      populateClasses();
    };
  });

  // Mode Selection
  document.querySelectorAll('button[data-mode]').forEach(function (btn) {
    btn.onclick = function () {
      sfx('click');
      document.querySelectorAll('button[data-mode]').forEach(function (b) { b.classList.remove('sel'); });
      btn.classList.add('sel');
      cfg.mode = btn.dataset.mode;
      saveConfig();
    };
  });

  // Arena Selection
  document.querySelectorAll('button[data-arena]').forEach(function (btn) {
    btn.onclick = function () {
      sfx('click');
      document.querySelectorAll('button[data-arena]').forEach(function (b) { b.classList.remove('sel'); });
      btn.classList.add('sel');
      cfg.arena = btn.dataset.arena;
      saveConfig();
      applyArenaTheme();
    };
  });

  // Length Selection
  document.querySelectorAll('button[data-turns]').forEach(function (btn) {
    btn.onclick = function () {
      sfx('click');
      document.querySelectorAll('button[data-turns]').forEach(function (b) { b.classList.remove('sel'); });
      btn.classList.add('sel');
      cfg.turnsEach = Number(btn.dataset.turns);
      saveConfig();
    };
  });

  // Question Types Selection
  document.querySelectorAll('button[data-qtype]').forEach(function (btn) {
    btn.onclick = function () {
      sfx('click');
      document.querySelectorAll('button[data-qtype]').forEach(function (b) { b.classList.remove('sel'); });
      btn.classList.add('sel');
      cfg.qType = btn.dataset.qtype;
      saveConfig();
    };
  });

  // Class Selection & Custom Names
  var cs = $('class-select');
  if (cs) {
    cs.onchange = function () {
      sfx('click');
      loadRosterAndSplit();
    };
  }
  var bmt = $('btn-mix-teams');
  if (bmt) {
    bmt.onclick = function () {
      sfx('click');
      loadRosterAndSplit();
    };
  }
  var btnTN = $('btn-type-names');
  if (btnTN) {
    btnTN.onclick = function () {
      sfx('click');
      var box = $('typed-box');
      if (!box) return;
      if (box.style.display === 'block') {
        var txt = box.value.trim();
        if (txt) {
          var lines = txt.split(/[\n,]+/).map(function (x) { return x.trim(); }).filter(Boolean);
          if (lines.length >= 2) {
            var shuffled = shuffle(lines);
            var mid = Math.ceil(shuffled.length / 2);
            state.catRoster = shuffled.slice(0, mid);
            state.dogRoster = shuffled.slice(mid);
            state.outRoster = [];
            renderTeamRosters();
          }
        }
        box.style.display = 'none';
      } else {
        box.style.display = 'block';
        box.focus();
      }
    };
  }

  // Sound, Music & Calm Toggles
  var bst = $('btn-sound-toggle');
  if (bst) {
    bst.onclick = function () {
      cfg.sound = !cfg.sound;
      bst.textContent = '🔊 Sound: ' + (cfg.sound ? 'ON' : 'OFF');
      sfx('click');
      saveConfig();
    };
  }
  var bmtog = $('btn-music-toggle');
  if (bmtog) {
    bmtog.onclick = function () {
      cfg.music = !cfg.music;
      bmtog.textContent = '🎵 Music: ' + (cfg.music ? 'ON' : 'OFF');
      sfx('click');
      saveConfig();
    };
  }
  var bct = $('btn-calm-toggle');
  if (bct) {
    bct.onclick = function () {
      cfg.calm = !cfg.calm;
      bct.textContent = '🍃 Calm: ' + (cfg.calm ? 'ON' : 'OFF');
      document.body.classList.toggle('calm-mode', cfg.calm);
      sfx('click');
      saveConfig();
    };
  }

  // System Toolbar buttons
  var ts = $('tools-sound');
  if (ts) {
    ts.onclick = function () {
      cfg.sound = !cfg.sound;
      ts.textContent = cfg.sound ? '🔊' : '🔇';
      sfx('click');
    };
  }
  var tm = $('tools-music');
  if (tm) {
    tm.onclick = function () {
      cfg.music = !cfg.music;
      tm.textContent = cfg.music ? '🎵' : '🎼';
      sfx('click');
    };
  }
  var tf = $('tools-full');
  if (tf) {
    tf.onclick = function () {
      sfx('click');
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen().catch(function () {});
      }
    };
  }
  var tq = $('tools-quit');
  if (tq) {
    tq.onclick = function () {
      sfx('click');
      showScreen('screen-setup');
    };
  }

  // Teacher Toolbar Buttons
  var ttp = $('tt-pause');
  if (ttp) {
    ttp.onclick = function () {
      state.isPaused = !state.isPaused;
      ttp.textContent = state.isPaused ? '▶' : '⏸';
      sfx('click');
    };
  }
  var ttsk = $('tt-skip');
  if (ttsk) {
    ttsk.onclick = function () {
      sfx('click');
      $('q-overlay').classList.remove('active');
      passTurnToNext();
    };
  }
  var ttb = $('tt-back');
  if (ttb) {
    ttb.onclick = function () {
      sfx('click');
      if (state.isAiming) {
        state.isAiming = false;
        $('aim-dock').classList.remove('active');
        $('q-overlay').classList.add('active');
      }
    };
  }
  var ttr = $('tt-reroll');
  if (ttr) {
    ttr.onclick = function () {
      sfx('click');
      presentQuestion();
    };
  }
  var ttst = $('tt-star');
  if (ttst) {
    ttst.onclick = function () {
      sfx('win');
      state.starsEarned++;
      showComicBubble('⭐ +1 Class Star!', 500, 200);
    };
  }
  var ttt = $('tt-timer');
  if (ttt) {
    ttt.onclick = function () {
      sfx('click');
      if (cfg.turnTimer === 0) cfg.turnTimer = 20;
      else if (cfg.turnTimer === 20) cfg.turnTimer = 40;
      else cfg.turnTimer = 0;
      ttt.textContent = cfg.turnTimer === 0 ? '⏱ OFF' : '⏱ ' + cfg.turnTimer + 's';
      saveConfig();
    };
  }
  var ttsw = $('tt-swap');
  if (ttsw) {
    ttsw.onclick = function () {
      sfx('click');
      if (state.activeSide === 'cat') state.catIdx++;
      else state.dogIdx++;
      updateHUD();
    };
  }

  // In-Game Powerup Buttons
  var cbd = $('cat-btn-double');
  if (cbd) {
    cbd.onclick = function () {
      if (state.activeSide !== 'cat' || state.doubles.cat <= 0 || !state.isAiming) return;
      state.doubles.cat--;
      state.doubleActive.cat = true;
      sfx('double');
      updateHUD();
    };
  }
  var dbd = $('dog-btn-double');
  if (dbd) {
    dbd.onclick = function () {
      if (state.activeSide !== 'dog' || state.doubles.dog <= 0 || !state.isAiming) return;
      state.doubles.dog--;
      state.doubleActive.dog = true;
      sfx('double');
      updateHUD();
    };
  }
  var cbs = $('cat-btn-shield');
  if (cbs) {
    cbs.onclick = function () {
      if (state.shields.cat <= 0 || state.shieldActive.cat) return;
      state.shields.cat--;
      state.shieldActive.cat = true;
      sfx('shield');
      updateHUD();
    };
  }
  var dbs = $('dog-btn-shield');
  if (dbs) {
    dbs.onclick = function () {
      if (state.shields.dog <= 0 || state.shieldActive.dog) return;
      state.shields.dog--;
      state.shieldActive.dog = true;
      sfx('shield');
      updateHUD();
    };
  }
  var cba = $('cat-btn-ask');
  if (cba) {
    cba.onclick = function () {
      if (state.activeSide !== 'cat' || state.askClass.cat <= 0) return;
      state.askClass.cat--;
      sfx('win');
      eliminateWrongOption();
      updateHUD();
    };
  }
  var dba = $('dog-btn-ask');
  if (dba) {
    dba.onclick = function () {
      if (state.activeSide !== 'dog' || state.askClass.dog <= 0) return;
      state.askClass.dog--;
      sfx('win');
      eliminateWrongOption();
      updateHUD();
    };
  }

  var bhq = $('btn-hear-q');
  if (bhq) {
    bhq.onclick = function () {
      sfx('click');
      if (state.currentTask) {
        speakText(state.currentTask.say || state.currentTask.q);
      }
    };
  }

  // Aim Controls
  var as = $('angle-slider');
  if (as) {
    as.oninput = function () {
      state.angle = Number(this.value);
      $('aim-angle-val').textContent = state.angle + '°';
      drawPreviewArc();
    };
  }
  var bad = $('btn-angle-down');
  if (bad) {
    bad.onclick = function () {
      state.angle = Math.max(15, state.angle - 5);
      $('angle-slider').value = state.angle;
      $('aim-angle-val').textContent = state.angle + '°';
      drawPreviewArc();
    };
  }
  var bau = $('btn-angle-up');
  if (bau) {
    bau.onclick = function () {
      state.angle = Math.min(85, state.angle + 5);
      $('angle-slider').value = state.angle;
      $('aim-angle-val').textContent = state.angle + '°';
      drawPreviewArc();
    };
  }

  var ps = $('power-slider');
  if (ps) {
    ps.oninput = function () {
      state.power = Number(this.value);
      $('aim-power-val').textContent = state.power + '%';
      drawPreviewArc();
    };
  }
  var bpd = $('btn-power-down');
  if (bpd) {
    bpd.onclick = function () {
      state.power = Math.max(20, state.power - 5);
      $('power-slider').value = state.power;
      $('aim-power-val').textContent = state.power + '%';
      drawPreviewArc();
    };
  }
  var bpu = $('btn-power-up');
  if (bpu) {
    bpu.onclick = function () {
      var maxP = Number($('power-slider').max);
      state.power = Math.min(maxP, state.power + 5);
      $('power-slider').value = state.power;
      $('aim-power-val').textContent = state.power + '%';
      drawPreviewArc();
    };
  }

  var fb = $('fling-btn');
  if (fb) {
    fb.onclick = function () {
      launchFling();
    };
  }

  setupStageDrag();
  setupTeamEditing();

  var bsg = $('btn-start-game');
  if (bsg) {
    bsg.onclick = function () {
      getAudioContext();
      if (!state.catRoster.length || !state.dogRoster.length) {
        sfx('wrong');
        var tw = $('team-warning'); if (tw) tw.textContent = '⚠️ Each team needs at least one pupil.';
        return;
      }
      sfx('click');
      resetGameState();
      applyArenaTheme();
      runCountdown(function () {
        showScreen('screen-game');
        startTurn();
      });
    };
  }

  var br = $('btn-replay');
  if (br) {
    br.onclick = function () {
      resetGameState();
      applyArenaTheme();
      runCountdown(function () {
        showScreen('screen-game');
        startTurn();
      });
    };
  }

  var bpm = $('btn-practice-missed');
  if (bpm) {
    bpm.onclick = function () {
      sfx('click');
      cfg.mode = 'practice';
      resetGameState();
      showScreen('screen-game');
      startTurn();
    };
  }

  var bcs = $('btn-change-settings');
  if (bcs) {
    bcs.onclick = function () {
      sfx('click');
      showScreen('screen-setup');
    };
  }
}

function eliminateWrongOption() {
  if (!state.currentTask) return;
  var wrongBtns = Array.from(document.querySelectorAll('.q-opt')).filter(function (b) {
    return b.dataset.opt !== state.currentTask.a;
  });
  if (wrongBtns.length) {
    var removed = pick(wrongBtns);
    removed.style.visibility = 'hidden';
    $('q-msg-box').textContent = '🎤 Class Hint: One option removed!';
  } else {
    $('q-msg-box').textContent = '🎤 Class Hint: ' + (state.currentTask.hint || 'Focus on the prompt!');
  }
}

/* ---------- Visible pull zone: shows where to touch and which way to pull ---------- */
function showPullZone() {
  var stage = $('alley-stage');
  if (!stage || !state.isAiming || state.isFlying) return;
  var z = $('pull-zone');
  if (!z) {
    z = document.createElement('div');
    z.id = 'pull-zone';
    z.innerHTML = '<div class="pz-ring"></div><div class="pz-arrow" id="pz-arrow"></div><div class="pz-label" id="pz-label"></div>';
    stage.appendChild(z);
  }
  var cat = (state.activeSide === 'cat');
  var box = (cat ? $('cat-art-box') : $('dog-art-box')).getBoundingClientRect(), sr = stage.getBoundingClientRect();
  var size = Math.max(box.width * 1.9, sr.height * 0.32);
  z.style.width = size + 'px'; z.style.height = size + 'px';
  z.style.left = (box.left - sr.left + box.width / 2 - size / 2) + 'px';
  z.style.top = (box.top - sr.top + box.height / 2 - size / 2) + 'px';
  z.className = cat ? 'pull-zone cat' : 'pull-zone dog';
  $('pz-arrow').textContent = cat ? '↙' : '↘';
  $('pz-label').textContent = '👆 Touch here, pull back';
  z.style.display = 'flex';
}
function hidePullZone() { var z = $('pull-zone'); if (z) z.style.display = 'none'; }

/* ---------- Slingshot aiming: touch anywhere, pull back, let go ---------- */
function setupStageDrag() {
  var scr = $('screen-game');
  if (!scr || scr.dataset.drag) return;
  scr.dataset.drag = '1';
  scr.style.touchAction = 'none';
  scr.addEventListener('pointerdown', function (e) {
    if (!state.isAiming || state.isFlying) return;
    if (e.target.closest && e.target.closest('#aim-dock, #teacher-toolbar-dock, #top-hud, #q-overlay, button, input')) return;
    hidePullZone();
    state.slingshotDragging = true;
    state.dragStartX = e.clientX; state.dragStartY = e.clientY;
    state.dragNow = { x: e.clientX, y: e.clientY };
    state.dragPull = 0;
    try { scr.setPointerCapture(e.pointerId); } catch (err) {}
    var hint = $('aim-hand-hint'); if (hint) hint.style.display = 'none';
    var gt = $('aim-guide-txt'); if (gt) gt.textContent = '👆 ' + getActivePupilName() + ': touch, pull back and let go!';
    updateDragAim(e.clientX, e.clientY);
  });
  scr.addEventListener('pointermove', function (e) {
    if (state.slingshotDragging) updateDragAim(e.clientX, e.clientY);
  });
  function end(e, cancel) {
    if (!state.slingshotDragging) return;
    state.slingshotDragging = false;
    var ok = !cancel && state.dragPull >= 30;
    state.dragNow = null;
    if (ok) {
      launchFling();
    } else {
      showPullZone();
      drawPreviewArc();
      var g = $('aim-guide-txt'); if (g) g.textContent = '👆 Pull back a little more, then let go!';
    }
  }
  scr.addEventListener('pointerup', function (e) { end(e, false); });
  scr.addEventListener('pointercancel', function (e) { end(e, true); });
}

function updateDragAim(cx, cy) {
  var cat = (state.activeSide === 'cat');
  var dx = cx - state.dragStartX, dy = cy - state.dragStartY;
  state.dragNow = { x: cx, y: cy };
  var back = cat ? -dx : dx;                        // pulling away from the target
  var pull = Math.hypot(back, dy);
  state.dragPull = pull;
  var ang = Math.atan2(dy, Math.max(back, 0.001)) * 180 / Math.PI;  // pull down and back = a high throw
  state.angle = Math.max(15, Math.min(85, Math.round(ang)));
  var maxPull = Math.max(160, window.innerHeight * 0.38);
  var maxP = Number($('power-slider').max) || 100;
  state.power = Math.max(20, Math.min(maxP, Math.round(20 + 80 * Math.min(1, pull / maxPull))));
  var as = $('angle-slider'), ps = $('power-slider');
  if (as) as.value = state.angle;
  if (ps) ps.value = state.power;
  drawPreviewArc();
}

function setupCharacterDrag(charEl, isCatChar) {
  if (!charEl) return;
  function handleDragStart(e) {
    if (!state.isAiming || state.isFlying) return;
    if ((isCatChar && state.activeSide !== 'cat') || (!isCatChar && state.activeSide !== 'dog')) return;

    state.slingshotDragging = true;
    var hint = $('aim-hand-hint');
    if (hint) hint.style.display = 'none';
    var touch = e.touches ? e.touches[0] : e;
    state.dragStartX = touch.clientX;
    state.dragStartY = touch.clientY;
  }

  function handleDragMove(e) {
    if (!state.slingshotDragging) return;
    var touch = e.touches ? e.touches[0] : e;
    var dx = touch.clientX - state.dragStartX;
    var dy = touch.clientY - state.dragStartY;

    var pullDist = Math.hypot(dx, dy);
    var pullAngleDeg = 45;

    if (isCatChar) {
      pullAngleDeg = Math.round(Math.atan2(dy, -dx) * 180 / Math.PI);
    } else {
      pullAngleDeg = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
    }

    if (pullAngleDeg >= 15 && pullAngleDeg <= 85) {
      state.angle = pullAngleDeg;
      $('angle-slider').value = state.angle;
      $('aim-angle-val').textContent = state.angle + '°';
    }

    var maxP = Number($('power-slider').max);
    var computedPower = Math.min(maxP, Math.max(20, Math.round(pullDist * 0.8)));
    state.power = computedPower;
    $('power-slider').value = state.power;
    $('aim-power-val').textContent = state.power + '%';

    drawPreviewArc();
  }

  function handleDragEnd(e) {
    if (!state.slingshotDragging) return;
    state.slingshotDragging = false;
    launchFling();
  }

  charEl.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('mouseup', handleDragEnd);

  charEl.addEventListener('touchstart', handleDragStart, { passive: true });
  window.addEventListener('touchmove', handleDragMove, { passive: true });
  window.addEventListener('touchend', handleDragEnd);
}

function resetGameState() {
  state.turnCount = 0;
  state.maxTurns = (cfg.mode === 'practice') ? 9999 : (cfg.turnsEach * 2);
  state.activeSide = 'cat';
  state.level = 1;
  state.energy = { cat: 100, dog: 100 };
  state.doubles = { cat: 1, dog: 1 };
  state.shields = { cat: 1, dog: 1 };
  state.askClass = { cat: 1, dog: 1 };
  state.doubleActive = { cat: false, dog: false };
  state.shieldActive = { cat: false, dog: false };
  state.streak = { cat: 0, dog: 0 };
  state.streakBonusGiven = { cat: false, dog: false };
  state.teammateBoost = { cat: false, dog: false };
  state.luckyWind = { cat: false, dog: false };
  state.comebackAssist = { cat: false, dog: false };
  state.comebackTurnsLeft = { cat: 0, dog: 0 };
  state.starsEarned = 0;
  state.catIdx = 0;
  state.dogIdx = 0;
  state.isAiming = false;
  state.isFlying = false;
  state.isPaused = false;
  state.bossHP = 150;
  state.bossPhase = 1;
  state.quickHits = { cat: 0, dog: 0 };
  state.quickTimeRemaining = 300;
  state.crateActive = false;
  state.crateBonusGiven = false;

  if (taskSelector) taskSelector.reset();
  if (mastery && typeof EXTRA_ENGINE !== 'undefined') {
    mastery = EXTRA_ENGINE.createMasteryTracker();
  }

  var ccb = $('cat-char-box'); if (ccb) ccb.className = 'char-wrapper';
  var dcb = $('dog-char-box'); if (dcb) dcb.className = 'char-wrapper';

  if (cfg.mode === 'quick') {
    if (state.quickTimerInterval) clearInterval(state.quickTimerInterval);
    state.quickTimerInterval = setInterval(function () {
      if (state.isPaused) return;
      state.quickTimeRemaining--;
      updateHUD();
      if (state.quickTimeRemaining <= 0) {
        clearInterval(state.quickTimerInterval);
        state.quickTimerInterval = null;
        endGame(false, 'quick_time');
      }
    }, 1000);
  }
}

function runCountdown(onFinish) {
  var count = 3;
  var layer = $('countdown-layer');
  var digit = $('countdown-digit');
  layer.classList.add('active');

  function step() {
    if (count === 0) {
      digit.textContent = 'GO!';
      sfx('go');
      setTimeout(function () {
        layer.classList.remove('active');
        onFinish();
      }, 700);
      return;
    }
    digit.textContent = count;
    digit.style.animation = 'none';
    void digit.offsetWidth;
    digit.style.animation = '';
    sfx('countdown');
    count--;
    setTimeout(step, 750);
  }
  step();
}

window.addEventListener('DOMContentLoaded', function () {
  if (paramGrade === '4' || cfg.grade === '4') {
    document.querySelectorAll('.grade-card').forEach(function (b) {
      b.classList.toggle('sel', b.dataset.grade === '4');
    });
  }
  document.querySelectorAll('button[data-mode]').forEach(function (b) {
    b.classList.toggle('sel', b.dataset.mode === cfg.mode);
  });
  document.querySelectorAll('button[data-arena]').forEach(function (b) {
    b.classList.toggle('sel', b.dataset.arena === cfg.arena);
  });
  document.querySelectorAll('button[data-turns]').forEach(function (b) {
    b.classList.toggle('sel', Number(b.dataset.turns) === cfg.turnsEach);
  });
  document.querySelectorAll('button[data-qtype]').forEach(function (b) {
    b.classList.toggle('sel', b.dataset.qtype === cfg.qType);
  });

  if (cfg.calm) {
    document.body.classList.add('calm-mode');
    var bct = $('btn-calm-toggle');
    if (bct) bct.textContent = '🍃 Calm: ON';
  }
  var bst = $('btn-sound-toggle');
  if (bst) bst.textContent = '🔊 Sound: ' + (cfg.sound ? 'ON' : 'OFF');
  var bmt = $('btn-music-toggle');
  if (bmt) bmt.textContent = '🎵 Music: ' + (cfg.music ? 'ON' : 'OFF');

  populateClasses();
  loadArtAssets();
  applyArenaTheme();
  setupEventHandlers();
});

/* Every button, chip, card and answer plays the tap sound the moment it is touched.
   The first touch also switches the audio on (browsers keep it off until the user taps). */
document.addEventListener('pointerdown', function (e) {
  try { getAudioContext(); } catch (err) {}
  if (!cfg.sound) return;
  var t = e.target && e.target.closest ? e.target.closest('button, .chip, .grade-card, .q-opt, select, .team-pill, .builder-tile, .spelling-letter-btn, .ammo-btn, a.btn') : null;
  if (!t || t.disabled) return;
  lastTouchClickAt = performance.now();
  sfxLast.click = 0;
  if (window.SFX && audioCtx) SFX.play('click');
}, true);
