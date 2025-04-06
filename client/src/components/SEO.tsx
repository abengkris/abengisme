import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  twitterHandle = '@mindfulthoughts'
}) => {
  const siteTitle = 'Mindful Thoughts | A Personal Blog';
  const fullTitle = title === siteTitle ? title : `${title} | Mindful Thoughts`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Mindful Thoughts" />
      
      {/* Twitter card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
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
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {`
          {
            "@context": "http://schema.org",
            "@type": "${type === 'article' ? 'BlogPosting' : 'WebSite'}",
            "name": "${fullTitle}",
            "headline": "${title}",
            "description": "${description}",
            ${image ? `"image": "${image}",` : ''}
            ${url ? `"url": "${url}",` : ''}
            ${publishedTime ? `"datePublished": "${publishedTime}",` : ''}
            ${modifiedTime ? `"dateModified": "${modifiedTime}",` : ''}
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
                "url": "https://mindfulthoughts.com/logo.png"
              }
            }
          }
        `}
      </script>
    </Helmet>
  );
};

export default SEO;
