
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react'; // Changed from default import to named import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus, Printer, QrCode } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  onGenerate?: (codes: CoconutQR[]) => void;
}

interface CoconutQR {
  id: string;
  coconutId: string;
  type: string;
  createdAt: string;
  assignedTo: string | null;
  batchId: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onGenerate }) => {
  const [coconutType, setCoconutType] = useState('regular');
  const [quantity, setQuantity] = useState(10);
  const [batchId, setBatchId] = useState(uuidv4().substring(0, 8).toUpperCase());
  const [generatedCodes, setGeneratedCodes] = useState<CoconutQR[]>([]);
  
  const handleGenerate = () => {
    const newCodes: CoconutQR[] = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < quantity; i++) {
      const coconutId = `COCO-${timestamp}-${i+1}`;
      newCodes.push({
        id: uuidv4(),
        coconutId,
        type: coconutType,
        createdAt: new Date().toISOString(),
        assignedTo: null,
        batchId: batchId
      });
    }
    
    setGeneratedCodes(newCodes);
    
    if (onGenerate) {
      onGenerate(newCodes);
    }
    
    toast({
      title: "QR Codes Generated",
      description: `${quantity} QR codes have been generated for ${coconutType} coconuts`
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // Create a JSON file with the generated codes
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedCodes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `coconut-qr-codes-${batchId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5 text-sales-blue" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for tracking coconuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Coconut Type</Label>
                  <Select value={coconutType} onValueChange={setCoconutType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="young">Young</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                    max={100}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch">Batch ID</Label>
                <Input 
                  id="batch" 
                  value={batchId} 
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="Enter batch ID"
                />
              </div>
              
              <Button className="w-full" onClick={handleGenerate}>
                <Plus className="mr-2 h-4 w-4" />
                Generate {quantity} QR Codes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            {generatedCodes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Batch: {batchId}</h3>
                    <p className="text-sm text-muted-foreground">
                      {generatedCodes.length} codes generated
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="print:block hidden fixed inset-0 bg-white z-50 p-8" id="print-area">
                  <div className="grid grid-cols-2 gap-4 print:grid-cols-3">
                    {generatedCodes.map((code) => (
                      <div key={code.id} className="border rounded p-4 flex flex-col items-center">
                        <QRCodeSVG 
                          value={JSON.stringify({
                            coconutId: code.coconutId,
                            type: code.type,
                            batchId: code.batchId
                          })}
                          size={150}
                        />
                        <div className="mt-2 text-center">
                          <div className="font-bold">{code.coconutId}</div>
                          <div className="text-xs text-muted-foreground">
                            Type: {code.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Batch: {code.batchId}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <ScrollArea className="h-[350px] rounded-md border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {generatedCodes.map((code) => (
                      <div key={code.id} className="border rounded p-4 flex flex-col items-center">
                        <QRCodeSVG 
                          value={JSON.stringify({
                            coconutId: code.coconutId,
                            type: code.type,
                            batchId: code.batchId
                          })}
                          size={120}
                        />
                        <div className="mt-2 text-center">
                          <div className="font-semibold">{code.coconutId}</div>
                          <div className="text-xs text-muted-foreground">
                            Type: {code.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <QrCode className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-medium text-lg">No QR Codes Generated</h3>
                <p className="text-muted-foreground">
                  Go to the Generate tab to create QR codes for coconuts
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
