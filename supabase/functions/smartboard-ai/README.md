# Smart Board AI setup (one time, about 10 minutes)

The **🪄 Smart Board** (`smart-board/index.html`) works without this: pen, colours, library pictures,
`/spell`, `/say`, `/timer`, `/pick` and `/help` need no AI. This setup switches on the AI commands:
**✨ Neat writing**, `/draw`, `/word`, `/sentences`, `/quiz`, `/story`, `/tr`, `/check`, `/ask`, and turning a sketch into a picture.

Your Gemini key is only ever stored as a **Supabase secret**. It is never in the page or in GitHub.

## 1. Get a Gemini API key
1. Go to **aistudio.google.com** and sign in with your Google account.
2. **Get API key** > **Create API key**. Copy it.
3. Pictures have **no free tier**: in AI Studio open **Billing** and switch on a paid plan (a card is needed).
   A picture costs about $0.07; the daily limit below keeps the bill small (30 pictures ≈ $2 at most per day).
   Text requests (neat writing, quizzes, stories) cost a tiny fraction of a cent each.
   The Gemini Ultra app subscription is separate from the API and does not pay for this.

## 2. The daily counter (SQL)
Supabase dashboard > **SQL Editor** > paste the contents of `supabase/ai_usage.sql` > **Run**.

## 3. The function
Supabase dashboard > **Edge Functions** > **Deploy a new function** > **Via Editor**
- Name: `smartboard-ai`
- Paste the whole of `supabase/functions/smartboard-ai/index.ts` > **Deploy**
- Open the function's settings and switch **Verify JWT** **OFF** (the PIN is the lock).

## 4. The secrets
Supabase dashboard > **Edge Functions** > **Secrets** > add:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | the key from step 1 |
| `BOARD_PIN` | a PIN only you know, 6 or more digits (if you leave it out, your Voice Studio `STUDIO_PIN` is used) |
| `IMAGE_DAILY_CAP` | optional, pictures per day (default 30) |
| `TEXT_DAILY_CAP` | optional, other AI requests per day (default 300) |
| `TEXT_MODEL`, `IMAGE_MODEL` | optional, only if Google renames its models (defaults `gemini-3.5-flash`, `gemini-3.1-flash-image`; older models are tried automatically) |

## 5. Use it
Open the Smart Board > **⚙️** > type your PIN once > the AI light turns green.

## Good to know
- Only the teacher's typed words, or a picture of what was written on the board, are sent to Google. No names, no voices, no pupil data.
- Wrong PIN 8 times in a row locks the AI for one minute.
- If the internet or the AI fails, the board keeps working; only the AI commands wait.
