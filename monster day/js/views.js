/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Cinematic Storybook Visual Engine & Full-Screen Scene Renderers
   ========================================================================== */

class JungleViewsRenderer {
  constructor() {}

  // =========================================================================
  // 1. CINEMATIC FULL-SCREEN SCENE ILLUSTRATION RENDERERS
  // =========================================================================

  // Scene 1 & 2: Living Green Valley Panorama Canvas
  renderLivingValleyPanorama(container, hotspots = [], onSpotClick) {
    container.innerHTML = `
      <div class="panorama-living-canvas" style="background-image: url('assets/green_valley.jpg');">
        <!-- Floating Ambient Lighting Rays & Sparkles -->
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; background:radial-gradient(circle at 25% 20%, rgba(254,240,138,0.25) 0%, transparent 60%);"></div>
        
        <!-- Interactive Animal Discovery Hotspots -->
        ${hotspots.map(h => `
          <button class="explore-spot-btn tap-item" data-id="${h.id}" style="position:absolute; left:${h.x}%; top:${h.y}%; transform:translate(-50%, -50%); background:none; border:none; cursor:pointer;">
            <div style="background:rgba(255,255,255,0.96); border:3px solid #10b981; border-radius:var(--radius-full); padding:10px 22px; display:flex; align-items:center; gap:12px; box-shadow:0 8px 24px rgba(0,0,0,0.3); transform:scale(1.05);">
              <span style="font-size:2.8rem;">${h.emoji}</span>
              <span style="font-family:var(--font-display); font-weight:900; font-size:1.35rem; color:#065f46;">${h.name}</span>
            </div>
          </button>
        `).join('')}
      </div>
    `;
  }

  // Scene 6: Animal Shelters (Rabbit Burrow, Fox Den, Squirrel Hollow)
  renderShelterDiscoveryScene(container) {
    container.innerHTML = `
      <div style="width:100%; height:100%; position:relative; background:linear-gradient(180deg, #38bdf8 0%, #86efac 40%, #15803d 70%, #582f0e 100%); display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <svg viewBox="0 0 1000 450" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
          <!-- Sky and Canopy -->
          <rect x="0" y="0" width="1000" height="200" fill="#bae6fd"/>
          <circle cx="200" cy="80" r="140" fill="#15803d"/>
          <circle cx="500" cy="70" r="160" fill="#166534"/>
          <circle cx="800" cy="90" r="130" fill="#15803d"/>
          
          <!-- Ground Cross-Section (Burrow / Underground Den) -->
          <path d="M 0 240 Q 250 220 500 235 Q 750 250 1000 230 L 1000 450 L 0 450 Z" fill="#582f0e"/>
          
          <!-- Rabbit Cozy Burrow Cave -->
          <ellipse cx="280" cy="340" rx="95" ry="65" fill="#3c1803" stroke="#78350f" stroke-width="4"/>
          <path d="M 280 235 Q 260 280 280 340" stroke="#3c1803" stroke-width="40" fill="none" stroke-linecap="round"/>
          <ellipse cx="280" cy="350" rx="70" ry="25" fill="#fef3c7" opacity="0.3"/> <!-- Warm Golden Nest Bed -->
          
          <!-- Tree Roots Holding the Soil -->
          <path d="M 220 230 Q 250 270 200 310" stroke="#78350f" stroke-width="8" fill="none"/>
          <path d="M 340 230 Q 320 270 360 320" stroke="#78350f" stroke-width="8" fill="none"/>

          <!-- Fox Den on the Right -->
          <ellipse cx="740" cy="330" rx="100" ry="70" fill="#271a0c" stroke="#582f0e" stroke-width="4"/>
          <path d="M 740 235 Q 760 270 740 330" stroke="#271a0c" stroke-width="45" fill="none" stroke-linecap="round"/>
        </svg>

        <!-- Animated Characters in their Shelters -->
        <div style="position:absolute; left:23%; top:65%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getRabbit("happy", 130)}
          <div style="background:#fef3c7; color:#78350f; font-family:var(--font-display); font-weight:900; font-size:1.1rem; padding:4px 14px; border-radius:var(--radius-full); margin-top:2px;">
            🐰 Safe in Burrow!
          </div>
        </div>

        <div style="position:absolute; left:74%; top:64%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getFox("happy", 135)}
          <div style="background:#fef3c7; color:#78350f; font-family:var(--font-display); font-weight:900; font-size:1.1rem; padding:4px 14px; border-radius:var(--radius-full); margin-top:2px;">
            🦊 Safe in Den!
          </div>
        </div>

        <div style="position:absolute; left:50%; top:22%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getSuki("happy", 125)}
          <div style="background:#fef3c7; color:#78350f; font-family:var(--font-display); font-weight:900; font-size:1.1rem; padding:4px 14px; border-radius:var(--radius-full); margin-top:2px;">
            🐿️ Safe in Tree Hollow!
          </div>
        </div>
      </div>
    `;
  }

