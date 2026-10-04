import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ProceduralCar } from './ProceduralCar.js';

/**
 * GLTFCar handles loading of the real car.glb sports car model from src/assets/models/car.glb,
 * provides automatic bounding-box scaling, centering, ground placement, shadow mapping,
 * and comprehensive recursive material classification for dynamic customization.
 * Falls back cleanly to ProceduralCar when car.glb is missing.
 */
export class GLTFCar {
  constructor(options = {}) {
    // Primary path requested: src/assets/models/car.glb (with fallback URLs)
    this.primaryModelUrl = options.modelUrl || '/src/assets/models/car.glb';
    this.fallbackUrls = ['/models/car.glb', './src/assets/models/car.glb'];

    this.onProgress = options.onProgress || null;
    this.onLoaded = options.onLoaded || null;

    this.group = new THREE.Group();
    this.group.name = 'VeloX_Car_Root';

    this.isUsingFallback = false;
    this.fallbackCar = null;
    this.loadedModel = null;

    // Categorized mesh arrays for real GLB model
    this.meshes = {
      body: [],
      glass: [],
      tires: [],
      rims: [],
      calipers: [],
      rotors: [],
      interior: [],
      headlights: [],
      taillights: [],
      carbon: [],
      chrome: [],
    };

    // Physical PBR Materials Collection
    this.materials = {};

    this._initMaterials();
    this._loadModel(this.primaryModelUrl);
  }

