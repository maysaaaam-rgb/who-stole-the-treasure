/**
 * "HOW WOULD YOU FEEL?" — Stage Scenes Renderer
 * 10 Complete Interactive Stages with Inline Cartoon SVGs,
 * Countdown Timers, Gesture Coaches, Spinning Wheel, and Differentiated Speech Scaffolds.
 */

const FeelingsScenes = {

  // =========================================================================
  // SVG ILLUSTRATION GENERATORS (Neutral child expression - shows situation only!)
  // =========================================================================
  getSituationSvg(type) {
    const svgs = {
      present: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#fef3c7" />
          <rect x="0" y="240" width="500" height="80" fill="#fde68a" />
          <!-- Birthday Banner -->
          <path d="M 50 30 Q 250 60 450 30" stroke="#f59e0b" stroke-width="3" fill="none" />
          <polygon points="100,40 120,70 140,40" fill="#ef4444" />
          <polygon points="160,45 180,75 200,45" fill="#3b82f6" />
          <polygon points="220,48 240,78 260,48" fill="#10b981" />
          <polygon points="280,48 300,78 320,48" fill="#ec4899" />
          <polygon points="340,45 360,75 380,45" fill="#8b5cf6" />
          <!-- Giant Wrapped Gift Box -->
          <rect x="230" y="110" width="180" height="150" rx="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4" />
          <rect x="305" y="110" width="30" height="150" fill="#facc15" />
          <rect x="230" y="170" width="180" height="30" fill="#facc15" />
          <!-- Ribbon Bow -->
          <ellipse cx="295" cy="100" rx="25" ry="16" fill="#eab308" />
          <ellipse cx="345" cy="100" rx="25" ry="16" fill="#eab308" />
          <circle cx="320" cy="105" r="12" fill="#ca8a04" />
          <!-- Child looking at unopened box (NEUTRAL / CURIOUS gaze) -->
          <circle cx="130" cy="140" r="32" fill="#fed7aa" />
          <!-- Hair -->
          <path d="M 98 135 C 98 95 162 95 162 135 Z" fill="#78350f" />
          <!-- Eyes (Neutral, looking right at gift) -->
          <ellipse cx="136" cy="140" rx="4" ry="5" fill="#1e293b" />
          <ellipse cx="148" cy="140" rx="4" ry="5" fill="#1e293b" />
          <circle cx="137" cy="139" r="1.5" fill="#ffffff" />
          <circle cx="149" cy="139" r="1.5" fill="#ffffff" />
          <!-- Neutral mouth line (NOT smiling yet - student decides!) -->
          <line x1="138" y1="156" x2="152" y2="156" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body -->
          <rect x="110" y="172" width="40" height="60" rx="6" fill="#ef4444" />
          <!-- Arms pointing toward gift -->
          <line x1="140" y1="185" x2="185" y2="195" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" />
          <!-- Legs -->
          <line x1="120" y1="232" x2="120" y2="280" stroke="#1e293b" stroke-width="8" stroke-linecap="round" />
          <line x1="140" y1="232" x2="140" y2="280" stroke="#1e293b" stroke-width="8" stroke-linecap="round" />
          <!-- Shoes -->
          <ellipse cx="118" cy="282" rx="10" ry="5" fill="#dc2626" />
          <ellipse cx="144" cy="282" rx="10" ry="5" fill="#dc2626" />
        </svg>`,

      dog: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#e0f2fe" />
          <rect x="0" y="220" width="500" height="100" fill="#86efac" />
          <path d="M 0 250 Q 250 210 500 250 L 500 320 L 0 320 Z" fill="#4ade80" />
          <!-- Trees in park background -->
          <circle cx="60" cy="180" r="35" fill="#15803d" /><rect x="55" y="195" width="10" height="35" fill="#78350f" />
          <circle cx="440" cy="170" r="40" fill="#15803d" /><rect x="435" y="190" width="12" height="40" fill="#78350f" />
          <!-- Child (Neutral/Alert expression looking at dog) -->
          <circle cx="120" cy="130" r="30" fill="#fed7aa" />
          <path d="M 90 125 C 90 90 150 90 150 125 Z" fill="#1e293b" />
          <!-- Eyes looking right -->
          <circle cx="126" cy="130" r="4.5" fill="#1e293b" /><circle cx="138" cy="130" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth line -->
          <line x1="126" y1="146" x2="140" y2="146" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body -->
          <rect x="102" y="160" width="36" height="55" rx="6" fill="#0284c7" />
          <!-- Legs -->
          <line x1="110" y1="215" x2="110" y2="265" stroke="#334155" stroke-width="7" stroke-linecap="round" />
          <line x1="130" y1="215" x2="130" y2="265" stroke="#334155" stroke-width="7" stroke-linecap="round" />
          <!-- Big Dog running toward child -->
          <ellipse cx="320" cy="200" rx="55" ry="32" fill="#b45309" />
          <!-- Dog Head -->
          <circle cx="260" cy="175" r="28" fill="#b45309" />
          <!-- Floppy Ears -->
          <ellipse cx="280" cy="165" rx="10" ry="20" fill="#78350f" />
          <!-- Dog Snout & Tongue -->
          <ellipse cx="240" cy="185" rx="16" ry="12" fill="#d97706" />
          <circle cx="232" cy="180" r="4.5" fill="#1e293b" />
          <path d="M 236 190 Q 230 205 240 205 Z" fill="#ef4444" />
          <!-- Dog Eye -->
          <circle cx="255" cy="170" r="4" fill="#ffffff" /><circle cx="254" cy="170" r="2.5" fill="#1e293b" />
          <!-- Dog Running Legs & Motion dust -->
          <line x1="285" y1="225" x2="260" y2="265" stroke="#b45309" stroke-width="8" stroke-linecap="round" />
          <line x1="345" y1="225" x2="330" y2="265" stroke="#b45309" stroke-width="8" stroke-linecap="round" />
          <line x1="365" y1="210" x2="395" y2="250" stroke="#b45309" stroke-width="8" stroke-linecap="round" />
          <!-- Motion Lines -->
          <path d="M 390 190 L 420 185 M 395 205 L 430 205 M 385 220 L 415 225" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
        </svg>`,

      chicken: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#ede9fe" />
          <rect x="0" y="220" width="500" height="100" fill="#cbd5e1" />
          <!-- Bedroom Window -->
          <rect x="340" y="30" width="120" height="90" rx="4" fill="#bae6fd" stroke="#ffffff" stroke-width="6" />
          <line x1="400" y1="30" x2="400" y2="120" stroke="#ffffff" stroke-width="4" />
          <line x1="340" y1="75" x2="460" y2="75" stroke="#ffffff" stroke-width="4" />
          <circle cx="430" cy="55" r="14" fill="#facc15" />
          <!-- Bed Frame & Mattress -->
          <rect x="60" y="160" width="340" height="90" rx="8" fill="#94a3b8" />
          <rect x="50" y="140" width="30" height="130" rx="6" fill="#64748b" />
          <rect x="380" y="170" width="24" height="100" rx="6" fill="#64748b" />
          <!-- Duvet Blanket -->
          <path d="M 80 180 Q 240 160 370 180 L 370 240 L 80 240 Z" fill="#60a5fa" />
          <!-- Pillow -->
          <ellipse cx="120" cy="165" rx="35" ry="18" fill="#ffffff" />
          <!-- Child sitting up in bed (Neutral gaze looking at foot of bed) -->
          <circle cx="120" cy="120" r="28" fill="#fed7aa" />
          <path d="M 92 115 C 92 80 148 80 148 115 Z" fill="#92400e" />
          <!-- Eyes looking toward chicken -->
          <circle cx="128" cy="120" r="4.5" fill="#1e293b" /><circle cx="140" cy="120" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth -->
          <ellipse cx="134" cy="135" rx="4" ry="2" fill="#b45309" />
          <!-- Nightshirt -->
          <rect x="100" y="148" width="40" height="40" rx="4" fill="#fef08a" />
          <!-- CHICKEN sitting at foot of bed! -->
          <ellipse cx="320" cy="165" rx="26" ry="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
          <!-- Chicken Head -->
          <circle cx="295" cy="148" r="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <!-- Comb & Beak -->
          <polygon points="290,135 295,125 300,135 305,126 310,136" fill="#ef4444" />
          <polygon points="280,148 292,144 292,154" fill="#f59e0b" />
          <!-- Chicken Eye -->
          <circle cx="296" cy="146" r="3" fill="#1e293b" />
          <!-- Cluck marks -->
          <text x="315" y="130" font-size="20" font-weight="900" fill="#f59e0b">CLUCK? 🐔</text>
        </svg>`,

      frog: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#f0fdf4" />
          <rect x="0" y="240" width="500" height="80" fill="#bbf7d0" />
          <!-- School Path -->
          <polygon points="180,320 230,240 270,240 320,320" fill="#e2e8f0" />
          <!-- Child walking to school with backpack -->
          <rect x="200" y="160" width="30" height="45" rx="4" fill="#3b82f6" />
          <!-- Head -->
          <circle cx="250" cy="130" r="32" fill="#fed7aa" />
          <!-- Hair -->
          <path d="M 218 125 C 218 90 282 90 282 125 Z" fill="#1e293b" />
          <!-- Eyes Looking UPWARD toward head! -->
          <circle cx="242" cy="122" r="4.5" fill="#1e293b" /><circle cx="258" cy="122" r="4.5" fill="#1e293b" />
          <circle cx="242" cy="120" r="1.5" fill="#ffffff" /><circle cx="258" cy="120" r="1.5" fill="#ffffff" />
          <!-- Neutral mouth -->
          <line x1="244" y1="145" x2="256" y2="145" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body & Legs -->
          <rect x="230" y="162" width="40" height="60" rx="6" fill="#f59e0b" />
          <line x1="240" y1="222" x2="235" y2="280" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <line x1="260" y1="222" x2="265" y2="280" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <!-- GREEN FROG perched right on child's head! -->
          <ellipse cx="250" cy="90" rx="22" ry="16" fill="#22c55e" stroke="#15803d" stroke-width="2" />
          <!-- Frog Eyes -->
          <circle cx="240" cy="76" r="8" fill="#86efac" stroke="#15803d" stroke-width="1.5" />
          <circle cx="240" cy="76" r="3.5" fill="#0f172a" />
          <circle cx="260" cy="76" r="8" fill="#86efac" stroke="#15803d" stroke-width="1.5" />
          <circle cx="260" cy="76" r="3.5" fill="#0f172a" />
          <!-- Frog Smile -->
          <path d="M 242 94 Q 250 100 258 94" fill="none" stroke="#15803d" stroke-width="2" />
          <!-- Ribbit marks -->
          <text x="278" y="75" font-size="20" font-weight="900" fill="#15803d">RIBBIT! 🐸</text>
        </svg>`,

      shoes: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#f8fafc" />
          <rect x="0" y="240" width="500" height="80" fill="#e2e8f0" />
          <!-- Classroom Doorway -->
          <rect x="350" y="40" width="130" height="230" rx="6" fill="#fed7aa" stroke="#ca8a04" stroke-width="4" />
          <rect x="365" y="55" width="45" height="65" rx="3" fill="#bae6fd" />
          <circle cx="365" cy="160" r="6" fill="#78350f" />
          <!-- Child looking down at shoes -->
          <circle cx="180" cy="110" r="30" fill="#fed7aa" />
          <path d="M 150 105 C 150 70 210 70 210 105 Z" fill="#7c2d12" />
          <!-- Eyes Looking DOWN toward feet! -->
          <circle cx="174" cy="116" r="4.5" fill="#1e293b" /><circle cx="186" cy="116" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth -->
          <line x1="175" y1="128" x2="185" y2="128" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body -->
          <rect x="160" y="140" width="40" height="60" rx="6" fill="#6366f1" />
          <!-- Legs -->
          <line x1="170" y1="200" x2="165" y2="260" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <line x1="190" y1="200" x2="195" y2="260" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <!-- TWO DIFFERENT SHOES! (Left: Red sneaker, Right: Tall Yellow Boot) -->
          <!-- Left Shoe: Low Red Sneaker -->
          <ellipse cx="160" cy="265" rx="16" ry="8" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
          <rect x="150" y="260" width="12" height="6" fill="#ffffff" />
          <!-- Right Shoe: Tall Yellow Rainboot -->
          <rect x="190" y="235" width="18" height="32" rx="4" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <ellipse cx="202" cy="267" rx="16" ry="8" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <!-- Attention Arrows -->
          <path d="M 125 255 L 145 262" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
          <path d="M 235 255 L 215 262" stroke="#facc15" stroke-width="4" stroke-linecap="round" />
          <text x="140" y="300" font-size="14" font-weight="900" fill="#64748b">Left: Sneaker 👟 · Right: Boot 🥾</text>
        </svg>`,

      sing: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#eff6ff" />
          <rect x="0" y="230" width="500" height="90" fill="#bfdbfe" />
          <!-- Music Notes in Background -->
          <text x="80" y="80" font-size="34" fill="#93c5fd">🎵</text>
          <text x="400" y="90" font-size="36" fill="#93c5fd">🎶</text>
          <text x="240" y="60" font-size="28" fill="#93c5fd">🎼</text>
          <!-- Microphone on Stand -->
          <rect x="248" y="150" width="4" height="100" fill="#475569" />
          <line x1="230" y1="250" x2="270" y2="250" stroke="#334155" stroke-width="6" stroke-linecap="round" />
          <!-- Mic head -->
          <rect x="242" y="125" width="16" height="25" rx="8" fill="#94a3b8" stroke="#334155" stroke-width="2" />
          <!-- Child standing before microphone (Neutral/Anticipatory gaze) -->
          <circle cx="170" cy="120" r="30" fill="#fed7aa" />
          <path d="M 140 115 C 140 80 200 80 200 115 Z" fill="#1e293b" />
          <!-- Eyes looking at microphone -->
          <circle cx="176" cy="120" r="4.5" fill="#1e293b" /><circle cx="188" cy="120" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth line -->
          <line x1="178" y1="135" x2="190" y2="135" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body -->
          <rect x="150" y="150" width="40" height="60" rx="6" fill="#ec4899" />
          <!-- Hands holding song sheet -->
          <line x1="160" y1="165" x2="195" y2="185" stroke="#fed7aa" stroke-width="6" stroke-linecap="round" />
          <rect x="195" y="170" width="24" height="30" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
          <!-- Legs -->
          <line x1="160" y1="210" x2="160" y2="265" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <line x1="180" y1="210" x2="180" y2="265" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <!-- Teacher pointing from right -->
          <circle cx="380" cy="115" r="26" fill="#fbcfe8" />
          <rect x="360" y="141" width="40" height="70" rx="6" fill="#10b981" />
          <line x1="365" y1="160" x2="280" y2="145" stroke="#fbcfe8" stroke-width="7" stroke-linecap="round" />
          <text x="320" y="95" font-size="14" font-weight="900" fill="#047857">"Come and sing!"</text>
        </svg>`,

      cat: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#fff7ed" />
          <rect x="0" y="240" width="500" height="80" fill="#fed7aa" />
          <!-- Living Room Rug -->
          <ellipse cx="250" cy="260" rx="160" ry="40" fill="#fdba74" />
          <!-- Child kneeling on floor looking at cat -->
          <circle cx="160" cy="140" r="28" fill="#fed7aa" />
          <path d="M 132 135 C 132 100 188 100 188 135 Z" fill="#b45309" />
          <!-- Eyes looking wide at cat -->
          <circle cx="166" cy="140" r="5" fill="#1e293b" /><circle cx="178" cy="140" r="5" fill="#1e293b" />
          <!-- Neutral mouth line -->
          <line x1="168" y1="155" x2="180" y2="155" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body kneeling -->
          <rect x="140" y="168" width="40" height="50" rx="6" fill="#3b82f6" />
          <ellipse cx="150" cy="240" rx="20" ry="12" fill="#1e40af" />
          <!-- Cute Ginger Cat on rug -->
          <ellipse cx="320" cy="220" rx="35" ry="24" fill="#f97316" />
          <!-- Cat Head -->
          <circle cx="280" cy="190" r="22" fill="#f97316" />
          <!-- Cat Ears -->
          <polygon points="268,172 274,152 284,170" fill="#c2410c" />
          <polygon points="286,170 296,152 302,172" fill="#c2410c" />
          <!-- Cat Eyes & Whiskers -->
          <ellipse cx="274" cy="188" rx="3" ry="5" fill="#15803d" />
          <ellipse cx="288" cy="188" rx="3" ry="5" fill="#15803d" />
          <polygon points="281,195 277,192 285,192" fill="#fda4af" />
          <!-- Speech bubble coming from cat: "HELLO!" -->
          <path d="M 300 160 Q 330 110 390 110 L 440 110 Q 460 110 460 140 L 460 160 Q 460 180 430 180 L 330 180 Z" fill="#ffffff" stroke="#ea580c" stroke-width="3" />
          <text x="345" y="152" font-size="22" font-weight="900" fill="#c2410c">"HELLO!" 🐱</text>
        </svg>`,

      icecream: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#fef2f2" />
          <rect x="0" y="230" width="500" height="90" fill="#e2e8f0" />
          <!-- Sun in sky -->
          <circle cx="80" cy="60" r="26" fill="#facc15" />
          <!-- Child looking down at dropped ice cream -->
          <circle cx="200" cy="100" r="30" fill="#fed7aa" />
          <path d="M 170 95 C 170 60 230 60 230 95 Z" fill="#451a03" />
          <!-- Eyes Looking down -->
          <circle cx="196" cy="108" r="4.5" fill="#1e293b" /><circle cx="208" cy="108" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth line -->
          <line x1="198" y1="120" x2="208" y2="120" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body -->
          <rect x="180" y="130" width="40" height="60" rx="6" fill="#14b8a6" />
          <!-- Hand holding EMPTY waffle cone -->
          <line x1="190" y1="150" x2="240" y2="160" stroke="#fed7aa" stroke-width="6" stroke-linecap="round" />
          <polygon points="240,152 255,152 248,175" fill="#d97706" stroke="#b45309" stroke-width="1.5" />
          <!-- Legs -->
          <line x1="190" y1="190" x2="185" y2="250" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <line x1="210" y1="190" x2="215" y2="250" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <!-- Shoes -->
          <ellipse cx="180" cy="255" rx="14" ry="7" fill="#3b82f6" />
          <ellipse cx="225" cy="255" rx="14" ry="7" fill="#3b82f6" />
          <!-- SQUISHED Strawberry Ice Cream scoop right on shoe! -->
          <ellipse cx="228" cy="248" rx="18" ry="10" fill="#f43f5e" />
          <ellipse cx="236" cy="245" rx="10" ry="8" fill="#fda4af" />
          <!-- Splatter drops -->
          <circle cx="252" cy="252" r="3" fill="#f43f5e" />
          <circle cx="212" cy="256" r="2.5" fill="#f43f5e" />
          <text x="260" y="240" font-size="16" font-weight="900" fill="#e11d48">SPLAT! 🍦</text>
        </svg>`,

      fly: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#e0f2fe" />
          <!-- Clouds -->
          <ellipse cx="100" cy="90" rx="50" ry="24" fill="#ffffff" />
          <ellipse cx="380" cy="70" rx="60" ry="26" fill="#ffffff" />
          <!-- Small houses way down below -->
          <rect x="80" y="270" width="50" height="40" fill="#94a3b8" />
          <polygon points="75,270 105,245 135,270" fill="#ef4444" />
          <rect x="220" y="275" width="45" height="35" fill="#94a3b8" />
          <polygon points="215,275 242,255 270,275" fill="#3b82f6" />
          <rect x="360" y="270" width="55" height="40" fill="#94a3b8" />
          <polygon points="355,270 387,245 420,270" fill="#10b981" />
          <!-- Child FLOATING IN MID-AIR (Superpower!) -->
          <!-- Arms spread like airplane wings -->
          <line x1="160" y1="160" x2="320" y2="160" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" />
          <!-- Child Head (Looking around with wonder) -->
          <circle cx="240" cy="115" r="30" fill="#fed7aa" />
          <path d="M 210 110 C 210 75 270 75 270 110 Z" fill="#92400e" />
          <!-- Eyes -->
          <circle cx="234" cy="115" r="4.5" fill="#1e293b" /><circle cx="246" cy="115" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth line -->
          <line x1="235" y1="130" x2="245" y2="130" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Superhero Cape floating behind -->
          <path d="M 215 145 Q 160 170 140 210 Q 180 200 220 180 Z" fill="#ef4444" />
          <!-- Body -->
          <rect x="220" y="145" width="40" height="55" rx="6" fill="#8b5cf6" />
          <!-- Floating Legs -->
          <line x1="230" y1="200" x2="220" y2="235" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <line x1="250" y1="200" x2="260" y2="235" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <!-- Wind trail lines -->
          <path d="M 200 175 Q 170 185 140 180 M 205 190 Q 180 205 150 200" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
        </svg>`,

      phone: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="320" fill="#f1f5f9" />
          <rect x="0" y="240" width="500" height="80" fill="#cbd5e1" />
          <!-- Calendar on wall showing 7 crossed days -->
          <rect x="70" y="40" width="90" height="80" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="3" />
          <rect x="70" y="40" width="90" height="20" fill="#ef4444" />
          <text x="115" y="55" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">WEEK</text>
          <text x="115" y="95" text-anchor="middle" font-size="28" font-weight="900" fill="#dc2626">7 ❌</text>
          <!-- Parent holding smartphone up -->
          <circle cx="360" cy="110" r="28" fill="#fed7aa" />
          <rect x="340" y="138" width="45" height="75" rx="6" fill="#0284c7" />
          <!-- Arm holding phone -->
          <line x1="345" y1="160" x2="260" y2="150" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" />
          <!-- Phone in hand -->
          <rect x="235" y="130" width="25" height="42" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="2" />
          <rect x="238" y="135" width="19" height="30" fill="#38bdf8" />
          <!-- Child looking at the phone being locked away (Neutral gaze) -->
          <circle cx="170" cy="130" r="28" fill="#fed7aa" />
          <path d="M 142 125 C 142 90 198 90 198 125 Z" fill="#1e293b" />
          <!-- Eyes looking right at phone -->
          <circle cx="176" cy="130" r="4.5" fill="#1e293b" /><circle cx="188" cy="130" r="4.5" fill="#1e293b" />
          <!-- Neutral mouth line -->
          <line x1="178" y1="145" x2="188" y2="145" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
          <!-- Body & Legs -->
          <rect x="150" y="158" width="38" height="55" rx="6" fill="#f59e0b" />
          <line x1="160" y1="213" x2="160" y2="265" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <line x1="180" y1="213" x2="180" y2="265" stroke="#334155" stroke-width="8" stroke-linecap="round" />
          <!-- Prohibition sign -->
          <circle cx="280" cy="80" r="26" fill="none" stroke="#ef4444" stroke-width="6" />
          <line x1="262" y1="62" x2="298" y2="98" stroke="#ef4444" stroke-width="6" />
          <text x="280" y="86" text-anchor="middle" font-size="20">📱</text>
        </svg>`
    };

    return svgs[type] || svgs.present;
  },

  // =========================================================================
  // STAGE 1: MYSTERY FACE 🎭 (5 min)
  // =========================================================================
  renderStage1(state) {
    const faceIdx = state.mysteryFaceIndex || 0;
    const faceData = window.FEELINGS_DATA.mysteryFaces[faceIdx];
    const isRevealed = !!state.mysteryFaceAnswered;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎭</span>
              <div>
                <h2>Stage 1: Mystery Face!</h2>
                <span class="subtitle">Warm-up & Observation</span>
              </div>
            </div>
          </div>
          <div class="speaking-chunk-pill">
            <span>🗣️ Target:</span> <strong>"How does he/she feel?"</strong>
          </div>
        </div>

        <div class="mystery-stage-wrap">
          <!-- Big Cartoon Mystery Face -->
          <div class="mystery-face-box">
            <div class="mystery-big-face">${faceData.icon}</div>
            <p style="font-size: 14px; font-weight: 800; color: #64748b; margin-top: 12px;">
              Mystery Face #${faceIdx + 1} of 3
            </p>
          </div>

          <!-- Choices & Reaction -->
          <div class="mystery-choices-box">
            <h3 style="font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 6px;">
              ${faceData.prompt}
            </h3>

            ${faceData.options.map(opt => `
              <button class="mystery-choice-btn" onclick="window.feelingsApp.handleMysteryChoice('${opt.id}', '${faceData.target}')">
                <span style="font-size: 32px;">${opt.icon}</span>
                <span>${opt.name}</span>
              </button>
            `).join('')}

            ${isRevealed ? `
              <div class="animate-pop" style="background:#dcfce7; border:2px solid #22c55e; border-radius:16px; padding:14px; text-align:center; margin-top:10px;">
                <div style="font-size:22px; font-weight:900; color:#15803d;">🎉 Correct! He/She is ${faceData.targetName}!</div>
                <div style="font-size:14px; color:#166534; font-weight:800; margin-top:4px;">
                  Now let's explore our big question: <strong>HOW WOULD YOU FEEL?</strong>
                </div>
                <div style="display:flex; justify-content:center; gap:8px; margin-top:10px;">
                  ${faceIdx < 2 ? `
                    <button class="hud-btn primary" onclick="window.feelingsApp.nextMysteryFace()">Next Mystery Face ➔</button>
                  ` : `
                    <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(2)">Next: Feeling Discovery 🧠 ➔</button>
                  `}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- 4-Step Rule Banner -->
        <div style="background:#ffffff; border:2px solid #e2e8f0; border-radius:14px; padding:10px 18px; display:flex; justify-content:space-around; align-items:center; margin-top:10px;">
          <span style="font-weight:900; font-size:14px; color:#3b82f6;">👀 1. LOOK</span>
          <span style="color:#cbd5e1;">➔</span>
          <span style="font-weight:900; font-size:14px; color:#f59e0b;">🤔 2. THINK</span>
          <span style="color:#cbd5e1;">➔</span>
          <span style="font-weight:900; font-size:14px; color:#10b981;">🎯 3. CHOOSE</span>
          <span style="color:#cbd5e1;">➔</span>
          <span style="font-weight:900; font-size:14px; color:#8b5cf6;">🗣️ 4. SAY</span>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 2: FEELING DISCOVERY 🧠 (5 min)
  // =========================================================================
  renderStage2(state) {
    const showAll = !!state.showAllFeelings;
    const emotions = showAll 
      ? window.FEELINGS_DATA.emotions 
      : window.FEELINGS_DATA.emotions.filter(e => e.level === 'Core');

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🧠</span>
              <div>
                <h2>Stage 2: Feeling Discovery &amp; Gestures</h2>
                <span class="subtitle">Tap any feeling to hear pronunciation &amp; model the gesture!</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="hud-btn" onclick="window.feelingsApp.toggleDiscoveryFeelings()">
              ${showAll ? 'Show Core Feelings Only (6)' : '✨ Unlock A1+ Feelings (12+2)'}
            </button>
            <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(3)">
              Next: Which Feeling Game 🎯 ➔
            </button>
          </div>
        </div>

        <div class="emotion-cards-grid" style="grid-template-columns: repeat(${showAll ? 7 : 6}, 1fr);">
          ${emotions.map(e => `
            <div class="emotion-card" style="background:${e.color}; border-color:${e.border};" onclick="window.feelingsApp.speakEmotion('${e.name}', '${e.wouldChunk}', '${e.gesture}')">
              <div class="emotion-face">${e.icon}</div>
              <div class="emotion-name">${e.name}</div>
              <div class="emotion-level">${e.level}</div>
              <div class="emotion-gesture">👉 ${e.gesture}</div>
              <div style="font-size:11px; font-weight:900; color:#1e3a8a; margin-top:6px; background:rgba(255,255,255,0.7); padding:2px 6px; border-radius:6px;">
                "${e.wouldChunk}"
              </div>
            </div>
          `).join('')}
        </div>

        <div style="background:#ffffff; border:2px solid #cbd5e1; border-radius:14px; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
          <div style="font-size:14px; font-weight:800; color:#475569;">
            💡 <strong>Teacher Tip:</strong> Say the emotion aloud. Have students mimic the facial expression &amp; action before repeating the speaking chunk: <em>"I'd feel..."</em>
          </div>
          <button class="hud-btn" onclick="window.feelingsSound.speak('How do you feel? I am happy! How would you feel? I would feel happy!')">
            🔊 Play Demonstration
          </button>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 3: DIGITAL GAME – WHICH FEELING? 🎯 (5 min)
  // =========================================================================
  renderStage3(state) {
    const qIdx = state.whichFeelingIndex || 0;
    const qData = window.FEELINGS_DATA.whichFeelingScenarios[qIdx];
    const isAnswered = !!state.whichFeelingAnswered;
    const canChoose = state.thinkTimerFinished || false;
    const timeLeft = state.thinkTimerSeconds !== undefined ? state.thinkTimerSeconds : 5;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎯</span>
              <div>
                <h2>Stage 3: Which Feeling? (Timed Challenge)</h2>
                <span class="subtitle">Round ${qIdx + 1} of 5</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(4)">
            Skip to Main Activity 🎭 ➔
          </button>
        </div>

        <!-- 5-Second Think Timer -->
        <div class="think-timer-container">
          <div class="think-phase-pill ${canChoose ? 'choose' : 'think'}">
            ${canChoose ? '🎯 CHOOSE!' : '🤔 THINK!'}
          </div>
          <div class="timer-bar-outer">
            <div class="timer-bar-inner" style="width: ${(timeLeft / 5) * 100}%;"></div>
          </div>
          <div class="timer-seconds-text">${timeLeft}s</div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; flex:1; align-items:center;">
          <!-- Situation Card -->
          <div style="background:#ffffff; border:3px solid #cbd5e1; border-radius:20px; padding:24px; text-align:center; box-shadow:0 6px 18px rgba(0,0,0,0.05);">
            <div style="font-size:64px; margin-bottom:12px;">${qData.visual}</div>
            <h3 style="font-size:22px; font-weight:900; color:#0f172a; margin-bottom:8px;">${qData.title}</h3>
            <p style="font-size:16px; color:#475569; font-weight:700; line-height:1.4;">${qData.desc}</p>
            <div style="margin-top:16px; display:inline-block; background:#eff6ff; border:2px solid #3b82f6; border-radius:12px; padding:6px 16px; font-size:16px; font-weight:900; color:#1d4ed8;">
              ❓ ${qData.question}
            </div>
          </div>

          <!-- 4 Visual Choices -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            ${qData.options.map(opt => `
              <button class="choice-pill-btn ${isAnswered && opt.id === qData.answerId ? 'is-active' : ''}" 
                style="${!canChoose ? 'opacity:0.6; cursor:not-allowed;' : ''}"
                onclick="${canChoose ? `window.feelingsApp.handleWhichFeelingChoice('${opt.id}', '${qData.answerId}')` : ''}">
                <span class="face-icon">${opt.icon}</span>
                <span class="label-text">${opt.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Feedback & Next Round -->
        ${isAnswered ? `
          <div class="animate-pop" style="background:#ecfdf5; border:2px solid #10b981; border-radius:14px; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <div style="font-size:16px; font-weight:900; color:#065f46;">
              🎉 Excellent! You feel <strong>${qData.answerName}</strong>! <em>"I'm ${qData.answerName}!"</em>
            </div>
            ${qIdx < 4 ? `
              <button class="hud-btn primary" onclick="window.feelingsApp.nextWhichFeeling()">Next Situation (${qIdx + 2}/5) ➔</button>
            ` : `
              <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(4)">Main Activity: How Would You Feel? ➔</button>
            `}
          </div>
        ` : ''}
      </div>
    `;
  },

  // =========================================================================
  // STAGE 4: HOW WOULD YOU FEEL? 🎭 (Main Activity - 10 Situations)
  // =========================================================================
  renderStage4(state) {
    const sitIdx = state.situationIndex || 0;
    const sit = window.FEELINGS_DATA.mainSituations[sitIdx];
    const selectedOpt = state.situationChoices && state.situationChoices[sit.id];

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎭</span>
              <div>
                <h2>Stage 4: How Would You Feel? (Main Activity)</h2>
                <span class="subtitle">Situation ${sit.num} of 10 · ${sit.tag}</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="hud-btn" onclick="window.feelingsApp.prevSituation()" ${sitIdx === 0 ? 'disabled style="opacity:0.4;"' : ''}>⬅️ Prev</button>
            <button class="hud-btn" onclick="window.feelingsApp.nextSituation()" ${sitIdx === 9 ? 'disabled style="opacity:0.4;"' : ''}>Next ➡️</button>
            <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(5)">Stage 5: Harder Challenge ➔</button>
          </div>
        </div>

        <div class="situation-layout">
          <!-- Left: Cartoon SVG Canvas (Shows Situation ONLY, Neutral Child!) -->
          <div class="situation-visual-box">
            <div class="situation-svg-canvas">
              ${this.getSituationSvg(sit.svgType)}
            </div>
            <div class="situation-caption-banner">
              <span class="situation-caption-text">${sit.icon} ${sit.scenario}</span>
              <button class="hud-btn" onclick="window.feelingsSound.speak('${sit.scenario.replace(/'/g, "\\'")}')">🔊 Read</button>
            </div>
          </div>

          <!-- Right: Interactive Choices & Sentence Scaffolding -->
          <div class="situation-choices-box">
            <div class="situation-prompt-bubble">
              <span class="q-text">❓ ${sit.question}</span>
              <button class="hud-btn" onclick="window.feelingsSound.speak('How would you feel?')">🔊 Listen</button>
            </div>

            <div class="choice-grid-2x2">
              ${sit.options.map(opt => `
                <button class="choice-pill-btn ${selectedOpt && selectedOpt.id === opt.id ? 'is-active' : ''}"
                  onclick="window.feelingsApp.handleSituationChoice('${sit.id}', '${opt.id}')">
                  <span class="face-icon">${opt.icon}</span>
                  <span class="label-text">${opt.name}</span>
                </button>
              `).join('')}
            </div>

            <!-- Speaking Chunk Scaffold -->
            <div class="sentence-scaffold-box">
              <div>
                <div style="font-size:12px; font-weight:800; color:#3b82f6; text-transform:uppercase;">🗣️ Say it in English:</div>
                <div class="scaffold-text">
                  "I'd feel <span class="scaffold-highlight">${selectedOpt ? selectedOpt.name.toLowerCase() : '...'}</span>."
                </div>
              </div>
              ${selectedOpt ? `
                <button class="hud-btn primary" onclick="window.feelingsSound.speak('${selectedOpt.chunk}')">
                  🔊 Say Aloud
                </button>
              ` : `
                <span style="font-size:12px; font-weight:800; color:#64748b;">👈 Choose feeling</span>
              `}
            </div>

            <!-- Classroom Point Triggers -->
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:800; color:#475569;">Award Points:</span>
              <div style="display:flex; gap:6px;">
                <button class="team-btn-add" style="color:var(--team-a);" onclick="window.feelingsApp.addScore('teamA', 1); window.feelingsApp.showToast('+1 Team A (Emotion)!');">+1 🔵 Emotion</button>
                <button class="team-btn-add" style="color:var(--team-a);" onclick="window.feelingsApp.addScore('teamA', 1); window.feelingsApp.showToast('+1 Team A (Sentence)!');">+1 🔵 Sentence</button>
                <button class="team-btn-add" style="color:var(--team-b);" onclick="window.feelingsApp.addScore('teamB', 1); window.feelingsApp.showToast('+1 Team B (Emotion)!');">+1 🔴 Emotion</button>
                <button class="team-btn-add" style="color:var(--team-b);" onclick="window.feelingsApp.addScore('teamB', 1); window.feelingsApp.showToast('+1 Team B (Sentence)!');">+1 🔴 Sentence</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 5: HARDER THINKING CHALLENGE 🤔 (5 min)
  // =========================================================================
  renderStage5(state) {
    const dIdx = state.dilemmaIndex || 0;
    const dilemma = window.FEELINGS_DATA.harderThinking[dIdx];
    const poll = state.dilemmaVotes && state.dilemmaVotes[dilemma.id] || {};

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🤔</span>
              <div>
                <h2>Stage 5: Harder Thinking (Personal Choice)</h2>
                <span class="subtitle">Dilemma ${dIdx + 1} of 3 · More than one answer is valid!</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            ${dIdx > 0 ? `<button class="hud-btn" onclick="window.feelingsApp.prevDilemma()">⬅️ Prev</button>` : ''}
            ${dIdx < 2 ? `<button class="hud-btn" onclick="window.feelingsApp.nextDilemma()">Next Dilemma ➔</button>` : ''}
            <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(6)">Stage 6: Spin &amp; React 🎡 ➔</button>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px; flex:1; justify-content:center;">
          <!-- Dilemma Card -->
          <div style="background:#ffffff; border:3px solid #cbd5e1; border-radius:20px; padding:20px 24px; box-shadow:0 6px 18px rgba(0,0,0,0.05); text-align:center;">
            <div style="font-size:54px; margin-bottom:8px;">${dilemma.icon}</div>
            <h3 style="font-size:22px; font-weight:900; color:#0f172a;">${dilemma.title}</h3>
            <p style="font-size:17px; color:#475569; font-weight:700; margin-top:6px; max-width:800px; margin-left:auto; margin-right:auto;">
              ${dilemma.scenario}
            </p>
            <div style="margin-top:12px; font-size:14px; font-weight:800; color:#d97706; background:#fef3c7; display:inline-block; padding:4px 14px; border-radius:20px;">
              💡 <em>${dilemma.discussion}</em>
            </div>
          </div>

          <!-- Classroom Poll Choices -->
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
            ${dilemma.options.map(opt => {
              const votes = poll[opt.id] || 0;
              return `
                <div class="emotion-card" onclick="window.feelingsApp.handleDilemmaVote('${dilemma.id}', '${opt.id}')" style="padding:16px;">
                  <div class="emotion-face">${opt.icon}</div>
                  <div class="emotion-name">${opt.name}</div>
                  <div style="font-size:12px; font-weight:800; color:#2563eb; margin-top:6px; text-align:center;">
                    "${opt.chunk}"
                  </div>
                  <div style="margin-top:10px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:4px 10px; font-size:13px; font-weight:900; color:#1d4ed8;">
                    🗳️ ${votes} ${votes === 1 ? 'student' : 'students'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 6: DIGITAL SPIN & REACT 🎡 (7 min)
  // =========================================================================
  renderStage6(state) {
    const curItem = state.currentSpinnerItem;
    const feelChosen = state.spinnerFeelingChosen;
    const actionChosen = state.spinnerActionChosen;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎡</span>
              <div>
                <h2>Stage 6: Digital Spin &amp; React</h2>
                <span class="subtitle">Spin for a SITUATION $\\rightarrow$ Step 1: Feel $\\rightarrow$ Step 2: Act!</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(7)">
            Stage 7: Match Game 🔄 ➔
          </button>
        </div>

        <div class="spinner-stage-layout">
          <!-- Left: Canvas Wheel -->
          <div class="spinner-canvas-wrap">
            <div class="wheel-pointer"></div>
            <canvas id="wheel-canvas" width="420" height="420"></canvas>
            <button class="wheel-center-hub" onclick="window.feelingsApp.spinWheel()" title="Click to Spin!">
              🎡
            </button>
          </div>

          <!-- Right: Reaction Card -->
          <div class="spinner-result-card">
            ${curItem ? `
              <div style="border-bottom:2px solid #f1f5f9; padding-bottom:10px;">
                <div style="font-size:36px;">${curItem.icon}</div>
                <h3 style="font-size:20px; font-weight:900; color:#0f172a;">${curItem.label}</h3>
                <p style="font-size:14px; color:#64748b; font-weight:700;">${curItem.scenario}</p>
              </div>

              <!-- Step 1: How would you feel? -->
              <div>
                <div style="font-size:13px; font-weight:900; color:#3b82f6; text-transform:uppercase; margin-bottom:6px;">
                  1️⃣ ${curItem.feelPrompt}
                </div>
                <div style="display:flex; gap:10px;">
                  ${curItem.feelings.map(f => `
                    <button class="hud-btn ${feelChosen === f.id ? 'primary' : ''}" style="flex:1; justify-content:center;"
                      onclick="window.feelingsApp.handleSpinnerFeeling('${f.id}', '${f.name}')">
                      <span>${f.icon}</span> <span>${f.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Step 2: What would you do? -->
              ${feelChosen ? `
                <div class="animate-pop" style="border-top:2px solid #f1f5f9; padding-top:10px;">
                  <div style="font-size:13px; font-weight:900; color:#10b981; text-transform:uppercase; margin-bottom:6px;">
                    2️⃣ NEXT! ${curItem.actionPrompt}
                  </div>
                  <div class="action-buttons-row">
                    ${curItem.actions.map(a => `
                      <button class="action-choice-btn ${actionChosen === a.id ? 'is-active' : ''}"
                        onclick="window.feelingsApp.handleSpinnerAction('${a.id}', '${a.chunk}')">
                        <span class="act-icon">${a.icon}</span>
                        <span class="act-label">${a.label}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Combined Chunk Scaffold -->
              ${feelChosen && actionChosen ? `
                <div class="animate-pop" style="background:#eff6ff; border:2px solid #60a5fa; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-size:11px; font-weight:800; color:#2563eb;">COMPLETE RESPONSE:</div>
                    <div style="font-size:15px; font-weight:900; color:#1e40af;">
                      "I'd feel ${feelChosen}. ${actionChosen}"
                    </div>
                  </div>
                  <button class="hud-btn primary" onclick="window.feelingsSound.speak('I would feel ${feelChosen}. ${actionChosen}')">
                    🔊 Say
                  </button>
                </div>
              ` : ''}
            ` : `
              <div style="text-align:center; padding:40px 20px; color:#64748b;">
                <div style="font-size:54px; margin-bottom:12px;">🎡</div>
                <h3 style="font-size:18px; font-weight:900; color:#1e293b;">Click the Wheel to Spin!</h3>
                <p style="font-size:13px; font-weight:700; margin-top:4px;">
                  Land on a funny or challenging situation, then decide what YOU would feel &amp; do!
                </p>
                <button class="hud-btn primary" style="margin-top:16px;" onclick="window.feelingsApp.spinWheel()">
                  🎡 Spin Now!
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 7: FEELING → ACTION GAME 🔄 (5 min)
  // =========================================================================
  renderStage7(state) {
    const triplets = window.FEELINGS_DATA.matchingTriplets;
    const matchedSet = state.matchedTriplets || new Set();
    const selSit = state.selectedMatchSit;
    const selFeel = state.selectedMatchFeel;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🔄</span>
              <div>
                <h2>Stage 7: Situation $\\rightarrow$ Feeling $\\rightarrow$ Action</h2>
                <span class="subtitle">Connect all 6 matching triplets (${matchedSet.size || 0}/6 complete)</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(8)">
            Stage 8: Feelings Song 🎵 ➔
          </button>
        </div>

        <div class="matching-game-grid">
          <!-- Col 1: Situations -->
          <div class="match-col">
            <div class="match-col-header">1. Situation 🏞️</div>
            ${triplets.map(t => {
              const isMatched = matchedSet.has(t.id);
              const isSelected = selSit === t.id;
              return `
                <div class="match-card-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}"
                  onclick="${isMatched ? '' : `window.feelingsApp.selectMatchSit('${t.id}')`}">
                  <span style="font-size:24px;">${t.situation.icon}</span>
                  <span style="font-weight:900; font-size:14px;">${t.situation.label}</span>
                  ${isMatched ? '<span style="margin-left:auto;">✓</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Col 2: Feelings -->
          <div class="match-col">
            <div class="match-col-header">2. Feeling 💭</div>
            ${triplets.map(t => {
              const isMatched = matchedSet.has(t.id);
              const isSelected = selFeel === t.id;
              return `
                <div class="match-card-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}"
                  onclick="${isMatched ? '' : `window.feelingsApp.selectMatchFeel('${t.id}')`}">
                  <span style="font-size:24px;">${t.feeling.icon}</span>
                  <span style="font-weight:900; font-size:14px;">${t.feeling.label}</span>
                  ${isMatched ? '<span style="margin-left:auto;">✓</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Col 3: Actions -->
          <div class="match-col">
            <div class="match-col-header">3. Action 🏃</div>
            ${triplets.map(t => {
              const isMatched = matchedSet.has(t.id);
              return `
                <div class="match-card-item ${isMatched ? 'matched' : ''}"
                  onclick="${isMatched ? '' : `window.feelingsApp.selectMatchAction('${t.id}')`}">
                  <span style="font-size:24px;">${t.action.icon}</span>
                  <span style="font-weight:900; font-size:14px;">${t.action.label}</span>
                  ${isMatched ? '<span style="margin-left:auto;">✓</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="background:#ffffff; border:2px solid #cbd5e1; border-radius:14px; padding:8px 16px; display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <span style="font-size:13px; font-weight:800; color:#475569;">
            ${matchedSet.size === 6 ? '🎉 All 6 Triplets Connected! Great job!' : '👉 Click: Situation ➔ Feeling ➔ Action to form a complete connection!'}
          </span>
          <button class="hud-btn" onclick="window.feelingsApp.resetMatching()">🔄 Reset Puzzle</button>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 8: FEELINGS SONG 🎵 (4-5 min)
  // =========================================================================
  renderStage8(state) {
    const round = state.songRound || 1;
    const verses = window.FEELINGS_DATA.songVerses;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎵</span>
              <div>
                <h2>Stage 8: The Feelings Song</h2>
                <span class="subtitle">Listen, Gesture, and Predict the Rhythm!</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(9)">
            Stage 9: Boss Challenge 🧠 ➔
          </button>
        </div>

        <div class="song-player-wrap">
          <!-- Round Switcher Tabs -->
          <div class="song-round-tabs">
            <button class="song-tab-btn ${round === 1 ? 'is-active' : ''}" onclick="window.feelingsApp.setSongRound(1)">
              🎧 Round 1: Listen &amp; Watch
            </button>
            <button class="song-tab-btn ${round === 2 ? 'is-active' : ''}" onclick="window.feelingsApp.setSongRound(2)">
              🏃 Round 2: Action Gestures
            </button>
            <button class="song-tab-btn ${round === 3 ? 'is-active' : ''}" onclick="window.feelingsApp.setSongRound(3)">
              🧩 Round 3: Fill the Blanks!
            </button>
          </div>

          <!-- Lyrics Display -->
          <div class="song-lyrics-container">
            ${verses.map((v, idx) => `
              <div class="song-line-row ${state.activeSongVerse === idx ? 'active-singing' : ''}">
                <button class="hud-btn" onclick="window.feelingsApp.playVerse(${idx})">▶ Verse ${idx + 1}</button>
                <span style="font-size:22px;">${v.trigger.split(' ')[0]}</span>
                <span style="flex:1;">
                  ${v.cue}
                  ${round === 3 ? `
                    <span class="song-blank-slot" onclick="window.feelingsApp.revealSongBlank(${idx})">
                      ${state.songRevealed && state.songRevealed[idx] ? v.targetName.toUpperCase() : '______?'}
                    </span>
                  ` : `
                    <strong style="color:#2563eb;">I'm ${v.targetName.toUpperCase()}!</strong>
                  `}
                </span>
                ${round >= 2 ? `
                  <span style="font-size:14px; font-weight:800; color:#059669; background:#ecfdf5; padding:4px 10px; border-radius:8px;">
                    ${v.gesture}
                  </span>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- Song Controls Footer -->
          <div style="display:flex; justify-content:center; gap:12px;">
            <button class="hud-btn primary" onclick="window.feelingsApp.playFullSong()">
              🎵 Play Full Song With Gestures
            </button>
            <button class="hud-btn" onclick="window.feelingsSound.stopSpeech()">
              ⏹️ Stop
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 9: FINAL BOSS-LEVEL CHALLENGE 🧠 (5 min)
  // =========================================================================
  renderStage9(state) {
    const bIdx = state.bossCardIndex || 0;
    const card = window.FEELINGS_DATA.bossCards[bIdx];
    const timeLeft = state.bossTimerSeconds !== undefined ? state.bossTimerSeconds : 5;
    const isRunning = state.bossActive || false;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">⚡</span>
              <div>
                <h2>Stage 9: Boss-Level Rapid Reaction!</h2>
                <span class="subtitle">5 Seconds Per Situation · Look ➔ Think ➔ Choose ➔ Say!</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(10)">
            Stage 10: Exit Ticket 🎫 ➔
          </button>
        </div>

        <div class="boss-challenge-wrap">
          <!-- Countdown Circle -->
          <div class="boss-timer-circle">${timeLeft}s</div>

          <!-- Rapid Situation Card -->
          <div class="boss-card">
            <div style="font-size:72px;">${card.icon}</div>
            <h3 style="font-size:24px; font-weight:900; color:#0f172a; text-align:center;">
              ${card.situation}
            </h3>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; width:100%; margin-top:8px;">
              <div style="background:#fef3c7; border:2px solid #f59e0b; border-radius:14px; padding:12px; text-align:center;">
                <div style="font-size:12px; font-weight:800; color:#b45309;">1. How would you feel?</div>
                <div style="font-size:18px; font-weight:900; color:#92400e; margin-top:4px;">
                  "I'd feel ${card.feel}"
                </div>
              </div>

              <div style="background:#dcfce7; border:2px solid #22c55e; border-radius:14px; padding:12px; text-align:center;">
                <div style="font-size:12px; font-weight:800; color:#15803d;">2. What would you do?</div>
                <div style="font-size:18px; font-weight:900; color:#166534; margin-top:4px;">
                  "${card.action}"
                </div>
              </div>
            </div>

            <!-- Reaction Control -->
            <div style="display:flex; gap:12px; margin-top:10px;">
              ${!isRunning ? `
                <button class="hud-btn primary" onclick="window.feelingsApp.startBossTimer()">
                  ▶ Start 5-Second Timer
                </button>
              ` : `
                <button class="hud-btn primary" onclick="window.feelingsApp.handleBossSuccess()">
                  ✓ Reacted Successfully! (+2 pts)
                </button>
              `}
              <button class="hud-btn" onclick="window.feelingsApp.nextBossCard()">
                Next Situation (${bIdx + 1}/6) ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STAGE 10: EXIT TICKET 🎫 (2-3 min)
  // =========================================================================
  renderStage10(state) {
    const exitSit = state.currentExitSituation || window.FEELINGS_DATA.mainSituations[0];
    const tier = state.exitTier || 2;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎫</span>
              <div>
                <h2>Stage 10: Exit Ticket &amp; Award</h2>
                <span class="subtitle">Individual Speaking Check · Differentiated Response Tiers</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <a href="worksheet.html" target="_blank" class="hud-btn">🖨️ Open Printables</a>
            <button class="hud-btn primary" onclick="window.feelingsApp.renderStage(1)">🔄 Restart Lesson</button>
          </div>
        </div>

        <div class="exit-ticket-layout">
          <!-- Left: Random Student Situation Generator -->
          <div style="background:#ffffff; border:3px solid #cbd5e1; border-radius:20px; padding:22px; box-shadow:0 6px 18px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:13px; font-weight:900; color:#3b82f6; text-transform:uppercase;">Student Exit Dilemma:</span>
              <button class="hud-btn" onclick="window.feelingsApp.rollRandomExitSituation()">🎲 Roll Random</button>
            </div>

            <div style="text-align:center; padding:16px 0;">
              <div style="font-size:56px; margin-bottom:8px;">${exitSit.icon}</div>
              <h3 style="font-size:20px; font-weight:900; color:#0f172a;">${exitSit.title}</h3>
              <p style="font-size:15px; color:#475569; font-weight:700; margin-top:4px;">${exitSit.scenario}</p>
            </div>

            <button class="hud-btn primary" onclick="window.feelingsSound.speak('${exitSit.question}')">
              🔊 Ask Student: "How would you feel?"
            </button>
          </div>

          <!-- Right: Differentiated Speech Tiers & Award -->
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:13px; font-weight:900; color:#64748b; text-transform:uppercase;">
              Choose Student Scaffold Level:
            </div>

            <!-- Tier 1: Emerging -->
            <div class="exit-scaffold-tier-card ${tier === 1 ? 'selected' : ''}" onclick="window.feelingsApp.setExitTier(1)">
              <div style="font-weight:900; font-size:14px; color:#15803d;">🟢 Tier 1 (Emerging A1)</div>
              <div style="font-size:13px; color:#334155; margin-top:2px;">
                Prompt: <em>"Happy or scared?"</em> $\\rightarrow$ Response: <strong>"I'm scared."</strong>
              </div>
            </div>

            <!-- Tier 2: Standard A1+ -->
            <div class="exit-scaffold-tier-card ${tier === 2 ? 'selected' : ''}" onclick="window.feelingsApp.setExitTier(2)">
              <div style="font-weight:900; font-size:14px; color:#2563eb;">🟡 Tier 2 (Standard A1+)</div>
              <div style="font-size:13px; color:#334155; margin-top:2px;">
                Prompt: <em>"How would you feel?"</em> $\\rightarrow$ Response: <strong>"I'd feel scared."</strong>
              </div>
            </div>

            <!-- Tier 3: Extension -->
            <div class="exit-scaffold-tier-card ${tier === 3 ? 'selected' : ''}" onclick="window.feelingsApp.setExitTier(3)">
              <div style="font-weight:900; font-size:14px; color:#7c3aed;">🟣 Tier 3 (Extension)</div>
              <div style="font-size:13px; color:#334155; margin-top:2px;">
                Prompt: <em>"How would you feel? What would you do?"</em> $\\rightarrow$ Response: <strong>"I'd feel scared. I'd run!"</strong>
              </div>
            </div>

            <!-- Celebration Badge Box -->
            <div class="exit-ticket-badge-box">
              <span style="font-size:38px;">🏆</span>
              <div>
                <h4 style="font-size:16px; font-weight:900; color:#92400e;">CLASS EMOTIONS MASTERY AWARD!</h4>
                <p style="font-size:12px; font-weight:700; color:#b45309; margin-top:2px;">
                  Everyone practiced thinking, choosing, and speaking feelings in English!
                </p>
              </div>
              <button class="hud-btn primary" onclick="window.feelingsSound.playFanfare(); window.feelingsApp.showToast('🎉 CONGRATULATIONS! CLASS COMPLETE!');">
                🎖️ Award Badges to Class
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.FeelingsScenes = FeelingsScenes;
}
