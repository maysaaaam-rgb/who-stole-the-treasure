/**
 * monsterRenderer.js - Professional Slot-Based Cartoon Character Rendering Engine
 * "Build Your Own Monster!"
 *
 * Architecture:
 * 1. 8 Hand-Designed Base Monster Characters (Round, Tall, Short, Wide, Blob, Ghost, Dino, Robot).
 * 2. Fixed Semantic Attachment Slots for every base monster:
 *    - faceBounds, eyeSlots (1, 2, 3, 4, many), noseSlot, mouthSlot
 *    - earSlots (left, right, upperLeft, upperRight)
 *    - hornSlots (left, right, center)
 *    - shoulderSlots (left, right, extraLeft, extraRight)
 *    - legSlots (left, right, center, outerLeft, outerRight)
 *    - hatSlot, glassesSlot, neckSlot, capeAnchor, wingAnchors, tailAnchor
 * 3. Unified MOUTH + TEETH components (teeth never float).
 * 4. Complete ARM components (shoulder joint + limb + hand).
 * 5. Complete LEG components (hip joint + leg column + foot).
 * 6. Body-specific clothing fits + Full outfit rule.
 */

class MonsterRenderer {
  constructor() {
    this.colorPalettes = {
      purple: { main: '#a855f7', belly: '#f3e8ff', dark: '#6b21a8', stroke: '#3b0764', highlight: '#c084fc', blush: '#d8b4fe' },
      green:  { main: '#22c55e', belly: '#dcfce7', dark: '#15803d', stroke: '#14532d', highlight: '#4ade80', blush: '#86efac' },
      blue:   { main: '#0ea5e9', belly: '#e0f2fe', dark: '#0369a1', stroke: '#0c4a6e', highlight: '#38bdf8', blush: '#7dd3fc' },
      red:    { main: '#f43f5e', belly: '#ffe4e6', dark: '#be123c', stroke: '#881337', highlight: '#fb7185', blush: '#fda4af' },
      orange: { main: '#f97316', belly: '#ffedd5', dark: '#c2410c', stroke: '#7c2d12', highlight: '#fb923c', blush: '#fdba74' },
      yellow: { main: '#eab308', belly: '#fef9c3', dark: '#a16207', stroke: '#713f12', highlight: '#fde047', blush: '#fef08a' },
      pink:   { main: '#ec4899', belly: '#fce7f3', dark: '#be185d', stroke: '#831843', highlight: '#f472b6', blush: '#f9a8d4' },
      black:  { main: '#334155', belly: '#94a3b8', dark: '#0f172a', stroke: '#020617', highlight: '#64748b', blush: '#475569' },
      white:  { main: '#f8fafc', belly: '#cbd5e1', dark: '#94a3b8', stroke: '#334155', highlight: '#ffffff', blush: '#e2e8f0' }
    };

    this.clothingColors = {
      blue:   '#2563eb',
      red:    '#dc2626',
      green:  '#16a34a',
      yellow: '#eab308',
      purple: '#9333ea',
      orange: '#ea580c',
      pink:   '#db2777',
      black:  '#1e293b',
      white:  '#f8fafc'
    };

    // Define Base Character Models with Fixed Semantic Attachment Slots
    this.baseModels = {
      round: {
        name: 'round',
        headPath: 'M 200,80 C 255,80 278,105 278,142 C 278,178 255,200 200,200 C 145,200 122,178 122,142 C 122,105 145,80 200,80 Z',
        neckPath: 'M 165,190 L 235,190 L 245,215 L 155,215 Z',
        torsoPath: 'M 200,210 C 265,210 288,245 288,290 C 288,340 265,362 200,362 C 135,362 112,340 112,290 C 112,245 135,210 200,210 Z',
        bellyPath: 'M 200,235 C 240,235 255,260 255,295 C 255,335 240,350 200,350 C 160,350 145,335 145,295 C 145,260 160,235 200,235 Z',
        cheeks: [{ cx: 148, cy: 158 }, { cx: 252, cy: 158 }],
        slots: {
          eye_1: [{ x: 200, y: 130 }],
          eye_2: [{ x: 168, y: 130 }, { x: 232, y: 130 }],
          eye_3: [{ x: 146, y: 134 }, { x: 200, y: 122 }, { x: 254, y: 134 }],
          eye_4: [{ x: 150, y: 122 }, { x: 182, y: 118 }, { x: 218, y: 118 }, { x: 250, y: 122 }],
          eye_many: [{ x: 144, y: 134 }, { x: 172, y: 122 }, { x: 200, y: 138 }, { x: 228, y: 122 }, { x: 256, y: 134 }],
          nose: { x: 200, y: 154 },
          mouth: { x: 200, y: 176 },
          earLeft: { x: 124, y: 132, rot: -26 },
          earRight: { x: 276, y: 132, rot: 26 },
          earUpL: { x: 135, y: 104, rot: -34 },
          earUpR: { x: 265, y: 104, rot: 34 },
          hornL: { x: 165, y: 84, rot: -20 },
          hornR: { x: 235, y: 84, rot: 20 },
          hornCenter: { x: 200, y: 80, rot: 0 },
          hornOuterL: { x: 150, y: 92, rot: -30 },
          hornOuterR: { x: 250, y: 92, rot: 30 },
          hat: { x: 200, y: 82 },
          glasses: { x: 200, y: 130 },
          neck: { x: 200, y: 205 },
          shoulderL: { x: 116, y: 230 },
          shoulderR: { x: 284, y: 230 },
          extraArmL: { x: 120, y: 275 },
          extraArmR: { x: 280, y: 275 },
          legL: { x: 155, y: 355 },
          legR: { x: 245, y: 355 },
          legCenter: { x: 200, y: 360 },
          legOuterL: { x: 128, y: 350 },
          legOuterR: { x: 272, y: 350 },
          wingL: { x: 135, y: 220 },
          wingR: { x: 265, y: 220 },
          tail: { x: 135, y: 335 },
          shadowRx: 110
        }
      },

      tall: {
        name: 'tall',
        headPath: 'M 200,70 C 242,70 262,95 262,130 C 262,165 242,185 200,185 C 158,185 138,165 138,130 C 138,95 158,70 200,70 Z',
        neckPath: 'M 172,175 L 228,175 L 235,198 L 165,198 Z',
        torsoPath: 'M 200,195 C 248,195 265,240 265,300 C 265,355 245,378 200,378 C 155,378 135,355 135,300 C 135,240 152,195 200,195 Z',
        bellyPath: 'M 200,225 C 230,225 242,255 242,295 C 242,345 230,365 200,365 C 170,365 158,345 158,295 C 158,255 170,225 200,225 Z',
        cheeks: [{ cx: 156, cy: 148 }, { cx: 244, cy: 148 }],
        slots: {
          eye_1: [{ x: 200, y: 118 }],
          eye_2: [{ x: 172, y: 118 }, { x: 228, y: 118 }],
          eye_3: [{ x: 154, y: 122 }, { x: 200, y: 110 }, { x: 246, y: 122 }],
          eye_4: [{ x: 158, y: 112 }, { x: 186, y: 108 }, { x: 214, y: 108 }, { x: 242, y: 112 }],
          eye_many: [{ x: 152, y: 122 }, { x: 176, y: 110 }, { x: 200, y: 126 }, { x: 224, y: 110 }, { x: 248, y: 122 }],
          nose: { x: 200, y: 140 },
          mouth: { x: 200, y: 162 },
          earLeft: { x: 140, y: 122, rot: -26 },
          earRight: { x: 260, y: 122, rot: 26 },
          earUpL: { x: 150, y: 92, rot: -34 },
          earUpR: { x: 250, y: 92, rot: 34 },
          hornL: { x: 170, y: 74, rot: -20 },
          hornR: { x: 230, y: 74, rot: 20 },
          hornCenter: { x: 200, y: 70, rot: 0 },
          hornOuterL: { x: 156, y: 82, rot: -30 },
          hornOuterR: { x: 244, y: 82, rot: 30 },
          hat: { x: 200, y: 72 },
          glasses: { x: 200, y: 118 },
          neck: { x: 200, y: 190 },
          shoulderL: { x: 136, y: 210 },
          shoulderR: { x: 264, y: 210 },
          extraArmL: { x: 138, y: 265 },
          extraArmR: { x: 262, y: 265 },
          legL: { x: 165, y: 372 },
          legR: { x: 235, y: 372 },
          legCenter: { x: 200, y: 376 },
          legOuterL: { x: 142, y: 368 },
          legOuterR: { x: 258, y: 368 },
          wingL: { x: 145, y: 210 },
          wingR: { x: 255, y: 210 },
          tail: { x: 145, y: 350 },
          shadowRx: 85
        }
      },

      short: {
        name: 'short',
        headPath: 'M 200,90 C 265,90 286,115 286,155 C 286,192 265,212 200,212 C 135,212 114,192 114,155 C 114,115 135,90 200,90 Z',
        neckPath: 'M 160,200 L 240,200 L 250,222 L 150,222 Z',
        torsoPath: 'M 200,218 C 270,218 292,250 292,285 C 292,325 270,342 200,342 C 130,342 108,325 108,285 C 108,250 130,218 200,218 Z',
        bellyPath: 'M 200,240 C 245,240 262,265 262,290 C 262,320 245,332 200,332 C 155,332 138,320 138,290 C 138,265 155,240 200,240 Z',
        cheeks: [{ cx: 142, cy: 172 }, { cx: 258, cy: 172 }],
        slots: {
          eye_1: [{ x: 200, y: 142 }],
          eye_2: [{ x: 164, y: 142 }, { x: 236, y: 142 }],
          eye_3: [{ x: 142, y: 146 }, { x: 200, y: 134 }, { x: 258, y: 146 }],
          eye_4: [{ x: 146, y: 134 }, { x: 180, y: 130 }, { x: 220, y: 130 }, { x: 254, y: 134 }],
          eye_many: [{ x: 140, y: 146 }, { x: 170, y: 134 }, { x: 200, y: 150 }, { x: 230, y: 134 }, { x: 260, y: 146 }],
          nose: { x: 200, y: 166 },
          mouth: { x: 200, y: 188 },
          earLeft: { x: 116, y: 145, rot: -26 },
          earRight: { x: 284, y: 145, rot: 26 },
          earUpL: { x: 126, y: 112, rot: -34 },
          earUpR: { x: 274, y: 112, rot: 34 },
          hornL: { x: 162, y: 94, rot: -20 },
          hornR: { x: 238, y: 94, rot: 20 },
          hornCenter: { x: 200, y: 90, rot: 0 },
          hornOuterL: { x: 146, y: 102, rot: -30 },
          hornOuterR: { x: 254, y: 102, rot: 30 },
          hat: { x: 200, y: 92 },
          glasses: { x: 200, y: 142 },
          neck: { x: 200, y: 212 },
          shoulderL: { x: 112, y: 235 },
          shoulderR: { x: 288, y: 235 },
          extraArmL: { x: 114, y: 275 },
          extraArmR: { x: 286, y: 275 },
          legL: { x: 155, y: 336 },
          legR: { x: 245, y: 336 },
          legCenter: { x: 200, y: 340 },
          legOuterL: { x: 124, y: 332 },
          legOuterR: { x: 276, y: 332 },
          wingL: { x: 130, y: 228 },
          wingR: { x: 270, y: 228 },
          tail: { x: 130, y: 318 },
          shadowRx: 115
        }
      },

      wide: {
        name: 'wide',
        headPath: 'M 200,80 C 275,80 298,105 298,144 C 298,180 275,202 200,202 C 125,202 102,180 102,144 C 102,105 125,80 200,80 Z',
        neckPath: 'M 155,190 L 245,190 L 255,215 L 145,215 Z',
        torsoPath: 'M 200,210 C 285,210 308,245 308,290 C 308,340 285,362 200,362 C 115,362 92,340 92,290 C 92,245 115,210 200,210 Z',
        bellyPath: 'M 200,235 C 255,235 272,260 272,295 C 272,335 255,350 200,350 C 145,350 128,335 128,295 C 128,260 145,235 200,235 Z',
        cheeks: [{ cx: 138, cy: 160 }, { cx: 262, cy: 160 }],
        slots: {
          eye_1: [{ x: 200, y: 132 }],
          eye_2: [{ x: 162, y: 132 }, { x: 238, y: 132 }],
          eye_3: [{ x: 138, y: 136 }, { x: 200, y: 124 }, { x: 262, y: 136 }],
          eye_4: [{ x: 142, y: 124 }, { x: 178, y: 120 }, { x: 222, y: 120 }, { x: 258, y: 124 }],
          eye_many: [{ x: 136, y: 136 }, { x: 168, y: 124 }, { x: 200, y: 140 }, { x: 232, y: 124 }, { x: 264, y: 136 }],
          nose: { x: 200, y: 156 },
          mouth: { x: 200, y: 178 },
          earLeft: { x: 104, y: 134, rot: -26 },
          earRight: { x: 296, y: 134, rot: 26 },
          earUpL: { x: 118, y: 102, rot: -34 },
          earUpR: { x: 282, y: 102, rot: 34 },
          hornL: { x: 162, y: 84, rot: -20 },
          hornR: { x: 238, y: 84, rot: 20 },
          hornCenter: { x: 200, y: 80, rot: 0 },
          hornOuterL: { x: 142, y: 92, rot: -30 },
          hornOuterR: { x: 258, y: 92, rot: 30 },
          hat: { x: 200, y: 82 },
          glasses: { x: 200, y: 132 },
          neck: { x: 200, y: 205 },
          shoulderL: { x: 96, y: 230 },
          shoulderR: { x: 304, y: 230 },
          extraArmL: { x: 100, y: 275 },
          extraArmR: { x: 300, y: 275 },
          legL: { x: 150, y: 355 },
          legR: { x: 250, y: 355 },
          legCenter: { x: 200, y: 360 },
          legOuterL: { x: 118, y: 350 },
          legOuterR: { x: 282, y: 350 },
          wingL: { x: 120, y: 220 },
          wingR: { x: 280, y: 220 },
          tail: { x: 120, y: 335 },
          shadowRx: 125
        }
      },

      blob: {
        name: 'blob',
        headPath: 'M 200,75 C 265,68 288,105 282,144 C 276,182 255,200 200,200 C 145,200 124,182 118,144 C 112,105 135,68 200,75 Z',
        neckPath: 'M 160,190 L 240,190 L 248,215 L 152,215 Z',
        torsoPath: 'M 200,210 C 275,205 298,245 292,295 C 286,345 260,365 200,365 C 140,365 114,345 108,295 C 102,245 125,205 200,210 Z',
        bellyPath: 'M 200,235 C 248,232 260,260 256,298 C 252,336 238,352 200,352 C 162,352 148,336 144,298 C 140,260 152,232 200,235 Z',
        cheeks: [{ cx: 145, cy: 158 }, { cx: 255, cy: 158 }],
        slots: {
          eye_1: [{ x: 200, y: 130 }],
          eye_2: [{ x: 168, y: 130 }, { x: 232, y: 130 }],
          eye_3: [{ x: 146, y: 134 }, { x: 200, y: 122 }, { x: 254, y: 134 }],
          eye_4: [{ x: 150, y: 122 }, { x: 182, y: 118 }, { x: 218, y: 118 }, { x: 250, y: 122 }],
          eye_many: [{ x: 144, y: 134 }, { x: 172, y: 122 }, { x: 200, y: 138 }, { x: 228, y: 122 }, { x: 256, y: 134 }],
          nose: { x: 200, y: 154 },
          mouth: { x: 200, y: 176 },
          earLeft: { x: 120, y: 132, rot: -26 },
          earRight: { x: 280, y: 132, rot: 26 },
          earUpL: { x: 130, y: 100, rot: -34 },
          earUpR: { x: 270, y: 100, rot: 34 },
          hornL: { x: 165, y: 80, rot: -20 },
          hornR: { x: 235, y: 80, rot: 20 },
          hornCenter: { x: 200, y: 75, rot: 0 },
          hornOuterL: { x: 148, y: 88, rot: -30 },
          hornOuterR: { x: 252, y: 88, rot: 30 },
          hat: { x: 200, y: 78 },
          glasses: { x: 200, y: 130 },
          neck: { x: 200, y: 205 },
          shoulderL: { x: 112, y: 230 },
          shoulderR: { x: 288, y: 230 },
          extraArmL: { x: 116, y: 275 },
          extraArmR: { x: 284, y: 275 },
          legL: { x: 155, y: 358 },
          legR: { x: 245, y: 358 },
          legCenter: { x: 200, y: 362 },
          legOuterL: { x: 125, y: 352 },
          legOuterR: { x: 275, y: 352 },
          wingL: { x: 132, y: 220 },
          wingR: { x: 268, y: 220 },
          tail: { x: 132, y: 338 },
          shadowRx: 115
        }
      },

      ghost: {
        name: 'ghost',
        headPath: 'M 200,80 C 255,80 278,105 278,142 C 278,178 255,200 200,200 C 145,200 122,178 122,142 C 122,105 145,80 200,80 Z',
        neckPath: 'M 165,190 L 235,190 L 245,215 L 155,215 Z',
        torsoPath: 'M 200,210 C 275,210 290,265 275,340 C 265,390 285,420 265,415 C 245,395 230,425 200,405 C 170,425 155,395 135,415 C 115,420 135,390 125,340 C 110,265 125,210 200,210 Z',
        bellyPath: 'M 200,235 C 240,235 255,260 255,295 C 255,335 240,350 200,350 C 160,350 145,335 145,295 C 145,260 160,235 200,235 Z',
        cheeks: [{ cx: 148, cy: 158 }, { cx: 252, cy: 158 }],
        slots: {
          eye_1: [{ x: 200, y: 130 }],
          eye_2: [{ x: 168, y: 130 }, { x: 232, y: 130 }],
          eye_3: [{ x: 146, y: 134 }, { x: 200, y: 122 }, { x: 254, y: 134 }],
          eye_4: [{ x: 150, y: 122 }, { x: 182, y: 118 }, { x: 218, y: 118 }, { x: 250, y: 122 }],
          eye_many: [{ x: 144, y: 134 }, { x: 172, y: 122 }, { x: 200, y: 138 }, { x: 228, y: 122 }, { x: 256, y: 134 }],
          nose: { x: 200, y: 154 },
          mouth: { x: 200, y: 176 },
          earLeft: { x: 124, y: 132, rot: -26 },
          earRight: { x: 276, y: 132, rot: 26 },
          earUpL: { x: 135, y: 104, rot: -34 },
          earUpR: { x: 265, y: 104, rot: 34 },
          hornL: { x: 165, y: 84, rot: -20 },
          hornR: { x: 235, y: 84, rot: 20 },
          hornCenter: { x: 200, y: 80, rot: 0 },
          hornOuterL: { x: 150, y: 92, rot: -30 },
          hornOuterR: { x: 250, y: 92, rot: 30 },
          hat: { x: 200, y: 82 },
          glasses: { x: 200, y: 130 },
          neck: { x: 200, y: 205 },
          shoulderL: { x: 120, y: 230 },
          shoulderR: { x: 280, y: 230 },
          extraArmL: { x: 122, y: 275 },
          extraArmR: { x: 278, y: 275 },
          legL: { x: 155, y: 410 },
          legR: { x: 245, y: 410 },
          legCenter: { x: 200, y: 415 },
          legOuterL: { x: 128, y: 405 },
          legOuterR: { x: 272, y: 405 },
          wingL: { x: 135, y: 220 },
          wingR: { x: 265, y: 220 },
          tail: { x: 135, y: 350 },
          shadowRx: 75
        }
      },

      dinosaur: {
        name: 'dinosaur',
        headPath: 'M 185,78 C 245,70 278,98 278,142 C 278,180 255,200 200,200 C 145,200 128,180 128,142 C 128,98 145,78 185,78 Z',
        neckPath: 'M 165,190 L 235,190 L 245,215 L 155,215 Z',
        torsoPath: 'M 200,210 C 265,210 288,245 288,290 C 288,340 265,362 200,362 C 135,362 112,340 112,290 C 112,245 135,210 200,210 Z',
        bellyPath: 'M 200,235 C 240,235 255,260 255,295 C 255,335 240,350 200,350 C 160,350 145,335 145,295 C 145,260 160,235 200,235 Z',
        cheeks: [{ cx: 148, cy: 158 }, { cx: 252, cy: 158 }],
        slots: {
          eye_1: [{ x: 200, y: 130 }],
          eye_2: [{ x: 168, y: 130 }, { x: 232, y: 130 }],
          eye_3: [{ x: 146, y: 134 }, { x: 200, y: 122 }, { x: 254, y: 134 }],
          eye_4: [{ x: 150, y: 122 }, { x: 182, y: 118 }, { x: 218, y: 118 }, { x: 250, y: 122 }],
          eye_many: [{ x: 144, y: 134 }, { x: 172, y: 122 }, { x: 200, y: 138 }, { x: 228, y: 122 }, { x: 256, y: 134 }],
          nose: { x: 200, y: 154 },
          mouth: { x: 200, y: 176 },
          earLeft: { x: 128, y: 132, rot: -26 },
          earRight: { x: 276, y: 132, rot: 26 },
          earUpL: { x: 138, y: 104, rot: -34 },
          earUpR: { x: 265, y: 104, rot: 34 },
          hornL: { x: 165, y: 84, rot: -20 },
          hornR: { x: 235, y: 84, rot: 20 },
          hornCenter: { x: 200, y: 80, rot: 0 },
          hornOuterL: { x: 150, y: 92, rot: -30 },
          hornOuterR: { x: 250, y: 92, rot: 30 },
          hat: { x: 200, y: 82 },
          glasses: { x: 200, y: 130 },
          neck: { x: 200, y: 205 },
          shoulderL: { x: 116, y: 230 },
          shoulderR: { x: 284, y: 230 },
          extraArmL: { x: 120, y: 275 },
          extraArmR: { x: 280, y: 275 },
          legL: { x: 155, y: 355 },
          legR: { x: 245, y: 355 },
          legCenter: { x: 200, y: 360 },
          legOuterL: { x: 128, y: 350 },
          legOuterR: { x: 272, y: 350 },
          wingL: { x: 135, y: 220 },
          wingR: { x: 265, y: 220 },
          tail: { x: 135, y: 335 },
          shadowRx: 110
        }
      },

      robot: {
        name: 'robot',
        headPath: 'M 135,85 L 265,85 L 265,185 L 135,185 Z',
        neckPath: 'M 175,185 L 225,185 L 225,208 L 175,208 Z',
        torsoPath: 'M 125,208 L 275,208 L 275,355 L 125,355 Z',
        bellyPath: 'M 145,230 L 255,230 L 255,335 L 145,335 Z',
        cheeks: [{ cx: 148, cy: 152 }, { cx: 252, cy: 152 }],
        slots: {
          eye_1: [{ x: 200, y: 125 }],
          eye_2: [{ x: 168, y: 125 }, { x: 232, y: 125 }],
          eye_3: [{ x: 148, y: 128 }, { x: 200, y: 118 }, { x: 252, y: 128 }],
          eye_4: [{ x: 152, y: 118 }, { x: 184, y: 115 }, { x: 216, y: 115 }, { x: 248, y: 118 }],
          eye_many: [{ x: 146, y: 128 }, { x: 174, y: 118 }, { x: 200, y: 132 }, { x: 226, y: 118 }, { x: 254, y: 128 }],
          nose: { x: 200, y: 148 },
          mouth: { x: 200, y: 168 },
          earLeft: { x: 135, y: 128, rot: -26 },
          earRight: { x: 265, y: 128, rot: 26 },
          earUpL: { x: 142, y: 98, rot: -34 },
          earUpR: { x: 258, y: 98, rot: 34 },
          hornL: { x: 165, y: 85, rot: -20 },
          hornR: { x: 235, y: 85, rot: 20 },
          hornCenter: { x: 200, y: 85, rot: 0 },
          hornOuterL: { x: 148, y: 85, rot: -30 },
          hornOuterR: { x: 252, y: 85, rot: 30 },
          hat: { x: 200, y: 85 },
          glasses: { x: 200, y: 125 },
          neck: { x: 200, y: 198 },
          shoulderL: { x: 125, y: 220 },
          shoulderR: { x: 275, y: 220 },
          extraArmL: { x: 125, y: 270 },
          extraArmR: { x: 275, y: 270 },
          legL: { x: 160, y: 355 },
          legR: { x: 240, y: 355 },
          legCenter: { x: 200, y: 355 },
          legOuterL: { x: 135, y: 355 },
          legOuterR: { x: 265, y: 355 },
          wingL: { x: 135, y: 215 },
          wingR: { x: 265, y: 215 },
          tail: { x: 135, y: 335 },
          shadowRx: 105
        }
      }
    };
  }

