/* Monster outfits, redrawn 10 Nov 2026 to match the 3D shop pictures (colour, collar, buttons, belts, emblems).
   The monster body is small under the face, so each outfit is a short "torso band": top = clothTop, bottom = botY.
   monster-renderer.js calls MonsterOutfits.draw(id, {c, top, bot, w}) and clips the result to the round body. */
(function (root) {
  'use strict';
  function r(n) { return Math.round(n * 10) / 10; }

  /* shared pieces ------------------------------------------------------- */
  function base(id, k, top, bot, c, w, light, dark, line) {
    /* the outfit wraps up the sides of the body to the shoulders (clear of the eyes and cheeks), like a real jacket */
    var sh = top - 13;
    var neck = 'M ' + r(c - w) + ' ' + r(sh) + ' L ' + r(c - 35) + ' ' + r(sh) + ' Q ' + r(c - 31) + ' ' + r(top - 1) + ' ' + r(c - 15) + ' ' + r(top) +
      ' Q ' + c + ' ' + r(top + 6) + ' ' + r(c + 15) + ' ' + r(top) + ' Q ' + r(c + 31) + ' ' + r(top - 1) + ' ' + r(c + 35) + ' ' + r(sh) + ' L ' + r(c + w) + ' ' + r(sh);
    var body = neck + ' L ' + r(c + w) + ' ' + r(bot + 4) + ' L ' + r(c - w) + ' ' + r(bot + 4) + ' Z';
    return {
      defs: '<linearGradient id="mo-' + id + '-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + light + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient>' +
        '<linearGradient id="mo-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".28" stop-color="#000" stop-opacity="0"/>' +
        '<stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>',
      body: '<path d="' + body + '" fill="url(#mo-' + id + '-v)" stroke="' + line + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="' + body + '" fill="url(#mo-shade)"/>',
      rim: '<path d="' + neck + '" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.3" transform="translate(0 1.4)"/>',
      neck: neck
    };
  }
  function wrap(b, inner) { return '<defs>' + b.defs + '</defs><g filter="url(#mf-shadow)">' + b.body + inner + b.rim + '</g>'; }
  function dot(x, y, rad, fill, stroke) { return '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + rad + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width=".8"' : '') + '/>'; }
  function star(x, y, s, fill) {
    var p = []; for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? s * .45 : s; p.push(r(x + Math.cos(a) * rr) + ',' + r(y + Math.sin(a) * rr)); }
    return '<polygon points="' + p.join(' ') + '" fill="' + fill + '"/>';
  }
  function band(c, w, y, h, fill, stroke) { return '<rect x="' + r(c - w) + '" y="' + r(y) + '" width="' + r(w * 2) + '" height="' + r(h) + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="1"' : '') + '/>'; }
  function lapels(c, top, H, fill, stroke) {
    return '<path d="M ' + r(c - 13) + ' ' + r(top) + ' L ' + r(c - 3) + ' ' + r(top + H * .72) + ' L ' + r(c - 15) + ' ' + r(top + H * .32) + ' Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>' +
      '<path d="M ' + r(c + 13) + ' ' + r(top) + ' L ' + r(c + 3) + ' ' + r(top + H * .72) + ' L ' + r(c + 15) + ' ' + r(top + H * .32) + ' Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>';
  }
  function fluff(c, top, color, n) {   /* a soft fur or fleece collar along the neckline */
    var o = ''; for (var i = 0; i < n; i++) { var t = i / (n - 1), x = c - 22 + 44 * t, y = top + 1 + 5 * Math.sin(Math.PI * t); o += dot(x, y, 3.4, color); }
    return o;
  }

  /* the outfits --------------------------------------------------------- */
  var O = {
    'clothing-hoodie': function (c, top, bot, w, H) {
      var b = base('hoodie', 0, top, bot, c, w, '#93c5fd', '#2563eb', '#1e40af');
      return wrap(b,
        '<path d="M ' + r(c - 20) + ' ' + r(top - 1) + ' Q ' + c + ' ' + r(top + 11) + ' ' + r(c + 20) + ' ' + r(top - 1) + ' Q ' + c + ' ' + r(top + 5) + ' ' + r(c - 20) + ' ' + r(top - 1) + ' Z" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1"/>' +
        '<path d="M ' + r(c - 5) + ' ' + r(top + 6) + ' l -1 ' + r(H * .42) + ' M ' + r(c + 5) + ' ' + r(top + 6) + ' l 1 ' + r(H * .42) + '" stroke="#f8fafc" stroke-width="1.6" stroke-linecap="round"/>' +
        dot(c - 6, top + 6 + H * .44, 1.6, '#f8fafc') + dot(c + 6, top + 6 + H * .44, 1.6, '#f8fafc') +
        '<path d="M ' + r(c - 16) + ' ' + r(top + H * .62) + ' L ' + r(c + 16) + ' ' + r(top + H * .62) + ' L ' + r(c + 20) + ' ' + r(bot + 2) + ' L ' + r(c - 20) + ' ' + r(bot + 2) + ' Z" fill="#3b82f6" stroke="#1e40af" stroke-width="1.2"/>');
    },
    'clothing-winter': function (c, top, bot, w, H) {
      var b = base('winter', 0, top, bot, c, w, '#e0f2fe', '#7dd3fc', '#0284c7'), q = '';
      [.42, .8].forEach(function (f) { q += '<path d="M ' + r(c - w) + ' ' + r(top + H * f) + ' Q ' + c + ' ' + r(top + H * f + 4) + ' ' + r(c + w) + ' ' + r(top + H * f) + '" fill="none" stroke="#38bdf8" stroke-width="1.4"/>'; });
      return wrap(b, q + '<line x1="' + c + '" y1="' + r(top + 5) + '" x2="' + c + '" y2="' + r(bot + 3) + '" stroke="#0369a1" stroke-width="1.6"/>' +
        '<rect x="' + r(c - 9) + '" y="' + r(top + H * .45) + '" width="6" height="2.6" rx="1.3" fill="#a16207"/><rect x="' + r(c + 3) + '" y="' + r(top + H * .45) + '" width="6" height="2.6" rx="1.3" fill="#a16207"/>' +
        fluff(c, top, '#ffffff', 9));
    },
    'clothing-travel-coat': function (c, top, bot, w, H) {
      var b = base('coat', 0, top, bot, c, w, '#65a30d', '#3f6212', '#1a2e05');
      return wrap(b, lapels(c, top, H, '#4d7c0f', '#1a2e05') +
        band(c, w, top + H * .6, H * .2, '#78350f', '#451a03') +
        '<rect x="' + r(c - 4) + '" y="' + r(top + H * .58) + '" width="8" height="' + r(H * .24) + '" rx="1" fill="none" stroke="#facc15" stroke-width="1.6"/>' +
        dot(c - 9, top + H * .45, 1.5, '#d4a017') + dot(c + 9, top + H * .45, 1.5, '#d4a017') + dot(c - 9, top + H * .92, 1.5, '#d4a017') + dot(c + 9, top + H * .92, 1.5, '#d4a017'));
    },
    'clothing-school-jacket': function (c, top, bot, w, H) {
      var b = base('varsity', 0, top, bot, c, w, '#3b82f6', '#1e3a8a', '#172554');
      return wrap(b,
        '<path d="' + b.neck + '" fill="none" stroke="#f8fafc" stroke-width="4.5" transform="translate(0 1.5)"/><path d="' + b.neck + '" fill="none" stroke="#1e3a8a" stroke-width="1" transform="translate(0 1.5)"/>' +
        dot(c, top + H * .38, 1.7, '#f8fafc') + dot(c, top + H * .62, 1.7, '#f8fafc') + dot(c, top + H * .86, 1.7, '#f8fafc') +
        dot(c - 16, top + H * .42, 3.4, '#facc15', '#a16207') + star(c - 16, top + H * .42, 2.2, '#1e3a8a') +
        band(c, w, bot - 2, 2.2, '#f8fafc') + band(c, w, bot - 2 + 2.6, 1.2, '#dc2626'));
    },
    'clothing-dragon-armor': function (c, top, bot, w, H) {
      var b = base('dragon', 0, top, bot, c, w, '#4ade80', '#15803d', '#14532d'), sc = '', row = 0;
      for (var y = top + 4; y < bot + 2; y += 4.2, row++) for (var x = c - w + (row % 2 ? 3 : 0); x < c + w; x += 6)
        sc += '<path d="M ' + r(x - 3) + ' ' + r(y) + ' Q ' + r(x) + ' ' + r(y + 4) + ' ' + r(x + 3) + ' ' + r(y) + '" fill="none" stroke="#14532d" stroke-opacity=".7" stroke-width=".9"/>';
      return wrap(b, sc +
        '<path d="' + b.neck + '" fill="none" stroke="#facc15" stroke-width="2.4" transform="translate(0 1)"/>' +
        '<path d="M ' + r(c - 34) + ' ' + r(top - 11) + ' q -8 -6 -12 2 q 6 0 12 5 Z" fill="#facc15" stroke="#a16207" stroke-width=".8"/>' +
        '<path d="M ' + r(c + 34) + ' ' + r(top - 11) + ' q 8 -6 12 2 q -6 0 -12 5 Z" fill="#facc15" stroke="#a16207" stroke-width=".8"/>' +
        band(c, w, bot - 1, 2.4, '#facc15'));
    },
    'clothing-knight-armor': function (c, top, bot, w, H) {
      var b = base('knight', 0, top, bot, c, w, '#f8fafc', '#94a3b8', '#475569');
      return wrap(b,
        '<path d="M ' + r(c - 18) + ' ' + r(top + H * .4) + ' Q ' + c + ' ' + r(top + H * .55) + ' ' + r(c + 18) + ' ' + r(top + H * .4) + '" fill="none" stroke="#64748b" stroke-width="1.2"/>' +
        '<path d="M ' + r(c - 18) + ' ' + r(top + H * .75) + ' Q ' + c + ' ' + r(top + H * .9) + ' ' + r(c + 18) + ' ' + r(top + H * .75) + '" fill="none" stroke="#64748b" stroke-width="1.2"/>' +
        '<ellipse cx="' + r(c - w + 8) + '" cy="' + r(top - 8) + '" rx="9" ry="6" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.2"/>' +
        '<ellipse cx="' + r(c + w - 8) + '" cy="' + r(top - 8) + '" rx="9" ry="6" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.2"/>' +
        '<polygon points="' + c + ',' + r(top + H * .3) + ' ' + r(c + 5) + ',' + r(top + H * .55) + ' ' + c + ',' + r(top + H * .8) + ' ' + r(c - 5) + ',' + r(top + H * .55) + '" fill="#3b82f6" stroke="#facc15" stroke-width="1.4"/>' +
        dot(c - 1.5, top + H * .45, 1, '#e0f2fe'));
    },
    'clothing-magic-robe': function (c, top, bot, w, H) {
      var b = base('magic', 0, top, bot, c, w, '#c4b5fd', '#67e8f9', '#6d28d9');
      b.defs = b.defs.replace('x1="0" y1="0" x2="0" y2="1"', 'x1="0" y1="0" x2="1" y2="1"');
      return wrap(b,
        '<path d="' + b.neck + '" fill="none" stroke="#facc15" stroke-width="2" transform="translate(0 1)"/>' +
        '<line x1="' + c + '" y1="' + r(top + 6) + '" x2="' + c + '" y2="' + r(bot + 3) + '" stroke="#facc15" stroke-width="2.4"/>' +
        star(c - 18, top + H * .5, 2.6, '#fff') + star(c + 20, top + H * .35, 2.2, '#fff') + star(c + 12, top + H * .85, 1.8, '#fef9c3') + star(c - 28, top + H * .9, 1.6, '#fef9c3') +
        dot(c - 8, top + H * .78, .9, '#fff') + dot(c + 26, top + H * .7, .9, '#fff'));
    },
    'clothing-scholar': function (c, top, bot, w, H) {
      var b = base('blazer', 0, top, bot, c, w, '#1e40af', '#172554', '#0b1437');
      return wrap(b,
        '<path d="M ' + r(c - 12) + ' ' + r(top + 1) + ' L ' + c + ' ' + r(top + H * .9) + ' L ' + r(c + 12) + ' ' + r(top + 1) + ' Q ' + c + ' ' + r(top + 6) + ' ' + r(c - 12) + ' ' + r(top + 1) + ' Z" fill="#f8fafc"/>' +
        '<path d="M ' + r(c - 2.6) + ' ' + r(top + 5) + ' L ' + r(c + 2.6) + ' ' + r(top + 5) + ' L ' + r(c + 3.4) + ' ' + r(top + H * .8) + ' L ' + c + ' ' + r(top + H * .95) + ' L ' + r(c - 3.4) + ' ' + r(top + H * .8) + ' Z" fill="#dc2626"/>' +
        '<path d="M ' + r(c - 3) + ' ' + r(top + H * .4) + ' l 6 -2.4 M ' + r(c - 3) + ' ' + r(top + H * .62) + ' l 6 -2.4" stroke="#fef2f2" stroke-width="1"/>' +
        lapels(c, top, H, '#1e3a8a', '#0b1437') + dot(c - 14, top + H * .85, 1.4, '#d4a017') + dot(c + 14, top + H * .85, 1.4, '#d4a017'));
    },
    'clothing-royal': function (c, top, bot, w, H) {
      var b = base('royal', 0, top, bot, c, w, '#2563eb', '#1e3a8a', '#172554');
      return wrap(b,
        '<path d="M ' + r(c - 30) + ' ' + r(top) + ' L ' + r(c + 30) + ' ' + r(bot + 2) + '" stroke="#facc15" stroke-width="8"/><path d="M ' + r(c - 30) + ' ' + r(top) + ' L ' + r(c + 30) + ' ' + r(bot + 2) + '" stroke="#dc2626" stroke-width="5.6"/>' +
        dot(c, top + H * .35, 1.6, '#facc15') + dot(c, top + H * .6, 1.6, '#facc15') + dot(c, top + H * .85, 1.6, '#facc15') +
        '<ellipse cx="' + r(c - w + 9) + '" cy="' + r(top - 10) + '" rx="9" ry="4.4" fill="#facc15" stroke="#a16207" stroke-width="1"/>' +
        '<ellipse cx="' + r(c + w - 9) + '" cy="' + r(top - 10) + '" rx="9" ry="4.4" fill="#facc15" stroke="#a16207" stroke-width="1"/>' +
        '<path d="' + b.neck + '" fill="none" stroke="#facc15" stroke-width="1.6" transform="translate(0 1)"/>');
    },
    'clothing-royal-robe': function (c, top, bot, w, H) {
      var b = base('ermine', 0, top, bot, c, w, '#ef4444', '#7f1d1d', '#450a0a'), sp = '';
      [[-16, .3], [-8, .5], [8, .5], [16, .3], [-24, .2], [24, .2]].forEach(function (p) { sp += '<path d="M ' + r(c + p[0]) + ' ' + r(top + 3 + p[1] * 6) + ' l 0 2.6" stroke="#111827" stroke-width="1.3" stroke-linecap="round"/>'; });
      return wrap(b,
        '<path d="' + b.neck + '" fill="none" stroke="#f8fafc" stroke-width="7" transform="translate(0 2)"/>' + sp +
        '<rect x="' + r(c - 3) + '" y="' + r(top + 6) + '" width="6" height="' + r(bot - top) + '" fill="#f8fafc"/>' +
        dot(c - 1, top + H * .55, .9, '#111827') + dot(c + 1.2, top + H * .82, .9, '#111827') +
        dot(c, top + 6, 3, '#facc15', '#a16207') +
        band(c, w, bot - 3, 5, '#f8fafc') + dot(c - 18, bot - .5, .9, '#111827') + dot(c - 6, bot - .5, .9, '#111827') + dot(c + 8, bot - .5, .9, '#111827') + dot(c + 20, bot - .5, .9, '#111827'));
    },
    'clothing-robe': function (c, top, bot, w, H) {
      var b = base('robe', 0, top, bot, c, w, '#334155', '#0f172a', '#020617');
      return wrap(b,
        '<path d="M ' + r(c - 14) + ' ' + r(top) + ' L ' + r(c + 8) + ' ' + r(top + H * .62) + '" stroke="#64748b" stroke-width="2.4"/>' +
        '<path d="M ' + r(c + 14) + ' ' + r(top) + ' L ' + r(c - 2) + ' ' + r(top + H * .45) + '" stroke="#64748b" stroke-width="2.4"/>' +
        band(c, w, top + H * .62, H * .16, '#1e293b', '#020617') +
        '<rect x="' + r(c + 4) + '" y="' + r(top + H * .6) + '" width="5" height="' + r(H * .2) + '" rx="1" fill="#a16207"/>');
    },
    'clothing-hero': function (c, top, bot, w, H) {
      var b = base('hero', 0, top, bot, c, w, '#ef4444', '#b91c1c', '#7f1d1d');
      return wrap(b,
        '<path d="' + b.neck + '" fill="none" stroke="#facc15" stroke-width="2.6" transform="translate(0 1)"/>' +
        '<polygon points="' + r(c + 2) + ',' + r(top + 4) + ' ' + r(c - 5) + ',' + r(top + H * .55) + ' ' + r(c) + ',' + r(top + H * .55) + ' ' + r(c - 3) + ',' + r(top + H * .95) + ' ' + r(c + 6) + ',' + r(top + H * .4) + ' ' + r(c + 1) + ',' + r(top + H * .4) + '" fill="#facc15" stroke="#a16207" stroke-width=".8"/>' +
        band(c, w, bot - 1.5, 3, '#facc15', '#a16207'));
    },
    'clothing-space': function (c, top, bot, w, H) {
      var b = base('space', 0, top, bot, c, w, '#ffffff', '#cbd5e1', '#64748b');
      return wrap(b,
        '<path d="M ' + r(c - 26) + ' ' + r(top + 2) + ' L ' + r(c - 22) + ' ' + r(bot + 2) + ' M ' + r(c + 26) + ' ' + r(top + 2) + ' L ' + r(c + 22) + ' ' + r(bot + 2) + '" stroke="#94a3b8" stroke-width="1.2"/>' +
        '<circle cx="' + c + '" cy="' + r(top + H * .52) + '" r="' + r(Math.min(7, H * .32)) + '" fill="#0f172a" stroke="#94a3b8" stroke-width="1.2"/>' +
        '<circle cx="' + c + '" cy="' + r(top + H * .52) + '" r="' + r(Math.min(4.6, H * .2)) + '" fill="#22d3ee"/><circle cx="' + r(c - 1.2) + '" cy="' + r(top + H * .52 - 1.2) + '" r="1.3" fill="#ecfeff"/>' +
        '<path d="' + b.neck + '" fill="none" stroke="#94a3b8" stroke-width="2.4" transform="translate(0 1.2)"/>' +
        dot(c - 14, top + H * .75, 1.3, '#ef4444') + dot(c + 14, top + H * .75, 1.3, '#22c55e'));
    },
    'clothing-vest': function (c, top, bot, w, H) {
      var b = base('vest', 0, top, bot, c, w, '#b45309', '#78350f', '#451a03');
      return '<defs>' + b.defs + '</defs><g filter="url(#mf-shadow)">' +
        '<path d="M ' + r(c - w) + ' ' + r(top - 13) + ' L ' + r(c - 35) + ' ' + r(top - 13) + ' Q ' + r(c - 31) + ' ' + r(top - 1) + ' ' + r(c - 12) + ' ' + r(top) + ' L ' + r(c - 6) + ' ' + r(bot + 4) + ' L ' + r(c - w) + ' ' + r(bot + 4) + ' Z" fill="url(#mo-vest-v)" stroke="#451a03" stroke-width="1.4"/>' +
        '<path d="M ' + r(c + w) + ' ' + r(top - 13) + ' L ' + r(c + 35) + ' ' + r(top - 13) + ' Q ' + r(c + 31) + ' ' + r(top - 1) + ' ' + r(c + 12) + ' ' + r(top) + ' L ' + r(c + 6) + ' ' + r(bot + 4) + ' L ' + r(c + w) + ' ' + r(bot + 4) + ' Z" fill="url(#mo-vest-v)" stroke="#451a03" stroke-width="1.4"/>' +
        '<rect x="' + r(c - 22) + '" y="' + r(top + H * .55) + '" width="11" height="' + r(H * .32) + '" rx="1.4" fill="#92400e" stroke="#451a03" stroke-width="1"/>' +
        '<rect x="' + r(c + 11) + '" y="' + r(top + H * .55) + '" width="11" height="' + r(H * .32) + '" rx="1.4" fill="#92400e" stroke="#451a03" stroke-width="1"/>' +
        dot(c - 8, top + H * .4, 1.4, '#fbbf24') + dot(c - 7.6, top + H * .75, 1.4, '#fbbf24') + '</g>';
    },
    'clothing-adv-jacket': function (c, top, bot, w, H) {
      var b = base('bomber', 0, top, bot, c, w, '#c2410c', '#7c2d12', '#431407');
      b.defs = b.defs.replace('#c2410c', '#b45309');
      return wrap(b,
        '<line x1="' + c + '" y1="' + r(top + 5) + '" x2="' + c + '" y2="' + r(bot + 3) + '" stroke="#e7e5e4" stroke-width="1.4" stroke-dasharray="1.6 1.2"/>' +
        '<rect x="' + r(c - 22) + '" y="' + r(top + H * .55) + '" width="12" height="' + r(H * .3) + '" rx="1.4" fill="#9a3412" stroke="#431407" stroke-width="1"/>' +
        '<rect x="' + r(c + 10) + '" y="' + r(top + H * .55) + '" width="12" height="' + r(H * .3) + '" rx="1.4" fill="#9a3412" stroke="#431407" stroke-width="1"/>' +
        fluff(c, top, '#fef3c7', 9));
    },
    'cs-trench': function (c, top, bot, w, H) {
      var b = base('trench', 0, top, bot, c, w, '#e2b874', '#a16207', '#713f12');
      return wrap(b, lapels(c, top, H, '#ca8a04', '#713f12') +
        band(c, w, top + H * .62, H * .18, '#a16207', '#713f12') +
        '<rect x="' + r(c - 4) + '" y="' + r(top + H * .6) + '" width="8" height="' + r(H * .22) + '" rx="1" fill="none" stroke="#422006" stroke-width="1.4"/>' +
        dot(c - 7, top + H * .42, 1.4, '#422006') + dot(c + 7, top + H * .42, 1.4, '#422006') + dot(c - 7, top + H * .92, 1.4, '#422006') + dot(c + 7, top + H * .92, 1.4, '#422006'));
    },
    'cs-knight-armor': function (c, top, bot, w, H) {
      var b = base('csknight', 0, top, bot, c, w, '#f8fafc', '#a8b3c4', '#475569');
      return wrap(b,
        '<path d="M ' + r(c - 18) + ' ' + r(top + H * .82) + ' Q ' + c + ' ' + r(top + H * .98) + ' ' + r(c + 18) + ' ' + r(top + H * .82) + '" fill="none" stroke="#64748b" stroke-width="1.2"/>' +
        '<ellipse cx="' + r(c - w + 8) + '" cy="' + r(top - 8) + '" rx="9" ry="6" fill="#cbd5e1" stroke="#475569" stroke-width="1.2"/>' +
        '<ellipse cx="' + r(c + w - 8) + '" cy="' + r(top - 8) + '" rx="9" ry="6" fill="#cbd5e1" stroke="#475569" stroke-width="1.2"/>' +
        '<rect x="' + r(c - 1.8) + '" y="' + r(top + H * .22) + '" width="3.6" height="' + r(H * .62) + '" rx="1" fill="#facc15" stroke="#a16207" stroke-width=".7"/>' +
        '<rect x="' + r(c - 7) + '" y="' + r(top + H * .38) + '" width="14" height="3.4" rx="1" fill="#facc15" stroke="#a16207" stroke-width=".7"/>');
    }
  };

  /* sleeve colours: [arm, outline, cuff, thin line on the cuff]. Vests, robes without sleeves and armour plates keep the bare arm. */
  var SLEEVES = {
    'clothing-hoodie': ['#60a5fa', '#1e40af', '#93c5fd'], 'clothing-winter': ['#bae6fd', '#0284c7', '#ffffff'],
    'clothing-travel-coat': ['#4d7c0f', '#1a2e05', '#365314'], 'clothing-school-jacket': ['#f8fafc', '#475569', '#1e3a8a', '#f8fafc'],
    'clothing-dragon-armor': ['#22c55e', '#14532d', '#facc15'], 'clothing-knight-armor': ['#cbd5e1', '#475569', '#2563eb'],
    'clothing-magic-robe': ['#a78bfa', '#6d28d9', '#facc15'], 'clothing-scholar': ['#1e3a8a', '#0b1437', '#f8fafc'],
    'clothing-royal': ['#2563eb', '#172554', '#facc15'], 'clothing-royal-robe': ['#b91c1c', '#450a0a', '#f8fafc'],
    'clothing-robe': ['#1e293b', '#020617', '#475569'], 'clothing-hero': ['#dc2626', '#7f1d1d', '#facc15'],
    'clothing-space': ['#f1f5f9', '#64748b', '#22d3ee'], 'clothing-adv-jacket': ['#9a3412', '#431407', '#fef3c7'],
    'cs-trench': ['#c8963f', '#713f12', '#a16207'], 'cs-knight-armor': ['#cbd5e1', '#475569', '#facc15']
  };
  root.MonsterOutfits = {
    ids: Object.keys(O),
    sleeve: function (id) { var v = SLEEVES[String(id || '').toLowerCase()]; return v ? { fill: v[0], line: v[1], cuff: v[2], cuffLine: v[3] || '' } : null; },
    has: function (id) { return !!O[String(id || '').toLowerCase()]; },
    draw: function (id, g) {
      var f = O[String(id || '').toLowerCase()]; if (!f) return '';
      var H = Math.max(14, g.bot - g.top);
      try { return f(g.c, g.top, g.bot, g.w, H); } catch (e) { return ''; }
    }
  };
})(typeof window !== 'undefined' ? window : this);
