
import React, { useState } from 'react';
import { sales } from '@/data/sampleData';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import SalesList from '@/components/SalesList';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Sales = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
  // Generate time-based sales data
  const salesByHour = [...new Array(24)].map((_, hour) => {
    const filtered = sales.filter(sale => {
      const saleHour = new Date(sale.timestamp).getHours();
      return saleHour === hour;
    });
    
    return {
      hour: hour,
      hourLabel: `${hour}:00`,
      sales: filtered.length,
      amount: filtered.reduce((sum, sale) => sum + sale.amount, 0),
    };
  });
  
  // Generate payment method data
  const paymentMethods = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const paymentMethodData = Object.entries(paymentMethods).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Generate product data
  const productData = sales.flatMap(sale => sale.products)
    .reduce((acc, product) => {
      const existingProduct = acc.find(p => p.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
        existingProduct.revenue += product.quantity * product.unitPrice;
      } else {
        acc.push({
          name: product.name,
          quantity: product.quantity,
          revenue: product.quantity * product.unitPrice,
        });
      }
      return acc;
    }, [] as { name: string; quantity: number; revenue: number }[])
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
    
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-muted-foreground">
            Track and analyze your sales performance
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="list">Sales List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6">
            <SalesList 
              sales={sales}
              onViewLocation={(sale) => {
                console.log("View location for sale:", sale);
              }}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesByHour}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 30,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hourLabel" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}`, 'Sales']}
                          labelFormatter={(label) => `Hour: ${label}`}
                        />
                        <Bar dataKey="sales" fill="#9b87f5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 150,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#7E69AB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sales;
