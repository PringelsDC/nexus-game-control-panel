
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { 
  Server, 
  LayoutDashboard, 
  Shield, 
  Zap, 
  Network, 
  FileText,
  Play,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-game-dark to-background opacity-90"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-xl font-bold text-game-primary flex items-center">
              <Server className="h-6 w-6 mr-2" />
              <span>GamePanel</span>
            </div>
            
            <div className="space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-game-primary hover:bg-game-secondary">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-game-primary hover:bg-game-secondary">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-game-primary to-game-light animate-pulse-glow">
              Game Server Management Reimagined
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10">
              Create, configure, and control your game servers with ease. 
              Low latency, high performance, total control.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link to="/servers/new">
                  <Button size="lg" className="bg-game-primary hover:bg-game-secondary w-full sm:w-auto">
                    <Play className="h-4 w-4 mr-2" />
                    Create New Server
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="bg-game-primary hover:bg-game-secondary w-full sm:w-auto">
                    <Play className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              )}
              <Link to={user ? "/plans" : "/login"}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Plans <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-game-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Run Game Servers</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools designed specifically for gamers and server administrators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-game-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">One-Click Deployment</h3>
              <p className="text-muted-foreground">
                Deploy popular game servers with preconfigured templates. Ready to play in minutes.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Terminal className="h-6 w-6 text-game-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Real-Time Console</h3>
              <p className="text-muted-foreground">
                Access your server console directly from your browser. Monitor and command with ease.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-game-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Secure Access</h3>
              <p className="text-muted-foreground">
                Advanced authentication and role-based access control keeps your servers secure.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Folder className="h-6 w-6 text-game-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">File Manager</h3>
              <p className="text-muted-foreground">
                Browse, edit, and manage your server files through an intuitive interface.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-game-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Resource Monitoring</h3>
              <p className="text-muted-foreground">
                Track CPU, RAM, and disk usage in real-time. Optimize your server performance.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-game-primary/20 flex items-center justify-center mb-4">
                <Network className="h-6 w-6 text-game-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Network Controls</h3>
              <p className="text-muted-foreground">
                Monitor connections, configure ports, and optimize network settings for your games.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your gaming needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="mb-4">
                <h3 className="text-xl font-medium">Free Tier</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>1 Game Server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Basic Server Controls</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 1 GB RAM</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 1 vCore CPU</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 10 GB Storage</span>
                </li>
              </ul>
              
              <Link to={user ? "/dashboard" : "/register"}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-game-primary shadow-lg relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-game-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium">Basic</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span><strong>3</strong> Game Servers</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Advanced Controls</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 2 GB RAM per server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 2 vCore CPU per server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 20 GB Storage per server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Email Support</span>
                </li>
              </ul>
              
              <Link to={user ? "/plans" : "/register"}>
                <Button className="w-full bg-game-primary hover:bg-game-secondary">Subscribe</Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border hover:border-game-primary/50 transition-all">
              <div className="mb-4">
                <h3 className="text-xl font-medium">Premium</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span><strong>10</strong> Game Servers</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Premium Server Controls</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 4 GB RAM per server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 4 vCore CPU per server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Max 50 GB Storage per server</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-green-500">✓</div>
                  <span>Custom Domain</span>
                </li>
              </ul>
              
              <Link to={user ? "/plans" : "/register"}>
                <Button className="w-full">Subscribe</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-game-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Level Up Your Game Server?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of gamers who are already using GamePanel to host their servers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-game-primary hover:bg-game-secondary w-full sm:w-auto">
                {user ? "Go to Dashboard" : "Sign Up Now"}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {user ? "Manage Servers" : "Login"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Server className="h-6 w-6 text-game-primary mr-2" />
              <span className="font-bold text-xl">GamePanel</span>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-game-primary">
                Home
              </Link>
              <Link to="/login" className="text-muted-foreground hover:text-game-primary">
                Login
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-game-primary">
                Register
              </Link>
              <Link to="/plans" className="text-muted-foreground hover:text-game-primary">
                Pricing
              </Link>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; 2025 GamePanel. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-game-primary">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-game-primary">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-game-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
