import React, { useState } from 'react';
import { BASE_PRICE } from '../data/configuratorData';
import { formatINR } from '../utils/formatters';
import { encodeConfigToUrl, saveConfigToStorage } from '../utils/configStorage';
import confetti from 'canvas-confetti';
import {
  FileText,
  Share2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
  Bookmark,
  X,
} from 'lucide-react';

export default function SummarySection({
  exteriorColor,
  wheelOption,
  caliperOption,
  interiorOption,
  onNavigateToConfigurator,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [reservationName, setReservationName] = useState('');
  const [reservationEmail, setReservationEmail] = useState('');
  const [reservationCity, setReservationCity] = useState('');
  const [reservedSuccess, setReservedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const optionsPrice =
    (exteriorColor.price || 0) +
    (wheelOption.price || 0) +
    (caliperOption.price || 0) +
    (interiorOption.price || 0);

  const totalPrice = BASE_PRICE + optionsPrice;
  const bookingAmount = 500000; // ₹5,00,000 refundable reservation token

  const handleOpenReservation = () => {
    setModalOpen(true);
    setReservedSuccess(false);
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    setReservedSuccess(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#38bdf8', '#ffffff', '#ff2a4b'],
    });
  };

  const handleShare = () => {
    const shareUrl = encodeConfigToUrl({
      exteriorColor,
      wheelOption,
      caliperOption,
      interiorOption,
    });
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    saveConfigToStorage({
      exteriorColor,
      wheelOption,
      caliperOption,
      interiorOption,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDownloadSpec = () => {
    const specContent = `
========================================
       VELOX — BESPOKE BUILD SHEET      
========================================
Date: ${new Date().toLocaleDateString()}

SPECIFICATIONS:
• Powertrain: Dual High-Output Permanent Magnet Motors
• Max Power: 520 HP
• Acceleration: 3.8 sec (0–100 km/h)
• Top Speed: 310 km/h
• Range: 620 km (WLTP)

CUSTOM CONFIGURATION:
• Exterior Paint: ${exteriorColor.name} (${exteriorColor.price > 0 ? `+${formatINR(exteriorColor.price)}` : 'Included'})
• Wheels: ${wheelOption.name} (${wheelOption.price > 0 ? `+${formatINR(wheelOption.price)}` : 'Included'})
• Brake Calipers: ${caliperOption.name} (${caliperOption.price > 0 ? `+${formatINR(caliperOption.price)}` : 'Included'})
• Interior: ${interiorOption.name} (${interiorOption.price > 0 ? `+${formatINR(interiorOption.price)}` : 'Included'})

PRICING BREAKDOWN:
• Base Price:     ${formatINR(BASE_PRICE)}
• Options Total:  +${formatINR(optionsPrice)}
----------------------------------------
• TOTAL PRICE:    ${formatINR(totalPrice)} (Ex-Showroom)
========================================
Share Link: ${encodeConfigToUrl({ exteriorColor, wheelOption, caliperOption, interiorOption })}
    `;

    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VeloX_Build_Spec_${exteriorColor.shortName}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="summary" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <FileText className="w-3.5 h-3.5" />
          Final Build Specification
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-display tracking-tight mb-4">
          YOUR CUSTOM VELOX.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Review your tailored configuration details and reserve your handcrafted production allocation slot.
        </p>
      </div>

      {/* Summary Content Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Build Selections */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold uppercase text-white font-display border-b border-white/10 pb-4">
              Selected Specification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Paint Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl shrink-0 border border-white/20 shadow-md"
                  style={{ backgroundColor: exteriorColor.hex }}
                />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Exterior Paint
                  </div>
                  <div className="text-sm font-bold text-white font-display mt-0.5">
                    {exteriorColor.name}
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    {exteriorColor.price > 0 ? `+${formatINR(exteriorColor.price)}` : 'Included'}
                  </div>
                </div>
              </div>

              {/* Wheels Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0 border border-white/10 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Wheel Set
                  </div>
                  <div className="text-sm font-bold text-white font-display mt-0.5">
                    {wheelOption.name}
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    {wheelOption.price > 0 ? `+${formatINR(wheelOption.price)}` : 'Included'}
                  </div>
                </div>
              </div>

              {/* Caliper Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-full shrink-0 border border-white/20 shadow-md"
                  style={{ backgroundColor: caliperOption.hex }}
                />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Brake Calipers
                  </div>
                  <div className="text-sm font-bold text-white font-display mt-0.5">
                    {caliperOption.name}
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    {caliperOption.price > 0 ? `+${formatINR(caliperOption.price)}` : 'Included'}
                  </div>
                </div>
              </div>

              {/* Interior Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl shrink-0 border border-white/20 shadow-md"
                  style={{ backgroundColor: interiorOption.hex }}
                />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Cockpit Interior
                  </div>
                  <div className="text-sm font-bold text-white font-display mt-0.5">
                    {interiorOption.name}
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    {interiorOption.price > 0 ? `+${formatINR(interiorOption.price)}` : 'Included'}
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions Checklist */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Complimentary Ownership Privileges Included
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>8-Year / 160,000 km Battery Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>24/7 Global Concierge & Roadside</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Complimentary 22kW Home Wallbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lifetime Over-The-Air Neural Upgrades</span>
                </div>
              </div>
            </div>

            {/* Modify Configuration CTA */}
            <button
              onClick={onNavigateToConfigurator}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Want to tweak options? Return to 3D Configurator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Column: Pricing Breakdown & Reservation */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono mb-2">
                Investment Summary
              </div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-display mb-6">
                {formatINR(totalPrice)}
              </div>

              {/* Price Details Table */}
              <div className="space-y-3 text-xs font-mono border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Base VeloX GT Platform</span>
                  <span>{formatINR(BASE_PRICE)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Custom Exterior Paint</span>
                  <span className={exteriorColor.price > 0 ? 'text-cyan-400' : ''}>
                    {exteriorColor.price > 0 ? `+${formatINR(exteriorColor.price)}` : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Forged Wheels & Tires</span>
                  <span className={wheelOption.price > 0 ? 'text-cyan-400' : ''}>
                    {wheelOption.price > 0 ? `+${formatINR(wheelOption.price)}` : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Brembo Brake Package</span>
                  <span className={caliperOption.price > 0 ? 'text-cyan-400' : ''}>
                    {caliperOption.price > 0 ? `+${formatINR(caliperOption.price)}` : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cockpit Interior Package</span>
                  <span className={interiorOption.price > 0 ? 'text-cyan-400' : ''}>
                    {interiorOption.price > 0 ? `+${formatINR(interiorOption.price)}` : '₹0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleOpenReservation}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-widest shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Reserve Your Build Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleSave}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Save Configuration"
                >
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{saved ? 'Saved!' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Share Configuration Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  onClick={handleDownloadSpec}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Download Build Spec Sheet"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Spec</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b0e17] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!reservedSuccess ? (
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                    Priority Reservation
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase text-white font-display mb-2">
                  Reserve Your VeloX GT
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Place a 100% refundable token of {formatINR(bookingAmount)} to secure your bespoke assembly line position.
                </p>

                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={reservationName}
                      onChange={(e) => setReservationName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={reservationEmail}
                      onChange={(e) => setReservationEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Delivery City / Region
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Bengaluru, Delhi NCR"
                      value={reservationCity}
                      onChange={(e) => setReservationCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold text-xs uppercase tracking-widest shadow-glow-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all"
                    >
                      Confirm Reservation ({formatINR(bookingAmount)})
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-5 shadow-glow-cyan">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white font-display mb-2">
                  Reservation Confirmed!
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                  Congratulations <span className="text-cyan-400 font-bold">{reservationName || 'Driver'}</span>!
                  Your build slot <span className="font-mono text-cyan-400">#VLX-2026-{Math.floor(1000 + Math.random() * 9000)}</span> has been reserved.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 mb-6 text-left space-y-1">
                  <div>• Spec: {exteriorColor.name} | {wheelOption.shortName} | {interiorOption.shortName}</div>
                  <div>• Estimated Total: {formatINR(totalPrice)}</div>
                  <div>• Production Handover: Q4 2026</div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
