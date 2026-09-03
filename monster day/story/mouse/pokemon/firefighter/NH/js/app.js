/**
 * Main Application Engine: State, Transitions, Interactions, Responsive Stage Scaling
 */

class AppController {
  constructor() {
    this.state = {
      currentScene: 'welcome',
      stars: 10,
      avatar: 'boy',
      neighbourhoodSize: 'big',
      livingChoice: 'house',
      // Find-It Game tracking on Street
      foundHouses: new Set(),
      foundCars: new Set(),
      foundTrees: new Set(),
      // Park Detective tracking
      parkFound: new Set(),
      // House interior tracking
      houseObjectsClicked: new Set(),
      // Build Town plots (6 slots)
      buildPlots: [
        { type: 'house', icon: '🏠', label: 'House' },
        { type: 'park', icon: '🌳', label: 'Park' },
        null,
        { type: 'school', icon: '🏫', label: 'School' },
        null,
        { type: 'shop', icon: '🛒', label: 'Shop' }
      ],
      selectedPaletteItem: 'house',
      // Speaking Builder selections (PDF Slide 19)
      speakingBuilder: {
        size: 'big',
        see: ['houses', 'cars'],
        places: ['a park', 'a school'],
        activity: 'to the park'
      },
      // Tour Stop Index
      tourIndex: 0,
      // Practice Matching state (Slide 13)
      matchingSelectedWord: null,
      matchedPairs: new Set(),
      // Active dialogue index (Slides 14-18)
      dialogueIndex: 0,
      // Comprehension activities state
      whatDidYouSeeSelected: new Set(),
      memoryIndex: 0,
      memoryFeedback: null,
      trueFalseIndex: 0,
      trueFalseFeedback: null,
      listenFindIndex: 0,
      listenFindFound: false,
      thereIsAreIndex: 0,
      thereIsAreAnswered: null,
      favPlaceSelected: 'park',
      favActivitySelected: 'walks',
      scaffoldActiveLevel: 1
    };

    this.init();
  }

  init() {
    // Setup responsive 16:9 stage scaling
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', () => this.resizeStage());
      window.addEventListener('orientationchange', () => this.resizeStage());
    }

    // Initial resize
    setTimeout(() => this.resizeStage(), 50);

