import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "alonpc-cart";

function readSavedCart() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readSavedCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product?._id) return;

    setCartItems((current) => {
      const existing = current.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(
                  Number(item.quantity || 1) + 1,
                  Number(product.stock || 99)
                ),
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity || 1));

    setCartItems((current) =>
      current.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.min(
                nextQuantity,
                Number(item.stock || 99)
              ),
            }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((current) =>
      current.filter((item) => item._id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    total,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart חייב להיות בתוך CartProvider");
  }

  return context;
}
