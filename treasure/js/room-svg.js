/**
 * Room Rescue: Rich Vector/SVG Visual Assets
 * Generates polished cartoon illustrations for all room furniture and draggable objects.
 * NO emojis used as object graphics!
 */

const ROOM_SVG = {
  // 1. School Bag (Draggable)
  getBagSvg(width = 80, height = 85) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 100 105" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-bag">
        <!-- Shadow -->
        <ellipse cx="50" cy="98" rx="38" ry="7" fill="rgba(0,0,0,0.25)"/>
        <!-- Straps Top Handle -->
        <path d="M38 25 C38 10, 62 10, 62 25" stroke="#991b1b" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M42 25 C42 15, 58 15, 58 25" stroke="#f87171" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Main Bag Body -->
        <rect x="18" y="24" width="64" height="70" rx="16" fill="#dc2626" stroke="#7f1d1d" stroke-width="4"/>
        <!-- Front Flap / Top -->
        <path d="M18 40 Q50 54 82 40 L82 28 Q50 20 18 28 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/>
        <!-- Front Pocket -->
        <rect x="26" y="52" width="48" height="34" rx="8" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3"/>
        <path d="M26 62 Q50 70 74 62" stroke="#fca5a5" stroke-width="3" fill="none"/>
        <!-- Buckles / Badges -->
        <rect x="34" y="44" width="8" height="12" rx="2" fill="#fbbf24" stroke="#78350f" stroke-width="2"/>
        <rect x="58" y="44" width="8" height="12" rx="2" fill="#fbbf24" stroke="#78350f" stroke-width="2"/>
        <!-- Side Pockets -->
        <rect x="12" y="50" width="8" height="26" rx="4" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
        <rect x="80" y="50" width="8" height="26" rx="4" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
        <!-- Cute Star Emblem -->
        <polygon points="50,70 52,75 57,75 53,78 55,83 50,80 45,83 47,78 43,75 48,75" fill="#fde047"/>
      </svg>
    `;
  },

  // 2. Stack of Books (Draggable)
  getBooksSvg(width = 85, height = 75) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 110 95" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-books">
        <!-- Shadow -->
        <ellipse cx="55" cy="88" rx="45" ry="6" fill="rgba(0,0,0,0.25)"/>
        <!-- Bottom Book (Blue) -->
        <rect x="12" y="62" width="86" height="22" rx="5" fill="#2563eb" stroke="#1e3a8a" stroke-width="3"/>
        <rect x="16" y="66" width="76" height="14" rx="2" fill="#f8fafc"/>
        <path d="M12 62 L12 84" stroke="#1d4ed8" stroke-width="6"/>
        <line x1="28" y1="73" x2="84" y2="73" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Middle Book (Green) -->
        <rect x="18" y="42" width="78" height="20" rx="5" fill="#059669" stroke="#064e3b" stroke-width="3"/>
        <rect x="22" y="46" width="68" height="12" rx="2" fill="#f8fafc"/>
        <path d="M18 42 L18 62" stroke="#047857" stroke-width="6"/>
        <line x1="32" y1="52" x2="80" y2="52" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Top Book (Red / Gold Spine) -->
        <rect x="24" y="22" width="70" height="20" rx="5" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>
        <rect x="28" y="26" width="60" height="12" rx="2" fill="#fef08a"/>
        <path d="M24 22 L24 42" stroke="#b91c1c" stroke-width="6"/>
        <circle cx="58" cy="32" r="3" fill="#f59e0b"/>
      </svg>
    `;
  },

  // 3. Sneakers / Shoes (Draggable)
  getShoesSvg(width = 80, height = 65) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-shoes">
        <ellipse cx="50" cy="74" rx="42" ry="6" fill="rgba(0,0,0,0.25)"/>
        <!-- Left Shoe -->
        <path d="M10 52 C10 40 22 34 32 38 L42 44 C48 46 50 56 46 62 L12 62 Z" fill="#f59e0b" stroke="#78350f" stroke-width="3"/>
        <rect x="10" y="58" width="38" height="8" rx="3" fill="#f8fafc" stroke="#78350f" stroke-width="2"/>
        <path d="M22 36 L24 46 M28 38 L30 48 M34 40 L36 50" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <circle cx="16" cy="56" r="3" fill="#ea580c"/>
        <!-- Right Shoe -->
        <path d="M52 52 C52 40 64 34 74 38 L84 44 C90 46 92 56 88 62 L54 62 Z" fill="#f59e0b" stroke="#78350f" stroke-width="3"/>
        <rect x="52" y="58" width="38" height="8" rx="3" fill="#f8fafc" stroke="#78350f" stroke-width="2"/>
        <path d="M64 36 L66 46 M70 38 L72 48 M76 40 L78 50" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <circle cx="58" cy="56" r="3" fill="#ea580c"/>
      </svg>
    `;
  },

  // 4. Teddy Bear (Draggable)
  getTeddySvg(width = 80, height = 85) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 100 105" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-teddy">
        <ellipse cx="50" cy="98" rx="34" ry="6" fill="rgba(0,0,0,0.25)"/>
        <!-- Ears -->
        <circle cx="30" cy="26" r="14" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <circle cx="30" cy="26" r="7" fill="#fde68a"/>
        <circle cx="70" cy="26" r="14" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <circle cx="70" cy="26" r="7" fill="#fde68a"/>
        <!-- Arms -->
        <ellipse cx="20" cy="62" rx="10" ry="16" transform="rotate(20 20 62)" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <ellipse cx="80" cy="62" rx="10" ry="16" transform="rotate(-20 80 62)" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <!-- Legs -->
        <ellipse cx="32" cy="86" rx="12" ry="14" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <circle cx="32" cy="88" r="6" fill="#fde68a"/>
        <ellipse cx="68" cy="86" rx="12" ry="14" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <circle cx="68" cy="88" r="6" fill="#fde68a"/>
        <!-- Body -->
        <ellipse cx="50" cy="66" rx="26" ry="24" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <ellipse cx="50" cy="68" rx="16" ry="15" fill="#fde68a"/>
        <!-- Head -->
        <circle cx="50" cy="38" r="24" fill="#d97706" stroke="#78350f" stroke-width="3"/>
        <!-- Eyes -->
        <circle cx="42" cy="34" r="3.5" fill="#1e293b"/>
        <circle cx="58" cy="34" r="3.5" fill="#1e293b"/>
        <!-- Muzzle -->
        <ellipse cx="50" cy="44" rx="11" ry="8" fill="#fde68a" stroke="#78350f" stroke-width="2"/>
        <polygon points="50,40 46,44 54,44" fill="#451a03"/>
        <path d="M50 44 L50 48 M46 48 Q50 52 54 48" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
        <!-- Cute Bowtie -->
        <polygon points="50,54 42,50 42,58" fill="#ef4444"/>
        <polygon points="50,54 58,50 58,58" fill="#ef4444"/>
        <circle cx="50" cy="54" r="3" fill="#b91c1c"/>
      </svg>
    `;
  },

  // 5. Folded T-Shirt / Clothes (Draggable)
  getClothesSvg(width = 80, height = 70) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-clothes">
        <ellipse cx="50" cy="82" rx="40" ry="6" fill="rgba(0,0,0,0.25)"/>
        <!-- Main Folded Shirt (Teal) -->
        <path d="M22 28 L38 18 C44 24 56 24 62 18 L78 28 L88 40 L76 48 L72 38 L72 78 L28 78 L28 38 L24 48 L12 40 Z" fill="#0d9488" stroke="#115e59" stroke-width="3.5"/>
        <!-- Collar -->
        <path d="M38 18 Q50 30 62 18" stroke="#115e59" stroke-width="3" fill="#ccfbf1"/>
        <!-- Stripes -->
        <line x1="32" y1="52" x2="68" y2="52" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
        <line x1="32" y1="64" x2="68" y2="64" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;
  },

  // 6. Colored Pencil (Draggable)
  getPencilSvg(color = "#0284c7", width = 75, height = 30) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-pencil">
        <ellipse cx="50" cy="35" rx="42" ry="4" fill="rgba(0,0,0,0.2)"/>
        <!-- Eraser -->
        <rect x="8" y="12" width="14" height="16" rx="3" fill="#f472b6" stroke="#9d174d" stroke-width="2"/>
        <rect x="22" y="11" width="6" height="18" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
        <!-- Pencil Body -->
        <rect x="28" y="12" width="50" height="16" fill="${color}" stroke="#0f172a" stroke-width="2"/>
        <line x1="28" y1="17" x2="78" y2="17" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
        <!-- Wooden Tip -->
        <polygon points="78,12 92,20 78,28" fill="#fde68a" stroke="#78350f" stroke-width="2"/>
        <!-- Graphite Core -->
        <polygon points="88,18 92,20 88,22" fill="#1e293b"/>
      </svg>
    `;
  },

  // 7. Golden Key (Lost Item)
  getKeySvg(width = 65, height = 45) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-key">
        <circle cx="25" cy="30" r="16" fill="#facc15" stroke="#854d0e" stroke-width="4"/>
        <circle cx="25" cy="30" r="7" fill="#fef08a" stroke="#854d0e" stroke-width="2"/>
        <rect x="38" y="26" width="34" height="8" rx="3" fill="#facc15" stroke="#854d0e" stroke-width="3"/>
        <rect x="58" y="34" width="6" height="10" rx="2" fill="#eab308" stroke="#854d0e" stroke-width="2"/>
        <rect x="66" y="34" width="6" height="14" rx="2" fill="#eab308" stroke="#854d0e" stroke-width="2"/>
      </svg>
    `;
  },

  // 8. Blue Hat / Cap (Lost Item)
  getHatSvg(width = 75, height = 55) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-hat">
        <!-- Crown -->
        <path d="M18 48 C18 20 62 20 62 48 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="4"/>
        <circle cx="40" cy="22" r="3" fill="#facc15"/>
        <!-- Visor / Peak -->
        <path d="M48 48 C60 48 84 52 84 56 C84 60 55 60 16 54 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="3"/>
        <!-- Eyelets -->
        <circle cx="34" cy="32" r="2" fill="#93c5fd"/>
        <circle cx="46" cy="32" r="2" fill="#93c5fd"/>
      </svg>
    `;
  },

  // 9. Red Notebook (Lost Item)
  getNotebookSvg(width = 65, height = 75) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-asset svg-notebook">
        <!-- Notebook Cover -->
        <rect x="14" y="10" width="58" height="72" rx="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>
        <!-- Label Area -->
        <rect x="24" y="24" width="38" height="24" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="30" y1="32" x2="56" y2="32" stroke="#94a3b8" stroke-width="2"/>
        <line x1="30" y1="40" x2="50" y2="40" stroke="#94a3b8" stroke-width="2"/>
        <!-- Spiral Binding Left -->
        <rect x="10" y="16" width="8" height="6" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
        <rect x="10" y="28" width="8" height="6" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
        <rect x="10" y="40" width="8" height="6" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
        <rect x="10" y="52" width="8" height="6" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
        <rect x="10" y="64" width="8" height="6" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
      </svg>
    `;
  },

  // 10. Visual Action Cards for Level 8 Sequencing
  getSeqCardSvg(stepId) {
    switch (stepId) {
      case "seq_1": // Toys in box
        return `
          <svg width="90" height="75" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="35" width="50" height="38" rx="6" fill="#ec4899" stroke="#831843" stroke-width="3"/>
            <polygon points="50,15 42,32 58,32" fill="#f59e0b"/>
            <circle cx="50" cy="20" r="10" fill="#d97706"/>
            <path d="M30 45 L70 45" stroke="#fbcfe8" stroke-width="3"/>
          </svg>
        `;
      case "seq_2": // Books on shelf
        return `
          <svg width="90" height="75" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="10" width="70" height="62" rx="4" fill="#a16207" stroke="#451a03" stroke-width="3"/>
            <line x1="15" y1="45" x2="85" y2="45" stroke="#ca8a04" stroke-width="4"/>
            <rect x="25" y="20" width="10" height="24" fill="#dc2626"/>
            <rect x="37" y="20" width="12" height="24" fill="#2563eb"/>
            <rect x="51" y="20" width="10" height="24" fill="#059669"/>
          </svg>
        `;
      case "seq_3": // Clothes in basket
        return `
          <svg width="90" height="75" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="32" width="50" height="42" rx="8" fill="#eab308" stroke="#713f12" stroke-width="3"/>
            <path d="M32 20 L45 28 L68 18 L55 35 Z" fill="#0d9488" stroke="#115e59" stroke-width="2"/>
          </svg>
        `;
      case "seq_4": // Shoes near door
        return `
          <svg width="90" height="75" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="10" width="35" height="65" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
            <ellipse cx="25" cy="65" rx="14" ry="8" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
            <ellipse cx="38" cy="62" rx="14" ry="8" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
          </svg>
        `;
      case "seq_5": // Clean floor with broom
        return `
          <svg width="90" height="75" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="30" y1="15" x2="65" y2="55" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
            <polygon points="58,48 76,68 52,68" fill="#facc15" stroke="#a16207" stroke-width="2"/>
            <!-- Sparkles -->
            <polygon points="75,25 78,30 83,30 79,33 81,38 75,35 69,38 71,33 67,30 72,30" fill="#38bdf8"/>
            <polygon points="25,55 27,58 31,58 28,60 29,64 25,62 21,64 22,60 19,58 23,58" fill="#38bdf8"/>
          </svg>
        `;
      default:
        return `<span style="font-size: 3rem;">📦</span>`;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_SVG;
}
