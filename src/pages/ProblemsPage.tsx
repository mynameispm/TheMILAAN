import React, { useState, useEffect } from 'react';
import { Filter, Search, SlidersHorizontal, MapPin, List, Grid as GridIcon } from 'lucide-react';
import ProblemCard from '../components/problem/ProblemCard';
import Button from '../components/common/Button';
import { useProblems } from '../context/ProblemContext';
import { Problem } from '../types';
import { categoryOptions } from '../utils/categoryData';

const ProblemsPage: React.FC = () => {
  const { problems, loading } = useProblems();
  
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  useEffect(() => {
    let result = [...problems];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(problem => 
        problem.title.toLowerCase().includes(query) ||
        problem.description.toLowerCase().includes(query) ||
        problem.location.address.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(problem => problem.category === category);
    }
    
    // Apply status filter
    if (status !== 'all') {
      result = result.filter(problem => problem.status === status);
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'comments') {
      result.sort((a, b) => b.commentCount - a.commentCount);
    }
    
    setFilteredProblems(result);
  }, [problems, searchQuery, category, status, sortBy]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setStatus('all');
    setSortBy('recent');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">Browse Problems</h1>
        <p className="text-gray-600 mb-8">
          Explore problems posted by community members and offer your help
        </p>
        
        {/* Search and filter bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<SlidersHorizontal size={16} />}
                onClick={toggleFilters}
              >
                Filters
              </Button>
              
              <div className="border-l pl-2 flex items-center">
                <button
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <GridIcon size={16} />
                </button>
                <button
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="solved">Solved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
            <Filter size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No Problems Found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="primary"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
            </p>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map(problem => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProblems.map(problem => (
                  <div key={problem.id} className="bg-white rounded-lg shadow-card p-4 hover:shadow-card-hover transition-shadow duration-300">
                    <div className="flex">
                      <div className={`w-2 rounded-full mr-4 ${
                        problem.status === 'solved' 
                          ? 'bg-success-500' 
                          : problem.status === 'in-progress' 
                            ? 'bg-warning-500' 
                            : 'bg-accent-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">
                            <a href={`/problem/${problem.id}`} className="hover:text-primary-600 transition-colors">
                              {problem.title}
                            </a>
                          </h3>
                          <div className="text-xs text-gray-500">
                            {new Date(problem.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {problem.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {problem.status}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                            {problem.category}
                          </span>
                          {problem.isUrgent && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span className="truncate">{problem.location.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;