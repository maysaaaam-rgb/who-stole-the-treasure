/* Week Song: everything EXCEPT the lyrics. The lyrics are copyrighted, so the teacher pastes them once on the classroom computer
   and they are kept only in that browser (localStorage). Nothing about the song's words is stored in this project. */
window.SongData = (function () {
  var D = {};
  D.defaultVideo = { id: 'FiXCxfWWwPo', title: 'Dance Monkey (KIDZ BOP Kids)' };
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];
  /* Action words: when a word below appears in the lyrics, the class gets an action for it (generic classroom vocabulary). */
  D.actions = {
    dance: ['💃', 'Dance!'], dancing: ['💃', 'Dance!'], dancin: ['💃', 'Dance!'], danced: ['💃', 'Dance!'],
    move: ['🕺', 'Move your body!'], moving: ['🕺', 'Move your body!'],
    monkey: ['🐒', 'Be a monkey: arms swing!'], hands: ['🙌', 'Hands up!'], hand: ['🙌', 'Hands up!'],
    eyes: ['👀', 'Point to your eyes!'], look: ['👀', 'Look at your partner!'], see: ['🤩', 'Shade your eyes and look far!'],
    walk: ['🚶', 'Walk on the spot!'], walking: ['🚶', 'Walk on the spot!'], shine: ['✨', 'Twinkle your fingers!'],
    style: ['😎', 'Strike a cool pose!'], stop: ['✋', 'Freeze!'], stopped: ['✋', 'Freeze!'],
    cry: ['😢', 'Rub your eyes: boo-hoo!'], time: ['⏰', 'Tap your wrist!'], again: ['🔁', 'Spin around once!'],
    beg: ['🙏', 'Hands together: please!'], gosh: ['😮', 'Hands on your cheeks: surprised!'], place: ['👐', 'Hold out both hands.'],
    like: ['👍', 'Thumbs up!'], one: ['☝️', 'One finger up!'], life: ['❤️', 'Hands on your heart.'], eyes2: ['👀', '']
  };
  D.goals = ['I can say the lines of the chorus.', 'I can do the actions for the song.', 'I can sing the chorus with my team.'];
  return D;
})();
