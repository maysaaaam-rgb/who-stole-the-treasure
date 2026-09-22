/**
 * CAT VS. DOG: PREPOSITION CATAPULT — BATTLE DATA & VECTOR RIGS
 * English Adventure Academy | CEFR A1+ Spatial Prepositions & Physics Arena
 * Strict zero-external-dependencies: All vectors are embedded SVG Data URIs.
 */

(function(root) {
  'use strict';

  // 1. Embedded Vector SVGs (Data URIs for instant Image() caching and zero emoji rendering)
  const SVG_ASSETS = {
    // Blue Alley Cat: Volumetric gradients, expressive anime eyes, whiskers, paws
    cat: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="catHeadGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="45%" stop-color="#0284c7"/>
            <stop offset="90%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#075985"/>
          </radialGradient>
          <radialGradient id="catBodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0c4a6e"/>
          </radialGradient>
          <linearGradient id="catEarInner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fda4af"/>
            <stop offset="100%" stop-color="#f43f5e"/>
          </linearGradient>
          <radialGradient id="catBelly" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#e0f2fe"/>
            <stop offset="100%" stop-color="#bae6fd"/>
          </radialGradient>
          <filter id="catGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#0284c7" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Tail with tip highlight -->
        <path d="M 32 82 C 15 75, 8 50, 18 42 C 24 38, 28 44, 25 55 C 22 65, 30 76, 40 80 Z" fill="#0284c7"/>
        <path d="M 18 42 C 22 40, 26 43, 24 48 C 20 48, 17 46, 18 42 Z" fill="#e0f2fe"/>

        <!-- Main Body -->
        <ellipse cx="60" cy="82" rx="30" ry="26" fill="url(#catBodyGrad)" filter="url(#catGlow)"/>
        <ellipse cx="62" cy="84" rx="18" ry="16" fill="url(#catBelly)"/>

        <!-- Left Ear -->
        <polygon points="34,22 46,5 56,26" fill="url(#catBodyGrad)"/>
        <polygon points="37,20 46,10 53,24" fill="url(#catEarInner)"/>

        <!-- Right Ear -->
        <polygon points="68,26 78,5 90,22" fill="url(#catBodyGrad)"/>
        <polygon points="71,24 78,10 87,20" fill="url(#catEarInner)"/>

        <!-- Head -->
        <circle cx="62" cy="46" r="28" fill="url(#catHeadGrad)"/>

        <!-- Cheeks Whiskers Tufts -->
        <path d="M 34 50 Q 24 48 18 52 Q 26 55 35 54" fill="#0369a1"/>
        <path d="M 90 50 Q 100 48 106 52 Q 98 55 89 54" fill="#0369a1"/>

        <!-- Big Anime Eyes Sockets -->
        <ellipse cx="50" cy="44" rx="8" ry="10" fill="#082f49"/>
        <ellipse cx="74" cy="44" rx="8" ry="10" fill="#082f49"/>

        <!-- Vibrant Iris -->
        <ellipse cx="50" cy="44" rx="7" ry="9" fill="#06b6d4"/>
        <ellipse cx="74" cy="44" rx="7" ry="9" fill="#06b6d4"/>

        <!-- Pupil & Specular Highlights -->
        <ellipse class="cat-pupil" cx="50" cy="44" rx="3.5" ry="5.5" fill="#02131e"/>
        <ellipse class="cat-pupil" cx="74" cy="44" rx="3.5" ry="5.5" fill="#02131e"/>
        <circle cx="48" cy="41" r="2.5" fill="#ffffff"/>
        <circle cx="72" cy="41" r="2.5" fill="#ffffff"/>
        <circle cx="52" cy="47" r="1.2" fill="#ffffff"/>
        <circle cx="76" cy="47" r="1.2" fill="#ffffff"/>

        <!-- Cute Nose & Mouth -->
        <polygon points="60,53 64,53 62,56" fill="#f43f5e"/>
        <path d="M 57 57 Q 62 61 62 56 Q 62 61 67 57" stroke="#082f49" stroke-width="2" fill="none" stroke-linecap="round"/>

        <!-- Whiskers -->
        <line x1="30" y1="52" x2="42" y2="53" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="28" y1="58" x2="41" y2="56" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="94" y1="52" x2="82" y2="53" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="96" y1="58" x2="83" y2="56" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>

        <!-- Front Paws holding weapon sling -->
        <ellipse cx="48" cy="98" rx="8" ry="6" fill="#38bdf8"/>
        <ellipse cx="76" cy="98" rx="8" ry="6" fill="#38bdf8"/>
        <circle cx="46" cy="99" r="1.5" fill="#ffffff"/>
        <circle cx="74" cy="99" r="1.5" fill="#ffffff"/>
      </svg>
    `)}`,

    // Brown Yard Dog: Warm volumetric gradients, floppy ears, spiked collar, athletic bulldog build
    dog: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="dogHeadGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="45%" stop-color="#ea580c"/>
            <stop offset="90%" stop-color="#c2410c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </radialGradient>
          <radialGradient id="dogBodyGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="55%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </radialGradient>
          <radialGradient id="dogMuzzle" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="100%" stop-color="#fed7aa"/>
          </radialGradient>
          <filter id="dogGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#c2410c" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Stiff wagging bulldog tail -->
        <path d="M 88 80 C 104 74, 110 60, 104 52 C 98 48, 94 56, 92 68 Z" fill="#c2410c"/>

        <!-- Main Muscular Body -->
        <ellipse cx="60" cy="84" rx="32" ry="27" fill="url(#dogBodyGrad)" filter="url(#dogGlow)"/>

        <!-- Spiked Collar -->
        <path d="M 38 68 C 50 78, 70 78, 82 68 L 84 74 C 70 85, 50 85, 36 74 Z" fill="#dc2626"/>
        <polygon points="44,72 47,67 50,72" fill="#e2e8f0"/>
        <polygon points="58,75 61,70 64,75" fill="#e2e8f0"/>
        <polygon points="72,72 75,67 78,72" fill="#e2e8f0"/>

        <!-- Floppy Left Ear -->
        <path d="M 36 28 C 22 28, 18 46, 26 56 C 32 62, 38 52, 38 42 Z" fill="#9a3412"/>

        <!-- Floppy Right Ear -->
        <path d="M 84 28 C 98 28, 102 46, 94 56 C 88 62, 82 52, 82 42 Z" fill="#9a3412"/>

        <!-- Bulldog Head -->
        <circle cx="60" cy="46" r="27" fill="url(#dogHeadGrad)"/>

        <!-- Brow wrinkles -->
        <path d="M 48 30 Q 60 34 72 30" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 52 35 Q 60 38 68 35" stroke="#7c2d12" stroke-width="2" fill="none" stroke-linecap="round"/>

        <!-- Eyes -->
        <ellipse cx="48" cy="42" rx="7" ry="8" fill="#431407"/>
        <ellipse cx="72" cy="42" rx="7" ry="8" fill="#431407"/>
        <ellipse cx="48" cy="42" rx="5.5" ry="6.5" fill="#b45309"/>
        <ellipse cx="72" cy="42" rx="5.5" ry="6.5" fill="#b45309"/>
        <circle class="dog-pupil" cx="48" cy="42" r="3" fill="#0f0704"/>
        <circle class="dog-pupil" cx="72" cy="42" r="3" fill="#0f0704"/>
        <circle cx="46" cy="40" r="2.2" fill="#ffffff"/>
        <circle cx="70" cy="40" r="2.2" fill="#ffffff"/>

        <!-- Big Jowly Muzzle -->
        <ellipse cx="60" cy="56" rx="16" ry="12" fill="url(#dogMuzzle)"/>
        <!-- Big Black Wet Nose -->
        <path d="M 53 50 C 53 47, 67 47, 67 50 C 67 56, 53 56, 53 50 Z" fill="#1c1917"/>
        <ellipse cx="57" cy="51" rx="1.8" ry="1" fill="#78716c"/>

        <!-- Drooping Jowls & Mouth -->
        <path d="M 52 57 Q 56 63 60 59 Q 64 63 68 57" stroke="#7c2d12" stroke-width="2.2" fill="none"/>
        <!-- Small underbite tooth -->
        <polygon points="58,58 60,63 62,58" fill="#ffffff"/>

        <!-- Heavy Sturdy Front Paws -->
        <ellipse cx="46" cy="100" rx="9" ry="7" fill="#fb923c"/>
        <ellipse cx="74" cy="100" rx="9" ry="7" fill="#fb923c"/>
        <circle cx="43" cy="101" r="1.8" fill="#fed7aa"/>
        <circle cx="71" cy="101" r="1.8" fill="#fed7aa"/>
      </svg>
    `)}`,

    // Wooden Barrier Fence: Beveled vertical planks with grain, top bevels, crossbeams, nail studs
    fence: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 240" width="100" height="240">
        <defs>
          <linearGradient id="plankGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="30%" stop-color="#d97706"/>
            <stop offset="80%" stop-color="#92400e"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="plankGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#92400e"/>
            <stop offset="25%" stop-color="#b45309"/>
            <stop offset="85%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
          <linearGradient id="nailGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>

        <!-- Plank 1 (Left) -->
        <polygon points="5,20 18,5 32,20 32,240 5,240" fill="url(#plankGrad1)"/>
        <path d="M 12 40 Q 15 110 11 180 M 24 50 Q 20 130 25 210" stroke="#78350f" stroke-width="1.2" opacity="0.6"/>

        <!-- Plank 2 (Center) -->
        <polygon points="35,18 48,3 62,18 62,240 35,240" fill="url(#plankGrad2)"/>
        <path d="M 42 45 Q 46 120 41 195 M 54 35 Q 50 140 55 220" stroke="#451a03" stroke-width="1.2" opacity="0.6"/>

        <!-- Plank 3 (Right) -->
        <polygon points="65,22 78,7 92,22 92,240 65,240" fill="url(#plankGrad1)"/>
        <path d="M 72 40 Q 76 115 71 185 M 84 55 Q 81 125 85 205" stroke="#78350f" stroke-width="1.2" opacity="0.6"/>

        <!-- Horizontal Support Beams -->
        <!-- Upper Beam -->
        <rect x="0" y="55" width="98" height="24" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <rect x="2" y="56" width="94" height="6" fill="#b45309" opacity="0.7"/>

        <!-- Lower Beam -->
        <rect x="0" y="165" width="98" height="24" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <rect x="2" y="166" width="94" height="6" fill="#b45309" opacity="0.7"/>

        <!-- Metallic Nail Rivets -->
        <circle cx="18" cy="67" r="3.2" fill="url(#nailGrad)"/>
        <circle cx="48" cy="67" r="3.2" fill="url(#nailGrad)"/>
        <circle cx="78" cy="67" r="3.2" fill="url(#nailGrad)"/>

        <circle cx="18" cy="177" r="3.2" fill="url(#nailGrad)"/>
        <circle cx="48" cy="177" r="3.2" fill="url(#nailGrad)"/>
        <circle cx="78" cy="177" r="3.2" fill="url(#nailGrad)"/>
      </svg>
    `)}`,

    // Metal Trash Bin (Cat's Fort): Fluted metal cylinder with rim highlights and lid
    trashbin: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="100" height="110">
        <defs>
          <linearGradient id="metalBin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="20%" stop-color="#94a3b8"/>
            <stop offset="50%" stop-color="#f1f5f9"/>
            <stop offset="80%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
        </defs>
        <!-- Bin Body with Fluted Ridges -->
        <polygon points="12,25 88,25 80,105 20,105" fill="url(#metalBin)"/>
        <line x1="32" y1="26" x2="28" y2="104" stroke="#334155" stroke-width="2"/>
        <line x1="33" y1="26" x2="29" y2="104" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        <line x1="50" y1="26" x2="50" y2="104" stroke="#334155" stroke-width="2"/>
        <line x1="51" y1="26" x2="51" y2="104" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        <line x1="68" y1="26" x2="72" y2="104" stroke="#334155" stroke-width="2"/>
        <line x1="69" y1="26" x2="73" y2="104" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        <!-- Rim -->
        <ellipse cx="50" cy="25" rx="42" ry="9" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
        <ellipse cx="50" cy="24" rx="38" ry="6" fill="#f8fafc"/>
        <!-- Base Rim -->
        <ellipse cx="50" cy="104" rx="31" ry="6" fill="#334155"/>
      </svg>
    `)}`,

    // Dog Ceramic Bowl (Target): Sturdy red ceramic dish with white bone emblem
    dogbowl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60">
        <defs>
          <linearGradient id="bowlGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#991b1b"/>
            <stop offset="35%" stop-color="#ef4444"/>
            <stop offset="70%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </linearGradient>
        </defs>
        <polygon points="10,20 90,20 80,56 20,56" fill="url(#bowlGrad)"/>
        <ellipse cx="50" cy="20" rx="42" ry="12" fill="#fca5a5" stroke="#991b1b" stroke-width="2"/>
        <ellipse cx="50" cy="20" rx="36" ry="9" fill="#7f1d1d"/>
        <!-- Bone Motif on front -->
        <path d="M 40 38 C 37 36, 37 42, 40 40 L 60 40 C 63 42, 63 36, 60 38 Z" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="#ffffff"/>
      </svg>
    `)}`,

    // PROJECTILE 1: Fish Skeleton (Detailed bone structure, skull, sharp ribs, tail fin)
    projectile_fish: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40" width="80" height="40">
        <defs>
          <linearGradient id="boneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="60%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
        </defs>
        <!-- Fish Head Skull -->
        <path d="M 22 20 C 22 10, 8 12, 4 20 C 8 28, 22 30, 22 20 Z" fill="url(#boneGrad)" stroke="#475569" stroke-width="1.5"/>
        <circle cx="12" cy="18" r="3" fill="#0f172a"/>
        <circle cx="11" cy="17" r="1" fill="#ffffff"/>
        <!-- Central Spine -->
        <line x1="20" y1="20" x2="64" y2="20" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- Segmented Ribs -->
        <line x1="28" y1="9" x2="34" y2="31" stroke="url(#boneGrad)" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="38" y1="7" x2="44" y2="33" stroke="url(#boneGrad)" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="48" y1="9" x2="54" y2="31" stroke="url(#boneGrad)" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="57" y1="12" x2="61" y2="28" stroke="url(#boneGrad)" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Caudal Fin (Tail) -->
        <polygon points="64,20 76,8 72,20 76,32" fill="url(#boneGrad)" stroke="#475569" stroke-width="1.5"/>
        <!-- Stinky green aroma vapors -->
        <path d="M 28 4 Q 30 1 33 4 M 45 3 Q 48 0 51 3" stroke="#22c55e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>
    `)}`,

    // PROJECTILE 2: Water Balloon (Translucent cyan rubber bulb, tied neck knot, specular glint)
    projectile_balloon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
        <defs>
          <radialGradient id="balloonGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#bae6fd"/>
            <stop offset="35%" stop-color="#38bdf8"/>
            <stop offset="75%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </radialGradient>
        </defs>
        <!-- Balloon Body -->
        <path d="M 30 14 C 44 14, 52 24, 52 36 C 52 48, 42 56, 30 56 C 18 56, 8 48, 8 36 C 8 24, 16 14, 30 14 Z" fill="url(#balloonGrad)"/>
        <!-- Knot Neck -->
        <polygon points="26,14 34,14 36,8 24,8" fill="#0284c7" stroke="#0369a1" stroke-width="1"/>
        <ellipse cx="30" cy="7" rx="5" ry="2.5" fill="#38bdf8"/>
        <!-- Specular Highlight Arc -->
        <ellipse cx="22" cy="26" rx="6" ry="11" transform="rotate(-30 22 26)" fill="#ffffff" opacity="0.65"/>
        <circle cx="34" cy="42" r="3" fill="#ffffff" opacity="0.4"/>
      </svg>
    `)}`,

    // PROJECTILE 3: Heavy Iron Anvil (Solid cast-iron silhouette, beveled horn, flat face, cast drop shadow)
    projectile_anvil: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 50" width="70" height="50">
        <defs>
          <linearGradient id="ironGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="25%" stop-color="#64748b"/>
            <stop offset="70%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <!-- Striking Top Face & Horn -->
        <path d="M 6 12 L 20 12 L 22 6 L 64 6 L 64 16 L 46 22 L 44 32 L 58 44 L 12 44 L 26 32 L 24 22 L 6 16 Z" fill="url(#ironGrad)" stroke="#0f172a" stroke-width="1.8"/>
        <!-- Top Bevel Highlight -->
        <line x1="23" y1="7" x2="63" y2="7" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="8" y1="13" x2="20" y2="13" stroke="#cbd5e1" stroke-width="1.2"/>
        <!-- Anvil Waist Indent Accent -->
        <path d="M 28 32 C 35 34, 35 34, 42 32" stroke="#0f172a" stroke-width="1.8" fill="none"/>
      </svg>
    `)}`,

    // PROJECTILE 4: Bouncy Ball (Neon emerald orb with dynamic radial gradient and neon magenta band)
    projectile_bouncy: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
        <defs>
          <radialGradient id="ballGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#6ee7b7"/>
            <stop offset="40%" stop-color="#10b981"/>
            <stop offset="85%" stop-color="#047857"/>
            <stop offset="100%" stop-color="#064e3b"/>
          </radialGradient>
        </defs>
        <circle cx="25" cy="25" r="22" fill="url(#ballGrad)"/>
        <!-- Fast curved racing streak -->
        <path d="M 6 22 Q 25 10 44 22 Q 25 28 6 22 Z" fill="#ec4899" opacity="0.9"/>
        <circle cx="18" cy="16" r="4.5" fill="#ffffff" opacity="0.75"/>
      </svg>
    `)}`
  };

  // 2. Preposition Diorama Explorer Curriculum (Stage 1)
  const DIORAMAS = [
    {
      id: 'over',
      prep: 'OVER',
      title: 'Flies OVER the Fence',
      sentence: 'The fish flies OVER the tall wooden fence!',
      speechText: 'OVER: The fish flies OVER the tall wooden fence!',
      ruleText: 'Movement higher than an obstacle from one side to the other.',
      icon: '⤴️',
      color: '#38bdf8',
      svgScene: `
        <svg viewBox="0 0 200 130" width="100%" height="100%">
          <rect width="200" height="130" rx="8" fill="#0f172a"/>
          <!-- Moon -->
          <circle cx="170" cy="25" r="14" fill="#fef08a" opacity="0.8"/>
          <!-- Ground -->
          <rect y="110" width="200" height="20" fill="#1e293b"/>
          <!-- Fence in Center -->
          <rect x="92" y="55" width="16" height="55" fill="#b45309" rx="2"/>
          <line x1="88" y1="70" x2="112" y2="70" stroke="#78350f" stroke-width="4"/>
          <!-- Dotted Arc OVER -->
          <path d="M 30 95 Q 100 10 170 95" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="5,4"/>
          <!-- Animated projectile marker -->
          <circle cx="100" cy="30" r="7" fill="#38bdf8"/>
          <text x="100" y="24" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">OVER</text>
        </svg>
      `
    },
    {
      id: 'into',
      prep: 'INTO',
      title: 'Lands INTO the Dog Bowl',
      sentence: 'The bone lands INTO the shiny dog bowl!',
      speechText: 'INTO: The bone lands INTO the shiny dog bowl!',
      ruleText: 'Movement from the outside to the interior of a container.',
      icon: '📥',
      color: '#f43f5e',
      svgScene: `
        <svg viewBox="0 0 200 130" width="100%" height="100%">
          <rect width="200" height="130" rx="8" fill="#0f172a"/>
          <!-- Ground -->
          <rect y="110" width="200" height="20" fill="#1e293b"/>
          <!-- Ceramic Dog Bowl -->
          <polygon points="75,80 125,80 115,110 85,110" fill="#dc2626"/>
          <ellipse cx="100" cy="80" rx="25" ry="8" fill="#7f1d1d"/>
          <!-- Motion entering inside bowl -->
          <path d="M 40 30 Q 80 40 100 75" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="5,4"/>
          <polygon points="100,82 95,72 105,72" fill="#f43f5e"/>
          <text x="100" y="60" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">INTO</text>
        </svg>
      `
    },
    {
      id: 'on_top_of',
      prep: 'ON TOP OF',
      title: 'Sits ON TOP OF the Bin',
      sentence: 'The alley cat sits ON TOP OF the metal trash bin!',
      speechText: 'ON TOP OF: The alley cat sits ON TOP OF the metal trash bin!',
      ruleText: 'Resting on the highest horizontal surface of an object.',
      icon: '🔝',
      color: '#10b981',
      svgScene: `
        <svg viewBox="0 0 200 130" width="100%" height="100%">
          <rect width="200" height="130" rx="8" fill="#0f172a"/>
          <!-- Ground -->
          <rect y="110" width="200" height="20" fill="#1e293b"/>
          <!-- Metal Trash Bin -->
          <polygon points="70,55 130,55 120,110 80,110" fill="#64748b"/>
          <ellipse cx="100" cy="55" rx="30" ry="8" fill="#94a3b8"/>
          <!-- Cat sitting on lid -->
          <circle cx="100" cy="38" r="12" fill="#0284c7"/>
          <polygon points="90,32 95,22 100,32" fill="#0284c7"/>
          <polygon points="100,32 105,22 110,32" fill="#0284c7"/>
          <text x="100" y="16" fill="#10b981" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">ON TOP OF</text>
        </svg>
      `
    },
    {
      id: 'behind',
      prep: 'BEHIND',
      title: 'Guards BEHIND the Fence',
      sentence: 'The yard dog guards BEHIND the fence!',
      speechText: 'BEHIND: The yard dog guards BEHIND the fence!',
      ruleText: 'At the back of or obscured by a barrier.',
      icon: '🛡️',
      color: '#ea580c',
      svgScene: `
        <svg viewBox="0 0 200 130" width="100%" height="100%">
          <rect width="200" height="130" rx="8" fill="#0f172a"/>
          <!-- Ground -->
          <rect y="110" width="200" height="20" fill="#1e293b"/>
          <!-- Dog positioned behind fence -->
          <circle cx="118" cy="62" r="18" fill="#ea580c"/>
          <circle cx="114" cy="58" r="3" fill="#ffffff"/>
          <!-- Fence In Front (layer obscuring dog) -->
          <rect x="75" y="45" width="16" height="65" fill="#b45309"/>
          <rect x="95" y="45" width="16" height="65" fill="#d97706"/>
          <rect x="115" y="45" width="16" height="65" fill="#92400e" opacity="0.88"/>
          <text x="100" y="30" fill="#ea580c" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif">BEHIND</text>
        </svg>
      `
    }
  ];

  // 3. Spatial Placement Lab Challenges (Stage 2)
  const LAB_CHALLENGES = [
    {
      id: 'cat_on_top',
      actor: 'cat',
      actorName: 'Alley Cat',
      targetSocket: 'socket_trashbin',
      prep: 'ON TOP OF',
      instruction: 'Drag the Alley Cat ON TOP OF the metal trash bin!',
      speechPrompt: 'Drag the Alley Cat ON TOP OF the trash bin!',
      successAudio: 'Spot on! The cat is ON TOP OF the trash bin!'
    },
    {
      id: 'dog_behind',
      actor: 'dog',
      actorName: 'Yard Dog',
      targetSocket: 'socket_behind_fence',
      prep: 'BEHIND',
      instruction: 'Drag the Yard Dog BEHIND the wooden fence!',
      speechPrompt: 'Drag the Yard Dog BEHIND the wooden fence!',
      successAudio: 'Great work! The dog is safely BEHIND the fence!'
    }
  ];

  // 4. Weapons & Projectiles Specifications
  const WEAPONS = [
    {
      id: 'fish',
      name: 'Stinky Fish',
      iconSvg: SVG_ASSETS.projectile_fish,
      damage: 20,
      weight: 1.0,
      gravityMultiplier: 1.0,
      airResistance: 0.992,
      desc: 'Balanced trajectory and comic odor.'
    },
    {
      id: 'balloon',
      name: 'Water Balloon',
      iconSvg: SVG_ASSETS.projectile_balloon,
      damage: 15,
      weight: 0.6,
      gravityMultiplier: 0.72,
      airResistance: 0.985,
      desc: 'Floats gently on the wind with splash damage.'
    },
    {
      id: 'anvil',
      name: 'Heavy Iron Anvil',
      iconSvg: SVG_ASSETS.projectile_anvil,
      damage: 35,
      weight: 2.2,
      gravityMultiplier: 1.55,
      airResistance: 0.996,
      desc: 'High mass, drops sharply, crushes barriers.'
    },
    {
      id: 'bouncy',
      name: 'Bouncy Ball',
      iconSvg: SVG_ASSETS.projectile_bouncy,
      damage: 18,
      weight: 0.85,
      gravityMultiplier: 0.9,
      airResistance: 0.995,
      bounces: 2,
      desc: 'Elastic rebound on ground and fence.'
    }
  ];

  // 5. CEFR A1 Preposition Questions (12 items)
  const QUESTIONS = [
    {
      id: 'q1',
      sentence: 'The fish flies _____ the high wooden fence.',
      options: ['OVER', 'UNDER', 'INTO', 'BEHIND'],
      correct: 'OVER',
      explanation: 'We use OVER because the fish moves through the air above the fence.'
    },
    {
      id: 'q2',
      sentence: 'The Alley Cat sits proudly _____ the metal trash bin.',
      options: ['ON TOP OF', 'UNDER', 'THROUGH', 'BETWEEN'],
      correct: 'ON TOP OF',
      explanation: 'ON TOP OF describes an object resting directly on an upper surface.'
    },
    {
      id: 'q3',
      sentence: 'The Yard Dog guards the yard _____ the fence.',
      options: ['BEHIND', 'INTO', 'OVER', 'ACROSS'],
      correct: 'BEHIND',
      explanation: 'BEHIND means at the back of or protected by the barrier.'
    },
    {
      id: 'q4',
      sentence: 'The heavy bone drops directly _____ the red dog bowl.',
      options: ['INTO', 'ACROSS', 'OVER', 'BETWEEN'],
      correct: 'INTO',
      explanation: 'INTO expresses movement that enters inside a 3D container.'
    },
    {
      id: 'q5',
      sentence: 'The alley cat jumped _____ the narrow fence gap.',
      options: ['THROUGH', 'ON TOP OF', 'UNDER', 'BEHIND'],
      correct: 'THROUGH',
      explanation: 'THROUGH describes movement from one side of an enclosed opening to the other.'
    },
    {
      id: 'q6',
      sentence: 'The green bouncy ball rebounded _____ the wall and the post.',
      options: ['BETWEEN', 'INTO', 'OVER', 'ON TOP OF'],
      correct: 'BETWEEN',
      explanation: 'BETWEEN refers to the space that separates two distinct objects.'
    },
    {
      id: 'q7',
      sentence: 'The water balloon sailed _____ the yard to hit the opponent.',
      options: ['ACROSS', 'UNDER', 'INTO', 'BEHIND'],
      correct: 'ACROSS',
      explanation: 'ACROSS means moving from one broad side of the yard to the other.'
    },
    {
      id: 'q8',
      sentence: 'The kitten is resting safely _____ the wooden porch.',
      options: ['UNDER', 'OVER', 'INTO', 'THROUGH'],
      correct: 'UNDER',
      explanation: 'UNDER means below or sheltered underneath a structure.'
    },
    {
      id: 'q9',
      sentence: 'Place the ceramic bowl _____ the dog house.',
      options: ['NEXT TO', 'OVER', 'THROUGH', 'INTO'],
      correct: 'NEXT TO',
      explanation: 'NEXT TO means right beside or adjacent to something.'
    },
    {
      id: 'q10',
      sentence: 'Launch the projectile high _____ the obstacle!',
      options: ['OVER', 'UNDER', 'INTO', 'BEHIND'],
      correct: 'OVER',
      explanation: 'OVER indicates traveling above without touching the barrier.'
    },
    {
      id: 'q11',
      sentence: 'The mouse slipped quickly _____ the hole in the wall.',
      options: ['INTO', 'ON TOP OF', 'OVER', 'ACROSS'],
      correct: 'INTO',
      explanation: 'INTO indicates entering inside the hole.'
    },
    {
      id: 'q12',
      sentence: 'The shadow fell quietly _____ the two rival pets.',
      options: ['BETWEEN', 'OVER', 'INTO', 'UNDER'],
      correct: 'BETWEEN',
      explanation: 'BETWEEN describes a position in the middle of two characters.'
    }
  ];

  // 6. Oral Production Teleprompter Sentences (Stage 4)
  const TELEPROMPTER_SCRIPT = [
    { text: "We played Cat vs. Dog in the alley!", prep: null },
    { text: "My team threw the projectile OVER the fence.", prep: "OVER" },
    { text: "It landed INTO the yard and we won the match!", prep: "INTO" }
  ];

  // Expose to window
  root.BATTLE_DATA = {
    SVG_ASSETS,
    DIORAMAS,
    LAB_CHALLENGES,
    WEAPONS,
    QUESTIONS,
    TELEPROMPTER_SCRIPT
  };

})(typeof window !== 'undefined' ? window : this);
