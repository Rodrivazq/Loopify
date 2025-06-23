import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CheckOut.css';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    const orden = {
      comprador: formData,
      items: cart,
      total,
      fecha: new Date().toLocaleString(),
    };

    setTimeout(() => {
      setSending(false);
      clearCart();
      navigate('/confirmacion', { state: { orden } });
    }, 1300); // Simula envío
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Finalizar compra</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Nombre completo
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={sending}
          />
        </label>
        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={sending}
          />
        </label>
        <label>
          Teléfono
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={sending}
          />
        </label>
        <div className="checkout-summary">
          <span>Total a pagar:</span>
          <span className="checkout-total">${total}</span>
        </div>
        <button type="submit" className="checkout-btn" disabled={sending}>
          {sending ? "Procesando..." : "Confirmar compra"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
