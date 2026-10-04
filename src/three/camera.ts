import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { CameraPresetConfig, PresetView } from '../types/car';

export const CAMERA_PRESETS: Record<PresetView, CameraPresetConfig> = {
  hero: {
    position: [3.4, 1.35, 3.8],
    target: [0, 0.65, 0],
    fov: 45,
  },
  front: {
    position: [0, 0.95, 4.3],
    target: [0, 0.72, 0.4],
    fov: 42,
  },
  side: {
    position: [4.6, 1.1, 0],
    target: [0, 0.7, 0],
    fov: 42,
  },
  rear: {
    position: [0, 1.15, -4.5],
    target: [0, 0.7, -0.3],
    fov: 42,
  },
  top: {
    position: [0.1, 5.6, 0.1],
    target: [0, 0.4, 0],
    fov: 45,
  },
  interior: {
    position: [-0.32, 1.12, 0.15],
    target: [-0.15, 0.95, 0.88],
    fov: 65,
  },
};

export interface CameraManager {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  currentPreset: PresetView;
  isTransitioning: boolean;
  setPreset: (preset: PresetView, duration?: number, onComplete?: () => void) => void;
  moveTo: (
    position: [number, number, number],
    target: [number, number, number],
    duration?: number,
    fov?: number,
    onComplete?: () => void
  ) => void;
  updateParallax: (normalizedX: number, normalizedY: number) => void;
  dispose: () => void;
}

export function createCameraManager(
  canvas: HTMLCanvasElement,
  aspect: number
): CameraManager {
  const initial = CAMERA_PRESETS.hero;

  const camera = new THREE.PerspectiveCamera(initial.fov || 45, aspect, 0.1, 100);
  camera.position.set(...initial.position);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(...initial.target);

  // Exterior limits
  controls.minDistance = 1.6;
  controls.maxDistance = 8.5;
  controls.maxPolarAngle = Math.PI / 2 + 0.03; // prevent clipping beneath floor
  controls.update();

  let currentPreset: PresetView = 'hero';
  let isTransitioning = false;
  let activeTween: gsap.core.Tween | null = null;
  let parallaxOffset = { x: 0, y: 0 };
  let basePosition = new THREE.Vector3(...initial.position);

  const moveTo = (
    pos: [number, number, number],
    target: [number, number, number],
    duration = 1.4,
    fov = 45,
    onComplete?: () => void
  ) => {
    if (activeTween) {
      activeTween.kill();
    }

    isTransitioning = true;
    controls.enabled = false;

    // Interior mode adjustments
    const isInteriorTarget = fov > 50 || pos[1] > 1.0 && Math.abs(pos[0]) < 0.6 && Math.abs(pos[2]) < 0.6;
    if (isInteriorTarget) {
      controls.minDistance = 0.05;
      controls.maxDistance = 3.0;
      controls.maxPolarAngle = Math.PI;
    } else {
      controls.minDistance = 1.6;
      controls.maxDistance = 8.5;
      controls.maxPolarAngle = Math.PI / 2 + 0.03;
    }

    const startPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    const startTarget = {
      x: controls.target.x,
      y: controls.target.y,
      z: controls.target.z,
    };

    const startFov = { fov: camera.fov };

    const tl = gsap.timeline({
      onUpdate: () => {
        camera.position.set(startPos.x, startPos.y, startPos.z);
        controls.target.set(startTarget.x, startTarget.y, startTarget.z);
        camera.fov = startFov.fov;
        camera.updateProjectionMatrix();
        controls.update();
      },
      onComplete: () => {
        isTransitioning = false;
        controls.enabled = true;
        basePosition.copy(camera.position);
        if (onComplete) onComplete();
      },
    });

    tl.to(
      startPos,
      {
        x: pos[0],
        y: pos[1],
        z: pos[2],
        duration,
        ease: 'power2.inOut',
      },
      0
    );

    tl.to(
      startTarget,
      {
        x: target[0],
        y: target[1],
        z: target[2],
        duration,
        ease: 'power2.inOut',
      },
      0
    );

    tl.to(
      startFov,
      {
        fov: fov || 45,
        duration,
        ease: 'power2.inOut',
      },
      0
    );

    activeTween = tl as any;
  };

  const setPreset = (preset: PresetView, duration = 1.4, onComplete?: () => void) => {
    currentPreset = preset;
    const config = CAMERA_PRESETS[preset];
    moveTo(config.position, config.target, duration, config.fov || 45, onComplete);
  };

  const updateParallax = (normalizedX: number, normalizedY: number) => {
    if (isTransitioning || currentPreset === 'interior') return;
    // Subtly adjust camera parallax when idle/moving mouse
    const subtleX = normalizedX * 0.18;
    const subtleY = -normalizedY * 0.12;
    camera.position.x += (basePosition.x + subtleX - camera.position.x) * 0.05;
    camera.position.y += (basePosition.y + subtleY - camera.position.y) * 0.05;
  };

  const dispose = () => {
    if (activeTween) activeTween.kill();
    controls.dispose();
  };

  return {
    camera,
    controls,
    get currentPreset() {
      return currentPreset;
    },
    set currentPreset(p: PresetView) {
      currentPreset = p;
    },
    get isTransitioning() {
      return isTransitioning;
    },
    setPreset,
    moveTo,
    updateParallax,
    dispose,
  };
}
