import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description?: string;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  categories: string[];
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
  isLoading = false,
}: ProductDialogProps) {
  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Atualize as informações do produto"
              : "Preencha os dados para criar um novo produto"}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
