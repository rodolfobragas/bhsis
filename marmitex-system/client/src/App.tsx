import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import KitchenDisplay from "./pages/KitchenDisplay";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Recipes from "./pages/Recipes";
import StockAlerts from "./pages/StockAlerts";
import Coupons from "./pages/Coupons";
import Loyalty from "./pages/Loyalty";
import Tables from "./pages/Tables";
import Payments from "./pages/Payments";
import AdminLayout from "./components/AdminLayout";
import CadastroProduto from "./pages/CadastroProduto";
import CadastroParticipante from "./pages/CadastroParticipante";
import CadastroFiscal from "./pages/CadastroFiscal";
import CadastroFinanceiro from "./pages/CadastroFinanceiro";
import CadastroCaixaVenda from "./pages/CadastroCaixaVenda";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroVeiculo from "./pages/CadastroVeiculo";
import CadastroSetor from "./pages/CadastroSetor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/products">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Products />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/customers">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Customers />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/orders">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Orders />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/inventory">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Inventory />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/recipes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Recipes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/stock-alerts">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <StockAlerts />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/coupons">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Coupons />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/loyalty">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Loyalty />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/tables">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Tables />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/payments">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Payments />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/produto">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroProduto />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipante />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/fiscal">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscal />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiro />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/caixa-venda">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroCaixaVenda />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/usuario">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroUsuario />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/veiculo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroVeiculo />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/setor">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroSetor />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/kitchen">
        <ProtectedRoute requiredRole="kitchen">
          <KitchenDisplay />
        </ProtectedRoute>
      </Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
