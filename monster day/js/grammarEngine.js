/**
 * grammarEngine.js - Advanced A1/A1+ English Grammar & Language Generator for "Build Your Own Monster!"
 * Supports deep character creation: Body Shapes, Eyes, Ears, Horns, Mouth, Teeth, Nose,
 * Arms, Hands, Legs, Feet, Wings, Tails, Extras, Patterns, Clothes, Powers, Personality, World & Food.
 */

class GrammarEngine {
  constructor() {
    this.numberWords = {
      0: 'no',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      many: 'many'
    };
  }

  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Format Article: "a" vs "an"
  withArticle(word, defaultArticle = 'a') {
    if (!word) return '';
    const firstLetter = word.trim().toLowerCase()[0];
    const article = ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : defaultArticle;
    return `${article} ${word}`;
  }

  // 1. Body Shape Phrase
  getBodyShapePhrase(monster) {
    const shape = monster.bodyShape || 'round';
    return this.withArticle(`${shape} body`);
  }

  // 2. Eyes Phrase
  getEyesPhrase(monster) {
    const count = monster.eyesCount; // 1, 2, 3, 4, 'many'
    const size = monster.eyesSize || 'big'; // 'tiny', 'small', 'big', 'giant'
    const style = monster.eyesStyle && monster.eyesStyle !== 'round' ? `${monster.eyesStyle} ` : '';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'eye' : 'eyes';
    return `${numWord} ${size} ${style}${noun}`;
  }

  // 3. Ears Phrase
  getEarsPhrase(monster) {
    const count = monster.earsCount; // 0, 1, 2, 4
    if (count === 0) return 'no ears';
    const style = monster.earsStyle || 'long';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'ear' : 'ears';
    return `${numWord} ${style} ${noun}`;
  }

  // 4. Horns Phrase
  getHornsPhrase(monster) {
    const count = monster.hornsCount || 0; // 0, 1, 2, 4
    if (count === 0) return null;
    const style = monster.hornsStyle || 'curly';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'horn' : 'horns';
    return `${numWord} ${style} ${noun}`;
  }

  // 5. Mouth Phrase
  getMouthPhrase(monster) {
    const type = monster.mouthType || 'big'; // 'tiny', 'small', 'big', 'huge', 'smiling', 'happy', 'surprised', 'scary'
    return this.withArticle(`${type} mouth`);
  }

  // 6. Teeth Phrase
  getTeethPhrase(monster) {
    const type = monster.teethType; // 'none', 'small', 'big', 'sharp', 'vampire', 'giant'
    if (!type || type === 'none') return null;
    if (type === 'giant') return 'one giant tooth';
    if (type === 'vampire') return 'sharp vampire teeth';
    return `${type} teeth`;
  }

  // 7. Nose Phrase
  getNosePhrase(monster) {
    const style = monster.noseStyle; // 'none', 'tiny', 'small', 'big', 'long', 'round', 'funny'
    if (!style || style === 'none') return null;
    if (style === 'funny') return 'a funny monster nose';
    return this.withArticle(`${style} nose`);
  }

  // 8. Arms & Hands Phrase
  getArmsPhrase(monster) {
    const count = monster.armsCount; // 0, 1, 2, 3, 4, 'many'
    if (count === 0) return 'no arms';
    const length = monster.armsLength === 'super_long' ? 'super long' : (monster.armsLength || 'short');
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'arm' : 'arms';

    let handText = '';
    if (monster.handsStyle && monster.handsStyle !== 'normal') {
      if (monster.handsStyle === 'claws') handText = ' with sharp claws';
      else if (monster.handsStyle === 'three_fingers') handText = ' with 3 fingers';
      else if (monster.handsStyle === 'four_fingers') handText = ' with 4 fingers';
      else if (monster.handsStyle === 'giant') handText = ' with giant hands';
      else if (monster.handsStyle === 'tiny') handText = ' with tiny hands';
    }

    return `${numWord} ${length} ${noun}${handText}`;
  }

