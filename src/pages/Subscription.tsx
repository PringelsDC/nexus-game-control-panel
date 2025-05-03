
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Basic server hosting for casual gamers',
    features: [
      '1 Game Server',
      'Max 1 GB RAM',
      'Max 1 vCore CPU',
      'Max 10 GB Disk',
      'Community Support',
    ],
    limitations: [
      'Limited Performance',
      'No Priority Support',
      'No Custom Domains',
    ],
    serverLimit: 1,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    description: 'More power for serious gamers',
    features: [
      '3 Game Servers',
      'Max 2 GB RAM per server',
      'Max 2 vCore CPU per server',
      'Max 20 GB Disk per server',
      'Email Support',
      'Daily Backups',
    ],
    serverLimit: 3,
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    description: 'Ultimate power for pro gamers',
    features: [
      '10 Game Servers',
      'Max 4 GB RAM per server',
      'Max 4 vCore CPU per server',
      'Max 50 GB Disk per server',
      'Priority Support',
      'Hourly Backups',
      'Custom Domain',
      'Server Statistics',
    ],
    serverLimit: 10,
    recommended: true,
  }
];

const Subscription = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(user?.subscription || 'free');
  const [loading, setLoading] = useState(false);
  
  const handleSubscribe = (planId: string) => {
    setLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast.success(`Successfully subscribed to ${planId} plan!`);
      setLoading(false);
    }, 1500);
  };
  
  const handleCancelSubscription = () => {
    setLoading(true);
    
    // Simulate cancellation process
    setTimeout(() => {
      toast.success('Subscription canceled successfully');
      setLoading(false);
    }, 1500);
  };
  
  const handleManageSubscription = () => {
    toast.success('Redirecting to billing management...');
  };
  
  const getCurrentPlan = () => {
    if (!user?.subscription) return plans[0];
    return plans.find(plan => plan.id === user.subscription) || plans[0];
  };

  const currentPlan = getCurrentPlan();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground mt-1">
          Choose the perfect plan for your gaming needs
        </p>
      </div>
      
      {user?.subscription && (
        <Card className="bg-muted/30 border-game-primary/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <Badge className="bg-game-primary text-white mr-2 capitalize">
                    {user.subscription}
                  </Badge>
                  <h3 className="text-lg font-medium">Current Subscription</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your subscription renews on June 3, 2025
                </p>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Up to {currentPlan.serverLimit} game servers</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>All {currentPlan.name} plan features</span>
                  </div>
                </div>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelSubscription}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleManageSubscription}
                  disabled={loading}
                >
                  Manage Billing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPlanActive = user?.subscription === plan.id;
          const isUserOnFreePlan = !user?.subscription && plan.id === 'free';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.recommended ? 'border-game-primary shadow-lg' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <Badge className="bg-game-primary text-primary-foreground">
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-end">
                  <span className="text-4xl font-bold">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="pt-2">
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                {isPlanActive || isUserOnFreePlan ? (
                  <Button className="w-full" disabled variant="outline">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full ${plan.id !== 'free' ? 'bg-game-primary hover:bg-game-secondary' : ''}`}
                    variant={plan.id === 'free' ? 'outline' : 'default'}
                    disabled={loading}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span> Processing...
                      </>
                    ) : (
                      <>
                        {plan.id === 'free' ? 'Downgrade' : 'Subscribe'} <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Subscription FAQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Can I change my plan later?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your subscription at any time. When upgrading, you'll be billed the prorated amount for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and select cryptocurrencies.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">How do I cancel my subscription?</h4>
            <p className="text-sm text-muted-foreground">
              You can cancel your subscription at any time from your account settings. Your service will continue until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">What happens to my servers if I downgrade?</h4>
            <p className="text-sm text-muted-foreground">
              If you downgrade to a plan that supports fewer servers than you currently have, you'll need to delete servers to comply with the new limit. Your servers won't be automatically deleted, but you won't be able to start them until you're within your new plan's limits.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
