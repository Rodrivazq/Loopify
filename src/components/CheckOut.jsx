import { useState, useContext, useMemo } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import './CheckOut.css';

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n || 0);

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) return setError('Ingresá tu nombre.');
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return setError('Email inválido.');

    setSending(true);

    const orden = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      comprador: formData,
      items: cart,      // snapshot ANTES de vaciar
      total,
      fecha: new Date().toISOString(),
    };

    // 1) Navega a confirmación con la orden
    navigate('/confirmacion', { state: { orden } });

    // 2) Vacía el carrito en el siguiente tick (evita redirecciones indeseadas)
    setTimeout(() => {
      clearCart();
      setSending(false);
    }, 0);
  };

  // Si el carrito está vacío, mostramos un mensaje (sin redirigir)
  if (!cart?.length) {
    return (
      <div className="checkout-container">
        <h2 className="checkout-title">Tu carrito está vacío</h2>
        <Link to="/productos" className="volver-link">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Finalizar compra</h2>

      <form onSubmit={handleSubmit} className="checkout-form">
        {error && (
          <p className="ck-error" style={{ color: '#b3261e', fontWeight: 700 }}>
            {error}
          </p>
        )}

        <label>
          Nombre completo
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={sending}
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="tel"
          />
        </label>

        {/* Resumen compacto de ítems */}
        <ul className="ck-items">
          {cart.map((it) => (
            <li key={it.id} className="ck-item">
              <img
                src={it.imageUrl || it.image || '/placeholder.png'}
                alt={it.name}
                className="ck-thumb"
                loading="lazy"
              />
              <div className="ck-item-info">
                <strong className="ck-name">{it.name}</strong>
                <span className="ck-line">
                  {fmt(it.price)} × {it.quantity}
                </span>
              </div>
              <span className="ck-sub">{fmt(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="checkout-summary">
          <span>Total a pagar:</span>
          <span className="checkout-total">{fmt(total)}</span>
        </div>

        <button type="submit" className="checkout-btn" disabled={sending}>
          {sending ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
