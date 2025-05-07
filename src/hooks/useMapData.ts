
import { useState, useEffect } from "react";
import { 
  salespeople, 
  sales, 
  geofences, 
  routes, 
  Salesperson,
  Sale,
  Geofence,
  Route 
} from "../data/sampleData";

export function useMapData() {
  const [salesData, setSalesData] = useState<Sale[]>(sales);
  const [salespeopleData, setSalespeopleData] = useState<Salesperson[]>(salespeople);
  const [geofenceData, setGeofenceData] = useState<Geofence[]>(geofences);
  const [routeData, setRouteData] = useState<Route[]>(routes);
  const [activeGeofence, setActiveGeofence] = useState<string | null>(null);
  const [activeSalesperson, setActiveSalesperson] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.725037, lng: -73.995974 });
  const [mapZoom, setMapZoom] = useState(13);
  
  useEffect(() => {
    // Simulate real-time updates for salespeople positions
    const interval = setInterval(() => {
      setSalespeopleData((prev) => 
        prev.map(sp => {
          if (sp.status !== "active") return sp;
          
          // Small random movement
          const latDelta = (Math.random() - 0.5) * 0.001;
          const lngDelta = (Math.random() - 0.5) * 0.001;
          
          return {
            ...sp,
            position: {
              lat: sp.position.lat + latDelta,
              lng: sp.position.lng + lngDelta
            }
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const focusOnSalesperson = (id: string) => {
    const salesperson = salespeopleData.find(sp => sp.id === id);
    if (salesperson) {
      setMapCenter(salesperson.position);
      setMapZoom(16);
      setActiveSalesperson(id);
    }
  };
  
  const focusOnGeofence = (id: string) => {
    const fence = geofenceData.find(gf => gf.id === id);
    if (fence) {
      setMapCenter(fence.center);
      setMapZoom(15);
      setActiveGeofence(id);
    }
  };
  
  const resetMapView = () => {
    setMapCenter({ lat: 40.725037, lng: -73.995974 });
    setMapZoom(13);
    setActiveGeofence(null);
    setActiveSalesperson(null);
  };
  
  const optimizeRoute = (routeId: string) => {
    // Simulate route optimization
    setRouteData((prev) => 
      prev.map(route => {
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
      })
    );
  };
  
  const addGeofence = (geofence: Geofence) => {
    setGeofenceData(prev => [...prev, geofence]);
  };
  
  const removeGeofence = (id: string) => {
    setGeofenceData(prev => prev.filter(gf => gf.id !== id));
  };
  
  return {
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
    optimizeRoute,
    addGeofence,
    removeGeofence
  };
}
