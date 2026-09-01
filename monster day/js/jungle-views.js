/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Realistic Storybook Nature Illustrations & Interactive Stage Views
   ========================================================================== */

class JungleViewsRenderer {
  constructor() {}

  // =========================================================================
  // REALISTIC STORYBOOK ANIMAL SVG ILLUSTRATIONS
  // =========================================================================
  getAnimalAvatar(animalKey, size = 130) {
    const realisticAnimals = {
      // 🐿️ SQUIRREL (Sitting on tree with acorn)
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
          <!-- Oak Tree Branch -->
          <path d="M 0 100 Q 60 95 120 105 L 120 120 L 0 120 Z" fill="#582f0e"/>
          <path d="M 20 98 Q 50 96 80 99" stroke="#7f4f24" stroke-width="2" fill="none"/>
          <circle cx="25" cy="98" r="4" fill="#65a30d"/>
          <!-- Bushy Shaded Tail -->
          <path d="M 68 85 C 105 78 118 25 88 15 C 68 8 62 32 72 48 C 80 60 76 75 66 82 Z" fill="url(#sq-tail)" stroke="#7c2d12" stroke-width="1.5"/>
          <path d="M 78 22 C 95 32 92 65 72 75" stroke="#fed7aa" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
          <!-- Body -->
          <ellipse cx="50" cy="74" rx="22" ry="24" fill="url(#sq-body)"/>
          <!-- Fluffy White Chest -->
          <path d="M 42 58 Q 52 70 46 88 Q 36 78 40 60 Z" fill="url(#sq-chest)"/>
          <!-- Hind Leg -->
          <ellipse cx="60" cy="85" rx="14" ry="10" fill="#c2410c" transform="rotate(-15, 60, 85)"/>
          <!-- Head -->
          <circle cx="44" cy="46" r="17" fill="url(#sq-body)"/>
          <!-- Ears with Fur Tufts -->
          <path d="M 34 35 Q 36 20 40 32 Z" fill="#9a3412"/>
          <path d="M 46 34 Q 50 18 53 32 Z" fill="#9a3412"/>
          <path d="M 36 24 L 38 18 M 49 22 L 51 16" stroke="#ea580c" stroke-width="1.5"/>
          <!-- Eye -->
          <ellipse cx="38" cy="44" rx="4.5" ry="5" fill="#1e1b4b"/>
          <circle cx="39.5" cy="42.5" r="1.8" fill="#ffffff"/>
          <circle cx="41" cy="45" r="0.8" fill="#ffffff"/>
          <!-- Snout & Whiskers -->
          <path d="M 28 48 Q 32 54 38 52" stroke="#7c2d12" stroke-width="1.2" fill="none"/>
          <circle cx="28" cy="48" r="2.2" fill="#271a0c"/>
          <line x1="26" y1="46" x2="16" y2="44" stroke="#78350f" stroke-width="0.8"/>
          <line x1="26" y1="49" x2="15" y2="50" stroke="#78350f" stroke-width="0.8"/>
          <line x1="26" y1="52" x2="17" y2="56" stroke="#78350f" stroke-width="0.8"/>
          <!-- Paws holding Acorn -->
          <ellipse cx="44" cy="66" rx="5" ry="4" fill="#9a3412"/>
          <!-- Realistic Acorn -->
          <ellipse cx="38" cy="68" rx="6" ry="7" fill="#78350f"/>
          <path d="M 33 64 Q 38 60 43 64 Z" fill="#451a03"/>
          <line x1="38" y1="61" x2="38" y2="57" stroke="#451a03" stroke-width="1.5"/>
        </svg>
      `,

      // 🐸 FROG (Sitting near pond on lily pad)
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
          <!-- Lily Pad with Water Veins -->
          <path d="M 15 95 C 20 75 100 75 105 95 C 100 115 20 115 15 95 Z" fill="#15803d"/>
          <path d="M 60 95 L 20 85 M 60 95 L 100 85 M 60 95 L 35 110 M 60 95 L 85 110" stroke="#166534" stroke-width="1.5"/>
          <!-- Water ripples -->
          <ellipse cx="60" cy="100" rx="55" ry="12" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
          <!-- Strong Hind Legs -->
          <ellipse cx="32" cy="85" rx="16" ry="12" fill="#15803d" transform="rotate(-30, 32, 85)"/>
          <ellipse cx="88" cy="85" rx="16" ry="12" fill="#15803d" transform="rotate(30, 88, 85)"/>
          <!-- Webbed Toes -->
          <circle cx="22" cy="94" r="3" fill="#16a34a"/>
          <circle cx="18" cy="92" r="3" fill="#16a34a"/>
          <circle cx="26" cy="96" r="3" fill="#16a34a"/>
          <circle cx="98" cy="94" r="3" fill="#16a34a"/>
          <circle cx="102" cy="92" r="3" fill="#16a34a"/>
          <circle cx="94" cy="96" r="3" fill="#16a34a"/>
          <!-- Body -->
          <ellipse cx="60" cy="76" rx="26" ry="20" fill="url(#fr-skin)"/>
          <ellipse cx="60" cy="80" rx="18" ry="12" fill="url(#fr-belly)"/>
          <!-- Front Legs -->
          <ellipse cx="44" cy="88" rx="5" ry="10" fill="#16a34a"/>
          <ellipse cx="76" cy="88" rx="5" ry="10" fill="#16a34a"/>
          <!-- Big Bulging Frog Eyes -->
          <circle cx="44" cy="48" r="14" fill="url(#fr-skin)"/>
          <circle cx="76" cy="48" r="14" fill="url(#fr-skin)"/>
          <!-- Golden Iris -->
          <circle cx="44" cy="48" r="9" fill="#facc15"/>
          <circle cx="76" cy="48" r="9" fill="#facc15"/>
          <!-- Horizontal Pupil (Realistic Amphibian) -->
          <ellipse cx="44" cy="48" rx="7" ry="3.5" fill="#022c22"/>
          <ellipse cx="76" cy="48" rx="7" ry="3.5" fill="#022c22"/>
          <circle cx="46" cy="46" r="2" fill="#ffffff"/>
          <circle cx="78" cy="46" r="2" fill="#ffffff"/>
          <!-- Mouth with Throat Pouch -->
          <path d="M 38 68 Q 60 76 82 68" stroke="#064e3b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="60" cy="71" rx="12" ry="5" fill="#86efac" opacity="0.4"/>
          <!-- Mottled Skin Spots -->
          <circle cx="50" cy="65" r="2.5" fill="#14532d" opacity="0.7"/>
          <circle cx="70" cy="64" r="3" fill="#14532d" opacity="0.7"/>
          <circle cx="58" cy="62" r="2" fill="#14532d" opacity="0.7"/>
        </svg>
      `,

      // 🦊 FOX (Stalking in forest foliage)
      fox: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <linearGradient id="fox-coat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fb923c"/>
              <stop offset="50%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#9a3412"/>
            </linearGradient>
            <linearGradient id="fox-chest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#f8fafc"/>
            </linearGradient>
          </defs>
          <!-- Autumn Forest Floor Leaves -->
          <ellipse cx="60" cy="105" rx="50" ry="10" fill="#3f1d0b"/>
          <circle cx="30" cy="102" r="6" fill="#b45309"/>
          <circle cx="85" cy="104" r="5" fill="#d97706"/>
          <!-- Bushy Tail with White Tip -->
          <path d="M 80 85 C 115 88 120 50 100 40 C 90 35 85 50 82 70 Z" fill="url(#fox-coat)"/>
          <path d="M 102 42 C 108 45 116 52 110 60 C 105 55 100 48 102 42 Z" fill="#ffffff"/>
          <!-- Body -->
          <ellipse cx="58" cy="78" rx="28" ry="20" fill="url(#fox-coat)"/>
          <!-- Slender Paws with Black Stockings -->
          <path d="M 42 85 L 40 102" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 52 88 L 50 104" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 72 86 L 74 102" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
          <!-- Fluffy White Chest -->
          <path d="M 45 58 Q 58 72 48 88 Q 38 74 45 58 Z" fill="url(#fox-chest)"/>
          <!-- Pointed Triangular Ears with Black Backing -->
          <polygon points="26,35 34,10 46,30" fill="#1e293b"/>
          <polygon points="30,32 35,16 42,28" fill="#fed7aa"/>
          <polygon points="56,30 68,10 76,35" fill="#1e293b"/>
          <polygon points="60,28 67,16 72,32" fill="#fed7aa"/>
          <!-- Sleek Fox Head & Snout -->
          <polygon points="22,46 60,82 92,46" fill="url(#fox-coat)"/>
          <!-- White Cheeks -->
          <polygon points="28,48 60,76 44,48" fill="#ffffff"/>
          <polygon points="92,48 60,76 76,48" fill="#ffffff"/>
          <!-- Intelligent Amber Eyes -->
          <ellipse cx="44" cy="46" rx="4.5" ry="3" fill="#d97706" transform="rotate(-15, 44, 46)"/>
          <circle cx="44" cy="46" r="2.2" fill="#0f172a"/>
          <circle cx="45" cy="45" r="0.9" fill="#ffffff"/>
          <ellipse cx="76" cy="46" rx="4.5" ry="3" fill="#d97706" transform="rotate(15, 76, 46)"/>
          <circle cx="76" cy="46" r="2.2" fill="#0f172a"/>
          <circle cx="77" cy="45" r="0.9" fill="#ffffff"/>
          <!-- Black Nose Tip & Whiskers -->
          <ellipse cx="60" cy="79" rx="3.8" ry="2.8" fill="#020617"/>
          <line x1="56" y1="76" x2="38" y2="74" stroke="#1e293b" stroke-width="0.8"/>
          <line x1="64" y1="76" x2="82" y2="74" stroke="#1e293b" stroke-width="0.8"/>
        </svg>
      `,

      // 🐇 RABBIT (Sitting in meadow grass near burrow)
      rabbit: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <linearGradient id="rb-fur" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="50%" stop-color="#e2e8f0"/>
              <stop offset="100%" stop-color="#94a3b8"/>
            </linearGradient>
            <linearGradient id="rb-ear-pink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fbcfe8"/>
              <stop offset="100%" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <!-- Meadow Grass & Burrow Hole -->
          <ellipse cx="60" cy="104" rx="48" ry="12" fill="#2d5a27"/>
          <ellipse cx="85" cy="102" rx="14" ry="7" fill="#1c1917"/>
          <!-- Long Realistic Ears -->
          <ellipse cx="44" cy="24" rx="7.5" ry="22" fill="url(#rb-fur)" stroke="#cbd5e1" stroke-width="1.5" transform="rotate(-10, 44, 24)"/>
          <ellipse cx="44" cy="24" rx="4.5" ry="16" fill="url(#rb-ear-pink)" transform="rotate(-10, 44, 24)"/>
          <ellipse cx="68" cy="24" rx="7.5" ry="22" fill="url(#rb-fur)" stroke="#cbd5e1" stroke-width="1.5" transform="rotate(10, 68, 24)"/>
          <ellipse cx="68" cy="24" rx="4.5" ry="16" fill="url(#rb-ear-pink)" transform="rotate(10, 68, 24)"/>
          <!-- Fluffy Round Body -->
          <ellipse cx="56" cy="76" rx="26" ry="22" fill="url(#rb-fur)"/>
          <!-- Fluffy Cotton Tail -->
          <circle cx="86" cy="78" r="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
          <!-- Paws -->
          <ellipse cx="42" cy="94" rx="8" ry="5" fill="#ffffff"/>
          <ellipse cx="62" cy="94" rx="8" ry="5" fill="#ffffff"/>
          <!-- Head -->
          <circle cx="50" cy="54" r="18" fill="url(#rb-fur)"/>
          <!-- Dark Gentle Eye -->
          <ellipse cx="42" cy="50" rx="4" ry="5" fill="#1e1b4b"/>
          <circle cx="43.5" cy="48.5" r="1.5" fill="#ffffff"/>
          <!-- Pink Twitching Nose & Whiskers -->
          <polygon points="34,58 38,58 36,62" fill="#f472b6"/>
          <line x1="32" y1="56" x2="16" y2="52" stroke="#64748b" stroke-width="1"/>
          <line x1="32" y1="59" x2="14" y2="59" stroke="#64748b" stroke-width="1"/>
          <line x1="32" y1="62" x2="16" y2="66" stroke="#64748b" stroke-width="1"/>
        </svg>
      `,

      // 🐻 BEAR (Strong brown bear standing near river)
      bear: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <defs>
            <radialGradient id="br-fur" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#854d0e"/>
              <stop offset="60%" stop-color="#582f0e"/>
              <stop offset="100%" stop-color="#271a0c"/>
            </radialGradient>
          </defs>
          <!-- River Rocks & Foam -->
          <ellipse cx="60" cy="106" rx="52" ry="10" fill="#334155"/>
          <ellipse cx="30" cy="104" rx="14" ry="6" fill="#64748b"/>
          <ellipse cx="85" cy="105" rx="18" ry="7" fill="#475569"/>
          <!-- Round Furry Ears -->
          <circle cx="34" cy="30" r="11" fill="url(#br-fur)"/>
          <circle cx="34" cy="30" r="5.5" fill="#3f1d0b"/>
          <circle cx="78" cy="30" r="11" fill="url(#br-fur)"/>
          <circle cx="78" cy="30" r="5.5" fill="#3f1d0b"/>
          <!-- Massive Head & Shoulders -->
          <ellipse cx="56" cy="74" rx="34" ry="26" fill="url(#br-fur)"/>
          <circle cx="56" cy="50" r="26" fill="url(#br-fur)"/>
          <!-- Powerful Paws with Claws -->
          <ellipse cx="38" cy="95" rx="12" ry="8" fill="#3f1d0b"/>
          <line x1="32" y1="99" x2="30" y2="104" stroke="#0f172a" stroke-width="2"/>
          <line x1="38" y1="100" x2="38" y2="105" stroke="#0f172a" stroke-width="2"/>
          <line x1="44" y1="99" x2="46" y2="104" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="74" cy="95" rx="12" ry="8" fill="#3f1d0b"/>
          <!-- Lighter Snout -->
          <ellipse cx="56" cy="58" rx="15" ry="11" fill="#d97706" opacity="0.85"/>
          <!-- Nose & Mouth -->
          <ellipse cx="56" cy="54" rx="6.5" ry="4.5" fill="#09090b"/>
          <path d="M 56 58 L 56 64 M 50 63 Q 56 67 62 63" stroke="#271a0c" stroke-width="2.5" fill="none"/>
          <!-- Eyes -->
          <circle cx="44" cy="44" r="3.5" fill="#1c1917"/>
          <circle cx="45" cy="43" r="1.2" fill="#ffffff"/>
          <circle cx="68" cy="44" r="3.5" fill="#1c1917"/>
          <circle cx="69" cy="43" r="1.2" fill="#ffffff"/>
        </svg>
      `,

      // 🦉 OWL (Perched on oak branch)
      owl: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <!-- Mossy Branch -->
          <path d="M 10 95 Q 60 90 110 98" stroke="#451a03" stroke-width="9" stroke-linecap="round"/>
          <circle cx="40" cy="92" r="3" fill="#84cc16"/>
          <!-- Feathered Ear Tufts -->
          <polygon points="32,32 38,12 48,28" fill="#475569"/>
          <polygon points="68,28 78,12 84,32" fill="#475569"/>
          <!-- Body with Speckled Feathers -->
          <ellipse cx="58" cy="64" rx="26" ry="28" fill="#64748b"/>
          <ellipse cx="58" cy="68" rx="18" ry="20" fill="#f8fafc"/>
          <!-- Feather chevrons -->
          <path d="M 52 62 L 58 66 L 64 62 M 50 72 L 58 76 L 66 72" stroke="#475569" stroke-width="1.5" fill="none"/>
          <!-- Talons gripping wood -->
          <path d="M 46 90 L 46 98 M 52 90 L 52 98 M 64 90 L 64 98 M 70 90 L 70 98" stroke="#f59e0b" stroke-width="3"/>
          <!-- Big Nocturnal Eyes -->
          <circle cx="44" cy="44" r="13" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="44" cy="44" r="7.5" fill="#09090b"/>
          <circle cx="46" cy="42" r="2" fill="#ffffff"/>
          <circle cx="72" cy="44" r="13" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="72" cy="44" r="7.5" fill="#09090b"/>
          <circle cx="74" cy="42" r="2" fill="#ffffff"/>
          <!-- Sharp Curved Beak -->
          <polygon points="54,48 62,48 58,60" fill="#ea580c"/>
        </svg>
      `,

      // 🦝 RACCOON
      raccoon: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <circle cx="60" cy="60" r="48" fill="#f1f5f9" stroke="#475569" stroke-width="3"/>
          <!-- Ears -->
          <polygon points="34,32 40,16 50,30" fill="#334155"/>
          <polygon points="68,30 78,16 84,32" fill="#334155"/>
          <!-- Body -->
          <ellipse cx="60" cy="74" rx="26" ry="22" fill="#64748b"/>
          <!-- Head -->
          <circle cx="60" cy="52" r="24" fill="#94a3b8"/>
          <!-- Bandit Mask -->
          <path d="M 38 48 Q 60 54 82 48 Q 78 60 60 56 Q 42 60 38 48 Z" fill="#0f172a"/>
          <!-- White Eye Patches -->
          <circle cx="48" cy="50" r="7" fill="#ffffff"/>
          <circle cx="72" cy="50" r="7" fill="#ffffff"/>
          <circle cx="48" cy="50" r="4" fill="#0f172a"/>
          <circle cx="49" cy="49" r="1.2" fill="#ffffff"/>
          <circle cx="72" cy="50" r="4" fill="#0f172a"/>
          <circle cx="73" cy="49" r="1.2" fill="#ffffff"/>
          <!-- Snout -->
          <ellipse cx="60" cy="62" rx="9" ry="7" fill="#ffffff"/>
          <ellipse cx="60" cy="60" rx="4" ry="3" fill="#0f172a"/>
        </svg>
      `,

      // 🦅 EAGLE
      eagle: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <!-- Mountain Sky -->
          <circle cx="60" cy="60" r="48" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
          <!-- Majestic Wings Spread -->
          <path d="M 15 50 C 40 25 55 45 60 55 C 65 45 80 25 105 50 C 85 75 60 70 15 50 Z" fill="#451a03"/>
          <!-- White Head Feathers -->
          <path d="M 48 35 Q 60 20 72 35 Q 68 55 60 55 Q 52 55 48 35 Z" fill="#ffffff"/>
          <!-- Piercing Yellow Eye -->
          <circle cx="54" cy="38" r="3" fill="#eab308"/>
          <circle cx="54" cy="38" r="1.5" fill="#000000"/>
          <!-- Sharp Golden Hooked Beak -->
          <path d="M 60 36 Q 72 40 68 50 Q 62 46 60 44 Z" fill="#f59e0b"/>
        </svg>
      `,

      // 🦌 DEER
      deer: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <circle cx="60" cy="60" r="48" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
          <!-- Antler branches -->
          <path d="M 46 28 L 38 12 M 42 20 L 48 14 M 74 28 L 82 12 M 78 20 L 72 14" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Head -->
          <ellipse cx="60" cy="46" rx="16" ry="18" fill="#b45309"/>
          <ellipse cx="60" cy="54" rx="9" ry="8" fill="#fed7aa"/>
          <ellipse cx="60" cy="52" rx="4" ry="2.5" fill="#1e1b4b"/>
          <!-- Ears -->
          <ellipse cx="40" cy="34" rx="8" ry="4" fill="#b45309" transform="rotate(-30, 40, 34)"/>
          <ellipse cx="80" cy="34" rx="8" ry="4" fill="#b45309" transform="rotate(30, 80, 34)"/>
          <!-- Eyes -->
          <circle cx="48" cy="42" r="3.5" fill="#0f172a"/>
          <circle cx="49" cy="41" r="1" fill="#ffffff"/>
          <circle cx="72" cy="42" r="3.5" fill="#0f172a"/>
          <circle cx="73" cy="41" r="1" fill="#ffffff"/>
        </svg>
      `,

      // 🐟 FISH
      fish: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <circle cx="60" cy="60" r="48" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
          <!-- Tail Fin -->
          <polygon points="85,60 105,42 100,60 105,78" fill="#f43f5e"/>
          <!-- Fish Body with Iridescent Scales -->
          <ellipse cx="55" cy="60" rx="32" ry="16" fill="#38bdf8"/>
          <!-- Lateral Rainbow Stripe -->
          <path d="M 30 60 Q 55 58 85 60" stroke="#fb7185" stroke-width="4" fill="none"/>
          <!-- Eye -->
          <circle cx="35" cy="56" r="4.5" fill="#ffffff"/>
          <circle cx="34" cy="56" r="2.5" fill="#0f172a"/>
          <circle cx="35" cy="55" r="0.9" fill="#ffffff"/>
          <!-- Gills -->
          <path d="M 44 54 Q 48 60 44 66" stroke="#0369a1" stroke-width="1.8" fill="none"/>
        </svg>
      `,

      // 🐦 SMALL BIRD
      bird: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <circle cx="60" cy="60" r="48" fill="#f0fdf4" stroke="#16a34a" stroke-width="3"/>
          <!-- Bluebird Body -->
          <ellipse cx="60" cy="65" rx="20" ry="16" fill="#0284c7"/>
          <!-- Red/Orange Breast -->
          <ellipse cx="50" cy="68" rx="12" ry="12" fill="#ea580c"/>
          <!-- Head -->
          <circle cx="48" cy="48" r="13" fill="#0284c7"/>
          <circle cx="44" cy="46" r="3" fill="#0f172a"/>
          <circle cx="45" cy="45" r="1" fill="#ffffff"/>
          <!-- Beak -->
          <polygon points="36,48 24,52 36,54" fill="#f59e0b"/>
          <!-- Wing -->
          <path d="M 52 58 Q 78 54 82 72 Q 62 76 52 58 Z" fill="#0369a1"/>
        </svg>
      `,

      // 🦋 BUTTERFLY
      butterfly: `
        <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="actor-avatar-svg realistic-animal">
          <circle cx="60" cy="60" r="48" fill="#fdf2f8" stroke="#ec4899" stroke-width="3"/>
          <!-- Top Wings -->
          <ellipse cx="44" cy="44" rx="18" ry="22" fill="#f97316" stroke="#c2410c" stroke-width="1.5" transform="rotate(-25, 44, 44)"/>
          <ellipse cx="76" cy="44" rx="18" ry="22" fill="#f97316" stroke="#c2410c" stroke-width="1.5" transform="rotate(25, 76, 44)"/>
          <!-- Wing Patterns -->
          <circle cx="44" cy="40" r="4" fill="#ffffff"/>
          <circle cx="76" cy="40" r="4" fill="#ffffff"/>
          <!-- Bottom Wings -->
          <ellipse cx="48" cy="74" rx="12" ry="16" fill="#fb923c" transform="rotate(-15, 48, 74)"/>
          <ellipse cx="72" cy="74" rx="12" ry="16" fill="#fb923c" transform="rotate(15, 72, 74)"/>
          <!-- Slender Body & Antennae -->
          <ellipse cx="60" cy="58" rx="3.5" ry="18" fill="#0f172a"/>
          <path d="M 58 40 Q 52 28 46 30 M 62 40 Q 68 28 74 30" stroke="#0f172a" stroke-width="1.5" fill="none"/>
        </svg>
      `
    };

    return realisticAnimals[animalKey] || realisticAnimals.squirrel;
  }

  // =========================================================================
  // CHAPTER 1: WELCOME TO GREEN VALLEY (OPEN VISUAL EXPLORATION)
  // =========================================================================
  renderOpenExploration(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:1150px;">
          <!-- Discovery Tracker Header -->
          <div style="display:flex; justify-content:space-between; width:100%; align-items:center; background:rgba(0,0,0,0.45); padding:8px 20px; border-radius:var(--radius-full); border:1px solid rgba(255,255,255,0.2);">
            <span style="font-family:var(--font-display); font-size:1.15rem; color:#fef3c7; font-weight:800;">
              🔍 Touch any animal or plant to explore Green Valley!
            </span>
            <span class="prediction-badge" style="background:#059669;" id="explore-found-count">
              Found: 0 / ${chapter.hotspots.length}
            </span>
          </div>

          <!-- Panoramic Living Ecosystem Canvas -->
          <div style="position:relative; width:100%; height:400px; background:linear-gradient(180deg, #38bdf8 0%, #86efac 45%, #15803d 85%); border-radius:var(--radius-xl); border:4px solid #10b981; overflow:hidden; box-shadow:var(--shadow-lg);">
            <!-- Illustrated Landscape Backdrop -->
            <svg viewBox="0 0 1000 400" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
              <!-- Distant Mountains -->
              <polygon points="0,220 180,120 360,240 540,110 750,230 1000,160 1000,400 0,400" fill="#047857" opacity="0.5"/>
              <!-- Forest Canopy Trees -->
              <circle cx="220" cy="180" r="90" fill="#15803d"/>
              <circle cx="340" cy="190" r="80" fill="#166534"/>
              <circle cx="100" cy="200" r="75" fill="#14532d"/>
              <!-- River & Wetland Pond -->
              <path d="M 500 240 Q 650 250 680 320 Q 720 400 800 400 L 580 400 Q 560 330 460 270 Z" fill="#38bdf8"/>
              <ellipse cx="720" cy="340" rx="90" ry="35" fill="#0284c7" opacity="0.8"/>
              <circle cx="700" cy="335" r="18" fill="#22c55e"/>
            </svg>

            <!-- Interactive Touch Hotspots -->
            ${chapter.hotspots.map(h => `
              <div class="explore-hotspot" data-id="${h.id}" data-sound="${h.sound}" style="position:absolute; left:${h.x}%; top:${h.y}%; cursor:pointer; transform:translate(-50%, -50%); transition:transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <div style="background:rgba(255,255,255,0.92); border:3px solid #10b981; border-radius:var(--radius-full); padding:8px 14px; display:flex; align-items:center; gap:8px; box-shadow:var(--shadow-md);">
                  <span style="font-size:2.2rem;">${h.emoji}</span>
                  <span style="font-family:var(--font-display); font-weight:800; font-size:1.05rem; color:#065f46;">${h.name}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 2: RANGER EYES (HIDDEN ANIMAL NATURE SEARCH)
  // =========================================================================
  renderRangerEyes(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1100px;">
          <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800; text-align:center;">
            🔎 RANGER EYES: Can you find all 5 hidden animals in nature?
          </div>

          <!-- Target Checklist -->
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            ${chapter.targets.map(t => `
              <div class="target-check-pill" id="target-pill-${t.id}" style="background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.3); border-radius:var(--radius-full); padding:6px 16px; color:#fff; font-family:var(--font-display); font-weight:700;">
                <span>${t.name}</span> <span>❓</span>
              </div>
            `).join('')}
          </div>

          <!-- Illustrated Hidden Nature Scene -->
          <div style="position:relative; width:100%; height:380px; background:#064e3b; border-radius:var(--radius-xl); border:4px solid #34d399; overflow:hidden;">
            <!-- Tree area with squirrel & owl -->
            <div class="nature-spot-btn" data-target="squirrel" style="position:absolute; top:25%; left:22%; cursor:pointer;">
              ${this.getAnimalAvatar("squirrel", 80)}
            </div>
            <div class="nature-spot-btn" data-target="owl" style="position:absolute; top:18%; left:78%; cursor:pointer;">
              ${this.getAnimalAvatar("owl", 75)}
            </div>
            <!-- Pond area with frog -->
            <div class="nature-spot-btn" data-target="frog" style="position:absolute; top:68%; left:65%; cursor:pointer;">
              ${this.getAnimalAvatar("frog", 80)}
            </div>
            <!-- Bushes area with fox -->
            <div class="nature-spot-btn" data-target="fox" style="position:absolute; top:58%; left:42%; cursor:pointer;">
              ${this.getAnimalAvatar("fox", 80)}
            </div>
            <!-- Meadow with rabbit -->
            <div class="nature-spot-btn" data-target="rabbit" style="position:absolute; top:70%; left:12%; cursor:pointer;">
              ${this.getAnimalAvatar("rabbit", 75)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 3: WHO AM I? (VISUAL CLUES VOCABULARY)
  // =========================================================================
  renderWhoAmI(container, chapter, currentPuzzleIdx = 0) {
    const puzzle = chapter.puzzles[currentPuzzleIdx] || chapter.puzzles[0];
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:850px;">
          <div class="prediction-badge" style="background:#0284c7;">
            🐾 WHO AM I? (Puzzle ${currentPuzzleIdx + 1} of ${chapter.puzzles.length})
          </div>

          <!-- Mystery Card with Clues -->
          <div style="background:#fff; border-radius:var(--radius-xl); border:4px solid #38bdf8; padding:24px; width:100%; box-shadow:var(--shadow-lg); text-align:center;">
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:18px;">
              ${puzzle.clues.map(c => `
                <div style="font-family:var(--font-display); font-size:1.35rem; font-weight:700; color:#1e293b; background:#f0f9ff; padding:10px 16px; border-radius:var(--radius-md); border-left:6px solid #0284c7;">
                  ${c}
                </div>
              `).join('')}
            </div>

            <!-- Reveal Container -->
            <div id="who-am-i-revealed" style="display:none; animation:popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
              ${this.getAnimalAvatar(puzzle.animalId, 110)}
              <div style="font-family:var(--font-display); font-size:2rem; font-weight:900; color:#059669; margin-top:8px;">
                IT'S A ${puzzle.name}! 🌟
              </div>
            </div>

            <button class="hud-btn hud-btn-teacher" id="btn-reveal-who-am-i" style="font-size:1.2rem; padding:12px 28px; margin-top:12px;">
              <span>👁️ REVEAL ANIMAL ➔</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 4: MATCH THE ANIMAL (TOUCH & DRAG SNAP)
  // =========================================================================
  renderMatchAnimal(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1100px;">
          <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800; text-align:center;">
            🐾 Drag or Tap each word card onto the matching realistic animal picture:
          </div>

          <!-- 4 Realistic Animal Picture Cards (Drop Targets) -->
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
            ${chapter.pairs.map(p => `
              <div class="drop-target animal-match-target" data-animal="${p.id}" style="width:230px; height:240px; background:#fff; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:14px; box-shadow:var(--shadow-md);">
                ${this.getAnimalAvatar(p.id, 105)}
                <div class="matched-slot-label" style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:#64748b; background:#f1f5f9; width:100%; text-align:center; padding:6px 0; border-radius:var(--radius-full);">
                  [ Drop Word Here ]
                </div>
              </div>
            `).join('')}
          </div>

          <!-- 4 Word Cards to Drag/Tap -->
          <div class="items-palette">
            ${chapter.pairs.map(p => `
              <div class="item-card draggable-item word-match-card" data-word="${p.id}" style="cursor:grab; min-width:140px;">
                <span class="item-label" style="font-size:1.3rem; letter-spacing:0.05em;">${p.word}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 5: WHERE DOES IT LIVE? (REAL BIOMES)
  // =========================================================================
  renderWhereDoesItLive(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1150px;">
          <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
            🏡 Drag each animal into its real home environment:
          </div>

          <!-- 4 Biomes (Drop Targets) -->
          <div class="habitat-zones-container">
            ${chapter.environments.map(env => `
              <div class="habitat-zone-card ${env.id}-zone drop-target biome-target" data-biome="${env.id}">
                <div class="habitat-header">${env.name}</div>
                <div class="habitat-actor-slot" style="font-size:1.1rem; color:#fff; text-align:center; padding:6px;">
                  ❓ Drop Animal
                </div>
                <div class="habitat-tag">${env.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- Available Animals Palette -->
          <div class="items-palette">
            ${chapter.items.map(it => `
              <div class="item-card draggable-item biome-animal-item" data-id="${it.id}" data-target="${it.target}">
                <span class="item-emoji">${it.emoji}</span>
                <span class="item-label">${it.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 7: ANIMAL HOMES (SHELTER)
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
              <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:16px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                <div style="font-family:var(--font-display); font-size:1.3rem; font-weight:800; color:#1e293b;">
                  ${p.animal}
                </div>
                <span style="font-size:1.8rem; color:#10b981;">➔</span>
                <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:6px 16px; font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:#065f46;">
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
          <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800; text-align:center;">
            🦊 WHO EATS WHO? (The Food Chain Connection)
          </div>

          <!-- Animated Food Relationship Nodes -->
          <div style="display:flex; align-items:center; justify-content:center; gap:20px; width:100%; background:rgba(255,255,255,0.96); padding:24px; border-radius:var(--radius-xl); box-shadow:var(--shadow-lg);">
            <div style="text-align:center;">
              <span style="font-size:3.5rem;">🌱</span>
              <div style="font-family:var(--font-display); font-weight:800; color:#15803d; font-size:1.15rem;">Green Plant</div>
              <div style="font-size:0.85rem; color:#475569;">Producer</div>
            </div>

            <span style="font-size:2.5rem; color:#f59e0b; animation:pulseArrow 1.5s infinite;">➔</span>

            <div style="text-align:center; cursor:pointer;" id="node-prey">
              ${this.getAnimalAvatar("rabbit", 90)}
              <div style="font-family:var(--font-display); font-weight:800; color:#0369a1; font-size:1.15rem;">Rabbit 🐇</div>
              <div class="prediction-badge" style="background:#0284c7; font-size:0.85rem; padding:2px 10px;">PREY 🐇</div>
            </div>

            <span style="font-size:2.5rem; color:#f59e0b; animation:pulseArrow 1.5s infinite;">➔</span>

            <div style="text-align:center; cursor:pointer;" id="node-predator">
              ${this.getAnimalAvatar("fox", 90)}
              <div style="font-family:var(--font-display); font-weight:800; color:#b91c1c; font-size:1.15rem;">Fox 🦊</div>
              <div class="prediction-badge" style="background:#dc2626; font-size:0.85rem; padding:2px 10px;">PREDATOR 🦊</div>
            </div>
          </div>

          <!-- Simple Definitions -->
          <div style="display:flex; gap:16px; width:100%;">
            ${chapter.definitions.map(d => `
              <div style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:var(--radius-lg); padding:12px 18px; color:#fff;">
                <b style="color:#fbbf24; font-size:1.1rem;">${d.word}:</b>
                <span style="font-size:1rem; margin-left:6px;">${d.desc}</span>
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
          <div style="font-family:var(--font-display); font-size:1.5rem; color:#fbbf24; font-weight:900; text-shadow:0 2px 6px rgba(0,0,0,0.6);">
            🌎 ECOSYSTEM = Everything is Connected!
          </div>

          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; width:100%;">
            ${chapter.connections.map(c => `
              <div style="background:rgba(255,255,255,0.95); border:3px solid #10b981; border-radius:var(--radius-xl); padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; box-shadow:var(--shadow-md);">
                <div style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:#065f46;">
                  ${c.from} ➔ ${c.to}
                </div>
                <div style="font-size:0.95rem; color:#475569; font-weight:700;">
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
          <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
            🔮 Story Preview: What will happen in Green Valley?
          </div>

          <div style="display:flex; gap:14px; width:100%; justify-content:center;">
            ${chapter.cards.map(c => `
              <div style="flex:1; max-width:260px; background:#fff; border-radius:var(--radius-xl); border:3px solid #cbd5e1; padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px; box-shadow:var(--shadow-md);">
                <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#065f46;">
                  ${c.title}
                </div>
                <p style="font-size:0.95rem; color:#475569; line-height:1.3;">
                  ${c.desc}
                </p>
              </div>
            `).join('')}
          </div>

          <button class="hud-btn hud-btn-teacher" id="btn-begin-storm-story" style="margin-top:14px; font-size:1.3rem; padding:14px 32px; background:linear-gradient(135deg, #ef4444, #b91c1c); border-color:#fca5a5;">
            <span>⛈️ ENTER THE GREAT STORM ➔</span>
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VISUAL WORD WALL DRAWER (ACCESSIBLE FROM EVERY SCENE)
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
            <div class="word-wall-card" data-word="${w.word}" data-desc="${w.desc}" style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:var(--radius-lg); padding:12px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; transition:transform 0.2s, border-color 0.2s;">
              <span style="font-size:2.8rem; margin-bottom:4px;">${w.icon}</span>
              <span style="font-family:var(--font-display); font-weight:800; font-size:1.1rem; color:#0f172a;">${w.word}</span>
              <span style="font-size:0.8rem; color:#64748b; margin-top:4px;">${w.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Global instance
window.jungleViews = new JungleViewsRenderer();
