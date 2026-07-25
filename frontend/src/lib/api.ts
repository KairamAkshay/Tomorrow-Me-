/** API client for communicating with the FastAPI backend. */

import type {
  HealthResponse,
  LoginRequest,
  MindAssessment,
  MindAssessmentRequest,
  RealityCheck,
  RealityCheckRequest,
  RegisterRequest,
  ReportsListResponse,
  Simulation,
  SimulationRequest,
  TokenResponse,
} from "@/types";

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    let clean = envUrl.trim();
    if (clean.endsWith("/")) clean = clean.slice(0, -1);
    if (!clean.endsWith("/api")) clean = `${clean}/api`;
    return clean;
  }
  // In browser, if no env variable is set, default to relative /api (proxied by Next.js rewrites) or localhost
  if (typeof window !== "undefined") {
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return "/api";
    }
  }
  return "http://localhost:8000/api";
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const apiBase = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${apiBase}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "An error occurred";
    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      message = response.statusText;
    }

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/* ===== Auth ===== */
export const auth = {
  register: (data: RegisterRequest) =>
    request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<TokenResponse["user"]>("/auth/me"),
};

/* ===== Simulator ===== */
export const simulator = {
  run: (data: SimulationRequest) =>
    request<Simulation>("/simulator/run", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: () => request<Simulation[]>("/simulator/"),

  get: (id: number) => request<Simulation>(`/simulator/${id}`),

  delete: (id: number) =>
    request<void>(`/simulator/${id}`, { method: "DELETE" }),
};

/* ===== Reality Check ===== */
export const reality = {
  analyze: (data: RealityCheckRequest) =>
    request<RealityCheck>("/reality/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: () => request<RealityCheck[]>("/reality/"),

  get: (id: number) => request<RealityCheck>(`/reality/${id}`),

  delete: (id: number) =>
    request<void>(`/reality/${id}`, { method: "DELETE" }),
};

/* ===== Mind Mirror ===== */
export const mind = {
  assess: (data: MindAssessmentRequest) =>
    request<MindAssessment>("/mind/assess", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: () => request<MindAssessment[]>("/mind/"),

  get: (id: number) => request<MindAssessment>(`/mind/${id}`),

  delete: (id: number) =>
    request<void>(`/mind/${id}`, { method: "DELETE" }),
};

/* ===== Reports ===== */
export const reports = {
  list: () => request<ReportsListResponse>("/reports/"),
};

/* ===== Health ===== */
export const health = {
  check: () => request<HealthResponse>("/health"),
};

export { ApiError };
