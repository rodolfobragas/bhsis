import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomerTable from "@/components/CustomerTable";
import CustomerDialog from "@/components/CustomerDialog";
import { toast } from "sonner";
import { AlertCircle, Search } from "lucide-react";

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

      // Mock data - replace with API call
      const mockCustomers: Customer[] = [
        {
          id: "1",
          name: "João Silva",
          email: "joao@email.com",
          phone: "(11) 99999-9999",
          address: "Rua das Flores, 123",
          city: "São Paulo",
          zipCode: "01310-100",
          notes: "Cliente frequente",
        },
        {
          id: "2",
          name: "Maria Santos",
          email: "maria@email.com",
          phone: "(11) 98888-8888",
          address: "Av. Paulista, 456",
          city: "São Paulo",
          zipCode: "01311-100",
          notes: "Preferência por marmitas de frango",
        },
        {
          id: "3",
          name: "Pedro Oliveira",
          email: "pedro@email.com",
          phone: "(11) 97777-7777",
          address: "Rua Augusta, 789",
          city: "São Paulo",
          zipCode: "01305-100",
        },
      ];
      setCustomers(mockCustomers);
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
        // Update customer
        setCustomers(
          customers.map((c) =>
            c.id === selectedCustomer.id
              ? {
                  ...c,
                  ...data,
                }
              : c
          )
        );
        toast.success("Cliente atualizado com sucesso!");
      } else {
        // Create customer
        const newCustomer: Customer = {
          id: Date.now().toString(),
          ...data,
        };
        setCustomers([...customers, newCustomer]);
        toast.success("Cliente criado com sucesso!");
      }
    } catch (err) {
      toast.error("Erro ao salvar cliente");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      setCustomers(customers.filter((c) => c.id !== customerId));
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground mt-2">Gerencie os clientes do seu restaurante</p>
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
            <CardTitle>Pesquisar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquise por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchCustomers}>
                Atualizar
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
