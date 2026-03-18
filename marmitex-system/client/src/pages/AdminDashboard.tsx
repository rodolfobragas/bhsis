import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type DashboardSummary = {
  totals: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockItems: number;
    avgPrepTimeSeconds: number;
    ticketAverage: number;
    conversionRate: number;
  };
  ordersByDay: Array<{ label: string; orders: number; revenue: number }>;
  ordersByHour: Array<{ hour: number; orders: number }>;
  ordersByWeek: Array<{ weekStart: string; orders: number; revenue: number }>;
  ordersByMonth: Array<{ monthStart: string; orders: number; revenue: number }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  analytics: {
    inProgressOrders: number;
    kitchenLoadRate: number;
    outOfStockItems: number;
    topCustomers: Array<{ id: string; name: string; orders: number; revenue: number }>;
    peakHours: number[];
  };
  reports: {
    stock: {
      lowStockProducts: Array<{ id: string; name: string; quantity: number; minQuantity: number }>;
      outOfStockProducts: Array<{ id: string; name: string; quantity: number; minQuantity: number }>;
    };
    customers: Array<{ id: string; name: string; orders: number; revenue: number }>;
    kitchen: {
      avgPrepTimeSeconds: number;
      inProgressOrders: number;
      kitchenLoadRate: number;
    };
  };
  categories: string[];
};

const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;
const REPORT_SCHEDULE_KEY = "dashboard-report-schedule";

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const buildCsvReport = (summary: DashboardSummary) => {
  const lines: string[] = [];

  lines.push("Resumo");
  lines.push(`Total de Pedidos,${summary.totals.totalOrders}`);
  lines.push(`Receita Total,${summary.totals.totalRevenue.toFixed(2)}`);
  lines.push(`Ticket Medio,${summary.totals.ticketAverage.toFixed(2)}`);
  lines.push(`Taxa de Conversao,${(summary.totals.conversionRate * 100).toFixed(1)}%`);
  lines.push(`Clientes,${summary.totals.totalCustomers}`);
  lines.push(`Produtos,${summary.totals.totalProducts}`);
  lines.push(`Produtos com estoque baixo,${summary.totals.lowStockItems}`);
  lines.push(`Tempo medio de preparo (min),${Math.round(summary.totals.avgPrepTimeSeconds / 60)}`);
  lines.push(`Pedidos em processamento,${summary.analytics.inProgressOrders}`);
  lines.push(`Produtos sem estoque,${summary.analytics.outOfStockItems}`);
  lines.push(`Taxa de ocupacao cozinha,${(summary.analytics.kitchenLoadRate * 100).toFixed(1)}%`);
  lines.push("");

  lines.push("Pedidos por Dia");
  lines.push("Dia,Pedidos,Receita");
  summary.ordersByDay.forEach((row) => {
    lines.push(`${row.label},${row.orders},${row.revenue.toFixed(2)}`);
  });
  lines.push("");

  lines.push("Pedidos por Hora");
  lines.push("Hora,Pedidos");
  summary.ordersByHour.forEach((row) => {
    lines.push(`${row.hour}h,${row.orders}`);
  });
  lines.push("");

  lines.push("Pedidos por Semana");
  lines.push("Semana,Pedidos,Receita");
  summary.ordersByWeek.forEach((row) => {
    lines.push(`${row.weekStart},${row.orders},${row.revenue.toFixed(2)}`);
  });
  lines.push("");

  lines.push("Pedidos por Mes");
  lines.push("Mes,Pedidos,Receita");
  summary.ordersByMonth.forEach((row) => {
    lines.push(`${row.monthStart},${row.orders},${row.revenue.toFixed(2)}`);
  });
  lines.push("");

  lines.push("Top Produtos");
  lines.push("Produto,Quantidade,Receita");
  summary.topProducts.forEach((row) => {
    lines.push(`"${row.name.replace(/"/g, '""')}",${row.quantity},${row.revenue.toFixed(2)}`);
  });
  lines.push("");

  lines.push("Top Clientes");
  lines.push("Cliente,Pedidos,Receita");
  summary.analytics.topCustomers.forEach((row) => {
    lines.push(`"${row.name.replace(/"/g, '""')}",${row.orders},${row.revenue.toFixed(2)}`);
  });
  lines.push("");

  lines.push("Relatorio de Estoque");
  lines.push("Produto,Quantidade,Minimo,Status");
  summary.reports.stock.lowStockProducts.forEach((row) => {
    const status = row.quantity <= 0 ? "Sem estoque" : "Estoque baixo";
    lines.push(`"${row.name.replace(/"/g, '""')}",${row.quantity},${row.minQuantity},${status}`);
  });
  lines.push("");

  lines.push("Performance da Cozinha");
  lines.push(`Pedidos em processamento,${summary.reports.kitchen.inProgressOrders}`);
  lines.push(`Tempo medio preparo (min),${Math.round(summary.reports.kitchen.avgPrepTimeSeconds / 60)}`);
  lines.push(`Ocupacao cozinha,${(summary.reports.kitchen.kitchenLoadRate * 100).toFixed(1)}%`);

  return lines.join("\n");
};

