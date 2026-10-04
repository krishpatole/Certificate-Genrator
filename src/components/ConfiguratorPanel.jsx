import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  CircleDot,
  Disc,
  Armchair,
  Check,
  Sparkles,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Share2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  EXTERIOR_COLORS,
  WHEEL_OPTIONS,
  BRAKE_CALIPERS,
  INTERIOR_OPTIONS,
  BASE_PRICE,
} from '../data/configuratorData';
import { formatINR } from '../utils/formatters';

export default function ConfiguratorPanel({
  exteriorColor,
  setExteriorColor,
  wheelOption,
  setWheelOption,
  caliperOption,
  setCaliperOption,
  interiorOption,
  setInteriorOption,
  onProceedToSummary,
  onSaveConfiguration,
  onResetConfiguration,
  onShareConfiguration,
  activeStep,
  setActiveStep,
}) {
  const [activeTab, setActiveTab] = useState('exterior');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  // Animated Price Counter State
  const optionsPrice =
    (exteriorColor.price || 0) +
    (wheelOption.price || 0) +
    (caliperOption.price || 0) +
    (interiorOption.price || 0);

  const targetTotalPrice = BASE_PRICE + optionsPrice;
  const [displayedPrice, setDisplayedPrice] = useState(targetTotalPrice);
  const priceAnimationRef = useRef(null);

  // Smooth Price Number Counter Animation
  useEffect(() => {
    const startPrice = displayedPrice;
    const diff = targetTotalPrice - startPrice;
    if (diff === 0) return;

    const duration = 400; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startPrice + diff * easeProgress);

      setDisplayedPrice(current);

      if (progress < 1) {
        priceAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    priceAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (priceAnimationRef.current) cancelAnimationFrame(priceAnimationRef.current);
    };
  }, [targetTotalPrice]);

  const stages = [
    { id: 'exterior', label: 'EXTERIOR', icon: Palette, num: 1 },
    { id: 'wheels', label: 'WHEELS', icon: CircleDot, num: 2 },
    { id: 'calipers', label: 'BRAKES', icon: Disc, num: 3 },
    { id: 'interior', label: 'INTERIOR', icon: Armchair, num: 4 },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (setActiveStep) {
      setActiveStep(tabId);
    }
  };

  const handleSave = () => {
    if (onSaveConfiguration) {
      onSaveConfiguration();
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 2500);
    }
  };

  const handleShare = () => {
    if (onShareConfiguration) {
      onShareConfiguration();
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const handleConfirmReset = () => {
    if (onResetConfiguration) {
      onResetConfiguration();
    }
    setShowResetConfirm(false);
  };

  return (
    <div className="w-full flex flex-col bg-[#090c14]/95 border-t lg:border-t-0 lg:border-l border-white/10 backdrop-blur-2xl h-full shadow-2xl relative">
      {/* Toast Notification Alert */}
      {(saveNotification || copiedNotification) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 px-4 py-2 rounded-xl text-xs font-bold shadow-glow-cyan animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>
            {saveNotification
              ? 'Configuration Saved to Storage!'
              : 'Shareable Link Copied to Clipboard!'}
          </span>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black uppercase text-white font-display mb-1">
            Reset Configuration?
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
            This will restore all paint, wheels, calipers, and interior options to their factory baseline.
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Fast Action Utility Bar */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">
            <Zap className="w-3 h-3" />
            <span>VELOX STUDIO</span>
          </div>
          <h2 className="text-lg font-black uppercase text-white font-display">
            Customizer
          </h2>
        </div>

        {/* Save, Share, Reset Utility Icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-400 transition-all"
            title="Save Configuration"
            aria-label="Save current configuration to local storage"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-400 transition-all"
            title="Share Configuration Link"
            aria-label="Generate and copy shareable configuration link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-red-400 transition-all"
            title="Reset Configuration"
            aria-label="Reset configuration to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-Step Progress Indicator Bar: EXTERIOR -> WHEELS -> BRAKES -> INTERIOR -> SUMMARY */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider">
        {stages.map((stage, idx) => {
          const isActive = activeTab === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => handleTabChange(stage.id)}
              className={`flex items-center gap-1 transition-all py-1 px-1.5 rounded-md ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={`Go to ${stage.label} step`}
            >
              <span className="opacity-60">{stage.num}.</span>
              <span className="hidden sm:inline">{stage.label}</span>
            </button>
          );
        })}
        <button
          onClick={onProceedToSummary}
          className="text-slate-400 hover:text-cyan-400 transition-colors py-1 px-1.5"
          aria-label="Go to summary step"
        >
          <span className="opacity-60">5.</span>
          <span className="hidden sm:inline">SUMMARY</span>
        </button>
      </div>

      {/* Tab Navigation Grid */}
      <div className="grid grid-cols-4 p-2 bg-slate-950/50 border-b border-white/10 gap-1">
        {stages.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-glow-cyan font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* =========================================
            1. EXTERIOR COLOR TAB
        ========================================== */}
        {activeTab === 'exterior' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Exterior Paint
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                {exteriorColor.price > 0 ? `+${formatINR(exteriorColor.price)}` : 'Included'}
              </span>
            </div>

            {/* Selected Color Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl border border-white/20 shadow-inner shrink-0"
                style={{ backgroundColor: exteriorColor.hex }}
              />
              <div>
                <div className="text-sm font-bold text-white font-display">
                  {exteriorColor.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {exteriorColor.description}
                </div>
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {EXTERIOR_COLORS.map((color) => {
                const isSelected = exteriorColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setExteriorColor(color)}
                    className="group flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
                    aria-label={`Select paint ${color.name}`}
                  >
                    <div
                      className={`relative w-12 h-12 rounded-2xl transition-all duration-300 transform group-hover:scale-105 ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 shadow-glow-cyan'
                          : 'ring-1 ring-white/15'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className={`w-5 h-5 ${
                              color.id === 'white' ? 'text-black' : 'text-white'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-300 text-center truncate max-w-[62px]">
                      {color.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================
            2. WHEELS SELECTION TAB
        ========================================== */}
        {activeTab === 'wheels' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Wheel Package
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                {wheelOption.price > 0 ? `+${formatINR(wheelOption.price)}` : 'Included'}
              </span>
            </div>

            <div className="space-y-2.5">
              {WHEEL_OPTIONS.map((wheel) => {
                const isSelected = wheelOption.id === wheel.id;
                return (
                  <div
                    key={wheel.id}
                    onClick={() => setWheelOption(wheel)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400/80 shadow-glow-cyan'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-cyan-500 text-black border-cyan-300'
                            : 'bg-slate-800 text-slate-300 border-white/10'
                        }`}
                      >
                        <CircleDot className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-display">
                          {wheel.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {wheel.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right pl-2 shrink-0">
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        {wheel.price > 0 ? `+${formatINR(wheel.price)}` : 'Included'}
                      </div>
                      {isSelected && (
                        <span className="text-[9px] uppercase font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40 inline-block mt-1">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================
            3. BRAKE CALIPERS TAB
        ========================================== */}
        {activeTab === 'calipers' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Brake Calipers
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                {caliperOption.price > 0 ? `+${formatINR(caliperOption.price)}` : 'Included'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {BRAKE_CALIPERS.map((caliper) => {
                const isSelected = caliperOption.id === caliper.id;
                return (
                  <button
                    key={caliper.id}
                    onClick={() => setCaliperOption(caliper)}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-white/10 border-cyan-400 ring-2 ring-cyan-400/50 shadow-glow-cyan'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full mb-2 border border-white/20 flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: caliper.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            caliper.id === 'yellow' ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white font-display">
                      {caliper.shortName}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">
                      {caliper.price > 0 ? `+${formatINR(caliper.price)}` : 'Included'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================
            4. INTERIOR SELECTION TAB
        ========================================== */}
        {activeTab === 'interior' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Cockpit Interior
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                {interiorOption.price > 0 ? `+${formatINR(interiorOption.price)}` : 'Included'}
              </span>
            </div>

            <div className="space-y-2.5">
              {INTERIOR_OPTIONS.map((item) => {
                const isSelected = interiorOption.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setInteriorOption(item)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400/80 shadow-glow-cyan'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl border border-white/20 shrink-0 flex items-center justify-center shadow-md"
                        style={{ backgroundColor: item.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 ${
                              item.id === 'white' ? 'text-black' : 'text-white'
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-display">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right pl-2 shrink-0">
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        {item.price > 0 ? `+${formatINR(item.price)}` : 'Included'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          DYNAMIC PRICE CALCULATOR FOOTER
      ========================================== */}
      <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/10 space-y-3.5">
        {/* Dynamic Price Breakdown with Animated Number */}
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>BASE PRICE</span>
            <span className="text-slate-200">{formatINR(BASE_PRICE)}</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>OPTIONS</span>
            <span className="text-cyan-400">+{formatINR(optionsPrice)}</span>
          </div>

          <div className="h-[1px] bg-white/10 my-1.5"></div>

          <div className="flex justify-between items-baseline pt-0.5">
            <span className="font-bold text-xs sm:text-sm text-white font-display tracking-wider">
              TOTAL PRICE
            </span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-display">
              {formatINR(displayedPrice)}
            </span>
          </div>
        </div>

        {/* Next Step CTA */}
        <button
          onClick={onProceedToSummary}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <span>Summary & Reservation</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
