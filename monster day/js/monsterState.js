/**
 * monsterState.js - Centralized Monster State Management Store
 * "Build Your Own Monster!"
 * Single source of truth for all monster attributes with validation and state listeners.
 */

class MonsterState {
  constructor() {
    this.listeners = [];
    this.monster = this.getDefaultState();
  }

  getDefaultState() {
    return {
      name: 'Zippy',
      body: 'round', // 'round', 'tall', 'short', 'wide', 'thin', 'blob', 'ghost', 'dinosaur', 'robot'
      color: 'purple', // 'green', 'purple', 'blue', 'red', 'orange', 'yellow', 'pink', 'black', 'white'
      secondaryColor: 'yellow',
      pattern: 'none', // 'none', 'spots', 'stripes', 'stars', 'hearts', 'dots', 'zigzags', 'rainbow'
      
      // Head & Face
      eyes: {
        count: 2, // 1, 2, 3, 4, 'many'
        size: 'big', // 'tiny', 'small', 'big', 'giant'
        style: 'round' // 'round', 'star', 'heart', 'sleepy', 'happy', 'angry', 'surprised', 'funny'
      },
      ears: {
        count: 2, // 0, 1, 2, 4
        style: 'long' // 'tiny', 'small', 'long', 'floppy', 'pointy', 'round', 'animal'
      },
      horns: {
        count: 0, // 0, 1, 2, 4
        style: 'curly' // 'tiny', 'big', 'curly', 'pointy', 'spiral'
      },
      nose: 'small', // 'none', 'tiny', 'small', 'big', 'long', 'round', 'funny'
      mouth: 'big', // 'tiny', 'small', 'big', 'huge', 'smiling', 'happy', 'surprised', 'scary'
      teeth: 'none', // 'none', 'small', 'big', 'sharp', 'vampire', 'giant'
      expression: 'happy', // shortcut preset

      // Limbs
      arms: {
        count: 2, // 0, 1, 2, 3, 4, 'many'
        length: 'normal' // 'tiny', 'short', 'normal', 'long', 'super_long'
      },
      hands: 'normal', // 'normal', 'tiny', 'giant', 'claws', 'three_fingers', 'four_fingers'
      legs: {
        count: 2 // 0, 1, 2, 3, 4, 'many'
      },
      feet: 'normal', // 'tiny', 'normal', 'big', 'giant', 'claws', 'bird', 'monster'

      // Special Body Parts (multi-combinable)
      specialParts: {
        wings: 'none', // 'none', 'dragon', 'butterfly', 'bat'
        tail: 'none', // 'none', 'long', 'curly', 'dinosaur', 'snake', 'bunny'
        spikes: false,
        fins: false,
        tentacles: false,
        shell: false
      },

      // Clothes & Outfits
      clothes: {
        outfit: 'none', // 'none', 'dress', 'superhero', 'astronaut', 'pirate', 'wizard', 'royal', 'football'
        top: 'none', // 'none', 'tshirt', 'shirt', 'jacket', 'hoodie', 'sweater'
        topColor: 'blue',
        bottom: 'none', // 'none', 'trousers', 'shorts', 'skirt'
        bottomColor: 'black',
        shoes: 'none', // 'none', 'boots', 'sneakers', 'clown_shoes', 'monster_feet'
        shoesColor: 'yellow',
        cape: false,
        capeColor: 'red'
      },

      // Accessories (Multi-select list)
      accessories: [], // 'hat', 'cap', 'crown', 'wizard_hat', 'pirate_hat', 'helmet', 'glasses', 'sunglasses', 'scarf', 'bow', 'necklace', 'backpack', 'earrings'
      accessoryColors: {
        hat: 'yellow',
        cap: 'blue',
        scarf: 'red',
        bow: 'pink'
      },

      // Creative Story & English Attributes
      powers: [], // 'fly', 'breathe_fire', 'make_ice', 'shoot_lightning', 'invisible', 'jump_high', 'swim_fast', 'super_strong', 'magic', 'run_fast'
      personality: [], // 'friendly', 'funny', 'scary', 'angry', 'happy', 'sleepy', 'crazy', 'shy', 'strong', 'clever'
      world: 'castle', // 'house', 'forest', 'castle', 'volcano', 'ocean', 'ice_world', 'moon', 'space', 'jungle', 'cave'
      food: 'pizza' // 'pizza', 'burgers', 'ice cream', 'apples', 'fish', 'cake', 'sandwiches', 'chocolate'
    };
  }

  get() {
    return this.monster;
  }

  set(newMonster) {
    this.monster = JSON.parse(JSON.stringify(newMonster));
    this.notify();
  }

  reset() {
    this.monster = this.getDefaultState();
    this.notify();
  }

  update(mutator) {
    if (typeof mutator === 'function') {
      mutator(this.monster);
    }
    this.notify();
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const copy = JSON.parse(JSON.stringify(this.monster));
    this.listeners.forEach(fn => {
      try {
        fn(copy);
      } catch (err) {
        console.error('MonsterState listener error:', err);
      }
    });
  }

