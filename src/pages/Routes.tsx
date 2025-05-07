
import React, { useState } from 'react';
import { routes, salespeople } from '@/data/sampleData';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import Map from '@/components/Map';
import RouteOptimizer from '@/components/RouteOptimizer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation, Route as RouteIcon, Clock } from 'lucide-react';

const Routes = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [activeSalesperson, setActiveSalesperson] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.725037, lng: -73.995974 });
  const [mapZoom, setMapZoom] = useState(13);
  
  // Deep clone routes to allow for modifications in this demo
  const [routesData, setRoutesData] = useState([...routes]);
  
  const handleOptimizeRoute = (routeId: string) => {
    // Simulate route optimization
    const updatedRoutes = routesData.map(route => {
      if (route.id !== routeId) return route;
      
      // Simulate an optimized route by reordering waypoints that aren't visited
      const visited = route.waypoints.filter(wp => wp.visited);
      let notVisited = route.waypoints.filter(wp => !wp.visited);
      
      // Just rearrange the not visited waypoints as if "optimized"
      notVisited = [...notVisited].sort(() => Math.random() - 0.5);
      
      // Recalculate times (just for simulation)
      notVisited = notVisited.map((wp, idx) => ({
        ...wp,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * (15 * (idx + 1))).toISOString()
      }));
      
      return {
        ...route,
        waypoints: [...visited, ...notVisited],
        optimized: true,
        totalDuration: Math.round(route.totalDuration * 0.8) // 20% time saving
      };
    });
    
    setRoutesData(updatedRoutes);
    
    toast({
      title: "Route Optimized",
      description: "The route has been optimized for maximum efficiency.",
      duration: 3000,
    });
  };
  
  const handleViewRoute = (routeId: string) => {
    const route = routesData.find(r => r.id === routeId);
    if (route) {
      setActiveSalesperson(route.salespersonId);
      
      // Find first non-visited waypoint to center on
      const nextWaypoint = route.waypoints.find(wp => !wp.visited);
      if (nextWaypoint) {
        setMapCenter({ lat: nextWaypoint.lat, lng: nextWaypoint.lng });
      } else if (route.waypoints.length > 0) {
        // If all visited, show the last waypoint
        const lastWaypoint = route.waypoints[route.waypoints.length - 1];
        setMapCenter({ lat: lastWaypoint.lat, lng: lastWaypoint.lng });
      }
      
      setMapZoom(14);
      setActiveTab('map');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Route Management</h1>
              <p className="text-muted-foreground">
                View, optimize and track salesperson routes
              </p>
            </div>
            
            <Button variant="outline" onClick={() => setActiveTab('map')}>
              <Navigation className="mr-2 h-4 w-4" />
              View on Map
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Route List</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <RouteOptimizer
              routes={routesData}
              salespeopleData={salespeople}
              onOptimizeRoute={handleOptimizeRoute}
              onViewRoute={handleViewRoute}
            />
          </TabsContent>
          
          <TabsContent value="map">
            <div className={`${isMobile ? 'h-[400px]' : 'h-[700px]'}`}>
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    activeSalesperson={activeSalesperson}
                    onSalespersonClick={(id) => setActiveSalesperson(id)}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Route Information</h3>
              <div className="space-y-2">
                {activeSalesperson ? (
                  <>
                    {routesData
                      .filter(r => r.salespersonId === activeSalesperson)
                      .map(route => {
                        const person = salespeople.find(p => p.id === route.salespersonId);
                        const completionPercent = Math.round(
                          (route.waypoints.filter(wp => wp.visited).length / route.waypoints.length) * 100
                        );
                        
                        return (
                          <Card key={route.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between">
                                <CardTitle className="text-base">
                                  {person?.name}'s Route
                                </CardTitle>
                                <Badge>
                                  {completionPercent}% Complete
                                </Badge>
                              </div>
                              <CardDescription>
                                {route.waypoints.length} waypoints • {route.totalDistance} km
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Clock className="h-5 w-5 text-sales-blue mr-2" />
                                  <div>
                                    <div className="text-sm text-muted-foreground">Estimated Duration</div>
                                    <div className="font-medium">{route.totalDuration} minutes</div>
                                  </div>
                                </div>
                                
                                <Button onClick={() => handleOptimizeRoute(route.id)}>
                                  Optimize Route
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <RouteIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Select a salesperson on the map to view their route details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Routes;
