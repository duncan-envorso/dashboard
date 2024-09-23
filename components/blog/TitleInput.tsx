// TitleInput.tsx
import React from 'react'
import { Input } from "@/components/ui/input"

const TitleInput = ({ title, setTitle }: { title: string, setTitle: (title: string) => void }) => (
  <div>
    <label htmlFor="title" className="block text-sm font-medium mb-1"></label>
    <Input
      id="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter your blog post title"
      className="w-full border-primary focus:ring-primary"
    />
  </div>
)

export default TitleInput