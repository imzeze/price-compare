"use client";

import { useState } from "react";
import useProductFilterStore, {
  ProductFilterKey,
} from "@/state/useProductFilterStore";

interface ProductFilterButtonProps {
  title: string;
  filterKey: ProductFilterKey;
  items: Set<string>;
}

const ProductFilterButton = ({
  title,
  filterKey,
  items,
}: ProductFilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const selectedValues = useProductFilterStore(
    (state) => state.selectedFilters[filterKey]
  );
  const toggleFilter = useProductFilterStore((state) => state.toggleFilter);
  const clearFilter = useProductFilterStore((state) => state.clearFilter);

  return (
    <div className="flex flex-col gap-col-2 rounded-2xl border bg-white border-neutral-200 p-3">
      <div
        className="flex items-center justify-between cursor-pointer"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-base font-semibold text-neutral-950 break-keep">
          {title}
        </p>
        <span
          className={`block transition-transform duration-300 text-neutral-500 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        >
          ⌃
        </span>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen
            ? "max-h-screen opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            className={`rounded-xl border px-5 py-3 text-sm font-semibold break-keep ${
              selectedValues.length === 0
                ? "bg-neutral-700 text-neutral-100"
                : "border-neutral-700 text-neutral-500"
            }`}
            onClick={() => clearFilter(filterKey)}
          >
            전체
          </button>
          {[...items].map((mall) => {
            const isActive = selectedValues.includes(mall);
            return (
              <button
                key={mall}
                type="button"
                className={`rounded-xl border px-5 py-3 text-sm font-semibold break-keep ${
                  isActive
                    ? "bg-neutral-700 text-neutral-100"
                    : "border-neutral-700 text-neutral-500"
                }`}
                onClick={() => toggleFilter(filterKey, mall)}
              >
                {mall}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductFilterButton;
