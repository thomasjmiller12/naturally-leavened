import * as THREE from "three";
import { constrainToSnowfield, isOvenDrop, isSnowfieldPlacement } from "@/lib/christmas-sandbox";
import { BAKERY_SCALE, getBakeryBounds, scaleBakeryPoint, type BakeryScale } from "@/lib/christmas-bakery";
import { snowToWorld } from "@/lib/christmas-terrain";
import { createBakeryGeometry, type LoosePropId } from "./ChristmasSceneGeometry";

export type SceneTarget = {
  id: "bread" | "snowman" | "tree-0" | "tree-1" | "tree-2" | "bell" | "starter" | "oven" | LoosePropId;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

export type ChristmasSceneController = {
  reset(): void;
  bakeBread(): void;
  meltSnowman(): void;
  moveTree(index: number): void;
  moveProp(id: string): void;
  shake(): void;
  ringBell(): void;
  feedStarter(): void;
  toggleLights(): void;
  startDrag(id: string, event: PointerEvent): void;
  setPaused(paused: boolean): void;
  setReducedMotion(reduced: boolean): void;
  capture(): string;
  dispose(): void;
};

type SceneOptions = {
  onStatus(message: string): void;
  onError(message: string): void;
  onTargetsChange?(targets: SceneTarget[]): void;
  reducedMotion: boolean;
  viewSide?: "left" | "right";
  houseScale?: BakeryScale;
};

type Prop = {
  id: SceneTarget["id"];
  object: THREE.Object3D;
  home: THREE.Vector3;
  radius: number;
  label: string;
};

type Drag = {
  prop: Prop;
  pointerId: number;
  x: number;
  y: number;
  start: THREE.Vector3;
  offset: THREE.Vector3;
  moved: boolean;
};

const BREAD_HOME = new THREE.Vector3(-0.65, 0.33, 1.68);
const OVEN_BREAD = new THREE.Vector3(0.15, 0.7, -0.23);
const OVEN_SNOWMAN = new THREE.Vector3(0.15, 0.64, -0.16);
const PUDDLE_HOME = new THREE.Vector3(0.55, 0.24, 1.35);
const RAW_CRUST = new THREE.Color(0xffedc9);
const BAKED_CRUST = new THREE.Color(0xc9873d);
const RAW_SCORE = new THREE.Color(0xf2dba8);
const BAKED_SCORE = new THREE.Color(0xffe5ac);
const TOWN_SPOTS = [[4.2, 1.3], [7.3, 2.5], [5.8, 4.2], [1.7, 3.8], [-2.4, 2]] as const;

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

export function createChristmasScene(canvas: HTMLCanvasElement, options: SceneOptions): ChristmasSceneController {
  const viewSide = options.viewSide ?? "left";
  const houseScale = options.houseScale ?? BAKERY_SCALE;
  const bakeryFloor = getBakeryBounds(houseScale).floor;
  const chimneyTop = new THREE.Vector3(...scaleBakeryPoint(0.65, 3.2, -1.15, houseScale));
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (error) {
    options.onError("The little bakery couldn’t start on this device.");
    throw error;
  }

  let model: ReturnType<typeof createBakeryGeometry>;
  try {
    model = createBakeryGeometry({ viewSide, houseScale });
  } catch (error) {
    renderer.dispose();
    options.onError("The little bakery couldn’t load.");
    throw error;
  }

  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  scene.add(model.world);
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 80);
  const cameraPosition = viewSide === "left" ? new THREE.Vector3(-8, 9, 14) : new THREE.Vector3(9, 8.7, 12);
  const cameraTarget = new THREE.Vector3(0, viewSide === "left" ? 1.7 : 1.9, 0);
  const cameraRight = new THREE.Vector3().subVectors(cameraTarget, cameraPosition).cross(camera.up).normalize();
  const cameraUp = new THREE.Vector3().crossVectors(cameraRight, cameraTarget.clone().sub(cameraPosition).normalize());
  camera.position.copy(cameraPosition);
  camera.lookAt(cameraTarget);
  camera.updateMatrixWorld();
  canvas.dataset.viewSide = viewSide;
  canvas.dataset.houseScale = String(houseScale);
  scene.add(new THREE.HemisphereLight(0xddece5, 0x9a6a43, 2.35));
  const key = new THREE.DirectionalLight(0xffdfae, 4.6);
  key.position.set(-3, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(768, 768);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
  key.shadow.normalBias = 0.04;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa9cdd9, 1.8);
  fill.position.set(6, 5, -5);
  scene.add(fill);
  const ovenLight = new THREE.PointLight(0xffa743, 7, 4.5, 2);
  ovenLight.position.set(0.15, 1.05, -0.05);
  model.world.add(ovenLight);

  const props: Prop[] = [
    { id: "bread", object: model.activeLoaf, home: BREAD_HOME.clone(), radius: 0.45, label: "Put the bread in the oven" },
    { id: "snowman", object: model.snowPerson, home: model.snowPerson.position.clone(), radius: 0.5, label: "Put the snowman in the oven" },
    ...model.trees.map((object, index): Prop => ({ id: `tree-${index}` as Prop["id"], object, home: object.position.clone(), radius: index === 0 ? 0.8 : 0.55, label: index === 0 ? "Move the Christmas tree" : `Move snowy tree ${index}` })),
    ...model.looseProps.map((prop): Prop => ({ ...prop, home: prop.object.position.clone() })),
    { id: "bell", object: model.bell, home: model.bell.position.clone(), radius: 0, label: "Ring the bell" },
    { id: "starter", object: model.starter, home: model.starter.position.clone(), radius: 0, label: "Feed the starter" },
    { id: "oven", object: model.ovenMouth, home: model.ovenMouth.position.clone(), radius: 0, label: "Bake the bread" },
  ];
  const movable = (prop: Prop) => prop.radius > 0;
  let reducedMotion = options.reducedMotion;
  let lightsOn = true;
  let paused = false;
  let destroyed = false;
  let frameId = 0;
  let previousTime = 0;
  let accumulator = 0;
  let elapsed = 0;
  let shakeEnergy = 0;
  let snowEnergy = 0;
  let bellEnergy = 0;
  let starterTime = -1;
  let steamTime = 0;
  let bread: "raw" | "baking" | "baked" = "raw";
  let snowman: "frozen" | "melting" | "melted" = "frozen";
  let bakeTime = 0;
  let meltTime = 0;
  let bakeStart = BREAD_HOME.clone();
  let meltStart = model.snowPerson.position.clone();
  let drag: Drag | null = null;
  let townSpot = 0;
  let width = 1;
  let height = 1;
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2);
  const planeHit = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const targetBox = new THREE.Box3();
  const boxCorner = new THREE.Vector3();
  const minTarget = window.matchMedia("(pointer: coarse)").matches ? 44 : 24;
  const propBounds = new Map<Prop, THREE.Box3>();
  for (const prop of props.filter(movable)) {
    propBounds.set(prop, new THREE.Box3().setFromObject(prop.object).translate(prop.object.position.clone().negate()));
  }

  function updateStateAttributes() {
    canvas.dataset.bread = bread;
    canvas.dataset.snowman = snowman;
  }

  function available(prop: Prop) {
    return prop.object.visible && !(prop.id === "bread" && bread === "baking")
      && !(prop.id === "snowman" && snowman !== "frozen");
  }

  function publishTargets() {
    if (!options.onTargetsChange || destroyed) return;
    model.world.updateWorldMatrix(true, true);
    const targets: SceneTarget[] = [];
    for (const prop of props) {
      if (!available(prop)) continue;
      targetBox.setFromObject(prop.object);
      if (targetBox.isEmpty()) continue;
      let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
      for (let index = 0; index < 8; index++) {
        boxCorner.set(index & 1 ? targetBox.max.x : targetBox.min.x, index & 2 ? targetBox.max.y : targetBox.min.y, index & 4 ? targetBox.max.z : targetBox.min.z).project(camera);
        const x = (boxCorner.x + 1) * width / 2, y = (1 - boxCorner.y) * height / 2;
        left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
      if (right <= 0 || left >= width || bottom <= 0 || top >= height) continue;
      const targetWidth = Math.min(width, Math.max(minTarget, right - left));
      const targetHeight = Math.min(height, Math.max(minTarget, bottom - top));
      const label = (prop.id === "bread" || prop.id === "oven") && bread === "baked"
        ? (isOvenDrop(model.activeLoaf.position.x, model.activeLoaf.position.z) ? "Take the golden bread out of the oven" : "Put the golden bread in the oven")
        : prop.label;
      targets.push({ id: prop.id,
        x: THREE.MathUtils.clamp((left + right - targetWidth) / 2, 0, width - targetWidth),
        y: THREE.MathUtils.clamp((top + bottom - targetHeight) / 2, 0, height - targetHeight),
        width: targetWidth, height: targetHeight, label });
    }
    options.onTargetsChange(targets);
  }

  function render() {
    if (destroyed) return;
    renderer.render(scene, camera);
    publishTargets();
  }

  function applyLights() {
    model.windowMaterial.emissiveIntensity = lightsOn ? 1.8 : 0;
    ovenLight.intensity = lightsOn ? 7 : 1;
    key.intensity = lightsOn ? 4.6 : 2.5;
  }

  function wake() {
    if (destroyed || paused || frameId) return;
    previousTime = performance.now();
    frameId = requestAnimationFrame(animate);
  }

  function releaseCapture(pointerId: number) {
    if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  }

  function cancelDrag() {
    if (!drag) return;
    const cancelled = drag;
    drag = null;
    if (movable(cancelled.prop)) cancelled.prop.object.position.copy(cancelled.start);
    releaseCapture(cancelled.pointerId);
    canvas.style.cursor = "";
    wake();
  }

  function bakeBread() {
    if (destroyed || bread === "baking") return;
    cancelDrag();
    if (bread === "baked") {
      const atOven = isOvenDrop(model.activeLoaf.position.x, model.activeLoaf.position.z);
      model.activeLoaf.position.copy(atOven ? BREAD_HOME : OVEN_BREAD);
      options.onStatus(atOven ? "The golden bread is back on its peel." : "The golden bread is keeping warm in the oven.");
      wake();
      return;
    }
    bread = "baking";
    bakeTime = 0;
    bakeStart = model.activeLoaf.position.clone();
    updateStateAttributes();
    options.onStatus("The bread is baking.");
    wake();
  }

  function meltSnowman() {
    if (destroyed || snowman !== "frozen") return;
    cancelDrag();
    snowman = "melting";
    meltTime = 0;
    meltStart = model.snowPerson.position.clone();
    model.meltedSnow.position.copy(OVEN_SNOWMAN);
    model.meltedSnow.visible = false;
    updateStateAttributes();
    options.onStatus("The snowman is getting rather warm.");
    wake();
  }

  function placementOptions(prop: Prop) {
    return { radius: prop.radius, viewSide, houseScale, allowBakeryFloor: prop.id === "bread" || prop.id === "snowman" };
  }

  function restingHeight(prop: Prop, x: number, z: number) {
    if (prop.id !== "bread" && prop.id !== "snowman") return prop.home.y;
    const breadProp = prop.id === "bread";
    const snowHeight = breadProp ? 0.25 : 0.2;
    const floor = bakeryFloor;
    const floorAcross = smooth(THREE.MathUtils.clamp((x - floor.left + 0.2) / 0.3, 0, 1))
      * smooth(THREE.MathUtils.clamp((floor.right + 0.2 - x) / 0.3, 0, 1));
    const floorDepth = smooth(THREE.MathUtils.clamp((floor.front + 0.75 - z) / 0.9, 0, 1))
      * smooth(THREE.MathUtils.clamp((z - floor.back + 0.35) / 0.4, 0, 1));
    const floorHeight = THREE.MathUtils.lerp(snowHeight, breadProp ? 0.45 : 0.46, floorAcross * floorDepth);
    const ovenDistance = Math.hypot(x - OVEN_BREAD.x, z - OVEN_BREAD.z);
    const ovenLift = smooth(THREE.MathUtils.clamp((1.15 - ovenDistance) / 0.95, 0, 1));
    const height = THREE.MathUtils.lerp(floorHeight, breadProp ? OVEN_BREAD.y : OVEN_SNOWMAN.y, ovenLift);
    if (!breadProp) return height;
    const peelDistance = Math.max(Math.abs(x - BREAD_HOME.x) / 0.71, Math.abs(z - BREAD_HOME.z) / 0.57);
    const onPeel = 1 - smooth(THREE.MathUtils.clamp((peelDistance - 0.8) / 0.3, 0, 1));
    return THREE.MathUtils.lerp(height, Math.max(height, BREAD_HOME.y), onPeel);
  }

  function viewportOverflow(prop: Prop, position: THREE.Vector3) {
    const bounds = propBounds.get(prop);
    if (!bounds) return 0;
    let overflow = 0;
    for (let index = 0; index < 8; index++) {
      boxCorner.set(index & 1 ? bounds.max.x : bounds.min.x, index & 2 ? bounds.max.y : bounds.min.y, index & 4 ? bounds.max.z : bounds.min.z)
        .add(position).applyMatrix4(model.world.matrixWorld).project(camera);
      const x = (boxCorner.x + 1) * width / 2;
      const y = (1 - boxCorner.y) * height / 2;
      overflow += Math.max(0, 5 - x, x - width + 5) + Math.max(0, 5 - y, y - height + 4);
    }
    return overflow;
  }

  function insideViewport(prop: Prop, position: THREE.Vector3) { return viewportOverflow(prop, position) < 0.001; }

  function placeProp(prop: Prop, x: number, z: number) {
    const settings = placementOptions(prop);
    const terrain = constrainToSnowfield(x, z, settings);
    const next = new THREE.Vector3(terrain.x, restingHeight(prop, terrain.x, terrain.z), terrain.z);
    if (insideViewport(prop, next)) return next;
    const previous = prop.object.position;
    if (!insideViewport(prop, previous)) return viewportOverflow(prop, next) < viewportOverflow(prop, previous) ? next : previous.clone();
    // Keep a dragged prop reachable when the snow continues beyond the canvas.
    let low = 0, high = 1;
    const candidate = previous.clone();
    for (let iteration = 0; iteration < 12; iteration++) {
      const progress = (low + high) / 2;
      candidate.lerpVectors(previous, next, progress);
      candidate.y = restingHeight(prop, candidate.x, candidate.z);
      if (insideViewport(prop, candidate) && isSnowfieldPlacement(candidate.x, candidate.z, settings)) low = progress;
      else high = progress;
    }
    candidate.lerpVectors(previous, next, low);
    candidate.y = restingHeight(prop, candidate.x, candidate.z);
    return candidate;
  }

  function moveProp(id: string) {
    const prop = props.find((item) => item.id === id);
    if (destroyed || !prop || !movable(prop) || !available(prop)) return;
    cancelDrag();
    for (let attempt = 0; attempt < TOWN_SPOTS.length; attempt++) {
      const spot = TOWN_SPOTS[townSpot++ % TOWN_SPOTS.length];
      const [x, , z] = snowToWorld(spot[0], spot[1], viewSide);
      const next = placeProp(prop, x, z);
      if (next.distanceToSquared(prop.object.position) < 0.01) continue;
      prop.object.position.copy(next);
      break;
    }
    options.onStatus("A new spot in the snow.");
    wake();
  }

  function moveTree(index: number) { moveProp(`tree-${index}`); }

  function shake() {
    if (destroyed) return;
    shakeEnergy = reducedMotion ? 0 : 1;
    snowEnergy = 1;
    options.onStatus("Snow swirls around the little bakery.");
    wake();
  }

  function ringBell() {
    if (destroyed) return;
    bellEnergy = 1;
    options.onStatus("Ding! The little bakery bell rings.");
    wake();
  }

  function feedStarter() {
    if (destroyed) return;
    starterTime = 0;
    options.onStatus("The starter rises until its lid pops up.");
    wake();
  }

  function toggleLights() {
    if (destroyed) return;
    lightsOn = !lightsOn;
    applyLights();
    options.onStatus(lightsOn ? "The bakery lights glow." : "The bakery lights dim.");
    wake();
  }

  function reset() {
    if (destroyed) return;
    cancelDrag();
    bread = "raw";
    snowman = "frozen";
    lightsOn = true;
    townSpot = 0;
    bakeTime = meltTime = steamTime = shakeEnergy = snowEnergy = bellEnergy = 0;
    starterTime = -1;
    props.filter(movable).forEach((prop) => { prop.object.position.copy(prop.home); prop.object.scale.setScalar(1); });
    model.snowPerson.visible = true;
    model.snowPerson.rotation.z = 0;
    model.meltedSnow.visible = false;
    model.activeLoaf.visible = true;
    model.loafMaterial.color.copy(RAW_CRUST);
    model.scoreInnerMaterial.color.copy(RAW_SCORE);
    model.starterBody.scale.setScalar(1);
    model.starterLid.position.y = 0.34;
    model.starterLid.rotation.z = 0;
    model.fire.scale.y = 1;
    model.world.rotation.set(0, 0, 0);
    model.world.position.y = 0;
    applyLights();
    updateStateAttributes();
    options.onStatus("A fresh little winter.");
    wake();
  }

  function updateBake(step: number) {
    if (bread !== "baking") return;
    bakeTime += step;
    const entryDuration = reducedMotion ? 0.12 : 0.5;
    const bakeDuration = reducedMotion ? 0.35 : 3;
    model.activeLoaf.position.lerpVectors(bakeStart, OVEN_BREAD, smooth(Math.min(bakeTime / entryDuration, 1)));
    const progress = Math.max(0, Math.min((bakeTime - entryDuration) / bakeDuration, 1));
    model.activeLoaf.scale.set(1 + progress * 0.08, 1 + progress * 0.3, 1 + progress * 0.08);
    model.loafMaterial.color.lerpColors(RAW_CRUST, BAKED_CRUST, progress);
    model.scoreInnerMaterial.color.lerpColors(RAW_SCORE, BAKED_SCORE, progress);
    model.fire.scale.y = 1 + Math.sin(progress * Math.PI) * 2;
    ovenLight.intensity = (lightsOn ? 7 : 1) + Math.sin(progress * Math.PI) * 3;
    if (progress === 1) {
      bread = "baked";
      steamTime = reducedMotion ? 0 : 4;
      updateStateAttributes();
      applyLights();
      options.onStatus("The bread is golden and ready to take out.");
    }
  }

  function updateMelt(step: number) {
    if (snowman !== "melting") return;
    meltTime += step;
    const entryDuration = reducedMotion ? 0.1 : 0.45;
    const duration = reducedMotion ? 0.4 : 2.8;
    model.snowPerson.position.lerpVectors(meltStart, OVEN_SNOWMAN, smooth(Math.min(meltTime / entryDuration, 1)));
    const progress = Math.max(0, Math.min((meltTime - entryDuration) / duration, 1));
    model.snowPerson.scale.set(1 + progress * 0.2, 1 - progress * 0.97, 1 + progress * 0.25);
    model.meltedSnow.visible = progress > 0.35;
    model.meltedSnow.scale.setScalar(0.4 + progress * 0.6);
    const seep = smooth(Math.max(0, Math.min((progress - 0.2) / 0.8, 1)));
    model.meltedSnow.position.lerpVectors(OVEN_SNOWMAN, PUDDLE_HOME, seep);
    if (progress === 1) {
      snowman = "melted";
      model.snowPerson.visible = false;
      model.snowPerson.scale.setScalar(1);
      model.meltedSnow.scale.setScalar(1);
      model.meltedSnow.position.copy(PUDDLE_HOME);
      updateStateAttributes();
      options.onStatus("The snowman has melted. Only a little puddle, hat and carrot remain.");
    }
  }

  function updateDetails(step: number) {
    snowEnergy = Math.max(0, snowEnergy - step * 0.3);
    shakeEnergy = Math.max(0, shakeEnergy - step * 0.75);
    bellEnergy = Math.max(0, bellEnergy - step * (reducedMotion ? 4 : 0.7));
    steamTime = Math.max(0, steamTime - step);
    model.world.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 30) * shakeEnergy * 0.02;
    model.world.position.y = reducedMotion ? 0 : Math.abs(Math.sin(elapsed * 24)) * shakeEnergy * 0.025;
    model.snowPerson.rotation.z = reducedMotion || snowman !== "frozen" ? 0 : Math.sin(elapsed * 7) * snowEnergy * 0.1;
    model.bell.rotation.z = reducedMotion ? bellEnergy * 0.12 : Math.sin(elapsed * 21) * bellEnergy * 0.5;
    if (starterTime >= 0) {
      starterTime += step;
      const progress = Math.min(starterTime / (reducedMotion ? 0.7 : 3.2), 1);
      const rise = Math.sin(progress * Math.PI);
      model.starterBody.scale.set(1 + rise * 0.2, 1 + rise * 0.35, 1 + rise * 0.2);
      model.starterLid.position.y = 0.34 + rise * (reducedMotion ? 0.05 : 0.35);
      model.starterLid.rotation.z = reducedMotion ? 0 : Math.sin(progress * Math.PI * 4) * rise * 0.3;
      if (progress === 1) starterTime = -1;
    }
    const snowTime = reducedMotion ? 0 : elapsed;
    for (let i = 0; i < model.snowSeeds.length; i++) {
      const seed = model.snowSeeds[i];
      const angle = seed.angle + snowTime * 0.04 + Math.sin(snowTime * 0.8) * snowEnergy;
      const y = ((seed.height - snowTime * seed.speed) % 4.4 + 4.4) % 4.4;
      model.snowPositions[i * 3] = Math.cos(angle) * seed.radius;
      model.snowPositions[i * 3 + 1] = 0.22 + y;
      model.snowPositions[i * 3 + 2] = Math.sin(angle) * seed.radius;
    }
    model.snowGeometry.attributes.position.needsUpdate = true;
    model.snowfall.visible = !reducedMotion;
    model.snowfall.material.opacity = 0.45 + snowEnergy * 0.4;
    model.puffs.forEach((puff, index) => {
      const loafSteam = steamTime > 0;
      puff.visible = !reducedMotion && (loafSteam || index < 4);
      const progress = (elapsed * 0.34 + index / 9) % 1;
      puff.position.set(loafSteam ? model.activeLoaf.position.x + Math.sin(progress * 5 + index) * 0.15 : chimneyTop.x + Math.sin(progress * 4 + index) * 0.08, loafSteam ? model.activeLoaf.position.y + 0.65 + progress : chimneyTop.y + progress * 0.75, loafSteam ? model.activeLoaf.position.z : chimneyTop.z);
      puff.scale.setScalar(0.4 + progress * 2.1);
    });
  }

  function animate(now: number) {
    frameId = 0;
    if (destroyed || paused) return;
    accumulator += Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;
    if (accumulator >= 1 / 30 || reducedMotion) {
      const step = accumulator;
      accumulator = 0;
      elapsed += step;
      updateBake(step);
      updateMelt(step);
      updateDetails(step);
      try { render(); } catch {
        dispose();
        options.onError("The little bakery’s graphics stopped.");
        return;
      }
    }
    const hasAction = bread === "baking" || snowman === "melting" || starterTime >= 0 || steamTime > 0 || bellEnergy > 0 || snowEnergy > 0 || !!drag;
    if (!frameId && (!reducedMotion || hasAction)) frameId = requestAnimationFrame(animate);
  }

  function resize() {
    if (destroyed) return;
    cancelDrag();
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    const aspect = width / height;
    let halfHeight = Math.max(4.0, 4.65 / aspect);
    const pan = cameraRight.clone().multiplyScalar(3 * THREE.MathUtils.clamp((aspect - 1.25) / 0.7, 0, 1));
    const narrow = THREE.MathUtils.clamp((1.65 - aspect) / 0.4, 0, 1);
    if (narrow > 0) {
      // Fit the authored town and any moved props when the expanded toy is narrow.
      const town = new THREE.Box3().setFromObject(model.bakeryShell);
      for (const prop of props) {
        town.union(new THREE.Box3().setFromObject(prop.object));
        const bounds = propBounds.get(prop);
        if (bounds) town.union(bounds.clone().translate(prop.home));
      }
      let left = Infinity, right = -Infinity, bottom = Infinity, top = -Infinity;
      for (let index = 0; index < 8; index++) {
        boxCorner.set(index & 1 ? town.max.x : town.min.x, index & 2 ? town.max.y : town.min.y, index & 4 ? town.max.z : town.min.z);
        const x = boxCorner.dot(cameraRight), y = boxCorner.dot(cameraUp);
        left = Math.min(left, x); right = Math.max(right, x); bottom = Math.min(bottom, y); top = Math.max(top, y);
      }
      const fittedHeight = Math.max(halfHeight, (right - left + 1.1) / (aspect * 2), (top - bottom + 1.1) / 2);
      halfHeight = THREE.MathUtils.lerp(halfHeight, fittedHeight, narrow);
      const fittedPan = cameraRight.clone().multiplyScalar((left + right) / 2 - cameraTarget.dot(cameraRight))
        .addScaledVector(cameraUp, (bottom + top) / 2 - cameraTarget.dot(cameraUp) + halfHeight * 0.2);
      pan.lerp(fittedPan, narrow);
    }
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.position.copy(cameraPosition).add(pan);
    camera.lookAt(cameraTarget.clone().add(pan));
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    for (const prop of props.filter(movable)) {
      if (!insideViewport(prop, prop.object.position)) prop.object.position.copy(prop.home);
    }
    render();
  }

  function rayFromEvent(event: PointerEvent) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    model.world.updateWorldMatrix(true, true);
    ray.setFromCamera(pointer, camera);
  }

  function meshHit(object: THREE.Object3D) {
    const meshes: THREE.Mesh[] = [];
    object.traverseVisible((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
    return ray.intersectObjects(meshes, false)[0];
  }

  function overOven(event: PointerEvent) {
    rayFromEvent(event);
    if (meshHit(model.ovenMouth)) return true;
    const bounds = canvas.getBoundingClientRect();
    projected.set(0.15, 1.02, -0.4).applyMatrix4(model.world.matrixWorld).project(camera);
    const x = bounds.left + (projected.x + 1) * width / 2, y = bounds.top + (1 - projected.y) * height / 2;
    return Math.hypot(event.clientX - x, event.clientY - y) < (event.pointerType === "touch" ? 25 : 15);
  }

  function pickProp(event: PointerEvent) {
    rayFromEvent(event);
    let selected: Prop | undefined;
    let distance = Infinity;
    for (const prop of props) {
      if (!available(prop)) continue;
      const hit = meshHit(prop.object);
      if (hit && hit.distance < distance) { selected = prop; distance = hit.distance; }
    }
    return selected;
  }

  function startDrag(id: string, event: PointerEvent) {
    if (destroyed || paused || event.button !== 0 || drag) return;
    const requested = props.find((item) => item.id === id);
    const hit = event.pointerType === "touch" ? pickProp(event) : undefined;
    const prop = hit && movable(hit) ? hit : requested;
    if (!prop || !available(prop)) return;
    rayFromEvent(event);
    plane.constant = -prop.object.position.y;
    const offset = new THREE.Vector3();
    if (movable(prop) && ray.ray.intersectPlane(plane, planeHit)) {
      offset.copy(prop.object.position).sub(model.world.worldToLocal(planeHit.clone()));
    }
    drag = { prop, pointerId: event.pointerId, x: event.clientX, y: event.clientY, start: prop.object.position.clone(), offset, moved: false };
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = movable(prop) ? "grabbing" : "pointer";
    wake();
  }

  function onPointerDown(event: PointerEvent) {
    const prop = pickProp(event);
    if (prop) startDrag(prop.id, event);
  }

  function onPointerMove(event: PointerEvent) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag.moved ||= Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4;
    if (!movable(drag.prop) || !drag.moved) return;
    rayFromEvent(event);
    const crossesFloor = drag.prop.id === "bread" || drag.prop.id === "snowman";
    let low = 0.2, high = 0.7;
    let point: THREE.Vector3 | undefined;
    // Resolve the raised bakery floor while keeping the grabbed point beneath the pointer.
    for (let iteration = 0; iteration < (crossesFloor ? 14 : 1); iteration++) {
      const elevation = crossesFloor ? (low + high) / 2 : drag.prop.home.y;
      plane.constant = -elevation;
      if (!ray.ray.intersectPlane(plane, planeHit)) return;
      point = model.world.worldToLocal(planeHit.clone()).add(drag.offset);
      if (restingHeight(drag.prop, point.x, point.z) > elevation) low = elevation;
      else high = elevation;
    }
    if (!point) return;
    drag.prop.object.position.copy(placeProp(drag.prop, point.x, point.z));
    wake();
  }

  function onPointerUp(event: PointerEvent) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const completed = drag;
    drag = null;
    releaseCapture(completed.pointerId);
    canvas.style.cursor = "";
    const atOven = overOven(event) || isOvenDrop(completed.prop.object.position.x, completed.prop.object.position.z);
    if (completed.prop.id === "bread" && completed.moved && atOven && bread === "raw") bakeBread();
    else if (completed.prop.id === "snowman" && completed.moved && atOven) meltSnowman();
    else if (!completed.moved) {
      if (completed.prop.id === "bell") ringBell();
      else if (completed.prop.id === "starter") feedStarter();
      else if (completed.prop.id === "oven") bakeBread();
      else if (completed.prop.id.startsWith("tree")) toggleLights();
      else if (completed.prop.id === "snowman") shake();
    }
    if (completed.moved && movable(completed.prop) && !atOven) {
      const { x, z } = completed.prop.object.position;
      completed.prop.object.position.y = restingHeight(completed.prop, x, z);
    }
    wake();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    dispose();
    options.onError("The little bakery’s graphics took a rest.");
  }

  function dispose() {
    if (destroyed) return;
    cancelDrag();
    destroyed = true;
    cancelAnimationFrame(frameId);
    frameId = 0;
    resizeObserver.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", cancelDrag);
    canvas.removeEventListener("lostpointercapture", cancelDrag);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    window.removeEventListener("blur", cancelDrag);
    model.dispose();
    key.shadow.map?.dispose();
    renderer.dispose();
    scene.clear();
    options.onTargetsChange?.([]);
    canvas.style.cursor = "";
    delete canvas.dataset.bread;
    delete canvas.dataset.snowman;
    delete canvas.dataset.houseScale;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", cancelDrag);
  canvas.addEventListener("lostpointercapture", cancelDrag);
  canvas.addEventListener("webglcontextlost", onContextLost);
  window.addEventListener("blur", cancelDrag);
  try {
    updateStateAttributes();
    applyLights();
    updateDetails(0);
    resize();
    wake();
  } catch (error) {
    dispose();
    options.onError("The little bakery couldn’t load.");
    throw error;
  }

  return {
    reset, bakeBread, meltSnowman, moveTree, moveProp, shake, ringBell, feedStarter, toggleLights, startDrag,
    setPaused(value) {
      if (destroyed || paused === value) return;
      paused = value;
      if (paused) { cancelDrag(); cancelAnimationFrame(frameId); frameId = 0; accumulator = 0; }
      else wake();
    },
    setReducedMotion(value) {
      if (destroyed) return;
      reducedMotion = value;
      if (value) shakeEnergy = 0;
      wake();
    },
    capture() { render(); return canvas.toDataURL("image/webp", 0.9); },
    dispose,
  };
}
