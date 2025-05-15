import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import ProfileCard from '../components/profile/ProfileCard';
import { User } from '../types';
import { getUserById } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If no ID is provided or it matches current user, show current user's profile
        if (!id && currentUser) {
          setUser(currentUser);
        } else if (id) {
          const userData = await getUserById(id);
          setUser(userData);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id, currentUser]);

  const isOwnProfile = currentUser && (!id || id === currentUser.id);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-error-50 border border-error-200 text-error-700 p-4 rounded-md">
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              <p>{error || 'User not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ProfileCard
            user={user}
            isOwnProfile={isOwnProfile}
            onEdit={() => console.log('Edit profile')}
          />
          
          {/* Additional profile content could go here */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Activity or problems section */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {user.role === 'helper' ? 'Problems Helped' : 'My Problems'}
                </h2>
                <p className="text-gray-600">
                  No {user.role === 'helper' ? 'problems helped' : 'problems posted'} yet.
                </p>
              </div>
              
              {/* Reviews/Feedback section for helpers */}
              {user.role === 'helper' && (
                <div className="bg-white rounded-lg shadow-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Feedback & Reviews</h2>
                  <p className="text-gray-600">No reviews yet.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Skills/Expertise for helpers */}
              {user.role === 'helper' && (
                <div className="bg-white rounded-lg shadow-card p-6">
                  <h2 className="text-lg font-semibold mb-3">Areas of Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Community Development
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Education
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Disaster Relief
                    </span>
                  </div>
                </div>
              )}
              
              {/* Stats */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-lg font-semibold mb-3">Stats</h2>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </li>
                  {user.role === 'helper' ? (
                    <>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Problems Helped:</span>
                        <span className="font-medium">{user.helpCount || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium">95%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium">~2 hours</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Problems Posted:</span>
                        <span className="font-medium">{user.problemCount || 0}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Problems Solved:</span>
                        <span className="font-medium">0</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;