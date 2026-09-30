/**
 * ENGLISH ADVENTURE ACADEMY — THEMATIC CHARACTER COMPANIONS & BADGES (v2.0)
 * 
 * Provides interactive, changeable character companion badges for:
 * - Grade 4 (4A & 4B): Alice in Wonderland Fantasy
 * - Grade 3 (3A & 3B): Korean Traditional Festivals & Folk Games
 */

(function(root) {
  'use strict';

  const THEME_COMPANIONS = {
    // Alice in Wonderland Badges (Grade 4)
    "alice": {
      name: "Alice",
      title: "Curious Explorer",
      icon: "👗",
      quote: "Curiouser and curiouser!",
      color: "#38bdf8",
      bgGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#0284c7",
      decor: "♠ ♥ ♦ ♣"
    },
    "mad_hatter": {
      name: "The Mad Hatter",
      title: "Master of Riddles & Tea",
      icon: "🎩",
      quote: "Why is a raven like a writing desk?",
      color: "#c084fc",
      bgGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#9333ea",
      decor: "♠ ♥ ♦ ♣"
    },
    "cheshire_cat": {
      name: "The Cheshire Cat",
      title: "Enigmatic Trickster",
      icon: "😸",
      quote: "We're all mad here.",
      color: "#f472b6",
      bgGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#db2777",
      decor: "♠ ♥ ♦ ♣"
    },
    "white_rabbit": {
      name: "The White Rabbit",
      title: "Herald & Timekeeper",
      icon: "⏱️",
      quote: "I'm late, I'm late for an important date!",
      color: "#fbbf24",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#d97706",
      decor: "♠ ♥ ♦ ♣"
    },
    "queen_of_hearts": {
      name: "Queen of Hearts",
      title: "Ruler of Wonderland",
      icon: "👑",
      quote: "Off with their heads!",
      color: "#f87171",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#dc2626",
      decor: "♠ ♥ ♦ ♣"
    },
    "red_queen": {
      name: "Red Queen",
      title: "Sovereign of the Crimson Court",
      icon: "👑",
      quote: "Off with their heads!",
      color: "#f87171",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#dc2626",
      decor: "♠ ♥ ♦ ♣"
    },
    "white_queen": {
      name: "White Queen",
      title: "Grace of Marmoreal",
      icon: "✨",
      quote: "Grace, courage, and the Vorpal blade!",
      color: "#e0e7ff",
      bgGradient: "linear-gradient(135deg, rgba(224, 231, 255, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#818cf8",
      decor: "♠ ♥ ♦ ♣"
    },
    "caterpillar": {
      name: "The Wise Caterpillar",
      title: "Philosopher of the Mushroom",
      icon: "🐛",
      quote: "Who... are... you?",
      color: "#34d399",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#059669",
      decor: "♠ ♥ ♦ ♣"
    },
    "absolem": {
      name: "Absolem",
      title: "Philosopher of the Mushroom",
      icon: "🐛",
      quote: "Who... are... you?",
      color: "#34d399",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#059669",
      decor: "♠ ♥ ♦ ♣"
    },
    "march_hare": {
      name: "March Hare",
      title: "Tea Party Guild Madcap",
      icon: "🫖",
      quote: "Have some tea! There isn't any!",
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#d97706",
      decor: "♠ ♥ ♦ ♣"
    },
    "bayard": {
      name: "Bayard Dog",
      title: "Noble Trueheart Bloodhound",
      icon: "🐶",
      quote: "I follow the scent of honor!",
      color: "#d97706",
      bgGradient: "linear-gradient(135deg, rgba(217, 119, 6, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#b45309",
      decor: "♠ ♥ ♦ ♣"
    },
    "bandersnatch": {
      name: "Bandersnatch",
      title: "Frumious Guardian",
      icon: "🐾",
      quote: "Ferocious loyalty to true companions!",
      color: "#94a3b8",
      bgGradient: "linear-gradient(135deg, rgba(148, 163, 184, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#64748b",
      decor: "♠ ♥ ♦ ♣"
    },
    "dragon": {
      name: "Dragon (Jabberwocky)",
      title: "Terror of Tulgey Wood",
      icon: "🐉",
      quote: "Beware the jaws that bite, the claws that catch!",
      color: "#ef4444",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#b91c1c",
      decor: "♠ ♥ ♦ ♣"
    },
    "jabberwocky": {
      name: "Jabberwocky Dragon",
      title: "Terror of Tulgey Wood",
      icon: "🐉",
      quote: "Beware the jaws that bite, the claws that catch!",
      color: "#ef4444",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#b91c1c",
      decor: "♠ ♥ ♦ ♣"
    },
    "dormouse": {
      name: "Dormouse",
      title: "Teapot Sentry & Dreamer",
      icon: "🐭",
      quote: "Feed your head with cheese and cozy naps!",
      color: "#a855f7",
      bgGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#7e22ce",
      decor: "♠ ♥ ♦ ♣"
    },
    "knave_of_hearts": {
      name: "Knave of Hearts",
      title: "Champion of the Royal Guard",
      icon: "⚔️",
      quote: "I fight with valor, loyalty, and truth!",
      color: "#f87171",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#b91c1c",
      decor: "♠ ♥ ♦ ♣"
    },
    "king_of_hearts": {
      name: "King of Hearts",
      title: "Monarch of Wonderland",
      icon: "🤴",
      quote: "Rule with patience, wisdom, and justice.",
      color: "#fbbf24",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#d97706",
      decor: "♠ ♥ ♦ ♣"
    },

    // Korean Traditions & Games Badges (Grade 3)
    "ddakji": {
      name: "Ddakji Striker",
      title: "Master of Paper Flipping (딱지치기)",
      icon: "🎴",
      quote: "Focus your energy and strike the ground!",
      color: "#38bdf8",
      bgGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#0284c7",
      decor: "🏮 🎴 🪵"
    },
    "yut_nori": {
      name: "Yut Nori Master",
      title: "Grand Board Strategist (윷놀이)",
      icon: "🪵",
      quote: "Cast the sticks: Do, Gae, Geol, Yut, Mo!",
      color: "#fbbf24",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#d97706",
      decor: "🏮 🎴 🪵"
    },
    "tuho": {
      name: "Tuho Archer",
      title: "Royal Arrow Pitcher (투호)",
      icon: "🏹",
      quote: "Breathe, aim true, and land in the jar!",
      color: "#f87171",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#dc2626",
      decor: "🏮 🎴 🪵"
    },
    "hanbok_dancer": {
      name: "Hanbok Dancer",
      title: "Graceful Silk Dancer (한복무용)",
      icon: "👘",
      quote: "Spinning colors of joy and harmony!",
      color: "#ec4899",
      bgGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#db2777",
      decor: "🏮 🎴 🪵"
    },
    "mask_dancer": {
      name: "Mask Dancer",
      title: "Talchum Master (탈춤)",
      icon: "🎭",
      quote: "Expressing joy and courage behind the mask!",
      color: "#f97316",
      bgGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#ea580c",
      decor: "🏮 🎴 🪵"
    },
    "drum_master": {
      name: "Drum Master",
      title: "Buk & Janggu Performer (사물놀이)",
      icon: "🥁",
      quote: "Feel the thunder of the festival rhythm!",
      color: "#eab308",
      bgGradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#ca8a04",
      decor: "🏮 🎴 🪵"
    },
    "kite_flyer": {
      name: "Kite Flyer",
      title: "Yeonnalligi Champion (연날리기)",
      icon: "🪁",
      quote: "Soaring high into the bright autumn skies!",
      color: "#06b6d4",
      bgGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#0891b2",
      decor: "🏮 🎴 🪵"
    },
    "neolttwigi": {
      name: "Neolttwigi Acrobat",
      title: "Seesaw Acrobat (널뛰기)",
      icon: "🤸",
      quote: "Leaping high with balance and courage!",
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#7c3aed",
      decor: "🏮 🎴 🪵"
    },
    "songpyeon_chef": {
      name: "Songpyeon Chef",
      title: "Chuseok Rice Cake Artisan (송편)",
      icon: "🥟",
      quote: "Wrapping sweet memories in pine needle aroma!",
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#059669",
      decor: "🏮 🎴 🪵"
    },
    "rice_cake_maker": {
      name: "Rice Cake Maker",
      title: "Tteok Hammer Craftsman (떡메치기)",
      icon: "🍡",
      quote: "Pounding tradition with rhythm and strength!",
      color: "#14b8a6",
      bgGradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#0d9488",
      decor: "🏮 🎴 🪵"
    },
    "lotus_lantern": {
      name: "Lotus Artisan",
      title: "Festival Lantern Weaver (연등축제)",
      icon: "🏮",
      quote: "Lighting the path with bright wishes!",
      color: "#f472b6",
      bgGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#db2777",
      decor: "🏮 🎴 🪵"
    },
    "gonggi": {
      name: "Gonggi Champion",
      title: "Pebble Juggling Prodigy (공기놀이)",
      icon: "✨",
      quote: "Quick hands and perfect balance!",
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(15, 23, 42, 0.9))",
      border: "#059669",
      decor: "🏮 🎴 🪵"
    }
  };

  const CHARACTER_ICON_PRESETS = {
    grade4_alice: [
      { key: "mad_hatter", name: "Mad Hatter", icon: "🎩", altIcons: ["🎩", "🫖", "☕", "🍰", "🎉"] },
      { key: "cheshire_cat", name: "Cheshire Cat", icon: "😸", altIcons: ["😸", "🐱", "🐾", "✨", "🌙"] },
      { key: "white_rabbit", name: "White Rabbit", icon: "⏱️", altIcons: ["⏱️", "🐇", "🐰", "⌛", "🎺"] },
      { key: "queen_of_hearts", name: "Queen of Hearts", icon: "👑", altIcons: ["👑", "❤️", "🌹", "🎴", "🏰"] },
      { key: "alice", name: "Alice", icon: "👗", altIcons: ["👗", "👱‍♀️", "🎀", "📖", "🗝️"] },
      { key: "caterpillar", name: "Caterpillar", icon: "🐛", altIcons: ["🐛", "🍄", "💨", "🌿", "🔮"] },
      { key: "dormouse", name: "Dormouse", icon: "🐭", altIcons: ["🐭", "🧀", "🫖", "💤", "🪺"] },
      { key: "march_hare", name: "March Hare", icon: "🫖", altIcons: ["🫖", "🐇", "☕", "🤪", "🧁"] },
      { key: "knave_of_hearts", name: "Knave of Hearts", icon: "⚔️", altIcons: ["⚔️", "🛡️", "🥧", "🃏", "❤️"] },
      { key: "king_of_hearts", name: "King of Hearts", icon: "🤴", altIcons: ["🤴", "👑", "⚖️", "🏰", "📜"] }
    ],
    grade3_korean: [
      { key: "ddakji", name: "Ddakji Striker", icon: "🎴", altIcons: ["🎴", "🟦", "🟥", "💥", "🏆"] },
      { key: "yut_nori", name: "Yut Nori Master", icon: "🪵", altIcons: ["🪵", "🎲", "🎯", "🥢", "📜"] },
      { key: "tuho", name: "Tuho Archer", icon: "🏹", altIcons: ["🏹", "🏺", "🎯", "⚡", "🎖️"] },
      { key: "hanbok_dancer", name: "Hanbok Dancer", icon: "👘", altIcons: ["👘", "🌸", "🪭", "💃", "✨"] },
      { key: "mask_dancer", name: "Mask Dancer", icon: "🎭", altIcons: ["🎭", "🦁", "🎪", "🎊", "🔥"] },
      { key: "drum_master", name: "Drum Master", icon: "🥁", altIcons: ["🥁", "🪘", "🎶", "⚡", "🎵"] },
      { key: "kite_flyer", name: "Kite Flyer", icon: "🪁", altIcons: ["🪁", "🎏", "☁️", "🌬️", "🌈"] },
      { key: "neolttwigi", name: "Neolttwigi Acrobat", icon: "🤸", altIcons: ["🤸", "🪵", "🚀", "🌟", "🎪"] },
      { key: "songpyeon_chef", name: "Songpyeon Chef", icon: "🥟", altIcons: ["🥟", "🌾", "🌲", "🍯", "🍂"] },
      { key: "rice_cake_maker", name: "Rice Cake Maker", icon: "🍡", altIcons: ["🍡", "🔨", "🍚", "🥢", "🍵"] }
    ]
  };

  const CLASSROOM_THEMES = {
    grade4: {
      pattern: /4[A-Za-z]|Grade\s*4/i,
      cssClass: "theme-alice-wonderland",
      coverImage: "assets/themes/grade-4/alice-wonderland.jpeg",
      title: "Wonderland Academy",
      subtitle: "Curious Minds & Mad Riddles • Term 2"
    },
    grade3: {
      pattern: /3[A-Za-z]|Grade\s*3/i,
      cssClass: "theme-korean-traditions",
      coverImage: "assets/themes/grade-3/korean-festival.jpeg",
      title: "Korean Cultural Plaza",
      subtitle: "Traditional Festivals & Folk Games • Term 2"
    }
  };

  function updateClassroomTheme(selectedClass) {
    const container = document.getElementById('classroom-view') || document.getElementById('app-view-container') || document.body;
    const heroBanner = document.getElementById('classroom-hero-banner');
    const heroTitle = document.getElementById('classroom-hero-title');
    const heroSubtitle = document.getElementById('classroom-hero-subtitle');

    // Reset themes
    document.body.classList.remove('theme-alice-wonderland', 'theme-korean-traditions');
    if (container && container !== document.body) {
      container.classList.remove('theme-alice-wonderland', 'theme-korean-traditions');
    }

    let activeTheme = null;
    const classNameStr = String(selectedClass || '');
    if (CLASSROOM_THEMES.grade4.pattern.test(classNameStr)) {
      activeTheme = CLASSROOM_THEMES.grade4;
    } else if (CLASSROOM_THEMES.grade3.pattern.test(classNameStr)) {
      activeTheme = CLASSROOM_THEMES.grade3;
    }

    if (activeTheme) {
      document.body.classList.add(activeTheme.cssClass);
      if (container && container !== document.body) container.classList.add(activeTheme.cssClass);
      if (heroBanner) {
        heroBanner.style.backgroundImage = `linear-gradient(180deg, rgba(6, 9, 17, 0.2) 0%, rgba(6, 9, 17, 0.85) 100%), url('${activeTheme.coverImage}')`;
        heroBanner.classList.add('active-theme-cover');
        heroBanner.style.display = 'flex';
      }
      if (heroTitle) heroTitle.innerText = `${activeTheme.title} • ${classNameStr}`;
      if (heroSubtitle) heroSubtitle.innerText = activeTheme.subtitle;
    } else {
      if (heroBanner) {
        heroBanner.style.backgroundImage = "";
        heroBanner.classList.remove('active-theme-cover');
        heroBanner.style.display = 'none';
      }
    }
  }

  function resolveStudentCompanion(student) {
    if (!student) return THEME_COMPANIONS["alice"];
    const isGrade3 = /3[A-Za-z]|Grade\s*3/i.test(student.grade || student.classId || "");
    const rawKey = String(student.aliceCharacter || student.koreanRole || (isGrade3 ? "ddakji" : "alice")).toLowerCase().trim().replace(/[\s-]+/g, '_');
    
    // Direct or alias lookup
    if (THEME_COMPANIONS[rawKey]) return THEME_COMPANIONS[rawKey];
    if (rawKey.includes('hatter')) return THEME_COMPANIONS["mad_hatter"];
    if (rawKey.includes('cat') || rawKey.includes('cheshire')) return THEME_COMPANIONS["cheshire_cat"];
    if (rawKey.includes('rabbit')) return THEME_COMPANIONS["white_rabbit"];
    if (rawKey.includes('red_queen') || rawKey.includes('queen_of_hearts')) return THEME_COMPANIONS["queen_of_hearts"] || THEME_COMPANIONS["red_queen"];
    if (rawKey.includes('white_queen')) return THEME_COMPANIONS["white_queen"];
    if (rawKey.includes('caterpillar') || rawKey.includes('absolem')) return THEME_COMPANIONS["caterpillar"];
    if (rawKey.includes('hare')) return THEME_COMPANIONS["march_hare"];
    if (rawKey.includes('knave')) return THEME_COMPANIONS["knave_of_hearts"];
    if (rawKey.includes('king')) return THEME_COMPANIONS["king_of_hearts"];
    if (rawKey.includes('bayard') || rawKey.includes('dog')) return THEME_COMPANIONS["bayard"];
    if (rawKey.includes('bander')) return THEME_COMPANIONS["bandersnatch"];
    if (rawKey.includes('dragon') || rawKey.includes('jabber')) return THEME_COMPANIONS["dragon"];
    if (rawKey.includes('dormouse') || rawKey.includes('mouse')) return THEME_COMPANIONS["dormouse"];
    if (rawKey.includes('alice')) return THEME_COMPANIONS["alice"];

    if (rawKey.includes('ddakji')) return THEME_COMPANIONS["ddakji"];
    if (rawKey.includes('yut')) return THEME_COMPANIONS["yut_nori"];
    if (rawKey.includes('tuho') || rawKey.includes('arrow')) return THEME_COMPANIONS["tuho"];
    if (rawKey.includes('hanbok')) return THEME_COMPANIONS["hanbok_dancer"];
    if (rawKey.includes('mask') || rawKey.includes('talchum')) return THEME_COMPANIONS["mask_dancer"];
    if (rawKey.includes('drum') || rawKey.includes('janggu') || rawKey.includes('buk')) return THEME_COMPANIONS["drum_master"];
    if (rawKey.includes('kite') || rawKey.includes('yeonnalligi')) return THEME_COMPANIONS["kite_flyer"];
    if (rawKey.includes('neolttwigi') || rawKey.includes('acrobat')) return THEME_COMPANIONS["neolttwigi"];
    if (rawKey.includes('songpyeon')) return THEME_COMPANIONS["songpyeon_chef"];
    if (rawKey.includes('rice_cake') || rawKey.includes('tteok')) return THEME_COMPANIONS["rice_cake_maker"];
    if (rawKey.includes('lantern') || rawKey.includes('lotus')) return THEME_COMPANIONS["lotus_lantern"];
    if (rawKey.includes('gonggi')) return THEME_COMPANIONS["gonggi"];
    
    return isGrade3 ? THEME_COMPANIONS["ddakji"] : THEME_COMPANIONS["alice"];
  }

  function getStudentBadge(student) {
    if (!student) return { icon: '✨', role: 'Student', name: 'Student', title: '', quote: '' };
    const comp = resolveStudentCompanion(student);
    const icon = student.customIcon || student.custom_icon || (comp ? comp.icon : '✨');
    const role = comp ? comp.name : (student.aliceCharacter || student.koreanRole || 'Student');
    return {
      icon: icon,
      role: role,
      name: role,
      title: comp ? comp.title : '',
      quote: comp ? comp.quote : ''
    };
  }

  function renderStudentThemeBadge(student) {
    if (!student) return '';
    const char = resolveStudentCompanion(student);
    const activeIcon = student.customIcon || char.icon;

    return `
      <div class="thematic-companion-card" style="background: ${char.bgGradient}; border: 1.5px solid ${char.border};">
        <div class="thematic-char-icon-wrapper" onclick="openCharacterIconPicker('${student.id}')" title="Click to change companion icon">
          <span class="thematic-char-icon">${activeIcon}</span>
          <span class="thematic-icon-edit-tag">✏️</span>
        </div>

        <div class="thematic-char-info" style="flex:1;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <span class="thematic-tag">Term 2 Companion</span>
            <button type="button" class="btn-change-char-role" onclick="openCharacterIconPicker('${student.id}')">Swap Role ▾</button>
          </div>
          <h4 style="color: ${char.color}; margin: 2px 0 0 0; font-size: 1.15rem; font-weight: 800;">${char.name}</h4>
          <p class="thematic-char-role">${char.title}</p>
          <span class="thematic-quote">“${char.quote}”</span>
        </div>
        <div class="thematic-card-decor">${char.decor}</div>
      </div>
    `;
  }

  function openCharacterIconPicker(studentId) {
    const students = window.AdventureAcademy?.students 
      || (window.schoolStore && window.schoolStore.getStudents && window.schoolStore.getStudents())
      || JSON.parse(localStorage.getItem('adventure_students') || '[]');
      
    const student = students.find(s => String(s.id) === String(studentId) || String(s.studentIdNumber) === String(studentId));
    if (!student) return;

    const isGrade3 = /3[A-Za-z]|Grade\s*3/i.test(student.grade || student.classId || "");
    const presets = isGrade3 ? CHARACTER_ICON_PRESETS.grade3_korean : CHARACTER_ICON_PRESETS.grade4_alice;

    let modalEl = document.getElementById('char-icon-picker-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'char-icon-picker-modal';
      modalEl.className = 'char-picker-backdrop';
      document.body.appendChild(modalEl);
    }

    const currentRole = (student.aliceCharacter || student.koreanRole || '').toLowerCase();

    modalEl.innerHTML = `
      <div class="char-picker-card">
        <div class="char-picker-header">
          <h3>Choose Companion &amp; Icon</h3>
          <button class="char-picker-close" onclick="closeCharacterIconPicker()">✕</button>
        </div>
        <p class="char-picker-sub">Select a role and icon for <strong>${student.name || (student.firstName + ' ' + (student.lastName || '')).trim()}</strong>:</p>

        <div class="char-picker-grid">
          ${presets.map(item => `
            <div class="char-option-row ${(currentRole === item.key.toLowerCase()) ? 'selected-row' : ''}">
              <div class="char-option-info" onclick="saveStudentCharacterRole('${student.id}', '${item.key}', '${item.icon}')">
                <span class="char-option-icon">${item.icon}</span>
                <div>
                  <strong>${item.name}</strong>
                </div>
              </div>
              <div class="char-icon-swatches">
                ${item.altIcons.map(ic => `
                  <button type="button" class="btn-icon-swatch ${student.customIcon === ic ? 'active-swatch' : ''}" 
                          onclick="saveStudentCharacterRole('${student.id}', '${item.key}', '${ic}')">
                    ${ic}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modalEl.style.display = 'flex';
  }

  function closeCharacterIconPicker() {
    const modalEl = document.getElementById('char-icon-picker-modal');
    if (modalEl) modalEl.style.display = 'none';
  }

  function saveStudentCharacterRole(studentId, newRoleKey, newIcon) {
    let students = window.AdventureAcademy?.students || JSON.parse(localStorage.getItem('adventure_students') || '[]');
    let student = students.find(s => String(s.id) === String(studentId) || String(s.studentIdNumber) === String(studentId));
    
    // Check in master store
    if (window.schoolStore && window.schoolStore.getStudent) {
      const storeStudent = window.schoolStore.getStudent(studentId);
      if (storeStudent) {
        student = storeStudent;
      }
    }
    if (!student) return;

    const isGrade3 = /3[A-Za-z]|Grade\s*3/i.test(student.grade || student.classId || "");
    if (isGrade3) {
      student.koreanRole = newRoleKey;
      student.korean_role = newRoleKey;
    } else {
      student.aliceCharacter = newRoleKey;
      student.alice_character = newRoleKey;
    }
    student.customIcon = newIcon;
    student.custom_icon = newIcon;

    if (!student.avatarConfig) student.avatarConfig = {};
    student.avatarConfig.customIcon = newIcon;

    // Persist locally across both keys
    try {
      localStorage.setItem('adventure_students', JSON.stringify(students));
    } catch (e) {}

    if (window.schoolStore) {
      window.schoolStore.saveState();
      window.schoolStore.notify();
    }

    if (window.AdventureAcademy) window.AdventureAcademy.students = students;

    // Re-render student profile and active cards
    if (typeof window.openStudentDetail === 'function') {
      window.openStudentDetail(student.studentIdNumber || student.id);
    }
    if (typeof window.renderStudentRoster === 'function') {
      window.renderStudentRoster();
    } else if (typeof window.renderCurrentView === 'function') {
      window.renderCurrentView();
    }

    // Push updated custom character & icon to Supabase
    if (typeof window.forcePushToSupabase === 'function') {
      window.forcePushToSupabase([student]);
    } else if (typeof window.syncWithSupabaseCloud === 'function') {
      window.syncWithSupabaseCloud();
    } else if (window.AdventureSupabase && typeof window.AdventureSupabase.saveStudent === 'function') {
      window.AdventureSupabase.saveStudent(student);
    }

    closeCharacterIconPicker();
  }

  // Export to global root & window
  root.THEME_COMPANIONS = THEME_COMPANIONS;
  root.CHARACTER_ICON_PRESETS = CHARACTER_ICON_PRESETS;
  root.CLASSROOM_THEMES = CLASSROOM_THEMES;
  root.updateClassroomTheme = updateClassroomTheme;
  root.resolveStudentCompanion = resolveStudentCompanion;
  root.getStudentBadge = getStudentBadge;
  root.renderStudentThemeBadge = renderStudentThemeBadge;
  root.openCharacterIconPicker = openCharacterIconPicker;
  root.closeCharacterIconPicker = closeCharacterIconPicker;
  root.saveStudentCharacterRole = saveStudentCharacterRole;
  root.saveStudentCompanionRole = saveStudentCharacterRole;
  if (typeof window !== 'undefined') {
    window.openCharacterIconPicker = openCharacterIconPicker;
    window.closeCharacterIconPicker = closeCharacterIconPicker;
    window.saveStudentCharacterRole = saveStudentCharacterRole;
    window.saveStudentCompanionRole = saveStudentCharacterRole;
  }

})(typeof window !== 'undefined' ? window : global);
