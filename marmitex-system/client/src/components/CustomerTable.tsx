import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit2, Trash2, Plus, AlertCircle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  zipCode?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  isLoading?: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onAdd: () => void;
}

export default function CustomerTable({
  customers,
  isLoading = false,
  onEdit,
  onDelete,
  onAdd,
}: CustomerTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Carregando clientes...</span>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-2 mb-4 text-gray-600">
          <AlertCircle className="h-5 w-5" />
          <p>Nenhum cliente encontrado</p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{customer.email}</TableCell>
                <TableCell className="text-sm">{customer.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.city}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(customer)}
                      title="Editar cliente"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja deletar ${customer.name}?`)) {
                          onDelete(customer.id);
                        }
                      }}
                      title="Deletar cliente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
