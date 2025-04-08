
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, Clock, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: bookmarks, isLoading: bookmarksLoading } = useQuery({
    queryKey: ['/api/bookmarks'],
    queryFn: async () => {
      const res = await fetch('/api/bookmarks');
      return res.json();
    },
  });

  const { data: readingStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/reading-stats'],
    queryFn: async () => {
      const res = await fetch('/api/reading-stats');
      return res.json();
    },
  });

  return (
    <div className="min-h-screen py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? <Skeleton className="h-8 w-20" /> : readingStats?.articlesRead || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? <Skeleton className="h-8 w-20" /> : `${readingStats?.totalMinutes || 0}min`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookmarksLoading ? <Skeleton className="h-8 w-20" /> : bookmarks?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold">Bookmarked Articles</h2>
            {bookmarksLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : bookmarks?.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {bookmarks.map((bookmark: any) => (
                  <PostCard key={bookmark.id} {...bookmark.post} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No bookmarks yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
