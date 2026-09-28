/**
 * CHUSEOK: KOREA'S HARVEST FESTIVAL (REVISED ARCHITECTURE)
 * Photorealistic Asset Directions • ElevenLabs v2 Conversational Prompting • Uncluttered UI
 * Unit 2: "Thank You" • Global Readings 2
 * CEFR A2-B1 | Primary / Lower-Intermediate ESL
 */

(function(root) {
  'use strict';

  const CHUSEOK_DATA = {
    meta: {
      id: 'chuseok-festival',
      title: "Chuseok: Korea's Harvest Festival",
      subtitle: "The Weaving Mystery & Honoring Ancestors",
      unit: "Unit 2: Thank You",
      series: "Global Readings 2",
      grade: "Grade 3-5",
      level: "A2 / B1 (Lower Intermediate)",
      duration: "2 x 45 Minutes (90 Mins Total)",
      totalLessons: 2,
      totalSlides: 16,
      totalXP: 250,
      grammarFormula: "Gratitude Expressions: 'I am thankful for my ______ because ______.'",
      clilTopic: "Social Studies & World Cultures: Harvest Celebrations Around the World"
    },

    lessons: [
      {
        id: 1,
        title: "The Weaving Mystery & The Full Moon Feast",
        subtitle: "Lesson 1: Ancient Legends & The King's Challenge",
        slideRange: [1, 8],
        targetVocab: ["weave", "cloth", "contest", "harvest", "festival", "feast"],
        duration: "40-45 mins",
        xpReward: 100
      },
      {
        id: 2,
        title: "Colors, Cakes, and Honoring Ancestors",
        subtitle: "Lesson 2: Modern Traditions & Global Harvests",
        slideRange: [9, 16],
        targetVocab: ["ancestors", "songpyeon", "rice cake", "hanbok", "ceremony", "tradition"],
        duration: "40-45 mins",
        xpReward: 150
      }
    ],

    slides: [
      // ==========================================
      // LESSON 1: SLIDES 1 - 8
      // ==========================================
      {
        id: 1,
        lessonId: 1,
        slideNumber: 1,
        title: "Visual Gratitude Opener: What Are You Holding?",
        type: "photorealistic_opener",
        timing: "00:00 - 04:00 (4 mins)",
        modality: "[ANNOTATE / STAMP] ➔ [SPEAK]",
        summary: "Look closely at these four photos. Each pair of hands is holding something special. What makes your heart happy today?",
        imageSrc: "assets/hands_holding.jpg",
        imageAlt: "Four pairs of hands holding video game controller, soccer ball, honey candies, and miniature house model",
        ssml: `<speak>
  <prosody rate="93%">
    Hello everyone! <break time="300ms"/> Look closely at these four photos. 
    Each pair of hands is holding something special. <break time="400ms"/>
    What makes your heart happy today?
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Warm, gentle maternal cadence, slight breathiness for genuine intimacy (Stability: 0.45, Clarity: 0.85)",
        headerText: "What are you holding?",
        sentenceFrame: "I am thankful for my ____________.",
        items: [
          { id: "game", name: "Game Controller", label: "My Games 🎮" },
          { id: "ball", name: "Leather Football", label: "My Sports ⚽" },
          { id: "sweets", name: "Honey Candies", label: "Good Food 🍬" },
          { id: "home", name: "Cozy House", label: "My Family 🏠" }
        ],
        teacherProtocol: "1. Display slide full-screen. 2. Give 10 seconds for students to stamp a ⭐. 3. Call 2 students: 'Leo, I see your star! Unmute and read: I am thankful for...'"
      },
      {
        id: 2,
        lessonId: 1,
        slideNumber: 2,
        title: "Visual Anchor: Vocabulary (Weave & Cloth)",
        type: "photorealistic_loom",
        timing: "04:00 - 08:00 (4 mins)",
        modality: "[TPR / ACTION] ➔ [CHAT]",
        summary: "Discover how vibrant silk threads are woven on a traditional wooden loom into smooth, luxurious cloth.",
        imageSrc: "assets/loom_weaving.jpg",
        imageAlt: "Hands guiding shuttle through vibrant silk threads on wooden loom alongside rich woven silk cloth",
        ssml: `<speak>
  <prosody rate="85%">
    Let's learn two important words. <break time="300ms"/> 
    First: <emphasis level="strong">Weave</emphasis>. <break time="500ms"/> 
    Hands move back and forth to weave. <break time="600ms"/>
    Next: <emphasis level="strong">Cloth</emphasis>. <break time="500ms"/>
    This beautiful silk is cloth!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Clear enunciation, pedagogical cadence (Stability: 0.50, Clarity: 0.90)",
        vocabCards: [
          { word: "Weave", icon: "🧵", def: "Action: to make fabric with thread", tip: "Hands slide back and forth like a shuttle!" },
          { word: "Cloth", icon: "🧣", def: "Material made by weaving", tip: "Touch your shirt or sleeves—that is cloth!" }
        ],
        sentenceFrame: "They weave soft cloth together.",
        teacherProtocol: "1. Demonstrate weaving hand motion on webcam. 2. Trigger shuttle clack audio. 3. Chat waterfall: '3, 2, 1, Enter! Type WEAVE or CLOTH!'"
      },
      {
        id: 3,
        lessonId: 1,
        slideNumber: 3,
        title: "Low-Anxiety Checkpoint: Mystery Treasure Chests",
        type: "lacquered_chests",
        timing: "08:00 - 12:00 (4 mins)",
        modality: "[CHAT POLL]",
        summary: "Four vintage lacquered wooden Korean chests inlaid with mother-of-pearl. Vote which one to crack open first!",
        ssml: `<speak>
  <prosody rate="98%">
    Four locked chests, <break time="150ms"/> four secret words! 
    Type a number in the chat: one, two, three, or four! 
    Which one should we unlock first?
  </prosody>
</speak>`,
        voicePersona: "Marcus",
        voiceProfile: "Warm, energetic British narrator; engaging, conversational game-show tone",
        chests: [
          { id: 1, icon: "🏆", word: "Contest", def: "A game between two teams to win a prize." },
          { id: 2, icon: "🌾", word: "Harvest", def: "Gathering ripe food and crops at the end of summer." },
          { id: 3, icon: "🎉", word: "Festival", def: "A big celebration with family, music, and food." },
          { id: 4, icon: "🍲", word: "Feast", def: "A giant, delicious celebratory meal for everyone." }
        ],
        teacherProtocol: "1. Open chat waterfall: 'Vote now: 1, 2, 3, or 4!' 2. Click the winning chest. 3. Choral drill the word twice with the entire class."
      },
      {
        id: 4,
        lessonId: 1,
        slideNumber: 4,
        title: "Story Immersion: The 30-Day Weaving Battle",
        type: "weaving_battle",
        timing: "12:00 - 18:00 (6 mins)",
        modality: "[ANNOTATE / COUNTING]",
        summary: "Who can weave the most cloth? Two rival teams enter a fierce month-long contest on their wooden looms!",
        ssml: `<speak>
  <prosody rate="88%">
    Who can weave the most cloth? <break time="400ms"/>
    Two teams have a contest to find out! <break time="500ms"/>
    They weave <break time="150ms"/> and weave <break time="150ms"/> 
    for a whole month!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Expressive narrative reading; clear pauses for lower-intermediate learners",
        passage: "Who can weave the most cloth? Two teams have a contest to find out. They weave and weave for a whole month!",
        prompts: [
          { q: "How long did they weave?", a: "One whole month (30 days)!" },
          { q: "What are they doing?", a: "A weaving contest!" }
        ],
        teams: {
          blue: { name: "Team Blue", rolls: 5 },
          red: { name: "Team Red", rolls: 6 }
        },
        teacherProtocol: "1. Play audio once; students follow with pointer finger. 2. 20-second cloth counting challenge: 'Who can spot more rolls? Team Red or Team Blue?'"
      },
      {
        id: 5,
        lessonId: 1,
        slideNumber: 5,
        title: "Story Climax: The King's Full Moon Feast",
        type: "king_climax",
        timing: "18:00 - 24:00 (6 mins)",
        modality: "[VOICE ACTING CHALLENGE] & [CHAT]",
        summary: "Under the giant autumn harvest moon, the Joseon King in crimson silk robe proclaims the grand prize!",
        imageSrc: "assets/king_moon.jpg",
        imageAlt: "Joseon Dynasty Korean king in crimson dragon robe standing on palace pavilion under glowing full harvest moon",
        ssml: `<speak>
  <prosody rate="85%" pitch="-2st">
    It is the night of the full moon! <break time="400ms"/>
    This team wins! <break time="500ms"/>
    The prize <break time="200ms"/> is a big feast for both teams!
  </prosody>
</speak>`,
        voicePersona: "Callum",
        voiceProfile: "Deep, resonant, dignified older monarch voice; theatrical, authoritative (Stability: 0.60, Style: 0.25, Pitch: -2st)",
        quote: "The prize is a big feast for both teams.",
        choiceQuestion: "Did only the winners eat?",
        choiceAnswer: "NO! Both teams ate together!",
        teacherProtocol: "1. Play the King's audio with royal gong cue. 2. Ask: 'Who has the deepest king voice in class?' Unmute one student. 3. Check chat for 'BOTH'."
      },
      {
        id: 6,
        lessonId: 1,
        slideNumber: 6,
        title: "Low-Stakes Review: Speed Clicker (True or False)",
        type: "photorealistic_tf",
        timing: "24:00 - 30:00 (6 mins)",
        modality: "[CAMERA GESTURE / QUICK POLL]",
        summary: "Three rapid-fire questions testing reading comprehension with thumbs up (True) and thumbs down (False).",
        ssml: `<speak>
  <prosody rate="95%">
    Three quick questions! Is it True, or is it False? 
    Show me your thumbs!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Crisp, friendly prompt delivery",
        questions: [
          { id: 1, text: "The teams had a weaving contest.", correct: true, icon: "🧵", explanation: "True! They competed to weave the most rolls of silk." },
          { id: 2, text: "The King came in the middle of a sunny day.", correct: false, icon: "☀️", explanation: "False! The King arrived on the night of the full moon!" },
          { id: 3, text: "The prize was a big feast for both teams.", correct: true, icon: "🍲", explanation: "True! Both teams celebrated and ate together!" }
        ],
        teacherProtocol: "1. Read statement 1. 2. Scan webcams for thumbs up/down. 3. Re-emphasize that the King arrived under the harvest full moon."
      },
      {
        id: 7,
        lessonId: 1,
        slideNumber: 7,
        title: "Production: The Digital Gratitude Scroll",
        type: "digital_scroll",
        timing: "30:00 - 38:00 (8 mins)",
        modality: "[COLLABORATIVE STICKY BOARD / SPEAK]",
        summary: "Write your heartfelt message on the parchment scroll and share it on the class gratitude wall.",
        ssml: `<speak>
  <prosody rate="90%">
    Chuseok is all about being thankful. 
    Think of one person or thing you love. 
    Let's write our gratitude notes together.
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Warm, inspiring pedagogical tone",
        template: "I am thankful for my ____________ because ____________.",
        wordBank: {
          who: ["family", "home", "pet", "teacher", "friends", "books"],
          why: ["they are kind", "it is warm and safe", "they make me smile", "they help me read"]
        },
        teacherProtocol: "1. Give 90 seconds of quiet typing. 2. Read 4 student notes aloud from the screen with personalized praise."
      },
      {
        id: 8,
        lessonId: 1,
        slideNumber: 8,
        title: "Lesson 1 Milestone: Master Weaver Badge",
        type: "milestone_badge",
        timing: "38:00 - 40:00 (2 mins)",
        modality: "[REACTION CELEBRATION]",
        summary: "Claim your 3D embossed gold medal featuring the harvest moon and loom shuttle on royal blue velvet!",
        ssml: `<speak>
  <prosody rate="95%">
    Congratulations! Lesson 1 is complete! 
    You have unlocked the Master Weaver Badge!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        badge: {
          title: "Master Weaver Badge",
          desc: "Embossed Gold Medal • Harvest Moon & Loom Shuttle",
          icon: "🏅"
        },
        xpAward: 100,
        teaser: "Next Up in Lesson 2: Delicious Songpyeon rice cakes, circle dances, and remembering ancestors!",
        teacherProtocol: "Trigger celebration sound and invite students to flood screen with emojis (🎉, ⭐, 🚀)."
      },

      // ==========================================
      // LESSON 2: SLIDES 9 - 16
      // ==========================================
      {
        id: 9,
        lessonId: 2,
        slideNumber: 1,
        title: "Fast Schema Reactivation: The Mystery Photo Reveal",
        type: "frosted_reveal",
        timing: "00:00 - 04:00 (4 mins)",
        modality: "[CHAT] & [SPEAK]",
        summary: "Unlock the 4 frosted-glass tiles covering the family portrait by recalling yesterday's secret word!",
        imageSrc: "assets/hanbok_family.jpg",
        imageAlt: "Photorealistic Korean family in vibrant silk Hanbok holding woven harvest fruit basket",
        ssml: `<speak>
  <prosody rate="95%">
    Welcome back, explorers! Look at the frosted glass. 
    Who can remember our secret word from yesterday? 
    What did the two teams make on their looms?
  </prosody>
</speak>`,
        voicePersona: "Marcus",
        voiceProfile: "Upbeat, lively narrator",
        puzzleWord: "CLOTH",
        puzzleClue: "C _ _ T H",
        revealedText: "Today, Chuseok is an important holiday in Korea. It lasts three days at the end of summer.",
        teacherProtocol: "1. Trigger Tile 1 reveal once 3 students type CLOTH. 2. Direct visual attention to the family's silk Hanbok clothes."
      },
      {
        id: 10,
        lessonId: 2,
        slideNumber: 2,
        title: "Visual Scaffolding: The Sweet Songpyeon Feast",
        type: "photorealistic_songpyeon",
        timing: "04:00 - 10:00 (6 mins)",
        modality: "[POLL / ANNOTATE]",
        summary: "Culinary macro photograph of steaming half-moon Songpyeon rice cakes on brass platter with honey filling cut open.",
        imageSrc: "assets/songpyeon.jpg",
        imageAlt: "Culinary macro photograph of authentic brass platter with half-moon Songpyeon rice cakes, one cut open with honey dripping",
        ssml: `<speak>
  <prosody rate="88%">
    Look at this delicious feast! <break time="300ms"/> 
    These special rice cakes are called <emphasis level="strong">Songpyeon</emphasis>. <break time="400ms"/>
    They are shaped like a beautiful half-moon, <break time="200ms"/> 
    and inside <break time="150ms"/> they are sweet and chewy!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Warm, sensory, mouth-watering inflection",
        facts: [
          { icon: "🍡", label: "Special Korean rice cakes eaten on Chuseok" },
          { icon: "🌙", label: "Shaped like a beautiful half-moon" },
          { icon: "🍯", label: "Sweet filling: toasted sesame seeds, chestnut paste, honey" },
          { icon: "🌲", label: "Steamed over fresh fragrant pine needles" }
        ],
        sensoryFrame: "Songpyeon is ____________ and ____________. (sweet / chewy / soft / warm)",
        pollQuestion: "Would you like to try eating Songpyeon?",
        teacherProtocol: "1. Zoom in on rice cake texture. 2. Drill: 'Repeat after me: Song-pyeon [song-pyahn]'. 3. Show poll results instantly."
      },
      {
        id: 11,
        lessonId: 2,
        slideNumber: 3,
        title: "Visual Movement: The Midnight Circle Dance (Ganggangsullae)",
        type: "ganggangsullae_view",
        timing: "10:00 - 15:00 (5 mins)",
        modality: "[ANNOTATE] & [SPEAK]",
        summary: "Wide-angle atmospheric photograph of dozens of women and girls holding hands in a massive illuminated circle under the harvest moon.",
        imageSrc: "assets/ganggangsullae.jpg",
        imageAlt: "Atmospheric wide-angle photograph of traditional circular harvest dance Ganggangsullae under glowing full moon",
        ssml: `<speak>
  <prosody rate="90%">
    Under the bright autumn moon, <break time="200ms"/> 
    people wear their brand-new clothes! <break time="300ms"/>
    Women and girls join hands to dance and play games 
    in a giant, spinning circle!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Rhythmic, energetic storytelling with faint acoustic Korean drum rhythm",
        keyPoints: [
          { icon: "👗", text: "New Clothes: People buy fresh new Hanbok to celebrate Chuseok." },
          { icon: "⭕", text: "Circle Dance & Games: Joining hands in unity under the autumn moon!" }
        ],
        discussionPrompt: "Do you dance, sing, or play games at your family's celebrations?",
        teacherProtocol: "1. Have students link hands on screen to form a virtual circle. 2. Highlight: 'New clothes for a holiday symbolize a fresh start!'"
      },
      {
        id: 12,
        lessonId: 2,
        slideNumber: 4,
        title: "Respect & Heritage: Remembering Ancestors (Charye)",
        type: "ancestor_charye_view",
        timing: "15:00 - 22:00 (7 mins)",
        modality: "[DRAG-AND-DROP VOCAB MATCH]",
        summary: "Dignified high-definition photograph of the traditional memorial table ceremony (Charye) with scholar bowing in deep respect.",
        imageSrc: "assets/ancestor_charye.jpg",
        imageAlt: "Korean scholar in Hanbok bowing before ceremonial Charye memorial altar table with harvest fruits and calligraphy screen",
        ssml: `<speak>
  <prosody rate="85%">
    Chuseok is also a time to remember ancestors. <break time="500ms"/>
    Who are ancestors? <break time="300ms"/>
    Ancestors are family members who lived long ago, <break time="200ms"/>
    like great-grandparents. <break time="400ms"/>
    Families bow and offer harvest food <break time="200ms"/>
    to say thank you and show their love.
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Respectful, gentle, reverent pedagogical tone",
        vocabDefinitions: [
          { term: "Ancestors", def: "Family members who lived long ago (like great-grandparents)", icon: "👵👴" },
          { term: "Ceremony (Charye)", def: "Offering harvest food and bowing to show love and respect", icon: "🍎" }
        ],
        targetSentence: "This shows they care about their ____________. (family / ancestors)",
        teacherProtocol: "1. Clearly explain ancestors: 'Raise your hand if you know about your great-grandparents!' 2. Explain bowing as gratitude. 3. Validate student drag matching."
      },
      {
        id: 13,
        lessonId: 2,
        slideNumber: 5,
        title: "Cross-Cultural Bridge: Harvest Around the World",
        type: "venn_comparison",
        timing: "22:00 - 28:00 (6 mins)",
        modality: "[COLLABORATIVE DRAG / SPEAK]",
        summary: "Compare Chuseok harvest traditions with celebrations across the globe using an interactive 3-zone Venn diagram.",
        ssml: `<speak>
  <prosody rate="93%">
    Why do people all around the world celebrate the harvest? 
    Because everyone is thankful for food and family! 
    Is there a special holiday like this where you live?
  </prosody>
</speak>`,
        voicePersona: "Marcus",
        voiceProfile: "Inquisitive, encouraging conversational narrator",
        vennTiles: [
          { id: "v1", text: "Eat special sweet food", defaultZone: "both" },
          { id: "v2", text: "Spend time with family", defaultZone: "both" },
          { id: "v3", text: "Lasts 3 days holiday", defaultZone: "chuseok" },
          { id: "v4", text: "Say thank you for the harvest", defaultZone: "both" }
        ],
        teacherProtocol: "1. Drag 'Spend time with family' to the center (BOTH). 2. Elicit student connections: 'Autumn is when we harvest food and gather together!'"
      },
      {
        id: 14,
        lessonId: 2,
        slideNumber: 6,
        title: "Arcade Mastery Quest: 3-Minute Harvest Dash",
        type: "arcade_dash",
        timing: "28:00 - 33:00 (5 mins)",
        modality: "[GAMIFIED MULTIPLE CHOICE]",
        summary: "Fast 4-question synchronous multiple choice sprint with countdown timer and leaderboard excitement!",
        ssml: `<speak>
  <prosody rate="103%">
    Get ready for the Harvest Sprint! 
    Answer fast, score points, and let's see who climbs to the top of the podium! 
    Ready? Three, two, one, go!
  </prosody>
</speak>`,
        voicePersona: "Marcus",
        voiceProfile: "Fast, energetic game master",
        questions: [
          { q: "What special rice cakes do people eat on Chuseok?", options: ["Songpyeon", "Pizza", "Tacos", "Donuts"], correct: 0 },
          { q: "How many days does the Chuseok holiday last?", options: ["1 day", "3 days", "10 days", "1 month"], correct: 1 },
          { q: "Who are ancestors?", options: ["Family from long ago", "New school friends", "Movie actors", "Tour guides"], correct: 0 },
          { q: "What shape are Songpyeon cakes?", options: ["Half-moon", "Square", "Star", "Triangle"], correct: 0 }
        ],
        teacherProtocol: "1. Launch the 3-minute sprint. 2. Call out live podium changes: 'Lucas takes 1st place! Maria answers all 4 correctly!' 3. Display leaderboard confetti."
      },
      {
        id: 15,
        lessonId: 2,
        slideNumber: 7,
        title: "Production: The Personal Gratitude Harvest",
        type: "gratitude_tree",
        timing: "33:00 - 38:00 (5 mins)",
        modality: "[CHAT EXIT TICKET]",
        summary: "Write your personal harvest gratitude message before closing your lesson.",
        ssml: `<speak>
  <prosody rate="90%">
    You have done an amazing job today! 
    Before we say goodbye, think of one person you want to thank today. 
    Write your message on our class gratitude tree.
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        voiceProfile: "Reflective, gentle educator voice",
        sentenceFrame: "Today, I want to say thank you to ____________ because ____________.",
        examples: [
          "...my mom because she makes delicious breakfast.",
          "...my brother because he plays games with me.",
          "...my teacher because she helps me read."
        ],
        teacherProtocol: "1. Post sentence frame in chat. 2. Read each student message aloud with personalized praise. 3. Give verbal permission to disconnect."
      },
      {
        id: 16,
        lessonId: 2,
        slideNumber: 8,
        title: "Unit 2 Mastery: Cultural Explorer Certificate",
        type: "unit_certificate",
        timing: "38:00 - 40:00 (2 mins)",
        modality: "[HIGH-FIVE CAMERA CHECK]",
        summary: "Claim your embossed Chuseok Cultural Explorer Certificate and give a virtual high-five on webcam!",
        ssml: `<speak>
  <prosody rate="95%">
    Congratulations! You have mastered Unit 2! 
    You are an official Chuseok Cultural Explorer! High five!
  </prosody>
</speak>`,
        voicePersona: "Sarah",
        vocabMastered: ["Weave", "Cloth", "Contest", "Harvest", "Festival", "Feast", "Songpyeon", "Ancestors", "Ceremony"],
        xpAward: 150,
        teacherProtocol: "All students put their hand up to the webcam for a virtual high-five celebration screenshot!"
      }
    ]
  };

  root.CHUSEOK_DATA = CHUSEOK_DATA;
})(typeof window !== 'undefined' ? window : global);
