import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryButtonProps {
  name: string;
  isActive?: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  name,
  isActive = false,
  onClick
}) => {
  return (
    <button
      className={cn(
        "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
        isActive
          ? "bg-accent text-white"
          : "bg-secondary hover:bg-neutral-200 text-foreground"
      )}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default CategoryButton;
