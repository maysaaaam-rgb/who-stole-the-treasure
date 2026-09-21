/**
 * ALICE IN WONDERLAND XP QUEST DECK — APPLICATION CONTROLLER
 * Deck Navigation, Vector Artwork Renderers, Roster XP Dispatcher
 * Pure Vanilla ES6+ | Zero External Dependencies
 */
(function(root) {
  'use strict';

  // SVG VECTOR ARTWORK GENERATORS
  const AliceArtwork = {
    /**
     * 1. Poster Showcase Rig (Welcome / Overview)
     */
    renderPosterShowcase() {
      return `
        <svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" class="alice-svg-art">
          <defs>
            <linearGradient id="goldFrameGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
            <linearGradient id="bookCoverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e1b4b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Shadow Base -->
          <ellipse cx="250" cy="330" rx="180" ry="18" fill="rgba(0,0,0,0.4)"/>

          <!-- Floating Storybook Frame -->
          <g filter="url(#goldGlow)">
            <rect x="70" y="40" width="360" height="270" rx="20" fill="url(#bookCoverGrad)" stroke="url(#goldFrameGrad)" stroke-width="4"/>
            <rect x="85" y="55" width="330" height="240" rx="14" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5" stroke-dasharray="6,4"/>
          </g>

          <!-- Book Pages & Filigree -->
          <path d="M 250,60 L 250,290" stroke="rgba(245, 158, 11, 0.6)" stroke-width="2"/>
          <path d="M 120,80 Q 180,65 245,80" fill="none" stroke="rgba(254, 240, 138, 0.3)" stroke-width="2"/>
          <path d="M 255,80 Q 320,65 380,80" fill="none" stroke="rgba(254, 240, 138, 0.3)" stroke-width="2"/>

          <!-- Animated Floating Card Suits -->
          <g class="floating-suit suit-heart">
            <text x="120" y="150" font-size="34" fill="#f43f5e" opacity="0.9">♥</text>
          </g>
          <g class="floating-suit suit-spade">
            <text x="340" y="150" font-size="34" fill="#cbd5e1" opacity="0.9">♠</text>
          </g>
          <g class="floating-suit suit-diamond">
            <text x="135" y="240" font-size="32" fill="#f43f5e" opacity="0.85">♦</text>
          </g>
          <g class="floating-suit suit-club">
            <text x="325" y="240" font-size="32" fill="#cbd5e1" opacity="0.85">♣</text>
          </g>

          <!-- Center Emblem -->
          <circle cx="250" cy="175" r="48" fill="#1e293b" stroke="url(#goldFrameGrad)" stroke-width="3"/>
          <text x="250" y="185" font-size="34" text-anchor="middle">👑</text>
          <text x="250" y="270" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#fef08a" text-anchor="middle" letter-spacing="2">WONDERLAND QUEST</text>
        </svg>
      `;
    },

    /**
     * 2. White Rabbit with Pocket Watch (Level 1 Focus)
     */
    renderWhiteRabbit() {
      return `
        <svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" class="alice-svg-art">
          <defs>
            <linearGradient id="furGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#e2e8f0"/>
            </linearGradient>
            <linearGradient id="vestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#dc2626"/>
              <stop offset="100%" stop-color="#991b1b"/>
            </linearGradient>
            <linearGradient id="goldWatchGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
            <filter id="rabbitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Shadow -->
          <ellipse cx="250" cy="335" rx="130" ry="14" fill="rgba(0,0,0,0.4)"/>

          <!-- Long Ears with Soft Pink Inner -->
          <!-- Left Ear -->
          <path d="M 195,140 C 180,70 160,20 185,15 C 205,10 215,60 210,140 Z" fill="url(#furGrad)" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M 192,125 C 182,75 172,35 186,30 C 196,25 204,65 202,125 Z" fill="#fda4af" opacity="0.85"/>

          <!-- Right Ear (Slightly bent) -->
          <path d="M 245,140 C 255,80 275,30 295,38 C 310,48 290,95 260,140 Z" fill="url(#furGrad)" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M 252,125 C 260,85 272,50 286,55 C 295,62 282,98 258,125 Z" fill="#fda4af" opacity="0.85"/>

          <!-- Rabbit Head & Cheeks -->
          <ellipse cx="225" cy="180" rx="55" ry="50" fill="url(#furGrad)" stroke="#cbd5e1" stroke-width="2"/>
          <ellipse cx="190" cy="195" rx="20" ry="16" fill="url(#furGrad)"/>
          <ellipse cx="260" cy="195" rx="20" ry="16" fill="url(#furGrad)"/>

          <!-- Pink Nose & Whiskers -->
          <polygon points="221,195 229,195 225,202" fill="#f43f5e"/>
          <path d="M 225,202 L 225,210 M 220,210 Q 225,214 230,210" stroke="#64748b" stroke-width="1.8" fill="none"/>
          <!-- Whiskers -->
          <line x1="175" y1="198" x2="135" y2="192" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="175" y1="204" x2="132" y2="206" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="275" y1="198" x2="315" y2="192" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="275" y1="204" x2="318" y2="206" stroke="#94a3b8" stroke-width="1.5"/>

          <!-- Oversized Round Spectacles -->
          <circle cx="205" cy="178" r="18" fill="rgba(56, 189, 248, 0.15)" stroke="#f59e0b" stroke-width="3"/>
          <circle cx="245" cy="178" r="18" fill="rgba(56, 189, 248, 0.15)" stroke="#f59e0b" stroke-width="3"/>
          <line x1="223" y1="178" x2="227" y2="178" stroke="#f59e0b" stroke-width="3"/>
          <!-- Eyes behind glasses -->
          <circle cx="205" cy="178" r="5" fill="#0f172a"/>
          <circle cx="207" cy="176" r="2" fill="#ffffff"/>
          <circle cx="245" cy="178" r="5" fill="#0f172a"/>
          <circle cx="247" cy="176" r="2" fill="#ffffff"/>

          <!-- Crimson Waistcoat & Body -->
          <path d="M 175,225 Q 225,215 275,225 L 290,320 L 160,320 Z" fill="url(#vestGrad)" stroke="#7f1d1d" stroke-width="2"/>
          <path d="M 215,220 L 225,245 L 235,220 Z" fill="#ffffff"/> <!-- White cravat -->
          <polygon points="220,224 230,224 228,235 222,235" fill="#38bdf8"/> <!-- Bowtie -->
          <!-- Gold Buttons -->
          <circle cx="225" cy="260" r="4" fill="#fbbf24"/>
          <circle cx="225" cy="285" r="4" fill="#fbbf24"/>
          <circle cx="225" cy="308" r="4" fill="#fbbf24"/>

          <!-- Ticking Golden Pocket Watch Rig on Chain -->
          <g class="pocket-watch-rig" filter="url(#rabbitGlow)">
            <!-- Gold Chain -->
            <path d="M 240,260 Q 320,240 335,200" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3,2"/>
            <!-- Watch Body -->
            <circle cx="340" cy="190" r="40" fill="url(#goldWatchGrad)" stroke="#78350f" stroke-width="3"/>
            <circle cx="340" cy="190" r="32" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/>
            <!-- Watch Top Ring -->
            <rect x="336" y="145" width="8" height="8" fill="#f59e0b"/>
            <circle cx="340" cy="144" r="7" fill="none" stroke="#f59e0b" stroke-width="2"/>
            <!-- Dial Marks & Numerals -->
            <text x="340" y="166" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="9" fill="#78350f" text-anchor="middle">XII</text>
            <text x="366" y="193" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="9" fill="#78350f" text-anchor="middle">III</text>
            <text x="340" y="218" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="9" fill="#78350f" text-anchor="middle">VI</text>
            <text x="316" y="193" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="9" fill="#78350f" text-anchor="middle">IX</text>
            <!-- Clock Hands -->
            <line x1="340" y1="190" x2="340" y2="170" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="340" y1="190" x2="356" y2="190" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
            <circle cx="340" cy="190" r="3" fill="#dc2626"/>
          </g>
        </svg>
      `;
    },

    /**
     * 3. Cheshire Cat in the Moonlight (Level 2 Focus)
     */
    renderCheshireCat() {
      return `
        <svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" class="alice-svg-art">
          <defs>
            <linearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#a5f3fc"/>
            </linearGradient>
            <linearGradient id="catStripe1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#c026d3"/>
              <stop offset="100%" stop-color="#7e22ce"/>
            </linearGradient>
            <linearGradient id="catStripe2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ec4899"/>
              <stop offset="100%" stop-color="#a21caf"/>
            </linearGradient>
            <filter id="cyanGrinGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Shadow -->
          <ellipse cx="250" cy="330" rx="160" ry="12" fill="rgba(0,0,0,0.5)"/>

          <!-- Glowing Moon Backdrop -->
          <circle cx="370" cy="100" r="65" fill="url(#moonGrad)" opacity="0.4" filter="drop-shadow(0 0 25px rgba(56,189,248,0.5))"/>

          <!-- Gnarly Arched Tree Branch -->
          <path d="M 20,290 C 120,280 200,240 320,250 C 390,255 450,230 490,220 L 490,260 C 430,280 370,295 300,285 C 190,280 120,330 20,330 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/>
          <path d="M 160,255 C 180,220 230,225 240,245" stroke="#475569" stroke-width="2" fill="none"/>

          <!-- Floating Purple & Cyan Aura Particles -->
          <circle cx="120" cy="180" r="4" fill="#38bdf8" opacity="0.6"/>
          <circle cx="160" cy="120" r="5" fill="#c084fc" opacity="0.7"/>
          <circle cx="340" cy="80" r="3" fill="#38bdf8" opacity="0.8"/>
          <circle cx="410" cy="180" r="4" fill="#c084fc" opacity="0.6"/>

          <!-- Cheshire Cat Body & Tail -->
          <!-- Striped Tail curving up -->
          <path d="M 330,240 C 420,230 460,160 410,120 C 380,95 365,130 380,150 C 400,175 360,210 310,235 Z" fill="url(#catStripe1)"/>
          <path d="M 395,125 C 385,115 375,130 382,145" stroke="url(#catStripe2)" stroke-width="12" fill="none"/>
          <path d="M 410,160 C 395,185 365,205 340,225" stroke="url(#catStripe2)" stroke-width="14" fill="none"/>

          <!-- Cat Body resting on branch -->
          <ellipse cx="240" cy="235" rx="85" ry="45" fill="url(#catStripe1)"/>
          <!-- Stripes on body -->
          <path d="M 190,205 Q 200,235 185,265" stroke="url(#catStripe2)" stroke-width="12" fill="none"/>
          <path d="M 230,195 Q 240,235 225,275" stroke="url(#catStripe2)" stroke-width="14" fill="none"/>
          <path d="M 270,198 Q 280,235 265,270" stroke="url(#catStripe2)" stroke-width="12" fill="none"/>

          <!-- Cat Head -->
          <ellipse cx="190" cy="170" rx="65" ry="50" fill="url(#catStripe1)"/>
          <!-- Cat Ears -->
          <polygon points="140,145 125,95 170,125" fill="url(#catStripe1)" stroke="#7e22ce" stroke-width="2"/>
          <polygon points="142,138 132,105 162,125" fill="#fda4af" opacity="0.8"/>
          <polygon points="215,125 250,95 240,145" fill="url(#catStripe1)" stroke="#7e22ce" stroke-width="2"/>
          <polygon points="220,125 242,105 235,138" fill="#fda4af" opacity="0.8"/>

          <!-- Glowing Yellow Cat Eyes -->
          <g class="cat-eye-glow">
            <ellipse cx="165" cy="155" rx="16" ry="12" fill="#facc15"/>
            <ellipse cx="215" cy="155" rx="16" ry="12" fill="#facc15"/>
            <!-- Slit Pupils -->
            <ellipse cx="165" cy="155" rx="3.5" ry="10" fill="#0f172a"/>
            <ellipse cx="215" cy="155" rx="3.5" ry="10" fill="#0f172a"/>
            <!-- Glint -->
            <circle cx="168" cy="150" r="2" fill="#ffffff"/>
            <circle cx="218" cy="150" r="2" fill="#ffffff"/>
          </g>

          <!-- Luminous Neon Cyan Grin with Sharp Teeth -->
          <g filter="url(#cyanGrinGlow)">
            <!-- Mouth outline -->
            <path d="M 130,175 Q 190,235 250,175 Q 190,195 130,175 Z" fill="#030712" stroke="#38bdf8" stroke-width="3.5"/>
            <!-- Upper Sharp Teeth -->
            <path d="M 145,180 L 152,192 L 160,182 L 168,194 L 178,183 L 188,196 L 200,183 L 210,194 L 220,182 L 228,192 L 235,180" stroke="#38bdf8" stroke-width="2" fill="#e0f2fe"/>
            <!-- Lower Sharp Teeth -->
            <path d="M 150,196 L 158,186 L 166,198 L 176,186 L 188,200 L 200,186 L 210,198 L 220,187 L 226,197" stroke="#38bdf8" stroke-width="2" fill="#e0f2fe"/>
          </g>
        </svg>
      `;
    },

    /**
     * 4. Mad Hatter's Tea Party (Level 3 Focus)
     */
    renderMadHatter() {
      return `
        <svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" class="alice-svg-art">
          <defs>
            <linearGradient id="hatGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#14532d"/>
              <stop offset="50%" stop-color="#052e16"/>
              <stop offset="100%" stop-color="#022c22"/>
            </linearGradient>
            <linearGradient id="teaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
            <filter id="hatGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Shadow -->
          <ellipse cx="250" cy="335" rx="160" ry="12" fill="rgba(0,0,0,0.5)"/>

          <!-- Tea Party Table with Checkered Cloth -->
          <path d="M 40,270 L 460,270 L 480,340 L 20,340 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
          <line x1="40" y1="270" x2="460" y2="270" stroke="#f59e0b" stroke-width="3"/>

          <!-- Left Side: Stacked Porcelain Teacups with Rising Steam -->
          <!-- Bottom Cup -->
          <ellipse cx="140" cy="270" rx="38" ry="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
          <path d="M 108,270 C 112,305 168,305 172,270 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
          <!-- Middle Cup -->
          <ellipse cx="140" cy="250" rx="32" ry="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <path d="M 114,250 C 118,280 162,280 166,250 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
          <!-- Top Cup tilted -->
          <g transform="rotate(-6 140 230)">
            <ellipse cx="140" cy="228" rx="28" ry="9" fill="#fef08a" stroke="#d97706" stroke-width="2"/>
            <path d="M 118,228 C 122,255 158,255 162,228 Z" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
            <!-- Tea Liquid -->
            <ellipse cx="140" cy="228" rx="22" ry="6" fill="url(#teaGrad)"/>
          </g>

          <!-- Animated Steam Paths -->
          <path d="M 135,210 Q 130,190 138,175 T 132,150" fill="none" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round" class="steam-particle-1"/>
          <path d="M 145,210 Q 152,190 144,175 T 150,150" fill="none" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round" class="steam-particle-2"/>
          <path d="M 152,215 Q 160,195 154,180 T 160,160" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-linecap="round" class="steam-particle-3"/>

          <!-- Golden Butter Knife on Table -->
          <polygon points="80,310 180,305 185,310 80,314" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>

          <!-- Center/Right: The Iconic Mad Hatter 10/6 Top Hat -->
          <g filter="url(#hatGlow)">
            <!-- Hat Brim -->
            <ellipse cx="320" cy="260" rx="95" ry="24" fill="#047857" stroke="#065f46" stroke-width="3"/>

            <!-- Hat Crown (Flared at Top) -->
            <path d="M 245,255 L 230,110 L 410,110 L 395,255 Z" fill="url(#hatGrad)" stroke="#10b981" stroke-width="3"/>
            <ellipse cx="320" cy="110" rx="90" ry="22" fill="#065f46" stroke="#10b981" stroke-width="2"/>

            <!-- Orange Silk Sash -->
            <path d="M 242,240 L 244,215 Q 320,230 396,215 L 398,240 Q 320,255 242,240 Z" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>

            <!-- 10/6 Price Slip tucked in sash -->
            <g transform="rotate(-12 360 210)">
              <rect x="345" y="165" width="45" height="55" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
              <text x="367" y="195" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="18" fill="#78350f" text-anchor="middle">10/6</text>
              <line x1="352" y1="202" x2="382" y2="202" stroke="#b45309" stroke-width="1.5"/>
            </g>

            <!-- Eccentric Feather in Hat -->
            <path d="M 245,220 Q 210,170 200,100 Q 230,140 242,190 Z" fill="#a855f7" stroke="#9333ea" stroke-width="1.5"/>
          </g>

          <!-- Golden Teapot on the right -->
          <path d="M 410,270 C 400,240 435,220 460,240 C 475,255 470,270 450,270 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <path d="M 460,240 Q 485,230 480,250" fill="none" stroke="#fbbf24" stroke-width="3"/> <!-- Spout -->
          <circle cx="435" cy="220" r="4" fill="#d97706"/>
        </svg>
      `;
    },

    /**
     * 5. Drink Me Vial & Eat Me Cake (Baseline Guarantee)
     */
    renderDrinkMeCake() {
      return `
        <svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" class="alice-svg-art">
          <defs>
            <linearGradient id="potionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="60%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
            <linearGradient id="icingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f472b6"/>
              <stop offset="100%" stop-color="#db2777"/>
            </linearGradient>
            <linearGradient id="cakeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#d97706"/>
            </linearGradient>
            <filter id="cyanPotionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Shadow -->
          <ellipse cx="250" cy="330" rx="160" ry="14" fill="rgba(0,0,0,0.5)"/>

          <!-- LEFT: "DRINK ME" Glass Potion Bottle -->
          <g filter="url(#cyanPotionGlow)">
            <!-- Glass Bottle Body -->
            <path d="M 155,150 L 175,150 L 175,175 C 175,185 215,200 215,245 C 215,285 180,305 145,305 C 110,305 75,285 75,245 C 75,200 115,185 115,175 L 115,150 Z" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.6)" stroke-width="3"/>

            <!-- Glowing Cyan Liquid -->
            <path d="M 82,245 C 82,280 112,298 145,298 C 178,298 208,280 208,245 C 208,225 185,215 145,215 C 105,215 82,225 82,245 Z" fill="url(#potionGrad)"/>
            <ellipse cx="145" cy="215" rx="55" ry="12" fill="#7dd3fc" opacity="0.75"/>

            <!-- Bubbles in liquid -->
            <circle cx="120" cy="260" r="4" fill="#ffffff" opacity="0.6"/>
            <circle cx="160" cy="245" r="5" fill="#ffffff" opacity="0.7"/>
            <circle cx="135" cy="235" r="3" fill="#ffffff" opacity="0.8"/>

            <!-- Bottle Neck & Cork Stopper -->
            <rect x="110" y="145" width="70" height="10" rx="3" fill="rgba(255,255,255,0.4)"/>
            <polygon points="120,145 170,145 165,120 125,120" fill="#b45309" stroke="#78350f" stroke-width="2"/>

            <!-- Handwritten "DRINK ME" Parchment Tag -->
            <line x1="145" y1="155" x2="165" y2="190" stroke="#fef08a" stroke-width="2"/>
            <g transform="rotate(14 165 190)">
              <rect x="150" y="175" width="70" height="38" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
              <text x="185" y="198" font-family="'Segoe UI', cursive, sans-serif" font-weight="900" font-size="11" fill="#78350f" text-anchor="middle" letter-spacing="1">DRINK ME</text>
            </g>
          </g>

          <!-- RIGHT: "EAT ME" Iced Cupcake -->
          <g>
            <!-- Golden Scalloped Wrapper -->
            <path d="M 310,230 L 330,305 L 430,305 L 450,230 Z" fill="url(#cakeGrad)" stroke="#b45309" stroke-width="2"/>
            <!-- Wrapper Ridges -->
            <line x1="345" y1="230" x2="355" y2="305" stroke="#b45309" stroke-width="1.5"/>
            <line x1="380" y1="230" x2="380" y2="305" stroke="#b45309" stroke-width="1.5"/>
            <line x1="415" y1="230" x2="405" y2="305" stroke="#b45309" stroke-width="1.5"/>

            <!-- Swirled Pink Icing Mound -->
            <path d="M 300,230 C 290,205 340,185 360,200 C 370,175 420,180 430,205 C 455,205 465,225 450,235 Z" fill="url(#icingGrad)" stroke="#be185d" stroke-width="2"/>
            <circle cx="380" cy="170" r="18" fill="#ec4899"/>
            <circle cx="380" cy="155" r="10" fill="#f472b6"/>

            <!-- Colorful Sprinkles -->
            <line x1="330" y1="210" x2="340" y2="215" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
            <line x1="365" y1="185" x2="375" y2="182" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
            <line x1="410" y1="215" x2="418" y2="210" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
            <line x1="390" y1="205" x2="398" y2="212" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>

            <!-- "EAT ME" Sugar Lettering Banner -->
            <rect x="335" y="240" width="90" height="30" rx="8" fill="#ffffff" stroke="#ec4899" stroke-width="2"/>
            <text x="380" y="261" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="13" fill="#be185d" text-anchor="middle" letter-spacing="1.5">EAT ME</text>
          </g>
        </svg>
      `;
    }
  };

  /**
   * APPLICATION STATE MANAGER
   */
  class AliceQuestApp {
    constructor() {
      this.data = root.ALICE_QUEST_DATA;
      this.quests = this.data.quests;
      this.currentCardIndex = 0;
      this.currentFilter = 'all'; // 'all', 'level1', 'level2', 'level3', 'baseline'
      this.filteredCards = [...Array(this.quests.length).keys()];
      this.viewMode = 'slide'; // 'slide' or 'grid'

      // Classroom Roster Storage
      this.rosterStorageKey = 'ALICE_QUEST_ROSTER_V1';
      this.roster = this.loadRoster();
      this.selectedStudentId = this.roster.length > 0 ? this.roster[0].id : null;

      // Audio & Speech status
      this.isSpeaking = false;
    }

    /**
     * Load Roster: checks platform store, localStorage, or defaults
     */
    loadRoster() {
      // 1. Check parent store if running embedded
      try {
        if (window.parent && window.parent.store && typeof window.parent.store.getStudents === 'function') {
          const parentStudents = window.parent.store.getStudents();
          if (Array.isArray(parentStudents) && parentStudents.length > 0) {
            return parentStudents.map(s => ({
              id: s.id,
              name: (s.firstName ? (s.firstName + ' ' + (s.lastName || '')) : (s.name || 'Student')).trim(),
              level: s.level ? `Lv ${s.level}` : 'Explorer',
              xp: parseInt(s.xp, 10) || 0,
              avatar: s.avatar || (s.gender === 'female' ? '👧' : '👦')
            }));
          }
        }
      } catch (err) {
        console.warn('[AliceQuest] Parent store read omitted:', err);
      }

      // 2. Check localStorage
      try {
        const saved = localStorage.getItem(this.rosterStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('[AliceQuest] LocalStorage read failed:', err);
      }

      // 3. Fallback to default data
      return JSON.parse(JSON.stringify(this.data.defaultRoster));
    }

    saveRoster() {
      try {
        localStorage.setItem(this.rosterStorageKey, JSON.stringify(this.roster));
      } catch (err) {
        console.warn('[AliceQuest] LocalStorage write failed:', err);
      }
    }

    init() {
      this.applyFilter(this.currentFilter);
      this.render();
      this.setupKeyboard();

      // First click audio unlock
      const unlockAudio = () => {
        if (root.aliceAudio) {
          root.aliceAudio.init();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
      window.addEventListener('touchstart', unlockAudio);
    }

    setupKeyboard() {
      window.addEventListener('keydown', (e) => {
        // Avoid intercepting when typing in inputs
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.nextCard();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevCard();
        } else if (e.key.toLowerCase() === 'v') {
          this.toggleViewMode();
        } else if (e.key.toLowerCase() === 'f') {
          this.toggleFullscreen();
        }
      });
    }

    applyFilter(filterType) {
      this.currentFilter = filterType;
      if (filterType === 'all') {
        this.filteredCards = [...Array(this.quests.length).keys()];
      } else {
        this.filteredCards = [];
        this.quests.forEach((q, idx) => {
          if (q.tier === filterType) {
            this.filteredCards.push(idx);
          }
        });
      }

      // Ensure currentCardIndex is valid within filtered subset
      if (!this.filteredCards.includes(this.currentCardIndex)) {
        this.currentCardIndex = this.filteredCards.length > 0 ? this.filteredCards[0] : 0;
      }

      if (root.aliceAudio) {
        root.aliceAudio.playChime();
      }
      this.render();
    }

    nextCard() {
      const currentPos = this.filteredCards.indexOf(this.currentCardIndex);
      if (currentPos < this.filteredCards.length - 1) {
        this.currentCardIndex = this.filteredCards[currentPos + 1];
        if (root.aliceAudio) root.aliceAudio.playPageTurn();
        this.render();
      }
    }

    prevCard() {
      const currentPos = this.filteredCards.indexOf(this.currentCardIndex);
      if (currentPos > 0) {
        this.currentCardIndex = this.filteredCards[currentPos - 1];
        if (root.aliceAudio) root.aliceAudio.playPageTurn();
        this.render();
      }
    }

    goToCard(index) {
      if (index >= 0 && index < this.quests.length) {
        this.currentCardIndex = index;
        if (this.viewMode === 'grid') {
          this.viewMode = 'slide';
        }
        if (root.aliceAudio) root.aliceAudio.playPageTurn();
        this.render();
      }
    }

    toggleViewMode() {
      this.viewMode = this.viewMode === 'slide' ? 'grid' : 'slide';
      if (root.aliceAudio) root.aliceAudio.playChime();
      this.render();
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('[AliceQuest] Fullscreen failed:', err);
        });
      } else {
        document.exitFullscreen().catch(err => {
          console.warn('[AliceQuest] Exit fullscreen failed:', err);
        });
      }
    }

    /**
     * Text-To-Speech Narration Handler
     */
    listenToCurrentChallenge() {
      const quest = this.quests[this.currentCardIndex];
      if (!quest || !root.aliceAudio) return;

      const btn = document.getElementById('btn-listen-challenge');
      if (btn) btn.classList.add('speaking');

      const speechText = `${quest.title}. ${quest.promptTTS} For example: ${quest.scaffold}`;
      root.aliceAudio.speakChallenge(
        speechText,
        () => {
          if (btn) btn.classList.add('speaking');
        },
        () => {
          if (btn) btn.classList.remove('speaking');
        }
      );
    }

    /**
     * Award XP to Selected Student
     */
    awardXPToSelectedStudent() {
      const quest = this.quests[this.currentCardIndex];
      if (!quest) return;

      if (!this.selectedStudentId) {
        if (root.aliceAudio) root.aliceAudio.playSoftFail();
        this.showToast('⚠️ Please select a student from the dropdown first!', 'warning');
        return;
      }

      const student = this.roster.find(s => s.id === this.selectedStudentId);
      if (!student) {
        if (root.aliceAudio) root.aliceAudio.playSoftFail();
        this.showToast('⚠️ Student not found in roster!', 'warning');
        return;
      }

      // Add points
      const amount = quest.xp;
      student.xp = (parseInt(student.xp, 10) || 0) + amount;
      this.saveRoster();

      // Trigger Fanfare audio
      if (root.aliceAudio) {
        root.aliceAudio.playAwardFanfare();
      }

      // Sync with parent AdventureAcademy hub if accessible
      const awardPayload = {
        studentId: student.id,
        amount: amount,
        source: `Alice Quest: ${quest.title}`,
        category: 'Literature & Speaking',
        timestamp: new Date().toISOString()
      };

      try {
        if (window.parent && window.parent.AdventureAcademy && typeof window.parent.AdventureAcademy.awardXP === 'function') {
          window.parent.AdventureAcademy.awardXP(awardPayload);
        } else if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
          root.AdventureAcademy.awardXP(awardPayload);
        }
      } catch (err) {
        console.warn('[AliceQuest] AdventureAcademy.awardXP dispatch omitted:', err);
      }

      // Custom window event for reactive components
      window.dispatchEvent(new CustomEvent('adventure:awardXP', { detail: awardPayload }));

      // Display floating success toast
      this.showToast(`🎉 +${amount} XP Awarded to ${student.name}! (${quest.title})`);

      // Update UI elements
      this.updateStudentXPBadge();
      this.updateRosterDropdownLabels();
    }

    showToast(message, type = 'success') {
      const toast = document.getElementById('alice-toast');
      if (!toast) return;

      toast.textContent = message;
      toast.className = 'alice-toast show' + (type === 'warning' ? ' warning' : '');

      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    addNewStudentPrompt() {
      const modal = document.getElementById('alice-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="modal-header">
          <h3>➕ Add Student to Roster</h3>
          <p>Register a new adventurer for Alice in Wonderland XP quests.</p>
        </div>
        <form onsubmit="window.aliceApp.handleNewStudentSubmit(event)">
          <input type="text" id="new-student-name" class="modal-input-field" placeholder="Student First & Last Name..." required autofocus>
          <input type="text" id="new-student-grade" class="modal-input-field" placeholder="Grade / Class (e.g. Grade 4)..." value="Grade 4">
          <button type="submit" class="modal-submit-btn">✨ Add Adventurer</button>
        </form>
      `;

      modal.style.display = 'flex';
      setTimeout(() => {
        const input = document.getElementById('new-student-name');
        if (input) input.focus();
      }, 50);
    }

    handleNewStudentSubmit(e) {
      e.preventDefault();
      const nameInput = document.getElementById('new-student-name');
      const gradeInput = document.getElementById('new-student-grade');
      if (!nameInput || !nameInput.value.trim()) return;

      const newId = 's-' + Date.now();
      const newStudent = {
        id: newId,
        name: nameInput.value.trim(),
        grade: gradeInput.value.trim() || 'Grade 4',
        level: 'Lv 1 Explorer',
        xp: 0,
        avatar: '🧒'
      };

      this.roster.push(newStudent);
      this.saveRoster();
      this.selectedStudentId = newId;

      this.closeModal();
      if (root.aliceAudio) root.aliceAudio.playAwardFanfare();
      this.showToast(`✨ ${newStudent.name} registered to Alice Quest Roster!`);
      this.render();
    }

    closeModal() {
      const modal = document.getElementById('alice-modal');
      if (modal) modal.style.display = 'none';
    }

    updateStudentXPBadge() {
      const badge = document.getElementById('student-xp-display');
      if (!badge) return;
      const student = this.roster.find(s => s.id === this.selectedStudentId);
      if (student) {
        badge.innerHTML = `<span>⚡</span> ${student.xp} XP`;
      }
    }

    updateRosterDropdownLabels() {
      const select = document.getElementById('student-select-input');
      if (!select) return;
      Array.from(select.options).forEach(opt => {
        const s = this.roster.find(item => item.id === opt.value);
        if (s) {
          opt.textContent = `${s.avatar || '👤'} ${s.name} (${s.xp} XP)`;
        }
      });
    }

    getVectorArtwork(type) {
      switch (type) {
        case 'rabbit':
          return AliceArtwork.renderWhiteRabbit();
        case 'cheshire':
          return AliceArtwork.renderCheshireCat();
        case 'hatter':
          return AliceArtwork.renderMadHatter();
        case 'drink-me':
        default:
          return AliceArtwork.renderDrinkMeCake();
      }
    }

    /**
     * MAIN RENDER DISPATCHER
     */
    render() {
      const container = document.getElementById('alice-main-viewport');
      if (!container) return;

      // Update Filter Bar Buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const fType = btn.getAttribute('data-filter');
        btn.classList.toggle('active', fType === this.currentFilter);
      });

      // Update HUD progress pill
      const progressPill = document.getElementById('hud-progress-pill');
      if (progressPill) {
        const currentPos = this.filteredCards.indexOf(this.currentCardIndex) + 1;
        progressPill.textContent = `Quest ${currentPos > 0 ? currentPos : 1} of ${this.filteredCards.length}`;
      }

      if (this.viewMode === 'grid') {
        container.innerHTML = this.renderGridViewHTML();
      } else {
        container.innerHTML = this.renderSlideViewHTML();
      }
    }

    /**
     * Slide View HTML (Smartboard Interactive Card Mode)
     */
    renderSlideViewHTML() {
      const quest = this.quests[this.currentCardIndex];
      const tierInfo = this.data.tiers[quest.tier] || this.data.tiers.level1;
      const currentPos = this.filteredCards.indexOf(this.currentCardIndex);
      const isFirst = currentPos === 0;
      const isLast = currentPos === this.filteredCards.length - 1;

      const selectedStudent = this.roster.find(s => s.id === this.selectedStudentId) || (this.roster[0] || null);

      return `
        <div class="slide-viewport">

          <!-- The Central Cyber-Storybook Quest Card -->
          <article class="quest-card-stage tier-${quest.tier}">
            
            <!-- Left Column: Vector Illustration Stage -->
            <div class="card-visual-column">
              <div class="character-role-chip">
                <span>🎭</span> <span>${tierInfo.characterTheme}</span>
              </div>
              <div class="svg-artwork-container">
                ${this.getVectorArtwork(quest.illustrationType)}
              </div>
            </div>

            <!-- Right Column: Briefing, Instructions & Speech Bubble -->
            <div class="card-content-column">
              
              <div>
                <div class="card-header-bar">
                  <span class="card-tier-pill tier-pill-${quest.tier}">
                    ✦ ${quest.levelLabel}
                  </span>
                  <div class="card-xp-badge">
                    <span>+${quest.xp}</span> <span>XP</span>
                  </div>
                </div>

                <div class="quest-title-block" style="margin-top: 14px;">
                  <h2>${quest.title}</h2>
                  <p class="quest-tagline">${quest.tagline}</p>
                </div>
              </div>

              <!-- Bulleted Instructions -->
              <div class="quest-instructions-box">
                <h3><span>📋</span> Challenge Steps:</h3>
                <ul class="instructions-list">
                  ${quest.instructions.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>

              <!-- Speaking Frame / Sentence Starter Bubble -->
              <div class="scaffold-box">
                <div class="scaffold-label">🗣️ Speaking Frame / Model Response:</div>
                <div class="scaffold-text">"${quest.scaffold}"</div>
              </div>

              <!-- Listen to Challenge TTS Button -->
              <button id="btn-listen-challenge" class="listen-challenge-btn" onclick="window.aliceApp.listenToCurrentChallenge()" title="Listen to challenge read aloud">
                <span>🔊</span> <span>Listen to Challenge</span>
              </button>

            </div>
          </article>

          <!-- Presentation Deck Navigation Controls -->
          <nav class="deck-navigation-bar" aria-label="Deck Navigation">
            <button class="nav-arrow-btn" onclick="window.aliceApp.prevCard()" ${isFirst ? 'disabled' : ''} title="Previous Challenge (ArrowLeft)">
              ⬅️ <span>Previous</span>
            </button>

            <!-- Card Indicator Dots Strip -->
            <div class="nav-dots-strip">
              ${this.filteredCards.map((cardIdx, dotIdx) => `
                <button class="nav-dot ${cardIdx === this.currentCardIndex ? 'active' : ''}" 
                  onclick="window.aliceApp.goToCard(${cardIdx})" 
                  title="Go to Quest ${dotIdx + 1}">
                </button>
              `).join('')}
            </div>

            <button class="nav-arrow-btn" onclick="window.aliceApp.nextCard()" ${isLast ? 'disabled' : ''} title="Next Challenge (ArrowRight)">
              <span>Next</span> ➡️
            </button>
          </nav>

          <!-- Integrated Teacher Grading & XP Award Dock -->
          <section class="teacher-award-dock">
            <div class="dock-left-group">
              <div class="dock-title">
                <span>🎓</span> <span>Gradebook Award Dock</span>
              </div>

              <!-- Student Selector Dropdown -->
              <div class="student-select-wrapper">
                <select id="student-select-input" class="student-select" onchange="window.aliceApp.handleStudentSelectChange(this.value)">
                  ${this.roster.map(s => `
                    <option value="${s.id}" ${s.id === this.selectedStudentId ? 'selected' : ''}>
                      ${s.avatar || '👤'} ${s.name} (${s.xp} XP)
                    </option>
                  `).join('')}
                </select>
                <span class="student-select-icon">▼</span>
              </div>

              <!-- Live Student XP Count -->
              <div id="student-xp-display" class="student-current-xp-badge" title="Active Student Balance">
                <span>⚡</span> ${selectedStudent ? selectedStudent.xp : 0} XP
              </div>

              <!-- Quick Add Student Button -->
              <button class="add-student-btn" onclick="window.aliceApp.addNewStudentPrompt()" title="Register a new student">
                <span>➕</span> <span>New Student</span>
              </button>
            </div>

            <!-- Big Award XP Button -->
            <button class="award-xp-btn" onclick="window.aliceApp.awardXPToSelectedStudent()" title="Award +${quest.xp} XP to selected student">
              <span>🎉</span> <span>Award +${quest.xp} XP</span>
            </button>
          </section>

        </div>
      `;
    }

    handleStudentSelectChange(newId) {
      this.selectedStudentId = newId;
      this.updateStudentXPBadge();
    }

    /**
     * Grid Gallery View HTML (Full-Classroom Overview Mode)
     */
    renderGridViewHTML() {
      return `
        <div class="grid-gallery-viewport">
          ${this.filteredCards.map(cardIdx => {
            const q = this.quests[cardIdx];
            return `
              <div class="grid-card-item tier-${q.tier}" onclick="window.aliceApp.goToCard(${cardIdx})">
                <div class="grid-card-header">
                  <span class="card-tier-pill tier-pill-${q.tier}">${q.levelLabel}</span>
                  <span class="grid-card-xp">+${q.xp} XP</span>
                </div>
                <h3>${q.title}</h3>
                <p>${q.tagline}</p>
                <div class="grid-card-footer">
                  <span style="font-size: 1.2rem;">${q.icon || '📖'}</span>
                  <span class="grid-inspect-label">Open Slide ➜</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  // Instantiate application
  root.aliceApp = new AliceQuestApp();

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => root.aliceApp.init());
  } else {
    root.aliceApp.init();
  }

})(typeof window !== 'undefined' ? window : global);
