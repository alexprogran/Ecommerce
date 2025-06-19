import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Order, getOrders, updateOrder } from '../utils/adminData';
import { Clock, Package, CheckCircle, Truck as TruckDelivery, Search } from 'lucide-react';

type FilterStatus = 'all' | 'processing' | 'preparing' | 'ready' | 'delivering' | 'completed';
type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  // Load orders on mount
  useEffect(() => {
    refreshOrders();
  }, []);

  // Filter and sort orders when dependencies change
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(order => order.status === filterStatus);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.phone.toLowerCase().includes(query) ||
        order.customer.address.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.total - a.total;
        case 'lowest':
          return a.total - b.total;
        default:
          return 0;
      }
    });
    
    setFilteredOrders(result);
  }, [orders, filterStatus, searchQuery, sortOption]);

  const refreshOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders);
    
    // If there's a selected order, refresh its data
    if (selectedOrder) {
      const refreshedOrder = allOrders.find(order => order.id === selectedOrder.id);
      setSelectedOrder(refreshedOrder || null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const success = updateOrder(orderId, { status: newStatus });
    
    if (success) {
      setIsUpdateSuccess(true);
      setTimeout(() => setIsUpdateSuccess(false), 3000);
      refreshOrders();
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = ['processing', 'preparing', 'ready', 'delivering', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1] as Order['status'];
    }
    
    return null;
  };

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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delivering':
        return <TruckDelivery className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. This area is reserved for administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={refreshOrders}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Refresh Orders
          </button>
        </div>
        
        {/* Status notification */}
        {isUpdateSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Order status updated successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Orders List Panel */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-800">All Orders</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full sm:w-48 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    {/* Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="processing">Processing</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivering">Delivering</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    {/* Sort */}
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Total</option>
                      <option value="lowest">Lowest Total</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedOrder?.id === order.id ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.customer.name}</div>
                            <div className="text-sm text-gray-500">{order.customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${formatCurrency(order.total)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(order.status)}
                              <span className="ml-2 text-sm text-gray-900 capitalize">
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Order Detail Panel */}
          <div className="lg:w-1/3">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                  <div className="flex items-center">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 text-sm font-medium capitalize">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p className="text-gray-700"><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                    {selectedOrder.customer.address && (
                      <p className="text-gray-700"><span className="font-medium">Address:</span> {selectedOrder.customer.address}</p>
                    )}
                    {selectedOrder.deliveryInstructions && (
                      <p className="text-gray-700"><span className="font-medium">Instructions:</span> {selectedOrder.deliveryInstructions}</p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
                  <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="py-3 flex justify-between">
                        <div>
                          <p className="text-gray-900">
                            {item.quantity} x {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                          </p>
                        </div>
                        <p className="text-gray-900 font-medium">
                          ${formatCurrency(item.price * item.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-800">${formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-800">${formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {selectedOrder.deliveryMethod === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                      </span>
                      <span className="text-gray-800">
                        ${formatCurrency(selectedOrder.deliveryFee)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Total</span>
                        <span className="font-bold text-red-600">${formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Update Status</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-700">Current Status: <span className="font-medium capitalize">{selectedOrder.status}</span></p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Status buttons */}
                    {['processing', 'preparing', 'ready', 'delivering', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder.id, status as Order['status'])}
                        disabled={status === selectedOrder.status}
                        className={`py-2 px-4 rounded-md flex items-center justify-center ${
                          status === selectedOrder.status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {getStatusIcon(status as Order['status'])}
                        <span className="ml-2 capitalize">{status}</span>
                      </button>
                    ))}
                    
                    {/* Quick update to next status */}
                    {getNextStatus(selectedOrder.status) && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!)}
                        className="py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                      >
                        <span>Update to {getNextStatus(selectedOrder.status)}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No order selected</h3>
                <p className="text-gray-500">Select an order from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;