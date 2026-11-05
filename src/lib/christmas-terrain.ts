export type ViewSide = "left" | "right";

export const SNOW_BOUNDS = {
  acrossMin: -13,
  acrossMax: 13,
  nearMin: -9,
  nearMax: 15,
} as const;

// The movement edge follows the visible feathering, rather than an inset board.
export const SNOW_VISIBLE_OPACITY = 0.06;

export function snowToWorld(across: number, near: number, viewSide: ViewSide, y = 0.2): [number, number, number] {
  const direction = viewSide === "left" ? -1 : 1;
  return [across * 0.8 + near * 0.6 * direction, y, -across * 0.6 * direction + near * 0.8];
}

export function worldToSnow(x: number, z: number, viewSide: ViewSide): { across: number; near: number } {
  const direction = viewSide === "left" ? -1 : 1;
  return { across: x * 0.8 - z * 0.6 * direction, near: x * 0.6 * direction + z * 0.8 };
}

function smoothstep(start: number, end: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function gaussian(value: number, center: number, width: number) {
  return Math.exp(-(((value - center) / width) ** 2));
}

function patch(across: number, near: number, x: number, y: number, width: number, depth: number) {
  return Math.exp(-(((across - x) / width) ** 2 + ((near - y) / depth) ** 2) * 2);
}

/** Shared by the rendered alpha map and every movable object's ground constraint. */
export function snowOpacity(across: number, near: number): number {
  if (!Number.isFinite(across) || !Number.isFinite(near)
    || across < SNOW_BOUNDS.acrossMin || across > SNOW_BOUNDS.acrossMax
    || near < SNOW_BOUNDS.nearMin || near > SNOW_BOUNDS.nearMax) return 0;

  const edge = 5.25 + gaussian(near, -0.55, 1.55) * 2.7
    + gaussian(near, 4.1, 2.1) * 3.6 + gaussian(near, 8.4, 1.65) * 2.55
    - gaussian(near, 1.4, 0.72) * 1.05
    + Math.sin(near * 1.55) * 0.3 + Math.sin(near * 3.7) * 0.12;
  const back = -4.9 + Math.sin(across * 0.75) * 0.6 - gaussian(across, 6.6, 1.5) * 1.25;
  const fadeRight = 1 - smoothstep(edge - 0.45, edge + 1.45, across);
  const fadeBack = smoothstep(back - 1.6, back + 1.65, near);
  const thinPockets = 1 - patch(across, near, 6.1, 1.95, 0.8, 0.75) * 0.72
    - patch(across, near, 7.1, 6.35, 0.8, 0.95) * 0.68;
  const loosePatches = patch(across, near, 9.45, -0.55, 0.7, 1.05) * 0.6
    + patch(across, near, 10.15, 3.4, 0.65, 0.85) * 0.64
    + patch(across, near, 8.75, 9.1, 0.8, 1.1) * 0.5;

  // Fade detached wisps as well, so the far plane boundary can never show.
  return Math.max(0, Math.min(1, fadeRight * fadeBack * thinPockets + loosePatches))
    * (1 - smoothstep(11.5, 12.7, across));
}
