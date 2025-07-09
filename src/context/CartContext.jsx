import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addItem = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { ...item, quantity: (prev[item.id]?.quantity || 0) + 1 },
    }));
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id]?.quantity > 1) updated[id].quantity -= 1;
      else delete updated[id];
      return updated;
    });
  };

  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
