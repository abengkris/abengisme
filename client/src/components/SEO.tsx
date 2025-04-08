import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string;
  readTime?: number;
  category?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function SEO({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords,
  readTime,
  category,
  breadcrumbs
}: SEOProps) {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://mindfulthoughts.com';
  const fullTitle = `${title} | Mindful Thoughts`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : 'WebPage',
    headline: title,
    description,
    image: image ? `${baseUrl}${image}` : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: author ? {
      '@type': 'Person',
      name: author
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Mindful Thoughts',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={`${baseUrl}${image}`} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={`${baseUrl}${image}`} />}

      {/* Article Specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {category && <meta property="article:section" content={category} />}
      {readTime && <meta property="article:read_time" content={String(readTime)} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}