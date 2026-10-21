/* Grade 3 · Unit 4 · Lesson 4 (pp. 70–71): Hybrid Pro Smartboard Controller */
(function (window) {
  'use strict';
  var D = window.L4Data, A = window.ProAudio;
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    step: 0,
    stars: 0,
    turn: 0,
    scores: [0, 0, 0, 0],
    host: 'nova',
    lastSpeech: '',
    doneSteps: {},
    cleanups: []
  };

  var STATIONS = [
    { title: '1 · Explore the Reading Check (p. 70 A–B)', mins: '6 min', sub: '5 Picture Comprehension Questions', host: 'nova', bg: 'bg_beach_volcano',
      youdo: ['👀 Look at the story picture', '🤝 Talk in your team (10s)', '👆 Tap the right answer'],
      say: ['She was up in a palm tree.', 'They escaped in Papa’s wooden boat.', 'They saw a big ship at sunrise!'],
      tips: ['Book p. 70 Explore the Reading A–B (questions 1–5).', 'Teams take turns answering the 5 story questions. Every right answer awards +2 team points and +2 stars!'],
      run: renderStation1Explore },
    { title: '2 · Volcano Freeze & 4 Feeling Corners (p. 70 C)', mins: '8 min', sub: 'Walk to a Feeling Corner & Speak', host: 'blaze', bg: 'bg_beach_volcano',
      youdo: ['🌋 Walk while the volcano rumbles', '🧊 FREEZE in 1 of the 4 Feeling Corners', '🗣️ Say: "In 1815, I felt … because …"'],
      say: ['I felt scared because ash fell.', 'I felt safe because we had a boat.', 'I felt thankful because the ship saved us!'],
      tips: ['Book p. 70 C: "Imagine you lived near Mount Tambora in 1815. How do you feel?" (sad, hot, happy, safe, bored, scared, bad, angry, thankful, strong).', 'Point to the 4 corners of the classroom (Scared, Safe, Thankful, Happy). Press "🌋 RUMBLE & WALK!", then when it freezes, call on a corner to say their sentence!'],
      run: renderStation2Feelings },
    { title: '3 · The -nd Phonics Letter Factory (p. 70)', mins: '8 min', sub: 'end · stand · wind · send · find · hand', host: 'bubbles', bg: 'bg_sea_sunrise',
      youdo: ['🔊 Hear the -nd word', '👀 Tap the scrambled letters in order', '🗣️ Shout the -nd word together!'],
      say: ['w - i - n - d → wind!', 'h - a - n - d → hand!', 's - t - a - n - d → stand!'],
      tips: ['Book p. 70 Phonics: final -nd consonant blend (end, stand, wind, send, find, hand).', 'First tap the 6 3D picture cards to sound out each -nd word, or switch to "⚙️ Fix the Letter Factory" so teams spell each word by tapping the letter tiles in order!'],
      run: renderStation3PhonicsFactory },
    { title: '4 · Pop the -nd Balloons! (p. 70)', mins: '6 min', sub: '25-Second Team Phonics Arcade', host: 'rosie', bg: 'bg_sea_sunrise',
      youdo: ['🎈 Watch the floating word balloons', '👆 Tap ONLY words ending with -nd', '🗣️ Whole team shouts the word!'],
      say: ['wind!', 'hand!', 'find!', 'stand!', 'send!', 'end!'],
      tips: ['Each team gets a fast, joyful arcade round to pop floating balloons that end with -nd (wind, hand, send, find, stand, end, sand, island).', 'Tapping a non-nd word gently wobbles with zero point loss.'],
      run: renderStation4Balloons },
    { title: '5 · Two-Story Train & 3-Step Interview (p. 71)', mins: '7 min', sub: 'Compare Both Readings + Partner Talk', host: 'sprout', bg: 'bg_sea_sunrise',
      youdo: ['🚂 Load each card into the right Train Car', '🎤 Pair up for the 3-Step Interview', '🚪 Say 1 -nd word at the door!'],
      say: ['In Where Is She?, a man stole a painting.', 'In The Angry Mountain, a volcano erupted.', 'Both stories tell what happened!'],
      tips: ['Book p. 71 Think Together: compare Reading 1 (Where Is She?) and Reading 2 (The Angry Mountain), then run the 60-second Three-Step Interview!'],
      run: renderStation5ThinkTogether }
  ];

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var blinkTimer = 0;
  function setHost(who, text, autoSpeak) {
    state.host = who || state.host;
    var c = D.cast[state.host] || D.cast.nova;
    var col = $('host-col');
    col.style.setProperty('--host-c', c.color);
    col.style.setProperty('--host-dark', c.dark);
    $('host-name').textContent = c.name.toUpperCase();
    $('host-role').textContent = c.role;
    $('host-sprite').src = 'cast/' + state.host + '_idle.webp';
    if (text) {
      state.lastSpeech = text;
      $('host-text').textContent = text;
      if (autoSpeak !== false) speakHost(text);
    }
  }

  function speakHost(text) {
    var stg = $('host-stage'), spr = $('host-sprite');
    stg.classList.add('talking');
    var open = false;
    var flapIv = setInterval(function () {
      open = !open;
      spr.src = 'cast/' + state.host + (open ? '_talk.webp' : '_idle.webp');
    }, 150);
    A.speak(text).then(function () {
      clearInterval(flapIv);
      stg.classList.remove('talking');
      spr.src = 'cast/' + state.host + '_idle.webp';
    });
  }

  function hostReact(kind, msg, node) {
    var stg = $('host-stage'), spr = $('host-sprite');
    stg.classList.remove('cheer', 'oops');
    void stg.offsetWidth;
    if (kind === 'cheer') {
      A.correct();
      stg.classList.add('cheer');
      addStars(2, node);
      if (msg) setHost(state.host, msg, true);
    } else {
      A.softFail();
      stg.classList.add('oops');
      if (msg) setHost(state.host, msg, true);
    }
    setTimeout(function () { stg.classList.remove('cheer', 'oops'); spr.src = 'cast/' + state.host + '_idle.webp'; }, 900);
  }

  function startBlinkLoop() {
    clearInterval(blinkTimer);
    blinkTimer = setInterval(function () {
      var stg = $('host-stage'), spr = $('host-sprite');
      if (!stg || stg.classList.contains('talking')) return;
      spr.src = 'cast/' + state.host + '_blink.webp';
      setTimeout(function () {
        if (!stg.classList.contains('talking')) spr.src = 'cast/' + state.host + '_idle.webp';
      }, 150);
    }, 3400);
  }

  function addStars(n, fromNode) {
    state.stars = Math.min(D.questGoal, state.stars + n);
    $('pro-quest-txt').textContent = D.questLabel + ': ' + state.stars + ' / ' + D.questGoal;
    $('pro-quest-fill').style.width = Math.round((state.stars / D.questGoal) * 100) + '%';
    if (fromNode && fromNode.getBoundingClientRect) {
      var r = fromNode.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (var i = 0; i < 7; i++) {
        var b = el('div', { class: 'star-burst', text: i % 2 ? '⭐' : '✨' });
        var ang = (i / 7) * Math.PI * 2;
        b.style.left = cx + 'px'; b.style.top = cy + 'px';
        b.style.setProperty('--dx', Math.cos(ang) * 95 + 'px');
        b.style.setProperty('--dy', Math.sin(ang) * 95 + 'px');
        document.body.appendChild(b);
        setTimeout(function (elB) { elB.remove(); }.bind(null, b), 850);
      }
    }
  }

  function addTeamPts(ti, delta) {
    state.scores[ti] = Math.max(0, (state.scores[ti] || 0) + delta);
    renderTopTeams();
  }

  function renderTopTeams() {
    var box = $('pro-teams'); box.innerHTML = '';
    D.teams.forEach(function (t, i) {
      var pill = el('div', { class: 'pro-team-pill', style: '--tc:' + t.c }, [
        el('button', { class: 'pro-team-add', type: 'button', onclick: function () { A.correct(); addTeamPts(i, 1); addStars(1); } }, [
          el('span', { text: t.e + ' ' + t.n }),
          el('b', { text: String(state.scores[i]) })
        ]),
        el('button', { class: 'pro-team-sub', type: 'button', title: 'Minus 1', onclick: function () { A.tap(); addTeamPts(i, -1); } }, [el('span', { text: '−' })])
      ]);
      box.appendChild(pill);
    });
  }

  function renderTopSteps() {
    var box = $('pro-steps'); box.innerHTML = '';
    STATIONS.forEach(function (s, i) {
      var cls = 'pro-step-dot' + (i === state.step ? ' active' : '') + (state.doneSteps[i] ? ' done' : '');
      box.appendChild(el('button', { class: cls, type: 'button', text: String(i + 1), onclick: function () { goStep(i); } }));
    });
  }

  function renderYouDo(s) {
    var strip = $('youdo-strip'); strip.innerHTML = '';
    strip.appendChild(el('span', { class: 'pro-tag-youdo', text: 'YOU DO' }));
    var stepsWrap = el('div', { class: 'pro-youdo-steps' });
    (s.youdo || []).forEach(function (st) { stepsWrap.appendChild(el('span', { text: st })); });
    strip.appendChild(stepsWrap);

    if (s.say && s.say.length) {
      strip.appendChild(el('span', { class: 'pro-tag-say', text: '🗣️ SAY (TAP TO HEAR)' }));
      var sayWrap = el('div', { class: 'pro-say-frames' });
      s.say.forEach(function (line) {
        sayWrap.appendChild(el('button', { class: 'pro-say-pill', type: 'button', text: '🔊 "' + line + '"', onclick: function () {
          A.tap(); setHost(state.host, line, true);
        } }));
      });
      strip.appendChild(sayWrap);
    }
  }

  function goStep(idx) {
    state.cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
    state.cleanups = [];
    if (idx > state.step) state.doneSteps[state.step] = true;
    state.step = Math.max(0, Math.min(STATIONS.length - 1, idx));
    var s = STATIONS[state.step];
    $('pro-bg').style.backgroundImage = 'url(art/' + s.bg + '.webp)';
    $('st-title').textContent = s.title;
    $('st-mins').textContent = '⏱ ' + s.mins;
    $('st-sub').textContent = s.sub;
    $('btn-prev').disabled = state.step === 0;
    $('btn-next').disabled = state.step === STATIONS.length - 1;
    $('tip-modal').hidden = true;
    renderTopSteps();
    renderYouDo(s);
    var body = $('stage-body'); body.innerHTML = '';
    s.run(body);
  }

  /* ---------------- STATION 1: EXPLORE THE READING CHECK (p. 70 A-B) ---------------- */
  function renderStation1Explore(body) {
    var qi = 0;
    setHost('nova', 'Let’s check what we remember from The Angry Mountain on page 70! Talk in your team and tap the answer!', false);
    var card = el('div', { style: 'display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:center;background:rgba(15,23,42,0.9);border:2px solid #38bdf8;border-radius:20px;padding:16px;' });
    body.appendChild(card);

    function drawQ() {
      var item = D.exploreQs[qi % D.exploreQs.length];
      var team = D.teams[state.turn % D.teams.length];
      card.innerHTML = '';
      card.appendChild(el('div', { style: 'text-align:center;' }, [
        el('img', { src: 'art/' + item.art + '.webp', style: 'width:165px;height:165px;object-fit:contain;' })
      ]));
      var right = el('div', { style: 'display:flex;flex-direction:column;gap:10px;' }, [
        el('span', { class: 'pro-pill amber', style: 'align-self:flex-start;', text: team.e + ' ' + team.n + '’s Turn · Question ' + ((qi % D.exploreQs.length) + 1) + ' of ' + D.exploreQs.length }),
        el('h3', { style: 'margin:0;font-size:1.2rem;color:#fff;', text: item.q })
      ]);
      var optsCol = el('div', { style: 'display:flex;flex-direction:column;gap:8px;' });
      item.opts.forEach(function (opt, oi) {
        optsCol.appendChild(el('button', { class: 'pro-btn ghost', style: 'justify-content:flex-start;padding:11px 16px;', type: 'button', text: opt, onclick: function (ev) {
          if (oi === item.ans) {
            ev.currentTarget.className = 'pro-btn green';
            addTeamPts(state.turn % D.teams.length, 2);
            state.turn++;
            hostReact('cheer', 'Correct! ' + opt + '!', ev.currentTarget);
            setTimeout(function () { qi++; drawQ(); }, 1100);
          } else {
            hostReact('oops', 'Almost! Look at the picture and try another answer!');
          }
        } }));
      });
      right.appendChild(optsCol);
      card.appendChild(right);
    }
    drawQ();
  }

  /* ---------------- STATION 2: VOLCANO FREEZE & 4 FEELING CORNERS (p. 70 C) ---------------- */
  function renderStation2Feelings(body) {
    var mIdx = 0;
    setHost('blaze', 'Page 70 C: Imagine you lived near Mount Tambora in 1815! When I press RUMBLE, walk to a Feeling Corner. When I say FREEZE, tell me how you feel and WHY!', false);

    var topBox = el('div', { style: 'display:grid;grid-template-columns:110px 1fr auto;gap:14px;align-items:center;background:rgba(2,6,23,0.8);border:2px solid #f59e0b;border-radius:18px;padding:10px 16px;' });
    var cornersGrid = el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:10px;' });
    body.appendChild(topBox); body.appendChild(cornersGrid);

    function drawMoment() {
      var m = D.feelingMoments[mIdx % D.feelingMoments.length];
      topBox.innerHTML = '';
      topBox.appendChild(el('img', { src: 'art/' + m.art + '.webp', style: 'width:92px;height:92px;object-fit:contain;' }));
      topBox.appendChild(el('div', {}, [
        el('div', { style: 'color:#fde047;font-weight:900;font-size:1.05rem;', text: m.title }),
        el('div', { style: 'color:#cbd5e1;font-weight:700;font-size:0.88rem;margin-top:3px;', text: m.ask })
      ]));
      var rumbleBtn = el('button', { class: 'pro-btn coral', type: 'button', text: '🌋 RUMBLE & FREEZE!', onclick: function () {
        A.rumble();
        rumbleBtn.textContent = '🚶 WALK TO A CORNER...';
        setTimeout(function () {
          A.correct();
          rumbleBtn.textContent = '🧊 FREEZE! Next Moment ▶';
          setHost('blaze', 'FREEZE! Tap your corner card below and say your sentence aloud with BECAUSE!', true);
        }, 1600);
        rumbleBtn.onclick = function () { mIdx++; drawMoment(); };
      } });
      topBox.appendChild(rumbleBtn);

      cornersGrid.innerHTML = '';
      D.corners.forEach(function (c) {
        cornersGrid.appendChild(el('div', {
          style: 'background:rgba(15,23,42,0.9);border:2.5px solid ' + c.color + ';border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;cursor:pointer;',
          onclick: function (ev) {
            addTeamPts(state.turn % D.teams.length, 2);
            state.turn++;
            hostReact('cheer', c.frame, ev.currentTarget);
          }
        }, [
          el('div', { style: 'font-weight:900;font-size:1rem;color:' + c.color, text: c.label }),
          el('div', { style: 'font-size:0.9rem;color:#f8fafc;font-weight:800;', text: '🗣️ "' + c.frame + '"' }),
          el('span', { class: 'pro-pill', style: 'align-self:flex-start;', text: '🔊 Tap to Speak & Award +2' })
        ]));
      });
    }
    drawMoment();
  }

  /* ---------------- STATION 3: THE -ND PHONICS LETTER FACTORY (p. 70) ---------------- */
  function renderStation3PhonicsFactory(body) {
    var mode = 'build', wIdx = 0;
    setHost('bubbles', 'Welcome to the -nd Letter Factory! All 6 words on page 70 end with the -nd blend: end, stand, wind, send, find, hand! Tap the letters in order!', false);

    var topRow = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;' });
    var modeBtn = el('button', { class: 'pro-btn violet', type: 'button', text: '🃏 View All 6 -nd Picture Cards', onclick: function () {
      A.tap(); mode = (mode === 'build') ? 'cards' : 'build'; draw();
    } });
    topRow.appendChild(el('span', { class: 'pro-pill amber', text: '🔤 Phonics Focus: Final -nd Blend (p. 70)' }));
    topRow.appendChild(modeBtn);
    var stage = el('div', { style: 'flex:1;display:flex;flex-direction:column;justify-content:center;' });
    body.appendChild(topRow); body.appendChild(stage);

    function draw() {
      stage.innerHTML = '';
      modeBtn.textContent = (mode === 'build') ? '🃏 View All 6 -nd Picture Cards' : '⚙️ Back to Letter Factory Machine';
      if (mode === 'cards') {
        var grid = el('div', { class: 'pro-card-grid' });
        D.ndWords.forEach(function (item) {
          var stem = item.w.slice(0, -2);
          var card = el('div', { class: 'pro-card3d', onclick: function () {
            hostReact('cheer', item.w.toUpperCase() + '! ' + item.sent, card);
          } }, [
            el('span', { class: 'pos-tag', style: 'background:#10b981', text: '-nd' }),
            el('div', { class: 'art-box' }, [el('img', { src: 'art/' + item.art + '.webp', alt: item.w })]),
            el('div', { class: 'cap-tray', html: stem + '<span style="color:#4ade80;text-decoration:underline;">nd</span>' })
          ]);
          grid.appendChild(card);
        });
        stage.appendChild(grid);
        return;
      }

      var item = D.ndWords[wIdx % D.ndWords.length];
      var letters = item.w.split('');
      var pos = 0;
      var team = D.teams[state.turn % D.teams.length];

      var box = el('div', { style: 'background:rgba(2,6,23,0.78);border:2px solid #38bdf8;border-radius:20px;padding:14px 18px;display:grid;grid-template-columns:160px 1fr;gap:16px;align-items:center;' });
      box.appendChild(el('div', { style: 'text-align:center;' }, [
        el('img', { src: 'art/' + item.art + '.webp', style: 'width:135px;height:135px;object-fit:contain;' }),
        el('button', { class: 'pro-btn amber', style: 'margin-top:6px;padding:5px 12px;font-size:0.8rem;', type: 'button', text: '🔊 Hear Word', onclick: function () { speakHost(item.w + '. ' + item.sent); } })
      ]));

      var right = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:10px;' });
      right.appendChild(el('div', { style: 'color:#fde047;font-weight:900;font-size:0.95rem;', text: team.e + ' ' + team.n + ' · Word ' + ((wIdx % D.ndWords.length) + 1) + ' of ' + D.ndWords.length + ': "' + item.sent.replace(new RegExp(item.w, 'i'), '____') + '"' }));

      var slotsRow = el('div', { class: 'letter-slots' });
      var slotEls = letters.map(function (ch, idx) {
        var isNd = idx >= letters.length - 2;
        var sEl = el('div', { class: 'letter-slot' + (isNd ? ' nd-slot' : ''), text: '' });
        slotsRow.appendChild(sEl);
        return sEl;
      });
      right.appendChild(slotsRow);

      var tilesRow = el('div', { style: 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap;' });
      var indexed = shuffle(letters.map(function (ch, i) { return { ch: ch, i: i }; }));
      indexed.forEach(function (obj) {
        var tBtn = el('button', { class: 'letter-tile', type: 'button', text: obj.ch, onclick: function () {
          if (obj.ch === letters[pos]) {
            A.tap();
            tBtn.classList.add('used');
            slotEls[pos].textContent = obj.ch;
            pos++;
            if (pos === letters.length) {
              addTeamPts(state.turn % D.teams.length, 2);
              state.turn++;
              hostReact('cheer', item.w.toUpperCase() + '! ' + item.sent, box);
              setTimeout(function () { wIdx++; draw(); }, 1200);
            }
          } else {
            hostReact('oops', 'Try the next letter in "' + item.w + '"!');
          }
        } });
        tilesRow.appendChild(tBtn);
      });
      right.appendChild(tilesRow);
      box.appendChild(right);
      stage.appendChild(box);
    }
    draw();
  }

  /* ---------------- STATION 4: POP THE -ND BALLOONS! (25s Arcade, p. 70) ---------------- */
  function renderStation4Balloons(body) {
    setHost('rosie', 'Pop ONLY the balloons with words ending in -nd! Shout each -nd word out loud with your team!', false);
    var head = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;' });
    var teamBadge = el('span', { class: 'pro-pill amber' });
    var scoreBadge = el('span', { class: 'pro-pill', text: '🎈 Popped: 0 / 6 -nd words' });
    var newBtn = el('button', { class: 'pro-btn green', type: 'button', text: '🔄 New Wave of Balloons', onclick: spawnWave });
    head.appendChild(teamBadge); head.appendChild(scoreBadge); head.appendChild(newBtn);

    var sky = el('div', { class: 'balloon-stage' });
    body.appendChild(head); body.appendChild(sky);

    var popped = 0;
    var COLORS = [
      'radial-gradient(circle at 35% 30%, #38bdf8, #0284c7)',
      'radial-gradient(circle at 35% 30%, #4ade80, #16a34a)',
      'radial-gradient(circle at 35% 30%, #f43f5e, #be123c)',
      'radial-gradient(circle at 35% 30%, #a855f7, #6b21a8)',
      'radial-gradient(circle at 35% 30%, #f59e0b, #b45309)'
    ];

    function spawnWave() {
      sky.innerHTML = '';
      var team = D.teams[state.turn % D.teams.length];
      teamBadge.textContent = team.e + ' ' + team.n + '’s Balloon Wave';
      var picks = shuffle(D.ndPool).slice(0, 4).map(function (w) { return { w: w, ok: true }; })
        .concat(shuffle(D.nonNdPool).slice(0, 3).map(function (w) { return { w: w, ok: false }; }));
      picks = shuffle(picks);

      picks.forEach(function (item, idx) {
        var b = el('div', {
          class: 'nd-balloon',
          style: 'left:' + (6 + idx * 13) + '%;top:' + (idx % 2 ? '52%' : '16%') + ';background:' + COLORS[idx % COLORS.length] + ';',
          text: item.w,
          onclick: function () {
            if (item.ok) {
              popped++;
              scoreBadge.textContent = '🎈 Popped: ' + popped + ' -nd words!';
              addTeamPts(state.turn % D.teams.length, 1);
              hostReact('cheer', item.w.toUpperCase() + ' ends with -nd!', b);
              b.style.transform = 'scale(0)';
              setTimeout(function () { b.remove(); }, 180);
              if (popped % 4 === 0) state.turn++;
            } else {
              b.classList.add('wrong');
              hostReact('oops', '"' + item.w + '" does not end with -nd! Look for -nd at the end!');
            }
          }
        });
        sky.appendChild(b);
      });
    }
    spawnWave();
  }

  /* ---------------- STATION 5: TWO-STORY TRAIN & 3-STEP INTERVIEW (p. 71) ---------------- */
  function renderStation5ThinkTogether(body) {
    var cIdx = 0;
    setHost('sprout', 'Page 71 Think Together! Does this card belong to Where Is She? (Mona Lisa), The Angry Mountain, or BOTH stories? Load the train!', false);

    var cardBox = el('div', { style: 'background:rgba(2,6,23,0.82);border:2px solid #fde047;border-radius:18px;padding:12px 16px;display:flex;align-items:center;gap:14px;' });
    var carsGrid = el('div', { style: 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;' });
    var interviewBar = el('div', { style: 'background:rgba(16,185,129,0.15);border:1.5px solid #10b981;border-radius:14px;padding:9px 14px;display:flex;justify-content:space-between;align-items:center;' }, [
      el('div', { style: 'font-size:0.88rem;font-weight:800;color:#a7f3d0;', text: '🎤 Book p. 71 B · Three-Step Interview: "What happened? Why did it happen? How did people feel?"' }),
      el('button', { class: 'pro-btn green', style: 'padding:6px 12px;font-size:0.8rem;', type: 'button', text: '⏱ Start 60s Partner Interview', onclick: function (ev) {
        var btn = ev.currentTarget, sec = 60;
        A.tap();
        var iv = setInterval(function () {
          sec--;
          btn.textContent = sec > 0 ? ('⏱ ' + sec + 's Partner Talk') : '✅ Interview Done! +2 Stars';
          if (sec <= 0) { clearInterval(iv); A.fanfare(); addStars(2, btn); }
        }, 1000);
        state.cleanups.push(function () { clearInterval(iv); });
      } })
    ]);
    body.appendChild(cardBox); body.appendChild(carsGrid); body.appendChild(interviewBar);

    var CARS = [
      { id: 'mona',     title: '🚂 Car 1: Where Is She?',     sub: 'Mona Lisa Robbery (pp. 58–64)', col: '#38bdf8', art: 'o_mona_frame' },
      { id: 'mountain', title: '🚃 Car 2: The Angry Mountain', sub: 'Mount Tambora (pp. 66–69)',     col: '#f97316', art: 'o_volcano' },
      { id: 'both',     title: '🚋 Car 3: BOTH Stories!',      sub: 'Unit 4 Big Question (p. 71)',   col: '#10b981', art: 'o_sunrise' }
    ];

    function drawTrain() {
      var item = D.trainCards[cIdx % D.trainCards.length];
      var team = D.teams[state.turn % D.teams.length];
      cardBox.innerHTML = '';
      cardBox.appendChild(el('img', { src: 'art/' + item.art + '.webp', style: 'width:76px;height:76px;object-fit:contain;' }));
      cardBox.appendChild(el('div', {}, [
        el('div', { style: 'color:#fde047;font-weight:900;font-size:0.84rem;', text: team.e + ' ' + team.n + ' · Card ' + ((cIdx % D.trainCards.length) + 1) + ' of ' + D.trainCards.length }),
        el('div', { style: 'font-size:1.08rem;font-weight:900;color:#fff;', text: '📦 "' + item.text + '"' })
      ]));

      carsGrid.innerHTML = '';
      CARS.forEach(function (car) {
        carsGrid.appendChild(el('div', {
          class: 'pro-card3d',
          style: 'min-height:140px;border-color:' + car.col,
          onclick: function (ev) {
            if (car.id === item.car) {
              ev.currentTarget.classList.add('right');
              addTeamPts(state.turn % D.teams.length, 2);
              state.turn++;
              hostReact('cheer', 'Choo-choo! Loaded into ' + car.title + '!', ev.currentTarget);
              setTimeout(function () { cIdx++; drawTrain(); }, 1000);
            } else {
              ev.currentTarget.classList.add('wrong');
              hostReact('oops', 'Think again: is that from Where Is She?, The Angry Mountain, or Both?');
            }
          }
        }, [
          el('img', { src: 'art/' + car.art + '.webp', style: 'width:64px;height:64px;object-fit:contain;' }),
          el('b', { style: 'font-size:0.98rem;color:#fff;', text: car.title }),
          el('small', { style: 'color:#cbd5e1;font-weight:700;', text: car.sub })
        ]));
      });
    }
    drawTrain();
  }

  function boot() {
    renderTopTeams();
    startBlinkLoop();
    $('host-replay').onclick = function () { A.tap(); speakHost(state.lastSpeech); };
    $('btn-prev').onclick = function () { A.tap(); goStep(state.step - 1); };
    $('btn-next').onclick = function () { A.tap(); goStep(state.step + 1); };
    $('btn-sound').onclick = function () {
      A.setOn(!A.isOn());
      $('btn-sound').textContent = A.isOn() ? '🔊' : '🔇';
    };
    $('btn-fs').onclick = function () {
      try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) {}
    };
    $('btn-tip').onclick = function () {
      var m = $('tip-modal');
      if (!m.hidden) { m.hidden = true; return; }
      var s = STATIONS[state.step];
      m.innerHTML = '<h4>💡 Teacher Notes · ' + s.title + '</h4>' + (s.tips || []).map(function (t, i) { return '<p>' + (i + 1) + '. ' + t + '</p>'; }).join('');
      m.hidden = false;
    };
    window.ProLesson = { state: state, STATIONS: STATIONS, goStep: goStep };
    goStep(0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
