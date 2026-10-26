/* Class Board scenes: the roster becomes a place where the monsters live. The scene changes with the class and the date
   (Alice for Grade 4, Chuseok for Grade 3, Halloween around the 31st, Meadow otherwise) or by the teacher's choice.
   Pictures (optional, from Gemini): assets/scenes/bg_<id>.webp, ped_<id>.webp, rest_<id>.webp. Without them the CSS gradients below are used.
   To add a theme: add one entry to THEMES and, if it should start by itself, one line to RULES. */
(function (root) {
  'use strict';
  var THEMES = {
    meadow: { id: 'meadow', name: 'Meadow', e: '🏝️', sign: 'linear-gradient(180deg,#a16207,#78350f)', ink: '#fff7ed', plinth: ['#d6d3d1', '#78716c'], rest: '⛺',
      bg: 'linear-gradient(180deg,#7dd3fc 0%,#bae6fd 24%,#a7f3d0 24.2%,#4ade80 52%,#16a34a 100%)', deco: 'radial-gradient(ellipse at 18% 26%,rgba(255,255,255,.55) 0 8%,transparent 9%),radial-gradient(ellipse at 70% 18%,rgba(255,255,255,.5) 0 7%,transparent 8%)' },
    alice: { id: 'alice', name: 'Alice Tea Party', e: '🫖', sign: 'linear-gradient(180deg,#f9a8d4,#db2777)', ink: '#fff', plinth: ['#fbcfe8', '#a21caf'], rest: '🫖',
      bg: 'linear-gradient(180deg,#fbcfe8 0%,#fbcfe8 32%,rgba(251,207,232,0) 33%),repeating-conic-gradient(#99f6e4 0% 25%,#f0abfc 0% 50%) 0 0/84px 84px', deco: 'radial-gradient(ellipse at 15% 14%,rgba(255,255,255,.6) 0 7%,transparent 8%),radial-gradient(ellipse at 84% 12%,rgba(255,255,255,.55) 0 6%,transparent 7%)' },
    chuseok: { id: 'chuseok', name: 'Chuseok Night', e: '🌕', sign: 'linear-gradient(180deg,#b45309,#7c2d12)', ink: '#fff7ed', plinth: ['#fde68a', '#b45309'], rest: '🏮',
      bg: 'radial-gradient(circle at 80% 17%,#fffbe0 0 4.5%,rgba(255,236,150,.45) 5.5%,transparent 17%),linear-gradient(180deg,#0b1d4a 0%,#1e3a8a 50%,#3b2a14 100%)', deco: 'radial-gradient(circle at 12% 20%,rgba(255,255,255,.7) 0 .25%,transparent .4%),radial-gradient(circle at 34% 10%,rgba(255,255,255,.7) 0 .25%,transparent .4%),radial-gradient(circle at 55% 24%,rgba(255,255,255,.6) 0 .25%,transparent .4%)' },
    halloween: { id: 'halloween', name: 'Halloween', e: '🎃', sign: 'linear-gradient(180deg,#6d28d9,#3b0764)', ink: '#ffedd5', plinth: ['#fdba74', '#c2410c'], rest: '⛺',
      bg: 'radial-gradient(circle at 82% 15%,#fde68a 0 4.5%,rgba(253,230,138,.35) 5.5%,transparent 17%),linear-gradient(180deg,#1b0b33 0%,#3b1470 52%,#7c2d12 100%)', deco: 'radial-gradient(circle at 10% 16%,rgba(255,255,255,.65) 0 .25%,transparent .4%),radial-gradient(circle at 40% 8%,rgba(255,255,255,.6) 0 .25%,transparent .4%)' }
  };
  /* the colour of the ground under the picture, so a long class continues the scene smoothly */
  var GROUND = { meadow: '#58b84a', alice: '#cfe9e2', chuseok: '#8a6a43', halloween: '#4b2a85' };
  /* first matching rule wins; the teacher can always override with the scene picker */
  var RULES = [
    { theme: 'halloween', from: '2026-10-26', to: '2026-11-01' },
    { theme: 'chuseok', grade: 3, from: '2026-09-21', to: '2026-10-25' },
    { theme: 'alice', grade: 4, from: '2026-10-01', to: '2026-10-26' }
  ];
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function gradeOf(cls) { var t = String((cls && (cls.grade || '')) + ' ' + (cls && cls.name || '')); return /4/.test(t) ? 4 : (/3/.test(t) ? 3 : 0); }
  function auto(cls, date) {
    var k = dayKey(date), g = gradeOf(cls), i, r;
    for (i = 0; i < RULES.length; i++) { r = RULES[i]; if ((!r.grade || r.grade === g) && k >= r.from && k <= r.to) return r.theme; }
    return 'meadow';
  }
  function prefKey() { return 'eaa_board_scene'; }
  function getPref() { try { return localStorage.getItem(prefKey()) || 'auto'; } catch (e) { return 'auto'; } }
  function setPref(v) { try { localStorage.setItem(prefKey(), v); } catch (e) { /* ignore */ } }
  function viewMode() { try { return localStorage.getItem('eaa_board_view') || 'scene'; } catch (e) { return 'scene'; } }
  function setViewMode(v) { try { localStorage.setItem('eaa_board_view', v); } catch (e) { /* ignore */ } }
  function resolve(cls) { var p = getPref(); return THEMES[p] ? p : auto(cls); }

  function css() {
    var out = '', k, t, a = 'assets/scenes/';
    out += '.cb.scene-on{background-size:cover!important;background-position:center center!important}';
    for (k in THEMES) {
      t = THEMES[k];
      out += 'html .cb.scene-on.scene-' + k + ',.cb.scene-' + k + '{--sign:' + t.sign + ';--ink:' + t.ink + ';--p1:' + t.plinth[0] + ';--p2:' + t.plinth[1] + ';background:url(' + a + 'bg_' + k + '.webp) center center/cover no-repeat!important;background-color:' + GROUND[k] + '!important}';
      out += '.cb.scene-' + k + ' .cb-st.off .cb-pw::after{content:"' + t.rest + '";background-image:url(' + a + 'rest_' + k + '.webp)}';
      out += 'body[data-cb-scene="' + k + '"] .cb-win>div,body[data-cb-scene="' + k + '"] .cb-grp>div{background:' + t.bg + ';border-color:rgba(255,255,255,.45)}';
    }
    out += 'html .cb.scene-on .cb-goal{flex-wrap:wrap;background:rgba(15,23,42,.58)!important;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.16)}html .cb.scene-on .cb-goal .bar{min-width:140px;flex:1 1 200px}';
    out += '.cb .cb-st .cb-pt{z-index:5}.cb .cb-st .cb-att,.cb .cb-st .cb-mn{z-index:5}';
    out += 'html .cb.scene-on .cb-hd,html .cb.scene-on .cb-today{background:rgba(15,23,42,.58);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:8px 14px;margin-top:6px}html .cb.scene-on .cb-hd h1,html .cb.scene-on .cb-hd small,html .cb.scene-on .cb-today .lab{color:#fff!important;text-shadow:0 2px 6px rgba(0,0,0,.6)}';
    out += '.cb-mg.scene{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px 12px;align-items:end}' +
      'html.class-mode .cb-mg.scene .cb-st,html .cb-mg.scene .cb-st,.cb-mg.scene .cb-st{background:transparent!important;border:0!important;backdrop-filter:none!important;box-shadow:none!important;padding:4px 4px 6px!important}' +
      'html.class-mode .cb-mg.scene .cb-st:hover,.cb-mg.scene .cb-st:hover{background:transparent!important;transform:translateY(-4px)}' +
      '.cb-pw{position:relative;width:100%;aspect-ratio:1}.cb-ped{display:none!important}' +
      '.cb-mg.scene .cb-pw img.cb-mon{position:relative;width:100%;height:100%;z-index:1;aspect-ratio:1;filter:drop-shadow(0 10px 12px rgba(0,0,0,.45))}' +
      '.cb-mg.scene .cb-st b.n{position:relative;z-index:2;margin:-6px auto 0;width:92%;background:rgba(15,23,42,.78)!important;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.22);color:#fff!important;border-radius:99px;padding:3px 10px;font-size:.96rem;box-shadow:0 4px 10px rgba(0,0,0,.35);text-shadow:0 1px 2px rgba(0,0,0,.5)}' +
      '.cb-mg.scene .cb-st .cb-add{margin-top:6px;gap:5px}' +
      'html.class-mode .cb-mg.scene .cb-add button,.cb-mg.scene .cb-add button{background:rgba(15,23,42,.75)!important;color:#f8fafc!important;border:1px solid rgba(255,255,255,.2)!important;border-bottom:4px solid rgba(0,0,0,.45)!important;border-radius:99px!important;padding:4px 8px!important;min-height:32px!important;font:700 .86rem Fredoka,sans-serif!important}' +
      'html.class-mode .cb-mg.scene .cb-add button:nth-child(3),.cb-mg.scene .cb-add button:nth-child(3){background:rgba(245,158,11,.9)!important;color:#1c1100!important;border-color:rgba(253,230,138,.5)!important;border-bottom-color:#92400e!important}' +
      'html.class-mode .cb-mg.scene .cb-add button:hover,.cb-mg.scene .cb-add button:hover{background:#10b981!important;color:#fff!important;border-bottom-color:#047857!important}' +
      '.cb-mg.scene .cb-st .cb-pt{top:4px;right:8px;font-size:.84rem;padding:2px 9px;box-shadow:0 3px 8px rgba(0,0,0,.35)}' +
      '.cb-mg.scene .cb-st:not(.off) .cb-att,.cb-mg.scene .cb-st .cb-mn{opacity:0;pointer-events:none;transition:opacity .15s ease}' +
      '.cb-mg.scene .cb-st:hover .cb-att,.cb-mg.scene .cb-st:hover .cb-mn,.cb-mg.scene .cb-st:focus-within .cb-att,.cb-mg.scene .cb-st:focus-within .cb-mn{opacity:1;pointer-events:auto}' +
      '@media(hover:none),(max-width:768px){.cb-mg.scene .cb-st:not(.off) .cb-att,.cb-mg.scene .cb-st .cb-mn{opacity:.92;pointer-events:auto}}' +
      '@media(max-width:640px){.cb-mg.scene{padding:12px 8px 18px;min-height:0;border-radius:18px;gap:8px}.cb-mg.scene .cb-st{padding:8px 6px}.cb-mg.scene .cb-st .cb-av{width:92px;height:92px}.cb-mg.scene .cb-st .cb-av::after{width:82px;height:20px}.cb-mg.scene .cb-st .cb-nm,.cb-mg.scene .cb-st .cb-sb{padding:1px 7px;font-size:.76rem}}' +
      '.cb-mg.scene .cb-st.off{opacity:1;filter:none}.cb-mg.scene .cb-st.off .cb-pw img.cb-mon{filter:grayscale(.85) brightness(.75);transform:scale(.72);transform-origin:50% 90%;opacity:.8}' +
      '.cb-mg.scene .cb-st.off .cb-pw::after{position:absolute;right:-2%;bottom:6%;width:46%;aspect-ratio:1;font-size:2.4rem;display:grid;place-items:center;background-size:contain;background-repeat:no-repeat;z-index:2}' +
      '.cb-mg.scene .cb-st.off .cb-pw::before{content:"💤";position:absolute;left:10%;top:6%;font-size:1.6rem;z-index:3;animation:cbPulse 1.6s infinite}' +
      '.cb-mg.scene .cb-st.off .cb-add{visibility:hidden}' +
      '.cb-sw{display:inline-flex;gap:6px;margin-left:auto;margin-right:10px;align-items:center;flex-wrap:wrap;position:relative}.cb-hd .cb-sw+.cb-tm{margin-left:0}.cb-sw button,.cb-sw select{border:0;border-bottom:4px solid rgba(0,0,0,.28);background:rgba(255,255,255,.14);color:#fff;font:500 .95rem Fredoka,sans-serif;padding:8px 14px;border-radius:14px;cursor:pointer}' +
      '.cb-sw button.on{background:#fbbf24;color:#4a2300;border-bottom-color:#b45309}.cb-sw select{appearance:auto;color:#111;background:#fde68a;padding:8px 10px}' +
      '@media(max-width:640px){.cb-mg.scene{grid-template-columns:repeat(auto-fill,minmax(130px,1fr))}}';
    return out;
  }
  root.BoardScenes = { THEMES: THEMES, RULES: RULES, auto: auto, resolve: resolve, getPref: getPref, setPref: setPref, viewMode: viewMode, setViewMode: setViewMode, css: css };
})(window);
