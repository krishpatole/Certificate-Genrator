import * as THREE from 'three';

export interface LightingRig {
  group: THREE.Group;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  interiorLight: THREE.PointLight;
  underGlowLight: THREE.PointLight;
  hemiLight: THREE.HemisphereLight;
  setUnderglowColor: (hex: number | string) => void;
  dispose: () => void;
}

export function createLightingRig(): LightingRig {
  const group = new THREE.Group();
  group.name = 'LightingRig';

  // 1. Hemisphere Light (Soft Sky & Ground ambient)
  const hemiLight = new THREE.HemisphereLight(0xecf2ff, 0x090d16, 0.9);
  hemiLight.position.set(0, 20, 0);
  group.add(hemiLight);

  // 2. Primary Key Light (Crisp directional light casting shadows)
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.02;

  const shadowDist = 4.5;
  keyLight.shadow.camera.left = -shadowDist;
  keyLight.shadow.camera.right = shadowDist;
  keyLight.shadow.camera.top = shadowDist;
  keyLight.shadow.camera.bottom = -shadowDist;
  group.add(keyLight);

  // 3. Fill Light (Soft cool fill from opposite angle)
  const fillLight = new THREE.DirectionalLight(0x8bc34a, 0.8); // subtle natural fill
  fillLight.color.setHex(0xa5b4fc);
  fillLight.position.set(-6, 6, -3);
  group.add(fillLight);

  // 4. Rim / Edge Backlight (Creates stunning highlights on the SUV silhouette)
  const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.8);
  rimLight.position.set(0, 6, -7);
  group.add(rimLight);

  // 5. Interior Cockpit Point Light (Soft illumination inside the SUV for interior view)
  const interiorLight = new THREE.PointLight(0xffffff, 1.2, 3.5, 1.5);
  interiorLight.position.set(0, 1.15, 0.2); // inside cabin
  group.add(interiorLight);

  // 6. Underbody Futuristic Accent Light
  const underGlowLight = new THREE.PointLight(0x00f0ff, 1.5, 4.0, 2.0);
  underGlowLight.position.set(0, 0.1, 0);
  group.add(underGlowLight);

  const setUnderglowColor = (hex: number | string) => {
    underGlowLight.color.set(hex as any);
  };

  const dispose = () => {
    keyLight.dispose?.();
    fillLight.dispose?.();
    rimLight.dispose?.();
    interiorLight.dispose?.();
    underGlowLight.dispose?.();
    hemiLight.dispose?.();
  };

  return {
    group,
    keyLight,
    fillLight,
    rimLight,
    interiorLight,
    underGlowLight,
    hemiLight,
    setUnderglowColor,
    dispose,
  };
}
