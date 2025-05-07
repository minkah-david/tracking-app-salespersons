
import React, { useState } from 'react';
import { salespeople, routes } from '@/data/sampleData';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import SalespersonCard from '@/components/SalespersonCard';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Target, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Users,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const Team = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null);

  // Calculate team metrics
  const activePersonnelCount = salespeople.filter(sp => sp.status === 'active').length;
  const idlePersonnelCount = salespeople.filter(sp => sp.status === 'idle').length;
  const offlinePersonnelCount = salespeople.filter(sp => sp.status === 'offline').length;
  
  const totalTarget = salespeople.reduce((sum, sp) => sum + sp.targetForToday, 0);
  const totalSales = salespeople.reduce((sum, sp) => sum + sp.salesForToday, 0);
  const targetCompletion = (totalSales / totalTarget) * 100;
  
  const handleSalespersonSelect = (id: string) => {
    setSelectedSalesperson(id === selectedSalesperson ? null : id);
  };
  
  const selectedPerson = selectedSalesperson 
    ? salespeople.find(sp => sp.id === selectedSalesperson)
    : null;
    
  const selectedPersonRoute = selectedPerson
    ? routes.find(route => route.salespersonId === selectedPerson.id)
    : null;
    
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sales Team</h1>
          <p className="text-muted-foreground">
            Manage and monitor your field sales representatives
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{salespeople.length}</div>
              <p className="text-sm text-muted-foreground">Total Team Members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{activePersonnelCount}</div>
              <p className="text-sm text-muted-foreground">Active in Field</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{idlePersonnelCount}</div>
              <p className="text-sm text-muted-foreground">Idle Personnel</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{targetCompletion.toFixed(0)}%</div>
              <p className="text-sm text-muted-foreground">Team Target Completion</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Sales Team
              </CardTitle>
              <CardDescription>
                {salespeople.length} sales representatives
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className={`${isMobile ? 'h-[300px]' : 'h-[600px]'}`}>
                <div className="p-4 grid gap-4">
                  {salespeople.map(person => (
                    <div 
                      key={person.id} 
                      onClick={() => handleSalespersonSelect(person.id)}
                      className={`cursor-pointer rounded-lg transition-all ${
                        selectedSalesperson === person.id 
                          ? 'ring-2 ring-sales-blue' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <SalespersonCard
                        salesperson={person}
                        isActive={person.id === selectedSalesperson}
                        onClick={() => handleSalespersonSelect(person.id)}
                        onViewRoute={() => {
                          handleSalespersonSelect(person.id);
                          setActiveTab('activity');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="xl:col-span-2">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Team Overview</TabsTrigger>
                  <TabsTrigger value="activity">
                    {selectedPerson ? `${selectedPerson.name}'s Activity` : 'Activity'}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-0">
              <TabsContent value="overview" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead className="text-right">Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salespeople.map(person => {
                      const completion = (person.salesForToday / person.targetForToday) * 100;
                      
                      return (
                        <TableRow 
                          key={person.id}
                          className={`cursor-pointer ${person.id === selectedSalesperson ? 'bg-muted/50' : ''}`}
                          onClick={() => handleSalespersonSelect(person.id)}
                        >
                          <TableCell>
                            <div className="flex items-center">
                              <div className="relative mr-2">
                                <img 
                                  src={person.avatar} 
                                  alt={person.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                  person.status === 'active' ? 'bg-green-500' :
                                  person.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                              </div>
                              <span>{person.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{person.assignedArea}</TableCell>
                          <TableCell>
                            <Badge variant={
                              person.status === 'active' ? 'default' :
                              person.status === 'idle' ? 'outline' : 'secondary'
                            }>
                              {person.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${person.targetForToday}</TableCell>
                          <TableCell className="text-right">
                            <span className={
                              completion >= 100 ? 'text-green-500 font-medium' : ''
                            }>
                              {completion.toFixed(0)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="activity" className="p-4">
                {selectedPerson ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img 
                            src={selectedPerson.avatar}
                            alt={selectedPerson.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{selectedPerson.name}</h3>
                          <p className="text-muted-foreground">{selectedPerson.assignedArea}</p>
                          <div className="flex items-center mt-1">
                            <Badge className="mr-2" variant={
                              selectedPerson.status === 'active' ? 'default' :
                              selectedPerson.status === 'idle' ? 'outline' : 'secondary'
                            }>
                              {selectedPerson.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Last active: {format(new Date(selectedPerson.lastActive), 'h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Sales Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${selectedPerson.salesForToday}</div>
                          <p className="text-sm text-muted-foreground">
                            Target: ${selectedPerson.targetForToday}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Currently in {selectedPerson.assignedArea}</span>
                          </div>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            View on map
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm space-y-1">
                            {selectedPersonRoute && (
                              <>
                                <div className="flex justify-between">
                                  <span>Waypoints visited:</span>
                                  <span className="font-medium">
                                    {selectedPersonRoute.waypoints.filter(wp => wp.visited).length} / {selectedPersonRoute.waypoints.length}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Distance traveled:</span>
                                  <span className="font-medium">{selectedPersonRoute.totalDistance} km</span>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {selectedPersonRoute && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Today's Route</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedPersonRoute.waypoints.map((waypoint, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className="mr-3 mt-0.5">
                                  {waypoint.visited ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                  )}
                                </div>
                                <div className="flex-1 border-b pb-3">
                                  <div className="flex justify-between">
                                    <div className="font-medium">{waypoint.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {waypoint.visited 
                                        ? 'Visited' 
                                        : waypoint.estimatedArrival 
                                          ? format(new Date(waypoint.estimatedArrival), 'h:mm a')
                                          : 'Pending'
                                      }
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground capitalize">
                                    {waypoint.type}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <User className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Team Member Selected</h3>
                    <p>Select a team member to view their activity details</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Team;
