import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('pizza-user');
    const token = localStorage.getItem('pizza-token');
    if (storedUser && token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login/', { username: email, password });
      const token = response.data.token;

      const userProfile = await axios.get('/api/profile/');
      const userData = userProfile.data[0]; // considerando que retorna uma lista

      const fullUser: User = {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
        isAdmin: userData.is_admin,
      };

      localStorage.setItem('pizza-token', token);
      localStorage.setItem('pizza-user', JSON.stringify(fullUser));
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;

      setUser(fullUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('/api/auth/register/', {
        username: name,
        email,
        password
      });

      return await login(email, password);
    } catch (error) {
      console.error('Register failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('pizza-user');
    localStorage.removeItem('pizza-token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
