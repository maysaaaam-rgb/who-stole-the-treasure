---
name: push-live
description: Safely push finished work to the live site (main and gh-pages) for English Adventure Academy and wait until it is really live. Use ONLY after the teacher explicitly says "push it" (or an equally clear go-ahead).
---

# Push live

Repo: `maysaaaam-rgb/who-stole-the-treasure` (PUBLIC), local `C:\Users\maysa\Desktop\DV`, live at https://maysaaaam-rgb.github.io/who-stole-the-treasure/ . Pushing is outward-facing: **never push without an explicit "push it" in the latest message.** Approval for one push does not carry to the next.

## Before
1. `git branch --show-current` must be `main`; `git status --short` shows what changed.
2. `node --check` every touched `.js` file.
3. Bump the `?v=` cache number in `index.html` (or the page's own index) for every changed script or stylesheet.
4. Look at the diff once: no keys, tokens, passwords, pupil surnames or private data in a public repo.

## What to add (always explicit paths, never `git add -A`)
Add only the finished module folders, changed `js/` and `css/` files, `index.html`, lesson plans (`lesson-plans/*.docx|pdf`) and processed art (`*/art/*.webp`, `platform-art/`).
**Never add:** `_tmp/`, `unit3-work/` (copyrighted textbook photos), `week4-work/`, `platform-work/`, `revision-work/`, `unit2-work/`, `voice-test/`, any `art-new/` or `*-new/` raw PNG folders, `art-*.html` previews, `alice-party-home/make-audio-gemini.js`, `alice-party-home/teacher-setup/Code-NEW-with-Chuseok.gs`, API keys of any kind.

## Commit and push
- Message in a file: `git commit -F _tmp/commit-<name>.txt`, conventional style (`feat:`/`fix:`), ending with the attribution line the harness asks for (Co-Authored-By: Claude).
- Then exactly: `git push origin main`, `git checkout gh-pages`, `git merge main -m "merge main into gh-pages: <description>"`, `git push origin gh-pages`, `git checkout main`.

## After
- Wait until the site really serves the new file with a background loop (Monitor `until curl -s <live url of a changed file> | grep -q "<unique new text>"; do sleep 10; done`). The "Deploy GitHub Pages" run may show failed; the "pages build and deployment" run is what serves the site.
- Tell the teacher the live links and to press Ctrl+F5 on every device (and the sidebar/Class Mode button if relevant).
- Never claim "live" until the curl check passed, and say that you checked the files are served, not that you opened every page.
