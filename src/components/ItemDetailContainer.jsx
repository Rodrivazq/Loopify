// src/components/ItemDetailContainer.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemDetail from "./ItemDetail";
import "./ItemDetailContainer.css";

// ⚡ log para ver qué valor agarra tu API base
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
console.log("🌐 API_BASE (en build):", API_BASE);

export default function ItemDetailContainer() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⚡ log para ver qué ID recibe desde la ruta
  console.log("🆔 ID recibido desde useParams:", id);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Error al cargar el producto");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    fetchProduct();
    return () => ac.abort();
  }, [id]);

  return (
    <div className="item-detail-wrapper">
      <div className="item-detail-box">
        <div className="item-detail-header">
          <h1>Detalle de producto</h1>
          <Link to="/productos">← Volver</Link>
        </div>

        {loading && <p style={{ padding: "1rem" }}>Cargando…</p>}

        {!loading && error && (
          <p style={{ padding: "1rem", color: "#e11d48", fontWeight: 600 }}>
            {error} ❌
          </p>
        )}

        {!loading && !error && product && <ItemDetail product={product} />}
      </div>
    </div>
  );
}