  getPalette(colorName) {
    return this.colorPalettes[colorName] || this.colorPalettes.purple;
  }

  getClothColor(colorName, fallback = '#2563eb') {
    return this.clothingColors[colorName] || colorName || fallback;
  }

  getBaseModel(shape = 'round') {
    return this.baseModels[shape] || this.baseModels.round;
  }

  renderSvg(monster, options = {}) {
    const isAnimated = options.animated !== false;
    const pal = this.getPalette(monster.color);
    const secPal = this.getPalette(monster.secondaryColor || monster.color);
    const width = options.width || 400;
    const height = options.height || 480;
    const base = this.getBaseModel(monster.bodyShape || 'round');
    const slots = base.slots;

    const layers = [
      // 1. Back Parts
      this.renderShadow(base),
      this.renderWings(monster, slots),
      this.renderTail(monster, pal, slots),
      this.renderBackExtras(monster, pal, slots),
      monster.specialCape ? this.renderCapeBack(monster, slots) : '',
      (monster.accessories && monster.accessories.includes('backpack')) ? this.renderBackpackBack(monster, slots) : '',

      // 2. Legs & Feet (Attached to predefined lower body leg slots)
      this.renderLegsAndFeet(monster, pal, slots),

      // 3. Torso / Body Base (Real Cartoon Torso Shape)
      this.renderTorsoBase(monster, pal, secPal, base),

      // 4. Clothing (Tops / Bottoms / Suits / Dress fitted to body bounds)
      this.renderClothing(monster, base),

      // 5. Arms & Hands (Attached to predefined shoulder slots)
      this.renderArmsAndHands(monster, pal, slots),

      // 6. Real Cartoon Head Shape (Solid shape sitting above neck)
      this.renderHeadBase(monster, pal, secPal, base),

      // 7. Ears & Horns (Attached to predefined ear & horn slots on head perimeter)
      this.renderEars(monster, pal, slots),
      this.renderHorns(monster, pal, slots),

      // 8. Face Features (INSIDE faceBounds: Eyes, Nose, Unified Mouth+Teeth)
      this.renderFaceFeatures(monster, pal, slots),

      // 9. Glasses (Over Eye Slot)
      this.renderGlasses(monster, slots),

      // 10. Neck Accessories (Scarf, Bow, Necklace, Cape Front)
      this.renderNeckAccessories(monster, slots),
      monster.specialCape ? this.renderCapeFront(monster, slots) : '',

      // 11. Head Accessories (Hats, Caps, Crowns, Wizard Hat on Hat Slot)
      this.renderHeadAccessories(monster, slots),

      // 12. Power Aura
      this.renderPowerAura(monster)
    ];

    return `
      <svg class="monster-svg ${isAnimated ? 'animated-monster' : ''}" 
           viewBox="0 0 400 480" 
           width="${width}" 
           height="${height}" 
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="mShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(15,23,42,0.18)"/>
          </filter>
          <linearGradient id="bodyGrad_${monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="45%" stop-color="${pal.main}"/>
            <stop offset="100%" stop-color="${pal.dark}"/>
          </linearGradient>
          <linearGradient id="secGrad_${monster.secondaryColor || monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${secPal.belly}"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#a16207"/>
          </linearGradient>
          <linearGradient id="capeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f43f5e"/>
            <stop offset="100%" stop-color="#9f1239"/>
          </linearGradient>
        </defs>
        ${layers.join('\n')}
      </svg>
    `;
  }

