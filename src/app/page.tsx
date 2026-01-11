import { NaverShoppingItem } from "@/api/naverShopping";
import ProductList from "@/components/ProductList";
import fs from "fs/promises";
import path from "path";

type NaverProductPayload = {
  items: NaverShoppingItem[];
};

const DATA_PATH = path.resolve(process.cwd(), "data/naverProducts.json");

async function loadItems() {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const payload = JSON.parse(file) as NaverProductPayload;
    const items = payload.items ?? [];
    const uniqueMall = new Set<string>();
    const uniqueBrand = new Set<string>();
    const uniqueMaker = new Set<string>();

    items.forEach((item) => {
      if (item.mallName) uniqueMall.add(item.mallName);
      if (item.brand) uniqueBrand.add(item.brand);
      if (item.maker) uniqueMaker.add(item.maker);
    });

    return {
      items,
      uniqueValues: {
        uniqueMall: Array.from(uniqueMall).sort((a, b) =>
          a.localeCompare(b, "ko-KR")
        ),
        uniqueBrand: Array.from(uniqueBrand).sort((a, b) =>
          a.localeCompare(b, "ko-KR")
        ),
        uniqueMaker: Array.from(uniqueMaker).sort((a, b) =>
          a.localeCompare(b, "ko-KR")
        ),
      },
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const data = await loadItems();

  return (
    <main className="flex bg-neutral-100 min-h-screen flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold break-keep">네이버 쇼핑 데이터</h1>
      {data ? (
        <ProductList items={data.items} uniqueValues={data.uniqueValues} />
      ) : null}
    </main>
  );
}
