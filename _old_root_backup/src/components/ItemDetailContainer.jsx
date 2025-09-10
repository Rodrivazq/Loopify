// src/components/ItemDetailContainer.jsx
import { useParams } from 'react-router-dom'
import products from '../data/products'
import ItemDetail from './ItemDetail'

const ItemDetailContainer = () => {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id))

  if (!product) return <p style={{ padding: '1rem' }}>Producto no encontrado ❌</p>

  return (
    <div style={{ padding: '1rem' }}>
      <ItemDetail product={product} />
    </div>
  )
}

export default ItemDetailContainer
