/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Realistic Storybook Nature Illustrations & TAP → TAP Interaction Views
   ========================================================================== */

class JungleViewsRenderer {
  constructor() {}

  // =========================================================================
  // REALISTIC STORYBOOK ANIMAL SVG ILLUSTRATIONS
  // =========================================================================
  getAnimalAvatar(animalKey, size = 130) {
    const realisticAnimals = {
      squirrel: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <radialGradient id="sq-tail" cx="70%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#ea580c"/>
              <stop offset="60%" stop-color="#c2410c"/>
              <stop offset="100%" stop-color="#7c2d12"/>
            </radialGradient>
            <linearGradient id="sq-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#f97316"/>
              <stop offset="50%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#9a3412"/>
            </linearGradient>
            <linearGradient id="sq-chest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#fed7aa"/>
            </linearGradient>
          </defs>
          <path d="M 0 100 Q 60 95 120 105 L 120 120 L 0 120 Z" fill="#582f0e"/>
          <path d="M 68 85 C 105 78 118 25 88 15 C 68 8 62 32 72 48 C 80 60 76 75 66 82 Z" fill="url(#sq-tail)" stroke="#7c2d12" stroke-width="1.5"/>
          <ellipse cx="50" cy="74" rx="22" ry="24" fill="url(#sq-body)"/>
          <path d="M 42 58 Q 52 70 46 88 Q 36 78 40 60 Z" fill="url(#sq-chest)"/>
          <circle cx="44" cy="46" r="17" fill="url(#sq-body)"/>
          <ellipse cx="38" cy="44" rx="4.5" ry="5" fill="#1e1b4b"/>
          <circle cx="39.5" cy="42.5" r="1.8" fill="#ffffff"/>
          <circle cx="28" cy="48" r="2.2" fill="#271a0c"/>
          <ellipse cx="38" cy="68" rx="6" ry="7" fill="#78350f"/>
          <path d="M 33 64 Q 38 60 43 64 Z" fill="#451a03"/>
        </svg>
      `,

      frog: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <radialGradient id="fr-skin" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#4ade80"/>
              <stop offset="50%" stop-color="#16a34a"/>
              <stop offset="100%" stop-color="#14532d"/>
            </radialGradient>
            <linearGradient id="fr-belly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="100%" stop-color="#bbf7d0"/>
            </linearGradient>
          </defs>
          <path d="M 15 95 C 20 75 100 75 105 95 C 100 115 20 115 15 95 Z" fill="#15803d"/>
          <ellipse cx="60" cy="76" rx="26" ry="20" fill="url(#fr-skin)"/>
          <ellipse cx="60" cy="80" rx="18" ry="12" fill="url(#fr-belly)"/>
          <circle cx="44" cy="48" r="14" fill="url(#fr-skin)"/>
          <circle cx="76" cy="48" r="14" fill="url(#fr-skin)"/>
          <circle cx="44" cy="48" r="9" fill="#facc15"/>
          <circle cx="76" cy="48" r="9" fill="#facc15"/>
          <ellipse cx="44" cy="48" rx="7" ry="3.5" fill="#022c22"/>
          <ellipse cx="76" cy="48" rx="7" ry="3.5" fill="#022c22"/>
          <circle cx="46" cy="46" r="2" fill="#ffffff"/>
          <circle cx="78" cy="46" r="2" fill="#ffffff"/>
          <path d="M 38 68 Q 60 76 82 68" stroke="#064e3b" stroke-width="2.5" fill="none"/>
        </svg>
      `,

      fox: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <linearGradient id="fox-coat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fb923c"/>
              <stop offset="50%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#9a3412"/>
            </linearGradient>
          </defs>
          <ellipse cx="58" cy="78" rx="28" ry="20" fill="url(#fox-coat)"/>
          <polygon points="26,35 34,10 46,30" fill="#1e293b"/>
          <polygon points="56,30 68,10 76,35" fill="#1e293b"/>
          <polygon points="22,46 60,82 92,46" fill="url(#fox-coat)"/>
          <polygon points="28,48 60,76 44,48" fill="#ffffff"/>
          <polygon points="92,48 60,76 76,48" fill="#ffffff"/>
          <ellipse cx="44" cy="46" rx="4.5" ry="3" fill="#d97706"/>
          <ellipse cx="76" cy="46" rx="4.5" ry="3" fill="#d97706"/>
          <circle cx="44" cy="46" r="2.2" fill="#0f172a"/>
          <circle cx="76" cy="46" r="2.2" fill="#0f172a"/>
          <ellipse cx="60" cy="79" rx="3.8" ry="2.8" fill="#020617"/>
        </svg>
      `,

      rabbit: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <linearGradient id="rb-fur" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#94a3b8"/>
            </linearGradient>
          </defs>
          <ellipse cx="44" cy="24" rx="7.5" ry="22" fill="url(#rb-fur)" stroke="#cbd5e1" stroke-width="1.5"/>
          <ellipse cx="68" cy="24" rx="7.5" ry="22" fill="url(#rb-fur)" stroke="#cbd5e1" stroke-width="1.5"/>
          <ellipse cx="56" cy="76" rx="26" ry="22" fill="url(#rb-fur)"/>
          <circle cx="50" cy="54" r="18" fill="url(#rb-fur)"/>
          <ellipse cx="42" cy="50" rx="4" ry="5" fill="#1e1b4b"/>
          <circle cx="43.5" cy="48.5" r="1.5" fill="#ffffff"/>
          <polygon points="34,58 38,58 36,62" fill="#f472b6"/>
        </svg>
      `,

      bear: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <ellipse cx="56" cy="74" rx="34" ry="26" fill="#582f0e"/>
          <circle cx="56" cy="50" r="26" fill="#582f0e"/>
          <circle cx="34" cy="30" r="10" fill="#582f0e"/>
          <circle cx="78" cy="30" r="10" fill="#582f0e"/>
          <ellipse cx="56" cy="58" rx="15" ry="11" fill="#d97706"/>
          <ellipse cx="56" cy="54" rx="6.5" ry="4.5" fill="#09090b"/>
          <circle cx="44" cy="44" r="3.5" fill="#1c1917"/>
          <circle cx="68" cy="44" r="3.5" fill="#1c1917"/>
        </svg>
      `,

      owl: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <ellipse cx="58" cy="64" rx="26" ry="28" fill="#64748b"/>
          <circle cx="44" cy="44" r="13" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="44" cy="44" r="7.5" fill="#09090b"/>
          <circle cx="72" cy="44" r="13" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="72" cy="44" r="7.5" fill="#09090b"/>
          <polygon points="54,48 62,48 58,60" fill="#ea580c"/>
        </svg>
      `,

      raccoon: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <ellipse cx="60" cy="74" rx="26" ry="22" fill="#64748b"/>
          <circle cx="60" cy="52" r="24" fill="#94a3b8"/>
          <path d="M 38 48 Q 60 54 82 48 Q 78 60 60 56 Q 42 60 38 48 Z" fill="#0f172a"/>
          <circle cx="48" cy="50" r="4" fill="#0f172a"/>
          <circle cx="72" cy="50" r="4" fill="#0f172a"/>
          <ellipse cx="60" cy="62" rx="9" ry="7" fill="#ffffff"/>
        </svg>
      `,

      deer: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <ellipse cx="60" cy="56" rx="22" ry="24" fill="#b45309"/>
          <ellipse cx="60" cy="64" rx="12" ry="10" fill="#fed7aa"/>
          <circle cx="48" cy="52" r="3.5" fill="#0f172a"/>
          <circle cx="72" cy="52" r="3.5" fill="#0f172a"/>
        </svg>
      `,

      fish: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <polygon points="85,60 105,42 100,60 105,78" fill="#f43f5e"/>
          <ellipse cx="55" cy="60" rx="32" ry="16" fill="#38bdf8"/>
          <circle cx="35" cy="56" r="3.5" fill="#0f172a"/>
        </svg>
      `,

      bird: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <ellipse cx="60" cy="65" rx="20" ry="16" fill="#0284c7"/>
          <circle cx="48" cy="48" r="13" fill="#0284c7"/>
          <polygon points="36,48 24,52 36,54" fill="#f59e0b"/>
        </svg>
      `,

      butterfly: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <ellipse cx="44" cy="44" rx="18" ry="22" fill="#f97316"/>
          <ellipse cx="76" cy="44" rx="18" ry="22" fill="#f97316"/>
          <ellipse cx="60" cy="58" rx="3.5" ry="18" fill="#0f172a"/>
        </svg>
      `
    };

    return realisticAnimals[animalKey] || realisticAnimals.squirrel;
  }

  // =========================================================================
  // CHAPTER 1: WELCOME TO GREEN VALLEY (OPEN EXPLORATION)
  // =========================================================================
  renderOpenExploration(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:1150px;">
          <div style="display:flex; justify-content:space-between; width:100%; align-items:center; background:rgba(0,0,0,0.5); padding:10px 24px; border-radius:var(--radius-full); border:1px solid rgba(255,255,255,0.25);">
            <span style="font-family:var(--font-display); font-size:1.2rem; color:#fef3c7; font-weight:800;">
              👆 TAP any animal or plant to explore Green Valley!
            </span>
            <span class="prediction-badge" style="background:#059669;" id="explore-found-count">
              Discovered: 0 / ${chapter.hotspots.length}
            </span>
          </div>

          <div style="position:relative; width:100%; height:400px; background:linear-gradient(180deg, #38bdf8 0%, #86efac 45%, #15803d 85%); border-radius:var(--radius-xl); border:4px solid #10b981; overflow:hidden;">
            <svg viewBox="0 0 1000 400" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
              <polygon points="0,220 180,120 360,240 540,110 750,230 1000,160 1000,400 0,400" fill="#047857" opacity="0.5"/>
              <circle cx="220" cy="180" r="90" fill="#15803d"/>
              <circle cx="340" cy="190" r="80" fill="#166534"/>
              <circle cx="100" cy="200" r="75" fill="#14532d"/>
              <path d="M 500 240 Q 650 250 680 320 Q 720 400 800 400 L 580 400 Q 560 330 460 270 Z" fill="#38bdf8"/>
              <ellipse cx="720" cy="340" rx="90" ry="35" fill="#0284c7" opacity="0.8"/>
            </svg>

            ${chapter.hotspots.map(h => `
              <button class="explore-hotspot" data-id="${h.id}" data-sound="${h.sound}" style="position:absolute; left:${h.x}%; top:${h.y}%; cursor:pointer; transform:translate(-50%, -50%); background:none; border:none; touch-action:manipulation;">
                <div style="background:rgba(255,255,255,0.95); border:3px solid #10b981; border-radius:var(--radius-full); padding:10px 18px; display:flex; align-items:center; gap:10px; box-shadow:var(--shadow-md);">
                  <span style="font-size:2.5rem;">${h.emoji}</span>
                  <span style="font-family:var(--font-display); font-weight:800; font-size:1.15rem; color:#065f46;">${h.name}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 2: RANGER EYES (FIND HIDDEN ANIMALS IN NATURE)
  // =========================================================================
  renderRangerEyes(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1100px;">
          <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800; text-align:center;">
            🔎 RANGER EYES: Tap the 5 hidden animals in nature!
          </div>

          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            ${chapter.targets.map(t => `
              <div class="target-check-pill" id="target-pill-${t.id}" style="background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.35); border-radius:var(--radius-full); padding:8px 18px; color:#fff; font-family:var(--font-display); font-size:1.1rem; font-weight:800;">
                <span>${t.name}</span> <span>❓</span>
              </div>
            `).join('')}
          </div>

          <div style="position:relative; width:100%; height:380px; background:#064e3b; border-radius:var(--radius-xl); border:4px solid #34d399; overflow:hidden;">
            <button class="nature-spot-btn" data-target="squirrel" style="position:absolute; top:25%; left:22%; cursor:pointer; background:none; border:none; padding:10px;">
              ${this.getAnimalAvatar("squirrel", 85)}
            </button>
            <button class="nature-spot-btn" data-target="owl" style="position:absolute; top:18%; left:78%; cursor:pointer; background:none; border:none; padding:10px;">
              ${this.getAnimalAvatar("owl", 80)}
            </button>
            <button class="nature-spot-btn" data-target="frog" style="position:absolute; top:68%; left:65%; cursor:pointer; background:none; border:none; padding:10px;">
              ${this.getAnimalAvatar("frog", 85)}
            </button>
            <button class="nature-spot-btn" data-target="fox" style="position:absolute; top:58%; left:42%; cursor:pointer; background:none; border:none; padding:10px;">
              ${this.getAnimalAvatar("fox", 85)}
            </button>
            <button class="nature-spot-btn" data-target="rabbit" style="position:absolute; top:70%; left:12%; cursor:pointer; background:none; border:none; padding:10px;">
              ${this.getAnimalAvatar("rabbit", 80)}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 4: MATCH THE ANIMAL (TAP WORD ➔ TAP PICTURE)
  // =========================================================================
  renderMatchAnimal(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1100px;">
          <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800; text-align:center;">
            👇 STEP 1: Tap a Word Card ➔ STEP 2: Tap the Matching Animal!
          </div>

          <!-- 4 Animal Picture Target Cards -->
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
            ${chapter.pairs.map(p => `
              <div class="tap-target animal-match-target" data-animal="${p.id}" style="width:230px; height:240px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:14px; box-shadow:var(--shadow-md);">
                ${this.getAnimalAvatar(p.id, 105)}
                <div class="matched-slot-label" style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:#475569; background:#f1f5f9; width:100%; text-align:center; padding:8px 0; border-radius:var(--radius-full);">
                  [ Tap to Match ]
                </div>
              </div>
            `).join('')}
          </div>

          <!-- 4 Word Cards (Tap-to-Select) -->
          <div class="items-palette">
            ${chapter.pairs.map(p => `
              <button class="item-card tap-item word-match-card" data-word="${p.id}" style="min-width:150px; padding:16px 24px;">
                <span class="item-label" style="font-size:1.35rem; letter-spacing:0.05em;">${p.word}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 5: WHERE DOES IT LIVE? (TAP ANIMAL ➔ TAP BIOME)
  // =========================================================================
  renderWhereDoesItLive(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1150px;">
          <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
            👇 STEP 1: Tap Animal ➔ STEP 2: Tap its Real Home Environment!
          </div>

          <!-- 4 Illustrated Biomes (Targets) -->
          <div class="habitat-zones-container">
            ${chapter.environments.map(env => `
              <div class="habitat-zone-card ${env.id}-zone tap-target biome-target" data-biome="${env.id}">
                <div class="habitat-header">${env.name}</div>
                <div class="habitat-actor-slot" style="font-size:1.15rem; color:#fff; text-align:center; padding:8px;">
                  ❓ Tap Destination
                </div>
                <div class="habitat-tag">${env.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- Available Animals Palette (Tap to Select) -->
          <div class="items-palette">
            ${chapter.items.map(it => `
              <button class="item-card tap-item biome-animal-item" data-id="${it.id}" data-target="${it.target}" style="padding:14px 22px;">
                <span class="item-emoji">${it.emoji}</span>
                <span class="item-label">${it.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 7: ANIMAL HOMES (SHELTER TAP MATCH)
  // =========================================================================
  renderAnimalHomes(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1050px;">
          <div class="prediction-badge" style="background:#d97706;">
            🏠 SHELTER = A safe place to rest and hide from danger
          </div>

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; width:100%;">
            ${chapter.pairs.map(p => `
              <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                <div style="font-family:var(--font-display); font-size:1.35rem; font-weight:800; color:#1e293b;">
                  ${p.animal}
                </div>
                <span style="font-size:2rem; color:#10b981;">➔</span>
                <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:8px 20px; font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#065f46;">
                  ${p.shelter} (${p.shelterName})
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 10: WHO EATS WHO? (PREDATOR & PREY THEATER)
  // =========================================================================
  renderPredatorPrey(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1000px;">
          <div style="font-family:var(--font-display); font-size:1.45rem; color:#fef3c7; font-weight:800; text-align:center;">
            🦊 WHO EATS WHO? (Tap to Discover Predator & Prey)
          </div>

          <div style="display:flex; align-items:center; justify-content:center; gap:20px; width:100%; background:rgba(255,255,255,0.97); padding:24px; border-radius:var(--radius-xl); box-shadow:var(--shadow-lg);">
            <div style="text-align:center;">
              <span style="font-size:3.8rem;">🌱</span>
              <div style="font-family:var(--font-display); font-weight:800; color:#15803d; font-size:1.2rem;">Green Plant</div>
              <div style="font-size:0.9rem; color:#475569;">Producer</div>
            </div>

            <span style="font-size:2.8rem; color:#f59e0b;">➔</span>

            <div style="text-align:center; cursor:pointer;" id="node-prey">
              ${this.getAnimalAvatar("rabbit", 95)}
              <div style="font-family:var(--font-display); font-weight:800; color:#0369a1; font-size:1.2rem;">Rabbit 🐇</div>
              <div class="prediction-badge" style="background:#0284c7; font-size:0.9rem; padding:4px 12px; margin-top:4px;">PREY 🐇</div>
            </div>

            <span style="font-size:2.8rem; color:#f59e0b;">➔</span>

            <div style="text-align:center; cursor:pointer;" id="node-predator">
              ${this.getAnimalAvatar("fox", 95)}
              <div style="font-family:var(--font-display); font-weight:800; color:#b91c1c; font-size:1.2rem;">Fox 🦊</div>
              <div class="prediction-badge" style="background:#dc2626; font-size:0.9rem; padding:4px 12px; margin-top:4px;">PREDATOR 🦊</div>
            </div>
          </div>

          <div style="display:flex; gap:16px; width:100%;">
            ${chapter.definitions.map(d => `
              <div style="flex:1; background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.25); border-radius:var(--radius-lg); padding:14px 20px; color:#fff;">
                <b style="color:#fbbf24; font-size:1.15rem;">${d.word}:</b>
                <span style="font-size:1.05rem; margin-left:6px;">${d.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 12: DISCOVER ECOSYSTEM VISUALLY
  // =========================================================================
  renderEcosystemMap(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1100px;">
          <div style="font-family:var(--font-display); font-size:1.6rem; color:#fbbf24; font-weight:900; text-shadow:0 2px 6px rgba(0,0,0,0.6);">
            🌎 ECOSYSTEM = Everything is Connected!
          </div>

          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; width:100%;">
            ${chapter.connections.map(c => `
              <div style="background:rgba(255,255,255,0.96); border:3px solid #10b981; border-radius:var(--radius-xl); padding:18px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px; box-shadow:var(--shadow-md);">
                <div style="font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#065f46;">
                  ${c.from} ➔ ${c.to}
                </div>
                <div style="font-size:1rem; color:#475569; font-weight:700;">
                  ${c.text}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 13: VISUAL STORY PREVIEW
  // =========================================================================
  renderStoryPreview(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1100px;">
          <div style="font-family:var(--font-display); font-size:1.45rem; color:#fef3c7; font-weight:800;">
            🔮 Story Preview: What will happen in Green Valley?
          </div>

          <div style="display:flex; gap:14px; width:100%; justify-content:center;">
            ${chapter.cards.map(c => `
              <div style="flex:1; max-width:260px; background:#fff; border-radius:var(--radius-xl); border:3px solid #cbd5e1; padding:18px 14px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; box-shadow:var(--shadow-md);">
                <div style="font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#065f46;">
                  ${c.title}
                </div>
                <p style="font-size:1rem; color:#475569; line-height:1.35;">
                  ${c.desc}
                </p>
              </div>
            `).join('')}
          </div>

          <button class="hud-btn hud-btn-teacher" id="btn-begin-storm-story" style="margin-top:14px; font-size:1.35rem; padding:16px 36px; background:linear-gradient(135deg, #ef4444, #b91c1c); border-color:#fca5a5;">
            <span>⛈️ ENTER THE GREAT STORM ➔</span>
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VISUAL WORD WALL MODAL
  // =========================================================================
  renderVisualWordWallModal(container) {
    const words = window.JUNGLE_DATA.visualWordWall;
    container.innerHTML = `
      <div class="modal-card" style="max-width:950px; border-color:#10b981;">
        <div class="modal-header">
          <div class="modal-title">
            <span>🖼️</span>
            <span>VISUAL JUNGLE WORD WALL</span>
          </div>
          <button class="modal-close-btn" id="btn-close-word-wall">✕</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; max-height:65vh; overflow-y:auto; padding:6px;">
          ${words.map(w => `
            <div class="word-wall-card" data-word="${w.word}" data-desc="${w.desc}" style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:var(--radius-lg); padding:14px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; touch-action:manipulation;">
              <span style="font-size:3rem; margin-bottom:4px;">${w.icon}</span>
              <span style="font-family:var(--font-display); font-weight:800; font-size:1.15rem; color:#0f172a;">${w.word}</span>
              <span style="font-size:0.85rem; color:#64748b; margin-top:4px;">${w.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Global instance
window.jungleViews = new JungleViewsRenderer();
