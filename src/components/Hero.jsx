import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCw, Sparkles, ChevronDown, Eye, Play } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { BASE_PRICE } from '../data/configuratorData';

export default function Hero({
  onStartConfiguring,
  onExplore360,
  onExploreInterior,
  isAutoRotating,
  onStartDemoMode,
  isDemoMode,
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle mouse movement parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      {/* Background subtle radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] -z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
        }}
      />

      {/* Hero Typography */}
      <div
        className="max-w-4xl mx-auto text-center pt-6 pointer-events-auto transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
        }}
      >
        {/* Premium Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>NEXT-GENERATION AUTOMOTIVE CONFIGURATION</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] font-display mb-6">
          BUILD YOUR <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-white">
            PERFECT DRIVE.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed mb-8">
          Experience bespoke physical PBR customization, advanced aerodynamics, and instant real-time telemetry.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onStartConfiguring}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            aria-label="Start configuring vehicle"
          >
            <span>START CONFIGURING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExplore360}
            className={`px-6 py-3.5 rounded-full border text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300 flex items-center gap-2 ${
              isAutoRotating
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-slate-900/60 border-white/15 text-white hover:bg-white/10 hover:border-white/30'
            }`}
            aria-label="Toggle 360 degree view"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>{isAutoRotating ? '360° ACTIVE' : 'EXPLORE 360°'}</span>
          </button>

          <button
            onClick={onExploreInterior}
            className="px-6 py-3.5 rounded-full border border-white/15 bg-slate-900/60 text-white hover:bg-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300 flex items-center gap-2"
            aria-label="Explore interior"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTERIOR</span>
          </button>

          {/* Autopilot Demo Mode Button for Interview */}
          <button
            onClick={onStartDemoMode}
            className={`px-5 py-3.5 rounded-full border text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 ${
              isDemoMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,166,35,0.4)] animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Toggle Autopilot Demo Mode for Interview presentation"
            title="Auto-run complete configurator demonstration"
          >
            <Play className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-400' : 'text-cyan-400'}`} />
            <span>{isDemoMode ? 'DEMO RUNNING' : 'DEMO MODE'}</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Quick Bar */}
      <div className="max-w-4xl mx-auto w-full pointer-events-auto mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/70 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 shadow-xl">
          <div className="text-center p-2 border-r border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Base Platform</div>
            <div className="text-sm sm:text-base font-black text-cyan-400 font-display">{formatINR(BASE_PRICE)}</div>
          </div>
          <div className="text-center p-2 border-r border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Power</div>
            <div className="text-sm sm:text-base font-black text-white font-display">520 HP</div>
          </div>
          <div className="text-center p-2 border-r border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">0–100 km/h</div>
            <div className="text-sm sm:text-base font-black text-white font-display">3.8 sec</div>
          </div>
          <div className="text-center p-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Range (WLTP)</div>
            <div className="text-sm sm:text-base font-black text-white font-display">620 km</div>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={onStartConfiguring}
            className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>Scroll to Studio</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
