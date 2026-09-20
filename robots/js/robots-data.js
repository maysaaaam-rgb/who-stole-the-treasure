/**
 * "AMAZING ROBOTS AROUND THE WORLD" — Pedagogical Data Registry
 * Level: A1-A2 Children (Aged 9–12)
 * Focus: WH-Questions, Reading Comprehension, Presentation & Real Science Inventions
 */

const ROBOTS_DATA = {

  // WH-Question Review & Detective Matching Pairs (Page 3)
  whMatchingPairs: [
    { id: "what", word: "WHAT", prompt: "What is it?", meaning: "the thing or object", example: "It is a swimming fish robot." },
    { id: "where", word: "WHERE", prompt: "Where is it used?", meaning: "the place or environment", example: "It is used in rivers and oceans." },
    { id: "when", word: "WHEN", prompt: "When was it created?", meaning: "the time or year", example: "Scientists built it around 2012." },
    { id: "who", word: "WHO", prompt: "Who created or uses it?", meaning: "the person or people", example: "Marine biologists and engineers use it." },
    { id: "why", word: "WHY", prompt: "Why was it made?", meaning: "the reason or purpose", example: "To protect real fish from dangerous dams." },
    { id: "how", word: "HOW", prompt: "How does it work?", meaning: "the way it moves or operates", example: "It beats its soft silicone tail back and forth." }
  ],

  // 5 Real-World Robot Files
  robots: [
    {
      id: "fish",
      groupNum: 1,
      icon: "🐟",
      secretName: "Mystery Robot Alpha",
      name: "The Fish Training Robot",
      shortTitle: "Fish Training Robot",
      tagline: "Biomimetic Swimming Leader",
      field: "Marine Biology & Environmental Engineering",
      
      // Page 2 Prediction Placeholders & Clues
      mysteryClue: "This sleek mechanical creature has waterproof scales and a flexible wagging tail. What could scientists possibly do with it underwater?",
      defaultGuesses: {
        what: "A toy fish / underwater submarine",
        where: "In water tanks, rivers, and dams",
        when: "In the 2010s",
        who: "Marine biologists and scientists",
        why: "To train and protect real fish",
        how: "It wags its tail fin using a motor"
      },

      // Page 4 Reading File (118 words, A1-A2 appropriate)
      reading: {
        title: "The Robot That Teaches Real Fish",
        text: `The <strong>Fish Training Robot</strong> is a swimming machine created by <strong>marine engineers and scientists</strong> at universities like New York University. They developed this biomimetic swimmer around <strong>2012</strong>.

It is used in <strong>rivers, water tanks, and near hydro dams</strong>. Real fish love to swim together in schools. When this robot moves its soft tail fin back and forth, real fish believe it is a real fish!

Scientists made this robot because dangerous water dams and chemical spills can kill fish. The robot fish swims ahead like a leader. Real fish follow the robot away from danger into safe water. It works with a quiet motor and a flexible silicone tail that wags gently.`,
        amazingFact: "Real fish accept the robot as their group leader! If the robot fish turns left, the whole school of real fish turns left too!"
      },

      // Page 5 Comprehension Questions (WH-Questions)
      comprehension: [
        { q: "WHAT is this robot?", wh: "WHAT", answer: "A swimming robot fish with a silicone tail", options: ["A flying drone", "A swimming robot fish with a silicone tail", "A metal fishing boat"] },
        { q: "WHERE is this robot used?", wh: "WHERE", answer: "In rivers, water tanks, and near dams", options: ["On the moon", "In dry deserts", "In rivers, water tanks, and near dams"] },
        { q: "WHEN did scientists develop it?", wh: "WHEN", answer: "Around 2012", options: ["In 1850", "Around 2012", "Last week"] },
        { q: "WHO created and uses this robot?", wh: "WHO", answer: "Marine engineers and scientists", options: ["Deep sea pirates", "Marine engineers and scientists", "Astronauts"] },
        { q: "WHY did scientists build it?", wh: "WHY", answer: "To lead real fish away from dangerous dams", options: ["To catch fish for dinner", "To lead real fish away from dangerous dams", "To scare birds away"] },
        { q: "HOW does it swim through water?", wh: "HOW", answer: "By wagging its flexible tail fin back and forth", options: ["By using rocket boosters", "By rolling on wheels", "By wagging its flexible tail fin back and forth"] }
      ],

      // Page 6 Fact or Guess Challenge
      factOrGuess: [
        { text: "The robot can lead real fish away from dangerous water dams.", isReal: true, feedback: "✅ REAL! Real fish follow its tail beat to safety." },
        { text: "The robot fish eats real fish food every morning.", isReal: false, feedback: "❌ GUESS! It is electric and runs on rechargeable batteries." },
        { text: "It uses a soft silicone tail that wags like a real fish.", isReal: true, feedback: "✅ REAL! Flexible silicone moves naturally in water." },
        { text: "The robot can talk to dolphins in English.", isReal: false, feedback: "❌ GUESS! It swims silently without speaking words." }
      ],

      // Page 7 Presentation Sentence Starters
      presentation: {
        intro: "Our robot is called the Fish Training Robot.",
        where: "It is used in rivers, canals, and around dangerous dams.",
        who: "It was developed by marine roboticists and scientists.",
        when: "It was developed around 2012.",
        why: "It was made to guide real fish schools away from danger.",
        how: "It works by wagging its flexible silicone tail with a motor.",
        amazing: "The most amazing thing is that real fish follow it like a leader!"
      },

      // Page 8 Real World Reveal
      reveal: {
        headline: "Real Conservation Swimmer!",
        explanation: "This robot is real! Bio-engineers built it to study animal schooling. When placed into tanks with golden shiners or zebrafish, the live fish synchronize their swimming with the robot. Today, scientists use robotic fish to guide migrating fish safely past industrial hydroelectric dams!",
        jobBadge: "🐟 Fish Wildlife Protection & Schooling Guide"
      }
    },

    {
      id: "jellyfish",
      groupNum: 2,
      icon: "🪼",
      secretName: "Mystery Robot Beta",
      name: "The Robotic Jellyfish",
      shortTitle: "Robotic Jellyfish",
      tagline: "Silent Coral Reef Monitor",
      field: "Oceanography & Soft Robotics",

      mysteryClue: "This translucent dome has glowing sensors and no propeller blades. It drifts through clear ocean water like a gentle ghost. What is its secret mission?",
      defaultGuesses: {
        what: "A glowing underwater lamp / jellyfish robot",
        where: "In the ocean and coral reefs",
        when: "In the 2010s to 2020s",
        who: "Ocean scientists and marine biologists",
        why: "To explore coral reefs safely",
        how: "By squeezing water with soft rubber tentacles"
      },

      // Page 4 Reading File (122 words)
      reading: {
        title: "The Gentle Giant of the Reef",
        text: `The <strong>Robotic Jellyfish</strong> is a soft underwater explorer created by <strong>marine oceanographers and bio-engineers</strong> at institutions like Florida Atlantic University and the Max Planck Institute. Research began around <strong>2011</strong>.

It is used in <strong>fragile coral reefs and coastal oceans</strong>. Most underwater submarines have fast metal propellers. These spinning blades can chop up delicate coral and hurt sea turtles. The motors are also noisy and scare wild animals away.

Scientists designed this robot because coral reefs are dying and need gentle inspection. The robot jellyfish has no sharp blades. It works by pumping water through soft silicone tentacles, opening and closing its dome silently. It carries micro-cameras to check water health.`,
        amazingFact: "Because it has no sharp blades and soft rubber edges, sea turtles and fish can bump right into it without getting hurt!"
      },

      comprehension: [
        { q: "WHAT is this robot?", wh: "WHAT", answer: "A soft, propeller-free jellyfish robot", options: ["A fast speed boat", "A soft, propeller-free jellyfish robot", "A metal anchor"] },
        { q: "WHERE does it explore?", wh: "WHERE", answer: "In delicate coral reefs and coastal oceans", options: ["In deep snow", "In delicate coral reefs and coastal oceans", "Inside caves on land"] },
        { q: "WHEN did research on it begin?", wh: "WHEN", answer: "Around 2011", options: ["In 1920", "Around 2011", "In 1776"] },
        { q: "WHO created this invention?", wh: "WHO", answer: "Oceanographers and bio-engineers", options: ["Toy makers", "Subway drivers", "Oceanographers and bio-engineers"] },
        { q: "WHY was it made without propellers?", wh: "WHY", answer: "To protect fragile coral reefs and animals from sharp blades", options: ["Because propellers are too cheap", "To protect fragile coral reefs and animals from sharp blades", "To move faster than a shark"] },
        { q: "HOW does it swim silently?", wh: "HOW", answer: "By squeezing water with soft silicone tentacles", options: ["By firing loud cannonballs", "By walking on crab legs", "By squeezing water with soft silicone tentacles"] }
      ],

      factOrGuess: [
        { text: "It has zero sharp blades so it cannot hurt sea creatures.", isReal: true, feedback: "✅ REAL! It uses soft silicone so animals stay safe." },
        { text: "The robot jellyfish stings swimmers at the beach.", isReal: false, feedback: "❌ GUESS! It has no venom; it is a scientific sensor drone." },
        { text: "It moves by opening and closing its dome to squeeze water.", isReal: true, feedback: "✅ REAL! It uses biomimetic hydraulic pulsing." },
        { text: "It runs on strawberry juice.", isReal: false, feedback: "❌ GUESS! It uses clean lithium electric batteries." }
      ],

      presentation: {
        intro: "Our robot is called the Robotic Jellyfish.",
        where: "It is used in fragile ocean waters and coral reefs.",
        who: "It was developed by oceanographers and soft roboticists.",
        when: "It was developed around 2011.",
        why: "It was made to inspect coral reefs without harming sea life.",
        how: "It works by pumping water silently with soft silicone tentacles.",
        amazing: "The most amazing thing is that it has no propellers and cannot hurt any animals!"
      },

      reveal: {
        headline: "Silent Ocean Environmental Inspector!",
        explanation: "Ordinary underwater drones produce noisy propeller vortices that shred delicate corals and frighten fish. The soft robotic jellyfish (such as FAU's 'Jennifer' and Max Planck's micro-jellyfish) moves silently by squeezing water through soft rubber chambers. It safely monitors coral bleaching and ocean temperatures!",
        jobBadge: "🪼 Coral Reef Protection & Silent Water Monitor"
      }
    },

    {
      id: "bee",
      groupNum: 3,
      icon: "🐝",
      secretName: "Mystery Robot Gamma",
      name: "The Robotic Bee (RoboBee)",
      shortTitle: "Robotic Bee",
      tagline: "Micro-Flying Sensor Explorer",
      field: "Micro-Robotics & Aerodynamics",

      mysteryClue: "This tiny flying robot is as small as a paperclip and weighs less than a penny. Its wings flap faster than the eye can see. Why did scientists build such a tiny machine?",
      defaultGuesses: {
        what: "A tiny flying insect robot",
        where: "In laboratories, greenhouses, and disaster rubble",
        when: "Around 2013",
        who: "Micro-roboticists and engineers at Harvard",
        why: "To study insect flight and explore tiny spaces",
        how: "By flapping wings 120 times every second"
      },

      // Page 4 Reading File (125 words)
      reading: {
        title: "The Micro Flyer Smaller Than a Penny",
        text: `The <strong>Robotic Bee</strong> (known as <em>RoboBee</em>) is a micro-flying machine developed by <strong>micro-engineers and roboticists</strong> at Harvard University. They achieved its first flying test around <strong>2013</strong>.

It is tested in <strong>laboratories, greenhouses, and small spaces</strong>. The robot is tiny—only 3 centimeters wide and lighter than a paperclip!

Scientists built RoboBee because they wanted to understand how real insects fly with amazing balance in wind. They also hope micro-robots can enter tiny cracks after earthquakes to find trapped survivors. (Note: Robotic bees do not replace real bees, which are living nature!) It works using tiny ceramic muscles that bend with electricity, flapping its carbon-fiber wings <strong>120 times every second</strong>.`,
        amazingFact: "It flaps its wings 120 times every second—faster than the human eye can see—and some versions can even dive into water and pop back out!"
      },

      comprehension: [
        { q: "WHAT is this robot?", wh: "WHAT", answer: "A tiny flying robot about the size of a paperclip", options: ["A giant flying helicopter", "A tiny flying robot about the size of a paperclip", "A robotic bird"] },
        { q: "WHERE is it tested?", wh: "WHERE", answer: "In research laboratories, greenhouses, and tight spaces", options: ["On airplane runways", "In research laboratories, greenhouses, and tight spaces", "On high mountain peaks"] },
        { q: "WHEN did it achieve its first flight?", wh: "WHEN", answer: "Around 2013", options: ["In 1950", "Around 2013", "In 2000"] },
        { q: "WHO created the RoboBee?", wh: "WHO", answer: "Micro-engineers at Harvard University", options: ["Watchmakers in Switzerland", "Micro-engineers at Harvard University", "Honey farmers"] },
        { q: "WHY was it created?", wh: "WHY", answer: "To study insect aerodynamics and search tiny rubble cracks", options: ["To replace all real bees on Earth", "To study insect aerodynamics and search tiny rubble cracks", "To deliver heavy parcels"] },
        { q: "HOW does it stay in the air?", wh: "HOW", answer: "By flapping wings 120 times per second with ceramic muscles", options: ["With a hot air balloon", "By blowing bubbles", "By flapping wings 120 times per second with ceramic muscles"] }
      ],

      factOrGuess: [
        { text: "It flaps its wings 120 times per second.", isReal: true, feedback: "✅ REAL! That is fast enough to hover in mid-air." },
        { text: "Robotic bees make honey for children to eat on toast.", isReal: false, feedback: "❌ GUESS! Only real living bees make honey." },
        { text: "It is as light as a paperclip (under 0.1 grams).", isReal: true, feedback: "✅ REAL! It is one of the lightest flying machines in history." },
        { text: "It has replaced all natural honeybees worldwide.", isReal: false, feedback: "❌ GUESS! Real bees are essential pollinators that cannot be replaced." }
      ],

      presentation: {
        intro: "Our robot is called the Robotic Bee or RoboBee.",
        where: "It is used in laboratories, crop greenhouses, and tight crevices.",
        who: "It was developed by micro-roboticists at Harvard University.",
        when: "It was developed around 2013.",
        why: "It was made to study insect aerodynamics and search small spaces.",
        how: "It works by flapping micro-wings 120 times every second.",
        amazing: "The most amazing thing is that it is lighter than a paperclip and can dive underwater!"
      },

      reveal: {
        headline: "World's Smallest Micro-Aerial Vehicle!",
        explanation: "Harvard's RoboBee is real and has pushed the boundaries of micro-robotics. Weighing a fraction of a gram, it uses smart piezoelectric ceramic strips that expand and contract under high voltage, flapping carbon fiber wings at 120 Hz. It helps scientists understand how bees survive gusts of wind and could one day enter collapsed buildings to search for air pockets!",
        jobBadge: "🐝 Micro-Flight Science & Disaster Crevice Scout"
      }
    },

    {
      id: "snake",
      groupNum: 4,
      icon: "🐍",
      secretName: "Mystery Robot Delta",
      name: "The Snake Robot",
      shortTitle: "Snake Robot",
      tagline: "Search & Rescue Slitherer",
      field: "Disaster Robotics & Industrial Inspection",

      mysteryClue: "This long metal serpent has many jointed segments and no wheels or legs. It crawls through narrow pipes and climbs over bricks. What is its heroic real-world purpose?",
      defaultGuesses: {
        what: "A flexible snake-like robot",
        where: "In earthquake ruins, collapsed buildings, and pipes",
        when: "In the 2000s and 2010s",
        who: "Disaster rescue workers, firefighters, and engineers",
        why: "To search for trapped survivors where humans cannot fit",
        how: "By slithering and undulating with motorized joints"
      },

      // Page 4 Reading File (126 words)
      reading: {
        title: "The Heroic Slithering Rescuer",
        text: `The <strong>Snake Robot</strong> is a flexible modular machine created by <strong>rescue roboticists and engineers</strong> at Carnegie Mellon University and in Japan. Progressive models were developed throughout the <strong>2000s and 2010s</strong>.

It is used in <strong>earthquake ruins, collapsed buildings, and underground pipes</strong>. When buildings fall after an earthquake, heavy piles of concrete block human firefighters and rescue dogs. Ordinary wheeled robots get stuck immediately.

Engineers built the snake robot because it can slither through tiny holes as small as a tennis ball. It works with many connected metal segments. Each joint has a motor that bends up, down, and sideways. It carries bright headlights, microphones, and cameras on its head to locate trapped survivors and talk to them.`,
        amazingFact: "It can climb up the inside of a narrow vertical pipe or wrap around a tree branch just like a real python!"
      },

      comprehension: [
        { q: "WHAT is this robot?", wh: "WHAT", answer: "A modular, segmented robot that moves like a snake", options: ["A toy snake that jumps", "A modular, segmented robot that moves like a snake", "A metal bulldozer"] },
        { q: "WHERE is it deployed?", wh: "WHERE", answer: "In earthquake ruins, collapsed buildings, and pipes", options: ["In deep space", "On clean office floors", "In earthquake ruins, collapsed buildings, and pipes"] },
        { q: "WHEN was it developed?", wh: "WHEN", answer: "During the 2000s and 2010s", options: ["In 1900", "During the 2000s and 2010s", "In 2026"] },
        { q: "WHO uses this robot?", wh: "WHO", answer: "Disaster rescue teams and industrial inspectors", options: ["Zookeepers only", "Disaster rescue teams and industrial inspectors", "Bus drivers"] },
        { q: "WHY was it designed?", wh: "WHY", answer: "To enter tiny gaps and find survivors where rescuers cannot fit", options: ["To scare people at night", "To enter tiny gaps and find survivors where rescuers cannot fit", "To eat rodents"] },
        { q: "HOW does it move across rubble?", wh: "HOW", answer: "By bending motorized joints in waves (undulating)", options: ["By spinning big rubber tires", "By jumping on springs", "By bending motorized joints in waves (undulating)"] }
      ],

      factOrGuess: [
        { text: "It can squeeze through holes as small as a tennis ball.", isReal: true, feedback: "✅ REAL! Its thin modular body slips through tiny gaps." },
        { text: "The snake robot sheds its metal skin every spring.", isReal: false, feedback: "❌ GUESS! It is made of durable aircraft aluminum and rubber." },
        { text: "It carries cameras and microphones to locate trapped survivors.", isReal: true, feedback: "✅ REAL! Rescuers use it to see and speak to people in ruins." },
        { text: "The snake robot is venomous and bites rocks.", isReal: false, feedback: "❌ GUESS! It is a rescue tool, not an animal." }
      ],

      presentation: {
        intro: "Our robot is called the Snake Robot.",
        where: "It is used in earthquake ruins, disaster areas, and narrow pipes.",
        who: "It was developed by disaster roboticists and engineers.",
        when: "It was developed during the 2000s and 2010s.",
        why: "It was made to search for trapped survivors where humans cannot fit.",
        how: "It works by bending its motorized joints in flexible waves.",
        amazing: "The most amazing thing is that it can climb vertical pipes and wrap around poles!"
      },

      reveal: {
        headline: "Life-Saving Disaster Search & Rescue Snake!",
        explanation: "Carnegie Mellon's Biorobotics Lab (led by Prof. Howie Choset) and Tokyo Tech developed real snake robots that have been tested in real search-and-rescue disaster sites (such as the 2017 Mexico City earthquake). With 16 or more motorized joints, it slithers over rocks, climbs stairs, and raises its head like a periscope to locate survivors!",
        jobBadge: "🐍 Disaster Search & Rescue Explorer"
      }
    },

    {
      id: "dog",
      groupNum: 5,
      icon: "🐕",
      secretName: "Mystery Robot Epsilon",
      name: "The Robot Dog (Quadruped Explorer)",
      shortTitle: "Robot Dog",
      tagline: "Agile Quadruped Field Inspector",
      field: "Industrial Robotics & Autonomous Navigation",

      mysteryClue: "This four-legged yellow machine walks on stairs, steps over pipes, and can carry cameras through radioactive sites. What is its real-world job?",
      defaultGuesses: {
        what: "A four-legged walking robot dog",
        where: "In factories, construction sites, mines, and dangerous areas",
        when: "Around 2015–2020",
        who: "Safety inspectors, geologists, and emergency teams",
        why: "To walk where wheels fail and keep workers safe from danger",
        how: "With 12 electric motors and instant balance gyro sensors"
      },

      // Page 4 Reading File (128 words)
      reading: {
        title: "The Four-Legged Industrial Explorer",
        text: `The <strong>Robot Dog</strong> (such as <em>Spot</em>) is an agile four-legged machine developed by <strong>roboticists and engineers</strong> at Boston Dynamics and ANYbotics. Commercial industrial models were released around <strong>2019 and 2020</strong>.

It is used in <strong>construction sites, electrical power plants, deep mines, and radioactive zones</strong>. Wheels and tracks get stuck on metal stairs, loose rocks, and slippery pipes. 

Engineers created the robot dog to walk in dangerous places where human workers might get hurt by poison gas, high voltage, or radiation. It works using <strong>12 electric motors</strong> (three in each leg) and gyro sensors that balance it in milliseconds. It has 360-degree cameras that map surroundings in 3D, and an arm that can open heavy metal doors.`,
        amazingFact: "If the robot dog slips on ice or gets knocked over, it rolls over and stands right back up on its feet in two seconds!"
      },

      comprehension: [
        { q: "WHAT is this robot?", wh: "WHAT", answer: "A four-legged quadruped exploration and inspection robot", options: ["A plastic pet toy", "A four-legged quadruped exploration and inspection robot", "A self-driving delivery car"] },
        { q: "WHERE does it work?", wh: "WHERE", answer: "In power plants, construction sites, and hazardous areas", options: ["Only in bedrooms", "In power plants, construction sites, and hazardous areas", "In fish aquariums"] },
        { q: "WHEN was it released for real jobs?", wh: "WHEN", answer: "Around 2019 to 2020", options: ["In 1980", "Around 2019 to 2020", "In 1700"] },
        { q: "WHO created the famous Spot robot dog?", wh: "WHO", answer: "Engineers at Boston Dynamics", options: ["Bicycle mechanics", "Engineers at Boston Dynamics", "Toy car designers"] },
        { q: "WHY was it made?", wh: "WHY", answer: "To walk in dangerous places and protect human workers", options: ["To bark at postal workers", "To walk in dangerous places and protect human workers", "To chase tennis balls"] },
        { q: "HOW does it balance on slippery ground?", wh: "HOW", answer: "With 12 electric leg motors and instant gyro sensors", options: ["With magnets under its paws", "By holding an umbrella", "With 12 electric leg motors and instant gyro sensors"] }
      ],

      factOrGuess: [
        { text: "It can climb stairs and recover its balance if it slips on ice.", isReal: true, feedback: "✅ REAL! Gyro sensors calculate balance thousands of times a second." },
        { text: "The robot dog eats cans of meat and wags its tail for treats.", isReal: false, feedback: "❌ GUESS! It runs on rechargeable lithium-ion battery packs." },
        { text: "It is used in radiation zones like Chernobyl to take measurements.", isReal: true, feedback: "✅ REAL! Real teams deployed Spot in Chernobyl to map radiation safely." },
        { text: "It sleeps in a dog basket with a blanket.", isReal: false, feedback: "❌ GUESS! It parks on a charging dock when not working." }
      ],

      presentation: {
        intro: "Our robot is called the Robot Dog or Spot.",
        where: "It is used in factories, power plants, mines, and construction sites.",
        who: "It was developed by roboticists at Boston Dynamics and ANYbotics.",
        when: "It was released around 2019 and 2020.",
        why: "It was made to inspect dangerous environments to keep humans safe.",
        how: "It works using 12 leg motors, 3D cameras, and auto-balance gyros.",
        amazing: "The most amazing thing is that it can recover from slipping on ice and stand right back up!"
      },

      reveal: {
        headline: "World-Class Agile Industrial Explorer!",
        explanation: "Spot and similar quadruped robots are in active service today. They walk through construction sites to inspect pipe installations, enter high-voltage power substations, and were even sent into Chernobyl to measure radiation levels where human workers cannot safely go. With autonomous path planning and an optional gripper arm, it can open doors and turn valves!",
        jobBadge: "🐕 Industrial Safety & Hazardous Site Inspector"
      }
    }
  ]
};

if (typeof window !== 'undefined') {
  window.ROBOTS_DATA = ROBOTS_DATA;
}
