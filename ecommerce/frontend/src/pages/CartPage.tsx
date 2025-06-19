import { Link } from 'react-router-dom';
import { useCart, PizzaSize } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  const handleIncreaseQuantity = (id: string, size: PizzaSize, currentQuantity: number) => {
    updateQuantity(id, size, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (id: string, size: PizzaSize, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, size, currentQuantity - 1);
    } else {
      removeFromCart(id, size);
    }
  };

  // Fixed delivery fee
  const deliveryFee = 3.99;
  // Calculate tax (assume 8% tax rate)
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  // Calculate total
  const total = subtotal + tax + deliveryFee;

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/menu"
              className="bg-red-600 text-white px-6 py-3 rounded-md inline-block font-medium hover:bg-red-700 transition"
            >
              Browse Our Menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Items ({totalItems})
                  </h2>
                </div>

                <ul>
                  {items.map((item, index) => (
                    <li 
                      key={`${item.id}-${item.size}-${index}`}
                      className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-4"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}</p>
                      </div>
                      
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id, item.size, item.quantity)}
                          className="px-3 py-1 text-gray-600 hover:text-red-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 border-l border-r border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item.id, item.size, item.quantity)}
                          className="px-3 py-1 text-gray-600 hover:text-red-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-800">
                          ${formatCurrency(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 font-medium">${formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-800 font-medium">${formatCurrency(tax)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800 font-medium">${formatCurrency(deliveryFee)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-800">Total</span>
                      <span className="text-lg font-bold text-red-600">${formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link
                    to="/checkout"
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 transition flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <Link
                    to="/menu"
                    className="w-full text-center block mt-4 text-red-600 hover:text-red-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;