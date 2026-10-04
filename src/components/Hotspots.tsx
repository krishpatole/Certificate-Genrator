import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { X, Sparkles, ChevronRight, Zap, Eye } from 'lucide-react';
import { HotspotData } from '../types/car';

export const EXTERIOR_HOTSPOTS: HotspotData[] = [
  {
    id: 'headlights',
    name: 'HEADLIGHTS',
    title: 'Adaptive LED Matrix Headlights',
    position: [0.65, 0.82, 1.85],
    cameraPosition: [1.2, 0.95, 2.7],
    cameraTarget: [0.6, 0.8, 1.8],
    badge: 'INTELLIGENT LIGHTING',
    specValue: '84 Pixels',
    specLabel: 'Dynamic Array Matrix',
    description:
      'Ultra-high definition digital matrix LED illumination with automated glare-free high beams, dynamic cornering projections, and welcome staging animation.',
    details: [
      'Automatic selective dimming of opposing traffic',
      'Dynamic cornering illumination synchronized with steering',
      'Futuristic sequential LED animated turn signals',
    ],
  },
  {
    id: 'wheels',
    name: 'WHEELS',
    title: '21-inch Performance Alloy Wheels',
    position: [0.98, 0.36, 1.45],
    cameraPosition: [1.9, 0.45, 1.6],
    cameraTarget: [0.9, 0.36, 1.45],
    badge: 'CHASSIS & DYNAMICS',
    specValue: '21-inch',
    specLabel: 'Aero Forged Alloy',
    description:
      'Forged lightweight aerodynamic alloy wheels engineered with integrated vortex cooling vents, wrapped in high-grip Pirelli P Zero performance rubber.',
    details: [
      'Aero-blade inserts reducing drag coefficient by 0.02 Cd',
      '6-piston fixed front performance brake calipers',
      'Cross-drilled ventilated composite steel brake rotors',
    ],
  },
  {
    id: 'engine',
    name: 'ENGINE',
    title: 'Turbocharged Performance Engine',
    position: [0, 0.98, 1.35],
    cameraPosition: [0, 1.6, 2.5],
    cameraTarget: [0, 0.9, 1.2],
    badge: 'POWERTRAIN',
    specValue: '197 HP',
    specLabel: '320 Nm Peak Torque',
    description:
      '2.0L Turbocharged TFSI powertrain combined with a 48V mild-hybrid regenerative drive system delivering instant boost and refined highway efficiency.',
    details: [
      'Twin-scroll turbocharger with rapid spool response',
      'Dual-clutch 7-speed S-tronic automated transmission',
      'Electronic start-stop with coasting engine recuperation',
    ],
  },
  {
    id: 'roof',
    name: 'ROOF',
    title: 'Panoramic Glass Roof',
    position: [0, 1.62, -0.2],
    cameraPosition: [1.2, 2.5, 0.8],
    cameraTarget: [0, 1.55, -0.2],
    badge: 'SKY VIEW',
    specValue: '1.4 m²',
    specLabel: 'Electrochromic Surface',
    description:
      'Sweeping acoustic dual-pane panoramic glass sunroof equipped with electrochromic smart dimming and an integrated UV-reflective metallic coating.',
    details: [
      '99.4% Infrared and solar heat rejection',
      'Variable transparency with one-touch capacitive slider',
      'Integrated aerodynamically tuned wind deflector',
    ],
  },
  {
    id: 'interior',
    name: 'INTERIOR',
    title: 'Premium Intelligent Cockpit',
    position: [-0.35, 1.05, 0.35],
    cameraPosition: [-0.32, 1.12, 0.15],
    cameraTarget: [-0.15, 0.95, 0.88],
    badge: 'DIGITAL CABIN',
    specValue: '12.3-inch',
    specLabel: 'Virtual Cockpit OLED',
    description:
      'A driver-centric sensory sanctum enveloped in perforated Nappa leather, open-pore ash wood trim, and high-fidelity 3D surround sound architecture.',
    details: [
      'Dual MMI touch response displays with haptic feedback',
      '30-color ambient contour cabin illumination',
      'Active noise cancellation and PM2.5 air purification',
    ],
  },
  {
    id: 'boot',
    name: 'BOOT',
    title: 'Large Flexible Cargo Space',
    position: [0, 0.95, -2.18],
    cameraPosition: [0, 1.3, -3.2],
    cameraTarget: [0, 0.9, -2.1],
    badge: 'VERSATILITY',
    specValue: '580 L',
    specLabel: 'Expandable to 1,525 L',
    description:
      'Generous flat-loading cargo area engineered for weekend expeditions and sports equipment, featuring hands-free gesture foot-sensor activation.',
    details: [
      'Hands-free electric tailgate with customizable open height',
      '40:20:40 split-folding rear bench with through-load facility',
      'Adjustable dual-level cargo floor with tie-down net rails',
    ],
  },
];

