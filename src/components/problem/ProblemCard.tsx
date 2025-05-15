import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Problem } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';
import { categoryIcons } from '../../utils/categoryData';

interface ProblemCardProps {
  problem: Problem;
  className?: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, className = '' }) => {
  // Get the icon component for the category
  const CategoryIcon = categoryIcons[problem.category] || AlertTriangle;

  return (
    <Link to={`/problem/${problem.id}`} className={`block ${className}`}>
      <Card 
        hoverable 
        className="h-full transition-all duration-300 hover:translate-y-[-4px]"
      >
        {/* Status indicator */}
        <div className={`h-1 ${
          problem.status === 'solved' 
            ? 'bg-success-500' 
            : problem.status === 'in-progress' 
              ? 'bg-warning-500' 
              : 'bg-accent-500'
        }`} />
        
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                problem.status === 'solved'
                  ? 'bg-success-100 text-success-600'
                  : problem.status === 'in-progress'
                    ? 'bg-warning-100 text-warning-600'
                    : 'bg-accent-100 text-accent-600'
              }`}>
                <CategoryIcon size={16} />
              </div>
              <Badge 
                variant={
                  problem.status === 'solved'
                    ? 'success'
                    : problem.status === 'in-progress'
                      ? 'warning'
                      : 'accent'
                }
                className="ml-2 capitalize"
              >
                {problem.status}
              </Badge>
              {problem.isUrgent && (
                <Badge variant="error" className="ml-2">
                  Urgent
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{formatTimeAgo(problem.createdAt)}</span>
            </div>
          </div>
          
          {/* Title & Description */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {problem.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {problem.description}
          </p>
          
          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{problem.location.address}</span>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center">
              {problem.user ? (
                <div className="flex items-center">
                  <Avatar 
                    src={problem.user.avatar} 
                    alt={problem.user.name} 
                    size="xs" 
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {problem.user.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-600">Anonymous</span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center text-gray-500 mr-3">
                <ThumbsUp size={14} className="mr-1" />
                <span className="text-xs">{problem.upvotes}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MessageSquare size={14} className="mr-1" />
                <span className="text-xs">{problem.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProblemCard;