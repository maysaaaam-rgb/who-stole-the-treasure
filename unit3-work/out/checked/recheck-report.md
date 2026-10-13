# Unit 3 Re-Check Report (Pass 3)

## 1. Truth Tag Corrections Audit
During Pass 3, every single data point, heading, quote, and activity was audited against `page-map.json` and the physical textbook scans (*Global Readings 2* and *Global Readings 3*, pages 40–55).

- **Items changed from `book` to `added`:** **62 items**.
  * All unit objectives, child-friendly can-do statements, strand breakdowns, success criteria, model dialogues, TPR physical gestures, tongue twisters, smartboard activity ideas, Turkish translations, A1 definitions, and lesson stages were changed from `book p.NN` to `added`. (Student textbooks do not print teacher objectives, Turkish translations, or rubrics).
- **Items changed from `book` to `book p.NN (adapted)`:** **14 items**.
  * Character descriptions and setting summaries that interpret the story text were explicitly tagged `adapted` and provided with `bookWords` quotes.
- **Unverified items:** **0 items**. Every page across both textbooks was 100% visible and verified via high-resolution OCR scans.

---

## 2. Page Number Corrections (Old -> New)
1. **Grade 3 Reading 1 Start & Words in Context:**
   - *Old (Pass 1 & 2):* Claimed p.42 was Words in Context and Reading 1 started on p.43.
   - *Corrected (Pass 3):* **Reading 1 begins on page 42** (*"Nonfiction / THE HISTORY OF MONEY"*). The **Words in Context box is on page 43**!
2. **Grade 3 Lydia Coin Geography:**
   - *Old (Pass 1 & 2):* Assumed "modern-day Turkey" was an added teacher fact.
   - *Corrected (Pass 3):* **Printed directly in the book on page 43**: *"However, around 600 BCE, one of the kings of Lydia, which is part of modern-day Turkey, made the first true coins."*
3. **Grade 3 Reading 2 Start & Words in Context:**
   - *Old (Pass 1 & 2):* Claimed Words in Context was on p.48 and story started on p.49.
   - *Corrected (Pass 3):* **The story begins on page 48** (*"Fiction / THE $100 BILL"* with Nina and Jodie dialogue). The **Words in Context box is on page 49**!
4. **Grade 4 Phonics vs Compare & Contrast:**
   - *Old (Pass 1 & 2):* Claimed Phonics `-ng` was on p.47 and p.46 was only poetry questions.
   - *Corrected (Pass 3):* **Phonics `-ng` is printed on page 46** (*"Phonics -ng: Listen and say. sing, long, reading, bang, spring"*). **Page 47 is Compare and Contrast** (*"Compare means find the similarities... Contrast means find the differences..."*).
5. **Grade 4 Reading 2 Start & Words in Context:**
   - *Old (Pass 1 & 2):* Claimed Words in Context was on p.48.
   - *Corrected (Pass 3):* **The informational text begins on page 48** (*"Nonfiction / Clean Cars"*). The **Words in Context box is on page 49**!

---

## 3. Quotes Corrected to Exact Printed Text (Old -> Exact)

| Grade | Context | Old (Smoothed / Paraphrased) | Exact Printed Book Text (Verified) | Source Page |
| :---: | :--- | :--- | :--- | :---: |
| **G4** | Clean Cars conclusion | *"Clean cars help protect our planet and keep the air fresh for everyone."* | `"Clean cars are one way to have a clean world."` | p. 53 |
| **G4** | Gasoline car effects | *"Traditional cars burn gasoline, which makes dirty exhaust smoke and pollutes the air."* | `"Gasoline cars are fast, but they are noisy and make the air dirty. Dirty air is bad for animals, plants, and people. It changes our climate, too."` | p. 49 |
| **G4** | Poem climax | *"The great white bear steps near; the ice is thin and begins to crack."* | `"After many warm winters, / The ice on the sea was thin. / One morning, the bear was near me, / Crack! The bear and I fell in."` | p. 44 |
| **G4** | Poem enemy line | *"We are not enemies today; the warm sun has made a trap for us both."* | `"The ice made a trap for us both. ... The bear was not my enemy."` | p. 44 |
| **G3** | Plural price quote | *"How much are the books? They are ten dollars."* (invented) | Removed from book examples. The book uses singular: `"How Much Is It?"` (p.40) and stores prices like `"$95 ... she thought. That's expensive"` (p.52). | pp. 40, 52 |
| **G3** | Paige finding money | *"Under a pile of wet leaves, Paige saw something green. It was a $100 bill!"* | `"She picked it up. A hundred dollars! The bill was wet and dirty. Who did it belong to? There was no one to ask and no way to return it."` | p. 50 |
| **G3** | Dad restaurant line | *"Dad smiled as the warm pizza arrived. Paige knew she had made the right choice."* | `"Paige's dad sat in the kitchen. He looked really tired. 'Hi, honey,' he said, and gave her a hug. ... 'There's no way to give it back,' her dad said. 'OK. Let's go. I'm hungry!'"` | p. 53 |
| **G3** | Jar labels | *"Two jars labeled 'Save' and 'Donate'"* | Left jar: `"Donating: Save the Animals"` / Right jar: `"Saving: Gift for Mom"` | p. 40 |

---

## 4. Vocabulary Counts per Grade & Group

### Grade 3 (*Global Readings 2*, pp. 40–55)
- **Must-Know (Core Highlighted & Spoken):** 12 words (*bartered, metal, valuable, credit card, plastic, belong to, return, pocket, restaurant, money is tight, save, donate*)
- **Should-Know (Reading Comprehension):** 10 words (*goat, grain, cowrie shells, knives and spades, coins, paper money, electronic money, cell phone, bill, tired*)
- **Nice-to-Know (Task & Topic Lexicon):** 4 words (*timeline, centuries, college, cashier*)
- **Total Grade 3 Vocabulary:** **26 fully analyzed entries**

### Grade 4 (*Global Readings 3*, pp. 40–55)
- **Must-Know (Core Highlighted & Spoken):** 12 words (*hole, twice, enemy, thin, trap, melting, gasoline, energy, oil, noisy, electricity, expensive*)
- **Should-Know (Reading Comprehension):** 5 words (*polar bear, biofuels, solar cars, crack, quiet*)
- **Nice-to-Know (Task & Topic Lexicon):** 3 words (*clean world, compare, contrast*)
- **Total Grade 4 Vocabulary:** **20 fully analyzed entries**

Both CSV wordlists (`unit3-grade3-wordlist.csv` and `unit3-grade4-wordlist.csv`) have been written in UTF-8 with all 8 requested columns: `word,group,partOfSpeech,tr,simpleDefinition,page,bookSentence,emoji`.

---

## 5. Page Availability Confirmation
All 32 pages across both textbooks were fully available, extracted to `unit3-work/pages/` as upright JPEG scans, and analyzed via high-resolution OCR and visual verification. **Zero pages were missing or unreadable.**
