import {
  authors, type InsertAuthor,
  categories, type InsertCategory,
  posts, type InsertPost,
  users, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { log } from "./vite";

async function seed() {
  log("Starting database seeding...", "seed");

  // Check if data already exists
  const existingAuthors = await db.select().from(authors);
  if (existingAuthors.length > 0) {
    log("Database already contains data. Skipping seed.", "seed");
    return;
  }

  try {
    // Create a default admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@example.com",
      role: "admin",
      isActive: true
    };

    const [createdUser] = await db.insert(users).values(adminUser).returning();
    log(`Created admin user with ID: ${createdUser.id}`, "seed");

    // Create author
    const author: InsertAuthor = {
      name: "Alex Morgan",
      bio: "Hello! I'm Alex Morgan, a designer, developer, and writer based in San Francisco. For over a decade, I've been working at the intersection of design and technology, helping create digital products that prioritize human needs and experiences.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      social: JSON.stringify({
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      })
    };
    
    const [createdAuthor] = await db.insert(authors).values(author).returning();
    log(`Created author with ID: ${createdAuthor.id}`, "seed");
    
    // Create categories
    const categoryData = [
      { name: "Design", slug: "design" },
      { name: "Technology", slug: "technology" },
      { name: "Productivity", slug: "productivity" },
      { name: "Mindfulness", slug: "mindfulness" }
    ];
    
    const createdCategories = [];
    for (const category of categoryData) {
      const [createdCategory] = await db.insert(categories).values(category).returning();
      createdCategories.push(createdCategory);
      log(`Created category: ${createdCategory.name}`, "seed");
    }
    
    // Create sample posts
    const postData: InsertPost[] = [
      {
        title: "The Art of Minimalism in Digital Product Design",
        slug: "art-of-minimalism-digital-product-design",
        excerpt: "How simplicity in design can lead to better user experiences and more meaningful digital products.",
        content: "# The Art of Minimalism in Digital Product Design\n\nIn the world of digital product design, less is often more. Minimalism isn't just an aesthetic choice; it's a fundamental approach to creating more usable, accessible, and meaningful digital experiences.\n\n## Why Minimalism Matters\n\nMinimalist design reduces cognitive load on users, allowing them to focus on what truly matters: the content and core functionality. By eliminating unnecessary elements, you create space for the essential to breathe and stand out.\n\n## Key Principles of Minimalist Design\n\n1. **Simplicity**: Remove everything that doesn't serve a clear purpose\n2. **Clarity**: Make the interface intuitive and self-explanatory\n3. **Focus**: Direct attention to what matters most\n4. **Balance**: Create harmony between elements\n5. **Intentionality**: Every element should exist for a reason\n\n## Practical Applications\n\nMinimalism isn't about making everything white and bland. It's about intentionality. Here are some ways to apply minimalist principles:\n\n- Use negative space strategically\n- Limit your color palette\n- Choose typography carefully\n- Reduce the number of interactive elements\n- Hide complexity behind progressive disclosure\n\n## Conclusion\n\nThe goal of minimalist design isn't to remove as much as possible—it's to include only what's necessary. When done well, minimalist digital products feel effortless, intuitive, and even joyful to use, creating experiences that respect users' time and attention.",
        featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
        categoryId: createdCategories[0].id,
        authorId: createdAuthor.id,
        readTime: 5,
        isFeatured: true,
        isPromoted: false,
        published: true,
        metaTitle: "The Art of Minimalism in Digital Product Design",
        metaDescription: "Learn how minimalist design principles can improve the usability and meaning of your digital products",
        metaKeywords: "minimalism, design, ux, product design"
      },
      {
        title: "The Future of Web Development: What's Coming in 2024",
        slug: "future-web-development-2024",
        excerpt: "Exploring emerging technologies and methodologies shaping the future of web development.",
        content: "# The Future of Web Development: What's Coming in 2024\n\nWeb development continues to evolve at a breathtaking pace. As we look ahead to 2024, several emerging technologies and methodologies are poised to redefine how we build for the web.\n\n## AI-Assisted Development\n\nArtificial intelligence is already transforming web development workflows. In 2024, we'll see even more sophisticated AI tools that can:\n\n- Generate and optimize code based on natural language descriptions\n- Identify and fix bugs before they reach production\n- Automate testing across different devices and platforms\n- Create personalized user experiences at scale\n\n## WebAssembly Goes Mainstream\n\nWebAssembly (Wasm) has been promising to revolutionize web performance for years, but 2024 looks to be when it truly goes mainstream. With growing language support and integration into standard development workflows, Wasm will enable:\n\n- Near-native performance for complex web applications\n- Better cross-platform compatibility\n- More powerful in-browser capabilities for graphics, gaming, and computation\n\n## The Rise of Edge Computing\n\nEdge computing pushes processing closer to where data is created, reducing latency and improving performance. For web developers, this means:\n\n- Faster, more responsive applications\n- Reduced server costs\n- Better user experiences for global audiences\n- New architectural patterns for distributed applications\n\n## Sustainability-Focused Development\n\nAs awareness of the web's environmental impact grows, 2024 will see more focus on sustainable web development practices:\n\n- Energy-efficient coding patterns\n- Green hosting solutions\n- Performance optimization as an environmental concern\n- Tools for measuring and reducing digital carbon footprints\n\n## Conclusion\n\nThe future of web development is exciting, challenging, and full of possibilities. By embracing these emerging trends while staying grounded in fundamentals like accessibility, security, and user experience, developers can create web experiences that are not just cutting-edge but truly valuable for users.",
        featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        categoryId: createdCategories[1].id,
        authorId: createdAuthor.id,
        readTime: 8,
        isFeatured: true,
        isPromoted: true,
        published: true,
        metaTitle: "The Future of Web Development: What's Coming in 2024",
        metaDescription: "Discover the emerging technologies and methodologies that will shape web development in 2024",
        metaKeywords: "web development, future tech, WebAssembly, AI, edge computing"
      },
      {
        title: "Daily Meditation Practices for Busy Professionals",
        slug: "daily-meditation-practices-busy-professionals",
        excerpt: "Simple meditation techniques that can be integrated into even the busiest schedules.",
        content: "# Daily Meditation Practices for Busy Professionals\n\nIn our fast-paced, always-connected work environments, finding moments of stillness can seem impossible. Yet, the busier we are, the more we need meditation. Here are practical approaches to meditation that fit into even the most demanding schedules.\n\n## Why Busy Professionals Need Meditation\n\nThe benefits of regular meditation are particularly valuable for those with demanding careers:\n\n- Improved focus and concentration\n- Better stress management\n- Enhanced creative thinking\n- More effective decision-making\n- Greater emotional resilience\n\n## Micro-Meditation Practices\n\nYou don't need 30 minutes on a cushion to benefit from meditation. These micro-practices can be integrated throughout your day:\n\n### 1. Three-Breath Reset (30 seconds)\n\nBetween meetings or tasks, take three conscious breaths:\n- First breath: Notice your body\n- Second breath: Relax any tension\n- Third breath: Set an intention for the next activity\n\n### 2. Sensory Anchor (1 minute)\n\nWhen feeling overwhelmed:\n- Pause and notice 5 things you can see\n- 4 things you can touch\n- 3 things you can hear\n- 2 things you can smell\n- 1 thing you can taste\n\n### 3. Walking Meditation (5 minutes)\n\nDuring a necessary walk (to a meeting, to get coffee):\n- Slow your pace slightly\n- Feel each step connecting with the ground\n- Notice the sensations of walking\n- When your mind wanders, gently return to the physical experience\n\n## Morning Mini-Practice (5-10 minutes)\n\nStarting your day with a brief meditation creates a foundation of mindfulness:\n\n1. Sit comfortably with a straight spine\n2. Close your eyes or maintain a soft gaze\n3. Bring attention to your natural breath for 2-3 minutes\n4. Ask yourself: \"What matters most today?\"\n5. Set an intention for the day ahead\n\n## Conclusion\n\nConsistent, brief practices are more valuable than occasional longer sessions. Start with just one technique that resonates with you, and remember that meditation isn't about stopping thoughts—it's about developing a different relationship with them. Even the busiest professional can find moments throughout the day to pause, breathe, and reconnect with the present moment.",
        featuredImage: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a",
        categoryId: createdCategories[3].id,
        authorId: createdAuthor.id,
        readTime: 4,
        isFeatured: false,
        isPromoted: false,
        published: true,
        metaTitle: "Daily Meditation Practices for Busy Professionals",
        metaDescription: "Discover simple meditation techniques that fit into even the busiest schedules",
        metaKeywords: "meditation, mindfulness, stress management, busy professionals, mental health"
      },
      {
        title: "The Perfect Morning Routine for Creative Thinking",
        slug: "perfect-morning-routine-creative-thinking",
        excerpt: "How to structure your mornings to optimize creativity and focus throughout the day.",
        content: "# The Perfect Morning Routine for Creative Thinking\n\nThe first hours of your day can set the tone for your creative output and mental clarity. By designing an intentional morning routine, you create the conditions for innovative thinking and sustained focus.\n\n## The Science of Morning Creativity\n\nResearch suggests that many people experience peak creative thinking abilities in the morning. This is partly because:\n\n- The prefrontal cortex (responsible for creative thinking) is most active after sleep\n- Stress hormones are naturally lower upon waking\n- The mind is less cluttered before the day's demands accumulate\n\n## Building Your Creative Morning Routine\n\n### 1. Protect the First Hour\n\nThe most important principle is to preserve the first hour after waking for activities that nourish creativity rather than deplete it:\n\n- **Avoid checking emails, messages, and news**\n- **Delay social media consumption**\n- **Create before you consume**\n\n### 2. Core Elements of a Creative Morning\n\n#### Mind-Clearing Ritual (10-15 minutes)\nBegin with a practice that clears mental space:\n- Meditation\n- Morning pages (three pages of stream-of-consciousness writing)\n- Light stretching or yoga\n\n#### Idea Capture (5-10 minutes)\nBefore your inner critic awakens:\n- Keep a dedicated idea notebook by your bed\n- Write down any ideas, images, or thoughts without judgment\n- Ask yourself one creative question to explore\n\n#### Creative Consumption (15-20 minutes)\nFeed your mind with inspiring material:\n- Read poetry or fiction\n- Look at art books\n- Listen to instrumental music\n\n#### Focus Block (30-60 minutes)\nWork on your most important creative project:\n- Set a clear, achievable objective\n- Eliminate all distractions\n- Work in complete concentration\n\n## Supporting Elements\n\nThese additional factors can enhance your creative morning routine:\n\n- **Physical movement** to increase blood flow to the brain\n- **Natural light exposure** to regulate circadian rhythms\n- **Hydration** to optimize brain function\n- **Minimizing decisions** about non-creative matters (prepare clothes, food, etc., the night before)\n\n## Conclusion\n\nThe perfect morning routine isn't about rigid adherence to a formula—it's about creating the conditions that work best for your unique creative process. Experiment with these elements, observe what enhances your thinking, and gradually build a morning practice that consistently fuels your creative work.",
        featuredImage: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9",
        categoryId: createdCategories[2].id,
        authorId: createdAuthor.id,
        readTime: 6,
        isFeatured: false,
        isPromoted: false,
        published: true,
        metaTitle: "The Perfect Morning Routine for Creative Thinking",
        metaDescription: "How to structure your mornings to maximize creativity and mental clarity",
        metaKeywords: "creativity, morning routine, productivity, focus, creative thinking"
      }
    ];
    
    for (const post of postData) {
      const [createdPost] = await db.insert(posts).values(post).returning();
      log(`Created post: ${createdPost.title}`, "seed");
    }
    
    log("Database seeding completed successfully!", "seed");
  } catch (error) {
    log(`Error during database seeding: ${error}`, "seed");
    throw error;
  }
}

// Export the seed function to be called from index.ts
export default seed;