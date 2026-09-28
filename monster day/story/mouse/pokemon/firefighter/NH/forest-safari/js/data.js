/**
 * FOREST RANGER PET SAFARI: TWO DIFFERENT FORESTS
 * Curriculum & Lesson Engine Data (A1+ Kids, Ages 7-10)
 * Lesson 1: The Magic Leaf Forest (Deciduous)
 * Lesson 2: The Deep Freeze Evergreen Forest (Coniferous)
 */

(function(root) {
  'use strict';

  const FOREST_SAFARI_DATA = {
    meta: {
      id: "forest-safari",
      title: "🌲 Forest Ranger Pet Safari",
      subtitle: "Two Different Forests: Deciduous vs. Coniferous Biomes",
      grade: "A1+ Kids (Ages 7–10)",
      framework: "ESL / CLIL Science & Biome Exploration",
      totalMissions: 14,
      totalXP: 350
    },

    slides: [
      // ==========================================
      // LESSON 1: THE MAGIC LEAF FOREST (DECIDUOUS)
      // ==========================================
      {
        id: "l1_s1",
        lessonId: 1,
        lessonTitle: "Lesson 1: The Magic Leaf Forest",
        slideNum: 1,
        title: "Mission Start – Mystery River Ride",
        timing: "00:00 - 04:00 (4 mins)",
        modality: "[TPR] & [SPEAK]",
        teacherPrompt: "Call on students to spot the brown bear. Ask the class to stamp a ⭐ on the bear's nose and roar like a bear on camera!",
        voicePersona: "Sarah",
        voiceStyle: "Playful, smiling, slow cadence, max 4 words per burst",
        ssml: `<speak>
  <prosody rate="80%">
    Look at the river! <break time="300ms"/> 
    A boat! <break time="300ms"/> 
    And look! <break time="200ms"/> A big brown bear! <break time="400ms"/>
    Can you spot the bear?
  </prosody>
</speak>`,
        imageSrc: "assets/river_bear_boat.jpg",
        imageAlt: "Safari river expedition boat with researchers in yellow vests and a swimming brown bear",
        type: "river_ride_opener",
        scaffoldLines: [
          { icon: "🛶", text: "I see a boat." },
          { icon: "🐻", text: "I see a bear!" }
        ],
        badgeEarned: {
          id: "boat_badge",
          name: "Boat Badge",
          icon: "🛶",
          desc: "Ranger Checkpoint 1 Cleared"
        }
      },
      {
        id: "l1_s2",
        lessonId: 1,
        lessonTitle: "Lesson 1: The Magic Leaf Forest",
        slideNum: 2,
        title: "Phonics & Action – The Magic Leaf Clapper",
        timing: "04:00 - 08:00 (4 mins)",
        modality: "[ACTION] & [CHANT]",
        teacherPrompt: "Lead 4 rhythmic claps for 'De-cid-u-ous'. Have kids do the Leaf Drop TPR: hands high, wiggle fingers, drop to desk saying 'Whoosh! Leaves fall down!'",
        voicePersona: "Sarah",
        voiceStyle: "Chanting, rhythmic with wooden claps",
        ssml: `<speak>
  <prosody rate="75%">
    Let's clap the big word! <break time="200ms"/> 
    De! <break time="150ms"/> cid! <break time="150ms"/> u! <break time="150ms"/> ous! <break time="300ms"/> 
    Deciduous! <break time="400ms"/> 
    Leaves fall down!
  </prosody>
</speak>`,
        imageSrc: "assets/autumn_winter_trees.jpg",
        imageAlt: "Split comparison of autumn apple tree with colorful leaves and bare winter tree",
        type: "leaf_clapper",
        syllables: ["De", "cid", "u", "ous"],
        scaffoldLines: [
          { icon: "👏", text: "De - cid - u - ous (4 claps!)" },
          { icon: "🍂", text: "Leaves change color." },
          { icon: "🍁", text: "Leaves fall down!" }
        ]
      },
      {
        id: "l1_s3",
        lessonId: 1,
        lessonTitle: "Lesson 1: The Magic Leaf Forest",
        slideNum: 3,
        title: "Animal Cards – Whack-a-Pet (Wordwall Quick Round)",
        timing: "08:00 - 13:00 (5 mins)",
        modality: "[1-CLICK CHOICE]",
        teacherPrompt: "Ask 'Who is eating a nut? Is it the squirrel or the coyote?' Call 1 student: 'Leo, who eats nuts?' Correct click flips card into Safari Sticker Album!",
        voicePersona: "Marcus",
        voiceStyle: "Energetic game announcer",
        ssml: `<speak>
  <prosody rate="85%">
    Who is eating a nut? <break time="300ms"/> 
    Is it the squirrel <break time="200ms"/> or the coyote?
  </prosody>
</speak>`,
        imageSrc: "assets/deciduous_animals.jpg",
        imageAlt: "Four-quadrant composite of raccoons, squirrel with nut, deer in leaves, coyote on rock",
        type: "animal_cards_whack",
        animals: [
          { id: 1, name: "Squirrel", icon: "🐿️", sentence: "It is a squirrel.", eatsNut: true, fact: "Eating an acorn nut" },
          { id: 2, name: "Raccoon", icon: "🦝", sentence: "It is a raccoon.", eatsNut: false, fact: "Black bandit mask" },
          { id: 3, name: "Deer", icon: "🦌", sentence: "It is a deer.", eatsNut: false, fact: "Standing in dry leaves" },
          { id: 4, name: "Coyote", icon: "🐺", sentence: "It is a coyote.", eatsNut: false, fact: "Howling on a rock" }
        ],
        targetQuestion: "Who is eating a nut?",
        correctId: 1
      },
      {
        id: "l1_s4",
        lessonId: 1,
        lessonTitle: "Lesson 1: The Magic Leaf Forest",
        slideNum: 4,
        title: "Snooze Quest – The Big Winter Sleep",
        timing: "13:00 - 18:00 (5 mins)",
        modality: "[MUTE & SNORE]",
        teacherPrompt: "Have all kids tilt their head on hands like a pillow and pretend to snore softly: 'Zzz... hibernate!'. When sleep meter fills, pull the digital blanket over the bear!",
        voicePersona: "Sarah",
        voiceStyle: "Whispering, sleepy, warm",
        ssml: `<speak>
  <prosody rate="75%">
    Shhh... <break time="400ms"/> 
    It is winter. <break time="200ms"/> 
    It is cold. <break time="300ms"/> 
    The bear sleeps all winter! <break time="400ms"/> 
    Hibernate!
  </prosody>
</speak>`,
        imageSrc: "assets/hibernating_bear_den.jpg",
        imageAlt: "Mama brown bear and cute cub fast asleep inside an earthen den with snow outside",
        type: "hibernate_snooze",
        scaffoldLines: [
          { icon: "💤", text: "Hi - ber - nate (3 claps!)" },
          { icon: "🐻", text: "The bear sleeps." },
          { icon: "❄️", text: "No food in winter." }
        ],
        badgeEarned: {
          id: "bear_blanket_badge",
          name: "Bear Blanket Badge",
          icon: "🛌",
          desc: "Hibernate Mastery Unlocked"
        }
      },
      {
        id: "l1_s5",
        lessonId: 1,
        lessonTitle: "Lesson 1: The Magic Leaf Forest",
        slideNum: 5,
        title: "Camouflage Detective – The Color Hunt",
        timing: "18:00 - 22:00 (4 mins)",
        modality: "[FLASHLIGHT HUNT]",
        teacherPrompt: "Ask 'Where is the deer?' Guide students to use the digital flashlight circle tool to locate the camouflaged brown deer among the brown tree trunks and dry leaves!",
        voicePersona: "Sarah",
        voiceStyle: "Excited whisper",
        ssml: `<speak>
  <prosody rate="85%">
    Where is the deer? <break time="300ms"/> 
    The trees are brown. <break time="200ms"/> 
    The leaves are brown! <break time="200ms"/> 
    The deer is brown! <break time="400ms"/> 
    It is hiding!
  </prosody>
</speak>`,
        imageSrc: "assets/deer_autumn_camouflage.jpg",
        imageAlt: "Brown deer camouflaged quietly among brown autumn tree trunks and fallen dry leaves",
        type: "camouflage_hunt",
        scaffoldLines: [
          { icon: "🟤", text: "The deer is brown." },
          { icon: "🍂", text: "The trees are brown." },
          { icon: "🙈", text: "It can hide!" }
        ]
      },
      {
        id: "l1_s6",
        lessonId: 1,
        lessonTitle: "Lesson 1: The Magic Leaf Forest",
        slideNum: 6,
        title: "Boss Mini-Game – Leaf Forest Arcade",
        timing: "22:00 - 27:00 (5 mins)",
        modality: "[ARCADE QUIZ]",
        teacherPrompt: "Blooket / Kahoot style speed challenge! Read questions aloud, have kids hold up finger 1 or 2 on webcam or tap the option. Gold Star Trophy on completion!",
        voicePersona: "Marcus",
        voiceStyle: "Dynamic quiz show host",
        ssml: `<speak>
  <prosody rate="85%">
    Ranger Quiz Show! <break time="300ms"/> 
    Win three stars to clear Forest One! <break time="400ms"/> 
    Are you ready?
  </prosody>
</speak>`,
        imageSrc: "assets/autumn_winter_trees.jpg",
        imageAlt: "Deciduous forest background",
        type: "leaf_arcade_quiz",
        questions: [
          {
            id: 1,
            q: "What do deciduous leaves do in autumn?",
            options: ["Fall down 🍂", "Turn blue 🔵"],
            correct: 0
          },
          {
            id: 2,
            q: "What does a bear do all winter?",
            options: ["Dance 💃", "Sleep 💤"],
            correct: 1
          },
          {
            id: 3,
            q: "What color is the deer in autumn?",
            options: ["Brown 🟤", "Pink 🌸"],
            correct: 0
          }
        ]
      },

      // ==========================================
      // LESSON 2: THE DEEP FREEZE EVERGREEN FOREST
      // ==========================================
      {
        id: "l2_s1",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 1,
        title: "Mission Start – The Ice Thermometer (-50°C!)",
        timing: "00:00 - 04:00 (4 mins)",
        modality: "[FREEZE CHECK] & [TPR]",
        teacherPrompt: "Shiver with the kids! Pretend to zip big coats 'Zzzzt!' and pull warm hats over ears. Call 'FREEZE!' — students stay as still as ice statues!",
        voicePersona: "Marcus",
        voiceStyle: "Shivering, dramatic, funny",
        ssml: `<speak>
  <prosody rate="80%">
    Brrr! <break time="300ms"/> 
    It is freezing! <break time="300ms"/> 
    Minus 50 degrees! <break time="400ms"/> 
    Put on your warm hat! <break time="200ms"/> 
    Put on your big coat!
  </prosody>
</speak>`,
        imageSrc: "assets/ice_thermometer_cold.jpg",
        imageAlt: "Vintage outdoor metallic thermometer dial covered in ice frost pointing to -50 Celsius",
        type: "freeze_thermometer",
        scaffoldLines: [
          { icon: "🥶", text: "-50°C! VERY COLD!" },
          { icon: "🧥", text: "Put on your coat." },
          { icon: "🧤", text: "Put on your gloves!" }
        ]
      },
      {
        id: "l2_s2",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 2,
        title: "Phonics & Touch – Pine Cone vs. Apple",
        timing: "04:00 - 08:00 (4 mins)",
        modality: "[STAMP & TPR]",
        teacherPrompt: "Point out no flowers on pine trees — they make cones! Students stamp a green checkmark on the pine cone and make prickly needle hands with fingers spread wide.",
        voicePersona: "Sarah",
        voiceStyle: "Clear, friendly, encouraging",
        ssml: `<speak>
  <prosody rate="80%">
    No flowers here! <break time="300ms"/> 
    These trees make <emphasis level="strong">cones</emphasis>! <break time="400ms"/> 
    Pine cones! <break time="300ms"/> 
    And the needles stay green all year! 
    Evergreen!
  </prosody>
</speak>`,
        imageSrc: "assets/apple_vs_pinecone.jpg",
        imageAlt: "Split comparison of red apple with blossoms versus prickly brown pine cone on pine needles",
        type: "pine_vs_apple",
        scaffoldLines: [
          { icon: "🌲", text: "Pine tree." },
          { icon: "🤎", text: "It has cones." },
          { icon: "🟢", text: "Always green! (Evergreen)" }
        ]
      },
      {
        id: "l2_s3",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 3,
        title: "Magic Color Change – The Snow Bunny Trick",
        timing: "08:00 - 13:00 (5 mins)",
        modality: "[COLOR CHAT] & [TPR]",
        teacherPrompt: "Type 'W' for White or 'B' for Brown in chat! Unmute 1 kid to do 3 bunny hops on camera while saying: 'Hop, hop, white hare!'",
        voicePersona: "Sarah",
        voiceStyle: "Amazed, animated inflection",
        ssml: `<speak>
  <prosody rate="80%">
    Look at the hare! <break time="300ms"/> 
    In summer, it is brown! <break time="300ms"/> 
    In winter, it turns white! <break time="400ms"/> 
    Magic fur to hide in the snow!
  </prosody>
</speak>`,
        imageSrc: "assets/summer_winter_hare.jpg",
        imageAlt: "Split comparison of brown summer hare on moss and pure-white winter hare leaping in snow",
        type: "snow_bunny_trick",
        scaffoldLines: [
          { icon: "🐇", text: "The hare is white." },
          { icon: "❄️", text: "The snow is white." },
          { icon: "🙈", text: "It can hide!" }
        ]
      },
      {
        id: "l2_s4",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 4,
        title: "The Winter Predators – Wolf, Owl, Lynx",
        timing: "13:00 - 18:00 (5 mins)",
        modality: "[ANIMAL HOWL TPR]",
        teacherPrompt: "Point to Wolf: class howls 'Awooooo!'. Point to Owl: class flaps wings and hoots 'Hoo-hoo!'. Award fastest student the digital Wolf Hat!",
        voicePersona: "Marcus",
        voiceStyle: "Dramatic game host with wolf howl sound effect",
        ssml: `<speak>
  <prosody rate="85%">
    Listen! <break time="300ms"/> 
    The wolf has thick warm fur! <break time="400ms"/> 
    Can you howl like a winter wolf?
  </prosody>
</speak>`,
        imageSrc: "assets/winter_predators.jpg",
        imageAlt: "Three portraits: gray wolf in snow, great horned owl on pine branch, lynx in deep snow",
        type: "winter_predators_hunt",
        predators: [
          { name: "Wolf", icon: "🐺", sound: "Awooooo!", sentence: "I see a wolf." },
          { name: "Owl", icon: "🦉", sound: "Hoo-hoo!", sentence: "I see an owl." },
          { name: "Lynx", icon: "🐾", sound: "Purr-hiss!", sentence: "I see a lynx." }
        ]
      },
      {
        id: "l2_s5",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 5,
        title: "The Forest Sorter – Orange Tree or Pine Tree?",
        timing: "18:00 - 23:00 (5 mins)",
        modality: "[SORT & ARROW]",
        teacherPrompt: "Students tap each item to send it into the correct photo basket: 🍂 Leaf Forest or 🌲 Pine Forest! Ka-ching sound on correct placement.",
        voicePersona: "Sarah",
        voiceStyle: "Cheery coach",
        ssml: `<speak>
  <prosody rate="85%">
    Time to sort your safari photos! <break time="300ms"/> 
    Does it belong to the Leaf Forest <break time="200ms"/> or the Pine Forest?
  </prosody>
</speak>`,
        imageSrc: "assets/autumn_winter_trees.jpg",
        imageAlt: "Forest sorting background",
        type: "forest_sorter_baskets",
        itemsToSort: [
          { id: "apple", label: "Apples 🍎", target: "leaf", hint: "Grows on leaf trees" },
          { id: "pinecone", label: "Pine Cone 🤎", target: "pine", hint: "Has seeds in cones" },
          { id: "bear", label: "Bear sleeping 🐻", target: "leaf", hint: "Hibernates in deciduous woods" },
          { id: "hare", label: "White hare 🐇", target: "pine", hint: "Changes fur in deep snow" }
        ]
      },
      {
        id: "l2_s6",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 6,
        title: "Final Boss Round – Frozen Forest Sprint",
        timing: "23:00 - 27:00 (4 mins)",
        modality: "[FINAL SPRINT]",
        teacherPrompt: "Fast 2-minute arcade sprint! 4 quick picture questions to win the Official Ranger Gold Badge.",
        voicePersona: "Marcus",
        voiceStyle: "High-energy championship announcer",
        ssml: `<speak>
  <prosody rate="88%">
    The final challenge! <break time="300ms"/> 
    Score four correct answers to claim your Official Ranger Gold Badge! <break time="400ms"/> 
    Go, Rangers, go!
  </prosody>
</speak>`,
        imageSrc: "assets/ice_thermometer_cold.jpg",
        imageAlt: "Frozen forest background",
        type: "frozen_sprint_quiz",
        questions: [
          {
            id: 1,
            q: "What is on a pine tree?",
            options: ["Pine Cones 🌲", "Bananas 🍌"],
            correct: 0
          },
          {
            id: 2,
            q: "How cold is it in the coniferous winter?",
            options: ["Sunny Beach 🏖️", "-50°C 🥶"],
            correct: 1
          },
          {
            id: 3,
            q: "Why does the hare turn white?",
            options: ["To hide in snow ❄️", "To fly in the sky ✈️"],
            correct: 0
          },
          {
            id: 4,
            q: "Evergreen trees are always:",
            options: ["Purple 🟣", "Green 🟢"],
            correct: 1
          }
        ]
      },
      {
        id: "l2_s7",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 7,
        title: "Speaking Trophy – My Favorite Pet",
        timing: "27:00 - 31:00 (4 mins)",
        modality: "[OPEN MIC] & [CHAT]",
        teacherPrompt: "Every kid types their favorite animal name in chat. Unmute 3 kids to share their 2 sentences aloud!",
        voicePersona: "Sarah",
        voiceStyle: "Warm, encouraging",
        ssml: `<speak>
  <prosody rate="80%">
    Great work, Rangers! <break time="300ms"/> 
    Which forest animal is your favorite? <break time="300ms"/> 
    Tell the class!
  </prosody>
</speak>`,
        imageSrc: "assets/deciduous_animals.jpg",
        imageAlt: "Badge wheel of all 8 forest animals",
        type: "favorite_pet_wheel",
        speakingFrame: [
          "I like the ________.",
          "It is ________ (big / small / brown / white)!"
        ],
        animalOptions: [
          { name: "Bear", icon: "🐻", tag: "big & brown" },
          { name: "Squirrel", icon: "🐿️", tag: "small & brown" },
          { name: "Raccoon", icon: "🦝", tag: "small & gray" },
          { name: "Deer", icon: "🦌", tag: "big & brown" },
          { name: "Coyote", icon: "🐺", tag: "fast & gray" },
          { name: "Wolf", icon: "🐺", tag: "big & gray" },
          { name: "Owl", icon: "🦉", tag: "brown & feathers" },
          { name: "Hare", icon: "🐇", tag: "small & white" },
          { name: "Lynx", icon: "🐾", tag: "spotted & paws" }
        ]
      },
      {
        id: "l2_s8",
        lessonId: 2,
        lessonTitle: "Lesson 2: The Deep Freeze Evergreen Forest",
        slideNum: 8,
        title: "Graduation – Certified Junior Ranger Badge",
        timing: "31:00 - 35:00 (4 mins)",
        modality: "[CLASS HIGH FIVE]",
        teacherPrompt: "All students put their hand against their webcam glass for a synchronized virtual class high-five screenshot! Print worksheet for home review.",
        voicePersona: "Marcus",
        voiceStyle: "Grand celebratory graduation voice",
        ssml: `<speak>
  <prosody rate="85%">
    You did it, Rangers! <break time="300ms"/> 
    You explored two forests! <break time="300ms"/> 
    You found eight wild animals! <break time="400ms"/> 
    You are now Certified Junior Biome Rangers! <break time="300ms"/> High five!
  </prosody>
</speak>`,
        imageSrc: "assets/ranger_gold_badge.jpg",
        imageAlt: "Official gold Junior Biome Ranger medal pinned to dark green fabric",
        type: "ranger_graduation",
        achievements: [
          "🌲 Two Biome Forests Explored (Deciduous & Coniferous)",
          "🐾 8 Wild Animals Discovered & Recorded",
          "🧥 Winter Survival Skills (-50°C Ready!)",
          "🗣️ Animal Speaking Frame Certified"
        ]
      }
    ]
  };

  root.FOREST_SAFARI_DATA = FOREST_SAFARI_DATA;
})(typeof window !== 'undefined' ? window : global);
