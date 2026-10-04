import * as THREE from 'three';
import { createLightingRig, LightingRig } from './lighting';

export interface SceneEngine {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  lighting: LightingRig;
  floorGroup: THREE.Group;
  resize: (width: number, height: number) => void;
  render: (camera: THREE.Camera) => void;
  dispose: () => void;
}

export function createSceneEngine(canvas: HTMLCanvasElement): SceneEngine {
  // 1. Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06080d);
  scene.fog = new THREE.FogExp2(0x06080d, 0.045);

  // 2. Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 3. Studio Environment Map for Reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0f1d);

  // Add warm and cool soft studio light panels to the env map
  const studioLight1 = new THREE.DirectionalLight(0xffffff, 4.0);
  studioLight1.position.set(0, 10, 0);
  envScene.add(studioLight1);

  const studioLight2 = new THREE.DirectionalLight(0x00f0ff, 2.5);
  studioLight2.position.set(8, 4, 8);
  envScene.add(studioLight2);

  const studioLight3 = new THREE.DirectionalLight(0xff4466, 1.8);
  studioLight3.position.set(-8, 3, -8);
  envScene.add(studioLight3);

  const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
  scene.environment = envTexture;
  pmremGenerator.dispose();

  // 4. Lighting Rig
  const lighting = createLightingRig();
  scene.add(lighting.group);

  // 5. Showroom Floor & Realistic Contact Shadow
  const floorGroup = new THREE.Group();
  floorGroup.name = 'ShowroomFloor';

  // Realistic contact shadow plane under the SUV chassis
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.65)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(5.8, 3.8);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.005; // tiny offset above floor
  floorGroup.add(shadowMesh);

  // Main Showroom Turntable Platform
  const floorGeo = new THREE.CircleGeometry(16, 64);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x090c14,
    metalness: 0.85,
    roughness: 0.35,
    roughnessMap: null,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = 0;
  floorMesh.receiveShadow = true;
  floorGroup.add(floorMesh);

  // Glowing Cyber Accent Rings on Showroom Floor
  const ringGeo1 = new THREE.RingGeometry(2.8, 2.82, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });
  const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
  ringMesh1.rotation.x = -Math.PI / 2;
  ringMesh1.position.y = 0.008;
  floorGroup.add(ringMesh1);

  const ringGeo2 = new THREE.RingGeometry(4.2, 4.215, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.x = -Math.PI / 2;
  ringMesh2.position.y = 0.008;
  floorGroup.add(ringMesh2);

  scene.add(floorGroup);

  const resize = (width: number, height: number) => {
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const render = (camera: THREE.Camera) => {
    renderer.render(scene, camera);
  };

  const dispose = () => {
    lighting.dispose();
    renderer.dispose();
    envTexture.dispose();
    shadowGeo.dispose();
    shadowMat.dispose();
    shadowTexture.dispose();
    floorGeo.dispose();
    floorMat.dispose();
    ringGeo1.dispose();
    ringMat1.dispose();
    ringGeo2.dispose();
    ringMat2.dispose();
  };

  return {
    scene,
    renderer,
    lighting,
    floorGroup,
    resize,
    render,
    dispose,
  };
}
