/**
 * POKÉMON TRAINER BATTLE - PROFESSIONAL CREATURE ENGINE
 * Renders complete, full-body, professional Pokémon character art
 * across 10 anatomical creature bases (Fox, Cat, Rabbit, Turtle, Dragon,
 * Bird, Wolf, Frog, Dinosaur, Mouse) with dynamic elemental auras,
 * scales, ground shadows, and original naming.
 */

class CreatureEngine {
  constructor() {
    this.models = {
      fox: {
        electric: 'assets/images/jolteon.png',
        fire: 'assets/images/fennekin.png',
        ice: 'assets/images/glaceon.png',
        invisible: 'assets/images/zorua.png',
        default: 'assets/images/vulpix.png'
      },
      cat: {
        fire: 'assets/images/litten.png',
        electric: 'assets/images/shinx.png',
        water: 'assets/images/vaporeon.png',
        invisible: 'assets/images/espurr.png',
        default: 'assets/images/meowth.png'
      },
      rabbit: {
        fire: 'assets/images/scorbunny.png',
        electric: 'assets/images/plusle.png',
        jump: 'assets/images/buneary.png',
        default: 'assets/images/raboot.png'
      },
      turtle: {
        fire: 'assets/images/torkoal.png',
        water: 'assets/images/squirtle.png',
        huge: 'assets/images/drednaw.png',
        dig: 'assets/images/turtwig.png',
        default: 'assets/images/chewtle.png'
      },
      dragon: {
        huge: 'assets/images/dragonite.png',
        swim: 'assets/images/dratini.png',
        fly: 'assets/images/noibat.png',
        dig: 'assets/images/gible.png',
        strong: 'assets/images/axew.png',
        default: 'assets/images/bagon.png'
      },
      bird: {
        fire: 'assets/images/fletchling.png',
        cute: 'assets/images/torchic.png',
        friendly: 'assets/images/rowlet.png',
        strong: 'assets/images/rookidee.png',
        default: 'assets/images/pidgey.png'
      },
      wolf: {
        electric: 'assets/images/electrike.png',
        fire: 'assets/images/growlithe.png',
        scary: 'assets/images/houndour.png',
        fast: 'assets/images/riolu.png',
        default: 'assets/images/rockruff.png'
      },
      frog: {
        fast: 'assets/images/greninja.png',
        scary: 'assets/images/croagunk.png',
        cute: 'assets/images/poliwag.png',
        default: 'assets/images/froakie.png'
      },
      dinosaur: {
        fire: 'assets/images/fuecoco.png',
        huge: 'assets/images/tyrunt.png',
        swim: 'assets/images/totodile.png',
        dig: 'assets/images/larvitar.png',
        default: 'assets/images/charmander.png'
      },
      mouse: {
        electric: 'assets/images/pikachu.png',
        fire: 'assets/images/cyndaquil.png',
        swim: 'assets/images/marill.png',
        cute: 'assets/images/dedenne.png',
        default: 'assets/images/pawmi.png'
      }
    };
  }

  // Select the best matching high-definition creature render
  selectModelImage(base, abilities = [], personality = '', power = '', size = '') {
    const baseModels = this.models[base] || this.models.fox;
    const has = (ab) => abilities.includes(ab);

    if (has('make electricity') && baseModels.electric) return baseModels.electric;
    if (has('make fire') && baseModels.fire) return baseModels.fire;
    if (has('make ice') && baseModels.ice) return baseModels.ice;
    if (has('swim') && baseModels.water) return baseModels.water;
    if (has('swim') && baseModels.swim) return baseModels.swim;
    if (has('fly') && baseModels.fly) return baseModels.fly;
    if (has('jump') && baseModels.jump) return baseModels.jump;
    if (has('dig') && baseModels.dig) return baseModels.dig;
    if (has('become invisible') && baseModels.invisible) return baseModels.invisible;

    if (size === 'huge' && baseModels.huge) return baseModels.huge;
    if (power === 'strong' && baseModels.strong) return baseModels.strong;
    if (power === 'fast' && baseModels.fast) return baseModels.fast;
    if (personality === 'cute' && baseModels.cute) return baseModels.cute;
    if (personality === 'scary' && baseModels.scary) return baseModels.scary;
    if (personality === 'friendly' && baseModels.friendly) return baseModels.friendly;

    return baseModels.default;
  }

