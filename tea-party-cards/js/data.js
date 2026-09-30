/**
 * Alice in Wonderland: Mad Tea Party Double-Sided Character Trading Cards
 * Complete Character Roster & Performance Database (19 Unique Characters)
 * Conforming strictly to the Master Prompt & Creative Brief
 */

const TEA_PARTY_CARDS_DATA = [
  {
    id: "alice",
    number: 1,
    name: "ALICE",
    title: "Alice Kingsleigh",
    actor: "Derin",
    role: "The Unconquerable Dreamer & Champion",
    act: "Act I: The Victorian Garden & Act IV: The Royal Climax",
    actNumber: 1,
    themeColor: "#2563eb", // Victorian Sapphire / Cornflower
    accentColor: "#60a5fa",
    bgPattern: "rose-watch",
    stats: {
      teaPower: 88,
      madness: 92,
      courage: 98
    },
    specialAbility: {
      name: "Muchness Surge",
      description: "Shakes off societal conformity and mental confusion, reclaiming her true identity and wielding the Vorpal blade with absolute clarity."
    },
    vocalTone: "Clear, earnest, curious, shifting from polite Victorian hesitation to resolute confidence.",
    keyLines: [
      "It’s no use going back to yesterday, because I was a different person then.",
      "I can’t believe impossible things! ...Or can I?",
      "I know who I am now. I am Alice, and this is my dream!"
    ],
    speakingPrompt: "Alice introduces herself politely to the table, bewildered by the lack of logic. She questions why the clocks are stopped, refuses to be told she is 'not quite Alice,' and challenges the hosts on their nonsensical rules while firmly asserting her own identity.",
    stageAction: "Stands up abruptly, backing away from Hamish and Lowell in defiance, then gazes toward the hedges before stepping into Underland.",
    openingLine: "It is my life! Why must everyone decide what I ought to be?",
    climaxLine: "I know who I am now. I am Alice, and this is my dream!",
    interactionCue: {
      triggerCharacter: "Lowell (Ertuğrul)",
      triggerLine: "Do not fight the current, little sister. Marriage is simply sensible business.",
      actionInstruction: "Step forward, turn away from the table in defiance, and declare:",
      responseLine: "It is my life! Why must everyone decide what I ought to be?"
    },
    costume: [
      "Victorian cornflower-blue puff-sleeve tea dress with white peter-pan collar",
      "Crisp white pinafore apron with delicate lace trim & floral embroidery",
      "Matching sky-blue satin bow hairband",
      "Opaque white cotton stockings",
      "Classic black patent leather Mary Jane shoes",
      "Gold charm bracelet with pocket watch and key charms"
    ],
    props: [
      "Antique ornamental brass skeleton key",
      "Delicate floral porcelain teacup with matching saucer",
      "Small gold locket necklace"
    ],
    image: "assets/characters/alice.jpg"
  },
  {
    id: "mad-hatter",
    number: 2,
    name: "MAD HATTER",
    title: "Tarrant Hightopp",
    actor: "Ozan M.",
    role: "Mercurial Chronomancer & Tea Host",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#0284c7", // Peacock Blue / Velvet Cyan
    accentColor: "#38bdf8",
    bgPattern: "gears-teacup",
    stats: {
      teaPower: 99,
      madness: 100,
      courage: 85
    },
    specialAbility: {
      name: "Time Freeze Feud",
      description: "Freezes the hands of time at exactly six o'clock, trapping the table in an endless cycle of tea refills, buttered watches, and unsolvable riddles."
    },
    vocalTone: "Mercurial, rapid-fire, switching instantly from manic laughter to deep, solemn gravity.",
    keyLines: [
      "Why is a raven like a writing desk?",
      "Have I gone mad? I’m afraid so. You’re entirely bonkers. But I’ll tell you a secret: all the best people are.",
      "No room! No room! There's no room at all!"
    ],
    speakingPrompt: "Demands that everyone take more tea before they've had any. He rants about his feud with 'Time,' tells an unfinished riddle, inspects a guest’s pocket watch with butter, and rallies the table for the coming of the 'Frabjous Day.'",
    stageAction: "Inspects an antique clock with a butter knife, leaping up from his chair to pace erratically around teapots.",
    openingLine: "No room! No room! There's no room at all!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "Excuse me, but could anyone tell me the way to...",
      actionInstruction: "Leap up from your chair, flourish your butter knife, and shout across the table:",
      responseLine: "No room! No room! There's no room at all!"
    },
    costume: [
      "Peacock-feathered royal blue damask silk top hat with authentic '10/6' price card and skeleton key charm",
      "Oversized silk emerald bowtie with gold embroidery",
      "Elaborate gold-and-green brocade waistcoat with brass filigree buttons",
      "Deep navy velvet tailcoat with wide peak lapels",
      "Fingerless black-and-grey striped knit wrist warmers",
      "Multiple vintage copper and brass rings on each finger"
    ],
    props: [
      "Polished ornate silver teapot",
      "Vintage pewter butter knife",
      "Antique pocket watch with open mechanism",
      "Fine Victorian porcelain teacup & saucer"
    ],
    image: "assets/characters/mad-hatter.jpg"
  },
  {
    id: "red-queen",
    number: 3,
    name: "RED QUEEN",
    title: "Iracebeth of Crims",
    actor: "Öykü",
    role: "Tyrannical Monarch of Underland",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#991b1b", // Crimson Velvet / Royal Red
    accentColor: "#f87171",
    bgPattern: "hearts-rose",
    stats: {
      teaPower: 75,
      madness: 90,
      courage: 94
    },
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
    speakingPrompt: "Barges in inspecting the tea table for treason. She demands to know who painted the white roses red, accuses guests of insolence, orders executions for minor table-manner infractions, and demands complete, trembling flattery.",
    stageAction: "Sweeps downstage in high fury, pointing her heart scepter at the tea table guests with trembling rage.",
    openingLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!",
    interactionCue: {
      triggerCharacter: "Bayard (Ozan)",
      triggerLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
      actionInstruction: "Storm center stage immediately behind Bayard's warning, slam your scepter down, and roar:",
      responseLine: "Silence! Who dared host an unauthorized tea party in my domain?! Someone has stolen my tarts, and someone will lose their head!"
    },
    costume: [
      "Voluminous heart-shaped Elizabethan updo crowned with ruby-encrusted gold miniature tiara",
      "Stiff pleated dark burgundy Elizabethan ruff collar",
      "Crimson crushed velvet gown with gold heart crest embroidery & corseted bodice",
      "Red-and-black horizontally striped inner sleeves with gold cuff lace",
      "Ruby cabochon rings and gold filigree wristbands"
    ],
    props: [
      "Ruby-topped gold heart royal scepter",
      "Oversized gilded Queen of Hearts playing card",
      "Velvet-lined royal tart basket"
    ],
    image: "assets/characters/red-queen.jpg"
  },
  {
    id: "white-queen",
    number: 4,
    name: "WHITE QUEEN",
    title: "Mirana of Marmoreal",
    actor: "İlay Eşkin",
    role: "Ethereal Sovereign of Marmoreal",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#475569", // Pearl Silver / Slate Velvet
    accentColor: "#cbd5e1",
    bgPattern: "crown-chess",
    stats: {
      teaPower: 92,
      madness: 82,
      courage: 90
    },
    specialAbility: {
      name: "Harmonic Potion",
      description: "Projects an aura of serene peace and alchemical restoration, calming the fury of beasts and awakening the champion's true courage."
    },
    vocalTone: "Ethereal, melodic, whisper-soft, floating her words with serene grace while hiding an unyielding will.",
    keyLines: [
      "It is a poor sort of memory that only works backwards.",
      "We must prepare the champion. Everything has its balance.",
      "Your reign of fear ends at this table, sister. The champion has found her muchness."
    ],
    speakingPrompt: "Welcomes the party guests in an airy, dreamlike voice. She offers eccentric recipe advice for potions, speaks gently about prophecy and peace, and calmly inspires Alice to stand up to the Jabberwocky.",
    stageAction: "Glides serenely downstage, lifting her hands to cast a calm aura over the stage, standing beside Alice.",
    openingLine: "Your reign of fear ends at this table, sister. The champion has found her muchness.",
    interactionCue: {
      triggerCharacter: "Jabberwocky (Ali)",
      triggerLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl!",
      actionInstruction: "Glide gracefully between Jabberwocky and Alice, raise your palms calmly, and announce:",
      responseLine: "Your reign of fear ends at this table, sister. The champion has found her muchness."
    },
    costume: [
      "Ornate pearl-and-diamond tiara nestled into elegant dark Victorian coiffure",
      "High-standing sheer white lace Medici collar",
      "Ivory and silver brocade court gown featuring embroidered chess pieces & silver filigree",
      "Delicate sheer white lace fingerless gloves",
      "Opal and pearl cocktail rings"
    ],
    props: [
      "Oversized hand-carved white alabaster chess queen piece",
      "Crystalline potion vial with ornate silver dropper stopper",
      "Silver chalice with alchemical mist"
    ],
    image: "assets/characters/white-queen.jpg"
  },
  {
    id: "white-rabbit",
    number: 5,
    name: "WHITE RABBIT",
    title: "Nivens McTwisp",
    actor: "Mina",
    role: "Frantic Royal Herald & Timekeeper",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#d97706", // Antique Gold / Amber
    accentColor: "#fcd34d",
    bgPattern: "pocketwatch-clocks",
    stats: {
      teaPower: 80,
      madness: 75,
      courage: 68
    },
    specialAbility: {
      name: "Ticking Sprint",
      description: "Dodges imminent royal executions and chaos by darting at double speed, delivering jumbled court summonses on the fly."
    },
    vocalTone: "High-pitched, breathless, twitchy, speaking in frantic bursts while gasping for air.",
    keyLines: [
      "I’m late! I’m late! For a very important date!",
      "The Queen will have my head, my ears, my whiskers!",
      "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    ],
    speakingPrompt: "Paces nervously around the table checking a pocket watch. He reads a frantic, jumbled proclamation from a scroll, scolds everyone for wasting precious seconds, and warns Alice that the Red Knights are hunting her.",
    stageAction: "Sprints frantically across the apron of the stage, checking a giant pocket watch and clutching a court scroll before ducking behind the tea table.",
    openingLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "Why must everyone decide what I ought to be?",
      actionInstruction: "Sprint across the stage apron, clutch your pocket watch frantically, and gasp:",
      responseLine: "No time, no time, no time! The Queen's tea is cold and my head is already on the chopping block!"
    },
    costume: [
      "Faux-fur upright rabbit ears headband with pink inner velvet lining",
      "Subtle stage whisker and pink bunny nose makeup",
      "Tiered white lace jabot cravat with antique watch cameo brooch",
      "Damask brocade vest with gold watch chain",
      "Beige/taupe velvet tailcoat with ruffled lace cuffs",
      "Knit fingerless gloves with carrot and clock rings"
    ],
    props: [
      "Giant gold pocket watch on heavy brass chain",
      "Parchment royal proclamation scroll tied with red wax seal",
      "Hanging miniature carrot charm trinket"
    ],
    image: "assets/characters/white-rabbit.jpg"
  },
  {
    id: "march-hare",
    number: 6,
    name: "MARCH HARE",
    title: "Thackery Earwicket",
    actor: "Kerem",
    role: "Erratic Co-Host of the Mad Tea Table",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#15803d", // Moss Velvet / Spring Green
    accentColor: "#4ade80",
    bgPattern: "teacup-carrots",
    stats: {
      teaPower: 96,
      madness: 98,
      courage: 80
    },
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
    speakingPrompt: "Erratically offers empty teacups, insists butter belongs inside clock mechanisms, throws imaginary sugar into the air, and forces everyone to switch seats around the table without explanation.",
    stageAction: "Maniacally clatters teacups together, tossing sugar cubes and rearranging tableware mid-sentence.",
    openingLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Ozan M.)",
      triggerLine: "No room! No room! There's no room at all!",
      actionInstruction: "Slide an empty teacup directly across the table at Alice and chirp cheerfully:",
      responseLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!"
    },
    costume: [
      "Distressed brown beaver-felt top hat with tall upright plush hare ears",
      "Rosy theatrical cheek blush and dark whisker stubble",
      "Moss green velvet tailcoat with frayed silk lining",
      "Clock-face and carrot embroidered tapestry waistcoat",
      "Silk neck ascot loosely tied",
      "Brown fingerless mitts with carrot charm rings"
    ],
    props: [
      "Antique copper and porcelain floral teapot",
      "Mismatched vintage floral teacups & saucers",
      "Printed parchment 'Mad Tea-Party Menu' with gear seals"
    ],
    image: "assets/characters/march-hare.jpg"
  },
  {
    id: "dormouse-nisa",
    number: 7,
    name: "DORMOUSE",
    title: "Mallymkun (Sleeper)",
    actor: "Nisa",
    role: "Drowsy Teapot Guardian & Rapier Duelist",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#713f12", // Earth Tweed / Chestnut
    accentColor: "#ca8a04",
    bgPattern: "teapot-zzz",
    stats: {
      teaPower: 84,
      madness: 86,
      courage: 91
    },
    specialAbility: {
      name: "Treacle Wake",
      description: "Jolts upright from deep sleep into furious rapier combat the instant injustice—or the word 'cat'—is mentioned."
    },
    vocalTone: "Muffled, drowsy, slurred mumbles that suddenly snap into fierce, high-pitched bravery.",
    keyLines: [
      "Twinkle, twinkle, little bat... I wasn't sleeping, I heard every single word!",
      "Down with the bloody Red Queen!",
      "I wasn't asleep! I was merely resting my whiskers and contemplating treacle!"
    ],
    speakingPrompt: "Wakes up face-down on the table, denies ever being asleep, recites a fragmented fable about sisters living inside a treacle well, threatens anyone who mentions 'cats,' and immediately nods back off.",
    stageAction: "Jolts awake from inside an oversized teapot, rubbing her eyes with a 'Zzz' embroidered handkerchief.",
    openingLine: "I wasn't asleep! I was merely resting my whiskers and contemplating treacle!",
    interactionCue: {
      triggerCharacter: "March Hare (Kerem)",
      triggerLine: "Take some wine! Oh, there isn’t any, but it was very polite of me to offer!",
      actionInstruction: "Shoot upright from behind your teapot, brandish your teaspoon, and protest drowsily:",
      responseLine: "I wasn't asleep! I was merely resting my whiskers and contemplating treacle!"
    },
    costume: [
      "Patchwork tan-and-plaid mouse-ear nightcap with soft floppy ears",
      "Oversized earth-toned tweed frock coat with patched lapels",
      "Brown corduroy/velvet waistcoat and loose neck cravat",
      "Fingerless wool knitted wrist gloves",
      "Theatrical mouse nose dot and delicate whisker makeup"
    ],
    props: [
      "Delicate porcelain demitasse teacup",
      "White handkerchief with bold embroidered 'Zzz'",
      "Antique clothbound book titled 'The Philosophy of Sleep'",
      "Heavy brass teaspoon used as a dueling rapier"
    ],
    image: "assets/characters/dormouse-nisa.jpg"
  },
  {
    id: "dormouse-yagmur",
    number: 8,
    name: "DORMOUSE",
    title: "Mallymkun (Sentinel)",
    actor: "Yağmur",
    role: "Skeptical Tea Critic & Clockkeeper",
    act: "Act II: Down the Rabbit Hole & The Mad Tea Table",
    actNumber: 2,
    themeColor: "#854d0e", // Antique Bronze / Ochre
    accentColor: "#eab308",
    bgPattern: "alarmclock-spoon",
    stats: {
      teaPower: 82,
      madness: 88,
      courage: 89
    },
    specialAbility: {
      name: "Muchness Meter",
      description: "Cuts through grand illusions and pretense with blunt honesty; rattles loud brass alarm clocks to wake slumbering allies."
    },
    vocalTone: "Heavy-lidded, grumbling, soft-spoken squeaks punctuated by sharp, territorial outbursts.",
    keyLines: [
      "You’ve got the wrong Alice, Hatter! She’s lost her muchness.",
      "Wake me when the fighting starts.",
      "She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!"
    ],
    speakingPrompt: "Complains about the cold tea, defends her spot in the teapot, warns Alice that she doesn't look brave enough to slay dragons, and drops her spoon in exhaustion mid-sentence.",
    stageAction: "Struggles upright from behind a stack of books, clutching a brass alarm clock and shaking her tiny fist.",
    openingLine: "She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "I can assure you, I am Alice!",
      actionInstruction: "Rattle your brass alarm clock on the table, point a small finger, and scoff:",
      responseLine: "She’s the wrong Alice, Hatter! Look at her—she’s completely lost her muchness!"
    },
    costume: [
      "Rustic earth-toned nightcap with rounded mouse ears and pompom tail",
      "Patched vintage tweed coat with frayed houndstooth lapels",
      "Gold velvet vest with antique brass buttons",
      "Knit fingerless mitts with gemstone rings",
      "Soft charcoal nose tip and whisker lines"
    ],
    props: [
      "Twin-bell brass wind-up alarm clock",
      "Miniature floral teacup & saucer",
      "Antique leather-bound book titled 'The History of Dreams'",
      "Vintage pewter teaspoon"
    ],
    image: "assets/characters/dormouse-yagmur.jpg"
  },
  {
    id: "cheshire-cat",
    number: 9,
    name: "CHESHIRE CAT",
    title: "Chessur",
    actor: "Elif Beren",
    role: "Enigmatic Riddle-Weaver of the Woods",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#6b21a8", // Midnight Plum / Electric Violet
    accentColor: "#c084fc",
    bgPattern: "grin-moon",
    stats: {
      teaPower: 87,
      madness: 99,
      courage: 88
    },
    specialAbility: {
      name: "Grin Dispersal",
      description: "Fades into thin air, leaving behind an inescapable philosophical riddle and a hovering grin that confounds enemies."
    },
    vocalTone: "Silky, purring, hypnotic, lingering over words with an enigmatic, knowing smirk.",
    keyLines: [
      "We’re all mad here. I’m mad. You’re mad.",
      "If you don’t care where you want to get to, then it doesn’t much matter which way you walk.",
      "Every path leads somewhere, Hatter... if only you walk long enough to get there."
    ],
    speakingPrompt: "Appears from behind the guests with a teasing grin. She taunts Alice with circular logic about directions, mocks the Hatter’s sanity, questions whether anything at the table is real, and vanishes behind her grin.",
    stageAction: "Steps out from behind an ornate antique backdrop, holding her painted grin mask aloft with a feline glide.",
    openingLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there.",
    interactionCue: {
      triggerCharacter: "Mad Hatter (Ozan M.)",
      triggerLine: "If only someone knew the path to Marmoreal...",
      actionInstruction: "Step forward from behind the screen, lower your grin mask, and purr:",
      responseLine: "Every path leads somewhere, Hatter... if only you walk long enough to get there."
    },
    costume: [
      "Plum velvet cat-ear headband with dangling clock charms",
      "Deep violet and purple striped velvet frock coat with jagged clown collar",
      "Cat-silhouette tapestry waistcoat with gold buttons",
      "Purple-and-magenta striped Victorian trousers",
      "Fingerless purple mitts with printed pink paw pads",
      "Long curved plush striped cat tail attached to belt"
    ],
    props: [
      "Handheld painted Cheshire Cat grin mask on a brass wand",
      "Miniature winged dragon figurine",
      "Miniature wooden 'To Wonderland' signpost",
      "Tiny corked potion vial labeled 'Drink Me'"
    ],
    image: "assets/characters/cheshire-cat.jpg"
  },
  {
    id: "dinah",
    number: 10,
    name: "DINAH",
    title: "Alice's Hearth Kitten",
    actor: "Nilda",
    role: "Gentle Hearth Guardian & Waking Tether",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#166534", // Hearth Olive / Velvet Forest
    accentColor: "#4ade80",
    bgPattern: "cat-yarn",
    stats: {
      teaPower: 81,
      madness: 74,
      courage: 86
    },
    specialAbility: {
      name: "Hearth Anchor",
      description: "Reminds wandering dreamers of warm fireplaces, ticking grandfather clocks, and reality, counteracting Wonderland's spell."
    },
    vocalTone: "Purring, gentle, domestic, blending feline curiosity with Victorian primness.",
    keyLines: [
      "Do cats eat bats? Or do bats eat cats? You’ve forgotten me, Alice.",
      "Wonderland has no saucers of cream.",
      "Do you remember home, Alice? The gentle fire, the warm hearth... or will you let this madness swallow you whole?"
    ],
    speakingPrompt: "Observes the table as an outsider, playfully stalking teacups, reminding Alice of the quiet garden back home, and questioning why these strange forest creatures act so uncivilized.",
    stageAction: "Steps forward silently with padded grace, playing with a mechanical trinket, observing the chaos with detached dignity.",
    openingLine: "Do you remember home, Alice? The gentle fire, the warm hearth... or will you let this madness swallow you whole?",
    interactionCue: {
      triggerCharacter: "Tweedledum & Tweedledee",
      triggerLine: "Contrariwise! Nohow! Pay the toll!",
      actionInstruction: "Slip gracefully between the bickering twins, tilt your head at Alice, and ask softly:",
      responseLine: "Do you remember home, Alice? The gentle fire, the warm hearth... or will you let this madness swallow you whole?"
    },
    costume: [
      "Olive green velvet cat ears with dangling miniature pocket watch charms",
      "Forest green velvet tailcoat with long spiraled cat tail",
      "Clockwork-patterned waistcoat with silver fish brooch",
      "Pleated clown-style neck ruff collar",
      "Fingerless cat-paw mittens with padded palms",
      "Delicate whisker lines and button-nose makeup"
    ],
    props: [
      "Miniature clockwork rabbit house music box",
      "Antique fish-shaped brass desk clock",
      "Small porcelain saucer with silver fish trinket"
    ],
    image: "assets/characters/dinah.jpg"
  },
  {
    id: "jabberwocky",
    number: 11,
    name: "JABBERWOCKY",
    title: "The Dragon Man",
    actor: "Ali",
    role: "The Red Queen's Draconic Destroyer",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#14532d", // Dark Draconic Scale / Obsidian Green
    accentColor: "#86efac",
    bgPattern: "dragon-sword",
    stats: {
      teaPower: 60,
      madness: 78,
      courage: 99
    },
    specialAbility: {
      name: "Vorpal Bane & Flame Blade",
      description: "Ignites a blazing draconic broadsword; his impenetrable scale armor shrugs off physical attacks and shatters mortal resolve."
    },
    vocalTone: "Deep, guttural, slow, reverberating with cold, draconic malice.",
    keyLines: [
      "My jaws that bite, my claws that catch... You cannot escape the Frabjous Day.",
      "The Vorpal sword will shatter against my scales.",
      "The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales."
    ],
    speakingPrompt: "Delivers a chilling threat directly to Alice and her allies. He mocks her mortal fragility, roars warnings of fire and ruin across Underland, and declares that the Red Queen’s domain will never fall.",
    stageAction: "Strides center stage with wings flared, igniting a glowing broadsword with slow, draconic majesty.",
    openingLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales.",
    interactionCue: {
      triggerCharacter: "Red Queen (Öykü)",
      triggerLine: "Champion! Destroy her!",
      actionInstruction: "Stride heavily to center stage, ignite your flame broadsword, flare your wings, and roar:",
      responseLine: "My jaws that bite, my claws that catch... The Frabjous Day has arrived, mortal girl, and your blade will turn to ash against my scales."
    },
    costume: [
      "Draconic horned crown prosthetic with scaled brow ridges",
      "Reptilian scale facial contouring and dragon eye makeup",
      "Large articulated ribbed bat/dragon wings mounted on shoulders",
      "Dark emerald scale-embossed leather armor trench coat",
      "Segmented iron chestplate and leather gauntlets with clawed fingertips"
    ],
    props: [
      "Full-length glowing flame broadsword with dragon-head pommel",
      "Stolen royal velvet crimson crown with gold jewels"
    ],
    image: "assets/characters/jabberwocky.jpg"
  },
  {
    id: "bandersnatch",
    number: 12,
    name: "BANDERSNATCH",
    title: "Beast of the Frumious Woods",
    actor: "Lina",
    role: "Fierce Guardian of the Underland Keys",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#0f766e", // Teal Scales / Beast Fur
    accentColor: "#2dd4bf",
    bgPattern: "claw-keys",
    stats: {
      teaPower: 72,
      madness: 76,
      courage: 96
    },
    specialAbility: {
      name: "Beast Compassion",
      description: "Breaks free from the Red Queen's cruelty when shown kindness, turning razor claws into an unbreakable shield for the rightful champion."
    },
    vocalTone: "Low, guttural growls and snarls shifting slowly into rough, protective warmth.",
    keyLines: [
      "Grrr... Give me back my eye! ...You bandaged my wound? No one has ever shown me kindness.",
      "I guard the key. Touch it and bleed.",
      "The girl with the gentle hands... you healed my eye when she gave me chains."
    ],
    speakingPrompt: "Circles the tea table sniffing guests with suspicion, bares her claws at any sudden movements, then kneels before Alice, offering loyalty and the dungeon keys in exchange for compassion.",
    stageAction: "Emerges snarling on all fours with extended beast claws, stalking toward Alice before freezing in recognition.",
    openingLine: "(A deep snarl softening into spoken speech) The girl with the gentle hands... you healed my eye when she gave me chains.",
    interactionCue: {
      triggerCharacter: "Red Queen (Öykü)",
      triggerLine: "Tear them to ribbons, my beast!",
      actionInstruction: "Stalk toward Alice snarling, stop inches away, lower your claws, and whisper:",
      responseLine: "The girl with the gentle hands... you healed my eye when she gave me chains."
    },
    costume: [
      "Green reptilian/feline scale prosthetics on temples and cheekbones",
      "Heavy hooded crushed-velvet textured robe with dense fur trim",
      "Scale-mail leather cuirass underneath coat",
      "Articulated metallic beast gauntlet with long razor claws",
      "Antique brass and turquoise claw rings"
    ],
    props: [
      "Heavy iron ring containing oversized antique Underland dungeon keys",
      "Faux leather beast collar with broken chains"
    ],
    image: "assets/characters/bandersnatch.jpg"
  },
  {
    id: "tweedledum",
    number: 13,
    name: "TWEEDLEDUM",
    title: "Brother Dum",
    actor: "Egehan",
    role: "Contrarian Scholar of Nonsense Logic",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#4d7c0f", // Chartreuse / Tweed Green
    accentColor: "#a3e635",
    bgPattern: "button-bell",
    stats: {
      teaPower: 85,
      madness: 94,
      courage: 78
    },
    specialAbility: {
      name: "Contrariwise Axiom",
      description: "Counter-argues any statement with backwards logic, spinning interlocutors into an endless loop of contradictory riddles."
    },
    vocalTone: "Bouncy, rhythmic, argumentative, speaking at double-speed while gesturing wildly.",
    keyLines: [
      "Contrariwise! If it was so, it might be; and if it were so, it would be; but as it isn’t, it ain’t! That’s logic!",
      "You’re only a sort of thing in his dream!",
      "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!"
    ],
    speakingPrompt: "Argues with Tweedledee over who gets to greet the guest first, challenges Alice’s concept of reality, recites half of a nonsense poem, and insists on shaking hands criss-cross style.",
    stageAction: "Marches out shoulder-to-shoulder with Tweedledee, matching steps mechanically, swinging an oversized wooden button.",
    openingLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!",
    interactionCue: {
      triggerCharacter: "Alice (Derin)",
      triggerLine: "Excuse me, I'm trying to follow the path through the forest...",
      actionInstruction: "March into Alice's path, wave your giant wooden button, and proclaim:",
      responseLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!"
    },
    costume: [
      "Bright green bowler hat adorned with hanging brass bell",
      "Striped purple-and-green Victorian frock coat with wide collar",
      "Ornate tapestry floral waistcoat with mismatched colored buttons",
      "Oversized floppy green-striped bow tie",
      "Striped fingerless mitts with oversized brass rings",
      "Painted rosy red clown cheek discs"
    ],
    props: [
      "Oversized 6-inch carved wooden button with thick twine",
      "Stack of antique brass clockwork gears",
      "Miniature brass bell"
    ],
    image: "assets/characters/tweedledum.jpg"
  },
  {
    id: "tweedledee",
    number: 14,
    name: "TWEEDLEDEE",
    title: "Brother Dee",
    actor: "Uras",
    role: "Stubborn Herald of Contradiction",
    act: "Act III: Wonderland Encounters",
    actNumber: 3,
    themeColor: "#65a30d", // Olive Chartreuse / Stripe Gold
    accentColor: "#bef264",
    bgPattern: "bell-button",
    stats: {
      teaPower: 85,
      madness: 94,
      courage: 78
    },
    specialAbility: {
      name: "Nohow Toll",
      description: "Blocks forward passage until proper nonsensical Victorian etiquette and toll handshakes are rendered in full."
    },
    vocalTone: "Mirroring Tweedledum's cadence, interrupting with stubborn, comedic defiance.",
    keyLines: [
      "Nohow! And what’s more, you began it! The first thing in a visit is to say ‘How d’ye do?’",
      "Speak English, brother, nobody can understand your nonsense!",
      "Nohow! And what’s more, you ought to pay toll before taking another step!"
    ],
    speakingPrompt: "Immediately contradicts whatever Tweedledum states, accuses his twin of ruining the poetry recitation, challenges the Hatter to an umbrella duel, and insists Alice must choose which twin is smarter.",
    stageAction: "Elbows Tweedledum out of the way, ringing his brass handbell vigorously and pointing his shoe toes outward.",
    openingLine: "Nohow! And what’s more, you ought to pay toll before taking another step!",
    interactionCue: {
      triggerCharacter: "Tweedledum (Egehan)",
      triggerLine: "Contrariwise! If you think you're going that way, you’re precisely headed the wrong direction!",
      actionInstruction: "Ring your brass handbell in Tweedledum's face, turn to Alice, and shout:",
      responseLine: "Nohow! And what’s more, you ought to pay toll before taking another step!"
    },
    costume: [
      "Matching emerald green bowler hat with side-hanging brass bell",
      "Striped green-and-purple Edwardian suit with flap pockets",
      "Antique tapestry floral vest with brass toggle buttons",
      "Matching oversized floppy striped bowtie",
      "Striped wrist warmers and brass rings",
      "Matching painted round red cheek discs"
    ],
    props: [
      "Polished handheld brass school bell",
      "Vintage closed umbrella with duck-head handle",
      "Small stack of clock gears"
    ],
    image: "assets/characters/tweedledee.jpg"
  },
  {
    id: "hamish",
    number: 15,
    name: "HAMISH ASCOT",
    title: "Lord Hamish Ascot",
    actor: "Utku",
    role: "Arrogant Aristocrat & Reluctant Suitor",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#881337", // Imperial Burgundy / Wine Silk
    accentColor: "#fb7185",
    bgPattern: "cane-watch",
    stats: {
      teaPower: 70,
      madness: 45,
      courage: 50
    },
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
    speakingPrompt: "Complains about the draft in the garden, lectures Alice on her duty to marry into high society, demands a cup of tea made to precise English standards, and scoffs at the absurd dreams of artists and eccentrics.",
    stageAction: "Enters briskly with his silver-topped cane, inspecting his pocket watch and dusting his coat lapel.",
    openingLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union.",
    interactionCue: {
      triggerCharacter: "Margaret Kingsleigh (Elif Asya)",
      triggerLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
      actionInstruction: "Walk up pompously as Margaret steps back, tap your cane on the stone path, and sneer:",
      responseLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union."
    },
    costume: [
      "Tailored rich burgundy velvet Victorian morning coat",
      "Tall matching burgundy silk top hat with satin ribbon",
      "Geometric patterned silk brocade waistcoat",
      "High-collared starched shirt with grey silk cravat and pearl stickpin",
      "Fitted charcoal wool trousers with sharp press lines"
    ],
    props: [
      "Silver-topped polished mahogany gentleman's walking cane",
      "Gold open-face pocket watch with double-Albert fob chain",
      "Embroidered white linen pocket square"
    ],
    image: "assets/characters/hamish.jpg"
  },
  {
    id: "bayard",
    number: 16,
    name: "BAYARD",
    title: "The Bloodhound",
    actor: "Ozan",
    role: "Loyal Scent-Tracker & Underland Scout",
    act: "Act IV: The Royal Confrontation",
    actNumber: 4,
    themeColor: "#78350f", // Russet Leather / Saddle Brown
    accentColor: "#f59e0b",
    bgPattern: "compass-map",
    stats: {
      teaPower: 83,
      madness: 80,
      courage: 95
    },
    specialAbility: {
      name: "True Compass Scent",
      description: "Tracks truth through treacherous deception, detecting card patrol movements leagues away and guiding champions safely."
    },
    vocalTone: "Deep, weary, gravelly, carrying the sorrow of an enslaved hound doing his duty.",
    keyLines: [
      "Follow the scent, girl... The Red Queen holds my pups hostage, but my heart belongs to the true Queen.",
      "Run. The Red Knights are catching the wind.",
      "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    ],
    speakingPrompt: "Drops to one knee to sniff the stage, warns the table that Stayne’s red cards are closing in, explains the heavy price of protecting his family, and urges Alice to ride with him toward the White Queen's castle.",
    stageAction: "Bounds in low, tracking the floor with his nose, holding his brass compass high to halt the table.",
    openingLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!",
    interactionCue: {
      triggerCharacter: "Offstage Marching Drums",
      triggerLine: "(Sounds of heavy rhythmic marching drums echo offstage)",
      actionInstruction: "Drop to one knee, press your ear to the stage floor, raise your brass compass, and bellow:",
      responseLine: "Beware! The wind carries the scent of card soldiers and crimson steel! Run, Alice, run!"
    },
    costume: [
      "Russet-brown leather hound hood with long drooping faux-fur hound ears",
      "Weathered rust-brown leather duster coat with road-dust weathering",
      "Horn-buttoned brocade waistcoat with leather neckerchief",
      "Fingerless leather paw gloves with paw pads",
      "Theatrical dog nose tip and muzzle whisker shading"
    ],
    props: [
      "Heavy brass antique navigational compass on a thick chain",
      "Distressed antique parchment map of Underland",
      "Weathered leather tracking collar"
    ],
    image: "assets/characters/bayard.jpg"
  },
  {
    id: "margaret",
    number: 17,
    name: "MARGARET",
    title: "Margaret Kingsleigh",
    actor: "Elif Asya",
    role: "Dutiful Sister & High-Society Diplomat",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#0369a1", // Cornflower Velvet / Sky Silk
    accentColor: "#38bdf8",
    bgPattern: "book-cameo",
    stats: {
      teaPower: 78,
      madness: 62,
      courage: 74
    },
    specialAbility: {
      name: "Sisterly Protocol",
      description: "Smooths over unconventional remarks and shields her sister from public embarrassment with gentle, anxious poise."
    },
    vocalTone: "Soft, anxious, elder-sisterly, balancing strict Victorian propriety with genuine affection.",
    keyLines: [
      "Alice, pay attention. What is the use of a book without pictures or conversations?",
      "You must think of Mother and what society whispers behind closed doors.",
      "Please, Alice, just smile today. Mother has spent weeks arranging this."
    ],
    speakingPrompt: "Urges Alice to stop daydreaming and fix her stockings, confides in hushed tones about the sacrifices women must make, and pleads with Alice not to embarrass the family in front of the Ascots.",
    stageAction: "Glides in carrying an antique book, sitting beside Alice with gentle, anxious sisterly care.",
    openingLine: "Please, Alice, just smile today. Mother has spent weeks arranging this.",
    interactionCue: {
      triggerCharacter: "Helen Kingsleigh (Elisa)",
      triggerLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
      actionInstruction: "Step in quickly as Helen inspects the tea service, grasp Alice's hands, and whisper:",
      responseLine: "Please, Alice, just smile today. Mother has spent weeks arranging this."
    },
    costume: [
      "Cornflower blue velvet Victorian day dress with gathered puff shoulders",
      "Delicate cream lace collar pinned with an antique oval cameo brooch",
      "Damask silk underskirt with scalloped hem",
      "Gibson Girl hair bun woven with small pearl pins",
      "Fine gold filigree ring and lace wrist cuffs"
    ],
    props: [
      "Antique leather-bound illustrated volume of Victorian poetry",
      "Lace-edged handkerchief embroidered with 'M'",
      "Floral porcelain tea saucer"
    ],
    image: "assets/characters/margaret.jpg"
  },
  {
    id: "helen",
    number: 18,
    name: "HELEN",
    title: "Helen Kingsleigh (Alice's Mother)",
    actor: "Elisa",
    role: "Imperious Matriarch of the Kingsleigh Estate",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#701a75", // Royal Plum / Matriarch Velvet
    accentColor: "#e879f9",
    bgPattern: "fan-lace",
    stats: {
      teaPower: 86,
      madness: 68,
      courage: 82
    },
    specialAbility: {
      name: "Matriarch's Command",
      description: "Silences unrest and commands perfect posture across the terrace with an icy stare and a snap of her folding fan."
    },
    vocalTone: "Regally composed, crisp, sharp, masking social anxiety behind perfect Victorian etiquette.",
    keyLines: [
      "A proper young lady does not run off into rabbit warrens! Think of the match you are throwing away.",
      "Smile, Alice. The world is watching.",
      "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive."
    ],
    speakingPrompt: "Instructs Alice on how to hold a teacup without trembling, defends family honor against neighborhood gossip, and demands obedience while arranging Alice's future under strict societal expectations.",
    stageAction: "Straightens Alice’s shoulders and adjusts her collar with stern perfectionism.",
    openingLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive.",
    interactionCue: {
      triggerCharacter: "Garden Terrace Entrance",
      triggerLine: "(The opening bell chimes for the Ascot garden party guests to arrive)",
      actionInstruction: "Step behind Alice, place both hands firmly on her shoulders to straighten her, and command:",
      responseLine: "Posture, Alice. A young lady of good standing does not slouch when the Ascot family is about to arrive."
    },
    costume: [
      "Deep wine-burgundy crushed-velvet Victorian matriarch gown with satin bodice",
      "High cream lace collar with antique brooch",
      "Delicate cream lace mitt gloves and pearl droplet earrings",
      "Pearl hair combs holding an immaculate Victorian coiffure",
      "Multiple antique gold rings with garnet stones"
    ],
    props: [
      "Antique painted folding handheld fan with lace trim",
      "Gold open-faced pocket watch on a lapel chain",
      "Polished silver tea service calling bell"
    ],
    image: "assets/characters/helen.jpg"
  },
  {
    id: "lowell",
    number: 19,
    name: "LOWELL",
    title: "Lowell Manchester",
    actor: "Ertuğrul",
    role: "Cynical Man of Commerce & Society",
    act: "Act I: The Victorian Garden Party",
    actNumber: 1,
    themeColor: "#065f46", // Dark Emerald / Velvet Green
    accentColor: "#34d399",
    bgPattern: "cane-gears",
    stats: {
      teaPower: 76,
      madness: 70,
      courage: 65
    },
    specialAbility: {
      name: "Cynical Ledger",
      description: "Dismisses dreams, poetry, and whimsical nonsense as mere child's play, calculating all human interactions by profit and decorum."
    },
    vocalTone: "Smooth, arrogant, cynical, speaking with bored, dismissive charm.",
    keyLines: [
      "You live in fantasies, little sister. In the real world, men make the rules and women mind their manners.",
      "A good marriage is a business transaction. Nothing more.",
      "Do not fight the current, little sister. Marriage is simply sensible business."
    ],
    speakingPrompt: "Checks his gold pocket watch in disgust, laughs off Alice’s talk of rabbit holes as female hysteria, brags about his family investments, and warns Alice that nonconformity leads only to ruin.",
    stageAction: "Leans casually against a garden column, twirling his lion-headed cane with a cynical smirk.",
    openingLine: "Do not fight the current, little sister. Marriage is simply sensible business.",
    interactionCue: {
      triggerCharacter: "Hamish Ascot (Utku)",
      triggerLine: "Ah, Alice. Still daydreaming under the shade, I see. A habit we shall promptly cure after our union.",
      actionInstruction: "Take a leisurely sip from your teacup, twirl your lion cane, and smirk cynically:",
      responseLine: "Do not fight the current, little sister. Marriage is simply sensible business."
    },
    costume: [
      "Emerald green velvet morning tailcoat with notched silk lapels",
      "Dark forest-green silk top hat tilted slightly back",
      "Intricate clockwork & gold gear-patterned black satin waistcoat",
      "Black fishnet mesh fingerless glove on right hand",
      "Heavy gold signet rings on multiple fingers",
      "High white Victorian collar with black silk ascot"
    ],
    props: [
      "Ornate heavy brass lion-headed walking cane",
      "Large gold chain pocket watch with dangling fobs",
      "Small leather-bound pocket stock investment ledger"
    ],
    image: "assets/characters/lowell.jpg"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEA_PARTY_CARDS_DATA };
}
