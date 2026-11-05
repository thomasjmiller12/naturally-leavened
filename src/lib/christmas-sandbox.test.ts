import assert from "node:assert/strict";
import { test } from "node:test";
import { constrainToSnowfield, isOvenDrop, isSnowfieldPlacement } from "./christmas-sandbox";
import { getBakeryBounds, scaleBakeryPoint, type BakeryScale } from "./christmas-bakery";
import { SNOW_BOUNDS, SNOW_VISIBLE_OPACITY, snowOpacity, snowToWorld, worldToSnow, type ViewSide } from "./christmas-terrain";

const views: ViewSide[] = ["left", "right"];
const scales: BakeryScale[] = [1, 1.1];

test("only objects in the oven opening trigger heat", () => {
  assert.equal(isOvenDrop(0.15, -0.23), true);
  assert.equal(isOvenDrop(-0.65, 1.68), false);
  assert.equal(isOvenDrop(2.22, 1.7), false);
  assert.equal(isOvenDrop(0, Infinity), false);
  assert.equal(isOvenDrop(NaN, 0), false);
});

test("snow coordinates stay aligned with the rendered plane in either view", () => {
  for (const viewSide of views) {
    for (const [across, near] of [[-13, -9], [-8, 0], [0, 3], [10.15, 3.4], [13, 15]]) {
      const [x, y, z] = snowToWorld(across, near, viewSide);
      const result = worldToSnow(x, z, viewSide);
      assert.equal(y, 0.2);
      assert.ok(Math.abs(result.across - across) < 1e-12);
      assert.ok(Math.abs(result.near - near) < 1e-12);
      assert.ok(Math.abs(Math.hypot(x, z) - Math.hypot(across, near)) < 1e-12);
    }
  }
  const leftCenter = snowToWorld(0, 3, "left"), rightCenter = snowToWorld(0, 3, "right");
  assert.ok(leftCenter[0] < 0 && rightCenter[0] > 0);
  assert.equal(leftCenter[2], rightCenter[2]);
});

test("the snow reaches into distinct wide fingers and loose patches, then fades away", () => {
  assert.ok(snowOpacity(8.3, 4) > 0.9);
  assert.ok(snowOpacity(8.3, 1.4) < 0.01);
  assert.ok(snowOpacity(10.15, 3.4) > 0.5);
  for (const [across, near] of [[12.7, 3.4], [13, 0], [-14, 2], [0, 16], [NaN, 0], [0, Infinity]]) {
    assert.equal(snowOpacity(across, near), 0);
  }
});

test("visible snow beyond the old circular board preserves loose prop placements", () => {
  for (const houseScale of scales) for (const viewSide of views) {
    for (const [across, near] of [[-8, 0], [6, 3], [8.3, 4], [9.45, -0.55], [10.15, 3.4], [8.75, 9.1]]) {
      const [x, , z] = snowToWorld(across, near, viewSide);
      assert.ok(Math.hypot(x, z) > 4.05);
      assert.deepEqual(constrainToSnowfield(x, z, { viewSide, houseScale, radius: 0.8 }), { x, z });
    }
  }
});

test("off-snow placements resolve onto visible terrain and loose scenery clears the bakery", () => {
  for (const houseScale of scales) for (const viewSide of views) {
    const exterior = getBakeryBounds(houseScale).exterior;
    for (const radius of [0.2, 0.5, 0.8]) {
      for (let x = -24; x <= 24; x += 3) {
        for (let z = -24; z <= 24; z += 3) {
          const point = constrainToSnowfield(x, z, { viewSide, houseScale, radius });
          const snow = worldToSnow(point.x, point.z, viewSide);
          assert.ok(snow.across >= SNOW_BOUNDS.acrossMin - 1e-10 && snow.across <= SNOW_BOUNDS.acrossMax + 1e-10);
          assert.ok(snow.near >= SNOW_BOUNDS.nearMin - 1e-10 && snow.near <= SNOW_BOUNDS.nearMax + 1e-10);
          assert.ok(snowOpacity(snow.across, snow.near) >= SNOW_VISIBLE_OPACITY);
          assert.ok(!(point.x > exterior.left - radius && point.x < exterior.right + radius
            && point.z > exterior.back - radius && point.z < exterior.front + radius));
          assert.ok(isSnowfieldPlacement(point.x, point.z, { viewSide, houseScale, radius }));
        }
      }
    }
  }
});

