/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Realistic Storybook Nature Illustrations & Stage Views Renderer
   ========================================================================== */

class JungleViewsRenderer {
  constructor() {}

  // Realistic Storybook Animal Illustrations
  getAnimalAvatar(animalKey, size = 125) {
    const avatars = {
      squirrel: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <radialGradient id="sq-tail-grad" cx="70%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#ea580c"/>
              <stop offset="60%" stop-color="#c2410c"/>
              <stop offset="100%" stop-color="#7c2d12"/>
            </radialGradient>
            <linearGradient id="sq-body-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#f97316"/>
              <stop offset="50%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#9a3412"/>
            </linearGradient>
          </defs>
          <path d="M 0 100 Q 60 95 120 105 L 120 120 L 0 120 Z" fill="#582f0e"/>
          <path d="M 68 85 C 105 78 118 25 88 15 C 68 8 62 32 72 48 C 80 60 76 75 66 82 Z" fill="url(#sq-tail-grad)" stroke="#7c2d12" stroke-width="1.5"/>
          <ellipse cx="50" cy="74" rx="22" ry="24" fill="url(#sq-body-grad)"/>
          <path d="M 42 58 Q 52 70 46 88 Q 36 78 40 60 Z" fill="#fff"/>
          <circle cx="44" cy="46" r="17" fill="url(#sq-body-grad)"/>
          <ellipse cx="38" cy="44" rx="4.5" ry="5" fill="#1e1b4b"/>
          <circle cx="39.5" cy="42.5" r="1.8" fill="#ffffff"/>
          <circle cx="28" cy="48" r="2.2" fill="#271a0c"/>
          <ellipse cx="38" cy="68" rx="6" ry="7" fill="#78350f"/>
        </svg>
      `,
      frog: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <path d="M 15 95 C 20 75 100 75 105 95 C 100 115 20 115 15 95 Z" fill="#15803d"/>
          <ellipse cx="60" cy="76" rx="26" ry="20" fill="#16a34a"/>
          <ellipse cx="60" cy="80" rx="18" ry="12" fill="#fef08a"/>
          <circle cx="44" cy="48" r="14" fill="#16a34a"/>
          <circle cx="76" cy="48" r="14" fill="#16a34a"/>
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
          <ellipse cx="58" cy="78" rx="28" ry="20" fill="#ea580c"/>
          <polygon points="26,35 34,10 46,30" fill="#1e293b"/>
          <polygon points="56,30 68,10 76,35" fill="#1e293b"/>
          <polygon points="22,46 60,82 92,46" fill="#ea580c"/>
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
          <ellipse cx="44" cy="24" rx="7.5" ry="22" fill="#cbd5e1"/>
          <ellipse cx="68" cy="24" rx="7.5" ry="22" fill="#cbd5e1"/>
          <ellipse cx="56" cy="76" rx="26" ry="22" fill="#e2e8f0"/>
          <circle cx="50" cy="54" r="18" fill="#e2e8f0"/>
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
      `
    };

    return avatars[animalKey] || avatars.squirrel;
  }

  // Visual Word Wall Modal Renderer
  renderVisualWordWall(container) {
    const words = window.JUNGLE_DATA.wordWall;
    container.innerHTML = `
      <div class="modal-card" style="max-width:960px; border-color:#10b981;">
        <div class="modal-header">
          <div class="modal-title">
            <span>🖼️</span>
            <span>VISUAL JUNGLE WORD WALL</span>
          </div>
          <button class="modal-close-btn" id="btn-close-word-wall">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:14px; max-height:65vh; overflow-y:auto; padding:6px;">
          ${words.map(w => `
            <div class="word-wall-card" data-word="${w.word}" data-desc="${w.desc}" style="background:#f8fafc; border:3px solid #cbd5e1; border-radius:var(--radius-lg); padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; touch-action:manipulation; transition:transform 0.2s;">
              <span style="font-size:3.2rem; margin-bottom:6px;">${w.icon}</span>
              <span style="font-family:var(--font-display); font-weight:900; font-size:1.25rem; color:#0f172a;">${w.word}</span>
              <span style="font-size:0.9rem; color:#64748b; margin-top:4px;">${w.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.jungleViews = new JungleViewsRenderer();
