// src/services/api.js

// --- Config ---
const BASE = import.meta.env.VITE_API_URL || ""; // si usás proxy de Vite, dejalo vacío
const API_PREFIX = "/api"; // tu backend está montado en /api
const DEFAULT_TIMEOUT_MS = 10000;

// Helper: arma querystring ignorando null/undefined/"" (si no querés ignorar vacíos, quitalo)
function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

// Core request con timeout, no-store, parseo de error y 1 retry en GET
async function req(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    timeout = DEFAULT_TIMEOUT_MS,
    retry = true, // solo reintenta GET automáticamente
    noCache = true,
    signal: externalSignal,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const signal = externalSignal
    ? new AbortControllerMerge([controller, externalSignal]).signal
    : controller.signal;

  try {
    const res = await fetch(`${BASE}${API_PREFIX}${path}`, {
      method,
      signal,
      cache: noCache ? "no-store" : "default",
      headers: {
        "Content-Type": body ? "application/json" : "application/json",
        "pragma": noCache ? "no-cache" : undefined,
        "cache-control": noCache ? "no-cache" : undefined,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      // credentials: 'include', // si necesitás cookies/sesión
    });

    if (!res.ok) {
      // intento de parsear error JSON del backend
      let errPayload = null;
      try { errPayload = await res.json(); } catch {}
      const err = new Error(errPayload?.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.payload = errPayload;
      throw err;
    }

    if (res.status === 204) return null; // sin contenido
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    // fallback texto si no es json
    return res.text();
  } catch (e) {
    // Reintenta una vez si es GET y error de red/timeout (no status)
    const isNetwork = !("status" in e);
    const isGET = (method || "GET").toUpperCase() === "GET";
    if (retry && isGET && isNetwork) {
      return req(path, { ...options, retry: false });
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// Utilidad interna para mergear señales (abort múltiples)
class AbortControllerMerge {
  constructor(controllers) {
    this.controller = new AbortController();
    const onAbort = () => this.controller.abort();
    controllers.forEach((c) => {
      if (!c) return;
      if ("signal" in c) c.signal.addEventListener("abort", onAbort);
      else c.addEventListener("abort", onAbort);
    });
  }
  get signal() { return this.controller.signal; }
}

// API pública: organizada por recurso
export const api = {
  /* ================== Productos ================== */
  // GET /api/products?q=&categoryId=&order=
  listProducts: (params = {}) => req(`/products${buildQuery(params)}`),

  // GET /api/products/:id
  getProduct: (id) => req(`/products/${id}`),

  // POST /api/products
  createProduct: (data) => req(`/products`, { method: "POST", body: data }),

  // PATCH /api/products/:id
  updateProduct: (id, data) => req(`/products/${id}`, { method: "PATCH", body: data }),

  // DELETE /api/products/:id
  deleteProduct: (id) => req(`/products/${id}`, { method: "DELETE" }),

  /* ================== Categorías ================== */
  // GET /api/categories
  getCategories: () => req(`/categories`),

  // POST /api/categories
  createCategory: (name) => req(`/categories`, { method: "POST", body: { name } }),

  // PATCH /api/categories/:id
  updateCategory: (id, name) => req(`/categories/${id}`, { method: "PATCH", body: { name } }),

  // DELETE /api/categories/:id
  deleteCategory: (id) => req(`/categories/${id}`, { method: "DELETE" }),

  /* ================== Órdenes (Checkout) ================== */
  // GET /api/orders?limit=&offset=
  listOrders: (params = {}) => req(`/orders${buildQuery(params)}`),

  // GET /api/orders/:id
  getOrder: (id) => req(`/orders/${id}`),

  // POST /api/orders  { comprador, items, total, fecha }
  createOrder: (data) => req(`/orders`, { method: "POST", body: data }),

  /* ================== Contacto ================== */
  // POST /api/contact { nombre, email, mensaje }
  sendContact: (data) => req(`/contact`, { method: "POST", body: data }),

  /* ================== Salud / util ================== */
  // GET /api/health
  ping: () => req(`/health`, { timeout: 4000 }),

  // Puedes exponer el core para casos especiales
  _req: req,
};

