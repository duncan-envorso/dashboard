'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2, Edit2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';

interface PreviewContentProps {
  config: {
    title: string;
    imageUrl: string;
    textColor: string;
    buttonBackground: string;
    buttonTextColor: string;
    buttonText: string;
  };
  comments: { id: number; text: string; isLiveFeed: boolean }[];
  onDeleteComment?: (id: number) => void;
  onEditComment?: (id: number, newText: string) => void;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  config,
  comments,
  onDeleteComment,
  onEditComment
}) => {
  const [editingText, setEditingText] = useState('');

  const handleDelete = (id: number) => {
    if (onDeleteComment) {
      onDeleteComment(id);
    }
  };

  const handleEdit = (id: number) => {
    if (onEditComment && editingText.trim()) {
      onEditComment(id, editingText);
      setEditingText('');
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Phone Status Bar */}
      <div className="flex items-center justify-between bg-secondary/5 px-4 py-2 text-xs text-muted-foreground">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 21.6L9 18.6H7.2C6.54 18.6 6 18.06 6 17.4V6.6C6 5.94 6.54 5.4 7.2 5.4H16.8C17.46 5.4 18 5.94 18 6.6V17.4C18 18.06 17.46 18.6 16.8 18.6H15L12 21.6Z"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 21.6C7.02 21.6 3 17.58 3 12.6C3 7.62 7.02 3.6 12 3.6C16.98 3.6 21 7.62 21 12.6C21 17.58 16.98 21.6 12 21.6ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card p-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          {config.title}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-secondary/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments Section */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card
              key={comment.id}
              className={`border-0 ${
                comment.isLiveFeed ? 'bg-primary/10' : 'bg-secondary/10'
              }`}
            >
              <CardContent className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={comment.isLiveFeed ? 'default' : 'secondary'}
                      className="h-5 text-[10px]"
                    >
                      {comment.isLiveFeed ? 'LIVE' : 'Update'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Just now
                    </span>
                  </div>
                  {!comment.isLiveFeed && (
                    <div className="flex gap-2">
                      {/* Edit Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-secondary/20"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Edit Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Update your comment below:
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              placeholder="Enter your updated comment"
                              defaultValue={comment.text}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setEditingText('')}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleEdit(comment.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Save Changes
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(comment.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-card-foreground">
                  {comment.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PreviewContent;
