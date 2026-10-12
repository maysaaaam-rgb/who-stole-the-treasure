/* Unit 3 Board Game data. ?grade=3 = The Bear and I (Grade 3). ?grade=4 = Money (Grade 4).
   Simple A1 English written for this game (no book text copied). Each property square has two questions: [question, three options, index of the right one]. */
(function (root) {
  'use strict';
  function Q(q, o, a, say) { return { q: q, o: o, a: a, say: say || '' }; }
  function P(w, e, art, qs) { return { w: w, e: e, art: art || '', qs: qs }; }
  var TEAMS = [
    { n: 'Foxes', img: 't_fox', e: '🦊', c: '#f97316' }, { n: 'Owls', img: 't_owl', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', img: 't_bear', e: '🐻', c: '#a16207' }, { n: 'Hares', img: 't_hare', e: '🐇', c: '#06b6d4' }
  ];

  /* ---------------- Grade 3: The Bear and I ---------------- */
  var G3 = {
    grade: 3, theme: { bg: 'bg_arctic' }, title: 'Arctic Board Game', sub: 'Unit 3 · It Keeps Changing (The Bear and I) · Grade 3', bg: 'linear-gradient(160deg,#0c4a6e,#0e7490 55%,#164e63)',
    corners: { start: { n: 'START', art: 'i_start', e: '⛺', say: 'Start. The Arctic camp.' }, rest: { n: 'Cocoa Stop', art: 'i_rest', e: '☕', coins: 50 }, bonus: { n: 'Sing Stage', art: 'i_bonus', e: '🎤' }, treat: { n: 'Fish Feast', art: 'i_treat', e: '🍣', coins: 50 } },
    groups: [
      { id: 'A', name: 'Ice Fishing', color: '#38bdf8', price: 60, props: [
        P('hole', '🕳️', 'w_hole', [Q('A hole is …', ['an empty round space', 'a big white animal', 'a cold drink'], 0, 'A hole is an empty round space.'), Q('The man makes a ___ in the ice to fish.', ['hole', 'hat', 'hill'], 0, 'The man makes a hole in the ice to fish.')]),
        P('trap', '🪤', 'w_trap', [Q('A trap can ___ an animal.', ['catch', 'feed', 'paint'], 0, 'A trap can catch an animal.'), Q('Do not step in the ___! It can catch you.', ['trap', 'nap', 'map'], 0, 'Do not step in the trap!')]),
        P('thin', '📏', 'w_thin', [Q('Thin is the opposite of …', ['thick', 'cold', 'fast'], 0, 'Thin is the opposite of thick.'), Q('The ice is thin. It can ___ .', ['crack', 'sing', 'grow'], 0, 'The ice is thin. It can crack.')])] },
      { id: 'B', name: 'Danger Zone', color: '#f59e0b', price: 80, props: [
        P('enemy', '😠', 'w_enemy', [Q('An enemy is not your …', ['friend', 'hat', 'fish'], 0, 'An enemy is not your friend.'), Q('In the poem, the man thinks the bear is his ___ .', ['enemy', 'teacher', 'friend'], 0, 'The bear is his enemy.')]),
        P('twice', '✌️', 'w_twice', [Q('Twice means …', ['two times', 'one time', 'ten times'], 0, 'Twice means two times.'), Q('The bear was ___ my size.', ['twice', 'tiny', 'green'], 0, 'The bear was twice my size.')]),
        P('melting', '💧', 'w_melting', [Q('Melting ice becomes …', ['water', 'wood', 'sand'], 0, 'Melting ice becomes water.'), Q('The sun is hot. The ice is ___ .', ['melting', 'sleeping', 'reading'], 0, 'The ice is melting.')])] },
      { id: 'C', name: 'Cold Water', color: '#10b981', price: 100, props: [
        P('crack', '⚡', 'w_crack', [Q('A crack is a thin line when something is …', ['breaking', 'singing', 'growing'], 0, 'A crack is a thin line when something is breaking.'), Q('Thin ice can ___ .', ['crack', 'dance', 'paint'], 0, 'Thin ice can crack.')]),
        P('swim', '🏊', 'w_swim', [Q('Fish can …', ['swim', 'fly', 'drive'], 0, 'Fish can swim.'), Q('I swim in the ___ .', ['water', 'tree', 'book'], 0, 'I swim in the water.')]),
        P('danger', '⚠️', 'w_danger', [Q('Thin ice is a ___ . Be careful!', ['danger', 'gift', 'song'], 0, 'Thin ice is a danger.'), Q('Danger means something that can …', ['hurt you', 'feed you', 'sing'], 0, 'Danger means something that can hurt you.')])] },
      { id: 'D', name: 'Hope Hill', color: '#a855f7', price: 120, props: [
        P('together', '🤝', '', [Q('The man and the bear work ___ .', ['together', 'alone', 'never'], 0, 'They work together.'), Q('Together means …', ['with each other', 'far away', 'very big'], 0, 'Together means with each other.')]),
        P('hope', '🌈', 'w_hope', [Q('Hope means you want good things to …', ['happen', 'stop', 'sleep'], 0, 'Hope means you want good things to happen.'), Q('I ___ you win!', ['hope', 'hop', 'hat'], 0, 'I hope you win!')]),
        P('once more', '🔁', '', [Q('Once more means …', ['one more time', 'never again', 'very far'], 0, 'Once more means one more time.'), Q('Please say it ___ .', ['once more', 'once green', 'once cold'], 0, 'Please say it once more.')])] }
    ],
    chance: [
      { k: 'speak', t: 'Say a sentence with the word ice.', say: 'Say a sentence with the word ice.' },
      { k: 'speak', t: 'Say: The bear is hungry. Show a hungry face!', say: 'Say: The bear is hungry.' },
      { k: 'speak', t: 'Say three words that end with -ng.', say: 'Say three words that end with ng.' },
      { k: 'speak', t: 'Act the word swim and say it.', say: 'Act the word swim and say it.' },
      { k: 'speak', t: 'Say: The man has a fishing rod.', say: 'Say: The man has a fishing rod.' },
      { k: 'quiz', q: Q('Which word ends with -ng?', ['sing', 'sit', 'sun'], 0, 'Sing ends with ng.') },
      { k: 'quiz', q: Q('Which word ends with -ng?', ['cat', 'long', 'hat'], 1, 'Long ends with ng.') },
      { k: 'quiz', q: Q('The opposite of thin is …', ['thick', 'cold', 'small'], 0, 'The opposite of thin is thick.') },
      { k: 'money', t: 'The bear shares his fish with you!', coins: 80, say: 'The bear shares his fish with you!' },
      { k: 'money', t: 'You find a coin under the ice.', coins: 50, say: 'You find a coin under the ice.' },
      { k: 'money', t: 'The ice cracks! Pay 30 coins to fix the camp.', coins: -30, say: 'The ice cracks!' }
    ],
    bonusQ: [Q('Which word ends with -ng?', ['spring', 'spin', 'spot'], 0, 'Spring ends with ng.'), Q('Which word ends with -ng?', ['bang', 'bat', 'bag'], 0, 'Bang ends with ng.'),
      Q('Which word ends with -ng?', ['kit', 'king', 'kid'], 1, 'King ends with ng.'), Q('Which word ends with -ng?', ['ring', 'rip', 'run'], 0, 'Ring ends with ng.')]
  };

  /* ---------------- Grade 4: Money ---------------- */
  var G4 = {
    grade: 4, theme: { bg: 'bg_market' }, title: 'Money Board Game', sub: 'Unit 3 · How Much Is It? · Grade 4', bg: 'linear-gradient(160deg,#422006,#92400e 55%,#78350f)',
    corners: { start: { n: 'START', art: 'i_start', e: '🏦', say: 'Start. The bank.' }, rest: { n: 'Piggy Bank', art: 'i_rest', e: '🐷', coins: 50 }, bonus: { n: 'Money Quiz', art: 'i_bonus', e: '🎯' }, treat: { n: 'Treasure Chest', art: 'i_treat', e: '🧰', coins: 50 } },
    groups: [
      { id: 'A', name: 'Barter Market', color: '#f59e0b', price: 60, props: [
        P('bartered', '🔄', 'w_bartered', [Q('People bartered. They ___ things.', ['swapped', 'ate', 'painted'], 0, 'People bartered. They swapped things.'), Q('Bartered means they swapped things without ___ .', ['money', 'water', 'shoes'], 0, 'They swapped things without money.')]),
        P('metal', '🔩', 'w_metal', [Q('Spades and knives were made from ___ .', ['metal', 'paper', 'wool'], 0, 'They were made from metal.'), Q('Which one is metal?', ['a silver coin', 'a paper note', 'a plastic card'], 0, 'A silver coin is metal.')]),
        P('valuable', '💎', 'w_valuable', [Q('Something valuable is worth a ___ .', ['lot', 'dot', 'hat'], 0, 'Something valuable is worth a lot.'), Q('Which one is valuable?', ['gold', 'dust', 'a leaf'], 0, 'Gold is valuable.')])] },
      { id: 'B', name: 'Money Street', color: '#38bdf8', price: 80, props: [
        P('coin', '🪙', 'w_coin', [Q('The first true coins came from ___ .', ['Lydia', 'a school', 'the sea'], 0, 'The first true coins came from Lydia.'), Q('A coin is made from …', ['metal', 'paper', 'milk'], 0, 'A coin is made from metal.')]),
        P('paper money', '💵', 'w_paper_money', [Q('Paper money is easier to carry than metal ___ .', ['coins', 'grain', 'goats'], 0, 'Paper money is easier to carry than metal coins.'), Q('Paper money first came from ___ .', ['China', 'the moon', 'a farm'], 0, 'Paper money first came from China.')]),
        P('credit card', '💳', 'w_credit_card', [Q('A credit card is made from ___ .', ['plastic', 'wood', 'glass'], 0, 'A credit card is made from plastic.'), Q('The first credit card was in ___ .', ['1958', '600 BCE', '1200 BCE'], 0, 'The first credit card was in 1958.')])] },
      { id: 'C', name: 'Modern Pay', color: '#10b981', price: 100, props: [
        P('plastic', '🧴', 'w_plastic', [Q('Which thing is made from plastic?', ['a credit card', 'a gold coin', 'a paper note'], 0, 'A credit card is made from plastic.'), Q('A plastic bottle is not heavy. It is ___ .', ['light', 'hot', 'loud'], 0, 'A plastic bottle is light.')]),
        P('electronic money', '📱', 'w_electronic_money', [Q('Electronic money is on a phone or a ___ .', ['computer', 'goat', 'shell'], 0, 'Electronic money is on a phone or a computer.'), Q('You can use electronic money on the ___ .', ['internet', 'road', 'moon'], 0, 'You can use electronic money on the internet.')]),
        P('century', '⏳', '', [Q('A century is ___ years.', ['100', '10', '1000'], 0, 'A century is one hundred years.'), Q('The first credit card was in the 20th ___ .', ['century', 'day', 'hour'], 0, 'The 20th century.')])] },
      { id: 'D', name: 'Think Hill', color: '#a855f7', price: 120, props: [
        P('problem', '😟', '', [Q('A problem is something ___ .', ['difficult', 'yummy', 'blue'], 0, 'A problem is something difficult.'), Q('Goats are heavy to carry. That is a ___ .', ['problem', 'solution', 'gift'], 0, 'That is a problem.')]),
        P('solution', '💡', '', [Q('A solution is a way to ___ a problem.', ['fix', 'break', 'paint'], 0, 'A solution is a way to fix a problem.'), Q('Shells are easier to carry. That is a ___ .', ['solution', 'problem', 'hat'], 0, 'That is a solution.')]),
        P('belong to', '👛', 'w_belong_to', [Q('If a bag belongs to you, it is ___ .', ['yours', 'cold', 'far'], 0, 'It is yours.'), Q('This wallet belongs to Paige. It is ___ .', ['hers', 'his', 'ours'], 0, 'It is hers.')])] }
    ],
    chance: [
      { k: 'speak', t: 'Say: Paper money is easier to carry than coins.', say: 'Say: Paper money is easier to carry than coins.' },
      { k: 'speak', t: 'Say two things that are made from metal.', say: 'Say two things that are made from metal.' },
      { k: 'speak', t: 'Say: The first credit card was in 1958.', say: 'Say: The first credit card was in 1958.' },
      { k: 'speak', t: 'Say: I think the next money will be …', say: 'Say: I think the next money will be.' },
      { k: 'speak', t: 'Ask a friend: How much is it? Your friend answers.', say: 'Ask a friend: How much is it?' },
      { k: 'quiz', q: Q('Which came first?', ['coins', 'credit cards', 'phones'], 0, 'Coins came first.') },
      { k: 'quiz', q: Q('How many years are in a century?', ['100', '10', '50'], 0, 'One hundred years.') },
      { k: 'quiz', q: Q('Which one is a problem?', ['Goats are heavy to carry.', 'A shell is light.', 'A coin is shiny.'], 0, 'Goats are heavy to carry. That is a problem.') },
      { k: 'money', t: 'You find a coin in your pocket.', coins: 50, say: 'You find a coin in your pocket.' },
      { k: 'money', t: 'You return a lost wallet. A reward for you!', coins: 80, say: 'You return a lost wallet. A reward for you!' },
      { k: 'money', t: 'You buy a snack. Pay 30 coins.', coins: -30, say: 'You buy a snack.' }
    ],
    bonusQ: [Q('Paper money is ___ to carry than coins.', ['easier', 'harder', 'blue'], 0, 'Paper money is easier to carry than coins.'), Q('Electronic money is on a …', ['phone', 'goat', 'rock'], 0, 'Electronic money is on a phone.'),
      Q('People bartered before they used …', ['coins', 'phones', 'cars'], 0, 'People bartered before they used coins.'), Q('A credit card is made from …', ['plastic', 'metal', 'paper'], 0, 'A credit card is made from plastic.')]
  };
  G4.corners.start.art = ''; G4.corners.rest.art = ''; G4.corners.bonus.art = '';   // the pictures we have fit the Arctic board; Money uses emoji for these corners until new art exists
  root.BoardData = { teams: TEAMS, 3: G3, 4: G4 };
})(window);
