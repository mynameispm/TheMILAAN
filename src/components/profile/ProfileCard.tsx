import React from 'react';
import { User as UserIcon, MapPin, Calendar, Award, MessageSquare, ThumbsUp, HelpCircle } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { User } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ProfileCardProps {
  user: User;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  isOwnProfile = false,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
      
      <div className="px-6 pb-6">
        {/* Avatar and basic info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-4">
          <Avatar 
            src={user.avatar} 
            alt={user.name}
            size="xl"
            className="ring-4 ring-white"
          />
          <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
          
          {isOwnProfile && (
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              <Button 
                variant="secondary"
                size="sm"
                onClick={onEdit}
                icon={<UserIcon size={16} />}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
        
        {/* User details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <MapPin size={16} className="mt-1 mr-2 flex-shrink-0 text-gray-500" />
            <p className="text-gray-700">{user.location.address}</p>
          </div>
          
          <div className="flex items-start">
            <Calendar size={16} className="mt-1 mr-2 flex-shrink-0 text-gray-500" />
            <p className="text-gray-700">Member since {formatDate(user.createdAt)}</p>
          </div>
          
          {user.role === 'helper' && (
            <div className="flex items-start">
              <Award size={16} className="mt-1 mr-2 flex-shrink-0 text-gray-500" />
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">{user.helpCount}</span> problems helped
                </p>
                {user.rating && (
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(user.rating) ? 'currentColor' : 'none'} stroke="currentColor" className={`w-4 h-4 ${i < Math.floor(user.rating) ? 'text-warning-500' : 'text-gray-300'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-700">{user.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {user.role === 'asker' && user.problemCount !== undefined && (
            <div className="flex items-start">
              <HelpCircle size={16} className="mt-1 mr-2 flex-shrink-0 text-gray-500" />
              <p className="text-gray-700">
                <span className="font-medium">{user.problemCount}</span> problems posted
              </p>
            </div>
          )}
        </div>
        
        {/* Bio */}
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">About</h3>
          <p className="text-gray-700">{user.bio}</p>
        </div>
        
        {/* Action buttons */}
        {!isOwnProfile && (
          <div className="mt-6 flex space-x-3">
            <Button
              variant="primary"
              className="flex-1"
              icon={<MessageSquare size={16} />}
            >
              Message
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              icon={<ThumbsUp size={16} />}
            >
              Recommend
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;