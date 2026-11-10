/* School Subjects Group Challenge — Curriculum Data (Maths, Art, Science, Music) */
(function (root) {
  'use strict';

  root.SubjectsData = {
    groups: [
      {
        id: 'maths',
        groupNum: 1,
        groupTitle: 'Group 1 · Mystery Challenge A',
        subject: 'Maths',
        emoji: '🔢',
        art: 'art/subj_maths.webp',
        color: 'cyan',
        taskTitle: 'Number Order & Sum Puzzle',
        taskPrompt: 'Order the numbers from smallest to biggest, then solve the secret sum!',
        taskClip: 's_maths_task',
        wordClip: 's_word_maths',
        sentence: "We solved a problem. It's Maths!",
        sentenceHtml: "We <mark>solved a problem</mark>. It's <mark>Maths</mark>!",
        sentenceClip: 's_sent_maths',
        altSentence: "We ordered the numbers. It's Maths!",
        altClip: 's_sent_maths_2',
        clueSummary: 'This group ordered numbers (5, 9, 12, 18, 24) and solved addition & multiplication problems!',
        numbersRounds: [
          { target: [5, 9, 12, 18, 24], sumQ: '14 + 6 = ?', sumOpts: [18, 20, 24], sumAns: 20 },
          { target: [7, 15, 21, 30, 42], sumQ: '6 × 4 = ?', sumOpts: [20, 24, 28], sumAns: 24 }
        ]
      },
      {
        id: 'art',
        groupNum: 2,
        groupTitle: 'Group 2 · Mystery Challenge B',
        subject: 'Art',
        emoji: '🎨',
        art: 'art/subj_art.webp',
        color: 'amber',
        taskTitle: 'Geometric Shapes Picture Studio',
        taskPrompt: 'Tap each geometric shape (triangle, square, circle, rectangle) to assemble the picture!',
        taskClip: 's_art_task',
        wordClip: 's_word_art',
        sentence: "We made a picture. It's Art!",
        sentenceHtml: "We <mark>made a picture</mark>. It's <mark>Art</mark>!",
        sentenceClip: 's_sent_art',
        altSentence: "We used shapes to make a house. It's Art!",
        altClip: 's_sent_art_2',
        clueSummary: 'This group combined geometric shapes (triangles, squares, rectangles, circles) to build a colourful picture!',
        shapes: [
          { id: 'wall', label: '🟦 Blue Square (House Wall)', svg: '<rect x="85" y="95" width="110" height="95" rx="8" fill="#38bdf8" stroke="#fff" stroke-width="4"/>' },
          { id: 'roof', label: '🔺 Red Triangle (Roof)', svg: '<polygon points="70,95 140,30 210,95" fill="#f43f5e" stroke="#fff" stroke-width="4"/>' },
          { id: 'door', label: '🟫 Amber Rectangle (Door)', svg: '<rect x="122" y="132" width="36" height="58" rx="5" fill="#f59e0b" stroke="#fff" stroke-width="3"/>' },
          { id: 'sun',  label: '🟡 Yellow Circle (Bright Sun)', svg: '<circle cx="235" cy="52" r="26" fill="#fde047" stroke="#f59e0b" stroke-width="4"/>' },
          { id: 'tree', label: '🌲 Green Triangle (Garden Tree)', svg: '<rect x="34" y="150" width="14" height="40" fill="#92400e"/><polygon points="15,155 41,95 67,155" fill="#10b981" stroke="#fff" stroke-width="3"/>' }
        ]
      },
      {
        id: 'science',
        groupNum: 3,
        groupTitle: 'Group 3 · Mystery Challenge C',
        subject: 'Science',
        emoji: '🔬',
        art: 'art/subj_science.webp',
        color: 'emerald',
        taskTitle: 'Float or Sink Water Lab',
        taskPrompt: 'Drop each object into the water tank! Test which objects FLOAT on top and which ones SINK!',
        taskClip: 's_science_task',
        wordClip: 's_word_science',
        sentence: "We tested float and sink. It's Science!",
        sentenceHtml: "We <mark>tested float and sink</mark>. It's <mark>Science</mark>!",
        sentenceClip: 's_sent_science',
        altSentence: "The boat floats and the stone sinks. It's Science!",
        altClip: 's_sent_science',
        clueSummary: 'This group tested 6 objects in water to discover which ones float on top and which ones sink to the bottom!',
        items: [
          { id: 'boat',  name: '⛵ Wooden Boat', img: '../island/art/flat/o_boat.webp',    floats: true,  clip: 's_float_boat' },
          { id: 'key',   name: '🔑 Metal Key',   img: '../island/art/flat/o_compass.webp', floats: false, clip: 's_sink_key' },
          { id: 'duck',  name: '🦆 Rubber Duck', img: '../island/art/flat/o_duck.webp',    floats: true,  clip: 's_float_duck' },
          { id: 'stone', name: '🪨 Heavy Stone', img: '../island/art/flat/o_rock.webp',    floats: false, clip: 's_sink_stone' },
          { id: 'ball',  name: '🟠 Plastic Ball',img: '../island/art/flat/o_ball.webp',    floats: true,  clip: 's_float_ball' },
          { id: 'coin',  name: '🪙 Gold Coin',   img: '../island/art/flat/u_coin.webp',    floats: false, clip: 's_sink_coin' }
        ]
      },
      {
        id: 'music',
        groupNum: 4,
        groupTitle: 'Group 4 · Mystery Challenge D',
        subject: 'Music',
        emoji: '🥁',
        art: 'art/subj_music.webp',
        color: 'violet',
        taskTitle: 'Rhythm Clap & Beat Studio',
        taskPrompt: 'Listen to the 4-beat rhythm pattern, then clap and tap the exact same rhythm back!',
        taskClip: 's_music_task',
        wordClip: 's_word_music',
        sentence: "We clapped a rhythm. It's Music!",
        sentenceHtml: "We <mark>clapped a rhythm</mark>. It's <mark>Music</mark>!",
        sentenceClip: 's_sent_music',
        altSentence: "We played the drum beat. It's Music!",
        altClip: 's_sent_music',
        clueSummary: 'This group listened to a musical beat pattern and copied the rhythm by clapping and tapping together!',
        patterns: [
          { name: 'Pattern 1: Clap · Clap · Drum · Clap', seq: ['clap', 'clap', 'drum', 'clap'] },
          { name: 'Pattern 2: Drum · Clap · Drum · Clap', seq: ['drum', 'clap', 'drum', 'clap'] }
        ]
      }
    ],
    sentenceQuiz: [
      { q: "We solved a problem. It's ___!", opts: ['Maths', 'Art', 'Science', 'Music'], ans: 'Maths', clip: 's_sent_maths' },
      { q: "We made a picture. It's ___!", opts: ['Maths', 'Art', 'Science', 'Music'], ans: 'Art', clip: 's_sent_art' },
      { q: "We tested float and sink. It's ___!", opts: ['Maths', 'Art', 'Science', 'Music'], ans: 'Science', clip: 's_sent_science' },
      { q: "We clapped a rhythm. It's ___!", opts: ['Maths', 'Art', 'Science', 'Music'], ans: 'Music', clip: 's_sent_music' }
    ]
  };
})(typeof window !== 'undefined' ? window : this);