export const INTERIOR_HOTSPOTS: HotspotData[] = [
  {
    id: 'int_steering',
    name: 'STEERING',
    title: 'Multifunction Sports Steering Wheel',
    position: [-0.36, 0.98, 0.65],
    cameraPosition: [-0.36, 1.08, 0.25],
    cameraTarget: [-0.36, 0.98, 0.68],
    badge: 'CONTROL',
    specValue: 'Capacitive',
    specLabel: 'Hands-On Detection',
    description:
      'Flat-bottom leather-wrapped sports steering wheel with die-cast aluminum paddle shifters and programmable satellite buttons.',
    details: ['Haptic feedback touchpads', 'Integrated steering wheel heating', 'Hands-on lane assist sensors'],
    isInterior: true,
  },
  {
    id: 'int_dash',
    name: 'INFOTAINMENT',
    title: 'Dual 12.3" OLED Touchscreens',
    position: [0.05, 0.96, 0.78],
    cameraPosition: [-0.15, 1.05, 0.35],
    cameraTarget: [0.05, 0.95, 0.8],
    badge: 'CONNECTIVITY',
    specValue: '4K HDR',
    specLabel: 'Ultra-low Latency MMI',
    description:
      'High-resolution dual displays featuring natural voice dialogue, 3D satellite navigation, and wireless smartphone mirroring.',
    details: ['Augmented reality head-up display sync', 'OTA software updates', 'Bang & Olufsen 3D Sound Engine'],
    isInterior: true,
  },
  {
    id: 'int_seats',
    name: 'SEATS',
    title: 'Ergonomic Nappa Leather Front Seats',
    position: [0.38, 0.76, 0.15],
    cameraPosition: [0.1, 1.05, -0.2],
    cameraTarget: [0.38, 0.76, 0.25],
    badge: 'COMFORT',
    specValue: '14-Way',
    specLabel: 'Pneumatic Massage',
    description:
      'Heated and ventilated sports seats with adjustable side bolsters, memory presets, and 8-program pneumatic massage modules.',
    details: ['Perforated luxury Nappa leather', 'Integrated memory profiles', 'Active curve bolster support'],
    isInterior: true,
  },
  {
    id: 'int_console',
    name: 'CENTER CONSOLE',
    title: 'Floating Center Console & Shift-By-Wire',
    position: [0, 0.68, 0.25],
    cameraPosition: [-0.2, 0.95, 0.1],
    cameraTarget: [0, 0.68, 0.3],
    badge: 'ERGONOMICS',
    specValue: '15W Qi',
    specLabel: 'Cooled Wireless Charge',
    description:
      'Minimalist floating console with aerospace-inspired shift-by-wire rocker, dual illuminated USB-C ports, and inductive device charging.',
    details: ['Integrated keyless start button', 'Cooled smartphone bay', 'Split center armrest with deep storage'],
    isInterior: true,
  },
];

interface HotspotsProps {
  camera: THREE.PerspectiveCamera | null;
  canvas: HTMLCanvasElement | null;
  activeHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  onCloseHotspot: () => void;
  isInteriorMode: boolean;
}

