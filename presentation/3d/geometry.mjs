/* AUS schematic geometry, in metres, atlas frame (+X patient left, +Y superior, +Z anterior,
   bladder centre at the origin). Constants and curve functions are transcribed by reading
   UroOps3D src/components/procedures/aus/geometry.ts and src/components/procedures/pelvis/AusScene.tsx
   (read-only access authorised by Nity on 8 October 2026). Nothing was copied or run from that
   checkout. These are schematic teaching points, not measured or recommended values. */
import { CatmullRomCurve3, Vector3 } from 'three';

const v = (p) => new Vector3(p[0], p[1], p[2]);
export const LATERAL = new Vector3(1, 0, 0);

export const URETHRA_PATH = [
  [0, -0.047, 0.004], [0, -0.0555, 0.0155], [0, -0.0645, 0.0278], [0, -0.0735, 0.0400],
  [0, -0.0830, 0.0530], [0, -0.0925, 0.0660], [0, -0.1010, 0.0765], [0, -0.1110, 0.0835],
  [0, -0.1245, 0.0905], [0, -0.1390, 0.0960], [0, -0.1530, 0.0990],
];
export const URETHRA_CURVE = new CatmullRomCurve3(URETHRA_PATH.map(v), false, 'catmullrom', 0.5);

export const U = { membranousEnd: 0.08, bulbPeak: 0.15, bulbEnd: 0.23, cuff: 0.30, robustEnd: 0.40, crusJoin: 0.43, bend: 0.58, glansStart: 0.86, distalSite: 0.56 };

export const urethraAt = (u, out = new Vector3()) => URETHRA_CURVE.getPointAt(Math.min(1, Math.max(0, u)), out);
export const urethraTangent = (u, out = new Vector3()) => URETHRA_CURVE.getTangentAt(Math.min(1, Math.max(0, u)), out).normalize();
export const urethraVentral = (u, out = new Vector3()) => out.crossVectors(LATERAL, urethraTangent(u)).normalize();

export function spongiosumRadius(u) {
  if (u < U.membranousEnd) return 0.0036;
  if (u < U.bulbPeak) {
    const k = (u - U.membranousEnd) / (U.bulbPeak - U.membranousEnd);
    return 0.0036 + (0.0118 - 0.0036) * Math.sin((k * Math.PI) / 2);
  }
  if (u < U.bulbEnd) {
    const k = (u - U.bulbPeak) / (U.bulbEnd - U.bulbPeak);
    return 0.0118 + (0.0068 - 0.0118) * (0.5 - 0.5 * Math.cos(k * Math.PI));
  }
  if (u < U.robustEnd) return 0.0068;
  if (u < U.glansStart) {
    const k = (u - U.robustEnd) / (U.glansStart - U.robustEnd);
    return 0.0068 + (0.0056 - 0.0068) * k;
  }
  const k = (u - U.glansStart) / (1 - U.glansStart);
  if (k < 0.4) return 0.0056 + (0.0120 - 0.0056) * (0.5 - 0.5 * Math.cos((k / 0.4) * Math.PI));
  const c = (k - 0.4) / 0.6;
  return Math.max(0.0008, 0.0120 * Math.sqrt(Math.max(0, 1 - c * c)));
}
export function spongiosumVentralShift(u) {
  if (u >= U.glansStart) {
    const k = (u - U.glansStart) / (1 - U.glansStart);
    return -0.0048 * Math.sin(Math.min(1, k * 1.6) * (Math.PI / 2)) * (1 - 0.5 * k * k);
  }
  if (u <= U.membranousEnd || u >= U.bulbEnd) return 0;
  const k = (u - U.membranousEnd) / (U.bulbEnd - U.membranousEnd);
  return 0.0036 * Math.sin(k * Math.PI);
}

export const CUFF_AT = urethraAt(U.cuff).toArray();
export const CUFF_DIR = urethraTangent(U.cuff).toArray();
export const PERINEAL_BODY = [0, -0.0655, 0.0020];
export const PERINEAL_SKIN = (() => {
  const u = (U.bulbPeak + U.cuff) / 2;
  const c = urethraAt(u);
  const n = urethraVentral(u);
  return { centre: c.addScaledVector(n, 0.024).toArray(), normal: n.toArray(), along: urethraTangent(u).toArray() };
})();
export const INCISION_LENGTH = 0.042;
export const SCROTUM = { centre: [0, -0.1410, 0.0570], radii: [0.0340, 0.0340, 0.0270] };
export const PUMP_POCKET = [0.0195, -0.1505, 0.0650];
export const WALL = { centre: [0, 0.036, 0.070], width: 0.17, height: 0.072, bend: 0.16 };
export const wallZ = (x) => WALL.centre[2] - (x * x) / (2 * WALL.bend);
export const WALL_INCISION = [0.024, 0.017, wallZ(0.024)];
export const PRB_AT = [0.0215, 0.0145, 0.0385];
export const TUBE_CUFF_VIA = { points: [[0.0205, -0.0800, 0.0470], [0.0262, -0.0950, 0.0560], [0.0245, -0.1120, 0.0610], [0.0185, -0.1245, 0.0635]], connector: 2 };
export const TUBE_PRB_VIA = { points: [[0.0290, -0.0020, 0.0600], [0.0305, -0.0150, 0.0680], [0.0312, -0.0400, 0.0740], [0.0285, -0.0750, 0.0780], [0.0245, -0.1050, 0.0755], [0.0180, -0.1235, 0.0700]], connector: 4 };
export const SCROTAL_PIVOT = [0, -0.1, 0.06];
export const SCROTAL_LIFT = -0.95;

/* AusScene.tsx focus points (presented units divided back to metres) */
export const FOCUS = {
  Lithotomy: [0, -0.08, 0.03],
  Bulb: CUFF_AT,
  Retzius: PRB_AT,
  Scrotum: PUMP_POCKET,
  Device: [0.02, -0.07, 0.06],
  Clamp: [0.0262, 0.0006, 0.0566],
  CuffPort: [CUFF_AT[0] + 0.0135, CUFF_AT[1], CUFF_AT[2]],
};

/* AusScene.tsx solve(): the shell's 50 degree lens. SCALE = 3 presented units per metre.
   d = max(0.62, mm * 1.15 * FIELD_TO_DIST_50) in presented units. `clamp` applies the 0.62
   orbit-control minimum; the deck uses clamp = false (see README). Returns metres. */
export const SCALE = 3;
export const FOV_DEG = 50;
const FIELD_TO_DIST_50 = (SCALE / 1000) / (2 * Math.tan((25 * Math.PI) / 180));
export function solve(targetM, az, el, mm, clamp = false) {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  const raw = mm * 1.15 * FIELD_TO_DIST_50;
  const d = (clamp ? Math.max(0.62, raw) : raw) / SCALE;
  const t = targetM;
  return {
    pos: [t[0] + d * Math.sin(a) * Math.cos(e), t[1] + d * Math.sin(e), t[2] + d * Math.cos(a) * Math.cos(e)],
    target: [...t],
    distance: d,
  };
}
