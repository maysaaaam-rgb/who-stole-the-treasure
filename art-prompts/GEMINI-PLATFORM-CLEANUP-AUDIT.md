# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are auditing the platform "English Adventure Academy" in `C:\Users\maysa\Desktop\DV\` (a public GitHub Pages site for pupils aged 8 to 10). The site has grown to about 140 folders and 840 MB, and it is slow and messy. Before anything is deleted, I need a careful **report** of what is clutter. Work through the whole job by yourself without asking me questions. I am away.

## Hard rules (very important)
- **READ ONLY.** Do NOT delete, move, rename or edit ANY existing file or folder. Do NOT run git (no add, commit, push, reset, clean, checkout). Do NOT run build scripts, servers or installers.
- You may create exactly ONE new file: `C:\Users\maysa\Desktop\DV\platform-work\CLEANUP-REPORT.md`. Nothing else.
- Never open or copy anything that looks like a key, token or password into the report. If you find one in a file, write only the file name and "possible secret, check by hand".
- Be honest: mark every finding as **SURE** (you checked it) or **CHECK** (you think so but are not certain). When a file is used anywhere, it is NOT clutter.

## How to decide if something is used
A file or folder is **used** if its name or path appears in any `.html`, `.js`, `.css` or `.json` file of the site (search the whole project, not only `index.html`), or in `js/games-data.js`, `404.html`, `directory.html`, `manifest.json` or a lesson's own `index.html`. Search with the name both with and without the folder, and with `?v=` cache numbers removed.

## What to look for
1. **Unlinked folders:** top-level folders that no page links to. Start with these, which seem unlinked: `egypt-project`, `home-view`, `milestone-1000`, `monster-lab-3d`, `mystery-of-yesterday`, `revision-work`, `sound-detective-pro`, `sql`, `unit3-data`. Then check every other top-level folder the same way.
2. **Unused big files:** pictures, audio and video over 300 KB that no file mentions. Look hardest in `assets/monsters` (about 200 MB), `assets/books`, `assets/packs`, `tea-party-cards`, `cat-vs-dog`, `story-engine`.
3. **Raw art that should not be online:** `.png` files that have a `.webp` copy with the same name next to them (only the `.webp` is used), raw Gemini folders (`art-new`, `*-new`, `*-work`, `_tmp`), and any photographed textbook pages (these must never be published).
4. **Old copies:** files or folders named `old`, `backup`, `copy`, `v1`, `v2`, `test`, `tmp`, `draft`, `.bak`, or two folders that look like the same game.
5. **Unused scripts and styles:** files in `js/` and `css/` that no page loads.
6. **Broken links:** `src` or `href` paths in the main pages that point to files that do not exist.
7. **Leftovers from the "platform-3d" try:** `platform-3d/`, `spatial-3d*`, `build_platform_3d_index.py`, `test_platform_3d_safe.js`, `inspect_storycomet.py`, wherever they are.

## The report (`platform-work\CLEANUP-REPORT.md`)
Write it in simple English, in this order:
1. A summary at the top: how many MB could be saved in total, and the 5 biggest wins.
2. A table for each section above with columns: path, size, why it looks unused, SURE or CHECK.
3. A list "Do NOT touch" with folders that look old but are still linked (so nobody deletes them by mistake).
4. A list of possible secrets (file names only), if any.
5. At the end: how long the audit took and anything you could not check.
