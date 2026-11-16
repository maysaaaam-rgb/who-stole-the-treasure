/* ============================================================================
   Game Maker — Mode: 3D Penalty Shootout (Real Three.js WebGL Engine)
   ----------------------------------------------------------------------------
   1. Real Offline 3D WebGL Stadium (Three.js r160):
      - 3D mowed grass pitch with real PCFSoftShadowMap shadows & penalty lines
      - 3D metallic goalposts + deformable 3D vertex-spring goal net
      - 360° stadium stands with InstancedMesh jumping crowd, 4 floodlight
        towers, waving corner flags, and live 3D LED ribbon boards
      - Dynamic broadcast cameras (Pre-Kick, Striker Aim, Run-Up Dolly,
        Ball-Flight Chase + Slow-Mo Bullet Time, and Celebration Orbit)
   2. Rigged 15-Joint 3D Soccer Athletes (Striker, Goalkeeper & Teammates):
      - Full hierarchical 3D skeleton (pelvis, torso with jersey number, 3D
        sculpted hair & face, shoulders/elbows/hands/keeper gloves, hips/knees/
        striped socks/cleats) with 60fps procedural run-up, plant, whip-kick,
        airborne full-stretch keeper dives, and 360° jump-spin celebrations
   3. Real Interactive Smartboard Gameplay Loop:
      - Live In-Stadium Cyber-Glass Question HUD (keeps 65%+ 3D stadium live!)
      - 1st-try answer unlocks 🔥 GOLDEN SUPER SHOT; zero-shame soft-fail wobble
        lets pupils retry on 2nd try for a normal kick
      - Dual Smartboard Controls: Direct 3D Ball Flick/Banana-Swipe OR Drag the
        3D Target Ring + Live Sweet-Spot Power Meter
      - Optional 2-Team Rival Keeper Duel Mode (defending team secretly locks
        Left / Center / Right dive!) + 3D Top-Bins Golden Star Targets
   ============================================================================ */
