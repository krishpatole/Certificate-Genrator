import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, Eye, Maximize2, Move, ZoomIn, Sparkles } from 'lucide-react';
import { createSceneEngine, SceneEngine } from '../three/scene';
import { createCameraManager, CameraManager, CAMERA_PRESETS } from '../three/camera';
import { CarModel } from './CarModel';
import { Hotspots } from './Hotspots';
import { SUVModelManager } from '../three/loader';
import { ConfiguratorState, PresetView, HotspotData, FeatureShowcase } from '../types/car';

interface CarViewerProps {
  configState: ConfiguratorState;
  onLoadingProgress: (percent: number) => void;
  activePreset: PresetView;
  onChangePreset: (preset: PresetView) => void;
  activeHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  onCloseHotspot: () => void;
  externalFeatureFocus?: FeatureShowcase | null;
  className?: string;
  isHeroMode?: boolean;
}

export const CarViewer: React.FC<CarViewerProps> = ({
  configState,
  onLoadingProgress,
  activePreset,
  onChangePreset,
  activeHotspot,
  onSelectHotspot,
  onCloseHotspot,
  externalFeatureFocus,
  className = '',
  isHeroMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const modelManagerRef = useRef<SUVModelManager | null>(null);

  const [sceneReady, setSceneReady] = useState(false);
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const lastUserInteraction = useRef<number>(Date.now());
  const isInteracting = useRef<boolean>(false);

  // Initialize Three.js Engine & Camera
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createSceneEngine(canvas);
    engineRef.current = engine;

    const cameraManager = createCameraManager(canvas, canvas.clientWidth / canvas.clientHeight);
    cameraManagerRef.current = cameraManager;

    setSceneReady(true);

    // Track user interactions to manage idle auto-rotation
    const recordInteraction = () => {
      lastUserInteraction.current = Date.now();
      isInteracting.current = true;
    };
    const endInteraction = () => {
      isInteracting.current = false;
      lastUserInteraction.current = Date.now();
    };

    canvas.addEventListener('pointerdown', recordInteraction);
    canvas.addEventListener('wheel', recordInteraction, { passive: true });
    window.addEventListener('pointerup', endInteraction);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!canvas || !cameraManagerRef.current || !engineRef.current) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      cameraManagerRef.current.camera.aspect = width / height;
      cameraManagerRef.current.camera.updateProjectionMatrix();
      engineRef.current.resize(width, height);
    });

    resizeObserver.observe(canvas);

    // Main Render & Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const now = Date.now();

      // Idle Auto-Rotation: rotate slowly after 2.5s of no interaction when not inspecting hotspot or interior
      if (
        !isInteracting.current &&
        now - lastUserInteraction.current > 2500 &&
        cameraManagerRef.current &&
        !cameraManagerRef.current.isTransitioning &&
        cameraManagerRef.current.currentPreset !== 'interior' &&
        !activeHotspot
      ) {
        cameraManagerRef.current.controls.autoRotate = true;
        cameraManagerRef.current.controls.autoRotateSpeed = 0.8;
      } else if (cameraManagerRef.current) {
        cameraManagerRef.current.controls.autoRotate = false;
      }

      if (cameraManagerRef.current) {
        cameraManagerRef.current.controls.update();
      }

      if (engineRef.current && cameraManagerRef.current) {
        engineRef.current.render(cameraManagerRef.current.camera);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', recordInteraction);
      canvas.removeEventListener('wheel', recordInteraction);
      window.removeEventListener('pointerup', endInteraction);
      engine.dispose();
      cameraManager.dispose();
    };
  }, []);

  // Sync preset changes
  useEffect(() => {
    if (cameraManagerRef.current && activePreset) {
      cameraManagerRef.current.setPreset(activePreset);
    }
  }, [activePreset]);

  // Sync external feature camera focus (from FeatureSection)
  useEffect(() => {
    if (externalFeatureFocus && cameraManagerRef.current) {
      cameraManagerRef.current.moveTo(
        externalFeatureFocus.cameraPosition,
        externalFeatureFocus.cameraTarget,
        1.5
      );
    }
  }, [externalFeatureFocus]);

  // Handle hotspot selection & camera movement
  const handleHotspotClick = (hotspot: HotspotData) => {
    onSelectHotspot(hotspot);
    setHighlightKey(hotspot.id);

    if (cameraManagerRef.current) {
      cameraManagerRef.current.moveTo(
        hotspot.cameraPosition,
        hotspot.cameraTarget,
        1.3,
        hotspot.isInterior ? 65 : 42
      );
    }
  };

  const handleCloseHotspot = () => {
    onCloseHotspot();
    setHighlightKey(null);
    if (cameraManagerRef.current) {
      cameraManagerRef.current.setPreset(activePreset || 'hero', 1.3);
    }
  };

  // Mouse Parallax for Hero section
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHeroMode || !cameraManagerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    cameraManagerRef.current.updateParallax(nx, ny);
  };

  const presetButtons: { key: PresetView; label: string }[] = [
    { key: 'front', label: 'FRONT' },
    { key: 'side', label: 'SIDE' },
    { key: 'rear', label: 'REAR' },
    { key: 'top', label: 'TOP' },
    { key: 'interior', label: 'INTERIOR' },
  ];

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing focus:outline-none"
      />

      {/* 3D Model Bridge */}
      {sceneReady && engineRef.current && (
        <CarModel
          scene={engineRef.current.scene}
          configState={configState}
          onLoadingProgress={onLoadingProgress}
          onModelReady={(manager) => {
            modelManagerRef.current = manager;
          }}
          highlightComponent={highlightKey}
        />
      )}

      {/* 3D Raycaster Hotspots */}
      <Hotspots
        camera={cameraManagerRef.current?.camera || null}
        canvas={canvasRef.current}
        activeHotspot={activeHotspot}
        onSelectHotspot={handleHotspotClick}
        onCloseHotspot={handleCloseHotspot}
        isInteriorMode={activePreset === 'interior'}
      />

      {/* Floating Camera Presets Bar */}
      {!activeHotspot && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-[#080c14]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
          {presetButtons.map((btn) => {
            const isActive = activePreset === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => onChangePreset(btn.key)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {btn.label}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Reset View Button */}
          <button
            onClick={() => onChangePreset('hero')}
            className="p-1.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors focus:outline-none"
            title="Reset View"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* On-screen Interaction Hints (Bottom Left) */}
      <div className="hidden sm:flex items-center gap-4 absolute bottom-6 left-6 z-10 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/[0.06] text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-cyan-400" /> Drag to Rotate
        </span>
        <span className="text-white/20">•</span>
        <span className="flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5 text-cyan-400" /> Scroll to Zoom
        </span>
        <span className="text-white/20">•</span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Click Hotspots
        </span>
      </div>
    </div>
  );
};
