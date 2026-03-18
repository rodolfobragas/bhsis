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

type DiningTable = {
  id: string;
  name: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE";
  location?: string;
  active: boolean;
  occupiedSince?: string | null;
  totalOccupiedMinutes?: number;
  turnovers?: number;
};

const emptyForm = {
  name: "",
  capacity: 2,
  status: "AVAILABLE" as DiningTable["status"],
  location: "",
};

export default function Tables() {
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatMinutes = (minutes = 0) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    if (hours <= 0) return `${remaining} min`;
    return `${hours}h ${remaining}m`;
  };

  const getOccupiedDuration = (occupiedSince?: string | null) => {
    if (!occupiedSince) return "-";
    const start = new Date(occupiedSince).getTime();
    if (Number.isNaN(start)) return "-";
    const diff = Math.max(0, Math.round((Date.now() - start) / 60000));
    return formatMinutes(diff);
  };

  const fetchTables = async () => {
    try {
      const data = await apiService.getTables();
      setTables(data);
    } catch (error) {
      toast.error("Falha ao carregar mesas");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        capacity: Number(form.capacity),
        status: form.status,
        location: form.location || undefined,
      };
      if (editingId) {
        await apiService.updateTable(editingId, payload);
        toast.success("Mesa atualizada");
      } else {
        await apiService.createTable(payload);
        toast.success("Mesa criada");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchTables();
    } catch (error) {
      toast.error("Falha ao salvar mesa");
    }
  };

  const handleEdit = (table: DiningTable) => {
    setEditingId(table.id);
    setForm({
      name: table.name,
      capacity: table.capacity,
      status: table.status,
      location: table.location ?? "",
    });
  };

  const handleDeactivate = async (id: string) => {
    try {
      await apiService.deleteTable(id);
      toast.success("Mesa desativada");
      fetchTables();
    } catch (error) {
      toast.error("Falha ao desativar mesa");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de mesas</CardTitle>
          <CardDescription>Cadastre mesas e controle a disponibilidade</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Nome</label>
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Mesa 01"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Capacidade</label>
            <Input
              type="number"
              value={form.capacity}
              onChange={(event) => setForm((prev) => ({ ...prev, capacity: Number(event.target.value) }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as DiningTable["status"] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Disponível</SelectItem>
                <SelectItem value="OCCUPIED">Ocupada</SelectItem>
                <SelectItem value="RESERVED">Reservada</SelectItem>
                <SelectItem value="OUT_OF_SERVICE">Fora de serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Localização</label>
            <Input
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="Salão principal"
            />
          </div>
          <div className="lg:col-span-2 flex gap-2">
            <Button onClick={handleSubmit}>{editingId ? "Salvar alterações" : "Criar mesa"}</Button>
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
          <CardTitle>Mesas cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Capacidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Ocupação atual</TableHead>
              <TableHead>Ocupação total</TableHead>
              <TableHead>Turnover</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={table.status === "AVAILABLE" ? "default" : "secondary"}>
                      {table.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{table.location ?? "-"}</TableCell>
                  <TableCell>{getOccupiedDuration(table.occupiedSince)}</TableCell>
                  <TableCell>{formatMinutes(table.totalOccupiedMinutes ?? 0)}</TableCell>
                  <TableCell>{table.turnovers ?? 0}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(table)}>
                      Editar
                    </Button>
                    {table.active && (
                      <Button size="sm" variant="destructive" onClick={() => handleDeactivate(table.id)}>
                        Desativar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {tables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Nenhuma mesa cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
