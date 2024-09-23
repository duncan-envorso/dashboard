// PreviewContent.tsx
import Image from 'next/image';
import React from 'react'

interface PreviewContentProps {
  title: string;
  featuredImage: string;
  excerpt: string;
  content: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({ title, featuredImage, excerpt, content }) => {
  return (
    <div className="prose prose-sm sm:prose text-black lg:prose-lg xl:prose-2xl max-w-none">
      <h1>{title}</h1>
      {featuredImage && <Image src={featuredImage} alt="Featured" className="w-full h-64 object-cover rounded-lg mb-4" />}
      <p className="text-lg font-semibold">{excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export default PreviewContent