  // Scene 9: Predator vs Prey Cinematic Scene
  renderPredatorPreyScene(container) {
    container.innerHTML = `
      <div style="width:100%; height:100%; position:relative; background:linear-gradient(180deg, #bae6fd 0%, #fef08a 40%, #84cc16 65%, #4d7c0f 100%); display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <svg viewBox="0 0 1000 450" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
          <!-- Golden Meadow Grass Layers -->
          <polygon points="0,280 200,240 450,260 700,230 1000,250 1000,450 0,450" fill="#65a30d"/>
          <polygon points="0,320 280,300 550,330 820,310 1000,325 1000,450 0,450" fill="#4d7c0f"/>
          <!-- Swaying Grass Blades -->
          <path d="M 120 380 L 140 280 M 150 380 L 170 290 M 180 380 L 175 270" stroke="#fef08a" stroke-width="4"/>
          <path d="M 620 380 L 640 280 M 650 380 L 670 290 M 680 380 L 675 270" stroke="#a3e635" stroke-width="4"/>
        </svg>

        <!-- Plant Producer -->
        <div style="position:absolute; left:18%; top:60%; transform:translate(-50%, -50%); text-align:center;">
          <span style="font-size:5.5rem;">🌱</span>
          <div style="background:#15803d; color:#fff; font-family:var(--font-display); font-weight:900; font-size:1.25rem; padding:6px 18px; border-radius:var(--radius-full); margin-top:6px;">
            1. Plant (Food)
          </div>
        </div>

        <div style="position:absolute; left:35%; top:60%; transform:translate(-50%, -50%); font-size:3.5rem; color:#f59e0b; font-weight:900;">➔</div>

        <!-- Rabbit Prey -->
        <div style="position:absolute; left:52%; top:56%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getRabbit("happy", 155)}
          <div style="background:#0284c7; color:#fff; font-family:var(--font-display); font-weight:900; font-size:1.35rem; padding:6px 20px; border-radius:var(--radius-full); margin-top:8px;">
            2. Rabbit (PREY 🐇)
          </div>
        </div>

        <div style="position:absolute; left:68%; top:60%; transform:translate(-50%, -50%); font-size:3.5rem; color:#f59e0b; font-weight:900;">➔</div>

        <!-- Fox Predator -->
        <div style="position:absolute; left:84%; top:54%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getFox("happy", 160)}
          <div style="background:#dc2626; color:#fff; font-family:var(--font-display); font-weight:900; font-size:1.35rem; padding:6px 20px; border-radius:var(--radius-full); margin-top:8px;">
            3. Fox (PREDATOR 🦊)
          </div>
        </div>
      </div>
    `;
  }

