// FeaturedImageUpload.tsx
import React from 'react'
import { Input } from "@/components/ui/input"
import { Image } from '@radix-ui/react-avatar'

const FeaturedImageUpload = ({ featuredImage, setFeaturedImage }: { featuredImage: string, setFeaturedImage: (image: string) => void }) => {
  const handleFeaturedImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <label htmlFor="featuredImage" className="block text-sm font-medium mb-1">Featured Image</label>
      <div className="flex items-center space-x-2">
        <Input
          id="featuredImage"
          type="file"
          accept="image/*"
          onChange={handleFeaturedImageUpload}
          className="border-primary focus:ring-primary"
        />
        {featuredImage && (
          <Image src={featuredImage} alt="Featured" className="h-20 w-20 object-cover rounded" />
        )}
      </div>
    </div>
  )
}

export default FeaturedImageUpload