  // ==========================================
  // 1. BACK PARTS & SHADOW
  // ==========================================
  renderShadow(base) {
    if (base.name === 'ghost') {
      return `<ellipse cx="200" cy="445" rx="70" ry="12" fill="rgba(15, 23, 42, 0.08)" />`;
    }
    const rx = base.slots.shadowRx || 110;
    return `<ellipse cx="200" cy="445" rx="${rx}" ry="18" fill="rgba(15, 23, 42, 0.16)" />`;
  }

  renderWings(monster, slots) {
    const wings = monster.specialWings;
    if (!wings || wings === 'none') return '';
    const wl = slots.wingL;
    const wr = slots.wingR;

    if (wings === 'dragon') {
      return `
        <g class="monster-wings-group dragon-wings">
          <path d="M ${wl.x},${wl.y} Q 60,${wl.y - 80} 30,${wl.y - 40} Q 80,${wl.y} 40,${wl.y + 50} Q 110,${wl.y + 40} ${wl.x + 10},${wl.y + 35} Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${wl.x},${wl.y} L 30,${wl.y - 40} M ${wl.x},${wl.y + 15} L 40,${wl.y + 50}" stroke="#7c2d12" stroke-width="3"/>
          <path d="M ${wr.x},${wr.y} Q 340,${wr.y - 80} 370,${wr.y - 40} Q 320,${wr.y} 360,${wr.y + 50} Q 290,${wr.y + 40} ${wr.x - 10},${wr.y + 35} Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${wr.x},${wr.y} L 370,${wr.y - 40} M ${wr.x},${wr.y + 15} L 360,${wr.y + 50}" stroke="#7c2d12" stroke-width="3"/>
        </g>
      `;
    } else if (wings === 'butterfly') {
      return `
        <g class="monster-wings-group butterfly-wings">
          <path d="M ${wl.x},${wl.y} C 60,${wl.y - 80} 20,${wl.y} 70,${wl.y + 50} C 30,${wl.y + 90} 80,${wl.y + 140} ${wl.x},${wl.y + 60} Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="75" cy="${wl.y + 5}" r="14" fill="#fef08a" opacity="0.8"/>
          <path d="M ${wr.x},${wr.y} C 340,${wr.y - 80} 380,${wr.y} 330,${wr.y + 50} C 370,${wr.y + 90} 320,${wr.y + 140} ${wr.x},${wr.y + 60} Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="325" cy="${wr.y + 5}" r="14" fill="#fef08a" opacity="0.8"/>
        </g>
      `;
    } else if (wings === 'bat') {
      return `
        <g class="monster-wings-group bat-wings">
          <path d="M ${wl.x},${wl.y} Q 60,${wl.y - 50} 25,${wl.y - 5} Q 65,${wl.y + 30} 50,${wl.y + 65} Q 95,${wl.y + 65} 100,${wl.y + 95} Q 130,${wl.y + 75} ${wl.x},${wl.y + 40} Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${wr.x},${wr.y} Q 340,${wr.y - 50} 375,${wr.y - 5} Q 335,${wr.y + 30} 350,${wr.y + 65} Q 305,${wr.y + 65} 300,${wr.y + 95} Q 270,${wr.y + 75} ${wr.x},${wr.y + 40} Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }
    return '';
  }

  renderTail(monster, pal, slots) {
    const tail = monster.specialTail;
    if (!tail || tail === 'none') return '';
    const t = slots.tail;

    if (tail === 'long') {
      return `
        <g class="monster-tail-group long-tail">
          <path d="M ${t.x},${t.y} C 70,${t.y} 30,${t.y - 50} 45,${t.y - 100} C 52,${t.y - 125} 75,${t.y - 115} 65,${t.y - 90} C 55,${t.y - 60} 85,${t.y - 20} ${t.x + 10},${t.y + 15} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="48" cy="${t.y - 105}" r="9" fill="${pal.highlight}"/>
        </g>
      `;
    } else if (tail === 'curly') {
      return `
        <g class="monster-tail-group curly-tail">
          <path d="M ${t.x},${t.y} C 70,${t.y + 15} 40,${t.y - 25} 65,${t.y - 65} C 85,${t.y - 95} 120,${t.y - 65} 95,${t.y - 45} C 80,${t.y - 35} 70,${t.y - 5} ${t.x + 5},${t.y + 13} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    } else if (tail === 'dinosaur') {
      return `
        <g class="monster-tail-group dino-tail">
          <path d="M ${t.x},${t.y - 10} C 60,${t.y - 10} 20,${t.y + 50} 10,${t.y + 70} C 40,${t.y + 60} 90,${t.y + 45} ${t.x + 10},${t.y + 25} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <polygon points="120,${t.y - 6} 110,${t.y - 25} 102,${t.y - 2}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="85,${t.y + 8} 72,${t.y - 10} 68,${t.y + 18}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="48,${t.y + 32} 32,${t.y + 15} 35,${t.y + 45}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
        </g>
      `;
    } else if (tail === 'snake') {
      return `
        <g class="monster-tail-group snake-tail">
          <path d="M ${t.x},${t.y} Q 70,${t.y + 25} 50,${t.y - 5} Q 30,${t.y - 35} 65,${t.y - 75} Q 90,${t.y - 105} 75,${t.y - 135}" 
                fill="none" stroke="${pal.main}" stroke-width="16" stroke-linecap="round"/>
          <path d="M ${t.x},${t.y} Q 70,${t.y + 25} 50,${t.y - 5} Q 30,${t.y - 35} 65,${t.y - 75} Q 90,${t.y - 105} 75,${t.y - 135}" 
                fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      `;
    } else if (tail === 'bunny') {
      return `
        <g class="monster-tail-group bunny-tail">
          <circle cx="${t.x - 15}" cy="${t.y}" r="18" fill="#ffffff" stroke="${pal.stroke}" stroke-width="4"/>
        </g>
      `;
    }
    return '';
  }

