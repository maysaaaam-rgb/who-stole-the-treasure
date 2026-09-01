/**
 * challenges.js - Quests, Listening Tasks, Secret Monster, & Classroom Speaking Game
 * "Build Your Own Monster!"
 */

class ChallengeEngine {
  constructor() {
    this.currentQuestIndex = 0;
    this.currentListeningIndex = 0;
    this.listeningDifficulty = 'easy'; // 'easy', 'medium', 'hard'
    this.secretMonsterTarget = null;

    // 10 Reading Challenge Quests
    this.quests = [
      {
        id: 'quest-eyes-3',
        title: '3 Big Eyes',
        instruction: 'Give your monster 3 big eyes.',
        hint: 'Go to Face ➔ Eyes: Choose 3 ➔ Size: Choose BIG',
        check: (m) => m.eyes.count === 3 && m.eyes.size === 'big'
      },
      {
        id: 'quest-ears-2',
        title: '2 Long Ears',
        instruction: 'Give your monster 2 long ears.',
        hint: 'Go to Face ➔ Ears: Choose 2 ➔ Style: Choose LONG',
        check: (m) => m.ears.count === 2 && m.ears.style === 'long'
      },
      {
        id: 'quest-teeth-sharp',
        title: 'Sharp Teeth',
        instruction: 'Give your monster sharp teeth.',
        hint: 'Go to Face ➔ Teeth: Choose SHARP',
        check: (m) => m.teeth === 'sharp'
      },
      {
        id: 'quest-legs-4',
        title: '4 Legs',
        instruction: 'Give your monster 4 legs.',
        hint: 'Go to Legs: Choose 4',
        check: (m) => m.legs.count === 4
      },
      {
        id: 'quest-wings-dragon',
        title: 'Dragon Wings',
        instruction: 'Give your monster dragon wings.',
        hint: 'Go to Special: Wings ➔ Choose DRAGON',
        check: (m) => m.specialParts.wings === 'dragon'
      },
      {
        id: 'quest-color-purple',
        title: 'Purple Body',
        instruction: 'Make your monster purple.',
        hint: 'Go to Colors: Choose PURPLE',
        check: (m) => m.color === 'purple'
      },
      {
        id: 'quest-cape-red',
        title: 'Red Cape',
        instruction: 'Give your monster a red cape.',
        hint: 'Go to Clothes: Cape ➔ Choose RED',
        check: (m) => m.clothes.cape === true && (m.clothes.capeColor === 'red' || !m.clothes.capeColor)
      },
      {
        id: 'quest-wizard-hat',
        title: 'Wizard Hat',
        instruction: 'Give your monster a wizard hat.',
        hint: 'Go to Accessories: Choose WIZARD HAT',
        check: (m) => m.accessories && m.accessories.includes('wizard_hat')
      },
      {
        id: 'quest-power-fly',
        title: 'Power: Fly',
        instruction: 'Give your monster the power to fly.',
        hint: 'Go to Powers: Choose FLY',
        check: (m) => m.powers && m.powers.includes('fly')
      },
      {
        id: 'quest-personality-funny',
        title: 'Personality: Funny',
        instruction: 'Make your monster funny.',
        hint: 'Go to Personality: Choose FUNNY',
        check: (m) => m.personality && m.personality.includes('funny')
      }
    ];

    // 10 Listening Challenges
    this.listeningTasks = [
      {
        audioText: 'Give your monster three big eyes and two long ears.',
        easyText: 'Give your monster 3 big eyes and 2 long ears.',
        check: (m) => m.eyes.count === 3 && m.ears.count === 2
      },
      {
        audioText: 'Make your monster green with four legs.',
        easyText: 'Make your monster green with 4 legs.',
        check: (m) => m.color === 'green' && m.legs.count === 4
      },
      {
        audioText: 'Give your monster a big mouth and sharp teeth.',
        easyText: 'Give your monster a big mouth and sharp teeth.',
        check: (m) => (m.mouth === 'big' || m.mouth === 'huge') && m.teeth === 'sharp'
      },
      {
        audioText: 'Give your monster dragon wings and a long tail.',
        easyText: 'Give your monster dragon wings and a long tail.',
        check: (m) => m.specialParts.wings === 'dragon' && m.specialParts.tail === 'long'
      },
      {
        audioText: 'Give your monster a red cape and a wizard hat.',
        easyText: 'Give your monster a red cape and a wizard hat.',
        check: (m) => m.clothes.cape === true && m.accessories.includes('wizard_hat')
      },
      {
        audioText: 'Make your monster blue with yellow spots.',
        easyText: 'Make your monster blue with yellow spots.',
        check: (m) => m.color === 'blue' && m.pattern === 'spots' && m.secondaryColor === 'yellow'
      },
      {
        audioText: 'Give your monster four arms and sharp claws.',
        easyText: 'Give your monster 4 arms and sharp claws.',
        check: (m) => m.arms.count === 4 && m.hands === 'claws'
      },
      {
        audioText: 'Give your monster one giant eye and two curly horns.',
        easyText: 'Give your monster 1 giant eye and 2 curly horns.',
        check: (m) => m.eyes.count === 1 && m.horns.count === 2
      },
      {
        audioText: 'Give your monster the power to breathe fire.',
        easyText: 'Give your monster the power to breathe fire.',
        check: (m) => m.powers.includes('breathe_fire')
      },
      {
        audioText: 'Make your monster live in a castle and like pizza.',
        easyText: 'Make your monster live in a castle and like pizza.',
        check: (m) => m.world === 'castle' && m.food === 'pizza'
      }
    ];

    // Classroom Game "Find A Monster" Prompts
    this.findMonsterPrompts = [
      { text: 'Find a monster that can fly! 🦅', trait: 'power-fly' },
      { text: 'Find a monster with three or more eyes! 👁️', trait: 'eyes-3' },
      { text: 'Find a monster wearing a cape! 🦸', trait: 'cape' },
      { text: 'Find a purple monster! 🟣', trait: 'color-purple' },
      { text: 'Find a monster with horns! 🦄', trait: 'horns' },
      { text: 'Find a monster with sharp teeth! 🦈', trait: 'teeth-sharp' },
      { text: 'Find a monster that has wings! 🪽', trait: 'wings' },
      { text: 'Find a funny monster! 😂', trait: 'personality-funny' },
      { text: 'Find a monster that likes pizza! 🍕', trait: 'food-pizza' },
      { text: 'Find a monster that lives in a castle! 🏰', trait: 'world-castle' }
    ];
  }

