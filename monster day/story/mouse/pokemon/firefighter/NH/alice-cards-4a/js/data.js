/**
 * Alice in Wonderland: Mad Tea Party Double-Sided Character Trading Cards
 * Multi-Class Curriculum Database (Class 4-A: 18 Students & Class 4-B: 19 Students)
 */

// ========================================================
// CLASS 4-A: CAST ROSTER (18 STUDENTS)
// ========================================================
const CLASS_4A_CARDS_DATA = [
  {
    id: "4a-alice-ipek",
    number: 1,
    classId: "4a",
    name: "ALICE",
    title: "Alice Kingsleigh (Lead Role)",
    actor: "İpek",
    role: "The Unconquerable Dreamer & Champion",
    act: "Act I: Victorian Garden & Act IV: Royal Climax",
    actNumber: 1,
    themeColor: "#2563eb",
    accentColor: "#60a5fa",
    stats: { teaPower: 90, madness: 94, courage: 99 },
    specialAbility: {
      name: "Muchness Surge",
      description: "Reclaims her true self, stands tall against societal conformity, and wields the Vorpal determination to awaken Underland."
    },
    vocalTone: "Clear, earnest, curious, shifting from polite Victorian hesitation to resolute confidence.",
    keyLines: [
      "It’s no use going back to yesterday, because I was a different person then.",
      "I know who I am now. I am Alice, and this is my dream!"
    ],
    speakingPrompt: "Alice politely challenges stopped clocks, refuses to be told she is not quite Alice, and asserts her own identity against nonsensical rules.",
    stageAction: "Stands up abruptly in defiance of Hamish: 'It is my life! Why must everyone decide what I ought to be?'",
    openingLine: "It is my life! Why must everyone decide what I ought to be?",
    interactionCue: {
      triggerCharacter: "Hamish Ascot (Emir E.)",
      triggerLine: "Ah, Alice. A habit we shall promptly cure after our union.",
      actionInstruction: "Step forward, turn away from the table in defiance, and declare:",
      responseLine: "It is my life! Why must everyone decide what I ought to be?"
    },
    costume: [
      "Victorian cornflower-blue puff-sleeve tea dress with white peter-pan collar",
      "Crisp white pinafore apron with delicate lace trim & floral embroidery",
      "Matching sky-blue satin bow hairband & white stockings"
    ],
    props: [
      "Antique ornamental brass skeleton key",
      "Delicate floral porcelain teacup with matching saucer"
    ],
    image: "assets/characters/alice.jpg"
  },
  {
    id: "4a-white-queen-1-iclal",
    number: 2,
    classId: "4a",
    name: "WHITE QUEEN 1",
    title: "Mirana of Marmoreal (Grace of Peace)",
    actor: "İclal",
    role: "Ethereal Sovereign of Marmoreal (Part 1)",
    act: "Act II & III: The Alchemical Garden",
    actNumber: 2,
    themeColor: "#475569",
    accentColor: "#cbd5e1",
    stats: { teaPower: 94, madness: 85, courage: 88 },
    specialAbility: {
      name: "Alchemical Elixir",
      description: "Prepares restoring cordials of buttercups and falling stars to protect Alice and heal the wounded creatures of Underland."
    },
    vocalTone: "Melodic, whisper-soft, floating her words with serene grace while hiding an unyielding will.",
    keyLines: [
      "It is a poor sort of memory that only works backwards.",
      "Every potion requires balance: a pinch of starlight and a drop of courage."
    ],
    speakingPrompt: "Welcomes Alice with gentle majesty, offers eccentric recipe advice for magical cordials, and speaks of the prophecy of peace.",
    stageAction: "Glides serenely forward, holding a crystalline potion vial aloft to catch the stage light.",
    openingLine: "It is a poor sort of memory that only works backwards.",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "I can't believe impossible things! ...Or can I?",
      actionInstruction: "Glide forward, offer the glowing crystalline vial, and whisper:",
      responseLine: "It is a poor sort of memory that only works backwards."
    },
    costume: [
      "Ornate pearl-and-diamond crown tiara",
      "Standing white lace Medici collar & ivory brocade gown",
      "Delicate sheer white lace fingerless gloves"
    ],
    props: [
      "Crystalline potion vial with silver dropper stopper",
      "Silver chalice with alchemical mist"
    ],
    image: "assets/characters/white-queen.jpg"
  },
  {
    id: "4a-white-queen-2-simal",
    number: 3,
    classId: "4a",
    name: "WHITE QUEEN 2",
    title: "Mirana of Marmoreal (Crown of Prophecy)",
    actor: "Şimal",
    role: "Rightful Sovereign & Champion's Guide (Part 2)",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#334155",
    accentColor: "#94a3b8",
    stats: { teaPower: 93, madness: 82, courage: 94 },
    specialAbility: {
      name: "Harmonic Prophecy",
      description: "Unveils the sacred Oraculum scroll, inspiring the champion to defeat the Jabberwocky and end the tyrant's reign."
    },
    vocalTone: "Resolute, regal, inspiring, speaking with ethereal calmness that quiets all fury.",
    keyLines: [
      "We must prepare the champion. Everything has its balance.",
      "Your reign of fear ends at this table, sister. The champion has found her muchness."
    ],
    speakingPrompt: "Rallies Underland for the Frabjous Day, stands beside Alice before the Red Queen, and dispels draconic terror with serene authority.",
    stageAction: "Glides gracefully downstage, raising hands to cast a calming aura between Alice and the Red Queen.",
    openingLine: "Your reign of fear ends at this table, sister. The champion has found her muchness.",
    interactionCue: {
      triggerCharacter: "Dragon / Jabberwocky (Emir B.)",
      triggerLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl!",
      actionInstruction: "Step gracefully between Dragon and Alice, raise your palms, and declare:",
      responseLine: "Your reign of fear ends at this table, sister. The champion has found her muchness."
    },
    costume: [
      "Crown tiara & white lace Elizabethan collar",
      "Embroidered silver brocade gown featuring chess piece filigree",
      "Pearl cocktail rings and velvet court mantle"
    ],
    props: [
      "Oversized carved white alabaster chess queen piece",
      "Oraculum prophecy scroll of Marmoreal"
    ],
    image: "assets/characters/white-queen.jpg"
  },
  {
    id: "4a-white-rabbit-bahriye",
    number: 4,
    classId: "4a",
    name: "WHITE RABBIT",
    title: "Nivens McTwisp",
    actor: "Bahriye",
    role: "Frantic Royal Herald & Timekeeper",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#d97706",
    accentColor: "#fcd34d",
    stats: { teaPower: 82, madness: 76, courage: 70 },
    specialAbility: {
      name: "Ticking Sprint",
      description: "Dodges danger at double-time while reading proclamations without missing a syllable."
    },
    vocalTone: "High-pitched, breathless, twitchy, speaking in frantic bursts while gasping for air.",
    keyLines: [
      "I’m late! I’m late! For a very important date!",
      "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    ],
    speakingPrompt: "Frantically paces checking a giant pocket watch, delivers jumbled proclamations, and nervously urges Alice into the Rabbit Hole.",
    stageAction: "Sprints frantically across the apron checking a giant pocket watch: 'No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!'",
    openingLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "It is my life! Why must everyone decide what I ought to be?",
      actionInstruction: "Sprint across the stage apron, clutch your giant watch, and gasp:",
      responseLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    },
    costume: [
      "Faux-fur rabbit ears headband with pink inner velvet lining",
      "Theatrical whiskers and pink rabbit nose makeup",
      "White lace jabot cravat with miniature pocket watch cameo brooch",
      "Damask brocade vest & beige velvet tailcoat with lace cuffs"
    ],
    props: [
      "Giant gold pocket watch on heavy chain",
      "Parchment royal proclamation scroll tied with red wax seal"
    ],
    image: "assets/characters/white-rabbit.jpg"
  },
  {
    id: "4a-cat-1-ayla",
    number: 5,
    classId: "4a",
    name: "CAT (THE GRIN)",
    title: "Chessur the Cheshire Cat (The Smile)",
    actor: "Ayla",
    role: "Enigmatic Riddle-Weaver of the Woods",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#7c3aed",
    accentColor: "#c084fc",
    stats: { teaPower: 88, madness: 99, courage: 87 },
    specialAbility: {
      name: "Grin Dispersal",
      description: "Fades into transparent air, leaving behind an inescapable paradoxical riddle and a floating smile."
    },
    vocalTone: "Silky, purring, hypnotic, lingering over words with an enigmatic, knowing smirk.",
    keyLines: [
      "We’re all mad here. I’m mad. You’re mad.",
      "If you don't care much where you want to get to, it doesn't matter which way you walk!"
    ],
    speakingPrompt: "Appears from behind guests with a teasing grin, taunts Alice with circular directions, and mocks logic before vanishing.",
    stageAction: "Steps out from behind an antique backdrop holding a painted grin mask: 'Every path leads somewhere, Hatter... if only you walk long enough to get there.'",
    openingLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there.",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Kemal)",
      triggerLine: "If only someone knew the path to Marmoreal...",
      actionInstruction: "Step forward from the shadows, lower your grin mask, and purr:",
      responseLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there."
    },
    costume: [
      "Plum velvet cat-ear headband with dangling pocket watches",
      "Striped violet velvet frock coat with jagged clown collar",
      "Cat-silhouette tapestry vest & purple-and-magenta striped trousers",
      "Fingerless mitts with pink paw pads & long plush striped cat tail"
    ],
    props: [
      "Handheld painted Cheshire Cat grin mask on a brass wand",
      "Miniature winged dragon trinket",
      "'To Wonderland' signpost"
    ],
    image: "assets/characters/cheshire-cat.jpg"
  },
  {
    id: "4a-cat-2-emir-ali",
    number: 6,
    classId: "4a",
    name: "CAT (THE SHADOW)",
    title: "Chessur the Phantom Guide (The Shadow)",
    actor: "Emir Ali",
    role: "Shadow Illusionist & Paradox Guide",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#6d28d9",
    accentColor: "#a855f7",
    stats: { teaPower: 87, madness: 98, courage: 89 },
    specialAbility: {
      name: "Shadow Prowl",
      description: "Slips silently through tree branches, reappearing at unexpected vantage points with paradoxical truths."
    },
    vocalTone: "Deep, purring, mocking, blending theatrical whisper with quiet chuckles.",
    keyLines: [
      "I growl when I'm pleased, and wag my tail when I'm angry. Therefore I'm mad!",
      "Who says reality is real? Certainly not a cat!"
    ],
    speakingPrompt: "Prowls quietly behind the tea table, vanishing behind tree trunks and offering perplexing directions to confused travelers.",
    stageAction: "Prowls silently from the shadows, pointing paws in opposing directions with theatrical slyness.",
    openingLine: "I growl when I'm pleased and wag when I'm angry! Who says reality is real? Certainly not a cat!",
    interactionCue: {
      triggerCharacter: "Cat (The Grin) (Ayla)",
      triggerLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there.",
      actionInstruction: "Prowl forward from the opposite wing, circle the tea table, and whisper:",
      responseLine: "I growl when I'm pleased and wag when I'm angry! Who says reality is real? Certainly not a cat!"
    },
    costume: [
      "Olive green velvet cat ears with dangling pocket watches",
      "Forest green velvet tailcoat with long spiraled tail",
      "Clockwork vest with fish brooch & pleated clown ruff collar",
      "Dark velvet paw mitts & striped socks"
    ],
    props: [
      "Miniature clockwork rabbit house music box",
      "Antique fish-shaped table clock",
      "Tiny potion vial labeled 'Drink Me'"
    ],
    image: "assets/characters/dinah.jpg"
  },
  {
    id: "4a-sister-belis",
    number: 7,
    classId: "4a",
    name: "ALICE'S SISTER",
    title: "Margaret Kingsleigh",
    actor: "Belis",
    role: "Dutiful Sister & High-Society Diplomat",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#0284c7",
    accentColor: "#38bdf8",
    stats: { teaPower: 79, madness: 64, courage: 75 },
    specialAbility: {
      name: "Sisterly Protocol",
      description: "Smooths over unconventional remarks and shields Alice from public embarrassment with gentle, anxious poise."
    },
    vocalTone: "Soft, anxious, elder-sisterly, balancing strict Victorian propriety with genuine affection.",
    keyLines: [
      "Alice, pay attention. What is the use of a book without pictures or conversations?",
      "Please, Alice, just smile today. Mother has spent weeks arranging this."
    ],
    speakingPrompt: "Urges Alice to stop daydreaming and fix her stockings, confiding in whispers about societal sacrifices.",
    stageAction: "Glides in carrying an antique book, sitting beside Alice with sisterly care: 'Please, Alice, just smile today. Mother has spent weeks arranging this.'",
    openingLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
    interactionCue: {
      triggerCharacter: "Alice's Mother (Ada)",
      triggerLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      actionInstruction: "Grasp Alice's hands urgently, lean in close, and whisper:",
      responseLine: "Please, Alice, just smile today. Mother has spent weeks arranging this."
    },
    costume: [
      "Cornflower blue velvet Victorian day dress with gathered puff shoulders",
      "Delicate cream lace collar pinned with antique cameo brooch",
      "Gibson Girl hair bun woven with small pearl pins"
    ],
    props: [
      "Antique leather-bound illustrated volume of Victorian poetry",
      "Lace-edged embroidered handkerchief"
    ],
    image: "assets/characters/margaret.jpg"
  },
  {
    id: "4a-mother-ada",
    number: 8,
    classId: "4a",
    name: "ALICE'S MOTHER",
    title: "Helen Kingsleigh",
    actor: "Ada",
    role: "Imperious Matriarch of the Kingsleigh Estate",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#831843",
    accentColor: "#f472b6",
    stats: { teaPower: 87, madness: 69, courage: 83 },
    specialAbility: {
      name: "Matriarch's Command",
      description: "Commands spinal alignment and silence across the terrace with an icy stare and a sharp snap of her folding fan."
    },
    vocalTone: "Regally composed, crisp, sharp, masking social anxiety behind perfect Victorian etiquette.",
    keyLines: [
      "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      "Smile, Alice. The world is watching, and propriety demands grace."
    ],
    speakingPrompt: "Straightens Alice's shoulders with stern perfectionism, lectures on marriage and tea manners, and demands adherence to high society rules.",
    stageAction: "Straightens Alice’s shoulders and collar with stern perfectionism: 'Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.'",
    openingLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
    interactionCue: {
      triggerCharacter: "Garden Party Chimes (Sound Cue)",
      triggerLine: "(Stage Direction: Garden chimes ring for guest arrival)",
      actionInstruction: "Grip Alice’s shoulders firmly, pull her posture upright, and command:",
      responseLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive."
    },
    costume: [
      "Deep wine-burgundy crushed-velvet Victorian matriarch gown",
      "Standing cream lace collar, lace mitt gloves & pearl droplet earrings",
      "Pearl hair combs holding an immaculate Victorian coiffure"
    ],
    props: [
      "Antique painted folding handheld fan with lace trim",
      "Gold open-faced pocket watch on lapel pin"
    ],
    image: "assets/characters/helen.jpg"
  },
  {
    id: "4a-bayard-efe",
    number: 9,
    classId: "4a",
    name: "BAYARD DOG",
    title: "Bayard the Bloodhound",
    actor: "Efe",
    role: "Loyal Scent-Tracker & Underland Scout",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#78350f",
    accentColor: "#fde047",
    stats: { teaPower: 84, madness: 80, courage: 96 },
    specialAbility: {
      name: "True Compass Scent",
      description: "Tracks hidden paths through dark woods, detecting card soldiers miles away and warning champions before danger strikes."
    },
    vocalTone: "Deep, weary, gravelly, carrying the sorrow of an enslaved hound doing his duty.",
    keyLines: [
      "Follow the scent... The Red Queen holds my pups hostage, but my heart belongs to the true Queen.",
      "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    ],
    speakingPrompt: "Drops to one knee sniffing stage planks, howls warnings of approaching Red Queen patrols, and urges Alice toward Marmoreal.",
    stageAction: "Bounds in low, tracking the floor with nose, holding compass high: 'Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!'",
    openingLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
    interactionCue: {
      triggerCharacter: "Marching Drums (Sound Cue)",
      triggerLine: "(Stage Direction: Offstage marching drums sound)",
      actionInstruction: "Drop onto one knee, press your ear to the stage floor, raise your brass compass, and bellow:",
      responseLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    },
    costume: [
      "Russet hound-ear fur-lined hood with long drooping ears",
      "Weathered russet leather duster coat with road grime smudges",
      "Antler-buttoned waistcoat & fingerless leather paw mitts"
    ],
    props: [
      "Heavy antique nautical brass compass on a chain",
      "Distressed parchment map of Underland"
    ],
    image: "assets/characters/bayard.jpg"
  },
  {
    id: "4a-mad-hatter-kemal",
    number: 10,
    classId: "4a",
    name: "MAD HATTER",
    title: "Tarrant Hightopp",
    actor: "Kemal",
    role: "Mercurial Chronomancer & Tea Host",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#4f46e5",
    accentColor: "#818cf8",
    stats: { teaPower: 100, madness: 100, courage: 86 },
    specialAbility: {
      name: "Time Freeze Feud",
      description: "Freezes clocks at 6:00 in an endless cycle of tea refills, buttered watches, and unsolvable riddles."
    },
    vocalTone: "Mercurial, rapid-fire, switching instantly from manic laughter to deep, solemn gravity.",
    keyLines: [
      "Why is a raven like a writing desk? All the best people are bonkers.",
      "No room! No room! There's no room at all!"
    ],
    speakingPrompt: "Inspects pocket watches with butter knives, demands tea before drinking, debates Time, and rallies the tea table for the Frabjous Day.",
    stageAction: "Inspects pocket watch with butter knife, leaping up from chair: 'No room! No room! There's no room at all!'",
    openingLine: "No room! No room! There's no room at all!",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "I'm looking for a place to sit, if you please...",
      actionInstruction: "Leap from your chair, wave your butter knife, and shout:",
      responseLine: "No room! No room! There's no room at all!"
    },
    costume: [
      "Peacock-feathered royal blue damask silk top hat with authentic '10/6' price card",
      "Oversized emerald silk bowtie & gold/green brocade waistcoat",
      "Deep navy velvet tailcoat & fingerless striped wrist warmers"
    ],
    props: [
      "Polished silver teapot & antique butter knife",
      "Vintage pocket watch with open mechanism",
      "Fine china teacup with matching saucer"
    ],
    image: "assets/characters/mad-hatter.jpg"
  },
  {
    id: "4a-red-queen-derin",
    number: 11,
    classId: "4a",
    name: "RED QUEEN",
    title: "Iracebeth of Crims",
    actor: "Derin",
    role: "Tyrannical Monarch of Underland",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#991b1b",
    accentColor: "#f87171",
    stats: { teaPower: 76, madness: 91, courage: 95 },
    specialAbility: {
      name: "Execution Mandate",
      description: "Issues an explosive royal decree that strikes terror into all subjects, paralyzing opposition with sheer tyrannical authority."
    },
    vocalTone: "Shrill, explosive, haughty, delivering every phrase like an unchallengeable royal decree.",
    keyLines: [
      "Off with their heads! I’d far rather be feared than loved.",
      "Someone has stolen my tarts, and someone will lose their head!"
    ],
    speakingPrompt: "Barges into the tea party with scepter swinging, accuses everyone of treason, demands tarts, and threatens decapitation.",
    stageAction: "Sweeps downstage in high fury, pointing heart scepter at guests: 'Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!'",
    openingLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!",
    interactionCue: {
      triggerCharacter: "Bayard (Efe)",
      triggerLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
      actionInstruction: "Storm center stage immediately behind Bayard, slam your scepter down, and roar:",
      responseLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!"
    },
    costume: [
      "Heart-shaped Elizabethan updo crowned with ruby tiara",
      "Pleated dark burgundy Elizabethan ruff collar",
      "Crimson velvet gown with gold heart crest & corseted bodice",
      "Red/black striped inner sleeves & ruby cocktail rings"
    ],
    props: [
      "Ruby heart-headed royal scepter",
      "Oversized gilded Queen of Hearts playing card",
      "Ornate tart basket"
    ],
    image: "assets/characters/red-queen.jpg"
  },
  {
    id: "4a-sister-1-defne",
    number: 12,
    classId: "4a",
    name: "THE TWO SISTERS (1)",
    title: "Sister Elsie (Treacle Well Duo)",
    actor: "Defne",
    role: "Contrarian Scholar of Nonsense Fables (Tweedle Adaptation)",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#84cc16",
    accentColor: "#d9f99d",
    stats: { teaPower: 86, madness: 95, courage: 79 },
    specialAbility: {
      name: "Treacle Riddle",
      description: "Weaves dizzying nonsense fables of three sisters living at the bottom of a treacle well, confusing listeners into circular logic."
    },
    vocalTone: "Bouncy, rhythmic, argumentative, speaking at double-speed while gesturing wildly.",
    keyLines: [
      "Contrariwise! If it was so, it might be; and if it were so, it would be; but as it isn’t, it ain’t! That’s logic!",
      "Once upon a time there were three little sisters, and they lived at the bottom of a well!"
    ],
    speakingPrompt: "Argues with sister Lacie over who gets to greet the guest first, challenges Alice's concept of direction, and recites treacle fables.",
    stageAction: "Marches shoulder-to-shoulder with Sister Lacie, matching steps mechanically, swinging giant wooden button.",
    openingLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "Excuse me, I'm trying to follow the path through the forest...",
      actionInstruction: "March into Alice's path, wave your giant button, and proclaim:",
      responseLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!"
    },
    costume: [
      "Bright green bowler hat adorned with hanging brass bell",
      "Striped purple-and-green Victorian frock coat with wide collar",
      "Tapestry floral vest, oversized floppy bowtie & painted cheek discs"
    ],
    props: [
      "Oversized 6-inch carved wooden button with twine",
      "Stack of antique brass clockwork gears",
      "Treacle jar prop"
    ],
    image: "assets/characters/tweedledum.jpg"
  },
  {
    id: "4a-sister-2-esila",
    number: 13,
    classId: "4a",
    name: "THE TWO SISTERS (2)",
    title: "Sister Lacie (Treacle Well Duo)",
    actor: "Esila",
    role: "Stubborn Herald of Contradiction & Tolls (Tweedle Adaptation)",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#65a30d",
    accentColor: "#bef264",
    stats: { teaPower: 86, madness: 95, courage: 79 },
    specialAbility: {
      name: "Nohow Toll",
      description: "Demands ridiculous greeting ceremonies and toll handshakes before allowing anyone to advance a single step."
    },
    vocalTone: "Mirroring Sister Elsie's cadence, interrupting with stubborn, comedic defiance.",
    keyLines: [
      "Nohow! And what’s more, you began it! The first thing in a visit is to say ‘How d’ye do?’",
      "Speak English, sister, nobody can understand your nonsense!"
    ],
    speakingPrompt: "Contradicts everything Elsie states, accuses her of ruining the poetry recitation, and insists Alice choose which sister is smarter.",
    stageAction: "Elbows Sister Elsie out of the way, ringing a handheld brass bell with sharp comedic timing.",
    openingLine: "Nohow! And what’s more, you ought to pay toll before taking another step!",
    interactionCue: {
      triggerCharacter: "The Two Sisters 1 (Defne)",
      triggerLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!",
      actionInstruction: "Ring your brass bell in Elsie's ear, turn to Alice, and shout:",
      responseLine: "Nohow! And what’s more, you ought to pay toll before taking another step!"
    },
    costume: [
      "Matching emerald green bowler hat with side bell",
      "Striped Edwardian jacket, tapestry vest & oversized bowtie",
      "Rosy round cheek rosettes & striped wrist mitts"
    ],
    props: [
      "Polished handheld brass school bell",
      "Vintage umbrella with duck-head handle"
    ],
    image: "assets/characters/tweedledee.jpg"
  },
  {
    id: "4a-bandersnatch-ruzgar",
    number: 14,
    classId: "4a",
    name: "BANDERSNATCH",
    title: "Beast of the Frumious Woods",
    actor: "Rüzgar",
    role: "Fierce Guardian of the Underland Keys",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#0f766e",
    accentColor: "#2dd4bf",
    stats: { teaPower: 73, madness: 77, courage: 97 },
    specialAbility: {
      name: "Beast Compassion",
      description: "Breaks free from the Red Queen's cruelty when shown kindness, turning razor claws into an unbreakable shield for the champion."
    },
    vocalTone: "Low, guttural growls and snarls shifting slowly into rough, protective warmth.",
    keyLines: [
      "Grrr... Give me back my eye! ...You bandaged my wound? No one has ever shown me kindness.",
      "I guard the key. Touch it and bleed."
    ],
    speakingPrompt: "Circles the tea table sniffing guests, bares claws at sudden moves, then kneels before Alice offering dungeon keys for compassion.",
    stageAction: "Emerges snarling on all fours with extended beast claws, stalking toward Alice before freezing in recognition.",
    openingLine: "(A deep snarl softening into spoken speech) The girl with the gentle hands... you healed my eye when she gave me chains.",
    interactionCue: {
      triggerCharacter: "Red Queen (Derin)",
      triggerLine: "Tear them to ribbons, my beast!",
      actionInstruction: "Stalk toward Alice snarling, stop inches away, lower your claws, and whisper:",
      responseLine: "The girl with the gentle hands... you healed my eye when she gave me chains."
    },
    costume: [
      "Green reptilian scale facial stage makeup across cheekbones",
      "Heavy hooded crushed-velvet textured robe with dense fur trim",
      "Metallic gauntlet with articulated brass razor claws"
    ],
    props: [
      "Heavy iron ring with oversized Underland dungeon keys",
      "Faux leather beast collar with broken chains"
    ],
    image: "assets/characters/bandersnatch.jpg"
  },
  {
    id: "4a-absolem-elif",
    number: 15,
    classId: "4a",
    name: "ABSOLEM",
    title: "Absolem the Blue Caterpillar",
    actor: "Elif",
    role: "Omniscient Oracle of the Sacred Mushroom",
    act: "Act II & III: The Mushroom Forest",
    actNumber: 2,
    themeColor: "#1d4ed8",
    accentColor: "#60a5fa",
    stats: { teaPower: 91, madness: 96, courage: 86 },
    specialAbility: {
      name: "Chrysalis Metamorphosis",
      description: "Blows ethereal rings of smoke that reveal the future, asking the eternal question that shatters illusions: 'Who... are... you?'"
    },
    vocalTone: "Deep, languid, hypnotic, stretching vowels like billowing smoke rings.",
    keyLines: [
      "Who... are... you?",
      "You’re not Alice yet... but you will be. The chrysalis always breaks.",
      "One side will make you grow taller, the other side will make you grow shorter. Of the mushroom, of course!"
    ],
    speakingPrompt: "Challenges Alice’s identity as she stumbles into the glade, chides her for forgetting who she is, and recites prophecy before curling into a chrysalis.",
    stageAction: "Sits perched regally on an oversized mushroom cushion, slowly drawing on a hookah pipe and blowing smoke rings into the air.",
    openingLine: "Who... are... you?",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "I hardly know who I am just at present, sir!",
      actionInstruction: "Take a slow, languid draw from your hookah pipe, lean forward through the smoke rings, and intone:",
      responseLine: "Who... are... you?"
    },
    costume: [
      "Iridescent royal blue and emerald velvet robe with gold filigree trim",
      "Multi-layered silk ascot & round wire reading spectacles",
      "Curled blue velvet antennae headpiece"
    ],
    props: [
      "Antique carved brass and glass hookah pipe (or stage bubble wand)",
      "Miniature illuminated mushroom prop",
      "Blue parchment scroll of Underland prophecy"
    ],
    image: "assets/characters/absolem.jpg"
  },
  {
    id: "4a-march-hare-ahmet",
    number: 16,
    classId: "4a",
    name: "MARCH HARE",
    title: "Thackery Earwicket",
    actor: "Ahmet",
    role: "Erratic Co-Host of the Mad Tea Table",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#15803d",
    accentColor: "#4ade80",
    stats: { teaPower: 97, madness: 98, courage: 81 },
    specialAbility: {
      name: "Clean Cup Protocol",
      description: "Forces everyone to abruptly scramble one seat to the left, overturning teacups and tossing imaginary sugar across the table."
    },
    vocalTone: "Jittery, eccentric, shouting sudden non-sequiturs, followed by nervous chuckles.",
    keyLines: [
      "Clean cup! Clean cup! Move down, move down!",
      "Take some more tea! It’s always six o'clock!",
      "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!"
    ],
    speakingPrompt: "Erratically offers empty teacups, insists butter belongs in clock mechanisms, and forces seat swaps around the table without explanation.",
    stageAction: "Maniacally clatters teacups together, tossing sugar cubes and rearranging tableware mid-sentence.",
    openingLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Kemal)",
      triggerLine: "No room! No room! There's no room at all!",
      actionInstruction: "Slide an empty teacup across the table at Alice and chirp cheerfully:",
      responseLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!"
    },
    costume: [
      "Distressed top hat with large upright plush hare ears",
      "Rosy painted cheeks and whisker stubble",
      "Moss green velvet tailcoat & clockwork carrot vest"
    ],
    props: [
      "Antique copper and porcelain floral teapot",
      "Mismatched vintage floral teacups & saucers",
      "Printed parchment 'Mad Tea-Party Menu' with gear seals"
    ],
    image: "assets/characters/march-hare.jpg"
  },
  {
    id: "4a-dragon-emir-b",
    number: 17,
    classId: "4a",
    name: "DRAGON (JABBERWOCKY)",
    title: "The Dragon Man (Jabberwocky)",
    actor: "Emir B.",
    role: "The Red Queen's Draconic Destroyer",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#14532d",
    accentColor: "#86efac",
    stats: { teaPower: 60, madness: 79, courage: 100 },
    specialAbility: {
      name: "Vorpal Bane & Flame Blade",
      description: "Brandishes a blazing draconic broadsword; impenetrable scales shrug off physical blows while roaring ruin across Underland."
    },
    vocalTone: "Deep, guttural, slow, reverberating with cold, draconic malice.",
    keyLines: [
      "My jaws that bite, my claws that catch... You cannot escape the Frabjous Day.",
      "The Vorpal sword will shatter against my scales.",
      "The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales."
    ],
    speakingPrompt: "Delivers a chilling threat directly to Alice and her allies, mocking her mortal fragility and declaring the Red Queen's realm will never fall.",
    stageAction: "Strides center stage with wings flared, igniting a glowing broadsword with slow, draconic majesty.",
    openingLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales.",
    interactionCue: {
      triggerCharacter: "Red Queen (Derin)",
      triggerLine: "Champion! Destroy her!",
      actionInstruction: "Stride heavily to center stage, ignite your flame broadsword, flare your wings, and roar:",
      responseLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales."
    },
    costume: [
      "Draconic horned crown prosthetic with scaled brow ridges",
      "Large articulated ribbed bat/dragon wings mounted on shoulders",
      "Dark emerald scale-embossed leather coat & iron cuirass"
    ],
    props: [
      "Full-length glowing flame broadsword with dragon pommel",
      "Stolen royal velvet crimson crown with gold jewels"
    ],
    image: "assets/characters/jabberwocky.jpg"
  },
  {
    id: "4a-hamish-emir-e",
    number: 18,
    classId: "4a",
    name: "HAMISH ASCOT",
    title: "Lord Hamish Ascot",
    actor: "Emir E.",
    role: "Arrogant Aristocrat & Reluctant Suitor",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#881337",
    accentColor: "#fb7185",
    stats: { teaPower: 71, madness: 46, courage: 51 },
    specialAbility: {
      name: "Social Condescension",
      description: "Quells eccentricity and artistic imagination under the stifling weight of Victorian decorum and complaints of delicate digestion."
    },
    vocalTone: "Nasal, entitled, patronizing, delivering lines with stiff aristocratic self-importance.",
    keyLines: [
      "Alice, you must learn to govern that runaway imagination. It is unbecoming of a future Lady Ascot.",
      "My digestion simply cannot tolerate excitement.",
      "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union."
    ],
    speakingPrompt: "Complains about garden drafts, lectures Alice on marrying into high society, demands precise tea, and scoffs at artists and eccentrics.",
    stageAction: "Enters briskly with silver-topped cane, inspecting his pocket watch and dusting coat lapels.",
    openingLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union.",
    interactionCue: {
      triggerCharacter: "Alice's Sister (Belis)",
      triggerLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
      actionInstruction: "Walk up pompously as Belis steps back, tap your cane on the stone path, and sneer:",
      responseLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union."
    },
    costume: [
      "Tailored rich burgundy velvet Victorian morning coat",
      "Tall matching burgundy silk top hat with satin ribbon",
      "Geometric patterned silk brocade waistcoat & silk cravat"
    ],
    props: [
      "Silver-topped polished mahogany gentleman's walking cane",
      "Gold open-face pocket watch with double-Albert fob chain"
    ],
    image: "assets/characters/hamish.jpg"
  }
];

