import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { 
  Post, Category, Author, 
  InsertPost, InsertCategory, InsertSubscriber, InsertMessage 
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
