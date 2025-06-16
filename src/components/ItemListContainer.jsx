import products from '../data/products'
import ItemList from './ItemList'

const ItemListContainer = () => {
  return (
    <div>
      <h2 style={{ padding: '1rem' }}>Catálogo de productos</h2>
      <ItemList products={products} />
    </div>
  )
}

export default ItemListContainer
