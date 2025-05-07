
import React, { useState } from 'react';
import { useMapData } from '@/hooks/useMapData';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import Map from './Map';
import SalespersonCard from './SalespersonCard';
import SalesList from './SalesList';
import RouteOptimizer from './RouteOptimizer';
import GeofencingControls from './GeofencingControls';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, MapPin, DollarSign, Target } from 'lucide-react';
import { sales } from '@/data/sampleData';

const Dashboard = () => {
  const {
    salesData,
    salespeopleData,
    geofenceData,
    routeData,
    activeGeofence,
    activeSalesperson,
    mapCenter,
    mapZoom,
    focusOnSalesperson,
    focusOnGeofence,
    resetMapView,
    optimizeRoute
  } = useMapData();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const isMobile = useIsMobile();

  // Helper function to calculate sales metrics
  const calculateSalesMetrics = () => {
    const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    const averageSale = totalSales / salesData.length;
    const activePersonnel = salespeopleData.filter(p => p.status === 'active').length;
    const completion = salespeopleData.reduce((sum, p) => {
      return sum + (p.salesForToday / p.targetForToday);
    }, 0) / salespeopleData.length * 100;
    
    return {
      totalSales: totalSales.toFixed(2),
      averageSale: averageSale.toFixed(2),
      activePersonnel,
      completion: completion.toFixed(0)
    };
  };
  
  const metrics = calculateSalesMetrics();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        {isMobile ? (
          <MobileDashboardView 
            salesData={salesData}
            salespeopleData={salespeopleData}
            geofenceData={geofenceData}
            routeData={routeData}
            metrics={metrics}
            focusOnSalesperson={focusOnSalesperson}
            focusOnGeofence={focusOnGeofence}
            optimizeRoute={optimizeRoute}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            activeSalesperson={activeSalesperson}
            activeGeofence={activeGeofence}
          />
        ) : (
          <DesktopDashboardView 
            salesData={salesData}
            salespeopleData={salespeopleData}
            geofenceData={geofenceData}
            routeData={routeData}
            metrics={metrics}
            focusOnSalesperson={focusOnSalesperson}
            focusOnGeofence={focusOnGeofence}
            optimizeRoute={optimizeRoute}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            activeSalesperson={activeSalesperson}
            activeGeofence={activeGeofence}
          />
        )}
      </div>
    </div>
  );
};

