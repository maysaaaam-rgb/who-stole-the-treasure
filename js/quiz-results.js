/* Unit 3 paper quiz results (Grade 3, Form B, 15 Oct 2026). Opens from the library card "Unit 3 Quiz Results".
   The data holds NO names: only the pupil's school number, the score out of 82, the bonus, the class and a flag for a missing page.
   Names come from the platform's own roster. Scores stay hidden until the teacher taps a card. XP goes through store.awardXP. */
(function (root) {
  'use strict';
  var DATA = {"229": [62.0, 5, "a", 0], "219": [55.0, 0, "a", 0], "224": [52.0, 0, "a", 0], "353": [46.0, 0, "b", 0], "354": [43.0, 3, "a", 0], "222": [40.0, 3, "a", 0], "213": [41.5, 0, "b", 0], "228": [41.0, 3, "b", 0], "206": [40.5, 3, "a", 0], "215": [38.0, 0, "b", 0], "352": [39.0, 0, "b", 0], "216": [36.5, 0, "b", 0], "211": [36.0, 5, "a", 0], "220": [34.0, 3, "b", 0], "207": [31.0, 0, "a", 0], "209": [34.0, 3, "a", 0], "201": [29.5, 3, "b", 0], "217": [26.0, 3, "b", 0], "200": [30.5, 3, "b", 0], "202": [28.0, 0, "a", 0], "205": [27.0, 0, "b", 0], "351": [25.0, 0, "a", 0], "212": [26.0, 0, "b", 0], "214": [23.5, 0, "a", 0], "203": [22.5, 3, "a", 0], "204": [22.0, 0, "a", 0], "221": [20.0, 3, "b", 1], "223": [19.5, 3, "a", 0], "218": [19.0, 0, "b", 0], "227": [27.5, 0, "a", 0], "230": [6.0, 0, "b", 0]};
  var REASON = 'Unit 3 paper quiz (It Keeps Changing)';
  var cls = 'a', box = null;
  function store() { return root.schoolStore; }
  function pupils(c) {
    var s = store(); if (!s) return [];
    return s.getStudents('class-3' + c).map(function (st) {
      var m = /(\d+)$/.exec(String(st.id)), num = m ? m[1] : '', d = DATA[num];
      return { st: st, num: num, d: d || null };
    });
  }
  function xpFor(d) { return d ? 30 + Math.round(d[0] + d[1]) : 0; }
  function given(st) {
    var tx = (store().state.xpTransactions || []).concat(st.xpHistory || []);
    return tx.some(function (t) { return t && String(t.reason || '').indexOf(REASON) === 0 && (!t.studentId || t.studentId === st.id) && t.status !== 'voided'; });
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function css() {
    if (document.getElementById('qr-css')) return;
    var s = document.createElement('style'); s.id = 'qr-css';
    s.textContent = '#qr-box{position:fixed;inset:0;z-index:99999;background:rgba(6,9,17,.94);overflow:auto;padding:18px;font-family:inherit;color:#e8eefc}#qr-box h2{margin:0 0 4px;font-size:1.4rem}#qr-box .qr-sub{opacity:.75;margin-bottom:12px;font-size:.9rem}' +
      '.qr-top{display:flex;gap:8px;align-items:center;margin-bottom:14px;flex-wrap:wrap}.qr-btn{border:0;border-bottom:5px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;border-radius:12px;padding:8px 16px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
      '.qr-btn:active{transform:translateY(4px);border-bottom-width:1px}.qr-btn.off{background:#334155;border-bottom-color:#1e293b;color:#cbd5e1}.qr-btn.go{background:#10b981;border-bottom-color:#047857}.qr-btn:disabled{opacity:.5;cursor:default}' +
      '.qr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}.qr-card{background:rgba(15,23,42,.85);backdrop-filter:blur(14px);border-radius:16px;padding:12px;text-align:center;box-shadow:0 4px 20px -2px rgba(0,0,0,.4)}' +
      '.qr-nm{font-weight:800;margin-bottom:8px}.qr-score{font-size:2rem;font-weight:900;color:#f59e0b;min-height:2.6rem}.qr-hid{color:#64748b;cursor:pointer;font-size:1.1rem;padding-top:8px}.qr-note{font-size:.78rem;opacity:.7;min-height:1.1rem}' +
      '.qr-xp{width:64px;text-align:center;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#fff;padding:4px;font-weight:700}.qr-done{color:#10b981;font-weight:800;margin-top:6px}';
    document.head.appendChild(s);
  }
  function stars(p) { var v = p >= 75 ? 3 : p >= 50 ? 2 : 1, o = ''; while (v--) o += '⭐'; return o; }
  function render() {
    var list = pupils(cls);
    var cards = list.map(function (p) {
      var st = p.st, d = p.d, name = esc(st.firstName || String(st.name || '').split(' ')[0] || 'Pupil');
      if (!d) return '<div class="qr-card"><div class="qr-nm">' + name + '</div><div class="qr-note">No quiz sheet</div></div>';
      var pct = Math.min(100, Math.round((d[0] + d[1]) / 82 * 100)), isGiven = given(st);
      return '<div class="qr-card"><div class="qr-nm">' + name + '</div>' +
        '<div class="qr-score qr-hid" data-s="' + d[0] + '" data-b="' + d[1] + '" data-p="' + pct + '" onclick="QuizResults.reveal(this)">Tap to see 👀</div>' +
        '<div class="qr-note">' + (d[3] ? 'page 1 missing' : '') + '</div>' +
        (isGiven ? '<div class="qr-done">✓ XP given</div>' :
          '<div style="margin-top:8px">+<input class="qr-xp" type="number" min="0" max="200" value="' + xpFor(d) + '"> XP <button class="qr-btn go" style="padding:5px 10px" onclick="QuizResults.give(\'' + esc(st.id) + '\',this)">Give</button></div>') + '</div>';
    }).join('');
    box.innerHTML = '<div class="qr-top"><div><h2>📄 Unit 3 Quiz Results</h2><div class="qr-sub">Out of 82 (no maze or speaking), plus bonus. Tap a card to show the result, then give XP.</div></div></div>' +
      '<div class="qr-top"><button class="qr-btn' + (cls === 'a' ? '' : ' off') + '" onclick="QuizResults.cls(\'a\')">3-A</button><button class="qr-btn' + (cls === 'b' ? '' : ' off') + '" onclick="QuizResults.cls(\'b\')">3-B</button>' +
      '<button class="qr-btn off" onclick="QuizResults.revealAll()">Show all</button><button class="qr-btn off" onclick="QuizResults.hideAll()">Hide all</button><button class="qr-btn off" style="margin-left:auto" onclick="QuizResults.close()">Close ✕</button></div>' +
      '<div class="qr-grid">' + (cards || '<div>No pupils found</div>') + '</div>';
  }
  var Q = root.QuizResults = {
    open: function (c) { css(); cls = c || cls; if (!box) { box = document.createElement('div'); box.id = 'qr-box'; document.body.appendChild(box); } box.style.display = 'block'; render(); },
    close: function () { if (box) box.style.display = 'none'; },
    cls: function (c) { cls = c; render(); },
    reveal: function (el) { var s = +el.dataset.s, b = +el.dataset.b; el.classList.remove('qr-hid'); el.removeAttribute('onclick'); el.style.cursor = 'default'; el.innerHTML = s + '<small style="font-size:.9rem"> / 82</small>' + (b ? '<div style="font-size:.9rem;color:#38bdf8">+' + b + ' bonus</div>' : '') + '<div>' + stars(+el.dataset.p) + '</div>'; },
    revealAll: function () { [].slice.call(box.querySelectorAll('.qr-hid')).forEach(Q.reveal); },
    hideAll: function () { render(); },
    give: function (id, btn) {
      var s = store(), st = s && s.getStudent(id); if (!st || given(st)) return;
      var card = btn.closest('.qr-card'), v = Math.max(0, Math.min(200, parseInt(card.querySelector('.qr-xp').value, 10) || 0));
      if (!v) return; btn.disabled = true;
      s.awardXP(id, v, 'participation', REASON);
      card.querySelector('.qr-xp').parentNode.outerHTML = '<div class="qr-done">✓ +' + v + ' XP given</div>';
    }
  };
})(typeof window !== 'undefined' ? window : this);
