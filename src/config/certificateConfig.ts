// ============================================================
// Certificate Configuration — KGCE × SIH 2026
// Exact pixel calibration for 1024 × 724 templates.
// Each certificate has its own calibrated line position.
// ============================================================

import round1Img from '../assets/certificates/round1.jpg';
import round2Img from '../assets/certificates/round2.jpg';
import nominationImg from '../assets/certificates/nomination.jpg';

export type CertificateType = 'round1' | 'round2' | 'nomination';

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'script' | 'serif' | 'formal';
  defaultWeight: string;
  defaultStyle?: string;
  previewSample: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  {
    id: 'alex-brush',
    name: 'Alex Brush (Elegant Calligraphy)',
    fontFamily: '"Alex Brush", cursive',
    category: 'script',
    defaultWeight: '400',
    previewSample: 'Rahul Sharma',
  },
  {
    id: 'pinyon-script',
    name: 'Pinyon Script (Royal Diploma)',
    fontFamily: '"Pinyon Script", cursive',
    category: 'script',
    defaultWeight: '400',
    previewSample: 'Rahul Sharma',
  },
  {
    id: 'great-vibes',
    name: 'Great Vibes (Classic Script)',
    fontFamily: '"Great Vibes", cursive',
    category: 'script',
    defaultWeight: '400',
    previewSample: 'Rahul Sharma',
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display (Academic Serif)',
    fontFamily: '"Playfair Display", serif',
    category: 'serif',
    defaultWeight: '700',
    defaultStyle: 'italic',
    previewSample: 'Rahul Sharma',
  },
  {
    id: 'cormorant-garamond',
    name: 'Cormorant Garamond (Luxury Serif)',
    fontFamily: '"Cormorant Garamond", serif',
    category: 'serif',
    defaultWeight: '700',
    defaultStyle: 'italic',
    previewSample: 'Rahul Sharma',
  },
  {
    id: 'cinzel',
    name: 'Cinzel (Roman Lapidary)',
    fontFamily: '"Cinzel", serif',
    category: 'formal',
    defaultWeight: '700',
    previewSample: 'RAHUL SHARMA',
  },
];

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'gold', name: 'SIH Gold', hex: '#9a6b18' },
  { id: 'bronze', name: 'Deep Bronze', hex: '#7d5112' },
  { id: 'navy', name: 'Royal Navy', hex: '#1e293b' },
  { id: 'burgundy', name: 'Vintage Maroon', hex: '#701a28' },
  { id: 'black', name: 'Classic Black', hex: '#0f172a' },
];

export interface CertificateConfig {
  id: CertificateType;
  label: string;
  subLabel: string;
  dateStr: string;
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  // Calibrated positions on 1024x724 template
  lineY: number;          // exact Y of the gold divider line
  textPresentedBottomY: number; // bottom of "This certificate is presented to"
  defaultCenterY: number; // calibrated Y center for the participant name
  defaultFontSize: number;
  maxTextWidth: number;
}

export const CERTIFICATE_CONFIGS: Record<CertificateType, CertificateConfig> = {
  round1: {
    id: 'round1',
    label: 'Round 1 Certificate',
    subLabel: 'Prototype Demonstration',
    dateStr: '24 August 2026',
    imageSrc: round1Img,
    naturalWidth: 1024,
    naturalHeight: 724,
    textPresentedBottomY: 295,
    lineY: 380,
    // Optimal center in the 295-380px zone: 342px sits gracefully right above the gold line
    defaultCenterY: 343,
    defaultFontSize: 50,
    maxTextWidth: 640,
  },

  round2: {
    id: 'round2',
    label: 'Round 2 Certificate',
    subLabel: 'PPT Presentation',
    dateStr: '4 September 2026',
    imageSrc: round2Img,
    naturalWidth: 1024,
    naturalHeight: 724,
    textPresentedBottomY: 295,
    // Gold line is 8px lower on Round 2 template (Y = 388)
    lineY: 388,
    // Calibrated center in the 295-388px zone
    defaultCenterY: 349,
    defaultFontSize: 50,
    maxTextWidth: 640,
  },

  nomination: {
    id: 'nomination',
    label: 'Nomination Certificate',
    subLabel: 'Internal Hackathon Nomination',
    dateStr: '4 September 2026',
    imageSrc: nominationImg,
    naturalWidth: 1024,
    naturalHeight: 724,
    textPresentedBottomY: 294,
    // Gold line is 20px lower on Nomination template (Y = 400)
    lineY: 400,
    // Calibrated center in the 294-400px zone
    defaultCenterY: 356,
    defaultFontSize: 50,
    maxTextWidth: 640,
  },
};

export const CERTIFICATE_OPTIONS = Object.values(CERTIFICATE_CONFIGS).map((c) => ({
  value: c.id,
  label: c.label,
  subLabel: c.subLabel,
  dateStr: c.dateStr,
}));
