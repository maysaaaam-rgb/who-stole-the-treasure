/**
 * CLIL CRIME LAB: VECTOR SVG ASSET GENERATOR
 * Generates custom cartoon vector illustrations for all 4 crime scenes,
 * evidence badges, suspect portraits, and interactive objects.
 */

const CLIL_SVG = {
  // Case File Dossier Badges
  getCaseBadgeSvg(caseId, size = 90) {
    switch (caseId) {
      case "red":
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="#fee2e2" stroke="#dc2626" stroke-width="4"/>
            <!-- Trophy -->
            <path d="M32 28 L68 28 L64 52 C64 60 56 66 50 66 C44 66 36 60 36 52 Z" fill="#facc15" stroke="#854d0e" stroke-width="3"/>
            <!-- Handles -->
            <path d="M34 34 C24 34 24 46 36 48" stroke="#854d0e" stroke-width="3" fill="none"/>
            <path d="M66 34 C76 34 76 46 64 48" stroke="#854d0e" stroke-width="3" fill="none"/>
            <!-- Stem & Base -->
            <rect x="46" y="66" width="8" height="10" fill="#eab308"/>
            <rect x="34" y="76" width="32" height="8" rx="2" fill="#78350f"/>
            <!-- Clock Overlay -->
            <circle cx="72" cy="72" r="16" fill="#fff" stroke="#dc2626" stroke-width="2.5"/>
            <line x1="72" y1="72" x2="72" y2="62" stroke="#1e293b" stroke-width="2"/>
            <line x1="72" y1="72" x2="80" y2="72" stroke="#dc2626" stroke-width="2"/>
          </svg>
        `;
      case "blue":
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/>
            <!-- Flask -->
            <path d="M44 24 L56 24 L56 36 L70 68 C72 74 68 80 60 80 L40 80 C32 80 28 74 30 68 L44 36 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="3"/>
            <!-- Bubbles / Liquid -->
            <path d="M33 72 Q50 66 67 72 L60 80 L40 80 Z" fill="#3b82f6"/>
            <circle cx="48" cy="55" r="3" fill="#fff"/>
            <circle cx="54" cy="62" r="2" fill="#fff"/>
            <!-- Ice to Steam Motif -->
            <rect x="18" y="22" width="14" height="14" rx="2" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
            <!-- Flame -->
            <path d="M74 36 C74 30 80 22 80 22 C80 22 86 30 86 36 C86 40 82 44 80 44 C78 44 74 40 74 36 Z" fill="#f97316"/>
          </svg>
        `;
      case "green":
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="#d1fae5" stroke="#059669" stroke-width="4"/>
            <!-- Palette -->
            <path d="M22 55 C22 35 40 22 60 24 C75 26 84 38 78 52 C74 60 62 62 60 70 C58 78 46 82 36 78 C26 74 22 65 22 55 Z" fill="#fef08a" stroke="#78350f" stroke-width="3"/>
            <circle cx="64" cy="62" r="5" fill="#fff" stroke="#78350f" stroke-width="1.5"/>
            <!-- Color Blobs -->
            <circle cx="40" cy="34" r="5" fill="#dc2626"/>
            <circle cx="55" cy="34" r="5" fill="#2563eb"/>
            <circle cx="34" cy="50" r="5" fill="#eab308"/>
            <circle cx="46" cy="65" r="6" fill="#9333ea"/>
            <!-- Brush Crossing -->
            <line x1="72" y1="20" x2="35" y2="75" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
            <polygon points="35,75 28,82 32,70" fill="#9333ea"/>
          </svg>
        `;
      case "yellow":
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="#fef9c3" stroke="#ca8a04" stroke-width="4"/>
            <!-- Compass Dial -->
            <circle cx="50" cy="50" r="30" fill="#fff" stroke="#713f12" stroke-width="3"/>
            <!-- Compass Star -->
            <polygon points="50,26 55,46 50,44 45,46" fill="#dc2626"/>
            <polygon points="50,74 55,54 50,56 45,54" fill="#64748b"/>
            <polygon points="74,50 54,55 56,50 54,45" fill="#64748b"/>
            <polygon points="26,50 46,55 44,50 46,45" fill="#64748b"/>
            <circle cx="50" cy="50" r="4" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
            <!-- Letters -->
            <text x="50" y="22" font-family="'Bungee', cursive" font-size="10" font-weight="900" fill="#dc2626" text-anchor="middle">N</text>
            <text x="82" y="53" font-family="'Bungee', cursive" font-size="9" font-weight="900" fill="#713f12" text-anchor="middle">E</text>
            <text x="50" y="85" font-family="'Bungee', cursive" font-size="9" font-weight="900" fill="#713f12" text-anchor="middle">S</text>
            <text x="18" y="53" font-family="'Bungee', cursive" font-size="9" font-weight="900" fill="#713f12" text-anchor="middle">W</text>
          </svg>
        `;
    }
  },

  // 1. Case Red Crime Scene: Sports Room
  getSportsRoomSceneSvg() {
    return `
      <svg width="100%" height="100%" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="crime-scene-svg">
        <!-- Room Walls & Floor -->
        <rect x="0" y="0" width="900" height="280" fill="url(#sportsWallGrad)"/>
        <rect x="0" y="280" width="900" height="200" fill="url(#sportsFloorGrad)"/>
        <!-- Floor Markings (Gym court lines) -->
        <line x1="0" y1="360" x2="900" y2="360" stroke="#fde047" stroke-width="6" stroke-opacity="0.6"/>
        <ellipse cx="450" cy="400" rx="140" ry="50" stroke="#fde047" stroke-width="5" stroke-opacity="0.5" fill="none"/>

        <!-- Wall Poster: Track Championship -->
        <rect x="220" y="40" width="160" height="100" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
        <rect x="230" y="50" width="140" height="25" fill="#dc2626" rx="4"/>
        <text x="300" y="67" font-family="'Bungee', cursive" font-size="12" fill="#fff" text-anchor="middle">SCHOOL RACE 2026</text>
        <text x="300" y="110" font-family="'Fredoka', sans-serif" font-size="28" fill="#eab308" text-anchor="middle">🏃 🏆 🥇</text>

        <!-- Stopped Wall Clock (3:40 PM) - Interactive Element -->
        <g id="interactive-scene-clock" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('clock')">
          <circle cx="720" cy="90" r="50" fill="#fff" stroke="#dc2626" stroke-width="6"/>
          <circle cx="720" cy="90" r="4" fill="#1e293b"/>
          <!-- Hour Hand at ~3:40 (pointing near 4) -->
          <line x1="720" y1="90" x2="746" y2="108" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
          <!-- Minute Hand at 40 (pointing at 8) -->
          <line x1="720" y1="90" x2="685" y2="110" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
          <text x="720" y="55" font-family="'Bungee', cursive" font-size="10" fill="#64748b" text-anchor="middle">12</text>
          <text x="755" y="94" font-family="'Bungee', cursive" font-size="10" fill="#64748b" text-anchor="middle">3</text>
          <text x="720" y="130" font-family="'Bungee', cursive" font-size="10" fill="#64748b" text-anchor="middle">6</text>
          <text x="685" y="94" font-family="'Bungee', cursive" font-size="10" fill="#64748b" text-anchor="middle">9</text>
          <!-- Alarm Ripple Highlight -->
          <circle cx="720" cy="90" r="58" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 4" class="pulse-ring"/>
        </g>

        <!-- Door on Left -->
        <rect x="40" y="60" width="100" height="220" rx="8" fill="#78350f" stroke="#451a03" stroke-width="5"/>
        <circle cx="125" cy="170" r="6" fill="#facc15" stroke="#854d0e" stroke-width="2"/>

        <!-- Trophy Table in Center -->
        <g id="interactive-scene-table" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('table')">
          <!-- Wooden Table Top -->
          <rect x="360" y="240" width="260" height="30" rx="6" fill="#b45309" stroke="#78350f" stroke-width="4"/>
          <!-- Table Legs -->
          <rect x="380" y="270" width="16" height="110" fill="#78350f"/>
          <rect x="584" y="270" width="16" height="110" fill="#78350f"/>
          <!-- Red Velvet Display Runner -->
          <rect x="420" y="235" width="140" height="15" rx="3" fill="#dc2626"/>
          <!-- Empty Trophy Plaque -->
          <rect x="455" y="215" width="70" height="20" rx="4" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
          <text x="490" y="229" font-family="'Bungee', cursive" font-size="8" fill="#facc15" text-anchor="middle">1ST PRIZE</text>
          <!-- Dotted outline of missing trophy -->
          <path d="M470 140 L510 140 L504 185 C504 195 496 205 490 205 C484 205 476 195 476 185 Z" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 4" fill="rgba(239, 68, 68, 0.1)"/>
        </g>

        <!-- Wet Footprints on Floor - Interactive -->
        <g id="interactive-scene-footprints" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('footprints')">
          <!-- Footprint 1 -->
          <ellipse cx="180" cy="380" rx="14" ry="7" fill="#78350f" fill-opacity="0.7" transform="rotate(25 180 380)"/>
          <circle cx="192" cy="374" r="3" fill="#78350f" fill-opacity="0.7"/>
          <!-- Footprint 2 -->
          <ellipse cx="260" cy="350" rx="14" ry="7" fill="#78350f" fill-opacity="0.7" transform="rotate(35 260 350)"/>
          <circle cx="272" cy="344" r="3" fill="#78350f" fill-opacity="0.7"/>
          <!-- Footprint 3 (near table) -->
          <ellipse cx="360" cy="340" rx="14" ry="7" fill="#78350f" fill-opacity="0.7" transform="rotate(30 360 340)"/>
          <circle cx="372" cy="334" r="3" fill="#78350f" fill-opacity="0.7"/>
          <!-- Water Droplets -->
          <circle cx="390" cy="360" r="4" fill="#38bdf8"/>
          <circle cx="290" cy="370" r="3" fill="#38bdf8"/>
        </g>

        <defs>
          <linearGradient id="sportsWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fee2e2"/>
            <stop offset="100%" stop-color="#fecaca"/>
          </linearGradient>
          <linearGradient id="sportsFloorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#92400e"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  },

  // 2. Case Blue Crime Scene: Science Laboratory
  getScienceLabSceneSvg() {
    return `
      <svg width="100%" height="100%" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="crime-scene-svg">
        <rect x="0" y="0" width="900" height="260" fill="url(#labWallGrad)"/>
        <rect x="0" y="260" width="900" height="220" fill="url(#labFloorGrad)"/>
        
        <!-- Blackboard: Solid -> Liquid -> Gas Diagram -->
        <rect x="180" y="25" width="280" height="120" rx="8" fill="#1e293b" stroke="#475569" stroke-width="6"/>
        <text x="320" y="55" font-family="'Bungee', cursive" font-size="12" fill="#38bdf8" text-anchor="middle">STATES OF MATTER</text>
        <text x="230" y="95" font-family="'Fredoka', sans-serif" font-weight="900" font-size="16" fill="#bae6fd">🧊 SOLID</text>
        <text x="290" y="95" font-family="'Bungee', cursive" font-size="14" fill="#facc15">➔</text>
        <text x="340" y="95" font-family="'Fredoka', sans-serif" font-weight="900" font-size="16" fill="#60a5fa">💧 LIQUID</text>
        <text x="405" y="95" font-family="'Bungee', cursive" font-size="14" fill="#facc15">➔</text>
        <text x="450" y="95" font-family="'Fredoka', sans-serif" font-weight="900" font-size="16" fill="#cbd5e1">💨 GAS</text>

        <!-- Lab Bench Table -->
        <rect x="120" y="220" width="660" height="40" rx="6" fill="#475569" stroke="#1e293b" stroke-width="4"/>
        <rect x="150" y="260" width="30" height="150" fill="#334155"/>
        <rect x="720" y="260" width="30" height="150" fill="#334155"/>

        <!-- 1. Ice Tray (Melted Solid) -->
        <g id="interactive-scene-ice" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('ice_tray')">
          <ellipse cx="240" cy="215" rx="45" ry="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
          <!-- Shrunken Melting Ice Cubes -->
          <rect x="220" y="200" width="18" height="14" rx="2" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5" transform="rotate(10 220 200)"/>
          <rect x="242" y="202" width="16" height="12" rx="2" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5" transform="rotate(-15 242 202)"/>
          <!-- Water Puddle -->
          <ellipse cx="240" cy="218" rx="35" ry="8" fill="#38bdf8" fill-opacity="0.6"/>
        </g>

        <!-- 2. Electric Heater (Active Heat Source ON) -->
        <g id="interactive-scene-heater" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('heater')">
          <rect x="420" y="160" width="70" height="60" rx="8" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
          <circle cx="455" cy="180" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <!-- Flame Graphic -->
          <path d="M455 170 C455 162 462 152 462 152 C462 152 468 162 468 170 C468 175 464 180 460 180 C456 180 455 175 455 170 Z" fill="#ea580c"/>
          <rect x="435" y="205" width="40" height="10" rx="3" fill="#1e293b"/>
          <circle cx="465" cy="210" r="3" fill="#22c55e"/> <!-- Green Power Light -->
          <!-- Steam rising from beaker -->
          <path d="M450 140 Q445 120 455 105 Q465 90 455 75" stroke="#94a3b8" stroke-width="4" stroke-linecap="round" fill="none" stroke-opacity="0.7"/>
          <path d="M465 140 Q475 120 465 105 Q455 90 465 75" stroke="#94a3b8" stroke-width="4" stroke-linecap="round" fill="none" stroke-opacity="0.7"/>
        </g>

        <!-- 3. Wall Lab Thermometer (High Temp) -->
        <g id="interactive-scene-thermometer" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('thermometer')">
          <rect x="680" y="60" width="30" height="130" rx="14" fill="#f8fafc" stroke="#475569" stroke-width="3"/>
          <!-- Glass Tube -->
          <rect x="690" y="70" width="10" height="100" rx="5" fill="#e2e8f0"/>
          <!-- Red Mercury (HIGH - 100°C) -->
          <rect x="691" y="80" width="8" height="90" rx="4" fill="#ef4444"/>
          <circle cx="695" cy="172" r="10" fill="#ef4444"/>
          <line x1="685" y1="80" x2="690" y2="80" stroke="#1e293b" stroke-width="2"/>
          <text x="670" y="84" font-family="'Bungee', cursive" font-size="8" fill="#dc2626">100°C</text>
        </g>

        <!-- 4. Fallen Spilled Flask (Liquid) -->
        <g id="interactive-scene-flask" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('flask')">
          <!-- Knocked over glass flask -->
          <path d="M580 230 L620 210 L635 218 L605 245 Z" fill="#93c5fd" fill-opacity="0.8" stroke="#1e3a8a" stroke-width="2.5"/>
          <!-- Spilled Blue Liquid Puddle -->
          <ellipse cx="630" cy="242" rx="60" ry="12" fill="#2563eb" fill-opacity="0.7"/>
          <circle cx="680" cy="245" r="5" fill="#2563eb" fill-opacity="0.7"/>
        </g>

        <defs>
          <linearGradient id="labWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#eff6ff"/>
            <stop offset="100%" stop-color="#dbeafe"/>
          </linearGradient>
          <linearGradient id="labFloorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#64748b"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  },

  // 3. Case Green Crime Scene: Art Studio Gallery
  getArtStudioSceneSvg() {
    return `
      <svg width="100%" height="100%" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="crime-scene-svg">
        <rect x="0" y="0" width="900" height="280" fill="url(#artWallGrad)"/>
        <rect x="0" y="280" width="900" height="200" fill="url(#artFloorGrad)"/>

        <!-- Other Paintings on Wall (Small & Light) -->
        <rect x="60" y="40" width="110" height="90" rx="4" fill="#fef08a" stroke="#78350f" stroke-width="4"/>
        <circle cx="115" cy="85" r="22" fill="#eab308"/> <!-- Yellow Sun -->
        <text x="115" y="145" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle">Yellow Sun</text>

        <rect x="680" y="40" width="120" height="100" rx="4" fill="#bae6fd" stroke="#78350f" stroke-width="4"/>
        <path d="M700 110 L740 70 L780 110 Z" fill="#0284c7"/> <!-- Blue Mountain -->
        <text x="740" y="155" font-family="'Fredoka', sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle">Blue Lake</text>

        <!-- 1. Empty Easel (Vanished Large Painting) -->
        <g id="interactive-scene-easel" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('empty_easel')">
          <!-- Wooden Easel Frame -->
          <line x1="380" y1="50" x2="330" y2="340" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
          <line x1="380" y1="50" x2="430" y2="340" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
          <line x1="380" y1="50" x2="380" y2="350" stroke="#5c2c08" stroke-width="6"/>
          <rect x="310" y="210" width="140" height="14" rx="3" fill="#b45309"/>
          <!-- Empty Frame Wire Outline -->
          <rect x="290" y="70" width="180" height="135" rx="6" fill="rgba(255,255,255,0.4)" stroke="#ef4444" stroke-width="3" stroke-dasharray="8 6"/>
          <text x="380" y="145" font-family="'Bungee', cursive" font-size="13" fill="#dc2626" text-anchor="middle">MISSING PAINTING!</text>
        </g>

        <!-- 2. Palette with Color Mixing Wells -->
        <g id="interactive-scene-palette" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('paint_palette')">
          <!-- Artist Palette on Stool -->
          <ellipse cx="560" cy="270" rx="65" ry="40" fill="#fde68a" stroke="#78350f" stroke-width="4"/>
          <!-- Thumb hole -->
          <circle cx="605" cy="270" r="9" fill="#92400e"/>
          <!-- Paint drops: Red, Blue, Purple (Result of mix) -->
          <circle cx="530" cy="255" r="9" fill="#dc2626"/> <!-- Red -->
          <circle cx="560" cy="250" r="9" fill="#2563eb"/> <!-- Blue -->
          <circle cx="545" cy="280" r="14" fill="#9333ea" stroke="#581c87" stroke-width="2"/> <!-- Purple Mix -->
        </g>

        <!-- 3. Dropped Paintbrush with Purple Bristles -->
        <g id="interactive-scene-brush" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('brush')">
          <line x1="680" y1="360" x2="620" y2="410" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
          <polygon points="620,410 605,425 615,405" fill="#9333ea"/>
          <!-- Purple Drips on Floor -->
          <circle cx="590" cy="420" r="5" fill="#9333ea"/>
          <circle cx="575" cy="410" r="3" fill="#9333ea"/>
        </g>

        <!-- 4. Storage Crate in Corner -->
        <g id="interactive-scene-crate" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('crate')">
          <rect x="730" y="240" width="130" height="110" rx="8" fill="#a16207" stroke="#451a03" stroke-width="4"/>
          <line x1="730" y1="295" x2="860" y2="295" stroke="#713f12" stroke-width="3"/>
          <line x1="730" y1="240" x2="860" y2="350" stroke="#713f12" stroke-width="3"/>
          <text x="795" y="325" font-family="'Bungee', cursive" font-size="11" fill="#fde68a" text-anchor="middle">ART CRATE</text>
        </g>

        <defs>
          <linearGradient id="artWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ecfdf5"/>
            <stop offset="100%" stop-color="#d1fae5"/>
          </linearGradient>
          <linearGradient id="artFloorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  },

  // 4. Case Yellow Crime Scene: Interactive School Map
  getSchoolMapSceneSvg(avatarX = 240, avatarY = 160) {
    return `
      <svg width="100%" height="100%" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="crime-scene-svg">
        <!-- Campus Grass Background -->
        <rect x="0" y="0" width="900" height="480" fill="#86efac"/>

        <!-- Compass Rose in Top-Right -->
        <g transform="translate(790, 80)">
          <circle cx="0" cy="0" r="42" fill="#fff" stroke="#ca8a04" stroke-width="3"/>
          <polygon points="0,-32 7,-6 0,-2 -7,-6" fill="#dc2626"/>
          <polygon points="0,32 7,6 0,2 -7,6" fill="#64748b"/>
          <polygon points="32,0 6,7 2,0 6,-7" fill="#64748b"/>
          <polygon points="-32,0 -6,7 -2,0 -6,-7" fill="#64748b"/>
          <text x="0" y="-36" font-family="'Bungee', cursive" font-size="11" fill="#dc2626" text-anchor="middle">N</text>
          <text x="40" y="4" font-family="'Bungee', cursive" font-size="10" fill="#713f12" text-anchor="middle">E</text>
          <text x="0" y="45" font-family="'Bungee', cursive" font-size="10" fill="#713f12" text-anchor="middle">S</text>
          <text x="-40" y="4" font-family="'Bungee', cursive" font-size="10" fill="#713f12" text-anchor="middle">W</text>
        </g>

        <!-- Pathway / Roads on Campus -->
        <!-- Path 1: From Library North to Hallway -->
        <rect x="220" y="100" width="50" height="240" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <!-- Path 2: East from Main Door to Garden -->
        <rect x="220" y="100" width="460" height="50" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <!-- Path 3: South into Garden -->
        <rect x="630" y="100" width="50" height="260" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>

        <!-- 1. School Library (Starting Location) -->
        <g id="interactive-scene-library" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('library')">
          <rect x="150" y="280" width="180" height="130" rx="10" fill="#93c5fd" stroke="#1e3a8a" stroke-width="5"/>
          <polygon points="240,240 140,285 340,285" fill="#1e40af"/>
          <text x="240" y="340" font-family="'Bungee', cursive" font-size="14" fill="#1e3a8a" text-anchor="middle">📚 LIBRARY</text>
          <text x="240" y="370" font-family="'Fredoka', sans-serif" font-size="12" font-weight="900" fill="#1e3a8a" text-anchor="middle">Map Displayed Here</text>
        </g>

        <!-- 2. Main Door Hallway (Turn Right Point) -->
        <g id="interactive-scene-main_door" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('main_door')">
          <rect x="200" y="40" width="90" height="70" rx="8" fill="#f87171" stroke="#991b1b" stroke-width="4"/>
          <text x="245" y="80" font-family="'Bungee', cursive" font-size="11" fill="#fff" text-anchor="middle">🚪 MAIN DOOR</text>
          <!-- Direction Arrow Right -->
          <path d="M260 125 L320 125 M310 115 L325 125 L310 135" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>
        </g>

        <!-- 3. Science & Art Buildings (Distractors) -->
        <rect x="360" y="280" width="140" height="110" rx="8" fill="#fbcfe8" stroke="#9d174d" stroke-width="4"/>
        <text x="430" y="340" font-family="'Bungee', cursive" font-size="11" fill="#9d174d" text-anchor="middle">🎨 ART ROOM</text>

        <!-- 4. Garden with Big Oak Tree (Destination) -->
        <g id="interactive-scene-garden" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('garden')">
          <ellipse cx="670" cy="340" rx="130" ry="80" fill="#4ade80" stroke="#15803d" stroke-width="4"/>
          <!-- Oak Tree -->
          <rect x="655" y="270" width="30" height="60" fill="#78350f"/>
          <circle cx="670" cy="250" r="45" fill="#16a34a" stroke="#14532d" stroke-width="3"/>
          <text x="670" y="380" font-family="'Bungee', cursive" font-size="13" fill="#14532d" text-anchor="middle">🌳 GARDEN</text>
        </g>

        <!-- 5. Garden Supply Box / Crate (Behind Tree - Hidden Map) -->
        <g id="interactive-scene-crate" class="scene-interactive-group" onclick="clilUI.inspectSceneObject('crate')">
          <rect x="710" y="300" width="60" height="50" rx="6" fill="#ca8a04" stroke="#713f12" stroke-width="3"/>
          <text x="740" y="330" font-family="'Bungee', cursive" font-size="9" fill="#fff" text-anchor="middle">📦 BOX</text>
        </g>

        <!-- Detective Position Marker (Animated) -->
        <g transform="translate(${avatarX}, ${avatarY})" class="detective-token">
          <circle cx="0" cy="0" r="20" fill="#facc15" stroke="#78350f" stroke-width="3"/>
          <text x="0" y="6" font-size="18" text-anchor="middle">🕵️</text>
        </g>
      </svg>
    `;
  },

  // Suspect Avatars
  getSuspectAvatarSvg(avatarClass, size = 80) {
    let hairColor = "#78350f";
    let shirtColor = "#dc2626";
    let isGirl = false;

    if (avatarClass === "avatar-sam") { shirtColor = "#dc2626"; hairColor = "#1e293b"; }
    else if (avatarClass === "avatar-alex") { shirtColor = "#2563eb"; hairColor = "#b45309"; }
    else if (avatarClass === "avatar-mia") { shirtColor = "#eab308"; hairColor = "#ea580c"; isGirl = true; }
    else if (avatarClass === "avatar-leo") { shirtColor = "#16a34a"; hairColor = "#713f12"; }
    else if (avatarClass === "avatar-sara") { shirtColor = "#0284c7"; hairColor = "#1e293b"; isGirl = true; }
    else if (avatarClass === "avatar-tom") { shirtColor = "#9333ea"; hairColor = "#b45309"; }
    else if (avatarClass === "avatar-lucas") { shirtColor = "#eab308"; hairColor = "#b45309"; }
    else if (avatarClass === "avatar-emma") { shirtColor = "#10b981"; hairColor = "#facc15"; isGirl = true; }
    else if (avatarClass === "avatar-ethan") { shirtColor = "#f97316"; hairColor = "#78350f"; }
    else if (avatarClass === "avatar-maya") { shirtColor = "#06b6d4"; hairColor = "#1e293b"; isGirl = true; }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="suspect-avatar-svg">
        <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
        <!-- Shoulders / Shirt -->
        <path d="M22 92 C22 72 35 65 50 65 C65 65 78 72 78 92 Z" fill="${shirtColor}"/>
        <!-- Neck & Head -->
        <rect x="44" y="52" width="12" height="16" fill="#fed7aa"/>
        <circle cx="50" cy="42" r="22" fill="#fed7aa"/>
        <!-- Hair -->
        ${isGirl ? `
          <path d="M26 44 C26 24 74 24 74 44 C74 54 70 60 70 60 C70 60 66 32 50 32 C34 32 30 60 30 60 Z" fill="${hairColor}"/>
        ` : `
          <path d="M28 38 C28 22 72 22 72 38 C68 28 32 28 28 38 Z" fill="${hairColor}"/>
        `}
        <!-- Eyes & Smile -->
        <circle cx="43" cy="40" r="3" fill="#1e293b"/>
        <circle cx="57" cy="40" r="3" fill="#1e293b"/>
        <path d="M44 48 Q50 54 56 48" stroke="#78350f" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CLIL_SVG;
}
