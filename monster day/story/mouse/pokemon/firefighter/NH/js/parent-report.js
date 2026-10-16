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
    var pos30 = 0, nw30 = 0, since = Date.now() - 30 * 86400000, level = '';
    try { (st.getXPTransactions(id) || []).forEach(function (t) {
      if (t.status === 'voided' || t.category === 'correction') return;
      var ts = new Date(t.timestamp || t.date).getTime(), amt = Number(t.amount != null ? t.amount : t.points) || 0;
      if (!ts || ts < since) return;
      if (t.category === 'needs_work' && amt < 0) nw30++; else if (amt > 0) pos30++;
    }); } catch (e) { pos30 = 0; nw30 = 0; }
    try { var ms = st.calculateMonsterState(id) || {}; level = (ms.stageName || '').replace(/^Level \d+ [•·-] /, ''); } catch (e) { level = ''; }
    var att = null; try { var recs = (st.state.attendanceRecords || []).filter(function (r) { return r.studentId === id; }); att = recs.length ? st.getStudentAttendanceRate(id) : null; } catch (e) { att = null; }
    return { id: id, first: s.firstName || 'your child', name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim(), cls: (st.getClass && st.getClass(s.classId) || {}).name || s.grade || '', grade: s.grade || '',
      xp: Number(st.getStudentTotalXP(id)) || 0, last30: d ? d.month : 0, activeDays: d ? d.active : 0, att: att, skills: sk, best: best, worst: worst, quizBand: band, quizBandTr: bandTr, quizText: q ? q.title : '', quizScore: sc ? sc.text : '', quizPct: sc ? sc.pct : null, quizBonus: q && q.bonus ? q.bonus : 0, quizNote: q && q.note ? q.note : '', quizSpeak: sc ? !!sc.speaking : false, quizParts: q ? q.parts.map(function (p) { return { label: p.label, score: p.score, max: p.max }; }) : [],
      hw: hw, hwReady: !!(d && d.hwReady), nw: d && d.nw ? d.nw.n : 0, pos30: pos30, nw30: nw30, level: level, parents: parentsOf(id), cefr: s.overallCefr || '' };
  }

  function comment(x) {
    var en = [], tr = [], f = x.first;
    var hwDone = x.hw.filter(function (h) { return h.k === 'done'; }).length, hwTot = x.hw.length;
    var cap = function (k) { return k[0].toUpperCase() + k.slice(1); };
    en.push(f + ' is a valued member of our class and has earned ' + x.xp.toLocaleString('en-US') + ' adventure points.');
    tr.push(f + ', sınıfımızın değerli bir üyesi ve şimdiye kadar ' + x.xp.toLocaleString('tr-TR') + ' macera puanı topladı.');
    if (x.best) {
      en.push(cap(x.best) + ' is a real strength' + (x.worst ? ', and a little ' + x.worst + ' practice at home may help even more.' : '.'));
      tr.push(TR[cap(x.best)] + ' en güçlü becerisi' + (x.worst ? '; evde biraz ' + TR[cap(x.worst)].toLowerCase() + ' çalışması daha da faydalı olabilir.' : '.'));
    }
    if (hwTot) {
      if (hwDone === hwTot) { en.push('Thank you for the homework!'); tr.push('Ödevler için teşekkür ederiz!'); }
      else { en.push('A little regular practice at home helps ' + f + ' shine.'); tr.push('Evde düzenli küçük çalışmalar ' + f + '\'in parlamasına yardımcı olur.'); }
    }
    en.push('We look forward to seeing you at the parent meeting on Saturday 17 October.');
    tr.push('17 Ekim Cumartesi günkü veli toplantısında görüşmek üzere.');
    return { en: en.join(' '), tr: tr.join(' ') };
  }

  var CSS = '.ph-wide{grid-column:1/-1}.ph-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}.ph-list li{display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.05);border-radius:12px;padding:9px 12px;color:#e8eefc}.ph-list li em{font-style:normal;color:#94a3b8;font-size:.82rem}.ph-list li b{font-weight:800}.ph-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;background:#64748b}.ph-dot.ph-done{background:#34d399}.ph-dot.ph-part{background:#fbbf24}.ph-sk{display:grid;gap:4px;margin-bottom:6px}.ph-skt{display:flex;justify-content:space-between;gap:8px;font-size:.88rem;color:#e8eefc}.ph-skt b{color:#a5b4fc}' +
    '.pr-page{background:#fff;color:#0f172a;max-width:780px;margin:0 auto 18px;padding:34px 38px;border:2px solid #0f172a;border-radius:10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;box-sizing:border-box}' +
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
      '<div class="pr-h">POINTS AND CLASSROOM BEHAVIOUR · PUANLAR VE SINIF DAVRANIŞI</div><div class="pr-info" style="grid-template-columns:repeat(4,1fr)"><div><span>Points this month · Bu ay puan</span><b>' + (x.month > 0 && x.month <= (x.xp || 0) ? '+' + x.month.toLocaleString('en-US') : '–') + '</b></div><div><span>Monster level · Canavar seviyesi</span><b>' + esc(x.level || '–') + '</b></div><div><span>Positive awards · Olumlu ödül</span><b>' + (x.pos30 || 0) + '</b></div><div><span>Reminders · Uyarı</span><b>' + (x.nw30 || 0) + '</b></div></div><div style="font-size:11px;color:#64748b">Last 30 days. Reminders are "needs work" notes such as talking out of turn or being unprepared. · Son 30 gün. Uyarılar, sırasız konuşma veya hazırlıksız gelme gibi "geliştirilmeli" notlarıdır.</div>' +
      '<div class="pr-h">THE FOUR SKILLS · DÖRT BECERİ</div><div class="pr-sk">' + sk + '</div>' +
      (x.quizBand ? '<div class="pr-h">UNIT 3 QUIZ · ÜNİTE 3 SINAVI</div><div>Score · Puan: <b>' + esc(x.quizScore || '') + '</b>' + (x.quizPct != null ? ' (' + x.quizPct + '%)' : '') + (x.quizBonus ? ' + ' + x.quizBonus + ' bonus' : '') + ' · <b>' + esc(x.quizBand) + ' / ' + esc(x.quizBandTr) + '</b>' + (x.best ? ' · strongest skill: <b>' + esc(x.best) + '</b>' : '') + '</div>' +
        '<div style="font-size:11px;color:#64748b;margin-top:3px">' + (x.quizSpeak ? 'Includes the speaking mark. · Konuşma notu dahildir.' : 'Speaking and the maze are not counted yet. · Konuşma ve labirent henüz dahil değil.') + (x.quizNote ? ' ' + esc(x.quizNote) : '') + '</div>' +
        ((x.quizParts || []).length ? '<div class="pr-hw" style="margin-top:6px">' + x.quizParts.map(function (p) { return '<span>' + esc(p.label) + ' ' + p.score + '/' + p.max + '</span>'; }).join('') + '</div>' : '') : '') +
      (hw ? '<div class="pr-h">HOMEWORK · ÖDEV</div><div class="pr-hw">' + hw + '</div>' : '') +
      '<div class="pr-h">TEACHER\'S COMMENT · ÖĞRETMENİN YORUMU</div><div class="pr-c">' + esc(c.en) + '</div><div class="pr-c">' + esc(c.tr) + '</div>' +
      '<div class="pr-sig"><div>Mr. Maysam (English teacher)</div><div>Parent signature / Veli imzası</div></div></div>';
  }

  function build(id) {
    var x = data(id); if (!x) return null;
    var c = comment(x);
    return { first: x.first, name: x.name, cls: x.cls, xp: x.xp, att: x.att, skills: x.skills, best: x.best ? x.best[0].toUpperCase() + x.best.slice(1) : '', quizBand: x.quizBand, quizBandTr: x.quizBandTr, quizTitle: x.quizText, quizScore: x.quizScore, quizPct: x.quizPct, quizBonus: x.quizBonus, quizNote: x.quizNote, quizSpeak: x.quizSpeak, quizParts: x.quizParts, hw: x.hw, parents: x.parents, month: x.last30, level: x.level, pos30: x.pos30, nw30: x.nw30, comment: c };
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

  /* ---- private cloud copy (never the parents' names: those stay on the teacher's computer and are put back from the local file) ---- */
  var CLOUD_ID = 'class-parent-reports-sync';
  function cloudClient() { var A = root.AdventureSupabase; if (!A || !A.isConfigured) return null; try { return A.client || (A._ensureClient && A._ensureClient()) || null; } catch (e) { return null; } }
  function strip(rep) {
    var x = JSON.parse(JSON.stringify(rep.extra || {})); delete x.parents;
    return { id: rep.id, studentId: rep.studentId, term: rep.term, date: rep.date, reportType: rep.reportType, classId: rep.classId, className: rep.className, studentName: rep.studentName, extra: x };
  }
  function allReports() { return (S().state.reports || []).filter(function (r) { return r.extra && r.reportType === TYPE && !r.archived; }); }
  async function cloudUp() {
    var c = cloudClient(); if (!c) throw new Error('not connected to the cloud');
    var doc = { v: 1, at: new Date().toISOString(), reports: allReports().map(strip) };
    var up = await c.from('classes').upsert({ id: CLOUD_ID, name: 'Parent Reports Sync', grade: 'System', teacher: 'System', description: JSON.stringify(doc), archived: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (up && up.error) throw up.error;
    return doc.reports.length;
  }
  async function cloudDown() {
    var c = cloudClient(); if (!c) throw new Error('not connected to the cloud');
    var res = await c.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle();
    if (res && res.error) throw res.error;
    var doc = null; try { doc = res && res.data && res.data.description ? JSON.parse(res.data.description) : null; } catch (e) { doc = null; }
    if (!doc || !Array.isArray(doc.reports)) return 0;
    var st = S(), n = 0; st.state.reports = st.state.reports || [];
    doc.reports.forEach(function (cr) {
      if (!st.getStudent(cr.studentId)) return;
      var mine = st.state.reports.filter(function (r) { return r.studentId === cr.studentId && r.reportType === TYPE && r.term === cr.term && r.extra; })[0];
      if (mine) return;   // this computer already has its own report for this pupil: never overwritten
      cr.extra.parents = parentsOf(cr.studentId); cr.archived = false; st.state.reports.unshift(cr); n++;
    });
    if (n) { st.saveState(); if (st.notify) st.notify(); }
    return n;
  }

  /* ---- the Parent Portal home page: what a parent needs, in Turkish and English ---- */
  var EVENTS = [ { date: '2026-10-17', tr: 'İngilizce bireysel veli toplantısı (Cumartesi)', en: 'English parent meeting (Saturday)' } ];   // the teacher tells me more dates
  var HELP = {
    listening: { tr: ['Birlikte İngilizce bir şarkı veya hikaye dinleyin ve duyduğu 3 kelimeyi söylesin.', 'Dinlediği kısa bir cümleyi tekrar etmesini isteyin.'], en: ['Listen to an English song or story together and ask for 3 words he or she heard.', 'Ask your child to repeat one short sentence after listening.'] },
    reading: { tr: ['Günde 5 dakika kısa bir İngilizce metni sesli okusun.', 'Okuduğu metinden bir kelimeyi gösterip anlamını sorun.'], en: ['Read one short English text aloud for 5 minutes a day.', 'Point to one word and ask what it means.'] },
    writing: { tr: ['Derste öğrendiği 3 kelimeyle üç kısa cümle yazsın.', 'Günün olayını tek bir İngilizce cümleyle yazmasını isteyin.'], en: ['Write three short sentences with 3 words from class.', 'Ask for one English sentence about the day.'] },
    speaking: { tr: ['Akşam yemeğinde "Tell me three sentences about your day" deyin.', 'Sevdiği bir oyuncağı veya yemeği İngilizce anlatsın.'], en: ['At dinner ask: "Tell me three sentences about your day."', 'Ask for a few English words about a favourite toy or food.'] }
  };
  function homeHtml(id, rerender) {
    var st = S(), s0 = st.getStudent(id); if (!s0) return '<div style="padding:40px;text-align:center">No child profile found.</div>';
    var x = data(id, rerender), first = esc(x.first), rep = reportOf(id);
    var skillRows = ['listening', 'reading', 'writing', 'speaking'].map(function (k) {
      var v = x.skills[k], nm = k[0].toUpperCase() + k.slice(1);
      return '<div class="ph-sk"><div class="ph-skt"><span>' + TR[nm] + ' · ' + nm + '</span><b>' + (v ? esc(LEVEL_TR[v.level] + ' · ' + LEVEL_TXT[v.level]) : 'henüz değerlendirilmedi · not assessed yet') + '</b></div><div class="par-bar"><i style="width:' + (v ? Math.max(6, Math.min(100, v.v)) : 0) + '%"></i></div></div>';
    }).join('');
    var weak = x.worst || (function () { var w = null; Object.keys(x.skills).forEach(function (k) { if (x.skills[k] && (!w || x.skills[k].v < x.skills[w].v)) w = k; }); return w; })() || 'speaking';
    var help = HELP[weak] || HELP.speaking, wnm = weak[0].toUpperCase() + weak.slice(1);
    var hw = !x.hwReady ? '<p class="par-empty">Ödevler okunuyor… · Reading the homework…</p>' : (x.hw.length ? '<ul class="ph-list">' + x.hw.map(function (h) { return '<li><span><span class="ph-dot ph-' + h.k + '"></span><b>' + esc(h.label) + '</b></span><em>' + (h.k === 'done' ? 'tamamlandı · done ✓' : h.k === 'part' ? 'kısmen yapıldı · partly done' : 'henüz teslim edilmedi · not handed in yet') + '</em></li>'; }).join('') + '</ul>' : '<p class="par-empty">Şu an ödev yok. · No homework right now.</p>');
    var now = Date.now(), ev = EVENTS.filter(function (e) { return new Date(e.date + 'T23:59:59').getTime() >= now - 86400000; }).map(function (e) {
      var d = new Date(e.date + 'T12:00:00'); return '<li><span><b>' + d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) + '</b> ' + esc(e.tr) + '</span><em>' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) + ' · ' + esc(e.en) + '</em></li>'; }).join('');
    return '<div class="parent-home ph">' +
      '<div class="par-hero"><div class="par-avatar">' + (root.renderStudentMonsterAvatar ? root.renderStudentMonsterAvatar(id, { size: 88, animated: true }) : '') + '</div><div class="par-hero-text"><div class="par-kicker">VELİ SAYFASI · PARENT PAGE</div><h1>' + first + '\'in İngilizce durumu<br><small style="font-size:.6em;font-weight:700;opacity:.85">How ' + first + ' is doing in English</small></h1><p>' + esc(x.cls) + (x.att != null ? ' · devam / attendance ' + x.att + '%' : '') + '</p></div>' +
        '<button type="button" class="btn-3d btn-3d-primary" onclick="switchView(' + "'" + 'parent-messages' + "'" + ')">💬 Öğretmene yaz · Message the teacher</button></div>' +
      '<div class="par-grid">' +
        '<section class="par-card ph-wide"><h3>🧾 Dönem raporu · Term report</h3>' + (rep ? '<p class="par-empty" style="color:#cbd5e1">' + esc(rep.term) + ' · ' + esc(rep.date) + '</p><button type="button" class="btn-3d btn-3d-primary" onclick="ParentReport.open(' + "'" + esc(rep.id) + "'" + ')">Raporu aç ve yazdır · Open and print the report →</button>' : '<p class="par-empty">Öğretmeniniz raporu yakında burada paylaşacak. · Your teacher will share the report here soon.</p>') + '</section>' +
        '<section class="par-card"><h3>📝 Bu haftanın ödevleri · Homework</h3>' + hw + '</section>' +
        '<section class="par-card"><h3>📊 Dört beceri · The four skills</h3>' + skillRows + '</section>' +
        '<section class="par-card"><h3>🏠 Evde nasıl yardım edebilirsiniz · How to help at home</h3><p class="par-empty" style="color:#cbd5e1">En çok destek gereken beceri: <b>' + TR[wnm] + '</b> · Focus: <b>' + wnm + '</b></p><ul class="ph-list">' + help.tr.map(function (t, i) { return '<li><span><b>' + esc(t) + '</b></span><em>' + esc(help.en[i]) + '</em></li>'; }).join('') + '</ul></section>' +
        '<section class="par-card"><h3>📅 Tarihler · Dates</h3>' + (ev ? '<ul class="ph-list">' + ev + '</ul>' : '<p class="par-empty">Yeni bir tarih yok. · No new dates.</p>') + '</section>' +
      '</div></div>';
  }

  var PR = root.ParentReport = {
    homeHtml: homeHtml, cloudUp: cloudUp, cloudDown: cloudDown,
    names: names, parentsOf: parentsOf, build: build, save: save, reportOf: reportOf, cardHtml: cardHtml,
    /** Pupils of the four classes. */
    pupils: function () { var st = S(), out = []; ['class-3a', 'class-3b', 'class-4a', 'class-4b'].forEach(function (c) { (st.getStudents(c) || []).forEach(function (p) { out.push(p); }); }); return out; },
    openAll: function () {
      css(); var box = document.getElementById('pr-sheet'); if (!box) { box = document.createElement('div'); box.id = 'pr-sheet'; document.body.appendChild(box); }
      var have = Object.keys(names()).length;
      box.innerHTML = '<div class="pr-noprint" style="color:#e8eefc;font-family:Inter,system-ui,sans-serif;max-width:780px;margin:0 auto 14px"><h2 style="margin:0 0 6px">🧾 Parent reports for all four classes</h2>' +
        '<div style="color:#94a3b8;font-size:.9rem">Parents\' names found on this computer: <b>' + have + '</b>. Reports are made from each pupil\'s real data (skills, quiz in words, homework, points) with a short comment in English and Turkish. Read a few before you print.</div>' +
        '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><label class="pr-btn o" style="display:inline-block">📂 Load parents’ names (file)<input id="pr-file" type="file" accept=".json,application/json" style="display:none"></label><button class="pr-btn" id="pr-make">⚙️ Make / update all reports</button><button class="pr-btn o" id="pr-print" disabled>🖨️ Print all</button><button class="pr-btn o" id="pr-up">☁️ Save to the cloud</button><button class="pr-btn o" id="pr-down">☁️ Load from the cloud</button><button class="pr-btn o" style="margin-left:auto" onclick="ParentReport.close()">Close ✕</button></div><div id="pr-msg" style="margin-top:8px;color:#fbbf24"></div></div><div id="pr-list"></div>';
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
      box.querySelector('#pr-up').onclick = function () { var msg = box.querySelector('#pr-msg'); msg.textContent = 'Saving to the cloud…'; cloudUp().then(function (n) { msg.textContent = '✓ ' + n + ' reports saved to the cloud (without the parents’ names).'; }, function (e) { msg.textContent = 'Could not save to the cloud: ' + ((e && e.message) || 'no answer') + '. Nothing was lost; it is still on this computer.'; }); };
      box.querySelector('#pr-down').onclick = function () { var msg = box.querySelector('#pr-msg'); msg.textContent = 'Reading from the cloud…'; cloudDown().then(function (n) { msg.textContent = n ? '✓ ' + n + ' reports loaded from the cloud.' : 'Nothing new in the cloud (this computer has all of them, or none were saved yet).'; if (n) { var ps = PR.pupils(); box.querySelector('#pr-list').innerHTML = ps.map(function (p) { var rr = reportOf(p.id); return rr ? cardHtml(rr) : ''; }).join(''); box.querySelector('#pr-print').disabled = false; box.querySelector('#pr-print').onclick = function () { window.print(); }; } }, function (e) { msg.textContent = 'Could not read the cloud: ' + ((e && e.message) || 'no answer') + '.'; }); };
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
      return '<section class="par-card"><h3>🧾 Term report</h3><p class="par-empty" style="color:#cbd5e1">' + esc(rep.term) + ' · ' + esc(rep.date) + '</p><button type="button" class="par-link" onclick="ParentReport.open(\'' + esc(rep.id) + '\')">Open the report →</button></section>';
    }
  };
})(typeof window !== 'undefined' ? window : this);
