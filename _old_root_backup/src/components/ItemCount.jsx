import { useState } from 'react'
import './ItemCount.css'

const ItemCount = ({ stock, initial, onAdd }) => {
  const [count, setCount] = useState(initial)

  const increment = () => {
    if (count < stock) setCount(count + 1)
  }

  const decrement = () => {
    if (count > 1) setCount(count - 1)
  }

  return (
    <div>
      <div className="qty-selector">
        <button className="qty-btn" onClick={decrement}>-</button>
        <span className="qty-value">{count}</span>
        <button className="qty-btn" onClick={increment}>+</button>
      </div>
      <button className="btn-add-cart" onClick={() => onAdd(count)}>
        Agregar al carrito
      </button>
    </div>
  )
}

export default ItemCount

