import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Folder,
  FileSpreadsheet,
  FileText,
  Landmark,
  Warehouse,
  ChefHat,
  Truck,
  FileBarChart,
  Utensils,
} from "lucide-react";
import DashboardLayout, { DashboardMenuEntry } from "@/components/DashboardLayout";

const adminMenuItems: DashboardMenuEntry[] = [
  { type: "section", label: "OPERAÇÃO" },
  {
    icon: Utensils,
    label: "Food",
    path: "/food",
    children: [
      { label: "Dashboard", path: "/admin" },
      { label: "Pedidos", path: "/orders" },
      { label: "Pagamentos", path: "/payments" },
      { label: "Alertas", path: "/stock-alerts" },
      { label: "Fidelidade", path: "/loyalty" },
      { label: "Cupons", path: "/coupons" },
      { label: "Mesas", path: "/tables" },
    ],
  },
  {
    icon: Folder,
    label: "Cadastro",
    path: "/cadastro",
    children: [
      {
        label: "Produto",
        path: "/cadastro/produto",
        children: [
          { label: "Cadastrar", path: "/cadastro/produto/cadastrar" },
          { label: "Consultar", path: "/cadastro/produto/consultar" },
          { label: "Busca Preço", path: "/cadastro/produto/busca-preco" },
          { label: "Consulta Rápida", path: "/cadastro/produto/consulta-rapida" },
        ],
      },
      {
        label: "Participante",
        path: "/cadastro/participante",
        children: [
          { label: "Cadastras", path: "/cadastro/participante/cadastras" },
          { label: "Consultar", path: "/cadastro/participante/consultar" },
          { label: "Cargo", path: "/cadastro/participante/cargo" },
          { label: "Grupo", path: "/cadastro/participante/grupo" },
          { label: "Vendedor x Cliente", path: "/cadastro/participante/vendedor-cliente" },
          { label: "Relatório de Crédito", path: "/cadastro/participante/relatorio-credito" },
          { label: "Relatório de Aniversariantes", path: "/cadastro/participante/relatorio-aniversariantes" },
          { label: "Manutenção de Participantes", path: "/cadastro/participante/manutencao" },
        ],
      },
      {
        label: "Fiscal",
        path: "/cadastro/fiscal",
        children: [
          { label: "CFOP", path: "/cadastro/fiscal/cfop" },
          { label: "CST ICMS", path: "/cadastro/fiscal/cst-icms" },
          { label: "Regra Fiscal", path: "/cadastro/fiscal/regra-fiscal" },
          { label: "Natureza de Operação", path: "/cadastro/fiscal/natureza-operacao" },
          { label: "Info. Complementares", path: "/cadastro/fiscal/info-complementares" },
          { label: "Integração iMendes", path: "/cadastro/fiscal/integracao-imendes" },
        ],
      },
      {
        label: "Financeiro",
        path: "/cadastro/financeiro",
        children: [
          { label: "Bandeira", path: "/cadastro/financeiro/bandeira" },
          { label: "Conta Bancária", path: "/cadastro/financeiro/conta-bancaria" },
          { label: "Histórico Padrão", path: "/cadastro/financeiro/historico-padrao" },
          { label: "Centro de Custo", path: "/cadastro/financeiro/centro-custo" },
          { label: "Forma de Pagamento", path: "/cadastro/financeiro/forma-pagamento" },
          { label: "Plano de Contas Gerencial", path: "/cadastro/financeiro/plano-contas-gerencial" },
          { label: "Parâmetros/ConvÊnio Boleto", path: "/cadastro/financeiro/parametros-convenio-boleto" },
        ],
      },
      {
        label: "Caixa Venda",
        path: "/cadastro/caixa-venda",
        children: [
          { label: "Cadastrar", path: "/cadastro/caixa-venda/cadastrar" },
          { label: "Consultar", path: "/cadastro/caixa-venda/consultar" },
        ],
      },
      {
        label: "Usuário",
        path: "/cadastro/usuario",
        children: [
          { label: "Cadastrar", path: "/cadastro/usuario/cadastrar" },
          { label: "Consultar", path: "/cadastro/usuario/consultar" },
          { label: "Grupo/Permissões", path: "/cadastro/usuario/grupo-permissoes" },
        ],
      },
      {
        label: "Veículos",
        path: "/cadastro/veiculo",
        children: [
          { label: "Cadastrar", path: "/cadastro/veiculo/cadastrar" },
          { label: "Consultar", path: "/cadastro/veiculo/consultar" },
          { label: "Veículos x Clientes", path: "/cadastro/veiculo/veiculos-clientes" },
          { label: "Cadastrar/Consultar Cores", path: "/cadastro/veiculo/cadastrar-consultar-cores" },
        ],
      },
      {
        label: "Setor",
        path: "/cadastro/setor",
        children: [
          { label: "Cadastrar", path: "/cadastro/setor/cadastrar" },
          { label: "Consultar", path: "/cadastro/setor/consultar" },
        ],
      },
    ],
  },
  {
    icon: FileSpreadsheet,
    label: "Faturamento",
    path: "/faturamento",
    children: [
      {
        label: "Notas Fiscais Eletrônicas",
        path: "/faturamento/notas-fiscais-eletronicas",
        children: [
          { label: "Emissão de NFe", path: "/faturamento/notas-fiscais-eletronicas/emissao-nfe" },
          { label: "Consultar NFe's", path: "/faturamento/notas-fiscais-eletronicas/consultar-nfes" },
          { label: "Consultar Situação NFe", path: "/faturamento/notas-fiscais-eletronicas/consultar-situacao-nfe" },
          { label: "Carta Correção Eletrônica", path: "/faturamento/notas-fiscais-eletronicas/carta-correcao-eletronica" },
          { label: "Consulta/Inutilização NFe", path: "/faturamento/notas-fiscais-eletronicas/consulta-inutilizacao-nfe" },
          { label: "Consultar/Emitir Duplicatas", path: "/faturamento/notas-fiscais-eletronicas/consultar-emitir-duplicatas" },
          {
            label: "Geração NFe por Nota Entrada",
            path: "/faturamento/notas-fiscais-eletronicas/geracao-nfe-nota-entrada",
          },
          { label: "Declaração de Importação - DI", path: "/faturamento/notas-fiscais-eletronicas/declaracao-importacao-di" },
        ],
      },
      {
        label: "Notas Fiscais de Serviço",
        path: "/faturamento/notas-fiscais-servico",
        children: [
          { label: "Emissão de NFSe", path: "/faturamento/notas-fiscais-servico/emissao-nfse" },
          { label: "Consultar NFSe's", path: "/faturamento/notas-fiscais-servico/consultar-nfses" },
        ],
      },
      {
        label: "Manifesto de Documentos",
        path: "/faturamento/manifesto-documentos",
        children: [
          { label: "Emissão de MDFe", path: "/faturamento/manifesto-documentos/emissao-mdfe" },
          { label: "Consultar MDFe's", path: "/faturamento/manifesto-documentos/consultar-mdfes" },
          { label: "Consultar Situação MDFe", path: "/faturamento/manifesto-documentos/consultar-situacao-mdfe" },
        ],
      },
      {
        label: "Conhecimento de Transporte",
        path: "/faturamento/conhecimento-transporte",
        children: [
          { label: "Emissão de CTe", path: "/faturamento/conhecimento-transporte/emissao-cte" },
          { label: "Consultar CTe's", path: "/faturamento/conhecimento-transporte/consultar-ctes" },
          { label: "Importar XML NFe", path: "/faturamento/conhecimento-transporte/importar-xml-nfe" },
          { label: "Consultar Situação CTe", path: "/faturamento/conhecimento-transporte/consultar-situacao-cte" },
          { label: "Carta Correção Eletrônica", path: "/faturamento/conhecimento-transporte/carta-correcao-eletronica" },
          { label: "Consultar Faturas DOCCOB", path: "/faturamento/conhecimento-transporte/consultar-faturas-doccob" },
          {
            label: "Consultar Insucessos na Entrega",
            path: "/faturamento/conhecimento-transporte/consultar-insucessos-entrega",
          },
          { label: "Recibo de Pagamento a Autônomo", path: "/faturamento/conhecimento-transporte/recibo-pagamento-autonomo" },
        ],
      },
      {
        label: "Conhecimento de Transporte - OS",
        path: "/faturamento/conhecimento-transporte-os",
        children: [
          { label: "Emissão de CTe OS", path: "/faturamento/conhecimento-transporte-os/emissao-cte-os" },
          { label: "Consultar CTe's OS", path: "/faturamento/conhecimento-transporte-os/consultar-ctes-os" },
          { label: "Carta Correção Eletrônica", path: "/faturamento/conhecimento-transporte-os/carta-correcao-eletronica" },
          { label: "Consulta Situação de CTe OS", path: "/faturamento/conhecimento-transporte-os/consulta-situacao-cte-os" },
        ],
      },
      {
        label: "Orçamento",
        path: "/faturamento/orcamento",
        children: [
          { label: "Cadastrar", path: "/faturamento/orcamento/cadastrar" },
          { label: "Consultar", path: "/faturamento/orcamento/consultar" },
          { label: "Produtos Reservados", path: "/faturamento/orcamento/produtos-reservados" },
        ],
      },
      {
        label: "Condicional",
        path: "/faturamento/condicional",
        children: [
          { label: "Cadastrar", path: "/faturamento/condicional/cadastrar" },
          { label: "Consultar", path: "/faturamento/condicional/consultar" },
          { label: "Produtos em Condicional", path: "/faturamento/condicional/produtos-condicional" },
        ],
      },
      {
        label: "Pedido de Venda",
        path: "/faturamento/pedido-venda",
        children: [
          { label: "Cadastrar", path: "/faturamento/pedido-venda/cadastrar" },
          { label: "Consultar", path: "/faturamento/pedido-venda/consultar" },
          { label: "Tipo Pedido Venda", path: "/faturamento/pedido-venda/tipo-pedido-venda" },
        ],
      },
      {
        label: "Ordem de Serviço",
        path: "/faturamento/ordem-servico",
        children: [
          { label: "Cadastrar", path: "/faturamento/ordem-servico/cadastrar" },
          { label: "Consultar", path: "/faturamento/ordem-servico/consultar" },
          { label: "Produtos Reservados", path: "/faturamento/ordem-servico/produtos-reservados" },
        ],
      },
      {
        label: "Venda Futura/Retiradas",
        path: "/faturamento/venda-futura-retiradas",
        children: [
          { label: "Cadastrar", path: "/faturamento/venda-futura-retiradas/cadastrar" },
          { label: "Consultar", path: "/faturamento/venda-futura-retiradas/consultar" },
          { label: "Produtos a Retirar", path: "/faturamento/venda-futura-retiradas/produtos-retirar" },
        ],
      },
      {
        label: "Venda Externa/Retornos",
        path: "/faturamento/venda-externa-retorno",
        children: [
          { label: "Cadastrar", path: "/faturamento/venda-externa-retorno/cadastrar" },
          { label: "Consultar", path: "/faturamento/venda-externa-retorno/consultar" },
        ],
      },
      {
        label: "Geração/Reajuste Contrato",
        path: "/faturamento/geracao-reajuste-contrato",
        children: [
          { label: "Cadastrar", path: "/faturamento/geracao-reajuste-contrato/cadastrar" },
          { label: "Consultar", path: "/faturamento/geracao-reajuste-contrato/consultar" },
          { label: "Faturamento", path: "/faturamento/geracao-reajuste-contrato/faturamento" },
          { label: "Modelo de Contrato", path: "/faturamento/geracao-reajuste-contrato/modelo-contrato" },
          { label: "Tabela Geral de Reajuste", path: "/faturamento/geracao-reajuste-contrato/tabela-geral-reajuste" },
        ],
      },
      {
        label: "Romaneio de Carga/Entrega",
        path: "/faturamento/romaneiro-carga-entrega",
        children: [
          { label: "Cadastrar", path: "/faturamento/romaneiro-carga-entrega/cadastrar" },
          { label: "Consultar", path: "/faturamento/romaneiro-carga-entrega/consultar" },
        ],
      },
      {
        label: "Importação XML NFe/NFCe/CTe",
        path: "/faturamento/importacao-xml-nfe-nfce-cte",
        children: [
          { label: "Importar NFe/NFCe's Emitidas", path: "/faturamento/importacao-xml-nfe-nfce-cte/importar-nfe-nfce-emitidas" },
          { label: "Importar CTe's Emitidos", path: "/faturamento/importacao-xml-nfe-nfce-cte/importar-ctes-emitidos" },
        ],
      },
    ],
  },
  {
    icon: CreditCard,
    label: "PDV",
    path: "/pdv",
    children: [
      {
        label: "Caixa",
        path: "/pdv/caixa",
        children: [
          { label: "Abertura de Caixa", path: "/pdv/caixa/abertura" },
          { label: "Fechamento de Caixa", path: "/pdv/caixa/fechamento" },
          { label: "Fechamento Detalhado", path: "/pdv/caixa/fechamento-detalhado" },
          { label: "Suprimentos/Sangrias", path: "/pdv/caixa/suprimentos-sangrias" },
          { label: "Consultar Fechamentos", path: "/pdv/caixa/consultar-fechamentos" },
          { label: "Alterar Valor Inicial Caixa", path: "/pdv/caixa/alterar-valor-inicial" },
          { label: "Consultar Suprimentos/Sangrias", path: "/pdv/caixa/consultar-suprimentos-sangrias" },
          { label: "Relatório Vendas por Data/Horário", path: "/pdv/caixa/relatorio-vendas-data-horario" },
        ],
      },
      {
        label: "Vendas",
        path: "/pdv/vendas",
        children: [
          { label: "Realizar Venda", path: "/pdv/vendas/realizar" },
          { label: "Força de Venda", path: "/pdv/vendas/forca-venda" },
          { label: "Venda Rápida", path: "/pdv/vendas/venda-rapida" },
          { label: "Consultar Vendas", path: "/pdv/vendas/consultar" },
          { label: "Vendas Caixa Logado", path: "/pdv/vendas/caixa-logado" },
          { label: "Envio de Contingências", path: "/pdv/vendas/envio-contingencias" },
          { label: "Consultar Situação NFCe", path: "/pdv/vendas/consultar-situacao-nfce" },
          { label: "Inutilização de Vendas/NFCe", path: "/pdv/vendas/inutilizacao-vendas-nfce" },
        ],
      },
      {
        label: "Configuração",
        path: "/pdv/configuracao",
        children: [
          { label: "Exportar Produtos de Balança", path: "/pdv/configuracao/exportar-produtos-balanca" },
        ],
      },
    ],
  },
  {
    icon: FileText,
    label: "Entrada de Nota",
    path: "/entrada-nota",
    children: [
      { label: "Cadastrar", path: "/entrada-nota/cadastrar" },
      { label: "Consultar", path: "/entrada-nota/consultar" },
      { label: "Importação XML", path: "/entrada-nota/importacao-xml" },
      {
        label: "Tributação NFe Entrada",
        path: "/entrada-nota/tributacao-nfe-entrada",
        children: [
          { label: "Cadastrar", path: "/entrada-nota/tributacao-nfe-entrada/cadastrar" },
          { label: "Consultar", path: "/entrada-nota/tributacao-nfe-entrada/consultar" },
        ],
      },
    ],
  },
  {
    icon: FileText,
    label: "Documentos Recebidos",
    path: "/documentos-recebidos",
    children: [
      { label: "Consulta NFe's Recebidas", path: "/documentos-recebidos/consulta-nfes-recebidas" },
      { label: "Consulta CTe's Recebidas", path: "/documentos-recebidos/consulta-ctes-recebidas" },
      { label: "Importação NFe's Recebidas", path: "/documentos-recebidos/importacao-nfes-recebidas" },
      { label: "Importação CTe's Recebidas", path: "/documentos-recebidos/importacao-ctes-recebidas" },
      { label: "Eventos Vinculados as NFe's", path: "/documentos-recebidos/eventos-vinculados-nfes" },
      { label: "Manifestação NFe's Usuário", path: "/documentos-recebidos/manifestacao-nfes-usuario" },
    ],
  },
  {
    icon: FileText,
    label: "Pedido de Compra",
    path: "/pedido-compra",
    children: [
      { label: "Cadastrar", path: "/pedido-compra/cadastrar" },
      { label: "Consultar", path: "/pedido-compra/consultar" },
      {
        label: "Cotação",
        path: "/pedido-compra/cotacao",
        children: [
          { label: "Cadastrar", path: "/pedido-compra/cotacao/cadastrar" },
          { label: "Consultar", path: "/pedido-compra/cotacao/consultar" },
        ],
      },
    ],
  },
  {
    icon: FileText,
    label: "Assinador",
    path: "/assinador",
    children: [
      { label: "Painel de Assinaturas", path: "/assinador/painel-assinaturas" },
    ],
  },
  {
    icon: Landmark,
    label: "Financeiro",
    path: "/financeiro",
    children: [
      {
        label: "Caixa",
        path: "/financeiro/caixa",
        children: [
          { label: "Abertura de Caixa", path: "/financeiro/caixa/abertura" },
          { label: "Fechamento de Caixa", path: "/financeiro/caixa/fechamento" },
          { label: "Fechamento Detalhado", path: "/financeiro/caixa/fechamento-detalhado" },
          { label: "Consultar Fechamentos", path: "/financeiro/caixa/consultar-fechamentos" },
          { label: "Suprimentos / Sangrias", path: "/financeiro/caixa/suprimentos-sangrias" },
          { label: "Alterar Valor Inicial Caixa", path: "/financeiro/caixa/alterar-valor-inicial" },
          { label: "Consultar Suprimentos/Sangrias", path: "/financeiro/caixa/consultar-suprimentos-sangrias" },
        ],
      },
      { label: "Lançamento Financeiro", path: "/financeiro/lancamento-financeiro" },
      { label: "Consulta Lançamentos", path: "/financeiro/consulta-lancamentos" },
      { label: "Recebimento de Cartões", path: "/financeiro/recebimento-cartoes" },
      { label: "Lançamento Recorrentes", path: "/financeiro/lancamentos-recorrentes" },
      { label: "Contas em Aberto de Clientes", path: "/financeiro/contas-aberto-clientes" },
      { label: "Contas em Aberto por Documentos", path: "/financeiro/contas-aberto-documentos" },
      {
        label: "Boletos",
        path: "/financeiro/boletos",
        children: [
          { label: "Boleto Avulso", path: "/financeiro/boletos/boleto-avulso" },
          { label: "Consultar Boletos", path: "/financeiro/boletos/consultar-boletos" },
          { label: "Consultar Carnês", path: "/financeiro/boletos/consultar-carnes" },
          { label: "Ler Arquivo de Retorno", path: "/financeiro/boletos/ler-arquivo-retorno" },
          { label: "Gerar/Consultar Remessas", path: "/financeiro/boletos/gerar-consultar-remessas" },
          { label: "Gerar/Consultar Remessas de Baixa", path: "/financeiro/boletos/gerar-consultar-remessas-baixa" },
        ],
      },
      {
        label: "Custo Fixo",
        path: "/financeiro/custo-fixo",
        children: [
          { label: "Cadastrar", path: "/financeiro/custo-fixo/cadastrar" },
          { label: "Consultar", path: "/financeiro/custo-fixo/consultar" },
        ],
      },
      {
        label: "Extrato Bancário",
        path: "/financeiro/extrato-bancario",
        children: [
          { label: "Importar", path: "/financeiro/extrato-bancario/importar" },
          { label: "Conciliar", path: "/financeiro/extrato-bancario/conciliar" },
          {
            label: "Excluir Lançamentos não Conciliados",
            path: "/financeiro/extrato-bancario/excluir-nao-conciliados",
          },
        ],
      },
      { label: "Controle de Cheques", path: "/financeiro/controle-cheques" },
      { label: "Movimentações entre Contas", path: "/financeiro/movimentacoes-entre-contas" },
      { label: "Consulta Transações/Integrações", path: "/financeiro/consulta-transacoes-integracoes" },
    ],
  },
  {
    icon: FileText,
    label: "Fiscal",
    path: "/fiscal",
    children: [
      {
        label: "Lançamentos",
        path: "/fiscal/lancamentos",
        children: [
          { label: "Nota Série D", path: "/fiscal/lancamentos/nota-serie-d" },
          { label: "Transporte", path: "/fiscal/lancamentos/transporte" },
          {
            label: "Nota Fiscal de Prestação de Serviços",
            path: "/fiscal/lancamentos/nota-fiscal-prestacao-servicos",
          },
          { label: "Água, Luz, Gás", path: "/fiscal/lancamentos/agua-luz-gas" },
          {
            label: "Comunicação e Telecomunicação",
            path: "/fiscal/lancamentos/comunicacao-telecomunicacao",
          },
        ],
      },
      { label: "Arquivos Fiscais", path: "/fiscal/arquivos-fiscais" },
      { label: "Registro de Inventário", path: "/fiscal/registro-inventario" },
      { label: "Gestão de Documentos", path: "/fiscal/gestao-documentos" },
    ],
  },
  {
    icon: Warehouse,
    label: "Estoque",
    path: "/estoque",
    children: [
      { label: "Entradas", path: "/estoque/entradas" },
      { label: "Entradas e Saídas", path: "/estoque/entradas-saidas" },
      { label: "Entradas e Saídas Detalhado", path: "/estoque/entradas-saidas-detalhado" },
      { label: "Curva ABC", path: "/estoque/curva-abc" },
      { label: "Últimas Vendas", path: "/estoque/ultimas-vendas" },
      { label: "Estoque Sintético", path: "/estoque/estoque-sintetico" },
      { label: "Lucro de Estoque", path: "/estoque/lucro-estoque" },
      { label: "Tabela de Preços", path: "/estoque/tabela-precos" },
      { label: "Giro de Mercadoria", path: "/estoque/giro-mercadoria" },
      { label: "Lançar Estoque Inicial", path: "/estoque/lancar-estoque-inicial" },
      { label: "Quantidade de Estoque", path: "/estoque/quantidade-estoque" },
      { label: "Estoque por Localização", path: "/estoque/estoque-por-localizacao" },
      { label: "Estoque Minimo/Máximo", path: "/estoque/estoque-minimo-maximo" },
      { label: "Posição Atual do Estoque", path: "/estoque/posicao-atual" },
      { label: "Ajuste de Estoque por Produto", path: "/estoque/ajuste-por-produto" },
      { label: "Quantidade em Estoque/Grade", path: "/estoque/quantidade-grade" },
      { label: "Contagem Estoque/Ajuste de Estoque", path: "/estoque/contagem-ajuste" },
    ],
  },
  {
    icon: ChefHat,
    label: "Produção",
    path: "/producao",
    children: [
      { label: "Cadastrar", path: "/producao/cadastrar" },
      { label: "Consultar", path: "/producao/consultar" },
      { label: "Gerar Produção", path: "/producao/gerar-producao" },
      { label: "Tipo de Matéria Prima", path: "/producao/tipo-materia-prima" },
      { label: "Consultar Produções Geradas", path: "/producao/consultar-producoes-geradas" },
    ],
  },
  {
    icon: Truck,
    label: "Delivery",
    path: "/delivery",
    children: [
      { label: "Delivery", path: "/delivery/delivery" },
      { label: "Entregador", path: "/delivery/entregador" },
      { label: "Gerar QR Code Delivery", path: "/delivery/gerar-qr-code" },
    ],
  },
  {
    icon: FileBarChart,
    label: "Relatórios",
    path: "/relatorios",
    children: [
      { label: "Log do Sistema", path: "/relatorios/log-sistema" },
      { label: "Relatórios Gerenciais", path: "/relatorios/relatorios-gerenciais" },
      { label: "Lanças Previsão DRE", path: "/relatorios/lancas-previsao-dre" },
      { label: "Gerador de Relatórios", path: "/relatorios/gerador-relatorios" },
      { label: "Relatório envio WhatsApp", path: "/relatorios/envio-whatsapp" },
      { label: "Notas Fiscais de Saída", path: "/relatorios/notas-fiscais-saida" },
      { label: "Notas Fiscais De Entrada", path: "/relatorios/notas-fiscais-entrada" },
      { label: "Notas Fiscais de Serviço", path: "/relatorios/notas-fiscais-servico" },
      { label: "Conhecimentos Eletrônicos", path: "/relatorios/conhecimentos-eletronicos" },
      { label: "Manifesto de Documentos", path: "/relatorios/manifesto-documentos" },
      { label: "Notas Fiscais do Consumidor", path: "/relatorios/notas-fiscais-consumidor" },
      { label: "Produtos", path: "/relatorios/produtos" },
      { label: "Financeiro", path: "/relatorios/financeiro" },
      { label: "Orçamento", path: "/relatorios/orcamento" },
      { label: "Livros Fiscais", path: "/relatorios/livros-fiscais" },
      { label: "Venda Externa", path: "/relatorios/venda-externa" },
      { label: "Pedido de Venda", path: "/relatorios/pedido-venda" },
      { label: "Ordens de Serviço", path: "/relatorios/ordens-servico" },
      { label: "Lucro de Venda/Comissões/Outros", path: "/relatorios/lucro-venda-comissoes-outros" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout menuItems={adminMenuItems}>{children}</DashboardLayout>;
}
