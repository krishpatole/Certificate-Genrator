import React, { useRef, useEffect, useCallback } from 'react';
import { CERTIFICATE_CONFIGS, CertificateType } from '../config/certificateConfig';
import { preloadCertificateImage, getCachedCertificateImage } from '../utils/imageLoader';

interface CertificatePreviewProps {
  participantName: string;
  certificateType: CertificateType;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight?: string;
  fontStyle?: string;
  yOffset: number;
  showGuide?: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  participantName,
  certificateType,
  fontFamily,
  fontSize,
  fontColor,
  fontWeight = '400',
  fontStyle = 'normal',
  yOffset,
  showGuide = false,
  previewRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  const config = CERTIFICATE_CONFIGS[certificateType];

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    // Increment render sequence ID so any prior asynchronous draw call is invalidated immediately
    const currentRenderId = ++renderIdRef.current;

    // Ensure fonts are loaded before calculating text placement
    await document.fonts.ready;
    if (currentRenderId !== renderIdRef.current) return;

    // Load or get cached image
    let img = getCachedCertificateImage(certificateType);
    if (!img) {
      try {
        img = await preloadCertificateImage(certificateType);
      } catch (err) {
        console.error('Failed to load certificate image:', err);
        return;
      }
    }
    if (currentRenderId !== renderIdRef.current) return;

    const displayW = wrapper.clientWidth || 800;
    const aspectRatio = config.naturalWidth / config.naturalHeight;
    const displayH = Math.round(displayW / aspectRatio);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Set physical buffer size
    canvas.width = Math.round(displayW * dpr);
    canvas.height = Math.round(displayH * dpr);

    // Set CSS display size
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Explicitly reset any existing transform and clear canvas completely
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale context for DPR crispness
    ctx.scale(dpr, dpr);

    // ── 1. Draw Clean White Background ──────────────────────────────
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, displayW, displayH);

    // ── 2. Draw Fresh Template Image (Opaque Replacement) ──────────
    ctx.drawImage(img, 0, 0, displayW, displayH);

    const scale = displayW / config.naturalWidth;

    // ── 3. Optional Alignment Guide ─────────────────────────────────
    if (showGuide) {
      const guidePresentedY = config.textPresentedBottomY * scale;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(displayW * 0.15, guidePresentedY);
      ctx.lineTo(displayW * 0.85, guidePresentedY);
      ctx.stroke();

      const guideLineY = config.lineY * scale;
      ctx.strokeStyle = 'rgba(202, 138, 4, 0.8)';
      ctx.beginPath();
      ctx.moveTo(displayW * 0.15, guideLineY);
      ctx.lineTo(displayW * 0.85, guideLineY);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // ── 4. Draw Participant Name ────────────────────────────────────
    const trimmed = participantName.trim();
    if (trimmed) {
      const scaledFontSize = Math.round(fontSize * scale);
      const fontDeclaration = `${fontStyle === 'italic' ? 'italic ' : ''}${fontWeight} ${scaledFontSize}px ${fontFamily}`;

      ctx.save();
      ctx.font = fontDeclaration;
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Soft natural drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 3 * scale;
      ctx.shadowOffsetY = 1.2 * scale;

      const cx = (config.naturalWidth / 2) * scale;
      const cy = (config.defaultCenterY + yOffset) * scale;
      const maxW = config.maxTextWidth * scale;

      ctx.fillText(trimmed, cx, cy, maxW);
      ctx.restore();
    }
  }, [
    participantName,
    certificateType,
    fontFamily,
    fontSize,
    fontColor,
    fontWeight,
    fontStyle,
    yOffset,
    showGuide,
    config,
  ]);

  // Trigger draw on prop changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Trigger draw on container resize
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      draw();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div ref={wrapperRef} className="w-full">
      <div ref={previewRef} className="w-full overflow-hidden" style={{ lineHeight: 0 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-auto block rounded-xl shadow-lg bg-white"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
};

export default CertificatePreview;
