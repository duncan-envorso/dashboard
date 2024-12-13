import React from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface FeaturedImageUploadProps {
  featuredImage: string;
  setFeaturedImage: (image: string) => void;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({
  featuredImage,
  setFeaturedImage
}) => {
  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturedImage(event.target.value);
  };

  return (
    <div>
      <label htmlFor="featuredImage" className="mb-1 block text-sm font-medium">
        Featured Image URL
      </label>
      <div className="space-y-2">
        <Input
          id="featuredImage"
          type="url"
          value={featuredImage}
          onChange={handleImageUrlChange}
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          className="border-primary focus:ring-primary"
        />

        {featuredImage && (
          <div className="relative h-40 w-40">
            <Image
              src={featuredImage}
              alt="Featured"
              fill
              className="rounded object-cover"
              onError={() => {
                setFeaturedImage('');
                alert('Invalid image URL. Please check the URL and try again.');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedImageUpload;
