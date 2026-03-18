import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import apiService from "@/services/api";

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  status: "critical" | "warning" | "normal";
  createdAt: string;
  dismissedAt?: string;
}

export default function StockAlerts() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getStockAlerts();
      const mapped: StockAlert[] = response.map((alert: any) => ({
        id: alert.id,
        productId: alert.productId,
        productName: alert.product?.name ?? "-",
        currentStock: alert.quantity,
        minimumStock: alert.inventory?.minQuantity ?? 0,
        status: alert.alertType === "OUT_OF_STOCK" ? "critical" : "warning",
        createdAt: alert.createdAt,
        dismissedAt: alert.resolvedAt ?? undefined,
      }));
      setAlerts(mapped);
    } catch (error) {
      toast.error("Erro ao carregar alertas de estoque");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alerta descartado");
  };

  const handleResolve = async (id: string) => {
    try {
      await apiService.resolveAlert(id);
      await loadAlerts();
      toast.success("Alerta resolvido");
    } catch (error) {
      toast.error("Falha ao resolver alerta");
    }
  };

  const activeAlerts = alerts.filter(a => !a.dismissedAt);
  const criticalCount = activeAlerts.filter(a => a.status === "critical").length;
  const warningCount = activeAlerts.filter(a => a.status === "warning").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>;
      case "warning":
        return <Badge variant="secondary">Aviso</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alertas de Estoque</h1>
        <p className="text-gray-600">Monitore produtos com estoque baixo</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-raise">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-gray-500">Produtos com estoque crítico</p>
          </CardContent>
        </Card>

        <Card className="card-raise">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-gray-500">Produtos com estoque baixo</p>
          </CardContent>
        </Card>

        <Card className="card-raise">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-gray-500">Alertas ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Ativos</CardTitle>
          <CardDescription>Lista de produtos com estoque abaixo do mínimo</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Carregando alertas...</div>
          ) : activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-circle-check text-3xl mx-auto text-green-600 mb-2" aria-hidden="true" />
              <p className="text-gray-600">Nenhum alerta ativo. Estoque normalizado!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead>Estoque Mínimo</TableHead>
                    <TableHead>Diferença</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAlerts.map((alert) => {
                    const difference = alert.minimumStock - alert.currentStock;
                    return (
                      <TableRow key={alert.id} className={alert.status === "critical" ? "bg-red-50" : "bg-yellow-50"}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <i className={`fa-solid fa-circle-exclamation text-sm ${getStatusColor(alert.status)}`} aria-hidden="true" />
                            {alert.productName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getStatusColor(alert.status)}`}>
                            {alert.currentStock} un.
                          </span>
                        </TableCell>
                        <TableCell>{alert.minimumStock} un.</TableCell>
                        <TableCell>
                          <span className="text-red-600 font-semibold">-{difference} un.</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolve(alert.id)}
                              title="Marcar como resolvido"
                            >
                              <i className="fa-solid fa-circle-check text-sm" aria-hidden="true" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDismiss(alert.id)}
                              title="Descartar alerta"
                            >
                              <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historical Alerts */}
      {alerts.filter(a => a.dismissedAt).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Resolvidos</CardTitle>
            <CardDescription>Histórico de alertas que foram resolvidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Estoque Anterior</TableHead>
                    <TableHead>Data de Resolução</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(a => a.dismissedAt).map((alert) => (
                    <TableRow key={alert.id} className="opacity-60">
                      <TableCell className="font-medium">{alert.productName}</TableCell>
                      <TableCell>{alert.currentStock} un.</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {alert.dismissedAt && new Date(alert.dismissedAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
