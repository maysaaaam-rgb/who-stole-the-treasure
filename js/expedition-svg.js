/**
 * THE LAST EXPEDITION: VECTOR SVG ASSET GENERATOR
 * High-visual, cartoon-style illustrations and diagrams for Grade 4 learners.
 */

const EXPEDITION_SVG = {
  // 1. Full Island Overview Scene Map with Big Visual Landmarks
  getIslandMapSvg(currentSceneNum = 1) {
    return `
      <svg width="100%" height="100%" viewBox="0 0 920 440" fill="none" xmlns="http://www.w3.org/2000/svg" class="expedition-scene-svg">
        <!-- Ocean Background -->
        <rect x="0" y="0" width="920" height="440" fill="#38bdf8"/>
        <!-- Ocean Waves -->
        <path d="M40 70 Q60 50 80 70 Q100 90 120 70" stroke="#bae6fd" stroke-width="4" fill="none"/>
        <path d="M780 370 Q800 350 820 370 Q840 390 860 370" stroke="#bae6fd" stroke-width="4" fill="none"/>

        <!-- Main Island Terrain -->
        <path d="M90 350 C110 180 230 80 470 70 C690 60 830 190 810 350 C790 430 190 430 90 350 Z" fill="#86efac" stroke="#16a34a" stroke-width="6"/>

        <!-- Sandy Beach Shoreline -->
        <path d="M110 340 C130 190 240 90 470 80 C670 70 790 200 770 340 C750 410 210 410 110 340 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <path d="M150 320 C170 210 270 110 470 100 C650 90 750 210 730 320 C710 380 230 380 150 320 Z" fill="#4ade80"/>

        <!-- 1. Beach Basecamp (Scene 1) -->
        <g transform="translate(170, 320)">
          <polygon points="0,0 25,-30 50,0" fill="#f97316" stroke="#c2410c" stroke-width="3"/>
          <text x="25" y="16" font-family="'Bungee', cursive" font-size="12" fill="#7c2d12" text-anchor="middle">1. BEACH 🏖️</text>
        </g>

        <!-- 2. Stone Cave (Scene 2 & 3) -->
        <g transform="translate(290, 240)">
          <path d="M0,25 C10,-25 60,-25 70,25 Z" fill="#64748b" stroke="#334155" stroke-width="4"/>
          <ellipse cx="35" cy="22" rx="18" ry="14" fill="#0f172a"/>
          <text x="35" y="44" font-family="'Bungee', cursive" font-size="12" fill="#1e293b" text-anchor="middle">2. CAVE 🕳️</text>
        </g>

        <!-- 3. High River Gorge (Scene 4 & 5) -->
        <path d="M470 100 Q430 220 410 380" stroke="#0284c7" stroke-width="30" stroke-linecap="round" fill="none"/>
        <path d="M470 100 Q430 220 410 380" stroke="#38bdf8" stroke-width="16" stroke-linecap="round" fill="none"/>
        <!-- Broken Bridge with big Red X -->
        <g transform="translate(410, 240)">
          <rect x="-14" y="0" width="18" height="10" fill="#78350f"/>
          <rect x="25" y="0" width="18" height="10" fill="#78350f"/>
          <text x="14" y="10" font-size="20" text-anchor="middle" fill="#ef4444">❌</text>
          <text x="14" y="28" font-family="'Bungee', cursive" font-size="11" fill="#0369a1" text-anchor="middle">3. RIVER 🌊</text>
        </g>

        <!-- 4. Rainforest Canopy (Scene 6 & 7) -->
        <g transform="translate(540, 260)">
          <circle cx="0" cy="0" r="32" fill="#15803d"/>
          <circle cx="30" cy="-12" r="28" fill="#16a34a"/>
          <circle cx="50" cy="12" r="26" fill="#15803d"/>
          <text x="28" y="38" font-family="'Bungee', cursive" font-size="12" fill="#14532d" text-anchor="middle">4. FOREST 🌲</text>
        </g>

        <!-- 5. Active Volcano (Scene 8 & 9) -->
        <g transform="translate(680, 160)">
          <polygon points="0,70 50,-20 100,70" fill="#78350f" stroke="#451a03" stroke-width="4"/>
          <polygon points="40,-2 50,-20 60,-2" fill="#dc2626"/>
          <!-- Smoke Plumes -->
          <circle cx="50" cy="-35" r="16" fill="#94a3b8" fill-opacity="0.8"/>
          <circle cx="62" cy="-58" r="20" fill="#64748b" fill-opacity="0.9"/>
          <text x="50" y="90" font-family="'Bungee', cursive" font-size="12" fill="#451a03" text-anchor="middle">5. VOLCANO 🌋</text>
        </g>

        <!-- 6. Research Station Alpha (Scene 10) -->
        <g transform="translate(470, 75)">
          <rect x="-35" y="-20" width="70" height="38" rx="8" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
          <polygon points="-35,-20 0,-42 35,-20" fill="#3b82f6" stroke="#1e3a8a" stroke-width="3"/>
          <circle cx="0" cy="-4" r="7" fill="#facc15"/>
          <text x="0" y="32" font-family="'Bungee', cursive" font-size="12" fill="#1e3a8a" text-anchor="middle">STATION ALPHA 🏛️</text>
        </g>

        <!-- Approaching Storm Clouds in Top-Left Corner -->
        <g transform="translate(75, 35)" class="storm-cloud-group">
          <circle cx="0" cy="0" r="38" fill="#475569"/>
          <circle cx="40" cy="-12" r="48" fill="#334155"/>
          <circle cx="85" cy="5" r="40" fill="#1e293b"/>
          <!-- Raindrops -->
          <line x1="10" y1="50" x2="0" y2="78" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
          <line x1="45" y1="50" x2="35" y2="78" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
          <line x1="80" y1="50" x2="70" y2="78" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
          <!-- Lightning Bolt -->
          <polygon points="55,50 38,82 50,82 32,115 68,72 54,72" fill="#facc15"/>
        </g>

        <!-- Active Explorer Position Token -->
        <g transform="translate(${this.getCoordinatesForScene(currentSceneNum).x}, ${this.getCoordinatesForScene(currentSceneNum).y})" class="expedition-token">
          <circle cx="0" cy="0" r="26" fill="#ef4444" stroke="#fff" stroke-width="5"/>
          <text x="0" y="8" font-size="22" text-anchor="middle">🧭</text>
        </g>
      </svg>
    `;
  },

  getCoordinatesForScene(sceneNum) {
    switch (sceneNum) {
      case 1: return { x: 195, y: 305 };
      case 2:
      case 3: return { x: 325, y: 255 };
      case 4:
      case 5: return { x: 425, y: 245 };
      case 6:
      case 7: return { x: 568, y: 255 };
      case 8:
      case 9: return { x: 730, y: 195 };
      case 10: return { x: 470, y: 70 };
      default: return { x: 195, y: 305 };
    }
  },

  // 2. Hydrology Cause and Effect Visual Diagram (Scene 4)
  getHydrologyDiagramSvg() {
    return `
      <svg width="100%" height="180" viewBox="0 0 800 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="science-diagram-svg">
        <!-- Step 1: More Rain -->
        <rect x="10" y="10" width="160" height="160" rx="14" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
        <text x="90" y="38" font-family="'Bungee', cursive" font-size="14" fill="#1e40af" text-anchor="middle">1. RAIN 🌧️</text>
        <circle cx="90" cy="85" r="32" fill="#bfdbfe"/>
        <text x="90" y="96" font-size="34" text-anchor="middle">⛈️</text>
        <text x="90" y="145" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#1e3a8a" text-anchor="middle">More Rain</text>

        <!-- Arrow -->
        <text x="195" y="95" font-family="'Bungee', cursive" font-size="28" fill="#3b82f6" text-anchor="middle">➔</text>

        <!-- Step 2: More Water -->
        <rect x="220" y="10" width="160" height="160" rx="14" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
        <text x="300" y="38" font-family="'Bungee', cursive" font-size="14" fill="#1e40af" text-anchor="middle">2. WATER 💧</text>
        <circle cx="300" cy="85" r="32" fill="#bfdbfe"/>
        <text x="300" y="96" font-size="34" text-anchor="middle">💧💧💧</text>
        <text x="300" y="145" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#1e3a8a" text-anchor="middle">More Water</text>

        <!-- Arrow -->
        <text x="405" y="95" font-family="'Bungee', cursive" font-size="28" fill="#3b82f6" text-anchor="middle">➔</text>

        <!-- Step 3: River Rises -->
        <rect x="430" y="10" width="160" height="160" rx="14" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
        <text x="510" y="38" font-family="'Bungee', cursive" font-size="14" fill="#1e40af" text-anchor="middle">3. RISES 🌊</text>
        <circle cx="510" cy="85" r="32" fill="#bfdbfe"/>
        <text x="510" y="96" font-size="34" text-anchor="middle">🌊 ⬆️</text>
        <text x="510" y="145" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#1e3a8a" text-anchor="middle">River Rises</text>

        <!-- Arrow -->
        <text x="615" y="95" font-family="'Bungee', cursive" font-size="28" fill="#dc2626" text-anchor="middle">➔</text>

        <!-- Step 4: Flood -->
        <rect x="640" y="10" width="150" height="160" rx="14" fill="#fee2e2" stroke="#dc2626" stroke-width="4"/>
        <text x="715" y="38" font-family="'Bungee', cursive" font-size="14" fill="#991b1b" text-anchor="middle">4. FLOOD 🚨</text>
        <circle cx="715" cy="85" r="32" fill="#fecaca"/>
        <text x="715" y="96" font-size="34" text-anchor="middle">🌊 ⚠️</text>
        <text x="715" y="145" font-family="'Fredoka', sans-serif" font-size="14" font-weight="900" fill="#991b1b" text-anchor="middle">FLOODING!</text>
      </svg>
    `;
  },

  // 3. Volcano Cross-Section: Magma vs Lava (Scene 8)
  getVolcanoCrossSectionSvg() {
    return `
      <svg width="100%" height="240" viewBox="0 0 750 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="science-diagram-svg">
        <rect x="0" y="0" width="750" height="240" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="4"/>
        
        <!-- Mountain -->
        <polygon points="100,220 375,40 650,220" fill="#78350f" stroke="#451a03" stroke-width="4"/>
        
        <!-- Magma Chamber Under Ground -->
        <ellipse cx="375" cy="200" rx="90" ry="30" fill="#dc2626" stroke="#991b1b" stroke-width="4"/>
        <text x="375" y="202" font-family="'Bungee', cursive" font-size="16" fill="#fef08a" text-anchor="middle">🔥 MAGMA 🔥</text>
        <text x="375" y="222" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">UNDER THE GROUND 🪨</text>

        <!-- Vertical Vent -->
        <rect x="360" y="40" width="30" height="140" fill="#ea580c"/>

        <!-- Surface Lava -->
        <polygon points="360,40 375,20 390,40" fill="#fbbf24"/>
        <path d="M360 40 Q330 90 300 160" stroke="#f97316" stroke-width="14" stroke-linecap="round" fill="none"/>
        <text x="250" y="100" font-family="'Bungee', cursive" font-size="16" fill="#ea580c">🔥 LAVA</text>
        <text x="250" y="120" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#78350f">COMES OUT 🌋</text>

        <!-- Smoke -->
        <circle cx="375" cy="5" r="16" fill="#94a3b8" fill-opacity="0.8"/>
        <circle cx="395" cy="-12" r="22" fill="#64748b" fill-opacity="0.9"/>
        <text x="440" y="20" font-family="'Bungee', cursive" font-size="14" fill="#475569">💨 SMOKE</text>
      </svg>
    `;
  },

  // 4. Explorer Character Avatars
  getExplorerAvatarSvg(avatarClass, size = 70) {
    let hatColor = "#ea580c";
    let shirtColor = "#2563eb";

    if (avatarClass === "avatar-exp-maya") {
      hatColor = "#0284c7";
      shirtColor = "#0284c7";
    } else if (avatarClass === "avatar-exp-leo") {
      hatColor = "#dc2626";
      shirtColor = "#dc2626";
    } else if (avatarClass === "avatar-exp-emma") {
      hatColor = "#059669";
      shirtColor = "#059669";
    } else if (avatarClass === "avatar-exp-noah") {
      hatColor = "#d97706";
      shirtColor = "#d97706";
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="explorer-avatar-svg">
        <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <path d="M22 92 C22 72 35 64 50 64 C65 64 78 72 78 92 Z" fill="${shirtColor}"/>
        <rect x="34" y="65" width="8" height="28" fill="#ca8a04"/>
        <rect x="58" y="65" width="8" height="28" fill="#ca8a04"/>
        <rect x="44" y="50" width="12" height="16" fill="#fed7aa"/>
        <circle cx="50" cy="40" r="20" fill="#fed7aa"/>
        <circle cx="43" cy="38" r="2.5" fill="#1e293b"/>
        <circle cx="57" cy="38" r="2.5" fill="#1e293b"/>
        <path d="M45 46 Q50 50 55 46" stroke="#78350f" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M26 30 C26 18 74 18 74 30 Z" fill="${hatColor}" stroke="#78350f" stroke-width="2"/>
        <ellipse cx="50" cy="30" rx="34" ry="6" fill="${hatColor}" stroke="#78350f" stroke-width="2"/>
      </svg>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXPEDITION_SVG;
}
