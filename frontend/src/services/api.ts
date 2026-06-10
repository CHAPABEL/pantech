export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const BASE = "/api";

async function parseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  return await res.text();
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = path.startsWith("/api/") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(init.headers ?? {}),
    },
  });
  const body = await parseBody(res);
  if (!res.ok) {
    const message =
      (body && typeof body === "object" && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : null) || res.statusText;
    throw new ApiError(res.status, message, body);
  }
  return body as T;
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
  put: <T,>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
  del: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
  postForm: <T,>(path: string, form: FormData) =>
    request<T>(path, { method: "POST", body: form }),
};
