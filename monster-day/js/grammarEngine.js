/**
 * grammarEngine.js - A1/A1+ English Grammar & Language Generator for "Build Your Own Monster!"
 */

class GrammarEngine {
  constructor() {
    this.numberWords = {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      many: 'many'
    };
  }

  // Capitalize first letter
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Format Eyes phrase: e.g. "three big eyes", "one small eye"
  getEyesPhrase(monster) {
    const count = monster.eyesCount; // 1, 2, 3
    const size = monster.eyesSize;   // 'big', 'small'
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'eye' : 'eyes';
    return `${numWord} ${size} ${noun}`;
  }

  // Format Ears phrase: e.g. "two long ears", "one short ear"
  getEarsPhrase(monster) {
    const count = monster.earsCount; // 1, 2
    const length = monster.earsLength || monster.earsStyle || 'long';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'ear' : 'ears';
    return `${numWord} ${length} ${noun}`;
  }

  // Format Mouth phrase: e.g. "a big mouth", "a scary mouth"
  getMouthPhrase(monster) {
    const type = monster.mouthType || 'big';
    const article = (type === 'orange' || type === 'enormous') ? 'an' : 'a';
    return `${article} ${type} mouth`;
  }

  // Format Teeth phrase: e.g. "sharp teeth", "big teeth", "small teeth"
  getTeethPhrase(monster) {
    if (monster.teethType === 'none') return null;
    return `${monster.teethType} teeth`;
  }

  // Format Nose phrase: e.g. "a big nose", "a small nose"
  getNosePhrase(monster) {
    const size = monster.noseSize || monster.noseStyle || 'small';
    return `a ${size} nose`;
  }

  // Format Legs phrase: e.g. "four legs", "two legs"
  getLegsPhrase(monster) {
    const count = monster.legsCount; // 2, 3, 4
    const numWord = this.numberWords[count] || count;
    return `${numWord} legs`;
  }

  // Format Arms phrase: e.g. "two long arms", "many short arms"
  getArmsPhrase(monster) {
    const count = monster.armsCount; // 2, 3, 'many'
    const length = monster.armsLength; // 'long', 'short'
    const numWord = this.numberWords[count] || count;
    return `${numWord} ${length} arms`;
  }

  // Format Color phrase: e.g. "purple"
  getColorPhrase(monster) {
    return monster.color;
  }

  // Get list of individual clothing phrases
  getClothingPhrases(monster) {
    const phrases = [];

    // Tops
    if (monster.clothesTop && monster.clothesTop !== 'none') {
      const topName = monster.clothesTop === 'tshirt' ? 'T-shirt' : monster.clothesTop;
      const color = monster.clothesTopColor || 'blue';
      const article = ['a','e','i','o','u'].includes(color[0]) ? 'an' : 'a';
      phrases.push(`${article} ${color} ${topName}`);
    }

    // Bottoms
    if (monster.clothesBottom && monster.clothesBottom !== 'none') {
      const botName = monster.clothesBottom;
      const color = monster.clothesBottomColor || 'black';
      if (botName === 'trousers' || botName === 'shorts') {
        phrases.push(`${color} ${botName}`);
      } else {
        const article = ['a','e','i','o','u'].includes(color[0]) ? 'an' : 'a';
        phrases.push(`${article} ${color} ${botName}`);
      }
    }

    // Special items
    if (monster.specialCape) {
      phrases.push(`a ${monster.specialCapeColor || 'red'} cape`);
    }
    if (monster.specialBoots) {
      phrases.push(`${monster.specialBootsColor || 'yellow'} boots`);
    }
    if (monster.specialGloves) {
      phrases.push(`${monster.specialGlovesColor || 'green'} gloves`);
    }

    // Accessories
    if (monster.accessories && Array.isArray(monster.accessories)) {
      monster.accessories.forEach(acc => {
        if (acc === 'glasses') {
          phrases.push('glasses');
        } else if (acc === 'hat') {
          phrases.push(`a ${monster.accessoryColors?.hat || 'yellow'} hat`);
        } else if (acc === 'cap') {
          phrases.push(`a ${monster.accessoryColors?.cap || 'blue'} cap`);
        } else if (acc === 'scarf') {
          phrases.push(`a ${monster.accessoryColors?.scarf || 'striped'} scarf`);
        } else if (acc === 'bow') {
          phrases.push(`a ${monster.accessoryColors?.bow || 'pink'} bow`);
        } else if (acc === 'crown') {
          phrases.push('a golden crown');
        } else if (acc === 'backpack') {
          phrases.push(`a ${monster.accessoryColors?.backpack || 'green'} backpack`);
        }
      });
    }

    return phrases;
  }

