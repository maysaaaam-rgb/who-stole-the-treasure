/**
 * challenges.js - Challenge & Learning Game Engine for "Build Your Own Monster!"
 * Handles Monster Challenges, Listening Challenges, and Secret Monster 2-Player mode.
 */

class ChallengeEngine {
  constructor() {
    this.currentChallengeIndex = 0;
    this.currentListeningIndex = 0;
    this.secretMonsterTarget = null;
    this.listeningDifficulty = 'easy'; // 'easy', 'medium', 'hard'

    // Monster Challenge Quests
    this.monsterQuests = [
      {
        id: 'q1',
        title: '3 Big Eyes',
        instruction: 'Give your monster 3 big eyes.',
        hint: 'Go to Eyes 👁️ ➔ Choose 3 ➔ Choose BIG',
        check: (m) => m.eyesCount === 3 && m.eyesSize === 'big'
      },
      {
        id: 'q2',
        title: 'Purple Body',
        instruction: 'Give your monster a purple body.',
        hint: 'Go to Color 🎨 ➔ Choose Purple',
        check: (m) => m.color === 'purple'
      },
      {
        id: 'q3',
        title: '2 Short Ears',
        instruction: 'Give your monster 2 short ears.',
        hint: 'Go to Ears 👂 ➔ Choose 2 ➔ Choose SHORT',
        check: (m) => m.earsCount === 2 && m.earsLength === 'short'
      },
      {
        id: 'q4',
        title: 'Scary Mouth',
        instruction: 'Give your monster a scary mouth.',
        hint: 'Go to Mouth 👄 ➔ Choose SCARY',
        check: (m) => m.mouthType === 'scary'
      },
      {
        id: 'q5',
        title: '4 Legs',
        instruction: 'Give your monster 4 legs.',
        hint: 'Go to Legs 🦵 ➔ Choose 4',
        check: (m) => m.legsCount === 4
      },
      {
        id: 'q6',
        title: 'Sharp Teeth',
        instruction: 'Give your monster sharp teeth.',
        hint: 'Go to Teeth 🦷 ➔ Choose SHARP',
        check: (m) => m.teethType === 'sharp'
      },
      {
        id: 'q7',
        title: 'Long Arms',
        instruction: 'Give your monster 2 long arms.',
        hint: 'Go to Arms 👐 ➔ Choose 2 ➔ Choose LONG',
        check: (m) => m.armsCount === 2 && m.armsLength === 'long'
      },
      {
        id: 'q8',
        title: 'Red Cape',
        instruction: 'Give your monster a red cape.',
        hint: 'Go to Dress 👕 ➔ Special 🦸 ➔ Choose Red Cape',
        check: (m) => !!m.specialCape
      },
      {
        id: 'q9',
        title: 'Golden Crown',
        instruction: 'Give your monster a crown.',
        hint: 'Go to Dress 👕 ➔ Accessories 🧢 ➔ Choose Crown 👑',
        check: (m) => m.accessories && m.accessories.includes('crown')
      },
      {
        id: 'q10',
        title: 'Green Body & 1 Big Eye',
        instruction: 'Give your monster a green body and 1 big eye.',
        hint: 'Color: Green 🎨 + Eyes: 1 Big 👁️',
        check: (m) => m.color === 'green' && m.eyesCount === 1 && m.eyesSize === 'big'
      }
    ];

    // Listening Challenge Quests
    this.listeningQuests = [
      {
        id: 'l1',
        audioText: 'Give your monster three big eyes.',
        easyText: 'Give your monster 3 big eyes.',
        mediumText: 'Eyes: 3 BIG',
        check: (m) => m.eyesCount === 3 && m.eyesSize === 'big'
      },
      {
        id: 'l2',
        audioText: 'Give your monster a blue body.',
        easyText: 'Give your monster a blue body.',
        mediumText: 'Color: Blue',
        check: (m) => m.color === 'blue'
      },
      {
        id: 'l3',
        audioText: 'Give your monster two long ears.',
        easyText: 'Give your monster 2 long ears.',
        mediumText: 'Ears: 2 LONG',
        check: (m) => m.earsCount === 2 && m.earsLength === 'long'
      },
      {
        id: 'l4',
        audioText: 'Give your monster four legs.',
        easyText: 'Give your monster 4 legs.',
        mediumText: 'Legs: 4',
        check: (m) => m.legsCount === 4
      },
      {
        id: 'l5',
        audioText: 'Give your monster a big mouth and sharp teeth.',
        easyText: 'Give your monster a big mouth and sharp teeth.',
        mediumText: 'Mouth: BIG + Teeth: SHARP',
        check: (m) => m.mouthType === 'big' && m.teethType === 'sharp'
      },
      {
        id: 'l6',
        audioText: 'Give your monster a red cape and yellow boots.',
        easyText: 'Give your monster a red cape and yellow boots.',
        mediumText: 'Dress: Red Cape + Yellow Boots',
        check: (m) => !!m.specialCape && !!m.specialBoots
      },
      {
        id: 'l7',
        audioText: 'Give your monster a yellow hat and glasses.',
        easyText: 'Give your monster a yellow hat and glasses.',
        mediumText: 'Accessories: Hat + Glasses',
        check: (m) => m.accessories && m.accessories.includes('hat') && m.accessories.includes('glasses')
      }
    ];
  }

  getCurrentQuest() {
    return this.monsterQuests[this.currentChallengeIndex] || this.monsterQuests[0];
  }

