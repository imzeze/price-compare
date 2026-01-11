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
    return payload.items ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const items = await loadItems();

  return (
    <main className="flex bg-neutral-100 min-h-screen flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold break-keep">네이버 쇼핑 데이터</h1>
      {items ? <ProductList items={items} /> : null}
    </main>
  );
}
