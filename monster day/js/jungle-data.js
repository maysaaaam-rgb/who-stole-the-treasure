/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Complete Game Data, Storyboard, CLIL Curriculum & Teacher Guide Scripts
   ========================================================================== */

window.JUNGLE_DATA = {
  // Vocabulary Dictionary for Quick Reference
  dictionary: {
    HABITAT: {
      word: "HABITAT",
      icon: "🏠",
      definition: "A habitat is the place where an animal lives and finds what it needs."
    },
    PREDATOR: {
      word: "PREDATOR",
      icon: "🦊",
      definition: "A predator hunts other animals for food."
    },
    PREY: {
      word: "PREY",
      icon: "🐇",
      definition: "Prey is an animal that is hunted and eaten by predators."
    },
    ECOSYSTEM: {
      word: "ECOSYSTEM",
      icon: "🌎",
      definition: "Living things depend on each other and their environment."
    },
    SURVIVE: {
      word: "SURVIVE",
      icon: "💚",
      definition: "To stay alive by finding food, water, and shelter."
    }
  },

  // Animal Character Roster
  animals: {
    squirrel: {
      id: "squirrel",
      name: "Suki the Squirrel",
      emoji: "🐿️",
      role: "Forest Herbivore",
      habitat: "Forest / Tall Trees",
      food: "Nuts & Seeds",
      needs: "Trees for shelter, nuts for food, clean water",
      predators: ["Owl", "Fox"],
      status: "Lost her tree shelter in the storm"
    },
    raccoon: {
      id: "raccoon",
      name: "Rico the Raccoon",
      emoji: "🦝",
      role: "River Omnivore",
      habitat: "Riverbank / Forest Edge",
      food: "Berries, Fish & Clean Water",
      needs: "Clean drinking water and forest shelter",
      predators: ["Coyote", "Eagle"],
      status: "Cannot drink dirty flood water"
    },
    frog: {
      id: "frog",
      name: "Poppy the Frog",
      emoji: "🐸",
      role: "Wetland Amphibian",
      habitat: "Pond / Wetlands",
      food: "Insects & Bugs",
      needs: "Moist clean water and lily pads",
      predators: ["Eagle", "Fox"],
      status: "Her pond is drying up"
    },
    bear: {
      id: "bear",
      name: "Boris the Bear",
      emoji: "🐻",
      role: "Forest Giant (Omnivore)",
      habitat: "Deep Forest & Mountain",
      food: "Fish & Sweet Forest Berries",
      needs: "Abundant food and cave/woodland shelter",
      predators: ["None (Top of local chain)"],
      status: "Cannot find fish in the muddy river"
    },
    rabbit: {
      id: "rabbit",
      name: "Pip the Rabbit",
      emoji: "🐇",
      role: "Grassland Prey",
      habitat: "Meadow & Grassland Burrows",
      food: "Green Plants & Grasses",
      needs: "Plentiful plants and underground burrows",
      predators: ["Fox", "Owl", "Eagle"],
      status: "Plants are disappearing"
    },
    fox: {
      id: "fox",
      name: "Flash the Fox",
      emoji: "🦊",
      role: "Forest Predator",
      habitat: "Forest & Meadow Edge",
      food: "Rabbits & Small Rodents",
      needs: "Hunting ground and den",
      predators: ["Bear / Coyote"],
      status: "Needs prey to survive"
    },
    owl: {
      id: "owl",
      name: "Ollie the Owl",
      emoji: "🦉",
      role: "Nocturnal Predator",
      habitat: "Hollow Trees",
      food: "Mice & Insects",
      needs: "High tree perch and small prey",
      predators: ["Eagle"],
      status: "Watching the forest recovery"
    }
  },

  // 17 Story Chapters + Final Challenges
  chapters: [
    // -----------------------------------------------------------------------
    // CHAPTER 1: Welcome to Green Valley
    // -----------------------------------------------------------------------
    {
      id: "chap-1",
      number: 1,
      title: "Welcome to Green Valley",
      subtitle: "Discover Basic Animal Needs",
      clilGoal: "Animals have 3 basic needs to survive: Food, Water, and Shelter.",
      languageGoal: "Needs vocabulary + 'Animals need... to survive.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Welcome to Green Valley! Many animals live here happily. What do animals need to survive?",
        spokenText: "Welcome to Green Valley! Many animals live here. What do animals need to survive?"
      },
      teacherGuide: {
        say: "Look at Green Valley! Ask the class: 'What do animals need to survive every day?'",
        do: "Have a student come to the whiteboard and drag the 3 survival needs around Suki.",
        next: "Once all 3 items are placed, present the Jungle Ranger Badge!"
      },
      type: "needs_wheel",
      targetAnimal: "squirrel",
      requiredItems: ["food", "water", "shelter"],
      availableItems: [
        { id: "food", name: "Food", emoji: "🍎", label: "Nutritious Food", correct: true },
        { id: "water", name: "Water", emoji: "💧", label: "Clean Water", correct: true },
        { id: "shelter", name: "Shelter", emoji: "🏠", label: "Safe Shelter", correct: true },
        { id: "toy", name: "Toy", emoji: "⚽", label: "Plastic Toy", correct: false },
        { id: "tv", name: "Screen", emoji: "📺", label: "Television", correct: false }
      ],
      successMessage: "Great job! You are ready to become Jungle Rangers! 🎖️",
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 2: The Great Storm
    // -----------------------------------------------------------------------
    {
      id: "chap-2",
      number: 2,
      title: "The Great Storm",
      subtitle: "A Major Ecological Emergency",
      clilGoal: "A natural disaster damages habitats, water sources, and food.",
      languageGoal: "Past tense & emergency alert: 'A storm has changed the valley!'",
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
    // CHAPTER 3: Suki the Squirrel
    // -----------------------------------------------------------------------
    {
      id: "chap-3",
      number: 3,
      title: "Suki the Squirrel",
      subtitle: "Predicting with WILL (Strong Expectation)",
      clilGoal: "When shelter is destroyed, animals cannot stay safe without help.",
      languageGoal: "Predicting with WILL: 'Suki will lose her shelter.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Suki has lost her home! What WILL happen to Suki after the storm?",
        spokenText: "Suki has lost her home! What will happen to Suki?"
      },
      teacherGuide: {
        say: "Emphasize 'WILL' for a certain prediction. 'What WILL happen to Suki?'",
        do: "Have students predict in pairs: 'She will...' before choosing on screen.",
        next: "Next, provide Suki with what she needs to recover."
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
    // CHAPTER 4: Find Suki a New Home
    // -----------------------------------------------------------------------
    {
      id: "chap-4",
      number: 4,
      title: "Find Suki a New Home",
      subtitle: "Suitable Habitat Matching",
      clilGoal: "A habitat is a place that provides suitable food, water, and shelter.",
      languageGoal: "Reasoning with BECAUSE: 'The forest is best BECAUSE it has trees and nuts.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Drag Suki to the best habitat. Why is this habitat suitable for her?",
        spokenText: "Drag Suki to the best habitat. Where can she find trees and food?"
      },
      teacherGuide: {
        say: "Point to each habitat: Forest, River, Desert. Ask: 'Where can a squirrel climb and find nuts?'",
        do: "A student drags Suki to the Forest habitat on the whiteboard.",
        next: "Reinforce the word HABITAT with the on-screen card."
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
      conceptCard: {
        title: "HABITAT 🏠",
        text: "A habitat is the place where an animal lives and gets everything it needs."
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 5: Rico the Raccoon
    // -----------------------------------------------------------------------
    {
      id: "chap-5",
      number: 5,
      title: "Rico the Raccoon",
      subtitle: "Predicting with MIGHT (Possibility) & Water Quality",
      clilGoal: "Animals need clean water; polluted water threatens survival.",
      languageGoal: "Predicting with MIGHT: 'Rico MIGHT have trouble finding clean water.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look at the river! The storm washed thick mud into the water. What MIGHT happen if the river stays dirty?",
        spokenText: "Look at the river! The water is dirty. What might happen to Rico?"
      },
      teacherGuide: {
        say: "Highlight MIGHT / COULD for possible danger: 'Rico might get sick or thirsty.'",
        do: "Ask: 'What could the Rangers do to help Rico get clean water?'",
        next: "Lead students to choose the environmental solution."
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
    // CHAPTER 6: Poppy the Frog
    // -----------------------------------------------------------------------
    {
      id: "chap-6",
      number: 6,
      title: "Poppy the Frog",
      subtitle: "Conditional Predictions (IF + RESULT)",
      clilGoal: "Amphibians require wet environments for moist skin and breeding.",
      languageGoal: "IF + RESULT: 'IF the pond dries, Poppy WILL look for water.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Poppy's pond is drying up! IF the pond dries completely, what WILL happen?",
        spokenText: "Poppy's pond is drying up! If the pond dries completely, what will happen?"
      },
      teacherGuide: {
        say: "Teach the pattern: 'IF + condition, animal + WILL / MIGHT + action.'",
        do: "Students repeat the sentence chorus: 'If the pond dries, the frog will look for water.'",
        next: "Drag Poppy to the healthy freshwater wetland."
      },
      type: "prediction_choice",
      badge: { text: "IF + CONSEQUENCE", type: "if" },
      options: [
        { id: "A", text: "Poppy WILL look for another wet place.", correct: true, feedback: "Super! Frogs must stay moist and near water to survive." },
        { id: "B", text: "Poppy WILL eat tree branches.", correct: false, feedback: "Frogs eat insects, not tree wood!" },
        { id: "C", text: "Poppy WILL live in the desert.", correct: false, feedback: "The desert is too dry for frogs." }
      ],
      subTask: {
        prompt: "Drag Poppy the Frog to the fresh wetland pond:",
        targetId: "wetland_pond"
      },
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 7: Boris the Bear
    // -----------------------------------------------------------------------
    {
      id: "chap-7",
      number: 7,
      title: "Boris the Bear",
      subtitle: "Adapting Foraging & Food Changes",
      clilGoal: "When a food source is unavailable, animals may change where or what they eat.",
      languageGoal: "MAY / MIGHT: 'Boris MAY look for another food source.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Boris usually catches fish in the river, but now there are no fish (🐟 ❌). What MIGHT Boris do?",
        spokenText: "Boris cannot find fish in the river. What might Boris do?"
      },
      teacherGuide: {
        say: "Explain: 'When food changes, animals change their behavior to survive.'",
        do: "Tap the bushes to reveal ripe wild berries 🍓 for Boris.",
        next: "Introduce the diet concept: Boris is an omnivore."
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
    // CHAPTER 8: Ranger Detective
    // -----------------------------------------------------------------------
    {
      id: "chap-8",
      number: 8,
      title: "Ranger Detective",
      subtitle: "Deduce Animals from Habitat + Food + Needs",
      clilGoal: "Identify animals based on their ecological niche, diet, and shelter.",
      languageGoal: "Describing clues: 'I live in... I eat... I need... Who am I?'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Put on your detective hats, Rangers! Read the clues about habitat, diet, and needs to find the mystery animal.",
        spokenText: "Put on your detective hats! Read the clues to find the mystery animal."
      },
      teacherGuide: {
        say: "Read clue 1, clue 2, clue 3 aloud with the class before asking 'Who am I?'",
        do: "Have a student tap the matching animal avatar.",
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
            { id: "squirrel", emoji: "🐿️", name: "Suki the Squirrel", correct: true },
            { id: "frog", emoji: "🐸", name: "Poppy the Frog", correct: false },
            { id: "eagle", emoji: "🦅", name: "Cora the Eagle", correct: false }
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
            { id: "frog", emoji: "🐸", name: "Poppy the Frog", correct: true },
            { id: "bear", emoji: "🐻", name: "Boris the Bear", correct: false },
            { id: "owl", emoji: "🦉", name: "Ollie the Owl", correct: false }
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
            { id: "owl", emoji: "🦉", name: "Ollie the Owl", correct: true },
            { id: "rabbit", emoji: "🐇", name: "Pip the Rabbit", correct: false },
            { id: "raccoon", emoji: "🦝", name: "Rico the Raccoon", correct: false }
          ]
        }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 9: Feed the Animals
    // -----------------------------------------------------------------------
    {
      id: "chap-9",
      number: 9,
      title: "Feed the Animals",
      subtitle: "Animal Diets & Herbivore / Carnivore / Omnivore Matching",
      clilGoal: "Different animals have specific dietary needs to survive.",
      languageGoal: "Action sentences: 'The squirrel eats nuts.' 'The frog eats insects.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "The animals are hungry after the storm. Drag the correct food to each animal!",
        spokenText: "The animals are hungry. Drag the correct food to each animal!"
      },
      teacherGuide: {
        say: "Call different students to the board to feed each hungry animal.",
        do: "Ask: 'What does the rabbit eat? What does the owl hunt?'",
        next: "Observe the happy munching sound effects for each animal."
      },
      type: "feed_matcher",
      pairs: [
        { animal: "squirrel", animalName: "Squirrel", animalEmoji: "🐿️", food: "nuts", foodEmoji: "🌰", foodName: "Nuts" },
        { animal: "frog", animalName: "Frog", animalEmoji: "🐸", food: "insects", foodEmoji: "🐛", foodName: "Insects" },
        { animal: "rabbit", animalName: "Rabbit", animalEmoji: "🐇", food: "plants", foodEmoji: "🌿", foodName: "Green Plants" },
        { animal: "owl", animalName: "Owl", animalEmoji: "🦉", food: "mice", foodEmoji: "🐭", foodName: "Mice" },
        { animal: "bear", animalName: "Bear", animalEmoji: "🐻", food: "berries", foodEmoji: "🍓", foodName: "Berries / Fish" }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 10: What Happens First?
    // -----------------------------------------------------------------------
    {
      id: "chap-10",
      number: 10,
      title: "What Happens First?",
      subtitle: "Cause and Effect Chronology",
      clilGoal: "Environmental disturbances trigger a sequence of consequences.",
      languageGoal: "Sequencing words: First, Then, Next, Finally.",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Put the events in the correct chronological order to understand cause and effect.",
        spokenText: "Put the events in the correct order: First, Then, Next, Finally."
      },
      teacherGuide: {
        say: "Guide students: 'What happened first? The storm! What happened next?'",
        do: "Drag the 4 cards into boxes 1, 2, 3, 4.",
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
    // CHAPTER 11: The Bigger Problem
    // -----------------------------------------------------------------------
    {
      id: "chap-11",
      number: 11,
      title: "The Bigger Problem",
      subtitle: "Primary Producers & Plant Dependency",
      clilGoal: "Plants are the foundation of food webs; losing plants threatens herbivores.",
      languageGoal: "Reasoning: 'Animals need plants BECAUSE plants are their primary food.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Look closely at the forest floor: many plants are disappearing (🌱🌱 → 🌱). Why is this a serious problem?",
        spokenText: "Many plants are disappearing. Why is this a serious problem?"
      },
      teacherGuide: {
        say: "Explain: 'Rabbits and squirrels eat plants and seeds. If plants die, what do they eat?'",
        do: "Show the visual links: Plants feed Rabbits and Squirrels.",
        next: "Move into constructing the food chain."
      },
      type: "prediction_choice",
      badge: { text: "BECAUSE = Scientific Reasoning", type: "if" },
      options: [
        { id: "A", text: "Some animals depend on plants for food.", correct: true, feedback: "Correct! Herbivores need plants to survive." },
        { id: "B", text: "Animals do not need food to live.", correct: false, feedback: "All animals must have food for energy." },
        { id: "C", text: "Plants are only for decoration.", correct: false, feedback: "Plants are living producers, not decorations!" }
      ],
      visualLinks: [
        { from: "🌱 Plants", to: "🐇 Pip the Rabbit", label: "eats plants" },
        { from: "🌱 Plants", to: "🐿️ Suki the Squirrel", label: "eats seeds & nuts" }
      ],
      healthChange: 5
    },

    // -----------------------------------------------------------------------
    // CHAPTER 12: Build the Food Chain
    // -----------------------------------------------------------------------
    {
      id: "chap-12",
      number: 12,
      title: "Build the Food Chain",
      subtitle: "Producers, Prey & Predators",
      clilGoal: "Food chains show how energy moves: Plant (Producer) → Rabbit (Prey) → Fox (Predator).",
      languageGoal: "Prey & Predator definitions: 'The rabbit eats the plant. The fox eats the rabbit.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Build the food chain by dragging the cards into the correct order. Who eats what?",
        spokenText: "Build the food chain! Drag the cards into order: Producer, Prey, Predator."
      },
      teacherGuide: {
        say: "Introduce: 'PREY is hunted. PREDATOR hunts.'",
        do: "Students drag 🌱 Plant ➔ 🐇 Rabbit ➔ 🦊 Fox into the slots.",
        next: "Check the arrows showing energy flow."
      },
      type: "food_chain_builder",
      slots: [
        { pos: 1, role: "Producer", tagClass: "tag-producer", correctId: "plant" },
        { pos: 2, role: "Prey", tagClass: "tag-prey", correctId: "rabbit" },
        { pos: 3, role: "Predator", tagClass: "tag-predator", correctId: "fox" }
      ],
      availableCards: [
        { id: "rabbit", name: "Rabbit", emoji: "🐇", role: "Prey (Herbivore)" },
        { id: "plant", name: "Green Plant", emoji: "🌱", role: "Producer" },
        { id: "fox", name: "Fox", emoji: "🦊", role: "Predator (Carnivore)" }
      ],
      vocabulary: [
        { word: "PREY 🐇", desc: "An animal that is hunted and eaten by others." },
        { word: "PREDATOR 🦊", desc: "An animal that hunts other animals for food." }
      ],
      healthChange: 10
    },

    // -----------------------------------------------------------------------
    // CHAPTER 13: One Change Affects Others
    // -----------------------------------------------------------------------
    {
      id: "chap-13",
      number: 13,
      title: "One Change Affects Others",
      subtitle: "Ecosystem Interdependence & Cascade",
      clilGoal: "Living things depend on each other. A decrease in plants affects all higher trophic levels.",
      languageGoal: "Conditional chains: 'If there are fewer plants, rabbits will have less food, and foxes might have less prey.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "When plants decrease (🌱 ↓), what WILL happen to the rabbits? And what MIGHT happen to the foxes?",
        spokenText: "If there are fewer plants, what will happen to the rabbits and the foxes?"
      },
      teacherGuide: {
        say: "This is the core CLIL science concept: Interdependence in an ecosystem.",
        do: "Use the interactive slider to decrease plants and watch rabbits and foxes react.",
        next: "Have students recite: 'Living things depend on each other.'"
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
    // CHAPTER 14: The Prediction Machine
    // -----------------------------------------------------------------------
    {
      id: "chap-14",
      number: 14,
      title: "The Prediction Machine",
      subtitle: "Interactive Language Lab (WILL, WON'T, MIGHT, COULD)",
      clilGoal: "Formulate scientific predictions with modal certainty.",
      languageGoal: "Practicing WILL (certain), WON'T (negative certainty), MIGHT/COULD (possibility).",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Power up the Jungle Prediction Machine! Choose the correct modal word to complete each scientific prediction.",
        spokenText: "Power up the Prediction Machine! Choose the best word to complete the sentence."
      },
      teacherGuide: {
        say: "Ask students to analyze whether the result is certain (WILL), impossible (WON'T), or possible (MIGHT).",
        do: "Students tap the modal token button to slot it into the machine.",
        next: "The machine lights up and plays a mechanical gear chime!"
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
    // CHAPTER 15: Before and After
    // -----------------------------------------------------------------------
    {
      id: "chap-15",
      number: 15,
      title: "Before and After",
      subtitle: "Ecosystem Comparison & Analysis",
      clilGoal: "Analyze visual data showing healthy vs damaged ecosystems.",
      languageGoal: "Comparative observation: 'Before, there were... After, there are...'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Compare Green Valley Before the Storm and After the Storm. What changed?",
        spokenText: "Compare the valley before and after the storm. What changed?"
      },
      teacherGuide: {
        say: "Look at the side-by-side comparison: Trees, Water, Food, Animals.",
        do: "Ask: 'What changed in the environment? What will happen because of this?'",
        next: "Transition to active animal emergency rescue operations."
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
    // CHAPTER 16: Animal Emergency Simulator
    // -----------------------------------------------------------------------
    {
      id: "chap-16",
      number: 16,
      title: "Animal Emergency Simulator",
      subtitle: "4-Step Ranger Rescue Dispatch",
      clilGoal: "Apply the 4-step scientific method: Predict ➔ Solve ➔ Act ➔ Consequence.",
      languageGoal: "Multi-step reasoning: 'If we do X, the animal will Y.'",
      narrator: {
        speaker: "Chief Ranger Flora",
        text: "Emergency Dispatch Active! Complete the 4 steps for each animal emergency to restore the valley.",
        spokenText: "Emergency dispatch active! Complete the 4 steps to help each animal."
      },
      teacherGuide: {
        say: "Walk through Step 1 (Predict), Step 2 (Solve), Step 3 (Act/Drag), Step 4 (Consequence).",
        do: "Let students take turns executing the emergency rescues for Squirrel, Frog, Raccoon, Bear, and Rabbit.",
        next: "Prepare for the Final Ecosystem Crisis."
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
    // CHAPTER 17: The Final Ecosystem Crisis & 4 Final Challenges
    // -----------------------------------------------------------------------
    {
      id: "chap-17",
      number: 17,
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
      challenges: [
        { id: "c1", title: "Challenge 1: Restore Habitats", status: "ready" },
        { id: "c2", title: "Challenge 2: Restore Food Sources", status: "locked" },
        { id: "c3", title: "Challenge 3: Rebuild Food Chains", status: "locked" },
        { id: "c4", title: "Challenge 4: Environmental Decision", status: "locked" }
      ],
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
