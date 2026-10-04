import React from 'react';
import { Type, Sliders, Palette, RotateCcw, Compass } from 'lucide-react';
import {
  AVAILABLE_FONTS,
  COLOR_OPTIONS,
  FontOption,
} from '../config/certificateConfig';

interface CertificateCustomizerProps {
  selectedFontId: string;
  onFontChange: (font: FontOption) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  yOffset: number;
  onYOffsetChange: (offset: number) => void;
  fontColor: string;
  onColorChange: (hex: string) => void;
  showGuide: boolean;
  onToggleGuide: (show: boolean) => void;
  onReset: () => void;
}

const CertificateCustomizer: React.FC<CertificateCustomizerProps> = ({
  selectedFontId,
  onFontChange,
  fontSize,
  onFontSizeChange,
  yOffset,
  onYOffsetChange,
  fontColor,
  onColorChange,
  showGuide,
  onToggleGuide,
  onReset,
}) => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Typography & Position
          </span>
        </div>
        <button
          onClick={onReset}
          title="Reset to default calibrated settings"
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* 1. Font Style Dropdown / Selector */}
      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          <Type className="w-3 h-3 text-slate-400" />
          Font Style
        </label>
        <select
          value={selectedFontId}
          onChange={(e) => {
            const font = AVAILABLE_FONTS.find((f) => f.id === e.target.value);
            if (font) onFontChange(font);
          }}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {AVAILABLE_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Font Size Slider */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
          <span className="text-slate-500">Font Size</span>
          <span className="text-indigo-600 font-bold">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="34"
          max="66"
          step="1"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
          <span>Small (34px)</span>
          <span>Default (50px)</span>
          <span>Large (66px)</span>
        </div>
      </div>

      {/* 3. Vertical Position Nudge (Y-Offset) */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
          <span className="text-slate-500">Position Nudge (Up / Down)</span>
          <span className={`font-bold ${yOffset === 0 ? 'text-slate-500' : 'text-indigo-600'}`}>
            {yOffset > 0 ? `+${yOffset}px (Lower)` : yOffset < 0 ? `${yOffset}px (Higher)` : 'Exact Line (0)'}
          </span>
        </div>
        <input
          type="range"
          min="-24"
          max="24"
          step="1"
          value={yOffset}
          onChange={(e) => onYOffsetChange(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
          <span>▲ Higher (-24px)</span>
          <span>Calibrated Center (0)</span>
          <span>▼ Lower (+24px)</span>
        </div>
      </div>

      {/* 4. Text Color Swatches */}
      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Palette className="w-3 h-3 text-slate-400" />
          Text Color
        </label>
        <div className="flex items-center gap-2">
          {COLOR_OPTIONS.map((c) => {
            const isSelected = fontColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onColorChange(c.hex)}
                title={c.name}
                className={`relative flex items-center justify-center w-7 h-7 rounded-full border transition-all ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Alignment Guide Switch */}
      <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 cursor-pointer select-none">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          Show Alignment Guide Lines
        </label>
        <button
          type="button"
          onClick={() => onToggleGuide(!showGuide)}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
            showGuide ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              showGuide ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default CertificateCustomizer;
