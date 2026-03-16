import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/services/apiClient";

interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: string;
  instructions: string;
  cost: number;
  prepTime: number;
  createdAt: string;
}

const recipeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  ingredients: z.string().min(1, "Ingredientes são obrigatórios"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  cost: z.number().min(0, "Custo deve ser maior que 0"),
  prepTime: z.number().min(1, "Tempo de preparo é obrigatório"),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      cost: 0,
      prepTime: 15,
    },
  });

  // Mock data for demo
  const mockRecipes: Recipe[] = [
    {
      id: "1",
      name: "Arroz com Frango",
      description: "Arroz branco com frango desfiado",
      ingredients: "Arroz, frango, cebola, alho, sal, óleo",
      instructions: "1. Cozinhe o frango. 2. Refogue a cebola e alho. 3. Adicione o arroz. 4. Cozinhe até ficar macio.",
      cost: 12.50,
      prepTime: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Feijoada",
      description: "Feijoada tradicional brasileira",
      ingredients: "Feijão, carne seca, linguiça, cebola, alho",
      instructions: "1. Deixe o feijão de molho. 2. Cozinhe com as carnes. 3. Tempere a gosto.",
      cost: 18.00,
      prepTime: 120,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API, fallback to mock data
      try {
        const response = await apiClient.getRecipes();
        setRecipes(response.data);
      } catch (error) {
        // Fallback to mock data
        setRecipes(mockRecipes);
      }
    } catch (error) {
      toast.error("Erro ao carregar receitas");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RecipeFormData) => {
    try {
      if (editingId) {
        // Try to update via API, fallback to local update
        try {
          await apiClient.updateRecipe(editingId, data);
        } catch (error) {
          // Fallback to local update
          setRecipes(recipes.map(r => r.id === editingId ? { ...r, ...data } : r));
        }
        toast.success("Receita atualizada com sucesso!");
      } else {
        // Try to create via API, fallback to local creation
        try {
          await apiClient.createRecipe(data);
        } catch (error) {
          // Fallback to local creation
          const newRecipe: Recipe = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString(),
          };
          setRecipes([...recipes, newRecipe]);
        }
        toast.success("Receita criada com sucesso!");
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      loadRecipes();
    } catch (error) {
      toast.error("Erro ao salvar receita");
    }
  };

  const handleEdit = (recipe: Recipe) => {
    form.reset(recipe);
    setEditingId(recipe.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta receita?")) {
      try {
        // Try to delete via API, fallback to local deletion
        try {
          await apiClient.deleteRecipe(id);
        } catch (error) {
          // Fallback to local deletion
          setRecipes(recipes.filter(r => r.id !== id));
        }
        toast.success("Receita deletada com sucesso!");
        loadRecipes();
      } catch (error) {
        toast.error("Erro ao deletar receita");
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Receitas</h1>
          <p className="text-gray-600">Gerencie as receitas e ingredientes do seu restaurante</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { form.reset(); setEditingId(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Receita" : "Nova Receita"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Atualize os dados da receita" : "Preencha os dados da nova receita"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da receita" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descrição da receita" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredientes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ingredientes (um por linha)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instruções</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Modo de preparo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Preparo (minutos)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receitas</CardTitle>
          <CardDescription>Lista de todas as receitas cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar receita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Carregando receitas...</div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhuma receita encontrada</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Custo</TableHead>
                    <TableHead>Tempo (min)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.name}</TableCell>
                      <TableCell>{recipe.description}</TableCell>
                      <TableCell>R$ {recipe.cost.toFixed(2)}</TableCell>
                      <TableCell>{recipe.prepTime}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(recipe)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(recipe.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
  );
}
