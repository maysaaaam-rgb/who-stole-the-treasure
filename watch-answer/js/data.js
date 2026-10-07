/* Watch & Answer: video lessons where the cartoon stops by itself and the class answers a question.
   All questions are original and written for A1+ learners. The video plays from YouTube (embedded). Times are in seconds. */
window.WatchData = (function () {
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];
  D.lessons = [{
    id: 'bean-trolley', grade: 3, title: 'Mr Bean: Super Trolley', vid: 'uyYIojxxljE', minutes: 35,
    goals: ['I can say what Mr Bean is doing.', 'I can say where he is.', 'I can tell the story: First, Then, Finally.'],
    predict: { q: 'The cartoon is called SUPER TROLLEY. What can a super trolley do?', opts: [['🚀', 'It can go very fast.'], ['🛸', 'It can fly.'], ['🎵', 'It can sing.']], note: 'There is no wrong answer. We will see!' },
    /* the video stops at each time (seconds) and asks the question. a = number of the right option (0, 1, 2). */
    checkpoints: [
      { t: 42, q: 'What is Mr Bean eating?', opts: [['🥣', 'cereal'], ['🍕', 'pizza'], ['🍲', 'soup']], a: 0, say: 'Mr Bean is eating cereal.', hint: 'Look at the bowl and the spoon.' },
      { t: 86, q: 'Who is on the stairs with Mr Bean?', opts: [['👵', 'an old lady and a cat'], ['👮', 'a policeman'], ['👩‍⚕️', 'a doctor']], a: 0, say: 'An old lady and a cat are on the stairs.', hint: 'Look at the stairs.' },
      { t: 132, q: 'Where is Mr Bean now?', opts: [['🏫', 'at school'], ['🛒', 'at the shop'], ['🌳', 'at the park']], a: 1, say: 'Mr Bean is at the shop.', hint: 'Look at the big building and the cars.' },
      { t: 190, q: 'What is Mr Bean in?', opts: [['🚗', 'a car'], ['🚤', 'a boat'], ['🛒', 'a trolley']], a: 2, say: 'Mr Bean is in a trolley.', hint: 'It is the SUPER TROLLEY!' },
      { t: 250, q: 'Who is with Mr Bean?', opts: [['🧸', 'Teddy'], ['🐶', 'a dog'], ['👶', 'a baby']], a: 0, say: 'Teddy is with Mr Bean.', hint: 'It is his friend. It is brown.' },
      { t: 278, q: 'How does the shop lady feel?', opts: [['😴', 'sleepy'], ['😮', 'surprised'], ['😊', 'happy']], a: 1, say: 'The shop lady is surprised.', hint: 'Look at her face and her eyes.' },
      { t: 340, q: 'What is on the shelf?', opts: [['🥛', 'milk'], ['🧃', 'juice'], ['🥚', 'eggs']], a: 0, say: 'There is milk on the shelf.', hint: 'There is a cow on the box.' },
      { t: 525, q: 'What is Mr Bean driving?', opts: [['🚜', 'a yellow forklift'], ['🚌', 'a bus'], ['🚲', 'a bike']], a: 0, say: 'Mr Bean is driving a yellow forklift.', hint: 'It is yellow and it lifts big boxes.' },
      { t: 588, q: 'Where is Mr Bean going now?', opts: [['🏠', 'home'], ['🏫', 'to school'], ['🏖️', 'to the beach']], a: 0, say: 'Mr Bean is going home.', hint: 'He has the shopping. Look at the road.' },
      { t: 640, q: 'What is in the bowl at the end?', opts: [['🥣', 'cereal'], ['🍜', 'noodles'], ['🍰', 'cake']], a: 0, say: 'There is cereal in the bowl.', hint: 'It is the same food as at the start.' }
    ],
    /* the story in the right order (for the Retell game) */
    retell: [
      { e: '🥣', s: 'Mr Bean eats cereal.' }, { e: '👵', s: 'He sees an old lady and a cat.' }, { e: '🛒', s: 'He goes to the shop.' },
      { e: '🧸', s: 'He pushes a trolley with Teddy.' }, { e: '🚜', s: 'He drives a forklift.' }, { e: '🏠', s: 'He goes home with the shopping.' }
    ]
  }];
  return D;
})();
