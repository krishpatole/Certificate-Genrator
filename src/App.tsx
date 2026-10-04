import React, { useRef, useState } from 'react';
import CertificateForm from './certificate-components/CertificateForm';
import CertificatePreview from './certificate-components/CertificatePreview';
import CertificateActions from './certificate-components/CertificateActions';
import CertificateCustomizer from './certificate-components/CertificateCustomizer';
import {
  CertificateType,
  CERTIFICATE_OPTIONS,
  CERTIFICATE_CONFIGS,
  AVAILABLE_FONTS,
  FontOption,
} from './config/certificateConfig';
import {
  GraduationCap,
  Eye,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const CERT_META: Record<
  CertificateType,
  { badge: string; color: string; bg: string; border: string; desc: string }
> = {
  round1: {
    badge: 'Round 1',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Prototype Demonstration · 24 Aug 2026',
  },
  round2: {
    badge: 'Round 2',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'PPT Presentation · 4 Sep 2026',
  },
  nomination: {
    badge: 'Nomination',
    color: 'text-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    desc: 'SIH Final Nomination · 4 Sep 2026',
  },
};

const SAMPLE_NAMES = [
  { name: 'Rahul Sharma', type: 'round1' as CertificateType, label: 'Test 1: Rahul (R1)' },
  { name: 'Amit Patil', type: 'round2' as CertificateType, label: 'Test 2: Amit (R2)' },
  { name: 'Sneha Joshi', type: 'nomination' as CertificateType, label: 'Test 3: Sneha (Nom)' },
];

const App: React.FC = () => {
  const [participantName, setParticipantName] = useState('');
  const [certificateType, setCertificateType] = useState<CertificateType>('round1');
  const [nameError, setNameError] = useState('');

  // Typography & positioning states
  const [selectedFont, setSelectedFont] = useState<FontOption>(AVAILABLE_FONTS[0]); // Alex Brush
  const [fontSize, setFontSize] = useState<number>(50);
  const [yOffset, setYOffset] = useState<number>(0);
  const [fontColor, setFontColor] = useState<string>('#9a6b18');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const meta = CERT_META[certificateType];
  const config = CERTIFICATE_CONFIGS[certificateType];

  const validate = (): boolean => {
    if (!participantName.trim()) {
      setNameError('Please enter participant name.');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (name: string) => {
    setParticipantName(name);
    if (nameError && name.trim()) setNameError('');
  };

  const handleResetSettings = () => {
    setSelectedFont(AVAILABLE_FONTS[0]);
    setFontSize(50);
    setYOffset(0);
    setFontColor('#9a6b18');
    setShowGuide(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-slate-900 flex flex-col font-sans">
      {/* ════ HEADER ═════════════════════════════════════════════ */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-md shadow-indigo-500/25 text-white flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                  KGCE <span className="text-slate-400 font-normal">×</span> SIH 2026
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  OFFICIAL GENERATOR
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Konkan Gyanpeeth College of Engineering, Karjat
              </p>
            </div>
          </div>

          {/* Quick preset test buttons */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              Quick Fill:
            </span>
            {SAMPLE_NAMES.map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  setParticipantName(s.name);
                  setCertificateType(s.type);
                  setNameError('');
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:text-indigo-600 hover:shadow-xs transition-all border border-slate-200/50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ════ MAIN CONTENT ═══════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ──── LEFT PANEL: CONTROLS ──────────────────────────── */}
          <aside className="w-full lg:w-[360px] xl:w-[390px] flex-shrink-0 space-y-4">
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                    Step 1 & 2
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto Aligned
                  </span>
                </div>
                <h2 className="text-base font-bold mt-0.5">Certificate Details</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Enter name and select certificate template
                </p>
              </div>

              <div className="p-5 space-y-5">
                <CertificateForm
                  participantName={participantName}
                  onNameChange={handleNameChange}
                  certificateType={certificateType}
                  onTypeChange={(t) => {
                    setCertificateType(t);
                    setNameError('');
                  }}
                  error={nameError}
                />

                {/* Typography and Position Customizer */}
                <CertificateCustomizer
                  selectedFontId={selectedFont.id}
                  onFontChange={setSelectedFont}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  yOffset={yOffset}
                  onYOffsetChange={setYOffset}
                  fontColor={fontColor}
                  onColorChange={setFontColor}
                  showGuide={showGuide}
                  onToggleGuide={setShowGuide}
                  onReset={handleResetSettings}
                />
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Generate & Export
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  A4 Landscape · 300 DPI
                </span>
              </div>
              <CertificateActions
                participantName={participantName}
                certificateType={certificateType}
                fontFamily={selectedFont.fontFamily}
                fontSize={fontSize}
                fontColor={fontColor}
                fontWeight={selectedFont.defaultWeight}
                fontStyle={selectedFont.defaultStyle}
                yOffset={yOffset}
                onGenerate={validate}
              />
            </div>
          </aside>

          {/* ──── RIGHT PANEL: LIVE PREVIEW ────────────────────── */}
          <section className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
              {/* Header Bar */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">
                        {config.label}
                      </h3>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {config.subLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Line calibrated at exact Y={config.lineY}px · Real-time vector rendering
                    </p>
                  </div>
                </div>

                {/* Certificate Pills */}
                <div className="flex items-center gap-1.5">
                  {CERTIFICATE_OPTIONS.map((opt) => {
                    const isSelected = certificateType === opt.value;
                    const m = CERT_META[opt.value as CertificateType];
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setCertificateType(opt.value as CertificateType);
                          setNameError('');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isSelected
                            ? `${m.bg} ${m.border} ${m.color} shadow-xs ring-1 ring-indigo-400/30`
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m.badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Canvas Preview Stage */}
              <div className="p-4 sm:p-7 bg-[#f6f7fb]">
                <div className="mx-auto max-w-[880px]">
                  <CertificatePreview
                    key={certificateType}
                    participantName={participantName}
                    certificateType={certificateType}
                    fontFamily={selectedFont.fontFamily}
                    fontSize={fontSize}
                    fontColor={fontColor}
                    fontWeight={selectedFont.defaultWeight}
                    fontStyle={selectedFont.defaultStyle}
                    yOffset={yOffset}
                    showGuide={showGuide}
                    previewRef={previewRef}
                  />
                </div>
              </div>

              {/* Bottom Details Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Font: <strong className="text-slate-700">{selectedFont.name}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Size: <strong className="text-slate-700">{fontSize}px</strong>
                  </span>
                  {yOffset !== 0 && (
                    <>
                      <span>·</span>
                      <span className="text-indigo-600 font-semibold">
                        Offset: {yOffset > 0 ? `+${yOffset}px` : `${yOffset}px`}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {participantName.trim() ? (
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {participantName.trim()}
                    </span>
                  ) : (
                    <span className="text-slate-400">Enter name to preview on line</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ════ FOOTER ═════════════════════════════════════════════ */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
        <p>
          KGCE × Smart India Hackathon 2026 Internal Hackathon · Konkan Gyanpeeth College of Engineering, Karjat
        </p>
      </footer>
    </div>
  );
};

export default App;
