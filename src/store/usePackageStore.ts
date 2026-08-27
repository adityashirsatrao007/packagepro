"use client";

import { create } from "zustand";
import type { TourPackage, PackageComponent, TourGuide } from "@/types";

interface PackageState {
  selectedPackage: TourPackage | null;
  components: PackageComponent[];
  selectedComponents: PackageComponent[];
  selectedGuide: TourGuide | null;
  guideDayRate: string | null;

  setPackage: (pkg: TourPackage, components: PackageComponent[]) => void;
  swapComponent: (oldComponent: PackageComponent, newComponent: PackageComponent) => void;
  toggleOptional: (component: PackageComponent) => void;
  setGuide: (guide: TourGuide | null) => void;
  reset: () => void;
}

export const usePackageStore = create<PackageState>((set, get) => ({
  selectedPackage: null,
  components: [],
  selectedComponents: [],
  selectedGuide: null,
  guideDayRate: null,

  setPackage: (pkg, components) => {
    const required = components.filter((c) => !c.is_optional);
    set({
      selectedPackage: pkg,
      components,
      selectedComponents: required,
      selectedGuide: null,
      guideDayRate: null,
    });
  },

  swapComponent: (oldComponent, newComponent) => {
    const { selectedComponents } = get();
    const idx = selectedComponents.findIndex(
      (c) => c.component_id === oldComponent.component_id
    );
    if (idx === -1) return;
    const updated = [...selectedComponents];
    updated[idx] = newComponent;
    set({ selectedComponents: updated });
  },

  toggleOptional: (component) => {
    const { selectedComponents } = get();
    const exists = selectedComponents.find(
      (c) => c.component_id === component.component_id
    );
    if (exists) {
      set({
        selectedComponents: selectedComponents.filter(
          (c) => c.component_id !== component.component_id
        ),
      });
    } else {
      set({ selectedComponents: [...selectedComponents, component] });
    }
  },

  setGuide: (guide) => {
    set({
      selectedGuide: guide,
      guideDayRate: guide ? guide.day_rate : null,
    });
  },

  reset: () =>
    set({
      selectedPackage: null,
      components: [],
      selectedComponents: [],
      selectedGuide: null,
      guideDayRate: null,
    }),
}));
