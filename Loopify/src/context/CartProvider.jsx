import React, { useState } from 'react';
import { CartContext } from './CartContext';

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(prev =>
        prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart(prev => [...prev, { ...product, quantity }]);
    }
  };

  const clearCart = () => setCart([]);
  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const increaseQuantity = (id) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQuantity = (id) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item));

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, removeItem, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
}
