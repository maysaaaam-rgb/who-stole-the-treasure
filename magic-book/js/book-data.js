/* ==========================================================================
   The Magic Book — Unit 5 Complete Page, Exercise & 3D Asset Registry
   Global Readings Level 2 (Grade 3: Let’s Go Back, pp. 72-87)
   Global Readings Level 3 (Grade 4: Make Some Noise, pp. 72-87)
   Includes 32 Page Scans, 32 3D Scenes/Cutouts, 14 Layered 3D Scene Assets,
   12 Extra Cutouts, 26 Sound Effects, 6 Videos & Interactive Exercise Spots.
   ========================================================================== */
(function (root) {
  'use strict';
  const MAGIC_BOOK_DATA = {
  "g3": {
    "grade": 3,
    "title": "Unit 5: Let’s Go Back",
    "bookTitle": "Global Readings Level 2",
    "bigQuestion": "How can we find out about the past?",
    "classes": [
      "3A",
      "3B"
    ],
    "hookVideo": "../extras/g3_vid_hook.mp4",
    "r1Video": "../extras/g3_vid_r1.mp4",
    "r2Video": "../extras/g3_vid_r2.mp4",
    "pages": {
      "72": {
        "page": 72,
        "title": "Unit 5 Opener — Let’s Go Back",
        "type": "Opener",
        "img": "../pages/G3-p72.png",
        "popScene": "g3_cover.png",
        "video": "../extras/g3_vid_hook.mp4",
        "sound": "../extras/sounds/g3_time_portal.mp3",
        "narration": "Unit 5: Let's Go Back! Activating prior knowledge about history and the past. Look at the huge dinosaur and the cows in the misty field!",
        "popWords": [
          {
            "word": "ancient",
            "img": "g3_word_ancient.png",
            "meaning": "Very, very old; from long ago."
          },
          {
            "word": "strange",
            "img": "../extras/pics/g3_strange.png",
            "meaning": "Unusual, surprising, or not normal."
          }
        ],
        "exercises": [
          {
            "id": "p72-title",
            "label": "Unit 5 Title & Opener Scene",
            "x": 5,
            "y": 12,
            "w": 90,
            "h": 80
          }
        ],
        "spots": [
          {
            "id": "g3-p72-1",
            "num": "1",
            "type": "blank",
            "x": 12,
            "y": 40,
            "w": 46,
            "h": 5.5,
            "prompt": "What animal from the past is standing with the cows?",
            "answer": "A huge dinosaur",
            "options": [
              "A huge dinosaur",
              "A small cat",
              "A fast car"
            ],
            "hint": "Look at its long neck in the mist! It lived millions of years ago."
          }
        ],
        "scene3d": {
          "title": "Jannah’s Bedroom — The Time Book",
          "bg": "../art-scenes/bg_g3_bedroom.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Hi! I am Jannah. Look at my special Time Book!",
              "x": 22,
              "y": 36,
              "w": 32
            },
            {
              "id": "timebook",
              "img": "../art-scenes/o_g3_timebook.png",
              "label": "The Time Book",
              "say": "The ancient book is glowing with golden magic!",
              "x": 55,
              "y": 48,
              "w": 28
            }
          ]
        }
      },
      "73": {
        "page": 73,
        "title": "Get Ready to Read — See, Think, Wonder",
        "type": "Get Ready to Read",
        "img": "../pages/G3-p73.png",
        "popScene": "g3_cover.png",
        "video": "../extras/g3_vid_hook.mp4",
        "sound": "../extras/sounds/g3_magic_sparkle.mp3",
        "narration": "Get Ready to Read: See, Think, Wonder. A: Look at the picture. What do you see? I see a dinosaur! I see a house. B: What do you think? I think it's huge. I don't think it's real. C: What do you wonder? I wonder where they are. Who lives in the house?",
        "popWords": [
          {
            "word": "ancient",
            "img": "g3_word_ancient.png",
            "meaning": "Very, very old; from long ago."
          },
          {
            "word": "pharaoh",
            "img": "g3_word_pharaoh.png",
            "meaning": "A king of ancient Egypt."
          }
        ],
        "exercises": [
          {
            "id": "p73-exA",
            "label": "Ex A: What do you see?",
            "x": 40,
            "y": 13,
            "w": 51,
            "h": 11
          },
          {
            "id": "p73-exB",
            "label": "Ex B: What do you think?",
            "x": 40,
            "y": 24,
            "w": 51,
            "h": 13
          },
          {
            "id": "p73-exC",
            "label": "Ex C: What do you wonder?",
            "x": 40,
            "y": 37,
            "w": 51,
            "h": 14
          },
          {
            "id": "p73-exD",
            "label": "Ex D: Travel into the past",
            "x": 40,
            "y": 53,
            "w": 51,
            "h": 7
          },
          {
            "id": "p73-exE",
            "label": "Ex E: Choose the main idea",
            "x": 40,
            "y": 61,
            "w": 52,
            "h": 27
          }
        ],
        "spots": [
          {
            "id": "g3-p73-a",
            "num": "A",
            "type": "blank",
            "x": 45,
            "y": 21.2,
            "w": 42,
            "h": 3.6,
            "prompt": "A: Look at the picture. What else do you see?",
            "answer": "I see two dinosaurs and cows.",
            "options": [
              "I see two dinosaurs and cows.",
              "I see a spaceship in space.",
              "I see a movie studio."
            ],
            "hint": "Look at the green grass around the dinosaurs!"
          },
          {
            "id": "g3-p73-d",
            "num": "D",
            "type": "blank",
            "x": 44,
            "y": 58.2,
            "w": 45,
            "h": 3.6,
            "prompt": "D: You can travel into the past. How far back do you go?",
            "answer": "I go back to ancient Egypt.",
            "options": [
              "I go back to ancient Egypt.",
              "I go to school tomorrow.",
              "I eat breakfast now."
            ],
            "hint": "Where does Jannah travel in this unit?"
          },
          {
            "id": "g3-p73-e1",
            "num": "E1",
            "type": "choice",
            "x": 43.5,
            "y": 78.2,
            "w": 47,
            "h": 2.8,
            "group": "g3-p73-e",
            "text": "1. Jannah explores ancient Egypt with her book.",
            "correct": true,
            "answer": "1. Jannah explores ancient Egypt with her book.",
            "hint": "Read the summary: what is the big main idea of the whole paragraph?"
          },
          {
            "id": "g3-p73-e2",
            "num": "E2",
            "type": "choice",
            "x": 43.5,
            "y": 81.2,
            "w": 28,
            "h": 2.8,
            "group": "g3-p73-e",
            "text": "2. Jannah loves to read.",
            "correct": false,
            "answer": "1. Jannah explores ancient Egypt with her book.",
            "hint": "That is just one small detail. Which sentence tells the big idea of the story?"
          },
          {
            "id": "g3-p73-e3",
            "num": "E3",
            "type": "choice",
            "x": 43.5,
            "y": 84,
            "w": 28,
            "h": 2.8,
            "group": "g3-p73-e",
            "text": "3. Jannah lives in Cairo.",
            "correct": false,
            "answer": "1. Jannah explores ancient Egypt with her book.",
            "hint": "Living in Cairo is one detail. What does she do with her special book?"
          }
        ],
        "scene3d": {
          "title": "Jannah’s Bedroom — The Time Book",
          "bg": "../art-scenes/bg_g3_bedroom.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Hi! I am Jannah. Look at my special Time Book!",
              "x": 22,
              "y": 36,
              "w": 32
            },
            {
              "id": "timebook",
              "img": "../art-scenes/o_g3_timebook.png",
              "label": "The Time Book",
              "say": "The ancient book is glowing with golden magic!",
              "x": 55,
              "y": 48,
              "w": 28
            }
          ]
        }
      },
      "74": {
        "page": 74,
        "title": "Reading 1: The Time Book (Part 1)",
        "type": "Reading 1",
        "img": "../pages/G3-p74.png",
        "popScene": "g3_scene_r1_a.png",
        "video": "../extras/g3_vid_r1.mp4",
        "sound": "../extras/sounds/g3_page_turn.mp3",
        "narration": "The Time Book. It was time for Jannah to go to bed. Just one more story, she thought. What's this? I don't remember this book. It looks interesting. On the book, there was a picture of an old street with a lot of people. She saw a girl. That girl looks like me! she thought. How strange! She opened the book.",
        "popWords": [
          {
            "word": "Jannah",
            "img": "g3_char_main.png",
            "meaning": "The main girl in The Time Book."
          },
          {
            "word": "strange",
            "img": "../extras/pics/g3_strange.png",
            "meaning": "Unusual, surprising, or not normal."
          },
          {
            "word": "glasses",
            "img": "g3_word_glasses.png",
            "meaning": "Lenses worn on your face to see."
          }
        ],
        "exercises": [
          {
            "id": "p74-text",
            "label": "Story Text: Jannah's Bedroom",
            "x": 54,
            "y": 12,
            "w": 41,
            "h": 48
          },
          {
            "id": "p74-think",
            "label": "Sticky Note: Why is The Time Book special?",
            "x": 5,
            "y": 82,
            "w": 30,
            "h": 12
          }
        ],
        "spots": [
          {
            "id": "g3-p74-1",
            "num": "★",
            "type": "blank",
            "x": 6,
            "y": 90,
            "w": 36,
            "h": 4.5,
            "prompt": "Why is The Time Book special?",
            "answer": "It takes Jannah back to ancient Egypt!",
            "options": [
              "It takes Jannah back to ancient Egypt!",
              "It is a normal school math book.",
              "It has no pictures inside."
            ],
            "hint": "What happens right after Jannah opens the book?"
          }
        ],
        "scene3d": {
          "title": "Jannah’s Bedroom — The Time Book",
          "bg": "../art-scenes/bg_g3_bedroom.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Hi! I am Jannah. Look at my special Time Book!",
              "x": 22,
              "y": 36,
              "w": 32
            },
            {
              "id": "timebook",
              "img": "../art-scenes/o_g3_timebook.png",
              "label": "The Time Book",
              "say": "The ancient book is glowing with golden magic!",
              "x": 55,
              "y": 48,
              "w": 28
            }
          ]
        }
      },
      "75": {
        "page": 75,
        "title": "Reading 1: The Time Book (Part 2) & Words in Context",
        "type": "Reading 1 + Words",
        "img": "../pages/G3-p75.png",
        "popScene": "g3_scene_r1_a.png",
        "video": "../extras/g3_vid_r1.mp4",
        "sound": "../extras/sounds/g3_time_portal.mp3",
        "narration": "Oh! Where am I? asked Jannah. She was in a very old city. Look! said an old woman next to her. The pharaoh is coming. Words in Context: strange, pharaoh, chariot, surprised, scared, ancient.",
        "popWords": [
          {
            "word": "strange",
            "img": "../extras/pics/g3_strange.png",
            "meaning": "Unusual, surprising, or not normal."
          },
          {
            "word": "pharaoh",
            "img": "g3_word_pharaoh.png",
            "meaning": "A king of ancient Egypt."
          },
          {
            "word": "chariot",
            "img": "g3_word_chariot.png",
            "meaning": "A two-wheeled cart pulled by animals."
          },
          {
            "word": "surprised",
            "img": "g3_word_surprised.png",
            "meaning": "Feeling shocked when something unexpected happens."
          },
          {
            "word": "scared",
            "img": "../extras/pics/g3_scared.png",
            "meaning": "Feeling afraid or frightened."
          },
          {
            "word": "ancient",
            "img": "g3_word_ancient.png",
            "meaning": "Very, very old; from long ago."
          }
        ],
        "exercises": [
          {
            "id": "p75-story",
            "label": "Story Text: Arriving in the Old City",
            "x": 6,
            "y": 5,
            "w": 46,
            "h": 18
          },
          {
            "id": "p75-words",
            "label": "Words in Context (6 Target Words)",
            "x": 5,
            "y": 80,
            "w": 44,
            "h": 15
          }
        ],
        "spots": [
          {
            "id": "g3-p75-w1",
            "num": "1",
            "type": "blank",
            "x": 52,
            "y": 84,
            "w": 42,
            "h": 4.2,
            "prompt": "Who is coming down the street in the ancient city?",
            "answer": "The pharaoh is coming.",
            "options": [
              "The pharaoh is coming.",
              "A dinosaur is coming.",
              "A spacecraft is coming."
            ],
            "hint": "Read what the old woman says next to Jannah!"
          }
        ],
        "scene3d": {
          "title": "Jannah’s Bedroom — The Time Book",
          "bg": "../art-scenes/bg_g3_bedroom.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Hi! I am Jannah. Look at my special Time Book!",
              "x": 22,
              "y": 36,
              "w": 32
            },
            {
              "id": "timebook",
              "img": "../art-scenes/o_g3_timebook.png",
              "label": "The Time Book",
              "say": "The ancient book is glowing with golden magic!",
              "x": 55,
              "y": 48,
              "w": 28
            }
          ]
        }
      },
      "76": {
        "page": 76,
        "title": "Reading 1: The Time Book (Part 3 — The Chariot)",
        "type": "Reading 1",
        "img": "../pages/G3-p76.png",
        "popScene": "g3_scene_r1_b.png",
        "video": "../extras/g3_vid_r1.mp4",
        "sound": "../extras/sounds/g3_chariot_horses.mp3",
        "narration": "I want to see the pharaoh, said the woman. Then Jannah saw the huge chariot. Look out! she shouted.",
        "popWords": [
          {
            "word": "chariot",
            "img": "g3_word_chariot.png",
            "meaning": "A two-wheeled cart pulled by animals."
          },
          {
            "word": "pharaoh",
            "img": "g3_word_pharaoh.png",
            "meaning": "A king of ancient Egypt."
          }
        ],
        "exercises": [
          {
            "id": "p76-story",
            "label": "Story Text: Look out! The huge chariot",
            "x": 54,
            "y": 5,
            "w": 42,
            "h": 18
          }
        ],
        "spots": [
          {
            "id": "g3-p76-1",
            "num": "1",
            "type": "blank",
            "x": 55,
            "y": 18,
            "w": 40,
            "h": 4.2,
            "prompt": "What did Jannah see in the parade?",
            "answer": "She saw the huge chariot.",
            "options": [
              "She saw the huge chariot.",
              "She saw a television.",
              "She saw a snowstorm."
            ],
            "hint": "Look at the giant golden dog statue on wheels!"
          }
        ],
        "scene3d": {
          "title": "Ancient Egypt — The Pharaoh’s Street",
          "bg": "../art-scenes/bg_g3_egypt_street.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Try my glasses! Put them in front of your eyes.",
              "x": 10,
              "y": 42,
              "w": 26
            },
            {
              "id": "oldwoman",
              "img": "../art-scenes/c_g3_oldwoman.png",
              "label": "Old Woman",
              "say": "Oh, thank you! Now I can see the pharaoh!",
              "x": 37,
              "y": 40,
              "w": 26
            },
            {
              "id": "chariot",
              "img": "../art-scenes/o_g3_chariot.png",
              "label": "Golden Chariot",
              "say": "The pharaoh rode in a golden chariot with two wheels!",
              "x": 64,
              "y": 42,
              "w": 30
            }
          ]
        }
      },
      "77": {
        "page": 77,
        "title": "Reading 1: The Time Book (Part 4 — Try My Glasses)",
        "type": "Reading 1",
        "img": "../pages/G3-p77.png",
        "popScene": "g3_scene_r1_b.png",
        "video": "../extras/g3_vid_r1.mp4",
        "sound": "../extras/sounds/g3_magic_sparkle.mp3",
        "narration": "Oh, thank you, said the woman. I can't see very well. Try my glasses, said Jannah. Glasses? Yes, they help you see. Put them in front of your eyes. The old woman was surprised. Now I can see everything. There's the pharaoh! Fact: The ancient Egyptians made glass, but they didn't have eyeglasses yet.",
        "popWords": [
          {
            "word": "glasses",
            "img": "g3_word_glasses.png",
            "meaning": "Lenses worn on your face to see."
          },
          {
            "word": "surprised",
            "img": "g3_word_surprised.png",
            "meaning": "Feeling shocked when something unexpected happens."
          }
        ],
        "exercises": [
          {
            "id": "p77-story",
            "label": "Story Text: Try my glasses",
            "x": 6,
            "y": 6,
            "w": 44,
            "h": 38
          },
          {
            "id": "p77-fact",
            "label": "History Fact: Glass vs. Eyeglasses",
            "x": 5,
            "y": 80,
            "w": 32,
            "h": 14
          }
        ],
        "spots": [
          {
            "id": "g3-p77-1",
            "num": "1",
            "type": "blank",
            "x": 8,
            "y": 42,
            "w": 42,
            "h": 4.2,
            "prompt": "How did the old woman feel when she put on Jannah's glasses?",
            "answer": "She was surprised.",
            "options": [
              "She was surprised.",
              "She was angry.",
              "She was sleepy."
            ],
            "hint": "Look at her big smile when she sees the pharaoh!"
          }
        ],
        "scene3d": {
          "title": "Ancient Egypt — The Pharaoh’s Street",
          "bg": "../art-scenes/bg_g3_egypt_street.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Try my glasses! Put them in front of your eyes.",
              "x": 10,
              "y": 42,
              "w": 26
            },
            {
              "id": "oldwoman",
              "img": "../art-scenes/c_g3_oldwoman.png",
              "label": "Old Woman",
              "say": "Oh, thank you! Now I can see the pharaoh!",
              "x": 37,
              "y": 40,
              "w": 26
            },
            {
              "id": "chariot",
              "img": "../art-scenes/o_g3_chariot.png",
              "label": "Golden Chariot",
              "say": "The pharaoh rode in a golden chariot with two wheels!",
              "x": 64,
              "y": 42,
              "w": 30
            }
          ]
        }
      },
      "78": {
        "page": 78,
        "title": "Reading 1: The Time Book (Part 5 — Run!)",
        "type": "Reading 1",
        "img": "../pages/G3-p78.png",
        "popScene": "g3_scene_r1_c.png",
        "video": "../extras/g3_vid_r1.mp4",
        "sound": "../extras/sounds/g3_footsteps_run.mp3",
        "narration": "Who's that girl? asked the pharaoh. What strange clothes. Stop her! Oh, no! They're coming, said the old woman. Run! Jannah was scared. Did I do something wrong? she thought. She turned and ran. Wait! shouted a guard. Jannah ran through the ancient city. The streets were hot and dark. Suddenly, there was a hand on her shoulder.",
        "popWords": [
          {
            "word": "scared",
            "img": "../extras/pics/g3_scared.png",
            "meaning": "Feeling afraid or frightened."
          },
          {
            "word": "ancient",
            "img": "g3_word_ancient.png",
            "meaning": "Very, very old; from long ago."
          }
        ],
        "exercises": [
          {
            "id": "p78-top",
            "label": "Story Text: Stop her! Run!",
            "x": 46,
            "y": 5,
            "w": 50,
            "h": 28
          },
          {
            "id": "p78-bot",
            "label": "Story Text: Running through the ancient city",
            "x": 8,
            "y": 56,
            "w": 32,
            "h": 25
          }
        ],
        "spots": [
          {
            "id": "g3-p78-1",
            "num": "1",
            "type": "blank",
            "x": 8,
            "y": 82,
            "w": 38,
            "h": 4.2,
            "prompt": "How were the streets of the ancient city when Jannah ran?",
            "answer": "The streets were hot and dark.",
            "options": [
              "The streets were hot and dark.",
              "The streets were cold and snowy.",
              "The streets were wet and icy."
            ],
            "hint": "Read the last paragraph on page 78!"
          }
        ],
        "scene3d": {
          "title": "Ancient Egypt — The Pharaoh’s Street",
          "bg": "../art-scenes/bg_g3_egypt_street.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Try my glasses! Put them in front of your eyes.",
              "x": 10,
              "y": 42,
              "w": 26
            },
            {
              "id": "oldwoman",
              "img": "../art-scenes/c_g3_oldwoman.png",
              "label": "Old Woman",
              "say": "Oh, thank you! Now I can see the pharaoh!",
              "x": 37,
              "y": 40,
              "w": 26
            },
            {
              "id": "chariot",
              "img": "../art-scenes/o_g3_chariot.png",
              "label": "Golden Chariot",
              "say": "The pharaoh rode in a golden chariot with two wheels!",
              "x": 64,
              "y": 42,
              "w": 30
            }
          ]
        }
      },
      "79": {
        "page": 79,
        "title": "Reading 1: The Time Book (Part 6 — Waking Up)",
        "type": "Reading 1",
        "img": "../pages/G3-p79.png",
        "popScene": "g3_scene_r1_c.png",
        "video": "../extras/g3_vid_r1.mp4",
        "sound": "../extras/sounds/g3_page_turn.mp3",
        "narration": "Wake up, Jannah, said her mom. Jannah sat up in bed. She looked at the book. That's strange, she said. The picture looks different. ... And where are my glasses?",
        "popWords": [
          {
            "word": "Jannah waving",
            "img": "g3_char_main_wave.png",
            "meaning": "Jannah back in her bedroom in Cairo."
          },
          {
            "word": "glasses",
            "img": "g3_word_glasses.png",
            "meaning": "Where are Jannah's red glasses? On the book cover!"
          }
        ],
        "exercises": [
          {
            "id": "p79-story",
            "label": "Story Ending: Where are my glasses?",
            "x": 52,
            "y": 52,
            "w": 43,
            "h": 35
          }
        ],
        "spots": [
          {
            "id": "g3-p79-1",
            "num": "1",
            "type": "blank",
            "x": 52,
            "y": 78,
            "w": 42,
            "h": 4.5,
            "prompt": "Who is wearing Jannah's red glasses on the book cover now?",
            "answer": "The old woman in ancient Egypt!",
            "options": [
              "The old woman in ancient Egypt!",
              "The pharaoh on his throne!",
              "Jannah's mom!"
            ],
            "hint": "Look closely at the picture on the cover of The Time Book!"
          }
        ],
        "scene3d": {
          "title": "Ancient Egypt — The Pharaoh’s Street",
          "bg": "../art-scenes/bg_g3_egypt_street.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Try my glasses! Put them in front of your eyes.",
              "x": 10,
              "y": 42,
              "w": 26
            },
            {
              "id": "oldwoman",
              "img": "../art-scenes/c_g3_oldwoman.png",
              "label": "Old Woman",
              "say": "Oh, thank you! Now I can see the pharaoh!",
              "x": 37,
              "y": 40,
              "w": 26
            },
            {
              "id": "chariot",
              "img": "../art-scenes/o_g3_chariot.png",
              "label": "Golden Chariot",
              "say": "The pharaoh rode in a golden chariot with two wheels!",
              "x": 64,
              "y": 42,
              "w": 30
            }
          ]
        }
      },
      "80": {
        "page": 80,
        "title": "Explore the Reading — The Time Book",
        "type": "Explore the Reading",
        "img": "../pages/G3-p80.png",
        "popScene": "g3_scene_r1_b.png",
        "sound": "../extras/sounds/g3_magic_sparkle.mp3",
        "narration": "Page 80: Explore the Reading. A: Read and write True or False. B: Read and answer the questions. C: Think and discuss. Which of these things did ancient Egyptians not have?",
        "popWords": [
          {
            "word": "glasses",
            "img": "g3_word_glasses.png",
            "meaning": "Ancient Egyptians did NOT have eyeglasses!"
          },
          {
            "word": "chariot",
            "img": "g3_word_chariot.png",
            "meaning": "Ancient Egyptians had chariots."
          }
        ],
        "exercises": [
          {
            "id": "p80-exA",
            "label": "Ex A: Read and write True or False (1–5)",
            "x": 8,
            "y": 6,
            "w": 84,
            "h": 22
          },
          {
            "id": "p80-exB",
            "label": "Ex B: Read and answer the questions (1–5)",
            "x": 8,
            "y": 29,
            "w": 84,
            "h": 38
          },
          {
            "id": "p80-exC",
            "label": "Ex C: Which did ancient Egyptians NOT have?",
            "x": 8,
            "y": 68,
            "w": 84,
            "h": 25
          }
        ],
        "spots": [
          {
            "id": "g3-p80-a1",
            "num": "A1",
            "type": "blank",
            "x": 73.5,
            "y": 9.6,
            "w": 17.5,
            "h": 3,
            "prompt": "1. Jannah lived in ancient Egypt.",
            "answer": "False",
            "options": [
              "True",
              "False"
            ],
            "hint": "Jannah lives in modern Cairo and only visited ancient Egypt in her book."
          },
          {
            "id": "g3-p80-a2",
            "num": "A2",
            "type": "blank",
            "x": 73.5,
            "y": 13.3,
            "w": 17.5,
            "h": 3,
            "prompt": "2. She liked reading.",
            "answer": "True",
            "options": [
              "True",
              "False"
            ],
            "hint": "Page 73 says: Jannah lives in Cairo and loves to read!"
          },
          {
            "id": "g3-p80-a3",
            "num": "A3",
            "type": "blank",
            "x": 73.5,
            "y": 16.9,
            "w": 17.5,
            "h": 3,
            "prompt": "3. The old woman didn’t like Jannah.",
            "answer": "False",
            "options": [
              "True",
              "False"
            ],
            "hint": "The old woman said 'Oh, thank you!' and helped Jannah."
          },
          {
            "id": "g3-p80-a4",
            "num": "A4",
            "type": "blank",
            "x": 73.5,
            "y": 20.4,
            "w": 17.5,
            "h": 3,
            "prompt": "4. The old woman helped Jannah.",
            "answer": "True",
            "options": [
              "True",
              "False"
            ],
            "hint": "She warned Jannah: 'Oh, no! They're coming. Run!'"
          },
          {
            "id": "g3-p80-a5",
            "num": "A5",
            "type": "blank",
            "x": 73.5,
            "y": 24,
            "w": 17.5,
            "h": 3,
            "prompt": "5. Jannah woke up in the old woman’s house.",
            "answer": "False",
            "options": [
              "True",
              "False"
            ],
            "hint": "She woke up in her own bed with her mom!"
          },
          {
            "id": "g3-p80-b1",
            "num": "B1",
            "type": "blank",
            "x": 15,
            "y": 35.5,
            "w": 76,
            "h": 3.4,
            "prompt": "1. Where is Jannah when the story starts and ends?",
            "answer": "Jannah is in bed when the story starts and ends.",
            "options": [
              "Jannah is in bed when the story starts and ends.",
              "Jannah is at school when the story starts.",
              "Jannah is on a spacecraft."
            ],
            "hint": "Look at the blue example sentence on line 1!"
          },
          {
            "id": "g3-p80-b2",
            "num": "B2",
            "type": "blank",
            "x": 15,
            "y": 42.3,
            "w": 76,
            "h": 3.4,
            "prompt": "2. Why did Jannah look different to the people in ancient Egypt?",
            "answer": "She wore strange modern pajamas and glasses.",
            "options": [
              "She wore strange modern pajamas and glasses.",
              "She wore a gold pharaoh crown.",
              "She rode a big elephant."
            ],
            "hint": "What did the pharaoh say about her clothes?"
          },
          {
            "id": "g3-p80-b3",
            "num": "B3",
            "type": "blank",
            "x": 15,
            "y": 49.4,
            "w": 76,
            "h": 3.4,
            "prompt": "3. Why did Jannah run?",
            "answer": "Because the pharaoh said 'Stop her!' and she was scared.",
            "options": [
              "Because the pharaoh said 'Stop her!' and she was scared.",
              "Because she wanted to buy bread.",
              "Because it was raining."
            ],
            "hint": "The guards chased her and the old woman told her to run!"
          },
          {
            "id": "g3-p80-b4",
            "num": "B4",
            "type": "blank",
            "x": 15,
            "y": 56.5,
            "w": 76,
            "h": 3.4,
            "prompt": "4. Whose hand was on Jannah’s shoulder?",
            "answer": "Her mom’s hand was on her shoulder.",
            "options": [
              "Her mom’s hand was on her shoulder.",
              "The pharaoh’s hand was on her shoulder.",
              "The old woman’s hand."
            ],
            "hint": "Who said 'Wake up, Jannah' on page 79?"
          },
          {
            "id": "g3-p80-b5",
            "num": "B5",
            "type": "blank",
            "x": 15,
            "y": 63.5,
            "w": 76,
            "h": 3.4,
            "prompt": "5. What was strange about the book cover at the end of the story?",
            "answer": "The old woman on the cover had Jannah’s glasses!",
            "options": [
              "The old woman on the cover had Jannah’s glasses!",
              "The book cover was blank white.",
              "There was a dinosaur on the cover."
            ],
            "hint": "Look at the old woman's face on the cover on page 79!"
          },
          {
            "id": "g3-p80-c",
            "num": "C",
            "type": "choice",
            "x": 42.5,
            "y": 88,
            "w": 9.2,
            "h": 3.4,
            "group": "g3-p80-c",
            "text": "glasses",
            "correct": true,
            "answer": "glasses (Ancient Egyptians didn't have eyeglasses!)",
            "hint": "Remember the green note on page 77: they made glass, but didn't have eyeglasses yet!"
          }
        ],
        "scene3d": {
          "title": "Ancient Egypt — The Pharaoh’s Street",
          "bg": "../art-scenes/bg_g3_egypt_street.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Try my glasses! Put them in front of your eyes.",
              "x": 10,
              "y": 42,
              "w": 26
            },
            {
              "id": "oldwoman",
              "img": "../art-scenes/c_g3_oldwoman.png",
              "label": "Old Woman",
              "say": "Oh, thank you! Now I can see the pharaoh!",
              "x": 37,
              "y": 40,
              "w": 26
            },
            {
              "id": "chariot",
              "img": "../art-scenes/o_g3_chariot.png",
              "label": "Golden Chariot",
              "say": "The pharaoh rode in a golden chariot with two wheels!",
              "x": 64,
              "y": 42,
              "w": 30
            }
          ]
        }
      },
      "81": {
        "page": 81,
        "title": "Get Ready to Read — Main Idea and Details",
        "type": "Get Ready to Read",
        "img": "../pages/G3-p81.png",
        "popScene": "g3_scene_r2_a.png",
        "sound": "../extras/sounds/g3_dig_shovel.mp3",
        "narration": "Page 81: Identifying the Main Idea and Details. The main idea gives the most important information. It's the big idea! The details give extra information so you understand more.",
        "popWords": [
          {
            "word": "time capsule",
            "img": "g3_word_time_capsule.png",
            "meaning": "A special box of things saved for the future."
          },
          {
            "word": "objects",
            "img": "../extras/pics/g3_objects.png",
            "meaning": "Things that you can see and touch."
          }
        ],
        "exercises": [
          {
            "id": "p81-exA",
            "label": "Ex A: Underline the main idea",
            "x": 9,
            "y": 8,
            "w": 82,
            "h": 24
          },
          {
            "id": "p81-exB",
            "label": "Ex B: Write Main Idea or Detail (1–4)",
            "x": 9,
            "y": 42,
            "w": 82,
            "h": 28
          },
          {
            "id": "p81-exC",
            "label": "Ex C: Things to put in a time capsule",
            "x": 9,
            "y": 72,
            "w": 82,
            "h": 16
          }
        ],
        "spots": [
          {
            "id": "g3-p81-a",
            "num": "A",
            "type": "blank",
            "x": 14,
            "y": 18.5,
            "w": 42,
            "h": 4.5,
            "prompt": "A: Which sentence is the Main Idea of the paragraph?",
            "answer": "With her special book, she explored Cairo in ancient Egypt.",
            "options": [
              "With her special book, she explored Cairo in ancient Egypt.",
              "Jannah lived in Cairo.",
              "She met people from the past."
            ],
            "hint": "Which sentence tells the big idea of her whole adventure?"
          },
          {
            "id": "g3-p81-b1",
            "num": "B1",
            "type": "blank",
            "x": 16,
            "y": 56.2,
            "w": 70,
            "h": 3,
            "prompt": "Sentence 1: 'Many different things can go inside a time capsule.'",
            "answer": "Main Idea",
            "options": [
              "Main Idea",
              "Detail"
            ],
            "hint": "Sentence 1 tells the big idea about what goes inside a time capsule!"
          },
          {
            "id": "g3-p81-b2",
            "num": "B2",
            "type": "blank",
            "x": 16,
            "y": 59.8,
            "w": 70,
            "h": 3,
            "prompt": "Sentence 2: 'People put letters, pictures, and objects in them.'",
            "answer": "Detail",
            "options": [
              "Main Idea",
              "Detail"
            ],
            "hint": "Sentence 2 gives extra examples of the things people put inside."
          },
          {
            "id": "g3-p81-b3",
            "num": "B3",
            "type": "blank",
            "x": 16,
            "y": 63.2,
            "w": 70,
            "h": 3,
            "prompt": "Sentence 3: 'They put them in the ground.'",
            "answer": "Detail",
            "options": [
              "Main Idea",
              "Detail"
            ],
            "hint": "Sentence 3 gives extra information about where people put them."
          },
          {
            "id": "g3-p81-b4",
            "num": "B4",
            "type": "blank",
            "x": 16,
            "y": 66.8,
            "w": 70,
            "h": 3,
            "prompt": "Sentence 4: 'In the future, other people can dig and find them.'",
            "answer": "Detail",
            "options": [
              "Main Idea",
              "Detail"
            ],
            "hint": "Sentence 4 gives extra information about what happens in the future."
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      },
      "82": {
        "page": 82,
        "title": "Reading 2: Time Capsules (Part 1)",
        "type": "Reading 2",
        "img": "../pages/G3-p82.png",
        "popScene": "g3_scene_r2_a.png",
        "video": "../extras/g3_vid_r2.mp4",
        "sound": "../extras/sounds/g3_dig_shovel.mp3",
        "narration": "Time Capsules. Do you want people in the future to know about your life right now? One way you can do this is to make a time capsule. It's like giving a present from the past. Many different things can go inside a time capsule. People put letters, pictures, and objects in them. Kids put cool things like movies, music, video games, and toys in time capsules. They put them in the ground. In the future, other people can dig and find them.",
        "popWords": [
          {
            "word": "time capsule",
            "img": "g3_word_time_capsule.png",
            "meaning": "A container of objects saved for the future."
          },
          {
            "word": "objects",
            "img": "../extras/pics/g3_objects.png",
            "meaning": "Things that you can see and touch."
          },
          {
            "word": "future",
            "img": "../extras/pics/g3_future.png",
            "meaning": "The time that comes after now."
          }
        ],
        "exercises": [
          {
            "id": "p82-text",
            "label": "Reading Text: What is a time capsule?",
            "x": 6,
            "y": 12,
            "w": 60,
            "h": 52
          }
        ],
        "spots": [
          {
            "id": "g3-p82-1",
            "num": "★",
            "type": "blank",
            "x": 34,
            "y": 86,
            "w": 40,
            "h": 4.5,
            "prompt": "What is a time capsule?",
            "answer": "A box of objects from now for people in the future.",
            "options": [
              "A box of objects from now for people in the future.",
              "A fast chariot from ancient Egypt.",
              "A pair of red eyeglasses."
            ],
            "hint": "It is like giving a present from the past to the future!"
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      },
      "83": {
        "page": 83,
        "title": "Reading 2: Time Capsules (Part 2 — The 1795 Capsule) & Words",
        "type": "Reading 2 + Words",
        "img": "../pages/G3-p83.png",
        "popScene": "g3_scene_r2_a.png",
        "video": "../extras/g3_vid_r2.mp4",
        "sound": "../extras/sounds/g3_dig_shovel.mp3",
        "narration": "This time capsule is from 1795. People didn't find it until 2014. It was under a building in Massachusetts, USA. It had coins and newspapers in it. Words in Context: future, objects, newspapers, spacecraft, disc, Earth.",
        "popWords": [
          {
            "word": "future",
            "img": "../extras/pics/g3_future.png",
            "meaning": "The time that comes after now."
          },
          {
            "word": "objects",
            "img": "../extras/pics/g3_objects.png",
            "meaning": "Things that you can see and touch."
          },
          {
            "word": "newspapers",
            "img": "../extras/pics/g3_newspapers.png",
            "meaning": "Printed papers with news and stories."
          },
          {
            "word": "spacecraft",
            "img": "g3_word_spacecraft.png",
            "meaning": "A vehicle that travels in space."
          },
          {
            "word": "disc",
            "img": "../extras/pics/g3_disc.png",
            "meaning": "A flat, round object that holds information."
          },
          {
            "word": "Earth",
            "img": "g3_word_earth.png",
            "meaning": "The planet where we live."
          }
        ],
        "exercises": [
          {
            "id": "p83-text",
            "label": "Reading Text: The 1795 Massachusetts Time Capsule",
            "x": 8,
            "y": 42,
            "w": 86,
            "h": 16
          },
          {
            "id": "p83-words",
            "label": "Words in Context (6 Target Words)",
            "x": 52,
            "y": 80,
            "w": 44,
            "h": 15
          }
        ],
        "spots": [
          {
            "id": "g3-p83-1",
            "num": "★",
            "type": "blank",
            "x": 64,
            "y": 55,
            "w": 30,
            "h": 4.5,
            "prompt": "How many years did it take to find the 1795 time capsule in 2014?",
            "answer": "219 years (2014 - 1795 = 219)",
            "options": [
              "219 years (2014 - 1795 = 219)",
              "10 years",
              "40 years"
            ],
            "hint": "Subtract 1795 from 2014!"
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      },
      "84": {
        "page": 84,
        "title": "Reading 2: Time Capsules (Part 3 — Voyager & The Gold Disc)",
        "type": "Reading 2",
        "img": "../pages/G3-p84.png",
        "popScene": "g3_scene_r2_b.png",
        "video": "../extras/g3_vid_r2.mp4",
        "sound": "../extras/sounds/g3_voyager_signal.mp3",
        "narration": "More than forty years ago, people put time capsules in two spacecraft called Voyager 1 and Voyager 2. There are no people on the spacecraft, but each one has a gold disc. The gold disc is a time capsule. It says hello in 55 different languages.",
        "popWords": [
          {
            "word": "spacecraft",
            "img": "g3_word_spacecraft.png",
            "meaning": "A vehicle that travels in space."
          },
          {
            "word": "disc",
            "img": "../extras/pics/g3_disc.png",
            "meaning": "A flat, round golden record in space."
          }
        ],
        "exercises": [
          {
            "id": "p84-text",
            "label": "Reading Text: Voyager 1 & 2 and the Gold Disc",
            "x": 6,
            "y": 44,
            "w": 50,
            "h": 28
          }
        ],
        "spots": [
          {
            "id": "g3-p84-1",
            "num": "★",
            "type": "blank",
            "x": 8,
            "y": 69,
            "w": 44,
            "h": 4.5,
            "prompt": "How many different languages does the gold disc say hello in?",
            "answer": "55 different languages",
            "options": [
              "55 different languages",
              "2 languages",
              "100 languages"
            ],
            "hint": "Look at the number at the end of the paragraph!"
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      },
      "85": {
        "page": 85,
        "title": "Reading 2: Time Capsules (Part 4 — Sounds & Photos of Earth)",
        "type": "Reading 2",
        "img": "../pages/G3-p85.png",
        "popScene": "g3_scene_r2_b.png",
        "video": "../extras/g3_vid_r2.mp4",
        "sound": "../extras/sounds/g3_whale_song.mp3",
        "narration": "On the disc, there are also sounds of the sea, wind, thunder, and rain. There are the songs of birds, whales, and people. It also has photos of people, animals, and places on Earth. Voyager 1 and Voyager 2 went into space in 1977. Now, they are billions of kilometers from Earth. They are still in space today.",
        "popWords": [
          {
            "word": "Earth",
            "img": "g3_word_earth.png",
            "meaning": "The planet where we live."
          },
          {
            "word": "disc",
            "img": "../extras/pics/g3_disc.png",
            "meaning": "Carries sounds of whales, sea, and photos of Earth."
          }
        ],
        "exercises": [
          {
            "id": "p85-text",
            "label": "Reading Text: Sounds & Photos on the Gold Disc",
            "x": 35,
            "y": 74,
            "w": 60,
            "h": 20
          }
        ],
        "spots": [
          {
            "id": "g3-p85-1",
            "num": "★",
            "type": "blank",
            "x": 62,
            "y": 65,
            "w": 33,
            "h": 4.5,
            "prompt": "These are real photographs on the gold disc (from 1977). Do they look old or new?",
            "answer": "They look old (from 1977).",
            "options": [
              "They look old (from 1977).",
              "They look brand new from today."
            ],
            "hint": "Voyager went into space in 1977, more than forty years ago!"
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      },
      "86": {
        "page": 86,
        "title": "Explore the Reading & Phonics -nt",
        "type": "Explore the Reading + Phonics",
        "img": "../pages/G3-p86.png",
        "popScene": "g3_scene_r2_b.png",
        "sound": "../extras/sounds/g3_space_rocket.mp3",
        "narration": "Page 86: Explore the Reading. A: Read and choose the answer. B: Read and think. Then match. What's the main idea of each page? C: Check two things to tell people in the future about. Write a message. Phonics -nt: Listen and say: point, plant, front, invent, student.",
        "popWords": [
          {
            "word": "future",
            "img": "../extras/pics/g3_future.png",
            "meaning": "The time that comes after now."
          },
          {
            "word": "newspapers",
            "img": "../extras/pics/g3_newspapers.png",
            "meaning": "Printed papers with news and stories."
          },
          {
            "word": "spacecraft",
            "img": "g3_word_spacecraft.png",
            "meaning": "A vehicle that travels in space."
          },
          {
            "word": "Earth",
            "img": "g3_word_earth.png",
            "meaning": "The planet where we live."
          }
        ],
        "exercises": [
          {
            "id": "p86-exA",
            "label": "Ex A: Read and choose the answer (1–5)",
            "x": 8,
            "y": 6,
            "w": 84,
            "h": 22
          },
          {
            "id": "p86-exB",
            "label": "Ex B: Match the main idea of each page (1–4)",
            "x": 8,
            "y": 29,
            "w": 84,
            "h": 18
          },
          {
            "id": "p86-exC",
            "label": "Ex C: Check (✓) two things & write a message",
            "x": 8,
            "y": 48,
            "w": 84,
            "h": 30
          },
          {
            "id": "p86-phonics",
            "label": "Phonics -nt: point, plant, front, invent, student",
            "x": 8,
            "y": 79,
            "w": 84,
            "h": 15
          }
        ],
        "spots": [
          {
            "id": "g3-p86-a1",
            "num": "A1",
            "type": "choice",
            "x": 73.2,
            "y": 9.6,
            "w": 6.8,
            "h": 2.8,
            "group": "g3-p86-a1",
            "text": "future",
            "correct": true,
            "answer": "future",
            "hint": "Time capsules are saved for people in the future to find!"
          },
          {
            "id": "g3-p86-a2",
            "num": "A2",
            "type": "choice",
            "x": 66.8,
            "y": 13.2,
            "w": 12.2,
            "h": 2.8,
            "group": "g3-p86-a2",
            "text": "newspapers",
            "correct": true,
            "answer": "newspapers",
            "hint": "Page 83 says: 'It had coins and newspapers in it.'"
          },
          {
            "id": "g3-p86-a3",
            "num": "A3",
            "type": "choice",
            "x": 68.5,
            "y": 16.8,
            "w": 5.5,
            "h": 2.8,
            "group": "g3-p86-a3",
            "text": "forty",
            "correct": true,
            "answer": "forty",
            "hint": "Page 84 says: 'More than forty years ago...'"
          },
          {
            "id": "g3-p86-a4",
            "num": "A4",
            "type": "choice",
            "x": 69.2,
            "y": 20.4,
            "w": 18.2,
            "h": 2.8,
            "group": "g3-p86-a4",
            "text": "a lot of languages",
            "correct": true,
            "answer": "a lot of languages",
            "hint": "It says hello in 55 different languages!"
          },
          {
            "id": "g3-p86-a5",
            "num": "A5",
            "type": "choice",
            "x": 52.8,
            "y": 24,
            "w": 8.5,
            "h": 2.8,
            "group": "g3-p86-a5",
            "text": "in space",
            "correct": true,
            "answer": "in space",
            "hint": "Page 85 says: 'They are still in space today.'"
          },
          {
            "id": "g3-p86-b1",
            "num": "B1",
            "type": "match",
            "x": 12,
            "y": 32.8,
            "w": 78,
            "h": 2.8,
            "leftText": "1 page 82",
            "rightText": "d. what a time capsule is",
            "answer": "1 → d (what a time capsule is)",
            "options": [
              "a. time capsules from the past",
              "b. time capsules in spacecraft",
              "c. what’s inside the spacecraft’s time capsule",
              "d. what a time capsule is"
            ],
            "correctOption": "d. what a time capsule is",
            "hint": "Page 82 explains what a time capsule is and what people put inside!"
          },
          {
            "id": "g3-p86-b2",
            "num": "B2",
            "type": "match",
            "x": 12,
            "y": 36.2,
            "w": 78,
            "h": 2.8,
            "leftText": "2 page 83",
            "rightText": "a. time capsules from the past",
            "answer": "2 → a (time capsules from the past)",
            "options": [
              "a. time capsules from the past",
              "b. time capsules in spacecraft",
              "c. what’s inside the spacecraft’s time capsule",
              "d. what a time capsule is"
            ],
            "correctOption": "a. time capsules from the past",
            "hint": "Page 83 is about the old time capsule from 1795!"
          },
          {
            "id": "g3-p86-b3",
            "num": "B3",
            "type": "match",
            "x": 12,
            "y": 39.8,
            "w": 78,
            "h": 2.8,
            "leftText": "3 page 84",
            "rightText": "b. time capsules in spacecraft",
            "answer": "3 → b (time capsules in spacecraft)",
            "options": [
              "a. time capsules from the past",
              "b. time capsules in spacecraft",
              "c. what’s inside the spacecraft’s time capsule",
              "d. what a time capsule is"
            ],
            "correctOption": "b. time capsules in spacecraft",
            "hint": "Page 84 introduces the Voyager 1 and Voyager 2 spacecraft!"
          },
          {
            "id": "g3-p86-b4",
            "num": "B4",
            "type": "match",
            "x": 12,
            "y": 43.2,
            "w": 78,
            "h": 2.8,
            "leftText": "4 page 85",
            "rightText": "c. what’s inside the spacecraft’s time capsule",
            "answer": "4 → c (what’s inside the spacecraft’s time capsule)",
            "options": [
              "a. time capsules from the past",
              "b. time capsules in spacecraft",
              "c. what’s inside the spacecraft’s time capsule",
              "d. what a time capsule is"
            ],
            "correctOption": "c. what’s inside the spacecraft’s time capsule",
            "hint": "Page 85 tells about the sounds and photos on the gold disc!"
          },
          {
            "id": "g3-p86-c1",
            "num": "C✓",
            "type": "tick",
            "x": 14,
            "y": 61,
            "w": 4.2,
            "h": 2.8,
            "answer": "✓",
            "hint": "Tap to check two topics to tell people in the future about!"
          },
          {
            "id": "g3-p86-c2",
            "num": "C✓",
            "type": "tick",
            "x": 14,
            "y": 71.8,
            "w": 4.2,
            "h": 2.8,
            "answer": "✓",
            "hint": "Tap to check your second topic!"
          },
          {
            "id": "g3-p86-cmsg",
            "num": "C✎",
            "type": "blank",
            "x": 57,
            "y": 61,
            "w": 29,
            "h": 8,
            "prompt": "Write a short message to people in the future:",
            "answer": "Hello future! I love my school and books.",
            "options": [
              "Hello future! I love my school and books.",
              "Hello! Every student loves planet Earth.",
              "We play fun games every day."
            ],
            "hint": "Start with 'Hello!' and tell them about your school or things you do every day."
          },
          {
            "id": "g3-p86-nt",
            "num": "-nt",
            "type": "blank",
            "x": 15,
            "y": 90.8,
            "w": 72,
            "h": 3,
            "prompt": "Find more words ending with -nt in the reading:",
            "answer": "want, front, ancient, different, present, went",
            "options": [
              "want, front, ancient, different, present, went",
              "book, city, glasses, space",
              "pharaoh, chariot, future, Earth"
            ],
            "hint": "Look for words ending in the letters n-t!"
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      },
      "87": {
        "page": 87,
        "title": "Think Together & My Reading Journal",
        "type": "Think Together / Review",
        "img": "../pages/G3-p87.png",
        "popScene": "g3_cover.png",
        "sound": "../extras/sounds/g3_magic_sparkle.mp3",
        "narration": "Page 87: Think Together. How can we find out about the past? A: Read, think, and check. B: Take the quiz. What do you do to learn about the past? C: Share your ideas for learning about the past. My Reading Journal.",
        "popWords": [
          {
            "word": "ancient",
            "img": "g3_word_ancient.png",
            "meaning": "Very, very old; from long ago."
          },
          {
            "word": "time capsule",
            "img": "g3_word_time_capsule.png",
            "meaning": "A special box saved for the future."
          }
        ],
        "exercises": [
          {
            "id": "p87-exA",
            "label": "Ex A: Read, think, and check (The Time Book vs Time Capsules)",
            "x": 10,
            "y": 11,
            "w": 83,
            "h": 29
          },
          {
            "id": "p87-exB",
            "label": "Ex B: Take the quiz (1–6)",
            "x": 10,
            "y": 41,
            "w": 80,
            "h": 23
          },
          {
            "id": "p87-journal",
            "label": "My Reading Journal",
            "x": 8,
            "y": 72,
            "w": 86,
            "h": 22
          }
        ],
        "spots": [
          {
            "id": "g3-p87-a1",
            "num": "A1",
            "type": "tick",
            "x": 61.5,
            "y": 18.8,
            "w": 5.5,
            "h": 3,
            "answer": "✓ The Time Book",
            "hint": "1. Someone looks at pictures in a book → The Time Book!"
          },
          {
            "id": "g3-p87-a2",
            "num": "A2",
            "type": "tick",
            "x": 80.5,
            "y": 22.3,
            "w": 5.5,
            "h": 3,
            "answer": "✓ Time Capsules",
            "hint": "2. Someone looks at coins and newspapers → Time Capsules (1795 box)!"
          },
          {
            "id": "g3-p87-a3",
            "num": "A3",
            "type": "tick",
            "x": 61.5,
            "y": 25.8,
            "w": 5.5,
            "h": 3,
            "answer": "✓ The Time Book",
            "hint": "3. Someone reads a story about the past → Jannah in The Time Book!"
          },
          {
            "id": "g3-p87-a4",
            "num": "A4",
            "type": "tick",
            "x": 80.5,
            "y": 29.5,
            "w": 5.5,
            "h": 3,
            "answer": "✓ Time Capsules",
            "hint": "4. Someone finds something old in the ground → Time Capsules!"
          },
          {
            "id": "g3-p87-a5",
            "num": "A5",
            "type": "tick",
            "x": 61.5,
            "y": 33,
            "w": 5.5,
            "h": 3,
            "answer": "✓ The Time Book",
            "hint": "5. Someone imagines life in an ancient city → The Time Book!"
          },
          {
            "id": "g3-p87-a6",
            "num": "A6",
            "type": "tick",
            "x": 80.5,
            "y": 36.5,
            "w": 5.5,
            "h": 3,
            "answer": "✓ Time Capsules",
            "hint": "6. Someone writes messages for the future → Time Capsules!"
          },
          {
            "id": "g3-p87-j1",
            "num": "J1",
            "type": "blank",
            "x": 14,
            "y": 79.2,
            "w": 76,
            "h": 3.4,
            "prompt": "Find five interesting or new words from Unit 5:",
            "answer": "1. pharaoh  2. chariot  3. ancient  4. spacecraft  5. disc",
            "options": [
              "1. pharaoh  2. chariot  3. ancient  4. spacecraft  5. disc",
              "1. strange  2. surprised  3. scared  4. future  5. Earth"
            ],
            "hint": "Choose any 5 target words from Unit 5!"
          },
          {
            "id": "g3-p87-j2",
            "num": "J2",
            "type": "blank",
            "x": 35,
            "y": 86.8,
            "w": 56,
            "h": 3.8,
            "prompt": "What person or event from history do you want to find out about? I want to learn about...",
            "answer": "ancient Egypt and the pharaohs",
            "options": [
              "ancient Egypt and the pharaohs",
              "the Voyager 1 spacecraft in 1977",
              "dinosaurs from millions of years ago"
            ],
            "hint": "Complete the sentence: I want to learn about..."
          }
        ],
        "scene3d": {
          "title": "Digging Up a Time Capsule",
          "bg": "../art-scenes/bg_g3_garden_dig.png",
          "items": [
            {
              "id": "jannah",
              "img": "../art-scenes/c_g3_jannah.png",
              "label": "Jannah",
              "say": "Making a time capsule is like giving a present from the past!",
              "x": 18,
              "y": 38,
              "w": 30
            },
            {
              "id": "timecapsule",
              "img": "../art-scenes/o_g3_timecapsule.png",
              "label": "Time Capsule",
              "say": "Inside the time capsule there are old coins, newspapers, and toys!",
              "x": 52,
              "y": 45,
              "w": 34
            }
          ]
        }
      }
    }
  },
  "g4": {
    "grade": 4,
    "title": "Unit 5: Make Some Noise",
    "bookTitle": "Global Readings Level 3",
    "bigQuestion": "What different types of sounds are in our world?",
    "classes": [
      "4A",
      "4B"
    ],
    "hookVideo": "../extras/g4_vid_hook.mp4",
    "r1Video": "../extras/g4_vid_r1.mp4",
    "r2Video": "../extras/g4_vid_r2.mp4",
    "pages": {
      "72": {
        "page": 72,
        "title": "Unit 5 Opener — Make Some Noise",
        "type": "Opener",
        "img": "../pages/G4-p72.png",
        "popScene": "g4_cover.png",
        "video": "../extras/g4_vid_hook.mp4",
        "sound": "../extras/sounds/g4_drum.mp3",
        "narration": "Unit 5: Make Some Noise! Activating prior knowledge about noise and silence. Listen to the festival drums and wooden flutes in the parade!",
        "popWords": [
          {
            "word": "orchestra",
            "img": "g4_word_orchestra.png",
            "meaning": "A big group of musicians playing instruments."
          },
          {
            "word": "voices",
            "img": "../extras/pics/g4_voices.png",
            "meaning": "The sounds people make when speaking or singing."
          }
        ],
        "exercises": [
          {
            "id": "g4-p72-opener",
            "label": "Unit 5 Title & Festival Musicians",
            "x": 5,
            "y": 12,
            "w": 90,
            "h": 80
          }
        ],
        "spots": [
          {
            "id": "g4-p72-1",
            "num": "1",
            "type": "blank",
            "x": 10,
            "y": 42,
            "w": 46,
            "h": 5,
            "prompt": "What instruments are the men playing in the festival parade?",
            "answer": "Drums and wooden flutes",
            "options": [
              "Drums and wooden flutes",
              "Pianos and violins",
              "Electric guitars"
            ],
            "hint": "Look at the big drum in front and the wooden flutes!"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "73": {
        "page": 73,
        "title": "Get Ready to Read — Question Starts",
        "type": "Get Ready to Read",
        "img": "../pages/G4-p73.png",
        "popScene": "g4_cover.png",
        "video": "../extras/g4_vid_hook.mp4",
        "sound": "../extras/sounds/g4_loud_quiet.mp3",
        "narration": "Get Ready to Read: Question Starts. Who, What, Where, When, Why, How. What are they doing? What sounds do the instruments make? Is this a parade? Why are they dressed in special clothes? Exercise E: What different sounds do these make? When are they loud? When are they quiet? A car engine, a guitar, a feather falling, a crowd at a soccer game.",
        "popWords": [
          {
            "word": "artist",
            "img": "../extras/pics/g4_artist.png",
            "meaning": "A creative person who makes art or sound."
          },
          {
            "word": "realistic",
            "img": "../extras/pics/g4_realistic.png",
            "meaning": "Looking or sounding just like real life."
          }
        ],
        "exercises": [
          {
            "id": "g4-p73-exA",
            "label": "Ex A & B: Brainstorm Questions (Who, What, Where, When, Why, How)",
            "x": 39,
            "y": 13,
            "w": 52,
            "h": 26
          },
          {
            "id": "g4-p73-exC",
            "label": "Ex C: Talk about your ideas with your partner",
            "x": 39,
            "y": 40,
            "w": 52,
            "h": 14
          },
          {
            "id": "g4-p73-exDE",
            "label": "Ex D & E: Noisy vs. Quiet (car engine, guitar, feather, crowd)",
            "x": 39,
            "y": 56,
            "w": 52,
            "h": 24
          }
        ],
        "spots": [
          {
            "id": "g4-p73-a",
            "num": "A",
            "type": "blank",
            "x": 44,
            "y": 26.2,
            "w": 44,
            "h": 3.6,
            "prompt": "A: Write a question about the picture using What or Why:",
            "answer": "What sounds do the instruments make?",
            "options": [
              "What sounds do the instruments make?",
              "Why are they wearing colorful hats?",
              "Where is this music festival?"
            ],
            "hint": "Use Who, What, Where, When, Why, or How!"
          },
          {
            "id": "g4-p73-e1",
            "num": "E1",
            "type": "blank",
            "x": 44,
            "y": 73.5,
            "w": 20,
            "h": 4,
            "prompt": "Is a feather falling loud or quiet?",
            "answer": "Very quiet (silent)",
            "options": [
              "Very quiet (silent)",
              "Very loud!"
            ],
            "hint": "Does a soft feather make noise when it falls?"
          },
          {
            "id": "g4-p73-e2",
            "num": "E2",
            "type": "blank",
            "x": 67,
            "y": 72.5,
            "w": 20,
            "h": 5,
            "prompt": "When is a crowd at a soccer game very loud?",
            "answer": "When a team scores a goal!",
            "options": [
              "When a team scores a goal!",
              "When everyone is sleeping."
            ],
            "hint": "What makes soccer fans cheer and shout?"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "74": {
        "page": 74,
        "title": "Reading 1: The Art of Sound (Part 1 — Knights & Movie Magic)",
        "type": "Reading 1",
        "img": "../pages/G4-p74.png",
        "popScene": "g4_scene_r1_a.png",
        "video": "../extras/g4_vid_r1.mp4",
        "sound": "../extras/sounds/g4_swords_crash.mp3",
        "narration": "The Art of Sound. A knight runs through a castle, and a man chases after him. Their heavy boots thud on the floor. They pull out their swords. They fight. Their swords crash together with a loud smash. But this isn't a real castle. It's fake. This is a movie. The swords are made of plastic. The castle is made of wood. So why are the sounds so realistic?",
        "popWords": [
          {
            "word": "knight",
            "img": "g4_word_knight.png",
            "meaning": "A soldier in metal armor from long ago."
          },
          {
            "word": "swords",
            "img": "g4_word_swords.png",
            "meaning": "Long, sharp metal weapons used for fighting."
          },
          {
            "word": "realistic",
            "img": "../extras/pics/g4_realistic.png",
            "meaning": "Looking or sounding just like real life."
          }
        ],
        "exercises": [
          {
            "id": "g4-p74-text",
            "label": "Reading Text: Knights on a Movie Set",
            "x": 10,
            "y": 40,
            "w": 72,
            "h": 22
          }
        ],
        "spots": [
          {
            "id": "g4-p74-1",
            "num": "★",
            "type": "blank",
            "x": 12,
            "y": 58,
            "w": 52,
            "h": 4.2,
            "prompt": "In the movie, what are the knights' swords really made of?",
            "answer": "The swords are made of plastic.",
            "options": [
              "The swords are made of plastic.",
              "The swords are made of heavy gold.",
              "The swords are made of glass."
            ],
            "hint": "Read paragraph 2: 'This is a movie. The swords are made of...'"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "75": {
        "page": 75,
        "title": "Reading 1: The Art of Sound (Part 2 — Foley Artists) & Words",
        "type": "Reading 1 + Words",
        "img": "../pages/G4-p75.png",
        "popScene": "g4_scene_r1_b.png",
        "video": "../extras/g4_vid_r1.mp4",
        "sound": "../extras/sounds/g4_rain.mp3",
        "narration": "This is the job of a Foley artist, a person who puts special sounds into movies. A Foley artist is a sound artist. Often when people make a movie, they only record the actors' voices. It is sometimes too noisy outside to record every sound, like a bee buzzing or a dog barking. But these sounds are important. Foley artists record new sounds that are louder and clearer. Words in Context: knight, swords, realistic, artist, record, voices, studio.",
        "popWords": [
          {
            "word": "artist",
            "img": "../extras/pics/g4_artist.png",
            "meaning": "A creative person who makes art or sound."
          },
          {
            "word": "record",
            "img": "g4_word_record.png",
            "meaning": "To save sounds or video on a machine."
          },
          {
            "word": "voices",
            "img": "../extras/pics/g4_voices.png",
            "meaning": "The sounds people make when speaking or singing."
          },
          {
            "word": "studio",
            "img": "g4_word_studio.png",
            "meaning": "A special room where people make movies or music."
          }
        ],
        "exercises": [
          {
            "id": "g4-p75-text",
            "label": "Reading Text: What is a Foley Artist?",
            "x": 8,
            "y": 38,
            "w": 58,
            "h": 35
          },
          {
            "id": "g4-p75-words",
            "label": "Words in Context (7 Target Words)",
            "x": 52,
            "y": 80,
            "w": 44,
            "h": 15
          }
        ],
        "spots": [
          {
            "id": "g4-p75-1",
            "num": "★",
            "type": "blank",
            "x": 10,
            "y": 69,
            "w": 44,
            "h": 4.2,
            "prompt": "Why do Foley artists record new sounds in a studio?",
            "answer": "Because it is too noisy outside!",
            "options": [
              "Because it is too noisy outside!",
              "Because actors cannot speak.",
              "Because movies have no cameras."
            ],
            "hint": "Look at the car in the rain: outside is too noisy to record small sounds!"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "76": {
        "page": 76,
        "title": "Reading 1: The Art of Sound (Part 3 — Inside the Studio)",
        "type": "Reading 1",
        "img": "../pages/G4-p76.png",
        "popScene": "g4_scene_r1_b.png",
        "video": "../extras/g4_vid_r1.mp4",
        "sound": "../extras/sounds/g4_thunder.mp3",
        "narration": "Foley artists work in a special studio. They watch the movie and pay attention to what the actors are doing. When the actor walks on a wooden floor, the Foley artist makes the sound of footsteps. When the actor breaks a window, the Foley artist records the sound of real glass breaking. Is there going to be a storm in the movie? The Foley artist can make the sound of thunder by moving a thin piece of metal.",
        "popWords": [
          {
            "word": "studio",
            "img": "g4_word_studio.png",
            "meaning": "A special room where people make movies or music."
          },
          {
            "word": "record",
            "img": "g4_word_record.png",
            "meaning": "To save sounds with a microphone."
          }
        ],
        "exercises": [
          {
            "id": "g4-p76-text",
            "label": "Reading Text: Footsteps, Glass & Thunder",
            "x": 8,
            "y": 36,
            "w": 68,
            "h": 30
          }
        ],
        "spots": [
          {
            "id": "g4-p76-1",
            "num": "★",
            "type": "blank",
            "x": 68,
            "y": 82,
            "w": 28,
            "h": 4.5,
            "prompt": "How does a Foley artist make the sound of thunder?",
            "answer": "By moving a thin piece of metal.",
            "options": [
              "By moving a thin piece of metal.",
              "By waiting for a real storm.",
              "By closing a big book."
            ],
            "hint": "Read the last sentence of paragraph 1 on page 76!"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "77": {
        "page": 77,
        "title": "Reading 1: The Art of Sound (Part 4 — Foley Tricks & Props)",
        "type": "Reading 1",
        "img": "../pages/G4-p77.png",
        "popScene": "g4_scene_r1_c.png",
        "video": "../extras/g4_vid_r1.mp4",
        "sound": "../extras/sounds/g4_coconut_horse.mp3",
        "narration": "In a Foley studio, there are many tools. The artist uses different things to get the right sound. There are different kinds of floors, shoes, and books. An old chair can make a loud squeak. Two pieces of coconut banged together can make the sound of a horse walking. Keys can make the sound of a knight marching. A head of lettuce can make a soft crunch. And a big book closing quickly can sound like a punch! These are just a few of the sound artist's tricks.",
        "popWords": [
          {
            "word": "artist",
            "img": "../extras/pics/g4_artist.png",
            "meaning": "Foley artist banging two coconut halves together."
          },
          {
            "word": "knight",
            "img": "g4_word_knight.png",
            "meaning": "Shaking keys sounds like a knight marching!"
          }
        ],
        "exercises": [
          {
            "id": "g4-p77-text",
            "label": "Reading Text: Coconut, Keys, Lettuce & Book Tricks",
            "x": 10,
            "y": 52,
            "w": 62,
            "h": 36
          }
        ],
        "spots": [
          {
            "id": "g4-p77-1",
            "num": "★",
            "type": "blank",
            "x": 12,
            "y": 86,
            "w": 48,
            "h": 4.2,
            "prompt": "What do two pieces of coconut banged together sound like?",
            "answer": "A horse walking!",
            "options": [
              "A horse walking!",
              "A bee buzzing!",
              "A window breaking!"
            ],
            "hint": "Clip-clop, clip-clop! Tap the speaker to hear the coconut shells!"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "78": {
        "page": 78,
        "title": "Explore the Reading & Spelling Pattern ou",
        "type": "Explore the Reading + Phonics",
        "img": "../pages/G4-p78.png",
        "popScene": "g4_scene_r1_c.png",
        "sound": "../extras/sounds/g4_keys_jingle.mp3",
        "narration": "Page 78: Explore the Reading. A: Answer the questions. B: Think and discuss. What makes a good Foley artist? C: Think and write. Imagine a Foley artist copied sounds from your day. Spelling Pattern ou: Listen and write: 1 touch, 2 house, 3 count, 4 pound, 5 young.",
        "popWords": [
          {
            "word": "artist",
            "img": "../extras/pics/g4_artist.png",
            "meaning": "A person who puts special sounds into movies."
          },
          {
            "word": "studio",
            "img": "g4_word_studio.png",
            "meaning": "A Foley artist works in a special studio."
          }
        ],
        "exercises": [
          {
            "id": "g4-p78-exA",
            "label": "Ex A: Answer the questions (1–5)",
            "x": 8,
            "y": 6,
            "w": 82,
            "h": 34
          },
          {
            "id": "g4-p78-exB",
            "label": "Ex B: What makes a good Foley artist?",
            "x": 8,
            "y": 42,
            "w": 56,
            "h": 12
          },
          {
            "id": "g4-p78-exC",
            "label": "Ex C: 4 Sounds from your day",
            "x": 8,
            "y": 55,
            "w": 56,
            "h": 22
          },
          {
            "id": "g4-p78-ou",
            "label": "Spelling Pattern ou (1–5)",
            "x": 8,
            "y": 79,
            "w": 84,
            "h": 15
          }
        ],
        "spots": [
          {
            "id": "g4-p78-a1",
            "num": "A1",
            "type": "blank",
            "x": 15,
            "y": 12.2,
            "w": 72,
            "h": 3.2,
            "prompt": "1. What does a Foley artist do?",
            "answer": "A Foley artist puts special sounds into movies.",
            "options": [
              "A Foley artist puts special sounds into movies.",
              "A Foley artist paints pictures of castles.",
              "A Foley artist conducts an orchestra."
            ],
            "hint": "Read the first sentence on page 75!"
          },
          {
            "id": "g4-p78-a2",
            "num": "A2",
            "type": "blank",
            "x": 15,
            "y": 18.2,
            "w": 72,
            "h": 3.2,
            "prompt": "2. Where does the name 'Foley artist' come from?",
            "answer": "It comes from Jack Foley.",
            "options": [
              "It comes from Jack Foley.",
              "It comes from Ludwig van Beethoven.",
              "It comes from a big castle."
            ],
            "hint": "Check the teal sticky note on page 75!"
          },
          {
            "id": "g4-p78-a3",
            "num": "A3",
            "type": "blank",
            "x": 15,
            "y": 24.4,
            "w": 72,
            "h": 3.2,
            "prompt": "3. Why do movies need a Foley artist?",
            "answer": "Because it is too noisy outside to record every sound.",
            "options": [
              "Because it is too noisy outside to record every sound.",
              "Because movies do not have actors.",
              "Because plastic swords are too heavy."
            ],
            "hint": "Foley artists record new sounds that are louder and clearer!"
          },
          {
            "id": "g4-p78-a4",
            "num": "A4",
            "type": "blank",
            "x": 15,
            "y": 30.6,
            "w": 72,
            "h": 3.2,
            "prompt": "4. Where does a Foley artist work?",
            "answer": "In a special studio.",
            "options": [
              "In a special studio.",
              "In an ancient city.",
              "On a spacecraft."
            ],
            "hint": "Read the first line on page 76!"
          },
          {
            "id": "g4-p78-a5",
            "num": "A5",
            "type": "blank",
            "x": 15,
            "y": 36.8,
            "w": 72,
            "h": 3.2,
            "prompt": "5. What are some of the tools a Foley artist uses?",
            "answer": "Shoes, books, an old chair, coconuts, keys, and lettuce.",
            "options": [
              "Shoes, books, an old chair, coconuts, keys, and lettuce.",
              "Only computers and pianos.",
              "Real metal swords and horses."
            ],
            "hint": "Look at the props on page 77!"
          },
          {
            "id": "g4-p78-c1",
            "num": "C1",
            "type": "blank",
            "x": 15,
            "y": 61.2,
            "w": 48,
            "h": 3,
            "prompt": "C: 4 sounds from your day (1–4):",
            "answer": "1. school bell  2. footsteps  3. closing a book  4. crunching an apple",
            "options": [
              "1. school bell  2. footsteps  3. closing a book  4. crunching an apple",
              "1. brushing teeth  2. bus engine  3. pencil writing  4. friends laughing"
            ],
            "hint": "Think of 4 everyday sounds you hear at home or school!"
          },
          {
            "id": "g4-p78-ou1",
            "num": "ou1",
            "type": "blank",
            "x": 15.2,
            "y": 85.8,
            "w": 9.8,
            "h": 3,
            "prompt": "Spelling Pattern ou — 1. t_______",
            "answer": "touch",
            "options": [
              "touch",
              "teach",
              "tooth"
            ],
            "hint": "Starts with t and has ou in the middle!"
          },
          {
            "id": "g4-p78-ou2",
            "num": "ou2",
            "type": "blank",
            "x": 31.2,
            "y": 85.8,
            "w": 9.8,
            "h": 3,
            "prompt": "Spelling Pattern ou — 2. h_______",
            "answer": "house",
            "options": [
              "house",
              "horse",
              "happy"
            ],
            "hint": "A building where a family lives (h-o-u-s-e)!"
          },
          {
            "id": "g4-p78-ou3",
            "num": "ou3",
            "type": "blank",
            "x": 47,
            "y": 85.8,
            "w": 9.8,
            "h": 3,
            "prompt": "Spelling Pattern ou — 3. c_______",
            "answer": "count",
            "options": [
              "count",
              "catch",
              "clean"
            ],
            "hint": "1, 2, 3, 4, 5 — to say numbers in order (c-o-u-n-t)!"
          },
          {
            "id": "g4-p78-ou4",
            "num": "ou4",
            "type": "blank",
            "x": 63,
            "y": 85.8,
            "w": 9.8,
            "h": 3,
            "prompt": "Spelling Pattern ou — 4. p_______",
            "answer": "pound",
            "options": [
              "pound",
              "proud",
              "plant"
            ],
            "hint": "p-o-u-n-d (or p-r-o-u-d)!"
          },
          {
            "id": "g4-p78-ou5",
            "num": "ou5",
            "type": "blank",
            "x": 78.8,
            "y": 85.8,
            "w": 9.8,
            "h": 3,
            "prompt": "Spelling Pattern ou — 5. y_______",
            "answer": "young",
            "options": [
              "young",
              "yellow",
              "year"
            ],
            "hint": "Not old — when Beethoven was a child, he was y-o-u-n-g!"
          },
          {
            "id": "g4-p78-ouread",
            "num": "ou+",
            "type": "blank",
            "x": 56,
            "y": 89.2,
            "w": 34,
            "h": 3,
            "prompt": "More words with ou in Reading 1:",
            "answer": "out, loud, louder, sound, sounds, outside",
            "options": [
              "out, loud, louder, sound, sounds, outside",
              "knight, sword, studio, artist"
            ],
            "hint": "Look for o-u in Reading 1!"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "79": {
        "page": 79,
        "title": "Get Ready to Read — Understanding Cause and Effect",
        "type": "Get Ready to Read",
        "img": "../pages/G4-p79.png",
        "popScene": "g4_scene_r2_a.png",
        "sound": "../extras/sounds/g4_crunch_lettuce.mp3",
        "narration": "Page 79: Understanding Cause and Effect. A: What can cause each of these sounds? 1 CRUNCH! 2 SQUEAK! 3 BUZZ! In stories and in our lives, the reason something happens is the cause. The effect is what happens. B: Read these facts about Ludwig van Beethoven, a famous composer. Match the cause to the effect.",
        "popWords": [
          {
            "word": "composer",
            "img": "g4_word_composer.png",
            "meaning": "A person who writes music."
          },
          {
            "word": "Beethoven",
            "img": "g4_char_main.png",
            "meaning": "Ludwig van Beethoven, the famous composer."
          }
        ],
        "exercises": [
          {
            "id": "g4-p79-exA",
            "label": "Ex A: What can cause CRUNCH! SQUEAK! BUZZ!?",
            "x": 10,
            "y": 8,
            "w": 80,
            "h": 31
          },
          {
            "id": "g4-p79-exB",
            "label": "Ex B: Match Beethoven Cause to Effect (1–4)",
            "x": 10,
            "y": 49,
            "w": 80,
            "h": 25
          },
          {
            "id": "g4-p79-exC",
            "label": "Ex C: Do all people hear well?",
            "x": 10,
            "y": 75,
            "w": 80,
            "h": 12
          }
        ],
        "spots": [
          {
            "id": "g4-p79-a1",
            "num": "A1",
            "type": "blank",
            "x": 16.5,
            "y": 26,
            "w": 18.5,
            "h": 6,
            "prompt": "1. What can cause a CRUNCH! sound?",
            "answer": "Eating an apple or lettuce",
            "options": [
              "Eating an apple or lettuce",
              "A bee flying",
              "An old chair"
            ],
            "hint": "Remember what made a soft crunch in the Foley studio!"
          },
          {
            "id": "g4-p79-a2",
            "num": "A2",
            "type": "blank",
            "x": 41,
            "y": 26,
            "w": 18.5,
            "h": 6,
            "prompt": "2. What can cause a SQUEAK! sound?",
            "answer": "An old chair or a mouse",
            "options": [
              "An old chair or a mouse",
              "Heavy boots",
              "Thunder"
            ],
            "hint": "What made a loud squeak on page 77?"
          },
          {
            "id": "g4-p79-a3",
            "num": "A3",
            "type": "blank",
            "x": 65,
            "y": 26,
            "w": 18.5,
            "h": 6,
            "prompt": "3. What can cause a BUZZ! sound?",
            "answer": "A flying bee",
            "options": [
              "A flying bee",
              "Two coconuts",
              "A plastic sword"
            ],
            "hint": "What yellow-and-black insect goes bzzzz?"
          },
          {
            "id": "g4-p79-b1",
            "num": "B1",
            "type": "match",
            "x": 14,
            "y": 57.5,
            "w": 74,
            "h": 3.5,
            "leftText": "1 He practiced his piano for many hours.",
            "rightText": "b. He became a great piano player.",
            "answer": "1 → b (He became a great piano player.)",
            "options": [
              "a. He got a job.",
              "b. He became a great piano player.",
              "c. He couldn’t hear music anymore.",
              "d. He learned a lot about writing music."
            ],
            "correctOption": "b. He became a great piano player.",
            "hint": "What happens when you practice the piano for many hours?"
          },
          {
            "id": "g4-p79-b2",
            "num": "B2",
            "type": "match",
            "x": 14,
            "y": 62.2,
            "w": 74,
            "h": 3.2,
            "leftText": "2 His family needed money.",
            "rightText": "a. He got a job.",
            "answer": "2 → a (He got a job.)",
            "options": [
              "a. He got a job.",
              "b. He became a great piano player.",
              "c. He couldn’t hear music anymore.",
              "d. He learned a lot about writing music."
            ],
            "correctOption": "a. He got a job.",
            "hint": "Why did he get a job?"
          },
          {
            "id": "g4-p79-b3",
            "num": "B3",
            "type": "match",
            "x": 14,
            "y": 66.2,
            "w": 74,
            "h": 3.5,
            "leftText": "3 He became friends with a famous teacher.",
            "rightText": "d. He learned a lot about writing music.",
            "answer": "3 → d (He learned a lot about writing music.)",
            "options": [
              "a. He got a job.",
              "b. He became a great piano player.",
              "c. He couldn’t hear music anymore.",
              "d. He learned a lot about writing music."
            ],
            "correctOption": "d. He learned a lot about writing music.",
            "hint": "What did the famous teacher help him learn?"
          },
          {
            "id": "g4-p79-b4",
            "num": "B4",
            "type": "match",
            "x": 14,
            "y": 70.6,
            "w": 74,
            "h": 3.2,
            "leftText": "4 He lost his hearing.",
            "rightText": "c. He couldn’t hear music anymore.",
            "answer": "4 → c (He couldn’t hear music anymore.)",
            "options": [
              "a. He got a job.",
              "b. He became a great piano player.",
              "c. He couldn’t hear music anymore.",
              "d. He learned a lot about writing music."
            ],
            "correctOption": "c. He couldn’t hear music anymore.",
            "hint": "When someone loses their hearing, what can't they do?"
          }
        ],
        "scene3d": {
          "title": "Foley Sound Studio — Making Movie Sounds",
          "bg": "../art-scenes/bg_g4_studio.png",
          "items": [
            {
              "id": "maya",
              "img": "../art-scenes/c_g4_maya.png",
              "label": "Maya (Foley Artist)",
              "say": "I am a Foley artist! I have to make every movie sound realistic.",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "soundprops",
              "img": "../art-scenes/o_g4_soundprops.png",
              "label": "Foley Sound Props",
              "say": "Two coconut shells sound like a horse! Shaking keys sounds like a knight!",
              "x": 52,
              "y": 44,
              "w": 34
            }
          ]
        }
      },
      "80": {
        "page": 80,
        "title": "Reading 2: Beethoven’s 9th (Part 1 — The Orchestra Waits)",
        "type": "Reading 2",
        "img": "../pages/G4-p80.png",
        "popScene": "g4_scene_r2_a.png",
        "video": "../extras/g4_vid_r2.mp4",
        "sound": "../extras/sounds/g4_guitar.mp3",
        "narration": "Beethoven's 9th. The orchestra waits—violins, drums, and flutes. Singers hum—women in dresses, men in suits. They wait for Beethoven, the great composer. The time for his music comes closer and closer.",
        "popWords": [
          {
            "word": "orchestra",
            "img": "g4_word_orchestra.png",
            "meaning": "Violins, drums, and flutes on stage."
          },
          {
            "word": "voices",
            "img": "../extras/pics/g4_voices.png",
            "meaning": "Singers hum—women in dresses, men in suits."
          },
          {
            "word": "composer",
            "img": "g4_word_composer.png",
            "meaning": "A person who writes music."
          }
        ],
        "exercises": [
          {
            "id": "g4-p80-poem",
            "label": "Poem Stanza 1 & Sensory Details Note",
            "x": 42,
            "y": 12,
            "w": 54,
            "h": 36
          }
        ],
        "spots": [
          {
            "id": "g4-p80-1",
            "num": "★",
            "type": "blank",
            "x": 55,
            "y": 38,
            "w": 38,
            "h": 4.5,
            "prompt": "Find sensory details you can hear in Stanza 1:",
            "answer": "violins, drums, and flutes; Singers hum",
            "options": [
              "violins, drums, and flutes; Singers hum",
              "plastic swords and coconut shells",
              "cars and buses outside"
            ],
            "hint": "Look at lines 1 and 2 of the poem!"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "81": {
        "page": 81,
        "title": "Reading 2: Beethoven’s 9th (Part 2 — On Stage) & Words",
        "type": "Reading 2 + Words",
        "img": "../pages/G4-p81.png",
        "popScene": "g4_scene_r2_a.png",
        "video": "../extras/g4_vid_r2.mp4",
        "sound": "../extras/sounds/g4_drum.mp3",
        "narration": "Beethoven's new music took him ten years, At his piano, after lots of hard work and tears. At last! He's on stage, his hair wild and gray, There with the orchestra while they play. Words in Context: composer, eagle, bends, knees, deaf.",
        "popWords": [
          {
            "word": "composer",
            "img": "g4_word_composer.png",
            "meaning": "A person who writes music."
          },
          {
            "word": "eagle",
            "img": "g4_word_eagle.png",
            "meaning": "A large, strong bird that flies high."
          },
          {
            "word": "bends",
            "img": "../extras/pics/g4_bends.png",
            "meaning": "Moves the upper body down or forward."
          },
          {
            "word": "knees",
            "img": "../extras/pics/g4_knees.png",
            "meaning": "The middle joints of your legs."
          },
          {
            "word": "deaf",
            "img": "g4_word_deaf.png",
            "meaning": "Not able to hear sounds."
          }
        ],
        "exercises": [
          {
            "id": "g4-p81-poem",
            "label": "Poem Stanza 2: Ten Years of Hard Work",
            "x": 18,
            "y": 6,
            "w": 52,
            "h": 16
          },
          {
            "id": "g4-p81-words",
            "label": "Words in Context (5 Target Words)",
            "x": 6,
            "y": 80,
            "w": 45,
            "h": 15
          }
        ],
        "spots": [
          {
            "id": "g4-p81-1",
            "num": "★",
            "type": "blank",
            "x": 18,
            "y": 19,
            "w": 46,
            "h": 4.2,
            "prompt": "How many years did Beethoven's new music take him to write?",
            "answer": "Ten years",
            "options": [
              "Ten years",
              "One week",
              "Fifty years"
            ],
            "hint": "Read the very first line on page 81!"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "82": {
        "page": 82,
        "title": "Reading 2: Beethoven’s 9th (Part 3 — Like an Eagle)",
        "type": "Reading 2",
        "img": "../pages/G4-p82.png",
        "popScene": "g4_scene_r2_a.png",
        "video": "../extras/g4_vid_r2.mp4",
        "sound": "../extras/sounds/g4_high_low.mp3",
        "narration": "The famous composer lifts his arms high, And brings them down, like an eagle that flies. The music floats through the air, soft and sweet, Filling the room—front row to back seat.",
        "popWords": [
          {
            "word": "eagle",
            "img": "g4_word_eagle.png",
            "meaning": "Beethoven lifts his arms high like an eagle that flies!"
          },
          {
            "word": "Beethoven",
            "img": "g4_char_main.png",
            "meaning": "Conducting with eyes closed on stage."
          }
        ],
        "exercises": [
          {
            "id": "g4-p82-poem",
            "label": "Poem Stanza 3: Like an eagle that flies",
            "x": 18,
            "y": 5,
            "w": 54,
            "h": 18
          }
        ],
        "spots": [
          {
            "id": "g4-p82-1",
            "num": "★",
            "type": "blank",
            "x": 56,
            "y": 88,
            "w": 38,
            "h": 4.5,
            "prompt": "What words help you hear how the music sounds on page 82?",
            "answer": "soft and sweet, floats through the air",
            "options": [
              "soft and sweet, floats through the air",
              "loud crash and smash",
              "squeak and crunch"
            ],
            "hint": "Read line 3 of the stanza on page 82!"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "83": {
        "page": 83,
        "title": "Reading 2: Beethoven’s 9th (Part 4 — Drums Boom!)",
        "type": "Reading 2",
        "img": "../pages/G4-p83.png",
        "popScene": "g4_scene_r2_a.png",
        "video": "../extras/g4_vid_r2.mp4",
        "sound": "../extras/sounds/g4_drum.mp3",
        "narration": "Beethoven waves his arms here and there, Light shines in his eyes, the wind's in his hair. First, he stands tall, then bends down on his knees, Like a small boat sailing on stormy seas. Beethoven wrote the music, so he knows every note. He stands proudly onstage, in his red scarf and coat. Trumpets play loudly. Drums boom, voices cry, The audience wonders how the time flies by.",
        "popWords": [
          {
            "word": "knees",
            "img": "../extras/pics/g4_knees.png",
            "meaning": "Bends down on his knees like a boat on stormy seas."
          },
          {
            "word": "bends",
            "img": "../extras/pics/g4_bends.png",
            "meaning": "Moves his upper body down."
          }
        ],
        "exercises": [
          {
            "id": "g4-p83-poem",
            "label": "Poem Stanzas 4 & 5: Stormy Seas & Drums Boom",
            "x": 8,
            "y": 6,
            "w": 56,
            "h": 28
          }
        ],
        "spots": [
          {
            "id": "g4-p83-1",
            "num": "★",
            "type": "blank",
            "x": 10,
            "y": 31,
            "w": 46,
            "h": 4.2,
            "prompt": "What is Beethoven wearing onstage?",
            "answer": "His red scarf and coat",
            "options": [
              "His red scarf and coat",
              "Metal knight armor",
              "Red polka-dot pajamas"
            ],
            "hint": "Look at his neck in the picture and read line 6!"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "84": {
        "page": 84,
        "title": "Reading 2: Beethoven’s 9th (Part 5 — Standing Ovation)",
        "type": "Reading 2",
        "img": "../pages/G4-p84.png",
        "popScene": "g4_scene_r2_b.png",
        "video": "../extras/g4_vid_r2.mp4",
        "sound": "../extras/sounds/g4_clapping.mp3",
        "narration": "At last it is finished, the crowd gets to their feet, They clap and throw flowers. What a wonderful treat! They shout Beethoven's name, their hands in the air, But he cannot hear them. For him, they're not there.",
        "popWords": [
          {
            "word": "audience",
            "img": "../extras/pics/g4_audience.png",
            "meaning": "The crowd clapping and throwing red roses."
          },
          {
            "word": "deaf",
            "img": "g4_word_deaf.png",
            "meaning": "He cannot hear the crowd cheering behind him."
          }
        ],
        "exercises": [
          {
            "id": "g4-p84-poem",
            "label": "Poem Stanza 6: The Crowd Claps & Throws Flowers",
            "x": 18,
            "y": 6,
            "w": 56,
            "h": 18
          }
        ],
        "spots": [
          {
            "id": "g4-p84-1",
            "num": "★",
            "type": "blank",
            "x": 18,
            "y": 21,
            "w": 48,
            "h": 4.2,
            "prompt": "Why doesn't Beethoven turn around when the crowd shouts his name?",
            "answer": "Because he cannot hear them (he is deaf).",
            "options": [
              "Because he cannot hear them (he is deaf).",
              "Because he is angry at the crowd.",
              "Because he left the theater."
            ],
            "hint": "Read the last line of the stanza on page 84!"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "85": {
        "page": 85,
        "title": "Reading 2: Beethoven’s 9th (Part 6 — Alive in His Head)",
        "type": "Reading 2",
        "img": "../pages/G4-p85.png",
        "popScene": "g4_scene_r2_b.png",
        "video": "../extras/g4_vid_r2.mp4",
        "sound": "../extras/sounds/g4_clapping.mp3",
        "narration": "Then a kind singer turns him to look at the cheers, The sad truth is, the composer can't hear. Beethoven is deaf, his hearing long dead, But the music is there, still alive in his head. Beethoven sees the people, and now it is clear. His heart is happy, his eyes fill with tears. They like his music, Beethoven feels proud. He bends down low, thanking the crowd.",
        "popWords": [
          {
            "word": "bends",
            "img": "../extras/pics/g4_bends.png",
            "meaning": "He bends down low, thanking the crowd."
          },
          {
            "word": "Beethoven waving",
            "img": "g4_char_main_wave.png",
            "meaning": "Beethoven feeling happy and proud!"
          }
        ],
        "exercises": [
          {
            "id": "g4-p85-poem",
            "label": "Poem Ending: Still Alive in His Head",
            "x": 45,
            "y": 40,
            "w": 50,
            "h": 46
          }
        ],
        "spots": [
          {
            "id": "g4-p85-1",
            "num": "★",
            "type": "blank",
            "x": 55,
            "y": 88,
            "w": 40,
            "h": 4.5,
            "prompt": "Why is Beethoven crying at the end of the poem?",
            "answer": "He is crying happy tears because the crowd loves his music!",
            "options": [
              "He is crying happy tears because the crowd loves his music!",
              "He is crying because he hurt his knee.",
              "He is crying because the music was bad."
            ],
            "hint": "Read: 'His heart is happy, his eyes fill with tears. They like his music, Beethoven feels proud.'"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "86": {
        "page": 86,
        "title": "Explore the Reading — Beethoven’s 9th",
        "type": "Explore the Reading",
        "img": "../pages/G4-p86.png",
        "popScene": "g4_scene_r2_b.png",
        "sound": "../extras/sounds/g4_clapping.mp3",
        "narration": "Page 86: Explore the Reading. A: Read and choose. 1 What is the poem's setting? 2 Who is Beethoven? 3 Which instruments go boom? 4 What sounds does the audience make? 5 Why does the singer turn Beethoven around? B: Think and check. What effects did Beethoven's music have on the audience? C: Think, circle, and discuss.",
        "popWords": [
          {
            "word": "composer",
            "img": "g4_word_composer.png",
            "meaning": "Beethoven is a famous composer."
          },
          {
            "word": "audience",
            "img": "../extras/pics/g4_audience.png",
            "meaning": "They clapped, shouted, and cheered!"
          }
        ],
        "exercises": [
          {
            "id": "g4-p86-exA",
            "label": "Ex A: Read and choose (1–5)",
            "x": 8,
            "y": 6,
            "w": 84,
            "h": 39
          },
          {
            "id": "g4-p86-exB",
            "label": "Ex B: Think and check (✓) audience effects",
            "x": 8,
            "y": 46,
            "w": 84,
            "h": 21
          },
          {
            "id": "g4-p86-exC",
            "label": "Ex C: Think, circle, and discuss feelings",
            "x": 8,
            "y": 68,
            "w": 84,
            "h": 24
          }
        ],
        "spots": [
          {
            "id": "g4-p86-a1",
            "num": "A1",
            "type": "choice",
            "x": 14.5,
            "y": 12,
            "w": 14,
            "h": 2.8,
            "group": "g4-p86-a1",
            "text": "a. a theater",
            "correct": true,
            "answer": "a. a theater",
            "hint": "The stage, curtains, orchestra, and audience are in a theater!"
          },
          {
            "id": "g4-p86-a2",
            "num": "A2",
            "type": "choice",
            "x": 39,
            "y": 18.8,
            "w": 16,
            "h": 2.8,
            "group": "g4-p86-a2",
            "text": "b. a composer",
            "correct": true,
            "answer": "b. a composer",
            "hint": "Page 80 says: 'They wait for Beethoven, the great composer.'"
          },
          {
            "id": "g4-p86-a3",
            "num": "A3",
            "type": "choice",
            "x": 14.5,
            "y": 25.4,
            "w": 15,
            "h": 2.8,
            "group": "g4-p86-a3",
            "text": "a. the drums",
            "correct": true,
            "answer": "a. the drums",
            "hint": "Page 83 says: 'Trumpets play loudly. Drums boom, voices cry.'"
          },
          {
            "id": "g4-p86-a4",
            "num": "A4",
            "type": "choice",
            "x": 62,
            "y": 31.8,
            "w": 22,
            "h": 4.5,
            "group": "g4-p86-a4",
            "text": "c. They clap, shout, and cheer.",
            "correct": true,
            "answer": "c. They clap, shout, and cheer.",
            "hint": "Pages 84–85 say: 'They clap... They shout Beethoven's name... look at the cheers.'"
          },
          {
            "id": "g4-p86-a5",
            "num": "A5",
            "type": "choice",
            "x": 39,
            "y": 40.2,
            "w": 21,
            "h": 4.5,
            "group": "g4-p86-a5",
            "text": "b. So he can see the crowd cheering.",
            "correct": true,
            "answer": "b. So he can see the crowd cheering.",
            "hint": "Page 85 says: 'Then a kind singer turns him to look at the cheers.'"
          },
          {
            "id": "g4-p86-b1",
            "num": "B1",
            "type": "tick",
            "x": 12.8,
            "y": 49.4,
            "w": 4.2,
            "h": 2.6,
            "answer": "✓",
            "hint": "Did the audience clap and cheer? Yes!"
          },
          {
            "id": "g4-p86-b2",
            "num": "B2",
            "type": "tick",
            "x": 12.8,
            "y": 52.6,
            "w": 4.2,
            "h": 2.6,
            "answer": "✓",
            "hint": "Page 83 says: 'The audience wonders how the time flies by.' Yes!"
          },
          {
            "id": "g4-p86-b5",
            "num": "B5",
            "type": "tick",
            "x": 12.8,
            "y": 62.2,
            "w": 4.2,
            "h": 2.6,
            "answer": "✓",
            "hint": "Did everyone feel happy at the concert? Yes!"
          },
          {
            "id": "g4-p86-c1",
            "num": "C1",
            "type": "choice",
            "x": 12.5,
            "y": 75,
            "w": 8.5,
            "h": 3,
            "group": "g4-p86-c",
            "text": "happy",
            "correct": true,
            "answer": "happy / excited / alive",
            "hint": "How does great live music make us feel?"
          },
          {
            "id": "g4-p86-c2",
            "num": "C2",
            "type": "choice",
            "x": 28,
            "y": 75,
            "w": 9.8,
            "h": 3,
            "group": "g4-p86-c2",
            "text": "excited",
            "correct": true,
            "answer": "excited",
            "hint": "Live music makes us feel excited and alive!"
          },
          {
            "id": "g4-p86-c3",
            "num": "C3",
            "type": "choice",
            "x": 48.5,
            "y": 75,
            "w": 7,
            "h": 3,
            "group": "g4-p86-c3",
            "text": "alive",
            "correct": true,
            "answer": "alive",
            "hint": "Great choice!"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      },
      "87": {
        "page": 87,
        "title": "Think Together & My Reading Journal",
        "type": "Think Together / Review",
        "img": "../pages/G4-p87.png",
        "popScene": "g4_cover.png",
        "sound": "../extras/sounds/g4_birds.mp3",
        "narration": "Page 87: Think Together. What different types of sounds are in our world? A: Look at both readings. Find three different sound words. Write. B: Sit quietly. Close your eyes. What can you hear? Listen very carefully. Then complete the graphic organizer. C: Talk about the sounds you heard with your partner. My Reading Journal.",
        "popWords": [
          {
            "word": "realistic",
            "img": "../extras/pics/g4_realistic.png",
            "meaning": "Sound words like crash, boom, and crunch!"
          },
          {
            "word": "voices",
            "img": "../extras/pics/g4_voices.png",
            "meaning": "Singing, humming, cheering, and speaking."
          }
        ],
        "exercises": [
          {
            "id": "g4-p87-exA",
            "label": "Ex A: Write 3 sound words from both readings",
            "x": 12,
            "y": 13,
            "w": 76,
            "h": 16
          },
          {
            "id": "g4-p87-exB",
            "label": "Ex B: Graphic Organizer — I can hear... (6 clouds)",
            "x": 12,
            "y": 29,
            "w": 78,
            "h": 32
          },
          {
            "id": "g4-p87-journal",
            "label": "My Reading Journal",
            "x": 10,
            "y": 71,
            "w": 82,
            "h": 23
          }
        ],
        "spots": [
          {
            "id": "g4-p87-a1",
            "num": "A1",
            "type": "blank",
            "x": 20,
            "y": 20.5,
            "w": 16,
            "h": 4.2,
            "prompt": "Sound word 1 (from Reading 1):",
            "answer": "crash / thud",
            "options": [
              "crash / thud",
              "squeak / crunch",
              "buzzing / barking"
            ],
            "hint": "What sound did the knights' boots or swords make on page 74?"
          },
          {
            "id": "g4-p87-a2",
            "num": "A2",
            "type": "blank",
            "x": 44,
            "y": 20.5,
            "w": 16,
            "h": 4.2,
            "prompt": "Sound word 2 (from Reading 1):",
            "answer": "crunch / squeak",
            "options": [
              "crunch / squeak",
              "smash / punch",
              "buzzing"
            ],
            "hint": "What sound did the old chair or head of lettuce make on page 77?"
          },
          {
            "id": "g4-p87-a3",
            "num": "A3",
            "type": "blank",
            "x": 68,
            "y": 20.5,
            "w": 15,
            "h": 4.2,
            "prompt": "Sound word 3 (from Reading 2):",
            "answer": "boom / hum",
            "options": [
              "boom / hum",
              "clap / shout",
              "cheers"
            ],
            "hint": "What sound did the singers or drums make in Beethoven's 9th?"
          },
          {
            "id": "g4-p87-b1",
            "num": "B1",
            "type": "blank",
            "x": 31,
            "y": 37.8,
            "w": 16,
            "h": 3.6,
            "prompt": "Cloud 1 — I can hear...",
            "answer": "birds singing",
            "options": [
              "birds singing",
              "a clock ticking",
              "children talking"
            ],
            "hint": "Listen carefully! What can you hear outside or in the room?"
          },
          {
            "id": "g4-p87-b2",
            "num": "B2",
            "type": "blank",
            "x": 59,
            "y": 37.8,
            "w": 16,
            "h": 3.6,
            "prompt": "Cloud 2 — I can hear...",
            "answer": "footsteps",
            "options": [
              "footsteps",
              "the wind blowing",
              "cars outside"
            ],
            "hint": "What sound do shoes make in the hallway?"
          },
          {
            "id": "g4-p87-b3",
            "num": "B3",
            "type": "blank",
            "x": 18,
            "y": 47.2,
            "w": 16,
            "h": 3.6,
            "prompt": "Cloud 3 — I can hear...",
            "answer": "a clock ticking",
            "options": [
              "a clock ticking",
              "pages turning",
              "a bell ringing"
            ],
            "hint": "Tick-tock on the classroom wall!"
          },
          {
            "id": "g4-p87-b4",
            "num": "B4",
            "type": "blank",
            "x": 71,
            "y": 47.2,
            "w": 16,
            "h": 3.6,
            "prompt": "Cloud 4 — I can hear...",
            "answer": "pages turning",
            "options": [
              "pages turning",
              "pencils writing",
              "a chair squeaking"
            ],
            "hint": "What sound does your book make?"
          },
          {
            "id": "g4-p87-b5",
            "num": "B5",
            "type": "blank",
            "x": 30,
            "y": 55.8,
            "w": 16,
            "h": 3.6,
            "prompt": "Cloud 5 — I can hear...",
            "answer": "the wind",
            "options": [
              "the wind",
              "rain falling",
              "a dog barking"
            ],
            "hint": "What nature sound can you hear through the window?"
          },
          {
            "id": "g4-p87-b6",
            "num": "B6",
            "type": "blank",
            "x": 58,
            "y": 55.8,
            "w": 16,
            "h": 3.6,
            "prompt": "Cloud 6 — I can hear...",
            "answer": "my friends breathing",
            "options": [
              "my friends breathing",
              "a teacher speaking",
              "music playing"
            ],
            "hint": "When the room is very quiet, what can you hear?"
          },
          {
            "id": "g4-p87-j1",
            "num": "J1",
            "type": "blank",
            "x": 24.5,
            "y": 79,
            "w": 15,
            "h": 3.2,
            "prompt": "Which is your favorite noise from the unit? I like the...",
            "answer": "coconut horse sound",
            "options": [
              "coconut horse sound",
              "drums booming",
              "sheet-metal thunder"
            ],
            "hint": "Pick your favorite sound from Reading 1 or Reading 2!"
          },
          {
            "id": "g4-p87-j2",
            "num": "J2",
            "type": "blank",
            "x": 47.5,
            "y": 79,
            "w": 40,
            "h": 3.2,
            "prompt": "...because...",
            "answer": "it is funny and sounds just like a real horse!",
            "options": [
              "it is funny and sounds just like a real horse!",
              "it makes me feel happy, excited, and alive!",
              "Foley artists are very creative!"
            ],
            "hint": "Why do you like that sound?"
          }
        ],
        "scene3d": {
          "title": "Beethoven’s Ninth Symphony Stage",
          "bg": "../art-scenes/bg_g4_stage.png",
          "items": [
            {
              "id": "lina",
              "img": "../art-scenes/c_g4_lina.png",
              "label": "Young Conductor",
              "say": "Trumpets play loudly! Drums boom! The audience claps and cheers!",
              "x": 18,
              "y": 36,
              "w": 30
            },
            {
              "id": "bigdrum",
              "img": "../art-scenes/o_g4_bigdrum.png",
              "label": "Orchestra Drum",
              "say": "Boom! Boom! You can feel the drum vibrations through the floor!",
              "x": 54,
              "y": 42,
              "w": 32
            }
          ]
        }
      }
    }
  }
};
  root.MAGIC_BOOK_DATA = MAGIC_BOOK_DATA;
})(typeof window !== 'undefined' ? window : global);
