import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiService from "@/services/api";
import { toast } from "sonner";

type LoyaltyAccount = {
  id: string;
  customerId: string;
  pointsBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: "BRONZE" | "SILVER" | "GOLD";
};

type LoyaltyTransaction = {
  id: string;
  type: "EARN" | "REDEEM" | "ADJUST";
  points: number;
  notes?: string;
  createdAt: string;
};

type LoyaltyTierConfig = {
  tier: "BRONZE" | "SILVER" | "GOLD";
  minEarned: number;
  benefits: string[];
};

export default function Loyalty() {
  const [customerId, setCustomerId] = useState("");
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [adjustPoints, setAdjustPoints] = useState(0);
  const [adjustNotes, setAdjustNotes] = useState("");
  const [tiers, setTiers] = useState<LoyaltyTierConfig[]>([]);

  const fetchTiers = async () => {
    try {
      const data = await apiService.getLoyaltyTiers();
      setTiers(data);
    } catch (error) {
      toast.error("Falha ao carregar níveis de fidelidade");
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchAccount = async () => {
    try {
      const data = await apiService.getLoyaltyAccount(customerId);
      setAccount(data);
      const history = await apiService.getLoyaltyTransactions(customerId);
      setTransactions(history);
    } catch (error) {
      toast.error("Falha ao carregar fidelidade");
    }
  };

  const handleAdjust = async () => {
    try {
      await apiService.adjustLoyaltyPoints(customerId, adjustPoints, adjustNotes || undefined);
      toast.success("Pontos ajustados");
      setAdjustPoints(0);
      setAdjustNotes("");
      fetchAccount();
    } catch (error) {
      toast.error("Falha ao ajustar pontos");
    }
  };

  const tierInfo = account
    ? tiers.find((tier) => tier.tier === account.tier)
    : undefined;
  const tierIndex = account
    ? tiers.findIndex((tier) => tier.tier === account.tier)
    : -1;
  const nextTier = tierIndex >= 0 ? tiers[tierIndex + 1] : undefined;
  const pointsToNext = nextTier
    ? Math.max(0, nextTier.minEarned - (account?.totalEarned ?? 0))
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fidelidade</CardTitle>
          <CardDescription>Consulte o saldo e ajuste pontos do cliente.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="ID do cliente"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            />
          </div>
          <Button onClick={fetchAccount} disabled={!customerId}>
            Buscar
          </Button>
        </CardContent>
      </Card>

      {account && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do cliente</CardTitle>
              <CardDescription>Saldo atual e histórico de pontos.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-2xl font-semibold">{account.pointsBalance}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total ganho</p>
                <p className="text-2xl font-semibold">{account.totalEarned}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total resgatado</p>
                <p className="text-2xl font-semibold">{account.totalRedeemed}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nível atual</p>
                <p className="text-2xl font-semibold">{account.tier}</p>
                {nextTier && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Faltam {pointsToNext} pontos para {nextTier.tier}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {tierInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Benefícios do nível {tierInfo.tier}</CardTitle>
                <CardDescription>Use estes benefícios para campanhas e atendimento.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tierInfo.benefits.map((benefit) => (
                  <div key={benefit} className="text-sm text-muted-foreground">
                    - {benefit}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ajuste de pontos</CardTitle>
              <CardDescription>Use números negativos para debitar pontos.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                value={adjustPoints}
                onChange={(event) => setAdjustPoints(Number(event.target.value))}
                placeholder="Quantidade"
              />
              <Input
                value={adjustNotes}
                onChange={(event) => setAdjustNotes(event.target.value)}
                placeholder="Motivo"
              />
              <Button onClick={handleAdjust}>Aplicar ajuste</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.points}</TableCell>
                      <TableCell>{tx.notes ?? "-"}</TableCell>
                      <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhuma transação registrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
