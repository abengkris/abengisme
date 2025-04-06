import React from 'react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  categoryName: string;
  readTime: number;
  createdAt: Date;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  slug,
  excerpt,
  featuredImage,
  categoryName,
  readTime,
  createdAt
}) => {
  return (
    <article className="post-card bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200">
      <img 
        src={featuredImage} 
        alt={title}
        className="w-full h-48 object-cover"
        width="400"
        height="200"
      />
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-xs font-medium text-accent uppercase tracking-wider">{categoryName}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{readTime} min read</span>
        </div>
        <h3 className="font-serif text-lg font-bold mb-2 hover:text-accent transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{excerpt}</p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </article>
  );
};

export default PostCard;
