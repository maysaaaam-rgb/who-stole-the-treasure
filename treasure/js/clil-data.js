/**
 * CLIL CRIME LAB: FOUR MYSTERY CASES (4th Grade English & CLIL Revision)
 * Complete data definitions for 4 distinct mystery investigations:
 * 🔴 Case 1 (Red): The Missing Trophy (History of Sports + Time / Past Simple)
 * 🔵 Case 2 (Blue): The Science Lab Mystery (States of Matter / Past Continuous)
 * 🟢 Case 3 (Green): The Vanishing Painting (Art & Color Mixing / Comparatives)
 * 🟡 Case 4 (Yellow): The Lost Explorer's Map (Geography & Directions / Imperatives)
 */

const CLIL_DATA = {
  cases: {
    // =======================================================================
    // 🔴 CASE 1: THE MISSING TROPHY (TEAM RED)
    // =======================================================================
    red: {
      id: "red",
      team: "Team Red",
      colorCode: "#dc2626",
      bgGradient: "linear-gradient(135deg, #fef2f2, #fee2e2)",
      title: "CASE 1 — THE MISSING TROPHY",
      tagline: "School Sports Room Mystery",
      clilTopic: "History of Sports + Time",
      grammarFocus: "Past Simple (was/were, went, saw, took, left, happened, Did...?)",
      targetVocab: ["trophy", "stadium", "race", "medal", "clock", "footprints", "time", "finish"],
      
      story: {
        setting: "School Sports Room",
        intro: "A prestigious school sports trophy disappeared before the annual championship celebration! At 3:20, the trophy was on the table. At 3:30, the sports teacher left. At 3:40, someone entered the room. At 3:45, the teacher came back. The trophy was GONE!",
        spokenIntro: "A prestigious sports trophy disappeared from the sports room. At 3:20, the trophy was on the table. At 3:30, the teacher left. At 3:40, someone entered the room. At 3:45, the teacher came back and the trophy was gone!",
        timelineEvents: [
          { time: "3:20", text: "The trophy was safe on the table." },
          { time: "3:30", text: "The teacher left the sports room." },
          { time: "3:40", text: "Someone entered and took the trophy." },
          { time: "3:45", text: "The teacher returned. The trophy was gone!" }
        ]
      },

      sceneObjects: [
        { id: "clock", name: "Wall Clock", icon: "🕰️", x: 75, y: 15, hint: "Inspect the clock to check the exact time." },
        { id: "table", name: "Trophy Table", icon: "🪑", x: 45, y: 55, hint: "Inspect where the trophy was sitting." },
        { id: "footprints", name: "Wet Footprints", icon: "👣", x: 30, y: 78, hint: "Follow the tracks leading away." },
        { id: "door", name: "Sports Room Door", icon: "🚪", x: 10, y: 35, hint: "The door leading to the sports hall." }
      ],

      riddle1: {
        text: "I have a face and two hands, but I cannot clap.\nI tell you when something happens.\nWhat am I?",
        spoken: "I have a face and two hands, but I cannot clap. I tell you when something happens. What am I?",
        answer: "clock",
        acceptableAnswers: ["clock", "a clock", "the clock", "watch", "wall clock"],
        revealedEvidence: {
          id: "ev_clock",
          title: "🕰️ Stopped Clock — 3:40 PM",
          description: "The room clock was bumped and stopped at exactly 3:40 PM when someone entered.",
          shortText: "Time of theft: 3:40 PM"
        },
        hints: [
          "Hint 1: It hangs on the wall and ticks.",
          "Hint 2: It has numbers from 1 to 12.",
          "Hint 3: It tells you what time it is (starts with C-L-O...)."
        ]
      },

      riddle2: {
        text: "I am left behind when you walk.\nYou cannot carry me.\nDetectives can use me to know who was there.\nWhat am I?",
        spoken: "I am left behind when you walk. You cannot carry me. Detectives can use me to know who was there. What am I?",
        answer: "footprint",
        acceptableAnswers: ["footprint", "footprints", "a footprint", "shoe print", "tracks"],
        revealedEvidence: {
          id: "ev_footprint",
          title: "👣 Wet Footprints",
          description: "Fresh wet footprints were left near the table, proving the person came in from the rainy field.",
          shortText: "Wet muddy tracks from rain"
        },
        hints: [
          "Hint 1: You make them with your shoes on wet ground.",
          "Hint 2: Animals and people leave them behind.",
          "Hint 3: It starts with F-O-O-T..."
        ]
      },

      witnessStatement: {
        speaker: "Coach Davis (Witness)",
        audioText: "I saw someone leave the sports room at 3:40 PM. They were running fast and they were wearing a bright red jacket!",
        spoken: "I saw someone leave the sports room at 3:40 PM. They were running fast and they were wearing a bright red jacket!",
        keyFacts: ["Time: 3:40 PM", "Clothing: Red Jacket", "Action: Running fast"]
      },

      memoryChallenge: {
        prompt: "Remember the 3 key details from the witness!",
        displayTime: 8,
        question: "What color was the jacket worn by the person at 3:40?",
        spoken: "What color was the jacket worn by the person at 3:40?",
        options: [
          { text: "A bright Red Jacket ✅", isCorrect: true },
          { text: "A dark Blue Hoodie", isCorrect: false },
          { text: "A Green Raincoat", isCorrect: false }
        ]
      },

      suspects: [
        {
          id: "suspect_alex",
          name: "Alex",
          avatarClass: "avatar-alex",
          jacketColor: "Blue",
          locationAt340: "Library (reading books)",
          shoesState: "Dry shoes",
          statement: "At 3:40, I was in the library. My blue jacket was dry.",
          isGuilty: false
        },
        {
          id: "suspect_sam",
          name: "Sam (Runner)",
          avatarClass: "avatar-sam",
          jacketColor: "Red",
          locationAt340: "Near Sports Room (came from rainy field)",
          shoesState: "Wet muddy sneakers",
          statement: "I was running outside in my red jacket. I took the trophy to clean it for the race!",
          isGuilty: true
        },
        {
          id: "suspect_mia",
          name: "Mia",
          avatarClass: "avatar-mia",
          jacketColor: "Yellow",
          locationAt340: "Classroom (doing homework)",
          shoesState: "Dry shoes",
          statement: "I was in the classroom from 3:15 to 4:00 with my yellow hoodie.",
          isGuilty: false
        },
        {
          id: "suspect_leo",
          name: "Leo",
          avatarClass: "avatar-leo",
          jacketColor: "Green",
          locationAt340: "Art Room (painting poster)",
          shoesState: "Dry shoes with paint spots",
          statement: "I was painting the race banner in my green shirt all afternoon.",
          isGuilty: false
        }
      ],

      correctSuspectId: "suspect_sam",
      requiredEvidenceIds: ["ev_clock", "ev_footprint"],
      sentenceFrame: "We think Sam took the trophy because he was wearing a RED JACKET at 3:40 and had WET FOOTPRINTS from the rain."
    },

    // =======================================================================
    // 🔵 CASE 2: THE SCIENCE LAB MYSTERY (TEAM BLUE)
    // =======================================================================
    blue: {
      id: "blue",
      team: "Team Blue",
      colorCode: "#2563eb",
      bgGradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      title: "CASE 2 — THE SCIENCE LAB MYSTERY",
      tagline: "States of Matter & Lab Mishap",
      clilTopic: "Science — States of Matter (Solid ➔ Liquid ➔ Gas)",
      grammarFocus: "Past Continuous + Past Simple (was/were + verb-ing / regular & irregular past)",
      targetVocab: ["solid", "liquid", "gas", "heat", "cold", "temperature", "experiment", "bottle", "spill", "melt"],

      story: {
        setting: "School Science Laboratory",
        intro: "A special science display showed the three states of matter: Solid Ice ➔ Liquid Water ➔ Gas Steam. But when the teacher stepped out, the experiment went wrong: the ice melted completely, a beaker was boiling, and liquid spilled across the desk! Who changed the experiment?",
        spokenIntro: "A special science display showed solids, liquids, and gases. But when the teacher stepped out, the ice melted, steam was rising, and liquid spilled on the bench! Who altered the experiment?",
        timelineEvents: [
          { time: "2:10", text: "Sara was reading her science notebook." },
          { time: "2:15", text: "Leo was working near the heater experiment." },
          { time: "2:20", text: "A chemical bottle fell and water spilled on the table." }
        ]
      },

      sceneObjects: [
        { id: "ice_tray", name: "Ice Dish (Solid)", icon: "🧊", x: 25, y: 50, hint: "Inspect the melted ice dish." },
        { id: "heater", name: "Electric Heater", icon: "🔥", x: 50, y: 45, hint: "Check if the heat source is active." },
        { id: "thermometer", name: "Lab Thermometer", icon: "🌡️", x: 75, y: 35, hint: "Measure the temperature." },
        { id: "flask", name: "Spilled Flask (Liquid)", icon: "🧪", x: 40, y: 75, hint: "Look at the spilled liquid." }
      ],

      riddle1: {
        text: "I am hard and cold.\nWhen I get warm, I disappear into water.\nWhat am I?",
        spoken: "I am hard and cold. When I get warm, I disappear into water. What am I?",
        answer: "ice",
        acceptableAnswers: ["ice", "an ice cube", "ice cube", "frozen water"],
        revealedEvidence: {
          id: "ev_ice",
          title: "🧊 Melted Solid (Ice)",
          description: "The solid ice was heated rapidly and turned into liquid water.",
          shortText: "Ice melted from high heat"
        },
        hints: [
          "Hint 1: You find it in the freezer.",
          "Hint 2: It is frozen water.",
          "Hint 3: It starts with I-C-E."
        ]
      },

      riddle2: {
        text: "You cannot hold me in your hand,\nbut you can feel me.\nI make ice melt and water turn to steam.\nWhat am I?",
        spoken: "You cannot hold me in your hand, but you can feel me. I make ice melt and water turn to steam. What am I?",
        answer: "heat",
        acceptableAnswers: ["heat", "fire", "warmth", "heater", "high temperature"],
        revealedEvidence: {
          id: "ev_heat",
          title: "🔥 High Heat Switch ON",
          description: "The electric heater switch was turned to maximum (100°C), boiling the liquid into gas steam.",
          shortText: "Heater switch was turned ON"
        },
        hints: [
          "Hint 1: It is the opposite of cold.",
          "Hint 2: Stoves and fires produce it.",
          "Hint 3: It has 4 letters: H-E-A-T."
        ]
      },

      witnessStatement: {
        speaker: "Emma (Lab Partner)",
        audioText: "At 2:10, I was reading. At 2:15, I saw Leo working near the heater experiment. At 2:20, I heard a bottle fall and Leo dropped his notes!",
        spoken: "At 2:10, I was reading. At 2:15, I saw Leo working near the heater experiment. At 2:20, I heard a bottle fall and Leo dropped his notes!",
        keyFacts: ["2:10: Emma reading", "2:15: Leo near heater", "2:20: Bottle fell & liquid spilled"]
      },

      memoryChallenge: {
        prompt: "Remember the timeline of what happened in the science lab!",
        displayTime: 8,
        question: "What was Leo doing at 2:15?",
        spoken: "What was Leo doing at 2:15?",
        options: [
          { text: "Working near the heater experiment ✅", isCorrect: true },
          { text: "Eating lunch outside", isCorrect: false },
          { text: "Cleaning the blackboard", isCorrect: false }
        ]
      },

      suspects: [
        {
          id: "suspect_sara",
          name: "Sara",
          avatarClass: "avatar-sara",
          activityAt215: "Reading textbook at her desk",
          labCoatState: "Clean & dry",
          statement: "I was reading chapter 4 about solids and liquids.",
          isGuilty: false
        },
        {
          id: "suspect_leo",
          name: "Leo (Young Scientist)",
          avatarClass: "avatar-leo",
          activityAt215: "Working near the heater when the bottle fell",
          labCoatState: "Sleeves wet with spilled water",
          statement: "I was adjusting the heater to see how fast ice turns to steam, but the bottle knocked over!",
          isGuilty: true
        },
        {
          id: "suspect_tom",
          name: "Tom",
          avatarClass: "avatar-tom",
          activityAt215: "Looking through the microscope",
          labCoatState: "Dry lab coat",
          statement: "I was looking at plant cells under the microscope.",
          isGuilty: false
        },
        {
          id: "suspect_mia",
          name: "Mia",
          avatarClass: "avatar-mia",
          activityAt215: "Washing test tubes by the sink",
          labCoatState: "Clean lab coat",
          statement: "I was washing empty test tubes near the back sink.",
          isGuilty: false
        }
      ],

      correctSuspectId: "suspect_leo",
      requiredEvidenceIds: ["ev_ice", "ev_heat"],
      sentenceFrame: "We think Leo altered the experiment because he was WORKING NEAR THE HEATER at 2:15 and turned the HEAT ON."
    },

    // =======================================================================
    // 🟢 CASE 3: THE MYSTERY OF THE VANISHING PAINTING (TEAM GREEN)
    // =======================================================================
    green: {
      id: "green",
      team: "Team Green",
      colorCode: "#059669",
      bgGradient: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      title: "CASE 3 — THE VANISHING PAINTING",
      tagline: "Art Exhibition & Color Mixing Mystery",
      clilTopic: "Art — Colors + Mixing (Primary & Secondary Colors)",
      grammarFocus: "Comparatives + describing objects (bigger than, smaller than, darker than, lighter than, next to)",
      targetVocab: ["painting", "brush", "red", "yellow", "blue", "green", "purple", "orange", "light", "dark", "frame", "artist"],

      story: {
        setting: "School Art Gallery",
        intro: "A prize-winning painting vanished from the art exhibition wall! On the floor near the empty frame, detectives discovered drops of mysterious mixed paint and a paintbrush left behind. The thief tried to hide the painting in a storage crate!",
        spokenIntro: "A prize-winning painting vanished from the art exhibition. Detectives found drops of purple paint on the floor and a paintbrush. Who moved the painting?",
        timelineEvents: [
          { time: "1:00", text: "The large painting was hanging next to the window." },
          { time: "1:20", text: "Students were mixing paints in the studio." },
          { time: "1:40", text: "Someone moved the painting into the wooden storage box." }
        ]
      },

      sceneObjects: [
        { id: "empty_easel", name: "Empty Easel Frame", icon: "🖼️", x: 25, y: 40, hint: "Inspect where the painting was displayed." },
        { id: "paint_palette", name: "Artist Palette", icon: "🎨", x: 50, y: 60, hint: "Check the color mixing station." },
        { id: "brush", name: "Paintbrush", icon: "🖌️", x: 75, y: 70, hint: "Look closely at the bristles." },
        { id: "crate", name: "Wooden Storage Box", icon: "📦", x: 80, y: 35, hint: "A large crate in the corner." }
      ],

      riddle1: {
        text: "I can be red, yellow, or blue.\nWhen you mix two of me together, I make a brand new color.\nWhat am I?",
        spoken: "I can be red, yellow, or blue. When you mix two of me together, I make a brand new color. What am I?",
        answer: "paint",
        acceptableAnswers: ["paint", "paints", "color", "colors", "acrylic paint"],
        revealedEvidence: {
          id: "ev_purple_paint",
          title: "🎨 Purple Paint Residue",
          description: "Red paint mixed with Blue paint creates Purple (🔴 + 🔵 = 🟣). Purple drips were found near the frame.",
          shortText: "Purple paint (Red + Blue)"
        },
        hints: [
          "Hint 1: Artists use it on canvas.",
          "Hint 2: It comes in tubes and jars.",
          "Hint 3: It rhymes with faint: P-A-I-N-T."
        ]
      },

      riddle2: {
        text: "I am long and thin.\nI help an artist paint pictures on canvas.\nI have soft bristles at my tip. I am not a pencil.\nWhat am I?",
        spoken: "I am long and thin. I help an artist paint pictures on canvas. I have soft bristles at my tip. I am not a pencil. What am I?",
        answer: "brush",
        acceptableAnswers: ["brush", "paintbrush", "a brush", "a paintbrush"],
        revealedEvidence: {
          id: "ev_brush",
          title: "🖌️ Purple-Tipped Brush",
          description: "A paintbrush with fresh purple paint bristles was found near the storage crate.",
          shortText: "Brush with purple bristles"
        },
        hints: [
          "Hint 1: You dip it in water and paint.",
          "Hint 2: It has hairs or bristles on top.",
          "Hint 3: It starts with B-R-U-S-H."
        ]
      },

      witnessStatement: {
        speaker: "Mrs. Rivera (Art Teacher)",
        audioText: "The missing painting was larger and darker than the other sketches. I noticed someone mixing red and blue paint right before the painting disappeared!",
        spoken: "The missing painting was larger and darker than the other sketches. I noticed someone mixing red and blue paint right before the painting disappeared!",
        keyFacts: ["Painting: Larger and darker than sketches", "Clue: Suspect mixed Red + Blue = Purple", "Brush: Purple paint residue"]
      },

      memoryChallenge: {
        prompt: "Remember the color formula!",
        displayTime: 8,
        question: "What color do you get when you mix RED and BLUE?",
        spoken: "What color do you get when you mix red and blue?",
        options: [
          { text: "Purple 🟣 ✅", isCorrect: true },
          { text: "Green 🟢", isCorrect: false },
          { text: "Orange 🟧", isCorrect: false }
        ]
      },

      suspects: [
        {
          id: "suspect_lucas",
          name: "Lucas (Art Student)",
          avatarClass: "avatar-lucas",
          claimedColor: "Yellow",
          actualHands: "Purple paint on hands & brush",
          statement: "I only used bright yellow paint for sunshine, nothing else!",
          isGuilty: true
        },
        {
          id: "suspect_emma",
          name: "Emma",
          avatarClass: "avatar-emma",
          claimedColor: "Green",
          actualHands: "Green paint on fingers",
          statement: "I mixed yellow and blue to make green trees all afternoon.",
          isGuilty: false
        },
        {
          id: "suspect_noah",
          name: "Noah",
          avatarClass: "avatar-noah",
          claimedColor: "Orange",
          actualHands: "Orange paint on palette",
          statement: "I mixed red and yellow to paint an orange sunset.",
          isGuilty: false
        },
        {
          id: "suspect_chloe",
          name: "Chloe",
          avatarClass: "avatar-chloe",
          claimedColor: "White & Blue",
          actualHands: "Light blue paint",
          statement: "I was painting light blue clouds in the corner.",
          isGuilty: false
        }
      ],

      correctSuspectId: "suspect_lucas",
      requiredEvidenceIds: ["ev_purple_paint", "ev_brush"],
      sentenceFrame: "We think Lucas moved the painting because his brush had PURPLE PAINT (Red + Blue) even though he claimed he only used yellow!"
    },

    // =======================================================================
    // 🟡 CASE 4: THE LOST EXPLORER'S MAP (TEAM YELLOW)
    // =======================================================================
    yellow: {
      id: "yellow",
      team: "Team Yellow",
      colorCode: "#ca8a04",
      bgGradient: "linear-gradient(135deg, #fefce8, #fef08a)",
      title: "CASE 4 — THE LOST EXPLORER'S MAP",
      tagline: "Geography & School Landmark Investigation",
      clilTopic: "Geography — Maps, Directions & Landmarks (North, South, East, West)",
      grammarFocus: "Directions + imperatives + prepositions (go straight, turn left, turn right, opposite, next to, behind)",
      targetVocab: ["map", "compass", "globe", "school", "library", "door", "tree", "bridge", "left", "right", "north", "south"],

      story: {
        setting: "School Campus Map",
        intro: "A rare historical explorer's map vanished during the school geography challenge! The map never left the campus. A witness saw the suspect follow a secret route from the library toward the school garden. Follow the compass directions to find where it is hidden and who moved it!",
        spokenIntro: "A rare explorer's map vanished during the geography challenge. A witness saw someone follow a route from the library to the garden. Use the compass to trace the route!",
        timelineEvents: [
          { time: "11:00", text: "The map was displayed in the library." },
          { time: "11:15", text: "Someone walked from library ➔ past main door ➔ to garden." },
          { time: "11:25", text: "The map was hidden behind a wooden crate near the big oak tree." }
        ]
      },

      sceneObjects: [
        { id: "library", name: "School Library", icon: "📚", x: 20, y: 30, hint: "Starting landmark where the map was displayed." },
        { id: "main_door", name: "Main Entrance Door", icon: "🚪", x: 50, y: 45, hint: "The central hallway connecting campus wings." },
        { id: "garden", name: "School Garden", icon: "🌳", x: 80, y: 30, hint: "The green garden with big oak trees." },
        { id: "crate", name: "Garden Supply Box", icon: "📦", x: 85, y: 65, hint: "A crate behind the oak tree." }
      ],

      riddle1: {
        text: "I have four main directions.\nI have letters N, S, E, and W.\nMy magnetic needle always points North.\nWhat am I?",
        spoken: "I have four main directions. I have letters N, S, E, and W. My magnetic needle always points North. What am I?",
        answer: "compass",
        acceptableAnswers: ["compass", "a compass", "magnetic compass"],
        revealedEvidence: {
          id: "ev_compass",
          title: "🧭 Brass Pocket Compass",
          description: "A pocket compass pointing North (⬆️), East (➡️), South (⬇️), and West (⬅️).",
          shortText: "Directions: North, South, East, West"
        },
        hints: [
          "Hint 1: Explorers use it on ships and hikes.",
          "Hint 2: It has a magnetic needle pointing North.",
          "Hint 3: It starts with C-O-M-P-A-S-S."
        ]
      },

      riddle2: {
        text: "I show roads, rivers, cities, and landmarks,\nbut I am not a window or a picture.\nYou fold me and use me to find your way.\nWhat am I?",
        spoken: "I show roads, rivers, cities, and landmarks, but I am not a window or a picture. You fold me and use me to find your way. What am I?",
        answer: "map",
        acceptableAnswers: ["map", "a map", "the map", "explorer map", "atlas"],
        revealedEvidence: {
          id: "ev_route_map",
          title: "🗺️ Explorer's Trail Route",
          description: "Route: Library ➔ Go North ➔ Turn Right past Main Door ➔ Go straight to Garden ➔ Behind the Tree Box.",
          shortText: "Route: Library ➔ Door ➔ Garden ➔ Box"
        },
        hints: [
          "Hint 1: It shows drawings of countries and paths.",
          "Hint 2: GPS uses a digital version of it.",
          "Hint 3: It has 3 letters: M-A-P."
        ]
      },

      witnessStatement: {
        speaker: "Mr. Henderson (Geography Teacher)",
        audioText: "I saw someone carrying a folded scroll leaving the library. They went north, turned right near the main door, and walked straight to the garden!",
        spoken: "I saw someone carrying a folded scroll leaving the library. They went north, turned right near the main door, and walked straight to the garden!",
        keyFacts: ["Start: Library", "Turn: Right near main door", "Destination: Garden behind tree"]
      },

      memoryChallenge: {
        prompt: "Remember the 4 compass directions!",
        displayTime: 8,
        question: "Which compass direction points straight UP on standard maps?",
        spoken: "Which compass direction points straight up on standard maps?",
        options: [
          { text: "North (N) ⬆️ ✅", isCorrect: true },
          { text: "South (S) ⬇️", isCorrect: false },
          { text: "West (W) ⬅️", isCorrect: false }
        ]
      },

      suspects: [
        {
          id: "suspect_ethan",
          name: "Ethan (Scout Member)",
          avatarClass: "avatar-ethan",
          routeTaken: "Library ➔ Main Door ➔ Garden",
          destination: "Garden behind the oak tree crate",
          statement: "I walked from the library, turned right at the main door, and hid the map in the garden crate as a treasure hunt!",
          isGuilty: true
        },
        {
          id: "suspect_maya",
          name: "Maya",
          avatarClass: "avatar-maya",
          routeTaken: "Science Room ➔ Art Room",
          destination: "Art Studio",
          statement: "I went straight from the science lab to the art room.",
          isGuilty: false
        },
        {
          id: "suspect_oliver",
          name: "Oliver",
          avatarClass: "avatar-oliver",
          routeTaken: "Library ➔ Cafeteria ➔ Home",
          destination: "Cafeteria",
          statement: "I left the library and went south to the cafeteria for lunch.",
          isGuilty: false
        },
        {
          id: "suspect_sophia",
          name: "Sophia",
          avatarClass: "avatar-sophia",
          routeTaken: "Classroom ➔ Sports Field",
          destination: "Sports Field",
          statement: "I went out the back door directly to the football pitch.",
          isGuilty: false
        }
      ],

      correctSuspectId: "suspect_ethan",
      requiredEvidenceIds: ["ev_compass", "ev_route_map"],
      sentenceFrame: "We think Ethan moved the map because his route matched the witness (LIBRARY ➔ MAIN DOOR ➔ GARDEN) and it was hidden BEHIND THE CRATE."
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CLIL_DATA;
}
