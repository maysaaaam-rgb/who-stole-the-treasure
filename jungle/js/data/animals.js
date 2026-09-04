/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Animal Data & Expressive SVG Vector Cartoon Generator
 */

export const ANIMALS = {
  squirrel: {
    id: 'squirrel',
    name: 'Suki',
    species: 'Squirrel',
    title: 'Suki the Squirrel',
    habitat: 'forest',
    habitatName: 'Forest',
    home: 'tree_hollow',
    homeName: 'Tree Hollow / Nest',
    food: 'nuts',
    foodName: 'Acorns & Nuts',
    foodType: 'herbivore',
    dietIcon: '🌰',
    drinks: 'water',
    role: 'prey',
    sentence: 'Suki the squirrel lives in a tall oak tree.',
    needsSentence: 'Suki needs acorns for food, fresh water to drink, and a warm tree nest for shelter.',
    color: '#D97724',
    secondaryColor: '#F59E0B'
  },
  frog: {
    id: 'frog',
    name: 'Poppy',
    species: 'Frog',
    title: 'Poppy the Frog',
    habitat: 'pond',
    habitatName: 'Pond',
    home: 'lilypad',
    homeName: 'Lilypad & Pond',
    food: 'insects',
    foodName: 'Flies & Insects',
    foodType: 'carnivore',
    dietIcon: '🪰',
    drinks: 'water',
    role: 'predator_and_prey',
    sentence: 'Poppy the frog loves jumping on green lilypads.',
    needsSentence: 'Poppy needs cool pond water, flying insects to eat, and floating lilypads for shelter.',
    color: '#10B981',
    secondaryColor: '#34D399'
  },
  raccoon: {
    id: 'raccoon',
    name: 'Rico',
    species: 'Raccoon',
    title: 'Rico the Raccoon',
    habitat: 'river',
    habitatName: 'Riverbank',
    home: 'log_hollow',
    homeName: 'Hollow Log',
    food: 'fish_and_berries',
    foodName: 'Berries & Small Fish',
    foodType: 'omnivore',
    dietIcon: '🫐',
    drinks: 'water',
    role: 'predator_and_prey',
    sentence: 'Rico the raccoon washes his food by the clean river.',
    needsSentence: 'Rico needs clean river water, sweet berries, and a cozy log den for shelter.',
    color: '#6B7280',
    secondaryColor: '#9CA3AF'
  },
  bear: {
    id: 'bear',
    name: 'Boris',
    species: 'Bear',
    title: 'Boris the Bear',
    habitat: 'mountain',
    habitatName: 'Mountain & Forest',
    home: 'cave',
    homeName: 'Rocky Cave / Den',
    food: 'berries_and_fish',
    foodName: 'Fish & Wild Berries',
    foodType: 'omnivore',
    dietIcon: '🐟',
    drinks: 'water',
    role: 'top_predator',
    sentence: 'Boris the big brown bear catches salmon in the mountain stream.',
    needsSentence: 'Boris needs abundant fish, ripe berry bushes, and a safe cave to rest.',
    color: '#854D0E',
    secondaryColor: '#A16207'
  },
  rabbit: {
    id: 'rabbit',
    name: 'Bella',
    species: 'Rabbit',
    title: 'Bella the Rabbit',
    habitat: 'grassland',
    habitatName: 'Grassland',
    home: 'burrow',
    homeName: 'Underground Burrow',
    food: 'carrots_grass',
    foodName: 'Green Grass & Carrots',
    foodType: 'herbivore',
    dietIcon: '🥕',
    drinks: 'water',
    role: 'prey',
    sentence: 'Bella the rabbit hops through the soft green grass.',
    needsSentence: 'The rabbit needs fresh green plants to eat and an underground burrow to hide from predators.',
    color: '#FBBF24',
    secondaryColor: '#FEF3C7'
  },
  fox: {
    id: 'fox',
    name: 'Felix',
    species: 'Fox',
    title: 'Felix the Fox',
    habitat: 'forest',
    habitatName: 'Forest',
    home: 'den',
    homeName: 'Forest Den',
    food: 'small_animals',
    foodName: 'Berries & Small Animals',
    foodType: 'carnivore',
    dietIcon: '🥩',
    drinks: 'water',
    role: 'predator',
    sentence: 'Felix the quick fox has bright orange fur and sharp eyes.',
    needsSentence: 'The fox is a predator. It hunts for food and lives in a safe forest den.',
    color: '#EA580C',
    secondaryColor: '#FB923C'
  },
  owl: {
    id: 'owl',
    name: 'Oliver',
    species: 'Owl',
    title: 'Oliver the Owl',
    habitat: 'forest',
    habitatName: 'Forest Canopy',
    home: 'tree_hollow',
    homeName: 'High Tree Hollow',
    food: 'mice',
    foodName: 'Insects & Mice',
    foodType: 'carnivore',
    dietIcon: '🪲',
    drinks: 'water',
    role: 'predator',
    sentence: 'Oliver the wise owl watches the jungle from high above.',
    needsSentence: 'The owl hunts at night and sleeps safely in a tall tree hollow during the day.',
    color: '#78350F',
    secondaryColor: '#B45309'
  },
  eagle: {
    id: 'eagle',
    name: 'Aero',
    species: 'Eagle',
    title: 'Aero the Eagle',
    habitat: 'mountain',
    habitatName: 'Mountain Cliffs',
    home: 'eyrie_nest',
    homeName: 'Cliff Eyrie Nest',
    food: 'fish',
    foodName: 'Fresh Fish',
    foodType: 'carnivore',
    dietIcon: '🐟',
    drinks: 'water',
    role: 'top_predator',
    sentence: 'Aero the eagle glides majestically over the mountain peaks.',
    needsSentence: 'The eagle builds its high nest on rocky cliffs and hunts for fish in the river below.',
    color: '#451A03',
    secondaryColor: '#F59E0B'
  },
  deer: {
    id: 'deer',
    name: 'Daisy',
    species: 'Deer',
    title: 'Daisy the Deer',
    habitat: 'grassland',
    habitatName: 'Grassland & Forest',
    home: 'thicket',
    homeName: 'Forest Thicket',
    food: 'leaves_grass',
    foodName: 'Tender Leaves & Grass',
    foodType: 'herbivore',
    dietIcon: '🌿',
    drinks: 'water',
    role: 'prey',
    sentence: 'Daisy the gentle deer grazes peacefully among wildflowers.',
    needsSentence: 'The deer drinks from clear streams and eats fresh green leaves.',
    color: '#B45309',
    secondaryColor: '#FDE68A'
  },
  turtle: {
    id: 'turtle',
    name: 'Toby',
    species: 'Turtle',
    title: 'Toby the Turtle',
    habitat: 'pond',
    habitatName: 'Pond & River',
    home: 'shell',
    homeName: 'Protective Shell / Riverbed',
    food: 'water_plants',
    foodName: 'Water Plants & Algae',
    foodType: 'herbivore',
    dietIcon: '🌱',
    drinks: 'water',
    role: 'prey',
    sentence: 'Toby the turtle carries his safe shelter on his back.',
    needsSentence: 'The turtle needs clean pond water and healthy underwater plants to eat.',
    color: '#059669',
    secondaryColor: '#6EE7B7'
  },
  snake: {
    id: 'snake',
    name: 'Sammy',
    species: 'Snake',
    title: 'Sammy the Snake',
    habitat: 'grassland',
    habitatName: 'Sunny Rocks & Grass',
    home: 'rock_crevice',
    homeName: 'Warm Rock Crevice',
    food: 'small_insects',
    foodName: 'Small Insects & Rodents',
    foodType: 'carnivore',
    dietIcon: '🦗',
    drinks: 'water',
    role: 'predator_and_prey',
    sentence: 'Sammy the snake warms himself on smooth river rocks.',
    needsSentence: 'The snake needs warm sunshine, rock shelters, and small insects.',
    color: '#15803D',
    secondaryColor: '#86EFAC'
  },
  butterfly: {
    id: 'butterfly',
    name: 'Bella',
    species: 'Butterfly',
    title: 'Bella the Butterfly',
    habitat: 'grassland',
    habitatName: 'Flower Meadow',
    home: 'flower',
    homeName: 'Wildflower Blossom',
    food: 'nectar',
    foodName: 'Sweet Flower Nectar',
    foodType: 'herbivore',
    dietIcon: '🌸',
    drinks: 'dew',
    role: 'prey',
    sentence: 'The colorful butterfly sips sweet nectar from jungle flowers.',
    needsSentence: 'Butterflies need blooming flowers for food and help plants grow.',
    color: '#EC4899',
    secondaryColor: '#F472B6'
  },
  bee: {
    id: 'bee',
    name: 'Buzzy',
    species: 'Bee',
    title: 'Buzzy the Bee',
    habitat: 'forest',
    habitatName: 'Forest Meadow',
    home: 'beehive',
    homeName: 'Hanging Beehive',
    food: 'pollen',
    foodName: 'Pollen & Nectar',
    foodType: 'herbivore',
    dietIcon: '🌼',
    drinks: 'dew',
    role: 'prey',
    sentence: 'Buzzy the busy bee pollinates trees and makes golden honey.',
    needsSentence: 'Bees need wildflowers and clean water droplets to make honey in their hive.',
    color: '#EAB308',
    secondaryColor: '#1E293B'
  },
  fish: {
    id: 'fish',
    name: 'Finny',
    species: 'Fish',
    title: 'Finny the Fish',
    habitat: 'river',
    habitatName: 'Clean River',
    home: 'riverbed',
    homeName: 'Clean River Stones',
    food: 'algae',
    foodName: 'Underwater Plants & Algae',
    foodType: 'herbivore',
    dietIcon: '🌿',
    drinks: 'water',
    role: 'prey',
    sentence: 'Finny the sparkling fish swims happily in the rushing river.',
    needsSentence: 'Fish must have clean, oxygen-rich water and cannot survive in muddy pollution.',
    color: '#0284C7',
    secondaryColor: '#38BDF8'
  },
  hedgehog: {
    id: 'hedgehog',
    name: 'Spike',
    species: 'Hedgehog',
    title: 'Spike the Hedgehog',
    habitat: 'forest',
    habitatName: 'Forest Floor',
    home: 'leaf_pile',
    homeName: 'Cozy Leaf Pile',
    food: 'beetles',
    foodName: 'Berries & Beetles',
    foodType: 'omnivore',
    dietIcon: '🪲',
    drinks: 'water',
    role: 'prey',
    sentence: 'Spike the hedgehog rolls into a spiky ball when he is scared.',
    needsSentence: 'The hedgehog snuggles under dry fallen leaves to stay warm and safe.',
    color: '#713F12',
    secondaryColor: '#A16207'
  },
  bird: {
    id: 'bird',
    name: 'Pip',
    species: 'Songbird',
    title: 'Pip the Bluebird',
    habitat: 'forest',
    habitatName: 'Treetop Canopy',
    home: 'nest',
    homeName: 'Woven Twig Nest',
    food: 'seeds_berries',
    foodName: 'Seeds & Sweet Berries',
    foodType: 'herbivore',
    dietIcon: '🍒',
    drinks: 'water',
    role: 'prey',
    sentence: 'Pip the bluebird sings cheerful songs from high branches.',
    needsSentence: 'The bird builds a sturdy twig nest to protect its fragile eggs.',
    color: '#2563EB',
    secondaryColor: '#60A5FA'
  }
};

