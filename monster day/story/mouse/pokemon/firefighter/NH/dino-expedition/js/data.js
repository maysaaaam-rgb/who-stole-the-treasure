/**
 * DINO EXPEDITION: PREHISTORIC HABITATS — CURRICULUM & ASSET DATA
 * Primary ESL / CLIL • Grade 3–4 | CEFR A1+ | Ages 8–11
 * Focus: Comparative Adjectives (bigger, faster, heavier) & Habitat Needs
 */
(function(root) {
  'use strict';

  const DINO_EXPEDITION_DATA = {
    meta: {
      id: 'dino-expedition',
      title: 'Dino Expedition: Prehistoric Habitats',
      subtitle: 'Comparative Adjectives • Diets • Prehistoric Ecosystems',
      grade: 'Grade 3–4',
      cefr: 'A1+',
      age: 'Ages 8–11',
      grammarStructures: [
        '[Dino A] was [comparative] than [Dino B]',
        'It lived in the [habitat] to find [food/plants]'
      ],
      lexicon: [
        'carnivore', 'herbivore', 'claws', 'horns', 'armor',
        'forest', 'swamp', 'plains', 'heavier', 'faster', 'bigger'
      ],
      totalXP: 180
    },

    dinosaurs: [
      {
        id: 'trex',
        name: 'Tyrannosaurus Rex',
        shortName: 'T-Rex',
        diet: 'Carnivore',
        dietBadge: '🥩 Carnivore',
        dietBg: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
        accentColor: '#f43f5e',
        weight: '8,000 kg',
        speed: '27 km/h',
        habitat: 'volcano',
        habitatName: 'Volcanic Crags',
        habitatIcon: '🌋',
        feature: 'crushing jaws',
        imageSrc: 'assets/trex.webp',
        speechIntro: 'Tyrannosaurus Rex was a fierce carnivore. It was bigger and heavier than Velociraptor!',
        teleprompter: [
          'Welcome to the expedition! This is Tyrannosaurus Rex.',
          'T-Rex was bigger and heavier than Velociraptor.',
          'It lived in the volcanic crags to hunt prey!'
        ],
        stats: {
          power: 98,
          speed: 72,
          defense: 85
        },
        discoveryFacts: {
          teethFact: 'Had 60 serrated teeth, some as long as 30 centimeters.',
          weightFact: 'Weighed over 8,000 kilograms—as heavy as a full school bus!',
          speedFact: 'Could charge across open ground at 27 kilometers per hour.'
        },
        workbenchTasks: [
          {
            id: 'tr-t1',
            type: 'comparative',
            prompt: 'Compare the mighty T-Rex with the smaller Triceratops. Which statement is correct?',
            sentencePre: 'T-Rex was ',
            sentencePost: ' than Velociraptor.',
            options: [
              { text: 'bigger', correct: true, hint: 'T-Rex weighed 8,000 kg, while Velociraptor weighed only 15 kg!' },
              { text: 'smaller', correct: false, hint: 'T-Rex is one of the largest predators to ever walk the earth!' },
              { text: 'kinder', correct: false, hint: 'T-Rex was an apex predator, not a cuddly pet!' }
            ],
            explanation: 'T-Rex was bigger than Velociraptor!'
          },
          {
            id: 'tr-t2',
            type: 'diet',
            prompt: 'What did T-Rex eat with its massive bone-crushing jaws?',
            sentencePre: 'Because it was a ',
            sentencePost: ', it hunted other dinosaurs for meat.',
            options: [
              { text: 'carnivore', correct: true, hint: 'Carnivores are meat-eaters with sharp teeth!' },
              { text: 'herbivore', correct: false, hint: 'Herbivores only eat ferns and tree leaves!' },
              { text: 'vegetarian', correct: false, hint: 'Dinosaurs did not shop at grocery stores!' }
            ],
            explanation: 'T-Rex was a carnivore!'
          },
          {
            id: 'tr-t3',
            type: 'habitat',
            prompt: 'Where did the tyrant king stalk its prey?',
            sentencePre: 'It lived in the ',
            sentencePost: ' to ambush roaming herds.',
            options: [
              { text: 'volcanic crags', correct: true, hint: 'Rocky volcanic cliffs gave it an ambush advantage!' },
              { text: 'frozen igloo', correct: false, hint: 'The Cretaceous period was warm and tropical!' },
              { text: 'shopping mall', correct: false, hint: 'Prehistoric animals lived in wild habitats!' }
            ],
            explanation: 'It lived in the volcanic crags!'
          }
        ]
      },
      {
        id: 'raptor',
        name: 'Velociraptor',
        shortName: 'Raptor',
        diet: 'Carnivore',
        dietBadge: '🥩 Carnivore',
        dietBg: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        accentColor: '#f59e0b',
        weight: '15 kg',
        speed: '64 km/h',
        habitat: 'valley',
        habitatName: 'Fern Valley',
        habitatIcon: '🌿',
        feature: 'sickle claws',
        imageSrc: 'assets/raptor.webp',
        speechIntro: 'Velociraptor was an agile hunter. It was much faster than T-Rex!',
        teleprompter: [
          'Welcome to the expedition! This is Velociraptor.',
          'Velociraptor was faster than Tyrannosaurus Rex.',
          'It lived in the fern valley to hunt in packs!'
        ],
        stats: {
          power: 82,
          speed: 98,
          defense: 65
        },
        discoveryFacts: {
          teethFact: 'Carried a razor-sharp 8-centimeter curved sickle claw on each foot.',
          weightFact: 'Lightweight turkey-sized predator weighing only 15 kilograms.',
          speedFact: 'Could sprint up to 64 kilometers per hour through dense scrub.'
        },
        workbenchTasks: [
          {
            id: 'rp-t1',
            type: 'comparative',
            prompt: 'Compare the running speeds of Velociraptor (64 km/h) and T-Rex (27 km/h):',
            sentencePre: 'Velociraptor was ',
            sentencePost: ' than T-Rex.',
            options: [
              { text: 'faster', correct: true, hint: '64 km/h is much faster than 27 km/h!' },
              { text: 'slower', correct: false, hint: 'Check the speed stats: 64 km/h vs 27 km/h!' },
              { text: 'heavier', correct: false, hint: 'A raptor weighed only 15 kg; T-Rex weighed 8,000 kg!' }
            ],
            explanation: 'Velociraptor was faster than T-Rex!'
          },
          {
            id: 'rp-t2',
            type: 'feature',
            prompt: 'What signature weapon was curved on its hind feet?',
            sentencePre: 'It had sharp ',
            sentencePost: ' to pin down smaller prey.',
            options: [
              { text: 'sickle claws', correct: true, hint: 'The curved second toe claw was its deadly tool!' },
              { text: 'rubber boots', correct: false, hint: 'Dinosaurs did not wear footwear!' },
              { text: 'wooden spoons', correct: false, hint: 'Raptors used biological claws for hunting!' }
            ],
            explanation: 'It had sharp sickle claws!'
          },
          {
            id: 'rp-t3',
            type: 'habitat',
            prompt: 'Where did swift raptors chase prey in packs?',
            sentencePre: 'It lived in the ',
            sentencePost: ' to hide under giant prehistoric ferns.',
            options: [
              { text: 'fern valley', correct: true, hint: 'Lush valleys offered dense cover for pack hunting!' },
              { text: 'cloud tower', correct: false, hint: 'Dinosaurs were terrestrial land animals!' },
              { text: 'deep submarine', correct: false, hint: 'Raptors ran on dry land, not in submarines!' }
            ],
            explanation: 'It lived in the fern valley!'
          }
        ]
      },
      {
        id: 'triceratops',
        name: 'Triceratops',
        shortName: 'Triceratops',
        diet: 'Herbivore',
        dietBadge: '🥗 Herbivore',
        dietBg: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        accentColor: '#10b981',
        weight: '6,000 kg',
        speed: '32 km/h',
        habitat: 'forest',
        habitatName: 'Redwood Forest',
        habitatIcon: '🌲',
        feature: 'three brow horns & shield',
        imageSrc: 'assets/triceratops.webp',
        speechIntro: 'Triceratops was a massive herbivore. It was heavier and stronger than Velociraptor!',
        teleprompter: [
          'Welcome to the expedition! This is Triceratops.',
          'Triceratops was heavier and stronger than Velociraptor.',
          'It lived in the redwood forest to protect its herd!'
        ],
        stats: {
          power: 88,
          speed: 68,
          defense: 95
        },
        discoveryFacts: {
          teethFact: 'Beak-like mouth with hundreds of teeth for shearing tough palm fronds.',
          weightFact: 'Massive herbivore weighing 6,000 kilograms with a solid bone neck frill.',
          speedFact: 'Could charge in defensive formation up to 32 kilometers per hour.'
        },
        workbenchTasks: [
          {
            id: 'tri-t1',
            type: 'comparative',
            prompt: 'Compare the weights of Triceratops (6,000 kg) and Velociraptor (15 kg):',
            sentencePre: 'Triceratops was ',
            sentencePost: ' than Velociraptor.',
            options: [
              { text: 'heavier', correct: true, hint: '6,000 kg is vastly heavier than 15 kg!' },
              { text: 'lighter', correct: false, hint: 'Triceratops was a massive tank, not light!' },
              { text: 'weaker', correct: false, hint: 'Triceratops had huge bone strength!' }
            ],
            explanation: 'Triceratops was heavier than Velociraptor!'
          },
          {
            id: 'tri-t2',
            type: 'feature',
            prompt: 'What did Triceratops use to defend against attacking carnivores?',
            sentencePre: 'It had three sharp ',
            sentencePost: ' and a solid bone shield.',
            options: [
              { text: 'horns', correct: true, hint: 'Tri-ceratops means three-horned face in Greek!' },
              { text: 'laser beams', correct: false, hint: 'Dinosaurs lived 66 million years ago without lasers!' },
              { text: 'paintbrushes', correct: false, hint: 'Its three horns were used for physical defense!' }
            ],
            explanation: 'It had three sharp horns!'
          },
          {
            id: 'tri-t3',
            type: 'habitat',
            prompt: 'Where did Triceratops graze on tough prehistoric plants?',
            sentencePre: 'It lived in the ',
            sentencePost: ' to eat cycads and thick palm roots.',
            options: [
              { text: 'redwood forest', correct: true, hint: 'Ancient forests grew abundant plants for heavy herbivores!' },
              { text: 'desert dunes', correct: false, hint: 'Giant herbivores needed huge amounts of leafy plants!' },
              { text: 'deep ocean', correct: false, hint: 'Triceratops could not breathe underwater!' }
            ],
            explanation: 'It lived in the redwood forest!'
          }
        ]
      },
      {
        id: 'brachiosaurus',
        name: 'Brachiosaurus',
        shortName: 'Brachiosaurus',
        diet: 'Herbivore',
        dietBadge: '🥗 Herbivore',
        dietBg: 'rgba(56, 189, 248, 0.2)',
        borderColor: '#38bdf8',
        accentColor: '#38bdf8',
        weight: '40,000 kg',
        speed: '15 km/h',
        habitat: 'swamp',
        habitatName: 'Deep Wetlands',
        habitatIcon: '🏞️',
        feature: 'colossal tall neck',
        imageSrc: 'assets/brachiosaurus.webp',
        speechIntro: 'Brachiosaurus was a colossal giant. It was much heavier than Tyrannosaurus Rex!',
        teleprompter: [
          'Welcome to the expedition! This is Brachiosaurus.',
          'Brachiosaurus was heavier and taller than T-Rex.',
          'It lived in the deep wetlands to feed on treetops!'
        ],
        stats: {
          power: 94,
          speed: 45,
          defense: 92
        },
        discoveryFacts: {
          teethFact: 'Spoon-shaped teeth designed to strip pine needles from 12-meter canopies.',
          weightFact: 'Titan weighing 40,000 kilograms—equal to 6 full-grown elephants!',
          speedFact: 'Slow and steady walker pacing at 15 kilometers per hour.'
        },
        workbenchTasks: [
          {
            id: 'br-t1',
            type: 'comparative',
            prompt: 'Compare the colossal Brachiosaurus (40,000 kg) with T-Rex (8,000 kg):',
            sentencePre: 'Brachiosaurus was ',
            sentencePost: ' than Tyrannosaurus Rex.',
            options: [
              { text: 'heavier', correct: true, hint: '40,000 kg is 5 times heavier than 8,000 kg!' },
              { text: 'faster', correct: false, hint: 'Brachiosaurus moved slowly due to its huge weight!' },
              { text: 'smaller', correct: false, hint: 'Brachiosaurus stood over 12 meters tall!' }
            ],
            explanation: 'Brachiosaurus was heavier than T-Rex!'
          },
          {
            id: 'br-t2',
            type: 'feature',
            prompt: 'How did Brachiosaurus reach vegetation high in the canopy?',
            sentencePre: 'It had a very long ',
            sentencePost: ' that reached the highest conifer treetops.',
            options: [
              { text: 'neck', correct: true, hint: 'Its 9-meter giraffe-like neck reached top foliage!' },
              { text: 'ladder', correct: false, hint: 'Sauropods used their anatomical necks, not ladders!' },
              { text: 'antenna', correct: false, hint: 'Its biological neck allowed tree-top feeding!' }
            ],
            explanation: 'It had a very long neck!'
          },
          {
            id: 'br-t3',
            type: 'habitat',
            prompt: 'Where did the gentle titan find lush vegetation and water?',
            sentencePre: 'It lived in the ',
            sentencePost: ' where ancient rivers watered gigantic trees.',
            options: [
              { text: 'deep wetlands', correct: true, hint: 'Wetlands provided the endless tons of foliage it required!' },
              { text: 'busy train station', correct: false, hint: 'Train stations did not exist 150 million years ago!' },
              { text: 'dry desert', correct: false, hint: 'A 40-ton animal would quickly starve in a barren desert!' }
            ],
            explanation: 'It lived in the deep wetlands!'
          }
        ]
      },
      {
        id: 'ankylosaurus',
        name: 'Ankylosaurus',
        shortName: 'Ankylosaurus',
        diet: 'Herbivore',
        dietBadge: '🥗 Herbivore',
        dietBg: 'rgba(168, 85, 247, 0.2)',
        borderColor: '#a855f7',
        accentColor: '#a855f7',
        weight: '7,000 kg',
        speed: '10 km/h',
        habitat: 'plains',
        habitatName: 'Rocky Plains',
        habitatIcon: '🪨',
        feature: 'bone club & armor plates',
        imageSrc: 'assets/ankylosaurus.webp',
        speechIntro: 'Ankylosaurus was a living tank. It was heavier and more armored than Velociraptor!',
        teleprompter: [
          'Welcome to the expedition! This is Ankylosaurus.',
          'Ankylosaurus was heavier and more armored than Raptor.',
          'It lived in the rocky plains to defend its ground!'
        ],
        stats: {
          power: 90,
          speed: 40,
          defense: 99
        },
        discoveryFacts: {
          teethFact: 'Leaf-shaped teeth for grinding low-lying shrubs and tough roots.',
          weightFact: 'Armored herbivore weighing 7,000 kilograms encased in thick osteoderms.',
          speedFact: 'Slow defender walking low to the ground at 10 kilometers per hour.'
        },
        workbenchTasks: [
          {
            id: 'ak-t1',
            type: 'comparative',
            prompt: 'Compare Ankylosaurus (7,000 kg) with Velociraptor (15 kg):',
            sentencePre: 'Ankylosaurus was ',
            sentencePost: ' than Velociraptor.',
            options: [
              { text: 'heavier', correct: true, hint: '7,000 kg is thousands of kilograms heavier than 15 kg!' },
              { text: 'quicker', correct: false, hint: 'Ankylosaurus was slow and heavily armored!' },
              { text: 'taller', correct: false, hint: 'Ankylosaurus stayed low to protect its soft belly!' }
            ],
            explanation: 'Ankylosaurus was heavier than Velociraptor!'
          },
          {
            id: 'ak-t2',
            type: 'feature',
            prompt: 'What heavy weapon swung at the end of its tail?',
            sentencePre: 'It had a massive bone ',
            sentencePost: ' that could break a predator\'s leg bones.',
            options: [
              { text: 'club', correct: true, hint: 'The fused tail club was a devastating defensive weapon!' },
              { text: 'sword', correct: false, hint: 'Dinosaurs possessed natural bone clubs, not forged swords!' },
              { text: 'feather', correct: false, hint: 'Soft feathers could not stop a charging carnivore!' }
            ],
            explanation: 'It had a massive bone club!'
          },
          {
            id: 'ak-t3',
            type: 'habitat',
            prompt: 'Where did the armored defender browse for low ferns and shrubs?',
            sentencePre: 'It lived in the ',
            sentencePost: ' where broad open views allowed early detection of predators.',
            options: [
              { text: 'rocky plains', correct: true, hint: 'Open rocky plains allowed it to spot threats and swing its club!' },
              { text: 'tall tree branch', correct: false, hint: 'A 7-ton dinosaur could never climb trees!' },
              { text: 'deep ice cave', correct: false, hint: 'Prehistoric plains were warm and hospitable!' }
            ],
            explanation: 'It lived in the rocky plains!'
          }
        ]
      },
      {
        id: 'stegosaurus',
        name: 'Stegosaurus',
        shortName: 'Stegosaurus',
        diet: 'Herbivore',
        dietBadge: '🥗 Herbivore',
        dietBg: 'rgba(234, 179, 8, 0.2)',
        borderColor: '#eab308',
        accentColor: '#eab308',
        weight: '5,000 kg',
        speed: '12 km/h',
        habitat: 'river',
        habitatName: 'Ancient Riverbank',
        habitatIcon: '🌊',
        feature: 'dorsal plates & tail spikes',
        imageSrc: 'assets/stegosaurus.webp',
        speechIntro: 'Stegosaurus was a plated defender. It was bigger and heavier than Velociraptor!',
        teleprompter: [
          'Welcome to the expedition! This is Stegosaurus.',
          'Stegosaurus was bigger and heavier than Velociraptor.',
          'It lived in the ancient riverbank to feed peacefully!'
        ],
        stats: {
          power: 86,
          speed: 52,
          defense: 94
        },
        discoveryFacts: {
          teethFact: 'Small peg-like teeth for chewing riverbank mosses and horsetails.',
          weightFact: 'Weighed 5,000 kilograms with 17 kite-shaped bony plates on its back.',
          speedFact: 'Paced along watercourses at 12 kilometers per hour.'
        },
        workbenchTasks: [
          {
            id: 'st-t1',
            type: 'comparative',
            prompt: 'Compare Stegosaurus (5,000 kg) with Velociraptor (15 kg):',
            sentencePre: 'Stegosaurus was ',
            sentencePost: ' than Velociraptor.',
            options: [
              { text: 'bigger', correct: true, hint: 'Stegosaurus measured 9 meters long; raptor was 2 meters!' },
              { text: 'faster', correct: false, hint: 'Raptor ran at 64 km/h; Stegosaurus only 12 km/h!' },
              { text: 'tiny', correct: false, hint: 'Stegosaurus weighed 5 tons!' }
            ],
            explanation: 'Stegosaurus was bigger than Velociraptor!'
          },
          {
            id: 'st-t2',
            type: 'feature',
            prompt: 'What rose along the back of Stegosaurus for heat regulation and display?',
            sentencePre: 'It had seventeen bony ',
            sentencePost: ' arranged in two alternating rows.',
            options: [
              { text: 'plates', correct: true, hint: 'The large upright plates absorbed sunlight and deterred predators!' },
              { text: 'pillows', correct: false, hint: 'Bony osteoderm plates, not soft pillows!' },
              { text: 'balloons', correct: false, hint: 'These plates were solid bone covered in keratin!' }
            ],
            explanation: 'It had seventeen bony plates!'
          },
          {
            id: 'st-t3',
            type: 'habitat',
            prompt: 'Where did Stegosaurus find soft river grasses and fresh drinking water?',
            sentencePre: 'It lived in the ',
            sentencePost: ' where lush mosses and ferns thrived.',
            options: [
              { text: 'ancient riverbank', correct: true, hint: 'Moist riverbanks grew soft horsetails suitable for small teeth!' },
              { text: 'volcano caldera', correct: false, hint: 'Lava would burn its feet and destroy all river plants!' },
              { text: 'outer space orbit', correct: false, hint: 'Dinosaurs lived on Earth in prehistoric river valleys!' }
            ],
            explanation: 'It lived in the ancient riverbank!'
          }
        ]
      }
    ],

    habitats: {
      volcano: {
        id: 'volcano',
        name: 'Volcanic Crags',
        icon: '🌋',
        desc: 'Rocky lava terraces and smoking vents where T-Rex patrols.',
        color: '#ef4444'
      },
      valley: {
        id: 'valley',
        name: 'Fern Valley',
        icon: '🌿',
        desc: 'Dense scrubland and giant ferns hiding agile raptor packs.',
        color: '#f59e0b'
      },
      forest: {
        id: 'forest',
        name: 'Redwood Forest',
        icon: '🌲',
        desc: 'Towering ancient conifer and cycad woods shielding triceratops herds.',
        color: '#10b981'
      },
      swamp: {
        id: 'swamp',
        name: 'Deep Wetlands',
        icon: '🏞️',
        desc: 'Flooded prehistoric marshlands feeding colossal sauropods.',
        color: '#38bdf8'
      },
      plains: {
        id: 'plains',
        name: 'Rocky Plains',
        icon: '🪨',
        desc: 'Open sun-baked scrub plains where armored tanks graze.',
        color: '#a855f7'
      },
      river: {
        id: 'river',
        name: 'Ancient Riverbank',
        icon: '🌊',
        desc: 'Gentle freshwater shores with lush beds of soft horsetails.',
        color: '#eab308'
      }
    }
  };

  root.DINO_EXPEDITION_DATA = DINO_EXPEDITION_DATA;
})(typeof window !== 'undefined' ? window : global);
