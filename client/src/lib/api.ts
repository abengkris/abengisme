import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { 
  Post, Category, Author, 
  InsertPost, InsertCategory, InsertSubscriber, InsertMessage,
  InsertPageView, InsertTrafficStats, InsertContentPerformance, InsertUserEngagement,
  PageView, TrafficStats, ContentPerformance, UserEngagement
} from "@shared/schema";

// Posts
export const useAllPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
};

export const useFeaturedPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["/api/posts/featured"],
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery<Post>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });
};

export const usePostsByCategory = (categoryId: number | null) => {
  return useQuery<Post[]>({
    queryKey: [`/api/categories/${categoryId}/posts`],
    enabled: categoryId !== null,
  });
};

export const createPost = async (post: InsertPost) => {
  const response = await apiRequest("POST", "/api/posts", post);
  return response.json();
};

export const updatePost = async (id: number, post: Partial<InsertPost>) => {
  const response = await apiRequest("PUT", `/api/posts/${id}`, post);
  return response.json();
};

export const deletePost = async (id: number) => {
  await apiRequest("DELETE", `/api/posts/${id}`);
  return true;
};

// Categories
export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
};

export const createCategory = async (category: InsertCategory) => {
  const response = await apiRequest("POST", "/api/categories", category);
  return response.json();
};

// Authors
export const useAuthor = (id: number) => {
  return useQuery<Author>({
    queryKey: [`/api/authors/${id}`],
    enabled: !!id,
  });
};

// Newsletter
export const subscribeToNewsletter = async (email: InsertSubscriber) => {
  const response = await apiRequest("POST", "/api/subscribe", email);
  return response.json();
};

// Contact
export const sendContactMessage = async (message: InsertMessage) => {
  const response = await apiRequest("POST", "/api/contact", message);
  return response.json();
};

// Admin
export const useAllMessages = () => {
  return useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
};

export const markMessageAsRead = async (id: number) => {
  const response = await apiRequest("PUT", `/api/messages/${id}/read`, {});
  return response.json();
};

// Helper types for the admin
export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Analytics

// Analytics summary type for the dashboard
export interface AnalyticsSummary {
  visitorCount: number;
  recentPageViews: PageView[];
  topContent: ContentPerformance[];
  dailyTraffic: TrafficStats[];
}

// Analytics - Page Views
export const recordPageView = async (pageView: InsertPageView) => {
  const response = await apiRequest("POST", "/api/analytics/page-views", pageView);
  return response.json();
};

export const useRecentPageViews = (limit = 100) => {
  return useQuery<PageView[]>({
    queryKey: ["/api/analytics/page-views", limit],
    retry: false,
  });
};

export const useVisitorCount = (days = 30) => {
  return useQuery<{ count: number, days: number }>({
    queryKey: ["/api/analytics/visitors", days],
    retry: false,
  });
};

// Analytics - Traffic Stats
export const createTrafficStats = async (stats: InsertTrafficStats) => {
  const response = await apiRequest("POST", "/api/analytics/traffic", stats);
  return response.json();
};

export const useTrafficStats = (periodType: 'daily' | 'weekly' | 'monthly', limit = 30) => {
  return useQuery<TrafficStats[]>({
    queryKey: ["/api/analytics/traffic", periodType, limit],
    retry: false,
  });
};

// Analytics - Content Performance
export const updateContentPerformance = async (data: InsertContentPerformance) => {
  const response = await apiRequest("POST", "/api/analytics/content-performance", data);
  return response.json();
};

export const useContentPerformance = (postId: number) => {
  return useQuery<ContentPerformance>({
    queryKey: ["/api/analytics/content-performance", postId],
    enabled: !!postId,
    retry: false,
  });
};

export const useTopContent = (limit = 10) => {
  return useQuery<ContentPerformance[]>({
    queryKey: ["/api/analytics/top-content", limit],
    retry: false,
  });
};

// Analytics - User Engagement
export const updateUserEngagement = async (data: InsertUserEngagement) => {
  const response = await apiRequest("POST", "/api/analytics/user-engagement", data);
  return response.json();
};

export const useEngagedUsers = (limit = 10) => {
  return useQuery<UserEngagement[]>({
    queryKey: ["/api/analytics/engaged-users", limit],
    retry: false,
  });
};

// Analytics - Dashboard Summary
export const useAnalyticsSummary = () => {
  return useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
    retry: false,
  });
};