/**
 * Generate expressive, high-polish SVG illustration for any animal in any emotional/action state.
 * Supported emotions: 'happy', 'worried', 'scared', 'hungry', 'thirsty', 'surprised', 'excited', 'tired', 'safe', 'eating', 'drinking'
 */
export function renderAnimalSVG(animalId, emotion = 'happy', width = 160, height = 160) {
  const anim = ANIMALS[animalId] || ANIMALS.squirrel;
  
  // Dynamic eye and mouth expressions based on emotion
  let eyeLeft = '', eyeRight = '', mouth = '', extras = '', moodClass = emotion;

  switch (emotion) {
    case 'worried':
      eyeLeft = `<circle cx="68" cy="65" r="7" fill="#1F2937"/><circle cx="66" cy="63" r="2.5" fill="#FFF"/><path d="M60 52 Q68 56 76 53" stroke="#4B5563" stroke-width="2.5" fill="none"/>`;
      eyeRight = `<circle cx="92" cy="65" r="7" fill="#1F2937"/><circle cx="90" cy="63" r="2.5" fill="#FFF"/><path d="M84 53 Q92 56 100 52" stroke="#4B5563" stroke-width="2.5" fill="none"/>`;
      mouth = `<path d="M72 88 Q80 82 88 88" stroke="#374151" stroke-width="3" stroke-linecap="round" fill="none"/>`;
      extras = `<path d="M102 60 Q106 65 102 70" stroke="#38BDF8" stroke-width="3" fill="#BAE6FD"/> <!-- sweat drop -->`;
      break;

    case 'scared':
      eyeLeft = `<circle cx="66" cy="64" r="9" fill="#FFF" stroke="#1F2937" stroke-width="2"/><circle cx="66" cy="64" r="4" fill="#1F2937"/><path d="M56 48 L74 54" stroke="#374151" stroke-width="3" stroke-linecap="round"/>`;
      eyeRight = `<circle cx="94" cy="64" r="9" fill="#FFF" stroke="#1F2937" stroke-width="2"/><circle cx="94" cy="64" r="4" fill="#1F2937"/><path d="M104 48 L86 54" stroke="#374151" stroke-width="3" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="80" cy="88" rx="8" ry="10" fill="#EF4444" stroke="#374151" stroke-width="2"/>`;
      extras = `<path d="M42 45 L48 52 M118 45 L112 52" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>`;
      break;

    case 'hungry':
      eyeLeft = `<circle cx="68" cy="66" r="6.5" fill="#1F2937"/><circle cx="66" cy="64" r="2" fill="#FFF"/>`;
      eyeRight = `<circle cx="92" cy="66" r="6.5" fill="#1F2937"/><circle cx="90" cy="64" r="2" fill="#FFF"/>`;
      mouth = `<path d="M74 86 Q80 83 86 86" stroke="#374151" stroke-width="2.5" fill="none"/><path d="M84 88 Q88 95 86 98" stroke="#60A5FA" stroke-width="2" fill="#93C5FD"/> <!-- drool -->`;
      extras = `<g transform="translate(108, 30) scale(0.6)"><circle cx="20" cy="20" r="18" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/><text x="20" y="27" font-size="20" text-anchor="middle">💭</text></g>`;
      break;

    case 'thirsty':
      eyeLeft = `<circle cx="68" cy="66" r="6.5" fill="#1F2937"/><circle cx="66" cy="64" r="2" fill="#FFF"/>`;
      eyeRight = `<circle cx="92" cy="66" r="6.5" fill="#1F2937"/><circle cx="90" cy="64" r="2" fill="#FFF"/>`;
      mouth = `<path d="M72 85 Q80 80 88 85" stroke="#374151" stroke-width="2.5" fill="none"/><path d="M76 86 Q80 94 84 86" fill="#F87171"/> <!-- dry tongue -->`;
      extras = `<g transform="translate(108, 30) scale(0.6)"><circle cx="20" cy="20" r="18" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2"/><text x="20" y="27" font-size="20" text-anchor="middle">💧</text></g>`;
      break;

    case 'eating':
      eyeLeft = `<path d="M62 65 Q68 58 74 65" stroke="#1F2937" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
      eyeRight = `<path d="M86 65 Q92 58 98 65" stroke="#1F2937" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
      mouth = `<path d="M72 82 Q80 94 88 82 Z" fill="#EF4444" stroke="#374151" stroke-width="2"/>`;
      extras = `<g transform="translate(65, 85) scale(0.8)"><text x="18" y="18" font-size="20">✨</text><text x="-5" y="10" font-size="14">❤️</text></g>`;
      break;

    case 'drinking':
      eyeLeft = `<path d="M62 65 Q68 60 74 65" stroke="#1F2937" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
      eyeRight = `<path d="M86 65 Q92 60 98 65" stroke="#1F2937" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
      mouth = `<ellipse cx="80" cy="85" rx="5" ry="5" fill="#38BDF8" stroke="#0284C7" stroke-width="2"/>`;
      extras = `<path d="M70 95 Q80 102 90 95" stroke="#38BDF8" stroke-width="3" fill="none"/> <!-- water ripple -->`;
      break;

    case 'excited':
    case 'happy':
    case 'safe':
    default:
      // Big sparkling happy eyes with catchlights and cheerful smile
      eyeLeft = `<circle cx="68" cy="64" r="7.5" fill="#1F2937"/><circle cx="65.5" cy="61.5" r="3" fill="#FFF"/><circle cx="70.5" cy="66.5" r="1.5" fill="#FFF"/>`;
      eyeRight = `<circle cx="92" cy="64" r="7.5" fill="#1F2937"/><circle cx="89.5" cy="61.5" r="3" fill="#FFF"/><circle cx="94.5" cy="66.5" r="1.5" fill="#FFF"/>`;
      mouth = `<path d="M70 82 Q80 96 90 82 Q80 87 70 82 Z" fill="#EF4444" stroke="#374151" stroke-width="2"/>`;
      extras = `<circle cx="56" cy="74" r="6" fill="#F472B6" opacity="0.6"/> <circle cx="104" cy="74" r="6" fill="#F472B6" opacity="0.6"/>`;
      break;
  }

  // Animal body shape vectors
  let bodyContent = '';

  switch (animalId) {
    case 'squirrel':
      bodyContent = `
        <!-- Fluffy Bushy Tail with Highlights -->
        <path d="M100 110 Q145 100 145 55 Q145 20 115 15 Q85 10 95 45 Q105 75 85 95 Z" fill="${anim.color}" stroke="#9A3412" stroke-width="3.5"/>
        <path d="M110 95 Q135 85 135 55 Q135 30 115 28" stroke="${anim.secondaryColor}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Body -->
        <ellipse cx="80" cy="105" rx="30" ry="32" fill="${anim.color}" stroke="#9A3412" stroke-width="3.5"/>
        <ellipse cx="80" cy="110" rx="18" ry="22" fill="#FEF3C7"/>
        <!-- Ears -->
        <path d="M58 46 L50 25 L68 38 Z" fill="${anim.color}" stroke="#9A3412" stroke-width="3"/>
        <path d="M102 46 L110 25 L92 38 Z" fill="${anim.color}" stroke="#9A3412" stroke-width="3"/>
        <path d="M56 36 L52 28" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/>
        <path d="M104 36 L108 28" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/>
        <!-- Head -->
        <circle cx="80" cy="70" r="28" fill="${anim.color}" stroke="#9A3412" stroke-width="3.5"/>
        <!-- Snout -->
        <ellipse cx="80" cy="76" rx="14" ry="10" fill="#FEF3C7"/>
        <ellipse cx="80" cy="72" rx="4.5" ry="3" fill="#1F2937"/>
        <!-- Whiskers -->
        <path d="M60 74 L46 72 M60 78 L48 80 M100 74 L114 72 M100 78 L112 80" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
        <!-- Paws holding acorn -->
        <ellipse cx="65" cy="105" rx="7" ry="6" fill="${anim.color}" stroke="#9A3412" stroke-width="2"/>
        <ellipse cx="95" cy="105" rx="7" ry="6" fill="${anim.color}" stroke="#9A3412" stroke-width="2"/>
        <!-- Feet -->
        <ellipse cx="62" cy="135" rx="10" ry="6" fill="${anim.color}" stroke="#9A3412" stroke-width="2.5"/>
        <ellipse cx="98" cy="135" rx="10" ry="6" fill="${anim.color}" stroke="#9A3412" stroke-width="2.5"/>
      `;
      break;

    case 'frog':
      bodyContent = `
        <!-- Frog Back Legs -->
        <ellipse cx="44" cy="115" rx="18" ry="12" fill="${anim.color}" stroke="#065F46" stroke-width="3" transform="rotate(-20 44 115)"/>
        <ellipse cx="116" cy="115" rx="18" ry="12" fill="${anim.color}" stroke="#065F46" stroke-width="3" transform="rotate(20 116 115)"/>
        <!-- Webbed Feet -->
        <path d="M30 128 L22 135 M30 128 L30 138 M30 128 L38 136" stroke="#065F46" stroke-width="3" stroke-linecap="round"/>
        <path d="M130 128 L122 136 M130 128 L130 138 M130 128 L138 135" stroke="#065F46" stroke-width="3" stroke-linecap="round"/>
        <!-- Body -->
        <ellipse cx="80" cy="100" rx="34" ry="28" fill="${anim.color}" stroke="#065F46" stroke-width="3.5"/>
        <ellipse cx="80" cy="104" rx="22" ry="18" fill="#A7F3D0"/>
        <!-- Big Frog Eye Bumps -->
        <circle cx="62" cy="56" r="16" fill="${anim.color}" stroke="#065F46" stroke-width="3.5"/>
        <circle cx="98" cy="56" r="16" fill="${anim.color}" stroke="#065F46" stroke-width="3.5"/>
        <!-- Frog Head -->
        <ellipse cx="80" cy="74" rx="36" ry="24" fill="${anim.color}" stroke="#065F46" stroke-width="3.5"/>
        <!-- Front Little Paws -->
        <ellipse cx="66" cy="115" rx="6" ry="5" fill="${anim.secondaryColor}" stroke="#065F46" stroke-width="2"/>
        <ellipse cx="94" cy="115" rx="6" ry="5" fill="${anim.secondaryColor}" stroke="#065F46" stroke-width="2"/>
      `;
      break;

    case 'raccoon':
      bodyContent = `
        <!-- Striped Tail -->
        <path d="M105 110 Q145 115 140 85 Q135 65 115 75 Z" fill="${anim.color}" stroke="#1F2937" stroke-width="3.5"/>
        <path d="M118 100 L128 88 M126 108 L136 94 M132 112 L140 102" stroke="#1F2937" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Body -->
        <ellipse cx="80" cy="105" rx="32" ry="30" fill="${anim.color}" stroke="#1F2937" stroke-width="3.5"/>
        <ellipse cx="80" cy="108" rx="20" ry="20" fill="#E5E7EB"/>
        <!-- Ears -->
        <polygon points="56,48 48,26 70,38" fill="${anim.color}" stroke="#1F2937" stroke-width="3"/>
        <polygon points="104,48 112,26 90,38" fill="${anim.color}" stroke="#1F2937" stroke-width="3"/>
        <polygon points="57,42 52,32 66,37" fill="#F3F4F6"/>
        <polygon points="103,42 108,32 94,37" fill="#F3F4F6"/>
        <!-- Head -->
        <circle cx="80" cy="70" r="28" fill="${anim.color}" stroke="#1F2937" stroke-width="3.5"/>
        <!-- Raccoon Eye Mask -->
        <path d="M52 64 Q68 58 80 68 Q92 58 108 64 Q100 76 80 72 Q60 76 52 64 Z" fill="#1F2937"/>
        <!-- Snout -->
        <ellipse cx="80" cy="78" rx="12" ry="9" fill="#F3F4F6"/>
        <ellipse cx="80" cy="73" rx="4.5" ry="3" fill="#1F2937"/>
        <!-- Feet -->
        <ellipse cx="64" cy="134" rx="8" ry="5" fill="#374151"/>
        <ellipse cx="96" cy="134" rx="8" ry="5" fill="#374151"/>
      `;
      break;

    case 'bear':
      bodyContent = `
        <!-- Large Sturdy Bear Body -->
        <ellipse cx="80" cy="106" rx="38" ry="34" fill="${anim.color}" stroke="#451A03" stroke-width="3.5"/>
        <ellipse cx="80" cy="110" rx="24" ry="22" fill="#A16207"/>
        <!-- Round Ears -->
        <circle cx="54" cy="42" r="12" fill="${anim.color}" stroke="#451A03" stroke-width="3"/>
        <circle cx="54" cy="42" r="6" fill="#FDE68A"/>
        <circle cx="106" cy="42" r="12" fill="${anim.color}" stroke="#451A03" stroke-width="3"/>
        <circle cx="106" cy="42" r="6" fill="#FDE68A"/>
        <!-- Head -->
        <circle cx="80" cy="68" r="32" fill="${anim.color}" stroke="#451A03" stroke-width="3.5"/>
        <!-- Snout -->
        <ellipse cx="80" cy="77" rx="16" ry="12" fill="#FDE68A"/>
        <ellipse cx="80" cy="71" rx="6" ry="4" fill="#1F2937"/>
        <!-- Big Strong Paws -->
        <ellipse cx="52" cy="118" rx="10" ry="8" fill="${anim.color}" stroke="#451A03" stroke-width="2.5"/>
        <ellipse cx="108" cy="118" rx="10" ry="8" fill="${anim.color}" stroke="#451A03" stroke-width="2.5"/>
        <!-- Feet -->
        <ellipse cx="60" cy="138" rx="12" ry="7" fill="#451A03"/>
        <ellipse cx="100" cy="138" rx="12" ry="7" fill="#451A03"/>
      `;
      break;

    case 'rabbit':
      bodyContent = `
        <!-- Long Expressive Ears -->
        <ellipse cx="62" cy="28" rx="8" ry="26" fill="${anim.color}" stroke="#B45309" stroke-width="3" transform="rotate(-10 62 28)"/>
        <ellipse cx="62" cy="28" rx="4" ry="18" fill="#FDE68A" transform="rotate(-10 62 28)"/>
        <ellipse cx="98" cy="28" rx="8" ry="26" fill="${anim.color}" stroke="#B45309" stroke-width="3" transform="rotate(10 98 28)"/>
        <ellipse cx="98" cy="28" rx="4" ry="18" fill="#FDE68A" transform="rotate(10 98 28)"/>
        <!-- Body -->
        <ellipse cx="80" cy="108" rx="28" ry="28" fill="${anim.color}" stroke="#B45309" stroke-width="3.5"/>
        <ellipse cx="80" cy="112" rx="16" ry="18" fill="#FFF"/>
        <!-- Fluffy Tail -->
        <circle cx="112" cy="118" r="8" fill="#FFF" stroke="#B45309" stroke-width="2"/>
        <!-- Head -->
        <circle cx="80" cy="70" r="26" fill="${anim.color}" stroke="#B45309" stroke-width="3.5"/>
        <!-- Snout -->
        <ellipse cx="80" cy="76" rx="11" ry="8" fill="#FFF"/>
        <polygon points="77,73 83,73 80,77" fill="#F472B6"/>
        <!-- Whiskers -->
        <path d="M60 76 L44 74 M60 79 L46 82 M100 76 L116 74 M100 79 L114 82" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
        <!-- Paws -->
        <ellipse cx="64" cy="136" rx="10" ry="5" fill="${anim.color}" stroke="#B45309" stroke-width="2"/>
        <ellipse cx="96" cy="136" rx="10" ry="5" fill="${anim.color}" stroke="#B45309" stroke-width="2"/>
      `;
      break;

    case 'fox':
      bodyContent = `
        <!-- Magnificent Bushy Tail with White Tip -->
        <path d="M100 110 Q145 125 142 80 Q140 50 115 65 Z" fill="${anim.color}" stroke="#9A3412" stroke-width="3.5"/>
        <path d="M125 65 Q140 50 142 80 Q135 88 128 78 Z" fill="#FFF"/>
        <!-- Body -->
        <ellipse cx="80" cy="106" rx="30" ry="28" fill="${anim.color}" stroke="#9A3412" stroke-width="3.5"/>
        <ellipse cx="80" cy="110" rx="18" ry="18" fill="#FFF"/>
        <!-- Pointed Fox Ears -->
        <polygon points="56,48 46,20 72,36" fill="${anim.color}" stroke="#9A3412" stroke-width="3"/>
        <polygon points="54,42 49,26 67,36" fill="#1F2937"/>
        <polygon points="104,48 114,20 88,36" fill="${anim.color}" stroke="#9A3412" stroke-width="3"/>
        <polygon points="106,42 111,26 93,36" fill="#1F2937"/>
        <!-- Head -->
        <circle cx="80" cy="68" r="28" fill="${anim.color}" stroke="#9A3412" stroke-width="3.5"/>
        <!-- White Fox Cheeks -->
        <path d="M54 74 Q64 86 80 84 Q96 86 106 74 Q92 68 80 72 Q68 68 54 74 Z" fill="#FFF"/>
        <!-- Black Nose -->
        <circle cx="80" cy="76" r="3.5" fill="#1F2937"/>
        <!-- Paws -->
        <ellipse cx="64" cy="134" rx="8" ry="5" fill="#1F2937"/>
        <ellipse cx="96" cy="134" rx="8" ry="5" fill="#1F2937"/>
      `;
      break;

    case 'owl':
      bodyContent = `
        <!-- Feather Body -->
        <ellipse cx="80" cy="98" rx="34" ry="38" fill="${anim.color}" stroke="#451A03" stroke-width="3.5"/>
        <!-- Chest Feathers Pattern -->
        <ellipse cx="80" cy="104" rx="20" ry="24" fill="#FEF3C7"/>
        <path d="M72 95 Q80 100 88 95 M72 108 Q80 113 88 108 M72 120 Q80 125 88 120" stroke="#B45309" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Ear Tufts -->
        <polygon points="50,46 42,26 64,38" fill="${anim.color}" stroke="#451A03" stroke-width="3"/>
        <polygon points="110,46 118,26 96,38" fill="${anim.color}" stroke="#451A03" stroke-width="3"/>
        <!-- Head -->
        <circle cx="80" cy="64" r="30" fill="${anim.color}" stroke="#451A03" stroke-width="3.5"/>
        <!-- Big Round Feather Eyepads -->
        <circle cx="64" cy="62" r="14" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
        <circle cx="96" cy="62" r="14" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
        <!-- Sharp Curved Beak -->
        <polygon points="76,72 84,72 80,82" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
        <!-- Wings folded at side -->
        <path d="M48 85 Q40 105 50 125" stroke="#451A03" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M112 85 Q120 105 110 125" stroke="#451A03" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Talons Perching on Branch -->
        <rect x="35" y="136" width="90" height="8" rx="4" fill="#78350F"/>
        <path d="M62 134 L62 142 M68 134 L68 142 M92 134 L92 142 M98 134 L98 142" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      `;
      break;

    case 'eagle':
      bodyContent = `
        <!-- Eagle Body -->
        <ellipse cx="80" cy="100" rx="32" ry="36" fill="${anim.color}" stroke="#1E293B" stroke-width="3.5"/>
        <!-- White Feathered Head -->
        <circle cx="80" cy="60" r="28" fill="#FFF" stroke="#D1D5DB" stroke-width="3"/>
        <!-- Golden Curved Beak -->
        <path d="M72 68 Q88 68 88 84 Q80 80 72 74 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
        <!-- Powerful Wings Spread -->
        <path d="M48 90 Q20 80 15 50 Q30 75 52 75" fill="${anim.color}" stroke="#1E293B" stroke-width="3"/>
        <path d="M112 90 Q140 80 145 50 Q130 75 108 75" fill="${anim.color}" stroke="#1E293B" stroke-width="3"/>
        <!-- Strong Talons -->
        <path d="M60 134 L56 142 M65 134 L65 144 M95 134 L95 144 M100 134 L104 142" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/>
      `;
      break;

    case 'deer':
      bodyContent = `
        <!-- Antlers -->
        <path d="M62 38 Q50 20 40 22 M52 26 Q42 28 38 34 M98 38 Q110 20 120 22 M108 26 Q118 28 122 34" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Ears -->
        <ellipse cx="50" cy="48" rx="8" ry="14" fill="${anim.color}" stroke="#78350F" stroke-width="2.5" transform="rotate(-35 50 48)"/>
        <ellipse cx="110" cy="48" rx="8" ry="14" fill="${anim.color}" stroke="#78350F" stroke-width="2.5" transform="rotate(35 110 48)"/>
        <!-- Head -->
        <ellipse cx="80" cy="68" rx="24" ry="28" fill="${anim.color}" stroke="#78350F" stroke-width="3.5"/>
        <!-- Deer White Spots on Back -->
        <ellipse cx="80" cy="115" rx="30" ry="24" fill="${anim.color}" stroke="#78350F" stroke-width="3"/>
        <circle cx="70" cy="110" r="2.5" fill="#FFF"/>
        <circle cx="85" cy="108" r="2.5" fill="#FFF"/>
        <circle cx="95" cy="114" r="2.5" fill="#FFF"/>
        <circle cx="76" cy="122" r="2.5" fill="#FFF"/>
        <!-- Muzzle -->
        <ellipse cx="80" cy="80" rx="12" ry="9" fill="#FEF3C7"/>
        <circle cx="80" cy="76" r="3.5" fill="#1F2937"/>
        <!-- Hooves -->
        <rect x="62" y="132" width="8" height="10" rx="2" fill="#1F2937"/>
        <rect x="90" y="132" width="8" height="10" rx="2" fill="#1F2937"/>
      `;
      break;

    case 'turtle':
      bodyContent = `
        <!-- Protective Hard Shell -->
        <ellipse cx="80" cy="98" rx="42" ry="34" fill="#047857" stroke="#064E3B" stroke-width="4"/>
        <!-- Shell Hex Pattern -->
        <polygon points="80,76 94,84 94,100 80,108 66,100 66,84" fill="#059669" stroke="#064E3B" stroke-width="2"/>
        <path d="M80 76 L80 66 M94 84 L108 78 M94 100 L112 106 M80 108 L80 120 M66 100 L48 106 M66 84 L52 78" stroke="#064E3B" stroke-width="2"/>
        <!-- Turtle Head -->
        <ellipse cx="80" cy="56" rx="18" ry="16" fill="${anim.color}" stroke="#064E3B" stroke-width="3"/>
        <!-- Flippers / Claws -->
        <ellipse cx="42" cy="82" rx="12" ry="8" fill="${anim.color}" stroke="#064E3B" stroke-width="2.5" transform="rotate(-30 42 82)"/>
        <ellipse cx="118" cy="82" rx="12" ry="8" fill="${anim.color}" stroke="#064E3B" stroke-width="2.5" transform="rotate(30 118 82)"/>
        <ellipse cx="48" cy="120" rx="10" ry="7" fill="${anim.color}" stroke="#064E3B" stroke-width="2.5"/>
        <ellipse cx="112" cy="120" rx="10" ry="7" fill="${anim.color}" stroke="#064E3B" stroke-width="2.5"/>
      `;
      break;

    case 'snake':
      bodyContent = `
        <!-- Coiled Snake Body -->
        <path d="M40 120 Q50 140 80 138 Q110 136 120 120 Q125 105 105 100 Q80 95 65 90 Q50 85 60 70 Q70 55 80 55" stroke="${anim.color}" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M40 120 Q50 140 80 138 Q110 136 120 120 Q125 105 105 100 Q80 95 65 90 Q50 85 60 70 Q70 55 80 55" stroke="${anim.secondaryColor}" stroke-width="8" stroke-dasharray="10 8" stroke-linecap="round" fill="none"/>
        <!-- Snake Head -->
        <ellipse cx="80" cy="52" rx="16" ry="14" fill="${anim.color}" stroke="#14532D" stroke-width="3"/>
        <!-- Forked Tongue -->
        <path d="M80 64 L80 74 L76 80 M80 74 L84 80" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      `;
      break;

    case 'butterfly':
      bodyContent = `
        <!-- Gorgeous Colorful Wings -->
        <ellipse cx="50" cy="65" rx="30" ry="24" fill="${anim.color}" stroke="#831843" stroke-width="2.5" transform="rotate(-20 50 65)"/>
        <ellipse cx="50" cy="65" rx="18" ry="14" fill="#F472B6" transform="rotate(-20 50 65)"/>
        <circle cx="45" cy="62" r="6" fill="#FEF08A"/>
        <ellipse cx="110" cy="65" rx="30" ry="24" fill="${anim.color}" stroke="#831843" stroke-width="2.5" transform="rotate(20 110 65)"/>
        <ellipse cx="110" cy="65" rx="18" ry="14" fill="#F472B6" transform="rotate(20 110 65)"/>
        <circle cx="115" cy="62" r="6" fill="#FEF08A"/>
        <!-- Lower Wings -->
        <ellipse cx="56" cy="102" rx="22" ry="18" fill="${anim.color}" stroke="#831843" stroke-width="2.5"/>
        <ellipse cx="104" cy="102" rx="22" ry="18" fill="${anim.color}" stroke="#831843" stroke-width="2.5"/>
        <!-- Antennae -->
        <path d="M76 45 Q70 25 60 22 M84 45 Q90 25 100 22" stroke="#1F2937" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="60" cy="22" r="3" fill="#EC4899"/>
        <circle cx="100" cy="22" r="3" fill="#EC4899"/>
        <!-- Slender Body -->
        <ellipse cx="80" cy="84" rx="7" ry="28" fill="#1F2937"/>
        <!-- Head -->
        <circle cx="80" cy="52" r="10" fill="#1F2937"/>
      `;
      break;

    case 'bee':
      bodyContent = `
        <!-- Translucent Wings -->
        <ellipse cx="58" cy="46" rx="20" ry="12" fill="#BAE6FD" opacity="0.8" stroke="#0284C7" stroke-width="1.5" transform="rotate(-30 58 46)"/>
        <ellipse cx="102" cy="46" rx="20" ry="12" fill="#BAE6FD" opacity="0.8" stroke="#0284C7" stroke-width="1.5" transform="rotate(30 102 46)"/>
        <!-- Yellow & Black Striped Body -->
        <ellipse cx="80" cy="95" rx="30" ry="26" fill="${anim.color}" stroke="#713F12" stroke-width="3"/>
        <path d="M58 84 Q80 78 102 84 M54 96 Q80 90 106 96 M60 108 Q80 102 100 108" stroke="#1E293B" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Stinger -->
        <polygon points="76,120 84,120 80,132" fill="#1E293B"/>
        <!-- Antennae -->
        <path d="M74 48 Q68 32 60 30 M86 48 Q92 32 100 30" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <circle cx="60" cy="30" r="3.5" fill="#EAB308"/>
        <circle cx="100" cy="30" r="3.5" fill="#EAB308"/>
        <!-- Head -->
        <circle cx="80" cy="62" r="20" fill="${anim.color}" stroke="#713F12" stroke-width="3"/>
      `;
      break;

    case 'fish':
      bodyContent = `
        <!-- Fish Body -->
        <ellipse cx="80" cy="80" rx="42" ry="28" fill="${anim.color}" stroke="#0369A1" stroke-width="3"/>
        <!-- Shimmering Belly -->
        <path d="M42 80 Q80 106 118 80 Q80 94 42 80 Z" fill="#BAE6FD"/>
        <!-- Tail Fin -->
        <path d="M120 80 L148 55 Q140 80 148 105 Z" fill="${anim.color}" stroke="#0369A1" stroke-width="3"/>
        <!-- Dorsal and Side Fins -->
        <path d="M70 52 Q85 36 95 52 Z" fill="${anim.secondaryColor}" stroke="#0369A1" stroke-width="2"/>
        <path d="M75 88 Q88 100 95 86 Z" fill="${anim.secondaryColor}" stroke="#0369A1" stroke-width="2"/>
        <!-- Scales Pattern -->
        <path d="M65 72 Q72 78 79 72 M75 80 Q82 86 89 80" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Bubbles -->
        <circle cx="34" cy="60" r="4" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>
        <circle cx="24" cy="48" r="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>
      `;
      break;

    case 'hedgehog':
      bodyContent = `
        <!-- Spiky Spine Quills -->
        <path d="M35 80 Q35 45 75 40 Q115 45 125 80 Q125 110 80 115 Q40 112 35 80 Z" fill="${anim.color}" stroke="#451A03" stroke-width="3.5"/>
        <!-- Spiky details -->
        <path d="M42 55 L32 45 M58 45 L52 30 M78 40 L78 24 M98 45 L104 30 M118 55 L128 45 M125 75 L140 72" stroke="#451A03" stroke-width="3" stroke-linecap="round"/>
        <!-- Soft Belly & Face -->
        <ellipse cx="80" cy="85" rx="30" ry="24" fill="#FEF3C7" stroke="#92400E" stroke-width="3"/>
        <!-- Pointed Snout -->
        <path d="M60 85 Q75 92 80 82" fill="#FEF3C7"/>
        <circle cx="56" cy="85" r="4" fill="#1F2937"/>
        <!-- Little Feet -->
        <ellipse cx="62" cy="116" rx="7" ry="4" fill="#92400E"/>
        <ellipse cx="98" cy="116" rx="7" ry="4" fill="#92400E"/>
      `;
      break;

    case 'bird':
    default:
      bodyContent = `
        <!-- Tail Feathers -->
        <polygon points="115,100 142,118 135,95" fill="${anim.color}" stroke="#1E40AF" stroke-width="2.5"/>
        <!-- Body -->
        <ellipse cx="80" cy="90" rx="32" ry="26" fill="${anim.color}" stroke="#1E40AF" stroke-width="3.5"/>
        <ellipse cx="76" cy="94" rx="20" ry="18" fill="#DBEAFE"/>
        <!-- Head -->
        <circle cx="68" cy="58" r="22" fill="${anim.color}" stroke="#1E40AF" stroke-width="3.5"/>
        <!-- Little Beak -->
        <polygon points="46,58 32,62 46,68" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
        <!-- Wing -->
        <path d="M72 82 Q96 75 106 95 Q90 105 72 82 Z" fill="${anim.secondaryColor}" stroke="#1E40AF" stroke-width="2"/>
        <!-- Feet on Twig -->
        <rect x="40" y="122" width="80" height="6" rx="3" fill="#78350F"/>
        <path d="M68 116 L68 124 M84 116 L84 124" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      `;
      break;
  }

  return `
    <svg class="animal-svg animal-${animalId} mood-${moodClass}" viewBox="0 0 160 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${anim.name} (${emotion})">
      <g class="animal-body-group">
        ${bodyContent}
        <g class="animal-face-group">
          ${eyeLeft}
          ${eyeRight}
          ${mouth}
          ${extras}
        </g>
      </g>
    </svg>
  `;
}
