// /live-commentary


'use client'

import Commentary from '@/components/live-commentary/Commentary'
import DevicePreview from '@/components/live-commentary/DevicePreview'
import CommentaryHeader from '@/components/live-commentary/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'

interface Comment {
  id: number
  text: string
  isLiveFeed: boolean
}

interface MessageConfig {
  layout: 'Modal'
  title: string
  imageUrl: string
  buttonText: string
  textColor: string
  buttonBackground: string
  buttonTextColor: string
}

const initialConfig: MessageConfig = {
  layout: 'Modal',
  title: 'Live Rugby Match',
  imageUrl: '/placeholder.svg?height=300&width=400',
  buttonText: 'Watch Now',
  textColor: '#000000',
  buttonBackground: '#4CAF50',
  buttonTextColor: '#FFFFFF'
}

export default function Component() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, text: "Match is about to begin!", isLiveFeed: true },
    { id: 2, text: "Players are taking the field.", isLiveFeed: true },
  ])
  const [config, setConfig] = useState<MessageConfig>(initialConfig)
  const [deviceType, setDeviceType] = useState<'phone' | 'Horisontal'>('phone')

  const addComment = (comment: string) => {
    setComments([...comments, { id: comments.length + 1, text: comment, isLiveFeed: false }])
  }

  return (
    <div className="flex flex-col h-screen">
    <CommentaryHeader />
    <div className="flex-grow overflow-auto">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Match Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <DevicePreview
              deviceType={deviceType}
              setDeviceType={setDeviceType}
              config={config}
              comments={comments}
            />
          </CardContent>
        </Card>
      </div>
    </div>
    <div className="bg-background border-t">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Add Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            <Commentary onAddComment={addComment} />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  )
}