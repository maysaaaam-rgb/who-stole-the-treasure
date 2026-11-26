/* Courtside to Curtain Call 3D — Full 3-Zone Adventure (Court -> Festival Park -> Grand Theatre)
 * Full Three.js 0.169 + GameQualityCore + Real .glb Monsters, Stadium, Park & Theatre Props
 * 9 Physical 3D Stages · 32 Brand-New Custom Pixar Illustrations · 65 Studio Neural MP3 Voiceovers
 */
(function () {
  'use strict';

  var T3 = window.THREE;
  var GQC = window.GameQualityCore || {};
  var DATA = window.CTC3D_DATA;
  var AUDIO = window.CTC3D_AUDIO;

  // =========================================================================
  // 1. DOM REFERENCES
  // =========================================================================
  var canvas = document.getElementById('scene');
  var worldPinsEl = document.getElementById('world-pins');
  var btnMap = document.getElementById('btn-map');
  var stagePillsWrap = document.getElementById('stage-pills');
  var roundChip = document.getElementById('round-chip');
  var btnSlow = document.getElementById('btn-slow');
  var btnBgm = document.getElementById('btn-bgm');
  var btnSfx = document.getElementById('btn-sfx');
  var btnFs = document.getElementById('btn-fs');
  var mapHero = document.getElementById('map-hero');
  var btnEnterZ1 = document.getElementById('btn-enter-z1');
  var btnEnterZ2 = document.getElementById('btn-enter-z2');
  var btnEnterZ3 = document.getElementById('btn-enter-z3');
  var cueCard = document.getElementById('cue-card');
  var cueImg = document.getElementById('cue-img');
  var cueWord = document.getElementById('cue-word');
  var cueHint = document.getElementById('cue-hint');
  var btnCueVoice = document.getElementById('btn-cue-voice');
  var trackStrip = document.getElementById('track-strip');
  var cinemaToast = document.getElementById('cinema-toast');
  var victoryBanner = document.getElementById('victory-banner');
  var victoryCrown = document.getElementById('victory-crown');
  var victoryTitle = document.getElementById('victory-title');
  var victorySub = document.getElementById('victory-sub');
  var victoryScores = document.getElementById('victory-scores');
  var victoryActions = document.getElementById('victory-actions');
  var bottomDock = document.getElementById('bottom-dock');
  var teamStrip = document.getElementById('team-strip');
  var choiceTray = document.getElementById('choice-tray');
  var btnLaunch = document.getElementById('btn-launch');
  var launchIcon = document.getElementById('launch-icon');
  var launchTxt = document.getElementById('launch-txt');

  // =========================================================================
  // 2. GAME STATE
  // =========================================================================
  var state = {
    mode: 'map',       // 'map' | 's1'..'s9'
    activeZone: 1,
    activeTeam: 0,
    scores: [0, 0, 0, 0],
    stageDone: {},
    s1Idx: 0, s1Found: {},
    s2Idx: 0,
    s3Idx: 0,
    s4Idx: 0,
    s5Idx: 0, s5Placed: [],
    s6Idx: 0,
    s7Idx: 0,
    s8Step: 0, s8Done: {},
    selectedChoice: null,
    busy: false,
    toastTimer: null,
    currentVoiceId: 'intro_world',
    stageToken: 0,
    curtainOpen: 0.0,
    curtainTarget: 0.0,
    spotlightBoost: 0.0
  };

  // =========================================================================
  // 3. THREE.JS RENDERER, SCENE, CAMERA & GAMEQUALITYCORE ATMOSPHERE
  // =========================================================================
  var renderer = new T3.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T3.PCFSoftShadowMap;
  if (T3.SRGBColorSpace) renderer.outputColorSpace = T3.SRGBColorSpace;
  renderer.toneMapping = T3.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new T3.Scene();
  scene.background = new T3.Color(0x7bd3ff);
  renderer.setClearColor(0x7bd3ff, 1);

  var camera = new T3.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.25, 950);
  camera.position.set(-18, 25, 32);
  camera.lookAt(13, 1.0, -13);

  var camGoalPos = new T3.Vector3(-18, 25, 32);
  var camGoalLook = new T3.Vector3(13, 1.0, -13);
  var camCurLook = new T3.Vector3(13, 1.0, -13);

  var atmosphere = (GQC.Atmosphere && GQC.Atmosphere.applyCommercialAtmosphere)
    ? GQC.Atmosphere.applyCommercialAtmosphere(renderer, scene, 'stadium')
    : null;

  var juice = GQC.Juice || null;

  function addBlobShadow(parent, radius, yOffset) {
    if (GQC.Atmosphere && GQC.Atmosphere.addBlobShadow) {
      return GQC.Atmosphere.addBlobShadow(parent, radius, yOffset || 0.03);
    }
    var m = new T3.Mesh(
      new T3.CircleGeometry(radius, 20),
      new T3.MeshBasicMaterial({ color: 0x2b1d40, transparent: true, opacity: 0.26, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = yOffset || 0.03;
    parent.add(m);
    return m;
  }

  // =========================================================================
  // 4. PROCEDURAL HIGH-RES TEXTURES
  // =========================================================================
  function createCourtTexture() {
    var cv = document.createElement('canvas');
    cv.width = 2048; cv.height = 1152;
    var g = cv.getContext('2d');
    g.fillStyle = '#3c8be8';
    g.fillRect(0, 0, cv.width, cv.height);

    var padX = 96, padY = 82, cw = cv.width - padX * 2, ch = cv.height - padY * 2, plankH = 26;
    for (var y = padY; y < padY + ch; y += plankH) {
      var rowIdx = Math.floor((y - padY) / plankH);
      var xOff = (rowIdx % 3) * 95;
      for (var x = padX - xOff; x < padX + cw; x += 260) {
        var shade = ((rowIdx * 17 + Math.floor(x / 260) * 31) % 7) - 3;
        g.fillStyle = 'rgb(' + (226 + shade * 4) + ',' + (171 + shade * 4) + ',' + (104 + shade * 3) + ')';
        var rx = Math.max(padX, x);
        var rw = Math.min(padX + cw, x + 260) - rx;
        if (rw > 0) {
          g.fillRect(rx, y, rw, Math.min(plankH, padY + ch - y));
          g.strokeStyle = 'rgba(138, 86, 36, 0.16)';
          g.lineWidth = 2;
          g.strokeRect(rx, y, rw, Math.min(plankH, padY + ch - y));
        }
      }
    }

    var keyW = 350, keyH = 340, cy = cv.height / 2;
    g.fillStyle = '#4f9dff';
    g.fillRect(padX, cy - keyH / 2, keyW, keyH);
    g.fillRect(padX + cw - keyW, cy - keyH / 2, keyW, keyH);

    g.beginPath(); g.arc(cv.width / 2, cy, 148, 0, Math.PI * 2); g.fillStyle = '#ffb320'; g.fill();
    g.beginPath(); g.arc(cv.width / 2, cy, 114, 0, Math.PI * 2); g.fillStyle = '#ff6b4a'; g.fill();
    g.fillStyle = '#fff8ec';
    g.beginPath();
    for (var s = 0; s < 10; s++) {
      var ang = (s * Math.PI) / 5 - Math.PI / 2;
      var rad = (s % 2 === 0) ? 58 : 26;
      var sx = cv.width / 2 + Math.cos(ang) * rad;
      var sy = cy + Math.sin(ang) * rad;
      if (s === 0) g.moveTo(sx, sy); else g.lineTo(sx, sy);
    }
    g.closePath(); g.fill();

    g.strokeStyle = '#ffffff'; g.lineWidth = 14;
    g.strokeRect(padX, padY, cw, ch);
    g.beginPath(); g.moveTo(cv.width / 2, padY); g.lineTo(cv.width / 2, padY + ch); g.stroke();
    g.beginPath(); g.arc(cv.width / 2, cy, 148, 0, Math.PI * 2); g.stroke();
    g.strokeRect(padX, cy - keyH / 2, keyW, keyH);
    g.strokeRect(padX + cw - keyW, cy - keyH / 2, keyW, keyH);
    g.beginPath(); g.arc(padX + keyW, cy, keyH / 2, -Math.PI / 2, Math.PI / 2); g.stroke();
    g.beginPath(); g.arc(padX + cw - keyW, cy, keyH / 2, Math.PI / 2, Math.PI * 1.5); g.stroke();
    g.beginPath(); g.arc(padX + 110, cy, 425, -Math.PI * 0.41, Math.PI * 0.41); g.stroke();
    g.beginPath(); g.arc(padX + cw - 110, cy, 425, Math.PI * 0.59, Math.PI * 1.41); g.stroke();

    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return tex;
  }

  function createBasketballTexture() {
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 256;
    var g = cv.getContext('2d');
    var grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#ff8e36'); grd.addColorStop(0.5, '#f26a1b'); grd.addColorStop(1, '#d94e0c');
    g.fillStyle = grd; g.fillRect(0, 0, 512, 256);
    g.fillStyle = 'rgba(120, 38, 0, 0.14)';
    for (var i = 0; i < 600; i++) g.fillRect(Math.random() * 512, Math.random() * 256, 2, 2);
    g.strokeStyle = '#2b1810'; g.lineWidth = 8;
    g.beginPath();
    g.moveTo(0, 128); g.lineTo(512, 128);
    g.moveTo(128, 0); g.lineTo(128, 256);
    g.moveTo(384, 0); g.lineTo(384, 256);
    g.stroke();
    g.beginPath(); g.arc(128, 128, 86, -Math.PI * 0.36, Math.PI * 0.36); g.stroke();
    g.beginPath(); g.arc(384, 128, 86, Math.PI * 0.64, Math.PI * 1.36); g.stroke();
    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    return tex;
  }

  function createSignTexture(title, subtitle, bgHex, borderHex, textHex) {
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 192;
    var g = cv.getContext('2d');
    g.fillStyle = bgHex; g.fillRect(0, 0, 512, 192);
    g.strokeStyle = borderHex; g.lineWidth = 18; g.strokeRect(9, 9, 494, 174);
    g.fillStyle = textHex;
    var fSize = (title && title.length > 9) ? 50 : 72;
    g.font = '900 ' + fSize + 'px Nunito, Segoe UI, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(title, 256, subtitle ? 76 : 98);
    if (subtitle) {
      g.font = '800 34px Nunito, Segoe UI, sans-serif';
      g.fillStyle = borderHex;
      g.fillText(subtitle, 256, 142);
    }
    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    return tex;
  }

  function createLetterBallTexture(letter) {
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 256;
    var g = cv.getContext('2d');
    var grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#ffa13b'); grd.addColorStop(0.5, '#f06818'); grd.addColorStop(1, '#c94507');
    g.fillStyle = grd; g.fillRect(0, 0, 512, 256);
    g.strokeStyle = '#33190d'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(0, 128); g.lineTo(512, 128); g.stroke();
    [128, 384].forEach(function (cx) {
      g.beginPath(); g.arc(cx, 128, 66, 0, Math.PI * 2);
      g.fillStyle = '#fff8ec'; g.fill();
      g.lineWidth = 8; g.strokeStyle = '#2b1d40'; g.stroke();
      g.fillStyle = '#2b1d40';
      g.font = '900 92px Nunito, Segoe UI, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(letter, cx, 134);
    });
    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    return tex;
  }

  // =========================================================================
  // 5. SHARED SUNLIT PARK TERRAIN & GOLDEN FESTIVAL TRAIL
  // =========================================================================
  var ground = new T3.Mesh(
    new T3.CircleGeometry(190, 64),
    new T3.MeshStandardMaterial({ color: 0x6eb84c, roughness: 0.92 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.14;
  ground.receiveShadow = true;
  scene.add(ground);

  var hillColors = [0x5da942, 0x68b349, 0x529a3b];
  for (var h = 0; h < 18; h++) {
    var ang = (h / 18) * Math.PI * 2;
    var dist = 94 + (h % 3) * 16;
    var hill = new T3.Mesh(
      new T3.SphereGeometry(22 + (h % 4) * 5, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
      new T3.MeshStandardMaterial({ color: hillColors[h % hillColors.length], roughness: 0.94 })
    );
    hill.scale.set(1.4, 0.44 + (h % 3) * 0.14, 1.2);
    hill.position.set(15 + Math.cos(ang) * dist, -1.4, -18 + Math.sin(ang) * dist);
    scene.add(hill);
  }

  // Sunlit golden park road connecting Zone 1 -> Zone 2 -> Zone 3
  var pathCurve = new T3.CatmullRomCurve3([
    new T3.Vector3(14, 0.02, 0),
    new T3.Vector3(21, 0.02, -9),
    new T3.Vector3(24, 0.02, -25),
    new T3.Vector3(34, 0.02, -34),
    new T3.Vector3(45, 0.02, -45)
  ]);
  var pathPts = pathCurve.getPoints(56);
  for (var pi = 0; pi < pathPts.length - 1; pi++) {
    var pA = pathPts[pi], pB = pathPts[pi + 1];
    var tile = new T3.Mesh(
      new T3.BoxGeometry(3.6, 0.12, pA.distanceTo(pB) + 0.35),
      new T3.MeshStandardMaterial({ color: 0xf3cf8a, roughness: 0.85 })
    );
    tile.position.copy(pA).lerp(pB, 0.5);
    tile.position.y = -0.08;
    tile.lookAt(pB.x, -0.08, pB.z);
    tile.receiveShadow = true;
    scene.add(tile);
  }

  // =========================================================================
  // 6. ZONE 1: SUNNY BASKETBALL COURT & HOOPS
  // =========================================================================
  var courtGroup = new T3.Group();
  scene.add(courtGroup);

  var courtBase = new T3.Mesh(
    new T3.BoxGeometry(27.6, 0.36, 16.4),
    new T3.MeshStandardMaterial({ color: 0x2c6cc2, roughness: 0.55 })
  );
  courtBase.position.y = -0.18; courtBase.receiveShadow = true;
  courtGroup.add(courtBase);

  var courtTop = new T3.Mesh(
    new T3.PlaneGeometry(26.4, 15.2),
    new T3.MeshStandardMaterial({ map: createCourtTexture(), roughness: 0.32, metalness: 0.05 })
  );
  courtTop.rotation.x = -Math.PI / 2; courtTop.position.y = 0.01;
  courtTop.receiveShadow = true; courtTop.userData.pickRole = 'zone1-court';
  courtGroup.add(courtTop);

  function createBasketballHoop(opts) {
    opts = opts || {};
    var g = new T3.Group();
    var accentHex = opts.accentHex || 0x2d74d6;
    var rimHex = opts.rimHex || 0xff5a1f;

    var basePad = new T3.Mesh(new T3.BoxGeometry(1.4, 1.35, 1.4), new T3.MeshStandardMaterial({ color: accentHex, roughness: 0.45 }));
    basePad.position.set(1.5, 0.68, 0); basePad.castShadow = true; basePad.receiveShadow = true;
    g.add(basePad);

    var post = new T3.Mesh(new T3.CylinderGeometry(0.18, 0.24, 4.7, 14), new T3.MeshStandardMaterial({ color: 0x2c364c, roughness: 0.35, metalness: 0.55 }));
    post.position.set(1.5, 2.35, 0); post.castShadow = true;
    g.add(post);

    var arm = new T3.Mesh(new T3.BoxGeometry(1.55, 0.24, 0.24), new T3.MeshStandardMaterial({ color: 0x2c364c, roughness: 0.35, metalness: 0.55 }));
    arm.position.set(0.85, 4.45, 0); arm.castShadow = true;
    g.add(arm);

    var boardGroup = new T3.Group();
    boardGroup.position.set(0.1, 4.35, 0);
    g.add(boardGroup);

    var boardGlass = new T3.Mesh(
      new T3.BoxGeometry(0.1, 1.85, 2.75),
      new T3.MeshStandardMaterial({ color: 0xdcf4ff, roughness: 0.14, metalness: 0.15, transparent: true, opacity: 0.78 })
    );
    boardGlass.castShadow = true;
    boardGlass.userData.pickRole = opts.pickRole || '';
    boardGlass.userData.pickValue = opts.pickValue || '';
    boardGroup.add(boardGlass);

    var trimColor = opts.trimHex || accentHex;
    var trimMat = new T3.MeshStandardMaterial({ color: trimColor, roughness: 0.35 });
    var topBar = new T3.Mesh(new T3.BoxGeometry(0.14, 0.12, 2.86), trimMat); topBar.position.set(0, 0.92, 0);
    var botBar = topBar.clone(); botBar.position.y = -0.92;
    var leftBar = new T3.Mesh(new T3.BoxGeometry(0.14, 1.94, 0.12), trimMat); leftBar.position.set(0, 0, -1.38);
    var rightBar = leftBar.clone(); rightBar.position.z = 1.38;
    boardGroup.add(topBar, botBar, leftBar, rightBar);

    var sqMat = new T3.MeshStandardMaterial({ color: rimHex, roughness: 0.35 });
    var sqT = new T3.Mesh(new T3.BoxGeometry(0.12, 0.06, 0.84), sqMat); sqT.position.set(-0.02, 0.08, 0);
    var sqB = sqT.clone(); sqB.position.y = -0.52;
    var sqL = new T3.Mesh(new T3.BoxGeometry(0.12, 0.62, 0.06), sqMat); sqL.position.set(-0.02, -0.22, -0.4);
    var sqR = sqL.clone(); sqR.position.z = 0.4;
    boardGroup.add(sqT, sqB, sqL, sqR);

    if (opts.bannerTitle) {
      var signTex = createSignTexture(opts.bannerTitle, opts.bannerSub || '', opts.bannerBg || '#fff2e8', opts.bannerBorder || '#ff6b4a', opts.bannerInk || '#2b1d40');
      var signBoard = new T3.Mesh(
        new T3.BoxGeometry(0.16, 1.05, 2.85),
        [
          new T3.MeshStandardMaterial({ color: trimColor }),
          new T3.MeshStandardMaterial({ map: signTex, roughness: 0.38 }),
          new T3.MeshStandardMaterial({ color: trimColor }),
          new T3.MeshStandardMaterial({ color: trimColor }),
          new T3.MeshStandardMaterial({ color: trimColor }),
          new T3.MeshStandardMaterial({ color: trimColor })
        ]
      );
      signBoard.position.set(0, 1.56, 0); signBoard.castShadow = true;
      signBoard.userData.pickRole = opts.pickRole || '';
      signBoard.userData.pickValue = opts.pickValue || '';
      boardGroup.add(signBoard);
    }

    var rimGroup = new T3.Group();
    rimGroup.position.set(-0.56, 3.72, 0);
    g.add(rimGroup);

    var rim = new T3.Mesh(new T3.TorusGeometry(0.56, 0.055, 12, 28), new T3.MeshStandardMaterial({ color: rimHex, roughness: 0.25, metalness: 0.4 }));
    rim.rotation.x = Math.PI / 2; rim.castShadow = true;
    rimGroup.add(rim);

    var netGroup = new T3.Group();
    rimGroup.add(netGroup);
    var netMat = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });
    var netRings = [];
    var ringRadii = [0.53, 0.44, 0.36, 0.31];
    var ringYs = [-0.14, -0.36, -0.58, -0.82];
    for (var ri = 0; ri < ringRadii.length; ri++) {
      var nr = new T3.Mesh(new T3.TorusGeometry(ringRadii[ri], 0.022, 8, 18), netMat);
      nr.rotation.x = Math.PI / 2; nr.position.y = ringYs[ri];
      netGroup.add(nr); netRings.push(nr);
    }
    for (var ci = 0; ci < 10; ci++) {
      var ca = (ci / 10) * Math.PI * 2;
      var cord = new T3.Mesh(new T3.CylinderGeometry(0.016, 0.014, 0.86, 6), netMat);
      cord.position.set(Math.cos(ca) * 0.43, -0.43, Math.sin(ca) * 0.43);
      cord.rotation.z = Math.cos(ca) * 0.22; cord.rotation.x = -Math.sin(ca) * 0.22;
      netGroup.add(cord);
    }

    var aimHalo = new T3.Mesh(
      new T3.RingGeometry(0.72, 0.94, 32),
      new T3.MeshBasicMaterial({ color: 0xffe066, side: T3.DoubleSide, transparent: true, opacity: 0.0 })
    );
    aimHalo.rotation.x = -Math.PI / 2; aimHalo.position.set(-0.56, 3.74, 0);
    g.add(aimHalo);

    g.userData = {
      rimGroup: rimGroup, netGroup: netGroup, netRings: netRings, aimHalo: aimHalo,
      swishAnim: 0, rimShake: 0,
      getRimWorldPos: function (out) { g.updateMatrixWorld(true); return rimGroup.getWorldPosition(out || new T3.Vector3()); }
    };
    return g;
  }

  var eastHoop = createBasketballHoop({ accentHex: 0x2d74d6, rimHex: 0xff5a1f });
  eastHoop.position.set(11.6, 0, 0); scene.add(eastHoop);

  var westHoop = createBasketballHoop({ accentHex: 0x2d74d6, rimHex: 0xff5a1f });
  westHoop.position.set(-11.6, 0, 0); westHoop.rotation.y = Math.PI; scene.add(westHoop);

  var twinRig = new T3.Group(); twinRig.visible = false; scene.add(twinRig);
  var sportHoop = createBasketballHoop({
    accentHex: 0xff6b4a, trimHex: 0xff6b4a, rimHex: 0xffb320,
    bannerTitle: 'SPORT', bannerSub: '/ɔː/ · OR', bannerBg: '#fff2e8', bannerBorder: '#ff6b4a', bannerInk: '#9e270e',
    pickRole: 'phonics-hoop', pickValue: 'sport'
  });
  sportHoop.position.set(9.4, 0, -3.7); sportHoop.rotation.y = 0.16; twinRig.add(sportHoop);

  var workHoop = createBasketballHoop({
    accentHex: 0x4f9dff, trimHex: 0x4f9dff, rimHex: 0x2fc58a,
    bannerTitle: 'WORK', bannerSub: '/ɜː/ · ER', bannerBg: '#eaf5ff', bannerBorder: '#256ec9', bannerInk: '#164f96',
    pickRole: 'phonics-hoop', pickValue: 'work'
  });
  workHoop.position.set(9.4, 0, 3.7); workHoop.rotation.y = -0.16; twinRig.add(workHoop);
  var allHoops = [eastHoop, westHoop, sportHoop, workHoop];

  // Stage 1 Beacon + Stage 2 Hovering 3D Letter Basketballs + Single Aim Arrow
  var courtBeacon = new T3.Group(); courtBeacon.visible = false; scene.add(courtBeacon);
  var beaconRing = new T3.Mesh(
    new T3.RingGeometry(1.15, 1.55, 36),
    new T3.MeshBasicMaterial({ color: 0xffd43b, side: T3.DoubleSide, transparent: true, opacity: 0.92 })
  );
  beaconRing.rotation.x = -Math.PI / 2; beaconRing.position.y = 0.08; courtBeacon.add(beaconRing);
  var beaconBeam = new T3.Mesh(
    new T3.CylinderGeometry(1.15, 1.35, 3.6, 28, 1, true),
    new T3.MeshBasicMaterial({ color: 0xffe066, side: T3.DoubleSide, transparent: true, opacity: 0.24, depthWrite: false })
  );
  beaconBeam.position.y = 1.85; courtBeacon.add(beaconBeam);

  var spellRackGroup = new T3.Group(); spellRackGroup.visible = false; scene.add(spellRackGroup);
  var spellBalls3D = [];
  [new T3.Vector3(3.4, 0, -2.5), new T3.Vector3(3.4, 0, 0.0), new T3.Vector3(3.4, 0, 2.5)].forEach(function (pos, sb) {
    var slotG = new T3.Group(); slotG.position.copy(pos);
    var ped = new T3.Mesh(new T3.CylinderGeometry(0.55, 0.72, 0.34, 18), new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: 0.4 }));
    ped.position.y = 0.17; ped.castShadow = true; ped.receiveShadow = true; slotG.add(ped);
    var ringSel = new T3.Mesh(new T3.RingGeometry(0.68, 0.92, 24), new T3.MeshBasicMaterial({ color: 0xffd43b, side: T3.DoubleSide, transparent: true, opacity: 0.0 }));
    ringSel.rotation.x = -Math.PI / 2; ringSel.position.y = 0.05; slotG.add(ringSel);
    var sBall = new T3.Mesh(new T3.SphereGeometry(0.54, 24, 18), new T3.MeshStandardMaterial({ roughness: 0.42, metalness: 0.06 }));
    sBall.position.y = 1.02; sBall.castShadow = true;
    sBall.userData.pickRole = 'spell-ball'; sBall.userData.slotIndex = sb; slotG.add(sBall);
    spellRackGroup.add(slotG);
    spellBalls3D.push({ group: slotG, ball: sBall, ring: ringSel, letter: '' });
  });

  var aimArrow = new T3.Group(); aimArrow.visible = false; scene.add(aimArrow);
  var arrowShaft = new T3.Mesh(new T3.BoxGeometry(1.5, 0.12, 0.38), new T3.MeshStandardMaterial({ color: 0xffd43b, emissive: 0xff9f1c, emissiveIntensity: 0.35, roughness: 0.3 }));
  arrowShaft.position.x = 0.75;
  var arrowHead = new T3.Mesh(new T3.ConeGeometry(0.42, 0.75, 4), new T3.MeshStandardMaterial({ color: 0xffd43b, emissive: 0xff9f1c, emissiveIntensity: 0.35, roughness: 0.3 }));
  arrowHead.rotation.z = -Math.PI / 2; arrowHead.position.x = 1.78;
  aimArrow.add(arrowShaft, arrowHead);

  // Active 3D Basketball
  var activeBall = new T3.Mesh(
    new T3.SphereGeometry(0.42, 24, 18),
    new T3.MeshStandardMaterial({ map: createBasketballTexture(), roughness: 0.44, metalness: 0.05 })
  );
  activeBall.castShadow = true; activeBall.position.set(1.2, 0.42, 0.9);
  scene.add(activeBall);

  var shotAnim = { active: false, t: 0, dur: 0.88, start: new T3.Vector3(), end: new T3.Vector3(), peakY: 7.5, correct: true, targetHoop: null, isRimOutBounce: false, bounceVel: new T3.Vector3(), onImpact: null, impacted: false };

  // =========================================================================
  // 7. ZONE 2: 3D FESTIVAL PARK PLAZA, EXPRESS RED TRAIN, STREAM & ANOMALIES
  // =========================================================================
  var parkGroup = new T3.Group();
  scene.add(parkGroup);

  // Circular sunny cobblestone Festival Park Plaza around fountain [24, 0, -25]
  var parkPlaza = new T3.Mesh(
    new T3.CylinderGeometry(9.6, 10.2, 0.24, 36),
    new T3.MeshStandardMaterial({ color: 0xf6dca2, roughness: 0.78 })
  );
  parkPlaza.position.set(24, -0.10, -25);
  parkPlaza.receiveShadow = true;
  parkPlaza.userData.pickRole = 'zone2-park';
  parkGroup.add(parkPlaza);

  var parkBorder = new T3.Mesh(
    new T3.TorusGeometry(9.7, 0.28, 10, 40),
    new T3.MeshStandardMaterial({ color: 0x2fc58a, roughness: 0.55 })
  );
  parkBorder.rotation.x = Math.PI / 2; parkBorder.position.set(24, 0.04, -25);
  parkGroup.add(parkBorder);

  // Sparkling turquoise Park Stream crossing under the Festival Express Railway Bridge (x = 24, z = -19.2)
  var streamMesh = new T3.Mesh(
    new T3.PlaneGeometry(5.8, 14.5),
    new T3.MeshStandardMaterial({ color: 0x29c5e0, roughness: 0.18, metalness: 0.12 })
  );
  streamMesh.rotation.x = -Math.PI / 2;
  streamMesh.position.set(24.5, -0.05, -18.5);
  parkGroup.add(streamMesh);

  // Railway Track running East-West at z = -19.2 (x: 10..38)
  var railMat = new T3.MeshStandardMaterial({ color: 0x4b5568, roughness: 0.3, metalness: 0.75 });
  var tieMat = new T3.MeshStandardMaterial({ color: 0x9b622c, roughness: 0.75 });
  var railN = new T3.Mesh(new T3.BoxGeometry(28, 0.12, 0.16), railMat); railN.position.set(24, 0.12, -19.85);
  var railS = railN.clone(); railS.position.z = -18.55;
  parkGroup.add(railN, railS);

  // Permanent side sleepers + 6 Removable Golden Bridge Ties over the stream for Stage 5!
  var bridgeTies3D = [];
  for (var tx = 11; tx <= 37; tx += 1.25) {
    var inGap = (tx >= 21.4 && tx <= 27.9);
    var tie = new T3.Mesh(
      new T3.BoxGeometry(0.45, 0.14, 2.2),
      inGap ? new T3.MeshStandardMaterial({ color: 0xffb320, emissive: 0x9e5e00, emissiveIntensity: 0.15, roughness: 0.45 }) : tieMat
    );
    tie.position.set(tx, 0.06, -19.2);
    tie.castShadow = true; tie.receiveShadow = true;
    parkGroup.add(tie);
    if (inGap) bridgeTies3D.push({ mesh: tie, baseY: 0.06, dropT: 0 });
  }

  // Pro-Craft 3D Red Festival Express Steam Train
  var trainGroup = new T3.Group();
  trainGroup.position.set(17.5, 0.20, -19.2);
  scene.add(trainGroup);

  var trainWheels = [];
  var redPaint = new T3.MeshStandardMaterial({ color: 0xe63946, roughness: 0.28, metalness: 0.15 });
  var goldBrass = new T3.MeshStandardMaterial({ color: 0xffc436, roughness: 0.26, metalness: 0.65 });
  var darkSteel = new T3.MeshStandardMaterial({ color: 0x262d3d, roughness: 0.35, metalness: 0.6 });
  var blueCar = new T3.MeshStandardMaterial({ color: 0x4f9dff, roughness: 0.32 });

  // Locomotive chassis + boiler + cab + smokestack + cowcatcher
  var chassis = new T3.Mesh(new T3.BoxGeometry(4.4, 0.45, 1.85), darkSteel);
  chassis.position.set(0, 0.45, 0); chassis.castShadow = true; trainGroup.add(chassis);

  var boiler = new T3.Mesh(new T3.CylinderGeometry(0.76, 0.76, 2.6, 20), redPaint);
  boiler.rotation.z = Math.PI / 2; boiler.position.set(0.65, 1.32, 0); boiler.castShadow = true; trainGroup.add(boiler);

  var band1 = new T3.Mesh(new T3.TorusGeometry(0.78, 0.06, 8, 22), goldBrass);
  band1.rotation.y = Math.PI / 2; band1.position.set(0.2, 1.32, 0);
  var band2 = band1.clone(); band2.position.x = 1.35;
  trainGroup.add(band1, band2);

  var cab = new T3.Mesh(new T3.BoxGeometry(1.65, 1.85, 1.92), redPaint);
  cab.position.set(-1.3, 1.55, 0); cab.castShadow = true; trainGroup.add(cab);

  var cabRoof = new T3.Mesh(new T3.BoxGeometry(1.95, 0.22, 2.15), goldBrass);
  cabRoof.position.set(-1.3, 2.55, 0); cabRoof.castShadow = true; trainGroup.add(cabRoof);

  var cabWin = new T3.Mesh(new T3.BoxGeometry(0.95, 0.72, 1.98), new T3.MeshStandardMaterial({ color: 0xb8ecff, roughness: 0.15 }));
  cabWin.position.set(-1.3, 1.82, 0); trainGroup.add(cabWin);

  var chimney = new T3.Mesh(new T3.CylinderGeometry(0.32, 0.22, 0.95, 14), darkSteel);
  chimney.position.set(1.45, 2.32, 0); chimney.castShadow = true; trainGroup.add(chimney);

  var headlamp = new T3.Mesh(new T3.CylinderGeometry(0.24, 0.24, 0.2, 14), new T3.MeshStandardMaterial({ color: 0xfff3a1, emissive: 0xffd43b, emissiveIntensity: 0.7 }));
  headlamp.rotation.z = Math.PI / 2; headlamp.position.set(2.02, 1.45, 0); trainGroup.add(headlamp);

  var cowcatcher = new T3.Mesh(new T3.ConeGeometry(0.85, 0.95, 4), goldBrass);
  cowcatcher.rotation.z = -Math.PI / 2; cowcatcher.rotation.y = Math.PI / 4;
  cowcatcher.position.set(2.48, 0.56, 0); trainGroup.add(cowcatcher);

  // Matching Passenger Carriage behind locomotive
  var carriage = new T3.Mesh(new T3.BoxGeometry(3.4, 1.65, 1.85), blueCar);
  carriage.position.set(-4.3, 1.38, 0); carriage.castShadow = true; trainGroup.add(carriage);
  var carRoof = new T3.Mesh(new T3.BoxGeometry(3.65, 0.24, 2.02), new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: 0.4 }));
  carRoof.position.set(-4.3, 2.28, 0); trainGroup.add(carRoof);
  var carWins = new T3.Mesh(new T3.BoxGeometry(2.6, 0.62, 1.92), new T3.MeshStandardMaterial({ color: 0xdff5ff, roughness: 0.15 }));
  carWins.position.set(-4.3, 1.56, 0); trainGroup.add(carWins);

  // Rotating Golden-Spoked Train Wheels
  [-5.3, -3.3, -1.4, 0.2, 1.5].forEach(function (wx) {
    [-0.98, 0.98].forEach(function (wz) {
      var wh = new T3.Mesh(new T3.CylinderGeometry(0.42, 0.42, 0.16, 16), goldBrass);
      wh.rotation.x = Math.PI / 2;
      wh.position.set(wx, 0.42, wz);
      wh.castShadow = true;
      trainGroup.add(wh);
      trainWheels.push(wh);
    });
  });

  var trainState = { x: 17.5, goalX: 17.5, steamT: 0 };
  var steamPuffs = [];
  function spawnSteamPuff() {
    var puff = new T3.Mesh(
      new T3.SphereGeometry(0.32 + Math.random() * 0.18, 10, 8),
      new T3.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, roughness: 0.9 })
    );
    puff.position.set(trainGroup.position.x + 1.45, trainGroup.position.y + 2.85, trainGroup.position.z);
    scene.add(puff);
    steamPuffs.push({ mesh: puff, vy: 1.6 + Math.random() * 0.7, vx: -0.6, life: 1.25 });
  }

  // Stage 6: Real 3D Silly Anomalies inside Festival Park (directly clickable in 3D!)
  var anomalyGroup = new T3.Group(); anomalyGroup.visible = false; scene.add(anomalyGroup);
  var anomalies3D = {};

  // 1) Giant 3D Flying Orange Fish above Fountain
  var fishG = new T3.Group(); fishG.position.set(24, 5.4, -25);
  var fishBody = new T3.Mesh(new T3.SphereGeometry(0.95, 18, 14), new T3.MeshStandardMaterial({ color: 0xff8524, roughness: 0.28 }));
  fishBody.scale.set(1.55, 0.92, 0.65); fishBody.castShadow = true;
  fishBody.userData.pickRole = 'anomaly'; fishBody.userData.pickValue = 'fish';
  var fishTail = new T3.Mesh(new T3.ConeGeometry(0.68, 0.95, 4), new T3.MeshStandardMaterial({ color: 0xffd43b, roughness: 0.35 }));
  fishTail.rotation.z = -Math.PI / 2; fishTail.position.set(-1.55, 0, 0);
  var fishEye = new T3.Mesh(new T3.SphereGeometry(0.18, 10, 10), new T3.MeshStandardMaterial({ color: 0x2b1d40 }));
  fishEye.position.set(0.85, 0.22, 0.45);
  var fishEye2 = fishEye.clone(); fishEye2.position.z = -0.45;
  fishG.add(fishBody, fishTail, fishEye, fishEye2);
  anomalyGroup.add(fishG); anomalies3D.fish = fishG;

  // 2) Giant 3D Summer Snowman on sunny park grass
  var snowG = new T3.Group(); snowG.position.set(18.5, 0, -22.5);
  var snowMat = new T3.MeshStandardMaterial({ color: 0xf7fbff, roughness: 0.65 });
  var sb1 = new T3.Mesh(new T3.SphereGeometry(0.95, 18, 14), snowMat); sb1.position.y = 0.85; sb1.castShadow = true;
  var sb2 = new T3.Mesh(new T3.SphereGeometry(0.72, 18, 14), snowMat); sb2.position.y = 2.05; sb2.castShadow = true;
  var sb3 = new T3.Mesh(new T3.SphereGeometry(0.52, 18, 14), snowMat); sb3.position.y = 3.0; sb3.castShadow = true;
  var carrot = new T3.Mesh(new T3.ConeGeometry(0.14, 0.65, 10), new T3.MeshStandardMaterial({ color: 0xff6b24 }));
  carrot.rotation.x = Math.PI / 2; carrot.position.set(0, 3.0, 0.58);
  var topHat = new T3.Mesh(new T3.CylinderGeometry(0.36, 0.38, 0.62, 14), new T3.MeshStandardMaterial({ color: 0x2b1d40 }));
  topHat.position.y = 3.68;
  [sb1, sb2, sb3].forEach(function (m) { m.userData.pickRole = 'anomaly'; m.userData.pickValue = 'snow'; });
  snowG.add(sb1, sb2, sb3, carrot, topHat);
  anomalyGroup.add(snowG); anomalies3D.snow = snowG;

  // 3) Giant 3D Guitar on top of the Red Festival Train (populated by real .glb below)
  var guitarHolder = new T3.Group(); guitarHolder.position.set(24.5, 3.2, -19.2);
  anomalyGroup.add(guitarHolder); anomalies3D.guitar = guitarHolder;

  // 4) Giant 3D Floating Crown above Fountain (populated by real .glb below)
  var crownHolder = new T3.Group(); crownHolder.position.set(24, 4.9, -25);
  anomalyGroup.add(crownHolder); anomalies3D.crown = crownHolder;

  // Magic Zap Rainbow Beam for Stage 6
  var zapBeam = new T3.Mesh(
    new T3.CylinderGeometry(0.16, 0.34, 1, 12),
    new T3.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.9 })
  );
  zapBeam.visible = false;
  scene.add(zapBeam);
  var zapLife = 0;

  // =========================================================================
  // 8. ZONE 3: 3D GRAND THEATRE STAGE, ANIMATED VELVET CURTAINS & SPOTLIGHTS
  // =========================================================================
  var theatreGroup = new T3.Group();
  theatreGroup.position.set(45, 0, -45);
  theatreGroup.rotation.y = -Math.PI * 0.25; // Faces cleanly SW toward the Adventure Park camera!
  scene.add(theatreGroup);

  // Raised Glossy Mahogany Stage Deck
  var stageDeck = new T3.Mesh(
    new T3.BoxGeometry(14.0, 1.35, 8.8),
    new T3.MeshStandardMaterial({ color: 0x7c3f24, roughness: 0.35 })
  );
  stageDeck.position.set(0, 0.68, 0); stageDeck.castShadow = true; stageDeck.receiveShadow = true;
  stageDeck.userData.pickRole = 'zone3-theatre';
  theatreGroup.add(stageDeck);

  // Golden Stage Apron Trim + 9 Warm Glowing Footlights
  var stageTrim = new T3.Mesh(new T3.BoxGeometry(14.3, 0.24, 0.26), goldBrass);
  stageTrim.position.set(0, 1.32, 4.42); theatreGroup.add(stageTrim);
  var footMat = new T3.MeshStandardMaterial({ color: 0xfff5b8, emissive: 0xffc83d, emissiveIntensity: 0.95 });
  for (var fl = -5.6; fl <= 5.6; fl += 1.4) {
    var bulb = new T3.Mesh(new T3.SphereGeometry(0.19, 12, 10), footMat);
    bulb.position.set(fl, 1.44, 4.18);
    theatreGroup.add(bulb);
  }

  // Ornate Golden Proscenium Arch + GRAND THEATRE Marquee Crest
  var pillarL = new T3.Mesh(new T3.CylinderGeometry(0.42, 0.52, 8.2, 14), goldBrass);
  pillarL.position.set(-6.4, 4.7, 3.6); pillarL.castShadow = true;
  var pillarR = pillarL.clone(); pillarR.position.x = 6.4;
  var archBeam = new T3.Mesh(new T3.BoxGeometry(14.2, 1.3, 0.95), new T3.MeshStandardMaterial({ color: 0xa4163a, roughness: 0.4 }));
  archBeam.position.set(0, 8.6, 3.6); archBeam.castShadow = true;
  var marquee = new T3.Mesh(
    new T3.PlaneGeometry(9.6, 1.8),
    new T3.MeshStandardMaterial({ map: createSignTexture('GRAND THEATRE', 'FESTIVAL SHOW', '#fff8ec', '#ff5fa2', '#2b1d40'), roughness: 0.35 })
  );
  marquee.position.set(0, 8.75, 4.12);
  theatreGroup.add(pillarL, pillarR, archBeam, marquee);

  // Dynamic Backstage Storybook Screen (shows brand-new Pixar Story Scene in Stage 8!)
  var backdropMat = new T3.MeshStandardMaterial({ color: 0x2b2559, roughness: 0.55 });
  var backdropScreen = new T3.Mesh(new T3.PlaneGeometry(10.8, 6.2), backdropMat);
  backdropScreen.position.set(0, 4.5, -3.4);
  theatreGroup.add(backdropScreen);

  var texLoader = new T3.TextureLoader();
  function setTheatreBackdrop(imgUrl) {
    if (!imgUrl) {
      backdropMat.map = null;
      backdropMat.color.setHex(0x3a2d6b);
      backdropMat.needsUpdate = true;
      return;
    }
    texLoader.load(imgUrl, function (tex) {
      if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
      backdropMat.map = tex;
      backdropMat.color.setHex(0xffffff);
      backdropMat.needsUpdate = true;
    });
  }

  // REAL ANIMATED 3D RED VELVET CURTAINS (Left & Right Pleated Drapes)
  var velvetMat = new T3.MeshStandardMaterial({ color: 0xc9183a, roughness: 0.72, metalness: 0.05 });
  function createCurtainWing() {
    var g = new T3.Group();
    for (var p = 0; p < 5; p++) {
      var pleat = new T3.Mesh(new T3.CylinderGeometry(0.62, 0.74, 7.2, 12), velvetMat);
      pleat.position.set((p - 2) * 1.18, 4.95, 0);
      pleat.scale.set(1.0, 1.0, 0.55);
      pleat.castShadow = true;
      g.add(pleat);
    }
    return g;
  }
  var curtainLeft = createCurtainWing();
  curtainLeft.position.set(-3.1, 0, 3.25);
  var curtainRight = createCurtainWing();
  curtainRight.position.set(3.1, 0, 3.25);
  theatreGroup.add(curtainLeft, curtainRight);

  // Volumetric Sweeping Golden Stage Spotlights
  var spotMat = new T3.MeshBasicMaterial({ color: 0xffe885, transparent: true, opacity: 0.16, depthWrite: false, side: T3.DoubleSide });
  var spotConeL = new T3.Mesh(new T3.ConeGeometry(2.6, 8.6, 20, 1, true), spotMat);
  spotConeL.position.set(-3.2, 5.2, 1.0); spotConeL.rotation.z = -0.32;
  var spotConeR = new T3.Mesh(new T3.ConeGeometry(2.6, 8.6, 20, 1, true), spotMat.clone());
  spotConeR.position.set(3.2, 5.2, 1.0); spotConeR.rotation.z = 0.32;
  theatreGroup.add(spotConeL, spotConeR);

  // Stage 7 Prop Pedestal + Stage 9 Golden Trophy Pedestal on Stage
  var stagePropHolder = new T3.Group();
  stagePropHolder.position.set(2.8, 1.38, 1.2);
  theatreGroup.add(stagePropHolder);
  var loadedStageProps = {};
  var finaleTrophyHolder = new T3.Group();
  finaleTrophyHolder.position.set(0, 1.45, 2.2);
  finaleTrophyHolder.visible = false;
  theatreGroup.add(finaleTrophyHolder);

  // Helper to convert Theatre local coords into World coords for Monsters & Camera
  function theatreToWorld(lx, ly, lz) {
    theatreGroup.updateMatrixWorld(true);
    return new T3.Vector3(lx, ly, lz).applyMatrix4(theatreGroup.matrixWorld);
  }

  // =========================================================================
  // 9. REAL .GLB ASSETS (4 TEAM MONSTERS + STADIUM + PARK + THEATRE PROPS)
  // =========================================================================
  var loader = new T3.GLTFLoader();
  var monsters = [];
  var floaters = [];

  function loadGlb(url, opts) {
    opts = opts || {};
    loader.load(url, function (gltf) {
      var root = gltf.scene || gltf.scenes[0];
      if (!root) return;
      root.traverse(function (o) {
        if (o.isMesh) {
          o.castShadow = opts.castShadow !== false;
          o.receiveShadow = opts.receiveShadow !== false;
        }
      });
      var box = new T3.Box3().setFromObject(root);
      var size = new T3.Vector3(), center = new T3.Vector3();
      box.getSize(size); box.getCenter(center);

      var wrap = new T3.Group();
      var s = 1;
      if (opts.height && size.y > 0.001) s = opts.height / size.y;
      else if (opts.maxDim) {
        var md = Math.max(size.x, size.y, size.z);
        if (md > 0.001) s = opts.maxDim / md;
      }
      root.scale.setScalar(s);
      root.position.set(-center.x * s, -box.min.y * s, -center.z * s);
      wrap.add(root);

      if (opts.pos) wrap.position.set(opts.pos[0], opts.pos[1], opts.pos[2]);
      if (opts.rotY) wrap.rotation.y = opts.rotY;
      if (opts.blobShadow) addBlobShadow(wrap, opts.blobShadow, 0.03);
      if (opts.pickRole) {
        wrap.traverse(function (o) {
          if (o.isMesh) { o.userData.pickRole = opts.pickRole; o.userData.pickValue = opts.pickValue || ''; }
        });
      }
      (opts.parent || scene).add(wrap);
      if (opts.onReady) opts.onReady(wrap);
    }, undefined, function () {});
  }

  var benchPositions = [
    new T3.Vector3(-4.2, 0.02, -8.8),
    new T3.Vector3(-1.4, 0.02, -8.8),
    new T3.Vector3(1.4, 0.02, -8.8),
    new T3.Vector3(4.2, 0.02, -8.8)
  ];
  DATA.TEAMS.forEach(function (team, idx) {
    var holder = new T3.Group();
    holder.position.copy(benchPositions[idx]);
    scene.add(holder);
    var mObj = { teamIdx: idx, holder: holder, mesh: null, goalPos: benchPositions[idx].clone(), goalRotY: 0, celebrateT: 0, wobbleT: 0 };
    monsters.push(mObj);
    loadGlb(team.glb, { height: 2.55, blobShadow: 1.05, parent: holder, onReady: function (w) { mObj.mesh = w; } });
  });

  // Load Zone 1 Stadium Props
  loadGlb('../assets/3d/world/bleachers.glb', { height: 4.4, pos: [-5.5, 0, -14.4], rotY: 0 });
  loadGlb('../assets/3d/world/bleachers.glb', { height: 4.4, pos: [5.5, 0, -14.4], rotY: 0 });
  loadGlb('../assets/3d/world/bleachers.glb', { height: 4.4, pos: [-6.0, 0, 13.6], rotY: Math.PI });
  loadGlb('../assets/3d/world/bleachers.glb', { height: 4.4, pos: [6.0, 0, 13.6], rotY: Math.PI });
  loadGlb('../assets/3d/world/scoreboard.glb', { height: 6.2, pos: [0, 0, -17.6], rotY: 0 });
  loadGlb('../assets/3d/world/bench.glb', { height: 1.25, pos: [-2.8, 0, -10.0], rotY: 0 });
  loadGlb('../assets/3d/world/bench.glb', { height: 1.25, pos: [2.8, 0, -10.0], rotY: 0 });
  loadGlb('../assets/3d/home/team-flagpole.glb', { height: 7.4, pos: [-15.2, 0, -10.4] });
  loadGlb('../assets/3d/home/team-flagpole.glb', { height: 7.4, pos: [15.2, 0, -10.4] });
  loadGlb('../assets/3d/world/lamp.glb', { height: 5.2, pos: [-15.0, 0, 8.8] });
  loadGlb('../assets/3d/world/lamp.glb', { height: 5.2, pos: [15.0, 0, 8.8] });
  loadGlb('../assets/3d/world/flower-bed.glb', { height: 1.05, pos: [-15.8, 0, -3.8] });
  loadGlb('../assets/3d/world/flower-bed.glb', { height: 1.05, pos: [-15.8, 0, 3.8] });

  // Load Zone 2 Festival Park Props + 3D Anomaly Models (zero sightline blocking!)
  loadGlb('../assets/3d/world/fountain.glb', { height: 4.2, pos: [24, 0, -25] });
  loadGlb('../assets/3d/home/games-arch.glb', { height: 6.2, pos: [14.8, 0, -29.8], rotY: 0.45 });
  loadGlb('../assets/3d/world/ice-cream-cart.glb', { height: 2.8, pos: [30.5, 0, -25.5], rotY: -1.1 });
  loadGlb('../assets/3d/world/bench.glb', { height: 1.25, pos: [17.5, 0, -27.5], rotY: 0.7 });
  loadGlb('../assets/3d/world/flower-bed.glb', { height: 1.05, pos: [28.5, 0, -29.5] });
  loadGlb('../assets/3d/items/cs-guitar.glb', { maxDim: 2.4, parent: guitarHolder, pickRole: 'anomaly', pickValue: 'guitar' });
  loadGlb('../assets/3d/items/hat-crown.glb', { maxDim: 2.2, parent: crownHolder, pickRole: 'anomaly', pickValue: 'crown' });

  // Load Zone 3 Grand Theatre Surroundings + Casting Props + Golden Trophy (clear front stage!)
  loadGlb('../assets/3d/home/ticket-booth.glb', { height: 4.2, pos: [29.2, 0, -40.5], rotY: -0.6 });
  loadGlb('../assets/3d/home/team-flagpole.glb', { height: 7.4, pos: [34, 0, -49] });
  loadGlb('../assets/3d/home/team-flagpole.glb', { height: 7.4, pos: [53, 0, -35] });
  loadGlb('../assets/3d/world/lamp.glb', { height: 5.2, pos: [33.5, 0, -45.5] });
  loadGlb('../assets/3d/world/lamp.glb', { height: 5.2, pos: [49.5, 0, -33.5] });
  loadGlb('../assets/3d/items/acc-trophy.glb', { height: 2.2, parent: finaleTrophyHolder });

  DATA.CASTING_ROUNDS.forEach(function (cr) {
    loadGlb(cr.propGlb, {
      maxDim: 2.1,
      parent: stagePropHolder,
      onReady: function (w) { w.visible = false; loadedStageProps[cr.id] = w; }
    });
  });

  // Lush Park Trees across all 3 zones (kept clear of camera sightlines!)
  [
    ['../assets/3d/world/tree-blossom.glb', 6.8, [-20, 0, -14]],
    ['../assets/3d/world/tree-round.glb',   6.4, [-22, 0, 0]],
    ['../assets/3d/world/tree-pine.glb',    7.6, [-19, 0, 15]],
    ['../assets/3d/world/tree-blossom.glb', 6.6, [18, 0, 14]],
    ['../assets/3d/world/tree-round.glb',   6.4, [11, 0, -13]],
    ['../assets/3d/world/tree-pine.glb',    7.2, [9, 0, -25]],
    ['../assets/3d/world/tree-blossom.glb', 6.5, [13, 0, -35]],
    ['../assets/3d/world/tree-round.glb',   6.2, [36, 0, -16]],
    ['../assets/3d/world/tree-blossom.glb', 6.8, [43, 0, -23]],
    ['../assets/3d/world/tree-pine.glb',    7.8, [56, 0, -42]],
    ['../assets/3d/world/tree-blossom.glb', 7.2, [42, 0, -58]],
    ['../assets/3d/world/tree-round.glb',   7.0, [56, 0, -54]]
  ].forEach(function (t) {
    loadGlb(t[0], { height: t[1], pos: t[2], rotY: Math.random() * Math.PI * 2 });
  });

  loadGlb('../assets/3d/home/hot-air-balloon.glb', {
    height: 8.5, pos: [26, 17, -36], castShadow: false,
    onReady: function (w) { floaters.push({ obj: w, baseY: 17, amp: 1.2, speed: 0.7, phase: 0.4 }); }
  });

  // =========================================================================
  // 10. 3D CONFETTI & FIREWORKS PARTICLES
  // =========================================================================
  var bursts = [];
  var burstColors = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a, 0xffe066, 0xffffff];
  function spawnConfettiBurst(origin, count) {
    count = count || 38;
    for (var i = 0; i < count; i++) {
      var geo = (i % 2 === 0) ? new T3.OctahedronGeometry(0.20, 0) : new T3.BoxGeometry(0.26, 0.14, 0.06);
      var mat = new T3.MeshStandardMaterial({ color: burstColors[i % burstColors.length], emissive: burstColors[i % burstColors.length], emissiveIntensity: 0.3, roughness: 0.3 });
      var p = new T3.Mesh(geo, mat);
      p.position.copy(origin);
      var spd = 4.5 + Math.random() * 6.8;
      var ang = Math.random() * Math.PI * 2;
      scene.add(p);
      bursts.push({ mesh: p, vel: new T3.Vector3(Math.cos(ang) * spd * 0.65, 4.5 + Math.random() * 6.0, Math.sin(ang) * spd * 0.65), life: 1.6 + Math.random() * 0.6, rotSpd: (Math.random() - 0.5) * 10 });
    }
  }

  // =========================================================================
  // 11. PROJECTED 3D WORLD PINS & HUD HELPERS
  // =========================================================================
  var activePins = [];
  function setWorldPins(list) {
    worldPinsEl.innerHTML = '';
    activePins = list.map(function (item) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'world-pin ' + (item.cls || '');
      el.innerHTML = item.html;
      if (item.onClick) el.addEventListener('click', item.onClick);
      worldPinsEl.appendChild(el);
      return { el: el, pos: new T3.Vector3(item.pos[0], item.pos[1], item.pos[2]), item: item };
    });
  }

  var tmpProj = new T3.Vector3();
  function updateWorldPins() {
    var w = window.innerWidth, h = window.innerHeight;
    for (var i = 0; i < activePins.length; i++) {
      var pin = activePins[i];
      tmpProj.copy(pin.pos).project(camera);
      if (tmpProj.z > 1) {
        pin.el.style.display = 'none';
      } else {
        var px = Math.max(96, Math.min(w - 96, (tmpProj.x * 0.5 + 0.5) * w));
        var py = Math.max(106, Math.min(h - 140, (-tmpProj.y * 0.5 + 0.5) * h));
        pin.el.style.display = 'flex';
        pin.el.style.left = px + 'px';
        pin.el.style.top = py + 'px';
      }
    }
  }

  function showToast(text, isOops) {
    cinemaToast.textContent = text;
    cinemaToast.classList.toggle('oops', !!isOops);
    cinemaToast.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () { cinemaToast.classList.remove('show'); }, 1750);
  }

  function renderStagePills() {
    stagePillsWrap.innerHTML = '';
    var zoneStages = DATA.STAGES.filter(function (s) { return s.zone === state.activeZone; });
    zoneStages.forEach(function (st) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'stage-pill ' + st.cls + (state.mode === st.id ? ' active' : '') + (state.stageDone[st.id] ? ' done' : '');
      b.textContent = st.label;
      b.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxTap(); launchStageById(st.id); });
      stagePillsWrap.appendChild(b);
    });
  }

  function renderTeams() {
    teamStrip.innerHTML = '';
    DATA.TEAMS.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'team-pill ' + t.css + (state.activeTeam === i ? ' active' : '');
      b.innerHTML = '<span class="team-name">' + t.name + '</span><span class="team-score">' + state.scores[i] + '</span>';
      b.addEventListener('click', function () {
        AUDIO.unlock(); AUDIO.sfxTap();
        state.activeTeam = i;
        positionMonstersForMode();
        renderTeams();
      });
      teamStrip.appendChild(b);
    });
  }

  function setLaunchButton(ready, icon, label) {
    btnLaunch.disabled = !ready || state.busy;
    btnLaunch.classList.toggle('ready', !!ready && !state.busy);
    launchIcon.textContent = icon || '🏀';
    launchTxt.textContent = state.busy ? 'ACTION!' : label;
  }

  function positionMonstersForMode() {
    if (state.mode === 'map' || state.activeZone === 1) {
      var spot = new T3.Vector3(-0.6, 0.02, 0.0);
      if (state.mode === 's1') spot.set(-3.2, 0.02, -0.4);
      else if (state.mode === 's2') spot.set(1.2, 0.02, 0.0);
      else if (state.mode === 's3') spot.set(0.6, 0.02, 0.0);
      monsters.forEach(function (m, i) {
        if (state.mode !== 'map' && i === state.activeTeam) {
          m.goalPos.copy(spot); m.goalRotY = Math.PI / 2;
        } else {
          m.goalPos.copy(benchPositions[i]); m.goalRotY = 0;
        }
      });
    } else if (state.activeZone === 2) {
      var parkSpots = [
        new T3.Vector3(19.5, 0.02, -25.2),
        new T3.Vector3(21.6, 0.02, -28.0),
        new T3.Vector3(26.4, 0.02, -28.0),
        new T3.Vector3(28.5, 0.02, -25.2)
      ];
      monsters.forEach(function (m, i) {
        if (i === state.activeTeam) {
          m.goalPos.set(22.2, 0.04, -22.2);
          m.goalRotY = 0.25;
        } else {
          m.goalPos.copy(parkSpots[i]);
          m.goalRotY = 0;
        }
      });
    } else if (state.activeZone === 3) {
      if (state.mode === 's9') {
        // Curtain Call Finale: All 4 monsters lined up center stage taking a bow!
        [-4.2, -1.4, 1.4, 4.2].forEach(function (lx, i) {
          monsters[i].goalPos.copy(theatreToWorld(lx, 1.38, 0.6));
          monsters[i].goalRotY = -Math.PI * 0.25;
        });
      } else {
        var wingSpots = [[-4.8, 1.38, -1.2], [-3.2, 1.38, -1.8], [3.2, 1.38, -1.8], [4.8, 1.38, -1.2]];
        monsters.forEach(function (m, i) {
          if (i === state.activeTeam) {
            m.goalPos.copy(theatreToWorld(-0.4, 1.38, 1.1));
            m.goalRotY = -Math.PI * 0.25;
          } else {
            m.goalPos.copy(theatreToWorld(wingSpots[i][0], wingSpots[i][1], wingSpots[i][2]));
            m.goalRotY = -Math.PI * 0.25;
          }
        });
      }
    }
  }

  function resetStageVisuals() {
    state.stageToken++;
    state.selectedChoice = null;
    state.busy = false;
    shotAnim.active = false;
    mapHero.classList.add('hidden');
    victoryBanner.classList.add('hidden');
    cueCard.classList.add('hidden');
    trackStrip.classList.add('hidden');
    bottomDock.classList.remove('hidden');
    eastHoop.visible = true;
    westHoop.visible = true;
    twinRig.visible = false;
    courtBeacon.visible = false;
    spellRackGroup.visible = false;
    aimArrow.visible = false;
    anomalyGroup.visible = false;
    finaleTrophyHolder.visible = false;
    Object.keys(loadedStageProps).forEach(function (k) { loadedStageProps[k].visible = false; });
    bridgeTies3D.forEach(function (t) { t.mesh.visible = true; t.mesh.position.y = t.baseY; });
    setWorldPins([]);
  }

  function launchStageById(id) {
    if (id === 's1') startStage1();
    else if (id === 's2') startStage2();
    else if (id === 's3') startStage3();
    else if (id === 's4') startStage4();
    else if (id === 's5') startStage5();
    else if (id === 's6') startStage6();
    else if (id === 's7') startStage7();
    else if (id === 's8') startStage8();
    else if (id === 's9') startStage9();
  }

  // =========================================================================
  // 12. 3D LIVE-CAMERA WORLD MAP (ALL 3 ZONES OPEN & FLY-TO ENABLED!)
  // =========================================================================
  function enterMap() {
    resetStageVisuals();
    state.mode = 'map';
    state.currentVoiceId = 'intro_world';
    state.curtainTarget = 0.0;
    AUDIO.setZone(1);

    mapHero.classList.remove('hidden');
    bottomDock.classList.add('hidden');
    roundChip.textContent = '3D Adventure Park · Choose Any Zone!';
    activeBall.visible = true;

    camGoalPos.set(-18, 25, 32);
    camGoalLook.set(13, 1.0, -13);

    positionMonstersForMode();
    renderStagePills();

    setWorldPins([
      { pos: [0, 5.2, 0],     cls: 'zone-1', html: '🏀 Zone 1: Sunny Court',    onClick: function () { AUDIO.unlock(); AUDIO.sfxWhistle(); startStage1(); } },
      { pos: [24, 5.8, -25],  cls: 'zone-2', html: '🚂 Zone 2: Festival Park',  onClick: function () { AUDIO.unlock(); AUDIO.sfxTrainChug(); startStage4(); } },
      { pos: [45, 11.2, -45], cls: 'zone-3', html: '🎭 Zone 3: Grand Theatre',  onClick: function () { AUDIO.unlock(); AUDIO.sfxCurtainUp(); startStage7(); } }
    ]);
  }

  // =========================================================================
  // 13. ZONE 1 STAGES (1: Court Explorer · 2: Spell & Shoot · 3: OR-Phonics)
  // =========================================================================
  function startStage1() {
    resetStageVisuals();
    state.mode = 's1'; state.activeZone = 1; state.s1Idx = 0; state.s1Found = {};
    AUDIO.setZone(1);
    activeBall.visible = true;
    courtBeacon.visible = true; aimArrow.visible = true;
    camGoalPos.set(-1.5, 14.5, 19.8); camGoalLook.set(2.5, 0.8, 0.2);
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage1Round();
    state.currentVoiceId = 'intro_s1'; AUDIO.playVoice('intro_s1');
  }

  function loadStage1Round() {
    var z = DATA.COURT_ZONES[state.s1Idx];
    if (!z) {
      state.stageDone.s1 = true; renderStagePills();
      showToast('🏀 Court Explorer Complete! Next: Spell & Shoot!', false);
      var tok = state.stageToken;
      setTimeout(function () { if (state.stageToken === tok) startStage2(); }, 1550);
      return;
    }
    state.selectedChoice = null;
    roundChip.textContent = 'Stage 1 · Court Explorer (' + (state.s1Idx + 1) + ' / ' + DATA.COURT_ZONES.length + ') · ' + z.cue;
    courtBeacon.position.set(z.ringPos[0], 0, z.ringPos[2]);
    var sc = z.ringRadius / 1.35; courtBeacon.scale.set(sc, 1, sc);
    aimArrow.position.set(-2.0, 1.3, -0.4); aimArrow.lookAt(z.pos[0], 1.3, z.pos[2]); aimArrow.rotateY(-Math.PI / 2);

    var pins = [];
    DATA.COURT_ZONES.forEach(function (cz) {
      if (state.s1Found[cz.id]) pins.push({ pos: [cz.pos[0], cz.isHoop ? 5.2 : 1.3, cz.pos[2]], cls: 'court-done', html: '✓ ' + cz.label });
    });
    setWorldPins(pins);

    choiceTray.innerHTML = '';
    DATA.COURT_ZONES.forEach(function (cz) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice-btn' + (state.s1Found[cz.id] ? ' used' : '');
      b.textContent = cz.label;
      b.addEventListener('click', function () {
        if (state.busy || state.s1Found[cz.id]) return;
        AUDIO.unlock(); AUDIO.sfxTap(); AUDIO.playVoice(cz.vo);
        state.selectedChoice = cz.id;
        Array.prototype.forEach.call(choiceTray.children, function (c) { c.classList.remove('selected'); });
        b.classList.add('selected');
        setLaunchButton(true, '🏀', 'SPEAK CHECK · SHOOT!');
      });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '🏀', 'PICK A LABEL');
  }

  function formatMissingWord(word, missingIdx, filledChar) {
    var html = '';
    for (var i = 0; i < word.length; i++) {
      if (i === missingIdx) html += filledChar ? ('<span class="filled">' + filledChar + '</span>') : '<span class="blank">_</span>';
      else html += word[i];
      if (i < word.length - 1) html += ' ';
    }
    return html;
  }

  function startStage2() {
    resetStageVisuals();
    state.mode = 's2'; state.activeZone = 1; state.s2Idx = 0;
    AUDIO.setZone(1);
    activeBall.visible = true;
    cueCard.classList.remove('hidden'); spellRackGroup.visible = true; aimArrow.visible = true;
    camGoalPos.set(-4.6, 5.4, 7.6); camGoalLook.set(7.4, 2.8, 0.0);
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage2Round();
    state.currentVoiceId = 'intro_s2'; AUDIO.playVoice('intro_s2');
  }

  function loadStage2Round() {
    var r = DATA.SPELL_ROUNDS[state.s2Idx];
    if (!r) {
      state.stageDone.s2 = true; renderStagePills();
      showToast('🔥 Free-Throw Master! Next: Twin-Hoop Phonics!', false);
      var tok = state.stageToken;
      setTimeout(function () { if (state.stageToken === tok) startStage3(); }, 1550);
      return;
    }
    state.selectedChoice = null; state.currentVoiceId = r.vo;
    roundChip.textContent = 'Stage 2 · Spell & Shoot (' + (state.s2Idx + 1) + ' / ' + DATA.SPELL_ROUNDS.length + ')';
    cueImg.src = r.img; cueWord.innerHTML = formatMissingWord(r.word, r.missingIndex, null); cueHint.textContent = r.cue;
    cueCard.classList.remove('pop'); void cueCard.offsetWidth; cueCard.classList.add('pop');

    r.options.forEach(function (letter, idx) {
      var sb = spellBalls3D[idx]; sb.letter = letter;
      sb.ball.material.map = createLetterBallTexture(letter); sb.ball.material.needsUpdate = true;
      sb.ring.material.opacity = 0.0; sb.group.scale.setScalar(1);
    });
    aimArrow.position.set(2.5, 2.0, 0.0); aimArrow.lookAt(11.0, 3.8, 0.0); aimArrow.rotateY(-Math.PI / 2);

    choiceTray.innerHTML = '';
    r.options.forEach(function (letter, idx) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn ball-letter'; b.textContent = letter;
      b.addEventListener('click', function () { selectSpellChoice(idx); });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '🏀', 'PICK A LETTER');
    if (state.s2Idx > 0) setTimeout(function () { AUDIO.playVoice(r.vo); }, 250);
  }

  function selectSpellChoice(idx) {
    if (state.busy || state.mode !== 's2') return;
    var r = DATA.SPELL_ROUNDS[state.s2Idx]; if (!r) return;
    AUDIO.unlock(); AUDIO.sfxTap();
    state.selectedChoice = r.options[idx];
    cueWord.innerHTML = formatMissingWord(r.word, r.missingIndex, r.options[idx]);
    Array.prototype.forEach.call(choiceTray.children, function (c, ci) { c.classList.toggle('selected', ci === idx); });
    spellBalls3D.forEach(function (sb, si) { sb.ring.material.opacity = (si === idx) ? 0.92 : 0.0; sb.group.scale.setScalar(si === idx ? 1.18 : 0.94); });
    setLaunchButton(true, '🏀', 'SPEAK CHECK · SHOOT!');
  }

  function startStage3() {
    resetStageVisuals();
    state.mode = 's3'; state.activeZone = 1; state.s3Idx = 0;
    AUDIO.setZone(1);
    activeBall.visible = true;
    cueCard.classList.remove('hidden'); eastHoop.visible = false; twinRig.visible = true; aimArrow.visible = true;
    camGoalPos.set(-8.6, 6.8, 0.2); camGoalLook.set(7.6, 2.5, 0.0);
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage3Round();
    state.currentVoiceId = 'intro_s3'; AUDIO.playVoice('intro_s3');
  }

  function loadStage3Round() {
    var r = DATA.PHONICS_ROUNDS[state.s3Idx];
    if (!r) {
      state.stageDone.s3 = true; renderStagePills();
      showZoneComplete(1);
      return;
    }
    state.selectedChoice = null; state.currentVoiceId = r.vo;
    roundChip.textContent = 'Stage 3 · OR-Phonics Twin Hoops (' + (state.s3Idx + 1) + ' / ' + DATA.PHONICS_ROUNDS.length + ')';
    cueImg.src = r.img; cueWord.innerHTML = r.word.replace(/OR/i, '<span class="blank">OR</span>'); cueHint.textContent = r.cue;
    cueCard.classList.remove('pop'); void cueCard.offsetWidth; cueCard.classList.add('pop');
    sportHoop.userData.aimHalo.material.opacity = 0.0; workHoop.userData.aimHalo.material.opacity = 0.0;
    aimArrow.position.set(2.2, 1.8, 0.0); aimArrow.lookAt(9.0, 3.6, 0.0); aimArrow.rotateY(-Math.PI / 2);

    choiceTray.innerHTML = '';
    [
      { id: 'sport', label: '🏀 SPORT (/ɔː/)', cls: 'hoop-sport' },
      { id: 'work',  label: '🛠️ WORK (/ɜː/)',  cls: 'hoop-work' }
    ].forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn ' + opt.cls; b.textContent = opt.label;
      b.addEventListener('click', function () { selectPhonicsChoice(opt.id); });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '🏀', 'AIM A HOOP');
    if (state.s3Idx > 0) setTimeout(function () { AUDIO.playVoice(r.vo); }, 250);
  }

  function selectPhonicsChoice(groupId) {
    if (state.busy || state.mode !== 's3') return;
    AUDIO.unlock(); AUDIO.sfxTap();
    AUDIO.playVoice(groupId === 'sport' ? 'anchor_sport' : 'anchor_work');
    state.selectedChoice = groupId;
    sportHoop.userData.aimHalo.material.opacity = (groupId === 'sport') ? 0.9 : 0.0;
    workHoop.userData.aimHalo.material.opacity = (groupId === 'work') ? 0.9 : 0.0;
    var targetZ = (groupId === 'sport') ? -3.7 : 3.7;
    aimArrow.position.set(2.2, 1.8, 0.0); aimArrow.lookAt(9.0, 3.7, targetZ); aimArrow.rotateY(-Math.PI / 2);
    var am = monsters[state.activeTeam];
    if (am) am.goalRotY = Math.PI / 2 + (groupId === 'sport' ? 0.34 : -0.34);
    Array.prototype.forEach.call(choiceTray.children, function (c, ci) {
      c.classList.toggle('selected', (ci === 0 && groupId === 'sport') || (ci === 1 && groupId === 'work'));
    });
    setLaunchButton(true, '🏀', 'SPEAK CHECK · SHOOT!');
  }

  // =========================================================================
  // 14. ZONE 2 STAGES (4: Live Action Park · 5: Broken-Track Bridge · 6: Spot Strange)
  // =========================================================================
  function startStage4() {
    resetStageVisuals();
    state.mode = 's4'; state.activeZone = 2; state.s4Idx = 0;
    AUDIO.setZone(2);
    activeBall.visible = false;
    cueCard.classList.remove('hidden');
    trainState.x = 14.5; trainState.goalX = 14.5; trainGroup.position.x = 14.5;

    camGoalPos.set(16.5, 9.8, -7.2);
    camGoalLook.set(24.0, 1.8, -23.0);
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage4Round();
    state.currentVoiceId = 'intro_s4'; AUDIO.playVoice('intro_s4');
  }

  function loadStage4Round() {
    var r = DATA.ACTION_ROUNDS[state.s4Idx];
    if (!r) {
      state.stageDone.s4 = true; renderStagePills();
      showToast('🚂 Full Steam Ahead! Next: Broken-Track Bridge!', false);
      var tok = state.stageToken;
      setTimeout(function () { if (state.stageToken === tok) startStage5(); }, 1550);
      return;
    }
    state.selectedChoice = null; state.currentVoiceId = r.vo;
    roundChip.textContent = 'Stage 4 · Live Action Park (' + (state.s4Idx + 1) + ' / ' + DATA.ACTION_ROUNDS.length + ')';
    cueImg.src = r.img; cueWord.textContent = r.prompt; cueHint.textContent = r.cue;
    cueCard.classList.remove('pop'); void cueCard.offsetWidth; cueCard.classList.add('pop');

    choiceTray.innerHTML = '';
    r.options.forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn'; b.textContent = opt;
      b.addEventListener('click', function () {
        if (state.busy) return;
        AUDIO.unlock(); AUDIO.sfxTap();
        state.selectedChoice = opt;
        Array.prototype.forEach.call(choiceTray.children, function (c) { c.classList.remove('selected'); });
        b.classList.add('selected');
        setLaunchButton(true, '🚂', 'SPEAK CHECK · CHUG!');
      });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '🚂', 'PICK THE ACTION');
  }

  function startStage5() {
    resetStageVisuals();
    state.mode = 's5'; state.activeZone = 2; state.s5Idx = 0; state.s5Placed = [];
    AUDIO.setZone(2);
    activeBall.visible = false;
    cueCard.classList.remove('hidden');
    trackStrip.classList.remove('hidden');
    camGoalPos.set(24.0, 9.4, -7.8);
    camGoalLook.set(24.2, 1.5, -20.5);
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage5Round();
    state.currentVoiceId = 'intro_s5'; AUDIO.playVoice('intro_s5');
  }

  function loadStage5Round() {
    var r = DATA.TRACK_ROUNDS[state.s5Idx];
    if (!r) {
      state.stageDone.s5 = true; renderStagePills();
      showToast('🌉 Bridge Rebuilt! Next: Spot What Is Strange!', false);
      var tok = state.stageToken;
      setTimeout(function () { if (state.stageToken === tok) startStage6(); }, 1550);
      return;
    }
    state.s5Placed = []; state.selectedChoice = null; state.currentVoiceId = r.vo;
    trainState.x = 15.8; trainState.goalX = 15.8; trainGroup.position.x = 15.8;
    bridgeTies3D.forEach(function (t) { t.mesh.visible = false; });

    roundChip.textContent = 'Stage 5 · Broken-Track Bridge (' + (state.s5Idx + 1) + ' / ' + DATA.TRACK_ROUNDS.length + ')';
    cueImg.src = r.img; cueWord.textContent = 'Build the Track!'; cueHint.textContent = '🗣️ Tap words in order, then read aloud!';
    cueCard.classList.remove('pop'); void cueCard.offsetWidth; cueCard.classList.add('pop');
    renderStage5UI();
  }

  function renderStage5UI() {
    var r = DATA.TRACK_ROUNDS[state.s5Idx]; if (!r) return;
    trackStrip.innerHTML = '';
    for (var i = 0; i < r.words.length; i++) {
      var sl = document.createElement('button');
      sl.type = 'button';
      var placedIdx = state.s5Placed[i];
      if (placedIdx !== undefined) {
        sl.className = 'track-slot filled';
        sl.textContent = r.scrambled[placedIdx];
        (function (slotPos) {
          sl.addEventListener('click', function () {
            if (state.busy) return;
            AUDIO.sfxTap();
            state.s5Placed.splice(slotPos, 1);
            syncBridgeTies();
            renderStage5UI();
          });
        })(i);
      } else {
        sl.className = 'track-slot';
        sl.textContent = (i + 1);
      }
      trackStrip.appendChild(sl);
    }

    choiceTray.innerHTML = '';
    r.scrambled.forEach(function (w, idx) {
      var used = state.s5Placed.indexOf(idx) !== -1;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn' + (used ? ' used' : '');
      b.textContent = w;
      b.addEventListener('click', function () {
        if (state.busy || used) return;
        AUDIO.unlock(); AUDIO.sfxTrackDrop();
        state.s5Placed.push(idx);
        syncBridgeTies();
        renderStage5UI();
      });
      choiceTray.appendChild(b);
    });

    var ready = (state.s5Placed.length === r.words.length);
    state.selectedChoice = ready ? state.s5Placed.map(function (idx) { return r.scrambled[idx]; }).join(' ') : null;
    setLaunchButton(ready, '🚂', ready ? 'SPEAK CHECK · DRIVE!' : 'BUILD TRACK (' + state.s5Placed.length + '/' + r.words.length + ')');
  }

  function syncBridgeTies() {
    var r = DATA.TRACK_ROUNDS[state.s5Idx]; if (!r) return;
    var ratio = state.s5Placed.length / r.words.length;
    var showCount = Math.round(ratio * bridgeTies3D.length);
    bridgeTies3D.forEach(function (t, i) {
      var shouldShow = i < showCount;
      if (shouldShow && !t.mesh.visible) {
        t.mesh.visible = true;
        t.dropT = 1.0;
      } else if (!shouldShow) {
        t.mesh.visible = false;
      }
    });
  }

  function startStage6() {
    resetStageVisuals();
    state.mode = 's6'; state.activeZone = 2; state.s6Idx = 0;
    AUDIO.setZone(2);
    activeBall.visible = false;
    cueCard.classList.remove('hidden');
    anomalyGroup.visible = true;
    trainState.x = 24.5; trainState.goalX = 24.5; trainGroup.position.x = 24.5;

    camGoalPos.set(14.0, 9.2, -10.5);
    camGoalLook.set(23.5, 2.8, -23.5);
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage6Round();
    state.currentVoiceId = 'intro_s6'; AUDIO.playVoice('intro_s6');
  }

  function loadStage6Round() {
    var r = DATA.STRANGE_ROUNDS[state.s6Idx];
    if (!r) {
      state.stageDone.s6 = true; renderStagePills();
      showZoneComplete(2);
      return;
    }
    state.selectedChoice = null; state.currentVoiceId = r.vo;
    roundChip.textContent = 'Stage 6 · Spot What Is Strange! (' + (state.s6Idx + 1) + ' / ' + DATA.STRANGE_ROUNDS.length + ')';
    cueImg.src = r.img; cueWord.textContent = 'What is strange?'; cueHint.textContent = r.cue;
    cueCard.classList.remove('pop'); void cueCard.offsetWidth; cueCard.classList.add('pop');

    Object.keys(anomalies3D).forEach(function (k) { anomalies3D[k].visible = (k === r.id); });

    setWorldPins([{
      pos: [r.pos[0], r.pos[1] + 2.1, r.pos[2]],
      cls: 'strange-tag',
      html: '❓ Click Strange Thing!',
      onClick: function () { selectStrangeChoice(r.id); }
    }]);

    choiceTray.innerHTML = '';
    DATA.STRANGE_ROUNDS.forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn'; b.textContent = opt.label;
      b.addEventListener('click', function () { selectStrangeChoice(opt.id); });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '✨', 'SPOT THE STRANGE THING');
  }

  function selectStrangeChoice(id) {
    if (state.busy || state.mode !== 's6') return;
    AUDIO.unlock(); AUDIO.sfxTap();
    state.selectedChoice = id;
    Array.prototype.forEach.call(choiceTray.children, function (c, ci) {
      c.classList.toggle('selected', DATA.STRANGE_ROUNDS[ci].id === id);
    });
    setLaunchButton(true, '✨', 'SPEAK CHECK · ZAP IT!');
  }

  // =========================================================================
  // 15. ZONE 3 STAGES (7: Casting · 8: Story Sequence · 9: Grand Curtain Call Finale)
  // =========================================================================
  function startStage7() {
    resetStageVisuals();
    state.mode = 's7'; state.activeZone = 3; state.s7Idx = 0;
    AUDIO.setZone(3); AUDIO.sfxCurtainUp();
    state.curtainTarget = 1.0;
    activeBall.visible = false;
    cueCard.classList.remove('hidden');
    setTheatreBackdrop('assets/art/card_theatre.webp');

    camGoalPos.copy(theatreToWorld(0.0, 6.4, 19.6));
    camGoalLook.copy(theatreToWorld(0.0, 4.1, 0.0));
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage7Round();
    state.currentVoiceId = 'intro_s7'; AUDIO.playVoice('intro_s7');
  }

  function loadStage7Round() {
    var r = DATA.CASTING_ROUNDS[state.s7Idx];
    if (!r) {
      state.stageDone.s7 = true; renderStagePills();
      showToast('🎭 Super Casting! Next: Festival Story Sequence!', false);
      var tok = state.stageToken;
      setTimeout(function () { if (state.stageToken === tok) startStage8(); }, 1550);
      return;
    }
    state.selectedChoice = null; state.currentVoiceId = r.vo;
    roundChip.textContent = 'Stage 7 · Costume & Role Casting (' + (state.s7Idx + 1) + ' / ' + DATA.CASTING_ROUNDS.length + ')';
    cueImg.src = r.img; cueWord.textContent = 'Who am I?'; cueHint.textContent = r.cue;
    cueCard.classList.remove('pop'); void cueCard.offsetWidth; cueCard.classList.add('pop');

    Object.keys(loadedStageProps).forEach(function (k) { loadedStageProps[k].visible = (k === r.id); });

    choiceTray.innerHTML = '';
    r.options.forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn'; b.textContent = opt;
      b.addEventListener('click', function () {
        if (state.busy) return;
        AUDIO.unlock(); AUDIO.sfxTap();
        state.selectedChoice = opt;
        Array.prototype.forEach.call(choiceTray.children, function (c) { c.classList.remove('selected'); });
        b.classList.add('selected');
        setLaunchButton(true, '🎭', 'SPEAK CHECK · SPOTLIGHT!');
      });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '🎭', 'PICK THE ROLE');
  }

  function startStage8() {
    resetStageVisuals();
    state.mode = 's8'; state.activeZone = 3; state.s8Step = 0; state.s8Done = {};
    AUDIO.setZone(3);
    state.curtainTarget = 1.0;
    activeBall.visible = false;
    cueCard.classList.remove('hidden');
    setTheatreBackdrop('assets/art/story_1_home.webp');

    camGoalPos.copy(theatreToWorld(0.0, 6.4, 19.8));
    camGoalLook.copy(theatreToWorld(0.0, 4.1, -0.6));
    positionMonstersForMode(); renderStagePills(); renderTeams();
    loadStage8Round();
    state.currentVoiceId = 'intro_s8'; AUDIO.playVoice('intro_s8');
  }

  var STORY_SCRAMBLE_ORDER = [2, 0, 3, 1];
  function loadStage8Round() {
    var target = DATA.STORY_STEPS[state.s8Step];
    if (!target) {
      state.stageDone.s8 = true; renderStagePills();
      showToast('🎬 Story Complete! Time for Grand Curtain Call!', false);
      var tok = state.stageToken;
      setTimeout(function () { if (state.stageToken === tok) startStage9(); }, 1650);
      return;
    }
    state.selectedChoice = null; state.currentVoiceId = target.vo;
    roundChip.textContent = 'Stage 8 · Festival Story Sequence · Pick #' + target.step + ' (' + target.tag + ')';
    cueImg.src = 'assets/art/card_theatre.webp';
    cueWord.innerHTML = 'STEP ' + target.step + ': <span class="blank">' + target.tag + '</span>';
    cueHint.textContent = target.cue;

    choiceTray.innerHTML = '';
    STORY_SCRAMBLE_ORDER.forEach(function (idx) {
      var st = DATA.STORY_STEPS[idx];
      var used = !!state.s8Done[st.step];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'story-card-btn' + (used ? ' used' : '');
      b.innerHTML = '<img src="' + st.img + '" alt="' + st.short + '"><span>' + st.short + '</span>';
      b.addEventListener('click', function () {
        if (state.busy || used) return;
        AUDIO.unlock(); AUDIO.sfxTap();
        state.selectedChoice = st.step;
        cueImg.src = st.img;
        setTheatreBackdrop(st.img);
        Array.prototype.forEach.call(choiceTray.children, function (c) { c.classList.remove('selected'); });
        b.classList.add('selected');
        setLaunchButton(true, '🎬', 'SPEAK CHECK · ACTION!');
      });
      choiceTray.appendChild(b);
    });
    setLaunchButton(false, '🎬', 'PICK "' + target.tag + '" SCENE');
  }

  function startStage9() {
    resetStageVisuals();
    state.mode = 's9'; state.activeZone = 3;
    state.stageDone.s9 = true;
    AUDIO.setZone(3); AUDIO.sfxFanfare(); AUDIO.playVoice('win_finale');
    state.curtainTarget = 1.0;
    state.spotlightBoost = 1.0;
    activeBall.visible = false;
    bottomDock.classList.add('hidden');
    finaleTrophyHolder.visible = true;
    setTheatreBackdrop('assets/art/story_4_curtain_call.webp');

    camGoalPos.copy(theatreToWorld(0.0, 6.0, 18.8));
    camGoalLook.copy(theatreToWorld(0.0, 3.8, 0.4));
    positionMonstersForMode(); renderStagePills();
    monsters.forEach(function (m) { m.celebrateT = 6.0; });
    roundChip.textContent = '🏆 Grand Curtain Call Finale · Standing Ovation!';

    // Celebrate with continuous fireworks over Grand Theatre!
    spawnConfettiBurst(theatreToWorld(0, 6.2, 1.5), 65);
    spawnConfettiBurst(theatreToWorld(-4.5, 5.5, 2.0), 45);
    spawnConfettiBurst(theatreToWorld(4.5, 5.5, 2.0), 45);

    showZoneComplete(3);
  }

  function showZoneComplete(zoneNum) {
    bottomDock.classList.add('hidden');
    cueCard.classList.add('hidden');
    trackStrip.classList.add('hidden');
    victoryBanner.classList.remove('hidden');

    if (zoneNum === 1) {
      victoryCrown.textContent = '🏀';
      victoryTitle.textContent = 'Zone 1 Complete!';
      victorySub.textContent = 'Sunny Basketball Court Mastered! Next stop: Festival Park!';
      AUDIO.sfxFanfare(); AUDIO.playVoice('win_zone1');
      spawnConfettiBurst(new T3.Vector3(0, 4.8, 0), 60);
    } else if (zoneNum === 2) {
      victoryCrown.textContent = '🚂';
      victoryTitle.textContent = 'Zone 2 Complete!';
      victorySub.textContent = 'Festival Park & Express Train Mastered! Curtain up at the Grand Theatre!';
      AUDIO.sfxFanfare(); AUDIO.playVoice('win_zone2');
      spawnConfettiBurst(new T3.Vector3(24, 5.2, -25), 65);
    } else {
      victoryCrown.textContent = '🏆';
      victoryTitle.textContent = 'Grand Curtain Call!';
      victorySub.textContent = 'Bravo! Standing ovation — you completed all 3 zones!';
    }

    victoryScores.innerHTML = '';
    DATA.TEAMS.forEach(function (t, i) {
      var p = document.createElement('div');
      p.className = 'team-pill ' + t.css + ' active';
      p.innerHTML = '<span class="team-name">' + t.name + '</span><span class="team-score">' + state.scores[i] + '</span>';
      victoryScores.appendChild(p);
    });

    victoryActions.innerHTML = '';
    if (zoneNum === 1) {
      var bNext2 = document.createElement('button');
      bNext2.type = 'button'; bNext2.className = 'launch-btn green'; bNext2.textContent = '🚂 GO TO ZONE 2: FESTIVAL PARK!';
      bNext2.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxTrainChug(); startStage4(); });
      victoryActions.appendChild(bNext2);
    } else if (zoneNum === 2) {
      var bNext3 = document.createElement('button');
      bNext3.type = 'button'; bNext3.className = 'launch-btn primary'; bNext3.textContent = '🎭 GO TO ZONE 3: GRAND THEATRE!';
      bNext3.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxCurtainUp(); startStage7(); });
      victoryActions.appendChild(bNext3);
    } else {
      var bAgain = document.createElement('button');
      bAgain.type = 'button'; bAgain.className = 'launch-btn green'; bAgain.textContent = '🎉 More Fireworks!';
      bAgain.addEventListener('click', function () {
        AUDIO.sfxApplause();
        monsters.forEach(function (m) { m.celebrateT = 2.8; });
        spawnConfettiBurst(theatreToWorld(0, 6.2, 1.5), 60);
      });
      victoryActions.appendChild(bAgain);
    }
    var bMap = document.createElement('button');
    bMap.type = 'button'; bMap.className = 'launch-btn coral'; bMap.textContent = '🗺️ 3D Park Map';
    bMap.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxTap(); enterMap(); });
    victoryActions.appendChild(bMap);
  }

  // =========================================================================
  // 16. UNIFIED SPEAK-TO-ACT PAYOFF HANDLER (ALL 9 STAGES!)
  // =========================================================================
  function awardAndAdvance(points, burstPos, nextFn, cheerKind, toastMsg) {
    var myToken = state.stageToken;
    var am = monsters[state.activeTeam];
    state.scores[state.activeTeam] += points;
    if (juice) {
      if (juice.hitstop) juice.hitstop(40);
      if (juice.shakeCamera) juice.shakeCamera(0.28, 0.24);
      if (juice.popupScore) juice.popupScore(burstPos, '+' + points + '!', '#ffe066', camera);
    }
    spawnConfettiBurst(burstPos, 46);
    if (am) am.celebrateT = 1.4;
    showToast(toastMsg + ' +' + points + ' ' + DATA.TEAMS[state.activeTeam].name + '!', false);
    state.activeTeam = (state.activeTeam + 1) % DATA.TEAMS.length;
    renderTeams();
    positionMonstersForMode();
    AUDIO.playCheer(cheerKind);
    setTimeout(function () {
      if (state.stageToken !== myToken) return;
      state.busy = false;
      nextFn();
    }, 1450);
  }

  function softTryAgain(msg) {
    var myToken = state.stageToken;
    var am = monsters[state.activeTeam];
    AUDIO.sfxRimOut(); AUDIO.playTry();
    if (am) am.wobbleT = 0.9;
    showToast(msg || 'Almost! Try again!', true);
    setTimeout(function () {
      if (state.stageToken !== myToken) return;
      state.busy = false;
      state.selectedChoice = null;
      Array.prototype.forEach.call(choiceTray.children, function (c) { c.classList.remove('selected'); });
      if (state.mode === 's5') { state.s5Placed = []; syncBridgeTies(); renderStage5UI(); }
      else setLaunchButton(false, launchIcon.textContent, 'TRY AGAIN');
    }, 1150);
  }

  function fireAction() {
    if (state.busy || state.selectedChoice === null) return;
    AUDIO.unlock();
    var myToken = state.stageToken;

    // ZONE 1: Real Parabolic 3D Basketball Shot Physics (Stages 1, 2, 3)
    if (state.mode === 's1' || state.mode === 's2' || state.mode === 's3') {
      state.busy = true; setLaunchButton(false, '🏀', 'IN THE AIR!');
      AUDIO.sfxShoot();
      var am = monsters[state.activeTeam];
      var startPos = am ? am.holder.position.clone().add(new T3.Vector3(0.9, 1.9, 0)) : new T3.Vector3(1.2, 1.9, 0);
      if (am && am.mesh && juice && juice.squashStretch) juice.squashStretch(am.mesh, 1.18, 0.85, 1.18, 0.24);

      var targetPos = new T3.Vector3(), targetHoop = null, isCorrect = false, onDoneCorrect = null;
      if (state.mode === 's1') {
        var z = DATA.COURT_ZONES[state.s1Idx];
        isCorrect = (state.selectedChoice === z.id);
        if (z.isHoop) { targetHoop = eastHoop; eastHoop.userData.getRimWorldPos(targetPos); }
        else targetPos.set(z.pos[0], 0.44, z.pos[2]);
        onDoneCorrect = function () { state.s1Found[z.id] = true; state.s1Idx++; loadStage1Round(); };
      } else if (state.mode === 's2') {
        var r2 = DATA.SPELL_ROUNDS[state.s2Idx];
        isCorrect = (state.selectedChoice === r2.answer);
        targetHoop = eastHoop; eastHoop.userData.getRimWorldPos(targetPos);
        onDoneCorrect = function () { cueWord.innerHTML = formatMissingWord(r2.word, r2.missingIndex, r2.answer); state.s2Idx++; loadStage2Round(); };
      } else {
        var r3 = DATA.PHONICS_ROUNDS[state.s3Idx];
        isCorrect = (state.selectedChoice === r3.group);
        targetHoop = (state.selectedChoice === 'sport') ? sportHoop : workHoop;
        targetHoop.userData.getRimWorldPos(targetPos);
        onDoneCorrect = function () { state.s3Idx++; loadStage3Round(); };
      }

      if (!isCorrect && targetHoop) { targetPos.x -= 0.52; targetPos.y += 0.25; }
      shotAnim.active = true; shotAnim.t = 0; shotAnim.dur = 0.88;
      shotAnim.start.copy(startPos); shotAnim.end.copy(targetPos);
      shotAnim.peakY = Math.max(startPos.y, targetPos.y) + 3.4;
      shotAnim.correct = isCorrect; shotAnim.targetHoop = targetHoop;
      shotAnim.isRimOutBounce = false; shotAnim.impacted = false;
      shotAnim.onImpact = function () {
        if (state.stageToken !== myToken) return;
        if (isCorrect) {
          AUDIO.sfxSwish();
          if (targetHoop) targetHoop.userData.swishAnim = 1.0;
          awardAndAdvance(10, targetPos, onDoneCorrect, 'court', '🏀 SWISH!');
        } else {
          if (targetHoop) targetHoop.userData.rimShake = 1.0;
          shotAnim.isRimOutBounce = true;
          shotAnim.bounceVel.set(-4.6, 3.8, (Math.random() - 0.5) * 5.2);
          softTryAgain('Ooh, off the rim! Try again!');
          setTimeout(function () { if (state.stageToken === myToken) shotAnim.active = false; }, 1100);
        }
      };
      return;
    }

    // ZONE 2: Stage 4 (Live Action Park — Train Chugs Forward!)
    if (state.mode === 's4') {
      state.busy = true; setLaunchButton(false, '🚂', 'CHUGGING!');
      var r4 = DATA.ACTION_ROUNDS[state.s4Idx];
      if (state.selectedChoice === r4.answer) {
        AUDIO.sfxTrainChug();
        trainState.goalX = Math.min(34, trainState.x + 4.8);
        for (var sp = 0; sp < 5; sp++) setTimeout(spawnSteamPuff, sp * 140);
        awardAndAdvance(10, new T3.Vector3(trainState.goalX, 3.2, -19.2), function () { state.s4Idx++; loadStage4Round(); }, 'train', '🚂 CHOO CHOO!');
      } else {
        softTryAgain('Look closely at the picture and try again!');
      }
      return;
    }

    // ZONE 2: Stage 5 (Broken-Track Bridge — Train Drives Across Rebuilt Bridge!)
    if (state.mode === 's5') {
      state.busy = true; setLaunchButton(false, '🚂', 'CROSSING!');
      var r5 = DATA.TRACK_ROUNDS[state.s5Idx];
      if (state.selectedChoice === r5.words.join(' ')) {
        AUDIO.sfxTrainChug();
        trainState.goalX = 32.8;
        for (var sp2 = 0; sp2 < 8; sp2++) setTimeout(spawnSteamPuff, sp2 * 130);
        awardAndAdvance(15, new T3.Vector3(24.5, 3.2, -19.2), function () { state.s5Idx++; loadStage5Round(); }, 'train', '🌉 BRIDGE CROSSED!');
      } else {
        softTryAgain('Check the word order and rebuild the track!');
      }
      return;
    }

    // ZONE 2: Stage 6 (Spot What's Strange — Magic Golden Beam Zaps the 3D Anomaly!)
    if (state.mode === 's6') {
      state.busy = true; setLaunchButton(false, '✨', 'ZAPPING!');
      var r6 = DATA.STRANGE_ROUNDS[state.s6Idx];
      if (state.selectedChoice === r6.id) {
        AUDIO.sfxMagicZap();
        var am6 = monsters[state.activeTeam];
        var fromP = am6 ? am6.holder.position.clone().add(new T3.Vector3(0, 1.8, 0)) : new T3.Vector3(22, 1.8, -22);
        var toP = new T3.Vector3(r6.pos[0], r6.pos[1], r6.pos[2]);
        var mid = fromP.clone().lerp(toP, 0.5);
        zapBeam.position.copy(mid);
        zapBeam.scale.set(1, fromP.distanceTo(toP), 1);
        zapBeam.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), toP.clone().sub(fromP).normalize());
        zapBeam.visible = true; zapLife = 0.65;
        if (anomalies3D[r6.id]) anomalies3D[r6.id].visible = false;
        awardAndAdvance(10, toP, function () { state.s6Idx++; loadStage6Round(); }, 'train', '✨ ANOMALY FIXED!');
      } else {
        softTryAgain('Look closely at the park — what is strange?');
      }
      return;
    }

    // ZONE 3: Stage 7 (Costume & Role Casting — Spotlight Flare & Applause!)
    if (state.mode === 's7') {
      state.busy = true; setLaunchButton(false, '🎭', 'SPOTLIGHT!');
      var r7 = DATA.CASTING_ROUNDS[state.s7Idx];
      if (state.selectedChoice === r7.answer) {
        AUDIO.sfxApplause();
        state.spotlightBoost = 1.0;
        awardAndAdvance(10, theatreToWorld(0, 3.8, 1.2), function () { state.s7Idx++; loadStage7Round(); }, 'theatre', '🎭 BRAVO!');
      } else {
        softTryAgain('Look at the costume on stage and try again!');
      }
      return;
    }

    // ZONE 3: Stage 8 (Festival Story Sequence — First / Next / Then / Finally!)
    if (state.mode === 's8') {
      state.busy = true; setLaunchButton(false, '🎬', 'ACTION!');
      var targetStep = DATA.STORY_STEPS[state.s8Step];
      if (state.selectedChoice === targetStep.step) {
        AUDIO.sfxApplause();
        state.spotlightBoost = 1.0;
        state.s8Done[targetStep.step] = true;
        awardAndAdvance(10, theatreToWorld(0, 4.2, 1.0), function () { state.s8Step++; loadStage8Round(); }, 'theatre', '🎬 ' + targetStep.tag + '!');
      } else {
        softTryAgain('Think about what happened ' + targetStep.tag.toLowerCase() + '!');
      }
    }
  }

  // =========================================================================
  // 17. DIRECT 3D CANVAS RAYCASTING (CLICK COURT, PARK, THEATRE, HOOPS, BALLS, ANOMALIES!)
  // =========================================================================
  var raycaster = new T3.Raycaster();
  var pointerNdc = new T3.Vector2();
  canvas.addEventListener('pointerdown', function (ev) {
    AUDIO.unlock();
    var rect = canvas.getBoundingClientRect();
    pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    var hits = raycaster.intersectObjects(scene.children, true);
    for (var i = 0; i < hits.length; i++) {
      var ud = hits[i].object.userData || {};
      if (state.mode === 'map') {
        if (ud.pickRole === 'zone1-court') { AUDIO.sfxWhistle(); startStage1(); return; }
        if (ud.pickRole === 'zone2-park') { AUDIO.sfxTrainChug(); startStage4(); return; }
        if (ud.pickRole === 'zone3-theatre') { AUDIO.sfxCurtainUp(); startStage7(); return; }
      }
      if (state.mode === 's2' && ud.pickRole === 'spell-ball') { selectSpellChoice(ud.slotIndex); return; }
      if (state.mode === 's3' && ud.pickRole === 'phonics-hoop') { selectPhonicsChoice(ud.pickValue); return; }
      if (state.mode === 's6' && ud.pickRole === 'anomaly') { selectStrangeChoice(ud.pickValue); return; }
    }
  });

  // =========================================================================
  // 18. UI BUTTONS & KEYBOARD SHORTCUTS
  // =========================================================================
  btnMap.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxTap(); enterMap(); });
  btnEnterZ1.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxWhistle(); startStage1(); });
  btnEnterZ2.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxTrainChug(); startStage4(); });
  btnEnterZ3.addEventListener('click', function () { AUDIO.unlock(); AUDIO.sfxCurtainUp(); startStage7(); });
  btnCueVoice.addEventListener('click', function () { AUDIO.unlock(); AUDIO.playVoice(state.currentVoiceId); });
  btnLaunch.addEventListener('click', fireAction);

  btnSlow.addEventListener('click', function () {
    AUDIO.unlock();
    var on = AUDIO.toggleSlow();
    btnSlow.classList.toggle('active', on);
    btnSlow.textContent = on ? '🐢 Slow ON' : '🐢 Slow';
    AUDIO.playVoice(state.currentVoiceId, { slow: on });
  });
  btnBgm.addEventListener('click', function () { AUDIO.unlock(); btnBgm.classList.toggle('muted', !AUDIO.toggleBgm()); });
  btnSfx.addEventListener('click', function () {
    var muted = AUDIO.toggleMute();
    btnSfx.classList.toggle('muted', muted);
    btnSfx.textContent = muted ? '🔇' : '🔊';
  });
  btnFs.addEventListener('click', function () {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    } else if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
  });

  window.addEventListener('keydown', function (ev) {
    if (ev.code === 'Space' || ev.code === 'Enter') {
      if (state.mode === 'map') { ev.preventDefault(); AUDIO.unlock(); AUDIO.sfxWhistle(); startStage1(); }
      else if (!btnLaunch.disabled) { ev.preventDefault(); fireAction(); }
    } else if (ev.key >= '1' && ev.key <= '9') {
      AUDIO.unlock(); launchStageById('s' + ev.key);
    } else if (ev.key === 'm' || ev.key === 'M') { AUDIO.unlock(); enterMap(); }
    else if (ev.key === 'r' || ev.key === 'R') { AUDIO.unlock(); AUDIO.playVoice(state.currentVoiceId); }
  });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // =========================================================================
  // 19. MAIN 60FPS ANIMATION LOOP
  // =========================================================================
  var clock = new T3.Clock();
  var elapsed = 0;

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    if (juice && juice.update) juice.update(dt, elapsed, camera);
    if (atmosphere && atmosphere.update) atmosphere.update(elapsed, camera);

    if (state.mode === 'map') {
      camGoalPos.set(
        -18 + Math.sin(elapsed * 0.22) * 4.5,
        24.5 + Math.sin(elapsed * 0.35) * 0.9,
        31.5 + Math.cos(elapsed * 0.22) * 3.5
      );
    }
    camera.position.lerp(camGoalPos, 1 - Math.exp(-3.8 * dt));
    camCurLook.lerp(camGoalLook, 1 - Math.exp(-4.4 * dt));
    camera.lookAt(camCurLook);

    // Monsters movement, breathing, victory jumps & wobbles
    monsters.forEach(function (m, i) {
      m.holder.position.lerp(m.goalPos, 1 - Math.exp(-5.5 * dt));
      var dy = m.goalRotY - m.holder.rotation.y;
      m.holder.rotation.y += dy * Math.min(1, dt * 6);
      if (m.mesh) {
        if (m.celebrateT > 0) {
          m.celebrateT = Math.max(0, m.celebrateT - dt);
          m.mesh.position.y = Math.abs(Math.sin(elapsed * 10.5 + i * 0.7)) * 1.25;
          m.mesh.rotation.y += dt * 6.5;
        } else if (m.wobbleT > 0) {
          m.wobbleT = Math.max(0, m.wobbleT - dt);
          m.mesh.position.y = 0;
          m.mesh.rotation.z = Math.sin(elapsed * 26) * 0.22 * m.wobbleT;
          m.mesh.rotation.y *= 0.85;
        } else {
          m.mesh.position.y = Math.abs(Math.sin(elapsed * 3.1 + i * 1.3)) * 0.16;
          m.mesh.rotation.z *= 0.85;
          m.mesh.rotation.y *= 0.88;
        }
      }
    });

    // Zone 1 Basketball Physics
    if (activeBall.visible) {
      if (shotAnim.active) {
        if (!shotAnim.impacted) {
          shotAnim.t += dt / shotAnim.dur;
          var u = Math.min(1, shotAnim.t);
          var x = T3.MathUtils.lerp(shotAnim.start.x, shotAnim.end.x, u);
          var z = T3.MathUtils.lerp(shotAnim.start.z, shotAnim.end.z, u);
          var baseLineY = T3.MathUtils.lerp(shotAnim.start.y, shotAnim.end.y, u);
          var arcOffset = 4 * (shotAnim.peakY - Math.max(shotAnim.start.y, shotAnim.end.y)) * u * (1 - u);
          activeBall.position.set(x, baseLineY + arcOffset, z);
          activeBall.rotation.z -= dt * 11.5; activeBall.rotation.x += dt * 4.2;
          if (u >= 1) { shotAnim.impacted = true; if (shotAnim.onImpact) shotAnim.onImpact(); }
        } else if (shotAnim.isRimOutBounce) {
          shotAnim.bounceVel.y -= 15.5 * dt;
          activeBall.position.addScaledVector(shotAnim.bounceVel, dt);
          if (activeBall.position.y < 0.42) {
            activeBall.position.y = 0.42;
            shotAnim.bounceVel.y = Math.abs(shotAnim.bounceVel.y) * 0.56;
            shotAnim.bounceVel.x *= 0.82; shotAnim.bounceVel.z *= 0.82;
          }
          activeBall.rotation.z += dt * 8;
        } else {
          activeBall.position.y = Math.max(0.42, activeBall.position.y - 7.4 * dt);
          activeBall.rotation.y += dt * 4.5;
        }
      } else {
        var am = monsters[state.activeTeam];
        var bx = am ? am.holder.position.x + 1.15 : 1.4;
        var bz = am ? am.holder.position.z + 0.95 : 0.9;
        activeBall.position.set(bx, 0.42 + Math.abs(Math.sin(elapsed * 4.4)) * 1.15, bz);
        activeBall.rotation.z -= dt * 3.5;
      }
    }

    // Zone 1 Hoop Net Ripples
    allHoops.forEach(function (hoop) {
      var ud = hoop.userData;
      if (ud.swishAnim > 0) {
        ud.swishAnim = Math.max(0, ud.swishAnim - dt * 1.35);
        var p = ud.swishAnim;
        ud.netRings.forEach(function (nr, idx) {
          var wave = Math.sin((1 - p) * 18 - idx * 0.9) * p;
          var flare = 1 + (0.28 * Math.sin(p * Math.PI)) + wave * 0.14;
          nr.scale.set(flare, flare, 1); nr.position.x = wave * 0.14;
        });
      } else {
        ud.netRings.forEach(function (nr) { nr.scale.lerp(new T3.Vector3(1, 1, 1), 0.18); nr.position.x *= 0.85; });
      }
      if (ud.rimShake > 0) {
        ud.rimShake = Math.max(0, ud.rimShake - dt * 2.2);
        ud.rimGroup.rotation.z = Math.sin(elapsed * 45) * 0.14 * ud.rimShake;
      } else ud.rimGroup.rotation.z *= 0.8;
    });

    if (courtBeacon.visible) {
      beaconRing.rotation.z += dt * 0.9;
      beaconRing.scale.setScalar(1 + Math.sin(elapsed * 4.2) * 0.08);
      beaconBeam.material.opacity = 0.18 + Math.sin(elapsed * 3.5) * 0.08;
    }
    if (spellRackGroup.visible) {
      spellBalls3D.forEach(function (sb, idx) {
        sb.ball.position.y = 1.05 + Math.sin(elapsed * 2.6 + idx * 1.1) * 0.14;
        sb.ball.rotation.y = 0.42 + Math.sin(elapsed * 1.1 + idx) * 0.18;
      });
    }
    if (aimArrow.visible) aimArrow.scale.setScalar(1 + Math.sin(elapsed * 5.2) * 0.08);

    // Zone 2 Red Festival Train chugging + wheel spin + steam puffs + dropping track ties
    var trainDiff = trainState.goalX - trainState.x;
    if (Math.abs(trainDiff) > 0.04) {
      var move = Math.sign(trainDiff) * Math.min(Math.abs(trainDiff), dt * 6.5);
      trainState.x += move;
      trainGroup.position.x = trainState.x;
      trainGroup.position.y = 0.20 + Math.abs(Math.sin(elapsed * 18)) * 0.08;
      trainWheels.forEach(function (w) { w.rotation.y -= move * 2.2; });
    } else {
      trainGroup.position.y = 0.20;
    }
    trainState.steamT += dt;
    if (state.activeZone === 2 && trainState.steamT > 0.72) {
      trainState.steamT = 0; spawnSteamPuff();
    }
    for (var si = steamPuffs.length - 1; si >= 0; si--) {
      var sp = steamPuffs[si];
      sp.life -= dt;
      sp.mesh.position.y += sp.vy * dt;
      sp.mesh.position.x += sp.vx * dt;
      sp.mesh.scale.addScalar(dt * 0.9);
      sp.mesh.material.opacity = Math.max(0, sp.life * 0.65);
      if (sp.life <= 0) { scene.remove(sp.mesh); sp.mesh.geometry.dispose(); sp.mesh.material.dispose(); steamPuffs.splice(si, 1); }
    }
    bridgeTies3D.forEach(function (t) {
      if (t.dropT > 0) {
        t.dropT = Math.max(0, t.dropT - dt * 3.8);
        t.mesh.position.y = t.baseY + t.dropT * t.dropT * 3.2;
      }
    });

    // Zone 2 Animated 3D Silly Anomalies + Magic Zap Beam
    if (anomalyGroup.visible) {
      fishG.position.y = 5.4 + Math.sin(elapsed * 2.8) * 0.55;
      fishG.rotation.y = elapsed * 0.9;
      snowG.rotation.z = Math.sin(elapsed * 3.2) * 0.10;
      guitarHolder.rotation.y = elapsed * 1.4;
      guitarHolder.position.y = 3.2 + Math.sin(elapsed * 3.8) * 0.25;
      crownHolder.rotation.y = elapsed * 1.2;
      crownHolder.position.y = 4.9 + Math.sin(elapsed * 3.0) * 0.35;
    }
    if (zapLife > 0) {
      zapLife -= dt;
      zapBeam.material.opacity = Math.max(0, zapLife * 1.4);
      if (zapLife <= 0) zapBeam.visible = false;
    }

    // Zone 3 Animated 3D Velvet Curtains + Sweeping Stage Spotlights + Stage Props
    state.curtainOpen += (state.curtainTarget - state.curtainOpen) * Math.min(1, dt * 3.4);
    var cOpen = state.curtainOpen;
    curtainLeft.position.x = -3.1 - cOpen * 2.9;
    curtainLeft.scale.x = 1.0 - cOpen * 0.48;
    curtainRight.position.x = 3.1 + cOpen * 2.9;
    curtainRight.scale.x = 1.0 - cOpen * 0.48;

    state.spotlightBoost = Math.max(0, state.spotlightBoost - dt * 0.8);
    spotConeL.rotation.z = -0.32 + Math.sin(elapsed * 1.4) * 0.14;
    spotConeR.rotation.z = 0.32 - Math.sin(elapsed * 1.4) * 0.14;
    spotConeL.material.opacity = 0.14 + state.spotlightBoost * 0.18;
    spotConeR.material.opacity = 0.14 + state.spotlightBoost * 0.18;

    stagePropHolder.rotation.y = elapsed * 1.1;
    stagePropHolder.position.y = 1.8 + Math.sin(elapsed * 2.8) * 0.22;
    if (finaleTrophyHolder.visible) {
      finaleTrophyHolder.rotation.y = elapsed * 1.5;
      finaleTrophyHolder.position.y = 1.85 + Math.sin(elapsed * 3.6) * 0.25;
    }

    floaters.forEach(function (f) {
      f.obj.position.y = f.baseY + Math.sin(elapsed * f.speed + f.phase) * f.amp;
      f.obj.rotation.y += dt * 0.12;
    });

    for (var bi = bursts.length - 1; bi >= 0; bi--) {
      var b = bursts[bi];
      b.life -= dt; b.vel.y -= 11.5 * dt;
      b.mesh.position.addScaledVector(b.vel, dt);
      b.mesh.rotation.x += b.rotSpd * dt; b.mesh.rotation.y += b.rotSpd * 0.7 * dt;
      if (b.life < 0.35) b.mesh.scale.setScalar(Math.max(0.01, b.life / 0.35));
      if (b.life <= 0) { scene.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose(); bursts.splice(bi, 1); }
    }

    updateWorldPins();
    renderer.render(scene, camera);
  }

  window.__CTC3D = {
    enterMap: enterMap,
    launchStageById: launchStageById,
    selectSpellChoice: selectSpellChoice,
    selectPhonicsChoice: selectPhonicsChoice,
    selectStrangeChoice: selectStrangeChoice,
    fireAction: fireAction,
    state: state
  };

  renderTeams();
  enterMap();
  animate();
})();
