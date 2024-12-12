'use client';
import { createContext, useContext, useState } from 'react';
import { Comment } from '@/types';

interface CommentContextType {
  comments: Comment[];
  addComment: (comment: string, timestamp: number) => void;
  deleteComment: (id: number) => void;
  editComment: (id: number, newText: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, text: 'Match is about to begin!', isLiveFeed: true, timestamp: 0 },
    {
      id: 2,
      text: 'Players are taking the field.',
      isLiveFeed: true,
      timestamp: 1
    }
  ]);

  const addComment = (comment: string, timestamp: number) => {
    setComments((prevComments) => [
      ...prevComments,
      {
        id: Date.now(),
        text: comment,
        isLiveFeed: false,
        timestamp
      }
    ]);
  };

  const deleteComment = (id: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  const editComment = (id: number, newText: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, text: newText } : comment
      )
    );
  };

  return (
    <CommentContext.Provider
      value={{ comments, addComment, deleteComment, editComment }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};
