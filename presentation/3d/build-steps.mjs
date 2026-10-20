// Builds one GLB per 3D slide from the public UroOps 3D spatial export (source/4.glb) plus schematic
// meshes made here from the UroOps geometry constants (geometry.mjs). Writes steps/<id>.glb and the
// resolved cameras back into steps.json. Run: node build-steps.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { prune } from '@gltf-transform/functions';
import {
  BoxGeometry, BufferGeometry, CatmullRomCurve3, Curve, Float32BufferAttribute, Matrix4, Quaternion,
  SphereGeometry, TorusGeometry, TubeGeometry, Vector3,
} from 'three';
import * as G from './geometry.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'source', '4.glb');
const OUT = path.join(HERE, 'steps');
const STEPS_JSON = path.join(HERE, 'steps.json');
const EMU_PER_M = 36_000_000;
const COPYRIGHT = 'Schematic teaching model from UroOps3D (Nity G). Atlas bones and bladder: Z-Anatomy / BodyParts3D, CC-BY-SA 4.0. Not patient-specific. Not a medical device.';

const io = new NodeIO();
const cfg = JSON.parse(fs.readFileSync(STEPS_JSON, 'utf8'));

/* ---------- palette (sRGB hex, alpha) ---------- */
const PALETTE = {
  Pubis: ['#e9e2d6', 1], Bladder: ['#d9b6ae', 0.35], Corpus_spongiosum: ['#c98f84', 0.7], Urethra: ['#b56a5e', 1],
  Crus: ['#a65a52', 1], Bulbospongiosus: ['#9a4a44', 1], Perineal_body: ['#b98c7a', 1], Skin: ['#e7c9b5', 0.55],
  Incision: ['#7a2e2a', 1], Testis: ['#dcc2b0', 1], Abdominal_wall: ['#e7c9b5', 0.35], Retzius: ['#efe3b8', 0.25],
  Cuff_shell: ['#dfe3df', 0.45], Cuff_solid: ['#dfe3df', 1], Cuff_lip: ['#cfd6d2', 1], Lumen: ['#69ccb5', 1],
  Balloon: ['#d4e6f4', 0.5], Balloon_solid: ['#d4e6f4', 0.85], Pump: ['#dfe8ec', 1], Tubing: ['#e8f0f2', 1],
  Stripe_cuff: ['#2f6ccc', 1], Stripe_balloon: ['#2b2f34', 1], Connector: ['#b8c4c8', 1], Catheter: ['#d9a441', 1],
  Sizer: ['#e0a030', 1], Clamp_steel: ['#6b7680', 1], Clamp_rubber: ['#3a3f44', 1], Anchor: ['#ffffff', 0],
};
const PART_CLASS = {
  Pubis_L: 'Pubis', Pubis_R: 'Pubis', Bladder: 'Bladder', Corpus_spongiosum: 'Corpus_spongiosum', Urethra: 'Urethra',
  Crus_L: 'Crus', Crus_R: 'Crus', Bulbospongiosus: 'Bulbospongiosus', Bulbospongiosus_L: 'Bulbospongiosus',
  Bulbospongiosus_R: 'Bulbospongiosus', Perineal_body: 'Perineal_body', Perineal_skin: 'Skin', Penile_skin: 'Skin',
  Scrotum_shell: 'Skin', Perineal_incision: 'Incision', Wall_incision: 'Incision', Testis_L: 'Testis', Testis_R: 'Testis',
  Abdominal_wall: 'Abdominal_wall', Retzius: 'Retzius', Cuff_shell: 'Cuff_shell', Cuff_band: 'Cuff_shell',
  Cuff_lip: 'Cuff_lip', Cuff_tab: 'Cuff_solid', Cuff_port: 'Cuff_solid', Lumen: 'Lumen', Balloon_shell: 'Balloon',
  Balloon_disc: 'Balloon', Balloon_stem: 'Balloon_solid', Balloon_collar: 'Balloon_solid', Pump_body: 'Pump',
  Pump_valve: 'Pump', Pump_button: 'Pump', Pump_bulb: 'Pump', Pump_port_balloon: 'Pump', Pump_port_cuff: 'Pump',
  Tubing_cuff: 'Tubing', Tubing_balloon: 'Tubing', Tubing_cuff_stub: 'Tubing', Tubing_balloon_stub: 'Tubing',
  Tubing_pump_stubs: 'Tubing', Connector_cuff: 'Connector', Connector_balloon: 'Connector', Catheter: 'Catheter',
  Sizer: 'Sizer', Frame_anchor: 'Anchor',
};
const RENAME = {
  AUS_spatial: 'AUS_teaching_model', Bladder_0: 'Bladder', HipBone_L_1: 'Pubis_L', HipBone_R_2: 'Pubis_R', Outlet_3: 'Outlet',
  Lumen_path_8: 'Urethra', Crus_9: 'Crus_L', Crus_10: 'Crus_R', Penile_skin_11: 'Penile_skin', Scrotum_12: 'Scrotum_shell',
  Testis_13: 'Testis_L', Testis_14: 'Testis_R', Cuff_15: 'Cuff_shell', Cuff_16: 'Cuff_band', Cuff_lip: 'Cuff_lip',
  Cuff_18: 'Cuff_tab', Cuff_19: 'Cuff_port', Balloon_20: 'Balloon_shell', Balloon_21: 'Balloon_disc', Balloon_22: 'Balloon_stem',
  Balloon_23: 'Balloon_collar', Pump_24: 'Pump_body', Pump_25: 'Pump_valve', Pump_26: 'Pump_button', Pump_bulb: 'Pump_bulb',
  Pump_28: 'Pump_port_balloon', Pump_29: 'Pump_port_cuff', Tubing_cuff_30: 'Tubing_cuff', Tubing_balloon_31: 'Tubing_balloon',
  Tubing_cuff_32: 'Connector_cuff', Tubing_balloon_33: 'Connector_balloon', Lumen: 'Lumen',
};
const GROUPS = {
  Cuff: ['Cuff_shell', 'Cuff_band', 'Cuff_lip', 'Cuff_tab', 'Cuff_port'],
  Balloon: ['Balloon_shell', 'Balloon_disc', 'Balloon_stem', 'Balloon_collar'],
  Pump: ['Pump_body', 'Pump_valve', 'Pump_button', 'Pump_bulb', 'Pump_port_balloon', 'Pump_port_cuff'],
};

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const hexLinear = (h) => [1, 3, 5].map((i) => srgbToLinear(parseInt(h.slice(i, i + 2), 16) / 255));
const V3 = (a) => new Vector3(a[0], a[1], a[2]);

