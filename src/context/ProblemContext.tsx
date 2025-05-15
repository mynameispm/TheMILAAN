import React, { createContext, useContext, useState, useEffect } from 'react';
import { Problem, Comment } from '../types';
import { getProblems, getProblemById, getCommentsByProblemId } from '../services/problemService';
import { useAuth } from './AuthContext';

interface ProblemContextType {
  problems: Problem[];
  loading: boolean;
  error: string | null;
  addProblem: (problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'commentCount'>) => Promise<Problem>;
  updateProblem: (id: string, problemData: Partial<Problem>) => Promise<Problem>;
  deleteProblem: (id: string) => Promise<void>;
  getProblem: (id: string) => Promise<Problem>;
  getComments: (problemId: string) => Promise<Comment[]>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'user'>) => Promise<Comment>;
  upvoteProblem: (id: string) => Promise<void>;
  markAsSolution: (commentId: string, problemId: string) => Promise<void>;
  offerHelp: (problemId: string) => Promise<void>;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (err) {
        setError('Failed to fetch problems');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const addProblem = async (problemData: Omit<Problem, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'commentCount'>) => {
    try {
      // In a real app, this would be an API call
      const newProblem: Problem = {
        ...problemData,
        id: `problem_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        commentCount: 0,
        status: 'open',
      };
      
      setProblems(prev => [newProblem, ...prev]);
      return newProblem;
    } catch (err) {
      setError('Failed to add problem');
      throw err;
    }
  };

  const updateProblem = async (id: string, problemData: Partial<Problem>) => {
    try {
      // In a real app, this would be an API call
      const problemIndex = problems.findIndex(p => p.id === id);
      
      if (problemIndex === -1) {
        throw new Error('Problem not found');
      }
      
      const updatedProblem = {
        ...problems[problemIndex],
        ...problemData,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedProblems = [...problems];
      updatedProblems[problemIndex] = updatedProblem;
      
      setProblems(updatedProblems);
      return updatedProblem;
    } catch (err) {
      setError('Failed to update problem');
      throw err;
    }
  };

  const deleteProblem = async (id: string) => {
    try {
      // In a real app, this would be an API call
      setProblems(prev => prev.filter(problem => problem.id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      throw err;
    }
  };

  const getProblem = async (id: string) => {
    try {
      return await getProblemById(id);
    } catch (err) {
      setError('Failed to get problem');
      throw err;
    }
  };

  const getComments = async (problemId: string) => {
    try {
      return await getCommentsByProblemId(problemId);
    } catch (err) {
      setError('Failed to get comments');
      throw err;
    }
  };

  const addComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'user'>) => {
    try {
      // In a real app, this would be an API call
      const newComment: Comment = {
        ...commentData,
        id: `comment_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // Update the comment count for the problem
      const problemToUpdate = problems.find(p => p.id === commentData.problemId);
      
      if (problemToUpdate) {
        updateProblem(commentData.problemId, {
          commentCount: (problemToUpdate.commentCount || 0) + 1,
        });
      }
      
      return newComment;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    }
  };

  const upvoteProblem = async (id: string) => {
    try {
      if (!user) throw new Error('You must be logged in to upvote');
      
      const problemIndex = problems.findIndex(p => p.id === id);
      
      if (problemIndex === -1) {
        throw new Error('Problem not found');
      }
      
      const updatedProblem = {
        ...problems[problemIndex],
        upvotes: problems[problemIndex].upvotes + 1,
      };
      
      const updatedProblems = [...problems];
      updatedProblems[problemIndex] = updatedProblem;
      
      setProblems(updatedProblems);
    } catch (err) {
      setError('Failed to upvote problem');
      throw err;
    }
  };

  const markAsSolution = async (commentId: string, problemId: string) => {
    try {
      if (!user) throw new Error('You must be logged in to mark as solution');
      
      // In a real app, this would be an API call
      const problemIndex = problems.findIndex(p => p.id === problemId);
      
      if (problemIndex === -1) {
        throw new Error('Problem not found');
      }
      
      const updatedProblem = {
        ...problems[problemIndex],
        status: 'solved' as const,
      };
      
      const updatedProblems = [...problems];
      updatedProblems[problemIndex] = updatedProblem;
      
      setProblems(updatedProblems);
    } catch (err) {
      setError('Failed to mark as solution');
      throw err;
    }
  };

  const offerHelp = async (problemId: string) => {
    try {
      if (!user) throw new Error('You must be logged in to offer help');
      if (user.role !== 'helper') throw new Error('Only helpers can offer help');
      
      const problemIndex = problems.findIndex(p => p.id === problemId);
      
      if (problemIndex === -1) {
        throw new Error('Problem not found');
      }
      
      const currentProblem = problems[problemIndex];
      const helperIds = currentProblem.helperIds || [];
      
      if (helperIds.includes(user.id)) {
        throw new Error('You are already helping with this problem');
      }
      
      const updatedProblem = {
        ...currentProblem,
        status: currentProblem.status === 'open' ? 'in-progress' as const : currentProblem.status,
        helperIds: [...helperIds, user.id],
      };
      
      const updatedProblems = [...problems];
      updatedProblems[problemIndex] = updatedProblem;
      
      setProblems(updatedProblems);
    } catch (err) {
      setError('Failed to offer help');
      throw err;
    }
  };

  return (
    <ProblemContext.Provider
      value={{
        problems,
        loading,
        error,
        addProblem,
        updateProblem,
        deleteProblem,
        getProblem,
        getComments,
        addComment,
        upvoteProblem,
        markAsSolution,
        offerHelp,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblems must be used within a ProblemProvider');
  }
  return context;
};