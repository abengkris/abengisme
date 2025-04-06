import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="font-serif text-xl font-bold">
                  Mindful<span className="text-accent">Thoughts</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Exploring design, technology, and mindful living.
              </p>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 md:mb-0">
              <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
          
          <hr className="border-neutral-200 my-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MindfulThoughts. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
