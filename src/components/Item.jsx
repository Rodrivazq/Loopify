import { Link } from "react-router-dom";
import "./Item.css";

export default function Item({ product }) {
  // short desc – caemos a 140 chars si no querés usar line-clamp
  const shortDesc =
    (product.description || "").length > 140
      ? product.description.slice(0, 140) + "…"
      : product.description || "";

  return (
    <article className="card">
      <div className="card-imgBox">
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="card-img"
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <h3 className="card-title line-2">{product.name}</h3>
        {shortDesc && <p className="card-desc line-3">{shortDesc}</p>}

        <div className="card-footer">
          <span className="card-price">${product.price}</span>
        <Link to={`/producto/${product.id || product._id}`} className="card-btn">
          Ver detalle
        </Link>
        </div>
      </div>
    </article>
  );
}