  renderBackExtras(monster, pal, slots) {
    if (!monster.specialParts || !Array.isArray(monster.specialParts)) return '';
    let html = '';

    if (monster.specialParts.includes('shell')) {
      html += `
        <g class="monster-shell-back">
          <ellipse cx="200" cy="285" rx="96" ry="86" fill="#15803d" stroke="#0f172a" stroke-width="5"/>
          <ellipse cx="200" cy="285" rx="78" ry="68" fill="#16a34a"/>
          <polygon points="200,240 238,270 238,310 200,340 162,310 162,270" fill="#ca8a04" stroke="#713f12" stroke-width="3"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('tentacles')) {
      html += `
        <g class="monster-tentacles-back">
          <path d="M 120,310 C 70,320 40,380 65,430 C 75,450 95,440 85,410 C 70,370 100,340 130,330 Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 280,310 C 330,320 360,380 335,430 C 325,450 305,440 315,410 C 330,370 300,340 270,330 Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('spikes')) {
      html += `
        <g class="monster-spikes">
          <polygon points="175,95 160,55 185,90" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="200,90 200,45 210,90" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="225,95 240,55 215,90" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('fins')) {
      html += `
        <g class="monster-fins">
          <path d="M 125,255 Q 75,230 70,270 Q 100,280 125,270 Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
          <path d="M 275,255 Q 325,230 330,270 Q 300,280 275,270 Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
        </g>
      `;
    }

    return html;
  }

  renderCapeBack(monster, slots) {
    const capeColor = monster.specialCapeColor || 'red';
    const fill = capeColor === 'red' ? 'url(#capeGrad)' : this.getClothColor(capeColor, '#ef4444');
    return `
      <g class="monster-cape-back">
        <path d="M 130,210 Q 80,330 65,415 Q 200,445 335,415 Q 320,330 270,210 Z" 
              fill="${fill}" stroke="#881337" stroke-width="4.5" stroke-linejoin="round" />
      </g>
    `;
  }

  renderBackpackBack(monster, slots) {
    return `
      <g class="monster-backpack-back">
        <rect x="110" y="225" width="180" height="135" rx="30" fill="#10b981" stroke="#065f46" stroke-width="5"/>
        <path d="M 130,245 L 270,245" stroke="#065f46" stroke-width="4" stroke-linecap="round"/>
      </g>
    `;
  }

  // ==========================================
  // 2. COMPLETE LEGS & FEET (ATTACHED TO SLOTS)
  // ==========================================
  renderLegsAndFeet(monster, pal, slots) {
    const count = monster.legsCount !== undefined ? monster.legsCount : 2;
    if (count === 0 || monster.bodyShape === 'ghost') return '';

    const hasBoots = !!monster.specialBoots || monster.clothesShoes === 'boots';
    const shoeType = monster.clothesShoes || (hasBoots ? 'boots' : 'none');
    const bootColor = this.getClothColor(monster.specialBootsColor || 'yellow', '#eab308');

    let legConfigs = [];
    if (count === 1) legConfigs = [{ x: slots.legCenter.x, y: slots.legCenter.y, angle: 0 }];
    else if (count === 2) legConfigs = [
      { x: slots.legL.x, y: slots.legL.y, angle: -4 },
      { x: slots.legR.x, y: slots.legR.y, angle: 4 }
    ];
    else if (count === 3) legConfigs = [
      { x: slots.legL.x - 10, y: slots.legL.y, angle: -10 },
      { x: slots.legCenter.x, y: slots.legCenter.y, angle: 0 },
      { x: slots.legR.x + 10, y: slots.legR.y, angle: 10 }
    ];
    else { // 4 legs
      legConfigs = [
        { x: slots.legOuterL.x, y: slots.legOuterL.y, angle: -14 },
        { x: slots.legL.x + 10, y: slots.legL.y, angle: -4 },
        { x: slots.legR.x - 10, y: slots.legR.y, angle: 4 },
        { x: slots.legOuterR.x, y: slots.legOuterR.y, angle: 14 }
      ];
    }

    return `
      <g class="monster-legs-group">
        ${legConfigs.map((cfg) => `
          <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.angle})">
            <path d="M -14,0 L -14,75 Q -14,88 0,88 Q 14,88 14,75 L 14,0 Z" 
                  fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
            
            ${shoeType === 'boots' ? `
              <g transform="translate(0, 48)">
                <path d="M -18,0 L 22,0 L 26,38 Q 26,48 10,48 L -20,48 Q -24,48 -22,36 Z" 
                      fill="${bootColor}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <ellipse cx="2" cy="46" rx="24" ry="7" fill="${pal.stroke}"/>
                <rect x="-16" y="0" width="38" height="8" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : shoeType === 'sneakers' ? `
              <g transform="translate(0, 56)">
                <path d="M -18,0 L 24,0 L 28,32 Q 28,38 12,38 L -20,38 Z" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
                <rect x="-22" y="28" width="52" height="10" rx="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : shoeType === 'clown_shoes' ? `
              <g transform="translate(0, 50)">
                <ellipse cx="8" cy="32" rx="34" ry="16" fill="#facc15" stroke="${pal.stroke}" stroke-width="4"/>
                <circle cx="34" cy="24" r="8" fill="#ef4444"/>
              </g>
            ` : monster.feetStyle === 'bird' ? `
              <g transform="translate(0, 80)">
                <path d="M -18,12 L 0,0 L 18,12 M 0,0 L 0,16 M 0,0 L -6,-10" stroke="#ca8a04" stroke-width="6" stroke-linecap="round"/>
              </g>
            ` : monster.feetStyle === 'claws' ? `
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <polygon points="-16,10 -12,24 -8,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="-2,12 2,26 6,12" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="12,10 16,24 20,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
              </g>
            ` : `
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <circle cx="-12" cy="11" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <circle cx="2" cy="14" r="5.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <circle cx="16" cy="11" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            `}
          </g>
        `).join('')}
      </g>
    `;
  }

  // ==========================================
  // 3. TORSO BASE
  // ==========================================
  renderTorsoBase(monster, pal, secPal, base) {
    return `
      <g class="monster-torso-group" filter="url(#mShadow)">
        <path d="${base.torsoPath}" fill="url(#bodyGrad_${monster.color})" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        <path d="${base.bellyPath}" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>
      </g>
    `;
  }

  // ==========================================
  // 4. CLOTHING (FULL-OUTFIT EXCLUSIVITY)
  // ==========================================
  renderClothing(monster, base) {
    const suit = monster.specialSuit;
    const isFullSuit = suit && suit !== 'none';
    const isDress = monster.clothesBottom === 'dress';

    if (isFullSuit) {
      if (suit === 'superhero') {
        return `
          <g class="monster-clothing-suit">
            <path d="M 135,215 Q 200,230 265,215 L 285,345 L 115,345 Z" fill="#2563eb" stroke="#0f172a" stroke-width="4.5"/>
            <polygon points="200,240 225,260 215,290 185,290 175,260" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
            <text x="200" y="278" font-size="22" font-weight="900" text-anchor="middle" fill="#dc2626">M</text>
          </g>
        `;
      } else if (suit === 'astronaut') {
        return `
          <g class="monster-clothing-suit">
            <path d="M 135,212 L 265,212 L 285,350 L 115,350 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="4.5"/>
            <rect x="175" y="245" width="50" height="40" rx="8" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
            <circle cx="188" cy="260" r="4" fill="#ef4444"/>
            <circle cx="212" cy="260" r="4" fill="#10b981"/>
          </g>
        `;
      } else if (suit === 'wizard') {
        return `
          <g class="monster-clothing-suit">
            <path d="M 135,215 Q 200,230 265,215 L 305,375 L 95,375 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4.5"/>
            <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15"/>
          </g>
        `;
      } else if (suit === 'pirate') {
        return `
          <g class="monster-clothing-suit">
            <path d="M 135,215 L 265,215 L 285,350 L 115,350 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4.5"/>
            <path d="M 175,215 L 175,350 L 225,350 L 225,215 Z" fill="#dc2626"/>
            <line x1="175" y1="250" x2="225" y2="250" stroke="#ffffff" stroke-width="4"/>
          </g>
        `;
      } else if (suit === 'football') {
        return `
          <g class="monster-clothing-suit">
            <path d="M 135,215 L 265,215 L 285,330 L 115,330 Z" fill="#16a34a" stroke="#0f172a" stroke-width="4.5"/>
            <text x="200" y="280" font-size="34" font-weight="900" text-anchor="middle" fill="#ffffff">10</text>
          </g>
        `;
      } else if (suit === 'royal') {
        return `
          <g class="monster-clothing-suit">
            <path d="M 135,215 L 265,215 L 300,370 L 100,370 Z" fill="#991b1b" stroke="#0f172a" stroke-width="4.5"/>
            <path d="M 180,215 L 180,370 L 220,370 L 220,215 Z" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
          </g>
        `;
      }
    }

    if (isDress) {
      const dressColor = this.getClothColor(monster.clothesBottomColor || 'pink', '#ec4899');
      return `
        <g class="monster-clothing-dress">
          <path d="M 145,215 Q 200,230 255,215 L 305,372 Q 200,388 95,372 Z" 
                fill="${dressColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }

    let html = '';

    // Bottoms
    if (monster.clothesBottom && monster.clothesBottom !== 'none') {
      const botColor = this.getClothColor(monster.clothesBottomColor, '#1e293b');
      if (monster.clothesBottom === 'trousers') {
        html += `
          <g class="monster-clothing-bottoms">
            <path d="M 124,300 C 118,340 128,375 146,375 L 178,375 L 198,328 L 222,375 L 254,375 C 272,375 282,340 276,300 Z" 
                  fill="${botColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <rect x="188" y="298" width="24" height="7" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          </g>
        `;
      } else if (monster.clothesBottom === 'shorts') {
        html += `
          <g class="monster-clothing-bottoms">
            <path d="M 124,300 C 118,325 130,345 155,345 L 178,345 L 198,320 L 222,345 L 245,345 C 270,345 282,325 276,300 Z" 
                  fill="${botColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          </g>
        `;
      } else if (monster.clothesBottom === 'skirt') {
        html += `
          <g class="monster-clothing-bottoms">
            <path d="M 138,280 Q 95,360 105,372 Q 200,388 295,372 Q 305,360 262,280 Z" 
                  fill="${botColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          </g>
        `;
      }
    }

    // Tops
    if (monster.clothesTop && monster.clothesTop !== 'none') {
      const topColor = this.getClothColor(monster.clothesTopColor, '#2563eb');
      if (monster.clothesTop === 'tshirt') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M 142,215 Q 200,230 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          </g>
        `;
      } else if (monster.clothesTop === 'shirt') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M 142,215 L 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <polygon points="174,215 200,238 188,215" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
            <polygon points="226,215 200,238 212,215" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          </g>
        `;
      } else if (monster.clothesTop === 'hoodie') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M 140,212 Q 200,225 260,212 L 295,262 L 268,272 L 258,314 L 142,314 L 132,272 L 105,262 Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <rect x="160" y="275" width="80" height="28" rx="8" fill="#ffffff" opacity="0.4"/>
          </g>
        `;
      } else if (monster.clothesTop === 'jacket') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M 138,215 L 262,215 L 296,258 L 270,270 L 260,314 L 140,314 L 130,270 L 104,258 Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <path d="M 174,215 L 186,314" stroke="#0f172a" stroke-width="4"/>
            <path d="M 226,215 L 214,314" stroke="#0f172a" stroke-width="4"/>
          </g>
        `;
      }
    }

    return html;
  }

  // ==========================================
  // 5. ARMS & HANDS (ATTACHED TO SHOULDER SLOTS)
  // ==========================================
  renderArmsAndHands(monster, pal, slots) {
    const count = monster.armsCount !== undefined ? monster.armsCount : 2;
    if (count === 0) return '';
    const length = monster.armsLength || 'short';
    const hasGloves = !!monster.specialGloves;
    const gloveColor = this.getClothColor(monster.specialGlovesColor || 'green', '#16a34a');

    let armFactor = 1.0;
    if (length === 'tiny') armFactor = 0.6;
    else if (length === 'long') armFactor = 1.35;
    else if (length === 'super_long') armFactor = 1.7;

    const shL = slots.shoulderL;
    const shR = slots.shoulderR;

    let armConfigs = [];
    if (count === 1) armConfigs = [{ side: 'right', shX: shR.x, shY: shR.y, handX: 62 * armFactor, handY: -35 * armFactor, rot: 28, flip: true }];
    else if (count === 2) armConfigs = [
      { side: 'left',  shX: shL.x, shY: shL.y, handX: 62 * armFactor, handY: 35 * armFactor,  rot: -28, flip: false },
      { side: 'right', shX: shR.x, shY: shR.y, handX: 62 * armFactor, handY: -35 * armFactor, rot: 28,  flip: true }
    ];
    else if (count === 3) armConfigs = [
      { side: 'left',  shX: shL.x, shY: shL.y - 10, handX: 65 * armFactor, handY: -30 * armFactor, rot: -42, flip: false },
      { side: 'left',  shX: slots.extraArmL.x, shY: slots.extraArmL.y, handX: 58 * armFactor, handY: 35 * armFactor, rot: -12, flip: false },
      { side: 'right', shX: shR.x, shY: shR.y, handX: 62 * armFactor, handY: 35 * armFactor,  rot: 28,  flip: true }
    ];
    else { // 4 arms
      armConfigs = [
        { side: 'left',  shX: shL.x, shY: shL.y - 10, handX: 64 * armFactor, handY: -32 * armFactor, rot: -46, flip: false },
        { side: 'left',  shX: slots.extraArmL.x, shY: slots.extraArmL.y, handX: 58 * armFactor, handY: 30 * armFactor, rot: -10, flip: false },
        { side: 'right', shX: shR.x, shY: shR.y - 10, handX: 64 * armFactor, handY: -32 * armFactor, rot: 46,  flip: true },
        { side: 'right', shX: slots.extraArmR.x, shY: slots.extraArmR.y, handX: 58 * armFactor, handY: 30 * armFactor, rot: 10,  flip: true }
      ];
    }

    return `
      <g class="monster-arms-group">
        ${armConfigs.map((cfg) => {
          const dir = cfg.flip ? 1 : -1;
          const targetX = cfg.shX + (cfg.handX * dir);
          const targetY = cfg.shY + cfg.handY;
          const midX = (cfg.shX + targetX) / 2;
          const midY = (cfg.shY + targetY) / 2 + (cfg.flip ? -10 : 10);

          return `
            <g class="monster-arm-item">
              <path d="M ${cfg.shX},${cfg.shY} Q ${midX},${midY} ${targetX},${targetY}" 
                    fill="none" stroke="${pal.main}" stroke-width="22" stroke-linecap="round"/>
              <path d="M ${cfg.shX},${cfg.shY} Q ${midX},${midY} ${targetX},${targetY}" 
                    fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
              
              <g transform="translate(${targetX}, ${targetY})">
                ${hasGloves ? `
                  <circle cx="0" cy="0" r="16" fill="${gloveColor}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <circle cx="${dir * 8}" cy="-8" r="6.5" fill="${gloveColor}" stroke="${pal.stroke}" stroke-width="2"/>
                ` : monster.handsStyle === 'claws' ? `
                  <circle cx="0" cy="0" r="13" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <polygon points="${dir * -8},-8 ${dir * -14},-20 ${dir * -2},-10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="0,-10 ${dir * 4},-22 ${dir * 6},-8" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="${dir * 8},-6 ${dir * 18},-16 ${dir * 12},-2" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                ` : monster.handsStyle === 'giant' ? `
                  <circle cx="0" cy="0" r="22" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                ` : `
                  <circle cx="0" cy="0" r="14" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <circle cx="${dir * -6}" cy="-8" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                  <circle cx="${dir * 6}" cy="-8" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                `}
              </g>
            </g>
          `;
        }).join('')}
      </g>
    `;
  }

  // ==========================================
  // 6. REAL HEAD BASE (SOLID VISIBLE CARTOON HEAD)
  // ==========================================
  renderHeadBase(monster, pal, secPal, base) {
    return `
      <g class="monster-head-container" filter="url(#mShadow)">
        <!-- Visible Neck Connector -->
        <path d="${base.neckPath}" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Real Solid Head Base -->
        <path d="${base.headPath}" fill="url(#bodyGrad_${monster.color})" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        <!-- Shaded Cheeks -->
        <ellipse cx="${base.cheeks[0].cx}" cy="${base.cheeks[0].cy}" rx="15" ry="10" fill="${pal.blush}" opacity="0.6"/>
        <ellipse cx="${base.cheeks[1].cx}" cy="${base.cheeks[1].cy}" rx="15" ry="10" fill="${pal.blush}" opacity="0.6"/>
      </g>
    `;
  }

  // ==========================================
  // 7. EARS & HORNS (ATTACHED TO SLOTS ON HEAD PERIMETER)
  // ==========================================
  renderEars(monster, pal, slots) {
    const count = monster.earsCount !== undefined ? monster.earsCount : 2;
    if (count === 0) return '';
    const style = monster.earsStyle || 'long';

    let configs = [];
    if (count === 1) configs = [{ x: slots.earLeft.x, y: slots.earLeft.y, rot: slots.earLeft.rot, flip: false }];
    else if (count === 2) configs = [
      { x: slots.earLeft.x, y: slots.earLeft.y, rot: slots.earLeft.rot, flip: false },
      { x: slots.earRight.x, y: slots.earRight.y, rot: slots.earRight.rot, flip: true }
    ];
    else if (count === 4) configs = [
      { x: slots.earUpL.x, y: slots.earUpL.y, rot: slots.earUpL.rot, flip: false },
      { x: slots.earLeft.x - 2, y: slots.earLeft.y + 10, rot: -16, flip: false },
      { x: slots.earUpR.x, y: slots.earUpR.y, rot: slots.earUpR.rot, flip: true },
      { x: slots.earRight.x + 2, y: slots.earRight.y + 10, rot: 16, flip: true }
    ];

    return `
      <g class="monster-ears-group">
        ${configs.map(cfg => {
          const sign = cfg.flip ? -1 : 1;
          if (style === 'long' || style === 'floppy') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <path d="M 0,0 C ${-24*sign},-60 ${8*sign},-102 ${18*sign},-98 C ${28*sign},-60 ${18*sign},-15 0,0 Z" 
                      fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
                <path d="M ${4*sign},-14 C ${-8*sign},-52 ${10*sign},-82 ${14*sign},-80 C ${18*sign},-52 ${14*sign},-16 ${4*sign},-14 Z" 
                      fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
              </g>
            `;
          } else if (style === 'pointy') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="0,0 ${-25*sign},-45 ${15*sign},-30" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
                <polygon points="${2*sign},-6 ${-14*sign},-36 ${8*sign},-25" fill="${pal.belly}"/>
              </g>
            `;
          } else { // round, small
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <ellipse cx="0" cy="0" rx="18" ry="20" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <ellipse cx="0" cy="0" rx="10" ry="12" fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
              </g>
            `;
          }
        }).join('')}
      </g>
    `;
  }

  renderHorns(monster, pal, slots) {
    const count = monster.hornsCount || 0;
    if (count === 0) return '';
    const style = monster.hornsStyle || 'curly';

    let configs = [];
    if (count === 1) configs = [{ x: slots.hornCenter.x, y: slots.hornCenter.y, rot: slots.hornCenter.rot, flip: false }];
    else if (count === 2) configs = [
      { x: slots.hornL.x, y: slots.hornL.y, rot: slots.hornL.rot, flip: false },
      { x: slots.hornR.x, y: slots.hornR.y, rot: slots.hornR.rot, flip: true }
    ];
    else if (count === 4) configs = [
      { x: slots.hornOuterL.x, y: slots.hornOuterL.y, rot: slots.hornOuterL.rot, flip: false },
      { x: slots.hornL.x, y: slots.hornL.y, rot: slots.hornL.rot, flip: false },
      { x: slots.hornR.x, y: slots.hornR.y, rot: slots.hornR.rot, flip: true },
      { x: slots.hornOuterR.x, y: slots.hornOuterR.y, rot: slots.hornOuterR.rot, flip: true }
    ];

    return `
      <g class="monster-horns-group">
        ${configs.map(cfg => {
          const sign = cfg.flip ? -1 : 1;
          if (style === 'curly') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <path d="M 0,0 C ${-25*sign},-30 ${-40*sign},-10 ${-25*sign},10 C ${-10*sign},20 ${-20*sign},-15 0,0 Z" 
                      fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
              </g>
            `;
          } else if (style === 'spiral') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="0,0 ${-12*sign},-60 ${12*sign},-60" fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
                <line x1="${-6*sign}" y1="-20" x2="${6*sign}" y2="-25" stroke="#78350f" stroke-width="3"/>
                <line x1="${-8*sign}" y1="-40" x2="${8*sign}" y2="-45" stroke="#78350f" stroke-width="3"/>
              </g>
            `;
          } else { // pointy, big
            const h = style === 'big' ? 55 : 40;
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="${-12*sign},0 0,${-h} ${12*sign},0" fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
              </g>
            `;
          }
        }).join('')}
      </g>
    `;
  }

  // ==========================================
  // 8. RELATIVE FACE FEATURES (INSIDE FACE BOUNDS)
  // ==========================================
  renderFaceFeatures(monster, pal, slots) {
    const expr = monster.expression || 'happy';
    const count = monster.eyesCount !== undefined ? monster.eyesCount : 2;
    const size = monster.eyesSize || 'big';
    const style = monster.eyesStyle || (expr === 'angry' ? 'angry' : (expr === 'sleepy' ? 'sleepy' : (expr === 'surprised' ? 'surprised' : 'round')));

    let rBase = 18;
    if (size === 'tiny') rBase = 9;
    else if (size === 'small') rBase = 13;
    else if (size === 'giant') rBase = 28;

    let eyeSlotList = slots.eye_2;
    if (count === 1) eyeSlotList = slots.eye_1;
    else if (count === 2) eyeSlotList = slots.eye_2;
    else if (count === 3) eyeSlotList = slots.eye_3;
    else if (count === 4) eyeSlotList = slots.eye_4;
    else if (count === 'many') eyeSlotList = slots.eye_many;

    const eyesSvg = `
      <g class="monster-eyes-group">
        ${eyeSlotList.map((slot, idx) => {
          let pupilContent = `
            <circle cx="${slot.x}" cy="${slot.y + 1.5}" r="${rBase * 0.58}" fill="#0284c7" />
            <circle cx="${slot.x}" cy="${slot.y + 1.5}" r="${rBase * 0.42}" fill="#0f172a" />
            <circle cx="${slot.x - rBase * 0.22}" cy="${slot.y - rBase * 0.22}" r="${rBase * 0.22}" fill="#ffffff" />
            <circle cx="${slot.x + rBase * 0.24}" cy="${slot.y + rBase * 0.24}" r="${rBase * 0.11}" fill="#ffffff" />
          `;

          if (style === 'star') {
            pupilContent = `
              <polygon points="${slot.x},${slot.y - rBase*0.6} ${slot.x + rBase*0.18},${slot.y - rBase*0.18} ${slot.x + rBase*0.6},${slot.y} ${slot.x + rBase*0.18},${slot.y + rBase*0.18} ${slot.x},${slot.y + rBase*0.6} ${slot.x - rBase*0.18},${slot.y + rBase*0.18} ${slot.x - rBase*0.6},${slot.y} ${slot.x - rBase*0.18},${slot.y - rBase*0.18}" fill="#eab308"/>
              <circle cx="${slot.x}" cy="${slot.y}" r="${rBase*0.25}" fill="#0f172a"/>
            `;
          } else if (style === 'heart') {
            pupilContent = `
              <path d="M ${slot.x},${slot.y - rBase*0.2} C ${slot.x - rBase*0.5},${slot.y - rBase*0.6} ${slot.x - rBase*0.7},${slot.y + rBase*0.1} ${slot.x},${slot.y + rBase*0.6} C ${slot.x + rBase*0.7},${slot.y + rBase*0.1} ${slot.x + rBase*0.5},${slot.y - rBase*0.6} ${slot.x},${slot.y - rBase*0.2} Z" fill="#ec4899"/>
              <circle cx="${slot.x - rBase*0.15}" cy="${slot.y - rBase*0.1}" r="${rBase*0.12}" fill="#ffffff"/>
            `;
          } else if (style === 'sleepy' || expr === 'sleepy') {
            pupilContent = `
              <circle cx="${slot.x}" cy="${slot.y + rBase*0.2}" r="${rBase * 0.35}" fill="#0f172a"/>
              <path d="M ${slot.x - rBase},${slot.y} Q ${slot.x},${slot.y + rBase*0.3} ${slot.x + rBase},${slot.y}" fill="${pal.main}" stroke="#0f172a" stroke-width="2.5"/>
            `;
          } else if (style === 'happy' || expr === 'happy') {
            pupilContent = `
              <path d="M ${slot.x - rBase*0.7},${slot.y + rBase*0.2} Q ${slot.x},${slot.y - rBase*0.6} ${slot.x + rBase*0.7},${slot.y + rBase*0.2}" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
            `;
          } else if (style === 'angry' || expr === 'angry') {
            pupilContent = `
              <circle cx="${slot.x}" cy="${slot.y + 1.5}" r="${rBase * 0.45}" fill="#ef4444" />
              <path d="M ${slot.x - rBase},${slot.y - rBase*0.5} L ${slot.x + rBase},${slot.y - rBase*0.1}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
            `;
          } else if (expr === 'silly' && idx % 2 === 1) {
            pupilContent = `
              <path d="M ${slot.x - rBase*0.6},${slot.y} Q ${slot.x},${slot.y - rBase*0.5} ${slot.x + rBase*0.6},${slot.y}" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
            `;
          }

          let browSvg = '';
          if (expr === 'angry') {
            const tilt = slot.x < 200 ? 12 : -12;
            browSvg = `<line x1="${slot.x - rBase}" y1="${slot.y - rBase - 4}" x2="${slot.x + rBase}" y2="${slot.y - rBase - 4 + tilt}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`;
          } else if (expr === 'surprised') {
            browSvg = `<path d="M ${slot.x - rBase*0.8},${slot.y - rBase - 8} Q ${slot.x},${slot.y - rBase - 16} ${slot.x + rBase*0.8},${slot.y - rBase - 8}" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>`;
          }

          return `
            <g class="monster-single-eye eye-idx-${idx}">
              ${browSvg}
              <ellipse cx="${slot.x}" cy="${slot.y}" rx="${rBase}" ry="${rBase * 1.05}" fill="#ffffff" stroke="#0f172a" stroke-width="3.5" />
              ${pupilContent}
            </g>
          `;
        }).join('')}
      </g>
    `;

    // NOSE AT NOSE SLOT
    const noseStyle = monster.noseStyle || 'small';
    const n = slots.nose;
    let noseSvg = '';
    if (noseStyle !== 'none') {
      if (noseStyle === 'long') {
        noseSvg = `<path d="M ${n.x - 5},${n.y - 6} Q ${n.x},${n.y + 16} ${n.x + 12},${n.y + 16} Q ${n.x + 4},${n.y - 6} ${n.x + 1},${n.y - 8} Z" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>`;
      } else if (noseStyle === 'funny') {
        noseSvg = `
          <ellipse cx="${n.x}" cy="${n.y}" rx="16" ry="11" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
          <circle cx="${n.x - 4}" cy="${n.y - 3}" r="3.5" fill="#ffffff" opacity="0.6"/>
        `;
      } else if (noseStyle === 'big' || noseStyle === 'round') {
        noseSvg = `
          <ellipse cx="${n.x}" cy="${n.y}" rx="13" ry="9.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
          <ellipse cx="${n.x - 3}" cy="${n.y - 2}" rx="3.5" ry="2" fill="#ffffff" opacity="0.6"/>
        `;
      } else { // small
        noseSvg = `
          <ellipse cx="${n.x}" cy="${n.y}" rx="6.5" ry="4.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="2.5"/>
        `;
      }
    }

    // UNIFIED MOUTH + TEETH COMPONENT (TEETH STRICTLY INSIDE MOUTH)
    const mouthType = monster.mouthType || (expr === 'scary' ? 'scary' : (expr === 'surprised' ? 'surprised' : (expr === 'angry' ? 'scary' : 'big')));
    const teethType = monster.teethType || 'sharp';
    const m = slots.mouth;

    let mouthComponent = '';

    if (expr === 'silly') {
      mouthComponent = `
        <g class="monster-mouth-component">
          <path d="M ${m.x - 32},${m.y} Q ${m.x},${m.y + 30} ${m.x + 32},${m.y} Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${m.x - 10},${m.y + 10} C ${m.x - 12},${m.y + 30} ${m.x + 12},${m.y + 30} ${m.x + 10},${m.y + 10} Z" fill="#fb7185" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    } else if (expr === 'surprised' || mouthType === 'surprised') {
      mouthComponent = `
        <g class="monster-mouth-component">
          <ellipse cx="${m.x}" cy="${m.y + 4}" rx="16" ry="20" fill="#881337" stroke="#0f172a" stroke-width="4.5"/>
        </g>
      `;
    } else if (mouthType === 'huge' || mouthType === 'big' || mouthType === 'smiling') {
      let teethSvg = '';
      if (teethType === 'sharp' || teethType === 'vampire') {
        teethSvg = `
          <polygon points="${m.x - 24},${m.y - 4} ${m.x - 18},${m.y + 10} ${m.x - 12},${m.y - 4}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${m.x - 6},${m.y - 4} ${m.x},${m.y + 14} ${m.x + 6},${m.y - 4}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${m.x + 12},${m.y - 4} ${m.x + 18},${m.y + 10} ${m.x + 24},${m.y - 4}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethSvg = `<rect x="${m.x - 8}" y="${m.y - 4}" width="16" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>`;
      } else if (teethType === 'big') {
        teethSvg = `
          <rect x="${m.x - 10}" y="${m.y - 4}" width="9" height="12" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="${m.x + 1}" y="${m.y - 4}" width="9" height="12" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethSvg = `
          <circle cx="${m.x - 20}" cy="${m.y}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${m.x - 10}" cy="${m.y}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${m.x}" cy="${m.y}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${m.x + 10}" cy="${m.y}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${m.x + 20}" cy="${m.y}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }

      mouthComponent = `
        <g class="monster-mouth-component">
          <path d="M ${m.x - 40},${m.y - 4} Q ${m.x},${m.y + 36} ${m.x + 40},${m.y - 4} Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${m.x - 20},${m.y + 18} Q ${m.x},${m.y + 4} ${m.x + 20},${m.y + 18} Q ${m.x},${m.y + 36} ${m.x - 20},${m.y + 18} Z" fill="#fb7185"/>
          ${teethSvg}
        </g>
      `;
    } else if (mouthType === 'scary' || expr === 'scary') {
      let teethSvg = '';
      if (teethType === 'sharp' || teethType === 'vampire') {
        teethSvg = `
          <polygon points="${m.x - 36},${m.y - 2} ${m.x - 30},${m.y + 14} ${m.x - 24},${m.y - 3}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${m.x - 18},${m.y - 5} ${m.x - 11},${m.y + 18} ${m.x - 4},${m.y - 6}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${m.x + 4},${m.y - 6} ${m.x + 11},${m.y + 18} ${m.x + 18},${m.y - 5}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${m.x + 24},${m.y - 3} ${m.x + 30},${m.y + 14} ${m.x + 36},${m.y - 2}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethSvg = `<rect x="${m.x - 9}" y="${m.y - 5}" width="18" height="22" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>`;
      }

      mouthComponent = `
        <g class="monster-mouth-component">
          <path d="M ${m.x - 44},${m.y - 2} Q ${m.x},${m.y - 12} ${m.x + 44},${m.y - 2} Q ${m.x + 34},${m.y + 36} ${m.x},${m.y + 32} Q ${m.x - 34},${m.y + 36} ${m.x - 44},${m.y - 2} Z" 
                fill="#881337" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          ${teethSvg}
        </g>
      `;
    } else { // small
      mouthComponent = `
        <g class="monster-mouth-component">
          <path d="M ${m.x - 18},${m.y} Q ${m.x},${m.y + 18} ${m.x + 18},${m.y} Z" fill="#be123c" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        </g>
      `;
    }

