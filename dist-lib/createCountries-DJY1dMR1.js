import * as u from "three";
import { mergeGeometries as $ } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { c as B, s as P, l as H } from "./index-sn_YDAOD.js";
async function N(f, g, n = [], c = !1, e = {}) {
  const h = e.highlightColor || "#ffffff", d = e.defaultColor || "#000000", M = e.outlineColor || "#ffffff", G = e.globalOpacity !== void 0 ? e.globalOpacity : 1, i = e.progressiveLoading !== void 0 ? e.progressiveLoading : !0, l = e.batchSize || 20, L = performance.now();
  console.log(`Loading countries from: ${g} (Progressive: ${i}, Batch: ${l})`);
  const O = await (await fetch(g)).json(), F = performance.now() - L;
  console.log(`Loaded ${O.features.length} countries in ${F.toFixed(0)}ms`);
  const v = [], t = [], m = [];
  let C = 0, A = 0;
  const S = (w) => {
    const o = Math.min(w + l, O.features.length);
    for (let r = w; r < o; r++) {
      const a = O.features[r], s = a.properties, p = n.some(
        (y) => s.ADM0_A3 === y || s.ISO_A3 === y || s.GU_A3 === y || s.SOV_A3 === y
      );
      try {
        const y = e.countryRadius || 1.01, b = _(a, p, y, e);
        b.fill && (p ? v.push(b.fill) : t.push(b.fill)), b.outlines && m.push(...b.outlines), C++;
      } catch (y) {
        console.error(`Failed to create country ${s.ADM0_A3 || s.NAME}:`, y), A++;
      }
    }
    return o < O.features.length ? i ? new Promise((r) => {
      setTimeout(() => r(S(o)), 0);
    }) : S(o) : (D(), O);
  }, D = () => {
    if (v.length > 0) {
      const o = $(v, !1), r = e.countryOpacity !== void 0 ? e.countryOpacity : 1, a = Math.max(0, Math.min(1, r * G)), s = new u.MeshBasicMaterial({
        color: h,
        side: u.DoubleSide,
        transparent: a < 1,
        opacity: a
      }), p = new u.Mesh(o, s);
      p.renderOrder = 3, f.add(p);
    }
    if (t.length > 0) {
      const o = $(t, !1), r = e.countryOpacity !== void 0 ? e.countryOpacity : 1, a = Math.max(0, Math.min(1, r * G)), s = new u.MeshBasicMaterial({
        color: d,
        side: u.DoubleSide,
        transparent: a < 1,
        opacity: a
      }), p = new u.Mesh(o, s);
      p.renderOrder = 3, f.add(p);
    }
    m.forEach((o) => {
      if (o.material) {
        o.material.color.setStyle(M);
        const r = e.outlineOpacity !== void 0 ? e.outlineOpacity : 1, a = Math.max(0, Math.min(1, r * G));
        o.material.opacity = a, o.material.transparent = a < 1;
      }
      f.add(o);
    });
    const w = performance.now() - L;
    console.log(`Total render time: ${w.toFixed(0)}ms (${C} success, ${A} failed)`);
  };
  return S(0);
}
function _(f, g, n, c) {
  const { type: e, coordinates: h } = f.geometry, d = [], M = [];
  if (e === "Polygon") {
    const i = T(h[0], n, c);
    i && d.push(i);
    const l = E(h, n + 2e-3, c);
    M.push(...l);
  } else e === "MultiPolygon" && h.forEach((i) => {
    const l = T(i[0], n, c);
    l && d.push(l);
    const L = E(i, n + 2e-3, c);
    M.push(...L);
  });
  return {
    fill: d.length > 0 ? $(d, !1) : null,
    outlines: M
  };
}
function T(f, g, n) {
  try {
    return B(f, g, n);
  } catch (c) {
    return console.error("Failed to create polygon geometry:", c), null;
  }
}
function E(f, g, n) {
  const c = [];
  return f.forEach((e) => {
    let h = 0;
    for (let t = 0; t < e.length - 1; t++) {
      const [m, C] = e[t], [A, S] = e[t + 1], D = A - m, w = S - C;
      h += Math.sqrt(D * D + w * w);
    }
    const d = h / (e.length - 1), M = Number.isFinite(n.outlineDetail) ? n.outlineDetail : 1, G = Math.ceil(d / 2) * M, i = Math.max(2, Math.min(12, Math.ceil(G))), l = [];
    for (let t = 0; t < e.length - 1; t++) {
      const m = P(e[t], e[t + 1], i);
      l.push(...m.slice(0, -1));
    }
    const L = P(e[e.length - 1], e[0], i);
    l.push(...L.slice(0, -1));
    const x = l.map(([t, m]) => H(m, t, g)), O = new u.BufferGeometry().setFromPoints(x), F = new u.LineBasicMaterial({
      color: 16777215,
      // White outlines
      linewidth: 1,
      depthTest: !0,
      depthWrite: !1
      // Don't write to depth buffer for cleaner overlaps
    }), v = new u.LineLoop(O, F);
    v.renderOrder = 4, c.push(v);
  }), c;
}
export {
  N as loadCountries
};
