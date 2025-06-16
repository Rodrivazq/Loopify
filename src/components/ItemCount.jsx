// src/components/ItemCount.jsx
import { useState } from 'react'

const ItemCount = ({ stock, initial, onAdd }) => {
  const [count, setCount] = useState(initial)

  const increment = () => {
    if (count < stock) setCount(count + 1)
  }

  const decrement = () => {
    if (count > 1) setCount(count - 1)
  }

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={decrement}>-</button>
        <span>{count}</span>
        <button onClick={increment}>+</button>
      </div>
      <button onClick={() => onAdd(count)}>Agregar al carrito</button>
    </div>
  )
}

export default ItemCount
