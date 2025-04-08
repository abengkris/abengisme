
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { 
  insertPostSchema, 
  insertCategorySchema, 
  insertSubscriberSchema, 
  insertMessageSchema,
  insertPageViewSchema,
  insertTrafficStatsSchema,
  insertContentPerformanceSchema,
  insertUserEngagementSchema
} from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";
import { generateSitemap } from "./sitemap-generator";
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

// Define adminGuard middleware at the top
const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes with rate limiting
  setupAuth(app, authLimiter);

  // SEO-related routes
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const sitemapPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');
    res.contentType('application/xml');
    res.sendFile(sitemapPath);
  });

  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsPath = path.join(process.cwd(), 'client', 'public', 'robots.txt');
    res.contentType('text/plain');
    res.sendFile(robotsPath);
  });

  // Sitemap generation endpoint (admin only)
  app.post('/api/regenerate-sitemap', async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    try {
      await generateSitemap();
      res.json({ message: 'Sitemap regenerated successfully' });
    } catch (error) {
      console.error('Error regenerating sitemap:', error);
      res.status(500).json({ message: 'Failed to regenerate sitemap' });
    }
  });

  // API routes for blog
  const apiRouter = "/api";

// Search endpoint
app.get("/api/search", async (req: Request, res: Response) => {
  const { q, category } = req.query;
  try {
    let query = db.select().from(posts);
    
    if (q) {
      query = query.where(sql`title ILIKE ${`%${q}%`} OR content ILIKE ${`%${q}%`}`);
    }
    
    if (category && category !== 'all') {
      const categoryData = await db.select().from(categories).where(eq(categories.slug, category as string)).limit(1);
      if (categoryData.length > 0) {
        query = query.where(eq(posts.categoryId, categoryData[0].id));
      }
    }
    
    const results = await query.orderBy(desc(posts.createdAt)).limit(10);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: "Failed to perform search" });
  }
});

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

  // Get single post by ID
  app.get(`${apiRouter}/posts/id/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Bookmark routes
  app.post(`${apiRouter}/bookmarks`, async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const bookmark = await storage.createBookmark({
        userId: req.user.id,
        postId: req.body.postId,
      });
      res.status(201).json(bookmark);
    } catch (error) {
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.get(`${apiRouter}/bookmarks`, async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const bookmarks = await storage.getUserBookmarks(req.user.id);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.delete(`${apiRouter}/bookmarks/:id`, async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await storage.deleteBookmark(parseInt(req.params.id), req.user.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // Reading stats
  app.get(`${apiRouter}/reading-stats`, async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const stats = await storage.getUserReadingStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reading stats" });
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
  app.get(`${apiRouter}/messages`, adminGuard, async (_req: Request, res: Response) => {
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

  // Analytics routes
  app.post(`${apiRouter}/analytics/page-views`, async (req: Request, res: Response) => {
    try {
      const pageViewData = insertPageViewSchema.parse(req.body);
      // Add user ID if authenticated
      if (req.isAuthenticated() && req.user) {
        pageViewData.userId = req.user.id;
      }

      // Add session ID if not provided
      if (!pageViewData.sessionId) {
        pageViewData.sessionId = req.sessionID;
      }

      // Extract device/browser info from user agent
      if (req.headers['user-agent']) {
        pageViewData.userAgent = req.headers['user-agent'];
      }

      const pageView = await storage.createPageView(pageViewData);
      res.status(201).json(pageView);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page view data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record page view" });
    }
  });

  // Get recent page views (admin only)
  app.get(`${apiRouter}/analytics/page-views`, adminGuard, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const pageViews = await storage.getRecentPageViews(limit);
      res.json(pageViews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page views" });
    }
  });

  // Get unique visitor count
  app.get(`${apiRouter}/analytics/visitors`, adminGuard, async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const count = await storage.getUniqueVisitorCount(days);
      res.json({ count, days });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visitor count" });
    }
  });

  // Traffic Stats
  app.post(`${apiRouter}/analytics/traffic`, adminGuard, async (req: Request, res: Response) => {
    try {
      const trafficData = insertTrafficStatsSchema.parse(req.body);
      const trafficStats = await storage.createOrUpdateTrafficStats(trafficData);
      res.status(201).json(trafficStats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid traffic data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record traffic stats" });
    }
  });

  // Get traffic stats by period
  app.get(`${apiRouter}/analytics/traffic/:periodType`, adminGuard, async (req: Request, res: Response) => {
    try {
      const periodType = req.params.periodType;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;

      if (!['daily', 'weekly', 'monthly'].includes(periodType)) {
        return res.status(400).json({ message: "Invalid period type" });
      }

      const trafficStats = await storage.getTrafficStats(periodType, limit);
      res.json(trafficStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch traffic stats" });
    }
  });

  // Content Performance
  app.post(`${apiRouter}/analytics/content-performance`, adminGuard, async (req: Request, res: Response) => {
    try {
      const performanceData = insertContentPerformanceSchema.parse(req.body);
      const contentPerformance = await storage.createOrUpdateContentPerformance(performanceData);
      res.status(201).json(contentPerformance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content performance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record content performance" });
    }
  });

  // Get content performance for a specific post
  app.get(`${apiRouter}/analytics/content-performance/:postId`, adminGuard, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const performance = await storage.getContentPerformance(postId);

      if (!performance) {
        return res.status(404).json({ message: "Content performance data not found" });
      }

      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content performance" });
    }
  });

  // Get top performing content
  app.get(`${apiRouter}/analytics/top-content`, adminGuard, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const topContent = await storage.getTopPerformingContent(limit);
      res.json(topContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top performing content" });
    }
  });

  // User Engagement
  app.post(`${apiRouter}/analytics/user-engagement`, async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const engagementData = insertUserEngagementSchema.parse(req.body);
      // Ensure user ID matches authenticated user
      engagementData.userId = req.user.id;

      const engagement = await storage.createOrUpdateUserEngagement(engagementData);
      res.status(201).json(engagement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid engagement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record user engagement" });
    }
  });

  // Get most engaged users (admin only)
  app.get(`${apiRouter}/analytics/engaged-users`, adminGuard, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const engagedUsers = await storage.getMostEngagedUsers(limit);
      res.json(engagedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch engaged users" });
    }
  });

  // Analytics Dashboard Summary
  app.get(`${apiRouter}/analytics/summary`, adminGuard, async (req: Request, res: Response) => {
    try {
      // Get key metrics for dashboard
      const visitorCount = await storage.getUniqueVisitorCount(30);
      const recentPageViews = await storage.getRecentPageViews(10);
      const topContent = await storage.getTopPerformingContent(5);
      const dailyTraffic = await storage.getTrafficStats('daily', 7);

      res.json({
        visitorCount,
        recentPageViews,
        topContent,
        dailyTraffic
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
