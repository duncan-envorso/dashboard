// ExcerptInput.tsx
import React from 'react'
import { Textarea } from "@/components/ui/textarea"

interface ExcerptInputProps {
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
}

const ExcerptInput: React.FC<ExcerptInputProps> = ({ excerpt, setExcerpt }) => {
  return (
    <div>
      <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt</label>
      <Textarea
        id="excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Write a short excerpt for your blog post"
        className="w-full border-primary focus:ring-primary"
        rows={3}
      />
    </div>
  )
}

export default ExcerptInput