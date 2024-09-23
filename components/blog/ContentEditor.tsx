import React from 'react'
import { EditorContent } from '@tiptap/react'
import EditorToolbar from './EditorToolbar'

interface ContentEditorProps {
  editor: any; 
  addImage: () => void;
  wordCount: number;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ editor, addImage, wordCount }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
      <div className="border border-primary rounded-md overflow-hidden flex-grow flex flex-col">
        <EditorToolbar editor={editor} addImage={addImage} />
        <div className="flex-grow overflow-y-auto">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-4 min-h-full"
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Word count: {wordCount}
      </div>
    </div>
  )
}

export default ContentEditor