  // 9. Legs & Feet Phrase
  getLegsPhrase(monster) {
    const count = monster.legsCount; // 0, 1, 2, 3, 4, 'many'
    if (count === 0) return 'no legs';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'leg' : 'legs';

    let footText = '';
    if (monster.feetStyle && monster.feetStyle !== 'normal') {
      if (monster.feetStyle === 'claws') footText = ' and sharp claws';
      else if (monster.feetStyle === 'bird') footText = ' and bird feet';
      else if (monster.feetStyle === 'monster') footText = ' and monster feet';
      else if (monster.feetStyle === 'giant') footText = ' and giant feet';
      else if (monster.feetStyle === 'tiny') footText = ' and tiny feet';
    }

    return `${numWord} ${noun}${footText}`;
  }

  // 10. Special Body Parts (Wings, Tails, Extras)
  getSpecialPartsPhrases(monster) {
    const list = [];
    if (monster.specialWings && monster.specialWings !== 'none') {
      list.push(`${monster.specialWings} wings`);
    }
    if (monster.specialTail && monster.specialTail !== 'none') {
      list.push(this.withArticle(`${monster.specialTail} tail`));
    }
    if (monster.specialParts && Array.isArray(monster.specialParts)) {
      monster.specialParts.forEach(part => {
        if (part === 'spikes') list.push('sharp spikes');
        else if (part === 'tentacles') list.push('tentacles');
        else if (part === 'shell') list.push('a strong shell');
        else if (part === 'fins') list.push('swimming fins');
      });
    }
    return list;
  }

  // 11. Color & Pattern Phrase
  getColorAndPatternPhrase(monster) {
    const color = monster.color || 'purple';
    const secColor = monster.secondaryColor || monster.color;
    const pattern = monster.pattern;

    if (pattern && pattern !== 'none') {
      if (pattern === 'rainbow') return `${color} with rainbow stripes`;
      return `${color} with ${secColor} ${pattern}`;
    }
    return color;
  }

  // 12. Clothes & Accessories Phrases
  getClothingPhrases(monster) {
    const phrases = [];

    // Special Suit
    if (monster.specialSuit && monster.specialSuit !== 'none') {
      const suits = {
        superhero: 'a superhero suit',
        astronaut: 'an astronaut suit',
        pirate: 'pirate clothes',
        wizard: 'wizard robes',
        royal: 'royal clothes',
        football: 'a football shirt'
      };
      phrases.push(suits[monster.specialSuit] || monster.specialSuit);
    }

    // Tops
    if (monster.clothesTop && monster.clothesTop !== 'none' && (!monster.specialSuit || monster.specialSuit === 'none')) {
      const topName = monster.clothesTop === 'tshirt' ? 'T-shirt' : monster.clothesTop;
      const color = monster.clothesTopColor || 'blue';
      phrases.push(this.withArticle(`${color} ${topName}`));
    }

    // Bottoms
    if (monster.clothesBottom && monster.clothesBottom !== 'none' && (!monster.specialSuit || monster.specialSuit === 'none')) {
      const botName = monster.clothesBottom;
      const color = monster.clothesBottomColor || 'black';
      if (botName === 'trousers' || botName === 'shorts') {
        phrases.push(`${color} ${botName}`);
      } else {
        phrases.push(this.withArticle(`${color} ${botName}`));
      }
    }

    // Shoes
    if (monster.clothesShoes && monster.clothesShoes !== 'none') {
      const shoes = {
        boots: 'boots',
        sneakers: 'sneakers',
        monster_feet: 'monster boots',
        clown_shoes: 'clown shoes'
      };
      phrases.push(shoes[monster.clothesShoes] || monster.clothesShoes);
    }

    // Special items
    if (monster.specialCape) phrases.push(`a ${monster.specialCapeColor || 'red'} cape`);
    if (monster.specialBoots) phrases.push(`${monster.specialBootsColor || 'yellow'} boots`);
    if (monster.specialGloves) phrases.push(`${monster.specialGlovesColor || 'green'} gloves`);

    // Accessories
    if (monster.accessories && Array.isArray(monster.accessories)) {
      monster.accessories.forEach(acc => {
        const accMap = {
          crown: 'a golden crown',
          hat: `a ${monster.accessoryColors?.hat || 'yellow'} hat`,
          cap: `a ${monster.accessoryColors?.cap || 'blue'} cap`,
          wizard_hat: 'a wizard hat',
          pirate_hat: 'a pirate hat',
          helmet: 'a helmet',
          glasses: 'glasses',
          sunglasses: 'cool sunglasses',
          scarf: `a ${monster.accessoryColors?.scarf || 'striped'} scarf`,
          bow: `a ${monster.accessoryColors?.bow || 'pink'} bow`,
          necklace: 'a shiny necklace',
          backpack: 'a backpack',
          earrings: 'earrings'
        };
        if (accMap[acc]) phrases.push(accMap[acc]);
      });
    }

    return phrases;
  }

