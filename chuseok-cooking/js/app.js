/* Chuseok Week 2 cooking homework: pick your name, pick a dish, write three short answers, send.
   Drafts are saved on this device only. The finished homework and the photo or video go to the teacher's Google Sheet and Drive. */
(function () {
  'use strict';
  var D = window.CookHW, CFG = D.CFG, A = window.CookAudio;
  var st = { cls: '3A', name: '', dish: '', ans: { made: '', how: '', taste: '' }, file: null, sent: false, busy: false };
  var MAX_VIDEO = 12 * 1024 * 1024;   // bigger videos do not travel reliably from a phone, a photo is better
  var app = document.getElementById('app'), refs = {};

  function h(t, a, kids) {
    var e = document.createElement(t), k; a = a || {};
    for (k in a) {
      if (k === 'class') e.className = a[k]; else if (k === 'text') e.textContent = a[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '-'); }
  function key() { return 'eaa_cook_w2_' + slug(st.name); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage may be blocked */ } }
  function saveDraft() { if (st.name) lsSet(key(), JSON.stringify({ cls: st.cls, dish: st.dish, ans: st.ans, sent: st.sent })); }
  function loadDraft() {
    st.dish = ''; st.ans = { made: '', how: '', taste: '' }; st.file = null; st.sent = false;
    var raw = st.name ? lsGet(key()) : null; if (!raw) return;
    try {
      var d = JSON.parse(raw);
      st.dish = d.dish || ''; st.sent = !!d.sent;
      ['made', 'how', 'taste'].forEach(function (b) { st.ans[b] = String((d.ans && d.ans[b]) || ''); });
    } catch (e) { /* ignore a broken draft */ }
  }
  function recipe(id) { return D.RECIPES.filter(function (r) { return r.id === id; })[0] || null; }

  /* photo or short video, picked right here and sent to the teacher with the homework */
  function readAsDataUrl(file) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result)); }; r.onerror = rej; r.readAsDataURL(file); }); }
  function shrinkPhoto(file) {
    return readAsDataUrl(file).then(function (url) {
      return new Promise(function (res, rej) {
        var im = new Image();
        im.onload = function () {
          var k = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k));
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.82));
        };
        im.onerror = rej; im.src = url;
      });
    });
  }
  function pickFile(input) {
    var f = input.files && input.files[0]; if (!f) return;
    refs.fileTxt.textContent = 'Getting your file ready...'; st.file = null;
    var isVideo = /^video\//.test(f.type), isImage = /^image\//.test(f.type);
    if (!isVideo && !isImage) { nudge('Please choose a photo or a video.'); refs.fileTxt.textContent = ''; return; }
    if (isVideo && f.size > MAX_VIDEO) { nudge('This video is too big. Please choose a photo, or a shorter video.'); refs.fileTxt.textContent = ''; return; }
    (isVideo ? readAsDataUrl(f) : shrinkPhoto(f)).then(function (url) {
      var mime = isVideo ? (f.type || 'video/mp4') : 'image/jpeg', ext = isVideo ? ((f.name.match(/\.(\w{2,4})$/) || [])[1] || 'mp4') : 'jpg';
      st.file = { mime: mime, ext: ext, data: url.slice(url.indexOf(',') + 1), isImage: isImage, preview: isImage ? url : '' };
      refs.fileTxt.textContent = '✅ Ready: ' + (isVideo ? 'video' : 'photo') + ' ' + f.name.slice(0, 40);
      refs.thumb.src = st.file.preview; refs.thumb.style.display = isImage ? 'block' : 'none';
      A.tap();
    }).catch(function () { refs.fileTxt.textContent = ''; nudge('I could not read that file. Please try another one.'); });
  }

  function build() {
    var chips = [h('span', { class: 'chip', text: 'Grade 3 · Week 2' }), h('span', { class: 'chip', text: '3A and 3B' }), h('span', { class: 'chip xp', text: '⭐ ' + CFG.xp + ' XP' })];
    if (CFG.due) chips.push(h('span', { class: 'chip due', text: '📅 Due: ' + CFG.due }));
    app.appendChild(h('section', { class: 'card hero' }, [h('div', { class: 'moon', text: '🌕' }), h('h1', { text: 'Chuseok Cooking & Treats (추석)' }), h('p', { text: 'Cook a Chuseok treat with your family. Write about it. Send it to your teacher!' }), h('div', { class: 'chips' }, chips)]));
    app.appendChild(h('section', { class: 'card safety' }, [h('div', { class: 'ic', text: '🔪🔥' }), h('div', {}, [h('b', { text: 'No cooking alone!' }), h('span', { text: 'An adult helps with knives and heat.' })])]));
    app.appendChild(h('section', { class: 'card' }, [h('h2', { text: '🏠 Your mission' }), h('ol', { class: 'mission' }, [
      h('li', { text: 'Choose ONE dish below.' }), h('li', { text: 'Cook it with an adult.' }), h('li', { text: 'Take a photo or a short video of your dish.' }), h('li', { text: 'Write 3 short answers, add your photo (or upload it on K12) and send.' })])]));

    /* who are you */
    refs.tabs = h('div', { class: 'tabs' }, Object.keys(D.ROSTERS).map(function (c) {
      return h('button', { type: 'button', class: 'tab', 'data-c': c, text: 'Class ' + c + ' (' + D.ROSTERS[c].length + ')', onclick: function () { A.tap(); st.cls = c; st.name = ''; loadDraft(); fillNames(); refresh(); } });
    }));
    refs.sel = h('select', { 'aria-label': 'Choose your name', autocomplete: 'off', onchange: function () { A.tap(); st.name = this.value; if (st.name) lsSet('eaa_cook_w2_last', JSON.stringify({ cls: st.cls, name: st.name })); loadDraft(); refresh(); } });
    app.appendChild(h('section', { class: 'card' }, [h('h2', { text: '👤 Who are you?' }), refs.tabs, refs.sel, h('p', { class: 'hint', text: 'Your answers are saved on this device while you write.' })]));

    /* recipes */
    app.appendChild(h('p', { class: 'hint', style: 'margin:0 4px', text: 'Pick the dish you like. You only need to make one.' }));
    refs.recipes = {};
    D.RECIPES.forEach(function (r) {
      var btn = h('button', { type: 'button', class: 'btn choose', onclick: function () { A.tap(); st.dish = r.id; saveDraft(); refresh(); A.speak('I make ' + r.n + '.'); } });
      var card = h('section', { class: 'card recipe', style: '--c:' + r.color }, [
        h('div', { class: 'rh' }, [h('div', { class: 'pic' }, [r.pic ? h('img', { src: r.pic, alt: r.n }) : h('span', { text: r.e })]), h('div', {}, [h('h3', { text: r.n }), h('small', { text: r.kr }), h('span', { class: 'lvl ' + r.lc, text: r.level })])]),
        h('div', { class: 'need' }, [h('b', { text: 'You need: ' }), r.need]),
        h('ol', { class: 'rsteps' }, r.steps.map(function (s) { return h('li', { class: s.adult ? 'adult' : '' }, [h('span', { text: s.t })]); })),
        r.video ? h('a', { class: 'btn amber watch', href: r.video, target: '_blank', rel: 'noopener', text: r.videoLabel || '▶ Watch how to make it' }) : null,
        btn
      ]);
      refs.recipes[r.id] = { card: card, btn: btn }; app.appendChild(card);
    });

    /* the form */
    refs.dishTxt = h('p', { class: 'hint', style: 'font-weight:700;font-size:1.05rem;color:#a7f3d0' });
    refs.boxes = {};
    var form = h('section', { class: 'card' }, [h('h2', { text: '✍️ Write about your cooking' }), refs.dishTxt]);
    D.BOXES.forEach(function (b) {
      var ta = h('textarea', { placeholder: b.ph, maxlength: '600', 'aria-label': b.title, oninput: function () { st.ans[b.id] = this.value; saveDraft(); } });
      var starters = h('div', { class: 'starters' }, b.starters.map(function (s) {
        return h('button', { type: 'button', class: 'starter', text: s, onclick: function () { A.tap(); ta.value = (ta.value ? ta.value.replace(/\s*$/, ' ') : '') + s.replace(/ \.\.\.$/, ' '); st.ans[b.id] = ta.value; saveDraft(); ta.focus(); } });
      }));
      refs.boxes[b.id] = ta;
      form.appendChild(h('div', { class: 'box' }, [h('h3', { text: b.icon + ' ' + b.title }), h('p', { text: b.ask }), starters, ta]));
    });
    refs.fileInput = h('input', { type: 'file', accept: 'image/*,video/*', style: 'display:none', onchange: function () { pickFile(this); } });
    refs.fileTxt = h('p', { class: 'hint', style: 'text-align:center;font-weight:700' });
    refs.thumb = h('img', { alt: 'My photo', style: 'display:none;max-width:220px;max-height:220px;margin:10px auto 0;border-radius:16px;border:3px solid #10b981' });
    form.appendChild(h('div', { class: 'box' }, [h('h3', { text: '📷 4. My photo or short video' }), h('p', { text: 'Show your dish! Add a photo here, or upload it on the school K12 site.' }),
      h('div', { class: 'cta', style: 'margin:0' }, [h('button', { type: 'button', class: 'btn amber', text: '📷 Add my photo or video', onclick: function () { A.tap(); refs.fileInput.click(); } })]), refs.fileInput, refs.fileTxt, refs.thumb]));
    refs.msg = h('p', { class: 'msg', role: 'status' });
    refs.send = h('button', { type: 'button', class: 'btn big', onclick: send, text: '🚀 Send my homework & claim +' + CFG.xp + ' XP' });
    form.appendChild(refs.msg); form.appendChild(refs.send);
    refs.form = form; app.appendChild(form);
    app.appendChild(h('p', { class: 'foot', text: 'English Adventure Academy · Grade 3 · Chuseok Week 2' }));

    refs.modalText = h('p', { style: 'font-size:1.1rem;font-weight:700' });
    refs.modal = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, [h('div', { class: 'card' }, [
      h('div', { class: 'big', text: '🎉' }), h('h2', { text: 'Well done, chef!' }), refs.modalText,
      h('p', { class: 'hint', text: 'Your teacher will check it and add your ' + CFG.xp + ' XP.' }),
      h('button', { type: 'button', class: 'btn amber', style: 'margin-top:12px', text: 'Awesome! 🚀', onclick: function () { A.tap(); refs.modal.classList.remove('show'); } })])]);
    document.body.appendChild(refs.modal);
  }

  function fillNames() {
    refs.sel.innerHTML = '';
    refs.sel.appendChild(h('option', { value: '', text: '-- Choose your name --' }));
    D.ROSTERS[st.cls].forEach(function (n) { var o = h('option', { value: n, text: n }); if (n === st.name) o.selected = true; refs.sel.appendChild(o); });
  }
  function refresh() {
    Array.prototype.forEach.call(refs.tabs.children, function (b) { b.classList.toggle('on', b.getAttribute('data-c') === st.cls); });
    refs.sel.value = st.name;
    D.RECIPES.forEach(function (r) {
      var on = st.dish === r.id, x = refs.recipes[r.id];
      x.card.classList.toggle('chosen', on);
      x.btn.textContent = on ? '✅ I made this one!' : '🍳 I made this one';
      x.btn.className = 'btn choose' + (on ? '' : ' slate');
    });
    var r = recipe(st.dish);
    refs.dishTxt.textContent = r ? ('My dish: ' + r.e + ' ' + r.n) : 'Choose your dish above first.';
    D.BOXES.forEach(function (b) { refs.boxes[b.id].value = st.ans[b.id] || ''; });
        refs.send.textContent = st.sent ? '✅ Sent! Send again if you changed something' : '🚀 Send my homework & claim +' + CFG.xp + ' XP';
    refs.msg.textContent = '';
    if (refs.fileTxt) { refs.fileTxt.textContent = st.file ? refs.fileTxt.textContent : ''; if (!st.file) { refs.thumb.style.display = 'none'; refs.fileInput.value = ''; } }
  }

  /* friendly nudge: a gentle wobble and a soft chime, nothing is taken away */
  function nudge(text) {
    refs.msg.textContent = text; refs.form.classList.remove('wob'); void refs.form.offsetWidth; refs.form.classList.add('wob');
    A.soft(); A.speak(text);
  }
  function send() {
    if (st.busy) return;
    if (!st.name) { nudge('Please choose your name first.'); return; }
    if (!st.dish) { nudge('Please choose the dish you made.'); return; }
    var short = D.BOXES.filter(function (b) { return String(st.ans[b.id] || '').trim().length < 12; })[0];
    if (short) { nudge('Please write a little more in box ' + short.title.charAt(0) + '. Use the yellow starters to help you.'); return; }
    st.busy = true; refs.send.disabled = true; refs.send.textContent = 'Sending...';
    var r = recipe(st.dish), payload = {
      token: CFG.token, homework: CFG.homework, className: 'Class ' + st.cls, studentName: st.name, dish: r.n,
      made: st.ans.made.trim(), how: st.ans.how.trim(), taste: st.ans.taste.trim(), photoSent: !!st.file, xp: CFG.xp
    };
    if (st.file) payload.file = { name: st.cls + ' - ' + st.name + ' - ' + r.n + '.' + st.file.ext, mime: st.file.mime, data: st.file.data };
    function done() {
      st.busy = false; refs.send.disabled = false; st.sent = true; st.file = null; saveDraft(); refresh();
      A.win(); A.speak('Great job, ' + st.name.split(' ')[0] + '!');
      refs.modalText.textContent = 'Great job, ' + st.name.split(' ')[0] + '! Your ' + r.n + ' homework was sent to your teacher.';
      refs.modal.classList.add('show');
    }
    var ctl = typeof AbortController === 'function' ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, payload.file ? 60000 : 6000);
    if (!/^https:\/\//i.test(String(CFG.submitUrl || ''))) { clearTimeout(timer); setTimeout(done, 400); return; }
    fetch(CFG.submitUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), mode: 'no-cors', signal: ctl ? ctl.signal : undefined })
      .then(function () { clearTimeout(timer); done(); })
      .catch(function () { clearTimeout(timer); done(); });   /* never block a child; the answers stay saved on this device */
  }

  build();
  var last = null; try { last = JSON.parse(lsGet('eaa_cook_w2_last') || 'null'); } catch (e) { last = null; }
  if (last && D.ROSTERS[last.cls] && D.ROSTERS[last.cls].indexOf(last.name) >= 0) { st.cls = last.cls; st.name = last.name; loadDraft(); }
  fillNames(); refresh();
})();
