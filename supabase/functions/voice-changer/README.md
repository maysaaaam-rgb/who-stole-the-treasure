# Voice Studio setup (one time, about 5 minutes)

The **✨ Studio** tab in the 🎙️ Voice tool changes the teacher's voice into a character with ElevenLabs
(Wise Owl, Dragon, Fairy, Robot, Witch, Hero). The ⚡ Live tab works without any of this.

Your ElevenLabs key is only ever stored as a **Supabase secret**. It is never in the page or in GitHub.

## 1. The daily counter (SQL)
Supabase dashboard > **SQL Editor** > paste the contents of `supabase/voice_usage.sql` > **Run**.

## 2. The function
Supabase dashboard > **Edge Functions** > **Deploy a new function** > **Via Editor**
- Name: `voice-changer`
- Paste the whole of `supabase/functions/voice-changer/index.ts` > **Deploy**
- Open the function's settings and switch **Verify JWT** **OFF** (the PIN is the lock).

(With the command line instead: `supabase functions deploy voice-changer --no-verify-jwt`.)

## 3. The secrets
Supabase dashboard > **Edge Functions** > **Secrets** > add:

| Name | Value |
|---|---|
| `ELEVENLABS_API_KEY` | your key from ElevenLabs (profile > API Keys). If you limit the key, allow **Speech to Speech**, **Voices (read)** and **User (read)**. |
| `STUDIO_PIN` | a PIN only you know, 6 or more digits |
| `DAILY_CAP` | optional, transformations per day (default 30) |

## 4. Use it
Open the platform > 🎙️ **Voice** > **✨ Studio** > type your PIN > turn on the microphone >
choose a character > **hold** the button (or **Space**), say a sentence (up to 15 seconds), let go.

## Good to know
- Voices are picked **by name** from the voices in your ElevenLabs account (for example Bill, Callum, Gigi, Brian, Glinda, Harry).
  To choose your own, add secrets `VOICE_OWL`, `VOICE_DRAGON`, `VOICE_FAIRY`, `VOICE_ROBOT`, `VOICE_WITCH`, `VOICE_HERO`
  with an ElevenLabs voice id. A voice from the ElevenLabs library must be added to **My Voices** first.
- Every change uses ElevenLabs credits (charged by the length of the recording). The daily limit protects them.
- The page shows how many changes are left today.
- Teacher's voice only. The recording goes to ElevenLabs to be changed. Nothing is saved on the page or on our side.
- Wrong PIN 8 times in a row locks the Studio for one minute.
