import fs from "fs/promises";
import path from "path";
import axios from "axios";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "naverProducts.json");
const NAVER_BASE_URL = "https://openapi.naver.com/v1/search";
const DISPLAY = 100;
const MAX_START = 100;

async function loadEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 0) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      if (!key || process.env[key]) return;
      const value = rawValue.replace(/^"|"$/g, "");
      process.env[key] = value;
    });
  } catch {
    // Ignore missing env file.
  }
}

function getCredentials() {
  const clientId = process.env.NAVER_CLIENT_ID || "";
  const clientSecret = process.env.NAVER_CLIENT_SECRET || "";

  if (!clientId || !clientSecret) {
    throw new Error("Naver API credentials are missing.");
  }

  return { clientId, clientSecret };
}

async function fetchPage(clientId, clientSecret, query, start) {
  try {
    const response = await axios.get(`${NAVER_BASE_URL}/shop.json`, {
      responseType: "json",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      params: {
        query,
        display: DISPLAY,
        start,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (e) {
    console.log(e);
  }
}

async function syncNaverProducts() {
  await loadEnvFile(path.resolve(process.cwd(), ".env"));

  const { clientId, clientSecret } = getCredentials();
  const query = "티니핑";

  const itemsByKey = new Map();
  let total = 0;
  let start = 1;

  while (itemsByKey.size < total || total === 0) {
    if (start > MAX_START) {
      break;
    }

    // Naver API uses 1-based start index. Requirement says to increment by 1.
    const data = await fetchPage(clientId, clientSecret, query, start);
    total = data.total ?? total;

    const pageItems = Array.isArray(data.items) ? data.items : [];
    if (pageItems.length === 0) {
      break;
    }

    pageItems.forEach((item) => {
      const key = `${item.productId}-${item.link}`;
      if (!itemsByKey.has(key)) {
        itemsByKey.set(key, item);
      }
    });

    if (itemsByKey.size >= total) {
      break;
    }

    start += 1;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const payload = {
    collectedAt: new Date().toISOString(),
    total,
    items: Array.from(itemsByKey.values()),
  };

  await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Saved ${itemsByKey.size} items to ${DATA_FILE}`);
}

syncNaverProducts().catch((error) => {
  console.error("Naver sync failed:", error);
  process.exitCode = 1;
});