/* ---------- three.js geometry helpers ---------- */
function toArrays(geo) {
  const g = geo.index ? geo : geo;
  if (!g.attributes.normal) g.computeVertexNormals();
  return {
    position: new Float32Array(g.attributes.position.array),
    normal: new Float32Array(g.attributes.normal.array),
    index: g.index ? new Uint32Array(g.index.array) : null,
  };
}
function mergeArrays(list) {
  let nv = 0; let ni = 0;
  for (const a of list) { nv += a.position.length / 3; ni += a.index ? a.index.length : a.position.length / 3; }
  const position = new Float32Array(nv * 3); const normal = new Float32Array(nv * 3); const index = new Uint32Array(ni);
  let vo = 0; let io2 = 0;
  for (const a of list) {
    position.set(a.position, vo * 3); normal.set(a.normal, vo * 3);
    const n = a.position.length / 3;
    const idx = a.index ?? Uint32Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < idx.length; i += 1) index[io2 + i] = idx[i] + vo;
    vo += n; io2 += idx.length;
  }
  return { position, normal, index };
}
function frameAt(u) {
  const t = G.urethraTangent(u); const n = G.urethraVentral(u);
  return { c: G.urethraAt(u), t, n, x: G.LATERAL.clone() };
}
/* a shell around the spongiosum: angles in degrees, 0 = patient left (+X), 90 = ventral */
function sleeve(u0, u1, th0, th1, extra, rotate = 0, nu = 48, nt = 28) {
  const pos = []; const idx = [];
  for (let i = 0; i <= nu; i += 1) {
    const u = u0 + ((u1 - u0) * i) / nu;
    const f = frameAt(u);
    const centre = f.c.clone().addScaledVector(f.n, G.spongiosumVentralShift(u));
    const taper = Math.sin(Math.PI * Math.min(1, Math.max(0, i / nu))) ** 0.35;
    const r = G.spongiosumRadius(u) + 0.0012 + extra * taper;
    for (let j = 0; j <= nt; j += 1) {
      const th = ((th0 + ((th1 - th0) * j) / nt + rotate) * Math.PI) / 180;
      const p = centre.clone().addScaledVector(f.x, r * Math.cos(th)).addScaledVector(f.n, r * Math.sin(th));
      pos.push(p.x, p.y, p.z);
    }
  }
  for (let i = 0; i < nu; i += 1) for (let j = 0; j < nt; j += 1) {
    const a = i * (nt + 1) + j; const b = a + nt + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return toArrays(g);
}
function ellipsoid(centre, radii, seg = 24) {
  const g = new SphereGeometry(1, seg, Math.round(seg * 0.75));
  g.applyMatrix4(new Matrix4().makeScale(...radii)); g.translate(...centre); g.computeVertexNormals();
  return toArrays(g);
}
function tube(points, radius, tubular = 64, radial = 10, closed = false) {
  const curve = new CatmullRomCurve3(points.map(V3), closed, 'catmullrom', 0.5);
  return toArrays(new TubeGeometry(curve, tubular, radius, radial, closed));
}
function orientedBox(centre, xAxis, yAxis, size) {
  const g = new BoxGeometry(...size);
  const x = xAxis.clone().normalize(); const y = yAxis.clone().addScaledVector(x, -yAxis.dot(x)).normalize();
  const z = new Vector3().crossVectors(x, y);
  g.applyMatrix4(new Matrix4().makeBasis(x, y, z).setPosition(V3(centre)));
  return toArrays(g.toNonIndexed());
}
/* a ribbon along one side of a tube whose vertices come in rings of (radial + 1) */
function stripeFromRings(position, ringSize, sides = [0, Math.floor((ringSize - 1) / 2)]) {
  const rings = position.length / 3 / ringSize;
  const out = [];
  for (const k of sides) {
    const pos = []; const idx = [];
    for (let i = 0; i < rings; i += 1) {
      const base = i * ringSize;
      const c = new Vector3();
      for (let j = 0; j < ringSize - 1; j += 1) c.add(new Vector3().fromArray(position, (base + j) * 3));
      c.multiplyScalar(1 / (ringSize - 1));
      const v0 = new Vector3().fromArray(position, (base + k) * 3);
      const v1 = new Vector3().fromArray(position, (base + ((k + 1) % (ringSize - 1))) * 3);
      const r = v0.distanceTo(c);
      const a = c.clone().add(v0.clone().sub(c).setLength(r * 1.1));
      const mid = v0.clone().add(v1).multiplyScalar(0.5).sub(c).setLength(r * 1.1);
      const b = c.clone().add(mid);
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      if (i > 0) { const p = (i - 1) * 2; idx.push(p, p + 2, p + 1, p + 1, p + 2, p + 3); }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    out.push(toArrays(g));
  }
  return mergeArrays(out);
}
/* the first or last `length` metres of a ring-structured tube, as its own mesh */
function sliceRings(position, normal, ringSize, length, fromEnd) {
  const rings = position.length / 3 / ringSize;
  const centres = [];
  for (let i = 0; i < rings; i += 1) {
    const c = new Vector3();
    for (let j = 0; j < ringSize - 1; j += 1) c.add(new Vector3().fromArray(position, (i * ringSize + j) * 3));
    centres.push(c.multiplyScalar(1 / (ringSize - 1)));
  }
  const order = fromEnd ? [...Array(rings).keys()].reverse() : [...Array(rings).keys()];
  let acc = 0; const keep = [order[0]];
  for (let k = 1; k < order.length && acc < length; k += 1) { acc += centres[order[k]].distanceTo(centres[order[k - 1]]); keep.push(order[k]); }
  keep.sort((a, b) => a - b);
  const pos = []; const nor = []; const idx = [];
  keep.forEach((ri) => { for (let j = 0; j < ringSize; j += 1) { const o = (ri * ringSize + j) * 3; pos.push(position[o], position[o + 1], position[o + 2]); nor.push(normal[o], normal[o + 1], normal[o + 2]); } });
  for (let i = 0; i < keep.length - 1; i += 1) for (let j = 0; j < ringSize - 1; j += 1) {
    const a = i * ringSize + j; const b = a + ringSize;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  return { position: new Float32Array(pos), normal: new Float32Array(nor), index: new Uint32Array(idx) };
}

/* ---------- schematic meshes (metres, atlas frame) ---------- */
function proceduralMeshes(src) {
  const m = {};
  // bulbospongiosus: intact (open dorsally) and split along the ventral raphe into two retracted halves
  m.Bulbospongiosus = sleeve(0.10, 0.42, -45, 225, 0.0004);
  m.Bulbospongiosus_L = sleeve(0.10, 0.42, -45, 84, 0.0034, -38);
  m.Bulbospongiosus_R = sleeve(0.10, 0.42, 96, 225, 0.0034, 38);
  m.Perineal_body = ellipsoid(G.PERINEAL_BODY, [0.007, 0.0045, 0.0055]);
  // perineal skin patch, gently curved, and the midline incision over the cuff site
  {
    const C = V3(G.PERINEAL_SKIN.centre); const n = V3(G.PERINEAL_SKIN.normal); const t = V3(G.PERINEAL_SKIN.along); const x = G.LATERAL.clone();
    const pos = []; const idx = []; const NA = 30; const NL = 24; const LA = 0.078; const LW = 0.062;
    for (let i = 0; i <= NA; i += 1) for (let j = 0; j <= NL; j += 1) {
      const a = -LA / 2 + (LA * i) / NA; const w = -LW / 2 + (LW * j) / NL;
      const p = C.clone().addScaledVector(t, a).addScaledVector(x, w).addScaledVector(n, -(w * w) / (2 * 0.05) - (a * a) / (2 * 0.12));
      pos.push(p.x, p.y, p.z);
    }
    for (let i = 0; i < NA; i += 1) for (let j = 0; j < NL; j += 1) { const a = i * (NL + 1) + j; const b = a + NL + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    m.Perineal_skin = toArrays(g);
    const q = G.urethraAt(G.U.cuff); const along = (q.clone().sub(C)).dot(t);
    const centre = C.clone().addScaledVector(t, along).addScaledVector(n, -(along * along) / (2 * 0.12) + 0.0004);
    m.Perineal_incision = orientedBox(centre.toArray(), t, x, [G.INCISION_LENGTH, 0.0016, 0.0008]);
  }
  // sizer: a ring round the proximal bulbar urethra at the free circumference, plus its tab
  {
    const R = G.spongiosumRadius(G.U.cuff) + 0.001;
    const g = new TorusGeometry(R, 0.0006, 10, 64);
    const q = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), V3(G.CUFF_DIR).normalize());
    g.applyQuaternion(q); g.translate(...G.CUFF_AT);
    const ring = toArrays(g);
    const tab = orientedBox([G.CUFF_AT[0] + R + 0.006, G.CUFF_AT[1], G.CUFF_AT[2]], new Vector3(1, 0, 0), V3(G.CUFF_DIR), [0.012, 0.003, 0.0008]);
    m.Sizer = mergeArrays([ring, tab]);
  }
  // urethral catheter: bladder balloon, through the urethra, out of the meatus
  {
    const tEnd = G.urethraTangent(1); const meatus = G.urethraAt(1);
    const pts = [[0, -0.016, 0.0], [0, -0.03, 0.001], ...G.URETHRA_PATH,
      meatus.clone().addScaledVector(tEnd, 0.015).toArray(), meatus.clone().addScaledVector(tEnd, 0.035).toArray()];
    m.Catheter = mergeArrays([tube(pts, 0.0009, 220, 8), ellipsoid([0, -0.016, 0.0], [0.0045, 0.0045, 0.0045], 16)]);
  }
  // lower abdominal wall: a sheet bent round a vertical axis, with a slot for the incision
  {
    const pos = []; const idx = []; const NX = 85; const NY = 36; const W = G.WALL.width; const H = G.WALL.height;
    const y0 = G.WALL.centre[1] - H / 2; const [ix, iy] = G.WALL_INCISION;
    const vid = (i, j) => i * (NY + 1) + j;
    for (let i = 0; i <= NX; i += 1) for (let j = 0; j <= NY; j += 1) {
      const x = -W / 2 + (W * i) / NX; const y = y0 + (H * j) / NY; pos.push(x, y, G.wallZ(x));
    }
    for (let i = 0; i < NX; i += 1) for (let j = 0; j < NY; j += 1) {
      const cx = -W / 2 + (W * (i + 0.5)) / NX; const cy = y0 + (H * (j + 0.5)) / NY;
      if (((cx - ix) / 0.015) ** 2 + ((cy - iy) / 0.003) ** 2 < 1) continue;
      idx.push(vid(i, j), vid(i + 1, j), vid(i, j + 1), vid(i + 1, j), vid(i + 1, j + 1), vid(i, j + 1));
    }
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    m.Abdominal_wall = toArrays(g);
    class Slot extends Curve { getPoint(s, out = new Vector3()) { const a = s * Math.PI * 2; const x = ix + 0.015 * Math.cos(a); return out.set(x, iy + 0.003 * Math.sin(a), G.wallZ(x) + 0.0006); } }
    m.Wall_incision = toArrays(new TubeGeometry(new Slot(), 64, 0.0006, 6, true));
  }
  m.Retzius = ellipsoid(G.PRB_AT, [0.022, 0.016, 0.016]);
  // stubs cut from the real tubing, so they coincide exactly with the full lines on later slides
  const tc = src.Tubing_cuff; const tb = src.Tubing_balloon;
  m.Tubing_cuff_stub = sliceRings(tc.position, tc.normal, 7, 0.026, false);
  m.Tubing_balloon_stub = sliceRings(tb.position, tb.normal, 7, 0.026, false);
  m.Tubing_pump_stubs = mergeArrays([sliceRings(tc.position, tc.normal, 7, 0.014, true), sliceRings(tb.position, tb.normal, 7, 0.014, true)]);
  m.stripes = {
    Tubing_cuff: stripeFromRings(tc.position, 7), Tubing_balloon: stripeFromRings(tb.position, 7),
    Tubing_cuff_stub: stripeFromRings(m.Tubing_cuff_stub.position, 7), Tubing_balloon_stub: stripeFromRings(m.Tubing_balloon_stub.position, 7),
    Tubing_pump_stubs_cuff: stripeFromRings(sliceRings(tc.position, tc.normal, 7, 0.014, true).position, 7),
    Tubing_pump_stubs_balloon: stripeFromRings(sliceRings(tb.position, tb.normal, 7, 0.014, true).position, 7),
  };
  // rubber-shod clamp across the balloon tubing, just outside the balloon stem
  {
    const C = V3(G.FOCUS.Clamp); const along = V3(G.TUBE_PRB_VIA.points[0]).sub(C).normalize();
    const across = new Vector3(1, 0, 0).addScaledVector(along, -along.x).normalize();
    const up = new Vector3().crossVectors(along, across).normalize();
    const jawA = orientedBox(C.clone().addScaledVector(up, 0.0021).toArray(), across, along, [0.010, 0.0022, 0.0018]);
    const jawB = orientedBox(C.clone().addScaledVector(up, -0.0021).toArray(), across, along, [0.010, 0.0022, 0.0018]);
    const handleDir = across.clone().multiplyScalar(-1);
    const hA = orientedBox(C.clone().addScaledVector(up, 0.0016).addScaledVector(handleDir, 0.017).toArray(), handleDir, along, [0.024, 0.0012, 0.0012]);
    const hB = orientedBox(C.clone().addScaledVector(up, -0.0016).addScaledVector(handleDir, 0.017).toArray(), handleDir, along, [0.024, 0.0012, 0.0012]);
    m.Clamp_rubber = mergeArrays([jawA, jawB]);
    m.Clamp_steel = mergeArrays([hA, hB]);
  }
  return m;
}

/* ---------- gltf-transform helpers ---------- */
function makeMaterial(doc, cls, alpha) {
  const [hex, baseA] = PALETTE[cls];
  const a = alpha ?? baseA;
  const mat = doc.createMaterial(`${cls}${a < 1 ? `_a${Math.round(a * 100)}` : ''}`)
    .setBaseColorFactor([...hexLinear(hex), a]).setMetallicFactor(0).setRoughnessFactor(0.72).setDoubleSided(true)
    .setAlphaMode(a < 1 ? 'BLEND' : 'OPAQUE');
  return mat;
}
function addPrim(doc, buffer, mesh, arrays, material) {
  // degenerate triangles leave zero-length normals; give them a unit normal so the glTF validates
  for (let i = 0; i < arrays.normal.length; i += 3) {
    const l = Math.hypot(arrays.normal[i], arrays.normal[i + 1], arrays.normal[i + 2]);
    if (!(l > 1e-6)) { arrays.normal[i] = 0; arrays.normal[i + 1] = 1; arrays.normal[i + 2] = 0; } else if (Math.abs(l - 1) > 1e-4) { arrays.normal[i] /= l; arrays.normal[i + 1] /= l; arrays.normal[i + 2] /= l; }
  }
  const p = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arrays.position).setBuffer(buffer))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(arrays.normal).setBuffer(buffer))
    .setMaterial(material);
  if (arrays.index) {
    const big = arrays.position.length / 3 > 65535;
    p.setIndices(doc.createAccessor().setType('SCALAR').setArray(big ? arrays.index : new Uint16Array(arrays.index)).setBuffer(buffer));
  }
  mesh.addPrimitive(p);
  return p;
}
function sampleChannel(channel, t) {
  const s = channel.getSampler();
  const inp = s.getInput().getArray(); const out = s.getOutput().getArray();
  const n = out.length / inp.length;
  let i = 0; while (i < inp.length - 2 && inp[i + 1] < t) i += 1;
  const k = Math.min(1, Math.max(0, (t - inp[i]) / (inp[i + 1] - inp[i])));
  return Array.from({ length: n }, (_, c) => out[i * n + c] * (1 - k) + out[(i + 1) * n + c] * k);
}
function arraysOf(node) {
  const prim = node.getMesh().listPrimitives()[0];
  return { position: prim.getAttribute('POSITION').getArray(), normal: prim.getAttribute('NORMAL').getArray() };
}

