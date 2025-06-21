import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Cart.css";

export default function Cart() {
  const {
    cart,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
  } = useCart();

  const [feedback, setFeedback] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    if (window.confirm("¿Seguro que quieres vaciar el carrito?")) {
      clearCart();
      setFeedback("¡Carrito vaciado!");
      setTimeout(() => setFeedback(""), 1800);
    }
  };

  const handleRemoveItem = (id, name) => {
    removeItem(id);
    setFeedback(`"${name}" eliminado del carrito`);
    setTimeout(() => setFeedback(""), 1600);
  };

  if (cart.length === 0) {
    return (
      <section className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        {feedback && <p className="cart-feedback">{feedback}</p>}
        <Link to="/productos" className="volver-link">
          ← Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-container">
      <h2>Carrito de compras</h2>
      {feedback && <p className="cart-feedback">{feedback}</p>}

      <div className="cart-list">
        {cart.map((item) => (
          <article key={item.id} className="cart-item">
            <div className="cart-item-imgbox">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-img"
              />
            </div>

            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>
                ${item.price} x {item.quantity} ={" "}
                <span className="item-total">
                  ${item.price * item.quantity}
                </span>
              </p>
            </div>

            <div className="cart-item-controls">
              <button
                className="qty-btn"
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => increaseQuantity(item.id)}
              >
                +
              </button>
              <button
                className="remove-btn"
                onClick={() => handleRemoveItem(item.id, item.name)}
                title="Quitar del carrito"
              >
                ❌
              </button>
            </div>
          </article>
        ))}
      </div>

      <h3 className="cart-total">Total: ${total}</h3>

      <div className="cart-actions">
        <button className="clear-btn" onClick={handleClearCart}>
          Vaciar carrito
        </button>
        <Link to="/checkout">
          <button className="checkout-btn">Finalizar compra</button>
        </Link>
      </div>
    </section>
  );
}
