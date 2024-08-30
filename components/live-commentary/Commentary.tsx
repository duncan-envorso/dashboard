'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircleIcon, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog'

interface CommentaryProps {
    onAddComment: (comment: string) => void
}

export default function Commentary({ onAddComment }: CommentaryProps) {
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState("");

    const handleSend = () => {
        if (newComment.trim() !== "") {
            onAddComment(newComment);
            setNewComment("");
            setError("");
        } else {
            setError("Please enter a comment before adding.");
        }
    };

    return (
        <div className="rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Add Commentary</h2>
            <div className="space-y-4">
                <Textarea
                    placeholder="Enter your commentary here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                />
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{newComment.length}/280 characters</span>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={newComment.trim() === ""}>
                                <PlusCircleIcon className="w-4 h-4 mr-2" />
                                Add Comment
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                   Are you sure you want to publish this comment
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSend}>Add Comment</AlertDialogAction>
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