/* Week 4 Grade 3 "Daphne the School Detective" - one teacher-led smartboard lesson (35 minutes).
   Theme 1 School Life: people and places at school, Where is …? She's in …, Is there …? How many …?
   All sentences are written for this lesson in very simple A1 English. No book text is copied. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];

  D.missions = [
    { e: '👩‍🏫', t: 'Meet the people at school' }, { e: '🏫', t: 'Visit the places' }, { e: '🔍', t: 'Where is Daphne?' },
    { e: '🔢', t: 'Is there …? How many …?' }, { e: '🕵️', t: 'Play School Detective' }
  ];
  D.hookPrompts = [
    'Hello, I am Daphne! How are you?',
    'Oh no! I cannot find my red notebook!',
    'Please help me! Let us visit every place at school.'
  ];

  /* people: a = picture name, who = pronoun */
  D.people = [
    { w: 'headteacher', e: '👔', a: 'c_mr_blue', def: 'the boss of the school', ex: 'This is Mr. Blue. He is the headteacher.', gap: 'This is Mr. Blue. He is the ______.', n: 'Mr. Blue', who: 'He' },
    { w: 'librarian', e: '📚', a: 'c_librarian', def: 'a person who works with books in the library', ex: 'She is the librarian. She has many books.', gap: 'She is the ______. She has many books.', n: 'the librarian', who: 'She' },
    { w: 'school nurse', e: '🩺', a: 'c_nurse', def: 'a person who helps when you are ill', ex: 'The school nurse helps you.', gap: 'The school ______ helps you.', n: 'the nurse', who: 'She' },
    { w: 'caretaker', e: '🧹', a: 'c_caretaker_oak', def: 'a person who looks after the school building', ex: 'The caretaker has keys and a broom.', gap: 'The ______ has keys and a broom.', n: 'Mr. Oak', who: 'He' },
    { w: 'classmate', e: '🧒', a: 'c_leo', def: 'a pupil in your class', ex: 'This is Leo. He is my classmate.', gap: 'This is Leo. He is my ______.', n: 'Leo', who: 'He' }
  ];

  /* places: prep = in / on */
  D.rooms = [
    { k: 'library', n: 'library', e: '📚', a: 'p_library', prep: 'in' },
    { k: 'art', n: 'art room', e: '🎨', a: 'p_art_room', prep: 'in' },
    { k: 'music', n: 'music room', e: '🎵', a: 'p_music_room', prep: 'in' },
    { k: 'gym', n: 'gym', e: '🤸', a: 'p_gym', prep: 'in' },
    { k: 'office', n: 'office', e: '🏢', prep: 'in' },
    { k: 'meeting', n: 'meeting room', e: '🪑', prep: 'in' },
    { k: 'field', n: 'sports field', e: '⚽', prep: 'on' },
    { k: 'corridor', n: 'corridor', e: '🚪', prep: 'in' }
  ];
  D.mapPeople = [
    { n: 'Daphne', e: '🕵️', a: 'c_daphne', who: 'She' }, { n: 'Mr. Blue', e: '👔', a: 'c_mr_blue', who: 'He' },
    { n: 'the librarian', e: '📚', a: 'c_librarian', who: 'She' }, { n: 'the nurse', e: '🩺', a: 'c_nurse', who: 'She' },
    { n: 'Mr. Oak', e: '🧹', a: 'c_caretaker_oak', who: 'He' }, { n: 'Leo', e: '🧒', a: 'c_leo', who: 'He' }
  ];

  /* Is there ...? How many ...? (about Daphne's school) */
  D.there = [
    { q: 'Is there a nurse at school?', a: 'Yes, there is. There is a nurse at school.', pics: [{ e: '🩺', a: 'c_nurse' }] },
    { q: 'How many caretakers are there at school?', a: 'There are two caretakers at school.', pics: [{ e: '🧹', a: 'c_caretaker_oak' }, { e: '🧹', a: 'c_caretaker_pine' }] },
    { q: 'Is there a swimming pool at school?', a: 'No, there is not. There is a gym.', pics: [{ e: '🏊' }] },
    { q: 'Is there a gym at school?', a: 'Yes, there is. There is a gym at school.', pics: [{ e: '🤸', a: 'p_gym' }] },
    { q: 'How many librarians are there at school?', a: 'There is one librarian at school.', pics: [{ e: '📚', a: 'c_librarian' }] },
    { q: 'How many music rooms are there at school?', a: 'There is one music room at school.', pics: [{ e: '🎵', a: 'p_music_room' }] }
  ];
  D.thereChips = ['Is there a …?', 'Yes, there is.', 'No, there is not.', 'How many … are there?', 'There are two …'];

  /* School Detective clues */
  D.detective = [
    { clue: 'She helps you when you are ill. Who is she?', o: [{ n: 'nurse', e: '🩺', a: 'c_nurse' }, { n: 'librarian', e: '📚', a: 'c_librarian' }, { n: 'caretaker', e: '🧹', a: 'c_caretaker_oak' }, { n: 'headteacher', e: '👔', a: 'c_mr_blue' }], a: 0, say: 'She is the school nurse.' },
    { clue: 'He cleans the school. He has keys and a broom. Who is he?', o: [{ n: 'headteacher', e: '👔', a: 'c_mr_blue' }, { n: 'caretaker', e: '🧹', a: 'c_caretaker_oak' }, { n: 'classmate', e: '🧒', a: 'c_leo' }, { n: 'nurse', e: '🩺', a: 'c_nurse' }], a: 1, say: 'He is the caretaker.' },
    { clue: 'You can read and take out books here. Where are we?', o: [{ n: 'gym', e: '🤸', a: 'p_gym' }, { n: 'art room', e: '🎨', a: 'p_art_room' }, { n: 'library', e: '📚', a: 'p_library' }, { n: 'music room', e: '🎵', a: 'p_music_room' }], a: 2, say: 'We are in the library.' },
    { clue: 'He is the boss of the school. His name is Mr. Blue. Who is he?', o: [{ n: 'caretaker', e: '🧹', a: 'c_caretaker_pine' }, { n: 'headteacher', e: '👔', a: 'c_mr_blue' }, { n: 'librarian', e: '📚', a: 'c_librarian' }, { n: 'classmate', e: '🧒', a: 'c_leo' }], a: 1, say: 'He is the headteacher.' },
    { clue: 'You can sing and play the guitar here. Where are we?', o: [{ n: 'music room', e: '🎵', a: 'p_music_room' }, { n: 'gym', e: '🤸', a: 'p_gym' }, { n: 'library', e: '📚', a: 'p_library' }, { n: 'art room', e: '🎨', a: 'p_art_room' }], a: 0, say: 'We are in the music room.' },
    { clue: 'You can paint a picture here. Where are we?', o: [{ n: 'gym', e: '🤸', a: 'p_gym' }, { n: 'art room', e: '🎨', a: 'p_art_room' }, { n: 'library', e: '📚', a: 'p_library' }, { n: 'sports field', e: '⚽' }], a: 1, say: 'We are in the art room.' },
    { clue: 'He is a pupil in your class. His name is Leo. Who is he?', o: [{ n: 'classmate', e: '🧒', a: 'c_leo' }, { n: 'nurse', e: '🩺', a: 'c_nurse' }, { n: 'headteacher', e: '👔', a: 'c_mr_blue' }, { n: 'librarian', e: '📚', a: 'c_librarian' }], a: 0, say: 'He is my classmate.' },
    { clue: 'You can play football and run here. It is outside. Where are we?', o: [{ n: 'office', e: '🏢' }, { n: 'sports field', e: '⚽' }, { n: 'library', e: '📚', a: 'p_library' }, { n: 'music room', e: '🎵', a: 'p_music_room' }], a: 1, say: 'We are on the sports field.' }
  ];

  root.W4G3Data = D;
})(window);
