// src/context/CartContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(it => it.id === product.id);
      if (exists) {
        return prev.map(it =>
          it.id === product.id
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }

      // 👇 snapshot del producto con imageUrl
      const snapshot = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl ?? null, // << importante
        quantity,
      };

      return [...prev, snapshot];
    });
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(it => it.id !== id));
  };

  const clearCart = () => setCart([]);

  const increaseQuantity = (id) => {
    setCart(prev =>
      prev.map(it =>
        it.id === id ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(prev =>
      prev.map(it =>
        it.id === id && it.quantity > 1
          ? { ...it, quantity: it.quantity - 1 }
          : it
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
