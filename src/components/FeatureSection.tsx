import React, { useState } from 'react';
import { Activity, ShieldCheck, Cpu, Armchair, Mountain, ChevronRight, Sparkles } from 'lucide-react';
import { FeatureShowcase } from '../types/car';

export const FEATURE_STORIES: FeatureShowcase[] = [
  {
    id: 'performance',
    category: 'PERFORMANCE',
    title: 'Dual-Boost Turbocharged Dynamics',
    tagline: 'Precision agility meets immediate all-wheel throttle response',
    description:
      'Engineered with a responsive twin-scroll turbocharger and quattro ultra-intelligent torque distribution. Whether executing high-speed lane transitions or accelerating out of alpine hairpins, adaptive damping instantly optimizes body pitch and roll.',
    cameraPosition: [1.8, 0.75, 2.0],
    cameraTarget: [0.6, 0.5, 1.2],
    highlights: [
      'Electronically controlled active limited-slip differential',
      'Adaptive magnetic ride suspension with 5 millisecond reaction cycle',
      'Dynamic variable-ratio electromechanical steering system',
    ],
    spec: {
      label: 'MAX TORQUE',
      value: '320 Nm @ 1,500 RPM',
    },
  },
  {
    id: 'safety',
    category: 'SAFETY',
    title: '360° Predictive Guardian Architecture',
    tagline: 'Anticipating hazards long before they become visible',
    description:
      'A dense multi-spectral network of front lidar, long-range radar arrays, ultrasonic transceivers, and high-resolution optical cameras forms a continuous 360-degree protective bubble around the occupants, capable of automated collision evasion.',
    cameraPosition: [0, 0.85, 3.2],
    cameraTarget: [0, 0.75, 1.8],
    highlights: [
      'Pre-sense automated emergency city braking with pedestrian detection',
      'Blind-spot active steer-back assist with rear cross-traffic alert',
      'High-strength hot-formed boron safety cell with 9 smart airbags',
    ],
    spec: {
      label: 'SAFETY RATING',
      value: '5-Star Euro NCAP',
    },
  },
  {
    id: 'technology',
    category: 'TECHNOLOGY',
    title: 'Connected Intelligence & Augmented Cockpit',
    tagline: 'Intuitive AI synergy between driver and machine',
    description:
      'Equipped with twin 12.3-inch OLED interactive displays powered by a quad-core automotive graphics processor. Features natural voice dialogue, over-the-air firmware updates, and augmented reality head-up navigation projected onto the windshield.',
    cameraPosition: [-0.32, 1.12, 0.22],
    cameraTarget: [-0.15, 0.95, 0.88],
    highlights: [
      'Augmented reality head-up display with 3D directional arrow cues',
      'Biometric driver profile recognition with cloud preference sync',
      'Audi connect high-speed 5G hotspot and remote smartphone app control',
    ],
    spec: {
      label: 'DISPLAY RESOLUTION',
      value: '4K Ultra OLED',
    },
  },
  {
    id: 'comfort',
    category: 'COMFORT',
    title: 'Sanctuary of Sound & Sensory Ergonomics',
    tagline: 'Quiet poise crafted from sustainable master craftsmanship',
    description:
      'Step into an acoustic sanctuary featuring double-glazed acoustic glass, 16-speaker Bang & Olufsen 3D surround sound with active cabin noise cancellation, and customized pneumatic massage seating wrapped in supple Nappa leather.',
    cameraPosition: [0.35, 1.15, -0.2],
    cameraTarget: [0.1, 0.95, 0.4],
    highlights: [
      'Active electronic road-noise cancellation with in-cabin microphones',
      'Four-zone automatic climate control with allergen air-ionizer filter',
      'Panoramic acoustic glass with electrochromic sun-glare elimination',
    ],
    spec: {
      label: 'AUDIO SYSTEM',
      value: '16-Speaker 705W 3D',
    },
  },
  {
    id: 'offroad',
    category: 'OFF-ROAD',
    title: 'All-Terrain Dominance & Terrain Response',
    tagline: 'Unshakable poise over rock, snow, mud, and unpaved ascents',
    description:
      'With 210 mm of elevated ground clearance and selectable Drive Select modes (Off-Road, Snow, Dynamic, Comfort), the intelligent Quattro system seamlessly distributes drive torque between axles in milliseconds to maximize traction.',
    cameraPosition: [2.5, 0.4, -0.6],
    cameraTarget: [1.0, 0.35, -0.2],
    highlights: [
      'Hill descent control with automatic speed throttling down steep slopes',
      'Reinforced composite underbody skid plates guarding battery & drivetrain',
      'Under-vehicle optical trail camera for inspecting rocks and ruts',
    ],
    spec: {
      label: 'GROUND CLEARANCE',
      value: '210 mm High-Ride',
    },
  },
];

interface FeatureSectionProps {
  onSelectFeature: (feature: FeatureShowcase) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ onSelectFeature }) => {
  const [activeCategory, setActiveCategory] = useState<string>('PERFORMANCE');

  const currentFeature = FEATURE_STORIES.find((f) => f.category === activeCategory) || FEATURE_STORIES[0];

  const handleCategorySelect = (feature: FeatureShowcase) => {
    setActiveCategory(feature.category);
    onSelectFeature(feature);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PERFORMANCE':
        return <Activity className="w-4 h-4" />;
      case 'SAFETY':
        return <ShieldCheck className="w-4 h-4" />;
      case 'TECHNOLOGY':
        return <Cpu className="w-4 h-4" />;
      case 'COMFORT':
        return <Armchair className="w-4 h-4" />;
      case 'OFF-ROAD':
        return <Mountain className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section id="features" className="relative py-28 px-6 bg-[#06080d] overflow-hidden">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-14 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            CINEMATIC TOUR
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            INTELLIGENCE IN MOTION
          </h2>
        </div>

        {/* Feature Category Switcher Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {FEATURE_STORIES.map((feat) => {
            const isActive = activeCategory === feat.category;
            return (
              <button
                key={feat.id}
                onClick={() => handleCategorySelect(feat)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                    : 'bg-[#101422] text-slate-300 border border-white/[0.08] hover:border-white/20 hover:text-white'
                }`}
              >
                {getCategoryIcon(feat.category)}
                <span>{feat.category}</span>
              </button>
            );
          })}
        </div>

        {/* Cinematic Feature Card with Interactive Camera Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl bg-[#090d17]/80 backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Details & Technical Highlights */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-mono text-cyan-400 tracking-[0.25em] uppercase mb-2">
                {currentFeature.tagline}
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                {currentFeature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {currentFeature.description}
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              {currentFeature.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Spec highlight & Focus Camera Button */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-black/40 border border-white/[0.06] p-6 sm:p-8">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mb-1">
                {currentFeature.spec.label}
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-cyan-300 tracking-wide mb-6">
                {currentFeature.spec.value}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed mb-6">
                Click below to orient the Three.js 3D camera to inspect the relevant components of the SUV.
              </div>
            </div>

            <button
              onClick={() => onSelectFeature(currentFeature)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 hover:border-cyan-400 text-white font-semibold text-xs tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 group"
            >
              <span>INSPECT ON 3D MODEL</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
