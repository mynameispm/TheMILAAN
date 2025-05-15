import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import AuthForm from '../components/auth/AuthForm';
import { AuthTabType } from '../types';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTabType>('login');
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Set active tab based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location]);
  
  const handleChangeTab = (tab: AuthTabType) => {
    setActiveTab(tab);
    navigate(`/auth${tab === 'register' ? '?tab=register' : ''}`);
  };
  
  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <HelpCircle size={32} className="text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Join Milaan'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'login'
                ? 'Sign in to your account to continue'
                : 'Create an account to get started'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-6 sm:p-8">
            <AuthForm
              activeTab={activeTab}
              onChangeTab={handleChangeTab}
              onSuccess={handleSuccess}
            />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;