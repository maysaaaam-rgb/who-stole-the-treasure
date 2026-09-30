/**
 * Alice in Wonderland: Mad Tea Party Double-Sided Trading Cards
 * Interactive Application Controller & Dynamic Print Grid Engine
 * Dual-Class Support: Class 4-B (19 Cards) & Class 4-A (18 Cards)
 */

document.addEventListener('DOMContentLoaded', () => {
  const cardsGrid = document.getElementById('cards-gallery-grid');
  const printContainer = document.getElementById('print-sheets-container');
  const searchInput = document.getElementById('search-input');
  const actFilterContainer = document.getElementById('act-pills-container');
  const cardCountBadge = document.getElementById('card-count-badge');
  const btnPrintCards = document.getElementById('btn-print-cards');
  const btnFlipAll = document.getElementById('btn-flip-all');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const classSelectorDock = document.getElementById('class-selector-dock');
  const appSubtitle = document.getElementById('app-subtitle');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const linkDossiers = document.getElementById('link-dossiers');

  let activeActFilter = 'all';
  let activeSearchQuery = '';
  let allFlipped = false;

  // Read initial class from URL parameter, default to '4b'
  const urlParams = new URLSearchParams(window.location.search);
  const initialClass = urlParams.get('class') === '4a' ? '4a' : '4b';

  // Initialize
  if (typeof window.setCardsClass === 'function') {
    window.setCardsClass(initialClass);
  }
  updateActPillCounts();
  renderCards();
  setupPrintSheets();
  setupEventListeners();

  /**
   * Corner Filigree SVG Icon Generator
   */
  function getCornerFlourishSVG() {
    return `
      <svg class="corner-flourish" viewBox="0 0 40 40">
        <path d="M2,2 L38,2 C25,6 20,18 20,38 C18,20 6,25 2,2 Z" fill="#d97706" />
        <circle cx="9" cy="9" r="3" fill="#fde68a" />
        <path d="M4,18 C8,15 15,8 18,4" stroke="#fde68a" stroke-width="1.5" fill="none" />
      </svg>
    `;
  }

  /**
   * Update Act Filter Badge Counts
   */
  function updateActPillCounts() {
    const list = window.TEA_PARTY_CARDS_DATA || [];
    const countAll = list.length;
    const count1 = list.filter(c => c.actNumber === 1 || c.act.includes('Act I')).length;
    const count2 = list.filter(c => c.actNumber === 2 || c.act.includes('Act II')).length;
    const count3 = list.filter(c => c.actNumber === 3 || c.act.includes('Act III')).length;
    const count4 = list.filter(c => c.actNumber === 4 || c.act.includes('Act IV')).length;

    const elAll = document.getElementById('pill-count-all');
    const el1 = document.getElementById('pill-count-act1');
    const el2 = document.getElementById('pill-count-act2');
    const el3 = document.getElementById('pill-count-act3');
    const el4 = document.getElementById('pill-count-act4');

    if (elAll) elAll.textContent = countAll;
    if (el1) el1.textContent = count1;
    if (el2) el2.textContent = count2;
    if (el3) el3.textContent = count3;
    if (el4) el4.textContent = count4;
  }

  /**
   * Switch Active Class (4-A vs 4-B)
   */
  function setClassView(classId) {
    if (typeof window.setCardsClass === 'function') {
      window.setCardsClass(classId);
    }

    if (classSelectorDock) {
      classSelectorDock.querySelectorAll('.class-toggle-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.class === classId);
      });
    }

    const is4b = classId === '4b';
    if (appSubtitle) {
      appSubtitle.textContent = is4b
        ? "Class 4-B: 19 Unique Double-Sided Character Cards • Collectible Souvenirs & Acting Guides"
        : "Class 4-A: 18 Unique Double-Sided Character Cards • Collectible Souvenirs & Acting Guides";
    }

    if (btnDownloadPdf) {
      btnDownloadPdf.href = is4b
        ? "output/Class_4B_Tea_Party_Cards_Duplex_Sheets.pdf"
        : "output/Class_4A_Tea_Party_Cards_Duplex_Sheets.pdf";
    }

    if (linkDossiers) {
      linkDossiers.href = `worksheet.html?class=${classId}`;
    }

    // Reset filter and update
    activeActFilter = 'all';
    if (actFilterContainer) {
      actFilterContainer.querySelectorAll('.act-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.act === 'all');
      });
    }

    updateActPillCounts();
    renderCards();
    setupPrintSheets();

    if (window.teaPartyAudio) {
      window.teaPartyAudio.playCardSelect();
    }
  }

  /**
   * Render Interactive Screen Cards
   */
  function renderCards() {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';

    const data = window.TEA_PARTY_CARDS_DATA || [];
    const filtered = data.filter(char => {
      const matchesAct = activeActFilter === 'all' || 
        (activeActFilter === 'act1' && (char.actNumber === 1 || char.act.includes('Act I'))) ||
        (activeActFilter === 'act2' && (char.actNumber === 2 || char.act.includes('Act II'))) ||
        (activeActFilter === 'act3' && (char.actNumber === 3 || char.act.includes('Act III'))) ||
        (activeActFilter === 'act4' && (char.actNumber === 4 || char.act.includes('Act IV')));

      const q = activeSearchQuery.toLowerCase();
      const matchesSearch = !q || 
        char.name.toLowerCase().includes(q) ||
        char.actor.toLowerCase().includes(q) ||
        char.role.toLowerCase().includes(q);

      return matchesAct && matchesSearch;
    });

    if (cardCountBadge) {
      cardCountBadge.textContent = `${filtered.length} / ${data.length} Cards`;
    }

    if (filtered.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #94a3b8;">
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎩 No characters found</p>
          <p style="font-size: 0.9rem;">Try adjusting your search query or act filter.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(char => {
      const cardEl = createCardElement(char);
      cardsGrid.appendChild(cardEl);
    });
  }

  /**
   * Build Individual Card DOM Element (Front + Back + Mini Controls)
   */
  function createCardElement(char) {
    const wrap = document.createElement('div');
    wrap.className = 'card-item-wrapper';

    wrap.innerHTML = `
      <div class="trading-card-wrapper" data-id="${char.id}" id="card-wrap-${char.id}">
        <div class="trading-card-3d">
          
          <!-- FRONT FACE -->
          <div class="card-face card-front" style="--card-theme: ${char.themeColor};">
            <div class="filigree-outer-border">
              <div class="corner-flourish corner-tl">${getCornerFlourishSVG()}</div>
              <div class="corner-flourish corner-tr">${getCornerFlourishSVG()}</div>
              <div class="corner-flourish corner-bl">${getCornerFlourishSVG()}</div>
              <div class="corner-flourish corner-br">${getCornerFlourishSVG()}</div>

              <!-- Top Banner -->
              <div class="card-top-banner">
                <span class="banner-motif">♠ ☕</span>
                <span class="banner-text">TEA PARTY TRADING CARD</span>
                <span class="banner-motif">☕ ♥</span>
              </div>

              <!-- Portrait Window -->
              <div class="card-portrait-window">
                <img src="${char.image}" alt="${char.name} played by ${char.actor}" loading="lazy" />
              </div>

              <!-- Bottom Plaque -->
              <div class="card-bottom-plaque">
                <div class="plaque-char-name">${char.name}</div>
                <div class="plaque-actor">Actor: ${char.actor}</div>
                <div class="plaque-role">${char.role}</div>
              </div>

              <!-- Stat Badges Ribbon -->
              <div class="card-stat-ribbon">
                <div class="stat-badge">
                  <span class="stat-label">TEA POWER</span>
                  <span class="stat-val tp">${char.stats.teaPower}</span>
                </div>
                <div class="stat-badge">
                  <span class="stat-label">MADNESS</span>
                  <span class="stat-val mad">${char.stats.madness}</span>
                </div>
                <div class="stat-badge">
                  <span class="stat-label">COURAGE</span>
                  <span class="stat-val courage">${char.stats.courage}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- BACK FACE -->
          <div class="card-face card-back" style="--card-theme: ${char.themeColor};">
            <div class="back-inner-frame">
              <div class="back-header">
                <div class="back-header-top">
                  <div class="back-char-title">${char.name}</div>
                  <span class="back-actor-pill">${char.actor}</span>
                </div>
                <div class="back-act-scene">${char.act}</div>
              </div>

              <div class="back-body-content">
                <!-- Checklists -->
                <div class="guide-box">
                  <div class="guide-box-title">
                    <span>🧰</span> Costume & Prop Essentials
                  </div>
                  <ul class="checklist-compact">
                    ${char.costume.slice(0, 2).map(c => `<li>${c}</li>`).join('')}
                    ${char.props.slice(0, 2).map(p => `<li><strong>Prop:</strong> ${p}</li>`).join('')}
                  </ul>
                </div>

                <!-- 1-Minute Speech Prompt -->
                <div class="guide-box speech-box">
                  <div class="guide-box-title">
                    <span>🎭</span> 1-Min Speech Prompt
                  </div>
                  <div class="speech-vocal-pill">🎙️ ${char.vocalTone}</div>
                  <div class="speech-text-wrap">
                    <span class="speech-action">🎬 ${char.stageAction}</span>
                    <span class="speech-quote">"${char.openingLine}"</span>
                    <p style="margin-top: 3px; font-size: 0.62rem; color: #4b3823;">${char.speakingPrompt}</p>
                  </div>
                </div>

                <!-- Exact Interaction Cue -->
                <div class="interaction-cue-box">
                  <div class="cue-header">
                    <span>⚡ Key Interaction Cue</span>
                    <span>Act Scene</span>
                  </div>
                  <div class="cue-body">
                    When <span class="cue-trigger">${char.interactionCue.triggerCharacter}</span> cues: 
                    <em>"${char.interactionCue.triggerLine}"</em>, 
                    ${char.interactionCue.actionInstruction} 
                    <span class="cue-response">"${char.interactionCue.responseLine}"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Quick Action Toolbar underneath card -->
      <div class="card-quick-actions">
        <button type="button" class="card-btn-action btn-flip" data-action="flip" title="Flip Card">
          🔄 Flip
        </button>
        <button type="button" class="card-btn-action btn-speak" data-action="speak" title="Listen to Performance Speech">
          🗣️ Speak
        </button>
        <button type="button" class="card-btn-action btn-sound" data-action="sfx" title="Sound Effect">
          🎵 Chime
        </button>
      </div>
    `;

    // Interactive Card Flipping
    const card3dWrap = wrap.querySelector('.trading-card-wrapper');
    const btnFlip = wrap.querySelector('.btn-flip');
    const btnSpeak = wrap.querySelector('.btn-speak');
    const btnSound = wrap.querySelector('.btn-sound');

    card3dWrap.addEventListener('click', (e) => {
      // Don't flip if clicking interactive sub-elements
      card3dWrap.classList.toggle('is-flipped');
      if (window.teaPartyAudio) {
        window.teaPartyAudio.playCardFlip();
      }
    });

    btnFlip.addEventListener('click', (e) => {
      e.stopPropagation();
      card3dWrap.classList.toggle('is-flipped');
      if (window.teaPartyAudio) {
        window.teaPartyAudio.playCardFlip();
      }
    });

    btnSpeak.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.teaPartyAudio) {
        btnSpeak.style.transform = 'scale(0.92)';
        setTimeout(() => btnSpeak.style.transform = '', 150);
        window.teaPartyAudio.speakMonologue(char.name, char.openingLine, char.speakingPrompt);
      }
    });

    btnSound.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.teaPartyAudio) {
        window.teaPartyAudio.playRoyalFanfare();
      }
    });

    return wrap;
  }

  /**
   * Setup High-Precision 3x3 Duplex Cardstock Print Engine
   */
  function setupPrintSheets() {
    if (!printContainer) return;
    printContainer.innerHTML = '';

    const data = window.TEA_PARTY_CARDS_DATA || [];
    const classLabel = (window.CURRENT_CLASS_ID || '4b').toUpperCase();
    const totalCards = data.length;
    const numBatches = Math.ceil(totalCards / 9);
    const batches = [];

    for (let b = 0; b < numBatches; b++) {
      batches.push(data.slice(b * 9, (b + 1) * 9));
    }

    batches.forEach((batch, batchIdx) => {
      // 1. FRONT SHEET (3x3 Grid)
      const frontPage = document.createElement('div');
      frontPage.className = 'print-sheet-page';
      frontPage.innerHTML = `
        <div class="print-sheet-header">
          <strong>CLASS ${classLabel}: MAD TEA PARTY CARDS — SHEET ${batchIdx + 1} (FRONT SIDES)</strong> | 3x3 Grid • 2.5" × 3.5" Standard Poker Dimensions
        </div>
        <div class="print-cards-grid-3x3" id="print-grid-front-${batchIdx}"></div>
      `;
      printContainer.appendChild(frontPage);

      const frontGrid = frontPage.querySelector(`#print-grid-front-${batchIdx}`);
      for (let i = 0; i < 9; i++) {
        const cardData = batch[i];
        const cardBox = document.createElement('div');
        cardBox.className = 'printable-card-unit';
        if (cardData) {
          cardBox.innerHTML = generatePrintCardMarkup(cardData, 'front');
        } else {
          cardBox.style.visibility = 'hidden';
        }
        frontGrid.appendChild(cardBox);
      }

      // 2. BACK SHEET (3x3 Grid with HORIZONTALLY MIRRORED COLUMNS for Duplex Cardstock Printing)
      // Standard 3x3 row indices:
      // Row 0: 0, 1, 2  -> Mirrored: 2, 1, 0
      // Row 1: 3, 4, 5  -> Mirrored: 5, 4, 3
      // Row 2: 6, 7, 8  -> Mirrored: 8, 7, 6
      const mirroredIndices = [2, 1, 0, 5, 4, 3, 8, 7, 6];

      const backPage = document.createElement('div');
      backPage.className = 'print-sheet-page';
      backPage.innerHTML = `
        <div class="print-sheet-header">
          <strong>CLASS ${classLabel}: MAD TEA PARTY CARDS — SHEET ${batchIdx + 1} (BACK SIDES — DUPLEX ALIGNED)</strong> | Flip on Long Edge
        </div>
        <div class="print-cards-grid-3x3" id="print-grid-back-${batchIdx}"></div>
      `;
      printContainer.appendChild(backPage);

      const backGrid = backPage.querySelector(`#print-grid-back-${batchIdx}`);
      for (let i = 0; i < 9; i++) {
        const targetIdx = mirroredIndices[i];
        const cardData = batch[targetIdx];
        const cardBox = document.createElement('div');
        cardBox.className = 'printable-card-unit';
        if (cardData) {
          cardBox.innerHTML = generatePrintCardMarkup(cardData, 'back');
        } else {
          cardBox.style.visibility = 'hidden';
        }
        backGrid.appendChild(cardBox);
      }
    });
  }

  /**
   * Generate Clean HTML for Print Card Units
   */
  function generatePrintCardMarkup(char, side) {
    if (side === 'front') {
      return `
        <div class="card-face card-front" style="position:relative; width:100%; height:100%; border-radius:0;">
          <div class="filigree-outer-border">
            <div class="corner-flourish corner-tl">${getCornerFlourishSVG()}</div>
            <div class="corner-flourish corner-tr">${getCornerFlourishSVG()}</div>
            <div class="corner-flourish corner-bl">${getCornerFlourishSVG()}</div>
            <div class="corner-flourish corner-br">${getCornerFlourishSVG()}</div>

            <div class="card-top-banner">
              <span class="banner-motif">♠ ☕</span>
              <span class="banner-text">TEA PARTY TRADING CARD</span>
              <span class="banner-motif">☕ ♥</span>
            </div>

            <div class="card-portrait-window">
              <img src="${char.image}" alt="${char.name}" />
            </div>

            <div class="card-bottom-plaque">
              <div class="plaque-char-name">${char.name}</div>
              <div class="plaque-actor">Actor: ${char.actor}</div>
              <div class="plaque-role">${char.role}</div>
            </div>

            <div class="card-stat-ribbon">
              <div class="stat-badge">
                <span class="stat-label">TEA POWER</span>
                <span class="stat-val tp">${char.stats.teaPower}</span>
              </div>
              <div class="stat-badge">
                <span class="stat-label">MADNESS</span>
                <span class="stat-val mad">${char.stats.madness}</span>
              </div>
              <div class="stat-badge">
                <span class="stat-label">COURAGE</span>
                <span class="stat-val courage">${char.stats.courage}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="card-face card-back" style="position:relative; width:100%; height:100%; transform:none; border-radius:0;">
          <div class="back-inner-frame">
            <div class="back-header">
              <div class="back-header-top">
                <div class="back-char-title">${char.name}</div>
                <span class="back-actor-pill">${char.actor}</span>
              </div>
              <div class="back-act-scene">${char.act}</div>
            </div>

            <div class="back-body-content">
              <div class="guide-box">
                <div class="guide-box-title"><span>🧰</span> Costume & Prop Essentials</div>
                <ul class="checklist-compact">
                  ${char.costume.slice(0, 2).map(c => `<li>${c}</li>`).join('')}
                  ${char.props.slice(0, 2).map(p => `<li><strong>Prop:</strong> ${p}</li>`).join('')}
                </ul>
              </div>

              <div class="guide-box speech-box">
                <div class="guide-box-title"><span>🎭</span> 1-Min Speech Prompt</div>
                <div class="speech-vocal-pill">🎙️ ${char.vocalTone}</div>
                <div class="speech-text-wrap">
                  <span class="speech-action">🎬 ${char.stageAction}</span>
                  <span class="speech-quote">"${char.openingLine}"</span>
                  <p style="margin-top: 3px; font-size: 0.6rem; color: #4b3823;">${char.speakingPrompt}</p>
                </div>
              </div>

              <div class="interaction-cue-box">
                <div class="cue-header">
                  <span>⚡ Key Interaction Cue</span>
                  <span>Act Scene</span>
                </div>
                <div class="cue-body">
                  When <span class="cue-trigger">${char.interactionCue.triggerCharacter}</span> cues: 
                  <em>"${char.interactionCue.triggerLine}"</em>, 
                  ${char.interactionCue.actionInstruction} 
                  <span class="cue-response">"${char.interactionCue.responseLine}"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Setup Event Listeners & UI Controls
   */
  function setupEventListeners() {
    // Class switcher pills
    if (classSelectorDock) {
      classSelectorDock.addEventListener('click', (e) => {
        const btn = e.target.closest('.class-toggle-pill');
        if (!btn) return;
        const targetClass = btn.dataset.class;
        if (targetClass) {
          setClassView(targetClass);
        }
      });
    }

    // Act filters
    if (actFilterContainer) {
      actFilterContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.act-pill');
        if (!pill) return;

        actFilterContainer.querySelectorAll('.act-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        activeActFilter = pill.dataset.act || 'all';
        if (window.teaPartyAudio) {
          window.teaPartyAudio.playCardSelect();
        }
        renderCards();
      });
    }

    // Search filter
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activeSearchQuery = e.target.value.trim();
        renderCards();
      });
    }

    // Flip All Cards Toggle
    if (btnFlipAll) {
      btnFlipAll.addEventListener('click', () => {
        allFlipped = !allFlipped;
        document.querySelectorAll('.trading-card-wrapper').forEach(card => {
          if (allFlipped) {
            card.classList.add('is-flipped');
          } else {
            card.classList.remove('is-flipped');
          }
        });
        if (window.teaPartyAudio) {
          window.teaPartyAudio.playCardFlip();
        }
        btnFlipAll.innerHTML = allFlipped ? '🔄 Show Fronts' : '🔄 Flip All';
      });
    }

    // Sound effects toggle
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        if (window.teaPartyAudio) {
          const muted = window.teaPartyAudio.toggleMute();
          btnSoundToggle.innerHTML = muted ? '🔇 Muted' : '🔊 Sound FX';
          btnSoundToggle.classList.toggle('btn-secondary', muted);
          btnSoundToggle.classList.toggle('btn-primary', !muted);
        }
      });
    }

    // Sound SFX triggers
    document.querySelectorAll('[data-sfx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sfx = btn.dataset.sfx;
        if (!window.teaPartyAudio) return;
        if (sfx === 'teacup') window.teaPartyAudio.playTeacupClink();
        if (sfx === 'fanfare') window.teaPartyAudio.playRoyalFanfare();
        if (sfx === 'snap') window.teaPartyAudio.playCardFlip();
      });
    });

    // Print Button
    if (btnPrintCards) {
      btnPrintCards.addEventListener('click', () => {
        if (window.teaPartyAudio) {
          window.teaPartyAudio.playCardSelect();
        }
        window.print();
      });
    }
  }
});
