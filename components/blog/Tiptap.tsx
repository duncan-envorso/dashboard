/* eslint-disable no-console */
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Eye, Upload } from 'lucide-react'
import TitleInput from './TitleInput'
import FeaturedImageUpload from './FeaturedImageUpload'
import ExcerptInput from './ExcerptInput'
import ContentEditor from './ContentEditor'
import PreviewContent from './PreviewContent'
import { BlogPost } from '@/types'



interface BlogEditorProps {
  post?: BlogPost;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post }) => {
  const [title, setTitle] = useState(post?.title || '')
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [wordCount, setWordCount] = useState(0)
  const [activeTab, setActiveTab] = useState('edit')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image,
    ],
    content: post?.content || '<p>Start writing your blog post here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const words = editor.getText().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    },
  })

  const addImage = useCallback(() => {
    if (editor) {
      const url = window.prompt('Enter the URL of the image:')
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
  }, [editor])

  useEffect(() => {
    const saveDraft = () => {
      if (editor) {
        const content = editor.getHTML()
        console.log(content)
        localStorage.setItem('blogDraft', JSON.stringify({ title, content, featuredImage, excerpt }))
      }
    }

    const interval = setInterval(saveDraft, 30000) // Save every 30 seconds

    return () => clearInterval(interval)
  }, [editor, title, featuredImage, excerpt])

  const handleSubmit = async () => {
    if (editor) {
      setIsSaving(true)
      const content = editor.getHTML()
    
      const postData: Partial<BlogPost> = { 
        id: post?.id,
        title, 
        content, 
        featuredImage, 
        excerpt,
        author: post?.author || 'Anonymous',
        status: post?.status || 'draft',
        createdAt: post?.createdAt || new Date().toISOString(),
      }

      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (post?.id) {
          console.log('Updating post:', postData)
        } else {
          console.log('Creating new post:', postData)
        }
       
        router.push('/dashboard/news-articles')
      } catch (error) {
        console.error('Error saving post:', error)
        alert('Failed to save the post. Please try again.')
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (!editor) {
    return null
  }

  return (
    <Card className="w-full max-w-7xl mx-auto h-screen overflow-hidden  border-none  hover-lift transition-smooth">
      <CardContent className="p-6 h-full flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted">
              <TabsTrigger 
                value="edit" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth"
              >
                Edit
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => console.log('Saving draft...')} 
                className="transition-smooth hover-lift active-shrink text-primary hover:bg-primary/10"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="btn-gradient active-shrink transition-smooth"
                disabled={isSaving}
                variant='expandIcon'
              >
                {isSaving ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {post?.id ? 'Update Post' : 'Publish Post'}
                  </>
                )}
              </Button>
            </div>
          </div>
          <TabsContent value="edit" className="space-y-4 flex-grow flex flex-col overflow-hidden text-foreground">
            <div className="space-y-4 overflow-y-auto flex-grow p-4 bg-card rounded-md">
              <TitleInput title={title} setTitle={setTitle} />
              <FeaturedImageUpload featuredImage={featuredImage} setFeaturedImage={setFeaturedImage} />
              <ExcerptInput excerpt={excerpt} setExcerpt={setExcerpt} />
              <ContentEditor editor={editor} addImage={addImage} wordCount={wordCount} />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="overflow-y-auto flex-grow bg-card rounded-md p-4">
            <PreviewContent title={title} featuredImage={featuredImage} excerpt={excerpt} content={editor.getHTML()} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default BlogEditor