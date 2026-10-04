import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { GLTFCar } from './GLTFCar.js';

/**
 * CarScene manages the Three.js 3D viewport, cinematic showroom environment,
 * studio lighting, reflective floor, camera animations, and car instance.
 */
export class CarScene {
  constructor(containerElement, onLoadedCallback, onProgressCallback) {
    this.container = containerElement;
    this.onLoaded = onLoadedCallback;
    this.onProgressCallback = onProgressCallback;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.car = null;
    this.reqId = null;
    this.isInteriorMode = false;

    // Camera preset positions and lookAt targets
    this.cameraPresets = {
      default: { pos: new THREE.Vector3(3.6, 1.6, 4.4), target: new THREE.Vector3(0, 0.45, 0), isInterior: false },
      front: { pos: new THREE.Vector3(0, 1.1, 4.8), target: new THREE.Vector3(0, 0.45, 0), isInterior: false },
      '3/4': { pos: new THREE.Vector3(3.6, 1.6, 4.4), target: new THREE.Vector3(0, 0.45, 0), isInterior: false },
      side: { pos: new THREE.Vector3(-4.8, 1.2, 0), target: new THREE.Vector3(0, 0.45, 0), isInterior: false },
      rear: { pos: new THREE.Vector3(-2.8, 1.4, -4.2), target: new THREE.Vector3(0, 0.45, 0), isInterior: false },
      interior: { pos: new THREE.Vector3(-0.35, 0.88, 0.15), target: new THREE.Vector3(-0.1, 0.76, 1.15), isInterior: true },
    };

    this._init();
  }

  _init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Cinematic Studio Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07090e);
    this.scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    // 2. Camera (Cinematic 40° FOV)
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.copy(this.cameraPresets.default.pos);

    // 3. High-Performance WebGL Renderer with ACESFilmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls with Smooth Damping
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minPolarAngle = 0.1;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 11.0;
    this.controls.target.copy(this.cameraPresets.default.target);
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.85;

    // 5. Studio Environment & Cinematic Lighting
    this._setupStudioLighting();
    this._setupShowroomFloor();

    // 6. Spawn GLTF / GLB Sports Car with Fallback
    this.car = new GLTFCar({
      modelUrl: '/src/assets/models/car.glb',
      onProgress: (percent) => {
        if (this.onProgressCallback) this.onProgressCallback(percent);
      },
      onLoaded: () => {
        if (this.onLoaded) this.onLoaded();
      },
    });
    this.scene.add(this.car.group);

    // 7. Event Listeners
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    // 8. Start Render Loop
    this._animate();
  }

  _setupStudioLighting() {
    // 1. Soft Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // 2. Main Key Directional Light (Overhead 45° with Crisp Soft Shadows)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 12, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0003;
    this.scene.add(keyLight);

    // 3. Strong Cyan/Electric Blue Rim Light Behind the Car
    const rimLightRear = new THREE.DirectionalLight(0x00f0ff, 2.2);
    rimLightRear.position.set(-7, 6, -6);
    this.scene.add(rimLightRear);

    // 4. Warm Silver Fill Light on Opposite Side
    const fillLightWarm = new THREE.DirectionalLight(0xffe8dc, 1.2);
    fillLightWarm.position.set(6, 4, -5);
    this.scene.add(fillLightWarm);

    // 5. Front Nose Accent Point Light
    const frontNoseLight = new THREE.PointLight(0xffffff, 1.5, 12);
    frontNoseLight.position.set(0, 1.6, 4.8);
    this.scene.add(frontNoseLight);

    // 6. Overhead Softbox Light Panel Simulation
    const softboxGeo = new THREE.PlaneGeometry(3.5, 9.0);
    const softboxMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const softbox = new THREE.Mesh(softboxGeo, softboxMat);
    softbox.rotation.x = Math.PI / 2;
    softbox.position.set(0, 6.5, 0);
    this.scene.add(softbox);
  }

  _setupShowroomFloor() {
    // 1. Large Dark Reflective Studio Floor
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090b10,
      roughness: 0.16,
      metalness: 0.9,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Circular Studio Floor Light Rings
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.63, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.005;
    this.scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(5.4, 5.42, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.004;
    this.scene.add(ring2);

    // 3. Contact Shadow Radial Fade Plane under car
    const shadowGeo = new THREE.PlaneGeometry(3.4, 5.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.003;
    this.scene.add(contactShadow);
  }

  setCameraPreset(presetName, onComplete) {
    const key = presetName.toLowerCase();
    const preset =
      this.cameraPresets[key] ||
      (key === '3/4' ? this.cameraPresets.default : this.cameraPresets.default);

    this.isInteriorMode = Boolean(preset.isInterior);

    // If switching to interior view, adjust control constraints
    if (this.isInteriorMode) {
      this.controls.minDistance = 0.05;
      this.controls.maxDistance = 1.8;
      this.controls.maxPolarAngle = Math.PI - 0.1;
      this.controls.minPolarAngle = 0.1;
    } else {
      this.controls.minDistance = 2.0;
      this.controls.maxDistance = 11.0;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
      this.controls.minPolarAngle = 0.1;
    }

    gsap.to(this.camera.position, {
      x: preset.pos.x,
      y: preset.pos.y,
      z: preset.pos.z,
      duration: 1.4,
      ease: 'power3.inOut',
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    gsap.to(this.controls.target, {
      x: preset.target.x,
      y: preset.target.y,
      z: preset.target.z,
      duration: 1.4,
      ease: 'power3.inOut',
    });
  }

  setAutoRotate(enabled) {
    if (this.controls) {
      this.controls.autoRotate = enabled;
    }
  }

  resetCamera() {
    this.setCameraPreset('default');
  }

  _onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _animate() {
    this.reqId = requestAnimationFrame(() => this._animate());

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.reqId) {
      cancelAnimationFrame(this.reqId);
    }
    window.removeEventListener('resize', this._onResize);

    if (this.car && this.car.destroy) {
      this.car.destroy();
    }

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
