import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Paintbrush } from "lucide-react"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="expandIcon"
            className="w-full justify-start text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: value }}
              />
              <span className="flex-grow">{value}</span>
              <Paintbrush className="h-4 w-4 text-gray-500" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Pick a color</h4>
              <p className="text-sm text-muted-foreground">
                Choose your desired color using the color picker below.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id={label}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-10 cursor-pointer overflow-hidden rounded-md border border-input p-0"
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-grow"
                placeholder="#000000"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}