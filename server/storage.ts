import {
  users, type User, type InsertUser,
  posts, type Post, type InsertPost,
  categories, type Category, type InsertCategory,
  authors, type Author, type InsertAuthor,
  subscribers, type Subscriber, type InsertSubscriber,
  messages, type Message, type InsertMessage,
  pageViews, type PageView, type InsertPageView,
  trafficStats, type TrafficStats, type InsertTrafficStats,
  contentPerformance, type ContentPerformance, type InsertContentPerformance,
  userEngagement, type UserEngagement, type InsertUserEngagement
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, count, countDistinct, between, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Posts
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getFeaturedPosts(): Promise<Post[]>;
  getPostsByCategory(categoryId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Authors
  getAllAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;
  
  // Subscribers
  getAllSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Messages
  getAllMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Analytics - Page Views
  createPageView(pageView: InsertPageView): Promise<PageView>;
  getPageViewsByPath(path: string): Promise<PageView[]>;
  getPageViewsByUser(userId: number): Promise<PageView[]>;
  getRecentPageViews(limit?: number): Promise<PageView[]>;
  getUniqueVisitorCount(days?: number): Promise<number>;
  
  // Analytics - Traffic Stats
  createOrUpdateTrafficStats(stats: InsertTrafficStats): Promise<TrafficStats>;
  getTrafficStats(periodType: string, limit?: number): Promise<TrafficStats[]>;
  getTotalTrafficByPeriod(startDate: Date, endDate: Date): Promise<TrafficStats[]>;
  
  // Analytics - Content Performance
  createOrUpdateContentPerformance(data: InsertContentPerformance): Promise<ContentPerformance>;
  getContentPerformance(postId: number): Promise<ContentPerformance | undefined>;
  getTopPerformingContent(limit?: number): Promise<ContentPerformance[]>;
  
  // Analytics - User Engagement
  createOrUpdateUserEngagement(data: InsertUserEngagement): Promise<UserEngagement>;
  getUserEngagement(userId: number): Promise<UserEngagement | undefined>;
  getMostEngagedUsers(limit?: number): Promise<UserEngagement[]>;
}

/**
 * Database storage implementation that uses the database for persistence.
 */
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  // Posts
  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post || undefined;
  }

  async getFeaturedPosts(): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(and(eq(posts.isFeatured, true), eq(posts.published, true)))
      .orderBy(desc(posts.createdAt))
      .limit(4);
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(and(eq(posts.categoryId, categoryId), eq(posts.published, true)))
      .orderBy(desc(posts.createdAt));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updatePost(id: number, postUpdate: Partial<InsertPost>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set(postUpdate)
      .where(eq(posts.id, id))
      .returning();
    return post || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning({ id: posts.id });
    return result.length > 0;
  }
  
  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }
  
  // Authors
  async getAllAuthors(): Promise<Author[]> {
    return await db.select().from(authors);
  }

  async getAuthorById(id: number): Promise<Author | undefined> {
    const [author] = await db.select().from(authors).where(eq(authors.id, id));
    return author || undefined;
  }

  async createAuthor(insertAuthor: InsertAuthor): Promise<Author> {
    const [author] = await db
      .insert(authors)
      .values(insertAuthor)
      .returning();
    return author;
  }
  
  // Subscribers
  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }
  
  // Messages
  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return message || undefined;
  }

  // Analytics - Page Views
  async createPageView(insertPageView: InsertPageView): Promise<PageView> {
    const [pageView] = await db
      .insert(pageViews)
      .values(insertPageView)
      .returning();
    return pageView;
  }

  async getPageViewsByPath(path: string): Promise<PageView[]> {
    return await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.path, path))
      .orderBy(desc(pageViews.viewedAt));
  }

  async getPageViewsByUser(userId: number): Promise<PageView[]> {
    return await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, userId))
      .orderBy(desc(pageViews.viewedAt));
  }

  async getRecentPageViews(limit: number = 100): Promise<PageView[]> {
    return await db
      .select()
      .from(pageViews)
      .orderBy(desc(pageViews.viewedAt))
      .limit(limit);
  }

  async getUniqueVisitorCount(days: number = 30): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    const [result] = await db
      .select({ count: countDistinct(pageViews.sessionId) })
      .from(pageViews)
      .where(gte(pageViews.viewedAt, date));
    
    return result?.count || 0;
  }

  // Analytics - Traffic Stats
  async createOrUpdateTrafficStats(insertStats: InsertTrafficStats): Promise<TrafficStats> {
    // First check if we already have stats for this date and period type
    const existingStats = await db
      .select()
      .from(trafficStats)
      .where(
        and(
          eq(trafficStats.date, insertStats.date),
          eq(trafficStats.periodType, insertStats.periodType)
        )
      );

    if (existingStats.length > 0) {
      // Update existing stats
      const [stats] = await db
        .update(trafficStats)
        .set(insertStats)
        .where(eq(trafficStats.id, existingStats[0].id))
        .returning();
      return stats;
    } else {
      // Create new stats
      const [stats] = await db
        .insert(trafficStats)
        .values(insertStats)
        .returning();
      return stats;
    }
  }

  async getTrafficStats(periodType: string, limit: number = 30): Promise<TrafficStats[]> {
    return await db
      .select()
      .from(trafficStats)
      .where(eq(trafficStats.periodType, periodType))
      .orderBy(desc(trafficStats.date))
      .limit(limit);
  }

  async getTotalTrafficByPeriod(startDate: Date, endDate: Date): Promise<TrafficStats[]> {
    return await db
      .select()
      .from(trafficStats)
      .where(
        between(trafficStats.date, startDate, endDate)
      )
      .orderBy(trafficStats.date);
  }

  // Analytics - Content Performance
  async createOrUpdateContentPerformance(insertData: InsertContentPerformance): Promise<ContentPerformance> {
    // Check if we already have performance data for this post today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingData = await db
      .select()
      .from(contentPerformance)
      .where(
        and(
          eq(contentPerformance.postId, insertData.postId),
          gte(contentPerformance.date, today)
        )
      );

    if (existingData.length > 0) {
      // Update existing record
      const [data] = await db
        .update(contentPerformance)
        .set(insertData)
        .where(eq(contentPerformance.id, existingData[0].id))
        .returning();
      return data;
    } else {
      // Create new record
      const [data] = await db
        .insert(contentPerformance)
        .values(insertData)
        .returning();
      return data;
    }
  }

  async getContentPerformance(postId: number): Promise<ContentPerformance | undefined> {
    const [data] = await db
      .select()
      .from(contentPerformance)
      .where(eq(contentPerformance.postId, postId))
      .orderBy(desc(contentPerformance.date))
      .limit(1);
    
    return data || undefined;
  }

  async getTopPerformingContent(limit: number = 10): Promise<ContentPerformance[]> {
    return await db
      .select()
      .from(contentPerformance)
      .orderBy(desc(contentPerformance.views))
      .limit(limit);
  }

  // Analytics - User Engagement
  async createOrUpdateUserEngagement(insertData: InsertUserEngagement): Promise<UserEngagement> {
    // Check if we already have engagement data for this user today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingData = await db
      .select()
      .from(userEngagement)
      .where(
        and(
          eq(userEngagement.userId, insertData.userId),
          gte(userEngagement.date, today)
        )
      );

    if (existingData.length > 0) {
      // Update existing record
      const [data] = await db
        .update(userEngagement)
        .set(insertData)
        .where(eq(userEngagement.id, existingData[0].id))
        .returning();
      return data;
    } else {
      // Create new record
      const [data] = await db
        .insert(userEngagement)
        .values(insertData)
        .returning();
      return data;
    }
  }

  async getUserEngagement(userId: number): Promise<UserEngagement | undefined> {
    const [data] = await db
      .select()
      .from(userEngagement)
      .where(eq(userEngagement.userId, userId))
      .orderBy(desc(userEngagement.date))
      .limit(1);
    
    return data || undefined;
  }

  async getMostEngagedUsers(limit: number = 10): Promise<UserEngagement[]> {
    return await db
      .select()
      .from(userEngagement)
      .orderBy(desc(userEngagement.totalTimeSpent))
      .limit(limit);
  }
}

// Export database storage
export const storage = new DatabaseStorage();