  _initMaterials() {
    // 1. Automotive Paint Material (Physical Clearcoat)
    this.materials.body = new THREE.MeshPhysicalMaterial({
      color: 0x0a0c0f,
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      envMapIntensity: 1.3,
    });

    // 2. Realistic Automotive Glass
    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0x0a101d,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.72,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      thickness: 0.4,
    });

    // 3. Satin Performance Rubber for Tires
    this.materials.tires = new THREE.MeshStandardMaterial({
      color: 0x141518,
      metalness: 0.05,
      roughness: 0.82,
    });

    // 4. Wheel Rims (Alloy/Forged Metallic)
    this.materials.rims = new THREE.MeshStandardMaterial({
      color: 0xd8dde6,
      metalness: 0.95,
      roughness: 0.18,
    });

    // 5. Brake Calipers (Brembo Racing Paint)
    this.materials.calipers = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.7,
      roughness: 0.25,
    });

    // 6. Cross-Drilled Steel Brake Rotors
    this.materials.rotors = new THREE.MeshStandardMaterial({
      color: 0x88929e,
      metalness: 0.95,
      roughness: 0.22,
    });

    // 7. Cockpit Interior Upholstery
    this.materials.interior = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      metalness: 0.15,
      roughness: 0.65,
    });

    // 8. Matrix LED Headlights
    this.materials.headlights = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 4.5,
      metalness: 0.1,
      roughness: 0.1,
    });

    // 9. OLED Taillights
    this.materials.taillights = new THREE.MeshStandardMaterial({
      color: 0xff0022,
      emissive: 0xff0022,
      emissiveIntensity: 5.0,
      metalness: 0.2,
      roughness: 0.15,
    });

    // 10. Carbon Fiber Aero Trim
    this.materials.carbon = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.35,
      roughness: 0.45,
    });

    // 11. Chrome / Polished Metal
    this.materials.chrome = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 1.0,
      roughness: 0.04,
    });
  }

  _loadModel(url, fallbackIdx = 0) {
    const loader = new GLTFLoader();

    loader.load(
      url,
      // onLoad
      (gltf) => {
        if (import.meta.env.DEV) {
          console.log('Real car.glb loaded successfully');
        }
        this._setupLoadedModel(gltf.scene);
        if (this.onProgress) this.onProgress(100);
        if (this.onLoaded) this.onLoaded(this);
      },
      // onProgress
      (xhr) => {
        if (xhr.lengthComputable && this.onProgress) {
          const percent = Math.min(Math.round((xhr.loaded / xhr.total) * 100), 100);
          this.onProgress(percent);
        }
      },
      // onError
      (error) => {
        // Try alternate fallback URL if available before going procedural
        if (fallbackIdx < this.fallbackUrls.length) {
          const nextUrl = this.fallbackUrls[fallbackIdx];
          this._loadModel(nextUrl, fallbackIdx + 1);
        } else {
          if (import.meta.env.DEV) {
            console.warn('car.glb not found — using procedural fallback.');
          }
          this._setupFallback();
          if (this.onProgress) this.onProgress(100);
          if (this.onLoaded) this.onLoaded(this);
        }
      }
    );
  }

  _setupLoadedModel(modelScene) {
    this.isUsingFallback = false;
    this.loadedModel = modelScene;

    // 1. Calculate bounding box of loaded car model
    const box = new THREE.Box3().setFromObject(modelScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 2. Scale model automatically to ~4.6 meters showroom proportions
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetLength = 4.6;
    const scaleFactor = maxDim > 0 ? targetLength / maxDim : 1;

    modelScene.scale.setScalar(scaleFactor);

    // 3. Center model horizontally and place perfectly on showroom floor
    modelScene.position.x = -center.x * scaleFactor;
    modelScene.position.z = -center.z * scaleFactor;
    modelScene.position.y = -box.min.y * scaleFactor;

    // 4. Recursive inspection of mesh hierarchy & material system
    modelScene.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows & culling optimization
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;

        const name = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();
        const tag = `${name}_${matName}`;

        // Material Classification
        if (/glass|window|windshield|windscreen|glazing|visor/.test(tag)) {
          child.material = this.materials.glass;
          this.meshes.glass.push(child);
        } else if (/tire|tyre|rubber/.test(tag)) {
          child.material = this.materials.tires;
          this.meshes.tires.push(child);
        } else if (/rim|spoke|hub|alloy|wheel/.test(tag)) {
          child.material = this.materials.rims;
          this.meshes.rims.push(child);
        } else if (/caliper|brembo|brake_pad|brake_caliper/.test(tag)) {
          child.material = this.materials.calipers;
          this.meshes.calipers.push(child);
        } else if (/rotor|disc|brake_disc/.test(tag)) {
          child.material = this.materials.rotors;
          this.meshes.rotors.push(child);
        } else if (/headlight|head_light|drl|lamp|front_light/.test(tag)) {
          child.material = this.materials.headlights;
          this.meshes.headlights.push(child);
        } else if (/taillight|tail_light|brake_light|rear_light/.test(tag)) {
          child.material = this.materials.taillights;
          this.meshes.taillights.push(child);
        } else if (/interior|seat|cockpit|dash|steering|upholstery/.test(tag)) {
          child.material = this.materials.interior;
          this.meshes.interior.push(child);
        } else if (/carbon|diffuser|splitter|spoiler|grille|intake/.test(tag)) {
          child.material = this.materials.carbon;
          this.meshes.carbon.push(child);
        } else if (/chrome|mirror|exhaust|silver|metal/.test(tag)) {
          child.material = this.materials.chrome;
          this.meshes.chrome.push(child);
        } else {
          // Default to high-gloss automotive body paint
          child.material = this.materials.body;
          this.meshes.body.push(child);
        }
      }
    });

    this.group.add(modelScene);
  }

  _setupFallback() {
    this.isUsingFallback = true;
    this.fallbackCar = new ProceduralCar();
    this.group.add(this.fallbackCar.group);
  }

  // ==========================================
  // DYNAMIC CUSTOMIZATION API
  // ==========================================

  setExteriorColor(colorConfig) {
    if (!colorConfig) return;

    if (this.isUsingFallback && this.fallbackCar) {
      this.fallbackCar.setExteriorColor(colorConfig);
      return;
    }

    const targetColor = new THREE.Color(colorConfig.threeColor);

    // Smooth GSAP Color Transition on GLB Body Mesh
    gsap.to(this.materials.body.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.body.needsUpdate = true;
      },
    });

    gsap.to(this.materials.body, {
      roughness: colorConfig.roughness ?? 0.12,
      metalness: colorConfig.metalness ?? 0.92,
      clearcoat: colorConfig.clearcoat ?? 1.0,
      clearcoatRoughness: colorConfig.clearcoatRoughness ?? 0.03,
      duration: 0.65,
      ease: 'power2.out',
    });
  }

  setWheelType(wheelConfig) {
    if (!wheelConfig) return;

    if (this.isUsingFallback && this.fallbackCar) {
      this.fallbackCar.setWheelType(wheelConfig);
      return;
    }

    const targetColor = new THREE.Color(wheelConfig.finishColor || 0xd8dde6);

    gsap.to(this.materials.rims.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.rims.needsUpdate = true;
      },
    });

    gsap.to(this.materials.rims, {
      metalness: wheelConfig.metalness ?? 0.95,
      roughness: wheelConfig.roughness ?? 0.18,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  setBrakeCaliper(caliperConfig) {
    if (!caliperConfig) return;

    if (this.isUsingFallback && this.fallbackCar) {
      this.fallbackCar.setBrakeCaliper(caliperConfig);
      return;
    }

    const targetColor = new THREE.Color(caliperConfig.threeColor);

    gsap.to(this.materials.calipers.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.calipers.needsUpdate = true;
      },
    });
  }

  setInterior(interiorConfig) {
    if (!interiorConfig) return;

    if (this.isUsingFallback && this.fallbackCar) {
      this.fallbackCar.setInterior(interiorConfig);
      return;
    }

    const targetColor = new THREE.Color(interiorConfig.threeColor);

    gsap.to(this.materials.interior.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.interior.needsUpdate = true;
      },
    });
  }

  setHeadlights(enabled) {
    if (this.isUsingFallback && this.fallbackCar) {
      this.fallbackCar.setHeadlights(enabled);
      return;
    }

    const intensity = enabled ? 4.5 : 0.4;

    gsap.to(this.materials.headlights, {
      emissiveIntensity: intensity,
      duration: 0.4,
    });
    gsap.to(this.materials.taillights, {
      emissiveIntensity: intensity,
      duration: 0.4,
    });
  }

  destroy() {
    if (this.fallbackCar && this.fallbackCar.destroy) {
      this.fallbackCar.destroy();
    }
    Object.values(this.materials).forEach((mat) => {
      if (mat && mat.dispose) mat.dispose();
    });
  }
}
