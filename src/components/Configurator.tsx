import React, { useState } from 'react';
import {
  Palette,
  Disc,
  Layers,
  CircleDot,
  Armchair,
  Lightbulb,
  Check,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  BodyColorOption,
  RoofOption,
  WheelOption,
  BrakeOption,
  InteriorOption,
  ConfiguratorState,
} from '../types/car';

export const BODY_COLORS: BodyColorOption[] = [
  {
    id: 'obsidian_black',
    name: 'Obsidian Black',
    hex: '#0a0d12',
    threeColor: 0x0a0d12,
    roughness: 0.12,
    metalness: 0.94,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  },
  {
    id: 'pearl_white',
    name: 'Pearl White',
    hex: '#e2e8f0',
    threeColor: 0xe2e8f0,
    roughness: 0.18,
    metalness: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  },
  {
    id: 'racing_red',
    name: 'Racing Red',
    hex: '#c91428',
    threeColor: 0xc91428,
    roughness: 0.1,
    metalness: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  },
  {
    id: 'titanium_grey',
    name: 'Titanium Grey',
    hex: '#4b5360',
    threeColor: 0x4b5360,
    roughness: 0.14,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  },
  {
    id: 'deep_blue',
    name: 'Deep Blue',
    hex: '#0f3a68',
    threeColor: 0x0f3a68,
    roughness: 0.12,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  },
];

export const ROOF_OPTIONS: RoofOption[] = [
  {
    id: 'body',
    name: 'Body Colour Roof',
    description: 'Seamless monotone body finish with tinted panoramic glass',
    price: 0,
  },
  {
    id: 'black',
    name: 'Contrast Piano Black Roof',
    description: 'Two-tone high-gloss black roof and pillar package',
    price: 950,
  },
];

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: 'standard',
    name: 'Standard 20" Alloys',
    description: 'Precision-machined silver finish alloys',
    size: '20-inch',
    color: 0xd8dde6,
    metalness: 0.92,
    roughness: 0.22,
    price: 0,
  },
  {
    id: 'sport',
    name: 'Sport 21" Anthracite',
    description: 'Satin gunmetal titanium alloy with aerodynamic fins',
    size: '21-inch',
    color: 0x5a6270,
    metalness: 0.95,
    roughness: 0.18,
    price: 1450,
  },
  {
    id: 'performance',
    name: 'Performance 22" Diamond Black',
    description: 'Forged gloss black wheels with diamond-cut outer lip',
    size: '22-inch',
    color: 0x111317,
    metalness: 0.98,
    roughness: 0.08,
    price: 2200,
  },
];

export const BRAKE_OPTIONS: BrakeOption[] = [
  {
    id: 'standard',
    name: 'Standard Calipers',
    colorHex: '#94a3b8',
    threeColor: 0x94a3b8,
    price: 0,
  },
  {
    id: 'red',
    name: 'Brembo Racing Red',
    colorHex: '#dc2626',
    threeColor: 0xdc2626,
    price: 650,
  },
  {
    id: 'yellow',
    name: 'Acid Performance Yellow',
    colorHex: '#eab308',
    threeColor: 0xeab308,
    price: 750,
  },
];

export const INTERIOR_OPTIONS: InteriorOption[] = [
  {
    id: 'black',
    name: 'Obsidian Black Leather',
    primaryColor: 0x14161a,
    secondaryColor: 0x22262d,
    description: 'Perforated black Nappa leather with dark aluminum inlays',
    price: 0,
  },
  {
    id: 'tan',
    name: 'Cognac Tan Luxury Leather',
    primaryColor: 0x8a4b22,
    secondaryColor: 0x5e3114,
    description: 'Warm cognac saddle leather with open-pore natural oak wood',
    price: 1800,
  },
  {
    id: 'red_black',
    name: 'Dual-Tone Red / Black Sport',
    primaryColor: 0x82121f,
    secondaryColor: 0x14161a,
    description: 'Crimson sport bolsters paired with carbon fiber structure',
    price: 2400,
  },
];

const BASE_PRICE = 58900;

interface ConfiguratorProps {
  state: ConfiguratorState;
  onChangeColor: (color: BodyColorOption) => void;
  onChangeRoof: (roof: RoofOption) => void;
  onChangeWheel: (wheel: WheelOption) => void;
  onChangeBrake: (brake: BrakeOption) => void;
  onChangeInterior: (interior: InteriorOption) => void;
  onToggleHeadlights: () => void;
  onReset: () => void;
  onFocusInteriorMode: () => void;
}

