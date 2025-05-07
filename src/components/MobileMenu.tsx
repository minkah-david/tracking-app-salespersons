
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Navigation,
  MapPin,
  Home,
  Users,
  BarChart4,
  Target,
  Settings,
  X
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Salespeople", active: false },
    { icon: MapPin, label: "Map View", active: false },
    { icon: Navigation, label: "Routes", active: false },
    { icon: Target, label: "Geofencing", active: false },
    { icon: BarChart4, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
        <SheetHeader className="border-b p-4 flex flex-row justify-between items-center">
          <SheetTitle className="text-lg text-left">Field Sales Compass</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start ${item.active ? 'bg-sales-blue/10 text-sales-blue hover:bg-sales-blue/20' : ''}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
