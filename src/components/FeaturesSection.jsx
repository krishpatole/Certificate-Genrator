import React, { useState } from 'react';
import { FEATURES_DATA } from '../data/configuratorData';
import {
  Cpu,
  Activity,
  Shield,
  Volume2,
  Wind,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const iconMap = {
    Cpu: Cpu,
    Activity: Activity,
    Shield: Shield,
    Volume2: Volume2,
    Wind: Wind,
    Sparkles: Sparkles,
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Glow highlight */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Layers className="w-3.5 h-3.5" />
          Next-Gen Innovations
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-display tracking-tight mb-4">
          ADVANCED ARCHITECTURE.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          From aerospace carbon composites to neural autonomous driver assist, every detail of VeloX
          is meticulously engineered to redefine the driving experience.
        </p>
      </div>

      {/* 6 Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES_DATA.map((feat) => {
          const Icon = iconMap[feat.icon] || Cpu;
          return (
            <div
              key={feat.id}
              className="glass-panel p-7 rounded-3xl relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold uppercase text-white font-display mb-1.5 group-hover:text-cyan-400 transition-colors">
                  {feat.title}
                </h3>
                <div className="text-xs font-semibold text-slate-300 font-mono mb-3.5">
                  {feat.subtitle}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span className="font-semibold text-[11px] uppercase tracking-wider">Standard Equipment</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
