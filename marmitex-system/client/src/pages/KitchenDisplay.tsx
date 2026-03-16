import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrderItem {
  id: string;
  orderNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
    notes?: string;
  }>;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED";
  createdAt: string;
  timeInPrep?: number;
}

export default function KitchenDisplay() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // Mock data
  useEffect(() => {
    const mockOrders: OrderItem[] = [
      {
        id: "1",
        orderNumber: "ORD-001",
        items: [
          { productName: "Marmita de Frango", quantity: 2, notes: "Sem cebola" },
          { productName: "Arroz Integral", quantity: 1 },
        ],
        status: "PENDING",
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
        timeInPrep: 5,
      },
      {
        id: "2",
        orderNumber: "ORD-002",
        items: [
          { productName: "Marmita de Peixe", quantity: 1 },
          { productName: "Feijão", quantity: 1 },
        ],
        status: "PREPARING",
        createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
        timeInPrep: 12,
      },
      {
        id: "3",
        orderNumber: "ORD-003",
        items: [{ productName: "Marmita Vegetariana", quantity: 3 }],
        status: "READY",
        createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
        timeInPrep: 20,
      },
    ];

    setOrders(mockOrders);

    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100 text-red-800 border-red-300";
      case "CONFIRMED":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "PREPARING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "READY":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmado",
      PREPARING: "Preparando",
      READY: "Pronto",
      DELIVERED: "Entregue",
    };
    return labels[status] || status;
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      )
    );
    // TODO: Send update to API via WebSocket
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar o KDS</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const readyOrders = orders.filter((o) => o.status === "READY");

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Kitchen Display System</h1>
            <p className="text-muted-foreground mt-2">Gerenciamento de pedidos em tempo real</p>
          </div>
          <div className="text-3xl font-mono font-bold text-foreground">
            {time.toLocaleTimeString("pt-BR")}
          </div>
        </div>

        {/* Alerts */}
        {pendingOrders.length > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {pendingOrders.length} pedido(s) aguardando confirmação!
            </AlertDescription>
          </Alert>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h2 className="text-2xl font-bold text-foreground">Pendentes</h2>
              <Badge variant="destructive" className="ml-auto">
                {pendingOrders.length}
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Nenhum pedido pendente</p>
                  </CardContent>
                </Card>
              ) : (
                pendingOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-red-300"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                          <CardDescription>
                            <Clock className="h-3 w-3 inline mr-1" />
                            {order.timeInPrep} min atrás
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">
                            {item.quantity}x {item.productName}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleStatusUpdate(order.id, "PREPARING")}
                      >
                        Iniciar Preparação
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-foreground">Preparando</h2>
              <Badge variant="secondary" className="ml-auto">
                {preparingOrders.length}
              </Badge>
            </div>

            <div className="space-y-4">
              {preparingOrders.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Nenhum pedido em preparação</p>
                  </CardContent>
                </Card>
              ) : (
                preparingOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-blue-300"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                          <CardDescription>
                            <Clock className="h-3 w-3 inline mr-1" />
                            {order.timeInPrep} min
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">
                            {item.quantity}x {item.productName}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleStatusUpdate(order.id, "READY")}
                      >
                        Marcar como Pronto
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-bold text-foreground">Pronto</h2>
              <Badge variant="outline" className="ml-auto bg-green-100 text-green-800">
                {readyOrders.length}
              </Badge>
            </div>

            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Nenhum pedido pronto</p>
                  </CardContent>
                </Card>
              ) : (
                readyOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-green-300 bg-green-50"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                          <CardDescription>
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Pronto para entrega
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">
                            {item.quantity}x {item.productName}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3"
                        onClick={() => handleStatusUpdate(order.id, "DELIVERED")}
                      >
                        Entregue
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
