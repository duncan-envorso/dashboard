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
import { Save, Eye, Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import TitleInput from './TitleInput'
import FeaturedImageUpload from './FeaturedImageUpload'
import ExcerptInput from './ExcerptInput'
import ContentEditor from './ContentEditor'
import PreviewContent from './PreviewContent'
import { BlogPost } from '@/types'

interface BlogEditorProps {
  post?: BlogPost;
  goBack: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post, goBack }) => {
  const [title, setTitle] = useState(post?.title || '')
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [wordCount, setWordCount] = useState(0)
  const [activeTab, setActiveTab] = useState('edit')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] }), Highlight, Image],
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

  if (!editor) return null

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Card className="w-full p-6 mx-auto shadow-sm bg-white">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-white p-4 border-b">
            <Button
              onClick={goBack}
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Saving draft...')}
                className="transition-colors duration-200 hover:bg-primary/10"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : (post?.id ? 'Update Post' : 'Publish Post')}
              </Button>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center px-4 py-2 ">
              <TabsList>
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Preview
                </TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                {wordCount} words
              </div>
            </div>
            <div className="p-4">
              <TabsContent value="edit" className="space-y-4">
                <TitleInput title={title} setTitle={setTitle} />
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <FeaturedImageUpload featuredImage={featuredImage} setFeaturedImage={setFeaturedImage} />
                  </div>
                  <div className="flex-1">
                    <ExcerptInput excerpt={excerpt} setExcerpt={setExcerpt} />
                  </div>
                </div>
                <ContentEditor editor={editor} addImage={addImage} wordCount={0} />
              </TabsContent>
              <TabsContent value="preview">
                <PreviewContent title={title} featuredImage={featuredImage} excerpt={excerpt} content={editor.getHTML()} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogEditor