import { QueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { 
  Post, Category, Author, 
  InsertPost, InsertCategory, InsertSubscriber, InsertMessage,
  InsertPageView, InsertTrafficStats, InsertContentPerformance, InsertUserEngagement,
  PageView, TrafficStats, ContentPerformance, UserEngagement
} from "@shared/schema";

const API_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const API_STALE_TIME = 1 * 60 * 1000; // 1 minute

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, error || response.statusText);
  }
  return response.json();
}

export const api = {
  get: async (url: string) => {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error (GET ${url}):`, error);
      throw error;
    }
  },

  post: async (url: string, data?: unknown) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error (POST ${url}):`, error);
      throw error;
    }
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      cacheTime: API_CACHE_TIME,
      staleTime: API_STALE_TIME,
      refetchOnWindowFocus: false,
    },
  },
});

// Posts
export const useAllPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: () => api.get("/api/posts")
  });
};

export const useFeaturedPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["/api/posts/featured"],
    queryFn: () => api.get("/api/posts/featured")
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery<Post>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
    queryFn: () => api.get(`/api/posts/${slug}`)
  });
};

export const usePostsByCategory = (categoryId: number | null) => {
  return useQuery<Post[]>({
    queryKey: [`/api/categories/${categoryId}/posts`],
    enabled: categoryId !== null,
    queryFn: () => api.get(`/api/categories/${categoryId}/posts`)
  });
};

export const createPost = async (post: InsertPost) => {
  const response = await api.post("/api/posts", post);
  return response;
};

export const updatePost = async (id: number, post: Partial<InsertPost>) => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(post),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`API Error (PUT /api/posts/${id}):`, error);
    throw error;
  }
};

export const deletePost = async (id: number) => {
  await api.post(`/api/posts/${id}`, { _method: 'DELETE' });
  return true;
};

// Categories
export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: () => api.get("/api/categories")
  });
};

export const createCategory = async (category: InsertCategory) => {
  const response = await api.post("/api/categories", category);
  return response;
};

// Authors
export const useAuthor = (id: number) => {
  return useQuery<Author>({
    queryKey: [`/api/authors/${id}`],
    enabled: !!id,
    queryFn: () => api.get(`/api/authors/${id}`)
  });
};

// Newsletter
export const subscribeToNewsletter = async (email: InsertSubscriber) => {
  const response = await api.post("/api/subscribe", email);
  return response;
};

// Contact
export const sendContactMessage = async (message: InsertMessage) => {
  const response = await api.post("/api/contact", message);
  return response;
};

// Admin
export const useAllMessages = () => {
  return useQuery<Message[]>({
    queryKey: ["/api/messages"],
    queryFn: () => api.get("/api/messages"),
    retry: false,
    // Only fetch if user is authenticated
    enabled: !!localStorage.getItem('isAuthenticated')
  });
};

export const markMessageAsRead = async (id: number) => {
  const response = await api.post(`/api/messages/${id}/read`, {});
  return response;
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
  const response = await api.post("/api/analytics/page-views", pageView);
  return response;
};

export const useRecentPageViews = (limit = 100) => {
  return useQuery<PageView[]>({
    queryKey: ["/api/analytics/page-views", limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/page-views?limit=${limit}`)
  });
};

export const useVisitorCount = (days = 30) => {
  return useQuery<{ count: number, days: number }>({
    queryKey: ["/api/analytics/visitors", days],
    retry: false,
    queryFn: () => api.get(`/api/analytics/visitors?days=${days}`)
  });
};

// Analytics - Traffic Stats
export const createTrafficStats = async (stats: InsertTrafficStats) => {
  const response = await api.post("/api/analytics/traffic", stats);
  return response;
};

export const useTrafficStats = (periodType: 'daily' | 'weekly' | 'monthly', limit = 30) => {
  return useQuery<TrafficStats[]>({
    queryKey: ["/api/analytics/traffic", periodType, limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/traffic?periodType=${periodType}&limit=${limit}`)
  });
};

// Analytics - Content Performance
export const updateContentPerformance = async (data: InsertContentPerformance) => {
  const response = await api.post("/api/analytics/content-performance", data);
  return response;
};

export const useContentPerformance = (postId: number) => {
  return useQuery<ContentPerformance>({
    queryKey: ["/api/analytics/content-performance", postId],
    enabled: !!postId,
    retry: false,
    queryFn: () => api.get(`/api/analytics/content-performance?postId=${postId}`)
  });
};

export const useTopContent = (limit = 10) => {
  return useQuery<ContentPerformance[]>({
    queryKey: ["/api/analytics/top-content", limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/top-content?limit=${limit}`)
  });
};

// Analytics - User Engagement
export const updateUserEngagement = async (data: InsertUserEngagement) => {
  const response = await api.post("/api/analytics/user-engagement", data);
  return response;
};

export const useEngagedUsers = (limit = 10) => {
  return useQuery<UserEngagement[]>({
    queryKey: ["/api/analytics/engaged-users", limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/engaged-users?limit=${limit}`)
  });
};

// Analytics - Dashboard Summary
export const useAnalyticsSummary = () => {
  return useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
    retry: false,
    queryFn: () => api.get("/api/analytics/summary")
  });
};