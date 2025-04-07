import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { Helmet } from 'react-helmet-async';

const Analytics = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the analytics dashboard.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Modern Blog</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          Analytics Dashboard
        </h1>
        
        <AnalyticsDashboard />
      </div>
    </>
  );
};

export default Analytics;