const MobileDashboardView = ({ 
  salesData, 
  salespeopleData, 
  geofenceData, 
  routeData,
  metrics,
  focusOnSalesperson,
  focusOnGeofence,
  optimizeRoute,
  mapCenter,
  mapZoom,
  activeSalesperson,
  activeGeofence
}) => {
  return (
    <Tabs defaultValue="map" className="space-y-4">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="routes">Routes</TabsTrigger>
        <TabsTrigger value="geofences">Geofences</TabsTrigger>
      </TabsList>
      
      {/* Map Tab */}
      <TabsContent value="map" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="Active"
            value={metrics.activePersonnel}
            description={`of ${salespeopleData.length} Personnel`}
          />
          <StatCard
            icon={<DollarSign className="h-4 w-4" />}
            title="Sales"
            value={`$${metrics.totalSales}`}
            description="Today's Total"
          />
        </div>
        
        <div className="h-[500px] rounded-md overflow-hidden border">
          <Map 
            center={mapCenter}
            zoom={mapZoom}
            activeSalesperson={activeSalesperson}
            activeGeofence={activeGeofence}
            onSalespersonClick={focusOnSalesperson}
            onGeofenceClick={focusOnGeofence}
          />
        </div>
        
        <ScrollArea className="h-72">
          <div className="grid gap-3">
            {salespeopleData.map(person => (
              <SalespersonCard
                key={person.id}
                salesperson={person}
                isActive={person.id === activeSalesperson}
                onClick={() => focusOnSalesperson(person.id)}
                onViewRoute={() => {
                  const route = routeData.find(r => r.salespersonId === person.id);
                  if (route) {
                    focusOnSalesperson(person.id);
                  }
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      {/* Sales Tab */}
      <TabsContent value="sales" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<DollarSign className="h-4 w-4" />}
            title="Total"
            value={`$${metrics.totalSales}`}
            description={`${salesData.length} Transactions`}
          />
          <StatCard
            icon={<DollarSign className="h-4 w-4" />}
            title="Average"
            value={`$${metrics.averageSale}`}
            description="Per Sale"
          />
        </div>
        
        <SalesList 
          sales={salesData}
          onViewLocation={(sale) => {
            /* Handle viewing sale location */
          }}
        />
      </TabsContent>
      
      {/* Routes Tab */}
      <TabsContent value="routes">
        <RouteOptimizer 
          routes={routeData}
          salespeopleData={salespeopleData}
          onOptimizeRoute={optimizeRoute}
          onViewRoute={(routeId) => {
            const route = routeData.find(r => r.id === routeId);
            if (route) {
              focusOnSalesperson(route.salespersonId);
            }
          }}
        />
      </TabsContent>
      
      {/* Geofences Tab */}
      <TabsContent value="geofences">
        <GeofencingControls 
          geofences={geofenceData}
          salespeople={salespeopleData}
          onFocusGeofence={focusOnGeofence}
        />
      </TabsContent>
    </Tabs>
  );
};

const DesktopDashboardView = ({ 
  salesData, 
  salespeopleData, 
  geofenceData, 
  routeData,
  metrics,
  focusOnSalesperson,
  focusOnGeofence,
  optimizeRoute,
  mapCenter,
  mapZoom,
  activeSalesperson,
  activeGeofence
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          title="Active Personnel"
          value={metrics.activePersonnel}
          description={`of ${salespeopleData.length} total`}
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          title="Target Completion"
          value={`${metrics.completion}%`}
          description="Average across team"
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Total Sales"
          value={`$${metrics.totalSales}`}
          description={`${salesData.length} transactions today`}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Average Sale"
          value={`$${metrics.averageSale}`}
          description="Per transaction"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left sidebar - Salespeople */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sales Team</CardTitle>
              <CardDescription>
                View and track your sales representatives
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px] p-4">
                <div className="grid gap-4">
                  {salespeopleData.map(person => (
                    <SalespersonCard
                      key={person.id}
                      salesperson={person}
                      isActive={person.id === activeSalesperson}
                      onClick={() => focusOnSalesperson(person.id)}
                      onViewRoute={() => {
                        const route = routeData.find(r => r.salespersonId === person.id);
                        if (route) {
                          focusOnSalesperson(person.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Center - Map */}
        <div className="col-span-2 row-span-2 h-full">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="h-full w-full rounded-md overflow-hidden">
                <Map 
                  center={mapCenter}
                  zoom={mapZoom}
                  activeSalesperson={activeSalesperson}
                  activeGeofence={activeGeofence}
                  onSalespersonClick={focusOnSalesperson}
                  onGeofenceClick={focusOnGeofence}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right sidebar - Tabs for Routes, Geofences, Sales */}
        <div>
          <Tabs defaultValue="routes" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="geofences">Geofences</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
            
            <TabsContent value="routes" className="h-[600px]">
              <RouteOptimizer 
                routes={routeData}
                salespeopleData={salespeopleData}
                onOptimizeRoute={optimizeRoute}
                onViewRoute={(routeId) => {
                  const route = routeData.find(r => r.id === routeId);
                  if (route) {
                    focusOnSalesperson(route.salespersonId);
                  }
                }}
              />
            </TabsContent>
            
            <TabsContent value="geofences" className="h-[600px]">
              <GeofencingControls 
                geofences={geofenceData}
                salespeople={salespeopleData}
                onFocusGeofence={focusOnGeofence}
              />
            </TabsContent>
            
            <TabsContent value="sales" className="h-[600px]">
              <SalesList 
                sales={salesData}
                onViewLocation={(sale) => {
                  /* Handle viewing sale location */
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper component for metrics
const StatCard = ({ icon, title, value, description }) => (
  <Card>
    <CardContent className="p-4 flex items-center space-x-4">
      <div className="bg-primary/10 p-2 rounded-full">
        {React.cloneElement(icon, {
          className: "h-5 w-5 text-sales-blue"
        })}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
