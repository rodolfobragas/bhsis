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
        <i className="fa-solid fa-spinner animate-spin text-blue-600 mr-2" aria-hidden="true" />
        <span className="text-gray-600">Carregando clientes...</span>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-2 mb-4 text-gray-600">
          <i className="fa-solid fa-circle-exclamation text-sm" aria-hidden="true" />
          <p>Nenhum cliente encontrado</p>
        </div>
        <Button onClick={onAdd}>
          <i className="fa-solid fa-plus mr-2 text-sm" aria-hidden="true" />
          Novo Cliente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} className="w-full md:w-auto">
          <i className="fa-solid fa-plus mr-2 text-sm" aria-hidden="true" />
          Novo Cliente
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
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
                      aria-label="Editar cliente"
                      title="Editar cliente"
                    >
                      <i className="fa-solid fa-pen text-sm" aria-hidden="true" />
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
                      aria-label="Deletar cliente"
                      title="Deletar cliente"
                    >
                      <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
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
