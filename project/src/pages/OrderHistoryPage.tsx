import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, CheckCircle, Package, Truck as TruckDelivery } from 'lucide-react';

type OrderStatus = 'processing' | 'preparing' | 'ready' | 'delivering' | 'completed';

interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'card' | 'cash';
  status: OrderStatus;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  deliveryInstructions?: string;
}

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('pizza-orders') || '[]');
    // Filter orders by current user ID
    const userOrders = allOrders.filter((order: Order) => order.userId === user?.id);
    // Sort by date (newest first)
    userOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(userOrders);
    
    // Set the most recent order as active if any
    if (userOrders.length > 0) {
      setActiveOrderId(userOrders[0].id);
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = (status: OrderStatus) => {
    const statuses = ['processing', 'preparing', 'ready', 'delivering', 'completed'];
    const currentIndex = statuses.indexOf(status);
    
    return statuses.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'preparing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'delivering':
        return <TruckDelivery className="w-6 h-6 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 'Your order is being processed';
      case 'preparing':
        return 'Your pizza is being prepared';
      case 'ready':
        return 'Your order is ready for pickup';
      case 'delivering':
        return 'Your order is on the way';
      case 'completed':
        return 'Your order has been delivered';
      default:
        return 'Order status unknown';
    }
  };

  const activeOrder = orders.find(order => order.id === activeOrderId);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h2>
            <p className="mt-1 text-sm text-gray-500">
              You haven't placed any orders yet. Start by browsing our menu.
            </p>
            <div className="mt-6">
              <Link
                to="/menu"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Order List */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Your Orders</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <button
                        onClick={() => setActiveOrderId(order.id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 focus:outline-none transition ${
                          activeOrderId === order.id ? 'bg-red-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className={`ml-2 text-sm font-medium ${
                              activeOrderId === order.id ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              ${formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Details */}
            {activeOrder && (
              <div className="md:w-2/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Order #{activeOrder.id}</h2>
                        <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(activeOrder.createdAt)}</p>
                      </div>
                      <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
                        {getStatusIcon(activeOrder.status)}
                        <span className="ml-2 text-sm font-medium capitalize">
                          {activeOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Order Status</h3>
                    <div className="flex items-center mb-4">
                      {getStatusIcon(activeOrder.status)}
                      <p className="ml-2 text-gray-700">{getStatusText(activeOrder.status)}</p>
                    </div>

                    {/* Status Progress */}
                    <div className="relative">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        {getStatusSteps(activeOrder.status).map((step, index) => (
                          <div
                            key={step.name}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${
                              step.completed ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                            style={{ width: `${100 / 5}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Processing</span>
                        <span>Preparing</span>
                        <span>Ready</span>
                        <span>Delivering</span>
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      {activeOrder.deliveryMethod === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="font-medium text-gray-800">{activeOrder.customer.name}</p>
                      <p className="text-gray-600">{activeOrder.customer.phone}</p>
                      {activeOrder.deliveryMethod === 'delivery' && (
                        <p className="text-gray-600 mt-2">{activeOrder.customer.address}</p>
                      )}
                      {activeOrder.deliveryInstructions && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Delivery Instructions:</p>
                          <p className="text-gray-600">{activeOrder.deliveryInstructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
                    <ul className="divide-y divide-gray-200">
                      {activeOrder.items.map((item, index) => (
                        <li key={index} className="py-4 flex">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                          <div className="ml-4 flex-1 flex justify-between">
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                              </p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-800">
                              ${formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Order Summary */}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800">${formatCurrency(activeOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-800">${formatCurrency(activeOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {activeOrder.deliveryMethod === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                        </span>
                        <span className="text-gray-800">
                          ${formatCurrency(activeOrder.deliveryFee)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">Total</span>
                          <span className="font-bold text-red-600">${formatCurrency(activeOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <Link
                        to="/menu"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Order Again
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;