  // Scene 14: Dramatic The Great Storm Cinematic Scene
  renderGreatStormScene(container) {
    container.innerHTML = `
      <div style="width:100%; height:100%; position:relative; background:linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #334155 70%, #1e1b4b 100%); display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <div class="lightning-flash" id="lightning-fx" style="position:absolute; top:0; left:0; width:100%; height:100%; background:#fff; opacity:0; pointer-events:none; z-index:40;"></div>
        
        <svg viewBox="0 0 1000 450" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
          <!-- Ominous Storm Clouds -->
          <circle cx="150" cy="50" r="120" fill="#1e293b" opacity="0.9"/>
          <circle cx="350" cy="40" r="140" fill="#0f172a" opacity="0.95"/>
          <circle cx="650" cy="50" r="150" fill="#1e293b" opacity="0.9"/>
          <circle cx="900" cy="40" r="130" fill="#0f172a" opacity="0.95"/>
          
          <!-- Jagged Lightning Bolt -->
          <polygon points="500,20 470,160 520,160 460,320 540,180 490,180" fill="#fef08a" opacity="0.85"/>

          <!-- Falling Broken Oak Tree -->
          <g transform="rotate(-35, 320, 360)">
            <rect x="290" y="80" width="55" height="280" fill="#582f0e"/>
            <polygon points="290,120 345,150 290,180" fill="#3c1803"/> <!-- Broken Split Trunk -->
            <circle cx="320" cy="70" r="100" fill="#14532d"/>
          </g>

          <!-- Wind Streaks & Rain -->
          <line x1="100" y1="50" x2="50" y2="250" stroke="#38bdf8" stroke-width="2.5" opacity="0.6"/>
          <line x1="300" y1="30" x2="250" y2="280" stroke="#38bdf8" stroke-width="2.5" opacity="0.6"/>
          <line x1="600" y1="40" x2="550" y2="300" stroke="#38bdf8" stroke-width="2.5" opacity="0.6"/>
          <line x1="800" y1="20" x2="750" y2="270" stroke="#38bdf8" stroke-width="2.5" opacity="0.6"/>
          <!-- Flying Leaves -->
          <ellipse cx="200" cy="180" rx="14" ry="7" fill="#15803d" transform="rotate(45, 200, 180)"/>
          <ellipse cx="580" cy="220" rx="14" ry="7" fill="#166534" transform="rotate(-30, 580, 220)"/>
          <ellipse cx="780" cy="150" rx="14" ry="7" fill="#65a30d" transform="rotate(60, 780, 150)"/>
        </svg>

        <!-- Worried Character Reactions -->
        <div style="position:absolute; left:22%; top:62%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getSuki("worried", 145)}
          <div style="background:#ef4444; color:#fff; font-family:var(--font-display); font-weight:900; font-size:1.15rem; padding:4px 16px; border-radius:var(--radius-full); margin-top:4px;">
            🐿️ Suki's Tree Fell!
          </div>
        </div>

        <div style="position:absolute; left:52%; top:66%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getPoppy("worried", 135)}
          <div style="background:#ef4444; color:#fff; font-family:var(--font-display); font-weight:900; font-size:1.15rem; padding:4px 16px; border-radius:var(--radius-full); margin-top:4px;">
            🐸 Poppy is Scared!
          </div>
        </div>

        <div style="position:absolute; left:82%; top:62%; transform:translate(-50%, -50%); text-align:center;">
          ${this.getRico("worried", 140)}
          <div style="background:#ef4444; color:#fff; font-family:var(--font-display); font-weight:900; font-size:1.15rem; padding:4px 16px; border-radius:var(--radius-full); margin-top:4px;">
            🦝 River is Flooding!
          </div>
        </div>
      </div>
    `;
  }

