/* Alice Tea Party: which blueprint pages each prop needs, and what to use from home when there is no blueprint.
   Shared by the blueprints page and the Tea Party HQ. */
(function (root) {
  'use strict';
  var MAP = { 'a paper key': ['key'], 'a big key': ['key'], 'a big paper hat': ['hat1', 'hat2'], 'a tall hat': ['hat1', 'hat2'], 'a green hat': ['hat1', 'hat2'], 'a paper watch': ['watch'], 'a letter': ['letter'],
    'a paper crown': ['crown'], 'a red paper crown': ['crown'], 'a small bottle': ['tag'], 'long paper ears': ['strip', 'ears_rabbit'], 'a carrot': ['carrot'], 'cat ears': ['strip', 'ears_cat'], 'a big smile': ['smile'],
    'dog ears': ['strip', 'ears_dog'], 'a paper bone': ['bone'], 'a playing card': ['card'], 'paper wings': ['wings'], 'a toy sword': ['sword'], 'paper claws': ['claws'], 'a book': ['book'], 'a flower': ['flower'],
    'a big button': ['button'], 'a button': ['button'], 'a small bell': ['bell'], 'blue paper antennae': ['strip', 'antennae'], 'a mushroom': ['mushroom'], 'a walking stick': ['stick'], 'mouse ears': ['strip', 'ears_mouse'],
    'a paper shell': ['shell'], 'a pearl': ['pearl'] };
  var TITLES = {strip: 'Headband strips', ears_rabbit: 'Long ears (rabbit and hare)', ears_cat: 'Pointed ears (cat)', ears_dog: 'Floppy ears (dog)', ears_mouse: 'Round ears (mouse)', crown: 'Crown (2 pieces)', antennae: 'Antennae', hat1: 'Hat: the tube (page 1 of 2)', hat2: 'Hat: the brim (page 2 of 2)', wings: 'Wings (print 2 pages)', claws: 'Claws (10)', shell: 'Shell (cut 2)', carrot: 'Carrot cone + leaves', smile: 'Big smile', key: 'Key', watch: 'Pocket watch', letter: 'Letter', card: 'Playing card', bone: 'Bone', button: 'Big button', flower: 'Flower', sword: 'Toy sword (card only)', book: 'Book', stick: 'Walking stick', pearl: 'Pearl', bell: 'Bell', mushroom: 'Mushroom', tag: 'Bottle tag'};
  var HOME = { 'a teacup': 'a real cup or a paper cup', 'a teapot': 'a teapot from home or the classroom', 'a ball of yarn': 'a ball of wool (or rolled-up paper)', 'a nice hat': 'any hat from home',
    'a plate of cake': 'a paper plate with a paper cake', 'a green coat': 'any green jacket', 'a small cup': 'a paper cup', 'a tiny cup': 'a small paper cup' };
  /* prop text -> picture in assets/alice-cut/props (no picture = emoji) */
  var PICS = {
    'a paper key': 'prop_key', 'a teacup': 'prop_teacup', 'a big paper hat': 'prop_hat_big', 'a teapot': 'prop_teapot', 'a paper watch': 'prop_watch', 'a letter': 'prop_letter',
    'a paper crown': 'prop_crown_white', 'a small bottle': 'prop_bottle', 'long paper ears': 'prop_ears_hare', 'a carrot': 'prop_carrot', 'cat ears': 'prop_ears_cat',
    'a ball of yarn': 'prop_yarn', 'dog ears': 'prop_ears_dog', 'a paper bone': 'prop_bone', 'a red paper crown': 'prop_crown_red', 'a playing card': 'prop_card',
    'paper wings': 'prop_wings', 'a toy sword': 'prop_sword_toy', 'paper claws': 'prop_claws', 'a big key': 'prop_key_big', 'a book': 'prop_book', 'a flower': 'prop_flower',
    'a nice hat': 'prop_hat_nice', 'a plate of cake': 'prop_cake_plate', 'a big button': 'prop_button', 'a green hat': 'prop_hat_green', 'a small bell': 'prop_bell',
    'blue paper antennae': 'prop_antennae', 'a mushroom': 'prop_mushroom', 'a tall hat': 'prop_hat_tall', 'a walking stick': 'prop_stick', 'a green coat': 'prop_coat_green',
    'a button': 'prop_button', 'mouse ears': 'prop_ears_mouse', 'a small cup': 'prop_cup_tiny', 'a tiny cup': 'prop_cup_tiny', 'a paper shell': 'prop_shell', 'a pearl': 'prop_pearl'
  };
  function pagesFor(roleProps) { var out = []; (roleProps || []).forEach(function (t) { (MAP[t] || []).forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); }); }); return out; }
  root.PROPS_MAP = { map: MAP, titles: TITLES, home: HOME, pics: PICS, pagesFor: pagesFor };
})(window);
