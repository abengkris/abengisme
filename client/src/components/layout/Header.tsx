import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') return location === path;
    return location.startsWith(path);
  };

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold">
              Mindful<span className="text-accent">Thoughts</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`nav-link text-primary hover:text-accent transition-colors ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/blog" className={`nav-link text-primary hover:text-accent transition-colors ${isActive('/blog') ? 'active' : ''}`}>
              Blog
            </Link>
            <Link href="/about" className={`nav-link text-primary hover:text-accent transition-colors ${isActive('/about') ? 'active' : ''}`}>
              About
            </Link>
            <Link href="/contact" className={`nav-link text-primary hover:text-accent transition-colors ${isActive('/contact') ? 'active' : ''}`}>
              Contact
            </Link>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-white border-b border-neutral-200 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-4 py-2">
            <Link href="/" className="text-primary hover:text-accent transition-colors py-2">
              Home
            </Link>
            <Link href="/blog" className="text-primary hover:text-accent transition-colors py-2">
              Blog
            </Link>
            <Link href="/about" className="text-primary hover:text-accent transition-colors py-2">
              About
            </Link>
            <Link href="/contact" className="text-primary hover:text-accent transition-colors py-2">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
