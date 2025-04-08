import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { AuthProvider } from "@/hooks/use-auth";
import { useAuth } from "@/hooks/use-auth";
import PageViewTracker from "@/components/analytics/PageViewTracker";

const SinglePost = React.lazy(() => import("@/pages/SinglePost"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const AdminNewPost = React.lazy(() => import("@/pages/AdminNewPost"));
const AdminEditPost = React.lazy(() => import("@/pages/AdminEditPost"));
const Analytics = React.lazy(() => import("@/pages/Analytics"));

function Router() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={SinglePost} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/auth" component={AuthPage} />

          {/* Protected Admin Routes */}
          <Route path="/admin">{() => (user ? <Admin /> : <AuthPage />)}</Route>
          <Route path="/admin/posts/new">
            {() => (user ? <AdminNewPost /> : <AuthPage />)}
          </Route>
          <Route path="/admin/posts/:id/edit">
            {() => (user ? <AdminEditPost /> : <AuthPage />)}
          </Route>
          <Route path="/admin/analytics">
            {() =>
              user && user.role === "admin" ? <Analytics /> : <AuthPage />
            }
          </Route>

          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdSenseScript
            onLoad={() => console.log("AdSense loaded successfully")}
            onError={(error) => console.error("AdSense error:", error)}
          />

          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pb-16 md:pb-0">
              <Router />
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
          <Toaster />
          <PageViewTracker />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
