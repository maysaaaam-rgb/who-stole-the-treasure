# Unit 3 re-check prompt for Antigravity (pass 3)

**Before you paste:** use the same Antigravity chat, so it still has the Unit 3 pages. If it says it cannot see them, give it the pages again. Better still, save them in `C:\Users\maysa\Desktop\DV\unit3-work\pages\` named `g3_p40.jpg` ... `g3_p55.jpg` and `g4_p40.jpg` ... `g4_p55.jpg`.

Paste everything below the line into Antigravity.

---

Pass 3: a slow, careful re-check of your Unit 3 deep study against the real pages. Accuracy matters more than speed here.

My reviewer found these problems in `out\deep\`:
1. Items tagged `book p.NN` that are not printed in the book. For example, unit objectives are tagged `book p.40`, but a student book does not print objectives.
2. Page numbers that contradict your own pass 1:
   - Grade 3: a Reading 1 sentence is quoted from p.42, but you said p.42 is Words in Context and Reading 1 starts on p.43.
   - Grade 4: the comparative examples are quoted from p.47, which you called the -ng phonics page.
3. Quotes that look paraphrased or smoothed instead of copied exactly, for example *"Clean cars help protect our planet and keep the air fresh for everyone."* and *"How much are the books?"*.
4. Vocabulary that is not complete. It has 18 words for Grade 3 and 20 for Grade 4, and many words pupils need for the readings are missing.

Work by yourself without asking me questions, because I am away.

## Hard rules
- Write files ONLY inside `C:\Users\maysa\Desktop\DV\unit3-work\out\checked\` (make the folder).
- Do NOT change or delete your pass 1 or pass 2 files. Do NOT touch code, run git, push, or open the platform's database (Supabase) or any login.
- Do not copy whole pages. Quote at most 3 consecutive sentences at a time, and give no song lyrics.
- Do not include any pupil names. Use English everywhere, except the `tr` fields (Turkish).
- If you cannot see a page, do NOT guess. Write `"PAGE NOT AVAILABLE"` for it, list it in the log, and tag everything from it as `unverified`.

## The truth rules (strict)
Every item gets exactly one tag:
- `"source": "book p.NN"`: ONLY if these exact words are printed on page NN. Check the page number by looking at the page itself, not your memory.
- `"source": "book p.NN (adapted)"`: the idea is on page NN but your wording is different. Also give `"bookWords"` with the exact printed words.
- `"source": "added"`: your own idea. This includes objectives, can-do statements, success criteria, rubrics, dialogues, gestures, tongue twisters, smartboard ideas, lesson stages, Turkish translations and A1 definitions.
- `"source": "unverified"`: you cannot see the page to check.

A quote is correct only if every word, capital letter and punctuation mark matches the page. If you are not 100% sure it matches, it is `adapted`, not `book`.

## JOB 1: page map
Before anything else, look at every page and write `out\checked\page-map.json`. Give one entry per page, for both grades:
```
{"grade": 3, "page": 42, "printedPageNumber": "42", "section": "exact heading printed on the page", "contains": ["Words in Context: bartered, metal, ..."], "firstPrintedLine": "exact", "lastPrintedLine": "exact"}
```
`firstPrintedLine` and `lastPrintedLine` prove you really read the page. Use this map for every page number in Jobs 2-4.

## JOB 2: check every item
Go through `out\deep\unit3-grade3-study.json` and `out\deep\unit3-grade4-study.json` item by item. Check every quote, example, page number and `source` tag against the page map and the page itself.

Write the corrected files `out\checked\unit3-grade3-study.json` and `out\checked\unit3-grade4-study.json`:
- They have the same structure as before, with the corrected tags, page numbers and quotes.
- Remove any example sentence that you cannot find on the page and that is not marked `added`.

## JOB 3: complete the vocabulary
In both corrected files, `vocabulary` must contain:
- **all** highlighted, bold, glossary and Word Work words, and
- **every** content word (noun, verb, adjective, adverb) in the two readings, the unit opener, the questions and the activity instructions that an A1 learner might not know.

Do not include the most basic words (the, a, is, and, I, you, he, she, it, go, big, small, numbers, colours).

Put each word in one of three groups:
- `mustKnow`: highlighted words plus words pupils need to say themselves.
- `shouldKnow`: words needed to understand the readings.
- `niceToKnow`: everything else.

Keep the same fields as pass 2 for every word. `bookSentence` must be the exact sentence where the word appears, with its page number.

Also add `out\checked\unit3-grade3-wordlist.csv` and `out\checked\unit3-grade4-wordlist.csv` with the columns `word,group,partOfSpeech,tr,simpleDefinition,page,bookSentence,emoji`. Use UTF-8 and quote any field that contains a comma.

## JOB 4: chunks and grammar again
Re-read both readings and every task line. List **every** useful multi-word chunk that is printed:
- phrasal verbs
- collocations (*save money*, *thin ice*)
- time phrases (*thousands of years ago*)
- question forms
- sentence starters in the tasks

For each chunk give the exact printed example and its page. Then list every grammar pattern that actually appears in the printed text, with 2 exact printed examples each. Patterns may include past simple, can/could, should, comparatives, because/so, there is/there are and questions. Put your own extra examples in a separate `addedExamples` list.

## JOB 5: report
Write `out\checked\recheck-report.md` covering:
- how many items you changed from `book` to `adapted`, `added` or `unverified`,
- every page number you corrected (old → new),
- every quote you corrected (old → exact),
- how many words each grade has in each vocabulary group,
- any page you could not see.

## Finish
Write `out\checked\PROGRESS.txt` listing every file written with OK or FAILED. Check that every .json file is valid JSON and that every .csv file opens with the right columns. Then stop. Do nothing else.
