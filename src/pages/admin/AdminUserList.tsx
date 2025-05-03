
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, RefreshCw, Search, User, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import * as userApi from '@/services/userApi';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUserList = () => {
  const [users, setUsers] = useState<userApi.User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<userApi.User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userApi.User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
    }
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await userApi.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    toast.success('User creation functionality would be implemented here');
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await userApi.deleteUser(selectedUser.id);
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      toast.success(`User ${selectedUser.username} has been deleted`);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchUsers();
    toast.success('User list refreshed');
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
            Total users: {filteredUsers.length} (Demo Data)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user.username}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? "destructive" : "secondary"} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.subscription ? (
                      <Badge variant="outline" className="capitalize bg-game-primary/10 text-game-primary border-game-primary/20">
                        {user.subscription}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Free Tier
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
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
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No users found</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
              <div className="text-3xl font-bold mt-1">{users.length}</div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Premium Users</div>
              <div className="text-3xl font-bold mt-1">
                {users.filter(user => user.subscription === 'premium').length}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Basic Users</div>
              <div className="text-3xl font-bold mt-1">
                {users.filter(user => user.subscription === 'basic').length}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Free Tier Users</div>
              <div className="text-3xl font-bold mt-1">
                {users.filter(user => user.subscription === null).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserList;
