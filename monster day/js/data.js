/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Complete Game Data: Visual Exploration, Storyboard & CLIL Curriculum
   ========================================================================== */

window.JUNGLE_DATA = {
  // 16 Realistic Living Ecosystem Animals
  animals: {
    squirrel: { id: "squirrel", name: "Squirrel", emoji: "🐿️", habitat: "Forest / Oak Trees", food: "Nuts & Acorns", shelter: "Tree Hollow", desc: "Climbs trees and collects acorns." },
    frog: { id: "frog", name: "Frog", emoji: "🐸", habitat: "Pond & Wetlands", food: "Insects & Flies", shelter: "Lily Pads & Pond", desc: "Lives in water and catches insects." },
    fox: { id: "fox", name: "Fox", emoji: "🦊", habitat: "Forest & Meadow", food: "Rabbits & Mice", shelter: "Underground Den", desc: "A clever predator with red fur." },
    rabbit: { id: "rabbit", name: "Rabbit", emoji: "🐇", habitat: "Grassland & Meadow", food: "Green Grass & Plants", shelter: "Burrow", desc: "A gentle prey animal that hops." },
    bear: { id: "bear", name: "Bear", emoji: "🐻", habitat: "Deep Forest & Mountain", food: "Fish & Forest Berries", shelter: "Cave & Thicket", desc: "A strong omnivore that loves berries." },
    raccoon: { id: "raccoon", name: "Raccoon", emoji: "🦝", habitat: "Riverbank & Woods", food: "Fish & Clean Water", shelter: "Tree Hollow", desc: "A curious animal with a bandit mask." },
    owl: { id: "owl", name: "Owl", emoji: "🦉", habitat: "Tall Forest Trees", food: "Mice & Rodents", shelter: "High Tree Hollow", desc: "A nocturnal bird of prey." },
    eagle: { id: "eagle", name: "Eagle", emoji: "🦅", habitat: "Mountain Cliffs", food: "Fish & Small Prey", shelter: "Clifftop Nest", desc: "A majestic bird of prey." },
    deer: { id: "deer", name: "Deer", emoji: "🦌", habitat: "Forest & Meadow", food: "Leaves & Grass", shelter: "Forest Thicket", desc: "A graceful herbivore." },
    turtle: { id: "turtle", name: "Turtle", emoji: "🐢", habitat: "Pond & Riverbank", food: "Water Plants", shelter: "Hard Shell", desc: "Sunbathes on river rocks." },
    snake: { id: "snake", name: "Snake", emoji: "🐍", habitat: "Grassland & Forest", food: "Mice & Bugs", shelter: "Under Rocks", desc: "Slithers through tall grass." },
    butterfly: { id: "butterfly", name: "Butterfly", emoji: "🦋", habitat: "Flower Meadow", food: "Flower Nectar", shelter: "Under Leaf", desc: "A colorful pollinator." },
    bee: { id: "bee", name: "Bee", emoji: "🐝", habitat: "Meadow & Hives", food: "Pollen & Nectar", shelter: "Tree Hive", desc: "Makes sweet honey." },
    fish: { id: "fish", name: "Fish", emoji: "🐟", habitat: "Clean River & Pond", food: "Water Bugs", shelter: "Deep Currents", desc: "Swims in fresh streams." },
    hedgehog: { id: "hedgehog", name: "Hedgehog", emoji: "🦔", habitat: "Forest Floor", food: "Insects & Berries", shelter: "Leaf Pile", desc: "Rolls into a spiky ball." },
    bird: { id: "bird", name: "Small Bird", emoji: "🐦", habitat: "Forest Canopy", food: "Seeds & Berries", shelter: "Twig Nest", desc: "Sings in the trees." }
  },

  // 20 Visual Word Wall Vocabulary Cards
  wordWall: [
    { word: "SQUIRREL", icon: "🐿️", desc: "Climbs trees, eats nuts, has a bushy tail." },
    { word: "FROG", icon: "🐸", desc: "Lives in water, hops, catches insects." },
    { word: "RABBIT", icon: "🐇", desc: "Hops in grassland, eats plants, has long ears." },
    { word: "FOX", icon: "🦊", desc: "Forest predator, hunts rabbits, has red fur." },
    { word: "BEAR", icon: "🐻", desc: "Large mammal, eats fish and berries." },
    { word: "RACCOON", icon: "🦝", desc: "Curious river animal with a black mask." },
    { word: "OWL", icon: "🦉", desc: "Nocturnal hunter with large round eyes." },
    { word: "EAGLE", icon: "🦅", desc: "High flying bird of prey with sharp vision." },
    { word: "DEER", icon: "🦌", desc: "Gentle herbivore that grazes on leaves." },
    { word: "FISH", icon: "🐟", desc: "Swims in clean rivers and ponds." },
    { word: "TREE", icon: "🌳", desc: "Tall plant with branches, leaves, and wood." },
    { word: "PLANT", icon: "🌿", desc: "Green living organism; food for herbivores." },
    { word: "WATER", icon: "💧", desc: "Clean liquid all living things must drink." },
    { word: "FOOD", icon: "🍎", desc: "Nourishment animals eat for energy." },
    { word: "SHELTER", icon: "🏠", desc: "A safe place that protects from danger." },
    { word: "HABITAT", icon: "🏡", desc: "An animal's home that gives food and shelter." },
    { word: "PREDATOR", icon: "🦊", desc: "An animal that hunts and eats other animals." },
    { word: "PREY", icon: "🐇", desc: "An animal that is hunted by predators." },
    { word: "FOOD CHAIN", icon: "🔗", desc: "Shows how living things get energy." },
    { word: "ECOSYSTEM", icon: "🌎", desc: "A community where everything is connected." }
  ],

  // 27 Complete Interactive Scenes
  scenes: [
    // -----------------------------------------------------------------------
    // PHASE 1: VISUAL JUNGLE EXPLORATION & VOCABULARY ADVENTURE (1–13)
    // -----------------------------------------------------------------------
    {
      id: "s1-explore",
      num: 1,
      title: "Explore Green Valley",
      narrator: { speaker: "Chief Ranger Flora", text: "Welcome to Green Valley! Touch the animals to explore their home." },
      guide: { say: "Ask: 'What can you see? Can you find a frog? Can you find a squirrel?'", do: "Students tap animals on screen." },
      type: "open_explore",
      hotspots: [
        { id: "squirrel", name: "Squirrel 🐿️", x: 22, y: 35, emoji: "🐿️" },
        { id: "frog", name: "Frog 🐸", x: 68, y: 72, emoji: "🐸" },
        { id: "fox", name: "Fox 🦊", x: 42, y: 60, emoji: "🦊" },
        { id: "bird", name: "Bird 🐦", x: 82, y: 28, emoji: "🐦" },
        { id: "deer", name: "Deer 🦌", x: 88, y: 55, emoji: "🦌" }
      ]
    },
    {
      id: "s2-find-it",
      num: 2,
      title: "Find It! (Ranger Eyes)",
      narrator: { speaker: "Chief Ranger Flora", text: "Use your Ranger Eyes! Tap the 5 hidden animals in nature." },
      guide: { say: "Prompt: 'Find the frog! Find the squirrel!'", do: "Students tap each hidden animal." },
      type: "ranger_eyes",
      targets: ["frog", "squirrel", "fox", "owl", "rabbit"]
    },
    {
      id: "s3-who-am-i",
      num: 3,
      title: "Who Am I?",
      narrator: { speaker: "Chief Ranger Flora", text: "Look at the clues: I live in trees. I eat nuts. I am small. Who am I?" },
      guide: { say: "Read the visual clues aloud before revealing.", do: "Students guess and tap reveal." },
      type: "who_am_i",
      animalId: "squirrel",
      clues: ["🌳 I live in tall trees.", "🌰 I eat nuts and acorns.", "🐾 I have a bushy tail."],
      name: "SQUIRREL"
    },
    {
      id: "s4-where-live",
      num: 4,
      title: "Where Do I Live?",
      narrator: { speaker: "Chief Ranger Flora", text: "Tap an animal, then tap its home: Forest, Pond, River, or Grassland." },
      guide: { say: "Guide: 'Where does the frog live? In the pond!'", do: "Tap animal ➔ Tap biome." },
      type: "where_live",
      pairs: [
        { id: "frog", name: "Frog 🐸", target: "pond", targetName: "Pond 💧" },
        { id: "squirrel", name: "Squirrel 🐿️", target: "forest", targetName: "Forest 🌲" },
        { id: "fish", name: "Fish 🐟", target: "river", targetName: "River 🌊" },
        { id: "rabbit", name: "Rabbit 🐇", target: "grassland", targetName: "Grassland 🌾" }
      ]
    },
    {
      id: "s5-what-need",
      num: 5,
      title: "What Do I Need?",
      narrator: { speaker: "Chief Ranger Flora", text: "What does Suki need to survive? Tap Food, Water, and Shelter." },
      guide: { say: "Explain: 'Animals need food to eat, water to drink, and shelter to stay safe.'", do: "Tap the 3 survival items." },
      type: "what_need",
      items: [
        { id: "food", name: "FOOD 🌰", desc: "Energy to grow" },
        { id: "water", name: "WATER 💧", desc: "Clean water to drink" },
        { id: "shelter", name: "SHELTER 🌳", desc: "A safe place to rest" }
      ]
    },
    {
      id: "s6-homes",
      num: 6,
      title: "Animal Homes (Shelter)",
      narrator: { speaker: "Chief Ranger Flora", text: "A shelter is a safe home. Match each animal to its shelter." },
      guide: { say: "Teach: 'SHELTER = A safe place.'", do: "Observe animals entering their safe shelters." },
      type: "homes",
      pairs: [
        { animal: "Bird 🐦", shelter: "Nest 🪺" },
        { animal: "Fox 🦊", shelter: "Den 🕳️" },
        { animal: "Rabbit 🐇", shelter: "Burrow 🕳️" },
        { animal: "Squirrel 🐿️", shelter: "Tree Hollow 🌳" }
      ]
    },
    {
      id: "s7-habitat",
      num: 7,
      title: "Discover Habitat",
      narrator: { speaker: "Chief Ranger Flora", text: "Water + plants + insects = The frog's HABITAT (an animal's home)." },
      guide: { say: "Emphasize: 'HABITAT = An animal's home.'", do: "Repeat the sentence frame." },
      type: "habitat_reveal"
    },
    {
      id: "s8-food",
      num: 8,
      title: "Discover Food (Feeding)",
      narrator: { speaker: "Chief Ranger Flora", text: "Feed the hungry animals! Tap Food ➔ Tap Animal." },
      guide: { say: "Ask: 'What does the squirrel eat? Nuts!'", do: "Tap food ➔ tap animal to feed." },
      type: "food_feeder",
      pairs: [
        { animalId: "squirrel", animal: "Squirrel 🐿️", foodEmoji: "🌰", foodName: "Nuts" },
        { animalId: "frog", animal: "Frog 🐸", foodEmoji: "🪲", foodName: "Insects" },
        { animalId: "rabbit", animal: "Rabbit 🐇", foodEmoji: "🌿", foodName: "Plants" },
        { animalId: "owl", animal: "Owl 🦉", foodEmoji: "🐭", foodName: "Mice" }
      ]
    },
    {
      id: "s9-predator-prey",
      num: 9,
      title: "Who Eats Who?",
      narrator: { speaker: "Chief Ranger Flora", text: "The rabbit eats the plant. The fox hunts the rabbit. Fox = PREDATOR. Rabbit = PREY." },
      guide: { say: "Highlight: 'Predator hunts. Prey is hunted.'", do: "Tap Fox and Rabbit to see roles." },
      type: "predator_prey"
    },
    {
      id: "s10-food-chain",
      num: 10,
      title: "Build a Food Chain",
      narrator: { speaker: "Chief Ranger Flora", text: "Build the food chain in order: 1. Plant 🌱 ➔ 2. Rabbit 🐇 ➔ 3. Fox 🦊." },
      guide: { say: "Prompt the order: Plant ➔ Rabbit ➔ Fox.", do: "Tap cards in order 1, 2, 3." },
      type: "food_chain"
    },
    {
      id: "s11-ecosystem",
      num: 11,
      title: "Discover Ecosystem",
      narrator: { speaker: "Chief Ranger Flora", text: "Everything in Green Valley is connected. This is an ECOSYSTEM." },
      guide: { say: "Chant: 'Everything is connected!'", do: "View the glowing ecosystem map." },
      type: "ecosystem_map"
    },
    {
      id: "s12-word-wall",
      num: 12,
      title: "Visual Word Wall",
      narrator: { speaker: "Chief Ranger Flora", text: "Here is your Visual Word Wall! Tap any word to hear and see it." },
      guide: { say: "Review key words before the story begins.", do: "Tap vocabulary cards." },
      type: "word_wall_view"
    },
    {
      id: "s13-story-preview",
      num: 13,
      title: "Story Preview: The Coming Storm",
      narrator: { speaker: "Chief Ranger Flora", text: "Look at the 4 story cards: A storm is coming! What do you think will happen?" },
      guide: { say: "Encourage prediction: 'I think...'", do: "Tap 'Enter The Great Storm'." },
      type: "story_preview"
    },

    // -----------------------------------------------------------------------
    // PHASE 2: MAIN STORY & RANGER RESCUE MISSIONS (14–27)
    // -----------------------------------------------------------------------
    {
      id: "s14-storm",
      num: 14,
      title: "The Great Storm",
      narrator: { speaker: "Chief Ranger Flora", text: "Oh no! A huge storm has hit Green Valley! Trees have fallen and water is dirty!" },
      guide: { say: "Dramatic storm event!", do: "Tap 'Start Rescue Mission'." },
      type: "storm_event"
    },
    {
      id: "s15-suki-tree",
      num: 15,
      title: "Suki's Tree is Gone",
      narrator: { speaker: "Chief Ranger Flora", text: "Suki's tree has fallen (🌳 💥). What WILL happen to Suki?" },
      guide: { say: "Emphasize 'WILL' for a strong prediction.", do: "Students tap the correct choice." },
      type: "prediction",
      options: [
        { id: "A", text: "She WILL lose her shelter.", correct: true },
        { id: "B", text: "She WILL live underwater.", correct: false },
        { id: "C", text: "She WILL become a fish.", correct: false }
      ]
    },
    {
      id: "s16-suki-home",
      num: 16,
      title: "Find Suki a New Home",
      narrator: { speaker: "Chief Ranger Flora", text: "Tap Suki ➔ Tap the Forest to give her a safe home with trees and food." },
      guide: { say: "Guide Suki to the forest habitat.", do: "Tap Suki ➔ Tap Forest." },
      type: "suki_habitat"
    },
    {
      id: "s17-rico-water",
      num: 17,
      title: "Rico the Raccoon",
      narrator: { speaker: "Chief Ranger Flora", text: "The river is dirty with mud (🌊 ➔ 🟤). What MIGHT happen to Rico?" },
      guide: { say: "Highlight MIGHT for possibility.", do: "Tap the correct prediction." },
      type: "prediction",
      options: [
        { id: "A", text: "Rico MIGHT have trouble finding clean water.", correct: true },
        { id: "B", text: "Rico WILL become a fish.", correct: false },
        { id: "C", text: "Rico WON'T need water.", correct: false }
      ]
    },
    {
      id: "s18-poppy-pond",
      num: 18,
      title: "Poppy the Frog",
      narrator: { speaker: "Chief Ranger Flora", text: "Poppy's pond is drying! IF the pond dries, what WILL happen?" },
      guide: { say: "Teach: 'IF + condition, animal + WILL + action.'", do: "Choose prediction." },
      type: "prediction",
      options: [
        { id: "A", text: "Poppy WILL look for another wet place.", correct: true },
        { id: "B", text: "Poppy WILL live in the desert.", correct: false }
      ]
    },
    {
      id: "s19-boris-berries",
      num: 19,
      title: "Boris the Bear",
      narrator: { speaker: "Chief Ranger Flora", text: "The river has no fish (🐟 ❌). What MIGHT Boris do?" },
      guide: { say: "Animals can adapt their diet.", do: "Choose prediction." },
      type: "prediction",
      options: [
        { id: "A", text: "Boris MAY look for sweet forest berries.", correct: true },
        { id: "B", text: "Boris WILL eat river stones.", correct: false }
      ]
    },
    {
      id: "s20-detective",
      num: 20,
      title: "Ranger Detective",
      narrator: { speaker: "Chief Ranger Flora", text: "Read the clues: I live in trees. I eat nuts. Who am I?" },
      guide: { say: "Deduce the mystery animal.", do: "Tap the matching animal." },
      type: "detective_mystery",
      options: [
        { id: "squirrel", emoji: "🐿️", name: "Squirrel", correct: true },
        { id: "frog", emoji: "🐸", name: "Frog", correct: false },
        { id: "owl", emoji: "🦉", name: "Owl", correct: false }
      ]
    },
    {
      id: "s21-first",
      num: 21,
      title: "What Happened First?",
      narrator: { speaker: "Chief Ranger Flora", text: "Look at the sequence: 1. Storm ➔ 2. Tree Falls ➔ 3. Suki loses home ➔ 4. Searches home." },
      guide: { say: "Review cause-and-effect timeline.", do: "Observe the sequence." },
      type: "timeline_view"
    },
    {
      id: "s22-plant-loss",
      num: 22,
      title: "The Bigger Problem",
      narrator: { speaker: "Chief Ranger Flora", text: "Plants are disappearing! When plants decrease, what will happen to rabbits and foxes?" },
      guide: { say: "Highlight ecosystem cascade.", do: "Tap prediction." },
      type: "prediction",
      options: [
        { id: "A", text: "Rabbits WILL have less food, and foxes MIGHT have less prey.", correct: true },
        { id: "B", text: "Nothing will change.", correct: false }
      ]
    },
    {
      id: "s23-machine",
      num: 23,
      title: "The Prediction Machine",
      narrator: { speaker: "Chief Ranger Flora", text: "Tap the best word: The fish [ ______ ] survive without clean water." },
      guide: { say: "Choose WILL, WON'T, or MIGHT.", do: "Tap token button." },
      type: "prediction_token",
      tokens: ["WON'T", "WILL", "MIGHT"],
      correct: "WON'T"
    },
    {
      id: "s24-before-after",
      num: 24,
      title: "Before and After",
      narrator: { speaker: "Chief Ranger Flora", text: "Compare Green Valley Before the Storm and After the Storm. What changed?" },
      guide: { say: "Compare healthy vs damaged state.", do: "Tap correct analysis." },
      type: "prediction",
      options: [
        { id: "A", text: "There are fewer trees, less food, and dirty water.", correct: true },
        { id: "B", text: "There is more food and cleaner water.", correct: false }
      ]
    },
    {
      id: "s25-emergency-sim",
      num: 25,
      title: "Animal Emergency Simulator",
      narrator: { speaker: "Chief Ranger Flora", text: "What could the Jungle Rangers build to give Suki a safe shelter?" },
      guide: { say: "Solve the animal emergency.", do: "Tap the solution." },
      type: "prediction",
      options: [
        { id: "A", text: "Build a wooden nest box in a safe tree. 🪵", correct: true },
        { id: "B", text: "Build a concrete factory. 🏗️", correct: false }
      ]
    },
    {
      id: "s26-final-crisis",
      num: 26,
      title: "Save Green Valley",
      narrator: { speaker: "Chief Ranger Flora", text: "What is the best human decision to protect Green Valley?" },
      guide: { say: "Guide conservation decision.", do: "Tap conservation decision." },
      type: "prediction",
      options: [
        { id: "A", text: "🌳 Protect the forest, plant trees, and keep rivers clean!", correct: true },
        { id: "B", text: "🗑️ Throw rubbish in the stream.", correct: false }
      ]
    },
    {
      id: "s27-report",
      num: 27,
      title: "Final Ranger Speaking Studio",
      narrator: { speaker: "Chief Ranger Flora", text: "Congratulations Rangers! Present your official speaking report!" },
      guide: { say: "Have students speak aloud using the sentence frames.", do: "Read report and earn certificate." },
      type: "speaking_studio"
    }
  ]
};
