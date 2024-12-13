import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Eye, Upload, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TitleInput from './TitleInput';
import FeaturedImageUpload from './FeaturedImageUpload';
import ContentEditor from './ContentEditor';
import PreviewContent from './PreviewContent';
import {
  Article,
  ArticleType,
  CreateArticleResponse
} from '@/types/newsarticle';

interface BlogEditorProps {
  post?: Article;
  goBack: () => void;
  teamId: string;
  onDraftChange?: (hasDraft: boolean) => void;
  token: string;
}

const API_BASE_URL = 'https://api.seawolves.envorso.com/v1';

const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  goBack,
  teamId,
  token
}) => {
  const [title, setTitle] = useState(post?.title || '');
  const [image, setImage] = useState(post?.image || '');
  const [type, setType] = useState<ArticleType>(post?.type || 'news');
  const [wordCount, setWordCount] = useState(0);
  const [activeTab, setActiveTab] = useState('edit');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Image
    ],
    content: post?.text || '<p>Start writing your article here...</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      const words = editor
        .getText()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  });

  const addImage = useCallback(() => {
    if (editor) {
      const url = window.prompt('Enter the URL of the image:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }, [editor]);

  useEffect(() => {
    const saveDraft = () => {
      if (editor) {
        const content = editor.getHTML();
        localStorage.setItem(
          'articleDraft',
          JSON.stringify({ title, content, image, type })
        );
        toast({
          description: 'Draft saved automatically',
          duration: 2000
        });
      }
    };
    const interval = setInterval(saveDraft, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [editor, title, image, type, toast]);

  const handleSubmit = async () => {
    if (!editor || !title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please provide a title for your article'
      });
      return;
    }

    setIsSaving(true);
    const articleData = {
      team_id: teamId,
      title: title.trim(),
      text: editor.getHTML(),
      image,
      type,
      date_posted: post?.date_posted || new Date().toISOString(),
      guid: post?.guid || crypto.randomUUID()
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/articles${post?.id ? `/${post.id}` : ''}`,
        {
          method: post?.id ? 'PUT' : 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(articleData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: CreateArticleResponse = await response.json();

      // Clear draft after successful save
      localStorage.removeItem('articleDraft');

      toast({
        title: 'Success!',
        description: post?.id
          ? 'Article updated successfully'
          : 'Article published successfully'
      });

      router.push('/dashboard/news-articles');
    } catch (error) {
      console.error('Error saving article:', error);

      let errorMessage = 'Failed to save the article. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('413')) {
          errorMessage =
            'Article content is too large. Please reduce the size or remove some images.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Your session has expired. Please log in again.';
          router.push('/auth/login');
        }
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Card className="mx-auto w-full bg-white p-6 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b bg-white p-4">
            <Button
              onClick={goBack}
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ArticleType)}
                className="rounded-md border px-3 py-2"
              >
                <option value="news">News</option>
                <option value="match_report">Match Report</option>
                <option value="announcement">Announcement</option>
                <option value="press_release">Press Release</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editor) {
                    const content = editor.getHTML();
                    localStorage.setItem(
                      'articleDraft',
                      JSON.stringify({ title, content, image, type })
                    );
                    toast({
                      description: 'Draft saved successfully'
                    });
                  }
                }}
                className="transition-colors duration-200 hover:bg-primary/10"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {isSaving
                  ? 'Saving...'
                  : post?.id
                  ? 'Update Article'
                  : 'Publish Article'}
              </Button>
            </div>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between px-4 py-2">
              <TabsList>
                <TabsTrigger
                  value="edit"
                  className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
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
                <FeaturedImageUpload
                  featuredImage={image}
                  setFeaturedImage={setImage}
                />
                <ContentEditor
                  editor={editor}
                  addImage={addImage}
                  wordCount={wordCount}
                />
              </TabsContent>
              <TabsContent value="preview">
                <PreviewContent
                  title={title}
                  featuredImage={image}
                  content={editor.getHTML()}
                  type={type}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditor;
