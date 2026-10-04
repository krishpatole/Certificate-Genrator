import React, { useState } from 'react';
import { Download, Printer, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { CERTIFICATE_CONFIGS, CertificateType } from '../config/certificateConfig';
import { preloadCertificateImage, getCachedCertificateImage } from '../utils/imageLoader';

interface CertificateActionsProps {
  participantName: string;
  certificateType: CertificateType;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight?: string;
  fontStyle?: string;
  yOffset: number;
  onGenerate: () => boolean;
}

// Render at 2× super-sampled resolution (2048 × 1448) for pristine print & PDF clarity
async function renderHighResCertificate(
  type: CertificateType,
  name: string,
  fontFamily: string,
  baseFontSize: number,
  fontColor: string,
  fontWeight = '400',
  fontStyle = 'normal',
  yOffset = 0
): Promise<HTMLCanvasElement> {
  const config = CERTIFICATE_CONFIGS[type];
  const superScale = 2; // 2x supersampling -> 2048 x 1448
  const W = config.naturalWidth * superScale;
  const H = config.naturalHeight * superScale;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Get cached or preload image
  let img = getCachedCertificateImage(type);
  if (!img) {
    img = await preloadCertificateImage(type);
  }

  // Clear to pure white first
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // 2. Draw template image at full resolution
  ctx.drawImage(img, 0, 0, W, H);

  // 3. Draw participant name
  const trimmed = name.trim();
  if (trimmed) {
    const scaledFontSize = Math.round(baseFontSize * superScale);
    const fontDeclaration = `${fontStyle === 'italic' ? 'italic ' : ''}${fontWeight} ${scaledFontSize}px ${fontFamily}`;

    ctx.save();
    ctx.font = fontDeclaration;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
    ctx.shadowBlur = 4 * superScale;
    ctx.shadowOffsetY = 1.5 * superScale;

    const cx = (config.naturalWidth / 2) * superScale;
    const cy = (config.defaultCenterY + yOffset) * superScale;
    const maxW = config.maxTextWidth * superScale;

    ctx.fillText(trimmed, cx, cy, maxW);
    ctx.restore();
  }

  return canvas;
}

const CertificateActions: React.FC<CertificateActionsProps> = ({
  participantName,
  certificateType,
  fontFamily,
  fontSize,
  fontColor,
  fontWeight,
  fontStyle,
  yOffset,
  onGenerate,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [generated, setGenerated] = useState(false);

  const config = CERTIFICATE_CONFIGS[certificateType];

  const handleGenerate = () => {
    if (onGenerate()) {
      setGenerated(true);
      setTimeout(() => setGenerated(false), 2500);
    }
  };

  const handleDownload = async () => {
    if (!onGenerate()) return;
    setIsDownloading(true);

    try {
      await document.fonts.ready;
      const canvas = await renderHighResCertificate(
        certificateType,
        participantName,
        fontFamily,
        fontSize,
        fontColor,
        fontWeight,
        fontStyle,
        yOffset
      );

      const { naturalWidth: W, naturalHeight: H } = config;
      // Standard A4 landscape dimensions: 297mm × 210mm
      const pageW = 297;
      const pageH = pageW / (W / H);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pageW, pageH],
        compress: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH, undefined, 'FAST');

      const safeName = participantName.trim().replace(/\s+/g, '_') || 'Participant';
      pdf.save(`KGCE_SIH2026_${config.id}_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!onGenerate()) return;
    setIsPrinting(true);

    try {
      await document.fonts.ready;
      const canvas = await renderHighResCertificate(
        certificateType,
        participantName,
        fontFamily,
        fontSize,
        fontColor,
        fontWeight,
        fontStyle,
        yOffset
      );
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to open the print dialog.');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${participantName.trim()} — ${config.label}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body {
                width: 100%;
                height: 100%;
                background: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img {
                width: 100vw;
                height: 100vh;
                object-fit: contain;
                display: block;
              }
              @page {
                size: landscape;
                margin: 0;
              }
              @media print {
                html, body {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                }
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Certificate" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                  window.close();
                }, 400);
              };
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('Print error:', err);
      alert('Failed to print certificate. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Generate / Ready Button */}
      <button
        onClick={handleGenerate}
        className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl
          font-semibold text-sm tracking-wide transition-all duration-200 shadow-sm
          ${
            generated
              ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0'
          }`}
      >
        {generated ? (
          <>
            <CheckCircle className="w-4 h-4 animate-bounce" />
            Certificate Ready
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Certificate
          </>
        )}
      </button>

      {/* Download PDF Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl
          font-semibold text-sm tracking-wide transition-all duration-200
          bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
          text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
          hover:-translate-y-0.5 active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating High-Res PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download PDF
          </>
        )}
      </button>

      {/* Print Certificate Button */}
      <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl
          font-semibold text-sm tracking-wide transition-all duration-200
          bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900
          text-white shadow-lg shadow-slate-500/20 hover:shadow-slate-500/30
          hover:-translate-y-0.5 active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isPrinting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing Print...
          </>
        ) : (
          <>
            <Printer className="w-4 h-4" />
            Print Certificate
          </>
        )}
      </button>
    </div>
  );
};

export default CertificateActions;
