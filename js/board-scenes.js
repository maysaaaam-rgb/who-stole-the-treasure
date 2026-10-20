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
    out += '.cb.scene-on{background-size:cover!important}';
    for (k in THEMES) {
      t = THEMES[k];
      out += 'html .cb.scene-on.scene-' + k + ',.cb.scene-' + k + '{--sign:' + t.sign + ';--ink:' + t.ink + ';--p1:' + t.plinth[0] + ';--p2:' + t.plinth[1] + ';background:url(' + a + 'bg_' + k + '.webp) center top/100% auto no-repeat!important;background-color:' + GROUND[k] + '!important}';
      out += '.cb.scene-' + k + ' .cb-ped{background-image:url(' + a + 'ped_' + k + '.webp),radial-gradient(ellipse at 50% 35%,var(--p1),var(--p2))}';
      out += '.cb.scene-' + k + ' .cb-st.off .cb-pw::after{content:"' + t.rest + '";background-image:url(' + a + 'rest_' + k + '.webp)}';
      out += 'body[data-cb-scene="' + k + '"] .cb-win>div,body[data-cb-scene="' + k + '"] .cb-grp>div{background:' + t.bg + ';border-color:rgba(255,255,255,.45)}';
    }
    out += 'html .cb.scene-on .cb-hd,html .cb.scene-on .cb-today{background:rgba(15,23,42,.55);backdrop-filter:blur(6px);border-radius:18px;padding:8px 14px;margin-top:6px}html .cb.scene-on .cb-hd h1,html .cb.scene-on .cb-hd small,html .cb.scene-on .cb-today .lab{color:#fff!important;text-shadow:0 2px 6px rgba(0,0,0,.6)}';
    out += '.cb-mg.scene{grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:6px 8px;align-items:end}' +
      '.cb-mg.scene .cb-st{background:transparent;border:0;backdrop-filter:none;box-shadow:none;padding:4px 4px 8px}' +
      '.cb-mg.scene .cb-st:hover{background:transparent;transform:translateY(-3px)}' +
      '.cb-mg.scene .cb-st:nth-child(even){transform:translateY(12px)}.cb-mg.scene .cb-st:nth-child(even):hover{transform:translateY(8px)}' +
      '.cb-pw{position:relative;width:100%;aspect-ratio:1}.cb-ped{position:absolute;left:6%;right:6%;bottom:3%;height:30%;border-radius:50%/46%;background-size:100% 100%,auto;background-repeat:no-repeat;box-shadow:0 8px 14px rgba(0,0,0,.35),inset 0 -6px 10px rgba(0,0,0,.25)}' +
      '.cb-mg.scene .cb-pw img.cb-mon{position:absolute;left:0;top:-4%;width:100%;height:100%;z-index:1;aspect-ratio:auto}' +
      '.cb-mg.scene .cb-st b.n{position:relative;z-index:2;margin:-2px auto 0;width:92%;background:var(--sign);color:var(--ink);border-radius:12px;padding:3px 8px;box-shadow:0 3px 0 rgba(0,0,0,.35);text-shadow:0 1px 0 rgba(0,0,0,.35)}' +
      '.cb-mg.scene .cb-st .cb-add{margin-top:6px}.cb-mg.scene .cb-add button{background:rgba(15,23,42,.72);border-bottom-color:rgba(0,0,0,.4)}.cb-mg.scene .cb-add button:hover{background:#16a34a}' +
      '.cb-mg.scene .cb-st .cb-pt{top:2px;right:6px}' +
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
