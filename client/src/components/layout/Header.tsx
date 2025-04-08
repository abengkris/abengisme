import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useScrollEffect } from '@/hooks/use-scroll-effect';
import { cn } from '@/lib/utils';
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
  LayoutDashboard,
  Search
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
  const { user, isPremium, loginMutation, logoutMutation } = useAuth();

  const { visible } = useScrollEffect({
    hideOnScrollDown: true,
    threshold: 50,
    alwaysShowAtTop: true
  });

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const isScrolled = window.scrollY > 10;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  };

  React.useEffect(() => {
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

  const headerClasses = cn(
    "fixed left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl transition-all duration-300 ease-in-out px-4 sm:px-6",
    scrolled 
      ? "bg-background/95 dark:bg-background/95 shadow-xl dark:shadow-accent/5 backdrop-blur-xl" 
      : "bg-background/80 dark:bg-background/70 backdrop-blur-md border border-border/30 dark:border-border/20",
    visible ? "top-3 md:top-5 translate-y-0" : "-top-20 translate-y-0"
  );

  const navLinkClasses = (isActivePath: boolean) => cn(
    "nav-link flex items-center px-3 py-2 rounded-xl transition-all text-sm font-medium",
    "hover:bg-muted/80 dark:hover:bg-muted/10",
    isActivePath ? "text-accent bg-accent/10 dark:bg-accent/20" : "text-foreground/80"
  );

  return (
    <header className={headerClasses}>
      <div className="flex justify-between items-center h-14 md:h-16">
        <Link href="/" className="flex items-center group">
          <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">
            Mindful<span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent group-hover:to-accent transition-all">Thoughts</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/" className={navLinkClasses(isActive('/'))}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <Link href="/blog" className={navLinkClasses(isActive('/blog'))}>
            <BookOpen className="w-4 h-4 mr-2" />
            Blog
          </Link>
          <Link href="/about" className={navLinkClasses(isActive('/about'))}>
            <Info className="w-4 h-4 mr-2" />
            About
          </Link>
          <Link href="/contact" className={navLinkClasses(isActive('/contact'))}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact
          </Link>
          <Link href="/search" className={navLinkClasses(isActive('/search'))}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Link>

          <div className="h-8 w-px bg-border/50 dark:bg-border/30 mx-2"></div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-3 py-2 rounded-xl hover:bg-muted/80 dark:hover:bg-muted/10 transition-all">
                <div className="flex items-center text-sm font-medium">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                  <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2" sideOffset={20}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
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
            <Link href="/auth" className="flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          )}
        </nav>

        <div className="flex items-center md:hidden gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="User menu">
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors">
                  <User className="w-5 h-5 text-accent" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2" sideOffset={20}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
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
            <Link href="/auth" className="flex items-center justify-center w-9 h-9 bg-accent text-white rounded-xl">
              <LogIn className="w-5 h-5" />
            </Link>
          )}

          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-muted/80 dark:hover:bg-muted/10 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className={cn("w-5 h-5 transition-transform", mobileMenuOpen && "transform rotate-90")} />
          </button>
        </div>
      </div>

      <div 
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+0.75rem)] transform transition-all duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <nav className="bg-card/95 dark:bg-card/95 backdrop-blur-lg rounded-xl shadow-lg dark:shadow-accent/5 overflow-hidden border border-border/30">
          <div className="flex flex-col py-2">
            <Link href="/" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/') ? 'text-accent font-medium' : 'text-foreground/80')}>
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>
            <Link href="/blog" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/blog') ? 'text-accent font-medium' : 'text-foreground/80')}>
              <BookOpen className="w-5 h-5 mr-3" />
              Blog
            </Link>
            <Link href="/about" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/about') ? 'text-accent font-medium' : 'text-foreground/80')}>
              <Info className="w-5 h-5 mr-3" />
              About
            </Link>
            <Link href="/contact" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/contact') ? 'text-accent font-medium' : 'text-foreground/80')}>
              <MessageSquare className="w-5 h-5 mr-3" />
              Contact
            </Link>
            <Link href="/search" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/search') ? 'text-accent font-medium' : 'text-foreground/80')}>
              <Search className="w-5 h-5 mr-3" />
              Search
            </Link>

            {user && user.role === 'admin' && (
              <>
                <div className="h-px bg-border/30 dark:bg-border/20 mx-4 my-2" />
                <h4 className="text-xs uppercase text-muted-foreground px-5 pt-2 pb-1">Admin</h4>
                <Link href="/admin" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/admin') && !isActive('/admin/analytics') ? 'text-accent font-medium' : 'text-foreground/80')}>
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
                <Link href="/admin/analytics" className={cn("flex items-center px-4 py-3 hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors", isActive('/admin/analytics') ? 'text-accent font-medium' : 'text-foreground/80')}>
                  <BarChart className="w-5 h-5 mr-3" />
                  Analytics
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;