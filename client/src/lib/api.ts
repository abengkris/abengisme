import { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type {
  Post,
  Category,
  Author,
  InsertPost,
  InsertCategory,
  InsertSubscriber,
  InsertMessage,
  InsertPageView,
  InsertTrafficStats,
  InsertContentPerformance,
  InsertUserEngagement,
  PageView,
  TrafficStats,
  ContentPerformance,
  UserEngagement,
} from "@shared/schema";

const API_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
// const API_STALE_TIME = 1 * 60 * 1000; // 1 minute

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, error || response.statusText);
  }
  return response.json();
}

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

export const api = {
  get: async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`API Error (GET ${url}):`, error);
      throw error;
    }
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`API Error (POST ${url}):`, error);
      throw error;
    }
  },

  put: async <T>(url: string, data: unknown): Promise<T> => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`API Error (PUT ${url}):`, error);
      throw error;
    }
  },

  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`API Error (DELETE ${url}):`, error);
      throw error;
    }
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: API_CACHE_TIME, // Correctly use staleTime for caching
      refetchOnWindowFocus: false,
    },
  },
});

// Posts
export const useAllPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => api.get("/api/posts"),
  });
};

export const useFeaturedPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["featured-posts"],
    queryFn: () => api.get("/api/posts/featured"),
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery<Post>({
    queryKey: ["post", slug],
    enabled: !!slug,
    queryFn: () => api.get(`/api/posts/${slug}`),
  });
};

export const usePostsByCategory = (categoryId: number | null) => {
  return useQuery<Post[]>({
    queryKey: ["posts-by-category", categoryId],
    enabled: categoryId !== null,
    queryFn: () => api.get(`/api/categories/${categoryId}/posts`),
  });
};

export const createPost = async (post: InsertPost): Promise<Post> => {
  return api.post("/api/posts", post);
};

export const updatePost = async (
  id: number,
  post: Partial<InsertPost>,
): Promise<Post> => {
  return api.put(`/api/posts/${id}`, post);
};

export const deletePost = async (id: number): Promise<boolean> => {
  return api.delete(`/api/posts/${id}`);
};

// Categories
export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories"),
  });
};

export const createCategory = async (
  category: InsertCategory,
): Promise<Category> => {
  return api.post("/api/categories", category);
};

// Authors
export const useAuthor = (id: number) => {
  return useQuery<Author>({
    queryKey: ["author", id],
    enabled: !!id,
    queryFn: () => api.get(`/api/authors/${id}`),
  });
};

// Newsletter
export const subscribeToNewsletter = async (
  email: InsertSubscriber,
): Promise<void> => {
  return api.post("/api/subscribe", email);
};

// Contact
export const sendContactMessage = async (
  message: InsertMessage,
): Promise<void> => {
  return api.post("/api/contact", message);
};

// Admin
export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export const useAllMessages = () => {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: () => api.get("/api/messages"),
    retry: false,
    enabled: !!localStorage.getItem("isAuthenticated"),
  });
};

export const markMessageAsRead = async (id: number): Promise<void> => {
  return api.post(`/api/messages/${id}/read`, {});
};

// Analytics
export interface AnalyticsSummary {
  visitorCount: number;
  recentPageViews: PageView[];
  topContent: ContentPerformance[];
  dailyTraffic: TrafficStats[];
}

export const recordPageView = async (
  pageView: InsertPageView,
): Promise<void> => {
  return api.post("/api/analytics/page-views", pageView);
};

export const useRecentPageViews = (limit = 100) => {
  return useQuery<PageView[]>({
    queryKey: ["recent-page-views", limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/page-views?limit=${limit}`),
  });
};

export const useVisitorCount = (days = 30) => {
  return useQuery<{ count: number; days: number }>({
    queryKey: ["visitor-count", days],
    retry: false,
    queryFn: () => api.get(`/api/analytics/visitors?days=${days}`),
  });
};

export const createTrafficStats = async (
  stats: InsertTrafficStats,
): Promise<TrafficStats> => {
  return api.post("/api/analytics/traffic", stats);
};

export const useTrafficStats = (
  periodType: "daily" | "weekly" | "monthly",
  limit = 30,
) => {
  return useQuery<TrafficStats[]>({
    queryKey: ["traffic-stats", periodType, limit],
    retry: false,
    queryFn: () =>
      api.get(`/api/analytics/traffic?periodType=${periodType}&limit=${limit}`),
  });
};

export const updateContentPerformance = async (
  data: InsertContentPerformance,
): Promise<ContentPerformance> => {
  return api.post("/api/analytics/content-performance", data);
};

export const useContentPerformance = (postId: number) => {
  return useQuery<ContentPerformance>({
    queryKey: ["content-performance", postId],
    enabled: !!postId,
    retry: false,
    queryFn: () =>
      api.get(`/api/analytics/content-performance?postId=${postId}`),
  });
};

export const useTopContent = (limit = 10) => {
  return useQuery<ContentPerformance[]>({
    queryKey: ["top-content", limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/top-content?limit=${limit}`),
  });
};

export const updateUserEngagement = async (
  data: InsertUserEngagement,
): Promise<UserEngagement> => {
  return api.post("/api/analytics/user-engagement", data);
};

export const useEngagedUsers = (limit = 10) => {
  return useQuery<UserEngagement[]>({
    queryKey: ["engaged-users", limit],
    retry: false,
    queryFn: () => api.get(`/api/analytics/engaged-users?limit=${limit}`),
  });
};

export const useAnalyticsSummary = () => {
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics-summary"],
    retry: false,
    queryFn: () => api.get("/api/analytics/summary"),
  });
};
