/* Parent report cards. One clean A4 card per pupil: parents' names, the 4 skills, Unit 3 quiz in words, homework, XP, attendance and a short teacher comment in English AND Turkish.
   The comment is written from the pupil's real data (strongest skill, skill to practise, homework done) and is kind: no scary numbers, no names of other pupils.
   Parents' names come from the school's k12 site and are kept ONLY in this browser (localStorage "eaa_parent_names_v1", school number -> [mother, father, other]); they are never part of the website's code.
   Reports are saved with store.generateStudentReport (so they appear on the Student Reports page) and shown on the pupil's Parent Portal page. */
(function (root) {
  'use strict';
  var KEY = 'eaa_parent_names_v1', TERM = 'Term 1 (Autumn)', TYPE = 'Parent Report';
  var ALIAS = { '1789469351603': '313' };   // Ada Özcan has a different platform id than her school number
  function S() { return root.schoolStore; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tc(s) { return String(s || '').toLocaleLowerCase('tr').replace(/(^|[\s'-])(\S)/g, function (m, a, b) { return a + b.toLocaleUpperCase('tr'); }); }
  function schoolNo(id) { var m = /(\d+)$/.exec(String(id)); return m ? (ALIAS[m[1]] || m[1]) : ''; }
  function names() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function parentsOf(id) { var a = names()[schoolNo(id)] || []; return [a[0], a[1], a[2]].filter(Boolean).map(tc); }

  var TR = { Listening: 'Dinleme', Reading: 'Okuma', Writing: 'Yazma', Speaking: 'Konuşma' };
  var LEVEL_TXT = { 'A2': 'Very good', 'A1+': 'Good', 'A1': 'Developing', 'Pre-A1': 'Just starting' };
  var LEVEL_TR = { 'A2': 'Çok iyi', 'A1+': 'İyi', 'A1': 'Gelişiyor', 'Pre-A1': 'Yeni başlıyor' };
  function cefr(v) { return v >= 85 ? 'A2' : v >= 75 ? 'A1+' : v >= 60 ? 'A1' : 'Pre-A1'; }

  /** Everything the card needs for one pupil. Homework needs the Google Sheet, so call data() again after it has loaded. */
  function data(id, onReady) {
    var st = S(), s = st.getStudent(id); if (!s) return null;
    var d = null; try { d = root.CommandCenter && root.CommandCenter.profileData ? root.CommandCenter.profileData(id, onReady) : null; } catch (e) { d = null; }
    var qs = null; try { qs = root.QuizSkills && root.QuizSkills.skillsOf ? root.QuizSkills.skillsOf(id) : null; } catch (e) { qs = null; }
    var q = null; try { q = root.QuizResults && root.QuizResults.detailOf ? root.QuizResults.detailOf(id) : null; } catch (e) { q = null; }
    var sc = null; try { sc = root.QuizResults && root.QuizResults.scoreOf ? root.QuizResults.scoreOf(id) : null; } catch (e) { sc = null; }
    var sk = {};
    ['listening', 'reading', 'writing', 'speaking'].forEach(function (k) {
      var v = qs && qs.skills[k] ? qs.skills[k].v : null;
      if (v == null) { try { var g = (st.getStudentSkills(id) || {})[k]; if (g && g.evidenceCount > 0 && g.score > 0) v = g.score; } catch (e) { v = null; } }
      sk[k] = v == null ? null : { v: v, level: cefr(v) };
    });
    var best = null, worst = null;
    Object.keys(sk).forEach(function (k) { if (!sk[k]) return; if (!best || sk[k].v > sk[best].v) best = k; if (!worst || sk[k].v < sk[worst].v) worst = k; });
    if (best && (!worst || sk[best].v - sk[worst].v < 10)) { best = null; worst = null; }   // all skills about equal: do not name a strongest one
    var band = !sc ? '' : sc.pct >= 70 ? 'Excellent' : sc.pct >= 50 ? 'Good' : sc.pct >= 30 ? 'Getting there' : 'Needs more practice';
    var bandTr = { 'Excellent': 'Mükemmel', 'Good': 'İyi', 'Getting there': 'Gelişiyor', 'Needs more practice': 'Daha fazla pratik gerekiyor', '': '' }[band];
    var hw = d && d.hwReady ? d.hw.map(function (h) { return { label: h.label, k: h.k === 'done' ? 'done' : (h.k === 'part' ? 'part' : 'none') }; }) : [];
    var att = null; try { var recs = (st.state.attendanceRecords || []).filter(function (r) { return r.studentId === id; }); att = recs.length ? st.getStudentAttendanceRate(id) : null; } catch (e) { att = null; }
    return { id: id, first: s.firstName || 'your child', name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim(), cls: (st.getClass && st.getClass(s.classId) || {}).name || s.grade || '', grade: s.grade || '',
      xp: Number(st.getStudentTotalXP(id)) || 0, last30: d ? d.month : 0, activeDays: d ? d.active : 0, att: att, skills: sk, best: best, worst: worst, quizBand: band, quizBandTr: bandTr, quizText: q ? q.title : '',
      hw: hw, hwReady: !!(d && d.hwReady), nw: d && d.nw ? d.nw.n : 0, parents: parentsOf(id), cefr: s.overallCefr || '' };
  }

  function comment(x) {
    var en = [], tr = [], f = x.first;
    var hwDone = x.hw.filter(function (h) { return h.k === 'done'; }).length, hwTot = x.hw.length;
    en.push(f + ' is part of our English Adventure Academy and has earned ' + x.xp.toLocaleString('en-US') + ' adventure points so far' + (x.last30 > 0 && x.last30 <= x.xp ? ', ' + x.last30 + ' of them in the last month.' : '.'));
    tr.push(f + ' İngilizce Macera Akademisi\'nin bir üyesi ve şimdiye kadar ' + x.xp.toLocaleString('tr-TR') + ' macera puanı topladı' + (x.last30 > 0 && x.last30 <= x.xp ? ', bunun ' + x.last30 + ' puanı son bir ayda.' : '.'));
    if (x.best) {
      en.push('Strongest skill: ' + x.best + '. ' + (x.worst ? 'Next step: a little more ' + x.worst.toLowerCase() + ' practice at home will help (for example ' + (x.worst === 'speaking' ? 'saying three sentences about the day in English' : x.worst === 'writing' ? 'writing three short sentences about the lesson' : x.worst === 'reading' ? 'reading one short text aloud' : 'listening to the lesson songs and stories again') + ').' : ''));
      tr.push('En güçlü olduğu beceri: ' + TR[x.best[0].toUpperCase() + x.best.slice(1)].toLowerCase() + '. ' + (x.worst ? 'Sonraki adım: evde biraz daha ' + TR[x.worst[0].toUpperCase() + x.worst.slice(1)].toLowerCase() + ' çalışması faydalı olur (örneğin ' + (x.worst === 'speaking' ? 'günü İngilizce üç cümleyle anlatmak' : x.worst === 'writing' ? 'dersle ilgili üç kısa cümle yazmak' : x.worst === 'reading' ? 'kısa bir metni sesli okumak' : 'ders şarkı ve hikayelerini tekrar dinlemek') + ').' : ''));
    }
    if (hwTot) {
      if (hwDone === hwTot) { en.push('All current homework has been done. Well done!'); tr.push('Güncel ödevlerin hepsi tamamlandı. Tebrikler!'); }
      else if (hwDone > 0) { en.push('Homework: ' + hwDone + ' of ' + hwTot + ' done. Please help ' + f + ' finish the rest when possible.'); tr.push('Ödev: ' + hwTot + ' ödevden ' + hwDone + ' tanesi tamamlandı. Mümkünse kalanları tamamlaması için ' + f + '\'e destek olmanızı rica ederiz.'); }
      else { en.push('We would love to see more homework from ' + f + '. Short and regular practice makes a big difference.'); tr.push(f + '\'in ödevlerini daha çok görmek isteriz. Kısa ama düzenli çalışma büyük fark yaratır.'); }
    }
    if (x.nw >= 3) { en.push('We are also working together on listening carefully and waiting for our turn to speak.'); tr.push('Ayrıca dikkatle dinlemek ve konuşma sırasını beklemek üzerinde birlikte çalışıyoruz.'); }
    en.push('Thank you for your support at home!'); tr.push('Evdeki desteğiniz için teşekkür ederiz!');
    return { en: en.join(' '), tr: tr.join(' ') };
  }

  var CSS = '.pr-page{background:#fff;color:#0f172a;max-width:780px;margin:0 auto 18px;padding:34px 38px;border:2px solid #0f172a;border-radius:10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;box-sizing:border-box}' +
    '.pr-top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #0f172a;padding-bottom:12px;margin-bottom:14px}.pr-top b{font-size:20px;letter-spacing:.02em}.pr-top small{color:#64748b;display:block}' +
    '.pr-to{background:#f1f5f9;border-radius:8px;padding:10px 14px;margin-bottom:14px;line-height:1.55}.pr-info{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.pr-info div{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px}.pr-info span{display:block;font-size:10px;color:#64748b;text-transform:uppercase}' +
    '.pr-h{font-weight:800;font-size:12px;letter-spacing:.04em;margin:14px 0 6px;color:#1e293b}.pr-sk{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.pr-s{border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px}.pr-s b{display:flex;justify-content:space-between}.pr-bar{height:7px;border-radius:4px;background:#e2e8f0;margin-top:5px;overflow:hidden}.pr-bar i{display:block;height:100%;background:#2563eb}' +
    '.pr-hw{display:flex;gap:8px;flex-wrap:wrap}.pr-hw span{border:1px solid #e2e8f0;border-radius:999px;padding:3px 10px}.pr-ok{background:#dcfce7}.pr-mid{background:#fef3c7}.pr-no{background:#f1f5f9;color:#475569}' +
    '.pr-c{border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;line-height:1.55;margin-bottom:8px}.pr-sig{display:flex;justify-content:space-between;margin-top:26px;font-size:12px;padding-top:6px}.pr-sig div{width:210px;border-top:1px solid #0f172a;padding-top:4px}' +
    '@media print{body>*:not(#pr-sheet){display:none!important}#pr-sheet{position:static!important;background:#fff!important;padding:0!important;overflow:visible!important}.pr-noprint{display:none!important}.pr-page{border:0;border-radius:0;margin:0;padding:6mm 8mm;max-width:none;page-break-after:always;break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4;margin:8mm}}';
  function css() { if (document.getElementById('pr-css')) return; var s = document.createElement('style'); s.id = 'pr-css'; s.textContent = CSS + '#pr-sheet{position:fixed;inset:0;z-index:100003;background:#0b0e16;overflow:auto;padding:16px}.pr-btn{border:0;border-bottom:5px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;border-radius:12px;padding:8px 16px;cursor:pointer;font-family:Inter,system-ui,sans-serif}.pr-btn:active{transform:translateY(4px);border-bottom-width:1px}.pr-btn.o{background:#334155;border-bottom-color:#1e293b;color:#e2e8f0}'; document.head.appendChild(s); }

  /** The card of one report (rep.extra holds everything, so the page never changes after it was made). */
  function cardHtml(rep) {
    var x = rep.extra || {}, c = x.comment || { en: '', tr: '' };
    var sk = ['listening', 'reading', 'writing', 'speaking'].map(function (k) {
      var v = x.skills && x.skills[k], nm = k[0].toUpperCase() + k.slice(1);
      return '<div class="pr-s"><b><span>' + nm + ' · ' + TR[nm] + '</span><span>' + (v ? esc(LEVEL_TXT[v.level] + ' · ' + LEVEL_TR[v.level]) : 'not assessed yet') + '</span></b><div class="pr-bar"><i style="width:' + (v ? Math.max(6, Math.min(100, v.v)) : 0) + '%"></i></div></div>';
    }).join('');
    var hw = (x.hw || []).map(function (h) { return '<span class="pr-' + (h.k === 'done' ? 'ok' : h.k === 'part' ? 'mid' : 'no') + '">' + esc(h.label) + ': ' + (h.k === 'done' ? 'done ✓' : h.k === 'part' ? 'partly done' : 'not handed in yet') + '</span>'; }).join('');
    var to = x.parents && x.parents.length ? 'Dear ' + esc(x.parents.join(' and ')) + ' / Sayın ' + esc(x.parents.join(' ve ')) + ',' : 'Dear parents / Sayın velimiz,';
    return '<div class="pr-page"><div class="pr-top"><div><b>ENGLISH ADVENTURE ACADEMY</b><small>Parent report · Veli raporu</small></div><div style="text-align:right"><b style="font-size:15px">' + esc(rep.term) + '</b><small>' + esc(rep.date) + '</small></div></div>' +
      '<div class="pr-to">' + to + '<br>This is how <b>' + esc(x.first) + '</b> is doing in English. / <b>' + esc(x.first) + '</b>\'in İngilizce\'deki durumu aşağıdadır.</div>' +
      '<div class="pr-info"><div><span>Pupil</span><b>' + esc(x.name) + '</b></div><div><span>Class</span><b>' + esc(x.cls) + '</b></div><div><span>Adventure points</span><b>⭐ ' + (x.xp || 0).toLocaleString('en-US') + '</b></div><div><span>Attendance</span><b>' + (x.att != null ? x.att + '%' : 'not recorded') + '</b></div></div>' +
      '<div class="pr-h">THE FOUR SKILLS · DÖRT BECERİ</div><div class="pr-sk">' + sk + '</div>' +
      (x.quizBand ? '<div class="pr-h">UNIT 3 QUIZ · ÜNİTE 3 SINAVI</div><div>Result: <b>' + esc(x.quizBand) + ' / ' + esc(x.quizBandTr) + '</b>' + (x.best ? ' · strongest skill: <b>' + esc(x.best) + '</b>' : '') + '</div>' : '') +
      (hw ? '<div class="pr-h">HOMEWORK · ÖDEV</div><div class="pr-hw">' + hw + '</div>' : '') +
      '<div class="pr-h">TEACHER\'S COMMENT · ÖĞRETMENİN YORUMU</div><div class="pr-c">' + esc(c.en) + '</div><div class="pr-c">' + esc(c.tr) + '</div>' +
      '<div class="pr-sig"><div>Mr. Maysam (English teacher)</div><div>Parent signature / Veli imzası</div></div></div>';
  }

  function build(id) {
    var x = data(id); if (!x) return null;
    var c = comment(x);
    return { first: x.first, name: x.name, cls: x.cls, xp: x.xp, att: x.att, skills: x.skills, best: x.best ? x.best[0].toUpperCase() + x.best.slice(1) : '', quizBand: x.quizBand, quizBandTr: x.quizBandTr, hw: x.hw, parents: x.parents, comment: c };
  }

  /** Saves one report for a pupil (replaces this term's earlier parent report of that pupil). */
  function save(id) {
    var st = S(), ex = build(id); if (!ex) return null;
    st.state.reports = (st.state.reports || []).filter(function (r) { return !(r.studentId === id && r.reportType === TYPE && r.term === TERM); });
    var rep = st.generateStudentReport({ studentId: id, term: TERM, reportType: TYPE, customNotes: ex.comment.en });
    if (rep) { rep.extra = ex; }
    return rep;
  }
  function reportOf(id) { return (S().state.reports || []).filter(function (r) { return r.studentId === id && r.reportType === TYPE && r.extra && !r.archived; })[0] || null; }

  function waitSheet(cb) {
    var t0 = Date.now(), first = S().getStudents('class-3a')[0]; if (!first) return cb();
    (function poll() { var d = null; try { d = root.CommandCenter.profileData(first.id, function () {}); } catch (e) { d = null; } if ((d && d.hwReady) || Date.now() - t0 > 20000) return cb(); setTimeout(poll, 700); })();
  }

  var PR = root.ParentReport = {
    names: names, parentsOf: parentsOf, build: build, save: save, reportOf: reportOf, cardHtml: cardHtml,
    /** Pupils of the four classes. */
    pupils: function () { var st = S(), out = []; ['class-3a', 'class-3b', 'class-4a', 'class-4b'].forEach(function (c) { (st.getStudents(c) || []).forEach(function (p) { out.push(p); }); }); return out; },
    openAll: function () {
      css(); var box = document.getElementById('pr-sheet'); if (!box) { box = document.createElement('div'); box.id = 'pr-sheet'; document.body.appendChild(box); }
      var have = Object.keys(names()).length;
      box.innerHTML = '<div class="pr-noprint" style="color:#e8eefc;font-family:Inter,system-ui,sans-serif;max-width:780px;margin:0 auto 14px"><h2 style="margin:0 0 6px">🧾 Parent reports for all four classes</h2>' +
        '<div style="color:#94a3b8;font-size:.9rem">Parents\' names found on this computer: <b>' + have + '</b>. Reports are made from each pupil\'s real data (skills, quiz in words, homework, points) with a short comment in English and Turkish. Read a few before you print.</div>' +
        '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><label class="pr-btn o" style="display:inline-block">📂 Load parents’ names (file)<input id="pr-file" type="file" accept=".json,application/json" style="display:none"></label><button class="pr-btn" id="pr-make">⚙️ Make / update all reports</button><button class="pr-btn o" id="pr-print" disabled>🖨️ Print all</button><button class="pr-btn o" style="margin-left:auto" onclick="ParentReport.close()">Close ✕</button></div><div id="pr-msg" style="margin-top:8px;color:#fbbf24"></div></div><div id="pr-list"></div>';
      box.style.display = 'block';
      box.querySelector('#pr-file').onchange = function () {
        var f = this.files && this.files[0], msg = box.querySelector('#pr-msg'); if (!f) return;
        var rd = new FileReader();
        rd.onload = function () {
          try { var o = JSON.parse(String(rd.result)), n = Object.keys(o).length; if (!n) throw new Error('empty'); localStorage.setItem(KEY, JSON.stringify(o)); msg.textContent = '✓ Parents’ names loaded for ' + n + ' pupils (kept only on this computer). Now press "Make / update all reports".'; }
          catch (e) { msg.textContent = 'That file could not be read. Pick the parents.json file.'; }
        };
        rd.readAsText(f);
      };
      box.querySelector('#pr-make').onclick = function () {
        var msg = box.querySelector('#pr-msg'); msg.textContent = 'Reading the homework from the Google Sheet…'; this.disabled = true;
        waitSheet(function () {
          var ps = PR.pupils(), n = 0, noName = [];
          ps.forEach(function (p) { var r = save(p.id); if (r) { n++; if (!(r.extra.parents || []).length) noName.push(p.firstName); } });
          try { S().saveState(); if (S().notify) S().notify(); } catch (e) { /* kept in memory at least */ }
          msg.textContent = '✓ ' + n + ' reports made.' + (noName.length ? ' No parent name for: ' + noName.join(', ') + '.' : '');
          box.querySelector('#pr-print').disabled = false;
          box.querySelector('#pr-list').innerHTML = ps.map(function (p) { var r = reportOf(p.id); return r ? cardHtml(r) : ''; }).join('');
          box.querySelector('#pr-print').onclick = function () { window.print(); };
        });
      };
    },
    /** One pupil's card, big, with a print button. */
    open: function (repId) {
      css(); var rep = S().getReport(repId); if (!rep || !rep.extra) return;
      var box = document.getElementById('pr-sheet'); if (!box) { box = document.createElement('div'); box.id = 'pr-sheet'; document.body.appendChild(box); }
      box.innerHTML = '<div class="pr-noprint" style="max-width:780px;margin:0 auto 12px;display:flex;gap:8px"><button class="pr-btn" onclick="window.print()">🖨️ Print</button><button class="pr-btn o" style="margin-left:auto" onclick="ParentReport.close()">Close ✕</button></div>' + cardHtml(rep);
      box.style.display = 'block';
    },
    close: function () { var b = document.getElementById('pr-sheet'); if (b) b.style.display = 'none'; },
    /** For the Parent Portal page of one child: a card with the latest parent report. */
    portalCard: function (id) {
      var rep = reportOf(id);
      if (!rep) return '<section class="par-card"><h3>🧾 Term report</h3><p class="par-empty">The teacher will share the term report here soon.</p></section>';
      return '<section class="par-card"><h3>🧾 Term report</h3><p>' + esc(rep.term) + ' · ' + esc(rep.date) + '</p><button type="button" class="par-link" onclick="ParentReport.open(\'' + esc(rep.id) + '\')">Open the report →</button></section>';
    }
  };
})(typeof window !== 'undefined' ? window : this);
