/**
 * Reactive State Machine & Controller
 */
(function() {
  const session = {
    xp: 0,
    currentPhase: 1,
    p1SolvedCount: 0,
    p1CurrentTarget: null,
    p2Index: 0,
    p2Deck: []
  };

  const dom = {
    hudXP: document.getElementById('hud-xp'),
    hudPhase: document.getElementById('hud-phase'),
    stageP1: document.getElementById('stage-phase1'),
    stageP2: document.getElementById('stage-phase2'),
    stageP3: document.getElementById('stage-phase3'),
    waveform: document.getElementById('waveform-visualizer'),
    btnReplay: document.getElementById('btn-replay-cue'),
    cardsContainerP1: document.getElementById('phase1-cards-container'),
    grammarCardIcon: document.getElementById('grammar-card-icon'),
    grammarCardLabel: document.getElementById('grammar-card-label'),
    btnSingular: document.getElementById('btn-choice-singular'),
    btnPlural: document.getElementById('btn-choice-plural'),
    teleLine1: document.getElementById('tele-line-1'),
    teleLine2: document.getElementById('tele-line-2'),
    teleLine3: document.getElementById('tele-line-3'),
    btnTestFoley: document.getElementById('btn-test-foley'),
    btnBroadcast: document.getElementById('btn-broadcast-report')
  };

  function addXP(amount) {
    session.xp += amount;
    dom.hudXP.textContent = session.xp;
    window.SoundAudio.playXP();
  }

  function triggerWaveform(durationMs = 1200) {
    dom.waveform.classList.add('active');
    setTimeout(() => dom.waveform.classList.remove('active'), durationMs);
  }

  // --- PHASE 1: SOUND CHAMBER ---
  function initPhase1Round() {
    const items = SOUND_DETECTIVE_DATA.items;
    const target = items[Math.floor(Math.random() * items.length)];
    session.p1CurrentTarget = target;

    // Pick 2 distractors
    const distractors = items.filter(i => i.id !== target.id)
                             .sort(() => 0.5 - Math.random())
                             .slice(0, 2);

    const trio = [target, ...distractors].sort(() => 0.5 - Math.random());

    dom.cardsContainerP1.innerHTML = '';
    trio.forEach(item => {
      const card = document.createElement('div');
      card.className = 'guess-card';
      card.innerHTML = `
        <div class="card-icon">${item.icon}</div>
        <div class="card-name">${item.name}</div>
      `;
      card.onclick = () => handleP1Guess(item, card);
      dom.cardsContainerP1.appendChild(card);
    });

    // Play initial sound
    setTimeout(() => playCurrentCue(), 400);
  }

  function playCurrentCue() {
    if (!session.p1CurrentTarget) return;
    const method = session.p1CurrentTarget.audioMethod;
    if (window.SoundAudio && window.SoundAudio[method]) {
      window.SoundAudio[method]();
      triggerWaveform();
    }
  }

  function handleP1Guess(selectedItem, cardElement) {
    if (selectedItem.id === session.p1CurrentTarget.id) {
      cardElement.style.borderColor = 'var(--emerald)';
      addXP(10);
      window.SoundAudio.speak(selectedItem.sentence);

      session.p1SolvedCount++;
      if (session.p1SolvedCount >= SOUND_DETECTIVE_DATA.config.phase1Goal) {
        setTimeout(startPhase2, 1200);
      } else {
        setTimeout(initPhase1Round, 1200);
      }
    } else {
      cardElement.classList.add('wobble');
      window.SoundAudio.playSoftFail();
      setTimeout(() => cardElement.classList.remove('wobble'), 400);
      window.SoundAudio.speak("Listen again! " + session.p1CurrentTarget.hint);
    }
  }

  // --- PHASE 2: GRAMMAR TRAP ARENA ---
  function startPhase2() {
    session.currentPhase = 2;
    dom.hudPhase.textContent = "Phase 2/3";
    dom.stageP1.style.display = 'none';
    dom.stageP2.style.display = 'flex';

    session.p2Deck = [...SOUND_DETECTIVE_DATA.items].sort(() => 0.5 - Math.random());
    session.p2Index = 0;
    renderPhase2Card();
  }

  function renderPhase2Card() {
    const item = session.p2Deck[session.p2Index];
    dom.grammarCardIcon.textContent = item.icon;
    dom.grammarCardLabel.textContent = item.name;
  }

  function handleGrammarChoice(choice) {
    const item = session.p2Deck[session.p2Index];
    if (item.grammarType === choice) {
      addXP(10);
      window.SoundAudio.speak("Correct! " + item.sentence);
      session.p2Index++;

      if (session.p2Index >= 8 || session.p2Index >= session.p2Deck.length) {
        setTimeout(startPhase3, 1000);
      } else {
        setTimeout(renderPhase2Card, 700);
      }
    } else {
      window.SoundAudio.playSoftFail();
      window.SoundAudio.speak(
        item.grammarType === "plural" 
          ? "Remember: Cards and dice are plural. They're!" 
          : "Singular object! Use: It's a!"
      );
    }
  }

  // --- PHASE 3: FOLEY STUDIO ---
  function startPhase3() {
    session.currentPhase = 3;
    dom.hudPhase.textContent = "Phase 3/3";
    dom.stageP2.style.display = 'none';
    dom.stageP3.style.display = 'flex';

    const showcaseItem = SOUND_DETECTIVE_DATA.items[0]; // Clock or active mystery object
    dom.teleLine3.textContent = `📢 3. "Answer: ${showcaseItem.sentence}"`;

    dom.btnTestFoley.onclick = () => {
      if (window.SoundAudio && window.SoundAudio[showcaseItem.audioMethod]) {
        window.SoundAudio[showcaseItem.audioMethod]();
      }
    };

    dom.btnBroadcast.onclick = () => {
      dom.btnBroadcast.disabled = true;
      runTeleprompterSequence(showcaseItem);
    };
  }

  function runTeleprompterSequence(item) {
    dom.teleLine1.classList.add('active');
    window.SoundAudio.speak("Listen carefully... what's that sound?");

    setTimeout(() => {
      dom.teleLine1.classList.remove('active');
      dom.teleLine2.classList.add('active');
      window.SoundAudio.speak("Can you guess the household object?");
    }, 2800);

    setTimeout(() => {
      dom.teleLine2.classList.remove('active');
      dom.teleLine3.classList.add('active');
      window.SoundAudio.speak("Answer: " + item.sentence);
      if (window.SoundAudio && window.SoundAudio[item.audioMethod]) {
        window.SoundAudio[item.audioMethod]();
      }
      addXP(50);
    }, 5600);
  }

  // Attach global event listeners
  if (dom.btnReplay) dom.btnReplay.onclick = () => playCurrentCue();
  if (dom.btnSingular) dom.btnSingular.onclick = () => handleGrammarChoice("singular");
  if (dom.btnPlural) dom.btnPlural.onclick = () => handleGrammarChoice("plural");

  // Initial boot
  document.addEventListener('DOMContentLoaded', () => {
    initPhase1Round();
  });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPhase1Round();
  }
})();
