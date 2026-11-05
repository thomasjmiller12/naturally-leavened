import { SNOW_BOUNDS, SNOW_VISIBLE_OPACITY, snowOpacity, snowToWorld, worldToSnow, type ViewSide } from "./christmas-terrain";
import { getBakeryBounds, type BakeryBounds, type BakeryScale } from "./christmas-bakery";

export type BoardPoint = { x: number; z: number };
export type SnowfieldPlacementOptions = { radius?: number; viewSide?: ViewSide; allowBakeryFloor?: boolean; houseScale?: BakeryScale };

export function isOvenDrop(x: number, z: number) {
  return Number.isFinite(x) && Number.isFinite(z)
    && x >= -0.48 && x <= 0.78 && z >= -0.85 && z <= 0.35;
}

function contains(rectangle: BakeryBounds, x: number, z: number) {
  return x > rectangle.left && x < rectangle.right && z > rectangle.back && z < rectangle.front;
}

function placementRules({ radius = 0.45, viewSide = "left", allowBakeryFloor = false, houseScale }: SnowfieldPlacementOptions) {
  const bakery = getBakeryBounds(houseScale);
  const margin = Number.isFinite(radius) ? Math.min(1.2, Math.max(0.12, radius)) : 0.45;
  const expand = (rectangle: BakeryBounds): BakeryBounds => ({
    left: rectangle.left - margin, right: rectangle.right + margin,
    back: rectangle.back - margin, front: rectangle.front + margin,
  });
  // Loose scenery stays outside. Small characters can enter through the open front
  // and cutaway side; only the actual remaining walls obstruct them.
  const obstacles = (allowBakeryFloor ? [
    bakery.backWall,
    bakery.sideWalls[viewSide === "left" ? "right" : "left"],
  ] : [bakery.exterior]).map(expand);

  const allows = (x: number, z: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(z) || obstacles.some((obstacle) => contains(obstacle, x, z))) return false;
    if (allowBakeryFloor && x >= bakery.floor.left && x <= bakery.floor.right
      && z >= bakery.floor.back && z <= bakery.floor.front) return true;
    const { across, near } = worldToSnow(x, z, viewSide);
    return snowOpacity(across, near) >= SNOW_VISIBLE_OPACITY;
  };
  return { allows, obstacles, viewSide };
}

export function isSnowfieldPlacement(x: number, z: number, options: SnowfieldPlacementOptions = {}) {
  return placementRules(options).allows(x, z);
}

const visibleSamples = new Map<ViewSide, BoardPoint[]>();

function snowSamples(viewSide: ViewSide): BoardPoint[] {
  const cached = visibleSamples.get(viewSide);
  if (cached) return cached;
  const points: BoardPoint[] = [];
  const acrossSteps = 130, nearSteps = 120;
  for (let column = 0; column <= acrossSteps; column++) {
    const across = SNOW_BOUNDS.acrossMin + column / acrossSteps * (SNOW_BOUNDS.acrossMax - SNOW_BOUNDS.acrossMin);
    for (let row = 0; row <= nearSteps; row++) {
      const near = SNOW_BOUNDS.nearMin + row / nearSteps * (SNOW_BOUNDS.nearMax - SNOW_BOUNDS.nearMin);
      if (snowOpacity(across, near) < SNOW_VISIBLE_OPACITY) continue;
      const [x, , z] = snowToWorld(across, near, viewSide);
      points.push({ x, z });
    }
  }
  visibleSamples.set(viewSide, points);
  return points;
}

export function constrainToSnowfield(x: number, z: number, options: SnowfieldPlacementOptions = {}): BoardPoint {
  const { allows, obstacles, viewSide } = placementRules(options);
  const input = { x: Number.isFinite(x) ? x : 0, z: Number.isFinite(z) ? z : 2 };
  if (allows(input.x, input.z)) return input;

  const { across, near } = worldToSnow(input.x, input.z, viewSide);
  const [boundedX, , boundedZ] = snowToWorld(
    Math.max(SNOW_BOUNDS.acrossMin, Math.min(SNOW_BOUNDS.acrossMax, across)),
    Math.max(SNOW_BOUNDS.nearMin, Math.min(SNOW_BOUNDS.nearMax, near)), viewSide,
  );
  const target = { x: boundedX, z: boundedZ };
  if (allows(target.x, target.z)) return target;

  let nearest: BoardPoint | undefined;
  let nearestDistance = Infinity;
  const consider = (point: BoardPoint) => {
    const distance = (point.x - target.x) ** 2 + (point.z - target.z) ** 2;
    if (distance < nearestDistance && allows(point.x, point.z)) {
      nearest = point;
      nearestDistance = distance;
    }
  };
  // Exact wall projections keep dragging beside the bakery smooth.
  for (const obstacle of obstacles) {
    consider({ x: obstacle.left, z: target.z });
    consider({ x: obstacle.right, z: target.z });
    consider({ x: target.x, z: obstacle.back });
    consider({ x: target.x, z: obstacle.front });
  }
  // Only invalid drops need this cached nearest-surface search. The same alpha
  // sampler that draws the snow supplies the candidates, including loose wisps.
  for (const point of snowSamples(viewSide)) consider(point);
  let result = nearest ?? { x: 0, z: 2.5 };
  let valid = 0, invalid = 1;
  for (let iteration = 0; iteration < 18; iteration++) {
    const fraction = (valid + invalid) / 2;
    const candidate = { x: result.x + (target.x - result.x) * fraction, z: result.z + (target.z - result.z) * fraction };
    if (allows(candidate.x, candidate.z)) valid = fraction;
    else invalid = fraction;
  }
  result = { x: result.x + (target.x - result.x) * valid, z: result.z + (target.z - result.z) * valid };
  return result;
}
