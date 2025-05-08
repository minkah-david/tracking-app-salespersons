
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Bell, QrCode } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={onOpenMobileMenu} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-2">
          <img src="/placeholder.svg" alt="CocoReeno" className="h-8 w-8" />
          <span className="font-semibold hidden md:inline">CocoReeno</span>
        </div>
        
        <nav className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Tracking Map
          </Link>
          <Link to="/sales" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Sales Analytics
          </Link>
          <Link to="/qr-management" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            QR Management
          </Link>
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <QrCode className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>CR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
