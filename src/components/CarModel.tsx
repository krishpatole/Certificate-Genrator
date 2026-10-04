import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { loadSUVModel, SUVModelManager } from '../three/loader';
import { ConfiguratorState, BodyColorOption } from '../types/car';

interface CarModelProps {
  scene: THREE.Scene | null;
  configState: ConfiguratorState;
  onLoadingProgress?: (percent: number) => void;
  onModelReady?: (manager: SUVModelManager) => void;
  highlightComponent?: string | null;
}

export const CarModel: React.FC<CarModelProps> = ({
  scene,
  configState,
  onLoadingProgress,
  onModelReady,
  highlightComponent,
}) => {
  const modelManagerRef = useRef<SUVModelManager | null>(null);
  const prevColorRef = useRef<BodyColorOption>(configState.bodyColor);

  // Initial Model Load
  useEffect(() => {
    if (!scene) return;

    const manager = loadSUVModel(
      (pct) => {
        if (onLoadingProgress) onLoadingProgress(pct);
      },
      (loadedManager) => {
        scene.add(loadedManager.root);
        modelManagerRef.current = loadedManager;

        // Apply initial configurations
        loadedManager.setBodyColor(configState.bodyColor);
        loadedManager.setRoofOption(configState.roof, configState.bodyColor);
        loadedManager.setWheelOption(configState.wheels);
        loadedManager.setBrakeOption(configState.brakes);
        loadedManager.setInteriorOption(configState.interior);
        loadedManager.setHeadlights(configState.headlightsOn);

        if (onModelReady) onModelReady(loadedManager);
      }
    );

    return () => {
      if (modelManagerRef.current) {
        scene.remove(modelManagerRef.current.root);
        modelManagerRef.current.dispose();
      }
    };
  }, [scene]);

  // Sync Body Color
  useEffect(() => {
    if (modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.setBodyColor(configState.bodyColor);
      prevColorRef.current = configState.bodyColor;
    }
  }, [configState.bodyColor]);

  // Sync Roof Finish
  useEffect(() => {
    if (modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.setRoofOption(configState.roof, configState.bodyColor);
    }
  }, [configState.roof, configState.bodyColor]);

  // Sync Wheels
  useEffect(() => {
    if (modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.setWheelOption(configState.wheels);
    }
  }, [configState.wheels]);

  // Sync Brakes
  useEffect(() => {
    if (modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.setBrakeOption(configState.brakes);
    }
  }, [configState.brakes]);

  // Sync Interior
  useEffect(() => {
    if (modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.setInteriorOption(configState.interior);
    }
  }, [configState.interior]);

  // Sync Headlights
  useEffect(() => {
    if (modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.setHeadlights(configState.headlightsOn);
    }
  }, [configState.headlightsOn]);

  // Pulse Highlight when component clicked
  useEffect(() => {
    if (highlightComponent && modelManagerRef.current && modelManagerRef.current.loaded) {
      modelManagerRef.current.pulseHighlight(highlightComponent);
    }
  }, [highlightComponent]);

  return null;
};
