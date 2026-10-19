/* Grade 4 Review: Teamwork (book pp. 56-61, Reading 1 pp. 58-60). Own wording; the book text is not copied. */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Hawks', e: '🦅', c: '#f97316' }, { n: 'Tigers', e: '🐯', c: '#ef4444' },
    { n: 'Bears', e: '🐻', c: '#8b5cf6' }, { n: 'Sharks', e: '🦈', c: '#0ea5e9' }
  ];
  D.quiz = [
    { q: 'How many teams are in the league?', o: ['twelve', 'five', 'two'], a: 0, e: '🏆', art: 'o_league', hint: 'The league is a big group of teams.' },
    { q: 'How many players from each team are on the court?', o: ['five', 'ten', 'two'], a: 0, e: '🏟️', art: 'o_court', hint: 'Ten players in all: how many for each team?' },
    { q: 'A basket from far away is worth ...', o: ['three points', 'two points', 'five points'], a: 0, e: '🎯', art: 'o_score', hint: 'From far away is harder, so it is worth more.' },
    { q: 'Who scored the three-pointer?', o: ['Chelsea Gray', 'Harry', 'Mr. Williams'], a: 0, e: '🙌', art: 'o_shooting', hint: 'She plays for the Sparks.' },
    { q: 'The Sparks were losing by ...', o: ['five points', 'one point', 'twenty points'], a: 0, e: '😬', art: 'o_basketball', hint: 'The game was almost over.' },
    { q: 'What did the Sparks win that year?', o: ['the championship', 'a ball', 'a bus'], a: 0, e: '🏆', art: 'o_league', hint: 'They worked even harder!' }
  ];
  D.words = [
    { w: 'league', e: '🏆', a: 'o_league', ex: 'Twelve teams play in the league.', gap: 'Twelve teams play in the ____.' },
    { w: 'court', e: '🏟️', a: 'o_court', ex: 'Ten players are on the court.', gap: 'Ten players are on the ____.' },
    { w: 'basket', e: '🧺', a: 'o_basket', ex: 'She throws the ball into the basket.', gap: 'She throws the ball into the ____.' },
    { w: 'score', e: '🔢', a: 'o_score', ex: 'Our team can score two points.', gap: 'Our team can ____ two points.' },
    { w: 'shooting', e: '🏀', a: 'o_shooting', ex: 'He is shooting the ball now.', gap: 'He is ____ the ball now.' }
  ];
  D.order = [
    { title: '🏀 The Sparks game', e: '🏀', steps: ['The Sparks played the Lynx in a big game.', 'The Sparks were losing by five points.', 'Chelsea Gray scored a three-pointer.', 'The Sparks worked harder and won the championship.'], art: ['o_league', 'o_basketball', 'o_shooting', 'o_league'] },
    { title: '🏀 A basketball game', e: '🏀', steps: ['The players come on the court.', 'They pass the ball to each other.', 'A player shoots at the basket.', 'The team scores. Everyone cheers!'], art: ['o_court', 'o_team_hands', 'o_shooting', 'o_basket'] },
    { title: '🎨 Making a team poster', e: '🎨', steps: ['We choose the team name.', 'We draw a big picture.', 'We write the words.', 'We show the poster to the class.'] }
  ];
  root.RevG4Data = D;
})(window);
