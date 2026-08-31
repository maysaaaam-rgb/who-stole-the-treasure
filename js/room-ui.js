/**
 * Room Rescue: UI & Real Drag-and-Drop Controller
 * Powered by ROOM_SVG vector illustrations and Pointer Events drag-and-drop physics.
 */

class RoomUIController {
  constructor() {
    this.isDragging = false;
    this.draggedItemEl = null;
    this.draggedItemId = null;
    this.dragStartPos = { left: "0px", top: "0px" };
    this.dragPointerOffset = { x: 0, y: 0 };
    this.currentHoverZoneId = null;

    // Container open/close states
    this.drawerOpen = false;
    this.boxOpen = false;
    this.blanketLifted = false;
    this.wardrobeOpen = false;

    // Level 3 Memory Timer
    this.memoryTimer = null;
    this.memorySecondsLeft = 8;
  }

  init() {
    // Initialized globally
  }

  updateHeader() {
    const scoreEl = document.getElementById("room-score-val");
    if (scoreEl) scoreEl.textContent = window.roomGameEngine.score;

    const progressEl = document.getElementById("room-progress-bar");
    const progressTextEl = document.getElementById("room-progress-text");
    const pct = window.roomGameEngine.getProgressPercentage();
    if (progressEl) progressEl.style.width = `${pct}%`;
    if (progressTextEl) progressTextEl.textContent = `🧹 ROOM RESCUE: ${pct}%`;
  }

  // =========================================================================
  // CARTOON ROOM RENDERING WITH REAL SVG OBJECTS
  // =========================================================================

