import React from 'react';
import { useAnalyticsSummary } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Loader2, TrendingUp, Users, Clock, Eye, ThumbsUp, Share2, MessageSquare } from 'lucide-react';

const colors = ['#FF5A5F', '#FF8A80', '#FFB74D', '#FFD54F', '#81C784', '#4DB6AC', '#4FC3F7', '#7986CB'];

export function AnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96">
        <h3 className="text-xl font-semibold mb-2">Analytics data unavailable</h3>
        <p className="text-muted-foreground">There was a problem fetching analytics data.</p>
      </div>
    );
  }

  // Transform traffic data for charts
  const trafficData = analytics.dailyTraffic.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: item.visitors,
    pageViews: item.pageViews,
    bounceRate: item.bounceRate,
  }));

  // Transform content data for charts
  const contentData = analytics.topContent.map(item => ({
    id: item.id,
    postId: item.postId,
    views: item.views || 0,
    likes: item.likes || 0,
    shares: item.shares || 0,
    comments: item.comments || 0,
    engagementScore: ((item.likes || 0) + (item.shares || 0) + (item.comments || 0)) / (item.views || 1), 
  }));

  // Recent page views
  const recentViews = analytics.recentPageViews.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.visitorCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Past 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.dailyTraffic.reduce((sum, day) => sum + (day.pageViews || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Past 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.topContent.reduce((sum, content) => sum + (content.likes || 0) + (content.shares || 0) + (content.comments || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Likes, shares & comments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.dailyTraffic.reduce((sum, day) => sum + (day.avgSessionDuration || 0), 0) / 
                analytics.dailyTraffic.length)}s
            </div>
            <p className="text-xs text-muted-foreground">
              Average time on site
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="w-full justify-start gap-4 rounded-lg border p-1">
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Traffic Overview
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Content Performance
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Engagement
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Views & Visitors</CardTitle>
              <CardDescription>
                Track daily visits and page views over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trafficData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pageViews" stroke="#FF5A5F" activeDot={{ r: 8 }} name="Page Views" />
                  <Line type="monotone" dataKey="visitors" stroke="#4FC3F7" name="Visitors" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bounce Rate</CardTitle>
                <CardDescription>
                  Percentage of visitors who navigate away after one page
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trafficData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="bounceRate" stroke="#FF8A80" fill="#FF8A80" fillOpacity={0.3} name="Bounce Rate %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Page Views</CardTitle>
                <CardDescription>
                  Latest pages visitors have viewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentViews.map((view) => (
                    <div key={view.id} className="flex items-start">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{view.path}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(view.viewedAt).toLocaleString()}
                          {view.country ? ` · ${view.country}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Content by Views</CardTitle>
              <CardDescription>
                Most viewed content on your blog
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="postId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" name="Views">
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Distribution</CardTitle>
                <CardDescription>
                  Ratio of likes, shares and comments
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Likes', value: analytics.topContent.reduce((sum, content) => sum + (content.likes || 0), 0) },
                        { name: 'Shares', value: analytics.topContent.reduce((sum, content) => sum + (content.shares || 0), 0) },
                        { name: 'Comments', value: analytics.topContent.reduce((sum, content) => sum + (content.comments || 0), 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {['#FF5A5F', '#4FC3F7', '#81C784'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Score by Content</CardTitle>
                <CardDescription>
                  Engagement relative to views
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="postId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagementScore" name="Engagement Score">
                      {contentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[(index + 3) % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          {/* Add user engagement specific charts here */}
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Over Time</CardTitle>
              <CardDescription>
                Tracking user interactions and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trafficData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#FF5A5F" name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashboard;