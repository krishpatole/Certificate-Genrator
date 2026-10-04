import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

export default function LoadingScreen({ isLoaded, progress: externalProgress }) {
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof externalProgress === 'number' && externalProgress > 0) {
      setProgress((prev) => Math.max(prev, externalProgress));
    }
  }, [externalProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + step, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoaded && progress >= 100) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, progress]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090e] transition-opacity duration-700 ${
        isLoaded && progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Loading VeloX 3D Experience"
    >
      {/* Background ambient glow */}
      <div className="absolute w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Brand Emblem */}
        <div className="relative mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-[1.5px] shadow-[0_0_25px_rgba(0,240,255,0.3)] animate-pulse">
            <div className="w-full h-full bg-[#080a0f] rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black tracking-[0.25em] text-white mb-2 font-display">
          VELOX
        </h2>

        {/* Subtitle */}
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-8 font-medium">
          CRAFTING YOUR DRIVE
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-full h-1.5 p-[1px] mb-3 overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Display */}
        <div className="flex justify-between w-full text-[11px] text-slate-400 font-mono">
          <span className="text-slate-500">INITIALIZING 3D ENGINE</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
