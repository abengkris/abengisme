import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (!items.length) return null;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 text-sm">
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" aria-hidden="true" />
            )}
            {index === items.length - 1 ? (
              <span className="text-muted-foreground" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;