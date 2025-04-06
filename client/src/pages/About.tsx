import React from 'react';
import { useAuthor } from '@/lib/api';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  // We'll assume the author ID is 1 for the default author
  const authorQuery = useAuthor(1);
  const isLoading = authorQuery.isLoading;
  
  // Parse the social links JSON if available
  const socialLinks = authorQuery.data?.social 
    ? JSON.parse(authorQuery.data.social) 
    : {
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      };

  return (
    <>
      <SEO 
        title="About Me"
        description="Learn more about Alex Morgan, the person behind Mindful Thoughts blog, focusing on design, technology, and mindful living."
        keywords="about, Alex Morgan, design, technology, mindfulness, blog author"
      />
      
      <section id="about" className="py-12 md:py-16 bg-secondary mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                {isLoading ? (
                  <Skeleton className="w-full h-80 rounded-lg" />
                ) : (
                  <img 
                    src={authorQuery.data?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9'} 
                    alt={`${authorQuery.data?.name || 'Alex Morgan'} - Blog Author`} 
                    className="rounded-lg shadow-md w-full h-auto" 
                    width="400" 
                    height="500" 
                  />
                )}
                
                <div className="mt-8">
                  <h3 className="font-serif text-xl font-bold mb-4">Connect With Me</h3>
                  {isLoading ? (
                    <div className="flex space-x-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="w-8 h-8" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <a href={socialLinks.twitter} className="text-muted-foreground hover:text-accent transition-colors" aria-label="Twitter">
                        <i className="fab fa-twitter fa-lg"></i>
                      </a>
                      <a href={socialLinks.instagram} className="text-muted-foreground hover:text-accent transition-colors" aria-label="Instagram">
                        <i className="fab fa-instagram fa-lg"></i>
                      </a>
                      <a href={socialLinks.linkedin} className="text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in fa-lg"></i>
                      </a>
                      <a href={socialLinks.github} className="text-muted-foreground hover:text-accent transition-colors" aria-label="GitHub">
                        <i className="fab fa-github fa-lg"></i>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6">About Me</h1>
                
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-5/6 h-5" />
                    <div className="h-6" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-4/5 h-5" />
                  </div>
                ) : (
                  <div className="prose prose-lg">
                    <p className="mb-4">
                      Hello! I'm {authorQuery.data?.name || 'Alex Morgan'}, a designer, developer, and writer based in San Francisco. For over a decade, I've been working at the intersection of design and technology, helping create digital products that prioritize human needs and experiences.
                    </p>
                    
                    <p className="mb-4">
                      My journey began in graphic design, evolved through UX/UI work, and eventually led me to become passionate about how design thinking can be applied to create more mindful, sustainable digital ecosystems.
                    </p>
                    
                    <p className="mb-4">
                      This blog is my space to explore ideas about design, technology trends, productivity methods, and mindful living in our increasingly digital world. I believe in thoughtful, intentional approaches to both work and life.
                    </p>
                    
                    <p className="mb-8">
                      When I'm not writing or designing, you'll find me hiking in the Marin Headlands, experimenting with new cooking techniques, or practicing meditation.
                    </p>
                    
                    <h3 className="font-serif text-xl font-bold mb-4">Areas of Expertise</h3>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-accent mr-2" />
                        User Experience Design
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-accent mr-2" />
                        Front-end Development
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-accent mr-2" />
                        Design Systems
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-accent mr-2" />
                        Digital Minimalism
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-accent mr-2" />
                        Productivity Systems
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
