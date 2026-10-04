import React from 'react';
import { Zap, ShieldCheck, Cpu, Code2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05070a] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-glow-cyan">
              <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-display font-black text-xl tracking-[0.2em] text-white">
              VELOX
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            The next-generation 3D interactive hypercar customization platform. Engineered with Three.js WebGL & React.
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-400 font-mono">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Three.js Native 3D
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" /> React + Vite
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tailwind CSS
          </span>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500 text-center md:text-right">
          © {new Date().getFullYear()} VELOX Motors Inc. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
