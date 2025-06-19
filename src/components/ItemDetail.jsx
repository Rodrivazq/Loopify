import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import ItemCount from './ItemCount'
import './ItemDetail.css'

const ItemDetail = ({ product }) => {
  const { addToCart } = useCart()

  const handleAdd = (quantity) => {
    addToCart(product, quantity)
    alert(`Agregaste ${quantity} x ${product.name} al carrito`)
  }

  return (
    <div className="item-detail-container">
      <div className="item-detail-content">
        <img
          src={product.image}
          alt={product.name}
          className="item-detail-img"
        />
        <div className="item-detail-info">
          <h2 className="item-detail-title">{product.name}</h2>
          <p className="item-detail-price">${product.price}</p>
          <p className="item-detail-description">{product.description}</p>
          <ItemCount stock={10} initial={1} onAdd={handleAdd} />
          <hr className="volver-divider" />
          <Link
            to="/productos"
            className="volver-link"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail

