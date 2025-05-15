import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell, MessageCircle, Search, LogOut, HelpCircle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-primary-500"
          >
            <HelpCircle size={28} />
            <span>Milaan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/problems" 
              className="text-gray-700 hover:text-primary-500 transition"
            >
              Browse Problems
            </Link>
            <Link 
              to="/helpers" 
              className="text-gray-700 hover:text-primary-500 transition"
            >
              Find Helpers
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary-500 transition"
            >
              About Us
            </Link>
          </nav>

          {/* Search */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative w-64 lg:w-72"
          >
            <input
              type="text"
              placeholder="Search problems, helpers..."
              className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white border border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </form>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/notifications" 
                  className="text-gray-700 hover:text-primary-500 relative"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    3
                  </span>
                </Link>
                <Link 
                  to="/messages" 
                  className="text-gray-700 hover:text-primary-500 relative md:block hidden"
                >
                  <MessageCircle size={20} />
                </Link>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center focus:outline-none"
                  >
                    <Avatar 
                      src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                      alt={user?.name || 'User'} 
                      size="sm"
                    />
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Your Profile
                      </Link>
                      <Link 
                        to="/post-problem" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <HelpCircle size={16} className="mr-2" />
                        Post a Problem
                      </Link>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/auth" 
                  className="bg-white text-primary-500 hover:text-primary-600 px-4 py-2 rounded-md border border-primary-500 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/auth?tab=register" 
                  className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-md transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden ml-4 text-gray-700"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white animated-fade-in border-t">
          <div className="px-4 py-3">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative"
            >
              <input
                type="text"
                placeholder="Search problems, helpers..."
                className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white border border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </form>
          </div>
          <nav className="px-4 py-2 space-y-1 border-t">
            <Link 
              to="/problems" 
              className="block py-2 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Problems
            </Link>
            <Link 
              to="/helpers" 
              className="block py-2 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Helpers
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            {!isAuthenticated && (
              <>
                <div className="border-t pt-2 mt-2">
                  <Link 
                    to="/auth" 
                    className="block py-2 text-primary-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth?tab=register" 
                    className="block py-2 text-primary-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;