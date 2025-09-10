// src/components/ItemDetail.jsx
import { useState, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";
import ItemCount from "./ItemCount";
import ImageCarousel from "./ImageCarousel"; // 👈 mismo folder de components
import "./ItemDetail.css";

export default function ItemDetail({ product }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Armamos el array de imágenes: si en el futuro tenés product.images (array),
  // se usan; si no, se cae a imageUrl único; si tampoco hay, placeholder.
  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (product.imageUrl) return [product.imageUrl];
    return ["/placeholder.png"];
  }, [product]);

  const handleAdd = (quantity) => {
    addToCart(product, quantity);
    setToastMsg(`Agregaste ${quantity} × ${product.name} al carrito`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="item-detail-container">
      <div className="item-detail-content">
        <div className="item-detail-info">
          <h2 className="item-detail-title">{product.name}</h2>
          <p className="item-detail-price">${product.price}</p>
        {/* ⬇️ Carrusel en lugar del <img /> fijo */}
        <div className="item-image">
          <ImageCarousel images={images} />
        
          {product.category && (
            <p className="item-detail-category">Categoría: {product.category.name}</p>
          )}

          {product.description && (
            <p className="item-detail-description">{product.description}</p>
          )}
</div>
          <ItemCount
            stock={product.stock ?? 10}
            initial={1}
            onAdd={handleAdd}
          />

          <hr className="volver-divider" />
          <Link to="/productos" className="volver-link">← Volver al catálogo</Link>
        </div>
      </div>

      {showToast && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
