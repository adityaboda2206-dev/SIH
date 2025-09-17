import { useState, useCallback, useEffect } from 'react';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('oceanGuardian_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('oceanGuardian_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock authentication - in real app, this would be an API call
        if (email && password.length >= 6) {
          const user: User = {
            id: `user_${Date.now()}`,
            email,
            name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: 'Marine Conservationist',
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face`,
            joinedAt: new Date()
          };
          
          localStorage.setItem('oceanGuardian_user', JSON.stringify(user));
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          
          resolve({ success: true });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          resolve({ 
            success: false, 
            error: password.length < 6 ? 'Password must be at least 6 characters' : 'Invalid email or password' 
          });
        }
      }, 1500);
    });
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (name && email && password.length >= 6) {
          const user: User = {
            id: `user_${Date.now()}`,
            email,
            name,
            role: 'Marine Conservationist',
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face`,
            joinedAt: new Date()
          };
          
          localStorage.setItem('oceanGuardian_user', JSON.stringify(user));
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          
          resolve({ success: true });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          resolve({ 
            success: false, 
            error: !name ? 'Name is required' : 
                   !email ? 'Email is required' : 
                   'Password must be at least 6 characters' 
          });
        }
      }, 1500);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('oceanGuardian_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout
  };
};