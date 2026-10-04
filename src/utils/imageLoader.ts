import round1Src from '../assets/certificates/round1.jpg';
import round2Src from '../assets/certificates/round2.jpg';
import nominationSrc from '../assets/certificates/nomination.jpg';
import { CertificateType } from '../config/certificateConfig';

const IMAGE_SRCS: Record<CertificateType, string> = {
  round1: round1Src,
  round2: round2Src,
  nomination: nominationSrc,
};

const preloadedImages: Partial<Record<CertificateType, HTMLImageElement>> = {};
const pendingPromises: Partial<Record<CertificateType, Promise<HTMLImageElement>>> = {};

export function preloadCertificateImage(type: CertificateType): Promise<HTMLImageElement> {
  if (preloadedImages[type] && preloadedImages[type]!.complete && preloadedImages[type]!.naturalWidth > 0) {
    return Promise.resolve(preloadedImages[type]!);
  }

  if (pendingPromises[type]) {
    return pendingPromises[type]!;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      preloadedImages[type] = img;
      resolve(img);
    };
    img.onerror = (err) => {
      delete pendingPromises[type];
      reject(err);
    };
    img.src = IMAGE_SRCS[type];
  });

  pendingPromises[type] = promise;
  return promise;
}

// Preload all 3 certificates immediately at startup
export function preloadAllCertificates(): void {
  preloadCertificateImage('round1');
  preloadCertificateImage('round2');
  preloadCertificateImage('nomination');
}

// Call preload immediately on module import
if (typeof window !== 'undefined') {
  preloadAllCertificates();
}

export function getCachedCertificateImage(type: CertificateType): HTMLImageElement | null {
  const img = preloadedImages[type];
  if (img && img.complete && img.naturalWidth > 0) {
    return img;
  }
  return null;
}
