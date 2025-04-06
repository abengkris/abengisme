import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { usePostBySlug, updatePost, deletePost, useAllCategories } from '@/lib/api';
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash } from 'lucide-react';
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

const AdminEditPost: React.FC = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const categoriesQuery = useAllCategories();
  
  // Convert ID to number
  const postId = id ? parseInt(id) : 0;
  
  // Since we don't have a direct getPostById, we'll need to fetch all posts and find by ID
  const allPostsQuery = useAllCategories();
  
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
      authorId: 1,
      readTime: 5,
      isFeatured: false,
      published: true,
    },
  });
  
  // When posts data is loaded, find the post by ID and populate the form
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // For a real implementation, we would use a direct API call to get the post by ID
        // We're simulating it by making a request to the server
        const response = await fetch(`/api/posts/${postId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const post = await response.json();
        
        if (post) {
          // Populate form with post data
          form.reset({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            featuredImage: post.featuredImage,
            categoryId: post.categoryId,
            authorId: post.authorId,
            readTime: post.readTime,
            isFeatured: post.isFeatured,
            published: post.published,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load post data",
          variant: "destructive",
        });
        navigate('/admin');
      }
    };
    
    if (postId) {
      fetchPostData();
    }
  }, [postId, form, navigate, toast]);
  
  // Handle form submission
  const updateMutation = useMutation({
    mutationFn: (data: PostFormValues) => updatePost(postId, data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Post updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      navigate('/admin');
    },
    onError: (error) => {
      toast({
        title: "Failed to update post",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  // Handle delete
  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      navigate('/admin');
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: PostFormValues) => {
    updateMutation.mutate(data);
  };
  
  const onDelete = () => {
    deleteMutation.mutate();
  };
  
  const isLoading = form.formState.isSubmitting || updateMutation.isPending || deleteMutation.isPending;
  
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
              <h1 className="font-serif text-2xl md:text-3xl font-bold">Edit Post</h1>
            </div>
            
            <div className="flex space-x-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)}
                className="bg-accent hover:bg-accent/90 text-white"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
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
                          <Input placeholder="Enter post title" {...field} />
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
                          <Input placeholder="post-url-slug" {...field} />
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
                              value={field.value.toString()}
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
                        <FormLabel>Content (Markdown)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="# Your post content in markdown format"
                            rows={15}
                            {...field}
                          />
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
                          <FormLabel>Published</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-accent hover:bg-accent/90 text-white"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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

export default AdminEditPost;