  renderRoomStage(options = {}) {
    const {
      mode = "move",
      activeItemId = null,
      showClean = false
    } = options;

    const engine = window.roomGameEngine;

    return `
      <div class="cartoon-room-stage ${showClean ? 'room-sparkle-clean' : ''}" id="cartoon-room-stage">
        <!-- Room Walls & Floor Background -->
        <div class="room-wall-panel">
          <div class="room-window-frame">🪟 ☀️</div>
          <div class="room-picture-frame" onclick="roomUI.togglePictureSearch()">🖼️ 🏔️</div>
        </div>
        <div class="room-floor-panel"></div>

        <!-- 1. Bookshelf -->
        <div class="furniture-piece furniture-bookshelf" id="zone-shelf" data-zone-id="shelf">
          <div class="shelf-slot-zone" id="shelf-slot-top">
            <span class="zone-label-tag">BOOKSHELF</span>
          </div>
          <div class="shelf-plank"></div>
          <div class="shelf-slot-zone" id="shelf-slot-mid">
            <!-- Hidden Red Notebook behind books -->
            <div class="room-visual-item room-hidden-item ${engine.hiddenFoundMap.red_notebook ? 'is-revealed' : ''}" 
                 id="item-red_notebook" style="position: relative;" onclick="roomUI.collectHiddenItem('red_notebook')">
              ${ROOM_SVG.getNotebookSvg(55, 65)}
            </div>
          </div>
          <div class="shelf-plank"></div>
        </div>

        <!-- 2. Bed with Layered Blanket -->
        <div class="furniture-piece furniture-bed" id="zone-bed" data-zone-id="bed">
          <div class="bed-pillow"></div>
          <div class="bed-blanket ${this.blanketLifted ? 'blanket-lifted' : ''}" id="bed-blanket-el" onclick="roomUI.toggleBlanket()" title="Click blanket to lift/lower"></div>
          <div class="under-bed-zone" id="zone-under_bed" data-zone-id="under_bed">
            <span class="zone-label-tag" style="background: rgba(0,0,0,0.7); color: #fff;">UNDER THE BED</span>
          </div>
        </div>

        <!-- 3. Desk with Openable Drawer & Pencil Case -->
        <div class="furniture-piece furniture-desk" id="zone-desk" data-zone-id="desk">
          <div class="desk-surface">
            <span class="zone-label-tag">ON THE DESK</span>
            <div class="furniture-pencilcase" id="zone-pencil_case" data-zone-id="pencil_case" title="Pencil Case">
              ${ROOM_SVG.getPencilSvg("#059669", 55, 20)}
            </div>
          </div>
          <div class="desk-drawer-box ${this.drawerOpen ? 'drawer-pulled-open' : ''}" id="desk-drawer-el" onclick="roomUI.toggleDrawer()" title="Click to pull drawer open">
            <div class="desk-drawer-handle"></div>
            <!-- Key hidden inside drawer -->
            <div class="room-visual-item room-hidden-item ${engine.hiddenFoundMap.key ? 'is-revealed' : ''}" 
                 id="item-key" style="position: relative;" onclick="roomUI.collectHiddenItem('key')">
              ${ROOM_SVG.getKeySvg(50, 35)}
            </div>
          </div>
          <div class="under-desk-zone" id="zone-under_desk" data-zone-id="under_desk">
            <span class="zone-label-tag" style="background: rgba(0,0,0,0.7); color: #fff;">UNDER DESK</span>
          </div>
        </div>

        <!-- 4. Chair -->
        <div class="furniture-piece furniture-chair" id="zone-chair" data-zone-id="chair">
          <div class="chair-backrest"></div>
          <div class="chair-seat"></div>
          <div class="chair-legs"></div>
        </div>

        <!-- 5. Wardrobe -->
        <div class="furniture-piece furniture-wardrobe ${this.wardrobeOpen ? 'wardrobe-open' : ''}" id="zone-wardrobe" data-zone-id="wardrobe" onclick="roomUI.toggleWardrobe()" title="Click to open doors">
          <div class="wardrobe-doors">
            <div class="wardrobe-door-left"></div>
            <div class="wardrobe-door-right"></div>
          </div>
        </div>

        <!-- 6. Door -->
        <div class="furniture-piece furniture-door" id="zone-door" data-zone-id="door">
          <div class="door-knob"></div>
          <span class="zone-label-tag" style="position: absolute; bottom: 12px; left: 10px;">DOOR</span>
        </div>

        <!-- 7. Toy Box with Openable Lid -->
        <div class="furniture-piece furniture-toybox ${this.boxOpen ? 'toybox-open' : ''}" id="zone-box" data-zone-id="box" onclick="roomUI.toggleToybox()" title="Click lid to open">
          <div class="toybox-lid"></div>
          <div class="toybox-body">
            TOYS
            <!-- Blue Hat hidden inside box -->
            <div class="room-visual-item room-hidden-item ${engine.hiddenFoundMap.blue_hat ? 'is-revealed' : ''}" 
                 id="item-blue_hat" style="position: relative;" onclick="roomUI.collectHiddenItem('blue_hat')">
              ${ROOM_SVG.getHatSvg(55, 45)}
            </div>
          </div>
        </div>

        <!-- 8. Clothes Basket -->
        <div class="furniture-piece furniture-basket" id="zone-basket" data-zone-id="basket">
          <span class="zone-label-tag" style="position: absolute; bottom: -8px;">BASKET</span>
        </div>

        <!-- ===================================================================
             ACTUAL VISUAL DRAGGABLE SVG OBJECTS
             =================================================================== -->
        ${ROOM_DATA.initialItems.map(item => {
          const loc = engine.itemLocations[item.id] || "floor";
          let posStyle = `left: ${item.initX}%; top: ${item.initY}%;`;

          // If placed on furniture, position accordingly
          if (loc === "shelf") posStyle = "left: 6%; top: 16%;";
          else if (loc === "under_bed") posStyle = "left: 8%; top: 88%;";
          else if (loc === "under_desk") posStyle = "left: 45%; top: 78%;";
          else if (loc === "pencil_case") posStyle = "left: 56%; top: 44%;";
          else if (loc === "bed") posStyle = "left: 12%; top: 60%;";
          else if (loc === "door") posStyle = "left: 86%; top: 78%;";
          else if (loc === "basket") posStyle = "left: 86%; top: 76%;";
          else if (loc === "desk") posStyle = "left: 46%; top: 48%;";

          let itemSvg = "";
          if (item.id === "books") itemSvg = ROOM_SVG.getBooksSvg();
          else if (item.id === "shoes") itemSvg = ROOM_SVG.getShoesSvg();
          else if (item.id === "bag") itemSvg = ROOM_SVG.getBagSvg();
          else if (item.id === "blue_pencil") itemSvg = ROOM_SVG.getPencilSvg("#0284c7");
          else if (item.id === "teddy") itemSvg = ROOM_SVG.getTeddySvg();
          else if (item.id === "clothes") itemSvg = ROOM_SVG.getClothesSvg();

          return `
            <div class="room-visual-item ${item.id === activeItemId ? 'active-target-item' : ''}" 
                 id="drag-${item.id}" 
                 data-item-id="${item.id}"
                 style="${posStyle}"
                 onpointerdown="roomUI.handlePointerDown(event, '${item.id}')"
                 title="Drag ${item.name}!">
              ${itemSvg}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // =========================================================================
  // POINTER EVENTS DRAG-AND-DROP PHYSICS
  // =========================================================================

  handlePointerDown(event, itemId) {
    event.preventDefault();
    const stage = document.getElementById("cartoon-room-stage");
    const itemEl = document.getElementById(`drag-${itemId}`);
    if (!stage || !itemEl) return;

    this.isDragging = true;
    this.draggedItemId = itemId;
    this.draggedItemEl = itemEl;

    // Capture pointer
    itemEl.setPointerCapture(event.pointerId);

    const stageRect = stage.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    // Calculate pointer offset from item's top-left corner
    this.dragPointerOffset = {
      x: event.clientX - itemRect.left,
      y: event.clientY - itemRect.top
    };

    // Store starting position for spring-back
    this.dragStartPos = {
      left: itemEl.style.left,
      top: itemEl.style.top
    };

    itemEl.classList.add("is-dragging");
    if (window.soundEngine) window.soundEngine.playClick();

    // Event listeners
    const onPointerMove = (e) => this.handlePointerMove(e, stageRect);
    const onPointerUp = (e) => {
      itemEl.removeEventListener("pointermove", onPointerMove);
      itemEl.removeEventListener("pointerup", onPointerUp);
      itemEl.removeEventListener("pointercancel", onPointerUp);
      this.handlePointerUp(e, stageRect);
    };

    itemEl.addEventListener("pointermove", onPointerMove);
    itemEl.addEventListener("pointerup", onPointerUp);
    itemEl.addEventListener("pointercancel", onPointerUp);
  }

  handlePointerMove(event, stageRect) {
    if (!this.isDragging || !this.draggedItemEl) return;

    // Position relative to the room stage
    const x = event.clientX - stageRect.left - this.dragPointerOffset.x;
    const y = event.clientY - stageRect.top - this.dragPointerOffset.y;

    this.draggedItemEl.style.left = `${x}px`;
    this.draggedItemEl.style.top = `${y}px`;

    // Real-time collision hit-testing for drop zones
    this.testDropZoneCollisions(event.clientX, event.clientY);
  }

  testDropZoneCollisions(pointerX, pointerY) {
    // Hide item momentarily for elementFromPoint
    this.draggedItemEl.style.display = "none";
    const elemUnder = document.elementFromPoint(pointerX, pointerY);
    this.draggedItemEl.style.display = "";

    // Clear previous halos
    document.querySelectorAll(".furniture-piece, .under-bed-zone, .under-desk-zone, .furniture-pencilcase").forEach(el => {
      el.classList.remove("drop-target-active");
    });

    if (elemUnder) {
      const zoneEl = elemUnder.closest("[data-zone-id]");
      if (zoneEl) {
        zoneEl.classList.add("drop-target-active");
        this.currentHoverZoneId = zoneEl.getAttribute("data-zone-id");
        return;
      }
    }
    this.currentHoverZoneId = null;
  }

  handlePointerUp(event, stageRect) {
    if (!this.isDragging || !this.draggedItemEl) return;
    this.isDragging = false;

    const itemId = this.draggedItemId;
    const itemEl = this.draggedItemEl;
    const dropZoneId = this.currentHoverZoneId;

    itemEl.classList.remove("is-dragging");
    document.querySelectorAll(".drop-target-active").forEach(el => el.classList.remove("drop-target-active"));

    if (dropZoneId) {
      this.evaluateDropAction(itemId, dropZoneId, itemEl);
    } else {
      this.springBack(itemEl);
    }

    this.draggedItemEl = null;
    this.draggedItemId = null;
  }

  springBack(itemEl) {
    if (window.soundEngine) window.soundEngine.playWrong();
    itemEl.style.transition = "left 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    itemEl.style.left = this.dragStartPos.left;
    itemEl.style.top = this.dragStartPos.top;
    setTimeout(() => {
      itemEl.style.transition = "";
    }, 360);
  }

  // =========================================================================
  // DROP EVALUATION LOGIC
  // =========================================================================

  evaluateDropAction(itemId, dropZoneId, itemEl) {
    const currentLvl = window.roomGameEngine.currentLevel;

    // LEVEL 1: LISTEN & DRAG
    if (currentLvl === 1) {
      const task = ROOM_DATA.level1.tasks[window.roomGameEngine.level1TaskIndex];
      if (task.itemId === itemId && task.targetZoneId === dropZoneId) {
        this.animateSnapSuccess(itemEl, dropZoneId, itemId);
        window.roomGameEngine.itemLocations[itemId] = dropZoneId;
        window.roomGameEngine.addScore(1);
        this.updateHeader();

        if (window.soundEngine) {
          window.soundEngine.playCorrect();
          window.soundEngine.speak(`Great job! ${task.written}`);
        }

        const feedback = document.getElementById("level1-feedback-area");
        feedback.innerHTML = `
          <div class="feedback-box">
            <div>
              <div class="feedback-text">⭐ PERFECT PLACEMENT! (+1 Star)</div>
              <div style="font-weight: 800; color: #065f46; margin-top: 4px;">"${task.written}"</div>
            </div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel1Task()">
              ${window.roomGameEngine.level1TaskIndex + 1 < ROOM_DATA.level1.tasks.length ? 'NEXT OBJECT ➔' : 'COMPLETE LEVEL 1 ➔'}
            </button>
          </div>
        `;
      } else {
        this.springBack(itemEl);
        if (window.soundEngine) window.soundEngine.speak("Hmm... listen again!");
      }
    }

    // LEVEL 2: READ & ORGANIZE
    else if (currentLvl === 2) {
      const instruction = ROOM_DATA.level2.instructions.find(i => i.itemId === itemId && i.targetZoneId === dropZoneId);
      if (instruction) {
        this.animateSnapSuccess(itemEl, dropZoneId, itemId);
        window.roomGameEngine.level2CompletedItems.add(itemId);
        window.roomGameEngine.itemLocations[itemId] = dropZoneId;
        window.roomGameEngine.addScore(1);
        this.updateHeader();

        if (window.soundEngine) window.soundEngine.playCorrect();

        const total = ROOM_DATA.level2.instructions.length;
        const done = window.roomGameEngine.level2CompletedItems.size;

        const feedback = document.getElementById("level2-feedback-area");
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">⭐ ITEM ORGANIZED! (+1 Star)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(2)">
              ${done < total ? 'NEXT ITEM ➔' : 'GO TO SPATIAL MEMORY ➔'}
            </button>
          </div>
        `;
      } else {
        this.springBack(itemEl);
        if (window.soundEngine) window.soundEngine.speak("Read the checklist carefully!");
      }
    }

    // LEVEL 9: SPATIAL OPTIMIZATION
    else if (currentLvl === 9) {
      const task = ROOM_DATA.level9.tasks.find(t => t.itemId === itemId && t.targetZoneId === dropZoneId);
      if (task) {
        this.animateSnapSuccess(itemEl, dropZoneId, itemId);
        window.roomGameEngine.level9CompletedItems.add(itemId);
        window.roomGameEngine.itemLocations[itemId] = dropZoneId;
        window.roomGameEngine.addScore(2);
        this.updateHeader();

        if (window.soundEngine) window.soundEngine.playCorrect();

        const feedback = document.getElementById("level9-feedback-area");
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">⭐ OPTIMIZATION COMPLETE! (+2 Stars)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(9)">
              ${window.roomGameEngine.level9CompletedItems.size < ROOM_DATA.level9.tasks.length ? 'NEXT OPTIMIZATION ➔' : 'GO TO GRAND FINAL MISSION 🔥 ➔'}
            </button>
          </div>
        `;
      } else {
        this.springBack(itemEl);
      }
    }

    // FINAL CLIMAX MISSION
    else if (currentLvl === "final") {
      const step = ROOM_DATA.finalMission.steps[window.roomGameEngine.finalMissionStepIndex];
      if (step && step.type === "move" && step.itemId === itemId && step.targetZoneId === dropZoneId) {
        this.animateSnapSuccess(itemEl, dropZoneId, itemId);
        window.roomGameEngine.itemLocations[itemId] = dropZoneId;
        window.roomGameEngine.addScore(3);
        window.roomGameEngine.finalMissionStepIndex++;
        this.updateHeader();

        if (window.soundEngine) window.soundEngine.playCorrect();

        const feedback = document.getElementById("final-feedback-area");
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 STEP COMPLETE! (+3 Stars)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel('final')">
              NEXT FINAL STEP ➔
            </button>
          </div>
        `;
      } else {
        this.springBack(itemEl);
      }
    }
  }

  animateSnapSuccess(itemEl, zoneId, itemId) {
    const targetZoneEl = document.getElementById(`zone-${zoneId}`);
    if (targetZoneEl) {
      targetZoneEl.classList.add("drop-target-correct");
      setTimeout(() => targetZoneEl.classList.remove("drop-target-correct"), 600);
    }
  }

  // =========================================================================
  // CONTAINER & SEARCH INTERACTIONS
  // =========================================================================

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
    const drawerEl = document.getElementById("desk-drawer-el");
    if (drawerEl) {
      drawerEl.classList.toggle("drawer-pulled-open", this.drawerOpen);
      if (window.soundEngine) window.soundEngine.playLockClick();
    }
    if (this.drawerOpen) {
      const keyEl = document.getElementById("item-key");
      if (keyEl) keyEl.classList.add("is-revealed");
      this.evaluateSearchTarget("drawer");
    }
  }

  toggleToybox() {
    this.boxOpen = !this.boxOpen;
    const boxEl = document.getElementById("zone-box");
    if (boxEl) {
      boxEl.classList.toggle("toybox-open", this.boxOpen);
      if (window.soundEngine) window.soundEngine.playLockClick();
    }
    if (this.boxOpen) {
      const hatEl = document.getElementById("item-blue_hat");
      if (hatEl) hatEl.classList.add("is-revealed");
      this.evaluateSearchTarget("box");
    }
  }

  toggleBlanket() {
    this.blanketLifted = !this.blanketLifted;
    const blanketEl = document.getElementById("bed-blanket-el");
    if (blanketEl) {
      blanketEl.classList.toggle("blanket-lifted", this.blanketLifted);
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  toggleWardrobe() {
    this.wardrobeOpen = !this.wardrobeOpen;
    const wardrobeEl = document.getElementById("zone-wardrobe");
    if (wardrobeEl) {
      wardrobeEl.classList.toggle("wardrobe-open", this.wardrobeOpen);
      if (window.soundEngine) window.soundEngine.playLockClick();
    }
    if (this.wardrobeOpen) {
      this.evaluateSearchTarget("wardrobe");
    }
  }

  togglePictureSearch() {
    if (window.soundEngine) window.soundEngine.playClick();
    this.evaluateSearchTarget("picture");
  }

  collectHiddenItem(itemId) {
    window.roomGameEngine.hiddenFoundMap[itemId] = true;
    if (window.soundEngine) window.soundEngine.playFanfare();
  }

  evaluateSearchTarget(zoneId) {
    const currentLvl = window.roomGameEngine.currentLevel;

    if (currentLvl === 4) {
      const result = window.roomGameEngine.checkLevel4Search(zoneId);
      const feedback = document.getElementById("level4-feedback-area");
      if (result.success) {
        if (window.soundEngine) {
          window.soundEngine.playFanfare();
          window.soundEngine.speak(result.item.spokenFound);
        }
        window.roomGameEngine.addScore(2);
        this.updateHeader();

        feedback.innerHTML = `
          <div class="feedback-box">
            <div>
              <div class="feedback-text">🎉 FOUND! (+2 Stars)</div>
              <div style="font-weight: 800; color: #065f46; margin-top: 4px;">${result.item.foundText}</div>
            </div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(4)">
              ${window.roomGameEngine.level4FoundItems.size < 3 ? 'FIND NEXT ITEM ➔' : 'GO TO MULTI-STEP CLUES ➔'}
            </button>
          </div>
        `;
      }
    } else if (currentLvl === 5) {
      if (zoneId === "shelf") {
        const nbEl = document.getElementById("item-red_notebook");
        if (nbEl) nbEl.classList.add("is-revealed");
        window.roomGameEngine.addScore(3);
        this.updateHeader();
        if (window.soundEngine) {
          window.soundEngine.playFanfare();
          window.soundEngine.speak("You found the red notebook behind the books on the shelf!");
        }
        const feedback = document.getElementById("level5-feedback-area");
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 3-STEP DEDUCTION COMPLETE! (+3 Stars)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(6)">
              GO TO LISTENING SEARCH ➔
            </button>
          </div>
        `;
      }
    } else if (currentLvl === 6) {
      const result = window.roomGameEngine.checkLevel6Search(zoneId);
      const feedback = document.getElementById("level6-feedback-area");
      if (result.success) {
        if (window.soundEngine) {
          window.soundEngine.playCorrect();
          window.soundEngine.speak(result.challenge.explanation);
        }
        window.roomGameEngine.addScore(2);
        this.updateHeader();
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 FOUND! (+2 Stars)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel6()">
              ${window.roomGameEngine.level6ChallengeIndex + 1 < ROOM_DATA.level6.challenges.length ? 'NEXT AUDIO CLUE ➔' : 'GO TO READING SEARCH ➔'}
            </button>
          </div>
        `;
      }
    } else if (currentLvl === "final") {
      const isCorrect = window.roomGameEngine.checkFinalMissionAction("search", zoneId);
      const feedback = document.getElementById("final-feedback-area");
      if (isCorrect) {
        if (window.soundEngine) window.soundEngine.playCorrect();
        window.roomGameEngine.addScore(3);
        window.roomGameEngine.finalMissionStepIndex++;
        this.updateHeader();
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 FINAL STEP COMPLETE! (+3 Stars)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel('final')">
              NEXT STEP ➔
            </button>
          </div>
        `;
      }
    }
  }

  // =========================================================================
  // LEVEL SCREEN ROUTING
  // =========================================================================

  showLevel(levelKey) {
    window.roomGameEngine.currentLevel = levelKey;
    this.updateHeader();

    if (window.soundEngine) window.soundEngine.stopSpeech();
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }

    const container = document.getElementById("room-main-view");
    if (!container) return;

    switch (levelKey) {
      case "intro":
        this.renderIntro(container);
        break;
      case 1:
        this.renderLevel1(container);
        break;
      case 2:
        this.renderLevel2(container);
        break;
      case 3:
        this.renderLevel3(container);
        break;
      case 4:
        this.renderLevel4(container);
        break;
      case 5:
        this.renderLevel5(container);
        break;
      case 6:
        this.renderLevel6(container);
        break;
      case 7:
        this.renderLevel7(container);
        break;
      case 8:
        this.renderLevel8(container);
        break;
      case 9:
        this.renderLevel9(container);
        break;
      case "final":
        this.renderFinalMission(container);
        break;
      case "victory":
        this.renderVictory(container);
        break;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderIntro(container) {
    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1100px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #e0f2fe; color: #0369a1;">4TH GRADE ENGLISH MISSION</span>
          <h1 class="main-heading">🏠 ROOM RESCUE</h1>
          <p class="sub-heading">The Lost Things Mission</p>
        </div>

        <div class="intro-chest-container" style="background: radial-gradient(circle, rgba(224, 242, 254, 0.5) 0%, rgba(255,255,255,0) 70%);">
          <div style="font-size: 4.5rem; margin-bottom: 8px;">👧 🏠 🧸 🎒 📚</div>
          <div class="alarm-banner" style="background: #fef3c7; border-color: #f59e0b; color: #92400e;">
            “Oh no! My room is a mess! I can't find my things! Can you help me?”
          </div>
          <p style="font-size: 1.3rem; font-weight: 800; color: #334155; text-align: center; max-width: 750px; margin: 14px 0;">
            Touch and physically drag visual objects across the room! Pull open drawers, open boxes, and rescue the room!
          </p>
        </div>

        <div class="mission-brief-steps">
          <div class="step-card">
            <div class="step-icon">🖱️</div>
            <div class="step-text">1. Grab & Drag</div>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Physically move objects to shelf, bed & desk</p>
          </div>
          <div class="step-card">
            <div class="step-icon">📦</div>
            <div class="step-text">2. Open & Search</div>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Pull open drawers & boxes to find lost items</p>
          </div>
          <div class="step-card">
            <div class="step-icon">🔢</div>
            <div class="step-text">3. Sequence & Rescue</div>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Order action picture cards: First ➔ Finally</p>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 14px; margin-top: 24px;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.1rem; padding: 14px 28px;" onclick="uiController.showScreen('hub')">
            🏠 MAIN MENU
          </button>
          <button class="jumbo-btn btn-emerald" style="font-size: 1.5rem; padding: 18px 42px;" onclick="roomUI.showLevel(1)">
            🚀 START MISSION ➔
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) {
        window.soundEngine.speak("Oh no! My room is a mess! Can you help me make the room tidy and find the lost things?");
      }
    }, 400);
  }

  // LEVEL 1: LISTEN & DRAG
  renderLevel1(container) {
    const taskIdx = window.roomGameEngine.level1TaskIndex;
    const task = ROOM_DATA.level1.tasks[taskIdx];

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 1: LISTEN & DRAG (${taskIdx + 1}/${ROOM_DATA.level1.tasks.length})</span>
          <h2 class="main-heading">🎧 Listen & Physically Drag the Object</h2>
          <p class="sub-heading">Click 🔊 to hear the instruction, then grab the visual object in the room and drag it!</p>
        </div>

        <div class="room-control-ribbon">
          <button class="jumbo-btn btn-ocean" onclick="soundEngine.speak('${task.spoken}')" style="font-size: 1.1rem; padding: 10px 20px;">
            🔊 PLAY AUDIO
          </button>
          <div id="level1-written-text" style="display: none; font-size: 1.4rem; font-family: 'Bungee', cursive; color: #1e293b;">
            "${task.written}"
          </div>
          <button class="teacher-small-btn" onclick="document.getElementById('level1-written-text').style.display = 'block'">
            👁️ SHOW TEXT
          </button>
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ activeItemId: task.itemId })}
        </div>

        <div id="level1-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(task.spoken);
    }, 400);
  }

  nextLevel1Task() {
    if (window.roomGameEngine.level1TaskIndex + 1 < ROOM_DATA.level1.tasks.length) {
      window.roomGameEngine.level1TaskIndex++;
      this.showLevel(1);
    } else {
      this.showLevel(2);
    }
  }

  // LEVEL 2: READ & ORGANIZE
  renderLevel2(container) {
    const instructions = ROOM_DATA.level2.instructions;
    const completed = window.roomGameEngine.level2CompletedItems;
    const nextItem = instructions.find(i => !completed.has(i.itemId));

    if (!nextItem) {
      this.showLevel(3);
      return;
    }

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 2: READ & ORGANIZE (${completed.size}/${instructions.length} Done)</span>
          <h2 class="main-heading">📖 Read Checklist & Drag Objects</h2>
          <p class="sub-heading">Read the instruction and physically drag the object to its correct place in the room!</p>
        </div>

        <div class="checklist-tasks-grid">
          ${instructions.map(inst => `
            <div class="checklist-item-card ${completed.has(inst.itemId) ? 'item-done' : ''} ${nextItem.itemId === inst.itemId ? 'item-active' : ''}">
              <span class="check-box-icon">${completed.has(inst.itemId) ? '✅' : '⬜'}</span>
              <span style="font-weight: 900; font-size: 1.15rem;">${inst.text}</span>
            </div>
          `).join("")}
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ activeItemId: nextItem.itemId })}
        </div>

        <div id="level2-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  // LEVEL 3: SPATIAL MEMORY
  renderLevel3(container) {
    const qIdx = window.roomGameEngine.level3QuestionIndex;
    const questions = ROOM_DATA.level3.questions;
    const currentQ = questions[qIdx];
    this.memorySecondsLeft = ROOM_DATA.level3.timeLimit;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1200px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 3: SPATIAL MEMORY (Question ${qIdx + 1}/${questions.length})</span>
          <h2 class="main-heading">🧠 Remember Where Everything Is!</h2>
          <p class="sub-heading">Look at the tidy room for 8 seconds. Then answer from memory!</p>
        </div>

        <div class="memory-timer-container">
          <div class="memory-timer-pill" id="room-memory-timer-pill">⏱️ TIME LEFT: 8s</div>
          <div class="memory-progress-track">
            <div class="memory-progress-bar" id="room-memory-progress-bar"></div>
          </div>
        </div>

        <div id="room-memory-stage-view" class="room-scene-viewport">
          ${this.renderRoomStage({ showClean: true })}
        </div>

        <div id="room-memory-question-view" style="display: none; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
          <div class="question-spotlight-box" style="text-align: center; justify-content: center; flex-direction: column;">
            <span class="card-tag" style="background: #fee2e2; color: #b91c1c;">ROOM HIDDEN!</span>
            <div class="spotlight-question-text" style="font-size: 2rem;">"${currentQ.question}"</div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${currentQ.spoken}')" style="margin-top: 6px;">🔊</button>
          </div>

          <div class="choices-grid">
            ${currentQ.options.map((opt, i) => `
              <button class="choice-card-btn" id="room-l3-opt-${i}" onclick="roomUI.handleLevel3Answer(${i})">
                <span class="choice-text" style="font-size: 1.35rem;">"${opt.text}"</span>
              </button>
            `).join("")}
          </div>

          <div id="level3-feedback-area" style="width: 100%; max-width: 850px;"></div>
        </div>
      </div>
    `;

    this.startMemoryTimer();
  }

  startMemoryTimer() {
    if (this.memoryTimer) clearInterval(this.memoryTimer);

    const timerPill = document.getElementById("room-memory-timer-pill");
    const progBar = document.getElementById("room-memory-progress-bar");
    const stageView = document.getElementById("room-memory-stage-view");
    const qView = document.getElementById("room-memory-question-view");

    if (progBar) progBar.style.width = "100%";

    this.memoryTimer = setInterval(() => {
      this.memorySecondsLeft--;
      if (timerPill) timerPill.textContent = `⏱️ TIME LEFT: ${this.memorySecondsLeft}s`;
      if (progBar) progBar.style.width = `${(this.memorySecondsLeft / 8) * 100}%`;

      if (this.memorySecondsLeft <= 0) {
        clearInterval(this.memoryTimer);
        this.memoryTimer = null;

        if (stageView) stageView.style.display = "none";
        if (qView) {
          qView.style.display = "flex";
          const currentQ = ROOM_DATA.level3.questions[window.roomGameEngine.level3QuestionIndex];
          if (window.soundEngine) {
            window.soundEngine.playLockClick();
            window.soundEngine.speak(currentQ.spoken);
          }
        }
      }
    }, 1000);
  }

  handleLevel3Answer(choiceIdx) {
    const qIdx = window.roomGameEngine.level3QuestionIndex;
    const currentQ = ROOM_DATA.level3.questions[qIdx];
    const selected = currentQ.options[choiceIdx];
    const feedback = document.getElementById("level3-feedback-area");
    const btn = document.getElementById(`room-l3-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(selected.speech);
      }
      btn.classList.add("correct-choice");
      window.roomGameEngine.addScore(2);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🎉 MEMORY MASTER! (+2 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel3Question()">
            ${qIdx + 1 < ROOM_DATA.level3.questions.length ? 'NEXT QUESTION ➔' : 'GO TO LOST OBJECTS SEARCH ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try to remember!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Think back to the tidy room! Try again!</div>
        </div>
      `;
    }
  }

  nextLevel3Question() {
    if (window.roomGameEngine.level3QuestionIndex + 1 < ROOM_DATA.level3.questions.length) {
      window.roomGameEngine.level3QuestionIndex++;
      this.showLevel(3);
    } else {
      this.showLevel(4);
    }
  }

  // LEVEL 4: FIND LOST OBJECTS
  renderLevel4(container) {
    const lostItems = ROOM_DATA.level4.lostItems;
    const foundSet = window.roomGameEngine.level4FoundItems;
    const searches = window.roomGameEngine.searchesLeft;
    const activeTarget = lostItems.find(i => !foundSet.has(i.id));

    if (!activeTarget) {
      this.showLevel(5);
      return;
    }

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 4: FIND THE LOST OBJECTS (${foundSet.size}/3 Found)</span>
          <h2 class="main-heading">🔎 Find the Hidden Treasures!</h2>
          <p class="sub-heading">Read the clue! Click to open drawers, open toy boxes, or move books to find the lost items!</p>
        </div>

        <div class="search-clue-ribbon">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 3rem;">${activeTarget.icon}</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.3rem; color: #1e293b;">TARGET: ${activeTarget.name}</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #b45309;">"${activeTarget.clue}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${activeTarget.spokenClue}')">🔊</button>
          </div>
          <div class="searches-counter-pill ${searches <= 2 ? 'low-searches' : ''}">
            <span>🔎 SEARCHES:</span>
            <strong>${searches}</strong>
          </div>
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ mode: "search" })}
        </div>

        <div id="level4-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(activeTarget.spokenClue);
    }, 400);
  }

  // LEVEL 5: MULTI-STEP CLUES
  renderLevel5(container) {
    const clues = ROOM_DATA.level5.clues;
    const currentStep = window.roomGameEngine.level5CurrentStep;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 5: MULTI-STEP DEDUCTION</span>
          <h2 class="main-heading">🔴 Find the Red Notebook</h2>
          <p class="sub-heading">Follow the 3 clues! Interact with the bookshelf to discover the hidden notebook!</p>
        </div>

        <div class="multi-step-clues-box">
          ${clues.map(c => `
            <div class="clue-step-card ${c.step <= currentStep ? 'step-unlocked' : 'step-locked'}">
              <span class="step-pill">STEP ${c.step}</span>
              <span style="font-weight: 800; font-size: 1.15rem;">${c.text}</span>
              ${c.step <= currentStep ? `<button class="speak-icon-btn" onclick="soundEngine.speak('${c.spoken}')" style="width: 32px; height: 32px; font-size: 0.9rem;">🔊</button>` : ''}
            </div>
          `).join("")}
        </div>

        ${currentStep < 3 ? `
          <div style="text-align: center; margin: 12px 0;">
            <button class="jumbo-btn btn-gold" style="font-size: 1rem; padding: 10px 24px;" onclick="roomUI.unlockNextLevel5Clue()">
              📜 REVEAL CLUE ${currentStep + 1} ➔
            </button>
          </div>
        ` : ''}

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ mode: "search" })}
        </div>

        <div id="level5-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  unlockNextLevel5Clue() {
    if (window.roomGameEngine.level5CurrentStep < 3) {
      window.roomGameEngine.level5CurrentStep++;
      if (window.soundEngine) {
        const c = ROOM_DATA.level5.clues[window.roomGameEngine.level5CurrentStep - 1];
        window.soundEngine.playClue();
        window.soundEngine.speak(c.spoken);
      }
      this.showLevel(5);
    }
  }

  // LEVEL 6: LISTENING SEARCH
  renderLevel6(container) {
    const chIdx = window.roomGameEngine.level6ChallengeIndex;
    const challenge = ROOM_DATA.level6.challenges[chIdx];

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 6: LISTENING SEARCH (${chIdx + 1}/${ROOM_DATA.level6.challenges.length})</span>
          <h2 class="main-heading">🎧 Audio Clue Investigation</h2>
          <p class="sub-heading">Listen to the audio clue and interact with the correct container in the room!</p>
        </div>

        <div class="room-control-ribbon">
          <button class="jumbo-btn btn-ocean" onclick="soundEngine.speak('${challenge.spokenClue}')" style="font-size: 1.1rem; padding: 10px 20px;">
            🔊 PLAY AUDIO CLUE
          </button>
          <div id="level6-written-text" style="display: none; font-size: 1.4rem; font-family: 'Bungee', cursive; color: #1e293b;">
            "${challenge.writtenClue}"
          </div>
          <button class="teacher-small-btn" onclick="document.getElementById('level6-written-text').style.display = 'block'">
            👁️ SHOW TEXT
          </button>
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ mode: "search" })}
        </div>

        <div id="level6-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(challenge.spokenClue);
    }, 400);
  }

  nextLevel6() {
    if (window.roomGameEngine.level6ChallengeIndex + 1 < ROOM_DATA.level6.challenges.length) {
      window.roomGameEngine.level6ChallengeIndex++;
      this.showLevel(6);
    } else {
      this.showLevel(7);
    }
  }

  // LEVEL 7: READING SEARCH
  renderLevel7(container) {
    const chIdx = window.roomGameEngine.level7ChallengeIndex;
    const challenge = ROOM_DATA.level7.challenges[chIdx];

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 7: COMPLEX PREPOSITIONS (${chIdx + 1}/${ROOM_DATA.level7.challenges.length})</span>
          <h2 class="main-heading">📖 Complex Preposition Search</h2>
          <p class="sub-heading">Read the detailed clue and search the exact spot in the room!</p>
        </div>

        <div class="search-clue-ribbon">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 3rem;">${challenge.targetItem.icon}</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.3rem; color: #1e293b;">TARGET: ${challenge.targetItem.name}</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #1d4ed8;">"${challenge.textClue}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${challenge.spokenClue}')">🔊</button>
          </div>
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ mode: "search" })}
        </div>

        <div id="level7-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  nextLevel7() {
    if (window.roomGameEngine.level7ChallengeIndex + 1 < ROOM_DATA.level7.challenges.length) {
      window.roomGameEngine.level7ChallengeIndex++;
      this.showLevel(7);
    } else {
      this.showLevel(8);
    }
  }

  // LEVEL 8: SEQUENCE CLEAN-UP WITH VISUAL PICTURE CARDS
  renderLevel8(container) {
    const cards = [...ROOM_DATA.level8.cards];
    if (window.roomGameEngine.level8UserOrder.length === 0) {
      window.roomGameEngine.level8UserOrder = cards.map(c => c.id).sort(() => Math.random() - 0.5);
    }
    const currentOrder = window.roomGameEngine.level8UserOrder;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1200px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 8: VISUAL SEQUENCING</span>
          <h2 class="main-heading">🔢 Sequence the Clean-Up Picture Cards!</h2>
          <p class="sub-heading">Arrange the 5 illustrated action cards into order: First ➔ Then ➔ Next ➔ After that ➔ Finally!</p>
        </div>

        <div class="sequence-visual-track">
          ${currentOrder.map((cardId, idx) => {
            const card = cards.find(c => c.id === cardId);
            return `
              <div class="seq-picture-card" id="seq-card-${card.id}">
                <div class="seq-card-order-badge">${idx + 1}</div>
                <div class="seq-card-image">${ROOM_SVG.getSeqCardSvg(card.id)}</div>
                <strong style="font-family: 'Bungee', cursive; color: #4338ca; font-size: 1rem;">${card.seqWord}</strong>
                <div class="seq-card-caption">${card.caption}</div>
                <div style="display: flex; gap: 6px; margin-top: 10px;">
                  ${idx > 0 ? `<button class="teacher-small-btn" onclick="roomUI.moveSeqCard(${idx}, -1)">⬅️</button>` : ''}
                  ${idx < currentOrder.length - 1 ? `<button class="teacher-small-btn" onclick="roomUI.moveSeqCard(${idx}, 1)">➡️</button>` : ''}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 36px;" onclick="roomUI.checkLevel8Sequence()">
            ✅ CHECK SEQUENCE ➔
          </button>
        </div>

        <div id="level8-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  moveSeqCard(index, delta) {
    const list = window.roomGameEngine.level8UserOrder;
    const targetIdx = index + delta;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      this.renderLevel8(document.getElementById("room-main-view"));
    }
  }

  checkLevel8Sequence() {
    const isCorrect = window.roomGameEngine.checkLevel8Sequence(window.roomGameEngine.level8UserOrder);
    const feedback = document.getElementById("level8-feedback-area");

    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Perfect sequencing! First, then, next, after that, and finally!");
      }
      window.roomGameEngine.addScore(3);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 100% CORRECT SEQUENCE! (+3 Stars)</div>
            <div style="font-weight: 800; color: #065f46; margin-top: 4px;">
              First (Toys in box) ➔ Then (Books on shelf) ➔ Next (Clothes in basket) ➔ After that (Shoes near door) ➔ Finally (Clean floor)
            </div>
          </div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(9)">
            GO TO EFFICIENT ROOM ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Look at the sequence words: First, Then, Next, After that, Finally!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Look at the sequence words (First ➔ Then ➔ Next ➔ After that ➔ Finally). Try reordering!</div>
        </div>
      `;
    }
  }

  // LEVEL 9: THE EFFICIENT ROOM
  renderLevel9(container) {
    const tasks = ROOM_DATA.level9.tasks;
    const completed = window.roomGameEngine.level9CompletedItems;
    const nextTask = tasks.find(t => !completed.has(t.itemId));

    if (!nextTask) {
      this.showLevel("final");
      return;
    }

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 9: SPATIAL OPTIMIZATION (${completed.size}/${tasks.length} Done)</span>
          <h2 class="main-heading">🧠 The Efficient Room</h2>
          <p class="sub-heading">“It's tidy... but difficult to use!” Drag items to their most practical locations!</p>
        </div>

        <div class="search-clue-ribbon" style="background: linear-gradient(135deg, #fef3c7, #fde68a); color: #78350f;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 2.8rem;">💡</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">OPTIMIZATION TASK:</div>
              <div style="font-size: 1.3rem; font-weight: 900; color: #92400e;">"${nextTask.text}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${nextTask.spoken}')">🔊</button>
          </div>
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ activeItemId: nextTask.itemId })}
        </div>

        <div id="level9-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  // FINAL MISSION: GRAND ROOM RESCUE
  renderFinalMission(container) {
    const stepIdx = window.roomGameEngine.finalMissionStepIndex;
    const step = ROOM_DATA.finalMission.steps[stepIdx];

    if (!step) {
      this.showLevel("victory");
      return;
    }

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #fee2e2; color: #991b1b; border-color: #ef4444;">
            🔥 FINAL CLIMAX MISSION (Step ${stepIdx + 1}/5)
          </span>
          <h2 class="main-heading">🏠 Grand Room Rescue!</h2>
          <p class="sub-heading">Complete all final instructions to transform the messy room into a sparkling room!</p>
        </div>

        <div class="search-clue-ribbon" style="background: #1e293b; color: #fff;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 2.8rem;">⚡</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #38bdf8;">FINAL STEP ${stepIdx + 1}:</div>
              <div style="font-size: 1.35rem; font-weight: 900; color: #fef08a;">"${step.instruction}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${step.spoken}')">🔊</button>
          </div>
        </div>

        <div class="room-scene-viewport">
          ${this.renderRoomStage({ activeItemId: step.itemId })}
        </div>

        <div id="final-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(step.spoken);
    }, 400);
  }

  // VICTORY CEREMONY
  renderVictory(container) {
    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1100px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #fef08a; color: #854d0e;">✨ 🏠 ✨ MISSION ACCOMPLISHED</span>
          <h1 class="main-heading" style="color: #059669;">ROOM RESCUE COMPLETE!</h1>
          <p class="sub-heading">The room is 100% clean, organized, and all lost objects were found!</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 5.5rem; animation: bounce-success 1s infinite alternate;">🏠 ✨ 🏆 ✨ 👧</div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 2.2rem; color: #1e293b; margin: 12px 0;">
            “You found everything! My room is tidy, and now it's much easier to use!”
          </h2>
          <div style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: var(--primary-gold); margin-bottom: 20px;">
            TOTAL STARS EARNED: ${window.roomGameEngine.score} ⭐
          </div>
        </div>

        <div class="award-badge-card" style="border-color: #10b981; background: #ecfdf5; max-width: 600px; margin: 0 auto 24px;">
          <div class="award-icon">🏆</div>
          <div class="award-title" style="color: #065f46; font-size: 1.4rem;">CERTIFIED ROOM RESCUE EXPERT</div>
          <p style="font-weight: 800; color: #047857; margin-top: 6px;">
            For mastering prepositions (in, on, under, behind, next to), following audio/reading directions, and solving spatial clues!
          </p>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.2rem; padding: 14px 28px;" onclick="uiController.showScreen('hub')">
            🏠 MAIN MENU
          </button>
          <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 14px 28px;" onclick="roomUI.restartGame()">
            🔄 PLAY AGAIN
          </button>
        </div>
      </div>
    `;

    if (window.uiController) window.uiController.triggerConfetti(6000);
    if (window.soundEngine) {
      window.soundEngine.playFanfare();
      window.soundEngine.speak("Room Rescue Complete! You found everything and made the room tidy!");
    }
  }

  restartGame() {
    window.roomGameEngine.resetAll();
    this.drawerOpen = false;
    this.boxOpen = false;
    this.blanketLifted = false;
    this.wardrobeOpen = false;
    this.showLevel("intro");
  }

  openTeacherPanel() {
    const modal = document.getElementById("room-teacher-modal");
    const container = document.getElementById("room-teacher-body");
    if (!modal || !container) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #475569; padding-bottom: 12px; margin-bottom: 16px;">
        <h2 style="font-family: 'Bungee', cursive; color: #38bdf8; font-size: 1.5rem;">🧑‍🏫 Room Rescue Teacher Controls</h2>
        <button class="icon-btn" onclick="roomUI.closeTeacherPanel()">✕</button>
      </div>

      <div class="teacher-grid-section">
        <div class="teacher-card-mini" style="grid-column: 1 / -1;">
          <h4>🚀 Jump to Level</h4>
          <div class="teacher-actions-row">
            <button class="teacher-small-btn" onclick="roomUI.showLevel('intro'); roomUI.closeTeacherPanel();">Intro</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(1); roomUI.closeTeacherPanel();">L1: Listen & Drag</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(2); roomUI.closeTeacherPanel();">L2: Read & Organize</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(3); roomUI.closeTeacherPanel();">L3: Spatial Memory</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(4); roomUI.closeTeacherPanel();">L4: Lost Objects</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(5); roomUI.closeTeacherPanel();">L5: Multi-Step</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(6); roomUI.closeTeacherPanel();">L6: Listening Search</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(7); roomUI.closeTeacherPanel();">L7: Reading Search</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(8); roomUI.closeTeacherPanel();">L8: Sequence Clean</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(9); roomUI.closeTeacherPanel();">L9: Efficient Room</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel('final'); roomUI.closeTeacherPanel();">🔥 Final Climax</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel('victory'); roomUI.closeTeacherPanel();">🏆 Victory Ceremony</button>
          </div>
        </div>

        <div class="teacher-card-mini">
          <h4>⭐ Manage Searches & Stars</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>Searches Left: <strong>${window.roomGameEngine.searchesLeft}</strong></span>
              <div style="display: flex; gap: 4px;">
                <button class="teacher-small-btn" onclick="roomGameEngine.addSearches(-1); roomUI.openTeacherPanel();">-1</button>
                <button class="teacher-small-btn" onclick="roomGameEngine.addSearches(2); roomUI.openTeacherPanel();">+2 🔎</button>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>Stars Earned: <strong>${window.roomGameEngine.score} ⭐</strong></span>
              <div style="display: flex; gap: 4px;">
                <button class="teacher-small-btn" onclick="roomGameEngine.addScore(1); roomUI.updateHeader(); roomUI.openTeacherPanel();">+1 ⭐</button>
                <button class="teacher-small-btn" onclick="roomGameEngine.addScore(5); roomUI.updateHeader(); roomUI.openTeacherPanel();">+5 ⭐</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  closeTeacherPanel() {
    const modal = document.getElementById("room-teacher-modal");
    if (modal) modal.classList.remove("active");
  }
}

window.roomUI = new RoomUIController();
