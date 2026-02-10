import * as _ from "three";
function ze(i = document.body) {
  const t = new _.Scene();
  t.fog = new _.Fog(657935, 5, 15);
  let e = Math.min(window.devicePixelRatio, 2);
  const n = new _.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1e3);
  n.position.set(0, 0, 3.5);
  const a = new _.WebGLRenderer({
    antialias: !0,
    alpha: !0,
    precision: "highp",
    powerPreference: "high-performance"
  }), l = f();
  a.setSize(l.width, l.height), a.setPixelRatio(e), a.sortObjects = !0, i.appendChild(a.domElement), window.addEventListener("resize", r);
  const s = typeof ResizeObserver < "u" ? new ResizeObserver(r) : null;
  return s && s.observe(i), {
    scene: t,
    camera: n,
    renderer: a,
    setBackground: h,
    setPixelRatioMax: c,
    destroy: g
  };
  function r() {
    const { width: d, height: y } = f();
    n.aspect = d / y, n.updateProjectionMatrix(), a.setSize(d, y), a.setPixelRatio(Math.min(window.devicePixelRatio, e));
  }
  function f() {
    const d = i === document.body || i === document.documentElement, y = d ? window.innerWidth : i.clientWidth, b = d ? window.innerHeight : i.clientHeight, m = Math.max(y || 0, 1), L = Math.max(b || 0, 1);
    return { width: m, height: L };
  }
  function g() {
    window.removeEventListener("resize", r), s && s.disconnect(), a.dispose(), a.domElement.parentNode && a.domElement.parentNode.removeChild(a.domElement);
  }
  function h(d, y) {
    t.background = y ? null : new _.Color(d);
  }
  function c(d) {
    e = Math.max(0.5, Math.min(3, Number(d) || 2)), a.setPixelRatio(Math.min(window.devicePixelRatio, e));
  }
}
function Ge(i, t) {
  let e = null, n = null, a = null, l = null;
  return s(t), {
    update: r,
    destroy: g
  };
  function s(h) {
    f(), e = new _.AmbientLight(h.ambientColor, h.ambientIntensity), i.add(e), n = new _.DirectionalLight(h.dirLightColor, h.dirLightIntensity), n.position.set(h.dirLightPos.x, h.dirLightPos.y, h.dirLightPos.z), i.add(n), a = new _.PointLight(h.rimLightColor, h.rimLightIntensity, 10), a.position.set(h.rimLightPos.x, h.rimLightPos.y, h.rimLightPos.z), i.add(a), l = new _.HemisphereLight(
      h.fillLightSkyColor,
      h.fillLightGroundColor,
      h.fillLightIntensity
    ), i.add(l), r(h);
  }
  function r(h) {
    e && (e.color.setStyle(h.ambientColor), e.intensity = h.ambientIntensity, e.visible = h.ambientEnabled), n && (n.color.setStyle(h.dirLightColor), n.intensity = h.dirLightIntensity, n.position.set(h.dirLightPos.x, h.dirLightPos.y, h.dirLightPos.z), n.visible = h.dirLightEnabled), a && (a.color.setStyle(h.rimLightColor), a.intensity = h.rimLightIntensity, a.position.set(h.rimLightPos.x, h.rimLightPos.y, h.rimLightPos.z), a.visible = h.rimLightEnabled), l && (l.color.setStyle(h.fillLightSkyColor), l.groundColor.setStyle(h.fillLightGroundColor), l.intensity = h.fillLightIntensity, l.visible = h.fillLightEnabled);
  }
  function f() {
    e && i.remove(e), n && i.remove(n), a && i.remove(a), l && i.remove(l);
  }
  function g() {
    f(), e = null, n = null, a = null, l = null;
  }
}
function Fe(i, t, e = {}) {
  let n = !1, a = 0, l = 0, s = 0, r = 0, f = null;
  const g = {
    autoRotate: !1,
    autoRotateSpeed: 1,
    inertia: !0,
    inertiaFriction: 0.95,
    lockRotationX: !1,
    ...e
  }, h = -Math.PI * 0.45, c = Math.PI * 0.45;
  return t.style.touchAction = "none", t.addEventListener("pointerdown", d), window.addEventListener("pointermove", y), window.addEventListener("pointerup", b), window.addEventListener("pointercancel", b), {
    update: L,
    setSettings: o,
    destroy: x
  };
  function d(C) {
    f !== null && f !== C.pointerId || (f = C.pointerId, n = !0, a = C.clientX, l = C.clientY, s = 0, r = 0);
  }
  function y(C) {
    if (f !== null && C.pointerId !== f || !n) return;
    const M = C.clientX - a, O = C.clientY - l;
    a = C.clientX, l = C.clientY, s = M * 5e-3, r = O * 5e-3, m(s, r);
  }
  function b(C) {
    f !== null && C.pointerId !== f || (n = !1, f = null);
  }
  function m(C, M) {
    if (i.rotation.y += C, !g.lockRotationX) {
      const O = i.rotation.x + M;
      i.rotation.x = Math.max(h, Math.min(c, O));
    }
  }
  function L() {
    n || (g.autoRotate && (i.rotation.y += g.autoRotateSpeed * 5e-3), g.inertia && (Math.abs(s) > 1e-4 || Math.abs(r) > 1e-4) && (m(s, 0), s *= g.inertiaFriction, r *= g.inertiaFriction));
  }
  function o(C) {
    Object.assign(g, C);
  }
  function x() {
    t.removeEventListener("pointerdown", d), window.removeEventListener("pointermove", y), window.removeEventListener("pointerup", b), window.removeEventListener("pointercancel", b);
  }
}
const J = 11102230246251565e-32, B = 134217729, Ae = (3 + 8 * J) * J;
function le(i, t, e, n, a) {
  let l, s, r, f, g = t[0], h = n[0], c = 0, d = 0;
  h > g == h > -g ? (l = g, g = t[++c]) : (l = h, h = n[++d]);
  let y = 0;
  if (c < i && d < e)
    for (h > g == h > -g ? (s = g + l, r = l - (s - g), g = t[++c]) : (s = h + l, r = l - (s - h), h = n[++d]), l = s, r !== 0 && (a[y++] = r); c < i && d < e; )
      h > g == h > -g ? (s = l + g, f = s - l, r = l - (s - f) + (g - f), g = t[++c]) : (s = l + h, f = s - l, r = l - (s - f) + (h - f), h = n[++d]), l = s, r !== 0 && (a[y++] = r);
  for (; c < i; )
    s = l + g, f = s - l, r = l - (s - f) + (g - f), g = t[++c], l = s, r !== 0 && (a[y++] = r);
  for (; d < e; )
    s = l + h, f = s - l, r = l - (s - f) + (h - f), h = n[++d], l = s, r !== 0 && (a[y++] = r);
  return (l !== 0 || y === 0) && (a[y++] = l), y;
}
function De(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function Q(i) {
  return new Float64Array(i);
}
const ke = (3 + 16 * J) * J, Ue = (2 + 12 * J) * J, Be = (9 + 64 * J) * J * J, Y = Q(4), pe = Q(8), ye = Q(12), be = Q(16), X = Q(4);
function Xe(i, t, e, n, a, l, s) {
  let r, f, g, h, c, d, y, b, m, L, o, x, C, M, O, G, A, E;
  const u = i - a, w = e - a, S = t - l, v = n - l;
  M = u * v, d = B * u, y = d - (d - u), b = u - y, d = B * v, m = d - (d - v), L = v - m, O = b * L - (M - y * m - b * m - y * L), G = S * w, d = B * S, y = d - (d - S), b = S - y, d = B * w, m = d - (d - w), L = w - m, A = b * L - (G - y * m - b * m - y * L), o = O - A, c = O - o, Y[0] = O - (o + c) + (c - A), x = M + o, c = x - M, C = M - (x - c) + (o - c), o = C - G, c = C - o, Y[1] = C - (o + c) + (c - G), E = x + o, c = E - x, Y[2] = x - (E - c) + (o - c), Y[3] = E;
  let I = De(4, Y), F = Ue * s;
  if (I >= F || -I >= F || (c = i - u, r = i - (u + c) + (c - a), c = e - w, g = e - (w + c) + (c - a), c = t - S, f = t - (S + c) + (c - l), c = n - v, h = n - (v + c) + (c - l), r === 0 && f === 0 && g === 0 && h === 0) || (F = Be * s + Ae * Math.abs(I), I += u * h + v * r - (S * g + w * f), I >= F || -I >= F)) return I;
  M = r * v, d = B * r, y = d - (d - r), b = r - y, d = B * v, m = d - (d - v), L = v - m, O = b * L - (M - y * m - b * m - y * L), G = f * w, d = B * f, y = d - (d - f), b = f - y, d = B * w, m = d - (d - w), L = w - m, A = b * L - (G - y * m - b * m - y * L), o = O - A, c = O - o, X[0] = O - (o + c) + (c - A), x = M + o, c = x - M, C = M - (x - c) + (o - c), o = C - G, c = C - o, X[1] = C - (o + c) + (c - G), E = x + o, c = E - x, X[2] = x - (E - c) + (o - c), X[3] = E;
  const k = le(4, Y, 4, X, pe);
  M = u * h, d = B * u, y = d - (d - u), b = u - y, d = B * h, m = d - (d - h), L = h - m, O = b * L - (M - y * m - b * m - y * L), G = S * g, d = B * S, y = d - (d - S), b = S - y, d = B * g, m = d - (d - g), L = g - m, A = b * L - (G - y * m - b * m - y * L), o = O - A, c = O - o, X[0] = O - (o + c) + (c - A), x = M + o, c = x - M, C = M - (x - c) + (o - c), o = C - G, c = C - o, X[1] = C - (o + c) + (c - G), E = x + o, c = E - x, X[2] = x - (E - c) + (o - c), X[3] = E;
  const R = le(k, pe, 4, X, ye);
  M = r * h, d = B * r, y = d - (d - r), b = r - y, d = B * h, m = d - (d - h), L = h - m, O = b * L - (M - y * m - b * m - y * L), G = f * g, d = B * f, y = d - (d - f), b = f - y, d = B * g, m = d - (d - g), L = g - m, A = b * L - (G - y * m - b * m - y * L), o = O - A, c = O - o, X[0] = O - (o + c) + (c - A), x = M + o, c = x - M, C = M - (x - c) + (o - c), o = C - G, c = C - o, X[1] = C - (o + c) + (c - G), E = x + o, c = E - x, X[2] = x - (E - c) + (o - c), X[3] = E;
  const D = le(R, ye, 4, X, be);
  return be[D - 1];
}
function $(i, t, e, n, a, l) {
  const s = (t - l) * (e - a), r = (i - a) * (n - l), f = s - r, g = Math.abs(s + r);
  return Math.abs(f) >= ke * g ? f : -Xe(i, t, e, n, a, l, g);
}
const we = Math.pow(2, -52), Z = new Uint32Array(512);
class de {
  static from(t, e = Ye, n = He) {
    const a = t.length, l = new Float64Array(a * 2);
    for (let s = 0; s < a; s++) {
      const r = t[s];
      l[2 * s] = e(r), l[2 * s + 1] = n(r);
    }
    return new de(l);
  }
  constructor(t) {
    const e = t.length >> 1;
    if (e > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.update();
  }
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: a, _hullHash: l } = this, s = t.length >> 1;
    let r = 1 / 0, f = 1 / 0, g = -1 / 0, h = -1 / 0;
    for (let u = 0; u < s; u++) {
      const w = t[2 * u], S = t[2 * u + 1];
      w < r && (r = w), S < f && (f = S), w > g && (g = w), S > h && (h = S), this._ids[u] = u;
    }
    const c = (r + g) / 2, d = (f + h) / 2;
    let y, b, m;
    for (let u = 0, w = 1 / 0; u < s; u++) {
      const S = se(c, d, t[2 * u], t[2 * u + 1]);
      S < w && (y = u, w = S);
    }
    const L = t[2 * y], o = t[2 * y + 1];
    for (let u = 0, w = 1 / 0; u < s; u++) {
      if (u === y) continue;
      const S = se(L, o, t[2 * u], t[2 * u + 1]);
      S < w && S > 0 && (b = u, w = S);
    }
    let x = t[2 * b], C = t[2 * b + 1], M = 1 / 0;
    for (let u = 0; u < s; u++) {
      if (u === y || u === b) continue;
      const w = Te(L, o, x, C, t[2 * u], t[2 * u + 1]);
      w < M && (m = u, M = w);
    }
    let O = t[2 * m], G = t[2 * m + 1];
    if (M === 1 / 0) {
      for (let S = 0; S < s; S++)
        this._dists[S] = t[2 * S] - t[0] || t[2 * S + 1] - t[1];
      H(this._ids, this._dists, 0, s - 1);
      const u = new Uint32Array(s);
      let w = 0;
      for (let S = 0, v = -1 / 0; S < s; S++) {
        const I = this._ids[S], F = this._dists[I];
        F > v && (u[w++] = I, v = F);
      }
      this.hull = u.subarray(0, w), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if ($(L, o, x, C, O, G) < 0) {
      const u = b, w = x, S = C;
      b = m, x = O, C = G, m = u, O = w, G = S;
    }
    const A = Je(L, o, x, C, O, G);
    this._cx = A.x, this._cy = A.y;
    for (let u = 0; u < s; u++)
      this._dists[u] = se(t[2 * u], t[2 * u + 1], A.x, A.y);
    H(this._ids, this._dists, 0, s - 1), this._hullStart = y;
    let E = 3;
    n[y] = e[m] = b, n[b] = e[y] = m, n[m] = e[b] = y, a[y] = 0, a[b] = 1, a[m] = 2, l.fill(-1), l[this._hashKey(L, o)] = y, l[this._hashKey(x, C)] = b, l[this._hashKey(O, G)] = m, this.trianglesLen = 0, this._addTriangle(y, b, m, -1, -1, -1);
    for (let u = 0, w, S; u < this._ids.length; u++) {
      const v = this._ids[u], I = t[2 * v], F = t[2 * v + 1];
      if (u > 0 && Math.abs(I - w) <= we && Math.abs(F - S) <= we || (w = I, S = F, v === y || v === b || v === m)) continue;
      let k = 0;
      for (let V = 0, ie = this._hashKey(I, F); V < this._hashSize && (k = l[(ie + V) % this._hashSize], !(k !== -1 && k !== n[k])); V++)
        ;
      k = e[k];
      let R = k, D;
      for (; D = n[R], $(I, F, t[2 * R], t[2 * R + 1], t[2 * D], t[2 * D + 1]) >= 0; )
        if (R = D, R === k) {
          R = -1;
          break;
        }
      if (R === -1) continue;
      let T = this._addTriangle(R, v, n[R], -1, -1, a[R]);
      a[v] = this._legalize(T + 2), a[R] = T, E++;
      let N = n[R];
      for (; D = n[N], $(I, F, t[2 * N], t[2 * N + 1], t[2 * D], t[2 * D + 1]) < 0; )
        T = this._addTriangle(N, v, D, a[v], -1, a[N]), a[v] = this._legalize(T + 2), n[N] = N, E--, N = D;
      if (R === k)
        for (; D = e[R], $(I, F, t[2 * D], t[2 * D + 1], t[2 * R], t[2 * R + 1]) < 0; )
          T = this._addTriangle(D, v, R, -1, a[R], a[D]), this._legalize(T + 2), a[D] = T, n[R] = R, E--, R = D;
      this._hullStart = e[v] = R, n[R] = e[N] = v, n[v] = N, l[this._hashKey(I, F)] = v, l[this._hashKey(t[2 * R], t[2 * R + 1])] = R;
    }
    this.hull = new Uint32Array(E);
    for (let u = 0, w = this._hullStart; u < E; u++)
      this.hull[u] = w, w = n[w];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(t, e) {
    return Math.floor(je(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: a } = this;
    let l = 0, s = 0;
    for (; ; ) {
      const r = n[t], f = t - t % 3;
      if (s = f + (t + 2) % 3, r === -1) {
        if (l === 0) break;
        t = Z[--l];
        continue;
      }
      const g = r - r % 3, h = f + (t + 1) % 3, c = g + (r + 2) % 3, d = e[s], y = e[t], b = e[h], m = e[c];
      if (Ne(
        a[2 * d],
        a[2 * d + 1],
        a[2 * y],
        a[2 * y + 1],
        a[2 * b],
        a[2 * b + 1],
        a[2 * m],
        a[2 * m + 1]
      )) {
        e[t] = m, e[r] = d;
        const o = n[c];
        if (o === -1) {
          let C = this._hullStart;
          do {
            if (this._hullTri[C] === c) {
              this._hullTri[C] = t;
              break;
            }
            C = this._hullPrev[C];
          } while (C !== this._hullStart);
        }
        this._link(t, o), this._link(r, n[s]), this._link(s, c);
        const x = g + (r + 1) % 3;
        l < Z.length && (Z[l++] = x);
      } else {
        if (l === 0) break;
        t = Z[--l];
      }
    }
    return s;
  }
  _link(t, e) {
    this._halfedges[t] = e, e !== -1 && (this._halfedges[e] = t);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(t, e, n, a, l, s) {
    const r = this.trianglesLen;
    return this._triangles[r] = t, this._triangles[r + 1] = e, this._triangles[r + 2] = n, this._link(r, a), this._link(r + 1, l), this._link(r + 2, s), this.trianglesLen += 3, r;
  }
}
function je(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function se(i, t, e, n) {
  const a = i - e, l = t - n;
  return a * a + l * l;
}
function Ne(i, t, e, n, a, l, s, r) {
  const f = i - s, g = t - r, h = e - s, c = n - r, d = a - s, y = l - r, b = f * f + g * g, m = h * h + c * c, L = d * d + y * y;
  return f * (c * L - m * y) - g * (h * L - m * d) + b * (h * y - c * d) < 0;
}
function Te(i, t, e, n, a, l) {
  const s = e - i, r = n - t, f = a - i, g = l - t, h = s * s + r * r, c = f * f + g * g, d = 0.5 / (s * g - r * f), y = (g * h - r * c) * d, b = (s * c - f * h) * d;
  return y * y + b * b;
}
function Je(i, t, e, n, a, l) {
  const s = e - i, r = n - t, f = a - i, g = l - t, h = s * s + r * r, c = f * f + g * g, d = 0.5 / (s * g - r * f), y = i + (g * h - r * c) * d, b = t + (s * c - f * h) * d;
  return { x: y, y: b };
}
function H(i, t, e, n) {
  if (n - e <= 20)
    for (let a = e + 1; a <= n; a++) {
      const l = i[a], s = t[l];
      let r = a - 1;
      for (; r >= e && t[i[r]] > s; ) i[r + 1] = i[r--];
      i[r + 1] = l;
    }
  else {
    const a = e + n >> 1;
    let l = e + 1, s = n;
    W(i, a, l), t[i[e]] > t[i[n]] && W(i, e, n), t[i[l]] > t[i[n]] && W(i, l, n), t[i[e]] > t[i[l]] && W(i, e, l);
    const r = i[l], f = t[r];
    for (; ; ) {
      do
        l++;
      while (t[i[l]] < f);
      do
        s--;
      while (t[i[s]] > f);
      if (s < l) break;
      W(i, l, s);
    }
    i[e + 1] = i[s], i[s] = r, n - l + 1 >= s - e ? (H(i, t, l, n), H(i, t, e, s - 1)) : (H(i, t, e, s - 1), H(i, t, l, n));
  }
}
function W(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Ye(i) {
  return i[0];
}
function He(i) {
  return i[1];
}
function ue(i, t, e) {
  const n = (90 - i) * (Math.PI / 180), a = (t + 180) * (Math.PI / 180), l = -e * Math.sin(n) * Math.cos(a), s = e * Math.sin(n) * Math.sin(a), r = e * Math.cos(n);
  return new _.Vector3(l, r, s);
}
function Ve(i, t, e = 5) {
  const n = [];
  for (let a = 0; a <= e; a++) {
    const l = a / e, s = i[0] + l * (t[0] - i[0]), r = i[1] + l * (t[1] - i[1]);
    n.push([s, r]);
  }
  return n;
}
function Ce(i, t) {
  const [e, n] = i;
  let a = !1;
  for (let l = 0, s = t.length - 1; l < t.length; s = l++) {
    const [r, f] = t[l], [g, h] = t[s];
    f > n != h > n && e < (g - r) * (n - f) / (h - f) + r && (a = !a);
  }
  return a;
}
function Ze(i, t, e = {}) {
  let n = 0;
  for (let u = 0; u < i.length - 1; u++) {
    const [w, S] = i[u], [v, I] = i[u + 1];
    n += Math.sqrt((v - w) ** 2 + (I - S) ** 2);
  }
  n /= i.length;
  const a = [];
  for (let u = 0; u < i.length - 1; u++) {
    const [w, S] = i[u], [v, I] = i[u + 1], F = Math.sqrt((v - w) ** 2 + (I - S) ** 2);
    let k = 1;
    if (n > 0.5 && (k = Math.max(1, Math.ceil(F / 2))), k > 1) {
      const R = Ve(i[u], i[u + 1], k);
      a.push(...R.slice(0, -1));
    } else
      a.push(i[u]);
  }
  a.push(i[i.length - 1]);
  let l = 1 / 0, s = -1 / 0, r = 1 / 0, f = -1 / 0;
  for (const [u, w] of a)
    l = Math.min(l, u), s = Math.max(s, u), r = Math.min(r, w), f = Math.max(f, w);
  const g = s - l, h = f - r, c = g * h;
  let d;
  c > 1e3 ? d = 1.5 : c > 500 ? d = 2 : c > 100 ? d = 2.5 : c > 20 ? d = 3.5 : d = 5;
  const y = Number.isFinite(e.countryFillDetail) ? e.countryFillDetail : 1;
  d *= y;
  const b = [];
  if (g > d && h > d)
    for (let u = l + d / 2; u < s; u += d)
      for (let w = r + d / 2; w < f; w += d)
        Ce([u, w], i) && b.push([u, w]);
  const m = [...a, ...b], L = m.map(([u, w]) => ue(w, u, t));
  let o = 0, x = 0;
  for (const [u, w] of m)
    o += u, x += w;
  o /= m.length, x /= m.length;
  const C = m.map(([u, w]) => [
    u - o,
    w - x
  ]);
  for (const [u, w] of C)
    ;
  const M = de.from(C);
  if (!M || !M.triangles || M.triangles.length === 0)
    return console.warn("Delaunator triangulation failed for polygon"), new _.BufferGeometry();
  const O = [];
  for (let u = 0; u < M.triangles.length; u += 3) {
    const w = M.triangles[u], S = M.triangles[u + 1], v = M.triangles[u + 2], I = (C[w][0] + C[S][0] + C[v][0]) / 3, F = (C[w][1] + C[S][1] + C[v][1]) / 3, k = I + o, R = F + x;
    Ce([k, R], i) && O.push(w, S, v);
  }
  if (O.length === 0)
    return console.warn("No valid triangles after filtering"), new _.BufferGeometry();
  const G = O, A = new _.BufferGeometry(), E = new Float32Array(L.length * 3);
  for (let u = 0; u < L.length; u++)
    E[u * 3 + 0] = L[u].x, E[u * 3 + 1] = L[u].y, E[u * 3 + 2] = L[u].z;
  return A.setAttribute("position", new _.BufferAttribute(E, 3)), A.setIndex(new _.BufferAttribute(new Uint32Array(G), 1)), A.computeVertexNormals(), A;
}
function qe(i, t, e = 20, n = 20, a = 1, l = "#ffffff") {
  for (let s = -90 + e; s < 90; s += e) {
    const r = [];
    for (let c = -180; c <= 180; c += a)
      r.push(ue(s, c, t));
    const f = new _.BufferGeometry().setFromPoints(r), g = new _.LineBasicMaterial({
      color: l,
      transparent: !0,
      opacity: 0.35
    }), h = new _.Line(f, g);
    h.renderOrder = 2, i.add(h);
  }
  for (let s = -180; s < 180; s += n) {
    const r = [];
    for (let c = -90; c <= 90; c += a)
      r.push(ue(c, s, t));
    const f = new _.BufferGeometry().setFromPoints(r), g = new _.LineBasicMaterial({
      color: l,
      transparent: !0,
      opacity: 0.35
    }), h = new _.Line(f, g);
    h.renderOrder = 2, i.add(h);
  }
}
function We(i, t = 1.15, e = 1846706, n = 45) {
  const a = new _.SphereGeometry(i, n, n), l = new _.ShaderMaterial({
    uniforms: {
      c: { type: "f", value: 0.7 },
      // snippet had c = .7
      p: { type: "f", value: 15 },
      // snippet had p = 15
      glowColor: { type: "c", value: new _.Color(e) },
      viewVector: { type: "v3", value: new _.Vector3(0, 0, 220) }
    },
    vertexShader: `
      #define GLSLIFY 1
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      varying float intensityA;
      void main() {
        // replicate snippet logic
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        float d = dot(vNormal, vNormel);
        // c - d, p => snippet used pow(c - d, p)
        intensity = pow(c - d, p);
        // snippet also used intensityA = pow(0.63 - d, p)
        intensityA = pow(0.63 - d, p);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      #define GLSLIFY 1
      uniform vec3 glowColor;
      varying float intensity;
      varying float intensityA;
      void main() {
        // snippet: gl_FragColor = vec4( glowColor * intensity, 1.0 * intensityA );
        gl_FragColor = vec4(glowColor * intensity, intensityA);
      }
    `,
    side: _.BackSide,
    blending: _.AdditiveBlending,
    transparent: !0,
    dithering: !0
  }), s = new _.Mesh(a, l);
  return s.scale.multiplyScalar(t), s.rotation.x = 0.03 * Math.PI, s.rotation.y = 0.03 * Math.PI, s.renderOrder = 3, s;
}
function ee(i, t) {
  !i || !i.material || !i.material.uniforms || (i.visible = t.showHalo, i.material.uniforms.glowColor.value.setStyle(t.haloColor), i.material.uniforms.c.value = t.haloIntensity, i.material.uniforms.p.value = t.haloPower, i.material.opacity = t.globalOpacity !== void 0 ? t.globalOpacity : 1);
}
const Se = {
  "110m": "/geojson/ne_110m_admin_0_countries.json"
}, te = "110m", Ke = /^#([0-9a-fA-F]{6})$/, fe = 1, U = {
  schemaVersion: fe,
  geoJsonResolution: te,
  geoJsonUrl: Se[te],
  progressiveLoading: !0,
  batchSize: 20,
  highlightCodes: ["DEU", "FRA", "ESP"],
  highlightColor: "#ffffff",
  defaultColor: "#000000",
  outlineColor: "#ffffff",
  outlineOpacity: 1,
  baseSphereColor: "#00050a",
  baseSphereOpacity: 1,
  globalOpacity: 1,
  gridColor: "#ffffff",
  backgroundColor: "#0a0a0f",
  transparentBackground: !1,
  ambientColor: "#101020",
  ambientIntensity: 0.5,
  dirLightColor: "#ffffff",
  dirLightIntensity: 1.2,
  dirLightPos: { x: 5, y: 5, z: 5 },
  rimLightColor: "#4444ff",
  rimLightIntensity: 2,
  rimLightPos: { x: -5, y: 2, z: -3 },
  ambientEnabled: !0,
  dirLightEnabled: !0,
  rimLightEnabled: !0,
  fillLightEnabled: !0,
  fillLightSkyColor: "#000000",
  fillLightGroundColor: "#111133",
  fillLightIntensity: 0.5,
  haloColor: "#4040ff",
  haloIntensity: 0.7,
  haloPower: 15,
  showHalo: !0,
  showGrid: !0,
  gridOpacity: 0.35,
  gridSpacing: 20,
  gridRadius: 1.001,
  gridSegmentSize: 1,
  countryRoughness: 1,
  countryMetalness: 0,
  countryEmissiveIntensity: 0,
  countryOpacity: 1,
  countryRadius: 1.01,
  countryFillDetail: 1,
  outlineDetail: 1,
  qualityPreset: "high",
  rendererPixelRatioMax: 2,
  sphereSegments: 128,
  globeScale: 1,
  showCameraOutline: !1,
  cameraOutlineColor: "#ffffff",
  cameraOutlineWidth: 0.02,
  cameraOutlineRadiusFactor: 1,
  autoRotate: !1,
  autoRotateSpeed: 1,
  inertia: !0,
  inertiaFriction: 0.95,
  lockRotationX: !1,
  rotationX: 0,
  rotationY: 0
};
function K(i) {
  return Se[te];
}
function he(i) {
  const t = i && typeof i == "object" ? i.settings && typeof i.settings == "object" ? i.settings : i : {}, e = {
    ...U,
    ...t
  };
  return e.schemaVersion = fe, e.geoJsonResolution = te, e.geoJsonUrl = K(), e.progressiveLoading = !!e.progressiveLoading, e.batchSize = P(e.batchSize, 20, 5, 100), e.highlightCodes = Array.isArray(e.highlightCodes) ? e.highlightCodes.filter((n) => typeof n == "string").map((n) => n.trim().toUpperCase()).filter((n) => n.length > 0) : [...U.highlightCodes], e.highlightColor = j(e.highlightColor, U.highlightColor), e.defaultColor = j(e.defaultColor, U.defaultColor), e.outlineColor = j(e.outlineColor, U.outlineColor), e.outlineOpacity = P(e.outlineOpacity, 1, 0, 1), e.baseSphereColor = j(e.baseSphereColor, U.baseSphereColor), e.baseSphereOpacity = P(e.baseSphereOpacity, 1, 0, 1), e.globalOpacity = P(e.globalOpacity, 1, 0, 1), e.gridColor = j(e.gridColor, U.gridColor), e.backgroundColor = j(e.backgroundColor, U.backgroundColor), e.ambientColor = j(e.ambientColor, U.ambientColor), e.dirLightColor = j(e.dirLightColor, U.dirLightColor), e.rimLightColor = j(e.rimLightColor, U.rimLightColor), e.fillLightSkyColor = j(e.fillLightSkyColor, U.fillLightSkyColor), e.fillLightGroundColor = j(e.fillLightGroundColor, U.fillLightGroundColor), e.haloColor = j(e.haloColor, U.haloColor), e.cameraOutlineColor = j(e.cameraOutlineColor, U.cameraOutlineColor), e.transparentBackground = !!e.transparentBackground, e.ambientEnabled = !!e.ambientEnabled, e.dirLightEnabled = !!e.dirLightEnabled, e.rimLightEnabled = !!e.rimLightEnabled, e.fillLightEnabled = !!e.fillLightEnabled, e.ambientIntensity = P(e.ambientIntensity, 0.5, 0, 2), e.dirLightIntensity = P(e.dirLightIntensity, 1.2, 0, 5), e.rimLightIntensity = P(e.rimLightIntensity, 2, 0, 10), e.fillLightIntensity = P(e.fillLightIntensity, 0.5, 0, 3), e.haloIntensity = P(e.haloIntensity, 0.7, 0, 1), e.haloPower = P(e.haloPower, 15, 1, 50), e.showHalo = !!e.showHalo, e.showGrid = !!e.showGrid, e.gridOpacity = P(e.gridOpacity, 0.35, 0, 1), e.gridSpacing = P(e.gridSpacing, 20, 5, 45), e.gridRadius = P(e.gridRadius, 1.001, 1, 1.02), e.gridSegmentSize = P(e.gridSegmentSize, 1, 1, 10), e.countryRoughness = P(e.countryRoughness, 1, 0, 1), e.countryMetalness = P(e.countryMetalness, 0, 0, 1), e.countryEmissiveIntensity = P(e.countryEmissiveIntensity, 0.2, 0, 2), e.countryOpacity = P(e.countryOpacity, 1, 0, 1), e.countryRadius = P(e.countryRadius, 1.01, 1, 1.03), e.countryFillDetail = P(e.countryFillDetail, 1, 0.5, 3), e.outlineDetail = P(e.outlineDetail, 1, 0.5, 3), e.qualityPreset = Qe(e.qualityPreset), e.rendererPixelRatioMax = P(e.rendererPixelRatioMax, 2, 0.5, 3), e.sphereSegments = Math.round(P(e.sphereSegments, 128, 16, 256)), e.globeScale = P(e.globeScale, 1, 0.25, 4), e.showCameraOutline = !!e.showCameraOutline, e.cameraOutlineWidth = P(e.cameraOutlineWidth, 0.02, 1e-3, 0.2), e.cameraOutlineRadiusFactor = P(e.cameraOutlineRadiusFactor, 1, 0.5, 2), e.autoRotate = !!e.autoRotate, e.autoRotateSpeed = P(e.autoRotateSpeed, 1, 0, 5), e.inertia = !!e.inertia, e.inertiaFriction = P(e.inertiaFriction, 0.95, 0.8, 0.999), e.lockRotationX = !!e.lockRotationX, e.rotationX = P(e.rotationX, 0, -Math.PI * 0.45, Math.PI * 0.45), e.rotationY = P(e.rotationY, 0, -Math.PI * 100, Math.PI * 100), e.dirLightPos = Le(e.dirLightPos, U.dirLightPos), e.rimLightPos = Le(e.rimLightPos, U.rimLightPos), e;
}
function Qe(i) {
  return i === "low" || i === "medium" || i === "high" ? i : U.qualityPreset;
}
function $e(i) {
  return {
    schemaVersion: fe,
    settings: he(i)
  };
}
function j(i, t) {
  if (typeof i != "string") return t;
  const e = i.trim();
  return Ke.test(e) ? e.toLowerCase() : t;
}
function P(i, t, e, n) {
  const a = Number(i);
  return Number.isFinite(a) ? Math.max(e, Math.min(n, a)) : t;
}
function Le(i, t) {
  const e = i && typeof i == "object" ? i : t;
  return {
    x: P(e.x, t.x, -1e3, 1e3),
    y: P(e.y, t.y, -1e3, 1e3),
    z: P(e.z, t.z, -1e3, 1e3)
  };
}
const ce = 1;
async function et(i = {}) {
  const t = i.container || document.body, e = i.enableDebugPanel !== !1;
  let n, a, l, s = !1, r, f, g, h = null, c = !1, d, y, b, m, L, o = he({
    ...U,
    ...i.config || {}
  });
  return ne(o), o.geoJsonUrl = K(o.geoJsonResolution), m = ze(t), m.setBackground(o.backgroundColor, o.transparentBackground), m.setPixelRatioMax(o.rendererPixelRatioMax), L = Ge(m.scene, o), await M(), e && await O(), w(), {
    setConfig: A,
    getConfig: E,
    destroy: V
  };
  async function x() {
    return d || (d = import("./createCountries-Dc1236KI.js").then((p) => p.loadCountries)), d;
  }
  async function C() {
    return y || (y = import("./controls-DLJLymkc.js").then((p) => p.DebugControls)), y;
  }
  async function M() {
    n = new _.Group(), m.scene.add(n), I(), S(o), v(), r = We(ce, 1.15, o.haloColor, 64), ee(r, o), r.renderOrder = 1, m.scene.add(r), v(), F(), b = Fe(n, m.renderer.domElement, o), await u(), G();
  }
  async function O() {
    const p = await C();
    a = new p(m.scene, m.renderer, n, {
      onReloadCountries: ie,
      onUpdateSelectedCountries: ve,
      onReloadGrid: xe,
      onUpdateLighting: Me,
      onUpdateEffects: _e,
      onUpdateSceneVisuals: Re,
      onUpdatePerformance: Pe,
      onUpdateRotationSettings: Oe,
      onImportConfig: (z) => void A(z),
      onRequestRuntimeState: ge
    }), a.applySettings(o), l && a.setGeojsonData(l);
  }
  function G() {
    c || (h = requestAnimationFrame(G), b && b.update(), R(), m.renderer.render(m.scene, m.camera));
  }
  async function A(p) {
    c || (o = he({
      ...o,
      ...p || {}
    }), ne(o), o.geoJsonUrl = K(o.geoJsonResolution), S(o), L.update(o), r && ee(r, o), w(), v(), I(), F(), a && a.applySettings(o), await u());
  }
  function E() {
    const p = ge();
    return $e({
      ...o,
      ...p
    });
  }
  async function u() {
    if (c || !n) return;
    if (s) {
      console.warn("Already loading countries, skipping reload...");
      return;
    }
    s = !0, D(), await (await x())(
      n,
      o.geoJsonUrl,
      o.highlightCodes,
      !1,
      o
    ).then((z) => {
      l = z, a && a.setGeojsonData(l);
    }).finally(() => {
      s = !1;
    });
  }
  function w() {
    b && b.setSettings(o);
  }
  function S(p) {
    n && (n.rotation.x = p.rotationX, n.rotation.y = p.rotationY);
  }
  function v() {
    if (m && (m.setBackground(o.backgroundColor, o.transparentBackground), m.setPixelRatioMax(o.rendererPixelRatioMax)), f && f.material) {
      f.material.color.setStyle(o.baseSphereColor);
      const p = o.baseSphereOpacity * o.globalOpacity;
      f.material.opacity = p, f.material.transparent = p < 1;
    }
    n && n.scale.setScalar(o.globeScale), r && r.scale.setScalar(1.15 * o.globeScale), k();
  }
  function I() {
    if (!n) return;
    f && (f.geometry.dispose(), f.material.dispose(), n.remove(f), f = null);
    const p = new _.SphereGeometry(ce, o.sphereSegments, o.sphereSegments), z = o.baseSphereOpacity * o.globalOpacity, q = new _.MeshStandardMaterial({
      color: o.baseSphereColor,
      roughness: 1,
      metalness: 0,
      transparent: z < 1,
      opacity: z
    });
    f = new _.Mesh(p, q), f.renderOrder = 0, n.add(f);
  }
  function F() {
    T(), qe(
      n,
      o.gridRadius,
      o.gridSpacing,
      o.gridSpacing,
      o.gridSegmentSize,
      o.gridColor
    ), n.traverse((p) => {
      p.type === "Line" && p.renderOrder === 2 && (p.material.opacity = o.gridOpacity * o.globalOpacity, p.material.transparent = p.material.opacity < 1, p.visible = o.showGrid);
    });
  }
  function k() {
    if (!m || (g && (g.geometry.dispose(), g.material.dispose(), m.scene.remove(g), g = null), !o.showCameraOutline)) return;
    const p = ce * o.globeScale * o.cameraOutlineRadiusFactor, z = o.cameraOutlineWidth, q = Math.max(p - z * 0.5, 1e-3), oe = p + z * 0.5, re = new _.RingGeometry(q, oe, 128), ae = new _.MeshBasicMaterial({
      color: o.cameraOutlineColor,
      transparent: !0,
      opacity: 1,
      side: _.DoubleSide,
      depthTest: !1,
      depthWrite: !1
    });
    g = new _.Mesh(re, ae), g.renderOrder = 1e3, m.scene.add(g);
  }
  function R() {
    !g || !n || (g.position.copy(n.position), g.quaternion.copy(m.camera.quaternion));
  }
  function D() {
    const p = [];
    n.traverse((z) => {
      (z.type === "Mesh" && z.renderOrder === 3 || z.type === "LineLoop" && z.renderOrder === 4) && p.push(z);
    }), p.forEach((z) => {
      z.geometry.dispose(), z.material.dispose(), n.remove(z);
    });
  }
  function T() {
    if (!n) return;
    const p = [];
    n.traverse((z) => {
      z.type === "Line" && z.renderOrder === 2 && p.push(z);
    }), p.forEach((z) => {
      z.geometry.dispose(), z.material.dispose(), n.remove(z);
    });
  }
  function N() {
    n && f && (f.geometry.dispose(), f.material.dispose(), n.remove(f), f = null);
  }
  function V() {
    c || (c = !0, h !== null && (cancelAnimationFrame(h), h = null), a && (a.destroy(), a = null), b && (b.destroy(), b = null), D(), T(), N(), r && (r.geometry && r.geometry.dispose(), r.material && r.material.dispose(), m.scene.remove(r), r = null), g && (g.geometry && g.geometry.dispose(), g.material && g.material.dispose(), m.scene.remove(g), g = null), n && (m.scene.remove(n), n = null), L && (L.destroy(), L = null), m && (m.destroy(), m = null));
  }
  function ie(p) {
    const {
      resolution: z,
      progressiveLoading: q,
      batchSize: oe,
      highlightColor: re,
      defaultColor: ae,
      outlineColor: Ie,
      outlineOpacity: Ee,
      selectedCountries: me
    } = p;
    o.geoJsonResolution = z, o.geoJsonUrl = K(), o.progressiveLoading = q, o.batchSize = oe, o.highlightColor = re, o.defaultColor = ae, o.outlineColor = Ie, o.outlineOpacity = Ee, me && (o.highlightCodes = [...me]), u();
  }
  function ve(p) {
    o.highlightCodes = [...p.selectedCountries], u();
  }
  function xe(p) {
    Object.assign(o, p), F();
  }
  function Me(p) {
    Object.assign(o, p), L.update(o);
  }
  function _e(p) {
    Object.assign(o, p), r && ee(r, o);
  }
  function Re(p) {
    Object.assign(o, p), v(), r && ee(r, o), (p.gridColor || p.gridSegmentSize || p.gridRadius || p.gridSpacing) && F(), p.globalOpacity !== void 0 && (F(), u());
  }
  function Pe(p) {
    Object.assign(o, p), ne(o), o.geoJsonUrl = K(o.geoJsonResolution), v(), I(), F(), u();
  }
  function Oe(p) {
    Object.assign(o, p), w();
  }
  function ge() {
    return n ? { rotationX: n.rotation.x, rotationY: n.rotation.y } : { rotationX: 0, rotationY: 0 };
  }
  function ne(p) {
    if (p.qualityPreset === "low") {
      p.rendererPixelRatioMax = 1, p.gridSegmentSize = 4, p.outlineDetail = 0.6, p.countryFillDetail = 2, p.sphereSegments = 48, p.progressiveLoading = !0, p.batchSize = 60, p.geoJsonResolution = "110m";
      return;
    }
    if (p.qualityPreset === "medium") {
      p.rendererPixelRatioMax = 1.5, p.gridSegmentSize = 2, p.outlineDetail = 0.85, p.countryFillDetail = 1.4, p.sphereSegments = 96, p.progressiveLoading = !0, p.batchSize = 40, p.geoJsonResolution === "10m" && (p.geoJsonResolution = "50m");
      return;
    }
    p.rendererPixelRatioMax = Math.max(2, p.rendererPixelRatioMax), p.gridSegmentSize = Math.min(p.gridSegmentSize, 2), p.outlineDetail = Math.max(1, p.outlineDetail), p.countryFillDetail = Math.min(p.countryFillDetail, 1), p.sphereSegments = Math.max(p.sphereSegments, 96), p.progressiveLoading = !0, p.batchSize = Math.min(p.batchSize, 20);
  }
}
export {
  U as D,
  fe as G,
  et as a,
  Ze as c,
  K as g,
  ue as l,
  he as m,
  Ve as s,
  $e as t
};
