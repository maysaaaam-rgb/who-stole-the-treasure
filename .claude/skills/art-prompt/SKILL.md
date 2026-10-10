---
name: art-prompt
description: Write a short Gemini art prompt (about 14 pictures) in the platform's 3D style for a lesson or screen, then process the finished PNGs into cut-out webp files with a manifest. Use when the teacher asks for art prompts, pictures, Gemini prompts, or says Gemini finished.
---

# Gemini art prompts and processing

Gemini is slow: **keep each prompt to about 14 pictures** (first batch only). Anything not in the batch uses emoji until later. Long prompts (40+ pictures) took an hour and the teacher complained.

## Writing the prompt (save as `art-prompts/GEMINI-<NAME>-ART-FAST.md`, as a .md file)
Use `art-prompts/GEMINI-WEEK4-G4-ART-FAST.md` and `GEMINI-PLATFORM-3D-ART.md` as templates. The file starts with "Paste everything below the line into Gemini (the agent that can read and write files in this project)", then a `---` line. It must contain:
- Context: who the pupils are (ages 8-10, A1), the lesson topic, and "I am away, work alone, retry a failed image up to 3 times, then skip and log".
- **Hard rules:** may ONLY create PNGs and one `PROGRESS.txt` inside a named output folder (for example `week4-work\art-g4\`); no edits anywhere else, no git, no code. First look (read only) at existing pictures (`unit2-throw\art-new\cat.png`, `dog.png`, `boss.png`, and a recent lesson's art) so the style matches: cute 3D mobile-game mascot, soft lighting, saturated colours, thick white sticker outline. Original art only: no franchises, no brands, no textbook illustrations. **No text, letters, numbers or watermark inside any image** (boards, signs, books, buttons are blank). Friendly, never scary, mixed boys and girls and skin tones. Be honest in the log: "OK" only for pictures actually generated and looked at.
- **Fixed character designs** (hair, clothes) written out so characters stay identical across pictures.
- Picture types: A objects/characters 1024x1024 on ONE flat plain #e8e8e8 background with sticker outline; B backdrops 16:9 (or 2:1) no people no text, calm lower third; C story scenes 4:3 with the named characters.
- Numbered list with exact file names (`c_` characters, `o_` objects, `p_` places, `s_` scenes, `bg_` backdrops, `m_` menu, `r_` rewards, `h_` home).
- Finish: write `PROGRESS.txt` with one line per picture and a last line `N/N OK`.
For small buttons choose one simple shape and bold colour per picture.

## When Gemini finishes
1. Read `PROGRESS.txt`; list the folder; any "SKIPPED" goes back to the teacher.
2. Process: `python _tmp/u3-process.py` pattern. Objects and characters (`c_`, `o_`, `p_`, `m_`, `r_`, `h_`, `n_`, `w_`) go through `_tmp/process_cut.py cut_rgba(file, 512, 10)` to webp; backgrounds and scenes (`bg_`, `s_`) are resized to 1280 wide webp. Write `art/manifest.json` (array of names without extension) into the lesson's art folder.
3. Make a contact sheet on a dark background and LOOK at it before using the pictures (grey holes, cut-off edges).
4. Never push the raw PNG folders (`*-work/`, `art-new/`).
