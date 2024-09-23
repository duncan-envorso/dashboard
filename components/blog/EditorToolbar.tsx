// EditorToolbar.tsx
import React from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Pilcrow, Strikethrough,
  Highlighter, Image as ImageIcon
} from 'lucide-react'

const EditorToolbar = ({ editor, addImage }: { editor: any; addImage: () => void }) => {
  if (!editor) {
    return null
  }

  const ToolbarButton = ({ onClick, isActive, icon, tooltip }: any) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const toolbarGroups = [
    [
      { icon: <Heading1 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }), tooltip: 'Heading 1' },
      { icon: <Heading2 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }), tooltip: 'Heading 2' },
      { icon: <Heading3 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }), tooltip: 'Heading 3' },
      { icon: <Pilcrow className="h-4 w-4" />, action: () => editor.chain().focus().setParagraph().run(), isActive: () => editor.isActive('paragraph'), tooltip: 'Paragraph' },
    ],
    [
      { icon: <Bold className="h-4 w-4" />, action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold'), tooltip: 'Bold' },
      { icon: <Italic className="h-4 w-4" />, action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic'), tooltip: 'Italic' },
      { icon: <UnderlineIcon className="h-4 w-4" />, action: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline'), tooltip: 'Underline' },
      { icon: <Strikethrough className="h-4 w-4" />, action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive('strike'), tooltip: 'Strikethrough' },
      { icon: <Highlighter className="h-4 w-4" />, action: () => editor.chain().focus().toggleHighlight().run(), isActive: () => editor.isActive('highlight'), tooltip: 'Highlight' },
    ],
    [
      { icon: <List className="h-4 w-4" />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive('bulletList'), tooltip: 'Bullet List' },
      { icon: <ListOrdered className="h-4 w-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList'), tooltip: 'Ordered List' },
    ],
    [
      { icon: <AlignLeft className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('left').run(), isActive: () => editor.isActive({ textAlign: 'left' }), tooltip: 'Align Left' },
      { icon: <AlignCenter className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('center').run(), isActive: () => editor.isActive({ textAlign: 'center' }), tooltip: 'Align Center' },
      { icon: <AlignRight className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('right').run(), isActive: () => editor.isActive({ textAlign: 'right' }), tooltip: 'Align Right' },
      { icon: <AlignJustify className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('justify').run(), isActive: () => editor.isActive({ textAlign: 'justify' }), tooltip: 'Justify' },
    ],
    [
      { icon: <ImageIcon className="h-4 w-4" />, action: addImage, isActive: () => false, tooltip: 'Add Image' },
    ],
  ]

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-t-md">
      {toolbarGroups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {group.map((item, itemIndex) => (
            <ToolbarButton
              key={itemIndex}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                item.action()
                editor.commands.focus()
              }}
              isActive={item.isActive()}
              icon={item.icon}
              tooltip={item.tooltip}
            />
          ))}
          {groupIndex < toolbarGroups.length - 1 && <div className="w-px h-6 bg-border mx-1" />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default EditorToolbar