import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LayoutTemplate, Image, MessageSquare } from "lucide-react"

interface LayoutProps {
  layout: string
  setLayout: (layout: 'modal' | 'image' | 'toast') => void
}

export default function Component({ layout, setLayout }: LayoutProps) {
  const layouts = [
    { type: 'modal', icon: MessageSquare, label: 'Modal' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'toast', icon: LayoutTemplate, label: 'Toast' },
  ]

  return (
    <RadioGroup
      defaultValue={layout}
      onValueChange={setLayout}
      className="flex flex-wrap gap-4"
    >
      {layouts.map(({ type, icon: Icon, label }) => (
        <div key={type} className="flex items-center space-x-2">
          <RadioGroupItem value={type} id={type} className="peer sr-only" />
          <Label
            htmlFor={type}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Icon className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">{label}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}