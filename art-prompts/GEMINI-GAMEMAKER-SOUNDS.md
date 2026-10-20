# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the sound maker for the classroom game engine **Game Maker** (pupils aged 8 to 10; it is played on a classroom smartboard with speakers). I need a pack of short game sounds and one background loop. I am away, so work alone. If a sound fails, retry up to 3 times, then skip it and log "SKIPPED".

## Hard rules
- You may ONLY create audio files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\unit4-work\audio-gamemaker\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch the platform or any code.
- **First, look (read only) at the earlier sound packs in `C:\Users\maysa\Desktop\DV\unit4-work\audio-moon\` and `C:\Users\maysa\Desktop\DV\unit4-work\moon-song-v2\` to see the quality I liked** (warm, musical, no harsh beeps).
- Make sounds by **synthesis** (for example Python with numpy and scipy, or any tool that writes real audio) or by mixing sounds you generate. **Do not copy any commercial game sound or any copyrighted music.** If you want reference sounds from the internet, use public-domain or CC0 sources only (freesound.org CC0, pixabay audio, opengameart CC0) and write every source link and licence in `SOURCES.txt` in the output folder; never use a sound unchanged unless its licence allows it.
- **Musical, not raw beeps.** Every reward sound is a short chord or arpeggio (two oscillators, a soft attack, an exponential decay, a little reverb). Correct answers use the C major pentatonic (C5, E5, G5, C6). A wrong answer is a warm soft two-note sine chime going DOWN (246.94 Hz to 220 Hz) with no buzzer. Nothing harsh, nothing scary.
- All files: **MP3, 44.1 kHz, mono**, peak at about -3 dB, no clipping, no silence at the start (under 0.03 s) or end (under 0.1 s).
- Be honest in the final log: "OK" only for a file you actually generated and checked (duration, peak, not silent).

## The sounds (exact file names)
UI and answers:
1. `ui_tap.mp3` (0.15 s) a soft wooden click with a tiny sparkle.
2. `ui_back.mp3` (0.2 s) a soft low pop.
3. `ui_start.mp3` (0.8 s) a short happy rising run to start a game.
4. `tile_flip.mp3` (0.3 s) a card snap made from a short filtered noise burst.
5. `answer_right.mp3` (0.9 s) the C-major pentatonic arpeggio C5 E5 G5 C6 with a sparkle.
6. `answer_soft.mp3` (0.7 s) the warm two-note falling sine chime.
7. `round_start.mp3` (0.7 s) a friendly little fanfare of three notes.
8. `tick.mp3` (0.1 s) a gentle clock tick for the timer.
9. `time_up.mp3` (0.8 s) a soft descending marimba run (not a buzzer).
10. `win_fanfare.mp3` (3 s) a big happy fanfare with a cymbal shimmer.
Power-ups (one each, 0.6 to 1.2 s, each different and funny):
11. `pu_good.mp3` a bright rising twinkle (used for fairy, gift, heart, lifesaver).
12. `pu_star.mp3` a shimmering double chime.
13. `pu_rocket.mp3` a rising whoosh with a sparkle.
14. `pu_banana.mp3` a cartoon slip: a quick falling glissando and a soft boing.
15. `pu_gold.mp3` a bright coin shower of many small metallic clinks.
16. `pu_boom.mp3` a comic soft "boom" (low thump with a round tail, funny not scary).
17. `pu_trap.mp3` a short sad trombone-like falling slide (comic).
18. `pu_seesaw.mp3` two wooden creaks and a swap blip.
19. `pu_reset.mp3` a rewinding scratch (for eraser and virus).
20. `pu_shark.mp3` two low cello notes (da-dum) with a bubble pop.
Plinko mode:
21. `plinko_drop.mp3` (0.5 s) a pumpkin pop and a soft whistle falling.
22. `plinko_peg_1.mp3`, `plinko_peg_2.mp3`, `plinko_peg_3.mp3` (0.12 s each) three different tiny marimba or wood plinks (pitch up a little each) for the peg hits.
23. `plinko_slot_low.mp3`, `plinko_slot_mid.mp3`, `plinko_slot_high.mp3` (1 s each) three chimes of rising size when the pumpkin lands in a slot (the high one is a big sparkly arpeggio).
Hunt mode:
24. `hunt_rustle.mp3` (0.5 s) leaves rustling (filtered noise).
25. `hunt_dig.mp3` (0.4 s) a soft dig thump.
26. `hunt_prize.mp3` (0.9 s) a happy discovery chime.
27. `hunt_empty.mp3` (0.5 s) a soft "aww" two-note falling marimba.
28. `hunt_step.mp3` (0.15 s) a tiny footstep pat.
Halloween atmosphere:
29. `ghost_woo.mp3` (1.2 s) a friendly cartoon "wooo" made from a gentle sine with vibrato, playful.
30. `bat_flutter.mp3` (0.8 s) quick soft wing flaps (filtered noise pulses).
31. `witch_giggle.mp3` (1 s) three quick cheerful rising blips like a playful giggle (not a cackle).
32. `halloween_loop.mp3` (40 s, seamless loop) a friendly spooky-fun background tune in a minor key at about 96 BPM: pizzicato strings, soft celesta, a light xylophone, a gentle bass, NO drums that startle, quiet (about -18 dB average) so it can sit under speech. The last bar must flow back into the first.
33. `classic_loop.mp3` (40 s, seamless loop) a bright, light game-show background at about 108 BPM, quiet, friendly.

## Final step
Write `PROGRESS.txt` listing each file with OK or FAILED/SKIPPED and its duration, and a last line `N/35 OK` (count each of the files named above, including the three plinko pegs and three slots). Stop. Do not do anything else.
