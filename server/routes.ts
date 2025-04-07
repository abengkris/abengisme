import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertCategorySchema, insertSubscriberSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API routes for blog
  const apiRouter = "/api";
  
  // Get all categories
  app.get(`${apiRouter}/categories`, async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get all posts
  app.get(`${apiRouter}/posts`, async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  
  // Get featured posts
  app.get(`${apiRouter}/posts/featured`, async (_req: Request, res: Response) => {
    try {
      const featuredPosts = await storage.getFeaturedPosts();
      res.json(featuredPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured posts" });
    }
  });
  
  // Get posts by category
  app.get(`${apiRouter}/categories/:categoryId/posts`, async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const posts = await storage.getPostsByCategory(categoryId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts for category" });
    }
  });
  
  // Get single post by slug
  app.get(`${apiRouter}/posts/:slug`, async (req: Request, res: Response) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });
  
  // Get author information
  app.get(`${apiRouter}/authors/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid author ID" });
      }
      
      const author = await storage.getAuthorById(id);
      
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      
      res.json(author);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch author" });
    }
  });
  
  // Create new post (for CMS)
  app.post(`${apiRouter}/posts`, async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const newPost = await storage.createPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  
  // Update existing post (for CMS)
  app.put(`${apiRouter}/posts/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const postData = insertPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updatePost(id, postData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update post" });
    }
  });
  
  // Delete post (for CMS)
  app.delete(`${apiRouter}/posts/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const success = await storage.deletePost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  
  // Create new category (for CMS)
  app.post(`${apiRouter}/categories`, async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  // Subscribe to newsletter
  app.post(`${apiRouter}/subscribe`, async (req: Request, res: Response) => {
    try {
      const subscriberData = insertSubscriberSchema.parse(req.body);
      const newSubscriber = await storage.createSubscriber(subscriberData);
      res.status(201).json(newSubscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscriber data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });
  
  // Send contact message
  app.post(`${apiRouter}/contact`, async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Get all messages (for CMS)
  app.get(`${apiRouter}/messages`, async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Mark message as read (for CMS)
  app.put(`${apiRouter}/messages/:id/read`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(id);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
