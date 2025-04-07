import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Menu, 
  User, 
  LogIn, 
  LogOut, 
  UserCheck, 
  ChevronDown,
  Home,
  BookOpen,
  Info,
  MessageSquare,
  BarChart,
  LayoutDashboard
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, isPremium, loginMutation, logoutMutation } = useAuth();

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') return location === path;
    return location.startsWith(path);
  };

  // Floating island styling based on scroll state
  const headerClasses = scrolled
    ? "fixed top-5 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md z-50 rounded-full shadow-lg transition-all duration-300 ease-in-out"
    : "fixed top-5 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/90 backdrop-blur-sm z-50 rounded-full border border-neutral-200/50 transition-all duration-300 ease-in-out";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent to-accent/70 text-transparent bg-clip-text">
              Mindful<span className="text-primary">Thoughts</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className={`nav-link flex items-center px-4 py-2 rounded-full hover:bg-slate-100 transition-all ${isActive('/') ? 'text-accent font-medium' : 'text-primary'}`}>
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link href="/blog" className={`nav-link flex items-center px-4 py-2 rounded-full hover:bg-slate-100 transition-all ${isActive('/blog') ? 'text-accent font-medium' : 'text-primary'}`}>
              <BookOpen className="w-4 h-4 mr-1" />
              Blog
            </Link>
            <Link href="/about" className={`nav-link flex items-center px-4 py-2 rounded-full hover:bg-slate-100 transition-all ${isActive('/about') ? 'text-accent font-medium' : 'text-primary'}`}>
              <Info className="w-4 h-4 mr-1" />
              About
            </Link>
            <Link href="/contact" className={`nav-link flex items-center px-4 py-2 rounded-full hover:bg-slate-100 transition-all ${isActive('/contact') ? 'text-accent font-medium' : 'text-primary'}`}>
              <MessageSquare className="w-4 h-4 mr-1" />
              Contact
            </Link>

            {/* Divider */}
            <div className="h-8 w-px bg-neutral-200 mx-1"></div>

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 rounded-full hover:bg-slate-100 transition-all">
                  <div className="flex items-center text-sm font-medium">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <span className="hidden sm:inline">{user.username}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2" sideOffset={20} forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserCheck className="w-4 h-4 mr-2" />
                    {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
                  </DropdownMenuItem>
                  
                  {user && user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/analytics">
                          <BarChart className="w-4 h-4 mr-2" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="flex items-center px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded-full transition-all">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            )}
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            {/* Auth button for mobile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="mr-2">
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2" sideOffset={20} forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserCheck className="w-4 h-4 mr-2" />
                    {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
                  </DropdownMenuItem>
                  
                  {user && user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/analytics">
                          <BarChart className="w-4 h-4 mr-2" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="w-4 h-4 mr-2" /> 
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="mr-2 flex items-center justify-center w-9 h-9 bg-accent text-white rounded-full">
                <LogIn className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-all"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3">
          <nav className="bg-white rounded-2xl shadow-lg mt-2 overflow-hidden">
            <div className="flex flex-col py-2">
              <Link href="/" className={`flex items-center px-6 py-3 hover:bg-slate-50 transition-colors ${isActive('/') ? 'text-accent font-medium' : 'text-primary'}`}>
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>
              <Link href="/blog" className={`flex items-center px-6 py-3 hover:bg-slate-50 transition-colors ${isActive('/blog') ? 'text-accent font-medium' : 'text-primary'}`}>
                <BookOpen className="w-5 h-5 mr-3" />
                Blog
              </Link>
              <Link href="/about" className={`flex items-center px-6 py-3 hover:bg-slate-50 transition-colors ${isActive('/about') ? 'text-accent font-medium' : 'text-primary'}`}>
                <Info className="w-5 h-5 mr-3" />
                About
              </Link>
              <Link href="/contact" className={`flex items-center px-6 py-3 hover:bg-slate-50 transition-colors ${isActive('/contact') ? 'text-accent font-medium' : 'text-primary'}`}>
                <MessageSquare className="w-5 h-5 mr-3" />
                Contact
              </Link>
              
              {/* Admin links in mobile menu */}
              {user && user.role === 'admin' && (
                <>
                  <div className="h-px bg-neutral-200 mx-5 my-2" />
                  <h4 className="text-xs uppercase text-muted-foreground px-6 pt-2 pb-1">Admin</h4>
                  <Link href="/admin" className={`flex items-center px-6 py-3 hover:bg-slate-50 transition-colors ${isActive('/admin') && !isActive('/admin/analytics') ? 'text-accent font-medium' : 'text-primary'}`}>
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link href="/admin/analytics" className={`flex items-center px-6 py-3 hover:bg-slate-50 transition-colors ${isActive('/admin/analytics') ? 'text-accent font-medium' : 'text-primary'}`}>
                    <BarChart className="w-5 h-5 mr-3" />
                    Analytics
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
