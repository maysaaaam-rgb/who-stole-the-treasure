/**
 * POKÉMON TRAINER CHALLENGE - PROFESSIONAL CREATURE ENGINE
 * Renders high-definition character artwork across 10 diverse archetypes,
 * with dynamic color tinting, scale transforms, elemental particle auras,
 * and original hybrid name generation.
 */

class CreatureEngine {
  constructor() {
    this.models = {
      dragon: {
        fire: 'assets/images/charizard.png',
        water: 'assets/images/dratini.png',
        fly: 'assets/images/noibat.png',
        strong: 'assets/images/axew.png',
        dig: 'assets/images/gible.png',
        default: 'assets/images/dragonite.png'
      },
      bird: {
        fire: 'assets/images/fletchling.png',
        cute: 'assets/images/torchic.png',
        grass: 'assets/images/rowlet.png',
        wind: 'assets/images/pidgeot.png',
        strong: 'assets/images/rookidee.png',
        default: 'assets/images/rookidee.png'
      },
      aquatic: {
        swim: 'assets/images/lapras.png',
        ice: 'assets/images/vaporeon.png',
        fast: 'assets/images/totodile.png',
        cute: 'assets/images/marill.png',
        water: 'assets/images/squirtle.png',
        default: 'assets/images/squirtle.png'
      },
      cat: {
        fire: 'assets/images/litten.png',
        electric: 'assets/images/shinx.png',
        psychic: 'assets/images/espurr.png',
        water: 'assets/images/vaporeon.png',
        agile: 'assets/images/meowth.png',
        default: 'assets/images/litten.png'
      },
      fox: {
        fire: 'assets/images/fennekin.png',
        electric: 'assets/images/jolteon.png',
        ice: 'assets/images/glaceon.png',
        dark: 'assets/images/zorua.png',
        default: 'assets/images/vulpix.png'
      },
      dinosaur: {
        fire: 'assets/images/fuecoco.png',
        strong: 'assets/images/tyrunt.png',
        earth: 'assets/images/larvitar.png',
        water: 'assets/images/totodile.png',
        default: 'assets/images/charmander.png'
      },
      insect: {
        fly: 'assets/images/butterfree.png',
        strong: 'assets/images/heracross.png',
        fast: 'assets/images/scyther.png',
        electric: 'assets/images/joltik.png',
        default: 'assets/images/butterfree.png'
      },
      robot: {
        electric: 'assets/images/magnemite.png',
        default: 'assets/images/magnemite.png'
      },
      plant: {
        grass: 'assets/images/bulbasaur.png',
        cute: 'assets/images/oddish.png',
        friendly: 'assets/images/chikorita.png',
        earth: 'assets/images/turtwig.png',
        default: 'assets/images/bulbasaur.png'
      },
      cute_round: {
        cute: 'assets/images/jigglypuff.png',
        electric: 'assets/images/dedenne.png',
        water: 'assets/images/marill.png',
        default: 'assets/images/poliwag.png'
      }
    };
  }

  // Select the best matching character image
  selectModelImage(archetype, abilities = [], look = '', size = '') {
    const archModels = this.models[archetype] || this.models.dragon;
    const has = (ab) => abilities.includes(ab);

    if ((has('breathe fire') || has('make fire')) && archModels.fire) return archModels.fire;
    if ((has('make electricity')) && archModels.electric) return archModels.electric;
    if ((has('freeze things') || has('make ice')) && archModels.ice) return archModels.ice;
    if ((has('swim') || has('control water')) && (archModels.water || archModels.swim)) return archModels.water || archModels.swim;
    if ((has('fly') || has('create wind')) && (archModels.fly || archModels.wind)) return archModels.fly || archModels.wind;
    if ((has('control plants')) && (archModels.grass || archModels.plant)) return archModels.grass || archModels.plant;
    if ((has('dig') || has('move rocks')) && (archModels.earth || archModels.dig)) return archModels.earth || archModels.dig;
    if ((has('become invisible') || has('see in the dark')) && archModels.dark) return archModels.dark;

    if (look === 'cute' && archModels.cute) return archModels.cute;
    if (look === 'strong' && archModels.strong) return archModels.strong;
    if (look === 'friendly' && archModels.friendly) return archModels.friendly;

    return archModels.default || 'assets/images/pikachu.png';
  }

