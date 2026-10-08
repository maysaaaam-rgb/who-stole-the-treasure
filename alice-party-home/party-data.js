/* Alice Tea Party — HOME PRACTICE (Grade 4, A1+)
   One file holds all content. Pages (app + printable cards) are generated from it.
   - roles:      what each character says about themselves (3 sentences), 6 picture words, 2 "Ask me" Q&As, 2 props
   - dialogues:  the 1-minute pair/trio conversations, `who` = role key
   - classes:    every student -> role + which dialogue (pair) they perform + photo
*/
window.PARTY = {
  roles: {
    alice: {
      name: 'ALICE', short: 'Alice', color: '#2563eb',
      sentences: ['I am Alice. I am ten.', 'I have a small golden key.', 'I like tea, but not cold tea.'],
      words: [['key', '🔑'], ['dress', '👗'], ['bow', '🎀'], ['teacup', '☕'], ['door', '🚪'], ['clock', '🕐']],
      askMe: [['What do you have?', 'I have a small key.'], ['Can you run fast?', 'Yes, I can.']],
      props: ['a paper key', 'a teacup']
    },
    hatter: {
      name: 'MAD HATTER', short: 'the Hatter', color: '#7c3aed',
      sentences: ['I am the Mad Hatter.', 'I have a big blue hat.', 'I make tea every day.'],
      words: [['hat', '🎩'], ['teapot', '🫖'], ['tea', '🍵'], ['cake', '🍰'], ['cup', '☕'], ['chair', '🪑']],
      askMe: [['Do you like my hat?', 'Yes, I do. It is very big!'], ['What do you drink?', 'I drink tea.']],
      props: ['a big paper hat', 'a teapot']
    },
    rabbit: {
      name: 'WHITE RABBIT', short: 'the Rabbit', color: '#0e7490',
      sentences: ['I am the White Rabbit.', 'I have a big gold watch.', 'I am always late!'],
      words: [['watch', '⌚'], ['clock', '🕐'], ['carrot', '🥕'], ['letter', '📜'], ['rabbit', '🐰'], ['hurry', '🏃']],
      askMe: [['What time is it?', 'It is tea time!'], ['Are you late?', 'Yes, I am! Sorry!']],
      props: ['a paper watch', 'a letter']
    },
    whitequeen: {
      name: 'WHITE QUEEN', short: 'the White Queen', color: '#475569',
      sentences: ['I am the White Queen.', 'I have a small white crown.', 'I can make magic tea.'],
      words: [['crown', '👑'], ['potion', '🧪'], ['star', '⭐'], ['magic', '✨'], ['flower', '🌸'], ['cup', '☕']],
      askMe: [['Can you make magic?', 'Yes, I can!'], ['What is your crown like?', 'It is small and white.']],
      props: ['a paper crown', 'a small bottle']
    },
    hare: {
      name: 'MARCH HARE', short: 'the Hare', color: '#b45309',
      sentences: ['I am the March Hare.', 'I have two long ears.', 'I like carrots and crazy tea.'],
      words: [['ears', '👂'], ['carrot', '🥕'], ['tea', '🍵'], ['cake', '🍰'], ['teapot', '🫖'], ['butter', '🧈']],
      askMe: [['Do you like carrots?', 'Yes, I do!'], ['Can you jump?', 'Yes, I can jump very high.']],
      props: ['long paper ears', 'a carrot']
    },
    cheshire: {
      name: 'CHESHIRE CAT', short: 'the Cheshire Cat', color: '#9333ea',
      sentences: ['I am the Cheshire Cat.', 'I have a big, funny smile.', 'I can disappear!'],
      words: [['smile', '😁'], ['tail', '🐈'], ['cat', '🐱'], ['tree', '🌳'], ['eyes', '👀'], ['purple', '💜']],
      askMe: [['Can you disappear?', 'Yes, I can! Look... gone!'], ['Do you like tea?', 'Yes, a little.']],
      props: ['cat ears', 'a big smile']
    },
    cat: {
      name: 'BLACK CAT', short: 'the Cat', color: '#166534',
      sentences: ['I am a black cat.', 'I have two sharp ears.', 'I can climb and jump.'],
      words: [['cat', '🐱'], ['milk', '🥛'], ['mouse', '🐭'], ['fish', '🐟'], ['yarn', '🧶'], ['bed', '🛏️']],
      askMe: [['Do you like milk?', 'Yes, I do.'], ['Can you climb a tree?', 'Yes, I can.']],
      props: ['cat ears', 'a ball of yarn']
    },
    bayard: {
      name: 'BAYARD THE DOG', short: 'Bayard', color: '#92400e',
      sentences: ['I am Bayard, the dog.', 'I have a very good nose.', 'I can find people.'],
      words: [['dog', '🐕'], ['nose', '👃'], ['bone', '🦴'], ['ball', '⚽'], ['drum', '🥁'], ['paw', '🐾']],
      askMe: [['Do you like bones?', 'Yes, I do!'], ['Can you find a cat?', 'Yes, I can smell it!']],
      props: ['dog ears', 'a paper bone']
    },
    redqueen: {
      name: 'RED QUEEN', short: 'the Red Queen', color: '#be123c',
      sentences: ['I am the Red Queen.', 'I have a very big head.', "I don't like noise!"],
      words: [['crown', '👑'], ['heart', '❤️'], ['card', '🃏'], ['rose', '🌹'], ['cake', '🍰'], ['garden', '🌷']],
      askMe: [['Do you like noise?', "No, I don't!"], ['What is your favourite colour?', 'Red, of course!']],
      props: ['a red paper crown', 'a playing card']
    },
    dragon: {
      name: 'JABBERWOCKY', short: 'the Dragon', color: '#15803d',
      sentences: ['I am the Jabberwocky.', 'I have two big wings.', 'I can breathe fire.'],
      words: [['dragon', '🐉'], ['fire', '🔥'], ['sword', '⚔️'], ['castle', '🏰'], ['shield', '🛡️'], ['night', '🌙']],
      askMe: [['Can you fly?', 'Yes, I can!'], ['Are you scary?', 'A little. Boo!']],
      props: ['paper wings', 'a toy sword']
    },
    bandersnatch: {
      name: 'BANDERSNATCH', short: 'the Bandersnatch', color: '#0f766e',
      sentences: ['I am the Bandersnatch.', 'I have long, sharp claws.', 'I can run very fast.'],
      words: [['claws', '🐾'], ['monster', '👹'], ['forest', '🌲'], ['run', '🏃'], ['key', '🔑'], ['eyes', '👀']],
      askMe: [['Can you run fast?', 'Yes, very fast!'], ['Do you have claws?', 'Yes, I do. Be careful!']],
      props: ['paper claws', 'a big key']
    },
    sister: {
      name: "ALICE'S SISTER", short: "Alice's Sister", color: '#1d4ed8',
      sentences: ["I am Alice's sister.", 'I have a big story book.', 'I like quiet days.'],
      words: [['book', '📖'], ['garden', '🌷'], ['dress', '👗'], ['sun', '☀️'], ['tree', '🌳'], ['smile', '🙂']],
      askMe: [['What do you read?', 'I read a story book.'], ['Do you like the garden?', 'Yes, it is beautiful.']],
      props: ['a book', 'a flower']
    },
    mother: {
      name: "ALICE'S MOTHER", short: "Alice's Mother", color: '#9f1239',
      sentences: ["I am Alice's mother.", 'I have a pretty pink dress.', 'I want a happy garden party.'],
      words: [['dress', '👗'], ['party', '🎉'], ['cake', '🍰'], ['garden', '🌷'], ['hat', '👒'], ['smile', '🙂']],
      askMe: [['Do you like parties?', 'Yes, I do!'], ['What do you want?', 'I want a nice garden party.']],
      props: ['a nice hat', 'a plate of cake']
    },
    twosister1: {
      name: 'SISTER ONE', short: 'Sister One', color: '#4d7c0f',
      sentences: ['I am Sister One.', 'I have a big gold button.', "I always say 'Contrariwise!'"],
      words: [['button', '🔘'], ['hat', '🎩'], ['sister', '👭'], ['friend', '🤝'], ['bell', '🔔'], ['smile', '🙂']],
      askMe: [['Do you have a button?', 'Yes, I do. Look!'], ['Do you like your sister?', 'Yes, I do!']],
      props: ['a big button', 'a green hat']
    },
    twosister2: {
      name: 'SISTER TWO', short: 'Sister Two', color: '#a16207',
      sentences: ['I am Sister Two.', 'I have a small loud bell.', "I always say 'Nohow!'"],
      words: [['bell', '🔔'], ['hat', '🎩'], ['sister', '👭'], ['friend', '🤝'], ['button', '🔘'], ['smile', '🙂']],
      askMe: [['Do you have a bell?', 'Yes, I do. Ding!'], ['Are you the same?', "No, I'm not!"]],
      props: ['a small bell', 'a green hat']
    },
    absolem: {
      name: 'ABSOLEM', short: 'Absolem', color: '#1d4ed8',
      sentences: ['I am Absolem.', 'I am a blue caterpillar.', 'I always ask: Who are you?'],
      words: [['caterpillar', '🐛'], ['mushroom', '🍄'], ['smoke', '💨'], ['butterfly', '🦋'], ['question', '❓'], ['blue', '🔵']],
      askMe: [['Do you like mushrooms?', 'Yes, I do.'], ['Are you big?', 'No, I am small.']],
      props: ['blue paper antennae', 'a mushroom']
    },
    hamish: {
      name: 'HAMISH ASCOT', short: 'Hamish', color: '#7f1d1d',
      sentences: ['I am Lord Hamish.', 'I have a tall black hat.', 'I am very rich.'],
      words: [['hat', '🎩'], ['coat', '🧥'], ['watch', '⌚'], ['money', '💰'], ['garden', '🌷'], ['stick', '🦯']],
      askMe: [['Are you rich?', 'Yes, I am!'], ['Do you like Alice?', 'Yes, she is nice.']],
      props: ['a tall hat', 'a walking stick']
    },
    lowell: {
      name: 'LORD LOWELL', short: 'Lord Lowell', color: '#14532d',
      sentences: ['I am Lord Lowell.', "I am Hamish's father.", 'I have a long green coat.'],
      words: [['coat', '🧥'], ['hat', '🎩'], ['father', '👨'], ['money', '💰'], ['garden', '🌷'], ['watch', '⌚']],
      askMe: [['Do you have a son?', 'Yes, I do. Hamish.'], ['Are you busy?', 'Yes, I am.']],
      props: ['a tall hat', 'a green coat']
    },
    dum: {
      name: 'TWEEDLEDUM', short: 'Tweedledum', color: '#4d7c0f',
      sentences: ['I am Tweedledum.', 'I have a green hat.', 'I like to say the same thing!'],
      words: [['hat', '🎩'], ['bell', '🔔'], ['button', '🔘'], ['twin', '👯'], ['friend', '🤝'], ['same', '➕']],
      askMe: [['Are you a twin?', 'Yes, I am.'], ['Do you like your hat?', 'Yes, it is green!']],
      props: ['a green hat', 'a button']
    },
    dee: {
      name: 'TWEEDLEDEE', short: 'Tweedledee', color: '#a16207',
      sentences: ['I am Tweedledee.', 'I have a small bell.', "I always say 'No!'"],
      words: [['hat', '🎩'], ['bell', '🔔'], ['button', '🔘'], ['twin', '👯'], ['friend', '🤝'], ['same', '➕']],
      askMe: [['Are you a twin?', 'Yes, I am.'], ['Do you have a bell?', 'Yes, I do. Ding!']],
      props: ['a green hat', 'a small bell']
    },
    dormouse1: {
      name: 'DORMOUSE', short: 'the Dormouse', color: '#78350f',
      sentences: ['I am the Dormouse.', 'I have small, round ears.', 'I watch and I listen.'],
      words: [['mouse', '🐭'], ['ears', '👂'], ['cup', '☕'], ['bed', '🛏️'], ['night', '🌙'], ['cheese', '🧀']],
      askMe: [['Are you awake?', 'Yes, I am!'], ['Do you like cheese?', 'Yes, I do.']],
      props: ['mouse ears', 'a small cup']
    },
    dormouse2: {
      name: 'SLEEPY DORMOUSE', short: 'the Sleepy Dormouse', color: '#6d28d9',
      sentences: ['I am the Sleepy Dormouse.', 'I have a tiny cup.', 'I sleep at tea time.'],
      words: [['mouse', '🐭'], ['sleep', '😴'], ['cup', '☕'], ['bed', '🛏️'], ['night', '🌙'], ['cake', '🍰']],
      askMe: [['Are you tired?', 'Yes, I am. Zzz.'], ['Do you like cake?', 'Yes, I do!']],
      props: ['mouse ears', 'a tiny cup']
    },
    oyster: {
      name: 'LITTLE OYSTER', short: 'the Little Oyster', color: '#a855f7',
      sentences: ['I am the Little Oyster.', 'I have a shiny pearl.', 'I live in the sea.'],
      words: [['shell', '🐚'], ['pearl', '⚪'], ['sea', '🌊'], ['fish', '🐟'], ['sand', '🏖️'], ['shine', '✨']],
      askMe: [['Do you like the sea?', 'Yes, I do!'], ['What do you have?', 'I have a shiny pearl.']],
      props: ['a paper shell', 'a pearl']
    }
  },

  /* 1-minute conversations (~10 short lines). who = role key. */
  dialogues: {
    'hatter-alice': [
      ['hatter', 'Hello! I am the Mad Hatter. What is your name?'],
      ['alice',  'Hello! My name is Alice. I am ten.'],
      ['hatter', 'Nice to meet you, Alice. Do you like tea?'],
      ['alice',  "Yes, I do, but I don't like cold tea."],
      ['hatter', 'Look! I have a big blue hat. Do you like it?'],
      ['alice',  'Yes, I do. It is very funny!'],
      ['hatter', 'Can you sit here? We have tea and cake.'],
      ['alice',  'Yes, I can. I like cake too!'],
      ['hatter', 'Here is your cup. Have some tea!'],
      ['alice',  'Thank you, Hatter. This is a nice tea party!']
    ],
    'rabbit-whitequeen': [
      ['rabbit',     'Oh no! I am late! Good afternoon, Your Majesty.'],
      ['whitequeen', 'Hello, Rabbit. Why are you so fast today?'],
      ['rabbit',     'I have a letter for you. It is from the Red Queen.'],
      ['whitequeen', 'Thank you. Can you read it to me?'],
      ['rabbit',     'Yes, I can. It says: Come to tea at four.'],
      ['whitequeen', 'What time is it now, Rabbit?'],
      ['rabbit',     'Look at my watch. It is ten to four!'],
      ['whitequeen', 'Oh dear! We can go now. I have my crown.'],
      ['rabbit',     "Come on! I don't want to be late!"],
      ['whitequeen', "Don't worry. Let's go to the party!"]
    ],
    'hare-cheshire': [
      ['hare',     'Hello, Cat! Do you want some tea?'],
      ['cheshire', "Yes, please. But I don't want cold tea!"],
      ['hare',     'This tea is hot. I have a big teapot.'],
      ['cheshire', 'I like your long ears. Can you jump?'],
      ['hare',     'Yes, I can! Watch me jump! One, two, three!'],
      ['cheshire', 'Wow! You are very good. I can disappear. Look!'],
      ['hare',     'Where are you, Cat? I can only see your smile!'],
      ['cheshire', 'Here I am again! Do you like my smile?'],
      ['hare',     'Yes, I do. It is big and funny!'],
      ['cheshire', "Thank you! Let's drink tea together."]
    ],
    'cat-dog': [
      ['bayard', 'Woof! Hello, Cat. I am Bayard. What is your name?'],
      ['cat',    'Hello, Bayard. I am a black cat. Do you like cats?'],
      ['bayard', 'Yes, I do, but cats run away! Can you run?'],
      ['cat',    'Yes, I can. I can run and climb. Can you climb?'],
      ['bayard', "No, I can't. But I have a very good nose."],
      ['cat',    'What can you smell?'],
      ['bayard', 'I can smell fish and milk. Do you have any?'],
      ['cat',    'I have some milk. Do you want it?'],
      ['bayard', 'Yes, please! Thank you, Cat!'],
      ['cat',    "You're welcome. Let's be friends!"]
    ],
    'redqueen-dragon': [
      ['redqueen', 'Stop! Who is there? I am the Red Queen!'],
      ['dragon',   'I am the Jabberwocky. I have two big wings.'],
      ['redqueen', 'Can you fly? I want to see it!'],
      ['dragon',   'Yes, I can. Look at me! I can fly very high!'],
      ['redqueen', 'Good. Can you breathe fire too?'],
      ['dragon',   "Yes, I can. But I don't want to burn your garden."],
      ['redqueen', 'Please be careful! I love my red roses.'],
      ['dragon',   'Do not worry, Queen. I like flowers too.'],
      ['redqueen', 'Then you can stay at my tea party.'],
      ['dragon',   'Thank you! I am hungry. Do you have any cake?']
    ],
    'wq2-bandersnatch': [
      ['bandersnatch', 'Grr! I am the Bandersnatch. Who are you?'],
      ['whitequeen',   "I am the White Queen. Don't be afraid, please."],
      ['bandersnatch', 'I have long claws and I run very fast.'],
      ['whitequeen',   'I can see that. Are you angry today?'],
      ['bandersnatch', 'No, I am not. I am hungry. Do you have food?'],
      ['whitequeen',   'Yes, I have some small cakes. Do you like cake?'],
      ['bandersnatch', 'Yes, I do! I like sweet things.'],
      ['whitequeen',   'Here you are. Have two cakes!'],
      ['bandersnatch', 'Thank you, Queen. You are very kind.'],
      ['whitequeen',   'You are welcome. Now we are friends.']
    ],
    'sister-mother': [
      ['mother', 'Good morning, dear. Are you ready for the party?'],
      ['sister', 'Yes, Mother. I have my new dress. Do you like it?'],
      ['mother', 'It is beautiful! Where is Alice?'],
      ['sister', "I don't know. She is not in the garden."],
      ['mother', 'Can you find her, please? The guests are here.'],
      ['sister', 'Yes, I can. I think she is under the tree.'],
      ['mother', 'Good. Tell her to come now.'],
      ['sister', 'OK, Mother. Alice! Come to the party!'],
      ['mother', 'Thank you. You are a good sister.'],
      ['sister', "You're welcome. I like parties too!"]
    ],
    'twosisters': [
      ['twosister1', 'Hello! I am Sister One. I have a gold button.'],
      ['twosister2', 'Hello! I am Sister Two. I have a small bell.'],
      ['twosister1', 'Contrariwise! My button is bigger than your bell!'],
      ['twosister2', 'Nohow! My bell is better. Listen! Ding, ding!'],
      ['twosister1', 'Your bell is loud, but my button is pretty.'],
      ['twosister2', 'Yes, it is. I like your button. Can I see it?'],
      ['twosister1', 'Yes, you can. Here you are.'],
      ['twosister2', 'Thank you. It is very shiny.'],
      ['twosister1', 'Now can I ring your bell?'],
      ['twosister2', 'Yes! Ring it three times. Ding, ding, ding!']
    ],
    'absolem-hamish': [
      ['absolem', 'Who are you? Sit down, young man.'],
      ['hamish',  'Good afternoon. I am Lord Hamish Ascot.'],
      ['absolem', 'Lord? Hmm. Do you have a nice hat?'],
      ['hamish',  'Yes, I do. It is tall and black.'],
      ['absolem', 'I am Absolem. I am a blue caterpillar.'],
      ['hamish',  'Nice to meet you. I am looking for Alice. Do you know her?'],
      ['absolem', 'Yes, I do. She is very small today.'],
      ['hamish',  'Small? Is she in the garden?'],
      ['absolem', 'No. She is behind the big mushroom.'],
      ['hamish',  'Thank you, Absolem. Goodbye!']
    ],
    'hamish-lowell': [
      ['lowell', 'Good afternoon, Hamish. Where is Alice?'],
      ['hamish', "I don't know, Father. I am looking for her."],
      ['lowell', 'Is she at the party?'],
      ['hamish', "No, she isn't. I can see tea and cake, but no Alice."],
      ['lowell', 'Have some tea. You look tired.'],
      ['hamish', 'Thank you. I have a very long day today.'],
      ['lowell', 'Do you want some cake too?'],
      ['hamish', 'Yes, please. I am very hungry.'],
      ['lowell', 'Here you are. We can look for Alice later.'],
      ['hamish', 'Good idea, Father. Thank you!']
    ],
    'tweedles': [
      ['dum', 'Hello! I am Tweedledum. I have a green hat.'],
      ['dee', 'Hello! I am Tweedledee. I have a green hat too!'],
      ['dum', 'Contrariwise! My hat is bigger.'],
      ['dee', 'Nohow! My hat is bigger. Look!'],
      ['dum', 'Hmm, they are the same. We are twins!'],
      ['dee', 'Yes, we are. Do you like your hat?'],
      ['dum', 'Yes, I do. I like it very much. Do you?'],
      ['dee', 'Yes, I do. I always wear it.'],
      ['dum', "Let's go to the tea party!"],
      ['dee', 'Good idea! Come on!']
    ],
    'dormice': [
      ['dormouse1', 'Wake up! It is tea time!'],
      ['dormouse2', 'Oh... I am sleepy. What time is it?'],
      ['dormouse1', 'It is four o\'clock. Look at the clock.'],
      ['dormouse2', 'Is there any tea? I want a big cup.'],
      ['dormouse1', 'Yes, there is. And there are small cakes.'],
      ['dormouse2', 'I love cakes! Can I have two?'],
      ['dormouse1', "Yes, you can. But don't sleep on the table!"],
      ['dormouse2', 'OK, I am awake now. Thank you!'],
      ['dormouse1', "You are welcome. Let's drink tea together."],
      ['dormouse2', 'Good idea. Then I can sleep again. Zzz...']
    ],
    /* Class 4A has an odd number of pupils, so the tea party is a trio. Every original Hatter and Alice line is kept word for word. */
    'hatter-alice-oyster': [
      ['hatter', 'Hello! I am the Mad Hatter. What is your name?'],
      ['alice',  'Hello! My name is Alice. I am ten.'],
      ['oyster', 'Hello! I am the Little Oyster. I have a shiny pearl.'],
      ['hatter', 'Nice to meet you, Alice. Do you like tea?'],
      ['alice',  "Yes, I do, but I don't like cold tea."],
      ['oyster', 'I live in the sea, but I like tea too!'],
      ['hatter', 'Look! I have a big blue hat. Do you like it?'],
      ['alice',  'Yes, I do. It is very funny!'],
      ['hatter', 'Can you sit here? We have tea and cake.'],
      ['alice',  'Yes, I can. I like cake too!'],
      ['oyster', 'Can I have some cake, please?'],
      ['hatter', 'Here is your cup. Have some tea!'],
      ['alice',  'Thank you, Hatter. This is a nice tea party!'],
      ['oyster', 'Thank you! Look at my pearl. It is a gift for the party!']
    ],
    'rq-trio': [
      ['redqueen',     'Stop! Who is making this noise?'],
      ['dragon',       'It is me! I am the Jabberwocky. I have big wings.'],
      ['bandersnatch', 'And I am the Bandersnatch. I have long claws.'],
      ['redqueen',     "I am the Red Queen. I don't like noise!"],
      ['dragon',       'Sorry, Queen. Can we have some tea?'],
      ['redqueen',     'Yes, you can. But please be quiet.'],
      ['bandersnatch', 'We can be quiet. Can I have some cake too?'],
      ['redqueen',     'Yes, you can. Here is a big red cake.'],
      ['dragon',       'Thank you! I can breathe fire for the candles!'],
      ['redqueen',     'No fire, please! I love my red roses.'],
      ['bandersnatch', 'Do not worry, Queen. We are friends now.']
    ]
  },

  /* Students: id, first name, role, dialogue, photo (file in assets/) */
  classes: {
    '4a': {
      label: 'Class 4A',
      students: [
        { id: '4a-ipek',    name: 'İpek',     role: 'alice',        pair: 'hatter-alice-oyster', photo: 'alice.jpg' },
        { id: '4a-kemal',   name: 'Kemal',    role: 'hatter',       pair: 'hatter-alice-oyster', photo: 'mad-hatter.jpg' },
        { id: '4a-suhan',   name: 'Sühan',    role: 'oyster',       pair: 'hatter-alice-oyster', photo: 'little-oyster.jpg' },
        { id: '4a-bahriye', name: 'Bahriye',  role: 'rabbit',       pair: 'rabbit-whitequeen', photo: 'white-rabbit.jpg' },
        { id: '4a-iclal',   name: 'İclal',    role: 'whitequeen',   pair: 'rabbit-whitequeen', photo: 'white-queen.jpg' },
        { id: '4a-ahmet',   name: 'Ahmet',    role: 'hare',         pair: 'hare-cheshire',     photo: 'march-hare.jpg' },
        { id: '4a-alya',    name: 'Alya',     role: 'cheshire',     pair: 'hare-cheshire',     photo: 'cheshire-cat.jpg' },
        { id: '4a-emirali', name: 'Emir Ali', role: 'cat',          pair: 'cat-dog',           photo: 'cat-shadow-emir-ali.jpg' },
        { id: '4a-efe',     name: 'Efe',      role: 'bayard',       pair: 'cat-dog',           photo: 'bayard.jpg' },
        { id: '4a-derin',   name: 'Derin',    role: 'redqueen',     pair: 'redqueen-dragon',   photo: 'red-queen.jpg' },
        { id: '4a-emirb',   name: 'Emir B.',  role: 'dragon',       pair: 'redqueen-dragon',   photo: 'jabberwocky.jpg' },
        { id: '4a-simal',   name: 'Şimal',    role: 'whitequeen',   pair: 'wq2-bandersnatch',  photo: 'white-queen.jpg' },
        { id: '4a-ruzgar',  name: 'Rüzgar',   role: 'bandersnatch', pair: 'wq2-bandersnatch',  photo: 'bandersnatch-ruzgar.jpg' },
        { id: '4a-belis',   name: 'Belis',    role: 'sister',       pair: 'sister-mother',     photo: 'margaret.jpg' },
        { id: '4a-ada',     name: 'Ada',      role: 'mother',       pair: 'sister-mother',     photo: 'helen.jpg' },
        { id: '4a-defne',   name: 'Defne',    role: 'twosister1',   pair: 'twosisters',        photo: 'two-sisters-defne.jpg' },
        { id: '4a-esila',   name: 'Esila',    role: 'twosister2',   pair: 'twosisters',        photo: 'two-sisters-esila.jpg' },
        { id: '4a-elif',    name: 'Elif',     role: 'absolem',      pair: 'absolem-hamish',    photo: 'absolem.jpg' },
        { id: '4a-emire',   name: 'Emir E.',  role: 'hamish',       pair: 'absolem-hamish',    photo: 'hamish.jpg' }
      ]
    },
    '4b': {
      label: 'Class 4B',
      students: [
        { id: '4b-derin',    name: 'Derin',      role: 'alice',        pair: 'hatter-alice',      photo: 'alice.jpg' },
        { id: '4b-ozanm',    name: 'Ozan M.',    role: 'hatter',       pair: 'hatter-alice',      photo: 'mad-hatter.jpg' },
        { id: '4b-mina',     name: 'Mina',       role: 'rabbit',       pair: 'rabbit-whitequeen', photo: 'white-rabbit.jpg' },
        { id: '4b-ilay',     name: 'İlay',       role: 'whitequeen',   pair: 'rabbit-whitequeen', photo: 'white-queen.jpg' },
        { id: '4b-kerem',    name: 'Kerem',      role: 'hare',         pair: 'hare-cheshire',     photo: 'march-hare.jpg' },
        { id: '4b-elifberen',name: 'Elif Beren', role: 'cheshire',     pair: 'hare-cheshire',     photo: 'cheshire-cat.jpg' },
        { id: '4b-nilda',    name: 'Nilda',      role: 'cat',          pair: 'cat-dog',           photo: 'dinah.jpg' },
        { id: '4b-ozan',     name: 'Ozan T.',    role: 'bayard',       pair: 'cat-dog',           photo: 'bayard.jpg' },
        { id: '4b-oyku',     name: 'Öykü',       role: 'redqueen',     pair: 'rq-trio',           photo: 'red-queen.jpg' },
        { id: '4b-ali',      name: 'Ali',        role: 'dragon',       pair: 'rq-trio',           photo: 'jabberwocky.jpg' },
        { id: '4b-lina',     name: 'Lina',       role: 'bandersnatch', pair: 'rq-trio',           photo: 'bandersnatch.jpg' },
        { id: '4b-elif',     name: 'Elif A.',    role: 'sister',       pair: 'sister-mother',     photo: 'margaret.jpg' },
        { id: '4b-elisa',    name: 'Elisa',      role: 'mother',       pair: 'sister-mother',     photo: 'helen.jpg' },
        { id: '4b-egehan',   name: 'Egehan',     role: 'dum',          pair: 'tweedles',          photo: 'tweedledum.jpg' },
        { id: '4b-uras',     name: 'Uras',       role: 'dee',          pair: 'tweedles',          photo: 'tweedledee.jpg' },
        { id: '4b-utku',     name: 'Utku',       role: 'hamish',       pair: 'hamish-lowell',     photo: 'hamish.jpg' },
        { id: '4b-ertugrul', name: 'Ertuğrul',   role: 'lowell',       pair: 'hamish-lowell',     photo: 'lowell.jpg' },
        { id: '4b-yagmur',   name: 'Yağmur',     role: 'dormouse1',    pair: 'dormice',           photo: 'dormouse-yagmur.jpg' },
        { id: '4b-nisa',     name: 'Nisa',       role: 'dormouse2',    pair: 'dormice',           photo: 'dormouse-nisa.jpg' }
      ]
    }
  }
};

/* Helpers shared by the app and the printable cards */
window.PARTY.find = function (id) {
  var P = window.PARTY;
  for (var k in P.classes) {
    var list = P.classes[k].students;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return Object.assign({ classKey: k, classLabel: P.classes[k].label }, list[i], { role: P.roles[list[i].role], roleKey: list[i].role });
    }
  }
  return null;
};
window.PARTY.partners = function (st) {
  var list = window.PARTY.classes[st.classKey].students;
  return list.filter(function (o) { return o.pair === st.pair && o.id !== st.id; });
};
