/* Smart Board: turns a rough pen stroke into a perfect shape (no AI, instant, works offline).
   Circle, oval, straight line, arrow, square, rectangle, triangle, diamond, star and other straight-sided shapes. */
(function (root) {
  'use strict';
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const pathLen = (p) => { let L = 0; for (let i = 1; i < p.length; i++) L += dist(p[i - 1], p[i]); return L; };

  function resample(p, n) {
    const I = pathLen(p) / (n - 1);
    if (!I) return p.slice();
    const out = [p[0].slice()], pts = p.map((q) => q.slice());
    let D = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = dist(pts[i - 1], pts[i]);
      if (D + d >= I && d > 0) {
        const t = (I - D) / d;
        const q = [pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1])];
        out.push(q); pts.splice(i, 0, q); D = 0;
      } else D += d;
    }
    while (out.length < n) out.push(p[p.length - 1].slice());
    return out.slice(0, n);
  }
  function segDist(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    if (!l2) return dist(p, a);
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  }
  function rdp(p, eps) {
    if (p.length < 3) return p.slice();
    let idx = 0, dmax = 0;
    for (let i = 1; i < p.length - 1; i++) { const d = segDist(p[i], p[0], p[p.length - 1]); if (d > dmax) { dmax = d; idx = i; } }
    if (dmax <= eps) return [p[0], p[p.length - 1]];
    return rdp(p.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(p.slice(idx), eps));
  }
  function angleAt(a, b, c) { // inner angle at b, degrees
    const v1 = [a[0] - b[0], a[1] - b[1]], v2 = [c[0] - b[0], c[1] - b[1]];
    const m = Math.hypot(...v1) * Math.hypot(...v2);
    return m ? Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / m))) * 180 / Math.PI : 180;
  }
  function dropStraight(V) { // remove corners that are really straight (cyclic)
    let changed = true;
    while (changed && V.length > 3) {
      changed = false;
      for (let i = 0; i < V.length; i++) {
        if (angleAt(V[(i - 1 + V.length) % V.length], V[i], V[(i + 1) % V.length]) > 155) { V.splice(i, 1); changed = true; break; }
      }
    }
    return V;
  }
  function box(p) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    p.forEach((q) => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  const centroid = (V) => [V.reduce((s, q) => s + q[0], 0) / V.length, V.reduce((s, q) => s + q[1], 0) / V.length];
  function densify(paths) { // many points along every edge, so the eraser and selection can find them
    const out = [];
    paths.forEach((path) => {
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1], b = path[i], n = Math.max(1, Math.ceil(dist(a, b) / 6));
        for (let k = (i === 1 ? 0 : 1); k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n, 0.5]);
      }
    });
    return out;
  }
  const r1 = (v) => Math.round(v * 10) / 10;
  function result(type, paths, extra) {
    paths = paths.map((p) => p.map((q) => [r1(q[0]), r1(q[1])]));
    return Object.assign({ type, paths, dense: densify(paths) }, extra || {});
  }

  function snapAngle(a, b) {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), len = dist(a, b);
    const step = Math.PI / 4, snapped = Math.round(ang / step) * step;
    const use = Math.abs(ang - snapped) < (7 * Math.PI / 180) ? snapped : ang;
    return [a[0] + Math.cos(use) * len, a[1] + Math.sin(use) * len];
  }
  function ellipse(cx, cy, rx, ry, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2; pts.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); }
    return pts;
  }
  function star(c, R, startAngle) {
    const pts = [], r = R * 0.42;
    for (let i = 0; i <= 10; i++) { const a = startAngle + i * Math.PI / 5, rr = i % 2 ? r : R; pts.push([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]); }
    return pts;
  }

  function recognize(raw) {
    const p = raw.map((q) => [q[0], q[1]]);
    if (p.length < 6) return null;
    const L = pathLen(p), b0 = box(p), D = Math.hypot(b0.w, b0.h);
    if (D < 36 || L < 50) return null;
    const R = resample(p, 96), first = R[0], last = R[R.length - 1];
    const closed = dist(first, last) < Math.max(22, 0.2 * D);

    if (!closed) {
      // Straight line
      if (dist(first, last) / L > 0.93) return result('line', [[first, snapAngle(first, last)]]);
      // Arrow: a straight shaft, then a short hook near its far end
      let f = 0, fd = 0;
      R.forEach((q) => { fd = Math.max(fd, dist(first, q)); });
      f = R.findIndex((q) => dist(first, q) >= fd * 0.96); // the first time the pen reaches the tip
      const shaft = R.slice(0, f + 1), tail = R.slice(f);
      if (f > R.length * 0.4 && fd / pathLen(shaft) > 0.92 && pathLen(tail) > 0.12 * fd && tail.every((q) => dist(q, R[f]) < 0.45 * fd)) {
        const tip = snapAngle(first, R[f]);
        const ang = Math.atan2(tip[1] - first[1], tip[0] - first[0]), h = Math.max(16, Math.min(46, fd * 0.2));
        const w1 = [tip[0] - h * Math.cos(ang - 0.5), tip[1] - h * Math.sin(ang - 0.5)];
        const w2 = [tip[0] - h * Math.cos(ang + 0.5), tip[1] - h * Math.sin(ang + 0.5)];
        return result('arrow', [[first, tip], [w1, tip, w2]]);
      }
      return null;
    }

    // Circle / oval: every point is about the same "distance" from the middle
    const b = box(R), cx = b.x + b.w / 2, cy = b.y + b.h / 2, rx = b.w / 2, ry = b.h / 2;
    if (rx > 10 && ry > 10) {
      let err = 0;
      R.forEach((q) => { err += Math.abs(Math.hypot((q[0] - cx) / rx, (q[1] - cy) / ry) - 1); });
      err /= R.length;
      if (err < 0.09) {
        const ratio = rx / ry;
        if (ratio > 0.82 && ratio < 1.22) { const r = (rx + ry) / 2; return result('circle', [ellipse(cx, cy, r, r, 72)], { cx, cy, rx: r, ry: r }); }
        return result('ellipse', [ellipse(cx, cy, rx, ry, 72)], { cx, cy, rx, ry });
      }
    }

    // Straight-sided shapes: find the corners
    let V = rdp(R, 0.06 * D);
    if (V.length > 2 && dist(V[0], V[V.length - 1]) < 0.2 * D) V = V.slice(0, -1);
    V = dropStraight(V);
    const k = V.length, c = centroid(V);
    const close = (pts) => pts.concat([pts[0]]);

    if (k === 3) return result('triangle', [close(V)]);
    if (k === 4) {
      const angs = V.map((v, i) => angleAt(V[(i + 3) % 4], v, V[(i + 1) % 4]));
      if (angs.every((a) => Math.abs(a - 90) < 15)) {
        const e = Math.atan2(V[1][1] - V[0][1], V[1][0] - V[0][0]) * 180 / Math.PI;
        const tilt = Math.abs(((e % 90) + 90) % 90);
        if (tilt < 12 || tilt > 78) { // straight up and down: a neat axis rectangle
          let w = b.w, h = b.h, x = b.x, y = b.y;
          if (w / h > 0.85 && w / h < 1.15) { const s = (w + h) / 2; x = cx - s / 2; y = cy - s / 2; w = h = s; }
          return result(w === h ? 'square' : 'rectangle', [[[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]]);
        }
      }
      return result(angs.every((a) => Math.abs(a - 90) < 15) ? "rectangle" : "diamond", [close(V)]);
    }
    if (k === 5) {
      // A star drawn in one go (five crossing lines) jumps two corners at a time
      const ang = V.map((v) => Math.atan2(v[1] - c[1], v[0] - c[0]) * 180 / Math.PI);
      const steps = ang.map((a, i) => ((ang[(i + 1) % 5] - a) % 360 + 360) % 360);
      const starLike = steps.every((s) => Math.abs(s - 144) < 35) || steps.every((s) => Math.abs(s - 216) < 35);
      if (starLike) {
        const Rr = V.reduce((s, v) => s + dist(v, c), 0) / 5;
        const top = V.reduce((a, v) => (v[1] < a[1] ? v : a), V[0]);
        return result('star', [star(c, Rr, Math.atan2(top[1] - c[1], top[0] - c[0]))]);
      }
      return result('pentagon', [close(V)]);
    }
    if (k >= 8 && k <= 12 && k % 2 === 0) {
      // A star drawn around its outline: long and short corners take turns
      const rad = V.map((v) => dist(v, c));
      const odd = rad.filter((_, i) => i % 2), even = rad.filter((_, i) => i % 2 === 0);
      const mo = odd.reduce((s, x) => s + x, 0) / odd.length, me = even.reduce((s, x) => s + x, 0) / even.length;
      if (Math.min(mo, me) / Math.max(mo, me) < 0.72) {
        const outer = mo > me ? V.filter((_, i) => i % 2) : V.filter((_, i) => i % 2 === 0);
        const top = outer.reduce((a, v) => (v[1] < a[1] ? v : a), outer[0]);
        return result('star', [star(c, Math.max(mo, me), Math.atan2(top[1] - c[1], top[0] - c[0]))]);
      }
    }
    if (k >= 5 && k <= 8) return result('polygon', [close(V)]);
    return null;
  }

  root.SmartShapes = { recognize };
})(window);
