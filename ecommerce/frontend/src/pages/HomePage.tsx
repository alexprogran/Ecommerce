import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Award, ThumbsUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-32" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundPosition: '50% 30%'
        }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Delicious Pizza, <br />Delivered Fast
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Handcrafted with fresh ingredients and baked to perfection.
            Order now and taste the difference!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/menu" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              Order Now <ChevronRight size={20} className="ml-2" />
            </Link>
            <Link 
              to="/menu" 
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-md text-lg font-medium transition"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                We use only the freshest ingredients and authentic recipes to create perfect pizzas every time.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Your order will arrive hot and fresh with our quick delivery service. Satisfaction guaranteed.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Join thousands of satisfied customers who keep coming back for our delicious pizzas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Most Popular Pizzas</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Try our customer favorites and see why they keep coming back for more
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPizzas.map((pizza) => (
              <div 
                key={pizza.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={pizza.image} 
                  alt={pizza.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{pizza.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-600">${pizza.price.toFixed(2)}</span>
                    <Link 
                      to="/menu" 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/menu" 
              className="inline-block bg-white border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-md font-medium transition"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get your favorite pizza delivered to your doorstep in minutes!
          </p>
          <Link 
            to="/menu" 
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition"
          >
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
};

// Mock data for popular pizzas
const popularPizzas = [
  {
    id: '1',
    name: 'Pepperoni',
    description: 'Classic pepperoni pizza with our signature tomato sauce and mozzarella cheese.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2714722/pexels-photo-2714722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Margherita',
    description: 'Traditional margherita with fresh basil, mozzarella, and tomato sauce.',
    price: 10.99,
    image: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Supreme',
    description: 'Loaded with pepperoni, sausage, bell peppers, onions, and black olives.',
    price: 14.99,
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'BBQ Chicken',
    description: 'Grilled chicken, red onions, and BBQ sauce with a blend of cheeses.',
    price: 13.99,
    image: 'https://images.pexels.com/photos/845798/pexels-photo-845798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default HomePage;