/**
 * WILDLIFE DETECTIVE: CONSERVATION & ADAPTATIONS
 * English Adventure Academy | Grade 4 ESL / CEFR A1+ CLIL
 * Zero External Dependencies: All data, SVGs, and scenarios embedded.
 */

(function(root) {
  'use strict';

  // 1. Embedded Vector SVG Illustrations for Animals
  const SVG_ANIMALS = {
    snow_leopard: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <radialGradient id="slHead" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="60%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
        <!-- Fur Body & Head -->
        <ellipse cx="80" cy="92" rx="48" ry="40" fill="url(#slHead)"/>
        <!-- Ears -->
        <polygon points="44,48 30,22 58,36" fill="#94a3b8"/>
        <polygon points="46,44 36,28 54,36" fill="#f43f5e"/>
        <polygon points="116,48 130,22 102,36" fill="#94a3b8"/>
        <polygon points="114,44 124,28 106,36" fill="#f43f5e"/>
        <!-- Leopard Spots -->
        <circle cx="62" cy="74" r="5" fill="#475569" stroke="#334155" stroke-width="2"/>
        <circle cx="98" cy="74" r="5" fill="#475569" stroke="#334155" stroke-width="2"/>
        <circle cx="80" cy="62" r="4" fill="#475569"/>
        <circle cx="56" cy="106" r="6" fill="#475569" stroke="#334155" stroke-width="2"/>
        <circle cx="104" cy="106" r="6" fill="#475569" stroke="#334155" stroke-width="2"/>
        <!-- Eyes (Icy Blue) -->
        <ellipse cx="64" cy="82" rx="8" ry="10" fill="#0284c7"/>
        <ellipse cx="96" cy="82" rx="8" ry="10" fill="#0284c7"/>
        <circle cx="64" cy="82" r="4" fill="#082f49"/>
        <circle cx="96" cy="82" r="4" fill="#082f49"/>
        <circle cx="62" cy="79" r="2" fill="#ffffff"/>
        <circle cx="94" cy="79" r="2" fill="#ffffff"/>
        <!-- Muzzle -->
        <ellipse cx="80" cy="100" rx="14" ry="10" fill="#f1f5f9"/>
        <polygon points="76,96 84,96 80,102" fill="#e11d48"/>
        <path d="M 75 102 Q 80 106 80 102 Q 80 106 85 102" stroke="#334155" stroke-width="2" fill="none"/>
        <!-- Whiskers -->
        <line x1="50" y1="100" x2="26" y2="98" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="50" y1="104" x2="28" y2="108" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="110" y1="100" x2="134" y2="98" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="110" y1="104" x2="132" y2="108" stroke="#cbd5e1" stroke-width="2"/>
      </svg>
    `)}`,

    elephant: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <radialGradient id="eleGrad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="70%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#475569"/>
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="#0f172a" stroke="#10b981" stroke-width="3"/>
        <!-- Giant Ears -->
        <ellipse cx="40" cy="72" rx="26" ry="34" fill="#64748b"/>
        <ellipse cx="40" cy="72" rx="18" ry="24" fill="#cbd5e1" opacity="0.4"/>
        <ellipse cx="120" cy="72" rx="26" ry="34" fill="#64748b"/>
        <ellipse cx="120" cy="72" rx="18" ry="24" fill="#cbd5e1" opacity="0.4"/>
        <!-- Head -->
        <circle cx="80" cy="76" r="38" fill="url(#eleGrad)"/>
        <!-- Intelligent Eyes -->
        <circle cx="64" cy="68" r="5" fill="#1e293b"/>
        <circle cx="96" cy="68" r="5" fill="#1e293b"/>
        <circle cx="63" cy="66" r="1.8" fill="#ffffff"/>
        <circle cx="95" cy="66" r="1.8" fill="#ffffff"/>
        <!-- Curved Tusks -->
        <path d="M 62 96 C 54 115, 46 122, 38 120 C 44 110, 56 98, 62 96 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <path d="M 98 96 C 106 115, 114 122, 122 120 C 116 110, 104 98, 98 96 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- Flexible Trunk -->
        <path d="M 72 84 C 72 108, 68 126, 84 130 C 94 132, 94 122, 86 118 C 80 115, 82 98, 88 84 Z" fill="url(#eleGrad)" stroke="#334155" stroke-width="1.5"/>
      </svg>
    `)}`,

    tree_frog: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <radialGradient id="frogGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="60%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#15803d"/>
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="#0f172a" stroke="#f43f5e" stroke-width="3"/>
        <!-- Lime Green Body -->
        <ellipse cx="80" cy="94" rx="42" ry="36" fill="url(#frogGrad)"/>
        <!-- Blue Flanks -->
        <ellipse cx="48" cy="100" rx="10" ry="16" fill="#0284c7"/>
        <ellipse cx="112" cy="100" rx="10" ry="16" fill="#0284c7"/>
        <!-- Suction Webbed Toes -->
        <circle cx="34" cy="120" r="7" fill="#f97316"/>
        <circle cx="48" cy="128" r="7" fill="#f97316"/>
        <circle cx="126" cy="120" r="7" fill="#f97316"/>
        <circle cx="112" cy="128" r="7" fill="#f97316"/>
        <!-- Big Iconic Red Bulbous Eyes -->
        <circle cx="56" cy="54" r="22" fill="#dc2626"/>
        <circle cx="104" cy="54" r="22" fill="#dc2626"/>
        <circle cx="56" cy="54" r="16" fill="#ef4444"/>
        <circle cx="104" cy="54" r="16" fill="#ef4444"/>
        <!-- Vertical Slit Pupils -->
        <ellipse cx="56" cy="54" rx="3.5" ry="13" fill="#0f172a"/>
        <ellipse cx="104" cy="54" rx="3.5" ry="13" fill="#0f172a"/>
        <circle cx="53" cy="48" r="3" fill="#ffffff"/>
        <circle cx="101" cy="48" r="3" fill="#ffffff"/>
        <!-- Mouth Smile -->
        <path d="M 60 92 Q 80 104 100 92" stroke="#166534" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
    `)}`,

    barn_owl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <radialGradient id="owlFeather" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="60%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
        <!-- Feather Body -->
        <ellipse cx="80" cy="94" rx="44" ry="40" fill="url(#owlFeather)"/>
        <!-- Heart-Shaped Facial Disc -->
        <path d="M 80 50 C 65 30, 42 42, 44 68 C 46 88, 70 102, 80 108 C 90 102, 114 88, 116 68 C 118 42, 95 30, 80 50 Z" fill="#ffffff" stroke="#d97706" stroke-width="2.5"/>
        <!-- Deep Night-Vision Eyes -->
        <circle cx="62" cy="66" r="10" fill="#0f172a"/>
        <circle cx="98" cy="66" r="10" fill="#0f172a"/>
        <circle cx="62" cy="66" r="6" fill="#1e293b"/>
        <circle cx="98" cy="66" r="6" fill="#1e293b"/>
        <circle cx="60" cy="63" r="2.5" fill="#ffffff"/>
        <circle cx="96" cy="63" r="2.5" fill="#ffffff"/>
        <!-- Sharp Curved Beak -->
        <polygon points="77,74 83,74 80,88" fill="#f59e0b"/>
      </svg>
    `)}`,

    sea_turtle: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <radialGradient id="shellGrad" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#14b8a6"/>
            <stop offset="60%" stop-color="#0f766e"/>
            <stop offset="100%" stop-color="#115e59"/>
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="#0f172a" stroke="#06b6d4" stroke-width="3"/>
        <!-- Flippers (Paddle Adaptation) -->
        <ellipse cx="40" cy="56" rx="28" ry="12" transform="rotate(-30 40 56)" fill="#2dd4bf"/>
        <ellipse cx="120" cy="56" rx="28" ry="12" transform="rotate(30 120 56)" fill="#2dd4bf"/>
        <ellipse cx="48" cy="116" rx="18" ry="8" transform="rotate(25 48 116)" fill="#14b8a6"/>
        <ellipse cx="112" cy="116" rx="18" ry="8" transform="rotate(-25 112 116)" fill="#14b8a6"/>
        <!-- Shell (Carapace) -->
        <ellipse cx="80" cy="86" rx="38" ry="44" fill="url(#shellGrad)" stroke="#99f6e4" stroke-width="2"/>
        <!-- Scutes Pattern -->
        <polygon points="80,56 94,68 94,84 80,94 66,84 66,68" fill="#134e4a" stroke="#5eead4" stroke-width="1.5"/>
        <polygon points="80,94 94,104 94,118 80,126 66,118 66,104" fill="#134e4a" stroke="#5eead4" stroke-width="1.5"/>
        <!-- Head -->
        <ellipse cx="80" cy="38" rx="14" ry="18" fill="#2dd4bf"/>
        <circle cx="72" cy="34" r="3" fill="#042f2e"/>
        <circle cx="88" cy="34" r="3" fill="#042f2e"/>
      </svg>
    `)}`,

    honey_badger: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="72" fill="#0f172a" stroke="#a855f7" stroke-width="3"/>
        <!-- Robust Black Body -->
        <ellipse cx="80" cy="94" rx="46" ry="38" fill="#1e293b"/>
        <!-- Broad White-Gray Dorsal Stripe (Warning coloration) -->
        <path d="M 52 38 C 52 28, 108 28, 108 38 L 102 120 L 58 120 Z" fill="#e2e8f0"/>
        <!-- Head -->
        <ellipse cx="80" cy="56" rx="28" ry="24" fill="#0f172a"/>
        <ellipse cx="80" cy="50" rx="16" ry="18" fill="#f8fafc"/>
        <!-- Small tough ears -->
        <circle cx="56" cy="46" r="6" fill="#0f172a"/>
        <circle cx="104" cy="46" r="6" fill="#0f172a"/>
        <!-- Fierce Eyes -->
        <circle cx="70" cy="54" r="4" fill="#ffffff"/>
        <circle cx="90" cy="54" r="4" fill="#ffffff"/>
        <circle cx="70" cy="54" r="2.5" fill="#0f172a"/>
        <circle cx="90" cy="54" r="2.5" fill="#0f172a"/>
        <!-- Snout -->
        <circle cx="80" cy="65" r="5" fill="#000000"/>
        <!-- Heavy digging claws -->
        <path d="M 44 116 L 38 132 M 50 118 L 48 135 M 116 116 L 122 132 M 110 118 L 112 135" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>
      </svg>
    `)}`
  };

  // 2. Animal Adaptation Lexicon & Science Data
  const ANIMALS_DATA = [
    {
      id: 'snow_leopard',
      name: 'Snow Leopard',
      species: 'Panthera uncia',
      habitat: 'Himalayan Mountain Cliffs & Snow Peaks',
      threatLevel: 'Vulnerable ⚠️',
      keyAdaptation: 'Thick spotted fur & long wide tail for balance',
      adaptationType: 'Structural Adaptation',
      scienceFact: 'Their wide furry paws act like natural snowshoes to stop them sinking in deep snow.',
      ttsAudio: 'The snow leopard uses its thick spotted fur for camouflage on rocky mountain cliffs.',
      soundType: 'leopard_growl',
      iconSvg: SVG_ANIMALS.snow_leopard,
      clues: [
        { label: 'Camouflage', desc: 'Gray-white fur with rosettes blends into granite rocks.' },
        { label: 'Thermal Tail', desc: 'Thick 1-meter tail wraps around face for sub-zero warmth.' },
        { label: 'Snowshoe Paws', desc: 'Wide footpads disperse body weight across snowy precipices.' }
      ]
    },
    {
      id: 'elephant',
      name: 'African Savanna Elephant',
      species: 'Loxodonta africana',
      habitat: 'African Savannas & Woodlands',
      threatLevel: 'Endangered 🚨',
      keyAdaptation: 'Prehensile trunk & giant cooling ears',
      adaptationType: 'Physiological & Structural',
      scienceFact: 'An elephant trunk contains over 40,000 muscles and can lift over 300 kilograms or pluck a single leaf.',
      ttsAudio: 'The African elephant flaps its giant ears to cool down its blood under the hot desert sun.',
      soundType: 'elephant_trumpet',
      iconSvg: SVG_ANIMALS.elephant,
      clues: [
        { label: 'Radiator Ears', desc: 'Thousands of blood vessels cool blood by up to 5 degrees.' },
        { label: 'Multipurpose Trunk', desc: 'Used for breathing, trumpeting, drinking, and social touch.' },
        { label: 'Ivory Defense', desc: 'Modified incisor teeth used for digging water and defense.' }
      ]
    },
    {
      id: 'tree_frog',
      name: 'Red-Eyed Tree Frog',
      species: 'Agalychnis callidryas',
      habitat: 'Central American Neotropical Rainforests',
      threatLevel: 'Least Concern 🌿',
      keyAdaptation: 'Startle coloration & suction cup toes',
      adaptationType: 'Behavioral & Structural',
      scienceFact: 'When threatened, they flash their bright red eyes and orange toes to momentarily paralyze predators in shock.',
      ttsAudio: 'The red-eyed tree frog uses startle coloration to shock predators while it climbs leaves with sticky suction cups.',
      soundType: 'frog_croak',
      iconSvg: SVG_ANIMALS.tree_frog,
      clues: [
        { label: 'Startle Eyes', desc: 'Flashes giant scarlet eyes to scare birds while it escapes.' },
        { label: 'Suction Discs', desc: 'Sticky foot pads provide capillary grip on wet jungle leaves.' },
        { label: 'Nocturnal Skin', desc: 'Bright green back matches foliage during daytime sleep.' }
      ]
    },
    {
      id: 'barn_owl',
      name: 'Barn Owl',
      species: 'Tyto alba',
      habitat: 'Grasslands, Meadows & Agricultural Barns',
      threatLevel: 'Protected Bird 🛡️',
      keyAdaptation: 'Heart-shaped facial disc & silent flight feathers',
      adaptationType: 'Acoustic & Structural',
      scienceFact: 'The serrated edges of an owl’s wing feathers break up air turbulence, making their flight 100% silent to mice.',
      ttsAudio: 'The barn owl has a heart-shaped facial disc that channels sound directly into its ears for silent hunting in total darkness.',
      soundType: 'owl_screech',
      iconSvg: SVG_ANIMALS.barn_owl,
      clues: [
        { label: 'Facial Disc', desc: 'Curves sound waves into ears like a satellite dish.' },
        { label: 'Silent Fringe', desc: 'Comb-like feather edges mute aerodynamic noise.' },
        { label: 'Night Optics', desc: 'Huge eyes gather 35 times more light than human vision.' }
      ]
    },
    {
      id: 'sea_turtle',
      name: 'Green Sea Turtle',
      species: 'Chelonia mydas',
      habitat: 'Tropical Coastal Oceans & Coral Reefs',
      threatLevel: 'Endangered 🚨',
      keyAdaptation: 'Hydrodynamic flippers & salt-excreting glands',
      adaptationType: 'Marine Physiological',
      scienceFact: 'Sea turtles cry salty tears to pump out excess ocean salt swallowed while feeding on underwater seagrass.',
      ttsAudio: 'The sea turtle glides across ocean currents with paddle flippers and excretes salt from special eye glands.',
      soundType: 'ocean_splash',
      iconSvg: SVG_ANIMALS.sea_turtle,
      clues: [
        { label: 'Paddle Flippers', desc: 'Wing-shaped limbs allow effortless gliding over thousands of miles.' },
        { label: 'Salt Glands', desc: 'Specialized eye glands eliminate toxic sea salt.' },
        { label: 'Streamlined Shell', desc: 'Flattened carapace reduces water drag.' }
      ]
    },
    {
      id: 'honey_badger',
      name: 'Honey Badger',
      species: 'Mellivora capensis',
      habitat: 'African Scrublands & Desert Plains',
      threatLevel: 'Fierce Survivor 🦡',
      keyAdaptation: 'Rubber-thick loose skin & venom immunity',
      adaptationType: 'Biochemical & Structural',
      scienceFact: 'Their skin is up to 6mm thick—virtually impervious to bee stings, dog bites, and even porcupine quills.',
      ttsAudio: 'The honey badger has rubber-thick loose skin that lets it turn around and bite back when caught by predators.',
      soundType: 'badger_chatter',
      iconSvg: SVG_ANIMALS.honey_badger,
      clues: [
        { label: 'Armor Skin', desc: 'Loose rubbery hide resists sharp predator fangs and venomous bites.' },
        { label: 'Venom Resistance', desc: 'Neutralizes toxic neurotoxins from venomous cobra bites.' },
        { label: 'Steel Claws', desc: 'Excavates concrete-hard termite mounds in seconds.' }
      ]
    }
  ];

  // 3. Phase 2: TikTok & Social Media Literacy Scenarios
  // Students must evaluate viral video clips: Is it REAL SCIENCE or FAKE / HARMFUL CLICKBAIT?
  const VIRAL_POSTS = [
    {
      id: 'post_1',
      author: '@JungleCuteness_Viral',
      avatar: '🐒',
      likes: '4.8M',
      shares: '620K',
      headline: '"This cute slow loris LOVES having its arms tickled! Look at that smile! 😍"',
      videoPreview: 'Slow loris holding its arms raised while a human hand tickles its belly on a couch.',
      isRealScience: false,
      tag: 'FAKE & HARMFUL CLICKBAIT ❌',
      explanation: 'Slow lorises raise their arms because their armpits secrete a toxic venom for defense! The animal is terrified, not smiling. Keeping wild primates as indoor pets fuels illegal poaching.',
      rangerAdvice: 'Never like or share pet primate videos. It normalizes illegal wildlife trafficking!'
    },
    {
      id: 'post_2',
      author: '@OceanScienceDaily',
      avatar: '🐢',
      likes: '890K',
      shares: '140K',
      headline: '"Crying sea turtles: Why they shed tears on sandy beaches 🌊"',
      videoPreview: 'Biologists measuring a mother green sea turtle shedding clear droplets from her eyes while nesting.',
      isRealScience: true,
      tag: 'REAL CONSERVATION SCIENCE ✅',
      explanation: 'True scientific adaptation! Sea turtles possess salt glands behind their eyes to expel excess ocean salt and keep sand out of their eyes while digging nests.',
      rangerAdvice: 'Verified marine biology fact! Share educational research from certified oceanographers.'
    },
    {
      id: 'post_3',
      author: '@AnimalMagicTricks_99',
      avatar: '🦁',
      likes: '7.2M',
      shares: '1.1M',
      headline: '"Shocking! White tigers are an ancient endangered wild species, save them by buying tickets! 🎟️"',
      videoPreview: 'Two white tigers in a neon-lit amusement park cage pacing in small circles.',
      isRealScience: false,
      tag: 'FAKE & HARMFUL CLICKBAIT ❌',
      explanation: 'White tigers are NOT a distinct natural species! They are inbred mutant Bengal tigers bred in captivity with genetic health deformities for tourist ticket sales.',
      rangerAdvice: 'Real conservation protects wild habitats in national parks, not roadside tiger circuses!'
    },
    {
      id: 'post_4',
      author: '@ArcticRangerAlliance',
      avatar: '🐆',
      likes: '1.2M',
      shares: '310K',
      headline: '"Camera trap in the Himalayas spots invisible ghost cat on granite cliffs! 🏔️"',
      videoPreview: 'High-altitude thermal camera recording a snow leopard blending completely into granite scree before leaping 10 meters.',
      isRealScience: true,
      tag: 'REAL CONSERVATION SCIENCE ✅',
      explanation: 'Genuine field research! Snow leopards are solitary apex predators whose rosette coats offer nearly invisible camouflage across Himalayan peaks.',
      rangerAdvice: 'Support non-invasive camera trap monitoring that tracks endangered carnivores without human disturbance.'
    },
    {
      id: 'post_5',
      author: '@PetCrazy_Daily',
      avatar: '🦉',
      likes: '3.4M',
      shares: '480K',
      headline: '"OMG! Pet barn owl dancing and wearing a tiny Santa hat! Get one today! 🎅"',
      videoPreview: 'An owl bobbing its head frantically on a nightstand while loud pop music blasts.',
      isRealScience: false,
      tag: 'FAKE & HARMFUL CLICKBAIT ❌',
      explanation: 'Owls bob their heads to triangulate distances with their fixed eyes, not to dance! Loud indoor music harms their ultra-sensitive hearing, and owls cannot be domesticated humanely.',
      rangerAdvice: 'Owls belong in wild night skies hunting rodents, not confined inside living rooms for likes!'
    }
  ];

  // 4. Phase 3: Oral Production Teleprompter Script (Oral Broadcast)
  const TELEPROMPTER_TEMPLATE = [
    { text: "Good morning! This is Ranger Field Dispatch reporting live from the Wildlife Sanctuary.", highlightKey: "ranger" },
    { text: "We investigated animal adaptations like the snow leopard's camouflage and the elephant's cooling ears.", highlightKey: "adaptations" },
    { text: "We also exposed fake social media clickbait that harms endangered wild creatures.", highlightKey: "clickbait" },
    { text: "Remember: Wild animals belong in nature, not as pets for internet likes!", highlightKey: "nature" }
  ];

  // Expose to global window
  root.WILDLIFE_DATA = {
    ANIMALS_DATA,
    VIRAL_POSTS,
    TELEPROMPTER_TEMPLATE,
    SVG_ANIMALS
  };

})(typeof window !== 'undefined' ? window : this);
