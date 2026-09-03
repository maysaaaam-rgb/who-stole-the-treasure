/**
 * Restaurant Scene Renderer: High-Quality SVG Visuals for Restaurant World, Menu, and Role-Play
 */

const RestaurantScenes = {
  /**
   * 1. ENTER THE RESTAURANT: Living SVG Restaurant World
   */
  renderEnterRestaurant(state) {
    return `
      <div class="rest-scene-container scene-restaurant-world">
        <div class="rest-header">
          <div class="rest-title-pill">
            <span class="icon">🍽️</span>
            <div class="text-block">
              <h2>Welcome to The Sunny Bistro!</h2>
              <p class="sub">Tap objects to explore the restaurant, meet the waiter, and hear the sounds!</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Explore Menu 📋 ➔
          </button>
        </div>

        <!-- Living Restaurant SVG Stage -->
        <div class="restaurant-stage-viewport">
          <svg class="restaurant-svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fff8e7" />
                <stop offset="100%" stop-color="#ffe0b2" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#d7ccc8" />
                <stop offset="100%" stop-color="#a1887f" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.18)" />
              </filter>
            </defs>

            <!-- Back Wall -->
            <rect x="0" y="0" width="1200" height="380" fill="url(#wallGrad)" />
            
            <!-- Floor Pattern (Warm tiles) -->
            <rect x="0" y="380" width="1200" height="220" fill="url(#floorGrad)" />
            <line x1="0" y1="380" x2="1200" y2="380" stroke="#8d6e63" stroke-width="4" />
            
            <!-- Window with sunshine & blue sky -->
            <g transform="translate(100, 60)" class="rest-clickable" onclick="window.restaurantApp.handleWindowClick()">
              <rect x="0" y="0" width="160" height="180" rx="10" fill="#81d4fa" stroke="#5d4037" stroke-width="6" />
              <line x1="80" y1="0" x2="80" y2="180" stroke="#5d4037" stroke-width="4" />
              <line x1="0" y1="90" x2="160" y2="90" stroke="#5d4037" stroke-width="4" />
              <circle cx="40" cy="40" r="22" fill="#ffe082" />
            </g>

            <!-- Restaurant Entrance Door with Chime -->
            <g transform="translate(320, 50)" class="rest-clickable" onclick="window.restaurantApp.handleDoorClick()">
              <rect x="0" y="0" width="150" height="330" rx="8" fill="#a1887f" stroke="#4e342e" stroke-width="6" />
              <rect x="20" y="20" width="110" height="150" rx="6" fill="#b3e5fc" stroke="#4e342e" stroke-width="3" />
              <circle cx="125" cy="190" r="8" fill="#fbc02d" />
              <!-- Door Sign -->
              <rect x="35" y="60" width="80" height="32" rx="4" fill="#ffffff" stroke="#c2185b" stroke-width="2" />
              <text x="75" y="82" text-anchor="middle" font-size="14" font-weight="900" fill="#c2185b">OPEN 🔔</text>
            </g>

            <!-- Kitchen Serving Pass (Hatch) with Steaming Pots -->
            <g transform="translate(540, 70)" class="rest-clickable" onclick="window.restaurantApp.handleKitchenClick()">
              <rect x="0" y="0" width="340" height="230" rx="8" fill="#37474f" stroke="#263238" stroke-width="6" />
              <!-- Kitchen Window opening -->
              <rect x="20" y="20" width="300" height="170" rx="6" fill="#fff9c4" />
              <text x="170" y="45" text-anchor="middle" font-size="16" font-weight="900" fill="#d84315">🍳 KITCHEN PASS</text>
              <!-- Chef in Kitchen -->
              <g transform="translate(80, 70)">
                <ellipse cx="30" cy="50" rx="20" ry="25" fill="#ffffff" stroke="#333" stroke-width="2" />
                <circle cx="30" cy="30" r="16" fill="#ffcc80" />
                <!-- Chef Hat -->
                <path d="M 12 20 Q 12 0 30 0 Q 48 0 48 20 Z" fill="#ffffff" stroke="#333" stroke-width="2" />
              </g>
              <!-- Steaming Pots & Soup -->
              <g transform="translate(190, 110)">
                <rect x="0" y="15" width="55" height="35" rx="4" fill="#78909c" />
                <ellipse cx="27" cy="15" rx="27" ry="8" fill="#ff7043" />
                <!-- Steam Paths with CSS animation -->
                <path class="steam-line" d="M 18 10 Q 12 0 18 -12" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" />
                <path class="steam-line delay" d="M 36 10 Q 42 0 36 -12" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" />
              </g>
              <!-- Order Counter Bell -->
              <circle cx="285" cy="175" r="14" fill="#fbc02d" stroke="#f57f17" stroke-width="2" />
              <rect x="282" y="160" width="6" height="6" fill="#e65100" />
            </g>

            <!-- Decorative Hanging Plants & Lamp -->
            <g transform="translate(940, 20)">
              <line x1="80" y1="0" x2="80" y2="70" stroke="#5d4037" stroke-width="3" />
              <polygon points="40,70 120,70 100,105 60,105" fill="#fbc02d" opacity="0.9" />
              <circle cx="80" cy="115" r="16" fill="#fff9c4" opacity="0.6" />
            </g>

            <!-- Chalkboard Menu on Easel -->
            <g transform="translate(920, 150)" class="rest-clickable" onclick="window.restaurantApp.handleMenuBoardClick()">
              <!-- Easel Legs -->
              <line x1="40" y1="0" x2="10" y2="210" stroke="#5d4037" stroke-width="6" />
              <line x1="160" y1="0" x2="190" y2="210" stroke="#5d4037" stroke-width="6" />
              <line x1="100" y1="0" x2="100" y2="220" stroke="#4e342e" stroke-width="5" />
              <!-- Blackboard -->
              <rect x="20" y="20" width="160" height="150" rx="6" fill="#2e4a3d" stroke="#8d6e63" stroke-width="6" filter="url(#shadow)" />
              <text x="100" y="48" text-anchor="middle" font-size="14" font-weight="900" fill="#ffe082">📋 MENU</text>
              <text x="100" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">🍕 Pizza</text>
              <text x="100" y="98" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">🍲 Soup</text>
              <text x="100" y="121" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">🥞 Pancakes</text>
              <text x="100" y="144" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">💧 Drinks</text>
            </g>

            <!-- Table 1 (Left) with Checkered Tablecloth -->
            <g transform="translate(80, 390)">
              <!-- Table top -->
              <ellipse cx="140" cy="50" rx="120" ry="38" fill="#e53935" stroke="#b71c1c" stroke-width="3" filter="url(#shadow)" />
              <ellipse cx="140" cy="46" rx="112" ry="32" fill="#ffffff" />
              <!-- Red checkered lines -->
              <path d="M 40 46 Q 140 15 240 46" stroke="#e53935" stroke-width="4" fill="none" opacity="0.4" />
              <!-- Table Stand -->
              <rect x="130" y="70" width="20" height="90" fill="#424242" />
              <ellipse cx="140" cy="160" rx="60" ry="14" fill="#212121" />
              <!-- Customer sitting at table -->
              <g class="rest-clickable" onclick="window.restaurantApp.handleCustomerClick()">
                <circle cx="80" cy="-10" r="22" fill="#ffcc80" />
                <path d="M 60 -10 Q 80 -30 100 -10 Z" fill="#6d4c41" />
                <rect x="62" y="12" width="36" height="40" rx="6" fill="#00bcd4" />
              </g>
              <!-- Dishes on Table: Pizza Slice + Water Cup -->
              <g transform="translate(130, 20)">
                <circle cx="15" cy="15" r="18" fill="#ffffff" stroke="#ccc" stroke-width="2" />
                <text x="15" y="22" text-anchor="middle" font-size="18">🍕</text>
                <text x="50" y="24" text-anchor="middle" font-size="16">💧</text>
              </g>
            </g>

            <!-- Center Floor: Friendly Waiter Carrying Tray -->
            <g transform="translate(560, 280)" class="rest-clickable waiter-figure" onclick="window.restaurantApp.handleWaiterClick()">
              <!-- Body -->
              <rect x="35" y="90" width="45" height="75" rx="8" fill="#212121" />
              <!-- White Apron -->
              <rect x="42" y="100" width="30" height="60" fill="#ffffff" stroke="#ccc" stroke-width="1" />
              <line x1="57" y1="90" x2="57" y2="100" stroke="#f44336" stroke-width="6" /> <!-- Bowtie -->
              <!-- Legs -->
              <rect x="40" y="165" width="15" height="70" fill="#212121" />
              <rect x="60" y="165" width="15" height="70" fill="#212121" />
              <ellipse cx="45" cy="235" rx="12" ry="7" fill="#000" />
              <ellipse cx="70" cy="235" rx="12" ry="7" fill="#000" />
              <!-- Head -->
              <circle cx="58" cy="65" r="24" fill="#ffcc80" />
              <path d="M 38 60 Q 58 40 78 60 Z" fill="#5d4037" /> <!-- Hair -->
              <circle cx="52" cy="65" r="2.5" fill="#333" />
              <circle cx="64" cy="65" r="2.5" fill="#333" />
              <path d="M 52 75 Q 58 80 64 75" stroke="#333" stroke-width="2" fill="none" /> <!-- Smile -->
              <!-- Tray held high with Cloche -->
              <g transform="translate(68, 70)">
                <ellipse cx="30" cy="25" rx="38" ry="8" fill="#cfd8dc" stroke="#90a4ae" stroke-width="2" />
                <path d="M 10 25 Q 30 0 50 25 Z" fill="#b0bec5" stroke="#78909c" stroke-width="2" />
                <circle cx="30" cy="2" r="4" fill="#78909c" />
              </g>
              <!-- Speech Indicator Bubble -->
              <g transform="translate(10, 0)">
                <rect x="0" y="0" width="150" height="34" rx="17" fill="#ffffff" stroke="#ff7043" stroke-width="2" filter="url(#shadow)" />
                <text x="75" y="22" text-anchor="middle" font-size="13" font-weight="900" fill="#e64a19">🧑‍🍳 "Hello! Welcome!"</text>
              </g>
            </g>

            <!-- Table 2 (Right) with Soup & Milkshake -->
            <g transform="translate(900, 390)">
              <ellipse cx="120" cy="50" rx="110" ry="36" fill="#e53935" stroke="#b71c1c" stroke-width="3" filter="url(#shadow)" />
              <ellipse cx="120" cy="46" rx="102" ry="30" fill="#ffffff" />
              <rect x="110" y="70" width="20" height="90" fill="#424242" />
              <ellipse cx="120" cy="160" rx="55" ry="14" fill="#212121" />
              <!-- Food on Table 2 -->
              <g transform="translate(85, 20)">
                <text x="25" y="24" text-anchor="middle" font-size="20">🍲</text>
                <text x="65" y="24" text-anchor="middle" font-size="18">🥛</text>
              </g>
            </g>
          </svg>
        </div>

        <div class="rest-action-footer">
          <div class="rest-speech-bubble" id="enter-speech-bubble">
            <span class="bubble-icon">🧑‍🍳</span>
            <span class="bubble-text">"Hello! Welcome to our restaurant. What would you like?"</span>
          </div>
          <button class="rest-action-btn" onclick="window.restaurantSound.speak('Hello! Welcome to our restaurant. What would you like?')">
            🔊 Speak Greeting
          </button>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Explore the Menu ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 2. EXPLORE THE MENU: 9 Large Food & Drink Cards
   */
  renderMenuBoard(state) {
    const foodItems = window.RESTAURANT_DATA.menu.filter(m => m.category === 'food');
    const drinkItems = window.RESTAURANT_DATA.menu.filter(m => m.category === 'drink');
    const activeItem = state.selectedMenuItem || foodItems[0];

    return `
      <div class="rest-scene-container scene-menu-view">
        <div class="rest-header">
          <div class="rest-title-pill menu-pill">
            <span class="icon">📋</span>
            <div class="text-block">
              <h2>Explore Our Restaurant Menu</h2>
              <p class="sub">Tap any food or drink to enlarge it, hear its pronunciation, and learn the words!</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Learn "I'd Like..." ➔
          </button>
        </div>

        <!-- Menu Layout: Left (Food), Center (Active Showcase), Right (Drinks) -->
        <div class="menu-board-stage">
          <!-- Food Column (6 items) -->
          <div class="menu-column food-column">
            <h3 class="col-title">🍕 FOOD</h3>
            <div class="menu-cards-grid">
              ${foodItems.map(item => `
                <div class="menu-item-card ${activeItem.id === item.id ? 'active' : ''}" onclick="window.restaurantApp.selectMenuItem('${item.id}')">
                  <span class="item-emoji">${item.icon}</span>
                  <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Active Item Showcase Card -->
          <div class="menu-showcase-box">
            <div class="showcase-card">
              <span class="showcase-icon">${activeItem.icon}</span>
              <h2 class="showcase-title">${activeItem.name.toUpperCase()}</h2>
              <p class="showcase-desc">${activeItem.description}</p>
              <div class="showcase-phrase-tag">
                🗣️ "${activeItem.audio}"
              </div>
              <button class="showcase-listen-btn" onclick="window.restaurantSound.speak('${activeItem.audio}')">
                🔊 Listen & Repeat
              </button>
            </div>
          </div>

          <!-- Drinks Column (3 items) -->
          <div class="menu-column drink-column">
            <h3 class="col-title">🥤 DRINKS</h3>
            <div class="menu-cards-grid drinks-grid">
              ${drinkItems.map(item => `
                <div class="menu-item-card ${activeItem.id === item.id ? 'active' : ''}" onclick="window.restaurantApp.selectMenuItem('${item.id}')">
                  <span class="item-emoji">${item.icon}</span>
                  <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="rest-action-footer">
          <div class="rest-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">"I'd like some <strong>${activeItem.name.toLowerCase()}</strong>, please."</span>
          </div>
          <button class="rest-action-btn" onclick="window.restaurantSound.speak('I would like some ${activeItem.name.toLowerCase()}, please.')">
            🔊 Say Sentence
          </button>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Learn "I'd Like..." ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 3. LEARN "I'D LIKE..." (Sentence Builder)
   */
  renderLearnIdLike(state) {
    const selectedItem = state.learnItem || 'pizza';
    const item = window.RESTAURANT_DATA.menu.find(m => m.id === selectedItem) || window.RESTAURANT_DATA.menu[0];

    return `
      <div class="rest-scene-container scene-learn-view">
        <div class="rest-header">
          <div class="rest-title-pill learn-pill">
            <span class="icon">🗣️</span>
            <div class="text-block">
              <h2>Learn to Order: "I'd like..."</h2>
              <p class="sub">How to be polite when ordering food and drinks in English!</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Ordering Practice 🎮 ➔
          </button>
        </div>

        <div class="learn-formula-stage">
          <!-- Question from Waiter -->
          <div class="waiter-question-card">
            <div class="speaker-pill">🧑‍🍳 WAITER ASKS:</div>
            <h2 class="question-text">"What would you like?"</h2>
            <button class="mini-audio-btn" onclick="window.restaurantSound.speak('What would you like?')">🔊 Listen</button>
          </div>

          <!-- Formula Blocks -->
          <div class="formula-blocks-row">
            <div class="formula-block blue">
              <span class="block-label">Polite Wish</span>
              <span class="block-text">I'd like</span>
            </div>
            <span class="plus-sign">+</span>
            <div class="formula-block purple">
              <span class="block-label">Quantity</span>
              <span class="block-text">some</span>
            </div>
            <span class="plus-sign">+</span>
            <div class="formula-block orange">
              <span class="block-label">Food / Drink</span>
              <span class="block-text">${item.icon} ${item.name}</span>
            </div>
            <span class="plus-sign">+</span>
            <div class="formula-block green">
              <span class="block-label">Polite Word</span>
              <span class="block-text">please.</span>
            </div>
          </div>

          <!-- Food/Drink Picker Chips -->
          <div class="learn-chips-selector">
            <span class="chips-label">Try another item:</span>
            <div class="chips-scroll">
              ${window.RESTAURANT_DATA.menu.map(m => `
                <button class="learn-chip ${m.id === item.id ? 'active' : ''}" onclick="window.restaurantApp.setLearnItem('${m.id}')">
                  ${m.icon} ${m.name}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="rest-action-footer">
          <div class="rest-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">"I'd like some <strong>${item.name.toLowerCase()}</strong>, please."</span>
          </div>
          <button class="rest-action-btn large primary" onclick="window.restaurantSound.speak('I would like some ${item.name.toLowerCase()}, please.')">
            🔊 Practice Saying It!
          </button>
          <button class="rest-action-btn" onclick="window.restaurantApp.nextStage()">
            Next Stage ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 4. ORDERING PRACTICE: Customer Orders Food & Drink with SAY IT!
   */
  renderOrderingPractice(state) {
    const foodItems = window.RESTAURANT_DATA.menu.filter(m => m.category === 'food');
    const drinkItems = window.RESTAURANT_DATA.menu.filter(m => m.category === 'drink');
    const selectedFood = state.orderFood ? window.RESTAURANT_DATA.menu.find(m => m.id === state.orderFood) : null;
    const selectedDrink = state.orderDrink ? window.RESTAURANT_DATA.menu.find(m => m.id === state.orderDrink) : null;

    return `
      <div class="rest-scene-container scene-order-view">
        <div class="rest-header">
          <div class="rest-title-pill order-pill">
            <span class="icon">🎮</span>
            <div class="text-block">
              <h2>Ordering Practice (Say It Aloud!)</h2>
              <p class="sub">1. Choose a food. 2. Choose a drink. 3. Say your complete order!</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Listen & Remember ➔
          </button>
        </div>

        <div class="order-practice-stage">
          <!-- Step 1: Choose Food -->
          <div class="order-step-section">
            <div class="step-header">
              <span class="step-tag">STEP 1</span>
              <h3 class="step-title">🧑‍🍳 "What would you like?"</h3>
            </div>
            <div class="order-options-grid">
              ${foodItems.map(f => `
                <button class="order-btn ${selectedFood && selectedFood.id === f.id ? 'active' : ''}" onclick="window.restaurantApp.selectOrderFood('${f.id}')">
                  <span class="btn-emoji">${f.icon}</span>
                  <span class="btn-name">${f.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Step 2: Choose Drink -->
          <div class="order-step-section">
            <div class="step-header">
              <span class="step-tag">STEP 2</span>
              <h3 class="step-title">🧑‍🍳 "Anything to drink?"</h3>
            </div>
            <div class="order-options-grid drinks-row">
              ${drinkItems.map(d => `
                <button class="order-btn ${selectedDrink && selectedDrink.id === d.id ? 'active' : ''}" onclick="window.restaurantApp.selectOrderDrink('${d.id}')">
                  <span class="btn-emoji">${d.icon}</span>
                  <span class="btn-name">${d.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Customer Order Tray Result -->
          <div class="customer-tray-box">
            <div class="tray-title">🍽️ YOUR ORDER TRAY:</div>
            <div class="tray-items-display">
              <div class="tray-item ${selectedFood ? 'filled' : 'empty'}">
                ${selectedFood ? `<span class="icon">${selectedFood.icon}</span> <span>${selectedFood.name}</span>` : '<span>➕ Choose Food</span>'}
              </div>
              <div class="tray-item ${selectedDrink ? 'filled' : 'empty'}">
                ${selectedDrink ? `<span class="icon">${selectedDrink.icon}</span> <span>${selectedDrink.name}</span>` : '<span>➕ Choose Drink</span>'}
              </div>
            </div>
          </div>
        </div>

        <div class="rest-action-footer">
          <div class="rest-speech-bubble highlight" id="order-speech-text">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">
              ${(selectedFood && selectedDrink)
                ? `"I'd like some ${selectedFood.name.toLowerCase()} and some ${selectedDrink.name.toLowerCase()}, please."`
                : "Select both a food and a drink above to build your sentence!"}
            </span>
          </div>
          <button class="rest-action-btn large say-it-btn" onclick="window.restaurantApp.speakFullOrder()">
            🗣️ SAY IT ALOUD!
          </button>
          <button class="rest-action-btn" onclick="window.restaurantApp.nextStage()">
            Next Stage ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 5. LISTEN & REMEMBER: Auditory Discrimination Challenge
   */
  renderListenRemember(state) {
    const roundIdx = state.listenRoundIndex || 0;
    const round = window.RESTAURANT_DATA.listeningRounds[roundIdx];
    const totalRounds = window.RESTAURANT_DATA.listeningRounds.length;
    const selectedFood = state.listenSelectedFood;
    const selectedDrink = state.listenSelectedDrink;
    const feedback = state.listenFeedback;

    return `
      <div class="rest-scene-container scene-listen-view">
        <div class="rest-header">
          <div class="rest-title-pill listen-pill">
            <span class="icon">🧠</span>
            <div class="text-block">
              <h2>Listen & Remember (${roundIdx + 1}/${totalRounds})</h2>
              <p class="sub">Listen to the customer's order. Tap what they ordered!</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Learn Roles ➔
          </button>
        </div>

        <div class="listen-challenge-stage">
          <!-- Audio Play Card -->
          <div class="audio-caller-card">
            <button class="big-speaker-btn" onclick="window.restaurantSound.speak('${round.customerText}')">
              🔊 <span>TAP TO LISTEN TO CUSTOMER ORDER</span>
            </button>
            <p class="speaker-hint">"Listen carefully for the food and the drink!"</p>
          </div>

          <!-- Selection Grids -->
          <div class="listen-selection-columns">
            <div class="listen-col">
              <h4>1. What Food?</h4>
              <div class="listen-items-grid">
                ${window.RESTAURANT_DATA.menu.filter(m => m.category === 'food').map(f => `
                  <button class="listen-choice-btn ${selectedFood === f.id ? 'active' : ''}" onclick="window.restaurantApp.selectListenFood('${f.id}')">
                    ${f.icon} ${f.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="listen-col">
              <h4>2. What Drink?</h4>
              <div class="listen-items-grid">
                ${window.RESTAURANT_DATA.menu.filter(m => m.category === 'drink').map(d => `
                  <button class="listen-choice-btn ${selectedDrink === d.id ? 'active' : ''}" onclick="window.restaurantApp.selectListenDrink('${d.id}')">
                    ${d.icon} ${d.name}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Feedback Box -->
          ${feedback ? `
            <div class="listen-feedback-pill ${feedback.isCorrect ? 'correct' : 'wrong'}">
              ${feedback.isCorrect ? '🎉 Correct! That was the customer\'s order!' : '💡 Listen again carefully! Replay the audio.'}
            </div>
          ` : ''}
        </div>

        <div class="rest-action-footer">
          <button class="rest-action-btn large primary" onclick="window.restaurantApp.checkListenOrder()">
            ✅ Check My Answer
          </button>
          <button class="rest-action-btn" onclick="window.restaurantApp.nextListenRound()">
            ${roundIdx === totalRounds - 1 ? 'Go to Learn Roles ➔' : 'Next Order ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 6. LEARN THE ROLES: Customer vs Waiter
   */
  renderLearnRoles(state) {
    return `
      <div class="rest-scene-container scene-roles-view">
        <div class="rest-header">
          <div class="rest-title-pill roles-pill">
            <span class="icon">👩‍🍳</span>
            <div class="text-block">
              <h2>Learn the Roles: Customer & Waiter</h2>
              <p class="sub">In a restaurant, the Customer and Waiter work together as a team!</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: First Role-Play 🎭 ➔
          </button>
        </div>

        <div class="roles-compare-stage">
          <!-- Customer Role Card -->
          <div class="role-profile-card customer-profile">
            <div class="profile-header">
              <span class="profile-avatar">🧒🎒</span>
              <h3 class="profile-title">THE CUSTOMER</h3>
            </div>
            <ul class="role-tasks-list">
              <li>👋 Says <strong>"Hello!"</strong> when arriving</li>
              <li>🍕 Orders food: <strong>"I'd like some [food], please."</strong></li>
              <li>🥤 Orders drink: <strong>"I'd like some [drink], please."</strong></li>
              <li>🙏 Always says <strong>"Please"</strong> and <strong>"Thank you!"</strong></li>
            </ul>
            <button class="role-audio-btn" onclick="window.restaurantSound.speak('I am the customer. I say: I would like some pizza, please. Thank you!')">
              🔊 Hear Customer
            </button>
          </div>

          <div class="roles-vs-divider">
            <span>🤝 TEAM</span>
          </div>

          <!-- Waiter Role Card -->
          <div class="role-profile-card waiter-profile">
            <div class="profile-header">
              <span class="profile-avatar">🧑‍🍳🍽️</span>
              <h3 class="profile-title">THE WAITER</h3>
            </div>
            <ul class="role-tasks-list">
              <li>👋 Greets: <strong>"Hello! Welcome to our restaurant."</strong></li>
              <li>❓ Asks: <strong>"What would you like?"</strong></li>
              <li>🥤 Asks: <strong>"Anything to drink?"</strong></li>
              <li>🍽️ Serves: <strong>"Here you are."</strong></li>
              <li>😊 Replies: <strong>"You're welcome!"</strong></li>
            </ul>
            <button class="role-audio-btn" onclick="window.restaurantSound.speak('I am the waiter. I say: What would you like? Anything to drink? Here you are!')">
              🔊 Hear Waiter
            </button>
          </div>
        </div>

        <div class="rest-action-footer">
          <div class="rest-speech-bubble">
            <span class="bubble-icon">🎭</span>
            <span class="bubble-text">Now let's practice our complete restaurant role-play together!</span>
          </div>
          <button class="rest-action-btn primary large" onclick="window.restaurantApp.nextStage()">
            Start Role-Play ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 7. FIRST GUIDED ROLE-PLAY: Turn-by-Turn Script on Stage
   */
  renderFirstRoleplay(state) {
    const turnIdx = state.roleplayTurnIndex || 0;
    const turns = window.RESTAURANT_DATA.dialogueTurns;
    const curTurn = turns[turnIdx];
    const totalTurns = turns.length;

    return `
      <div class="rest-scene-container scene-roleplay-view">
        <div class="rest-header">
          <div class="rest-title-pill roleplay-pill">
            <span class="icon">🎭</span>
            <div class="text-block">
              <h2>Guided Role-Play (Turn ${turnIdx + 1}/${totalTurns})</h2>
              <p class="sub">Follow the dialogue step-by-step with your speaking partner!</p>
            </div>
          </div>
          <div class="roleplay-turn-nav">
            <button class="rest-action-btn" ${turnIdx === 0 ? 'disabled' : ''} onclick="window.restaurantApp.prevRoleplayTurn()">
              ⬅️ Prev
            </button>
            <button class="rest-action-btn primary" onclick="window.restaurantApp.nextRoleplayTurn()">
              ${turnIdx === totalTurns - 1 ? 'Go to Secret Order 🎲 ➔' : 'Next Turn ➔'}
            </button>
          </div>
        </div>

        <div class="roleplay-stage-layout">
          <!-- Left: Customer Avatar Card -->
          <div class="speaker-pod customer-pod ${curTurn.speaker === 'customer' ? 'active' : ''}">
            <div class="pod-avatar">🧒</div>
            <div class="pod-label">CUSTOMER</div>
            ${curTurn.speaker === 'customer' ? '<div class="turn-badge">YOUR TURN TO SPEAK!</div>' : ''}
          </div>

          <!-- Center: Active Speech Bubble -->
          <div class="active-turn-bubble-box">
            <span class="turn-prompt-badge">${curTurn.name}: ${curTurn.prompt}</span>
            <h1 class="turn-speech-quote">"${curTurn.text}"</h1>
            <button class="turn-replay-btn" onclick="window.restaurantSound.speak('${curTurn.text}')">
              🔊 Hear Voice Model
            </button>
          </div>

          <!-- Right: Waiter Avatar Card -->
          <div class="speaker-pod waiter-pod ${curTurn.speaker === 'waiter' ? 'active' : ''}">
            <div class="pod-avatar">🧑‍🍳</div>
            <div class="pod-label">WAITER</div>
            ${curTurn.speaker === 'waiter' ? '<div class="turn-badge">YOUR TURN TO SPEAK!</div>' : ''}
          </div>
        </div>

        <div class="rest-action-footer">
          <div class="turn-dots-row">
            ${turns.map((t, idx) => `
              <div class="turn-dot ${idx === turnIdx ? 'active' : ''} ${idx < turnIdx ? 'done' : ''}"></div>
            `).join('')}
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextRoleplayTurn()">
            ${turnIdx === totalTurns - 1 ? 'Secret Order Challenge ➔' : 'Next Turn ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 8. SECRET ORDER CHALLENGE: Random Secret Card (Hidden from Waiter!)
   */
  renderSecretOrderChallenge(state) {
    const order = state.currentSecretOrder || window.RESTAURANT_DATA.secretOrders[0];
    const isRevealed = state.secretOrderRevealed;
    const servedFood = state.secretServedFood;
    const servedDrink = state.secretServedDrink;
    const isSuccess = servedFood === order.food && servedDrink === order.drink;

    const foodObj = window.RESTAURANT_DATA.menu.find(m => m.id === order.food);
    const drinkObj = window.RESTAURANT_DATA.menu.find(m => m.id === order.drink);

    return `
      <div class="rest-scene-container scene-secret-view">
        <div class="rest-header">
          <div class="rest-title-pill secret-pill">
            <span class="icon">🎲</span>
            <div class="text-block">
              <h2>Secret Order Challenge!</h2>
              <p class="sub">Customer sees the secret card. Waiter must listen, remember, and serve the right dishes!</p>
            </div>
          </div>
          <button class="rest-action-btn" onclick="window.restaurantApp.generateRandomOrder()">
            🎲 New Secret Order
          </button>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.nextStage()">
            Next: Switch Roles 🔄 ➔
          </button>
        </div>

        <div class="secret-challenge-layout">
          <!-- Secret Customer Card (Can be toggled/hidden) -->
          <div class="secret-card-container">
            <div class="card-role-title">🧒 CUSTOMER'S SECRET CARD</div>
            <div class="secret-flip-card ${isRevealed ? 'revealed' : 'hidden'}" onclick="window.restaurantApp.toggleSecretReveal()">
              ${isRevealed ? `
                <div class="secret-card-front">
                  <span class="card-tag">SECRET ORDER:</span>
                  <div class="secret-icons">${foodObj.icon} + ${drinkObj.icon}</div>
                  <div class="secret-names">${foodObj.name} & ${drinkObj.name}</div>
                  <div class="secret-prompt">Say: "I'd like some ${foodObj.name.toLowerCase()} and some ${drinkObj.name.toLowerCase()}, please."</div>
                  <button class="card-flip-btn">🙈 Hide from Waiter</button>
                </div>
              ` : `
                <div class="secret-card-back">
                  <span class="lock-icon">🔒</span>
                  <h3>SECRET ORDER CARD</h3>
                  <p>Tap to reveal (Waiter, close your eyes!)</p>
                  <button class="card-flip-btn">👁️ Reveal Secret Order</button>
                </div>
              `}
            </div>
          </div>

          <!-- Waiter's Serving Station Counter -->
          <div class="waiter-counter-station">
            <div class="counter-header">
              <span class="counter-title">🧑‍🍳 WAITER'S SERVING TRAY: Listen & Serve</span>
              <div class="served-slots">
                <div class="slot-box ${servedFood ? 'filled' : ''}">
                  ${servedFood ? `<span>${window.RESTAURANT_DATA.menu.find(m => m.id === servedFood).icon} ${servedFood.toUpperCase()}</span>` : 'Food Plate'}
                </div>
                <div class="slot-box ${servedDrink ? 'filled' : ''}">
                  ${servedDrink ? `<span>${window.RESTAURANT_DATA.menu.find(m => m.id === servedDrink).icon} ${servedDrink.toUpperCase()}</span>` : 'Drink Glass'}
                </div>
              </div>
            </div>

            <!-- 9 Dishes to Choose From -->
            <div class="serving-dishes-grid">
              ${window.RESTAURANT_DATA.menu.map(item => `
                <button class="dish-btn ${(servedFood === item.id || servedDrink === item.id) ? 'served' : ''}" onclick="window.restaurantApp.serveDish('${item.id}', '${item.category}')">
                  <span class="dish-icon">${item.icon}</span>
                  <span class="dish-name">${item.name}</span>
                </button>
              `).join('')}
            </div>

            ${isSuccess ? `
              <div class="secret-success-banner">
                🎉 PERFECT SERVICE! The waiter served the exact secret order!
              </div>
            ` : ''}
          </div>
        </div>

        <div class="rest-action-footer">
          <button class="rest-action-btn" onclick="window.restaurantApp.generateRandomOrder()">
            🎲 Generate New Order
          </button>
          <button class="rest-action-btn primary large" onclick="window.restaurantApp.nextStage()">
            Switch Roles! 🔄 ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 9. SWITCH ROLES: Invert Roles & Celebrate
   */
  renderSwitchRoles(state) {
    return `
      <div class="rest-scene-container scene-switch-view">
        <div class="switch-celebrate-card">
          <div class="switch-rotate-icon">🔄</div>
          <h1 class="switch-title">SWITCH ROLES!</h1>
          <p class="switch-subtitle">Customers become Waiters! Waiters become Customers!</p>

          <div class="switch-diagram-row">
            <div class="swap-box">
              <span class="box-icon">🧒</span>
              <span class="box-label">Old Customer</span>
              <span class="arrow-down">⬇️</span>
              <span class="box-badge waiter-b">NEW WAITER 🧑‍🍳</span>
            </div>

            <div class="swap-divider">🔁</div>

            <div class="swap-box">
              <span class="box-icon">🧑‍🍳</span>
              <span class="box-label">Old Waiter</span>
              <span class="arrow-down">⬇️</span>
              <span class="box-badge customer-b">NEW CUSTOMER 🧒</span>
            </div>
          </div>

          <div class="switch-actions-row">
            <button class="rest-action-btn primary large" onclick="window.restaurantApp.startSwitchedRoleplay()">
              🎲 Start Switched Role-Play!
            </button>
            <button class="rest-action-btn secondary" onclick="window.restaurantApp.renderStage(10)">
              Final Role-Play Challenge 🏆 ➔
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 10. FINAL ROLE-PLAY: Faded Support (Icons Only) & Oral Independence
   */
  renderFinalRoleplay(state) {
    return `
      <div class="rest-scene-container scene-final-view">
        <div class="rest-header">
          <div class="rest-title-pill final-pill">
            <span class="icon">🏆</span>
            <div class="text-block">
              <h2>Final Speaking Challenge: Full Oral Role-Play!</h2>
              <p class="sub">Written text is removed! Use the icon prompts to speak the entire conversation.</p>
            </div>
          </div>
          <button class="rest-action-btn primary" onclick="window.restaurantApp.renderStage('award')">
            Finish & Get Award 🏅 ➔
          </button>
        </div>

        <div class="final-prompts-flow-stage">
          <div class="flow-cards-grid">
            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('Hello! Welcome to our restaurant.')">
              <div class="card-step-badge">1. GREETING</div>
              <div class="card-icon">🧑‍🍳 👋</div>
              <div class="card-hint">Waiter welcomes customer</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('Hello!')">
              <div class="card-step-badge">2. HELLO</div>
              <div class="card-icon">🧒 👋</div>
              <div class="card-hint">Customer replies</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('What would you like?')">
              <div class="card-step-badge">3. FOOD QUESTION</div>
              <div class="card-icon">🧑‍🍳 ❓ 🍕</div>
              <div class="card-hint">What would you like?</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('I would like some pizza, please.')">
              <div class="card-step-badge">4. ORDER FOOD</div>
              <div class="card-icon">🧒 🍕🥗🥪🥞🍝🍲</div>
              <div class="card-hint">I'd like some [food], please.</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('Anything to drink?')">
              <div class="card-step-badge">5. DRINK QUESTION</div>
              <div class="card-icon">🧑‍🍳 ❓ 🥤</div>
              <div class="card-hint">Anything to drink?</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('I would like some water, please.')">
              <div class="card-step-badge">6. ORDER DRINK</div>
              <div class="card-icon">🧒 💧🥛🧃</div>
              <div class="card-hint">I'd like some [drink], please.</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('Here you are.')">
              <div class="card-step-badge">7. SERVE DISHES</div>
              <div class="card-icon">🧑‍🍳 🍽️✨</div>
              <div class="card-hint">Here you are.</div>
            </div>

            <div class="prompt-flow-card" onclick="window.restaurantSound.speak('Thank you! You are welcome!')">
              <div class="card-step-badge">8. POLITE ENDING</div>
              <div class="card-icon">🧒🙏 • 🧑‍🍳😊</div>
              <div class="card-hint">Thank you! You're welcome!</div>
            </div>
          </div>
        </div>

        <div class="rest-action-footer">
          <div class="rest-speech-bubble highlight">
            <span class="bubble-icon">🎤</span>
            <span class="bubble-text">Speak the complete restaurant conversation from memory with your partner!</span>
          </div>
          <button class="rest-action-btn large primary" onclick="window.restaurantApp.renderStage('award')">
            Complete Lesson & Get Certificate 🏅
          </button>
        </div>
      </div>
    `;
  },

  /**
   * AWARD CEREMONY: Restaurant Star!
   */
  renderRestaurantStarAward(state) {
    return `
      <div class="rest-scene-container scene-award-view">
        <div class="award-certificate-card">
          <div class="cert-gold-ribbon">⭐ RESTAURANT MASTER CERTIFICATE ⭐</div>
          <h1 class="cert-headline">RESTAURANT STAR!</h1>
          <p class="cert-subtext">Awarded for outstanding polite English speaking in restaurant role-play!</p>

          <div class="medal-center-box">
            <div class="gold-trophy-icon">🏆</div>
            <div class="stars-five-row">⭐ ⭐ ⭐ ⭐ ⭐</div>
          </div>

          <!-- Checklists -->
          <div class="award-checklists-grid">
            <div class="checklist-card">
              <h4>🧒 CUSTOMER CHECKLIST</h4>
              <p>☑ Said "Hello!"</p>
              <p>☑ Ordered food with "I'd like some..."</p>
              <p>☑ Ordered drink with "I'd like some..."</p>
              <p>☑ Said "Please"</p>
              <p>☑ Said "Thank you!"</p>
            </div>

            <div class="checklist-card">
              <h4>🧑‍🍳 WAITER CHECKLIST</h4>
              <p>☑ Welcomed customer politely</p>
              <p>☑ Asked "What would you like?"</p>
              <p>☑ Asked "Anything to drink?"</p>
              <p>☑ Served with "Here you are."</p>
              <p>☑ Replied "You're welcome!"</p>
            </div>
          </div>

          <div class="cert-actions-row">
            <button class="rest-action-btn primary large" onclick="window.restaurantSound.playFanfare(); window.restaurantApp.launchConfetti()">
              🎉 Celebrate Again!
            </button>
            <a href="worksheets.html" target="_blank" class="rest-action-btn secondary">
              🖨️ Open Printable Worksheets
            </a>
            <button class="rest-action-btn" onclick="window.restaurantApp.renderStage(1)">
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.RestaurantScenes = RestaurantScenes;