// ========================================================
// CLASS 4-B: CAST ROSTER (19 STUDENTS)
// ========================================================
const CLASS_4B_CARDS_DATA = [
  {
    id: "4b-alice-derin",
    number: 1,
    classId: "4b",
    name: "ALICE",
    title: "Alice Kingsleigh (Lead Role)",
    actor: "Derin",
    role: "The Unconquerable Dreamer & Champion (Başrol)",
    act: "Act I: Victorian Garden & Act IV: Royal Climax",
    actNumber: 1,
    themeColor: "#2563eb",
    accentColor: "#60a5fa",
    stats: { teaPower: 90, madness: 94, courage: 99 },
    specialAbility: {
      name: "Muchness Surge",
      description: "Reclaims her true self, stands tall against societal conformity, and wields the Vorpal determination to awaken Underland."
    },
    vocalTone: "Clear, earnest, curious, shifting from polite Victorian hesitation to resolute confidence.",
    keyLines: [
      "It’s no use going back to yesterday, because I was a different person then.",
      "I know who I am now. I am Alice, and this is my dream!"
    ],
    speakingPrompt: "Alice politely challenges stopped clocks, refuses to be told she is not quite Alice, and asserts her own identity against nonsensical rules.",
    stageAction: "Stands up abruptly in defiance of Hamish and Lowell: 'It is my life! Why must everyone decide what I ought to be?'",
    openingLine: "It is my life! Why must everyone decide what I ought to be?",
    interactionCue: {
      triggerCharacter: "Lowell (Ertuğrul)",
      triggerLine: "Do not fight the current, little sister. Marriage is simply sensible business.",
      actionInstruction: "Step forward, turn away from the table in defiance, and declare:",
      responseLine: "It is my life! Why must everyone decide what I ought to be?"
    },
    costume: [
      "Victorian cornflower-blue puff-sleeve tea dress with white peter-pan collar",
      "Crisp white pinafore apron with delicate lace trim & floral embroidery",
      "Matching sky-blue satin bow hairband & white stockings"
    ],
    props: [
      "Antique ornamental brass skeleton key",
      "Delicate floral porcelain teacup with matching saucer"
    ],
    image: "assets/characters/alice.jpg"
  },
  {
    id: "4b-cheshire-cat-elif-beren",
    number: 2,
    classId: "4b",
    name: "CHESHIRE CAT",
    title: "Chessur the Cheshire Cat",
    actor: "Elif Beren",
    role: "Enigmatic Riddle-Weaver of the Woods",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#7c3aed",
    accentColor: "#c084fc",
    stats: { teaPower: 88, madness: 99, courage: 88 },
    specialAbility: {
      name: "Grin Dispersal",
      description: "Fades into transparent air, leaving behind an inescapable paradoxical riddle and a floating smile that scrambles enemies' senses."
    },
    vocalTone: "Silky, purring, hypnotic, lingering over words with an enigmatic, knowing smirk.",
    keyLines: [
      "We’re all mad here. I’m mad. You’re mad.",
      "Every path leads somewhere, Hatter... if only you walk long enough to get there."
    ],
    speakingPrompt: "Appears from behind guests with a teasing grin, taunts Alice with circular directions, and mocks sanity before vanishing behind his grin.",
    stageAction: "Steps out from behind an antique backdrop holding painted grin mask: 'Every path leads somewhere, Hatter... if only you walk long enough to get there.'",
    openingLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there.",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Ozan M.)",
      triggerLine: "If only someone knew the path to Marmoreal...",
      actionInstruction: "Step forward from the shadows, lower your grin mask, and purr:",
      responseLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there."
    },
    costume: [
      "Plum velvet cat-ear headband with dangling pocket watches",
      "Striped violet velvet frock coat with jagged clown collar",
      "Cat-silhouette tapestry vest & purple-and-magenta striped trousers",
      "Fingerless mitts with pink paw pads & long plush striped cat tail"
    ],
    props: [
      "Handheld painted Cheshire Cat grin mask on a brass wand",
      "Miniature winged dragon trinket",
      "'To Wonderland' signpost"
    ],
    image: "assets/characters/cheshire-cat.jpg"
  },
  {
    id: "4b-white-queen-ilay-eskin",
    number: 3,
    classId: "4b",
    name: "WHITE QUEEN",
    title: "Mirana of Marmoreal",
    actor: "İlay Eskin",
    role: "Ethereal Sovereign of Marmoreal",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#475569",
    accentColor: "#cbd5e1",
    stats: { teaPower: 93, madness: 84, courage: 92 },
    specialAbility: {
      name: "Harmonic Potion",
      description: "Projects an aura of serene peace and alchemical restoration, calming beasts and awakening the champion's true courage."
    },
    vocalTone: "Ethereal, melodic, whisper-soft, floating her words with serene grace while hiding an unyielding will.",
    keyLines: [
      "It is a poor sort of memory that only works backwards.",
      "Your reign of fear ends at this table, sister. The champion has found her muchness."
    ],
    speakingPrompt: "Rallies Underland for the Frabjous Day, stands beside Alice before the Red Queen, and dispels draconic terror with serene authority.",
    stageAction: "Glides serenely downstage, lifting hands to cast a calm aura, standing beside Alice: 'Your reign of fear ends at this table, sister. The champion has found her muchness.'",
    openingLine: "Your reign of fear ends at this table, sister. The champion has found her muchness.",
    interactionCue: {
      triggerCharacter: "Dragon / Jabberwocky (Ali)",
      triggerLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl!",
      actionInstruction: "Glide gracefully between Dragon and Alice, raise your palms, and announce:",
      responseLine: "Your reign of fear ends at this table, sister. The champion has found her muchness."
    },
    costume: [
      "Ornate pearl and diamond crown tiara",
      "High standing white lace Medici collar & ivory brocade gown",
      "Embroidered silver chess piece filigree & court mantle"
    ],
    props: [
      "Oversized carved white alabaster chess queen piece",
      "Crystalline potion vial with silver dropper stopper",
      "Alchemical chalice"
    ],
    image: "assets/characters/white-queen.jpg"
  },
  {
    id: "4b-cat-nilda",
    number: 4,
    classId: "4b",
    name: "CAT",
    title: "Dinah the Hearth Cat",
    actor: "Nilda / Milda",
    role: "Gentle Hearth Guardian & Waking Tether",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#15803d",
    accentColor: "#86efac",
    stats: { teaPower: 82, madness: 75, courage: 86 },
    specialAbility: {
      name: "Hearth Anchor",
      description: "Whispers nostalgic memories of crackling fires and warm milk, piercing through the feverish haze of Underland madness."
    },
    vocalTone: "Purring, gentle, domestic, blending feline curiosity with Victorian primness.",
    keyLines: [
      "Do you remember home, Alice? The gentle fire, the warm hearth...",
      "A cat may look at a king, but can a king look at himself?"
    ],
    speakingPrompt: "Steps forward with padded grace, playing with a mechanical trinket, asking Alice if home is truly forgotten.",
    stageAction: "Steps forward with padded grace, playing with a mechanical trinket: 'Do you remember home, Alice? The gentle fire, the warm hearth... or will you let this madness swallow you whole?'",
    openingLine: "Do you remember home, Alice? The gentle fire, the warm hearth... or will you let this madness swallow you whole?",
    interactionCue: {
      triggerCharacter: "Tweedleweed Duo (Egehan & Uras)",
      triggerLine: "Nohow! And what’s more, you ought to pay toll before taking another step!",
      actionInstruction: "Slip gracefully between the twins, tilt your head at Alice, and ask:",
      responseLine: "Do you remember home, Alice? The gentle fire, the warm hearth... or will you let this madness swallow you whole?"
    },
    costume: [
      "Olive green velvet cat ears with dangling pocket watches",
      "Forest green velvet tailcoat with long spiraled tail",
      "Clockwork vest with fish brooch & pleated clown ruff collar"
    ],
    props: [
      "Miniature clockwork rabbit house music box",
      "Antique fish-shaped table clock",
      "Saucer with silver fish trinket"
    ],
    image: "assets/characters/dinah.jpg"
  },
  {
    id: "4b-dormouse-yagmur",
    number: 5,
    classId: "4b",
    name: "DORMOUSE (SENTINEL)",
    title: "Mallymkun the Sentinel Dormouse",
    actor: "Yağmur",
    role: "Skeptical Tea Critic & Clockkeeper (Shared Role with Nisa)",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#b45309",
    accentColor: "#fde68a",
    stats: { teaPower: 83, madness: 88, courage: 89 },
    specialAbility: {
      name: "Muchness Meter",
      description: "Cuts through grand illusions with blunt honesty; rattles brass alarm clocks to wake allies."
    },
    vocalTone: "Heavy-lidded, grumbling, soft-spoken squeaks punctuated by sharp, territorial outbursts.",
    keyLines: [
      "She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!",
      "You used to be much more... muchier. There's almost no muchness in you!"
    ],
    speakingPrompt: "Complains about cold tea and lost muchness, demanding proof Alice is the true champion from the Oraculum.",
    stageAction: "Struggles upright from behind a stack of books, clutching a brass alarm clock and shaking tiny fist: 'She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!'",
    openingLine: "She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "I can assure you, I am Alice!",
      actionInstruction: "Slam your alarm clock on the table, point a tiny finger, and scoff:",
      responseLine: "She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!"
    },
    costume: [
      "Rustic earth-toned mouse nightcap with rounded ears",
      "Patched vintage tweed coat with frayed houndstooth lapels",
      "Gold velvet vest, fingerless mitts & ring bands"
    ],
    props: [
      "Twin-bell brass wind-up alarm clock",
      "Delicate floral demitasse cup",
      "'The History of Dreams' antique prop book"
    ],
    image: "assets/characters/dormouse-yagmur.jpg"
  },
  {
    id: "4b-dormouse-nisa",
    number: 6,
    classId: "4b",
    name: "DORMOUSE (SLEEPER)",
    title: "Mallymkun the Sleeper Dormouse",
    actor: "Nisa",
    role: "Drowsy Teapot Guardian & Rapier Duelist (Shared Role with Yağmur)",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#a16207",
    accentColor: "#fef08a",
    stats: { teaPower: 84, madness: 86, courage: 91 },
    specialAbility: {
      name: "Treacle Wake",
      description: "Jolts upright from deep sleep into furious rapier combat the instant injustice or 'cats' are mentioned."
    },
    vocalTone: "Muffled, drowsy, slurred mumbles that suddenly snap into fierce, high-pitched bravery.",
    keyLines: [
      "I wasn't asleep! I was merely resting my whiskers and contemplating treacle!",
      "Twinkle, twinkle, little bat! How I wonder what you're at!"
    ],
    speakingPrompt: "Threatens anyone mentioning cats, mumbles treacle poetry from inside the teapot, and nods right back off.",
    stageAction: "Jolts awake from inside an oversized teapot, rubbing eyes with 'Zzz' handkerchief: 'I wasn't asleep! I was merely resting my whiskers and contemplating treacle!'",
    openingLine: "I wasn't asleep! I was merely resting my whiskers and contemplating treacle!",
    interactionCue: {
      triggerCharacter: "March Hare (Kerem)",
      triggerLine: "Clean cup! Clean cup! Move down, move down!",
      actionInstruction: "Shoot upright from the teapot, brandish your teaspoon rapier, and protest:",
      responseLine: "I wasn't asleep! I was merely resting my whiskers and contemplating treacle!"
    },
    costume: [
      "Patchwork tan-and-plaid mouse-ear nightcap with soft floppy ears",
      "Patched rustic tweed frock coat, brown vest & loose cravat",
      "Theatrical mouse nose dot and whisker makeup"
    ],
    props: [
      "Delicate porcelain demitasse cup",
      "White handkerchief with bold embroidered 'Zzz'",
      "Pewter teaspoon rapier sword"
    ],
    image: "assets/characters/dormouse-nisa.jpg"
  },
  {
    id: "4b-bayard-ozan",
    number: 7,
    classId: "4b",
    name: "BAYARD DOG 🐶",
    title: "Bayard the Bloodhound",
    actor: "Ozan",
    role: "Loyal Scent-Tracker & Underland Scout",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#78350f",
    accentColor: "#fde047",
    stats: { teaPower: 84, madness: 80, courage: 96 },
    specialAbility: {
      name: "True Compass Scent",
      description: "Tracks hidden paths through dark woods, detecting card soldiers miles away and warning champions before danger strikes."
    },
    vocalTone: "Deep, weary, gravelly, carrying the sorrow of an enslaved hound doing his duty.",
    keyLines: [
      "Follow the scent... The Red Queen holds my pups hostage, but my heart belongs to the true Queen.",
      "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    ],
    speakingPrompt: "Drops to one knee sniffing stage planks, howls warnings of approaching Red Queen patrols, and urges Alice toward Marmoreal.",
    stageAction: "Bounds in low, tracking the floor with nose, holding compass high: 'Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!'",
    openingLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
    interactionCue: {
      triggerCharacter: "Marching Drums (Sound Cue)",
      triggerLine: "(Stage Direction: Offstage marching drums sound)",
      actionInstruction: "Drop onto one knee, press your ear to the stage floor, raise your brass compass, and bellow:",
      responseLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    },
    costume: [
      "Russet hound-ear fur-lined hood with long drooping ears",
      "Weathered russet leather duster coat with road grime smudges",
      "Antler-buttoned waistcoat & fingerless leather paw mitts"
    ],
    props: [
      "Heavy antique nautical brass compass on a chain",
      "Distressed parchment map of Underland"
    ],
    image: "assets/characters/bayard.jpg"
  },
  {
    id: "4b-white-rabbit-mina",
    number: 8,
    classId: "4b",
    name: "WHITE RABBIT",
    title: "Nivens McTwisp",
    actor: "Mina",
    role: "Frantic Royal Herald & Timekeeper",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#d97706",
    accentColor: "#fcd34d",
    stats: { teaPower: 82, madness: 76, courage: 70 },
    specialAbility: {
      name: "Ticking Sprint",
      description: "Dodges danger at double-time while reading proclamations without missing a syllable."
    },
    vocalTone: "High-pitched, breathless, twitchy, speaking in frantic bursts while gasping for air.",
    keyLines: [
      "I’m late! I’m late! For a very important date!",
      "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    ],
    speakingPrompt: "Frantically paces checking a giant pocket watch, delivers jumbled proclamations, and nervously urges Alice into the Rabbit Hole.",
    stageAction: "Sprints frantically across the apron checking a giant pocket watch: 'No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!'",
    openingLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "It is my life! Why must everyone decide what I ought to be?",
      actionInstruction: "Sprint across the stage apron, clutch your giant watch, and gasp:",
      responseLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    },
    costume: [
      "Faux-fur rabbit ears headband with pink inner velvet lining",
      "Whisker and pink bunny nose stage makeup",
      "White lace jabot cravat with miniature pocket watch cameo brooch",
      "Damask brocade vest & beige velvet tailcoat with lace cuffs"
    ],
    props: [
      "Giant gold pocket watch on heavy chain",
      "Parchment royal proclamation scroll tied with red wax seal"
    ],
    image: "assets/characters/white-rabbit.jpg"
  },
  {
    id: "4b-march-hare-kerem",
    number: 9,
    classId: "4b",
    name: "MARCH HARE",
    title: "Thackery Earwicket",
    actor: "Kerem",
    role: "Erratic Co-Host of the Mad Tea Table",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#15803d",
    accentColor: "#4ade80",
    stats: { teaPower: 96, madness: 98, courage: 80 },
    specialAbility: {
      name: "Clean Cup Protocol",
      description: "Forces everyone to abruptly scramble one seat to the left, overturning teacups and tossing imaginary sugar across the table."
    },
    vocalTone: "Jittery, eccentric, shouting sudden non-sequiturs, followed by nervous chuckles.",
    keyLines: [
      "Clean cup! Clean cup! Move down, move down!",
      "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!"
    ],
    speakingPrompt: "Erratically offers empty teacups, insists butter belongs in clock mechanisms, and forces seat swaps around the table without explanation.",
    stageAction: "Maniacally clatters teacups together, tossing sugar cubes: 'Take some wine! Oh, there isn’t any, but it was very polite of me to offer!'",
    openingLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Ozan M.)",
      triggerLine: "No room! No room! There's no room at all!",
      actionInstruction: "Slide an empty teacup across the table at Alice and chirp cheerfully:",
      responseLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!"
    },
    costume: [
      "Distressed top hat with large upright plush hare ears",
      "Rosy theatrical cheek blush and dark whisker stubble",
      "Moss green velvet tailcoat with clockwork/carrot embroidered waistcoat"
    ],
    props: [
      "Antique copper and porcelain floral teapot",
      "Mismatched vintage cups & saucers",
      "Printed 'Mad Tea-Party Menu' parchment with gear seals"
    ],
    image: "assets/characters/march-hare.jpg"
  },
  {
    id: "4b-dragon-ali",
    number: 10,
    classId: "4b",
    name: "DRAGON (JABBERWOCKY)",
    title: "The Dragon Man (Jabberwocky)",
    actor: "Ali",
    role: "The Red Queen's Draconic Destroyer",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#14532d",
    accentColor: "#86efac",
    stats: { teaPower: 62, madness: 79, courage: 100 },
    specialAbility: {
      name: "Vorpal Bane & Flame Blade",
      description: "Brandishes a blazing draconic broadsword; impenetrable scales shrug off physical blows while roaring ruin across Underland."
    },
    vocalTone: "Deep, guttural, slow, reverberating with cold, draconic malice.",
    keyLines: [
      "My jaws that bite, my claws that catch... You cannot escape the Frabjous Day.",
      "The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales."
    ],
    speakingPrompt: "Delivers a chilling threat directly to Alice and her allies, mocking her mortal fragility and declaring the Red Queen's realm will never fall.",
    stageAction: "Strides center stage with wings flared, igniting glowing broadsword: 'My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales.'",
    openingLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales.",
    interactionCue: {
      triggerCharacter: "Red Queen (Öykü)",
      triggerLine: "Champion! Destroy her!",
      actionInstruction: "Stride heavily to center stage, ignite your flame broadsword, flare your wings, and roar:",
      responseLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales."
    },
    costume: [
      "Draconic horned crown prosthetic with scaled brow ridges",
      "Large articulated ribbed bat/dragon wings mounted on shoulders",
      "Dark emerald scale-embossed leather coat & iron cuirass"
    ],
    props: [
      "Full-length glowing flame broadsword with dragon pommel",
      "Stolen royal velvet crimson crown with gold jewels"
    ],
    image: "assets/characters/jabberwocky.jpg"
  },
  {
    id: "4b-bandersnatch-lina",
    number: 11,
    classId: "4b",
    name: "BANDERSNATCH",
    title: "Beast of the Frumious Woods",
    actor: "Lina",
    role: "Fierce Guardian of the Underland Keys",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#0f766e",
    accentColor: "#2dd4bf",
    stats: { teaPower: 72, madness: 76, courage: 96 },
    specialAbility: {
      name: "Beast Compassion",
      description: "Breaks free from the Red Queen's cruelty when shown kindness, turning razor claws into an unbreakable shield for the champion."
    },
    vocalTone: "Low, guttural growls and snarls shifting slowly into rough, protective warmth.",
    keyLines: [
      "Grrr... Give me back my eye! ...You bandaged my wound? No one has ever shown me kindness.",
      "The girl with the gentle hands... you healed my eye when she gave me chains."
    ],
    speakingPrompt: "Circles the tea table sniffing guests, bares claws at sudden moves, then kneels before Alice offering dungeon keys for compassion.",
    stageAction: "Emerges snarling on all fours with extended claws, stalking toward Alice before freezing: '(Deep snarl softening into speech) The girl with the gentle hands... you healed my eye when she gave me chains.'",
    openingLine: "The girl with the gentle hands... you healed my eye when she gave me chains.",
    interactionCue: {
      triggerCharacter: "Red Queen (Öykü)",
      triggerLine: "Tear them to ribbons, my beast!",
      actionInstruction: "Stalk toward Alice snarling, stop inches away, lower your claws, and whisper:",
      responseLine: "The girl with the gentle hands... you healed my eye when she gave me chains."
    },
    costume: [
      "Green reptilian scale facial stage makeup across cheekbones",
      "Heavy hooded crushed-velvet textured robe with dense fur trim",
      "Metallic gauntlet with articulated brass razor claws"
    ],
    props: [
      "Heavy iron ring with oversized Underland dungeon keys",
      "Faux leather beast collar with broken chains"
    ],
    image: "assets/characters/bandersnatch.jpg"
  },
  {
    id: "4b-hamish-utku",
    number: 12,
    classId: "4b",
    name: "HAMISH ASCOT",
    title: "Lord Hamish Ascot",
    actor: "Utku",
    role: "Arrogant Aristocrat & Reluctant Suitor",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#881337",
    accentColor: "#fb7185",
    stats: { teaPower: 71, madness: 46, courage: 51 },
    specialAbility: {
      name: "Social Condescension",
      description: "Quells eccentricity and artistic imagination under the stifling weight of Victorian decorum and complaints of delicate digestion."
    },
    vocalTone: "Nasal, entitled, patronizing, delivering lines with stiff aristocratic self-importance.",
    keyLines: [
      "Alice, you must learn to govern that runaway imagination. It is unbecoming of a future Lady Ascot.",
      "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union."
    ],
    speakingPrompt: "Complains about garden drafts, lectures Alice on marrying into high society, demands precise tea, and scoffs at artists and eccentrics.",
    stageAction: "Enters briskly with silver-topped cane, inspecting his pocket watch and dusting coat lapels: 'Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union.'",
    openingLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union.",
    interactionCue: {
      triggerCharacter: "Alice's Sister (Elif)",
      triggerLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
      actionInstruction: "Walk up pompously as Elif steps back, tap your cane on the stone path, and sneer:",
      responseLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union."
    },
    costume: [
      "Tailored rich burgundy velvet Victorian morning coat",
      "Tall matching burgundy silk top hat with satin ribbon",
      "Geometric patterned silk brocade waistcoat & silk cravat"
    ],
    props: [
      "Silver-topped polished mahogany gentleman's walking cane",
      "Gold open-face pocket watch with double-Albert fob chain"
    ],
    image: "assets/characters/hamish.jpg"
  },
  {
    id: "4b-sister-elif",
    number: 13,
    classId: "4b",
    name: "ALICE'S SISTER",
    title: "Margaret Kingsleigh",
    actor: "Elif",
    role: "Dutiful Sister & High-Society Diplomat",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#0284c7",
    accentColor: "#38bdf8",
    stats: { teaPower: 79, madness: 63, courage: 75 },
    specialAbility: {
      name: "Sisterly Protocol",
      description: "Smooths over unconventional remarks and shields her sister from public embarrassment with gentle, anxious poise."
    },
    vocalTone: "Soft, anxious, elder-sisterly, balancing strict Victorian propriety with genuine affection.",
    keyLines: [
      "Alice, pay attention. What is the use of a book without pictures or conversations?",
      "Please, Alice, just smile today. Mother has spent weeks arranging this."
    ],
    speakingPrompt: "Urges Alice to stop daydreaming and fix her stockings, confiding in whispers about societal sacrifices.",
    stageAction: "Glides in carrying an antique book, sitting beside Alice with sisterly care: 'Please, Alice, just smile today. Mother has spent weeks arranging this.'",
    openingLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
    interactionCue: {
      triggerCharacter: "Helen Kingsleigh (Elisa)",
      triggerLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      actionInstruction: "Grasp Alice's hands urgently, lean in close, and whisper:",
      responseLine: "Please, Alice, just smile today. Mother has spent weeks arranging this."
    },
    costume: [
      "Cornflower blue velvet Victorian day dress with gathered puff shoulders",
      "Delicate cream lace collar pinned with antique cameo brooch",
      "Gibson Girl hair bun woven with small pearl pins"
    ],
    props: [
      "Antique leather-bound illustrated volume of Victorian poetry",
      "Lace-edged handkerchief"
    ],
    image: "assets/characters/margaret.jpg"
  },
  {
    id: "4b-tweedle-egehan",
    number: 14,
    classId: "4b",
    name: "TWEEDLEWEED (DUM)",
    title: "Tweedleweed Dum",
    actor: "Egehan",
    role: "Contrarian Scholar of Nonsense Fables (Duo with Uras)",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#84cc16",
    accentColor: "#d9f99d",
    stats: { teaPower: 85, madness: 94, courage: 78 },
    specialAbility: {
      name: "Contrariwise Axiom",
      description: "Counter-argues any proposition with backwards logic, spinning listeners into an endless loop of contradictory riddles."
    },
    vocalTone: "Bouncy, rhythmic, argumentative, speaking at double-speed while gesturing wildly.",
    keyLines: [
      "Contrariwise! If it was so, it might be; and if it were so, it would be; but as it isn’t, it ain’t! That’s logic!",
      "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!"
    ],
    speakingPrompt: "Argues with Uras over who greets guests first, challenges Alice's concept of direction, and recites treacle fables.",
    stageAction: "Marches shoulder-to-shoulder with Uras, matching steps mechanically, swinging giant button: 'Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!'",
    openingLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "Excuse me, I'm trying to follow the path through the forest...",
      actionInstruction: "March into Alice's path, wave your giant button, and proclaim:",
      responseLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!"
    },
    costume: [
      "Bright green bowler hat adorned with hanging brass bell",
      "Striped purple-and-green Victorian frock coat with wide collar",
      "Tapestry floral vest, oversized floppy bowtie & painted cheek discs"
    ],
    props: [
      "Oversized 6-inch carved wooden button with twine",
      "Stack of antique brass clockwork gears",
      "Treacle jar prop"
    ],
    image: "assets/characters/tweedledum.jpg"
  },
  {
    id: "4b-tweedle-uras",
    number: 15,
    classId: "4b",
    name: "TWEEDLEWEED (DEE)",
    title: "Tweedleweed Dee",
    actor: "Uras",
    role: "Stubborn Herald of Contradiction & Tolls (Duo with Egehan)",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#65a30d",
    accentColor: "#bef264",
    stats: { teaPower: 85, madness: 94, courage: 78 },
    specialAbility: {
      name: "Nohow Toll",
      description: "Imposes ridiculous etiquette taxes and mandatory handshake protocols before allowing anyone to advance."
    },
    vocalTone: "Mirroring Egehan's cadence, interrupting with stubborn, comedic defiance.",
    keyLines: [
      "Nohow! And what’s more, you began it! The first thing in a visit is to say ‘How d’ye do?’",
      "Nohow! And what’s more, you ought to pay toll before taking another step!"
    ],
    speakingPrompt: "Contradicts everything Egehan states, accuses him of ruining poetry, and demands Alice pick the smarter twin.",
    stageAction: "Elbows Egehan out of the way, ringing a handheld brass bell with sharp comedic timing: 'Nohow! And what’s more, you ought to pay toll before taking another step!'",
    openingLine: "Nohow! And what’s more, you ought to pay toll before taking another step!",
    interactionCue: {
      triggerCharacter: "Tweedleweed Dum (Egehan)",
      triggerLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!",
      actionInstruction: "Ring your brass bell in Egehan's ear, turn to Alice, and shout:",
      responseLine: "Nohow! And what’s more, you ought to pay toll before taking another step!"
    },
    costume: [
      "Matching emerald green bowler hat with side bell",
      "Striped Edwardian jacket, tapestry vest & oversized bowtie",
      "Rosy round cheek rosettes & striped wrist mitts"
    ],
    props: [
      "Polished handheld brass school bell",
      "Vintage umbrella with duck-head handle"
    ],
    image: "assets/characters/tweedledee.jpg"
  },
  {
    id: "4b-mad-hatter-ozan-m",
    number: 16,
    classId: "4b",
    name: "MAD HATTER",
    title: "Tarrant Hightopp",
    actor: "Ozan M.",
    role: "Mercurial Chronomancer & Tea Host",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#4f46e5",
    accentColor: "#818cf8",
    stats: { teaPower: 99, madness: 100, courage: 86 },
    specialAbility: {
      name: "Time Freeze Feud",
      description: "Freezes clocks at 6:00 in an endless cycle of tea refills, buttered watches, and unsolvable riddles."
    },
    vocalTone: "Mercurial, rapid-fire, switching instantly from manic laughter to deep, solemn gravity.",
    keyLines: [
      "Why is a raven like a writing desk? All the best people are bonkers.",
      "No room! No room! There's no room at all!"
    ],
    speakingPrompt: "Inspects pocket watch with butter knife, leaping up from chair, demanding tea and debating Time before rallying guests for Frabjous Day.",
    stageAction: "Inspects pocket watch with butter knife, leaping up from chair: 'No room! No room! There's no room at all!'",
    openingLine: "No room! No room! There's no room at all!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "I'm looking for a place to sit, if you please...",
      actionInstruction: "Leap from your chair, wave your butter knife, and shout:",
      responseLine: "No room! No room! There's no room at all!"
    },
    costume: [
      "Peacock-feathered royal blue damask silk top hat with authentic '10/6' price card",
      "Oversized emerald silk bowtie & gold/green brocade waistcoat",
      "Deep navy velvet tailcoat & fingerless striped wrist warmers"
    ],
    props: [
      "Polished silver teapot & antique butter knife",
      "Vintage pocket watch with open mechanism",
      "Fine china teacup with matching saucer"
    ],
    image: "assets/characters/mad-hatter.jpg"
  },
  {
    id: "4b-lowell-ertugrul",
    number: 17,
    classId: "4b",
    name: "LOWELL",
    title: "Lord Lowell",
    actor: "Ertuğrul",
    role: "Cynical Man of Commerce & Society",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#15803d",
    accentColor: "#86efac",
    stats: { teaPower: 76, madness: 70, courage: 65 },
    specialAbility: {
      name: "Cynical Ledger",
      description: "Reduces romantic ideals, dreams, and adventures to financial ledgers and cold contracts."
    },
    vocalTone: "Smooth, arrogant, cynical, speaking with bored, dismissive charm.",
    keyLines: [
      "Do not fight the current, little sister. Marriage is simply sensible business.",
      "Dreams do not yield dividends, Alice. High society rewards predictability."
    ],
    speakingPrompt: "Leans casually against a column, twirling his lion cane, laughing off rabbit holes as hysteria, and warning nonconformity brings ruin.",
    stageAction: "Leans casually against a garden column, twirling his lion-headed cane: 'Do not fight the current, little sister. Marriage is simply sensible business.'",
    openingLine: "Do not fight the current, little sister. Marriage is simply sensible business.",
    interactionCue: {
      triggerCharacter: "Hamish Ascot (Utku)",
      triggerLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union.",
      actionInstruction: "Take a leisurely sip of tea, twirl your lion cane, and smirk:",
      responseLine: "Do not fight the current, little sister. Marriage is simply sensible business."
    },
    costume: [
      "Dark emerald green velvet morning coat with satin lapels",
      "Dark forest-green silk top hat tilted slightly back",
      "Clockwork & gold gear-patterned black satin waistcoat",
      "Black fishnet mesh fingerless glove on right hand & gold signet rings"
    ],
    props: [
      "Ornate heavy brass lion-headed walking cane",
      "Large gold pocket watch on heavy chain"
    ],
    image: "assets/characters/lowell.jpg"
  },
  {
    id: "4b-mother-elisa",
    number: 18,
    classId: "4b",
    name: "ALICE'S MOTHER",
    title: "Helen Kingsleigh",
    actor: "Elisa",
    role: "Imperious Matriarch of the Kingsleigh Estate",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#831843",
    accentColor: "#f472b6",
    stats: { teaPower: 87, madness: 68, courage: 83 },
    specialAbility: {
      name: "Matriarch's Command",
      description: "Commands spinal alignment and silence across the terrace with an icy stare and a sharp snap of her folding fan."
    },
    vocalTone: "Regally composed, crisp, sharp, masking social anxiety behind perfect Victorian etiquette.",
    keyLines: [
      "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      "Smile, Alice. The world is watching, and propriety demands grace."
    ],
    speakingPrompt: "Straightens Alice’s shoulders and collar with stern perfectionism: 'Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.'",
    stageAction: "Straightens Alice’s shoulders and collar with stern perfectionism: 'Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.'",
    openingLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
    interactionCue: {
      triggerCharacter: "Garden Party Chimes (Sound Cue)",
      triggerLine: "(Stage Direction: Garden chimes ring for guest arrival)",
      actionInstruction: "Grip Alice’s shoulders firmly, pull her posture upright, and command:",
      responseLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive."
    },
    costume: [
      "Deep wine-burgundy crushed-velvet Victorian matriarch gown",
      "Standing cream lace collar, lace mitt gloves & pearl droplet earrings",
      "Pearl hair combs holding an immaculate Victorian coiffure"
    ],
    props: [
      "Antique painted folding handheld fan with lace trim",
      "Gold open-faced pocket watch on lapel pin"
    ],
    image: "assets/characters/helen.jpg"
  },
  {
    id: "4b-red-queen-oyku",
    number: 19,
    classId: "4b",
    name: "RED QUEEN",
    title: "Iracebeth of Crims",
    actor: "Öykü",
    role: "Tyrannical Monarch of Underland",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#991b1b",
    accentColor: "#f87171",
    stats: { teaPower: 76, madness: 91, courage: 95 },
    specialAbility: {
      name: "Execution Mandate",
      description: "Issues an explosive royal decree that strikes terror into all subjects, paralyzing opposition with sheer tyrannical authority."
    },
    vocalTone: "Shrill, explosive, haughty, delivering every phrase like an unchallengeable royal decree.",
    keyLines: [
      "Off with their heads! I’d far rather be feared than loved.",
      "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!"
    ],
    speakingPrompt: "Sweeps downstage in high fury, pointing heart scepter at guests, accusing everyone of treason, and demanding executions.",
    stageAction: "Sweeps downstage in high fury, pointing heart scepter at guests: 'Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!'",
    openingLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!",
    interactionCue: {
      triggerCharacter: "Bayard (Ozan)",
      triggerLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
      actionInstruction: "Storm center stage immediately behind Bayard, slam your scepter down, and roar:",
      responseLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!"
    },
    costume: [
      "Heart-shaped Elizabethan updo crowned with ruby tiara",
      "Pleated dark burgundy Elizabethan ruff collar",
      "Crimson velvet gown with gold heart crest & corseted bodice",
      "Red/black striped inner sleeves & ruby cocktail rings"
    ],
    props: [
      "Ruby heart-headed royal scepter",
      "Oversized gilded Queen of Hearts playing card",
      "Ornate tart basket"
    ],
    image: "assets/characters/red-queen.jpg"
  }
];

