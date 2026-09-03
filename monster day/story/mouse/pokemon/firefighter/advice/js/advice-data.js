/**
 * Advice Academy Data: Problems, Dilemmas, Should/Shouldn't Rounds, Comic Stories & Badges
 */

window.ADVICE_DATA = {
  // 10 Lesson Stages
  stages: [
    { num: 1, id: 'intro', title: '1. Emergency Help', time: '4 min', icon: '🚨' },
    { num: 2, id: 'problem', title: '2. What\'s the Problem?', time: '4 min', icon: '🔍' },
    { num: 3, id: 'should_game', title: '3. Should or Shouldn\'t', time: '5 min', icon: '⚡' },
    { num: 4, id: 'consequence', title: '4. Consequence Detective', time: '4 min', icon: '🕵️' },
    { num: 5, id: 'best_advice', title: '5. Which Advice is Best?', time: '4 min', icon: '💡' },
    { num: 6, id: 'comic_tom', title: '6. Tom\'s Terrible Morning', time: '4 min', icon: '📰' },
    { num: 7, id: 'roleplay', title: '7. Pair Role-Play', time: '4 min', icon: '🎭' },
    { num: 8, id: 'puzzle', title: '8. Advice Puzzle', time: '4 min', icon: '🧩' },
    { num: 9, id: 'battle', title: '9. Crazy Advice Battle', time: '3 min', icon: '🍌' },
    { num: 10, id: 'save_prof', title: '10. Save Prof. Should!', time: '4 min', icon: '🏆' }
  ],

  // Stage 1: Professor Should Intro Dilemma
  introDilemma: {
    question: "I have homework! What should I do?",
    options: [
      {
        id: 'game',
        text: "Play video games 🎮",
        type: 'bad',
        reaction: "BUT MY GAME IS ONLY 3,000 POINTS AWAY FROM MAKING ME KING OF THE UNIVERSE! ...Wait, my teacher will be very angry tomorrow!",
        advice: "You shouldn't play games before doing homework."
      },
      {
        id: 'study',
        text: "Do your homework first 📚",
        type: 'best',
        reaction: "WHAT?! Study?! ...Hmm, actually, you are wise Advice Experts! If I finish my homework now, I can relax later!",
        advice: "You should study and finish your homework."
      },
      {
        id: 'sleep',
        text: "Go to sleep right now 😴",
        type: 'crazy',
        reaction: "Zzz... Good night! Wait! My homework won't do itself while I dream about flying pancakes!",
        advice: "You shouldn't go to sleep with unfinished homework."
      }
    ]
  },

  // Stage 2: Snowstorm Investigation Scene
  snowScene: {
    title: "The Winter Walk Disaster!",
    characterName: "Billy the Shivering Boy",
    environment: "A freezing cold snowstorm (-5°C) with swirling snow!",
    wornItems: [
      { id: 'flipflops', name: 'Flip-Flops', icon: '🩴', isProblem: true, reason: 'Feet are freezing!' },
      { id: 'tshirt', name: 'Summer T-Shirt', icon: '👕', isProblem: true, reason: 'Body is shivering!' },
      { id: 'cap', name: 'Baseball Cap', icon: '🧢', isProblem: false, reason: 'A cap is okay, but not warm enough.' }
    ],
    nearbyItems: [
      { id: 'coat', name: 'Warm Winter Coat', icon: '🧥', isSolution: true, sentence: 'He should wear a warm coat.' },
      { id: 'scarf', name: 'Woolly Scarf', icon: '🧣', isSolution: true, sentence: 'He should wear a warm scarf.' },
      { id: 'boots', name: 'Snow Boots', icon: '🥾', isSolution: true, sentence: 'He should wear snow boots.' },
      { id: 'icecream', name: 'Cold Ice Cream', icon: '🍦', isSolution: false, sentence: 'He shouldn\'t eat ice cream in the snow!' }
    ]
  },

  // Stage 3: Should or Shouldn't 6 Rapid Visual Rounds
  grammarRounds: [
    {
      id: 'g1',
      context: 'Inside the School Library 📚',
      emoji: '🤫',
      sentence: 'You ________ talk loudly in the library.',
      answer: 'shouldnt',
      reaction: 'WHY IS EVERYONE SHUSHING ME?! Oh, of course! People are studying quietly.',
      rule: 'In the library, you shouldn\'t make loud noise.'
    },
    {
      id: 'g2',
      context: 'Crossing the Busy Road 🚦',
      emoji: '🚗',
      sentence: 'You ________ look left and right before crossing.',
      answer: 'should',
      reaction: 'PHEW! Look both ways so cars can see you safely!',
      rule: 'You should always look left and right for safety.'
    },
    {
      id: 'g3',
      context: 'Midnight Bedtime 🌙',
      emoji: '🥱',
      sentence: 'You ________ stay awake until 3:00 AM playing games.',
      answer: 'shouldnt',
      reaction: 'YAWN! My eyes are turning into red lasers! I am so tired!',
      rule: 'You shouldn\'t stay up late on school nights.'
    },
    {
      id: 'g4',
      context: 'Healthy Eating 🥗',
      emoji: '🍎',
      sentence: 'You ________ eat fruit and vegetables every day.',
      answer: 'should',
      reaction: 'YUM! Apples and carrots give your brain superpowers!',
      rule: 'You should eat healthy food to grow strong.'
    },
    {
      id: 'g5',
      context: 'Classroom Lesson 👩‍🏫',
      emoji: '👂',
      sentence: 'You ________ listen carefully when the teacher is speaking.',
      answer: 'should',
      reaction: 'Aha! That is how you learn all the coolest things in the world!',
      rule: 'You should listen to the teacher during class.'
    },
    {
      id: 'g6',
      context: 'Messy Bedroom 🧸',
      emoji: '🧦',
      sentence: 'You ________ leave your clothes and toys all over the floor.',
      answer: 'shouldnt',
      reaction: 'OUCH! I just stepped on a toy dinosaur! Clean up time!',
      rule: 'You shouldn\'t leave messy toys on the floor.'
    }
  ],

  // Stage 4: Consequence Detective (Cause & Effect)
  consequenceCases: [
    {
      id: 'c1',
      title: 'Gaming Until 3:00 AM on a Sunday Night',
      character: 'Leo the Tired Gamer 🎮',
      cause: 'Stays awake all night playing video games.',
      effects: [
        { text: 'Very tired and sleepy next morning 😴', isReal: true },
        { text: 'Falls asleep during English class 🏫', isReal: true },
        { text: 'Cannot concentrate on tests 📚', isReal: true },
        { text: 'Turns into a flying magical unicorn 🦄', isReal: false }
      ],
      solution: 'He should go to bed early and sleep for 9 hours.',
      reason: 'Because he needs energy and focus for school tomorrow!'
    },
    {
      id: 'c2',
      title: 'Eating 8 Candy Bars Right Before Dinner',
      character: 'Sammy Sweet-Tooth 🍫',
      cause: 'Eats lots of chocolate and candy at 5:00 PM.',
      effects: [
        { text: 'Gets a terrible stomach ache 🤢', isReal: true },
        { text: 'Cannot eat delicious healthy dinner 🍽️', isReal: true },
        { text: 'Can get tooth cavities from sugar 🦷', isReal: true },
        { text: 'Grows 5 extra arms and legs 🐙', isReal: false }
      ],
      solution: 'He shouldn\'t eat sugar before dinner.',
      reason: 'Because dinner has the vitamins his body needs.'
    }
  ],

  // Stage 5: Which Advice is Best? (Reasoning with "Because...")
  bestAdviceDilemma: {
    scenario: "You have lots of math homework due tomorrow, but your best friend invites you to play online games right now!",
    options: [
      {
        letter: 'A',
        text: 'Play video games all evening and ignore the homework.',
        rating: 'Bad Advice ❌',
        reason: 'Because you will get in trouble with your teacher tomorrow!'
      },
      {
        letter: 'B',
        text: 'Do your homework first for 30 minutes, then play games together!',
        rating: 'BEST ADVICE ⭐',
        reason: 'Because you finish your work first and can play with a happy mind!'
      },
      {
        letter: 'C',
        text: 'Feed your homework to your pet cat and move to Antarctica.',
        rating: 'Crazy Advice 🤪',
        reason: 'Because cats cannot eat paper and Antarctica is much too cold!'
      }
    ]
  },

  // Stage 6: Tom's Terrible Morning (Comic Story)
  tomStory: [
    {
      step: 1,
      title: 'Late Wake-Up!',
      icon: '⏰',
      desc: 'Tom\'s alarm clock rings at 8:40 AM. School starts at 8:45 AM!',
      problem: 'He woke up too late.',
      advice: 'He should wake up early at 7:30 AM.'
    },
    {
      step: 2,
      title: 'Empty Stomach!',
      icon: '🥣',
      desc: 'Tom runs past the kitchen without eating breakfast.',
      problem: 'He has no food or energy.',
      advice: 'He should eat a healthy breakfast.'
    },
    {
      step: 3,
      title: 'The Sock Catastrophe!',
      icon: '🧦',
      desc: 'Tom puts on one long green sock and one tiny pink polka-dot sock!',
      problem: 'His socks are completely mismatched.',
      advice: 'He should find matching socks.'
    },
    {
      step: 4,
      title: 'Panic Run!',
      icon: '🏃',
      desc: 'Tom sprints down the road in a massive hurry.',
      problem: 'He might trip and fall.',
      advice: 'He should walk carefully and not rush.'
    },
    {
      step: 5,
      title: 'The Missing Bag!',
      icon: '🎒',
      desc: 'Tom arrives at the school gate... but his school bag is still at home on his bed!',
      problem: 'He forgot his books and pencils.',
      advice: 'He should pack his school bag the night before.'
    }
  ],

  tomCrazyAdvice: {
    quote: "He should wear 17 pairs of socks on his head!",
    type: 'crazy',
    options: [
      { label: '👍 GOOD ADVICE', isCorrect: false },
      { label: '🤪 CRAZY ADVICE', isCorrect: true }
    ],
    explanation: "17 socks on your head will just make you look like a funny monster!"
  },

  // Stage 7: Pair Role-Play Cards
  roleplayCards: [
    {
      id: 'rp1',
      problem: "🐶 My dog is sleeping on my English homework!",
      starterA: "I have a problem! My dog is sleeping on my homework. What should I do?",
      starterB: "You should gently pet your dog and move your paper."
    },
    {
      id: 'rp2',
      problem: "🍦 I want to eat chocolate ice cream for breakfast, lunch, and dinner!",
      starterA: "I only want ice cream all day! What should I do?",
      starterB: "You shouldn't eat only ice cream. You should eat fruit and soup!"
    },
    {
      id: 'rp3',
      problem: "🌧️ It is raining hard outside, but I want to play football!",
      starterA: "It's raining outside and I want to kick my football! What should I do?",
      starterB: "You shouldn't play in the thunderstorm. You should play a board game inside!"
    },
    {
      id: 'rp4',
      problem: "🧦 I can't find my school shoes anywhere!",
      starterA: "I cannot find my shoes and the bus is coming! What should I do?",
      starterB: "You should look under your bed and ask your family for help!"
    }
  ],

  // Stage 8: Advice Puzzle Cards
  classroomPuzzle: {
    problem: "🚨 THE CLASSROOM IS TOO NOISY!",
    cards: [
      { id: 'p1', text: 'Shout louder than everyone else! 📢', isBest: false, reason: 'That makes it even noisier!' },
      { id: 'p2', text: 'Speak quietly with an inside voice. 🤫', isBest: true, reason: 'Helps everyone hear and stay calm.' },
      { id: 'p3', text: 'Listen carefully to the teacher. 👂', isBest: true, reason: 'The teacher gives important directions.' },
      { id: 'p4', text: 'Run around the desks in circles! 🏃', isBest: false, reason: 'Dangerous and very disruptive!' },
      { id: 'p5', text: 'Raise your hand before you speak. 🙋', isBest: true, reason: 'Polite classroom turn-taking.' }
    ]
  },

  // Stage 9: Crazy Advice Battle
  crazyBattles: [
    {
      id: 'cb1',
      scenario: "🚨 YOUR FRIEND IS WEARING A BANANA ON HIS HEAD! 🍌",
      choices: [
        { text: "Take the banana off and eat it as a snack.", category: 'good', icon: '👍' },
        { text: "Put 4 more bananas on his head and call him King Banana!", category: 'funny', icon: '😂' },
        { text: "Superglue the banana to his ears forever.", category: 'bad', icon: '❌' }
      ]
    },
    {
      id: 'cb2',
      scenario: "🐱 A CAT IS SLEEPING ON TOP OF THE TEACHER'S LAPTOP! 💻",
      choices: [
        { text: "Gently pick up the cat and place it on a cozy chair.", category: 'good', icon: '👍' },
        { text: "Ask the cat to grade all the English homework tests!", category: 'funny', icon: '😂' },
        { text: "Pour a glass of water all over the computer.", category: 'bad', icon: '❌' }
      ]
    }
  ],

  // Stage 10: Final Multi-Problem Scene (Save Professor Should!)
  finalEmergency: {
    title: "PROFESSOR SHOULD'S 5-ALARM CHAOS!",
    problems: [
      { icon: '📚', name: '100 Pages of Homework', desc: 'Books piled high, due tomorrow morning!' },
      { icon: '📱', name: 'Buzzing Smartphone', desc: 'Blinking text messages and games non-stop!' },
      { icon: '🎮', name: 'Blinking Game Console', desc: 'Tempting controller in his hands!' },
      { icon: '🥱', name: 'Exhausted & Yawning', desc: 'Eyes are closing, drooping head!' },
      { icon: '🍕', name: 'Cold Greasy Pizza', desc: 'Eating cold junk food in bed!' }
    ],
    badges: [
      { id: 'thinkers', title: '🧠 Best Thinkers', desc: 'Solved complex problems with logic!' },
      { id: 'solution', title: '💡 Best Solution', desc: 'Gave the most practical daily advice!' },
      { id: 'funniest', title: '😂 Funniest Advice', desc: 'Made the whole class giggle!' },
      { id: 'english', title: '🗣️ Best English', desc: 'Used clear "should" & "because" sentences!' },
      { id: 'expert', title: '🏆 Master Advice Expert', desc: 'Saved Professor Should from disaster!' }
    ]
  }
};
