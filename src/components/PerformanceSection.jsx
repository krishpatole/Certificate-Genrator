import React, { useState } from 'react';
import { PERFORMANCE_SPECS } from '../data/configuratorData';
import { Zap, Gauge, Flame, BatteryCharging, Shield, Activity, Award, Cpu } from 'lucide-react';

export default function PerformanceSection() {
  const [activeDriveMode, setActiveDriveMode] = useState('hyper');

  const iconMap = {
    Zap: Zap,
    Gauge: Gauge,
    Flame: Flame,
    BatteryCharging: BatteryCharging,
  };

  const driveModes = [
    {
      id: 'eco',
      name: 'Range Ultra',
      tag: 'Max Efficiency',
      rangeMod: '680 km',
      powerMod: '360 HP',
      accelMod: '5.2 s',
      suspension: 'Comfort Glide',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'sport',
      name: 'Dynamic Sport',
      tag: 'Balanced Road',
      rangeMod: '620 km',
      powerMod: '480 HP',
      accelMod: '4.1 s',
      suspension: 'Firm Adaptive',
      accent: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'track',
      name: 'Apex Track',
      tag: 'Circuit Precision',
      rangeMod: '540 km',
      powerMod: '520 HP',
      accelMod: '3.8 s',
      suspension: 'Rigid Magnetorheological',
      accent: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'hyper',
      name: 'Hyper Launch',
      tag: 'Unrestricted Output',
      rangeMod: '500 km',
      powerMod: '520 HP (Overboost)',
      accelMod: '3.8 s (0-100)',
      suspension: 'Aero Ground-Effect Drop',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
    },
  ];

  const currentMode = driveModes.find((m) => m.id === activeDriveMode) || driveModes[3];

  return (
    <section id="performance" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Activity className="w-3.5 h-3.5" />
          Unrivaled Engineering
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-display tracking-tight mb-4">
          ELECTRIFYING PERFORMANCE.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Engineered with an ultra-dense dual-motor powertrain and active aerodynamic architecture,
          VeloX delivers instantaneous race-grade acceleration and laser-sharp handling.
        </p>
      </div>

      {/* Core Specs 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PERFORMANCE_SPECS.map((spec, idx) => {
          const Icon = iconMap[spec.icon] || Zap;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 hover:shadow-glow-cyan"
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all"></div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {spec.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-4xl font-black text-white font-display mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">
                {spec.value}
              </div>

              <div className="text-xs text-slate-400 leading-relaxed font-normal">
                {spec.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Drive Mode Simulator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono mb-1">
              Dynamic Drive Telemetry
            </div>
            <h3 className="text-2xl font-black uppercase text-white font-display">
              Intelligent Drive Profile Modes
            </h3>
          </div>

          {/* Drive Mode Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {driveModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveDriveMode(mode.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeDriveMode === mode.id
                    ? `${mode.bg} ${mode.border} ${mode.accent} border shadow-lg`
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Mode Live Telemetry Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Peak Power Output
            </div>
            <div className={`text-xl font-black font-display ${currentMode.accent}`}>
              {currentMode.powerMod}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              0–100 km/h Sprint
            </div>
            <div className={`text-xl font-black font-display ${currentMode.accent}`}>
              {currentMode.accelMod}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Estimated Range
            </div>
            <div className={`text-xl font-black font-display ${currentMode.accent}`}>
              {currentMode.rangeMod}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Chassis Calibration
            </div>
            <div className={`text-sm font-bold font-display ${currentMode.accent} mt-1`}>
              {currentMode.suspension}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
