import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Info } from 'lucide-react';
import ProblemForm from '../components/problem/ProblemForm';
import { useAuth } from '../context/AuthContext';

const PostProblemPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Post a Problem</h1>
          <p className="text-gray-600 mb-8">
            Share your problem with the community to find helpers and solutions
          </p>
          
          {!isAuthenticated ? (
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <HelpCircle size={48} className="mx-auto text-primary-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Sign in to Post a Problem
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to post problems and connect with helpers
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Link 
                  to="/auth" 
                  className="btn-primary"
                >
                  Login
                </Link>
                <Link 
                  to="/auth?tab=register" 
                  className="btn-secondary"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : user?.role === 'helper' ? (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 text-center">
              <Info size={48} className="mx-auto text-warning-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Helper Account Detected
              </h2>
              <p className="text-gray-700 mb-4">
                You're currently logged in as a helper. Only problem askers can post problems. If you need to post a problem, please create a problem asker account.
              </p>
              <div className="flex justify-center">
                <Link 
                  to="/problems" 
                  className="btn-primary"
                >
                  Browse Problems
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-card p-6">
              <ProblemForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostProblemPage;