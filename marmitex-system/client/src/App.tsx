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
import CadastroProdutoCadastrar from "./pages/CadastroProdutoCadastrar";
import CadastroProdutoConsultar from "./pages/CadastroProdutoConsultar";
import CadastroProdutoBuscaPreco from "./pages/CadastroProdutoBuscaPreco";
import CadastroProdutoConsultaRapida from "./pages/CadastroProdutoConsultaRapida";
import CadastroParticipante from "./pages/CadastroParticipante";
import CadastroParticipanteCadastras from "./pages/CadastroParticipanteCadastras";
import CadastroParticipanteConsultar from "./pages/CadastroParticipanteConsultar";
import CadastroParticipanteCargo from "./pages/CadastroParticipanteCargo";
import CadastroParticipanteGrupo from "./pages/CadastroParticipanteGrupo";
import CadastroParticipanteVendedorCliente from "./pages/CadastroParticipanteVendedorCliente";
import CadastroParticipanteRelatorioCredito from "./pages/CadastroParticipanteRelatorioCredito";
import CadastroParticipanteRelatorioAniversariantes from "./pages/CadastroParticipanteRelatorioAniversariantes";
import CadastroParticipanteManutencao from "./pages/CadastroParticipanteManutencao";
import CadastroFiscal from "./pages/CadastroFiscal";
import CadastroFiscalCfop from "./pages/CadastroFiscalCfop";
import CadastroFiscalCstIcms from "./pages/CadastroFiscalCstIcms";
import CadastroFiscalRegraFiscal from "./pages/CadastroFiscalRegraFiscal";
import CadastroFiscalNaturezaOperacao from "./pages/CadastroFiscalNaturezaOperacao";
import CadastroFiscalInfoComplementares from "./pages/CadastroFiscalInfoComplementares";
import CadastroFiscalIntegracaoImendes from "./pages/CadastroFiscalIntegracaoImendes";
import CadastroFinanceiro from "./pages/CadastroFinanceiro";
import CadastroFinanceiroBandeira from "./pages/CadastroFinanceiroBandeira";
import CadastroFinanceiroContaBancaria from "./pages/CadastroFinanceiroContaBancaria";
import CadastroFinanceiroHistoricoPadrao from "./pages/CadastroFinanceiroHistoricoPadrao";
import CadastroFinanceiroCentroCusto from "./pages/CadastroFinanceiroCentroCusto";
import CadastroFinanceiroFormaPagamento from "./pages/CadastroFinanceiroFormaPagamento";
import CadastroFinanceiroPlanoContasGerencial from "./pages/CadastroFinanceiroPlanoContasGerencial";
import CadastroFinanceiroParametrosConvenioBoleto from "./pages/CadastroFinanceiroParametrosConvenioBoleto";
import CadastroCaixaVenda from "./pages/CadastroCaixaVenda";
import CadastroCaixaVendaCadastrar from "./pages/CadastroCaixaVendaCadastrar";
import CadastroCaixaVendaConsultar from "./pages/CadastroCaixaVendaConsultar";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroUsuarioCadastrar from "./pages/CadastroUsuarioCadastrar";
import CadastroUsuarioConsultar from "./pages/CadastroUsuarioConsultar";
import CadastroUsuarioGrupoPermissoes from "./pages/CadastroUsuarioGrupoPermissoes";
import CadastroVeiculo from "./pages/CadastroVeiculo";
import CadastroVeiculoCadastrar from "./pages/CadastroVeiculoCadastrar";
import CadastroVeiculoConsultar from "./pages/CadastroVeiculoConsultar";
import CadastroVeiculoVeiculosClientes from "./pages/CadastroVeiculoVeiculosClientes";
import CadastroVeiculoCadastrarConsultarCores from "./pages/CadastroVeiculoCadastrarConsultarCores";
import CadastroSetor from "./pages/CadastroSetor";
import CadastroSetorCadastrar from "./pages/CadastroSetorCadastrar";
import CadastroSetorConsultar from "./pages/CadastroSetorConsultar";
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
import FaturamentoNfeEmissao from "./pages/FaturamentoNfeEmissao";
import FaturamentoNfeConsultar from "./pages/FaturamentoNfeConsultar";
import FaturamentoNfeConsultarSituacao from "./pages/FaturamentoNfeConsultarSituacao";
import FaturamentoNfeCartaCorrecao from "./pages/FaturamentoNfeCartaCorrecao";
import FaturamentoNfeConsultaInutilizacao from "./pages/FaturamentoNfeConsultaInutilizacao";
import FaturamentoNfeDuplicatas from "./pages/FaturamentoNfeDuplicatas";
import FaturamentoNfeGeracaoNotaEntrada from "./pages/FaturamentoNfeGeracaoNotaEntrada";
import FaturamentoNfeDeclaracaoImportacao from "./pages/FaturamentoNfeDeclaracaoImportacao";
import FaturamentoNfseEmissao from "./pages/FaturamentoNfseEmissao";
import FaturamentoNfseConsultar from "./pages/FaturamentoNfseConsultar";
import FaturamentoMdfeEmissao from "./pages/FaturamentoMdfeEmissao";
import FaturamentoMdfeConsultar from "./pages/FaturamentoMdfeConsultar";
import FaturamentoMdfeConsultarSituacao from "./pages/FaturamentoMdfeConsultarSituacao";
import FaturamentoCteEmissao from "./pages/FaturamentoCteEmissao";
import FaturamentoCteConsultar from "./pages/FaturamentoCteConsultar";
import FaturamentoCteImportarXmlNfe from "./pages/FaturamentoCteImportarXmlNfe";
import FaturamentoCteConsultarSituacao from "./pages/FaturamentoCteConsultarSituacao";
import FaturamentoCteCartaCorrecao from "./pages/FaturamentoCteCartaCorrecao";
import FaturamentoCteFaturasDoccob from "./pages/FaturamentoCteFaturasDoccob";
import FaturamentoCteInsucessosEntrega from "./pages/FaturamentoCteInsucessosEntrega";
import FaturamentoCteReciboPagamentoAutonomo from "./pages/FaturamentoCteReciboPagamentoAutonomo";
import FaturamentoCteOsEmissao from "./pages/FaturamentoCteOsEmissao";
import FaturamentoCteOsConsultar from "./pages/FaturamentoCteOsConsultar";
import FaturamentoCteOsCartaCorrecao from "./pages/FaturamentoCteOsCartaCorrecao";
import FaturamentoCteOsConsultarSituacao from "./pages/FaturamentoCteOsConsultarSituacao";
import FaturamentoOrcamentoCadastrar from "./pages/FaturamentoOrcamentoCadastrar";
import FaturamentoOrcamentoConsultar from "./pages/FaturamentoOrcamentoConsultar";
import FaturamentoOrcamentoProdutosReservados from "./pages/FaturamentoOrcamentoProdutosReservados";
import FaturamentoCondicionalCadastrar from "./pages/FaturamentoCondicionalCadastrar";
import FaturamentoCondicionalConsultar from "./pages/FaturamentoCondicionalConsultar";
import FaturamentoCondicionalProdutos from "./pages/FaturamentoCondicionalProdutos";
import PdvCaixa from "./pages/PdvCaixa";
import PdvVendas from "./pages/PdvVendas";
import PdvConfiguracao from "./pages/PdvConfiguracao";
import EntradaNotaCadastrar from "./pages/EntradaNotaCadastrar";
import EntradaNotaConsultar from "./pages/EntradaNotaConsultar";
import EntradaNotaImportacaoXml from "./pages/EntradaNotaImportacaoXml";
import EntradaNotaTributacaoNfeEntrada from "./pages/EntradaNotaTributacaoNfeEntrada";
import DocumentosRecebidosConsultaNfes from "./pages/DocumentosRecebidosConsultaNfes";
import DocumentosRecebidosConsultaCtes from "./pages/DocumentosRecebidosConsultaCtes";
import DocumentosRecebidosImportacaoNfes from "./pages/DocumentosRecebidosImportacaoNfes";
import DocumentosRecebidosImportacaoCtes from "./pages/DocumentosRecebidosImportacaoCtes";
import DocumentosRecebidosEventosVinculadosNfes from "./pages/DocumentosRecebidosEventosVinculadosNfes";
import DocumentosRecebidosManifestacaoNfesUsuario from "./pages/DocumentosRecebidosManifestacaoNfesUsuario";
import PedidoCompraCadastrar from "./pages/PedidoCompraCadastrar";
import PedidoCompraConsultar from "./pages/PedidoCompraConsultar";
import PedidoCompraCotacao from "./pages/PedidoCompraCotacao";
import AssinadorPainelAssinaturas from "./pages/AssinadorPainelAssinaturas";
import FinanceiroCaixa from "./pages/FinanceiroCaixa";
import FinanceiroLancamentoFinanceiro from "./pages/FinanceiroLancamentoFinanceiro";
import FinanceiroConsultaLancamentos from "./pages/FinanceiroConsultaLancamentos";
import FinanceiroRecebimentoCartoes from "./pages/FinanceiroRecebimentoCartoes";
import FinanceiroLancamentosRecorrentes from "./pages/FinanceiroLancamentosRecorrentes";
import FinanceiroContasAbertoClientes from "./pages/FinanceiroContasAbertoClientes";
import FinanceiroContasAbertoDocumentos from "./pages/FinanceiroContasAbertoDocumentos";
import FinanceiroBoletos from "./pages/FinanceiroBoletos";
import FinanceiroCustoFixo from "./pages/FinanceiroCustoFixo";
import FinanceiroExtratoBancario from "./pages/FinanceiroExtratoBancario";
import FinanceiroControleCheques from "./pages/FinanceiroControleCheques";
import FinanceiroMovimentacoesEntreContas from "./pages/FinanceiroMovimentacoesEntreContas";
import FinanceiroConsultaTransacoesIntegracoes from "./pages/FinanceiroConsultaTransacoesIntegracoes";
import FiscalLancamentos from "./pages/FiscalLancamentos";
import FiscalArquivosFiscais from "./pages/FiscalArquivosFiscais";
import FiscalRegistroInventario from "./pages/FiscalRegistroInventario";
import FiscalGestaoDocumentos from "./pages/FiscalGestaoDocumentos";
import EstoqueEntradas from "./pages/EstoqueEntradas";
import EstoqueEntradasSaidas from "./pages/EstoqueEntradasSaidas";
import EstoqueEntradasSaidasDetalhado from "./pages/EstoqueEntradasSaidasDetalhado";
import EstoqueCurvaAbc from "./pages/EstoqueCurvaAbc";
import EstoqueUltimasVendas from "./pages/EstoqueUltimasVendas";
import EstoqueSintetico from "./pages/EstoqueSintetico";
import EstoqueLucro from "./pages/EstoqueLucro";
import EstoqueTabelaPrecos from "./pages/EstoqueTabelaPrecos";
import EstoqueGiroMercadoria from "./pages/EstoqueGiroMercadoria";
import EstoqueLancarInicial from "./pages/EstoqueLancarInicial";
import EstoqueQuantidade from "./pages/EstoqueQuantidade";
import EstoquePorLocalizacao from "./pages/EstoquePorLocalizacao";
import EstoqueMinimoMaximo from "./pages/EstoqueMinimoMaximo";
import EstoquePosicaoAtual from "./pages/EstoquePosicaoAtual";
import EstoqueAjustePorProduto from "./pages/EstoqueAjustePorProduto";
import EstoqueQuantidadeGrade from "./pages/EstoqueQuantidadeGrade";
import EstoqueContagemAjuste from "./pages/EstoqueContagemAjuste";
import ProducaoCadastrar from "./pages/ProducaoCadastrar";
import ProducaoConsultar from "./pages/ProducaoConsultar";
import ProducaoGerarProducao from "./pages/ProducaoGerarProducao";
import ProducaoTipoMateriaPrima from "./pages/ProducaoTipoMateriaPrima";
import ProducaoConsultarGeradas from "./pages/ProducaoConsultarGeradas";
import DeliveryPainel from "./pages/DeliveryPainel";
import DeliveryEntregador from "./pages/DeliveryEntregador";
import DeliveryQrCode from "./pages/DeliveryQrCode";
import RelatoriosLogSistema from "./pages/RelatoriosLogSistema";
import RelatoriosGerenciais from "./pages/RelatoriosGerenciais";
import RelatoriosLancasPrevisaoDre from "./pages/RelatoriosLancasPrevisaoDre";
import RelatoriosGerador from "./pages/RelatoriosGerador";
import RelatoriosEnvioWhatsapp from "./pages/RelatoriosEnvioWhatsapp";
import RelatoriosNotasFiscaisSaida from "./pages/RelatoriosNotasFiscaisSaida";
import RelatoriosNotasFiscaisEntrada from "./pages/RelatoriosNotasFiscaisEntrada";
import RelatoriosNotasFiscaisServico from "./pages/RelatoriosNotasFiscaisServico";
import RelatoriosConhecimentosEletronicos from "./pages/RelatoriosConhecimentosEletronicos";
import RelatoriosManifestoDocumentos from "./pages/RelatoriosManifestoDocumentos";
import RelatoriosNotasFiscaisConsumidor from "./pages/RelatoriosNotasFiscaisConsumidor";
import RelatoriosProdutos from "./pages/RelatoriosProdutos";
import RelatoriosFinanceiro from "./pages/RelatoriosFinanceiro";
import RelatoriosOrcamento from "./pages/RelatoriosOrcamento";
import RelatoriosLivrosFiscais from "./pages/RelatoriosLivrosFiscais";
import RelatoriosVendaExterna from "./pages/RelatoriosVendaExterna";
import RelatoriosPedidoVenda from "./pages/RelatoriosPedidoVenda";
import RelatoriosOrdensServico from "./pages/RelatoriosOrdensServico";
import RelatoriosLucroVendaComissoesOutros from "./pages/RelatoriosLucroVendaComissoesOutros";

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
      <Route path="/cadastro/produto/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroProdutoCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/produto/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroProdutoConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/produto/busca-preco">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroProdutoBuscaPreco />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/produto/consulta-rapida">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroProdutoConsultaRapida />
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
      <Route path="/cadastro/participante/cadastras">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteCadastras />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/cargo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteCargo />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/grupo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteGrupo />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/vendedor-cliente">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteVendedorCliente />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/relatorio-credito">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteRelatorioCredito />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/relatorio-aniversariantes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteRelatorioAniversariantes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/participante/manutencao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroParticipanteManutencao />
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
      <Route path="/cadastro/fiscal/cfop">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscalCfop />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/fiscal/cst-icms">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscalCstIcms />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/fiscal/regra-fiscal">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscalRegraFiscal />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/fiscal/natureza-operacao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscalNaturezaOperacao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/fiscal/info-complementares">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscalInfoComplementares />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/fiscal/integracao-imendes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFiscalIntegracaoImendes />
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
      <Route path="/cadastro/financeiro/bandeira">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroBandeira />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro/conta-bancaria">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroContaBancaria />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro/historico-padrao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroHistoricoPadrao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro/centro-custo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroCentroCusto />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro/forma-pagamento">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroFormaPagamento />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro/plano-contas-gerencial">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroPlanoContasGerencial />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/financeiro/parametros-convenio-boleto">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroFinanceiroParametrosConvenioBoleto />
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
      <Route path="/cadastro/caixa-venda/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroCaixaVendaCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/caixa-venda/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroCaixaVendaConsultar />
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
      <Route path="/cadastro/usuario/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroUsuarioCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/usuario/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroUsuarioConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/usuario/grupo-permissoes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroUsuarioGrupoPermissoes />
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
      <Route path="/cadastro/veiculo/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroVeiculoCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/veiculo/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroVeiculoConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/veiculo/veiculos-clientes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroVeiculoVeiculosClientes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/veiculo/cadastrar-consultar-cores">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroVeiculoCadastrarConsultarCores />
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
      <Route path="/cadastro/setor/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroSetorCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/cadastro/setor/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <CadastroSetorConsultar />
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
      <Route path="/faturamento/notas-fiscais-eletronicas/emissao-nfe">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeEmissao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/consultar-nfes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/consultar-situacao-nfe">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeConsultarSituacao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/carta-correcao-eletronica">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeCartaCorrecao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/consulta-inutilizacao-nfe">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeConsultaInutilizacao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/consultar-emitir-duplicatas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeDuplicatas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/geracao-nfe-nota-entrada">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeGeracaoNotaEntrada />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-eletronicas/declaracao-importacao-di">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfeDeclaracaoImportacao />
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
      <Route path="/faturamento/notas-fiscais-servico/emissao-nfse">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfseEmissao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/notas-fiscais-servico/consultar-nfses">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoNfseConsultar />
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
      <Route path="/faturamento/manifesto-documentos/emissao-mdfe">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoMdfeEmissao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/manifesto-documentos/consultar-mdfes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoMdfeConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/manifesto-documentos/consultar-situacao-mdfe">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoMdfeConsultarSituacao />
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
      <Route path="/faturamento/conhecimento-transporte/emissao-cte">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteEmissao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/consultar-ctes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/importar-xml-nfe">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteImportarXmlNfe />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/consultar-situacao-cte">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteConsultarSituacao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/carta-correcao-eletronica">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteCartaCorrecao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/consultar-faturas-doccob">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteFaturasDoccob />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/consultar-insucessos-entrega">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteInsucessosEntrega />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte/recibo-pagamento-autonomo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteReciboPagamentoAutonomo />
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
      <Route path="/faturamento/conhecimento-transporte-os/emissao-cte-os">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteOsEmissao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte-os/consultar-ctes-os">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteOsConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte-os/carta-correcao-eletronica">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteOsCartaCorrecao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/conhecimento-transporte-os/consulta-situacao-cte-os">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCteOsConsultarSituacao />
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
      <Route path="/faturamento/orcamento/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoOrcamentoCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/orcamento/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoOrcamentoConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/orcamento/produtos-reservados">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoOrcamentoProdutosReservados />
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
      <Route path="/faturamento/condicional/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCondicionalCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/condicional/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCondicionalConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/faturamento/condicional/produtos-condicional">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FaturamentoCondicionalProdutos />
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
      <Route path="/pdv/caixa">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <PdvCaixa />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/pdv/vendas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <PdvVendas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/pdv/configuracao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <PdvConfiguracao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/entrada-nota/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EntradaNotaCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/entrada-nota/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EntradaNotaConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/entrada-nota/importacao-xml">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EntradaNotaImportacaoXml />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/entrada-nota/tributacao-nfe-entrada">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EntradaNotaTributacaoNfeEntrada />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/documentos-recebidos/consulta-nfes-recebidas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DocumentosRecebidosConsultaNfes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/documentos-recebidos/consulta-ctes-recebidas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DocumentosRecebidosConsultaCtes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/documentos-recebidos/importacao-nfes-recebidas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DocumentosRecebidosImportacaoNfes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/documentos-recebidos/importacao-ctes-recebidas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DocumentosRecebidosImportacaoCtes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/documentos-recebidos/eventos-vinculados-nfes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DocumentosRecebidosEventosVinculadosNfes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/documentos-recebidos/manifestacao-nfes-usuario">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DocumentosRecebidosManifestacaoNfesUsuario />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/pedido-compra/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <PedidoCompraCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/pedido-compra/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <PedidoCompraConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/pedido-compra/cotacao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <PedidoCompraCotacao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/assinador/painel-assinaturas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <AssinadorPainelAssinaturas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/caixa">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroCaixa />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/lancamento-financeiro">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroLancamentoFinanceiro />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/consulta-lancamentos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroConsultaLancamentos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/recebimento-cartoes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroRecebimentoCartoes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/lancamentos-recorrentes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroLancamentosRecorrentes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/contas-aberto-clientes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroContasAbertoClientes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/contas-aberto-documentos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroContasAbertoDocumentos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/boletos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroBoletos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/custo-fixo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroCustoFixo />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/extrato-bancario">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroExtratoBancario />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/controle-cheques">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroControleCheques />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/movimentacoes-entre-contas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroMovimentacoesEntreContas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/financeiro/consulta-transacoes-integracoes">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FinanceiroConsultaTransacoesIntegracoes />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/fiscal/lancamentos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FiscalLancamentos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/fiscal/arquivos-fiscais">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FiscalArquivosFiscais />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/fiscal/registro-inventario">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FiscalRegistroInventario />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/fiscal/gestao-documentos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <FiscalGestaoDocumentos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/entradas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueEntradas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/entradas-saidas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueEntradasSaidas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/entradas-saidas-detalhado">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueEntradasSaidasDetalhado />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/curva-abc">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueCurvaAbc />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/ultimas-vendas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueUltimasVendas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/estoque-sintetico">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueSintetico />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/lucro-estoque">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueLucro />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/tabela-precos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueTabelaPrecos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/giro-mercadoria">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueGiroMercadoria />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/lancar-estoque-inicial">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueLancarInicial />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/quantidade-estoque">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueQuantidade />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/estoque-por-localizacao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoquePorLocalizacao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/estoque-minimo-maximo">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueMinimoMaximo />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/posicao-atual">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoquePosicaoAtual />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/ajuste-por-produto">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueAjustePorProduto />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/quantidade-grade">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueQuantidadeGrade />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/estoque/contagem-ajuste">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <EstoqueContagemAjuste />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/producao/cadastrar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <ProducaoCadastrar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/producao/consultar">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <ProducaoConsultar />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/producao/gerar-producao">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <ProducaoGerarProducao />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/producao/tipo-materia-prima">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <ProducaoTipoMateriaPrima />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/producao/consultar-producoes-geradas">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <ProducaoConsultarGeradas />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/delivery/delivery">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DeliveryPainel />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/delivery/entregador">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DeliveryEntregador />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/delivery/gerar-qr-code">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <DeliveryQrCode />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/log-sistema">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosLogSistema />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/relatorios-gerenciais">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosGerenciais />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/lancas-previsao-dre">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosLancasPrevisaoDre />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/gerador-relatorios">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosGerador />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/envio-whatsapp">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosEnvioWhatsapp />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/notas-fiscais-saida">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosNotasFiscaisSaida />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/notas-fiscais-entrada">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosNotasFiscaisEntrada />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/notas-fiscais-servico">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosNotasFiscaisServico />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/conhecimentos-eletronicos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosConhecimentosEletronicos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/manifesto-documentos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosManifestoDocumentos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/notas-fiscais-consumidor">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosNotasFiscaisConsumidor />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/produtos">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosProdutos />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/financeiro">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosFinanceiro />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/orcamento">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosOrcamento />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/livros-fiscais">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosLivrosFiscais />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/venda-externa">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosVendaExterna />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/pedido-venda">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosPedidoVenda />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/ordens-servico">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosOrdensServico />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/relatorios/lucro-venda-comissoes-outros">
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <RelatoriosLucroVendaComissoesOutros />
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
