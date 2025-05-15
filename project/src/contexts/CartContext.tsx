import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
export type PizzaSize = 'small' | 'medium' | 'large';

export type CartItem = {
  id: string;
  name: string;
  size: PizzaSize;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, size: PizzaSize) => void;
  updateQuantity: (id: string, size: PizzaSize, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    console.log('Lista de itens no localStorage:', savedCart)
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pizza-cart', JSON.stringify(items));
    console.log('Houve alterações na lista de itens: ', items);
    const savedCart = localStorage.getItem('pizza-cart');
    console.log('Lista no localStorage: ',savedCart )
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Check if item already exists with same id and size
      const existingItemIndex = currentItems.findIndex(
        item => item.id === newItem.id && item.size === newItem.size
        
      );
      console.log('esistingItemIndex: ', existingItemIndex);
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;

        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string, size: PizzaSize) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id: string, size: PizzaSize, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id && item.size === size 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};