  getCurrentQuest() {
    return this.quests[this.currentQuestIndex];
  }

  nextQuest() {
    this.currentQuestIndex = (this.currentQuestIndex + 1) % this.quests.length;
    return this.getCurrentQuest();
  }

  getCurrentListening() {
    return this.listeningTasks[this.currentListeningIndex];
  }

  nextListening() {
    this.currentListeningIndex = (this.currentListeningIndex + 1) % this.listeningTasks.length;
    return this.getCurrentListening();
  }

  // 2-Player Secret Monster Generator
  generateSecretMonster() {
    const bodies = ['round', 'tall', 'short', 'wide', 'thin', 'blob', 'robot'];
    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink'];
    const eyesCounts = [1, 2, 3, 4];
    const earsCounts = [0, 2, 4];
    const hornsCounts = [0, 2];
    const armsCounts = [2, 4];
    const legsCounts = [2, 4];
    const wings = ['none', 'dragon', 'butterfly', 'bat'];
    const hats = ['none', 'hat', 'cap', 'crown', 'wizard_hat'];

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    const chosenHat = pick(hats);
    const chosenAccessories = chosenHat !== 'none' ? [chosenHat] : [];

    this.secretMonsterTarget = {
      name: 'Secret Monster',
      body: pick(bodies),
      color: pick(colors),
      secondaryColor: 'yellow',
      pattern: 'none',
      eyes: { count: pick(eyesCounts), size: 'big', style: 'round' },
      ears: { count: pick(earsCounts), style: 'long' },
      horns: { count: pick(hornsCounts), style: 'curly' },
      nose: 'small',
      mouth: 'big',
      teeth: Math.random() > 0.5 ? 'sharp' : 'none',
      arms: { count: pick(armsCounts), length: 'normal' },
      hands: 'normal',
      legs: { count: pick(legsCounts) },
      feet: 'normal',
      specialParts: { wings: pick(wings), tail: 'none', spikes: false, fins: false, tentacles: false, shell: false },
      clothes: { outfit: 'none', top: 'none', bottom: 'none', shoes: 'none', cape: Math.random() > 0.5, capeColor: 'red' },
      accessories: chosenAccessories,
      accessoryColors: { hat: 'yellow', cap: 'blue' },
      powers: ['fly'],
      personality: ['funny'],
      world: 'castle',
      food: 'pizza'
    };

    return this.secretMonsterTarget;
  }

  compareMonsters(playerRaw) {
    if (!this.secretMonsterTarget) this.generateSecretMonster();
    const target = window.monsterRenderer.normalize(this.secretMonsterTarget);
    const player = window.monsterRenderer.normalize(playerRaw);

    const checks = [
      { feature: 'Body Color', target: target.color, player: player.color, match: target.color === player.color },
      { feature: 'Number of Eyes', target: `${target.eyes.count} eyes`, player: `${player.eyes.count} eyes`, match: target.eyes.count === player.eyes.count },
      { feature: 'Number of Ears', target: `${target.ears.count} ears`, player: `${player.ears.count} ears`, match: target.ears.count === player.ears.count },
      { feature: 'Horns', target: target.horns.count > 0 ? `${target.horns.count} horns` : 'No horns', player: player.horns.count > 0 ? `${player.horns.count} horns` : 'No horns', match: target.horns.count === player.horns.count },
      { feature: 'Teeth', target: target.teeth === 'sharp' ? 'Sharp teeth' : 'No teeth', player: player.teeth === 'sharp' ? 'Sharp teeth' : 'No teeth', match: target.teeth === player.teeth },
      { feature: 'Number of Arms', target: `${target.arms.count} arms`, player: `${player.arms.count} arms`, match: target.arms.count === player.arms.count },
      { feature: 'Number of Legs', target: `${target.legs.count} legs`, player: `${player.legs.count} legs`, match: target.legs.count === player.legs.count },
      { feature: 'Wings', target: target.specialParts.wings !== 'none' ? `${target.specialParts.wings} wings` : 'No wings', player: player.specialParts.wings !== 'none' ? `${player.specialParts.wings} wings` : 'No wings', match: target.specialParts.wings === player.specialParts.wings },
      { feature: 'Cape', target: target.clothes.cape ? 'Red cape' : 'No cape', player: player.clothes.cape ? 'Red cape' : 'No cape', match: target.clothes.cape === player.clothes.cape }
    ];

    const correct = checks.filter(c => c.match).length;
    const total = checks.length;

    return {
      correct,
      total,
      details: checks
    };
  }

  getRandomFindPrompt() {
    return this.findMonsterPrompts[Math.floor(Math.random() * this.findMonsterPrompts.length)];
  }
}

window.challengeEngine = new ChallengeEngine();
