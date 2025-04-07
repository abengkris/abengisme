import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createPost, useAllCategories } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Create a schema for the post form
const postFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  featuredImage: z.string().url('Must be a valid URL'),
  categoryId: z.coerce.number().min(1, 'Please select a category'),
  authorId: z.coerce.number().default(1), // Default to author ID 1
  readTime: z.coerce.number().min(1, 'Read time must be at least 1 minute'),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(true),
});

type PostFormValues = z.infer<typeof postFormSchema>;

const AdminNewPost: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const categoriesQuery = useAllCategories();
  const [isPreview, setIsPreview] = useState(false);
  
  // Set up form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      categoryId: 0,
      authorId: 1, // Default author
      readTime: 5,
      isFeatured: false,
      published: true,
    },
  });
  
  // Auto-generate slug from title
  const autoGenerateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };
  
  // Handle form submission
  const postMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Post created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      navigate('/admin');
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: PostFormValues) => {
    postMutation.mutate(data);
  };
  
  return (
    <div className="py-12 md:py-16 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button 
                variant="ghost" 
                className="mb-2"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">New Post</h1>
            </div>
            
            <Button 
              type="button" 
              onClick={form.handleSubmit(onSubmit)}
              className="bg-accent hover:bg-accent/90 text-white"
              disabled={postMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {postMutation.isPending ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
          
          {/* Post Form */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter post title" 
                            {...field} 
                            onBlur={() => {
                              field.onBlur();
                              if (!form.getValues('slug')) {
                                autoGenerateSlug();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input placeholder="post-url-slug" {...field} />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={autoGenerateSlug}
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          {categoriesQuery.isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categoriesQuery.data?.map(category => (
                                  <SelectItem 
                                    key={category.id} 
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Featured Image */}
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Reading Time */}
                  <FormField
                    control={form.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Time (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="60" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Excerpt */}
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the post"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Content */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Content (Markdown)</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                          >
                            {isPreview ? 'Edit' : 'Preview'}
                          </Button>
                        </div>
                        <FormControl>
                          {isPreview ? (
                            <div className="min-h-[300px] p-4 border rounded-md bg-background">
                              <ReactMarkdown
                                components={{
                                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold font-serif mt-6 mb-4" {...props}/>,
                                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold font-serif mt-6 mb-3" {...props}/>,
                                  h3: ({node, ...props}) => <h3 className="text-xl font-bold font-serif mt-5 mb-3" {...props}/>,
                                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props}/>,
                                  ul: ({node, ...props}) => <ul className="ml-6 list-disc mb-4" {...props}/>,
                                  ol: ({node, ...props}) => <ol className="ml-6 list-decimal mb-4" {...props}/>,
                                  li: ({node, ...props}) => <li className="mb-2" {...props}/>
                                }}
                              >
                                {field.value}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <Textarea 
                              placeholder="# Your post content in markdown format"
                              rows={15}
                              {...field}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Featured Post */}
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Feature this post on the homepage</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {/* Published */}
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish immediately</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-accent hover:bg-accent/90 text-white"
                      disabled={postMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {postMutation.isPending ? 'Saving...' : 'Save Post'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminNewPost;
