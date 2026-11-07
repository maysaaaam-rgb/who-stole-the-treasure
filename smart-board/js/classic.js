/* Smart Board: the classic old-school blackboard.
   A slate in a wooden frame, a chalk tray with chalk sticks (tap one to write in that colour),
   chalky writing, and the felt duster with its dust. Real pictures from art/ are used when they
   are listed in SMART_CLASSIC_ART; until then everything is drawn here. */
(function (root) {
  'use strict';
  const SB = root.SB, AU = root.SBAudio;
  if (!SB) return;
  const $ = (s) => document.querySelector(s);
  const ART = root.SMART_CLASSIC_ART || [];
  const has = (n) => ART.includes(n);
  const artUrl = (n) => 'art/' + n + '.webp';
  const CHALK_NAMES = { ink: 'white', '#fff1a6': 'yellow', '#ffc4d8': 'pink', '#aeddff': 'blue', '#bff3c6': 'green', '#ffd2a3': 'orange' };

  /* ---------------------------------------------------------------- textures made in the browser */
  function noiseURL(size, paint) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d'), img = x.createImageData(size, size), d = img.data;
    for (let i = 0; i < size * size; i++) paint(d, i * 4, i % size, Math.floor(i / size));
    x.putImageData(img, 0, 0);
    return c;
  }
  // Chalk is grainy: a mask that lets most of the line through, with tiny gaps
  const grain = noiseURL(160, (d, i) => {
    const r = Math.random();
    d[i] = d[i + 1] = d[i + 2] = 0;
    d[i + 3] = r < 0.13 ? 40 + Math.random() * 80 : 190 + Math.random() * 65;
  });
  // The slate: very fine light specks of old chalk dust
  const slate = noiseURL(220, (d, i) => {
    const r = Math.random();
    d[i] = d[i + 1] = d[i + 2] = 235;
    d[i + 3] = r < 0.035 ? 10 + Math.random() * 18 : 0;
  });
  const bs = document.body.style;
  bs.setProperty('--chalk-mask', 'url(' + grain.toDataURL() + ')');
  bs.setProperty('--slate-noise', 'url(' + slate.toDataURL() + ')');
  if (has('t_slate')) bs.setProperty('--slate-img', 'url(' + artUrl('t_slate') + ')');
  if (has('t_wood')) bs.setProperty('--wood-img', 'url(' + artUrl('t_wood') + ')');
  if (has('t_slate')) document.body.classList.add('has-slate-art');
  if (has('t_wood')) document.body.classList.add('has-wood-art');

  // Pictures and saved pages get the same chalk grain (used by the page export)
  let grainPattern = null;
  SB.chalkGrain = function (x, w, h) {
    if (!SB.isChalk()) return;
    try {
      grainPattern = grainPattern || x.createPattern(grain, 'repeat');
      x.save();
      x.globalCompositeOperation = 'destination-in';
      x.fillStyle = grainPattern;
      x.fillRect(0, 0, w, h);
      x.restore();
    } catch (e) { /* the grain is decoration */ }
  };

  /* ---------------------------------------------------------------- the effects layer: duster + dust */
  const fx = document.createElement('canvas');
  fx.id = 'fxCanvas'; fx.setAttribute('aria-hidden', 'true');
  document.body.appendChild(fx);
  const fctx = fx.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(root.devicePixelRatio || 1, 2);
    W = root.innerWidth; H = root.innerHeight;
    fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kick();
  }
  root.addEventListener('resize', resize);

  const dusterImg = has('o_duster_top') ? Object.assign(new Image(), { src: artUrl('o_duster_top') }) : null;
  const puffImg = has('o_dust_puff') ? Object.assign(new Image(), { src: artUrl('o_dust_puff') }) : null;
  const ready = (im) => im && im.complete && im.naturalWidth > 0;

  const parts = [];
  let cur = null, raf = 0;
  const reduced = () => !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function drawDuster(c) {
    const { x, y, w, h } = c;
    fctx.save();
    fctx.translate(x, y);
    fctx.rotate(c.tilt);
    if (c.wiping) fctx.scale(0.98, 0.98);
    fctx.shadowColor = 'rgba(0,0,0,0.45)';
    fctx.shadowBlur = c.wiping ? 6 : 18;
    fctx.shadowOffsetY = c.wiping ? 2 : 10;
    if (ready(dusterImg)) {
      const k = Math.min((w * 1.08) / dusterImg.naturalWidth, (h * 1.5) / dusterImg.naturalHeight);
      const iw = dusterImg.naturalWidth * k, ih = dusterImg.naturalHeight * k;
      fctx.drawImage(dusterImg, -iw / 2, -ih / 2, iw, ih);
      fctx.restore();
      return;
    }
    const rr = (x0, y0, ww, hh, r) => { fctx.beginPath(); if (fctx.roundRect) fctx.roundRect(x0, y0, ww, hh, r); else fctx.rect(x0, y0, ww, hh); };
    // The felt: exactly the area that wipes
    rr(-w / 2, -h / 2, w, h, h * 0.18);
    const felt = fctx.createLinearGradient(0, -h / 2, 0, h / 2);
    felt.addColorStop(0, '#d9d6cf'); felt.addColorStop(1, '#b9b4aa');
    fctx.fillStyle = felt; fctx.fill();
    fctx.shadowColor = 'transparent';
    // Chalk dust caught in the felt edge
    fctx.strokeStyle = 'rgba(255,255,255,0.55)'; fctx.lineWidth = 2; fctx.stroke();
    // The wooden back
    const bw = w * 0.9, bh = h * 0.78;
    rr(-bw / 2, -bh / 2, bw, bh, bh * 0.28);
    const wood = fctx.createLinearGradient(0, -bh / 2, 0, bh / 2);
    wood.addColorStop(0, '#d39a5c'); wood.addColorStop(0.5, '#b97a3e'); wood.addColorStop(1, '#8a5527');
    fctx.fillStyle = wood; fctx.fill();
    fctx.save(); fctx.clip();
    fctx.strokeStyle = 'rgba(90, 50, 20, 0.28)'; fctx.lineWidth = 1.4;
    for (let i = 0; i < 6; i++) {
      const yy = -bh / 2 + (bh * (i + 0.6)) / 6;
      fctx.beginPath(); fctx.moveTo(-bw / 2, yy);
      fctx.bezierCurveTo(-bw / 4, yy + 3 * Math.sin(i * 1.7), bw / 4, yy - 3 * Math.cos(i), bw / 2, yy + 1.5);
      fctx.stroke();
    }
    // Shine and the finger groove
    fctx.fillStyle = 'rgba(255,255,255,0.22)'; fctx.fillRect(-bw / 2, -bh / 2, bw, bh * 0.18);
    fctx.restore();
    rr(-bw * 0.32, -bh * 0.09, bw * 0.64, bh * 0.18, bh * 0.09);
    fctx.fillStyle = 'rgba(70, 38, 14, 0.45)'; fctx.fill();
    fctx.restore();
  }
  function spawn(c, n, speed) {
    if (reduced()) return;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: c.x + (Math.random() - 0.5) * c.w * 0.95,
        y: c.y + c.h * (0.2 + Math.random() * 0.35),
        vx: (Math.random() - 0.5) * (0.6 + speed),
        vy: -0.2 + Math.random() * 0.6,
        r: 0.8 + Math.random() * 2.4,
        life: 1, fade: 0.012 + Math.random() * 0.02
      });
    }
    if (parts.length > 420) parts.splice(0, parts.length - 420);
  }
  function loop() {
    raf = 0;
    fctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += 0.045; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.life -= p.fade;
      if (p.life <= 0 || p.y > H + 10) { parts.splice(i, 1); continue; }
      fctx.globalAlpha = Math.max(0, p.life) * 0.75;
      fctx.fillStyle = '#f2f1ea';
      fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); fctx.fill();
    }
    fctx.globalAlpha = 1;
    if (cur && cur.puff > 0 && ready(puffImg)) {
      fctx.globalAlpha = cur.puff * 0.7;
      const s = cur.w * 0.9;
      fctx.drawImage(puffImg, cur.x - s / 2, cur.y - s * 0.1, s, s);
      fctx.globalAlpha = 1;
      cur.puff -= 0.04;
    }
    if (cur && !cur.hidden) {
      cur.tilt += ((cur.wiping ? cur.want : 0) - cur.tilt) * 0.25;
      drawDuster(cur);
    }
    if (parts.length || (cur && (Math.abs(cur.tilt) > 0.002 || cur.puff > 0))) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  SB.fx = {
    duster(p, wiping, size, speed) {
      const prev = cur;
      cur = Object.assign(cur || { tilt: 0, puff: 0 }, { x: p[0], y: p[1], w: size.w, h: size.h, wiping: !!wiping, hidden: false });
      if (wiping && prev && prev.x != null) {
        const dx = p[0] - prev.lx, dy = p[1] - prev.ly;
        cur.want = Math.max(-0.12, Math.min(0.12, (dx || 0) * 0.004 + (dy || 0) * 0.002));
        const sp = speed == null ? Math.hypot(dx || 0, dy || 0) / 12 : speed;
        if (sp > 0.05) spawn(cur, Math.min(4, 1 + Math.floor(sp * 3)), sp);
      }
      cur.lx = p[0]; cur.ly = p[1];
      kick();
    },
    lift() { if (!cur) return; cur.wiping = false; cur.puff = ready(puffImg) ? 1 : 0; spawn(cur, 14, 0.6); kick(); },
    hide() { if (cur) { cur.hidden = true; cur.lx = null; } kick(); }
  };

  /* ---------------------------------------------------------------- the frame and the chalk tray */
  const frame = document.createElement('div');
  frame.className = 'classic-frame';
  frame.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '<i class="screw tl"></i><i class="screw tr"></i><i class="screw bl"></i><i class="screw br"></i>';
  $('#board').insertBefore(frame, $('#objLayer'));

  const tray = document.createElement('div');
  tray.className = 'chalk-tray';
  tray.id = 'chalkTray';
  tray.setAttribute('aria-label', 'Chalk tray');
  tray.innerHTML = '<div class="tray-sticks"></div><div class="tray-dust" aria-hidden="true"></div>' +
    '<button type="button" class="tray-duster" title="Duster: wipe the board like a real one" aria-label="Duster"></button>';
  document.body.appendChild(tray);
  const sticksBox = tray.querySelector('.tray-sticks');
  const trayDuster = tray.querySelector('.tray-duster');
  if (has('o_duster_top')) trayDuster.style.backgroundImage = 'url(' + artUrl('o_duster_top') + ')', trayDuster.classList.add('art');
  trayDuster.addEventListener('click', () => { SB.setTool(SB.tool === 'duster' ? 'pen' : 'duster'); if (AU.clack) AU.clack(); });

  function buildSticks() {
    const pal = (root.SMART_INK && root.SMART_INK.chalk) || [];
    sticksBox.innerHTML = '';
    pal.forEach((c, i) => {
      const b = document.createElement('button');
      const name = CHALK_NAMES[c] || 'chalk';
      b.type = 'button';
      b.className = 'chalk-stick';
      b.dataset.c = c;
      b.title = name[0].toUpperCase() + name.slice(1) + ' chalk';
      b.setAttribute('aria-label', b.title);
      b.style.setProperty('--c', c === 'ink' ? '#f4f4ea' : c);
      b.style.setProperty('--r', ((i % 3) - 1) * 4 + 'deg');
      if (has('o_chalk_' + name)) { b.classList.add('art'); b.style.backgroundImage = 'url(' + artUrl('o_chalk_' + name) + ')'; }
      b.addEventListener('click', () => { SB.setColor(c); SB.setTool('pen'); if (AU.clack) AU.clack(); updateTray(); });
      sticksBox.appendChild(b);
    });
    updateTray();
  }
  function updateTray() {
    const t = SB.tool;
    sticksBox.querySelectorAll('.chalk-stick').forEach((b) => b.classList.toggle('active', (t === 'pen' || t === 'hl') && b.dataset.c === SB.color));
    trayDuster.classList.toggle('lifted', t === 'duster');
  }
  SB.onPalette = updateTray;
  const prevTool = SB.onToolChange;
  SB.onToolChange = (t) => { if (prevTool) prevTool(t); updateTray(); };

  SB.onStart = SB.onStart || [];
  SB.onStart.push(() => {
    resize();
    buildSticks();
  });
})(window);