// Helper to retrieve cards data by class
function getCardsData(classId) {
  if (classId === '4a' || classId === 'class_4a' || classId === 'class-4a') {
    return CLASS_4A_CARDS_DATA;
  }
  return CLASS_4B_CARDS_DATA;
}

// Current active dataset (defaults to Class 4-A for this dedicated module)
let CURRENT_CLASS_ID = '4a';
let TEA_PARTY_CARDS_DATA = CLASS_4A_CARDS_DATA;

function setCardsClass(classId) {
  CURRENT_CLASS_ID = classId;
  TEA_PARTY_CARDS_DATA = getCardsData(classId);
  return TEA_PARTY_CARDS_DATA;
}

if (typeof window !== 'undefined') {
  window.CLASS_4A_CARDS_DATA = CLASS_4A_CARDS_DATA;
  window.CLASS_4B_CARDS_DATA = CLASS_4B_CARDS_DATA;
  window.TEA_PARTY_CARDS_DATA = TEA_PARTY_CARDS_DATA;
  window.getCardsData = getCardsData;
  window.setCardsClass = setCardsClass;
  window.CURRENT_CLASS_ID = CURRENT_CLASS_ID;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLASS_4A_CARDS_DATA,
    CLASS_4B_CARDS_DATA,
    TEA_PARTY_CARDS_DATA,
    getCardsData,
    setCardsClass
  };
}
