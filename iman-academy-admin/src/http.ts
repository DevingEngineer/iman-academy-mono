import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "./store/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// ⚠️ CONFIRM WITH BACKEND: these must match whatever cookie/header names
// your ASP.NET Core antiforgery setup actually uses. "XSRF-TOKEN" /
// "X-XSRF-TOKEN" is the common .NET default, but it's a project-level
// config choice — check Program.cs / the antiforgery options.
const CSRF_COOKIE_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required: sends the refresh-token + antiforgery cookies
});

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // SSR guard
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfReady: Promise<void> | null = null;

/**
 * Fetches the antiforgery cookie once per session. Call this before any
 * mutating request to /api/auth/frontend/* (login, register, etc.) — the
 * auth.ts helpers already do this for you.
 */
export function ensureCsrfCookie(): Promise<void> {
  if (!csrfReady) {
    csrfReady = axios
      .get(`${API_URL}/api/auth/frontend/csrf-cookie-token`, { withCredentials: true })
      .then(() => undefined)
      .catch((err) => {
        csrfReady = null; // allow retry on next call
        throw err;
      });
  }
  return csrfReady;
}

// Attach bearer token + CSRF header to every outgoing request
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = (config.method ?? "get").toLowerCase();
  if (method !== "get") {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    if (csrfToken) {
      config.headers[CSRF_HEADER_NAME] = csrfToken;
    }
  }

  return config;
});

// Auto-refresh on 401, with request queueing so parallel calls don't each
// trigger their own refresh.
let isRefreshing = false;
let queue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function flushQueue(error: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token as string)));
  queue = [];
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh off the back of the refresh call itself
    if (original.url?.includes("/refresh-token")) {
      useAuthStore.getState().setAccessToken(null);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => queue.push({ resolve, reject })).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${API_URL}/api/auth/frontend/refresh-token`,
        {},
        { withCredentials: true }
      );
      useAuthStore.getState().setAccessToken(data.accessToken);
      flushQueue(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return http(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      useAuthStore.getState().setAccessToken(null);
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
