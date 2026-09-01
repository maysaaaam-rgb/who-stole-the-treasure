/**
 * grammarEngine.js - Pedagogical A1/A1+ English Grammar Engine for "Build Your Own Monster!"
 * Generates natural sentences, sentence starters, speaking teleprompter steps, and breakdown summaries.
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

  withArticle(word, defaultArticle = 'a') {
    if (!word) return '';
    const clean = word.trim();
    const first = clean.toLowerCase()[0];
    const article = ['a', 'e', 'i', 'o', 'u'].includes(first) ? 'an' : defaultArticle;
    return `${article} ${clean}`;
  }

  joinListNaturally(items) {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  // Universal Normalizer to handle both nested and flat monster structures cleanly
  normalize(raw) {
    if (window.monsterRenderer && typeof window.monsterRenderer.normalize === 'function') {
      return window.monsterRenderer.normalize(raw);
    }
    return raw;
  }

  // 1. Body Shape
  getBodyShapePhrase(raw) {
    const m = this.normalize(raw);
    return this.withArticle(`${m.body} body`);
  }

  // 2. Eyes Phrase
  getEyesPhrase(raw) {
    const m = this.normalize(raw);
    const count = m.eyes.count;
    const size = m.eyes.size || 'big';
    const style = m.eyes.style && m.eyes.style !== 'round' ? `${m.eyes.style} ` : '';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'eye' : 'eyes';
    return `${numWord} ${size} ${style}${noun}`;
  }

  // 3. Ears Phrase
  getEarsPhrase(raw) {
    const m = this.normalize(raw);
    const count = m.ears.count;
    if (count === 0) return 'no ears';
    const style = m.ears.style || 'long';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'ear' : 'ears';
    return `${numWord} ${style} ${noun}`;
  }

  // 4. Horns Phrase
  getHornsPhrase(raw) {
    const m = this.normalize(raw);
    const count = m.horns.count;
    if (count === 0) return null;
    const style = m.horns.style || 'curly';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'horn' : 'horns';
    return `${numWord} ${style} ${noun}`;
  }

  // 5. Mouth Phrase
  getMouthPhrase(raw) {
    const m = this.normalize(raw);
    const type = m.mouth || 'big';
    return this.withArticle(`${type} mouth`);
  }

  // 6. Teeth Phrase
  getTeethPhrase(raw) {
    const m = this.normalize(raw);
    const type = m.teeth;
    if (!type || type === 'none') return null;
    if (type === 'giant') return 'one giant tooth';
    if (type === 'vampire') return 'sharp vampire teeth';
    return `${type} teeth`;
  }

  // 7. Nose Phrase
  getNosePhrase(raw) {
    const m = this.normalize(raw);
    const style = m.nose;
    if (!style || style === 'none') return null;
    if (style === 'funny') return 'a funny monster nose';
    return this.withArticle(`${style} nose`);
  }

  // 8. Arms & Hands Phrase
  getArmsPhrase(raw) {
    const m = this.normalize(raw);
    const count = m.arms.count;
    if (count === 0) return 'no arms';
    const length = m.arms.length === 'super_long' ? 'super long' : (m.arms.length || 'normal');
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'arm' : 'arms';

    let handText = '';
    if (m.hands && m.hands !== 'normal') {
      if (m.hands === 'claws') handText = ' with sharp claws';
      else if (m.hands === 'three_fingers') handText = ' with 3 fingers';
      else if (m.hands === 'four_fingers') handText = ' with 4 fingers';
      else if (m.hands === 'giant') handText = ' with giant hands';
      else if (m.hands === 'tiny') handText = ' with tiny hands';
    }

    return `${numWord} ${length} ${noun}${handText}`;
  }

  // 9. Legs & Feet Phrase
  getLegsPhrase(raw) {
    const m = this.normalize(raw);
    const count = m.legs.count;
    if (count === 0 || m.body === 'ghost') return 'no legs';
    const numWord = this.numberWords[count] || count;
    const noun = count === 1 ? 'leg' : 'legs';

    let footText = '';
    if (m.feet && m.feet !== 'normal') {
      if (m.feet === 'claws') footText = ' and sharp claws';
      else if (m.feet === 'bird') footText = ' and bird feet';
      else if (m.feet === 'monster') footText = ' and monster feet';
      else if (m.feet === 'giant') footText = ' and giant feet';
      else if (m.feet === 'tiny') footText = ' and tiny feet';
    }

    return `${numWord} ${noun}${footText}`;
  }

  // 10. Special Body Parts (Wings, Tails, Spikes, Fins, Tentacles, Shell)
  getSpecialPartsPhrases(raw) {
    const m = this.normalize(raw);
    const list = [];
    if (m.specialParts.wings && m.specialParts.wings !== 'none') {
      list.push(`${m.specialParts.wings} wings`);
    }
    if (m.specialParts.tail && m.specialParts.tail !== 'none') {
      list.push(this.withArticle(`${m.specialParts.tail} tail`));
    }
    if (m.specialParts.spikes) list.push('sharp spikes');
    if (m.specialParts.tentacles) list.push('tentacles');
    if (m.specialParts.shell) list.push('a strong shell');
    if (m.specialParts.fins) list.push('swimming fins');
    return list;
  }

  // 11. Color & Pattern Phrase
  getColorAndPatternPhrase(raw) {
    const m = this.normalize(raw);
    const color = m.color || 'purple';
    const secColor = m.secondaryColor || 'yellow';
    const pattern = m.pattern;

    if (pattern && pattern !== 'none') {
      if (pattern === 'rainbow') return `${color} with rainbow stripes`;
      return `${color} with ${secColor} ${pattern}`;
    }
    return color;
  }

  // 12. Clothes & Accessories Phrases
  getClothingPhrases(raw) {
    const m = this.normalize(raw);
    const phrases = [];

    // Full Outfits
    if (m.clothes.outfit && m.clothes.outfit !== 'none') {
      const suits = {
        dress: 'a pink dress',
        superhero: 'a superhero suit',
        astronaut: 'an astronaut suit',
        pirate: 'pirate clothes',
        wizard: 'wizard robes',
        royal: 'royal clothes',
        football: 'a football shirt'
      };
      phrases.push(suits[m.clothes.outfit] || m.clothes.outfit);
    }

    // Tops
    if (m.clothes.top && m.clothes.top !== 'none' && (!m.clothes.outfit || m.clothes.outfit === 'none')) {
      const topName = m.clothes.top === 'tshirt' ? 'T-shirt' : m.clothes.top;
      const color = m.clothes.topColor || 'blue';
      phrases.push(this.withArticle(`${color} ${topName}`));
    }

    // Bottoms
    if (m.clothes.bottom && m.clothes.bottom !== 'none' && (!m.clothes.outfit || m.clothes.outfit === 'none')) {
      const botName = m.clothes.bottom;
      const color = m.clothes.bottomColor || 'black';
      if (botName === 'trousers' || botName === 'shorts') {
        phrases.push(`${color} ${botName}`);
      } else {
        phrases.push(this.withArticle(`${color} ${botName}`));
      }
    }

    // Shoes
    if (m.clothes.shoes && m.clothes.shoes !== 'none') {
      const shoes = {
        boots: 'boots',
        sneakers: 'sneakers',
        clown_shoes: 'clown shoes',
        monster_feet: 'monster boots'
      };
      phrases.push(shoes[m.clothes.shoes] || m.clothes.shoes);
    }

    // Cape
    if (m.clothes.cape) phrases.push(`a ${m.clothes.capeColor || 'red'} cape`);

    // Accessories
    if (m.accessories && Array.isArray(m.accessories)) {
      m.accessories.forEach(acc => {
        const accMap = {
          crown: 'a golden crown',
          hat: `a ${m.accessoryColors?.hat || 'yellow'} hat`,
          cap: `a ${m.accessoryColors?.cap || 'blue'} cap`,
          wizard_hat: 'a wizard hat',
          pirate_hat: 'a pirate hat',
          helmet: 'a helmet',
          glasses: 'glasses',
          sunglasses: 'cool sunglasses',
          scarf: `a ${m.accessoryColors?.scarf || 'red'} scarf`,
          bow: `a ${m.accessoryColors?.bow || 'pink'} bow`,
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
  getPowersPhrase(raw) {
    const m = this.normalize(raw);
    if (!m.powers || m.powers.length === 0) return null;
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
    const translated = m.powers.map(p => powerMap[p] || p);
    return this.joinListNaturally(translated);
  }

  // 14. Personality ("It is...")
  getPersonalityPhrase(raw) {
    const m = this.normalize(raw);
    if (!m.personality || m.personality.length === 0) return null;
    return this.joinListNaturally(m.personality);
  }

  // 15. World ("It lives in...")
  getWorldPhrase(raw) {
    const m = this.normalize(raw);
    const worldMap = {
      house: 'lives in a cozy house',
      forest: 'lives in a magical forest',
      castle: 'lives in a giant castle',
      volcano: 'lives in a fiery volcano',
      ocean: 'lives in the deep ocean',
      ice_world: 'lives in an ice world',
      moon: 'lives on the moon',
      space: 'lives in outer space',
      jungle: 'lives in the wild jungle',
      cave: 'lives in a dark cave'
    };
    return worldMap[m.world] || `lives in a ${m.world}`;
  }

  // 16. Food ("It likes...")
  getFoodPhrase(raw) {
    const m = this.normalize(raw);
    return m.food || 'pizza';
  }

  // ==========================================
  // COMPLETE A1/A1+ PARAGRAPH GENERATOR
  // ==========================================
  getFullDescription(raw) {
    const m = this.normalize(raw);
    const name = m.name || 'Zippy';
    const sentences = [];

    // 1. Introduction & Color/Pattern
    sentences.push(`Meet ${name}!`);
    sentences.push(`${name} is ${this.getColorAndPatternPhrase(m)}.`);

    // 2. Eyes, Ears, Horns
    const headParts = [this.getEyesPhrase(m), this.getEarsPhrase(m)];
    const horns = this.getHornsPhrase(m);
    if (horns) headParts.push(horns);
    sentences.push(`It has ${this.joinListNaturally(headParts)}.`);

    // 3. Mouth, Teeth, Nose
    const mouth = this.getMouthPhrase(m);
    const teeth = this.getTeethPhrase(m);
    const nose = this.getNosePhrase(m);
    const faceParts = [mouth];
    if (teeth) faceParts.push(teeth);
    if (nose) faceParts.push(nose);
    sentences.push(`It has ${this.joinListNaturally(faceParts)}.`);

    // 4. Arms & Legs
    sentences.push(`It has ${this.getArmsPhrase(m)} and ${this.getLegsPhrase(m)}.`);

    // 5. Special Parts (Wings, Tails, Spikes, Fins, Tentacles, Shell)
    const specials = this.getSpecialPartsPhrases(m);
    if (specials.length > 0) {
      sentences.push(`It has ${this.joinListNaturally(specials)}.`);
    }

    // 6. Clothes & Accessories
    const clothing = this.getClothingPhrases(m);
    if (clothing.length > 0) {
      sentences.push(`It is wearing ${this.joinListNaturally(clothing)}.`);
    }

    // 7. Powers ("It can...")
    const powers = this.getPowersPhrase(m);
    if (powers) {
      sentences.push(`It can ${powers}.`);
    }

    // 8. Personality ("It is...")
    const personality = this.getPersonalityPhrase(m);
    if (personality) {
      sentences.push(`It is ${personality}.`);
    }

    // 9. World ("It lives in...")
    sentences.push(`It ${this.getWorldPhrase(m)}.`);

    // 10. Food ("It likes...")
    sentences.push(`It likes ${this.getFoodPhrase(m)}.`);

    return sentences.join(' ');
  }

  // ==========================================
  // STRUCTURED SUMMARY BREAKDOWN
  // ==========================================
  getMonsterSummary(raw) {
    const m = this.normalize(raw);
    const bodyFeatures = [
      this.getBodyShapePhrase(m),
      this.getEyesPhrase(m),
      this.getEarsPhrase(m)
    ];

    const horns = this.getHornsPhrase(m);
    if (horns) bodyFeatures.push(horns);

    bodyFeatures.push(this.getMouthPhrase(m));

    const teeth = this.getTeethPhrase(m);
    if (teeth) bodyFeatures.push(teeth);

    const nose = this.getNosePhrase(m);
    if (nose) bodyFeatures.push(nose);

    bodyFeatures.push(this.getArmsPhrase(m));
    bodyFeatures.push(this.getLegsPhrase(m));

    const specials = this.getSpecialPartsPhrases(m);
    specials.forEach(s => bodyFeatures.push(s));

    return {
      name: m.name || 'Zippy',
      colorDesc: this.getColorAndPatternPhrase(m),
      bodyFeatures,
      clothingItems: this.getClothingPhrases(m),
      powers: this.getPowersPhrase(m),
      personality: this.getPersonalityPhrase(m),
      world: this.getWorldPhrase(m),
      food: this.getFoodPhrase(m)
    };
  }

  // ==========================================
  // SPEAKING TELEPROMPTER STEPS
  // ==========================================
  getSpeakingSentences(raw) {
    const m = this.normalize(raw);
    const name = m.name || 'Zippy';
    const steps = [];

    steps.push({
      starter: 'This is...',
      text: `This is ${name}.`,
      icon: '👹'
    });

    steps.push({
      starter: 'It is...',
      text: `It is ${this.getColorAndPatternPhrase(m)}.`,
      icon: '🎨'
    });

    steps.push({
      starter: 'It has...',
      text: `It has ${this.getEyesPhrase(m)} and ${this.getEarsPhrase(m)}.`,
      icon: '👁️'
    });

    const horns = this.getHornsPhrase(m);
    if (horns) {
      steps.push({
        starter: 'It has...',
        text: `It has ${horns}.`,
        icon: '🦄'
      });
    }

    const mouth = this.getMouthPhrase(m);
    const teeth = this.getTeethPhrase(m);
    steps.push({
      starter: 'It has...',
      text: `It has ${mouth}${teeth ? ` and ${teeth}` : ''}.`,
      icon: '👄'
    });

    steps.push({
      starter: 'It has...',
      text: `It has ${this.getArmsPhrase(m)} and ${this.getLegsPhrase(m)}.`,
      icon: '👐'
    });

    const specials = this.getSpecialPartsPhrases(m);
    if (specials.length > 0) {
      steps.push({
        starter: 'It has...',
        text: `It has ${this.joinListNaturally(specials)}.`,
        icon: '🐉'
      });
    }

    const clothes = this.getClothingPhrases(m);
    if (clothes.length > 0) {
      steps.push({
        starter: 'It is wearing...',
        text: `It is wearing ${this.joinListNaturally(clothes)}.`,
        icon: '👕'
      });
    }

    const powers = this.getPowersPhrase(m);
    if (powers) {
      steps.push({
        starter: 'It can...',
        text: `It can ${powers}.`,
        icon: '✨'
      });
    }

    const personality = this.getPersonalityPhrase(m);
    if (personality) {
      steps.push({
        starter: 'It is...',
        text: `It is ${personality}.`,
        icon: '❤️'
      });
    }

    steps.push({
      starter: 'It lives in...',
      text: `It ${this.getWorldPhrase(m)}.`,
      icon: '🏠'
    });

    steps.push({
      starter: 'It likes...',
      text: `It likes ${this.getFoodPhrase(m)}.`,
      icon: '🍕'
    });

    return steps;
  }
}

window.grammarEngine = new GrammarEngine();
