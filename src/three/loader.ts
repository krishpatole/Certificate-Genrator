import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { BodyColorOption, WheelOption, BrakeOption, InteriorOption, RoofOption } from '../types/car';

export interface SUVModelManager {
  root: THREE.Group;
  loaded: boolean;
  meshes: {
    body: THREE.Mesh[];
    roof: THREE.Mesh[];
    rims: THREE.Mesh[];
    brakes: THREE.Mesh[];
    interior: THREE.Mesh[];
    glass: THREE.Mesh[];
    headlights: THREE.Mesh[];
    taillights: THREE.Mesh[];
    tires: THREE.Mesh[];
  };
  materials: {
    body: THREE.MeshPhysicalMaterial;
    roof: THREE.MeshPhysicalMaterial;
    glass: THREE.MeshPhysicalMaterial;
    rims: THREE.MeshStandardMaterial;
    brakes: THREE.MeshStandardMaterial;
    interior: THREE.MeshStandardMaterial;
    tires: THREE.MeshStandardMaterial;
    headlights: THREE.MeshStandardMaterial;
    taillights: THREE.MeshStandardMaterial;
  };
  setBodyColor: (color: BodyColorOption) => void;
  setRoofOption: (roof: RoofOption, currentColor?: BodyColorOption) => void;
  setWheelOption: (wheel: WheelOption) => void;
  setBrakeOption: (brake: BrakeOption) => void;
  setInteriorOption: (interior: InteriorOption) => void;
  setHeadlights: (enabled: boolean) => void;
  pulseHighlight: (componentName: string) => void;
  dispose: () => void;
}

