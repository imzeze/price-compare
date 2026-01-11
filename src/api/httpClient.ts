import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "";

const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const nextConfig = { ...config };
  const headers = AxiosHeaders.from(nextConfig.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");
  nextConfig.headers = headers;

  return nextConfig;
});

type NormalizedHttpError = {
  message: string;
  status: number | null;
  code: string | null;
  data: unknown;
  isNetworkError: boolean;
  isTimeout: boolean;
  url?: string;
  method?: string;
};

function normalizeError(error: AxiosError): NormalizedHttpError {
  const status = error.response?.status ?? null;
  const data = error.response?.data ?? null;
  const code = error.code ?? null;
  const isTimeout = code === "ECONNABORTED";
  const isNetworkError = !error.response;

  return {
    message: error.message,
    status,
    code,
    data,
    isNetworkError,
    isTimeout,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
  };
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject({
        message: "Unknown error",
        status: null,
        code: null,
        data: null,
        isNetworkError: true,
        isTimeout: false,
      } satisfies NormalizedHttpError);
    }

    return Promise.reject(normalizeError(error));
  }
);

export default httpClient;
export type { NormalizedHttpError };
