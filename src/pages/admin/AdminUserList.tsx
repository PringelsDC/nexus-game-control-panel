
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, RefreshCw, Search, User, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const mockUsers = [
  {
    id: '1',
    username: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    serverLimit: 10,
    subscription: 'premium',
    lastActive: '2025-05-03T10:30:00Z',
    servers: 1
  },
  {
    id: '2',
    username: 'User',
    email: 'user@example.com',
    role: 'user',
    serverLimit: 3,
    subscription: 'basic',
    lastActive: '2025-05-02T15:45:00Z',
    servers: 2
  },
  {
    id: '3',
    username: 'GameMaster',
    email: 'gamemaster@example.com',
    role: 'user',
    serverLimit: 5,
    subscription: 'premium',
    lastActive: '2025-05-01T09:15:00Z',
    servers: 3
  },
  {
    id: '4',
    username: 'FreeUser',
    email: 'free@example.com',
    role: 'user',
    serverLimit: 1,
    subscription: null,
    lastActive: '2025-04-28T14:20:00Z',
    servers: 1
  },
  {
    id: '5',
    username: 'ProGamer',
    email: 'progamer@example.com',
    role: 'user',
    serverLimit: 5,
    subscription: 'premium',
    lastActive: '2025-05-03T08:10:00Z',
    servers: 0
  }
];

const AdminUserList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setUsers(mockUsers);
      return;
    }
    
    const filtered = mockUsers.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setUsers(filtered);
  };

  const handleCreateUser = () => {
    // In a real implementation, this would open a form or modal
    toast.success('User creation functionality would be implemented here');
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    toast.success(`User ${selectedUser.username} has been deleted`);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
      toast.success('User list refreshed');
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered users
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            className="bg-game-primary hover:bg-game-secondary"
            onClick={handleCreateUser}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users by name or email..."
            className="pl-8 bg-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Total users: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-muted/50 py-2 px-4">
              <div className="col-span-3 font-medium text-sm">Username</div>
              <div className="col-span-3 font-medium text-sm">Email</div>
              <div className="col-span-2 font-medium text-sm">Role</div>
              <div className="col-span-2 font-medium text-sm">Subscription</div>
              <div className="col-span-2 font-medium text-sm">Actions</div>
            </div>
            
            <div className="divide-y">
              {users.length > 0 ? users.map((user) => (
                <div key={user.id} className="grid grid-cols-12 py-3 px-4">
                  <div className="col-span-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.username}</span>
                  </div>
                  
                  <div className="col-span-3 text-sm flex items-center">
                    {user.email}
                  </div>
                  
                  <div className="col-span-2 text-sm flex items-center">
                    <Badge variant={user.role === 'admin' ? "destructive" : "secondary"} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2 text-sm flex items-center">
                    {user.subscription ? (
                      <Badge variant="outline" className="capitalize bg-game-primary/10 text-game-primary border-game-primary/20">
                        {user.subscription}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Free Tier
                      </Badge>
                    )}
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    <Link to={`/admin/users/${user.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    
                    <Dialog open={isDeleteDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete User</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently deleted.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedUser && (
                          <div className="my-4 p-4 bg-muted rounded-md">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-muted-foreground">Username:</div>
                              <div>{selectedUser.username}</div>
                              
                              <div className="text-muted-foreground">Email:</div>
                              <div>{selectedUser.email}</div>
                              
                              <div className="text-muted-foreground">Servers:</div>
                              <div>{selectedUser.servers}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4 flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-500">Warning</h4>
                            <p className="text-sm text-muted-foreground">
                              This action will delete the user account and all associated servers. The data cannot be recovered.
                            </p>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteUser}>
                            Delete User
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Overview of user data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-3xl font-bold mt-1">{mockUsers.length}</div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Premium Users</div>
              <div className="text-3xl font-bold mt-1">
                {mockUsers.filter(user => user.subscription === 'premium').length}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Basic Users</div>
              <div className="text-3xl font-bold mt-1">
                {mockUsers.filter(user => user.subscription === 'basic').length}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Free Tier Users</div>
              <div className="text-3xl font-bold mt-1">
                {mockUsers.filter(user => user.subscription === null).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserList;
