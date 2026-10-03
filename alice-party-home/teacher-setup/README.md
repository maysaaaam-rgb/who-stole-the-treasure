# See who did the tea party homework (Google Sheet) – 5 minutes, one time

1. Go to **sheets.google.com** → **Blank spreadsheet**. Name it **Tea Party Results**.
2. Menu **Extensions → Apps Script**. A code editor opens.
3. Delete everything in the editor. Open `Code.gs` (this folder), copy **all** of it, paste it in. Click the 💾 Save icon.
4. Click **Deploy → New deployment**. Click the ⚙️ next to "Select type" → **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy**. Google asks for permission → **Authorize access** → choose your account → *Advanced* → *Go to project (unsafe)* → **Allow**. (It is your own script.)
5. Copy the **Web app URL** (ends with `/exec`).
6. Open that URL in a browser tab. You should see: **Tea Party receiver is ready ✓**
7. Send the URL to your developer (or paste it into `alice-party-home/config.js` as `submitUrl`).

## What you will see
A tab called **Results** fills automatically, one row per student:

| Class | Student | Character | Steps done (of 5) | Finished? | XP |
|---|---|---|---|---|---|
| Class 4A | Alya | the Cheshire Cat | 5 | YES (green) | 60 |

- Yellow row = started but not finished. Green row = finished all 5 steps.
- A student who practises again never lowers their row.
- Filter or sort by **Class** or **Finished?** to see who is missing.

## Notes
- Students' phones need internet to send. If there is none, the app keeps the result and sends it later.
- The result shows what the student did on their own phone. Use it together with the 1-minute conversation at the party.
- XP is not added to the platform automatically. You decide after checking the sheet.