const buildPrintableReport = (summary: DashboardSummary) => `
  <html>
    <head>
      <title>Relatorio do Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
        h1 { font-size: 20px; margin-bottom: 8px; }
        h2 { font-size: 16px; margin: 24px 0 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #f3f4f6; }
        .totals { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; background: #fafafa; }
        .label { font-size: 11px; color: #6b7280; }
        .value { font-size: 16px; font-weight: 600; }
      </style>
    </head>
    <body>
      <h1>Relatorio do Dashboard</h1>
        <div class="totals">
          <div class="card"><div class="label">Total de pedidos</div><div class="value">${summary.totals.totalOrders}</div></div>
          <div class="card"><div class="label">Receita total</div><div class="value">${formatCurrency(
            summary.totals.totalRevenue,
          )}</div></div>
          <div class="card"><div class="label">Ticket medio</div><div class="value">${formatCurrency(
            summary.totals.ticketAverage,
          )}</div></div>
          <div class="card"><div class="label">Conversao</div><div class="value">${(
            summary.totals.conversionRate * 100
          ).toFixed(1)}%</div></div>
          <div class="card"><div class="label">Clientes</div><div class="value">${summary.totals.totalCustomers}</div></div>
          <div class="card"><div class="label">Produtos</div><div class="value">${summary.totals.totalProducts}</div></div>
          <div class="card"><div class="label">Estoque baixo</div><div class="value">${summary.totals.lowStockItems}</div></div>
          <div class="card"><div class="label">Tempo medio (min)</div><div class="value">${Math.round(
            summary.totals.avgPrepTimeSeconds / 60,
        )}</div></div>
      </div>

      <h2>Pedidos por dia</h2>
      <table>
        <thead><tr><th>Dia</th><th>Pedidos</th><th>Receita</th></tr></thead>
        <tbody>
          ${summary.ordersByDay
            .map(
              (row) => `<tr><td>${row.label}</td><td>${row.orders}</td><td>${formatCurrency(row.revenue)}</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>

      <h2>Pedidos por hora</h2>
      <table>
        <thead><tr><th>Hora</th><th>Pedidos</th></tr></thead>
        <tbody>
          ${summary.ordersByHour
            .map((row) => `<tr><td>${row.hour}h</td><td>${row.orders}</td></tr>`)
            .join("")}
        </tbody>
      </table>

      <h2>Top produtos</h2>
      <table>
        <thead><tr><th>Produto</th><th>Quantidade</th><th>Receita</th></tr></thead>
        <tbody>
          ${summary.topProducts
            .map(
              (row) =>
                `<tr><td>${row.name}</td><td>${row.quantity}</td><td>${formatCurrency(row.revenue)}</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>

      <h2>Relatorio de estoque</h2>
      <table>
        <thead><tr><th>Produto</th><th>Quantidade</th><th>Minimo</th><th>Status</th></tr></thead>
        <tbody>
          ${summary.reports.stock.lowStockProducts
            .map((row) => {
              const status = row.quantity <= 0 ? "Sem estoque" : "Estoque baixo";
              return `<tr><td>${row.name}</td><td>${row.quantity}</td><td>${row.minQuantity}</td><td>${status}</td></tr>`;
            })
            .join("")}
        </tbody>
      </table>

      <h2>Clientes mais frequentes</h2>
      <table>
        <thead><tr><th>Cliente</th><th>Pedidos</th><th>Receita</th></tr></thead>
        <tbody>
          ${summary.analytics.topCustomers
            .map(
              (row) =>
                `<tr><td>${row.name}</td><td>${row.orders}</td><td>${formatCurrency(row.revenue)}</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>

      <h2>Performance da cozinha</h2>
      <table>
        <thead><tr><th>Indicador</th><th>Valor</th></tr></thead>
        <tbody>
          <tr><td>Pedidos em processamento</td><td>${summary.reports.kitchen.inProgressOrders}</td></tr>
          <tr><td>Tempo medio preparo</td><td>${Math.round(
            summary.reports.kitchen.avgPrepTimeSeconds / 60,
          )} min</td></tr>
          <tr><td>Ocupacao da cozinha</td><td>${(summary.reports.kitchen.kitchenLoadRate * 100).toFixed(1)}%</td></tr>
        </tbody>
      </table>
    </body>
  </html>
`;

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all",
  });
  const [reportSchedule, setReportSchedule] = useState<{
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly";
    lastRun: string | null;
  }>({
    enabled: false,
    frequency: "daily",
    lastRun: null,
  });
  const [summary, setSummary] = useState<DashboardSummary>({
    totals: {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalProducts: 0,
      lowStockItems: 0,
      avgPrepTimeSeconds: 0,
      ticketAverage: 0,
      conversionRate: 0,
    },
    ordersByDay: [],
    ordersByHour: [],
    ordersByWeek: [],
    ordersByMonth: [],
    topProducts: [],
    analytics: {
      inProgressOrders: 0,
      kitchenLoadRate: 0,
      outOfStockItems: 0,
      topCustomers: [],
      peakHours: [],
    },
    reports: {
      stock: {
        lowStockProducts: [],
        outOfStockProducts: [],
      },
      customers: [],
      kitchen: {
        avgPrepTimeSeconds: 0,
        inProgressOrders: 0,
        kitchenLoadRate: 0,
      },
    },
    categories: [],
  });

  const fetchSummary = useCallback((nextFilters = filters) => {
    const params = new URLSearchParams();
    if (nextFilters.startDate) {
      params.set("startDate", nextFilters.startDate);
    }
    if (nextFilters.endDate) {
      params.set("endDate", nextFilters.endDate);
    }
    if (nextFilters.category && nextFilters.category !== "all") {
      params.set("category", nextFilters.category);
    }

    const query = params.toString();
    fetch(`/api/dashboard/summary${query ? `?${query}` : ""}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data: DashboardSummary) => setSummary(data))
      .catch(() => {
        setSummary((prev) => prev);
      });
  }, [filters]);

  useEffect(() => {
    const stored = localStorage.getItem(REPORT_SCHEDULE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReportSchedule((prev) => ({ ...prev, ...parsed }));
      } catch {
        setReportSchedule((prev) => prev);
      }
    }
    fetchSummary();
    const intervalId = window.setInterval(() => {
      fetchSummary(filters);
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, [fetchSummary, filters]);

  useEffect(() => {
    localStorage.setItem(REPORT_SCHEDULE_KEY, JSON.stringify(reportSchedule));
  }, [reportSchedule]);

  useEffect(() => {
    if (!reportSchedule.enabled) return;

    const shouldRun = () => {
      if (!reportSchedule.lastRun) return true;
      const last = new Date(reportSchedule.lastRun);
      const now = new Date();
      if (reportSchedule.frequency === "daily") {
        return last.toDateString() !== now.toDateString();
      }
      if (reportSchedule.frequency === "weekly") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return last < weekStart;
      }
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return last < monthStart;
    };

    const intervalId = window.setInterval(() => {
      if (!shouldRun()) return;
      const csv = buildCsvReport(summary);
      downloadFile(csv, "relatorio-dashboard.csv", "text/csv;charset=utf-8;");
      setReportSchedule((prev) => ({
        ...prev,
        lastRun: new Date().toISOString(),
      }));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [reportSchedule, summary]);

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">Bem-vindo, {user?.name}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const csv = buildCsvReport(summary);
                downloadFile(csv, "relatorio-dashboard.csv", "text/csv;charset=utf-8;");
              }}
            >
              Exportar Excel (CSV)
            </Button>
            <Button
              onClick={() => {
                const reportWindow = window.open("", "_blank");
                if (!reportWindow) {
                  return;
                }
                reportWindow.document.open();
                reportWindow.document.write(buildPrintableReport(summary));
                reportWindow.document.close();
                reportWindow.focus();
                reportWindow.print();
              }}
            >
              Exportar PDF
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros do Dashboard</CardTitle>
            <CardDescription>Selecione periodo, datas e categoria para refinar a analise.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Data inicial</label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Data final</label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Categoria</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {summary.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    fetchSummary(filters);
                  }}
                >
                  Aplicar filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const reset = { startDate: "", endDate: "", category: "all" };
                    setFilters(reset);
                    fetchSummary(reset);
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agendamento de Relatórios</CardTitle>
            <CardDescription>Defina uma rotina para baixar automaticamente o CSV.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={reportSchedule.enabled}
                  onCheckedChange={(checked) =>
                    setReportSchedule((prev) => ({ ...prev, enabled: checked }))
                  }
                />
                <div>
                  <p className="text-sm font-medium">Ativar agendamento</p>
                  <p className="text-xs text-muted-foreground">
                    Última execução: {reportSchedule.lastRun ? new Date(reportSchedule.lastRun).toLocaleString() : "nunca"}
                  </p>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <Select
                  value={reportSchedule.frequency}
                  onValueChange={(value) =>
                    setReportSchedule((prev) => ({
                      ...prev,
                      frequency: value as "daily" | "weekly" | "monthly",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Frequencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Alert */}
        {summary.totals.lowStockItems > 0 && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <i className="fa-solid fa-circle-exclamation text-sm text-yellow-600" aria-hidden="true" />
            <AlertDescription className="text-yellow-800">
              Você tem {summary.totals.lowStockItems} produtos com estoque baixo. Verifique o gerenciamento de inventário.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <i className="fa-solid fa-cart-shopping text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <i className="fa-solid fa-arrow-trend-up text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totals.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Total (entregues)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <i className="fa-solid fa-users text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Clientes ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <i className="fa-solid fa-box text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.totalProducts}</div>
              <p className="text-xs text-muted-foreground">No catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo médio</CardTitle>
              <i className="fa-solid fa-clock text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(summary.totals.avgPrepTimeSeconds / 60)} min
              </div>
              <p className="text-xs text-muted-foreground">Preparação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket médio</CardTitle>
              <i className="fa-solid fa-receipt text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totals.ticketAverage)}</div>
              <p className="text-xs text-muted-foreground">Pedidos entregues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <i className="fa-solid fa-percent text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(summary.totals.conversionRate * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Pedidos entregues</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Vendas por Período</CardTitle>
                  <CardDescription>Dia, semana ou mês</CardDescription>
                </div>
                <Tabs value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="day">Dia</TabsTrigger>
                    <TabsTrigger value="week">Semana</TabsTrigger>
                    <TabsTrigger value="month">Mês</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    period === "day"
                      ? summary.ordersByDay.map((row) => ({
                          name: row.label,
                          orders: row.orders,
                          revenue: row.revenue,
                        }))
                      : period === "week"
                        ? summary.ordersByWeek.map((row) => ({
                            name: row.weekStart,
                            orders: row.orders,
                            revenue: row.revenue,
                          }))
                        : summary.ordersByMonth.map((row) => ({
                            name: row.monthStart,
                            orders: row.orders,
                            revenue: row.revenue,
                          }))
                  }
                >
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
              <CardTitle>Receita (Semanas)</CardTitle>
              <CardDescription>Últimas semanas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={summary.ordersByWeek.map((row) => ({
                    name: row.weekStart,
                    revenue: row.revenue,
                  }))}
                >
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos por Hora</CardTitle>
              <CardDescription>Hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={summary.ordersByHour.map((row) => ({
                    name: `${row.hour}h`,
                    orders: row.orders,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#f97316" name="Pedidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Produtos</CardTitle>
              <CardDescription>Top 10 por quantidade</CardDescription>
            </CardHeader>
            <CardContent>
              {summary.topProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum produto encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.topProducts.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} un · {formatCurrency(item.revenue)}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">#{index + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos em processamento</CardTitle>
              <i className="fa-solid fa-chart-line text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.analytics.inProgressOrders}</div>
              <p className="text-xs text-muted-foreground">Confirmados, preparando ou prontos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupação da cozinha</CardTitle>
              <i className="fa-solid fa-fire text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(summary.analytics.kitchenLoadRate * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Pedidos ativos / total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos em falta</CardTitle>
              <i className="fa-solid fa-circle-exclamation text-sm text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.analytics.outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">Inventário zerado</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Clientes mais frequentes</CardTitle>
              <CardDescription>Top 5 por pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              {summary.analytics.topCustomers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum cliente encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.analytics.topCustomers.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.orders} pedidos · {formatCurrency(customer.revenue)}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">#{index + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários de pico</CardTitle>
              <CardDescription>Top 3 horários do dia</CardDescription>
            </CardHeader>
            <CardContent>
              {summary.analytics.peakHours.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Sem dados no período</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {summary.analytics.peakHours.map((hour) => (
                    <div
                      key={hour}
                      className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                    >
                      {hour}h
                    </div>
                  ))}
                </div>
              )}
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
