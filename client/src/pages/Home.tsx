import React from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import FeaturedPostCard from '@/components/FeaturedPostCard';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import AdContainer from '@/components/ads/AdContainer';
import { useFeaturedPosts, useAllPosts, useAllCategories, useAuthor } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Home: React.FC = () => {
  const featuredPostsQuery = useFeaturedPosts();
  const recentPostsQuery = useAllPosts();
  const categoriesQuery = useAllCategories();
  
  // We'll assume the author ID is 1 for the default author
  const authorQuery = useAuthor(1);
  
  // Map category IDs to names
  const getCategoryName = (categoryId: number) => {
    if (categoriesQuery.isLoading || !categoriesQuery.data) return '';
    const category = categoriesQuery.data.find(cat => cat.id === categoryId);
    return category?.name || '';
  };
  
  const isLoading = featuredPostsQuery.isLoading || recentPostsQuery.isLoading || categoriesQuery.isLoading || authorQuery.isLoading;

  return (
    <>
      <SEO 
        title="Mindful Thoughts | A Personal Blog"
        description="Exploring ideas about design, technology, and mindful living. Join me on this journey of discovery."
        keywords="design, technology, mindfulness, productivity, blog"
      />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Thoughts on Design, Technology & Mindful Living
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Exploring ideas that matter in our fast-paced world. Join me on this journey of discovery and reflection.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                className="btn-primary bg-accent hover:bg-accent/90 text-white font-medium py-3 px-8 rounded-md"
              >
                <Link href="/blog">Read Latest</Link>
              </Button>
              <Button 
                asChild
                className="btn-primary bg-secondary hover:bg-neutral-200 text-foreground font-medium py-3 px-8 rounded-md"
              >
                <a href="#subscribe">Subscribe</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Posts Section */}
      <section id="featured" className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Featured Posts</h2>
            <p className="text-muted-foreground mb-8">Selected writing worth your time</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {isLoading ? (
                // Loading skeletons
                [...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 mx-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-7 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5 mb-4" />
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : featuredPostsQuery.data && featuredPostsQuery.data.length > 0 ? (
                // Featured posts
                featuredPostsQuery.data.slice(0, 2).map(post => (
                  <FeaturedPostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    featuredImage={post.featuredImage}
                    categoryName={getCategoryName(post.categoryId)}
                    readTime={post.readTime}
                    authorName={authorQuery.data?.name || 'Alex Morgan'}
                    authorAvatar={authorQuery.data?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                    createdAt={new Date(post.createdAt)}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No featured posts yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Ad Banner */}
      <section className="py-4 border-t border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <AdContainer position="header" />
          </div>
        </div>
      </section>
      
      {/* Recent Posts Section */}
      <section id="recent" className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Recent Articles</h2>
            <p className="text-muted-foreground mb-8">Fresh perspectives on design, technology, and mindful living</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Loading skeletons
                [...Array(3)].map((_, i) => (
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
                ))
              ) : recentPostsQuery.data && recentPostsQuery.data.length > 0 ? (
                // Recent posts
                recentPostsQuery.data.slice(0, 3).map(post => (
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
                <div className="col-span-3 text-center py-8">
                  <p className="text-muted-foreground">No posts yet.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                asChild
                className="btn-primary bg-secondary hover:bg-neutral-200 text-foreground font-medium py-2 px-6 rounded-md"
              >
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section id="subscribe" className="py-12 md:py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Join the Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Get thoughtful content on design, technology, and mindful productivity delivered to your inbox. No spam, just ideas worth sharing.
            </p>
            
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
