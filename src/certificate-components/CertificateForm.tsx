import React from 'react';
import { User, Award, AlertCircle, ChevronDown } from 'lucide-react';
import { CertificateType, CERTIFICATE_OPTIONS } from '../config/certificateConfig';

interface CertificateFormProps {
  participantName: string;
  onNameChange: (name: string) => void;
  certificateType: CertificateType;
  onTypeChange: (type: CertificateType) => void;
  error: string;
}

const CERT_ICONS: Record<string, string> = {
  round1: '🥇',
  round2: '🥈',
  nomination: '🏅',
};

const CertificateForm: React.FC<CertificateFormProps> = ({
  participantName,
  onNameChange,
  certificateType,
  onTypeChange,
  error,
}) => {
  return (
    <div className="space-y-5">
      {/* Participant Name */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          <User className="w-3.5 h-3.5" />
          Participant Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={participantName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter participant name"
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-slate-800 text-sm
              placeholder-slate-300 bg-white transition-all duration-200
              focus:outline-none focus:ring-4
              ${error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-50'
              }`}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>

      {/* Certificate Type */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          <Award className="w-3.5 h-3.5" />
          Certificate Type
        </label>
        <div className="relative">
          <select
            value={certificateType}
            onChange={(e) => onTypeChange(e.target.value as CertificateType)}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white
              text-slate-800 text-sm appearance-none cursor-pointer
              focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50
              transition-all duration-200"
          >
            {CERTIFICATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {CERT_ICONS[opt.value]} {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Active selection chip */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
        <span className="text-base">{CERT_ICONS[certificateType]}</span>
        <div>
          <p className="text-xs font-bold text-indigo-700 leading-tight">
            {CERTIFICATE_OPTIONS.find((o) => o.value === certificateType)?.label}
          </p>
          <p className="text-[10px] text-indigo-400 leading-tight mt-0.5">
            KGCE × SIH 2026
          </p>
        </div>
        <span className="ml-auto text-[10px] font-bold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
          ACTIVE
        </span>
      </div>
    </div>
  );
};

export default CertificateForm;
