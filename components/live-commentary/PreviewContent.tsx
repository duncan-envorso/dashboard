import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import Image from 'next/image'

interface PreviewContentProps {
  config: {
    title: string
    imageUrl: string
    textColor: string
    buttonBackground: string
    buttonTextColor: string
    buttonText: string
  }
  comments: { id: number; text: string; isLiveFeed: boolean }[]
}

const PreviewContent: React.FC<PreviewContentProps> = ({ config, comments }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 absolute inset-4 flex flex-col">
    <button className="self-end mb-2">
      <X size={20} />
    </button>
    <h3 className="text-lg font-bold mb-2" style={{ color: config.textColor }}>{config.title}</h3>
   
    <ScrollArea className="flex-grow">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className={`mb-2 p-2 rounded-lg text-sm ${
            comment.isLiveFeed 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}
        >
          <p>{comment.text}</p>
        </div>
      ))}
    </ScrollArea>
  </div>
)

export default PreviewContent
