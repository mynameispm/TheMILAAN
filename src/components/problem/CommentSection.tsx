import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Check, Award } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useProblems } from '../../context/ProblemContext';
import { Comment, Problem } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';

interface CommentSectionProps {
  problemId: string;
  problem: Problem;
}

const CommentSection: React.FC<CommentSectionProps> = ({ problemId, problem }) => {
  const { user } = useAuth();
  const { getComments, addComment, markAsSolution } = useProblems();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getComments(problemId);
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComments();
  }, [problemId, getComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const comment = await addComment({
        content: newComment,
        problemId,
        userId: user.id,
        isSolution: false,
      });
      
      // Add the user to the comment for display
      const commentWithUser = {
        ...comment,
        user,
      };
      
      setComments([...comments, commentWithUser]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsSolution = async (commentId: string) => {
    try {
      await markAsSolution(commentId, problemId);
      
      // Update the comment in the UI
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isSolution: true,
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
    } catch (err) {
      setError('Failed to mark as solution');
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <MessageSquare size={20} className="mr-2 text-primary-500" />
        <h3 className="text-lg font-medium">
          Comments ({comments.length})
        </h3>
      </div>
      
      {error && (
        <div className="p-2 mb-4 bg-error-50 border border-error-200 text-error-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-500">Loading comments...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map(comment => (
              <div 
                key={comment.id} 
                className={`p-4 rounded-lg ${comment.isSolution ? 'bg-success-50 border border-success-200' : 'bg-gray-50'}`}
              >
                <div className="flex">
                  {/* Avatar */}
                  <div className="mr-3">
                    <Avatar 
                      src={comment.user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                      alt={comment.user?.name || 'User'} 
                      size="md" 
                    />
                  </div>
                  
                  {/* Comment content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {comment.user?.name || 'User'}
                        </span>
                        {comment.user?.role === 'helper' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                            Helper
                          </span>
                        )}
                        {comment.isSolution && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
                            <Check size={12} className="mr-1" />
                            Solution
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    
                    <div className="text-gray-700 mb-2">
                      {comment.content}
                    </div>
                    
                    <div className="flex items-center">
                      {/* For the problem author, show solution button */}
                      {user?.id === problem.userId && !comment.isSolution && problem.status !== 'solved' && (
                        <button
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                          onClick={() => handleMarkAsSolution(comment.id)}
                        >
                          <Award size={14} className="mr-1" />
                          Mark as Solution
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <div className="flex items-start space-x-3">
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              size="md" 
            />
            <div className="flex-1 relative">
              <textarea
                className="w-full border border-gray-300 rounded-lg resize-none px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a comment..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              ></textarea>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute bottom-2 right-2"
                isLoading={isSubmitting}
                icon={<Send size={16} />}
              >
                Send
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-600 mb-2">You need to be logged in to comment</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.location.href = '/auth'}
          >
            Login to Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;