(function () {
  'use strict';
  var Kit = window.Kit;
  var el = Kit.el;
  var app = document.getElementById('app');

  var MODES = {
    island: { id: 'island', icon: '🏝️', title: 'Island Hop Live', stageClass: 'mode-island' },
    scan: { id: 'scan', icon: '🪪', title: 'Card Scan Quiz', stageClass: 'mode-scan' },
    slice: { id: 'slice', icon: '🍉', title: 'Fruit & Word Slice', stageClass: 'mode-slice' }
  };

  var gameId = Kit.param('game') || 'island';
  if (!MODES[gameId]) gameId = 'island';
  var M = MODES[gameId];

  var ISLANDS = [
    { icon: '🌴', name: 'Palm Cove' },
    { icon: '🐚', name: 'Shell Reef' },
    { icon: '⭐', name: 'Star Lagoon' },
    { icon: '🪸', name: 'Coral Peak' },
    { icon: '🏴‍☠️', name: 'Treasure Bay' }
  ];

  var state = {
    packs: [],
    packId: Kit.param('set') || Kit.param('pack') || '',
    roomCode: Kit.param('code') || String(Math.floor(100000 + Math.random() * 900000)),
    questions: [],
    qIdx: 0,
    score: 0,
    islandStep: 0,
    locked: false,
    tally: [0, 0, 0, 0],
    revealed: false,
    camActive: false,
    stream: null,
    rafId: 0
  };

  function fallbackQuestions() {
    return [
      { q: 'Which animal has a long trunk?', a: ['Elephant', 'Frog', 'Duck', 'Cat'], ok: 0 },
      { q: 'What do you wear on rainy days?', a: ['Swimsuit', 'Raincoat', 'Sunglasses', 'Shorts'], ok: 1 },
      { q: 'Which one can fly?', a: ['Turtle', 'Whale', 'Butterfly', 'Crab'], ok: 2 },
      { q: 'Where do you read many books?', a: ['Kitchen', 'Garage', 'Garden', 'Library'], ok: 3 },
      { q: 'Yesterday, I ___ to the park.', a: ['go', 'went', 'going', 'goes'], ok: 1 }
    ];
  }

  function normalizeQuestion(raw) {
    if (!raw) return null;
    var q = raw.q || raw.prompt || raw.question || raw.text || '';
    if (!q) return null;
    // Standard EAA / Game Maker format: { q, a: "correct", w: ["wrong1", "wrong2", "wrong3"] }
    if (typeof raw.a === 'string' && Array.isArray(raw.w) && raw.w.length >= 1) {
      var right = String(raw.a);
      var pool = Kit.shuffle([right].concat(raw.w.slice(0, 3).map(String)));
      return { q: String(q), a: pool, ok: Math.max(0, pool.indexOf(right)) };
    }
    var choices = Array.isArray(raw.a) ? raw.a : (raw.choices || raw.options || []);
    var ok = typeof raw.ok === 'number' ? raw.ok : (typeof raw.correct === 'number' ? raw.correct : 0);
    if (!Array.isArray(choices) || choices.length < 2) return null;
    return { q: String(q), a: choices.slice(0, 4).map(String), ok: Math.max(0, Math.min(choices.length - 1, ok)) };
  }

  function loadPacks() {
    if (!Kit.questions || !Kit.questions.all) {
      state.questions = fallbackQuestions();
      return Promise.resolve();
    }
    return Kit.questions.all().then(function (packs) {
      state.packs = Array.isArray(packs) ? packs : [];
      var chosen = null;
      if (state.packId) {
        chosen = state.packs.find(function (p) { return p.id === state.packId; });
      }
      if (!chosen) {
        chosen = state.packs.find(function (p) { return Array.isArray(p.items || p.questions) && (p.items || p.questions).length >= 3; }) || state.packs[0];
      }
      if (chosen) {
        state.packId = chosen.id;
        var rawList = chosen.items || chosen.questions || [];
        var norm = rawList.map(normalizeQuestion).filter(Boolean);
        state.questions = norm.length ? Kit.shuffle(norm) : fallbackQuestions();
      } else {
        state.questions = fallbackQuestions();
      }
    }).catch(function () {
      state.questions = fallbackQuestions();
    });
  }

  Kit.topbar({
    home: '../index.html',
    homeLabel: 'Games',
    title: M.icon + ' ' + M.title,
    onEdit: function () {
      if (Kit.studio) Kit.studio({ tab: 'questions' }, function () { loadPacks().then(renderAll); });
    },
    editLabel: '🎨 Questions'
  });

  var rootWrap = el('div', { class: 'lv-wrap' });
  app.appendChild(rootWrap);

  var hud = el('div', { class: 'lv-hud' });
  var hudLeft = el('div', { class: 'lv-hud-left' });
  var hudRight = el('div', { class: 'lv-hud-right' });
  hud.appendChild(hudLeft);
  hud.appendChild(hudRight);
  rootWrap.appendChild(hud);

  var stage = el('section', { class: 'lv-stage ' + M.stageClass });
  rootWrap.appendChild(stage);

  function currentQ() {
    if (!state.questions.length) state.questions = fallbackQuestions();
    return state.questions[state.qIdx % state.questions.length];
  }

  function stopCamera() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
    if (state.stream) {
      state.stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
      state.stream = null;
    }
    state.camActive = false;
  }

  function homeworkUrl() {
    var base = window.location.origin + window.location.pathname;
    return base + '?game=island&pack=' + encodeURIComponent(state.packId || '') + '&code=' + encodeURIComponent(state.roomCode);
  }

  function drawHud() {
    hudLeft.innerHTML = '';
    hudRight.innerHTML = '';

    hudLeft.appendChild(el('span', { class: 'lv-pill', text: '⭐ ' + state.score + ' pts' }));
    hudLeft.appendChild(el('span', { class: 'lv-pill', text: '❓ Q ' + ((state.qIdx % state.questions.length) + 1) + ' / ' + state.questions.length }));

    if (state.packs.length) {
      var sel = el('select', {
        class: 'sort-sel',
        'aria-label': 'Select question pack',
        onchange: function () {
          state.packId = sel.value;
          state.qIdx = 0;
          state.islandStep = 0;
          state.tally = [0, 0, 0, 0];
          state.revealed = false;
          loadPacks().then(renderAll);
        }
      });
      state.packs.slice(0, 30).forEach(function (p) {
        var o = el('option', { value: p.id, text: (p.icon || '📚') + ' ' + (p.title || p.name || p.id) });
        if (p.id === state.packId) o.selected = true;
        sel.appendChild(o);
      });
      hudLeft.appendChild(sel);
    }

    if (M.id === 'island') {
      hudRight.appendChild(el('span', { class: 'lv-pill lv-code', text: '🔑 ' + state.roomCode }));
      hudRight.appendChild(el('button', {
        type: 'button',
        class: 'btn lilac',
        text: '🔗 Copy Homework Link',
        onclick: function () {
          Kit.sound('tap');
          var url = homeworkUrl();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              Kit.toast('🔗 Homework link copied! Room ' + state.roomCode);
            }).catch(function () {
              Kit.toast('Room ' + state.roomCode + ' ready!');
            });
          } else {
            Kit.toast('Room ' + state.roomCode + ' ready!');
          }
        }
      }));
    } else if (M.id === 'scan') {
      hudRight.appendChild(el('button', {
        type: 'button',
        class: 'btn lilac',
        text: '🖨️ Print A/B/C/D Cards',
        onclick: openPrintCards
      }));
    }
  }

  function nextQuestion() {
    state.qIdx = (state.qIdx + 1) % state.questions.length;
    state.locked = false;
    state.tally = [0, 0, 0, 0];
    state.revealed = false;
    renderStage();
  }

  function renderIslandStage() {
    var q = currentQ();
    var qbar = el('div', { class: 'lv-qbar' }, [
      el('div', { class: 'lv-qtext', text: q.q }),
      el('button', { type: 'button', class: 'btn', text: '🔊 Read', onclick: function () { Kit.say(q.q); } })
    ]);

    var map = el('div', { class: 'lv-islands' });
    ISLANDS.forEach(function (isl, idx) {
      var cls = 'lv-island';
      if (idx === state.islandStep) cls += ' current';
      else if (idx < state.islandStep) cls += ' done';
      var card = el('div', { class: cls }, [
        el('div', { class: 'lv-island-num', text: isl.icon }),
        el('div', { class: 'lv-island-name', text: isl.name }),
        idx === state.islandStep ? el('div', { class: 'lv-boat', text: '⛵' }) : null
      ]);
      map.appendChild(card);
    });

    var letters = ['A', 'B', 'C', 'D'];
    var badgeCls = ['a', 'b', 'c', 'd'];
    var grid = el('div', { class: 'lv-choices' });
    q.a.forEach(function (ans, idx) {
      var btn = el('button', {
        type: 'button',
        class: 'lv-choice',
        onclick: function () {
          if (state.locked) return;
          if (idx === q.ok) {
            state.locked = true;
            btn.classList.add('ok');
            state.score += 10;
            Kit.sound('fanfare');
            var c = Kit.centerOf(btn);
            Kit.confetti(c.x, c.y, 45);
            if (state.islandStep < ISLANDS.length - 1) {
              state.islandStep++;
            } else {
              state.score += 30;
              Kit.toast('🏴‍☠️ Treasure Bay reached! +30 Bonus Stars!');
              state.islandStep = 0;
            }
            drawHud();
            setTimeout(nextQuestion, 1000);
          } else {
            btn.classList.add('bad');
            Kit.sound('soft');
            setTimeout(function () { btn.classList.remove('bad'); }, 450);
          }
        }
      }, [
        el('span', { class: 'lv-badge ' + badgeCls[idx], text: letters[idx] }),
        el('span', { text: ans })
      ]);
      grid.appendChild(btn);
    });

    stage.appendChild(qbar);
    stage.appendChild(map);
    stage.appendChild(grid);
  }

  function openPrintCards() {
    Kit.sound('tap');
    var w = window.open('', '_blank', 'width=820,height=640');
    if (!w) {
      Kit.toast('Allow pop-ups to print A/B/C/D cards.');
      return;
    }
    var html = '<!DOCTYPE html><html><head><title>A/B/C/D Scan Cards</title><style>' +
      'body{font-family:sans-serif;display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px;}' +
      '.card{border:8px solid #222;border-radius:24px;height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:110px;font-weight:900;color:#fff;}' +
      '.a{background:#ff5c8a}.b{background:#47a3ff}.c{background:#3ac48d}.d{background:#f6a623}' +
      '.sub{font-size:20px;margin-top:8px;letter-spacing:2px}' +
      '</style></head><body>' +
      '<div class="card a">A<div class="sub">HOLD UP FOR A</div></div>' +
      '<div class="card b">B<div class="sub">HOLD UP FOR B</div></div>' +
      '<div class="card c">C<div class="sub">HOLD UP FOR C</div></div>' +
      '<div class="card d">D<div class="sub">HOLD UP FOR D</div></div>' +
      '<script>window.print();</script></body></html>';
    w.document.write(html);
    w.document.close();
  }

  function renderScanStage() {
    var q = currentQ();
    var qbar = el('div', { class: 'lv-qbar' }, [
      el('div', { class: 'lv-qtext', text: q.q }),
      el('div', { style: { display: 'flex', gap: '8px' } }, [
        el('button', { type: 'button', class: 'btn', text: '🔊 Read', onclick: function () { Kit.say(q.q); } }),
        el('button', {
          type: 'button',
          class: 'btn mint',
          text: state.revealed ? '➡ Next Q' : '✨ Reveal Answer',
          onclick: function () {
            if (!state.revealed) {
              state.revealed = true;
              state.score += 10;
              Kit.sound('win');
              drawHud();
              renderStage();
            } else {
              nextQuestion();
            }
          }
        })
      ])
    ]);

    var grid = el('div', { class: 'lv-scan-grid' });
    var camBox = el('div', { class: 'lv-cam-box' });
    var vid = el('video', { autoplay: true, muted: true, playsinline: true });
    var camOverlay = el('div', { class: 'lv-cam-overlay' });

    function updateCamOverlay() {
      camOverlay.innerHTML = '';
      if (state.camActive) {
        camOverlay.appendChild(el('div', { style: { fontWeight: 900, marginBottom: '8px' }, text: '📷 Scanning colour cards (Red=A · Blue=B · Green=C · Yellow=D)' }));
        camOverlay.appendChild(el('button', {
          type: 'button',
          class: 'btn pink',
          text: '⏹ Stop Camera',
          onclick: function () { stopCamera(); renderStage(); }
        }));
      } else {
        camOverlay.appendChild(el('div', { style: { fontWeight: 900, marginBottom: '8px' }, text: 'Hold up A / B / C / D cards or tap votes on the right!' }));
        camOverlay.appendChild(el('button', {
          type: 'button',
          class: 'btn mint',
          text: '📷 Start Card Scanner',
          onclick: function () {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              Kit.toast('Camera not available — tap A/B/C/D tally buttons!');
              return;
            }
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
              state.stream = stream;
              state.camActive = true;
              vid.srcObject = stream;
              updateCamOverlay();
              startColorScanner(vid);
            }).catch(function () {
              Kit.toast('Camera permission denied — tap A/B/C/D tally buttons!');
            });
          }
        }));
      }
    }

    camBox.appendChild(vid);
    camBox.appendChild(camOverlay);
    updateCamOverlay();

    var tallyBox = el('div', { class: 'lv-tally-box' });
    var letters = ['A', 'B', 'C', 'D'];
    var colors = ['#ff5c8a', '#47a3ff', '#3ac48d', '#f6a623'];
    var badgeCls = ['a', 'b', 'c', 'd'];
    var maxVotes = Math.max(1, Math.max.apply(null, state.tally));

    q.a.forEach(function (ans, idx) {
      var isOk = state.revealed && idx === q.ok;
      var rowBtn = el('button', {
        type: 'button',
        class: 'lv-choice' + (isOk ? ' ok' : ''),
        style: { padding: '10px 12px' },
        onclick: function () {
          Kit.sound('tap');
          state.tally[idx]++;
          renderStage();
        }
      }, [
        el('span', { class: 'lv-badge ' + badgeCls[idx], text: letters[idx] }),
        el('span', { style: { flex: 1 }, text: ans }),
        el('span', { style: { fontSize: '0.9rem', color: '#6b537c' }, text: state.tally[idx] + ' 🪪' })
      ]);

      var barRow = el('div', { class: 'lv-tally-row' }, [
        el('span', { text: letters[idx] }),
        el('div', { class: 'lv-tally-bar' }, [
          el('div', {
            class: 'lv-tally-fill',
            style: { width: Math.round((state.tally[idx] / maxVotes) * 100) + '%', background: colors[idx] }
          })
        ]),
        el('span', { text: String(state.tally[idx]) })
      ]);

      tallyBox.appendChild(rowBtn);
      tallyBox.appendChild(barRow);
    });

    grid.appendChild(camBox);
    grid.appendChild(tallyBox);
    stage.appendChild(qbar);
    stage.appendChild(grid);
  }

  function startColorScanner(videoEl) {
    var cvs = document.createElement('canvas');
    cvs.width = 64;
    cvs.height = 48;
    var ctx = cvs.getContext('2d');
    var lastScan = 0;

    function loop(ts) {
      if (!state.camActive) return;
      if (videoEl.readyState >= 2 && ts - lastScan > 700) {
        ctx.drawImage(videoEl, 0, 0, 64, 48);
        var data = ctx.getImageData(16, 12, 32, 24).data;
        var r = 0, g = 0, b = 0, n = data.length / 4;
        for (var i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i + 1]; b += data[i + 2];
        }
        r /= n; g /= n; b /= n;
        var detected = -1;
        if (r > 165 && g < 110 && b < 130) detected = 0;
        else if (b > 165 && r < 120) detected = 1;
        else if (g > 155 && r < 120 && b < 140) detected = 2;
        else if (r > 175 && g > 145 && b < 100) detected = 3;
        if (detected >= 0) {
          lastScan = ts;
          state.tally[detected]++;
          Kit.sound('tap');
          renderStage();
          return;
        }
      }
      state.rafId = requestAnimationFrame(loop);
    }
    state.rafId = requestAnimationFrame(loop);
  }

  function renderSliceStage() {
    var q = currentQ();
    var qbar = el('div', { class: 'lv-qbar' }, [
      el('div', { class: 'lv-qtext', text: '🍉 Swipe or tap the right fruit: ' + q.q }),
      el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
        el('button', { type: 'button', class: 'btn sm', text: '🔊 Read', onclick: function () { Kit.say(q.q); } }),
        el('button', {
          type: 'button',
          class: (state.camActive ? 'btn pink' : 'btn mint') + ' sm',
          text: state.camActive ? '⏹ Stop Cam' : '📷 Motion Cam',
          onclick: function () {
            if (state.camActive) {
              stopCamera();
              renderStage();
            } else {
              if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                Kit.toast('Swipe or tap the fruit directly!');
                return;
              }
              navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                state.stream = stream;
                state.camActive = true;
                renderStage();
              }).catch(function () {
                Kit.toast('Swipe or tap the fruit directly!');
              });
            }
          }
        })
      ])
    ]);

    var arena = el('div', { class: 'lv-slice-arena' });
    var vid = null;
    if (state.camActive && state.stream) {
      vid = el('video', { class: 'lv-slice-video', autoplay: true, muted: true, playsinline: true });
      vid.srcObject = state.stream;
      arena.appendChild(vid);
    }

    var trailCv = el('canvas', { class: 'lv-slice-trail' });
    arena.appendChild(trailCv);
    var trailPts = [], swiping = false;

    var FRUITS = [
      { ic: '🍉', cls: 'f-pink' },
      { ic: '🍊', cls: 'f-gold' },
      { ic: '🍓', cls: 'f-sky' },
      { ic: '🍍', cls: 'f-mint' }
    ];
    var targets = [];
    var positions = [
      { x: 6,  y: 12, vx: 0.14,  vy: 0.10,  minX: 3,  maxX: 38, minY: 6,  maxY: 38 },
      { x: 52, y: 14, vx: -0.13, vy: 0.11,  minX: 48, maxX: 72, minY: 6,  maxY: 38 },
      { x: 8,  y: 56, vx: 0.12,  vy: -0.10, minX: 3,  maxX: 38, minY: 48, maxY: 74 },
      { x: 52, y: 58, vx: -0.14, vy: -0.09, minX: 48, maxX: 72, minY: 48, maxY: 74 }
    ];

    function hitTarget(idx, btn) {
      if (state.locked) return;
      if (idx === q.ok) {
        state.locked = true;
        btn.classList.add('sliced-ok');
        state.score += 15;
        Kit.sound('fanfare');
        var c = Kit.centerOf(btn);
        Kit.confetti(c.x, c.y, 55);
        drawHud();
        setTimeout(function () {
          if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
          nextQuestion();
        }, 700);
      } else {
        btn.classList.add('sliced-bad');
        Kit.sound('soft');
        setTimeout(function () { btn.classList.remove('sliced-bad'); }, 400);
      }
    }

    q.a.forEach(function (ans, idx) {
      var pos = Object.assign({}, positions[idx % positions.length]);
      var fr = FRUITS[idx % FRUITS.length];
      var btn = el('button', {
        type: 'button',
        class: 'lv-slice-target ' + fr.cls,
        style: { left: pos.x + '%', top: pos.y + '%' },
        onclick: function () { hitTarget(idx, btn); }
      }, [
        el('span', { class: 'lv-fruit-ic', text: fr.ic }),
        el('span', { class: 'lv-fruit-txt', text: ans })
      ]);
      arena.appendChild(btn);
      targets.push({ el: btn, idx: idx, pos: pos });
    });

    function checkFingerHit(clientX, clientY) {
      for (var i = 0; i < targets.length; i++) {
        var r = targets[i].el.getBoundingClientRect();
        if (clientX >= r.left - 8 && clientX <= r.right + 8 && clientY >= r.top - 8 && clientY <= r.bottom + 8) {
          hitTarget(targets[i].idx, targets[i].el);
          break;
        }
      }
    }
    arena.addEventListener('pointerdown', function (e) {
      swiping = true;
      var ar = arena.getBoundingClientRect();
      trailPts.push({ x: e.clientX - ar.left, y: e.clientY - ar.top, life: 1 });
      checkFingerHit(e.clientX, e.clientY);
    });
    arena.addEventListener('pointermove', function (e) {
      if (!swiping && e.buttons === 0) return;
      var ar = arena.getBoundingClientRect();
      trailPts.push({ x: e.clientX - ar.left, y: e.clientY - ar.top, life: 1 });
      if (trailPts.length > 26) trailPts.shift();
      checkFingerHit(e.clientX, e.clientY);
    });
    window.addEventListener('pointerup', function () { swiping = false; }, { passive: true });

    var prevFrame = null;
    var cvs = document.createElement('canvas');
    cvs.width = 48;
    cvs.height = 36;
    var ctx = cvs.getContext('2d');

    function tick() {
      if (state.locked) return;
      var ar = arena.getBoundingClientRect();
      if (ar.width > 10 && (trailCv.width !== Math.round(ar.width) || trailCv.height !== Math.round(ar.height))) {
        trailCv.width = Math.round(ar.width);
        trailCv.height = Math.round(ar.height);
      }
      var tctx = trailCv.getContext('2d');
      if (tctx) {
        tctx.clearRect(0, 0, trailCv.width, trailCv.height);
        for (var p = trailPts.length - 1; p >= 0; p--) {
          trailPts[p].life -= 0.06;
          if (trailPts[p].life <= 0) trailPts.splice(p, 1);
        }
        if (trailPts.length > 1) {
          tctx.lineCap = 'round';
          tctx.lineJoin = 'round';
          for (var s = 1; s < trailPts.length; s++) {
            var a = trailPts[s - 1], b = trailPts[s];
            tctx.beginPath();
            tctx.moveTo(a.x, a.y);
            tctx.lineTo(b.x, b.y);
            tctx.strokeStyle = 'rgba(255, 95, 162, ' + (b.life * 0.85).toFixed(2) + ')';
            tctx.lineWidth = Math.max(3, b.life * 14);
            tctx.stroke();
          }
        }
      }

      targets.forEach(function (t) {
        t.pos.x += t.pos.vx;
        t.pos.y += t.pos.vy;
        if (t.pos.x < t.pos.minX || t.pos.x > t.pos.maxX) t.pos.vx *= -1;
        if (t.pos.y < t.pos.minY || t.pos.y > t.pos.maxY) t.pos.vy *= -1;
        t.el.style.left = t.pos.x.toFixed(1) + '%';
        t.el.style.top = t.pos.y.toFixed(1) + '%';
      });

      if (vid && vid.readyState >= 2) {
        ctx.drawImage(vid, 0, 0, 48, 36);
        var cur = ctx.getImageData(0, 0, 48, 36).data;
        if (prevFrame) {
          var hotX = 0, hotY = 0, hits = 0;
          for (var y = 0; y < 36; y += 2) {
            for (var x = 0; x < 48; x += 2) {
              var i = (y * 48 + x) * 4;
              var diff = Math.abs(cur[i] - prevFrame[i]) + Math.abs(cur[i + 1] - prevFrame[i + 1]);
              if (diff > 85) {
                hotX += (48 - x) / 48;
                hotY += y / 36;
                hits++;
              }
            }
          }
          if (hits > 14) {
            var mx = (hotX / hits) * 100;
            var my = (hotY / hits) * 100;
            targets.forEach(function (t) {
              if (Math.abs(mx - (t.pos.x + 12)) < 14 && Math.abs(my - (t.pos.y + 10)) < 14) {
                hitTarget(t.idx, t.el);
              }
            });
          }
        }
        prevFrame = new Uint8ClampedArray(cur);
      }
      state.rafId = requestAnimationFrame(tick);
    }
    state.rafId = requestAnimationFrame(tick);

    stage.appendChild(qbar);
    stage.appendChild(arena);
  }

  function renderStage() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
    stage.innerHTML = '';
    if (M.id === 'island') renderIslandStage();
    else if (M.id === 'scan') renderScanStage();
    else renderSliceStage();
  }

  function renderAll() {
    drawHud();
    renderStage();
  }

  window.addEventListener('beforeunload', stopCamera);
  loadPacks().then(renderAll);
})();
