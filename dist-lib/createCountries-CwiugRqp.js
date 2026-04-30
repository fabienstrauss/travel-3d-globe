import * as h from "three";
import { mergeGeometries as D } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { c as B, s as P, l as H } from "./index-F3tqLcMc.js";
async function N(f, d, n = [], c = !1, e = {}) {
  const m = e.highlightColor || "#ffffff", p = e.defaultColor || "#000000", O = e.outlineColor || "#ffffff", v = e.globalOpacity !== void 0 ? e.globalOpacity : 1, i = e.progressiveLoading !== void 0 ? e.progressiveLoading : !0, a = e.batchSize || 20, L = performance.now();
  console.log(`Loading countries from: ${d} (Progressive: ${i}, Batch: ${a})`);
  const w = await fetch(d);
  if (!w.ok) {
    const u = (await w.text()).slice(0, 120);
    throw new Error(`Failed to load GeoJSON from ${d}: ${w.status} ${w.statusText}. Response starts with: ${u}`);
  }
  const G = await w.json(), A = performance.now() - L;
  console.log(`Loaded ${G.features.length} countries in ${A.toFixed(0)}ms`);
  const $ = [], t = [], y = [];
  let x = 0, C = 0;
  const S = (u) => {
    const o = Math.min(u + a, G.features.length);
    for (let r = u; r < o; r++) {
      const l = G.features[r], s = l.properties, g = n.some(
        (M) => s.ADM0_A3 === M || s.ISO_A3 === M || s.GU_A3 === M || s.SOV_A3 === M
      );
      try {
        const M = e.countryRadius || 1.01, b = R(l, g, M, e);
        b.fill && (g ? $.push(b.fill) : t.push(b.fill)), b.outlines && y.push(...b.outlines), x++;
      } catch (M) {
        console.error(`Failed to create country ${s.ADM0_A3 || s.NAME}:`, M), C++;
      }
    }
    return o < G.features.length ? i ? new Promise((r) => {
      setTimeout(() => r(S(o)), 0);
    }) : S(o) : (F(), G);
  }, F = () => {
    if ($.length > 0) {
      const o = D($, !1), r = e.countryOpacity !== void 0 ? e.countryOpacity : 1, l = Math.max(0, Math.min(1, r * v)), s = new h.MeshBasicMaterial({
        color: m,
        side: h.DoubleSide,
        transparent: l < 1,
        opacity: l
      }), g = new h.Mesh(o, s);
      g.renderOrder = 3, f.add(g);
    }
    if (t.length > 0) {
      const o = D(t, !1), r = e.countryOpacity !== void 0 ? e.countryOpacity : 1, l = Math.max(0, Math.min(1, r * v)), s = new h.MeshBasicMaterial({
        color: p,
        side: h.DoubleSide,
        transparent: l < 1,
        opacity: l
      }), g = new h.Mesh(o, s);
      g.renderOrder = 3, f.add(g);
    }
    y.forEach((o) => {
      if (o.material) {
        o.material.color.setStyle(O);
        const r = e.outlineOpacity !== void 0 ? e.outlineOpacity : 1, l = Math.max(0, Math.min(1, r * v));
        o.material.opacity = l, o.material.transparent = l < 1;
      }
      f.add(o);
    });
    const u = performance.now() - L;
    console.log(`Total render time: ${u.toFixed(0)}ms (${x} success, ${C} failed)`);
  };
  return S(0);
}
function R(f, d, n, c) {
  const { type: e, coordinates: m } = f.geometry, p = [], O = [];
  if (e === "Polygon") {
    const i = T(m[0], n, c);
    i && p.push(i);
    const a = E(m, n + 2e-3, c);
    O.push(...a);
  } else e === "MultiPolygon" && m.forEach((i) => {
    const a = T(i[0], n, c);
    a && p.push(a);
    const L = E(i, n + 2e-3, c);
    O.push(...L);
  });
  return {
    fill: p.length > 0 ? D(p, !1) : null,
    outlines: O
  };
}
function T(f, d, n) {
  try {
    return B(f, d, n);
  } catch (c) {
    return console.error("Failed to create polygon geometry:", c), null;
  }
}
function E(f, d, n) {
  const c = [];
  return f.forEach((e) => {
    let m = 0;
    for (let t = 0; t < e.length - 1; t++) {
      const [y, x] = e[t], [C, S] = e[t + 1], F = C - y, u = S - x;
      m += Math.sqrt(F * F + u * u);
    }
    const p = m / (e.length - 1), O = Number.isFinite(n.outlineDetail) ? n.outlineDetail : 1, v = Math.ceil(p / 2) * O, i = Math.max(2, Math.min(12, Math.ceil(v))), a = [];
    for (let t = 0; t < e.length - 1; t++) {
      const y = P(e[t], e[t + 1], i);
      a.push(...y.slice(0, -1));
    }
    const L = P(e[e.length - 1], e[0], i);
    a.push(...L.slice(0, -1));
    const w = a.map(([t, y]) => H(y, t, d)), G = new h.BufferGeometry().setFromPoints(w), A = new h.LineBasicMaterial({
      color: 16777215,
      // White outlines
      linewidth: 1,
      depthTest: !0,
      depthWrite: !1
      // Don't write to depth buffer for cleaner overlaps
    }), $ = new h.LineLoop(G, A);
    $.renderOrder = 4, c.push($);
  }), c;
}
export {
  N as loadCountries
};
