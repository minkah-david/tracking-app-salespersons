
// Sample data for the sales tracking app

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  position: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'idle' | 'offline';
  lastActive: string;
  salesForToday: number;
  targetForToday: number;
  assignedArea: string;
}

export interface Sale {
  id: string;
  salespersonId: string;
  customerName: string;
  amount: number;
  products: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  paymentMethod: 'cash' | 'credit' | 'debit' | 'online';
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Geofence {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
  color: string;
  assigned: string[]; // salesperson IDs
}

export interface Route {
  id: string;
  salespersonId: string;
  waypoints: {
    lat: number;
    lng: number;
    name: string;
    type: 'customer' | 'prospect' | 'checkpoint';
    visited: boolean;
    estimatedArrival?: string;
  }[];
  optimized: boolean;
  totalDistance: number; // in kilometers
  totalDuration: number; // in minutes
}

// Sample Salespeople
export const salespeople: Salesperson[] = [
  {
    id: "sp1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "(555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=1",
    position: { lat: 40.712776, lng: -74.005974 },
    status: "active",
    lastActive: new Date().toISOString(),
    salesForToday: 3250,
    targetForToday: 5000,
    assignedArea: "Downtown"
  },
  {
    id: "sp2",
    name: "Morgan Smith",
    email: "morgan.s@example.com",
    phone: "(555) 234-5678",
    avatar: "https://i.pravatar.cc/150?img=2",
    position: { lat: 40.718234, lng: -73.998438 },
    status: "active",
    lastActive: new Date().toISOString(),
    salesForToday: 4750,
    targetForToday: 5000,
    assignedArea: "Midtown"
  },
  {
    id: "sp3",
    name: "Jamie Rivera",
    email: "jamie.r@example.com",
    phone: "(555) 345-6789",
    avatar: "https://i.pravatar.cc/150?img=3",
    position: { lat: 40.707637, lng: -74.011953 },
    status: "idle",
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    salesForToday: 2800,
    targetForToday: 5000,
    assignedArea: "Financial District"
  },
  {
    id: "sp4",
    name: "Taylor Wu",
    email: "taylor.w@example.com",
    phone: "(555) 456-7890",
    avatar: "https://i.pravatar.cc/150?img=4",
    position: { lat: 40.725037, lng: -73.987563 },
    status: "offline",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    salesForToday: 1500,
    targetForToday: 5000,
    assignedArea: "East Village"
  },
  {
    id: "sp5",
    name: "Jordan Patel",
    email: "jordan.p@example.com",
    phone: "(555) 567-8901",
    avatar: "https://i.pravatar.cc/150?img=5",
    position: { lat: 40.742054, lng: -73.992449 },
    status: "active",
    lastActive: new Date().toISOString(),
    salesForToday: 6200,
    targetForToday: 5000,
    assignedArea: "Chelsea"
  }
];

// Sample Sales
export const sales: Sale[] = [
  {
    id: "sale1",
    salespersonId: "sp1",
    customerName: "Acme Corp",
    amount: 1250.00,
    products: [
      { id: "p1", name: "Premium Package", quantity: 1, unitPrice: 1250.00 }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: {
      lat: 40.712776,
      lng: -74.005974,
      address: "123 Broadway, New York, NY"
    },
    paymentMethod: "credit",
    status: "completed"
  },
  {
    id: "sale2",
    salespersonId: "sp1",
    customerName: "Global Tech",
    amount: 850.00,
    products: [
      { id: "p2", name: "Basic Package", quantity: 1, unitPrice: 850.00 }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    location: {
      lat: 40.713825,
      lng: -74.006037,
      address: "85 Chambers St, New York, NY"
    },
    paymentMethod: "online",
    status: "completed"
  },
  {
    id: "sale3",
    salespersonId: "sp2",
    customerName: "Citywide Services",
    amount: 2450.00,
    products: [
      { id: "p1", name: "Premium Package", quantity: 1, unitPrice: 1250.00 },
      { id: "p3", name: "Additional Support", quantity: 4, unitPrice: 300.00 }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    location: {
      lat: 40.718234,
      lng: -73.998438,
      address: "401 Park Ave S, New York, NY"
    },
    paymentMethod: "debit",
    status: "completed"
  },
  {
    id: "sale4",
    salespersonId: "sp2",
    customerName: "Metro Media",
    amount: 850.00,
    products: [
      { id: "p2", name: "Basic Package", quantity: 1, unitPrice: 850.00 }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    location: {
      lat: 40.719078,
      lng: -73.997920,
      address: "220 5th Ave, New York, NY"
    },
    paymentMethod: "cash",
    status: "completed"
  },
  {
    id: "sale5",
    salespersonId: "sp3",
    customerName: "Urban Outfitters",
    amount: 1750.00,
    products: [
      { id: "p1", name: "Premium Package", quantity: 1, unitPrice: 1250.00 },
      { id: "p4", name: "Analytics Add-on", quantity: 1, unitPrice: 500.00 }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    location: {
      lat: 40.707637,
      lng: -74.011953,
      address: "52 Broadway, New York, NY"
    },
    paymentMethod: "credit",
    status: "completed"
  },
  {
    id: "sale6",
    salespersonId: "sp5",
    customerName: "Tech Innovations",
    amount: 3200.00,
    products: [
      { id: "p1", name: "Premium Package", quantity: 2, unitPrice: 1250.00 },
      { id: "p4", name: "Analytics Add-on", quantity: 1, unitPrice: 500.00 },
      { id: "p3", name: "Additional Support", quantity: 2, unitPrice: 300.00 }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 350).toISOString(),
    location: {
      lat: 40.742054,
      lng: -73.992449,
      address: "675 6th Ave, New York, NY"
    },
    paymentMethod: "online",
    status: "completed"
  }
];

// Sample Geofences
export const geofences: Geofence[] = [
  {
    id: "geo1",
    name: "Downtown Core",
    center: { lat: 40.712776, lng: -74.005974 },
    radius: 1000,
    color: "#8B5CF6",
    assigned: ["sp1", "sp3"]
  },
  {
    id: "geo2",
    name: "Midtown Central",
    center: { lat: 40.718234, lng: -73.998438 },
    radius: 1200,
    color: "#0EA5E9",
    assigned: ["sp2"]
  },
  {
    id: "geo3",
    name: "East Village Zone",
    center: { lat: 40.725037, lng: -73.987563 },
    radius: 800,
    color: "#F97316",
    assigned: ["sp4"]
  },
  {
    id: "geo4",
    name: "Chelsea District",
    center: { lat: 40.742054, lng: -73.992449 },
    radius: 900,
    color: "#10B981",
    assigned: ["sp5"]
  }
];

// Sample Routes
export const routes: Route[] = [
  {
    id: "route1",
    salespersonId: "sp1",
    waypoints: [
      {
        lat: 40.712776,
        lng: -74.005974,
        name: "Acme Corp",
        type: "customer",
        visited: true,
        estimatedArrival: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        lat: 40.713825,
        lng: -74.006037,
        name: "Global Tech",
        type: "customer",
        visited: true,
        estimatedArrival: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      },
      {
        lat: 40.710086,
        lng: -74.012693,
        name: "Hudson Financial",
        type: "prospect",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 30).toISOString()
      },
      {
        lat: 40.707176,
        lng: -74.009301,
        name: "Wall Street Plaza",
        type: "prospect",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 90).toISOString()
      }
    ],
    optimized: true,
    totalDistance: 2.3,
    totalDuration: 45
  },
  {
    id: "route2",
    salespersonId: "sp2",
    waypoints: [
      {
        lat: 40.718234,
        lng: -73.998438,
        name: "Citywide Services",
        type: "customer",
        visited: true,
        estimatedArrival: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        lat: 40.719078,
        lng: -73.997920,
        name: "Metro Media",
        type: "customer",
        visited: true,
        estimatedArrival: new Date(Date.now() - 1000 * 60 * 180).toISOString()
      },
      {
        lat: 40.721872,
        lng: -73.996673,
        name: "Empire Solutions",
        type: "prospect",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 20).toISOString()
      },
      {
        lat: 40.724708,
        lng: -73.999632,
        name: "Midtown Checkpoint",
        type: "checkpoint",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 60).toISOString()
      }
    ],
    optimized: true,
    totalDistance: 1.8,
    totalDuration: 35
  },
  {
    id: "route3",
    salespersonId: "sp5",
    waypoints: [
      {
        lat: 40.742054,
        lng: -73.992449,
        name: "Tech Innovations",
        type: "customer",
        visited: true,
        estimatedArrival: new Date(Date.now() - 1000 * 60 * 350).toISOString()
      },
      {
        lat: 40.743870,
        lng: -73.995143,
        name: "Chelsea Market",
        type: "checkpoint",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 15).toISOString()
      },
      {
        lat: 40.746670,
        lng: -73.991235,
        name: "Highline Tech",
        type: "prospect",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 45).toISOString()
      },
      {
        lat: 40.749825,
        lng: -73.987562,
        name: "Hudson Yards Hub",
        type: "prospect",
        visited: false,
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 90).toISOString()
      }
    ],
    optimized: true,
    totalDistance: 2.5,
    totalDuration: 50
  }
];
