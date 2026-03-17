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
import FaturamentoNotasFiscaisEletronicas from "./pages/FaturamentoNotasFiscaisEletronicas";
import FaturamentoNotasFiscaisServico from "./pages/FaturamentoNotasFiscaisServico";
import FaturamentoManifestoDocumentos from "./pages/FaturamentoManifestoDocumentos";
import FaturamentoConhecimentoTransporte from "./pages/FaturamentoConhecimentoTransporte";
import FaturamentoConhecimentoTransporteOS from "./pages/FaturamentoConhecimentoTransporteOS";
import FaturamentoOrcamento from "./pages/FaturamentoOrcamento";
import FaturamentoCondicional from "./pages/FaturamentoCondicional";
import FaturamentoPedidoVenda from "./pages/FaturamentoPedidoVenda";
import FaturamentoOrdemServico from "./pages/FaturamentoOrdemServico";
import FaturamentoVendaFuturaRetiradas from "./pages/FaturamentoVendaFuturaRetiradas";
import FaturamentoVendaExternaRetorno from "./pages/FaturamentoVendaExternaRetorno";
import FaturamentoGeracaoReajusteContrato from "./pages/FaturamentoGeracaoReajusteContrato";
import FaturamentoRomaneiroCargaEntrega from "./pages/FaturamentoRomaneiroCargaEntrega";
import FaturamentoImportacaoXmlNfeNfceCte from "./pages/FaturamentoImportacaoXmlNfeNfceCte";

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
      <Route path="/faturamento/notas-fiscais-eletronicas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNotasFiscaisEletronicas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-servico">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNotasFiscaisServico />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/manifesto-documentos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoManifestoDocumentos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoConhecimentoTransporte />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte-os">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoConhecimentoTransporteOS />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/orcamento">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoOrcamento />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/condicional">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCondicional />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/pedido-venda">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoPedidoVenda />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/ordem-servico">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoOrdemServico />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/venda-futura-retiradas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoVendaFuturaRetiradas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/venda-externa-retorno">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoVendaExternaRetorno />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/geracao-reajuste-contrato">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoGeracaoReajusteContrato />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/romaneiro-carga-entrega">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoRomaneiroCargaEntrega />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/importacao-xml-nfe-nfce-cte">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoImportacaoXmlNfeNfceCte />
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