    // Render Welcome scene initially
    this.renderScene('welcome');
  }

  resizeStage() {
    const stage = document.getElementById('app-stage');
    if (!stage) return;

    const baseWidth = 1200;
    const baseHeight = 675;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    stage.style.transform = `scale(${scale})`;
  }

  /**
   * Switches to the given scene and updates UI
   */
  renderScene(sceneName) {
    this.state.currentScene = sceneName;
    const stage = document.getElementById('app-stage');
    if (!stage) return;

    // Update HUD visibility
    const hud = document.getElementById('main-hud');
    if (hud) {
      hud.style.display = (sceneName === 'welcome') ? 'none' : 'flex';
      this.updateHudStars();
    }

    const contentArea = document.getElementById('scene-viewport');
    if (!contentArea) return;

    switch (sceneName) {
      case 'welcome':
        contentArea.innerHTML = this.renderWelcomeView();
        break;

      case 'map':
        contentArea.innerHTML = window.Scenes.renderMainMap(this.state);
        this.checkMapMissions();
        break;

      case 'house':
        contentArea.innerHTML = window.Scenes.renderHouseInterior();
        window.soundEngine.playDing();
        window.soundEngine.speak("Where do you live? I live in a house.");
        break;

      case 'park':
        contentArea.innerHTML = window.Scenes.renderParkScene();
        window.soundEngine.playDing();
        window.soundEngine.speak("There is a park. I like to go to the park.");
        this.updateParkChecklistView();
        break;

      case 'school':
        contentArea.innerHTML = window.Scenes.renderSchoolScene();
        window.soundEngine.playDing();
        window.soundEngine.speak("What is this? It is a school. There is a school.");
        break;

      case 'shop':
        contentArea.innerHTML = window.Scenes.renderShopScene();
        window.soundEngine.playDing();
        window.soundEngine.speak("What is this place? There is a shop.");
        break;

      case 'neighbours':
        contentArea.innerHTML = window.Scenes.renderNeighboursScene();
        window.soundEngine.playDing();
        window.soundEngine.speak("Who are your neighbours? My neighbours live next to me. They are a nice family.");
        break;

      case 'builder':
        contentArea.innerHTML = window.Scenes.renderBuildMap(this.state.buildPlots, this.state.selectedPaletteItem);
        this.updateBuildDescription();
        break;

      case 'matching':
        contentArea.innerHTML = this.renderMatchingView();
        break;

      case 'dialogues':
        contentArea.innerHTML = this.renderDialoguePracticeView();
        break;

      case 'speaking_builder':
        contentArea.innerHTML = this.renderSpeakingBuilderView();
        break;

      case 'speaking_mission':
        contentArea.innerHTML = this.renderSpeakingMissionView();
        break;

      case 'what_did_you_see':
        contentArea.innerHTML = window.Scenes.renderWhatDidYouSee(this.state);
        window.soundEngine.playPop();
        window.soundEngine.speak("What did you see in the neighbourhood? Tap what you saw!");
        break;

      case 'remember_game':
        contentArea.innerHTML = window.Scenes.renderRememberGame(this.state);
        window.soundEngine.playPop();
        window.soundEngine.speak(window.NEIGHBOURHOOD_DATA.memoryQuestions[this.state.memoryIndex].q);
        break;

      case 'true_false':
        contentArea.innerHTML = window.Scenes.renderTrueFalseGame(this.state);
        window.soundEngine.playPop();
        window.soundEngine.speak(window.NEIGHBOURHOOD_DATA.trueFalseStatements[this.state.trueFalseIndex].text);
        break;

      case 'listen_find':
        contentArea.innerHTML = window.Scenes.renderListenAndFind(this.state);
        window.soundEngine.playPop();
        window.soundEngine.speak(window.NEIGHBOURHOOD_DATA.listenAndFindPrompts[this.state.listenFindIndex].audio);
        break;

      case 'there_is_are':
        contentArea.innerHTML = window.Scenes.renderThereIsAre(this.state);
        window.soundEngine.playPop();
        break;

      case 'favorite_places':
        contentArea.innerHTML = window.Scenes.renderFavoritePlaces(this.state);
        window.soundEngine.playPop();
        window.soundEngine.speak("Where do you like to go in your neighbourhood?");
        break;

      case 'favorite_activities':
        contentArea.innerHTML = window.Scenes.renderFavoriteActivities(this.state);
        window.soundEngine.playPop();
        window.soundEngine.speak("What do you like to do in your neighbourhood?");
        break;

      case 'scaffold_levels':
        contentArea.innerHTML = window.Scenes.renderScaffoldLevels(this.state);
        window.soundEngine.playPop();
        break;

      case 'new_town':
        contentArea.innerHTML = window.Scenes.renderNewNeighbourhood(this.state);
        window.soundEngine.playSparkle();
        window.soundEngine.speak("Here is a brand new neighbourhood! Look at the pictures and describe it!");
        break;

      case 'reward':
        contentArea.innerHTML = this.renderRewardView();
        window.soundEngine.playFanfare();
        this.launchConfetti();
        break;

      default:
        this.renderScene('map');
        break;
    }

    // Scroll to top of stage in case
    stage.scrollTop = 0;
  }

  /* ================= NAVIGATION & HUDS ================= */

  startExploring() {
    window.soundEngine.playSparkle();
    this.addStars(5, "Welcome Explorer!");
    this.renderScene('map');
    window.soundEngine.speak("Welcome to our neighbourhood! Let's explore!");
  }

  exitToMap() {
    window.soundEngine.playPop();
    this.renderScene('map');
  }

  enterLocation(locId) {
    window.soundEngine.playSparkle();
    if (locId === 'home') {
      this.completeMission('house');
      this.renderScene('house');
    } else if (locId === 'park') {
      this.completeMission('park');
      this.renderScene('park');
    } else if (locId === 'school') {
      this.completeMission('school');
      this.renderScene('school');
    } else if (locId === 'shop') {
      this.completeMission('shop');
      this.renderScene('shop');
    } else if (locId === 'neighbours') {
      this.completeMission('neighbours');
      this.renderScene('neighbours');
    }
  }

  addStars(count, reason = "") {
    this.state.stars = Math.min(100, this.state.stars + count);
    this.updateHudStars();
    if (reason) {
      this.showToast(`⭐ +${count} Stars: ${reason}`);
    }
    window.soundEngine.playSparkle();
  }

  updateHudStars() {
    const starCountElem = document.getElementById('hud-star-count');
    if (starCountElem) {
      starCountElem.textContent = this.state.stars;
    }
  }

  completeMission(missionId) {
    const mission = window.NEIGHBOURHOOD_DATA.missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      mission.completed = true;
      this.addStars(mission.stars, mission.title);
    }
  }

  toggleNeighbourhoodSize(size) {
    this.state.neighbourhoodSize = size;
    const phrase = size === 'big' ? "My neighbourhood is big." : "My neighbourhood is small.";
    window.soundEngine.playPop();
    window.soundEngine.speak(phrase);
    this.showToast(`🏘️ Size: ${phrase}`);
    this.renderScene('map');
  }

  /* ================= TOASTS & ALERTS ================= */

  showToast(message) {
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  speakCurrent(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
      const text = elem.textContent.replace(/["•]/g, '').trim();
      window.soundEngine.speak(text);
    }
  }

  /* ================= MISSION 1: HOUSE & ROOMS ================= */

  setLivingChoice(type) {
    this.state.livingChoice = type;
    const text = type === 'house' ? "I live in a house." : "I live in a flat.";
    const bubble = document.getElementById('house-speech-text');
    if (bubble) bubble.textContent = text;
    window.soundEngine.playPop();
    window.soundEngine.speak(text);

    // Toggle active button
    document.querySelectorAll('.house-choice-bar .choice-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(type));
    });
  }

  handleObjectClick(objId, name, sentence) {
    this.state.houseObjectsClicked.add(objId);
    window.soundEngine.playPop();
    window.soundEngine.speak(sentence);

    const bubble = document.getElementById('house-speech-text');
    if (bubble) bubble.textContent = sentence;

    this.showToast(`✨ Discovered: ${name.toUpperCase()}!`);
    if (this.state.houseObjectsClicked.size >= 3) {
      this.completeMission('inside_house');
    }
  }

  /* ================= MISSION 2: WHAT CAN YOU SEE (FIND IT GAME) ================= */

  handleItemClick(type, id, label) {
    if (type === 'house') {
      if (!this.state.foundHouses.has(id)) {
        this.state.foundHouses.add(id);
        window.soundEngine.playSparkle();
        this.showToast(`🏠 Found a house! (${this.state.foundHouses.size}/3)`);
        window.soundEngine.speak("I can see a house.");
      }
    } else if (type === 'car') {
      if (!this.state.foundCars.has(id)) {
        this.state.foundCars.add(id);
        window.soundEngine.playCarHorn();
        this.showToast(`🚗 Found a car! (${this.state.foundCars.size}/2)`);
        window.soundEngine.speak("I can see a car.");
      }
    } else if (type === 'tree') {
      if (!this.state.foundTrees.has(id)) {
        this.state.foundTrees.add(id);
        window.soundEngine.playSparkle();
        this.showToast(`🌳 Found a tree! (${this.state.foundTrees.size}/4)`);
        window.soundEngine.speak("I can see a tree.");
      }
    }

    this.checkMapMissions();
  }

  checkMapMissions() {
    const banner = document.getElementById('street-mission-banner');
    if (!banner) return;

    const housesLeft = Math.max(0, 3 - this.state.foundHouses.size);
    const carsLeft = Math.max(0, 2 - this.state.foundCars.size);
    const treesLeft = Math.max(0, 4 - this.state.foundTrees.size);

    if (housesLeft === 0 && carsLeft === 0 && treesLeft === 0) {
      banner.innerHTML = `
        <div class="mission-complete-pill">
          🎉 <strong>Great job!</strong> "I can see cars, houses and trees."
          <button class="speak-mini-btn" onclick="window.soundEngine.speak('I can see cars, houses and trees.')">🔊</button>
        </div>
      `;
      this.completeMission('find_cars_houses_trees');
    } else {
      banner.innerHTML = `
        <div class="mission-todo-pill">
          🔍 <strong>Street Mission:</strong> Find 
          <span class="${housesLeft === 0 ? 'done' : ''}">🏠 Houses (${this.state.foundHouses.size}/3)</span> • 
          <span class="${carsLeft === 0 ? 'done' : ''}">🚗 Cars (${this.state.foundCars.size}/2)</span> • 
          <span class="${treesLeft === 0 ? 'done' : ''}">🌳 Trees (${this.state.foundTrees.size}/4)</span>
        </div>
      `;
    }
  }

  handleCarClick(carId) {
    window.soundEngine.playCarHorn();
    window.soundEngine.speak("Beep beep! I can see a red car driving on the road.");
    this.showToast("🚗 Beep beep! A car is driving!");
  }

  handleDogClick(dogId) {
    window.soundEngine.playDogBark();
    window.soundEngine.speak("Woof! There is a playful dog in the park.");
    this.showToast("🐕 Woof woof! The dog wags its tail!");
  }

  handleScooterClick() {
    window.soundEngine.playDing();
    window.soundEngine.speak("Zoom! A child is riding a scooter down the path.");
    this.showToast("🛴 Zoom! Riding a scooter!");
  }

  /* ================= MISSION 3: PARK DETECTIVE ================= */

  handleParkItem(itemId) {
    const item = window.NEIGHBOURHOOD_DATA.parkItems.find(p => p.id === itemId);
    if (!item) return;

    if (item.sound && window.soundEngine[item.sound]) {
      window.soundEngine[item.sound]();
    } else {
      window.soundEngine.playPop();
    }

    this.state.parkFound.add(itemId);
    window.soundEngine.speak(item.phrase);

    const bubble = document.getElementById('park-speech-text');
    if (bubble) bubble.textContent = item.phrase;

    this.updateParkChecklistView();

    // Check if detective checklist is complete (slide, bench, tree, dog)
    const required = ['slide', 'bench', 'tree', 'dog'];
    const allFound = required.every(id => this.state.parkFound.has(id));
    if (allFound) {
      this.completeMission('park');
      this.showToast("🎉 DETECTIVE SUCCESS! You found everything in the park!");
    }
  }

  updateParkChecklistView() {
    ['slide', 'bench', 'tree', 'dog'].forEach(id => {
      const el = document.getElementById(`check-${id}`);
      if (el) {
        el.classList.toggle('found', this.state.parkFound.has(id));
      }
    });
  }

  /* ================= MISSION 4: SCHOOL ================= */

  ringSchoolBell() {
    window.soundEngine.playSchoolBell();
    setTimeout(() => {
      window.soundEngine.speak("Ding-dong! The school bell is ringing! There is a school.");
    }, 600);
    this.showToast("🔔 Ding-dong! School bell rings!");
  }

  handleSchoolItem(type, label, phrase) {
    window.soundEngine.playDing();
    window.soundEngine.speak(phrase);
    const bubble = document.getElementById('school-speech-text');
    if (bubble) bubble.textContent = phrase;
    this.showToast(`🏫 ${label}: "${phrase}"`);
  }

  /* ================= MISSION 5: SHOP ================= */

  ringRegister() {
    window.soundEngine.playCashRegister();
    setTimeout(() => {
      window.soundEngine.speak("Cha-ching! There is a shop with tasty treats!");
    }, 500);
    this.showToast("💰 Cha-ching! Cash register opens!");
  }

  handleShopItem(type, label, phrase) {
    window.soundEngine.playPop();
    window.soundEngine.speak(phrase);
    const bubble = document.getElementById('shop-speech-text');
    if (bubble) bubble.textContent = phrase;
    this.showToast(`🛒 ${label.toUpperCase()}: "${phrase}"`);
  }

  /* ================= MISSION 6: NEIGHBOURS ================= */

  handleFamilyClick() {
    window.soundEngine.playSparkle();
    window.soundEngine.speak("Hello! We are your neighbours. We live next to you!");
    this.showToast("👨‍👩‍👧 Neighbours: 'Hello!'");
    this.enterLocation('neighbours');
  }

  handleNeighbourGreeting(member, phrase) {
    window.soundEngine.playSparkle();
    window.soundEngine.speak(phrase);
    const bubble = document.getElementById('neighbours-speech-text');
    if (bubble) bubble.textContent = phrase;
    this.showToast(`👋 ${member}: "${phrase}"`);
  }

  /* ================= TOWN BUILDER ================= */

  selectPaletteItem(type) {
    this.state.selectedPaletteItem = type;
    window.soundEngine.playPop();
    document.querySelectorAll('.palette-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${type}'`));
    });
  }

  handlePlotClick(index) {
    const type = this.state.selectedPaletteItem;
    const icons = { house: '🏠', park: '🌳', school: '🏫', shop: '🛒', tree: '🌲', car: '🚗' };
    const labels = { house: 'House', park: 'Park', school: 'School', shop: 'Shop', tree: 'Tree', car: 'Car' };

    this.state.buildPlots[index] = {
      type: type,
      icon: icons[type],
      label: labels[type]
    };

    window.soundEngine.playPop();
    this.renderScene('builder');
  }

  resetBuildGrid() {
    this.state.buildPlots = [null, null, null, null, null, null];
    window.soundEngine.playPop();
    this.renderScene('builder');
  }

  updateBuildDescription() {
    const placed = this.state.buildPlots.filter(Boolean);
    const bubble = document.getElementById('build-speech-text');
    if (!bubble) return;

    if (placed.length === 0) {
      bubble.textContent = "What is in your neighbourhood? Place items to describe your town!";
      return;
    }

    const houseCount = placed.filter(p => p.type === 'house').length;
    const hasPark = placed.some(p => p.type === 'park');
    const hasSchool = placed.some(p => p.type === 'school');
    const hasShop = placed.some(p => p.type === 'shop');

    let parts = [];
    if (houseCount > 1) parts.push("there are lots of houses");
    else if (houseCount === 1) parts.push("there is a house");

    if (hasPark) parts.push("a park");
    if (hasSchool) parts.push("a school");
    if (hasShop) parts.push("a shop");

    let sentence = "In my neighbourhood, " + (parts.length > 0 ? parts.join(', and ') : "there are pretty trees") + ".";
    bubble.textContent = sentence;
    window.soundEngine.speak(sentence);
  }

  /* ================= PRACTICE: MATCHING (PDF Slide 13) ================= */

  renderMatchingView() {
    return `
      <div class="scene-container scene-matching-view">
        <div class="interior-header">
          <div class="interior-title-pill matching-pill">
            <span class="icon">🧩</span>
            <div class="text-block">
              <h2>Practice: Match the Word to the Picture</h2>
              <p class="sub">Tap a word at the top, then tap its matching picture below!</p>
            </div>
          </div>
          <button class="action-next-btn" onclick="window.app.renderScene('dialogues')">
            Next: Conversations ➡️
          </button>
        </div>

        <div class="matching-game-stage">
          <!-- Words Row -->
          <div class="matching-words-row">
            ${window.NEIGHBOURHOOD_DATA.matchingPairs.map(p => `
              <button class="word-card ${this.state.matchingSelectedWord === p.id ? 'selected' : ''} ${this.state.matchedPairs.has(p.id) ? 'matched' : ''}" onclick="window.app.handleSelectWord('${p.id}')">
                ${p.word}
              </button>
            `).join('')}
          </div>

          <!-- Pictures Grid -->
          <div class="matching-pictures-grid">
            <!-- Park Picture -->
            <div class="picture-card ${this.state.matchedPairs.has('park') ? 'matched' : ''}" onclick="window.app.handleMatchTarget('park')">
              <div class="card-photo">🌳 🛝</div>
              <div class="card-caption">${this.state.matchedPairs.has('park') ? 'PARK ✅' : 'Park'}</div>
            </div>
            <!-- House Picture -->
            <div class="picture-card ${this.state.matchedPairs.has('house') ? 'matched' : ''}" onclick="window.app.handleMatchTarget('house')">
              <div class="card-photo">🏠 🏡</div>
              <div class="card-caption">${this.state.matchedPairs.has('house') ? 'HOUSE ✅' : 'House'}</div>
            </div>
            <!-- Shop Picture -->
            <div class="picture-card ${this.state.matchedPairs.has('shop') ? 'matched' : ''}" onclick="window.app.handleMatchTarget('shop')">
              <div class="card-photo">🛒 🥐</div>
              <div class="card-caption">${this.state.matchedPairs.has('shop') ? 'SHOP ✅' : 'Shop'}</div>
            </div>
            <!-- School Picture -->
            <div class="picture-card ${this.state.matchedPairs.has('school') ? 'matched' : ''}" onclick="window.app.handleMatchTarget('school')">
              <div class="card-photo">🏫 📚</div>
              <div class="card-caption">${this.state.matchedPairs.has('school') ? 'SCHOOL ✅' : 'School'}</div>
            </div>
          </div>
        </div>

        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="match-speech-bubble">
            <span class="bubble-icon">⭐</span>
            <span class="bubble-text" id="match-speech-text">
              ${this.state.matchedPairs.size === 4 ? "🎉 Excellent! You matched all four neighbourhood locations!" : "Select a word above, then click the correct picture!"}
            </span>
          </div>
          <button class="action-play-btn" onclick="window.app.revealMatchingAnswers()">
            👁️ Reveal Answers
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  }

  handleSelectWord(wordId) {
    if (this.state.matchedPairs.has(wordId)) return;
    this.state.matchingSelectedWord = wordId;
    window.soundEngine.playPop();
    window.soundEngine.speak(wordId);
    this.renderScene('matching');
  }

  handleMatchTarget(targetId) {
    if (!this.state.matchingSelectedWord) {
      window.soundEngine.speak("First tap a word at the top!");
      this.showToast("👆 First select a word!");
      return;
    }

    if (this.state.matchingSelectedWord === targetId) {
      this.state.matchedPairs.add(targetId);
      this.state.matchingSelectedWord = null;
      window.soundEngine.playDing();
      window.soundEngine.speak(`Correct! That is the ${targetId}.`);
      this.addStars(5, `Matched ${targetId}!`);
      this.renderScene('matching');
    } else {
      window.soundEngine.playPop();
      window.soundEngine.speak("Try again!");
      this.showToast("❌ Not quite! Try matching again.");
    }
  }

  revealMatchingAnswers() {
    ['house', 'park', 'school', 'shop'].forEach(id => this.state.matchedPairs.add(id));
    window.soundEngine.playSparkle();
    window.soundEngine.speak("Here are all the matched neighbourhood places: house, park, school, and shop!");
    this.renderScene('matching');
  }

  /* ================= PRACTICE: CONVERSATIONS (PDF Slides 14-18) ================= */

  renderDialoguePracticeView() {
    const d = window.NEIGHBOURHOOD_DATA.conversations[this.state.dialogueIndex];
    const total = window.NEIGHBOURHOOD_DATA.conversations.length;

    return `
      <div class="scene-container scene-dialogue-view">
        <div class="interior-header">
          <div class="interior-title-pill dialogue-pill">
            <span class="icon">💬</span>
            <div class="text-block">
              <h2>Practice the Conversation (${this.state.dialogueIndex + 1}/${total})</h2>
              <p class="sub">${d.context}</p>
            </div>
          </div>
          <div class="dialogue-nav-bar">
            <button class="nav-arrow-btn" ${this.state.dialogueIndex === 0 ? 'disabled' : ''} onclick="window.app.prevDialogue()">⬅️ Prev</button>
            <button class="nav-arrow-btn" ${this.state.dialogueIndex === total - 1 ? 'disabled' : ''} onclick="window.app.nextDialogue()">Next ➡️</button>
          </div>
        </div>

        <div class="dialogue-stage-board">
          <!-- Question Character -->
          <div class="dialogue-speaker-card question-side">
            <div class="speaker-bubble">
              <span class="bubble-tag">QUESTION</span>
              <p class="bubble-quote">"${d.question}"</p>
              <button class="audio-replay-btn" onclick="window.soundEngine.speak('${d.question}')">🔊 Listen</button>
            </div>
            <div class="speaker-avatar">🧑‍🎓</div>
            <div class="speaker-name">Friend</div>
          </div>

          <!-- Central Divider Arrow -->
          <div class="dialogue-arrow">➡️</div>

          <!-- Answer Character -->
          <div class="dialogue-speaker-card answer-side">
            <div class="speaker-bubble">
              <span class="bubble-tag">YOUR ANSWER</span>
              <p class="bubble-quote">"${d.answer}"</p>
              <button class="audio-replay-btn" onclick="window.soundEngine.speak('${d.answer}')">🔊 Listen</button>
            </div>
            <div class="speaker-avatar">👧🎒</div>
            <div class="speaker-name">You</div>
          </div>
        </div>

        <div class="sentence-action-footer">
          <button class="action-play-btn" onclick="window.app.playFullDialogue()">
            🎭 Play Both Characters
          </button>
          <button class="action-next-btn" onclick="window.app.renderScene('speaking_builder')">
            Sentence Builder ➡️
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  }

  nextDialogue() {
    if (this.state.dialogueIndex < window.NEIGHBOURHOOD_DATA.conversations.length - 1) {
      this.state.dialogueIndex++;
      window.soundEngine.playPop();
      this.renderScene('dialogues');
    }
  }

  prevDialogue() {
    if (this.state.dialogueIndex > 0) {
      this.state.dialogueIndex--;
      window.soundEngine.playPop();
      this.renderScene('dialogues');
    }
  }

  playFullDialogue() {
    const d = window.NEIGHBOURHOOD_DATA.conversations[this.state.dialogueIndex];
    window.soundEngine.speak(d.question, () => {
      setTimeout(() => {
        window.soundEngine.speak(d.answer);
      }, 700);
    });
  }

  /* ================= SPEAKING BUILDER (PDF Slide 19) ================= */

  renderSpeakingBuilderView() {
    const sb = this.state.speakingBuilder;
    return `
      <div class="scene-container scene-builder-view">
        <div class="interior-header">
          <div class="interior-title-pill speak-pill">
            <span class="icon">🗣️</span>
            <div class="text-block">
              <h2>Interactive Speaking Builder</h2>
              <p class="sub">Choose your words to build your complete neighbourhood speech!</p>
            </div>
          </div>
          <button class="action-next-btn" onclick="window.app.renderScene('tour')">
            Neighbourhood Tour ➡️
          </button>
        </div>

        <!-- 4 Step Option Selectors (Matching PDF Slide 19) -->
        <div class="speaking-builder-rows">
          <!-- Row 1: Big / Small -->
          <div class="builder-row">
            <span class="row-label">My neighbourhood is...</span>
            <div class="row-chips">
              <button class="builder-chip ${sb.size === 'big' ? 'active' : ''}" onclick="window.app.setBuilderSize('big')">
                🔵 big
              </button>
              <button class="builder-chip ${sb.size === 'small' ? 'active' : ''}" onclick="window.app.setBuilderSize('small')">
                🟢 small
              </button>
            </div>
          </div>

          <!-- Row 2: houses / trees / cars -->
          <div class="builder-row">
            <span class="row-label">In my neighbourhood, I can see...</span>
            <div class="row-chips">
              <button class="builder-chip ${sb.see.includes('houses') ? 'active' : ''}" onclick="window.app.toggleBuilderSee('houses')">
                🏠 houses
              </button>
              <button class="builder-chip ${sb.see.includes('trees') ? 'active' : ''}" onclick="window.app.toggleBuilderSee('trees')">
                🌳 trees
              </button>
              <button class="builder-chip ${sb.see.includes('cars') ? 'active' : ''}" onclick="window.app.toggleBuilderSee('cars')">
                🚗 cars
              </button>
            </div>
          </div>

          <!-- Row 3: shop / school / park -->
          <div class="builder-row">
            <span class="row-label">In my neighbourhood, there is a...</span>
            <div class="row-chips">
              <button class="builder-chip ${sb.places.includes('a shop') ? 'active' : ''}" onclick="window.app.toggleBuilderPlace('a shop')">
                🛒 shop
              </button>
              <button class="builder-chip ${sb.places.includes('a school') ? 'active' : ''}" onclick="window.app.toggleBuilderPlace('a school')">
                🏫 school
              </button>
              <button class="builder-chip ${sb.places.includes('a park') ? 'active' : ''}" onclick="window.app.toggleBuilderPlace('a park')">
                🌳 park
              </button>
            </div>
          </div>

          <!-- Row 4: to the park / on walks -->
          <div class="builder-row">
            <span class="row-label">In my neighbourhood, I like to go...</span>
            <div class="row-chips">
              <button class="builder-chip ${sb.activity === 'to the park' ? 'active' : ''}" onclick="window.app.setBuilderActivity('to the park')">
                🌳 to the park
              </button>
              <button class="builder-chip ${sb.activity === 'on walks' ? 'active' : ''}" onclick="window.app.setBuilderActivity('on walks')">
                🚶 on walks
              </button>
            </div>
          </div>
        </div>

        <!-- Generated Speech Output Box -->
        <div class="builder-speech-output">
          <div class="speech-quote-box" id="full-speech-output">
            ${this.computeCompleteSpeech()}
          </div>
        </div>

        <div class="sentence-action-footer">
          <button class="action-play-btn large" onclick="window.app.speakCompleteSpeech()">
            🔊 Hear My Full Speech
          </button>
          <button class="action-next-btn" onclick="window.app.renderScene('speaking_mission')">
            Speaking Mission 🎤
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  }

  setBuilderSize(val) {
    this.state.speakingBuilder.size = val;
    window.soundEngine.playPop();
    this.renderScene('speaking_builder');
  }

  toggleBuilderSee(val) {
    const list = this.state.speakingBuilder.see;
    const idx = list.indexOf(val);
    if (idx >= 0) {
      if (list.length > 1) list.splice(idx, 1);
    } else {
      list.push(val);
    }
    window.soundEngine.playPop();
    this.renderScene('speaking_builder');
  }

  toggleBuilderPlace(val) {
    const list = this.state.speakingBuilder.places;
    const idx = list.indexOf(val);
    if (idx >= 0) {
      if (list.length > 1) list.splice(idx, 1);
    } else {
      list.push(val);
    }
    window.soundEngine.playPop();
    this.renderScene('speaking_builder');
  }

  setBuilderActivity(val) {
    this.state.speakingBuilder.activity = val;
    window.soundEngine.playPop();
    this.renderScene('speaking_builder');
  }

  computeCompleteSpeech() {
    const sb = this.state.speakingBuilder;
    const s1 = `My neighbourhood is ${sb.size}.`;
    const s2 = `In my neighbourhood, I can see ${sb.see.join(' and ')}.`;
    const s3 = `In my neighbourhood, there is ${sb.places.join(' and ')}.`;
    const s4 = `In my neighbourhood, I like to go ${sb.activity}.`;
    return `${s1} ${s2} ${s3} ${s4}`;
  }

  speakCompleteSpeech() {
    const speech = this.computeCompleteSpeech();
    window.soundEngine.speak(speech);
    this.addStars(5, "Practiced speaking!");
  }

  /* ================= SPEAKING MISSION: PICTURE PROMPTS (PDF Slide 20) ================= */

  renderSpeakingMissionView() {
    return `
      <div class="scene-container scene-prompts-view">
        <div class="interior-header">
          <div class="interior-title-pill prompt-pill">
            <span class="icon">🎤</span>
            <div class="text-block">
              <h2>Speaking Mission: Talk About Your Neighbourhood!</h2>
              <p class="sub">Look at each picture card, tap to speak, and describe your neighbourhood!</p>
            </div>
          </div>
          <button class="action-next-btn" onclick="window.app.renderScene('tour')">
            Final Tour ➡️
          </button>
        </div>

        <div class="speaking-cards-grid">
          ${window.NEIGHBOURHOOD_DATA.speakingPrompts.map((p, idx) => `
            <div class="speaking-prompt-card clickable-item" onclick="window.soundEngine.speak('${p.hint}'); window.app.showToast('${p.hint}')">
              <div class="card-icon">${p.icon}</div>
              <div class="card-title">${p.title}</div>
              <div class="card-question">${p.text}</div>
              <div class="card-hint">🗣️ "${p.hint}"</div>
              <button class="card-sound-btn">🔊 Practice</button>
            </div>
          `).join('')}
        </div>

        <div class="sentence-action-footer">
          <button class="action-play-btn large" onclick="window.soundEngine.speak('Look at the pictures and talk about your neighbourhood!')">
            🔊 Listen to Instructions
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  }

  /* ================= FINAL NEIGHBOURHOOD TOUR ================= */

  renderTourView() {
    const stop = window.NEIGHBOURHOOD_DATA.tourStops[this.state.tourIndex];
    const totalStops = window.NEIGHBOURHOOD_DATA.tourStops.length;

    return `
      <div class="scene-container scene-tour-view">
        <div class="interior-header">
          <div class="interior-title-pill tour-pill">
            <span class="icon">🚶</span>
            <div class="text-block">
              <h2>Neighbourhood Walking Tour (${this.state.tourIndex + 1}/${totalStops})</h2>
              <p class="sub">You are the neighbourhood tour guide! Guide your classmates through town.</p>
            </div>
          </div>
          <div class="dialogue-nav-bar">
            <button class="nav-arrow-btn" ${this.state.tourIndex === 0 ? 'disabled' : ''} onclick="window.app.prevTourStop()">⬅️ Previous</button>
            <button class="nav-arrow-btn" onclick="window.app.nextTourStop()">
              ${this.state.tourIndex === totalStops - 1 ? 'Finish & Get Badge 🏅' : 'Next Stop ➡️'}
            </button>
          </div>
        </div>

        <div class="tour-stage-display">
          <div class="tour-guide-card">
            <div class="guide-avatar">🧒🎒</div>
            <div class="guide-info">
              <span class="badge-tag">${stop.name}</span>
              <h3 class="location-name">${stop.location}</h3>
            </div>
          </div>

          <div class="tour-speech-bubble">
            <div class="bubble-tag">TOUR GUIDE SAYS:</div>
            <p class="tour-sentence" id="tour-guide-text">"${stop.sentence}"</p>
            <button class="action-play-btn" onclick="window.app.playCurrentTourStop()">
              🔊 Speak Aloud
            </button>
          </div>
        </div>

        <div class="sentence-action-footer">
          <div class="tour-progress-bar">
            ${window.NEIGHBOURHOOD_DATA.tourStops.map((s, idx) => `
              <div class="tour-pip ${idx === this.state.tourIndex ? 'active' : ''} ${idx < this.state.tourIndex ? 'passed' : ''}"></div>
            `).join('')}
          </div>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  }

  nextTourStop() {
    const totalStops = window.NEIGHBOURHOOD_DATA.tourStops.length;
    if (this.state.tourIndex < totalStops - 1) {
      this.state.tourIndex++;
      window.soundEngine.playPop();
      this.renderScene('tour');
    } else {
      // Completed tour!
      this.addStars(20, "Completed the Walking Tour!");
      this.renderScene('reward');
    }
  }

  prevTourStop() {
    if (this.state.tourIndex > 0) {
      this.state.tourIndex--;
      window.soundEngine.playPop();
      this.renderScene('tour');
    }
  }

  playCurrentTourStop() {
    const stop = window.NEIGHBOURHOOD_DATA.tourStops[this.state.tourIndex];
    if (stop) {
      window.soundEngine.speak(stop.sentence);
    }
  }

  /* ================= REWARDS & CERTIFICATE ================= */

  renderRewardView() {
    return `
      <div class="scene-container scene-reward-view">
        <div class="reward-certificate-card">
          <div class="cert-ribbon">⭐ OFFICIAL CERTIFICATE ⭐</div>
          <h1 class="cert-title">NEIGHBOURHOOD EXPLORER</h1>
          <p class="cert-subtitle">Awarded for outstanding English speaking & neighbourhood exploration!</p>

          <div class="cert-badge-center">
            <div class="gold-medal-icon">🏅</div>
            <div class="medal-label">MASTER EXPLORER</div>
          </div>

          <div class="cert-stats-grid">
            <div class="stat-box">
              <span class="stat-number">5 / 5</span>
              <span class="stat-desc">Locations Explored</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">12 / 12</span>
              <span class="stat-desc">Objects Discovered</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">5 / 5</span>
              <span class="stat-desc">Speaking Targets</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">100 ⭐</span>
              <span class="stat-desc">Explorer Points</span>
            </div>
          </div>

          <div class="cert-actions">
            <button class="cert-btn primary" onclick="window.soundEngine.playFanfare(); window.app.launchConfetti()">
              🎉 Celebrate Again!
            </button>
            <button class="cert-btn secondary" onclick="window.app.renderScene('map')">
              🗺️ Return to Neighbourhood
            </button>
          </div>
        </div>
      </div>
    `;
  }

  launchConfetti() {
    const container = document.getElementById('scene-viewport');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-particle';
      conf.style.left = `${Math.random() * 95}%`;
      conf.style.backgroundColor = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'][Math.floor(Math.random() * 7)];
      conf.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      conf.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(conf);
      setTimeout(() => conf.remove(), 4000);
    }
  }

  /* ================= 1. WHAT DID YOU SEE? ================= */

  handleWhatDidYouSeeClick(id) {
    if (this.state.whatDidYouSeeSelected.has(id)) {
      this.state.whatDidYouSeeSelected.delete(id);
    } else {
      this.state.whatDidYouSeeSelected.add(id);
      window.soundEngine.playPop();
    }

    const bubble = document.getElementById('see-speech-text');
    if (this.state.whatDidYouSeeSelected.size >= 3) {
      window.soundEngine.playSparkle();
      const targetSentence = "I can see houses, trees and cars.";
      if (bubble) bubble.innerHTML = `Say together: <strong>"${targetSentence}"</strong>`;
      window.soundEngine.speak(targetSentence);
      this.addStars(5, "Discovered neighbourhood items!");
    } else {
      if (bubble) bubble.textContent = "Tap at least 3 things you saw!";
    }

    this.renderScene('what_did_you_see');
  }

  /* ================= 2. REMEMBER THE NEIGHBOURHOOD ================= */

  handleMemoryAnswer(userAnswer) {
    const q = window.NEIGHBOURHOOD_DATA.memoryQuestions[this.state.memoryIndex];
    const isCorrect = (userAnswer === q.answer);

    this.state.memoryFeedback = {
      isCorrect: isCorrect,
      text: isCorrect ? `Correct! ${q.feedback}` : `Not quite! ${q.feedback}`
    };

    if (isCorrect) {
      window.soundEngine.playDing();
      this.addStars(5, "Great memory!");
    } else {
      window.soundEngine.playPop();
    }

    window.soundEngine.speak(q.feedback);
    this.renderScene('remember_game');
  }

  nextMemoryQuestion() {
    this.state.memoryFeedback = null;
    if (this.state.memoryIndex < window.NEIGHBOURHOOD_DATA.memoryQuestions.length - 1) {
      this.state.memoryIndex++;
      window.soundEngine.playPop();
      this.renderScene('remember_game');
    } else {
      this.state.memoryIndex = 0;
      this.renderScene('true_false');
    }
  }

  /* ================= 3. TRUE OR FALSE ================= */

  handleTrueFalseAnswer(userAnswer) {
    const item = window.NEIGHBOURHOOD_DATA.trueFalseStatements[this.state.trueFalseIndex];
    const isCorrect = (userAnswer === item.isTrue);

    this.state.trueFalseFeedback = {
      isCorrect: isCorrect,
      target: item.target,
      message: isCorrect ? `Correct! ${item.prompt}` : `Try again! ${item.prompt}`
    };

    if (isCorrect) {
      window.soundEngine.playDing();
      this.addStars(5, "True/False Master!");
    } else {
      window.soundEngine.playPop();
    }

    window.soundEngine.speak(item.prompt);
    this.renderScene('true_false');
  }

  nextTrueFalse() {
    this.state.trueFalseFeedback = null;
    if (this.state.trueFalseIndex < window.NEIGHBOURHOOD_DATA.trueFalseStatements.length - 1) {
      this.state.trueFalseIndex++;
      window.soundEngine.playPop();
      this.renderScene('true_false');
    } else {
      this.state.trueFalseIndex = 0;
      this.renderScene('listen_find');
    }
  }

  /* ================= 4. LISTEN AND FIND ================= */

  nextListenFind() {
    this.state.listenFindFound = false;
    if (this.state.listenFindIndex < window.NEIGHBOURHOOD_DATA.listenAndFindPrompts.length - 1) {
      this.state.listenFindIndex++;
      window.soundEngine.playPop();
      this.renderScene('listen_find');
    } else {
      this.state.listenFindIndex = 0;
      this.renderScene('there_is_are');
    }
  }

  /* ================= 5. GRAMMAR: THERE IS / THERE ARE ================= */

  handleThereIsAreChoice(choice) {
    const q = window.NEIGHBOURHOOD_DATA.thereIsAreQuestions[this.state.thereIsAreIndex];
    const isCorrect = (choice === q.correct);

    this.state.thereIsAreAnswered = {
      choice: choice,
      isCorrect: isCorrect
    };

    if (isCorrect) {
      window.soundEngine.playDing();
      window.soundEngine.speak(q.complete);
      this.addStars(5, "Grammar Star!");
    } else {
      window.soundEngine.playPop();
      window.soundEngine.speak("Remember: IS is for 1 item, ARE is for more than 1!");
    }

    this.renderScene('there_is_are');
  }

  nextThereIsAre() {
    this.state.thereIsAreAnswered = null;
    if (this.state.thereIsAreIndex < window.NEIGHBOURHOOD_DATA.thereIsAreQuestions.length - 1) {
      this.state.thereIsAreIndex++;
      window.soundEngine.playPop();
      this.renderScene('there_is_are');
    } else {
      this.state.thereIsAreIndex = 0;
      this.renderScene('favorite_places');
    }
  }

  /* ================= 6. FAVORITE PLACES ================= */

  selectFavoritePlace(placeId) {
    this.state.favPlaceSelected = placeId;
    const place = window.NEIGHBOURHOOD_DATA.favoritePlaces.find(p => p.id === placeId);
    if (place) {
      window.soundEngine.playDing();
      window.soundEngine.speak(place.sentence);
      this.addStars(5, `Favorite place: ${place.label}`);
    }
    this.renderScene('favorite_places');
  }

  /* ================= 7. FAVORITE ACTIVITIES ================= */

  selectFavoriteActivity(actId) {
    this.state.favActivitySelected = actId;
    const act = window.NEIGHBOURHOOD_DATA.favoriteActivities.find(a => a.id === actId);
    if (act) {
      window.soundEngine.playDing();
      window.soundEngine.speak(act.sentence);
      this.addStars(5, `Activity: ${act.label}`);
    }
    this.renderScene('favorite_activities');
  }

  /* ================= 8. SCAFFOLDED SUPPORT LEVELS ================= */

  setScaffoldLevel(level) {
    this.state.scaffoldActiveLevel = level;
    window.soundEngine.playPop();
    this.renderScene('scaffold_levels');
  }

  speakScaffoldItem(idx) {
    const fullItems = window.NEIGHBOURHOOD_DATA.scaffoldLevels[0].items;
    if (fullItems[idx]) {
      window.soundEngine.playSparkle();
      window.soundEngine.speak(fullItems[idx].text);
      this.showToast(`🗣️ "${fullItems[idx].text}"`);
    }
  }

  /* ================= WELCOME VIEW ================= */

  renderWelcomeView() {
    return `
      <div class="scene-container scene-welcome-view">
        <div class="welcome-hero-card">
          <div class="hero-brand">
            <span class="badge">ESL Kids Speaking Adventure</span>
          </div>
          <h1 class="welcome-title">My Neighbourhood!</h1>
          <p class="welcome-subtitle">Welcome to our neighbourhood! Let's explore houses, schools, parks, shops, and meet our neighbours!</p>

          <div class="mission-brief-card">
            <h3>🗺️ YOUR EXPLORER MISSION</h3>
            <div class="mission-bullet-grid">
              <div class="bullet-item">🏠 Discover where we live</div>
              <div class="bullet-item">🌳 Play in the community park</div>
              <div class="bullet-item">🏫 Visit the school</div>
              <div class="bullet-item">🛒 Shop for fresh treats</div>
              <div class="bullet-item">👨‍👩‍👧 Say hello to neighbours</div>
              <div class="bullet-item">🎤 Become a tour guide!</div>
            </div>
          </div>

          <div class="welcome-cta-row">
            <button class="start-game-btn" onclick="window.app.startExploring()">
              🚀 START EXPLORING!
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

window.app = new AppController();
