
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import QRScanner from '@/components/QRScanner';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  CreditCard, 
  DollarSign, 
  Check, 
  AlertCircle, 
  Camera, 
  Upload, 
  CheckCircle,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';

// Sample sales data for demonstration
const initialSalesData = [
  {
    id: 'SALE-001',
    salespersonId: 'SP-001',
    salespersonName: 'John Smith',
    quantityAllocated: 10,
    quantitySold: 10,
    expectedRevenue: 50.00,
    actualRevenue: 50.00,
    status: 'correct',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    transactionId: 'MOMO-12345',
    depositReference: 'John Smith',
    depositConfirmed: true
  },
  {
    id: 'SALE-002',
    salespersonId: 'SP-002',
    salespersonName: 'Sarah Johnson',
    quantityAllocated: 8,
    quantitySold: 7,
    expectedRevenue: 40.00,
    actualRevenue: 35.00,
    status: 'deficit',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    transactionId: 'MOMO-12346',
    depositReference: 'Sarah Johnson',
    depositConfirmed: true,
    spoilageClaims: 1,
    spoilageEvidence: ['spoilt-evidence-1.jpg']
  }
];

const SalesProcess = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('allocation');
  const [salesData, setSalesData] = useState(initialSalesData);
  const [showScanner, setShowScanner] = useState(false);
  const [salesVerification, setSalesVerification] = useState<{
    verifying: boolean,
    salespersonId: string,
    transactionId: string,
    expectedAmount: number,
    actualAmount: number,
    status?: 'correct' | 'deficit'
  }>({
    verifying: false,
    salespersonId: '',
    transactionId: '',
    expectedAmount: 0,
    actualAmount: 0
  });
  
  const [showSpoilageForm, setShowSpoilageForm] = useState(false);
  const [spoilageImages, setSpoilageImages] = useState<string[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleVerifySales = (salespersonId: string, expectedAmount: number) => {
    setSalesVerification({
      verifying: true,
      salespersonId,
      transactionId: '',
      expectedAmount,
      actualAmount: expectedAmount
    });
  };
  
  const handleSubmitVerification = () => {
    const { salespersonId, transactionId, expectedAmount, actualAmount } = salesVerification;
    const status = actualAmount >= expectedAmount ? 'correct' : 'deficit';
    
    // Update the sales data
    setSalesData(prev => prev.map(sale => 
      sale.salespersonId === salespersonId
        ? {
            ...sale,
            actualRevenue: actualAmount,
            status,
            transactionId,
            depositConfirmed: true
          }
        : sale
    ));
    
    toast({
      title: "Sales Verification Complete",
      description: status === 'correct' 
        ? "Sales amount verified successfully" 
        : "Sales deficit detected. Follow up required.",
      variant: status === 'correct' ? 'default' : 'destructive'
    });
    
    setSalesVerification({
      verifying: false,
      salespersonId: '',
      transactionId: '',
      expectedAmount: 0,
      actualAmount: 0
    });
    
    if (status === 'deficit') {
      setShowSpoilageForm(true);
    }
  };
  
  const handleAddSpoilageEvidence = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setSpoilageImages(prev => [...prev, reader.result as string]);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmitSpoilage = () => {
    const salesIndex = salesData.findIndex(sale => sale.status === 'deficit' && !sale.spoilageEvidence);
    
    if (salesIndex >= 0) {
      const updatedSalesData = [...salesData];
      updatedSalesData[salesIndex] = {
        ...updatedSalesData[salesIndex],
        spoilageClaims: Math.round((updatedSalesData[salesIndex].expectedRevenue - updatedSalesData[salesIndex].actualRevenue) / 5),
        spoilageEvidence: spoilageImages
      };
      
      setSalesData(updatedSalesData);
      
      toast({
        title: "Spoilage Evidence Recorded",
        description: "The spoilage claim has been recorded and will be reviewed"
      });
      
      setShowSpoilageForm(false);
      setSpoilageImages([]);
    }
  };

  const handleRecordSale = (coconutId: string, scanData: any) => {
    toast({
      title: "Sale Recorded",
      description: `Coconut ${coconutId} marked as sold`
    });
    
    setShowScanner(false);
  };
  
  // For allocation tab
  const [allocation, setAllocation] = useState({
    salespersonId: '',
    salespersonName: '',
    quantity: 10
  });
  
  const handleAllocateCoconuts = () => {
    // In a real app, this would create a new allocation record
    const newSale = {
      id: `SALE-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      salespersonId: allocation.salespersonId || `SP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      salespersonName: allocation.salespersonName,
      quantityAllocated: allocation.quantity,
      quantitySold: 0,
      expectedRevenue: allocation.quantity * 5.00,
      actualRevenue: 0,
      status: 'pending',
      timestamp: new Date().toISOString(),
      transactionId: '',
      depositReference: allocation.salespersonName,
      depositConfirmed: false
    };
    
    setSalesData(prev => [newSale, ...prev]);
    
    toast({
      title: "Allocation Successful",
      description: `${allocation.quantity} coconuts allocated to ${allocation.salespersonName}`
    });
    
    setAllocation({
      salespersonId: '',
      salespersonName: '',
      quantity: 10
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Process</h1>
            <p className="text-muted-foreground">
              Manage coconut allocation, sales verification, and returns
            </p>
          </div>
          
          {showScanner ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Record Sale</h2>
                <Button variant="outline" onClick={() => setShowScanner(false)}>
                  Back
                </Button>
              </div>
              <QRScanner onScanSuccess={handleRecordSale} mode="sales" />
            </div>
          ) : showSpoilageForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Record Spoilage Evidence</h2>
                <Button variant="outline" onClick={() => setShowSpoilageForm(false)}>
                  Cancel
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Spoilage Evidence</CardTitle>
                  <CardDescription>
                    Take photos of the spoilt coconut(s) as evidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Sales Deficit Detected</AlertTitle>
                    <AlertDescription>
                      Please provide evidence of spoilt coconuts to justify the sales deficit
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <Label htmlFor="evidence">Add Photos (4-5 required)</Label>
                    <div className="flex items-center gap-2">
                      <Label 
                        htmlFor="evidence" 
                        className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 flex-1"
                      >
                        <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-muted-foreground">Take Photo</span>
                        <Input 
                          id="evidence" 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          className="sr-only" 
                          onChange={handleAddSpoilageEvidence}
                        />
                      </Label>
                      
                      {spoilageImages.length > 0 && (
                        <Button variant="outline" onClick={() => setSpoilageImages([])}>
                          Clear All
                        </Button>
                      )}
                    </div>
                    
                    {spoilageImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {spoilageImages.map((img, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={img} 
                              alt={`Spoilage evidence ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                setSpoilageImages(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full" 
                        onClick={handleSubmitSpoilage}
                        disabled={spoilageImages.length < 4}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Spoilage Evidence
                      </Button>
                      {spoilageImages.length < 4 && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Please add at least 4 photos of the spoilt coconut(s)
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : salesVerification.verifying ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Verify Sales Deposit</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setSalesVerification({
                    verifying: false,
                    salespersonId: '',
                    transactionId: '',
                    expectedAmount: 0,
                    actualAmount: 0
                  })}
                >
                  Cancel
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Verification</CardTitle>
                  <CardDescription>
                    Verify the sales deposit made by the salesperson
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expected">Expected Amount</Label>
                        <Input 
                          id="expected" 
                          value={`$${salesVerification.expectedAmount.toFixed(2)}`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="actual">Actual Deposit Amount</Label>
                        <Input 
                          id="actual" 
                          type="number" 
                          value={salesVerification.actualAmount}
                          onChange={(e) => setSalesVerification({
                            ...salesVerification,
                            actualAmount: parseFloat(e.target.value) || 0
                          })}
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transaction">Mobile Money Transaction ID</Label>
                      <Input 
                        id="transaction" 
                        value={salesVerification.transactionId}
                        onChange={(e) => setSalesVerification({
                          ...salesVerification,
                          transactionId: e.target.value
                        })}
                        placeholder="Enter MoMo transaction ID"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full" 
                        onClick={handleSubmitVerification}
                        disabled={!salesVerification.transactionId}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirm Deposit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="allocation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Allocate Coconuts</CardTitle>
                    <CardDescription>
                      Assign coconuts to salespersons for selling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salesperson">Salesperson ID</Label>
                          <Input 
                            id="salesperson" 
                            value={allocation.salespersonId}
                            onChange={(e) => setAllocation({
                              ...allocation,
                              salespersonId: e.target.value
                            })}
                            placeholder="Enter salesperson ID"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Salesperson Name</Label>
                          <Input 
                            id="name" 
                            value={allocation.salespersonName}
                            onChange={(e) => setAllocation({
                              ...allocation,
                              salespersonName: e.target.value
                            })}
                            placeholder="Enter salesperson name"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity to Allocate</Label>
                        <Input 
                          id="quantity" 
                          type="number" 
                          value={allocation.quantity}
                          onChange={(e) => setAllocation({
                            ...allocation,
                            quantity: parseInt(e.target.value) || 0
                          })}
                          min="1"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">
                          Expected revenue: ${(allocation.quantity * 5).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          className="w-full" 
                          onClick={handleAllocateCoconuts}
                          disabled={!allocation.salespersonName || allocation.quantity <= 0}
                        >
                          Allocate Coconuts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <h3 className="text-lg font-medium mt-6">Recent Allocations</h3>
                <div className="rounded-md border">
                  <div className="px-4 py-3 border-b bg-muted/50">
                    <div className="grid grid-cols-4 font-medium text-sm">
                      <div>Salesperson</div>
                      <div>Quantity</div>
                      <div>Expected Revenue</div>
                      <div>Status</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {salesData.map(sale => (
                      <div key={sale.id} className="px-4 py-3">
                        <div className="grid grid-cols-4 items-center">
                          <div>
                            <div className="font-medium">{sale.salespersonName}</div>
                            <div className="text-xs text-muted-foreground">{sale.salespersonId}</div>
                          </div>
                          <div>{sale.quantityAllocated}</div>
                          <div>${sale.expectedRevenue.toFixed(2)}</div>
                          <div>
                            {sale.status === 'pending' ? (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-200">
                                Pending
                              </Badge>
                            ) : sale.status === 'correct' ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-200">
                                Deficit
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sales">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Record Sales</CardTitle>
                      <CardDescription>
                        Scan QR codes when coconuts are sold
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setShowScanner(true)} className="w-full">
                        <Scan className="mr-2 h-4 w-4" />
                        Open QR Scanner
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        Sales transactions recorded today
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* This would show recent sales from QR scans */}
                      <div className="rounded-md border">
                        <div className="px-4 py-3 border-b bg-muted/50">
                          <div className="grid grid-cols-4 font-medium text-sm">
                            <div>Time</div>
                            <div>Coconut ID</div>
                            <div>Location</div>
                            <div>Price</div>
                          </div>
                        </div>
                        
                        <div className="p-4 text-center text-muted-foreground">
                          No sales recorded today
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="verification">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Verification</CardTitle>
                    <CardDescription>
                      Verify mobile money deposits from salespersons
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {salesData.filter(sale => sale.status === 'pending' || !sale.depositConfirmed).length > 0 ? (
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Pending Verification</AlertTitle>
                          <AlertDescription>
                            The following sales require verification of deposits
                          </AlertDescription>
                        </Alert>
                        
                        <div className="rounded-md border divide-y">
                          {salesData
                            .filter(sale => sale.status === 'pending' || !sale.depositConfirmed)
                            .map(sale => (
                              <div key={sale.id} className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{sale.salespersonName}</div>
                                    <div className="text-xs text-muted-foreground">{sale.salespersonId}</div>
                                    <div className="mt-1 text-sm">
                                      Expected: <span className="font-medium">${sale.expectedRevenue.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <Button onClick={() => handleVerifySales(sale.salespersonId, sale.expectedRevenue)}>
                                    Verify Deposit
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500/40 mb-2" />
                        <h3 className="text-lg font-medium">All Deposits Verified</h3>
                        <p className="text-muted-foreground">
                          There are no pending deposits to verify
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <h3 className="text-lg font-medium mt-6">Verification History</h3>
                <div className="rounded-md border">
                  <div className="px-4 py-3 border-b bg-muted/50">
                    <div className="grid grid-cols-5 font-medium text-sm">
                      <div>Salesperson</div>
                      <div>Expected</div>
                      <div>Actual</div>
                      <div>Transaction ID</div>
                      <div>Status</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {salesData
                      .filter(sale => sale.depositConfirmed)
                      .map(sale => (
                        <div key={sale.id} className="px-4 py-3">
                          <div className="grid grid-cols-5 items-center">
                            <div>
                              <div className="font-medium">{sale.salespersonName}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(sale.timestamp), 'MMM d, h:mm a')}
                              </div>
                            </div>
                            <div>${sale.expectedRevenue.toFixed(2)}</div>
                            <div>${sale.actualRevenue.toFixed(2)}</div>
                            <div>{sale.transactionId}</div>
                            <div>
                              {sale.status === 'correct' ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                                  Correct
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-200">
                                  Deficit
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="returns">
                <Card>
                  <CardHeader>
                    <CardTitle>Spoilt Coconut Returns</CardTitle>
                    <CardDescription>
                      Manage and document spoilt coconut returns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border divide-y">
                      {salesData
                        .filter(sale => sale.status === 'deficit' && sale.spoilageClaims)
                        .map(sale => (
                          <div key={sale.id} className="p-4">
                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                              <div>
                                <div className="font-medium">{sale.salespersonName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(sale.timestamp), 'MMM d, h:mm a')}
                                </div>
                                <div className="mt-1">
                                  <span className="text-sm">
                                    {sale.spoilageClaims} coconut(s) claimed as spoilt
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 md:mt-0">
                                <Button variant="outline" size="sm">
                                  <Camera className="h-4 w-4 mr-1" />
                                  View Evidence
                                </Button>
                              </div>
                            </div>
                            
                            {sale.spoilageEvidence && (
                              <details className="mt-3">
                                <summary className="text-sm font-medium cursor-pointer flex items-center">
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                  Photos ({sale.spoilageEvidence.length})
                                </summary>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                  {sale.spoilageEvidence.map((img, index) => (
                                    <div key={index} className="relative">
                                      <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                                        <Camera className="h-8 w-8 text-muted-foreground" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        ))}
                    </div>
                    
                    {salesData.filter(sale => sale.status === 'deficit' && sale.spoilageClaims).length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500/40 mb-2" />
                        <h3 className="text-lg font-medium">No Returns Recorded</h3>
                        <p className="text-muted-foreground">
                          There are no spoilt coconut returns in the system
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesProcess;
