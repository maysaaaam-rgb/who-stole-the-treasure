/**
 * app.js - Fire Station Adventure: Interactive Digital English Lesson (A1+)
 * Designed for Classroom Smartboards, Projectors, and Interactive Whiteboards
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    currentSlide: 1,
    totalSlides: 23,
    tprIndex: 0,
    oralIndex: 0,
    trainIndex: 0,
    checkIndex: 0,
    tfIndex: 0,
    builderRound: 0,
    rapidIndex: 0,
    riddleRound: 0,
    riddleClueStep: 0,
    hoseArmed: false,
    extinguishedFires: new Set(),
    teamCounter: 0,
    selectedStoryCard: null,
    storySlotAssignments: {},
    builderCurrentWords: [],
  };

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const phaseTag = document.getElementById('phase-tag');
  const dotsContainer = document.getElementById('progress-dots-container');
  const teacherDrawer = document.getElementById('teacher-drawer');
  const btnTeacherMenu = document.getElementById('btn-teacher-menu');
  const btnCloseTeacher = document.getElementById('btn-close-teacher');
  const slideJumpList = document.getElementById('slide-jump-list');
  const teacherNotesBox = document.getElementById('teacher-notes-box');
  const btnShowAnswers = document.getElementById('btn-show-answers');
  const btnResetSlide = document.getElementById('btn-reset-slide');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const btnToggleSpeech = document.getElementById('btn-toggle-speech');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  // =========================================================================
  // TEACHER SCRIPT & NOTES DICTIONARY
  // =========================================================================
  const teacherNotes = {
    1: "WELCOME & INTRO: 'Today we have an exciting adventure: Fire Station Adventure! Can you become a firefighter? Let\'s find out!' Tap START THE ADVENTURE.",
    2: "MYSTERY OBJECTS: Tap each mystery box sequentially (1 to 5). Ask: 'What is it?' -> 'Who uses it?' -> 'Where are we going today?' (A fire station!).",
    3: "VOCABULARY DISCOVERY: Tap each card to pronounce. Model the physical prompt: 'HELMET - Touch your head!' Children pretend to put on their helmet.",
    4: "ACTION VOCABULARY (TPR): Physical movement drill. Teacher calls out: 'HOSE! PUT OUT! STRONG! BRAVE! TEAM!' Students perform physical poses together.",
    5: "TRAINING GAME: Teacher prompts: 'Find the helmet!' Students tap the target card. Make it fast! Celebrate when all cards are mastered.",
    6: "STORY PREDICTION: Look at the Twinkl book cover. Ask: 'Where are the children going?' (Fire station), 'What will they see?' (Fire engine). Tap LET\'S FIND OUT!",
    7: "SCENE 1 (ARRIVAL): Read/listen to text. FIND IT Challenge: Have a student tap the yellow FIRE STATION sign on the building!",
    8: "SCENE 2 (MEET CHARLIE): Reveal Charlie. Ask: 'Who is Charlie? A firefighter!' Identify her yellow helmet and navy protective uniform.",
    9: "SCENE 3 (WHAT DO FIREFIGHTERS DO?): Poll the class. Teach core structure: 'A firefighter can put out fires / rescue animals / help people.'",
    10: "ORAL DRILL: Choral repetition. Tap Listen, then have students say: 'A firefighter can put out fires / rescue animals / help people.'",
    11: "SCENE 4 (STRONG & BRAVE): Ask: 'Is being a firefighter easy?' (Hard & dangerous!). 'Does a firefighter need to be strong? YES! Brave? YES!'",
    12: "SCENE 5 (TEAMWORK): 'Can one firefighter do everything alone? No! Firefighters work as a team.' Tap High-Five button to join hands!",
    13: "SCENE 6 (FIRE ENGINE): Explore the vehicle. Ask: 'What is inside the fire engine?' (Helmets, hose, ladder). Laugh at pizza / teddy bear!",
    14: "SCENE 7 (TAKING TURNS): 'Do the children all go inside at the same time? No, they take turns!' Teach: 'take turns' = great teamwork.",
    15: "SCENE 8 (THE HOSE SIMULATION): Call up a student volunteer! 1. Tap hose nozzle to arm. 2. Tap burning fire to spray water. Celebrate FIRE OUT! Tap Next Volunteer.",
    16: "SCENE 9 (EQUIPMENT HUNT): Rapid gear hunt. Ask: 'Find the helmet! Find the hose! Find the uniform!'",
    17: "SCENE 10 (STORY CHECK): 4 quick multiple-choice questions checking comprehension of Charlie and her teamwork message.",
    18: "AFTER 1 (STORY ORDER): Tap a story picture, then tap slot 1 to 5 to sequence the story. Check order together.",
    19: "AFTER 2 (TRUE OR FALSE): 6 statements. Students vote True (Green) or False (Red). Discuss each statement.",
    20: "AFTER 3 (SENTENCE BUILDER): Tap word chips in order: 'A firefighter can help people / rescue animals / put out fires / use a hose.'",
    21: "AFTER 4 (FIREFIGHTER OR NOT?): Rapid card flash drill. Students yell: 'FIREFIGHTER!' or 'NOT A FIREFIGHTER!' and produce sentence.",
    22: "AFTER 5 (WHO AM I?): Reveal clues one by one. Students guess: 'A firefighter!' / 'A doctor!' / 'A police officer!'",
    23: "AFTER 6 & GRADUATION: Students select future dream career. Produce: 'I want to be a ______ because I can ______!' Celebrate with badges & confetti!"
  };

  // =========================================================================
  // SLIDE NAVIGATION & HUD
  // =========================================================================
  function initNavigation() {
    // Generate progress dots
    dotsContainer.innerHTML = '';
    slideJumpList.innerHTML = '';

    for (let i = 1; i <= state.totalSlides; i++) {
      // Dot
      const dot = document.createElement('div');
      dot.className = `dot ${i === 1 ? 'active' : ''}`;
      dot.title = `Slide ${i}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);

      // Slide Jump item in Teacher drawer
      const jumpBtn = document.createElement('button');
      const slideEl = document.getElementById(`slide-${i}`);
      const tag = slideEl ? slideEl.dataset.tag : `Slide ${i}`;
      jumpBtn.className = `slide-jump-btn ${i === 1 ? 'active' : ''}`;
      jumpBtn.innerText = `${i}. ${tag}`;
      jumpBtn.addEventListener('click', () => {
        goToSlide(i);
        teacherDrawer.classList.remove('open');
      });
      slideJumpList.appendChild(jumpBtn);
    }

    btnPrev.addEventListener('click', () => {
      window.soundEngine.playPop();
      if (state.currentSlide > 1) goToSlide(state.currentSlide - 1);
    });

    btnNext.addEventListener('click', () => {
      window.soundEngine.playPop();
      if (state.currentSlide < state.totalSlides) goToSlide(state.currentSlide + 1);
    });

    document.getElementById('btn-start-adventure').addEventListener('click', () => {
      window.soundEngine.playSuccess();
      goToSlide(2);
    });

    // Sound & Speech toggles
    btnToggleSound.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      btnToggleSound.innerText = isMuted ? '🔇' : '🔊';
    });

    btnToggleSpeech.addEventListener('click', () => {
      const enabled = window.soundEngine.toggleSpeech();
      btnToggleSpeech.innerText = enabled ? '🗣️' : '🤐';
    });

    // Fullscreen toggle
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btnFullscreen.innerText = '🗗';
      } else {
        document.exitFullscreen().catch(() => {});
        btnFullscreen.innerText = '⛶';
      }
    });

    // Teacher menu drawer
    btnTeacherMenu.addEventListener('click', () => {
      window.soundEngine.playPop();
      teacherDrawer.classList.toggle('open');
    });
    btnCloseTeacher.addEventListener('click', () => {
      teacherDrawer.classList.remove('open');
    });

    btnShowAnswers.addEventListener('click', () => {
      revealCurrentAnswers();
    });
    btnResetSlide.addEventListener('click', () => {
      resetCurrentSlide();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (state.currentSlide < state.totalSlides) goToSlide(state.currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (state.currentSlide > 1) goToSlide(state.currentSlide - 1);
      } else if (e.key.toLowerCase() === 't') {
        teacherDrawer.classList.toggle('open');
      } else if (e.key.toLowerCase() === 'm') {
        const isMuted = window.soundEngine.toggleMute();
        btnToggleSound.innerText = isMuted ? '🔇' : '🔊';
      } else if (e.key.toLowerCase() === 'f') {
        btnFullscreen.click();
      }
    });
  }

  function goToSlide(slideNum) {
    if (slideNum < 1 || slideNum > state.totalSlides) return;
    window.soundEngine.stopSpeech();

    slides.forEach(s => s.classList.remove('active'));
    const targetSlide = document.getElementById(`slide-${slideNum}`);
    if (targetSlide) targetSlide.classList.add('active');

    state.currentSlide = slideNum;

    // Update dots
    document.querySelectorAll('.dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === slideNum - 1);
      d.classList.toggle('completed', idx < slideNum - 1);
    });

    // Update Jump list
    document.querySelectorAll('.slide-jump-btn').forEach((b, idx) => {
      b.classList.toggle('active', idx === slideNum - 1);
    });

    // Update Phase Tag
    const phase = targetSlide.dataset.phase || 'before';
    phaseTag.className = `lesson-phase-tag phase-${phase}`;
    if (phase === 'before') phaseTag.innerText = 'Before the Story';
    else if (phase === 'during') phaseTag.innerText = 'During the Story';
    else phaseTag.innerText = 'After the Story';

    // Update Back / Next state
    btnPrev.disabled = slideNum === 1;
    btnNext.innerText = slideNum === state.totalSlides ? 'Finish 🎓' : 'Next ➡️';

    // Update Teacher Notes
    teacherNotesBox.innerText = teacherNotes[slideNum] || `Slide ${slideNum}: Guide students through the interactive task.`;

    // Slide-specific entry logic
    onSlideEnter(slideNum);
  }

  function onSlideEnter(slideNum) {
    if (slideNum === 5) initTrainingGame();
    if (slideNum === 15) resetHoseGame();
    if (slideNum === 17) renderCheckQuestion();
    if (slideNum === 18) initStoryOrderActivity();
    if (slideNum === 19) renderTfStatement();
    if (slideNum === 20) initSentenceBuilder();
    if (slideNum === 21) renderRapidCard();
    if (slideNum === 22) renderRiddle();
  }

  // =========================================================================
  // SLIDE 2: MYSTERY OBJECTS
  // =========================================================================
  function initMysteryObjects() {
    const cards = document.querySelectorAll('.mystery-card');
    const qText = document.getElementById('mystery-q-text');
    const aText = document.getElementById('mystery-a-text');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('revealed')) {
          card.classList.add('revealed');
          window.soundEngine.playMystery();
          const word = card.dataset.word;
          const q = card.dataset.question;
          const a = card.dataset.expected;
          qText.innerText = q;
          aText.innerText = `Expected Answer: ${a}`;
          window.soundEngine.speak(word);
        }
      });
    });
  }

  // =========================================================================
  // SLIDE 3: VOCABULARY DISCOVERY
  // =========================================================================
  function initVocabDiscovery() {
    const cards = document.querySelectorAll('.vocab-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active-vocab'));
        card.classList.add('active-vocab');
        window.soundEngine.playPop();
        const word = card.dataset.audio;
        window.soundEngine.speak(word);
      });
    });
  }

  // =========================================================================
  // SLIDE 4: ACTION VOCABULARY (TPR)
  // =========================================================================
  const tprActions = [
    { icon: '🪖', word: 'HELMET', action: 'Pretend to put on your helmet! "Click!"' },
    { icon: '💦', word: 'HOSE', action: 'Hold the heavy hose with two hands!' },
    { icon: '🐱', word: 'RESCUE', action: 'Pretend to rescue and cuddle a cute kitten!' },
    { icon: '🚿', word: 'PUT OUT', action: 'Spray water: "Psssshhh! Fire is out!"' },
    { icon: '💪', word: 'STRONG', action: 'Make a big muscle pose! "I am strong!"' },
    { icon: '🦸', word: 'BRAVE', action: 'Make a superhero pose! Hands on hips!' },
    { icon: '🤝', word: 'TEAM', action: 'Put hands in the center: "1, 2, 3 TEAM!"' },
  ];

  function initTprActions() {
    const card = document.getElementById('tpr-display-card');
    const icon = document.getElementById('tpr-icon');
    const word = document.getElementById('tpr-word');
    const action = document.getElementById('tpr-action');
    const btnPrevTpr = document.getElementById('btn-tpr-prev');
    const btnNextTpr = document.getElementById('btn-tpr-next');

    function updateTpr() {
      const item = tprActions[state.tprIndex];
      icon.innerText = item.icon;
      word.innerText = item.word;
      action.innerText = item.action;
      window.soundEngine.playPop();
      window.soundEngine.speak(item.word);
    }

    btnNextTpr.addEventListener('click', () => {
      state.tprIndex = (state.tprIndex + 1) % tprActions.length;
      updateTpr();
    });
    btnPrevTpr.addEventListener('click', () => {
      state.tprIndex = (state.tprIndex - 1 + tprActions.length) % tprActions.length;
      updateTpr();
    });

    card.addEventListener('click', () => {
      const item = tprActions[state.tprIndex];
      window.soundEngine.speak(`${item.word}! ${item.action}`);
    });
  }

  // =========================================================================
  // SLIDE 5: TRAINING GAME
  // =========================================================================
  const trainMissions = [
    { target: 'HELMET', prompt: '🚨 Find the HELMET!', matchWords: ['HELMET'] },
    { target: 'HOSE', prompt: '🚨 Find the HOSE!', matchWords: ['HOSE'] },
    { target: 'WEAR', prompt: '🚨 Find something firefighters WEAR!', matchWords: ['HELMET', 'UNIFORM'] },
    { target: 'USE', prompt: '🚨 Find something firefighters USE!', matchWords: ['HOSE', 'FIRE ENGINE'] },
    { target: 'ACTION', prompt: '🚨 Find what firefighters DO to animals!', matchWords: ['RESCUE'] },
    { target: 'ACTION2', prompt: '🚨 Find what firefighters DO to fires!', matchWords: ['PUT OUT'] },
  ];

  const trainPool = [
    { word: 'HELMET', emoji: '🪖' },
    { word: 'HOSE', emoji: '💦' },
    { word: 'FIRE ENGINE', emoji: '🚒' },
    { word: 'UNIFORM', emoji: '🦺' },
    { word: 'FIRE', emoji: '🔥' },
    { word: 'RESCUE', emoji: '🐱' },
    { word: 'PUT OUT', emoji: '🚿' },
    { word: 'STRONG', emoji: '💪' },
  ];

  function initTrainingGame() {
    const promptText = document.getElementById('train-prompt-text');
    const container = document.getElementById('train-cards-container');
    const mission = trainMissions[state.trainIndex % trainMissions.length];

    promptText.innerText = mission.prompt;
    window.soundEngine.speak(mission.prompt);

    container.innerHTML = '';
    trainPool.forEach(item => {
      const card = document.createElement('div');
      card.className = 'train-card';
      card.innerHTML = `<span style="font-size:50px;">${item.emoji}</span><span style="font-size:16px; font-weight:800;">${item.word}</span>`;

      card.addEventListener('click', () => {
        if (mission.matchWords.includes(item.word)) {
          card.classList.add('correct');
          window.soundEngine.playSuccess();
          promptText.innerText = `🎉 GREAT JOB! ${item.word} IS CORRECT!`;
          window.soundEngine.speak(`Great job! ${item.word}!`);
        } else {
          card.classList.add('wrong');
          window.soundEngine.playTryAgain();
          setTimeout(() => card.classList.remove('wrong'), 500);
        }
      });
      container.appendChild(card);
    });

    document.getElementById('btn-train-next-target').onclick = () => {
      state.trainIndex++;
      initTrainingGame();
    };
  }

  // =========================================================================
  // SLIDE 6: PRE-STORY PREDICTION
  // =========================================================================
  function initPrediction() {
    const bindOptionGroup = (groupId) => {
      const group = document.getElementById(groupId);
      if (!group) return;
      const btns = group.querySelectorAll('.option-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          window.soundEngine.playSuccess();
        });
      });
    };

    bindOptionGroup('pred-q1-options');
    bindOptionGroup('pred-q2-options');

    document.getElementById('btn-pred-confirm').addEventListener('click', () => {
      window.soundEngine.playSuccess();
      goToSlide(7);
    });
  }

  // =========================================================================
  // SLIDES 7-14: DURING THE STORY SCENES
  // =========================================================================
  function initStoryScenes() {
    // Read aloud button helpers
    const bindNarrate = (btnId, text) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          window.soundEngine.speak(text);
        });
      }
    };

    // Multi-page original Twinkl story sequence in Slide 7
    const s1Pages = [
      {
        pageNum: 1,
        img: `assets/story/01_tulip_class_listening.jpg`,
        p1: `Tulip Class were all listening eagerly, waiting for Mr Clark to tell them the big news.`,
        p2: `What is the big news?`,
        promptTitle: `Teacher Prompt:`,
        promptDesc: `Ask the class: "What are the children waiting for?"`,
        readText: `Tulip Class were all listening eagerly, waiting for Mr Clark to tell them the big news.`
      },
      {
        pageNum: 2,
        img: `assets/story/02_mr_clark_announcement.jpg`,
        p1: `"Next week," said Mr Clark, "we are going on a very special trip to the fire station! We will meet someone called Charlie, who will tell us all about being a firefighter."`,
        p2: `Who will they meet? Someone named Charlie!`,
        promptTitle: `Discussion:`,
        promptDesc: `Ask: "Where are they going? Who will they meet?"`,
        readText: `Next week, said Mr Clark, we are going on a very special trip to the fire station! We will meet someone called Charlie, who will tell us all about being a firefighter.`
      },
      {
        pageNum: 3,
        img: `assets/story/03_dylan_toy_engine.jpg`,
        p1: `All week, the children were buzzing with excitement. "I can't wait to meet Charlie," said Dylan. "I bet he's so cool!"`,
        p2: `Dylan plays with a toy fire engine!`,
        promptTitle: `Vocabulary Check:`,
        promptDesc: `Point to the toy: "What vehicle is Dylan playing with? A fire engine!"`,
        readText: `All week, the children were buzzing with excitement. I can't wait to meet Charlie, said Dylan. I bet he's so cool!`
      },
      {
        pageNum: 4,
        img: `assets/story/04_medinah_tayo_drawings.jpg`,
        p1: `"I think he'll be really strong!" said Medinah. "I'm going to tell him that I want to be a firefighter too!" said Tayo.`,
        p2: `Tayo sits in a cardboard fire engine with a yellow helmet!`,
        promptTitle: `Target Language:`,
        promptDesc: `Model Tayo's sentence: "I want to be a firefighter too!"`,
        readText: `I think he will be really strong, said Medinah. I am going to tell him that I want to be a firefighter too, said Tayo.`
      },
      {
        pageNum: 5,
        img: `assets/story/05_fire_station_arrival.svg`,
        p1: `It is an exciting day for the children in Tulip Class! They arrive outside the big red fire station with Mr Clark.`,
        p2: `Look at the big red doors and the shiny fire engine!`,
        promptTitle: `🔍 FIND IT CHALLENGE:`,
        promptDesc: `Can you find the FIRE STATION SIGN on the building? Tap the sign!`,
        readText: `It is an exciting day for the children in Tulip Class! They arrive outside the big red fire station with Mr Clark.`
      }
    ];

    let s1CurrentPage = 0;
    const imgScene1 = document.getElementById('img-scene1');
    const s1TextP1 = document.getElementById('s1-text-p1');
    const s1TextP2 = document.getElementById('s1-text-p2');
    const s1PromptTitle = document.getElementById('s1-prompt-title');
    const s1PromptDesc = document.getElementById('s1-prompt-desc');
    const s1Tabs = document.querySelectorAll('#s1-page-tabs .option-btn');
    const btnS1NextPage = document.getElementById('btn-s1-next-page');
    const btnNarrateS1 = document.getElementById('btn-narrate-s1');

    function loadS1Page(idx) {
      s1CurrentPage = idx;
      const data = s1Pages[idx];
      if (imgScene1) imgScene1.src = data.img;
      if (s1TextP1) s1TextP1.innerText = data.p1;
      if (s1TextP2) s1TextP2.innerText = data.p2;
      if (s1PromptTitle) s1PromptTitle.innerText = data.promptTitle;
      if (s1PromptDesc) s1PromptDesc.innerText = data.promptDesc;

      s1Tabs.forEach((tab, i) => {
        tab.classList.toggle('selected', i === idx);
      });

      if (btnS1NextPage) {
        btnS1NextPage.innerText = idx === s1Pages.length - 1 ? 'Go to Meet Charlie 👩‍🚒' : 'Turn Page ➡️';
      }
      window.soundEngine.playPop();
    }

    s1Tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => loadS1Page(i));
    });

    if (btnS1NextPage) {
      btnS1NextPage.addEventListener('click', () => {
        if (s1CurrentPage < s1Pages.length - 1) {
          loadS1Page(s1CurrentPage + 1);
        } else {
          goToSlide(8);
        }
      });
    }

    if (btnNarrateS1) {
      btnNarrateS1.addEventListener('click', () => {
        const data = s1Pages[s1CurrentPage];
        window.soundEngine.speak(data.readText);
      });
    }
    bindNarrate('btn-narrate-s2', 'The children meet Charlie. Charlie is smiling and wearing her protective uniform!');
    bindNarrate('btn-narrate-s3', 'Charlie explains: Firefighters put out fires, rescue animals, and help people in emergencies!');
    bindNarrate('btn-narrate-s4', 'Is being a firefighter easy? No, it can be dangerous. Firefighters need to be strong, fit, and brave!');
    bindNarrate('btn-narrate-s5', 'Can one firefighter do everything alone? No! Firefighters work as a team and help each other.');
    bindNarrate('btn-narrate-s6', 'The children explore the big red fire engine. It has shiny ladders, blue sirens, and lots of equipment!');
    bindNarrate('btn-narrate-s7', 'Do all the children go inside at the same time? No! They take turns sitting at the steering wheel!');
    bindNarrate('btn-narrate-s9', 'The children explore the equipment: helmets, heavy boots, waterproof jackets, and hoses!');

    // Scene 1: Find the Sign interaction
    const signBox = document.getElementById('fire-station-sign-box');
    const signStatus = document.getElementById('sign-hunt-status');
    if (signBox) {
      signBox.addEventListener('click', () => {
        window.soundEngine.playSuccess();
        if (signStatus) {
          signStatus.innerText = '🎉 FOUND IT! That is the FIRE STATION sign!';
          signStatus.style.color = '#2e7d32';
        }
        window.soundEngine.speak('Great job! You found the fire station sign!');
      });
    }

    // Generic multi-choice button listeners
    const setupChoiceButtons = (containerId, correctValues, onCorrectText = 'Correct!') => {
      const container = document.getElementById(containerId);
      if (!container) return;
      const btns = container.querySelectorAll('.option-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.val;
          if (correctValues.includes(val)) {
            btn.classList.add('selected');
            window.soundEngine.playSuccess();
            window.soundEngine.speak(onCorrectText);
          } else {
            window.soundEngine.playBoing();
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 500);
          }
        });
      });
    };

    setupChoiceButtons('charlie-role-options', ['firefighter'], 'Charlie is a firefighter!');
    setupChoiceButtons('charlie-wear-options', ['helmet', 'uniform'], 'She wears a helmet and uniform!');
    setupChoiceButtons('firefighter-can-options', ['fires', 'animals', 'people'], 'A firefighter can do that!');
    setupChoiceButtons('job-easy-options', ['hard'], 'Firefighting is hard and dangerous!');
    setupChoiceButtons('job-strong-options', ['yes'], 'Firefighters must be strong and brave!');
    setupChoiceButtons('engine-items-options', ['helmet', 'hose', 'ladder'], 'That belongs in the fire engine!');
    setupChoiceButtons('taking-turns-options', ['yes'], 'Taking turns is wonderful teamwork!');

    // Scene 5: Teamwork High-Five Counter
    const btnHighFive = document.getElementById('btn-team-highfive');
    const teamCounter = document.getElementById('team-counter');
    if (btnHighFive && teamCounter) {
      btnHighFive.addEventListener('click', () => {
        state.teamCounter++;
        teamCounter.innerText = state.teamCounter;
        window.soundEngine.playPop();
        if (state.teamCounter % 3 === 0) {
          window.soundEngine.playSuccess();
          window.soundEngine.speak('1, 2, 3 Teamwork!');
        }
      });
    }

    // Oral Drill (Slide 10)
    const oralSentences = [
      { icon: '🔥', sentence: 'A firefighter can put out fires.' },
      { icon: '🐱', sentence: 'A firefighter can rescue animals.' },
      { icon: '👨‍👩‍👧', sentence: 'A firefighter can help people.' },
      { icon: '💦', sentence: 'A firefighter can use a hose.' },
    ];
    const oralIcon = document.getElementById('oral-icon');
    const oralSentence = document.getElementById('oral-sentence');
    const btnOralListen = document.getElementById('btn-oral-listen');
    const btnOralNext = document.getElementById('btn-oral-next');
    const btnOralPrev = document.getElementById('btn-oral-prev');

    function updateOral() {
      const item = oralSentences[state.oralIndex];
      oralIcon.innerText = item.icon;
      oralSentence.innerText = `"${item.sentence}"`;
      window.soundEngine.speak(item.sentence);
    }
    if (btnOralListen) {
      btnOralListen.addEventListener('click', () => {
        const item = oralSentences[state.oralIndex];
        window.soundEngine.speak(item.sentence);
      });
    }
    if (btnOralNext) {
      btnOralNext.addEventListener('click', () => {
        state.oralIndex = (state.oralIndex + 1) % oralSentences.length;
        updateOral();
      });
    }
    if (btnOralPrev) {
      btnOralPrev.addEventListener('click', () => {
        state.oralIndex = (state.oralIndex - 1 + oralSentences.length) % oralSentences.length;
        updateOral();
      });
    }
  }

  // =========================================================================
  // SLIDE 15: THE INTERACTIVE HOSE SIMULATION
  // =========================================================================
  function initHoseSimulation() {
    const nozzle = document.getElementById('hose-nozzle');
    const nozzleLabel = document.getElementById('nozzle-status-label');
    const fireTargets = document.querySelectorAll('.fire-target');
    const banner = document.getElementById('fire-out-banner');
    const btnNextVolunteer = document.getElementById('btn-next-volunteer');
    const canvas = document.getElementById('water-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // Handle canvas sizing
    function resizeCanvas() {
      const arena = document.getElementById('hose-arena');
      if (canvas && arena) {
        canvas.width = arena.clientWidth;
        canvas.height = arena.clientHeight;
      }
    }
    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 200);

    // 1. Tap Nozzle to arm
    nozzle.addEventListener('click', () => {
      state.hoseArmed = true;
      nozzle.classList.add('armed');
      nozzleLabel.innerText = '2. TAP A FIRE!';
      window.soundEngine.playWaterSpray(0.5);
      window.soundEngine.speak('Hose ready! Tap the fire!');
    });

    // 2. Tap Fire Target to spray
    fireTargets.forEach(target => {
      target.addEventListener('click', () => {
        if (!state.hoseArmed) {
          window.soundEngine.speak('Please tap the hose first!');
          nozzle.classList.add('armed');
          setTimeout(() => nozzle.classList.remove('armed'), 400);
          return;
        }

        const id = target.dataset.id;
        if (state.extinguishedFires.has(id)) return;

        // Spray water animation on canvas
        animateWaterStream(target, () => {
          target.classList.add('extinguished');
          state.extinguishedFires.add(id);
          window.soundEngine.playExtinguish();

          // Check if all fires out
          if (state.extinguishedFires.size === fireTargets.length) {
            banner.classList.add('active');
            window.soundEngine.playSiren();
            setTimeout(() => {
              window.soundEngine.playFanfare();
              window.soundEngine.speak('FIRE IS OUT! Great teamwork firefighters!');
            }, 600);
          }
        });
      });
    });

    function animateWaterStream(targetElement, onComplete) {
      if (!ctx || !canvas) {
        if (onComplete) onComplete();
        return;
      }
      resizeCanvas();
      window.soundEngine.playWaterSpray(0.8);

      const arena = document.getElementById('hose-arena');
      const arenaRect = arena.getBoundingClientRect();
      const nozzleRect = nozzle.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      const startX = nozzleRect.right - arenaRect.left;
      const startY = nozzleRect.top + nozzleRect.height / 2 - arenaRect.top;
      const endX = targetRect.left + targetRect.width / 2 - arenaRect.left;
      const endY = targetRect.top + targetRect.height / 2 - arenaRect.top;

      let progress = 0;
      const startTime = performance.now();
      const duration = 600;

      function step(now) {
        const elapsed = now - startTime;
        progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw arching water stream
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - 80;
        const currentEndX = startX + (endX - startX) * progress;
        const currentEndY = startY + (endY - startY) * progress;

        ctx.quadraticCurveTo(midX, midY, currentEndX, currentEndY);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(midX, midY, currentEndX, currentEndY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Water droplets
        if (progress > 0.5) {
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(currentEndX + (Math.random() * 40 - 20), currentEndY + (Math.random() * 40 - 20), Math.random() * 8 + 4, 0, Math.PI * 2);
            ctx.fillStyle = '#80d8ff';
            ctx.fill();
          }
        }
        ctx.restore();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (onComplete) onComplete();
        }
      }
      requestAnimationFrame(step);
    }

    btnNextVolunteer.addEventListener('click', () => {
      resetHoseGame();
      window.soundEngine.playSuccess();
      window.soundEngine.speak('Next volunteer ready!');
    });
  }

  function resetHoseGame() {
    state.hoseArmed = false;
    state.extinguishedFires.clear();
    const nozzle = document.getElementById('hose-nozzle');
    const nozzleLabel = document.getElementById('nozzle-status-label');
    const fireTargets = document.querySelectorAll('.fire-target');
    const banner = document.getElementById('fire-out-banner');

    if (nozzle) nozzle.classList.remove('armed');
    if (nozzleLabel) nozzleLabel.innerText = '1. TAP HOSE';
    if (banner) banner.classList.remove('active');
    fireTargets.forEach(t => t.classList.remove('extinguished'));
  }

  // =========================================================================
  // SLIDE 16: EQUIPMENT HUNT
  // =========================================================================
  function initEquipmentHunt() {
    const targets = [
      { name: 'helmet', prompt: '🎯 Touch: The HELMET!' },
      { name: 'uniform', prompt: '🎯 Touch: The UNIFORM!' },
      { name: 'hose', prompt: '🎯 Touch: The HOSE!' },
      { name: 'boots', prompt: '🎯 Touch: The BOOTS!' },
    ];
    let equipIdx = 0;
    const promptEl = document.getElementById('equip-prompt-text');
    const options = document.querySelectorAll('#equip-hunt-options .option-btn');

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        const currentTarget = targets[equipIdx % targets.length];
        if (val === currentTarget.name) {
          window.soundEngine.playSuccess();
          btn.classList.add('selected');
          equipIdx++;
          const nextTarget = targets[equipIdx % targets.length];
          promptEl.innerText = nextTarget.prompt;
          window.soundEngine.speak(`Found it! Next: ${nextTarget.prompt}`);
        } else {
          window.soundEngine.playTryAgain();
        }
      });
    });
  }

  // =========================================================================
  // SLIDE 17: STORY CHECK (COMPREHENSION)
  // =========================================================================
  const checkQuestions = [
    {
      icon: '👩‍🚒',
      q: 'Who did Tulip Class meet at the fire station?',
      options: ['Charlie the firefighter', 'A chef in a kitchen', 'A doctor with medicine'],
      correct: 0
    },
    {
      icon: '🔥',
      q: 'What can firefighters do?',
      options: ['Put out fires and rescue animals', 'Fly airplanes', 'Bake big cakes'],
      correct: 0
    },
    {
      icon: '💦',
      q: 'What special equipment did the children try?',
      options: ['A water hose', 'A computer', 'A guitar'],
      correct: 0
    },
    {
      icon: '🤝',
      q: 'Did firefighters work alone?',
      options: ['No, they worked as a team!', 'Yes, one firefighter alone'],
      correct: 0
    }
  ];

  function renderCheckQuestion() {
    const item = checkQuestions[state.checkIndex % checkQuestions.length];
    document.getElementById('check-icon').innerText = item.icon;
    document.getElementById('check-question').innerText = item.q;
    const container = document.getElementById('check-options-container');
    container.innerHTML = '';

    item.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = opt;
      btn.addEventListener('click', () => {
        if (idx === item.correct) {
          btn.classList.add('selected');
          window.soundEngine.playSuccess();
          window.soundEngine.speak(`Correct! ${opt}`);
        } else {
          btn.classList.add('wrong');
          window.soundEngine.playTryAgain();
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      });
      container.appendChild(btn);
    });

    document.getElementById('btn-check-next').onclick = () => {
      state.checkIndex++;
      renderCheckQuestion();
    };
  }

  // =========================================================================
  // SLIDE 18: STORY ORDER
  // =========================================================================
  const storyEvents = [
    { id: 1, text: '1. Tulip Class arrives at the fire station.', img: 'assets/story/05_fire_station_arrival.svg' },
    { id: 2, text: '2. They meet Charlie the firefighter.', img: 'assets/story/06_meet_charlie.svg' },
    { id: 3, text: '3. Charlie explains what firefighters do.', img: 'assets/story/07_what_firefighters_do.svg' },
    { id: 4, text: '4. The children try the water hose.', img: 'assets/story/12_hose_action.svg' },
    { id: 5, text: '5. They explore the equipment and cab.', img: 'assets/story/11_taking_turns.svg' },
  ];

  function initStoryOrderActivity() {
    const cardsPool = document.getElementById('order-cards-container');
    const slots = document.querySelectorAll('.order-slot');
    state.selectedStoryCard = null;
    state.storySlotAssignments = {};

    cardsPool.innerHTML = '';
    // Shuffle cards in pool
    const shuffled = [...storyEvents].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {
      const card = document.createElement('div');
      card.className = 'story-card-item';
      card.dataset.id = item.id;
      card.innerHTML = `
        <img src="${item.img}" class="story-card-img" alt="Story Event">
        <span class="story-card-text">${item.text}</span>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.story-card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selectedStoryCard = item;
        window.soundEngine.playPop();
      });
      cardsPool.appendChild(card);
    });

    slots.forEach(slot => {
      slot.addEventListener('click', () => {
        if (!state.selectedStoryCard) {
          window.soundEngine.speak('Please tap a picture below first!');
          return;
        }
        const slotNum = parseInt(slot.dataset.slot);
        state.storySlotAssignments[slotNum] = state.selectedStoryCard.id;

        slot.innerHTML = `
          <span class="slot-number">${slotNum}</span>
          <img src="${state.selectedStoryCard.img}" style="width:90%; height:75px; object-fit:cover; border-radius:10px;">
          <span style="font-size:12px; font-weight:800; color:#1b5e20;">${state.selectedStoryCard.text}</span>
        `;
        slot.classList.add('filled');
        window.soundEngine.playSuccess();

        // Mark card as placed
        const cardEl = cardsPool.querySelector(`[data-id="${state.selectedStoryCard.id}"]`);
        if (cardEl) cardEl.classList.add('placed');
        state.selectedStoryCard = null;
      });
    });

    document.getElementById('btn-check-order').onclick = () => {
      let isCorrect = true;
      for (let i = 1; i <= 5; i++) {
        if (state.storySlotAssignments[i] !== i) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect && Object.keys(state.storySlotAssignments).length === 5) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak('PERFECT ORDER! You are a super story detective!');
        alert('🎉 PERFECT ORDER! You arranged all 5 story events correctly! ⭐');
      } else {
        window.soundEngine.playTryAgain();
        alert('Almost! Look closely at what happened first, second, and at the end!');
      }
    };
  }

  // =========================================================================
  // SLIDE 19: TRUE OR FALSE
  // =========================================================================
  const tfStatements = [
    { icon: '👩‍🚒', text: '1. Charlie is a firefighter.', answer: true },
    { icon: '🤝', text: '2. Firefighters work alone.', answer: false },
    { icon: '🐱', text: '3. Firefighters can rescue animals.', answer: true },
    { icon: '🦸', text: '4. Firefighters never need to be brave.', answer: false },
    { icon: '💦', text: '5. The children used a water hose.', answer: true },
    { icon: '❤️', text: '6. Charlie says everyone must become a firefighter.', answer: false },
  ];

  function renderTfStatement() {
    const item = tfStatements[state.tfIndex % tfStatements.length];
    document.getElementById('tf-icon').innerText = item.icon;
    document.getElementById('tf-statement').innerText = item.text;
    window.soundEngine.speak(item.text);

    const btnTrue = document.getElementById('btn-tf-true');
    const btnFalse = document.getElementById('btn-tf-false');

    btnTrue.onclick = () => handleTfChoice(true, item.answer);
    btnFalse.onclick = () => handleTfChoice(false, item.answer);

    document.getElementById('btn-tf-next').onclick = () => {
      state.tfIndex++;
      renderTfStatement();
    };
  }

  function handleTfChoice(choice, expected) {
    if (choice === expected) {
      window.soundEngine.playSuccess();
      window.soundEngine.speak(choice ? 'TRUE! Great job!' : 'FALSE! That is correct!');
    } else {
      window.soundEngine.playTryAgain();
      window.soundEngine.speak('Try again!');
    }
  }

  // =========================================================================
  // SLIDE 20: BUILD THE SENTENCE
  // =========================================================================
  const sentenceRounds = [
    { words: ['A', 'firefighter', 'can', 'help', 'people.'], target: 'A firefighter can help people.' },
    { words: ['A', 'firefighter', 'can', 'rescue', 'animals.'], target: 'A firefighter can rescue animals.' },
    { words: ['A', 'firefighter', 'can', 'put', 'out', 'fires.'], target: 'A firefighter can put out fires.' },
    { words: ['A', 'firefighter', 'can', 'use', 'a', 'hose.'], target: 'A firefighter can use a hose.' },
  ];

  function initSentenceBuilder() {
    const round = sentenceRounds[state.builderRound % sentenceRounds.length];
    const dropZone = document.getElementById('builder-drop-zone');
    const pool = document.getElementById('builder-tiles-pool');
    state.builderCurrentWords = [];

    dropZone.innerHTML = '<span style="color:#90a4ae; font-size:20px; font-weight:700;">Tap words below to build the sentence...</span>';
    pool.innerHTML = '';

    // Shuffle words in pool
    const shuffled = [...round.words].sort(() => Math.random() - 0.5);

    shuffled.forEach(word => {
      const tile = document.createElement('div');
      tile.className = 'word-tile';
      tile.innerText = word;
      tile.addEventListener('click', () => {
        if (!tile.classList.contains('in-slot')) {
          tile.classList.add('in-slot');
          state.builderCurrentWords.push(word);
          renderDropZone();
          window.soundEngine.playPop();
          window.soundEngine.speak(word);
        }
      });
      pool.appendChild(tile);
    });

    function renderDropZone() {
      dropZone.innerHTML = '';
      if (state.builderCurrentWords.length === 0) {
        dropZone.innerHTML = '<span style="color:#90a4ae; font-size:20px; font-weight:700;">Tap words below to build the sentence...</span>';
        return;
      }
      state.builderCurrentWords.forEach((word, idx) => {
        const span = document.createElement('span');
        span.className = 'word-tile';
        span.style.background = '#e1f5fe';
        span.style.borderColor = '#0288d1';
        span.innerText = word;
        span.addEventListener('click', () => {
          // Remove word
          state.builderCurrentWords.splice(idx, 1);
          // Unmark in pool
          const poolTiles = pool.querySelectorAll('.word-tile');
          poolTiles.forEach(pt => {
            if (pt.innerText === word && pt.classList.contains('in-slot')) {
              pt.classList.remove('in-slot');
            }
          });
          renderDropZone();
        });
        dropZone.appendChild(span);
      });
    }

    document.getElementById('btn-builder-reset').onclick = () => {
      initSentenceBuilder();
    };

    document.getElementById('btn-builder-check').onclick = () => {
      const constructed = state.builderCurrentWords.join(' ');
      if (constructed === round.target) {
        window.soundEngine.playSuccess();
        window.soundEngine.speak(round.target);
        alert(`🎉 PERFECT! "${round.target}"`);
      } else {
        window.soundEngine.playTryAgain();
        alert(`Try arranging again! Listen carefully.`);
      }
    };

    document.getElementById('btn-builder-next').onclick = () => {
      state.builderRound++;
      initSentenceBuilder();
    };
  }

  // =========================================================================
  // SLIDE 21: RAPID FIRE - FIREFIGHTER OR NOT?
  // =========================================================================
  const rapidCards = [
    { icon: '🔥', title: 'Putting out a fire with water', isFirefighter: true, sentence: 'A firefighter can put out fires!' },
    { icon: '🍳', title: 'Cooking pancakes in a pan', isFirefighter: false, sentence: 'A chef cooks food!' },
    { icon: '🚒', title: 'Driving a big red fire engine', isFirefighter: true, sentence: 'Firefighters drive fire engines!' },
    { icon: '👩‍⚕️', title: 'Checking a patient with a stethoscope', isFirefighter: false, sentence: 'A doctor helps sick people!' },
    { icon: '🐱', title: 'Rescuing a cat stuck in a tree', isFirefighter: true, sentence: 'A firefighter can rescue animals!' },
    { icon: '🎨', title: 'Painting a colorful picture', isFirefighter: false, sentence: 'An artist paints pictures!' },
    { icon: '💦', title: 'Holding a high-pressure water hose', isFirefighter: true, sentence: 'A firefighter can use a hose!' },
    { icon: '👨‍🚀', title: 'Walking on the moon in a spacesuit', isFirefighter: false, sentence: 'An astronaut explores space!' },
  ];

  function renderRapidCard() {
    const item = rapidCards[state.rapidIndex % rapidCards.length];
    document.getElementById('rapid-icon').innerText = item.icon;
    document.getElementById('rapid-title').innerText = item.title;
    const speechBox = document.getElementById('rapid-speech-prompt');
    speechBox.style.display = 'none';
    speechBox.innerText = `"${item.sentence}"`;

    const btnYes = document.getElementById('btn-rapid-yes');
    const btnNo = document.getElementById('btn-rapid-no');

    btnYes.onclick = () => handleRapid(true, item.isFirefighter, item.sentence);
    btnNo.onclick = () => handleRapid(false, item.isFirefighter, item.sentence);

    document.getElementById('btn-rapid-next').onclick = () => {
      state.rapidIndex++;
      renderRapidCard();
    };
  }

  function handleRapid(choice, expected, sentence) {
    const speechBox = document.getElementById('rapid-speech-prompt');
    if (choice === expected) {
      window.soundEngine.playSuccess();
      speechBox.style.display = 'block';
      window.soundEngine.speak(sentence);
    } else {
      window.soundEngine.playBoing();
    }
  }

  // =========================================================================
  // SLIDE 22: WHO AM I?
  // =========================================================================
  const riddles = [
    {
      answer: 'A FIREFIGHTER! 👩‍🚒',
      icon: '🧑‍🚒',
      clues: [
        '1. I wear a yellow helmet.',
        '2. I use a long water hose.',
        '3. I help people and rescue animals.',
        '4. I put out big fires!'
      ]
    },
    {
      answer: 'A DOCTOR! 👨‍⚕️',
      icon: '👨‍⚕️',
      clues: [
        '1. I wear a white coat.',
        '2. I work in a hospital.',
        '3. I use a stethoscope to listen to your heart.',
        '4. I help people feel better!'
      ]
    },
    {
      answer: 'A POLICE OFFICER! 👮',
      icon: '👮',
      clues: [
        '1. I wear a blue uniform and a badge.',
        '2. I drive a car with flashing blue lights.',
        '3. I help keep our streets safe.',
        '4. I help lost children!'
      ]
    }
  ];

  function renderRiddle() {
    const riddle = riddles[state.riddleRound % riddles.length];
    state.riddleClueStep = 1;
    document.getElementById('riddle-icon').innerText = '❓';
    const list = document.getElementById('riddle-clues-list');
    list.innerHTML = `<div style="font-size:24px; font-weight:800; color:#0d47a1;">${riddle.clues[0]}</div>`;
    window.soundEngine.speak(riddle.clues[0]);

    document.getElementById('btn-riddle-next-clue').onclick = () => {
      if (state.riddleClueStep < riddle.clues.length) {
        const clueText = riddle.clues[state.riddleClueStep];
        const clueDiv = document.createElement('div');
        clueDiv.style.fontSize = '24px';
        clueDiv.style.fontWeight = '800';
        clueDiv.style.color = '#0d47a1';
        clueDiv.innerText = clueText;
        list.appendChild(clueDiv);
        window.soundEngine.playPop();
        window.soundEngine.speak(clueText);
        state.riddleClueStep++;
      }
    };

    document.getElementById('btn-riddle-reveal').onclick = () => {
      document.getElementById('riddle-icon').innerText = riddle.icon;
      list.innerHTML += `<div style="font-size:32px; font-weight:900; color:#d32f2f; margin-top:12px;">🎉 I AM ${riddle.answer}</div>`;
      window.soundEngine.playFanfare();
      window.soundEngine.speak(`I am ${riddle.answer}`);
    };

    document.getElementById('btn-riddle-next-round').onclick = () => {
      state.riddleRound++;
      renderRiddle();
    };
  }

  // =========================================================================
  // SLIDE 23: FUTURE JOBS & GRADUATION
  // =========================================================================
  function initFutureJobs() {
    const jobCards = document.querySelectorAll('.job-item-card');
    const frame = document.getElementById('final-speaking-frame');
    const btnCelebrate = document.getElementById('btn-celebrate-graduation');

    const jobReasons = {
      firefighter: 'because I can help people and put out fires',
      doctor: 'because I can help sick people',
      teacher: 'because I can teach children',
      astronaut: 'because I can fly to space',
      scientist: 'because I can make new discoveries',
      chef: 'because I can cook delicious food',
      footballer: 'because I can score goals',
      artist: 'because I can paint beautiful pictures'
    };

    jobCards.forEach(card => {
      card.addEventListener('click', () => {
        jobCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const job = card.dataset.job;
        const reason = jobReasons[job] || 'because I can do great things';
        const sentence = `I want to be a ${job} ${reason}!`;
        frame.innerText = `"${sentence}"`;
        window.soundEngine.playSuccess();
        window.soundEngine.speak(sentence);
      });
    });

    btnCelebrate.addEventListener('click', () => {
      window.soundEngine.playFanfare();
      window.soundEngine.speak('Congratulations Tulip Class! You completed the Fire Station Adventure! Be yourself!');
      triggerConfetti();
    });
  }

  // Confetti Animation Canvas
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];

    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        velY: Math.random() * 5 + 3,
        velX: Math.random() * 4 - 2,
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.velY;
        p.x += p.velX;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 220) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(render);
  }

  // =========================================================================
  // TEACHER CONTROLS: SHOW ANSWERS & RESET
  // =========================================================================
  function revealCurrentAnswers() {
    window.soundEngine.playSuccess();
    const current = state.currentSlide;

    if (current === 2) {
      document.querySelectorAll('.mystery-card').forEach(c => c.classList.add('revealed'));
    } else if (current === 6) {
      document.querySelector('[data-val="firestation"]')?.classList.add('selected');
      document.querySelector('[data-val="engine"]')?.classList.add('selected');
    } else if (current === 7) {
      document.getElementById('sign-hunt-status').innerText = '🎉 FOUND IT! The Fire Station Sign!';
    } else if (current === 8) {
      document.querySelector('[data-val="firefighter"]')?.classList.add('selected');
      document.querySelector('[data-val="helmet"]')?.classList.add('selected');
      document.querySelector('[data-val="uniform"]')?.classList.add('selected');
    } else if (current === 9) {
      document.querySelector('[data-val="fires"]')?.classList.add('selected');
      document.querySelector('[data-val="animals"]')?.classList.add('selected');
      document.querySelector('[data-val="people"]')?.classList.add('selected');
    } else if (current === 11) {
      document.querySelector('[data-val="hard"]')?.classList.add('selected');
      document.querySelector('[data-val="yes"]')?.classList.add('selected');
    } else if (current === 13) {
      document.querySelector('#engine-items-options [data-val="helmet"]')?.classList.add('selected');
      document.querySelector('#engine-items-options [data-val="hose"]')?.classList.add('selected');
      document.querySelector('#engine-items-options [data-val="ladder"]')?.classList.add('selected');
    } else if (current === 14) {
      document.querySelector('#taking-turns-options [data-val="yes"]')?.classList.add('selected');
    } else if (current === 15) {
      document.querySelectorAll('.fire-target').forEach(t => t.classList.add('extinguished'));
      document.getElementById('fire-out-banner').classList.add('active');
    } else if (current === 18) {
      for (let i = 1; i <= 5; i++) {
        const slot = document.querySelector(`.order-slot[data-slot="${i}"]`);
        const ev = storyEvents[i - 1];
        state.storySlotAssignments[i] = i;
        slot.innerHTML = `
          <span class="slot-number">${i}</span>
          <img src="${ev.img}" style="width:90%; height:75px; object-fit:cover; border-radius:10px;">
          <span style="font-size:12px; font-weight:800; color:#1b5e20;">${ev.text}</span>
        `;
        slot.classList.add('filled');
      }
      document.querySelectorAll('.story-card-item').forEach(c => c.classList.add('placed'));
    } else if (current === 19) {
      const item = tfStatements[state.tfIndex % tfStatements.length];
      const targetBtn = item.answer ? document.getElementById('btn-tf-true') : document.getElementById('btn-tf-false');
      targetBtn.style.transform = 'scale(1.15)';
      setTimeout(() => targetBtn.style.transform = 'none', 1000);
    }
  }

  function resetCurrentSlide() {
    window.soundEngine.playPop();
    const current = state.currentSlide;
    if (current === 2) {
      document.querySelectorAll('.mystery-card').forEach(c => c.classList.remove('revealed'));
    } else if (current === 15) {
      resetHoseGame();
    } else if (current === 18) {
      initStoryOrderActivity();
    } else if (current === 20) {
      initSentenceBuilder();
    }
  }

  // =========================================================================
  // BOOTSTRAP ALL MODULES
  // =========================================================================
  initNavigation();
  initMysteryObjects();
  initVocabDiscovery();
  initTprActions();
  initPrediction();
  initStoryScenes();
  initHoseSimulation();
  initEquipmentHunt();
  initFutureJobs();

  // Start on Slide 1
  goToSlide(1);
});
