import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CreditCard, MapPin, Clock, Loader } from 'lucide-react';

type DeliveryMethod = 'delivery' | 'pickup';
type PaymentMethod = 'card' | 'cash';

const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate prices
  const deliveryFee = deliveryMethod === 'delivery' ? 3.99 : 0;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    
    if (deliveryMethod === 'delivery') {
      if (!address.trim()) newErrors.address = 'Address is required';
      if (!city.trim()) newErrors.city = 'City is required';
      if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }
    
    if (paymentMethod === 'card') {
      // In a real app, we would validate card details here
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // In a real application, we would process the payment here
    // and send the order to the server
    
    // Simulate API call
    setTimeout(() => {
      // Create order object
      const order = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        userId: user?.id,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        deliveryMethod,
        paymentMethod,
        status: 'processing',
        createdAt: new Date().toISOString(),
        customer: {
          name: `${firstName} ${lastName}`,
          phone,
          address: deliveryMethod === 'delivery' ? `${address}, ${city}, ${zipCode}` : '',
        },
        deliveryInstructions,
      };
      
      // Save order to local storage (in a real app, this would go to a database)
      const orders = JSON.parse(localStorage.getItem('pizza-orders') || '[]');
      orders.push(order);
      localStorage.setItem('pizza-orders', JSON.stringify(orders));
      
      // Clear cart
      clearCart();
      
      // Redirect to success page
      setIsSubmitting(false);
      navigate('/order-history');
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Personal Information */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full p-2 border rounded-md ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full p-2 border rounded-md ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full p-2 border rounded-md ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      deliveryMethod === 'delivery'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <MapPin className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Delivery</h3>
                        <p className="text-sm text-gray-500">Delivered to your address</p>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            deliveryMethod === 'delivery'
                              ? 'border-red-600 bg-red-600'
                              : 'border-gray-300'
                          } relative`}
                        >
                          {deliveryMethod === 'delivery' && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      deliveryMethod === 'pickup'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Pickup</h3>
                        <p className="text-sm text-gray-500">Ready in 30 minutes</p>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            deliveryMethod === 'pickup'
                              ? 'border-red-600 bg-red-600'
                              : 'border-gray-300'
                          } relative`}
                        >
                          {deliveryMethod === 'pickup' && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address (only shown if delivery is selected) */}
                {deliveryMethod === 'delivery' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full p-2 border rounded-md ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`w-full p-2 border rounded-md ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className={`w-full p-2 border rounded-md ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions (optional)
                      </label>
                      <textarea
                        id="deliveryInstructions"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g. Ring the doorbell, leave at the front door, etc."
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <CreditCard className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Credit Card</h3>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            paymentMethod === 'card'
                              ? 'border-red-600 bg-red-600'
                              : 'border-gray-300'
                          } relative`}
                        >
                          {paymentMethod === 'card' && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-gray-500">Pay when your order arrives</p>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            paymentMethod === 'cash'
                              ? 'border-red-600 bg-red-600'
                              : 'border-gray-300'
                          } relative`}
                        >
                          {paymentMethod === 'cash' && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details (only shown if card payment is selected) */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm mb-2">
                      For demo purposes, no actual payment will be processed.
                    </p>
                    <p className="text-gray-500 text-sm">
                      In a real application, credit card processing would be integrated here.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Button */}
              <div className="p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 transition flex items-center justify-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Items */}
              <ul className="mb-6 divide-y divide-gray-200">
                {items.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between">
                    <div>
                      <p className="text-gray-800">
                        {item.quantity} x {item.name} ({item.size})
                      </p>
                    </div>
                    <p className="text-gray-800 font-medium">
                      ${formatCurrency(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              
              {/* Totals */}
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
                  <span className="text-gray-600">
                    {deliveryMethod === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {deliveryMethod === 'delivery' ? `$${formatCurrency(deliveryFee)}` : 'Free'}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-red-600">${formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;