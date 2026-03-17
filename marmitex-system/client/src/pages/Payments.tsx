import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import apiService from "@/services/api";

type PaymentStatus =
  | "PENDING"
  | "REQUIRES_ACTION"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";

type Payment = {
  id: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
};

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  REQUIRES_ACTION: "Ação necessária",
  SUCCEEDED: "Pago",
  FAILED: "Falhou",
  CANCELED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const statusColors: Record<PaymentStatus, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  REQUIRES_ACTION: "bg-amber-100 text-amber-800",
  SUCCEEDED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-gray-200 text-gray-800",
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState<{
    currency: string;
    gross: number;
    refunded: number;
    net: number;
    succeededCount: number;
    refundedCount: number;
  } | null>(null);

  const formattedReport = useMemo(() => {
    if (!report) return null;
    return {
      ...report,
      gross: report.gross / 100,
      refunded: report.refunded / 100,
      net: report.net / 100,
    };
  }, [report]);

  const loadReport = async () => {
    try {
      setReportLoading(true);
      const data = await apiService.getPaymentReport({
        from: from || undefined,
        to: to || undefined,
      });
      setReport(data);
    } catch (err) {
      toast.error("Erro ao carregar relatório de receita");
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.listPayments({
        from: from || undefined,
        to: to || undefined,
      });
      setPayments(data);
    } catch (err) {
      toast.error("Erro ao carregar pagamentos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async (payment: Payment) => {
    try {
      await apiService.refundPayment(payment.id);
      toast.success("Reembolso solicitado com sucesso");
      await loadPayments();
      await loadReport();
    } catch (err: any) {
      toast.error(err?.message || "Falha ao reembolsar");
      console.error(err);
    }
  };

  useEffect(() => {
    loadPayments();
    loadReport();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Pagamentos</h1>
            <p className="text-muted-foreground mt-2">
              Histórico, reembolsos e receita consolidada
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full md:w-auto"
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full md:w-auto"
            />
            <Button
              variant="outline"
              onClick={() => {
                loadPayments();
                loadReport();
              }}
            >
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-raise">
            <CardHeader>
              <CardTitle>Receita Bruta</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {reportLoading || !formattedReport ? "—" : `R$ ${formattedReport.gross.toFixed(2)}`}
            </CardContent>
          </Card>
          <Card className="card-raise">
            <CardHeader>
              <CardTitle>Reembolsos</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {reportLoading || !formattedReport ? "—" : `R$ ${formattedReport.refunded.toFixed(2)}`}
            </CardContent>
          </Card>
          <Card className="card-raise">
            <CardHeader>
              <CardTitle>Receita Líquida</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {reportLoading || !formattedReport ? "—" : `R$ ${formattedReport.net.toFixed(2)}`}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-sm text-muted-foreground">Carregando pagamentos...</div>
            ) : payments.length === 0 ? (
              <div className="py-8 text-sm text-muted-foreground">Nenhum pagamento encontrado.</div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.orderId}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[payment.status]}>
                            {statusLabels[payment.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>R$ {(payment.amount / 100).toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={payment.status !== "SUCCEEDED"}
                              >
                                Reembolsar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar reembolso</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Este pagamento será reembolsado integralmente. Deseja continuar?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRefund(payment)}>
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
