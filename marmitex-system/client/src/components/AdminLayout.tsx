import {
  LayoutDashboard,
  ShoppingCart,
  AlertTriangle,
  TicketPercent,
  Sparkles,
  Table,
  CreditCard,
  Folder,
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
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout menuItems={adminMenuItems}>{children}</DashboardLayout>;
}
