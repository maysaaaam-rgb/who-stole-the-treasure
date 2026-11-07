/* Smart Board pages and saved boards.
   - Several pages per board (◀ Page 2 / 3 ▶ ＋ in the top bar), each with its own undo.
   - Boards saved by class and date in this browser (IndexedDB, so pictures fit), reopened later.
   - A page saved as a picture, or all pages as a PDF (through the browser's print window). */
(function (root) {
  'use strict';
  const SB = root.SB, L = root.SmartLessons;
  if (!SB) return;
  const { $, esc, toast, AU } = SB;
  const KEY = 'smartboard.board.v2', OLD = 'smartboard.board.v1';
  const LIVE = new Set(['challenge']); // game cards are not kept when the board is reopened
  let pages = [], index = 0, savedId = null, savedTitle = '', savedClass = '';
  const pageHist = new Map();
  const newId = (p) => p + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  const isoDay = (t) => { const d = t ? new Date(t) : new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const niceDay = (iso) => { const d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  const cleanObjs = (a) => (a || []).filter((o) => o && o.id && o.type && !LIVE.has(o.type));
  const copyPage = (p) => ({ id: p.id, strokes: (p.strokes || []).filter((s) => s && Array.isArray(s.pts)), objects: cleanObjs(p.objects).map((o) => Object.assign({}, o)) });
  const isEmpty = () => pages.every((p) => !p.strokes.length && !p.objects.length);

  /* ------------------------------------------------------------ working board (autosaved) */
  SB.loadBoard = function () {
    const d = SB.lsGet(KEY, null);
    if (d && Array.isArray(d.pages) && d.pages.length) {
      pages = d.pages.map((p) => copyPage(Object.assign({ id: p.id || newId('p') }, p)));
      index = Math.min(Math.max(0, d.index || 0), pages.length - 1);
      savedId = d.savedId || null; savedTitle = d.savedTitle || ''; savedClass = d.savedClass || '';
    } else {
      const old = SB.lsGet(OLD, null);
      pages = [copyPage({ id: newId('p'), strokes: old && old.strokes, objects: old && old.objects })];
      index = 0;
    }
    SB.state = { strokes: pages[index].strokes.slice(), objects: pages[index].objects.map((o) => Object.assign({}, o)) };
    paintStrip();
  };
  function sync() { if (pages[index]) pages[index] = { id: pages[index].id, strokes: SB.state.strokes, objects: cleanObjs(SB.state.objects) }; }
  SB.saveBoard = function () {
    sync();
    const data = { v: 2, index, pages, savedId, savedTitle, savedClass };
    if (!SB.lsSet(KEY, data)) {
      // Too big for quick saving: keep everything except AI pictures (saved boards keep them)
      SB.lsSet(KEY, Object.assign({}, data, { pages: pages.map((p) => Object.assign({}, p, { objects: p.objects.filter((o) => !(o.data && /^data:/.test(o.data.src || o.data.pic || ''))) })) }));
    }
  };

  function show(i, keepCurrent) {
    if (SB.endRace) SB.endRace(true);
    if (keepCurrent) { sync(); pageHist.set(pages[index].id, { undo: SB.hist.undo.slice(), redo: SB.hist.redo.slice() }); }
    index = Math.min(Math.max(0, i), pages.length - 1);
    const p = pages[index];
    SB.state = { strokes: p.strokes.slice(), objects: p.objects.map((o) => Object.assign({}, o)) };
    const h = pageHist.get(p.id) || { undo: [], redo: [] };
    SB.hist.undo.length = 0; h.undo.forEach((x) => SB.hist.undo.push(x));
    SB.hist.redo.length = 0; h.redo.forEach((x) => SB.hist.redo.push(x));
    SB.pending.clear(); SB.select(null);
    SB.redrawInk(); SB.renderObjects(); SB.updateUndo(); SB.updateFab();
    SB.saveBoard(); paintStrip();
  }
  function goPage(i) { if (i === index || i < 0 || i >= pages.length) return; show(i, true); AU.pop(); }
  function addPage() {
    sync();
    pages.splice(index + 1, 0, { id: newId('p'), strokes: [], objects: [] });
    show(index + 1, true); AU.pop();
    toast(`📄 New page ${index + 1}`);
  }
  let delArmed = 0;
  function deletePage() {
    if (pages.length === 1) { SB.runCommand('/clear'); return; }
    if (Date.now() - delArmed > 3000) { delArmed = Date.now(); toast(`Tap 🗑 again to delete page ${index + 1}.`); return; }
    delArmed = 0;
    pageHist.delete(pages[index].id);
    pages.splice(index, 1);
    show(Math.min(index, pages.length - 1), false);
    toast('Page deleted.'); AU.pop();
  }
  function paintStrip() {
    const lab = $('#pgLabel'); if (!lab) return;
    lab.textContent = `Page ${index + 1} / ${pages.length}`;
    $('#pgPrev').disabled = index === 0;
    $('#pgNext').disabled = index >= pages.length - 1;
  }

  /* ------------------------------------------------------------ saved boards (IndexedDB) */
  function db() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) { reject(new Error('This browser cannot save boards.')); return; }
      const r = root.indexedDB.open('smartboard', 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('boards')) r.result.createObjectStore('boards', { keyPath: 'id' }); };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error || new Error('Could not open the saved boards.'));
    });
  }
  async function run(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const t = d.transaction('boards', mode), req = fn(t.objectStore('boards'));
      t.oncomplete = () => resolve(req && 'result' in req ? req.result : undefined);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error || new Error('Saving was stopped (the browser may be full).'));
    });
  }
  const listBoards = async () => ((await run('readonly', (s) => s.getAll())) || []).sort((a, b) => b.savedAt - a.savedAt);
  const getBoard = (id) => run('readonly', (s) => s.get(id));
  const putBoard = (rec) => run('readwrite', (s) => s.put(rec));
  const delBoard = (id) => run('readwrite', (s) => s.delete(id));

  function classList() { return L ? L.classes() : [{ id: 'class', name: 'My class' }]; }
  function className(id) { const c = classList().find((k) => k.id === id); return c ? c.name : (id || 'No class'); }

  async function saveRecord(opts) {
    sync();
    const classId = opts.classId || savedClass || (L ? L.activeClassId() : '');
    const rec = {
      id: opts.asNew || !savedId ? newId('b') : savedId,
      classId, className: className(classId),
      title: (opts.title || savedTitle || 'Board').slice(0, 80),
      date: isoDay(), savedAt: Date.now(),
      pages: JSON.parse(JSON.stringify(pages)),
      thumb: await thumbOf(pages[0])
    };
    await putBoard(rec);
    savedId = rec.id; savedTitle = rec.title; savedClass = classId;
    SB.saveBoard();
    return rec;
  }
  // Before another board opens, the one on the screen is kept safe
  async function keepCurrent() {
    sync();
    if (isEmpty()) return;
    try {
      if (savedId) await saveRecord({});
      else await saveRecord({ title: 'Unsaved board ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), asNew: true });
    } catch (e) { /* the working board is still in quick-save */ }
  }
  async function openRecord(id) {
    const rec = await getBoard(id);
    if (!rec) { toast('That board was not found.'); return; }
    await keepCurrent();
    pages = (rec.pages || []).map(copyPage);
    if (!pages.length) pages = [{ id: newId('p'), strokes: [], objects: [] }];
    savedId = rec.id; savedTitle = rec.title; savedClass = rec.classId;
    pageHist.clear();
    show(0, false);
    $('#boardsPanel').classList.add('hidden');
    toast(`📂 ${rec.title} · ${rec.className} · ${niceDay(rec.date)}`);
    AU.pop();
  }
  async function newBoard() {
    await keepCurrent();
    pages = [{ id: newId('p'), strokes: [], objects: [] }];
    savedId = null; savedTitle = ''; savedClass = '';
    pageHist.clear();
    show(0, false);
    $('#boardsPanel').classList.add('hidden');
    toast('🆕 New board. The old one is in 📂.');
  }

  /* ------------------------------------------------------------ pictures of the board */
  function loadImg(src) {
    return new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const im = new Image();
      const done = (ok) => { clearTimeout(t); resolve(ok ? im : null); };
      const t = setTimeout(() => done(false), 6000);
      im.onload = () => done(true); im.onerror = () => done(false);
      im.src = src;
    });
  }
  function rr(x, X, Y, w, h, r) {
    x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
    x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
  }
  function wrap(x, text, maxW) {
    const out = [];
    String(text || '').split('\n').forEach((para) => {
      let line = '';
      para.split(/\s+/).forEach((w) => {
        const t = line ? line + ' ' + w : w;
        if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
      });
      out.push(line);
    });
    return out;
  }
  function paintBg(x, W, H) {
    const bg = SB.opts.bg;
    if (bg === 'dark') {
      const g = x.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, Math.max(W, H) * 0.8);
      g.addColorStop(0, '#0d1527'); g.addColorStop(1, '#060911');
      x.fillStyle = g; x.fillRect(0, 0, W, H); return;
    }
    x.fillStyle = bg === 'chalk' ? '#143d2e' : bg === 'white' ? '#fbfbf7' : bg === 'grid' ? '#fbfbf7' : '#fdfdf8';
    x.fillRect(0, 0, W, H);
    if (bg === 'grid') {
      x.strokeStyle = 'rgba(37,99,235,0.13)'; x.lineWidth = 1;
      for (let i = 0; i < W; i += 48) { x.beginPath(); x.moveTo(i + 0.5, 0); x.lineTo(i + 0.5, H); x.stroke(); }
      for (let j = 0; j < H; j += 48) { x.beginPath(); x.moveTo(0, j + 0.5); x.lineTo(W, j + 0.5); x.stroke(); }
    }
    if (bg === 'lines') {
      for (let y0 = 0; y0 < H; y0 += 180) {
        [[60, 'rgba(37,99,235,0.32)', 2], [89.5, 'rgba(37,99,235,0.16)', 1], [120.5, 'rgba(220,38,38,0.55)', 3], [149.5, 'rgba(37,99,235,0.22)', 1]].forEach(([dy, c, w]) => {
          x.strokeStyle = c; x.lineWidth = w; x.beginPath(); x.moveTo(0, y0 + dy); x.lineTo(W, y0 + dy); x.stroke();
        });
      }
    }
  }
  const TITLES = { word: '🔤 WORD CARD', sentences: '💬 EXAMPLE SENTENCES', quiz: '❓ QUIZ', story: '📖 STORY', tr: '🌍 TRANSLATE', check: '✅ CHECK', ask: '🦉 ANSWER', spell: '🔡 SPELL IT', timer: '⏱️ TIMER', pick: '🎯 PICK', dice: '🎲 DICE', help: '💡 COMMANDS', words: '📚 LESSON WORDS' };
  function cardLines(o) {
    const d = o.data || {};
    switch (o.type) {
      case 'word': return [d.word, d.syllables, d.sentence, d.turkish ? 'Türkçe: ' + d.turkish : ''];
      case 'sentences': return (d.sentences || []).map((s, i) => `${i + 1}. ${s}`);
      case 'quiz': return [d.topic].concat((d.questions || []).map((q, i) => `${i + 1}. ${q.q}  (${q.answer})`));
      case 'story': return [d.title].concat(d.sentences || []);
      case 'tr': return [d.original, '→ ' + d.translation];
      case 'check': return [d.corrected, d.tip ? '💡 ' + d.tip : ''];
      case 'ask': return ['“' + d.question + '”', d.answer];
      case 'spell': return [[...String(d.word || '')].join(' ')];
      case 'pick': return [(d.items || []).join(', ')];
      case 'words': return [(d.words || []).join(' · ')];
      default: return [];
    }
  }
  async function paintObj(x, o) {
    const d = o.data || {};
    x.save();
    x.translate(o.x, o.y); x.scale(o.s || 1, o.s || 1);
    if (o.type === 'text') {
      const fs = d.fs || 64;
      x.font = `700 ${fs}px Andika, "Baloo 2", sans-serif`;
      x.fillStyle = SB.resolveColor(d.color || 'ink'); x.textBaseline = 'alphabetic';
      (d.lines || []).forEach((ln, i) => x.fillText(ln, fs * 0.1, fs * 0.92 + i * fs * 1.12));
    } else if (o.type === 'stamp') {
      if (d.kind === 'emoji') { x.font = '110px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textBaseline = 'top'; x.fillText(d.value, 4, 4); }
      else if (d.kind === 'text') {
        x.rotate(-6 * Math.PI / 180);
        x.font = '800 44px "Baloo 2", sans-serif';
        const label = String(d.value || '').toUpperCase(), w = x.measureText(label).width + 48;
        x.fillStyle = 'rgba(255,255,255,0.92)'; rr(x, 4, 8, w, 76, 18); x.fill();
        x.strokeStyle = d.color || '#16a34a'; x.fillStyle = d.color || '#16a34a'; x.lineWidth = 6;
        rr(x, 4, 8, w, 76, 18); x.stroke();
        x.textBaseline = 'middle'; x.fillText(label, 28, 47);
      } else { const im = await loadImg(d.src); if (im) x.drawImage(im, 0, 0, 200, 200 * (im.height / im.width || 1)); }
    } else if (o.type === 'image') {
      const w = o.w || 380, h = o.h || 460;
      x.fillStyle = 'rgba(15,23,42,0.92)'; rr(x, 0, 0, w, h, 24); x.fill();
      const im = await loadImg(d.src);
      if (im) { const side = w - 28, k = Math.min(side / im.width, side / im.height); x.drawImage(im, 14 + (side - im.width * k) / 2, 40 + (side - im.height * k) / 2, im.width * k, im.height * k); }
      x.fillStyle = '#f1f5f9'; x.font = '700 34px Andika, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(d.subject || '', w / 2, h - 34);
    } else if (TITLES[o.type]) {
      const w = o.w || 520, h = o.h || 260;
      x.fillStyle = 'rgba(15,23,42,0.92)'; rr(x, 0, 0, w, h, 24); x.fill();
      x.strokeStyle = 'rgba(148,163,184,0.3)'; x.lineWidth = 2; x.stroke();
      x.fillStyle = '#7dd3fc'; x.font = '800 15px "Baloo 2", sans-serif'; x.textBaseline = 'top';
      x.fillText(TITLES[o.type], 22, 18);
      if (o.type === 'word' && d.pic) { const im = await loadImg(d.pic); if (im) x.drawImage(im, w - 150, 40, 120, 120 * (im.height / im.width || 1)); }
      x.save(); rr(x, 0, 0, w, h, 24); x.clip();
      let y = 48;
      cardLines(o).filter(Boolean).forEach((line, i) => {
        const fs = i === 0 && ['word', 'story', 'quiz'].includes(o.type) ? 34 : 24;
        x.font = `${i === 0 ? 700 : 400} ${fs}px Andika, sans-serif`;
        x.fillStyle = i === 0 && o.type === 'story' ? '#fde047' : '#f1f5f9';
        wrap(x, line, w - 44 - (o.type === 'word' && d.pic ? 140 : 0)).forEach((ln) => { x.fillText(ln, 22, y); y += fs * 1.3; });
        y += 4;
      });
      x.restore();
    }
    x.restore();
  }
  async function renderPage(p, scale) {
    const { W, H } = SB.size();
    const c = document.createElement('canvas');
    c.width = Math.round(W * scale); c.height = Math.round(H * scale);
    const x = c.getContext('2d');
    x.scale(scale, scale);
    paintBg(x, W, H);
    (p.strokes || []).forEach((s) => SB.drawStroke(x, s));
    for (const o of p.objects || []) { try { await paintObj(x, o); } catch (e) { /* skip one card, keep the page */ } }
    return c;
  }
  async function thumbOf(p) { try { return (await renderPage(p, 0.22)).toDataURL('image/jpeg', 0.7); } catch (e) { return ''; } }
  function fileName(ext, n) {
    const cls = className(savedClass || (L ? L.activeClassId() : '')).replace(/[^\w-]+/g, '-');
    return `board-${cls}-${isoDay()}${n ? '-page' + n : ''}.${ext}`;
  }
  async function savePicture() {
    sync();
    try {
      const c = await renderPage(pages[index], 2);
      c.toBlob((b) => {
        if (!b) { toast('Could not make the picture.'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = fileName('png', pages.length > 1 ? index + 1 : 0);
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 8000);
        toast('🖼️ Picture saved to Downloads.'); AU.pop();
      }, 'image/png');
    } catch (e) { toast('Could not make the picture.'); }
  }
  async function savePdf() {
    sync();
    const w = root.open('', '_blank');
    if (!w) { toast('The browser blocked the new window. Allow pop-ups for this site.'); return; }
    w.document.write('<p style="font:20px sans-serif;padding:30px">Preparing the pages…</p>');
    const title = esc(savedTitle || 'Smart Board');
    const cls = esc(className(savedClass || (L ? L.activeClassId() : '')));
    const imgs = [];
    for (const p of pages) imgs.push((await renderPage(p, 1.5)).toDataURL('image/jpeg', 0.9));
    w.document.open();
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} · ${cls} · ${isoDay()}</title>
      <style>@page{size:A4 landscape;margin:8mm}body{margin:0;font-family:sans-serif}.pg{page-break-after:always;text-align:center}
      .pg:last-child{page-break-after:auto}h1{font-size:13px;margin:0 0 4mm;color:#334155;text-align:left}img{max-width:100%;max-height:178mm;border:1px solid #cbd5e1}</style></head><body>
      ${imgs.map((src, i) => `<div class="pg"><h1>${title} · ${cls} · ${isoDay()} · page ${i + 1} / ${imgs.length}</h1><img src="${src}"></div>`).join('')}
      <script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>`);
    w.document.close();
  }

  /* ------------------------------------------------------------ 📂 Boards panel */
  async function openBoards() {
    const panel = $('#boardsPanel');
    panel.classList.remove('hidden');
    $('#settings').classList.add('hidden');
    const lp = $('#lessonPanel'); if (lp) lp.classList.add('hidden');
    const body = $('#boardsBody');
    const cls = classList();
    let current = { title: '' };
    if (L) { try { current = await L.current(); } catch (e) { current = { title: '' }; } }
    const clsId = savedClass || (L ? L.activeClassId() : (cls[0] && cls[0].id));
    body.innerHTML = `
      <section class="set-sec"><h3>💾 Save this board</h3>
        <label class="field">Class <select id="bdClass" class="sb-select"></select></label>
        <label class="field">Name <input id="bdTitle" class="sb-input" maxlength="80"></label>
        <div class="pin-row"><button type="button" class="btn-primary" id="bdSave">💾 Save</button><button type="button" class="ctrl-btn" id="bdSaveNew">Save as new</button></div>
        <p class="set-hint" id="bdInfo"></p></section>
      <section class="set-sec"><h3>📤 Share</h3><div class="lp-actions">
        <button type="button" class="ctrl-btn" id="bdPng">🖼️ Picture of this page</button>
        <button type="button" class="ctrl-btn" id="bdPdf">📄 PDF of all pages</button>
        <button type="button" class="ctrl-btn" id="bdNew">🆕 New empty board</button></div></section>
      <section class="set-sec"><h3>📂 Saved boards</h3>
        <label class="field">Show <select id="bdFilter" class="sb-select"><option value="">All classes</option></select></label>
        <button type="button" class="btn-primary wide" id="bdLast">⏮ Open last lesson's board</button>
        <div class="bd-list" id="bdList"><p class="set-hint">Loading…</p></div></section>`;
    const sc = $('#bdClass'), sf = $('#bdFilter');
    cls.forEach((c) => {
      [sc, sf].forEach((sel) => { const op = document.createElement('option'); op.value = c.id; op.textContent = c.name; sel.appendChild(op); });
    });
    sc.value = clsId; sf.value = clsId;
    $('#bdTitle').value = savedTitle || (current && current.title ? String(current.title).replace(/^[^\w]+/, '').slice(0, 60) : 'Board');
    $('#bdInfo').textContent = savedId ? `This board is saved as “${savedTitle}”. Save again to update it.` : 'Not saved yet. It is kept in this browser.';
    const doSave = async (asNew) => {
      try { const r = await saveRecord({ classId: sc.value, title: $('#bdTitle').value.trim() || 'Board', asNew }); toast(`✅ Saved: ${r.title} · ${r.className} · ${niceDay(r.date)}`); AU.correct(); openBoards(); }
      catch (e) { toast('Could not save: ' + (e.message || 'the browser storage is full.')); }
    };
    $('#bdSave').addEventListener('click', () => doSave(false));
    $('#bdSaveNew').addEventListener('click', () => doSave(true));
    $('#bdPng').addEventListener('click', savePicture);
    $('#bdPdf').addEventListener('click', savePdf);
    $('#bdNew').addEventListener('click', newBoard);
    let all = [];
    try { all = await listBoards(); } catch (e) { $('#bdList').innerHTML = `<p class="set-hint">${esc(e.message)}</p>`; return; }
    const paint = () => {
      const f = sf.value;
      const list = all.filter((r) => !f || r.classId === f);
      const box = $('#bdList');
      box.innerHTML = list.length ? '' : '<p class="set-hint">No saved boards for this class yet.</p>';
      list.slice(0, 60).forEach((r) => {
        const it = document.createElement('div');
        it.className = 'bd-item' + (r.id === savedId ? ' current' : '');
        it.innerHTML = `<div class="bd-thumb">${r.thumb ? `<img alt="" src="${r.thumb}">` : '🪄'}</div>
          <div class="bd-meta"><b></b><span>${esc(r.className)} · ${esc(niceDay(r.date))} · ${(r.pages || []).length} page${(r.pages || []).length === 1 ? '' : 's'}</span></div>
          <button type="button" class="ctrl-btn bd-open">Open</button><button type="button" class="ctrl-btn danger bd-del" title="Delete">🗑</button>`;
        it.querySelector('b').textContent = r.title;
        it.querySelector('.bd-open').addEventListener('click', () => openRecord(r.id));
        let armed = 0;
        it.querySelector('.bd-del').addEventListener('click', async () => {
          if (Date.now() - armed > 3000) { armed = Date.now(); toast('Tap 🗑 again to delete “' + r.title + '”.'); return; }
          await delBoard(r.id);
          if (r.id === savedId) { savedId = null; savedTitle = ''; SB.saveBoard(); }
          all = all.filter((x) => x.id !== r.id); paint();
        });
        box.appendChild(it);
      });
      const last = list.find((r) => r.id !== savedId);
      const lb = $('#bdLast');
      lb.disabled = !last;
      lb.textContent = last ? `⏮ Open last lesson's board (${niceDay(last.date)})` : '⏮ No earlier board for this class';
      lb.onclick = () => last && openRecord(last.id);
    };
    sf.addEventListener('change', paint);
    paint();
  }

  SB.onStart = SB.onStart || [];
  SB.onStart.push(() => {
    $('#pgPrev').addEventListener('click', () => goPage(index - 1));
    $('#pgNext').addEventListener('click', () => goPage(index + 1));
    $('#pgAdd').addEventListener('click', addPage);
    $('#pgDel').addEventListener('click', deletePage);
    $('#btnBoards').addEventListener('click', () => ($('#boardsPanel').classList.contains('hidden') ? openBoards() : $('#boardsPanel').classList.add('hidden')));
    $('#btnCloseBoards').addEventListener('click', () => $('#boardsPanel').classList.add('hidden'));
    root.addEventListener('keydown', (e) => {
      const typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT');
      if (typing || e.ctrlKey || e.metaKey) return;
      if (e.key === 'PageDown') { e.preventDefault(); index < pages.length - 1 ? goPage(index + 1) : addPage(); }
      if (e.key === 'PageUp') { e.preventDefault(); goPage(index - 1); }
    });
    paintStrip();
  });
  SB.pages = { goPage, addPage, deletePage, renderPage, savePicture, savePdf, openBoards, list: listBoards, count: () => pages.length, index: () => index };
})(window);
