import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// Load fonts
const fontLoader = new FontLoader();
fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Ramdan Kareem", {
    font,
    size: 2.4,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });

  textGeometry.center();
  const textMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

const canvas = document.querySelector(".webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Background
const spaceTexture = new THREE.TextureLoader().load("/space.jpg");
scene.background = spaceTexture;

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 26;
scene.add(camera);

// Torus

const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });

const torus1 = new THREE.Mesh(torusGeometry, torusMaterial);
const torus2 = new THREE.Mesh(torusGeometry, torusMaterial);
torus1.position.x = 30;
torus2.position.x = -30;

scene.add(torus1);
scene.add(torus2);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Controls
// @ts-ignore
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Stars
const geometry = new THREE.SphereBufferGeometry(0.25, 24, 24);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

function addStar() {
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(1200).fill().forEach(addStar);

const tick = () => {
  controls.update();

  torus1.rotation.x += 0.01;
  torus1.rotation.y += 0.005;
  torus1.rotation.z += 0.01;
  
  torus2.rotation.x += 0.01;
  torus2.rotation.y += 0.005;
  torus2.rotation.z += 0.01;

  // Render
  renderer.render(scene, camera);

  // run the function after each render
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});
