import { pgTable, text, serial, integer, timestamp, boolean, jsonb, varchar, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema (enhanced with more fields)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("user").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  profileImage: true,
  bio: true,
  isPremium: true,
  isActive: true,
}).extend({
  role: z.enum(['user', 'admin', 'editor']).default('user'),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Posts schema (enhanced)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image").notNull(),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  readTime: integer("read_time").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isPromoted: boolean("is_promoted").default(false), // For sponsored/promoted content
  published: boolean("published").default(true),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  metaTitle: text("meta_title"), // SEO fields
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertPostSchema = createInsertSchema(posts)
  .omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, likeCount: true })
  .extend({
    categoryId: z.coerce.number(),
    readTime: z.coerce.number(),
    isFeatured: z.boolean().default(false),
    isPromoted: z.boolean().default(false),
    published: z.boolean().default(true),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
  });

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Tags schema
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Post-Tag relation (many-to-many)
export const postTags = pgTable("post_tags", {
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  };
});

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  parentId: integer("parent_id"), // Will reference self (parent comment) - handled via relations
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
}).extend({
  postId: z.coerce.number(),
  userId: z.coerce.number().optional(),
  parentId: z.coerce.number().optional(),
  isApproved: z.boolean().default(false),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Ad slots schema
export const adSlots = pgTable("ad_slots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  adCode: text("ad_code").notNull(), // Google AdSense code
  position: text("position").notNull(), // header, sidebar, in-content, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertAdSlotSchema = createInsertSchema(adSlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  isActive: z.boolean().default(true),
});

export type InsertAdSlot = z.infer<typeof insertAdSlotSchema>;
export type AdSlot = typeof adSlots.$inferSelect;

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Authors schema
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  social: text("social").notNull(),
});

export const insertAuthorSchema = createInsertSchema(authors).omit({
  id: true,
});

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// Subscribers for the newsletter
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Contact messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// User preferences
export const userPreferences = pgTable("user_preferences", {
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).primaryKey(),
  theme: text("theme").default("light"), // light, dark, system
  emailNotifications: boolean("email_notifications").default(true),
  newsletterSubscribed: boolean("newsletter_subscribed").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  updatedAt: true,
}).extend({
  userId: z.coerce.number(),
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Social shares
export const socialShares = pgTable("social_shares", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(), // facebook, twitter, linkedin, etc.
  shareCount: integer("share_count").default(0),
  lastShared: timestamp("last_shared"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialShareSchema = createInsertSchema(socialShares).omit({
  id: true,
  shareCount: true,
  lastShared: true,
  createdAt: true,
}).extend({
  postId: z.coerce.number(),
});

export type InsertSocialShare = z.infer<typeof insertSocialShareSchema>;
export type SocialShare = typeof socialShares.$inferSelect;

// Page views analytics
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  sessionId: text("session_id"),
  userId: integer("user_id").references(() => users.id),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  metadata: text("metadata"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  viewedAt: true,
}).extend({
  userId: z.coerce.number().optional(),
  ipAddress: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  metadata: z.string().optional(),
});

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

// Site traffic analytics by time period
export const trafficStats = pgTable("traffic_stats", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  visitors: integer("visitors").default(0),
  pageViews: integer("page_views").default(0),
  bounceRate: integer("bounce_rate").default(0),
  avgSessionDuration: integer("avg_session_duration").default(0),
  periodType: text("period_type").notNull(), // daily, weekly, monthly
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrafficStatsSchema = createInsertSchema(trafficStats).omit({
  id: true,
  createdAt: true,
}).extend({
  visitors: z.coerce.number(),
  pageViews: z.coerce.number(),
  bounceRate: z.coerce.number(),
  avgSessionDuration: z.coerce.number(),
  periodType: z.enum(['daily', 'weekly', 'monthly']),
});

export type InsertTrafficStats = z.infer<typeof insertTrafficStatsSchema>;
export type TrafficStats = typeof trafficStats.$inferSelect;

// Content performance analytics
export const contentPerformance = pgTable("content_performance", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  avgReadTime: integer("avg_read_time").default(0), // In seconds
  bounceRate: integer("bounce_rate").default(0), // Percentage
  date: timestamp("date").defaultNow().notNull(),
});

export const insertContentPerformanceSchema = createInsertSchema(contentPerformance).omit({
  id: true,
  date: true,
}).extend({
  postId: z.coerce.number(),
  views: z.coerce.number(),
  likes: z.coerce.number(),
  shares: z.coerce.number(),
  comments: z.coerce.number(),
  avgReadTime: z.coerce.number(),
  bounceRate: z.coerce.number(),
});

export type InsertContentPerformance = z.infer<typeof insertContentPerformanceSchema>;
export type ContentPerformance = typeof contentPerformance.$inferSelect;

// User engagement analytics
export const userEngagement = pgTable("user_engagement", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionCount: integer("session_count").default(0),
  totalTimeSpent: integer("total_time_spent").default(0), // In seconds
  pagesPerSession: integer("pages_per_session").default(0),
  lastActive: timestamp("last_active"),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertUserEngagementSchema = createInsertSchema(userEngagement).omit({
  id: true,
  date: true,
}).extend({
  userId: z.coerce.number(),
  sessionCount: z.coerce.number(),
  totalTimeSpent: z.coerce.number(),
  pagesPerSession: z.coerce.number(),
});

export type InsertUserEngagement = z.infer<typeof insertUserEngagementSchema>;
export type UserEngagement = typeof userEngagement.$inferSelect;

// Define relations for better type safety and querying
export const relations = {
  users: {
    preferences: {
      relationName: "userToPreferences",
      fields: [users.id],
      references: [userPreferences.userId],
    },
    comments: {
      relationName: "userToComments",
      fields: [users.id],
      references: [comments.userId],
    },
    pageViews: {
      relationName: "userToPageViews",
      fields: [users.id],
      references: [pageViews.userId],
    },
    engagement: {
      relationName: "userToEngagement",
      fields: [users.id],
      references: [userEngagement.userId],
    },
  },
  posts: {
    author: {
      relationName: "postToAuthor",
      fields: [posts.authorId],
      references: [authors.id],
    },
    category: {
      relationName: "postToCategory",
      fields: [posts.categoryId],
      references: [categories.id],
    },
    comments: {
      relationName: "postToComments",
      fields: [posts.id],
      references: [comments.postId],
    },
    tags: {
      relationName: "postToTags",
      fields: [posts.id],
      references: [postTags.postId],
    },
    socialShares: {
      relationName: "postToSocialShares",
      fields: [posts.id],
      references: [socialShares.postId],
    },
    contentPerformance: {
      relationName: "postToContentPerformance",
      fields: [posts.id],
      references: [contentPerformance.postId],
    }
  },
  tags: {
    posts: {
      relationName: "tagToPosts",
      fields: [tags.id],
      references: [postTags.tagId],
    }
  },
  comments: {
    post: {
      relationName: "commentToPost",
      fields: [comments.postId],
      references: [posts.id],
    },
    user: {
      relationName: "commentToUser",
      fields: [comments.userId],
      references: [users.id],
    },
    parentComment: {
      relationName: "commentToParent",
      fields: [comments.parentId],
      references: [comments.id],
    },
    childComments: {
      relationName: "commentToChildren",
      fields: [comments.id],
      references: [comments.parentId],
    }
  },
  contentPerformance: {
    post: {
      relationName: "contentPerformanceToPost",
      fields: [contentPerformance.postId],
      references: [posts.id],
    }
  },
  userEngagement: {
    user: {
      relationName: "engagementToUser",
      fields: [userEngagement.userId],
      references: [users.id],
    }
  }
};