  // Quick Setter Helpers with Validation
  setBodyShape(shape) {
    this.monster.body = shape;
    this.notify();
  }

  setMainColor(col) {
    this.monster.color = col;
    this.notify();
  }

  setSecondaryColor(col) {
    this.monster.secondaryColor = col;
    this.notify();
  }

  setPattern(pat) {
    this.monster.pattern = pat;
    this.notify();
  }

  setEyesCount(count) {
    this.monster.eyes.count = count;
    this.notify();
  }

  setEyesSize(size) {
    this.monster.eyes.size = size;
    this.notify();
  }

  setEyesStyle(style) {
    this.monster.eyes.style = style;
    this.notify();
  }

  setEarsCount(count) {
    this.monster.ears.count = count;
    this.notify();
  }

  setEarsStyle(style) {
    this.monster.ears.style = style;
    this.notify();
  }

  setHornsCount(count) {
    this.monster.horns.count = count;
    this.notify();
  }

  setHornsStyle(style) {
    this.monster.horns.style = style;
    this.notify();
  }

  setNoseStyle(style) {
    this.monster.nose = style;
    this.notify();
  }

  setMouthType(type) {
    this.monster.mouth = type;
    this.notify();
  }

  setTeethType(type) {
    this.monster.teeth = type;
    this.notify();
  }

  setArmsCount(count) {
    this.monster.arms.count = count;
    this.notify();
  }

  setArmsLength(length) {
    this.monster.arms.length = length;
    this.notify();
  }

  setHandsStyle(style) {
    this.monster.hands = style;
    this.notify();
  }

  setLegsCount(count) {
    this.monster.legs.count = count;
    this.notify();
  }

  setFeetStyle(style) {
    this.monster.feet = style;
    this.notify();
  }

  setSpecialWings(wings) {
    this.monster.specialParts.wings = wings;
    this.notify();
  }

  setSpecialTail(tail) {
    this.monster.specialParts.tail = tail;
    this.notify();
  }

  toggleSpecialExtra(extra) {
    if (this.monster.specialParts[extra] !== undefined) {
      this.monster.specialParts[extra] = !this.monster.specialParts[extra];
      this.notify();
    }
  }

  setSpecialOutfit(outfit) {
    this.monster.clothes.outfit = outfit;
    // When a full outfit is set, tops and bottoms are replaced
    if (outfit !== 'none') {
      this.monster.clothes.top = 'none';
      this.monster.clothes.bottom = 'none';
    }
    this.notify();
  }

  setClothesTop(top) {
    this.monster.clothes.top = top;
    if (top !== 'none') {
      this.monster.clothes.outfit = 'none';
    }
    this.notify();
  }

  setClothesBottom(bottom) {
    this.monster.clothes.bottom = bottom;
    if (bottom !== 'none') {
      this.monster.clothes.outfit = 'none';
    }
    this.notify();
  }

  setClothesShoes(shoes) {
    this.monster.clothes.shoes = shoes;
    this.notify();
  }

  toggleAccessory(acc) {
    if (!Array.isArray(this.monster.accessories)) this.monster.accessories = [];
    const idx = this.monster.accessories.indexOf(acc);
    if (idx > -1) {
      this.monster.accessories.splice(idx, 1);
    } else {
      this.monster.accessories.push(acc);
    }
    this.notify();
  }

  togglePower(power) {
    if (!Array.isArray(this.monster.powers)) this.monster.powers = [];
    const idx = this.monster.powers.indexOf(power);
    if (idx > -1) {
      this.monster.powers.splice(idx, 1);
    } else {
      this.monster.powers.push(power);
    }
    this.notify();
  }

  togglePersonality(trait) {
    if (!Array.isArray(this.monster.personality)) this.monster.personality = [];
    const idx = this.monster.personality.indexOf(trait);
    if (idx > -1) {
      this.monster.personality.splice(idx, 1);
    } else {
      this.monster.personality.push(trait);
    }
    this.notify();
  }

  setWorld(world) {
    this.monster.world = world;
    this.notify();
  }

  setFood(food) {
    this.monster.food = food;
    this.notify();
  }

  setName(name) {
    this.monster.name = name.trim() || 'Zippy';
    this.notify();
  }

  setExpression(expr) {
    this.monster.expression = expr;
    switch (expr) {
      case 'happy':
        this.monster.eyes.style = 'happy';
        this.monster.mouth = 'smiling';
        break;
      case 'angry':
        this.monster.eyes.style = 'angry';
        this.monster.mouth = 'scary';
        break;
      case 'sleepy':
        this.monster.eyes.style = 'sleepy';
        this.monster.mouth = 'small';
        break;
      case 'surprised':
        this.monster.eyes.style = 'surprised';
        this.monster.mouth = 'surprised';
        break;
      case 'silly':
        this.monster.eyes.style = 'funny';
        this.monster.mouth = 'huge';
        break;
      case 'scary':
        this.monster.eyes.style = 'angry';
        this.monster.mouth = 'scary';
        this.monster.teeth = 'sharp';
        break;
    }
    this.notify();
  }
}

window.monsterStore = new MonsterState();
