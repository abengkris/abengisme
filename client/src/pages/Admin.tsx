import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAllPosts, useAllCategories, useAllMessages, markMessageAsRead } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Edit, Trash, File, MessageSquare, ExternalLink, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

const Admin: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  
  // Fetch data
  const postsQuery = useAllPosts();
  const categoriesQuery = useAllCategories();
  const messagesQuery = useAllMessages();
  
  // Handle message read
  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      toast({
        title: "Success",
        description: "Message marked as read",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };
  
  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    if (!categoriesQuery.data) return '';
    const category = categoriesQuery.data.find(cat => cat.id === categoryId);
    return category?.name || '';
  };
  
  // Calculate stats
  const stats = {
    posts: postsQuery.data?.length || 0,
    categories: categoriesQuery.data?.length || 0,
    messages: messagesQuery.data?.length || 0,
    unreadMessages: messagesQuery.data?.filter(msg => !msg.read).length || 0
  };
  
  return (
    <div className="py-12 md:py-16 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <Button 
              asChild
              className="bg-accent hover:bg-accent/90 text-white"
            >
              <Link href="/">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {postsQuery.isLoading ? <Skeleton className="h-8 w-16" /> : stats.posts}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categoriesQuery.isLoading ? <Skeleton className="h-8 w-16" /> : stats.categories}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {messagesQuery.isLoading ? <Skeleton className="h-8 w-16" /> : stats.messages}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {messagesQuery.isLoading ? 
                    <Skeleton className="h-8 w-16" /> : 
                    <span className={stats.unreadMessages > 0 ? "text-accent" : ""}>
                      {stats.unreadMessages}
                    </span>
                  }
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="posts" className="flex items-center">
                <File className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages {stats.unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2">{stats.unreadMessages}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Posts Tab */}
            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Blog Posts</CardTitle>
                    <Button 
                      asChild
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      <Link href="/admin/posts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>Manage your blog posts</CardDescription>
                </CardHeader>
                <CardContent>
                  {postsQuery.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-12" />
                      ))}
                    </div>
                  ) : postsQuery.data && postsQuery.data.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {postsQuery.data.map(post => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{getCategoryName(post.categoryId)}</TableCell>
                            <TableCell>
                              {post.published ? (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                                  Draft
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/blog/${post.slug}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/posts/${post.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No posts found</p>
                      <Button 
                        asChild
                        className="bg-accent hover:bg-accent/90 text-white"
                      >
                        <Link href="/admin/posts/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first post
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>Messages from your contact form</CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesQuery.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-12" />
                      ))}
                    </div>
                  ) : messagesQuery.data && messagesQuery.data.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>From</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messagesQuery.data.map(message => (
                          <TableRow key={message.id} className={message.read ? "" : "bg-accent/5"}>
                            <TableCell className="font-medium">
                              {message.name}
                              <div className="text-xs text-muted-foreground">{message.email}</div>
                            </TableCell>
                            <TableCell>{message.subject}</TableCell>
                            <TableCell>
                              {message.read ? (
                                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                  Read
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                  Unread
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</TableCell>
                            <TableCell className="text-right">
                              {!message.read && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleMarkAsRead(message.id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Mark as Read
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
