
import { useEffect, useRef, useState } from "react";
import { geofences, salespeople, routes } from "@/data/sampleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  Flag, 
  User, 
  Target,
  Layers,
  Eye,
  EyeOff 
} from "lucide-react";

const API_KEY = "AIzaSyB5XVbCfPD6cV8NZnuZVohQID0pMH-tUvk";

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  activeSalesperson?: string | null;
  activeGeofence?: string | null;
  onSalespersonClick?: (id: string) => void;
  onGeofenceClick?: (id: string) => void;
}

const Map: React.FC<MapProps> = ({ 
  center = { lat: 40.725037, lng: -73.995974 },
  zoom = 13,
  activeSalesperson = null,
  activeGeofence = null,
  onSalespersonClick,
  onGeofenceClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [circles, setCircles] = useState<google.maps.Circle[]>([]);
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
  
  const [showGeofences, setShowGeofences] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry,drawing&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initializeMap;
    document.head.appendChild(script);

    return () => {
      window.initMap = undefined;
      const loadedScript = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`);
      if (loadedScript) {
        loadedScript.remove();
      }
    };
  }, []);

  function initializeMap() {
    if (!mapRef.current) return;

    const mapOptions = {
      center,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [{ visibility: "simplified" }]
        },
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }]
        }
      ]
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    setMapInstance(map);
    setIsMapLoaded(true);
  }

  // Update map center and zoom when props change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter(center);
      mapInstance.setZoom(zoom);
    }
  }, [mapInstance, center, zoom]);

  // Add salespeople as markers
  useEffect(() => {
    if (!mapInstance || !isMapLoaded) return;

    // Clear previous markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    salespeople.forEach(person => {
      const isActive = person.id === activeSalesperson;
      
      // Different icon for active vs inactive people
      const iconUrl = isActive 
        ? `http://maps.google.com/mapfiles/ms/icons/blue-dot.png`
        : person.status === 'active' 
          ? `http://maps.google.com/mapfiles/ms/icons/green-dot.png`
          : person.status === 'idle'
            ? `http://maps.google.com/mapfiles/ms/icons/yellow-dot.png`
            : `http://maps.google.com/mapfiles/ms/icons/red-dot.png`;

      const marker = new google.maps.Marker({
        position: person.position,
        map: mapInstance,
        title: person.name,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(isActive ? 40 : 30, isActive ? 40 : 30)
        },
        animation: isActive ? google.maps.Animation.BOUNCE : null
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2 text-sm">
            <div class="font-bold text-sales-blue">${person.name}</div>
            <div>${person.assignedArea}</div>
            <div class="mt-1">Sales today: $${person.salesForToday}</div>
            <div>Status: ${person.status}</div>
          </div>
        `
      });

      // Add click event
      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
        if (onSalespersonClick) {
          onSalespersonClick(person.id);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [mapInstance, activeSalesperson, isMapLoaded]);

  // Add geofences as circles
  useEffect(() => {
    if (!mapInstance || !showGeofences || !isMapLoaded) return;

    // Clear previous circles
    circles.forEach(circle => circle.setMap(null));
    const newCircles: google.maps.Circle[] = [];

    geofences.forEach(fence => {
      const isActive = fence.id === activeGeofence;

      const circle = new google.maps.Circle({
        center: fence.center,
        radius: fence.radius,
        strokeColor: fence.color,
        strokeOpacity: isActive ? 0.8 : 0.5,
        strokeWeight: isActive ? 3 : 2,
        fillColor: fence.color,
        fillOpacity: isActive ? 0.35 : 0.15,
        map: mapInstance,
        clickable: true
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2 text-sm">
            <div class="font-bold">${fence.name}</div>
            <div>Radius: ${fence.radius}m</div>
            <div class="mt-1">Assigned: ${fence.assigned.length} salespeople</div>
          </div>
        `
      });

      // Add click event
      circle.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          infoWindow.setPosition(e.latLng);
          infoWindow.open(mapInstance);
        }
        if (onGeofenceClick) {
          onGeofenceClick(fence.id);
        }
      });

      newCircles.push(circle);
    });

    setCircles(newCircles);

    return () => {
      newCircles.forEach(circle => circle.setMap(null));
    };
  }, [mapInstance, activeGeofence, showGeofences, isMapLoaded]);

  // Add routes as polylines
  useEffect(() => {
    if (!mapInstance || !showRoutes || !isMapLoaded) return;

    // Clear previous polylines
    polylines.forEach(polyline => polyline.setMap(null));
    const newPolylines: google.maps.Polyline[] = [];

    routes.forEach(route => {
      // Only show route for active salesperson if one is selected
      if (activeSalesperson && route.salespersonId !== activeSalesperson) {
        return;
      }

      const isActive = activeSalesperson === route.salespersonId;
      const waypoints = route.waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng }));
      
      // Create polyline for route
      const polyline = new google.maps.Polyline({
        path: waypoints,
        strokeColor: isActive ? '#0EA5E9' : '#8B5CF6',
        strokeOpacity: isActive ? 0.8 : 0.5,
        strokeWeight: isActive ? 4 : 2,
        map: mapInstance
      });

      // Add waypoint markers
      route.waypoints.forEach((waypoint) => {
        let iconUrl = '';
        switch (waypoint.type) {
          case 'customer':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            break;
          case 'prospect':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
          case 'checkpoint':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
            break;
        }

        const waypointMarker = new google.maps.Marker({
          position: { lat: waypoint.lat, lng: waypoint.lng },
          map: mapInstance,
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(20, 20)
          },
          opacity: waypoint.visited ? 0.6 : 1
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 text-sm">
              <div class="font-bold">${waypoint.name}</div>
              <div>Type: ${waypoint.type}</div>
              <div>${waypoint.visited ? 'Visited' : 'Not visited yet'}</div>
              ${!waypoint.visited ? `<div>ETA: ${new Date(waypoint.estimatedArrival || '').toLocaleTimeString()}</div>` : ''}
            </div>
          `
        });

        waypointMarker.addListener('click', () => {
          infoWindow.open(mapInstance, waypointMarker);
        });

        // Add to markers to be cleaned up
        newMarkers.push(waypointMarker);
      });

      newPolylines.push(polyline);
    });

    setPolylines(newPolylines);

    return () => {
      newPolylines.forEach(polyline => polyline.setMap(null));
    };
  }, [mapInstance, activeSalesperson, showRoutes, isMapLoaded]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-md border"></div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm"
          onClick={() => setShowGeofences(!showGeofences)}
        >
          {showGeofences ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
          Geofences
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm"
          onClick={() => setShowRoutes(!showRoutes)}
        >
          {showRoutes ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
          Routes
        </Button>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 p-3 bg-card/80 backdrop-blur-sm rounded-md border shadow-sm">
        <div className="text-sm font-medium mb-2">Legend</div>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
            <span>Active Salesperson</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
            <span>Idle Salesperson</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
            <span>Offline Salesperson</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-sales-blue mr-2"></span>
            <span>Customer</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
            <span>Prospect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
