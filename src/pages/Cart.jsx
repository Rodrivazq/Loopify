import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const Cart = () => {
  const {
    cart,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity
  } = useCart()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Tu carrito está vacío</h2>
        <Link to="/productos" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Carrito de compras</h2>
      {cart.map(item => (
        <div key={item.id} style={{
          border: '1px solid #ccc',
          marginBottom: '1rem',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <h4>{item.name}</h4>
            <p>${item.price} x {item.quantity} = ${item.price * item.quantity}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => decreaseQuantity(item.id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increaseQuantity(item.id)}>+</button>
            <button onClick={() => removeItem(item.id)} style={{ marginLeft: '1rem', color: 'red' }}>❌</button>
          </div>
        </div>
      ))}

      <h3>Total: ${total}</h3>
      <button onClick={clearCart} style={{ marginTop: '1rem' }}>Vaciar carrito</button>
      <Link to="/checkout">
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          Finalizar compra
        </button>
      </Link>
    </div>
  )
}

export default Cart