export function loadSUVModel(
  onProgress?: (percent: number) => void,
  onComplete?: (manager: SUVModelManager) => void
): SUVModelManager {
  const root = new THREE.Group();
  root.name = 'Audi_Q3_SUV_Root';

  let loaded = false;

  // Initialize PBR Master Materials
  const materials = {
    // 1. Ultra-deep metallic automotive clearcoat paint
    body: new THREE.MeshPhysicalMaterial({
      color: 0x0b0d11,
      metalness: 0.94,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      envMapIntensity: 1.4,
    }),

    // 2. Roof material (defaults to body paint, can switch to piano black)
    roof: new THREE.MeshPhysicalMaterial({
      color: 0x0b0d11,
      metalness: 0.94,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      envMapIntensity: 1.4,
    }),

    // 3. Realistic tinted automotive glass
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x08101a,
      metalness: 0.15,
      roughness: 0.04,
      transmission: 0.75,
      transparent: true,
      opacity: 0.88,
      ior: 1.52,
      thickness: 0.45,
      envMapIntensity: 1.5,
    }),

    // 4. Alloy Rims
    rims: new THREE.MeshStandardMaterial({
      color: 0xd8dde6,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 1.3,
    }),

    // 5. Performance Brake Calipers & Discs
    brakes: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.75,
      roughness: 0.22,
    }),

    // 6. Luxury Nappa Leather Cockpit
    interior: new THREE.MeshStandardMaterial({
      color: 0x151619,
      metalness: 0.12,
      roughness: 0.62,
    }),

    // 7. Tire Rubber
    tires: new THREE.MeshStandardMaterial({
      color: 0x16171a,
      metalness: 0.08,
      roughness: 0.85,
    }),

    // 8. Matrix LED Headlights
    headlights: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 4.8,
      metalness: 0.2,
      roughness: 0.1,
    }),

    // 9. OLED Taillights
    taillights: new THREE.MeshStandardMaterial({
      color: 0xff002b,
      emissive: 0xff0022,
      emissiveIntensity: 4.5,
      metalness: 0.2,
      roughness: 0.1,
    }),
  };

  const meshes: SUVModelManager['meshes'] = {
    body: [],
    roof: [],
    rims: [],
    brakes: [],
    interior: [],
    glass: [],
    headlights: [],
    taillights: [],
    tires: [],
  };

  const loader = new GLTFLoader();
  const modelUrls = ['/models/car.glb', './src/assets/models/car.glb'];

  const tryLoad = (index: number) => {
    if (index >= modelUrls.length) {
      console.warn('Failed to load SUV model from all paths.');
      return;
    }

    const url = modelUrls[index];

    loader.load(
      url,
      (gltf) => {
        const scene = gltf.scene;

        // Calculate bounding box and center perfectly
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Normalize SUV length to ~4.8 meters
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.8 / maxDim;
        scene.scale.setScalar(scale);

        // Place wheels flush on floor (Y = 0) and center on X, Z
        scene.position.x = -center.x * scale;
        scene.position.z = -center.z * scale;
        scene.position.y = -box.min.y * scale;

        // Traverse & categorize meshes by name & material tags
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = true;

            const name = (mesh.name || '').toLowerCase();
            const origMatName = Array.isArray(mesh.material)
              ? mesh.material.map((m) => (m.name || '').toLowerCase()).join(' ')
              : (mesh.material?.name || '').toLowerCase();
            const tag = `${name}_${origMatName}`;

            // Check categorization
            if (/roof_glass|windshild|d_glass|glass|window|hl_cover/.test(tag)) {
              mesh.material = materials.glass;
              meshes.glass.push(mesh);
            } else if (/polySurface5788|roof/.test(name) && /carpaint/.test(tag)) {
              mesh.material = materials.roof;
              meshes.roof.push(mesh);
            } else if (/tyre_nor|tyre|tire|rubber/.test(tag)) {
              mesh.material = materials.tires;
              meshes.tires.push(mesh);
            } else if (/break|disc|disk|caliper/.test(tag)) {
              mesh.material = materials.brakes;
              meshes.brakes.push(mesh);
            } else if (/alloy|rim|wheel|hub|spoke/.test(tag)) {
              mesh.material = materials.rims;
              meshes.rims.push(mesh);
            } else if (/seat|leather|interior|cockpit|dash|upholstery|carpet/.test(tag)) {
              mesh.material = materials.interior;
              meshes.interior.push(mesh);
            } else if (/hl|headlight|lamp|projection/.test(tag) && !/tail/.test(tag)) {
              mesh.material = materials.headlights;
              meshes.headlights.push(mesh);
            } else if (/tail_lamp|tail_inner|tail_upper|taillight/.test(tag)) {
              mesh.material = materials.taillights;
              meshes.taillights.push(mesh);
            } else if (/carpaint|car_paint|boot_ext|piano_black/.test(tag)) {
              mesh.material = materials.body;
              meshes.body.push(mesh);
            } else if (mesh.material) {
              // Retain or enhance metallic surfaces
              if (/chrome|silver|metal/.test(tag)) {
                mesh.material = materials.rims;
              }
            }
          }
        });

        root.add(scene);
        loaded = true;

        if (onProgress) onProgress(100);
        if (onComplete) onComplete(manager);
      },
      (xhr) => {
        if (xhr.lengthComputable && onProgress) {
          const pct = Math.min(Math.round((xhr.loaded / xhr.total) * 100), 99);
          onProgress(pct);
        }
      },
      (error) => {
        console.warn(`Attempt ${index + 1} failed for ${url}:`, error);
        tryLoad(index + 1);
      }
    );
  };

  tryLoad(0);

  // Customization methods with smooth GSAP transitions
  const setBodyColor = (color: BodyColorOption) => {
    const target = new THREE.Color(color.threeColor);

    // Animate body paint color
    gsap.to(materials.body.color, {
      r: target.r,
      g: target.g,
      b: target.b,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        materials.body.needsUpdate = true;
      },
    });

    // Also update roof if not black contrast
    if (materials.roof.color.getHex() !== 0x050608) {
      gsap.to(materials.roof.color, {
        r: target.r,
        g: target.g,
        b: target.b,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          materials.roof.needsUpdate = true;
        },
      });
    }

    gsap.to(materials.body, {
      roughness: color.roughness ?? 0.12,
      metalness: color.metalness ?? 0.94,
      clearcoat: color.clearcoat ?? 1.0,
      clearcoatRoughness: color.clearcoatRoughness ?? 0.03,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  const setRoofOption = (roof: RoofOption, currentColor?: BodyColorOption) => {
    const isBlack = roof.id === 'black';
    const targetHex = isBlack ? 0x08090c : currentColor ? currentColor.threeColor : 0x0b0d11;
    const targetColor = new THREE.Color(targetHex);

    gsap.to(materials.roof.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        materials.roof.needsUpdate = true;
      },
    });

    gsap.to(materials.roof, {
      roughness: isBlack ? 0.08 : currentColor?.roughness ?? 0.12,
      metalness: isBlack ? 0.95 : currentColor?.metalness ?? 0.94,
      clearcoat: 1.0,
      duration: 0.5,
    });
  };

  const setWheelOption = (wheel: WheelOption) => {
    const targetColor = new THREE.Color(wheel.color);

    gsap.to(materials.rims.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        materials.rims.needsUpdate = true;
      },
    });

    gsap.to(materials.rims, {
      metalness: wheel.metalness,
      roughness: wheel.roughness,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const setBrakeOption = (brake: BrakeOption) => {
    const targetColor = new THREE.Color(brake.threeColor);

    gsap.to(materials.brakes.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        materials.brakes.needsUpdate = true;
      },
    });
  };

  const setInteriorOption = (interior: InteriorOption) => {
    const targetColor = new THREE.Color(interior.primaryColor);

    gsap.to(materials.interior.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        materials.interior.needsUpdate = true;
      },
    });
  };

  const setHeadlights = (enabled: boolean) => {
    const intensity = enabled ? 4.8 : 0.4;
    gsap.to(materials.headlights, {
      emissiveIntensity: intensity,
      duration: 0.4,
    });
    gsap.to(materials.taillights, {
      emissiveIntensity: intensity,
      duration: 0.4,
    });
  };

  const pulseHighlight = (componentKey: string) => {
    let targetMat: THREE.Material | null = null;
    if (componentKey === 'headlights') targetMat = materials.headlights;
    else if (componentKey === 'wheels') targetMat = materials.rims;
    else if (componentKey === 'roof') targetMat = materials.roof;
    else if (componentKey === 'interior') targetMat = materials.interior;
    else targetMat = materials.body;

    if (targetMat && (targetMat as THREE.MeshStandardMaterial).emissive) {
      const std = targetMat as THREE.MeshStandardMaterial;
      const origEmissive = std.emissive.getHex();
      const origIntensity = std.emissiveIntensity;

      std.emissive.setHex(0x00f0ff);
      gsap.to(std, {
        emissiveIntensity: 2.0,
        duration: 0.3,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          std.emissive.setHex(origEmissive);
          std.emissiveIntensity = origIntensity;
        },
      });
    }
  };

  const dispose = () => {
    Object.values(materials).forEach((m) => m.dispose());
  };

  const manager: SUVModelManager = {
    root,
    get loaded() {
      return loaded;
    },
    meshes,
    materials,
    setBodyColor,
    setRoofOption,
    setWheelOption,
    setBrakeOption,
    setInteriorOption,
    setHeadlights,
    pulseHighlight,
    dispose,
  };

  return manager;
}
