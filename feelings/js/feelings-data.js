/**
 * "HOW WOULD YOU FEEL?" — Pedagogical Data Registry
 * Level: A1+ Young Learners
 * Focus: Situational Thinking & Communicative Speech Chunks
 */

const FEELINGS_DATA = {
  // 1. Target Emotions Registry
  emotions: [
    // Core 6
    { id: "happy", name: "Happy", icon: "😊", level: "Core", color: "#fef08a", border: "#eab308", gesture: "Big smile & clap hands", chunk: "I'm happy.", wouldChunk: "I'd feel happy." },
    { id: "sad", name: "Sad", icon: "😢", level: "Core", color: "#bfdbfe", border: "#3b82f6", gesture: "Frown & wipe a tear", chunk: "I'm sad.", wouldChunk: "I'd feel sad." },
    { id: "angry", name: "Angry", icon: "😡", level: "Core", color: "#fecaca", border: "#ef4444", gesture: "Cross arms & stamp feet", chunk: "I'm angry.", wouldChunk: "I'd feel angry." },
    { id: "scared", name: "Scared", icon: "😨", level: "Core", color: "#ddd6fe", border: "#8b5cf6", gesture: "Hands on cheeks & shiver", chunk: "I'm scared.", wouldChunk: "I'd feel scared." },
    { id: "hungry", name: "Hungry", icon: "😋", level: "Core", color: "#fed7aa", border: "#f97316", gesture: "Rub tummy & lick lips", chunk: "I'm hungry.", wouldChunk: "I'd feel hungry." },
    { id: "sleepy", name: "Sleepy", icon: "😴", level: "Core", color: "#e2e8f0", border: "#64748b", gesture: "Big yawn & rest head", chunk: "I'm sleepy.", wouldChunk: "I'd feel sleepy." },

    // New A1+ 6
    { id: "excited", name: "Excited", icon: "🤩", level: "A1+", color: "#fbcfe8", border: "#ec4899", gesture: "Jump up and down!", chunk: "I'm excited!", wouldChunk: "I'd feel excited!" },
    { id: "surprised", name: "Surprised", icon: "😲", level: "A1+", color: "#cffafe", border: "#06b6d4", gesture: "Open mouth wide (O-shape)!", chunk: "I'm surprised!", wouldChunk: "I'd feel surprised!" },
    { id: "worried", name: "Worried", icon: "😟", level: "A1+", color: "#fef3c7", border: "#d97706", gesture: "Bite lip & look around", chunk: "I'm worried.", wouldChunk: "I'd feel worried." },
    { id: "bored", name: "Bored", icon: "😐", level: "A1+", color: "#e2e8f0", border: "#94a3b8", gesture: "Rest chin in hand & sigh", chunk: "I'm bored.", wouldChunk: "I'd feel bored." },
    { id: "tired", name: "Tired", icon: "😩", level: "A1+", color: "#fee2e2", border: "#f87171", gesture: "Stretch arms & droop shoulders", chunk: "I'm tired.", wouldChunk: "I'd feel tired." },
    { id: "nervous", name: "Nervous", icon: "😰", level: "A1+", color: "#dbeafe", border: "#2563eb", gesture: "Fidget fingers & deep breath", chunk: "I'm nervous.", wouldChunk: "I'd feel nervous." },

    // Bonus 2
    { id: "embarrassed", name: "Embarrassed", icon: "😳", level: "Bonus", color: "#fecdd3", border: "#f43f5e", gesture: "Blush cheeks & cover face", chunk: "I'm embarrassed.", wouldChunk: "I'd feel embarrassed." },
    { id: "disappointed", name: "Disappointed", icon: "😞", level: "Bonus", color: "#e0e7ff", border: "#6366f1", gesture: "Look down with a slow sigh", chunk: "I'm disappointed.", wouldChunk: "I'd feel disappointed." }
  ],

  // 2. Mystery Faces (Stage 1)
  mysteryFaces: [
    {
      id: "mf-1",
      icon: "😡",
      prompt: "Look at his face! How does he feel?",
      target: "angry",
      targetName: "Angry",
      options: [
        { id: "happy", name: "Happy", icon: "😊" },
        { id: "angry", name: "Angry", icon: "😡" },
        { id: "sleepy", name: "Sleepy", icon: "😴" }
      ]
    },
    {
      id: "mf-2",
      icon: "😨",
      prompt: "Look at her face! How does she feel?",
      target: "scared",
      targetName: "Scared",
      options: [
        { id: "scared", name: "Scared", icon: "😨" },
        { id: "hungry", name: "Hungry", icon: "😋" },
        { id: "excited", name: "Excited", icon: "🤩" }
      ]
    },
    {
      id: "mf-3",
      icon: "🤩",
      prompt: "Look at his sparkling eyes! How does he feel?",
      target: "excited",
      targetName: "Excited",
      options: [
        { id: "bored", name: "Bored", icon: "😐" },
        { id: "excited", name: "Excited", icon: "🤩" },
        { id: "sad", name: "Sad", icon: "😢" }
      ]
    }
  ],

  // 3. Which Feeling Timed Scenarios (Stage 3)
  whichFeelingScenarios: [
    {
      id: "wf-1",
      title: "No Food All Day",
      visual: "🍕🍕🍕",
      desc: "It is 4:00 PM. You haven't eaten breakfast or lunch!",
      question: "How do you feel?",
      answerId: "hungry",
      answerName: "Hungry",
      options: [
        { id: "sleepy", name: "Sleepy", icon: "😴" },
        { id: "hungry", name: "Hungry", icon: "😋" },
        { id: "happy", name: "Happy", icon: "😊" },
        { id: "angry", name: "Angry", icon: "😡" }
      ]
    },
    {
      id: "wf-2",
      title: "Late Night Reading",
      visual: "🛏️🌙🥱",
      desc: "It is midnight and you are still awake reading your book.",
      question: "How do you feel?",
      answerId: "sleepy",
      answerName: "Sleepy",
      options: [
        { id: "excited", name: "Excited", icon: "🤩" },
        { id: "sleepy", name: "Sleepy", icon: "😴" },
        { id: "angry", name: "Angry", icon: "😡" },
        { id: "surprised", name: "Surprised", icon: "😲" }
      ]
    },
    {
      id: "wf-3",
      title: "Huge Thunderstorm",
      visual: "🌩️⚡🌧️",
      desc: "Loud thunder shakes your window and the lights flicker!",
      question: "How do you feel?",
      answerId: "scared",
      answerName: "Scared",
      options: [
        { id: "bored", name: "Bored", icon: "😐" },
        { id: "scared", name: "Scared", icon: "😨" },
        { id: "hungry", name: "Hungry", icon: "😋" },
        { id: "happy", name: "Happy", icon: "😊" }
      ]
    },
    {
      id: "wf-4",
      title: "Winning the Trophy",
      visual: "🏆🎉🌟",
      desc: "Your teacher calls your name: 'First Place Winner!'",
      question: "How do you feel?",
      answerId: "excited",
      answerName: "Excited",
      options: [
        { id: "tired", name: "Tired", icon: "😩" },
        { id: "sad", name: "Sad", icon: "😢" },
        { id: "excited", name: "Excited", icon: "🤩" },
        { id: "nervous", name: "Nervous", icon: "😰" }
      ]
    },
    {
      id: "wf-5",
      title: "Cancelled Picnic",
      visual: "🌧️🧺🚫",
      desc: "You packed sandwiches for the park, but it starts pouring rain.",
      question: "How do you feel?",
      answerId: "sad",
      answerName: "Sad",
      options: [
        { id: "sad", name: "Sad", icon: "😢" },
        { id: "sleepy", name: "Sleepy", icon: "😴" },
        { id: "surprised", name: "Surprised", icon: "😲" },
        { id: "excited", name: "Excited", icon: "🤩" }
      ]
    }
  ],

  // 4. Main 10 Situations (Stage 4)
  // Character expression in visuals MUST be neutral/uncertain, not giving away the emotion!
  mainSituations: [
    {
      id: "sit-1",
      num: 1,
      title: "The Big Present",
      icon: "🎁",
      tag: "Birthday",
      scenario: "It is your birthday. A delivery arrives with a HUGE wrapped box with your name on it!",
      question: "How would you feel?",
      defaultExpected: "I'd feel happy.",
      options: [
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy." },
        { id: "excited", name: "Excited", icon: "🤩", chunk: "I'd feel excited!" },
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "sad", name: "Sad", icon: "😢", chunk: "I'd feel sad." }
      ],
      svgType: "present"
    },
    {
      id: "sit-2",
      num: 2,
      title: "The Big Dog",
      icon: "🐕",
      tag: "Park Adventure",
      scenario: "You are walking in the park and a large dog suddenly runs right toward you!",
      question: "How would you feel?",
      defaultExpected: "I'd feel scared.",
      options: [
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy." },
        { id: "sleepy", name: "Sleepy", icon: "😴", chunk: "I'd feel sleepy." },
        { id: "hungry", name: "Hungry", icon: "😋", chunk: "I'd feel hungry." }
      ],
      svgType: "dog"
    },
    {
      id: "sit-3",
      num: 3,
      title: "A Chicken on the Bed",
      icon: "🐔",
      tag: "Morning Surprise",
      scenario: "You open your eyes in the morning... and a live chicken is sitting on your bed looking at you!",
      question: "How would you feel?",
      defaultExpected: "I'd feel surprised!",
      options: [
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "angry", name: "Angry", icon: "😡", chunk: "I'd feel angry." },
        { id: "sleepy", name: "Sleepy", icon: "😴", chunk: "I'd feel sleepy." }
      ],
      svgType: "chicken"
    },
    {
      id: "sit-4",
      num: 4,
      title: "Frog on Your Head",
      icon: "🐸",
      tag: "Walk to School",
      scenario: "You are walking to school under a tree when PLOP! A green frog lands right on top of your head!",
      question: "How would you feel?",
      defaultExpected: "I'd feel surprised!",
      options: [
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "angry", name: "Angry", icon: "😡", chunk: "I'd feel angry." },
        { id: "happy", name: "Happy", icon: "😂", chunk: "I'd feel happy!" }
      ],
      svgType: "frog"
    },
    {
      id: "sit-5",
      num: 5,
      title: "Two Different Shoes",
      icon: "👟",
      tag: "School Fashion",
      scenario: "You arrive at your classroom and look down: on your left foot is a sneaker, on your right foot is a boot!",
      question: "How would you feel?",
      defaultExpected: "I'd feel embarrassed.",
      options: [
        { id: "embarrassed", name: "Embarrassed", icon: "😳", chunk: "I'd feel embarrassed." },
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy!" },
        { id: "sleepy", name: "Sleepy", icon: "😴", chunk: "I'd feel sleepy." }
      ],
      svgType: "shoes"
    },
    {
      id: "sit-6",
      num: 6,
      title: "Sing in Front of Class",
      icon: "🎤",
      tag: "Music Time",
      scenario: "Your teacher points at you with a microphone and says: 'Come to the front and sing a song alone!'",
      question: "How would you feel?",
      defaultExpected: "I'd feel nervous.",
      options: [
        { id: "nervous", name: "Nervous", icon: "😰", chunk: "I'd feel nervous." },
        { id: "excited", name: "Excited", icon: "🤩", chunk: "I'd feel excited!" },
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy." }
      ],
      svgType: "sing"
    },
    {
      id: "sit-7",
      num: 7,
      title: "The Talking Cat",
      icon: "🐱",
      tag: "Magic Moment",
      scenario: "You are petting your cat at home. Suddenly the cat looks right into your eyes and says: 'HELLO THERE!'",
      question: "How would you feel?",
      defaultExpected: "I'd feel surprised!",
      options: [
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy!" },
        { id: "angry", name: "Angry", icon: "😡", chunk: "I'd feel angry." }
      ],
      svgType: "cat"
    },
    {
      id: "sit-8",
      num: 8,
      title: "Ice Cream Drop",
      icon: "🍦",
      tag: "Summer Snack",
      scenario: "You just bought a double strawberry ice cream cone. You take one step and the scoop falls onto your shoe!",
      question: "How would you feel?",
      defaultExpected: "I'd feel sad.",
      options: [
        { id: "sad", name: "Sad", icon: "😢", chunk: "I'd feel sad." },
        { id: "angry", name: "Angry", icon: "😡", chunk: "I'd feel angry." },
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "hungry", name: "Hungry", icon: "😋", chunk: "I'd feel hungry." }
      ],
      svgType: "icecream"
    },
    {
      id: "sit-9",
      num: 9,
      title: "You Can Fly!",
      icon: "🦸",
      tag: "Superpower",
      scenario: "You jump off your chair... and you do not fall down! You are floating and flying above the room!",
      question: "How would you feel?",
      defaultExpected: "I'd feel excited!",
      options: [
        { id: "excited", name: "Excited", icon: "🤩", chunk: "I'd feel excited!" },
        { id: "surprised", name: "Surprised", icon: "😲", chunk: "I'd feel surprised!" },
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy." }
      ],
      svgType: "fly"
    },
    {
      id: "sit-10",
      num: 10,
      title: "No Phone for a Week",
      icon: "📱",
      tag: "Family Rule",
      scenario: "Your parents hold out their hands and say: 'No smartphones or tablets for one whole week!'",
      question: "How would you feel?",
      defaultExpected: "I'd feel bored.",
      options: [
        { id: "angry", name: "Angry", icon: "😡", chunk: "I'd feel angry." },
        { id: "sad", name: "Sad", icon: "😢", chunk: "I'd feel sad." },
        { id: "bored", name: "Bored", icon: "😐", chunk: "I'd feel bored." },
        { id: "worried", name: "Worried", icon: "😟", chunk: "I'd feel worried." }
      ],
      svgType: "phone"
    }
  ],

  // 5. Harder Thinking Challenge (Stage 5)
  // More than one feeling is valid! Emphasizes personal reaction & expression
  harderThinking: [
    {
      id: "ht-1",
      title: "Huge Roller Coaster",
      icon: "🎢",
      scenario: "You are buckled into a giant roller coaster about to climb a huge 50-meter hill for the very first time.",
      options: [
        { id: "nervous", name: "Nervous", icon: "😰", chunk: "I'd feel nervous." },
        { id: "scared", name: "Scared", icon: "😨", chunk: "I'd feel scared." },
        { id: "excited", name: "Excited", icon: "🤩", chunk: "I'd feel excited!" },
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy." }
      ],
      discussion: "All 4 choices are great answers! Some people love speed, other people feel scared."
    },
    {
      id: "ht-2",
      title: "Winner vs Best Friend",
      icon: "🏆",
      scenario: "You win first place in the art competition, but your best friend worked hard and got last place.",
      options: [
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy for myself." },
        { id: "sad", name: "Sad", icon: "😢", chunk: "I'd feel sad for my friend." },
        { id: "worried", name: "Worried", icon: "😟", chunk: "I'd feel worried about my friend." },
        { id: "excited", name: "Excited", icon: "🤩", chunk: "I'd feel excited about winning." }
      ],
      discussion: "You can feel happy and sad at the same time! That is normal."
    },
    {
      id: "ht-3",
      title: "Birthday Without Best Friend",
      icon: "🎂",
      scenario: "It is your birthday party! You have cake and games, but your best friend caught a cold and cannot come.",
      options: [
        { id: "happy", name: "Happy", icon: "😊", chunk: "I'd feel happy because it's my birthday." },
        { id: "sad", name: "Sad", icon: "😢", chunk: "I'd feel sad without my friend." },
        { id: "disappointed", name: "Disappointed", icon: "😞", chunk: "I'd feel disappointed." },
        { id: "worried", name: "Worried", icon: "😟", chunk: "I'd feel worried about my friend." }
      ],
      discussion: "Disappointed is a bonus word! It means you wanted something nice to happen, but it didn't."
    }
  ],

  // 6. Digital Spin & React (Stage 6)
  // Wheel contains SITUATIONS (not emotions). 2-phase: How feel? -> What do?
  spinnerItems: [
    {
      id: "sp-1",
      label: "Roller Coaster",
      icon: "🎢",
      scenario: "You are on a giant looping roller coaster!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "excited", name: "Excited", icon: "🤩" },
        { id: "scared", name: "Scared", icon: "😨" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "shout", label: "Shout loud!", icon: "😱", chunk: "I'd shout!" },
        { id: "eyes", label: "Close my eyes", icon: "🙈", chunk: "I'd close my eyes." },
        { id: "again", label: "Ride again!", icon: "🎢", chunk: "I'd ride it again!" }
      ]
    },
    {
      id: "sp-2",
      label: "Big Dog",
      icon: "🐕",
      scenario: "A big dog runs straight toward you in the park!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "scared", name: "Scared", icon: "😨" },
        { id: "happy", name: "Happy", icon: "😊" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "run", label: "Run away", icon: "🏃", chunk: "I'd run!" },
        { id: "stay", label: "Stay still", icon: "🧍", chunk: "I'd stay still." },
        { id: "call", label: "Call for help", icon: "📞", chunk: "I'd call for help." }
      ]
    },
    {
      id: "sp-3",
      label: "Huge Present",
      icon: "🎁",
      scenario: "There is a massive wrapped present on the table for you!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "excited", name: "Excited", icon: "🤩" },
        { id: "surprised", name: "Surprised", icon: "😲" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "open", label: "Open it now!", icon: "🎁", chunk: "I'd open it!" },
        { id: "shake", label: "Shake the box", icon: "📦", chunk: "I'd shake the box." },
        { id: "wait", label: "Wait until night", icon: "⏳", chunk: "I'd wait." }
      ]
    },
    {
      id: "sp-4",
      label: "Frog on Head",
      icon: "🐸",
      scenario: "A green frog hops directly onto your head!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "surprised", name: "Surprised", icon: "😲" },
        { id: "scared", name: "Scared", icon: "😨" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "laugh", label: "Laugh out loud", icon: "😂", chunk: "I'd laugh!" },
        { id: "shout", label: "Shout for help", icon: "😱", chunk: "I'd shout!" },
        { id: "pet", label: "Touch the frog", icon: "🐸", chunk: "I'd touch it!" }
      ]
    },
    {
      id: "sp-5",
      label: "Sing in Class",
      icon: "🎤",
      scenario: "The teacher hands you the microphone to sing a song!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "nervous", name: "Nervous", icon: "😰" },
        { id: "excited", name: "Excited", icon: "🤩" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "sing", label: "Sing loudly!", icon: "🎤", chunk: "I'd sing!" },
        { id: "hide", label: "Hide my face", icon: "🙈", chunk: "I'd hide." },
        { id: "smile", label: "Smile and bow", icon: "😊", chunk: "I'd smile." }
      ]
    },
    {
      id: "sp-6",
      label: "Big Storm",
      icon: "🌩️",
      scenario: "Thunder is roaring and lightning flashes outside!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "scared", name: "Scared", icon: "😨" },
        { id: "worried", name: "Worried", icon: "😟" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "hide", label: "Hide under blanket", icon: "🙈", chunk: "I'd hide." },
        { id: "close", label: "Close the curtains", icon: "🚪", chunk: "I'd close the curtains." },
        { id: "watch", label: "Watch from window", icon: "👀", chunk: "I'd watch." }
      ]
    },
    {
      id: "sp-7",
      label: "Difficult Test",
      icon: "📚",
      scenario: "Tomorrow is a big difficult English test!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "nervous", name: "Nervous", icon: "😰" },
        { id: "worried", name: "Worried", icon: "😟" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "study", label: "Study hard", icon: "📚", chunk: "I'd study!" },
        { id: "sleep", label: "Go to sleep early", icon: "😴", chunk: "I'd sleep." },
        { id: "ask", label: "Ask for help", icon: "🙋", chunk: "I'd ask for help." }
      ]
    },
    {
      id: "sp-8",
      label: "No Food",
      icon: "🍕",
      scenario: "You walked 5 miles and have not eaten any food today!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "hungry", name: "Hungry", icon: "😋" },
        { id: "tired", name: "Tired", icon: "😩" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "eat", label: "Eat big pizza", icon: "🍕", chunk: "I'd eat!" },
        { id: "drink", label: "Drink juice", icon: "🥤", chunk: "I'd drink juice." },
        { id: "cook", label: "Cook noodles", icon: "🍲", chunk: "I'd cook." }
      ]
    },
    {
      id: "sp-9",
      label: "No Phone",
      icon: "📱",
      scenario: "No phone, iPad, or computer games for one whole week!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "bored", name: "Bored", icon: "😐" },
        { id: "angry", name: "Angry", icon: "😡" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "play", label: "Play outside", icon: "⚽", chunk: "I'd play outside." },
        { id: "read", label: "Read comic books", icon: "📚", chunk: "I'd read." },
        { id: "sleep", label: "Take a nap", icon: "😴", chunk: "I'd sleep." }
      ]
    },
    {
      id: "sp-10",
      label: "Talking Cat",
      icon: "🐱",
      scenario: "Your pet cat turns to you and says 'HELLO' in English!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "surprised", name: "Surprised", icon: "😲" },
        { id: "excited", name: "Excited", icon: "🤩" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "talk", label: "Talk to the cat", icon: "🗣️", chunk: "I'd say hello!" },
        { id: "video", label: "Record a video", icon: "📱", chunk: "I'd make a video." },
        { id: "run", label: "Run to mom", icon: "🏃", chunk: "I'd run to my mom." }
      ]
    },
    {
      id: "sp-11",
      label: "Ice Cream Falls",
      icon: "🍦",
      scenario: "Your sweet ice cream cone slips and falls onto the pavement!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "sad", name: "Sad", icon: "😢" },
        { id: "angry", name: "Angry", icon: "😡" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "buy", label: "Buy another one", icon: "🍦", chunk: "I'd buy another one." },
        { id: "cry", label: "Cry a little", icon: "😭", chunk: "I'd cry." },
        { id: "clean", label: "Clean my shoe", icon: "👟", chunk: "I'd clean my shoe." }
      ]
    },
    {
      id: "sp-12",
      label: "You Can Fly",
      icon: "🦸",
      scenario: "You leap into the air and suddenly you can fly like a superhero!",
      feelPrompt: "How would you feel?",
      feelings: [
        { id: "excited", name: "Excited", icon: "🤩" },
        { id: "happy", name: "Happy", icon: "😊" }
      ],
      actionPrompt: "What would you do?",
      actions: [
        { id: "high", label: "Fly into clouds", icon: "☁️", chunk: "I'd fly to the clouds!" },
        { id: "wave", label: "Wave to people", icon: "👋", chunk: "I'd wave to friends." },
        { id: "school", label: "Fly to school", icon: "🏫", chunk: "I'd fly to school." }
      ]
    }
  ],

  // 7. Matching Triplet Sets (Stage 7)
  // SITUATION -> FEELING -> ACTION
  matchingTriplets: [
    {
      id: "t1",
      situation: { id: "s-dog", label: "Big Dog", icon: "🐕" },
      feeling: { id: "f-scared", label: "Scared", icon: "😨" },
      action: { id: "a-run", label: "Run!", icon: "🏃" }
    },
    {
      id: "t2",
      situation: { id: "s-test", label: "Big Test", icon: "📚" },
      feeling: { id: "f-nervous", label: "Nervous", icon: "😰" },
      action: { id: "a-study", label: "Study hard", icon: "📖" }
    },
    {
      id: "t3",
      situation: { id: "s-present", label: "Big Present", icon: "🎁" },
      feeling: { id: "f-excited", label: "Excited", icon: "🤩" },
      action: { id: "a-open", label: "Open it!", icon: "🎉" }
    },
    {
      id: "t4",
      situation: { id: "s-icecream", label: "Ice Cream Falls", icon: "🍦" },
      feeling: { id: "f-sad", label: "Sad", icon: "😢" },
      action: { id: "a-cry", label: "Cry", icon: "😭" }
    },
    {
      id: "t5",
      situation: { id: "s-storm", label: "Loud Storm", icon: "🌩️" },
      feeling: { id: "f-scared", label: "Scared", icon: "😨" },
      action: { id: "a-hide", label: "Hide", icon: "🙈" }
    },
    {
      id: "t6",
      situation: { id: "s-night", label: "Midnight", icon: "🌙" },
      feeling: { id: "f-sleepy", label: "Sleepy", icon: "😴" },
      action: { id: "a-sleep", label: "Sleep in bed", icon: "🛏️" }
    }
  ],

  // 8. Feelings Song (Stage 8)
  songVerses: [
    {
      id: "v1",
      trigger: "☀️ Sun is shining bright",
      cue: "When the warm sun comes out...",
      targetEmotion: "happy",
      targetName: "Happy",
      gesture: "😊 Big smile and clap your hands!",
      freq: 523.25
    },
    {
      id: "v2",
      trigger: "🌧️ Rain is pouring down",
      cue: "When the cold rain starts to fall...",
      targetEmotion: "sad",
      targetName: "Sad",
      gesture: "😢 Frown and wipe away a tear!",
      freq: 440.00
    },
    {
      id: "v3",
      trigger: "🍽️ Tummy makes a sound",
      cue: "When your tummy starts to rumble...",
      targetEmotion: "hungry",
      targetName: "Hungry",
      gesture: "😋 Rub your tummy and lick your lips!",
      freq: 493.88
    },
    {
      id: "v4",
      trigger: "🌩️ Lightning in the sky",
      cue: "When the loud thunder cracks...",
      targetEmotion: "scared",
      targetName: "Scared",
      gesture: "😨 Put hands on cheeks and shiver!",
      freq: 392.00
    },
    {
      id: "v5",
      trigger: "🛏️ Moon is glowing high",
      cue: "When the bright stars come out...",
      targetEmotion: "sleepy",
      targetName: "Sleepy",
      gesture: "😴 Give a giant yawn and close your eyes!",
      freq: 349.23
    }
  ],

  // 9. Boss Challenge Cards (Stage 9)
  bossCards: [
    { id: "b1", icon: "🐸", situation: "A frog jumps on your head!", feel: "Surprised!", action: "I'd laugh!" },
    { id: "b2", icon: "🎁", situation: "A giant present arrives!", feel: "Excited!", action: "I'd open it!" },
    { id: "b3", icon: "📚", situation: "Big grammar test tomorrow!", feel: "Nervous!", action: "I'd study!" },
    { id: "b4", icon: "🐕", situation: "A big dog runs at you!", feel: "Scared!", action: "I'd run!" },
    { id: "b5", icon: "🍦", situation: "Your ice cream drops on your shoe!", feel: "Sad!", action: "I'd cry!" },
    { id: "b6", icon: "🎤", situation: "Teacher says: 'Come sing!'", feel: "Nervous!", action: "I'd sing!" }
  ]
};

if (typeof window !== 'undefined') {
  window.FEELINGS_DATA = FEELINGS_DATA;
}