async function buildStep(step, anchorBox) {
  const doc = await io.read(SRC);
  const root = doc.getRoot();
  const buffer = root.listBuffers()[0];
  const scene = root.listScenes()[0];
  const top = scene.listChildren()[0];
  const byName = {};
  for (const n of root.listNodes()) { const nn = RENAME[n.getName()] ?? n.getName(); n.setName(nn); byName[nn] = n; }

  // merge the four spongiosum segments into one node
  const spong = doc.createMesh('Corpus_spongiosum');
  for (const n of root.listNodes().filter((x) => /^Urethra_\d+$/.test(x.getName()))) {
    for (const p of n.getMesh().listPrimitives()) spong.addPrimitive(p);
    n.dispose();
  }
  byName.Corpus_spongiosum = doc.createNode('Corpus_spongiosum').setMesh(spong);
  top.addChild(byName.Corpus_spongiosum);
  for (const [gname, kids] of Object.entries(GROUPS)) {
    const g = doc.createNode(gname); top.addChild(g); byName[gname] = g;
    for (const k of kids) g.addChild(byName[k]);
  }

  // schematic meshes
  const src = { Tubing_cuff: arraysOf(byName.Tubing_cuff), Tubing_balloon: arraysOf(byName.Tubing_balloon) };
  const proc = proceduralMeshes(src);
  const mats = {};
  const mat = (cls, a) => { const key = `${cls}|${a}`; mats[key] ??= makeMaterial(doc, cls, a); return mats[key]; };
  const procNames = ['Bulbospongiosus', 'Bulbospongiosus_L', 'Bulbospongiosus_R', 'Perineal_body', 'Perineal_skin', 'Perineal_incision',
    'Sizer', 'Catheter', 'Abdominal_wall', 'Wall_incision', 'Retzius', 'Tubing_cuff_stub', 'Tubing_balloon_stub', 'Tubing_pump_stubs'];
  for (const name of procNames) {
    const mesh = doc.createMesh(name);
    addPrim(doc, buffer, mesh, proc[name], mat(PART_CLASS[name]));
    byName[name] = doc.createNode(name).setMesh(mesh); top.addChild(byName[name]);
  }
  {
    const mesh = doc.createMesh('Clamp');
    addPrim(doc, buffer, mesh, proc.Clamp_rubber, mat('Clamp_rubber'));
    addPrim(doc, buffer, mesh, proc.Clamp_steel, mat('Clamp_steel'));
    byName.Clamp = doc.createNode('Clamp').setMesh(mesh); top.addChild(byName.Clamp);
  }

  // materials by part and step opacity
  const op = step.opacity ?? {};
  const groupOf = (name) => Object.keys(GROUPS).find((g) => GROUPS[g].includes(name));
  for (const [name, node] of Object.entries(byName)) {
    const mesh = node.getMesh(); if (!mesh || !PART_CLASS[name]) continue;
    const cls = PART_CLASS[name];
    const over = op[name] ?? op[groupOf(name)];
    const a = over === undefined ? undefined : Math.min(over, PALETTE[cls][1]);
    for (const p of mesh.listPrimitives()) {
      if (p.getMaterial()?.getName()?.startsWith('Clamp_')) continue;
      p.setMaterial(mat(cls, a));
    }
  }
  // stripes on the tubing (blue to the cuff, dark to the balloon)
  const stripe = (node, arrays, cls) => addPrim(doc, buffer, node.getMesh(), arrays, mat(cls, op[node.getName()]));
  stripe(byName.Tubing_cuff, proc.stripes.Tubing_cuff, 'Stripe_cuff');
  stripe(byName.Tubing_balloon, proc.stripes.Tubing_balloon, 'Stripe_balloon');
  stripe(byName.Tubing_cuff_stub, proc.stripes.Tubing_cuff_stub, 'Stripe_cuff');
  stripe(byName.Tubing_balloon_stub, proc.stripes.Tubing_balloon_stub, 'Stripe_balloon');
  stripe(byName.Tubing_pump_stubs, proc.stripes.Tubing_pump_stubs_cuff, 'Stripe_cuff');
  stripe(byName.Tubing_pump_stubs, proc.stripes.Tubing_pump_stubs_balloon, 'Stripe_balloon');

  // the scrotum and testes swing forward about the penoscrotal root for the perineal steps
  if (step.state.scrotalLift) {
    const P = V3(G.SCROTAL_PIVOT);
    const lift = new Matrix4().makeTranslation(P.x, P.y, P.z).multiply(new Matrix4().makeRotationX(G.SCROTAL_LIFT)).multiply(new Matrix4().makeTranslation(-P.x, -P.y, -P.z));
    for (const name of ['Scrotum_shell', 'Testis_L', 'Testis_R']) {
      const n = byName[name];
      const m = lift.clone().multiply(new Matrix4().fromArray(n.getMatrix()));
      const t = new Vector3(); const q = new Quaternion(); const s = new Vector3();
      // decompose rotation and translation exactly; scale stays the node's own (rotation is applied after it)
      t.setFromMatrixPosition(m);
      const R = new Matrix4().makeRotationX(G.SCROTAL_LIFT);
      q.setFromRotationMatrix(R).multiply(new Quaternion(...n.getRotation()));
      s.fromArray(n.getScale());
      n.setTranslation(t.toArray()).setRotation(q.toArray()).setScale(s.toArray());
    }
  }

  // device state sampled from the Cycle AUS animation (slide 32: cuff open, pump squeezed)
  const anim = root.listAnimations()[0];
  if (step.state.cycle) {
    for (const ch of anim.listChannels()) {
      const nm = ch.getTargetNode().getName();
      if (step.state.cycle[nm] !== undefined) ch.getTargetNode().setScale(sampleChannel(ch, step.state.cycle[nm]));
    }
  }
  if (!step.state.keepAnimation) for (const a of root.listAnimations()) a.dispose();
  else anim.setName('Cycle AUS');

  // keep only this step's nodes (groups keep their children)
  const keep = new Set(step.nodes);
  for (const [name, node] of Object.entries(byName)) {
    if (node === top || keep.has(name) || keep.has(groupOf(name))) continue;
    if (node.isDisposed?.()) continue;
    node.dispose();
  }
  for (const n of root.listNodes()) if (n.getName() === 'Outlet') n.dispose();

  // the shared scene frame: two degenerate triangles at the union bounding box corners
  if (anchorBox) {
    const { min, max } = anchorBox;
    const position = new Float32Array([...min, ...min, ...min, ...max, ...max, ...max]);
    const normal = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
    const mesh = doc.createMesh('Frame_anchor');
    addPrim(doc, buffer, mesh, { position, normal, index: null }, mat('Anchor'));
    top.addChild(doc.createNode('Frame_anchor').setMesh(mesh));
  }
  await doc.transform(prune({ keepLeaves: false, keepAttributes: false }));
  const asset = root.getAsset();
  asset.copyright = COPYRIGHT;
  asset.generator = 'AUS teaching deck build-steps.mjs (gltf-transform 4.4.0, three r186)';
  asset.extras = { attribution: COPYRIGHT, source: 'https://uroops3d.com/models/aus-spatial/4.glb', step: step.id, slide: step.slide, notPatientSpecific: true };
  scene.setName(step.id);
  return doc;
}

