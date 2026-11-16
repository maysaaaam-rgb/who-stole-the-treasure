(function () {
  'use strict';

  let stage = null;
  let manifest = null;
  const statusEl = document.getElementById('f3d-status-line');
  const boneInfoEl = document.getElementById('f3d-bone-info');
  const animBarEl = document.getElementById('f3d-anim-bar');
  const gridEl = document.getElementById('f3d-pack-grid');
  const vpEl = document.getElementById('f3d-viewport');

  function setStatus(msg) {
    if (statusEl) statusEl.innerHTML = msg;
  }

  async function fileExists(relUrl) {
    try {
      const r = await fetch('../' + relUrl, { method: 'HEAD' });
      return r.ok;
    } catch (_) {
      return false;
    }
  }

  function renderAnimButtons(anims) {
    if (!animBarEl) return;
    if (!anims || !anims.length) {
      animBarEl.innerHTML = '<span class="f3d-muted">Static mesh (no embedded animation clips yet)</span>';
      return;
    }
    animBarEl.innerHTML = anims.map((name, idx) =>
      `<button type="button" class="btn-3d btn-3d-slate sm-btn" onclick="window.__play3dAnim(${idx})">▶ ${name}</button>`
    ).join('');
  }

  window.__play3dAnim = function (idx) {
    if (stage) stage.playAnimation(idx);
  };

  async function loadCharacterSource(src, label) {
    try {
      setStatus(`Loading <strong>${label}</strong>...`);
      const info = await stage.setCharacterFromSource(src);
      renderAnimButtons(info.animations);
      if (info.bones.length) {
        boneInfoEl.innerHTML = `✅ Rigged Skeleton Detected (<strong>${info.bones.length} bones</strong>): <code>${info.bones.slice(0, 8).join(', ')}${info.bones.length > 8 ? '…' : ''}</code>`;
      } else {
        boneInfoEl.innerHTML = `ℹ️ Loaded mesh without skeleton bones — using fallback anchor offsets.`;
      }
      setStatus(`Loaded <strong>${label}</strong>! Drag to orbit 360°, scroll to zoom.`);
    } catch (e) {
      setStatus(`⚠️ Could not load <code>${label}</code>: ${e.message}`);
    }
  }

  async function loadItemSource(itemCfg, src) {
    try {
      if (!stage.characterObj) {
        const gltf = typeof src === 'string' ? await stage.loadGlbFromUrl(src) : await stage.loadGlbFromFile(src);
        stage.showStandalonePropFromGltf(gltf);
        setStatus(`Previewing standalone 3D item: <strong>${itemCfg.name}</strong> (load a character .glb to see it snapped to bone!).`);
      } else {
        await stage.equipItemFromSource(itemCfg, src);
        setStatus(`Equipped <strong>${itemCfg.name}</strong> onto <code>${itemCfg.slot}</code> socket!`);
      }
    } catch (e) {
      setStatus(`⚠️ Could not load item <strong>${itemCfg.name}</strong>: ${e.message}`);
    }
  }

  async function renderPilotPack() {
    if (!manifest || !gridEl) return;
    const charCfg = manifest.pilotPack.character;
    const items = manifest.pilotPack.items;
    const allEntries = [
      Object.assign({ isChar: true, slot: 'character (A-pose)' }, charCfg),
      ...items
    ];

    const statuses = await Promise.all(allEntries.map((e) => fileExists(e.glbPath)));

    gridEl.innerHTML = allEntries.map((entry, idx) => {
      const hasGlb = statuses[idx];
      return `
        <article class="f3d-card">
          <div class="f3d-card-media">
            <img src="../${entry.refPath}?v=${Date.now()}" alt="${entry.name}" loading="lazy" onerror="this.alt='Generating reference PNG...';">
            <span class="f3d-pill ${hasGlb ? 'ready' : 'pending'}">${hasGlb ? '✅ .GLB Ready' : '⏳ Needs .GLB'}</span>
          </div>
          <div class="f3d-card-body">
            <h3 class="f3d-card-title">${entry.name}</h3>
            <div class="f3d-card-meta">Slot: <code>${entry.slot}</code><br>Save to: <code>${entry.glbPath}</code></div>
            <div class="f3d-card-acts">
              <a href="../${entry.refPath}" download="${entry.id}-ref.png" class="btn-3d btn-3d-cyan sm-btn">⬇ PNG</a>
              ${hasGlb ? `<button type="button" class="btn-3d btn-3d-emerald sm-btn" onclick="window.__loadManifestGlb('${entry.id}')">▶ Preview 3D</button>` : ''}
              <label class="btn-3d btn-3d-slate sm-btn" style="cursor:pointer;">
                <span>📂 Test .glb</span>
                <input type="file" accept=".glb,.gltf" hidden onchange="window.__testSlotFile('${entry.id}', this.files[0])">
              </label>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Auto-load character if kid-base.glb is already saved on disk
    if (statuses[0]) {
      await loadCharacterSource('../' + charCfg.glbPath, charCfg.name);
    }
  }

  window.__loadManifestGlb = function (id) {
    const charCfg = manifest.pilotPack.character;
    if (id === charCfg.id) {
      loadCharacterSource('../' + charCfg.glbPath, charCfg.name);
      return;
    }
    const item = manifest.pilotPack.items.find((x) => x.id === id);
    if (item) loadItemSource(item, '../' + item.glbPath);
  };

  window.__testSlotFile = function (id, file) {
    if (!file) return;
    const charCfg = manifest.pilotPack.character;
    if (id === charCfg.id) {
      loadCharacterSource(file, file.name);
      return;
    }
    const item = manifest.pilotPack.items.find((x) => x.id === id);
    if (item) loadItemSource(item, file);
  };

  function setupDragAndDrop() {
    if (!vpEl) return;
    ['dragenter', 'dragover'].forEach((ev) => {
      vpEl.addEventListener(ev, (e) => {
        e.preventDefault();
        vpEl.classList.add('is-dragover');
      });
    });
    ['dragleave', 'drop'].forEach((ev) => {
      vpEl.addEventListener(ev, (e) => {
        e.preventDefault();
        vpEl.classList.remove('is-dragover');
      });
    });
    vpEl.addEventListener('drop', (e) => {
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      if (/kid|char|base|player|avatar/i.test(file.name) || !stage.characterObj) {
        loadCharacterSource(file, file.name);
      } else {
        const matched = (manifest?.pilotPack?.items || []).find((it) => file.name.toLowerCase().includes(it.id));
        const cfg = matched || { id: file.name, name: file.name, slot: 'custom', boneCandidates: [], fallbackOffset: [0, 1.2, 0], scale: 0.45 };
        loadItemSource(cfg, file);
      }
    });
  }

  async function init() {
    stage = new window.Avatar3DEngine.Stage(vpEl, { autoRotate: true });
    setupDragAndDrop();

    const spinBtn = document.getElementById('btn-spin-toggle');
    let spinning = true;
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        spinning = !spinning;
        stage.setAutoRotate(spinning);
        spinBtn.textContent = spinning ? '🔄 Spin: ON' : '⏸️ Spin: OFF';
      });
    }

    const bakeBtn = document.getElementById('btn-bake-png');
    if (bakeBtn) {
      bakeBtn.addEventListener('click', () => {
        const url = stage.bakeCardPng();
        const a = document.createElement('a');
        a.href = url;
        a.download = 'avatar-3d-card.png';
        a.click();
      });
    }

    document.getElementById('input-char-glb')?.addEventListener('change', (e) => {
      if (e.target.files[0]) loadCharacterSource(e.target.files[0], e.target.files[0].name);
    });
    document.getElementById('input-prop-glb')?.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      loadItemSource({ id: 'custom-prop', name: f.name, slot: 'prop', boneCandidates: [], fallbackOffset: [0, 1.2, 0], scale: 0.45 }, f);
    });

    const objBtn = document.getElementById('btn-export-obj');
    if (objBtn) {
      objBtn.addEventListener('click', () => {
        const objStr = stage.exportCharacterObj();
        if (!objStr) { setStatus('⚠️ Load a character .glb first before exporting .OBJ.'); return; }
        const blob = new Blob([objStr], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'kid-base-mixamo.obj';
        a.click();
      });
    }

    try {
      const res = await fetch('../assets/3d/manifest.json?v=' + Date.now());
      manifest = await res.json();
      await renderPilotPack();
      const charCfg = manifest.pilotPack.character;
      if (charCfg && await fileExists(charCfg.glbPath)) {
        await loadCharacterSource('../' + charCfg.glbPath, charCfg.name);
        const crownCfg = (manifest.pilotPack.items || []).find((x) => x.id === 'crown');
        if (crownCfg && await fileExists(crownCfg.glbPath)) {
          await loadItemSource(crownCfg, '../' + crownCfg.glbPath);
        }
      }
    } catch (e) {
      setStatus('⚠️ Could not load assets/3d/manifest.json');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
