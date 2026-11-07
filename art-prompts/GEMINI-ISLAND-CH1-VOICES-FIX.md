# Fix all Chapter 1 voices (paste everything below the line into the Gemini agent that can read and save files in this project)

---

You are the voice producer for "Treasure Island, Chapter 1: Admiral Benbow Harbour", an English game for pupils aged 8 to 9 (Grades 3 and 4, Pre-A1/A1). I am away: work alone. If one recording fails, retry it up to 3 times, then skip it and write it in the log.

WHAT IS WRONG
Claude rebuilt the five harbour stops as new mini adventures. The game now says 147 lines that have NO recording, so pupils hear the robotic browser voice in the middle of the real voices. Your job has two parts:
1. Record all 147 new lines below.
2. Check the 686 recordings you made before (island\audio\ch1\) and record again any that are bad.

HARD RULES
- Create files ONLY inside C:\Users\maysa\Desktop\DV\island-work\audio-ch1-fix\ (create it). Do NOT write into island\audio\ch1\ and do NOT edit manifest.json there. Claude will copy your files in.
- You may READ anything in island\ (listen to the old recordings so the voices match).
- DO NOT run git. DO NOT commit or push. DO NOT edit, move, rename or delete any other file. No code changes.
- Use the SAME natural neural voices you used for the first Chapter 1 recordings (edge-tts neural voices), one fixed voice per character. Never a robotic system voice. If you cannot make natural speech, write FAILED in PROGRESS.txt and stop.
- Be honest: write OK only for a file you actually generated and checked.

THE VOICES (keep each character identical in every file)
- JIM: the same voice as g3_s1_jim_01.mp3. Warm, friendly, clear.
- FLINT: the same voice as g3_s1_flint_01.mp3. Cheerful and a bit playful, but every word clear (no squawk noises over the words).
- BILLY: the same voice as g3_s5_billy_intro.mp3. Gruff but kind, never scary.
- CHILD: a NEW voice: a happy, clear child voice (girl or boy), different from Jim, so pupils hear their own monster answering.
- American English (en-US). About 10% slower than normal (rate -10%), clear separate words, natural rhythm, a smile in the voice.
- Say numbers naturally: "clue 2" = "clue two", "12" = "twelve", "twenty-four" as one number. Dates are read exactly as written (for example "twenty-nine October").
- Each file: ONE line only, about 0.2 s of silence at the start and the end, no music or background noise, peak about -3 dB. MP3, 24 kHz or 44.1 kHz, mono is fine.
- Say the text EXACTLY as written: same words, no extra words. The game finds a recording by its exact words.

PART 1: THE 147 NEW LINES (file name = text; save as <name>.mp3)
JIM (Jim Hawkins, the friendly boy guide) — also says the game helper lines:
hb_jim_001 = All aboard! The Hispaniola is ready!
hb_jim_002 = First, find all five clues!
hb_jim_003 = First, the inn door!
hb_jim_004 = First, clue 2!
hb_jim_005 = First, clue 3!
hb_jim_006 = First, clue 4!
hb_jim_007 = First, clue 5!
hb_jim_008 = Well done, Captain! Every clue is solved!
hb_jim_009 = Ahoy, Captain! Tap the inn door!
hb_jim_010 = Ahoy, Captain! Tap clue 2!
hb_jim_011 = Ahoy, Captain! Tap clue 3!
hb_jim_012 = Ahoy, Captain! Tap clue 4!
hb_jim_013 = Ahoy, Captain! Tap clue 5!
hb_jim_014 = Try again!
hb_jim_015 = Clue one! Well done, Captain!
hb_jim_016 = Clue two! Well done, Captain!
hb_jim_017 = Clue three! Well done, Captain!
hb_jim_018 = Clue four! Well done, Captain!
hb_jim_019 = Clue five! Well done, Captain!
hb_jim_020 = Look at the sky! What do we say?
hb_jim_021 = How are you?
hb_jim_022 = Who is it?
hb_jim_023 = Knock on the door!
hb_jim_024 = Hmm? Try again!
hb_jim_025 = Good morning! How are you?
hb_jim_026 = Great! Look, the sun is high now!
hb_jim_027 = Good evening! The lanterns are on!
hb_jim_028 = Good night! Here is our first clue!
hb_jim_029 = Yes, you can! Come in!
hb_jim_030 = Sorry, not right now. It's raining!
hb_jim_031 = Sure! Here you are!
hb_jim_032 = Benbow wants to go out.
hb_jim_033 = Oh no! It is dark!
hb_jim_034 = Look! Flint is at the window!
hb_jim_035 = Who's this? She helps us find books.
hb_jim_036 = Where is Benbow? Listen! Piano and drums!
hb_jim_037 = Who's this? She helps us when we are sick.
hb_jim_038 = Where is she? She is painting a picture.
hb_jim_039 = Who's this? He cleans our school.
hb_jim_040 = Thank you!
hb_jim_041 = Now you ask me for the map!
hb_jim_042 = Find the cake!
hb_jim_043 = Yes! The cake!
hb_jim_044 = That's the candle. Find the cake!
hb_jim_045 = That's the balloon. Find the cake!
hb_jim_046 = That's the gift. Find the cake!
hb_jim_047 = Find the candle!
hb_jim_048 = Yes! The candle!
hb_jim_049 = That's the cake. Find the candle!
hb_jim_050 = That's the balloon. Find the candle!
hb_jim_051 = That's the gift. Find the candle!
hb_jim_052 = Find the balloon!
hb_jim_053 = Yes! The balloon!
hb_jim_054 = That's the cake. Find the balloon!
hb_jim_055 = That's the candle. Find the balloon!
hb_jim_056 = That's the gift. Find the balloon!
hb_jim_057 = Find the gift!
hb_jim_058 = Yes! The gift!
hb_jim_059 = That's the cake. Find the gift!
hb_jim_060 = That's the candle. Find the gift!
hb_jim_061 = That's the balloon. Find the gift!
hb_jim_062 = How old are you?
hb_jim_063 = When's your birthday?
hb_jim_064 = In July! Hooray!
hb_jim_065 = How many barrels? Count in tens!
hb_jim_066 = twenty-four! Yes!
hb_jim_067 = Yes! twenty-four barrels!
hb_jim_068 = How many sea gulls? Count in tens!
hb_jim_069 = thirty-five! Yes!
hb_jim_070 = Yes! thirty-five sea gulls!
hb_jim_071 = How many lanterns? Count in tens!
hb_jim_072 = forty-eight! Yes!
hb_jim_073 = Yes! forty-eight lanterns!
hb_jim_074 = How many gold coins? Count in tens!
hb_jim_075 = fifty! Yes!
hb_jim_076 = Yes! fifty gold coins!

