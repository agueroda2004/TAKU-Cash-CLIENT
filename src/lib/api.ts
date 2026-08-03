const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export type ApiResponse<T> = { data?: T };

export class ApiError extends Error {
  status: number;
  errorCode: number | null;

  constructor(message: string, status: number, errorCode: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = {};
  headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Network error" }));
    throw new ApiError(
      data.message || data.error || `Request failed`,
      res.status,
      typeof data.errorCode === "number" ? data.errorCode : null,
    );
  }

  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  const parsed = JSON.parse(text) as ApiResponse<T>;
  return parsed.data as T;
}