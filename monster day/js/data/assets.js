/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Environment, Shelter, Food, Science & Tool SVG Assets
 */

export const ASSETS = {
  // Habitats & Environments
  habitats: {
    forest: {
      id: 'forest',
      name: 'Lush Forest',
      title: 'The Tall Trees Forest',
      description: 'Lush green trees, soft moss, wildflowers, and cool shade.',
      sentence: 'The forest has tall green trees, sweet berries, and soft moss.',
      badgeIcon: '🌲',
      bgGradient: 'linear-gradient(180deg, #6EE7B7 0%, #059669 40%, #064E3B 100%)',
      elements: ['Tall Oak Trees', 'Berry Bushes', 'Fallen Logs', 'Wild Mushrooms', 'Sunbeams']
    },
    river: {
      id: 'river',
      name: 'Crystal River',
      title: 'The Rushing Riverbank',
      description: 'Cool rushing water, smooth pebbles, jumping fish, and clean riverbanks.',
      sentence: 'The river gives fresh water to the animals and fish swim here.',
      badgeIcon: '🌊',
      bgGradient: 'linear-gradient(180deg, #7DD3FC 0%, #0284C7 45%, #0369A1 100%)',
      elements: ['Clear Water', 'Smooth River Stones', 'Water Weeds', 'Riverbank Mud', 'Pebble Beach']
    },
    pond: {
      id: 'pond',
      name: 'Lilypad Pond',
      title: 'The Peaceful Pond',
      description: 'Still water, green floating lilypads, buzzing dragonflies, and reeds.',
      sentence: 'The pond is quiet with green lilypads and buzzing insects.',
      badgeIcon: '🐸',
      bgGradient: 'linear-gradient(180deg, #A7F3D0 0%, #10B981 40%, #047857 100%)',
      elements: ['Floating Lilypads', 'Cattail Reeds', 'Dragonflies', 'Gentle Ripples', 'Water Flowers']
    },
    grassland: {
      id: 'grassland',
      name: 'Sunlit Grassland',
      title: 'The Sunny Meadow',
      description: 'Tall golden-green grass, bright wildflowers, warm breeze, and butterflies.',
      sentence: 'The grassland has warm sunshine, blooming flowers, and soft grass.',
      badgeIcon: '🌾',
      bgGradient: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 35%, #10B981 100%)',
      elements: ['Wildflowers', 'Rolling Green Hills', 'Warm Sunshine', 'Fluttering Butterflies', 'Tall Grass']
    },
    mountain: {
      id: 'mountain',
      name: 'Misty Mountains',
      title: 'The Rocky Mountain Cliffs',
      description: 'High rock cliffs, evergreen pines, fresh mountain air, and clear caves.',
      sentence: 'The mountain has high rocky cliffs, deep caves, and pine trees.',
      badgeIcon: '⛰️',
      bgGradient: 'linear-gradient(180deg, #CBD5E1 0%, #64748B 40%, #334155 100%)',
      elements: ['Rocky Cliffs', 'Stone Caves', 'Pine Trees', 'Mountain Stream', 'High Clouds']
    }
  },

  // Animal Food Items with rich SVG icons and simple English names
  foods: {
    nuts: {
      id: 'nuts',
      name: 'Acorns & Nuts',
      targetAnimal: 'squirrel',
      type: 'herbivore',
      icon: '🌰',
      sentence: 'Squirrels love crunchy acorns and nuts.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#FEF3C7"/><path d="M28 35 Q40 18 52 35 Z" fill="#78350F" stroke="#451A03" stroke-width="2"/><ellipse cx="40" cy="50" rx="16" ry="18" fill="#B45309" stroke="#451A03" stroke-width="2"/><path d="M40 22 L40 14" stroke="#451A03" stroke-width="3" stroke-linecap="round"/></svg>`
    },
    insects: {
      id: 'insects',
      name: 'Flies & Bugs',
      targetAnimal: 'frog',
      type: 'carnivore',
      icon: '🪰',
      sentence: 'Frogs catch flying insects with their long tongues.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#E0F2FE"/><ellipse cx="40" cy="42" rx="10" ry="16" fill="#1E293B"/><ellipse cx="40" cy="28" rx="7" ry="7" fill="#1E293B"/><ellipse cx="28" cy="38" rx="12" ry="7" fill="#BAE6FD" opacity="0.8" transform="rotate(-30 28 38)"/><ellipse cx="52" cy="38" rx="12" ry="7" fill="#BAE6FD" opacity="0.8" transform="rotate(30 52 38)"/><circle cx="37" cy="26" r="2" fill="#EF4444"/><circle cx="43" cy="26" r="2" fill="#EF4444"/></svg>`
    },
    carrots_grass: {
      id: 'carrots_grass',
      name: 'Carrot & Grass',
      targetAnimal: 'rabbit',
      type: 'herbivore',
      icon: '🥕',
      sentence: 'Rabbits munch on sweet crunchy carrots and clover.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#FEF3C7"/><path d="M26 18 Q36 28 42 22 M40 16 Q46 26 44 20 M50 18 Q46 28 42 22" stroke="#15803D" stroke-width="3" stroke-linecap="round" fill="none"/><polygon points="42,22 55,25 28,68" fill="#EA580C" stroke="#C2410C" stroke-width="2"/><path d="M38 34 L46 36 M34 46 L42 48 M30 56 L36 58" stroke="#9A3412" stroke-width="2" stroke-linecap="round"/></svg>`
    },
    berries_and_fish: {
      id: 'berries_and_fish',
      name: 'Berries & Fish',
      targetAnimal: 'bear',
      type: 'omnivore',
      icon: '🫐',
      sentence: 'Bears eat fresh river salmon and sweet wild berries.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#FCE7F3"/><circle cx="30" cy="35" r="9" fill="#7C3AED" stroke="#5B21B6" stroke-width="2"/><circle cx="48" cy="32" r="8" fill="#4338CA" stroke="#312E81" stroke-width="2"/><circle cx="40" cy="46" r="10" fill="#6D28D9" stroke="#4C1D95" stroke-width="2"/><ellipse cx="44" cy="58" rx="16" ry="7" fill="#0284C7" stroke="#0369A1" stroke-width="1.5"/><polygon points="58,58 66,52 66,64" fill="#0284C7"/></svg>`
    },
    fish: {
      id: 'fish',
      name: 'Fresh Fish',
      targetAnimal: 'eagle',
      type: 'carnivore',
      icon: '🐟',
      sentence: 'Eagles and bears catch fresh swimming fish.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#E0F2FE"/><ellipse cx="38" cy="40" rx="20" ry="11" fill="#0284C7" stroke="#0369A1" stroke-width="2"/><polygon points="56,40 68,30 68,50" fill="#0284C7" stroke="#0369A1" stroke-width="2"/><circle cx="26" cy="38" r="2.5" fill="#FFF"/><circle cx="26" cy="38" r="1.2" fill="#1F2937"/><path d="M35 34 Q40 40 35 46" stroke="#38BDF8" stroke-width="2" fill="none"/></svg>`
    },
    leaves_grass: {
      id: 'leaves_grass',
      name: 'Tender Leaves',
      targetAnimal: 'deer',
      type: 'herbivore',
      icon: '🌿',
      sentence: 'Deer eat fresh green leaves and tender shoots.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#DCFCE7"/><path d="M40 64 Q40 35 55 24 Q30 25 25 50 Q28 62 40 64 Z" fill="#16A34A" stroke="#14532D" stroke-width="2"/><path d="M40 64 Q40 45 46 32" stroke="#86EFAC" stroke-width="2" fill="none"/><path d="M40 64 Q40 38 28 28 Q52 30 52 54 Z" fill="#22C55E" opacity="0.7"/></svg>`
    },
    nectar: {
      id: 'nectar',
      name: 'Flower Nectar',
      targetAnimal: 'butterfly',
      type: 'herbivore',
      icon: '🌸',
      sentence: 'Butterflies sip sweet flower nectar.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#FDF2F8"/><circle cx="40" cy="40" r="12" fill="#F59E0B" stroke="#D97724" stroke-width="2"/><ellipse cx="40" cy="22" rx="7" ry="10" fill="#EC4899" opacity="0.9"/><ellipse cx="40" cy="58" rx="7" ry="10" fill="#EC4899" opacity="0.9"/><ellipse cx="22" cy="40" rx="10" ry="7" fill="#EC4899" opacity="0.9"/><ellipse cx="58" cy="40" rx="10" ry="7" fill="#EC4899" opacity="0.9"/></svg>`
    },
    seeds: {
      id: 'seeds',
      name: 'Seeds & Berries',
      targetAnimal: 'bird',
      type: 'herbivore',
      icon: '🍒',
      sentence: 'Songbirds eat ripe seeds and sweet berries.',
      svg: `<svg viewBox="0 0 80 80" class="food-svg"><circle cx="40" cy="40" r="36" fill="#FEE2E2"/><circle cx="32" cy="42" r="10" fill="#DC2626" stroke="#991B1B" stroke-width="2"/><circle cx="50" cy="45" r="10" fill="#EF4444" stroke="#991B1B" stroke-width="2"/><path d="M32 32 Q38 20 42 16 M50 35 Q44 22 42 16" stroke="#15803D" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M42 16 Q52 14 56 20" stroke="#15803D" stroke-width="2.5" fill="#22C55E"/></svg>`
    }
  },

  // Animal Shelters / Homes
  shelters: {
    tree_hollow: {
      id: 'tree_hollow',
      name: 'Tree Hollow',
      animal: 'squirrel',
      sentence: 'A safe hole inside a tall tree trunk.',
      svg: `<svg viewBox="0 0 100 100" class="shelter-svg"><rect x="25" y="10" width="50" height="80" rx="8" fill="#78350F" stroke="#451A03" stroke-width="3"/><ellipse cx="50" cy="50" rx="16" ry="22" fill="#1F2937" stroke="#451A03" stroke-width="2"/><path d="M42 62 Q50 66 58 62" stroke="#FDE68A" stroke-width="2" fill="none"/></svg>`
    },
    burrow: {
      id: 'burrow',
      name: 'Underground Burrow',
      animal: 'rabbit',
      sentence: 'A cozy tunnel dug deep underground.',
      svg: `<svg viewBox="0 0 100 100" class="shelter-svg"><path d="M10 70 Q50 50 90 70 L90 95 L10 95 Z" fill="#92400E"/><path d="M10 68 Q50 48 90 68" stroke="#16A34A" stroke-width="6" fill="none"/><ellipse cx="50" cy="74" rx="22" ry="16" fill="#1F2937" stroke="#78350F" stroke-width="3"/><ellipse cx="50" cy="78" rx="15" ry="9" fill="#111827"/></svg>`
    },
    cave: {
      id: 'cave',
      name: 'Mountain Cave',
      animal: 'bear',
      sentence: 'A large rock shelter inside the mountain.',
      svg: `<svg viewBox="0 0 100 100" class="shelter-svg"><path d="M15 85 Q20 30 50 25 Q80 30 85 85 Z" fill="#64748B" stroke="#334155" stroke-width="3"/><path d="M30 85 Q35 45 50 42 Q65 45 70 85 Z" fill="#0F172A" stroke="#334155" stroke-width="2"/><path d="M22 45 L32 55 M75 40 L65 52" stroke="#94A3B8" stroke-width="2"/></svg>`
    },
    lilypad: {
      id: 'lilypad',
      name: 'Lilypad in Pond',
      animal: 'frog',
      sentence: 'A floating green pad resting on clean water.',
      svg: `<svg viewBox="0 0 100 100" class="shelter-svg"><ellipse cx="50" cy="65" rx="42" ry="18" fill="#059669" stroke="#064E3B" stroke-width="3"/><path d="M50 65 L88 56 M50 65 L88 74" fill="#38BDF8"/><circle cx="50" cy="65" r="3" fill="#34D399"/><ellipse cx="32" cy="48" rx="8" ry="8" fill="#F472B6" opacity="0.9"/></svg>`
    },
    nest: {
      id: 'nest',
      name: 'Twig Bird Nest',
      animal: 'bird',
      sentence: 'A cozy woven bowl made of twigs and soft feathers.',
      svg: `<svg viewBox="0 0 100 100" class="shelter-svg"><rect x="10" y="70" width="80" height="10" rx="5" fill="#78350F"/><ellipse cx="50" cy="60" rx="32" ry="16" fill="#92400E" stroke="#451A03" stroke-width="3"/><ellipse cx="50" cy="54" rx="24" ry="10" fill="#B45309"/><ellipse cx="44" cy="50" rx="5" ry="6" fill="#93C5FD"/><ellipse cx="56" cy="50" rx="5" ry="6" fill="#93C5FD"/></svg>`
    },
    log_hollow: {
      id: 'log_hollow',
      name: 'Hollow Log',
      animal: 'raccoon',
      sentence: 'A hollow fallen log dry and safe on the riverbank.',
      svg: `<svg viewBox="0 0 100 100" class="shelter-svg"><path d="M20 40 L70 30 L85 65 L35 75 Z" fill="#78350F" stroke="#451A03" stroke-width="3"/><ellipse cx="28" cy="58" rx="14" ry="18" fill="#1F2937" stroke="#451A03" stroke-width="3"/><ellipse cx="28" cy="58" rx="9" ry="12" fill="#0F172A"/><path d="M40 38 L65 32 M46 62 L75 52" stroke="#92400E" stroke-width="2"/></svg>`
    }
  },

  // Needs Items (Water, Food, Shelter)
  needs: {
    water: {
      id: 'water',
      name: 'Fresh Water',
      icon: '💧',
      sentence: 'All animals must drink clean water to survive.',
      svg: `<svg viewBox="0 0 80 80" class="need-svg"><circle cx="40" cy="40" r="36" fill="#E0F2FE" stroke="#38BDF8" stroke-width="3"/><path d="M40 18 C40 18 24 38 24 50 C24 59 31 64 40 64 C49 64 56 59 56 50 C56 38 40 18 40 18 Z" fill="#0284C7" stroke="#0369A1" stroke-width="2.5"/><path d="M34 46 Q32 54 38 58" stroke="#BAE6FD" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`
    },
    food: {
      id: 'food',
      name: 'Nutritious Food',
      icon: '🍎',
      sentence: 'Animals need food for energy to run, grow, and live.',
      svg: `<svg viewBox="0 0 80 80" class="need-svg"><circle cx="40" cy="40" r="36" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3"/><ellipse cx="36" cy="45" rx="14" ry="16" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/><ellipse cx="44" cy="45" rx="14" ry="16" fill="#DC2626" stroke="#B91C1C" stroke-width="2"/><path d="M40 29 Q42 20 46 18" stroke="#78350F" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M44 20 Q54 18 56 24 Q48 26 44 20 Z" fill="#22C55E"/></svg>`
    },
    shelter: {
      id: 'shelter',
      name: 'Safe Shelter',
      icon: '🏠',
      sentence: 'Shelter protects animals from storms, heat, and danger.',
      svg: `<svg viewBox="0 0 80 80" class="need-svg"><circle cx="40" cy="40" r="36" fill="#DCFCE7" stroke="#22C55E" stroke-width="3"/><polygon points="40,20 18,38 62,38" fill="#B45309" stroke="#78350F" stroke-width="2.5"/><rect x="25" y="38" width="30" height="24" fill="#FEF3C7" stroke="#78350F" stroke-width="2"/><path d="M34 62 L34 48 Q40 44 46 48 L46 62 Z" fill="#78350F"/></svg>`
    }
  }
};

