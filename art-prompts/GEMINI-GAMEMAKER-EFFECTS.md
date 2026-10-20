# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the effects artist for the classroom game engine **Game Maker** (pupils aged 8 to 10). I need **moving effects**: short animations as sprite sheets that the game plays on top of the board (sparkles, puffs, confetti, flying bats and so on). I am away, so work alone. If an effect fails, retry up to 3 times, then skip it and log "SKIPPED".

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`) and one `effects.json`, inside `C:\Users\maysa\Desktop\DV\unit4-work\art-gamemaker-effects\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch the platform or any code.
- **First, look (read only) at the pictures in `C:\Users\maysa\Desktop\DV\unit4-work\art-g4-show\`** to match the style: cute 3D mobile-game look, soft glow, saturated colours.
- **Original art only.** No franchise or brand effects. If you use reference pictures from the internet, use public-domain or CC0 sources only, redraw your own version, and write the links and licences in `SOURCES.txt` in the output folder.
- **No text, letters or numbers in any frame.** Friendly only, nothing scary, nothing flashing fast (no strobing; nothing brighter than a soft glow).
- Make each effect with code or by drawing frames (for example Python with Pillow: radial gradients, blurred shapes, particles with soft glow). Every sheet must be a **horizontal strip PNG with a TRANSPARENT background**, all frames the same size, frame 1 at the left. The animation must loop cleanly from the last frame to the first unless it says "plays once".
- Be honest in the final log: "OK" only for a sheet you actually generated and looked at (open it and check the frames are not empty or cut off).

## The effects (exact file names, PNG strips)
All strips use a frame size of 256 x 256 pixels unless stated.
1. `fx_sparkle_burst.png`: 12 frames, plays once. Golden and white four-point sparkles burst outwards from the centre and fade.
2. `fx_star_twirl.png`: 12 frames, loops. Three small golden stars orbit a point with a soft glowing trail.
3. `fx_smoke_puff.png`: 10 frames, plays once. A soft white-and-lilac cartoon smoke puff grows and thins out (used when a tile or pumpkin opens).
4. `fx_confetti_burst.png`: 16 frames, plays once, 512 x 512 per frame. Round and square confetti in 6 bright colours burst up and fall.
5. `fx_coin_shower.png`: 14 frames, plays once, 256 x 256. Small golden coins fall and twinkle (no numbers on the coins).
6. `fx_glow_ring.png`: 10 frames, loops. A soft cyan ring pulses outward and fades (used to mark a good spot).
7. `fx_impact_star.png`: 8 frames, plays once. A comic impact star with soft lines (a bump, not violent).
8. `fx_ghost_trail.png`: 12 frames, loops. A friendly white ghost mist drifts in a wavy line, translucent.
9. `fx_bat_swarm.png`: 16 frames, loops, 512 x 256 per frame. Five tiny purple bats flap across the frame from left to right and fade at the end (friendly, cute).
10. `fx_pumpkin_splash.png`: 10 frames, plays once. A burst of orange and green glowing dots (like a happy pumpkin pop; no mess, no seeds).
11. `fx_slip_stars.png`: 10 frames, loops. Yellow comic stars circle above something that slipped.
12. `fx_rocket_trail.png`: 12 frames, loops, 128 x 256. A soft orange-and-gold flame and sparkle trail pointing downwards.
13. `fx_heart_float.png`: 12 frames, plays once. Small pink hearts rise and fade.
14. `fx_lightbulb.png`: 8 frames, plays once. A small idea light bulb pops above a character with a soft glow.

Also write `effects.json`: an object where every effect has `{ "file": "...", "frames": N, "frameWidth": W, "frameHeight": H, "fps": 12, "loop": true or false }`.

## Final step
Write `PROGRESS.txt` listing each file with OK or FAILED/SKIPPED, and a last line `N/14 OK`. Stop. Do not do anything else.
