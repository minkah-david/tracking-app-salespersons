
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Users, Map, DollarSign, BarChart, QrCode } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">CocoReeno</div>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                to="/" 
                onClick={onClose}
                className="flex items-center px-4 py-3 hover:bg-accent rounded-md"
              >
                <Map className="h-5 w-5 mr-3 text-sales-blue" />
                Tracking Map
              </Link>
            </li>
            <li>
              <Link 
                to="/sales" 
                onClick={onClose}
                className="flex items-center px-4 py-3 hover:bg-accent rounded-md"
              >
                <DollarSign className="h-5 w-5 mr-3 text-sales-blue" />
                Sales Analytics
              </Link>
            </li>
            <li>
              <Link 
                to="/qr-management" 
                onClick={onClose}
                className="flex items-center px-4 py-3 hover:bg-accent rounded-md"
              >
                <QrCode className="h-5 w-5 mr-3 text-sales-blue" />
                QR Management
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <div className="text-sm text-muted-foreground">
            CocoReeno Tracking System
            <br />
            Version 1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