export const Hotspots: React.FC<HotspotsProps> = ({
  camera,
  canvas,
  activeHotspot,
  onSelectHotspot,
  onCloseHotspot,
  isInteriorMode,
}) => {
  const [screenCoords, setScreenCoords] = useState<{ [id: string]: { x: number; y: number; visible: boolean } }>({});

  const hotspots = isInteriorMode ? INTERIOR_HOTSPOTS : EXTERIOR_HOTSPOTS;

  useEffect(() => {
    if (!camera || !canvas) return;

    let animId: number;

    const updateHotspots = () => {
      const coords: { [id: string]: { x: number; y: number; visible: boolean } } = {};
      const rect = canvas.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;

      hotspots.forEach((h) => {
        const v = new THREE.Vector3(...h.position);
        // Project to normalized device coordinates (-1 to +1)
        v.project(camera);

        // Check if point is in front of camera
        const isVisible = v.z < 1.0 && v.z > -1.0 && v.x >= -1.1 && v.x <= 1.1 && v.y >= -1.1 && v.y <= 1.1;

        coords[h.id] = {
          x: v.x * halfWidth + halfWidth,
          y: -v.y * halfHeight + halfHeight,
          visible: isVisible,
        };
      });

      setScreenCoords(coords);
      animId = requestAnimationFrame(updateHotspots);
    };

    animId = requestAnimationFrame(updateHotspots);
    return () => cancelAnimationFrame(animId);
  }, [camera, canvas, isInteriorMode, hotspots]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* 3D Hotspot Interactive Beacons */}
      {!activeHotspot &&
        hotspots.map((h) => {
          const coord = screenCoords[h.id];
          if (!coord || !coord.visible) return null;

          return (
            <div
              key={h.id}
              style={{
                transform: `translate3d(${coord.x}px, ${coord.y}px, 0)`,
              }}
              className="pointer-events-auto absolute -top-4 -left-4 transition-transform duration-75"
            >
              <button
                onClick={() => onSelectHotspot(h)}
                className="group relative flex items-center justify-center w-8 h-8 focus:outline-none"
                aria-label={`Inspect ${h.title}`}
              >
                {/* Outer pulsing radar ring */}
                <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                {/* Secondary glow */}
                <span className="absolute inset-1 rounded-full bg-cyan-400/20 border border-cyan-400/60 group-hover:scale-125 transition-transform duration-300" />
                {/* Central beacon dot */}
                <span className="relative w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>

                {/* Hover Tooltip Pill */}
                <span className="absolute left-10 whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-400/30 text-[11px] font-semibold tracking-wider text-cyan-300 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                  {h.name}
                </span>
              </button>
            </div>
          );
        })}

      {/* Selected Hotspot Detail Card Panel */}
      {activeHotspot && (
        <div className="pointer-events-auto absolute bottom-8 right-6 md:right-10 w-[calc(100%-3rem)] sm:w-96 rounded-2xl bg-[#080b12]/90 backdrop-blur-2xl border border-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[10px] font-mono font-semibold tracking-widest text-cyan-400 mb-2">
                <Sparkles className="w-3 h-3" />
                {activeHotspot.badge}
              </span>
              <h3 className="font-display font-bold text-lg text-white tracking-wide leading-tight">
                {activeHotspot.title}
              </h3>
            </div>
            <button
              onClick={onCloseHotspot}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
              aria-label="Close component panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {activeHotspot.description}
          </p>

          {/* Specification Stat Callout */}
          <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-400/20 p-3.5 mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                {activeHotspot.specLabel}
              </div>
              <div className="font-display font-bold text-xl text-cyan-300 tracking-wider">
                {activeHotspot.specValue}
              </div>
            </div>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Bulleted Highlights */}
          <div className="space-y-2 mb-5">
            {activeHotspot.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>

          {/* Close / Return Button */}
          <button
            onClick={onCloseHotspot}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            RETURN TO FULL SUV
          </button>
        </div>
      )}
    </div>
  );
};
