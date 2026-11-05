export type BakeryScale = 1 | 1.1;
export const BAKERY_SCALE: BakeryScale = 1;
export const BAKERY_ANCHOR = { x: -0.62, y: 0.45, z: -0.63 } as const;

export type BakeryBounds = { left: number; right: number; back: number; front: number };

export function scaleBakeryPoint(x: number, y: number, z: number, scale: BakeryScale = BAKERY_SCALE): [number, number, number] {
  return [
    BAKERY_ANCHOR.x + (x - BAKERY_ANCHOR.x) * scale,
    BAKERY_ANCHOR.y + (y - BAKERY_ANCHOR.y) * scale,
    BAKERY_ANCHOR.z + (z - BAKERY_ANCHOR.z) * scale,
  ];
}

function scaleBounds({ left, right, back, front }: BakeryBounds, scale: BakeryScale): BakeryBounds {
  const [scaledLeft, , scaledBack] = scaleBakeryPoint(left, BAKERY_ANCHOR.y, back, scale);
  const [scaledRight, , scaledFront] = scaleBakeryPoint(right, BAKERY_ANCHOR.y, front, scale);
  return { left: scaledLeft, right: scaledRight, back: scaledBack, front: scaledFront };
}

// Geometry and interaction share the same anchored shell enlargement. The oven
// and other playable furnishings keep their existing world coordinates.
function createBakeryBounds(scale: BakeryScale) {
  return {
    exterior: scaleBounds({ left: -2.55, right: 1.35, back: -2.1, front: 0.9 }, scale),
    floor: scaleBounds({ left: -2.4, right: 1.15, back: -1.85, front: 0.9 }, scale),
    backWall: scaleBounds({ left: -2.55, right: 1.35, back: -2.1, front: -1.85 }, scale),
    sideWalls: {
      left: scaleBounds({ left: -2.55, right: -2.4, back: -2.1, front: 0.9 }, scale),
      right: scaleBounds({ left: 1.15, right: 1.35, back: -2.1, front: 0.9 }, scale),
    },
  };
}

const originalBounds = createBakeryBounds(1);
const enlargedBounds = createBakeryBounds(1.1);

export function getBakeryBounds(scale: BakeryScale = BAKERY_SCALE) {
  return scale === 1 ? originalBounds : enlargedBounds;
}

export const BAKERY_EXTERIOR_BOUNDS = enlargedBounds.exterior;
export const BAKERY_FLOOR_BOUNDS = enlargedBounds.floor;
export const BAKERY_BACK_WALL_BOUNDS = enlargedBounds.backWall;
export const BAKERY_SIDE_WALL_BOUNDS = enlargedBounds.sideWalls;
