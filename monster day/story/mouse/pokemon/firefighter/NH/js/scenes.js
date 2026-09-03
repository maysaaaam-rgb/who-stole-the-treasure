/**
 * Scene Renderer: High-Quality SVG Visuals for Smartboards & Tablets
 * Contains vector graphic generators for Main Map, House, Park, School, Shop, Neighbours, Builder
 */

const Scenes = {
  /**
   * Renders the Main Living Neighbourhood Map
   */
  renderMainMap(state) {
    const isBig = state.neighbourhoodSize === 'big';
    return `
      <div class="scene-container scene-main-map ${isBig ? 'mode-big' : 'mode-small'}">
        <svg class="map-svg" viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#70c5ff" />
              <stop offset="100%" stop-color="#bfe6ff" />
            </linearGradient>
            <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#80cc55" />
              <stop offset="100%" stop-color="#55aa33" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#606670" />
              <stop offset="100%" stop-color="#4d535b" />
            </linearGradient>
            <linearGradient id="roofGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e05a47" />
              <stop offset="100%" stop-color="#c43b27" />
            </linearGradient>
            <linearGradient id="roofGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#4a90e2" />
              <stop offset="100%" stop-color="#2d68b2" />
            </linearGradient>
            <linearGradient id="schoolRoof" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#d97724" />
              <stop offset="100%" stop-color="#ad530d" />
            </linearGradient>
            <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.18)" />
            </filter>
            <filter id="beaconGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Sky & Horizon -->
          <rect x="0" y="0" width="1200" height="200" fill="url(#skyGrad)" />
          
          <!-- Sun & Clouds -->
          <circle cx="950" cy="70" r="38" fill="#ffd13b" opacity="0.9" filter="url(#dropShadow)" />
          <path d="M 120 70 q 20 -25 45 -10 q 25 -20 50 0 q 25 5 20 25 h -115 z" fill="#ffffff" opacity="0.85" />
          <path d="M 680 50 q 25 -20 50 -5 q 25 -25 55 0 q 30 10 25 30 h -130 z" fill="#ffffff" opacity="0.8" />

          <!-- Distant green hills -->
          <path d="M 0 200 Q 250 140 500 190 T 1000 170 T 1200 195 L 1200 240 L 0 240 Z" fill="#99db73" />

          <!-- Main Grass Ground -->
          <rect x="0" y="190" width="1200" height="485" fill="url(#grassGrad)" />

          <!-- Sidewalks & Road Network (Cul-de-sac matching the PDF cover) -->
          <!-- Paved Area Backdrop -->
          <path d="M 0 460 L 400 460 L 440 330 L 760 330 L 800 460 L 1200 460 L 1200 580 L 830 580 C 850 510 820 440 760 410 C 690 380 510 380 440 410 C 380 440 350 510 370 580 L 0 580 Z" fill="#cbd4dc" opacity="0.5" />

          <!-- Main Cul-de-Sac Asphalt Loop -->
          <!-- Outer Road -->
          <path d="M 0 470 L 400 470 L 450 350 L 750 350 L 800 470 L 1200 470 L 1200 570 L 820 570 C 860 480 810 400 600 400 C 390 400 340 480 380 570 L 0 570 Z" fill="url(#roadGrad)" />
          
          <!-- Roundabout Center Island (with PDF's signature round tree lawn) -->
          <ellipse cx="600" cy="495" rx="130" ry="65" fill="#71ba42" stroke="#d5dfc6" stroke-width="8" filter="url(#dropShadow)" />
          <!-- Center Landmark Tree (Findable tree #1) -->
          <g class="interactive-item findable-tree" data-type="tree" data-id="tree_center" onclick="window.app.handleItemClick('tree', 'tree_center', 'Grand Roundabout Tree')">
            <!-- Tree Trunk -->
            <path d="M 585 495 Q 575 440 560 400 L 640 400 Q 625 440 615 495 Z" fill="#795548" />
            <!-- Swaying Canopy -->
            <ellipse class="sway-tree" cx="600" cy="380" rx="90" ry="70" fill="#388e3c" filter="url(#dropShadow)" />
            <ellipse class="sway-tree" cx="560" cy="360" rx="65" ry="55" fill="#4caf50" opacity="0.9" />
            <ellipse class="sway-tree" cx="640" cy="370" rx="60" ry="50" fill="#66bb6a" opacity="0.9" />
          </g>

          <!-- Road Lane Markings -->
          <path d="M 0 520 L 350 520" stroke="#f1c40f" stroke-width="4" stroke-dasharray="25,20" />
          <path d="M 850 520 L 1200 520" stroke="#f1c40f" stroke-width="4" stroke-dasharray="25,20" />
          <ellipse cx="600" cy="495" rx="160" ry="85" fill="none" stroke="#f1c40f" stroke-width="3" stroke-dasharray="25,25" />

          <!-- Zebra Crossings -->
          <g opacity="0.8">
            <line x1="330" y1="475" x2="330" y2="565" stroke="#ffffff" stroke-width="12" stroke-dasharray="14,14" />
            <line x1="870" y1="475" x2="870" y2="565" stroke="#ffffff" stroke-width="12" stroke-dasharray="14,14" />
          </g>

          <!-- Moving Ambient Car on Road Loop -->
          <g class="animated-car interactive-item" onclick="window.app.handleCarClick('car_cruising')">
            <rect x="0" y="0" width="84" height="38" rx="12" fill="#e74c3c" filter="url(#dropShadow)" />
            <rect x="18" y="4" width="46" height="20" rx="6" fill="#81d4fa" />
            <circle cx="20" cy="38" r="11" fill="#2c3e50" />
            <circle cx="20" cy="38" r="4" fill="#bdc3c7" />
            <circle cx="64" cy="38" r="11" fill="#2c3e50" />
            <circle cx="64" cy="38" r="4" fill="#bdc3c7" />
            <circle cx="78" cy="18" r="4" fill="#ffeaa7" />
            <!-- Animated path for car -->
            <animateMotion path="M 20 485 L 360 485 Q 420 420 600 420 Q 780 420 840 485 L 1150 485 L 1150 535 L 840 535 Q 780 570 600 570 Q 420 570 360 535 L 20 535 Z" dur="18s" repeatCount="indefinite" />
          </g>

          <!-- ================= LOCATION 1: HOME (HOUSE) ================= -->
          <g id="loc-home" class="map-location clickable-zone findable-house" data-type="house" data-id="house_home" onclick="window.app.enterLocation('home')">
            <!-- Front Yard & Path -->
            <path d="M 120 440 L 160 370 L 250 370 L 260 440 Z" fill="#68bb38" />
            <path d="M 185 370 L 175 450 L 205 450 L 200 370 Z" fill="#e5c28f" />
            <!-- House Body -->
            <rect x="130" y="270" width="125" height="100" rx="4" fill="#fffae6" stroke="#cbb993" stroke-width="3" filter="url(#dropShadow)" />
            <!-- Gable Roof -->
            <polygon points="115,270 192,205 270,270" fill="url(#roofGrad1)" stroke="#9c2716" stroke-width="2" />
            <!-- Chimney -->
            <rect x="230" y="215" width="20" height="35" fill="#c0392b" />
            <!-- Windows with curtains -->
            <rect x="145" y="285" width="28" height="30" rx="3" fill="#b3e5fc" stroke="#607d8b" stroke-width="2" />
            <line x1="159" y1="285" x2="159" y2="315" stroke="#ffffff" stroke-width="2" />
            <line x1="145" y1="300" x2="173" y2="300" stroke="#ffffff" stroke-width="2" />
            <rect x="212" y="285" width="28" height="30" rx="3" fill="#b3e5fc" stroke="#607d8b" stroke-width="2" />
            <!-- Front Door -->
            <rect x="180" y="325" width="26" height="45" rx="3" fill="#2980b9" />
            <circle cx="200" cy="350" r="3" fill="#f1c40f" />
            <!-- Flower Pots -->
            <circle cx="165" cy="365" r="7" fill="#e91e63" />
            <circle cx="222" cy="365" r="7" fill="#e91e63" />
            <!-- Parked Car in driveway (Findable car #1) -->
            <g class="interactive-item findable-car" data-type="car" data-id="car_home" onclick="event.stopPropagation(); window.app.handleItemClick('car', 'car_home', 'Silver Family Car')">
              <rect x="60" y="390" width="70" height="32" rx="8" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="2" filter="url(#dropShadow)" />
              <rect x="75" y="394" width="38" height="15" rx="4" fill="#e1f5fe" />
              <circle cx="76" cy="422" r="8" fill="#34495e" />
              <circle cx="114" cy="422" r="8" fill="#34495e" />
            </g>
            <!-- Badge / Label -->
            <g class="location-badge" transform="translate(192, 195)">
              <rect x="-65" y="-30" width="130" height="32" rx="16" fill="#ff7043" filter="url(#dropShadow)" />
              <text x="0" y="-8" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="bold">🏠 MY HOME</text>
            </g>
          </g>

          <!-- Avatar "YOU ARE HERE 📍" Pin (next to Home) -->
          <g class="avatar-pin" transform="translate(265, 410)">
            <!-- Pulsing ring -->
            <circle cx="0" cy="-30" r="22" fill="#ffeb3b" opacity="0.4" class="pulse-ring" />
            <ellipse cx="0" cy="5" rx="14" ry="6" fill="rgba(0,0,0,0.25)" />
            <!-- Avatar Kid -->
            <g transform="translate(-16, -55) scale(0.65)">
              <!-- Body -->
              <rect x="12" y="32" width="24" height="28" rx="6" fill="#4caf50" />
              <!-- Head -->
              <circle cx="24" cy="20" r="14" fill="#ffcc80" />
              <!-- Hair -->
              <path d="M 12 18 Q 24 6 36 18 Q 30 10 24 10 Q 18 10 12 18 Z" fill="#5d4037" />
              <!-- Eyes & Smile -->
              <circle cx="20" cy="18" r="2" fill="#333" />
              <circle cx="28" cy="18" r="2" fill="#333" />
              <path d="M 20 25 Q 24 28 28 25" stroke="#333" stroke-width="1.5" fill="none" />
              <!-- Legs -->
              <rect x="14" y="60" width="8" height="18" fill="#fbc02d" />
              <rect x="26" y="60" width="8" height="18" fill="#fbc02d" />
              <ellipse cx="18" cy="80" rx="6" ry="4" fill="#1976d2" />
              <ellipse cx="30" cy="80" rx="6" ry="4" fill="#1976d2" />
            </g>
            <!-- Pin Flag -->
            <g transform="translate(0, -65)">
              <rect x="-50" y="-22" width="100" height="24" rx="12" fill="#e91e63" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="-6" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="900">YOU ARE HERE 📍</text>
            </g>
          </g>

          <!-- ================= LOCATION 2: THE SCHOOL ================= -->
          <g id="loc-school" class="map-location clickable-zone" onclick="window.app.enterLocation('school')">
            <g transform="translate(480, 140)">
              <!-- Main School Building (Matching PDF slide 8) -->
              <rect x="0" y="60" width="240" height="120" rx="4" fill="#f5ebe1" stroke="#a08068" stroke-width="3" filter="url(#dropShadow)" />
              <!-- Central Grand Entrance Tower -->
              <rect x="70" y="25" width="100" height="155" rx="4" fill="#eedbc9" stroke="#a08068" stroke-width="3" />
              <!-- School Pediment / Roof Banner -->
              <polygon points="60,25 120,-10 180,25" fill="url(#schoolRoof)" />
              <!-- School Clock / Bell -->
              <circle cx="120" cy="12" r="14" fill="#ffffff" stroke="#795548" stroke-width="2" />
              <text x="120" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="#795548">🔔</text>
              <!-- "SCHOOL" Name Banner -->
              <rect x="80" y="55" width="80" height="20" rx="4" fill="#fff" stroke="#8d6e63" stroke-width="2" />
              <text x="120" y="70" text-anchor="middle" fill="#d35400" font-size="13" font-weight="bold" letter-spacing="2">SCHOOL</text>
              <!-- Windows Grid -->
              <g fill="#b3e5fc" stroke="#5c6f84" stroke-width="1.8">
                <!-- Left Windows -->
                <rect x="15" y="78" width="40" height="32" rx="2" />
                <rect x="15" y="125" width="40" height="40" rx="2" />
                <!-- Right Windows -->
                <rect x="185" y="78" width="40" height="32" rx="2" />
                <rect x="185" y="125" width="40" height="40" rx="2" />
                <!-- Center Windows -->
                <rect x="85" y="85" width="70" height="35" rx="2" />
              </g>
              <!-- Double Entrance Doors -->
              <rect x="95" y="132" width="50" height="48" rx="2" fill="#795548" />
              <line x1="120" y1="132" x2="120" y2="180" stroke="#ffcc80" stroke-width="2" />
              <circle cx="114" cy="156" r="2.5" fill="#f1c40f" />
              <circle cx="126" cy="156" r="2.5" fill="#f1c40f" />
              <!-- Steps -->
              <rect x="85" y="180" width="70" height="8" fill="#9e9e9e" />
              <!-- Badge -->
              <g class="location-badge" transform="translate(120, -18)">
                <rect x="-65" y="-30" width="130" height="32" rx="16" fill="#3f51b5" filter="url(#dropShadow)" />
                <text x="0" y="-8" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="bold">🏫 SCHOOL</text>
              </g>
            </g>
          </g>

          <!-- ================= LOCATION 3: THE PARK ================= -->
          <g id="loc-park" class="map-location clickable-zone" onclick="window.app.enterLocation('park')">
            <!-- Park Green Area -->
            <path d="M 850 210 Q 1150 200 1180 340 Q 1190 440 980 440 L 850 440 Z" fill="#60b63b" stroke="#7ac955" stroke-width="4" filter="url(#dropShadow)" />
            <!-- Park Sandbox & Playground (Matching PDF slide 7) -->
            <ellipse cx="1020" cy="340" rx="90" ry="55" fill="#edd69f" stroke="#cbb47c" stroke-width="3" />
            <!-- Playground Slide Structure -->
            <g transform="translate(970, 270)">
              <!-- Wooden tower -->
              <rect x="0" y="0" width="36" height="50" fill="#8d6e63" />
              <polygon points="-8,0 18,-20 44,0" fill="#a1887f" />
              <!-- Red Slide -->
              <path d="M 36 20 C 60 20 65 55 95 65 L 85 70 C 55 60 50 30 36 26 Z" fill="#e74c3c" />
              <line x1="36" y1="20" x2="95" y2="65" stroke="#c0392b" stroke-width="2" />
            </g>
            <!-- Wooden Bench -->
            <g transform="translate(1010, 365)">
              <rect x="0" y="0" width="55" height="12" rx="3" fill="#a1887f" stroke="#5d4037" stroke-width="1.5" />
              <line x1="10" y1="12" x2="10" y2="24" stroke="#5d4037" stroke-width="4" />
              <line x1="45" y1="12" x2="45" y2="24" stroke="#5d4037" stroke-width="4" />
            </g>
            <!-- Park Trees (Findable tree #2 & #3) -->
            <g class="interactive-item findable-tree" data-type="tree" data-id="tree_park1" onclick="event.stopPropagation(); window.app.handleItemClick('tree', 'tree_park1', 'Park Oak Tree')">
              <rect x="900" y="240" width="16" height="40" fill="#5d4037" />
              <circle cx="908" cy="220" r="38" fill="#388e3c" class="sway-tree" />
            </g>
            <g class="interactive-item findable-tree" data-type="tree" data-id="tree_park2" onclick="event.stopPropagation(); window.app.handleItemClick('tree', 'tree_park2', 'Flowering Park Tree')">
              <rect x="1130" y="250" width="16" height="35" fill="#5d4037" />
              <circle cx="1138" cy="235" r="32" fill="#4caf50" class="sway-tree" />
            </g>
            <!-- Happy Dog in Park -->
            <g class="interactive-item animated-dog" onclick="event.stopPropagation(); window.app.handleDogClick('park_dog')">
              <ellipse cx="940" cy="380" rx="14" ry="10" fill="#d7ccc8" />
              <circle cx="952" cy="374" r="8" fill="#bcaaa4" />
              <ellipse cx="957" cy="373" rx="3" ry="5" fill="#8d6e63" />
              <line x1="930" y1="378" x2="922" y2="370" stroke="#bcaaa4" stroke-width="3.5" stroke-linecap="round" class="wag-tail" />
            </g>
            <!-- Soccer Ball -->
            <circle cx="970" cy="385" r="8" fill="#ffffff" stroke="#333" stroke-width="1.5" />
            <!-- Badge -->
            <g class="location-badge" transform="translate(1010, 185)">
              <rect x="-60" y="-30" width="120" height="32" rx="16" fill="#2e7d32" filter="url(#dropShadow)" />
              <text x="0" y="-8" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="bold">🌳 PARK</text>
            </g>
          </g>

          <!-- ================= LOCATION 4: THE SHOP & BAKERY ================= -->
          <g id="loc-shop" class="map-location clickable-zone" onclick="window.app.enterLocation('shop')">
            <g transform="translate(140, 120)">
              <!-- Bakery Shop Building (Matching PDF slide 9 & 20) -->
              <!-- Shop Front Left (Bakery) -->
              <rect x="0" y="45" width="110" height="85" rx="3" fill="#ffe0b2" stroke="#d7ccc8" stroke-width="2" filter="url(#dropShadow)" />
              <!-- Shop Front Right (Grocer) -->
              <rect x="110" y="35" width="110" height="95" rx="3" fill="#d1c4e9" stroke="#9575cd" stroke-width="2" filter="url(#dropShadow)" />
              <!-- Striped Awning -->
              <path d="M -5 45 L 115 45 L 105 65 L -15 65 Z" fill="#4caf50" />
              <path d="M 0 45 L 20 45 L 10 65 L -10 65 Z" fill="#ffffff" />
              <path d="M 40 45 L 60 45 L 50 65 L 30 65 Z" fill="#ffffff" />
              <path d="M 80 45 L 100 45 L 90 65 L 70 65 Z" fill="#ffffff" />
              <!-- Right Awning -->
              <path d="M 110 35 L 225 35 L 215 55 L 100 55 Z" fill="#ab47bc" />
              <path d="M 120 35 L 140 35 L 130 55 L 110 55 Z" fill="#ffffff" />
              <path d="M 160 35 L 180 35 L 170 55 L 150 55 Z" fill="#ffffff" />
              <path d="M 200 35 L 220 35 L 210 55 L 190 55 Z" fill="#ffffff" />
              <!-- Display Windows with bread & cake -->
              <rect x="12" y="72" width="85" height="48" fill="#e0f7fa" stroke="#b0bec5" stroke-width="2" />
              <rect x="125" y="65" width="85" height="55" fill="#ede7f6" stroke="#b39ddb" stroke-width="2" />
              <!-- Bread & cakes inside window -->
              <ellipse cx="40" cy="98" rx="14" ry="7" fill="#d7a15c" />
              <ellipse cx="70" cy="95" rx="12" ry="10" fill="#f48fb1" />
              <ellipse cx="165" cy="95" rx="16" ry="10" fill="#ffb74d" />
              <!-- Shop Sign -->
              <rect x="35" y="18" width="140" height="22" rx="5" fill="#ffffff" stroke="#ff9800" stroke-width="2" />
              <text x="105" y="34" text-anchor="middle" fill="#e65100" font-size="12" font-weight="900">🛒 BAKERY & SHOP</text>
              <!-- Badge -->
              <g class="location-badge" transform="translate(105, -5)">
                <rect x="-65" y="-30" width="130" height="32" rx="16" fill="#e65100" filter="url(#dropShadow)" />
                <text x="0" y="-8" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="bold">🛒 SHOP</text>
              </g>
            </g>
          </g>

          <!-- ================= LOCATION 5: MEET THE NEIGHBOURS ================= -->
          <g id="loc-neighbours" class="map-location clickable-zone findable-house" data-type="house" data-id="house_neighbour" onclick="window.app.enterLocation('neighbours')">
            <!-- Neighbour House (Matching PDF slide 10) -->
            <g transform="translate(850, 430)">
              <!-- House Structure -->
              <rect x="0" y="30" width="130" height="95" rx="4" fill="#e8f5e9" stroke="#81c784" stroke-width="3" filter="url(#dropShadow)" />
              <polygon points="-10,30 65,-25 140,30" fill="url(#roofGrad2)" stroke="#1e88e5" stroke-width="2" />
              <!-- Windows & Door -->
              <rect x="18" y="45" width="30" height="30" rx="3" fill="#b3e5fc" stroke="#607d8b" stroke-width="2" />
              <rect x="82" y="45" width="30" height="30" rx="3" fill="#b3e5fc" stroke="#607d8b" stroke-width="2" />
              <rect x="52" y="75" width="26" height="50" rx="3" fill="#8d6e63" />
              <!-- White Picket Fence -->
              <g stroke="#ffffff" stroke-width="4">
                <line x1="-30" y1="120" x2="30" y2="120" />
                <line x1="-25" y1="105" x2="-25" y2="125" />
                <line x1="-15" y1="105" x2="-15" y2="125" />
                <line x1="-5" y1="105" x2="-5" y2="125" />
                <line x1="5" y1="105" x2="5" y2="125" />
                <line x1="15" y1="105" x2="15" y2="125" />
                <line x1="25" y1="105" x2="25" y2="125" />
              </g>
              <!-- Family Characters Outside Lawn (Matching PDF slide 10) -->
              <g class="interactive-item family-group" onclick="event.stopPropagation(); window.app.handleFamilyClick()">
                <!-- Dad -->
                <circle cx="-15" cy="50" r="10" fill="#ffcc80" />
                <rect x="-22" y="60" width="14" height="24" rx="4" fill="#42a5f5" />
                <!-- Mum -->
                <circle cx="2" cy="54" r="9" fill="#d7ccc8" />
                <rect x="-5" y="63" width="14" height="22" rx="4" fill="#ec407a" />
                <!-- Child 1 waving -->
                <circle cx="18" cy="65" r="7" fill="#ffcc80" />
                <rect x="12" y="72" width="12" height="18" rx="3" fill="#ab47bc" />
                <line x1="22" y1="74" x2="30" y2="64" stroke="#ffcc80" stroke-width="2.5" class="waving-arm" />
              </g>
              <!-- Badge -->
              <g class="location-badge" transform="translate(65, -35)">
                <rect x="-70" y="-30" width="140" height="32" rx="16" fill="#8e24aa" filter="url(#dropShadow)" />
                <text x="0" y="-8" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">👨‍👩‍👧 NEIGHBOURS</text>
              </g>
            </g>
          </g>

          <!-- Additional Interactive Elements for Find It & Living World -->
          <!-- House #3 (Brown Bungalow - Findable house #3) -->
          <g class="interactive-item findable-house big-only" data-type="house" data-id="house_cottage" onclick="window.app.handleItemClick('house', 'house_cottage', 'Brick Cottage')">
            <g transform="translate(360, 240)">
              <rect x="0" y="25" width="85" height="70" rx="3" fill="#ffebee" stroke="#ef9a9a" stroke-width="2" filter="url(#dropShadow)" />
              <polygon points="-8,25 42,-15 93,25" fill="#8e24aa" />
              <rect x="14" y="38" width="22" height="22" rx="2" fill="#b3e5fc" />
              <rect x="50" y="48" width="20" height="47" rx="2" fill="#5d4037" />
            </g>
          </g>

          <!-- Tree #4 (Findable tree #4 near School) -->
          <g class="interactive-item findable-tree big-only" data-type="tree" data-id="tree_school" onclick="window.app.handleItemClick('tree', 'tree_school', 'Maple Tree by School')">
            <rect x="740" y="240" width="14" height="40" fill="#5d4037" />
            <circle cx="747" cy="225" r="32" fill="#2e7d32" class="sway-tree" />
          </g>

          <!-- Extra Blue Car parked (Findable car #2) -->
          <g class="interactive-item findable-car big-only" data-type="car" data-id="car_blue" onclick="window.app.handleItemClick('car', 'car_blue', 'Blue Hatchback')">
            <g transform="translate(330, 420)">
              <rect x="0" y="0" width="68" height="30" rx="8" fill="#1e88e5" stroke="#1565c0" stroke-width="2" filter="url(#dropShadow)" />
              <rect x="14" y="4" width="36" height="14" rx="4" fill="#e1f5fe" />
              <circle cx="16" cy="30" r="8" fill="#263238" />
              <circle cx="52" cy="30" r="8" fill="#263238" />
            </g>
          </g>

          <!-- Kid on scooter on pavement -->
          <g class="interactive-item animated-scooter" onclick="window.app.handleScooterClick()">
            <g transform="translate(290, 450)">
              <!-- Scooter frame -->
              <line x1="0" y1="26" x2="30" y2="26" stroke="#e91e63" stroke-width="3" />
              <line x1="28" y1="26" x2="28" y2="2" stroke="#e91e63" stroke-width="3" />
              <line x1="22" y1="2" x2="34" y2="2" stroke="#333" stroke-width="3" />
              <circle cx="2" cy="26" r="4" fill="#333" />
              <circle cx="28" cy="26" r="4" fill="#333" />
              <!-- Kid -->
              <circle cx="16" cy="-8" r="6" fill="#ffcc80" />
              <rect x="12" y="-2" width="10" height="18" rx="3" fill="#00bcd4" />
              <line x1="14" y1="16" x2="10" y2="25" stroke="#333" stroke-width="2" />
              <line x1="18" y1="16" x2="24" y2="25" stroke="#333" stroke-width="2" />
            </g>
          </g>
        </svg>
      </div>
    `;
  },

  /**
   * Renders Inside the House (Cross-section view with 4 rooms)
   */
  renderHouseInterior() {
    return `
      <div class="scene-container scene-interior-house">
        <div class="interior-header">
          <div class="interior-title-pill">
            <span class="icon">🏠</span>
            <div class="text-block">
              <h2>Inside My House</h2>
              <p class="sub">Where do you live? <strong>"I live in a house."</strong></p>
            </div>
          </div>
          <div class="house-choice-bar">
            <span class="prompt-label">Where do you live?</span>
            <button class="choice-btn active" onclick="window.app.setLivingChoice('house')">🏠 I live in a house.</button>
            <button class="choice-btn" onclick="window.app.setLivingChoice('flat')">🏢 I live in a flat.</button>
          </div>
        </div>

        <!-- 4-Room Grid -->
        <div class="house-cross-section">
          <!-- Room 1: Bedroom -->
          <div class="room-card bedroom-room">
            <div class="room-tag">🛏️ Bedroom</div>
            <div class="room-stage">
              <!-- Bed Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('bed', 'bed', 'There is a cozy bed.')">
                <div class="furniture-icon">🛏️</div>
                <div class="furniture-label">BED</div>
              </div>
              <!-- Window Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('window', 'window', 'I can see the street from my window.')">
                <div class="furniture-icon">🪟</div>
                <div class="furniture-label">WINDOW</div>
              </div>
            </div>
          </div>

          <!-- Room 2: Bathroom -->
          <div class="room-card bathroom-room">
            <div class="room-tag">🛁 Bathroom</div>
            <div class="room-stage">
              <!-- Bathtub Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('bath', 'bath', 'There is a clean bathtub.')">
                <div class="furniture-icon">🛁</div>
                <div class="furniture-label">BATH</div>
              </div>
              <!-- Mirror Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('mirror', 'mirror', 'There is a shiny mirror.')">
                <div class="furniture-icon">🪞</div>
                <div class="furniture-label">MIRROR</div>
              </div>
            </div>
          </div>

          <!-- Room 3: Living Room -->
          <div class="room-card living-room">
            <div class="room-tag">🛋️ Living Room</div>
            <div class="room-stage">
              <!-- Sofa Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('sofa', 'sofa', 'There is a comfy sofa.')">
                <div class="furniture-icon">🛋️</div>
                <div class="furniture-label">SOFA</div>
              </div>
              <!-- TV Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('tv', 'television', 'There is a television.')">
                <div class="furniture-icon">📺</div>
                <div class="furniture-label">TV</div>
              </div>
              <!-- Lamp Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('lamp', 'lamp', 'There is a bright lamp.')">
                <div class="furniture-icon">💡</div>
                <div class="furniture-label">LAMP</div>
              </div>
            </div>
          </div>

          <!-- Room 4: Kitchen -->
          <div class="room-card kitchen-room">
            <div class="room-tag">🍳 Kitchen</div>
            <div class="room-stage">
              <!-- Fridge Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('fridge', 'fridge', 'The fridge keeps food cold.')">
                <div class="furniture-icon">🧊</div>
                <div class="furniture-label">FRIDGE</div>
              </div>
              <!-- Food Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('food', 'food', 'There is yummy food on the table.')">
                <div class="furniture-icon">🍎</div>
                <div class="furniture-label">FOOD</div>
              </div>
              <!-- Cooker Item -->
              <div class="clickable-furniture" onclick="window.app.handleObjectClick('cooker', 'cooker', 'We cook delicious meals here.')">
                <div class="furniture-icon">🍳</div>
                <div class="furniture-label">COOKER</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sentence Footer -->
        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="house-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text" id="house-speech-text">Where do you live? "I live in a house."</span>
          </div>
          <button class="action-play-btn" onclick="window.app.speakCurrent('house-speech-text')">
            🔊 Speak Again
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Street
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Renders the Interactive Park Scene & Park Detective
   */
  renderParkScene() {
    return `
      <div class="scene-container scene-park-view">
        <div class="interior-header">
          <div class="interior-title-pill park-pill">
            <span class="icon">🌳</span>
            <div class="text-block">
              <h2>The Community Park</h2>
              <p class="sub">"There is a park." • "I like to go to the park."</p>
            </div>
          </div>
          <div class="park-checklist-bar">
            <span class="check-title">🔎 Detective Checklist:</span>
            <span class="check-item" id="check-slide">🛝 Slide</span>
            <span class="check-item" id="check-bench">🪑 Bench</span>
            <span class="check-item" id="check-tree">🌳 Tree</span>
            <span class="check-item" id="check-dog">🐕 Dog</span>
          </div>
        </div>

        <!-- Park Illustration Interactive Board -->
        <div class="park-stage-board">
          <svg class="park-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="parkSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#80d8ff" />
                <stop offset="100%" stop-color="#b3e5fc" />
              </linearGradient>
              <linearGradient id="parkMeadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#7cb342" />
                <stop offset="100%" stop-color="#558b2f" />
              </linearGradient>
            </defs>

            <!-- Sky & Meadow -->
            <rect x="0" y="0" width="1000" height="180" fill="url(#parkSky)" />
            <circle cx="850" cy="60" r="32" fill="#fbc02d" />
            <rect x="0" y="160" width="1000" height="340" fill="url(#parkMeadow)" />

            <!-- Park Wooden Fence -->
            <g stroke="#8d6e63" stroke-width="4">
              <line x1="0" y1="180" x2="1000" y2="180" />
              <line x1="0" y1="165" x2="1000" y2="165" />
            </g>

            <!-- Path curving to distant trees -->
            <path d="M 500 180 Q 520 280 620 500 L 460 500 Q 420 280 440 180 Z" fill="#e0cfab" />

            <!-- Sandbox Area -->
            <ellipse cx="280" cy="360" rx="220" ry="110" fill="#edd69f" stroke="#cbb47c" stroke-width="4" />

            <!-- Large Interactive Slide Structure (Matching PDF Slide 7 & 11) -->
            <g class="park-interactive-obj" id="park-obj-slide" onclick="window.app.handleParkItem('slide')">
              <!-- Wooden Towers -->
              <rect x="120" y="190" width="55" height="120" fill="#6d4c41" rx="4" />
              <polygon points="110,190 147,140 185,190" fill="#8d6e63" />
              <rect x="210" y="210" width="50" height="100" fill="#6d4c41" rx="4" />
              <polygon points="200,210 235,165 270,210" fill="#8d6e63" />
              <!-- Bridge -->
              <rect x="175" y="230" width="35" height="15" fill="#4e342e" />
              <!-- Red Spiral Slide Tube -->
              <path d="M 120 240 C 60 270 70 380 150 390 L 165 370 C 100 360 90 280 140 240 Z" fill="#546e7a" />
              <!-- Bright Red Open Slide -->
              <path d="M 260 250 C 320 260 340 370 410 400 L 390 415 C 320 380 300 275 250 265 Z" fill="#e53935" id="slide-curve" />
              <text x="210" y="320" font-size="28">🛝</text>
            </g>

            <!-- Wooden Park Bench -->
            <g class="park-interactive-obj" id="park-obj-bench" onclick="window.app.handleParkItem('bench')">
              <rect x="520" y="370" width="130" height="25" rx="5" fill="#a1887f" stroke="#5d4037" stroke-width="2.5" />
              <rect x="520" y="340" width="130" height="20" rx="4" fill="#8d6e63" stroke="#5d4037" stroke-width="2" />
              <line x1="540" y1="395" x2="540" y2="425" stroke="#3e2723" stroke-width="6" stroke-linecap="round" />
              <line x1="630" y1="395" x2="630" y2="425" stroke="#3e2723" stroke-width="6" stroke-linecap="round" />
              <text x="570" y="365" font-size="24">🪑</text>
            </g>

            <!-- Lush Park Trees -->
            <g class="park-interactive-obj" id="park-obj-tree" onclick="window.app.handleParkItem('tree')">
              <rect x="760" y="160" width="28" height="100" fill="#5d4037" />
              <ellipse cx="774" cy="140" rx="85" ry="75" fill="#2e7d32" />
              <ellipse cx="730" cy="120" rx="60" ry="50" fill="#388e3c" />
              <ellipse cx="810" cy="130" rx="65" ry="55" fill="#4caf50" />
              <text x="760" y="145" font-size="34">🌳</text>
            </g>

            <!-- Park Dog (Matching PDF slide 12) -->
            <g class="park-interactive-obj" id="park-obj-dog" onclick="window.app.handleParkItem('dog')">
              <g transform="translate(680, 420)">
                <ellipse cx="20" cy="0" rx="22" ry="15" fill="#d7ccc8" stroke="#8d6e63" stroke-width="2" />
                <circle cx="40" cy="-8" r="13" fill="#bcaaa4" />
                <ellipse cx="46" cy="-8" rx="4" ry="7" fill="#8d6e63" />
                <circle cx="43" cy="-10" r="2.5" fill="#333" />
                <circle cx="51" cy="-6" r="2.5" fill="#333" />
                <!-- Legs -->
                <line x1="10" y1="12" x2="10" y2="28" stroke="#8d6e63" stroke-width="4" />
                <line x1="30" y1="12" x2="30" y2="28" stroke="#8d6e63" stroke-width="4" />
                <!-- Wagging tail -->
                <line x1="0" y1="-2" x2="-14" y2="-12" stroke="#8d6e63" stroke-width="5" stroke-linecap="round" class="wag-tail" />
              </g>
              <text x="680" y="410" font-size="28">🐕</text>
            </g>

            <!-- Flowers and Bicycle -->
            <g class="park-interactive-obj" onclick="window.app.handleParkItem('flowers')">
              <text x="880" y="440" font-size="36">🌷🌸🌷</text>
            </g>
            <g class="park-interactive-obj" onclick="window.app.handleParkItem('bike')">
              <text x="440" y="440" font-size="40">🚲</text>
            </g>
          </svg>
        </div>

        <!-- Sentence Footer -->
        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="park-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text" id="park-speech-text">What is in the park? "There is a park." • "I like to go to the park."</span>
          </div>
          <button class="action-play-btn" onclick="window.app.speakCurrent('park-speech-text')">
            🔊 Speak Again
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Renders the School Classroom Scene
   */
  renderSchoolScene() {
    return `
      <div class="scene-container scene-school-view">
        <div class="interior-header">
          <div class="interior-title-pill school-pill">
            <span class="icon">🏫</span>
            <div class="text-block">
              <h2>The Neighbourhood School</h2>
              <p class="sub">What is this? <strong>"It is a school."</strong> • <strong>"There is a school."</strong></p>
            </div>
          </div>
          <button class="school-bell-btn" onclick="window.app.ringSchoolBell()">
            🔔 Ring Bell!
          </button>
        </div>

        <!-- School Classroom Stage -->
        <div class="school-classroom-stage">
          <!-- Big Chalkboard in Center -->
          <div class="chalkboard-frame">
            <div class="chalkboard-content">
              <span class="chalk-title">🏫 Our School</span>
              <p class="chalk-sub">Is there a school in your neighbourhood?</p>
              <div class="chalk-target-sentence">"There is a school."</div>
              <div class="chalk-icons">📚 ✏️ 🎨 📐 🍎</div>
            </div>
          </div>

          <!-- Classroom Characters & Objects -->
          <div class="classroom-interactive-grid">
            <!-- Teacher -->
            <div class="class-card clickable-item" onclick="window.app.handleSchoolItem('teacher', 'Teacher', 'Good morning, class! Welcome to school!')">
              <div class="card-avatar">👩‍🏫</div>
              <div class="card-name">TEACHER</div>
              <span class="tap-hint">Tap to greet!</span>
            </div>

            <!-- Students -->
            <div class="class-card clickable-item" onclick="window.app.handleSchoolItem('students', 'Students', 'We learn English together every day.')">
              <div class="card-avatar">🧑‍🎓 👧</div>
              <div class="card-name">STUDENTS</div>
              <span class="tap-hint">Tap to meet!</span>
            </div>

            <!-- Books & Desks -->
            <div class="class-card clickable-item" onclick="window.app.handleSchoolItem('books', 'Story Books', 'There are colourful story books and desks.')">
              <div class="card-avatar">📚 🪑</div>
              <div class="card-name">BOOKS & DESKS</div>
              <span class="tap-hint">Tap to explore!</span>
            </div>
          </div>
        </div>

        <!-- Sentence Footer -->
        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="school-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text" id="school-speech-text">What is this place? "There is a school."</span>
          </div>
          <button class="action-play-btn" onclick="window.app.speakCurrent('school-speech-text')">
            🔊 Speak Again
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Renders the Shop & Bakery Scene
   */
  renderShopScene() {
    return `
      <div class="scene-container scene-shop-view">
        <div class="interior-header">
          <div class="interior-title-pill shop-pill">
            <span class="icon">🛒</span>
            <div class="text-block">
              <h2>The Corner Bakery & Shop</h2>
              <p class="sub">What is this place? <strong>"There is a shop."</strong></p>
            </div>
          </div>
          <button class="register-ring-btn" onclick="window.app.ringRegister()">
            💰 Cash Register!
          </button>
        </div>

        <!-- Shop Display Counter -->
        <div class="shop-interior-stage">
          <div class="shop-shelves-grid">
            <!-- Fresh Bread -->
            <div class="shop-item-card clickable-item" onclick="window.app.handleShopItem('bread', 'bread', 'Smell the fresh, warm bread!')">
              <div class="item-emoji">🥖</div>
              <div class="item-label">BREAD</div>
              <div class="item-price">£1.20</div>
            </div>

            <!-- Pastries & Croissants -->
            <div class="shop-item-card clickable-item" onclick="window.app.handleShopItem('croissant', 'pastries', 'Delicious golden croissants!')">
              <div class="item-emoji">🥐</div>
              <div class="item-label">PASTRIES</div>
              <div class="item-price">£1.50</div>
            </div>

            <!-- Fresh Fruit -->
            <div class="shop-item-card clickable-item" onclick="window.app.handleShopItem('fruit', 'fruit', 'Sweet and crisp red apples.')">
              <div class="item-emoji">🍎</div>
              <div class="item-label">APPLES</div>
              <div class="item-price">80p</div>
            </div>

            <!-- Cold Milk -->
            <div class="shop-item-card clickable-item" onclick="window.app.handleShopItem('milk', 'milk', 'Fresh cold milk from the dairy.')">
              <div class="item-emoji">🥛</div>
              <div class="item-label">MILK</div>
              <div class="item-price">£1.00</div>
            </div>

            <!-- Cookies -->
            <div class="shop-item-card clickable-item" onclick="window.app.handleShopItem('cookies', 'cookies', 'Yummy chocolate cookies!')">
              <div class="item-emoji">🍪</div>
              <div class="item-label">COOKIES</div>
              <div class="item-price">90p</div>
            </div>

            <!-- Friendly Shopkeeper -->
            <div class="shop-item-card shopkeeper-card clickable-item" onclick="window.app.handleShopItem('shopkeeper', 'Shopkeeper', 'Hello! Can I help you find something tasty today?')">
              <div class="item-emoji">👨‍🍳</div>
              <div class="item-label">BAKER</div>
              <div class="item-price">👋 Say Hi!</div>
            </div>
          </div>
        </div>

        <!-- Sentence Footer -->
        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="shop-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text" id="shop-speech-text">What is in your neighbourhood? "There is a shop."</span>
          </div>
          <button class="action-play-btn" onclick="window.app.speakCurrent('shop-speech-text')">
            🔊 Speak Again
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Renders Meet the Neighbours Scene
   */
  renderNeighboursScene() {
    return `
      <div class="scene-container scene-neighbours-view">
        <div class="interior-header">
          <div class="interior-title-pill neighbours-pill">
            <span class="icon">👨‍👩‍👧</span>
            <div class="text-block">
              <h2>Meet Our Neighbours</h2>
              <p class="sub">Who are your neighbours? <strong>"My neighbours live next to me. They are a nice family."</strong></p>
            </div>
          </div>
        </div>

        <!-- Family Lawn Stage -->
        <div class="neighbours-family-stage">
          <div class="family-members-row">
            <!-- Dad -->
            <div class="member-card clickable-item" onclick="window.app.handleNeighbourGreeting('Dad', 'Hello there! Nice sunny morning, neighbour!')">
              <div class="member-avatar">👨</div>
              <div class="member-role">DAD</div>
              <div class="member-action">👋 Waves hello</div>
            </div>

            <!-- Mum -->
            <div class="member-card clickable-item" onclick="window.app.handleNeighbourGreeting('Mum', 'Good day! Welcome to our lovely neighbourhood!')">
              <div class="member-avatar">👩</div>
              <div class="member-role">MUM</div>
              <div class="member-action">👋 Welcomes you</div>
            </div>

            <!-- Daughter -->
            <div class="member-card clickable-item" onclick="window.app.handleNeighbourGreeting('Girl', 'Hi! I like to play in the park with my friends!')">
              <div class="member-avatar">👧</div>
              <div class="member-role">DAUGHTER</div>
              <div class="member-action">🎈 Says hello</div>
            </div>

            <!-- Son on Bike -->
            <div class="member-card clickable-item" onclick="window.app.handleNeighbourGreeting('Boy', 'Watch me ride my bicycle down the street! Vroom!')">
              <div class="member-avatar">👦🚲</div>
              <div class="member-role">SON</div>
              <div class="member-action">🚲 Rides bike</div>
            </div>

            <!-- Family Dog -->
            <div class="member-card clickable-item" onclick="window.app.handleNeighbourGreeting('Dog', 'Woof woof! I am the friendly neighbourhood dog!')">
              <div class="member-avatar">🐕</div>
              <div class="member-role">PET DOG</div>
              <div class="member-action">🐾 Wags tail</div>
            </div>
          </div>
        </div>

        <!-- Sentence Footer -->
        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="neighbours-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text" id="neighbours-speech-text">Who are your neighbours? "My neighbours live next to me. They are a nice family."</span>
          </div>
          <button class="action-play-btn" onclick="window.app.speakCurrent('neighbours-speech-text')">
            🔊 Speak Again
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Renders the "Build Your Neighbourhood" Canvas & Palette
   */
  renderBuildMap(gridSlots, selectedPaletteItem) {
    const palette = [
      { type: 'house', icon: '🏠', label: 'House' },
      { type: 'park', icon: '🌳', label: 'Park' },
      { type: 'school', icon: '🏫', label: 'School' },
      { type: 'shop', icon: '🛒', label: 'Shop' },
      { type: 'tree', icon: '🌲', label: 'Tree' },
      { type: 'car', icon: '🚗', label: 'Car' }
    ];

    let slotsHtml = '';
    for (let i = 0; i < 6; i++) {
      const item = gridSlots[i];
      slotsHtml += `
        <div class="build-plot ${item ? 'occupied' : 'empty'}" onclick="window.app.handlePlotClick(${i})">
          <div class="plot-number">Plot ${i + 1}</div>
          ${item ? `
            <div class="placed-item">
              <span class="placed-icon">${item.icon}</span>
              <span class="placed-label">${item.label}</span>
            </div>
          ` : `
            <div class="empty-placeholder">
              <span>➕ Tap to place</span>
            </div>
          `}
        </div>
      `;
    }

    return `
      <div class="scene-container scene-builder-view">
        <div class="interior-header">
          <div class="interior-title-pill build-pill">
            <span class="icon">🏗️</span>
            <div class="text-block">
              <h2>Build Your Neighbourhood!</h2>
              <p class="sub">Choose an item from the tray, then tap an empty plot to place it.</p>
            </div>
          </div>
          <button class="clear-build-btn" onclick="window.app.resetBuildGrid()">
            🔄 Reset Plots
          </button>
        </div>

        <!-- Palette Selector -->
        <div class="builder-palette-bar">
          <span class="palette-label">Choose Item:</span>
          <div class="palette-items">
            ${palette.map(p => `
              <button class="palette-btn ${selectedPaletteItem === p.type ? 'active' : ''}" onclick="window.app.selectPaletteItem('${p.type}')">
                <span class="btn-icon">${p.icon}</span>
                <span class="btn-text">${p.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 6-Plot Town Grid -->
        <div class="builder-town-grid">
          ${slotsHtml}
        </div>

        <!-- Generated Sentence Description -->
        <div class="sentence-action-footer">
          <div class="speech-result-bubble" id="build-speech-bubble">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text" id="build-speech-text">What is in your neighbourhood? Place items to describe your town!</span>
          </div>
          <button class="action-play-btn" onclick="window.app.speakCurrent('build-speech-text')">
            🔊 Speak Town
          </button>
          <button class="action-next-btn" onclick="window.app.exitToMap()">
            🗺️ Back to Map
          </button>
        </div>
      </div>
    `;
  }
};

window.Scenes = Scenes;
