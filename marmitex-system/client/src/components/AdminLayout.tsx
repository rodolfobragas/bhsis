import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  ChefHat,
  AlertTriangle,
  TicketPercent,
  Sparkles,
  Table,
  CreditCard,
} from "lucide-react";
import DashboardLayout, { DashboardMenuItem } from "@/components/DashboardLayout";

const adminMenuItems: DashboardMenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingCart, label: "Pedidos", path: "/orders" },
  { icon: Package, label: "Produtos", path: "/products" },
  { icon: Users, label: "Clientes", path: "/customers" },
  { icon: Warehouse, label: "Inventário", path: "/inventory" },
  { icon: ChefHat, label: "Receitas", path: "/recipes" },
  { icon: AlertTriangle, label: "Alertas", path: "/stock-alerts" },
  { icon: TicketPercent, label: "Cupons", path: "/coupons" },
  { icon: Sparkles, label: "Fidelidade", path: "/loyalty" },
  { icon: Table, label: "Mesas", path: "/tables" },
  { icon: CreditCard, label: "Pagamentos", path: "/payments" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout menuItems={adminMenuItems}>{children}</DashboardLayout>;
}
