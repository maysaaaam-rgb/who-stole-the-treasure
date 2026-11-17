/* Games Collection · built-in picture sets.
   Every card: { w: word shown & spoken, cl: optional sentence clue, img: picture path from the site root }.
   Teachers make or customize sets in the Studio (saved on this device). */
(function (root) {
  'use strict';
  var GM = 'game-maker/art/';
  var EG = 'assets/egypt-book/';
  var AR = 'assets/unit3-arctic/';
  var U5G4 = 'review-g4-sound-detectives/img/';
  var U5TC = 'review-g3-time-capsule/img/';
  var U5TB = 'review-g3-time-book/img/';
  var DINO = 'assets/packs/characters/';

  root.KIT_PACKS = [
    {
      id: 'g3-u5-time-book', name: 'Let\'s Go Back! (G3 U5)', sub: 'Grade 3 · Unit 5 · Egypt & Time Capsules', grade: '3', e: '🏺',
      cards: [
        { w: 'pharaoh', cl: 'A king of ancient Egypt', img: U5TB + 'pharaoh.webp' },
        { w: 'chariot', cl: 'A fast cart pulled by horses', img: U5TB + 'chariot.webp' },
        { w: 'glasses', cl: 'Jannah wore these on her eyes', img: U5TB + 'glasses.webp' },
        { w: 'guards', cl: 'They protected the palace', img: U5TB + 'guards.webp' },
        { w: 'time capsule', cl: 'A box of objects saved for the future', img: U5TC + 'capsule.webp' },
        { w: 'spacecraft', cl: 'It flies through space', img: U5TC + 'spacecraft.webp' },
        { w: 'Earth', cl: 'The blue planet we live on', img: U5TC + 'earth.webp' },
        { w: 'coins', cl: 'Round metal money', img: U5TC + 'coins.webp' },
        { w: 'newspaper', cl: 'People read the news on it', img: U5TC + 'newspaper.webp' },
        { w: 'letter', cl: 'A message written on paper', img: U5TC + 'letter.webp' },
        { w: 'pyramid', cl: 'A giant stone triangle in Egypt', img: EG + 'egypt_pyramid.webp' },
        { w: 'surprised', cl: 'How the old woman felt!', img: U5TB + 'surprised.webp' }
      ]
    },
    {
      id: 'g4-u5-sound', name: 'Make Some Noise! (G4 U5)', sub: 'Grade 4 · Unit 5 · Foley & Beethoven', grade: '4', e: '🎬',
      cards: [
        { w: 'foley artist', cl: 'Makes movie sound effects in a studio', img: U5G4 + 'foley-artist.webp' },
        { w: 'coconuts', cl: 'Clapped together to sound like horse footsteps!', img: U5G4 + 'coconuts.webp' },
        { w: 'orchestra', cl: 'Many musicians playing together', img: U5G4 + 'orchestra.webp' },
        { w: 'composer', cl: 'A person who writes music', img: U5G4 + 'composer.webp' },
        { w: 'piano', cl: 'Beethoven played this instrument', img: U5G4 + 'beethoven-piano.webp' },
        { w: 'drum', cl: 'Hit it to make a loud beat', img: U5G4 + 'drum.webp' },
        { w: 'metal sheet', cl: 'Shaken to make the sound of thunder!', img: U5G4 + 'metal-sheet.webp' },
        { w: 'lettuce', cl: 'Used by sound artists for crunchy sounds', img: U5G4 + 'lettuce.webp' },
        { w: 'wooden shoes', cl: 'Tap them on the floor for footsteps', img: U5G4 + 'wooden-shoes.webp' },
        { w: 'swords', cl: 'Clashing metal in a knight movie', img: U5G4 + 'swords.webp' },
        { w: 'concert hall', cl: 'Where the audience listens to music', img: U5G4 + 'concert-hall.webp' },
        { w: 'whisper', cl: 'Speak very, very quietly', img: U5G4 + 'whisper-girl.webp' }
      ]
    },
    {
      id: 'my-things', name: 'My Things', sub: 'Toys & everyday objects', grade: 'All', e: '🎈',
      cards: [
        { w: 'ball', cl: 'Kick it into the goal!', img: GM + 'o_football.webp' },
        { w: 'balloon', cl: 'It floats up in the air', img: GM + 'o_balloon_red.webp' },
        { w: 'dice', cl: 'Roll it to get a number from 1 to 6', img: GM + 'o_dice.webp' },
        { w: 'slide', cl: 'Climb up and wheee down at the park', img: GM + 'o_slide.webp' },
        { w: 'ladder', cl: 'Use it to climb up high', img: GM + 'o_ladder.webp' },
        { w: 'hammer', cl: 'Tap nails into wood with it', img: GM + 'o_hammer.webp' },
        { w: 'present', cl: 'A wrapped surprise with a ribbon', img: GM + 'pu_gift.webp' },
        { w: 'flag', cl: 'Waves at the finish line', img: GM + 'o_finish_flag.webp' },
        { w: 'lantern', cl: 'Shines warm light in the dark', img: GM + 'o_candle_lantern.webp' },
        { w: 'magnet', cl: 'Pulls metal things toward it', img: GM + 'pu_magnet.webp' },
        { w: 'yarn', cl: 'Soft ball of wool for kittens', img: GM + 'o_yarn.webp' },
        { w: 'bone', cl: 'A puppy\'s favourite treat', img: GM + 'o_bone.webp' }
      ]
    },
    {
      id: 'animals', name: 'Animal Friends', sub: 'Pets & wild animals', grade: 'All', e: '🐾',
      cards: [
        { w: 'cat', cl: 'Says meow and chases yarn', img: GM + 'c_cat_ready.webp' },
        { w: 'dog', cl: 'Wags its tail and barks', img: GM + 'c_dog_ready.webp' },
        { w: 'shark', cl: 'Big ocean swimmer with sharp teeth', img: GM + 'pu_shark.webp' },
        { w: 'horse', cl: 'Gallops fast across the field', img: U5G4 + 'horse.webp' },
        { w: 'eagle', cl: 'Flies high with huge wings', img: U5G4 + 'eagle.webp' },
        { w: 'polar bear', cl: 'Big white bear on the Arctic ice', img: AR + 'c_bear.png' },
        { w: 'fish', cl: 'Swims under the water', img: AR + 'o_fish.png' },
        { w: 'beetle', cl: 'Shiny little six-legged insect', img: EG + 'o_egypt_b.webp' }
      ]
    },
    {
      id: 'dinosaurs', name: 'Dinosaur Park', sub: 'Prehistoric giants · Grade 3 & 4', grade: 'All', e: '🦖',
      cards: [
        { w: 'T-Rex', cl: 'King of the dinosaurs with tiny arms', img: DINO + 'trex.png' },
        { w: 'Triceratops', cl: 'Has three horns and a big neck shield', img: DINO + 'triceratops.png' },
        { w: 'Stegosaurus', cl: 'Has big plates along its back', img: DINO + 'stegosaurus.png' },
        { w: 'Brachiosaurus', cl: 'Super long neck to eat tall leaves', img: DINO + 'brachiosaurus.png' },
        { w: 'Ankylosaurus', cl: 'Armoured dinosaur with a club tail', img: DINO + 'ankylosaurus.png' },
        { w: 'Velociraptor', cl: 'Fast, clever feathered runner', img: DINO + 'raptor.png' }
      ]
    },
    {
      id: 'adventure', name: 'Adventure & Space', sub: 'Travel, treasure & planets', grade: 'All', e: '🚀',
      cards: [
        { w: 'rocket', cl: 'Blasts off to the stars!', img: GM + 'pu_rocket.webp' },
        { w: 'planet', cl: 'Orbits around a star with rings', img: GM + 'o_space_b.webp' },
        { w: 'pirate ship', cl: 'Sails across the seven seas', img: GM + 'o_pirates_b.webp' },
        { w: 'treasure', cl: 'A chest full of golden coins', img: GM + 'o_pirates_a.webp' },
        { w: 'star', cl: 'Twinkles brightly in the night sky', img: GM + 'pu_star.webp' },
        { w: 'train', cl: 'Chugs along the railway tracks', img: AR + 'o_train.png' },
        { w: 'boat', cl: 'Floats down the River Nile', img: EG + 'egypt_boat.webp' },
        { w: 'knight', cl: 'Wears shiny silver armour', img: U5G4 + 'knight.webp' }
      ]
    },
    {
      id: 'g3-u3-arctic', name: 'The Bear and I', sub: 'Grade 3 · Unit 3 · The Arctic', grade: '3', e: '🐻‍❄️',
      cards: [
        { w: 'polar bear', cl: 'Lives on the snow and ice', img: AR + 'c_bear.png' },
        { w: 'explorer', cl: 'Travels across the frozen north', img: AR + 'c_man.png' },
        { w: 'fish', cl: 'Swims under the ice hole', img: AR + 'o_fish.png' },
        { w: 'train', cl: 'Rides through the snowy mountains', img: AR + 'o_train.png' },
        { w: 'factory', cl: 'A big building with tall chimneys', img: AR + 'o_factory.png' },
        { w: 'gate', cl: 'Opens and closes in the fence', img: AR + 'o_gate.png' },
        { w: 'trap', cl: 'Watch out — don\'t step in it!', img: AR + 'o_trap.png' },
        { w: 'thin ice', cl: 'Careful, it might crack!', img: AR + 'o_ice_thin.png' }
      ]
    },
    {
      id: 'spooky', name: 'Spooky Night', sub: 'Fun Halloween words', grade: 'All', e: '🎃',
      cards: [
        { w: 'pumpkin', cl: 'Orange lantern with a funny face', img: GM + 'c_pumpkin.webp' },
        { w: 'ghost', cl: 'Says BOO and floats through walls!', img: GM + 'c_ghost.webp' },
        { w: 'bat', cl: 'Flies at night and sleeps upside down', img: GM + 'c_bat.webp' },
        { w: 'spider', cl: 'Spins a silky web with eight legs', img: GM + 'o_spider.webp' },
        { w: 'cauldron', cl: 'Bubbling magic potion pot', img: GM + 'o_cauldron.webp' },
        { w: 'lantern', cl: 'Glowing candle in the dark', img: GM + 'o_candle_lantern.webp' }
      ]
    }
  ];
})(window);
