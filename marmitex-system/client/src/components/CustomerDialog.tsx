import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  zipCode?: string;
  notes?: string;
}

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function CustomerDialog({
  open,
  onOpenChange,
  customer,
  onSubmit,
  isLoading = false,
}: CustomerDialogProps) {
  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Atualize as informações do cliente"
              : "Preencha os dados para criar um novo cliente"}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          customer={customer}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