  // Character Generators
  getSuki(state = "happy", size = 160) {
    const isWorried = state === "worried" || state === "scared";
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character suki-character">
        <defs>
          <radialGradient id="sq-tail" cx="65%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="50%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </radialGradient>
          <linearGradient id="sq-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="40%" stop-color="#f97316"/>
            <stop offset="80%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="148" rx="38" ry="8" fill="#000" opacity="0.25"/>
        <path d="M 85 125 C 145 120 165 45 125 20 C 95 2 85 35 102 62 C 115 82 108 108 82 118 Z" fill="url(#sq-tail)" stroke="#7c2d12" stroke-width="2.5"/>
        <ellipse cx="72" cy="108" rx="30" ry="34" fill="url(#sq-body)"/>
        <path d="M 58 86 Q 74 100 66 128 Q 50 116 54 88 Z" fill="#fff"/>
        <circle cx="62" cy="64" r="26" fill="url(#sq-body)"/>
        <path d="M 44 44 C 38 25 50 20 54 38 Z" fill="#ea580c"/>
        <path d="M 72 44 C 78 25 66 20 62 38 Z" fill="#ea580c"/>
        ${isWorried ? `
          <ellipse cx="50" cy="60" rx="6" ry="7" fill="#1e1b4b"/><circle cx="48" cy="58" r="2.5" fill="#fff"/>
          <ellipse cx="72" cy="60" rx="6" ry="7" fill="#1e1b4b"/><circle cx="70" cy="58" r="2.5" fill="#fff"/>
          <path d="M 44 50 Q 52 54 58 51" stroke="#451a03" stroke-width="2.5" fill="none"/>
          <path d="M 78 50 Q 70 54 64 51" stroke="#451a03" stroke-width="2.5" fill="none"/>
          <path d="M 56 75 Q 61 72 66 75" stroke="#7c2d12" stroke-width="2.5" fill="none"/>
        ` : `
          <ellipse cx="50" cy="60" rx="7" ry="8" fill="#1e1b4b"/><circle cx="48" cy="57" r="3" fill="#fff"/>
          <ellipse cx="72" cy="60" rx="7" ry="8" fill="#1e1b4b"/><circle cx="70" cy="57" r="3" fill="#fff"/>
          <path d="M 44 48 Q 50 44 56 48" stroke="#451a03" stroke-width="2" fill="none"/>
          <path d="M 66 48 Q 72 44 78 48" stroke="#451a03" stroke-width="2" fill="none"/>
          <path d="M 55 72 Q 61 78 67 72" stroke="#7c2d12" stroke-width="2.5" fill="none"/>
        `}
        <polygon points="58,66 64,66 61,70" fill="#451a03"/>
      </svg>
    `;
  }

  getPoppy(state = "happy", size = 160) {
    const isWorried = state === "worried";
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character poppy-character">
        <path d="M 20 130 C 25 100 135 100 140 130 C 135 155 95 160 80 142 C 65 160 25 155 20 130 Z" fill="#15803d"/>
        <ellipse cx="80" cy="98" rx="36" ry="28" fill="#22c55e"/>
        <ellipse cx="80" cy="104" rx="24" ry="18" fill="#fef08a"/>
        <circle cx="56" cy="52" r="18" fill="#16a34a"/>
        <circle cx="104" cy="52" r="18" fill="#16a34a"/>
        <circle cx="56" cy="52" r="13" fill="#fef08a"/>
        <circle cx="104" cy="52" r="13" fill="#fef08a"/>
        ${isWorried ? `
          <ellipse cx="56" cy="52" rx="7" ry="4" fill="#022c22"/>
          <ellipse cx="104" cy="52" rx="7" ry="4" fill="#022c22"/>
          <path d="M 58 92 Q 80 82 102 92" stroke="#064e3b" stroke-width="3.5" fill="none"/>
        ` : `
          <ellipse cx="56" cy="52" rx="8" ry="10" fill="#022c22"/><circle cx="53" cy="48" r="3.5" fill="#fff"/>
          <ellipse cx="104" cy="52" rx="8" ry="10" fill="#022c22"/><circle cx="101" cy="48" r="3.5" fill="#fff"/>
          <path d="M 52 82 Q 80 102 108 82" stroke="#064e3b" stroke-width="3.5" fill="none"/>
        `}
      </svg>
    `;
  }

  getRico(state = "happy", size = 160) {
    const isWorried = state === "worried";
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character rico-character">
        <path d="M 95 110 C 145 105 155 60 135 45 C 120 35 115 55 105 85 Z" fill="#64748b"/>
        <ellipse cx="75" cy="112" rx="34" ry="30" fill="#64748b"/>
        <circle cx="75" cy="65" r="28" fill="#64748b"/>
        <path d="M 48 58 Q 75 66 102 58 Q 98 76 75 72 Q 52 76 48 58 Z" fill="#0f172a"/>
        ${isWorried ? `
          <circle cx="58" cy="62" r="3.5" fill="#fff"/>
          <circle cx="92" cy="62" r="3.5" fill="#fff"/>
          <path d="M 68 84 Q 75 80 82 84" stroke="#0f172a" stroke-width="2.5" fill="none"/>
        ` : `
          <circle cx="58" cy="62" r="4.5" fill="#fff"/><circle cx="56" cy="60" r="1.8" fill="#020617"/>
          <circle cx="92" cy="62" r="4.5" fill="#fff"/><circle cx="90" cy="60" r="1.8" fill="#020617"/>
          <path d="M 66 80 Q 75 88 84 80" stroke="#0f172a" stroke-width="2.5" fill="none"/>
        `}
        <ellipse cx="75" cy="76" rx="12" ry="9" fill="#f8fafc"/>
        <ellipse cx="75" cy="72" rx="5" ry="3.5" fill="#020617"/>
      </svg>
    `;
  }

  getRabbit(state = "happy", size = 160) {
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character rabbit-character">
        <ellipse cx="62" cy="35" rx="10" ry="30" fill="#e2e8f0" transform="rotate(-10, 62, 35)"/>
        <ellipse cx="62" cy="35" rx="5" ry="22" fill="#fbcfe8" transform="rotate(-10, 62, 35)"/>
        <ellipse cx="98" cy="35" rx="10" ry="30" fill="#e2e8f0" transform="rotate(10, 98, 35)"/>
        <ellipse cx="98" cy="35" rx="5" ry="22" fill="#fbcfe8" transform="rotate(10, 98, 35)"/>
        <ellipse cx="80" cy="115" rx="34" ry="30" fill="#e2e8f0"/>
        <circle cx="80" cy="75" r="26" fill="#e2e8f0"/>
        <ellipse cx="68" cy="70" rx="6" ry="7" fill="#1e1b4b"/><circle cx="66" cy="68" r="2.5" fill="#fff"/>
        <ellipse cx="92" cy="70" rx="6" ry="7" fill="#1e1b4b"/><circle cx="90" cy="68" r="2.5" fill="#fff"/>
        <polygon points="76,80 84,80 80,85" fill="#f472b6"/>
        <path d="M 74 88 Q 80 92 86 88" stroke="#64748b" stroke-width="2" fill="none"/>
      </svg>
    `;
  }

