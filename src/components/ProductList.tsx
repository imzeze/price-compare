"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NaverProductCollectedData } from "@/api/naverShopping";
import ProductItems from "@/components/ProductItems";

type ProductListProps = {
  items: NaverProductCollectedData[];
};

const PAGE_SIZE = 300;
const VISIBILITY_RATIO = 0.1;

function getVisibilityRatio(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const visibleHeight =
    Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

  if (rect.height <= 0) return 0;
  return Math.max(0, Math.min(visibleHeight / rect.height, 1));
}

const ProductList = ({ items }: ProductListProps) => {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, items.length)
  );
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const lastTriggeredCount = useRef(0);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  useEffect(() => {
    let frameId = 0;

    const check = () => {
      const target = lastItemRef.current;
      if (target && visibleCount < items.length) {
        const ratio = getVisibilityRatio(target);
        if (
          ratio >= VISIBILITY_RATIO &&
          lastTriggeredCount.current !== visibleCount
        ) {
          lastTriggeredCount.current = visibleCount;
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
        }
      }

      frameId = window.requestAnimationFrame(check);
    };

    frameId = window.requestAnimationFrame(check);
    return () => window.cancelAnimationFrame(frameId);
  }, [items.length, visibleCount]);

  if (!items.length) {
    return (
      <p className="text-sm text-neutral-500 break-keep">
        표시할 상품이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
  );
};

export default ProductList;
