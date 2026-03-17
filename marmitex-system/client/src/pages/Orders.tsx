import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { AlertCircle, Search, Printer, CreditCard, History } from "lucide-react";
import apiService from "@/services/api";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Payment {
  id: string;
  status: "PENDING" | "REQUIRES_ACTION" | "SUCCEEDED" | "FAILED" | "CANCELED" | "REFUNDED";
  amount: number;
  currency: string;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  paymentStatus?: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-blue-100 text-blue-800",
  READY: "bg-green-100 text-green-800",
  DELIVERED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  READY: "Pronto",
  DELIVERED: "Concluído",
  CANCELLED: "Cancelado",
};

const paymentLabels: Record<string, string> = {
  UNPAID: "Não pago",
  PENDING: "Pendente",
  PAID: "Pago",
  FAILED: "Falhou",
  REFUNDED: "Reembolsado",
};

const paymentColors: Record<string, string> = {
  UNPAID: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  REQUIRES_ACTION: "Ação necessária",
  SUCCEEDED: "Pago",
  FAILED: "Falhou",
  CANCELED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default function Orders() {
  const { isAuthenticated } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState<Record<string, boolean>>({});
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
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
      const data = await apiService.getOrders({ skip: 0, take: 200 });
      const mapped: Order[] = data.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber ?? order.id,
        customerName: order.customer?.name ?? "-",
        status: order.status,
        paymentStatus: order.paymentStatus ?? "UNPAID",
        items: order.items.map((item: any) => ({
          id: item.id,
          productName: item.product?.name ?? "-",
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        total: order.total,
        createdAt: order.createdAt,
      }));
      setOrders(mapped);
    } catch (err) {
      setError("Erro ao carregar pedidos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
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
              <h1>Pedido ${order.orderNumber}</h1>
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

  const handleCreatePayment = async (order: Order) => {
    try {
      setPaymentLoading((prev) => ({ ...prev, [order.id]: true }));
      const session = await apiService.createCheckoutSession(order.id);
      if (session?.url) {
        window.open(session.url, "_blank");
        toast.success("Link de pagamento gerado!");
        return;
      }
      toast.error("Stripe não retornou URL de pagamento");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao gerar pagamento");
      console.error(err);
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  const handleOpenPayments = async (order: Order) => {
    try {
      setPaymentsOpen(true);
      setSelectedOrder(order);
      setPaymentsError(null);
      setPaymentsLoading(true);
      const data = await apiService.getPaymentsByOrder(order.id);
      setPayments(
        data.map((payment: any) => ({
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          createdAt: payment.createdAt,
        }))
      );
    } catch (err) {
      setPaymentsError("Erro ao carregar histórico de pagamentos");
      console.error(err);
    } finally {
      setPaymentsLoading(false);
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Pedidos</h1>
          <p className="text-muted-foreground mt-2">Acompanhe e gerencie todos os pedidos</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500 bg-red-50" role="alert">
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
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="relative flex-1">
                <label htmlFor="order-search" className="sr-only">
                  Pesquisar pedidos
                </label>
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="order-search"
                  placeholder="Pesquise por cliente ou ID do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-md w-full md:w-auto"
              >
                <option value="all">Todos os Status</option>
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="PREPARING">Preparando</option>
                <option value="READY">Pronto</option>
                <option value="DELIVERED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
              <Button variant="outline" onClick={fetchOrders} className="w-full md:w-auto">
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
              <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>ID do Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-2 py-1 rounded text-sm font-medium ${statusColors[order.status]}`}
                          >
                            <option value="PENDING">Pendente</option>
                            <option value="CONFIRMED">Confirmado</option>
                            <option value="PREPARING">Preparando</option>
                            <option value="READY">Pronto</option>
                            <option value="DELIVERED">Concluído</option>
                            <option value="CANCELLED">Cancelado</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <Badge className={paymentColors[order.paymentStatus ?? "UNPAID"]}>
                            {paymentLabels[order.paymentStatus ?? "UNPAID"]}
                          </Badge>
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
                              onClick={() => handleOpenPayments(order)}
                              title="Ver histórico de pagamentos"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCreatePayment(order)}
                              disabled={paymentLoading[order.id] || order.paymentStatus === "PAID"}
                              title="Gerar link de pagamento"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
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
      <Dialog open={paymentsOpen} onOpenChange={setPaymentsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Histórico de Pagamentos</DialogTitle>
            <DialogDescription>
              {selectedOrder ? `Pedido ${selectedOrder.orderNumber}` : "Pagamentos"}
            </DialogDescription>
          </DialogHeader>
          {paymentsLoading ? (
            <div className="py-6 text-sm text-muted-foreground">Carregando pagamentos...</div>
          ) : paymentsError ? (
            <div className="py-6 text-sm text-red-600">{paymentsError}</div>
          ) : payments.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">Nenhum pagamento registrado.</div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{paymentStatusLabels[payment.status]}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      R$ {(payment.amount / 100).toFixed(2)}
                    </p>
                    <p className="text-xs uppercase text-muted-foreground">{payment.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
