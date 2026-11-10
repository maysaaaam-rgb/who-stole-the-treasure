/**
 * Monster Pets & 3D Character Buddies Pack
 * Includes 11 Baby-Animal Companion Pets, 19 3-Pose 3D Character Buddies, and Seasonal Halloween Pets.
 * Stand beside the monster on the bottom-right of the pedestal.
 */
(function (root) {
  'use strict';

  var PET_ITEMS = [
  {
    "id": "pet-crew-orange",
    "name": "Sunny Fox Kit Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🦊",
    "rarity": "common",
    "price": 30,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A cheerful orange baby fox kit with a fluffy white-tipped tail and a tiny yellow scarf.",
    "imageSrc": "assets/monsters/pets/pet-crew-orange.png",
    "status": "active"
  },
  {
    "id": "pet-crew-black",
    "name": "Shadow Panther Cub",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐾",
    "rarity": "common",
    "price": 30,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A brave velvet-black panther cub with bright golden eyes and a silver star collar.",
    "imageSrc": "assets/monsters/pets/pet-crew-black.png",
    "status": "active"
  },
  {
    "id": "pet-crew-cyan",
    "name": "Blossom Bunny Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🌸",
    "rarity": "rare",
    "price": 50,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A sweet sky-blue baby bunny with floppy ears and a pink cherry blossom flower on its head.",
    "imageSrc": "assets/monsters/pets/pet-crew-cyan.png",
    "status": "active"
  },
  {
    "id": "pet-crew-green",
    "name": "Scout Frog Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐸",
    "rarity": "rare",
    "price": 50,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "An adventurous forest-green tree frog wearing a tan scout cap and a tiny red neckerchief.",
    "imageSrc": "assets/monsters/pets/pet-crew-green.png",
    "status": "active"
  },
  {
    "id": "pet-crew-lime",
    "name": "Mechanic Turtle Pal",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐢",
    "rarity": "rare",
    "price": 50,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A handy lime-green baby turtle in blue denim mechanic overalls holding a tiny toy wrench.",
    "imageSrc": "assets/monsters/pets/pet-crew-lime.png",
    "status": "active"
  },
  {
    "id": "pet-crew-yellow-chef",
    "name": "Chef Duckling Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐥",
    "rarity": "epic",
    "price": 70,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A master kitchen yellow duckling wearing a puffy white chef hat and a miniature apron.",
    "imageSrc": "assets/monsters/pets/pet-crew-yellow-chef.png",
    "status": "active"
  },
  {
    "id": "pet-crew-brown-chef",
    "name": "Chef Coco Bear Cub",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐻",
    "rarity": "epic",
    "price": 70,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A cocoa-brown bakery bear cub wearing a white chef toque and holding a tiny wooden whisk.",
    "imageSrc": "assets/monsters/pets/pet-crew-brown-chef.png",
    "status": "active"
  },
  {
    "id": "pet-crew-white-suit",
    "name": "Agent Penguin Chick",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐧",
    "rarity": "epic",
    "price": 70,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A dapper snowy-white penguin chick dressed in a tuxedo jacket and a red bow tie.",
    "imageSrc": "assets/monsters/pets/pet-crew-white-suit.png",
    "status": "active"
  },
  {
    "id": "pet-crew-red-captain",
    "name": "Captain Red Panda",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐼",
    "rarity": "legendary",
    "price": 100,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A legendary baby red panda commander with a striped tail and a gold-trimmed captain hat.",
    "imageSrc": "assets/monsters/pets/pet-crew-red-captain.png",
    "status": "active"
  },
  {
    "id": "pet-crew-purple-police",
    "name": "Ranger Owlet Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🦉",
    "rarity": "legendary",
    "price": 100,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A heroic plum-purple baby owlet wearing a park ranger cap and a shiny golden star badge.",
    "imageSrc": "assets/monsters/pets/pet-crew-purple-police.png",
    "status": "active"
  },
  {
    "id": "pet-crew-blue-doctor",
    "name": "Doctor Koala Joey",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐨",
    "rarity": "legendary",
    "price": 100,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A caring blue-grey baby koala joey wearing a white doctor coat and a tiny toy stethoscope.",
    "imageSrc": "assets/monsters/pets/pet-crew-blue-doctor.png",
    "status": "active"
  },
  {
    "id": "pet-hero-sonic",
    "name": "Sonic Speed Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "💨",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Super-fast blue hedgehog hero with 3 interactive poses (Idle, Wave, Action Jump)!",
    "imageSrc": "assets/monsters/buddies/sonic_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/sonic_idle.webp",
      "wave": "assets/monsters/buddies/sonic_wave.webp",
      "jump": "assets/monsters/buddies/sonic_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-shadow",
    "name": "Shadow Speed Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "⚡",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Ultimate black-and-red speed rival with 3 interactive poses (Idle, Wave, Action Jump)!",
    "imageSrc": "assets/monsters/buddies/shadow_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/shadow_idle.webp",
      "wave": "assets/monsters/buddies/shadow_wave.webp",
      "jump": "assets/monsters/buddies/shadow_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-mario",
    "name": "Super Mario Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🍄",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Cheerful red-cap kingdom hero with 3 interactive poses (Idle, Wave, Power Jump)!",
    "imageSrc": "assets/monsters/buddies/mario_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/mario_idle.webp",
      "wave": "assets/monsters/buddies/mario_wave.webp",
      "jump": "assets/monsters/buddies/mario_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-yoshi",
    "name": "Yoshi Dino Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🦖",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Friendly green dino pal in orange boots with 3 interactive poses (Idle, Wave, Flutter Jump)!",
    "imageSrc": "assets/monsters/buddies/yoshi_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/yoshi_idle.webp",
      "wave": "assets/monsters/buddies/yoshi_wave.webp",
      "jump": "assets/monsters/buddies/yoshi_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-rumi",
    "name": "Rumi K-Pop Star",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🎤",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Dazzling purple-braid K-Pop idol hero with 3 interactive stage poses (Idle, Wave, Concert Jump)!",
    "imageSrc": "assets/monsters/buddies/rumi_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/rumi_idle.webp",
      "wave": "assets/monsters/buddies/rumi_wave.webp",
      "jump": "assets/monsters/buddies/rumi_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-mira",
    "name": "Mira K-Pop Star",
    "category": "pet",
    "subCategory": "pets",
    "icon": "💖",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Glowing pink-hair K-Pop idol dancer with 3 interactive stage poses (Idle, Wave, Concert Jump)!",
    "imageSrc": "assets/monsters/buddies/mira_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/mira_idle.webp",
      "wave": "assets/monsters/buddies/mira_wave.webp",
      "jump": "assets/monsters/buddies/mira_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-zoey",
    "name": "Zoey K-Pop Star",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🌟",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Energetic twin-bun K-Pop star with 3 interactive stage poses (Idle, Wave, Concert Jump)!",
    "imageSrc": "assets/monsters/buddies/zoey_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/zoey_idle.webp",
      "wave": "assets/monsters/buddies/zoey_wave.webp",
      "jump": "assets/monsters/buddies/zoey_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-stitch",
    "name": "Cosmic Blue Koala",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🛸",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Playful big-eared blue space buddy with 3 interactive poses (Idle, Aloha Wave, Star Jump)!",
    "imageSrc": "assets/monsters/buddies/stitch_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/stitch_idle.webp",
      "wave": "assets/monsters/buddies/stitch_wave.webp",
      "jump": "assets/monsters/buddies/stitch_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-cinnamoroll",
    "name": "Cinnamoroll Cloud Pup",
    "category": "pet",
    "subCategory": "pets",
    "icon": "☁️",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Fluffy white cloud puppy with long ears and 3 cute poses (Idle, Wave, Sky Fly)!",
    "imageSrc": "assets/monsters/buddies/cinnamoroll_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/cinnamoroll_idle.webp",
      "wave": "assets/monsters/buddies/cinnamoroll_wave.webp",
      "jump": "assets/monsters/buddies/cinnamoroll_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-kuromi",
    "name": "Kuromi Punk Bunny",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🎀",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Mischievous jester-hood bunny pal with pink bow and 3 cute poses (Idle, Wave, Star Jump)!",
    "imageSrc": "assets/monsters/buddies/kuromi_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/kuromi_idle.webp",
      "wave": "assets/monsters/buddies/kuromi_wave.webp",
      "jump": "assets/monsters/buddies/kuromi_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-dogman",
    "name": "Dog Man Hero Cop",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐶",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Brave comic-book hound officer in blue uniform with 3 poses (Idle, Salute Wave, Action Jump)!",
    "imageSrc": "assets/monsters/buddies/dogman_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/dogman_idle.webp",
      "wave": "assets/monsters/buddies/dogman_wave.webp",
      "jump": "assets/monsters/buddies/dogman_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-creeper",
    "name": "Pixel Creeper Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🟩",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Blocky green voxel craft companion with 3 poses (Idle, Hop Wave, Sparkle Pop)!",
    "imageSrc": "assets/monsters/buddies/creeper_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/creeper_idle.webp",
      "wave": "assets/monsters/buddies/creeper_wave.webp",
      "jump": "assets/monsters/buddies/creeper_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-pikachu",
    "name": "Spark Mouse Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "⚡",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Electric yellow lightning-tail buddy with rosy cheeks and 3 poses (Idle, Wave, Thunder Jump)!",
    "imageSrc": "assets/monsters/buddies/pikachu_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/pikachu_idle.webp",
      "wave": "assets/monsters/buddies/pikachu_wave.webp",
      "jump": "assets/monsters/buddies/pikachu_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-charizard",
    "name": "Flame Wing Dragon",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🔥",
    "rarity": "mythic",
    "price": 500,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Mythic orange fire-tail dragon champion with 3 epic poses (Idle, Wing Wave, Sky Flight)!",
    "imageSrc": "assets/monsters/buddies/charizard_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/charizard_idle.webp",
      "wave": "assets/monsters/buddies/charizard_wave.webp",
      "jump": "assets/monsters/buddies/charizard_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-miles",
    "name": "Miles Web-Hero Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🕸️",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Black-and-red web-slinging hero with 3 acrobatic poses (Idle, Friendly Wave, Web Swing Jump)!",
    "imageSrc": "assets/monsters/buddies/miles_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/miles_idle.webp",
      "wave": "assets/monsters/buddies/miles_wave.webp",
      "jump": "assets/monsters/buddies/miles_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-peter",
    "name": "Peter Web-Hero Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🕷️",
    "rarity": "legendary",
    "price": 200,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Classic red-and-blue web-slinging hero with 3 acrobatic poses (Idle, Friendly Wave, Web Leap)!",
    "imageSrc": "assets/monsters/buddies/peter_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/peter_idle.webp",
      "wave": "assets/monsters/buddies/peter_wave.webp",
      "jump": "assets/monsters/buddies/peter_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-spongebob",
    "name": "Sponge Chef Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🧽",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Cheerful yellow sea-sponge buddy in square trousers with 3 poses (Idle, Wave, Hooray Jump)!",
    "imageSrc": "assets/monsters/buddies/spongebob_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/spongebob_idle.webp",
      "wave": "assets/monsters/buddies/spongebob_wave.webp",
      "jump": "assets/monsters/buddies/spongebob_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-pomni",
    "name": "Pomni Jester Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🎪",
    "rarity": "epic",
    "price": 90,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Colorful red-and-blue circus jester buddy with 3 expressive poses (Idle, Wave, Circus Jump)!",
    "imageSrc": "assets/monsters/buddies/pomni_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/pomni_idle.webp",
      "wave": "assets/monsters/buddies/pomni_wave.webp",
      "jump": "assets/monsters/buddies/pomni_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hero-golden-freddy",
    "name": "Golden Bear Legend",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🎩",
    "rarity": "mythic",
    "price": 500,
    "shopLevel": 1,
    "unlockLevel": 1,
    "unlockType": "store",
    "coinsOnly": true,
    "unlockRequirement": {
      "level": 1,
      "label": "Buy in the Shop 🛒"
    },
    "description": "Mythic golden animatronic show-bear with top hat, bow tie, and 3 poses (Idle, Stage Wave, Power Jump)!",
    "imageSrc": "assets/monsters/buddies/golden_freddy_idle.webp",
    "poses": {
      "idle": "assets/monsters/buddies/golden_freddy_idle.webp",
      "wave": "assets/monsters/buddies/golden_freddy_wave.webp",
      "jump": "assets/monsters/buddies/golden_freddy_jump.webp"
    },
    "status": "active"
  },
  {
    "id": "pet-hal-ghost",
    "name": "Friendly Ghost Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "👻",
    "rarity": "rare",
    "price": 50,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A shy round ghost with rosy cheeks and a tiny purple bow tie.",
    "imageSrc": "assets/monsters/pets/pet-hal-ghost.png",
    "status": "active"
  },
  {
    "id": "pet-hal-bat",
    "name": "Little Bat Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🦇",
    "rarity": "rare",
    "price": 50,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A small purple bat with big ears who wraps up in its wings like a cape.",
    "imageSrc": "assets/monsters/pets/pet-hal-bat.png",
    "status": "active"
  },
  {
    "id": "pet-hal-pumpkin",
    "name": "Pumpkin Pal",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🎃",
    "rarity": "common",
    "price": 30,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A chubby orange pumpkin on two little feet with a curly stem and a big smile.",
    "imageSrc": "assets/monsters/pets/pet-hal-pumpkin.png",
    "status": "active"
  },
  {
    "id": "pet-hal-cat",
    "name": "Witch Cat Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🐈‍⬛",
    "rarity": "epic",
    "price": 70,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A black cat in a floppy purple witch hat with a gold buckle.",
    "imageSrc": "assets/monsters/pets/pet-hal-cat.png",
    "status": "active"
  },
  {
    "id": "pet-hal-skeleton",
    "name": "Bony Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "💀",
    "rarity": "epic",
    "price": 70,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A tiny friendly skeleton with a big smile and a cosy orange scarf.",
    "imageSrc": "assets/monsters/pets/pet-hal-skeleton.png",
    "status": "active"
  },
  {
    "id": "pet-hal-spider",
    "name": "Spider Buddy",
    "category": "pet",
    "subCategory": "pets",
    "icon": "🕷️",
    "rarity": "common",
    "price": 30,
    "unlockLevel": 1,
    "unlockType": "store",
    "unlockRequirement": {
      "level": 1,
      "label": "Buy it in the Shop 🛒 or find it in a Mystery Box"
    },
    "description": "A small friendly spider with big shiny eyes and a red bow.",
    "imageSrc": "assets/monsters/pets/pet-hal-spider.png",
    "status": "active"
  }
];

  /* Halloween things appear from 26 October 2026 (add ?halloween=1 to the address, or set localStorage eaa_preview_halloween, to preview them earlier) */
  var HAL_ON = (function () { try { if (/[?&]halloween=1/.test(root.location.search) || localStorage.getItem('eaa_preview_halloween')) return true; } catch (e) { /* ignore */ } var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() >= 20261026; })();
  if (!HAL_ON) PET_ITEMS = PET_ITEMS.filter(function (p) { return !/^pet-hal-/.test(p.id); });

  var PET_DATA_URIS = {
  "pet-crew-orange": "data:image/webp;base64,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",
  "pet-crew-black": "data:image/webp;base64,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",
  "pet-crew-cyan": "data:image/webp;base64,UklGRuIVAABXRUJQVlA4WAoAAAAQAAAAiwAAiwAAQUxQSA4GAAABsAVr2yHJ1pdZ1VVj27bNbdu2bdv23se2fbZt2zY6NgYVGV988cUX70VVZ/715/9fnXMRERNA/1vfbYefPPzQRbOSoHRfcfrlx86qlGDLr9Hyvinh6Dh+DZpf3Cbx7XJA1EwV2D8UAz8ARFUVuLvm18loGFpqhj3C0GcdGC0tw6MVn6YgQ84Mo0OQPAlB14wbPUpeVc2j9mQIDgAjL2OqP3PByK2YVr7eopZL7XZ/fm6SD7LmlmHlGn/zVzDkV/TxpZrBCjRv592k8244ebulPZuOg0PGDr6MgKCoCWMzv5Jz0fq4lA5DJlZIcLMvC8CFABPp7tXZaIgIs+LsUWA4VNzty0ZOwNivULX/lM0OuerHP/nd3/74yx//4Mid5gytt+i1aPGeYLQ0sU4zN88lnmzrRnF7ru5zTrxzDYrLoxetHnQqABjabXjTlxVuDFlHF/12/CealZlFRFVFhJkVLY1ZkNdcPUeeToW4gGJcU3X53wCARQ3FTYVV4KXi9770gjkx+2gl1fb9AjBWlJ5xoi/J7VAXzTd2AqwIIWOZL/QDiBsTgA1hNO3tS3cYXIshkGba3ZepYGcBZczwZbFFYeO2JR3VlIiGQWOwsk0Dz34za7z3vaWV5GVo8AQjqTp6o91WDk/c7I0u31n9t/AZPhlzdCeaX9gycXAUWMzMhBHHzgwQZhbgb/VCE9BAl6ZRAMTQbBkerxS5z7SrWBq6znB8gWEwRFylZ74dTWIm2CnfRdCYKX6e7+q4GZ7Jd1XsPsq3FyRuL+SbCouZ4pZ8HR/AIibYOB+dDIkYuGeBfqIWLbGfU9FzIdFijC1UfdI0UoKfUPExiJTZm3UHNYZFiTGdXN5uGiVDDyebgGOk9ig5TR8GRyjDCjfU4wNwdDL8g1z3uBsmFhNjPFR1Rsl+hogaA9dWqZ0Db/zEogE8M5faPcU0DmavbplSe9O5Jz0Oi4JZVqM2L3sb8TQ7ckylLccCLBaL5vcOqLlbhYYhpiLAR3NdpV+LIbLGwERH08CIr+rXVTe7WIzA2MLNEYiS2u/c7B4nw6uJk7mQOL3tpt4wi5DiTnJ7LiRCbCc66qGqEcJgRzQXJrFhXETOZ2RgsZhkeK7ijvr8BYBKLETwZDdq68Sz3gZUzMyEhUXDYCJWwIQZwKkVanc64Djk1hAYALCIsFgLRfMtQ8nLUT94vSGf/HjxlCNOewBSPsW3E7Zbh9bCzArcdti8HuRt0lFLqTm9DVw2wbcDiWorLvzlBbvcKGj+3WAq68kQLRXj7X6Usz5+5SZz+1OJtwG4PCr4S42COupxQKwUxsAhCQU2PUABMe+Mgf8OpwD3PLYBsHmlDLy8ggJdP/Br+P7iximFu7b53TBvDH9emFLYT4X4ophOoZ8Hga+CCaGrfKHm0e9Dtx8Y/ir6hK3ytZlHjLPDtgIMny3rHrSfm3jF2DFk6dcwrxT/DFlfKLw2y6pdVcftdcVVZ62oBWQYxC8Yrh6XNg06vRMtv9o8HKO8gwFvHjB0wg0AhEWEgeODMcw/iKBZxdDSMswMRS+Yd4CxiCCn2jOhSN+G+VdcMSAQdJFJ+dg2CsUkhAAHhiL5t0oADgkFjYEFYJdg0A6Zlm9BOOjP0JIp+gXk95ByKV5NAnJJ2diOp4BuDi6XYnBIRkJLpfZvCmnta1iZBFODUmeUWe0hCmoPlJoxISx9SiW4iMLaq0xqb1YC0xtWGmMMo8DW18BKYowlFNrkSWg5jLEJhfcKSClUsDkFeHkpjIHFFOIea8x8MwGeG0phvtHEJzNhoLF3SoEeBzdiTgzNnQd0o3CfCnXh/LOXr1vaQSFfBXZx1YuwQobX+6QJBf4eaCEDJ3tACgkuoeBXG7BCin/TNuBCbLuEr84OGMvoBkghxZDwJc+ZFjHNqnQPtIjakxTBY5EVsHXYn+iXkCKMDWPQvQFmtdYqDPwwIdpduYDKJ2kMaPDjyL9u94SIBiHTXJphHsUxGb/vb77iNWuANc9csaJOLY8AoCKqIiIK7EsRTTsqlW71CuVddDvyPjSdYt93zOJjb77uyENP2mlkQv+nFFZQOCCuDwAAMEQAnQEqjACMAD5hKpFFpCKhlYsl4EAGBKCHABlI/YolaqPoODUNnY19XP6X3pnmU84P0q/3T1AP6r1I/oAdLZ/csEj/lPa7/evx585fx36b/R/mN6vOZefp+581f1w8eflZqBfkf80/1PBJ2b9Bf2b+zf87j7+ynsAfyv+mf9HymfDK8z9gT+b/1T/p/4n2SP9f/T+iT9A/0X/a/zXwDfyT+hf7n+6/5f9oPmx9nn7XexR+uLWKnKAqA3A1cuA8XxqXCS5UhUNBQACJxviucOqTuiFPblqliu39t9N98nWoF8nCgwyjnrjThE2zTGtt7OKsDwJgComPIYJ136f/goYMYH0qaWngfEizap2YIoke8f2b2Uiv/4ZnO9TO1Q5snpguybACCoTJERVsPPQaepXlNXfZ2DXYqmxZ1UTPEQjl6RMok6TQI6vICt/pvQDMUJB5dXkgCtRS3ahDJ6FjcqBS38IGx9mmKe0m15CEymdZ8FlCjckBdxhj75HfamoB52veYu35t5FwmoamU9+lDe1w09XlSNpX4heaHlsTnels38mug1+Kr/g7SCr+iMTNqLnLYSwm+T6ttaOdO3ByUf8jg9Ie0e7pXoP/+N00sons9XUaP09riRpDLV/zrZ+4dEz+lgum/Nf8LuDj86H8DcGXNi7zFPulDx9sWSTSFOMBdUOzXX8kpSve7ZSzijtzuf9aSZqXq/P3/O4wS+J0/+bJ6dta5vBnSAAA/uxCs1RCZkJS1J8mEycaEgIoIv/JTn4/SDmus0bv7/l9Ref8ZY2mTUGs8+4XkoTBc9ip+Ky9zuJgaTrRNOqZpO56kv38jd9lzLivudmoDUTamK8y4KXQ6vJ3sILrZO1s+BBCFv7QbfjxygOjUQtejOxkrH/9v9EJ/VWQxOhNvFip9raJIk9VJ59oPhNUi1qd9lxFZP1hWcdtBBpF4jFoHgXBKBRFTvfmkR0UoWusZ3+DB+k4deg9iItNNEKGzHC/rZd9klbl89HuqpRi4HQzvYYSAnGjuYOpdXgolsGkonydyh+71fP1aey3n7i7KjS33iRaMESgBVEPoI3n/2ww8Hzm0h0ObN/brmv7/8ID/2aNS9/iZjIOqT5wsR/L2KYY+F0ON8mwow/8e2Usndd7Btu4qkiHXyLB5QYqXNlHnwDxNT3lidoLbUPdchAkmqA3IxuiTrWAOFEVPpkTA1wDSgiTti0XAQGVOsARDfATwkc98uvl3JZL1+d/89/7/ctHrwNvTfl2EXn+JmSSR+RnYSn6xCWntFpQqQXTv7pG367dEIip1RGW4j74x6Ly19EW+ziJu+WdCqizL5JKPucgXgprWRYnLnWOR6NbFWX3YCDiMVLFWF0gVBV9yIlK8AdMCOM8sEvnAqWs/zlHilqgC88SXiGX628lxnG6L2GEtcZw1hnWqSXWgohGBt+wquy6lsM461xTXWfC03tCrM2FfgA7MnWoZMAhc13Oe5Y1z6kVpQgi8apsP0XcahXjP5bMGvKOhJE6lp/kC6jA8ve+CGllpJ7q98J/v1x8cB8sDsAYci0CkMEff2fKrmcHGWCW5gQvu5xoslK6iyD8TZW7z1r4x/mFIuTiiVlBpaMRxkbP4c2xBAIFmc0gy8QQklqpoCrTlizRRGF8WMZ83lkCqqsxKQNs1TcGS353KW5uIcCEBpDUTz92dzhd8rLvNnfCDLH23q7EGwNl+jEEzsSybASpn5lq6tQDLZnOASADt2zFBU2QUcrQfBRnuhuT4YqI15EiY8anjtgaQEpGXDNHpwI3aS/MqJ/varIonP0VYs91mwokLRdWKM02Zbv5fROMb5KWoZTAh3xaO54A/8OBIfMXoW5qT+/ZLQa/L59rkJ5IKO7RSm2vRCoXIjxENBCUckdxRJ2mOJFMC1ogiZLPUye1Nc1K1fJQAqKZwcG4aSg2FfhDl5RKHF3t0AFAX4y23MTrWx8fFfC181iFIeFhCOQSLF9Y4yWFaqkYoifh4BqpQBQr/lptp8WwV8Es5+bZHt/8xQcn6l/+OdSfyZjB/w4FxrtZ9DPCr2nkCDz0CgvDFFBv5NlyZ9XAWVjB5LGenodjQ2NpWJ5Bv40Mdh/Cx4K7tEAl9Flgo38uHxJ7ncPRxe9SIcbyVFHI4TUkFOO+5lMSsyJyU3jBZvw/LQFWUW6Rhcjh2sDUFVPo2NIGEDPlGVh9hg82WtVYztopR8T9Enh3wsOyO8A1+qjQlVeL/7CfLcVUx1IBUqSXo/7S1tJqE+2+v7e1FWzD/JmKE5lhmmNadcn7qtj/qWzcWSa0gGNzbWd7xIkyW1g+6YiGhYeAfMdxhTi44D8h48OcQU5LktJRSad5QMUmH5GjfodkD90dwWwA1BW1bnmLQbPbFX8DRuGlAZ58xuW7v7Y8iI+dhz4ljNNPZX9/CQu0wR73W7V/ZIj0nPqO5zuEJK5u8FjeY7q/IYv1MAh/MyTTwEOPRkbEaxZTEmxsknhieqRrOI+vqa7L4P2PvctGDa6Q3OF83PBcrI7Zeupfknx4dnxDV9Q+db/kUqkzwSnPPX4BLW0z+LpCar4brBbhLHa9bQfMgnGTdnzUH2HseowJ3dDSglzzvtZmD8PWLhd+gmnAF6feRAF8RZpixaTMBCIrcNPK8mL0ShpF6pdjzExGuZ72VEiIuyi/OgDNxIrl0c64EgHFLxefOirulqP5s4Lt2nTc6hnOkSWtzQA6ppL5SQ4Zu0VP94PvAU4oqdvvP9owDgiu53IhwPT9z347XTRUKcoJzghib7S84iL1f09gZDNIXZJupRqIE5biiPLY4a/lwOVccDlV243TL45EL4eqWjXjxRuZ7TrAKH8QRr1lHEdauOVPW1IZ/QP/F8HWrFVf+hNvF2bw5uWYlLBDmXPBboUJOJORYWwNL9fx1EmS5os4oS/qsUCNcirtw0WrYcQGjfFzjf9NLuu0otnXpZCVVKFEWOZxmb0dursRVxboh6UOlUoTOXy+A5gYlq91cUwp1Vjv4zx9f8MQxtNm/ob1o8sYGNLr3RDl+x5lhGzU3y9iSuuPRa+Xb513CHJVy7zmn8c1O/gQjx1JLN+PDBpdOzbtjqovDxi1GEqf9Vcd/dAhIHwvo2Wyr+C0cBh0Lt2H33aRf7rXssfm9k7fNR/7rRkPxVWTLavu/vDIQ5eeGsb/phMpN2EHNmdudzZl/s8TJNhDH6fsfRte9zE9+yGHYQkLQuOAUIgY0CJGIM2wqqTev3z/Tqmyri7n+4gDmuR0wylCDzwt9d7qWXuD63tbHEakc2vJspsE3A2Vcq8vFNmU4fyKh4qr/N2tE/s1s3Jxiv9HTGq+Q4Ia0C7u/OrKwDDOjVT4OCQ5yZiXU+roN3B+Tl5p6GV4Z9H4TMZ1Wb+ThfdAar59tJzuu2aUHQE6MhCOjP40CDBHQKhKkM5A7gaBMIpW5T6OQxUAsZwdBwrS62kPXqfmRBwYU7uj7v5Wq90jW+B52ls6tcYXXWaRNANZRIIOM9ayqB3DO4Dxh3CxkdAtTdTzvWyAD9uD3uU8gMo+9Xwn0CN7RwEBmMRDHAp62BxDc92oy4a94V+DHn37pBOE31D+UD/yLMogCo6dQu4rk0gC84u0gcqJX3rZvDBaMRNK7GyeAmuPn62dLtkRxl3HrE7VmQyx+OfN/6to08r87AVLw0hxJI8Vzm/u9S9XRudZiOEkjyQkBPVI/xzLm62SY/7TM6hFGEs/H1pKEXxaZ8yGk2uTKFcLdCLZNLtf2yNmJSBRM9D5Ny43cTcMhHw1PBptOL8+cFNks4aS796Y7929EcJKYa8IDpowDdRbHgfnYNNsvS1aiLhN2FBcgN1nHMzAeSURMaKZm67q44Q1PELEu4SdYA3wOB7ZnW5IBfsHpY8S6e7T6OiqliAFN8ICv6ZSizr/dTXUa6WLRcQM6MHHuHY/mAqA1bU+ZZEH1lazf7w839+Z5178owMa99/yLAD3JLmsnGH+ZklEhJAmmBXQ8P/Lv3o+F7L9Z4/uf93FJESQoR+WZ80MX+G4v4rpHr7mUt0Qj0u7l6rnx0Af4/Q9gnZ6WwoGaFBI0N1QgrZlNZ0BHQqeI5zSlzK3tjJd0EaBq7iIuK3GadeRv9iJXnZk12QiRGW7fTPm79bdS9keqM2rsvQA/j70ypcC4Wmm8Xy7occ+GjQ2a8q/p8rngCj5DYMt0zLBPJsUQC7vTz7sNfAs3rdw57tSe3OKt+SqSxI4LEJGXj5UeGroVNIhdgeZVexnjJpRNEd359KLGQqlTN8H0yvkQ1uRe3ubI/IQR4YThXNDtdfb44g5TOruHaipa0t7r8a8i+yNY1GPuSoK0zQ3nXF5CpAqEy0L9TRdd+gqYEOptBg1qEy+ecNaZlzl6Na7RuPPNatHJ0lvCIuu+9I059ytXyAXBuul/ND/TRA8tebv/ZcX2bGvoZS0R1bbZpR7KIH4poRLV+kVcCy4F90oD/rs9LuXhKIK9QgUx1q4mJbD/UFyHdscsRzaHn3dvRSJz8J7LUj7E3Zqpg2qzZisESSEKcVTRU/TC46Q8F3t+Tbdd7CZrrdmz+8Lxzi5qlGgnNKc7ttIdHVwrhnw4EKkQ4yw1oP9KFiH/RS3iKTkTh4qDdB7CbNsi4gwe8XFJ1mZ6f/Tf4JpOkniEfgeUsO9eS1QLZ4p250USSsxx4eTstOkBJfJcJXdZoS1rdh/5CmaXLuJI4OGnbPzjdeyPhJer++LRUWS5si7xNNVV9fritFZnfrY5Z9l/tKFTL39bxW9yvhTksYvIc6pCxksNsbNnUn/2JnMRnGjGQ78kYXlyftAgZVkqtQ1l7Si9DCr3NH/7HMCnBpclsOyer5kYxYCmctvK5SJklrKT/UBEAqRIi58SZBbsZ082dyRBQR2Wc8Y+Z96hazHQUUYe+gyLExKL6cxnFRXyjAyuuXhnVl/HySzRT2drG83u4A5jQ2u4R/xPtlo3JZH3d4p0638MXkqwBIfS1tMtOa2dnQBK8lq+yCAGNUPw//7R63qrY8mO/ZfEf3GEwhcgkWqRLmd4lrOgfIYE10QpMktkdnRFd9Za97gtARKkdhznm+dehJXWqBaPXvAEaJ4KAm/a8xq0NyPNhhjQi6/KXkhHQeBD5LMhfDAv5YTM/X0NTF7LasC/luq1YOIGjlekrKWJ1V+Cu6VlDOg1IiKZ7mC01b3yYRlwDZ042sXYxEEJrTJmHX5DMysFa7G+inpAnzmDikXgJXFC/Bdz+FMlxh/SWA+J6ny9e4jBswPA61syIcSrVN8z6DACkkq2foJ65Sj4GJU34Sp9rs8DGcBsR58OjM2sgCfFvV92+AS2xz36n7My2c4DDYtC5/2hvlgFelaAAAA",
  "pet-crew-green": "data:image/webp;base64,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",
  "pet-crew-lime": "data:image/webp;base64,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",
  "pet-crew-yellow-chef": "data:image/webp;base64,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",
  "pet-crew-brown-chef": "data:image/webp;base64,UklGRmgPAABXRUJQVlA4WAoAAAAQAAAAiwAAiwAAQUxQSEAEAAABoMTatmnbWvtcW0/ftm3btm3btm3b9v8PpW/btnGyMjMz0wvPa85T+pWImID0P+FqcJm9Lrr55ov2W2lUrdGNOuQNJvHt3boa2Yg7AURUVUUM2LrWsDYFEWMSLcPHo284bJmuhtPUfjSiTLYwwatGNZJp93riJxCmpKlINti1YSwylvGVqSjCOVVDaL0BJKsxletc0gja3qWulPgvq8VXG02mTNMfmsM7jEypwsrRzYxQrNp9wc2rYuUYP7WENidqFKw2LLLWP1UpiukiO5FM0cbwwHpVKVuYNbBVkOIWCGz/4pR5A7sTLUyYMa7qFawws4640nVoWcLdKfATkbKMGSPbyXJR8vdBKfIhpCh+fuC4FTvjSvciRY1vR7SH1f2VWVEq2fh5xqiqe9Gixs8wc0wtT6CUryqDETWNRfAoPFMFdDMZn8K88WxKxoudH067qHkxfmqJZk0Et8qoaB5G/QgrBTNQx7GwSTCroq52CuYwV5kVgtnV2VzBnOzKtCOYizypjU7Bboj4EVaMZiTmRnmzFk16ytSLMHcKdz7Ei1lPPOkBxIkyW0C9qPjIbBRQmg/MhXBhRGnYM2YelMdDSqNQD8YnTSEtjXjArC+kvZwIC4V0oZv9IqqeR10or1QRPeQEYzCglq8wH8JaAXXh5/iA+szwclVAXW6UhwKqfYP5MN6uxZOuRnwo46qANiR7eT4FPK85yRwUUT/qZf6I0jOoC6u3hjTSxINwcop5L6Q8E+kOqt0c1Nk6RX0E9dKUB6qwaveSyzJ7oDXFXe1FtpLE5k6hbwxSkOnfo0JL831DycJ9saXWw/+1csz+bI8tpc2Rcvi7NbjqYbQY4Y4U/CoIpZrWe4Nr/sqspBmCWxqhXDMZFtuNVhJqP/RG1vIzVhLKV62BTYdRtjC6FteqSGEIl8R1XHlkNo2qehErzjLTB9VvRvlqb1QxzYs4QFgippOd2B0hDani8+/eiA5BfBjLB1S9gvpQdo9n6Fo1vOwWzipguDkxmr0Rwc/ZwYykbrgVtgjmchP8GtPHMhzFr9nbVSxbWXaU2TXFehriR/mqOZiLUDcqOjwF+7AbzbBQivYYy07gpRlTuAvg5YEVainepp/VHCi3ppiXpu5AOC+odBx1dXBRVOkYsPJOCyvNeCNW3MlxpTTWtCzlxshWIpclenNktc/MiqqzcmRpaaSkzKNVaGkcWo7ySluKfQlyMcqtLSn4drNSzL5oStFXb2KFKI+m+C9HCkFYMr6DyKUoo+PbrhxDOsNbvRyUGcKbVbUUU5s1vE6zUhCmD696X7UQk3+bw0sb8++UkSxqk2CSM+um+KtnqYtNlhrjm0oWUTWAXVIjbL0bQEXUTMcXBXbc8uxnfmXiP9+w/WBqkLMd/yaTWb952pRSauoePtsCcwwfGNbXlBpprX/+jQ676NFx15539RXHrD9HZ/p/MVZQOCACCwAAMDMAnQEqjACMAD5hLJJGpCKhoSf0C0iADAljANcYvoYUpq69e0LpY39VG3i8w/m8+k/ebfQr6Y/AN/5f2sf3vwf8LvsH9n/bf1zcs9qX8i+/37TzM8LfjVqEfj39I8qiG3op6CPd3/k+EFrSd4fNZ/5XkzeG/517An84/xv/S9Qn/q/0H5Ge4z89/w3/Z/0fwCfyf+n/8D++9Uz7E/6ym5rcB4852/yousCWcediLGfk5cX9q0SD4UDC/ud9WQ0m6OcARaLkgAJk+1On50DgevjEl/bxVIujmtXwklizDOAYiqQFsWG82S158nAvN1H70iRbpL45W60uR3yw7HEjJ8GbRbVXG5RPYpbcpwt2NA5Xkesr4hoUz7Kae+cK6xhFjQRiyeqM8H2tTMjxqUe3N4+FPc4E2yTBxylAFCtScw1dB0wB7gaHwsNnAZvW7WRwzjCANOBsKxBJPRsu4gNaJtTs87dzqBnCuorAn+Djwo+azptziBS92QLeRV8fhnn8iI8GX5O5uJXueZgt9ahBt8EwviU7e4G7QvGsvp2rFtzaAAD+/TZsj22sn2lwYpu+Sreao4+pwzGWKTazTsXBiMLs23qEThggiLJOKL9sjR3nWvGRaX9WuVqs26cGM+rRwhKofYeXKh4gVPpWhELY5ME9VgkzxzIQtL1G11x+piCKtE47N3olKwytoqxg2OCs8NF1JbyDB9pl7czLSeVlTsH7P9CH1X3Xr6lIzxO5P6vJ2nCQKrD4rmGbYhnfHo5ATVFtN92i+dkjrH5e8dlUlWBK4mKuadAricEakPff//cdO5hjiTGTCxXulKzM8PrPm5N8xTeSQKbURXmVu9EwoAo5V9FvHa19F2bK1FL979K8bebTCmnB9743IVu+ZsxtV9iTyBDa3PfTFC1QOQzh0ppk90K5d/J840LzmkSgbJCqoDFLzuOFzCw1clgsttQmCrI3jT9ZIr7SM+BPwNdy2DqhUlL7s5DjmAMkrBXPEEw9Nzt+samJGOhxm8D58NY0TX3TvMZEDnsw4c0Sn22Tq+KZjb5slwZ6rQnfq8eAFB6iC/xTstVr0tZ4iygS/ZciN/dTuP3ZL8aybYQDhlfxJ/u9iwWYCu2r6NdEAss634csFV2FKjf3M/XaLUOrXSUIN403y+rgYqdSOWicp4sjP6daRyY9UAHqFp1vmAbFPp05o5ccMOVltKCVuh6zuzsVWT5WSXcySjcV8wrPIsQ9PKv+5oZSJ8pj5Zq01/N9CAgSZGL2vC+kjrS9+cfwiCTrAa9ftkyaVsGdpDE45MN41y3lX1b48EJwoAmMSw5nWJ+dkOxgmfI//mwVcQcb2n2cKhjGUhqD3qQCasuDoO9WY/ZtwCc69mmgH+3eeXX95RpDIoe94lgIVAD2ZFElZ/NXYuwOc0/LOObHDftcD+MLZa5D7PLtusdBKa6Z1/7Tg0f2WGcpvz1AzqMhB9CuHtytpGbamtbdgDjM4FXqXDh4cbYA5HI34uEBAUM1fuwEenby6o9Cmrs7I9FmiMpdkfAmnMwrA0NXBS6xmw8mFj9c7CSw4xyclFRlQcsVYIRJNXCqW/0wibnl3UDulDhrTCmjhRcdH3KOZVKL3zTPrYZI8iVU2L3foCUAsM9kmxiqc/PgAzWX/RxyEh3FDJhmL1XqbI2zMxhvkNub7Z8Jsmzd2QnPtzOCdauDpVXcr/J7ZbEmVTjCv6HNgFXQxFydF4BSgxWy+1vCQg5mxPs9opg53883Ijnkz8nfLRgKsrsKjJyRtUMka2YADo9nDnIT5bp1bQNhXHUX0nz/NMMTOhDJ8o4t75TCEarKEaYR8qIyM2m3I46TaEgmC7Q1DfaYfYb/Fy+qXalRS1nENfZdhZNbKOv/juUuc5ujBzcYviVC0QDpzy/ym3C3YBcta2DtrHSLT+LxKKpCR3v3npq1FqvxI9nVBC05fgsLuGnt5aCO/N6EblbPgs8/nixaLXAso3Q33WMJN3EOhwKjh6eATGYguExh7u14V8XqQdoonJhacOzvi8nM2g8a2A2SBcVRirF4N70k3rDmLfkcCJ4pNPEZMDLlUnCkvA+tUb3Gbw+UA5v7IhtnBunaRdhg3KYUFYUTMOhQChXbEko0SzmwnUjEGpQAgdqu7BK4Mun5SXfmReEMqOSH7CH+RTqjyoqEAUPWPv/zazdc703vTy8S5zH8vnC8jaDrwxgUFbsukZNT5dZzdwJmd1KBKA6m/183e9DtTsHm2+aJrm8nmfpYv6XjiYQq5PmxYNl/3mKPPTz4AC/5ndT93qeuwSebzD4+mR2dSZ+lCQdBwrwlwmmjfxfD9UqEhH7rU0Td8GLBIyKhWcS8f/2m9USRxn4xjrFn5TJs3ZI8u4PElfuo0ihoP+XzR+YYumANvfkux4Z27/jP6CIv7wgmzc0jWfOzq5f1uTefuZix3wMecrgp0GBkzr/F9CBfO0TCLNcvnndEKZAADHonh2i4VEM+1X7zwwmRC9jiGJsRteEi1wNoqD3y8O6k9XISkngrbaP6/u+booYe+MKzltSYwYcXz7OKuQeq4MoJ9bwV0X6MtWom2yodTj5fCz3vAVXIKZcZOPllywTlf/0GEEpQvMUGfUFbBHxJWSncIFMCdRoqoovfK2HXkL2ePMvmX2MtmaSXLosktZw3y7qgQ3D2WXy0QFfh/MxVz4/WxoGLJedhTJLd0j7UXhVy9+luwJl/W/Qlpl2I5qgOU5LQjxnTzY+4783TMM1/1D34K9IASvpYw+J8cXuKfLJpskQSymGUrPf/XCrDwhtYPlcFfz/3t/Qwqfh+AFXAMJLHDz1SaignOhp1jgQNn4jWg/TXGr68eWylWAPZggXucnsXODxwOiS1x1j51wJeKBhPpRFTsbZvGiDQB5db/uvUH38qZju4x4WSusvKU0QuT72hCgqNSKw7V+3+kMO1vzQzs8VIvHXcT/BZgrQ73nbHhdW7m6zWMDP0PA9gcDZ2oRE72MLwimevPKs5+gT6aCU1m32Ozhr4kAWdWlTtyjHJmRgNaG61v/xe+ViCY/mXFpIisQs4bmjKZT7vmiPjFL5TV2LwK9azuRg/HJzCiIcHNDoazabAPSR3UPlYulJAH7iAisocxZAHiW+IGECcu8tPVS+H4dI8FahEM8gdJf4qvrwi9saGNRyj7QSuZIU43BjUn3zPavckYng4Qqeb1NBl+f2YgirrdQNOuP+30+RNuR9KQg4SzvtxXphwwIEu8eVBaoM5Ddo5E0Wb4LFSffXjmbEekxMv24h3/lbn0tb49jAweOkWJ8hfkfuH1zxxIvOU1tgMrKvu4hNqTb0cMoMBG6mlQ/mjUqi2T9wasHv6pa8k/vK2lhlWhzo2fnM7KNOWfK59XshvsP2I8Jexid1xBApfW1Ym2ejU1CzW1tnk/14UYoSa8uovqZe6zPXojJq4qyHQl+v8ACvRoH3wcb6cieKP3qqPwKTW5XNlxmUzP2I3l3BRjJbcW2hrBm+SOVkmB/iY/DiYhH+qZ07mLFxAMgO2msP5L+BOBSDowP80AUg3JqyjSzx/v5245p1np4iaG0YOyzfO/tt4Y4pO2mOxEc+tknKLvkloolvUsgHUNt6seSeXmzIBz1BXhFeDvf0B/gqKKvB+giRV9Y7LZuh7t3EolMzXAQwfd1U3m6CuY6rtSPzTAhpna94jAIHpV2IOrTp4PK9tkplx6bafFf5HsW8hibKjx2RK27AYNy5s0jKyOqlRQfkdR3AO8dpJc4AAAA==",
  "pet-crew-white-suit": "data:image/webp;base64,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",
  "pet-crew-red-captain": "data:image/webp;base64,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",
  "pet-crew-purple-police": "data:image/webp;base64,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",
  "pet-crew-blue-doctor": "data:image/webp;base64,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",
  "pet-hal-ghost": "data:image/webp;base64,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",
  "pet-hal-bat": "data:image/webp;base64,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",
  "pet-hal-pumpkin": "data:image/webp;base64,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",
  "pet-hal-cat": "data:image/webp;base64,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",
  "pet-hal-skeleton": "data:image/webp;base64,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",
  "pet-hal-spider": "data:image/webp;base64,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"
};

  var BY_ID = {};
  PET_ITEMS.forEach(function (item) {
    BY_ID[item.id] = item;
  });

  var activePoseByPet = {};

  function byId(id) {
    if (!id || id === 'none' || id === 'pet-none') return null;
    return BY_ID[id] || null;
  }

  function getDataUri(id, pose) {
    if (!id || id === 'none' || id === 'pet-none') return '';
    var item = BY_ID[id];
    if (item && item.poses) {
      var p = pose || activePoseByPet[id] || 'idle';
      return item.poses[p] || item.poses.idle || item.imageSrc;
    }
    return PET_DATA_URIS[id] || (item ? item.imageSrc : '');
  }

  function setPose(id, pose) {
    var item = byId(id);
    if (!item || !item.poses) return 'idle';
    var next = item.poses[pose] ? pose : 'idle';
    activePoseByPet[id] = next;
    if (typeof document !== 'undefined') {
      var src = getDataUri(id, next);
      var imgs = document.querySelectorAll('[data-pet-img="' + id + '"]');
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].tagName === 'image') imgs[i].setAttribute('href', src);
        else imgs[i].src = src;
      }
    }
    return next;
  }

  function cyclePose(id) {
    var item = byId(id);
    if (!item || !item.poses) return 'idle';
    var order = ['idle', 'wave', 'jump'];
    var cur = activePoseByPet[id] || 'idle';
    var next = order[(order.indexOf(cur) + 1) % order.length];
    return setPose(id, next);
  }

  function install(store) {
    if (!store || !store.state || !store.state.monsterItems) return 0;
    var list = store.state.monsterItems;
    var existing = {};
    list.forEach(function (item, idx) {
      if (item && item.id) existing[item.id] = idx;
    });
    var added = 0;
    var updated = 0;
    PET_ITEMS.forEach(function (pet) {
      if (existing[pet.id] === undefined) {
        list.push(Object.assign({}, pet));
        added++;
      } else {
        var target = list[existing[pet.id]];
        if (target.price !== pet.price || target.rarity !== pet.rarity || target.imageSrc !== pet.imageSrc || target.name !== pet.name || target.description !== pet.description || !target.poses !== !pet.poses) {
          Object.assign(target, pet);
          updated++;
        }
      }
    });
    if ((added > 0 || updated > 0) && typeof store.saveState === 'function') {
      store.saveState();
    }
    return added;
  }

  /**
   * Renders the SVG layer for a pet standing at the bottom-right beside the monster's feet.
   * Coordinates fit inside viewBox="10 10 180 180" (and 0 0 200 200).
   */
  function renderSvg(petId, pose) {
    var pet = byId(petId);
    if (!pet) return '';
    var src = getDataUri(pet.id, pose);
    if (!src) return '';
    var isHero = !!pet.poses;
    var x = isHero ? 131 : 136;
    var y = isHero ? 110 : 118;
    var w = isHero ? 52 : 44;
    var h = isHero ? 60 : 52;
    return (
      '<g class="monster-pet-companion" data-pet-id="' + pet.id + '" onclick="if(window.MonsterPets&amp;&amp;window.MonsterPets.cyclePose)window.MonsterPets.cyclePose(\'' + pet.id + '\')" style="cursor:pointer;">' +
        '<ellipse cx="158" cy="169" rx="15" ry="4.5" fill="rgba(6, 9, 17, 0.42)" />' +
        '<ellipse cx="158" cy="169" rx="11" ry="2.6" fill="rgba(56, 189, 248, 0.22)" />' +
        '<g class="monster-pet-bob" style="animation: monsterFloat 2.6s ease-in-out infinite;">' +
          '<image data-pet-img="' + pet.id + '" href="' + src + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMax meet" />' +
        '</g>' +
      '</g>'
    );
  }

  /**
   * Renders an HTML overlay for MonsterDressUp (3D raster monster stage).
   */
  function renderHtml(petId, pose) {
    var pet = byId(petId);
    if (!pet) return '';
    var src = getDataUri(pet.id, pose) || pet.imageSrc;
    return (
      '<div class="mdu-pet-companion" data-pet-id="' + pet.id + '" onclick="if(window.MonsterPets&&window.MonsterPets.cyclePose)window.MonsterPets.cyclePose(\'' + pet.id + '\')" title="Tap to change pose!" style="position:absolute; right:4%; bottom:7%; width:29%; height:33%; pointer-events:auto; cursor:pointer; z-index:25; display:flex; align-items:flex-end; justify-content:center; filter:drop-shadow(0 5px 8px rgba(0,0,0,0.45)); animation:monsterFloat 2.6s ease-in-out infinite;">' +
        '<img data-pet-img="' + pet.id + '" src="' + src + '" alt="' + pet.name.replace(/"/g, '&quot;') + '" style="max-width:100%; max-height:100%; object-fit:contain; display:block;" />' +
      '</div>'
    );
  }

  /**
   * Renders a crisp thumbnail HTML for the Store, Monster Closet, and Monster Creator cards.
   */
  function thumbnailHtml(itemOrId, size) {
    var id = typeof itemOrId === 'string' ? itemOrId : (itemOrId && itemOrId.id);
    var pet = byId(id);
    if (!pet) return '';
    var src = getDataUri(pet.id, 'idle') || pet.imageSrc;
    var px = size || 68;
    var hoverAttr = '';
    if (pet.poses) {
      hoverAttr = ' onmouseenter="this.src=\'' + pet.poses.wave + '\'" onmouseleave="this.src=\'' + pet.poses.idle + '\'"';
    }
    return (
      '<div class="monster-pet-thumb" style="position:relative;width:' + px + 'px;height:' + px + 'px;display:flex;align-items:center;justify-content:center;margin:0 auto;">' +
        '<img data-pet-img="' + pet.id + '" src="' + src + '"' + hoverAttr + ' alt="' + pet.name.replace(/"/g, '&quot;') + '" style="max-width:95%;max-height:95%;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35));transition:transform .18s ease;" />' +
      '</div>'
    );
  }

  root.MonsterPets = {
    items: PET_ITEMS,
    byId: byId,
    getDataUri: getDataUri,
    setPose: setPose,
    cyclePose: cyclePose,
    install: install,
    renderSvg: renderSvg,
    renderHtml: renderHtml,
    thumbnailHtml: thumbnailHtml
  };
})(typeof window !== 'undefined' ? window : this);
