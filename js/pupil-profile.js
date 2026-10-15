/* Pupil profile: one dark page for the teacher (no tabs). Top: who, status + reason, quick actions. Then the numbers that matter (XP, quiz, homework,
   attendance), 30 days of XP, what to do next. Everything older (monster, assignments, notes, XP ledger ...) sits in folded sections that open on tap.
   The numbers come from CommandCenter.profileData, so the profile and the Command Center always agree. */
(function (root) {
  'use strict';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function css() {
    if (document.getElementById('pp-css')) return;
    var s = document.createElement('style'); s.id = 'pp-css';
    s.textContent =
      '.pp-dlg{max-width:980px!important;width:min(980px,96vw);max-height:92vh;overflow-y:auto;background:#0b0e16!important;color:#e6e8ee;border:1px solid #232a3d!important;border-radius:20px!important;padding:20px!important;font-family:Inter,system-ui,sans-serif}' +
      '.pp-dlg{color-scheme:dark}.pp-dlg .modal-close-btn{background:#1b2234!important;color:#e6e8ee!important;border:1px solid #2a3350!important;border-radius:999px;width:34px;height:34px;z-index:5}' +
      '.pp-head{display:flex;gap:18px;align-items:center;flex-wrap:wrap;background:rgba(15,23,42,.85);backdrop-filter:blur(14px);border:1px solid #232a3d;border-radius:18px;padding:16px;box-shadow:0 4px 20px -2px rgba(0,0,0,.4)}' +
      '.pp-mon{width:104px;height:104px;border-radius:16px;background:#060911;border:1px solid #232a3d;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;overflow:hidden}.pp-mon img{width:100%;height:100%;object-fit:contain}' +
      '.pp-id{flex:1;min-width:240px}.pp-id h2{margin:0;font-size:1.5rem;font-weight:900;color:#fff}.pp-sub{color:#8b94a8;font-size:.82rem;margin-top:3px}' +
      '.pp-st{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px}.pp-chip{font-weight:800;font-size:.8rem;padding:4px 12px;border-radius:999px}.pp-why{color:#b6bdd0;font-size:.85rem}' +
      '.pp-t0{background:#1d2450;color:#a5b4fc}.pp-t1{background:#10291f;color:#34d399}.pp-t2{background:#2e2410;color:#fbbf24}.pp-t3{background:#2f1519;color:#f87171}.pp-t4{background:#1b1e2a;color:#9aa3b8}' +
      '.pp-act{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}' +
      '.pp-b{border:0;border-bottom:4px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;font-size:.8rem;border-radius:10px;padding:7px 12px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
      '.pp-b:active{transform:translateY(3px);border-bottom-width:1px}.pp-b.g{background:#10b981;border-bottom-color:#047857}.pp-b.o{background:#273045;border-bottom-color:#161c2b;color:#dbe3f5}' +
      '.pp-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(138px,1fr));gap:10px;margin:14px 0}' +
      '.pp-k{background:rgba(15,23,42,.85);border:1px solid #232a3d;border-radius:14px;padding:12px}.pp-k small{display:block;color:#8b94a8;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;font-weight:700}' +
      '.pp-k b{display:block;font-size:1.5rem;font-weight:900;margin-top:4px;color:#fff}.pp-k em{display:block;font-style:normal;color:#8b94a8;font-size:.74rem;margin-top:2px}.pp-k.bad b{color:#f87171}.pp-k.ok b{color:#34d399}.pp-k.mid b{color:#fbbf24}' +
      '.pp-bar{height:8px;border-radius:5px;background:#1b2234;overflow:hidden;margin-top:8px}.pp-bar i{display:block;height:100%;background:linear-gradient(90deg,#3b82f6,#8b5cf6)}' +
      '.pp-card{background:rgba(15,23,42,.85);border:1px solid #232a3d;border-radius:16px;padding:14px 16px;margin-bottom:12px}.pp-card h3{margin:0 0 10px;font-size:.95rem;font-weight:800;color:#fff}' +
      '.pp-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:760px){.pp-2{grid-template-columns:1fr}}' +
      '.pp-bars{display:flex;align-items:flex-end;gap:2px;height:120px}.pp-bars>div{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:2px;min-width:0}' +
      '.pp-bars b{font-size:8.5px;color:#aab1c3;height:11px}.pp-bars i{display:block;width:100%;border-radius:3px 3px 0 0;background:linear-gradient(180deg,#818cf8,#4f46e5)}.pp-bars i.we{opacity:.5}.pp-bars small{font-size:8.5px;color:#6b7387;height:12px}.pp-bars small.today{color:#a5b4fc;font-weight:800}' +
      '.pp-row{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid #1b2234;font-size:.86rem}.pp-row:last-child{border:0}' +
      '.pp-pill{font-weight:800;font-size:.76rem;padding:3px 10px;border-radius:999px}.pp-ok{background:#10291f;color:#34d399}.pp-mid{background:#2e2410;color:#fbbf24}.pp-no{background:#1b1e2a;color:#8b94a8}' +
      '.pp-tips{margin:0;padding-left:18px;color:#d3d9e8;font-size:.88rem;line-height:1.55}' +
      '.pp-warn{background:#2e2410;color:#fbbf24;border-radius:10px;padding:8px 12px;font-size:.82rem;margin-bottom:10px}' +
      '.pp-more{margin-top:6px}.pp-more details{background:rgba(15,23,42,.85);border:1px solid #232a3d;border-radius:14px;margin-bottom:8px;overflow:hidden}' +
      '.pp-more summary{cursor:pointer;padding:12px 16px;font-weight:800;font-size:.9rem;color:#dbe3f5;list-style:none;display:flex;justify-content:space-between}.pp-more summary::-webkit-details-marker{display:none}.pp-more summary:after{content:"▾";color:#6b7387}.pp-more details[open] summary:after{content:"▴"}' +
      '.pp-light{background:var(--bg-surface,#fff);color:var(--text-main,#0f172a);border-radius:12px;margin:0 12px 12px;padding:14px}' +
      '.pp-parts{display:grid;gap:7px}.pp-part{display:grid;grid-template-columns:130px 1fr 70px;gap:10px;align-items:center;font-size:.85rem}.pp-part b{text-align:right}.pp-pbar{height:9px;border-radius:5px;background:#1b2234;overflow:hidden}.pp-pbar i{display:block;height:100%;border-radius:5px}@media(max-width:520px){.pp-part{grid-template-columns:100px 1fr 60px}}' +
      '.pp-dim{color:#8b94a8}';
    document.head.appendChild(s);
  }
  function kpi(label, value, note, cls) { return '<div class="pp-k ' + (cls || '') + '"><small>' + label + '</small><b>' + value + '</b>' + (note ? '<em>' + note + '</em>' : '') + '</div>'; }

  /** The top of the page (everything above the folded sections). ctx: { monsterState, totalXP, attRate, hasAtt, archivedXP, avatar, onSheet } */
  function top(student, ctx) {
    css();
    var id = student.id, d = null;
    try { d = root.CommandCenter && root.CommandCenter.profileData ? root.CommandCenter.profileData(id, ctx.onSheet) : null; } catch (e) { d = null; }
    var ms = ctx.monsterState || {}, total = ctx.totalXP || 0;
    var toNext = ms.xpToNext > 0 ? (ms.xpToNext.toLocaleString('en-US') + ' XP to the next evolution') : (ms.isHatched === false ? 'Egg: ' + (ms.eggCrackPct || 0) + '% cracked' : 'Ultimate form');
    var stCls = d ? 'pp-' + d.statusCls.replace('cc-', '') : 'pp-t4';
    var html = '<div class="pp-head">' +
      '<div class="pp-mon" onclick="openMonsterCreator(\'' + esc(id) + '\')" title="Customize the monster">' + (ctx.avatar || '') + '</div>' +
      '<div class="pp-id"><h2>' + esc(student.firstName + ' ' + student.lastName) + '</h2>' +
        '<div class="pp-sub">' + esc(ms.stageName || ('Level ' + (ms.currentLevel || 1))) + ' · ' + esc(student.grade || '') + ' · Age ' + esc(student.age || '?') + ' · ' + esc(student.overallCefr || '') + ' · ID ' + esc(student.studentIdNumber || '') + '</div>' +
        (d ? '<div class="pp-st"><span class="pp-chip ' + stCls + '">' + esc(d.status) + '</span><span class="pp-why">' + esc(d.why.join(' · ')) + '</span></div>' : '') +
        '<div class="pp-act">' +
          '<button class="pp-b g" onclick="PupilProfile.award(\'' + esc(id) + '\',5)">+5 XP</button><button class="pp-b g" onclick="PupilProfile.award(\'' + esc(id) + '\',10)">+10 XP</button>' +
          '<button class="pp-b o" style="color:#fbbf24" onclick="CommandCenter.needsWork(\'' + esc(id) + '\')">⚠ Needs work</button>' +
          '<button class="pp-b" onclick="openGiveXPSkillsModal(\'student\',\'' + esc(id) + '\')">⭐ Custom XP</button>' +
          '<button class="pp-b o" onclick="openStudentModal(\'' + esc(id) + '\')">✏️ Edit pupil</button>' +
          '<button class="pp-b o" onclick="openMonsterCreator(\'' + esc(id) + '\')">🎨 Monster</button>' +
          '<button class="pp-b o" onclick="openEvolutionPathModal(\'' + esc(id) + '\')">🗺️ Evolution</button>' +
          '<button class="pp-b o" onclick="PupilCard.open(\'' + esc(id) + '\')">🃏 Card</button>' +
          '<button class="pp-b o" onclick="openReportGenerator(\'' + esc(id) + '\')">🖨️ Report</button>' +
          '<div class="card-more-menu-wrap" style="position:relative;"><button class="pp-b o" onclick="toggleCardDropdown(\'prof-' + esc(id) + '\', event)" title="More">⋯</button>' +
            '<div class="card-dropdown-menu" id="menu-prof-' + esc(id) + '">' +
              '<button class="card-dropdown-item" onclick="openEditStudentXPModal(\'' + esc(id) + '\')">✏️ Edit XP total</button>' +
              '<button class="card-dropdown-item" onclick="openMonsterFullscreenModal(\'' + esc(id) + '\')">✨ Monster fullscreen</button>' +
              '<button class="card-dropdown-item" onclick="handleRemoveStudentFromClass(\'' + esc(id) + '\')">Unenroll from class</button>' +
              '<button class="card-dropdown-item" style="color:var(--color-danger);" onclick="handleArchiveStudent(\'' + esc(id) + '\')">Archive pupil</button>' +
            '</div></div>' +
        '</div>' +
      '</div></div>';
    if (!d) return html + '<div class="pp-card" style="margin-top:12px"><span class="pp-dim">The Command Center numbers are not loaded, so only the basic profile is shown below.</span></div>';

    var qcls = d.q ? (d.qWeak ? 'bad' : d.q.pct >= 70 ? 'ok' : 'mid') : '';
    var hwDone = d.hw.filter(function (h) { return h.k === 'done'; }).length;
    var att = ctx.hasAtt ? ctx.attRate + '%' : '–';
    html += '<div class="pp-kpi">' +
      kpi('Total XP', total.toLocaleString('en-US'), esc(toNext) + '<div class="pp-bar"><i style="width:' + Math.max(2, ms.progressPct || 0) + '%"></i></div>') +
      kpi('This week', (d.last ? '+' + d.last : '0'), 'week before ' + (d.prev ? '+' + d.prev : '0') + ' · class typical ' + d.classMedXp, d.xpSlow ? 'bad' : '') +
      kpi('Last 30 days', '+' + d.month.toLocaleString('en-US'), d.active + ' active days · last XP ' + (d.since >= 999 ? 'never' : d.since === 0 ? 'today' : d.since + ' d ago')) +
      kpi('Unit 3 quiz', d.q ? d.q.pct + '%' : '–', d.q ? 'class average ' + d.quizAvg + '% · ' + esc(d.q.text) : 'no quiz sheet', qcls) +
      kpi('Homework', d.hwReady ? (d.hw.length ? hwDone + ' of ' + d.hw.length : '–') : '…', d.hwReady ? 'done (a started one counts)' : 'reading the Google Sheet') +
      kpi('Attendance', att, ctx.hasAtt ? 'all recorded days' : 'no roll call yet') + '</div>';

    var max = Math.max.apply(null, d.days.concat([1]));
    var bars = '<div class="pp-bars">' + d.days.map(function (v, i) {
      var l = d.labels[i];
      return '<div title="' + l.wd + ' ' + l.n + ' ' + l.mon + ': ' + v + ' XP"><b>' + (v || '') + '</b><i style="height:' + Math.max(v ? 8 : 2, Math.round(v / max * 100)) + '%"' + (l.weekend ? ' class="we"' : '') + '></i><small' + (l.today ? ' class="today"' : '') + '>' + l.n + '</small></div>';
    }).join('') + '</div>';
    var hw = d.hw.length ? d.hw.map(function (h) {
      var cl = h.k === 'done' ? 'ok' : (h.k === 'part' || h.k === 'open') ? 'mid' : 'no';
      return '<div class="pp-row"><span>' + esc(h.label) + (h.due ? ' <small class="pp-dim">due ' + esc(h.due) + '</small>' : '') + '</span><span class="pp-pill pp-' + cl + '">' + esc(h.say.charAt(0).toUpperCase() + h.say.slice(1)) + (h.rec ? ' · 🎤' : '') + '</span></div>';
    }).join('') : '<div class="pp-dim">No homework in the list for this class.</div>';
    var ws = d.ws && d.ws.length ? d.ws.map(function (w) { return '<div class="pp-row"><span>' + esc(w.name) + '</span><b>' + w.score + '/10</b></div>'; }).join('') : '<div class="pp-dim">No worksheet score entered yet.</div>';

    var qd = null; try { qd = root.QuizResults && root.QuizResults.detailOf ? root.QuizResults.detailOf(id) : null; } catch (e) { qd = null; }
    var quizCard = '';
    if (qd) {
      var best = null, worst = null;
      qd.parts.forEach(function (x) { x.r = x.max ? x.score / x.max : 0; if (!best || x.r > best.r) best = x; if (!worst || x.r < worst.r) worst = x; });
      quizCard = '<div class="pp-card"><h3>' + esc(qd.title) + (qd.pct != null ? ' · <span style="color:' + (d.qWeak ? '#f87171' : '#34d399') + '">' + qd.pct + '%</span> <span class="pp-dim" style="font-weight:600">(' + esc(qd.text) + (qd.speaking ? ', with speaking' : ', speaking not added yet') + (qd.bonus ? ' · +' + qd.bonus + ' bonus' : '') + ')</span>' : '') + '</h3>' +
        (qd.note ? '<div class="pp-dim" style="margin-bottom:8px;font-size:.8rem">' + esc(qd.note) + '</div>' : '') +
        '<div class="pp-parts">' + qd.parts.map(function (x) {
          var pc = Math.round(x.r * 100), col = pc >= 70 ? '#34d399' : pc >= 40 ? '#fbbf24' : '#f87171';
          return '<div class="pp-part"><span>' + esc(x.label) + '</span><div class="pp-pbar"><i style="width:' + Math.max(2, pc) + '%;background:' + col + '"></i></div><b>' + x.score + '<small class="pp-dim"> / ' + x.max + '</small></b></div>';
        }).join('') + '</div>' +
        (best && worst && best !== worst ? '<div class="pp-dim" style="margin-top:8px;font-size:.82rem">Strongest: <b style="color:#34d399">' + esc(best.label) + '</b> · Weakest: <b style="color:#f87171">' + esc(worst.label) + '</b></div>' : '') + '</div>';
    }
    var nwList = d.nw && d.nw.list ? d.nw.list.slice().sort(function (a, b) { return b.ts - a.ts; }) : [];
    var discCard = '<div class="pp-card"><h3>Discipline · last 2 weeks' + (nwList.length ? ' · <span style="color:' + (nwList.length >= 3 ? '#f87171' : '#fbbf24') + '">' + nwList.length + ' "Needs work"</span>' : '') + '</h3>' +
      (nwList.length ? nwList.map(function (x) { return '<div class="pp-row"><span>' + esc(x.reason) + '</span><span class="pp-dim">' + new Date(x.ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' + x.amt + ' XP</span></div>'; }).join('') : '<div class="pp-dim">No "Needs work" awards in the last 2 weeks. 👍</div>') + '</div>';
    html += (d.mism ? '<div class="pp-warn">⚠ XP shown (' + d.mism.shown + ') is lower than the award history (' + d.mism.target + '). <button class="pp-b o" onclick="CommandCenter.restoreXp()">Review</button></div>' : '') +
      (d.dup ? '<div class="pp-warn">⧉ This name exists ' + d.dup.length + ' times (' + esc(d.dup.join(', ')) + '). One may be an old copy.</div>' : '') +
      '<div class="pp-card"><h3>XP earned each day · last 30 days</h3>' + bars + (d.tally.length ? '<div class="pp-dim" style="margin-top:8px;font-size:.8rem">Most XP for: ' + d.tally.map(function (t) { return esc(t.name) + ' ×' + t.count; }).join(', ') + '</div>' : '') + '</div>' +
      discCard + quizCard + '<div class="pp-2"><div class="pp-card"><h3>Homework</h3>' + hw + '</div><div class="pp-card"><h3>What to do next</h3><ul class="pp-tips">' + d.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><h3 style="margin-top:14px">Worksheets</h3>' + ws + '</div></div>';
    return html;
  }

  var SECTIONS = [
    ['monster', '👾 Monster & evolution'], ['progress', '📈 Progress & CEFR'], ['assignments', '📝 Assignments'], ['assessments', '🧪 Assessments'],
    ['badges', '🏅 Badges'], ['attendance', '📋 Attendance'], ['portfolio', '🗂️ Portfolio'], ['xp', '⭐ XP ledger'], ['rewards', '🎁 Rewards'], ['notes', '🗒️ Notes'], ['alice', '🫖 Alice']
  ];
  function more(counts, openTab) {
    return '<div class="pp-more"><div class="pp-dim" style="margin:14px 0 8px;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;font-weight:700">More about this pupil</div>' +
      SECTIONS.map(function (s) {
        var n = counts && counts[s[0]] != null ? ' <span class="pp-dim">(' + counts[s[0]] + ')</span>' : '';
        return '<details data-tab="' + s[0] + '"' + (openTab === s[0] ? ' open' : '') + ' ontoggle="PupilProfile.toggle(this)"><summary><span>' + s[1] + n + '</span></summary><div class="pp-light" id="pp-sec-' + s[0] + '"></div></details>';
      }).join('') + '</div>';
  }

  root.PupilProfile = {
    top: top, more: more,
    award: function (id, n) {
      var st = root.schoolStore; if (!st || !st.giveXP) return;
      st.giveXP(id, n, 'Quick Classroom Award', 'Teacher', { category: 'positive', icon: '⭐' });
      try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* sound is optional */ }
      if (root.openStudentDetail) root.openStudentDetail(id);
    },
    toggle: function (el) {
      if (!el.open) return;
      var box = el.querySelector('.pp-light'); if (!box || box.dataset.done) return;
      box.dataset.done = '1';
      try { box.innerHTML = root.ppSectionHtml ? root.ppSectionHtml(el.dataset.tab) : ''; } catch (e) { box.innerHTML = '<span class="pp-dim">Could not load this section.</span>'; }
    }
  };
})(typeof window !== 'undefined' ? window : this);
