import React, { useEffect, useRef, useState } from 'react';
import { Gauge, Zap, Timer, Flame, ShieldAlert, Users, Compass, Fuel } from 'lucide-react';
import gsap from 'gsap';

interface SpecItem {
  id: string;
  label: string;
  targetValue: number;
  suffix: string;
  isString?: boolean;
  stringValue?: string;
  subtext: string;
  icon: React.ReactNode;
}

const SPEC_DATA: SpecItem[] = [
  {
    id: 'power',
    label: 'POWER',
    targetValue: 197,
    suffix: ' HP',
    subtext: 'Turbocharged TFSI Boost',
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'torque',
    label: 'TORQUE',
    targetValue: 320,
    suffix: ' Nm',
    subtext: 'Instant Low-End Pull',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'accel',
    label: '0–100 KM/H',
    targetValue: 8.5,
    suffix: ' SEC',
    subtext: 'Dynamic Launch Control',
    icon: <Timer className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'speed',
    label: 'TOP SPEED',
    targetValue: 210,
    suffix: ' KM/H',
    subtext: 'Aerodynamic Limited',
    icon: <Gauge className="w-5 h-5 text-purple-400" />,
  },
  {
    id: 'clearance',
    label: 'GROUND CLEARANCE',
    targetValue: 210,
    suffix: ' MM',
    subtext: 'Multi-Terrain Adaptive',
    icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: 'seating',
    label: 'SEATING',
    targetValue: 5,
    suffix: ' ADULTS',
    subtext: 'Ergonomic Luxury Cabin',
    icon: <Users className="w-5 h-5 text-blue-400" />,
  },
  {
    id: 'drive',
    label: 'DRIVE',
    targetValue: 0,
    suffix: '',
    isString: true,
    stringValue: 'AWD',
    subtext: 'Intelligent Quattro Torque',
    icon: <Compass className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'fuel',
    label: 'FUEL TANK',
    targetValue: 55,
    suffix: ' L',
    subtext: 'Extended Highway Range',
    icon: <Fuel className="w-5 h-5 text-orange-400" />,
  },
];

export const Specifications: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState<{ [id: string]: number }>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate each number smoothly with GSAP
            SPEC_DATA.forEach((spec) => {
              if (spec.isString) return;

              const obj = { val: 0 };
              gsap.to(obj, {
                val: spec.targetValue,
                duration: 2.0,
                ease: 'power2.out',
                onUpdate: () => {
                  setAnimatedValues((prev) => ({
                    ...prev,
                    [spec.id]: spec.id === 'accel' ? parseFloat(obj.val.toFixed(1)) : Math.round(obj.val),
                  }));
                },
              });
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      id="specifications"
      ref={sectionRef}
      className="relative py-28 px-6 bg-gradient-to-b from-[#06080d] via-[#090d16] to-[#06080d] overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Gauge className="w-3.5 h-3.5" />
            ENGINEERED BENCHMARKS
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white mb-6">
            COMMANDING PERFORMANCE
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every millimeter and kilowatt of the SUV-X has been sculpted for uncompromising poise,
            seamless high-speed stability, and responsive all-terrain dominance.
          </p>
        </div>

        {/* Specifications Grid / Mobile Swipeable Carousel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SPEC_DATA.map((spec) => {
            const displayVal = spec.isString
              ? spec.stringValue
              : animatedValues[spec.id] !== undefined
              ? `${animatedValues[spec.id]}${spec.suffix}`
              : `0${spec.suffix}`;

            return (
              <div
                key={spec.id}
                className="group relative rounded-2xl bg-[#0d121f]/60 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/40 p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)] flex flex-col justify-between"
              >
                {/* Top Row: Label & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono tracking-[0.2em] text-slate-400 font-semibold uppercase">
                    {spec.label}
                  </span>
                  <div className="p-2 rounded-xl bg-white/[0.04] group-hover:bg-cyan-400/10 transition-colors">
                    {spec.icon}
                  </div>
                </div>

                {/* Main Large Animated Number */}
                <div className="mb-2">
                  <div className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {displayVal}
                  </div>
                </div>

                {/* Subtext description */}
                <div className="text-xs text-slate-500 font-mono tracking-wide">
                  {spec.subtext}
                </div>

                {/* Bottom subtle accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/0 group-hover:via-cyan-400/40 to-transparent transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
