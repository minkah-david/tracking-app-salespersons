
import { useState } from 'react';
import { useMapData } from '@/hooks/useMapData';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import SalesList from '@/components/SalesList';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  DollarSign, 
  Download, 
  ListFilter, 
  Users,
  ShoppingBag,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { Salesperson, salespeople, sales } from '@/data/sampleData';

// Charts data
const generateDailyRevenue = () => {
  const result = [];
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const amount = Math.floor(Math.random() * 8000) + 2000;
    
    result.push({
      date: format(date, 'MMM dd'),
      amount
    });
  }
  return result;
};

const dailyRevenue = generateDailyRevenue();

const productPerformance = [
  { name: 'Premium Package', value: 55 },
  { name: 'Basic Package', value: 25 },
  { name: 'Analytics Add-on', value: 12 },
  { name: 'Additional Support', value: 8 },
];

const salesByRepresentative = salespeople.map((sp) => ({
  name: sp.name,
  sales: Math.floor(Math.random() * 30) + 10,
  revenue: (sp.salesForToday / 1000).toFixed(1)
}));

const paymentMethodsData = [
  { name: 'Credit Card', value: 45 },
  { name: 'Cash', value: 20 },
  { name: 'Debit Card', value: 25 },
  { name: 'Online', value: 10 },
];

const COLORS = ['#0EA5E9', '#8B5CF6', '#F97316', '#10B981'];

// Sales Statistics
const getStatistics = () => {
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalTransactions = sales.length;
  const avgSaleValue = totalSales / totalTransactions;
  const productsPerTransaction = sales.reduce((sum, sale) => 
    sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0), 0) / totalTransactions;

  return {
    totalSales,
    totalTransactions,
    avgSaleValue,
    productsPerTransaction
  };
};

const Sales = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('lastMonth');
  const [selectedView, setSelectedView] = useState('overview');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { salesData } = useMapData();
  const stats = getStatistics();

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your sales data is being prepared for export."
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header with filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Analytics</h1>
              <p className="text-muted-foreground">Track and analyze your sales performance</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleExport} variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard 
              icon={<DollarSign className="h-4 w-4 text-sales-blue" />}
              title="Total Revenue"
              value={`$${stats.totalSales.toLocaleString()}`}
              description="Last 30 days"
              trend="+12.5%"
              trendUp={true}
            />
            <SummaryCard 
              icon={<ShoppingBag className="h-4 w-4 text-sales-purple" />}
              title="Transactions"
              value={stats.totalTransactions.toString()}
              description="Last 30 days"
              trend="+8.2%"
              trendUp={true}
            />
            <SummaryCard 
              icon={<CreditCard className="h-4 w-4 text-sales-orange" />}
              title="Avg. Sale Value"
              value={`$${stats.avgSaleValue.toFixed(2)}`}
              description="Per transaction"
              trend="+2.1%"
              trendUp={true}
            />
            <SummaryCard 
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              title="Products/Sale"
              value={stats.productsPerTransaction.toFixed(1)}
              description="Items per transaction"
              trend="+5.4%"
              trendUp={true}
            />
          </div>
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" value={selectedView} onValueChange={setSelectedView} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="representatives">Representatives</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Daily revenue for the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dailyRevenue}>
                        <XAxis 
                          dataKey="date" 
                          tickLine={false} 
                          axisLine={false} 
                          fontSize={12}
                          tickFormatter={(value) => value.split(' ')[0]}
                        />
                        <YAxis 
                          tickLine={false} 
                          axisLine={false} 
                          fontSize={12}
                          tickFormatter={(value) => `$${value/1000}k`}
                        />
                        <Tooltip
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Bar dataKey="amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Product Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Products by sales percentage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={productPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {productPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Sales by Representative */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Representative</CardTitle>
                    <CardDescription>Number of sales by team member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={salesByRepresentative}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" tickLine={false} axisLine={false} />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip formatter={(value) => [`${value} sales`, 'Count']} />
                        <Bar dataKey="sales" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Distribution of payment types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={paymentMethodsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {paymentMethodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <SalesList 
                sales={salesData} 
                onViewLocation={(sale) => {
                  toast({
                    title: "Location Selected",
                    description: `Viewing location for sale at ${sale.location.address}`
                  });
                }} 
              />
            </TabsContent>
            
            {/* Representatives Tab */}
            <TabsContent value="representatives">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sales Representatives</CardTitle>
                    <CardDescription>Performance and metrics by team member</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ListFilter className="h-4 w-4" /> Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 border-b p-4 font-medium text-sm">
                      <div className="col-span-2">Representative</div>
                      <div>Status</div>
                      <div>Transactions</div>
                      <div>Revenue</div>
                      <div className="text-right">Completion</div>
                    </div>
                    
                    <div className="divide-y">
                      {salespeople.map((rep) => (
                        <div key={rep.id} className="grid grid-cols-6 p-4 text-sm items-center">
                          <div className="col-span-2 flex items-center gap-2">
                            <img src={rep.avatar} alt={rep.name} className="h-8 w-8 rounded-full" />
                            <div>
                              <div className="font-medium">{rep.name}</div>
                              <div className="text-muted-foreground text-xs">{rep.assignedArea}</div>
                            </div>
                          </div>
                          <div>
                            <StatusBadge status={rep.status} />
                          </div>
                          <div>
                            {salesByRepresentative.find(s => s.name === rep.name)?.sales || 0}
                          </div>
                          <div>
                            ${rep.salesForToday.toLocaleString()}
                          </div>
                          <div className="text-right">
                            {Math.round((rep.salesForToday / rep.targetForToday) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper components
const SummaryCard = ({ icon, title, value, description, trend, trendUp }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-md bg-primary/10 p-2">
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-200';
      case 'idle':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-200';
      case 'offline':
        return 'bg-gray-500/10 text-gray-500 border-gray-200';
      default:
        return '';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default Sales;
