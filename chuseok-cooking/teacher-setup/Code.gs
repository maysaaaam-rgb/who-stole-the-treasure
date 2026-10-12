/**
 * Chuseok Week 2 Cooking Homework: Google Sheet + Drive receiver (Google Apps Script)
 *
 * Paste this whole file into: a NEW Google Sheet > Extensions > Apps Script.
 * Then Deploy > New deployment > type "Web app" > Execute as: Me > Who has access: Anyone > Deploy.
 * Copy the "Web app URL" (it ends with /exec) and send it to your developer.
 *
 * Each pupil gets one row on the "Cooking" tab. Photos and videos go to your private Drive folder "Chuseok Cooking Uploads".
 */
const TOKEN = 'eaa-cook-305208ffc123';          // must match chuseok-cooking/js/data.js (keeps random bots out)
const SHEET_NAME = 'Cooking';
const FOLDER_NAME = 'Chuseok Cooking Uploads';
const HEADERS = ['Last update', 'Class', 'Student', 'Dish', 'What I made and used', 'How I made it', 'How it tasted', 'Photo / video link', 'XP to add'];

function doGet(e) {
  // read-only list for the teacher's platform (Assignments > Sync): who has sent the cooking homework. Needs the same token.
  if (e && e.parameter && e.parameter.action === 'status' && e.parameter.token === TOKEN) return reply({ ok: true, status: statusMap() });
  return ContentService.createTextOutput('Chuseok cooking receiver is ready ✓');
}

function slug(s) { return String(s || '').toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, ''); }
function statusMap() {
  const sh = getBook().getSheetByName(SHEET_NAME), out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues();
  const firsts = {};
  rows.forEach(r => { const m = /([34][ab])/i.exec(String(r[1])); if (m) { const f = slug(String(r[2]).split(' ')[0]); const k = m[1].toLowerCase() + '-' + f; firsts[k] = (firsts[k] || 0) + 1; } });
  rows.forEach(r => {
    const m = /([34][ab])/i.exec(String(r[1])); if (!m) return;
    const parts = String(r[2]).trim().split(/s+/), first = slug(parts[0]), last = slug(parts[parts.length - 1]);
    const cls = m[1].toLowerCase(), base = cls + '-' + first;
    const id = firsts[base] > 1 && parts.length > 1 ? base + last.charAt(0) : base;   // two pupils with the same first name: add the first letter of the surname
    out[id] = { 'chuseok-w2-cooking': { steps: 1, finished: true } };
  });
  return out;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) return reply({ ok: false, error: 'bad token' });
    if (!d.studentName) return reply({ ok: false, error: 'no student' });
    save(d);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// Works from a Sheet (Extensions > Apps Script) AND from a stand-alone script: it makes the Sheet "Chuseok Cooking Results" in your Drive if needed
function getBook() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('BOOK_ID');
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) { /* make a new one below */ } }
  const created = SpreadsheetApp.create('Chuseok Cooking Results');
  props.setProperty('BOOK_ID', created.getId());
  return created;
}

function save(d) {
  const ss = getBook();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#7c2d12').setFontColor('#ffffff');
    sh.setColumnWidths(5, 3, 320);
  }
  const clip = v => String(v || '').slice(0, 3000);
  let link = '';
  if (d.file && d.file.data) { try { link = saveFile(d); } catch (err) { link = 'upload failed: ' + String(err).slice(0, 80); } }
  const row = [new Date(), clip(d.className), clip(d.studentName), clip(d.dish), clip(d.made), clip(d.how), clip(d.taste), link || 'no', Number(d.xp) || 0];
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 2, sh.getLastRow() - 1, 2).getValues() : [];
  let idx = -1;
  for (let i = 0; i < rows.length; i++) { if (rows[i][0] === row[1] && rows[i][1] === row[2]) { idx = i; break; } }
  const target = idx === -1 ? sh.getLastRow() + 1 : idx + 2;
  if (idx !== -1 && !link) { const old = String(sh.getRange(target, 8).getValue() || ''); if (old && old !== 'no') row[7] = old; }   // keep the earlier photo link when a pupil re-sends only text
  sh.getRange(target, 1, 1, row.length).setValues([row]).setWrap(true).setVerticalAlignment('top');
  sh.getRange(target, 1, 1, row.length).setBackground(link && link.indexOf('http') === 0 ? '#d1fae5' : '#fef9c3');   // green = photo received, yellow = text only
}

// Photo / video: saved privately in your Drive, only you can open it
function saveFile(d) {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
  const mime = String(d.file.mime || 'image/jpeg');
  if (!/^(image|video)\//.test(mime)) throw new Error('not a photo or video');
  const name = String(d.file.name || (d.studentName + ' - cooking')).replace(/[\/:*?"<>|]/g, '-').slice(0, 120);
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(d.file.data), mime, name));
  return file.getUrl();
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
