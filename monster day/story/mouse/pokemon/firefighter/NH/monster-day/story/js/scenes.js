/**
 * MASTER STORYBOOK CINEMATIC SCENE RENDERER
 * Renders full-screen high-fidelity children's picture book illustrations (75-90% screen viewport)
 * With subtle atmospheric particle overlays and interactive storybook props
 */

export const SceneRenderer = {
  /**
   * Scene image metadata mapping
   */
  sceneImages: {
    1: { src: "assets/images/scene1.jpg", alt: "Dorothy's Home in Kansas during Gathering Storm", caption: "Dorothy looks at the stormy Kansas sky with Toto." },
    2: { src: "assets/images/scene2.jpg", alt: "The Flying Farmhouse in the Swirling Tornado", caption: "The house is lifted high into the tornado!" },
    3: { src: "assets/images/scene3.jpg", alt: "Munchkinland - A Strange Magical Land", caption: "Dorothy and Toto step into a beautiful strange land." },
    4: { src: "assets/images/scene4.jpg", alt: "The Scarecrow in the Golden Cornfield", caption: "Dorothy meets the friendly Scarecrow on the Yellow Brick Road." },
    5: { src: "assets/images/scene5.jpg", alt: "The Rusted Tin Man in the Deep Forest", caption: "Dorothy finds the frozen Tin Man and helps him with oil." },
    6: { src: "assets/images/scene6.jpg", alt: "The Cowardly Lion Leaping in the Forest", caption: "A big Lion jumps out, but he is scared!" },
    7: { src: "assets/images/scene7.jpg", alt: "The Magnificent Glowing Emerald City", caption: "The four friends arrive at the Emerald City." },
    8: { src: "assets/images/scene8.jpg", alt: "The Great Wizard's Magical Throne Room", caption: "The friends meet the great Wizard of Oz." },
    9: { src: "assets/images/scene9.jpg", alt: "Facing the Wicked Witch in the Dark Forest", caption: "The four brave friends stand together against the Witch." },
    10: { src: "assets/images/scene10.jpg", alt: "Celebration and Inner Strength in Oz", caption: "The Wizard honors the clever, kind, and brave friends." },
    11: { src: "assets/images/scene11.jpg", alt: "Home Safe in Kansas with Toto and Family", caption: "Dorothy hugs Toto warmly: 'There's no place like home!'" }
  },

  /**
   * Render complete high-quality illustrated story scene
   */
  renderScene(sceneData) {
    if (sceneData.isStoryStop) {
      return this.renderStoryStopVisual(sceneData);
    }

    const sceneNum = sceneData.id || 1;
    const imgInfo = this.sceneImages[sceneNum] || this.sceneImages[1];

    let interactiveOverlayHtml = '';

    // Scene 5: Interactive Oil Can Overlay
    if (sceneNum === 5) {
      interactiveOverlayHtml = `
        <div id="oil-can-interactive" class="scene-interactive-hotspot anim-pulse" title="Click to Oil the Tin Man!" onclick="window.StoryApp.triggerOilCan()">
          <div class="hotspot-pulse-ring"></div>
          <div class="hotspot-badge">
            <span class="hotspot-icon">🛢️</span>
            <span class="hotspot-text">TAP TO OIL TIN MAN!</span>
          </div>
        </div>
      `;
    }

    // Scene 6: Interactive Lion Roar Hotspot
    if (sceneNum === 6) {
      interactiveOverlayHtml = `
        <div class="scene-interactive-hotspot lion-hotspot anim-pulse" title="Tap to hear the Lion roar!" onclick="window.StoryApp.playSound('lion_roar')">
          <div class="hotspot-badge">
            <span class="hotspot-icon">🦁</span>
            <span class="hotspot-text">TAP LION (ROAR!)</span>
          </div>
        </div>
      `;
    }

    // Scene 7: Interactive Gate Knock Hotspot
    if (sceneNum === 7) {
      interactiveOverlayHtml = `
        <div class="scene-interactive-hotspot gate-hotspot anim-pulse" title="Tap to Knock on Emerald City Gate!" onclick="window.StoryApp.playSound('knock')">
          <div class="hotspot-badge">
            <span class="hotspot-icon">🚪</span>
            <span class="hotspot-text">KNOCK ON GATE!</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="scene-cinematic-stage">
        <!-- Full-Screen High-Resolution Storybook Illustration -->
        <div class="cinematic-art-container">
          <img src="${imgInfo.src}" alt="${imgInfo.alt}" class="cinematic-art-image anim-cinematic-fade" />
          
          <!-- Atmospheric Environmental Effects Overlay -->
          <div class="atmospheric-vignette"></div>
          
          ${sceneNum === 1 || sceneNum === 2 ? '<div class="weather-wind-particles"></div>' : ''}
          ${sceneNum === 7 || sceneNum === 8 || sceneNum === 10 ? '<div class="magic-sparkle-overlay"></div>' : ''}
          ${sceneNum === 11 ? '<div class="warm-sunbeam-overlay"></div>' : ''}

          <!-- Interactive Props & Hotspots -->
          ${interactiveOverlayHtml}
        </div>
      </div>
    `;
  },

  /**
   * Render Story Stop Interactive Stage with Scene Visual Context
   */
  renderStoryStopVisual(stopData) {
    const stopNum = stopData.stopNumber || 1;
    let bgImageSrc = "assets/images/scene2.jpg";
    if (stopNum === 2) bgImageSrc = "assets/images/scene6.jpg";
    if (stopNum === 3) bgImageSrc = "assets/images/scene9.jpg";

    return `
      <div class="story-stop-banner-wrapper">
        <div class="story-stop-card">
          <div class="stop-badge">🛑 STORY STOP #${stopData.stopNumber}</div>
          <h2 class="stop-title">${stopData.title}</h2>
          
          <div class="stop-content-grid">
            <!-- Left: Large Scene Visual Context -->
            <div class="stop-visual-area">
              <div class="stop-image-frame">
                <img src="${bgImageSrc}" alt="Story Stop Context" class="stop-context-img" />
              </div>
            </div>

            <!-- Right: Interactive Choices & Sentence Support -->
            <div class="stop-interaction-area">
              <div class="partner-talk-bubble">
                <span class="bubble-icon">🗣️</span>
                <span class="bubble-text"><strong>Talk to your partner:</strong> "${stopData.step1.question}"</span>
              </div>
              
              <div class="stop-options-grid" id="stop-options-container">
                ${stopData.step1.options.map(opt => `
                  <button class="choice-card-btn" data-correct="${opt.correct}" onclick="window.StoryApp.handleStoryStopChoice(this, ${opt.correct})">
                    <span class="choice-icon">${opt.icon}</span>
                    <span class="choice-label">${opt.label}</span>
                  </button>
                `).join('')}
              </div>

              <div class="sentence-frame-box">
                <div class="frame-tag">SENTENCE SUPPORT</div>
                <div class="frame-text" id="stop-sentence-frame">${stopData.step1.frame}</div>
              </div>

              <button class="reveal-btn" onclick="window.StoryApp.revealStoryStopAnswer(${stopData.stopNumber})">
                ✨ REVEAL ANSWER
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 8 Rich Miniature Illustrated Cards for Post-Story Memory Activity
   */
  getMemoryCardSvg(cardId) {
    const memoryImgMap = {
      1: "assets/images/scene2.jpg",  // Tornado
      2: "assets/images/scene3.jpg",  // Strange Land
      3: "assets/images/scene4.jpg",  // Scarecrow
      4: "assets/images/scene5.jpg",  // Tin Man
      5: "assets/images/scene6.jpg",  // Lion
      6: "assets/images/scene7.jpg",  // Emerald City
      7: "assets/images/scene9.jpg",  // Witch
      8: "assets/images/scene11.jpg"  // Home
    };

    const imgSrc = memoryImgMap[cardId] || "assets/images/scene1.jpg";

    return `
      <div class="memory-card-art-thumb">
        <img src="${imgSrc}" alt="Story Event ${cardId}" class="memory-thumb-img" />
      </div>
    `;
  }
};
