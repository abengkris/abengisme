import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import PostCard from '@/components/PostCard';
import CategoryButton from '@/components/CategoryButton';
import Pagination from '@/components/Pagination';
import AdContainer from '@/components/ads/AdContainer';
import { useAllPosts, useAllCategories, usePostsByCategory } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 6;

const Blog: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const allPostsQuery = useAllPosts();
  const categoriesQuery = useAllCategories();
  const postsByCategoryQuery = usePostsByCategory(activeCategoryId);

  // Determine which posts to display based on category selection
  const postsQuery = activeCategoryId ? postsByCategoryQuery : allPostsQuery;

  // When posts or search query changes, filter and update the filtered posts
  useEffect(() => {
    if (postsQuery.data) {
      const filtered = postsQuery.data.filter(post => {
        const searchTerms = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchTerms) || 
          post.excerpt.toLowerCase().includes(searchTerms)
        );
      });
      setFilteredPosts(filtered);
      setCurrentPage(1); // Reset to first page on new search or category
    }
  }, [postsQuery.data, searchQuery]);

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    if (!categoriesQuery.data) return '';
    const category = categoriesQuery.data.find(cat => cat.id === categoryId);
    return category?.name || '';
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE, 
    currentPage * POSTS_PER_PAGE
  );

  // Handle category change
  const handleCategoryClick = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
    setSearchQuery('');
  };

  // Loading state
  const isLoading = postsQuery.isLoading || categoriesQuery.isLoading;

  const LoadingPosts = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200">
          <Skeleton className="w-full h-48" />
          <div className="p-5">
            <div className="flex items-center mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4 mx-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-4/5 mb-4" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) return <LoadingPosts />;


  return (
    <>
      <SEO 
        title="Blog"
        description="Explore articles on design, technology, productivity, and mindful living."
        keywords="blog, articles, design, technology, mindfulness, productivity"
      />

      <section className="py-12 md:py-16 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Blog</h1>
                <p className="text-muted-foreground">
                  Fresh perspectives on design, technology, and mindful living
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-muted-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              <CategoryButton
                name="All"
                isActive={activeCategoryId === null}
                onClick={() => handleCategoryClick(null)}
              />

              {isLoading ? (
                // Category skeletons
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-24 h-8 rounded-full" />
                ))
              ) : (
                categoriesQuery.data?.map(category => (
                  <CategoryButton
                    key={category.id}
                    name={category.name}
                    isActive={activeCategoryId === category.id}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content - Blog Post Grid */}
              <div className="lg:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {isLoading ? (
                    // Post skeletons
                    <LoadingPosts />
                  ) : filteredPosts.length > 0 ? (
                    currentPosts.map(post => (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        slug={post.slug}
                        excerpt={post.excerpt}
                        featuredImage={post.featuredImage}
                        categoryName={getCategoryName(post.categoryId)}
                        readTime={post.readTime}
                        createdAt={new Date(post.createdAt)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-muted-foreground">No posts found. Try a different search or category.</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/4 space-y-8">
                {/* Ad in sidebar */}
                <div className="rounded-lg overflow-hidden border border-neutral-100 p-4 bg-slate-50/50">
                  <h3 className="text-lg font-semibold mb-4 font-serif">Sponsored</h3>
                  <AdContainer position="sidebar" />
                </div>

                {/* Popular categories */}
                <div className="rounded-lg overflow-hidden border border-neutral-100 p-4">
                  <h3 className="text-lg font-semibold mb-4 font-serif">Popular Categories</h3>
                  {!isLoading && categoriesQuery.data ? (
                    <div className="space-y-2">
                      {categoriesQuery.data.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className="block w-full text-left px-3 py-2 rounded hover:bg-secondary text-sm"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;