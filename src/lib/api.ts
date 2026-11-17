import axios from "axios";

const TOKEN_KEY = "accessToken";
const WEEK = 7 * 24 * 3600;

/** Backend client: base URL + bearer token on every request. */
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL });

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Token lives in localStorage (for API calls) and in a cookie (for the route middleware). */
export function saveSession(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${WEEK}; SameSite=Lax`;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

/** Message from a backend error response, if it has one. */
export function apiError(error: unknown, fallback: string): string {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null;
  return typeof message === "string" ? message : fallback;
}

