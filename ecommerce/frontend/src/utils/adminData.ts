export type Order = {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'card' | 'cash';
  status: 'processing' | 'preparing' | 'ready' | 'delivering' | 'completed';
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  deliveryInstructions?: string;
};

// Function to get all orders from localStorage
export const getOrders = (): Order[] => {
  const orders = JSON.parse(localStorage.getItem('pizza-orders') || '[]');
  
  // Sort by date (newest first)
  orders.sort((a: Order, b: Order) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return orders;
};

// Function to update an order
export const updateOrder = (orderId: string, updates: Partial<Order>): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...updates };
    localStorage.setItem('pizza-orders', JSON.stringify(orders));
    return true;
  }
  
  return false;
};