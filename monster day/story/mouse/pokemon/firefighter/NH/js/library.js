/**
 * ENGLISH ADVENTURE ACADEMY — LESSON LIBRARY ARCHITECTURE (V3.0)
 * 4-Track Curriculum Navigation, Strict 3-Element Card System & Secondary Metadata Drawer.
 */

(function(window) {
  'use strict';

  class CurriculumLibraryController {
    constructor() {
      this.activeTrackId = 'track-1';
      this.searchQuery = '';
      this.activeDrawerItemId = null;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      this.initialized = true;

      // Global keyboard shortcut to close drawer with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeDrawerItemId) {
          this.closeDrawer();
        }
      });
    }

    getTracks() {
      if (window.CURRICULUM_TRACKS && Array.isArray(window.CURRICULUM_TRACKS)) {
        return window.CURRICULUM_TRACKS;
      }
      return [
        { id: 'track-1', label: '🚀 Earth & Space', title: 'Track 1: 🚀 Earth, Space & Natural Science', subtitle: 'Planetary astronomy, environmental biology, and prehistoric dinosaur adaptation.', count: 3 },
        { id: 'track-2', label: '🛠️ STEM & Inventions', title: 'Track 2: 🛠️ Applied STEM & Creative Engineering', subtitle: 'Famous inventors, clean energy Eco-Rover build labs, and team battle arena.', count: 3 },
        { id: 'track-3', label: '🗣️ Language & Quests', title: 'Track 3: 🗣️ Language Mechanics & Communication Quests', subtitle: 'Spatial prepositions physics catapult, acoustic phonics lab, and imperative meme rules.', count: 3 },
        { id: 'track-4', label: '📖 Literature & Diagnostic', title: 'Track 4: 📖 Literature, Storytelling & Diagnostic Vaults', subtitle: 'Alice in Wonderland sequential quest and full 8-task diagnostic assessment matrix.', count: 2 },
        { id: 'all', label: '🌟 All Modules', title: 'Complete 4-Track Learning Library', subtitle: 'All 11 sequential active modules across Earth & Space, STEM, Language, and Literature.', count: 11 }
      ];
    }

    getAllActiveModules() {
      const registry = window.GAMES_REGISTRY || window.GAMES_DATA || [];
      return registry.filter(item => item && item.status !== 'deprecated');
    }

    getFilteredModules() {
      let modules = this.getAllActiveModules();

      // Filter by active track
      if (this.activeTrackId !== 'all') {
        modules = modules.filter(m => m.trackId === this.activeTrackId);
      }

      // Filter by optional search query
      if (this.searchQuery && this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        modules = modules.filter(m => {
          const title = (m.title || '').toLowerCase();
          const formula = ((m.grammar && (m.grammar.formula || m.grammar.focusPattern)) || m.formula || '').toLowerCase();
          const topic = ((m.topics && m.topics.join(' ')) || m.topic || m.category || '').toLowerCase();
          const vocab = ((m.vocabulary && m.vocabulary.core && m.vocabulary.core.join(' ')) || '').toLowerCase();
          return title.includes(q) || formula.includes(q) || topic.includes(q) || vocab.includes(q);
        });
      }

      return modules;
    }

    getCurrentTrack() {
      const tracks = this.getTracks();
      return tracks.find(t => t.id === this.activeTrackId) || tracks[0];
    }

    playSnap() {
      try {
        if (window.academyAudio && typeof window.academyAudio.playSnap === 'function') {
          window.academyAudio.playSnap();
        }
      } catch (err) {
        // Safe sound fallback
      }
    }

    playCoin() {
      try {
        if (window.academyAudio && typeof window.academyAudio.playCoin === 'function') {
          window.academyAudio.playCoin();
        }
      } catch (err) {
        // Safe sound fallback
      }
    }

    setTrack(trackId) {
      if (this.activeTrackId === trackId) return;
      this.activeTrackId = trackId;
      this.playSnap();
      this.updateView();

      // Reset scroll position to top of library view
      const target = document.getElementById('curriculum-library-root');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    handleSearch(query) {
      this.searchQuery = query;
      const clearBtn = document.getElementById('curriculum-search-clear');
      if (clearBtn) {
        clearBtn.style.display = query ? 'flex' : 'none';
      }
      this.renderCardsGrid();
    }

    clearSearch() {
      this.searchQuery = '';
      const input = document.getElementById('curriculum-search-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      const clearBtn = document.getElementById('curriculum-search-clear');
      if (clearBtn) {
        clearBtn.style.display = 'none';
      }
      this.renderCardsGrid();
    }

    launchGame(id, routeUrl) {
      this.playCoin();
      const targetUrl = routeUrl || (window.GAMES_REGISTRY && window.GAMES_REGISTRY.find(g => g.id === id)?.route);
      
      setTimeout(() => {
        if (targetUrl) {
          window.location.href = targetUrl;
        } else if (typeof window.launchGame === 'function') {
          window.launchGame(id);
        }
      }, 120);
    }

    openDrawer(id) {
      const all = window.GAMES_REGISTRY || window.GAMES_DATA || [];
      const item = all.find(g => g.id === id);
      if (!item) return;

      this.activeDrawerItemId = id;
      this.playSnap();

      let drawer = document.getElementById('curriculum-details-drawer');
      let backdrop = document.getElementById('curriculum-drawer-backdrop');

      if (!drawer) {
        this.renderDrawerContainers();
        drawer = document.getElementById('curriculum-details-drawer');
        backdrop = document.getElementById('curriculum-drawer-backdrop');
      }

      if (drawer) {
        drawer.innerHTML = this.renderDrawerContent(item);
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
      }
      if (backdrop) {
        backdrop.classList.add('is-visible');
      }
      document.body.classList.add('curriculum-drawer-open');
    }

    closeDrawer() {
      this.activeDrawerItemId = null;
      this.playSnap();

      const drawer = document.getElementById('curriculum-details-drawer');
      const backdrop = document.getElementById('curriculum-drawer-backdrop');
      if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      if (backdrop) {
        backdrop.classList.remove('is-visible');
      }
      document.body.classList.remove('curriculum-drawer-open');
    }

    renderDrawerContainers() {
      if (!document.getElementById('curriculum-drawer-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'curriculum-drawer-backdrop';
        backdrop.className = 'curriculum-drawer-backdrop';
        backdrop.onclick = () => this.closeDrawer();
        document.body.appendChild(backdrop);
      }

      if (!document.getElementById('curriculum-details-drawer')) {
        const drawer = document.createElement('aside');
        drawer.id = 'curriculum-details-drawer';
        drawer.className = 'curriculum-details-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(drawer);
      }
    }

    renderDrawerContent(item) {
      const formula = (item.grammar && (item.grammar.formula || item.grammar.focusPattern)) || item.formula || 'Target communicative pattern';
      const objectives = (Array.isArray(item.learningObjectives) && item.learningObjectives.length) 
        ? item.learningObjectives 
        : [item.description || 'Interactive ESL/CLIL communicative practice.'];
      const vocabList = (item.vocabulary && item.vocabulary.core) 
        ? item.vocabulary.core 
        : (item.skills || []);
      const launchRoute = item.route || item.url || (item.id + '/index.html');
      const wsRoute = item.worksheetUrl || item.worksheetRoute || (item.id + '/worksheet.html');

      return `
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="drawer-icon">${item.thumbnailIcon || '🚀'}</span>
            <div>
              <div class="drawer-tag">${item.trackTitle || item.category || 'Sequential Track'}</div>
              <h2 class="drawer-title">${item.title}</h2>
            </div>
          </div>
          <button type="button" class="drawer-close-btn" onclick="window.LibraryController.closeDrawer()" aria-label="Close details">✕</button>
        </div>

        <div class="drawer-body">
          <!-- Metadata Stats Bar -->
          <div class="drawer-meta-grid">
            <div class="meta-box">
              <span class="meta-label">CEFR Level</span>
              <span class="meta-val highlight">${item.cefrLevel || item.level || 'A1'}</span>
            </div>
            <div class="meta-box">
              <span class="meta-label">Duration</span>
              <span class="meta-val">${item.durationText || (item.duration ? item.duration + ' min' : '35 min')}</span>
            </div>
            <div class="meta-box">
              <span class="meta-label">XP Award</span>
              <span class="meta-val xp-val">⭐ +${item.xp || 150} XP</span>
            </div>
            <div class="meta-box">
              <span class="meta-label">Grade / Age</span>
              <span class="meta-val">${item.grade || item.age || 'Grade 3–4'}</span>
            </div>
          </div>

          <!-- Formula Pill Zone -->
          <div class="drawer-section">
            <h4 class="drawer-section-title">📐 Target Grammar Formula</h4>
            <div class="drawer-formula-card">
              <code>${formula}</code>
            </div>
          </div>

          <!-- Pedagogical Objectives -->
          <div class="drawer-section">
            <h4 class="drawer-section-title">🎯 Curricular Learning Objectives</h4>
            <ul class="drawer-objectives-list">
              ${objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
          </div>

          <!-- Core Vocabulary Chips -->
          ${vocabList && vocabList.length ? `
            <div class="drawer-section">
              <h4 class="drawer-section-title">🔤 Core Target Vocabulary</h4>
              <div class="drawer-vocab-chips">
                ${vocabList.map(w => `<span class="drawer-chip">${w}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Description / Pedagogical Context -->
          ${item.description ? `
            <div class="drawer-section">
              <h4 class="drawer-section-title">📖 Mission Overview</h4>
              <p class="drawer-description">${item.description}</p>
            </div>
          ` : ''}
        </div>

        <div class="drawer-footer">
          <button type="button" class="btn-launch-3d drawer-action-btn" onclick="window.LibraryController.launchGame('${item.id}', '${launchRoute}')">
            <span>▶ Launch Game</span>
          </button>
          <a href="${wsRoute}" target="_blank" class="btn-worksheet-3d drawer-action-btn" title="Open A4 Printable Worksheet">
            <span>📄 Print Worksheet</span>
          </a>
        </div>
      `;
    }

    /**
     * Strict 3-Element Rule Card Renderer:
     * 1. Header Area: High-contrast topic icon, module title, CEFR level badge.
     * 2. Formula Pill: Single clean grammar formula chip.
     * 3. Action Footers: Exactly two primary touch targets ([▶ Launch Game] 3D button + [📄 Worksheet]) + subtle [ℹ️ Details] trigger.
     */
    renderResourceCard(item) {
      if (!item) return '';

      const formula = (item.grammar && (item.grammar.formula || item.grammar.focusPattern)) || item.formula || 'Target sentence pattern';
      const launchRoute = item.route || item.url || (item.id + '/index.html');
      const wsRoute = item.worksheetUrl || item.worksheetRoute || (item.id + '/worksheet.html');
      const icon = item.thumbnailIcon || (item.isWorksheet ? '📄' : '🎮');
      const cefr = item.cefrLevel || item.level || 'A1';

      return `
        <article class="resource-card-v3" data-id="${item.id}" data-track="${item.trackId || ''}">
          <!-- Element 1: Header Area -->
          <div class="card-header-zone">
            <div class="card-title-group">
              <span class="card-topic-icon" aria-hidden="true">${icon}</span>
              <div class="card-title-wrap">
                <h3 class="card-title-text" onclick="window.LibraryController.openDrawer('${item.id}')" title="${item.title}">${item.title}</h3>
                <span class="card-track-tag">${item.trackTitle || item.category || 'Sequential Track'}</span>
              </div>
            </div>
            <div class="card-badge-wrap">
              <span class="card-cefr-badge" title="CEFR Proficiency Level">${cefr}</span>
              <span class="card-xp-pill" title="Student XP Reward">+${item.xp || 100} XP</span>
            </div>
          </div>

          <!-- Element 2: Formula Pill -->
          <div class="card-formula-zone">
            <div class="card-formula-chip" title="Curriculum Grammar Formula: ${formula}">
              <span class="formula-icon">📐</span>
              <span class="formula-text"><strong>Formula:</strong> ${formula}</span>
            </div>
          </div>

          <!-- Element 3: Action Footers -->
          <div class="card-actions-zone">
            <div class="card-primary-actions">
              <button type="button" class="btn-launch-3d" onclick="window.LibraryController.launchGame('${item.id}', '${launchRoute}')">
                <span>▶ Launch Game</span>
              </button>
              <a href="${wsRoute}" target="_blank" class="btn-worksheet-3d" title="Open Authentic A4 Printable Worksheet">
                <span>📄 Worksheet</span>
              </a>
            </div>
            <button type="button" class="btn-details-trigger" onclick="window.LibraryController.openDrawer('${item.id}')" title="View Pedagogical Goals &amp; Vocabulary">
              <span>ℹ️ Details</span>
            </button>
          </div>
        </article>
      `;
    }

    renderTabsBar() {
      const tracks = this.getTracks();

      return `
        <nav class="curriculum-track-tabs-bar sticky-glass-bar" aria-label="Curriculum Sequential Tracks">
          <div class="track-tabs-scroll-container">
            ${tracks.map(t => {
              const isActive = t.id === this.activeTrackId;
              return `
                <button type="button" 
                  class="track-tab-btn ${isActive ? 'is-active' : ''}" 
                  onclick="window.LibraryController.setTrack('${t.id}')"
                  role="tab"
                  aria-selected="${isActive ? 'true' : 'false'}">
                  <span class="track-tab-label">${t.label}</span>
                  <span class="track-count-pill">${t.count}</span>
                </button>
              `;
            }).join('')}
          </div>
        </nav>
      `;
    }

    renderTrackBanner() {
      const currentTrack = this.getCurrentTrack();

      return `
        <div class="curriculum-track-banner" id="curriculum-track-banner">
          <div class="banner-content">
            <div class="banner-title-row">
              <h2 class="banner-track-title">${currentTrack.title}</h2>
              <span class="banner-badge">${currentTrack.count} Core Active Modules</span>
            </div>
            <p class="banner-track-subtitle">${currentTrack.subtitle}</p>
          </div>
        </div>
      `;
    }

    renderCardsGrid() {
      const gridContainer = document.getElementById('curriculum-cards-container');
      if (!gridContainer) return;

      const items = this.getFilteredModules();

      if (!items || items.length === 0) {
        gridContainer.innerHTML = `
          <div class="curriculum-empty-state">
            <div style="font-size:3rem; margin-bottom:12px;">🔍</div>
            <h3>No modules found</h3>
            <p>No active curricular modules match the search "${this.searchQuery}".</p>
            <button type="button" class="btn-worksheet-3d" onclick="window.LibraryController.clearSearch()" style="margin-top:14px;">Clear Search</button>
          </div>
        `;
        return;
      }

      gridContainer.innerHTML = items.map(item => this.renderResourceCard(item)).join('');
    }

    updateView() {
      // 1. Update tabs active state
      const tabBtns = document.querySelectorAll('.track-tab-btn');
      const tracks = this.getTracks();
      tabBtns.forEach((btn, index) => {
        const track = tracks[index];
        if (track) {
          const isActive = track.id === this.activeTrackId;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        }
      });

      // 2. Update track banner
      const bannerContainer = document.getElementById('curriculum-track-banner-wrap');
      if (bannerContainer) {
        bannerContainer.innerHTML = this.renderTrackBanner();
      }

      // 3. Re-render cards grid
      this.renderCardsGrid();
    }

    render(container) {
      if (!container) return;
      this.init();
      this.renderDrawerContainers();

      container.innerHTML = `
        <div class="curriculum-library-root" id="curriculum-library-root">
          <!-- Library Header Bar -->
          <header class="curriculum-main-header">
            <div class="header-left">
              <div class="header-title-row">
                <h1 class="curriculum-headline">Curriculum Learning Library</h1>
                <span class="curriculum-status-pill">✓ Standardized 4-Track System</span>
              </div>
              <p class="curriculum-subheadline">Sequential CLIL, STEM, Language &amp; Literature modules aligned with Grade 3–4 CEFR standards.</p>
            </div>
            <div class="header-right">
              <div class="curriculum-search-box">
                <span class="search-icon">🔍</span>
                <input type="text" 
                  id="curriculum-search-input" 
                  class="curriculum-search-input" 
                  placeholder="Filter active modules, formulas, vocabulary..." 
                  value="${this.searchQuery}" 
                  oninput="window.LibraryController.handleSearch(this.value)" />
                <button type="button" 
                  id="curriculum-search-clear" 
                  class="curriculum-search-clear" 
                  style="${this.searchQuery ? 'display:flex;' : 'display:none;'}"
                  onclick="window.LibraryController.clearSearch()" 
                  title="Clear filter">✕</button>
              </div>
            </div>
          </header>

          <!-- Sticky Glassmorphic 4-Track Tab Navigation -->
          <div class="curriculum-tabs-sticky-wrapper">
            ${this.renderTabsBar()}
          </div>

          <!-- Dynamic Active Track Overview Banner -->
          <div id="curriculum-track-banner-wrap">
            ${this.renderTrackBanner()}
          </div>

          <!-- Simplified 3-Element Card Grid -->
          <main class="curriculum-cards-container" id="curriculum-cards-container">
            <!-- Injected via renderCardsGrid -->
          </main>
        </div>
      `;

      // Render initial cards grid for active track
      this.renderCardsGrid();
    }
  }

  // Instantiate and expose globally
  const controller = new CurriculumLibraryController();
  window.LibraryController = controller;
  window.CurriculumLibraryController = CurriculumLibraryController;

  // Global helper delegating to controller's renderResourceCard
  window.renderResourceCard = function(item) {
    return controller.renderResourceCard(item);
  };

  // Safe launcher delegator
  window.launchCurriculumGame = function(id, url) {
    controller.launchGame(id, url);
  };

})(window);
