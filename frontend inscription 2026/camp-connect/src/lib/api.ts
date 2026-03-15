const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).replace(/\/$/, "")
    : "http://localhost:8000";

const TOKEN_KEY = "css_colonie_token_v1";

export function getApiBase(): string {
  return API_BASE;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export interface ApiError {
  detail: string | { msg?: string; loc?: unknown }[];
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { method?: string } = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const token = getToken();
  const headers: Record<string, string> = {
    ...(typeof options.headers === "object" && !(options.headers instanceof Headers)
      ? Object.fromEntries(
          Object.entries(options.headers).map(([k, v]) => [k, String(v)])
        )
      : {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"] && options.body && typeof options.body === "string")
    headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    ...options,
    method: options.method ?? "GET",
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });
  const data = await parseResponse<T>(res);
  if (!res.ok) {
    const err = data as ApiError | undefined;
    const message =
      typeof err?.detail === "string"
        ? err.detail
        : Array.isArray(err?.detail)
          ? err.detail.map((d) => (d && typeof d === "object" && "msg" in d ? d.msg : String(d))).join(", ")
          : "Erreur serveur";
    return { error: message, status: res.status };
  }
  return { data, status: res.status };
}
