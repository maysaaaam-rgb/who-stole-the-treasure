/* Our Class Plan: the Monday reset lesson. The three rules, the class traffic light, moving in class, private help, kind words and the class promise.
   Simple A1 English. The traffic light is for the whole class (never a pupil's name). Own wording. */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Hawks', e: '🦅', c: '#f97316' }, { n: 'Tigers', e: '🐯', c: '#ef4444' },
    { n: 'Bears', e: '🐻', c: '#8b5cf6' }, { n: 'Sharks', e: '🦈', c: '#0ea5e9' }
  ];
  /* the three rules: e = picture, t = the rule, s = short words to say, act = the action to do together */
  D.rules = [
    { e: '🪑', t: 'Sit down. Stand only when I say “Stand”.', s: 'Sit. Stand on the signal.', act: 'Act it: sit tall, hands on the desk. When you hear “Stand”, stand up. When you hear “Sit”, sit down.' },
    { e: '🤫', t: 'One voice at a time. Hand up to speak.', s: 'One voice. Hand up.', act: 'Act it: put one finger on your lips. Put your hand up. Wait for “Yes, please”.' },
    { e: '🔔', t: 'Bell means stop. Eyes on me.', s: 'Bell = stop. Eyes on me.', act: 'Act it: when you hear the bell, stop talking, put your hands down and look at the teacher.' }
  ];
  /* the colours of the class traffic light: what it means and what we do */
  D.light = {
    green: { say: 'Green. Thank you!', t: 'GREEN · calm and ready', d: 'We are calm. The team bonus grows. Well done!' },
    yellow: { say: 'Yellow. Ten seconds to be calm.', t: 'YELLOW · warning', d: 'Ten seconds. Stop talking, sit down, eyes on me.' },
    red: { say: 'Red. Stop. Sit. Silent for one minute.', t: 'RED · stop and reset', d: 'Everybody sits. Silent for one minute. Then we start again.' }
  };
  /* "Which colour?": situations for the whole class; c = the right colour */
  D.situations = [
    { e: '🗣️', q: 'Everybody is talking at the same time.', c: 'yellow', hint: 'It is loud, but we can fix it in ten seconds.' },
    { e: '🙋', q: 'We are quiet and many hands are up.', c: 'green', hint: 'This is what we want!' },
    { e: '🏃', q: 'Many pupils are running and nobody is listening.', c: 'red', hint: 'We must stop and reset.' },
    { e: '🔔', q: 'The bell rings and the class stops in three seconds.', c: 'green', hint: 'Fast and calm. Great!' },
    { e: '🧍', q: 'Some pupils stand up in the middle of a game round.', c: 'yellow', hint: 'A warning. Sit down, please.' },
    { e: '🔊', q: 'It is a little loud, but the pupils are working.', c: 'yellow', hint: 'Quieter voices, please.' }
  ];
  /* the commands for the "Stand / Sit / Bell" practice and for Simon-says in the practice round */
  D.commands = [
    { e: '🧍', t: 'Stand up.', k: 'stand' }, { e: '🪑', t: 'Sit down.', k: 'sit' }, { e: '🙋', t: 'Hands up.', k: 'up' },
    { e: '🤫', t: 'Quiet, please.', k: 'quiet' }, { e: '👀', t: 'Eyes on me.', k: 'eyes' }, { e: '👏', t: 'Great job!', k: 'clap' }
  ];
  D.kind = [
    { e: '🙏', t: 'Please.' }, { e: '😊', t: 'Thank you.' }, { e: '🤝', t: 'Your turn.' }, { e: '💬', t: 'Can I help?' }, { e: '😔', t: 'Sorry.' }
  ];
  /* what the teacher may do, from the pupil's side (private, kind, no names on the board) */
  D.help = [
    { e: '🗣️', t: 'A quiet word', d: 'My teacher speaks to me quietly at my desk. It is to help me.' },
    { e: '🪑', t: 'A short reset', d: 'I can sit at a calm spot or in another seat for two minutes. Then I come back.' },
    { e: '📝', t: 'A short note', d: 'My teacher may write a note to my class teacher or my family. We make a plan together.' },
    { e: '🙋', t: 'I can ask for help', d: 'I put my hand up. I can say: “Can I have a break?” or “Can you help me?”' }
  ];
  D.promises = [
    { e: '🪑', t: 'I sit and listen.' }, { e: '🤝', t: 'I wait for my turn.' }, { e: '🔔', t: 'I stop when the bell rings.' }
  ];
  D.say = ['I sit and listen.', 'I wait for my turn.', 'I stop when the bell rings.', 'We are a calm team.'];
  D.door = 'Door pass: say one rule in English, for example “I wait for my turn.”';
  root.ResetData = D;
})(window);
