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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import apiService from "@/services/api";
import { toast } from "sonner";

type Coupon = {
  id: string;
  code: string;
  description?: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  maxUses?: number;
  usesCount: number;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
};

const emptyForm = {
  code: "",
  description: "",
  type: "PERCENT" as Coupon["type"],
  value: 10,
  minOrder: 0,
  maxDiscount: "",
  maxUses: "",
  startsAt: "",
  endsAt: "",
};

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error("Falha ao carregar cupons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        code: form.code,
        description: form.description || undefined,
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
      };

      if (editingId) {
        await apiService.updateCoupon(editingId, payload);
        toast.success("Cupom atualizado");
      } else {
        await apiService.createCoupon(payload);
        toast.success("Cupom criado");
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      toast.error("Falha ao salvar cupom");
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description ?? "",
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder ?? 0,
      maxDiscount: coupon.maxDiscount?.toString() ?? "",
      maxUses: coupon.maxUses?.toString() ?? "",
      startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 10) : "",
      endsAt: coupon.endsAt ? coupon.endsAt.slice(0, 10) : "",
    });
  };

  const handleDeactivate = async (id: string) => {
    try {
      await apiService.deleteCoupon(id);
      toast.success("Cupom desativado");
      fetchCoupons();
    } catch (error) {
      toast.error("Falha ao desativar cupom");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cupons e Descontos</CardTitle>
          <CardDescription>Crie cupons promocionais e controle limites de uso.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Código</label>
            <Input
              value={form.code}
              onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
              placeholder="FRETEGRATIS"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Descrição</label>
            <Input
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Promoção para novos clientes"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Tipo</label>
            <Select
              value={form.type}
              onValueChange={(value) => setForm((prev) => ({ ...prev, type: value as Coupon["type"] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Percentual</SelectItem>
                <SelectItem value="FIXED">Valor fixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Valor do desconto</label>
            <Input
              type="number"
              value={form.value}
              onChange={(event) => setForm((prev) => ({ ...prev, value: Number(event.target.value) }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Pedido mínimo</label>
            <Input
              type="number"
              value={form.minOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, minOrder: Number(event.target.value) }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Desconto máximo</label>
            <Input
              type="number"
              value={form.maxDiscount}
              onChange={(event) => setForm((prev) => ({ ...prev, maxDiscount: event.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Limite de usos</label>
            <Input
              type="number"
              value={form.maxUses}
              onChange={(event) => setForm((prev) => ({ ...prev, maxUses: event.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Início</label>
            <Input
              type="date"
              value={form.startsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Fim</label>
            <Input
              type="date"
              value={form.endsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
            />
          </div>
          <div className="lg:col-span-2 flex gap-2">
            <Button onClick={handleSubmit}>{editingId ? "Salvar alterações" : "Criar cupom"}</Button>
            {editingId && (
              <Button variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cupons cadastrados</CardTitle>
          <CardDescription>Lista atual de cupons ativos e inativos.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.type === "PERCENT" ? "%" : "R$"}</TableCell>
                    <TableCell>{coupon.value}</TableCell>
                    <TableCell>
                      {coupon.usesCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.active ? "default" : "secondary"}>
                        {coupon.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(coupon)}>
                        Editar
                      </Button>
                      {coupon.active && (
                        <Button size="sm" variant="destructive" onClick={() => handleDeactivate(coupon.id)}>
                          Desativar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {coupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum cupom cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
