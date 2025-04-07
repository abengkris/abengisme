import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import SinglePost from "@/pages/SinglePost";
import Admin from "@/pages/Admin";
import AdminNewPost from "@/pages/AdminNewPost";
import AdminEditPost from "@/pages/AdminEditPost";
import Analytics from "@/pages/Analytics";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { AuthProvider } from "@/hooks/use-auth";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={SinglePost} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin">
        {() => user ? <Admin /> : <AuthPage />}
      </Route>
      <Route path="/admin/posts/new">
        {() => user ? <AdminNewPost /> : <AuthPage />}
      </Route>
      <Route path="/admin/posts/:id/edit">
        {() => user ? <AdminEditPost /> : <AuthPage />}
      </Route>
      
      <Route path="/admin/analytics">
        {() => user && user.role === 'admin' ? <Analytics /> : <AuthPage />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Load AdSense script */}
        <AdSenseScript 
          onLoad={() => console.log('AdSense loaded successfully')}
          onError={(error) => console.error('AdSense error:', error)}
        />
        
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
