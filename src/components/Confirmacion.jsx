import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Confirmacion.css";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function Confirmacion() {
  const { state } = useLocation();
  const orden = state?.orden;

  // Si no hay orden (p.ej. recarga), mostramos una vista segura
  if (!orden) {
    return (
      <div className="confirmacion-container">
        <h2>Compra confirmada</h2>
        <p className="confirmacion-msj">
          Tu pedido fue procesado correctamente.
        </p>
        <Link to="/productos" className="volver-link" style={{ marginTop: "2rem" }}>
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const { id, comprador, items, total, fecha } = orden;

  return (
    <div className="confirmacion-container">
      <h2>¡Gracias por tu compra!</h2>

      <p className="confirmacion-msj">
        Hemos recibido tu pedido <b>{id || "—"}</b> el{" "}
        <b>{new Date(fecha).toLocaleString("es-AR")}</b>.
        <br />
        En breve nos pondremos en contacto para coordinar la entrega.
      </p>

      <div className="confirmacion-box">
        <div className="confirmacion-col">
          <h4>Datos del comprador</h4>
          <ul className="confirmacion-datos">
            <li><span>Nombre:</span> {comprador?.nombre || "—"}</li>
            <li><span>Email:</span> {comprador?.email || "—"}</li>
            {comprador?.telefono && <li><span>Teléfono:</span> {comprador.telefono}</li>}
          </ul>
        </div>

        <div className="confirmacion-col">
          <h4>Resumen de tu compra</h4>
          <ul className="confirmacion-items">
            {items.map((it) => (
              <li key={it.id} className="conf-item">
                <img
                  className="conf-thumb"
                  src={it.imageUrl || it.image || "/placeholder.png"}
                  alt={it.name}
                  loading="lazy"
                />
                <div className="conf-line">
                  <strong className="conf-name">{it.name}</strong>
                  <span className="conf-qty">
                    {fmt(it.price)} × {it.quantity}
                  </span>
                </div>
                <span className="conf-sub">{fmt(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="confirmacion-total">
            <span>Total abonado:</span>
            <span className="checkout-total">{fmt(total)}</span>
          </div>
        </div>
      </div>

      <Link to="/productos" className="volver-link" style={{ marginTop: "2rem" }}>
        ← Volver al catálogo
      </Link>
    </div>
  );
}
