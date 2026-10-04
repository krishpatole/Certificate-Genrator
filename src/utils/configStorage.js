import {
  EXTERIOR_COLORS,
  WHEEL_OPTIONS,
  BRAKE_CALIPERS,
  INTERIOR_OPTIONS,
} from '../data/configuratorData';

const STORAGE_KEY = 'velox_saved_config_v1';

/**
 * Encodes current configuration to URL search parameters
 */
export function encodeConfigToUrl(config) {
  const params = new URLSearchParams();
  if (config.exteriorColor) params.set('color', config.exteriorColor.id);
  if (config.wheelOption) params.set('wheels', config.wheelOption.id);
  if (config.caliperOption) params.set('caliper', config.caliperOption.id);
  if (config.interiorOption) params.set('interior', config.interiorOption.id);
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Parses configuration from URL search parameters or localStorage
 */
export function loadInitialConfiguration() {
  const urlParams = new URLSearchParams(window.location.search);
  const colorParam = urlParams.get('color');
  const wheelsParam = urlParams.get('wheels');
  const caliperParam = urlParams.get('caliper');
  const interiorParam = urlParams.get('interior');

  // 1. Try URL parameters first
  if (colorParam || wheelsParam || caliperParam || interiorParam) {
    const extColor = EXTERIOR_COLORS.find((c) => c.id === colorParam) || EXTERIOR_COLORS[0];
    const wheelOpt = WHEEL_OPTIONS.find((w) => w.id === wheelsParam) || WHEEL_OPTIONS[0];
    const caliperOpt = BRAKE_CALIPERS.find((b) => b.id === caliperParam) || BRAKE_CALIPERS[0];
    const interiorOpt = INTERIOR_OPTIONS.find((i) => i.id === interiorParam) || INTERIOR_OPTIONS[0];

    return {
      exteriorColor: extColor,
      wheelOption: wheelOpt,
      caliperOption: caliperOpt,
      interiorOption: interiorOpt,
      source: 'url',
    };
  }

  // 2. Try localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const extColor = EXTERIOR_COLORS.find((c) => c.id === parsed.colorId) || EXTERIOR_COLORS[0];
      const wheelOpt = WHEEL_OPTIONS.find((w) => w.id === parsed.wheelId) || WHEEL_OPTIONS[0];
      const caliperOpt = BRAKE_CALIPERS.find((b) => b.id === parsed.caliperId) || BRAKE_CALIPERS[0];
      const interiorOpt = INTERIOR_OPTIONS.find((i) => i.id === parsed.interiorId) || INTERIOR_OPTIONS[0];

      return {
        exteriorColor: extColor,
        wheelOption: wheelOpt,
        caliperOption: caliperOpt,
        interiorOption: interiorOpt,
        source: 'storage',
      };
    }
  } catch (err) {
    console.warn('Could not read saved config from localStorage', err);
  }

  // 3. Defaults
  return {
    exteriorColor: EXTERIOR_COLORS[0],
    wheelOption: WHEEL_OPTIONS[0],
    caliperOption: BRAKE_CALIPERS[0],
    interiorOption: INTERIOR_OPTIONS[0],
    source: 'default',
  };
}

/**
 * Saves current configuration to localStorage
 */
export function saveConfigToStorage(config) {
  try {
    const dataToSave = {
      colorId: config.exteriorColor.id,
      wheelId: config.wheelOption.id,
      caliperId: config.caliperOption.id,
      interiorId: config.interiorOption.id,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (err) {
    console.error('Failed to save to localStorage', err);
    return false;
  }
}

/**
 * Clears saved configuration in localStorage
 */
export function clearSavedConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage', err);
  }
}
