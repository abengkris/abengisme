import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, LogIn, Mail, Key, Shield, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

// Login schema
const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

// Register schema
const registerSchema = insertUserSchema.pick({
  username: true,
  email: true,
  password: true,
}).extend({
  confirmPassword: z.string(),
}).refine(
  (values) => values.password === values.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  }
);

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      },
    });
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    
    // Add required fields for the user
    const completeUserData = {
      ...registerData,
      role: "user" as const,
      isPremium: false,
      isActive: true,
    };
    
    registerMutation.mutate(completeUserData, {
      onSuccess: () => {
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
      },
    });
  };

  // If user is redirecting, return null
  if (user) return null;

  return (
    <>
      <SEO
        title="Sign In | MindfulThoughts"
        description="Sign in to your MindfulThoughts account or create a new one to access exclusive content."
      />
      
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100">
              {/* Form Section */}
              <div className="p-8 md:p-12 lg:p-16">
                <div className="mb-8 text-center md:text-left">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                    {isLoggingIn ? 'Welcome Back' : 'Join MindfulThoughts'}
                  </h1>
                  <p className="text-muted-foreground">
                    {isLoggingIn 
                      ? 'Sign in to access your personalized content and features'
                      : 'Create an account to join our community of mindful thinkers'
                    }
                  </p>
                </div>
                
                <Tabs 
                  defaultValue="login" 
                  onValueChange={(value) => setIsLoggingIn(value === 'login')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login" className="flex items-center justify-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center justify-center">
                      <User className="w-4 h-4 mr-2" />
                      Register
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="johnsmith" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-accent hover:bg-accent/90 text-white"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Signing in...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign In
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="johnsmith" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-accent hover:bg-accent/90 text-white mt-2"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating account...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Create Account
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Hero Section */}
              <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-accent/90 to-accent/70 text-white p-12 lg:p-16 h-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,0 L100,0 L100,100 Z" fill="white" />
                  </svg>
                </div>
                
                <div className="relative z-10 max-w-md text-center lg:text-right">
                  <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-5">Discover Mindful Thoughts</h2>
                  <p className="text-white/90 mb-6">
                    Join our community of mindful thinkers and gain access to thought-provoking articles, personal growth resources, and a supportive community.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium mb-1">Ad-Free Experience</h3>
                        <p className="text-sm text-white/80">Upgrade to premium for an ad-free reading experience</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium mb-1">Premium Content</h3>
                        <p className="text-sm text-white/80">Exclusive access to in-depth articles and resources</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium mb-1">Community Access</h3>
                        <p className="text-sm text-white/80">Connect with like-minded individuals on their mindfulness journey</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;