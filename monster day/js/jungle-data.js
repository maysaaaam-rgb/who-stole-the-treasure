/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Complete Game Data: Visual Jungle Exploration & Vocabulary Adventure
   + Continuous Storyline & CLIL Science Curriculum
   ========================================================================== */

window.JUNGLE_DATA = {
  // Expanded 16-Animal Cast for a Real Living Ecosystem
  animals: {
    squirrel: {
      id: "squirrel",
      name: "Squirrel",
      emoji: "🐿️",
      habitat: "Forest / Tall Trees",
      food: "Nuts & Seeds",
      shelter: "Tree Hollow",
      sound: "chatter",
      desc: "A small mammal with a bushy tail that climbs trees and collects acorns."
    },
    frog: {
      id: "frog",
      name: "Frog",
      emoji: "🐸",
      habitat: "Pond & Wetlands",
      food: "Insects & Flies",
      shelter: "Pond & Lily Pads",
      sound: "croak",
      desc: "An amphibian that lives near water, has moist skin, and catches insects."
    },
    fox: {
      id: "fox",
      name: "Fox",
      emoji: "🦊",
      habitat: "Forest & Meadow",
      food: "Rabbits, Mice & Berries",
      shelter: "Underground Den",
      sound: "bark",
      desc: "A clever predator with red fur, pointed ears, and a bushy tail."
    },
    rabbit: {
      id: "rabbit",
      name: "Rabbit",
      emoji: "🐇",
      habitat: "Grassland & Meadow",
      food: "Green Grass & Plants",
      shelter: "Burrow (Hole in ground)",
      sound: "thump",
      desc: "A gentle prey animal with long ears that hops and eats plants."
    },
    bear: {
      id: "bear",
      name: "Bear",
      emoji: "🐻",
      habitat: "Deep Forest & Mountain",
      food: "Fish, Berries & Roots",
      shelter: "Cave / Forest Thicket",
      sound: "growl",
      desc: "A large, strong omnivore that fishes in rivers and eats sweet berries."
    },
    raccoon: {
      id: "raccoon",
      name: "Raccoon",
      emoji: "🦝",
      habitat: "Riverbank & Woods",
      food: "Fish, Berries & Frogs",
      shelter: "Tree Hollow",
      sound: "chitter",
      desc: "A curious animal with a black face mask and dexterous paws."
    },
    owl: {
      id: "owl",
      name: "Owl",
      emoji: "🦉",
      habitat: "Tall Forest Trees",
      food: "Mice & Small Rodents",
      shelter: "High Tree Hollow",
      sound: "hoot",
      desc: "A nocturnal bird of prey with large round eyes that hunts at night."
    },
    eagle: {
      id: "eagle",
      name: "Eagle",
      emoji: "🦅",
      habitat: "Mountain Cliffs & High Sky",
      food: "Fish & Small Mammals",
      shelter: "High Clifftop Nest",
      sound: "screech",
      desc: "A majestic bird of prey with keen eyesight and powerful wings."
    },
    deer: {
      id: "deer",
      name: "Deer",
      emoji: "🦌",
      habitat: "Forest & Open Meadow",
      food: "Leaves, Grass & Twigs",
      shelter: "Forest Thicket",
      sound: "bleat",
      desc: "A graceful herbivore with slender legs that grazes quietly."
    },
    turtle: {
      id: "turtle",
      name: "Turtle",
      emoji: "🐢",
      habitat: "Pond & Riverbank",
      food: "Water Plants & Small Bugs",
      shelter: "Hard Shell",
      sound: "splash",
      desc: "A slow-moving reptile with a protective shell that sunbathes on rocks."
    },
    snake: {
      id: "snake",
      name: "Snake",
      emoji: "🐍",
      habitat: "Grassland & Forest Floor",
      food: "Mice, Frogs & Eggs",
      shelter: "Under Rocks & Logs",
      sound: "hiss",
      desc: "A reptile that slithers through grass and hunts small prey."
    },
    butterfly: {
      id: "butterfly",
      name: "Butterfly",
      emoji: "🦋",
      habitat: "Grassland & Flower Gardens",
      food: "Flower Nectar",
      shelter: "Under Leaf",
      sound: "flutter",
      desc: "A colorful insect that drinks nectar from blooming wildflowers."
    },
    bee: {
      id: "bee",
      name: "Bee",
      emoji: "🐝",
      habitat: "Meadow & Forest Hives",
      food: "Flower Pollen & Nectar",
      shelter: "Hive (in hollow tree)",
      sound: "buzz",
      desc: "A hardworking pollinator insect that makes honey."
    },
    fish: {
      id: "fish",
      name: "Fish",
      emoji: "🐟",
      habitat: "River & Freshwater Pond",
      food: "Water Bugs & Algae",
      shelter: "Deep River Currents",
      sound: "bubble",
      desc: "A water animal with fins and gills that swims in clean streams."
    },
    hedgehog: {
      id: "hedgehog",
      name: "Hedgehog",
      emoji: "🦔",
      habitat: "Forest Floor & Bushes",
      food: "Insects, Worms & Berries",
      shelter: "Leaf Pile under Bushes",
      sound: "snuffle",
      desc: "A small mammal covered in spiky quills that rolls into a ball for safety."
    },
    bird: {
      id: "bird",
      name: "Small Bird",
      emoji: "🐦",
      habitat: "Forest Canopy & Branches",
      food: "Seeds, Berries & Worms",
      shelter: "Twig Nest",
      sound: "tweet",
      desc: "A cheerful singing songbird that builds neat nests of twigs."
    }
  },

  // Persistent Visual Word Wall Vocabulary
  visualWordWall: [
    { word: "SQUIRREL", icon: "🐿️", type: "animal", desc: "Climbs trees, eats nuts, has a bushy tail." },
    { word: "FROG", icon: "🐸", type: "animal", desc: "Lives in water, hops, eats insects." },
    { word: "RABBIT", icon: "🐇", type: "animal", desc: "Hops in grassland, eats plants, has long ears." },
    { word: "FOX", icon: "🦊", type: "animal", desc: "Forest predator, hunts rabbits, has red fur." },
    { word: "BEAR", icon: "🐻", type: "animal", desc: "Large forest mammal, eats fish and berries." },
    { word: "RACCOON", icon: "🦝", type: "animal", desc: "Curious river animal with a black mask." },
    { word: "OWL", icon: "🦉", type: "animal", desc: "Nocturnal hunter with large round eyes." },
    { word: "EAGLE", icon: "🦅", type: "animal", desc: "High flying bird of prey with sharp vision." },
    { word: "DEER", icon: "🦌", type: "animal", desc: "Gentle herbivore that grazes on leaves." },
    { word: "FISH", icon: "🐟", type: "animal", desc: "Swims in clean rivers and ponds." },
    { word: "TREE", icon: "🌳", type: "nature", desc: "Tall plant with branches, leaves, and wood." },
    { word: "PLANT", icon: "🌿", type: "nature", desc: "Green living organism; primary food for herbivores." },
    { word: "WATER", icon: "💧", type: "needs", desc: "Clean liquid all living things must drink." },
    { word: "FOOD", icon: "🍎", type: "needs", desc: "Nourishment animals eat for energy to grow." },
    { word: "SHELTER", icon: "🏠", type: "science", desc: "A safe place that protects an animal from danger." },
    { word: "HABITAT", icon: "🏡", type: "science", desc: "An animal's home that provides food, water, and shelter." },
    { word: "PREDATOR", icon: "🦊", type: "science", desc: "An animal that hunts and eats other animals." },
    { word: "PREY", icon: "🐇", type: "science", desc: "An animal that is hunted and eaten by predators." },
    { word: "FOOD CHAIN", icon: "🔗", type: "science", desc: "Shows how living things get food and energy." },
    { word: "ECOSYSTEM", icon: "🌎", type: "science", desc: "A community of living things connected to their environment." }
  ],

  // Complete 26-Step Storyboard:
  // Part 1: Visual Jungle Exploration & Vocabulary Adventure (Chapters 1–13)
  // Part 2: The Great Storm & Ranger Rescue Missions (Chapters 14–26+)
  chapters: [
    // -----------------------------------------------------------------------
    // CHAPTER 1: Welcome to Green Valley (Open Visual Exploration)
    // -----------------------------------------------------------------------
    {
      id: "v-explore",
      number: 1,
      phase: "exploration",
      title: "Welcome to Green Valley",
      subtitle: "Open Visual Ecosystem Discovery",
      clilGoal: "Observe and identify living things in a balanced natural ecosystem.",
      languageGoal: "Naming & pointing: 'What can you see? I can see a squirrel, water, a tree...'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Welcome to Green Valley! Touch the animals and nature to explore their beautiful home.",
        spokenText: "Welcome to Green Valley! Touch the animals and nature to explore their home."
      },
      teacherGuide: {
        say: "Ask the class: 'What can you see? Can you find a squirrel? Can you find water? Can you find a frog?'",
        do: "Invite students to touch different animals and plants on the whiteboard to hear their sounds and see them move.",
        next: "Click NEXT to play 'Ranger Eyes'!"
      },
      type: "open_exploration",
      hotspots: [
        { id: "squirrel", name: "Squirrel 🐿️", sound: "chatter", x: 22, y: 35, emoji: "🐿️" },
        { id: "frog", name: "Frog 🐸", sound: "croak", x: 68, y: 72, emoji: "🐸" },
        { id: "fox", name: "Fox 🦊", sound: "bark", x: 42, y: 60, emoji: "🦊" },
        { id: "bird", name: "Bird 🐦", sound: "tweet", x: 82, y: 28, emoji: "🐦" },
        { id: "deer", name: "Deer 🦌", sound: "bleat", x: 88, y: 55, emoji: "🦌" },
        { id: "butterfly", name: "Butterfly 🦋", sound: "flutter", x: 12, y: 68, emoji: "🦋" }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 2: Ranger Eyes (Find the Animal in Nature)
    // -----------------------------------------------------------------------
    {
      id: "v-ranger-eyes",
      number: 2,
      phase: "exploration",
      title: "Ranger Eyes",
      subtitle: "Spot the Hidden Animals",
      clilGoal: "Animals blend naturally into their specific habitats (trees, pond, bushes).",
      languageGoal: "Action directives: 'Find the frog! Find the squirrel! Find the fox!'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Use your Ranger Eyes! Can you find the hidden animals in the jungle?",
        spokenText: "Use your Ranger Eyes! Can you find the hidden animals in the jungle?"
      },
      teacherGuide: {
        say: "Call out one animal at a time: 'Find the frog near the water!' 'Find the squirrel in the tree!'",
        do: "Students come up and tap each hidden animal.",
        next: "Once all 5 animals are found, proceed to Who Am I?"
      },
      type: "ranger_eyes_search",
      targets: [
        { id: "frog", name: "Frog 🐸", hint: "Look near the water lily pond!", found: false },
        { id: "squirrel", name: "Squirrel 🐿️", hint: "Look up in the oak tree!", found: false },
        { id: "fox", name: "Fox 🦊", hint: "Look behind the forest bushes!", found: false },
        { id: "owl", name: "Owl 🦉", hint: "Look in the high tree branch!", found: false },
        { id: "rabbit", name: "Rabbit 🐇", hint: "Look in the tall meadow grass!", found: false }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 3: Who Am I? (Contextual Vocabulary Clues)
    // -----------------------------------------------------------------------
    {
      id: "v-who-am-i",
      number: 3,
      phase: "exploration",
      title: "Who Am I?",
      subtitle: "Discover Words through Visual Clues",
      clilGoal: "Connect physical traits and behaviors to animal names.",
      languageGoal: "Clue comprehension: 'I live in... I eat... Who am I?'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look at the clues. Who is this animal?",
        spokenText: "Look at the clues. Who is this animal?"
      },
      teacherGuide: {
        say: "Read the 3 visual clues with TPR actions: 'I live in trees. I eat nuts. I am small. Who am I?'",
        do: "Have students call out the answer before tapping the reveal button.",
        next: "Practice with 3 different animals."
      },
      type: "who_am_i_puzzles",
      puzzles: [
        {
          animalId: "squirrel",
          name: "SQUIRREL",
          emoji: "🐿️",
          clues: [
            "🌳 I live in tall trees.",
            "🌰 I eat nuts and acorns.",
            "🐾 I have a big bushy tail."
          ],
          revealed: false
        },
        {
          animalId: "frog",
          name: "FROG",
          emoji: "🐸",
          clues: [
            "💧 I live near water.",
            "🪲 I catch insects with my tongue.",
            "🟢 I have smooth green skin."
          ],
          revealed: false
        },
        {
          animalId: "rabbit",
          name: "RABBIT",
          emoji: "RABBIT",
          clues: [
            "🌾 I live in grassy fields.",
            "🌿 I eat green plants.",
            "🐰 I have long ears and I hop."
          ],
          revealed: false
        }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 4: Match the Animal (Word to Picture)
    // -----------------------------------------------------------------------
    {
      id: "v-match-animal",
      number: 4,
      phase: "exploration",
      title: "Match the Animal",
      subtitle: "Touch & Drag Word Matching",
      clilGoal: "Recognize realistic visual representations of key animal species.",
      languageGoal: "Word recognition: SQUIRREL, FROG, RABBIT, FOX.",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Drag each word card to the matching animal picture. Tap works too!",
        spokenText: "Drag each word card to the matching animal picture."
      },
      teacherGuide: {
        say: "Point to each word: 'Where is SQUIRREL? Where is FROG?'",
        do: "Students drag or tap the word to snap it to the matching animal photo.",
        next: "Proceed to 'Where Does It Live?'"
      },
      type: "match_word_picture",
      pairs: [
        { id: "squirrel", word: "SQUIRREL", emoji: "🐿️", label: "Squirrel in tree" },
        { id: "frog", word: "FROG", emoji: "🐸", label: "Frog on lily pad" },
        { id: "rabbit", word: "RABBIT", emoji: "🐇", label: "Rabbit in grass" },
        { id: "fox", word: "FOX", emoji: "🦊", label: "Fox in forest" }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 5: Where Does It Live? (Illustrated Biomes)
    // -----------------------------------------------------------------------
    {
      id: "v-where-lives",
      number: 5,
      phase: "exploration",
      title: "Where Does It Live?",
      subtitle: "Matching Animals to Real Illustrated Biomes",
      clilGoal: "Different animal species live in specific natural environments.",
      languageGoal: "Prepositions of place: 'The frog lives in the pond. The squirrel lives in the forest.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Drag each animal into its real home environment: Forest, Pond, River, or Grassland.",
        spokenText: "Where do these animals live? Drag each animal to its environment."
      },
      teacherGuide: {
        say: "Point to the 4 biomes: Forest 🌲, Pond 💧, River 🌊, Grassland 🌾.",
        do: "Students drag the frog to the pond, the squirrel to the forest, the fish to the river, and the rabbit to the grassland.",
        next: "Discover basic needs in Chapter 6."
      },
      type: "where_does_it_live",
      items: [
        { id: "frog", name: "Frog", emoji: "🐸", target: "pond", targetName: "Pond" },
        { id: "squirrel", name: "Squirrel", emoji: "🐿️", target: "forest", targetName: "Forest" },
        { id: "fish", name: "Fish", emoji: "🐟", target: "river", targetName: "River" },
        { id: "rabbit", name: "Rabbit", emoji: "🐇", target: "grassland", targetName: "Grassland" }
      ],
      environments: [
        { id: "forest", name: "Forest 🌲", desc: "Tall trees, moss & nuts" },
        { id: "pond", name: "Pond 💧", desc: "Still water & lily pads" },
        { id: "river", name: "River 🌊", desc: "Flowing stream & pebbles" },
        { id: "grassland", name: "Grassland 🌾", desc: "Tall grass & flowers" }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 6: What Does It Need? (Survival Triangle)
    // -----------------------------------------------------------------------
    {
      id: "v-what-needs",
      number: 6,
      phase: "exploration",
      title: "What Does It Need?",
      subtitle: "Food, Water, and Shelter",
      clilGoal: "Animals need 3 essential things to survive: Food, Water, and Shelter.",
      languageGoal: "Sentences with NEED: 'The squirrel needs food, water, and shelter.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "What do animals need to survive? Drag the 3 basic survival items to the squirrel.",
        spokenText: "What do animals need to survive? Drag food, water, and shelter."
      },
      teacherGuide: {
        say: "Emphasize: 'Animals need FOOD to eat, WATER to drink, and SHELTER to stay safe.'",
        do: "Have a student drag 🌰 Food, 💧 Water, and 🌳 Shelter around the animal.",
        next: "Next, explore different types of animal shelters."
      },
      type: "what_needs_matching",
      targetAnimal: "squirrel",
      neededItems: [
        { id: "food", name: "FOOD 🌰", desc: "Energy to live and grow", correct: true },
        { id: "water", name: "WATER 💧", desc: "Clean water to drink", correct: true },
        { id: "shelter", name: "SHELTER 🌳", desc: "A safe place to rest", correct: true }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 7: Animal Homes (Shelter Discovery)
    // -----------------------------------------------------------------------
    {
      id: "v-animal-homes",
      number: 7,
      phase: "exploration",
      title: "Animal Homes (Shelter)",
      subtitle: "A Shelter is a Safe Place",
      clilGoal: "Shelters protect animals from bad weather and predators (Nests, Burrows, Hollows, Dens).",
      languageGoal: "Vocabulary: SHELTER. 'A bird lives in a nest. A fox lives in a den.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "A SHELTER is a safe home. Match each animal to its shelter!",
        spokenText: "A shelter is a safe place. Match each animal to its shelter."
      },
      teacherGuide: {
        say: "Explain simply: 'SHELTER = a safe place.'",
        do: "Match Bird ➔ Nest 🐦, Fox ➔ Den 🦊, Rabbit ➔ Burrow 🐇, Squirrel ➔ Tree Hollow 🐿️.",
        next: "Proceed to discover Habitat."
      },
      type: "shelter_matching",
      pairs: [
        { animal: "Bird 🐦", shelter: "Nest 🪺", shelterName: "Twig Nest" },
        { animal: "Fox 🦊", shelter: "Den 🕳️", shelterName: "Underground Den" },
        { animal: "Rabbit 🐇", shelter: "Burrow 🕳️", shelterName: "Grassland Burrow" },
        { animal: "Squirrel 🐿️", shelter: "Tree Hollow 🌳", shelterName: "Tree Hollow" }
      ],
      conceptNote: "🏠 SHELTER = A safe place where an animal sleeps and hides from danger.",
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 8: Discover Habitat (Visual Frog & Squirrel Home)
    // -----------------------------------------------------------------------
    {
      id: "v-discover-habitat",
      number: 8,
      phase: "exploration",
      title: "Discover Habitat",
      subtitle: "Habitat = An Animal's Home",
      clilGoal: "A habitat is an environment that provides all survival needs in one place.",
      languageGoal: "Definition: 'A HABITAT is an animal's home.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look at the frog's pond: water + plants + insects. This is its HABITAT (an animal's home).",
        spokenText: "Look at the pond: water, plants, and insects. This is the frog's habitat."
      },
      teacherGuide: {
        say: "Show: 🐸 Frog + 💧 Water + 🌿 Plants + 🪲 Food = HABITAT.",
        do: "Students repeat: 'Habitat is an animal's home.'",
        next: "Proceed to animal diets in Chapter 9."
      },
      type: "visual_habitat_reveal",
      examples: [
        {
          animal: "Frog 🐸",
          components: ["💧 Clean Pond", "🌿 Reeds & Lilies", "🪲 Tasty Insects", "🏠 Water Shelter"],
          habitatName: "Pond Habitat"
        },
        {
          animal: "Squirrel 🐿️",
          components: ["🌲 Tall Oak Trees", "🌰 Acorns & Nuts", "💧 Rain Drops", "🏠 Tree Hollow"],
          habitatName: "Forest Habitat"
        }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 9: Discover Food (Animal Diets)
    // -----------------------------------------------------------------------
    {
      id: "v-discover-food",
      number: 9,
      phase: "exploration",
      title: "Discover Food",
      subtitle: "Feeding the Jungle Animals",
      clilGoal: "Different animals eat different foods (Herbivores eat plants, Carnivores eat meat, Omnivores eat both).",
      languageGoal: "Action verbs: 'The squirrel eats nuts. The frog eats bugs. The rabbit eats grass.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Feed the hungry jungle animals! Drag each food to the animal that eats it.",
        spokenText: "Feed the hungry jungle animals! Drag the food to the animal that eats it."
      },
      teacherGuide: {
        say: "Ask: 'What does the rabbit eat? Green plants! What does the owl hunt? Mice!'",
        do: "Students drag food items into the animals' mouths to hear munching sounds.",
        next: "Next, learn about Predator and Prey."
      },
      type: "food_diet_feeder",
      pairs: [
        { animalId: "squirrel", animal: "Squirrel 🐿️", foodEmoji: "🌰", foodName: "Nuts & Acorns" },
        { animalId: "frog", animal: "Frog 🐸", foodEmoji: "🪲", foodName: "Insects & Flies" },
        { animalId: "rabbit", animal: "Rabbit 🐇", foodEmoji: "🌿", foodName: "Green Grass" },
        { animalId: "owl", animal: "Owl 🦉", foodEmoji: "🐭", foodName: "Field Mouse" },
        { animalId: "bear", animal: "Bear 🐻", foodEmoji: "🍓", foodName: "Forest Berries" }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 10: Who Eats Who? (Predator & Prey Concept)
    // -----------------------------------------------------------------------
    {
      id: "v-who-eats-who",
      number: 10,
      phase: "exploration",
      title: "Who Eats Who?",
      subtitle: "Predator & Prey Concepts",
      clilGoal: "Predators hunt other animals; Prey animals are hunted.",
      languageGoal: "PREDATOR vs PREY: 'The fox is a predator. The rabbit is prey.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look at the animated scene: The rabbit eats the plant. The fox hunts the rabbit. Who is the predator?",
        spokenText: "The rabbit eats the plant. The fox hunts the rabbit. Who is the predator?"
      },
      teacherGuide: {
        say: "Point to the animation: 'Rabbit eats plant. Fox eats rabbit. Who is the predator? The fox!'",
        do: "Tap the Fox to reveal PREDATOR 🦊. Tap the Rabbit to reveal PREY 🐇.",
        next: "Build a full Food Chain in Chapter 11."
      },
      type: "predator_prey_interactive",
      chain: [
        { role: "Producer", name: "Green Plant 🌱", action: "Grows from sunlight" },
        { role: "Prey", name: "Rabbit 🐇", action: "Eats plants (PREY)" },
        { role: "Predator", name: "Fox 🦊", action: "Hunts rabbits (PREDATOR)" }
      ],
      definitions: [
        { word: "PREDATOR 🦊", desc: "An animal that hunts other animals for food." },
        { word: "PREY 🐇", desc: "An animal that is hunted and eaten by predators." }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 11: Build a Food Chain
    // -----------------------------------------------------------------------
    {
      id: "v-build-food-chain",
      number: 11,
      phase: "exploration",
      title: "Build a Food Chain",
      subtitle: "Energy Flow Through Food",
      clilGoal: "Food chains start with plants and show how food energy flows to animals.",
      languageGoal: "Sequencing: 'Plant ➔ Rabbit ➔ Fox.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Drag the picture cards in order to build the Food Chain: Plant ➔ Rabbit ➔ Fox.",
        spokenText: "Drag the cards in order to build the food chain."
      },
      teacherGuide: {
        say: "Prompt the order: 'First: Plant 🌱. Next: Rabbit 🐇. Finally: Fox 🦊.'",
        do: "Students drag the 3 cards into the slots to watch the energy arrows glow.",
        next: "Discover the whole Ecosystem in Chapter 12."
      },
      type: "food_chain_sequencer",
      chains: [
        {
          id: "chain-1",
          title: "Meadow Chain",
          slots: [
            { pos: 1, role: "Plant 🌱", expect: "plant" },
            { pos: 2, role: "Rabbit 🐇", expect: "rabbit" },
            { pos: 3, role: "Fox 🦊", expect: "fox" }
          ]
        },
        {
          id: "chain-2",
          title: "Forest Canopy Chain",
          slots: [
            { pos: 1, role: "Acorn 🌰", expect: "acorn" },
            { pos: 2, role: "Squirrel 🐿️", expect: "squirrel" },
            { pos: 3, role: "Owl 🦉", expect: "owl" }
          ]
        }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 12: Discover Ecosystem Visually
    // -----------------------------------------------------------------------
    {
      id: "v-discover-ecosystem",
      number: 12,
      phase: "exploration",
      title: "Discover Ecosystem",
      subtitle: "Everything is Connected",
      clilGoal: "An ecosystem is a community where living things depend on each other and their environment.",
      languageGoal: "Concept: 'Everything is connected. This is an ECOSYSTEM.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look at all of Green Valley! Trees, water, animals, food, and shelters are connected. This is an ECOSYSTEM.",
        spokenText: "Trees, water, animals, food, and shelters are connected. This is an ecosystem."
      },
      teacherGuide: {
        say: "Tap the glowing connection lines: 'Trees give shelter to squirrels. Rivers give water to deer. Plants feed rabbits.'",
        do: "Students chant together: 'Everything is connected!'",
        next: "View the Story Preview before the storm strikes."
      },
      type: "ecosystem_connection_map",
      connections: [
        { from: "🌲 Forest Trees", to: "🐿️ Suki the Squirrel", text: "Shelter & Acorns" },
        { from: "💧 River Water", to: "🦝 Rico the Raccoon", text: "Clean Drinking Water" },
        { from: "🌿 Green Plants", to: "🐇 Pip the Rabbit", text: "Plant Food" },
        { from: "🐇 Pip the Rabbit", to: "🦊 Flash the Fox", text: "Food Chain Link" },
        { from: "🌊 Wetland Pond", to: "🐸 Poppy the Frog", text: "Moist Habitat" }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 13: Visual Story Preview
    // -----------------------------------------------------------------------
    {
      id: "v-story-preview",
      number: 13,
      phase: "exploration",
      title: "Story Preview: Trouble in Green Valley",
      subtitle: "Predicting Before the Storm",
      clilGoal: "Anticipate the impact of environmental changes on living things.",
      languageGoal: "Predicting with 'I think...': 'I think a storm will come and Rangers will help.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look at the 4 story cards: Healthy Jungle ➔ Big Storm ➔ Animals in Trouble ➔ Jungle Rangers Help! What do you think will happen?",
        spokenText: "Look at the 4 story cards. What do you think will happen in our story?"
      },
      teacherGuide: {
        say: "Guide prediction using the visual comic strip: 'Healthy Valley ➔ Storm strikes ➔ Homes damaged ➔ Rangers rescue!'",
        do: "Students vote on: 'What will the Jungle Rangers do?'",
        next: "Start the Main Story: Chapter 14 (The Great Storm)!"
      },
      type: "story_preview_strip",
      cards: [
        { step: 1, title: "1. Living Jungle ✨", desc: "Green Valley is peaceful and full of life." },
        { step: 2, title: "2. The Big Storm ⛈️", desc: "Fierce winds and rain damage the valley." },
        { step: 3, title: "3. Animals in Need 🐾", desc: "Animals lose shelter, clean water, and food." },
        { step: 4, title: "4. Rangers to the Rescue 🎖️", desc: "Jungle Rangers work together to save the jungle!" }
      ],
      healthChange: 5
    },

    // =======================================================================
    // PART 2: THE MAIN STORY & RANGER RESCUE MISSIONS (CHAPTERS 14–26+)
    // =======================================================================

    // -----------------------------------------------------------------------
    // CHAPTER 14: The Great Storm
    // -----------------------------------------------------------------------
    {
      id: "s-the-great-storm",
      number: 14,
      phase: "story",
      title: "The Great Storm",
      subtitle: "A Major Ecological Emergency",
      clilGoal: "A natural disaster damages habitats, water sources, and shelters.",
      languageGoal: "Emergency alerts: 'A huge storm has changed Green Valley!'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Oh no! A huge storm has hit Green Valley! Trees have fallen and the water is muddy. Rangers, we need your help!",
        spokenText: "Oh no! A huge storm has hit Green Valley! Trees have fallen and the water is muddy. Rangers, we need your help!"
      },
      teacherGuide: {
        say: "Dramatic storm event! Ask: 'What happened to the trees? What happened to the water?'",
        do: "Play storm soundboard FX. Have students point to the damaged areas on screen.",
        next: "Click 'Investigate Emergency' to help our first animal."
      },
      type: "storm_animation",
      damages: [
        { icon: "🌳💥", title: "Trees Fallen", desc: "Shelters destroyed" },
        { icon: "🌊🟤", title: "Dirty Water", desc: "River full of mud" },
        { icon: "💧📉", title: "Pond Drying", desc: "Water draining away" },
        { icon: "🌱🥀", title: "Plants Lost", desc: "Food sources scarce" }
      ],
      healthChange: -35
    },

    // -----------------------------------------------------------------------
    // CHAPTER 15: Suki the Squirrel
    // -----------------------------------------------------------------------
    {
      id: "s-suki-squirrel",
      number: 15,
      phase: "story",
      title: "Suki the Squirrel",
      subtitle: "Predicting with WILL (Strong Consequence)",
      clilGoal: "When shelter is destroyed, animals must find a new suitable habitat.",
      languageGoal: "Predicting with WILL: 'Suki will lose her shelter.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Suki's tree has fallen (🌳 💥). What WILL happen to Suki?",
        spokenText: "Suki's tree has fallen. What will happen to Suki?"
      },
      teacherGuide: {
        say: "Emphasize 'WILL' for a certain prediction: 'What WILL happen to Suki?'",
        do: "Students choose: 'She will lose her shelter.'",
        next: "Provide Suki with what she needs to survive."
      },
      type: "prediction_choice",
      badge: { text: "WILL = Strong Prediction", type: "will" },
      options: [
        { id: "A", text: "She WILL lose her shelter.", correct: true, feedback: "Correct! Suki lost her tree and needs a safe shelter." },
        { id: "B", text: "She WILL live underwater.", correct: false, feedback: "Squirrels cannot breathe underwater!" },
        { id: "C", text: "She WILL become a fish.", correct: false, feedback: "Squirrels are mammals, not fish!" }
      ],
      subTask: {
        prompt: "Now drag the 3 survival items to rescue Suki:",
        items: [
          { id: "shelter", name: "Shelter", emoji: "🌳", label: "Tree Shelter" },
          { id: "food", name: "Food", emoji: "🌰", label: "Acorn Nuts" },
          { id: "water", name: "Water", emoji: "💧", label: "Clean Water" }
        ]
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 16: Find Suki a New Home
    // -----------------------------------------------------------------------
    {
      id: "s-habitat-suki",
      number: 16,
      phase: "story",
      title: "Find Suki a New Home",
      subtitle: "Matching to Forest Habitat",
      clilGoal: "A habitat provides trees, food, and safe shelter for squirrels.",
      languageGoal: "Reasoning with BECAUSE: 'The forest is best BECAUSE it has trees and nuts.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Drag Suki to the best habitat: Forest, River, or Desert.",
        spokenText: "Drag Suki to the best habitat. Where can she find trees and food?"
      },
      teacherGuide: {
        say: "Point to each habitat: Forest 🌲, River 🌊, Desert 🏜️.",
        do: "A student drags Suki to the Forest habitat on the whiteboard.",
        next: "Answer the 'Why?' reasoning question."
      },
      type: "habitat_drag",
      animalId: "squirrel",
      zones: [
        { id: "forest", name: "Forest", emoji: "🌲", desc: "Trees, leaves & nuts", correct: true },
        { id: "river", name: "River", emoji: "🌊", desc: "Deep running water", correct: false },
        { id: "desert", name: "Desert", emoji: "🏜️", desc: "Hot sand & no trees", correct: false }
      ],
      reasoningQuestion: {
        question: "Why is the forest the best habitat?",
        options: [
          { id: "A", text: "It has trees and food.", correct: true },
          { id: "B", text: "It has deep ocean water.", correct: false },
          { id: "C", text: "It has hot dry sand.", correct: false }
        ]
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 17: Rico the Raccoon
    // -----------------------------------------------------------------------
    {
      id: "s-rico-raccoon",
      number: 17,
      phase: "story",
      title: "Rico the Raccoon",
      subtitle: "Predicting with MIGHT (Possibility)",
      clilGoal: "Polluted water threatens animal health; animals need clean drinking water.",
      languageGoal: "Predicting with MIGHT: 'Rico MIGHT have trouble finding clean water.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "The river is dirty with mud (🌊 ➔ 🟤). What MIGHT happen if the river stays dirty?",
        spokenText: "The river is dirty. What might happen to Rico?"
      },
      teacherGuide: {
        say: "Highlight MIGHT for possibility: 'Rico MIGHT have trouble finding clean water.'",
        do: "Ask: 'What could the Rangers do? Find a clean freshwater spring!'",
        next: "Lead students to guide Rico to the clean water spring."
      },
      type: "prediction_choice",
      badge: { text: "MIGHT = Possible Consequence", type: "might" },
      options: [
        { id: "A", text: "Rico MIGHT have trouble finding clean water.", correct: true, feedback: "Exactly! Animals cannot drink heavily polluted water." },
        { id: "B", text: "Rico WILL become a fish.", correct: false, feedback: "Raccoons cannot transform into fish!" },
        { id: "C", text: "Rico WON'T need water anymore.", correct: false, feedback: "All animals must have water to live!" }
      ],
      solutionAction: {
        question: "What could the Jungle Rangers do?",
        options: [
          { id: "A", text: "Guide Rico to a clean freshwater spring! 💧", correct: true },
          { id: "B", text: "Throw more rubbish into the river. 🗑️", correct: false },
          { id: "C", text: "Remove all water from the forest. ❌", correct: false }
        ]
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 18: Poppy the Frog
    // -----------------------------------------------------------------------
    {
      id: "s-poppy-frog",
      number: 18,
      phase: "story",
      title: "Poppy the Frog",
      subtitle: "Conditional Predictions (IF + RESULT)",
      clilGoal: "Amphibians require wet conditions to keep their skin moist and survive.",
      languageGoal: "IF + RESULT: 'IF the pond dries, Poppy WILL look for another wet place.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Poppy's pond is drying up! IF the pond dries completely, what WILL happen?",
        spokenText: "Poppy's pond is drying up! If the pond dries completely, what will happen?"
      },
      teacherGuide: {
        say: "Teach the pattern: 'IF + condition, animal + WILL + action.'",
        do: "Students repeat: 'If the pond dries, the frog will look for water.'",
        next: "Drag Poppy to the clean freshwater wetland."
      },
      type: "prediction_choice",
      badge: { text: "IF + CONSEQUENCE", type: "if" },
      options: [
        { id: "A", text: "Poppy WILL look for another wet place.", correct: true, feedback: "Super! Frogs must stay moist and near water to survive." },
        { id: "B", text: "Poppy WILL eat tree branches.", correct: false, feedback: "Frogs eat insects, not tree wood!" },
        { id: "C", text: "Poppy WILL live in the desert.", correct: false, feedback: "The desert is too dry for frogs." }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 19: Boris the Bear
    // -----------------------------------------------------------------------
    {
      id: "s-boris-bear",
      number: 19,
      phase: "story",
      title: "Boris the Bear",
      subtitle: "Adapting Foraging Behavior",
      clilGoal: "When one food source is scarce, animals may change where or what they eat.",
      languageGoal: "MIGHT / MAY: 'Boris MAY look for another food source.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Boris cannot find fish in the muddy river (🐟 ❌). What MIGHT Boris do?",
        spokenText: "Boris cannot find fish in the river. What might Boris do?"
      },
      teacherGuide: {
        say: "Explain: 'When food changes, animals may look for another food source.'",
        do: "Tap the forest bushes to reveal ripe wild berries 🍓 for Boris.",
        next: "Introduce Boris's adaptable omnivore diet."
      },
      type: "prediction_choice",
      badge: { text: "MIGHT / MAY = Flexible Action", type: "might" },
      options: [
        { id: "A", text: "He MIGHT look for another food source like berries.", correct: true, feedback: "Great! Bears are omnivores and eat berries, roots, and fish." },
        { id: "B", text: "He WILL stop needing food forever.", correct: false, feedback: "Bears need lots of food to stay strong!" },
        { id: "C", text: "He MIGHT eat hard river rocks.", correct: false, feedback: "Rocks are not edible food!" }
      ],
      interactiveAction: {
        prompt: "Tap the forest bushes to help Boris find sweet berries! 🍓",
        bushesCount: 3
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 20: Ranger Detective
    // -----------------------------------------------------------------------
    {
      id: "s-ranger-detective",
      number: 20,
      phase: "story",
      title: "Ranger Detective",
      subtitle: "Deduce Animals from Habitat + Food + Needs",
      clilGoal: "Synthesize animal characteristics, diets, and shelters.",
      languageGoal: "Describing clues: 'I live in... I eat... I need... Who am I?'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Put on your detective hats, Rangers! Read the clues about habitat, diet, and needs to identify the animal.",
        spokenText: "Put on your detective hats! Read the clues to find the mystery animal."
      },
      teacherGuide: {
        say: "Read clue 1, clue 2, clue 3 aloud with the class.",
        do: "Students tap the matching animal avatar.",
        next: "Review how habitat + food define an animal's lifestyle."
      },
      type: "detective_mystery",
      cases: [
        {
          id: "case-1",
          clues: [
            "🏠 I live in the forest canopy and build nests in tall trees.",
            "🌰 I eat acorns, nuts, and seeds.",
            "🌳 I need trees for shelter and safe climbing."
          ],
          question: "Who am I?",
          options: [
            { id: "squirrel", emoji: "🐿️", name: "Squirrel", correct: true },
            { id: "frog", emoji: "🐸", name: "Frog", correct: false },
            { id: "eagle", emoji: "🦅", name: "Eagle", correct: false }
          ]
        },
        {
          id: "case-2",
          clues: [
            "💧 I live near clean ponds and wetlands.",
            "🐛 I hunt insects with my long sticky tongue.",
            "🏠 I need wet conditions to keep my skin healthy."
          ],
          question: "Who am I?",
          options: [
            { id: "frog", emoji: "🐸", name: "Frog", correct: true },
            { id: "bear", emoji: "🐻", name: "Bear", correct: false },
            { id: "owl", emoji: "🦉", name: "Owl", correct: false }
          ]
        },
        {
          id: "case-3",
          clues: [
            "🌲 I live in tree hollows and fly quietly at night.",
            "🐭 I hunt small mice, rodents, and bugs.",
            "🦉 I am a nocturnal predator with sharp eyesight."
          ],
          question: "Who am I?",
          options: [
            { id: "owl", emoji: "🦉", name: "Owl", correct: true },
            { id: "rabbit", emoji: "🐇", name: "Rabbit", correct: false },
            { id: "raccoon", emoji: "🦝", name: "Raccoon", correct: false }
          ]
        }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 21: What Happens First? (Cause & Effect Sequencer)
    // -----------------------------------------------------------------------
    {
      id: "s-what-happens-first",
      number: 21,
      phase: "story",
      title: "What Happens First?",
      subtitle: "Cause and Effect Chronology",
      clilGoal: "Environmental disturbances trigger a sequence of ecological consequences.",
      languageGoal: "Sequencing words: First, Then, Next, Finally.",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Put the events in the correct chronological order: First, Then, Next, Finally.",
        spokenText: "Put the events in the correct order: First, Then, Next, Finally."
      },
      teacherGuide: {
        say: "Ask: 'What happened first? The storm! What happened next?'",
        do: "Drag cards into boxes 1, 2, 3, 4.",
        next: "Answer the follow-up prediction: 'What will happen next?'"
      },
      type: "timeline_order",
      cards: [
        { id: "step-1", order: 1, emoji: "⛈️", title: "1. Storm Hits", text: "A heavy storm strikes the jungle." },
        { id: "step-2", order: 2, emoji: "🌳💥", title: "2. Tree Falls", text: "Strong winds knock down tall trees." },
        { id: "step-3", order: 3, emoji: "🐿️💔", title: "3. Loses Shelter", text: "Suki loses her hollow tree home." },
        { id: "step-4", order: 4, emoji: "🔎🏡", title: "4. Searches Home", text: "Suki searches for a new safe habitat." }
      ],
      followUp: {
        question: "What WILL happen next?",
        options: [
          { id: "A", text: "Suki WILL build a new nest in a safe tree.", correct: true },
          { id: "B", text: "Suki WILL build a house in the deep river.", correct: false },
          { id: "C", text: "Suki WILL stop needing food and water.", correct: false }
        ]
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 22: The Bigger Problem (Plant Loss & Cascade)
    // -----------------------------------------------------------------------
    {
      id: "s-the-bigger-problem",
      number: 22,
      phase: "story",
      title: "The Bigger Problem",
      subtitle: "Primary Producers & Ecosystem Cascade",
      clilGoal: "Plants are the foundation of food webs; losing plants affects all living things.",
      languageGoal: "Ecosystem cascade: 'If plants decrease, rabbits have less food, and foxes have less prey.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look closely at the ground: plants are disappearing (🌱🌱 ➔ 🌱). When plants decrease, what will happen to rabbits and foxes?",
        spokenText: "Plants are disappearing. What will happen to the rabbits and the foxes?"
      },
      teacherGuide: {
        say: "Highlight the core CLIL rule: 'Living things depend on each other.'",
        do: "Walk through the cascade: Plants decrease ➔ Rabbits decrease ➔ Foxes have less food.",
        next: "Test predictions in the Prediction Machine."
      },
      type: "ecosystem_cascade",
      steps: [
        {
          question: "1. If plants decrease (🌱 ↓), what WILL happen to the rabbits?",
          options: [
            { id: "A", text: "There WILL be fewer rabbits (less food).", correct: true },
            { id: "B", text: "There WILL be more rabbits.", correct: false },
            { id: "C", text: "Nothing WILL change.", correct: false }
          ]
        },
        {
          question: "2. What MIGHT happen to the fox (🦊)?",
          options: [
            { id: "A", text: "It MIGHT have less food to hunt.", correct: true },
            { id: "B", text: "It WILL eat tree leaves.", correct: false },
            { id: "C", text: "It WILL become a rabbit.", correct: false }
          ]
        }
      ],
      cascadeVisual: "🌱 Decreases ➔ 🐇 Decreases ➔ 🦊 Has Less Food",
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 23: The Prediction Machine
    // -----------------------------------------------------------------------
    {
      id: "s-prediction-machine",
      number: 23,
      phase: "story",
      title: "The Prediction Machine",
      subtitle: "Language Lab with WILL, WON'T, MIGHT, COULD",
      clilGoal: "Formulate scientific predictions with modal certainty.",
      languageGoal: "Modal verbs: WILL (certain), WON'T (negative), MIGHT (possible).",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Power up the Prediction Machine! Choose the best word to complete the scientific prediction.",
        spokenText: "Power up the Prediction Machine! Choose the best word to complete the sentence."
      },
      teacherGuide: {
        say: "Analyze each scenario: Is it certain (WILL), impossible (WON'T), or possible (MIGHT)?",
        do: "Tap the modal token button to slot it into the machine.",
        next: "Compare Green Valley Before and After the storm."
      },
      type: "prediction_machine",
      rounds: [
        {
          scenario: "🌊 The river is completely blocked with mud.",
          prefix: "The fish",
          blank: "______",
          suffix: "survive without clean water.",
          correctToken: "WON'T",
          tokens: ["WILL", "WON'T", "MIGHT"],
          explanation: "Fish need clean water with oxygen; they won't survive in heavy mud."
        },
        {
          scenario: "🌲 The rangers plant 50 new sapling trees.",
          prefix: "Suki the squirrel",
          blank: "______",
          suffix: "find a new safe home soon.",
          correctToken: "MIGHT",
          tokens: ["WON'T", "MIGHT", "WILL"],
          explanation: "With new trees growing, squirrels might find shelter soon."
        },
        {
          scenario: "🌱 Rabbits lose their grassland plants.",
          prefix: "The rabbits",
          blank: "______",
          suffix: "have less food to eat.",
          correctToken: "WILL",
          tokens: ["WILL", "WON'T", "MAY"],
          explanation: "Without plants, rabbits will definitely have less food."
        }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 24: Before and After (Interactive Comparison)
    // -----------------------------------------------------------------------
    {
      id: "s-before-and-after",
      number: 24,
      phase: "story",
      title: "Before and After",
      subtitle: "Ecosystem Data Comparison",
      clilGoal: "Analyze differences between healthy and damaged ecosystems.",
      languageGoal: "Comparative observation: 'Before... After...'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Compare Green Valley Before the Storm and After the Storm. What changed?",
        spokenText: "Compare the valley before and after the storm. What changed?"
      },
      teacherGuide: {
        say: "Compare the 4 indicators: Trees, Water, Plants, Animals.",
        do: "Ask: 'What changed in the environment? What will happen because of this?'",
        next: "Start the Animal Emergency Simulator."
      },
      type: "before_after_compare",
      beforeState: {
        title: "BEFORE THE STORM ✨",
        trees: "Tall, lush canopy 🌲🌲🌲",
        water: "Sparkling clean river & pond 🌊✨",
        plants: "Abundant flowering bushes 🌱🌱🌱",
        animals: "Safe, well-fed animals 🐿️🐇🦊"
      },
      afterState: {
        title: "AFTER THE STORM ⛈️",
        trees: "Broken branches & fallen trees 🌲💥",
        water: "Muddy river & drying pond 🌊🟤",
        plants: "Damaged ground plants 🌱🥀",
        animals: "Worried animals searching for food 🐾😟"
      },
      question: {
        prompt: "What is the main change in Green Valley?",
        options: [
          { id: "A", text: "There are fewer trees, less food, and dirty water.", correct: true },
          { id: "B", text: "There are more trees and cleaner water.", correct: false },
          { id: "C", text: "Nothing has changed in the jungle.", correct: false }
        ]
      },
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 25: Animal Emergency Simulator (4-Step Rescue)
    // -----------------------------------------------------------------------
    {
      id: "s-emergency-simulator",
      number: 25,
      phase: "story",
      title: "Animal Emergency Simulator",
      subtitle: "Predict ➔ Solve ➔ Act ➔ Consequence",
      clilGoal: "Apply scientific problem-solving to restore animal welfare.",
      languageGoal: "4-step method: 'If we build a shelter, the squirrel will survive.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Emergency Dispatch Active! Complete the 4 steps to help each animal.",
        spokenText: "Emergency dispatch active! Complete the 4 steps to help each animal."
      },
      teacherGuide: {
        say: "Walk through Step 1 (Predict), Step 2 (Solve), Step 3 (Act/Drag), Step 4 (Consequence).",
        do: "Let students execute emergency rescues for Squirrel and Frog.",
        next: "Enter the Final Ecosystem Crisis."
      },
      type: "emergency_simulator",
      missions: [
        {
          id: "mission-suki",
          animal: "squirrel",
          name: "Suki the Squirrel",
          problem: "Nest destroyed by fallen oak tree",
          step1_predict: {
            q: "What WILL happen if Suki has no shelter?",
            options: [
              { id: "A", text: "She WILL be in danger from predators.", correct: true },
              { id: "B", text: "She WILL fly to the clouds.", correct: false }
            ]
          },
          step2_solve: {
            q: "What could the Jungle Rangers build?",
            options: [
              { id: "A", text: "Build a wooden nest box in a safe cedar tree. 🪵", correct: true },
              { id: "B", text: "Build a concrete parking lot. 🚗", correct: false }
            ]
          },
          step3_drag: {
            item: "🪵 Nest Box",
            target: "🌲 Tall Cedar Tree"
          },
          consequence: "🎉 Suki climbs inside her new nest box safely!"
        },
        {
          id: "mission-poppy",
          animal: "frog",
          name: "Poppy the Frog",
          problem: "Pond water drained by storm mud",
          step1_predict: {
            q: "What MIGHT happen if Poppy's skin gets too dry?",
            options: [
              { id: "A", text: "Poppy MIGHT get weak and sick.", correct: true },
              { id: "B", text: "Poppy WILL become a desert camel.", correct: false }
            ]
          },
          step2_solve: {
            q: "What could we do to restore the pond?",
            options: [
              { id: "A", text: "Dig a clean rainwater channel into the wetland. 💧", correct: true },
              { id: "B", text: "Fill the pond with sand. 🏜️", correct: false }
            ]
          },
          step3_drag: {
            item: "💧 Clean Water Stream",
            target: "🐸 Poppy's Wetland"
          },
          consequence: "🎉 Poppy leaps onto a lush lily pad happily!"
        }
      ],
      healthChange: 15
    },

    // -----------------------------------------------------------------------
    // CHAPTER 26: The Final Ecosystem Crisis & 4 Final Challenges
    // -----------------------------------------------------------------------
    {
      id: "s-final-crisis-hub",
      number: 26,
      phase: "story",
      title: "The Final Ecosystem Crisis",
      subtitle: "Save Green Valley (4 Final Challenges)",
      clilGoal: "Synthesize all concepts: Habitats, Food, Food Chains, and Human Conservation.",
      languageGoal: "Comprehensive scientific communication and Final Ranger Report.",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Rangers, this is our biggest mission! Complete the 4 Final Challenges to restore Green Valley to 100% health!",
        spokenText: "Rangers, this is our biggest mission! Complete the 4 Final Challenges to save Green Valley!"
      },
      teacherGuide: {
        say: "Celebrate student progress! Guide the class through the 4 final challenges to reach 100% Jungle Health.",
        do: "Engage the whole class in voting and dragging.",
        next: "Complete the Final Ranger Speaking Report and award certificates."
      },
      type: "final_crisis_hub",
      healthChange: 20
    }
  ],

  // Final Challenges Full Data
  finalChallengesData: {
    c1_habitats: {
      title: "Challenge 1 — Restore Habitats 🏠",
      prompt: "Drag each animal to its suitable natural habitat:",
      items: [
        { id: "frog", name: "Frog", emoji: "🐸", target: "wetland" },
        { id: "squirrel", name: "Squirrel", emoji: "🐿️", target: "forest" },
        { id: "rabbit", name: "Rabbit", emoji: "🐇", target: "meadow" }
      ],
      targets: [
        { id: "forest", name: "Lush Forest", emoji: "🌲" },
        { id: "wetland", name: "Clean Wetland", emoji: "💧" },
        { id: "meadow", name: "Grassland Meadow", emoji: "🌾" }
      ]
    },
    c2_food: {
      title: "Challenge 2 — Restore Food Sources 🍎",
      prompt: "Match the food source to the hungry animal:",
      pairs: [
        { animalEmoji: "🐿️", animalName: "Squirrel", foodEmoji: "🌰", foodName: "Nuts" },
        { animalEmoji: "🐇", animalName: "Rabbit", foodEmoji: "🌿", foodName: "Plants" },
        { animalEmoji: "🐸", animalName: "Frog", foodEmoji: "🐛", foodName: "Insects" },
        { animalEmoji: "🐻", animalName: "Bear", foodEmoji: "🍓", foodName: "Berries" }
      ]
    },
    c3_chains: {
      title: "Challenge 3 — Rebuild Food Chains 🔗",
      prompt: "Connect the organisms to form the complete forest food chain:",
      chain1: ["🌱 Green Plant", "🐇 Pip the Rabbit", "🦊 Flash the Fox"],
      chain2: ["🌱 Oak Acorn", "🐿️ Suki the Squirrel", "🦉 Ollie the Owl"]
    },
    c4_decision: {
      title: "Challenge 4 — Save the Ecosystem 🌎",
      prompt: "What is the best human decision to protect Green Valley?",
      options: [
        { id: "A", text: "🌳 Protect the forest, plant trees, and keep rivers clean.", correct: true },
        { id: "B", text: "🗑️ Dump plastic and rubbish into the stream.", correct: false },
        { id: "C", text: "🏗️ Cut down all trees to build concrete factories.", correct: false }
      ]
    }
  },

  // Final Speaking Report Data (Chapter 30)
  speakingReport: {
    title: "Official Ranger Speaking Report",
    animals: [
      {
        id: "frog",
        name: "Frog",
        emoji: "🐸",
        habitat: "near ponds and wetlands",
        food: "insects and bugs",
        needs: "clean water for its skin",
        ifClause: "the pond dries",
        willAction: "look for another wet place",
        mightReason: "it needs moisture to survive"
      },
      {
        id: "squirrel",
        name: "Squirrel",
        emoji: "🐿️",
        habitat: "in tall forest trees",
        food: "nuts and seeds",
        needs: "tree hollows for shelter",
        ifClause: "a tree falls",
        willAction: "search for a new tree",
        mightReason: "it needs high shelter from predators"
      },
      {
        id: "rabbit",
        name: "Rabbit",
        emoji: "🐇",
        habitat: "in grasslands and burrows",
        food: "grass and green plants",
        needs: "plentiful vegetation and burrows",
        ifClause: "plants disappear",
        willAction: "have less food to eat",
        mightReason: "it depends on plants as a primary producer"
      },
      {
        id: "bear",
        name: "Bear",
        emoji: "🐻",
        habitat: "in the deep forest",
        food: "berries, roots, and fish",
        needs: "a large territory and plentiful food",
        ifClause: "the river has no fish",
        willAction: "forage for sweet berries",
        mightReason: "it can adapt its diet to survive"
      }
    ]
  }
};
