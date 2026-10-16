/* Unit 3 paper quiz results (Grade 3, Form B, 15 Oct 2026). Opens from the library card "Unit 3 Quiz Results".
   The data holds NO names: only the pupil's school number, the score out of 82, the bonus, the class and a flag for a missing page.
   Names come from the platform's own roster. Scores stay hidden until the teacher taps a card. XP goes through store.awardXP. */
(function (root) {
  'use strict';
  var DATA = {"229": [62.0, 5, "a", 0], "219": [55.0, 0, "a", 0], "224": [52.0, 0, "a", 0], "353": [46.0, 0, "b", 0], "354": [43.0, 3, "a", 0], "222": [40.0, 3, "a", 0], "213": [41.5, 0, "b", 0], "228": [41.0, 3, "b", 0], "206": [40.5, 3, "a", 0], "215": [38.0, 0, "b", 0], "352": [39.0, 0, "b", 0], "216": [36.5, 0, "b", 0], "211": [36.0, 5, "a", 0], "220": [34.0, 3, "b", 0], "207": [31.0, 0, "a", 0], "209": [34.0, 3, "a", 0], "201": [29.5, 3, "b", 0], "217": [26.0, 3, "b", 0], "200": [30.5, 3, "b", 0], "202": [28.0, 0, "a", 0], "205": [27.0, 0, "b", 0], "351": [25.0, 0, "a", 0], "212": [26.0, 0, "b", 0], "214": [23.5, 0, "a", 0], "203": [22.5, 3, "a", 0], "204": [22.0, 0, "a", 0], "221": [20.0, 3, "b", 1], "223": [19.5, 3, "a", 0], "218": [19.0, 0, "b", 0], "227": [27.5, 0, "a", 0], "230": [6.0, 0, "b", 0]};
  /* Grade 4 money quiz: school number -> [score out of 19 (listening + reading + writing), 1 if page 1 is missing, optional maximum when the pupil handed in only one page: then that page counts as 100%]. Speaking (0 to 6 coins) is added by the teacher on the card. */
  var DATA4 = {"319":[6.5,0],"310":[17.5,0],"300":[2.5,0],"341":[8.5,0],"314":[12,0],"317":[1.5,0,6],"342":[1.5,0,6],"345":[6.5,0],"321":[3,0],"311":[11,0],"1789469351603":[14,0],"312":[5,0],"343":[14.5,0],"320":[5.5,0],"315":[7,0],"302":[4,0]};
  /* The marks of each part (no names): Grade 3 = [game1 /15, match /12, snake /10, -ng /5, listening /12, poem table /8, car table /10, summary /10]; Grade 4 = [listening /6, reading /7, writing /6] (null = page not handed in). */
  var PARTS3 = {"221":[null,null,null,null,6,4,10,0],"229":[15.0,10.0,2.0,3.0,12.0,8.0,4.0,8.0],"219":[12.0,12.0,2.0,0.0,9.0,8.0,8.0,4.0],"224":[9.0,12.0,2.0,0.0,9.0,8.0,8.0,4.0],"353":[12.0,12.0,0.5,0.0,12.0,5.5,4.0,0.0],"354":[15.0,4.0,1.0,0.0,9.0,8.0,2.0,4.0],"222":[6.0,12.0,0.5,0.0,6.0,5.5,4.0,6.0],"213":[9.0,6.0,1.0,3.0,9.0,5.5,8.0,0.0],"228":[15.0,8.0,1.5,0.0,9.0,5.5,2.0,0.0],"206":[9.0,8.0,1.0,0.0,9.0,5.5,6.0,2.0],"215":[12.0,6.0,0.5,0.0,9.0,2.5,8.0,0.0],"352":[15.0,6.0,1.5,0.0,9.0,5.5,2.0,0.0],"216":[12.0,4.0,0.5,0.0,12.0,4.0,4.0,0.0],"211":[6.0,2.0,5.0,0.0,9.0,8.0,6.0,0.0],"220":[9.0,4.0,1.5,0.0,9.0,2.5,4.0,4.0],"207":[9.0,4.0,0.5,0.0,9.0,2.5,4.0,2.0],"209":[6.0,6.0,0.5,0.0,9.0,6.5,2.0,4.0],"201":[6.0,8.0,0.5,0.0,9.0,4.0,0.0,2.0],"217":[9.0,4.0,0.5,0.0,9.0,1.5,2.0,0.0],"200":[6.0,10.0,1.5,0.0,3.0,4.0,4.0,2.0],"202":[15.0,6.0,0.0,0.0,3.0,0.0,4.0,0.0],"205":[9.0,8.0,1.5,0.0,0.0,2.5,6.0,0.0],"351":[6.0,4.0,1.5,0.0,6.0,5.5,0.0,2.0],"212":[9.0,0.0,1.5,0.0,9.0,2.5,0.0,4.0],"214":[9.0,0.0,0.5,0.0,6.0,0.0,4.0,4.0],"203":[9.0,2.0,0.0,0.0,6.0,1.5,4.0,0.0],"204":[12.0,0.0,1.0,0.0,3.0,4.0,2.0,0.0],"223":[9.0,2.0,0.5,2.0,6.0,0.0,0.0,0.0],"218":[6.0,0.0,1.5,0.0,9.0,2.5,0.0,0.0],"227":[15.0,0.0,1.0,0.0,9.0,2.5,0.0,0.0],"230":[0.0,0.0,0.0,0.0,6.0,0.0,0.0,0.0]};
  var PARTS4 = {"319":[3.5,3.0,0.0],"310":[4.5,7.0,6.0],"300":[2.5,0.0,0.0],"341":[3.5,2.0,3.0],"314":[4.0,6.0,2.0],"317":[null,null,1.5],"342":[null,null,1.5],"345":[4.0,0.5,2.0],"321":[2.0,0.0,1.0],"311":[4.5,3.5,3.0],"1789469351603":[4.0,6.5,3.5],"312":[2.0,0.5,2.5],"343":[4.5,5.0,5.0],"320":[1.5,0.5,3.5],"315":[1.5,2.0,3.5],"302":[1.5,2.0,0.5]};
  var G = '3', R3 = 'Unit 3 paper quiz (It Keeps Changing)', R4 = 'Unit 3 paper quiz (How Much Is It)';
  function reason() { return G === '4' ? R4 : R3; }
  var cls = 'a', box = null, SPK = {};
  try { SPK = JSON.parse(localStorage.getItem('qr-speaking-v1') || '{}') || {}; } catch (e) { SPK = {}; }
  function saveSpk() { try { localStorage.setItem('qr-speaking-v1', JSON.stringify(SPK)); } catch (e) {} }
  function store() { return root.schoolStore; }
  function pupils(c) {
    var s = store(); if (!s) return [];
    return s.getStudents('class-' + G + c).map(function (st) {
      var m = /(\d+)$/.exec(String(st.id)), num = m ? m[1] : '', d = G === '4' ? DATA4[num] : DATA[num];
      return { st: st, num: num, d: d || null };
    });
  }
  function xpFor(d, sp) { return d ? 30 + Math.round((sp ? (d[0] + sp) / 92 * 100 : d[0]) + d[1]) : 0; }
  function given(st) {
    var tx = (store().state.xpTransactions || []).concat(st.xpHistory || []);
    return tx.some(function (t) { return t && String(t.reason || '').indexOf(reason()) === 0 && (!t.studentId || t.studentId === st.id) && t.status !== 'voided'; });
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
      '.qr-xp{width:64px;text-align:center;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#fff;padding:4px;font-weight:700}.qr-sp{margin:4px 0;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#cbd5e1;padding:3px 6px;font-size:.78rem}.qr-done{color:#10b981;font-weight:800;margin-top:6px}';
    document.head.appendChild(s);
  }
  function stars(p) { var v = p >= 75 ? 3 : p >= 50 ? 2 : 1, o = ''; while (v--) o += '⭐'; return o; }
  function render() {
    var list = pupils(cls);
    var cards = list.map(function (p) {
      var st = p.st, d = p.d, name = esc(st.firstName || String(st.name || '').split(' ')[0] || 'Pupil');
      if (!d) return '<div class="qr-card"><div class="qr-nm">' + name + '</div><div class="qr-note">No quiz sheet</div></div>';
      if (G === '4') {
        var k4 = '4-' + p.num, has4 = SPK[k4] != null, sp4 = has4 ? +SPK[k4] : 0, tot4 = d[0] + sp4, max4 = (d[2] || 19) + (has4 ? 6 : 0), pc4 = Math.min(100, Math.round(tot4 / max4 * 100)), g4 = given(st);
        var sel4 = '<select class="qr-sp" onchange="QuizResults.speak(\'' + k4 + '\',this.value)"><option value="">Speaking: not yet</option>' + [0, 1, 2, 3, 4, 5, 6].map(function (n) { return '<option value="' + n + '"' + (has4 && sp4 === n ? ' selected' : '') + '>' + n + ' / 6 coins</option>'; }).join('') + '</select>';
        return '<div class="qr-card"><div class="qr-nm">' + name + '</div>' +
          '<div class="qr-score qr-hid" data-s="' + tot4 + '" data-m="' + max4 + '" data-b="0" data-p="' + pc4 + '" onclick="QuizResults.reveal(this)">Tap to see 👀</div>' + sel4 +
          '<div class="qr-note">' + (d[1] ? 'page 1 missing' : d[2] ? 'only the writing page was handed in: it counts as 100%' : '') + '</div>' +
          (g4 ? '<div class="qr-done">✓ XP given</div>' : '<div style="margin-top:8px">+<input class="qr-xp" type="number" min="0" max="200" value="' + (30 + Math.round(tot4 / max4 * 70)) + '"> XP <button class="qr-btn go" style="padding:5px 10px" onclick="QuizResults.give(\'' + esc(st.id) + '\',this)">Give</button></div>') + '</div>';
      }
      var sp = SPK[p.num], hasSp = sp === 4 || sp === 7 || sp === 10, raw = d[0] + (hasSp ? sp : 0), tot = hasSp ? Math.round(raw / 92 * 1000) / 10 : raw, max = hasSp ? 100 : 82;
      var pct = Math.min(100, Math.round((tot + d[1]) / max * 100)), isGiven = given(st);
      var sel = '<select class="qr-sp" onchange="QuizResults.speak(\'' + p.num + '\',this.value)"><option value="">Speaking: not yet</option>' + [[10, 'Great 10'], [7, 'Good 7'], [4, 'Try 4']].map(function (o) { return '<option value="' + o[0] + '"' + (sp === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
      return '<div class="qr-card"><div class="qr-nm">' + name + '</div>' +
        '<div class="qr-score qr-hid" data-s="' + tot + '" data-m="' + max + '" data-b="' + d[1] + '" data-p="' + pct + '" onclick="QuizResults.reveal(this)">Tap to see 👀</div>' + sel +
        '<div class="qr-note">' + (d[3] ? 'page 1 missing' : '') + '</div>' +
        (isGiven ? '<div class="qr-done">✓ XP given</div>' :
          '<div style="margin-top:8px">+<input class="qr-xp" type="number" min="0" max="200" value="' + xpFor(d, hasSp ? sp : 0) + '"> XP <button class="qr-btn go" style="padding:5px 10px" onclick="QuizResults.give(\'' + esc(st.id) + '\',this)">Give</button></div>') + '</div>';
    }).join('');
    box.innerHTML = '<div class="qr-top"><div><h2>📄 Unit 3 Quiz Results (Grade ' + G + ')</h2><div class="qr-sub">' + (G === '4' ? 'Out of 19 (listening, reading, writing). Choose the speaking coins (0 to 6) on a card and the total becomes out of 25.' : 'Out of 82 (no maze). Choose a speaking mark on a card and the total becomes out of 100 (maze not counted, scaled). Bonus is extra.') + ' Tap a card to show the result, then give XP.</div></div></div>' +
      '<div class="qr-top"><button class="qr-btn' + (cls === 'a' ? '' : ' off') + '" onclick="QuizResults.cls(\'a\')">' + G + '-A</button>' + (G === '3' ? '<button class="qr-btn' + (cls === 'b' ? '' : ' off') + '" onclick="QuizResults.cls(\'b\')">3-B</button>' : '') +
      '<button class="qr-btn off" onclick="QuizResults.revealAll()">Show all</button><button class="qr-btn go" title="Build the 4 skills of every pupil and save them to the reports" onclick="QuizResults.skills()">🧩 4 skills → reports</button><button class="qr-btn off" onclick="QuizResults.hideAll()">Hide all</button><button class="qr-btn off" style="margin-left:auto" onclick="QuizResults.close()">Close ✕</button></div>' +
      '<div class="qr-grid">' + (cards || '<div>No pupils found</div>') + '</div>';
  }
  /* For the Command Center: the quiz result of one pupil, or null (no sheet, or page 1 missing). pct counts the speaking mark when the teacher entered it. */
  function scoreOf(studentId) {
    var s = store(), st = s && s.getStudent(studentId); if (!st) return null;
    var g = /class-(\d)/.exec(String(st.classId || '')), m = /(\d+)$/.exec(String(studentId)); if (!g || !m) return null;
    var num = m[1], d;
    if (g[1] === '4') {
      d = DATA4[num]; if (!d || d[1]) return null;
      var k4 = '4-' + num, h4 = SPK[k4] != null, t4 = d[0] + (h4 ? +SPK[k4] : 0), x4 = (d[2] || 19) + (h4 ? 6 : 0);
      return { pct: Math.round(t4 / x4 * 100), text: t4 + '/' + x4, speaking: h4 };
    }
    d = DATA[num]; if (!d || d[3]) return null;
    var sp = SPK[num], hs = sp === 4 || sp === 7 || sp === 10, raw = d[0] + (hs ? sp : 0), mx = hs ? 92 : 82;
    return { pct: Math.round(raw / mx * 100), text: (hs ? Math.round(raw / 92 * 1000) / 10 + '/100' : raw + '/82'), speaking: hs };
  }
  /* For the pupil profile: the quiz title, total and every part with its maximum. */
  function detailOf(studentId) {
    var sc = scoreOf(studentId), s = store(), st = s && s.getStudent(studentId); if (!st) return null;
    var g = /class-(\d)/.exec(String(st.classId || '')), m = /(\d+)$/.exec(String(studentId)); if (!g || !m) return null;
    var num = m[1];
    if (g[1] === '4') {
      var a = PARTS4[num]; if (!a) return null;
      var L = [['Listening', 6], ['Reading', 7], ['Writing', 6]];
      var k4s = '4-' + num, sp4 = SPK[k4s] != null ? { score: +SPK[k4s], max: 6 } : null;
      return { title: 'Unit 3 money quiz', grade: 4, spk: sp4, text: sc ? sc.text : '', pct: sc ? sc.pct : null, speaking: sc ? sc.speaking : false, bonus: 0,
        parts: L.map(function (l, i) { return { label: l[0], score: a[i], max: l[1] }; }).filter(function (x) { return x.score != null; }),
        note: DATA4[num] && DATA4[num][2] ? 'Only the writing page was handed in: it counts as 100%.' : '' };
    }
    var b = PARTS3[num]; if (!b) return null;
    var only2 = !!(DATA[num] && DATA[num][3]);
    var L3 = [['Ice-bridge stones', 15], ['Word match', 12], ['Snake', 10], ['-ng sound', 5], ['Listening', 12], ['Poem table', 8], ['Car table', 10], ['Reading summary', 10]];
    var spv = SPK[num], sp3 = (spv === 4 || spv === 7 || spv === 10) ? { score: spv, max: 10 } : null;
    return { title: 'Unit 3 quiz: It Keeps Changing', grade: 3, spk: sp3, text: sc ? sc.text : '', pct: sc ? sc.pct : null, speaking: sc ? sc.speaking : false, bonus: DATA[num] ? DATA[num][1] : 0,
      parts: L3.map(function (l, i) { return { label: l[0], score: b[i], max: l[1] }; }).filter(function (x) { return x.score != null; }), note: only2 ? 'Only page 2 was handed in (page 1 is missing), so there is no total.' : '' };
  }
  var Q = root.QuizResults = {
    skills: function () { if (root.QuizSkills) root.QuizSkills.open(G, cls); },
    detailOf: detailOf,
    scoreOf: scoreOf,
    open: function (c, g) { css(); G = g === '4' ? '4' : '3'; cls = c || 'a'; if (!box) { box = document.createElement('div'); box.id = 'qr-box'; document.body.appendChild(box); } box.style.display = 'block'; render(); },
    close: function () { if (box) box.style.display = 'none'; },
    cls: function (c) { cls = c; render(); },
    reveal: function (el) { var s = +el.dataset.s, b = +el.dataset.b; el.classList.remove('qr-hid'); el.removeAttribute('onclick'); el.style.cursor = 'default'; el.innerHTML = s + '<small style="font-size:.9rem"> / ' + el.dataset.m + '</small>' + (b ? '<div style="font-size:.9rem;color:#38bdf8">+' + b + ' bonus</div>' : '') + '<div>' + stars(+el.dataset.p) + '</div>'; },
    revealAll: function () { [].slice.call(box.querySelectorAll('.qr-hid')).forEach(Q.reveal); },
    hideAll: function () { render(); },
    speak: function (num, v) { if (String(num).indexOf('4-') === 0) { if (v === '') delete SPK[num]; else SPK[num] = parseInt(v, 10); } else { v = parseInt(v, 10); if (v) SPK[num] = v; else delete SPK[num]; } saveSpk(); render(); },
    give: function (id, btn) {
      var s = store(), st = s && s.getStudent(id); if (!st || given(st)) return;
      var card = btn.closest('.qr-card'), v = Math.max(0, Math.min(200, parseInt(card.querySelector('.qr-xp').value, 10) || 0));
      if (!v) return; btn.disabled = true;
      s.awardXP(id, v, 'participation', reason());
      card.querySelector('.qr-xp').parentNode.outerHTML = '<div class="qr-done">✓ +' + v + ' XP given</div>';
    }
  };
})(typeof window !== 'undefined' ? window : this);