  // Generate an evocative hybrid Pokémon name
  generateName(archetype, abilities = []) {
    const prefixes = {
      'breathe fire': ['Pyro', 'Ignis', 'Blaze', 'Cinder', 'Flame'],
      'make electricity': ['Volt', 'Spark', 'Zap', 'Thunder', 'Bolt'],
      'freeze things': ['Glacio', 'Frost', 'Arctic', 'Blizzard', 'Ice'],
      'swim': ['Aqua', 'Hydro', 'Tide', 'Ocean', 'Wave'],
      'control water': ['Tsunami', 'Torrent', 'Aqua', 'Splash'],
      'fly': ['Aero', 'Zephyr', 'Sky', 'Gale', 'Wing'],
      'create wind': ['Vortex', 'Cyclone', 'Gale', 'Storm'],
      'control plants': ['Flora', 'Leaf', 'Bloom', 'Verdant', 'Thorn'],
      'dig': ['Terra', 'Geo', 'Quake', 'Burrow', 'Digger'],
      'move rocks': ['Titan', 'Bolder', 'Crag', 'Stone'],
      'become invisible': ['Shadow', 'Phantom', 'Ghost', 'Spectra'],
      'make light': ['Solar', 'Nova', 'Lumen', 'Radiant', 'Starlight'],
      'run fast': ['Sonic', 'Flash', 'Swift', 'Speedy'],
      'jump high': ['Bounce', 'Spring', 'Leap', 'Hopper']
    };

    const suffixes = {
      dragon: ['Drake', 'Draco', 'Wyrm', 'Fang', 'Dragon'],
      bird: ['Gryph', 'Wing', 'Rook', 'Feather', 'Falcon'],
      aquatic: ['Fin', 'Tide', 'Gill', 'Shell', 'Maris'],
      cat: ['Claw', 'Lynx', 'Paw', 'Whisk', 'Feline'],
      fox: ['Kitsune', 'Vulp', 'Fox', 'Tail', 'Fenn'],
      dinosaur: ['Rex', 'Saur', 'Titan', 'Dino', 'Bronto'],
      insect: ['Beetle', 'Moth', 'Scout', 'Stinger', 'Bug'],
      robot: ['Mech', 'Bot', 'Core', 'Steel', 'Gear'],
      plant: ['Bloom', 'Sprout', 'Vine', 'Bud', 'Thorn'],
      cute_round: ['Puff', 'Mite', 'Orb', 'Pip', 'Ball']
    };

    const primaryAb = abilities[0];
    const prefixOptions = (primaryAb && prefixes[primaryAb]) || ['Nova', 'Apex', 'Star', 'Alpha', 'Super'];
    const suffixOptions = suffixes[archetype] || ['Mon', 'Beast'];

    const p = prefixOptions[Math.floor(Math.random() * prefixOptions.length)];
    const s = suffixOptions[Math.floor(Math.random() * suffixOptions.length)];

    return `${p}-${s}`;
  }

  // Create a creature object
  create(config) {
    const archetype = config.archetype || 'dragon';
    const size = config.size || 'big';
    const color = config.color || 'blue';
    const look = config.look || 'friendly';
    const features = config.features || 'wings';
    const abilities = config.abilities && config.abilities.length ? config.abilities : ['fly', 'breathe fire'];

    const image = this.selectModelImage(archetype, abilities, look, size);
    const name = config.name || this.generateName(archetype, abilities);

    const scaleMap = {
      tiny: 0.70,
      small: 0.85,
      big: 1.08,
      huge: 1.30
    };
    const scale = scaleMap[size] || 1.0;

    return {
      name,
      archetype,
      size,
      scale,
      color,
      look,
      features,
      abilities,
      image,
      renderCardHTML: (opts = {}) => this.renderHTMLCard(name, image, config, scale, opts)
    };
  }

  // Render complete, grounded character stage
  renderHTMLCard(name, imagePath, config, scale, opts = {}) {
    const abilities = config.abilities || [];
    const isMirrored = opts.isMirrored || false;
    const flipClass = isMirrored ? 'creature-flip' : '';

    const colorFilterStyle = this.getColorFilter(config.color);

    return `
      <div class="creature-display-stage" style="--creature-scale: ${scale};">
        <div class="creature-ground-shadow"></div>
        <img src="${imagePath}" alt="${name}" class="creature-stage-sprite ${flipClass}" style="${colorFilterStyle}">
        ${this.renderAuraLayer(abilities)}
      </div>
    `;
  }

  // Dynamic CSS filter matching student's chosen color
  getColorFilter(colorName) {
    switch (colorName) {
      case 'red':
        return 'filter: drop-shadow(0 15px 25px rgba(239, 68, 68, 0.6)) hue-rotate(-25deg) saturate(1.3);';
      case 'blue':
        return 'filter: drop-shadow(0 15px 25px rgba(56, 189, 248, 0.6)) hue-rotate(170deg) saturate(1.2);';
      case 'green':
        return 'filter: drop-shadow(0 15px 25px rgba(34, 197, 94, 0.6)) hue-rotate(85deg) saturate(1.25);';
      case 'yellow':
        return 'filter: drop-shadow(0 15px 25px rgba(234, 179, 8, 0.6)) hue-rotate(20deg) saturate(1.4);';
      case 'purple':
        return 'filter: drop-shadow(0 15px 25px rgba(168, 85, 247, 0.6)) hue-rotate(240deg) saturate(1.3);';
      case 'black':
        return 'filter: drop-shadow(0 15px 25px rgba(15, 23, 42, 0.9)) brightness(0.7) contrast(1.3);';
      case 'white':
        return 'filter: drop-shadow(0 15px 25px rgba(255, 255, 255, 0.8)) brightness(1.25) contrast(0.9);';
      default:
        return 'filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.45));';
    }
  }

  renderAuraLayer(abilities) {
    let aura = '';
    if (abilities.includes('breathe fire') || abilities.includes('make fire')) {
      aura += `<div class="aura-fx fire-aura"><span class="flame-e f1">🔥</span><span class="flame-e f2">🔥</span></div>`;
    }
    if (abilities.includes('make electricity')) {
      aura += `<div class="aura-fx electric-aura"><span class="spark-e s1">⚡</span><span class="spark-e s2">⚡</span></div>`;
    }
    if (abilities.includes('freeze things')) {
      aura += `<div class="aura-fx ice-aura"><span class="frost-e r1">❄️</span><span class="frost-e r2">❄️</span></div>`;
    }
    if (abilities.includes('fly') || abilities.includes('create wind')) {
      aura += `<div class="aura-fx wind-aura"><span class="wind-e w1">🌪️</span><span class="wind-e w2">🪽</span></div>`;
    }
    if (abilities.includes('control plants')) {
      aura += `<div class="aura-fx plant-aura"><span class="plant-e p1">🌱</span><span class="plant-e p2">🍃</span></div>`;
    }
    if (abilities.includes('make light')) {
      aura += `<div class="aura-fx light-aura"><span class="light-e l1">✨</span><span class="light-e l2">🌟</span></div>`;
    }
    return aura;
  }
}

const creatures = new CreatureEngine();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CreatureEngine;
}
