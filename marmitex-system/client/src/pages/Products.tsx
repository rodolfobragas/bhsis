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

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description?: string;
  active: boolean;
  recipeId?: string | null;
}

interface Recipe {
  id: string;
  name: string;
}

const CATEGORIES = ["Marmitas", "Bebidas", "Sobremesas", "Acompanhamentos", "Pratos"];

export default function Products() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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
    fetchRecipes();
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
      const data = await apiService.getProducts({ skip: 0, take: 200 });
      setProducts(data);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const data = await apiService.getRecipes({ skip: 0, take: 200 });
      setRecipes(data);
    } catch (err) {
      console.error(err);
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
      const payload = {
        ...data,
        recipeId: data.recipeId ? data.recipeId : undefined,
      };

      if (selectedProduct) {
        await apiService.updateProduct(selectedProduct.id, payload);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await apiService.createProduct(payload);
        toast.success("Produto criado com sucesso!");
      }
      fetchProducts();
    } catch (err) {
      toast.error("Erro ao salvar produto");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await apiService.deleteProduct(productId);
      fetchProducts();
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Produtos</h1>
          <p className="text-muted-foreground mt-2">Gerencie o catálogo de produtos do seu restaurante</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500 bg-red-50" role="alert">
            <i className="fa-solid fa-circle-exclamation text-sm text-red-600" aria-hidden="true" />
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
                <label htmlFor="product-search" className="sr-only">
                  Pesquisar produtos
                </label>
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-xs text-muted-foreground" aria-hidden="true" />
                <Input
                  id="product-search"
                  placeholder="Pesquise por nome, SKU ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchProducts} className="w-full md:w-auto">
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
          recipes={recipes}
          onSubmit={handleSubmitProduct}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
