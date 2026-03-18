import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiService from "@/services/api";
import { wsClient } from "@/services/websocketClient";

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

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchOrders = async () => {
      const data = await apiService.getOrders({ skip: 0, take: 200 });
      const mapped: OrderItem[] = data.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber ?? order.id,
        items: order.items.map((item: any) => ({
          productName: item.product?.name ?? "-",
          quantity: item.quantity,
          notes: item.notes,
        })),
        status: order.status,
        createdAt: order.createdAt,
      }));
      setOrders(mapped);
    };

    fetchOrders();

    wsClient
      .connect()
      .then(() => {
        wsClient.joinKitchenRoom(user.id);
      })
      .catch(() => null);

    const unsubscribe = wsClient.onOrderCreated((order) => {
      setOrders((prev) => {
        const existing = prev.find((item) => item.id === order.id);
        const mapped: OrderItem = {
          id: order.id,
          orderNumber: order.orderNumber ?? order.id,
          items: order.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
          })),
          status: order.status,
          createdAt: order.createdAt,
        };
        if (existing) {
          return prev.map((item) => (item.id === order.id ? { ...item, ...mapped } : item));
        }
        return [mapped, ...prev];
      });
    });

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      unsubscribe();
      wsClient.disconnect();
      clearInterval(interval);
    };
  }, [isAuthenticated, user]);

  const ordersWithTime = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      timeInPrep: Math.max(0, Math.round((time.getTime() - new Date(order.createdAt).getTime()) / 60000)),
    }));
  }, [orders, time]);

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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await apiService.updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      )
    );
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

  const pendingOrders = ordersWithTime.filter((o) => o.status === "PENDING");
  const preparingOrders = ordersWithTime.filter((o) => o.status === "PREPARING");
  const readyOrders = ordersWithTime.filter((o) => o.status === "READY");

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
            <i className="fa-solid fa-circle-exclamation text-sm text-red-600" aria-hidden="true" />
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
              <i className="fa-solid fa-circle-exclamation text-sm text-red-600" aria-hidden="true" />
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
                            <i className="fa-solid fa-clock text-[10px] inline mr-1" aria-hidden="true" />
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
              <i className="fa-solid fa-clock text-sm text-blue-600" aria-hidden="true" />
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
                            <i className="fa-solid fa-clock text-[10px] inline mr-1" aria-hidden="true" />
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
              <i className="fa-solid fa-circle-check text-sm text-green-600" aria-hidden="true" />
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
                            <i className="fa-solid fa-circle-check text-[10px] inline mr-1" aria-hidden="true" />
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
