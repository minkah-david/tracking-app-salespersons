
import React, { useState, useEffect } from 'react';
import { Html5QrCode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, CheckCircle, AlertTriangle, Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanSuccess?: (coconutId: string, scanData: any) => void;
  mode?: 'inventory' | 'sales' | 'returns';
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  onScanSuccess,
  mode = 'sales' 
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scannerInstance, setScannerInstance] = useState<Html5QrCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const scannerContainerId = "html5-qrcode-scanner";
  
  useEffect(() => {
    // Clean up scanner when component unmounts
    return () => {
      if (scannerInstance) {
        scannerInstance.stop().catch(error => {
          console.error('Failed to stop scanner:', error);
        });
      }
    };
  }, [scannerInstance]);
  
  const startScanner = () => {
    setScanning(true);
    setError(null);
    setScanResult(null);
    
    try {
      const html5QrCode = new Html5QrCode(scannerContainerId);
      setScannerInstance(html5QrCode);
      
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText, decodedResult) => {
          // Handle success
          setScanning(false);
          setScanResult(decodedText);
          
          try {
            const qrData = JSON.parse(decodedText);
            
            // Check if the QR code contains the required fields
            if (!qrData.coconutId) {
              setError("Invalid QR code: Missing coconut identifier");
              stopScanner();
              return;
            }
            
            // Create scan data with location and timestamp
            const scanData = {
              timestamp: new Date().toISOString(),
              location: {
                lat: 0, // Will be filled by geolocation
                lng: 0, // Will be filled by geolocation
                accuracy: 0
              },
              scanType: mode
            };
            
            // Get current location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  scanData.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                  };
                  
                  if (onScanSuccess) {
                    onScanSuccess(qrData.coconutId, {
                      ...scanData,
                      qrData
                    });
                  }
                  
                  let toastMessage = "";
                  switch(mode) {
                    case 'inventory':
                      toastMessage = "Coconut added to inventory";
                      break;
                    case 'returns':
                      toastMessage = "Coconut marked as returned/spoilt";
                      break;
                    default:
                      toastMessage = "Sale recorded";
                  }
                  
                  toast({
                    title: toastMessage,
                    description: `Coconut ID: ${qrData.coconutId}`,
                  });
                },
                (geoError) => {
                  console.error("Geolocation error:", geoError);
                  // Still proceed with scan but without location
                  if (onScanSuccess) {
                    onScanSuccess(qrData.coconutId, {
                      ...scanData,
                      qrData,
                      locationError: "Could not get location"
                    });
                  }
                  
                  let toastMessage = "";
                  switch(mode) {
                    case 'inventory':
                      toastMessage = "Coconut added to inventory";
                      break;
                    case 'returns':
                      toastMessage = "Coconut marked as returned/spoilt";
                      break;
                    default:
                      toastMessage = "Sale recorded";
                  }
                  
                  toast({
                    title: toastMessage,
                    description: `Coconut ID: ${qrData.coconutId} (without location)`,
                    variant: "default"
                  });
                }
              );
            } else {
              // No geolocation support
              if (onScanSuccess) {
                onScanSuccess(qrData.coconutId, {
                  ...scanData,
                  qrData,
                  locationError: "Geolocation not supported"
                });
              }
            }
          } catch (e) {
            console.error("Error parsing QR code:", e);
            setError("Invalid QR code format");
          }
          
          stopScanner();
        },
        (errorMessage) => {
          // Handle error during scanning
          console.error("QR Scan error:", errorMessage);
        }
      ).catch(err => {
        console.error("Error starting scanner:", err);
        setError("Failed to start camera: " + err);
        setScanning(false);
      });
    } catch (err) {
      console.error("Scanner initialization error:", err);
      setError("Failed to initialize scanner");
      setScanning(false);
    }
  };
  
  const stopScanner = () => {
    if (scannerInstance) {
      scannerInstance.stop().then(() => {
        setScanning(false);
      }).catch(error => {
        console.error('Failed to stop scanner:', error);
        setScanning(false);
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="mr-2 h-5 w-5 text-sales-blue" />
          {mode === 'inventory' ? 'Scan Inventory' : mode === 'returns' ? 'Scan Returns' : 'Scan Sale'}
        </CardTitle>
        <CardDescription>
          {mode === 'inventory' 
            ? 'Scan coconut QR codes to add to your inventory' 
            : mode === 'returns'
              ? 'Scan coconut QR codes for returns or spoilage'
              : 'Scan coconut QR codes when making a sale'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
            <span>{error}</span>
          </div>
        )}
        
        {scanResult && (
          <div className="bg-green-50 p-3 rounded-md flex items-center text-sm">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Successfully scanned! ID: {JSON.parse(scanResult).coconutId || scanResult}</span>
          </div>
        )}
        
        <div id={scannerContainerId} className={`w-full ${scanning ? 'block' : 'hidden'}`} style={{ minHeight: '300px' }}></div>
        
        {!scanning && !scanResult && (
          <div className="border border-dashed rounded-md flex flex-col items-center justify-center p-8 text-center">
            <Scan className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">Camera preview will appear here</p>
            <Button onClick={startScanner} className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Start Scanning
            </Button>
          </div>
        )}
        
        {scanning && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={stopScanner} className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cancel Scan
            </Button>
          </div>
        )}
        
        {scanResult && (
          <div className="flex justify-end gap-2">
            <Button onClick={() => {
              setScanResult(null);
              setError(null);
            }} variant="outline">
              Scan Another
            </Button>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground pt-4">
          <p>
            {mode === 'inventory' 
              ? 'Scan each coconut before leaving the depot' 
              : mode === 'returns'
                ? 'Scan coconuts that are being returned or marked as spoilt'
                : 'Scan coconut QR code after completing a sale'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
