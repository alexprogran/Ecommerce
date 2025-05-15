import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  }; 

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-2 rounded-full">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#FFF" fillOpacity="0.8" />
                <path 
                  d="M7 13L12 7L17 13" 
                  stroke="#E53935" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-red-600">PizzaDelight</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-red-600 transition">
              Menu
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-red-600 transition">
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="group relative">
                  <button className="flex items-center text-gray-700 hover:text-red-600">
                    <User size={20} className="mr-1" />
                    <span className="font-medium">{user?.username.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link 
                      to="/order-history" 
                      className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    >
                      Order History
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut size={18} className="mr-2" /> 
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
              >
                Login
              </Link>
            )}

            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-red-600">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative p-2 mr-2 text-gray-700">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="py-2 text-gray-700 hover:text-red-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className="py-2 text-gray-700 hover:text-red-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="py-2 text-gray-700 hover:text-red-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/order-history" 
                  className="py-2 text-gray-700 hover:text-red-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Order History
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="py-2 text-gray-700 hover:text-red-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;