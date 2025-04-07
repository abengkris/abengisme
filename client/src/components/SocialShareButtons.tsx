import { cn } from '@/lib/utils';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Link2, 
  MessageCircle 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  vertical?: boolean;
  className?: string;
}

export function SocialShareButtons({
  url,
  title,
  description = '',
  vertical = false,
  className
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Ensure the URL is absolute
  const shareUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');
  
  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-sky-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-green-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:text-orange-500'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy the link. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn(
      'flex gap-2',
      vertical ? 'flex-col' : 'flex-row flex-wrap',
      className
    )}>
      <TooltipProvider>
        {shareLinks.map((link) => (
          <Tooltip key={link.name}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <link.icon className={cn('h-4 w-4', link.color)} />
                <span className="sr-only">Share on {link.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on {link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={copyToClipboard}
            >
              <Link2 className={cn('h-4 w-4', copied ? 'text-green-500' : 'hover:text-blue-500')} />
              <span className="sr-only">Copy link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? 'Copied!' : 'Copy link'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}