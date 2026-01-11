"use client";

import ProductFilterButton from "@/components/ProductFilterButton";
import useProductFilterStore from "@/state/useProductFilterStore";

interface ProductFiltersProps {
  uniqueMall: string[];
  uniqueBrand: string[];
  uniqueMaker: string[];
}

const ProductFilters = ({
  uniqueMall,
  uniqueBrand,
  uniqueMaker,
}: ProductFiltersProps) => {
  const searchKeyword = useProductFilterStore((state) => state.searchKeyword);
  const setSearchKeyword = useProductFilterStore(
    (state) => state.setSearchKeyword
  );

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
        items={uniqueMall}
      />
      <ProductFilterButton
        title="브랜드"
        filterKey="brand"
        items={uniqueBrand}
      />
      <ProductFilterButton
        title="제조사"
        filterKey="maker"
        items={uniqueMaker}
      />
    </>
  );
};

export default ProductFilters;
