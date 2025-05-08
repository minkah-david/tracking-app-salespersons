import React from 'react';
import { Sale } from "@/data/sampleData";
import { salespeople } from "@/data/sampleData";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowRight,
  ChevronDown,
  DollarSign,
  CreditCard,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SalesListProps {
  sales: Sale[];
  onViewLocation?: (sale: Sale) => void;
}

const SalesList: React.FC<SalesListProps> = ({ 
  sales, 
  onViewLocation 
}) => {
  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const toggleSaleExpand = (saleId: string) => {
    if (expandedSale === saleId) {
      setExpandedSale(null);
    } else {
      setExpandedSale(saleId);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedSales = [...sales].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case "timestamp":
        valueA = new Date(a.timestamp).getTime();
        valueB = new Date(b.timestamp).getTime();
        break;
      case "amount":
        valueA = a.amount;
        valueB = b.amount;
        break;
      case "customer":
        valueA = a.customerName.toLowerCase();
        valueB = b.customerName.toLowerCase();
        break;
      default:
        valueA = new Date(a.timestamp).getTime();
        valueB = new Date(b.timestamp).getTime();
    }

    return sortDirection === "asc" 
      ? valueA > valueB ? 1 : -1
      : valueA < valueB ? 1 : -1;
  });

  const getSalespersonName = (id: string) => {
    const sp = salespeople.find(p => p.id === id);
    return sp ? sp.name : "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-200";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-200";
      default:
        return "";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-3.5 w-3.5" />;
      case "credit":
      case "debit":
        return <CreditCard className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              {sales.length} transactions in the last 24 hours
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("timestamp")}>
                Date & Time {sortField === "timestamp" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("amount")}>
                Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("customer")}>
                Customer {sortField === "customer" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSales.map((sale) => (
                <React.Fragment key={sale.id}>
                  <TableRow 
                    className={`${expandedSale === sale.id ? 'bg-muted/50' : ''} cursor-pointer hover:bg-muted/30`}
                    onClick={() => toggleSaleExpand(sale.id)}
                  >
                    <TableCell className="whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(new Date(sale.timestamp), "h:mm a")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(sale.timestamp), "MMM d")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sale.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        by {getSalespersonName(sale.salespersonId)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium">${sale.amount.toFixed(2)}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-1.5 py-0 h-5 ${getStatusColor(sale.status)}`}
                        >
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(sale.paymentMethod)}
                            <span>{sale.paymentMethod}</span>
                          </div>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewLocation?.(sale);
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaleExpand(sale.id);
                        }}
                      >
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${expandedSale === sale.id ? 'rotate-180' : ''}`} 
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded details */}
                  {expandedSale === sale.id && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="p-3 space-y-3">
                          <div className="text-sm font-medium">Products Sold:</div>
                          <div className="space-y-2">
                            {sale.products.map((product) => (
                              <div key={product.id} className="grid grid-cols-4 items-center text-sm border-b pb-1">
                                <div className="col-span-2">{product.name}</div>
                                <div className="text-center">{product.quantity}x</div>
                                <div className="text-right">${(product.unitPrice * product.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-sm mt-2">
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              {sale.location.address}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(sale.timestamp), "MMM d, yyyy h:mm a")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesList;
