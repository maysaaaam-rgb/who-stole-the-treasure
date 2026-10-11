/* Chuseok Week 2: Cooking and Treats homework (Grade 3, Classes 3A and 3B).
   English only, simple A1 language. Teacher settings are in CFG. */
window.CookHW = (function () {
  'use strict';
  var CFG = {
    homework: 'chuseok-w2-cooking',
    xp: 50,
    due: 'Thursday 15 October',   // shown on the page
    submitUrl: 'https://script.google.com/macros/s/AKfycbwKTNXOxf9tGkYRPxhqFRrlhaky-XY3juEb2pblzVJ0ELiIQTTy-KP18v7tFWYk0hblvw/exec',
    token: 'eaa-cook-305208ffc123'
  };

  var ROSTERS = {
    '3A': ['Aslıhan Akın', 'Ateş Özenci', 'Ayça Koca', 'Ayşe Mila Yılmaz', 'Batı Mustafa Kır', 'Beren Umur', 'Beste Aksu', 'Cemre Özbay', 'Ege Taş', 'Fatih Yetkin Yılmaz', 'Gurur Ürek', 'Gökçe Duman', 'Gülce Çalışkan', 'Güneş Nisa Aydın', 'Mavi Nil Bozkurt', 'Melis Ayşen Şentürk', 'Melodi Karaca'],
    '3B': ['Ahmet Alhasan', 'Ayaz Kahraman', 'Begüm Eren', 'Buğlem Arıöz', 'Demir Susatar', 'Deniz Akıncı', 'Deniz Kavasoğlu', 'Ece Aras', 'Ece Yaşar', 'Ecem Naz Yaman', 'Elif Miray Ata', 'İlker Mete Kırsaç', 'Mila Topçu', 'Rüzgar Sarp Kutlu', 'Sena Varaş', 'Ülkü Sancaklı']
  };

  /* adult: true = an adult must do this step */
  var RECIPES = [
    { id: 'punch', e: '🍹', n: 'Fruit Punch', kr: '화채 (hwachae)', color: '#38bdf8', level: 'Easy · no cooking', lc: 'easy',
      need: 'fruit (apple, pear, strawberries or watermelon), apple juice, honey',
      steps: [{ t: 'Wash the fruit.' }, { t: 'An adult cuts the fruit.', adult: true }, { t: 'Put the fruit in a bowl.' }, { t: 'Pour in the juice.' }, { t: 'Add a little honey and mix.' }] },
    { id: 'balls', e: '🍙', n: 'Rice Balls', kr: '주먹밥 (jumeokbap)', color: '#10b981', level: 'Easy · an adult cooks the rice', lc: 'mid',
      need: 'cooked rice, a little salt, sesame seeds, a little oil',
      steps: [{ t: 'An adult cooks the rice.', adult: true }, { t: 'Add the salt, sesame and oil.' }, { t: 'Mix.' }, { t: 'Wash your hands.' }, { t: 'Roll small balls.' }] },
    { id: 'songpyeon', e: '🍡', pic: '../unit2-g3-cooking/art/songpyeon.webp', n: 'Songpyeon', kr: '송편 (rice cakes)', color: '#f59e0b', level: 'Harder · an adult steams them', lc: 'hard',
      need: 'rice flour, warm water, honey, sesame (or sugar)',
      steps: [{ t: 'Mix the rice flour and warm water.' }, { t: 'Roll small balls.' }, { t: 'Fill with honey and sesame.' }, { t: 'Press into half moons.' }, { t: 'An adult steams them.', adult: true }] }
  ];

  /* the three writing boxes */
  var BOXES = [
    { id: 'made', icon: '🥣', title: '1. What did I make and what did I use?', ask: 'Write the name of your dish and the things you used.',
      starters: ['I made ...', 'I used ...'], ph: 'I made fruit punch. I used apples, juice and honey.' },
    { id: 'how', icon: '👩‍🍳', title: '2. How did I make it?', ask: 'Tell the steps. Use First, Then and Finally.',
      starters: ['First, I ...', 'Then, I ...', 'Finally, I ...'], ph: 'First, I washed the fruit. Then, I put it in a bowl. Finally, I poured the juice.' },
    { id: 'taste', icon: '😋', title: '3. How did it taste?', ask: 'Tell us about the taste. Did your family like it?',
      starters: ['It is sweet / yummy / soft / crunchy.', 'My family likes it.'], ph: 'It is sweet and yummy. My family likes it!' }
  ];

  return { CFG: CFG, ROSTERS: ROSTERS, RECIPES: RECIPES, BOXES: BOXES };
})();