export const Configurator: React.FC<ConfiguratorProps> = ({
  state,
  onChangeColor,
  onChangeRoof,
  onChangeWheel,
  onChangeBrake,
  onChangeInterior,
  onToggleHeadlights,
  onReset,
  onFocusInteriorMode,
}) => {
  const [activeTab, setActiveTab] = useState<'EXTERIOR' | 'INTERIOR'>('EXTERIOR');
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Calculate total price
  const totalPrice =
    BASE_PRICE +
    state.roof.price +
    state.wheels.price +
    state.brakes.price +
    state.interior.price;

  const handleOrder = () => {
    setOrderModalOpen(true);
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ffffff', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Tab Selector: Exterior vs Interior */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('EXTERIOR')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 focus:outline-none ${
              activeTab === 'EXTERIOR'
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            EXTERIOR
          </button>
          <button
            onClick={() => {
              setActiveTab('INTERIOR');
              onFocusInteriorMode();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 focus:outline-none ${
              activeTab === 'INTERIOR'
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            INTERIOR
          </button>
        </div>

        {/* Headlight Quick Toggle */}
        <button
          onClick={onToggleHeadlights}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            state.headlightsOn
              ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
          title="Toggle Headlights"
        >
          <Lightbulb className={`w-3.5 h-3.5 ${state.headlightsOn ? 'text-cyan-400' : ''}`} />
          <span>LED LIGHTS: {state.headlightsOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* EXTERIOR CUSTOMIZATION */}
      {activeTab === 'EXTERIOR' && (
        <div className="space-y-6">
          {/* 1. Body Colour */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                BODY COLOUR
              </span>
              <span className="text-xs font-semibold text-white">{state.bodyColor.name}</span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {BODY_COLORS.map((color) => {
                const isSelected = state.bodyColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => onChangeColor(color)}
                    className={`group relative h-12 rounded-xl border transition-all duration-300 flex items-center justify-center focus:outline-none ${
                      isSelected
                        ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105'
                        : 'border-white/[0.12] hover:border-white/40'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {isSelected && (
                      <Check className={`w-4 h-4 ${color.id === 'pearl_white' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Roof Package */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                ROOF FINISH
              </span>
              <span className="text-xs font-semibold text-white">
                {state.roof.price > 0 ? `+$${state.roof.price}` : 'INCLUDED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ROOF_OPTIONS.map((roof) => {
                const isSelected = state.roof.id === roof.id;
                return (
                  <button
                    key={roof.id}
                    onClick={() => onChangeRoof(roof)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-300 focus:outline-none ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white mb-1">{roof.name}</div>
                    <div className="text-[10px] text-slate-400">{roof.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Wheels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
                WHEELS
              </span>
              <span className="text-xs font-semibold text-white">{state.wheels.size}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {WHEEL_OPTIONS.map((w) => {
                const isSelected = state.wheels.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => onChangeWheel(w)}
                    className={`p-3 rounded-xl text-left border transition-all duration-300 focus:outline-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white leading-tight mb-1">{w.name}</div>
                      <div className="text-[10px] text-slate-400">{w.size}</div>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-300 mt-2">
                      {w.price > 0 ? `+$${w.price}` : 'INCLUDED'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Brake Calipers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <Disc className="w-3.5 h-3.5 text-cyan-400" />
                BRAKE CALIPERS
              </span>
              <span className="text-xs font-semibold text-white">{state.brakes.name}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {BRAKE_OPTIONS.map((b) => {
                const isSelected = state.brakes.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => onChangeBrake(b)}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2.5 focus:outline-none ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: b.colorHex }}
                    />
                    <div className="text-left">
                      <div className="text-xs font-medium text-white">{b.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {b.price > 0 ? `+$${b.price}` : 'STD'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* INTERIOR CUSTOMIZATION */}
      {activeTab === 'INTERIOR' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <Armchair className="w-3.5 h-3.5 text-cyan-400" />
                INTERIOR UPHOLSTERY
              </span>
              <span className="text-xs font-semibold text-white">{state.interior.name}</span>
            </div>

            <div className="space-y-3">
              {INTERIOR_OPTIONS.map((int) => {
                const isSelected = state.interior.id === int.id;
                return (
                  <button
                    key={int.id}
                    onClick={() => onChangeInterior(int)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left focus:outline-none flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white mb-1">{int.name}</div>
                      <div className="text-[11px] text-slate-400 max-w-xs">{int.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-300">
                        {int.price > 0 ? `+$${int.price}` : 'INCLUDED'}
                      </div>
                      {isSelected && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-cyan-400 mt-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pricing & Checkout Panel */}
      <div className="pt-6 border-t border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            CONFIGURED MSRP
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            ${totalPrice.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOrder}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            RESERVE YOUR BUILD
          </button>
          <button
            onClick={onReset}
            className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors focus:outline-none"
            title="Reset Build"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reservation Confirmation Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0e1a] border border-cyan-400/40 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="font-display font-black text-2xl text-white mb-2 tracking-tight">
              BUILD RESERVED
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Your bespoke SUV-X specification has been transmitted to the production allocation system.
            </p>

            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 text-left space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Exterior Paint:</span>
                <span className="font-semibold text-white">{state.bodyColor.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Roof Finish:</span>
                <span className="font-semibold text-white">{state.roof.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Wheels:</span>
                <span className="font-semibold text-white">{state.wheels.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Brakes:</span>
                <span className="font-semibold text-white">{state.brakes.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Interior:</span>
                <span className="font-semibold text-white">{state.interior.name}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between font-bold text-sm text-cyan-300">
                <span>Final MSRP:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setOrderModalOpen(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-widest transition-colors"
            >
              CLOSE CONFIRMATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