FLINT (Captain Flint, the parrot):
hb_flint_001 = January! Find January!
hb_flint_002 = February! Find February!
hb_flint_003 = March! Find March!
hb_flint_004 = April! Find April!
hb_flint_005 = May! Find May!
hb_flint_006 = June! Find June!
hb_flint_007 = July! Find July!
hb_flint_008 = August! Find August!
hb_flint_009 = September! Find September!
hb_flint_010 = October! Find October!
hb_flint_011 = November! Find November!
hb_flint_012 = December! Find December!
hb_flint_013 = Yes! Well done!
hb_flint_014 = Good job!
hb_flint_015 = Flint says: Sit down, please!
hb_flint_016 = Flint says: Stand up, please!
hb_flint_017 = Flint says: Open your book, please!
hb_flint_018 = Flint says: Raise your hand, please!

BILLY (Billy Bones, the old sailor):
hb_billy_001 = What special day is twenty-nine October?
hb_billy_002 = What special day is twenty-three April?
hb_billy_003 = What special day is nineteen May?
hb_billy_004 = nineteen May is Youth and Sports Day!
hb_billy_005 = What special day is thirty August?
hb_billy_006 = Number 1 is eighteen!
hb_billy_007 = Listen! eighteen!
hb_billy_008 = Number 2 is thirty-five!
hb_billy_009 = Listen! thirty-five!
hb_billy_010 = Number 3 is fifty!
hb_billy_011 = Listen! fifty!
hb_billy_012 = Click! Now ask me politely!

CHILD (the pupil's own monster saying the answer the pupil tapped):
hb_child_001 = Good afternoon!
hb_child_002 = Can I come in?
hb_child_003 = Can I go out?
hb_child_004 = Can I open the window?
hb_child_005 = Sit down, please.
hb_child_006 = He's in the art room.
hb_child_007 = She's in the music room.
hb_child_008 = It's February!
hb_child_009 = It's March!
hb_child_010 = It's April!
hb_child_011 = It's May!
hb_child_012 = It's June!
hb_child_013 = It's July!
hb_child_014 = It's August!
hb_child_015 = It's September!
hb_child_016 = It's October!
hb_child_017 = It's December!
hb_child_018 = Stand up, please!
hb_child_019 = Open your book, please!
hb_child_020 = Raise your hand, please!
hb_child_021 = The cake!
hb_child_022 = The candle!
hb_child_023 = The balloon!
hb_child_024 = The gift!
hb_child_025 = I'm eight.
hb_child_026 = This is the nurse.
hb_child_027 = forty-two barrels!
hb_child_028 = fourteen barrels!
hb_child_029 = fifty-three sea gulls!
hb_child_030 = twenty-five sea gulls!
hb_child_031 = thirty-eight lanterns!
hb_child_032 = forty-four lanterns!
hb_child_033 = fifteen gold coins!
hb_child_034 = forty gold coins!
hb_child_035 = It's Republic Day!
hb_child_036 = It's Children's Day!
hb_child_037 = It's Youth and Sports Day!
hb_child_038 = It's Victory Day!
hb_child_039 = Can I open the chest?
hb_child_040 = Close the door.
hb_child_041 = Fifty coins!

PART 2: CHECK THE OLD RECORDINGS
Listen to (or check by speech recognition) every mp3 in island\audio\ch1\ against its "text" in island\audio\ch1\manifest.json. Record again ONLY files that are: cut off, silent, wrong words, mispronounced, too fast, or in the wrong character's voice. Save the new version in the fix folder with the SAME file name as the old one. Do not re-record good files.

FINISH
1. Write C:\Users\maysa\Desktop\DV\island-work\audio-ch1-fix\new-lines.json: a JSON object, one entry per Part 1 file, exactly like this:
   {"hb_jim_001": {"file": "hb_jim_001.mp3", "speaker": "jim", "text": "All aboard! The Hispaniola is ready!"}, ...}
2. Write PROGRESS.txt in the same folder: one line per Part 1 file (OK or SKIPPED), then a list of the Part 2 files you re-recorded and why, then the exact voice name used for each character (JIM, FLINT, BILLY, CHILD), and a last line "N/147 OK".
3. Stop. Do nothing else.
