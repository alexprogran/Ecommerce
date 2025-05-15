import React, { createContext, useState, useContext, useEffect } from 'react';

// Tipos simulados (comentários apenas para referência)
// PizzaSize: 'small' | 'medium' | 'large'
// CartItem: { id, name, size, price, quantity, imageUrl }

// Cria o contexto
const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Carrega o carrinho do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Salva o carrinho no localStorage quando ele muda
  useEffect(() => {
    localStorage.setItem('pizza-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      console.log('Retorno do carrinho: ', existingItemIndex);
      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id, size) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

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
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

// Hook personalizado para usar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