  getFox(state = "happy", size = 160) {
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character fox-character">
        <path d="M 95 115 C 145 110 160 55 130 35 C 105 20 100 65 90 95 Z" fill="#ea580c"/>
        <path d="M 130 35 C 140 45 135 60 120 62 Z" fill="#fff"/>
        <ellipse cx="75" cy="115" rx="34" ry="26" fill="#ea580c"/>
        <polygon points="45,45 35,15 62,35" fill="#0f172a"/>
        <polygon points="105,45 115,15 88,35" fill="#0f172a"/>
        <polygon points="35,55 75,102 115,55" fill="#ea580c"/>
        <polygon points="42,58 75,96 58,58" fill="#fff"/>
        <polygon points="108,58 75,96 92,58" fill="#fff"/>
        <ellipse cx="58" cy="58" rx="6" ry="4" fill="#d97706"/><circle cx="58" cy="58" r="2.5" fill="#0f172a"/>
        <ellipse cx="92" cy="58" rx="6" ry="4" fill="#d97706"/><circle cx="92" cy="58" r="2.5" fill="#0f172a"/>
        <circle cx="75" cy="98" r="4.5" fill="#020617"/>
      </svg>
    `;
  }

  getBoris(state = "happy", size = 160) {
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character boris-character">
        <ellipse cx="80" cy="115" rx="46" ry="36" fill="#582f0e"/>
        <circle cx="50" cy="42" r="15" fill="#582f0e"/><circle cx="50" cy="42" r="9" fill="#d97706"/>
        <circle cx="110" cy="42" r="15" fill="#582f0e"/><circle cx="110" cy="42" r="9" fill="#d97706"/>
        <circle cx="80" cy="68" r="34" fill="#582f0e"/>
        <ellipse cx="80" cy="78" rx="20" ry="16" fill="#d97706"/>
        <ellipse cx="80" cy="72" rx="9" ry="6.5" fill="#1c1917"/>
        <circle cx="64" cy="58" r="5" fill="#1c1917"/><circle cx="63" cy="56" r="1.8" fill="#fff"/>
        <circle cx="96" cy="58" r="5" fill="#1c1917"/><circle cx="95" cy="56" r="1.8" fill="#fff"/>
        <path d="M 70 84 Q 80 92 90 84" stroke="#1c1917" stroke-width="3" fill="none"/>
        <circle cx="74" cy="86" r="4" fill="#e11d48"/>
      </svg>
    `;
  }

  // Visual Word Wall Modal Renderer
  renderVisualWordWall(container) {
    const words = window.JUNGLE_DATA.wordWall;
    container.innerHTML = `
      <div class="modal-card" style="max-width:1050px; border-color:#10b981;">
        <div class="modal-header">
          <div class="modal-title">
            <span>🖼️</span>
            <span>VISUAL JUNGLE WORD WALL</span>
          </div>
          <button class="modal-close-btn" id="btn-close-word-wall">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; max-height:68vh; overflow-y:auto; padding:8px;">
          ${words.map(w => `
            <div class="word-wall-card tap-item" data-word="${w.word}" data-desc="${w.desc}" style="background:#f8fafc; border:3px solid #cbd5e1; border-radius:var(--radius-xl); padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; touch-action:manipulation;">
              <span style="font-size:3.5rem; margin-bottom:6px;">${w.icon}</span>
              <span style="font-family:var(--font-display); font-weight:900; font-size:1.35rem; color:#0f172a;">${w.word}</span>
              <span style="font-size:0.95rem; color:#475569; margin-top:6px; font-weight:700;">${w.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.jungleViews = new JungleViewsRenderer();
