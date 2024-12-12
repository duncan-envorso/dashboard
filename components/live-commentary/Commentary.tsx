'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircleIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface CommentaryProps {
  onAddComment: (comment: string, timestamp: number) => void;
}

export default function Commentary({ onAddComment }: CommentaryProps) {
  const [newComment, setNewComment] = useState('');
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Generate array of numbers from -3 to 95
  const timeOptions = Array.from({ length: 99 }, (_, i) => i - 3);

  const handleSend = () => {
    if (newComment.trim() === '') {
      setError('Please enter a comment before adding.');
      return;
    }

    if (timestamp === null) {
      setError('Please select a timestamp.');
      return;
    }

    onAddComment(newComment, timestamp);
    setNewComment('');
    setTimestamp(null);
    setError('');
  };

  return (
    <div className="rounded-lg p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Add Commentary</h2>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your commentary here..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <Select
          value={timestamp?.toString()}
          onValueChange={(value) => setTimestamp(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timestamp" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time.toString()}>
                {time < 0
                  ? `${Math.abs(time)} minutes before`
                  : time === 0
                  ? 'Start'
                  : `${time}th minute`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {newComment.length}/280 characters
          </span>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={newComment.trim() === '' || timestamp === null}>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish this comment at{' '}
                  {timestamp !== null &&
                    (timestamp < 0
                      ? `${Math.abs(timestamp)} minutes before`
                      : timestamp === 0
                      ? 'start'
                      : `${timestamp} minutes after`)}
                  ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSend}>
                  Add Comment
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
