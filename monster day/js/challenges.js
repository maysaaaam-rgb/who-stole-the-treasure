/**
 * challenges.js - Challenge & Learning Game Engine for "Build Your Own Monster!"
 * Supports Monster Quests, Listening Challenges, Secret Monster 2-Player, and "Find a Monster" Classroom Game.
 */

class ChallengeEngine {
  constructor() {
    this.currentChallengeIndex = 0;
    this.currentListeningIndex = 0;
    this.secretMonsterTarget = null;
    this.listeningDifficulty = 'easy'; // 'easy', 'medium', 'hard'

    // Monster Challenge Quests (Expanded with creative choices)
    this.monsterQuests = [
      {
        id: 'q1',
        title: '3 Big Eyes',
        instruction: 'Give your monster 3 big eyes.',
        hint: 'Go to Face ➔ Eyes ➔ Choose 3 ➔ Choose BIG',
        check: (m) => m.eyesCount === 3 && (m.eyesSize === 'big' || m.eyesSize === 'giant')
      },
      {
        id: 'q2',
        title: 'Dragon Wings',
        instruction: 'Give your monster dragon wings.',
        hint: 'Go to Special ➔ Wings ➔ Choose Dragon Wings 🐉',
        check: (m) => m.specialWings === 'dragon'
      },
      {
        id: 'q3',
        title: 'Curly Horns',
        instruction: 'Give your monster 2 curly horns.',
        hint: 'Go to Face ➔ Horns ➔ Choose 2 Curly Horns 🦄',
        check: (m) => m.hornsCount >= 2 && m.hornsStyle === 'curly'
      },
      {
        id: 'q4',
        title: 'Power to Fly',
        instruction: 'Give your monster the power to fly.',
        hint: 'Go to Powers ✨ ➔ Choose Fly 🦅',
        check: (m) => m.powers && m.powers.includes('fly')
      },
      {
        id: 'q5',
        title: 'Castle Home',
        instruction: 'Make your monster live in a castle.',
        hint: 'Go to World 🏠 ➔ Choose Castle 🏰',
        check: (m) => m.world === 'castle'
      },
      {
        id: 'q6',
        title: 'Funny Personality',
        instruction: 'Make your monster funny.',
        hint: 'Go to Personality ❤️ ➔ Choose Funny 😂',
        check: (m) => m.personality && m.personality.includes('funny')
      },
      {
        id: 'q7',
        title: 'Likes Pizza',
        instruction: 'Make your monster like pizza.',
        hint: 'Go to Food 🍕 ➔ Choose Pizza 🍕',
        check: (m) => m.food === 'pizza'
      },
      {
        id: 'q8',
        title: '4 Legs & Dinosaur Tail',
        instruction: 'Give your monster 4 legs and a dinosaur tail.',
        hint: 'Legs ➔ 4, Special ➔ Dinosaur Tail 🦕',
        check: (m) => m.legsCount === 4 && m.specialTail === 'dinosaur'
      },
      {
        id: 'q9',
        title: 'Wizard Hat & Cape',
        instruction: 'Give your monster a wizard hat and a red cape.',
        hint: 'Accessories ➔ Wizard Hat 🧙 + Special ➔ Red Cape',
        check: (m) => m.accessories && m.accessories.includes('wizard_hat') && !!m.specialCape
      },
      {
        id: 'q10',
        title: 'Robot Body',
        instruction: 'Give your monster a robot body.',
        hint: 'Go to Body ➔ Shape ➔ Choose Robot 🤖',
        check: (m) => m.bodyShape === 'robot'
      }
    ];

    // Listening Challenge Quests
    this.listeningQuests = [
      {
        id: 'l1',
        audioText: 'Give your monster three big eyes and two long ears.',
        easyText: 'Give your monster 3 big eyes and 2 long ears.',
        mediumText: 'Eyes: 3 BIG + Ears: 2 LONG',
        check: (m) => m.eyesCount === 3 && (m.eyesSize === 'big' || m.eyesSize === 'giant') && m.earsCount === 2
      },
      {
        id: 'l2',
        audioText: 'Give your monster dragon wings and the power to fly.',
        easyText: 'Give your monster dragon wings and the power to fly.',
        mediumText: 'Wings: Dragon + Power: Fly',
        check: (m) => m.specialWings === 'dragon' && m.powers && m.powers.includes('fly')
      },
      {
        id: 'l3',
        audioText: 'Give your monster a purple body with yellow spots.',
        easyText: 'Give your monster a purple body with yellow spots.',
        mediumText: 'Color: Purple + Pattern: Spots',
        check: (m) => m.color === 'purple' && m.pattern === 'spots'
      },
      {
        id: 'l4',
        audioText: 'Give your monster a scary mouth and sharp teeth.',
        easyText: 'Give your monster a scary mouth and sharp teeth.',
        mediumText: 'Mouth: Scary + Teeth: Sharp',
        check: (m) => m.mouthType === 'scary' && (m.teethType === 'sharp' || m.teethType === 'vampire')
      },
      {
        id: 'l5',
        audioText: 'Make your monster live on the moon and like pizza.',
        easyText: 'Make your monster live on the moon and like pizza.',
        mediumText: 'World: Moon + Food: Pizza',
        check: (m) => m.world === 'moon' && m.food === 'pizza'
      }
    ];

    // Classroom Speaking Game Prompts ("Find a Monster")
    this.findMonsterPrompts = [
      { text: "Find a monster that can fly! 🦅", targetCheck: (m) => m.powers && m.powers.includes('fly') },
      { text: "Find a monster with 3 eyes! 👁️", targetCheck: (m) => m.eyesCount === 3 },
      { text: "Find a monster with dragon wings! 🐉", targetCheck: (m) => m.specialWings === 'dragon' },
      { text: "Find a monster that lives in a castle! 🏰", targetCheck: (m) => m.world === 'castle' },
      { text: "Find a monster that likes pizza! 🍕", targetCheck: (m) => m.food === 'pizza' },
      { text: "Find a funny monster! 😂", targetCheck: (m) => m.personality && m.personality.includes('funny') },
      { text: "Find a monster wearing a wizard hat! 🧙", targetCheck: (m) => m.accessories && m.accessories.includes('wizard_hat') },
      { text: "Find a monster with a robot body! 🤖", targetCheck: (m) => m.bodyShape === 'robot' },
      { text: "Find a monster with 4 legs! 🐾", targetCheck: (m) => m.legsCount === 4 },
      { text: "Find a monster that can breathe fire! 🔥", targetCheck: (m) => m.powers && m.powers.includes('breathe_fire') }
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

  getRandomFindPrompt() {
    const p = this.findMonsterPrompts[Math.floor(Math.random() * this.findMonsterPrompts.length)];
    return p;
  }

  // Generate Secret Monster for 2-Player Classroom Mode
  generateSecretMonster() {
    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink'];
    const shapes = ['round', 'square', 'tall', 'blob', 'robot'];
    const wingsChoices = ['none', 'dragon', 'butterfly', 'bat'];
    const tailsChoices = ['none', 'long', 'dinosaur', 'curly'];
    const powersChoices = ['fly', 'breathe_fire', 'shoot_lightning', 'make_ice'];
    const worlds = ['castle', 'moon', 'forest', 'volcano'];
    const foods = ['pizza', 'ice_cream', 'burgers', 'cake'];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    this.secretMonsterTarget = {
      name: 'Secret Mystery',
      color: pick(colors),
      secondaryColor: 'yellow',
      pattern: Math.random() > 0.5 ? 'spots' : 'none',
      bodyShape: pick(shapes),
      eyesCount: pick([1, 2, 3]),
      eyesSize: 'big',
      eyesStyle: 'round',
      earsCount: pick([1, 2]),
      earsStyle: 'long',
      hornsCount: Math.random() > 0.5 ? 2 : 0,
      hornsStyle: 'curly',
      mouthType: pick(['big', 'scary', 'smiling']),
      teethType: pick(['sharp', 'big', 'small']),
      noseStyle: 'small',
      legsCount: pick([2, 4]),
      feetStyle: 'normal',
      armsCount: pick([2, 3]),
      armsLength: 'short',
      handsStyle: 'normal',
      specialWings: pick(wingsChoices),
      specialTail: pick(tailsChoices),
      specialParts: [],
      clothesTop: 'none',
      clothesBottom: 'none',
      accessories: Math.random() > 0.5 ? ['hat'] : [],
      specialCape: Math.random() > 0.5,
      powers: [pick(powersChoices)],
      personality: ['funny'],
      world: pick(worlds),
      food: pick(foods)
    };

    return this.secretMonsterTarget;
  }

  compareMonsters(playerMonster, secretMonster) {
    if (!secretMonster) secretMonster = this.secretMonsterTarget;
    if (!secretMonster) return { total: 8, correct: 0, details: [] };

    const details = [];

    // 1. Color
    details.push({
      feature: 'Color',
      target: window.grammarEngine.capitalize(secretMonster.color),
      player: window.grammarEngine.capitalize(playerMonster.color),
      match: playerMonster.color === secretMonster.color
    });

    // 2. Eyes
    details.push({
      feature: 'Eyes',
      target: window.grammarEngine.getEyesPhrase(secretMonster),
      player: window.grammarEngine.getEyesPhrase(playerMonster),
      match: playerMonster.eyesCount === secretMonster.eyesCount
    });

    // 3. Ears
    details.push({
      feature: 'Ears',
      target: window.grammarEngine.getEarsPhrase(secretMonster),
      player: window.grammarEngine.getEarsPhrase(playerMonster),
      match: playerMonster.earsCount === secretMonster.earsCount
    });

    // 4. Mouth
    details.push({
      feature: 'Mouth',
      target: window.grammarEngine.getMouthPhrase(secretMonster),
      player: window.grammarEngine.getMouthPhrase(playerMonster),
      match: playerMonster.mouthType === secretMonster.mouthType
    });

    // 5. Wings
    details.push({
      feature: 'Wings',
      target: secretMonster.specialWings !== 'none' ? `${secretMonster.specialWings} wings` : 'No wings',
      player: playerMonster.specialWings !== 'none' ? `${playerMonster.specialWings} wings` : 'No wings',
      match: playerMonster.specialWings === secretMonster.specialWings
    });

    // 6. Power
    const targetPower = secretMonster.powers && secretMonster.powers.length > 0 ? secretMonster.powers[0] : 'none';
    const playerPower = playerMonster.powers && playerMonster.powers.length > 0 ? playerMonster.powers[0] : 'none';
    details.push({
      feature: 'Power',
      target: targetPower,
      player: playerPower,
      match: targetPower === playerPower
    });

    // 7. World
    details.push({
      feature: 'Home World',
      target: secretMonster.world || 'castle',
      player: playerMonster.world || 'castle',
      match: playerMonster.world === secretMonster.world
    });

    // 8. Food
    details.push({
      feature: 'Favorite Food',
      target: secretMonster.food || 'pizza',
      player: playerMonster.food || 'pizza',
      match: playerMonster.food === secretMonster.food
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