test("bread and snowman travel continuously through the open front to the oven", () => {
  for (const houseScale of scales) for (const viewSide of views) {
    for (const radius of [0.35, 0.62]) {
      const options = { viewSide, houseScale, radius, allowBakeryFloor: true };
      for (let step = 0; step <= 100; step++) {
        const progress = step / 100;
        const point = { x: -0.65 + 0.8 * progress, z: 1.68 - 1.91 * progress };
        assert.deepEqual(constrainToSnowfield(point.x, point.z, options), point);
      }
      const wallX = viewSide === "left" ? 1.24 : -2.48;
      assert.equal(isSnowfieldPlacement(wallX, 0, options), false);
      assert.equal(isSnowfieldPlacement(0, -2, options), false);
      assert.equal(isSnowfieldPlacement(0, 1.1, options), true);
      assert.equal(isSnowfieldPlacement(0, 1.1, { viewSide, houseScale, radius }), false);
    }
  }
});

test("the larger bakery clears its new walls and frees the old interior boundary", () => {
  assert.deepEqual(scaleBakeryPoint(-0.62, 0.45, -0.63), [-0.62, 0.45, -0.63]);
  assert.equal(scaleBakeryPoint(0, 0.45, 0)[1], 0.45);
  for (const viewSide of views) {
    const exterior = { viewSide, houseScale: 1.1 as const, radius: 0.12 };
    const indoor = { ...exterior, allowBakeryFloor: true };
    for (const [x, z] of [[1.65, 0], [-2.8, 0], [0, -2.3], [0, 1.12]]) {
      assert.equal(isSnowfieldPlacement(x, z, exterior), false);
      const result = constrainToSnowfield(x, z, exterior);
      assert.ok(isSnowfieldPlacement(result.x, result.z, exterior));
    }
    const oldInteriorEdge = viewSide === "left" ? 1.18 : -2.4;
    assert.deepEqual(constrainToSnowfield(oldInteriorEdge, 0, indoor), { x: oldInteriorEdge, z: 0 });
    const newWallCenter = viewSide === "left" ? 1.426 : -2.666;
    assert.equal(isSnowfieldPlacement(newWallCenter, 0, indoor), false);
    assert.equal(isSnowfieldPlacement(0, 1.12, indoor), true);
  }
});

test("original and larger previews each use the physical bounds of their own shell", () => {
  for (const viewSide of views) {
    const original = { viewSide, houseScale: 1 as const, radius: 0.12 };
    const enlarged = { viewSide, houseScale: 1.1 as const, radius: 0.12 };
    assert.equal(isSnowfieldPlacement(1.65, 0, original), true);
    assert.equal(isSnowfieldPlacement(1.65, 0, enlarged), false);
    const oldInteriorEdge = viewSide === "left" ? 1.18 : -2.4;
    assert.equal(isSnowfieldPlacement(oldInteriorEdge, 0, { ...original, allowBakeryFloor: true }), false);
    assert.equal(isSnowfieldPlacement(oldInteriorEdge, 0, { ...enlarged, allowBakeryFloor: true }), true);
    for (const houseScale of scales) {
      assert.equal(scaleBakeryPoint(0, 0.45, 0, houseScale)[1], 0.45);
      const bounds = getBakeryBounds(houseScale);
      const originalFront = 0.9, largerFront = 1.053;
      assert.ok(Math.abs(bounds.floor.front - (houseScale === 1 ? originalFront : largerFront)) < 1e-12);
    }
  }
});

test("faint outer snow projects nearby rather than jumping back to the bakery", () => {
  for (const viewSide of views) {
    const [x, , z] = snowToWorld(11.5, 3.4, viewSide);
    const result = constrainToSnowfield(x, z, { viewSide });
    assert.ok(Math.hypot(result.x - x, result.z - z) < 1.5);
    assert.ok(Math.hypot(result.x, result.z) > 9);
    assert.ok(isSnowfieldPlacement(result.x, result.z, { viewSide }));
    assert.deepEqual(constrainToSnowfield(result.x, result.z, { viewSide }), result);
  }
});

test("malformed and extreme pointer values still produce finite walkable placements", () => {
  for (const viewSide of views) {
    for (const [x, z] of [[NaN, Infinity], [-Infinity, 0], [Number.MAX_VALUE, Number.MAX_VALUE], [-1e300, 1e300]]) {
      for (const allowBakeryFloor of [false, true]) {
        const options = { viewSide, allowBakeryFloor, radius: NaN };
        const result = constrainToSnowfield(x, z, options);
        assert.ok(Number.isFinite(result.x) && Number.isFinite(result.z));
        assert.ok(isSnowfieldPlacement(result.x, result.z, options));
      }
    }
  }
});
