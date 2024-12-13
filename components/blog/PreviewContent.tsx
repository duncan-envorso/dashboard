import Image from 'next/image';
import React from 'react';
import { ArticleType } from '@/types/newsarticle';

interface PreviewContentProps {
  title: string;
  featuredImage: string;
  content: string;
  type: ArticleType;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  title,
  featuredImage,
  content,
  type
}) => {
  const getTypeLabel = (type: ArticleType) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none text-black">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {getTypeLabel(type)}
        </span>
      </div>
      <h1>{title}</h1>
      {featuredImage && (
        <div className="relative mb-4 h-64 w-full">
          <Image
            src={featuredImage}
            alt={title}
            className="rounded-lg object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default PreviewContent;
