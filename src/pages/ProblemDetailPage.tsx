import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, MessageSquare, ThumbsUp, AlertTriangle, Users, Clock, HandHelping } from 'lucide-react';
import Button from '../components/common/Button';
import CommentSection from '../components/problem/CommentSection';
import AIChatBox from '../components/chat/AIChatBox';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useProblems } from '../context/ProblemContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { categoryIcons } from '../utils/categoryData';

const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProblem, upvoteProblem, offerHelp } = useProblems();
  const { user } = useAuth();
  
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offeringHelp, setOfferingHelp] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      
      try {
        const data = await getProblem(id);
        setProblem(data);
      } catch (err) {
        setError('Failed to load problem details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, [id, getProblem]);

  const handleUpvote = async () => {
    if (!id || !user) return;
    
    try {
      await upvoteProblem(id);
      setProblem({
        ...problem,
        upvotes: problem.upvotes + 1,
      });
    } catch (err) {
      setError('Failed to upvote');
    }
  };

  const handleOfferHelp = async () => {
    if (!id || !user) return;
    
    try {
      setOfferingHelp(true);
      await offerHelp(id);
      
      // Refresh problem data
      const updatedProblem = await getProblem(id);
      setProblem(updatedProblem);
    } catch (err) {
      setError('Failed to offer help');
    } finally {
      setOfferingHelp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-error-50 border border-error-200 text-error-700 p-4 rounded-md">
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              <p>{error || 'Problem not found'}</p>
            </div>
            <Link to="/problems" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
              Back to problems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the category icon
  const CategoryIcon = categoryIcons[problem.category] || AlertTriangle;

  // Check if current user is helping
  const isHelping = user && problem.helperIds?.includes(user.id);

  // Check if current user is the problem author
  const isAuthor = user && problem.userId === user.id;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Status bar */}
          <div className={`h-2 rounded-t-md ${
            problem.status === 'solved' 
              ? 'bg-success-500' 
              : problem.status === 'in-progress' 
                ? 'bg-warning-500' 
                : 'bg-accent-500'
          }`}></div>
          
          {/* Main content */}
          <div className="bg-white rounded-b-md shadow-card p-6">
            {/* Header */}
            <div className="border-b pb-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge 
                  variant={
                    problem.status === 'solved'
                      ? 'success'
                      : problem.status === 'in-progress'
                        ? 'warning'
                        : 'accent'
                  }
                  className="capitalize"
                >
                  {problem.status}
                </Badge>
                
                <Badge 
                  variant={problem.isUrgent ? 'error' : 'secondary'}
                  className="inline-flex items-center"
                >
                  <Clock size={12} className="mr-1" />
                  {problem.isUrgent ? 'Urgent' : 'Regular'}
                </Badge>
                
                <Badge className="inline-flex items-center">
                  <CategoryIcon size={12} className="mr-1" />
                  {problem.category.charAt(0).toUpperCase() + problem.category.slice(1)}
                </Badge>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-2">
                {problem.title}
              </h1>
              
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar size={14} className="mr-1" />
                <span>Posted on {formatDate(problem.createdAt)}</span>
                <span className="mx-2">•</span>
                <MapPin size={14} className="mr-1" />
                <span>{problem.location.address}</span>
              </div>
            </div>
            
            {/* Author info */}
            <div className="flex items-center mb-6">
              <Avatar 
                src={problem.user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                alt={problem.user?.name || 'User'} 
                size="md" 
              />
              <div className="ml-3">
                <p className="font-medium">{problem.user?.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-600 capitalize">{problem.user?.role || 'user'}</p>
              </div>
            </div>
            
            {/* Problem description */}
            <div className="mb-8">
              <p className="text-gray-700 whitespace-pre-line">
                {problem.description}
              </p>
            </div>
            
            {/* Images if any */}
            {problem.images && problem.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Attached Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {problem.images.map((image: string, index: number) => (
                    <div key={index} className="overflow-hidden rounded-md">
                      <img 
                        src={image} 
                        alt={`Problem image ${index + 1}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Helper info if any */}
            {problem.helpers && problem.helpers.length > 0 && (
              <div className="mb-6 p-4 bg-primary-50 rounded-md">
                <div className="flex items-center mb-3">
                  <Users size={18} className="mr-2 text-primary-600" />
                  <h3 className="text-lg font-medium">
                    {problem.helpers.length} Helper{problem.helpers.length > 1 ? 's' : ''} Assisting
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {problem.helpers.map((helper: any) => (
                    <Link key={helper.id} to={`/profile/${helper.id}`} className="flex items-center">
                      <Avatar 
                        src={helper.avatar} 
                        alt={helper.name} 
                        size="sm" 
                      />
                      <span className="ml-2 text-primary-700 hover:text-primary-800 font-medium">
                        {helper.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant="secondary"
                icon={<ThumbsUp size={16} />}
                onClick={handleUpvote}
                disabled={!user}
              >
                Upvote ({problem.upvotes})
              </Button>
              
              {user && user.role === 'helper' && !isAuthor && !isHelping && (
                <Button
                  variant="primary"
                  icon={<HandHelping size={16} />}
                  onClick={handleOfferHelp}
                  isLoading={offeringHelp}
                >
                  Offer Help
                </Button>
              )}
              
              {isHelping && (
                <Badge variant="success" className="inline-flex items-center py-2 px-3">
                  <HandHelping size={16} className="mr-1" />
                  You are helping with this problem
                </Badge>
              )}
              
              <Button
                variant="ghost"
                icon={<MessageSquare size={16} />}
                onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comments ({problem.commentCount})
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Comments section */}
              <div className="md:col-span-2" id="comments">
                <CommentSection problemId={id!} problem={problem} />
              </div>
              
              {/* AI Chat */}
              <div className="md:col-span-1">
                <AIChatBox problemId={id!} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;