  // 13. Powers ("It can...")
  getPowersPhrase(monster) {
    if (!monster.powers || monster.powers.length === 0) return null;
    const powerMap = {
      fly: 'fly',
      breathe_fire: 'breathe fire',
      make_ice: 'make ice',
      shoot_lightning: 'shoot lightning',
      invisible: 'become invisible',
      jump_high: 'jump very high',
      swim_fast: 'swim very fast',
      super_strong: 'be super strong',
      magic: 'make magic',
      run_fast: 'run very fast'
    };
    const powerWords = monster.powers.map(p => powerMap[p] || p);
    return this.joinListNaturally(powerWords);
  }

  // 14. Personality ("It is...")
  getPersonalityPhrase(monster) {
    if (!monster.personality || monster.personality.length === 0) return 'friendly';
    return this.joinListNaturally(monster.personality);
  }

  // 15. World ("It lives in...")
  getWorldPhrase(monster) {
    const world = monster.world || 'castle';
    const worldMap = {
      house: 'lives in a house',
      forest: 'lives in a magical forest',
      castle: 'lives in a giant castle',
      volcano: 'lives in a volcano',
      ocean: 'lives in the deep ocean',
      ice_world: 'lives in an ice world',
      moon: 'lives on the moon',
      space: 'lives in outer space',
      jungle: 'lives in a wild jungle',
      cave: 'lives in a mysterious cave'
    };
    return worldMap[world] || `lives in a ${world}`;
  }

  // 16. Food ("It likes...")
  getFoodPhrase(monster) {
    const food = monster.food || 'pizza';
    const foodMap = {
      pizza: 'pizza',
      burgers: 'burgers',
      ice_cream: 'ice cream',
      apples: 'fresh apples',
      fish: 'fish',
      cake: 'delicious cake',
      sandwiches: 'sandwiches',
      chocolate: 'sweet chocolate'
    };
    return foodMap[food] || food;
  }

