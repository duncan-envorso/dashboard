'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MetaFieldsProps {
  metaDescription: string;
  setMetaDescription: (value: string) => void;
  metaTags: string[];
  setMetaTags: (tags: string[]) => void;
}

export const MetaFields: React.FC<MetaFieldsProps> = ({
  metaDescription,
  setMetaDescription,
  metaTags,
  setMetaTags
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setMetaTags([...metaTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setMetaTags(metaTags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Meta Description</label>
        <Textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Enter meta description for SEO"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Meta Tags</label>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type tag and press Enter"
          className="mt-1"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {metaTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
