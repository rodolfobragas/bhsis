import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { AlertCircle, Search, Eye, Printer } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  status: "pending" | "preparing" | "ready" | "completed";
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  ready: "Pronto",
  completed: "Concluído",
};

export default function Orders() {
  const { isAuthenticated } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock data - replace with API call
      const mockOrders: Order[] = [
        {
          id: "ORD-001",
          customerName: "João Silva",
          status: "pending",
          items: [
            { id: "1", productName: "Marmita de Frango", quantity: 2, price: 25.0 },
            { id: "2", productName: "Refrigerante 2L", quantity: 1, price: 8.0 },
          ],
          total: 58.0,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ORD-002",
          customerName: "Maria Santos",
          status: "preparing",
          items: [
            { id: "3", productName: "Marmita de Peixe", quantity: 1, price: 32.0 },
            { id: "4", productName: "Suco Natural", quantity: 2, price: 6.0 },
          ],
          total: 44.0,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "ORD-003",
          customerName: "Pedro Oliveira",
          status: "ready",
          items: [
            { id: "5", productName: "Marmita Vegetariana", quantity: 1, price: 22.0 },
            { id: "6", productName: "Brigadeiro", quantity: 3, price: 3.0 },
          ],
          total: 31.0,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError("Erro ao carregar pedidos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
      toast.success("Status do pedido atualizado!");
    } catch (err) {
      toast.error("Erro ao atualizar status");
      console.error(err);
    }
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Pedido ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .order-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Pedido ${order.id}</h1>
              <p>Cliente: ${order.customerName}</p>
            </div>
            <div class="order-info">
              <p>Status: ${statusLabels[order.status]}</p>
              <p>Data: ${new Date(order.createdAt).toLocaleString("pt-BR")}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) =>
                      `<tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>R$ ${item.price.toFixed(2)}</td>
                  <td>R$ ${(item.quantity * item.price).toFixed(2)}</td>
                </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right;">
              <p class="total">Total: R$ ${order.total.toFixed(2)}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar esta página</CardDescription>
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
          <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Pedidos</h1>
          <p className="text-muted-foreground mt-2">Acompanhe e gerencie todos os pedidos</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquise por cliente ou ID do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="preparing">Preparando</option>
                <option value="ready">Pronto</option>
                <option value="completed">Concluído</option>
              </select>
              <Button variant="outline" onClick={fetchOrders}>
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>ID do Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-2 py-1 rounded text-sm font-medium ${statusColors[order.status]}`}
                          >
                            <option value="pending">Pendente</option>
                            <option value="preparing">Preparando</option>
                            <option value="ready">Pronto</option>
                            <option value="completed">Concluído</option>
                          </select>
                        </TableCell>
                        <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrint(order)}
                              title="Imprimir pedido"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
