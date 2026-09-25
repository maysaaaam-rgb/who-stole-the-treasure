/**
 * ENGLISH ADVENTURE ACADEMY — GAMIFICATION & EVOLUTION MILESTONES ENGINE
 * js/gamification-milestones.js
 * 
 * Provides:
 * 1. Illustrated Horizontal Evolution Progression Track with 3D isometric pedestals
 * 2. Tactile Physicalized Collectible Trading Badges & Achievements (Trophy Enamel Pins)
 * 3. Cinematic Full-Screen Hatching & Evolution Ceremony Overlay with Confetti & Web Audio
 */

(function(root) {
  'use strict';

  function getBadgeRarityTier(xp) {
    const numXP = Number(xp) || 0;
    if (numXP >= 400) {
      return {
        key: 'cosmic',
        label: 'Cosmic Violet Legendary',
        color: '#8b5cf6',
        cardClass: 'tier-cosmic-violet',
        tagText: 'Cosmic Violet'
      };
    } else if (numXP >= 200) {
      return {
        key: 'solar',
        label: 'Solar Amber',
        color: '#f59e0b',
        cardClass: 'tier-solar-amber',
        tagText: 'Solar Amber'
      };
    } else {
      return {
        key: 'emerald',
        label: 'Emerald Explorer',
        color: '#10b981',
        cardClass: 'tier-emerald-explorer',
        tagText: 'Emerald Explorer'
      };
    }
  }

  /**
   * 1. Illustrated Horizontal Evolution Journey Track
   * Replaces the administrative spreadsheet table with an interactive 7-stage track
   */
  function renderEvolutionJourney(levels, activeLevel = 1, options = {}) {
    const safeLevels = Array.isArray(levels) && levels.length > 0 ? levels : [
      { id: 'lvl-1', level: 1, name: 'Mystery Egg', stageKey: 'egg', xpRequired: 0, description: 'Dormant speckled egg.' },
      { id: 'lvl-2', level: 2, name: 'Cracking Egg', stageKey: 'cracking_egg', xpRequired: 30, description: 'Glowing fissures appear.' },
      { id: 'lvl-3', level: 3, name: 'Baby Monster', stageKey: 'baby', xpRequired: 200, description: 'Hatched baby monster.' },
      { id: 'lvl-4', level: 4, name: 'Growing Monster', stageKey: 'growing', xpRequired: 500, description: 'Stronger and taller.' },
      { id: 'lvl-5', level: 5, name: 'Adventurer Monster', stageKey: 'adventurer', xpRequired: 1000, description: 'Equipped with explorer fedora.' },
      { id: 'lvl-6', level: 6, name: 'Advanced Monster', stageKey: 'advanced', xpRequired: 2000, description: 'Majestic sweeping dragon wings.' },
      { id: 'lvl-7', level: 7, name: 'Ultimate Monster', stageKey: 'ultimate', xpRequired: 5000, description: 'The legendary sovereign form.' }
    ];

    const currentLevelNum = Number(activeLevel) || 1;
    const progressFraction = Math.min(1, Math.max(0, (currentLevelNum - 1) / Math.max(1, safeLevels.length - 1)));
    const conduitFillPct = Math.round(progressFraction * 100);

    const onEditFn = options.onEdit || 'openProgressionLevelEditorModal';

    return '' +
      '<div class="evolution-journey-container">' +
        '<div class="evolution-journey-header">' +
          '<div>' +
            '<h2 class="evolution-journey-title">' +
              '<span>🐾</span> <span>Interactive Evolution Journey (7 Growth Stages)</span>' +
            '</h2>' +
            '<p style="font-size:0.84rem; color:#94a3b8; margin:4px 0 0 0;">' +
              'From dormant Mystery Egg to celestial Ultimate Monster. Active stages illuminate the glowing energy conduit.' +
            '</p>' +
          '</div>' +
          '<div style="display:flex; gap:10px; align-items:center;">' +
            '<button type="button" class="btn-3d btn-3d-secondary" onclick="' + onEditFn + '(null)" style="font-size:0.82rem; padding:8px 14px;">' +
              '⚙️ Add Level Milestone' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="evolution-journey-track">' +
          '<!-- Glowing Energy Conduit Line -->' +
          '<div class="evolution-conduit-line">' +
            '<div class="evolution-conduit-fill" style="width: ' + conduitFillPct + '%;"></div>' +
          '</div>' +

          safeLevels.map((lvl) => {
            const isUnlocked = lvl.level <= currentLevelNum;
            const isActiveStage = lvl.level === currentLevelNum;
            const isEgg = lvl.stageKey === 'egg' || lvl.level === 1;

            const stageSvg = (window.renderMonsterSVG) ? window.renderMonsterSVG({
              stage: lvl.stageKey,
              color: 'blue',
              size: 80,
              animated: true
            }) : (isEgg ? '🥚' : '👾');

            return '' +
              '<div class="evolution-milestone-node ' + (isUnlocked ? 'is-unlocked ' : '') + (isActiveStage ? 'is-active-stage' : '') + '" ' +
                   'onclick="' + onEditFn + '(\'' + lvl.id + '\')" ' +
                   'title="Level ' + lvl.level + ': ' + lvl.name + ' (' + lvl.xpRequired.toLocaleString() + ' XP)">' +
                
                '<!-- Sleek Hover Gear/Pencil Icon -->' +
                '<button type="button" class="milestone-admin-gear" onclick="event.stopPropagation(); ' + onEditFn + '(\'' + lvl.id + '\');" title="Configure Level ' + lvl.level + '">' +
                  '✏️' +
                '</button>' +

                '<!-- 3D Isometric Pedestal Stage -->' +
                '<div class="pedestal-3d-wrap">' +
                  '<div class="stage-character-float">' +
                    stageSvg +
                  '</div>' +
                  '<div class="pedestal-isometric-3d"></div>' +
                '</div>' +

                '<!-- Metadata Card -->' +
                '<div class="milestone-meta-card">' +
                  '<div class="milestone-level-tag">Lvl ' + lvl.level + (isActiveStage ? ' • Current' : isUnlocked ? ' • Unlocked' : '') + '</div>' +
                  '<div class="milestone-title">' + lvl.name + '</div>' +
                  '<div class="milestone-xp-pill">⭐ ' + lvl.xpRequired.toLocaleString() + ' XP</div>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  /**
   * 2. Physicalized Collectible Trading Badges & Achievements
   */
  function renderBadgeTradingCard(badge, options = {}) {
    const tier = getBadgeRarityTier(badge.xpReward || 100);
    const isArchived = badge.status === 'archived' || badge.archived;
    const onAward = options.onAward || 'openAwardBadgeModal';
    const onEdit = options.onEdit || 'openEditBadgeModal';

    return '' +
      '<div class="badge-trading-card ' + tier.cardClass + ' ' + (isArchived ? 'is-archived' : '') + '" id="badge-card-' + badge.id + '">' +
        '<!-- Enamel Pin Bezel -->' +
        '<div class="badge-enamel-bezel">' +
          '<span class="badge-crest-icon">' + (badge.icon || '🎖️') + '</span>' +
        '</div>' +

        '<div class="badge-rarity-pill">' + tier.tagText + '</div>' +

        '<div class="badge-trading-name">' + badge.name + '</div>' +
        '<div class="badge-trading-desc">' + (badge.description || 'Awarded for exceptional adventure achievements.') + '</div>' +

        '<div style="font-size:0.8rem; font-weight:900; color:' + tier.color + '; margin-bottom:12px;">' +
          '⭐ +' + (badge.xpReward || 100) + ' XP' +
        '</div>' +

        '<!-- 3D Tactile Award Badge Push-Button -->' +
        '<button type="button" class="btn-3d btn-award-badge-3d" onclick="' + onAward + '(\'' + badge.id + '\')" title="Award ' + badge.name + ' to student">' +
          '<span>🎖️ Award Badge</span>' +
        '</button>' +

        '<div style="display:flex; justify-content:center; gap:8px; margin-top:8px; font-size:0.72rem;">' +
          '<button type="button" class="link-btn" onclick="' + onEdit + '(\'' + badge.id + '\')" style="background:none; border:none; color:#64748b; font-weight:700; cursor:pointer;">✏️ Edit</button>' +
        '</div>' +
      '</div>';
  }

  function renderAchievementTradingCard(ach, options = {}) {
    const tier = getBadgeRarityTier(ach.xpReward || 150);
    const isArchived = ach.status === 'archived' || ach.archived;
    const onEdit = options.onEdit || 'openEditAchievementModal';

    return '' +
      '<div class="badge-trading-card ' + tier.cardClass + ' ' + (isArchived ? 'is-archived' : '') + '" id="ach-card-' + ach.id + '">' +
        '<!-- Enamel Pin Bezel -->' +
        '<div class="badge-enamel-bezel">' +
          '<span class="badge-crest-icon">' + (ach.icon || '🏆') + '</span>' +
        '</div>' +

        '<div class="badge-rarity-pill">' + tier.tagText + '</div>' +

        '<div class="badge-trading-name">' + ach.name + '</div>' +
        '<div class="badge-trading-desc">' + (ach.requirement || ach.description || 'Complete milestone to unlock.') + '</div>' +

        '<div style="font-size:0.8rem; font-weight:900; color:' + tier.color + '; margin-bottom:12px;">' +
          '⭐ +' + (ach.xpReward || 150) + ' XP' +
        '</div>' +

        '<div style="font-size:0.75rem; font-weight:800; color:' + (isArchived ? '#ef4444' : '#059669') + '; padding:4px 10px; background:rgba(255,255,255,0.8); border-radius:999px;">' +
          (isArchived ? '📦 Archived' : '✓ Active Quest') +
        '</div>' +

        '<div style="display:flex; justify-content:center; gap:8px; margin-top:8px; font-size:0.72rem;">' +
          '<button type="button" class="link-btn" onclick="' + onEdit + '(\'' + ach.id + '\')" style="background:none; border:none; color:#64748b; font-weight:700; cursor:pointer;">✏️ Edit</button>' +
        '</div>' +
      '</div>';
  }

  /**
   * 3. Integrated Cinematic Hatching & Evolution Overlay
   */
  function triggerEvolutionCeremony(student, newStage) {
    if (!student) return;

    // Resolve student object if ID passed
    const std = (typeof student === 'string' && root.store && root.store.getStudent) 
      ? root.store.getStudent(student) 
      : student;
    if (!std) return;

    const studentName = std.firstName || std.name || 'Young Cadet';

    // Resolve stage details
    let stageTitle = 'New Evolution';
    let stageKey = 'baby';
    let stageDesc = 'Your companion has transformed into a stronger, wiser creature!';

    if (typeof newStage === 'object' && newStage !== null) {
      stageTitle = newStage.name || newStage.stageName || stageTitle;
      stageKey = newStage.stageKey || stageKey;
      stageDesc = newStage.description || stageDesc;
    } else if (typeof newStage === 'string') {
      stageTitle = newStage;
      stageKey = newStage.toLowerCase().replace(/\s+/g, '_');
    }

    // Play victory fanfare sound via global zero-dependency Web Audio
    if (root.academyAudio && typeof root.academyAudio.playFanfare === 'function') {
      root.academyAudio.playFanfare();
    } else if (typeof root.playHarmonicChime === 'function') {
      root.playHarmonicChime('levelUp');
    }

    // Remove any existing overlay
    const existing = document.getElementById('evolution-ceremony-overlay');
    if (existing) existing.remove();

    // Render monster SVG or image on the illuminated stage
    let spriteMarkup = '👾';
    if (root.renderMonsterSVG) {
      spriteMarkup = root.renderMonsterSVG({
        stage: stageKey,
        color: std.color || 'blue',
        size: 130,
        animated: true
      });
    } else {
      spriteMarkup = '<div style="font-size: 5rem;">🐾✨</div>';
    }

    const overlay = document.createElement('div');
    overlay.id = 'evolution-ceremony-overlay';
    overlay.innerHTML = '' +
      '<div class="ceremony-card">' +
        '<div class="ceremony-tag">🎉 CELESTIAL EVOLUTION COMPLETE</div>' +
        '<h1 class="ceremony-title">' + studentName + '\'s Monster Evolved!</h1>' +
        '<div class="ceremony-sub">Awakened into ' + stageTitle + '</div>' +

        '<div class="ceremony-stage-wrap">' +
          '<div class="ceremony-sprite-box">' +
            spriteMarkup +
          '</div>' +
          '<div class="ceremony-pedestal"></div>' +
        '</div>' +

        '<p class="ceremony-desc">' + stageDesc + '</p>' +

        '<div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; justify-content:center;">' +
          '<button type="button" class="btn-3d btn-ceremony-congratulate" id="btn-ceremony-claim">' +
            '<span>🏆 Congratulate &amp; Award +50 XP</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Trigger full-viewport confetti shower
    renderCeremonyConfetti();

    // Wire button action
    const claimBtn = document.getElementById('btn-ceremony-claim');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        // Award +50 XP
        if (root.store && root.store.awardStudentXP) {
          root.store.awardStudentXP(std.id, 50, 'Evolution Ceremony Bonus');
        } else if (root.SchoolStore && root.SchoolStore.awardStudentXP) {
          root.SchoolStore.awardStudentXP(std.id, 50);
        }

        if (root.academyAudio && typeof root.academyAudio.playCoin === 'function') {
          root.academyAudio.playCoin();
        }

        // Animate out and clean up
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          if (typeof root.renderCurrentView === 'function') {
            root.renderCurrentView();
          }
        }, 320);
      });
    }
  }

  function renderCeremonyConfetti() {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fde047'];
    for (let i = 0; i < 65; i++) {
      const conf = document.createElement('div');
      conf.className = 'ceremony-confetti';
      conf.style.left = Math.random() * 100 + 'vw';
      conf.style.top = '-20px';
      conf.style.background = colors[Math.floor(Math.random() * colors.length)];
      conf.style.animationDelay = (Math.random() * 1.5) + 's';
      conf.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
      conf.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 4200);
    }
  }

  // Exports
  const GamificationMilestones = {
    renderEvolutionJourney,
    renderBadgeTradingCard,
    renderAchievementTradingCard,
    triggerEvolutionCeremony
  };

  if (typeof window !== 'undefined') {
    window.GamificationMilestones = GamificationMilestones;
    window.triggerEvolutionCeremony = triggerEvolutionCeremony;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationMilestones;
  }
})(typeof window !== 'undefined' ? window : global);
