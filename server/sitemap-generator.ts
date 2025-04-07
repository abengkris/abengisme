import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db';
import { posts, categories, authors } from '../shared/schema';

// ES module conversion for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sitemap Generator
 * 
 * This script generates a sitemap.xml file based on the actual content in the database.
 * It can be run periodically (e.g., daily) to keep the sitemap up to date.
 */
async function generateSitemap() {
  try {
    const baseUrl = process.env.BASE_URL || 'https://mindfulthoughts.com';
    const publicDir = path.join(__dirname, '../client/public');
    
    // Ensure the public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Fetch all posts, categories, and other dynamic content
    const allPosts = await db.select().from(posts);
    const allCategories = await db.select().from(categories);
    const allAuthors = await db.select().from(authors);
    
    // Build the sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    const staticPages = [
      { url: '/', changefreq: 'weekly', priority: '1.0' },
      { url: '/blog', changefreq: 'daily', priority: '0.9' },
      { url: '/about', changefreq: 'monthly', priority: '0.7' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/auth', changefreq: 'monthly', priority: '0.6' },
    ];
    
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    // Add blog posts
    allPosts.forEach(post => {
      const postUrl = `/blog/${post.slug}`;
      const lastmod = post.updatedAt 
        ? new Date(post.updatedAt).toISOString().split('T')[0]
        : new Date(post.createdAt).toISOString().split('T')[0];
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${postUrl}</loc>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '  </url>\n';
    });
    
    // Add category pages
    allCategories.forEach(category => {
      const categoryUrl = `/blog?category=${category.id}`;
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${categoryUrl}</loc>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    });
    
    // Add author pages
    allAuthors.forEach(author => {
      const authorUrl = `/author/${author.id}`;
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${authorUrl}</loc>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    });
    
    // Close the sitemap
    sitemap += '</urlset>';
    
    // Write the sitemap to the public directory
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    
    console.log('[sitemap] Sitemap generated successfully!');
  } catch (error) {
    console.error('[sitemap] Error generating sitemap:', error);
  }
}

// Allow this to be imported and run programmatically
export { generateSitemap };

// Auto-generate sitemap on import in development
// This is a simple workaround for ES modules
generateSitemap()
  .then(() => {
    console.log('[sitemap] Initial sitemap generated on server start');
  })
  .catch(error => {
    console.error('[sitemap] Failed to generate initial sitemap:', error);
  });