    return `
      <g class="monster-face-features">
        ${eyesSvg}
        ${noseSvg}
        ${mouthComponent}
      </g>
    `;
  }

  // ==========================================
  // 9. GLASSES (OVER EYE AREA)
  // ==========================================
  renderGlasses(monster, slots) {
    if (!monster.accessories) return '';
    const hasGlasses = monster.accessories.includes('glasses');
    const hasSunglasses = monster.accessories.includes('sunglasses');
    if (!hasGlasses && !hasSunglasses) return '';

    const g = slots.glasses;
    const lensFill = hasSunglasses ? '#0f172a' : 'rgba(255,255,255,0.35)';

    return `
      <g class="accessory-glasses" transform="translate(${g.x}, ${g.y})">
        <circle cx="-32" cy="0" r="23" fill="${lensFill}" stroke="#0f172a" stroke-width="6"/>
        <circle cx="32" cy="0" r="23" fill="${lensFill}" stroke="#0f172a" stroke-width="6"/>
        <path d="M -9,-2 Q 0,-8 9,-2" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
      </g>
    `;
  }

  // ==========================================
  // 10. NECK ACCESSORIES
  // ==========================================
  renderNeckAccessories(monster, slots) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    const n = slots.neck;
    let html = '';

    if (monster.accessories.includes('scarf')) {
      const scarfColor = this.getClothColor(accColors.scarf || 'red', '#dc2626');
      html += `
        <g class="accessory-scarf" transform="translate(${n.x}, ${n.y})">
          <path d="M -54,-8 Q 0,20 54,-8 Q 0,36 -54,-8 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 16,10 L 28,75 L 50,71 L 38,10 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        </g>
      `;
    }

    if (monster.accessories.includes('bow')) {
      const bowColor = this.getClothColor(accColors.bow || 'pink', '#ec4899');
      html += `
        <g class="accessory-bow" transform="translate(${n.x}, ${n.y + 4})">
          <polygon points="0,0 -22,-12 -22,12" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <polygon points="0,0 22,-12 22,12" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="6.5" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.accessories.includes('necklace')) {
      html += `
        <g class="accessory-necklace" transform="translate(${n.x}, ${n.y + 6})">
          <path d="M -40,-4 Q 0,28 40,-4" fill="none" stroke="#facc15" stroke-width="4"/>
          <circle cx="0" cy="16" r="6.5" fill="#ef4444" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
    }

    return html;
  }

  renderCapeFront(monster, slots) {
    const n = slots.neck;
    return `
      <g class="monster-cape-front">
        <path d="M 134,${n.y - 6} Q 200,${n.y + 12} 266,${n.y - 6}" fill="none" stroke="#be123c" stroke-width="7" stroke-linecap="round"/>
        <circle cx="200" cy="${n.y + 4}" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
      </g>
    `;
  }

  // ==========================================
  // 11. HEAD ACCESSORIES (ON HAT SLOT)
  // ==========================================
  renderHeadAccessories(monster, slots) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    const h = slots.hat;
    let html = '';

    if (monster.accessories.includes('crown')) {
      html += `
        <g class="accessory-crown" transform="translate(${h.x}, ${h.y})">
          <polygon points="-40,0 -36,-40 -15,-13 0,-46 15,-13 36,-40 40,0" 
                   fill="url(#goldGrad)" stroke="#78350f" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="-42" y="-2" width="84" height="10" rx="4" fill="#ca8a04" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
    }

    if (monster.accessories.includes('wizard_hat')) {
      html += `
        <g class="accessory-wizard-hat" transform="translate(${h.x}, ${h.y})">
          <ellipse cx="0" cy="6" rx="65" ry="14" fill="#6d28d9" stroke="#0f172a" stroke-width="4"/>
          <path d="M -35,4 Q -10,-80 40,-85 Q 20,-30 35,4 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4"/>
          <polygon points="12,-45 15,-40 22,-40 17,-35 19,-28 12,-32 5,-28 7,-35 2,-40 9,-40" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('pirate_hat')) {
      html += `
        <g class="accessory-pirate-hat" transform="translate(${h.x}, ${h.y + 4})">
          <path d="M -65,10 Q 0,-45 65,10 Q 0,0 -65,10 Z" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
          <circle cx="0" cy="-6" r="6" fill="#ffffff"/>
        </g>
      `;
    } else if (monster.accessories.includes('helmet')) {
      html += `
        <g class="accessory-helmet" transform="translate(${h.x}, ${h.y + 6})">
          <path d="M -50,15 C -50,-45 50,-45 50,15 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="4"/>
          <polygon points="0,-45 8,-20 -8,-20" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('hat')) {
      const hatColor = this.getClothColor(accColors.hat || 'yellow', '#eab308');
      html += `
        <g class="accessory-hat" transform="translate(${h.x}, ${h.y + 2})">
          <ellipse cx="0" cy="8" rx="58" ry="11" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -30,8 L -22,-56 L 22,-56 L 30,8 Z" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <rect x="-30" y="-4" width="60" height="12" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    } else if (monster.accessories.includes('cap')) {
      const capColor = this.getClothColor(accColors.cap || 'blue', '#2563eb');
      html += `
        <g class="accessory-cap" transform="translate(${h.x}, ${h.y + 8})">
          <path d="M -42,8 C -42,-32 42,-32 42,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -42,6 Q -72,16 -66,24 Q -38,20 -14,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="3.5"/>
        </g>
      `;
    }

    return html;
  }

  // ==========================================
  // 12. POWER EFFECTS
  // ==========================================
  renderPowerAura(monster) {
    if (!monster.powers || monster.powers.length === 0) return '';
    if (monster.powers.includes('shoot_lightning')) {
      return `
        <g class="monster-power-fx">
          <path d="M 120,180 L 100,210 L 125,215 L 90,255" stroke="#facc15" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M 280,180 L 300,210 L 275,215 L 310,255" stroke="#facc15" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    } else if (monster.powers.includes('breathe_fire')) {
      return `
        <g class="monster-power-fx">
          <path d="M 200,185 Q 235,200 260,175 Q 245,215 290,205 Q 250,230 200,195 Z" fill="#f97316" opacity="0.85"/>
          <circle cx="235" cy="195" r="7" fill="#fde047"/>
        </g>
      `;
    } else if (monster.powers.includes('make_ice')) {
      return `
        <g class="monster-power-fx">
          <polygon points="120,380 130,340 140,380" fill="#38bdf8" opacity="0.8"/>
          <polygon points="260,380 270,335 280,380" fill="#38bdf8" opacity="0.8"/>
        </g>
      `;
    }
    return '';
  }
}

window.monsterRenderer = new MonsterRenderer();
