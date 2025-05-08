
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, Tag, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRGeneratorProps {
  batchPrefix?: string;
  onGenerate?: (codes: string[]) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ 
  batchPrefix = "COCO", 
  onGenerate 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(200);
  const [coconutType, setCoconutType] = useState("regular");
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  const generateQRCodes = () => {
    const timestamp = Date.now();
    const newCodes = [];
    
    for (let i = 0; i < quantity; i++) {
      const id = `${batchPrefix}-${timestamp}-${i + 1}`;
      const qrData = {
        coconutId: id,
        type: coconutType,
        batchId: `${batchPrefix}-${timestamp}`,
        generatedAt: new Date().toISOString()
      };
      
      newCodes.push(JSON.stringify(qrData));
    }
    
    setGeneratedCodes(newCodes);
    setCurrentCode(newCodes[0]);
    
    if (onGenerate) {
      onGenerate(newCodes);
    }
    
    toast({
      title: "QR Codes Generated",
      description: `Successfully created ${quantity} QR codes`
    });
  };
  
  const downloadQR = () => {
    if (!currentCode) return;
    
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `coconut-qr-${JSON.parse(currentCode).coconutId}.png`;
      link.href = url;
      link.click();
    }
  };
  
  const printQR = () => {
    if (!currentCode) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
      const qrImage = canvas.toDataURL('image/png');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
              .qr-container { margin-bottom: 15px; }
              .details { font-size: 12px; color: #555; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrImage}" alt="QR Code" style="width: 200px; height: 200px;" />
            </div>
            <div class="details">
              <p>ID: ${JSON.parse(currentCode).coconutId}</p>
              <p>Type: ${JSON.parse(currentCode).type}</p>
              <p>Generated: ${new Date(JSON.parse(currentCode).generatedAt).toLocaleDateString()}</p>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  const copyToClipboard = () => {
    if (!currentCode) return;
    
    navigator.clipboard.writeText(currentCode);
    toast({
      title: "Copied to clipboard",
      description: "QR code data copied to clipboard"
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5 text-sales-blue" />
          Generate Coconut QR Codes
        </CardTitle>
        <CardDescription>
          Create QR codes for tracking coconut inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentCode ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Number of QR Codes</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1" 
                max="100" 
                value={quantity} 
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="coconut-type">Coconut Type</Label>
              <Select value={coconutType} onValueChange={setCoconutType}>
                <SelectTrigger id="coconut-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="young">Young Coconut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="size">QR Code Size (px)</Label>
              <Input 
                id="size" 
                type="number" 
                min="100" 
                max="400" 
                step="50" 
                value={size} 
                onChange={e => setSize(parseInt(e.target.value) || 200)}
              />
            </div>
            
            <Button 
              onClick={generateQRCodes} 
              className="w-full mt-2"
            >
              Generate QR Codes
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="border p-4 rounded bg-white">
                <QRCode 
                  id="qr-code-canvas"
                  value={currentCode} 
                  size={size} 
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium">Coconut ID:</p>
              <p className="text-xs text-muted-foreground break-all">
                {JSON.parse(currentCode).coconutId}
              </p>
            </div>
            
            {generatedCodes.length > 1 && (
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={generatedCodes.indexOf(currentCode) === 0}
                  onClick={() => {
                    const currentIndex = generatedCodes.indexOf(currentCode);
                    if (currentIndex > 0) {
                      setCurrentCode(generatedCodes[currentIndex - 1]);
                    }
                  }}
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-muted-foreground">
                  {generatedCodes.indexOf(currentCode) + 1} of {generatedCodes.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={generatedCodes.indexOf(currentCode) === generatedCodes.length - 1}
                  onClick={() => {
                    const currentIndex = generatedCodes.indexOf(currentCode);
                    if (currentIndex < generatedCodes.length - 1) {
                      setCurrentCode(generatedCodes[currentIndex + 1]);
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {currentCode && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => {
            setCurrentCode(null);
            setGeneratedCodes([]);
          }}>
            Create New Batch
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadQR}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={printQR}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default QRGenerator;
