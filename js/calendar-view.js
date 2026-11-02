/* Teacher calendar (sidebar: 📅 Calendar). Month and Week views of: the lessons of every class (from the weekly timetable, or the k12 timetable until it is set),
   the plan of the week (Unit 4, Alice, quizzes), birthdays (first names only), meetings and anything the teacher adds.
   Events are kept in the Classroom Store settings, so they sync to the cloud like the timetable. No pupil names are stored in events. */
(function (root) {
  'use strict';
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var TYPES = {
    lesson: ['📖', 'Lesson', '#94a3b8'], unit4: ['📘', 'Unit 4', '#38bdf8'], alice: ['🫖', 'Alice', '#f472b6'], quiz: ['📝', 'Quiz', '#f59e0b'],
    book: ['📗', 'Gov book', '#10b981'], halloween: ['🎃', 'Halloween', '#f97316'], birthday: ['🎂', 'Birthday', '#34d399'], meeting: ['👥', 'Meeting', '#a78bfa'], task: ['✅', 'To do', '#fb923c'], chuseok: ['🌕', 'Chuseok', '#fbbf24'], other: ['📌', 'Other', '#cbd5e1']
  };
  // k12 timetable (19-23 Oct 2026; the same every week): classId -> weekday (1=Mon) -> start times
  var K12 = {
    'class-3a': { 1: ['13:30', '14:15'], 2: ['10:30', '11:15'], 4: ['09:45'], 5: ['10:30', '11:15'] },
    'class-3b': { 1: ['16:05'], 3: ['10:30', '11:15'], 4: ['10:30', '11:15'], 5: ['09:00', '09:45'] },
    'class-4a': { 1: ['10:30', '11:15'], 2: ['15:20'], 3: ['14:15', '15:20'], 4: ['16:05', '16:55'] },
    'class-4b': { 1: ['09:45'], 2: ['09:00', '09:45'], 3: ['12:45', '13:30'], 5: ['14:15', '15:20'] }
  };
  // the plan of the week 19-23 Oct (added once to the calendar; every entry can be edited or deleted)
  var SEED = [
    ['2026-10-19', '13:30', 'class-3a', 'unit4', 'U4-1 Case File 1: Picture on the Wall'], ['2026-10-19', '14:15', 'class-3a', 'unit4', 'U4-2 Case File 2: Where Is She?'], ['2026-10-20', '10:30', 'class-3a', 'unit4', 'Unit 4 · lesson 3'], ['2026-10-20', '11:15', 'class-3a', 'chuseok', 'Chuseok Moon Song (Week 3)'],
    ['2026-10-22', '09:45', 'class-3a', 'unit4', 'Unit 4 · lesson 5'], ['2026-10-23', '10:30', 'class-3a', 'unit4', 'Unit 4 · review game'], ['2026-10-23', '11:15', 'class-3a', 'quiz', 'Unit 4 QUIZ (print the sheets)'],
    ['2026-10-19', '16:05', 'class-3b', 'unit4', 'U4-1 Case File 1: Picture on the Wall'], ['2026-10-21', '10:30', 'class-3b', 'unit4', 'Unit 4 · lesson 2'], ['2026-10-21', '11:15', 'class-3b', 'chuseok', 'Chuseok Moon Song (Week 3)'], ['2026-10-22', '10:30', 'class-3b', 'unit4', 'Unit 4 · lesson 4'],
    ['2026-10-22', '11:15', 'class-3b', 'unit4', 'Unit 4 · lesson 5'], ['2026-10-23', '09:00', 'class-3b', 'unit4', 'Unit 4 · review game'], ['2026-10-23', '09:45', 'class-3b', 'quiz', 'Unit 4 QUIZ (print the sheets)'],
    ['2026-10-19', '10:30', 'class-4a', 'unit4', 'U4-1 Team Players'], ['2026-10-19', '11:15', 'class-4a', 'alice', 'Alice 1 · phrases'], ['2026-10-20', '15:20', 'class-4a', 'unit4', 'U4-2 Reading 1: Dream Work'], ['2026-10-21', '14:15', 'class-4a', 'alice', 'Alice 2 · pairs by heart'],
    ['2026-10-21', '15:20', 'class-4a', 'unit4', 'U4-3 Reading 2: Late for the Show'], ['2026-10-22', '16:05', 'class-4a', 'alice', 'Alice 3 · dress rehearsal'], ['2026-10-22', '16:55', 'class-4a', 'quiz', 'U4-4 Think Together + QUIZ'],
    ['2026-10-19', '09:45', 'class-4b', 'alice', 'Alice 1 · phrases'], ['2026-10-20', '09:00', 'class-4b', 'unit4', 'U4-1 Team Players'], ['2026-10-20', '09:45', 'class-4b', 'unit4', 'U4-2 Reading 1: Dream Work'], ['2026-10-21', '12:45', 'class-4b', 'alice', 'Alice 2 · pairs by heart'],
    ['2026-10-21', '13:30', 'class-4b', 'unit4', 'U4-3 Reading 2: Late for the Show'], ['2026-10-23', '14:15', 'class-4b', 'alice', 'Alice 3 · dress rehearsal'], ['2026-10-23', '15:20', 'class-4b', 'quiz', 'U4-4 Think Together + QUIZ'],
    ['2026-10-19', '', '', 'task', 'Post Alice practice 3 on k12 and print the parent note'], ['2026-10-22', '', '', 'chuseok', 'Moon Song homework due (3/A and 3/B): send the link chuseok-moon-homework'], ['2026-10-24', '', '', 'meeting', 'English parent meeting (individual, 10 minutes each)'], ['2026-10-25', '', '', 'alice', 'Alice Tea Party (date to be confirmed)']
  ];
  var st = { y: 0, m: 0, mode: 'month', cls: 'all', sel: '', wk: '' };
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function monday(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  function classes() { return (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; }); }
  function shortName(id) { var c = (S().getClass ? S().getClass(id) : null); return c ? String(c.name || id).replace(/^Grade\s*/i, '') : String(id).replace('class-', '').toUpperCase(); }

  // ---------------------------------------------------------------- data
  function store() { return root.ClassroomStore; }
  function customEvents() { try { return (store() && store().getCalendar && store().getCalendar()) || []; } catch (e) { return []; } }
  function saveEvents(list) { try { store().setCalendar(list); } catch (e) { alert('Could not save the calendar.'); } }
  function seedOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed1')) return;
      var list = customEvents().slice();
      SEED.forEach(function (r, i) { list.push({ id: 'seed1-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: '' }); });
      saveEvents(list); store().setCalendarFlag('seed1');
    } catch (e) { /* the calendar still works without the seed */ }
  }
  function retitleOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed2')) return;
      var M = {'class-4a|2026-10-19|10:30': 'U4-1 Team Players', 'class-4a|2026-10-20|15:20': 'U4-2 Reading 1: Dream Work', 'class-4a|2026-10-21|15:20': 'U4-3 Reading 2: Late for the Show', 'class-4a|2026-10-22|16:55': 'U4-4 Think Together + QUIZ', 'class-4b|2026-10-20|09:00': 'U4-1 Team Players', 'class-4b|2026-10-20|09:45': 'U4-2 Reading 1: Dream Work', 'class-4b|2026-10-21|13:30': 'U4-3 Reading 2: Late for the Show', 'class-4b|2026-10-23|15:20': 'U4-4 Think Together + QUIZ'}, list = customEvents().slice(), n = 0;
      list.forEach(function (e) { var k = e.classId + '|' + e.date + '|' + e.time; if (/^seed1-/.test(e.id) && M[k] && /^Unit 4 /.test(e.title)) { e.title = M[k]; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed2');
    } catch (e) { /* ignore */ }
  }
  function shortenOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed3')) return;
      var LONG = {'U4-1 Team Players: Think-Pair-Share, sports words, Sparks story (book pp. 56-61)': 'U4-1 Team Players', 'U4-2 Reading 1: Teamwork Makes the Dream Work + spelling or (pp. 58-60)': 'U4-2 Reading 1: Dream Work', 'U4-3 Reading 2: Late for the Show, the play (pp. 61-70)': 'U4-3 Reading 2: Late for the Show', 'U4-4 Think Together (p. 71) + review + QUIZ': 'U4-4 Think Together + QUIZ'}, N = {'U4-1 Team Players': 'Book pp. 56-61: Think-Pair-Share, sports words, the Sparks story', 'U4-2 Reading 1: Dream Work': 'Book pp. 58-60: Teamwork Makes the Dream Work + spelling pattern or', 'U4-3 Reading 2: Late for the Show': 'Book pp. 61-70: the play, sequence of events, story map', 'U4-4 Think Together + QUIZ': 'Book p. 71: Venn diagram and speaking, then review and the 20-mark quiz'}, list = customEvents().slice(), n = 0;
      list.forEach(function (e) { if (/^seed1-/.test(e.id) && LONG[e.title]) { e.note = N[LONG[e.title]]; e.title = LONG[e.title]; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed3');
    } catch (e) { /* ignore */ }
  }
  function g3Titles() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed4')) return;
      var M = {'class-3a|2026-10-19|13:30': ['U4-1 Case File 1: Picture on the Wall', 'Book pp. 56-57, 59: Think-Pair-Share, spot the changes, case words, sneak game, past tense, timeline'], 'class-3a|2026-10-19|14:15': ['U4-2 Case File 2: Where Is She?', 'Book pp. 58-64: act out the robbery, newspaper race, quiz show, four corners debate, draw two faces'], 'class-3b|2026-10-19|16:05': ['U4-1 Case File 1: Picture on the Wall', 'Book pp. 56-57, 59: Think-Pair-Share, spot the changes, case words, sneak game, past tense, timeline']}, list = customEvents().slice(), n = 0;
      list.forEach(function (e) { var v = M[e.classId + '|' + e.date + '|' + e.time]; if (v && /^seed1-/.test(e.id) && /^Unit 4 /.test(e.title)) { e.title = v[0]; e.note = v[1]; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed4');
    } catch (e) { /* ignore */ }
  }
  function moonOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed5')) return;
      var list = customEvents().slice(), n = 0, note = 'Week 3 of the Chuseok festival: learn the video song (11 lines: right/left, in/out, tall/low, fast/slow, done, sit, rest + Ganggangsullae), sing it with a drummer, a leader and circles, then sing and move. Lesson: chuseok-moon-song. Homework due Thu 22.';
      var M = { 'class-3a|2026-10-20|11:15': 1, 'class-3b|2026-10-21|11:15': 1 };
      list.forEach(function (e) { if (M[e.classId + '|' + e.date + '|' + e.time] && /^seed1-/.test(e.id) && e.type === 'unit4') { e.type = 'chuseok'; e.title = 'Chuseok Moon Song (Week 3)'; e.note = note; n++; } });
      if (!list.some(function (e) { return e.id === 'seed5-hw'; })) { list.push({ id: 'seed5-hw', date: '2026-10-22', time: '', classId: '', type: 'chuseok', title: 'Moon Song homework due (3/A and 3/B): send the link chuseok-moon-homework', note: '' }); n++; }
      if (n) saveEvents(list); store().setCalendarFlag('seed5');
    } catch (e) { /* ignore */ }
  }
  /* Moon Song v2 (the video song's 11 lines): refresh the note of the two lessons and the homework reminder once */
  function moonNoteOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed6')) return;
      var list = customEvents().slice(), n = 0, note = 'Week 3 of the Chuseok festival: learn the video song (11 lines: right/left, in/out, tall/low, fast/slow, done, sit, rest + Ganggangsullae), sing it with a drummer, a leader and circles, then sing and move. Lesson: chuseok-moon-song. Homework due Thu 22.';
      list.forEach(function (e) {
        if (e.type === 'chuseok' && e.title === 'Chuseok Moon Song (Week 3)') { e.note = note; n++; }
        if (e.id === 'seed5-hw') { e.note = 'Quick 5-minute homework: listen to the 11 song lines, choose the word (opposites), sing it at home, choose 3 moves. Link: chuseok-moon-homework/index.html'; n++; }
      });
      if (n) saveEvents(list); store().setCalendarFlag('seed6');
    } catch (e) { /* ignore */ }
  }
  /* Grade 3 Mona Lisa review lesson (after the book pages): title and note on the 3/A and 3/B lesson once */
  function monaOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed7')) return;
      var list = customEvents().slice(), n = 0;
      var M = { 'class-3a|2026-10-20|10:30': 1, 'class-3b|2026-10-21|10:30': 1 };
      var note = 'Review after the book pages pp. 56-59. Games: Look Say Act (case words), Sneak to the Mona Lisa, Painting Race (two teams build a Mona Lisa jigsaw by answering past tense and word questions; wrong answers can be stolen), story order bonus. Lesson: review-g3-museum.';
      list.forEach(function (e) { if (M[e.classId + '|' + e.date + '|' + e.time] && /^seed1-/.test(e.id)) { e.title = 'U4 Review: Mona Lisa Mystery (Painting Race)'; e.type = 'unit4'; e.note = note; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed7');
    } catch (e) { /* ignore */ }
  }
  /* Grade 4 Reading 2 review lesson (after the book pages 62-70): title and note on the 4/B and 4/A lesson once */
  function showOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed8')) return;
      var list = customEvents().slice(), n = 0;
      var M = { 'class-4b|2026-10-21|13:30': 1, 'class-4a|2026-10-21|15:20': 1 };
      var note = 'Review after the book pages 62-70 (Late for the Show). Games: Curtain Up (show, calm, platform, sank, alive), Get Harry to the Stage (put the events in order, the train moves), Spotlight (who said it?), Excuse Round (I was late because...). Lesson: review-g4-show.';
      list.forEach(function (e) { if (M[e.classId + '|' + e.date + '|' + e.time] && /^seed1-/.test(e.id)) { e.title = 'U4-3 Review: Late for the Show'; e.note = note; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed8');
    } catch (e) { /* ignore */ }
  }
  /* Grade 3 Reading 2 & Think Together (The Angry Mountain, book pp. 64-71) + Friday review/quiz notes */
  function mountainOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed9')) return;
      var list = customEvents().slice(), n = 0;
      var M = {
        'class-3a|2026-10-22|09:45': ['U4-3 Reading 2: The Angry Mountain (pp. 64-71)', 'Book pp. 64-71: Explore the Reading (p. 64), Cause & Effect (p. 65), Reading 2 The Angry Mountain (pp. 66-69: thunder, bark, ash, dream, sunrise), -nd blends & feelings (p. 70), Think Together (p. 71). Lesson: review-g3-mountain.'],
        'class-3b|2026-10-22|10:30': ['U4-2 Case File 2: Where Is She? (pp. 58-64)', 'Book pp. 58-64: act out the robbery, newspaper race, detective quiz show, four corners debate, draw two faces. Lesson: unit4-g3-lessons?lesson=2 & review-g3-mona.'],
        'class-3b|2026-10-22|11:15': ['U4-3 Reading 2: The Angry Mountain (pp. 64-71)', 'Book pp. 64-71: Explore the Reading (p. 64), Cause & Effect (p. 65), Reading 2 The Angry Mountain (pp. 66-69: thunder, bark, ash, dream, sunrise), -nd blends & feelings (p. 70), Think Together (p. 71). Lesson: review-g3-mountain.'],
        'class-3a|2026-10-23|10:30': ['U4-4 Think Together + Game Maker Review', 'Book pp. 70-71 (-nd words, excited/surprised/upset, compare the two readings) + Game Maker set: Grade 3 · The Angry Mountain (angry-g3).'],
        'class-3a|2026-10-23|11:15': ['Unit 4 QUIZ: What Happened? (20 pts)', 'Print unit4-g3-lessons/quiz-grade3.html (Mona Lisa + The Angry Mountain + Past Tense + Cause & Effect + -nd words).'],
        'class-3b|2026-10-23|09:00': ['U4-4 Think Together + Game Maker Review', 'Book pp. 70-71 (-nd words, excited/surprised/upset, compare the two readings) + Game Maker set: Grade 3 · The Angry Mountain (angry-g3).'],
        'class-3b|2026-10-23|09:45': ['Unit 4 QUIZ: What Happened? (20 pts)', 'Print unit4-g3-lessons/quiz-grade3.html (Mona Lisa + The Angry Mountain + Past Tense + Cause & Effect + -nd words).']
      };
      list.forEach(function (e) { var v = M[e.classId + '|' + e.date + '|' + e.time]; if (v && /^seed1-/.test(e.id)) { e.title = v[0]; e.note = v[1]; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed9');
    } catch (e) { /* ignore */ }
  }
  /* Grade 3 standalone Lesson 3 (unit4-g3-angry-mountain) & Lesson 4 (unit4-g3-phonics-think) */
  function mountainSplitOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed10')) return;
      var list = customEvents().slice(), n = 0;
      var M = {
        'class-3a|2026-10-22|09:45': ['U4-3 Reading 2: The Angry Mountain (pp. 65-69)', 'Standalone Pro Lesson 3 (unit4-g3-angry-mountain): Island Explorer Map (thunder, bark, ash, dream, sunrise), Cause & Effect Gear Machine (BECAUSE/SO), 5-Scene Story Theater, Sail to the Rescue Ship!'],
        'class-3b|2026-10-22|11:15': ['U4-3 Reading 2: The Angry Mountain (pp. 65-69)', 'Standalone Pro Lesson 3 (unit4-g3-angry-mountain): Island Explorer Map (thunder, bark, ash, dream, sunrise), Cause & Effect Gear Machine (BECAUSE/SO), 5-Scene Story Theater, Sail to the Rescue Ship!'],
        'class-3a|2026-10-23|10:30': ['U4-4 Phonics (-nd) & Think Together (pp. 70-71)', 'Standalone Pro Lesson 4 (unit4-g3-phonics-think): Explore the Reading Check, Volcano Freeze & 4 Feeling Corners, -nd Phonics Letter Factory, Pop the -nd Balloons, Two-Story Train & 3-Step Interview + Game Maker (angry-g3).'],
        'class-3b|2026-10-23|09:00': ['U4-4 Phonics (-nd) & Think Together (pp. 70-71)', 'Standalone Pro Lesson 4 (unit4-g3-phonics-think): Explore the Reading Check, Volcano Freeze & 4 Feeling Corners, -nd Phonics Letter Factory, Pop the -nd Balloons, Two-Story Train & 3-Step Interview + Game Maker (angry-g3).']
      };
      list.forEach(function (e) { var v = M[e.classId + '|' + e.date + '|' + e.time]; if (v && /^seed1-/.test(e.id)) { e.title = v[0]; e.note = v[1]; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed10');
    } catch (e) { /* ignore */ }
  }
  /* Unit 4 review lesson on Fri 23 Oct (the 'review game' slots of 3/A and 3/B): title and note once */
  function u4ReviewOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed11')) return;
      var list = customEvents().slice(), n = 0, M = { 'class-3a|2026-10-23|10:30': 1, 'class-3b|2026-10-23|09:00': 1 };
      var note = 'Lesson 1 (remember it, 35 min): story cards, words and acting, put the events in order, cause and effect, reading quiz. Lesson 2 (play, 30 min): games in Game Maker with the Unit 4 questions (race, cannon, tiles, penalty, balloons, snakes, memory). Lesson: review-unit4 (?grade=3).';
      list.forEach(function (e) { if (M[e.classId + '|' + e.date + '|' + e.time]) { e.title = 'U4 Review: remember it, then play'; e.note = note; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed11');
    } catch (e) { /* ignore */ }
  }
  /* 4A on Mon 26 Oct: the Units 1-4 quiz (10:30) and the one-by-one speaking check (11:15); added once, then editable in the calendar */
  function quizSpeakOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed12')) return;
      var list = customEvents().slice();
      list = list.filter(function (e) { return !(e.classId === 'class-4a' && e.date === '2026-10-26' && (e.time === '10:30' || e.time === '11:15')); });
      list.push({ id: 'seed12-quiz', date: '2026-10-26', time: '10:30', classId: 'class-4a', type: 'quiz', title: 'Units 1-4 QUIZ (A/B): listening, words, reading, writing', note: '25 minutes, 32 marks, print quiz-g4-units1-4 (Version A and B, double-sided). Listening: quiz-g4-units1-4/listening.html. Answers and bands: key.html. Class record: record.html. Lesson plan: Grade4-Units1-4-Quiz-Lesson-Plan.' });
      list.push({ id: 'seed12-speak', date: '2026-10-26', time: '11:15', classId: 'class-4a', type: 'unit4', title: 'Speaking check, one by one (Units 1-4)', note: 'Open speaking-g4/index.html on your laptop; print the practice cards (speaking-g4/cards.html) for pairs. 4 tasks per pupil, scored 0-2 on accuracy. Lesson plan: Grade4-Speaking-Check-Lesson-Plan.' });
      saveEvents(list); store().setCalendarFlag('seed12');
    } catch (e) { /* ignore */ }
  }
  function weekPlanOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed13')) return;
      var list = customEvents().slice();
      list = list.filter(function (e) { return !(e.id === 'seed12-quiz' || e.id === 'seed12-speak' || (e.type === 'alice' && e.date === '2026-10-25')); });
      var cp = 'Our Class Plan: rules, class traffic light, Voice Box (open class-reset/index.html; print poster.html)';
      var tea = 'Alice Tea Party in the garden (running order and props: alice-party-print/index.html). Bell and traffic light rules apply';
      var rows = [
        ['2026-10-26', '10:30', 'class-4a', 'unit4', 'Our Class Plan lesson', cp], ['2026-10-26', '11:15', 'class-4a', 'alice', 'Alice rehearsal in class (last run before the party)', ''],
        ['2026-10-26', '09:45', 'class-4b', 'unit4', 'Our Class Plan lesson', cp],
        ['2026-10-27', '15:20', 'class-4a', 'alice', 'Alice Tea Party (garden, includes the 10 minute break)', tea],
        ['2026-10-27', '09:00', 'class-4b', 'alice', 'Alice Tea Party (garden, 2 lessons)', tea], ['2026-10-27', '09:45', 'class-4b', 'alice', 'Alice Tea Party (garden, 2 lessons)', tea],
        ['2026-10-30', '14:15', 'class-4b', 'unit4', 'Revision skill lesson 1: words and writing (no new content)', 'Groups: Support, Core, Challenge. Everyone writes on an answer card at the same time.'],
        ['2026-10-30', '15:20', 'class-4b', 'lesson', 'Book lesson (revise the book, no new pages)', '']
      ];
      rows.forEach(function (r, i) { list.push({ id: 'seed13-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: r[5] }); });
      saveEvents(list); store().setCalendarFlag('seed13');
    } catch (e) { /* ignore */ }
  }
  function mondayG3Once() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed15')) return;
      var list = customEvents().slice();
      list = list.filter(function (e) { return !(e.date === '2026-10-26' && (e.classId === 'class-3a' || e.classId === 'class-3b')); });
      var cp = 'Our Class Plan: 3 rules, then the class traffic light, moving, helping, Voice Box, practice, promise (35 minutes). Open class-reset/index.html; print poster.html. Teach the rules first, switch the light on after the rules scene.';
      var g = 'Play, no new content: Game Maker games with mixed questions from Units 1-4 (31 questions: words and sentences). Open game-maker/index.html?set=u14-g3&game=cannon (also race, tiles, memory). Everybody answers on a card. Ordinary cartoon skin, no Halloween.';
      [['13:30', 'class-3a', 'unit4', 'Our Class Plan lesson', cp], ['14:15', 'class-3a', 'unit4', 'Units 1-4 revision games (play)', g], ['16:05', 'class-3b', 'unit4', 'Our Class Plan lesson', cp]].forEach(function (r, i) {
        list.push({ id: 'seed15-' + i, date: '2026-10-26', time: r[0], classId: r[1], type: r[2], title: r[3], note: r[4] });
      });
      saveEvents(list); store().setCalendarFlag('seed15');
    } catch (e) { /* ignore */ }
  }
  function rev1NoteOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed16')) return;
      var list = customEvents().slice(), n = 0;
      list.forEach(function (e) { if (e.id === 'seed13-6') { e.title = 'Revision 1: words and writing (no new content)'; e.note = 'Print revision-pack/Grade4-Revision-1-Words-and-Writing-Pack.pdf (writing sheet, answer cards, exit tickets). Remember first, write it on paper, answer-card game, exit ticket. Plan: lesson-plans/Grade4-Revision-1-Words-and-Writing-Lesson-Plan. Open the Command Center, Revision board for groups and pairs.'; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed16');
    } catch (e) { /* ignore */ }
  }
  function rev1aOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed17')) return;
      var list = customEvents().slice();
      list = list.filter(function (e) { return !(e.classId === 'class-4a' && e.date === '2026-11-02' && e.time === '10:30'); });
      list.push({ id: 'seed17-0', date: '2026-11-02', time: '10:30', classId: 'class-4a', type: 'unit4', title: 'Revision 1: reading and writing (no new content)', note: 'Print revision-pack/Grade4A-Revision-1-Reading-and-Writing-Pack.pdf (2 reading texts, writing page, exit tickets, teacher key). Remember first in Game Maker (Smart mix, Monsters = 4A, Answer cards = On), read, write, exit ticket. Plan: lesson-plans/Grade4A-Revision-1-Reading-and-Writing-Lesson-Plan.' });
      saveEvents(list); store().setCalendarFlag('seed17');
    } catch (e) { /* ignore */ }
  }
  function g3QuizOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed18')) return;
      var list = customEvents().slice(), q = 'Print quiz-g3-units1-4 (Version A and B, 2 pages each, double-sided). Listening: quiz-g3-units1-4/listening.html (same for A and B). Marks into the class record page. Plan: lesson-plans/Grade3-Units1-4-Diagnostic-Quiz-Lesson-Plan.';
      var g = 'Calm revision games after the quiz: game-maker/index.html?set=u14-g3 (Monsters = your class, Answer cards = On).';
      var rows = [['2026-10-27', '10:30', 'class-3a', 'quiz', 'Units 1-4 diagnostic QUIZ (A/B)', q], ['2026-10-27', '11:15', 'class-3a', 'unit4', 'Units 1-4 revision games (play)', g],
        ['2026-10-28', '10:30', 'class-3b', 'quiz', 'Units 1-4 diagnostic QUIZ (A/B)', q], ['2026-10-28', '11:15', 'class-3b', 'unit4', 'Units 1-4 revision games (play)', g]];
      list = list.filter(function (e) { return !rows.some(function (r) { return e.date === r[0] && e.time === r[1] && e.classId === r[2]; }); });
      rows.forEach(function (r, i) { list.push({ id: 'seed18-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: r[5] }); });
      saveEvents(list); store().setCalendarFlag('seed18');
    } catch (e) { /* ignore */ }
  }
  function g3RevOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed19')) return;
      var list = customEvents().slice();
      var r1 = 'Print revision-pack/Grade3-Revision-1-Words-and-Writing-Pack.pdf. Remember first (Game Maker, Smart mix Grade 3, Answer cards = On), write it, answer-card game, exit ticket. Plan: lesson-plans/Grade3-Revision-1-Words-and-Writing-Lesson-Plan.';
      var r2 = 'Print revision-pack/Grade3-Revision-2-Reading-and-Writing-Pack.pdf. Remember first, read the story and the fact cards, write it, exit ticket. Plan: lesson-plans/Grade3-Revision-2-Reading-and-Writing-Lesson-Plan.';
      var rows = [['2026-10-30', '10:30', 'class-3a', 'Revision 1: words and writing (no new content)', r1], ['2026-10-30', '09:00', 'class-3b', 'Revision 1: words and writing (no new content)', r1],
        ['2026-11-02', '13:30', 'class-3a', 'Revision 2: reading and writing (no new content)', r2], ['2026-11-02', '16:05', 'class-3b', 'Revision 2: reading and writing (no new content)', r2]];
      list = list.filter(function (e) { return !rows.some(function (r) { return e.date === r[0] && e.time === r[1] && e.classId === r[2]; }); });
      rows.forEach(function (r, i) { list.push({ id: 'seed19-' + i, date: r[0], time: r[1], classId: r[2], type: 'unit4', title: r[3], note: r[4] }); });
      saveEvents(list); store().setCalendarFlag('seed19');
    } catch (e) { /* ignore */ }
  }
  /* Tea Party moved to another day (27 Oct): 4B and 4A get revision on Wed 28 Oct, 3A's missed games go to Fri 30 Oct */
  function wed28Once() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed20')) return;
      var list = customEvents().slice();
      var games4 = 'Calm revision games, no new content: game-maker/index.html?set=u14-g4&game=bowling (also cannon, race). Monsters = your class, Answer cards = On.';
      var book = 'Revise Unit 4 in the book, no new pages: Team Players and Late for the Show (pp. 56-71). Words first, then read aloud in pairs, then 3 questions in the notebook.';
      var r1a = 'Print revision-pack/Grade4A-Revision-1-Reading-and-Writing-Pack.pdf (2 reading texts, writing page, exit tickets, teacher key). Remember first in Game Maker (Smart mix, Monsters = 4A, Answer cards = On), read, write, exit ticket. Plan: lesson-plans/Grade4A-Revision-1-Reading-and-Writing-Lesson-Plan.';
      var g3 = 'The games 3A missed on Tue 27 Oct: game-maker/index.html?set=u14-g3 (Monsters = 3A, Answer cards = On).';
      var r1 = 'Print revision-pack/Grade3-Revision-1-Words-and-Writing-Pack.pdf. Remember first (Game Maker, Smart mix Grade 3, Answer cards = On), write it, answer-card game, exit ticket. Plan: lesson-plans/Grade3-Revision-1-Words-and-Writing-Lesson-Plan.';
      /* what really happened on Tue 27 Oct: no Tea Party, 4B had one revision lesson, 3A only the quiz */
      list = list.filter(function (e) {
        if (e.date === '2026-10-27' && e.type === 'alice') return false;
        if (e.date === '2026-10-27' && e.classId === 'class-3a' && e.time === '11:15') return false;
        if (e.classId === 'class-4a' && e.date === '2026-11-02' && e.time === '10:30') return false; // 4A Revision 1 moves to Wed 28
        if (e.classId === 'class-3a' && e.date === '2026-10-30') return false;
        if (e.date === '2026-10-28' && (e.classId === 'class-4a' || e.classId === 'class-4b')) return false;
        return true;
      });
      var rows = [
        ['2026-10-27', '09:00', 'class-4b', 'unit4', 'Revision lesson (Tea Party moved to another day)', ''],
        ['2026-10-28', '12:45', 'class-4b', 'lesson', 'Book lesson: revise Unit 4 (no new pages)', book],
        ['2026-10-28', '13:30', 'class-4b', 'unit4', 'Units 1-4 revision games (play)', games4],
        ['2026-10-28', '14:15', 'class-4a', 'unit4', 'Revision 1: reading and writing (no new content)', r1a],
        ['2026-10-28', '15:20', 'class-4a', 'unit4', 'Units 1-4 revision games (play)', games4],
        ['2026-10-30', '10:30', 'class-3a', 'unit4', 'Units 1-4 revision games (missed on Tuesday)', g3],
        ['2026-10-30', '11:15', 'class-3a', 'unit4', 'Revision 1: words and writing (no new content)', r1]
      ];
      rows.forEach(function (r, i) { list.push({ id: 'seed20-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: r[5] }); });
      saveEvents(list); store().setCalendarFlag('seed20');
    } catch (e) { /* ignore */ }
  }
  /* Fri 30 Oct: Grade 3 revision in the morning, the Grade 4 Tea Party in the afternoon (4B decorates in lesson 1, 4A after 4B in the other teacher's lesson) */
  function fri30Once() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed22')) return;
      var list = customEvents().slice();
      var r1 = 'Print revision-pack/Grade3-Revision-1-Words-and-Writing-Pack.pdf. Remember first (Game Maker, Smart mix Grade 3, Answer cards = On), write it, answer-card game, exit ticket. Plan: lesson-plans/Grade3-Revision-1-Words-and-Writing-Lesson-Plan.';
      var games = function (c) { return 'game-maker/index.html?set=smart-g3&game=balloon (Monsters = ' + c + ', Remember first = On, Answer cards = On), then Penalty Kick. Answer sheet: game-maker/Game-Answer-Sheet.pdf. Plan: lesson-plans/Grade3-Friday-Revision-Games-Lesson-Plan.'; };
      var tea = function (k) { return 'Tea Party HQ: alice-party/index.html (the plan, the show, print). Plan: lesson-plans/Grade' + k + '-Alice-Tea-Party-Lesson-Plan. Order of the day: lesson-plans/Friday-30-October-Order.'; };
      var rows = [
        ['09:00', 'class-3b', 'unit4', 'Revision 1: words and writing (no new content)', r1],
        ['09:45', 'class-3b', 'unit4', 'Units 1-4 revision games: play, write, review', games('3B')],
        ['10:30', 'class-3a', 'unit4', 'Units 1-4 revision games (missed on Tuesday)', games('3A')],
        ['11:15', 'class-3a', 'unit4', 'Revision 1: words and writing (no new content)', r1],
        ['14:15', 'class-4b', 'alice', 'Alice Tea Party · lesson 1: decorate the garden, make props, warm up', tea('4B')],
        ['15:20', 'class-4b', 'alice', 'Alice Tea Party · lesson 2: the show, cupcakes, photos, awards', tea('4B')],
        ['16:05', 'class-4a', 'alice', 'Alice Tea Party (the other teacher’s lesson, after 4B)', tea('4A')]
      ];
      list = list.filter(function (e) { return !(e.date === '2026-10-30' && rows.some(function (r) { return e.time === r[0] && e.classId === r[1]; })); });
      rows.forEach(function (r, i) { list.push({ id: 'seed22-' + i, date: '2026-10-30', time: r[0], classId: r[1], type: r[2], title: r[3], note: r[4] }); });
      saveEvents(list); store().setCalendarFlag('seed22');
    } catch (e) { /* ignore */ }
  }
  /* Wed 28 Oct: point the 4B and 4A lessons at their new lesson plans */
  function wed28PlansOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed21')) return;
      var P = { 'seed20-1': 'Grade4B-Unit4-Book-Revision-Lesson-Plan', 'seed20-2': 'Grade4-Units1-4-Revision-Games-Lesson-Plan', 'seed20-4': 'Grade4-Units1-4-Revision-Games-Lesson-Plan' };
      var list = customEvents().slice(), n = 0;
      list.forEach(function (e) { if (P[e.id] && String(e.note || '').indexOf(P[e.id]) < 0) { e.note = (e.note ? e.note + ' ' : '') + 'Plan: lesson-plans/' + P[e.id] + '.'; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed21');
    } catch (e) { /* ignore */ }
  }
  /* Default weekly program mapping K12 times to current Units 1-4 Speaking & Acting / Review lessons */
  var WEEK_TT = {
    'class-3a': {
      1: [{ t: '13:30', l: 'rev-g3-2' }, { t: '14:15', l: 'gm-speak-g3' }],
      2: [{ t: '10:30', l: 'gm-speak-g3' }, { t: '11:15', l: 'rev-u4-g3' }],
      4: [{ t: '09:45', l: 'rev-u14-g3' }],
      5: [{ t: '10:30', l: 'gm-speak-g3' }, { t: '11:15', l: 'karaoke-g3' }]
    },
    'class-3b': {
      1: [{ t: '16:05', l: 'gm-speak-g3' }],
      3: [{ t: '10:30', l: 'rev-g3-2' }, { t: '11:15', l: 'gm-speak-g3' }],
      4: [{ t: '10:30', l: 'rev-u4-g3' }, { t: '11:15', l: 'rev-u14-g3' }],
      5: [{ t: '09:00', l: 'gm-speak-g3' }, { t: '09:45', l: 'karaoke-g3' }]
    },
    'class-4a': {
      1: [{ t: '10:30', l: 'gm-speak-g4' }, { t: '11:15', l: 'gm-speak-g4' }],
      2: [{ t: '15:20', l: 'speak-g4-u4' }],
      3: [{ t: '14:15', l: 'rev-u4-g4' }, { t: '15:20', l: 'rev-u14-g4' }],
      4: [{ t: '16:05', l: 'gm-speak-g4' }, { t: '16:55', l: 'karaoke-g4' }]
    },
    'class-4b': {
      1: [{ t: '09:45', l: 'gm-speak-g4' }],
      2: [{ t: '09:00', l: 'gm-speak-g4' }, { t: '09:45', l: 'speak-g4-u4' }],
      3: [{ t: '12:45', l: 'rev-u4-g4' }, { t: '13:30', l: 'rev-u14-g4' }],
      5: [{ t: '14:15', l: 'gm-speak-g4' }, { t: '15:20', l: 'karaoke-g4' }]
    }
  };
  /* Retired themes: the Alice and Chuseok events of October leave the calendar (once per device). */
  function retireThemesOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('themes-retired1')) return;
      var list = customEvents().filter(function (e) { return e && e.type !== 'alice' && e.type !== 'chuseok'; });
      saveEvents(list); store().setCalendarFlag('themes-retired1');
    } catch (e) { /* the calendar still works */ }
  }
  /* Week of Mon 2 Nov - Fri 6 Nov 2026: Units 1-4 Speaking & Acting Tournament, Story & Drama, Smart Mix & Revision 2 */
  function weekNov2Once() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed23')) return;
      var list = customEvents().slice();
      var rows = [
        // Monday 2 Nov 2026
        ['2026-11-02', '09:45', 'class-4b', 'unit4', 'Units 1–4 Speaking & Acting Tournament: Penalty, Baseball & Tower', '64 new Speaking & Acting prompts with live teleprompter frame and 1-tap Teacher Speaking Judge. Open game-maker/index.html?set=speak-g4&game=baseball (also penalty, tower, balloon, snakes).'],
        ['2026-11-02', '10:30', 'class-4a', 'unit4', 'Units 1–4 Speaking & Acting Tournament · Round 1: Balloon, Whack & Penalty', 'Warm-up team chorus and pair speaking shootout with the new Speaking & Acting bank. Open game-maker/index.html?set=speak-g4&game=penalty (Monsters = 4A).'],
        ['2026-11-02', '11:15', 'class-4a', 'unit4', 'Units 1–4 Speaking & Acting Tournament · Round 2: Baseball, Tower & Snakes', 'Story and cause/effect 2-sentence speaking challenge in Home Run Baseball and Sky Tower. Open game-maker/index.html?set=speak-g4&game=baseball (also tower, snakes).'],
        ['2026-11-02', '13:30', 'class-3a', 'unit4', 'Revision 2: Reading & Writing + Speaking Warm-Up', 'Print revision-pack/Grade3-Revision-2-Reading-and-Writing-Pack.pdf (or open revision-pack/g3-revision-2.html) + warm-up round in game-maker/index.html?set=speak-g3&game=balloon. Plan: lesson-plans/Grade3-Revision-2-Reading-and-Writing-Lesson-Plan.'],
        ['2026-11-02', '14:15', 'class-3a', 'unit4', 'Units 1–4 Speaking & Acting Tournament: Penalty, Baseball & Tower', 'Grade 3 Speaking & Acting Showdown across Units 1–4 (Inventions, Chuseok, Mona Lisa, Mount Tambora). Open game-maker/index.html?set=speak-g3&game=penalty (also baseball, tower, snakes).'],
        ['2026-11-02', '16:05', 'class-3b', 'unit4', 'Units 1–4 Speaking & Acting Tournament: Penalty, Baseball & Tower', 'Speaking & Acting Showdown across Units 1–4 (Inventions, Chuseok, Mona Lisa, Mount Tambora). Open game-maker/index.html?set=speak-g3&game=penalty (also baseball, tower, balloon, snakes).'],
        // Tuesday 3 Nov 2026
        ['2026-11-03', '09:00', 'class-4b', 'unit4', 'Units 1–4 Speaking & Acting · Round 2: Tower, Jigsaw & Fling', 'Team acting & 2-sentence speaking prompts in Sky Tower, Jigsaw and Pirate Fling. Open game-maker/index.html?set=speak-g4&game=tower (New Space / Pirates / Egypt themes).'],
        ['2026-11-03', '09:45', 'class-4b', 'unit4', 'Speaking Check & Story Dice Showdown (Units 1–4)', 'Pair & individual speaking check (speaking-g4/index.html) + Story Dice creative speaking in game-maker/index.html?set=speak-g4&game=storydice.'],
        ['2026-11-03', '10:30', 'class-3a', 'unit4', 'Units 1–4 Speaking & Acting · Story Dice & Guess-eroo', 'Act out and build 2-sentence answers in Story Dice, Guess-eroo and Memory. Open game-maker/index.html?set=speak-g3&game=storydice.'],
        ['2026-11-03', '11:15', 'class-3a', 'unit4', 'Unit 4 Full Review & Speaking Show', 'Story order, cause & effect, and speaking check. Open review-unit4/index.html?grade=3 and game-maker/index.html?set=speak-g3&game=baseball.'],
        ['2026-11-03', '15:20', 'class-4a', 'unit4', 'Speaking Check & Story Dice Showdown (Units 1–4)', 'Pair & individual speaking check (speaking-g4/index.html) + Story Dice creative speaking in game-maker/index.html?set=speak-g4&game=storydice.'],
        // Wednesday 4 Nov 2026
        ['2026-11-04', '10:30', 'class-3b', 'unit4', 'Revision 2: Reading & Writing (Story & Fact Cards)', 'Print revision-pack/Grade3-Revision-2-Reading-and-Writing-Pack.pdf (open revision-pack/g3-revision-2.html). Plan: lesson-plans/Grade3-Revision-2-Reading-and-Writing-Lesson-Plan.'],
        ['2026-11-04', '11:15', 'class-3b', 'unit4', 'Units 1–4 Speaking & Acting · Baseball, Tower & Story Dice', 'Team speaking & acting tournament Round 2. Open game-maker/index.html?set=speak-g3&game=baseball (also tower, storydice).'],
        ['2026-11-04', '12:45', 'class-4b', 'unit4', 'Unit 4 Full Review: Teamwork & Late for the Show', 'Story order, cause & effect, and excuse round. Open review-unit4/index.html?grade=4 and review-g4-show/index.html.'],
        ['2026-11-04', '13:30', 'class-4b', 'unit4', 'Units 1–4 Smart Mix · 3D Board Game & Pirate Fling', 'Full Units 1–4 Smart Mix on the new Space / Pirates / Ancient Egypt boards. Open game-maker/index.html?set=smart-g4&game=boardgame.'],
        ['2026-11-04', '14:15', 'class-4a', 'unit4', 'Unit 4 Full Review: Teamwork & Late for the Show', 'Story order, cause & effect, and excuse round. Open review-unit4/index.html?grade=4 and review-g4-show/index.html.'],
        ['2026-11-04', '15:20', 'class-4a', 'unit4', 'Units 1–4 Smart Mix · 3D Board Game & Pirate Fling', 'Full Units 1–4 Smart Mix on the new Space / Pirates / Ancient Egypt boards. Open game-maker/index.html?set=smart-g4&game=boardgame.'],
        // Thursday 5 Nov 2026
        ['2026-11-05', '09:45', 'class-3a', 'unit4', 'Units 1–4 Smart Mix · 3D Board Game & Snakes', 'Full Units 1–4 Smart Mix on the new Space / Pirates / Ancient Egypt boards. Open game-maker/index.html?set=smart-g3&game=boardgame.'],
        ['2026-11-05', '10:30', 'class-3b', 'unit4', 'Unit 4 Full Review & Speaking Show', 'Story order, cause & effect, and speaking check. Open review-unit4/index.html?grade=3.'],
        ['2026-11-05', '11:15', 'class-3b', 'unit4', 'Units 1–4 Smart Mix · 3D Board Game & Snakes', 'Full Units 1–4 Smart Mix on the new Space / Pirates / Ancient Egypt boards. Open game-maker/index.html?set=smart-g3&game=boardgame.'],
        ['2026-11-05', '16:05', 'class-4a', 'unit4', 'Units 1–4 Grand Tournament Finale: Bingo & Guess-eroo', 'Whole-class speaking & acting Bingo and Guess-eroo showdown. Open game-maker/index.html?set=speak-g4&game=bingo.'],
        ['2026-11-05', '16:55', 'class-4a', 'lesson', 'Karaoke Stage & Friday Eve Celebration', 'Read, sing and celebrate the week. Open karaoke-stage/index.html.'],
        // Friday 6 Nov 2026
        ['2026-11-06', '09:00', 'class-3b', 'unit4', 'Units 1–4 Grand Tournament Finale: Bingo & Guess-eroo', 'Whole-class speaking & acting Bingo and Guess-eroo showdown. Open game-maker/index.html?set=speak-g3&game=bingo.'],
        ['2026-11-06', '09:45', 'class-3b', 'lesson', 'Karaoke Stage & Friday Celebration', 'Read, sing and celebrate the week. Open karaoke-stage/index.html.'],
        ['2026-11-06', '10:30', 'class-3a', 'unit4', 'Units 1–4 Grand Tournament Finale: Bingo & Guess-eroo', 'Whole-class speaking & acting Bingo and Guess-eroo showdown. Open game-maker/index.html?set=speak-g3&game=bingo.'],
        ['2026-11-06', '11:15', 'class-3a', 'lesson', 'Karaoke Stage & Friday Celebration', 'Read, sing and celebrate the week. Open karaoke-stage/index.html.'],
        ['2026-11-06', '14:15', 'class-4b', 'unit4', 'Units 1–4 Grand Tournament Finale: Bingo & Guess-eroo', 'Whole-class speaking & acting Bingo and Guess-eroo showdown. Open game-maker/index.html?set=speak-g4&game=bingo.'],
        ['2026-11-06', '15:20', 'class-4b', 'lesson', 'Karaoke Stage & Friday Celebration', 'Read, sing and celebrate the week. Open karaoke-stage/index.html.']
      ];
      list = list.filter(function (e) { return !rows.some(function (r) { return e.date === r[0] && e.time === r[1] && e.classId === r[2]; }); });
      rows.forEach(function (r, i) { list.push({ id: 'seed23-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: r[5] }); });
      saveEvents(list);
      // Also seed/upgrade the weekly timetable so Today's lessons on Dashboard & Class Board have live launch links
      if (store().getTimetable && store().setTimetable) {
        var curTT = store().getTimetable() || {}, nextTT = JSON.parse(JSON.stringify(curTT));
        Object.keys(WEEK_TT).forEach(function (cid) {
          if (!nextTT[cid]) nextTT[cid] = {};
          Object.keys(WEEK_TT[cid]).forEach(function (d) {
            var existing = nextTT[cid][d] || [];
            if (!existing.length || existing.every(function (x) { return !x.l; })) {
              nextTT[cid][d] = JSON.parse(JSON.stringify(WEEK_TT[cid][d]));
            }
          });
        });
        store().setTimetable(nextTT);
      }
      store().setCalendarFlag('seed23');
    } catch (e) { /* ignore */ }
  }
  /* Week of 2-6 Nov 2026, the teacher's plan (replaces the tournament week above): 4 government-book lessons per class
     and 2 Halloween team lessons built on the All About Me survey. Every class has 7 English lessons a week. */
  function bookWeekNov2Once() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed24')) return;
      var B = 'Government book lesson. Last 10 minutes: a short team game with the day\'s book words (pages to be added).';
      var PET = 'Teams of 4-5 with jobs (Artist, Speaker, Writer, Timer boss). Each team draws a Halloween pet and sells it in English: It\'s a... It has got... It can... (lesson being built).';
      var SHOW = 'Week finale: each team shows its Halloween monster or costume and says 3 sentences together, then a short chant and team awards (lesson being built).';
      var rows = [
        ['2026-11-02', '13:30', 'class-3a', 'book', 'Done: Book lesson 1 + All About Me survey', 'One government-book lesson and the survey (the order of the two lessons may be the other way round).'],
        ['2026-11-02', '14:15', 'class-3a', 'book', 'Done: Book lesson 1 + All About Me survey', 'One government-book lesson and the survey.'],
        ['2026-11-02', '10:30', 'class-4a', 'book', 'Done: Book lesson 1 + All About Me survey', 'One government-book lesson and the survey (the order of the two lessons may be the other way round).'],
        ['2026-11-02', '11:15', 'class-4a', 'book', 'Done: Book lesson 1 + All About Me survey', 'One government-book lesson and the survey.'],
        ['2026-11-02', '16:05', 'class-3b', 'lesson', 'Done: All About Me survey', 'No book lesson today (the class has no books yet).'],
        ['2026-11-02', '09:45', 'class-4b', 'lesson', 'Done: All About Me survey', 'No book lesson today (the class has no books yet).'],
        // 3A: 3 book lessons left
        ['2026-11-03', '10:30', 'class-3a', 'book', 'Book lesson 2', B],
        ['2026-11-03', '11:15', 'class-3a', 'halloween', 'Halloween: Monster Pet Shop (teams)', PET],
        ['2026-11-05', '09:45', 'class-3a', 'book', 'Book lesson 3', B],
        ['2026-11-06', '10:30', 'class-3a', 'book', 'Book lesson 4', B],
        ['2026-11-06', '11:15', 'class-3a', 'halloween', 'Halloween Team Show + awards', SHOW],
        // 3B: 4 book lessons left
        ['2026-11-04', '10:30', 'class-3b', 'book', 'Book lesson 1 (hand out the books)', B],
        ['2026-11-04', '11:15', 'class-3b', 'halloween', 'Halloween: Monster Pet Shop (teams)', PET],
        ['2026-11-05', '10:30', 'class-3b', 'book', 'Book lesson 2', B],
        ['2026-11-05', '11:15', 'class-3b', 'book', 'Book lesson 3', B],
        ['2026-11-06', '09:00', 'class-3b', 'book', 'Book lesson 4', B],
        ['2026-11-06', '09:45', 'class-3b', 'halloween', 'Halloween Team Show + awards', SHOW],
        // 4A: 3 book lessons left (no Friday lesson)
        ['2026-11-03', '15:20', 'class-4a', 'book', 'Book lesson 2', B],
        ['2026-11-04', '14:15', 'class-4a', 'book', 'Book lesson 3', B],
        ['2026-11-04', '15:20', 'class-4a', 'halloween', 'Halloween: Monster Pet Shop (teams)', PET],
        ['2026-11-05', '16:05', 'class-4a', 'book', 'Book lesson 4', B],
        ['2026-11-05', '16:55', 'class-4a', 'halloween', 'Halloween Team Show + awards', SHOW],
        // 4B: 4 book lessons left
        ['2026-11-03', '09:00', 'class-4b', 'book', 'Book lesson 1 (hand out the books)', B],
        ['2026-11-03', '09:45', 'class-4b', 'halloween', 'Halloween: Monster Pet Shop (teams)', PET],
        ['2026-11-04', '12:45', 'class-4b', 'book', 'Book lesson 2', B],
        ['2026-11-04', '13:30', 'class-4b', 'book', 'Book lesson 3', B],
        ['2026-11-06', '14:15', 'class-4b', 'book', 'Book lesson 4', B],
        ['2026-11-06', '15:20', 'class-4b', 'halloween', 'Halloween Team Show + awards', SHOW]
      ];
      var list = customEvents().filter(function (e) {
        if (e && /^seed23-/.test(String(e.id || ''))) return false; // the old tournament week
        return !rows.some(function (r) { return e && e.date === r[0] && e.time === r[1] && e.classId === r[2]; });
      });
      rows.forEach(function (r, i) { list.push({ id: 'seed24-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: r[5] }); });
      saveEvents(list);
      store().setCalendarFlag('seed24');
    } catch (e) { /* the calendar still works */ }
  }
  function ensureSeeded() {
    seedOnce(); retitleOnce(); shortenOnce(); g3Titles(); moonOnce(); moonNoteOnce(); monaOnce(); showOnce(); mountainOnce(); mountainSplitOnce(); u4ReviewOnce(); quizSpeakOnce(); weekPlanOnce(); mondayG3Once(); rev1NoteOnce(); rev1aOnce(); g3QuizOnce(); g3RevOnce(); wed28Once(); wed28PlansOnce(); fri30Once(); weekNov2Once(); retireThemesOnce(); bookWeekNov2Once();
  }
  function lessonsOn(date, classId) {
    var wd = date.getDay(); if (wd < 1 || wd > 5) return [];
    var out = [], tt = (store() && store().getTimetable && store().getTimetable()) || {}, hasTT = Object.keys(tt).some(function (k) { return Object.keys(tt[k] || {}).some(function (d) { return (tt[k][d] || []).length; }); });
    classes().forEach(function (c) {
      if (classId !== 'all' && c.id !== classId) return;
      if (hasTT && tt[c.id]) (tt[c.id][wd] || []).forEach(function (e) { out.push({ type: 'lesson', time: e.t || '', classId: c.id, title: (e.x || (e.l && root.Timetable && root.Timetable.titleOf ? root.Timetable.titleOf(e.l) : '') || 'English') }); });
      else (K12[c.id] && K12[c.id][wd] || []).forEach(function (t) { out.push({ type: 'lesson', time: t, classId: c.id, title: 'English' }); });
    });
    return out;
  }
  function eventsOn(date) {
    var key = ymd(date), out = [], seen = {};
    customEvents().forEach(function (e) { if (e.date === key && (st.cls === 'all' || !e.classId || e.classId === st.cls)) { out.push(e); if (e.classId && e.time) seen[e.classId + '|' + e.time] = 1; } });
    lessonsOn(date, st.cls).forEach(function (l) { if (!seen[l.classId + '|' + l.time]) out.push(l); });
    try {
      if (root.Birthday && root.Birthday.known) root.Birthday.known().forEach(function (x) {
        var p = String(x.md).split('-'); if (+p[0] === date.getMonth() + 1 && +p[1] === date.getDate() && (st.cls === 'all' || x.s.classId === st.cls)) out.push({ type: 'birthday', time: '', classId: x.s.classId, title: (x.s.firstName || x.s.name || 'Pupil') + '’s birthday' });
      });
    } catch (e) { /* no birthdays */ }
    return out.sort(function (a, b) { return String(a.time || '99').localeCompare(String(b.time || '99')) || String(a.title).localeCompare(String(b.title)); });
  }

  // ---------------------------------------------------------------- drawing
  var CSS = '' +
    '.cal{color:#e5edff;max-width:1200px;margin:0 auto;padding:6px 8px 90px}.cal h1{margin:0;font-size:1.65rem;color:#e5edff}.cal .sub{color:#cbd5e1;font-size:.92rem;margin-top:2px}' +
    '.cal-top{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:10px 0 12px}.cal-b{border:1.5px solid #4C389E;border-bottom:4px solid #37267A;background:#6E56CF;color:#fff;font:800 .88rem inherit;border-radius:12px;padding:8px 14px;cursor:pointer}.cal-b:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.cal-b.g{background:rgba(15, 23, 42, 0.86);border-color:#26324a;border-bottom-color:#26324a;color:#e5edff}.cal-b.on{background:#6E56CF;border-color:#4C389E;border-bottom-color:#37267A;color:#FFFFFF}.cal-b.ok{background:#10b981;border-color:#059669;border-bottom-color:#047857;color:#FFFFFF}' +
    '.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.cal-dow{color:#cbd5e1;font-weight:800;font-size:.8rem;text-align:center;padding:4px}' +
    '.cal-cell{min-height:106px;background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-bottom:3px solid #26324a;border-radius:14px;padding:8px;cursor:pointer;overflow:hidden;color:#e5edff;box-shadow:0 2px 6px rgba(37,36,43,.03)}.cal-cell:hover{border-color:#6E56CF}' +
    '.cal-cell.off{opacity:.48;background:rgba(232, 177, 48, 0.18)}.cal-cell.today{border-color:#f59e0b;border-bottom-color:#b45309;background:rgba(232, 195, 48, 0.18);box-shadow:0 0 0 2px rgba(245,158,11,.22)}.cal-cell.sel{border-color:#6E56CF;border-bottom-color:#4C389E;background:rgba(101, 48, 232, 0.18)}.cal-cell b{font-size:.88rem;color:#e5edff}' +
    '.cal-ev{display:block;font-size:.73rem;line-height:1.25;border-radius:6px;padding:2px 6px;margin-top:4px;color:#0b0d13;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cal-more{font-size:.72rem;color:#94a3b8;font-weight:700;margin-top:4px}' +
    '.cal-side{background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-bottom:4px solid #26324a;border-radius:18px;padding:16px;margin-top:16px;color:#e5edff;box-shadow:0 4px 14px rgba(37,36,43,.04)}.cal-row{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #26324a;font-size:.92rem;color:#e5edff}' +
    '.cal-tag{flex:none;border-radius:8px;padding:2px 8px;font-size:.75rem;font-weight:800;color:#0b0d13}.cal-t{flex:none;width:50px;color:#a894f9;font-weight:800}.cal-x{margin-left:auto;background:none;border:0;color:#94a3b8;cursor:pointer;font-size:1rem}' +
    '.cal-wk{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.cal-wk .cal-cell{min-height:260px}.cal-wk .cal-ev{white-space:normal;font-size:.76rem}' +
    '.cal-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:.8rem;color:#cbd5e1;font-weight:700;margin:6px 0 12px;background:rgba(15, 23, 42, 0.86);border:1px solid #26324a;border-radius:12px;padding:8px 14px}.cal-legend span i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px}' +
    '.cal-form{display:grid;gap:8px;grid-template-columns:1fr 1fr}.cal-form label{font-size:.8rem;color:#cbd5e1;font-weight:700;display:block}.cal-form input,.cal-form select,.cal-form textarea{width:100%;background:rgba(232, 153, 48, 0.18);color:#e5edff;border:1.5px solid #26324a;border-radius:10px;padding:8px;font:inherit}' +
    '@media(max-width:800px){.cal-grid{gap:3px}.cal-cell{min-height:70px;padding:3px}.cal-ev{font-size:.62rem}.cal-wk{grid-template-columns:1fr}}';
  function css() { if (!document.getElementById('cal-css')) { var s = document.createElement('style'); s.id = 'cal-css'; s.textContent = CSS; document.head.appendChild(s); } }
  function evHtml(e) {
    var T = TYPES[e.type] || TYPES.other, cl = e.classId ? shortName(e.classId) + ' ' : '';
    return '<span class="cal-ev" style="background:' + T[2] + '" title="' + esc((e.time ? e.time + ' ' : '') + cl + e.title) + '">' + T[0] + ' ' + (e.time ? esc(e.time) + ' ' : '') + esc(cl) + esc(e.title) + '</span>';
  }
  function head(box) {
    var cl = classes();
    var label = st.mode === 'month' ? MON[st.m] + ' ' + st.y : (function () { var a = parse(st.wk), b = new Date(a); b.setDate(b.getDate() + 4); return a.getDate() + ' ' + MON[a.getMonth()].slice(0, 3) + ' – ' + b.getDate() + ' ' + MON[b.getMonth()].slice(0, 3) + ' ' + b.getFullYear(); })();
    return '<h1>📅 Timetable &amp; School Calendar</h1><div class="sub">Your weekly lessons, quizzes, revision packs, birthdays and meetings in one place — tap any day to launch its lesson or print its pack.</div>' +
      '<div class="cal-top"><button class="cal-b g" onclick="CalendarView.step(-1)">◀</button><b style="font-size:1.15rem;min-width:170px;text-align:center;color:#e5edff;font-family:\'Fraunces\',Georgia,serif">' + label + '</b><button class="cal-b g" onclick="CalendarView.step(1)">▶</button>' +
      '<button class="cal-b g" onclick="CalendarView.today()">Today</button>' +
      '<button class="cal-b ' + (st.mode === 'month' ? 'on' : 'g') + '" onclick="CalendarView.mode(\'month\')">Month</button><button class="cal-b ' + (st.mode === 'week' ? 'on' : 'g') + '" onclick="CalendarView.mode(\'week\')">Week</button>' +
      '<span style="flex:1"></span><button class="cal-b ok" onclick="CalendarView.edit(\'\')">+ Add event</button></div>' +
      '<div class="cal-top" style="margin-top:0"><button class="cal-b ' + (st.cls === 'all' ? 'on' : 'g') + '" onclick="CalendarView.cls(\'all\')">All classes</button>' +
      cl.map(function (c) { return '<button class="cal-b ' + (st.cls === c.id ? 'on' : 'g') + '" onclick="CalendarView.cls(\'' + esc(c.id) + '\')">' + esc(shortName(c.id)) + '</button>'; }).join('') + '</div>' +
      '<div class="cal-legend">' + Object.keys(TYPES).map(function (k) { return '<span><i style="background:' + TYPES[k][2] + '"></i>' + TYPES[k][1] + '</span>'; }).join('') + '</div>';
  }
  function monthHtml() {
    var first = new Date(st.y, st.m, 1), start = monday(first), todayKey = ymd(new Date()), cells = '';
    for (var i = 0; i < 42; i++) {
      var d = new Date(start); d.setDate(start.getDate() + i);
      if (i >= 35 && d.getMonth() !== st.m) break;
      var evs = eventsOn(d), key = ymd(d);
      cells += '<div class="cal-cell' + (d.getMonth() !== st.m ? ' off' : '') + (key === todayKey ? ' today' : '') + (key === st.sel ? ' sel' : '') + '" onclick="CalendarView.pick(\'' + key + '\')"><b>' + d.getDate() + '</b>' + evs.slice(0, 3).map(evHtml).join('') + (evs.length > 3 ? '<div class="cal-more">+' + (evs.length - 3) + ' more</div>' : '') + '</div>';
    }
    return '<div class="cal-grid">' + DOW.map(function (x) { return '<div class="cal-dow">' + x + '</div>'; }).join('') + cells + '</div>';
  }
  function weekHtml() {
    var a = parse(st.wk), todayKey = ymd(new Date()), cells = '';
    for (var i = 0; i < 5; i++) {
      var d = new Date(a); d.setDate(a.getDate() + i); var key = ymd(d);
      cells += '<div class="cal-cell' + (key === todayKey ? ' today' : '') + (key === st.sel ? ' sel' : '') + '" onclick="CalendarView.pick(\'' + key + '\')"><b>' + DOW[i] + ' ' + d.getDate() + '</b>' + eventsOn(d).map(evHtml).join('') + '</div>';
    }
    return '<div class="cal-wk">' + cells + '</div>';
  }
  /* links found in an event's title or note (lessons, packs, plans, games): shown as buttons, so the calendar opens the lesson directly */
  function linksOf(e) {
    var txt = (e.title || '') + ' ' + (e.note || '') + ' ' + (e.url || ''), out = [], seen = {};
    var re = /(?:^|[\s(:,])((?:lesson-plans\/[A-Za-z0-9_.-]+)|(?:[a-z0-9][a-z0-9-]*\/[A-Za-z0-9_.\/-]*\.(?:html|pdf)(?:\?[A-Za-z0-9_=&.-]*)?)|(?:(?:quiz|review|unit|alice|revision|speaking)-[a-z0-9-]+\/?(?=[\s).,;]|$)))/g, m;
    while ((m = re.exec(txt))) {
      var u = m[1].replace(/[.,;]+$/, '');
      if (u === 'alice-party-print/index.html') u = 'alice-party/index.html';   /* the old party hub: open the Tea Party HQ */
      if (/^lesson-plans\//.test(u) && !/\.(pdf|docx)$/.test(u)) u += '.pdf';
      if (!/\.(html|pdf)/.test(u) && !/\/$/.test(u)) u += '/';
      if (!/\//.test(u) || seen[u]) continue; seen[u] = 1;
      var lab = /^lesson-plans\//.test(u) ? '📋 Plan' : /\.pdf$/.test(u) ? '🖨️ Print' : /^game-maker\//.test(u) ? '🎮 Game' : /print|poster|paper|note|cards|sheet/.test(u) ? '🖨️ Open' : '▶ Open lesson';
      out.push([lab, u]);
    }
    /* lessons named in words, not paths */
    var g = /class-(\d)/.exec(e.classId || ''), ck = (/class-(\w+)/.exec(e.classId || '') || [])[1];
    function add(lab, u) { if (!seen[u]) { seen[u] = 1; out.push([lab, u]); } }
    var PACK = { 'Grade4-Revision-1-Words-and-Writing-Pack.pdf': 'g4-revision-1.html', 'Grade4A-Revision-1-Reading-and-Writing-Pack.pdf': 'g4a-revision-1.html', 'Grade3-Revision-1-Words-and-Writing-Pack.pdf': 'g3-revision-1.html', 'Grade3-Revision-2-Reading-and-Writing-Pack.pdf': 'g3-revision-2.html' };
    out.slice().forEach(function (l) { var f = l[1].replace('revision-pack/', ''); if (PACK[f]) add('▶ Open lesson', 'revision-pack/' + PACK[f]); });
    if (g && /Remember first|Smart mix/i.test(txt)) add('🎮 Game', 'game-maker/index.html?set=smart-g' + g[1] + '&game=cannon');
    if (ck && /Alice rehearsal/i.test(txt)) add('▶ Open lesson', 'alice-party-rehearsal/index.html?class=' + ck + '&lesson=3');
    if (/Tea Party/i.test(e.title || '')) add('▶ Open lesson', 'alice-party/index.html');
    out.sort(function (a, b) { return (a[0] === '▶ Open lesson' ? 0 : a[0] === '🎮 Game' ? 1 : a[0] === '🖨️ Print' || a[0] === '🖨️ Open' ? 2 : 3) - (b[0] === '▶ Open lesson' ? 0 : b[0] === '🎮 Game' ? 1 : b[0] === '🖨️ Print' || b[0] === '🖨️ Open' ? 2 : 3); });
    return out;
  }
  function linkBtns(e) {
    var L = linksOf(e); if (!L.length) return '';
    return '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">' + L.map(function (l, i) { return '<a class="cal-b' + (i === 0 ? ' ok' : '') + '" style="text-decoration:none;padding:5px 10px;font-size:.85rem" href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a>'; }).join('') + '</div>';
  }
  function sideHtml() {
    if (!st.sel) return '<div class="cal-side" style="color:#cbd5e1">Tap a day to see everything on it, add an event, or open a lesson.</div>';
    var d = parse(st.sel), evs = eventsOn(d);
    return '<div class="cal-side"><div style="display:flex;align-items:center;gap:10px"><b style="font-size:1.08rem;color:#e5edff;font-family:\'Fraunces\',Georgia,serif">' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</b><span style="flex:1"></span><button class="cal-b ok" onclick="CalendarView.edit(\'\',\'' + st.sel + '\')">+ Add event</button></div>' +
      (evs.length ? evs.map(function (e) {
        var T = TYPES[e.type] || TYPES.other, mine = !!e.id;
        return '<div class="cal-row"><span class="cal-t">' + esc(e.time || '') + '</span><span class="cal-tag" style="background:' + T[2] + '">' + T[0] + ' ' + T[1] + '</span><span><b style="color:#e5edff">' + (e.classId ? esc(shortName(e.classId)) + ' · ' : '') + esc(e.title) + '</b>' + (e.note ? '<div style="color:#cbd5e1;font-size:.82rem;margin-top:2px">' + esc(e.note) + '</div>' : '') + linkBtns(e) + '</span>' +
          (mine ? '<button class="cal-x" title="Edit" onclick="CalendarView.edit(\'' + esc(e.id) + '\')">✏️</button><button class="cal-x" style="margin-left:0" title="Delete" onclick="CalendarView.del(\'' + esc(e.id) + '\')">🗑️</button>' : '') + '</div>';
      }).join('') : '<div style="color:#94a3b8;padding:10px 0">Nothing on this day.</div>') + '</div>';
  }
  function draw() {
    var box = document.getElementById('cal-root'); if (!box) return;
    var noTT = !(store() && store().getTimetable && Object.keys(store().getTimetable() || {}).some(function (k) { return Object.keys(store().getTimetable()[k] || {}).some(function (d) { return (store().getTimetable()[k][d] || []).length; }); }));
    box.innerHTML = head() + (noTT ? '<div class="cal-side" style="margin:0 0 10px;color:#fde68a">Your lessons come from the k12 timetable. <button class="cal-b" onclick="CalendarView.saveTimetable()">Save it as my weekly timetable</button> <span style="color:#8b93a7;font-size:.85rem">(the Class Board and the dashboard then show today’s lessons)</span></div>' : '') +
      (st.mode === 'month' ? monthHtml() : weekHtml()) + sideHtml();
  }

  // ---------------------------------------------------------------- actions
  function edit(id, date) {
    var list = customEvents(), e = id ? list.filter(function (x) { return x.id === id; })[0] : null; e = e || { date: date || st.sel || ymd(new Date()), time: '', classId: st.cls === 'all' ? '' : st.cls, type: 'task', title: '', note: '' };
    var old = document.getElementById('cal-modal'); if (old) old.remove();
    var m = document.createElement('div'); m.id = 'cal-modal'; m.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(2,6,23,.7);display:flex;align-items:center;justify-content:center;padding:14px';
    m.innerHTML = '<div class="cal" style="background:#0f172a;border:1px solid #334155;border-radius:18px;padding:18px;width:min(560px,96vw);max-height:92vh;overflow:auto"><h2 style="margin:0 0 10px;font-size:1.2rem">' + (id ? 'Edit event' : 'New event') + '</h2><div class="cal-form">' +
      '<div style="grid-column:1/3"><label>What</label><input id="cal-f-title" value="' + esc(e.title) + '" placeholder="Quiz for 4/A, parent meeting, bring props…"></div>' +
      '<div><label>Day</label><input id="cal-f-date" type="date" value="' + esc(e.date) + '"></div><div><label>Time (optional)</label><input id="cal-f-time" type="time" value="' + esc(e.time) + '"></div>' +
      '<div><label>Class</label><select id="cal-f-cls"><option value="">All / none</option>' + classes().map(function (c) { return '<option value="' + esc(c.id) + '"' + (e.classId === c.id ? ' selected' : '') + '>' + esc(shortName(c.id)) + '</option>'; }).join('') + '</select></div>' +
      '<div><label>Type</label><select id="cal-f-type">' + Object.keys(TYPES).filter(function (k) { return k !== 'birthday'; }).map(function (k) { return '<option value="' + k + '"' + (e.type === k ? ' selected' : '') + '>' + TYPES[k][0] + ' ' + TYPES[k][1] + '</option>'; }).join('') + '</select></div>' +
      '<div style="grid-column:1/3"><label>Note (optional)</label><textarea id="cal-f-note" rows="3">' + esc(e.note) + '</textarea></div></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button class="cal-b g" id="cal-f-no">Cancel</button><button class="cal-b ok" id="cal-f-ok">Save</button></div></div>';
    document.body.appendChild(m);
    m.querySelector('#cal-f-no').onclick = function () { m.remove(); };
    m.querySelector('#cal-f-ok').onclick = function () {
      var t = m.querySelector('#cal-f-title').value.trim(), dt = m.querySelector('#cal-f-date').value; if (!t || !dt) { m.querySelector('#cal-f-title').style.borderColor = '#f87171'; return; }
      var rec = { id: e.id || ('ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)), date: dt, time: m.querySelector('#cal-f-time').value, classId: m.querySelector('#cal-f-cls').value, type: m.querySelector('#cal-f-type').value, title: t, note: m.querySelector('#cal-f-note').value.trim() };
      var all = customEvents().filter(function (x) { return x.id !== rec.id; }); all.push(rec); saveEvents(all); st.sel = dt; m.remove(); draw();
    };
  }
  function del(id) { if (!confirm('Delete this event?')) return; saveEvents(customEvents().filter(function (x) { return x.id !== id; })); draw(); }
  function saveTimetable() {
    try {
      var tt = {}; classes().forEach(function (c) {
        if (WEEK_TT[c.id]) { tt[c.id] = JSON.parse(JSON.stringify(WEEK_TT[c.id])); return; }
        if (!K12[c.id]) return; tt[c.id] = {}; Object.keys(K12[c.id]).forEach(function (d) { tt[c.id][d] = K12[c.id][d].map(function (t) { return { t: t, x: 'English' }; }); });
      });
      store().setTimetable(tt); draw();
    } catch (e) { alert('Could not save the timetable.'); }
  }
  function defaultSchoolDay(now) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate()), wd = d.getDay();
    if (wd === 6) d.setDate(d.getDate() + 2);
    else if (wd === 0) d.setDate(d.getDate() + 1);
    return d;
  }
  function render(container) {
    css(); var now = new Date(), ref = defaultSchoolDay(now);
    if (!st.y) { st.y = ref.getFullYear(); st.m = ref.getMonth(); st.wk = ymd(monday(ref)); st.sel = ymd(ref); }
    ensureSeeded();
    container.innerHTML = '<div class="cal" id="cal-root"></div>'; draw();
  }
  root.renderCalendarView = render;
  root.CalendarView = {
    step: function (n) { if (st.mode === 'month') { var d = new Date(st.y, st.m + n, 1); st.y = d.getFullYear(); st.m = d.getMonth(); } else { var w = parse(st.wk); w.setDate(w.getDate() + 7 * n); st.wk = ymd(w); } draw(); },
    today: function () { var ref = defaultSchoolDay(new Date()); st.y = ref.getFullYear(); st.m = ref.getMonth(); st.wk = ymd(monday(ref)); st.sel = ymd(ref); draw(); },
    mode: function (m) { st.mode = m; if (m === 'week' && st.sel) st.wk = ymd(monday(parse(st.sel))); draw(); },
    cls: function (c) { st.cls = c; draw(); },
    pick: function (k) { st.sel = k; draw(); },
    edit: edit, del: del, saveTimetable: saveTimetable, ensureSeeded: ensureSeeded, linksOf: linksOf, K12: K12, WEEK_TT: WEEK_TT
  };
  if (typeof setTimeout === 'function') setTimeout(ensureSeeded, 60);
})(typeof window !== 'undefined' ? window : this);
