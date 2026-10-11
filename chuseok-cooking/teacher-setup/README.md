# Cooking homework results (Google Sheet) – 5 minutes, one time

1. Go to **sheets.google.com** → **Blank spreadsheet**. Name it **Chuseok Cooking Results**.
2. Menu **Extensions → Apps Script**. A code editor opens.
3. Delete everything in the editor. Open `Code.gs` (this folder), copy **all** of it, paste it in. Click the 💾 Save icon.
4. Click **Deploy → New deployment**. Click the ⚙️ next to "Select type" → **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy**. Google asks for permission → **Authorize access** → choose your account → *Advanced* → *Go to project (unsafe)* → **Allow**. (It is your own script. It needs Drive so it can save the photos.)
5. Copy the **Web app URL** (ends with `/exec`).
6. Open that URL in a browser tab. You should see: **Chuseok cooking receiver is ready ✓**
7. Send the URL to your developer (or paste it into `chuseok-cooking/js/data.js` as `submitUrl`).

## What you will see
- A tab called **Cooking**: one row per pupil with class, dish, the three written answers and a link to the photo or video. Green row = photo received. Yellow row = text only.
- A private Drive folder **Chuseok Cooking Uploads** with every photo and video. Only you can open it.
- A pupil who sends again updates their own row (no double rows).
- XP is not added to the platform automatically. Check the sheet, then add the 50 XP.
