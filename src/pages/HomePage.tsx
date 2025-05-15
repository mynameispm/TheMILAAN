import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronRight, Search, MapPin, ArrowRight, Users, MessageSquare, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import ProblemCard from '../components/problem/ProblemCard';
import Avatar from '../components/common/Avatar';
import { useProblems } from '../context/ProblemContext';
import { useAuth } from '../context/AuthContext';
import { Problem, User } from '../types';
import { getUsersByRole } from '../services/authService';
import { categoryOptions, categoryIcons } from '../utils/categoryData';

const HomePage: React.FC = () => {
  const { problems, loading } = useProblems();
  const { isAuthenticated } = useAuth();
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [popularHelpers, setPopularHelpers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Get recent problems
    if (problems.length > 0) {
      setRecentProblems(
        [...problems]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
      );
    }

    // Get popular helpers
    const getHelpers = async () => {
      try {
        const helpers = await getUsersByRole('helper');
        const sortedHelpers = helpers.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
        setPopularHelpers(sortedHelpers);
      } catch (error) {
        console.error('Failed to fetch helpers', error);
      }
    };

    getHelpers();
  }, [problems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const filteredProblems = activeCategory === 'all'
    ? recentProblems
    : recentProblems.filter(problem => problem.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-enter">
                <span className="block">Need Help?</span> 
                <span className="text-accent-300">Find Your Solution</span>
              </h1>
              <p className="text-lg text-primary-100 mb-8 max-w-lg animate-enter" style={{ animationDelay: '0.2s' }}>
                Milaan connects people facing challenges with helpers who can provide solutions. Post your problem and find the support you need.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 animate-enter" style={{ animationDelay: '0.4s' }}>
                <Link to="/post-problem">
                  <Button variant="accent" size="lg">
                    Post a Problem
                  </Button>
                </Link>
                <Link to="/problems">
                  <Button variant="secondary" size="lg">
                    Browse Problems
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-enter" style={{ animationDelay: '0.6s' }}>
              <div className="relative">
                {/* Main illustration */}
                <img 
                  src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Community helping"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxHeight: '320px' }}
                />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-pulse-slow">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center text-success-600">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Helpers</p>
                      <p className="text-sm font-semibold">1,200+</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-pulse-slow">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center text-accent-600">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Problems Solved</p>
                      <p className="text-sm font-semibold">5,438</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for problems or helpers..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button type="submit" className="w-full md:w-auto">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Find problems categorized by different areas of need
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary-50 border-2 border-primary-500 text-primary-700'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-3">
                <HelpCircle size={24} />
              </div>
              <span className="font-medium">All Categories</span>
            </button>

            {categoryOptions.slice(0, 4).map((category) => {
              const Icon = category.value in categoryIcons 
                ? categoryIcons[category.value]
                : HelpCircle;

              return (
                <button
                  key={category.value}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                    activeCategory === category.value
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-3">
                    <Icon size={24} />
                  </div>
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <Link to="/categories" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View All Categories
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Problems Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Problems</h2>
            <Link 
              to="/problems" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading problems...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <HelpCircle size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Problems Found</h3>
              <p className="text-gray-500 mb-4">
                {activeCategory === 'all'
                  ? "There are no problems posted yet."
                  : `There are no problems in the ${activeCategory} category.`}
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/post-problem'}
              >
                Post a Problem
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          )}

          {!loading && filteredProblems.length > 0 && (
            <div className="text-center mt-8">
              <Link to="/problems">
                <Button variant="secondary">
                  Browse All Problems
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Helpers Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Helpers</h2>
            <Link 
              to="/helpers" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularHelpers.slice(0, 3).map((helper) => (
              <Link 
                key={helper.id} 
                to={`/profile/${helper.id}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow duration-300">
                  <div className="flex items-start">
                    <Avatar 
                      src={helper.avatar} 
                      alt={helper.name} 
                      size="lg"
                      status="online"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg mb-1">{helper.name}</h3>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(helper.rating || 0) ? 'currentColor' : 'none'} stroke="currentColor" className={`w-4 h-4 ${i < Math.floor(helper.rating || 0) ? 'text-warning-500' : 'text-gray-300'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm">{helper.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <div className="flex items-center mb-2 text-sm text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        <span className="truncate">{helper.location.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={14} className="mr-1" />
                        <span>{helper.helpCount} problems helped</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 line-clamp-2">{helper.bio}</p>
                  <div className="mt-4 text-right">
                    <span className="inline-flex items-center text-primary-600 font-medium text-sm">
                      View Profile
                      <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How Milaan Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A simple process to get the help you need or provide assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your Problem</h3>
              <p className="text-gray-600">
                Describe your problem with details and location. Add photos if needed for better understanding.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Helpers</h3>
              <p className="text-gray-600">
                NGO volunteers and experts will see your problem and offer solutions through comments.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Solution</h3>
              <p className="text-gray-600">
                Work with helpers to implement the solution and mark your problem as solved when complete.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/how-it-works">
              <Button variant="secondary">
                Learn More About How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find or Offer Help?</h2>
            <p className="text-primary-100 mb-8">
              Join our community today and be part of the solution. Together, we can make a difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/auth?tab=register">
                    <Button variant="accent" size="lg">
                      Join Now
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="secondary" size="lg">
                      Login
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/post-problem">
                    <Button variant="accent" size="lg">
                      Post a Problem
                    </Button>
                  </Link>
                  <Link to="/problems">
                    <Button variant="secondary" size="lg">
                      Browse Problems
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;