import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").min(3, "Nome deve ter no mínimo 3 caracteres"),
  sku: z.string().min(1, "SKU é obrigatório").min(2, "SKU deve ter no mínimo 2 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Preço deve ser maior que zero"),
  description: z.string().optional(),
  recipeId: z.string().optional(),
});

type ProductFormData = {
  name: string;
  sku: string;
  category: string;
  price: number | string;
  description?: string;
  recipeId?: string;
};

interface ProductFormProps {
  product?: ProductFormData & { id: string };
  categories: string[];
  recipes: Array<{ id: string; name: string }>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({
  product,
  categories,
  recipes,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      category: product?.category || "",
      price: product?.price?.toString() || "0",
      description: product?.description || "",
      recipeId: product?.recipeId || "",
    },
  });

  const selectedCategory = watch("category");

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.success(product ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar produto");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          placeholder="Ex: Marmita de Frango"
          {...register("name")}
          disabled={isSubmitting || isLoading}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name?.message as string}</p>}
      </div>

      {/* SKU */}
      <div className="space-y-2">
        <Label htmlFor="sku">SKU *</Label>
        <Input
          id="sku"
          placeholder="Ex: MARM-001"
          {...register("sku")}
          disabled={isSubmitting || isLoading}
        />
        {errors.sku && <p className="text-sm text-red-500">{errors.sku?.message as string}</p>}
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select value={selectedCategory} onValueChange={(value) => setValue("category", value)}>
          <SelectTrigger id="category" disabled={isSubmitting || isLoading}>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category?.message as string}</p>}
      </div>

      {/* Preço */}
      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("price")}
          disabled={isSubmitting || isLoading}
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price?.message as string}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição opcional do produto"
          {...register("description")}
          disabled={isSubmitting || isLoading}
          rows={4}
        />
      </div>

      {/* Receita */}
      <div className="space-y-2">
        <Label htmlFor="recipeId">Receita vinculada</Label>
        <Select
          value={watch("recipeId") || "none"}
          onValueChange={(value) => setValue("recipeId", value === "none" ? "" : value)}
        >
          <SelectTrigger id="recipeId" disabled={isSubmitting || isLoading}>
            <SelectValue placeholder="Selecione uma receita" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem receita</SelectItem>
            {recipes.map((recipe) => (
              <SelectItem key={recipe.id} value={recipe.id}>
                {recipe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          {isSubmitting ? "Salvando..." : product ? "Atualizar Produto" : "Criar Produto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
