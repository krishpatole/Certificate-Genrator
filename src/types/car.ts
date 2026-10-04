export type PresetView = 'hero' | 'front' | 'side' | 'rear' | 'top' | 'interior';

export interface CameraPresetConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface BodyColorOption {
  id: string;
  name: string;
  hex: string;
  threeColor: number;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

export interface RoofOption {
  id: 'body' | 'black';
  name: string;
  description: string;
  price: number;
}

export interface WheelOption {
  id: 'standard' | 'sport' | 'performance';
  name: string;
  description: string;
  size: string;
  color: number;
  metalness: number;
  roughness: number;
  price: number;
}

export interface BrakeOption {
  id: 'standard' | 'red' | 'yellow';
  name: string;
  colorHex: string;
  threeColor: number;
  price: number;
}

export interface InteriorOption {
  id: 'black' | 'tan' | 'red_black';
  name: string;
  primaryColor: number;
  secondaryColor: number;
  description: string;
  price: number;
}

export interface ConfiguratorState {
  bodyColor: BodyColorOption;
  roof: RoofOption;
  wheels: WheelOption;
  brakes: BrakeOption;
  interior: InteriorOption;
  headlightsOn: boolean;
}

export interface HotspotData {
  id: string;
  name: string;
  title: string;
  position: [number, number, number]; // 3D world position
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  description: string;
  badge: string;
  specValue: string;
  specLabel: string;
  details: string[];
  isInterior?: boolean;
}

export interface SpecificationItem {
  id: string;
  label: string;
  value: string;
  numericTarget: number;
  unit: string;
  description: string;
  iconName: string;
}

export interface FeatureShowcase {
  id: string;
  title: string;
  tagline: string;
  category: 'PERFORMANCE' | 'SAFETY' | 'TECHNOLOGY' | 'COMFORT' | 'OFF-ROAD';
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  highlights: string[];
  spec: {
    label: string;
    value: string;
  };
}
