/* Classroom Instructions Challenge — Progressive 4-Stage Data */
(function (root) {
  'use strict';

  root.InstructionsData = {
    commands: [
      { id: 'open_book',   text: 'Open your book.',   short: 'Open your book',   emoji: '📖', art: 'art/cmd_open_book.webp',   clip: 'i_cmd_open',  hint: 'Hold your book and open the cover wide!' },
      { id: 'close_book',  text: 'Close your book.',  short: 'Close your book',  emoji: '📕', art: 'art/cmd_close_book.webp',  clip: 'i_cmd_close', hint: 'Gently close your book flat on the desk!' },
      { id: 'raise_hand',  text: 'Raise your hand.',  short: 'Raise your hand',  emoji: '🙋', art: 'art/cmd_raise_hand.webp',  clip: 'i_cmd_raise', hint: 'Put one hand high up in the air quietly!' },
      { id: 'stand_up',    text: 'Stand up.',         short: 'Stand up',         emoji: '🧍', art: 'art/cmd_stand_up.webp',    clip: 'i_cmd_stand', hint: 'Stand up straight beside your chair!' },
      { id: 'sit_down',    text: 'Sit down.',         short: 'Sit down',         emoji: '🪑', art: 'art/cmd_sit_down.webp',    clip: 'i_cmd_sit',   hint: 'Sit down neatly on your chair!' },
      { id: 'look_board',  text: 'Look at the board.',short: 'Look at the board',emoji: '👀', art: 'art/cmd_look_board.webp',  clip: 'i_cmd_look',  hint: 'Point your eyes straight at the smartboard!' },
      { id: 'take_pencil', text: 'Take your pencil.', short: 'Take your pencil', emoji: '✏️', art: 'art/cmd_take_pencil.webp', clip: 'i_cmd_take',  hint: 'Pick up your pencil and hold it ready!' },
      { id: 'write_name',  text: 'Write your name.',  short: 'Write your name',  emoji: '📝', art: 'art/cmd_write_name.webp',  clip: 'i_cmd_write', hint: 'Write your name neatly on your paper!' },
      { id: 'draw_circle', text: 'Draw a circle.',    short: 'Draw a circle',    emoji: '⭕', art: 'art/cmd_draw_circle.webp', clip: 'i_cmd_draw',  hint: 'Draw a big round circle with your pencil!' }
    ],
    combos: [
      { id: 'c1', step1: 'open_book',   step2: 'write_name',  text: 'Open your book and write your name.',   clip: 'i_combo_1' },
      { id: 'c2', step1: 'take_pencil', step2: 'draw_circle', text: 'Take your pencil and draw a circle.',   clip: 'i_combo_2' },
      { id: 'c3', step1: 'stand_up',    step2: 'raise_hand',  text: 'Stand up and raise your hand.',         clip: 'i_combo_3' },
      { id: 'c4', step1: 'close_book',  step2: 'look_board',  text: 'Close your book and look at the board.',clip: 'i_combo_4' },
      { id: 'c5', step1: 'sit_down',    step2: 'take_pencil', text: 'Sit down and take your pencil.',        clip: 'i_combo_5' },
      { id: 'c6', step1: 'open_book',   step2: 'look_board',  text: 'Open your book and look at the board.', clip: 'i_combo_6' }
    ]
  };
})(typeof window !== 'undefined' ? window : this);
