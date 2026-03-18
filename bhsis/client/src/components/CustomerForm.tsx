import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const customerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres").optional(),
  city: z.string().min(2, "Cidade é obrigatória"),
  zipCode: z.string().min(8, "CEP inválido").optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface Customer extends Partial<CustomerFormData> {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
}

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  isLoading = false,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          placeholder="Ex: João Silva"
          {...register("name")}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name?.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Ex: joao@email.com"
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email?.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="Ex: (11) 99999-9999"
          {...register("phone")}
          disabled={isLoading}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone?.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          placeholder="Ex: Rua das Flores, 123"
          {...register("address")}
          disabled={isLoading}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address?.message}</p>}
      </div>

      {/* City and ZipCode */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            placeholder="Ex: São Paulo"
            {...register("city")}
            disabled={isLoading}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city?.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            placeholder="Ex: 01310-100"
            {...register("zipCode")}
            disabled={isLoading}
          />
          {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode?.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Adicione observações sobre o cliente..."
          {...register("notes")}
          disabled={isLoading}
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : customer ? "Atualizar Cliente" : "Criar Cliente"}
        </Button>
      </div>
    </form>
  );
}