/**
 * Render complete interactive multi-layered cartoon background for any habitat in different health/weather states.
 * State options: 'healthy', 'storm', 'damaged', 'recovering'
 */
export function renderEnvironmentBackdrop(habitatId = 'forest', state = 'healthy') {
  let skyGradient = '';
  let weatherFX = '';
  let landscapeContent = '';

  switch (state) {
    case 'storm':
      skyGradient = 'linear-gradient(180deg, #1E293B 0%, #334155 50%, #475569 100%)';
      weatherFX = `
        <div class="weather-layer storm-active">
          <div class="lightning-flash"></div>
          <div class="rain-streaks"></div>
          <div class="wind-swirls"></div>
          <div class="dark-clouds">
            <svg class="cloud-svg c1" viewBox="0 0 200 100"><path d="M30 60 Q30 35 60 35 Q75 15 110 20 Q145 10 165 35 Q185 40 185 65 Q185 85 155 85 L40 85 Q20 85 30 60 Z" fill="#0F172A" opacity="0.85"/></svg>
            <svg class="cloud-svg c2" viewBox="0 0 200 100"><path d="M30 60 Q30 35 60 35 Q75 15 110 20 Q145 10 165 35 Q185 40 185 65 Q185 85 155 85 L40 85 Q20 85 30 60 Z" fill="#1E293B" opacity="0.9"/></svg>
          </div>
        </div>
      `;
      break;

    case 'damaged':
      skyGradient = 'linear-gradient(180deg, #94A3B8 0%, #CBD5E1 50%, #D1D5DB 100%)';
      weatherFX = `
        <div class="weather-layer damaged-active">
          <div class="floating-debris"></div>
          <div class="mud-puddle-overlay"></div>
        </div>
      `;
      break;

    case 'recovering':
      skyGradient = 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 60%, #BBF7D0 100%)';
      weatherFX = `
        <div class="weather-layer recovering-active">
          <div class="gentle-sunbeams"></div>
          <div class="floating-sparkles"></div>
        </div>
      `;
      break;

    case 'healthy':
    default:
      skyGradient = 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 45%, #D1FAE5 100%)';
      weatherFX = `
        <div class="weather-layer healthy-active">
          <div class="sun-glow"></div>
          <div class="floating-leaves"></div>
          <div class="glowing-fireflies"></div>
        </div>
      `;
      break;
  }

  // Habitat-specific layered SVG landscape
  switch (habitatId) {
    case 'river':
      landscapeContent = `
        <svg class="landscape-svg river-biome" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <!-- Background Forest Hills -->
          <path d="M0 320 Q250 240 500 290 Q750 230 1000 300 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#78716C' : '#059669'}"/>
          <path d="M0 370 Q300 320 600 360 Q850 310 1000 350 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#57534E' : '#047857'}"/>
          <!-- Rushing River Flow -->
          <path d="M0 450 Q300 420 550 480 Q800 440 1000 460 L1000 600 L0 600 Z" fill="${state === 'damaged' || state === 'storm' ? '#92400E' : '#0284C7'}"/>
          <!-- Water Highlights / Ripples -->
          <path d="M50 490 Q200 470 350 490 M450 510 Q650 480 850 510" stroke="${state === 'damaged' ? '#78350F' : '#38BDF8'}" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Riverbank Rocks -->
          <ellipse cx="120" cy="540" rx="45" ry="25" fill="#64748B"/>
          <ellipse cx="200" cy="565" rx="35" ry="18" fill="#475569"/>
          <ellipse cx="850" cy="540" rx="55" ry="30" fill="#64748B"/>
          <!-- Vegetation on Banks -->
          ${state !== 'damaged' ? `
            <path d="M60 480 Q70 420 80 480 M85 480 Q95 410 105 480" stroke="#10B981" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M880 470 Q890 410 900 470 M910 470 Q920 400 930 470" stroke="#10B981" stroke-width="6" stroke-linecap="round" fill="none"/>
          ` : `
            <!-- Broken fallen logs & debris -->
            <rect x="250" y="470" width="120" height="20" rx="8" fill="#78350F" transform="rotate(-15 250 470)"/>
            <rect x="680" y="480" width="100" height="18" rx="6" fill="#57534E" transform="rotate(20 680 480)"/>
          `}
        </svg>
      `;
      break;

    case 'pond':
      landscapeContent = `
        <svg class="landscape-svg pond-biome" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <!-- Gentle rolling pond meadow -->
          <path d="M0 300 Q300 250 600 280 Q850 240 1000 290 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#78716C' : '#10B981'}"/>
          <!-- Pond Water Body -->
          <ellipse cx="500" cy="460" rx="420" ry="120" fill="${state === 'damaged' ? '#A16207' : '#059669'}"/>
          <ellipse cx="500" cy="460" rx="380" ry="100" fill="${state === 'damaged' ? '#B45309' : '#0D9488'}"/>
          <!-- Lilypads on Pond -->
          ${state !== 'damaged' ? `
            <ellipse cx="320" cy="450" rx="45" ry="18" fill="#34D399" stroke="#065F46" stroke-width="3"/>
            <ellipse cx="620" cy="470" rx="55" ry="22" fill="#34D399" stroke="#065F46" stroke-width="3"/>
            <ellipse cx="460" cy="510" rx="40" ry="16" fill="#34D399" stroke="#065F46" stroke-width="3"/>
            <circle cx="640" cy="465" r="8" fill="#F472B6"/>
          ` : `
            <!-- Dry cracked pond edges -->
            <path d="M380 430 L420 460 M550 440 L580 470" stroke="#78350F" stroke-width="3"/>
            <ellipse cx="500" cy="480" rx="180" ry="50" fill="#78350F" opacity="0.6"/>
          `}
          <!-- Reeds / Cattails -->
          <path d="M120 480 L120 320 M140 490 L140 310 M860 480 L860 310 M880 490 L880 330" stroke="#166534" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="120" cy="330" rx="8" ry="24" fill="#78350F"/>
          <ellipse cx="140" cy="320" rx="8" ry="24" fill="#78350F"/>
          <ellipse cx="860" cy="320" rx="8" ry="24" fill="#78350F"/>
          <ellipse cx="880" cy="340" rx="8" ry="24" fill="#78350F"/>
        </svg>
      `;
      break;

    case 'grassland':
      landscapeContent = `
        <svg class="landscape-svg grassland-biome" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <!-- Multi layered meadow hills -->
          <path d="M0 280 Q250 200 500 260 Q750 190 1000 250 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#A8A29E' : '#34D399'}"/>
          <path d="M0 360 Q350 280 700 340 Q880 300 1000 330 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#78716C' : '#10B981'}"/>
          <path d="M0 450 Q250 390 550 440 Q800 390 1000 430 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#57534E' : '#059669'}"/>
          <!-- Wildflower Meadow -->
          ${state !== 'damaged' ? `
            <circle cx="180" cy="480" r="8" fill="#EC4899"/><circle cx="180" cy="480" r="3" fill="#FBBF24"/>
            <circle cx="340" cy="520" r="9" fill="#FBBF24"/><circle cx="340" cy="520" r="3" fill="#B45309"/>
            <circle cx="720" cy="490" r="8" fill="#A855F7"/><circle cx="720" cy="490" r="3" fill="#FFF"/>
            <circle cx="850" cy="530" r="10" fill="#EF4444"/><circle cx="850" cy="530" r="3" fill="#FFF"/>
          ` : ''}
        </svg>
      `;
      break;

    case 'mountain':
      landscapeContent = `
        <svg class="landscape-svg mountain-biome" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <!-- Mountain Peaks in Background -->
          <polygon points="120,400 300,160 480,400" fill="#64748B"/>
          <polygon points="260,210 300,160 340,210 320,225 300,215 280,225" fill="#F8FAFC"/> <!-- Snowcap -->
          <polygon points="420,420 620,130 820,420" fill="#475569"/>
          <polygon points="580,190 620,130 660,190 640,205 620,195 600,205" fill="#F8FAFC"/> <!-- Snowcap -->
          <!-- Mountain Fore-Cliffs -->
          <path d="M0 380 Q300 320 600 360 Q850 310 1000 370 L1000 600 L0 600 Z" fill="#334155"/>
          <path d="M0 480 Q250 440 550 470 Q800 430 1000 460 L1000 600 L0 600 Z" fill="#1E293B"/>
          <!-- Rocky Cave Entrance -->
          <path d="M720 480 Q760 400 820 400 Q880 400 920 480 Z" fill="#020617"/>
        </svg>
      `;
      break;

    case 'forest':
    default:
      landscapeContent = `
        <svg class="landscape-svg forest-biome" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <!-- Background Forest Layers -->
          <path d="M0 320 Q250 240 500 290 Q750 230 1000 290 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#78716C' : '#047857'}"/>
          <!-- Tall Stately Trees -->
          <!-- Tree 1 Left -->
          <rect x="120" y="200" width="55" height="300" rx="8" fill="#78350F"/>
          <circle cx="147" cy="210" r="95" fill="${state === 'damaged' ? '#57534E' : '#059669'}"/>
          <circle cx="147" cy="160" r="75" fill="${state === 'damaged' ? '#78716C' : '#10B981'}"/>
          <!-- Tree Hollow on Tree 1 -->
          <ellipse cx="147" cy="320" rx="14" ry="20" fill="#1F2937"/>
          
          <!-- Tree 2 Right -->
          <rect x="780" y="180" width="65" height="320" rx="10" fill="#78350F"/>
          <circle cx="812" cy="190" r="110" fill="${state === 'damaged' ? '#57534E' : '#059669'}"/>
          <circle cx="812" cy="130" r="85" fill="${state === 'damaged' ? '#78716C' : '#10B981'}"/>

          <!-- Forest Floor with Moss & Bushes -->
          <path d="M0 450 Q300 400 600 440 Q850 390 1000 430 L1000 600 L0 600 Z" fill="${state === 'damaged' ? '#44403C' : '#065F46'}"/>
          
          ${state === 'damaged' ? `
            <!-- Broken branches & fallen nest -->
            <path d="M147 300 L240 380 L280 370" stroke="#78350F" stroke-width="12" stroke-linecap="round"/>
            <ellipse cx="300" cy="460" rx="26" ry="14" fill="#92400E" stroke="#451A03" stroke-width="2"/>
            <text x="290" y="465" font-size="16">🪹</text>
          ` : `
            <!-- Lush Green Bushes & Berry Shrub -->
            <ellipse cx="450" cy="470" rx="60" ry="35" fill="#10B981"/>
            <circle cx="430" cy="460" r="6" fill="#EF4444"/><circle cx="455" cy="450" r="6" fill="#EF4444"/><circle cx="475" cy="465" r="6" fill="#EF4444"/>
            <!-- Mushrooms -->
            <ellipse cx="640" cy="510" rx="14" ry="8" fill="#EF4444"/><rect x="636" y="510" width="8" height="12" fill="#FFF"/>
          `}
        </svg>
      `;
      break;
  }

  return `
    <div class="backdrop-wrapper habitat-${habitatId} state-${state}" style="background: ${skyGradient}">
      ${landscapeContent}
      ${weatherFX}
    </div>
  `;
}
