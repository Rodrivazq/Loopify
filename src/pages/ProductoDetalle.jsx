import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductoDetalle.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const priceFmt = useMemo(
    () =>
      new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }),
    []
  );

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
        setQty(1);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error inesperado");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-wrapper">
        <div className="pd-card">
          <div className="pd-skel-img" />
          <div className="pd-skel-lines">
            <div className="pd-skel-line w-70" />
            <div className="pd-skel-line w-40" />
            <div className="pd-skel-line w-90" />
            <div className="pd-skel-line w-80" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-wrapper">
        <div className="pd-card">
          <p className="pd-error">{error || "Producto no encontrado ❌"}</p>
          <Link to="/productos" className="pd-back">← Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const canIncrease = product.stock > qty;
  const canDecrease = qty > 1;

  const onAddToCart = () => {
    // aquí podrías llamar a tu useCart().addToCart(product, qty)
    alert(`Agregado: ${qty} × ${product.name}`);
  };

  return (
    <div className="pd-wrapper">
      <div className="pd-card">
        <div className="pd-content">
          <figure className="pd-imageBox">
            <img
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              className="pd-image"
              loading="eager"
            />
          </figure>

          <section className="pd-info">
            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-meta">
              <span className="pd-price">{priceFmt.format(product.price)}</span>
              {product.category && (
                <span className="pd-chip"> {product.category.name} </span>
              )}
              <span
                className={`pd-stock ${product.stock > 0 ? "ok" : "out"}`}
                title={`Stock: ${product.stock}`}
              >
                {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
              </span>
            </div>

            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}

            <div className="pd-actions">
              <div className="pd-qty">
                <button
                  className="pd-qtyBtn"
                  onClick={() => setQty(qty - 1)}
                  disabled={!canDecrease}
                >
                  −
                </button>
                <span className="pd-qtyVal">{qty}</span>
                <button
                  className="pd-qtyBtn"
                  onClick={() => setQty(qty + 1)}
                  disabled={!canIncrease}
                >
                  +
                </button>
              </div>

              <button
                className="pd-add"
                onClick={onAddToCart}
                disabled={product.stock === 0}
              >
                Agregar al carrito
              </button>
            </div>

            <hr className="pd-divider" />
            <Link to="/productos" className="pd-back">
              ← Volver al catálogo
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
