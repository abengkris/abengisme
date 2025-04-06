import React from 'react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';

interface FeaturedPostCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  categoryName: string;
  readTime: number;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({
  title,
  slug,
  excerpt,
  featuredImage,
  categoryName,
  readTime,
  authorName,
  authorAvatar,
  createdAt
}) => {
  return (
    <article className="post-card bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200">
      <img 
        src={featuredImage} 
        alt={title}
        className="w-full h-48 object-cover"
        width="600"
        height="300"
      />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-xs font-medium text-accent uppercase tracking-wider">{categoryName}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{readTime} min read</span>
        </div>
        <h3 className="font-serif text-xl font-bold mb-3 hover:text-accent transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <img className="h-10 w-10 rounded-full" src={authorAvatar} alt={authorName} width="40" height="40" />
          </div>
          <div>
            <p className="text-sm font-medium">{authorName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPostCard;
