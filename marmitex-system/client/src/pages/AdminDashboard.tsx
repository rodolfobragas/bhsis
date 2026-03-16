import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { AlertCircle, TrendingUp, Users, ShoppingCart, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockItems: 0,
  });

  // Mock data for charts
  const orderData = [
    { name: "Mon", orders: 24, revenue: 2400 },
    { name: "Tue", orders: 13, revenue: 2210 },
    { name: "Wed", orders: 20, revenue: 2290 },
    { name: "Thu", orders: 39, revenue: 2000 },
    { name: "Fri", orders: 48, revenue: 2181 },
    { name: "Sat", orders: 52, revenue: 2500 },
    { name: "Sun", orders: 35, revenue: 2100 },
  ];

  const revenueData = [
    { name: "Week 1", revenue: 4000 },
    { name: "Week 2", revenue: 3000 },
    { name: "Week 3", revenue: 2000 },
    { name: "Week 4", revenue: 2780 },
    { name: "Week 5", revenue: 1890 },
  ];

  useEffect(() => {
    // TODO: Fetch real data from API
    setStats({
      totalOrders: 156,
      totalRevenue: 4250.5,
      totalCustomers: 42,
      totalProducts: 28,
      lowStockItems: 3,
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar o painel administrativo</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-2">Bem-vindo, {user?.name}</p>
        </div>

        {/* Stock Alert */}
        {stats.lowStockItems > 0 && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Você tem {stats.lowStockItems} produtos com estoque baixo. Verifique o gerenciamento de inventário.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Clientes ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">No catálogo</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos e Receita (Semanal)</CardTitle>
              <CardDescription>Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" name="Pedidos" />
                  <Bar dataKey="revenue" fill="#10b981" name="Receita (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receita (Mensal)</CardTitle>
              <CardDescription>Últimas 5 semanas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Pedidos</CardTitle>
                <CardDescription>Acompanhe e gerencie todos os pedidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Acesse a página completa de gerenciamento de pedidos</p>
                  <a href="/orders">
                    <Button className="mt-4">Ir para Gerenciamento de Pedidos</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Produtos</CardTitle>
                <CardDescription>Adicione, edite ou remova produtos do cardápio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Acesse a página completa de gerenciamento de produtos</p>
                  <a href="/products">
                    <Button className="mt-4">Ir para Gerenciamento de Produtos</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Clientes</CardTitle>
                <CardDescription>Adicione, edite ou remova clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Acesse a página completa de gerenciamento de clientes</p>
                  <a href="/customers">
                    <Button className="mt-4">Ir para Gerenciamento de Clientes</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Inventário</CardTitle>
                <CardDescription>Acompanhe o estoque de produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Acesse a página completa de gerenciamento de inventário</p>
                  <a href="/inventory">
                    <Button className="mt-4">Ir para Gerenciamento de Inventário</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
