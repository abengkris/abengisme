import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import SEO from '@/components/SEO';
import ContactForm from '@/components/ContactForm';
import NewsletterForm from '@/components/NewsletterForm';

const Contact: React.FC = () => {
  return (
    <>
      <SEO 
        title="Contact"
        description="Get in touch with me for questions, collaborations, or just to say hello."
        keywords="contact, get in touch, message, inquiry"
      />
      
      <section id="contact" className="py-12 md:py-16 bg-secondary mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6">Get in Touch</h1>
                <p className="text-muted-foreground mb-6">
                  Have a question, suggestion, or just want to say hello? I'd love to hear from you.
                </p>
                
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href="mailto:hello@mindfulthoughts.com" className="text-accent hover:underline">
                        hello@mindfulthoughts.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-muted-foreground">San Francisco, California</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4">Follow Me</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section id="subscribe" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Join the Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Get thoughtful content on design, technology, and mindful productivity delivered to your inbox. No spam, just ideas worth sharing.
            </p>
            
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
