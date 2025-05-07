
import { useState } from "react";
import { Route, Salesperson } from "@/data/sampleData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Navigation, Route as RouteIcon, CheckCircle, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface RouteOptimizerProps {
  routes: Route[];
  salespeopleData: Salesperson[];
  onOptimizeRoute: (routeId: string) => void;
  onViewRoute: (routeId: string) => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({
  routes,
  salespeopleData,
  onOptimizeRoute,
  onViewRoute
}) => {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  
  const getSalespersonName = (id: string) => {
    const sp = salespeopleData.find(p => p.id === id);
    return sp ? sp.name : "Unknown";
  };
  
  const getCompletionPercentage = (route: Route) => {
    const visited = route.waypoints.filter(wp => wp.visited).length;
    return Math.round((visited / route.waypoints.length) * 100);
  };
  
  const getWaypointTypeBadge = (type: string) => {
    switch(type) {
      case 'customer':
        return <Badge variant="outline" className="bg-sales-blue/10 text-sales-blue border-sales-blue/20">Customer</Badge>;
      case 'prospect':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Prospect</Badge>;
      case 'checkpoint':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Checkpoint</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <RouteIcon className="mr-2 h-5 w-5 text-sales-blue" />
            Route Management
          </div>
          <Badge variant="outline" className="ml-2">
            {routes.length} active routes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {routes.map((route) => (
            <AccordionItem key={route.id} value={route.id}>
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{getSalespersonName(route.salespersonId)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      <span>{getCompletionPercentage(route)}%</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-sales-blue" />
                      <span>{route.totalDuration} min</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pt-2">
                <div className="px-4 pb-2 space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">ETA</TableHead>
                          <TableHead className="w-[60px] text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {route.waypoints.map((waypoint, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {waypoint.name}
                            </TableCell>
                            <TableCell>
                              {getWaypointTypeBadge(waypoint.type)}
                            </TableCell>
                            <TableCell className="text-right">
                              {waypoint.visited 
                                ? 'Visited' 
                                : waypoint.estimatedArrival 
                                  ? format(new Date(waypoint.estimatedArrival), 'h:mm a') 
                                  : '-'
                              }
                            </TableCell>
                            <TableCell className="text-center">
                              {waypoint.visited ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground mx-auto" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground">
                      <span>Total distance: {route.totalDistance} km</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => onViewRoute(route.id)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => onOptimizeRoute(route.id)}
                      >
                        Optimize Route
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default RouteOptimizer;
