import httpClient from "./httpClient";

const NAVER_BASE_URL = "https://openapi.naver.com/v1/search";

type NaverShoppingItem = {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
};

type NaverShoppingResponse = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverShoppingItem[];
};

type FetchNaverShoppingOptions = {
  query?: string;
  display?: number;
  start?: number;
  sort?: "sim" | "date" | "asc" | "dsc";
};

function getNaverHeaders() {
  const clientId = process.env.NAVER_CLIENT_ID ?? "";
  const clientSecret = process.env.NAVER_CLIENT_SECRET ?? "";

  if (!clientId || !clientSecret) {
    throw new Error("Naver API credentials are missing.");
  }

  return {
    "X-Naver-Client-Id": clientId,
    "X-Naver-Client-Secret": clientSecret,
  };
}

async function fetchNaverShopping(
  options: FetchNaverShoppingOptions = {}
): Promise<NaverShoppingResponse> {
  const { query = "티니핑", display, start, sort } = options;

  const { data } = await httpClient.get<NaverShoppingResponse>("/shop.json", {
    baseURL: NAVER_BASE_URL,
    responseType: "json",
    params: {
      query,
      display,
      start,
      sort,
    },
    headers: getNaverHeaders(),
  });

  return data;
}

export type {
  NaverShoppingItem,
  NaverShoppingResponse,
  FetchNaverShoppingOptions,
};
export { fetchNaverShopping };
