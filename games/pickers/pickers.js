(function () {
  'use strict';
  var Kit = window.Kit;
  var el = Kit.el;
  var app = document.getElementById('app');

  var MODES = {
    ufo: {
      id: 'ufo',
      icon: '🛸',
      title: 'UFO Beam Picker',
      sub: 'UFO beams up the next speaker!',
      btn: '🛸 Beam Up Speaker!',
      img: '../assets/games/pickers/ufo_ship.webp',
      stageClass: 'mode-ufo',
      chipClass: '',
      count: 1
    },
    wash: {
      id: 'wash',
      icon: '🫧',
      title: 'Bubble Wash Picker',
      sub: 'Spin the washer — who pops out?',
      btn: '🫧 Spin & Pop!',
      img: '../assets/games/pickers/washer.webp',
      stageClass: 'mode-wash',
      chipClass: '',
      count: 1
    },
    slime: {
      id: 'slime',
      icon: '🟢',
      title: 'Slime Name Clash',
      sub: 'Bouncing slimes call TWO speakers together!',
      btn: '🟢 Clash Two Speakers!',
      img: '',
      stageClass: 'mode-slime',
      chipClass: 'slime-blob',
      count: 2
    },
    dragon: {
      id: 'dragon',
      icon: '🐉',
      title: 'Sea Dragon Call',
      sub: 'Friendly dragon calls a name from the waves!',
      btn: '🐉 Call from the Waves!',
      img: '../assets/games/pickers/sea_dragon.webp',
      stageClass: 'mode-dragon',
      chipClass: 'shell-buoy',
      count: 1
    }
  };

  var gameId = 'slime';
  var M = MODES[gameId];

  var CUSTOM_KEY = 'eaa_picker_custom_roster_v1';
  var state = {
    classId: Kit.param('class') || (Kit.classroom ? Kit.classroom.defaultClassId() : ''),
    pupils: [],
    usedIds: {},
    fairMode: true,
    picking: false,
    picked: [],
    promptCards: [],
    promptIdx: 0,
    stars: 0
  };

  function defaultDemoPupils() {
    var arr = [];
    for (var i = 1; i <= 12; i++) {
      arr.push({ id: 'demo-' + i, name: 'Pupil ' + i, demo: true });
    }
    return arr;
  }

  function loadPupils() {
    try {
      var raw = localStorage.getItem(CUSTOM_KEY);
      if (raw) {
        var custom = JSON.parse(raw);
        if (Array.isArray(custom) && custom.length >= 2) {
          state.pupils = custom.map(function (n, idx) {
            return { id: 'custom-' + idx, name: String(n).trim(), demo: true };
          }).filter(function (p) { return p.name; });
          return;
        }
      }
    } catch (e) {}

    if (Kit.classroom && Kit.classroom.isTeacherSession() && state.classId) {
      var list = Kit.classroom.pupils(state.classId);
      if (Array.isArray(list) && list.length) {
        state.pupils = list.map(function (p) {
          return { id: p.id, name: p.name, avatar: p.avatar, demo: false };
        });
        return;
      }
    }
    state.pupils = defaultDemoPupils();
  }

  function loadPromptCards() {
    if (!Kit.sets || !Kit.sets.all) return Promise.resolve();
    return Kit.sets.all().then(function (sets) {
      var set = sets && sets[0];
      if (!set || !Array.isArray(set.cards)) return;
      state.promptCards = Kit.shuffle(set.cards.slice());
      state.promptIdx = 0;
    }).catch(function () {});
  }

  Kit.topbar({
    home: '../index.html',
    homeLabel: 'Games',
    title: M.icon + ' ' + M.title,
    onEdit: function () { openRosterModal(); },
    editLabel: '👥 Roster'
  });

  var rootWrap = el('div', { class: 'pk-wrap' });
  app.appendChild(rootWrap);

  var hud = el('div', { class: 'pk-hud' });
  var hudLeft = el('div', { class: 'pk-hud-left' });
  var hudRight = el('div', { class: 'pk-hud-right' });
  hud.appendChild(hudLeft);
  hud.appendChild(hudRight);
  rootWrap.appendChild(hud);

  var stage = el('section', { class: 'pk-stage ' + M.stageClass });
  rootWrap.appendChild(stage);

  var topRow = el('div', { class: 'pk-top-row' });
  var arena = el('div', { class: 'pk-arena' });
  var crowd = el('div', { class: 'pk-crowd' });
  var controls = el('div', { class: 'pk-controls' });
  stage.appendChild(topRow);
  stage.appendChild(arena);
  stage.appendChild(crowd);
  stage.appendChild(controls);

  var ufoShipEl = null;
  var washerWrapEl = null;
  var washerDrumEl = null;
  var dragonWrapEl = null;
  var spotlightEl = el('div', { class: 'pk-spotlight' });
  var goBtn = el('button', {
    type: 'button',
    class: 'btn pink pk-go-btn',
    text: M.btn,
    onclick: startPick
  });

  function buildArena() {
    arena.innerHTML = '';
    if (M.id === 'ufo') {
      var track = el('div', { class: 'pk-ufo-track' });
      ufoShipEl = el('div', { class: 'pk-ufo-ship' }, [
        el('div', { class: 'pk-ufo-beam' }),
        el('img', { src: Kit.src(M.img.replace(/^\.\.\//, '')), alt: M.title })
      ]);
      track.appendChild(ufoShipEl);
      arena.appendChild(track);
    } else if (M.id === 'wash') {
      washerWrapEl = el('div', { class: 'pk-washer-wrap' }, [
        el('img', { class: 'pk-washer-img', src: Kit.src(M.img.replace(/^\.\.\//, '')), alt: M.title }),
        washerDrumEl = el('div', { class: 'pk-washer-drum', text: '🫧 Ready!' })
      ]);
      arena.appendChild(washerWrapEl);
    } else if (M.id === 'dragon') {
      dragonWrapEl = el('div', { class: 'pk-dragon-wrap' }, [
        el('img', { class: 'pk-dragon-img', src: Kit.src(M.img.replace(/^\.\.\//, '')), alt: M.title })
      ]);
      arena.appendChild(dragonWrapEl);
    }
    arena.appendChild(spotlightEl);
  }

  function drawHud() {
    hudLeft.innerHTML = '';
    hudRight.innerHTML = '';

    var remaining = state.pupils.filter(function (p) { return !state.usedIds[p.id]; }).length;
    hudLeft.appendChild(el('span', { class: 'pk-pill', text: '👥 ' + remaining + ' / ' + state.pupils.length + ' ready' }));

    if (Kit.classroom && Kit.classroom.isTeacherSession()) {
      var cls = Kit.classroom.classes();
      if (cls.length) {
        var sel = el('select', {
          class: 'sort-sel',
          'aria-label': 'Select class',
          onchange: function () {
            state.classId = sel.value;
            localStorage.removeItem(CUSTOM_KEY);
            state.usedIds = {};
            state.picked = [];
            loadPupils();
            renderAll();
          }
        });
        cls.forEach(function (c) {
          var o = el('option', { value: c.id, text: 'Class ' + c.label });
          if (c.id === state.classId) o.selected = true;
          sel.appendChild(o);
        });
        hudLeft.appendChild(sel);
      }
    }

    hudRight.appendChild(el('button', {
      type: 'button',
      class: 'pk-pill pk-toggle' + (state.fairMode ? ' on' : ''),
      text: state.fairMode ? '✓ No Repeats: ON' : '↻ No Repeats: OFF',
      onclick: function () {
        Kit.sound('tap');
        state.fairMode = !state.fairMode;
        drawHud();
      }
    }));

    hudRight.appendChild(el('button', {
      type: 'button',
      class: 'btn',
      text: '🔄 Reset Turns',
      onclick: function () {
        Kit.sound('tap');
        state.usedIds = {};
        state.picked = [];
        spotlightEl.classList.remove('show');
        drawHud();
        drawCrowd();
      }
    }));
  }

  function drawTopPrompt() {
    topRow.innerHTML = '';
    var card = state.promptCards[state.promptIdx];
    var promptBox = el('div', { class: 'pk-prompt-card' });
    if (card) {
      if (card.img) {
        promptBox.appendChild(el('img', { src: Kit.src(card.img), alt: card.w || 'Prompt' }));
      }
      promptBox.appendChild(el('div', {}, [
        el('div', { class: 'pk-prompt-word', text: '💬 Say: ' + (card.w || 'Ready!') }),
        el('div', { class: 'pk-prompt-sub', text: card.cl || 'Speak in a full sentence!' })
      ]));
      promptBox.appendChild(el('button', {
        type: 'button',
        class: 'btn',
        text: '🔊',
        onclick: function () { Kit.say(card.w || ''); }
      }));
    } else {
      promptBox.appendChild(el('div', { class: 'pk-prompt-word', text: '💬 ' + M.sub }));
    }

    var nextPromptBtn = el('button', {
      type: 'button',
      class: 'btn lilac',
      text: '🎲 Next Prompt',
      onclick: function () {
        Kit.sound('tap');
        if (state.promptCards.length) {
          state.promptIdx = (state.promptIdx + 1) % state.promptCards.length;
        }
        drawTopPrompt();
      }
    });

    topRow.appendChild(promptBox);
    topRow.appendChild(nextPromptBtn);
  }

  function drawCrowd(scanningIds) {
    crowd.innerHTML = '';
    var scanSet = {};
    (scanningIds || []).forEach(function (id) { scanSet[id] = 1; });
    var pickedSet = {};
    state.picked.forEach(function (p) { pickedSet[p.id] = 1; });

    state.pupils.forEach(function (p) {
      var cls = 'pk-chip';
      if (M.chipClass) cls += ' ' + M.chipClass;
      if (state.usedIds[p.id] && !pickedSet[p.id]) cls += ' done';
      if (scanSet[p.id]) cls += ' scanning';
      if (pickedSet[p.id]) cls += ' picked';

      var chip = el('div', { class: cls }, [
        el('span', { text: M.id === 'dragon' ? '🐚' : M.id === 'slime' ? '🟢' : '⭐' }),
        el('span', { text: p.name })
      ]);
      crowd.appendChild(chip);
    });
  }

  function drawSpotlight() {
    spotlightEl.innerHTML = '';
    if (!state.picked.length) {
      spotlightEl.classList.remove('show');
      return;
    }
    spotlightEl.classList.add('show');
    if (state.picked.length === 2) {
      spotlightEl.appendChild(el('span', { class: 'pk-winner-name', text: state.picked[0].name }));
      spotlightEl.appendChild(el('span', { class: 'pk-vs', text: 'VS / PAIR' }));
      spotlightEl.appendChild(el('span', { class: 'pk-winner-name', text: state.picked[1].name }));
    } else {
      spotlightEl.appendChild(el('span', { style: { fontSize: '1.8rem' }, text: M.icon }));
      spotlightEl.appendChild(el('span', { class: 'pk-winner-name', text: state.picked[0].name }));
    }
    spotlightEl.appendChild(el('button', {
      type: 'button',
      class: 'btn mint',
      text: '+10 ⭐ Good Job!',
      onclick: function (ev) {
        Kit.sound('win');
        var c = Kit.centerOf(ev.currentTarget);
        Kit.confetti(c.x, c.y, 45);
        state.stars += 10;
        Kit.toast('⭐ Great speaking! +10 Stars!');
      }
    }));
  }

  function drawControls() {
    controls.innerHTML = '';
    controls.appendChild(goBtn);
  }

  function availablePool() {
    var pool = state.fairMode
      ? state.pupils.filter(function (p) { return !state.usedIds[p.id]; })
      : state.pupils.slice();
    if (pool.length < M.count) {
      state.usedIds = {};
      pool = state.pupils.slice();
      Kit.toast('🔄 Everyone had a turn! Starting a fresh round.');
    }
    return pool;
  }

  function startPick() {
    if (state.picking || !state.pupils.length) return;
    state.picking = true;
    goBtn.disabled = true;
    state.picked = [];
    spotlightEl.classList.remove('show');

    var pool = availablePool();
    var chosen = Kit.shuffle(pool).slice(0, M.count);

    if (ufoShipEl) ufoShipEl.classList.add('beaming');
    if (washerWrapEl) washerWrapEl.classList.add('spinning');
    if (dragonWrapEl) dragonWrapEl.classList.add('diving');

    var ticks = 0;
    var maxTicks = 14;
    var timer = setInterval(function () {
      ticks++;
      Kit.sound('tick');
      var sample = Kit.shuffle(pool).slice(0, M.count);
      drawCrowd(sample.map(function (s) { return s.id; }));
      if (ufoShipEl) {
        var shift = ((ticks % 5) - 2) * 52;
        ufoShipEl.style.transform = 'translateX(' + shift + 'px)';
      }
      if (washerDrumEl) {
        washerDrumEl.textContent = sample[0] ? sample[0].name : '🫧';
      }
      if (ticks >= maxTicks) {
        clearInterval(timer);
        finishPick(chosen);
      }
    }, 105);
  }

  function finishPick(chosen) {
    state.picking = false;
    goBtn.disabled = false;
    state.picked = chosen;
    if (state.fairMode) {
      chosen.forEach(function (p) { state.usedIds[p.id] = 1; });
    }
    if (ufoShipEl) {
      ufoShipEl.classList.remove('beaming');
      ufoShipEl.style.transform = 'translateX(0px)';
    }
    if (washerWrapEl) washerWrapEl.classList.remove('spinning');
    if (washerDrumEl) washerDrumEl.textContent = chosen[0] ? chosen[0].name : '🫧';
    if (dragonWrapEl) dragonWrapEl.classList.remove('diving');

    drawHud();
    drawCrowd([]);
    drawSpotlight();
    Kit.sound('win');
    var c = Kit.centerOf(spotlightEl);
    Kit.confetti(c.x || window.innerWidth / 2, c.y || window.innerHeight / 2, 60);
    if (!Kit.preview) {
      Kit.say(chosen.map(function (p) { return p.name; }).join(' and '));
    }
  }

  function openRosterModal() {
    var names = state.pupils.map(function (p) { return p.name; }).join('\n');
    var ta = el('textarea', { text: names });
    ta.value = names;
    var bg = el('div', { class: 'pk-modal-bg' });
    var modal = el('div', { class: 'pk-modal' }, [
      el('h3', { style: { margin: 0 }, text: '👥 Quick Class Roster' }),
      el('div', { style: { fontSize: '0.9rem', color: '#6b537c', fontWeight: 700 }, text: 'One pupil name or number per line:' }),
      ta,
      el('div', { style: { display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' } }, [
        el('button', {
          type: 'button',
          class: 'btn',
          text: 'Use Demo 1–12',
          onclick: function () {
            localStorage.removeItem(CUSTOM_KEY);
            state.usedIds = {};
            state.picked = [];
            loadPupils();
            bg.remove();
            renderAll();
          }
        }),
        el('button', {
          type: 'button',
          class: 'btn',
          text: 'Cancel',
          onclick: function () { bg.remove(); }
        }),
        el('button', {
          type: 'button',
          class: 'btn mint',
          text: 'Save Roster',
          onclick: function () {
            var lines = ta.value.split(/\r?\n|,/).map(function (s) { return s.trim(); }).filter(Boolean);
            if (lines.length < 2) {
              Kit.toast('Please enter at least 2 names.');
              return;
            }
            try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(lines)); } catch (e) {}
            state.usedIds = {};
            state.picked = [];
            loadPupils();
            bg.remove();
            renderAll();
          }
        })
      ])
    ]);
    bg.appendChild(modal);
    document.body.appendChild(bg);
  }

  function renderAll() {
    drawHud();
    drawTopPrompt();
    drawCrowd([]);
    drawSpotlight();
    drawControls();
  }

  loadPupils();
  buildArena();
  renderAll();
  loadPromptCards().then(drawTopPrompt);

  if (Kit.preview) {
    setTimeout(function () { startPick(); }, 500);
  }
})();
