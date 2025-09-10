import { Link } from 'react-router-dom'

const Item = ({ product }) => {
  return (
    <div className="item-card">
      <h3>{product.name}</h3>
      <img src={product.image} alt={product.name} />
      <p>Precio: ${product.price}</p>
      <p>{product.description}</p>
      <Link to={`/producto/${product.id}`}>
        Ver más
      </Link>
    </div>
  )
}

export default Item

