/* Smart Board: today's lesson words.
   Reads the platform's classes and weekly timetable (saved in this browser by the platform), finds the lesson
   being taught now, and takes its vocabulary from the Library. The teacher can always choose another lesson
   or type their own words. The big platform files are loaded only when the words are first needed. */
(function (root) {
  'use strict';

  const PREF_KEY = 'smartboard.lesson.v1';
  const DEFAULT_CLASSES = [
    { id: 'class-3a', name: 'Grade 3A', grade: 3 }, { id: 'class-3b', name: 'Grade 3B', grade: 3 },
    { id: 'class-4a', name: 'Grade 4A', grade: 4 }, { id: 'class-4b', name: 'Grade 4B', grade: 4 }
  ];
  let loading = null;

  function lsGet(k) { try { return JSON.parse(root.localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  const todayKey = () => new Date().toISOString().slice(0, 10);

  function master() { const m = lsGet('eaa_master_school_v6'); return m && typeof m === 'object' ? m : null; }
  function gradeNum(v) { const m = String(v == null ? '' : v).match(/\d/); return m ? Number(m[0]) : 0; }

  function loadScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src; s.onload = () => resolve(true); s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  // Lets the timetable code read the saved timetable without loading the whole platform
  function shimStore() {
    if (root.ClassroomStore) return;
    const cfg = () => { const m = master(); return (m && m.classroomStore && m.classroomStore.config) || {}; };
    root.ClassroomStore = {
      getTimetable: () => cfg().timetable || {},
      getCalendar: () => cfg().calendar || [],
      setTimetable() {}, setCalendar() {},
      getCalendarFlag: () => true, setCalendarFlag() {}
    };
  }

  function ensure() {
    if (loading) return loading;
    shimStore();
    loading = (async () => {
      if (!root.GAMES_DATA) await loadScript('../js/games-data.js?v=sb1');
      if (!root.CalendarView) await loadScript('../js/calendar-view.js?v=sb1');
      if (!root.Timetable) await loadScript('../js/timetable.js?v=sb1');
      return true;
    })();
    return loading;
  }

  function classes() {
    const m = master();
    const list = (m && Array.isArray(m.classes) ? m.classes : []).filter((c) => c && c.id && !c.archived)
      .map((c) => ({ id: c.id, name: c.name || c.id, grade: gradeNum(c.grade) || gradeNum(c.name) }));
    return list.length ? list : DEFAULT_CLASSES.slice();
  }
  function activeClassId() {
    const pref = lsGet(PREF_KEY);
    if (pref && pref.classId) return pref.classId;
    const m = master(), list = classes();
    if (m && m.activeClassId && list.some((c) => c.id === m.activeClassId)) return m.activeClassId;
    let name = '';
    try { name = root.localStorage.getItem('adventure_active_class') || ''; } catch (e) { name = ''; }
    const hit = list.find((c) => c.name === name || c.id === name);
    return hit ? hit.id : (list[0] && list[0].id) || '';
  }
  const classById = (id) => classes().find((c) => c.id === id) || null;

  function gradesOf(e) {
    const out = new Set();
    [e.grade].concat(Array.isArray(e.grades) ? e.grades : []).forEach((g) => {
      const s = String(g == null ? '' : g);
      const range = s.match(/(\d)\s*[–-]\s*(\d)/);
      if (range) for (let k = Number(range[1]); k <= Number(range[2]); k++) out.add(k);
      else { const n = gradeNum(s); if (n) out.add(n); }
    });
    return out;
  }
  function wordsOf(e) {
    const v = (e && e.vocabulary) || {};
    let w = (Array.isArray(v.core) ? v.core : []).slice();
    if (w.length < 6 && Array.isArray(v.supporting)) w = w.concat(v.supporting);
    const seen = new Set();
    return w.map((x) => String(x).trim()).filter((x) => x && x.length <= 30 && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase())).slice(0, 24);
  }
  function lessonsFor(grade) {
    const g = root.GAMES_DATA || [];
    return g.filter((e) => wordsOf(e).length >= 3 && (!grade || !gradesOf(e).size || gradesOf(e).has(grade)) && e.type !== 'textbook' && e.id !== 'smart-board')
      .slice().reverse(); // newest lessons are at the end of the Library list
  }
  const byId = (id) => (root.GAMES_DATA || []).find((e) => e.id === id) || null;
  const norm = (r) => String(r || '').replace(/^\.?\//, '').replace(/#.*$/, '');
  function entryForRoute(route) {
    if (!route) return null;
    const g = (root.GAMES_DATA || []).filter((e) => wordsOf(e).length >= 3);
    const r = norm(route), path = r.split('?')[0];
    return g.find((e) => norm(e.url || e.route) === r) || g.find((e) => norm(e.url || e.route).split('?')[0] === path) || null;
  }

  // The lesson being taught now (or next) for this class, from the weekly timetable
  function todaysLesson(classId) {
    if (!root.Timetable || !root.Timetable.today) return null;
    let t;
    try { t = root.Timetable.today(classId); } catch (e) { return null; }
    const list = (t && t.list) || [];
    if (!list.length) return null;
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    const startOf = (x) => { const m = String(x.time || '').match(/(\d{1,2}):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : -1; };
    const ordered = list.slice().sort((a, b) => {
      const sa = startOf(a), sb = startOf(b);
      const ra = sa < 0 ? 3 : (mins >= sa && mins < sa + 40 ? 0 : sa > mins ? 1 : 2);
      const rb = sb < 0 ? 3 : (mins >= sb && mins < sb + 40 ? 0 : sb > mins ? 1 : 2);
      return ra - rb || (ra === 2 ? sb - sa : sa - sb);
    });
    for (const item of ordered) {
      const e = entryForRoute(item.route);
      if (e) return { entry: e, time: item.time, title: item.title, day: t.label };
    }
    return null;
  }

  /* The words the board uses now: the teacher's own words, a chosen lesson, or today's lesson */
  async function current() {
    await ensure();
    const pref = lsGet(PREF_KEY) || {};
    const classId = pref.classId || activeClassId();
    const cls = classById(classId);
    if (pref.custom && pref.custom.length && pref.day === todayKey()) return { classId, cls, words: pref.custom, title: 'My own words', source: 'custom' };
    if (pref.entryId && pref.day === todayKey()) {
      const e = byId(pref.entryId);
      if (e) return { classId, cls, words: wordsOf(e), title: e.title, entry: e, source: 'chosen' };
    }
    const t = todaysLesson(classId);
    if (t) return { classId, cls, words: wordsOf(t.entry), title: t.entry.title, entry: t.entry, time: t.time, source: 'timetable' };
    const first = lessonsFor(cls ? cls.grade : 0)[0];
    if (first) return { classId, cls, words: wordsOf(first), title: first.title, entry: first, source: 'latest' };
    return { classId, cls, words: [], title: '', source: 'none' };
  }
  function choose(p) {
    const pref = Object.assign({}, lsGet(PREF_KEY) || {}, p, { day: todayKey() });
    lsSet(PREF_KEY, pref);
  }

  root.SmartLessons = { ensure, classes, activeClassId, classById, lessonsFor, wordsOf, todaysLesson, current, choose, byId };
})(window);
