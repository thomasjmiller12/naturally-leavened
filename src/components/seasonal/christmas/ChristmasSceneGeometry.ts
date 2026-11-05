import * as THREE from "three";
import { BAKERY_ANCHOR, BAKERY_SCALE, type BakeryScale } from "@/lib/christmas-bakery";
import { SNOW_BOUNDS, snowOpacity, snowToWorld, worldToSnow, type ViewSide } from "@/lib/christmas-terrain";

type Point = [number, number, number];
export type LoosePropId = "present-0" | "present-1" | "present-2" | "fence" | "logs" | "lantern" | "sapling" | "signpost";
export type LooseProp = { id: LoosePropId; object: THREE.Group; radius: number; label: string };

function randomSource(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
}

export function createBakeryGeometry({ viewSide = "right", houseScale = BAKERY_SCALE }: { viewSide?: ViewSide; houseScale?: BakeryScale } = {}) {
  const world = new THREE.Group();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const random = randomSource(1224);
  const viewDirection = viewSide === "left" ? -1 : 1;

  function material(color: THREE.ColorRepresentation, extra: THREE.MeshStandardMaterialParameters = {}) {
    const result = new THREE.MeshStandardMaterial({ color, roughness: 0.88, ...extra });
    materials.add(result);
    return result;
  }

  function mesh(
    geometry: THREE.BufferGeometry,
    surface: THREE.Material,
    position: Point = [0, 0, 0],
    parent: THREE.Object3D = world,
  ) {
    geometries.add(geometry);
    materials.add(surface);
    const result = new THREE.Mesh(geometry, surface);
    result.position.set(...position);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  }

  function box(size: Point, surface: THREE.Material, position: Point, parent: THREE.Object3D = world) {
    return mesh(new THREE.BoxGeometry(...size), surface, position, parent);
  }

  function ball(radius: number, surface: THREE.Material, position: Point, parent: THREE.Object3D = world) {
    return mesh(new THREE.SphereGeometry(radius, 20, 12), surface, position, parent);
  }

  function cylinder(top: number, bottom: number, height: number, surface: THREE.Material, position: Point, parent: THREE.Object3D = world) {
    return mesh(new THREE.CylinderGeometry(top, bottom, height, 40), surface, position, parent);
  }

  function tube(points: Point[], radius: number, surface: THREE.Material, parent: THREE.Object3D = world) {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return mesh(new THREE.TubeGeometry(curve, Math.max(12, points.length * 4), radius, 6, false), surface, [0, 0, 0], parent);
  }

  function group(position: Point = [0, 0, 0], parent: THREE.Object3D = world) {
    const result = new THREE.Group();
    result.position.set(...position);
    parent.add(result);
    return result;
  }

  const snow = material(0xf1f0df);
  const pine = material(0x315e49);
  const pineDark = material(0x203e34);
  const wood = material(0xa37748);
  const darkWood = material(0x69432f);
  const cream = material(0xe7c89a);
  const berry = material(0x9b4147);
  const brass = material(0xc49e58, { metalness: 0.45, roughness: 0.4 });
  const ink = material(0x28352e);
  const flour = material(0xf4e5bf);
  const windowMaterial = material(0xffbf69, { emissive: 0xff9d32, emissiveIntensity: 1.8, roughness: 0.4 });
  const fireMaterial = material(0xffb04d, { emissive: 0xff601e, emissiveIntensity: 2 });

  // Snow continues off the page's lower-left edge, then thins into the paper.
  // Ground coordinates follow the view, so the drifts always reach into the page.
  function groundPoint(across: number, near: number, y = 0.2): Point {
    return snowToWorld(across, near, viewSide, y);
  }
  const groundWidth = SNOW_BOUNDS.acrossMax - SNOW_BOUNDS.acrossMin;
  const groundDepth = SNOW_BOUNDS.nearMax - SNOW_BOUNDS.nearMin;
  const groundCenterAcross = (SNOW_BOUNDS.acrossMin + SNOW_BOUNDS.acrossMax) / 2;
  const groundCenterNear = (SNOW_BOUNDS.nearMin + SNOW_BOUNDS.nearMax) / 2;
  const snowMask = document.createElement("canvas");
  snowMask.width = snowMask.height = 256;
  const maskContext = snowMask.getContext("2d");
  if (maskContext) {
    const image = maskContext.createImageData(256, 256);
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const across = SNOW_BOUNDS.acrossMin + x / 255 * groundWidth;
        const near = SNOW_BOUNDS.nearMin + y / 255 * groundDepth;
        const shade = Math.round(snowOpacity(across, near) * 255);
        const offset = (y * 256 + x) * 4;
        image.data[offset] = image.data[offset + 1] = image.data[offset + 2] = shade;
        image.data[offset + 3] = 255;
      }
    }
    maskContext.putImageData(image, 0, 0);
  }
  const groundAlpha = new THREE.CanvasTexture(snowMask);
  textures.add(groundAlpha);
  const groundGeometry = new THREE.PlaneGeometry(groundWidth, groundDepth, 56, 56);
  groundGeometry.rotateX(-Math.PI / 2);
  groundGeometry.rotateY(Math.atan2(0.6 * viewDirection, 0.8));
  const groundPositions = groundGeometry.getAttribute("position");
  for (let index = 0; index < groundPositions.count; index++) {
    const x = groundPositions.getX(index), z = groundPositions.getZ(index);
    const local = worldToSnow(x, z, viewSide);
    const across = local.across + groundCenterAcross;
    const near = local.near + groundCenterNear;
    groundPositions.setY(index, Math.sin(across * 1.2) * Math.cos(near * 0.85) * 0.009);
  }
  groundGeometry.computeVertexNormals();
  const snowfield = mesh(groundGeometry, material(0xf1f0df, {
    alphaMap: groundAlpha,
    transparent: true,
    depthWrite: false,
    alphaTest: 0.005,
  }), groundPoint(groundCenterAcross, groundCenterNear));
  snowfield.castShadow = false;

  const bakeryShell = group();
  bakeryShell.scale.setScalar(houseScale);
  bakeryShell.position.set(BAKERY_ANCHOR.x, BAKERY_ANCHOR.y, BAKERY_ANCHOR.z).multiplyScalar(1 - houseScale);
  box([3.85, 0.22, 2.85], darkWood, [-0.62, 0.29, -0.63], bakeryShell);
  box([3.65, 0.045, 2.7], wood, [-0.62, 0.42, -0.63], bakeryShell);
  for (let i = 0; i < 9; i++) box([0.018, 0.012, 2.65], darkWood, [-2.3 + i * 0.42, 0.449, -0.63], bakeryShell);
  box([3.85, 2.35, 0.16], cream, [-0.62, 1.6, -2], bakeryShell);
  box([0.16, 2.35, 2.85], cream, [viewSide === "left" ? 1.24 : -2.48, 1.6, -0.63], bakeryShell);
  box([3.9, 0.13, 0.22], darkWood, [-0.62, 0.52, -1.94], bakeryShell);
  box([0.22, 0.13, 2.86], darkWood, [viewSide === "left" ? 1.19 : -2.43, 0.52, -0.63], bakeryShell);
  for (const x of [-2.47, -0.63, 1.22]) box([0.12, 2.45, 0.22], darkWood, [x, 1.65, -1.88], bakeryShell);
  box([3.95, 0.14, 0.22], darkWood, [-0.62, 2.77, -1.96], bakeryShell);

  const gable = new THREE.Shape();
  gable.moveTo(-2, 0).lineTo(0, 1.12).lineTo(2, 0).closePath();
  mesh(new THREE.ExtrudeGeometry(gable, { depth: 0.15, bevelEnabled: false }), cream, [-0.62, 2.77, -2.1], bakeryShell);
  const roof = box([2.36, 0.14, 3.04], berry, [viewSide === "left" ? 0.39 : -1.63, 3.25, -0.67], bakeryShell);
  roof.rotation.z = 0.51 * viewDirection;
  const roofSnow = box([2.42, 0.12, 3.12], snow, [viewSide === "left" ? 0.42 : -1.66, 3.36, -0.67], bakeryShell);
  roofSnow.rotation.z = 0.51 * viewDirection;
  box([0.16, 0.14, 3.15], darkWood, [-0.62, 3.88, -0.67], bakeryShell);

  box([1.05, 1.12, 0.08], darkWood, [-1.54, 1.84, -1.86], bakeryShell);
  box([0.9, 0.97, 0.09], windowMaterial, [-1.54, 1.84, -1.8], bakeryShell);
  box([0.06, 1, 0.07], cream, [-1.54, 1.84, -1.73], bakeryShell);
  box([0.94, 0.06, 0.07], cream, [-1.54, 1.84, -1.73], bakeryShell);
  box([1.25, 0.13, 0.3], snow, [-1.54, 1.25, -1.7], bakeryShell);

  const signCanvas = document.createElement("canvas");
  signCanvas.width = 768;
  signCanvas.height = 256;
  const signContext = signCanvas.getContext("2d");
  if (signContext) {
    signContext.fillStyle = "#304d40";
    signContext.fillRect(0, 0, 768, 256);
    signContext.fillStyle = "#f7e4c7";
    signContext.textAlign = "center";
    signContext.textBaseline = "middle";
    signContext.font = "54px Georgia";
    signContext.fillText("Naturally", 384, 90);
    signContext.fillText("Leavened", 384, 166);
  }
  const signTexture = new THREE.CanvasTexture(signCanvas);
  signTexture.colorSpace = THREE.SRGBColorSpace;
  textures.add(signTexture);
  const signpost = group(groundPoint(4.1, 0.7));
  signpost.rotation.y = Math.atan2(0.6 * viewDirection, 0.8);
  box([0.11, 1.16, 0.11], wood, [0, 0.58, 0], signpost);
  box([1.42, 0.58, 0.1], darkWood, [0, 1.08, 0], signpost);
  const sign = mesh(new THREE.PlaneGeometry(1.3, 0.435), material(0xffffff, { map: signTexture }), [0, 1.08, 0.056], signpost);
  box([1.49, 0.065, 0.15], snow, [0, 1.4, 0], signpost);
  sign.castShadow = false;

  const oven = group([0.15, 0.45, -0.93]);
  box([1.5, 0.97, 1.02], berry, [0, 0.49, 0], oven);
  ball(0.76, berry, [0, 0.95, 0], oven).scale.set(1, 0.7, 0.7);
  const opening = new THREE.Shape();
  opening.moveTo(-0.5, 0).lineTo(0.5, 0).lineTo(0.5, 0.43);
  opening.absarc(0, 0.43, 0.5, 0, Math.PI, false);
  opening.closePath();
  const ovenMouth = mesh(new THREE.ShapeGeometry(opening), ink, [0, 0.18, 0.525], oven);
  const fire = box([0.68, 0.09, 0.2], fireMaterial, [0, 0.25, 0.6], oven);
  box([1.67, 0.12, 1.18], cream, [0, 0.12, 0.08], oven);
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 2; x++) box([0.015, 0.012, 0.02], cream, [-0.58 + x * 1.16, 0.35 + y * 0.23, 0.524], oven);
  }
  cylinder(0.24, 0.27, 1.55, darkWood, [0.65, 2.32, -1.15], bakeryShell);
  cylinder(0.32, 0.32, 0.12, cream, [0.65, 3.12, -1.15], bakeryShell);

  box([0.92, 0.82, 0.86], pineDark, [-1.6, 0.87, -0.54]);
  box([1.03, 0.12, 0.94], wood, [-1.6, 1.34, -0.54]);
  ball(0.34, flour, [-1.64, 1.405, -0.55]).scale.set(1, 0.025, 0.7);

  const starter = group([-1.88, 1.40, -0.6]);
  const starterBody = cylinder(0.145, 0.145, 0.32, cream, [0, 0.16, 0], starter);
  const starterLid = cylinder(0.17, 0.17, 0.05, berry, [0, 0.34, 0], starter);
  for (const x of [-0.055, 0.055]) ball(0.014, ink, [x, 0.2, 0.137], starter);
  const starterSmile = tube([[-0.035, 0.15, 0.143], [0, 0.135, 0.146], [0.035, 0.15, 0.143]], 0.008, ink, starter);
  starterSmile.castShadow = false;

  const wreath = mesh(new THREE.TorusGeometry(0.31, 0.092, 8, 24), pine, [0.72, 2.48, -1.74], bakeryShell);
  for (let i = 0; i < 7; i++) {
    const angle = i / 7 * Math.PI * 2;
    ball(0.045, berry, [0.72 + Math.cos(angle) * 0.3, 2.48 + Math.sin(angle) * 0.3, -1.63], bakeryShell);
  }
  wreath.castShadow = false;

  const bell = group([1.12, 2.52, 0.82]);
  const bellShell = mesh(new THREE.CylinderGeometry(0.095, 0.18, 0.22, 18, 1, true), brass, [0, -0.12, 0], bell);
  bellShell.material.side = THREE.DoubleSide;
  const bellLip = mesh(new THREE.TorusGeometry(0.18, 0.024, 5, 20), brass, [0, -0.23, 0], bell);
  bellLip.rotation.x = Math.PI / 2;
  ball(0.035, darkWood, [0, -0.23, 0], bell);

  function tree(x: number, z: number, height: number, decorated = false) {
    const result = group([x, 0.2, z]);
    cylinder(0.09, 0.14, 0.5, darkWood, [0, 0.2, 0], result);
    for (let i = 0; i < 3; i++) {
      const y = height * 0.22 + i * height * 0.24;
      const radius = height * (0.32 - i * 0.067);
      mesh(new THREE.ConeGeometry(radius, height * 0.58, 9), i % 2 ? pine : pineDark, [0, y + height * 0.18, 0], result);
      mesh(new THREE.ConeGeometry(radius * 0.89, height * 0.46, 9), snow, [0, y + height * 0.26, 0], result);
    }
    if (decorated) {
      for (let i = 0; i < 10; i++) {
        const angle = i * 2.4;
        const y = 0.5 + (i % 4) * height * 0.19;
        const radius = (height - y) * 0.28;
        ball(0.065, i % 2 ? berry : brass, [Math.cos(angle) * radius, y, Math.sin(angle) * radius], result);
      }
      mesh(new THREE.OctahedronGeometry(0.16), brass, [0, height * 1.12, 0], result).rotation.z = 0.3;
    }
    return result;
  }
  const largerHouse = houseScale > 1;
  const mainTree = tree(largerHouse ? 2.36 : 2.18, -0.75, 2.6, true);
  const trees = [mainTree, tree(largerHouse ? -3.32 : -3.12, largerHouse ? 1.2 : 1, 1.55), tree(1.47, largerHouse ? -2.82 : -2.7, 1.4)];

  // Loose town details spread along the long drift, clear of the oven and peel.
  const fence = group(groundPoint(6.1, 3.2));
  fence.rotation.y = Math.atan2(0.6 * viewDirection, 0.8) + 0.06;
  for (const x of [-0.8, 0, 0.8]) {
    box([0.075, 0.52, 0.085], wood, [x, 0.26, 0], fence);
    ball(0.075, snow, [x, 0.54, 0], fence).scale.set(1.1, 0.45, 0.85);
  }
  for (const x of [-0.4, 0.4]) {
    box([0.76, 0.055, 0.055], wood, [x, 0.19, 0], fence);
    box([0.76, 0.055, 0.055], wood, [x, 0.4, 0], fence);
    box([0.76, 0.018, 0.065], snow, [x, 0.436, 0], fence);
  }

  const logPile = group(groundPoint(4.6, 2.0));
  logPile.rotation.y = Math.atan2(0.6 * viewDirection, 0.8) - 0.25;
  const logEnd = material(0xd2ad76);
  for (const [x, y, z] of [[-0.13, 0.11, 0], [0.13, 0.11, 0], [0, 0.3, 0.025]] as Point[]) {
    const log = cylinder(0.105, 0.105, 0.62, darkWood, [x, y, z], logPile);
    log.rotation.x = Math.PI / 2;
    const end = cylinder(0.085, 0.085, 0.012, logEnd, [x, y, z + 0.315], logPile);
    end.rotation.x = Math.PI / 2;
  }

  const lantern = group(groundPoint(7.0, 2.5));
  lantern.rotation.y = Math.atan2(0.6 * viewDirection, 0.8) - 0.12;
  const lanternGlass = material(0xf9c77d, { emissive: 0xf1a64a, emissiveIntensity: 1.3, roughness: 0.55 });
  box([0.18, 0.24, 0.18], lanternGlass, [0, 0.2, 0], lantern);
  box([0.25, 0.045, 0.25], ink, [0, 0.06, 0], lantern);
  for (const x of [-0.105, 0.105]) for (const z of [-0.105, 0.105]) {
    box([0.026, 0.29, 0.026], ink, [x, 0.21, z], lantern);
  }
  mesh(new THREE.ConeGeometry(0.19, 0.12, 4), ink, [0, 0.4, 0], lantern).rotation.y = Math.PI / 4;
  const lanternHandle = mesh(new THREE.TorusGeometry(0.085, 0.018, 6, 16), ink, [0, 0.49, 0], lantern);
  lanternHandle.rotation.y = Math.PI / 2;

  const saplingPoint = groundPoint(8.4, 3.8);
  const sapling = tree(saplingPoint[0], saplingPoint[2], 0.68);

  const footprintMaterial = material(0x9aaea7, { transparent: true, opacity: 0.24, depthWrite: false });
  for (let index = 0; index < 9; index++) {
    const progress = index / 8;
    const across = 2.35 + progress * 3.35 + Math.sin(progress * Math.PI) * 0.23;
    const near = 1.05 + progress * 1.7;
    const foot = ball(0.1, footprintMaterial, groundPoint(across + (index % 2 ? 0.09 : -0.09), near, 0.215));
    foot.scale.set(0.65, 0.035, 1.1);
    foot.rotation.y = -0.6 * viewDirection + (index % 2 ? 0.16 : -0.16);
    foot.castShadow = false;
  }

  function gift(position: Point, size: number, surface: THREE.Material, parent: THREE.Object3D = world) {
    const result = group(position, parent);
    box([size, size * 0.72, size], surface, [0, size * 0.36, 0], result);
    box([size + 0.025, 0.04, size * 0.17], brass, [0, size * 0.72, 0], result);
    box([size * 0.14, size * 0.74, size + 0.02], brass, [0, size * 0.36, 0], result);
    mesh(new THREE.TorusGeometry(size * 0.12, 0.025, 5, 12), brass, [0, size * 0.81, 0], result).rotation.y = Math.PI / 2;
    return result;
  }
  const looseProps: LooseProp[] = [
    { id: "present-0", object: gift([2.8, 0.2, 0.05], 0.48, berry), radius: 0.34, label: "Red present" },
    { id: "present-1", object: gift([2.62, 0.2, -0.52], 0.3, pine), radius: 0.24, label: "Green present" },
    { id: "present-2", object: gift([2.04, 0.2, 0.36], 0.46, cream), radius: 0.33, label: "Cream present" },
    { id: "fence", object: fence, radius: 0.87, label: "Snowy fence" },
    { id: "logs", object: logPile, radius: 0.42, label: "Firewood" },
    { id: "lantern", object: lantern, radius: 0.24, label: "Lantern" },
    { id: "sapling", object: sapling, radius: 0.25, label: "Small fir tree" },
    { id: "signpost", object: signpost, radius: 0.75, label: "Move the bakery sign" },
  ];

  const snowPerson = group([2.22, 0.2, 1.7]);
  ball(0.34, snow, [0, 0.34, 0], snowPerson);
  ball(0.25, snow, [0, 0.81, 0], snowPerson);
  for (const x of [-0.085, 0.085]) ball(0.025, ink, [x, 0.85, 0.226], snowPerson);
  mesh(new THREE.ConeGeometry(0.045, 0.18, 10), wood, [0, 0.8, 0.29], snowPerson).rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.24, 0.055, 6, 20), berry, [0, 0.64, 0], snowPerson).rotation.x = Math.PI / 2;
  cylinder(0.3, 0.3, 0.065, darkWood, [0, 1.02, 0], snowPerson);
  ball(0.24, wood, [0, 1.08, 0], snowPerson).scale.y = 0.65;
  tube([[-0.25, 0.52, 0], [-0.5, 0.68, 0], [-0.62, 0.84, 0]], 0.025, darkWood, snowPerson);
  tube([[0.25, 0.52, 0], [0.48, 0.68, 0], [0.59, 0.67, 0]], 0.025, darkWood, snowPerson);

  const meltedSnow = group([0.15, 0.64, -0.16]);
  const water = material(0x8bbdc3, { roughness: 0.3, metalness: 0.06 });
  const puddle = ball(0.7, water, [0, 0, 0], meltedSnow);
  puddle.scale.set(1.15, 0.04, 0.8);
  const fallenHat = group([0.19, 0.035, -0.04], meltedSnow);
  fallenHat.rotation.z = -0.12;
  cylinder(0.3, 0.3, 0.065, darkWood, [0, 0, 0], fallenHat);
  ball(0.24, wood, [0, 0.065, 0], fallenHat).scale.y = 0.65;
  const fallenCarrot = mesh(new THREE.ConeGeometry(0.055, 0.23, 10), material(0xd58032), [-0.27, 0.06, 0.2], meltedSnow);
  fallenCarrot.rotation.z = Math.PI / 2;
  tube([[-0.35, 0.035, -0.15], [-0.12, 0.035, -0.24], [0.03, 0.035, -0.3]], 0.023, darkWood, meltedSnow);
  meltedSnow.visible = false;

  box([1.42, 0.045, 1.14], darkWood, [-0.65, 0.29, 1.68]);
  box([0.14, 0.05, 1.14], wood, [-0.65, 0.28, 2.63]);

  // A subtle seeded texture makes the loaf read as flour and crust at close range.
  const crustCanvas = document.createElement("canvas");
  crustCanvas.width = crustCanvas.height = 256;
  const crustContext = crustCanvas.getContext("2d");
  if (crustContext) {
    crustContext.fillStyle = "#e9d8b6";
    crustContext.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2400; i++) {
      crustContext.fillStyle = `rgba(${random() > 0.5 ? "255,245,211" : "122,83,41"},${0.06 + random() * 0.12})`;
      crustContext.fillRect(random() * 256, random() * 256, 1 + random() * 3, 1 + random() * 2);
    }
  }
  const crustTexture = new THREE.CanvasTexture(crustCanvas);
  crustTexture.colorSpace = THREE.SRGBColorSpace;
  textures.add(crustTexture);
  const loafMaterial = material(0xffedc9, { map: crustTexture, roughness: 0.95 });
  const scoreMaterial = material(0x9d794e);
  const scoreInnerMaterial = material(0xf2dba8);
  const activeLoaf = group([-0.65, 0.33, 1.68]);
  ball(0.49, loafMaterial, [0, 0.27, 0], activeLoaf).scale.set(1, 0.65, 0.79);
  const scoreGroup = group([0, 0, 0], activeLoaf);

  function loafSurface(x: number, z: number): Point {
    const radius = Math.max(0.02, 1 - (x / 0.49) ** 2 - (z / 0.387) ** 2);
    return [x, 0.27 + 0.3185 * Math.sqrt(radius) + 0.008, z];
  }

  function addScorePath(points: [number, number][]) {
    const surface = points.map(([x, z]) => loafSurface(x, z));
    tube(surface, 0.015, scoreMaterial, scoreGroup);
    tube(surface.map(([x, y, z]) => [x, y + 0.006, z]), 0.006, scoreInnerMaterial, scoreGroup);
  }

  addScorePath([[0, -0.28], [0, 0], [0, 0.28]]);
  for (const z of [-0.15, -0.02, 0.11]) {
    addScorePath([[0, z + 0.03], [-0.1, z - 0.025], [-0.19, z - 0.08]]);
    addScorePath([[0, z + 0.03], [0.1, z - 0.025], [0.19, z - 0.08]]);
  }

  const flourPositions = new Float32Array(110 * 3);
  for (let i = 0; i < 110; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * 0.85;
    const point = loafSurface(Math.cos(angle) * radius * 0.49, Math.sin(angle) * radius * 0.387);
    flourPositions.set(point, i * 3);
  }
  const loafFlourGeometry = new THREE.BufferGeometry();
  loafFlourGeometry.setAttribute("position", new THREE.BufferAttribute(flourPositions, 3));
  geometries.add(loafFlourGeometry);
  const loafFlourMaterial = new THREE.PointsMaterial({ color: 0xfff5dc, size: 2.3, transparent: true, opacity: 0.7, depthWrite: false });
  materials.add(loafFlourMaterial);
  const loafFlour = new THREE.Points(loafFlourGeometry, loafFlourMaterial);
  activeLoaf.add(loafFlour);

  const snowCanvas = document.createElement("canvas");
  snowCanvas.width = snowCanvas.height = 32;
  const snowContext = snowCanvas.getContext("2d");
  if (snowContext) {
    const gradient = snowContext.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.45, "rgba(255,255,255,.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    snowContext.fillStyle = gradient;
    snowContext.fillRect(0, 0, 32, 32);
  }
  const snowTexture = new THREE.CanvasTexture(snowCanvas);
  textures.add(snowTexture);
  const snowSeeds = Array.from({ length: 190 }, () => ({ radius: Math.sqrt(random()) * 3.8, angle: random() * Math.PI * 2, height: random() * 4.4, speed: 0.18 + random() * 0.35 }));
  const snowPositions = new Float32Array(snowSeeds.length * 3);
  const snowGeometry = new THREE.BufferGeometry();
  snowGeometry.setAttribute("position", new THREE.BufferAttribute(snowPositions, 3));
  geometries.add(snowGeometry);
  const snowMaterial = new THREE.PointsMaterial({ color: 0xf6f3e5, size: 2.5, transparent: true, opacity: 0.55, map: snowTexture, depthWrite: false });
  materials.add(snowMaterial);
  const snowfall = new THREE.Points(snowGeometry, snowMaterial);
  snowfall.frustumCulled = false;
  world.add(snowfall);

  const puffGeometry = new THREE.SphereGeometry(0.1, 8, 6);
  const puffMaterial = new THREE.MeshBasicMaterial({ color: 0xe6e4d8, transparent: true, opacity: 0.2, depthWrite: false });
  const puffs = Array.from({ length: 9 }, () => {
    const puff = mesh(puffGeometry, puffMaterial);
    puff.castShadow = puff.receiveShadow = false;
    return puff;
  });

  return {
    world, bakeryShell, windowMaterial, fire, activeLoaf, loafMaterial, scoreMaterial,
    scoreInnerMaterial, scoreGroup, loafFlour, oven, ovenMouth, mainTree, trees,
    snowPerson, meltedSnow, starter, starterBody, starterLid, bell, puffs, looseProps,
    snowfall, snowGeometry, snowPositions, snowSeeds,
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((surface) => surface.dispose());
      textures.forEach((texture) => texture.dispose());
      world.clear();
    },
  };
}
