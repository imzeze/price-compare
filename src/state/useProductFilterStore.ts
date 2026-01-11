"use client";

import { create } from "zustand";

export type ProductFilterKey = "mall" | "brand" | "maker";

type ProductFilterState = {
  selectedFilters: Record<ProductFilterKey, string[]>;
  clearFilter: (key: ProductFilterKey) => void;
  toggleFilter: (key: ProductFilterKey, value: string) => void;
};

const useProductFilterStore = create<ProductFilterState>((set) => ({
  selectedFilters: {
    mall: [],
    brand: [],
    maker: [],
  },
  clearFilter: (key) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [key]: [],
      },
    })),
  toggleFilter: (key, value) =>
    set((state) => {
      const current = state.selectedFilters[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return {
        selectedFilters: {
          ...state.selectedFilters,
          [key]: next,
        },
      };
    }),
}));

export default useProductFilterStore;
