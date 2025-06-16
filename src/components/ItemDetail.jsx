import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import ItemCount from './ItemCount'

const ItemDetail = ({ product }) => {
  const { addToCart } = useCart()

  const handleAdd = (quantity) => {
    addToCart(product, quantity)
    alert(`Agregaste ${quantity} x ${product.name} al carrito`)
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{product.name}</h2>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', maxWidth: '300px', margin: '1rem 0' }}
      />
      <p style={{ fontSize: '1.2rem' }}>${product.price}</p>
      <p>{product.description}</p>

      <ItemCount stock={10} initial={1} onAdd={handleAdd} />

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/productos" style={{ textDecoration: 'underline', color: 'blue' }}>
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}

export default ItemDetail

