"use client";

import { NaverShoppingItem } from "@/api/naverShopping";
import Image from "next/image";

function stripTags(value?: string) {
  return value ? value.replace(/<[^>]*>/g, "") : "";
}

type ProductItemsProps = {
  item: NaverShoppingItem;
};

const ProductItems = ({ item }: ProductItemsProps) => {
  const title = item.title
    ? stripTags(item.title)
    : "데이터를 불러오지 못했습니다.";
  const mallName = item.mallName ? `쇼핑몰 ${stripTags(item.mallName)}` : "";
  const brand = item.brand ? `브랜드 ${stripTags(item.brand)}` : "";
  const maker = item.maker ? `제조사 ${stripTags(item.maker)}` : "";
  const price = item?.lprice
    ? `${Number(item.lprice).toLocaleString()}원`
    : "-";

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-4">
      <div className="rounded-xl bg-neutral-100 p-6">
        {item?.image ? (
          <Image
            src={item.image}
            alt={title}
            unoptimized
            width={132}
            height={132}
          />
        ) : (
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-neutral-200 text-sm text-neutral-500 break-keep">
            이미지 없음
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold text-neutral-200 break-keep">
            {[mallName, brand, maker].filter((value) => value).join(" | ")}
          </p>
          <h1 className="text-2xl font-bold text-neutral-50 break-keep">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-semibold text-neutral-500 break-keep">
            {price}
          </span>
        </div>
        {item?.link ? (
          <a
            className="text-sm text-neutral-300 underline underline-offset-4 break-keep"
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            상품 보러가기
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default ProductItems;
