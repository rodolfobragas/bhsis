import {
  LayoutDashboard,
  ShoppingCart,
  AlertTriangle,
  TicketPercent,
  Sparkles,
  Table,
  CreditCard,
  Folder,
  FileSpreadsheet,
} from "lucide-react";
import DashboardLayout, { DashboardMenuEntry } from "@/components/DashboardLayout";

const adminMenuItems: DashboardMenuEntry[] = [
  { type: "section", label: "OPERAÇÃO" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingCart, label: "Pedidos", path: "/orders" },
  { icon: CreditCard, label: "Pagamentos", path: "/payments" },
  { icon: AlertTriangle, label: "Alertas", path: "/stock-alerts" },
  { icon: Sparkles, label: "Fidelidade", path: "/loyalty" },
  { icon: TicketPercent, label: "Cupons", path: "/coupons" },
  { icon: Table, label: "Mesas", path: "/tables" },
  {
    icon: Folder,
    label: "Cadastro",
    path: "/cadastro",
    children: [
      { label: "Produto", path: "/cadastro/produto" },
      { label: "Participante", path: "/cadastro/participante" },
      { label: "Fiscal", path: "/cadastro/fiscal" },
      { label: "Financeiro", path: "/cadastro/financeiro" },
      { label: "Caixa Venda", path: "/cadastro/caixa-venda" },
      { label: "Usuário", path: "/cadastro/usuario" },
      { label: "Veículo", path: "/cadastro/veiculo" },
      { label: "Setor", path: "/cadastro/setor" },
    ],
  },
  {
    icon: FileSpreadsheet,
    label: "Faturamento",
    path: "/faturamento",
    children: [
      { label: "Notas Fiscais Eletrônicas", path: "/faturamento/notas-fiscais-eletronicas" },
      { label: "Notas Fiscais de Serviço", path: "/faturamento/notas-fiscais-servico" },
      { label: "Manifesto de Documentos", path: "/faturamento/manifesto-documentos" },
      { label: "Conhecimento de Transporte", path: "/faturamento/conhecimento-transporte" },
      { label: "Conhecimento de Transporte - OS", path: "/faturamento/conhecimento-transporte-os" },
      { label: "Orçamento", path: "/faturamento/orcamento" },
      { label: "Condicional", path: "/faturamento/condicional" },
      { label: "Pedido de Venda", path: "/faturamento/pedido-venda" },
      { label: "Ordem de Serviço", path: "/faturamento/ordem-servico" },
      { label: "Venda Futura/Retiradas", path: "/faturamento/venda-futura-retiradas" },
      { label: "Venda Externa/Retorno", path: "/faturamento/venda-externa-retorno" },
      { label: "Geração/Reajuste Contrato", path: "/faturamento/geracao-reajuste-contrato" },
      { label: "Romaneiro de Carga/Entrega", path: "/faturamento/romaneiro-carga-entrega" },
      { label: "Importação XML NFe/NFCe/CTe", path: "/faturamento/importacao-xml-nfe-nfce-cte" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout menuItems={adminMenuItems}>{children}</DashboardLayout>;
}