  // Join items naturally with commas and 'and'
  joinListNaturally(items) {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  // Get full structured breakdown for the final screen card
  getMonsterSummary(monster) {
    const name = monster.name || 'Zippy';
    const color = monster.color;
    const bodyFeatures = [
      this.getEyesPhrase(monster),
      this.getEarsPhrase(monster),
      this.getMouthPhrase(monster),
      this.getTeethPhrase(monster),
      this.getNosePhrase(monster),
      this.getArmsPhrase(monster),
      this.getLegsPhrase(monster)
    ].filter(Boolean);

    const clothingItems = this.getClothingPhrases(monster);

    return {
      name,
      color,
      bodyFeatures,
      clothingItems
    };
  }

  // Generate full A1 paragraph
  getFullDescription(monster) {
    const name = monster.name || 'Zippy';
    const color = monster.color;
    const eyes = this.getEyesPhrase(monster);
    const ears = this.getEarsPhrase(monster);
    const mouth = this.getMouthPhrase(monster);
    const teeth = this.getTeethPhrase(monster);
    const nose = this.getNosePhrase(monster);
    const arms = this.getArmsPhrase(monster);
    const legs = this.getLegsPhrase(monster);
    const clothing = this.getClothingPhrases(monster);

    const sentences = [
      `This is ${name}.`,
      `It is ${color}.`,
      `It has ${eyes} and ${ears}.`,
      teeth ? `It has ${mouth} and ${teeth}.` : `It has ${mouth} and ${nose}.`,
      `It has ${arms} and ${legs}.`
    ];

    if (clothing.length > 0) {
      sentences.push(`It is wearing ${this.joinListNaturally(clothing)}.`);
    }

    return sentences.join(' ');
  }

  // Generate sequence of step-by-step sentences for Speaking Mode
  getSpeakingSentences(monster) {
    const name = monster.name || 'Zippy';
    const color = monster.color;
    const eyes = this.getEyesPhrase(monster);
    const ears = this.getEarsPhrase(monster);
    const mouth = this.getMouthPhrase(monster);
    const teeth = this.getTeethPhrase(monster);
    const nose = this.getNosePhrase(monster);
    const arms = this.getArmsPhrase(monster);
    const legs = this.getLegsPhrase(monster);
    const clothing = this.getClothingPhrases(monster);

    const steps = [
      {
        icon: '👋',
        starter: 'This is...',
        text: `This is my monster. Its name is ${name}.`,
        highlight: name
      },
      {
        icon: '🎨',
        starter: 'It is...',
        text: `It is ${color}.`,
        highlight: color
      },
      {
        icon: '👁️',
        starter: 'It has...',
        text: `It has ${eyes}.`,
        highlight: eyes
      },
      {
        icon: '👂',
        starter: 'It has...',
        text: `It has ${ears}.`,
        highlight: ears
      },
      {
        icon: '👃',
        starter: 'It has...',
        text: `It has ${nose}.`,
        highlight: nose
      },
      {
        icon: '👄',
        starter: 'It has...',
        text: teeth ? `It has ${mouth} and ${teeth}.` : `It has ${mouth}.`,
        highlight: mouth
      },
      {
        icon: '👐',
        starter: 'It has...',
        text: `It has ${arms}.`,
        highlight: arms
      },
      {
        icon: '🦵',
        starter: 'It has...',
        text: `It has ${legs}.`,
        highlight: legs
      }
    ];

    if (clothing.length > 0) {
      clothing.forEach((item, idx) => {
        steps.push({
          icon: '👕',
          starter: 'It is wearing...',
          text: `It is wearing ${item}.`,
          highlight: item
        });
      });
    }

    return steps;
  }
}

window.grammarEngine = new GrammarEngine();
