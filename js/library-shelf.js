/* Library shelf: the Library opens on the lessons we made, sorted the way the teacher plans:
   This week | Grade 3 | Grade 4 | Alice | Everything else (the old four tracks, unchanged).
   Inside a grade the lessons are grouped by unit (newest unit first) and newest lesson first.
   The list comes from the Timetable catalogue, so a new lesson appears here as soon as it is registered there. */
(function (root) {
  'use strict';
  var KEY = 'eaa_lib_shelf', TABS = [['week', '📌 This week'], ['g3', '🎒 Grade 3'], ['g4', '🎓 Grade 4'], ['alice', '🫖 Alice'], ['else', '🧰 Everything else']];
  var tab = 'week', q = '';
  try { var s = localStorage.getItem(KEY); if (s && TABS.some(function (t) { return t[0] === s; })) tab = s; } catch (e) { /* storage may be blocked */ }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function catalog() { return (root.Timetable && root.Timetable.catalog) || []; }
  function isAlice(c) { return /alice|tea party/i.test(c.id + ' ' + c.title); }
  function unitOf(c) { var m = /Unit\s*(\d)/i.exec(c.title); return m ? +m[1] : 0; }
  function addedOf(c) { return c.added || '2000-01-01'; }
  function items() {
    var list = catalog().filter(function (c) { return c && c.route; });
    var needle = q.trim().toLowerCase();
    if (needle) list = list.filter(function (c) { return (c.title + ' ' + c.id).toLowerCase().indexOf(needle) >= 0; });
    return list;
  }
  function forTab(t) {
    var list = items(), weekAgo = new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10);
    if (t === 'week') return list.filter(function (c) { return addedOf(c) >= weekAgo; });
    if (t === 'alice') return list.filter(isAlice);
    var g = t === 'g3' ? 3 : 4;
    return list.filter(function (c) { return !isAlice(c) && (!c.g || c.g === g); });
  }
  function newestFirst(a, b) { return addedOf(a) < addedOf(b) ? 1 : (addedOf(a) > addedOf(b) ? -1 : 0); }
  function card(c) {
    var fresh = Date.now() - new Date(addedOf(c)).getTime() < 8 * 86400000;
    var g = c.g ? '<span class="ls-g">G' + c.g + '</span>' : '';
    return '<a class="ls-card" href="' + esc(c.route) + '"><span class="ls-ic">' + esc(c.icon || '📖') + '</span><span class="ls-tx"><b>' + esc(c.title) + '</b><small>' + g + ' ' + esc(addedOf(c) === '2000-01-01' ? '' : addedOf(c)) + '</small></span>' + (fresh ? '<em>NEW</em>' : '') + '<i>▶</i></a>';
  }
  function body() {
    var list = forTab(tab);
    if (!list.length) return '<div class="ls-empty">Nothing here yet' + (q ? ' for “' + esc(q) + '”' : '') + '.</div>';
    if (tab === 'week' || tab === 'alice') return '<div class="ls-grid">' + list.sort(newestFirst).map(card).join('') + '</div>';
    var groups = {}; list.forEach(function (c) { var u = unitOf(c); (groups[u] = groups[u] || []).push(c); });
    return Object.keys(groups).map(Number).sort(function (a, b) { return (b || -1) - (a || -1); }).map(function (u) {
      return '<h3 class="ls-h">' + (u ? '📘 Unit ' + u : '🎲 Songs, games and extras') + ' <span>' + groups[u].length + '</span></h3><div class="ls-grid">' + groups[u].sort(newestFirst).map(card).join('') + '</div>';
    }).join('');
  }
  var CSS = '.ls{max-width:1180px;margin:0 auto;padding:4px 4px 90px;color:#e6e8ee}.ls h1{margin:0 0 4px;font-size:1.5rem}.ls .ls-sub{color:#8b93a7;margin:0 0 12px}' +
    '.ls-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px}.ls-tab{border:0;border-bottom:5px solid #1e293b;background:#334155;color:#fff;font:800 1rem inherit;border-radius:14px;padding:10px 18px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.ls-tab:active{transform:translateY(4px);border-bottom-width:1px}.ls-tab.on{background:#f59e0b;border-bottom-color:#92400e;color:#1c1203}.ls-tab span{opacity:.75;font-weight:700;margin-left:4px}' +
    '.ls-q{width:min(420px,100%);background:rgba(15,23,42,.8);border:1px solid #232a3b;border-radius:12px;color:#e6e8ee;padding:9px 12px;font:inherit;margin-bottom:10px}' +
    '.ls-h{margin:20px 0 8px;font-size:1.15rem;color:#38bdf8}.ls-h span{color:#8b93a7;font-weight:600;font-size:.85rem;margin-left:6px}' +
    '.ls-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}' +
    '.ls-card{position:relative;display:flex;align-items:center;gap:12px;background:rgba(15,23,42,.85);border:1px solid #232a3b;border-radius:16px;padding:14px;text-decoration:none;color:#e6e8ee;box-shadow:0 4px 20px -2px rgba(0,0,0,.4)}' +
    '.ls-card:hover{border-color:#38bdf8}.ls-ic{font-size:2.2rem;flex:none}.ls-tx{flex:1;min-width:0}.ls-tx b{display:block;font-size:.98rem;line-height:1.25}.ls-tx small{color:#8b93a7}.ls-g{background:#0369a1;color:#fff;border-radius:6px;padding:0 6px;font-weight:800;font-size:.7rem}' +
    '.ls-card em{position:absolute;top:8px;right:10px;background:#10b981;color:#06101f;border-radius:8px;font-style:normal;font-weight:800;font-size:.68rem;padding:1px 7px}.ls-card i{font-style:normal;color:#38bdf8;font-size:1.2rem}' +
    '.ls-empty{padding:40px;text-align:center;color:#8b93a7}';
  function ensureCss() { if (!document.getElementById('ls-css')) { var st = document.createElement('style'); st.id = 'ls-css'; st.textContent = CSS; document.head.appendChild(st); } }
  function paint(container) {
    ensureCss();
    var tabs = TABS.map(function (t) { var n = t[0] === 'else' ? '' : ' <span>' + forTab(t[0]).length + '</span>'; return '<button type="button" class="ls-tab' + (t[0] === tab ? ' on' : '') + '" data-t="' + t[0] + '">' + t[1] + n + '</button>'; }).join('');
    container.innerHTML = '<div class="ls"><h1>Library</h1><p class="ls-sub">Our lessons, sorted by week, grade and unit.</p><div class="ls-tabs">' + tabs + '</div>' +
      (tab === 'else' ? '' : '<input class="ls-q" id="ls-q" type="search" placeholder="Search lessons" value="' + esc(q) + '">') + '<div id="ls-body">' + (tab === 'else' ? '' : body()) + '</div></div>';
    [].forEach.call(container.querySelectorAll('.ls-tab'), function (b) {
      b.addEventListener('click', function () { tab = b.getAttribute('data-t'); try { localStorage.setItem(KEY, tab); } catch (e) { /* ignore */ } render(container); });
    });
    var qi = container.querySelector('#ls-q');
    if (qi) qi.addEventListener('input', function () { q = qi.value; var bd = container.querySelector('#ls-body'); if (bd) bd.innerHTML = body(); });
  }
  var orig = null;
  function render(container) {
    if (tab !== 'else') { paint(container); return; }
    paint(container);
    var host = document.createElement('div'); container.querySelector('#ls-body').appendChild(host);
    if (orig) orig(host);
  }
  function install() {
    var lc = root.LibraryController;
    if (!lc || lc.__shelf) return !!(lc && lc.__shelf);
    orig = lc.render.bind(lc); lc.render = render; lc.__shelf = true; return true;
  }
  if (!install()) { var n = 0, iv = setInterval(function () { if (install() || ++n > 40) clearInterval(iv); }, 250); }
  root.LibraryShelf = { setTab: function (t) { tab = t; }, install: install };
})(window);
