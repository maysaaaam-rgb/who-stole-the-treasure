/* ==========================================================================
   SMART BOARD — pen, cards, /commands and the AI helper
   Works without the AI (pen, library pictures, spell, say, timer, pick, dice).
   ========================================================================== */
(function (root) {
  'use strict';

  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const AI = root.SmartAI, AU = root.SBAudio;

  const board = $('#board'), ink = $('#inkCanvas'), live = $('#liveCanvas'), layer = $('#objLayer'), fab = $('#neatFab');
  const ictx = ink.getContext('2d'), lctx = live.getContext('2d');
  const cmdInput = $('#cmdInput'), suggest = $('#cmdSuggest');
  const SAVE_KEY = 'smartboard.board.v1', OPT_KEY = 'smartboard.opts.v1';
  const LIGHT_BGS = ['white', 'lines', 'grid'];

  function lsGet(k, fallback) { try { const v = root.localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function lsSet(k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  const opts = Object.assign({ autoNeat: true, speak: true, turkish: true, bg: 'dark', muted: false }, lsGet(OPT_KEY, {}));
  let state = { strokes: [], objects: [] };
  let tool = 'pen', color = 'ink', size = 7;
  let uid = Math.floor(Math.random() * 1e6);
  const newId = (p) => p + (++uid).toString(36) + Date.now().toString(36).slice(-3);
  const pending = new Set(), processing = new Set();
  const hist = { undo: [], redo: [] };
  const els = new Map();
  const bbCache = new Map();
  let selectedId = null, neatTimer = null, dpr = 1, W = 0, H = 0;

  /* ------------------------------------------------------------------ helpers */
  const isLight = () => LIGHT_BGS.includes(opts.bg);
  const resolveColor = (c) => (c === 'ink' ? (isLight() ? '#0f172a' : '#f8fafc') : c);
  const getObj = (id) => state.objects.find((o) => o.id === id);
  const strokeById = (id) => state.strokes.find((s) => s.id === id);
  function speak(t) { if (opts.speak && t) AU.speak(t); }

  let toastTimer = null;
  function toast(msg, ms) {
    const t = $('#toast');
    t.textContent = msg; t.classList.remove('hidden');
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), ms || 3600);
  }

  /* ------------------------------------------------------------------ canvas */
  function resize() {
    dpr = Math.min(root.devicePixelRatio || 1, 2);
    W = root.innerWidth; H = root.innerHeight;
    [ink, live].forEach((c) => { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
    ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawInk();
    updateFab();
  }

  // o: { k: scale, ox, oy: origin, color: force colour, minW: thinnest line }
  function drawStroke(ctx, s, o) {
    o = o || {};
    const k = o.k || 1, ox = o.ox || 0, oy = o.oy || 0, pts = s.pts, n = pts.length;
    if (!n) return;
    const X = (p) => (p[0] - ox) * k, Y = (p) => (p[1] - oy) * k;
    const col = o.color || resolveColor(s.color);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = col; ctx.fillStyle = col;
    if (o.alpha) ctx.globalAlpha = o.alpha;
    if (s.tool === 'hl') {
      ctx.globalAlpha = (o.alpha || 1) * 0.33;
      ctx.lineWidth = s.size * 3.2 * k;
      ctx.beginPath(); ctx.moveTo(X(pts[0]), Y(pts[0]));
      for (let i = 1; i < n; i++) ctx.lineTo(X(pts[i]), Y(pts[i]));
      if (n === 1) ctx.lineTo(X(pts[0]) + 0.1, Y(pts[0]));
      ctx.stroke(); ctx.restore(); return;
    }
    const w = (p) => Math.max(o.minW || 0, s.size * (0.55 + (p[2] == null ? 0.5 : p[2]) * 0.9) * k);
    if (n === 1) { ctx.beginPath(); ctx.arc(X(pts[0]), Y(pts[0]), w(pts[0]) / 2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return; }
    let px = X(pts[0]), py = Y(pts[0]);
    for (let i = 1; i < n - 1; i++) {
      const mx = (X(pts[i]) + X(pts[i + 1])) / 2, my = (Y(pts[i]) + Y(pts[i + 1])) / 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(X(pts[i]), Y(pts[i]), mx, my);
      ctx.lineWidth = w(pts[i]); ctx.stroke();
      px = mx; py = my;
    }
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(X(pts[n - 1]), Y(pts[n - 1]));
    ctx.lineWidth = w(pts[n - 1]); ctx.stroke();
    ctx.restore();
  }

  function redrawInk() {
    ictx.clearRect(0, 0, W, H);
    state.strokes.forEach((s) => drawStroke(ictx, s, processing.has(s.id) ? { alpha: 0.45 } : null));
  }

  function bb(s) {
    let b = bbCache.get(s.id);
    if (b) return b;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    s.pts.forEach((p) => { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
    const r = s.size * (s.tool === 'hl' ? 1.6 : 0.8);
    b = { x: x0 - r, y: y0 - r, w: x1 - x0 + 2 * r, h: y1 - y0 + 2 * r };
    bbCache.set(s.id, b);
    return b;
  }
  function unionBox(list) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    list.forEach((s) => { const b = bb(s); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  /* ------------------------------------------------------------------ history + saving */
  function snap() { return { strokes: state.strokes.slice(), objects: state.objects.map((o) => Object.assign({}, o)) }; }
  function pushHistory() {
    hist.undo.push(snap());
    if (hist.undo.length > 60) hist.undo.shift();
    hist.redo.length = 0;
    updateUndo();
  }
  function restore(s) {
    state = { strokes: s.strokes.slice(), objects: s.objects.map((o) => Object.assign({}, o)) };
    const alive = new Set(state.strokes.map((x) => x.id));
    [...pending].forEach((id) => { if (!alive.has(id)) pending.delete(id); });
    if (selectedId && !getObj(selectedId)) selectedId = null;
    redrawInk(); renderObjects(); updateFab(); updateUndo(); save();
  }
  function undo() { if (!hist.undo.length) return; hist.redo.push(snap()); restore(hist.undo.pop()); AU.pop(); }
  function redo() { if (!hist.redo.length) return; hist.undo.push(snap()); restore(hist.redo.pop()); AU.pop(); }
  function updateUndo() { $('#btnUndo').disabled = !hist.undo.length; $('#btnRedo').disabled = !hist.redo.length; }

  let saveTimer = null;
  function saveNow() {
    clearTimeout(saveTimer); saveTimer = null;
    if (!lsSet(SAVE_KEY, { v: 1, strokes: state.strokes, objects: state.objects })) {
      // Too big for the browser: keep everything except AI pictures
      lsSet(SAVE_KEY, { v: 1, strokes: state.strokes, objects: state.objects.filter((o) => !(o.data && /^data:/.test(o.data.src || o.data.pic || ''))) });
    }
  }
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 700); }
  root.addEventListener('pagehide', () => { if (saveTimer) saveNow(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveTimer) saveNow(); });
  function loadSaved() {
    const d = lsGet(SAVE_KEY, null);
    if (!d || !Array.isArray(d.strokes) || !Array.isArray(d.objects)) return;
    state = { strokes: d.strokes.filter((s) => s && Array.isArray(s.pts)), objects: d.objects.filter((o) => o && o.id && o.type) };
  }

  /* ------------------------------------------------------------------ pen input */
  let cur = null, erasing = null;
  function pt(e) {
    const r = board.getBoundingClientRect();
    const pr = e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5;
    return [Math.round((e.clientX - r.left) * 10) / 10, Math.round((e.clientY - r.top) * 10) / 10, Math.round(pr * 100) / 100];
  }

  ink.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (cur || erasing) return; // ignore a second finger
    select(null); closeSuggest();
    if (document.activeElement === cmdInput) cmdInput.blur();
    clearTimeout(neatTimer);
    try { ink.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = pt(e);
    if (tool === 'eraser') { erasing = { pid: e.pointerId, snapped: false }; eraseAt(p); return; }
    cur = { id: newId('s'), tool, color, size, pts: [p], pid: e.pointerId };
    fab.classList.add('hidden');
  });
  ink.addEventListener('pointermove', (e) => {
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    if (erasing && e.pointerId === erasing.pid) { evs.forEach((ev) => eraseAt(pt(ev))); return; }
    if (tool === 'eraser' && !erasing) { drawEraserRing(pt(e)); return; }
    if (!cur || e.pointerId !== cur.pid) return;
    evs.forEach((ev) => {
      const p = pt(ev), last = cur.pts[cur.pts.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) >= 1.2) cur.pts.push(p);
    });
    lctx.clearRect(0, 0, W, H);
    drawStroke(lctx, cur);
  });
  function endPointer(e) {
    if (erasing && e.pointerId === erasing.pid) { erasing = null; lctx.clearRect(0, 0, W, H); if (tool === 'eraser') drawEraserRing(pt(e)); save(); return; }
    if (!cur || e.pointerId !== cur.pid) return;
    const s = { id: cur.id, tool: cur.tool, color: cur.color, size: cur.size, pts: cur.pts };
    cur = null;
    lctx.clearRect(0, 0, W, H);
    pushHistory();
    state.strokes.push(s);
    drawStroke(ictx, s);
    if (s.tool === 'pen') { pending.add(s.id); scheduleNeat(); }
    updateFab(); save();
  }
  ink.addEventListener('pointerup', endPointer);
  ink.addEventListener('pointercancel', endPointer);
  ink.addEventListener('pointerleave', () => { if (tool === 'eraser' && !erasing) lctx.clearRect(0, 0, W, H); });

  function drawEraserRing(p) {
    lctx.clearRect(0, 0, W, H);
    lctx.save(); lctx.strokeStyle = isLight() ? 'rgba(15,23,42,.5)' : 'rgba(255,255,255,.6)'; lctx.lineWidth = 2;
    lctx.beginPath(); lctx.arc(p[0], p[1], eraserR(), 0, Math.PI * 2); lctx.stroke(); lctx.restore();
  }
  const eraserR = () => 14 + size * 1.6;
  function eraseAt(p) {
    drawEraserRing(p);
    const r = eraserR();
    const hit = state.strokes.filter((s) => {
      const b = bb(s);
      if (p[0] < b.x - r || p[0] > b.x + b.w + r || p[1] < b.y - r || p[1] > b.y + b.h + r) return false;
      const rr = r + s.size * (s.tool === 'hl' ? 1.6 : 0.6);
      return s.pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < rr);
    });
    if (!hit.length) return;
    if (!erasing.snapped) { pushHistory(); erasing.snapped = true; }
    const ids = new Set(hit.map((s) => s.id));
    state.strokes = state.strokes.filter((s) => !ids.has(s.id));
    ids.forEach((id) => pending.delete(id));
    redrawInk(); updateFab();
  }

  /* ------------------------------------------------------------------ ✨ neat handwriting */
  function scheduleNeat() {
    clearTimeout(neatTimer);
    if (opts.autoNeat && AI.ready && pending.size) neatTimer = setTimeout(() => runNeat(false), 2200);
  }
  function updateFab() {
    const list = [...pending].map(strokeById).filter(Boolean);
    if (!AI.ready || !list.length || cur) { fab.classList.add('hidden'); return; }
    const b = unionBox(list);
    fab.style.left = clamp(b.x + b.w + 10, 90, W - 150) + 'px';
    fab.style.top = clamp(b.y + b.h - 10, 70, H - 220) + 'px';
    fab.classList.remove('hidden');
  }
  fab.addEventListener('click', () => runNeat(true));

  function clusters(list) {
    const boxes = list.map(bb);
    const hs = boxes.map((b) => b.h).sort((a, b) => a - b);
    const med = hs[Math.floor(hs.length / 2)] || 40;
    const pad = clamp(med * 0.7, 28, 90);
    const parent = list.map((_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = boxes[i], c = boxes[j];
        if (a.x - pad < c.x + c.w && c.x < a.x + a.w + pad && a.y - pad * 0.6 < c.y + c.h && c.y < a.y + a.h + pad * 0.6) parent[find(i)] = find(j);
      }
    }
    const groups = new Map();
    list.forEach((s, i) => { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(s); });
    return [...groups.values()].map((strokes) => ({ strokes, box: unionBox(strokes) }));
  }

  function strokesPNG(strokes, b, forReading) {
    const pad = 24;
    let k;
    if (forReading) {
      k = clamp(180 / Math.max(b.h, 40), 0.25, 3);
      if ((b.w + pad * 2) * k > 1600) k = 1600 / (b.w + pad * 2);
    } else {
      k = clamp(768 / Math.max(b.w + pad * 2, b.h + pad * 2), 0.25, 4);
    }
    const c = document.createElement('canvas');
    c.width = Math.max(8, Math.round((b.w + pad * 2) * k));
    c.height = Math.max(8, Math.round((b.h + pad * 2) * k));
    const x = c.getContext('2d');
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
    strokes.forEach((s) => {
      let col = '#111111';
      if (!forReading) { const rc = resolveColor(s.color).toLowerCase(); col = ['#f8fafc', '#fde047', '#ffffff'].includes(rc) ? '#111111' : rc; }
      drawStroke(x, s, { k, ox: b.x - pad, oy: b.y - pad, color: col, minW: 3 });
    });
    return c.toDataURL('image/png').split(',')[1];
  }

  function runNeat(manual) {
    clearTimeout(neatTimer);
    if (!AI.ready) {
      if (manual) { toast('Switch on the AI in ⚙️ to make writing neat.'); openSettings(); }
      return;
    }
    const list = [...pending].map(strokeById).filter((s) => s && s.tool === 'pen');
    pending.clear(); updateFab();
    if (!list.length) { if (manual) toast('Write something first ✍️'); return; }
    clusters(list).slice(0, 6).forEach(neatGroup);
  }

  async function neatGroup(g) {
    const b = g.box;
    if (b.w < 16 && b.h < 16) return;
    g.strokes.forEach((s) => processing.add(s.id));
    redrawInk();
    const pill = showPill(b.x, b.y + b.h + 8, '<span class="spinner"></span> Reading…');
    try {
      const d = await AI.call('neat', { image: strokesPNG(g.strokes, b, true) }, 30000);
      const ids = new Set(g.strokes.map((s) => s.id));
      const still = state.strokes.filter((s) => ids.has(s.id));
      if (!still.length) return; // erased while the AI was reading
      if (d.kind === 'text' && String(d.corrected || '').trim()) {
        const lines = (Array.isArray(d.lines) && d.lines.length ? d.lines : String(d.corrected).split(/\n/))
          .map((x) => String(x).trim()).filter(Boolean).slice(0, 6);
        const fs = clamp((b.h / lines.length) * 0.82, 26, 190);
        pushHistory();
        state.strokes = state.strokes.filter((s) => !ids.has(s.id));
        const o = makeObj('text', { lines, color: majorityColor(still), fs, read: String(d.read || ''), changed: !!d.changed, tip: String(d.tip || '') },
          b.x, b.y - fs * 0.1, 1);
        state.objects.push(o);
        redrawInk(); renderObjects(); sparkle(o.id);
        AU.sparkle();
        if (d.changed) setTimeout(() => AU.correct(), 250);
        speak(lines.join(' '));
        save();
      } else if (d.kind === 'drawing') {
        showSketchChip(g, String(d.drawingGuess || '').slice(0, 40));
      } else {
        toast('I could not read that. Try bigger letters ✍️'); AU.softFail();
      }
    } catch (err) {
      aiError(err);
    } finally {
      pill.remove();
      g.strokes.forEach((s) => processing.delete(s.id));
      redrawInk();
    }
  }
  function majorityColor(list) {
    const n = {};
    list.forEach((s) => { n[s.color] = (n[s.color] || 0) + s.pts.length; });
    return Object.keys(n).sort((a, b) => n[b] - n[a])[0] || 'ink';
  }

  function showPill(x, y, html) {
    const p = document.createElement('div');
    p.className = 'loading-pill';
    p.innerHTML = html;
    p.style.left = clamp(x, 90, W - 220) + 'px';
    p.style.top = clamp(y, 70, H - 200) + 'px';
    layer.appendChild(p);
    return p;
  }

  function showSketchChip(g, guess) {
    const b = g.box;
    const chip = document.createElement('div');
    chip.className = 'sketch-chip';
    chip.innerHTML = `🎨 Make a picture of <input type="text" value="${esc(guess)}" maxlength="60" aria-label="What is it?">
      <button type="button" class="btn-primary">✨ Go</button><button type="button" class="x" aria-label="Close">✕</button>`;
    chip.style.left = clamp(b.x, 90, W - 470) + 'px';
    chip.style.top = clamp(b.y + b.h + 10, 70, H - 210) + 'px';
    layer.appendChild(chip);
    let touched = false;
    const kill = setTimeout(() => { if (!touched) chip.remove(); }, 20000);
    chip.addEventListener('pointerdown', () => { touched = true; clearTimeout(kill); });
    chip.querySelector('.x').addEventListener('click', () => chip.remove());
    const go = () => {
      const subject = chip.querySelector('input').value.trim() || 'the drawing';
      chip.remove();
      const strokes = g.strokes.filter((s) => strokeById(s.id));
      if (!strokes.length) { toast('The drawing was erased.'); return; }
      const box = unionBox(strokes);
      const right = box.x + box.w + 30;
      const pos = right + 380 < W - 20 ? { x: right, y: clamp(box.y, 80, H - 600) } : null;
      aiPicture(subject, { sketch: strokesPNG(strokes, box, false), pos });
    };
    chip.querySelector('.btn-primary').addEventListener('click', go);
    chip.querySelector('input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    AU.pop();
  }

  function sparkle(id) {
    const el = els.get(id); if (!el) return;
    const box = document.createElement('div');
    box.className = 'neat-sparkle';
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('i');
      s.style.left = (10 + Math.random() * 80) + '%';
      s.style.top = (10 + Math.random() * 80) + '%';
      s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      s.style.setProperty('--dy', (Math.random() * 120 - 60) + 'px');
      s.style.animationDelay = (Math.random() * 0.25) + 's';
      box.appendChild(s);
    }
    el.querySelector('.obj-body').appendChild(box);
    setTimeout(() => box.remove(), 1400);
  }

  /* ------------------------------------------------------------------ board objects */
  function makeObj(type, data, x, y, s) { return { id: newId('o'), type, data, x: x || 0, y: y || 0, s: s || 1, ver: 1 }; }

  function bounds() { return { left: 96, right: W - 24, top: 76, bottom: H - 168 }; }

  // Finds the emptiest place for a new card: away from other cards and from writing, close to the middle
  function freeSpot(w, h, skipId) {
    const r = bounds();
    const busy = [];
    els.forEach((el, id) => { if (id !== skipId) { const b = el.querySelector('.obj-body').getBoundingClientRect(); busy.push({ x: b.left, y: b.top, w: b.width, h: b.height }); } });
    state.strokes.slice(-300).forEach((st) => busy.push(bb(st)));
    const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
    const maxX = Math.max(r.left, r.right - w), maxY = Math.max(r.top, r.bottom - h);
    let best = { x: clamp(cx - w / 2, r.left, maxX), y: clamp(cy - h / 2, r.top, maxY) }, bestScore = Infinity;
    for (let y = r.top; y <= maxY + 1; y += 32) {
      for (let x = r.left; x <= maxX + 1; x += 32) {
        let overlap = 0;
        busy.forEach((b) => {
          const ox = Math.min(x + w + 16, b.x + b.w) - Math.max(x - 16, b.x), oy = Math.min(y + h + 16, b.y + b.h) - Math.max(y - 16, b.y);
          if (ox > 0 && oy > 0) overlap += ox * oy;
        });
        const score = overlap * 4 + Math.hypot(x + w / 2 - cx, y + h / 2 - cy);
        if (score < bestScore) { bestScore = score; best = { x, y }; }
      }
    }
    return best;
  }
  function addObject(type, data, pos) {
    const r = bounds();
    pushHistory();
    const o = makeObj(type, data, (r.left + r.right) / 2, (r.top + r.bottom) / 2, 1);
    state.objects.push(o);
    renderObjects();
    // Fit: measure the card, scale it down if the screen is small, then place it
    const el = els.get(o.id), body = el.querySelector('.obj-body');
    const w = body.offsetWidth || 400, h = body.offsetHeight || 300;
    o.s = Math.min(1, (r.right - r.left) / (w + 20), (r.bottom - r.top) / (h + 20));
    if (pos && pos.x != null) {
      o.x = clamp(pos.x, r.left, Math.max(r.left, r.right - w * o.s));
      o.y = clamp(pos.y, r.top, Math.max(r.top, r.bottom - h * o.s));
    } else {
      const spot = freeSpot(w * o.s, h * o.s, o.id);
      o.x = spot.x; o.y = spot.y;
    }
    applyTransform(o, el);
    select(o.id);
    save();
    return o;
  }
  function updateObjData(id, data) {
    const o = getObj(id); if (!o) return;
    pushHistory();
    o.data = Object.assign({}, o.data, data);
    o.ver += 1;
    renderObjects(); save();
  }
  function removeObj(id) {
    if (!getObj(id)) return;
    pushHistory();
    state.objects = state.objects.filter((o) => o.id !== id);
    if (selectedId === id) selectedId = null;
    renderObjects(); save(); AU.pop();
  }

  function applyTransform(o, el) {
    el.style.transform = `translate(${o.x}px, ${o.y}px) scale(${o.s})`;
    const inv = `scale(${1 / o.s})`;
    const ctrl = el.querySelector('.obj-ctrl'), rs = el.querySelector('.obj-resize');
    if (ctrl) { ctrl.style.transform = inv; ctrl.style.transformOrigin = '0 100%'; }
    if (rs) rs.style.transform = inv;
  }

  function renderObjects() {
    const ids = new Set(state.objects.map((o) => o.id));
    for (const [id, el] of els) { if (!ids.has(id)) { el.remove(); els.delete(id); } }
    state.objects.forEach((o, i) => {
      let el = els.get(o.id);
      if (!el || el.dataset.ver !== String(o.ver)) {
        const nel = buildObj(o);
        if (el) el.replaceWith(nel); else layer.appendChild(nel);
        els.set(o.id, nel); el = nel;
      }
      applyTransform(o, el);
      el.style.zIndex = String(10 + i);
      el.classList.toggle('selected', o.id === selectedId);
    });
  }
  function select(id) {
    selectedId = id && getObj(id) ? id : null;
    els.forEach((el, k) => el.classList.toggle('selected', k === selectedId));
  }

  function speakTextOf(o) {
    const d = o.data || {};
    switch (o.type) {
      case 'text': return (d.lines || []).join(' ');
      case 'image': return d.subject;
      case 'word': return [d.word, d.sentence].filter(Boolean).join('. ');
      case 'sentences': return (d.sentences || []).join(' ');
      case 'story': return [d.title].concat(d.sentences || []).join('. ');
      case 'tr': return /english/i.test(d.from || '') ? d.original : d.translation;
      case 'check': return d.corrected;
      case 'ask': return d.answer;
      case 'spell': return d.word;
      default: return '';
    }
  }

  function buildObj(o) {
    const el = document.createElement('div');
    el.className = 'obj obj-' + o.type;
    el.dataset.id = o.id;
    el.dataset.ver = String(o.ver);
    const body = document.createElement('div');
    body.className = 'obj-body';
    el.appendChild(body);
    const builder = BUILDERS[o.type];
    if (builder) builder(body, o); else body.textContent = '?';

    const ctrl = document.createElement('div');
    ctrl.className = 'obj-ctrl';
    if (speakTextOf(o)) ctrl.appendChild(ctrlBtn('🔊', 'Read aloud', () => AU.speak(speakTextOf(o))));
    if (o.type === 'image' && o.data.subject) {
      ctrl.appendChild(ctrlBtn(o.data.source === 'ai' ? '🔁 Another' : '✨ AI picture', 'Make a new AI picture', () => aiPicture(o.data.subject, { replaceId: o.id })));
    }
    ctrl.appendChild(ctrlBtn('🗑️', 'Remove', () => removeObj(o.id), 'danger'));
    el.appendChild(ctrl);
    const rs = document.createElement('div');
    rs.className = 'obj-resize';
    rs.title = 'Drag to resize';
    el.appendChild(rs);
    return el;
  }
  function ctrlBtn(label, title, fn, extra) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ctrl-btn' + (extra ? ' ' + extra : '');
    b.textContent = label; b.title = title;
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  }
  function sayBtn(text) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'say-btn'; b.textContent = '🔊'; b.title = 'Read aloud';
    b.addEventListener('click', (e) => { e.stopPropagation(); AU.speak(text); });
    return b;
  }
  function head(icon, title, src) {
    return `<div class="card-head"><span>${icon}</span><span>${esc(title)}</span>${src ? `<span class="src">${esc(src)}</span>` : ''}</div>`;
  }
  function highlight(sentence, words) {
    let html = esc(sentence);
    (words || []).filter(Boolean).forEach((w) => {
      const re = new RegExp('\\b(' + esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b', 'gi');
      html = html.replace(re, '<span class="kw">$1</span>');
    });
    return html;
  }
  const normWord = (w) => String(w).toLowerCase().replace(/[^a-z0-9']/g, '');

  /* Card builders: each fills the card body from o.data */
  const BUILDERS = {
    text(body, o) {
      const d = o.data;
      const readWords = new Set(String(d.read || '').split(/\s+/).map(normWord));
      const t = document.createElement('div');
      t.className = 'neat-text';
      t.style.fontSize = (d.fs || 64) + 'px';
      t.style.color = d.color === 'ink' ? 'var(--ink)' : d.color;
      t.innerHTML = (d.lines || []).map((line) => '<div>' + line.split(/(\s+)/).map((w) => {
        if (/^\s+$/.test(w)) return w;
        return d.changed && d.read && !readWords.has(normWord(w)) ? `<span class="fixw">${esc(w)}</span>` : esc(w);
      }).join('') + '</div>').join('');
      body.appendChild(t);
      if (d.changed && d.read) {
        const n = document.createElement('div');
        n.className = 'neat-note';
        n.innerHTML = `✏️ You wrote: “${esc(d.read)}”${d.tip ? ' · ' + esc(d.tip) : ''}`;
        body.appendChild(n);
      }
    },

    image(body, o) {
      const d = o.data;
      body.className += ' card pic-card';
      body.innerHTML = head(d.source === 'ai' ? '✨' : '📚', d.source === 'ai' ? 'AI picture' : 'From our library') +
        `<div class="pic-frame ${d.source === 'ai' ? 'ai' : 'library'}"><img alt="${esc(d.subject)}" draggable="false"></div>` +
        `<div class="pic-caption"></div>`;
      body.querySelector('img').src = d.src;
      const cap = body.querySelector('.pic-caption');
      cap.textContent = d.subject;
      cap.prepend(sayBtn(d.subject));
    },

    word(body, o) {
      const d = o.data;
      body.className += ' card word-card';
      body.innerHTML = head('🔤', 'Word card') +
        `<div class="word-top"><div class="word-emoji"></div><div class="word-main">
          <div class="word-big"></div>${d.syllables ? `<div class="word-syl">${esc(d.syllables)}</div>` : ''}
          ${d.pos ? `<span class="word-pos">${esc(d.pos)}</span>` : ''}</div></div>` +
        (d.sentence ? `<div class="word-sentence"></div>` : '') +
        (d.turkish ? `<div class="word-tr"></div>` : '');
      body.querySelector('.word-big').textContent = d.word;
      const pic = body.querySelector('.word-emoji');
      if (d.pic) { const im = document.createElement('img'); im.src = d.pic; im.alt = d.word; im.draggable = false; pic.appendChild(im); }
      else {
        pic.textContent = d.emoji || '🔤';
        if (AI.ready) {
          pic.title = 'Tap to make an AI picture';
          pic.style.cursor = 'pointer';
          pic.addEventListener('click', async (e) => {
            e.stopPropagation();
            pic.innerHTML = '<span class="spinner"></span>';
            try {
              const r = await AI.call('draw', { subject: d.word }, 90000);
              updateObjData(o.id, { pic: `data:${r.mime};base64,${r.image}` }); AU.sparkle();
            } catch (err) { pic.textContent = d.emoji || '🔤'; aiError(err); }
          });
        }
      }
      if (d.sentence) {
        const s = body.querySelector('.word-sentence');
        s.appendChild(sayBtn(d.sentence));
        const sp = document.createElement('span'); sp.innerHTML = highlight(d.sentence, [d.word]); s.appendChild(sp);
      }
      if (d.turkish) {
        const tr = body.querySelector('.word-tr');
        const show = () => { tr.innerHTML = `🇹🇷 Türkçe: <b>${esc(d.turkish)}</b>`; };
        if (opts.turkish) show();
        else {
          tr.innerHTML = '<button type="button" class="reveal-tr">🇹🇷 Show Turkish</button>';
          tr.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); show(); });
        }
      }
    },

    sentences(body, o) {
      const d = o.data;
      body.className += ' card lines-card';
      body.innerHTML = head('💬', 'Example sentences') + (d.focus ? `<span class="focus-pill">🎯 ${esc(d.focus)}</span>` : '');
      (d.sentences || []).forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'line-row';
        row.innerHTML = `<span class="num">${i + 1}</span><span>${highlight(s, [d.focus])}</span>`;
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          body.querySelectorAll('.line-row').forEach((r) => r.classList.remove('speaking'));
          row.classList.add('speaking');
          AU.speak(s, { onend: () => row.classList.remove('speaking') });
        });
        body.appendChild(row);
      });
    },

    quiz(body, o) {
      const d = o.data, qs = d.questions || [];
      body.className += ' card quiz-card';
      let i = 0, score = 0, answered = false;
      const draw = () => {
        if (i >= qs.length) {
          body.innerHTML = head('❓', 'Quiz: ' + d.topic) +
            `<div class="quiz-end">🎉 ${score} / ${qs.length}</div><div class="card-foot"><button type="button" class="btn-primary again">🔁 Play again</button></div>`;
          body.querySelector('.again').addEventListener('click', (e) => { e.stopPropagation(); i = 0; score = 0; draw(); });
          AU.fanfare();
          return;
        }
        const q = qs[i]; answered = false;
        body.innerHTML = head('❓', 'Quiz: ' + d.topic) +
          `<div class="quiz-q"><span class="qe">${esc(q.emoji || '❓')}</span><span>${esc(q.q)}</span></div>
           <div class="quiz-opts"></div>
           <div class="card-foot"><span class="muted">⭐ ${score} · ${i + 1} of ${qs.length}</span>
             <span class="quiz-progress">${qs.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('')}</span>
             <button type="button" class="ctrl-btn show">👁 Answer</button><button type="button" class="btn-primary next hidden">Next ➜</button></div>`;
        const box = body.querySelector('.quiz-opts');
        const right = (opt) => normWord(opt) === normWord(q.answer);
        (q.options || []).forEach((opt) => {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'opt-btn'; b.textContent = opt;
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            if (answered) return;
            if (right(opt)) {
              answered = true; score += 1; b.classList.add('right'); AU.correct();
              body.querySelector('.next').classList.remove('hidden');
              body.querySelector('.muted').textContent = `⭐ ${score} · ${i + 1} of ${qs.length}`;
            } else { b.classList.add('wrong'); AU.softFail(); }
          });
          box.appendChild(b);
        });
        body.querySelector('.show').addEventListener('click', (e) => {
          e.stopPropagation(); answered = true;
          box.querySelectorAll('.opt-btn').forEach((b) => { if (right(b.textContent)) b.classList.add('right'); });
          body.querySelector('.next').classList.remove('hidden');
        });
        body.querySelector('.next').addEventListener('click', (e) => { e.stopPropagation(); i += 1; draw(); });
        speak(q.q);
      };
      draw();
    },

    story(body, o) {
      const d = o.data, lines = d.sentences || [];
      body.className += ' card lines-card';
      let shown = 1;
      const draw = () => {
        body.innerHTML = head('📖', 'Story') + `<div class="story-title"></div>` +
          lines.slice(0, shown).map((s, k) => `<div class="line-row" data-k="${k}"><span class="num">${k + 1}</span><span>${highlight(s, d.keywords)}</span></div>`).join('') +
          `<div class="card-foot"><span class="muted">${shown} / ${lines.length}</span>` +
          (shown < lines.length ? '<button type="button" class="btn-primary next">▶ Next line</button>' : '<button type="button" class="btn-primary all">🔁 Read it all</button>') + '</div>';
        body.querySelector('.story-title').textContent = d.title || 'A little story';
        body.querySelectorAll('.line-row').forEach((row) => row.addEventListener('click', (e) => { e.stopPropagation(); AU.speak(lines[Number(row.dataset.k)]); }));
        const nx = body.querySelector('.next');
        if (nx) nx.addEventListener('click', (e) => { e.stopPropagation(); shown += 1; draw(); AU.speak(lines[shown - 1]); });
        const all = body.querySelector('.all');
        if (all) all.addEventListener('click', (e) => { e.stopPropagation(); AU.speak([d.title].concat(lines).join('. ')); });
      };
      draw();
    },

    tr(body, o) {
      const d = o.data;
      const fromTr = /turk/i.test(d.from || '');
      body.className += ' card tr-card';
      body.innerHTML = head('🌍', 'Translate') +
        `<div class="tr-row"><span class="tr-flag">${fromTr ? '🇹🇷' : '🇬🇧'}</span><span class="a"></span></div>
         <div class="tr-arrow">⬇</div>
         <div class="tr-row"><span class="tr-flag">${fromTr ? '🇬🇧' : '🇹🇷'}</span><span class="b"></span></div>`;
      body.querySelector('.a').textContent = d.original;
      body.querySelector('.b').textContent = d.translation;
      const enRow = body.querySelectorAll('.tr-row')[fromTr ? 1 : 0];
      enRow.appendChild(sayBtn(fromTr ? d.translation : d.original));
    },

    check(body, o) {
      const d = o.data;
      body.className += ' card check-card';
      body.innerHTML = head(d.ok ? '✅' : '✏️', d.ok ? 'Perfect!' : 'Let\'s fix it') +
        (d.ok ? '' : '<div class="check-text before"></div>') + '<div class="check-text after"></div>' +
        (d.tip ? '<div class="check-tip"></div>' : '') +
        ((d.changes || []).length ? `<div class="check-changes">${d.changes.map((c) => `<span>${esc(c)}</span>`).join('')}</div>` : '');
      if (!d.ok) body.querySelector('.before').textContent = d.original;
      body.querySelector('.after').textContent = d.corrected;
      if (d.tip) body.querySelector('.check-tip').textContent = '💡 ' + d.tip;
    },

    ask(body, o) {
      const d = o.data;
      body.className += ' card ask-card';
      body.innerHTML = head('🦉', 'Answer') + '<div class="ask-q"></div><div class="ask-answer"><span class="ae"></span><span class="at"></span></div>';
      body.querySelector('.ask-q').textContent = '“' + d.question + '”';
      body.querySelector('.ae').textContent = d.emoji || '🦉';
      body.querySelector('.at').textContent = d.answer;
    },

    spell(body, o) {
      const word = String(o.data.word || '');
      body.className += ' card spell-card';
      body.innerHTML = head('🔡', 'Spell it') + '<div class="spell-letters"></div><div class="card-foot"><button type="button" class="btn-primary again">🔁 Again</button></div>';
      const box = body.querySelector('.spell-letters');
      const letters = [...word];
      letters.forEach((ch) => {
        const t = document.createElement('div');
        t.className = 'spell-letter' + (/[aeiou]/i.test(ch) ? ' vowel' : '');
        t.textContent = ch === ' ' ? '' : ch;
        if (ch === ' ') t.style.visibility = 'hidden';
        box.appendChild(t);
      });
      const play = () => {
        const tiles = [...box.children];
        tiles.forEach((t) => t.classList.remove('on'));
        tiles.forEach((t, k) => setTimeout(() => {
          if (!body.isConnected) return;
          t.classList.add('on'); AU.tick();
          if (letters[k] !== ' ' && opts.speak) AU.speak(letters[k].toUpperCase(), { rate: 0.8 });
        }, 300 + k * 800));
        setTimeout(() => { if (body.isConnected) { AU.correct(); speak(word); } }, 500 + letters.length * 800);
      };
      body.querySelector('.again').addEventListener('click', (e) => { e.stopPropagation(); play(); });
      play();
    },

    timer(body, o) {
      const total = Math.max(1, Number(o.data.secs) || 60);
      body.className += ' card timer-card';
      body.innerHTML = head('⏱️', 'Timer') + '<div class="timer-digits"></div><div class="timer-bar"><i></i></div>' +
        '<div class="card-foot"><button type="button" class="ctrl-btn reset">↺</button><button type="button" class="btn-primary pause">⏸ Pause</button></div>';
      let left = total, running = true, lastTick = Date.now(), lastSec = -1;
      const digits = body.querySelector('.timer-digits'), bar = body.querySelector('.timer-bar i'), pauseBtn = body.querySelector('.pause');
      const show = () => {
        const s = Math.ceil(left);
        digits.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        bar.style.width = (100 * left / total) + '%';
        body.classList.toggle('ending', left > 0 && left <= 10);
      };
      const iv = setInterval(() => {
        if (!body.isConnected) { clearInterval(iv); return; }
        const now = Date.now();
        if (running && left > 0) {
          left = Math.max(0, left - (now - lastTick) / 1000);
          const s = Math.ceil(left);
          if (s !== lastSec && s <= 10 && s > 0) AU.tick();
          lastSec = s;
          if (left === 0) { body.classList.add('done'); AU.chime(); speak('Time is up!'); pauseBtn.textContent = '▶ Start'; running = false; }
        }
        lastTick = now; show();
      }, 200);
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (left === 0) { left = total; body.classList.remove('done'); }
        running = !running; lastTick = Date.now();
        pauseBtn.textContent = running ? '⏸ Pause' : '▶ Start';
      });
      body.querySelector('.reset').addEventListener('click', (e) => {
        e.stopPropagation(); left = total; running = false; body.classList.remove('done');
        pauseBtn.textContent = '▶ Start'; show();
      });
      show();
    },

    pick(body, o) {
      const items = o.data.items || ['1', '2'];
      body.className += ' card pick-card';
      body.innerHTML = head('🎯', o.data.label || 'Pick') + '<div class="pick-big"></div><div class="card-foot"><button type="button" class="btn-primary again">🎯 Again</button></div>';
      const big = body.querySelector('.pick-big');
      const spin = () => {
        body.classList.remove('landed');
        const target = Math.floor(Math.random() * items.length), steps = 16 + Math.floor(Math.random() * items.length);
        let k = 0, idx = Math.floor(Math.random() * items.length);
        const step = () => {
          if (!body.isConnected) return;
          idx = k === steps ? target : (idx + 1) % items.length;
          big.textContent = items[idx]; AU.tick();
          if (k++ < steps) setTimeout(step, 50 + k * k * 1.2);
          else { body.classList.add('landed'); AU.fanfare(); speak(items[target]); }
        };
        step();
      };
      body.querySelector('.again').addEventListener('click', (e) => { e.stopPropagation(); spin(); });
      setTimeout(spin, 80);
    },

    dice(body) {
      const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      body.className += ' card pick-card';
      body.innerHTML = head('🎲', 'Dice') + '<div class="dice-face"></div><div class="pick-big"></div><div class="card-foot"><button type="button" class="btn-primary again">🎲 Roll</button></div>';
      const face = body.querySelector('.dice-face'), num = body.querySelector('.pick-big');
      const roll = () => {
        body.classList.remove('landed'); num.textContent = '';
        let k = 0; const n = 14, final = Math.floor(Math.random() * 6);
        const step = () => {
          if (!body.isConnected) return;
          const v = k === n ? final : Math.floor(Math.random() * 6);
          face.textContent = faces[v]; AU.tick();
          if (k++ < n) setTimeout(step, 45 + k * k * 1.5);
          else { num.textContent = String(final + 1); body.classList.add('landed'); AU.fanfare(); speak(String(final + 1)); }
        };
        step();
      };
      body.querySelector('.again').addEventListener('click', (e) => { e.stopPropagation(); roll(); });
      setTimeout(roll, 80);
    },

    help(body) {
      body.className += ' card help-card';
      body.innerHTML = head('💡', 'Smart Board commands', 'tap one to try it') + '<div class="help-grid"></div>';
      const grid = body.querySelector('.help-grid');
      root.SMART_COMMANDS.forEach((c) => {
        const it = document.createElement('div');
        it.className = 'help-item';
        it.innerHTML = `<span class="hi">${c.icon}</span><div><b>/${esc(c.name)}${c.arg ? ' ' + esc(c.arg) : ''}</b>${c.ai === true ? ' <span class="sug-ai">AI</span>' : ''}<div>${esc(c.desc)}</div></div>`;
        it.addEventListener('click', (e) => { e.stopPropagation(); fillCommand(c, true); });
        grid.appendChild(it);
      });
    }
  };

  /* Drag + resize objects */
  let drag = null;
  layer.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.obj');
    if (!el) return;
    const o = getObj(el.dataset.id);
    if (!o) return;
    select(o.id);
    const isResize = e.target.classList.contains('obj-resize');
    if (!isResize && e.target.closest('button, input, a, .line-row, .opt-btn, .help-item, .word-emoji')) return;
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const body = el.querySelector('.obj-body');
    drag = { o, el, isResize, pid: e.pointerId, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y, os: o.s, nat: body.offsetWidth || 300, moved: false };
  });
  layer.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.pid) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      pushHistory(); drag.moved = true; drag.el.classList.add('dragging');
      drag.o = getObj(drag.o.id) || drag.o;
    }
    if (drag.isResize) drag.o.s = clamp((drag.os * drag.nat + dx) / drag.nat, 0.25, 4);
    else { drag.o.x = drag.ox + dx; drag.o.y = drag.oy + dy; }
    applyTransform(drag.o, drag.el);
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.pid) return;
    drag.el.classList.remove('dragging');
    if (drag.moved) save();
    drag = null;
  };
  layer.addEventListener('pointerup', endDrag);
  layer.addEventListener('pointercancel', endDrag);

  /* ------------------------------------------------------------------ AI helpers */
  function aiError(err) {
    const code = err && err.code;
    AU.softFail();
    if (code === 'nopin' || code === 'badpin' || code === 'bad_pin') { toast(code === 'nopin' ? 'Type your AI PIN in ⚙️ first.' : 'Wrong PIN. Check it in ⚙️.'); openSettings(); return; }
    if (code === 'setup' || code === 'not_set_up') { toast('The AI is not switched on yet. See ⚙️ for the setup.'); openSettings(); return; }
    toast((err && err.message) || 'The AI could not answer.', 5000);
  }

  function loadingCard(text, pos) {
    const r = bounds();
    const el = document.createElement('div');
    el.className = 'obj';
    el.style.zIndex = '999';
    el.innerHTML = `<div class="obj-body card loading-card"><div class="spinner"></div><div class="lc-text"></div></div>`;
    el.querySelector('.lc-text').textContent = text;
    layer.appendChild(el);
    const w = 380, h = el.firstChild.offsetHeight || 150;
    const spot = pos && pos.x != null ? pos : freeSpot(w, h);
    const x = clamp(spot.x, r.left, r.right - w), y = clamp(spot.y, r.top, r.bottom - h);
    el.style.transform = `translate(${x}px, ${y}px)`;
    return { el, remove: () => el.remove() };
  }

  function needAI() {
    if (AI.ready) return true;
    toast(AI.hasPin() ? 'The AI is not ready. Check ⚙️.' : 'This needs the AI. Type your PIN in ⚙️ to switch it on.');
    AU.softFail(); openSettings();
    return false;
  }

  async function aiCard(task, payload, label, type, toData, speakFn) {
    if (!needAI()) return;
    const ld = loadingCard(label);
    try {
      const d = await AI.call(task, payload);
      const o = addObject(type, toData(d));
      AU.sparkle();
      if (speakFn) speak(speakFn(d, o));
    } catch (err) { aiError(err); } finally { ld.remove(); }
  }

  async function aiPicture(subject, o) {
    o = o || {};
    if (!needAI()) return;
    const target = o.replaceId ? getObj(o.replaceId) : null;
    const ld = loadingCard(`🎨 Drawing ${subject}…`, target ? { x: target.x, y: target.y } : o.pos);
    try {
      const d = await AI.call('draw', { subject, sketch: o.sketch }, 90000);
      const src = `data:${d.mime || 'image/png'};base64,${d.image}`;
      if (target && getObj(target.id)) updateObjData(target.id, { src, source: 'ai' });
      else addObject('image', { src, subject, source: 'ai' }, o.pos);
      AU.sparkle(); speak(subject);
    } catch (err) { aiError(err); } finally { ld.remove(); }
  }

  /* Pictures we already have: exact names only ("bird" -> o_bird.webp) */
  function findArt(q) {
    const idx = root.SMART_ART_INDEX || {};
    let s = String(q || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/^(a|an|the|some|my|two|three|four|five)\s+/, '');
    const tries = [s];
    if (/ies$/.test(s)) tries.push(s.replace(/ies$/, 'y'));
    if (/(ches|shes|xes|sses)$/.test(s)) tries.push(s.replace(/es$/, ''));
    if (/s$/.test(s)) tries.push(s.replace(/s$/, ''));
    for (const t of tries) { const hit = idx[t]; if (hit && hit.length) return hit[0]; }
    return '';
  }

  /* ------------------------------------------------------------------ commands */
  const HANDLERS = {
    draw(arg) {
      const subject = arg.trim();
      if (!subject) { toast('What should I draw? Try /draw bird'); return; }
      const lib = findArt(subject);
      if (lib) { addObject('image', { src: '../' + lib, subject, source: 'library' }); AU.pop(); speak(subject); return; }
      if (!AI.ready) { toast(`No “${subject}” picture in our library yet. Switch on the AI in ⚙️ to draw anything.`, 5000); AU.softFail(); return; }
      aiPicture(subject);
    },
    word(arg) {
      const w = arg.trim();
      if (!w) { toast('Which word? Try /word apple'); return; }
      if (!AI.ready) {
        const lib = findArt(w);
        addObject('word', { word: w, pic: lib ? '../' + lib : '', emoji: '🔤' }); speak(w);
        toast('Switch on the AI in ⚙️ for the full word card.');
        return;
      }
      aiCard('word', { text: w }, `🔤 Making a card for “${w}”…`, 'word', (d) => {
        const lib = findArt(d.word || w);
        return { word: d.word || w, syllables: d.syllables, pos: d.partOfSpeech, sentence: d.sentence, turkish: d.turkish, emoji: d.emoji, pic: lib ? '../' + lib : '' };
      }, (d) => `${d.word}. ${d.sentence}`);
    },
    sentences(arg) {
      const t = arg.trim();
      if (!t) { toast('About what? Try /sentences can swim'); return; }
      aiCard('sentences', { text: t, n: 3 }, '💬 Writing sentences…', 'sentences', (d) => ({ focus: d.focus, sentences: d.sentences }), (d) => (d.sentences || [])[0]);
    },
    quiz(arg) {
      const m = arg.trim().match(/^(.*?)(?:\s+(\d))?$/);
      const topic = (m && m[1] || '').trim(), n = m && m[2] ? Number(m[2]) : 5;
      if (!topic) { toast('About what? Try /quiz animals'); return; }
      aiCard('quiz', { text: topic, n }, '❓ Making a quiz…', 'quiz', (d) => ({ topic: d.topic || topic, questions: d.questions || [] }));
    },
    story(arg) {
      const t = arg.trim() || 'a friendly monster at school';
      aiCard('story', { text: t }, '📖 Writing a story…', 'story', (d) => ({ title: d.title, sentences: d.sentences, keywords: d.keywords }), (d) => `${d.title}. ${(d.sentences || [])[0] || ''}`);
    },
    tr(arg) {
      const t = arg.trim();
      if (!t) { toast('What should I translate? Try /tr kalem'); return; }
      aiCard('tr', { text: t }, '🌍 Translating…', 'tr', (d) => ({ original: t, from: d.from, to: d.to, translation: d.translation }),
        (d) => (/turk/i.test(d.from || '') ? d.translation : t));
    },
    check(arg) {
      const t = arg.trim();
      if (!t) { toast('Type a sentence to check, e.g. /check i can swiming'); return; }
      aiCard('check', { text: t }, '✅ Checking…', 'check', (d) => ({ original: t, ok: !!d.ok, corrected: d.corrected, tip: d.tip, changes: d.changes || [] }), (d) => d.corrected);
    },
    ask(arg) {
      const t = arg.trim();
      if (!t) { toast('Type a question, e.g. /ask why do cats purr'); return; }
      aiCard('ask', { text: t }, '🦉 Thinking…', 'ask', (d) => ({ question: t, answer: d.answer, emoji: d.emoji }), (d) => d.answer);
    },
    neat() { runNeat(true); },
    spell(arg) {
      const w = arg.trim().slice(0, 14);
      if (!w) { toast('Which word? Try /spell school'); return; }
      addObject('spell', { word: w });
    },
    say(arg) {
      const t = arg.trim();
      if (!t) { toast('What should I say? Try /say Good morning!'); return; }
      AU.speak(t); toast('🔊 ' + t);
    },
    timer(arg) {
      const a = arg.trim().toLowerCase();
      let secs = 60;
      const mmss = a.match(/^(\d+):(\d{1,2})$/), sec = a.match(/^(\d+)\s*s/), min = a.match(/^(\d+(?:\.\d+)?)/);
      if (mmss) secs = Number(mmss[1]) * 60 + Number(mmss[2]);
      else if (sec) secs = Number(sec[1]);
      else if (min) secs = Math.round(Number(min[1]) * 60);
      secs = clamp(secs, 5, 3600);
      addObject('timer', { secs }); AU.pop();
    },
    pick(arg) {
      const a = arg.trim();
      let items, label = 'Pick';
      if (a.includes(',')) items = a.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 40);
      else { const n = clamp(Number(a) || 4, 2, 40); items = Array.from({ length: n }, (_, k) => 'Team ' + (k + 1)); label = 'Which team?'; }
      if (items.length < 2) { toast('Give me at least two, e.g. /pick red, blue'); return; }
      addObject('pick', { items, label });
    },
    dice() { addObject('dice', {}); },
    bg(arg) {
      const b = arg.trim().toLowerCase();
      const map = { dark: 'dark', black: 'dark', chalk: 'chalk', green: 'chalk', white: 'white', lines: 'lines', line: 'lines', grid: 'grid' };
      if (!map[b]) { toast('Try /bg dark, chalk, white, lines or grid'); return; }
      setBg(map[b]);
    },
    clear() { clearBoard(); },
    help() { addObject('help', {}); }
  };

  function findCmd(name) {
    name = String(name || '').toLowerCase();
    return root.SMART_COMMANDS.find((c) => c.name === name || c.aliases.includes(name));
  }

  function runCommand(raw) {
    const text = String(raw || '').trim();
    if (!text) return;
    if (!text.startsWith('/')) {
      // Plain words: written neatly on the board
      addObject('text', { lines: text.split(/\n/).slice(0, 6), color, fs: 64, read: text, changed: false, tip: '' });
      AU.pop(); speak(text);
      return;
    }
    const m = text.slice(1).match(/^(\S+)\s*([\s\S]*)$/);
    if (!m) { addObject('help', {}); return; }
    const c = findCmd(m[1]);
    if (!c) { toast(`I don't know “/${m[1]}”. Type /help to see the commands.`); AU.softFail(); return; }
    HANDLERS[c.name](m[2] || '');
  }

  /* Suggestions while typing "/" */
  let sugIndex = 0, sugList = [];
  function openSuggest(list) {
    sugList = list; sugIndex = 0;
    if (!list.length) { closeSuggest(); return; }
    suggest.innerHTML = list.map((c, k) =>
      `<div class="sug${k === 0 ? ' active' : ''}" data-k="${k}" role="option"><span class="sug-icon">${c.icon}</span>` +
      `<span class="sug-name">/${esc(c.name)}${c.ai === true ? '<span class="sug-ai">AI</span>' : ''}</span>` +
      `<span class="sug-desc">${esc(c.desc)}${c.arg ? ` <i>e.g. /${esc(c.name)} ${esc(c.arg)}</i>` : ''}</span></div>`).join('');
    suggest.classList.remove('hidden');
  }
  function closeSuggest() { suggest.classList.add('hidden'); sugList = []; }
  function fillCommand(c, focus) {
    closeSuggest();
    if (!c.arg && c.name !== 'say') { cmdInput.value = ''; HANDLERS[c.name](''); return; }
    cmdInput.value = '/' + c.name + ' ';
    if (focus) cmdInput.focus();
  }
  suggest.addEventListener('pointerdown', (e) => {
    const row = e.target.closest('.sug'); if (!row) return;
    e.preventDefault();
    fillCommand(sugList[Number(row.dataset.k)], true);
  });
  cmdInput.addEventListener('input', () => {
    const v = cmdInput.value;
    if (/^\/\S*$/.test(v)) {
      const q = v.slice(1).toLowerCase();
      openSuggest(root.SMART_COMMANDS.filter((c) => !q || c.name.startsWith(q) || c.aliases.some((a) => a.startsWith(q))));
    } else closeSuggest();
  });
  cmdInput.addEventListener('keydown', (e) => {
    if (suggest.classList.contains('hidden')) {
      if (e.key === 'Escape') cmdInput.blur();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sugIndex = (sugIndex + (e.key === 'ArrowDown' ? 1 : -1) + sugList.length) % sugList.length;
      suggest.querySelectorAll('.sug').forEach((r, k) => r.classList.toggle('active', k === sugIndex));
      const act = suggest.querySelector('.sug.active'); if (act) act.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Tab' || (e.key === 'Enter' && sugList[sugIndex] && cmdInput.value.slice(1).toLowerCase() !== sugList[sugIndex].name)) {
      e.preventDefault(); fillCommand(sugList[sugIndex], true);
    } else if (e.key === 'Escape') closeSuggest();
  });
  $('#cmdForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = cmdInput.value;
    cmdInput.value = ''; closeSuggest();
    runCommand(v);
  });

  function buildChips() {
    const box = $('#quickChips');
    root.SMART_QUICK.forEach((name) => {
      const c = findCmd(name); if (!c) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (c.ai === true ? ' needs-ai' : '');
      b.textContent = `${c.icon} ${c.label}`;
      b.title = c.desc;
      b.addEventListener('click', () => fillCommand(c, true));
      box.appendChild(b);
    });
  }

  /* ------------------------------------------------------------------ toolbar, settings, keys */
  function buildSwatches() {
    const box = $('#swatches');
    const pal = root.SMART_INK[isLight() ? 'light' : 'dark'];
    if (!pal.includes(color)) color = 'ink';
    box.innerHTML = '';
    pal.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch' + (c === color ? ' active' : '');
      b.style.background = resolveColor(c);
      b.title = c === 'ink' ? 'Ink' : c;
      b.addEventListener('click', () => { color = c; if (tool === 'eraser') setTool('pen'); buildSwatches(); });
      box.appendChild(b);
    });
  }
  function setTool(t) {
    tool = t;
    document.querySelectorAll('.tool-btn[data-tool]').forEach((b) => b.classList.toggle('active', b.dataset.tool === t));
    board.classList.toggle('tool-eraser', t === 'eraser');
    lctx.clearRect(0, 0, W, H);
  }
  document.querySelectorAll('.tool-btn[data-tool]').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
  document.querySelectorAll('.size-btn').forEach((b) => b.addEventListener('click', () => {
    size = Number(b.dataset.size);
    document.querySelectorAll('.size-btn').forEach((x) => x.classList.toggle('active', x === b));
  }));
  $('#btnUndo').addEventListener('click', undo);
  $('#btnRedo').addEventListener('click', redo);
  $('#btnClear').addEventListener('click', clearBoard);

  function clearBoard() {
    if (!state.strokes.length && !state.objects.length) return;
    pushHistory();
    state = { strokes: [], objects: [] };
    pending.clear(); selectedId = null;
    redrawInk(); renderObjects(); updateFab(); save();
    toast('Board cleared. ↶ Undo brings it back.');
    AU.pop();
  }

  function setBg(name) {
    opts.bg = name;
    document.body.className = document.body.className.replace(/\bbg-\w+\b/g, '').trim();
    document.body.classList.add('bg-' + name);
    document.body.classList.toggle('light', isLight());
    document.querySelectorAll('.bg-choice').forEach((b) => b.classList.toggle('active', b.dataset.bg === name));
    buildSwatches(); redrawInk(); lsSet(OPT_KEY, opts);
  }
  document.querySelectorAll('.bg-choice').forEach((b) => b.addEventListener('click', () => setBg(b.dataset.bg)));

  function openSettings() { $('#settings').classList.remove('hidden'); updateAIUI(); }
  function closeSettings() { $('#settings').classList.add('hidden'); }
  $('#btnSettings').addEventListener('click', () => ($('#settings').classList.contains('hidden') ? openSettings() : closeSettings()));
  $('#btnCloseSettings').addEventListener('click', closeSettings);
  $('#aiChip').addEventListener('click', openSettings);
  [['#optAutoNeat', 'autoNeat'], ['#optSpeak', 'speak'], ['#optTurkish', 'turkish']].forEach(([sel, key]) => {
    const el = $(sel);
    el.checked = !!opts[key];
    el.addEventListener('change', () => { opts[key] = el.checked; lsSet(OPT_KEY, opts); if (key === 'autoNeat') scheduleNeat(); });
  });
  $('#btnConnect').addEventListener('click', async () => {
    const p = $('#pinInput').value.trim();
    if (p.length < 4) { toast('Type your PIN (4 or more digits).'); return; }
    AI.setPin(p);
    await AI.status();
    if (AI.ready) { $('#pinInput').value = ''; toast('✅ The AI is ready!'); AU.correct(); }
  });
  $('#pinInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#btnConnect').click(); } });

  function updateAIUI() {
    const chip = $('#aiChip'), txt = $('#aiChipText'), st = $('#aiStatusText');
    chip.dataset.state = AI.state;
    const left = AI.left;
    const labels = { off: 'AI off', checking: 'AI…', ready: 'AI ready', offline: 'Offline', setup: 'AI setup', badpin: 'Wrong PIN' };
    txt.textContent = labels[AI.state] || 'AI off';
    if (AI.state === 'ready' && left) txt.textContent = `AI ready · 🎨 ${left.image}`;
    st.className = 'set-status';
    if (AI.state === 'ready') {
      st.classList.add('ok');
      st.textContent = left ? `✅ The AI is ready. Left today: 🎨 ${left.image} pictures and ${left.text} other requests.` : '✅ The AI is ready.';
    } else if (AI.state === 'checking') st.textContent = 'Checking…';
    else if (AI.state === 'badpin') { st.classList.add('warn'); st.textContent = '❌ Wrong PIN. Try again.'; }
    else if (AI.state === 'offline') { st.classList.add('warn'); st.textContent = '📴 No internet. The pen and library pictures still work.'; }
    else if (AI.state === 'setup') { st.classList.add('warn'); st.textContent = '⚠️ The AI is not switched on yet' + (AI.missing && AI.missing.length ? ` (missing: ${AI.missing.join(', ')})` : '') + '. See the setup guide below.'; }
    else st.textContent = 'The AI is off. The pen, library pictures, spell, timer and picker still work. Type your PIN to switch it on.';
    updateFab();
    if (AI.ready) scheduleNeat();
  }
  AI.onChange = updateAIUI;

  $('#btnMute').addEventListener('click', () => {
    AU.muted = !AU.muted; opts.muted = AU.muted; lsSet(OPT_KEY, opts);
    $('#btnMute').textContent = AU.muted ? '🔕' : '🔔';
    if (AU.muted) AU.stopSpeaking();
  });
  $('#btnFull').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  });

  root.addEventListener('keydown', (e) => {
    const typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
    if ((e.ctrlKey || e.metaKey) && !typing && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if ((e.ctrlKey || e.metaKey) && !typing && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
    if (typing) return;
    if (e.key === '/') { e.preventDefault(); cmdInput.focus(); cmdInput.value = '/'; cmdInput.dispatchEvent(new Event('input')); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) { e.preventDefault(); removeObj(selectedId); return; }
    if (e.key === 'Escape') { select(null); closeSuggest(); closeSettings(); }
  });
  root.addEventListener('resize', resize);
  root.addEventListener('online', () => { if (AI.hasPin()) AI.status(); });
  root.addEventListener('offline', () => AI.set('offline'));

  /* ------------------------------------------------------------------ start */
  AU.muted = !!opts.muted;
  $('#btnMute').textContent = AU.muted ? '🔕' : '🔔';
  loadSaved();
  setBg(opts.bg);
  buildChips();
  resize();
  renderObjects();
  updateUndo();
  updateAIUI();
  if (AI.hasPin()) AI.status();

  // For tests and the teacher's console
  root.SmartBoard = { runCommand, state: () => state, undo, redo, setBg };
})(window);