(function (root) {
  'use strict';

  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};

  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------- Polyphonic Web Audio Chords (AGENTS.md §1.3) ---------- */
  var sfxCtx = null;
  function ensureAudioCtx() {
    if (!sfxCtx) {
      var Ctx = root.AudioContext || root.webkitAudioContext;
      if (Ctx) {
        try { sfxCtx = new Ctx(); } catch (e) { sfxCtx = null; }
      }
    }
    if (sfxCtx && sfxCtx.state === 'suspended') {
      try { sfxCtx.resume(); } catch (e) { /* ignore */ }
    }
    return sfxCtx;
  }

  function playSynthChord(kind) {
    if (A() && A().muted) return;
    var ctx = ensureAudioCtx();
    if (!ctx) return;
    var now = ctx.currentTime;
    if (kind === 'softfail') {
      /* Warm descending two-tone sine chime (246.94 Hz -> 220 Hz) */
      [246.94, 220.0].forEach(function (freq, idx) {
        var o1 = ctx.createOscillator();
        var o2 = ctx.createOscillator();
        var gain = ctx.createGain();
        o1.type = 'sine';
        o2.type = 'triangle';
        o1.frequency.setValueAtTime(freq, now + idx * 0.11);
        o2.frequency.setValueAtTime(freq * 1.5, now + idx * 0.11);
        gain.gain.setValueAtTime(0.001, now + idx * 0.11);
        gain.gain.linearRampToValueAtTime(0.11, now + idx * 0.11 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.28);
        o1.connect(gain);
        o2.connect(gain);
        gain.connect(ctx.destination);
        o1.start(now + idx * 0.11);
        o2.start(now + idx * 0.11);
        o1.stop(now + idx * 0.11 + 0.30);
        o2.stop(now + idx * 0.11 + 0.30);
      });
      return;
    }
    /* Ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6, plus E6 for super/bullseye) */
    var notes = kind === 'super' ? [523.25, 659.25, 783.99, 1046.5, 1318.5] : [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function (freq, idx) {
      var t0 = now + idx * 0.055;
      var o1 = ctx.createOscillator();
      var o2 = ctx.createOscillator();
      var gain = ctx.createGain();
      o1.type = 'triangle';
      o2.type = 'sine';
      o1.frequency.setValueAtTime(freq, t0);
      o2.frequency.setValueAtTime(freq * 2, t0);
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.10, t0 + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.34);
      o1.connect(gain);
      o2.connect(gain);
      gain.connect(ctx.destination);
      o1.start(t0);
      o2.start(t0);
      o1.stop(t0 + 0.36);
      o2.stop(t0 + 0.36);
    });
  }

  function flyScoreToPod(screenPt, teamIdx, pts, cb) {
    var pod = document.querySelector('.gm-pen3d-sb-row[data-pen3d-team="' + teamIdx + '"] .gm-pen3d-sb-pts')
      || document.querySelector('#gm-team-' + teamIdx + ' .gm-score')
      || document.getElementById('gm-team-' + teamIdx);
    var layer = document.getElementById('gm-fx');
    if (!pod || !layer || !screenPt) {
      if (cb) cb();
      return;
    }
    var r = pod.getBoundingClientRect();
    var orb = U().h('div', { class: 'gm-score-orb', text: '+' + pts });
    orb.style.left = Math.round(screenPt.x) + 'px';
    orb.style.top = Math.round(screenPt.y) + 'px';
    layer.appendChild(orb);
    setTimeout(function () {
      orb.style.left = Math.round(r.left + r.width / 2) + 'px';
      orb.style.top = Math.round(r.top + r.height / 2) + 'px';
      orb.style.transform = 'translate(-50%, -50%) scale(0.75)';
    }, 24);
    setTimeout(function () {
      if (orb.parentNode) orb.parentNode.removeChild(orb);
      if (cb) cb();
    }, 620);
  }

  /* ---------- Color & Pixel Helpers for Pixar 3D Avatars & Stadium ---------- */
  function hexToRgbObj(hex) {
    var s = String(hex || '#38bdf8').replace('#', '').trim();
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    var n = parseInt(s, 16);
    if (isNaN(n)) return { r: 56, g: 189, b: 248 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbCss(c, a) {
    var r = clamp(Math.round(c.r), 0, 255);
    var g = clamp(Math.round(c.g), 0, 255);
    var b = clamp(Math.round(c.b), 0, 255);
    return (typeof a === 'number') ? ('rgba(' + r + ',' + g + ',' + b + ',' + a + ')') : ('rgb(' + r + ',' + g + ',' + b + ')');
  }

  function rgbHexNum(c) {
    return (clamp(Math.round(c.r), 0, 255) << 16) | (clamp(Math.round(c.g), 0, 255) << 8) | clamp(Math.round(c.b), 0, 255);
  }

  function shadeRgbObj(c, mul, warmShift) {
    var w = warmShift || 0;
    return {
      r: clamp(c.r * mul + w, 0, 255),
      g: clamp(c.g * mul + w * 0.35, 0, 255),
      b: clamp(c.b * mul - w * 0.35, 0, 255)
    };
  }

  function medianNum(arr) {
    if (!arr || !arr.length) return 0;
    var s = arr.slice().sort(function (a, b) { return a - b; });
    return s[Math.floor(s.length * 0.5)];
  }

  /* ---------- Procedural High-Res Canvas Textures for Three.js ---------- */
  function makeSkyTexture(THREE, hal) {
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    var g = c.getContext('2d');
    var grd = g.createLinearGradient(0, 0, 0, 512);
    if (hal) {
      grd.addColorStop(0.00, '#09051a');
      grd.addColorStop(0.42, '#24124d');
      grd.addColorStop(0.72, '#581c87');
      grd.addColorStop(1.00, '#c2410c');
      g.fillStyle = grd;
      g.fillRect(0, 0, 1024, 512);
      g.fillStyle = 'rgba(255,255,255,0.68)';
      for (var i = 0; i < 120; i++) {
        g.fillRect((i * 197) % 1024, (i * 89) % 220, (i % 3 === 0) ? 2.2 : 1.4, (i % 3 === 0) ? 2.2 : 1.4);
      }
    } else {
      /* Bright Golden-Hour Pixar Broadcast Sky */
      grd.addColorStop(0.00, '#1e40af');
      grd.addColorStop(0.26, '#0284c7');
      grd.addColorStop(0.52, '#38bdf8');
      grd.addColorStop(0.74, '#bae6fd');
      grd.addColorStop(0.89, '#fde68a');
      grd.addColorStop(1.00, '#fed7aa');
      g.fillStyle = grd;
      g.fillRect(0, 0, 1024, 512);

      /* Warm Golden Sun Bloom behind North-East Stand */
      var sun = g.createRadialGradient(660, 328, 8, 660, 328, 250);
      sun.addColorStop(0.00, 'rgba(255, 253, 240, 0.96)');
      sun.addColorStop(0.22, 'rgba(254, 240, 138, 0.58)');
      sun.addColorStop(0.55, 'rgba(253, 186, 116, 0.22)');
      sun.addColorStop(1.00, 'rgba(253, 186, 116, 0)');
      g.fillStyle = sun;
      g.fillRect(0, 0, 1024, 512);

      /* Soft Sculpted Pixar Sunlit Clouds */
      var clouds = [
        [140, 268, 92, 26], [210, 258, 70, 24], [420, 242, 110, 28],
        [495, 234, 78, 25], [785, 252, 104, 27], [860, 262, 74, 22], [960, 248, 88, 24]
      ];
      clouds.forEach(function (cl) {
        g.fillStyle = 'rgba(255, 251, 235, 0.42)';
        g.beginPath();
        g.ellipse(cl[0], cl[1], cl[2], cl[3], 0, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = 'rgba(255, 255, 255, 0.30)';
        g.beginPath();
        g.ellipse(cl[0] - cl[2] * 0.22, cl[1] - 6, cl[2] * 0.65, cl[3] * 0.75, 0, 0, Math.PI * 2);
        g.fill();
      });
    }
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makePitchTexture(THREE, maxAniso) {
    /* Covers X in [-32..+32] (64m wide) and Z in [-12..+52] (64m deep); Goal Line at Z = 0 -> v = (0 - (-12))/64 */
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    var g = c.getContext('2d');

    /* Lush Two-Tone Pixar Emerald Mowed Turf Stripes */
    var stripes = 16;
    for (var i = 0; i < stripes; i++) {
      g.fillStyle = (i % 2 === 0) ? '#1ea34a' : '#26b857';
      g.fillRect(0, i * (1024 / stripes), 1024, 1024 / stripes + 1);
    }
    /* Cross-cut subtle sunlit sheen */
    for (var j = 0; j < 16; j++) {
      g.fillStyle = (j % 2 === 0) ? 'rgba(255,253,235,0.045)' : 'rgba(6,78,59,0.04)';
      g.fillRect(j * 64, 0, 64, 1024);
    }
    /* Fine grass micro-blade texture */
    for (var k = 0; k < 5500; k++) {
      g.fillStyle = (k % 2 === 0) ? 'rgba(220,252,231,0.08)' : 'rgba(20,83,45,0.07)';
      g.fillRect((k * 317) % 1024, (k * 613) % 1024, 2, 3);
    }

    /* World-to-Canvas helper: worldX in [-32, 32], worldZ in [-12, 52] */
    function wx(x) { return ((x + 32) / 64) * 1024; }
    function wz(z) { return ((z + 12) / 64) * 1024; }

    g.strokeStyle = 'rgba(255,255,255,0.95)';
    g.fillStyle = 'rgba(255,255,255,0.96)';
    g.lineWidth = 4.8;

    /* Goal Line across Z = 0 (X = -30..+30) */
    g.beginPath();
    g.moveTo(wx(-30), wz(0));
    g.lineTo(wx(30), wz(0));
    g.stroke();

    /* Touchlines X = ±30 */
    g.beginPath();
    g.moveTo(wx(-30), wz(0));
    g.lineTo(wx(-30), wz(50));
    g.moveTo(wx(30), wz(0));
    g.lineTo(wx(30), wz(50));
    g.stroke();

    /* 18-Yard Penalty Area: X = ±20.16, Z = 0..16.5 */
    g.strokeRect(wx(-20.16), wz(0), wx(20.16) - wx(-20.16), wz(16.5) - wz(0));

    /* 6-Yard Goal Area: X = ±9.16, Z = 0..5.5 */
    g.strokeRect(wx(-9.16), wz(0), wx(9.16) - wx(-9.16), wz(5.5) - wz(0));

    /* Penalty Spot at (0, 9.0) */
    g.beginPath();
    g.arc(wx(0), wz(9.0), 6.5, 0, Math.PI * 2);
    g.fill();

    /* Penalty D-Arc: radius 9.15m from (0, 9.0), clipped to Z >= 16.5 */
    g.save();
    g.beginPath();
    g.rect(0, wz(16.5), 1024, 1024 - wz(16.5));
    g.clip();
    g.beginPath();
    g.arc(wx(0), wz(9.0), (9.15 / 64) * 1024, 0, Math.PI * 2);
    g.stroke();
    g.restore();

    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    if (maxAniso) tex.anisotropy = maxAniso;
    return tex;
  }

  function makeNetTexture(THREE) {
    var c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    var g = c.getContext('2d');
    g.clearRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(255, 255, 255, 0.94)';
    g.lineWidth = 4;
    for (var i = -128; i <= 256; i += 32) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i + 128, 128);
      g.stroke();
      g.beginPath();
      g.moveTo(i + 128, 0);
      g.lineTo(i, 128);
      g.stroke();
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeBallTexture(THREE, hal) {
    var c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = hal ? '#fb923c' : '#ffffff';
    g.fillRect(0, 0, 512, 256);

    g.fillStyle = hal ? '#1e1b4b' : '#0f172a';
    g.strokeStyle = hal ? '#7c2d12' : '#38bdf8';
    g.lineWidth = 3.5;
    var pts = [
      [64, 64], [192, 64], [320, 64], [448, 64],
      [128, 148], [256, 148], [384, 148], [0, 148], [512, 148],
      [64, 224], [192, 224], [320, 224], [448, 224]
    ];
    pts.forEach(function (p) {
      g.beginPath();
      for (var k = 0; k < 5; k++) {
        var ang = -Math.PI / 2 + k * (Math.PI * 2 / 5);
        var px = p[0] + Math.cos(ang) * 26;
        var py = p[1] + Math.sin(ang) * 24;
        if (k === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
      g.fill();
      g.stroke();
    });

    g.strokeStyle = hal ? '#fde047' : '#f59e0b';
    g.lineWidth = 5.5;
    g.beginPath();
    g.moveTo(0, 128);
    g.bezierCurveTo(160, 68, 350, 188, 512, 128);
    g.stroke();

    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ---------- Painterly Pixar Stadium Crowd & Banners Texture (Zero Pill Primitives!) ---------- */
  function makeStadiumCrowdTexture(THREE, hal) {
    var W = 1024, H = 256;
    var c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    var g = c.getContext('2d');

    /* Deep stadium terrace shadow-to-sunlit gradient */
    var bg = g.createLinearGradient(0, 0, 0, H);
    if (hal) {
      bg.addColorStop(0.0, '#0f0724');
      bg.addColorStop(0.65, '#1e1142');
      bg.addColorStop(1.0, '#111827');
    } else {
      bg.addColorStop(0.0, '#0f2557');
      bg.addColorStop(0.55, '#1d3b7a');
      bg.addColorStop(1.0, '#0f172a');
    }
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    /* Concrete aisle steps & horizontal terrace risers */
    for (var r = 0; r < 5; r++) {
      var ry = 18 + r * 38;
      g.fillStyle = 'rgba(255,255,255,0.07)';
      g.fillRect(0, ry, W, 3);
      g.fillStyle = 'rgba(6,9,17,0.28)';
      g.fillRect(0, ry + 30, W, 8);
    }

    /* Soft-focus painterly Pixar stadium supporters & team scarves (warm golden-hour bokeh, zero plastic pills!) */
    var shirtColors = hal
      ? ['#f97316', '#a855f7', '#facc15', '#ec4899', '#38bdf8', '#22c55e']
      : ['#38bdf8', '#f59e0b', '#f43f5e', '#10b981', '#a855f7', '#facc15', '#f8fafc'];
    var hairTones = ['#2c1b12', '#4a2e1b', '#8c5832', '#d99b43', '#1e293b'];
    var skinTones = ['#f4c6a5', '#e3ab84', '#c98a63', '#99603f'];

    for (var row = 0; row < 4; row++) {
      var baseY = 48 + row * 40;
      var count = 44;
      for (var i = 0; i < count; i++) {
        var seed = (row * 97 + i * 31) % 997;
        var cx = (i + 0.5) * (W / count) + ((seed % 7) - 3) * 1.8;
        var cy = baseY + ((seed % 5) - 2) * 1.6;
        /* Leave narrow stadium stair aisles at x=256 and x=768 */
        if (Math.abs(cx - 256) < 16 || Math.abs(cx - 768) < 16) continue;

        var col = shirtColors[seed % shirtColors.length];
        var skin = skinTones[(seed >> 2) % skinTones.length];
        var hair = hairTones[(seed >> 3) % hairTones.length];

        /* Soft rounded shoulders */
        g.fillStyle = col;
        g.beginPath();
        g.ellipse(cx, cy + 12, 11, 10, 0, Math.PI, Math.PI * 2);
        g.fill();

        /* Occasional raised team scarf between cheering fans */
        if (seed % 11 === 0) {
          g.strokeStyle = (seed % 2 === 0) ? '#fde047' : '#38bdf8';
          g.lineWidth = 4.5;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(cx - 10, cy - 6);
          g.quadraticCurveTo(cx, cy - 12, cx + 10, cy - 6);
          g.stroke();
        }

        /* Warm head + hair cap silhouette */
        g.fillStyle = skin;
        g.beginPath();
        g.arc(cx, cy, 6.2, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = hair;
        g.beginPath();
        g.arc(cx, cy - 1.5, 6.4, Math.PI * 0.95, Math.PI * 2.05);
        g.fill();
      }
    }

    /* Soft atmospheric golden-hour sunlight haze across upper terrace so foreground Pixar athletes pop 100%! */
    var haze = g.createLinearGradient(0, 0, 0, H);
    haze.addColorStop(0.0, hal ? 'rgba(88,28,135,0.28)' : 'rgba(254,243,199,0.22)');
    haze.addColorStop(0.75, 'rgba(15,23,42,0.10)');
    haze.addColorStop(1.0, 'rgba(6,9,17,0.35)');
    g.fillStyle = haze;
    g.fillRect(0, 0, W, H);

    /* Front Stadium Balcony Barrier & Championship Supporter Banners (bottom 48px) */
    g.fillStyle = '#0f172a';
    g.fillRect(0, H - 48, W, 48);
    g.fillStyle = '#f59e0b';
    g.fillRect(0, H - 48, W, 5);

    var banners = [
      { x: 26, w: 280, bg: '#0284c7', txt: '★ ADVENTURE FC ★' },
      { x: 356, w: 312, bg: '#dc2626', txt: '⚽ SUPER STRIKERS ⚽' },
      { x: 718, w: 280, bg: '#059669', txt: '🏆 CHAMPIONS CUP 🏆' }
    ];
    banners.forEach(function (bn) {
      g.fillStyle = bn.bg;
      g.fillRect(bn.x, H - 39, bn.w, 30);
      g.strokeStyle = '#fde047';
      g.lineWidth = 2.5;
      g.strokeRect(bn.x, H - 39, bn.w, 30);
      g.fillStyle = '#ffffff';
      g.font = '900 18px Fredoka, system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(bn.txt, bn.x + bn.w * 0.5, H - 23);
    });

    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }

  function makeContactShadowTexture(THREE) {
    var S = 128;
    var c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(S * 0.5, S * 0.5, S * 0.06, S * 0.5, S * 0.5, S * 0.48);
    grd.addColorStop(0.0, 'rgba(4, 12, 8, 0.58)');
    grd.addColorStop(0.55, 'rgba(4, 12, 8, 0.26)');
    grd.addColorStop(1.0, 'rgba(4, 12, 8, 0.0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, S, S);
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ---------- Extruded 3D Pixar PupilAvatars Volume Engine ---------- */
  /* 2-pass RGB edge dilation into transparent pixels so WebGL bilinear filtering has ZERO dark or white fringes! */
  function bleedAlphaEdges(srcCanvas) {
    var w = srcCanvas.width, h = srcCanvas.height;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var g = c.getContext('2d');
    g.drawImage(srcCanvas, 0, 0);
    var idat = g.getImageData(0, 0, w, h);
    var d = idat.data;
    for (var pass = 0; pass < 2; pass++) {
      var copy = new Uint8ClampedArray(d);
      for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
          var o = (y * w + x) * 4;
          if (copy[o + 3] >= 18) continue;
          var sr = 0, sg = 0, sb = 0, cnt = 0;
          var offs = [-w * 4, w * 4, -4, 4];
          for (var k = 0; k < 4; k++) {
            var no = o + offs[k];
            if (copy[no + 3] >= 36) {
              sr += copy[no];
              sg += copy[no + 1];
              sb += copy[no + 2];
              cnt++;
            }
          }
          if (cnt > 0) {
            d[o] = (sr / cnt) | 0;
            d[o + 1] = (sg / cnt) | 0;
            d[o + 2] = (sb / cnt) | 0;
          }
        }
      }
    }
    g.putImageData(idat, 0, 0);
    return c;
  }

  /* Build Warm Studio-Lit 3D Side-Rim Bevel Canvas matching local hair, skin, glove, jersey & cleat colors! */
  function make3DSideRimCanvas(frontCanvas) {
    var w = frontCanvas.width, h = frontCanvas.height;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var g = c.getContext('2d');
    g.drawImage(frontCanvas, 0, 0);
    var idat = g.getImageData(0, 0, w, h);
    var d = idat.data;
    for (var y = 0; y < h; y++) {
      /* Subtle golden-sky top bounce -> grounded warm lower rim */
      var vMul = 0.84 - (y / Math.max(1, h)) * 0.12;
      for (var x = 0; x < w; x++) {
        var o = (y * w + x) * 4;
        if (d[o + 3] < 24) continue;
        d[o]     = clamp(Math.round(d[o] * vMul + 10), 0, 255);
        d[o + 1] = clamp(Math.round(d[o + 1] * (vMul - 0.02) + 8), 0, 255);
        d[o + 2] = clamp(Math.round(d[o + 2] * (vMul + 0.03) + 14), 0, 255);
      }
    }
    g.putImageData(idat, 0, 0);
    return bleedAlphaEdges(c);
  }

  function makeCanvasTex3D(THREE, canvas, maxAniso, trackFn) {
    var clean = bleedAlphaEdges(canvas);
    var tex = new THREE.CanvasTexture(clean);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    if (maxAniso) tex.anisotropy = maxAniso;
    if (trackFn) trackFn(tex);
    return tex;
  }

  function makeSideTex3D(THREE, frontCanvas, maxAniso, trackFn) {
    var rimCv = make3DSideRimCanvas(frontCanvas);
    var tex = new THREE.CanvasTexture(rimCv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    if (maxAniso) tex.anisotropy = maxAniso;
    if (trackFn) trackFn(tex);
    return tex;
  }

  /* Build a Solid Extruded 3D Pixar Relief Part (Front + Rounded 3D Side-Bevel Slices + True Rear Silhouette + Real Turf Shadow!) */
  function buildExtrudedPixarVolume(THREE, widthM, heightM, depthM, sliceCount, trackFn) {
    var grp = new THREE.Group();
    var planeGeo = trackFn(new THREE.PlaneGeometry(widthM, heightM));

    var frontMat = trackFn(new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.52,
      side: THREE.FrontSide,
      toneMapped: false
    }));
    var backMat = trackFn(new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.52,
      side: THREE.FrontSide,
      toneMapped: false
    }));
    var sideMat = trackFn(new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.58,
      side: THREE.DoubleSide,
      toneMapped: false
    }));

    var frontMesh = new THREE.Mesh(planeGeo, frontMat);
    frontMesh.position.z = depthM * 0.5;
    grp.add(frontMesh);

    var backMesh = new THREE.Mesh(planeGeo, backMat);
    backMesh.position.z = -depthM * 0.5;
    backMesh.rotation.y = Math.PI;
    grp.add(backMesh);

    var nSlices = Math.max(3, sliceCount || 7);
    var midIdx = Math.floor(nSlices * 0.5);
    for (var i = 0; i < nSlices; i++) {
      var frac = ((i + 1) / (nSlices + 1)) * 2 - 1; /* -1 .. +1 */
      var sl = new THREE.Mesh(planeGeo, sideMat);
      sl.position.z = frac * (depthM * 0.46);
      /* Smooth cosine 3D bevel profile so edges look genuinely sculpted & rounded from 3/4 and side angles! */
      var bev = 0.986 + 0.014 * Math.cos(frac * Math.PI * 0.5);
      sl.scale.set(bev, bev, 1);
      if (i === midIdx) {
        sl.castShadow = true;
      }
      grp.add(sl);
    }

    return {
      group: grp,
      frontMat: frontMat,
      backMat: backMat,
      sideMat: sideMat,
      setTextures: function (fTex, bTex, sTex) {
        if (fTex && frontMat.map !== fTex) { frontMat.map = fTex; frontMat.needsUpdate = true; }
        if (bTex && backMat.map !== bTex) { backMat.map = bTex; backMat.needsUpdate = true; }
        var rim = sTex || fTex;
        if (rim && sideMat.map !== rim) { sideMat.map = rim; sideMat.needsUpdate = true; }
      }
    };
  }

  function createEmptyPlaceholderTex(THREE, trackFn) {
    var c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    var tex = new THREE.CanvasTexture(c);
    if (trackFn) trackFn(tex);
    return tex;
  }

  /* Create Articulated 3D Pixar Athlete directly from genuine PupilAvatars 3D artwork + extruded 3D sides! */
  function create3DAthlete(THREE, opts, disposables, rigTexCache, maxAniso) {
    opts = opts || {};
    var isKeeper = !!opts.isKeeper;
    var PX_TO_M = 0.00215;

    function track(o) {
      if (o && disposables) disposables.push(o);
      return o;
    }

    var emptyTex = createEmptyPlaceholderTex(THREE, track);

    var rootGrp = new THREE.Group();

    /* Grounded 3D Contact Shadow Disc on stadium grass */
    var shadowGeo = track(new THREE.PlaneGeometry(0.76, 0.50));
    shadowGeo.rotateX(-Math.PI * 0.5);
    var shadowMat = track(new THREE.MeshBasicMaterial({
      map: track(makeContactShadowTexture(THREE)),
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
      toneMapped: false
    }));
    var contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.set(0, 0.008, 0);
    rootGrp.add(contactShadow);

    /* Default anatomical metrics matching PupilAvatars.composePitchRigParts (HIP_YD=400, NECK_DRAW_Y=87, soleYd=681) */
    var basePelvisY = (681 - 400) * PX_TO_M; /* 0.6042m */
    var pelvis = new THREE.Group();
    pelvis.position.set(0, basePelvisY, 0);
    rootGrp.add(pelvis);

    var spine = new THREE.Group();
    pelvis.add(spine);

    var neck = new THREE.Group();
    neck.position.set(0, (400 - 87) * PX_TO_M, 0); /* 0.6730m above hip */
    spine.add(neck);

    var headPivot = new THREE.Group();
    neck.add(headPivot);

    /* 1. Extruded 3D Pixar Torso + Posed 5-Finger Arms + Shorts Waistband (depth = 0.074m) */
    var torsoVol = buildExtrudedPixarVolume(THREE, 512 * PX_TO_M, 468 * PX_TO_M, 0.074, 9, track);
    torsoVol.group.position.set(0, (400 - 234) * PX_TO_M, 0);
    torsoVol.setTextures(emptyTex, emptyTex, emptyTex);
    spine.add(torsoVol.group);

    /* 2. Extruded 3D Pixar Head (depth = 0.106m centered at z = +0.005 so head wraps neck cleanly from BOTH front and back!) */
    var headVol = buildExtrudedPixarVolume(THREE, 400 * PX_TO_M, 400 * PX_TO_M, 0.106, 9, track);
    headVol.group.position.set(0, (306 - 200) * PX_TO_M, 0.005);
    headVol.setTextures(emptyTex, emptyTex, emptyTex);
    headPivot.add(headVol.group);

    /* 3. Articulated Left & Right Pixar Legs (Shorts Thigh + Knee + Hooped Sock + Cleat, depth = 0.050m tucked inside shorts cuff!) */
    var legL = { hip: new THREE.Group(), knee: new THREE.Group() };
    legL.hip.position.set(-52 * PX_TO_M, 0, 0);
    pelvis.add(legL.hip);
    var legLVol = buildExtrudedPixarVolume(THREE, 176 * PX_TO_M, 308 * PX_TO_M, 0.050, 7, track);
    legLVol.group.position.set(0, (16 - 154) * PX_TO_M, 0);
    legLVol.setTextures(emptyTex, emptyTex, emptyTex);
    legL.hip.add(legLVol.group);

    var legR = { hip: new THREE.Group(), knee: new THREE.Group() };
    legR.hip.position.set(52 * PX_TO_M, 0, 0);
    pelvis.add(legR.hip);
    var legRVol = buildExtrudedPixarVolume(THREE, 176 * PX_TO_M, 308 * PX_TO_M, 0.050, 7, track);
    legRVol.group.position.set(0, (16 - 154) * PX_TO_M, 0);
    legRVol.setTextures(emptyTex, emptyTex, emptyTex);
    legR.hip.add(legRVol.group);

    /* Compatibility dummy joints so any external pose helper never throws */
    var armL = { shoulder: new THREE.Group(), elbow: new THREE.Group() };
    var armR = { shoulder: new THREE.Group(), elbow: new THREE.Group() };

    var activePack = null;
    var curPose = 'stand';
    var curExpr = 'smile';
    var reqToken = 0;

    function syncActiveTextures() {
      if (!activePack) return;
      var hFront = curExpr === 'laugh' ? activePack.headLaugh
        : (curExpr === 'wink' ? activePack.headWink : activePack.headSmile);
      var hSide = curExpr === 'laugh' ? activePack.headLaughSide
        : (curExpr === 'wink' ? activePack.headWinkSide : activePack.headSmileSide);
      headVol.setTextures(hFront, activePack.headBack, hSide);

      var tFront = curPose === 'cheer' ? activePack.torsoCheer
        : (curPose === 'wave' ? activePack.torsoWave : activePack.torsoStand);
      var tBack = curPose === 'cheer' ? activePack.torsoBackCheer
        : (curPose === 'wave' ? activePack.torsoBackWave : activePack.torsoBackStand);
      var tSide = curPose === 'cheer' ? activePack.torsoCheerSide
        : (curPose === 'wave' ? activePack.torsoWaveSide : activePack.torsoStandSide);
      torsoVol.setTextures(tFront, tBack, tSide);

      legLVol.setTextures(activePack.legLFront, activePack.legLBack, activePack.legLSide);
      legRVol.setTextures(activePack.legRFront, activePack.legRBack, activePack.legRSide);
    }

    function applyPackMetrics(pack) {
      activePack = pack;
      athleteApi.basePelvisY = pack.basePelvisY;
      neck.position.y = pack.neckY;
      torsoVol.group.position.y = pack.torsoCenterY;
      headVol.group.position.y = pack.headCenterY;
      legLVol.group.position.y = pack.legCenterY;
      legRVol.group.position.y = pack.legCenterY;
      syncActiveTextures();
    }

    function setAvatarFromPupil(avatarKey, kitHex, numStr) {
      if (!root.PupilAvatars || typeof root.PupilAvatars.composePitchRigParts !== 'function') return;
      var key = String(avatarKey || 'student-3a-209');
      var kHex = String(kitHex || opts.kitHex || '#38bdf8');
      var sqNum = String(numStr || opts.number || (isKeeper ? '1' : '10'));
      var cKey = key + '|' + kHex + '|' + sqNum + '|' + (isKeeper ? 'gk' : 'pl');

      if (rigTexCache && rigTexCache[cKey]) {
        applyPackMetrics(rigTexCache[cKey]);
        return;
      }

      var tok = ++reqToken;
      root.PupilAvatars.composePitchRigParts(key, {
        kitColor: kHex,
        number: sqNum,
        isKeeper: isKeeper
      }).then(function (rig) {
        if (!rig) return;
        var pack = rigTexCache && rigTexCache[cKey];
        if (!pack) {
          pack = {
            basePelvisY: (rig.soleYd - rig.hipYd) * PX_TO_M,
            neckY: (rig.hipYd - rig.neckYd) * PX_TO_M,
            torsoCenterY: (rig.hipYd - rig.torsoH * 0.5) * PX_TO_M,
            headCenterY: (rig.chinYInHead - rig.headCanvasSize * 0.5) * PX_TO_M,
            legCenterY: (rig.legHipOffsetY - rig.legH * 0.5) * PX_TO_M,
            headSmile: makeCanvasTex3D(THREE, rig.headSmile, maxAniso, track),
            headLaugh: makeCanvasTex3D(THREE, rig.headLaugh, maxAniso, track),
            headWink: makeCanvasTex3D(THREE, rig.headWink, maxAniso, track),
            headBack: makeCanvasTex3D(THREE, rig.headBack, maxAniso, track),
            headSmileSide: makeSideTex3D(THREE, rig.headSmile, maxAniso, track),
            headLaughSide: makeSideTex3D(THREE, rig.headLaugh, maxAniso, track),
            headWinkSide: makeSideTex3D(THREE, rig.headWink, maxAniso, track),
            torsoStand: makeCanvasTex3D(THREE, rig.torsoStand, maxAniso, track),
            torsoWave: makeCanvasTex3D(THREE, rig.torsoWave, maxAniso, track),
            torsoCheer: makeCanvasTex3D(THREE, rig.torsoCheer, maxAniso, track),
            torsoBackStand: makeCanvasTex3D(THREE, rig.torsoBackStand || rig.torsoBack, maxAniso, track),
            torsoBackWave: makeCanvasTex3D(THREE, rig.torsoBackWave || rig.torsoBack, maxAniso, track),
            torsoBackCheer: makeCanvasTex3D(THREE, rig.torsoBackCheer || rig.torsoBack, maxAniso, track),
            torsoStandSide: makeSideTex3D(THREE, rig.torsoStand, maxAniso, track),
            torsoWaveSide: makeSideTex3D(THREE, rig.torsoWave, maxAniso, track),
            torsoCheerSide: makeSideTex3D(THREE, rig.torsoCheer, maxAniso, track),
            legLFront: makeCanvasTex3D(THREE, rig.legLeft, maxAniso, track),
            legLBack: makeCanvasTex3D(THREE, rig.legLeftBack, maxAniso, track),
            legLSide: makeSideTex3D(THREE, rig.legLeft, maxAniso, track),
            legRFront: makeCanvasTex3D(THREE, rig.legRight, maxAniso, track),
            legRBack: makeCanvasTex3D(THREE, rig.legRightBack, maxAniso, track),
            legRSide: makeSideTex3D(THREE, rig.legRight, maxAniso, track)
          };
          if (rigTexCache) rigTexCache[cKey] = pack;
        }
        if (tok !== reqToken) return;
        applyPackMetrics(pack);
      }).catch(function () { /* keep current rig */ });
    }

    /* ---------- Real Polygonal .GLB SkinnedMesh + Bone-Socketed Crown Upgrade ---------- */
    var glbRig = null;
    var glbModeWanted = (opts.useGlb !== false);
    var curKitHex = String(opts.kitHex || '#38bdf8');

    function syncKitToGlb(hexStr) {
      curKitHex = String(hexStr || '#38bdf8');
      if (!glbRig || !glbRig.recolor) return;
      glbRig.recolor({
        teeHex: curKitHex,
        shortsHex: isKeeper ? '#1e293b' : '#0f172a',
        skinHex: '#f4c29f',
        hairHex: isKeeper ? '#1e293b' : '#5b341b',
        shoeHex: '#f8fafc',
        soleHex: curKitHex
      });
    }

    function applyGlbVisibility() {
      var showGlb = !!(glbModeWanted && glbRig && glbRig.root);
      pelvis.visible = !showGlb;
      if (glbRig && glbRig.root) glbRig.root.visible = showGlb;
    }

    if (root.Avatar3DEngine && typeof root.Avatar3DEngine.loadCachedGlb === 'function') {
      root.Avatar3DEngine.loadCachedGlb('../assets/3d/characters/kid-base.glb').then(function (gltf) {
        var ATH_H = 1.54;
        glbRig = root.Avatar3DEngine.autoRigHumanoidScene(gltf.scene, ATH_H, {
          teeHex: curKitHex,
          shortsHex: isKeeper ? '#1e293b' : '#0f172a',
          skinHex: '#f4c29f',
          hairHex: isKeeper ? '#1e293b' : '#5b341b',
          shoeHex: '#f8fafc',
          soleHex: curKitHex
        });
        var bm = glbRig.boneMap || {};
        var restHipY = 0.42 * ATH_H;
        glbRig.root.traverse(function (c) {
          if (c.isSkinnedMesh) {
            c.onBeforeRender = function () {
              if (!glbRig.root.visible) return;
              var dy = pelvis.position.y - athleteApi.basePelvisY;
              if (bm.mixamorigHips) {
                bm.mixamorigHips.position.set(pelvis.position.x, restHipY + dy, pelvis.position.z);
                bm.mixamorigHips.rotation.copy(pelvis.rotation);
              }
              if (bm.mixamorigSpine) bm.mixamorigSpine.rotation.copy(spine.rotation);
              if (bm.mixamorigNeck) bm.mixamorigNeck.rotation.copy(neck.rotation);
              if (bm.mixamorigHead) bm.mixamorigHead.rotation.copy(headPivot.rotation);
              if (bm.mixamorigLeftUpLeg) bm.mixamorigLeftUpLeg.rotation.copy(legL.hip.rotation);
              if (bm.mixamorigLeftLeg) bm.mixamorigLeftLeg.rotation.copy(legL.knee.rotation);
              if (bm.mixamorigRightUpLeg) bm.mixamorigRightUpLeg.rotation.copy(legR.hip.rotation);
              if (bm.mixamorigRightLeg) bm.mixamorigRightLeg.rotation.copy(legR.knee.rotation);

              var swing = legR.hip.rotation.x;
              if (bm.mixamorigLeftArm && bm.mixamorigRightArm) {
                if (curPose === 'cheer') {
                  bm.mixamorigLeftArm.rotation.set(-0.15, 0, -1.25);
                  bm.mixamorigRightArm.rotation.set(-0.15, 0, 1.25);
                } else if (curPose === 'wave') {
                  var wt = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.007;
                  bm.mixamorigLeftArm.rotation.set(0, 0, 0.12);
                  bm.mixamorigRightArm.rotation.set(-0.15, 0, 1.18 + Math.sin(wt) * 0.22);
                } else if (isKeeper) {
                  bm.mixamorigLeftArm.rotation.set(-0.35, 0, -0.38);
                  bm.mixamorigRightArm.rotation.set(-0.35, 0, 0.38);
                } else {
                  bm.mixamorigLeftArm.rotation.set(swing * 0.65, 0, 0.12);
                  bm.mixamorigRightArm.rotation.set(-swing * 0.65, 0, -0.12);
                }
              }
            };
          }
        });
        rootGrp.add(glbRig.root);
        applyGlbVisibility();

        if (opts.withCrown && bm.mixamorigHead) {
          root.Avatar3DEngine.loadCachedGlb('../assets/3d/items/crown.glb').then(function (cGltf) {
            var cMesh = cGltf.scene;
            root.Avatar3DEngine.applyItemFallbackMaterial(cMesh, 'crown');
            root.Avatar3DEngine.normalizeItemToSize(cMesh, 0.26);
            var wrap = new THREE.Group();
            wrap.position.set(0, 0.43, 0);
            wrap.add(cMesh);
            bm.mixamorigHead.add(wrap);
          }).catch(function () { /* optional crown */ });
        }
      }).catch(function () { /* fallback cleanly to extruded Pixar rig */ });
    }

    var origSetAvatar = setAvatarFromPupil;
    setAvatarFromPupil = function (avatarKey, kitHex, numStr) {
      syncKitToGlb(kitHex || opts.kitHex);
      origSetAvatar(avatarKey, kitHex, numStr);
    };

    var athleteApi = {
      root: rootGrp,
      pelvis: pelvis,
      spine: spine,
      neck: neck,
      headPivot: headPivot,
      contactShadow: contactShadow,
      basePelvisY: basePelvisY,
      armL: armL,
      armR: armR,
      legL: legL,
      legR: legR,
      setAvatar: setAvatarFromPupil,
      setGlbMode: function (flag) {
        glbModeWanted = !!flag;
        applyGlbVisibility();
      },
      setPose: function (poseName) {
        var next = (poseName === 'cheer' || poseName === 'wave') ? poseName : 'stand';
        if (curPose !== next) {
          curPose = next;
          syncActiveTextures();
        }
      },
      setExpression: function (exprName) {
        var next = (exprName === 'laugh' || exprName === 'wink') ? exprName : 'smile';
        if (curExpr !== next) {
          curExpr = next;
          syncActiveTextures();
        }
      }
    };

    /* Trigger initial Pixar avatar build immediately */
    setAvatarFromPupil(opts.avatarKey || (isKeeper ? 'student-3a-211' : 'student-3a-209'), opts.kitHex, opts.number);
    return athleteApi;
  }

  /* ==========================================================================
     GAME MAKER MODE REGISTRATION: GM.modes.penalty
     ========================================================================== */
  GM.modes.penalty = {
    id: 'penalty',
    name: '3D Pumpkin Penalty',
    nameClassic: '3D Penalty Shootout',
    e: '⚽',
    desc: 'Real 3D Stadium! Answer right to ignite your shot, then swipe the 3D ball with curve or lock onto Top-Bins targets!',
    descClassic: 'Real 3D Stadium! Answer right to ignite your shot, then swipe the 3D ball with curve or lock onto Top-Bins targets!',
    fields: [
      { key: 'kicks', label: 'Kicks per team', opts: [[3, '3 kicks'], [4, '4 kicks'], [5, '5 kicks']], def: 4 },
      { key: 'level', label: 'Goalkeeper Mode', opts: [['easy', 'Easy AI'], ['normal', 'Smart AI'], ['hard', 'Pro AI'], ['duel', '2-Team Rival Keeper!']], def: 'normal' }
    ],

    start: function (ctx) {
      var THREE = root.THREE;
      if (!THREE) {
        ctx.root.innerHTML = '<div style="padding:32px;color:#fff;font-size:1.4rem;">3D Engine loading error — please press Ctrl+F5.</div>';
        return;
      }

      var st = GM.state;
      var hal = st.theme === 'halloween';
      var T = st.teams;
      var nt = T.length;
      var kicksPerTeam = +ctx.cfg.kicks || 4;
      var totalKicks = kicksPerTeam * nt;
      var duelMode = (ctx.cfg.level === 'duel' && nt >= 2);
      var aiLevelKey = (ctx.cfg.level === 'easy' || ctx.cfg.level === 'hard') ? ctx.cfg.level : 'normal';

      var LV = {
        easy:   { patrolSpd: 1.45, patrolRange: 1.50, reactDelay: 0.16, diveSpdX: 5.0, diveLift: 0.95, reach: 0.46, err: 1.45 },
        normal: { patrolSpd: 1.95, patrolRange: 1.75, reactDelay: 0.10, diveSpdX: 6.2, diveLift: 1.15, reach: 0.55, err: 0.95 },
        hard:   { patrolSpd: 2.45, patrolRange: 2.00, reactDelay: 0.04, diveSpdX: 7.6, diveLift: 1.35, reach: 0.65, err: 0.45 }
      }[aiLevelKey];

      /* Real FIFA Goal Dimensions (in meters) */
      var GOAL_HALF_W = 3.66;
      var GOAL_H = 2.44;
      var GOAL_DEPTH = 2.15;
      var SPOT_Z = 9.0;
      var BALL_R = 0.24;
      var GRAVITY = 9.81;

      try { if (A() && A().musicStart) A().musicStart(hal ? 'halloween' : 'sports'); } catch (e) { /* ignore */ }
      if (document.body) document.body.classList.add('gm-hide-pods', 'gm-real3-active');

      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      /* ---------- Build Cyber-Glass Broadcast UI Overlays ---------- */
      var container = U().h('div', { class: 'gm-pen3d-root' });
      var canvasWrap = U().h('div', { class: 'gm-pen3d-canvas-wrap' });

      var scorebugEl = U().h('div', { class: 'gm-pen3d-scorebug' });
      var bannerTitleEl = U().h('div', { class: 'gm-pen3d-banner-title' });
      var bannerSubEl = U().h('div', { class: 'gm-pen3d-banner-sub' });
      var bannerEl = U().h('div', { class: 'gm-pen3d-banner' }, [bannerTitleEl, bannerSubEl]);

      var useRealGlbAthletes = true;
      var glbToggleBtn = U().h('button', {
        type: 'button',
        class: 'gm-pen3d-pill-btn duel-on',
        text: '🧊 3D: Real .GLB + Crown'
      });
      var duelToggleBtn = U().h('button', {
        type: 'button',
        class: 'gm-pen3d-pill-btn' + (duelMode ? ' duel-on' : ''),
        text: duelMode ? '🧤 Keeper: Rival Team!' : '🧤 Keeper: Smart AI'
      });
      var windBadgeEl = U().h('div', { class: 'gm-pen3d-wind-badge', text: '💨 Wind: Calm' });
      var topRightEl = U().h('div', { class: 'gm-pen3d-topright' }, [
        glbToggleBtn,
        nt >= 2 ? duelToggleBtn : null,
        windBadgeEl
      ]);
      var topHud = U().h('div', { class: 'gm-pen3d-top' }, [scorebugEl, bannerEl, topRightEl]);

      /* Live In-Stadium Question Dock */
      var qDockEl = U().h('div', { class: 'gm-pen3d-qdock hidden' });
      /* 2-Team Rival Keeper Secret Dive Picker */
      var duelDockEl = U().h('div', { class: 'gm-pen3d-duel-dock hidden' });

      /* Shoot Controls Dock (Spin + Oscillating Power Meter + Giant Kick Button) */
      var spinBtns = {};
      var spinRow = U().h('div', { class: 'gm-pen3d-spin-row' });
      [[-1, '↩️ Bend L'], [0, '⚡ Straight'], [1, '↪️ Bend R']].forEach(function (pair) {
        var b = U().h('button', {
          type: 'button',
          class: 'gm-pen3d-spin-btn' + (pair[0] === 0 ? ' on' : ''),
          text: pair[1]
        });
        b.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (A()) A().play('tap');
          setSpinPreset(pair[0]);
        });
        spinBtns[pair[0]] = b;
        spinRow.appendChild(b);
      });

      var meterNeedleEl = U().h('div', { class: 'gm-pen3d-meter-needle', style: 'left:65%' });
      var meterBarEl = U().h('div', { class: 'gm-pen3d-meter-bar' }, [
        U().h('div', { class: 'gm-pen3d-meter-sweet' }),
        meterNeedleEl
      ]);
      var meterValLbl = U().h('span', { text: 'Sweet Spot!' });
      var meterWrap = U().h('div', { class: 'gm-pen3d-meter-wrap' }, [
        U().h('div', { class: 'gm-pen3d-meter-lbl' }, [U().h('span', { text: '⚡ Shot Power' }), meterValLbl]),
        meterBarEl
      ]);
      var kickBtnEl = U().h('button', {
        type: 'button',
        class: 'gm-pen3d-kick-btn',
        text: '⚽ KICK NOW!'
      });
      var shootDockEl = U().h('div', { class: 'gm-pen3d-shoot-dock hidden' }, [spinRow, meterWrap, kickBtnEl]);

      /* Center Goal/Save Broadcast Splash */
      var splashTxtEl = U().h('div', { class: 'gm-pen3d-splash-txt' });
      var splashSubEl = U().h('div', { class: 'gm-pen3d-splash-sub' });
      var splashEl = U().h('div', { class: 'gm-pen3d-splash' }, [splashTxtEl, splashSubEl]);

      container.appendChild(canvasWrap);
      container.appendChild(topHud);
      container.appendChild(qDockEl);
      container.appendChild(duelDockEl);
      container.appendChild(shootDockEl);
      container.appendChild(splashEl);
      rootEl.appendChild(container);

      /* ---------- Initialize Three.js WebGL Scene, Camera & Renderer ---------- */
      var disposables = [];
      function track(o) { if (o) disposables.push(o); return o; }

      var renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = hal ? 1.06 : 1.13;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2));
      canvasWrap.appendChild(renderer.domElement);

      var scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(hal ? 0x1a0b2e : 0xbfe3ff, hal ? 0.0080 : 0.0032);

      var camera = new THREE.PerspectiveCamera(44, 16 / 9, 0.15, 220);
      camera.position.set(1.05, 2.20, 15.5);
      var camPos = new THREE.Vector3(1.05, 2.20, 15.5);
      var camLook = new THREE.Vector3(-0.15, -0.75, 5.5);
      var camTargetPos = new THREE.Vector3(1.05, 2.20, 15.5);
      var camTargetLook = new THREE.Vector3(-0.15, -0.75, 5.5);
      var camShakeT = 0;
      var camShakeMag = 0;

      /* Stadium Sky Dome */
      var skyMesh = new THREE.Mesh(
        track(new THREE.SphereGeometry(135, 28, 18)),
        track(new THREE.MeshBasicMaterial({ map: track(makeSkyTexture(THREE, hal)), side: THREE.BackSide, fog: false }))
      );
      scene.add(skyMesh);

      /* 5-Point Pixar Golden-Hour Lighting Rig + Warm Portrait Fill + Real 2048px Soft Shadows */
      var hemiLight = new THREE.HemisphereLight(hal ? 0xe9d5ff : 0xe0f2fe, hal ? 0x3b2f4a : 0xfef3c7, hal ? 0.92 : 1.06);
      scene.add(hemiLight);

      var keyLight = new THREE.DirectionalLight(hal ? 0xfed7aa : 0xfff7ed, hal ? 2.15 : 2.28);
      keyLight.position.set(13, 21, 19);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.near = 4;
      keyLight.shadow.camera.far = 52;
      keyLight.shadow.camera.left = -11;
      keyLight.shadow.camera.right = 11;
      keyLight.shadow.camera.top = 14;
      keyLight.shadow.camera.bottom = -12;
      keyLight.shadow.bias = -0.0005;
      scene.add(keyLight);

      /* Soft Warm Front Portrait Fill so Close-Up Celebrations (+Z) Glow Like a Pixar Film */
      var frontFillLight = new THREE.DirectionalLight(0xfff1e6, hal ? 0.42 : 0.56);
      frontFillLight.position.set(-3, 5, 18);
      scene.add(frontFillLight);

      /* Warm Golden-Hour Rim Light catching 3D Hair Edges & Shoulders */
      var rimLight = new THREE.DirectionalLight(hal ? 0xa855f7 : 0xfde68a, hal ? 0.95 : 1.12);
      rimLight.position.set(-14, 12, -12);
      scene.add(rimLight);

      /* Cool Sky 3D-Side Modeling Fill so Shaded Cheeks & Ribcages Pop */
      var sideFillLight = new THREE.DirectionalLight(0x7dd3fc, hal ? 0.35 : 0.62);
      sideFillLight.position.set(-16, 7, 12);
      scene.add(sideFillLight);

      /* 3D Mowed Grass Pitch (64m x 64m centered at X=0, Z=20 so Z spans [-12..+52]) */
      var maxAniso = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
      var pitchGeo = track(new THREE.PlaneGeometry(64, 64));
      pitchGeo.rotateX(-Math.PI * 0.5);
      var pitchMat = track(new THREE.MeshStandardMaterial({
        map: track(makePitchTexture(THREE, maxAniso)),
        roughness: 0.84,
        metalness: 0.02
      }));
      var pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
      pitchMesh.position.set(0, 0, 20);
      pitchMesh.receiveShadow = true;
      scene.add(pitchMesh);

      /* Outer Emerald Stadium Turf Apron */
      var apronGeo = track(new THREE.PlaneGeometry(180, 180));
      apronGeo.rotateX(-Math.PI * 0.5);
      var apronMesh = new THREE.Mesh(apronGeo, track(new THREE.MeshStandardMaterial({ color: hal ? 0x064e3b : 0x15803d, roughness: 0.92 })));
      apronMesh.position.set(0, -0.02, 10);
      scene.add(apronMesh);

      /* ---------- 3D Aluminum Goal Frame & Deformable Vertex-Spring Net ---------- */
      var goalGroup = new THREE.Group();
      scene.add(goalGroup);

      var postMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.35 }));
      var stanchionMat = track(new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.5 }));
      var postR = 0.065;

      var postGeo = track(new THREE.CylinderGeometry(postR, postR, GOAL_H + postR, 18));
      var leftPost = new THREE.Mesh(postGeo, postMat);
      leftPost.position.set(-GOAL_HALF_W, GOAL_H * 0.5, 0);
      leftPost.castShadow = true;
      var rightPost = new THREE.Mesh(postGeo, postMat);
      rightPost.position.set(GOAL_HALF_W, GOAL_H * 0.5, 0);
      rightPost.castShadow = true;

      var crossbarGeo = track(new THREE.CylinderGeometry(postR, postR, GOAL_HALF_W * 2 + postR * 2, 18));
      crossbarGeo.rotateZ(Math.PI * 0.5);
      var crossbar = new THREE.Mesh(crossbarGeo, postMat);
      crossbar.position.set(0, GOAL_H, 0);
      crossbar.castShadow = true;
      goalGroup.add(leftPost, rightPost, crossbar);

      /* Rear Goal Base & Support Stanchions */
      [-GOAL_HALF_W, GOAL_HALF_W].forEach(function (gx) {
        var topStrut = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.035, GOAL_DEPTH * 0.72, 10)), stanchionMat);
        topStrut.rotation.x = Math.PI * 0.5;
        topStrut.position.set(gx, GOAL_H - 0.02, -GOAL_DEPTH * 0.36);
        var backDiag = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.035, 2.82, 10)), stanchionMat);
        backDiag.position.set(gx, GOAL_H * 0.5, -GOAL_DEPTH * 0.68);
        backDiag.rotation.x = 0.52;
        goalGroup.add(topStrut, backDiag);
      });
      var backGroundBar = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.04, 0.04, GOAL_HALF_W * 2, 12)).rotateZ(Math.PI * 0.5),
        stanchionMat
      );
      backGroundBar.position.set(0, 0.04, -GOAL_DEPTH);
      goalGroup.add(backGroundBar);

      /* Deformable 3D Back Net + Side & Top Nets */
      var netTex = track(makeNetTexture(THREE));
      netTex.repeat.set(18, 7);
      var netMat = track(new THREE.MeshStandardMaterial({
        map: netTex,
        transparent: true,
        alphaTest: 0.14,
        side: THREE.DoubleSide,
        roughness: 0.65
      }));

      var backNetGeo = track(new THREE.PlaneGeometry(GOAL_HALF_W * 2, GOAL_H, 24, 14));
      /* Slope back net from Z = -GOAL_DEPTH*0.72 at top down to Z = -GOAL_DEPTH at ground */
      var bnPos = backNetGeo.attributes.position;
      var bnBase = new Float32Array(bnPos.array.length);
      for (var bi = 0; bi < bnPos.count; bi++) {
        var vx = bnPos.getX(bi);
        var vy = bnPos.getY(bi) + GOAL_H * 0.5;
        var vz = lerp(-GOAL_DEPTH, -GOAL_DEPTH * 0.72, vy / GOAL_H);
        bnPos.setXYZ(bi, vx, vy, vz);
        bnBase[bi * 3] = vx;
        bnBase[bi * 3 + 1] = vy;
        bnBase[bi * 3 + 2] = vz;
      }
      backNetGeo.computeVertexNormals();
      var backNetMesh = new THREE.Mesh(backNetGeo, netMat);
      goalGroup.add(backNetMesh);

      /* Side Net Panels (Trapezoid quads) */
      var sideNetTex = track(makeNetTexture(THREE));
      sideNetTex.repeat.set(6, 7);
      var sideNetMat = track(new THREE.MeshStandardMaterial({
        map: sideNetTex,
        transparent: true,
        alphaTest: 0.14,
        side: THREE.DoubleSide,
        roughness: 0.65
      }));
      [-1, 1].forEach(function (sDir) {
        var sGeo = track(new THREE.PlaneGeometry(GOAL_DEPTH, GOAL_H, 8, 8));
        var sp = sGeo.attributes.position;
        for (var si = 0; si < sp.count; si++) {
          var u = (sp.getX(si) + GOAL_DEPTH * 0.5) / GOAL_DEPTH; /* 0 front -> 1 back */
          var sy = sp.getY(si) + GOAL_H * 0.5;
          var maxBack = lerp(GOAL_DEPTH, GOAL_DEPTH * 0.72, sy / GOAL_H);
          sp.setXYZ(si, sDir * GOAL_HALF_W, sy, -u * maxBack);
        }
        sGeo.computeVertexNormals();
        goalGroup.add(new THREE.Mesh(sGeo, sideNetMat));
      });

      /* Top Roof Net */
      var roofGeo = track(new THREE.PlaneGeometry(GOAL_HALF_W * 2, GOAL_DEPTH * 0.72, 12, 4));
      roofGeo.rotateX(Math.PI * 0.5);
      var roofNet = new THREE.Mesh(roofGeo, sideNetMat);
      roofNet.position.set(0, GOAL_H, -GOAL_DEPTH * 0.36);
      goalGroup.add(roofNet);

      /* ---------- Animated 3D LED Perimeter Ribbon Board ---------- */
      var ledCanvas = document.createElement('canvas');
      ledCanvas.width = 1024;
      ledCanvas.height = 96;
      var ledCtx = ledCanvas.getContext('2d');
      var ledTex = track(new THREE.CanvasTexture(ledCanvas));
      ledTex.colorSpace = THREE.SRGBColorSpace;
      var ledState = { mode: 'arena', text: '★ ENGLISH ADVENTURE ARENA ★ 3D PENALTY SHOOTOUT ★', accent: '#38bdf8' };

      function drawLedBoard(nowMs) {
        ledCtx.fillStyle = '#060911';
        ledCtx.fillRect(0, 0, 1024, 96);
        ledCtx.fillStyle = ledState.accent;
        ledCtx.fillRect(0, 0, 1024, 6);
        ledCtx.fillRect(0, 90, 1024, 6);
        ledCtx.font = '900 44px Fredoka, system-ui, sans-serif';
        ledCtx.textBaseline = 'middle';
        var pulse = 0.85 + Math.sin(nowMs / 160) * 0.15;
        ledCtx.fillStyle = ledState.mode === 'goal' ? ('rgba(253,224,71,' + pulse + ')') : '#f8fafc';
        var scroll = (nowMs * 0.09) % 1024;
        ledCtx.fillText(ledState.text + '   ' + ledState.text, -scroll, 50);
        ledTex.needsUpdate = true;
      }
      drawLedBoard(0);

      var ledMesh = new THREE.Mesh(
        track(new THREE.BoxGeometry(28, 1.05, 0.28)),
        track(new THREE.MeshBasicMaterial({ map: ledTex }))
      );
      ledMesh.position.set(0, 0.53, -4.8);
      scene.add(ledMesh);

      /* ---------- 360° Sunlit Pixar Stadium Stands, Painterly Crowd Terraces & 4 Floodlight Pylons ---------- */
      var standMat1 = track(new THREE.MeshStandardMaterial({ color: hal ? 0x0f172a : 0x1e3a8a, roughness: 0.72 }));
      var standMat2 = track(new THREE.MeshStandardMaterial({ color: hal ? 0x1e293b : 0x334155, roughness: 0.76 }));
      var fasciaMat = track(new THREE.MeshStandardMaterial({ color: hal ? 0x7c2d12 : 0xf59e0b, roughness: 0.42, metalness: 0.25 }));
      var roofMat = track(new THREE.MeshStandardMaterial({ color: hal ? 0x334155 : 0xf1f5f9, roughness: 0.38, metalness: 0.18 }));

      /* Tiered North Stand Architecture behind the goal */
      for (var tier = 0; tier < 4; tier++) {
        var tz = -8.4 - tier * 2.4;
        var ty = 0.9 + tier * 1.45;
        var rowMesh = new THREE.Mesh(track(new THREE.BoxGeometry(50 + tier * 3, 1.55, 2.5)), tier % 2 === 0 ? standMat1 : standMat2);
        rowMesh.position.set(0, ty, tz);
        scene.add(rowMesh);
      }
      var northFascia = new THREE.Mesh(track(new THREE.BoxGeometry(54, 0.36, 0.28)), fasciaMat);
      northFascia.position.set(0, 3.85, -10.9);
      scene.add(northFascia);

      /* Sleek Championship Stadium Canopy Rim & Gold Fascia over North Stand */
      var roofTrimMat = track(new THREE.MeshStandardMaterial({ color: hal ? 0x1e1b4b : 0x0f172a, roughness: 0.45, metalness: 0.35 }));
      var canopy = new THREE.Mesh(track(new THREE.BoxGeometry(58, 0.44, 6.5)), roofTrimMat);
      canopy.position.set(0, 8.15, -13.8);
      canopy.rotation.x = -0.05;
      scene.add(canopy);
      var canopyGoldEdge = new THREE.Mesh(track(new THREE.BoxGeometry(58.2, 0.22, 0.32)), fasciaMat);
      canopyGoldEdge.position.set(0, 8.05, -10.55);
      scene.add(canopyGoldEdge);

      /* Side Stands (Left & Right) */
      [-1, 1].forEach(function (sd) {
        for (var stTier = 0; stTier < 3; stTier++) {
          var sRow = new THREE.Mesh(track(new THREE.BoxGeometry(2.5, 1.4 + stTier * 1.35, 46)), stTier % 2 === 0 ? standMat1 : standMat2);
          sRow.position.set(sd * (25.5 + stTier * 2.3), 0.7 + stTier * 0.68, 8);
          scene.add(sRow);
        }
      });

      /* Painterly Pixar Stadium Crowd & Supporter Banners Terraces (Zero Pill Primitives!) */
      var crowdTex = track(makeStadiumCrowdTexture(THREE, hal));
      crowdTex.repeat.set(2.2, 1);
      var crowdTerraceMat = track(new THREE.MeshBasicMaterial({ map: crowdTex, toneMapped: false }));
      var crowdPanels = [];
      [
        { x: 0, y: 2.35, z: -7.15, w: 50, h: 3.1, rx: -0.22, ry: 0 },
        { x: 0, y: 5.25, z: -10.85, w: 54, h: 3.3, rx: -0.24, ry: 0 }
      ].forEach(function (cfg, idx) {
        var cp = new THREE.Mesh(track(new THREE.PlaneGeometry(cfg.w, cfg.h)), crowdTerraceMat);
        cp.position.set(cfg.x, cfg.y, cfg.z);
        cp.rotation.set(cfg.rx, cfg.ry, 0);
        scene.add(cp);
        crowdPanels.push({ mesh: cp, baseY: cfg.y, phase: idx * 1.4 });
      });
      [-1, 1].forEach(function (sd, idx) {
        var sp = new THREE.Mesh(track(new THREE.PlaneGeometry(44, 3.0)), crowdTerraceMat);
        sp.position.set(sd * 24.1, 2.25, 8);
        sp.rotation.y = -sd * Math.PI * 0.5;
        scene.add(sp);
        crowdPanels.push({ mesh: sp, baseY: 2.25, phase: 2.2 + idx });
      });

      /* 4 Towering Stadium Floodlight Pylons + Volumetric Glow Halos */
      var glowCv = document.createElement('canvas');
      glowCv.width = 128; glowCv.height = 128;
      var glowCtx = glowCv.getContext('2d');
      var rGrd = glowCtx.createRadialGradient(64, 64, 4, 64, 64, 64);
      rGrd.addColorStop(0, 'rgba(255, 251, 235, 0.95)');
      rGrd.addColorStop(0.35, 'rgba(56, 189, 248, 0.38)');
      rGrd.addColorStop(1, 'rgba(56, 189, 248, 0)');
      glowCtx.fillStyle = rGrd;
      glowCtx.fillRect(0, 0, 128, 128);
      var glowTex = track(new THREE.CanvasTexture(glowCv));
      var glowSpriteMat = track(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false }));

      var pylonMat = track(new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 }));
      var lampGlowMat = track(new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
      [[-21, -17], [21, -17], [-26, 15], [26, 15]].forEach(function (xz) {
        var tower = new THREE.Mesh(track(new THREE.CylinderGeometry(0.32, 0.58, 20, 10)), pylonMat);
        tower.position.set(xz[0], 10, xz[1]);
        scene.add(tower);
        var headPanel = new THREE.Mesh(track(new THREE.BoxGeometry(3.8, 2.1, 0.5)), lampGlowMat);
        headPanel.position.set(xz[0], 20.2, xz[1]);
        headPanel.lookAt(0, 1, 5);
        scene.add(headPanel);
        var halo = new THREE.Sprite(glowSpriteMat);
        halo.position.set(xz[0], 20.2, xz[1] + 0.5);
        halo.scale.set(11, 11, 1);
        scene.add(halo);
      });

      /* Waving 3D Corner Flags */
      var cornerFlags = [];
      [[-29.8, 0], [29.8, 0]].forEach(function (cxz, idx) {
        var pole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8)), postMat);
        pole.position.set(cxz[0], 0.75, cxz[1]);
        scene.add(pole);
        var flag = new THREE.Mesh(
          track(new THREE.PlaneGeometry(0.55, 0.36, 5, 2)),
          track(new THREE.MeshStandardMaterial({ color: idx === 0 ? 0xf59e0b : 0xf43f5e, side: THREE.DoubleSide }))
        );
        flag.position.set(cxz[0] + 0.28, 1.32, cxz[1]);
        scene.add(flag);
        cornerFlags.push(flag);
      });

      /* ---------- 3D Spinning Soccer Ball + Golden Super-Shot Aura ---------- */
      var ballMesh = new THREE.Mesh(
        track(new THREE.SphereGeometry(BALL_R, 28, 22)),
        track(new THREE.MeshStandardMaterial({
          map: track(makeBallTexture(THREE, hal)),
          roughness: 0.32,
          metalness: 0.08
        }))
      );
      ballMesh.castShadow = true;
      ballMesh.position.set(0, BALL_R, SPOT_Z);
      scene.add(ballMesh);

      var superAuraMesh = new THREE.Mesh(
        track(new THREE.SphereGeometry(BALL_R * 1.42, 20, 16)),
        track(new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false }))
      );
      ballMesh.add(superAuraMesh);

      /* ---------- 3D Top-Bins Golden Bullseye Targets ---------- */
      var bonusTargets = [];
      var targetRingMat = track(new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xb45309, emissiveIntensity: 0.45, metalness: 0.65, roughness: 0.2 }));
      var targetCoreMat = track(new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.55, metalness: 0.4, roughness: 0.2 }));
      [-1, 1].forEach(function (side) {
        var tg = new THREE.Group();
        var ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.42, 0.065, 12, 28)), targetRingMat);
        var gem = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.20, 0)), targetCoreMat);
        tg.add(ring, gem);
        tg.position.set(side * 2.76, 1.84, 0.06);
        scene.add(tg);
        bonusTargets.push({ group: tg, gem: gem, baseX: side * 2.76, baseY: 1.84, hit: false, side: side });
      });

      /* ---------- 3D Goal Aiming Reticle + 3D Trajectory Arc Spheres ---------- */
      var reticleGroup = new THREE.Group();
      var retOuter = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.36, 0.042, 12, 32)),
        track(new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.92 }))
      );
      var retInner = new THREE.Mesh(
        track(new THREE.RingGeometry(0.08, 0.15, 24)),
        track(new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide, transparent: true, opacity: 0.95 }))
      );
      reticleGroup.add(retOuter, retInner);
      reticleGroup.visible = false;
      scene.add(reticleGroup);

      var ARC_DOTS = 18;
      var arcDots = [];
      var arcDotGeo = track(new THREE.SphereGeometry(0.075, 10, 8));
      var arcDotMat = track(new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }));
      for (var ai = 0; ai < ARC_DOTS; ai++) {
        var dm = new THREE.Mesh(arcDotGeo, arcDotMat);
        dm.visible = false;
        scene.add(dm);
        arcDots.push(dm);
      }

      /* ---------- 3D Particle Pool (Turf Sparks, Gold Shards & Confetti) ---------- */
      var MAX_PARTS = 90;
      var partPool = [];
      var partGeo = track(new THREE.BoxGeometry(0.11, 0.11, 0.04));
      for (var pi = 0; pi < MAX_PARTS; pi++) {
        var pm = new THREE.Mesh(partGeo, track(new THREE.MeshBasicMaterial({ color: 0xfde047 })));
        pm.visible = false;
        scene.add(pm);
        partPool.push({ mesh: pm, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 1 });
      }
      function spawn3DBurst(x, y, z, count, colors, speed) {
        var spawned = 0;
        for (var i = 0; i < partPool.length && spawned < count; i++) {
          var p = partPool[i];
          if (p.life > 0) continue;
          p.mesh.visible = true;
          p.mesh.position.set(x, y, z);
          p.mesh.material.color.setHex(colors[spawned % colors.length]);
          var ang = Math.random() * Math.PI * 2;
          var elev = (Math.random() * 0.8 + 0.2) * (speed || 5.5);
          p.vx = Math.cos(ang) * (speed || 5.5) * (0.4 + Math.random() * 0.7);
          p.vy = elev;
          p.vz = Math.sin(ang) * (speed || 5.5) * 0.5;
          p.maxLife = 0.55 + Math.random() * 0.45;
          p.life = p.maxLife;
          spawned++;
        }
      }

      /* ---------- Create Extruded 3D Pixar Striker, Goalkeeper & Sideline Teammates ---------- */
      var rigTexCache = {};
      var striker3D = create3DAthlete(THREE, { isKeeper: false, withCrown: true, useGlb: useRealGlbAthletes, avatarKey: 'student-3a-209', kitHex: (T[0] && T[0].color) || '#38bdf8', number: '10' }, disposables, rigTexCache, maxAniso);
      striker3D.root.position.set(-0.86, 0, SPOT_Z + 1.58);
      striker3D.root.rotation.y = Math.PI - 0.38;
      scene.add(striker3D.root);

      var keeper3D = create3DAthlete(THREE, { isKeeper: true, useGlb: useRealGlbAthletes, avatarKey: 'student-3a-211', kitHex: '#84cc16', number: '1' }, disposables, rigTexCache, maxAniso);
      keeper3D.root.position.set(0, 0, 0.24);
      keeper3D.root.rotation.y = 0; /* Faces +Z toward striker & camera! */
      scene.add(keeper3D.root);

      /* Two cheering 3D Pixar teammates framed cleanly on either side of the penalty spot! */
      var buddyL = create3DAthlete(THREE, { isKeeper: false, useGlb: useRealGlbAthletes, avatarKey: 'student-3a-206', kitHex: (T[0] && T[0].color) || '#38bdf8', number: '7' }, disposables, rigTexCache, maxAniso);
      buddyL.root.position.set(-3.55, 0, 9.15);
      buddyL.root.rotation.y = 0.52;
      buddyL.setPose('wave');
      scene.add(buddyL.root);

      var buddyR = create3DAthlete(THREE, { isKeeper: false, useGlb: useRealGlbAthletes, avatarKey: 'student-3a-224', kitHex: (T[Math.min(1, nt - 1)] && T[Math.min(1, nt - 1)].color) || '#f59e0b', number: '9' }, disposables, rigTexCache, maxAniso);
      buddyR.root.position.set(3.65, 0, 9.15);
      buddyR.root.rotation.y = -0.52;
      buddyR.setPose('stand');
      scene.add(buddyR.root);

      glbToggleBtn.addEventListener('click', function () {
        useRealGlbAthletes = !useRealGlbAthletes;
        if (A()) A().play('tap');
        glbToggleBtn.classList.toggle('duel-on', useRealGlbAthletes);
        glbToggleBtn.textContent = useRealGlbAthletes ? '🧊 3D: Real .GLB + Crown' : '🎨 3D: Pupil Faces';
        [striker3D, keeper3D, buddyL, buddyR].forEach(function (a) {
          if (a && a.setGlbMode) a.setGlbMode(useRealGlbAthletes);
        });
      });

      /* ---------- Game State, Physics & Animation Variables ---------- */
      var alive = true;
      var ended = false;
      var turn = 0;
      var kickNo = 0;
      /* Phases: 'quiz' | 'duel_pick' | 'aim' | 'runup' | 'flight' | 'celebrate' | 'finale' */
      var phase = 'quiz';
      var phaseT = 0;
      var hitStopT = 0;
      var slowMoT = 0;
      var crowdWaveT = 0;

      var superShot = false;
      var duelKeeperChoice = null; /* -1 left, 0 center, +1 right */
      var stadiumWind = 0;

      var aimX = 1.65;       /* Meters [-3.8 .. +3.8] */
      var aimY = 1.35;       /* Meters [0.20 .. 2.75] */
      var spinPreset = 0;    /* -1, 0, +1 */
      var shotSpin = 0;      /* Continuous [-1.2 .. +1.2] */
      var meterPhase = 0;
      var meterVal = 0.68;   /* [0.25 .. 1.15] */

      var ballState = {
        x: 0, y: BALL_R, z: SPOT_Z,
        vx: 0, vy: 0, vz: 0,
        spinY: 0,
        crossed: false,
        outcome: '',
        hitBonus: false
      };

      var keeperState = {
        x: 0, y: 0, z: 0.24,
        patrolDir: 1,
        stepPhase: 0,
        reactTimer: 0,
        diving: false,
        diveT: 0,
        startX: 0,
        targetX: 0,
        targetY: 0.9,
        saved: false
      };

      var netWave = { active: false, t: 0, hx: 0, hy: 1.2 };
      var scorecard = T.map(function () { return []; });

      /* Raycaster for 1:1 3D Goal Plane Touch Aiming */
      var raycaster = new THREE.Raycaster();
      var goalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); /* Z = 0 */
      var rayHit = new THREE.Vector3();

      /* ---------- Helper UI Functions ---------- */
      function setBanner(title, sub) {
        bannerTitleEl.textContent = title || '';
        bannerSubEl.textContent = sub || '';
        bannerEl.style.opacity = title ? '1' : '0';
      }

      var splashTm = 0;
      function showSplash(txt, sub, color, durMs) {
        clearTimeout(splashTm);
        splashTxtEl.textContent = txt;
        splashTxtEl.style.color = color || '#fde047';
        splashSubEl.textContent = sub || '';
        splashEl.classList.add('show');
        splashTm = setTimeout(function () {
          splashEl.classList.remove('show');
        }, durMs || 1850);
      }

      function renderScorebug() {
        scorebugEl.innerHTML = '';
        T.forEach(function (t, ti) {
          var row = U().h('div', {
            class: 'gm-pen3d-sb-row' + (ti === turn ? ' is-turn' : ''),
            'data-pen3d-team': String(ti)
          });
          row.style.setProperty('--tc', t.color || '#38bdf8');
          row.appendChild(U().h('span', { class: 'gm-pen3d-sb-swatch' }));
          if (GM.mon && GM.mon.svg && t.mon) {
            row.appendChild(U().h('span', { class: 'gm-pen3d-sb-av', html: GM.mon.svg(t.mon, 28) }));
          }
          row.appendChild(U().h('span', { class: 'gm-pen3d-sb-name', text: t.name || ('Team ' + (ti + 1)) }));
          var dots = U().h('div', { class: 'gm-pen3d-sb-dots' });
          for (var ki = 0; ki < kicksPerTeam; ki++) {
            var entry = scorecard[ti][ki];
            var cls = 'gm-pen3d-dot' + (entry ? (' ' + entry.cls) : '');
            dots.appendChild(U().h('span', { class: cls, text: entry ? entry.sym : '·' }));
          }
          row.appendChild(dots);
          row.appendChild(U().h('span', { class: 'gm-pen3d-sb-pts', text: String(t.score || 0) }));
          scorebugEl.appendChild(row);
        });
        U().teamBar(T, turn);
      }

      function setSpinPreset(val) {
        spinPreset = val;
        shotSpin = val * 0.85;
        [-1, 0, 1].forEach(function (k) {
          if (spinBtns[k]) spinBtns[k].classList.toggle('on', k === val);
        });
      }

      duelToggleBtn.addEventListener('click', function () {
        if (nt < 2) return;
        duelMode = !duelMode;
        if (A()) A().play('tap');
        duelToggleBtn.classList.toggle('duel-on', duelMode);
        duelToggleBtn.textContent = duelMode ? '🧤 Keeper: Rival Team!' : '🧤 Keeper: Smart AI';
        updateAthletesForTurn();
      });

      function pickKeeperColor(strikerHex) {
        if (duelMode && nt >= 2) {
          var rival = T[(turn + 1) % nt];
          if (rival && rival.color && rival.color.toLowerCase() !== String(strikerHex).toLowerCase()) {
            return rival.color;
          }
        }
        var s = String(strikerHex || '').toLowerCase();
        if (s.indexOf('22c55e') >= 0 || s.indexOf('10b981') >= 0 || s.indexOf('4ade80') >= 0) return '#f43f5e';
        return '#84cc16';
      }

      var QUICK_AVATAR_POOL = [
        'student-3a-209', 'student-3a-206',
        'student-3a-224', 'student-3a-211',
        'demo-boy', 'demo-girl',
        'student-4b-208', 'student-4b-306'
      ];

      function resolveMonAvatarKey(monObj, fallbackIdx) {
        if (monObj && (monObj.avatarKey || monObj.id)) {
          return String(monObj.avatarKey || monObj.id);
        }
        return QUICK_AVATAR_POOL[Math.abs(fallbackIdx || 0) % QUICK_AVATAR_POOL.length];
      }

      function updateAthletesForTurn() {
        var t = T[turn];
        var rival = T[(turn + 1) % nt] || t;
        var sCol = (t && t.color) || '#38bdf8';
        var rCol = (rival && rival.color && rival !== t) ? rival.color : '#f59e0b';

        var sKey = resolveMonAvatarKey(t && t.mon, turn);
        var buddyLMon = (t && t.roster && t.roster.length > 1)
          ? t.roster[((t.rIdx || 0) + 1) % t.roster.length]
          : null;
        var bLKey = buddyLMon ? resolveMonAvatarKey(buddyLMon, turn + 2) : QUICK_AVATAR_POOL[(turn + 2) % QUICK_AVATAR_POOL.length];
        if (bLKey === sKey) bLKey = QUICK_AVATAR_POOL[(turn + 3) % QUICK_AVATAR_POOL.length];

        var buddyRMon = (rival && rival !== t && rival.roster && rival.roster.length > 1)
          ? rival.roster[((rival.rIdx || 0) + 1) % rival.roster.length]
          : null;
        var bRKey = buddyRMon ? resolveMonAvatarKey(buddyRMon, turn + 5) : QUICK_AVATAR_POOL[(turn + 5) % QUICK_AVATAR_POOL.length];
        if (bRKey === sKey || bRKey === bLKey) bRKey = QUICK_AVATAR_POOL[(turn + 4) % QUICK_AVATAR_POOL.length];

        var kKey = (duelMode && nt >= 2 && rival && rival.mon)
          ? resolveMonAvatarKey(rival.mon, turn + 1)
          : (sKey === 'student-3a-211' ? 'student-4b-208' : 'student-3a-211');

        striker3D.setAvatar(sKey, sCol, String(10 + (turn % 4)));
        striker3D.setPose('stand');
        striker3D.setExpression('smile');

        buddyL.setAvatar(bLKey, sCol, '7');
        buddyL.setPose('wave');
        buddyL.setExpression('smile');

        buddyR.setAvatar(bRKey, rCol, '9');
        buddyR.setPose('stand');
        buddyR.setExpression('smile');

        var kCol = pickKeeperColor(sCol);
        keeper3D.setAvatar(kKey, kCol, '1');
        keeper3D.setPose('stand');
        keeper3D.setExpression('smile');
      }

      function onAvatarsReady() {
        if (!alive) return;
        updateAthletesForTurn();
      }
      root.addEventListener('eaa:avatars-ready', onAvatarsReady);

      function rollWind() {
        if (aiLevelKey === 'easy') {
          stadiumWind = 0;
          windBadgeEl.textContent = '💨 Wind: Calm';
          return;
        }
        var mag = (aiLevelKey === 'hard' ? 2.4 : 1.4) * (Math.random() * 2 - 1);
        if (Math.abs(mag) < 0.45) {
          stadiumWind = 0;
          windBadgeEl.textContent = '💨 Wind: Calm';
        } else {
          stadiumWind = mag;
          var mph = Math.round(Math.abs(mag) * 6);
          windBadgeEl.textContent = mag > 0 ? ('💨 Wind: ' + mph + ' mph ➔') : ('💨 Wind: ⬅ ' + mph + ' mph');
        }
      }

      /* ---------- Reset Pitch Entities & Start Turn (In-Stadium Question!) ---------- */
      function resetPitchEntities() {
        rollWind();
        updateAthletesForTurn();

        ballState.x = 0;
        ballState.y = BALL_R;
        ballState.z = SPOT_Z;
        ballState.vx = ballState.vy = ballState.vz = 0;
        ballState.spinY = 0;
        ballState.crossed = false;
        ballState.outcome = '';
        ballState.hitBonus = false;
        ballMesh.position.set(0, BALL_R, SPOT_Z);
        ballMesh.rotation.set(0, 0, 0);

        striker3D.root.position.set(-0.86, 0, SPOT_Z + 1.58);
        striker3D.root.rotation.set(0, Math.PI - 0.38, 0);
        striker3D.pelvis.rotation.set(0, 0, 0);
        striker3D.spine.rotation.set(0, 0, 0);
        striker3D.legL.hip.rotation.set(0, 0, 0);
        striker3D.legR.hip.rotation.set(0, 0, 0);

        keeperState.x = 0;
        keeperState.y = 0;
        keeperState.z = 0.24;
        keeperState.diving = false;
        keeperState.diveT = 0;
        keeperState.saved = false;
        keeper3D.root.position.set(0, 0, 0.24);
        keeper3D.root.rotation.set(0, 0, 0);

        bonusTargets.forEach(function (bt) {
          bt.hit = false;
          bt.group.visible = true;
        });

        aimX = (kickNo % 2 === 0 ? 1 : -1) * 1.85;
        aimY = 1.38;
        setSpinPreset(0);
        duelKeeperChoice = null;
        reticleGroup.visible = false;
        arcDots.forEach(function (d) { d.visible = false; });
      }

      function recordAnswerSkill(item, firstTry) {
        if (!item) return;
        if (GM._skillsFor !== GM.sessionMissed) {
          GM._skillsFor = GM.sessionMissed;
          GM.sessionSkills = {};
          GM._endSkills = null;
        }
        if (item.skill) {
          var o = GM.sessionSkills[item.skill] = GM.sessionSkills[item.skill] || { n: 0, ok: 0 };
          o.n++;
          if (firstTry) o.ok++;
        }
        if (!firstTry && GM.sessionMissed && GM.sessionMissed.indexOf(item) < 0) {
          GM.sessionMissed.push(item);
        }
      }

      function startTurn() {
        if (!alive || ended) return;
        resetPitchEntities();
        renderScorebug();

        phase = 'quiz';
        phaseT = 0;
        superShot = false;
        shootDockEl.classList.add('hidden');
        duelDockEl.classList.add('hidden');

        ledState.mode = 'arena';
        ledState.text = '★ ' + (T[turn].name || 'TEAM').toUpperCase() + ' AT THE SPOT ★ ANSWER FAST FOR GOLDEN SUPER SHOT! ★';
        ledState.accent = T[turn].color || '#38bdf8';

        /* Dramatic Pre-Kick Broadcast Camera showing Striker, Ball & Patrolling Keeper above Question Dock! */
        camTargetPos.set(1.05, 2.20, 15.5);
        camTargetLook.set(-0.15, -0.75, 5.5);

        var t = T[turn];
        var pupilLabel = (t.mon && t.mon.name) ? (' · ' + t.mon.name) : '';
        setBanner(
          '⚽ ' + t.name + pupilLabel + ' — Kick ' + (kickNo + 1) + ' of ' + totalKicks,
          'Answer on 1st try to ignite 🔥 GOLDEN SUPER SHOT!'
        );

        renderInStadiumQuestion(ctx.nextItem(), t);
      }

      function renderInStadiumQuestion(item, team) {
        item = item || { q: 'Ready to take the penalty kick?', a: 'Yes!', w: ['Wait', 'Not yet', 'Skip'] };
        qDockEl.innerHTML = '';
        qDockEl.style.setProperty('--tc', team.color || '#38bdf8');
        qDockEl.classList.remove('hidden');

        var tries = 0;
        var resolved = false;
        var curSpeak = item.speak || item.frame || U().sayOf(item);

        var pupilName = (team.mon && team.mon.name) ? (' · ' + team.mon.name) : '';
        var teamBadgeEl = U().h('span', { class: 'gm-pen3d-team-badge' }, [
          (GM.mon && GM.mon.svg && team.mon) ? U().h('span', { class: 'gm-pen3d-qav', html: GM.mon.svg(team.mon, 30) }) : null,
          U().h('span', { text: (team.name || 'Team') + pupilName })
        ]);
        var headRow = U().h('div', { class: 'gm-pen3d-qhead' }, [
          teamBadgeEl,
          U().h('span', { class: 'gm-pen3d-power-hint', text: '🔥 1st Try = Golden Super Shot (+Power & Curve!)' })
        ]);
        qDockEl.appendChild(headRow);

        var promptRow = U().h('div', { class: 'gm-pen3d-qprompt-row' });
        if (item.pic) {
          promptRow.appendChild(U().h('div', { class: 'gm-pen3d-qpic', html: U().pic(item.pic) }));
        }
        var textWrap = U().h('div', { class: 'gm-pen3d-qtext-wrap' });
        if (item.pass) {
          textWrap.appendChild(U().h('div', { class: 'gm-pen3d-qpass', text: '📖 ' + item.pass }));
        }
        var promptTxt = item.frame
          ? ((item.act ? (item.act + ' — ') : '') + item.frame)
          : U().qText(item);
        var qTextEl = U().h('div', { class: 'gm-pen3d-qtext', text: promptTxt });
        textWrap.appendChild(qTextEl);
        promptRow.appendChild(textWrap);

        var sayBtn = U().h('button', {
          type: 'button',
          class: 'gm-pen3d-say-btn',
          title: 'Listen aloud',
          text: '🔊'
        });
        sayBtn.addEventListener('click', function () {
          ensureAudioCtx();
          if (A()) A().speak(curSpeak);
        });
        promptRow.appendChild(sayBtn);
        qDockEl.appendChild(promptRow);

        /* Auto-speak listening items */
        if (item.speak && /^Listen\./i.test(String(item.q || ''))) {
          try { if (A()) A().speak(String(item.speak)); } catch (e) { /* ignore */ }
        }

        function onQuestionCleared(isSuper) {
          if (resolved || !alive) return;
          resolved = true;
          superShot = !!isSuper;
          playSynthChord(isSuper ? 'super' : 'correct');
          if (A()) A().play('correct');

          setTimeout(function () {
            if (!alive) return;
            qDockEl.classList.add('hidden');
            beginAimOrDuelPhase();
          }, 340);
        }

        /* Speaking / Sentence-Frame Item */
        if (item.frame) {
          var speakRow = U().h('div', { class: 'gm-pen3d-speak-row' });
          if (Array.isArray(item.words) && item.words.length) {
            var pillsBox = U().h('div', { class: 'gm-pen3d-word-pills' });
            item.words.forEach(function (wStr, idx) {
              var wp = U().h('button', {
                type: 'button',
                class: 'gm-pen3d-word-pill' + (idx === 0 ? ' on' : ''),
                text: wStr
              });
              wp.addEventListener('click', function () {
                ensureAudioCtx();
                if (A()) A().play('tap');
                Array.prototype.forEach.call(pillsBox.children, function (c) { c.classList.remove('on'); });
                wp.classList.add('on');
                var cleanW = String(wStr).replace(/^[^\wA-Za-z0-9']+\s*/, '').trim();
                curSpeak = item.tpl ? item.tpl.replace('{w}', cleanW) : cleanW;
                qTextEl.textContent = '🗣️ "' + curSpeak + '"';
                if (A()) A().speak(curSpeak);
              });
              pillsBox.appendChild(wp);
            });
            speakRow.appendChild(pillsBox);
          }
          var judgeBtns = U().h('div', { class: 'gm-pen3d-judge-btns' });
          var bGood = U().h('button', { type: 'button', class: 'gm-pen3d-pill-btn', text: '👏 Good Try! (Normal Kick)' });
          var bSuper = U().h('button', { type: 'button', class: 'gm-pen3d-pill-btn duel-on', text: '🔥 Full Sentence! (Super Shot!)' });
          bGood.addEventListener('click', function () { ensureAudioCtx(); recordAnswerSkill(item, true); onQuestionCleared(false); });
          bSuper.addEventListener('click', function () { ensureAudioCtx(); recordAnswerSkill(item, true); onQuestionCleared(true); });
          judgeBtns.appendChild(bGood);
          judgeBtns.appendChild(bSuper);
          speakRow.appendChild(judgeBtns);
          qDockEl.appendChild(speakRow);
          return;
        }

        /* Standard 4-Option Tactile Smartboard Pads */
        var rightAns = String(item.a || '');
        var wrongs = (item.w || []).map(function (x) { return String(x || ''); }).filter(function (x) { return x && x !== rightAns; });
        if (wrongs.length < 3 && st.items && st.items.length) {
          U().shuffle(st.items).forEach(function (other) {
            if (wrongs.length >= 3 || !other) return;
            var cand = String(other.a || '');
            if (cand && cand !== rightAns && wrongs.indexOf(cand) < 0) wrongs.push(cand);
          });
        }
        var choices = U().shuffle([rightAns].concat(wrongs.slice(0, 3)));
        var letters = ['A', 'B', 'C', 'D'];
        var optsGrid = U().h('div', { class: 'gm-pen3d-opts' });

        choices.forEach(function (optStr, idx) {
          var btnEl = U().h('button', { type: 'button', class: 'gm-pen3d-opt' }, [
            U().h('span', { class: 'gm-pen3d-opt-key', text: letters[idx] || String(idx + 1) }),
            U().h('span', { text: optStr })
          ]);
          btnEl.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            ensureAudioCtx();
            if (resolved || btnEl.disabled) return;

            if (optStr === rightAns) {
              btnEl.classList.add('correct');
              var firstTry = (tries === 0);
              recordAnswerSkill(item, firstTry);
              onQuestionCleared(firstTry);
            } else {
              tries++;
              btnEl.disabled = true;
              btnEl.classList.add('wrong');
              playSynthChord('softfail');

              if (tries >= 2) {
                /* Gentle 2-miss transition with zero point loss, showing correct answer briefly */
                resolved = true;
                recordAnswerSkill(item, false);
                Array.prototype.forEach.call(optsGrid.children, function (c) {
                  if (c.textContent.slice(1) === rightAns) c.classList.add('correct');
                });
                setBanner('💡 Answer: "' + rightAns + '"', 'Almost! Next team steps up!');
                scorecard[turn].push({ sym: '·', cls: '' });
                kickNo++;
                setTimeout(function () {
                  if (!alive) return;
                  qDockEl.classList.add('hidden');
                  U().advanceTeamPupil(team);
                  if (kickNo >= totalKicks) { startFinale(); return; }
                  turn = (turn + 1) % nt;
                  startTurn();
                }, 1450);
              } else {
                var hintRow = qDockEl.querySelector('.gm-pen3d-power-hint');
                if (hintRow) hintRow.textContent = '😊 Good try! Pick the right answer to take your Penalty Kick!';
              }
            }
          });
          optsGrid.appendChild(btnEl);
        });
        qDockEl.appendChild(optsGrid);
      }

      /* ---------- Optional 2-Team Rival Keeper Secret Dive Lock-In ---------- */
      function beginAimOrDuelPhase() {
        if (!alive) return;
        if (duelMode && nt >= 2) {
          phase = 'duel_pick';
          phaseT = 0;
          var defTeam = T[(turn + 1) % nt];
          /* Stay cleanly on open +X pitch side so camera glide never clips striker3D at x = -0.95! */
          camTargetPos.set(1.85, 1.95, 8.6);
          camTargetLook.set(-0.15, 1.22, 1.2);
          setBanner(
            '🧤 ' + defTeam.name + ' Defender: Lock Your Secret Dive!',
            T[turn].name + ' striker, look away for 2 seconds!'
          );
          duelDockEl.innerHTML = '';
          duelDockEl.classList.remove('hidden');
          duelDockEl.appendChild(U().h('div', {
            style: 'font-size:1.25rem;font-weight:900;color:#f8fafc;text-align:center;',
            text: '🧤 ' + defTeam.name + ' Goalkeeper — Tap a Corner Secretly!'
          }));
          var btnRow = U().h('div', { class: 'gm-pen3d-duel-btns' });
          [[-1, '⬅️ Dive Left'], [0, '⬆️ Hold Center'], [1, '➡️ Dive Right']].forEach(function (pair) {
            var db = U().h('button', { type: 'button', class: 'gm-pen3d-opt', style: 'justify-content:center;' }, [
              U().h('span', { text: pair[1] })
            ]);
            db.addEventListener('pointerdown', function (e) {
              e.preventDefault();
              if (A()) A().play('tap');
              duelKeeperChoice = pair[0];
              duelDockEl.classList.add('hidden');
              enterAimPhase();
            });
            btnRow.appendChild(db);
          });
          duelDockEl.appendChild(btnRow);
          return;
        }
        enterAimPhase();
      }

      function enterAimPhase() {
        phase = 'aim';
        phaseT = 0;
        if (A()) A().play('whistle');

        camTargetPos.set(0, 2.05, 14.4);
        camTargetLook.set(0, 0.52, 2.0);

        reticleGroup.visible = true;
        shootDockEl.classList.remove('hidden');
        kickBtnEl.classList.toggle('super', superShot);
        kickBtnEl.textContent = superShot ? '🔥 SUPER KICK!' : '⚽ KICK NOW!';

        ledState.mode = superShot ? 'goal' : 'arena';
        ledState.text = superShot
          ? '🔥 GOLDEN SUPER SHOT UNLOCKED! ★ SWIPE THE BALL OR HIT TOP BINS FOR +35! 🔥'
          : '🎯 SWIPE THE 3D BALL WITH CURVE — OR DRAG THE TARGET & TAP KICK! 🎯';

        setBanner(
          superShot ? '🔥 GOLDEN SUPER SHOT! Swipe Ball or Drag Target!' : '🎯 Swipe the 3D Ball — or Drag Target & Tap KICK!',
          'Hit spinning 🌟 Top-Bins Stars for +35! Watch the goalkeeper patrol!'
        );
      }

      /* ---------- Shot Kinematics & 3D Trajectory Computation ---------- */
      function computeShotVelocity(targetX, targetY, spinVal, powerNorm) {
        /* Flight time from Z = 11.0 to Z = 0: faster with higher power + superShot */
        var pwr = clamp(powerNorm, 0.25, 1.15);
        var boost = superShot ? 1.14 : 1.0;
        var flightT = clamp((0.68 - (pwr - 0.5) * 0.28) / boost, 0.40, 0.78);

        var vz = -SPOT_Z / flightT; /* Negative Z moves from +11.0 toward 0! */
        /* Lateral acceleration from Magnus curve + stadium wind: x(T) = vx*T + 0.5*ax*T^2 */
        var magnusAx = spinVal * (superShot ? 8.6 : 6.8);
        var totalAx = magnusAx + stadiumWind * 0.52;
        /* Aim X is where the player aimed BEFORE wind, or compensated slightly for their own curve so curving feels intuitive! */
        var curveStartOffset = -0.36 * magnusAx * flightT * flightT;
        var vx = (targetX + curveStartOffset) / flightT;
        /* Vertical launch velocity to reach targetY at t = flightT under GRAVITY */
        var effY = targetY + (pwr > 0.92 ? (pwr - 0.92) * 3.1 : 0); /* Overpower climbs! */
        var vy = (effY - BALL_R + 0.5 * GRAVITY * flightT * flightT) / flightT;

        return { vx: vx, vy: vy, vz: vz, ax: totalAx, flightT: flightT };
      }

      function update3DTrajectoryPreview(nowMs) {
        if (phase !== 'aim') {
          reticleGroup.visible = false;
          arcDots.forEach(function (d) { d.visible = false; });
          return;
        }
        reticleGroup.visible = true;
        reticleGroup.position.set(aimX, aimY, 0.05);
        var pulse = 1.0 + Math.sin(nowMs / 130) * 0.10;
        reticleGroup.scale.set(pulse, pulse, 1);
        retOuter.material.color.setHex(superShot ? 0xf59e0b : 0x10b981);

        var kin = computeShotVelocity(aimX, aimY, shotSpin, clamp(meterVal, 0.45, 0.88));
        for (var i = 0; i < ARC_DOTS; i++) {
          var frac = (i + 1) / (ARC_DOTS + 1);
          var t = kin.flightT * frac;
          var px = kin.vx * t + 0.5 * kin.ax * t * t;
          var py = Math.max(0.08, BALL_R + kin.vy * t - 0.5 * GRAVITY * t * t);
          var pz = SPOT_Z + kin.vz * t;
          var dot = arcDots[i];
          dot.visible = true;
          dot.position.set(px, py, pz);
          var s = lerp(1.15, 0.65, frac);
          dot.scale.set(s, s, s);
          dot.material.color.setHex(superShot ? 0xfde047 : (Math.abs(shotSpin) > 0.2 ? 0xa855f7 : 0x38bdf8));
        }
      }

      /* ---------- Trigger 3D Angled Run-Up -> Ball Strike ---------- */
      var lockedPower = 0.72;
      function launchRunUp(customPower) {
        if (!alive || phase !== 'aim') return;
        lockedPower = (typeof customPower === 'number') ? customPower : meterVal;
        phase = 'runup';
        phaseT = 0;
        shootDockEl.classList.add('hidden');
        reticleGroup.visible = false;
        arcDots.forEach(function (d) { d.visible = false; });

        if (A()) A().play('crowd_ooh');
        camTargetPos.set(-0.28, 1.65, 12.2);
        camTargetLook.set(aimX * 0.25, 1.15, 0);
      }

      kickBtnEl.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        ensureAudioCtx();
        if (phase === 'aim') launchRunUp(meterVal);
      });

      function strike3DBall() {
        phase = 'flight';
        phaseT = 0;
        hitStopT = 0.036; /* Crisp 36ms impact hit-stop */
        camShakeT = 0.14;
        camShakeMag = superShot ? 0.12 : 0.07;

        var kin = computeShotVelocity(aimX, aimY, shotSpin, lockedPower);
        ballState.x = 0;
        ballState.y = BALL_R;
        ballState.z = SPOT_Z;
        ballState.vx = kin.vx;
        ballState.vy = kin.vy;
        ballState.vz = kin.vz;
        ballState.ax = kin.ax;
        ballState.spinY = shotSpin * 24;
        ballState.crossed = false;

        if (A()) A().play('ball_kick');
        spawn3DBurst(0, 0.12, SPOT_Z, superShot ? 24 : 14, superShot ? [0xfde047, 0xf97316, 0xffffff] : [0x4ade80, 0xffffff, 0xfde047], 5.2);

        /* Goalkeeper Reaction (AI Physics OR 2-Team Human Rival Choice!) */
        keeperState.startX = keeperState.x;
        keeperState.diving = false;
        keeperState.diveT = 0;

        if (duelMode && duelKeeperChoice !== null) {
          keeperState.reactTimer = 0.02;
          keeperState.targetX = duelKeeperChoice * 2.45;
          keeperState.targetY = duelKeeperChoice === 0 ? 1.35 : clamp(aimY, 0.55, 1.85);
        } else {
          keeperState.reactTimer = LV.reactDelay + (Math.abs(shotSpin) > 0.35 ? 0.065 : 0);
          /* Keeper reads initial launch line with human anticipation error & realistic dive span! */
          var readFactor = Math.abs(shotSpin) > 0.35 ? 0.52 : 0.78;
          var finalLandingX = kin.vx * kin.flightT + 0.5 * kin.ax * kin.flightT * kin.flightT;
          var desiredX = lerp(kin.vx * kin.flightT, finalLandingX, readFactor) + (Math.random() - 0.5) * LV.err;
          var maxDiveSpan = LV.diveSpdX * 0.27;
          keeperState.targetX = clamp(keeperState.startX + clamp(desiredX - keeperState.startX, -maxDiveSpan, maxDiveSpan), -3.0, 3.0);
          keeperState.targetY = clamp(aimY * 0.85, 0.35, 1.85);
        }

        /* Live 3D Ball-Chase Broadcast Camera (glides cleanly beside striker!) */
        camTargetPos.set(0.72 + aimX * 0.14, 1.92, 9.8);
        camTargetLook.set(aimX * 0.35, 1.15, -0.4);
      }

      /* ---------- Smartboard Direct Touch: 3D Flick-Swipe OR Goal Reticle Drag ---------- */
      var pointerMode = null; /* 'ball_swipe' | 'goal_aim' */
      var swipePts = [];

      function updateRayGoalAim(clientX, clientY) {
        var rect = renderer.domElement.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
        var ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
        if (raycaster.ray.intersectPlane(goalPlane, rayHit)) {
          aimX = clamp(rayHit.x, -4.1, 4.1);
          aimY = clamp(rayHit.y, 0.22, 2.85);
        }
      }

      canvasWrap.addEventListener('pointerdown', function (e) {
        if (!alive || phase !== 'aim') return;
        ensureAudioCtx();
        e.preventDefault();
        var rect = renderer.domElement.getBoundingClientRect();
        var relY = (e.clientY - rect.top) / Math.max(1, rect.height);
        if (canvasWrap.setPointerCapture && e.pointerId != null) {
          try { canvasWrap.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
        if (relY > 0.58) {
          /* Touching lower pitch near the 3D soccer ball -> Direct Finger Flick / Banana Swipe! */
          pointerMode = 'ball_swipe';
          swipePts = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
        } else {
          /* Touching upper stadium/goal -> Direct 1:1 3D Goal Reticle Drag! */
          pointerMode = 'goal_aim';
          updateRayGoalAim(e.clientX, e.clientY);
          if (A()) A().play('tap');
        }
      });

      canvasWrap.addEventListener('pointermove', function (e) {
        if (!alive || phase !== 'aim' || !pointerMode) return;
        var rect = renderer.domElement.getBoundingClientRect();
        if (pointerMode === 'goal_aim') {
          updateRayGoalAim(e.clientX, e.clientY);
        } else if (pointerMode === 'ball_swipe') {
          swipePts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
          if (swipePts.length > 28) swipePts.shift();
          var p0 = swipePts[0];
          var dx = (e.clientX - p0.x) / Math.max(1, rect.width);
          var dy = (p0.y - e.clientY) / Math.max(1, rect.height); /* upward swipe > 0 */
          if (dy > 0.04) {
            aimX = clamp(dx * 9.2, -3.9, 3.9);
            aimY = clamp(0.28 + dy * 4.8, 0.25, 2.75);
            if (swipePts.length >= 5) {
              var mid = swipePts[Math.floor(swipePts.length / 2)];
              var chordX = (p0.x + e.clientX) * 0.5;
              var bend = (mid.x - chordX) / Math.max(1, rect.width);
              /* If finger curved right in the middle and tucked back left, ball curves left (and vice versa)! */
              shotSpin = clamp(-bend * 16.0, -1.2, 1.2);
            }
          }
        }
      });

      canvasWrap.addEventListener('pointerup', function (e) {
        if (!alive || phase !== 'aim' || !pointerMode) return;
        var rect = renderer.domElement.getBoundingClientRect();
        if (pointerMode === 'ball_swipe' && swipePts.length >= 2) {
          var p0 = swipePts[0];
          var dy = (p0.y - e.clientY) / Math.max(1, rect.height);
          pointerMode = null;
          swipePts = [];
          if (dy >= 0.09) {
            var swipePwr = clamp(0.42 + dy * 1.15, 0.46, 1.05);
            launchRunUp(swipePwr);
            return;
          }
        }
        pointerMode = null;
        swipePts = [];
      });

      /* Keyboard Shortcuts for Teacher Laptop / Smartboard Remotes */
      function onKeyDown(e) {
        if (!alive || phase !== 'aim') return;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') { aimX = clamp(aimX - 0.32, -3.9, 3.9); }
        else if (e.code === 'ArrowRight' || e.code === 'KeyD') { aimX = clamp(aimX + 0.32, -3.9, 3.9); }
        else if (e.code === 'ArrowUp' || e.code === 'KeyW') { aimY = clamp(aimY + 0.22, 0.25, 2.75); }
        else if (e.code === 'ArrowDown' || e.code === 'KeyS') { aimY = clamp(aimY - 0.22, 0.25, 2.75); }
        else if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); launchRunUp(meterVal); }
      }
      root.addEventListener('keydown', onKeyDown);

      /* ---------- 3D Goal Line Collision, Keeper Gloves, Woodwork & Net Pocket ---------- */
      function evaluateGoalLine() {
        ballState.crossed = true;
        var bx = ballState.x;
        var by = Math.max(BALL_R, ballState.y);
        var absX = Math.abs(bx);

        /* Check Spinning 3D Bonus Star Targets first */
        bonusTargets.forEach(function (bt) {
          if (!bt.hit && Math.hypot(bx - bt.group.position.x, by - bt.group.position.y) <= 0.62) {
            bt.hit = true;
            bt.group.visible = false;
            ballState.hitBonus = true;
            spawn3DBurst(bt.group.position.x, bt.group.position.y, 0.1, 28, [0xfacc15, 0x38bdf8, 0xffffff], 7.0);
          }
        });

        /* 1. Goalkeeper 3D Body & Outstretched Gloves Collision (Golden Super-Shot Star Bullseyes are unstoppable!) */
        var insideMouth = (absX < GOAL_HALF_W - BALL_R * 0.4 && by < GOAL_H - BALL_R * 0.4);
        if (insideMouth && !(superShot && ballState.hitBonus)) {
          /* Compute Keeper's live 3D torso & outstretched glove world positions */
          var kTorsoX = keeperState.x;
          var kTorsoY = keeperState.y + 0.92;
          var reachDir = keeperState.targetX >= keeperState.startX ? 1 : -1;
          var diveFrac = keeperState.diving ? clamp(keeperState.diveT / 0.38, 0, 1) : 0;
          var gloveLeadX = keeperState.x + reachDir * lerp(0.38, 0.96, diveFrac);
          var gloveLeadY = keeperState.y + lerp(1.05, 1.25, diveFrac);

          var dBody = Math.hypot((bx - kTorsoX) * 1.15, (by - kTorsoY) * 0.95);
          var dGlove = Math.hypot(bx - gloveLeadX, by - gloveLeadY);

          if (Math.min(dBody, dGlove) <= LV.reach * (superShot ? 0.86 : 1.0)) {
            ballState.outcome = 'save';
            keeperState.saved = true;
            ballState.hitBonus = false;
            ballState.z = 0.28;
            ballState.vz = Math.abs(ballState.vz) * 0.48;
            ballState.vx = (bx >= keeperState.x ? 1 : -1) * 5.8;
            ballState.vy = 4.6;
            ballState.ax = 0;
            slowMoT = 0.26;
            spawn3DBurst(bx, by, 0.25, 22, [0x38bdf8, 0xfde047, 0xffffff], 6.0);
            resolveShotOutcome();
            return;
          }
        }

        /* 2. 3D Cylinder Crossbar & Post Ricochets */
        var nearPost = Math.abs(absX - GOAL_HALF_W) <= (postR + BALL_R * 0.95) && by <= (GOAL_H + postR + BALL_R);
        var nearBar = Math.abs(by - GOAL_H) <= (postR + BALL_R * 0.95) && absX <= (GOAL_HALF_W + postR + BALL_R);

        if (nearPost || nearBar) {
          /* Inside edge glances IN OFF THE POST/BAR! Outer edge clangs out! */
          var insidePostGlance = nearPost && (absX < GOAL_HALF_W - 0.02) && (by < GOAL_H - 0.08);
          var undersideBarGlance = nearBar && (by < GOAL_H - 0.02) && (absX < GOAL_HALF_W - 0.08);
          spawn3DBurst(bx, by, 0, 24, [0xffffff, 0xfb923c, 0xfde047], 6.5);
          camShakeT = 0.26;
          camShakeMag = 0.16;
          if (A()) { A().play('hit_rim'); A().play('wood_knock'); }

          if (insidePostGlance || undersideBarGlance) {
            ballState.outcome = 'post_in';
            if (nearPost) ballState.vx = -ballState.vx * 0.45;
            if (undersideBarGlance) ballState.vy = -Math.abs(ballState.vy) * 0.45;
            triggerGoalEffects(bx, by);
            resolveShotOutcome();
            return;
          }

          ballState.outcome = nearBar ? 'crossbar' : 'post';
          ballState.hitBonus = false;
          ballState.z = 0.18;
          ballState.vz = Math.abs(ballState.vz) * 0.42;
          ballState.vy = nearBar ? 5.2 : ballState.vy * 0.6;
          ballState.vx = nearPost ? (bx > 0 ? 6.2 : -6.2) : ballState.vx * 0.7;
          ballState.ax = 0;
          resolveShotOutcome();
          return;
        }

        /* 3. Clean Goal vs Wide/Over */
        if (absX < GOAL_HALF_W && by < GOAL_H) {
          var isTopCorner = (absX > 2.25 && by > 1.48);
          ballState.outcome = ballState.hitBonus ? 'bullseye' : (isTopCorner ? 'topbins' : 'goal');
          triggerGoalEffects(bx, by);
        } else {
          ballState.outcome = 'wide';
          ballState.hitBonus = false;
        }
        resolveShotOutcome();
      }

      function triggerGoalEffects(bx, by) {
        crowdWaveT = 2.6;
        slowMoT = (ballState.outcome === 'bullseye' || ballState.outcome === 'topbins') ? 0.34 : 0.16;
        camShakeT = 0.24;
        camShakeMag = 0.14;
        /* Stadium Confetti Cannons behind both goalposts! */
        spawn3DBurst(-3.6, 0.4, -0.5, 24, [0xfde047, 0x38bdf8, 0x10b981, 0xf43f5e], 8.2);
        spawn3DBurst(3.6, 0.4, -0.5, 24, [0xa855f7, 0xf59e0b, 0x38bdf8, 0xffffff], 8.2);
        U().confetti(32);
      }

      function resolveShotOutcome() {
        var activeTurn = turn;
        var pts = 5;
        var sym = '·';
        var dotCls = 'miss';

        if (ballState.outcome === 'bullseye') {
          pts = superShot ? 40 : 35;
          sym = '🌟';
          dotCls = 'super';
          playSynthChord('super');
          if (A()) { A().play('crowd_roar_big'); A().play('cheer_kids'); }
          ledState.mode = 'goal';
          ledState.text = '🌟 TOP-BINS STAR SHATTERED!! +' + pts + ' FOR ' + T[activeTurn].name.toUpperCase() + '!! 🌟';
          showSplash('🎯 TOP-BINS BULLSEYE! +' + pts, superShot ? '🔥 Golden Super Shot Bonus!' : 'Shattered the 3D Corner Star!', '#fde047', 2100);
        } else if (ballState.outcome === 'topbins' || ballState.outcome === 'post_in') {
          pts = superShot ? 35 : 30;
          sym = '🔥';
          dotCls = 'super';
          playSynthChord('super');
          if (A()) { A().play('crowd_roar_big'); A().play('cheer_kids'); }
          ledState.mode = 'goal';
          ledState.text = '⚽ UNSTOPPABLE SCREAMER!! +' + pts + ' FOR ' + T[activeTurn].name.toUpperCase() + '!! ⚽';
          showSplash(ballState.outcome === 'post_in' ? ('💥 IN OFF THE POST! +' + pts) : ('🚀 TOP BINS! +' + pts), 'Absolute world-class finish!', '#4ade80', 2000);
        } else if (ballState.outcome === 'goal') {
          pts = superShot ? 25 : 20;
          sym = '⚽';
          dotCls = 'goal';
          playSynthChord('correct');
          if (A()) { A().play('crowd_roar_big'); A().play('goal_horn'); }
          ledState.mode = 'goal';
          ledState.text = '⚽ GOOOAAAL!! +' + pts + ' FOR ' + T[activeTurn].name.toUpperCase() + '!! ⚽';
          showSplash('⚽ GOOOAAAL! +' + pts, 'Beat the goalkeeper clean!', '#4ade80', 1950);
        } else if (ballState.outcome === 'save') {
          pts = 5;
          sym = '🧤';
          dotCls = 'miss';
          if (A()) { A().play('hit_rim'); A().play('crowd_ooh'); }
          ledState.mode = 'arena';
          ledState.text = '🧤 SUPERB 3D SAVE BY THE GOALKEEPER! 🧤';
          showSplash('🧤 WHAT A SAVE!', '+5 effort points — curve around the keeper next time!', '#38bdf8', 1900);
          /* In 2-Team Rival Keeper Duel Mode, reward the defending team +10 for guessing right! */
          if (duelMode && nt >= 2) {
            var defIdx = (activeTurn + 1) % nt;
            U().addScore(defIdx, 10);
            renderScorebug();
          }
        } else if (ballState.outcome === 'crossbar' || ballState.outcome === 'post') {
          pts = 5;
          sym = '💥';
          dotCls = 'miss';
          if (A()) A().play('crowd_ooh');
          showSplash(ballState.outcome === 'crossbar' ? '💥 OFF THE CROSSBAR!' : '💥 OFF THE POST!', 'Inches away! +5 effort points!', '#fb923c', 1850);
        } else {
          pts = 5;
          sym = '💨';
          dotCls = 'miss';
          if (A()) A().play('crowd_aww_soft');
          showSplash('😮 JUST WIDE!', 'Aim inside the white posts! (+5)', '#fb923c', 1800);
        }

        scorecard[activeTurn].push({ sym: sym, cls: dotCls });

        /* Project 3D ball onto screen for flying score orb */
        var proj = ballMesh.position.clone().project(camera);
        var rect = renderer.domElement.getBoundingClientRect();
        var sx = rect.left + (proj.x * 0.5 + 0.5) * rect.width;
        var sy = rect.top + (-proj.y * 0.5 + 0.5) * rect.height;
        if (A()) A().play('coin_collect');
        flyScoreToPod({ x: sx, y: sy }, activeTurn, pts, function () {
          if (!alive) return;
          U().addScore(activeTurn, pts);
          renderScorebug();
        });

        /* Transition to 3D Pixar Hero Celebration / Encouraging Reaction Camera */
        setTimeout(function () {
          if (!alive) return;
          phase = 'celebrate';
          phaseT = 0;
          var isGoal = (dotCls === 'goal' || dotCls === 'super');
          striker3D.setPose(isGoal ? 'cheer' : 'wave');
          striker3D.setExpression(isGoal ? 'laugh' : 'wink');
          if (keeperState.saved) {
            keeper3D.setPose('cheer');
            keeper3D.setExpression('laugh');
          }
          setBanner('', '');
          if (isGoal) {
            camTargetPos.set(0.84, 1.40, 13.65);
            camTargetLook.set(striker3D.root.position.x, 0.94, striker3D.root.position.z);
          } else {
            camTargetPos.set(0, 1.95, 12.6);
            camTargetLook.set(0, 1.05, 1.6);
          }
        }, 520);

        kickNo++;
        setTimeout(function () {
          if (!alive) return;
          U().advanceTeamPupil(T[activeTurn]);
          if (kickNo >= totalKicks) {
            startFinale();
            return;
          }
          turn = (turn + 1) % nt;
          startTurn();
        }, 2450);
      }

      function startFinale() {
        if (ended) return;
        phase = 'finale';
        phaseT = 0;
        striker3D.setPose('cheer');
        striker3D.setExpression('laugh');
        shootDockEl.classList.add('hidden');
        qDockEl.classList.add('hidden');
        duelDockEl.classList.add('hidden');
        crowdWaveT = 3.0;
        if (A()) { A().play('crowd_roar_big'); A().play('win_fanfare'); }
        U().confetti(50);
        showSplash('🏆 FULL TIME!', 'Checking the Podium...', '#fde047', 1900);
        setTimeout(function () {
          if (!alive || ended) return;
          ended = true;
          ctx.end();
        }, 1900);
      }

      /* ---------- 60fps Extruded 3D Pixar Athlete & Stadium Update Routines ---------- */
      function updateContactShadow(ath) {
        if (!ath || !ath.contactShadow) return;
        var air = Math.max(0, ath.root.position.y);
        var sc = clamp(1 - air * 0.65, 0.45, 1.0);
        ath.contactShadow.position.y = 0.008 - ath.root.position.y;
        ath.contactShadow.scale.set(sc, sc, sc);
        ath.contactShadow.material.opacity = 0.84 * sc;
      }

      function animateStriker3D(dt, nowSec) {
        var s = striker3D;
        var baseY = s.basePelvisY || 0.604;
        if (phase === 'quiz' || phase === 'duel_pick' || phase === 'aim') {
          /* Athletic breathing & weight shift at a sporty 3/4 rear-side angle showing "ACADEMY 10" + 3D bevels! */
          s.setPose('stand');
          var bob = Math.sin(nowSec * 3.4);
          s.root.position.y = 0;
          s.pelvis.position.y = baseY + Math.abs(bob) * 0.018;
          s.pelvis.rotation.z = bob * 0.025;
          s.spine.rotation.x = 0.05;
          s.neck.rotation.y = Math.sin(nowSec * 1.5) * 0.12;
          s.legL.hip.rotation.x = -0.06 + bob * 0.04;
          s.legR.hip.rotation.x = 0.06 - bob * 0.04;
          s.legL.hip.rotation.z = 0;
          s.legR.hip.rotation.z = 0;
        } else if (phase === 'runup') {
          /* 0.00 -> 0.44s: 4-stride 3D diagonal sprint + full right-leg backswing & whip-kick through the 3D ball! */
          var dur = 0.44;
          var u = clamp(phaseT / dur, 0, 1);
          s.root.position.x = lerp(-0.86, -0.28, u);
          s.root.position.z = lerp(SPOT_Z + 1.58, SPOT_Z + 0.08, u);
          s.root.rotation.y = lerp(Math.PI - 0.38, Math.PI - 0.14, u);

          if (u < 0.70) {
            var cyc = u * Math.PI * 5.5;
            s.root.position.y = Math.abs(Math.sin(cyc)) * 0.05;
            s.pelvis.position.y = baseY;
            s.pelvis.rotation.z = Math.sin(cyc) * 0.05;
            s.spine.rotation.x = 0.14;
            s.legL.hip.rotation.x = Math.sin(cyc) * 0.64;
            s.legR.hip.rotation.x = -Math.sin(cyc) * 0.64;
          } else {
            /* Plant left boot firmly & wind entire right Pixar leg back (+0.82) -> whip forward (-0.86)! */
            var w = (u - 0.70) / 0.30;
            s.root.position.y = 0;
            s.pelvis.position.y = baseY - 0.015;
            s.pelvis.rotation.z = -0.15;
            s.spine.rotation.x = lerp(0.14, -0.08, w);
            s.legL.hip.rotation.x = -0.28;
            s.legR.hip.rotation.x = lerp(0.82, -0.86, w);
          }

          if (phaseT >= dur) {
            strike3DBall();
          }
        } else if (phase === 'flight') {
          /* Athletic follow-through hop after striking the 3D ball */
          var f = clamp(phaseT / 0.35, 0, 1);
          s.root.position.y = Math.sin(f * Math.PI) * 0.12;
          s.pelvis.position.y = baseY;
          s.pelvis.rotation.z = lerp(-0.15, 0, f);
          s.spine.rotation.x = lerp(-0.08, 0.02, f);
          s.legR.hip.rotation.x = lerp(-0.86, -0.10, f);
          s.legL.hip.rotation.x = lerp(-0.28, 0.05, f);
        } else if (phase === 'celebrate' || phase === 'finale') {
          var lastEntry = scorecard[turn][scorecard[turn].length - 1];
          var scored = (phase === 'finale') || (lastEntry && (lastEntry.cls === 'goal' || lastEntry.cls === 'super'));
          if (scored) {
            /* 3D Pixar Hero Celebration: spins smoothly toward camera at a crisp 3/4 angle with raised 5-finger Cheer Arms + Laugh Face! */
            s.setPose('cheer');
            s.setExpression('laugh');
            var ct = clamp(phaseT / 0.52, 0, 1);
            var ctSmooth = 1 - Math.pow(1 - ct, 3);
            var faceCamYaw = Math.atan2(camPos.x - s.root.position.x, camPos.z - s.root.position.z) - 0.20;
            var hopWave = Math.abs(Math.sin(phaseT * 7.2));
            s.root.position.y = hopWave * 0.24;
            s.root.rotation.y = lerp(Math.PI - 0.14, faceCamYaw, ctSmooth);
            s.pelvis.position.y = baseY;
            s.pelvis.rotation.z = Math.sin(phaseT * 7.2) * 0.04;
            s.spine.rotation.x = -0.04;
            s.neck.rotation.y = 0.08 + Math.sin(nowSec * 5.0) * 0.06;
            s.legL.hip.rotation.x = -0.12 * hopWave;
            s.legR.hip.rotation.x = -0.12 * hopWave;
            s.legL.hip.rotation.z = -0.13 * hopWave;
            s.legR.hip.rotation.z = 0.13 * hopWave;
          } else {
            /* Warm encouraging wave + wink toward camera (zero-shame soft-fail!) */
            s.setPose('wave');
            s.setExpression('wink');
            var camYaw2 = Math.atan2(camPos.x - s.root.position.x, camPos.z - s.root.position.z) + 0.18;
            s.root.rotation.y = lerp(s.root.rotation.y, camYaw2, clamp(dt * 5.5, 0, 1));
            s.root.position.y = Math.abs(Math.sin(nowSec * 4.2)) * 0.04;
            s.pelvis.position.y = baseY;
            s.pelvis.rotation.z = 0;
            s.spine.rotation.x = 0;
            s.legL.hip.rotation.set(0, 0, 0);
            s.legR.hip.rotation.set(0, 0, 0);
          }
        }
        updateContactShadow(s);
      }

      function animateKeeper3D(dt, nowSec) {
        var k = keeper3D;
        var baseY = k.basePelvisY || 0.604;
        if (phase === 'quiz' || phase === 'duel_pick' || phase === 'aim' || phase === 'runup') {
          k.setPose('stand');
          k.setExpression('smile');
          if (phase !== 'runup' && !(duelMode && duelKeeperChoice !== null)) {
            keeperState.x += keeperState.patrolDir * LV.patrolSpd * dt;
            if (keeperState.x > LV.patrolRange) { keeperState.x = LV.patrolRange; keeperState.patrolDir = -1; }
            if (keeperState.x < -LV.patrolRange) { keeperState.x = -LV.patrolRange; keeperState.patrolDir = 1; }
          }
          keeperState.stepPhase += dt * 8.5;
          var hop = Math.abs(Math.sin(keeperState.stepPhase));
          k.root.position.set(keeperState.x, hop * 0.055, keeperState.z);
          /* Subtle 3D yaw sway so keeper's sculpted 3D side bevels shimmer as they patrol! */
          k.root.rotation.set(0, Math.sin(keeperState.stepPhase * 0.5) * 0.16, Math.sin(keeperState.stepPhase) * 0.035);
          k.pelvis.position.y = baseY - 0.015;
          k.spine.rotation.x = 0.06;
          k.legL.hip.rotation.z = -0.09;
          k.legR.hip.rotation.z = 0.09;
          k.legL.hip.rotation.x = Math.sin(keeperState.stepPhase) * 0.18;
          k.legR.hip.rotation.x = -Math.sin(keeperState.stepPhase) * 0.18;
        } else if (phase === 'flight' || phase === 'celebrate') {
          if (!keeperState.diving) {
            keeperState.reactTimer -= dt;
            if (keeperState.reactTimer <= 0) {
              keeperState.diving = true;
              keeperState.diveT = 0;
              k.setPose('cheer'); /* Stretch BOTH neon-gloved 5-finger Pixar hands high toward the ball! */
            }
          }
          if (keeperState.diving) {
            keeperState.diveT += dt;
            var u = clamp(keeperState.diveT / 0.46, 0, 1);
            var easeOut = 1 - Math.pow(1 - u, 2.2);
            keeperState.x = lerp(keeperState.startX, keeperState.targetX, easeOut);
            var airArc = u < 0.72 ? Math.sin((u / 0.72) * Math.PI * 0.78) : Math.max(0, (1 - u) / 0.28 * 0.32);
            var maxLift = clamp(keeperState.targetY - 0.55, 0.24, LV.diveLift);
            keeperState.y = airArc * maxLift;

            var dx = keeperState.targetX - keeperState.startX;
            var dir = Math.abs(dx) < 0.28 ? 0 : (dx > 0 ? 1 : -1);
            var tiltZ = -dir * lerp(0, 1.18, Math.min(1, u * 1.4));

            k.root.position.set(keeperState.x, keeperState.y, keeperState.z);
            k.root.rotation.set(0, dir * 0.20, tiltZ);
            k.pelvis.position.y = baseY;
            k.spine.rotation.x = 0.04;
            k.legL.hip.rotation.x = 0.14;
            k.legR.hip.rotation.x = -0.12;
          }
        }
        updateContactShadow(k);
      }

      function animateTeammatesAndStadium(dt, nowSec) {
        [buddyL, buddyR].forEach(function (b, idx) {
          var cheer = crowdWaveT > 0;
          b.setPose(cheer ? 'cheer' : (idx === 0 ? 'wave' : 'stand'));
          b.setExpression(cheer ? 'laugh' : 'smile');
          var ph = nowSec * (cheer ? 8.0 : 2.5) + idx * 1.7;
          b.root.position.y = cheer ? Math.abs(Math.sin(ph)) * 0.26 : Math.abs(Math.sin(ph)) * 0.025;
          b.pelvis.position.y = b.basePelvisY || 0.604;
          b.neck.rotation.y = Math.sin(ph * 0.7) * 0.12;
          b.legL.hip.rotation.z = cheer ? -0.10 * Math.abs(Math.sin(ph)) : 0;
          b.legR.hip.rotation.z = cheer ? 0.10 * Math.abs(Math.sin(ph)) : 0;
          updateContactShadow(b);
        });

        /* Subtle Stadium Crowd Terrace Cheer Bounce on Goals */
        crowdPanels.forEach(function (cp) {
          var jump = crowdWaveT > 0 ? Math.abs(Math.sin(nowSec * 9.5 + cp.phase)) * 0.14 : 0;
          cp.mesh.position.y = cp.baseY + jump;
        });

        /* Waving 3D Corner Flags */
        cornerFlags.forEach(function (fl, idx) {
          fl.rotation.y = Math.sin(nowSec * 5.0 + idx) * (0.18 + Math.abs(stadiumWind) * 0.12);
        });

        /* Spinning 3D Bonus Star Targets */
        bonusTargets.forEach(function (bt, idx) {
          if (!bt.group.visible) return;
          bt.gem.rotation.y = nowSec * 2.8;
          bt.group.position.y = bt.baseY + Math.sin(nowSec * 2.4 + idx * 2.1) * 0.12;
          bt.group.position.x = bt.baseX + Math.cos(nowSec * 1.7 + idx) * 0.14;
        });

        /* Deformable 3D Back Net Vertex-Spring Ripple! */
        if (netWave.active) {
          netWave.t += dt;
          if (netWave.t > 1.35) {
            netWave.active = false;
            bnPos.array.set(bnBase);
            bnPos.needsUpdate = true;
          } else {
            var decay = Math.exp(-netWave.t * 3.4);
            var osc = Math.sin(netWave.t * 17.0);
            for (var vi = 0; vi < bnPos.count; vi++) {
              var bx0 = bnBase[vi * 3];
              var by0 = bnBase[vi * 3 + 1];
              var bz0 = bnBase[vi * 3 + 2];
              var dist = Math.hypot(bx0 - netWave.hx, by0 - netWave.hy);
              var push = dist < 2.6 ? Math.cos((dist / 2.6) * Math.PI * 0.5) * 0.68 * decay * Math.max(-0.25, osc) : 0;
              /* Keep top crossbar edge (by0 >= GOAL_H - 0.05) and bottom bar (by0 <= 0.05) pinned! */
              if (by0 > 0.08 && by0 < GOAL_H - 0.08 && Math.abs(bx0) < GOAL_HALF_W - 0.08) {
                bnPos.setZ(vi, bz0 - push);
              }
            }
            bnPos.needsUpdate = true;
          }
        }
      }

      function stepBall3DPhysics(dt) {
        if (phase !== 'flight' && phase !== 'celebrate') {
          /* Idle spin/aura on the penalty spot */
          superAuraMesh.material.opacity = superShot ? (0.38 + Math.sin(performance.now() / 110) * 0.14) : 0;
          return;
        }

        if (!ballState.crossed) {
          ballState.vx += ballState.ax * dt;
          ballState.vy -= GRAVITY * dt;
          ballState.x += ballState.vx * dt;
          ballState.y += ballState.vy * dt;
          ballState.z += ballState.vz * dt;

          if (ballState.y < BALL_R) {
            ballState.y = BALL_R;
            ballState.vy = Math.abs(ballState.vy) * 0.55;
          }

          /* Continuous 3D fire/curve trail particles in flight */
          if (superShot || Math.abs(shotSpin) > 0.3) {
            spawn3DBurst(ballState.x, ballState.y, ballState.z, 1, superShot ? [0xfde047, 0xf97316] : [0x38bdf8, 0xa855f7], 1.1);
          }

          if (ballState.z <= 0) {
            evaluateGoalLine();
          }
        } else {
          var isGoal = (ballState.outcome === 'goal' || ballState.outcome === 'topbins' || ballState.outcome === 'bullseye' || ballState.outcome === 'post_in');
          if (isGoal) {
            /* Ball flies into the 3D back net, triggers net pocket ripple, and drops onto the grass inside the goal! */
            ballState.x += ballState.vx * dt * 0.55;
            ballState.z += ballState.vz * dt * 0.55;
            ballState.vy -= GRAVITY * 1.15 * dt;
            ballState.y += ballState.vy * dt;

            var backLim = lerp(-GOAL_DEPTH + BALL_R, -GOAL_DEPTH * 0.72 + BALL_R, clamp(ballState.y / GOAL_H, 0, 1));
            if (ballState.z <= backLim) {
              if (!netWave.active) {
                netWave.active = true;
                netWave.t = 0;
                netWave.hx = clamp(ballState.x, -GOAL_HALF_W + 0.3, GOAL_HALF_W - 0.3);
                netWave.hy = clamp(ballState.y, 0.3, GOAL_H - 0.2);
              }
              ballState.z = backLim;
              ballState.vz = Math.abs(ballState.vz) * 0.18;
              ballState.vx *= 0.35;
              ballState.spinY *= 0.4;
            }
            if (ballState.x < -GOAL_HALF_W + BALL_R) { ballState.x = -GOAL_HALF_W + BALL_R; ballState.vx = Math.abs(ballState.vx) * 0.35; }
            if (ballState.x > GOAL_HALF_W - BALL_R) { ballState.x = GOAL_HALF_W - BALL_R; ballState.vx = -Math.abs(ballState.vx) * 0.35; }
            if (ballState.y > GOAL_H - BALL_R) { ballState.y = GOAL_H - BALL_R; ballState.vy = -Math.abs(ballState.vy) * 0.4; }
            if (ballState.y <= BALL_R) {
              ballState.y = BALL_R;
              ballState.vy = Math.abs(ballState.vy) > 0.8 ? Math.abs(ballState.vy) * 0.42 : 0;
              ballState.vx *= 0.86;
              ballState.vz *= 0.86;
            }
          } else {
            /* Saved / Woodwork / Wide ball bounces naturally in 3D */
            ballState.vy -= GRAVITY * dt;
            ballState.x += ballState.vx * dt;
            ballState.y += ballState.vy * dt;
            ballState.z += ballState.vz * dt;
            if (ballState.y <= BALL_R) {
              ballState.y = BALL_R;
              ballState.vy = Math.abs(ballState.vy) > 0.9 ? Math.abs(ballState.vy) * 0.52 : 0;
              ballState.vx *= 0.88;
              ballState.vz *= 0.88;
            }
          }
        }

        ballMesh.position.set(ballState.x, ballState.y, ballState.z);
        ballMesh.rotation.x += ballState.vz * dt * 1.4;
        ballMesh.rotation.y += ballState.spinY * dt;
        superAuraMesh.material.opacity = superShot && !ballState.crossed ? 0.46 : 0;
      }

      /* ---------- Resize Handling ---------- */
      function handleResize() {
        if (!alive) return;
        var w = Math.max(320, canvasWrap.clientWidth || 960);
        var h = Math.max(260, canvasWrap.clientHeight || 540);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
      var ro = root.ResizeObserver ? new ResizeObserver(handleResize) : null;
      if (ro) ro.observe(canvasWrap);
      root.addEventListener('resize', handleResize);
      setTimeout(handleResize, 20);

      /* ---------- Main 60fps WebGL Render Loop ---------- */
      var lastNow = performance.now();
      var rafId = 0;

      function animate(nowMs) {
        if (!alive) return;
        var rawDt = Math.min(0.05, Math.max(0.001, (nowMs - lastNow) / 1000));
        lastNow = nowMs;

        if (hitStopT > 0) {
          hitStopT = Math.max(0, hitStopT - rawDt);
          renderer.render(scene, camera);
          rafId = requestAnimationFrame(animate);
          return;
        }

        var dt = rawDt;
        if (slowMoT > 0) {
          slowMoT = Math.max(0, slowMoT - rawDt);
          dt = rawDt * 0.30; /* Dramatic 0.30x Bullet-Time on Top-Bins & Big Saves! */
        }

        phaseT += dt;
        if (crowdWaveT > 0) crowdWaveT = Math.max(0, crowdWaveT - rawDt);

        /* Oscillating Sweet-Spot Power Meter during Aim Phase */
        if (phase === 'aim') {
          meterPhase += rawDt * (superShot ? 2.3 : 2.7);
          var norm01 = 0.5 + 0.5 * Math.sin(meterPhase); /* 0..1 */
          meterVal = 0.30 + norm01 * 0.78;               /* 0.30 .. 1.08 */
          meterNeedleEl.style.left = Math.round(norm01 * 100) + '%';
          if (norm01 >= 0.52 && norm01 <= 0.80) {
            meterValLbl.textContent = '🌟 SWEET SPOT!';
            meterValLbl.style.color = '#4ade80';
          } else if (norm01 > 0.85) {
            meterValLbl.textContent = '⚠️ OVERPOWER!';
            meterValLbl.style.color = '#fb7185';
          } else {
            meterValLbl.textContent = 'Low Power';
            meterValLbl.style.color = '#bae6fd';
          }
        }

        animateStriker3D(dt, nowMs * 0.001);
        animateKeeper3D(dt, nowMs * 0.001);
        animateTeammatesAndStadium(dt, nowMs * 0.001);
        stepBall3DPhysics(dt);
        update3DTrajectoryPreview(nowMs);

        /* Update 3D Particle Pool */
        for (var pi = 0; pi < partPool.length; pi++) {
          var p = partPool[pi];
          if (p.life <= 0) continue;
          p.life -= dt;
          if (p.life <= 0) {
            p.mesh.visible = false;
            continue;
          }
          p.vy -= 12.0 * dt;
          p.mesh.position.x += p.vx * dt;
          p.mesh.position.y = Math.max(0.03, p.mesh.position.y + p.vy * dt);
          p.mesh.position.z += p.vz * dt;
          p.mesh.rotation.x += 8 * dt;
          p.mesh.rotation.y += 6 * dt;
          var sc = Math.max(0.1, p.life / p.maxLife);
          p.mesh.scale.set(sc, sc, sc);
        }

        /* Update LED Ribbon Board every ~3 frames */
        if (((nowMs / 45) | 0) !== (((nowMs - rawDt * 1000) / 45) | 0)) {
          drawLedBoard(nowMs);
        }

        /* Smooth Broadcast Camera Follow + Shake */
        var camLerp = clamp(rawDt * 4.8, 0, 1);
        camPos.lerp(camTargetPos, camLerp);
        camLook.lerp(camTargetLook, camLerp);

        var sx = 0, sy = 0;
        if (camShakeT > 0) {
          camShakeT = Math.max(0, camShakeT - rawDt);
          sx = (Math.random() * 2 - 1) * camShakeMag;
          sy = (Math.random() * 2 - 1) * camShakeMag;
        }
        camera.position.set(camPos.x + sx, camPos.y + sy, camPos.z);
        camera.lookAt(camLook.x, camLook.y, camLook.z);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      }

      /* ---------- Clean Disposal on Mode Exit ---------- */
      ctx.onEnd(function () {
        alive = false;
        clearTimeout(splashTm);
        cancelAnimationFrame(rafId);
        if (ro) ro.disconnect();
        root.removeEventListener('resize', handleResize);
        root.removeEventListener('keydown', onKeyDown);
        root.removeEventListener('eaa:avatars-ready', onAvatarsReady);
        if (document.body) document.body.classList.remove('gm-hide-pods', 'gm-small-pods', 'gm-real3-active');
        try { if (A() && A().musicStop) A().musicStop(); } catch (e) { /* ignore */ }
        disposables.forEach(function (d) {
          try { if (d && typeof d.dispose === 'function') d.dispose(); } catch (e) { /* ignore */ }
        });
        try { renderer.dispose(); } catch (e) { /* ignore */ }
      });

      startTurn();
      rafId = requestAnimationFrame(animate);
    }
  };
})(window);
