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
import { AlertCircle, Search, AlertTriangle } from "lucide-react";
import apiService from "@/services/api";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  lastUpdated: string;
}

export default function Inventory() {
  const { isAuthenticated } = useAuthContext();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter inventory based on search term
  useEffect(() => {
    const filtered = inventory.filter(
      (item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getInventory();
      const mapped: InventoryItem[] = data.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.name ?? "-",
        sku: item.product?.sku ?? "-",
        currentStock: item.quantity,
        minimumStock: item.minQuantity,
        unit: item.unit ?? "un",
        lastUpdated: item.updatedAt,
      }));
      setInventory(mapped);
    } catch (err) {
      setError("Erro ao carregar inventário");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (itemId: string, newStock: number) => {
    try {
      const item = inventory.find((entry) => entry.id === itemId);
      if (!item) return;
      const delta = newStock - item.currentStock;
      await apiService.updateStock(item.productId, delta, "Ajuste manual");
      fetchInventory();
      setEditingId(null);
      toast.success("Estoque atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar estoque");
      console.error(err);
    }
  };

  const getLowStockItems = () => {
    return inventory.filter((item) => item.currentStock <= item.minimumStock);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minimumStock) {
      return "low";
    }
    return "ok";
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

  const lowStockItems = getLowStockItems();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Inventário</h1>
          <p className="text-muted-foreground mt-2">Acompanhe o estoque de produtos</p>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert className="mb-6 border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {lowStockItems.length} produto(s) com estoque baixo! Reposição necessária.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500 bg-red-50" role="alert">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pesquisar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
              <div className="relative flex-1">
                <label htmlFor="inventory-search" className="sr-only">
                  Pesquisar inventário
                </label>
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="inventory-search"
                  placeholder="Pesquise por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchInventory} className="w-full md:w-auto">
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando inventário...</p>
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Produto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Estoque Mínimo</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.sku}</TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20"
                              autoFocus
                            />
                          ) : (
                            <span>{item.currentStock}</span>
                          )}
                        </TableCell>
                        <TableCell>{item.minimumStock}</TableCell>
                        <TableCell className="text-sm">{item.unit}</TableCell>
                        <TableCell>
                          {getStockStatus(item) === "low" ? (
                            <Badge className="bg-red-100 text-red-800">Baixo</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">OK</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {editingId === item.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStock(item.id, parseInt(editValue) || 0)
                                  }
                                >
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditValue(item.currentStock.toString());
                                }}
                              >
                                Editar
                              </Button>
                            )}
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
