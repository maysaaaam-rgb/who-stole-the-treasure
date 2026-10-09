/* Home view: this week's homework for pupils (one page per grade). English only, simple A1 language.
   Pupils type their first name on their own device; nothing is sent anywhere.
   Pictures come from the week's lesson folders and platform-art. To add a new week, change WEEK and the two grade objects. */
(function (root) {
  'use strict';
  var A3 = '../week4-g3-daphne/art/', A4 = '../week4-g4-captain-quiet/art/', PL = '../platform-art/';
  var HV = { week: 'week4', title: 'Week 4' };

  /* ---------------- Grade 3: Daphne the School Detective ---------------- */
  var people = [
    { w: 'headteacher', say: 'This is Mr. Blue. He is the headteacher.', pic: A3 + 'c_mr_blue.webp' },
    { w: 'librarian', say: 'This is the librarian. She has many books.', pic: A3 + 'c_librarian.webp' },
    { w: 'school nurse', say: 'This is the school nurse. She helps you.', pic: A3 + 'c_nurse.webp' },
    { w: 'caretaker', say: 'This is the caretaker. He has keys and a broom.', pic: A3 + 'c_caretaker_oak.webp' },
    { w: 'classmate', say: 'This is Leo. He is my classmate.', pic: A3 + 'c_leo.webp' },
    { w: 'library', say: 'We read books in the library.', pic: A3 + 'p_library.webp' },
    { w: 'art room', say: 'We paint in the art room.', pic: A3 + 'p_art_room.webp' },
    { w: 'music room', say: 'We sing in the music room.', pic: A3 + 'p_music_room.webp' },
    { w: 'gym', say: 'We play in the gym.', pic: A3 + 'p_gym.webp' }
  ];
  function o(name, pic, emoji) { return { n: name, pic: pic || '', e: emoji || '' }; }
  var P3 = { hd: o('headteacher', A3 + 'c_mr_blue.webp'), lib: o('librarian', A3 + 'c_librarian.webp'), nur: o('nurse', A3 + 'c_nurse.webp'), car: o('caretaker', A3 + 'c_caretaker_oak.webp'), leo: o('classmate', A3 + 'c_leo.webp') };
  var R3 = { library: o('library', A3 + 'p_library.webp'), art: o('art room', A3 + 'p_art_room.webp'), music: o('music room', A3 + 'p_music_room.webp'), gym: o('gym', A3 + 'p_gym.webp') };
  HV[3] = {
    name: 'Daphne the School Detective', guide: A3 + 'c_daphne.webp', bg: PL + 'bg_home_view.webp', color: '#f59e0b',
    intro: 'Hello! I am Daphne. Help me find my red notebook!',
    steps: [
      { id: 'listen', kind: 'listen', icon: PL + 'h_headphones.webp', t: 'Listen', say: 'Tap every picture and listen.', cards: people },
      { id: 'who', kind: 'tap', icon: PL + 'h_homework_book.webp', t: 'Who is it?', say: 'Listen to the clue. Tap the right picture.', rounds: [
        { q: 'She helps you when you are ill. Who is she?', o: [P3.lib, P3.nur, P3.car, P3.hd], a: 1, ok: 'She is the school nurse.' },
        { q: 'He cleans the school. He has keys and a broom. Who is he?', o: [P3.hd, P3.car, P3.leo, P3.nur], a: 1, ok: 'He is the caretaker.' },
        { q: 'He is the boss of the school. His name is Mr. Blue. Who is he?', o: [P3.car, P3.leo, P3.hd, P3.lib], a: 2, ok: 'He is the headteacher.' },
        { q: 'She works with books. Who is she?', o: [P3.lib, P3.nur, P3.hd, P3.car], a: 0, ok: 'She is the librarian.' },
        { q: 'He is a pupil in your class. His name is Leo. Who is he?', o: [P3.nur, P3.lib, P3.hd, P3.leo], a: 3, ok: 'He is my classmate.' }
      ] },
      { id: 'where', kind: 'tap', icon: PL + 'h_week_path.webp', t: 'Where is Daphne?', say: 'Listen. Where is Daphne? Tap the room.', rounds: [
        { q: 'Where is Daphne? She is in the library.', o: [R3.art, R3.library, R3.music, R3.gym], a: 1, ok: 'Yes! She is in the library.' },
        { q: 'Where is Daphne? She is in the gym.', o: [R3.gym, R3.library, R3.music, R3.art], a: 0, ok: 'Yes! She is in the gym.' },
        { q: 'Where is Daphne? She is in the music room.', o: [R3.library, R3.gym, R3.art, R3.music], a: 3, ok: 'Yes! She is in the music room.' },
        { q: 'Where is Daphne? She is in the art room.', o: [R3.music, R3.art, R3.gym, R3.library], a: 1, ok: 'Yes! She is in the art room.' }
      ] },
      { id: 'say', kind: 'say', icon: PL + 'h_mic.webp', t: 'Say it', say: 'Listen. Then say it out loud. Tap "I said it!"', lines: ['This is the librarian.', 'Where is Daphne? She is in the library.', 'Is there a nurse at school? Yes, there is.'] },
      { id: 'done', kind: 'done', icon: PL + 'h_tick_stamp.webp', t: 'Done!', say: 'Great work, detective!' }
    ]
  };

  /* ---------------- Grade 4: Captain Quiet's Space Mission ---------------- */
  function e(name, emoji, pic) { return { n: name, e: emoji, pic: pic || '' }; }
  var I4 = { door: e('open door', '🚪'), win: e('window', '🪟'), quiet: e('quiet', '', A4 + 'c_captain_quiet.webp'), look: e('look', '👀'), seat: e('place', '💺') };
  var GREEN = { n: 'Yes', pic: A4 + 'o_green_door.webp', e: '' }, RED = { n: 'No', pic: A4 + 'o_red_door.webp', e: '' };
  function num(n) { return { n: String(n), e: '', num: true }; }
  HV[4] = {
    name: 'Captain Quiet’s Space Mission', guide: A4 + 'c_captain_wave.webp', bg: PL + 'bg_home_view.webp', color: '#38bdf8',
    intro: 'Hello, crew! I am Captain Quiet. Let us practise for our mission!',
    steps: [
      { id: 'listen', kind: 'listen', icon: PL + 'h_headphones.webp', t: 'Listen', say: 'Tap every card and listen.', cards: [
        { w: 'Open the door, please.', say: 'Open the door, please.', emoji: '🚪' },
        { w: 'Close the window, please.', say: 'Close the window, please.', emoji: '🪟' },
        { w: 'Be quiet, please.', say: 'Be quiet, please.', pic: A4 + 'c_captain_quiet.webp' },
        { w: 'Look at the board, please.', say: 'Look at the board, please.', emoji: '👀' },
        { w: 'Can I come in?', say: 'Can I come in? Yes, you can.', pic: A4 + 'c_sam.webp' },
        { w: 'Can I go out?', say: 'Can I go out? Sorry, not right now.', pic: A4 + 'c_ayla.webp' },
        { w: 'Give me the book, please.', say: 'Give me the book, please. Here you are.', emoji: '📕' }
      ] },
      { id: 'do', kind: 'tap', icon: PL + 'h_homework_book.webp', t: 'Captain Says', say: 'Listen to the Captain. Tap the right picture.', rounds: [
        { q: 'Open the window, please.', o: [I4.door, I4.win, I4.quiet, I4.look], a: 1, ok: 'Open the window, please.' },
        { q: 'Be quiet, please.', o: [I4.look, I4.door, I4.quiet, I4.win], a: 2, ok: 'Be quiet, please.' },
        { q: 'Look at the board, please.', o: [I4.look, I4.quiet, I4.door, I4.win], a: 0, ok: 'Look at the board, please.' },
        { q: 'Open the door, please.', o: [I4.win, I4.look, I4.door, I4.quiet], a: 2, ok: 'Open the door, please.' },
        { q: 'Go back to your place, please.', o: [I4.seat, I4.win, I4.door, I4.look], a: 0, ok: 'Go back to your place, please.' }
      ] },
      { id: 'doors', kind: 'tap', icon: PL + 'h_week_path.webp', t: 'Green door, red door', say: 'Listen to the answer. Is it YES (green) or NO (red)?', rounds: [
        { q: 'Yes, you can.', o: [GREEN, RED], a: 0, ok: 'Yes, you can.' },
        { q: 'Sorry, not right now.', o: [GREEN, RED], a: 1, ok: 'Sorry, not right now.' },
        { q: 'Of course.', o: [RED, GREEN], a: 1, ok: 'Of course.' },
        { q: 'Sure.', o: [GREEN, RED], a: 0, ok: 'Sure.' },
        { q: 'Sorry, not right now.', o: [RED, GREEN], a: 0, ok: 'Sorry, not right now.' }
      ] },
      { id: 'numbers', kind: 'tap', icon: PL + 'h_calendar.webp', t: 'Number rocket', say: 'Listen to the number. Tap it.', rounds: [
        { q: 'Twelve', o: [num(21), num(12), num(2)], a: 1, ok: 'Twelve.' },
        { q: 'Twenty-five', o: [num(35), num(52), num(25)], a: 2, ok: 'Twenty-five.' },
        { q: 'Thirty', o: [num(13), num(30), num(33)], a: 1, ok: 'Thirty.' },
        { q: 'Forty-four', o: [num(14), num(44), num(40)], a: 1, ok: 'Forty-four.' },
        { q: 'Fifty', o: [num(15), num(50), num(45)], a: 1, ok: 'Fifty.' }
      ] },
      { id: 'say', kind: 'say', icon: PL + 'h_mic.webp', t: 'Say it', say: 'Listen. Then say it out loud. Tap "I said it!"', lines: ['Can I come in, please?', 'Give me the pencil, please.', 'Open the window, please.'] },
      { id: 'done', kind: 'done', icon: PL + 'h_tick_stamp.webp', t: 'Done!', say: 'Great work, crew!' }
    ]
  };

  root.HV = HV;
})(window);
