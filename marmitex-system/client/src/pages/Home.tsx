import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Marmitex System</h1>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 py-2">Bem-vindo, {user?.name}</span>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Gerenciamento de Restaurante
          </h2>
          <p className="text-xl text-gray-600 mb-8">
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Painel Administrativo</h3>
            <p className="text-gray-600">
              Gerencie todos os aspectos do seu restaurante em um único lugar
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kitchen Display System</h3>
            <p className="text-gray-600">
              Visualize e gerencie pedidos em tempo real na cozinha
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios e Análises</h3>
            <p className="text-gray-600">
              Acompanhe vendas, estoque e desempenho do seu negócio
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        {!isAuthenticated && (
          <div className="mt-16 bg-blue-50 border-2 border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credenciais de Demonstração</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900">Admin:</p>
                <p className="text-gray-700">Email: admin@marmitex.com</p>
                <p className="text-gray-700">Senha: admin123</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Cozinha:</p>
                <p className="text-gray-700">Email: kitchen@marmitex.com</p>
                <p className="text-gray-700">Senha: kitchen123</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
