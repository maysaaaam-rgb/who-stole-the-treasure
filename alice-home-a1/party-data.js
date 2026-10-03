/* Tea Party home-practice data (A1+). One entry per character; pages are generated from this file.
   To add a character: add an object under `characters` and add their lines to `dialogue`. */
window.PARTY = {
  // The 1-minute pair conversation (4 exchanges). `who` = character id.
  dialogues: {
    'hatter-alice': [
      { who: 'hatter', text: 'Hello! I am the Hatter. What is your name?' },
      { who: 'alice',  text: 'Hello! I am Alice.' },
      { who: 'hatter', text: 'Do you like tea?' },
      { who: 'alice',  text: 'Yes, I do. I like tea.' },
      { who: 'hatter', text: 'I have a big hat. Do you like my hat?' },
      { who: 'alice',  text: 'Yes! It is a funny hat.' },
      { who: 'hatter', text: 'Sit down, Alice. Have some tea!' },
      { who: 'alice',  text: 'Thank you, Hatter!' }
    ]
  },
  characters: {
    alice: {
      id: 'alice', name: 'ALICE', short: 'Alice', color: '#2563eb',
      image: 'assets/alice.jpg',
      pair: 'hatter-alice', partner: 'hatter',
      sentences: ['I am Alice.', 'I have a key.', 'I like tea.'],
      words: [
        { w: 'key', p: '🔑' }, { w: 'teacup', p: '☕' }, { w: 'dress', p: '👗' },
        { w: 'bow', p: '🎀' }, { w: 'clock', p: '🕐' }, { w: 'door', p: '🚪' }
      ],
      askMe: [['Do you like tea?', 'Yes, I do.'], ['Do you have a key?', 'Yes, I do.']],
      props: ['a paper key', 'a teacup']
    },
    hatter: {
      id: 'hatter', name: 'MAD HATTER', short: 'the Hatter', color: '#7c3aed',
      image: 'assets/hatter.jpg',
      pair: 'hatter-alice', partner: 'alice',
      sentences: ['I am the Hatter.', 'I have a big hat.', 'I like tea.'],
      words: [
        { w: 'hat', p: '🎩' }, { w: 'teapot', p: '🫖' }, { w: 'tea', p: '🍵' },
        { w: 'cake', p: '🍰' }, { w: 'clock', p: '🕐' }, { w: 'cup', p: '☕' }
      ],
      askMe: [['Do you like my hat?', 'Yes, I do!'], ['Do you have a teapot?', 'Yes, I do.']],
      props: ['a big paper hat', 'a teapot']
    }
  }
};
