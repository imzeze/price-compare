"use client";

import { NaverShoppingItem } from "@/api/naverShopping";
import ProductFilterButton from "@/components/ProductFilterButton";
import useProductFilterStore from "@/state/useProductFilterStore";
import { useMemo } from "react";

interface ProductFiltersProps {
  items: NaverShoppingItem[];
}

const ProductFilters = ({ items }: ProductFiltersProps) => {
  const searchKeyword = useProductFilterStore((state) => state.searchKeyword);
  const setSearchKeyword = useProductFilterStore(
    (state) => state.setSearchKeyword
  );

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

  return (
    <>
      <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-base font-semibold text-neutral-950 break-keep">
          상품명
        </p>
        <input
          type="text"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="상품명을 입력하세요"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 break-keep"
        />
      </div>
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
    </>
  );
};

export default ProductFilters;
