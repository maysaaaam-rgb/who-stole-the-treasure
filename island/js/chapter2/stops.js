/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 2 Bespoke Stop Adventures (Stops 1–5)
   (island/js/chapter2/stops.js -> registers `BayWorld.stops[1..5]`)
   - Grade 3 (Macmillan Global Readings 2 · Unit 2: "Thank You", pp. 24–39):
       Stop 1: Chuseok Harvest Feast Galley (`songpyeon`, `harvest`, `festival`, `feast`, `ancestors`)
       Stop 2: Moonlight Weaving Loom & Gratitude Lanterns (`weave`, `cloth`, `contest`, `"I am thankful for..."`)
       Stop 3: Mars First Harvest Greenhouse (`potatoes`, `pineapple`, `pick`, `"There is / There are"`)
       Stop 4: Coral Pier `-st` Blend Fishing (`harvest, feast, contest, first, best, fast` + `"Why? Because..."`)
       Stop 5: Spyglass Lighthouse & Silver's Coral Chest (Setting: Korea vs Mars + Unit 2 Mastery)
   - Grade 4 (Macmillan Global Readings 3 · Unit 2: "What Lives Here?", pp. 24–39):
       Stop 1: Twin Forest Biome Pavilion (`deciduous`, `coniferous`, `evergreen`, `needle`, `cone`, `biome`)
       Stop 2: Winter Adaptation Trail (`hibernate`, `adapt`, `survive`, `"so they can + verb"`)
       Stop 3: Kind Swallow Hillside Cottage (`swallow`, `roof`, `vet`, `slingshot`, `hit`, `paid` + Author's Purpose)
       Stop 4: Coral Pier `ai` Long-A Sails & Past Irregulars (`rain, main, tail, paid, sailed` + `fell, built, grew, gave`)
       Stop 5: Spyglass Lighthouse & Silver's Coral Chest (Biomes & Folktale Mastery)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var BW = root.BayWorld;
  if (!BW) return;

  var FLAT = 'art/flat/';
  var CH2 = 'art/ch2/';
  var Z2 = 'art/z2/';

  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var P = function () { return root.Ch2Progress; };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ──Curriculum Banks for Stops 1–5 (Grade 3 & Grade 4) ── */
  var DATA = {
    3: {
      1: {
        title: 'Stop 1 · Chuseok Harvest Feast Pavilion',
        bg: CH2 + 'bg_ch2_s1_galley.webp',
        npc: { name: 'Lulu', img: FLAT + 'c_lulu_happy.webp' },
        slots: ['🥮 Songpyeon', '🌾 Harvest', '🏮 Ancestors', '🍲 Feast'],
        rounds: [
          {
            speaker: 'Lulu · Harvest Feast',
            img: CH2 + 'o_songpyeon.webp',
            ask: 'In Korea\'s Chuseok festival, families steam sweet half-moon rice cakes! What are they called?',
            ok: { t: 'Delicious songpyeon rice cakes!', img: CH2 + 'o_songpyeon.webp' },
            no: [
              { t: 'Cold winter pinecones.', img: Z2 + 'w_cone.webp' },
              { t: 'Broken robot gears.', img: 'art/z1/o_gear.webp' }
            ]
          },
          {
            speaker: 'Lulu · Harvest Time',
            img: Z2 + 'w_harvest.webp',
            ask: 'Farmers gather ripe grains, apples, and pears in autumn. What do we call gathering crops?',
            ok: { t: 'The autumn harvest!', img: Z2 + 'w_harvest.webp' },
            no: [
              { t: 'A messy bedroom.', img: 'art/z1/w_mess.webp' },
              { t: 'A snowy hibernation.', img: Z2 + 's_winter_fur.webp' }
            ]
          },
          {
            speaker: 'Long John Silver',
            img: Z2 + 's_thankful_family.webp',
            ask: 'During Chuseok, families travel home to honor grandparents and family members from long ago. Who are they?',
            ok: { t: 'They thank their ancestors!', img: Z2 + 's_thankful_family.webp' },
            no: [
              { t: 'They chase white rabbits.', img: 'art/z1/w_chase.webp' },
              { t: 'They build a parachute.', img: 'art/z1/w_invent.webp' }
            ]
          },
          {
            speaker: 'Lulu · Big Celebration',
            img: Z2 + 's_harvest_festival.webp',
            ask: 'Everyone sits together around a table full of delicious food! What is a big special meal called?',
            ok: { t: 'A joyful harvest feast!', img: Z2 + 'w_delicious.webp' },
            no: [
              { t: 'An empty bookshelf.', img: 'art/z1/w_shelf.webp' },
              { t: 'A tiny fishing hook.', img: Z2 + 'o_fishing_rod.webp' }
            ]
          }
        ]
      },
      2: {
        title: 'Stop 2 · Moonlight Weaving Loom & Gratitude',
        bg: CH2 + 'bg_ch2_s2_moon.webp',
        npc: { name: 'Lulu', img: FLAT + 'c_lulu_happy.webp' },
        slots: ['🧵 Weave Cloth', '🏆 Contest', '🌕 Full Moon', '💛 Thankful'],
        rounds: [
          {
            speaker: 'Lulu · Moonlight Loom',
            img: CH2 + 'o_loom.webp',
            ask: 'Long ago during Chuseok, teams crossed threads on a wooden loom! What did they make?',
            ok: { t: 'They weave warm cloth!', img: CH2 + 'o_loom.webp' },
            no: [
              { t: 'They freeze in the snow.', img: 'art/z1/w_freeze.webp' },
              { t: 'They sweep with a broom.', img: 'art/z1/w_broom.webp' }
            ]
          },
          {
            speaker: 'Lulu · Friendly Race',
            img: Z2 + 's_harvest_festival.webp',
            ask: 'Two teams raced under the bright moon to see who could weave the most cloth! What is that called?',
            ok: { t: 'An exciting weaving contest!', img: CH2 + 'o_loom.webp' },
            no: [
              { t: 'A quiet nap at noon.', img: 'art/z1/w_sleep.webp' },
              { t: 'A broken compass.', img: FLAT + 'o_compass.webp' }
            ]
          },
          {
            speaker: 'Lulu · Bright Sky',
            img: Z2 + 's_full_moon.webp',
            ask: 'Look up at the night sky during the harvest festival! Families make wishes on the big...',
            ok: { t: 'The bright full moon!', img: Z2 + 'w_moon.webp' },
            no: [
              { t: 'The rainy umbrella.', img: 'art/z1/s_z1_storm.webp' },
              { t: 'The classroom clock.', img: FLAT + 'o_compass.webp' }
            ]
          },
          {
            speaker: 'Lulu · Saying Thank You',
            img: Z2 + 'w_thankful.webp',
            ask: 'Choose the best sentence to share gratitude at our lantern circle:',
            ok: { t: 'I am thankful for my family and delicious food!', img: Z2 + 's_thankful_food.webp' },
            no: [
              { t: 'I am messy for my mirror.', img: 'art/z1/w_mirror.webp' },
              { t: 'There is three potatoes.', img: Z2 + 'w_potatoes.webp' }
            ]
          }
        ]
      },
      3: {
        title: 'Stop 3 · First Harvest Indoor Farm',
        bg: CH2 + 'bg_ch2_s3_forest.webp',
        npc: { name: 'Jim Hawkins', img: FLAT + 'c_jim_happy.webp' },
        slots: ['🥔 Potatoes', '🍍 Pineapple', '✋ Pick Crops', '🧺 There is / are'],
        rounds: [
          {
            speaker: 'Jim · Mars Greenhouse',
            img: Z2 + 's_potatoes_soil.webp',
            ask: 'In the story "First Harvest", a family lives on rocky Mars and grows food inside a greenhouse! What grows under the soil?',
            ok: { t: 'There are fresh potatoes in the soil!', img: Z2 + 'w_potatoes.webp' },
            no: [
              { t: 'There are starfish in the soil.', img: FLAT + 'o_starfish.webp' },
              { t: 'There is a pirate ship.', img: FLAT + 'o_hispaniola.webp' }
            ]
          },
          {
            speaker: 'Jim · Sweet Surprise',
            img: Z2 + 'w_pineapple.webp',
            ask: 'Look! Only ONE golden tropical fruit grew in the special pot! Choose "There is" or "There are":',
            ok: { t: 'There is one sweet pineapple!', img: Z2 + 'w_pineapple.webp' },
            no: [
              { t: 'There are one sweet pineapple.', img: Z2 + 'w_cone.webp' },
              { t: 'It cleans the messy room.', img: 'art/z1/w_broom.webp' }
            ]
          },
          {
            speaker: 'Lulu · Harvest Basket',
            img: Z2 + 's_plant_grew.webp',
            ask: 'When the vegetables and fruits are ripe and ready, what do the children do gently with their hands?',
            ok: { t: 'They pick the ripe crops for the feast!', img: Z2 + 's_thankful_food.webp' },
            no: [
              { t: 'They throw soil on the roof.', img: 'art/z1/w_mess.webp' },
              { t: 'They hibernate all winter.', img: Z2 + 's_winter_fur.webp' }
            ]
          },
          {
            speaker: 'Jim · Grammar Check',
            img: Z2 + 'w_delicious.webp',
            ask: 'Look at the table with FOUR bowls of soup and SIX apples! Which sentence is right?',
            ok: { t: 'There are four bowls and six apples!', img: Z2 + 's_thankful_food.webp' },
            no: [
              { t: 'There is four bowls.', img: Z2 + 'w_baking_tool.webp' },
              { t: 'Where is a songpyeon?', img: CH2 + 'o_songpyeon.webp' }
            ]
          }
        ]
      },
      4: {
        title: 'Stop 4 · Coral Pier -st Blend Fishing',
        bg: CH2 + 'bg_ch2_s4_pier.webp',
        npc: { name: 'Long John Silver', img: FLAT + 'c_silver_happy.webp' },
        slots: ['🎣 harve-ST', '🎣 fea-ST', '🎣 conte-ST', '🎣 fir-ST & be-ST'],
        rounds: [
          {
            speaker: 'Silver · Cast Your Line!',
            img: Z2 + 'o_fishing_rod.webp',
            ask: 'Reel in the -ST fish! Which word ends with -ST and means gathering autumn crops?',
            ok: { t: 'harve-ST! Harvest!', img: Z2 + 'w_harvest.webp' },
            no: [
              { t: 'moon! Full moon!', img: Z2 + 'w_moon.webp' },
              { t: 'cloth! Warm cloth!', img: CH2 + 'o_loom.webp' }
            ]
          },
          {
            speaker: 'Silver · Second Catch!',
            img: Z2 + 'o_fish.webp',
            ask: 'Splash! Catch the -ST word that means a big, delicious celebration meal!',
            ok: { t: 'fea-ST! A big feast!', img: Z2 + 'w_delicious.webp' },
            no: [
              { t: 'potato! Brown potato!', img: Z2 + 'w_potatoes.webp' },
              { t: 'pick! Pick a fruit!', img: Z2 + 'w_pineapple.webp' }
            ]
          },
          {
            speaker: 'Silver · Third Catch!',
            img: Z2 + 's_z2_fish.webp',
            ask: 'Catch the pair where BOTH words end with the -ST blend!',
            ok: { t: 'first and best! (-st)', img: FLAT + 'subj_trophy.webp' },
            no: [
              { t: 'weave and moon', img: CH2 + 'o_loom.webp' },
              { t: 'clean and clock', img: FLAT + 'o_compass.webp' }
            ]
          },
          {
            speaker: 'Lulu · Why & Because',
            img: Z2 + 's_thankful_teacher.webp',
            ask: 'Answer with BECAUSE! "Why do families celebrate the First Harvest?"',
            ok: { t: 'Because they are thankful for fresh food!', img: Z2 + 'w_thankful.webp' },
            no: [
              { t: 'First, draw a machine.', img: 'art/z1/w_plan.webp' },
              { t: 'In the dusty corner.', img: 'art/z1/w_hide.webp' }
            ]
          }
        ]
      },
      5: {
        title: 'Stop 5 · Spyglass Lighthouse & Coral Chest',
        bg: CH2 + 'bg_ch2_s5_lighthouse.webp',
        npc: { name: 'Long John Silver', img: FLAT + 'c_silver_happy.webp' },
        slots: ['🏮 Lock 1: Setting', '🏮 Lock 2: Mars Setting', '🏮 Lock 3: Gratitude', '🏮 Lock 4: -st Master'],
        rounds: [
          {
            speaker: 'Silver · Lighthouse Lock 1',
            img: Z2 + 's_harvest_festival.webp',
            ask: 'Setting tells WHERE and WHEN! What is the setting of the Chuseok festival reading?',
            ok: { t: 'In Korea, in autumn under the full moon!', img: Z2 + 's_full_moon.webp' },
            no: [
              { t: 'Under the icy ocean in winter.', img: Z2 + 'o_fish.webp' },
              { t: 'Inside a rabbit hole.', img: 'art/z1/s_alice_fall.webp' }
            ]
          },
          {
            speaker: 'Silver · Lighthouse Lock 2',
            img: Z2 + 's_potatoes_soil.webp',
            ask: 'Compare the second story! Where does "First Harvest" take place?',
            ok: { t: 'Inside a greenhouse dome on Planet Mars!', img: Z2 + 's_plant_grew.webp' },
            no: [
              { t: 'On a wooden loom in a contest.', img: CH2 + 'o_loom.webp' },
              { t: 'In Clara\'s messy bedroom.', img: 'art/z1/s_mess_room.webp' }
            ]
          },
          {
            speaker: 'Lulu · Lighthouse Lock 3',
            img: Z2 + 's_gave_gift.webp',
            ask: 'Both Chuseok in Korea and First Harvest on Mars share ONE big message! What is it?',
            ok: { t: 'Sharing food together and being thankful!', img: Z2 + 'w_thankful.webp' },
            no: [
              { t: 'Building fast bullet trains.', img: 'art/z1/w_wheels.webp' },
              { t: 'Hiding treasure in a cave.', img: 'art/z1/w_hide.webp' }
            ]
          },
          {
            speaker: 'Silver · Final Beacon Lock!',
            img: Z2 + 'o_lighthouse_on.webp',
            ask: 'Light the Lighthouse Beacon! Pick the sentence with correct grammar AND an -ST word:',
            ok: { t: 'There is a delicious feast at the harvest festival!', img: CH2 + 'o_songpyeon.webp' },
            no: [
              { t: 'There are one songpyeon cake.', img: Z2 + 'w_baking_tool.webp' },
              { t: 'Why thankful because moon.', img: Z2 + 'w_moon.webp' }
            ]
          }
        ]
      }
    },

    /* ═══════════════════════════════════════════════════════════
       GRADE 4 — Global Readings 3 · Unit 2: "What Lives Here?"
       ═══════════════════════════════════════════════════════════ */
    4: {
      1: {
        title: 'Stop 1 · Two Different Forests Biome Pavilion',
        bg: CH2 + 'bg_ch2_s3_forest.webp',
        npc: { name: 'Dr. Livesey', img: FLAT + 'c_livesey_happy.webp' },
        slots: ['🍂 Deciduous', '🌲 Coniferous', '🪡 Waxy Needles', '🌍 Forest Biome'],
        rounds: [
          {
            speaker: 'Dr. Livesey · Biome Explorer',
            img: Z2 + 's_forest_animals.webp',
            ask: 'In "Two Different Forests", trees with broad flat leaves turn gold and drop their leaves in autumn! What kind of forest is that?',
            ok: { t: 'A deciduous forest!', img: Z2 + 's_go_outside.webp' },
            no: [
              { t: 'A coral reef ocean.', img: Z2 + 'o_fish.webp' },
              { t: 'A sandy desert dune.', img: FLAT + 'o_shell.webp' }
            ]
          },
          {
            speaker: 'Dr. Livesey · Evergreen Pines',
            img: Z2 + 's_pine_cones.webp',
            ask: 'The second forest stays green all winter and grows seeds inside woody cones! What kind of forest is it?',
            ok: { t: 'A coniferous evergreen forest!', img: Z2 + 'w_cone.webp' },
            no: [
              { t: 'A messy indoor workshop.', img: 'art/z1/w_mess.webp' },
              { t: 'A tropical pineapple farm.', img: Z2 + 'w_pineapple.webp' }
            ]
          },
          {
            speaker: 'Lulu · Leaf Detective',
            img: Z2 + 'w_needles.webp',
            ask: 'Why don\'t coniferous pine trees lose their water in freezing snowy winters?',
            ok: { t: 'They have thin, waxy needles instead of wide leaves!', img: Z2 + 'w_needles.webp' },
            no: [
              { t: 'They wear wool waistcoats.', img: 'art/z1/w_chase.webp' },
              { t: 'They fly south like butterflies.', img: 'art/z1/s_butterflies.webp' }
            ]
          },
          {
            speaker: 'Dr. Livesey · Science Term',
            img: Z2 + 's_beaver_home.webp',
            ask: 'What science word names a large natural region with its own climate, plants, and wildlife?',
            ok: { t: 'A biome!', img: Z2 + 's_forest_animals.webp' },
            no: [
              { t: 'A slingshot!', img: FLAT + 'o_compass.webp' },
              { t: 'A bookshelf!', img: 'art/z1/w_shelf.webp' }
            ]
          }
        ]
      },
      2: {
        title: 'Stop 2 · Winter Adaptation Trail',
        bg: CH2 + 'bg_ch2_s2_moon.webp',
        npc: { name: 'Lulu', img: FLAT + 'c_lulu_happy.webp' },
        slots: ['🐻 Hibernate', '🦊 Thick Fur', '🐿️ Store Cones', '✨ so they can'],
        rounds: [
          {
            speaker: 'Lulu · Winter Survival',
            img: Z2 + 's_winter_fur.webp',
            ask: 'Bears and chipmunks sleep deeply in warm dens through the freezing winter! What is that called?',
            ok: { t: 'They hibernate so they can save energy!', img: Z2 + 's_winter_fur.webp' },
            no: [
              { t: 'They weave cloth on a loom.', img: CH2 + 'o_loom.webp' },
              { t: 'They visualize a storybook.', img: 'art/z1/w_visualize.webp' }
            ]
          },
          {
            speaker: 'Lulu · Changing Coats',
            img: Z2 + 'w_fur.webp',
            ask: 'Complete with SO THEY CAN! Snowshoe hares and foxes grow thick white fur in winter...',
            ok: { t: '...so they can stay warm and blend into the snow!', img: Z2 + 'w_fur.webp' },
            no: [
              { t: '...so they can sink in the water.', img: Z2 + 'o_boat.webp' },
              { t: '...so they can drop pine needles.', img: Z2 + 'w_needles.webp' }
            ]
          },
          {
            speaker: 'Dr. Livesey · Clever Squirrels',
            img: Z2 + 'w_cone.webp',
            ask: 'Why do squirrels and birds gather seeds from pine cones in autumn?',
            ok: { t: 'They store seeds so they can survive the cold winter!', img: Z2 + 's_pine_cones.webp' },
            no: [
              { t: 'So they can build a clock.', img: FLAT + 'o_compass.webp' },
              { t: 'So they can chase rabbits.', img: 'art/z1/s_alice_chase.webp' }
            ]
          },
          {
            speaker: 'Dr. Livesey · Key Verb',
            img: Z2 + 's_beaver_home.webp',
            ask: 'When plants and animals change their bodies or habits to fit their habitat, we say they...',
            ok: { t: 'They adapt to their forest biome!', img: Z2 + 's_forest_animals.webp' },
            no: [
              { t: 'They forget their messages.', img: 'art/z1/w_sleepy.webp' },
              { t: 'They break their lodges.', img: 'art/z1/s_z1_broken.webp' }
            ]
          }
        ]
      },
      3: {
        title: 'Stop 3 · Kind Swallow Cottage ("A New Friend")',
        bg: CH2 + 'bg_ch2_s1_galley.webp',
        npc: { name: 'Jim Hawkins', img: FLAT + 'c_jim_happy.webp' },
        slots: ['🐦 Swallow Nest', '🩺 Gentle Care', '🌱 Golden Seed', '📖 Author Purpose'],
        rounds: [
          {
            speaker: 'Jim · Folktale Opening',
            img: CH2 + 'c_swallow.webp',
            ask: 'In the folktale "A New Friend", a little bird built a mud nest under Go Ne\'s cottage roof! What bird was it?',
            ok: { t: 'A swift, gentle swallow!', img: CH2 + 'c_swallow.webp' },
            no: [
              { t: 'A snowy polar bear.', img: Z2 + 's_winter_fur.webp' },
              { t: 'A monarch butterfly.', img: 'art/z1/s_butterflies.webp' }
            ]
          },
          {
            speaker: 'Jim · Kindness Like a Vet',
            img: Z2 + 's_vet_animals.webp',
            ask: 'When the baby swallow fell from the roof and hurt its leg, what did kind Go Ne do?',
            ok: { t: 'He cared for its leg gently like an animal vet!', img: Z2 + 'w_vet.webp' },
            no: [
              { t: 'He hit it with a slingshot.', img: 'art/z1/s_z1_broken.webp' },
              { t: 'He locked it in a sea chest.', img: FLAT + 'o_billy_chest.webp' }
            ]
          },
          {
            speaker: 'Lulu · Two Choices',
            img: Z2 + 's_plant_grew.webp',
            ask: 'Next spring, the grateful swallow gave Go Ne a seed that grew rich gifts! What did greedy Wen Shu do wrong?',
            ok: { t: 'He hit a swallow with his slingshot to get gold!', img: Z2 + 's_gave_gift.webp' },
            no: [
              { t: 'He planted evergreen pine trees.', img: Z2 + 's_pine_cones.webp' },
              { t: 'He paid a vet to help.', img: Z2 + 'w_vet.webp' }
            ]
          },
          {
            speaker: 'Dr. Livesey · Author\'s Purpose',
            img: Z2 + 's_gave_gift.webp',
            ask: '"Two Different Forests" was written TO INFORM. Why did the author write the folktale "A New Friend"?',
            ok: { t: 'To teach a lesson: kindness is rewarded, cruelty is not!', img: CH2 + 'c_swallow.webp' },
            no: [
              { t: 'To explain how pine cones grow.', img: Z2 + 'w_cone.webp' },
              { t: 'To sell wooden slingshots.', img: FLAT + 'u_coin.webp' }
            ]
          }
        ]
      },
      4: {
        title: 'Stop 4 · Coral Pier "ai" Sails & Past Verbs',
        bg: CH2 + 'bg_ch2_s4_pier.webp',
        npc: { name: 'Long John Silver', img: FLAT + 'c_silver_happy.webp' },
        slots: ['⛵ s-AI-led & r-AI-n', '🐦 t-AI-l & p-AI-d', '📜 fell & built', '📜 grew & gave'],
        rounds: [
          {
            speaker: 'Silver · Hoist the AI Sail!',
            img: Z2 + 'w_ocean_boat.webp',
            ask: 'Listen for the long-A sound spelled AI! Which sentence has TWO "ai" words?',
            ok: { t: 'We waited in the rain on the main deck!', img: Z2 + 'w_ocean_boat.webp' },
            no: [
              { t: 'Cones fall in cold snow.', img: Z2 + 'w_cone.webp' },
              { t: 'Bears sleep in dark caves.', img: Z2 + 's_winter_fur.webp' }
            ]
          },
          {
            speaker: 'Silver · Second AI Sail!',
            img: CH2 + 'c_swallow.webp',
            ask: 'Spot two more "ai" words from our Unit 2 word bank!',
            ok: { t: 'The swallow\'s tail & Go Ne paid for care!', img: CH2 + 'c_swallow.webp' },
            no: [
              { t: 'Evergreen needles & cones.', img: Z2 + 'w_needles.webp' },
              { t: 'Lobes & brain cells.', img: 'art/z1/w_workout.webp' }
            ]
          },
          {
            speaker: 'Jim · Past Simple Irregulars 1',
            img: Z2 + 'w_built.webp',
            ask: 'Choose the right irregular PAST verbs: "Two swallows ___ a nest on the roof, and one chick ___ down."',
            ok: { t: 'built ... and ... fell!', img: Z2 + 'w_built.webp' },
            no: [
              { t: 'builded ... and ... falled.', img: 'art/z1/w_try.webp' },
              { t: 'builds ... and ... falling.', img: 'art/z1/w_plan.webp' }
            ]
          },
          {
            speaker: 'Jim · Past Simple Irregulars 2',
            img: Z2 + 'w_grew.webp',
            ask: 'Finish the folktale in the past tense: "The swallow ___ Go Ne a seed, and a giant vine ___!"',
            ok: { t: 'gave ... and ... grew!', img: Z2 + 'w_grew.webp' },
            no: [
              { t: 'gived ... and ... growed.', img: 'art/z1/w_mess.webp' },
              { t: 'giving ... and ... grows.', img: Z2 + 's_plant_grew.webp' }
            ]
          }
        ]
      },
      5: {
        title: 'Stop 5 · Spyglass Lighthouse & Coral Chest',
        bg: CH2 + 'bg_ch2_s5_lighthouse.webp',
        npc: { name: 'Long John Silver', img: FLAT + 'c_silver_happy.webp' },
        slots: ['🗼 Lock 1: Biomes', '🗼 Lock 2: Purpose', '🗼 Lock 3: Swallow', '🗼 Lock 4: ai + Past'],
        rounds: [
          {
            speaker: 'Silver · Beacon Lock 1',
            img: Z2 + 's_pine_cones.webp',
            ask: 'Compare the two forest biomes! How does a coniferous tree differ from a deciduous tree?',
            ok: { t: 'Coniferous trees keep evergreen needles and cones all winter!', img: Z2 + 'w_needles.webp' },
            no: [
              { t: 'Coniferous trees drop wide orange leaves.', img: Z2 + 's_go_outside.webp' },
              { t: 'Coniferous trees hibernate in caves.', img: Z2 + 's_winter_fur.webp' }
            ]
          },
          {
            speaker: 'Silver · Beacon Lock 2',
            img: Z2 + 's_winter_fur.webp',
            ask: 'Choose the sentence that explains animal adaptation using SO THEY CAN:',
            ok: { t: 'Beavers build strong lodges so they can stay safe and warm!', img: Z2 + 's_beaver_home.webp' },
            no: [
              { t: 'Beavers build lodges because slingshot.', img: FLAT + 'm_wood.webp' },
              { t: 'Beavers fell down a rabbit hole.', img: 'art/z1/s_alice_fall.webp' }
            ]
          },
          {
            speaker: 'Lulu · Beacon Lock 3',
            img: CH2 + 'c_swallow.webp',
            ask: 'Compare our two Unit 2 readings! Which statement is TRUE?',
            ok: { t: '"Two Different Forests" informs us; "A New Friend" teaches kindness!', img: CH2 + 'c_swallow.webp' },
            no: [
              { t: 'Both texts are fairy tales about Mars.', img: Z2 + 'w_moon.webp' },
              { t: 'Both texts are about cleaning machines.', img: 'art/z1/w_machine.webp' }
            ]
          },
          {
            speaker: 'Silver · Final Beacon Lock!',
            img: Z2 + 'o_lighthouse_on.webp',
            ask: 'Ignite the Spyglass Lighthouse! Pick the sentence with an "ai" word AND a correct irregular past verb:',
            ok: { t: 'TheHispanola sailed through the rain and gave us hope!', img: Z2 + 'o_lighthouse_on.webp' },
            no: [
              { t: 'The swallow gived a tail seed.', img: Z2 + 'w_grew.webp' },
              { t: 'Wen Shu hitted the roof.', img: 'art/z1/s_z1_broken.webp' }
            ]
          }
        ]
      }
    }
  };

  // Fix typo in G4 Stop 5 Round 4 string cleanly
  DATA[4][5].rounds[3].ok.t = 'The ship sailed through the rain and gave us hope!';

  function runStopAdventure(ctx) {
    var g = ctx.grade === 4 ? 4 : 3;
    var stopNum = ctx.stop;
    var cfg = (DATA[g] && DATA[g][stopNum]) || DATA[3][1];
    var rounds = cfg.rounds;
    var idx = 0, tries = 0, hints = 0, roundMiss = 0, missed = [], t0 = Date.now(), closed = false, busy = false;

    var sc = document.createElement('div');
    sc.id = 'ch2-scene';
    sc.className = 'ch2-scene';
    sc.innerHTML =
      '<div class="ch2-scene-bg" style="background-image:url(' + cfg.bg + ')"></div>' +
      '<div class="ch2-scene-shade"></div>' +
      '<div class="hb-scene-top">' +
        '<button type="button" class="hb-btn" id="ch2-sc-close" aria-label="Back to Hispaniola Bay">✕</button>' +
        '<div class="hb-dots" id="ch2-sc-dots"></div>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
          '<button type="button" class="hb-btn" id="ch2-sc-star" style="width:auto;padding:0 12px;font-size:0.85em;background:linear-gradient(180deg,#fbbf24,#d97706);color:#060911">⭐ Star</button>' +
          '<button type="button" class="hb-btn" id="ch2-sc-again" aria-label="Listen again">🔁</button>' +
        '</div>' +
      '</div>' +
      '<div class="ch2-side-npc"><img src="' + cfg.npc.img + '" alt="' + esc(cfg.npc.name) + '" draggable="false"></div>' +
      '<div class="ch2-side-hero">' + ctx.hero(220) + '</div>' +
      '<div class="ch2-workbench">' +
        '<div class="ch2-stage-props" id="ch2-sc-slots"></div>' +
        '<div class="ch2-prompt-card" id="ch2-sc-prompt">' +
          '<img id="ch2-sc-pimg" src="' + rounds[0].img + '" alt="" draggable="false">' +
          '<div class="ch2-prompt-txt">' +
            '<b id="ch2-sc-pspk">' + esc(rounds[0].speaker) + '</b>' +
            '<p id="ch2-sc-pask">' + esc(rounds[0].ask) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ch2-choices" id="ch2-sc-choices"></div>';

    document.body.appendChild(sc);
    requestAnimationFrame(function () { sc.classList.add('in'); });

    function tap() { if (A().sfxTap) A().sfxTap(); }
    function say(t, cb) { if (closed) return; if (A().speak) A().speak(t, {}, function () { if (!closed && cb) cb(); }); else if (cb) setTimeout(cb, 650); }

    function renderDotsAndSlots() {
      var dHtml = '';
      for (var k = 0; k < rounds.length; k++) {
        dHtml += '<i class="' + (k < idx ? 'got' : (k === idx ? 'now' : '')) + '"></i>';
      }
      sc.querySelector('#ch2-sc-dots').innerHTML = dHtml;

      var sHtml = (cfg.slots || []).map(function (lb, k) {
        var cls = k < idx ? 'done' : (k === idx ? 'now' : '');
        return '<span class="ch2-prop-slot ' + cls + '">' + (k < idx ? '✓ ' : '') + esc(lb) + '</span>';
      }).join('');
      sc.querySelector('#ch2-sc-slots').innerHTML = sHtml;
    }

    function renderRound() {
      if (closed) return;
      busy = false;
      roundMiss = 0;
      renderDotsAndSlots();
      var r = rounds[idx];
      sc.querySelector('#ch2-sc-pimg').src = r.img;
      sc.querySelector('#ch2-sc-pspk').textContent = r.speaker;
      sc.querySelector('#ch2-sc-pask').textContent = r.ask;

      var all = shuffle([{ t: r.ok.t, img: r.ok.img, ok: true }].concat(r.no.map(function (x) { return { t: x.t, img: x.img, ok: false }; })));
      var box = sc.querySelector('#ch2-sc-choices');
      box.innerHTML = all.map(function (c, k) {
        return '<button type="button" class="ch2-choice" data-idx="' + k + '"' + (root.__HB_TEST ? (' data-ok="' + (c.ok ? '1' : '0') + '"') : '') + '>' +
          '<img src="' + c.img + '" alt="" draggable="false">' +
          '<span>' + esc(c.t) + '</span>' +
        '</button>';
      }).join('');

      [].forEach.call(box.children, function (btn, k) {
        btn.onclick = function () { pick(all[k], btn, r, all, box); };
      });

      say(r.ask);
    }

    function pick(c, btn, r, all, box) {
      if (busy || closed) return;
      busy = true;
      tap();
      say(c.t, function () {
        if (c.ok) {
          btn.classList.add('ok');
          if (A().sfxCorrect) A().sfxCorrect();
          if (stopNum === 4 && A().sfxSplash) A().sfxSplash();
          if (stopNum === 5 && A().sfxBeacon) A().sfxBeacon();
          if (F().sparkleAt) F().sparkleAt(btn, 14);
          setTimeout(function () {
            idx++;
            if (idx >= rounds.length) win();
            else renderRound();
          }, 620);
        } else {
          tries++;
          roundMiss++;
          if (missed.indexOf(r.ok.t) === -1) missed.push(r.ok.t);
          if (A().sfxWrong) A().sfxWrong();
          btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no');
          setTimeout(function () {
            busy = false;
            if (roundMiss >= 2) {
              hints++;
              all.forEach(function (item, j) {
                if (item.ok && box.children[j]) box.children[j].classList.add('hint');
              });
              if (A().speakSlow) A().speakSlow(r.ok.t); else say(r.ok.t);
            } else {
              say('Good try! Listen carefully and choose again!');
            }
          }, 680);
        }
      });
    }

    function win() {
      renderDotsAndSlots();
      var stars = tries === 0 ? 3 : (tries <= 2 ? 2 : 1);
      try {
        if (P() && P().recordClueResult) {
          P().recordClueResult({
            clueId: 'ch2_g' + g + '_c' + stopNum,
            stopNum: stopNum,
            grade: g,
            mode: 'easy',
            stars: stars,
            tries: tries,
            hintsUsed: hints,
            timeMs: Date.now() - t0,
            missedItems: missed
          });
        }
      } catch (e) {}

      var w = document.createElement('div');
      w.className = 'hb-win';
      w.innerHTML = '<img src="' + FLAT + 'o_map_stamp.webp" alt="" draggable="false"><div class="hb-win-stars">' + '⭐'.repeat(stars) + '<span>' + '⭐'.repeat(3 - stars) + '</span></div>';
      sc.appendChild(w);
      if (A().sfxFanfare) A().sfxFanfare();
      if (F().sparkleAt) F().sparkleAt(w, 24);
      say('Stamp ' + stopNum + ' earned! Fantastic job in Hispaniola Bay!');
      w.onclick = function () { closeScene(true); };
      setTimeout(function () { closeScene(true); }, 3400);
    }

    function closeScene(solved) {
      if (closed) return;
      closed = true;
      if (A().stopVoice) A().stopVoice();
      sc.classList.remove('in');
      setTimeout(function () { if (sc.parentNode) sc.parentNode.removeChild(sc); }, 320);
      ctx.done({ solved: !!solved });
    }

    sc.querySelector('#ch2-sc-close').onclick = function () { tap(); closeScene(false); };
    sc.querySelector('#ch2-sc-again').onclick = function () { tap(); if (rounds[idx]) say(rounds[idx].ask); };
    sc.querySelector('#ch2-sc-star').onclick = function () {
      tap();
      closeScene(false);
      if (root.Chapter2 && root.Chapter2.openClue) {
        setTimeout(function () {
          root.Chapter2.openClue(stopNum, 'star', function (res) {
            if (res && res.solved && BW.refresh) BW.refresh();
          });
        }, 220);
      }
    };

    renderRound();
  }

  for (var s = 1; s <= 5; s++) {
    BW.stops[s] = runStopAdventure;
  }

  root.CH2_STOP_DATA = DATA;
})(typeof window !== 'undefined' ? window : this);