  // Natural Conjunction Builder
  joinListNaturally(items) {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  // Comprehensive Summary Breakdown Card
  getMonsterSummary(monster) {
    const name = monster.name || 'Zippy';
    const colorDesc = this.getColorAndPatternPhrase(monster);
    const bodyFeatures = [
      this.getBodyShapePhrase(monster),
      this.getEyesPhrase(monster),
      this.getEarsPhrase(monster) !== 'no ears' ? this.getEarsPhrase(monster) : null,
      this.getHornsPhrase(monster),
      this.getMouthPhrase(monster),
      this.getTeethPhrase(monster),
      this.getNosePhrase(monster),
      this.getArmsPhrase(monster) !== 'no arms' ? this.getArmsPhrase(monster) : null,
      this.getLegsPhrase(monster) !== 'no legs' ? this.getLegsPhrase(monster) : null,
      ...this.getSpecialPartsPhrases(monster)
    ].filter(Boolean);

    const clothingItems = this.getClothingPhrases(monster);
    const powers = this.getPowersPhrase(monster);
    const personality = this.getPersonalityPhrase(monster);
    const world = this.getWorldPhrase(monster);
    const food = this.getFoodPhrase(monster);

    return {
      name,
      colorDesc,
      bodyFeatures,
      clothingItems,
      powers,
      personality,
      world,
      food
    };
  }

  // Full Natural A1/A1+ English Paragraph
  getFullDescription(monster) {
    const name = monster.name || 'Zippy';
    const colorPattern = this.getColorAndPatternPhrase(monster);
    const eyes = this.getEyesPhrase(monster);
    const ears = this.getEarsPhrase(monster);
    const horns = this.getHornsPhrase(monster);
    const mouth = this.getMouthPhrase(monster);
    const teeth = this.getTeethPhrase(monster);
    const arms = this.getArmsPhrase(monster);
    const legs = this.getLegsPhrase(monster);
    const specials = this.getSpecialPartsPhrases(monster);
    const clothing = this.getClothingPhrases(monster);
    const powers = this.getPowersPhrase(monster);
    const personality = this.getPersonalityPhrase(monster);
    const world = this.getWorldPhrase(monster);
    const food = this.getFoodPhrase(monster);

    const sentences = [
      `Meet ${name}!`,
      `${name} is ${colorPattern}.`,
      horns ? `It has ${eyes}, ${ears} and ${horns}.` : `It has ${eyes} and ${ears}.`,
      teeth ? `It has ${mouth} and ${teeth}.` : `It has ${mouth}.`,
      `It has ${arms} and ${legs}.`
    ];

    if (specials.length > 0) {
      sentences.push(`It has ${this.joinListNaturally(specials)}.`);
    }

    if (clothing.length > 0) {
      sentences.push(`It is wearing ${this.joinListNaturally(clothing)}.`);
    }

    if (powers) {
      sentences.push(`It can ${powers}.`);
    }

    if (personality) {
      sentences.push(`It is ${personality}.`);
    }

    if (world) {
      sentences.push(`It ${world}.`);
    }

    if (food) {
      sentences.push(`It likes ${food}.`);
    }

    return sentences.join(' ');
  }

  // Teleprompter Step-by-Step Sentences for Speaking Practice
  getSpeakingSentences(monster) {
    const name = monster.name || 'Zippy';
    const colorPattern = this.getColorAndPatternPhrase(monster);
    const eyes = this.getEyesPhrase(monster);
    const ears = this.getEarsPhrase(monster);
    const horns = this.getHornsPhrase(monster);
    const mouth = this.getMouthPhrase(monster);
    const teeth = this.getTeethPhrase(monster);
    const arms = this.getArmsPhrase(monster);
    const legs = this.getLegsPhrase(monster);
    const specials = this.getSpecialPartsPhrases(monster);
    const clothing = this.getClothingPhrases(monster);
    const powers = this.getPowersPhrase(monster);
    const personality = this.getPersonalityPhrase(monster);
    const world = this.getWorldPhrase(monster);
    const food = this.getFoodPhrase(monster);

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
        text: `It is ${colorPattern}.`,
        highlight: colorPattern
      },
      {
        icon: '👁️',
        starter: 'It has...',
        text: `It has ${eyes}.`,
        highlight: eyes
      }
    ];

    if (ears !== 'no ears') {
      steps.push({
        icon: '👂',
        starter: 'It has...',
        text: `It has ${ears}.`,
        highlight: ears
      });
    }

    if (horns) {
      steps.push({
        icon: '🦄',
        starter: 'It has...',
        text: `It has ${horns}.`,
        highlight: horns
      });
    }

    steps.push({
      icon: '👄',
      starter: 'It has...',
      text: teeth ? `It has ${mouth} and ${teeth}.` : `It has ${mouth}.`,
      highlight: mouth
    });

    if (arms !== 'no arms') {
      steps.push({
        icon: '👐',
        starter: 'It has...',
        text: `It has ${arms}.`,
        highlight: arms
      });
    }

    if (legs !== 'no legs') {
      steps.push({
        icon: '🦵',
        starter: 'It has...',
        text: `It has ${legs}.`,
        highlight: legs
      });
    }

    if (specials.length > 0) {
      steps.push({
        icon: '🐉',
        starter: 'It has...',
        text: `It has ${this.joinListNaturally(specials)}.`,
        highlight: specials.join(', ')
      });
    }

    if (clothing.length > 0) {
      clothing.forEach(c => {
        steps.push({
          icon: '👕',
          starter: 'It is wearing...',
          text: `It is wearing ${c}.`,
          highlight: c
        });
      });
    }

    if (powers) {
      steps.push({
        icon: '✨',
        starter: 'It can...',
        text: `It can ${powers}.`,
        highlight: powers
      });
    }

    if (personality) {
      steps.push({
        icon: '❤️',
        starter: 'It is...',
        text: `It is ${personality}.`,
        highlight: personality
      });
    }

    if (world) {
      steps.push({
        icon: '🏠',
        starter: 'It lives in...',
        text: `It ${world}.`,
        highlight: world
      });
    }

    if (food) {
      steps.push({
        icon: '🍕',
        starter: 'It likes...',
        text: `It likes ${food}.`,
        highlight: food
      });
    }

    return steps;
  }
}

window.grammarEngine = new GrammarEngine();
