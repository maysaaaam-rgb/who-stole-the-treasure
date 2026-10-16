/* Daily report page. The 18:00 school-day check (a scheduled task that reads the school's k12 site and the platform in the teacher's own Chrome) writes its summary into
   this browser's localStorage under "eaa_daily_report_v1". Nothing here is public: the names live only on the teacher's computer, never in the website's code.
   Shape: { at: ISO time, summary: "one line", sections: [ { title, icon, items: [ { text, who, level } ] } ], updated: [ "what the task changed" ] }  (level: "info" | "warn" | "good") */
(function (root) {
  'use strict';
  var KEY = 'eaa_daily_report_v1';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function css() {
    if (document.getElementById('dr-css')) return;
    var s = document.createElement('style'); s.id = 'dr-css';
    s.textContent = '#dr-box{position:fixed;inset:0;z-index:100002;background:#060911;overflow:auto;padding:18px;color:#e8eefc;font-family:Inter,system-ui,sans-serif}' +
      '#dr-box .dr-in{max-width:860px;margin:0 auto}#dr-box h2{margin:0 0 4px}.dr-sub{color:#8b94a8;font-size:.86rem}.dr-sum{background:rgba(15,23,42,.85);border:1px solid #232a3d;border-radius:16px;padding:14px 16px;margin:14px 0;font-size:1rem}' +
      '.dr-card{background:rgba(15,23,42,.85);border:1px solid #232a3d;border-radius:16px;padding:14px 16px;margin-bottom:12px}.dr-card h3{margin:0 0 8px;font-size:.98rem}' +
      '.dr-i{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid #1b2234;font-size:.9rem}.dr-i:last-child{border:0}.dr-d{flex:none;width:10px;height:10px;border-radius:50%;margin-top:6px;background:#38bdf8}.dr-warn .dr-d{background:#fbbf24}.dr-good .dr-d{background:#34d399}' +
      '.dr-who{color:#a5b4fc;font-weight:700}.dr-btn{border:0;border-bottom:5px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;border-radius:12px;padding:8px 16px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}.dr-btn:active{transform:translateY(4px);border-bottom-width:1px}.dr-btn.o{background:#334155;border-bottom-color:#1e293b;color:#e2e8f0}';
    document.head.appendChild(s);
  }
  root.DailyReport = {
    load: load,
    open: function () {
      css(); var r = load();
      var box = document.getElementById('dr-box'); if (!box) { box = document.createElement('div'); box.id = 'dr-box'; document.body.appendChild(box); }
      var when = r && r.at ? new Date(r.at).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '';
      var body = !r ? '<div class="dr-card">No report yet. The daily check runs on school days at 18:00 (the computer, Chrome and Claude have to be open) and writes its summary here.</div>' :
        '<div class="dr-sub">Latest report: ' + esc(when) + '</div><div class="dr-sum">' + esc(r.summary || '') + '</div>' +
        (r.sections || []).map(function (s) {
          return '<div class="dr-card"><h3>' + esc(s.icon || '') + ' ' + esc(s.title) + ' <span class="dr-sub">(' + (s.items || []).length + ')</span></h3>' +
            ((s.items || []).length ? (s.items || []).map(function (i) { return '<div class="dr-i dr-' + esc(i.level || 'info') + '"><span class="dr-d"></span><div>' + (i.who ? '<span class="dr-who">' + esc(i.who) + '</span> ' : '') + esc(i.text) + '</div></div>'; }).join('') : '<div class="dr-sub">Nothing new.</div>') + '</div>';
        }).join('') +
        ((r.updated || []).length ? '<div class="dr-card"><h3>✅ What the check changed</h3>' + r.updated.map(function (u) { return '<div class="dr-i dr-good"><span class="dr-d"></span><div>' + esc(u) + '</div></div>'; }).join('') + '</div>' : '');
      box.innerHTML = '<div class="dr-in"><div style="display:flex;gap:8px;align-items:center"><h2>📰 Daily report</h2><button class="dr-btn o" style="margin-left:auto" onclick="DailyReport.close()">Close ✕</button></div>' + body + '</div>';
      box.style.display = 'block';
    },
    close: function () { var b = document.getElementById('dr-box'); if (b) b.style.display = 'none'; }
  };
})(typeof window !== 'undefined' ? window : this);
