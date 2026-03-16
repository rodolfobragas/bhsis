import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProductTable from "@/components/ProductTable";
import ProductDialog from "@/components/ProductDialog";
import apiService from "@/services/api";
import { toast } from "sonner";
import { AlertCircle, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description?: string;
  active: boolean;
}

const CATEGORIES = ["Marmitas", "Bebidas", "Sobremesas", "Acompanhamentos", "Pratos"];

export default function Products() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Mock data for now - replace with API call
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Marmita de Frango",
          sku: "MARM-001",
          category: "Marmitas",
          price: 25.0,
          description: "Frango com arroz, feijão e salada",
          active: true,
        },
        {
          id: "2",
          name: "Marmita de Peixe",
          sku: "MARM-002",
          category: "Marmitas",
          price: 32.0,
          description: "Peixe fresco com acompanhamentos",
          active: true,
        },
        {
          id: "3",
          name: "Refrigerante 2L",
          sku: "BEB-001",
          category: "Bebidas",
          price: 8.0,
          description: "Refrigerante variados",
          active: true,
        },
        {
          id: "4",
          name: "Suco Natural",
          sku: "BEB-002",
          category: "Bebidas",
          price: 6.0,
          description: "Suco de frutas naturais",
          active: true,
        },
        {
          id: "5",
          name: "Brigadeiro",
          sku: "SOBR-001",
          category: "Sobremesas",
          price: 3.0,
          description: "Brigadeiro caseiro",
          active: true,
        },
      ];
      setProducts(mockProducts);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSubmitProduct = async (data: any) => {
    try {
      setIsSubmitting(true);

      if (selectedProduct) {
        // Update product
        // await apiService.updateProduct(selectedProduct.id, data);
        setProducts(
          products.map((p) =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  name: data.name,
                  sku: data.sku,
                  category: data.category,
                  price: parseFloat(data.price),
                  description: data.description,
                }
              : p
          )
        );
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Create product
        // const newProduct = await apiService.createProduct(data);
        const newProduct: Product = {
          id: Date.now().toString(),
          name: data.name,
          sku: data.sku,
          category: data.category,
          price: parseFloat(data.price),
          description: data.description,
          active: true,
        };
        setProducts([...products, newProduct]);
        toast.success("Produto criado com sucesso!");
      }
    } catch (err) {
      toast.error("Erro ao salvar produto");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // await apiService.deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
      toast.success("Produto deletado com sucesso!");
    } catch (err) {
      toast.error("Erro ao deletar produto");
      console.error(err);
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Produtos</h1>
          <p className="text-muted-foreground mt-2">Gerencie o catálogo de produtos do seu restaurante</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500 bg-red-50">
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquise por nome, SKU ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchProducts}>
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="pt-6">
            <ProductTable
              products={filteredProducts}
              isLoading={isLoading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAdd={handleAddProduct}
            />
          </CardContent>
        </Card>

        {/* Product Dialog */}
        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
          categories={CATEGORIES}
          onSubmit={handleSubmitProduct}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
