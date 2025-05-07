
import { useState } from "react";
import { Geofence, Salesperson } from "@/data/sampleData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, User, Plus, MapPin, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GeofencingControlsProps {
  geofences: Geofence[];
  salespeople: Salesperson[];
  onFocusGeofence: (id: string) => void;
  onAddGeofence?: (geofence: Geofence) => void;
  onRemoveGeofence?: (id: string) => void;
}

const GeofencingControls: React.FC<GeofencingControlsProps> = ({
  geofences,
  salespeople,
  onFocusGeofence,
  onAddGeofence,
  onRemoveGeofence
}) => {
  const [activeGeofence, setActiveGeofence] = useState<string | null>(null);
  
  const getSalespeopleInGeofence = (geofence: Geofence) => {
    return salespeople.filter(sp => 
      geofence.assigned.includes(sp.id) && 
      isInGeofence(sp.position, geofence.center, geofence.radius)
    );
  };
  
  const isInGeofence = (
    position: {lat: number, lng: number}, 
    center: {lat: number, lng: number}, 
    radius: number
  ) => {
    // Simple distance calculation - in a real app, use proper geospatial calculations
    const R = 6371e3; // Earth's radius in meters
    const φ1 = position.lat * Math.PI / 180;
    const φ2 = center.lat * Math.PI / 180;
    const Δφ = (center.lat - position.lat) * Math.PI / 180;
    const Δλ = (center.lng - position.lng) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance <= radius;
  };

  const handleGeofenceClick = (id: string) => {
    setActiveGeofence(id === activeGeofence ? null : id);
    onFocusGeofence(id);
  };
  
  const getAssignedSalespeople = (geofence: Geofence) => {
    return salespeople.filter(sp => geofence.assigned.includes(sp.id));
  };
  
  const getColorBadge = (color: string) => {
    const getTextColor = (bgColor: string) => {
      // Simple function to determine text color based on background
      return ['#F97316', '#10B981', '#0EA5E9'].includes(bgColor) 
        ? 'text-white' 
        : 'text-gray-900';
    };
    
    return (
      <span 
        className={`inline-block w-3 h-3 rounded-full mr-1`}
        style={{ backgroundColor: color }}
      ></span>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-sales-purple" />
            Geofencing
          </CardTitle>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Fence
          </Button>
        </div>
        <CardDescription>
          Monitor and manage territory boundaries
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {geofences.map((geofence) => {
            const peopleInZone = getSalespeopleInGeofence(geofence);
            const assignedPeople = getAssignedSalespeople(geofence);
            
            return (
              <AccordionItem key={geofence.id} value={geofence.id}>
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="flex items-center">
                      {getColorBadge(geofence.color)}
                      <span>{geofence.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted">
                        {peopleInZone.length} / {assignedPeople.length}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFocusGeofence(geofence.id);
                        }}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pt-2">
                  <div className="px-4 pb-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">Radius</div>
                        <div className="font-medium">{geofence.radius} meters</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <Switch id={`alerts-${geofence.id}`} defaultChecked />
                          <Label htmlFor={`alerts-${geofence.id}`}>Alerts</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-2 flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>Assigned Personnel ({assignedPeople.length})</span>
                      </div>
                      <div className="space-y-2">
                        {assignedPeople.map((person) => {
                          const isInZone = peopleInZone.some(p => p.id === person.id);
                          return (
                            <div 
                              key={person.id}
                              className={`flex items-center justify-between rounded-md border px-3 py-1.5 ${
                                isInZone ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="relative mr-2">
                                  <img 
                                    src={person.avatar} 
                                    alt={person.name}
                                    className="rounded-full h-6 w-6 object-cover"
                                  />
                                  <div 
                                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                                      person.status === 'active' ? 'bg-green-500' :
                                      person.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                  ></div>
                                </div>
                                <span className="text-sm">{person.name}</span>
                              </div>
                              <Badge variant="outline" className={`
                                ${isInZone 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                              `}>
                                {isInZone ? 'In zone' : 'Outside'}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default GeofencingControls;
