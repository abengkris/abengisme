import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  twitterHandle?: string;
  breadcrumbs?: BreadcrumbItem[];
  category?: string;
  readTime?: number;
  isAmp?: boolean;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Alex Morgan',
  twitterHandle = '@mindfulthoughts',
  breadcrumbs = [],
  category,
  readTime,
  isAmp = false,
  canonical
}) => {
  const [location] = useLocation();
  const siteTitle = 'Mindful Thoughts | A Personal Blog';
  const fullTitle = title === siteTitle ? title : `${title} | Mindful Thoughts`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = url || `${origin}${location}`;
  const canonicalUrl = canonical || currentUrl;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Mindful Thoughts" />
      {readTime && <meta property="og:reading_time" content={`${readTime} minutes`} />}
      
      {/* Twitter card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}
      
      {/* Additional tags for SEO optimization */}
      {isAmp && <link rel="amphtml" href={`${currentUrl}/amp`} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {`
          {
            "@context": "http://schema.org",
            "@type": "${type === 'article' ? 'BlogPosting' : 'WebSite'}",
            "name": "${fullTitle}",
            "headline": "${title}",
            "description": "${description}",
            "image": "${image}",
            "url": "${currentUrl}",
            ${publishedTime ? `"datePublished": "${publishedTime}",` : ''}
            ${modifiedTime ? `"dateModified": "${modifiedTime}",` : ''}
            ${readTime ? `"timeRequired": "PT${readTime}M",` : ''}
            ${type === 'article' && category ? `"articleSection": "${category}",` : ''}
            ${type === 'article' ? `
            "author": {
              "@type": "Person",
              "name": "${author}"
            },
            ` : ''}
            "publisher": {
              "@type": "Organization",
              "name": "Mindful Thoughts",
              "logo": {
                "@type": "ImageObject",
                "url": "${origin}/logo.png"
              }
            }
            ${breadcrumbs.length > 0 ? `,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                ${breadcrumbs.map((item, index) => `{
                  "@type": "ListItem",
                  "position": ${index + 1},
                  "name": "${item.name}",
                  "item": "${item.url}"
                }`).join(',')}
              ]
            }` : ''}
          }
        `}
      </script>
      
      {/* WebSite Schema for homepage */}
      {type === 'website' && location === '/' && (
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Mindful Thoughts",
              "url": "${origin}",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "${origin}/blog?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
