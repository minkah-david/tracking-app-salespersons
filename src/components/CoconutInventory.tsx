
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingBag, 
  Tag, 
  CheckCircle, 
  Activity,
  Download,
  Search
} from "lucide-react";
import { format } from 'date-fns';

// Sample inventory data structure
interface Coconut {
  id: string;
  type: string;
  addedAt: string;
  soldAt: string | null;
  location: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  saleAmount?: number;
}

interface CoconutInventoryProps {
  inventory: Coconut[];
  onScanInventory: () => void;
}

const CoconutInventory: React.FC<CoconutInventoryProps> = ({
  inventory,
  onScanInventory
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

  const filteredInventory = inventory.filter(coconut => {
    if (filter === 'available') return coconut.soldAt === null;
    if (filter === 'sold') return coconut.soldAt !== null;
    return true;
  });

  const availableCount = inventory.filter(c => c.soldAt === null).length;
  const soldCount = inventory.filter(c => c.soldAt !== null).length;
  const totalRevenue = inventory
    .filter(c => c.soldAt !== null && c.saleAmount)
    .reduce((sum, c) => sum + (c.saleAmount || 0), 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-sales-blue" />
            Coconut Inventory
          </div>
          <Button size="sm" onClick={onScanInventory}>
            <Tag className="h-4 w-4 mr-1" />
            Scan New
          </Button>
        </CardTitle>
        <CardDescription>
          Track your coconut inventory and sales
        </CardDescription>
      </CardHeader>
      <div className="px-6 py-2 flex space-x-2">
        <Button 
          variant={filter === 'all' ? "default" : "outline"} 
          size="sm" 
          onClick={() => setFilter('all')}
        >
          All ({inventory.length})
        </Button>
        <Button 
          variant={filter === 'available' ? "default" : "outline"} 
          size="sm" 
          onClick={() => setFilter('available')}
          className="text-green-600"
        >
          Available ({availableCount})
        </Button>
        <Button 
          variant={filter === 'sold' ? "default" : "outline"} 
          size="sm" 
          onClick={() => setFilter('sold')}
          className="text-sales-blue"
        >
          Sold ({soldCount})
        </Button>
      </div>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[400px] w-full">
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Added/Sold Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {filter === 'all' 
                        ? 'No inventory found. Scan coconuts to add them.' 
                        : filter === 'available' 
                        ? 'No available coconuts in inventory.' 
                        : 'No sold coconuts yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((coconut) => (
                    <TableRow key={coconut.id}>
                      <TableCell className="font-medium">{coconut.id.substring(coconut.id.lastIndexOf('-') + 1)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{coconut.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {coconut.soldAt === null ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            Sold
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {coconut.soldAt 
                          ? format(new Date(coconut.soldAt), 'MMM dd, HH:mm')
                          : format(new Date(coconut.addedAt), 'MMM dd, HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Available</span>
            <span className="text-xl font-bold">{availableCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Sold</span>
            <span className="text-xl font-bold">{soldCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Revenue</span>
            <span className="text-xl font-bold">${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CoconutInventory;
