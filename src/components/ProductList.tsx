"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NaverShoppingItem } from "@/api/naverShopping";
import ProductItems from "@/components/ProductItems";
import ProductFilterButton from "@/components/ProductFilterButton";
import useProductFilterStore from "@/state/useProductFilterStore";

type ProductListProps = {
  items: NaverShoppingItem[];
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

const ProductList = ({ items }: ProductListProps) => {
  const selectedFilters = useProductFilterStore(
    (state) => state.selectedFilters
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, items.length)
  );
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const lastTriggeredCount = useRef(0);

  const uniqueValues = useMemo(() => {
    const uniqueMall = new Set<string>();
    const uniqueBrand = new Set<string>();
    const uniqueMaker = new Set<string>();

    items.forEach((item) => {
      if (item.mallName) uniqueMall.add(item.mallName);
      if (item.brand) uniqueBrand.add(item.brand);
      if (item.maker) uniqueMaker.add(item.maker);
    });

    return {
      uniqueMall,
      uniqueBrand,
      uniqueMaker,
    };
  }, [items]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [searchTerm]);

  const filteredItems = useMemo(() => {
    const mallSet = new Set(selectedFilters.mall);
    const brandSet = new Set(selectedFilters.brand);
    const makerSet = new Set(selectedFilters.maker);
    const keyword = debouncedTerm.trim().toLowerCase();

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
  }, [items, debouncedTerm, selectedFilters]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

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
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-base font-semibold text-neutral-950 break-keep">
          상품명
        </p>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="상품명을 입력하세요"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 break-keep"
        />
      </section>
      <ProductFilterButton
        title="쇼핑몰"
        filterKey="mall"
        items={uniqueValues.uniqueMall}
      />
      <ProductFilterButton
        title="브랜드"
        filterKey="brand"
        items={uniqueValues.uniqueBrand}
      />
      <ProductFilterButton
        title="제조사"
        filterKey="maker"
        items={uniqueValues.uniqueMaker}
      />
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
  );
};

export default ProductList;
