import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomerTable from "@/components/CustomerTable";
import CustomerDialog from "@/components/CustomerDialog";
import { toast } from "sonner";
import apiService from "@/services/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes?: string;
}

export default function Customers() {
  const { isAuthenticated } = useAuthContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getCustomers({ skip: 0, take: 200 });
      setCustomers(data);
    } catch (err) {
      setError("Erro ao carregar clientes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(undefined);
    setDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleSubmitCustomer = async (data: any) => {
    try {
      setIsSubmitting(true);

      if (selectedCustomer) {
        await apiService.updateCustomer(selectedCustomer.id, data);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await apiService.createCustomer(data);
        toast.success("Cliente criado com sucesso!");
      }
      fetchCustomers();
    } catch (err) {
      toast.error("Erro ao salvar cliente");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await apiService.deleteCustomer(customerId);
      fetchCustomers();
      toast.success("Cliente deletado com sucesso!");
    } catch (err) {
      toast.error("Erro ao deletar cliente");
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
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Gerencie os clientes do seu restaurante</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6" variant="destructive" role="alert">
            <i className="fa-solid fa-circle-exclamation text-sm" aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
              <div className="relative flex-1">
                <label htmlFor="customer-search" className="sr-only">
                  Buscar clientes
                </label>
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-xs text-muted-foreground" aria-hidden="true" />
                <Input
                  id="customer-search"
                  placeholder="Buscar por nome, e-mail ou telefone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchCustomers} className="w-full md:w-auto">
                Atualizar lista
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardContent className="pt-6">
            <CustomerTable
              customers={filteredCustomers}
              isLoading={isLoading}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
              onAdd={handleAddCustomer}
            />
          </CardContent>
        </Card>

        {/* Customer Dialog */}
        <CustomerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          customer={selectedCustomer}
          onSubmit={handleSubmitCustomer}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
