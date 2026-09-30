/**
 * Alice in Wonderland: Mad Tea Party Double-Sided Character Trading Cards
 * Multi-Class Curriculum Database (Class 4-A & Class 4-B)
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
      description: "Dodges imminent court executions by darting at double speed, delivering jumbled royal summonses without dropping a scroll."
    },
    vocalTone: "High-pitched, breathless, twitchy, speaking in frantic bursts while gasping for air.",
    keyLines: [
      "I’m late! I’m late! For a very important date!",
      "No time, no time! The Queen's tea is cold and my head is on the chopping block!"
    ],
    speakingPrompt: "Paces around table checking watch, reads jumbled royal proclamation, and warns Alice that the Red Knights are hunting her.",
    stageAction: "Sprints across the apron clutching a giant pocket watch before ducking behind the tea table.",
    openingLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "Why must everyone decide what I ought to be?",
      actionInstruction: "Sprint across the stage apron, clutch your pocket watch, and gasp:",
      responseLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    },
    costume: [
      "Upright plush rabbit ears headband with pink velvet lining",
      "Lace jabot cravat with miniature pocket watch cameo brooch",
      "Damask brocade vest & beige velvet tailcoat"
    ],
    props: [
      "Giant gold pocket watch on heavy brass chain",
      "Parchment royal proclamation scroll tied with red ribbon"
    ],
    image: "assets/characters/white-rabbit.jpg"
  },
  {
    id: "4a-cat-1-ayla",
    number: 5,
    classId: "4a",
    name: "CAT (THE GRIN)",
    title: "Chessur of the Grin (Cheshire Cat 1)",
    actor: "Ayla",
    role: "Enigmatic Riddle-Weaver of the Woods",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#6b21a8",
    accentColor: "#c084fc",
    stats: { teaPower: 88, madness: 99, courage: 87 },
    specialAbility: {
      name: "Grin Dispersal",
      description: "Fades into transparent air, leaving behind only a mischievous floating smile that scrambles enemies' senses."
    },
    vocalTone: "Silky, purring, hypnotic, lingering over words with an enigmatic, knowing smirk.",
    keyLines: [
      "We’re all mad here. I’m mad. You’re mad.",
      "If you don’t care where you want to get to, then it doesn’t much matter which way you walk."
    ],
    speakingPrompt: "Appears from behind the guests with a teasing grin, taunts Alice with circular directions, and mocks Hatter's sanity.",
    stageAction: "Steps out holding a painted grin mask on a brass wand, peering playfully around guests.",
    openingLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there.",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Kemal)",
      triggerLine: "If only someone knew the path to Marmoreal...",
      actionInstruction: "Step forward from behind the screen, lower your grin mask, and purr:",
      responseLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there."
    },
    costume: [
      "Plum velvet cat-ear headband with dangling pocket watches",
      "Deep violet and purple striped velvet frock coat with jagged clown collar",
      "Purple paw-printed mitts & long plush striped cat tail"
    ],
    props: [
      "Handheld painted Cheshire Cat grin mask on a brass wand",
      "Miniature 'To Wonderland' signpost"
    ],
    image: "assets/characters/cheshire-cat.jpg"
  },
  {
    id: "4a-cat-2-emir-ali",
    number: 6,
    classId: "4a",
    name: "CAT (THE SHADOW)",
    title: "Chessur of the Shadows (Cheshire Cat 2)",
    actor: "Emir Ali",
    role: "Phantom Guide & Shadow Illusionist",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#166534",
    accentColor: "#4ade80",
    stats: { teaPower: 87, madness: 98, courage: 89 },
    specialAbility: {
      name: "Shadow Prowl",
      description: "Slips through the trees without a sound, suddenly reappearing with paradoxical riddles and unexpected truths."
    },
    vocalTone: "Deep, purring, mocking, blending theatrical whisper with feline chuckle.",
    keyLines: [
      "A dog growls when angry and wags when pleased. I growl when pleased and wag when angry!",
      "Who says reality is real? Certainly not a cat!"
    ],
    speakingPrompt: "Prowls quietly behind the tea table, vanishing behind trunks and pointing clawed paws in opposing directions.",
    stageAction: "Prowls silently from the shadows, tilting head and offering perplexing advice on navigating Wonderland.",
    openingLine: "That depends a great deal on where you want to get to! Walk long enough, and you'll arrive somewhere!",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "Would you tell me, please, which way I ought to go from here?",
      actionInstruction: "Step out from behind the clock, tilt your chin playfully, and announce:",
      responseLine: "That depends a great deal on where you want to get to! Walk long enough, and you'll arrive somewhere!"
    },
    costume: [
      "Olive-green velvet cat ears with pocket watches",
      "Forest green velvet tailcoat with long curled brocade tail",
      "Ruffled clown neck collar & fingerless cat-paw mitts"
    ],
    props: [
      "Miniature clockwork table clock",
      "Tiny corked potion vial labeled 'Drink Me'"
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
    themeColor: "#0369a1",
    accentColor: "#38bdf8",
    stats: { teaPower: 79, madness: 64, courage: 75 },
    specialAbility: {
      name: "Sisterly Protocol",
      description: "Whispers urgent warnings to shield Alice from neighborhood gossip and public scandal with gentle, anxious poise."
    },
    vocalTone: "Soft, anxious, elder-sisterly, balancing strict Victorian propriety with genuine affection.",
    keyLines: [
      "Alice, pay attention. What is the use of a book without pictures or conversations?",
      "Please, Alice, just smile today. Mother has spent weeks arranging this."
    ],
    speakingPrompt: "Urges Alice to stop daydreaming and fix her stockings, confiding in hushed tones about the sacrifices women must make.",
    stageAction: "Glides in carrying an antique book, sitting beside Alice with gentle sisterly care.",
    openingLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
    interactionCue: {
      triggerCharacter: "Alice's Mother (Ada)",
      triggerLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      actionInstruction: "Step in quickly as Mother checks the tea service, grasp Alice's hands, and whisper:",
      responseLine: "Please, Alice, just smile today. Mother has spent weeks arranging this."
    },
    costume: [
      "Cornflower blue velvet Victorian day dress with puff shoulders",
      "Delicate cream lace collar with antique oval cameo brooch",
      "Neat Gibson hair bun with pearl pins"
    ],
    props: [
      "Antique leather-bound illustrated volume of Victorian poetry",
      "Lace-edged handkerchief embroidered with 'M'"
    ],
    image: "assets/characters/margaret.jpg"
  },
  {
    id: "4a-mother-ada",
    number: 8,
    classId: "4a",
    name: "ALICE'S MOTHER",
    title: "Helen Kingsleigh (Matriarch)",
    actor: "Ada",
    role: "Imperious Matriarch of the Kingsleigh Estate",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#701a75",
    accentColor: "#e879f9",
    stats: { teaPower: 87, madness: 69, courage: 83 },
    specialAbility: {
      name: "Matriarch's Command",
      description: "Commands instant spinal alignment and social etiquette across the terrace with an icy stare and a snap of her fan."
    },
    vocalTone: "Regally composed, crisp, sharp, masking social anxiety behind perfect Victorian etiquette.",
    keyLines: [
      "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      "Smile, Alice. The world is watching."
    ],
    speakingPrompt: "Instructs on holding teacups without trembling, defends family honor against gossip, and demands obedience for Alice's societal future.",
    stageAction: "Straightens Alice’s shoulders and adjusts her collar with stern perfectionism.",
    openingLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
    interactionCue: {
      triggerCharacter: "Garden Terrace Bell",
      triggerLine: "(The opening bell chimes for the Ascot garden party guests to arrive)",
      actionInstruction: "Step behind Alice, place both hands firmly on her shoulders to straighten her, and command:",
      responseLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive."
    },
    costume: [
      "Deep wine-burgundy crushed-velvet Victorian matriarch gown",
      "Standing ecru lace collar & lace mitt gloves",
      "Pearl hair combs holding an immaculate Victorian coiffure"
    ],
    props: [
      "Antique painted folding handheld fan with lace trim",
      "Gold open-faced pocket watch on a lapel chain"
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
    accentColor: "#f59e0b",
    stats: { teaPower: 84, madness: 80, courage: 96 },
    specialAbility: {
      name: "True Compass Scent",
      description: "Tracks hidden paths through dark woods, smelling red card soldiers miles before they arrive to warn the innocent.",
    },
    vocalTone: "Deep, weary, gravelly, carrying the sorrow of an enslaved hound doing his duty for his pups.",
    keyLines: [
      "Follow the scent, girl... The Red Queen holds my pups hostage, but my heart belongs to the true Queen.",
      "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    ],
    speakingPrompt: "Drops to knee to sniff stage floor, warns the table that Stayne’s red cards are closing in, and urges Alice toward the White Queen's castle.",
    stageAction: "Bounds in low, tracking the floor with nose, holding a brass compass high to halt the table.",
    openingLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
    interactionCue: {
      triggerCharacter: "Offstage Marching Drums",
      triggerLine: "(Sounds of heavy rhythmic marching drums echo offstage)",
      actionInstruction: "Drop to one knee, press your ear to the stage floor, raise your brass compass, and bellow:",
      responseLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    },
    costume: [
      "Russet leather hound hood with long drooping faux-fur ears",
      "Weathered rust-brown leather duster coat with road-dust weathering",
      "Fingerless leather paw mitts & dog nose makeup"
    ],
    props: [
      "Heavy brass antique navigational compass on a thick chain",
      "Distressed antique parchment map of Underland"
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
    themeColor: "#0284c7",
    accentColor: "#38bdf8",
    stats: { teaPower: 100, madness: 100, courage: 86 },
    specialAbility: {
      name: "Time Freeze Feud",
      description: "Freezes clocks at exactly six o'clock, trapping the table in an endless cycle of tea refills, buttered watches, and riddles."
    },
    vocalTone: "Mercurial, rapid-fire, switching instantly from manic laughter to deep, solemn gravity.",
    keyLines: [
      "Why is a raven like a writing desk?",
      "Have I gone mad? I’m afraid so. You’re entirely bonkers. But I’ll tell you a secret: all the best people are.",
      "No room! No room! There's no room at all!"
    ],
    speakingPrompt: "Demands that everyone take more tea before they've had any, inspects watches with butter, and rallies the table for the Frabjous Day.",
    stageAction: "Inspects an antique clock with a butter knife, brandishing it with manic intensity.",
    openingLine: "No room! No room! There's no room at all!",
    interactionCue: {
      triggerCharacter: "Alice (İpek)",
      triggerLine: "Excuse me, but could anyone tell me the way to...",
      actionInstruction: "Leap up from your chair, flourish your butter knife, and shout across the table:",
      responseLine: "No room! No room! There's no room at all!"
    },
    costume: [
      "Peacock-feathered royal blue damask silk top hat with '10/6' card and skeleton key",
      "Oversized emerald bowtie & embroidered gold-and-green waistcoat",
      "Deep navy velvet tailcoat with wide peak lapels"
    ],
    props: [
      "Polished ornate silver teapot",
      "Vintage butter knife & antique pocket watch smeared with faux butter",
      "Fine Victorian porcelain teacup & saucer"
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
      "Off with their heads!",
      "I’d far rather be feared than loved. Someone has stolen my tarts!",
      "Silence! Who dared host an unauthorized tea party in my domain?!"
    ],
    speakingPrompt: "Barges in inspecting the tea table for treason, accuses guests of insolence, and orders executions for minor table manner infractions.",
    stageAction: "Sweeps downstage in high fury, pointing her heart scepter at the tea table guests with trembling rage.",
    openingLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!",
    interactionCue: {
      triggerCharacter: "Bayard Dog (Efe)",
      triggerLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
      actionInstruction: "Storm center stage immediately behind Bayard's warning, slam your scepter down, and roar:",
      responseLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!"
    },
    costume: [
      "Heart-shaped Elizabethan updo crowned with ruby tiara",
      "Pleated dark burgundy Elizabethan ruff collar",
      "Crimson crushed velvet gown with gold heart crest & red/black striped inner sleeves"
    ],
    props: [
      "Ruby heart-headed royal scepter",
      "Oversized gilded Queen of Hearts playing card",
      "Velvet-lined royal tart basket"
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
    themeColor: "#4d7c0f",
    accentColor: "#a3e635",
    stats: { teaPower: 86, madness: 95, courage: 79 },
    specialAbility: {
      name: "Treacle Riddle",
      description: "Weaves dizzying fables about sisters living at the bottom of a treacle well, bewildering anyone who tries to interrupt."
    },
    vocalTone: "Bouncy, rhythmic, argumentative, speaking at double-speed with theatrical cheekiness.",
    keyLines: [
      "Contrariwise! If it was so, it might be; and if it were so, it would be; but as it isn’t, it ain’t! That’s logic!",
      "They lived at the bottom of a well... and they were learning to draw treacle!"
    ],
    speakingPrompt: "Argues with Sister Lacie over who greets the guest first, challenges Alice's concept of reality, and recites nonsense treacle fables.",
    stageAction: "Marches mechanically in step with Sister Lacie (Esila), swinging an oversized button.",
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

// Default to Class 4-A roster as requested, while retaining all data
const TEA_PARTY_CARDS_DATA = CLASS_4A_CARDS_DATA;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLASS_4A_CARDS_DATA, TEA_PARTY_CARDS_DATA };
}
