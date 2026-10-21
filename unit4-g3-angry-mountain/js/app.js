/* Grade 3 · Unit 4 · Lesson 3 (pp. 65–69): Hybrid Pro Smartboard Controller */
(function (window) {
  'use strict';
  var D = window.L3Data, A = window.ProAudio;
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    step: 0,
    stars: 0,
    turn: 0,
    scores: [0, 0, 0, 0],
    host: 'bubbles',
    lastSpeech: '',
    visitedWords: {},
    doneSteps: {}
  };

  var STATIONS = [
    { title: '1 · Island Explorer Map (Words, p. 67)', mins: '7 min', sub: 'Tap 5 Island Spots + Team Mime', host: 'bubbles', bg: 'bg_beach_volcano',
      youdo: ['👆 Tap a glowing spot on the island', '🗣️ Say the word + NOUN/VERB', '🎭 Whole team mimes it!'],
      say: ['The mountain sounded like thunder!', 'Hot ash fell from the sky.', 'We saw a ship at sunrise!'],
      tips: ['Book p. 67 Words in Context: thunder, bark, ash, dream, sunrise.', 'Tap each of the 5 island hotspots to walk there, reveal the 3D card and part-of-speech badge, and mime it together. Then click "🎯 Quick Team Clue Check" to test all 4 teams!'],
      run: renderStation1Words },
    { title: '2 · Cause & Effect Gear Machine (p. 65)', mins: '7 min', sub: 'Why It Happened → What Happened', host: 'nova', bg: 'bg_beach_volcano',
      youdo: ['⚙️ Look at the CAUSE (Why)', '⚡ Connect the EFFECT (What happened)', '🗣️ Say the sentence with SO or BECAUSE'],
      say: ['Smoke came out, so the sky turned dark.', 'They got in the boat because stones fell.'],
      tips: ['Book p. 65 Get Ready to Read: Cause and Effect ("A cause is why something happens. The effect is what happens.").', 'First click through the 4 animated gear examples in Teach Mode, then switch to "🏆 Team Gear Challenge" so each team matches a Cause and Effect!'],
      run: renderStation2Gears },
    { title: '3 · Act-It-Out Story Theater (pp. 66–69)', mins: '8 min', sub: '5 Interactive Chapters + TPR Acting', host: 'blaze', bg: 'bg_beach_volcano',
      youdo: ['🧍 Stand up & act out the chapter', '👂 Listen to the story scene', '👆 Answer the scene check question'],
      say: ['She climbed up a tall palm tree.', 'Papa put the family in the wooden boat.', 'At sunrise, they saw a big ship!'],
      tips: ['Book pp. 66–69 Fiction Reading: "The Angry Mountain" (Mount Tambora, 1815).', 'Do the physical TPR action in the yellow banner first so every pupil moves, then let the active team answer the picture question at the bottom!'],
      run: renderStation3Story },
    { title: '4 · Sail to the Rescue Ship! (pp. 66–69)', mins: '10 min', sub: 'Arcade Boat Race Across the Sea', host: 'rosie', bg: 'bg_sea_sunrise',
      youdo: ['🤝 Talk in your team (10s)', '👆 Tap the right story answer', '💨 Blow wind into the boat sail!'],
      say: ['Blow wind into the sail!', 'The boat is sailing to the big ship!', 'We are safe at sunrise!'],
      tips: ['Book pp. 66–69 & p. 65 review race: 6 questions propel Papa’s wooden outrigger boat from smoky Mount Tambora to the rescue ship at sunrise.', 'Wrong taps trigger a gentle wobble and supportive hint from Rosie with zero point deductions.'],
      run: renderStation4BoatRace },
    { title: '5 · Rescue Podium & Door Pass', mins: '3 min', sub: 'Celebration & Speaking Exit Ticket', host: 'sprout', bg: 'bg_sea_sunrise',
      youdo: ['🏆 Cheer for every team!', '⭐ Check our class Rescue Stars', '🚪 Say 1 sentence at the door'],
      say: ['Smoke came out, so the sky turned dark.', 'The family escaped in a wooden boat.', 'At sunrise, they saw a big ship!'],
      tips: ['Celebrate all 4 teams! Have each pupil tap or say one Door Pass sentence before lining up.'],
      run: renderStation5Podium }
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

  /* Monster Host Controller (idle + blink + mouth-flap talk + cheer/oops) */
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

  /* ---------------- STATION 1: ISLAND EXPLORER MAP & WORDS (p. 67) ---------------- */
  function renderStation1Words(body) {
    setHost('bubbles', 'Tap the 5 glowing places on the island to discover our 5 volcano words! Then we will play the Team Clue Check!', false);
    var mode = 'explore'; // 'explore' | 'quiz'
    var topRow = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:10px;' });
    var countBadge = el('span', { class: 'pro-pill amber', text: '🎒 Island Backpack: ' + Object.keys(state.visitedWords).length + ' / 5 words found' });
    var modeBtn = el('button', { class: 'pro-btn violet', type: 'button', text: '🎯 Play Team Clue Check ▶', onclick: function () {
      A.tap(); mode = (mode === 'explore') ? 'quiz' : 'explore';
      draw();
    } });
    topRow.appendChild(countBadge); topRow.appendChild(modeBtn);
    var content = el('div', { style: 'display:flex;flex-direction:column;gap:10px;flex:1;' });
    body.appendChild(topRow); body.appendChild(content);

    function draw() {
      content.innerHTML = '';
      modeBtn.textContent = mode === 'explore' ? '🎯 Play Team Clue Check ▶' : '🗺️ Back to Island Map';
      if (mode === 'explore') {
        var mapBox = el('div', { class: 'island-map-box', style: 'background-image:url(art/bg_beach_volcano.webp)' });
        var detailCard = el('div', { style: 'display:grid;grid-template-columns:130px 1fr auto;gap:14px;align-items:center;background:rgba(15,23,42,0.92);border:2px solid #38bdf8;border-radius:18px;padding:10px 16px;min-height:118px;' });
        detailCard.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;font-weight:800;">👆 Tap any glowing spot on the island beach above to inspect the word!</div>';

        D.words.forEach(function (w) {
          var spotBtn = el('button', {
            class: 'map-hotspot' + (state.visitedWords[w.id] ? ' visited' : ''),
            type: 'button',
            style: 'left:' + w.x + '%;top:' + w.y + '%;',
            onclick: function () {
              state.visitedWords[w.id] = true;
              spotBtn.classList.add('visited');
              countBadge.textContent = '🎒 Island Backpack: ' + Object.keys(state.visitedWords).length + ' / 5 words found';
              hostReact('cheer', w.w.toUpperCase() + '! ' + w.def + ' ' + w.ex, spotBtn);
              detailCard.innerHTML = '';
              detailCard.appendChild(el('div', { style: 'text-align:center;' }, [
                el('img', { src: 'art/' + w.art + '.webp', style: 'width:96px;height:96px;object-fit:contain;' })
              ]));
              detailCard.appendChild(el('div', {}, [
                el('div', { style: 'display:flex;align-items:center;gap:8px;margin-bottom:4px;' }, [
                  el('b', { style: 'font-size:1.35rem;color:#fde047;', text: w.w }),
                  el('span', { style: 'background:' + w.posCol + ';color:#0f172a;font-weight:900;font-size:0.72rem;padding:2px 8px;border-radius:999px;', text: w.pos })
                ]),
                el('div', { style: 'font-size:0.92rem;color:#e2e8f0;margin-bottom:4px;', text: w.def }),
                el('div', { style: 'font-size:0.9rem;color:#38bdf8;font-weight:800;', text: '📖 "' + w.ex + '"' }),
                el('div', { style: 'font-size:0.85rem;color:#6ee7b7;font-weight:800;margin-top:4px;', text: '🎭 MIME IT: ' + w.mime })
              ]));
              detailCard.appendChild(el('button', { class: 'pro-btn green', type: 'button', text: '🔊 Hear & Mime +1', onclick: function () {
                addTeamPts(state.turn % D.teams.length, 1);
                state.turn++;
                speakHost(w.w + '. ' + w.ex);
              } }));
            }
          }, [el('span', { text: w.spot + ' · ' + w.w.toUpperCase() })]);
          mapBox.appendChild(spotBtn);
        });
        content.appendChild(mapBox);
        content.appendChild(detailCard);
      } else {
        var qIdx = 0;
        var qBanner = el('div', { style: 'background:rgba(2,6,23,0.8);border:2px solid #f59e0b;border-radius:16px;padding:12px 16px;font-size:1.1rem;font-weight:900;color:#fde047;display:flex;justify-content:space-between;align-items:center;' });
        var grid = el('div', { class: 'pro-card-grid' });
        content.appendChild(qBanner); content.appendChild(grid);

        function loadClue() {
          var target = D.words[qIdx % D.words.length];
          var team = D.teams[state.turn % D.teams.length];
          qBanner.innerHTML = '<span>' + team.e + ' <b>' + team.n + '’s Turn:</b> ' + target.def + '</span>';
          setHost('bubbles', team.n + ', which word means: ' + target.def, true);
          grid.innerHTML = '';
          D.words.forEach(function (w) {
            var card = el('div', { class: 'pro-card3d', onclick: function () {
              if (w.id === target.id) {
                card.classList.add('right');
                addTeamPts(state.turn % D.teams.length, 2);
                state.turn++;
                hostReact('cheer', 'Yes! ' + w.w + '! ' + w.ex, card);
                setTimeout(function () { qIdx++; loadClue(); }, 1100);
              } else {
                card.classList.add('wrong');
                hostReact('oops', 'Almost! Listen to the clue again: ' + target.def);
              }
            } }, [
              el('span', { class: 'pos-tag', style: 'background:' + w.posCol, text: w.pos }),
              el('div', { class: 'art-box' }, [el('img', { src: 'art/' + w.art + '.webp', alt: w.w })]),
              el('div', { class: 'cap-tray', text: w.w })
            ]);
            grid.appendChild(card);
          });
        }
        loadClue();
      }
    }
    draw();
  }

  /* ---------------- STATION 2: CAUSE & EFFECT GEAR MACHINE (p. 65) ---------------- */
  function renderStation2Gears(body) {
    var idx = 0;
    var connector = 'SO';
    setHost('nova', 'A CAUSE is WHY something happens. An EFFECT is WHAT happens next! Tap an Effect card on the right to lock the gears!', false);

    var headBar = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;' });
    var teamLbl = el('span', { class: 'pro-pill amber' });
    var toggleBtn = el('button', { class: 'pro-btn violet', type: 'button', text: '🔄 Connector: SO (tap to switch to BECAUSE)', onclick: function () {
      A.tap(); connector = (connector === 'SO') ? 'BECAUSE' : 'SO';
      toggleBtn.textContent = '🔄 Connector: ' + connector + ' (tap to switch)';
      updateMachine();
    } });
    headBar.appendChild(teamLbl); headBar.appendChild(toggleBtn);

    var machine = el('div', { class: 'gear-machine' });
    var choicesRow = el('div', { class: 'pro-card-grid' });
    body.appendChild(headBar); body.appendChild(machine); body.appendChild(choicesRow);

    function updateMachine() {
      var item = D.causeEffect[idx % D.causeEffect.length];
      var team = D.teams[state.turn % D.teams.length];
      teamLbl.textContent = team.e + ' ' + team.n + ' · Gear Pair ' + ((idx % D.causeEffect.length) + 1) + ' of ' + D.causeEffect.length;
      machine.innerHTML = '';
      machine.appendChild(el('div', { class: 'gear-slot filled' }, [
        el('span', { class: 'pro-pill', text: '⚙️ CAUSE (Why it happened)' }),
        el('img', { src: 'art/' + item.causeArt + '.webp', style: 'width:76px;height:76px;object-fit:contain;' }),
        el('b', { style: 'font-size:0.98rem;color:#fde047;', text: item.cause })
      ]));
      machine.appendChild(el('div', { class: 'gear-bridge' }, [
        el('div', { style: 'font-size:1.8rem;', text: '⚙️➡️⚡' }),
        el('span', { class: 'pro-pill amber', text: connector })
      ]));
      var effectSlot = el('div', { class: 'gear-slot', id: 'gear-effect-slot' }, [
        el('span', { class: 'pro-pill', text: '⚡ EFFECT (What happened next?)' }),
        el('div', { style: 'color:#94a3b8;font-weight:800;margin-top:14px;', text: '👇 Tap the matching Effect card below!' })
      ]);
      machine.appendChild(effectSlot);

      choicesRow.innerHTML = '';
      D.causeEffect.forEach(function (opt) {
        var card = el('div', { class: 'pro-card3d', style: 'min-height:145px;', onclick: function () {
          if (opt.effect === item.effect) {
            card.classList.add('right');
            var sent = connector === 'SO' ? item.soSent : item.becSent;
            effectSlot.className = 'gear-slot filled';
            effectSlot.innerHTML = '';
            effectSlot.appendChild(el('span', { class: 'pro-pill amber', text: '⚡ EFFECT LOCKED!' }));
            effectSlot.appendChild(el('img', { src: 'art/' + item.effectArt + '.webp', style: 'width:72px;height:72px;object-fit:contain;' }));
            effectSlot.appendChild(el('b', { style: 'color:#6ee7b7;font-size:0.95rem;', text: sent }));
            addTeamPts(state.turn % D.teams.length, 2);
            state.turn++;
            hostReact('cheer', sent, card);
            setTimeout(function () { idx++; updateMachine(); }, 1800);
          } else {
            card.classList.add('wrong');
            hostReact('oops', 'Think again: what happened right after "' + item.cause + '"?');
          }
        } }, [
          el('div', { class: 'art-box', style: 'height:76px;' }, [el('img', { src: 'art/' + opt.effectArt + '.webp', style: 'max-width:70px;max-height:70px;' })]),
          el('div', { class: 'cap-tray', style: 'font-size:0.86rem;', text: opt.effect })
        ]);
        choicesRow.appendChild(card);
      });
    }
    updateMachine();
  }

  /* ---------------- STATION 3: INTERACTIVE 5-SCENE STORY THEATER (pp. 66-69) ---------------- */
  function renderStation3Story(body) {
    var chIdx = 0;
    setHost('blaze', 'Stand up, everyone! Let’s act out all 5 chapters of The Angry Mountain together!', false);

    var navRow = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:8px;' });
    var chTabs = el('div', { style: 'display:flex;gap:6px;' });
    var card = el('div', { style: 'display:grid;grid-template-columns:210px 1fr;gap:16px;align-items:center;background:rgba(2,6,23,0.72);border:2px solid rgba(56,189,248,0.4);border-radius:20px;padding:14px 18px;flex:1;' });
    body.appendChild(navRow); body.appendChild(card);

    function drawChapter() {
      var ch = D.chapters[chIdx];
      $('pro-bg').style.backgroundImage = 'url(art/' + ch.bg + '.webp)';
      chTabs.innerHTML = '';
      D.chapters.forEach(function (c, i) {
        chTabs.appendChild(el('button', {
          class: 'pro-btn ' + (i === chIdx ? 'amber' : 'ghost'),
          style: 'padding:6px 12px;font-size:0.8rem;',
          type: 'button',
          text: 'Scene ' + c.num,
          onclick: function () { A.tap(); chIdx = i; drawChapter(); }
        }));
      });
      navRow.innerHTML = '';
      navRow.appendChild(chTabs);
      navRow.appendChild(el('button', { class: 'pro-btn green', type: 'button', text: '🔊 Read Scene Aloud', onclick: function () {
        setHost('blaze', ch.story, true);
      } }));

      card.innerHTML = '';
      card.appendChild(el('div', { style: 'text-align:center;' }, [
        el('img', { src: 'art/' + ch.art + '.webp', style: 'width:185px;height:185px;object-fit:contain;filter:drop-shadow(0 12px 20px rgba(0,0,0,0.55));' })
      ]));

      var rightCol = el('div', { style: 'display:flex;flex-direction:column;gap:8px;' }, [
        el('h3', { style: 'margin:0;color:#38bdf8;font-size:1.15rem;', text: ch.title }),
        el('p', { style: 'margin:0;font-size:1.02rem;line-height:1.42;color:#f8fafc;font-weight:700;', text: ch.story }),
        el('div', { style: 'background:rgba(245,158,11,0.18);border:1.5px solid #f59e0b;border-radius:12px;padding:7px 12px;color:#fde68a;font-weight:800;font-size:0.88rem;', text: ch.tpr }),
        el('div', { style: 'font-weight:900;color:#a7f3d0;font-size:0.92rem;margin-top:2px;', text: '❓ Scene Check: ' + ch.q })
      ]);

      var optsWrap = el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;' });
      ch.opts.forEach(function (optText, oi) {
        optsWrap.appendChild(el('button', { class: 'pro-btn ghost', style: 'font-size:0.86rem;padding:8px 14px;', type: 'button', text: optText, onclick: function (ev) {
          if (oi === ch.ans) {
            ev.currentTarget.className = 'pro-btn green';
            addTeamPts(state.turn % D.teams.length, 2);
            state.turn++;
            hostReact('cheer', 'Spot on! ' + optText + '!', ev.currentTarget);
            if (chIdx < D.chapters.length - 1) {
              setTimeout(function () { chIdx++; drawChapter(); }, 1200);
            }
          } else {
            hostReact('oops', 'Listen closely to Scene ' + ch.num + ' and try again!');
          }
        } }));
      });
      rightCol.appendChild(optsWrap);
      card.appendChild(rightCol);
    }
    drawChapter();
  }

  /* ---------------- STATION 4: SAIL TO THE RESCUE SHIP! (Arcade Boat Race, pp. 66-69) ---------------- */
  function renderStation4BoatRace(body) {
    var step = 0, total = D.raceQuestions.length;
    setHost('rosie', 'Help Papa sail the wooden boat away from Mount Tambora to the rescue ship! Every right answer blows wind into the sail!', false);

    var track = el('div', { class: 'sail-race-track', style: 'background-image:url(art/bg_sea_sunrise.webp)' }, [
      el('div', { class: 'sail-wave-overlay' }),
      el('img', { src: 'art/o_volcano.webp', style: 'position:absolute;left:12px;bottom:14px;width:96px;height:96px;object-fit:contain;z-index:2;' }),
      el('img', { src: 'art/o_ship.webp', style: 'position:absolute;right:14px;bottom:14px;width:105px;height:105px;object-fit:contain;z-index:2;' })
    ]);
    var boatImg = el('img', { class: 'sail-sprite', src: 'art/o_boat.webp', style: 'left:14%;z-index:3;' });
    track.appendChild(boatImg);

    var qBox = el('div', { style: 'background:rgba(15,23,42,0.92);border:2px solid #38bdf8;border-radius:18px;padding:12px 16px;display:flex;flex-direction:column;gap:10px;' });
    body.appendChild(track); body.appendChild(qBox);

    function renderRaceQ() {
      var pct = 14 + Math.round((step / total) * 68);
      boatImg.style.left = pct + '%';
      qBox.innerHTML = '';
      if (step >= total) {
        A.fanfare();
        qBox.innerHTML = '<div style="text-align:center;padding:12px;"><h3 style="color:#fde047;font-size:1.4rem;margin:0 0 6px;">🚢 RESCUED AT SUNRISE!</h3><p style="margin:0 0 10px;color:#e2e8f0;font-weight:800;">The family reached the big rescue ship safely!</p></div>';
        var replayBtn = el('button', { class: 'pro-btn amber', type: 'button', text: '🔁 Sail Again', onclick: function () { step = 0; renderRaceQ(); } });
        qBox.firstChild.appendChild(replayBtn);
        return;
      }
      var item = D.raceQuestions[step];
      var team = D.teams[state.turn % D.teams.length];
      qBox.appendChild(el('div', { style: 'display:flex;align-items:center;gap:12px;' }, [
        el('img', { src: 'art/' + item.art + '.webp', style: 'width:68px;height:68px;object-fit:contain;' }),
        el('div', {}, [
          el('div', { style: 'color:#fde047;font-weight:900;font-size:0.85rem;', text: team.e + ' ' + team.n + '’s Wind Gust (' + (step + 1) + ' / ' + total + ')' }),
          el('div', { style: 'font-size:1.1rem;font-weight:900;color:#fff;', text: item.q })
        ])
      ]));
      var row = el('div', { style: 'display:grid;grid-template-columns:repeat(3,1fr);gap:10px;' });
      item.opts.forEach(function (opt) {
        row.appendChild(el('button', { class: 'pro-btn ghost', style: 'font-size:0.92rem;padding:12px;', type: 'button', text: opt, onclick: function (ev) {
          if (opt === item.a) {
            ev.currentTarget.className = 'pro-btn green';
            addTeamPts(state.turn % D.teams.length, 2);
            state.turn++;
            step++;
            hostReact('cheer', 'WHOOSH! Great wind gust! "' + opt + '"!', ev.currentTarget);
            setTimeout(renderRaceQ, 900);
          } else {
            hostReact('oops', 'Not that wave! Try another answer to blow wind into the sail!');
          }
        } }));
      });
      qBox.appendChild(row);
    }
    renderRaceQ();
  }

  /* ---------------- STATION 5: RESCUE PODIUM & DOOR PASS ---------------- */
  function renderStation5Podium(body) {
    A.fanfare();
    setHost('sprout', 'Hooray! You escaped Mount Tambora and learned all 5 volcano words and Cause & Effect! Tap a Door Pass sentence below!', true);
    var castStrip = el('div', { style: 'display:flex;justify-content:center;gap:14px;' });
    ['bubbles', 'nova', 'blaze', 'rosie', 'sprout'].forEach(function (w) {
      castStrip.appendChild(el('img', { src: 'cast/' + w + '_idle.webp', style: 'width:82px;height:82px;object-fit:contain;animation:hostIdleBob 2.6s ease-in-out infinite;' }));
    });
    var scoreGrid = el('div', { class: 'pro-card-grid' });
    D.teams.forEach(function (t, i) {
      scoreGrid.appendChild(el('div', { class: 'pro-card3d', style: 'min-height:110px;border-color:' + t.c }, [
        el('div', { style: 'font-size:2rem;', text: '🏆 ' + t.e }),
        el('b', { style: 'font-size:1.1rem;color:#fff;', text: t.n }),
        el('div', { class: 'pro-pill amber', text: state.scores[i] + ' Points' })
      ]));
    });
    body.appendChild(castStrip);
    body.appendChild(scoreGrid);
  }

  /* ---------------- BOOT ---------------- */
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
