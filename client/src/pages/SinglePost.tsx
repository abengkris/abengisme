import React from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import {
  usePostBySlug,
  useAllCategories,
  useAllPosts,
  useAuthor,
} from "@/lib/api";
import SEO from "@/components/SEO";
import PostCard from "@/components/PostCard";
import NewsletterForm from "@/components/NewsletterForm";
import AdContent from "@/components/AdContent";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  ChevronRight,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // This is a simplified error handler for demonstration purposes.
    // In a real-world scenario, you might want to use a more robust error handling mechanism.
    const handleError = (error: ErrorEvent) => {
      console.error("Error in ErrorBoundary:", error.error);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return <div className="text-red-500">Error rendering content</div>;
  }

  return children;
};

const SinglePost: React.FC = () => {
  const { slug } = useParams();

  // Fetch post data
  const postQuery = usePostBySlug(slug || "");
  const categoriesQuery = useAllCategories();
  const relatedPostsQuery = useAllPosts();

  // Get author info
  const authorQuery = useAuthor(postQuery.data?.authorId || 1);

  const isLoading =
    postQuery.isLoading || categoriesQuery.isLoading || authorQuery.isLoading;

  // Get category name
  const getCategoryName = (categoryId: number) => {
    if (!categoriesQuery.data) return "";
    const category = categoriesQuery.data.find((cat) => cat.id === categoryId);
    return category?.name || "";
  };

  // Get related posts (same category, excluding current post)
  const getRelatedPosts = () => {
    if (!postQuery.data || !relatedPostsQuery.data) return [];

    return relatedPostsQuery.data
      .filter(
        (post) =>
          post.categoryId === postQuery.data.categoryId &&
          post.id !== postQuery.data.id,
      )
      .slice(0, 3);
  };

  // Render markdown content
  const renderContent = (content: string) => {
    try {
      return (
        <ErrorBoundary
          fallback={<div className="text-red-500">Error rendering content</div>}
        >
          <ReactMarkdown
            components={{
              root: ({ node, ...props }) => (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  {...props}
                />
              ),
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-bold font-serif mt-6 mb-4"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-bold font-serif mt-6 mb-3"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-bold font-serif mt-5 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="ml-6 list-disc mb-4" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="ml-6 list-decimal mb-4" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-2" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </ErrorBoundary>
      );
    } catch (error) {
      console.error("Error rendering Markdown:", error);
      return <div className="text-red-500">Error rendering content</div>;
    }
  };

  return (
    <>
      {/* SEO */}
      {!isLoading && postQuery.data && (
        <SEO
          title={postQuery.data.metaTitle || postQuery.data.title}
          description={postQuery.data.metaDescription || postQuery.data.excerpt}
          image={postQuery.data.featuredImage}
          type="article"
          publishedTime={new Date(postQuery.data.createdAt).toISOString()}
          modifiedTime={
            postQuery.data.updatedAt
              ? new Date(postQuery.data.updatedAt).toISOString()
              : undefined
          }
          author={authorQuery.data?.name}
          keywords={
            postQuery.data.metaKeywords ||
            getCategoryName(postQuery.data.categoryId)
          }
          readTime={postQuery.data.readTime}
          category={getCategoryName(postQuery.data.categoryId)}
          breadcrumbs={[
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            {
              name: getCategoryName(postQuery.data.categoryId),
              url: `/blog?category=${postQuery.data.categoryId}`,
            },
            { name: postQuery.data.title, url: `/blog/${postQuery.data.slug}` },
          ]}
        />
      )}

      <div className="pt-24 pb-16 md:pt-32 md:pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed">
            {/* Back button and Breadcrumbs */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:text-foreground mb-4 sm:mb-0"
              >
                <Link href="/blog" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>

              {!isLoading && postQuery.data && (
                <Breadcrumbs
                  items={[
                    { name: "Home", url: "/" },
                    { name: "Blog", url: "/blog" },
                    {
                      name: getCategoryName(postQuery.data.categoryId),
                      url: `/blog?category=${postQuery.data.categoryId}`,
                    },
                    {
                      name: postQuery.data.title,
                      url: `/blog/${postQuery.data.slug}`,
                    },
                  ]}
                  className="text-sm"
                />
              )}
            </div>

            {isLoading ? (
              // Loading state
              <>
                <Skeleton className="w-full h-10 mb-4 bg-muted-foreground" />
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-24 h-5 bg-muted-foreground" />
                  <Skeleton className="w-24 h-5 bg-muted-foreground" />
                  <Skeleton className="w-24 h-5 bg-muted-foreground" />
                </div>
                <Skeleton className="w-full h-80 mb-8 bg-muted-foreground" />
                <div className="space-y-4">
                  <Skeleton className="w-full h-6 bg-muted-foreground" />
                  <Skeleton className="w-full h-6 bg-muted-foreground" />
                  <Skeleton className="w-5/6 h-6 bg-muted-foreground" />
                  <Skeleton className="w-full h-6 bg-muted-foreground" />
                  <Skeleton className="w-4/5 h-6 bg-muted-foreground" />
                </div>
              </>
            ) : postQuery.data ? (
              <>
                {/* Post Header */}
                <header className="mb-12">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                    {postQuery.data.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {postQuery.data.excerpt}
                  </p>
                </header>

                {/* Post Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                      {getCategoryName(postQuery.data.categoryId)}
                    </span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{postQuery.data.readTime} min read</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDistanceToNow(
                          new Date(postQuery.data.createdAt),
                          { addSuffix: true },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{authorQuery.data?.name}</span>
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="flex items-center mt-2 sm:mt-0">
                    <SocialShareButtons
                      url={`/blog/${postQuery.data.slug}`}
                      title={postQuery.data.title}
                      description={postQuery.data.excerpt}
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8">
                  <figure>
                    <img
                      src={postQuery.data.featuredImage}
                      alt={postQuery.data.title}
                      className="w-full h-auto rounded-lg shadow-md"
                      loading="eager"
                      width="1200"
                      height="630"
                    />
                    <figcaption className="mt-2 text-sm text-muted-foreground text-center">
                      Featured image for "{postQuery.data.title}"
                    </figcaption>
                  </figure>
                </div>

                {/* Post Content with optimized ad placement */}
                <article className="prose prose-lg max-w-none mb-12">
                  {/* We'll use AdContent to insert ads between paragraphs */}
                  <AdContent containerClassName="space-y-4">
                    {postQuery.data.content
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <div
                          key={`paragraph-${index}`}
                          className="content-paragraph"
                        >
                          {renderContent(paragraph)}
                        </div>
                      ))}
                  </AdContent>
                </article>

                {/* Author Info */}
                {authorQuery.data && (
                  <div className="flex items-center p-6 bg-secondary rounded-lg mb-12">
                    <img
                      src={authorQuery.data.avatar}
                      alt={`Profile photo of ${authorQuery.data.name}`}
                      className="w-16 h-16 rounded-full mr-4"
                      loading="lazy"
                      width="64"
                      height="64"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-lg mb-1">
                        {authorQuery.data.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {authorQuery.data.bio.substring(0, 120)}...
                        <Link
                          href={`/author/${authorQuery.data.id}`}
                          className="text-accent hover:text-accent/80 ml-1 inline-flex items-center"
                        >
                          Read more <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                {/* Article End Share Section */}
                <div className="flex flex-col items-center text-center mb-12 border-t border-b border-border py-6">
                  <h4 className="font-serif text-lg font-medium mb-3">
                    Share this article
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    If you found this article helpful, please share it with your
                    friends and colleagues
                  </p>
                  <SocialShareButtons
                    url={`/blog/${postQuery.data.slug}`}
                    title={postQuery.data.title}
                    description={postQuery.data.excerpt}
                    className="justify-center"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Post Not Found
                </h2>
                <p className="text-muted-foreground mb-6">
                  The post you're looking for doesn't exist or has been removed.
                </p>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  <Link href="/blog">Browse All Posts</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {!isLoading && postQuery.data && (
        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
                Related Posts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getRelatedPosts().length > 0 ? (
                  getRelatedPosts().map((post) => (
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
                    <p className="text-muted-foreground">
                      No related posts found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section id="subscribe" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Join the Newsletter
            </h2>
            <p className="text-muted-foreground mb-8">
              Get thoughtful content on design, technology, and mindful
              productivity delivered to your inbox. No spam, just ideas worth
              sharing.
            </p>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default SinglePost;
