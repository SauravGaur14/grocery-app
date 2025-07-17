import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const discountPercentage = 10; // 10% discount
  const deliveryCharges = 50;
  const platformFee = 20;

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

  const getSubtotal = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalAmount = () => {
    const subtotal = getSubtotal();
    const discount = (subtotal * discountPercentage) / 100;
    return subtotal - discount + deliveryCharges + platformFee;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        getSubtotal,
        getTotalAmount,
        discountPercentage,
        deliveryCharges,
        platformFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