function triangles(doc) {
  let t = 0;
  for (const n of doc.getRoot().listNodes()) {
    const m = n.getMesh(); if (!m) continue;
    for (const p of m.listPrimitives()) t += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3;
  }
  return t;
}

/* pass 1: union bounds over every step */
const min = [Infinity, Infinity, Infinity]; const max = [-Infinity, -Infinity, -Infinity];
for (const step of cfg.slides) {
  const doc = await buildStep(step, null);
  const b = getBounds(doc.getRoot().listScenes()[0]);
  for (let i = 0; i < 3; i += 1) { min[i] = Math.min(min[i], b.min[i]); max[i] = Math.max(max[i], b.max[i]); }
}
const pad = 0.002;
const box = { min: min.map((v) => v - pad), max: max.map((v) => v + pad) };
const centre = box.min.map((v, i) => (v + box.max[i]) / 2);
const maxHalf = Math.max(...box.min.map((v, i) => (box.max[i] - v) / 2));
const mpu = 1 / (2 * maxHalf);
const emu = (p) => p.map((v, i) => Math.round((v - centre[i]) * mpu * EMU_PER_M));

/* pass 2: write each step with the shared anchor, and resolve its camera */
fs.mkdirSync(OUT, { recursive: true });
const report = [];
for (const step of cfg.slides) {
  const doc = await buildStep(step, box);
  const b = getBounds(doc.getRoot().listScenes()[0]);
  const file = path.join(OUT, `${step.id}.glb`);
  await io.write(file, doc);
  const focus = G.FOCUS[step.camera.focus];
  const cam = G.solve(focus, step.camera.az, step.camera.el, step.camera.mm, false);
  step.camera.resolved = {
    focusMetres: focus.map((v) => +v.toFixed(6)),
    posMetres: cam.pos.map((v) => +v.toFixed(6)),
    distanceMetres: +cam.distance.toFixed(6),
    up: [0, 1, 0],
    fovDegrees: G.FOV_DEG,
    am3d: { pos: emu(cam.pos), lookAt: emu(focus), up: [0, EMU_PER_M, 0], fov: G.FOV_DEG * 60000 },
  };
  const size = fs.statSync(file).size;
  const nodes = doc.getRoot().listNodes().map((n) => n.getName());
  report.push({ id: step.id, bytes: size, triangles: triangles(doc), nodes: nodes.length, animations: doc.getRoot().listAnimations().length, bounds: [b.min.map((v) => +v.toFixed(5)), b.max.map((v) => +v.toFixed(5))] });
}
cfg.sceneFrame = {
  note: 'Union bounding box of all step GLBs (metres), shared through the Frame_anchor node. am3d trans uses meterPerModelUnit = 1/(2*maxHalf) and preTrans = -centre*mpu*36e6 EMU, as PowerPoint does on insert.',
  min: box.min.map((v) => +v.toFixed(6)), max: box.max.map((v) => +v.toFixed(6)), centre: centre.map((v) => +v.toFixed(6)),
  meterPerModelUnit: +mpu.toFixed(6), emuPerMetre: EMU_PER_M,
};
fs.writeFileSync(STEPS_JSON, `${JSON.stringify(cfg, null, 2)}\n`);
console.table(report.map(({ bounds, ...r }) => r));
console.log(JSON.stringify(report.map((r) => [r.id, r.bounds])));
