import { useState } from 'react';
import { Pizza, pizzas } from '../utils/pizzaData';
import { PizzaSize, useCart } from '../contexts/CartContext';
import { Search, Filter } from 'lucide-react';

const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('medium');
  const { addToCart } = useCart();

  // Filter pizzas based on search term and category
  const filteredPizzas = pizzas.filter(pizza => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pizza.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (pizza: Pizza) => {
    addToCart({
      id: pizza.id,
      name: pizza.name,
      size: selectedSize,
      price: pizza.prices[selectedSize],
      imageUrl: pizza.imageUrl
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Pizza Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our delicious range of handcrafted pizzas made with the freshest ingredients
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search pizzas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <Filter size={20} className="text-gray-500 mr-2" />
                <span className="text-gray-700 mr-2">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All</option>
                  <option value="classic">Classic</option>
                  <option value="specialty">Specialty</option>
                  <option value="vegetarian">Vegetarian</option>
                </select>
              </div>

              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Size:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value as PizzaSize)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {filteredPizzas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {filteredPizzas.map((pizza) => (
              <div 
                key={pizza.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={pizza.imageUrl} 
                    alt={pizza.name} 
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {pizza.isPopular && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{pizza.name}</h3>
                    <span className="text-lg font-bold text-red-600">
                      ${pizza.prices[selectedSize].toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{pizza.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Toppings:</p>
                    <p className="text-sm text-gray-700">
                      {pizza.toppings.join(', ')}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(pizza)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No pizzas found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;