  // Generate an evocative hybrid original creature name
  generateName(base, config) {
    const baseNames = {
      fox: ['Kitsune', 'Vulpix', 'Fenn', 'Fox', 'Tail'],
      cat: ['Feline', 'Claw', 'Lynx', 'Paw', 'Whisk'],
      rabbit: ['Bunny', 'Hare', 'Hopper', 'Raboot', 'Lapin'],
      turtle: ['Tortoise', 'Shell', 'Chew', 'Kame', 'Shield'],
      dragon: ['Draco', 'Drake', 'Wyrm', 'Dragon', 'Fang'],
      bird: ['Gryph', 'Rook', 'Feather', 'Wing', 'Talon'],
      wolf: ['Lupin', 'Howler', 'Fang', 'Wolf', 'Hound'],
      frog: ['Croak', 'Ribbit', 'Froak', 'Grog', 'Tad'],
      dinosaur: ['Saur', 'Rex', 'Titan', 'Dino', 'Bronto'],
      mouse: ['Mite', 'Squeak', 'Paw', 'Mouse', 'Rodent']
    };

    const elementPrefixes = {
      'make fire': ['Pyro', 'Ignis', 'Blaze', 'Cinder', 'Flame'],
      'make electricity': ['Volt', 'Spark', 'Zap', 'Thunder', 'Bolt'],
      'make ice': ['Glacio', 'Frost', 'Arctic', 'Blizzard', 'Ice'],
      'swim': ['Aqua', 'Hydro', 'Tide', 'Wave', 'Ocean'],
      'fly': ['Zephyr', 'Aero', 'Sky', 'Gale', 'Breeze'],
      'become invisible': ['Shadow', 'Phantom', 'Spectra', 'Ghost', 'Mystic'],
      'dig': ['Terra', 'Geo', 'Quake', 'Boulder', 'Rock'],
      'run fast': ['Sonic', 'Flash', 'Dash', 'Swift', 'Speed'],
      'change colour': ['Prism', 'Rainbow', 'Chroma', 'Kaleido', 'Color']
    };

    const personalityModifiers = {
      cute: 'Puff',
      scary: 'Bane',
      friendly: 'Heart',
      funny: 'Wobble',
      brave: 'Valor'
    };

    // Primary element
    const primaryAb = config.abilities && config.abilities[0];
    const prefixList = (primaryAb && elementPrefixes[primaryAb]) || ['Nova', 'Apex', 'Star', 'Super'];
    const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];

    const baseList = baseNames[base] || ['Mon'];
    const basePart = baseList[Math.floor(Math.random() * baseList.length)];

    return `${prefix}-${basePart}`;
  }

  // Create a complete creature object
  create(config, trainerName = "Trainer") {
    const base = config.base || 'fox';
    const size = config.size || 'big';
    const personality = config.personality || 'brave';
    const power = config.power || 'strong';
    const abilities = config.abilities || ['make fire', 'fly'];

    const imagePath = this.selectModelImage(base, abilities, personality, power, size);
    const name = this.generateName(base, config);

    // Scale calculation
    const scaleMap = {
      tiny: 0.70,
      small: 0.85,
      big: 1.08,
      huge: 1.30
    };
    const scale = scaleMap[size] || 1.0;

    return {
      trainer: trainerName,
      base: base,
      name: name,
      image: imagePath,
      size: size,
      scale: scale,
      personality: personality,
      power: power,
      abilities: abilities,
      hp: 100,
      maxHp: 100,
      points: 0,
      // Helper to render HTML card
      renderHTML: (options = {}) => this.renderHTMLCard(name, imagePath, config, scale, options)
    };
  }

  // Render complete character card with grounded shadow and dynamic elemental aura
  renderHTMLCard(name, imagePath, config, scale, options = {}) {
    const abilities = config.abilities || [];
    const isP2 = options.isPlayer2 || false;
    const flipClass = isP2 ? 'creature-flip-x' : '';

    const has = (ab) => abilities.includes(ab);

    let auraClass = '';
    if (has('make fire')) auraClass += ' aura-fire';
    if (has('make electricity')) auraClass += ' aura-electric';
    if (has('make ice')) auraClass += ' aura-ice';
    if (has('swim')) auraClass += ' aura-water';
    if (has('fly')) auraClass += ' aura-fly';
    if (has('become invisible')) auraClass += ' aura-invisible';
    if (has('change colour')) auraClass += ' aura-rainbow';

    return `
      <div class="creature-display-stage ${auraClass}" style="--creature-scale: ${scale};">
        <div class="creature-ground-shadow"></div>
        <img src="${imagePath}" alt="${name}" class="creature-fullbody-img ${flipClass}">
        ${this.renderElementalEffects(abilities)}
      </div>
    `;
  }

  renderElementalEffects(abilities) {
    let effects = '';
    if (abilities.includes('make fire')) {
      effects += `
        <div class="element-effect-layer fire-embers">
          <span class="ember e1">🔥</span>
          <span class="ember e2">🔥</span>
          <span class="ember e3">✨</span>
        </div>
      `;
    }
    if (abilities.includes('make electricity')) {
      effects += `
        <div class="element-effect-layer electric-sparks">
          <span class="spark s1">⚡</span>
          <span class="spark s2">⚡</span>
          <span class="spark s3">✨</span>
        </div>
      `;
    }
    if (abilities.includes('make ice')) {
      effects += `
        <div class="element-effect-layer ice-frost">
          <span class="frost f1">❄️</span>
          <span class="frost f2">❄️</span>
          <span class="frost f3">✨</span>
        </div>
      `;
    }
    if (abilities.includes('fly')) {
      effects += `
        <div class="element-effect-layer wind-swirls">
          <span class="wind w1">🌪️</span>
          <span class="wind w2">🪽</span>
        </div>
      `;
    }
    return effects;
  }
}

const creatures = new CreatureEngine();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CreatureEngine;
}
