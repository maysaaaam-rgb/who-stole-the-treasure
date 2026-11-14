# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are setting up four helpers for the platform "English Adventure Academy" in `C:\Users\maysa\Desktop\DV\` (a PUBLIC GitHub Pages site for pupils aged 8 to 10). Work through the whole job by yourself without asking me questions. I am away. At the end, Claude will review your work and push it, so you must NOT publish anything.

## Hard rules (very important)
- **Do NOT run git** (no add, commit, push, pull, reset, checkout, clean). Do NOT delete, move or rename ANY existing file. Do NOT edit any existing file EXCEPT where a step below says so.
- Only create the new files and folders named below. Nothing else.
- Never copy any key, token or password into any file. If you see one, write only the file name in the report.
- Write everything you did into ONE report: `C:\Users\maysa\Desktop\DV\platform-work\GITHUB-TOOLS-REPORT.md`. Be honest: say what worked, what failed, and what you could not do.

---

## Job 1: An automatic check on every push (GitHub Actions)
The repo already has `.github/workflows/deploy.yml`. Do NOT change it.

**1a.** Create `tools/check-site.js`, a plain Node.js script (no npm packages, only Node's built-in modules) that the robot and I can run with `node tools/check-site.js`. It must:
1. **Syntax:** run a syntax check (the same as `node --check`) on every `.js` file in the repo, skipping `.git/`, `node_modules/`, `monster day/` and any `*-work/` or `_tmp/` folder. A syntax error = **FAIL**.
2. **Secrets:** search every `.js`, `.html`, `.json`, `.md`, `.txt` and `.yml` file for: Google keys (`AIza` followed by 30+ letters/digits/`_`/`-`, or `AQ.` followed by 30+ such characters), OpenAI-style keys (`sk-` followed by 20+ such characters), and the words `service_` + `role` or `PRIVATE` + ` KEY` (joined; written split here so this file does not trip the check). A match = **FAIL** (print only the file name and line number, never the matching text). The Supabase `anonKey` is public and allowed.
3. **Forbidden folders:** if any file exists inside `_tmp/`, `unit3-work/`, `week4-work/`, `platform-work/`, `revision-work/`, `unit2-work/`, `voice-test/`, `island-work/`, any folder named `art-new` or ending in `-new`, or `monster day/` = **FAIL** (these must never be published). When run on my computer these folders exist on purpose, so add a flag: `node tools/check-site.js --ci` checks forbidden folders, and without `--ci` it only prints a note.
4. **Missing files:** read `index.html`, `404.html`, `island/index.html` and `smart-board/index.html`. For every `src="..."` and `href="..."` that points to a local file (not `http`, `https`, `data:`, `mailto:`, `#`, `javascript:` or `blob:`), remove any `?v=...` part and check the file exists (paths are relative to that page's folder). Missing = **FAIL**.
5. **Big files:** any single file over 8 MB = **WARNING** (list them, do not fail).
6. At the end, print a short summary (number of files checked, FAILs, WARNINGs) and exit with code 1 if there was any FAIL, otherwise 0.

**1b.** Create `.github/workflows/check.yml`: runs on every `push` to `main` and on every `pull_request`; uses `ubuntu-latest`, `actions/checkout@v4`, `actions/setup-node@v4` with Node 20, then runs `node tools/check-site.js --ci`. Permissions: `contents: read` only.

**1c.** Run `node tools/check-site.js` once on my computer (without `--ci`) and copy the whole output into the report. Do NOT fix anything it finds: just list it. I want to see the starting state.

---

## Job 2: Phaser (the game engine we already use)
- `island/lib/phaser.min.js` (version 4.2.1) and `island/lib/phaser-LICENSE.txt` are already in the repo. Do NOT replace or change them.
- Search the whole repo (read only) for every page that loads Phaser and list them in the report, with the version each one uses.
- Create `docs/PHASER-NOTES.md`: a one-page note for future work: where the local copy is, that pages must load it from the repo (never from a CDN, because classroom devices may be offline), and links to the official examples site (https://phaser.io/examples) and the GitHub repo (https://github.com/phaserjs/phaser).

---

## Job 3: Tiled (a free map editor for my PC)
- Do NOT install anything. Instead, find the official download page (https://www.mapeditor.org) and write `docs/TILED-HOW-TO.md` in simple English for a teacher: how to download and install Tiled on Windows, how to make a new map for a Phaser game (orthogonal, tile size 32x32, map size 60x34 tiles, export as **JSON** with the tileset **embedded**), where to save it (`island/maps/` with the tileset picture next to it), and the 5 things to draw first for a game level: ground, path, water, walls/blocked areas (on a layer named `collision`) and an object layer named `places` with points for stops.
- Create the empty folder `island/maps/` with a file `island/maps/README.md` that says what goes there.

---

## Job 4: Kenney's free art (CC0, safe for a public repo)
- Use ONLY https://kenney.nl/assets. Download these packs if they exist there (check the license on each page says **CC0**; skip any that are not CC0):
  1. a top-down tileset with grass, sand, water and paths (for example "Tiny Town" or "RPG Urban/Base Pack" or "Roguelike Base Pack"),
  2. a UI pack (buttons, panels, icons), for example "UI Pack",
  3. a small pack of effects or particles, for example "Particle Pack".
- Save the downloaded ZIP files and unzip them ONLY into `C:\Users\maysa\Desktop\DV\kenney-work\` (a work folder that is NOT published). Do NOT copy anything into the site folders yet.
- In the report, for each pack: name, page link, the license line exactly as written on the page, the folder you unzipped to, and 5 file names that look useful for a cute island game for children.

---

## Finish
Write `platform-work\GITHUB-TOOLS-REPORT.md` with four sections (Job 1 to 4): every file you created (full path), the check output from 1c, the Phaser page list, and the Kenney pack table. End with a list "Claude please review" of anything you were unsure about.
