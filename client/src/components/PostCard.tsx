import React from 'react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

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
    <article className="relative group flex flex-col overflow-hidden transition-all duration-300 bg-card rounded-2xl shadow-sm hover:shadow-xl border border-border">
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-block px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium text-accent rounded-full shadow-sm">
          {categoryName}
        </span>
      </div>

      {/* Image Container with Gradient Overlay */}
      <div className="relative overflow-hidden h-56">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-50 transition-opacity z-[1]"></div>
        <img
          src={featuredImage}
          alt={`Featured image for ${title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          width="400"
          height="200"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = '/images/fallback.jpg';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Title */}
        <h3 className="font-serif text-xl font-bold mb-3 leading-tight group-hover:text-accent transition-colors">
          <Link href={`/blog/${slug}`} className="block">
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-5 text-sm line-clamp-2 flex-grow">
          {excerpt}
        </p>

        {/* Footer Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>{readTime} min read</span>
          </div>

          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Read More Link (Shown on Hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <Link href={`/blog/${slug}`} className="inline-flex items-center justify-center w-full py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors">
          Read Article
        </Link>
      </div>
    </article>
  );
};

export default PostCard;