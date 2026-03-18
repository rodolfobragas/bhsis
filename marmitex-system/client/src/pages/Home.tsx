import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <header className="bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Marmitex System</h1>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground py-2">Bem-vindo, {user?.name}</span>
                <Button variant="outline" onClick={logout}>
                  Sair
                </Button>
                <a href="/admin">
                  <Button>Ir para Painel</Button>
                </a>
              </>
            ) : (
              <>
                <a href="/login">
                  <Button variant="outline">Login</Button>
                </a>
                <a href="/register">
                  <Button>Registrar</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Sistema de Gerenciamento de Restaurante
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie pedidos, produtos, clientes e estoque com facilidade
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <a href="/login">
                <Button size="lg">Fazer Login</Button>
              </a>
              <a href="/register">
                <Button size="lg" variant="outline">
                  Criar Conta
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-background p-6 rounded-[5px] border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-2">Painel Administrativo</h3>
            <p className="text-muted-foreground">
              Gerencie todos os aspectos do seu restaurante em um único lugar
            </p>
          </div>
          <div className="bg-background p-6 rounded-[5px] border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-2">Kitchen Display System</h3>
            <p className="text-muted-foreground">
              Visualize e gerencie pedidos em tempo real na cozinha
            </p>
          </div>
          <div className="bg-background p-6 rounded-[5px] border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-2">Relatórios e Análises</h3>
            <p className="text-muted-foreground">
              Acompanhe vendas, estoque e desempenho do seu negócio
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        {!isAuthenticated && (
          <div className="mt-16 bg-muted/50 border border-border rounded-[5px] p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Credenciais de Demonstração</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">Admin:</p>
                <p className="text-muted-foreground">Email: admin@marmitex.com</p>
                <p className="text-muted-foreground">Senha: admin123</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Cozinha:</p>
                <p className="text-muted-foreground">Email: kitchen@marmitex.com</p>
                <p className="text-muted-foreground">Senha: kitchen123</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
