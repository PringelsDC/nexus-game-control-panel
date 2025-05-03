
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServer } from '../contexts/ServerContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const serverTemplates = [
  {
    name: 'Minecraft',
    ram: 1024,
    cpu: 1,
    disk: 5120,
    startupCommand: 'java -Xms512M -Xmx1024M -jar server.jar',
  },
  {
    name: 'Counter-Strike 2',
    ram: 1024,
    cpu: 1,
    disk: 10240,
    startupCommand: './cs2 -console -usercon +game_type 0 +game_mode 1 +mapgroup mg_active +map de_dust2',
  },
  {
    name: 'Valheim',
    ram: 1024,
    cpu: 1,
    disk: 3072,
    startupCommand: './valheim_server.x86_64 -name "My Server" -port 2456 -world "Dedicated" -password "secret"',
  },
  {
    name: 'TeamSpeak 3',
    ram: 512,
    cpu: 1,
    disk: 1024,
    startupCommand: './ts3server_minimal_runscript.sh',
  },
];

const CreateServer = () => {
  const [name, setName] = useState('');
  const [ram, setRam] = useState(512);
  const [cpu, setCpu] = useState(1);
  const [disk, setDisk] = useState(3072);
  const [startupCommand, setStartupCommand] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  
  const { createServer, userServers, loading } = useServer();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const applyTemplate = (index: number) => {
    const template = serverTemplates[index];
    setName(template.name + ' Server');
    setRam(Math.min(template.ram, 1024)); // Respect the 1GB limit
    setCpu(Math.min(template.cpu, 1)); // Respect the 1 vCore limit
    setDisk(Math.min(template.disk, 10240)); // Respect the 10GB limit
    setStartupCommand(template.startupCommand);
    setSelectedTemplate(index);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter a server name');
      return;
    }
    
    if (!startupCommand) {
      toast.error('Please enter a startup command');
      return;
    }
    
    if (userServers.length >= (user?.serverLimit || 0)) {
      toast.error(`Server limit reached (${user?.serverLimit}). Please upgrade your plan.`);
      return;
    }
    
    try {
      await createServer(name, ram, cpu, disk, startupCommand);
      toast.success('Server created successfully');
      navigate('/servers');
    } catch (error) {
      console.error('Error creating server:', error);
      toast.error(`Failed to create server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Server</h1>
          <p className="text-muted-foreground mt-1">
            Configure your new game server
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Server Configuration</CardTitle>
              <CardDescription>
                Configure your server with the resources and settings you need
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Server Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Awesome Server"
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">RAM (MB)</label>
                      <span className="text-sm">{ram} MB / 1024 MB</span>
                    </div>
                    <Slider
                      value={[ram]}
                      min={128}
                      max={1024}
                      step={128}
                      onValueChange={(values) => setRam(values[0])}
                      className="py-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">vCPU Cores</label>
                      <span className="text-sm">{cpu} / 1 vCores</span>
                    </div>
                    <Slider
                      value={[cpu]}
                      min={0.25}
                      max={1}
                      step={0.25}
                      onValueChange={(values) => setCpu(values[0])}
                      className="py-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Disk Space (MB)</label>
                      <span className="text-sm">{disk} MB / 10240 MB ({(disk / 1024).toFixed(1)} GB)</span>
                    </div>
                    <Slider
                      value={[disk]}
                      min={1024}
                      max={10240}
                      step={1024}
                      onValueChange={(values) => setDisk(values[0])}
                      className="py-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Startup Command</label>
                  <Textarea
                    value={startupCommand}
                    onChange={(e) => setStartupCommand(e.target.value)}
                    placeholder="Enter the command to start your server"
                    className="h-24 font-mono bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    This command will be run when you start the server
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-game-primary hover:bg-game-secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Creating Server...
                    </span>
                  ) : (
                    "Create Server"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Server Templates</CardTitle>
              <CardDescription>
                Quick start with pre-configured templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {serverTemplates.map((template, index) => (
                <div 
                  key={index}
                  className={`border rounded-md p-4 cursor-pointer transition-colors ${
                    selectedTemplate === index 
                      ? 'border-game-primary bg-game-primary/10' 
                      : 'border-border hover:border-game-primary/50'
                  }`}
                  onClick={() => applyTemplate(index)}
                >
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>RAM: {template.ram} MB</div>
                    <div>CPU: {template.cpu} vCores</div>
                    <div>Disk: {(template.disk / 1024).toFixed(1)} GB</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resource Limits</CardTitle>
              <CardDescription>
                Maximum allowed resources per server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>RAM:</span>
                  <span className="font-medium">1 GB</span>
                </li>
                <li className="flex justify-between">
                  <span>CPU:</span>
                  <span className="font-medium">1 vCore</span>
                </li>
                <li className="flex justify-between">
                  <span>Disk:</span>
                  <span className="font-medium">10 GB</span>
                </li>
                <li className="flex justify-between">
                  <span>Servers:</span>
                  <span className="font-medium">{user?.serverLimit || 0}</span>
                </li>
              </ul>
              
              {!user?.subscription && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Upgrade your plan for higher resource limits and more servers.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateServer;
