"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NaverShoppingItem } from "@/api/naverShopping";
import ProductItems from "@/components/ProductItems";
import useProductFilterStore from "@/state/useProductFilterStore";
import ProductFilters from "@/components/ProductFilters";

type ProductListProps = {
  items: NaverShoppingItem[];
  uniqueValues: {
    uniqueMall: string[];
    uniqueBrand: string[];
    uniqueMaker: string[];
  };
};

const PAGE_SIZE = 10;
const VISIBILITY_RATIO = 0.1;

function getVisibilityRatio(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const visibleHeight =
    Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

  if (rect.height <= 0) return 0;
  return Math.max(0, Math.min(visibleHeight / rect.height, 1));
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

const ProductList = ({ items, uniqueValues }: ProductListProps) => {
  const { selectedFilters, searchKeyword } = useProductFilterStore();
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, items.length)
  );
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const lastTriggeredCount = useRef(0);

  const filteredItems = useMemo(() => {
    const mallSet = new Set(selectedFilters.mall);
    const brandSet = new Set(selectedFilters.brand);
    const makerSet = new Set(selectedFilters.maker);
    const keyword = debouncedKeyword.trim().toLowerCase();

    return items.filter((item) => {
      if (mallSet.size > 0 && !mallSet.has(item.mallName)) {
        return false;
      }
      if (brandSet.size > 0 && !brandSet.has(item.brand)) {
        return false;
      }
      if (makerSet.size > 0 && !makerSet.has(item.maker)) {
        return false;
      }
      if (keyword) {
        const title = stripTags(item.title ?? "").toLowerCase();
        if (!title.includes(keyword)) return false;
      }
      return true;
    });
  }, [items, debouncedKeyword, selectedFilters]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [searchKeyword]);

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, filteredItems.length));
    lastTriggeredCount.current = 0;
  }, [filteredItems.length]);

  useEffect(() => {
    let frameId = 0;

    const check = () => {
      const target = lastItemRef.current;
      if (target && visibleCount < filteredItems.length) {
        const ratio = getVisibilityRatio(target);
        if (
          ratio >= VISIBILITY_RATIO &&
          lastTriggeredCount.current !== visibleCount
        ) {
          lastTriggeredCount.current = visibleCount;
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filteredItems.length)
          );
        }
      }

      frameId = window.requestAnimationFrame(check);
    };

    frameId = window.requestAnimationFrame(check);
    return () => window.cancelAnimationFrame(frameId);
  }, [filteredItems.length, visibleCount]);

  if (!items.length) {
    return (
      <p className="text-sm text-neutral-500 break-keep">
        표시할 상품이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="sticky top-6 flex h-fit flex-1 flex-col gap-3">
      <ProductFilters
        uniqueMall={uniqueValues.uniqueMall}
        uniqueBrand={uniqueValues.uniqueBrand}
        uniqueMaker={uniqueValues.uniqueMaker}
      />
      </div>
      <div className="flex-2 flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <p className="text-sm text-neutral-500 break-keep">
            선택한 쇼핑몰에 해당하는 상품이 없습니다.
          </p>
        ) : null}
        {visibleItems.map((item, index) => {
          const isLastVisible = index === visibleItems.length - 1;
          return (
            <div
              key={`${item.productId}-${item.link}`}
              ref={isLastVisible ? lastItemRef : undefined}
            >
              <ProductItems item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
