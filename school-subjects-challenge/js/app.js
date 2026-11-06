/* School Subjects Group Challenge — Interactive Smartboard Controller */
(function (root) {
  'use strict';

  var D = root.SubjectsData;
  var A = root.ChallengeAudio;

  var state = {
    phase: 1,
    activeGroupIdx: 0,
    scores: [0, 0, 0, 0],
    completedGroups: {},
    revealedSubjects: {},
    mathsPicked: [],
    mathsSumDone: false,
    artPlaced: {},
    scienceTested: {},
    musicPatternIdx: 0,
    musicInput: [],
    showcaseIdx: 0,
    speakIdx: 0,
    quizIdx: 0
  };

  function initMaths() {
    var g = D.groups[0];
    var r = g.numbersRounds[0];
    state.mathsPool = [18, 5, 24, 9, 12];
    state.mathsPicked = [];
    state.mathsSumDone = false;
    state.mathsTarget = r.target.slice();
    state.mathsRound = r;
  }
  initMaths();

  function toast(msg) {
    var el = document.getElementById('sb-toast');
    if (!el) return;
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(state._toastTimer);
    state._toastTimer = setTimeout(function () { el.style.opacity = '0'; }, 2300);
  }

  function addTeamPoint(teamIdx, pts) {
    state.scores[teamIdx] = (state.scores[teamIdx] || 0) + (pts || 10);
    A.playCorrect();
    renderScoreboard();
    toast('⭐ Group ' + (teamIdx + 1) + ' +' + (pts || 10) + ' Points!');
    try {
      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP(pts || 10, 'school-subjects-challenge');
      }
    } catch (e) {}
  }

  function renderScoreboard() {
    var box = document.getElementById('sb-teams');
    if (!box) return;
    box.innerHTML = [0, 1, 2, 3].map(function (i) {
      return '<button type="button" class="sb-team-chip t' + (i + 1) + '" onclick="SubjectsApp.addTeamPoint(' + i + ', 10)" title="Tap to award +10 pts to Group ' + (i + 1) + '">' +
        '<span>👥 Group ' + (i + 1) + '</span>' +
        '<span class="sb-team-pts">⭐ ' + state.scores[i] + '</span>' +
      '</button>';
    }).join('');
  }

  function setPhase(p) {
    A.playTap();
    state.phase = p;
    render();
    if (p === 1) {
      var g = D.groups[state.activeGroupIdx];
      A.speak(g.taskPrompt, g.taskClip);
    } else if (p === 2) {
      A.speak('Look at what this group did! Class, can you guess the school subject? Is it Maths, Art, Science, or Music?', 's_guess_prompt');
    } else if (p === 3) {
      var sg = D.groups[state.speakIdx];
      A.speak(sg.sentence, sg.sentenceClip);
    }
  }

  function selectGroup(idx) {
    A.playTap();
    state.activeGroupIdx = idx;
    var g = D.groups[idx];
    A.speak(g.taskPrompt, g.taskClip);
    render();
  }

  function speakGroupTask() {
    var g = D.groups[state.activeGroupIdx];
    A.speak(g.taskPrompt, g.taskClip);
  }

  function speakAskClass() {
    A.speak('Look at what this group did! Class, can you guess the school subject? Is it Maths, Art, Science, or Music?', 's_guess_prompt');
  }

  function speakShowcaseSentence() {
    var g = D.groups[state.showcaseIdx];
    A.speak(g.sentence, g.sentenceClip);
  }

  function speakCurrentSentence(slow) {
    var g = D.groups[state.speakIdx];
    if (slow) A.speak(g.sentence, null, 0.72);
    else A.speak(g.sentence, g.sentenceClip);
  }

  function tapNumber(num, btnEl) {
    var nextNeeded = state.mathsTarget[state.mathsPicked.length];
    if (num === nextNeeded) {
      state.mathsPicked.push(num);
      A.playCorrect();
      if (state.mathsPicked.length === state.mathsTarget.length) {
        toast('🔢 Numbers ordered! Now solve the sum below!');
      }
      render();
    } else {
      A.playSoftFail();
      A.speak('Good try! Look closely at the clue and try again!', 's_try_again');
      if (btnEl) {
        btnEl.classList.remove('wobble');
        void btnEl.offsetWidth;
        btnEl.classList.add('wobble');
      }
    }
  }

  function tapSum(opt, btnEl) {
    if (opt === state.mathsRound.sumAns) {
      state.mathsSumDone = true;
      state.completedGroups.maths = true;
      A.playFanfare();
      addTeamPoint(0, 20);
      toast('🎉 Group 1 Challenge Complete! Ready to present!');
      render();
    } else {
      A.playSoftFail();
      if (btnEl) { btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble'); }
    }
  }

  function toggleShape(shapeId) {
    state.artPlaced[shapeId] = !state.artPlaced[shapeId];
    A.playCorrect();
    var g = D.groups[1];
    var count = Object.keys(state.artPlaced).filter(function (k) { return state.artPlaced[k]; }).length;
    if (count >= g.shapes.length && !state.completedGroups.art) {
      state.completedGroups.art = true;
      A.playFanfare();
      addTeamPoint(1, 20);
      toast('🎨 Picture Complete! Group 2 built the House Picture!');
    }
    render();
  }

  function testScienceItem(itemId) {
    var g = D.groups[2];
    var item = g.items.filter(function (it) { return it.id === itemId; })[0];
    if (!item) return;
    state.scienceTested[itemId] = item.floats ? 'float' : 'sink';
    A.playSplash(item.floats);
    A.speak(item.floats ? ('The ' + item.name.replace(/^[^a-zA-Z]+/, '') + ' floats!') : ('The ' + item.name.replace(/^[^a-zA-Z]+/, '') + ' sinks!'), item.clip);
    var count = Object.keys(state.scienceTested).length;
    if (count >= g.items.length && !state.completedGroups.science) {
      state.completedGroups.science = true;
      setTimeout(function () { A.playFanfare(); addTeamPoint(2, 20); toast('🔬 Experiment Complete! All 6 objects tested!'); render(); }, 600);
    }
    render();
  }

  function playRhythmDemo() {
    var g = D.groups[3];
    var pat = g.patterns[state.musicPatternIdx];
    state.musicInput = [];
    pat.seq.forEach(function (beat, idx) {
      setTimeout(function () {
        A.playBeat(beat === 'clap');
        var pad = document.getElementById('demo-beat-' + idx);
        if (pad) {
          pad.classList.add('lit');
          setTimeout(function () { pad.classList.remove('lit'); }, 280);
        }
      }, idx * 520);
    });
  }

  function tapBeatInput(kind) {
    var g = D.groups[3];
    var pat = g.patterns[state.musicPatternIdx];
    var expected = pat.seq[state.musicInput.length];
    A.playBeat(kind === 'clap');
    if (kind === expected) {
      state.musicInput.push(kind);
      if (state.musicInput.length === pat.seq.length) {
        state.completedGroups.music = true;
        A.playFanfare();
        addTeamPoint(3, 20);
        toast('🥁 Rhythm Matched! Group 4 nailed the beat!');
      }
      render();
    } else {
      state.musicInput = [];
      A.playSoftFail();
      toast('🎵 Listen to the rhythm pattern and try again from Beat 1!');
      render();
    }
  }

  function renderPhase1() {
    var g = D.groups[state.activeGroupIdx];
    var groupTabs = D.groups.map(function (grp, i) {
      var done = !!state.completedGroups[grp.id];
      return '<button type="button" class="btn-3d ' + (i === state.activeGroupIdx ? grp.color : '') + '" onclick="SubjectsApp.selectGroup(' + i + ')">' +
        '<span>👥 Group ' + grp.groupNum + '</span>' +
        '<span>' + (done ? '✅ Done' : '🔒 Mystery Task') + '</span>' +
      '</button>';
    }).join('');

    var workbenchHtml = '';
    if (g.id === 'maths') {
      var remaining = state.mathsPool.filter(function (n) { return state.mathsPicked.indexOf(n) === -1; });
      workbenchHtml =
        '<div class="grid-2">' +
          '<div class="art-card-3d" style="padding:20px">' +
            '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#38bdf8">Step A · Order Numbers (Smallest ➔ Biggest)</h3>' +
            '<p style="margin:0 0 14px;color:#cbd5e1">Tap the numbers in order from smallest to largest:</p>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;min-height:86px;padding:12px;border-radius:16px;background:rgba(6,9,17,0.7);margin-bottom:14px;align-items:center">' +
              (state.mathsPicked.length ? state.mathsPicked.map(function (n) {
                return '<span class="btn-3d emerald num-tile">' + n + '</span>';
              }).join('<span style="font-size:1.5rem;color:#38bdf8">➔</span>') : '<span style="color:#64748b;font-weight:700">Sorted numbers will appear here...</span>') +
            '</div>' +
            '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
              remaining.map(function (n) {
                return '<button type="button" class="btn-3d cyan num-tile" onclick="SubjectsApp.tapNumber(' + n + ', this)">' + n + '</button>';
              }).join('') +
              '<button type="button" class="btn-3d" style="margin-left:auto" onclick="SubjectsApp.resetGroupTask()">↺ Reset</button>' +
            '</div>' +
          '</div>' +
          '<div class="art-card-3d" style="padding:20px">' +
            '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#fde047">Step B · Solve the Group Calculation</h3>' +
            '<div style="font-size:2.6rem;font-weight:800;color:#fff;text-align:center;padding:22px;background:rgba(6,9,17,0.75);border-radius:18px;margin-bottom:16px">' + state.mathsRound.sumQ + '</div>' +
            '<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">' +
              state.mathsRound.sumOpts.map(function (opt) {
                var chosen = state.mathsSumDone && opt === state.mathsRound.sumAns;
                return '<button type="button" class="btn-3d ' + (chosen ? 'emerald' : 'amber') + ' num-tile" onclick="SubjectsApp.tapSum(' + opt + ', this)">' + opt + (chosen ? ' ✓' : '') + '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';
    } else if (g.id === 'art') {
      var svgParts = g.shapes.filter(function (sh) { return state.artPlaced[sh.id]; }).map(function (sh) { return sh.svg; }).join('');
      workbenchHtml =
        '<div class="grid-2">' +
          '<div class="art-card-3d" style="padding:20px">' +
            '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#fde047">Step A · Pick Geometric Shapes</h3>' +
            '<p style="margin:0 0 12px;color:#cbd5e1">Tap each shape to combine them into a picture:</p>' +
            '<div style="display:flex;flex-direction:column;gap:10px">' +
              g.shapes.map(function (sh) {
                var on = !!state.artPlaced[sh.id];
                return '<button type="button" class="btn-3d ' + (on ? 'emerald' : 'amber') + '" style="justify-content:space-between" data-shape="' + sh.id + '" onclick="SubjectsApp.toggleShape(this.getAttribute(\'data-shape\'))">' +
                  '<span>' + sh.label + '</span><span>' + (on ? '✓ Placed' : '+ Add Shape') + '</span>' +
                '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="art-card-3d" style="padding:20px;align-items:center;justify-content:center">' +
            '<h3 style="margin:0 0 10px;font-size:1.35rem;color:#38bdf8">Step B · Group Shape Canvas</h3>' +
            '<div class="shape-canvas" style="width:100%">' +
              '<svg viewBox="0 0 280 210" style="width:320px;height:240px">' +
                '<rect x="0" y="188" width="280" height="22" fill="#065f46" rx="4"/>' +
                svgParts +
              '</svg>' +
            '</div>' +
            '<div style="color:#cbd5e1;font-weight:700">' + Object.keys(state.artPlaced).filter(function (k) { return state.artPlaced[k]; }).length + ' / ' + g.shapes.length + ' shapes combined</div>' +
          '</div>' +
        '</div>';
    } else if (g.id === 'science') {
      var floatItems = g.items.filter(function (it) { return state.scienceTested[it.id] === 'float'; });
      var sinkItems = g.items.filter(function (it) { return state.scienceTested[it.id] === 'sink'; });
      workbenchHtml =
        '<div class="grid-2">' +
          '<div class="art-card-3d" style="padding:20px">' +
            '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#34d399">Step A · Test Objects in Water</h3>' +
            '<p style="margin:0 0 14px;color:#cbd5e1">Tap each object to drop it into the tank:</p>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
              g.items.map(function (it) {
                var res = state.scienceTested[it.id];
                return '<button type="button" class="btn-3d ' + (res === 'float' ? 'cyan' : (res === 'sink' ? 'violet' : '')) + '" data-item="' + it.id + '" onclick="SubjectsApp.testScienceItem(this.getAttribute(\'data-item\'))">' +
                  '<span>' + it.name + '</span>' +
                  (res ? '<span style="font-size:0.85rem;color:#fde047">(' + res.toUpperCase() + 'S)</span>' : '') +
                '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="art-card-3d" style="padding:20px">' +
            '<h3 style="margin:0 0 10px;font-size:1.35rem;color:#38bdf8">Step B · Live Water Tank Observation</h3>' +
            '<div class="water-tank">' +
              '<div>' +
                '<div style="font-size:0.88rem;font-weight:800;color:#fde047;margin-bottom:6px">🌊 FLOATS ON TOP:</div>' +
                '<div class="tank-zone-row">' +
                  (floatItems.length ? floatItems.map(function (it) { return '<span class="btn-3d cyan" style="padding:6px 12px;font-size:0.95rem">' + it.name + '</span>'; }).join('') : '<span style="color:#94a3b8">Drop objects to see what floats...</span>') +
                '</div>' +
              '</div>' +
              '<div>' +
                '<div style="font-size:0.88rem;font-weight:800;color:#fda4af;margin-bottom:6px">⚓ SINKS TO THE BOTTOM:</div>' +
                '<div class="tank-zone-row">' +
                  (sinkItems.length ? sinkItems.map(function (it) { return '<span class="btn-3d violet" style="padding:6px 12px;font-size:0.95rem">' + it.name + '</span>'; }).join('') : '<span style="color:#cbd5e1">Drop objects to see what sinks...</span>') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else {
      var pat = g.patterns[state.musicPatternIdx];
      workbenchHtml =
        '<div class="grid-2">' +
          '<div class="art-card-3d" style="padding:20px;text-align:center">' +
            '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#c084fc">Step A · Listen to the Rhythm Pattern</h3>' +
            '<p style="margin:0 0 14px;color:#cbd5e1">' + pat.name + '</p>' +
            '<div style="display:flex;gap:14px;justify-content:center;margin-bottom:18px">' +
              pat.seq.map(function (b, idx) {
                var matched = idx < state.musicInput.length;
                return '<div id="demo-beat-' + idx + '" class="btn-3d ' + (matched ? 'emerald' : 'violet') + ' beat-pad">' + (b === 'clap' ? '👏' : '🥁') + '</div>';
              }).join('') +
            '</div>' +
            '<button type="button" class="btn-3d amber" onclick="SubjectsApp.playRhythmDemo()">🔊 Play Rhythm Beat</button>' +
          '</div>' +
          '<div class="art-card-3d" style="padding:20px;text-align:center">' +
            '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#fde047">Step B · Clap &amp; Tap the Rhythm Back!</h3>' +
            '<p style="margin:0 0 16px;color:#cbd5e1">Tap the 4 beats in the exact order (' + state.musicInput.length + ' / 4):</p>' +
            '<div style="display:flex;gap:18px;justify-content:center">' +
              '<button type="button" class="btn-3d cyan" style="min-width:165px;min-height:92px;font-size:1.35rem" onclick="SubjectsApp.tapBeatInput(\'clap\')">👏 CLAP</button>' +
              '<button type="button" class="btn-3d coral" style="min-width:165px;min-height:92px;font-size:1.35rem" onclick="SubjectsApp.tapBeatInput(\'drum\')">🥁 DRUM</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>' + g.groupTitle + ' · ' + g.taskTitle + ' (Subject: ' + (state.revealedSubjects[g.id] ? g.subject : '❓ Mystery Subject') + ')</h2>' +
          '<p>' + g.taskPrompt + '</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button type="button" class="btn-3d amber" onclick="SubjectsApp.speakGroupTask()">🔊 Hear Task</button>' +
          '<button type="button" class="btn-3d emerald" onclick="SubjectsApp.setPhase(2)">👉 Go to Class Guessing (Phase 2)</button>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">' + groupTabs + '</div>' +
      workbenchHtml;
  }

  function guessSubject(chosenSubj, btnEl) {
    var g = D.groups[state.showcaseIdx];
    if (chosenSubj === g.subject) {
      state.revealedSubjects[g.id] = true;
      A.playFanfare();
      A.speak(g.sentence, g.sentenceClip);
      addTeamPoint(state.showcaseIdx, 15);
      toast("🎉 Correct! It's " + g.subject + '! "' + g.sentence + '"');
      render();
    } else {
      A.playSoftFail();
      A.speak('Good try! Look closely at the clue and try again!', 's_try_again');
      if (btnEl) { btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble'); }
    }
  }

  function renderPhase2() {
    var g = D.groups[state.showcaseIdx];
    var revealed = !!state.revealedSubjects[g.id];
    var tabs = D.groups.map(function (grp, i) {
      return '<button type="button" class="btn-3d ' + (i === state.showcaseIdx ? grp.color : '') + '" onclick="SubjectsApp.setShowcase(' + i + ')">' +
        '<span>👥 Group ' + grp.groupNum + ' Presentation</span>' +
        '<span>' + (state.revealedSubjects[grp.id] ? ('✅ ' + grp.subject) : '❓ Guess') + '</span>' +
      '</button>';
    }).join('');

    var subjectButtons = ['Maths', 'Art', 'Science', 'Music'].map(function (subj) {
      var isAns = revealed && subj === g.subject;
      return '<button type="button" class="btn-3d ' + (isAns ? 'emerald' : 'cyan') + '" style="min-height:74px;font-size:1.35rem" data-subj="' + subj + '" onclick="SubjectsApp.guessSubject(this.getAttribute(\'data-subj\'), this)">' +
        '<span>' + subj + '</span>' + (isAns ? ' <span>✓</span>' : '') +
      '</button>';
    }).join('');

    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>🎤 Step 3 &amp; 4: Group Presentation &amp; Class Subject Guess</h2>' +
          '<p>Group ' + g.groupNum + ' shows their challenge to the class! Rest of the class: Guess which school subject matches their activity!</p>' +
        '</div>' +
        '<button type="button" class="btn-3d amber" onclick="SubjectsApp.speakAskClass()">🔊 Ask the Class</button>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">' + tabs + '</div>' +
      '<div class="grid-2">' +
        '<div class="art-card-3d">' +
          '<div class="art-viewport" style="min-height:260px">' +
            '<img src="' + g.art + '" class="art-sprite" style="width:200px;height:200px" alt="' + g.taskTitle + '">' +
            '<div class="pedestal-disc"></div>' +
          '</div>' +
          '<div class="art-caption-tray">' +
            '<div style="font-size:1.35rem;font-weight:800;color:#fde047;margin-bottom:6px">👥 Group ' + g.groupNum + ' Activity Clue:</div>' +
            '<div style="font-size:1.12rem;color:#e2e8f0">' + g.clueSummary + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="art-card-3d" style="padding:24px;justify-content:center">' +
          '<h3 style="margin:0 0 14px;font-size:1.5rem;color:#fff;text-align:center">🤔 What School Subject Is It?</h3>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">' + subjectButtons + '</div>' +
          (revealed ? (
            '<div class="speech-Stage-card" style="padding:18px">' +
              '<div style="font-size:0.95rem;font-weight:800;color:#34d399">🎉 SUBJECT REVEALED: ' + g.subject.toUpperCase() + '!</div>' +
              '<div class="speech-sentence" style="font-size:1.85rem">' + g.sentenceHtml + '</div>' +
              '<div style="display:flex;gap:10px;justify-content:center">' +
                '<button type="button" class="btn-3d amber" onclick="SubjectsApp.speakShowcaseSentence()">🔊 Listen &amp; Repeat</button>' +
                '<button type="button" class="btn-3d emerald" onclick="SubjectsApp.setPhase(3)">🗣️ Open Full Speaking Stage</button>' +
              '</div>' +
            '</div>'
          ) : '<div style="text-align:center;color:#94a3b8;font-weight:700">Tap a subject button above when the class guesses!</div>') +
        '</div>' +
      '</div>';
  }

  function renderPhase3() {
    var g = D.groups[state.speakIdx];
    var q = D.sentenceQuiz[state.quizIdx];

    var cardsNav = D.groups.map(function (grp, i) {
      return '<button type="button" class="btn-3d ' + (i === state.speakIdx ? grp.color : '') + '" onclick="SubjectsApp.setSpeakIdx(' + i + ')">' +
        '<span>' + grp.emoji + ' ' + grp.subject + '</span>' +
      '</button>';
    }).join('');

    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>🗣️ Step 5: Say the Subject in a Full English Sentence!</h2>' +
          '<p>Each group stands up and says their full sentence clearly together!</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' + cardsNav + '</div>' +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="speech-Stage-card">' +
          '<img src="' + g.art + '" class="art-sprite" style="width:155px;height:155px" alt="' + g.subject + '">' +
          '<div class="pedestal-disc" style="margin:0 auto 10px"></div>' +
          '<div style="font-size:1.05rem;font-weight:800;color:#38bdf8">GROUP ' + g.groupNum + ' · ' + g.subject.toUpperCase() + '</div>' +
          '<div class="speech-sentence">' + g.sentenceHtml + '</div>' +
          '<p style="color:#cbd5e1;font-size:1.1rem;margin:0 0 18px">Bonus sentence: <b>"' + g.altSentence + '"</b></p>' +
          '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">' +
            '<button type="button" class="btn-3d amber" onclick="SubjectsApp.speakCurrentSentence(false)">🔊 Normal Speed</button>' +
            '<button type="button" class="btn-3d cyan" onclick="SubjectsApp.speakCurrentSentence(true)">🐢 Slow &amp; Clear</button>' +
            '<button type="button" class="btn-3d emerald" onclick="SubjectsApp.addTeamPoint(' + state.speakIdx + ', 15)">⭐ Award Group +15 pts</button>' +
          '</div>' +
        '</div>' +
        '<div class="art-card-3d" style="padding:24px;justify-content:center">' +
          '<div style="font-size:0.95rem;font-weight:800;color:#fde047;margin-bottom:6px">⚡ QUICK SENTENCE CHECK (' + (state.quizIdx + 1) + ' / ' + D.sentenceQuiz.length + ')</div>' +
          '<div style="font-size:1.85rem;font-weight:800;color:#fff;margin-bottom:18px;padding:18px;background:rgba(6,9,17,0.75);border-radius:18px">' + q.q + '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
            q.opts.map(function (opt) {
              return '<button type="button" class="btn-3d cyan" style="min-height:66px;font-size:1.25rem" data-opt="' + opt + '" onclick="SubjectsApp.answerQuiz(this.getAttribute(\'data-opt\'), this)">' + opt + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function answerQuiz(opt, btnEl) {
    var q = D.sentenceQuiz[state.quizIdx];
    if (opt === q.ans) {
      A.playFanfare();
      A.speak(q.q.replace('___', q.ans), q.clip);
      toast('🌟 Correct! "' + q.q.replace('___', q.ans) + '"');
      state.quizIdx = (state.quizIdx + 1) % D.sentenceQuiz.length;
      render();
    } else {
      A.playSoftFail();
      if (btnEl) { btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble'); }
    }
  }

  function render() {
    renderScoreboard();
    var tabs = document.querySelectorAll('.sb-phase-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', (i + 1) === state.phase);
    }
    var stage = document.getElementById('sb-stage');
    if (!stage) return;
    if (state.phase === 1) stage.innerHTML = renderPhase1();
    else if (state.phase === 2) stage.innerHTML = renderPhase2();
    else stage.innerHTML = renderPhase3();
  }

  root.SubjectsApp = {
    init: function () { render(); },
    setPhase: setPhase,
    selectGroup: selectGroup,
    speakGroupTask: speakGroupTask,
    speakAskClass: speakAskClass,
    speakShowcaseSentence: speakShowcaseSentence,
    speakCurrentSentence: speakCurrentSentence,
    addTeamPoint: addTeamPoint,
    tapNumber: tapNumber,
    tapSum: tapSum,
    resetGroupTask: function () { initMaths(); render(); },
    toggleShape: toggleShape,
    testScienceItem: testScienceItem,
    playRhythmDemo: playRhythmDemo,
    tapBeatInput: tapBeatInput,
    setShowcase: function (idx) { A.playTap(); state.showcaseIdx = idx; render(); },
    guessSubject: guessSubject,
    setSpeakIdx: function (idx) { A.playTap(); state.speakIdx = idx; var g = D.groups[idx]; A.speak(g.sentence, g.sentenceClip); render(); },
    answerQuiz: answerQuiz,
    toggleMute: function () {
      var m = A.toggleMute();
      var btn = document.getElementById('sb-mute-btn');
      if (btn) btn.textContent = m ? '🔇 Muted' : '🔊 Sound';
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    root.SubjectsApp.init();
  });
})(typeof window !== 'undefined' ? window : this);
