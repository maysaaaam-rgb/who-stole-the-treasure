/**
 * UNIT 3 HOMEWORK ASSIGNMENT DATA — "THE ARCTIC RESCUE"
 * Covers Grade 3 ("How Much Is It?") & Grade 4 ("It Keeps Changing" / "The Bear and I")
 * All visual cards use real extracted textbook JPEGs & 3D character sprites.
 */

window.UNIT3_HOMEWORK_DATA = {
  meta: {
    id: 'unit3-arctic-homework',
    title: 'Unit 3 Homework: The Arctic Rescue',
    subtitle: 'Interactive Story Adventure • The Bear and I & How Much Is It?',
    badgeTitle: '🏔️ Arctic Explorer',
    completionXP: 50,
    zoneXP: 20
  },

  perspectives: {
    explorer: {
      id: 'explorer',
      name: 'Play as the Explorer (The Man)',
      shortName: 'The Explorer',
      sprite: '../assets/unit3-arctic/c_man.png',
      cardImg: '../assets/unit3-arctic/arctic-house-young-man.jpg',
      tagline: 'Search through the snowstorm to find the Polar Bear and reach the Safe Place together!',
      introSpeech: 'I am from a land of wind and cold, with fields of ice and snow! Help me and your monster companion find the Polar Bear and reach the Safe Place!'
    },
    polarBear: {
      id: 'polarBear',
      name: 'Help the Polar Bear',
      shortName: 'The Polar Bear',
      sprite: '../assets/unit3-arctic/c_bear.png',
      cardImg: '../assets/unit3-arctic/fishing-hole-face-to-face.jpg',
      tagline: 'Guide the hungry Polar Bear across the sea ice to reunite with the Explorer at the Safe Place!',
      introSpeech: 'The snowstorm is fierce and the sea ice is changing! Help the giant Arctic Polar Bear find fish, follow the footprints, and reunite with the Explorer!'
    }
  },

  inventoryTools: [
    {
      id: 'tool-rope',
      zoneId: 'zone1',
      name: 'Thermal Rescue Rope',
      icon: '🪢',
      img: '../assets/unit3-arctic/ice-sea-trap-together.jpg',
      desc: 'Strong Arctic rope to pull friends out of thin ice traps.'
    },
    {
      id: 'tool-coin-compass',
      zoneId: 'zone1',
      name: 'Lydia Coin Compass',
      icon: '🪙',
      img: '../assets/unit3-money/hole-coin-and-lydia.jpg',
      desc: 'Ancient 600 BCE gold-and-silver coin that points toward the Safe Place.'
    },
    {
      id: 'tool-fish-bucket',
      zoneId: 'zone2',
      name: 'Bucket of Fresh Arctic Fish',
      icon: '🐟',
      img: '../assets/unit3-arctic/o_fish.png',
      desc: 'Restores the Polar Bear’s strength during the freezing storm.'
    },
    {
      id: 'tool-aurora-lantern',
      zoneId: 'zone2',
      name: 'Aurora Starlight Lantern',
      icon: '🏮',
      img: '../assets/unit3-money/paige-park-bench.jpg',
      desc: 'Lights up dark snow caves and reveals hidden spelling trails.'
    },
    {
      id: 'tool-ice-pick',
      zoneId: 'zone3',
      name: 'Glacier Ice Pick',
      icon: '⛏️',
      img: '../assets/unit3-arctic/thin-ice-crack-fall.jpg',
      desc: 'Clears frozen boulders along the high Mountain Obstacle Pass.'
    },
    {
      id: 'tool-treasure-key',
      zoneId: 'zone3',
      name: 'Treasure Gate Key',
      icon: '🗝️',
      img: '../assets/unit3-arctic/o_gate.png',
      desc: 'Unlocks the Safe Place & Treasure Gate at the end of the storm.'
    }
  ],

  zones: [
    {
      id: 'zone1',
      number: 1,
      title: 'Zone 1: Trail of Footprints & Buried Artifacts',
      shortTitle: 'Zone 1: Footprints & Artifacts',
      subtitle: 'Traits, Identification & Unit 3 Vocabulary in the Snow',
      icon: '🐾',
      bannerImg: '../assets/unit3-arctic/compare-bear-and-man.jpg',
      spriteImg: '../assets/unit3-arctic/c_man.png',
      accent: '#38bdf8',
      rewards: ['tool-rope', 'tool-coin-compass'],
      introText: 'Look closely at the footprints in the snow and the items buried in the ice! Identify whether each trait or item belongs to the Man, the Polar Bear, or Both — and uncover the buried Unit 3 historical artifacts!'
    },
    {
      id: 'zone2',
      number: 2,
      title: 'Zone 2: The Frozen Lagoon & Hungry Polar Bear',
      shortTitle: 'Zone 2: Frozen Lagoon',
      subtitle: 'Arctic Locations, Story Places & Phonics (-ar / -ng) Clues',
      icon: '🐟',
      bannerImg: '../assets/unit3-arctic/fishing-hole-face-to-face.jpg',
      spriteImg: '../assets/unit3-arctic/c_bear_hungry.png',
      accent: '#10b981',
      rewards: ['tool-fish-bucket', 'tool-aurora-lantern'],
      introText: 'The Polar Bear is weak and hungry from the storm! Use reading clues to search the right Arctic locations for fish, explore the places from "The $100 Bill", and solve the phonics stones!'
    },
    {
      id: 'zone3',
      number: 3,
      title: 'Zone 3: The Mountain Obstacle Pass',
      shortTitle: 'Zone 3: Obstacle Pass',
      subtitle: 'Useful vs. Useless Sorting & Poem / Story Decisions',
      icon: '⛰️',
      bannerImg: '../assets/unit3-arctic/ice-sea-trap-together.jpg',
      spriteImg: '../assets/unit3-arctic/o_trap.png',
      accent: '#f59e0b',
      rewards: ['tool-ice-pick', 'tool-treasure-key'],
      introText: 'The mountain pass to the Safe Place is blocked! First, sort Useful survival & money items from Useless distractions. Then make wise decisions in scenarios from "The Bear and I", "A New Friend", and "The $100 Bill"!'
    }
  ],

  /* ==========================================================================
     ZONE 1 CHALLENGES: TRAITS, FOOTPRINTS & BURIED UNIT 3 ARTIFACTS
     ========================================================================== */
  zone1Steps: [
    // --- PART A: MAN vs. POLAR BEAR vs. BOTH (Arctic Poem & Compare/Contrast p. 42-47) ---
    {
      id: 'z1-1',
      stageLabel: 'Part A • Arctic Footprints & Traits (1/10)',
      gradeTag: 'both',
      image: '../assets/unit3-arctic/bear-twice-my-size.jpg',
      clueTitle: 'Giant Snow Prints & White Fur',
      prompt: 'You find huge paw prints in the snow! The clue says: "It is twice my size, big and scary, and its fur is the color of the snow." Who does this belong to?',
      speakText: 'It is twice my size, big and scary, and its fur is the color of the snow. Who does this belong to?',
      options: [
        {
          id: 'bear',
          label: '🐻‍❄️ The Polar Bear',
          isCorrect: true,
          feedback: 'Great tracking! In stanza 3 of "The Bear and I", the polar bear was twice the man’s size and its fur was the color of the snow!'
        },
        {
          id: 'man',
          label: '🎣 The Explorer (The Man)',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Too Small for These Prints!',
          deadEndHint: 'Look at stanza 3: "The polar bear was twice my size, Its fur was the color of the snow." The Man wears a coat, not white fur!'
        },
        {
          id: 'both',
          label: '🤝 Both the Man and the Bear',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check the Compare Chart!',
          deadEndHint: 'On page 47, only ONE character "is big and scary" and "twice my size" with white fur!'
        }
      ]
    },
    {
      id: 'z1-2',
      stageLabel: 'Part A • Arctic Footprints & Traits (2/10)',
      gradeTag: 'both',
      image: '../assets/unit3-arctic/arctic-house-young-man.jpg',
      clueTitle: 'Boot Prints, Fishing Rod & Wooden House',
      prompt: 'Next to the trail, you spot boot prints leading from a wooden house, a red cap, a yellow coat, and a fishing rod with a bucket. Who do these belong to?',
      speakText: 'You spot boot prints leading from a wooden house, a yellow coat, and a fishing rod with a bucket. Who do these belong to?',
      options: [
        {
          id: 'man',
          label: '🎣 The Explorer (The Man)',
          isCorrect: true,
          feedback: 'Spot on! On page 47 ("Compare and Contrast"), the Man lives in a house in the snow and carries a fishing rod and bucket!'
        },
        {
          id: 'bear',
          label: '🐻‍❄️ The Polar Bear',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Polar Bears Don’t Live in Houses!',
          deadEndHint: 'Remember page 47: The Polar Bear lives out on the sea ice, while the Man lives in a wooden house and uses a fishing rod!'
        },
        {
          id: 'both',
          label: '🤝 Both the Man and the Bear',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Who Lives in a House!',
          deadEndHint: 'Only the Man lives in a house and wears boots and a yellow coat!'
        }
      ]
    },
    {
      id: 'z1-3',
      stageLabel: 'Part A • Arctic Footprints & Traits (3/10)',
      gradeTag: 'both',
      image: '../assets/unit3-arctic/compare-bear-and-man.jpg',
      clueTitle: 'Shared Survival Traits in the Arctic',
      prompt: 'Look at the Compare & Contrast clues on the ice wall: "Lives in the Arctic, eats fish, is hungry, and falls in the water." Who do ALL four of these traits describe?',
      speakText: 'Lives in the Arctic, eats fish, is hungry, and falls in the water. Who do all four of these traits describe?',
      options: [
        {
          id: 'both',
          label: '🤝 Both the Man and the Polar Bear',
          isCorrect: true,
          feedback: 'Awesome reading! "It was hungry, just like me... Crack! The bear and I fell in." Both live in the Arctic, eat fish, get hungry, and fall into the icy water!'
        },
        {
          id: 'man',
          label: '🎣 Only the Man',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Look at Both Sides of the Ice!',
          deadEndHint: 'In the poem, the bear eats the fish at the fishing hole too ("It was hungry, just like me"), and both fall through the thin ice!'
        },
        {
          id: 'bear',
          label: '🐻‍❄️ Only the Polar Bear',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: What About the Fisherman?',
          deadEndHint: 'The fisherman also lives in the Arctic, catches fish every morning, gets hungry, and falls into the sea ice with the bear!'
        }
      ]
    },
    {
      id: 'z1-4',
      stageLabel: 'Part A • Arctic Vocabulary in Context (4/10)',
      gradeTag: 'grade4',
      image: '../assets/unit3-arctic/thin-ice-crack-fall.jpg',
      clueTitle: 'Danger on the Changing Sea Ice',
      prompt: '"After many warm winters, the ice on the sea was ______. One morning, the bear was near me — Crack! The bear and I fell into a ______ of ice and sea." Which Unit 3 words complete the clue?',
      speakText: 'After many warm winters, the ice on the sea was blank. Crack! The bear and I fell into a blank of ice and sea.',
      options: [
        {
          id: 'thin-trap',
          label: '🧊 thin / trap (because the ice is melting)',
          isCorrect: true,
          feedback: 'Brilliant! Warm winters made the ice THIN and MELTING, turning the broken ice into a dangerous TRAP for both the Man and the Bear!'
        },
        {
          id: 'thick-house',
          label: '🏠 thick / house',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Why Did the Ice Crack?',
          deadEndHint: 'Warm winters don’t make ice thick! They make the ice THIN so it cracks and becomes a TRAP of ice and sea.'
        },
        {
          id: 'noisy-enemy',
          label: '📢 noisy / enemy',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Stanzas 5 and 6!',
          deadEndHint: 'Stanza 5 says: "After many warm winters, The ice on the sea was thin." Stanza 6 says: "In a trap of ice and sea."'
        }
      ]
    },

    // --- PART B: UNIT 3 "HOW MUCH IS IT?" HISTORICAL ARTIFACTS & STORY CLUES (pp. 40-55) ---
    {
      id: 'z1-5',
      stageLabel: 'Part B • Buried History of Money Artifacts (5/10)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/barter-goat-grain.jpg',
      clueTitle: '6000 BCE Ancient Trading Carving',
      prompt: 'Half-buried in the snow, you uncover an ancient stone tablet from 6000 BCE showing two farmers trading a goat for bowls of grain without using any money! What vocabulary word means "traded things without money"?',
      speakText: 'Two farmers traded a goat for bowls of grain without using any money. What word means traded things without money?',
      options: [
        {
          id: 'bartered',
          label: '🐐 bartered (Early people bartered food and animals)',
          isCorrect: true,
          feedback: 'Correct! Over 8,000 years ago (6000 BCE), there was no money yet — people BARTERED (traded) things they had for things they needed!'
        },
        {
          id: 'printed',
          label: '🖨️ printed paper bills',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: No Paper Money in 6000 BCE!',
          deadEndHint: 'Paper money wasn’t invented until 800–900 CE in China. When people traded a goat directly for grain, they BARTERED!'
        },
        {
          id: 'charged',
          label: '💳 swiped a plastic credit card',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Credit Cards Came in 1958 CE!',
          deadEndHint: 'Look at the goat and the grain bowls on page 41: early farmers BARTERED without money.'
        }
      ]
    },
    {
      id: 'z1-6',
      stageLabel: 'Part B • Buried History of Money Artifacts (6/10)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/cowrie-shells-cloth.jpg',
      clueTitle: '1200 BCE & 1000 BCE Ancient Chest',
      prompt: 'Inside an icy chest, you find two ancient artifacts: ocean shells from 1200 BCE and tiny bronze knives and spades from 1000 BCE China. What were these used for?',
      speakText: 'Inside an icy chest, you find cowrie shells from 1200 BCE and tiny metal knives and spades from 1000 BCE China. What were these used for?',
      options: [
        {
          id: 'early-money',
          label: '🐚 Early money! People used cowrie shells (1200 BCE) and Chinese metal tool money (1000 BCE) to buy things like cloth.',
          isCorrect: true,
          feedback: 'Exact match! Starting around 1200 BCE, people used small cowrie shells as money, and in 1000 BCE China made metal money shaped like little knives and spades!'
        },
        {
          id: 'cooking-tools',
          label: '🍴 Forks and knives for eating dinner at a restaurant',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Page 43 & Page 46!',
          deadEndHint: 'Remember the trick question on page 46! A dinner fork and knife was NOT money, but tiny bronze knives and spades in 1000 BCE China WERE metal money!'
        },
        {
          id: 'bear-claws',
          label: '🐻‍❄️ Polar bear claws used to dig snow caves',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Look Closer at the Shells!',
          deadEndHint: 'Those are ocean cowrie shells and ancient Chinese metal money from pages 42–43!'
        }
      ]
    },
    {
      id: 'z1-7',
      stageLabel: 'Part B • Buried History of Money Artifacts (7/10)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/hole-coin-and-lydia.jpg',
      clueTitle: 'Valuable Coins: 600 BCE Lydia & 400–300 BCE China',
      prompt: 'Your monster companion digs up two shining coins: a lion coin made of silver and gold from Lydia (modern-day Turkey, 600 BCE) and a round coin with a square hole in the center (400–300 BCE). Why were silver and gold used for coins?',
      speakText: 'Why were metals like silver and gold used to make the first true coins in Lydia in 600 BCE?',
      options: [
        {
          id: 'valuable',
          label: '🪙 Because silver and gold were VALUABLE (worth a lot) and easy to carry!',
          isCorrect: true,
          feedback: 'Yes! You unlocked the Lydia Coin Compass! In 600 BCE, Lydia made the first true coins out of silver and gold because those metals were VALUABLE!'
        },
        {
          id: 'plastic-light',
          label: '💳 Because they were made of cheap plastic',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Coins Are Metal, Not Plastic!',
          deadEndHint: 'Credit cards in 1958 were made of plastic. Ancient coins in Lydia (600 BCE) were made of VALUABLE metals like silver and gold!'
        },
        {
          id: 'melting-ice',
          label: '🧊 Because they melted in warm winters',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Metal Doesn’t Melt in the Snow!',
          deadEndHint: 'Look at page 43: people used silver and gold because they were VALUABLE (worth a lot of money).'
        }
      ]
    },
    {
      id: 'z1-8',
      stageLabel: 'Part B • Buried History of Money Artifacts (8/10)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/china-paper-money.jpg',
      clueTitle: '800–900 CE Paper Bills vs. 1958 CE Credit Card & Electronic Money',
      prompt: 'Three modern and medieval money clues are frozen in the ice wall! Which timeline order is 100% TRUE according to "The History of Money" (pp. 44–46)?',
      speakText: 'Which timeline order is one hundred percent true according to The History of Money?',
      options: [
        {
          id: 'correct-timeline',
          label: '📜 800–900 CE: First paper money (bills/notes) in China ➔ 1958 CE: First plastic credit card ➔ 21st Century: Electronic money on phones/internet',
          isCorrect: true,
          feedback: 'Timeline Master! Heavy metal coins led to light paper money in China (800–900 CE), then plastic credit cards (1958 CE), and today’s 21st-century electronic money!'
        },
        {
          id: 'wrong-timeline-1',
          label: '📱 800 CE: Smartphones ➔ 1958 CE: Cowrie shells ➔ 21st Century: Goat bartering',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Mixed-Up Timeline!',
          deadEndHint: 'Check page 46! 800–900 CE was paper money in China, 1958 CE was the first plastic credit card, and the 21st century is electronic money!'
        },
        {
          id: 'wrong-timeline-2',
          label: '🪙 6000 BCE: Credit cards ➔ 1200 BCE: Paper bills ➔ 1958 CE: Lydia coins',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check the Dates on Page 46!',
          deadEndHint: 'Paper bills started in 800–900 CE in China, and plastic credit cards started in 1958 CE!'
        }
      ]
    },
    {
      id: 'z1-9',
      stageLabel: 'Part B • Story Clues from "The $100 Bill" (9/10)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/paige-park-bench.jpg',
      clueTitle: 'Paige’s Coat & The Wet Green Note in the Leaves',
      prompt: 'In "The $100 Bill" (p. 49), Paige found a wet green $100 bill (note) in the autumn leaves. She wondered: "Who does this __________? Maybe I can __________ it." Then she put it in her coat __________. Which 3 words fit?',
      speakText: 'Paige wondered: Who does this blank? Maybe I can blank it. Then she put it in her coat blank.',
      options: [
        {
          id: 'belong-return-pocket',
          label: '🧥 belong to / return / pocket',
          isCorrect: true,
          feedback: 'Fantastic vocabulary! "Who does this BELONG TO? Maybe I can RETURN it," Paige thought, and put the $100 bill into her coat POCKET!'
        },
        {
          id: 'barter-melt-restaurant',
          label: '🍽️ barter / melt / restaurant',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Read Page 49 Again!',
          deadEndHint: 'When you find lost money, you ask who it BELONGS TO, try to RETURN it to the owner, and keep it safe in your POCKET!'
        },
        {
          id: 'plastic-metal-hole',
          label: '🪙 plastic / metal / hole',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Words in Context on Page 49!',
          deadEndHint: 'Look at the highlighted story words from "The $100 Bill": belong to, return, and pocket!'
        }
      ]
    },
    {
      id: 'z1-10',
      stageLabel: 'Part B • Story & Clean Energy Vocabulary (10/10)',
      gradeTag: 'both',
      image: '../assets/unit3-money/paige-dad-kitchen.jpg',
      clueTitle: 'Final Trail Clue: "Money Is Tight" & Expensive Energy',
      prompt: 'At the kitchen table (p. 53), Paige’s dad looks at bills with a calculator and says: "Sorry, Paige. ______________ right now, so we can’t go to a ______________ this week." What does "money is tight" mean?',
      speakText: 'Paige’s dad says: Sorry, Paige. Money is tight right now, so we cannot go to a restaurant this week. What does money is tight mean?',
      options: [
        {
          id: 'not-much-money',
          label: '💵 "Money is tight" / "restaurant" — It means the family does not have much extra money to spend right now.',
          isCorrect: true,
          feedback: 'Zone 1 Complete! You unlocked the Thermal Rescue Rope & Lydia Coin Compass! "Money is tight" means not having much extra money to spend.'
        },
        {
          id: 'small-pocket',
          label: '👖 It means the paper bill is tied up with a tight rope.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Idiom Alert!',
          deadEndHint: 'When Paige’s dad has many bills to pay and says "money is tight", it means they don’t have much extra money for things like a cell phone or a restaurant!'
        },
        {
          id: 'free-money',
          label: '🎉 It means everything in the store is free!',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Look at Dad’s Tired Face on Page 53!',
          deadEndHint: 'Dad looks tired and worried with his calculator because they do NOT have much extra money right now!'
        }
      ]
    }
  ],

  /* ==========================================================================
     ZONE 2 CHALLENGES: FROZEN LAGOON, HUNGRY POLAR BEAR, PLACES & PHONICS
     ========================================================================== */
  zone2Steps: [
    // --- PART A: FEEDING THE HUNGRY POLAR BEAR (Arctic Locations & Habitat Clues) ---
    {
      id: 'z2-1',
      stageLabel: 'Part A • Feed the Hungry Polar Bear (1/8)',
      gradeTag: 'both',
      bearHungerState: 25,
      image: '../assets/unit3-arctic/fishing-hole-face-to-face.jpg',
      clueTitle: 'Where Are the Fish Hiding in the Arctic?',
      prompt: 'The Polar Bear is weak and hungry from the snowstorm! Read the poem clue from Stanza 2: "My fishing hole was in the ice, Each morning, fish were there." Where should you and the Polar Bear look for fish first?',
      speakText: 'My fishing hole was in the ice, Each morning, fish were there. Where should you and the Polar Bear look for fish first?',
      options: [
        {
          id: 'breathing-hole',
          label: '🕳️ Under the breathing & fishing hole in the sea ice',
          isCorrect: true,
          feedback: 'Splash! You caught fresh Arctic fish from the fishing hole in the sea ice! The Polar Bear’s energy goes up to 50%!'
        },
        {
          id: 'dry-cliff',
          label: '🪨 On top of the high, dry rocky cliff in the wind',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: No Fish on the Dry Cliff!',
          deadEndHint: 'Fish swim in the water beneath the ice! Check the poem clue: "My fishing hole was in the ice, Each morning, fish were there."'
        },
        {
          id: 'empty-cave',
          label: '🏔️ Inside the dark, empty snow cave on the mountain',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: The Snow Cave Is Empty!',
          deadEndHint: 'There is no water inside the mountain snow cave. Try searching at the fishing hole in the sea ice!'
        }
      ]
    },
    {
      id: 'z2-2',
      stageLabel: 'Part A • Feed the Hungry Polar Bear (2/8)',
      gradeTag: 'both',
      bearHungerState: 50,
      image: '../assets/unit3-arctic/bear-enemy-sunset.jpg',
      clueTitle: 'Why Was the Bear Near the Fishing Hole?',
      prompt: 'The Polar Bear still needs more fish! Look at Stanza 4 of "The Bear and I": "It was often near my fishing hole, It was __________, just like me." Why did the Polar Bear keep coming back to the Man’s fishing hole?',
      speakText: 'It was often near my fishing hole, It was blank, just like me. Why did the Polar Bear keep coming back to the fishing hole?',
      options: [
        {
          id: 'hungry-like-me',
          label: '🐟 Because the Polar Bear was HUNGRY and needed fish from the sea ice to survive, just like the Man!',
          isCorrect: true,
          feedback: 'Yum! You shared the bucket of silver fish with the Polar Bear! His energy is now at 75%!'
        },
        {
          id: 'buy-phone',
          label: '📱 Because the Polar Bear wanted to buy a $95 black cell phone',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Silly Trail!',
          deadEndHint: 'Polar bears don’t use cell phones! Stanza 4 says: "It was often near my fishing hole, It was hungry, just like me."'
        },
        {
          id: 'drive-car',
          label: '🚗 Because the Polar Bear was looking for gasoline and oil',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Stanza 4!',
          deadEndHint: 'The Polar Bear came to the fishing hole because it was HUNGRY for fish!'
        }
      ]
    },
    {
      id: 'z2-3',
      stageLabel: 'Part A • Safe Ice vs. Melting Ice Path (3/8)',
      gradeTag: 'both',
      bearHungerState: 75,
      image: '../assets/unit3-arctic/old-man-melting-ice.jpg',
      clueTitle: 'Choose the Safe Lagoon Crossing',
      prompt: 'The Polar Bear is almost full! To cross the Frozen Lagoon safely, read Stanzas 5 & 8: "After many warm winters, the ice on the sea was thin... Today the ice is melting." Which lagoon path is SAFE for the heavy Polar Bear and the Explorer?',
      speakText: 'After many warm winters, the ice on the sea was thin. Today the ice is melting. Which lagoon path is safe for the heavy Polar Bear and the Explorer?',
      options: [
        {
          id: 'thick-glacier-ridge',
          label: '🏔️ The solid, thick snowbank ridge away from the thin, cracking sea-ice edge',
          isCorrect: true,
          feedback: 'Roaaar! The Polar Bear is 100% fed, warm, and safe on the solid ridge! You unlocked the Bucket of Fresh Arctic Fish!'
        },
        {
          id: 'thin-melting-edge',
          label: '💧 The thin, dark melting ice right over the deep sea trap',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Crack! Thin Ice Ahead!',
          deadEndHint: 'Careful! Remember Stanza 5: when the ice on the sea is THIN and MELTING, stepping on it makes you fall into a trap of ice and sea! Turn back and take the solid ridge!'
        },
        {
          id: 'open-ocean',
          label: '🌊 Jump straight into the freezing open water without a boat',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Too Cold to Swim!',
          deadEndHint: 'Stanza 6 says: "It was difficult to swim in a trap of ice and sea." Choose the thick, solid snowbank ridge instead!'
        }
      ]
    },

    // --- PART B: EXPLORING STORY PLACES ("The $100 Bill" & "Clean Cars") + PHONICS (-ar / -ng) ---
    {
      id: 'z2-4',
      stageLabel: 'Part B • Exploring Places & "-ar" Spelling (4/8)',
      gradeTag: 'grade3',
      bearHungerState: 100,
      image: '../assets/unit3-money/paige-schoolyard-steps.jpg',
      clueTitle: 'Place 1: After School on the Steps (p. 48 & p. 54 "-ar" Phonics)',
      prompt: 'At the first signpost, Nina asks Paige for her phone number after school. When Paige says she doesn’t have a cell phone, "Jodie laughed __________." Choose the correct "-ar" spelling word AND how Paige felt!',
      speakText: 'When Paige says she does not have a cell phone, Jodie laughed blank. Choose the correct A R spelling word and how Paige felt!',
      options: [
        {
          id: 'hard-sad',
          label: '🔤 "hard" (spelled H-A-R-D) — Paige felt sad and left out because she didn’t have a cell phone.',
          isCorrect: true,
          feedback: 'Spot on! "Jodie laughed HARD" uses the "-ar" phonics pattern (like bartered, card, park, hard, started), and Paige felt sad walking home!'
        },
        {
          id: 'herd-happy',
          label: '🔤 "herd" (spelled H-E-R-D) — Paige felt super happy and excited.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check the "-ar" Spelling Pattern!',
          deadEndHint: 'Look at page 48 and page 54: the word is spelled H-A-R-D (hard) with "-ar", and Paige crossed her arms looking sad!'
        },
        {
          id: 'hurd-angry',
          label: '🔤 "hurd" (spelled H-U-R-D) — Paige already had three cell phones.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Spelling & Story Check!',
          deadEndHint: 'All the phonics target words on page 54 use "-ar": bartered, card, park, hard, started!'
        }
      ]
    },
    {
      id: 'z2-5',
      stageLabel: 'Part B • Exploring Places & "-ar" Spelling (5/8)',
      gradeTag: 'grade3',
      bearHungerState: 100,
      image: '../assets/unit3-money/paige-park-bench.jpg',
      clueTitle: 'Place 2: The Autumn Leaves Trail (p. 49 & p. 54 "-ar" Phonics)',
      prompt: 'Which place did Paige walk through on her way home when she saw something green in the wet leaves — and which "-ar" words complete: "Paige walked through the __________ and __________ to pick up the $100 bill"?',
      speakText: 'Paige walked through the blank and blank to pick up the one hundred dollar bill. Which A R words fit?',
      options: [
        {
          id: 'park-started',
          label: '🍂 park / started — She walked through the PARK, sat on a bench, and found a $100 bill in the leaves!',
          isCorrect: true,
          feedback: 'Awesome! P-A-R-K (park) and S-T-A-R-T-E-D (started) both have the "-ar" sound! Paige found the $100 bill in the park when nobody was around.'
        },
        {
          id: 'pork-storted',
          label: '🥩 pork / storted — She found the money inside a grocery store.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Watch the Vowel + R!',
          deadEndHint: 'Remember the "-ar" sound on page 54: P-A-R-K (park) and S-T-A-R-T-E-D (started)!'
        },
        {
          id: 'perk-shirted',
          label: '👕 perk / shirted — She found a credit card on the school bus.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Where Were the Yellow Autumn Leaves?',
          deadEndHint: 'Paige walked through the PARK (P-A-R-K) and found a $100 paper bill in the leaves!'
        }
      ]
    },
    {
      id: 'z2-6',
      stageLabel: 'Part B • Exploring Places: The Cell Phone Store (6/8)',
      gradeTag: 'grade3',
      bearHungerState: 100,
      image: '../assets/unit3-money/paige-phone-store.jpg',
      clueTitle: 'Place 3: The Cell Phone Store Window (p. 52)',
      prompt: 'On Saturday, Paige went to the cell phone store. A shiny black phone cost $95, and she had the $100 bill in her pocket! What happened when the cashier asked, "Would you like to buy this phone?"',
      speakText: 'At the cell phone store, a shiny black phone cost ninety-five dollars. What happened when the cashier asked if Paige wanted to buy it?',
      options: [
        {
          id: 'changed-mind',
          label: '🏪 Paige thought about her dad and how money was tight at home, said "No, thank you," and left the store without buying the phone!',
          isCorrect: true,
          feedback: 'Great comprehension! Even though $100 was enough to buy the $95 phone, Paige remembered her dad and decided NOT to spend the money on herself!'
        },
        {
          id: 'bought-phone',
          label: '📱 Paige bought the $95 phone and spent the remaining $5 on candy.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Did Paige Buy the Phone?',
          deadEndHint: 'Look at page 52! Paige held the black phone, but then she thought about her dad at home and walked out of the store WITH the $100 bill still in her pocket!'
        },
        {
          id: 'used-card',
          label: '💳 Paige paid for the phone using a 1958 plastic credit card.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Page 52!',
          deadEndHint: 'Paige didn’t buy the phone at all — she saved the $100 bill to help her dad!'
        }
      ]
    },
    {
      id: 'z2-7',
      stageLabel: 'Part B • Phonics "-ng" Ice Stones (7/8)',
      gradeTag: 'grade4',
      bearHungerState: 100,
      image: '../assets/unit3-arctic/phonics-ng-spring.jpg',
      clueTitle: 'Phonics "-ng" Bridge Stones (Grade 4 p. 46)',
      prompt: 'To light the Aurora Lantern, step on the ice stone where ALL FIVE words end with the "-ng" sound from page 46 ("In the spring, I like to sing a long song while reading with a bang!"):',
      speakText: 'Step on the ice stone where all five words end with the N G sound from page 46: sing, long, reading, bang, spring!',
      options: [
        {
          id: 'ng-correct',
          label: '🔔 sing • long • reading • bang • spring (All have the "-ng" sound!)',
          isCorrect: true,
          feedback: 'Ring-a-ding! You mastered the "-ng" phonics pattern (sing, long, reading, bang, spring) and "-ar" pattern (bartered, card, park, hard, started)!'
        },
        {
          id: 'ng-wrong-1',
          label: '❌ sin • lon • readin • ban • sprin (Missing the "g"!)',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Don’t Drop the "G"!',
          deadEndHint: 'On page 46, the target phonics ending is "-ng" (S-I-N-G, L-O-N-G, R-E-A-D-I-N-G, B-A-N-G, S-P-R-I-N-G)!'
        },
        {
          id: 'ng-wrong-2',
          label: '❌ sink • lock •etik • back •ick (Ends with "-k" instead of "-ng")',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Listen for the "-ng" Ring!',
          deadEndHint: 'Choose the stone with sing, long, reading, bang, and spring!'
        }
      ]
    },
    {
      id: 'z2-8',
      stageLabel: 'Part B • Clean Cars Energy Locations (8/8)',
      gradeTag: 'grade4',
      bearHungerState: 100,
      image: '../assets/unit3-arctic/solar-car-sun.jpg',
      clueTitle: 'Clean Energy Vehicles on the Ice Highway (pp. 48–54)',
      prompt: 'Why is the Arctic sea ice melting in "The Bear and I", and which clean car from pages 51–53 uses energy from the SUN without making the air dirty or noisy?',
      speakText: 'Why is the Arctic sea ice melting, and which clean car uses energy from the sun without making the air dirty or noisy?',
      options: [
        {
          id: 'solar-clean',
          label: '☀️ Gasoline cars burn oil that makes the air dirty and changes our climate — a SOLAR CAR uses energy from the sun and is fast, clean, and quiet!',
          isCorrect: true,
          feedback: 'Zone 2 Complete! You unlocked the Bucket of Fresh Arctic Fish & the Aurora Starlight Lantern! Clean cars (electric, air, and solar) help protect our climate and the Polar Bear’s Arctic home!'
        },
        {
          id: 'gasoline-clean',
          label: '⛽ Gasoline cars use energy from the sun and keep the Arctic air clean and quiet.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Page 49!',
          deadEndHint: 'Page 49 says gasoline comes from OIL in the ground. Gasoline cars are fast, but they are NOISY and make the air DIRTY, which changes our climate!'
        },
        {
          id: 'biofuel-sun',
          label: '🌽 Biofuel cars run on sunlight and never need plants or water.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Check Page 50 & Page 53!',
          deadEndHint: 'Biofuels come from plants like corn (which need big fields and water) and are still noisy. SOLAR cars (p. 53) use energy from the sun!'
        }
      ]
    }
  ],

  /* ==========================================================================
     ZONE 3 CHALLENGES: OBSTACLE PASS — PART A (SORTING) & PART B (SITUATIONS)
     ========================================================================== */
  zone3SortingItems: [
    {
      id: 'sort-1',
      name: 'Thermal Rescue Rope & Warm Fur Parka',
      icon: '🪢',
      img: '../assets/unit3-arctic/arctic-house-young-man.jpg',
      category: 'useful',
      gradeTag: 'both',
      reason: 'Essential survival gear! Keeps the Explorer warm in the Arctic wind and pulls friends out of thin ice traps.'
    },
    {
      id: 'sort-2',
      name: 'Fresh Fish & Clean Drinking Water',
      icon: '🐟',
      img: '../assets/unit3-arctic/fishing-hole-face-to-face.jpg',
      category: 'useful',
      gradeTag: 'both',
      reason: 'Gives energy to both the hungry Polar Bear and the Explorer during the snowstorm!'
    },
    {
      id: 'sort-3',
      name: 'Dinner Fork & Knife / Empty Leather Wallet (p. 46 "Was It Money?")',
      icon: '🍴',
      img: '../assets/unit3-money/chinese-knife-spade.jpg',
      category: 'useless',
      gradeTag: 'grade3',
      reason: 'Page 46 trick items! A regular fork & knife and an empty wallet were NOT forms of historical money and won’t help in a snowstorm!'
    },
    {
      id: 'sort-4',
      name: 'Dirty Black Exhaust Smoke from Old Gasoline Trucks (p. 49)',
      icon: '💨',
      img: '../assets/unit3-arctic/gasoline-oil-car.jpg',
      category: 'useless',
      gradeTag: 'grade4',
      reason: 'Harmful! Dirty air from burning oil/gasoline hurts animals, plants, and people, and warms the climate so Arctic ice melts!'
    },
    {
      id: 'sort-5',
      name: 'Cowrie Shells, Lydia Coins, Paper Bills & Credit Card (p. 46 Real Money)',
      icon: '🪙',
      img: '../assets/unit3-money/hole-coin-and-lydia.jpg',
      category: 'useful',
      gradeTag: 'grade3',
      reason: 'All four were real forms of money across history (1200 BCE shells, 600 BCE coins, 800 CE paper notes, 1958 credit card)!'
    },
    {
      id: 'sort-6',
      name: 'Solar Panel Charger & Clean Electric Lantern (pp. 51–53)',
      icon: '☀️',
      img: '../assets/unit3-arctic/electric-car-plug.jpg',
      category: 'useful',
      gradeTag: 'grade4',
      reason: 'Clean energy! Electricity and solar power work without making the air dirty or noisy.'
    },
    {
      id: 'sort-7',
      name: 'Stepping on Thin Cracking Sea Ice Alone in Warm Winter',
      icon: '🧊',
      img: '../assets/unit3-arctic/thin-ice-crack-fall.jpg',
      category: 'useless',
      gradeTag: 'both',
      reason: 'Dangerous! Thin melting ice cracks and drops you into an icy sea trap!'
    },
    {
      id: 'sort-8',
      name: 'Helping Family When "Money Is Tight" Instead of Buying Toys Impulsively',
      icon: '💝',
      img: '../assets/unit3-money/paige-dad-kitchen.jpg',
      category: 'useful',
      gradeTag: 'grade3',
      reason: 'Wise & caring choice! Just like Paige giving the $100 bill to her tired dad so the family could pay bills and eat together.'
    }
  ],

  zone3Situations: [
    {
      id: 'sit-1',
      stageLabel: 'Part B • Poem Situation 1/6 ("The Bear and I", Stanzas 5–6)',
      gradeTag: 'both',
      image: '../assets/unit3-arctic/ice-sea-trap-together.jpg',
      title: 'CRACK! The Thin Ice Trap!',
      storyText: 'After many warm winters, the sea ice is thin. Suddenly — CRACK! Both the Explorer and the Polar Bear fall into a freezing trap of ice and sea! For many years, the Man thought: "The bear was my enemy." How should they act now?',
      speakText: 'Suddenly, Crack! Both the Explorer and the Polar Bear fall into a freezing trap of ice and sea! How should they act now?',
      options: [
        {
          id: 'work-together',
          label: '🤝 Realize "We were in the trap together, the bear was not my enemy!" — Use the Thermal Rope and help each other climb onto thick ice!',
          isCorrect: true,
          feedback: 'Heartwarming choice! In Stanza 6, the Man realized: "But we were in the trap together, The bear was not my enemy." Both face the same danger in a changing world!'
        },
        {
          id: 'fight-in-water',
          label: '⚔️ Fight the Polar Bear in the freezing water because he is your enemy.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Fighting in Freezing Water Is Dangerous!',
          deadEndHint: 'Read Stanza 6: "It was difficult to swim in a trap of ice and sea. But we were in the trap together, The bear was not my enemy."'
        },
        {
          id: 'give-up-swim',
          label: '😴 Stay in the icy water and wait until summer.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: The Water Is Freezing!',
          deadEndHint: 'Use your teamwork and survival tools so both the Man and the Bear can climb out together!'
        }
      ]
    },
    {
      id: 'sit-2',
      stageLabel: 'Part B • Story Situation 2/6 ("A New Friend", Grade 3 p. 47)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/baby-bird-vet.jpg',
      title: 'The Hurt Baby Bird on the Trail',
      storyText: 'Along the mountain pass, you meet Go Ne and Wen Shu from "A New Friend" (p. 47). They just found a tiny baby bird on the ground that fell from its nest and hurt its wing! What is the best solution to this problem?',
      speakText: 'Go Ne and Wen Shu found a tiny baby bird on the ground that hurt its wing. What is the best solution to this problem?',
      options: [
        {
          id: 'take-to-vet',
          label: '🐦 Gently pick up the baby bird, take it to the vet for help, and care for it until it is strong enough to fly again!',
          isCorrect: true,
          feedback: 'Wonderful kindness! In "A New Friend" (p. 47), the problem is the hurt baby bird, and the solution is taking it to the vet and helping it heal!'
        },
        {
          id: 'leave-bird',
          label: '🚶 Leave the hurt baby bird alone in the cold snow and walk away.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: The Baby Bird Needs Help!',
          deadEndHint: 'Look at the picture on page 47: Go Ne and Wen Shu took the hurt baby bird to the animal doctor (vet)!'
        },
        {
          id: 'barter-bird',
          label: '🐐 Try to barter the hurt bird for a bowl of grain.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: That’s Not How You Help a Friend!',
          deadEndHint: 'In "A New Friend" on page 47, they solve the problem by taking the hurt bird to the vet!'
        }
      ]
    },
    {
      id: 'sit-3',
      stageLabel: 'Part B • Story Situation 3/6 ("The $100 Bill", Grade 3 pp. 48–53)',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/paige-dad-kitchen.jpg',
      title: 'Paige’s Big Decision with the $100 Bill',
      storyText: 'Paige wants a $95 black cell phone so Nina and Jodie won’t laugh at her. She looked for the owner of the $100 bill she found in the park, but no one claimed it. When she gets home, she sees her tired dad with a stack of bills because "money is tight." What should Paige do?',
      speakText: 'Paige wants a ninety-five dollar cell phone, but she sees her tired dad in the kitchen where money is tight. What should Paige do?',
      options: [
        {
          id: 'give-to-dad',
          label: '💵 Give the $100 bill to her dad to help the family! (Her dad hugs her, and they celebrate with a nice dinner at a restaurant together!)',
          isCorrect: true,
          feedback: 'Best decision! Paige gave the $100 bill to her dad because helping her family when money was tight mattered much more than buying a cell phone!'
        },
        {
          id: 'hide-in-pocket',
          label: '📱 Keep the $100 bill secret in her pocket and buy the $95 phone anyway.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Think About Paige’s Dad!',
          deadEndHint: 'On page 52–53, Paige realized her dad was working hard and money was tight, so she chose to give the $100 bill to him!'
        },
        {
          id: 'throw-in-leaves',
          label: '🍂 Throw the $100 bill back into the wet autumn leaves.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: That Wastes the Money!',
          deadEndHint: 'After checking that no one was looking for the lost bill, Paige used it to help her dad at home!'
        }
      ]
    },
    {
      id: 'sit-4',
      stageLabel: 'Part B • Real-Life Money Dilemmas 4/6 (Grade 3 p. 55 "Think Together")',
      gradeTag: 'grade3',
      image: '../assets/unit3-money/money-dilemmas-table.jpg',
      title: 'Four Real-Life Problems & Solutions (Page 55)',
      storyText: 'The Gate Guardian asks you to solve the 4 real-life problems from page 55 ("Think Together"): (1) You find $50; (2) A friend gives you a book present you already have; (3) Mom gives you video game money and says to share it with your sister; (4) You want a new toy, but don’t have enough money.',
      speakText: 'Choose the responsible solution set for the four real-life money problems on page 55!',
      options: [
        {
          id: 'wise-solutions',
          label: '🌟 (1) Look for who it belongs to / tell a parent; (2) Say thank you & exchange or share it kindly; (3) Share the money fairly with your sister; (4) Save money or do chores until you have enough!',
          isCorrect: true,
          feedback: 'Incredible problem-solving! Using "I should...", you solved every single dilemma from page 55 with honesty, kindness, and smart saving!'
        },
        {
          id: 'selfish-solutions',
          label: '🙈 Keep the $50 secretly, complain to your friend about the book, keep all of Mom’s money for yourself, and cry at the toy store.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Try a Kinder, More Responsible Solution!',
          deadEndHint: 'Remember page 55: "What should you do? I should..." Always try to return lost money, share fairly with family, and save up for things you want!'
        },
        {
          id: 'ignore-all',
          label: '❄️ Bury the book and the money in a snowbank.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Silly Choice!',
          deadEndHint: 'Pick the thoughtful solutions that help your friends and family!'
        }
      ]
    },
    {
      id: 'sit-5',
      stageLabel: 'Part B • Clean Cars Comparison 5/6 (Grade 4 pp. 47–54)',
      gradeTag: 'grade4',
      image: '../assets/unit3-arctic/compare-two-cars.jpg',
      title: 'Choosing the Right Transport for the Changing World',
      storyText: 'Look at the car comparison table from pages 47 and 54: Gasoline cars are fast, but noisy and dirty. Biofuel cars use corn plants and are fast, but noisy and a little dirty. Electric and Solar cars are fast, quiet, and clean (though expensive). Air cars are clean, quiet, and not very expensive (though small and slow). Which statement is the MAIN IDEA of "Clean Cars" (p. 54)?',
      speakText: 'Which statement is the main idea of the article Clean Cars on page 54?',
      options: [
        {
          id: 'clean-cars-good',
          label: '🌍 "Clean cars are good for the world." — Using clean energy (electricity, air, solar) helps keep the air clean and protects our climate!',
          isCorrect: true,
          feedback: 'Spot on! On page 54 Part C, the main idea of the article is item #2: "Clean cars are good for the world!"'
        },
        {
          id: 'only-noisy',
          label: '📢 "Dirty air is good for plants, animals, and polar bears."',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Dirty Air Hurts the Planet!',
          deadEndHint: 'Page 49 says: "Dirty air is bad for animals, plants, and people. It changes our climate, too."Page 53 concludes: "Clean cars are one way to have a clean world."'
        },
        {
          id: 'no-cars-exist',
          label: '🚫 "Electric cars were invented yesterday and cannot go fast."',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: Fun Fact Check on Page 51!',
          deadEndHint: 'Page 51 says: "Electric cars aren’t new. The first car to go 100 km. per hour was an electric car in 1899!"'
        }
      ]
    },
    {
      id: 'sit-6',
      stageLabel: 'Part B • Final Gate Challenge 6/6 ("Think Together", p. 55)',
      gradeTag: 'both',
      image: '../assets/unit3-arctic/old-man-melting-ice.jpg',
      title: 'How Can We Make Good Changes in Our World?',
      storyText: 'You have reached the top of the Mountain Pass! In Stanza 8, the old Explorer looks at the melting ice and says: "But I hope to see the bear once more, Living in the cold." According to page 55 ("Think Together"), what good changes can WE make to protect animals, people, and the Arctic?',
      speakText: 'What good changes can we make to keep our world clean and protect the Polar Bear and the Explorer?',
      options: [
        {
          id: 'good-changes',
          label: '🚲 Clean up trash so it isn’t a danger for animals, ride a bike or walk to school so we don’t make the air dirty, save energy, and help others when money or times are tight!',
          isCorrect: true,
          feedback: 'ZONE 3 COMPLETE! You unlocked the Glacier Ice Pick & the Golden Treasure Gate Key! Both the Explorer and the Polar Bear can now enter the Safe Place!'
        },
        {
          id: 'bad-changes',
          label: '🗑️ Throw plastic trash on the ice and burn more oil to melt the snow faster.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: That Hurts the Polar Bear’s Home!',
          deadEndHint: 'Look at the speech bubbles on page 55: "I can clean up trash because trash is a danger for animals" and "I can ride a bike to school because bikes don’t make the air dirty."'
        },
        {
          id: 'do-nothing',
          label: '🤷 Do nothing and leave the Explorer and the Polar Bear separated in the storm.',
          isCorrect: false,
          deadEndTitle: 'Snowy Dead End: You Are So Close to the Safe Place!',
          deadEndHint: 'Choose the positive actions from page 55 to calm the storm and open the Treasure Gate!'
        }
      ]
    }
  ]
};
