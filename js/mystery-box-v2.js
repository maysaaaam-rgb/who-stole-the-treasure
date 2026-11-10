/* Mystery box opening, version 2 (9 Nov 2026). Replaces the drawn chest and the "energy surge" texts.
   A pupil taps the box three times (it shakes harder each time, light leaks out), then it bursts open in its rarity
   colour and the real prize picture rises out of it. Works with the box art in assets/store/ when it exists
   (box_<tier>.webp, box_<tier>_open.webp, video/open_<tier>.mp4, listed in assets/store/manifest.json);
   until then it uses the 3D chest from platform-art. All sounds are synthesized. */
(function (root) {
  'use strict';
  var M = root.MysteryBoxModal; if (!M) return;
  var Ctrl = Object.getPrototypeOf(M);

  var TIER = {
    BRONZE: { key: 'bronze', name: 'Bronze Box', c: '#d97a3a', filter: 'sepia(.55) saturate(1.3) hue-rotate(-12deg)' },
    WOODEN: { key: 'silver', name: 'Silver Box', c: '#cbd5e1', filter: 'grayscale(.85) brightness(1.15) contrast(1.05)' },
    GILDED: { key: 'gold', name: 'Gold Box', c: '#facc15', filter: 'sepia(.35) saturate(2) hue-rotate(5deg) brightness(1.18)' },
    CELESTIAL: { key: 'diamond', name: 'Diamond Box', c: '#22d3ee', filter: 'hue-rotate(165deg) saturate(1.4) brightness(1.1)' }
  };
  var RAR = {
    common: { name: 'Everyday', c: '#94a3b8', glow: 'rgba(148,163,184,.55)' },
    rare: { name: 'Cool', c: '#22c55e', glow: 'rgba(34,197,94,.6)' },
    epic: { name: 'Epic', c: '#a855f7', glow: 'rgba(168,85,247,.7)' },
    legendary: { name: 'Legendary', c: '#f59e0b', glow: 'rgba(245,158,11,.8)' },
    mythic: { name: 'Mythic', c: '#f43f5e', glow: 'rgba(244,63,94,.85)' }
  };
  var ART = { list: ["box_bronze", "box_bronze_open", "box_diamond", "box_diamond_open", "box_gold", "box_gold_open", "box_silver", "box_silver_open", "coin_one", "coin_pile", "jackpot_gem", "prize_cat_stickers", "prize_pencil_topper", "reward_ticket", "shop_counter", "shop_stage", "sounds/box_open_common", "sounds/box_open_epic", "sounds/box_open_legendary", "sounds/box_open_mythic", "sounds/box_open_rare", "sounds/box_tap", "sounds/coin_buy", "sounds/coin_give", "sounds/not_enough", "sounds/shop_music"] };
  try {
    fetch('assets/store/manifest.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (l) { ART.list = Array.isArray(l) ? l : []; }).catch(function () { ART.list = []; });
  } catch (e) { ART.list = []; }
  function has(name) { return !!(ART.list && ART.list.indexOf(name) >= 0); }
  function boxPic(tier, open) {
    var t = TIER[tier] || TIER.WOODEN, n = 'box_' + t.key + (open ? '_open' : '');
    if (has(n)) return { src: 'assets/store/' + n + '.webp', filter: 'none' };
    return { src: 'platform-art/r_chest.webp', filter: t.filter };
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- sound ---------- */
  var ac = null;
  function ctx() { if (!ac) { try { ac = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { ac = null; } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
  function tone(f, t, d, v, type) {
    var c = ctx(); if (!c) return;
    [0, 5].forEach(function (det) {
      var o = c.createOscillator(), g = c.createGain(); o.type = type || 'triangle'; o.frequency.value = f; o.detune.value = det;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.05);
    });
  }
  function thump(step) {
    if (file('box_tap')) return;
    var c = ctx(); if (!c) return; var t = c.currentTime;
    var n = Math.floor(c.sampleRate * 0.18), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'lowpass'; f.frequency.value = 500 + step * 250; g.gain.value = 0.9;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
    tone([523.25, 659.25, 783.99][step] || 783.99, t + 0.04, 0.35, 0.07, 'sine');   // each tap rings a step higher
  }
  function file(name) {   /* a Gemini sound in assets/store/sounds/, if it was added */
    if (!has('sounds/' + name)) return false;
    try { var a = new Audio('assets/store/sounds/' + name + '.mp3'); a.volume = .8; a.play(); return true; } catch (e) { return false; }
  }
  function reveal(rarity) {
    if (file('box_open_' + rarity)) return;
    var c = ctx(); if (!c) return; var t = c.currentTime + 0.02;
    var seq = { common: [523.25, 659.25, 783.99], rare: [523.25, 659.25, 783.99, 1046.5], epic: [523.25, 659.25, 783.99, 1046.5, 1318.5],
      legendary: [392, 523.25, 659.25, 783.99, 1046.5, 1318.5], mythic: [392, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98] }[rarity] || [523.25, 659.25, 783.99];
    seq.forEach(function (f, i) { tone(f, t + i * 0.09, 0.9, 0.09); });
    tone(seq[seq.length - 1] * 2, t + seq.length * 0.09, 1.4, 0.035, 'sine');
  }

  /* ---------- styles ---------- */
  function css() {
    if (document.getElementById('mb2-css')) return;
    var s = document.createElement('style'); s.id = 'mb2-css';
    s.textContent = '' +
      '.mb2{position:relative;width:min(560px,94vw);min-height:min(620px,90vh);border-radius:28px;overflow:hidden;color:#e5edff;font-family:"Plus Jakarta Sans",system-ui,sans-serif;' +
        'background:radial-gradient(circle at 50% 38%,color-mix(in srgb,var(--tc) 22%,#131b33) 0%,#060911 72%);border:2px solid color-mix(in srgb,var(--tc) 55%,#26324a);box-shadow:0 30px 80px rgba(0,0,0,.6);display:flex;flex-direction:column;align-items:center;padding:22px 22px 26px}' +
      '.mb2-x{position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:50%;border:1.5px solid #334155;background:#0f172a;color:#cbd5e1;font-size:1.1rem;cursor:pointer;z-index:5}' +
      '.mb2-tag{display:inline-flex;gap:6px;align-items:center;padding:6px 14px;border-radius:999px;font-weight:800;font-size:.95rem;background:color-mix(in srgb,var(--tc) 25%,#0f172a);border:1.5px solid var(--tc)}' +
      '.mb2-who{margin-top:6px;color:#a3b0c8;font-weight:700}' +
      '.mb2-stage{position:relative;flex:1;width:100%;min-height:330px;display:flex;align-items:center;justify-content:center}' +
      '.mb2-rays{position:absolute;width:620px;height:620px;border-radius:50%;opacity:0;pointer-events:none;background:repeating-conic-gradient(from 0deg,var(--rc,var(--tc)) 0deg 9deg,transparent 9deg 24deg);-webkit-mask:radial-gradient(circle,#000 0 18%,transparent 62%);mask:radial-gradient(circle,#000 0 18%,transparent 62%);transition:opacity .4s}' +
      '.mb2.lit .mb2-rays{opacity:.18;animation:mb2spin 16s linear infinite}.mb2.open .mb2-rays{opacity:.55;animation-duration:8s}' +
      '@keyframes mb2spin{to{transform:rotate(360deg)}}' +
      '.mb2-box{position:relative;width:270px;height:270px;cursor:pointer;border:0;background:none;padding:0;transition:transform .25s cubic-bezier(.175,.885,.32,1.275)}' +
      '.mb2-box img,.mb2-box video{width:100%;height:100%;object-fit:contain;filter:var(--bf) drop-shadow(0 18px 18px rgba(0,0,0,.5));pointer-events:none}' +
      '.mb2-box:after{content:"";position:absolute;left:12%;right:12%;bottom:-8px;height:26px;border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--tc) 60%,transparent),transparent 70%)}' +
      '.mb2-box:focus-visible{outline:3px solid #38bdf8;outline-offset:8px;border-radius:24px}' +
      '.mb2-box.idle{animation:mb2bob 2.6s ease-in-out infinite}@keyframes mb2bob{50%{transform:translateY(-8px)}}' +
      '.mb2-box.s1{animation:mb2shake .35s}.mb2-box.s2{animation:mb2shake2 .4s}.mb2-box.s3{animation:mb2shake3 .5s}' +
      '@keyframes mb2shake{25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}' +
      '@keyframes mb2shake2{20%{transform:rotate(-7deg) scale(1.04)}60%{transform:rotate(7deg) scale(1.04)}}' +
      '@keyframes mb2shake3{15%{transform:rotate(-10deg) scale(1.08)}45%{transform:rotate(10deg) scale(1.1)}75%{transform:rotate(-6deg) scale(1.12)}}' +
      '.mb2-leak{position:absolute;inset:0;pointer-events:none;border-radius:50%;opacity:0;background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--rc) 80%,#fff) 0,transparent 55%);mix-blend-mode:screen;transition:opacity .3s}' +
      '.mb2-flash{position:absolute;inset:-40px;background:#fff;opacity:0;pointer-events:none}.mb2.open .mb2-flash{animation:mb2flash .7s ease-out}@keyframes mb2flash{0%{opacity:.95}100%{opacity:0}}' +
      '.mb2.open .mb2-box{transform:scale(.6) translateY(110px);opacity:.25;cursor:default;animation:none}' +
      '.mb2-prize{position:absolute;display:flex;flex-direction:column;align-items:center;opacity:0;transform:translateY(60px) scale(.4);pointer-events:none}' +
      '.mb2.open .mb2-prize{opacity:1;transform:translateY(-18px) scale(1);transition:transform .7s cubic-bezier(.175,.885,.32,1.275) .25s,opacity .3s .25s}' +
      '.mb2-pic{width:190px;height:190px;border-radius:30px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,#22304f,#0b1222);border:3px solid var(--rc);box-shadow:0 0 50px var(--rg),0 14px 0 -4px rgba(0,0,0,.4)}' +
      '.mb2-pic .sc{transform:scale(2.15);display:flex;align-items:center;justify-content:center}.mb2-pic .em{font-size:6rem;line-height:1}' +
      '.mb2-say{text-align:center;margin-top:8px;min-height:120px}' +
      '.mb2-h{font:800 clamp(1.6rem,4vw,2.2rem)/1.15 Fraunces,Georgia,serif;margin:0}.mb2-p{color:#cbd5e1;font-size:1.05rem;margin:6px 0 0}' +
      '.mb2-dots{display:flex;gap:10px;justify-content:center;margin-top:12px}.mb2-dots i{width:18px;height:18px;border-radius:50%;border:2px solid var(--tc);background:transparent;transition:background .2s}.mb2-dots i.on{background:var(--tc);box-shadow:0 0 12px var(--tc)}' +
      '.mb2-rar{display:inline-block;margin-top:10px;padding:5px 16px;border-radius:999px;font-weight:900;color:#0b0d13;background:var(--rc);font-size:1rem}' +
      '.mb2-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}' +
      '.mb2-b{border:0;border-radius:16px;padding:13px 22px;font:800 1.05rem "Plus Jakarta Sans",system-ui,sans-serif;color:#fff;cursor:pointer;background:#10b981;border-bottom:5px solid #047857;transition:transform .18s cubic-bezier(.175,.885,.32,1.275)}' +
      '.mb2-b:active{transform:translateY(4px);border-bottom-width:1px}.mb2-b.g{background:#1e293b;border-bottom-color:#0b1020;border-top:1.5px solid #334155}' +
      '.mb2-conf{position:absolute;top:40%;left:50%;width:10px;height:14px;border-radius:2px;pointer-events:none;animation:mb2burst 1.4s ease-out forwards}' +
      '@keyframes mb2burst{to{transform:translate(var(--dx),var(--dy)) rotate(var(--r));opacity:0}}' +
      '@media(prefers-reduced-motion:reduce){.mb2 *{animation:none!important;transition:none!important}}';
    document.head.appendChild(s);
  }

  /* ---------- the modal ---------- */
  var TAPS = 3, tapsDone = 0;
  Ctrl._renderModal = function () {
    css();
    var el = document.getElementById('modal-mystery-box-unboxing');
    if (!el) { el = document.createElement('div'); el.id = 'modal-mystery-box-unboxing'; el.className = 'mystery-box-modal-overlay'; document.body.appendChild(el); }
    var tier = String(this.activeBox.boxTier || 'WOODEN').toUpperCase(), t = TIER[tier] || TIER.WOODEN, pic = boxPic(tier, false);
    var name = (this.activeStudent && (this.activeStudent.firstName || this.activeStudent.name || '').split(' ')[0]) || '';
    tapsDone = 0; this._mb2done = false;
    el.innerHTML = '<div class="mb2" id="mb2" style="--tc:' + t.c + ';--rc:' + t.c + '">' +
      '<button type="button" class="mb2-x" onclick="window.MysteryBoxModal.close()" aria-label="Close">✕</button>' +
      '<span class="mb2-tag">🎁 ' + esc(t.name) + '</span>' + (name ? '<div class="mb2-who">' + esc(name) + '’s box' + (this.activeBox.preview ? ' (preview)' : '') + '</div>' : '') +
      '<div class="mb2-stage"><div class="mb2-rays"></div><div class="mb2-flash"></div>' +
        '<button type="button" class="mb2-box idle" id="mb2-box" style="--bf:' + pic.filter + '" aria-label="Tap the box" onclick="window.MysteryBoxModal.tapBox()"><img src="' + pic.src + '" alt="" draggable="false"><span class="mb2-leak" id="mb2-leak"></span></button>' +
        '<div class="mb2-prize" id="mb2-prize"></div></div>' +
      '<div class="mb2-say" id="mb2-say"><h2 class="mb2-h">Tap the box 3 times!</h2><p class="mb2-p">Every box has a surprise inside.</p><div class="mb2-dots" id="mb2-dots"><i></i><i></i><i></i></div></div>' +
    '</div>';
    if (has('shop_stage')) { var m2 = document.getElementById('mb2'); m2.style.backgroundImage = 'linear-gradient(rgba(6,9,17,.35),rgba(6,9,17,.82)),url(assets/store/shop_stage.webp)'; m2.style.backgroundSize = 'cover'; m2.style.backgroundPosition = '50% 60%'; }
    el.style.display = 'flex';
    setTimeout(function () { el.classList.add('is-active'); }, 10);
  };
  Ctrl.tapBox = function () {
    if (this._mb2done || this.isUnboxingInProgress) return;
    var box = document.getElementById('mb2-box'), root2 = document.getElementById('mb2'), dots = document.querySelectorAll('#mb2-dots i'), leak = document.getElementById('mb2-leak');
    if (!box) return;
    ctx();
    if (tapsDone === 0 || !this.openedPayload) {   /* the prize is decided on the first tap, so its colour can leak out of the box */
      var res = this._roll(); if (!res) return;
      var r = RAR[res.item && res.item.rarity] || RAR.rare;
      root2.style.setProperty('--rc', r.c); root2.style.setProperty('--rg', r.glow); root2.classList.add('lit');
    }
    tapsDone++;
    if (dots[tapsDone - 1]) dots[tapsDone - 1].classList.add('on');
    box.classList.remove('idle', 's1', 's2', 's3'); void box.offsetWidth; box.classList.add('s' + Math.min(3, tapsDone));
    if (leak) leak.style.opacity = String(tapsDone / TAPS * .9);
    thump(tapsDone - 1);
    var say = document.querySelector('#mb2-say .mb2-h');
    if (tapsDone < TAPS) { if (say) say.textContent = tapsDone === 1 ? 'Again!' : 'One more!'; return; }
    this.isUnboxingInProgress = true; this._mb2done = true;
    var self = this, tier = String(this.activeBox.boxTier || 'WOODEN').toUpperCase(), vk = 'video/open_' + (TIER[tier] || TIER.WOODEN).key;
    if (has(vk)) {   /* a Gemini opening video: play it in place of the box, then show the prize */
      var v = document.createElement('video'); v.src = 'assets/store/' + vk + '.mp4'; v.muted = false; v.playsInline = true; v.style.cssText = 'width:100%;height:100%;object-fit:contain';
      var im = box.querySelector('img'); if (im) im.replaceWith(v); box.classList.remove('s1', 's2', 's3');
      var done = false, go = function () { if (!done) { done = true; self._open(); } };
      v.addEventListener('ended', go); v.addEventListener('error', go); setTimeout(go, 7000);
      v.play().catch(function () { v.muted = true; v.play().catch(go); });
      return;
    }
    setTimeout(function () { self._open(); }, 450);
  };
  Ctrl._roll = function () {
    var store = root.store || root.schoolStore;
    var PREV = { BRONZE: 'common', WOODEN: 'rare', GILDED: 'epic', CELESTIAL: 'legendary' };
    var res = this.activeBox.preview
      ? { success: true, preview: true, bonusCoins: 0, reward: { type: 'preview' }, item: { id: 'preview', name: 'Preview only', icon: '🎁', rarity: PREV[this.activeBox.boxTier] || 'rare', category: 'preview', description: 'Nothing was given to any pupil. Pupils get real boxes in the shop or from you.' } }
      : store.openMysteryBox(this.activeBox.id, this.activeStudent.id);
    if (!res || !res.success) { if (root.showNotification) root.showNotification((res && res.error) || 'This box cannot be opened.', 'error'); return null; }
    this.openedPayload = res; return res;
  };
  function prizePic(item, res) {
    function art(n, e) { return has(n) ? '<img src="assets/store/' + n + '.webp" alt="" draggable="false" style="width:86%;height:86%;object-fit:contain">' : '<span class="em">' + e + '</span>'; }
    if (res.reward && res.reward.type === 'coins') return art(res.reward.rolled === 'jackpot' ? 'jackpot_gem' : (res.reward.amount > 5 ? 'coin_pile' : 'coin_one'), '🪙');
    if (res.reward && res.reward.type === 'voucher') return art('reward_ticket', item.icon || '🎟️');
    var CS = root.ClassroomStore;
    if (item && item.id && item.id !== 'preview' && item.id !== 'voucher' && CS && CS.itemPic) { try { var h = CS.itemPic(item); if (h) return '<span class="sc">' + h + '</span>'; } catch (e) { /* fall back */ } }
    return '<span class="em">' + esc(item.icon || '🎁') + '</span>';
  }
  Ctrl._open = function () {
    var res = this.openedPayload, item = res.item || {}, r = RAR[item.rarity] || RAR.rare, root2 = document.getElementById('mb2');
    if (!root2) return;
    var tier = String(this.activeBox.boxTier || 'WOODEN').toUpperCase(), op = boxPic(tier, true), img = root2.querySelector('#mb2-box img');
    if (img && op.src !== img.getAttribute('src')) img.src = op.src;
    root2.classList.add('open'); reveal(item.rarity);
    var pz = document.getElementById('mb2-prize'); pz.innerHTML = '<div class="mb2-pic">' + prizePic(item, res) + '</div>';
    /* confetti in the rarity colour */
    var cs = [r.c, '#ffffff', '#facc15', '#38bdf8'], st = root2.querySelector('.mb2-stage');
    for (var i = 0; i < (item.rarity === 'legendary' || item.rarity === 'mythic' ? 70 : 40); i++) {
      var a = Math.random() * Math.PI * 2, d = 140 + Math.random() * 220, c = document.createElement('i');
      c.className = 'mb2-conf'; c.style.cssText = 'background:' + cs[i % 4] + ';--dx:' + Math.round(Math.cos(a) * d) + 'px;--dy:' + Math.round(Math.sin(a) * d) + 'px;--r:' + Math.round(Math.random() * 720) + 'deg;animation-delay:' + (Math.random() * .15) + 's';
      st.appendChild(c);
    }
    var name = (this.activeStudent && (this.activeStudent.firstName || '').split(' ')[0]) || 'You';
    var kind = res.reward && res.reward.type, acts;
    if (kind === 'extra') acts = '<button type="button" class="mb2-b" onclick="window.MysteryBoxModal.equipExtra(\'' + esc(res.reward.kind) + '\',\'' + esc(item.id) + '\')">✨ Wear it now</button><button type="button" class="mb2-b g" onclick="window.MysteryBoxModal.close()">Keep it for later</button>';
    else if (kind === 'item' || (!kind && item.id)) acts = '<button type="button" class="mb2-b" onclick="window.MysteryBoxModal.equipDrop(\'' + esc(item.id) + '\')">⚡ Put it on my monster</button><button type="button" class="mb2-b g" onclick="window.MysteryBoxModal.close()">Keep it for later</button>';
    else acts = '<button type="button" class="mb2-b" onclick="window.MysteryBoxModal.close()">🎉 Great!</button>';
    var head = res.preview ? 'Preview only' : kind === 'coins' ? name + ' found ' + (res.reward.amount || '') + ' coins!' : name + ' got ' + item.name + '!';
    var sub = res.preview ? item.description : kind === 'voucher' ? 'Show your teacher. This reward is free!' : (item.description || '');
    document.getElementById('mb2-say').innerHTML = '<h2 class="mb2-h">' + esc(head) + '</h2>' + (sub ? '<p class="mb2-p">' + esc(sub) + '</p>' : '') +
      '<span class="mb2-rar">' + esc(r.name) + '</span><div class="mb2-acts">' + acts + '</div>';
    this.isUnboxingInProgress = false;
  };
  root.MysteryBoxArt = function (tier, open) { var p = boxPic(String(tier || 'WOODEN').toUpperCase(), !!open); return '<img src="' + p.src + '" alt="" draggable="false" style="width:120px;height:120px;object-fit:contain;filter:' + p.filter + ' drop-shadow(0 10px 10px rgba(0,0,0,.45))">'; };
  /* the old big button and chest click both lead to the new taps */
  Ctrl.triggerOpenSequence = function () { this.tapBox(); };
  /* the store passes onClose; the old modal only knew onComplete */
  var origOpen = Ctrl.openUnboxing;
  Ctrl.openUnboxing = function (boxId, studentId, options) {
    options = options || {};
    if (!options.onComplete && options.onClose) options.onComplete = options.onClose;
    return origOpen.call(this, boxId, studentId, options);
  };
})(typeof window !== 'undefined' ? window : this);
