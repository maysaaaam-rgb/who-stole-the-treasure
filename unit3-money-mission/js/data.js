/**
 * UNIT 3 ("HOW MUCH IS IT?") SMARTBOARD REVISION MISSION — DATA BANK
 * Combines Among Us Story Mission Flow (Tasks 1–3) + 2-Player Monster Bridge Tug-of-War Finale
 * All visual cards use real extracted textbook illustrations from ../assets/unit3-money/*.jpg
 */

(function(root) {
  'use strict';

  const IMG_BASE = '../assets/unit3-money/';

  const UNIT3_MISSION_DATA = {
    unitTitle: 'Unit 3: How Much Is It?',
    bigQuestion: 'Why do we need money?',
    crewmates: [
      '../assets/monsters/pets/pet-crew-red-captain.png',
      '../assets/monsters/pets/pet-crew-cyan.png',
      '../assets/monsters/pets/pet-crew-lime.png',
      '../assets/monsters/pets/pet-crew-orange.png',
      '../assets/monsters/pets/pet-crew-purple-police.png',
      '../assets/monsters/pets/pet-crew-yellow-chef.png',
      '../assets/monsters/pets/pet-crew-blue-doctor.png',
      '../assets/monsters/pets/pet-crew-white-suit.png'
    ],

    // =========================================================================
    // TASK 1: ELECTRICAL WIRES (0% -> 33% Crew Bar) — 3 Rounds of 4 Wires
    // =========================================================================
    task1Wires: [
      {
        roundId: 'A',
        title: 'Round A: Core Vocabulary Match',
        subtitle: 'Tap a colored wire terminal on the left, then tap the matching picture card on the right!',
        wires: [
          {
            id: 'w-a1',
            color: '#ef4444',
            colorName: 'RED',
            term: 'bartered',
            pronounce: 'bartered. Trading a goat for grain without using money.',
            meaning: 'Trading a goat for grain without using money',
            img: IMG_BASE + 'barter-goat-grain.jpg',
            caption: '6000 BCE · Goat ↔ Bowls of Grain'
          },
          {
            id: 'w-a2',
            color: '#38bdf8',
            colorName: 'CYAN',
            term: 'valuable',
            pronounce: 'valuable. Worth a lot, like silver and gold.',
            meaning: 'Worth a lot, like silver and gold',
            img: IMG_BASE + 'hole-coin-and-lydia.jpg',
            caption: 'Precious Silver & Gold Coins'
          },
          {
            id: 'w-a3',
            color: '#f59e0b',
            colorName: 'AMBER',
            term: 'pocket',
            pronounce: 'pocket. A small pouch in Paige\'s coat to hold the one hundred dollar bill.',
            meaning: "A small pouch in Paige's coat to hold the $100 bill",
            img: IMG_BASE + 'paige-park-bench.jpg',
            caption: 'Paige in the Autumn Park'
          },
          {
            id: 'w-a4',
            color: '#10b981',
            colorName: 'EMERALD',
            term: 'money is tight',
            pronounce: 'money is tight. Not having much extra money to spend.',
            meaning: 'Not having much extra money to spend',
            img: IMG_BASE + 'paige-dad-kitchen.jpg',
            caption: "Paige's Tired Dad & Kitchen Bills"
          }
        ]
      },
      {
        roundId: 'B',
        title: 'Round B: History of Money Timeline',
        subtitle: 'Connect each historical date wire to what people used as money!',
        wires: [
          {
            id: 'w-b1',
            color: '#ef4444',
            colorName: 'RED',
            term: '1200 BCE',
            pronounce: 'Twelve hundred B C E. People started using cowrie shells.',
            meaning: 'People started using cowrie shells',
            img: IMG_BASE + 'cowrie-shells-cloth.jpg',
            caption: '1200 BCE · Cowrie Shells for Cloth'
          },
          {
            id: 'w-b2',
            color: '#38bdf8',
            colorName: 'CYAN',
            term: '1000 BCE',
            pronounce: 'One thousand B C E. Chinese metal knives and spades.',
            meaning: 'Chinese metal knives and spades',
            img: IMG_BASE + 'chinese-knife-spade.jpg',
            caption: '1000 BCE · Metal Knives & Spades'
          },
          {
            id: 'w-b3',
            color: '#f59e0b',
            colorName: 'AMBER',
            term: '600 BCE',
            pronounce: 'Six hundred B C E. First true coins in Lydia, modern-day Turkey.',
            meaning: 'First true coins in Lydia, modern-day Turkey',
            img: IMG_BASE + 'hole-coin-and-lydia.jpg',
            caption: '600 BCE · Lydian Lion Coin'
          },
          {
            id: 'w-b4',
            color: '#10b981',
            colorName: 'EMERALD',
            term: '800–900 CE',
            pronounce: 'Eight hundred to nine hundred C E. First paper money in China.',
            meaning: 'First paper money in China',
            img: IMG_BASE + 'china-paper-money.jpg',
            caption: '800–900 CE · First Paper Money'
          }
        ]
      },
      {
        roundId: 'C',
        title: 'Round C: Modern Money & Story Vocabulary',
        subtitle: 'Finish wiring the ship by matching modern payments and Paige\'s story!',
        wires: [
          {
            id: 'w-c1',
            color: '#ef4444',
            colorName: 'RED',
            term: '1958 CE',
            pronounce: 'Nineteen fifty-eight C E. First plastic credit card.',
            meaning: 'First plastic credit card',
            img: IMG_BASE + 'credit-card-pay.jpg',
            caption: '1958 CE · Plastic Credit Card'
          },
          {
            id: 'w-c2',
            color: '#38bdf8',
            colorName: 'CYAN',
            term: '21st Century',
            pronounce: 'Twenty-first century. Electronic money used on the internet.',
            meaning: 'Electronic money used on the internet',
            img: IMG_BASE + 'electronic-phone-pay.jpg',
            caption: 'Today · Electronic Phone Pay'
          },
          {
            id: 'w-c3',
            color: '#f59e0b',
            colorName: 'AMBER',
            term: 'belong to / return',
            pronounce: 'belong to, and return. Find the owner and give the money back.',
            meaning: 'Find the owner and give the money back',
            img: IMG_BASE + 'paige-park-bench.jpg',
            caption: 'Who does the $100 bill belong to?'
          },
          {
            id: 'w-c4',
            color: '#10b981',
            colorName: 'EMERALD',
            term: 'restaurant',
            pronounce: 'restaurant. Where Paige and her dad went for dinner.',
            meaning: 'Where Paige and her dad went for dinner',
            img: IMG_BASE + 'paige-dad-kitchen.jpg',
            caption: '"Let\'s go out to a restaurant!"'
          }
        ]
      }
    ],

    // =========================================================================
    // TASK 2: CLEAR ASTEROIDS (33% -> 66% Crew Bar) — 7 Spelling Rounds (-ar & Core Words)
    // =========================================================================
    task2Asteroids: [
      {
        id: 'ast-1',
        sentence: 'Thousands of years ago, people ___ for things they wanted.',
        fullSentence: 'Thousands of years ago, people bartered for things they wanted.',
        answer: 'bartered',
        options: ['bartered', 'burtered', 'bertered', 'bartard'],
        hint: 'Listen for the /ar/ sound in b-ar-tered!',
        img: IMG_BASE + 'barter-goat-grain.jpg',
        caption: 'Bartering a Goat for Grain (p. 42)'
      },
      {
        id: 'ast-2',
        sentence: 'In 1958, people used a small plastic credit ___.',
        fullSentence: 'In 1958, people used a small plastic credit card.',
        answer: 'card',
        options: ['card', 'curd', 'cord', 'kerd'],
        hint: 'Spell the /ar/ sound with A-R: c-a-r-d!',
        img: IMG_BASE + 'credit-card-pay.jpg',
        caption: 'First Plastic Credit Card (p. 45)'
      },
      {
        id: 'ast-3',
        sentence: 'Paige walked through the ___ on her way home.',
        fullSentence: 'Paige walked through the park on her way home.',
        answer: 'park',
        options: ['park', 'pork', 'perk', 'pak'],
        hint: 'P-A-R-K has the /ar/ sound!',
        img: IMG_BASE + 'paige-park-bench.jpg',
        caption: 'Walking Through the Autumn Park (p. 49)'
      },
      {
        id: 'ast-4',
        sentence: 'Jodie and Nina laughed ___ because Paige had no phone.',
        fullSentence: 'Jodie and Nina laughed hard because Paige had no phone.',
        answer: 'hard',
        options: ['hard', 'herd', 'hurd', 'harb'],
        hint: 'Starts with H, ends with D, with A-R in the middle: h-a-r-d!',
        img: IMG_BASE + 'paige-phone-store.jpg',
        caption: 'The $95 Cell Phone Window (p. 52)'
      },
      {
        id: 'ast-5',
        sentence: 'In 1200 BCE, people ___ using cowrie shells.',
        fullSentence: 'In 1200 BCE, people started using cowrie shells.',
        answer: 'started',
        options: ['started', 'storted', 'stirted', 'startid'],
        hint: 'st-ar-t + ed = started!',
        img: IMG_BASE + 'cowrie-shells-cloth.jpg',
        caption: 'Cowrie Shells for Cloth (p. 42)'
      },
      {
        id: 'ast-6',
        sentence: 'Coins were made from ___ metals like silver and gold.',
        fullSentence: 'Coins were made from valuable metals like silver and gold.',
        answer: 'valuable',
        options: ['valuable', 'valuble', 'era-ble', 'valubal'],
        hint: 'Remember the U-A in val-u-a-ble!',
        img: IMG_BASE + 'hole-coin-and-lydia.jpg',
        caption: 'Valuable Coins from Lydia & China (p. 43)'
      },
      {
        id: 'ast-7',
        sentence: "Paige said, 'Dad, let's go out to a ___!'",
        fullSentence: "Paige said, 'Dad, let's go out to a restaurant!'",
        answer: 'restaurant',
        options: ['restaurant', 'restorant', 'resturant', 'restarant'],
        hint: 'Spell it r-e-s-t-a-u-r-a-n-t!',
        img: IMG_BASE + 'paige-dad-kitchen.jpg',
        caption: "Paige's Surprise Dinner Idea (p. 53)"
      }
    ],

    // =========================================================================
    // TASK 3: REACTOR SEQUENCE (66% -> 100% Crew Bar) — 6 Sentence Scrambles
    // =========================================================================
    task3Reactor: [
      {
        id: 'react-1',
        tag: 'Problem & Solution · p. 42',
        clue: 'How did farmers buy a goat around 6000 BCE?',
        tokens: ['People', 'paid', 'for', 'a', 'goat', 'with', 'grain.'],
        img: IMG_BASE + 'barter-goat-grain.jpg',
        caption: '6000 BCE · Bartering Grain for a Goat'
      },
      {
        id: 'react-2',
        tag: 'Early Money Solution · p. 42',
        clue: 'Why did people switch from heavy grain to cowrie shells?',
        tokens: ['Cowrie', 'shells', 'were', 'easier', 'to', 'carry.'],
        img: IMG_BASE + 'cowrie-shells-cloth.jpg',
        caption: '1200 BCE · Cowrie Shells Were Easier to Carry'
      },
      {
        id: 'react-3',
        tag: 'A New Friend · p. 47',
        clue: 'What solution did Go Ne and Wen Shu find when the baby bird was hurt?',
        tokens: ['Go Ne', 'and', 'Wen Shu', 'took', 'the', 'bird', 'to', 'the', 'vet.'],
        img: IMG_BASE + 'baby-bird-vet.jpg',
        caption: 'A New Friend · Taking the Baby Bird to the Vet'
      },
      {
        id: 'react-4',
        tag: 'The $100 Bill · p. 49',
        clue: 'What did Paige find on her way home through the park?',
        tokens: ['Paige', 'found', 'a', 'hundred', 'dollars', 'in', 'the', 'leaves.'],
        img: IMG_BASE + 'paige-park-bench.jpg',
        caption: 'Paige Finds $100 in the Wet Leaves'
      },
      {
        id: 'react-5',
        tag: 'The $100 Bill · p. 51',
        clue: 'Where did Paige put the $100 bill after looking around?',
        tokens: ['She', 'quickly', 'put', 'the', 'money', 'in', 'her', 'pocket.'],
        img: IMG_BASE + 'paige-park-bench.jpg',
        caption: 'Putting the $100 Bill Safely in Her Pocket'
      },
      {
        id: 'react-6',
        tag: 'Making a Good Choice · p. 52',
        clue: 'What did Paige decide inside the cell phone store?',
        tokens: ['Paige', 'did', 'not', 'buy', 'the', 'ninety-five', 'dollar', 'phone.'],
        img: IMG_BASE + 'paige-phone-store.jpg',
        caption: '"I should save the money," Paige thought.'
      }
    ],

    // =========================================================================
    // STEP 3: BOSS FINALE — 2-PLAYER MONSTER BRIDGE TUG-OF-WAR (15-Question Bank)
    // =========================================================================
    tugOfWarQuestions: [
      {
        id: 'tow-1',
        q: 'What did people use around 6000 BCE to buy a goat?',
        answer: 'Grain',
        options: ['Grain', 'Plastic cards', 'Paper bills', 'Smartphones'],
        img: IMG_BASE + 'barter-goat-grain.jpg',
        caption: '6000 BCE Barter'
      },
      {
        id: 'tow-2',
        q: 'Which date is OLDER: 6000 BCE or 1200 BCE?',
        answer: '6000 BCE, because BCE counts backwards',
        options: [
          '6000 BCE, because BCE counts backwards',
          '1200 BCE, because 1200 is smaller',
          'They are the exact same year',
          '1958 CE is older than both'
        ],
        img: IMG_BASE + 'cowrie-shells-cloth.jpg',
        caption: 'Understanding BCE Timelines (p. 42)'
      },
      {
        id: 'tow-3',
        q: 'Why did people switch from metal knives to round coins with holes?',
        answer: 'Knives were difficult to carry and use',
        options: [
          'Knives were difficult to carry and use',
          'Knives were made of soft paper',
          'People wanted bigger spades',
          'Coins were heavier than goats'
        ],
        img: IMG_BASE + 'chinese-knife-spade.jpg',
        caption: '1000 BCE Metal Knives & Spades (p. 43)'
      },
      {
        id: 'tow-4',
        q: 'Where were the first true coins with pictures of plants and animals made around 600 BCE?',
        answer: 'Lydia, in modern-day Turkey',
        options: [
          'Lydia, in modern-day Turkey',
          'New York City, USA',
          'Antarctica',
          'Modern-day Brazil'
        ],
        img: IMG_BASE + 'hole-coin-and-lydia.jpg',
        caption: '600 BCE Lydian Lion Coin (p. 43)'
      },
      {
        id: 'tow-5',
        q: 'When did European countries start using paper money widely?',
        answer: 'Around 1600 CE',
        options: [
          'Around 1600 CE',
          'Around 6000 BCE',
          'In 1958 CE',
          'In 1200 BCE'
        ],
        img: IMG_BASE + 'china-paper-money.jpg',
        caption: 'History of Paper Money (p. 44)'
      },
      {
        id: 'tow-6',
        q: 'Which item on page 46 was NEVER used as money: Cowrie shells, Ancient knife, or Wallet?',
        answer: 'Wallet / Fork and knife',
        options: [
          'Wallet / Fork and knife',
          'Cowrie shells',
          'Ancient Chinese knife',
          'Paper money & Credit card'
        ],
        img: IMG_BASE + 'chinese-knife-spade.jpg',
        caption: 'Explore the Reading (p. 46)'
      },
      {
        id: 'tow-7',
        q: 'In "A New Friend", how did Wen Shu hurt the baby bird?',
        answer: 'He used his slingshot',
        options: [
          'He used his slingshot',
          'He dropped a heavy coin',
          'He rode his bicycle fast',
          'He threw a snowball'
        ],
        img: IMG_BASE + 'baby-bird-vet.jpg',
        caption: 'A New Friend (p. 47)'
      },
      {
        id: 'tow-8',
        q: 'Why did Jodie and Nina laugh at Paige?',
        answer: "She didn't have a cell phone",
        options: [
          "She didn't have a cell phone",
          'She wore two different shoes',
          'She lost her backpack',
          'She forgot her homework'
        ],
        img: IMG_BASE + 'paige-park-bench.jpg',
        caption: 'The $100 Bill (p. 48)'
      },
      {
        id: 'tow-9',
        q: 'How much money did Paige find in the wet leaves?',
        answer: 'A $100 bill',
        options: [
          'A $100 bill',
          'A $95 coin',
          'A $10 bill',
          'Five cowrie shells'
        ],
        img: IMG_BASE + 'paige-park-bench.jpg',
        caption: 'Finding Money in the Leaves (p. 49)'
      },
      {
        id: 'tow-10',
        q: 'How much did the beautiful black phone in the window cost?',
        answer: '$95',
        options: ['$95', '$100', '$300', '$150'],
        img: IMG_BASE + 'paige-phone-store.jpg',
        caption: 'The Cell Phone Store Window (p. 52)'
      },
      {
        id: 'tow-11',
        q: 'Did Paige buy the cell phone at the store?',
        answer: 'No, she decided to save the money',
        options: [
          'No, she decided to save the money',
          'Yes, she bought the $95 black phone',
          'Yes, she bought the $300 blue phone',
          'She traded her backpack for it'
        ],
        img: IMG_BASE + 'paige-phone-store.jpg',
        caption: 'Inside the Cell Phone Store (p. 52)'
      },
      {
        id: 'tow-12',
        q: "Why couldn't Paige's dad go to a restaurant at first?",
        answer: 'Because money was tight right now',
        options: [
          'Because money was tight right now',
          'Because restaurants were closed',
          'Because he did not like pizza',
          'Because he lost his car keys'
        ],
        img: IMG_BASE + 'paige-dad-kitchen.jpg',
        caption: "Paige's Dad in the Kitchen (p. 53)"
      },
      {
        id: 'tow-13',
        q: 'What did Paige and her dad do at the end of the story?',
        answer: 'Used the $100 bill to go to a restaurant together',
        options: [
          'Used the $100 bill to go to a restaurant together',
          'Went back to buy two cell phones',
          'Left the $100 bill on the park bench',
          'Bought a pet goat with grain'
        ],
        img: IMG_BASE + 'paige-dad-kitchen.jpg',
        caption: 'A Happy Dinner Together (p. 53)'
      },
      {
        id: 'tow-14',
        q: 'Where did the first paper money come from between 800 and 900 CE?',
        answer: 'China',
        options: ['China', 'Lydia (Turkey)', 'Europe', 'South America'],
        img: IMG_BASE + 'china-paper-money.jpg',
        caption: 'First Paper Money (p. 44)'
      },
      {
        id: 'tow-15',
        q: 'Why do many people use electronic money on the internet in the 21st century?',
        answer: "Because it's very easy to move around",
        options: [
          "Because it's very easy to move around",
          'Because it is made of heavy silver',
          'Because it has a square hole in the middle',
          'Because you can carry it in a grain bowl'
        ],
        img: IMG_BASE + 'electronic-phone-pay.jpg',
        caption: '21st Century Electronic Money (p. 45)'
      }
    ]
  };

  root.UNIT3_MISSION_DATA = UNIT3_MISSION_DATA;
})(typeof window !== 'undefined' ? window : this);
