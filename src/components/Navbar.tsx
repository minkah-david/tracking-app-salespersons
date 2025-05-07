
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      message: 'Alex Johnson left geofence Downtown Core',
      time: '5 minutes ago'
    },
    {
      id: 'n2',
      message: 'Jamie Rivera completed a sale ($1,750)',
      time: '15 minutes ago'
    },
    {
      id: 'n3',
      message: 'Morgan Smith reached daily sales target',
      time: '1 hour ago'
    }
  ]);
  
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={onOpenMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="text-lg font-semibold text-sales-blue">
            Field Sales Compass
          </div>
        </div>
        
        {!isMobile && (
          <div className="ml-10 flex items-center gap-4">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-[200px] pl-8 h-9" 
              />
            </div>
          </div>
        )}
        
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sales-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sales-orange"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  Mark all read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="font-medium text-sm">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img 
                  src="https://i.pravatar.cc/150?img=70" 
                  alt="Admin User"
                  className="rounded-full h-8 w-8 object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
