# Gemini prompt: Moon Song v2 (music + voice for the video's song)

Paste everything below the line into Gemini. Save results in the folder `unit4-work/moon-song-v2/`.
Do NOT run git, do NOT edit any project file. Only create files in that folder.

---

I am an English teacher. My Grade 3 class (age 8-9) will learn a Chuseok circle song ("Ganggangsullae"). I want the SAME song as this video: https://www.youtube.com/watch?v=BmhVJJY0LEA (KIZSONG, "Ganggangsullae Kids Moon Dance").

Do these steps in order. Write progress to `PROGRESS.txt` in the folder as you go.

## Step 1: lyrics text file
Listen to the video and write `lyrics.txt`: every line the children sing, in order, one line per row, in this format:
`N | line text | language (EN or KO) | is it the call or the answer (CALL / ANSWER)`
Mark Korean words, and give a simple English meaning in a 5th column if a line is Korean.
Tell me how many CALL lines there are (L). If you are not sure of a word, write [?] and do not invent it.

## Step 2: timed music tracks (instrumental, same style and tune as the video)
Structure of every track: 1 count-in bar (4 clicks), then L pairs of bars. Each pair = bar A (the leader's line, quiet melody so the teacher's voice is clear) and bar B (the circle answer, fuller and louder). Every bar is exactly 4 beats in 4/4. No silence at the start. No fade-out before the last bar ends. End with a clean final chord.
Make these files, all MP3, 44.1 kHz:
- `song_drum_60.mp3`, `song_drum_84.mp3`, `song_drum_108.mp3` (with a clear folk drum on beats 1 and 3)
- `song_nodrum_60.mp3`, `song_nodrum_84.mp3`, `song_nodrum_108.mp3` (NO drum, because a pupil drums live)
- `song_sung_60.mp3`, `song_sung_84.mp3` (a clear child-friendly voice sings the leader line in bar A, a group answers in bar B)
- `victory_2bars.mp3` (a short happy ending jingle)
Check the bar lengths: at 84 BPM one bar = 2.857 s, at 60 BPM = 4.0 s, at 108 BPM = 2.222 s. The file length must be (1 + 2 x L) bars.

## Step 3: teacher voice
One warm, slow, clear female teacher voice, native English, speaking rate slow for 8-year-olds. Make one MP3 per item, named exactly:
- `line_1.mp3` ... `line_L.mp3` (each lyric CALL line, spoken slowly, then once more slightly slower is NOT needed, just once)
- `answer.mp3` (the circle's answer word/line)
- `listen.mp3` ("Listen."), `your_turn.mp3` ("Your turn."), `try_again.mp3` ("Let's try again."), `good_job.mp3` ("Good job!"), `first.mp3`, `then.mp3`, `finally.mp3`
- `hm_step_slowly.mp3`, `hm_step_quickly.mp3`, `hm_turn_slowly.mp3`, `hm_turn_quickly.mp3`, `hm_clap_slowly.mp3`, `hm_hop_quickly.mp3`, `hm_bow_slowly.mp3`, `hm_bow_quickly.mp3` (e.g. "Step slowly.")
No sound effects, no music, no long silence at the start or end of each file (max 0.2 s).

## Step 4: drum hits
`drum_dung.mp3` (deep, loud, 0.5 s) and `drum_deok.mp3` (sharp, loud rim/slap, 0.3 s). They must be audible on small classroom speakers: strong energy between 300 Hz and 4 kHz, not just bass. No food words anywhere.

## Report
At the end write `REPORT.txt`: L, the duration of every track, and anything you were unsure about. Do not change anything outside this folder.
