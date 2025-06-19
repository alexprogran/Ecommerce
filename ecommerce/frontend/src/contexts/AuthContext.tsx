import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../Api';

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
  login: (username: string, password: string) => Promise<boolean>;
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
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login/', { username, password });
      const token = response.data.token;
      localStorage.setItem('pizza-token', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;


     
      const userProfile = await api.get('/endpoint/profile/');
      const userData = userProfile.data[0]; // considerando que retorna uma lista

      const fullUser: User = {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
        isAdmin: userData.is_admin,
      };
      console.log('Informações do usuário: ', fullUser)

      localStorage.setItem('pizza-user', JSON.stringify(fullUser));

      setUser(fullUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
   
    try {
      await api.post('/endpoint/register/', {
        username: name,
        email,
        password
      });

      return await login(name, password);
    } catch (error) {
      console.error('Register failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('pizza-user');
    localStorage.removeItem('pizza-token');
    delete api.defaults.headers.common['Authorization'];
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
