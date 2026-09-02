/**
 * app.js - Full Interactive Storybook Engine for "The City Mouse & The Country Mouse"
 * Complete pedagogical logic, sound triggers, touch-friendly interactions, and teacher controls.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentSlide: 1,
    totalSlides: 15,
    soundMuted: false,
    speechEnabled: true,
    
    // Slide 2: Icebreaker
    icebreakerIndex: 0,
    icebreakerData: [
      { img: 'assets/images/icebreaker/neon_city.jpg', title: '1. Spectacular Neon City at Night 🏙️', type: 'city' },
      { img: 'assets/images/icebreaker/country_hills.jpg', title: '2. Magical Countryside with Green Hills 🌳', type: 'country' },
      { img: 'assets/images/icebreaker/city_amusement_park.jpg', title: '3. Giant Amusement Park in a City 🎡', type: 'city' },
      { img: 'assets/images/icebreaker/country_horse.jpg', title: '4. Beautiful Horse in a Country Field 🐎', type: 'country' },
      { img: 'assets/images/icebreaker/city_mall.jpg', title: '5. Huge Modern Shopping Mall 🛍️', type: 'city' },
      { img: 'assets/images/icebreaker/country_lake.jpg', title: '6. Peaceful Mountain Lake 🏔️', type: 'country' },
      { img: 'assets/images/icebreaker/city_street.jpg', title: '7. Busy City Street Full of Lights 🚦', type: 'city' },
      { img: 'assets/images/icebreaker/country_cottage.jpg', title: '8. Beautiful Countryside Cottage 🏡', type: 'country' },
      { img: 'assets/images/icebreaker/futuristic_city.jpg', title: '9. Futuristic City Skyline 🚀', type: 'city' },
      { img: 'assets/images/icebreaker/country_stars.jpg', title: '10. Countryside Night Sky Full of Stars ✨', type: 'country' }
    ],

    // Slide 6: Watch & Find
    foundTargets: new Set(),

    // Slide 7: Comprehension Quiz
    quizIndex: 0,
    quizQuestions: [
      {
        q: 'Where does the Country Mouse live?',
        opts: [
          { text: '🌳 COUNTRY', img: 'assets/images/country_home.jpg', correct: true },
          { text: '🏙️ CITY', img: 'assets/images/city_arrival.jpg', correct: false }
        ]
      },
      {
        q: 'Who visits the Country Mouse?',
        opts: [
          { text: '🐭 CITY MOUSE', img: 'assets/images/avatar_city_mouse.jpg', correct: true },
          { text: '🐱 CAT', img: 'assets/images/avatar_cat.jpg', correct: false }
        ]
      },
      {
        q: 'Where do the mice go?',
        opts: [
          { text: '🏙️ CITY', img: 'assets/images/city_arrival.jpg', correct: true },
          { text: '🏫 SCHOOL', img: 'assets/images/icebreaker/city_mall.jpg', correct: false }
        ]
      },
      {
        q: 'What do they find in the cellar?',
        opts: [
          { text: '🍰 LOTS OF DELICIOUS FOOD', img: 'assets/images/feast_table.jpg', correct: true },
          { text: '⚽ A FOOTBALL', img: 'assets/images/country_food.jpg', correct: false }
        ]
      },
      {
        q: 'Who suddenly appears?',
        opts: [
          { text: '🐱 THE CAT!', img: 'assets/images/cat_appears.jpg', correct: true },
          { text: '🐭 COUNTRY MOUSE', img: 'assets/images/avatar_country_mouse.jpg', correct: false }
        ]
      },
      {
        q: 'What do the mice do?',
        opts: [
          { text: '🏃 RUN AWAY!', img: 'assets/images/mice_running.jpg', correct: true },
          { text: '💤 GO TO SLEEP', img: 'assets/images/country_safe.jpg', correct: false }
        ]
      }
    ],

    // Slide 8: What Happens Next?
    predictRound: 0,
    predictRounds: [
      {
        currentImg: 'assets/images/country_home.jpg',
        caption: 'The Country Mouse lives in his cozy home.',
        q: 'Who visits him?',
        choices: [
          { text: '🐭 City Mouse visits!', icon: '🐭', correct: true },
          { text: '🐄 A big cow visits', icon: '🐄', correct: false },
          { text: '🐸 A green frog visits', icon: '🐸', correct: false }
        ],
        revealImg: 'assets/images/city_visits.jpg',
        revealCaption: 'Yes! City Mouse visits his friend in the country!'
      },
      {
        currentImg: 'assets/images/city_visits.jpg',
        caption: 'City Mouse says: "Come to the exciting city!"',
        q: 'What do they do next?',
        choices: [
          { text: '🏙️ They travel to the city!', icon: '🧳', correct: true },
          { text: '🏖️ They go swimming at the beach', icon: '🏖️', correct: false },
          { text: '🚀 They fly to the moon', icon: '🚀', correct: false }
        ],
        revealImg: 'assets/images/mice_traveling.jpg',
        revealCaption: 'Yes! They walk together on the road to the city!'
      },
      {
        currentImg: 'assets/images/city_arrival.jpg',
        caption: 'They arrive in the huge, bustling city!',
        q: 'Where do they go to find food?',
        choices: [
          { text: '🚪 Into the basement!', icon: '🚪', correct: true },
          { text: '🌳 Up a tall tree', icon: '🌳', correct: false },
          { text: '🚗 Inside a red car', icon: '🚗', correct: false }
        ],
        revealImg: 'assets/images/city_basement.jpg',
        revealCaption: 'Yes! They sneak through a hole in the wall into the basement!'
      },
      {
        currentImg: 'assets/images/city_basement.jpg',
        caption: 'They are inside the grand basement pantry.',
        q: 'What do they find on the table?',
        choices: [
          { text: '🍰 A giant feast of food!', icon: '🍰', correct: true },
          { text: '🪨 A pile of heavy stones', icon: '🪨', correct: false },
          { text: '🧦 Old smelly socks', icon: '🧦', correct: false }
        ],
        revealImg: 'assets/images/feast_table.jpg',
        revealCaption: 'Look! Cheese, cake, bread, and berries!'
      },
      {
        currentImg: 'assets/images/feast_table.jpg',
        caption: 'They are happily eating the delicious cheese...',
        q: 'Oh no! Who suddenly appears?',
        choices: [
          { text: '🐱 A curious cat!', icon: '🐱', correct: true },
          { text: '🐼 A gentle panda', icon: '🐼', correct: false },
          { text: '🐥 A tiny yellow chick', icon: '🐥', correct: false }
        ],
        revealImg: 'assets/images/cat_appears.jpg',
        revealCaption: 'WATCH OUT! The cat appears on the table!'
      },
      {
        currentImg: 'assets/images/cat_appears.jpg',
        caption: 'The cat looks straight at the mice!',
        q: 'What do the mice do now?',
        choices: [
          { text: '🏃 They RUN for the hole!', icon: '🏃', correct: true },
          { text: '💤 They take a nap', icon: '💤', correct: false },
          { text: '🎵 They sing a song', icon: '🎵', correct: false }
        ],
        revealImg: 'assets/images/mice_running.jpg',
        revealCaption: 'They RUN as fast as they can! Country Mouse goes home safe!'
      }
    ],

    // Slide 9: Sequence Game
    sequenceCards: [
      { id: 1, text: '1. Country Mouse lives in the country', img: 'assets/images/country_home.jpg' },
      { id: 2, text: '2. City Mouse visits', img: 'assets/images/city_visits.jpg' },
      { id: 3, text: '3. They travel to the city', img: 'assets/images/mice_traveling.jpg' },
      { id: 4, text: '4. They enter the basement', img: 'assets/images/city_basement.jpg' },
      { id: 5, text: '5. They find delicious food', img: 'assets/images/feast_table.jpg' },
      { id: 6, text: '6. A cat appears!', img: 'assets/images/cat_appears.jpg' },
      { id: 7, text: '7. The mice run away', img: 'assets/images/mice_running.jpg' },
      { id: 8, text: '8. Country Mouse is safe at home', img: 'assets/images/country_safe.jpg' }
    ],
    sequenceSlots: [null, null, null, null, null, null, null, null],

    // Slide 10: Retell
    retellIndex: 0,
    retellSteps: [
      {
        word: 'FIRST',
        title: 'Country Mouse & Visit',
        imgs: ['assets/images/country_home.jpg', 'assets/images/city_visits.jpg'],
        sentence: 'First, the Country Mouse lives in the country. The City Mouse visits.'
      },
      {
        word: 'THEN',
        title: 'Travel to City & Basement',
        imgs: ['assets/images/mice_traveling.jpg', 'assets/images/city_basement.jpg'],
        sentence: 'Then, they go to the big city and sneak into the basement.'
      },
      {
        word: 'NEXT',
        title: 'Delicious Food & Cat',
        imgs: ['assets/images/feast_table.jpg', 'assets/images/cat_appears.jpg'],
        sentence: 'Next, they find delicious food, but the cat appears!'
      },
      {
        word: 'FINALLY',
        title: 'Run & Safe Country Home',
        imgs: ['assets/images/mice_running.jpg', 'assets/images/country_safe.jpg'],
        sentence: 'Finally, the mice run away, and Country Mouse goes home safely.'
      }
    ],

    // Slide 11: Speaking Roleplay
    roleplayIndex: 0,
    roleplayDialogue: [
      { speaker: 'city', text: 'Hello!' },
      { speaker: 'country', text: 'Hello!' },
      { speaker: 'city', text: 'Come to the city!' },
      { speaker: 'country', text: 'Why?' },
      { speaker: 'city', text: 'There is delicious food!' },
      { speaker: 'country', text: 'Really?' },
      { speaker: 'city', text: 'Yes!' },
      { speaker: 'country', text: 'OK!' },
      { speaker: 'cat_alarm', text: '🐱 DANGER! THE CAT COMES!' },
      { speaker: 'city', text: 'RUN!' },
      { speaker: 'country', text: 'RUN!' },
      { speaker: 'country', text: 'I want to go home!' },
      { speaker: 'city', text: 'Why?' },
      { speaker: 'country', text: 'I want a safe life.' }
    ],

    // Slide 12: Comparison Sorting
    sortingItems: [
      { id: 't1', text: 'Delicious food 🍰', target: 'city' },
      { id: 't2', text: 'Simple food 🌾', target: 'country' },
      { id: 't3', text: 'Big 🏙️', target: 'city' },
      { id: 't4', text: 'Small 🏡', target: 'country' },
      { id: 't5', text: 'Noisy 🚗', target: 'city' },
      { id: 't6', text: 'Quiet 🤫', target: 'country' },
      { id: 't7', text: 'Exciting ⚡', target: 'city' },
      { id: 't8', text: 'Peaceful 🌿', target: 'country' },
      { id: 't9', text: 'Dangerous ⚠️', target: 'city' },
      { id: 't10', text: 'Safe 🛡️', target: 'country' }
    ],
    selectedChip: null,
    sortedCount: 0,

    // Slide 13: Thinking
    thinkMouse: 'Country Mouse',
    thinkAdj: 'safe',

    // Slide 14: Instagram
    catRevealed: false
  };

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const dom = {
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnSound: document.getElementById('btn-sound'),
    btnTeacherToggle: document.getElementById('btn-teacher-toggle'),
    teacherDrawer: document.getElementById('teacher-drawer'),
    btnDrawerClose: document.getElementById('btn-drawer-close'),
    teacherJumpList: document.getElementById('teacher-jump-list'),
    currentStageTag: document.getElementById('current-stage-tag'),
    progressDots: document.getElementById('progress-dots'),

    // Slide 1
    btnStart: document.getElementById('btn-start-adventure'),

    // Slide 2
    iceCurrentImg: document.getElementById('ice-current-img'),
    iceCaptionText: document.getElementById('ice-caption-text'),
    btnIceNext: document.getElementById('btn-ice-next'),
    whyPromptCard: document.getElementById('why-prompt-card'),

    // Slide 3
    cardCityMouse: document.getElementById('card-city-mouse'),
    cardCountryMouse: document.getElementById('card-country-mouse'),

    // Slide 4
    predFeedback: document.getElementById('pred-feedback-box'),

    // Slide 5
    btnVideoDone: document.getElementById('btn-video-done'),

    // Slide 6
    findCelebration: document.getElementById('find-all-celebration'),
    btnAfterFind: document.getElementById('btn-after-find'),

    // Slide 7
    quizNum: document.getElementById('quiz-num'),
    quizQText: document.getElementById('quiz-q-text'),
    btnQuizSpeak: document.getElementById('btn-quiz-speak'),
    quizOptionsContainer: document.getElementById('quiz-options-container'),
    quizFeedback: document.getElementById('quiz-feedback'),

    // Slide 8
    predictRoundTag: document.getElementById('predict-round-tag'),
    predictSceneImg: document.getElementById('predict-scene-img'),
    predictSceneCaption: document.getElementById('predict-scene-caption'),
    predictChoicesPanel: document.getElementById('predict-choices-panel'),

    // Slide 9
    seqSlotsRow: document.getElementById('seq-slots-row'),
    seqCardBank: document.getElementById('seq-card-bank'),
    btnSeqReset: document.getElementById('btn-seq-reset'),
    btnSeqCheck: document.getElementById('btn-seq-check'),

    // Slide 10
    retellStepperButtons: document.querySelectorAll('.step-marker-btn'),
    retellImagesRow: document.getElementById('retell-images-row'),
    retellSentenceText: document.getElementById('retell-sentence-text'),
    btnRetellSpeak: document.getElementById('btn-retell-speak'),

    // Slide 11
    rpCityBox: document.getElementById('rp-city-box'),
    rpCountryBox: document.getElementById('rp-country-box'),
    rpCitySpeech: document.getElementById('rp-city-speech'),
    rpCountrySpeech: document.getElementById('rp-country-speech'),
    rpCatAlarm: document.getElementById('roleplay-cat-alarm'),
    btnRpListen: document.getElementById('btn-rp-listen'),
    btnRpNext: document.getElementById('btn-rp-next'),
    btnRpReset: document.getElementById('btn-rp-reset'),

    // Slide 12
    traitChipsCarousel: document.getElementById('trait-chips-carousel'),
    basketCity: document.getElementById('basket-city'),
    basketCountry: document.getElementById('basket-country'),
    cityBasketContent: document.getElementById('city-basket-content'),
    countryBasketContent: document.getElementById('country-basket-content'),

    // Slide 13
    choiceMouseCards: document.querySelectorAll('.choice-mouse-card'),
    thinkSentencePreview: document.getElementById('think-sentence-preview'),
    adjButtons: document.querySelectorAll('.adj-btn'),
    btnThinkSpeak: document.getElementById('btn-think-speak'),

    // Slide 14
    instaImg: document.getElementById('insta-img'),
    btnRevealCat: document.getElementById('btn-reveal-cat'),

    // Slide 15
    liveChoiceButtons: document.querySelectorAll('.live-choice-btn'),
    certificateBox: document.getElementById('certificate-box'),
    btnReplayAll: document.getElementById('btn-replay-all')
  };

  // =========================================================================
  // SLIDE TITLES & PROGRESS INITIALIZATION
  // =========================================================================
  const slideTitles = [
    '1. Start Screen',
    '2. Physical Icebreaker (City or Country?)',
    '3. Meet the Characters',
    '4. Pre-Story Prediction',
    '5. Video Watch Mission',
    '6. Watch & Find Checklist',
    '7. Story Comprehension Quiz',
    '8. What Happens Next? Game',
    '9. Story Sequence Reorder',
    '10. Story Retell (First, Then, Next, Finally)',
    '11. Speaking: Be the Mouse Roleplay',
    '12. City vs Country Comparison',
    '13. Final Thinking Activity',
    '14. Instagram vs. Reality (Modern Moral)',
    '15. Personal Choice & Certificate'
  ];

  function initProgressDots() {
    dom.progressDots.innerHTML = '';
    for (let i = 1; i <= state.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot' + (i === state.currentSlide ? ' active' : '');
      dot.title = slideTitles[i - 1];
      dot.addEventListener('click', () => goToSlide(i));
      dom.progressDots.appendChild(dot);
    }
  }

  function initTeacherJumpList() {
    dom.teacherJumpList.innerHTML = '';
    slideTitles.forEach((title, idx) => {
      const item = document.createElement('div');
      item.className = 'jump-item';
      item.innerHTML = `<span>${title}</span><span>➔</span>`;
      item.addEventListener('click', () => {
        goToSlide(idx + 1);
        dom.teacherDrawer.classList.remove('open');
      });
      dom.teacherJumpList.appendChild(item);
    });
  }

  // =========================================================================
  // NAVIGATION CONTROLLER
  // =========================================================================
  function goToSlide(slideNum) {
    if (slideNum < 1 || slideNum > state.totalSlides) return;
    
    // Stop ongoing speech when switching slides
    window.soundEngine.stopSpeech();
    window.soundEngine.playPop();

    // Hide all slides
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));

    // Show active slide
    const nextSlideEl = document.getElementById(`slide-${slideNum}`);
    if (nextSlideEl) {
      nextSlideEl.classList.add('active');
    }

    state.currentSlide = slideNum;
    dom.currentStageTag.textContent = `${slideNum}/${state.totalSlides}: ${slideTitles[slideNum - 1].split('. ')[1] || ''}`;

    // Update progress dots
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active');
      if (idx + 1 === state.currentSlide) {
        dot.classList.add('active');
      } else if (idx + 1 < state.currentSlide) {
        dot.classList.add('completed');
      }
    });

    // Update back / next button visibility
    dom.btnPrev.style.visibility = (state.currentSlide === 1) ? 'hidden' : 'visible';
    dom.btnNext.style.visibility = (state.currentSlide === state.totalSlides) ? 'hidden' : 'visible';
  }

  dom.btnPrev.addEventListener('click', () => goToSlide(state.currentSlide - 1));
  dom.btnNext.addEventListener('click', () => goToSlide(state.currentSlide + 1));
  dom.btnStart.addEventListener('click', () => goToSlide(2));

  // Sound toggle button
  dom.btnSound.addEventListener('click', () => {
    const isMuted = window.soundEngine.toggleMute();
    dom.btnSound.textContent = isMuted ? '🔇' : '🔊';
  });

  // Teacher toggle & drawer
  dom.btnTeacherToggle.addEventListener('click', () => {
    dom.teacherDrawer.classList.toggle('open');
    window.soundEngine.playPop();
  });

  dom.btnDrawerClose.addEventListener('click', () => {
    dom.teacherDrawer.classList.remove('open');
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      goToSlide(state.currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      goToSlide(state.currentSlide - 1);
    } else if (e.key === 't' || e.key === 'T') {
      dom.teacherDrawer.classList.toggle('open');
    }
  });

  // Teacher Drawer Actions
  document.getElementById('btn-teacher-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => alert(err.message));
    } else {
      document.exitFullscreen();
    }
  });

  document.getElementById('btn-teacher-mute').addEventListener('click', () => {
    const isMuted = window.soundEngine.toggleMute();
    dom.btnSound.textContent = isMuted ? '🔇' : '🔊';
    alert(isMuted ? 'Sound Muted' : 'Sound Enabled');
  });

  document.getElementById('btn-teacher-speech').addEventListener('click', () => {
    window.soundEngine.speechEnabled = !window.soundEngine.speechEnabled;
    alert(window.soundEngine.speechEnabled ? 'Voice Narration ON' : 'Voice Narration OFF');
  });

  document.getElementById('btn-teacher-reveal').addEventListener('click', () => {
    revealCurrentSlideSolution();
  });

  document.getElementById('btn-teacher-reset').addEventListener('click', () => {
    resetCurrentSlideActivity();
  });

  // =========================================================================
  // SLIDE 2: PHYSICAL ICEBREAKER (CITY OR COUNTRY?)
  // =========================================================================
  function renderIcebreaker() {
    const item = state.icebreakerData[state.icebreakerIndex];
    dom.iceCurrentImg.style.opacity = 0;
    setTimeout(() => {
      dom.iceCurrentImg.src = item.img;
      dom.iceCaptionText.textContent = item.title;
      dom.iceCurrentImg.style.opacity = 1;
    }, 200);

    // Show WHY prompt every 3 rounds
    if (state.icebreakerIndex > 0 && state.icebreakerIndex % 3 === 0) {
      dom.whyPromptCard.classList.add('visible');
    } else {
      dom.whyPromptCard.classList.remove('visible');
    }
  }

  dom.btnIceNext.addEventListener('click', () => {
    window.soundEngine.playPop();
    state.icebreakerIndex = (state.icebreakerIndex + 1) % state.icebreakerData.length;
    renderIcebreaker();
  });

  // =========================================================================
  // SLIDE 3: MEET THE CHARACTERS
  // =========================================================================
  dom.cardCityMouse.addEventListener('click', () => {
    dom.cardCityMouse.classList.add('revealed');
    window.soundEngine.playSuccess();
    window.soundEngine.speak("I am City Mouse! I live in the big, exciting city!");
  });

  dom.cardCountryMouse.addEventListener('click', () => {
    dom.cardCountryMouse.classList.add('revealed');
    window.soundEngine.playSuccess();
    window.soundEngine.speak("I am Country Mouse! I live in the peaceful, green country!");
  });

  // =========================================================================
  // SLIDE 4: PRE-STORY PREDICTION
  // =========================================================================
  document.querySelectorAll('.pred-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      if (choice === 'A') {
        window.soundEngine.playSuccess();
        dom.predFeedback.textContent = "🌟 Great guess! The mice have a big adventure! Let's watch!";
        window.soundEngine.speak("Great guess! The mice have an adventure! Let's watch!");
      } else {
        window.soundEngine.playEncouragement();
        dom.predFeedback.textContent = "🤔 Fun idea! Let's watch the video and find out what really happens!";
        window.soundEngine.speak("Fun idea! Let's watch the video and find out!");
      }
      dom.predFeedback.style.display = 'block';
    });
  });

  // =========================================================================
  // SLIDE 5: VIDEO MISSION
  // =========================================================================
  dom.btnVideoDone.addEventListener('click', () => {
    goToSlide(6);
  });

  // =========================================================================
  // SLIDE 6: WATCH & FIND
  // =========================================================================
  document.querySelectorAll('.find-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemKey = card.dataset.find;
      if (!state.foundTargets.has(itemKey)) {
        state.foundTargets.add(itemKey);
        card.classList.add('checked');
        window.soundEngine.playSuccess();
        window.soundEngine.speak(itemKey);

        if (state.foundTargets.size === 5) {
          triggerConfetti();
          window.soundEngine.playFanfare();
          dom.findCelebration.style.display = 'block';
        }
      }
    });
  });

  dom.btnAfterFind.addEventListener('click', () => {
    goToSlide(7);
  });

  // =========================================================================
  // SLIDE 7: STORY COMPREHENSION QUIZ (6 Questions)
  // =========================================================================
  function renderQuizQuestion() {
    const qData = state.quizQuestions[state.quizIndex];
    dom.quizNum.textContent = `Question ${state.quizIndex + 1} of ${state.quizQuestions.length}`;
    dom.quizQText.textContent = qData.q;
    dom.quizFeedback.textContent = '';
    dom.quizOptionsContainer.innerHTML = '';

    qData.opts.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'quiz-opt-card';
      card.innerHTML = `
        <img src="${opt.img}" class="quiz-opt-img" alt="${opt.text}">
        <div class="quiz-opt-label">${opt.text}</div>
      `;
      card.addEventListener('click', () => handleQuizAnswer(opt.correct, card));
      dom.quizOptionsContainer.appendChild(card);
    });
  }

  function handleQuizAnswer(isCorrect, cardEl) {
    if (isCorrect) {
      cardEl.classList.add('correct');
      window.soundEngine.playSuccess();
      dom.quizFeedback.style.color = '#2e7d32';
      dom.quizFeedback.textContent = '🌟 Exactly! Great job!';
      window.soundEngine.speak("Great job! Exactly right!");

      setTimeout(() => {
        if (state.quizIndex < state.quizQuestions.length - 1) {
          state.quizIndex++;
          renderQuizQuestion();
        } else {
          dom.quizFeedback.textContent = '🎉 All 6 Questions Completed! Excellent!';
          triggerConfetti();
          window.soundEngine.playFanfare();
          setTimeout(() => goToSlide(8), 2000);
        }
      }, 1600);
    } else {
      cardEl.classList.add('wrong');
      window.soundEngine.playEncouragement();
      dom.quizFeedback.style.color = '#d32f2f';
      dom.quizFeedback.textContent = '🤔 Try again! Look carefully!';
      window.soundEngine.speak("Try again! Look carefully.");
      setTimeout(() => cardEl.classList.remove('wrong'), 1000);
    }
  }

  dom.btnQuizSpeak.addEventListener('click', () => {
    const qData = state.quizQuestions[state.quizIndex];
    window.soundEngine.speak(qData.q);
  });

  // =========================================================================
  // SLIDE 8: WHAT HAPPENS NEXT? (6 Rounds)
  // =========================================================================
  function renderPredictRound() {
    const round = state.predictRounds[state.predictRound];
    dom.predictRoundTag.textContent = `Round ${state.predictRound + 1} of ${state.predictRounds.length}`;
    dom.predictSceneImg.src = round.currentImg;
    dom.predictSceneCaption.textContent = round.caption;
    dom.predictChoicesPanel.innerHTML = '';

    const qHeader = document.createElement('div');
    qHeader.style.fontSize = '24px';
    qHeader.style.fontWeight = '900';
    qHeader.style.color = '#3e2723';
    qHeader.textContent = round.q;
    dom.predictChoicesPanel.appendChild(qHeader);

    round.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-box-btn';
      btn.innerHTML = `
        <div class="choice-icon">${ch.icon}</div>
        <div class="choice-text">${ch.text}</div>
      `;
      btn.addEventListener('click', () => handlePredictAnswer(ch.correct, round));
      dom.predictChoicesPanel.appendChild(btn);
    });
  }

  function handlePredictAnswer(isCorrect, round) {
    if (isCorrect) {
      window.soundEngine.playSuccess();
      dom.predictSceneImg.src = round.revealImg;
      dom.predictSceneCaption.textContent = round.revealCaption;
      dom.predictChoicesPanel.innerHTML = `
        <div style="background: #e8f5e9; border: 4px solid #4caf50; border-radius: 20px; padding: 24px; text-align: center;">
          <div style="font-size: 32px; font-weight: 900; color: #2e7d32;">🌟 YES! CORRECT!</div>
          <p style="font-size: 22px; font-weight: 700; color: #37474f; margin: 12px 0;">${round.revealCaption}</p>
          <button class="big-btn big-btn-orange" id="btn-next-predict-round" style="margin-top: 14px;">Next Round ➡️</button>
        </div>
      `;
      window.soundEngine.speak(round.revealCaption);

      // If cat round, play suspense meow!
      if (round.revealImg.includes('cat')) {
        window.soundEngine.playSuspense();
        setTimeout(() => window.soundEngine.playMeow(), 400);
      }

      document.getElementById('btn-next-predict-round').addEventListener('click', () => {
        if (state.predictRound < state.predictRounds.length - 1) {
          state.predictRound++;
          renderPredictRound();
        } else {
          triggerConfetti();
          window.soundEngine.playFanfare();
          goToSlide(9);
        }
      });
    } else {
      window.soundEngine.playEncouragement();
      window.soundEngine.speak("Hmm, not quite! Try another choice!");
    }
  }

  // =========================================================================
  // SLIDE 9: STORY SEQUENCE GAME (8 Cards)
  // =========================================================================
  function renderSequenceGame() {
    dom.seqSlotsRow.innerHTML = '';
    dom.seqCardBank.innerHTML = '';

    // Render 8 Slots
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'seq-slot' + (state.sequenceSlots[i] ? ' filled' : '');
      slot.dataset.slotIndex = i;
      slot.innerHTML = `<div class="slot-number">${i + 1}</div>`;

      if (state.sequenceSlots[i]) {
        const card = state.sequenceSlots[i];
        const cardEl = document.createElement('div');
        cardEl.className = 'seq-card';
        cardEl.innerHTML = `
          <img src="${card.img}" class="seq-card-img" alt="${card.text}">
          <div class="seq-card-desc">${card.text}</div>
        `;
        cardEl.addEventListener('click', () => returnCardToBank(i));
        slot.appendChild(cardEl);
      }
      dom.seqSlotsRow.appendChild(slot);
    }

    // Render available cards in bank
    const unplacedCards = state.sequenceCards.filter(c => !state.sequenceSlots.includes(c));
    // Shuffle unplaced cards on first load
    unplacedCards.forEach(card => {
      const item = document.createElement('div');
      item.className = 'bank-item';
      item.innerHTML = `
        <img src="${card.img}" class="bank-item-img" alt="${card.text}">
        <div class="bank-item-text">${card.text}</div>
      `;
      item.addEventListener('click', () => placeCardInNextSlot(card));
      dom.seqCardBank.appendChild(item);
    });
  }

  function placeCardInNextSlot(card) {
    const emptyIndex = state.sequenceSlots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      state.sequenceSlots[emptyIndex] = card;
      window.soundEngine.playPop();
      renderSequenceGame();
    } else {
      alert('All slots are filled! Check your order or click a card to remove it.');
    }
  }

  function returnCardToBank(slotIndex) {
    state.sequenceSlots[slotIndex] = null;
    window.soundEngine.playPop();
    renderSequenceGame();
  }

  dom.btnSeqReset.addEventListener('click', () => {
    state.sequenceSlots = [null, null, null, null, null, null, null, null];
    window.soundEngine.playPop();
    renderSequenceGame();
  });

  dom.btnSeqCheck.addEventListener('click', () => {
    if (state.sequenceSlots.some(s => s === null)) {
      alert('Please place all 8 pictures before checking!');
      window.soundEngine.playEncouragement();
      return;
    }

    const isCorrect = state.sequenceSlots.every((card, idx) => card.id === idx + 1);
    if (isCorrect) {
      triggerConfetti();
      window.soundEngine.playFanfare();
      window.soundEngine.speak("Superb! You sequenced the whole story in perfect order!");
      alert('🌟 PERFECT ORDER! Outstanding job!');
    } else {
      window.soundEngine.playEncouragement();
      window.soundEngine.speak("Almost there! Look closely at the numbers and switch the cards!");
      alert('🤔 Not quite in order yet! Look closely and swap the cards.');
    }
  });

  // =========================================================================
  // SLIDE 10: STORY RETELL (FIRST / THEN / NEXT / FINALLY)
  // =========================================================================
  function renderRetellStep(stepIdx) {
    state.retellIndex = stepIdx;
    const step = state.retellSteps[stepIdx];

    dom.retellStepperButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === stepIdx);
    });

    dom.retellImagesRow.innerHTML = '';
    step.imgs.forEach(src => {
      const box = document.createElement('div');
      box.className = 'retell-scene-box';
      box.innerHTML = `<img src="${src}" alt="Scene">`;
      box.addEventListener('click', () => window.soundEngine.speak(step.sentence));
      dom.retellImagesRow.appendChild(box);
    });

    dom.retellSentenceText.textContent = `"${step.sentence}"`;
  }

  dom.retellStepperButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundEngine.playPop();
      renderRetellStep(parseInt(btn.dataset.step));
    });
  });

  dom.btnRetellSpeak.addEventListener('click', () => {
    const step = state.retellSteps[state.retellIndex];
    window.soundEngine.speak(step.sentence);
  });

  // =========================================================================
  // SLIDE 11: SPEAKING ROLEPLAY
  // =========================================================================
  function renderRoleplay() {
    const line = state.roleplayDialogue[state.roleplayIndex];

    dom.rpCityBox.classList.remove('turn-active');
    dom.rpCountryBox.classList.remove('turn-active');
    dom.rpCatAlarm.style.display = 'none';

    if (line.speaker === 'city') {
      dom.rpCityBox.classList.add('turn-active');
      dom.rpCitySpeech.textContent = `"${line.text}"`;
    } else if (line.speaker === 'country') {
      dom.rpCountryBox.classList.add('turn-active');
      dom.rpCountrySpeech.textContent = `"${line.text}"`;
    } else if (line.speaker === 'cat_alarm') {
      dom.rpCatAlarm.style.display = 'block';
      window.soundEngine.playSuspense();
      setTimeout(() => window.soundEngine.playMeow(), 300);
    }
  }

  dom.btnRpNext.addEventListener('click', () => {
    window.soundEngine.playPop();
    state.roleplayIndex = (state.roleplayIndex + 1) % state.roleplayDialogue.length;
    renderRoleplay();
    const currentLine = state.roleplayDialogue[state.roleplayIndex];
    window.soundEngine.speak(currentLine.text);
  });

  dom.btnRpListen.addEventListener('click', () => {
    const currentLine = state.roleplayDialogue[state.roleplayIndex];
    window.soundEngine.speak(currentLine.text);
  });

  dom.btnRpReset.addEventListener('click', () => {
    state.roleplayIndex = 0;
    renderRoleplay();
  });

  // =========================================================================
  // SLIDE 12: CITY VS COUNTRY SORTING
  // =========================================================================
  function initSortingArena() {
    dom.traitChipsCarousel.innerHTML = '';
    dom.cityBasketContent.innerHTML = '';
    dom.countryBasketContent.innerHTML = '';
    state.sortedCount = 0;

    state.sortingItems.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'trait-chip';
      chip.id = item.id;
      chip.textContent = item.text;
      chip.addEventListener('click', () => selectTraitChip(item, chip));
      dom.traitChipsCarousel.appendChild(chip);
    });
  }

  function selectTraitChip(item, chipEl) {
    document.querySelectorAll('.trait-chip').forEach(c => c.classList.remove('selected'));
    state.selectedChip = { data: item, el: chipEl };
    chipEl.classList.add('selected');
    window.soundEngine.playPop();
    window.soundEngine.speak(item.text);
  }

  function sortIntoBasket(basketType) {
    if (!state.selectedChip) {
      alert('Tap a word chip first!');
      return;
    }
    const item = state.selectedChip.data;
    const el = state.selectedChip.el;

    if (item.target === basketType) {
      window.soundEngine.playSuccess();
      el.classList.remove('selected');
      if (basketType === 'city') {
        dom.cityBasketContent.appendChild(el);
      } else {
        dom.countryBasketContent.appendChild(el);
      }
      state.sortedCount++;
      state.selectedChip = null;

      if (state.sortedCount === state.sortingItems.length) {
        triggerConfetti();
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Wonderful! You sorted all the words into City and Country!");
      }
    } else {
      window.soundEngine.playEncouragement();
      window.soundEngine.speak("Think carefully! Does that belong to the city or the country?");
    }
  }

  dom.basketCity.addEventListener('click', () => sortIntoBasket('city'));
  dom.basketCountry.addEventListener('click', () => sortIntoBasket('country'));

  // =========================================================================
  // SLIDE 13: FINAL THINKING ACTIVITY (Sentence Builder)
  // =========================================================================
  function updateThinkingSentence() {
    dom.thinkSentencePreview.innerHTML = `
      "I choose the <span style="color: #ff9800; font-weight: 900;">${state.thinkMouse}</span> because it is <span style="color: #00796b; font-weight: 900;">${state.thinkAdj}</span>."
    `;
  }

  dom.choiceMouseCards.forEach(card => {
    card.addEventListener('click', () => {
      dom.choiceMouseCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.thinkMouse = card.dataset.mouse;
      window.soundEngine.playPop();
      updateThinkingSentence();
    });
  });

  dom.adjButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.adjButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.thinkAdj = btn.dataset.adj;
      window.soundEngine.playPop();
      updateThinkingSentence();
    });
  });

  dom.btnThinkSpeak.addEventListener('click', () => {
    const sentence = `I choose the ${state.thinkMouse} because it is ${state.thinkAdj}.`;
    window.soundEngine.speak(sentence);
  });

  // =========================================================================
  // SLIDE 14: INSTAGRAM VS REALITY
  // =========================================================================
  dom.btnRevealCat.addEventListener('click', () => {
    state.catRevealed = !state.catRevealed;
    if (state.catRevealed) {
      dom.instaImg.src = 'assets/images/cat_appears.jpg';
      dom.btnRevealCat.textContent = '🍰 Show Food Again';
      window.soundEngine.playSuspense();
      setTimeout(() => window.soundEngine.playMeow(), 400);
      window.soundEngine.speak("Look behind the food! The cat is there! Danger!");
    } else {
      dom.instaImg.src = 'assets/images/feast_table.jpg';
      dom.btnRevealCat.textContent = '🐱 Reveal the Truth!';
      window.soundEngine.playPop();
    }
  });

  // =========================================================================
  // SLIDE 15: PERSONAL CHOICE & CERTIFICATE
  // =========================================================================
  dom.liveChoiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.liveChoiceButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const choice = btn.dataset.choice;

      triggerConfetti();
      window.soundEngine.playFanfare();
      dom.certificateBox.style.display = 'block';

      const speechText = choice === 'city'
        ? "I choose the city because it is exciting and fun!"
        : "I choose the country because it is peaceful and safe!";
      window.soundEngine.speak(speechText);
    });
  });

  dom.btnReplayAll.addEventListener('click', () => {
    goToSlide(1);
  });

  // =========================================================================
  // TEACHER DASHBOARD HELPERS
  // =========================================================================
  function revealCurrentSlideSolution() {
    window.soundEngine.playSuccess();
    switch (state.currentSlide) {
      case 3:
        dom.cardCityMouse.classList.add('revealed');
        dom.cardCountryMouse.classList.add('revealed');
        break;
      case 6:
        document.querySelectorAll('.find-card').forEach(c => c.classList.add('checked'));
        dom.findCelebration.style.display = 'block';
        triggerConfetti();
        break;
      case 7:
        const qData = state.quizQuestions[state.quizIndex];
        const correctOpt = qData.opts.find(o => o.correct);
        alert(`Solution: ${correctOpt.text}`);
        break;
      case 9:
        state.sequenceSlots = [...state.sequenceCards];
        renderSequenceGame();
        triggerConfetti();
        break;
      case 12:
        state.sortingItems.forEach(item => {
          const chip = document.getElementById(item.id);
          if (chip) {
            if (item.target === 'city') dom.cityBasketContent.appendChild(chip);
            else dom.countryBasketContent.appendChild(chip);
          }
        });
        triggerConfetti();
        break;
      case 14:
        dom.btnRevealCat.click();
        break;
      default:
        alert('No hidden puzzle on this slide.');
    }
  }

  function resetCurrentSlideActivity() {
    window.soundEngine.playPop();
    switch (state.currentSlide) {
      case 6:
        state.foundTargets.clear();
        document.querySelectorAll('.find-card').forEach(c => c.classList.remove('checked'));
        dom.findCelebration.style.display = 'none';
        break;
      case 7:
        state.quizIndex = 0;
        renderQuizQuestion();
        break;
      case 8:
        state.predictRound = 0;
        renderPredictRound();
        break;
      case 9:
        state.sequenceSlots = [null, null, null, null, null, null, null, null];
        renderSequenceGame();
        break;
      case 11:
        state.roleplayIndex = 0;
        renderRoleplay();
        break;
      case 12:
        initSortingArena();
        break;
      default:
        console.log('Slide reset');
    }
  }

  // =========================================================================
  // CONFETTI CELEBRATION ENGINE
  // =========================================================================
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.7) * 22,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frames = 0;
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;
      let alive = false;

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        if (frames > 40) p.opacity -= 0.02;

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive && frames < 120) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animateConfetti);
  }

  // =========================================================================
  // APP INITIALIZATION
  // =========================================================================
  initProgressDots();
  initTeacherJumpList();
  renderIcebreaker();
  renderQuizQuestion();
  renderPredictRound();
  renderSequenceGame();
  renderRetellStep(0);
  renderRoleplay();
  initSortingArena();
  updateThinkingSentence();
  goToSlide(1);

});
