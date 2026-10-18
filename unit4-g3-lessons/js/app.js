/* ============================================================================
   UNIT 4 GRADE 3: WHAT HAPPENED? • DETECTIVE ACADEMY PRO SMARTBOARD ENGINE
   65/35 Full-Bleed Hero Stage • Grounded 3D Pedestals • Karaoke Read-Along •
   Past-Tense Time Machine • Animated Heist Track • Interactive Newspaper & Face Studio
   ============================================================================ */
(function () {
  'use strict';
  var D = window.U4G3Data, A = window.ForestAudio;
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag), k;
    attrs = attrs || {};
    for (k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'style') e.style.cssText = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (n) {
      if (n != null) e.appendChild(typeof n === 'string' ? document.createTextNode(n) : n);
    });
    return e;
  }
  function shuffle(a) {
    var b = a.slice(), i, j, t;
    for (i = b.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }
  function sfx(n) { if (A && A.play) A.play(n); }
  function btn(text, cls, fn) {
    return h('button', { type: 'button', class: 'btn ' + (cls || ''), text: text, onclick: fn });
  }

  /* ---------- Complete 3D Artwork & Pedestal Renderer ---------- */
  var HAS = {};
  var ART = {
    '🗽': 'o_statue',
    '🕵️': 'c_daphne_case',
    '🏛️': 'o_mona_frame',
    '🖼️': 'o_mona_frame',
    '🎨': 'o_mona_frame',
    '👮': 'o_police',
    '📰': 'o_newspaper',
    '📝': 'o_plan',
    '🥷': 'o_steal',
    '🚶': 'o_steal',
    '🧥': 'o_steal',
    '🏋️': 'o_lifted',
    '🚨': 'o_robbery',
    '📞': 'o_robbery',
    '🔍': 'c_daphne_case'
  };

  function hasArt(name) { return !!(name && HAS[name]); }
  function resolveArtName(e, explicitName) {
    if (explicitName && hasArt(explicitName)) return explicitName;
    if (e && ART[e] && hasArt(ART[e])) return ART[e];
    return null;
  }
  function imgEl(name, fallbackEmoji, cls) {
    var im = h('img', {
      class: 'pic' + (cls ? ' ' + cls : ''),
      src: 'art/' + name + '.webp',
      alt: fallbackEmoji || name,
      draggable: 'false'
    });
    im.addEventListener('error', function () {
      var sp = document.createElement('span');
      sp.textContent = fallbackEmoji || '🔍';
      if (im.parentNode) im.parentNode.replaceChild(sp, im);
    });
    return im;
  }

  /* Renders a grounded 3D hero figure on a glowing isometric reflection pedestal */
  function heroFigure(artName, fallbackEmoji, heightVh, amberPedestal) {
    var resolved = resolveArtName(fallbackEmoji, artName);
    var wrap = h('div', {
      class: 'hero-pedestal-wrap',
      style: '--art-h:' + (heightVh || 22) + 'vh'
    });
    if (resolved) {
      wrap.appendChild(imgEl(resolved, fallbackEmoji, 'hero-art'));
    } else {
      wrap.appendChild(h('div', {
        class: 'hero-art',
        style: 'font-size:' + Math.round((heightVh || 22) * 0.72) + 'vh;line-height:1',
        text: fallbackEmoji || '🕵️'
      }));
    }
    wrap.appendChild(h('div', { class: 'pedestal-disc' + (amberPedestal ? ' amber' : '') }));
    return wrap;
  }

  function loadManifest(done) {
    var fin = false;
    function end() { if (!fin) { fin = true; done(); } }
    try {
      var x = new XMLHttpRequest();
      x.open('GET', 'art/manifest.json?v=' + Date.now(), true);
      x.onload = function () {
        try { JSON.parse(x.responseText).forEach(function (n) { HAS[n] = 1; }); } catch (e) { /* ignore */ }
        end();
      };
      x.onerror = end;
      x.send();
      setTimeout(end, 2000);
    } catch (e) { end(); }
  }

  /* ---------- Central Reactive State ---------- */
  var state = {
    lesson: 1,
    idx: -1,
    activeTeam: 0,
    scores: D.teams.map(function () { return 0; }),
    clues: { 1: 0, 2: 0 },
    solved: {},
    done: {},
    cleanups: []
  };

  /* ---------- Karaoke Speech Bar Engine ---------- */
  var karaokeInterval = null;
  function clearKaraoke() {
    if (karaokeInterval) { clearInterval(karaokeInterval); karaokeInterval = null; }
  }
  function createKaraokeBar(initialText, targetWord) {
    var textBox = h('div', { class: 'karaoke-text' });
    var speakBtn = btn('🔊 Listen & Repeat', 'small cyan', function () {
      playKaraoke(bar.currentText || initialText, bar.currentTarget || targetWord);
    });
    var bar = h('div', { class: 'karaoke-bar' }, [textBox, speakBtn]);

    function renderWords(sentence, highlightTarget) {
      bar.currentText = sentence;
      bar.currentTarget = highlightTarget;
      textBox.innerHTML = '';
      var words = String(sentence || '').split(/\s+/);
      var cleanTarget = String(highlightTarget || '').toLowerCase().replace(/[^a-z]/g, '');
      words.forEach(function (w) {
        var cleanW = w.toLowerCase().replace(/[^a-z]/g, '');
        var isTarget = cleanTarget && (cleanW === cleanTarget || cleanW.indexOf(cleanTarget) === 0);
        textBox.appendChild(h('span', {
          class: 'kw' + (isTarget ? ' target' : ''),
          text: w + ' '
        }));
      });
    }

    function playKaraoke(sentence, highlightTarget) {
      clearKaraoke();
      renderWords(sentence, highlightTarget);
      var spans = textBox.querySelectorAll('.kw');
      var idx = 0;
      A.speak(String(sentence).replace(/____/g, 'blank'));
      karaokeInterval = setInterval(function () {
        spans.forEach(function (sp, k) { sp.classList.toggle('sung', k === idx); });
        idx++;
        if (idx >= spans.length) {
          clearKaraoke();
          setTimeout(function () {
            spans.forEach(function (sp) { sp.classList.remove('sung'); });
          }, 450);
        }
      }, 310);
    }

    bar.setText = function (sentence, highlightTarget, autoSpeak) {
      renderWords(sentence, highlightTarget);
      if (autoSpeak) playKaraoke(sentence, highlightTarget);
    };
    renderWords(initialText, targetWord);
    return bar;
  }

  /* ---------- Unified Top HUD: Lesson Switcher, Clue Meter & Team Badges ---------- */
  function drawLessonTabs() {
    var box = $('lesson-tabs');
    if (!box) return;
    box.innerHTML = '';
    [
      { id: 1, label: '📁 Case 1: Picture on the Wall' },
      { id: 2, label: '📁 Case 2: Where Is She?' }
    ].forEach(function (tab) {
      box.appendChild(h('button', {
        type: 'button',
        class: 'btn ltab' + (state.lesson === tab.id ? ' on' : ' ghost'),
        text: tab.label,
        onclick: function () {
          if (state.lesson !== tab.id) go(tab.id, 0);
        }
      }));
    });
  }

  function drawHudCase() {
    var box = $('hud-case');
    if (!box) return;
    var L = state.lesson;
    var count = state.clues[L] || 0;
    var pct = Math.min(100, Math.round((count / D.goal) * 100));
    box.innerHTML = '';
    box.appendChild(h('span', {
      class: 'casetxt',
      text: (count >= D.goal ? '🏆 CASE SOLVED! ' : '🧩 Clues: ') + count + ' / ' + D.goal
    }));
    box.appendChild(h('div', { class: 'casetrack' }, [
      h('i', { class: 'casefill', style: 'width:' + pct + '%' })
    ]));
  }

  function addClue(n) {
    var L = state.lesson;
    state.clues[L] = Math.min(D.goal, Math.max(0, (state.clues[L] || 0) + n));
    drawHudCase();
    if (state.clues[L] >= D.goal && !state.solved[L]) {
      state.solved[L] = 1;
      sfx('win');
      confetti();
    }
  }

  function drawTeams() {
    var box = $('teams');
    if (!box) return;
    box.innerHTML = '';
    D.teams.forEach(function (t, i) {
      box.appendChild(h('div', {
        class: 'tm' + (state.activeTeam === i ? ' active-turn' : ''),
        style: '--c:' + t.c,
        id: 'tm' + i
      }, [
        h('button', {
          type: 'button',
          class: 'tm-main',
          title: 'Click to award +1 point to ' + t.n,
          onclick: function () { addPoint(i, 1); }
        }, [
          h('span', { text: t.e + ' ' + t.n }),
          h('b', { text: String(state.scores[i]) })
        ]),
        h('button', {
          type: 'button',
          class: 'tm-minus',
          text: '−',
          title: 'Remove 1 point',
          onclick: function () { addPoint(i, -1); }
        })
      ]));
    });
  }

  function setActiveTeam(i) {
    state.activeTeam = ((i % D.teams.length) + D.teams.length) % D.teams.length;
    D.teams.forEach(function (_, k) {
      var el = $('tm' + k);
      if (el) el.classList.toggle('active-turn', k === state.activeTeam);
    });
  }

  function addPoint(i, n) {
    state.scores[i] = Math.max(0, state.scores[i] + n);
    sfx(n > 0 ? 'coin' : 'tap');
    var el = $('tm' + i);
    if (el) {
      el.querySelector('b').textContent = state.scores[i];
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    }
    if (n > 0 && window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
      try { window.AdventureAcademy.awardXP(n * 5, 'Unit 4 Detective Academy'); } catch (e) { /* ignore */ }
    }
  }

  /* ---------- Visual Celebrations & Timers ---------- */
  function confetti() {
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🔍', '🏆', '🖼️'], k;
    var w = h('div', { class: 'confetti' });
    for (k = 0; k < 28; k++) {
      w.appendChild(h('i', {
        text: em[k % em.length],
        style: 'left:' + Math.random() * 96 + '%;animation-delay:' + Math.random() * 0.5 + 's;font-size:' + (2.4 + Math.random() * 2.4) + 'vh'
      }));
    }
    host.appendChild(w);
    setTimeout(function () { w.remove(); }, 2400);
  }

  function timerBtn(c, sec, onStart, onEnd) {
    var left = sec, iv = null;
    var b = h('button', { type: 'button', class: 'btn small violet timer-btn' });
    function fmt() { return '⏱ ' + Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2); }
    function reset() {
      if (iv) { clearInterval(iv); iv = null; }
      left = sec; b.textContent = fmt();
      b.classList.remove('run', 'end');
      if (onEnd) onEnd(false);
    }
    b.textContent = fmt();
    b.addEventListener('click', function () {
      if (iv) { reset(); return; }
      b.classList.remove('end'); b.classList.add('run'); sfx('tap');
      if (onStart) onStart();
      iv = setInterval(function () {
        left--; b.textContent = fmt();
        if (left <= 0) {
          clearInterval(iv); iv = null;
          b.classList.remove('run'); b.classList.add('end');
          sfx('win');
          if (onEnd) onEnd(true);
          setTimeout(function () { left = sec; b.textContent = fmt(); b.classList.remove('end'); }, 3500);
        }
      }, 1000);
    });
    c.later(function () { if (iv) clearInterval(iv); });
    b.resetTimer = reset;
    return b;
  }

  function triggerSoftFail(el) {
    sfx('soft');
    if (!el) return;
    el.classList.remove('wob', 'wobble');
    void el.offsetWidth;
    el.classList.add('wob');
  }

  function teamTurnBanner(teamIdx, labelText, rightControls) {
    setActiveTeam(teamIdx);
    var t = D.teams[state.activeTeam];
    var bar = h('div', { class: 'gturn', style: '--c:' + t.c }, [
      h('span', { class: 'tn', text: t.e + ' Team ' + t.n + '’s Turn' }),
      h('span', { class: 'gb', text: labelText || '' })
    ]);
    if (rightControls && rightControls.length) {
      var r = h('div', { class: 'row', style: 'gap:0.8vh' }, rightControls);
      bar.appendChild(r);
    }
    return bar;
  }

  function renderPodium(host) {
    var order = D.teams.map(function (t, i) {
      return { t: t, s: state.scores[i] };
    }).sort(function (a, b) { return b.s - a.s; });
    var medals = ['🥇 1st', '🥈 2nd', '🥉 3rd', '⭐ 4th'];
    host.appendChild(h('div', { class: 'podium', style: 'min-height:26vh' }, order.map(function (o, k) {
      return h('div', {
        class: 'pod',
        style: '--c:' + o.t.c + ';height:' + (26 - k * 3.5) + 'vh'
      }, [
        h('div', { class: 'em', text: o.t.e }),
        h('div', { text: medals[k] + ' · ' + o.t.n }),
        h('b', { text: o.s + ' pts' })
      ]);
    })));
  }

  /* =========================================================================
     LESSON 1: CASE FILE 1 · A PICTURE ON THE WALL (Book pp. 56-59)
     ========================================================================= */

  /* L1-1: Case Opening & Statue Mystery (Book p. 56) */
  function caseOpen(c) {
    var stepIdx = -1;
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var stageContent = h('div', { class: 'statue-stage' }, [
      heroFigure('c_daphne_case', '🕵️', 27, false),
      heroFigure('o_statue', '🗽', 30, true),
      heroFigure('o_mona_frame', '🖼️', 26, false)
    ]);
    viewport.appendChild(stageContent);

    var kBar = createKaraokeBar(D.hook1[0], 'Detective');
    var missionRow = h('div', { class: 'missions', style: 'display:none;grid-template-columns:repeat(6,1fr);gap:0.8vh' });
    D.c1missions.forEach(function (m, k) {
      missionRow.appendChild(h('div', { class: 'mission', style: 'padding:0.7vh' }, [
        h('div', { class: 'num', text: String(k + 1) }),
        heroFigure(m.a, m.e, 7, false),
        h('div', { style: 'font-size:0.75em;margin-top:0.3vh', text: m.t })
      ]));
    });

    var nextPromptBtn = btn('🔍 Next Detective Clue ▶', 'amber big', function () {
      stepIdx++;
      if (stepIdx < D.hook1.length) {
        sfx('page');
        kBar.setText(D.hook1[stepIdx], 'happened', true);
        if (stepIdx === D.hook1.length - 1) {
          nextPromptBtn.textContent = '🗂️ Open the 6 Case Missions ▶';
        }
      } else {
        sfx('win');
        addClue(2);
        stageContent.style.display = 'none';
        missionRow.style.display = 'grid';
        viewport.appendChild(missionRow);
        kBar.setText('Case File 1 is open! Complete all 6 missions to earn 20 clues and solve the mystery!', 'missions', true);
        nextPromptBtn.textContent = '✅ Ready! Go to Step 2 ▶';
        nextPromptBtn.onclick = function () { $('next').click(); };
      }
    });

    tray.appendChild(kBar);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('span', { class: 'pill amber', text: '📖 Book p. 56 · Unit 4 Opener' }),
      nextPromptBtn
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
  }

  /* L1-2: Interactive Statue Hotspots — Think, Pair, Share (Book p. 57) */
  function tpsScene(c) {
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var cur = 0, solvedHotspots = {};
    var qBox = h('div', { class: 'bubble left', style: 'min-height:8vh;display:flex;flex-direction:column;justify-content:center' });
    var aBox = h('div', { class: 'bubble right', style: 'min-height:8vh;display:flex;flex-direction:column;justify-content:center' });

    var statueWrap = h('div', { class: 'statue-stage' }, [
      heroFigure('c_daphne_case', '🕵️', 22, false),
      heroFigure('o_statue', '🗽', 28, true)
    ]);

    var dialogCol = h('div', { class: 'col', style: 'width:52%;gap:1vh;z-index:5' }, [qBox, aBox]);
    statueWrap.appendChild(dialogCol);

    var hotBtns = D.tps.map(function (item, idx) {
      var hb = h('button', {
        type: 'button',
        class: 'btn hotspot-btn',
        style: 'left:' + item.x + ';top:' + item.y,
        text: '🔍 Clue ' + (idx + 1),
        onclick: function () { selectClue(idx); }
      });
      viewport.appendChild(hb);
      return hb;
    });

    viewport.appendChild(statueWrap);

    var kBar = createKaraokeBar(D.tps[0].q, 'park');

    function selectClue(i) {
      cur = i;
      var item = D.tps[i];
      sfx('page');
      qBox.innerHTML = '<small>🕵️ DETECTIVE QUESTION (' + item.badge + ')</small>' + item.q;
      aBox.innerHTML = '<small>👥 THINK, PAIR, SHARE FRAME</small>🗣️ "' + item.frame + '"';
      kBar.setText(item.q, 'think', true);
    }

    var revealBtn = btn('💡 Reveal Model Answer (+1 Clue)', 'violet', function () {
      var item = D.tps[cur];
      aBox.innerHTML = '<small>✅ MODEL ANSWER</small>🌟 "' + item.a + '"';
      kBar.setText(item.a, 'decoration', true);
      sfx('correct');
      if (!solvedHotspots[cur]) {
        solvedHotspots[cur] = 1;
        hotBtns[cur].classList.add('done');
        hotBtns[cur].textContent = '✓ Clue ' + (cur + 1);
        addClue(1);
      }
    });

    var chipRow = h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, D.tps.map(function (t, i) {
        return btn('🔍 ' + (i + 1) + '. ' + t.q, 'small cyan', function () { selectClue(i); });
      })),
      h('div', { class: 'row' }, [
        timerBtn(c, 15),
        revealBtn,
        btn('🏆 Team Shared (+1 Pt)', 'green small', function () {
          addPoint(state.activeTeam, 1);
          setActiveTeam(state.activeTeam + 1);
        })
      ])
    ]);

    tray.appendChild(kBar);
    tray.appendChild(chipRow);
    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    selectClue(0);
  }

  /* L1-3: Interactive Split-Screen Museum — Spot the 5 Changes (Book p. 57 E) */
  function spotChanges(c) {
    var seen = {}, activeIdx = 0;
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var wingBefore = h('div', { class: 'museum-wing before' });
    var wingAfter = h('div', { class: 'museum-wing after' });
    var arrowMid = h('div', { class: 'tm-gear' }, [
      h('span', { text: '⚡' }),
      h('small', { style: 'font-size:0.35em;color:#7dd3fc', text: 'COMPARE' })
    ]);

    var splitGrid = h('div', { class: 'split-museum' }, [wingBefore, arrowMid, wingAfter]);
    viewport.appendChild(splitGrid);

    var kBar = createKaraokeBar('Tap any of the 5 museum clues below to compare Picture 1 (1911) and Picture 2 (Today)!', 'picture');
    var chipButtons = [];

    function renderComparison(idx, speakIt) {
      activeIdx = idx;
      var item = D.changes[idx];
      chipButtons.forEach(function (b, k) { b.classList.toggle('active', k === idx); });

      wingBefore.innerHTML = '';
      wingBefore.appendChild(h('span', { class: 'wing-badge', text: '🕯️ PICTURE 1 · 1911 ROBBERY' }));
      wingBefore.appendChild(heroFigure(item.artB, item.icon, 19, false));
      wingBefore.appendChild(h('div', { class: 'wing-caption', html: '<b style="color:#fda4af">' + item.labelB + '</b><br>' + item.sb }));

      wingAfter.innerHTML = '';
      wingAfter.appendChild(h('span', { class: 'wing-badge', text: '✨ PICTURE 2 · MUSEUM TODAY' }));
      wingAfter.appendChild(heroFigure(item.artA, item.icon, 19, true));
      wingAfter.appendChild(h('div', { class: 'wing-caption', html: '<b style="color:#6ee7b7">' + item.labelA + '</b><br>' + item.sa }));

      var combined = 'In picture one, ' + item.sb.charAt(0).toLowerCase() + item.sb.slice(1) + ' In picture two, ' + item.sa.charAt(0).toLowerCase() + item.sa.slice(1);
      kBar.setText(combined, 'picture', speakIt);

      if (!seen[idx]) {
        seen[idx] = 1;
        chipButtons[idx].classList.add('seen');
        addClue(1);
      }
      if (speakIt) sfx('correct');
    }

    var chipsRow = h('div', { class: 'row', style: 'justify-content:space-between' });
    var leftChips = h('div', { class: 'row' });
    D.changes.forEach(function (ch, idx) {
      var b = btn(ch.icon + ' ' + ch.w, 'change-chip cyan', function () {
        renderComparison(idx, true);
      });
      chipButtons.push(b);
      leftChips.appendChild(b);
    });

    chipsRow.appendChild(leftChips);
    chipsRow.appendChild(h('div', { class: 'row' }, [
      timerBtn(c, 45),
      btn('⭐ Team Spoke (+1 Pt)', 'green small', function () {
        addPoint(state.activeTeam, 1);
        setActiveTeam(state.activeTeam + 1);
      })
    ]));

    tray.appendChild(kBar);
    tray.appendChild(chipsRow);
    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    renderComparison(0, false);
  }

  /* L1-4: 3D Detective Evidence Locker + Mime & Gap-Fill (Book p. 59) */
  function wordsScene(c) {
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var grid = h('div', { class: 'evidence-grid' });
    var cardEls = [];
    var inspected = {};
    var activeWord = D.words[0];
    var mimeMode = false;

    var kBar = createKaraokeBar('Tap each 3D Evidence Card to inspect the word, meaning, and example sentence!', 'plan');
    var detailLine = h('div', { class: 'sentence', style: 'display:flex;justify-content:space-between;align-items:center' });

    function selectWord(w, idx, speakNow) {
      activeWord = w;
      mimeMode = false;
      cardEls.forEach(function (el, k) { el.classList.toggle('sel', k === idx); });
      detailLine.innerHTML = '<span><b style="color:#fde047;font-size:1.15em">' + w.w.toUpperCase() + '</b> (' + w.pos + '): ' + w.def + '</span><span style="color:#7dd3fc">🎭 Action: ' + w.mime + '</span>';
      kBar.setText(w.w + '. ' + w.ex, w.w, speakNow);
      if (!inspected[idx]) {
        inspected[idx] = 1;
        cardEls[idx].appendChild(h('span', { class: 'ev-stamp', text: '✓ CLUE' }));
        addClue(1);
      }
      if (speakNow) sfx('tap');
    }

    D.words.forEach(function (w, idx) {
      var card = h('div', {
        class: 'ev-card' + (idx === 0 ? ' sel' : ''),
        onclick: function () { selectWord(w, idx, true); }
      }, [
        h('span', { class: 'ev-pos', style: 'background:' + w.posColor, text: w.pos }),
        heroFigure(w.a, w.e, 16, false),
        h('div', { class: 'ev-word', text: w.w })
      ]);
      cardEls.push(card);
      grid.appendChild(card);
    });

    viewport.appendChild(grid);

    /* Interactive Clue & Mime Challenge */
    var mysteryTarget = null;
    var btnMime = btn('🎭 Secret Mime Challenge', 'violet', function () {
      mysteryTarget = D.words[Math.floor(Math.random() * D.words.length)];
      mimeMode = true;
      sfx('page');
      detailLine.innerHTML = '🤫 <b style="color:#fde047">ACTOR ONLY:</b> ' + mysteryTarget.mime + ' <span style="color:#86efac">(Team: Tap the right Evidence Card above to guess!)</span>';
      kBar.setText(mysteryTarget.gap, '', true);
    });

    var btnRevealGap = btn('💡 Reveal Answer', 'amber', function () {
      var w = mysteryTarget || activeWord;
      var idx = D.words.indexOf(w);
      selectWord(w, idx >= 0 ? idx : 0, true);
      sfx('correct');
    });

    /* Allow tapping a card during Mime Mode to score automatically! */
    cardEls.forEach(function (card, idx) {
      card.addEventListener('click', function () {
        if (mimeMode && mysteryTarget) {
          if (D.words[idx].w === mysteryTarget.w) {
            sfx('win');
            confetti();
            addPoint(state.activeTeam, 2);
            addClue(1);
            setActiveTeam(state.activeTeam + 1);
            selectWord(D.words[idx], idx, true);
          } else {
            triggerSoftFail(card);
          }
        }
      }, true);
    });

    tray.appendChild(detailLine);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      kBar,
      h('div', { class: 'row' }, [btnMime, btnRevealGap])
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    selectWord(D.words[0], 0, false);
  }

  /* L1-5: NEW! The Past-Tense Time Machine (Visual Grammar Lab before testing) */
  function grammarTimeMachine(c) {
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var mode = 'regular'; // 'regular' or 'irregular'
    var curIdx = 0;
    var transformed = false;

    var boxNow = h('div', { class: 'tm-box' });
    var gearMid = h('div', { class: 'tm-gear' });
    var boxPast = h('div', { class: 'tm-box past' });

    var machineGrid = h('div', { class: 'tm-machine' }, [boxNow, gearMid, boxPast]);
    viewport.appendChild(machineGrid);

    var kBar = createKaraokeBar('Welcome to the Past-Tense Time Machine! Tap "⚡ Weld +ED" to transform the verb into Yesterday!', 'walked');
    var verbButtonsRow = h('div', { class: 'row' });

    function currentList() {
      return mode === 'regular' ? D.grammarRegular : D.grammarIrregular;
    }

    function renderMachine(speakIt) {
      var list = currentList();
      var item = list[curIdx % list.length];

      boxNow.innerHTML = '';
      boxNow.appendChild(h('span', { class: 'pill', text: '☀️ TODAY (NOW)' }));
      boxNow.appendChild(heroFigure(item.a, '🕵️', 15, false));
      boxNow.appendChild(h('div', { class: 'tm-verb-big', text: item.base }));

      gearMid.innerHTML = '';
      var weldBtn = btn(
        mode === 'regular' ? '⚡ Weld +ed ▶' : '🔮 Time Warp ▶',
        mode === 'regular' ? 'amber big' : 'violet big',
        function () {
          transformed = true;
          sfx('correct');
          addClue(1);
          renderMachine(true);
        }
      );
      gearMid.appendChild(weldBtn);

      boxPast.innerHTML = '';
      boxPast.appendChild(h('span', { class: 'pill amber', text: '⏪ YESTERDAY (1911)' }));
      boxPast.appendChild(heroFigure(item.a, '🕵️', 15, true));

      if (transformed) {
        if (mode === 'regular') {
          boxPast.appendChild(h('div', {
            class: 'tm-verb-big',
            html: item.stem + '<span class="ed-chip">+' + item.suffix + '</span> = ' + item.past
          }));
        } else {
          boxPast.appendChild(h('div', {
            class: 'tm-verb-big',
            html: item.base + ' → <span class="irr-chip">' + item.past + '</span>'
          }));
        }
        kBar.setText(item.ex, item.past, speakIt);
      } else {
        boxPast.appendChild(h('div', { class: 'tm-verb-big', style: 'color:#64748b', text: '❓ Tap the button!' }));
        kBar.setText('Today I ' + item.base + '. Yesterday, what happened?', item.base, speakIt);
      }

      verbButtonsRow.innerHTML = '';
      list.forEach(function (v, idx) {
        verbButtonsRow.appendChild(btn(
          v.base + ' → ' + (transformed && idx === curIdx ? v.past : '?'),
          'small ' + (idx === curIdx ? 'amber' : 'ghost'),
          function () {
            curIdx = idx;
            transformed = true;
            sfx('correct');
            renderMachine(true);
          }
        ));
      });
    }

    var modeToggleReg = btn('⚙️ Regular Verbs (+ed)', 'cyan small', function () {
      mode = 'regular'; curIdx = 0; transformed = false; sfx('page'); renderMachine(false);
    });
    var modeToggleIrr = btn('🔮 Secret Irregular Verbs (took / hid / found)', 'violet small', function () {
      mode = 'irregular'; curIdx = 0; transformed = false; sfx('page'); renderMachine(false);
    });

    tray.appendChild(kBar);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      verbButtonsRow,
      h('div', { class: 'row' }, [modeToggleReg, modeToggleIrr])
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    renderMachine(false);
  }

  /* L1-6: Animated Museum Heist Track — Sneak to the Mona Lisa! */
  function sneakGame(c) {
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var stepPos = 0, MAX_STEPS = 6, phase = 'idle', iv = null;
    c.later(function () { if (iv) clearTimeout(iv); });

    var heistStage = h('div', { class: 'heist-stage' });
    var lightBadge = h('span', { class: 'heist-light green', text: '🛡️ GUARD READY · LINE UP AT THE BACK!' });
    var guardWrap = h('div', { class: 'row' }, [
      heroFigure('o_police', '👮', 10, false),
      lightBadge
    ]);
    var topBanner = h('div', { class: 'heist-top-banner' }, [
      guardWrap,
      h('span', { class: 'pill amber', id: 'heist-step-pill', text: 'Peruggia Position: Step 0 / 6' })
    ]);

    var corridor = h('div', { class: 'heist-corridor' });
    var tilesGrid = h('div', { class: 'heist-steps' });

    function drawCorridor() {
      tilesGrid.innerHTML = '';
      for (var s = 0; s <= MAX_STEPS; s++) {
        var tile = h('div', {
          class: 'heist-tile' + (s === stepPos ? ' active' : (s < stepPos ? ' passed' : ''))
        }, [
          h('span', { class: 'step-num', text: s === 0 ? 'START' : (s === MAX_STEPS ? 'MONA LISA' : 'STEP ' + s) })
        ]);
        if (s === stepPos) {
          tile.appendChild(heroFigure(s === MAX_STEPS ? 'o_lifted' : 'o_steal', '🥷', 12, true));
        } else if (s === MAX_STEPS) {
          tile.appendChild(heroFigure('o_mona_frame', '🖼️', 12, false));
        } else if (s < stepPos) {
          tile.appendChild(h('span', { style: 'font-size:3.5vh', text: '👣' }));
        }
        tilesGrid.appendChild(tile);
      }
      var pill = topBanner.querySelector('#heist-step-pill');
      if (pill) pill.textContent = 'Peruggia Position: Step ' + stepPos + ' / ' + MAX_STEPS;
    }

    corridor.appendChild(tilesGrid);
    heistStage.appendChild(topBanner);
    heistStage.appendChild(corridor);
    viewport.appendChild(heistStage);

    var kBar = createKaraokeBar('When the Guard turns around (GREEN), tiptoe forward! When the Guard looks (RED), FREEZE and say a past-tense sentence!', 'tiptoe');

    function stopPatrol() {
      if (iv) { clearTimeout(iv); iv = null; }
      phase = 'idle';
      lightBadge.className = 'heist-light green';
      lightBadge.textContent = '⏸️ PAUSED · READY FOR NEXT STEP';
    }

    function runPatrolCycle(p) {
      phase = p;
      if (p === 'green') {
        lightBadge.className = 'heist-light green';
        lightBadge.textContent = '🟢 GUARD TURNED! TIPTOE FORWARD!';
        sfx('page');
        A.speak('Tiptoe! Go, go, go!');
        if (stepPos < MAX_STEPS) {
          stepPos++;
          drawCorridor();
        }
      } else {
        lightBadge.className = 'heist-light red';
        lightBadge.textContent = '🛑 GUARD LOOKING! FREEZE!';
        sfx('soft');
        A.speak('Freeze!');
      }
      if (stepPos >= MAX_STEPS) {
        stopPatrol();
        lightBadge.className = 'heist-light green';
        lightBadge.textContent = '🎉 HE LIFTED THE PAINTING! SAY: "I TOOK THE PAINTING!"';
        sfx('win');
        confetti();
        kBar.setText('I lifted the painting off the wall! I took the Mona Lisa!', 'lifted', true);
        return;
      }
      iv = setTimeout(function () {
        runPatrolCycle(p === 'green' ? 'red' : 'green');
      }, p === 'green' ? 2400 : 2100);
    }

    var startBtn = btn('▶ Start Guard Patrol', 'green big', function () {
      if (stepPos >= MAX_STEPS) stepPos = 0;
      stopPatrol();
      runPatrolCycle('green');
    });

    var stepBtn = btn('👣 Advance 1 Step Manually', 'cyan small', function () {
      stopPatrol();
      stepPos = (stepPos + 1) % (MAX_STEPS + 1);
      drawCorridor();
      sfx('tap');
      if (stepPos === MAX_STEPS) {
        sfx('win'); confetti();
        kBar.setText('I took the painting! He hid it under his coat!', 'took', true);
      }
    });

    var caughtBtn = btn('👮 Caught Moving! ("I am arrested!")', 'coral small', function () {
      stopPatrol();
      stepPos = Math.max(0, stepPos - 1);
      drawCorridor();
      sfx('soft');
      kBar.setText('Oh no! The police arrested me!', 'arrested', true);
    });

    var teamWinRow = h('div', { class: 'row' }, D.teams.map(function (t, i) {
      return btn(t.e + ' ' + t.n + ' Reached It (+2)', 'small', function () {
        stopPatrol();
        stepPos = MAX_STEPS;
        drawCorridor();
        addPoint(i, 2);
        addClue(2);
        sfx('win');
        confetti();
        kBar.setText(t.n + ' reached the Mona Lisa! Say: "I took the painting!"', 'took', true);
      });
    }));

    tray.appendChild(kBar);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, [startBtn, stepBtn, caughtBtn]),
      teamWinRow
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    drawCorridor();
  }

  /* Generic Pro Illustrated Multiple-Choice Arena (Used for L1 Past-Tense Detectives & L2 Detective Quiz Show) */
  function proMcqArena(c, items, cfg) {
    var deck = shuffle(items);
    var ROUNDS = Math.min(cfg.rounds || deck.length, deck.length);
    var round = 0, tries = 0, locked = false;

    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var heroLeft = h('div');
    var sentenceRight = h('div', { class: 'quiz-sentence-box' });
    var layout = h('div', { class: 'quiz-hero-layout' }, [heroLeft, sentenceRight]);
    viewport.appendChild(layout);

    var optsRow = h('div', { class: 'quiz-opts-row' });
    var kBar = createKaraokeBar(cfg.hint, '');

    function drawRound() {
      if (round >= ROUNDS) {
        viewport.innerHTML = '';
        var finishBox = h('div', { class: 'col center', style: 'width:100%' }, [
          h('div', { class: 'case-closed-Stamp', text: '🏆 ALL ' + ROUNDS + ' ROUNDS COMPLETE!' })
        ]);
        renderPodium(finishBox);
        viewport.appendChild(finishBox);
        optsRow.innerHTML = '';
        optsRow.appendChild(btn('🔁 Play Again', 'green big', function () {
          round = 0; deck = shuffle(items); viewport.innerHTML = ''; viewport.appendChild(layout); drawRound();
        }));
        sfx('win'); confetti();
        return;
      }

      locked = false;
      tries = 0;
      var cur = deck[round];

      heroLeft.innerHTML = '';
      heroLeft.appendChild(heroFigure(cur.art, cur.e, 26, true));

      sentenceRight.innerHTML = '';
      var turnBar = teamTurnBanner(state.activeTeam, cfg.label + ' ' + (round + 1) + ' of ' + ROUNDS, [
        timerBtn(c, 20)
      ]);
      sentenceRight.appendChild(turnBar);

      var rawText = cur.q || cur.s;
      var blankSpan = h('span', { class: 'quiz-blank', text: ' ? ' });
      var promptEl = h('div', { class: 'quiz-sentence' });

      if (rawText.indexOf('____') >= 0) {
        var parts = rawText.split('____');
        promptEl.appendChild(document.createTextNode(parts[0]));
        promptEl.appendChild(blankSpan);
        promptEl.appendChild(document.createTextNode(parts[1] || ''));
      } else {
        promptEl.textContent = rawText;
      }
      sentenceRight.appendChild(promptEl);
      if (cur.rule) {
        sentenceRight.appendChild(h('div', { class: 'pill', style: 'align-self:flex-start', text: '💡 Detective Tip: Think about yesterday (1911)!' }));
      }

      optsRow.innerHTML = '';
      shuffle(cur.o.map(function (t, k) { return { t: t, k: k }; })).forEach(function (opt) {
        var b = btn(opt.t, 'amber quiz-opt-btn', function () {
          if (locked) return;
          if (opt.k === cur.a) {
            locked = true;
            b.className = 'btn green quiz-opt-btn';
            var pts = tries === 0 ? cfg.pts : 1;
            addPoint(state.activeTeam, pts);
            addClue(1);
            sfx('correct');
            if (pts > 1) confetti();

            var rightWord = cur.o[cur.a];
            blankSpan.textContent = rightWord;
            blankSpan.classList.add('solved');

            var fullSentence = rawText.indexOf('____') >= 0
              ? rawText.replace('____', rightWord).replace(/\s*\([^)]*\)/, '')
              : (cur.rule || rightWord);

            kBar.setText('✅ ' + fullSentence, rightWord, true);
            setTimeout(function () {
              round++;
              setActiveTeam(state.activeTeam + 1);
              drawRound();
            }, 2200);
          } else {
            tries++;
            b.className = 'btn coral quiz-opt-btn';
            triggerSoftFail(b);
            kBar.setText('Almost! Check the Time Machine rule: ' + (cur.rule || 'Try again!'), '', false);
          }
        });
        optsRow.appendChild(b);
      });

      kBar.setText(rawText.replace('____', 'blank'), '', true);
    }

    tray.appendChild(optsRow);
    tray.appendChild(kBar);
    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    drawRound();
  }

  function pastGame(c) {
    proMcqArena(c, D.past, {
      label: '⏪ Past-Tense Case',
      pts: 2,
      rounds: 8,
      hint: 'Tap the past-tense verb that tells what happened in 1911!'
    });
  }

  function quizShow(c) {
    proMcqArena(c, D.quiz, {
      label: '❓ Quiz Show Question',
      pts: 3,
      rounds: 5,
      hint: 'Talk with your team for 10 seconds, then tap the correct answer!'
    });
  }

  /* L1-7: Illustrated Timeline Sequencer (First, Then, After that, Finally) */
  function timelineGame(c) {
    var round = 0, placed = 0;
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg', style: 'flex-direction:column;gap:1vh' });
    var tray = h('div', { class: 'caption-tray' });

    var headerSlot = h('div', { style: 'width:100%' });
    var slotsGrid = h('div', { class: 'timeline-slots' });
    viewport.appendChild(headerSlot);
    viewport.appendChild(slotsGrid);

    var choicesRow = h('div', { class: 'scr' });
    var kBar = createKaraokeBar('Tap the sentence cards in chronological order: First, Then, After that, Finally!', 'First');

    function drawTimeline() {
      var set = D.timeline[round % D.timeline.length];
      placed = 0;

      headerSlot.innerHTML = '';
      headerSlot.appendChild(teamTurnBanner(state.activeTeam, set.e + ' ' + set.title, [
        btn('🔄 Switch Timeline Case', 'small cyan', function () {
          round = (round + 1) % D.timeline.length;
          drawTimeline();
        })
      ]));

      slotsGrid.innerHTML = '';
      var slotEls = set.steps.map(function (st, idx) {
        var sl = h('div', { class: 'tl-slot' + (idx === 0 ? ' next-up' : '') }, [
          h('span', { class: 'tl-order-badge', text: (idx + 1) + '. ' + D.orderWords[idx] }),
          heroFigure(st.art, '⏳', 11, false),
          h('div', { class: 'tl-slot-sentence', style: 'color:#94a3b8', text: '❓ Tap what happened ' + D.orderWords[idx].toLowerCase().replace(',', '') + '!' })
        ]);
        slotsGrid.appendChild(sl);
        return sl;
      });

      choicesRow.innerHTML = '';
      shuffle(set.steps.map(function (st, idx) { return { st: st, idx: idx }; })).forEach(function (item) {
        var tileBtn = btn(item.st.s, 'cyan small', function () {
          if (item.idx !== placed) {
            triggerSoftFail(tileBtn);
            kBar.setText('Look closely at the year or step! What happened ' + D.orderWords[placed].toLowerCase() + '?', D.orderWords[placed], false);
            return;
          }
          sfx('correct');
          tileBtn.style.display = 'none';
          var targetSlot = slotEls[placed];
          targetSlot.classList.remove('next-up');
          targetSlot.classList.add('filled');
          var fullLine = D.orderWords[placed] + ' ' + item.st.s;
          targetSlot.querySelector('.tl-slot-sentence').style.color = '#f8fafc';
          targetSlot.querySelector('.tl-slot-sentence').textContent = fullLine;

          kBar.setText(fullLine, D.orderWords[placed], true);
          placed++;
          addClue(1);

          if (placed < slotEls.length) {
            slotEls[placed].classList.add('next-up');
          } else {
            addPoint(state.activeTeam, 3);
            sfx('win');
            confetti();
            setActiveTeam(state.activeTeam + 1);
            choicesRow.innerHTML = '';
            choicesRow.appendChild(btn('🎙️ Speak Whole Timeline Together', 'amber', function () {
              A.speakSeq(set.steps.map(function (st, k) { return D.orderWords[k] + ' ' + st.s; }));
            }));
            choicesRow.appendChild(btn('▶ Next Timeline Case', 'green big', function () {
              round = (round + 1) % D.timeline.length;
              drawTimeline();
            }));
          }
        });
        choicesRow.appendChild(tileBtn);
      });
    }

    tray.appendChild(choicesRow);
    tray.appendChild(kBar);
    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    drawTimeline();
  }

  /* L1-8 & L2-7: Celebratory Case Closed Finale Podium + Interactive Door Pass */
  function caseWrap(c) {
    var L = state.lesson;
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg', style: 'flex-direction:column;justify-content:space-around' });
    var tray = h('div', { class: 'caption-tray' });

    var topRow = h('div', { class: 'row', style: 'justify-content:center;gap:3vh' }, [
      heroFigure('c_daphne_case', '🕵️', 18, false),
      h('div', { class: 'col center' }, [
        h('div', {
          class: 'case-closed-Stamp',
          text: '✅ CASE FILE ' + L + ' CLOSED! (' + Math.max(state.clues[L], D.goal) + ' / ' + D.goal + ' CLUES)'
        }),
        h('div', {
          style: 'font-weight:800;color:#fde047;margin-top:0.6vh',
          text: 'Every Detective Team Solved the Mystery of the Mona Lisa!'
        })
      ]),
      heroFigure('o_mona_frame', '🖼️', 18, true)
    ]);

    var podiumWrap = h('div', { style: 'width:100%' });
    renderPodium(podiumWrap);

    viewport.appendChild(topRow);
    viewport.appendChild(podiumWrap);

    var kBar = createKaraokeBar(LESSONS[L].door, 'Peruggia');

    var exitPasses = L === 1
      ? [
          'Peruggia had a clever plan.',
          'He lifted the painting off the wall.',
          'He hid the painting under his coat.',
          'The police arrested Peruggia.'
        ]
      : [
          'Peruggia wanted to steal a painting.',
          'He put the Mona Lisa under his clothes.',
          'People lined up to see the empty space.',
          'After two years, the police found the painting!'
        ];

    var passRow = h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, exitPasses.map(function (sentence) {
        return btn('🚪 "' + sentence + '"', 'small cyan', function () {
          sfx('correct');
          kBar.setText(sentence, 'painting', true);
        });
      })),
      h('div', { class: 'row' }, [
        btn('🎉 Confetti & Fanfare!', 'amber', function () { sfx('win'); confetti(); }),
        L === 1
          ? btn('📁 Open Case File 2 ▶', 'green big', function () { go(2, 0); })
          : btn('🔁 Replay Case File 1', 'violet', function () { go(1, 0); })
      ])
    ]);

    tray.appendChild(kBar);
    tray.appendChild(passRow);
    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    sfx('win');
    confetti();
  }

  /* =========================================================================
     LESSON 2: CASE FILE 2 · WHERE IS SHE? (Book pp. 58-64)
     ========================================================================= */

  /* L2-1: High-Speed 5-Second Evidence Flash */
  function wordFlash(c) {
    var deck = shuffle(D.words.concat([
      {
        w: 'lined up',
        pos: 'PAST VERB',
        posColor: '#f59e0b',
        e: '🧍🧍',
        a: 'o_robbery',
        def: 'stood in a long line waiting to see',
        ex: 'People lined up to see the empty space on the wall.'
      }
    ]));
    var idx = 0, revealed = false;

    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg', style: 'flex-direction:column;gap:1.2vh' });
    var tray = h('div', { class: 'caption-tray' });

    var stageCard = h('div', { class: 'col center' });
    viewport.appendChild(stageCard);

    var kBar = createKaraokeBar('Look at the 3D Evidence Picture! Shout the word before the 5-second timer ends!', '');

    function showCard() {
      revealed = false;
      var w = deck[idx % deck.length];
      stageCard.innerHTML = '';
      stageCard.appendChild(h('span', { class: 'pill amber', text: '⚡ FLASH CARD ' + ((idx % deck.length) + 1) + ' OF ' + deck.length }));
      stageCard.appendChild(heroFigure(w.a, w.e, 24, true));
      stageCard.appendChild(h('div', { class: 'tm-verb-big', style: 'color:#fde047', text: '❓ WHAT IS THE WORD?' }));
      kBar.setText('Hint: ' + w.def, '', false);
      sfx('page');
    }

    function revealWord() {
      if (revealed) return;
      revealed = true;
      var w = deck[idx % deck.length];
      var label = stageCard.querySelector('.tm-verb-big');
      if (label) label.innerHTML = '<span class="ed-chip">' + w.w.toUpperCase() + '</span>';
      sfx('correct');
      kBar.setText(w.w + '! ' + w.ex, w.w, true);
    }

    var controlRow = h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, [
        timerBtn(c, 5),
        btn('💡 Reveal Word', 'violet big', revealWord),
        btn('🎴 Next Evidence Flash ▶', 'amber big', function () {
          idx++;
          showCard();
        })
      ]),
      h('div', { class: 'row' }, D.teams.map(function (t, i) {
        return btn(t.e + ' Fast (+1)', 'small', function () {
          revealWord();
          addPoint(i, 1);
          addClue(1);
        });
      }))
    ]);

    tray.appendChild(kBar);
    tray.appendChild(controlRow);
    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    showCard();
  }

  /* L2-2: Interactive Graphic Novel Story Theatre ("Where Is She?", pp. 58-63) */
  function storyTheatre(c) {
    var i = 0, predictRevealed = false;
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var artLeft = h('div', { class: 'col center', style: 'width:38%' });
    var comicRight = h('div', { class: 'quiz-sentence-box', style: 'width:58%' });
    viewport.appendChild(h('div', { class: 'statue-stage' }, [artLeft, comicRight]));

    var kBar = createKaraokeBar(D.story[0].say, D.story[0].spot);

    function renderBeat() {
      var beat = D.story[i];
      artLeft.innerHTML = '';
      artLeft.appendChild(heroFigure(beat.art, beat.scene, 26, !!beat.key));

      comicRight.innerHTML = '';
      comicRight.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
        h('span', { class: 'pill amber', text: '📖 Scene ' + (i + 1) + ' of ' + D.story.length + ' · ' + (beat.title || '') }),
        beat.key ? h('span', { class: 'pill', style: 'background:#f43f5e;color:#fff', text: '🔑 KEY CLUE' }) : null
      ]));

      if (beat.predict && !predictRevealed) {
        comicRight.appendChild(h('div', {
          class: 'quiz-sentence',
          style: 'color:#fde047',
          text: '🤔 Detective Prediction: ' + beat.predict
        }));
        comicRight.appendChild(h('div', {
          class: 'gesture',
          text: '✋ Talk with your partner! What do you think happened next? Then click Reveal!'
        }));
        kBar.setText(beat.predict, 'Where', true);
      } else {
        comicRight.appendChild(h('div', { class: 'quiz-sentence', text: beat.say }));
        comicRight.appendChild(h('div', { class: 'gesture', text: beat.act }));
        kBar.setText(beat.say, beat.spot, true);
      }
    }

    var prevBtn = btn('◀ Previous Scene', 'ghost small', function () {
      if (i > 0) { i--; predictRevealed = false; sfx('page'); renderBeat(); }
    });

    var nextBeatBtn = btn('▶ Next Story Scene', 'green big', function () {
      var beat = D.story[i];
      if (beat.predict && !predictRevealed) {
        predictRevealed = true;
        sfx('correct');
        addClue(1);
        renderBeat();
        return;
      }
      if (i < D.story.length - 1) {
        i++;
        predictRevealed = false;
        sfx('season');
        addClue(1);
        renderBeat();
      } else {
        sfx('win');
        confetti();
        kBar.setText('The Mona Lisa is home in the Louvre! Open your book to page 58 to read the story together!', 'Mona Lisa', true);
      }
    });

    tray.appendChild(kBar);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, [
        prevBtn,
        btn('🎭 All Act Together (+1 Clue)', 'violet small', function () {
          sfx('correct'); addClue(1);
        })
      ]),
      nextBeatBtn
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    renderBeat();
  }

  /* L2-3: Interactive Front-Page Newspaper Printer (Book p. 61) */
  function headlines(c) {
    var cityIdx = 0, builtWords = [];
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var sheet = h('div', { class: 'newspaper-sheet' });
    viewport.appendChild(sheet);

    var wordBankRow = h('div', { class: 'row' });
    var kBar = createKaraokeBar('Tap the word bricks below to print the Breaking News Headline on the front page!', 'missing');

    function renderNewspaper() {
      var item = D.headlines[cityIdx];
      builtWords = [];
      sheet.innerHTML = '';

      sheet.appendChild(h('div', { class: 'np-masthead' }, [
        h('span', { text: '📰 THE WORLD DETECTIVE TIMES' }),
        h('span', { text: item.flag + ' ' + item.city }),
        h('span', { text: 'SPECIAL EDITION · 5¢' })
      ]));

      var photoBox = h('div', { class: 'np-photo-frame' }, [
        imgEl(item.art, '🖼️')
      ]);

      var headlineSlot = h('div', {
        class: 'np-headline-slot',
        text: 'Tap word bricks below to print the headline!'
      });

      var rightCol = h('div', { class: 'col', style: 'justify-content:center;gap:1vh' }, [
        h('div', { style: 'font-weight:900;color:#b45309;font-size:0.9em', text: 'BREAKING NEWS: ' + item.sub.toUpperCase() }),
        headlineSlot
      ]);

      sheet.appendChild(h('div', { class: 'np-body' }, [photoBox, rightCol]));

      wordBankRow.innerHTML = '';
      wordBankRow.appendChild(h('span', { class: 'lab', text: '🖨️ Tap to print:' }));

      shuffle(item.words.map(function (w, idx) { return { w: w, idx: idx }; })).forEach(function (tok) {
        var b = btn(tok.w, 'amber small', function () {
          var expectedIdx = builtWords.length;
          if (tok.idx !== expectedIdx) {
            triggerSoftFail(b);
            return;
          }
          sfx('tap');
          builtWords.push(tok.w);
          b.style.display = 'none';
          headlineSlot.textContent = builtWords.join(' ');

          if (builtWords.length === item.words.length) {
            headlineSlot.classList.add('printed');
            sfx('win');
            confetti();
            addClue(1);
            addPoint(state.activeTeam, 2);
            setActiveTeam(state.activeTeam + 1);
            kBar.setText('Breaking news in ' + item.city + ': ' + item.h, 'Mona Lisa', true);
          }
        });
        wordBankRow.appendChild(b);
      });

      wordBankRow.appendChild(btn('💡 Instant Print', 'violet small', function () {
        headlineSlot.textContent = item.h;
        headlineSlot.classList.add('printed');
        sfx('correct');
        kBar.setText(item.h, 'Mona Lisa', true);
      }));
    }

    var cityTabs = h('div', { class: 'row' }, D.headlines.map(function (hl, idx) {
      return btn(hl.flag + ' ' + hl.city.split(' ')[0], 'small cyan', function () {
        cityIdx = idx;
        sfx('page');
        renderNewspaper();
      });
    }));

    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      wordBankRow,
      cityTabs
    ]));
    tray.appendChild(kBar);

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
    renderNewspaper();
  }

  /* L2-5: Interactive Museum Security Simulator + Four Corners Debate (Book p. 64 B) */
  function debate(c) {
    var d = D.debate;
    var activeDefenses = {};

    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var yesWing = h('div', { class: 'museum-wing before', style: 'cursor:pointer' }, [
      h('span', { class: 'wing-badge', style: 'background:rgba(16,185,129,0.25);color:#6ee7b7;border-color:#10b981', text: '✅ CORNER 1 · YES!' }),
      heroFigure('o_steal', '🥷', 17, false),
      h('div', { class: 'wing-caption', text: d.yes })
    ]);

    var centerMona = h('div', { class: 'col center', style: 'padding:0 1vh' }, [
      heroFigure('o_mona_frame', '🖼️', 20, true),
      h('div', { id: 'sec-status', class: 'pill amber', text: '🛡️ Security Systems: Turn on below!' })
    ]);

    var noWing = h('div', { class: 'museum-wing after', style: 'cursor:pointer' }, [
      h('span', { class: 'wing-badge', style: 'background:rgba(244,63,94,0.25);color:#fda4af;border-color:#f43f5e', text: '❌ CORNER 2 · NO WAY!' }),
      heroFigure('o_police', '👮', 17, true),
      h('div', { class: 'wing-caption', text: d.no })
    ]);

    yesWing.onclick = function () {
      sfx('tap');
      kBar.setText('Yes, I think someone can steal a very small painting!', 'small', true);
    };
    noWing.onclick = function () {
      sfx('correct');
      kBar.setText('No! Today there are loud alarms, cameras, and museum guards!', 'alarms', true);
    };

    viewport.appendChild(h('div', { class: 'split-museum' }, [yesWing, centerMona, noWing]));

    var kBar = createKaraokeBar(d.q + ' Tap the security switches below or walk to YES / NO!', 'steal');

    var defenseButtons = d.defenses.map(function (def) {
      var b = btn(def.icon + ' ' + def.name, 'small cyan', function () {
        activeDefenses[def.id] = !activeDefenses[def.id];
        b.className = 'btn small ' + (activeDefenses[def.id] ? 'green' : 'cyan');
        sfx('correct');
        addClue(1);
        var count = Object.keys(activeDefenses).filter(function (k) { return activeDefenses[k]; }).length;
        var st = viewport.querySelector('#sec-status');
        if (st) st.textContent = '🛡️ Active Museum Defenses: ' + count + ' / 4';
        kBar.setText(def.sentence, def.name.split(' ')[1] || 'alarms', true);
      });
      return b;
    });

    var speakerBtn = btn('🎲 Pick Random Team Speaker', 'violet small', function () {
      var t = D.teams[Math.floor(Math.random() * D.teams.length)];
      sfx('page');
      kBar.setText('Microphone to Team ' + t.n + '! Tell the class your reason: Yes or No?', t.n, true);
    });

    tray.appendChild(kBar);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, defenseButtons),
      h('div', { class: 'row' }, [timerBtn(c, 30), speakerBtn])
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
  }

  /* L2-6: Interactive Emotion Face Studio ("Missing vs. Found", Book p. 64 C) */
  function drawFaces(c) {
    var arena = h('div', { class: 'pro-arena' });
    var viewport = h('div', { class: 'hero-viewport museum-bg' });
    var tray = h('div', { class: 'caption-tray' });

    var studioGrid = h('div', { class: 'face-studio-grid' });
    var kBar = createKaraokeBar('Customize the museum worker’s face on the board AND draw it in your book (p. 64)!', 'scared');

    D.faces.forEach(function (f) {
      var curMouth = f.defaultEmoji;
      var curProp = f.prop[0].split(' ')[0];

      var avatarRing = h('div', { class: 'face-avatar-ring' }, [
        h('span', { class: 'face-main-em', text: curMouth }),
        h('span', { class: 'face-prop-badge', text: curProp })
      ]);

      var mouthBtns = h('div', { class: 'row', style: 'justify-content:center' }, f.mouth.map(function (m) {
        var em = m.split(' ')[0];
        return btn(m, 'small amber', function () {
          avatarRing.querySelector('.face-main-em').textContent = em;
          sfx('correct');
          addClue(1);
          kBar.setText(f.sentence, f.id === 'missing' ? 'scared' : 'happy', true);
        });
      }));

      var propBtns = h('div', { class: 'row', style: 'justify-content:center' }, f.prop.map(function (p) {
        var em = p.split(' ')[0];
        return btn(p, 'small cyan', function () {
          avatarRing.querySelector('.face-prop-badge').textContent = em;
          sfx('tap');
        });
      }));

      var card = h('div', { class: 'face-canvas-card' }, [
        h('span', { class: 'pill amber', text: f.title }),
        h('div', { class: 'row', style: 'gap:2.5vh;justify-content:center' }, [
          heroFigure(f.art, '🖼️', 14, f.id === 'found'),
          avatarRing
        ]),
        mouthBtns,
        propBtns,
        h('div', { style: 'font-weight:800;color:#e2e8f0;font-size:0.85em', text: '🗣️ "' + f.sentence + '"' })
      ]);

      studioGrid.appendChild(card);
    });

    viewport.appendChild(studioGrid);

    tray.appendChild(kBar);
    tray.appendChild(h('div', { class: 'row', style: 'justify-content:space-between' }, [
      h('div', { class: 'row' }, [
        timerBtn(c, 90),
        btn('😱 Say: "He is scared!"', 'small coral', function () {
          kBar.setText('The painting is missing! He is scared!', 'scared', true);
        }),
        btn('😄 Say: "He is happy!"', 'small green', function () {
          kBar.setText('The painting is found! He is happy!', 'happy', true);
        })
      ]),
      btn('🖼️ Gallery Walk Complete (+2 Clues)', 'green', function () {
        addClue(2);
        sfx('win');
        confetti();
      })
    ]));

    arena.appendChild(viewport);
    arena.appendChild(tray);
    c.body.appendChild(arena);
  }

  /* =========================================================================
     LESSON DEFINITIONS & NAVIGATION SHELL
     ========================================================================= */
  var MODES = {
    game: '🎮 Interactive Game',
    think: '🔍 Discovery',
    listen: '🗂️ Evidence Lab',
    grammar: '⚙️ Time Machine',
    act: '🎬 Story Theatre',
    move: '🥷 Action Heist',
    talk: '🗣️ Speaking Studio',
    race: '⚡ Speed Blitz'
  };

  var LESSONS = {
    1: {
      title: 'Case File 1 · A Picture on the Wall',
      missions: D.c1missions,
      door: '🚪 Door Pass: Tell me one past-tense sentence: "Peruggia lifted the painting!" or "The police arrested him!"',
      scenes: [
        {
          t: '1. Open Case File 1',
          mins: '2 min',
          mode: 'think',
          run: caseOpen,
          intro: 'Look at the giant Statue of Liberty head (p. 56). Something big happened!',
          kids: {
            steps: ['👀 Look at the 3D museum stage', '🗣️ Repeat the clues', '🗂️ Unlock the 6 missions'],
            say: ['It is a big statue.', 'What happened?']
          },
          tip: [
            'Book link: Unit 4 "What Happened?" opener, p. 56 (Statue of Liberty head in Paris, 1883).',
            'Divide the class into 4 detective teams (Foxes, Owls, Cats, Wolves). Explain the top Case Clue bar: 20 clues solves the case!'
          ]
        },
        {
          t: '2. Statue Mystery (Think, Pair, Share)',
          mins: '4 min',
          mode: 'talk',
          run: tpsScene,
          intro: 'Tap the 3 glowing clues on the statue! Think, tell your partner, and share.',
          kids: {
            steps: ['👆 Tap a glowing clue on the statue', '🤝 Tell your partner', '🗣️ Share with the class'],
            say: ['What do you think?', 'I think it is in the park for decoration.', 'We think it is in New York City now.']
          },
          tip: [
            'Book link: Get Ready to Read — Think, Pair, Share, p. 57 (A–C).',
            'Invite a student to tap Clue 1, 2, or 3 directly on the smartboard statue, start the 15s timer, then click Reveal Model Answer.'
          ]
        },
        {
          t: '3. Spot the 5 Museum Changes',
          mins: '5 min',
          mode: 'game',
          run: spotChanges,
          intro: 'Compare the museum in 1911 (Picture 1) and Today (Picture 2).',
          kids: {
            steps: ['👆 Tap each of the 5 museum clues', '👀 Compare Before and After', '🗣️ Say: In picture one… In picture two…'],
            say: ['In picture one, the painting is not on the wall.', 'In picture two, the painting is on the wall.']
          },
          tip: [
            'Book link: Think and discuss E, p. 57 (the museum at the beginning and at the end of the story).',
            'Each of the 5 chips swaps the split-screen 3D artwork and models the full comparison sentence with karaoke highlighting.'
          ]
        },
        {
          t: '4. Detective Evidence Locker (5 Words)',
          mins: '5 min',
          mode: 'listen',
          run: wordsScene,
          intro: 'Inspect the 5 evidence cards: plan, steal, lifted, robbery, arrested.',
          kids: {
            steps: ['👆 Tap an evidence card to hear it', '🎭 Play Secret Mime Challenge', '👆 Tap the right card to win +2 pts!'],
            say: ['Peruggia had a clever plan.', 'He lifted the painting off the wall.', 'The police arrested Peruggia.']
          },
          tip: [
            'Book link: Words in Context, p. 59 (plan, steal, lifted, robbery, arrested). Notice the color-coded NOUN / VERB / PAST VERB badges.',
            'After inspecting all 5 cards, click "🎭 Secret Mime Challenge": one actor mimes, and a teammate taps the matching 3D card on the board!'
          ]
        },
        {
          t: '5. The Past-Tense Time Machine',
          mins: '5 min',
          mode: 'grammar',
          run: grammarTimeMachine,
          intro: 'How do verbs change when we talk about 1911? Weld +ed or warp irregular verbs!',
          kids: {
            steps: ['⚙️ Tap "Weld +ed" for regular verbs', '🔮 Switch to Secret Irregular Verbs', '🗣️ Read the full past sentence aloud'],
            say: ['walk → walked', 'lift → lifted', 'hide → hid', 'find → found']
          },
          tip: [
            'Pedagogical Bridge: Scaffolds Regular Past (-ed) and the 4 story Irregulars (take→took, hide→hid, find→found, go→went) BEFORE the quiz!',
            'Have the class chant "walk — walked!" as the golden +ed block welds onto the verb.'
          ]
        },
        {
          t: '6. Sneak to the Mona Lisa!',
          mins: '5 min',
          mode: 'move',
          run: sneakGame,
          intro: 'Tiptoe when the guard turns (GREEN)! Freeze when he looks (RED)!',
          kids: {
            steps: ['🟢 Guard turns: tiptoe forward!', '🛑 Guard looks: FREEZE!', '🖼️ Reach Step 6 and shout: "I took the painting!"'],
            say: ['I lifted the painting!', 'I took the painting!', 'The police arrested me!']
          },
          tip: [
            'Whole-body TPR game: students tiptoe in place or from the back of the room while watching Peruggia advance across the 6 museum tiles on screen.'
          ]
        },
        {
          t: '7. Past-Tense Detectives Quiz',
          mins: '5 min',
          mode: 'game',
          run: pastGame,
          intro: 'Solve 8 illustrated case sentences! First try = +2 points.',
          kids: {
            steps: ['👀 Look at the 3D clue and sentence', '🤝 Whisper with your team', '👆 Come tap the right past verb!'],
            say: ['Yesterday, Peruggia walked into the museum.', 'He hid the painting under his coat.', 'In 1913, the police found the painting!']
          },
          tip: [
            'Book link: Past simple verbs from pp. 58–63. Every question features a 3D character render and grammar rule hint on soft-fail.'
          ]
        },
        {
          t: '8. Timeline Sequencer & Case Closed',
          mins: '4 min',
          mode: 'game',
          run: timelineGame,
          intro: 'Order the 4 story events: First, Then, After that, Finally!',
          kids: {
            steps: ['👆 Tap the 4 cards in order', '🎙️ Retell the story with First, Then, After that, Finally'],
            say: ['First, Leonardo painted the Mona Lisa.', 'Then, Peruggia took the painting.', 'Finally, the Mona Lisa went home.']
          },
          tip: [
            'Book link: Chronological sequence (1503, 1911, 1913) and sequence markers (First, Then, After that, Finally).'
          ]
        },
        {
          t: '9. Trophy Podium & Door Pass',
          mins: '2 min',
          mode: 'think',
          run: caseWrap,
          intro: 'Case File 1 Solved! Celebrate the teams and tap a Door Pass sentence.',
          kids: {
            steps: ['🏆 Cheer for the podium winners', '🚪 Tap and say one Door Pass sentence'],
            say: ['Peruggia lifted the painting off the wall.', 'The police arrested Peruggia.']
          },
          tip: [
            'Click any of the 4 Door Pass buttons at the bottom for karaoke read-along as students line up, or jump straight to Case File 2!'
          ]
        }
      ]
    },
    2: {
      title: 'Case File 2 · Where Is She?',
      missions: D.c2missions,
      door: '🚪 Door Pass: Answer one question: "What did Peruggia want to do?" or "Where did he hide the painting?"',
      scenes: [
        {
          t: '1. 5-Second Evidence Flash',
          mins: '4 min',
          mode: 'race',
          run: wordFlash,
          intro: 'Look at the 3D evidence picture and shout the word before the timer ends!',
          kids: {
            steps: ['👀 Look at the 3D clue', '⚡ Shout the word in 5 seconds', '🗣️ Read the full sentence'],
            say: ['plan', 'steal', 'lifted', 'robbery', 'arrested', 'lined up']
          },
          tip: [
            'Book link: Words in Context review (p. 59) + "lined up" (p. 61). Click a team button to award +1 for a fast answer.'
          ]
        },
        {
          t: '2. Interactive Story Theatre: Where Is She?',
          mins: '8 min',
          mode: 'act',
          run: storyTheatre,
          intro: 'Act out all 10 illustrated scenes of the Mona Lisa heist!',
          kids: {
            steps: ['👂 Listen & watch the karaoke words', '🎭 Do the detective action', '🤔 Predict how Peruggia was caught!'],
            say: ['He lifted the painting off the wall.', 'People lined up to see the empty space.', 'The police arrested Peruggia!']
          },
          tip: [
            'Book link: "Where Is She?", pp. 58–63. Every beat now displays custom 3D artwork and highlights the key verb in cyan.'
          ]
        },
        {
          t: '3. Interactive Front-Page Newspaper Printer',
          mins: '6 min',
          mode: 'talk',
          run: headlines,
          intro: 'Tap the word bricks in order to print the breaking news in Paris, Madrid, New York, Tokyo & Florence!',
          kids: {
            steps: ['🌍 Pick a city tab', '👆 Tap the word bricks in order', '🗣️ Shout the headline like a reporter!'],
            say: ['The Mona Lisa is missing!', 'Big robbery in Paris!', 'The Mona Lisa is found!']
          },
          tip: [
            'Book link: Newspaper headlines from Madrid, Tokyo, and New York (p. 61). Students can build the headline on the smartboard and copy their favorite onto mini whiteboards.'
          ]
        },
        {
          t: '4. Detective Quiz Show',
          mins: '6 min',
          mode: 'game',
          run: quizShow,
          intro: 'Five comprehension questions from page 64! First try = +3 points.',
          kids: {
            steps: ['❓ Listen to the question', '🤝 Team huddle (10s)', '👆 Tap the answer on the board'],
            say: ['He wanted to steal a painting.', 'He hid it under his clothes.', 'People lined up to see the empty space.']
          },
          tip: [
            'Book link: Explore the Reading A, p. 64 (questions 1–5).'
          ]
        },
        {
          t: '5. Museum Security Simulator & Debate',
          mins: '5 min',
          mode: 'move',
          run: debate,
          intro: 'Can someone steal a painting from a museum today? Turn on the 4 security systems!',
          kids: {
            steps: ['🚶 Walk to YES or NO', '🛡️ Tap Laser Alarms, Cameras, Guards & Glass', '🗣️ Give your reason!'],
            say: ['Yes, maybe a very small one.', 'No, there are laser alarms!', 'No, there are cameras and guards!']
          },
          tip: [
            'Book link: Think and discuss B, p. 64. Students tap the 4 security switches on the board to hear the model "No, there are..." sentences.'
          ]
        },
        {
          t: '6. Emotion Face Studio (Missing vs. Found)',
          mins: '4 min',
          mode: 'act',
          run: drawFaces,
          intro: 'Build the museum worker’s Scared Face (1911) and Happy Face (1913) on the board and in your book!',
          kids: {
            steps: ['😱 Tap expressions for MISSING (Box 1)', '😄 Tap expressions for FOUND (Box 2)', '✏️ Draw both faces on page 64'],
            say: ['The painting is missing! He is scared.', 'The painting is found! He is happy.']
          },
          tip: [
            'Book link: Explore the Reading C, p. 64 (draw the museum worker’s face when the painting is missing vs. found).'
          ]
        },
        {
          t: '7. Case File 2 Closed! Trophy Podium',
          mins: '2 min',
          mode: 'think',
          run: caseWrap,
          intro: 'The Mona Lisa is safe at home! Celebrate the winning detective teams.',
          kids: {
            steps: ['🏆 Cheer for every detective team', '🚪 Tap a Door Pass sentence on your way out'],
            say: ['He wanted to steal a painting.', 'He hid the Mona Lisa under his clothes.']
          },
          tip: [
            'Final celebration and oral exit check!'
          ]
        }
      ]
    }
  };

  /* ---------- Navigation & Shell Controller ---------- */
  function ctxFor(main) {
    return {
      body: main,
      done: function () { state.done[state.lesson + ':' + state.idx] = true; drawSteps(); },
      later: function (fn) { state.cleanups.push(fn); }
    };
  }

  function drawSteps() {
    var L = LESSONS[state.lesson], box = $('steps');
    if (!box) return;
    box.innerHTML = '';
    L.scenes.forEach(function (s, k) {
      var isDone = state.done[state.lesson + ':' + k];
      box.appendChild(h('button', {
        type: 'button',
        class: 'dot' + (k === state.idx ? ' on' : '') + (isDone ? ' done' : ''),
        text: isDone ? '✓' : String(k + 1),
        title: s.t,
        onclick: function () { go(state.lesson, k); }
      }));
    });
    $('back').disabled = state.idx === 0;
    $('next').disabled = state.idx === L.scenes.length - 1;
  }

  function kidsPanel(k) {
    if (!k) return null;
    var steps = h('ol', { class: 'ysteps' }, k.steps.map(function (s) { return h('li', { text: s }); }));
    var say = h('div', { class: 'ysay' }, (k.say || []).map(function (s) {
      return h('button', {
        type: 'button',
        class: 'frame',
        text: '🗣️ ' + s,
        onclick: function () { A.speak(s.replace(/…/g, '')); }
      });
    }));
    return h('div', { class: 'youdo' }, [
      h('div', { class: 'ylab', text: 'YOU DO' }),
      steps,
      (k.say && k.say.length) ? h('div', { class: 'ylab say', text: 'SAY IT' }) : null,
      (k.say && k.say.length) ? say : null
    ]);
  }

  function go(lesson, idx) {
    if (!LESSONS[lesson]) lesson = 1;
    var L = LESSONS[lesson];
    idx = Math.max(0, Math.min(L.scenes.length - 1, idx || 0));

    if (state.idx >= 0 && state.lesson === lesson && idx > state.idx) {
      state.done[lesson + ':' + state.idx] = true;
    }
    state.cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
    state.cleanups = [];
    clearKaraoke();
    if (A && A.stop) A.stop();

    state.lesson = lesson;
    state.idx = idx;

    var s = L.scenes[idx], stage = $('stage');
    stage.className = '';
    stage.innerHTML = '';
    $('tip').hidden = true;

    stage.appendChild(h('div', { class: 's-head' }, [
      h('h2', { text: s.t }),
      h('span', { class: 'pill mode', text: MODES[s.mode] || '🎮 Activity' }),
      h('span', { class: 'pill', text: '⏱ ' + s.mins }),
      h('span', { class: 's-sub', text: '— ' + s.intro }),
      h('div', { class: 'grow' }),
      h('span', { class: 'pill amber', text: 'Step ' + (idx + 1) + ' of ' + L.scenes.length })
    ]));

    var main = h('div', { class: 's-body' });
    stage.appendChild(main);

    var kp = kidsPanel(s.kids);
    if (kp) stage.appendChild(kp);

    $('h-title').firstChild.nodeValue = L.title;
    drawLessonTabs();
    drawHudCase();
    drawTeams();
    drawSteps();
    sfx('page');

    try {
      s.run(ctxFor(main));
    } catch (e) {
      main.appendChild(h('div', { class: 'msg soft', text: 'Oops, this activity could not start.' }));
      if (window.console) console.error(e);
    }
    try {
      history.replaceState(null, '', '?lesson=' + lesson + '&scene=' + (idx + 1));
    } catch (e) { /* ignore */ }
  }

  function tipHtml() {
    var s = LESSONS[state.lesson].scenes[state.idx], t = $('tip');
    t.innerHTML = '';
    t.appendChild(h('h4', { text: '🎓 Teacher Guide: ' + s.t + '  •  ' + s.mins }));
    s.tip.forEach(function (x, k) {
      t.appendChild(h('p', { text: (k + 1) + '. ' + x }));
    });
  }

  $('back').addEventListener('click', function () {
    if (state.idx > 0) go(state.lesson, state.idx - 1);
  });
  $('next').addEventListener('click', function () {
    if (state.idx < LESSONS[state.lesson].scenes.length - 1) go(state.lesson, state.idx + 1);
  });
  $('tipbtn').addEventListener('click', function () {
    var t = $('tip');
    if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true;
  });
  $('snd').addEventListener('click', function () {
    A.setOn(!A.isOn());
    $('snd').textContent = A.isOn() ? '🔊' : '🔇';
  });
  $('fs').addEventListener('click', function () {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (e) { /* ignore */ }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') $('next').click();
    else if (e.key === 'ArrowLeft') $('back').click();
  });

  var q = {};
  (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) {
    var kv = p.split('=');
    if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || '');
  });
  var L0 = LESSONS[parseInt(q.lesson, 10)] ? parseInt(q.lesson, 10) : 1;
  var s0 = Math.max(0, Math.min(LESSONS[L0].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));

  window.W4Lessons = { state: state, go: go, LESSONS: LESSONS };
  loadManifest(function () {
    drawTeams();
    go(L0, s0);
  });
})();
