
import React, { useState } from 'react';
import { geofences, salespeople } from '@/data/sampleData';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import Map from '@/components/Map';
import GeofencingControls from '@/components/GeofencingControls';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Target, Plus, MapPin, Users } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  color: z.string(),
  radius: z.number().min(100).max(5000),
});

const Geofencing = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGeofence, setActiveGeofence] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.725037, lng: -73.995974 });
  const [mapZoom, setMapZoom] = useState(13);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#0EA5E9",
      radius: 500,
    },
  });
  
  const handleSelectGeofence = (id: string) => {
    setActiveGeofence(id);
    const fence = geofences.find(g => g.id === id);
    if (fence) {
      setMapCenter(fence.center);
      setMapZoom(15);
    }
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, this would create a new geofence
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Geofencing</h1>
              <p className="text-muted-foreground">
                Create and manage location-based boundaries for your sales team
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Geofence
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Geofence</DialogTitle>
                  <DialogDescription>
                    Define a new area for monitoring sales activities
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geofence Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Downtown District" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <Input type="color" className="w-12 h-10 p-1" {...field} />
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="#0EA5E9">Blue</SelectItem>
                                  <SelectItem value="#10B981">Green</SelectItem>
                                  <SelectItem value="#F97316">Orange</SelectItem>
                                  <SelectItem value="#8B5CF6">Purple</SelectItem>
                                  <SelectItem value="#EF4444">Red</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Radius (meters)</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl className="flex-1">
                              <Slider
                                min={100}
                                max={5000}
                                step={50}
                                defaultValue={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                                {...fieldProps}
                              />
                            </FormControl>
                            <div className="w-16 text-right font-medium">{value}m</div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Create Geofence</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={isMobile ? 'order-2' : 'lg:order-1'}>
            <GeofencingControls 
              geofences={geofences}
              salespeople={salespeople}
              onFocusGeofence={handleSelectGeofence}
            />
          </div>
          
          <div className={`${isMobile ? 'order-1 h-[400px]' : 'lg:col-span-2 lg:order-2 h-[700px]'}`}>
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <Map
                  center={mapCenter}
                  zoom={mapZoom}
                  activeGeofence={activeGeofence}
                  onGeofenceClick={handleSelectGeofence}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Geofencing;
