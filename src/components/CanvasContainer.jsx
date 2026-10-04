import React, { useEffect, useRef, useState } from 'react';
import { CarScene } from '../three/CarScene';
import { RotateCw, Lightbulb, Camera, RotateCcw, Move, Eye, ArrowLeft } from 'lucide-react';

export default function CanvasContainer({
  exteriorColor,
  wheelOption,
  caliperOption,
  interiorOption,
  isAutoRotating,
  setIsAutoRotating,
  onSceneLoaded,
  onProgress,
  activeCameraPreset,
  setActiveCameraPreset,
}) {
  const mountRef = useRef(null);
  const sceneInstanceRef = useRef(null);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [isInteriorView, setIsInteriorView] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new CarScene(
      mountRef.current,
      () => {
        if (onSceneLoaded) onSceneLoaded();
      },
      (percent) => {
        if (onProgress) onProgress(percent);
      }
    );
    sceneInstanceRef.current = scene;

    return () => {
      scene.destroy();
    };
  }, []);

  // Sync Exterior Color
  useEffect(() => {
    if (sceneInstanceRef.current?.car) {
      sceneInstanceRef.current.car.setExteriorColor(exteriorColor);
    }
  }, [exteriorColor]);

  // Sync Wheels
  useEffect(() => {
    if (sceneInstanceRef.current?.car) {
      sceneInstanceRef.current.car.setWheelType(wheelOption);
    }
  }, [wheelOption]);

  // Sync Calipers
  useEffect(() => {
    if (sceneInstanceRef.current?.car) {
      sceneInstanceRef.current.car.setBrakeCaliper(caliperOption);
    }
  }, [caliperOption]);

  // Sync Interior
  useEffect(() => {
    if (sceneInstanceRef.current?.car) {
      sceneInstanceRef.current.car.setInterior(interiorOption);
    }
  }, [interiorOption]);

  // Sync Auto-Rotate
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setAutoRotate(isAutoRotating);
    }
  }, [isAutoRotating]);

  // Sync Headlights
  useEffect(() => {
    if (sceneInstanceRef.current?.car) {
      sceneInstanceRef.current.car.setHeadlights(headlightsOn);
    }
  }, [headlightsOn]);

  // Handle external camera preset change
  useEffect(() => {
    if (activeCameraPreset && sceneInstanceRef.current) {
      sceneInstanceRef.current.setCameraPreset(activeCameraPreset);
      setIsInteriorView(activeCameraPreset === 'interior');
    }
  }, [activeCameraPreset]);

  const handlePresetChange = (presetKey) => {
    if (setActiveCameraPreset) {
      setActiveCameraPreset(presetKey);
    }
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setCameraPreset(presetKey);
      setIsInteriorView(presetKey === 'interior');
    }
    if (isAutoRotating) {
      setIsAutoRotating(false);
    }
  };

  const toggleInteriorView = () => {
    const nextState = !isInteriorView;
    const targetPreset = nextState ? 'interior' : '3/4';
    handlePresetChange(targetPreset);
  };

  const handleResetCamera = () => {
    handlePresetChange('3/4');
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.resetCamera();
    }
  };

  const handlePointerDown = () => {
    if (showHint) setShowHint(false);
    if (isAutoRotating) {
      setIsAutoRotating(false);
    }
  };

  const cameraPresetsList = [
    { id: 'front', label: 'FRONT' },
    { id: '3/4', label: '3/4' },
    { id: 'side', label: 'SIDE' },
    { id: 'rear', label: 'REAR' },
    { id: 'interior', label: 'INTERIOR' },
  ];

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden"
      onPointerDown={handlePointerDown}
    >
      {/* Three.js WebGL Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 sm:left-6 flex flex-wrap items-center gap-2 pointer-events-auto z-20">
        {/* Explore Interior / Back to Exterior Primary Button */}
        <button
          onClick={toggleInteriorView}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-xl border transition-all duration-300 ${
            isInteriorView
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-400 shadow-lg scale-105'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-glow-cyan hover:scale-105'
          }`}
          aria-label={isInteriorView ? 'Back to exterior view' : 'Explore interior view'}
        >
          {isInteriorView ? (
            <>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO EXTERIOR</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>EXPLORE INTERIOR</span>
            </>
          )}
        </button>

        {/* 360 Auto-Rotate Toggle */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-xl border transition-all duration-300 ${
            isAutoRotating
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-glow-cyan scale-105'
              : 'bg-slate-900/80 text-slate-200 border-white/10 hover:bg-slate-800'
          }`}
          aria-label="Toggle 360 degree rotation"
          title="Toggle 360° Cinematic Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          <span>{isAutoRotating ? '360° ACTIVE' : '360° VIEW'}</span>
        </button>

        {/* Headlights Toggle */}
        <button
          onClick={() => setHeadlightsOn(!headlightsOn)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-xl border transition-all duration-300 ${
            headlightsOn
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan'
              : 'bg-slate-900/80 text-slate-400 border-white/10 hover:bg-slate-800'
          }`}
          aria-label="Toggle Headlights"
          title="Toggle Matrix LED Headlights & Taillight"
        >
          <Lightbulb className={`w-3.5 h-3.5 ${headlightsOn ? 'text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">{headlightsOn ? 'LED ON' : 'LED OFF'}</span>
        </button>

        {/* Reset Camera Button */}
        <button
          onClick={handleResetCamera}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-xl border bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 transition-all"
          aria-label="Reset Camera"
          title="Reset Camera to Default Angle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>

      {/* Bottom Camera View Angle Switcher: FRONT, 3/4, SIDE, REAR, INTERIOR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto z-20 max-w-[95vw] overflow-x-auto">
        <div className="flex items-center gap-1 px-2.5 text-slate-400 text-[11px] font-bold uppercase">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">VIEWS:</span>
        </div>
        {cameraPresetsList.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetChange(preset.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
              (activeCameraPreset || '3/4') === preset.id
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-glow-cyan'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            aria-label={`Switch camera to ${preset.label} view`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Interactive Drag Hint */}
      {showHint && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-2 bg-black/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 animate-pulse-slow">
          <Move className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-200">
            Drag to Orbit • Scroll to Zoom
          </span>
        </div>
      )}
    </div>
  );
}
