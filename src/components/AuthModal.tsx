import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  showNotification: (title: string, message: string, type: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  onSignup, 
  showNotification 
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showNotification('Form Error', 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isLoginMode) {
      if (!formData.name) {
        showNotification('Form Error', 'Name is required for signup.', 'error');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showNotification('Form Error', 'Passwords do not match.', 'error');
        return;
      }
    }

    setIsLoading(true);

    try {
      const result = isLoginMode 
        ? await onLogin(formData.email, formData.password)
        : await onSignup(formData.name, formData.email, formData.password);

      if (result.success) {
        showNotification(
          isLoginMode ? 'Welcome Back!' : 'Account Created!', 
          isLoginMode ? 'Successfully logged in.' : 'Your account has been created successfully.', 
          'success'
        );
        onClose();
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        showNotification('Authentication Error', result.error || 'Something went wrong.', 'error');
      }
    } catch (error) {
      showNotification('Error', 'An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content enhanced-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-user-shield"></i>
            {isLoginMode ? 'Welcome Back' : 'Join Ocean Guardian'}
          </h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLoginMode}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />
          </div>
          
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <i className={`fas ${isLoginMode ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              type="button" 
              onClick={toggleMode}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'rgba(102, 126, 234, 0.8)', 
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {isLoginMode ? 'Create an account' : 'Sign in instead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;