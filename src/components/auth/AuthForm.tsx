import React, { useState } from 'react';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import { AuthTabType, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AuthFormProps {
  activeTab: AuthTabType;
  onChangeTab: (tab: AuthTabType) => void;
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  activeTab, 
  onChangeTab,
  onSuccess,
}) => {
  const { login, register } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('asker');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError('Invalid email or password. Try helper@example.com or asker@example.com');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register({
        name,
        email,
        role,
        bio,
        location: {
          lat: 19.0760, // Default to Mumbai
          lng: 72.8777,
          address: location || 'Mumbai, India',
        },
        avatar: `https://randomuser.me/api/portraits/${role === 'helper' ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
      }, password);
      onSuccess();
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-medium text-center flex-1 transition ${activeTab === 'login' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600 hover:text-primary-500'}`}
          onClick={() => onChangeTab('login')}
        >
          Login
        </button>
        <button
          className={`py-2 px-4 font-medium text-center flex-1 transition ${activeTab === 'register' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600 hover:text-primary-500'}`}
          onClick={() => onChangeTab('register')}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-error-50 border border-error-200 text-error-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} className="text-gray-500" />}
          />
          
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock size={18} className="text-gray-500" />}
            helperText="For demo: Use helper@example.com or asker@example.com with any password"
          />
          
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => onChangeTab('register')}
            >
              Register
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            id="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={<User size={18} className="text-gray-500" />}
          />
          
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} className="text-gray-500" />}
          />
          
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock size={18} className="text-gray-500" />}
          />
          
          <Select
            id="role"
            label="I want to join as"
            options={[
              { value: 'asker', label: 'Problem Asker - I need help' },
              { value: 'helper', label: 'Helper - I want to volunteer' },
            ]}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            required
          />
          
          <TextArea
            id="bio"
            label="Bio"
            placeholder="Tell us a little about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          
          <Input
            id="location"
            label="Location"
            placeholder="Your city, state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            icon={<MapPin size={18} className="text-gray-500" />}
          />
          
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => onChangeTab('login')}
            >
              Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default AuthForm;