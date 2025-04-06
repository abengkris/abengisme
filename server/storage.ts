import {
  users, type User, type InsertUser,
  posts, type Post, type InsertPost,
  categories, type Category, type InsertCategory,
  authors, type Author, type InsertAuthor,
  subscribers, type Subscriber, type InsertSubscriber,
  messages, type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private categories: Map<number, Category>;
  private authors: Map<number, Author>;
  private subscribers: Map<number, Subscriber>;
  private messages: Map<number, Message>;
  
  userCurrentId: number;
  postCurrentId: number;
  categoryCurrentId: number;
  authorCurrentId: number;
  subscriberCurrentId: number;
  messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.categories = new Map();
    this.authors = new Map();
    this.subscribers = new Map();
    this.messages = new Map();
    
    this.userCurrentId = 1;
    this.postCurrentId = 1;
    this.categoryCurrentId = 1;
    this.authorCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.messageCurrentId = 1;
    
    // Add some initial data
    this.initializeData();
  }

  // Initialize sample data
  private initializeData() {
    // Create default author
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
    this.createAuthor(author);
    
    // Create categories
    const categories = [
      { name: "Design", slug: "design" },
      { name: "Technology", slug: "technology" },
      { name: "Productivity", slug: "productivity" },
      { name: "Mindfulness", slug: "mindfulness" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Create sample posts
    const posts: InsertPost[] = [
      {
        title: "The Art of Minimalism in Digital Product Design",
        slug: "art-of-minimalism-digital-product-design",
        excerpt: "How simplicity in design can lead to better user experiences and more meaningful digital products.",
        content: "# The Art of Minimalism in Digital Product Design\n\nIn the world of digital product design, less is often more. Minimalism isn't just an aesthetic choice; it's a fundamental approach to creating more usable, accessible, and meaningful digital experiences.\n\n## Why Minimalism Matters\n\nMinimalist design reduces cognitive load on users, allowing them to focus on what truly matters: the content and core functionality. By eliminating unnecessary elements, you create space for the essential to breathe and stand out.\n\n## Key Principles of Minimalist Design\n\n1. **Simplicity**: Remove everything that doesn't serve a clear purpose\n2. **Clarity**: Make the interface intuitive and self-explanatory\n3. **Focus**: Direct attention to what matters most\n4. **Balance**: Create harmony between elements\n5. **Intentionality**: Every element should exist for a reason\n\n## Practical Applications\n\nMinimalism isn't about making everything white and bland. It's about intentionality. Here are some ways to apply minimalist principles:\n\n- Use negative space strategically\n- Limit your color palette\n- Choose typography carefully\n- Reduce the number of interactive elements\n- Hide complexity behind progressive disclosure\n\n## Conclusion\n\nThe goal of minimalist design isn't to remove as much as possible—it's to include only what's necessary. When done well, minimalist digital products feel effortless, intuitive, and even joyful to use, creating experiences that respect users' time and attention.",
        featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
        categoryId: 1,
        authorId: 1,
        readTime: 5,
        isFeatured: true,
        published: true
      },
      {
        title: "The Future of Web Development: What's Coming in 2024",
        slug: "future-web-development-2024",
        excerpt: "Exploring emerging technologies and methodologies shaping the future of web development.",
        content: "# The Future of Web Development: What's Coming in 2024\n\nWeb development continues to evolve at a breathtaking pace. As we look ahead to 2024, several emerging technologies and methodologies are poised to redefine how we build for the web.\n\n## AI-Assisted Development\n\nArtificial intelligence is already transforming web development workflows. In 2024, we'll see even more sophisticated AI tools that can:\n\n- Generate and optimize code based on natural language descriptions\n- Identify and fix bugs before they reach production\n- Automate testing across different devices and platforms\n- Create personalized user experiences at scale\n\n## WebAssembly Goes Mainstream\n\nWebAssembly (Wasm) has been promising to revolutionize web performance for years, but 2024 looks to be when it truly goes mainstream. With growing language support and integration into standard development workflows, Wasm will enable:\n\n- Near-native performance for complex web applications\n- Better cross-platform compatibility\n- More powerful in-browser capabilities for graphics, gaming, and computation\n\n## The Rise of Edge Computing\n\nEdge computing pushes processing closer to where data is created, reducing latency and improving performance. For web developers, this means:\n\n- Faster, more responsive applications\n- Reduced server costs\n- Better user experiences for global audiences\n- New architectural patterns for distributed applications\n\n## Sustainability-Focused Development\n\nAs awareness of the web's environmental impact grows, 2024 will see more focus on sustainable web development practices:\n\n- Energy-efficient coding patterns\n- Green hosting solutions\n- Performance optimization as an environmental concern\n- Tools for measuring and reducing digital carbon footprints\n\n## Conclusion\n\nThe future of web development is exciting, challenging, and full of possibilities. By embracing these emerging trends while staying grounded in fundamentals like accessibility, security, and user experience, developers can create web experiences that are not just cutting-edge but truly valuable for users.",
        featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        categoryId: 2,
        authorId: 1,
        readTime: 8,
        isFeatured: true,
        published: true
      },
      {
        title: "Daily Meditation Practices for Busy Professionals",
        slug: "daily-meditation-practices-busy-professionals",
        excerpt: "Simple meditation techniques that can be integrated into even the busiest schedules.",
        content: "# Daily Meditation Practices for Busy Professionals\n\nIn our fast-paced, always-connected work environments, finding moments of stillness can seem impossible. Yet, the busier we are, the more we need meditation. Here are practical approaches to meditation that fit into even the most demanding schedules.\n\n## Why Busy Professionals Need Meditation\n\nThe benefits of regular meditation are particularly valuable for those with demanding careers:\n\n- Improved focus and concentration\n- Better stress management\n- Enhanced creative thinking\n- More effective decision-making\n- Greater emotional resilience\n\n## Micro-Meditation Practices\n\nYou don't need 30 minutes on a cushion to benefit from meditation. These micro-practices can be integrated throughout your day:\n\n### 1. Three-Breath Reset (30 seconds)\n\nBetween meetings or tasks, take three conscious breaths:\n- First breath: Notice your body\n- Second breath: Relax any tension\n- Third breath: Set an intention for the next activity\n\n### 2. Sensory Anchor (1 minute)\n\nWhen feeling overwhelmed:\n- Pause and notice 5 things you can see\n- 4 things you can touch\n- 3 things you can hear\n- 2 things you can smell\n- 1 thing you can taste\n\n### 3. Walking Meditation (5 minutes)\n\nDuring a necessary walk (to a meeting, to get coffee):\n- Slow your pace slightly\n- Feel each step connecting with the ground\n- Notice the sensations of walking\n- When your mind wanders, gently return to the physical experience\n\n## Morning Mini-Practice (5-10 minutes)\n\nStarting your day with a brief meditation creates a foundation of mindfulness:\n\n1. Sit comfortably with a straight spine\n2. Close your eyes or maintain a soft gaze\n3. Bring attention to your natural breath for 2-3 minutes\n4. Ask yourself: \"What matters most today?\"\n5. Set an intention for the day ahead\n\n## Conclusion\n\nConsistent, brief practices are more valuable than occasional longer sessions. Start with just one technique that resonates with you, and remember that meditation isn't about stopping thoughts—it's about developing a different relationship with them. Even the busiest professional can find moments throughout the day to pause, breathe, and reconnect with the present moment.",
        featuredImage: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a",
        categoryId: 4,
        authorId: 1,
        readTime: 4,
        isFeatured: false,
        published: true
      },
      {
        title: "The Perfect Morning Routine for Creative Thinking",
        slug: "perfect-morning-routine-creative-thinking",
        excerpt: "How to structure your mornings to optimize creativity and focus throughout the day.",
        content: "# The Perfect Morning Routine for Creative Thinking\n\nThe first hours of your day can set the tone for your creative output and mental clarity. By designing an intentional morning routine, you create the conditions for innovative thinking and sustained focus.\n\n## The Science of Morning Creativity\n\nResearch suggests that many people experience peak creative thinking abilities in the morning. This is partly because:\n\n- The prefrontal cortex (responsible for creative thinking) is most active after sleep\n- Stress hormones are naturally lower upon waking\n- The mind is less cluttered before the day's demands accumulate\n\n## Building Your Creative Morning Routine\n\n### 1. Protect the First Hour\n\nThe most important principle is to preserve the first hour after waking for activities that nourish creativity rather than deplete it:\n\n- **Avoid checking emails, messages, and news**\n- **Delay social media consumption**\n- **Create before you consume**\n\n### 2. Core Elements of a Creative Morning\n\n#### Mind-Clearing Ritual (10-15 minutes)\nBegin with a practice that clears mental space:\n- Meditation\n- Morning pages (three pages of stream-of-consciousness writing)\n- Light stretching or yoga\n\n#### Idea Capture (5-10 minutes)\nBefore your inner critic awakens:\n- Keep a dedicated idea notebook by your bed\n- Write down any ideas, images, or thoughts without judgment\n- Ask yourself one creative question to explore\n\n#### Creative Consumption (15-20 minutes)\nFeed your mind with inspiring material:\n- Read poetry or fiction\n- Look at art books\n- Listen to instrumental music\n\n#### Focus Block (30-60 minutes)\nWork on your most important creative project:\n- Set a clear, achievable objective\n- Eliminate all distractions\n- Work in complete concentration\n\n## Supporting Elements\n\nThese additional factors can enhance your creative morning routine:\n\n- **Physical movement** to increase blood flow to the brain\n- **Natural light exposure** to regulate circadian rhythms\n- **Hydration** to optimize brain function\n- **Minimizing decisions** about non-creative matters (prepare clothes, food, etc., the night before)\n\n## Conclusion\n\nThe perfect morning routine isn't about rigid adherence to a formula—it's about creating the conditions that work best for your unique creative process. Experiment with these elements, observe what enhances your thinking, and gradually build a morning practice that consistently fuels your creative work.",
        featuredImage: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9",
        categoryId: 3,
        authorId: 1,
        readTime: 6,
        isFeatured: false,
        published: true
      },
      {
        title: "User-Centered Design: Principles for Better Products",
        slug: "user-centered-design-principles-better-products",
        excerpt: "Essential principles of user-centered design that lead to more successful digital products.",
        content: "# User-Centered Design: Principles for Better Products\n\nUser-centered design (UCD) isn't just a methodology—it's a mindset that places real human needs at the core of every design decision. When properly implemented, UCD leads to products that are not only more usable but also more successful in the market.\n\n## Foundational Principles\n\n### 1. Early and Continuous User Involvement\n\nInvolve actual users from the beginning and throughout the development process:\n\n- Conduct user interviews and contextual inquiry\n- Use participatory design sessions\n- Maintain ongoing feedback loops\n\nThis principle ensures you're solving real problems rather than assumed ones.\n\n### 2. Empirical Measurement\n\nBase decisions on observed user behavior, not assumptions:\n\n- Establish clear usability metrics\n- Test with representative users\n- Measure success against user performance, not feature completion\n\n### 3. Iterative Design\n\nDesign is a cycle, not a linear process:\n\n- Create preliminary designs\n- Test with users\n- Refine based on feedback\n- Repeat\n\n## Practical Implementation\n\n### User Research Techniques\n\nEffective UCD begins with understanding your users through:\n\n- **Interviews**: One-on-one conversations to uncover needs, goals, and pain points\n- **Surveys**: Quantitative data to identify patterns across larger user groups\n- **Usability Testing**: Observing users interacting with your product\n- **Journey Mapping**: Visualizing the complete user experience\n- **Personas**: Creating archetypal users based on research\n\n### Design Frameworks\n\nStructured approaches to applying UCD include:\n\n1. **Double Diamond**: Discover, define, develop, deliver\n2. **Design Thinking**: Empathize, define, ideate, prototype, test\n3. **Jobs To Be Done**: Focus on what users are trying to accomplish\n\n## Common Pitfalls to Avoid\n\n- **Confusing UCD with User Testing**: UCD is a comprehensive approach, not just testing\n- **Stakeholder-Centered Design**: Letting business needs override user needs\n- **Perfection Paralysis**: Waiting for the \"perfect\" design before testing\n- **Feature Creep**: Adding functionality without validating user need\n\n## Conclusion\n\nUser-centered design is ultimately about humility—acknowledging that we don't have all the answers and that our assumptions need constant testing against reality. By bringing users into the design process early and often, listening carefully to their feedback, and iterating based on actual behavior, we create products that truly serve people's needs, solving real problems in meaningful ways.",
        featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
        categoryId: 1,
        authorId: 1,
        readTime: 7,
        isFeatured: false,
        published: true
      },
      {
        title: "Artificial Intelligence: Ethical Considerations for Designers",
        slug: "ai-ethical-considerations-designers",
        excerpt: "How designers can approach AI implementation with ethical considerations at the forefront.",
        content: "# Artificial Intelligence: Ethical Considerations for Designers\n\nAs artificial intelligence becomes increasingly integrated into product design, designers face new ethical responsibilities. Creating AI-enhanced experiences requires consideration of impacts that go beyond traditional design concerns.\n\n## The Designer's Ethical Responsibility\n\nDesigners working with AI systems have unique ethical obligations because:\n\n- AI can perpetuate or amplify existing biases\n- Design choices influence how users understand and trust AI\n- The consequences of AI decisions can have significant real-world impacts\n- Users often cannot see or understand how AI works behind interfaces\n\n## Key Ethical Considerations\n\n### 1. Transparency and Explainability\n\nUsers should understand when they're interacting with AI and comprehend how decisions affecting them are made:\n\n- Clearly indicate when AI is being used\n- Make AI decision factors understandable to users\n- Provide ways to learn more about how the system works\n- Avoid black-box experiences where outcomes seem arbitrary\n\n### 2. Data Ethics and Privacy\n\nAI systems require data, raising important questions about collection and usage:\n\n- Collect only necessary data with informed consent\n- Be transparent about how data improves the experience\n- Give users control over their data\n- Consider the environmental impact of data storage and processing\n\n### 3. Fairness and Bias\n\nAI systems can perpetuate existing biases or create new forms of discrimination:\n\n- Test across diverse user groups\n- Examine training data for representational biases\n- Monitor for disparate impacts on different users\n- Create processes for identifying and addressing bias\n\n### 4. Human Agency and Control\n\nUsers should maintain appropriate control in AI interactions:\n\n- Allow users to override AI decisions when appropriate\n- Design for collaborative intelligence, not replacement\n- Provide meaningful choices and alternatives\n- Ensure systems respect user intentions\n\n## Practical Implementation Strategies\n\n### Ethical Design Frameworks\n\nAdopt or adapt existing frameworks to guide ethical AI design:\n\n- **Ethics canvas**: Mapping ethical considerations systematically\n- **Consequence scanning**: Anticipating potential outcomes\n- **Value-sensitive design**: Incorporating human values throughout the process\n\n### Documentation Practices\n\nMaintain records of ethical considerations:\n\n- Document design decisions and their ethical rationales\n- Create model cards outlining system capabilities and limitations\n- Maintain transparency about known limitations\n\n### Ongoing Responsibility\n\nEthical design doesn't end at launch:\n\n- Monitor system performance and outcomes over time\n- Create feedback channels for ethical concerns\n- Regularly audit for emerging biases or issues\n- Update systems based on real-world impacts\n\n## Conclusion\n\nAs AI becomes more prevalent in digital products, designers have both the opportunity and responsibility to shape how these technologies integrate into people's lives. By approaching AI implementation with ethical considerations at the forefront, designers can help create systems that augment human capabilities while respecting human values, agency, and dignity.",
        featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        categoryId: 2,
        authorId: 1,
        readTime: 9,
        isFeatured: false,
        published: true
      },
      {
        title: "Digital Minimalism: Decluttering Your Digital Life",
        slug: "digital-minimalism-decluttering-digital-life",
        excerpt: "Practical steps to reduce digital noise and create a more focused work environment.",
        content: "# Digital Minimalism: Decluttering Your Digital Life\n\nIn a world of constant notifications, endless apps, and information overload, digital minimalism offers a path to reclaiming attention and creating a healthier relationship with technology.\n\n## The Cost of Digital Clutter\n\nDigital clutter impacts us in ways we often don't fully recognize:\n\n- **Fragmented attention** leading to reduced productivity\n- **Decision fatigue** from too many options and notifications\n- **Cognitive overload** causing stress and mental fatigue\n- **Digital hoarding** consuming resources and creating anxiety\n- **Time leakage** through mindless scrolling and app-switching\n\n## Core Principles of Digital Minimalism\n\n### 1. Intentionality\n\nUse technology purposefully rather than reactively:\n\n- Determine what specific value each digital tool provides\n- Question whether that value aligns with your deeper goals\n- Use technology to support your values, not replace them\n\n### 2. Optimization\n\nMaximize the benefit-to-distraction ratio of your digital tools:\n\n- Configure tools to minimize interruptions\n- Eliminate redundant apps and services\n- Automate low-value digital tasks\n\n### 3. Consolidation\n\nReduce the number of digital channels demanding attention:\n\n- Choose primary communication methods\n- Consolidate similar functions into fewer tools\n- Create single sources of truth for important information\n\n## Practical Decluttering Strategies\n\n### 1. Digital Detox\n\nBegin with a reset period:\n\n- Temporarily remove non-essential apps from your devices\n- Take 2-4 weeks to rediscover life with minimal technology\n- Gradually reintroduce only the tools that provide genuine value\n\n### 2. Home Screen Minimalism\n\nRedesign your digital entry points:\n\n- Keep only essential tools on your home screen\n- Create a \"Tools\" folder for utilities used occasionally\n- Remove all apps that don't serve a specific purpose\n\n### 3. Notification Audit\n\nTake control of your attention:\n\n- Disable all non-essential notifications\n- Batch similar notifications to specified times\n- Create \"Do Not Disturb\" schedules for focused work\n\n### 4. Information Diet\n\nCurate what you consume:\n\n- Unsubscribe from low-value newsletters and updates\n- Implement an information capture system (like Pocket or Notion)\n- Schedule specific times for consuming content\n\n### 5. Digital Filing System\n\nOrganize your digital assets:\n\n- Create a simple, consistent file structure\n- Implement a regular deletion schedule\n- Use search-friendly naming conventions\n\n## Maintaining Digital Minimalism\n\nDigital minimalism requires ongoing maintenance:\n\n- **Weekly review**: Assess new digital additions and their value\n- **Digital sabbath**: Take regular breaks from technology\n- **Value alignment check**: Regularly question if digital tools still serve your goals\n\n## Conclusion\n\nDigital minimalism isn't about rejecting technology—it's about being more intentional with how we use it. By reducing digital clutter and creating more thoughtful systems, we can use technology as a tool that enhances our focus, productivity, and well-being rather than diminishing them.",
        featuredImage: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
        categoryId: 3,
        authorId: 1,
        readTime: 5,
        isFeatured: false,
        published: true
      },
      {
        title: "Slow Reading: The Lost Art of Deep Engagement",
        slug: "slow-reading-lost-art-deep-engagement",
        excerpt: "Rediscovering the pleasure and benefits of slow, intentional reading in a fast-paced world.",
        content: "# Slow Reading: The Lost Art of Deep Engagement\n\nIn an age of skimming, scanning, and scrolling, the practice of slow reading—giving full attention to a text and absorbing it deeply—has become increasingly rare. Yet this ancient practice offers profound benefits for our thinking, creativity, and well-being.\n\n## The Decline of Deep Reading\n\nOver the past decade, our reading habits have transformed dramatically:\n\n- The average time spent reading long-form content has decreased\n- Reading is frequently interrupted by notifications\n- Many people report difficulty maintaining concentration on longer texts\n- \"Continuous partial attention\" has become our default mode\n\nThis shift has consequences beyond just reading less—it changes how we think.\n\n## The Cognitive Benefits of Slow Reading\n\nSlow, deep reading creates unique neural activities that benefit us in numerous ways:\n\n### 1. Deep Comprehension\n\nSlow reading allows time for:\n\n- Making connections between ideas\n- Questioning assumptions\n- Integrating new information with existing knowledge\n- Identifying patterns and inconsistencies\n\n### 2. Empathy Development\n\nParticularly when reading fiction, slow reading enhances:\n\n- Perspective-taking abilities\n- Understanding of complex emotional experiences\n- Recognition of social nuances\n- Sensitivity to different viewpoints\n\n### 3. Critical Thinking\n\nThe pace of slow reading enables:\n\n- Evaluation of arguments and evidence\n- Recognition of logical fallacies\n- Consideration of alternative interpretations\n- Development of counterarguments\n\n### 4. Creativity Enhancement\n\nSlow reading nurtures creativity through:\n\n- Exposure to diverse ideas and expressions\n- Activation of the default mode network in the brain\n- Creation of mental space for new connections\n- Appreciation of nuance and complexity\n\n## Practicing Slow Reading\n\n### Creating the Right Environment\n\nSlow reading requires intentional conditions:\n\n- A quiet space free from distractions\n- Physical comfort without promoting sleepiness\n- Good lighting that doesn't strain the eyes\n- All devices on silent or in another room\n- A predetermined time period (start small with 20-30 minutes)\n\n### Techniques for Deeper Engagement\n\n#### 1. Pre-reading Ritual\nPrepare your mind by:\n- Taking three deep breaths\n- Setting an intention for your reading session\n- Briefly reviewing what you already know about the subject\n\n#### 2. Dialogic Reading\nEngage with the text through:\n- Annotating in the margins\n- Asking questions as you read\n- Summarizing key points in your own words\n- Identifying passages that resonate or challenge you\n\n#### 3. Embodied Reading\nInvolve more of your senses by:\n- Reading important passages aloud\n- Visualizing scenes and concepts\n- Periodically pausing to reflect\n- Physically responding to emotional content\n\n## Slow Reading in a Fast World\n\nIncorporating slow reading into modern life requires strategy:\n\n- **Start with small, consistent sessions** rather than ambitious goals\n- **Create reading rituals** that signal to your brain it's time to slow down\n- **Join or form a reading group** for accountability and shared insights\n- **Track your reading** to recognize patterns and progress\n- **Choose physical books** when possible to limit digital distractions\n\n## Conclusion\n\nSlow reading isn't about rejecting efficiency—it's about recognizing when efficiency isn't the appropriate goal. By carving out space for deep, attentive reading, we nurture cognitive capacities that are essential for creative thinking, complex problem-solving, and meaningful human connection. In reclaiming this ancient practice, we don't just become better readers—we become more thoughtful, empathetic, and insightful human beings.",
        featuredImage: "https://images.unsplash.com/photo-1555421689-3f034debb7a6",
        categoryId: 4,
        authorId: 1,
        readTime: 4,
        isFeatured: false,
        published: true
      }
    ];
    
    posts.forEach(post => {
      this.createPost(post);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Posts
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }
  
  async getFeaturedPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.isFeatured && post.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.categoryId === categoryId && post.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postCurrentId++;
    const now = new Date();
    const post: Post = { 
      ...insertPost, 
      id, 
      createdAt: now 
    };
    this.posts.set(id, post);
    return post;
  }
  
  async updatePost(id: number, postUpdate: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost: Post = { ...post, ...postUpdate };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }
  
  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Authors
  async getAllAuthors(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }
  
  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.authors.get(id);
  }
  
  async createAuthor(insertAuthor: InsertAuthor): Promise<Author> {
    const id = this.authorCurrentId++;
    const author: Author = { ...insertAuthor, id };
    this.authors.set(id, author);
    return author;
  }
  
  // Subscribers
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberCurrentId++;
    const now = new Date();
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: now 
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  // Messages
  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      read: false,
      createdAt: now 
    };
    this.messages.set(id, message);
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage: Message = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
