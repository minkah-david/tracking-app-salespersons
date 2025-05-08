
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import QRGenerator from '@/components/QRGenerator';
import QRScanner from '@/components/QRScanner';
import CoconutInventory from '@/components/CoconutInventory';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { QrCode, ScanLine, Tag, Database } from 'lucide-react';

// Sample inventory for demonstration
const initialInventory = [
  {
    id: 'COCO-1620156789-1',
    type: 'regular',
    addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    soldAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    location: {
      lat: 40.712776,
      lng: -74.005974,
      address: '123 Broadway, New York'
    },
    saleAmount: 5.99
  },
  {
    id: 'COCO-1620156789-2',
    type: 'premium',
    addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    soldAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    location: {
      lat: 40.718234,
      lng: -73.998546,
      address: '45 Park Avenue, New York'
    },
    saleAmount: 8.99
  },
  {
    id: 'COCO-1620156789-3',
    type: 'young',
    addedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    soldAt: null,
    location: null,
    saleAmount: 0
  },
  {
    id: 'COCO-1620156789-4',
    type: 'organic',
    addedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    soldAt: null,
    location: null,
    saleAmount: 0
  }
];

const QRCodeManagement = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [showScanner, setShowScanner] = useState(false);
  const [scannerMode, setScannerMode] = useState<'inventory' | 'sales'>('inventory');
  const [inventory, setInventory] = useState(initialInventory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleScanSuccess = (coconutId: string, scanData: any) => {
    if (scannerMode === 'inventory') {
      // Add to inventory
      const newCoconut = {
        id: coconutId,
        type: scanData.qrData.type || 'regular',
        addedAt: new Date().toISOString(),
        soldAt: null,
        location: scanData.location || null,
        saleAmount: 0
      };
      
      setInventory(prev => [...prev, newCoconut]);
      
      toast({
        title: "Added to Inventory",
        description: `Coconut ${coconutId} added to your inventory`,
      });
    } else {
      // Record a sale
      setInventory(prev => 
        prev.map(coconut => 
          coconut.id === coconutId 
            ? {
                ...coconut,
                soldAt: new Date().toISOString(),
                location: scanData.location || null,
                saleAmount: 5.99 // Hardcoded for demo
              }
            : coconut
        )
      );
      
      toast({
        title: "Sale Recorded",
        description: `Coconut ${coconutId} marked as sold`,
      });
    }
    
    setShowScanner(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">QR Code Management</h1>
            <p className="text-muted-foreground">Generate, scan and manage coconut QR codes</p>
          </div>
          
          {showScanner ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <ScanLine className="h-5 w-5 mr-2 text-sales-blue" />
                  {scannerMode === 'inventory' ? 'Scan Inventory' : 'Record Sale'}
                </h2>
                <Button variant="outline" onClick={() => setShowScanner(false)}>
                  Back
                </Button>
              </div>
              
              <QRScanner 
                onScanSuccess={handleScanSuccess}
                mode={scannerMode}
              />
            </div>
          ) : (
            isMobile ? (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="scan">
                    <ScanLine className="h-4 w-4 mr-2" />
                    Scan
                  </TabsTrigger>
                  <TabsTrigger value="inventory">
                    <Database className="h-4 w-4 mr-2" />
                    Inventory
                  </TabsTrigger>
                  <TabsTrigger value="generate">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="scan" className="space-y-4">
                  <div className="grid gap-4">
                    <Card className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sales-blue/20 to-transparent" />
                      <CardHeader className="relative">
                        <CardTitle>Scan for Inventory</CardTitle>
                        <CardDescription>
                          Add new coconuts to your inventory
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <Button 
                          onClick={() => {
                            setScannerMode('inventory');
                            setShowScanner(true);
                          }}
                          className="w-full"
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Scan Inventory
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                      <CardHeader className="relative">
                        <CardTitle>Scan for Sales</CardTitle>
                        <CardDescription>
                          Record a sale by scanning coconut QR code
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <Button 
                          onClick={() => {
                            setScannerMode('sales');
                            setShowScanner(true);
                          }}
                          className="w-full"
                        >
                          <ScanLine className="h-4 w-4 mr-2" />
                          Record Sale
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="inventory">
                  <CoconutInventory 
                    inventory={inventory} 
                    onScanInventory={() => {
                      setScannerMode('inventory');
                      setShowScanner(true);
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="generate">
                  <QRGenerator
                    onGenerate={(codes) => {
                      toast({
                        title: "QR Codes Generated",
                        description: `${codes.length} codes ready to print`
                      });
                    }}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sales-blue/20 to-transparent" />
                      <CardHeader className="relative">
                        <CardTitle>Scan for Inventory</CardTitle>
                        <CardDescription>
                          Add new coconuts to your inventory
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <Button 
                          onClick={() => {
                            setScannerMode('inventory');
                            setShowScanner(true);
                          }}
                          className="w-full"
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Scan Inventory
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                      <CardHeader className="relative">
                        <CardTitle>Scan for Sales</CardTitle>
                        <CardDescription>
                          Record a sale by scanning coconut QR code
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <Button 
                          onClick={() => {
                            setScannerMode('sales');
                            setShowScanner(true);
                          }}
                          className="w-full"
                        >
                          <ScanLine className="h-4 w-4 mr-2" />
                          Record Sale
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <QRGenerator
                      onGenerate={(codes) => {
                        toast({
                          title: "QR Codes Generated",
                          description: `${codes.length} codes ready to print`
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <CoconutInventory 
                    inventory={inventory} 
                    onScanInventory={() => {
                      setScannerMode('inventory');
                      setShowScanner(true);
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeManagement;
