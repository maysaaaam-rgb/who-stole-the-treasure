/* Smart Board: the list of board commands (shown in /help, the quick chips and the suggestions). */
(function (root) {
  'use strict';

  root.SMART_COMMANDS = [
    { name: 'draw', aliases: ['picture', 'pic', 'd'], icon: '🎨', label: 'Draw', arg: 'bird', ai: 'maybe',
      desc: 'Shows a picture. Our own library first (free, instant), the AI draws anything else.' },
    { name: 'word', aliases: ['w', 'card'], icon: '🔤', label: 'Word card', arg: 'elephant', ai: true,
      desc: 'Word card: picture, syllables, an easy sentence and the Turkish meaning.' },
    { name: 'sentences', aliases: ['sentence', 'sent', 's', 'examples'], icon: '💬', label: 'Sentences', arg: 'can swim', ai: true,
      desc: 'Three easy example sentences. Tap a sentence to hear it.' },
    { name: 'quiz', aliases: ['q'], icon: '❓', label: 'Quiz', arg: 'animals', ai: true,
      desc: 'Five quick questions for the whole class. Add a number: /quiz colours 3' },
    { name: 'story', aliases: ['tale'], icon: '📖', label: 'Story', arg: 'a pirate cat', ai: true,
      desc: 'A tiny happy story, one line at a time, with the key words shining.' },
    { name: 'tr', aliases: ['translate', 'cevir', 'çevir'], icon: '🇹🇷', label: 'Translate', arg: 'kalem', ai: true,
      desc: 'Turkish to English, or English to Turkish.' },
    { name: 'check', aliases: ['correct', 'c', 'fix'], icon: '✅', label: 'Check', arg: 'i can swiming', ai: true,
      desc: 'Corrects a typed sentence and gives one kind tip.' },
    { name: 'ask', aliases: ['why', 'what'], icon: '🦉', label: 'Ask', arg: 'why is the sky blue', ai: true,
      desc: 'A short answer the whole class can understand.' },
    { name: 'neat', aliases: ['n', 'tidy'], icon: '✨', label: 'Neat writing', arg: '', ai: true,
      desc: 'Turns the handwriting on the board into neat, correct letters (it also happens by itself after you stop writing).' },
    { name: 'spell', aliases: ['letters'], icon: '🔡', label: 'Spell', arg: 'school', ai: false,
      desc: 'Shows and says the word letter by letter.' },
    { name: 'say', aliases: ['speak', 'read'], icon: '🔊', label: 'Say', arg: 'Good morning, class!', ai: false,
      desc: 'Reads the words aloud.' },
    { name: 'timer', aliases: ['t', 'time'], icon: '⏱️', label: 'Timer', arg: '2', ai: false,
      desc: 'A countdown: /timer 2 (minutes), /timer 30s, /timer 1:30' },
    { name: 'pick', aliases: ['random', 'team', 'teams'], icon: '🎯', label: 'Pick', arg: '4', ai: false,
      desc: 'Picks a team (/pick 4) or one thing from a list (/pick red, blue, green).' },
    { name: 'dice', aliases: ['roll'], icon: '🎲', label: 'Dice', arg: '', ai: false,
      desc: 'Rolls a dice.' },
    { name: 'bg', aliases: ['board', 'paper'], icon: '🖼️', label: 'Board', arg: 'lines', ai: false,
      desc: 'Changes the board: dark, chalk, white, lines (handwriting lines) or grid.' },
    { name: 'clear', aliases: ['new', 'clean'], icon: '🧹', label: 'Clear', arg: '', ai: false,
      desc: 'Clears the board (Undo brings it back).' },
    { name: 'help', aliases: ['h', '?'], icon: '💡', label: 'Help', arg: '', ai: false,
      desc: 'Shows all the commands.' }
  ];

  // The chips above the command bar (most used first)
  root.SMART_QUICK = ['draw', 'word', 'sentences', 'quiz', 'story', 'tr', 'check', 'spell', 'timer', 'pick', 'help'];

  root.SMART_INK = {
    dark: ['ink', '#fde047', '#38bdf8', '#f472b6', '#4ade80', '#fb923c', '#f87171'],
    light: ['ink', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2']
  };
})(window);
