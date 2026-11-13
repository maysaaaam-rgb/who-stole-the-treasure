/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 2 ⭐ Star Mode (Word Order + Say It Aloud)
   (island/js/chapter2/star-clues.js -> `window.Chapter2`)
   - Powers ⭐ Star Mode for all 5 stops of Chapter 2 (Grades 3 & 4)
   - Reuses `Chapter1Games.wordOrder` (scrambled tactile word tiles +
     optional Web Speech API microphone speaking boost + zero-penalty hints)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var P = function () { return root.Ch2Progress; };
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };

  var STAR_CONTENT = {
    3: [
      {
        stopNum: 1,
        title: '⭐ Star Clue 1: Chuseok Harvest Feast',
        tasks: [
          {
            promptImg: 'art/ch2/o_songpyeon.webp',
            promptText: 'Order the Chuseok festival sentence and speak it aloud:',
            speakText: 'Families make sweet songpyeon at the harvest festival.',
            targetSentence: 'Families make sweet songpyeon at the harvest festival.',
            words: ['Families', 'make', 'sweet', 'songpyeon', 'at', 'the', 'harvest', 'festival.'],
            distractors: ['messy'],
            allowSpeak: true,
            hint: 'Start with "Families make sweet songpyeon", then "at the harvest festival."'
          },
          {
            promptImg: 'art/z2/s_thankful_family.webp',
            promptText: 'Build the sentence about ancestors and say it aloud:',
            speakText: 'We share a delicious feast and thank our ancestors.',
            targetSentence: 'We share a delicious feast and thank our ancestors.',
            words: ['We', 'share', 'a', 'delicious', 'feast', 'and', 'thank', 'our', 'ancestors.'],
            distractors: ['clock'],
            allowSpeak: true,
            hint: 'Start with "We share a delicious feast", then "and thank our ancestors."'
          }
        ]
      },
      {
        stopNum: 2,
        title: '⭐ Star Clue 2: Moonlight Loom & Gratitude',
        tasks: [
          {
            promptImg: 'art/ch2/o_loom.webp',
            promptText: 'Order the weaving contest sentence under the full moon:',
            speakText: 'Teams weave warm cloth under the full moon.',
            targetSentence: 'Teams weave warm cloth under the full moon.',
            words: ['Teams', 'weave', 'warm', 'cloth', 'under', 'the', 'full', 'moon.'],
            distractors: ['broom'],
            allowSpeak: true,
            hint: 'Put in order: "Teams weave warm cloth under the full moon."'
          },
          {
            promptImg: 'art/z2/w_thankful.webp',
            promptText: 'Build and speak your gratitude sentence:',
            speakText: 'I am thankful for my family and friends.',
            targetSentence: 'I am thankful for my family and friends.',
            words: ['I', 'am', 'thankful', 'for', 'my', 'family', 'and', 'friends.'],
            distractors: ['are'],
            allowSpeak: true,
            hint: 'Start with "I am thankful for", then "my family and friends."'
          }
        ]
      },
      {
        stopNum: 3,
        title: '⭐ Star Clue 3: Mars First Harvest',
        tasks: [
          {
            promptImg: 'art/z2/w_potatoes.webp',
            promptText: 'Order the plural "There are" sentence and say it aloud:',
            speakText: 'There are fresh potatoes in the greenhouse soil.',
            targetSentence: 'There are fresh potatoes in the greenhouse soil.',
            words: ['There', 'are', 'fresh', 'potatoes', 'in', 'the', 'greenhouse', 'soil.'],
            distractors: ['is'],
            allowSpeak: true,
            hint: 'Plural crops use "There are": "There are fresh potatoes in the greenhouse soil."'
          },
          {
            promptImg: 'art/z2/w_pineapple.webp',
            promptText: 'Order the singular "There is" sentence and speak it:',
            speakText: 'There is one sweet golden pineapple.',
            targetSentence: 'There is one sweet golden pineapple.',
            words: ['There', 'is', 'one', 'sweet', 'golden', 'pineapple.'],
            distractors: ['are'],
            allowSpeak: true,
            hint: 'One fruit uses "There is": "There is one sweet golden pineapple."'
          }
        ]
      },
      {
        stopNum: 4,
        title: '⭐ Star Clue 4: -st Blend & Because',
        tasks: [
          {
            promptImg: 'art/flat/subj_trophy.webp',
            promptText: 'Order the -ST phonics sentence and read it clearly:',
            speakText: 'The first weaving contest was the best!',
            targetSentence: 'The first weaving contest was the best!',
            words: ['The', 'first', 'weaving', 'contest', 'was', 'the', 'best!'],
            distractors: ['mirror'],
            allowSpeak: true,
            hint: 'Three -st words! "The first weaving contest was the best!"'
          },
          {
            promptImg: 'art/z2/s_thankful_food.webp',
            promptText: 'Answer Why with Because and speak it aloud:',
            speakText: 'We celebrate because we are thankful for food.',
            targetSentence: 'We celebrate because we are thankful for food.',
            words: ['We', 'celebrate', 'because', 'we', 'are', 'thankful', 'for', 'food.'],
            distractors: ['where'],
            allowSpeak: true,
            hint: 'Put in order: "We celebrate because we are thankful for food."'
          }
        ]
      },
      {
        stopNum: 5,
        title: '⭐ Star Clue 5: Lighthouse Harvest Finale',
        tasks: [
          {
            promptImg: 'art/z2/o_lighthouse_on.webp',
            promptText: 'Light the Spyglass Beacon! Order and speak the finale sentence:',
            speakText: 'First we pick the harvest, then we share a feast!',
            targetSentence: 'First we pick the harvest, then we share a feast!',
            words: ['First', 'we', 'pick', 'the', 'harvest,', 'then', 'we', 'share', 'a', 'feast!'],
            distractors: ['messy'],
            allowSpeak: true,
            hint: 'Start with "First we pick the harvest,", then "then we share a feast!"'
          }
        ]
      }
    ],

    4: [
      {
        stopNum: 1,
        title: '⭐ Star Clue 1: Deciduous & Coniferous Biomes',
        tasks: [
          {
            promptImg: 'art/z2/s_go_outside.webp',
            promptText: 'Order the deciduous forest fact and say it aloud:',
            speakText: 'Deciduous trees drop their wide leaves in autumn.',
            targetSentence: 'Deciduous trees drop their wide leaves in autumn.',
            words: ['Deciduous', 'trees', 'drop', 'their', 'wide', 'leaves', 'in', 'autumn.'],
            distractors: ['cones'],
            allowSpeak: true,
            hint: 'Start with "Deciduous trees drop", then "their wide leaves in autumn."'
          },
          {
            promptImg: 'art/z2/s_pine_cones.webp',
            promptText: 'Order the coniferous forest fact and speak it clearly:',
            speakText: 'Coniferous evergreen trees have waxy needles and cones.',
            targetSentence: 'Coniferous evergreen trees have waxy needles and cones.',
            words: ['Coniferous', 'evergreen', 'trees', 'have', 'waxy', 'needles', 'and', 'cones.'],
            distractors: ['waistcoat'],
            allowSpeak: true,
            hint: 'Put in order: "Coniferous evergreen trees have waxy needles and cones."'
          }
        ]
      },
      {
        stopNum: 2,
        title: '⭐ Star Clue 2: Winter Adaptation ("so they can")',
        tasks: [
          {
            promptImg: 'art/z2/s_winter_fur.webp',
            promptText: 'Build the "so they can" sentence and speak it aloud:',
            speakText: 'Bears hibernate in winter so they can survive.',
            targetSentence: 'Bears hibernate in winter so they can survive.',
            words: ['Bears', 'hibernate', 'in', 'winter', 'so', 'they', 'can', 'survive.'],
            distractors: ['slingshot'],
            allowSpeak: true,
            hint: 'Start with "Bears hibernate in winter", then "so they can survive."'
          },
          {
            promptImg: 'art/z2/w_fur.webp',
            promptText: 'Order the second adaptation sentence and say it:',
            speakText: 'Foxes grow thick fur so they can stay warm.',
            targetSentence: 'Foxes grow thick fur so they can stay warm.',
            words: ['Foxes', 'grow', 'thick', 'fur', 'so', 'they', 'can', 'stay', 'warm.'],
            distractors: ['shelves'],
            allowSpeak: true,
            hint: 'Put in order: "Foxes grow thick fur so they can stay warm."'
          }
        ]
      },
      {
        stopNum: 3,
        title: '⭐ Star Clue 3: Go Ne & the Kind Swallow',
        tasks: [
          {
            promptImg: 'art/ch2/c_swallow.webp',
            promptText: 'Order the folktale sentence in past tense and say it:',
            speakText: 'A swallow built a nest under the cottage roof.',
            targetSentence: 'A swallow built a nest under the cottage roof.',
            words: ['A', 'swallow', 'built', 'a', 'nest', 'under', 'the', 'cottage', 'roof.'],
            distractors: ['builded'],
            allowSpeak: true,
            hint: 'Past tense of build is "built": "A swallow built a nest under the cottage roof."'
          },
          {
            promptImg: 'art/z2/w_vet.webp',
            promptText: 'Order how Go Ne helped the injured bird:',
            speakText: 'Kind Go Ne cared for the swallow like a vet.',
            targetSentence: 'Kind Go Ne cared for the swallow like a vet.',
            words: ['Kind', 'Go', 'Ne', 'cared', 'for', 'the', 'swallow', 'like', 'a', 'vet.'],
            distractors: ['slingshot'],
            allowSpeak: true,
            hint: 'Start with "Kind Go Ne cared", then "for the swallow like a vet."'
          }
        ]
      },
      {
        stopNum: 4,
        title: '⭐ Star Clue 4: "ai" Sails & Irregular Past',
        tasks: [
          {
            promptImg: 'art/z2/w_ocean_boat.webp',
            promptText: 'Order the "ai" phonics sentence and speak it aloud:',
            speakText: 'Our main ship sailed bravely through the rain.',
            targetSentence: 'Our main ship sailed bravely through the rain.',
            words: ['Our', 'main', 'ship', 'sailed', 'bravely', 'through', 'the', 'rain.'],
            distractors: ['falled'],
            allowSpeak: true,
            hint: 'Three ai words (main, sailed, rain)!'
          },
          {
            promptImg: 'art/z2/w_grew.webp',
            promptText: 'Order the irregular past tense sentence and say it:',
            speakText: 'The grateful swallow gave a seed that grew fast.',
            targetSentence: 'The grateful swallow gave a seed that grew fast.',
            words: ['The', 'grateful', 'swallow', 'gave', 'a', 'seed', 'that', 'grew', 'fast.'],
            distractors: ['gived'],
            allowSpeak: true,
            hint: 'Irregular past: "gave" and "grew"!'
          }
        ]
      },
      {
        stopNum: 5,
        title: '⭐ Star Clue 5: Lighthouse Biome & Folktale Finale',
        tasks: [
          {
            promptImg: 'art/z2/o_lighthouse_on.webp',
            promptText: 'Ignite the Spyglass Lighthouse! Order and speak the Unit 2 Big Idea:',
            speakText: 'Forest animals adapt so they can survive every season!',
            targetSentence: 'Forest animals adapt so they can survive every season!',
            words: ['Forest', 'animals', 'adapt', 'so', 'they', 'can', 'survive', 'every', 'season!'],
            distractors: ['slingshot'],
            allowSpeak: true,
            hint: 'Start with "Forest animals adapt", then "so they can survive every season!"'
          }
        ]
      }
    ]
  };

  function openClue(stopNum, mode, onDone) {
    var g = P() ? P().getActiveGrade() : 3;
    var n = Math.max(1, Math.min(5, Number(stopNum) || 1));
    if (mode !== 'star' && root.BayWorld && root.BayWorld.stops && root.BayWorld.stops[n]) {
      root.BayWorld.stops[n]({
        grade: g,
        stop: n,
        hero: root.BayWorld.heroSvg || function () { return ''; },
        done: onDone || function () {},
        say: function (t, cb) { if (A().speak) A().speak(t, {}, cb); else if (cb) cb(); }
      });
      return;
    }

    var clue = (STAR_CONTENT[g] || STAR_CONTENT[3])[n - 1];
    if (!clue || !root.Ch1Minigames || !root.Ch1Minigames.wordOrder) {
      if (onDone) onDone({ solved: false });
      return;
    }

    var bd = document.createElement('div');
    bd.id = 'ch2-star-backdrop';
    bd.className = 'ch1-modal-backdrop';
    bd.style.zIndex = '10200';
    bd.innerHTML =
      '<div class="ch1-modal-card">' +
        '<div class="ch1-modal-header">' +
          '<div class="ch1-modal-titlegroup">' +
            '<span class="ch1-stop-pill">⭐ CHAPTER 2 · STAR SPEAKING CHALLENGE</span>' +
            '<h2 class="ch1-modal-title">' + clue.title + ' (Grade ' + g + ')</h2>' +
          '</div>' +
          '<button type="button" class="ch1-btn close" id="ch2-star-close">✕ Back</button>' +
        '</div>' +
        '<div id="ch1-feedback-banner" class="ch1-feedback-banner"></div>' +
        '<div id="ch2-star-stage" class="ch1-mg-stage"></div>' +
      '</div>';
    document.body.appendChild(bd);

    var closeModal = function (solved) {
      if (A().stopVoice) A().stopVoice();
      if (bd.parentNode) bd.parentNode.removeChild(bd);
      if (onDone) onDone({ solved: !!solved });
    };

    document.getElementById('ch2-star-close').onclick = function () {
      if (A().sfxTap) A().sfxTap();
      closeModal(false);
    };

    var t0 = Date.now();
    root.Ch1Minigames.wordOrder(
      document.getElementById('ch2-star-stage'),
      { starTasks: clue.tasks },
      { mode: 'star' },
      function (res) {
        res = res || { stars: 3, tries: 0, hintsUsed: 0, missedItems: [] };
        if (P() && P().recordClueResult) {
          P().recordClueResult({
            clueId: 'ch2_g' + g + '_c' + n,
            stopNum: n,
            grade: g,
            mode: 'star',
            stars: 3,
            tries: res.tries || 0,
            hintsUsed: res.hintsUsed || 0,
            timeMs: Date.now() - t0,
            missedItems: res.missedItems || []
          });
        }
        if (A().sfxFanfare) A().sfxFanfare();
        if (F().sparkleAt) F().sparkleAt(bd.querySelector('.ch1-modal-card'), 22);
        setTimeout(function () { closeModal(true); }, 950);
      }
    );
  }

  function closeActiveModal() {
    if (A().stopVoice) A().stopVoice();
    var bd = document.getElementById('ch2-star-backdrop');
    if (bd && bd.parentNode) bd.parentNode.removeChild(bd);
  }

  root.Chapter2 = {
    openClue: openClue,
    closeModal: closeActiveModal,
    STAR_CONTENT: STAR_CONTENT
  };
})(typeof window !== 'undefined' ? window : this);