  getCurrentListeningQuest() {
    return this.listeningQuests[this.currentListeningIndex] || this.listeningQuests[0];
  }

  nextQuest() {
    this.currentChallengeIndex = (this.currentChallengeIndex + 1) % this.monsterQuests.length;
    return this.getCurrentQuest();
  }

  nextListeningQuest() {
    this.currentListeningIndex = (this.currentListeningIndex + 1) % this.listeningQuests.length;
    return this.getCurrentListeningQuest();
  }

  // ==========================================
  // SECRET MONSTER GENERATOR & COMPARATOR
  // ==========================================

  generateSecretMonster() {
    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink'];
    const eyesCounts = [1, 2, 3];
    const eyesSizes = ['big', 'small'];
    const earsCounts = [1, 2];
    const earsLengths = ['long', 'short'];
    const mouthTypes = ['big', 'small', 'scary'];
    const teethTypes = ['sharp', 'big', 'small'];
    const legsCounts = [2, 3, 4];
    const armsCounts = [2, 3, 'many'];
    const armsLengths = ['long', 'short'];
    const topChoices = ['none', 'tshirt', 'shirt', 'jacket'];
    const accChoices = ['none', 'hat', 'cap', 'glasses', 'scarf', 'crown'];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const chosenAcc = pick(accChoices);
    const chosenTop = pick(topChoices);

    this.secretMonsterTarget = {
      name: 'Secret Mystery',
      color: pick(colors),
      eyesCount: pick(eyesCounts),
      eyesSize: pick(eyesSizes),
      earsCount: pick(earsCounts),
      earsLength: pick(earsLengths),
      mouthType: pick(mouthTypes),
      teethType: pick(teethTypes),
      noseSize: 'small',
      legsCount: pick(legsCounts),
      armsCount: pick(armsCounts),
      armsLength: pick(armsLengths),
      clothesTop: chosenTop,
      clothesTopColor: 'blue',
      clothesBottom: 'none',
      accessories: chosenAcc !== 'none' ? [chosenAcc] : [],
      accessoryColors: { hat: 'yellow', cap: 'blue', scarf: 'red' },
      specialCape: Math.random() > 0.5,
      specialCapeColor: 'red',
      specialBoots: false,
      specialGloves: false
    };

    return this.secretMonsterTarget;
  }

  compareMonsters(playerMonster, secretMonster) {
    if (!secretMonster) secretMonster = this.secretMonsterTarget;
    if (!secretMonster) return { total: 8, correct: 0, details: [] };

    const details = [];

    // 1. Color
    const colorMatch = playerMonster.color === secretMonster.color;
    details.push({
      feature: 'Body Color',
      target: window.grammarEngine.capitalize(secretMonster.color),
      player: window.grammarEngine.capitalize(playerMonster.color),
      match: colorMatch
    });

    // 2. Eyes
    const eyesMatch = playerMonster.eyesCount === secretMonster.eyesCount && playerMonster.eyesSize === secretMonster.eyesSize;
    details.push({
      feature: 'Eyes',
      target: window.grammarEngine.getEyesPhrase(secretMonster),
      player: window.grammarEngine.getEyesPhrase(playerMonster),
      match: eyesMatch
    });

    // 3. Ears
    const earsMatch = playerMonster.earsCount === secretMonster.earsCount && playerMonster.earsLength === secretMonster.earsLength;
    details.push({
      feature: 'Ears',
      target: window.grammarEngine.getEarsPhrase(secretMonster),
      player: window.grammarEngine.getEarsPhrase(playerMonster),
      match: earsMatch
    });

    // 4. Mouth
    const mouthMatch = playerMonster.mouthType === secretMonster.mouthType;
    details.push({
      feature: 'Mouth',
      target: window.grammarEngine.getMouthPhrase(secretMonster),
      player: window.grammarEngine.getMouthPhrase(playerMonster),
      match: mouthMatch
    });

    // 5. Teeth
    const teethMatch = playerMonster.teethType === secretMonster.teethType;
    details.push({
      feature: 'Teeth',
      target: window.grammarEngine.getTeethPhrase(secretMonster) || 'None',
      player: window.grammarEngine.getTeethPhrase(playerMonster) || 'None',
      match: teethMatch
    });

    // 6. Arms
    const armsMatch = playerMonster.armsCount === secretMonster.armsCount && playerMonster.armsLength === secretMonster.armsLength;
    details.push({
      feature: 'Arms',
      target: window.grammarEngine.getArmsPhrase(secretMonster),
      player: window.grammarEngine.getArmsPhrase(playerMonster),
      match: armsMatch
    });

    // 7. Legs
    const legsMatch = playerMonster.legsCount === secretMonster.legsCount;
    details.push({
      feature: 'Legs',
      target: window.grammarEngine.getLegsPhrase(secretMonster),
      player: window.grammarEngine.getLegsPhrase(playerMonster),
      match: legsMatch
    });

    // 8. Cape / Accessories
    const capeMatch = (!!playerMonster.specialCape) === (!!secretMonster.specialCape);
    details.push({
      feature: 'Red Cape',
      target: secretMonster.specialCape ? 'Wearing Cape' : 'No Cape',
      player: playerMonster.specialCape ? 'Wearing Cape' : 'No Cape',
      match: capeMatch
    });

    const correctCount = details.filter(d => d.match).length;

    return {
      total: details.length,
      correct: correctCount,
      details: details
    };
  }
}

window.challengeEngine = new ChallengeEngine();
