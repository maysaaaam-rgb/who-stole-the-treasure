/**
 * Tea Party homework – Google Sheet receiver (Google Apps Script)
 *
 * Paste this whole file into: your Google Sheet > Extensions > Apps Script.
 * Then Deploy > New deployment > type "Web app" > Execute as: Me > Who has access: Anyone > Deploy.
 * Copy the "Web app URL" (it ends with /exec) and send it to your developer / put it in config.js.
 *
 * One row per student: it is created when the student starts and updated as they finish steps.
 */
const TOKEN = 'eaa-tea-4f7c9d2b81a6';          // must match config.js (keeps random bots out)
const SHEET_NAME = 'Results';
const HEADERS = ['Last update', 'Class', 'Student', 'Character', 'Steps done (of 5)', 'Finished?', 'XP', 'Homework', 'Student ID', 'First start', 'Device'];

function doGet() {
  return ContentService.createTextOutput('Tea Party receiver is ready ✓');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) return reply({ ok: false, error: 'bad token' });
    if (d.homework === 'chuseok-w2-cooking') { upsertCooking(d); return reply({ ok: true }); }   // Chuseok Week 2 cooking homework
    if (d.gameName) { upsertChuseok(d); return reply({ ok: true }); }   // Chuseok Games written homework
    if (!d.studentId) return reply({ ok: false, error: 'no student' });
    upsert(d);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function upsert(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
  }
  const now = new Date();
  const steps = Math.max(0, Math.min(5, Number(d.steps) || 0));
  const finished = steps >= 5;
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues() : [];
  let idx = -1;
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][8]) === String(d.studentId) && String(rows[i][7]) === String(d.homework)) { idx = i; break; }
  }
  if (idx === -1) {
    sh.appendRow([now, d.classLabel || '', d.name || '', d.character || '', steps, finished ? 'YES' : 'no', Number(d.xp) || 0, d.homework || '', d.studentId, now, String(d.device || '').slice(0, 60)]);
  } else {
    const r = rows[idx], rowNo = idx + 2;
    const best = Math.max(Number(r[4]) || 0, steps);              // never go backwards
    sh.getRange(rowNo, 1, 1, HEADERS.length).setValues([[now, d.classLabel || r[1], d.name || r[2], d.character || r[3], best, best >= 5 ? 'YES' : 'no', Math.max(Number(r[6]) || 0, Number(d.xp) || 0), r[7], r[8], r[9], String(d.device || r[10]).slice(0, 60)]]);
  }
  colour(sh);
}

// ---------- Chuseok Games: written answers, one row per class + student + activity ----------
const CHUSEOK_SHEET = 'Chuseok';
const CHUSEOK_HEADERS = ['Last update', 'Class', 'Student', 'Activity', 'How I made it', 'How to play', 'What I say (host speech)'];

function upsertChuseok(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CHUSEOK_SHEET) || ss.insertSheet(CHUSEOK_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(CHUSEOK_HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, CHUSEOK_HEADERS.length).setFontWeight('bold').setBackground('#7c2d12').setFontColor('#ffffff');
    sh.setColumnWidths(5, 3, 320);
  }
  const clip = v => String(v || '').slice(0, 3000);
  const row = [new Date(), clip(d.className), clip(d.studentName), clip(d.gameName), clip(d.howMade), clip(d.howPlay), clip(d.hostSpeech)];
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 2, sh.getLastRow() - 1, 3).getValues() : [];
  let idx = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === row[1] && rows[i][1] === row[2] && rows[i][2] === row[3]) { idx = i; break; }
  }
  const target = idx === -1 ? sh.getLastRow() + 1 : idx + 2;
  sh.getRange(target, 1, 1, row.length).setValues([row]).setWrap(true).setVerticalAlignment('top');
}

// ---------- Chuseok Week 2 cooking homework: one row per class + student ----------
const COOKING_SHEET = 'Cooking';
const COOKING_HEADERS = ['Last update', 'Class', 'Student', 'Dish', 'What I made and used', 'How I made it', 'How it tasted', 'Photo / video link', 'XP to add'];

function upsertCooking(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(COOKING_SHEET) || ss.insertSheet(COOKING_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COOKING_HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COOKING_HEADERS.length).setFontWeight('bold').setBackground('#7c2d12').setFontColor('#ffffff');
    sh.setColumnWidths(5, 3, 320);
  }
  const clip = v => String(v || '').slice(0, 3000);
  let link = '';
  if (d.file && d.file.data) { try { link = saveCookingFile(d); } catch (err) { link = 'upload failed: ' + String(err).slice(0, 80); } }
  const row = [new Date(), clip(d.className), clip(d.studentName), clip(d.dish), clip(d.made), clip(d.how), clip(d.taste), link || 'no', Number(d.xp) || 0];
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 2, sh.getLastRow() - 1, 2).getValues() : [];
  let idx = -1;
  for (let i = 0; i < rows.length; i++) { if (rows[i][0] === row[1] && rows[i][1] === row[2]) { idx = i; break; } }
  const target = idx === -1 ? sh.getLastRow() + 1 : idx + 2;
  if (idx !== -1 && !link) { const old = String(sh.getRange(target, 8).getValue() || ''); if (old && old !== 'no') row[7] = old; }   // keep the earlier photo link when a pupil re-sends only text
  sh.getRange(target, 1, 1, row.length).setValues([row]).setWrap(true).setVerticalAlignment('top');
}

// Photo / video from the cooking page: saved in the Drive folder "Chuseok Cooking Uploads" (private, only you can open it)
function saveCookingFile(d) {
  const folders = DriveApp.getFoldersByName('Chuseok Cooking Uploads');
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder('Chuseok Cooking Uploads');
  const mime = String(d.file.mime || 'image/jpeg');
  if (!/^(image|video)\//.test(mime)) throw new Error('not a photo or video');
  const name = String(d.file.name || (d.studentName + ' - cooking')).replace(/[\/:*?"<>|]/g, '-').slice(0, 120);
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(d.file.data), mime, name));
  return file.getUrl();
}

// green = finished, yellow = started
function colour(sh) {
  const n = sh.getLastRow() - 1; if (n < 1) return;
  const vals = sh.getRange(2, 6, n, 1).getValues();
  const bg = vals.map(v => [v[0] === 'YES' ? '#d1fae5' : '#fef9c3']);
  sh.getRange(2, 1, n, HEADERS.length).setBackgrounds(bg.map(c => Array(HEADERS.length).fill(c[0])));
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
