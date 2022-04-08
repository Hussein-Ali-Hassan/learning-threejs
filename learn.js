import './style.css'

import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const gui = new dat.GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector(".webgl");

// Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

// Scene
const scene = new THREE.Scene();

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper)

// Object
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);
// const material = new THREE.MeshBasicMaterial({ color: "red", wireframe: true });
const material = new THREE.MeshNormalMaterial({flatShading: true})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Grid
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

function addStar() {
  const geometry = new THREE.SphereBufferGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar)

// Animations
  gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
  gsap.to(mesh.position, {x: 0, duration: 1, delay: 2});
  gsap.to(mesh.position, {y: 2, duration: 1, delay: 3});
  gsap.to(mesh.position, {y: 0, duration: 1, delay: 4});

// let time = Date.now();
const clock = new THREE.Clock();


const tick = () => {
  // Time
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;

  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.rotation.z =Math.sin(elapsedTime)
  mesh.rotation.y =Math.sin(elapsedTime)
  mesh.rotation.x = Math.cos(elapsedTime)

  // Update camera
  // camera.position.x = Math.sin(cursor.x * 10) * 3
  // camera.position.z = Math.cos(cursor.x * 10) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)

  controls.update();

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

window.addEventListener("dblclick", () => {
  const fullScreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullScreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});
