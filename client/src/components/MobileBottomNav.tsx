import { Link, useLocation } from 'wouter';
import { useScrollEffect } from '@/hooks/use-scroll-effect';
import { cn } from '@/lib/utils';
import { Home, BookOpen, Search, User, Menu } from 'lucide-react';

export function MobileBottomNav() {
  const [location] = useLocation();
  const { visible } = useScrollEffect({
    hideOnScrollDown: true,
    threshold: 50,
    alwaysShowAtTop: true
  });

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/blog', icon: BookOpen, label: 'Blog' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/auth', icon: User, label: 'Account' },
    { href: '/menu', icon: Menu, label: 'More' }
  ];

  return (
    <div 
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <nav className="flex items-center justify-between px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                'flex flex-col items-center py-2 px-3 text-xs transition-colors',
                isActive 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}