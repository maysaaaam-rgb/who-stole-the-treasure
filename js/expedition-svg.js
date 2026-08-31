/**
 * THE LAST EXPEDITION: VECTOR SVG ASSET GENERATOR
 * Generates custom cartoon vector illustrations for all 10 scenes,
 * 4 explorer avatars, CLIL science diagrams, and the island map.
 */

const EXPEDITION_SVG = {
  // 1. Full Island Overview Scene Map
  getIslandMapSvg(currentSceneNum = 1) {
    return `
      <svg width="100%" height="100%" viewBox="0 0 920 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="expedition-scene-svg">
        <!-- Ocean Background -->
        <rect x="0" y="0" width="920" height="480" fill="#38bdf8"/>
        <!-- Ocean Waves -->
        <path d="M40 80 Q60 60 80 80 Q100 100 120 80" stroke="#bae6fd" stroke-width="3" fill="none"/>
        <path d="M780 400 Q800 380 820 400 Q840 420 860 400" stroke="#bae6fd" stroke-width="3" fill="none"/>

        <!-- Main Island Terrain -->
        <path d="M100 380 C120 200 240 100 480 90 C700 80 840 220 820 380 C800 460 200 460 100 380 Z" fill="#86efac" stroke="#16a34a" stroke-width="6"/>

        <!-- Sandy Beach Perimeter -->
        <path d="M120 370 C140 220 250 120 480 110 C680 100 800 230 780 370 C760 440 220 440 120 370 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <path d="M160 350 C180 240 280 140 480 130 C660 120 760 240 740 350 C720 410 240 410 160 350 Z" fill="#4ade80"/>

        <!-- 1. Beach Basecamp (Scene 1) -->
        <g transform="translate(180, 360)">
          <polygon points="0,0 25,-30 50,0" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
          <text x="25" y="16" font-family="'Bungee', cursive" font-size="10" fill="#7c2d12" text-anchor="middle">1. BEACH</text>
        </g>

        <!-- 2. Stone Cave (Scene 2 & 3) -->
        <g transform="translate(300, 270)">
          <path d="M0,20 C10,-20 50,-20 60,20 Z" fill="#64748b" stroke="#334155" stroke-width="3"/>
          <ellipse cx="30" cy="20" rx="14" ry="12" fill="#0f172a"/>
          <text x="30" y="36" font-family="'Bungee', cursive" font-size="10" fill="#1e293b" text-anchor="middle">2. CAVE</text>
        </g>

        <!-- 3. Swelling River Gorge (Scene 4 & 5) -->
        <path d="M480 130 Q440 240 420 410" stroke="#0284c7" stroke-width="24" stroke-linecap="round" fill="none"/>
        <path d="M480 130 Q440 240 420 410" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" fill="none"/>
        <!-- Broken Bridge -->
        <g transform="translate(420, 270)">
          <rect x="-10" y="0" width="16" height="8" fill="#78350f"/>
          <rect x="25" y="0" width="16" height="8" fill="#78350f"/>
          <text x="15" y="24" font-family="'Bungee', cursive" font-size="9" fill="#0369a1" text-anchor="middle">3. RIVER</text>
        </g>

        <!-- 4. Rainforest Canopy (Scene 6 & 7) -->
        <g transform="translate(540, 290)">
          <circle cx="0" cy="0" r="28" fill="#15803d"/>
          <circle cx="25" cy="-10" r="24" fill="#16a34a"/>
          <circle cx="45" cy="10" r="22" fill="#15803d"/>
          <text x="25" y="32" font-family="'Bungee', cursive" font-size="10" fill="#14532d" text-anchor="middle">4. FOREST</text>
        </g>

        <!-- 5. Active Volcano (Scene 8 & 9) -->
        <g transform="translate(680, 180)">
          <polygon points="0,60 45,-20 90,60" fill="#78350f" stroke="#451a03" stroke-width="3"/>
          <polygon points="35,-2 45,-20 55,-2" fill="#dc2626"/>
          <!-- Smoke Plumes -->
          <circle cx="45" cy="-35" r="14" fill="#94a3b8" fill-opacity="0.7"/>
          <circle cx="55" cy="-55" r="18" fill="#64748b" fill-opacity="0.8"/>
          <text x="45" y="78" font-family="'Bungee', cursive" font-size="10" fill="#451a03" text-anchor="middle">5. VOLCANO</text>
        </g>

        <!-- 6. Research Station Alpha (Scene 10) -->
        <g transform="translate(480, 100)">
          <rect x="-30" y="-20" width="60" height="35" rx="6" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
          <polygon points="-30,-20 0,-40 30,-20" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2"/>
          <circle cx="0" cy="-6" r="6" fill="#facc15"/>
          <text x="0" y="28" font-family="'Bungee', cursive" font-size="10" fill="#1e3a8a" text-anchor="middle">STATION ALPHA 🏛️</text>
        </g>

        <!-- Approaching Storm Clouds in Top-Left Corner -->
        <g transform="translate(80, 40)" class="storm-cloud-group">
          <circle cx="0" cy="0" r="35" fill="#475569"/>
          <circle cx="35" cy="-10" r="45" fill="#334155"/>
          <circle cx="75" cy="5" r="38" fill="#1e293b"/>
          <!-- Raindrops -->
          <line x1="10" y1="45" x2="0" y2="70" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
          <line x1="40" y1="45" x2="30" y2="70" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
          <line x1="70" y1="45" x2="60" y2="70" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
          <!-- Lightning Bolt -->
          <polygon points="50,45 35,75 45,75 30,105 60,65 48,65" fill="#facc15"/>
        </g>

        <!-- Active Explorer Position Indicator -->
        <g transform="translate(${this.getCoordinatesForScene(currentSceneNum).x}, ${this.getCoordinatesForScene(currentSceneNum).y})" class="expedition-token">
          <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#fff" stroke-width="4"/>
          <text x="0" y="6" font-size="18" text-anchor="middle">🧭</text>
        </g>
      </svg>
    `;
  },

  getCoordinatesForScene(sceneNum) {
    switch (sceneNum) {
      case 1: return { x: 205, y: 345 };
      case 2:
      case 3: return { x: 330, y: 285 };
      case 4:
      case 5: return { x: 435, y: 275 };
      case 6:
      case 7: return { x: 565, y: 285 };
      case 8:
      case 9: return { x: 725, y: 215 };
      case 10: return { x: 480, y: 95 };
      default: return { x: 205, y: 345 };
    }
  },

  // 2. Hydrology Cause and Effect Diagram (Scene 4)
  getHydrologyDiagramSvg() {
    return `
      <svg width="100%" height="220" viewBox="0 0 800 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="science-diagram-svg">
        <rect x="10" y="10" width="170" height="200" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
        <text x="95" y="45" font-family="'Bungee', cursive" font-size="12" fill="#1e40af" text-anchor="middle">1. HEAVY RAIN</text>
        <circle cx="95" cy="95" r="30" fill="#bfdbfe"/>
        <text x="95" y="105" font-size="28" text-anchor="middle">⛈️</text>
        <text x="95" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle">Rain pours from clouds</text>

        <text x="200" y="115" font-family="'Bungee', cursive" font-size="20" fill="#3b82f6">➔</text>

        <rect x="230" y="10" width="170" height="200" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
        <text x="315" y="45" font-family="'Bungee', cursive" font-size="12" fill="#1e40af" text-anchor="middle">2. RUNOFF</text>
        <circle cx="315" cy="95" r="30" fill="#bfdbfe"/>
        <text x="315" y="105" font-size="28" text-anchor="middle">⛰️ 🌧️</text>
        <text x="315" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle">Water rushes downhill</text>

        <text x="420" y="115" font-family="'Bungee', cursive" font-size="20" fill="#3b82f6">➔</text>

        <rect x="450" y="10" width="170" height="200" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
        <text x="535" y="45" font-family="'Bungee', cursive" font-size="12" fill="#1e40af" text-anchor="middle">3. RIVER RISES</text>
        <circle cx="535" cy="95" r="30" fill="#bfdbfe"/>
        <text x="535" y="105" font-size="28" text-anchor="middle">🌊 ⬆️</text>
        <text x="535" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle">Water depth increases</text>

        <text x="640" y="115" font-family="'Bungee', cursive" font-size="20" fill="#dc2626">➔</text>

        <rect x="670" y="10" width="120" height="200" rx="10" fill="#fee2e2" stroke="#dc2626" stroke-width="3"/>
        <text x="730" y="45" font-family="'Bungee', cursive" font-size="12" fill="#991b1b" text-anchor="middle">4. FLOOD!</text>
        <circle cx="730" cy="95" r="30" fill="#fecaca"/>
        <text x="730" y="105" font-size="28" text-anchor="middle">🚨 🌊</text>
        <text x="730" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#991b1b" text-anchor="middle">Banks overflow</text>
      </svg>
    `;
  },

  // 3. Volcano Cross-Section Diagram: Magma vs Lava (Scene 8)
  getVolcanoCrossSectionSvg() {
    return `
      <svg width="100%" height="260" viewBox="0 0 750 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="science-diagram-svg">
        <rect x="0" y="0" width="750" height="260" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="4"/>
        
        <!-- Volcano Mountain Body -->
        <polygon points="120,240 375,50 630,240" fill="#78350f" stroke="#451a03" stroke-width="4"/>
        
        <!-- Underground Magma Chamber -->
        <ellipse cx="375" cy="220" rx="90" ry="30" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
        <text x="375" y="225" font-family="'Bungee', cursive" font-size="14" fill="#fef08a" text-anchor="middle">MAGMA CHAMBER</text>
        <text x="375" y="244" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">(Underground melted rock)</text>

        <!-- Vertical Conduit / Vent -->
        <rect x="360" y="50" width="30" height="150" fill="#ea580c"/>

        <!-- Surface Crater Lava -->
        <polygon points="360,50 375,30 390,50" fill="#fbbf24"/>
        <path d="M360 50 Q330 110 310 180" stroke="#f97316" stroke-width="12" stroke-linecap="round" fill="none"/>
        <text x="270" y="120" font-family="'Bungee', cursive" font-size="14" fill="#ea580c">LAVA</text>
        <text x="270" y="140" font-family="'Fredoka', sans-serif" font-size="10" font-weight="800" fill="#78350f">(On surface)</text>

        <!-- Smoke Column -->
        <circle cx="375" cy="10" r="16" fill="#94a3b8" fill-opacity="0.8"/>
        <circle cx="395" cy="-10" r="22" fill="#64748b" fill-opacity="0.9"/>
        <text x="440" y="20" font-family="'Bungee', cursive" font-size="13" fill="#475569">GAS & SMOKE</text>
      </svg>
    `;
  },

  // 4. Explorer Character Avatars
  getExplorerAvatarSvg(avatarClass, size = 80) {
    let hatColor = "#ea580c";
    let shirtColor = "#2563eb";
    let isGirl = false;

    if (avatarClass === "avatar-exp-maya") {
      isGirl = true;
      hatColor = "#0284c7";
      shirtColor = "#0284c7";
    } else if (avatarClass === "avatar-exp-leo") {
      isGirl = false;
      hatColor = "#dc2626";
      shirtColor = "#dc2626";
    } else if (avatarClass === "avatar-exp-emma") {
      isGirl = true;
      hatColor = "#059669";
      shirtColor = "#059669";
    } else if (avatarClass === "avatar-exp-noah") {
      isGirl = false;
      hatColor = "#d97706";
      shirtColor = "#d97706";
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="explorer-avatar-svg">
        <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <!-- Shirt & Vest -->
        <path d="M22 92 C22 72 35 64 50 64 C65 64 78 72 78 92 Z" fill="${shirtColor}"/>
        <!-- Explorer Vest Straps -->
        <rect x="34" y="65" width="8" height="28" fill="#ca8a04"/>
        <rect x="58" y="65" width="8" height="28" fill="#ca8a04"/>
        <!-- Head -->
        <rect x="44" y="50" width="12" height="16" fill="#fed7aa"/>
        <circle cx="50" cy="40" r="20" fill="#fed7aa"/>
        <!-- Eyes & Smile -->
        <circle cx="43" cy="38" r="2.5" fill="#1e293b"/>
        <circle cx="57" cy="38" r="2.5" fill="#1e293b"/>
        <path d="M45 46 Q50 50 55 46" stroke="#78350f" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Explorer Hat -->
        <path d="M26 30 C26 18 74 18 74 30 Z" fill="${hatColor}" stroke="#78350f" stroke-width="2"/>
        <ellipse cx="50" cy="30" rx="34" ry="6" fill="${hatColor}" stroke="#78350f" stroke-width="2"/>
      </svg>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXPEDITION_SVG;
}
