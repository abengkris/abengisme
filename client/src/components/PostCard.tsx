import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Clock, Calendar } from "lucide-react";

interface PostCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  categoryName: string;
  readTime: number;
  createdAt: Date;
  error?: any;
}

const PostCard: React.FC<PostCardProps> = React.memo(
  ({
    title,
    slug,
    excerpt,
    featuredImage,
    categoryName,
    readTime,
    createdAt,
    error,
  }) => {
    return (
      <article className="group relative flex flex-col bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/10">
        {/* Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity z-10" />
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/images/fallback.jpg";
            }}
          />
          <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {categoryName}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-serif text-xl font-bold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
            <Link href={`/blog/${slug}`}>{title}</Link>
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
            {excerpt}
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">Error: {error.message}</p>
          )}

          {/* Metadata */}
          <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {readTime} min read
              </span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Overlay Link */}
        <Link href={`/blog/${slug}`} className="absolute inset-0">
          <span className="sr-only">Read more about {title}</span>
        </Link>
      </article>
    );
  }
);

export default PostCard;