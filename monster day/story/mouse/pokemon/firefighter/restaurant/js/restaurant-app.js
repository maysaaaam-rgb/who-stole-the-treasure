/**
 * Restaurant Lesson Controller: 10-Stage Progression, Smartboard Auto-Scaling, Secret Order System
 */

class RestaurantAppController {
  constructor() {
    this.state = {
      currentStage: 1,
      difficulty: 'normal', // 'easy', 'normal', 'challenge'
      selectedMenuItem: window.RESTAURANT_DATA.menu[0],
      learnItem: 'pizza',
      orderFood: null,
      orderDrink: null,
      listenRoundIndex: 0,
      listenSelectedFood: null,
      listenSelectedDrink: null,
      listenFeedback: null,
      roleplayTurnIndex: 0,
      currentSecretOrder: window.RESTAURANT_DATA.secretOrders[0],
      secretOrderRevealed: false,
      secretServedFood: null,
      secretServedDrink: null,
      switchedRoles: false,
      stars: 10
    };

    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', () => this.resizeStage());
      window.addEventListener('orientationchange', () => this.resizeStage());
    }

    setTimeout(() => this.resizeStage(), 50);
    this.renderStage(1);
  }

  resizeStage() {
    const stage = document.getElementById('restaurant-stage');
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

  renderStage(stageNum) {
    this.state.currentStage = stageNum;
    const viewport = document.getElementById('restaurant-viewport');
    if (!viewport) return;

    // Update Stage Indicator in HUD
    const indicator = document.getElementById('hud-stage-name');
    if (indicator) {
      if (stageNum === 'award') {
        indicator.textContent = '🏆 10. Award Ceremony';
      } else {
        const stageInfo = window.RESTAURANT_DATA.stages.find(s => s.num === stageNum);
        indicator.textContent = stageInfo ? `${stageInfo.icon} ${stageInfo.title}` : `Stage ${stageNum}`;
      }
    }

    switch (stageNum) {
      case 1:
        viewport.innerHTML = window.RestaurantScenes.renderEnterRestaurant(this.state);
        window.restaurantSound.playDoorChime();
        break;
      case 2:
        viewport.innerHTML = window.RestaurantScenes.renderMenuBoard(this.state);
        window.restaurantSound.playPop();
        break;
      case 3:
        viewport.innerHTML = window.RestaurantScenes.renderLearnIdLike(this.state);
        window.restaurantSound.playPop();
        break;
      case 4:
        viewport.innerHTML = window.RestaurantScenes.renderOrderingPractice(this.state);
        window.restaurantSound.playPop();
        break;
      case 5:
        viewport.innerHTML = window.RestaurantScenes.renderListenRemember(this.state);
        window.restaurantSound.playPop();
        break;
      case 6:
        viewport.innerHTML = window.RestaurantScenes.renderLearnRoles(this.state);
        window.restaurantSound.playPop();
        break;
      case 7:
        viewport.innerHTML = window.RestaurantScenes.renderFirstRoleplay(this.state);
        window.restaurantSound.playPop();
        break;
      case 8:
        viewport.innerHTML = window.RestaurantScenes.renderSecretOrderChallenge(this.state);
        window.restaurantSound.playPop();
        break;
      case 9:
        viewport.innerHTML = window.RestaurantScenes.renderSwitchRoles(this.state);
        window.restaurantSound.playSparkle();
        break;
      case 10:
        viewport.innerHTML = window.RestaurantScenes.renderFinalRoleplay(this.state);
        window.restaurantSound.playPop();
        break;
      case 'award':
        viewport.innerHTML = window.RestaurantScenes.renderRestaurantStarAward(this.state);
        window.restaurantSound.playFanfare();
        this.launchConfetti();
        break;
      default:
        this.renderStage(1);
        break;
    }

    const stage = document.getElementById('restaurant-stage');
    if (stage) stage.scrollTop = 0;
  }

  nextStage() {
    if (typeof this.state.currentStage === 'number') {
      if (this.state.currentStage < 10) {
        this.renderStage(this.state.currentStage + 1);
      } else {
        this.renderStage('award');
      }
    } else {
      this.renderStage(1);
    }
  }

  prevStage() {
    if (typeof this.state.currentStage === 'number' && this.state.currentStage > 1) {
      this.renderStage(this.state.currentStage - 1);
    } else {
      this.renderStage(1);
    }
  }

  addStars(count, reason = "") {
    this.state.stars += count;
    const countElem = document.getElementById('hud-rest-stars');
    if (countElem) countElem.textContent = this.state.stars;
    this.showToast(`⭐ +${count} Stars: ${reason}`);
    window.restaurantSound.playSparkle();
  }

  showToast(message) {
    const toast = document.getElementById('rest-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ================= STAGE 1: LIVING RESTAURANT CLICKS ================= */

  handleDoorClick() {
    window.restaurantSound.playDoorChime();
    window.restaurantSound.speak("Welcome to our restaurant! Please come in and take a seat!");
    this.showToast("🔔 Ding-dong! Door opens!");
  }

  handleKitchenClick() {
    window.restaurantSound.playOrderDing();
    window.restaurantSound.speak("Order up! Hot and fresh from the kitchen!");
    this.showToast("🍳 Sizzle! Food is cooking!");
  }

  handleWindowClick() {
    window.restaurantSound.playPop();
    window.restaurantSound.speak("It is a lovely sunny day outside the restaurant!");
  }

  handleMenuBoardClick() {
    window.restaurantSound.playPop();
    this.renderStage(2);
  }

  handleCustomerClick() {
    window.restaurantSound.playPop();
    window.restaurantSound.speak("Hello! I am hungry! I would like some pizza, please.");
  }

  handleWaiterClick() {
    window.restaurantSound.playPlateClink();
    window.restaurantSound.speak("Good day! What would you like to eat today?");
    this.showToast("🧑‍🍳 Waiter: 'What would you like?'");
  }

  /* ================= STAGE 2: EXPLORE MENU ================= */

  selectMenuItem(itemId) {
    const item = window.RESTAURANT_DATA.menu.find(m => m.id === itemId);
    if (!item) return;
    this.state.selectedMenuItem = item;

    if (item.category === 'food') {
      window.restaurantSound.playPlateClink();
    } else {
      window.restaurantSound.playPourDrink();
    }

    window.restaurantSound.speak(item.audio);
    this.renderStage(2);
  }

  /* ================= STAGE 3: LEARN I'D LIKE ================= */

  setLearnItem(itemId) {
    this.state.learnItem = itemId;
    const item = window.RESTAURANT_DATA.menu.find(m => m.id === itemId);
    window.restaurantSound.playPop();
    if (item) window.restaurantSound.speak(`I would like some ${item.name.toLowerCase()}, please.`);
    this.renderStage(3);
  }

  /* ================= STAGE 4: ORDERING PRACTICE ================= */

  selectOrderFood(foodId) {
    this.state.orderFood = foodId;
    const f = window.RESTAURANT_DATA.menu.find(m => m.id === foodId);
    window.restaurantSound.playPlateClink();
    if (f) window.restaurantSound.speak(`I would like some ${f.name.toLowerCase()}, please.`);
    this.renderStage(4);
  }

  selectOrderDrink(drinkId) {
    this.state.orderDrink = drinkId;
    const d = window.RESTAURANT_DATA.menu.find(m => m.id === drinkId);
    window.restaurantSound.playPourDrink();
    if (d) window.restaurantSound.speak(`I would like some ${d.name.toLowerCase()}, please.`);
    this.renderStage(4);
  }

  speakFullOrder() {
    const f = window.RESTAURANT_DATA.menu.find(m => m.id === this.state.orderFood);
    const d = window.RESTAURANT_DATA.menu.find(m => m.id === this.state.orderDrink);

    if (f && d) {
      const sentence = `I would like some ${f.name.toLowerCase()} and some ${d.name.toLowerCase()}, please.`;
      window.restaurantSound.speak(sentence, () => {
        setTimeout(() => {
          window.restaurantSound.playPlateClink();
          window.restaurantSound.speak("Here you are! Enjoy your meal!");
        }, 600);
      });
      this.addStars(10, "Practiced complete order aloud!");
    } else {
      window.restaurantSound.speak("Please pick one food and one drink first!");
      this.showToast("👆 Pick a food and a drink!");
    }
  }

  /* ================= STAGE 5: LISTEN & REMEMBER ================= */

  selectListenFood(foodId) {
    this.state.listenSelectedFood = foodId;
    window.restaurantSound.playPop();
    this.renderStage(5);
  }

  selectListenDrink(drinkId) {
    this.state.listenSelectedDrink = drinkId;
    window.restaurantSound.playPop();
    this.renderStage(5);
  }

  checkListenOrder() {
    const round = window.RESTAURANT_DATA.listeningRounds[this.state.listenRoundIndex];
    if (!this.state.listenSelectedFood || !this.state.listenSelectedDrink) {
      this.showToast("👆 Select both food and drink first!");
      return;
    }

    const isCorrect = (this.state.listenSelectedFood === round.correctFood && this.state.listenSelectedDrink === round.correctDrink);
    this.state.listenFeedback = { isCorrect: isCorrect };

    if (isCorrect) {
      window.restaurantSound.playSparkle();
      window.restaurantSound.speak(`Correct! The customer ordered ${round.correctFood} and ${round.correctDrink}.`);
      this.addStars(10, "Great listening!");
    } else {
      window.restaurantSound.playPop();
      window.restaurantSound.speak("Not quite! Listen again and try!");
    }

    this.renderStage(5);
  }

  nextListenRound() {
    this.state.listenSelectedFood = null;
    this.state.listenSelectedDrink = null;
    this.state.listenFeedback = null;

    if (this.state.listenRoundIndex < window.RESTAURANT_DATA.listeningRounds.length - 1) {
      this.state.listenRoundIndex++;
      this.renderStage(5);
    } else {
      this.state.listenRoundIndex = 0;
      this.renderStage(6);
    }
  }

  /* ================= STAGE 7: FIRST ROLE-PLAY ================= */

  nextRoleplayTurn() {
    const total = window.RESTAURANT_DATA.dialogueTurns.length;
    if (this.state.roleplayTurnIndex < total - 1) {
      this.state.roleplayTurnIndex++;
      window.restaurantSound.playPop();
      this.renderStage(7);
      const cur = window.RESTAURANT_DATA.dialogueTurns[this.state.roleplayTurnIndex];
      window.restaurantSound.speak(cur.text);
    } else {
      this.state.roleplayTurnIndex = 0;
      this.renderStage(8);
    }
  }

  prevRoleplayTurn() {
    if (this.state.roleplayTurnIndex > 0) {
      this.state.roleplayTurnIndex--;
      window.restaurantSound.playPop();
      this.renderStage(7);
    }
  }

  /* ================= STAGE 8: SECRET ORDER CHALLENGE ================= */

  toggleSecretReveal() {
    this.state.secretOrderRevealed = !this.state.secretOrderRevealed;
    window.restaurantSound.playPop();
    this.renderStage(8);
  }

  generateRandomOrder() {
    const orders = window.RESTAURANT_DATA.secretOrders;
    const randomIdx = Math.floor(Math.random() * orders.length);
    this.state.currentSecretOrder = orders[randomIdx];
    this.state.secretOrderRevealed = false;
    this.state.secretServedFood = null;
    this.state.secretServedDrink = null;

    window.restaurantSound.playOrderDing();
    this.showToast("🎲 New Secret Order Generated!");
    this.renderStage(8);
  }

  serveDish(itemId, category) {
    if (category === 'food') {
      this.state.secretServedFood = itemId;
      window.restaurantSound.playPlateClink();
    } else {
      this.state.secretServedDrink = itemId;
      window.restaurantSound.playPourDrink();
    }

    // Check if served matches secret order
    const order = this.state.currentSecretOrder;
    if (this.state.secretServedFood === order.food && this.state.secretServedDrink === order.drink) {
      window.restaurantSound.playSparkle();
      this.addStars(15, "Waiter served the exact secret order!");
      window.restaurantSound.speak("Here you are! Perfect service!");
    }

    this.renderStage(8);
  }

  /* ================= STAGE 9: SWITCH ROLES ================= */

  startSwitchedRoleplay() {
    this.state.switchedRoles = true;
    this.generateRandomOrder();
    this.renderStage(8);
    window.restaurantSound.speak("Roles switched! Customer has a new secret order! Waiter, get ready to serve!");
  }

  /* ================= CONFETTI & CELEBRATION ================= */

  launchConfetti() {
    const container = document.getElementById('restaurant-viewport');
    if (!container || !document.createElement) return;

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

  /* ================= TEACHER CONTROLS ================= */

  setDifficulty(level) {
    this.state.difficulty = level;
    window.restaurantSound.playPop();
    this.showToast(`🎯 Difficulty set to: ${level.toUpperCase()}`);
    this.renderStage(this.state.currentStage);
  }

  revealSecretAnswer() {
    this.state.secretOrderRevealed = true;
    this.renderStage(8);
    this.showToast("👁️ Secret order revealed by teacher!");
  }
}

window.restaurantApp = new RestaurantAppController();
