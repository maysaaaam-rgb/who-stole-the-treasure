# Unit 3 Pass 1 Verification & Corrections Report

## Executive Summary
A comprehensive audit comparing the Pass 1 extraction (`out/unit3-grade3.json` and `out/unit3-grade4.json`) against the original textbook pages (*Global Readings 2* and *Global Readings 3*, pages 40–55) was conducted. 

Overall, **the core curricular extraction in Pass 1 was highly faithful and accurate**: all story summaries, historical timeline milestones, vocabulary targets, phonics patterns, and reading comprehension items match the published textbook pages. However, several items in the auxiliary handover documents (`README-for-claude.md`) and extension fields contained inferred or added details that were not explicitly printed in the physical book scans. These are cataloged below with truth tags and page references.

---

## 1. Corrections & Clarifications: Grade 3 (*Global Readings 2*, pp. 40–55)

| Item / Field | Pass 1 Content | Textbook Scan Audit (Truth) | Status & Correction | Source Page |
| :--- | :--- | :--- | :--- | :--- |
| **CD Audio Track References** | "CD Tracks 18–24" | The page scans do not print specific CD track numbers (they display standard audio icon symbols without track numerals). | **Inferred in Pass 1.** Corrected: audio markers indicate listening activities, but exact publisher CD track numerals are unprinted. | pp. 42, 48, 55 |
| **Lydia Coin Geography** | "Lydia, which is in modern-day Turkey" | The book text states: *"Around 600 BCE, people in Lydia made the first stamped metal coins."* The connection to modern Turkey was added for pedagogical relevance. | **Added context in Pass 1.** Corrected: Marked as \`"source": "added"\` in deep study. | p. 44 |
| **Words in Context (Reading 1)** | \`bartered\`, \`metal\`, \`valuable\`, \`credit card\`, \`plastic\` | Exactly matches the 5 highlighted vocabulary words on page 42. | **100% Correct in Pass 1.** | p. 42 |
| **Words in Context (Reading 2)** | \`belong to\`, \`return\`, \`pocket\`, \`restaurant\`, \`money is tight\` | Exactly matches the 5 highlighted vocabulary words and idioms on page 48. | **100% Correct in Pass 1.** | p. 48 |
| **Phonics Pattern** | Spelling pattern \`ar\` (\`car\`, \`park\`, \`hard\`, \`farm\`, \`card\`, \`smart\`) | Directly printed on page 55 word work section. | **100% Correct in Pass 1.** | p. 55 |
| **Chant Title** | *"The Money Timeline Chant"* | No chant title is printed in the textbook; this was suggested for smartboard extension. | **Added in Pass 1.** Corrected: Explicitly tagged as \`"source": "added"\`. | N/A (Handover) |

---

## 2. Corrections & Clarifications: Grade 4 (*Global Readings 3*, pp. 40–55)

| Item / Field | Pass 1 Content | Textbook Scan Audit (Truth) | Status & Correction | Source Page |
| :--- | :--- | :--- | :--- | :--- |
| **Unit Opener Science Detail** | "Non-toxic Rhodamine WT dye" | The caption on page 40 reads that scientists use pink dye to track water currents and melting rates, but the chemical trade name is not printed. | **Added scientific detail in Pass 1.** Corrected: Tagged as \`"source": "added"\` for teacher background. | p. 40 |
| **CD Audio Track References** | "CD Tracks 19–25" | Only audio prompt icons are shown; exact numeric track labels are omitted in the student book. | **Inferred in Pass 1.** Corrected: Marked as general audio requirement. | pp. 42, 48, 55 |
| **Words in Context (Reading 1)** | \`hole\`, \`twice\`, \`enemy\`, \`thin\`, \`trap\`, \`melting\` | Exactly matches the 6 highlighted vocabulary items on page 42. | **100% Correct in Pass 1.** | p. 42 |
| **Words in Context (Reading 2)** | \`gasoline\`, \`energy\`, \`oil\`, \`noisy\`, \`electricity\`, \`expensive\` | Exactly matches the 6 highlighted vocabulary items on page 48. | **100% Correct in Pass 1.** | p. 48 |
| **Reading 1 Genre** | Poem ("The Bear and I") | Rhyming stanzas, sensory imagery, and meter directly reflect the poetic format. | **100% Correct in Pass 1.** | pp. 42–45 |
| **Reading 2 Structure** | Nonfiction / Informational ("Clean Cars") | Covers gasoline/petrol, biofuel, electric batteries, solar panels, and compressed air. | **100% Correct in Pass 1.** | pp. 48–53 |
| **Phonics Pattern** | Final \`-ng\` blend (\`sing\`, \`long\`, \`reading\`, \`bang\`, \`spring\`) | Exactly matches page 47 phonics word work box. | **100% Correct in Pass 1.** | p. 47 |
| **Chant Title** | *"Clean Wheels, Green World"* | Suggested smartboard activity; not printed in student edition. | **Added in Pass 1.** Corrected: Explicitly tagged as \`"source": "added"\`. | N/A (Handover) |

---

## 3. Truth-Tagging Protocol Established for Pass 2 (Deep Study)
In accordance with prompt instructions:
- Every data point, question, vocabulary entry, grammar pattern, chunk, and activity in Pass 2 carries an explicit truth tag:
  - `"source": "book p.NN"` (for content printed directly on the textbook page)
  - `"source": "added"` (for pedagogical scaffolding, dialogues, TPR gestures, rubrics, and lesson stage designs)
- Zero invented text is represented as publisher material.
