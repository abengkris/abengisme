import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SubscribeFormValues = z.infer<typeof subscribeSchema>;

const NewsletterForm: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const subscribeMutation = useMutation({
    mutationFn: (data: SubscribeFormValues) => {
      return apiRequest('POST', '/api/subscribe', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to the newsletter.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to subscribe",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: SubscribeFormValues) => {
    subscribeMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="btn-primary bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-md whitespace-nowrap"
            disabled={subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">I respect your privacy. Unsubscribe at any time.</p>
      </form>
    </Form>
  );
};

export default NewsletterForm;
