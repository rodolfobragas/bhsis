import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/contexts/ThemeContext";
import { wsClient } from "@/services/websocketClient";
import { toast } from "sonner";
import apiService from "@/services/api";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export type DashboardMenuItem = {
  type?: "item";
  icon?: string;
  label: string;
  path: string;
  children?: DashboardMenuItem[];
  moduleKey?: string;
  adminOnly?: boolean;
};

type DashboardMenuSection = {
  type: "section";
  label: string;
};

export type DashboardMenuEntry = DashboardMenuItem | DashboardMenuSection;

type MenuGroup = {
  label?: string;
  items: DashboardMenuItem[];
};

const buildMenuGroups = (menuItems: DashboardMenuEntry[]): MenuGroup[] => {
  const groups: MenuGroup[] = [];
  let current: MenuGroup = { items: [] };

  menuItems.forEach((item) => {
    if (item.type === "section") {
      if (current.label || current.items.length) {
        groups.push(current);
      }
      current = { label: item.label, items: [] };
      return;
    }

    current.items.push(item);
  });

  if (current.label || current.items.length) {
    groups.push(current);
  }

  return groups;
};

const filterMenuItems = (
  items: DashboardMenuItem[],
  query: string
): DashboardMenuItem[] => {
  if (!query) return items;
  const normalizedQuery = query.toLowerCase();

  return items.reduce<DashboardMenuItem[]>((acc, item) => {
    const labelMatches = item.label.toLowerCase().includes(normalizedQuery);
    const childMatches = item.children
      ? filterMenuItems(item.children, query)
      : [];

    if (labelMatches) {
      acc.push({ ...item });
      return acc;
    }

    if (childMatches.length > 0) {
      acc.push({ ...item, children: childMatches });
    }

    return acc;
  }, []);
};

const findActiveMenuItem = (
  menuItems: DashboardMenuEntry[],
  location: string
): DashboardMenuItem | undefined => {
  for (const item of menuItems) {
    if (item.type === "section") continue;
    if (item.path === location) return item;
    if (!item.children?.length) continue;
    const child = findActiveMenuItem(item.children, location);
    if (child) return child;
  }
  return undefined;
};

const isItemActive = (item: DashboardMenuItem, location: string): boolean => {
  if (item.path === location) return true;
  if (!item.children?.length) return false;
  return item.children.some(child => isItemActive(child, location));
};

const PREMIUM_MODULES = new Set([
  "Food",
  "Agro",
  "Salões",
  "Clínicas",
  "Shop",
  "Pet",
  "Logística WMS",
  "Oficinas",
  "Escolas",
  "Frota",
  "Varejo",
  "Igrejas",
  "Imobiliárias",
]);

export default function DashboardLayout({
  children,
  menuItems,
}: {
  children: React.ReactNode;
  menuItems: DashboardMenuEntry[];
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Sign in to continue
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Access to this dashboard requires authentication. Continue to launch the login flow.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth} menuItems={menuItems}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
  menuItems: DashboardMenuEntry[];
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
  menuItems,
}: DashboardLayoutContentProps) {
  const { user, logout, token } = useAuth();
  const [location, setLocation] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = findActiveMenuItem(menuItems, location);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const { theme, toggleTheme, switchable } = useTheme();
  const menuGroups = buildMenuGroups(menuItems);
  const [moduleAccess, setModuleAccess] = useState<Record<string, boolean>>({});
  const [menuSearch, setMenuSearch] = useState("");
  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!user) return;

    const connect = async () => {
      if (!wsClient.isConnected()) {
        await wsClient.connect(token ?? undefined);
      }

      if (user.role === "admin") {
        wsClient.joinAdminRoom(user.id);
      }

      if (user.role === "manager") {
        wsClient.joinManagerRoom(user.id);
      }
    };

    connect().catch((error) => {
      console.error("WebSocket connection failed:", error);
    });

    const unsubscribe = wsClient.onLoyaltyPoints((event) => {
      if (user.role !== "admin" && user.role !== "manager") return;
      const deltaLabel = event.delta > 0 ? `+${event.delta}` : `${event.delta}`;
      toast(`Fidelidade: ${deltaLabel} pontos`, {
        description: `Saldo ${event.balance} • Nível ${event.tier}`,
      });
    });

    return () => {
      unsubscribe();
      wsClient.disconnect();
    };
  }, [user, token]);

  useEffect(() => {
    if (!user) return;
    apiService
      .getModuleAccess()
      .then((data: { key: string; enabled: boolean }[]) => {
        const map: Record<string, boolean> = {};
        data.forEach((entry) => {
          map[entry.key] = entry.enabled;
        });
        setModuleAccess(map);
      })
      .catch((error) => {
        console.error("Falha ao carregar acessos de módulo:", error);
      });
  }, [user]);

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <div className="flex items-center gap-2 min-w-0 w-full">
                {!isCollapsed ? (
                  <>
                    <i
                      className="fa-solid fa-magnifying-glass text-sm text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={menuSearch}
                      onChange={(event) => setMenuSearch(event.target.value)}
                      placeholder="Buscar módulos..."
                      className="h-8 text-sm"
                      aria-label="Buscar módulos e sub-módulos"
                    />
                  </>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                        aria-label="Buscar módulos e sub-módulos"
                      >
                        <i
                          className="fa-solid fa-magnifying-glass text-sm text-muted-foreground"
                          aria-hidden="true"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56 p-2">
                      <Input
                        value={menuSearch}
                        onChange={(event) => setMenuSearch(event.target.value)}
                        placeholder="Buscar módulos..."
                        className="h-8 text-sm"
                        aria-label="Buscar módulos e sub-módulos"
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            {menuGroups.map((group, index) => {
              const filteredItems = filterMenuItems(
                group.items.filter((item) => {
                  if (!item.adminOnly) return true;
                  return user?.role?.toLowerCase() === "admin";
                }),
                menuSearch.trim()
              );

              if (menuSearch.trim() && filteredItems.length === 0) {
                return null;
              }

              return (
                <SidebarGroup key={`${group.label ?? "default"}-${index}`} className="py-1">
                  {group.label ? (
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                  ) : null}
                  <SidebarGroupContent>
                    <SidebarMenu className="px-2 py-1">
                      {filteredItems.map(item => {
                      const renderMenuItem = (
                        menuItem: DashboardMenuItem,
                        level: number
                      ): React.ReactNode => {
                        const isActive = isItemActive(menuItem, location);
                        const hasChildren = (menuItem.children?.length ?? 0) > 0;
                        const menuKey = `${level}-${menuItem.path || menuItem.label}`;
                        const isOpen =
                          expandedMenus[menuKey] ?? (hasChildren && isActive);
                        const accessKey = menuItem.moduleKey;
                        const isPremiumLabel = PREMIUM_MODULES.has(menuItem.label);
                        const isAccessAllowed =
                          accessKey ? moduleAccess[accessKey] ?? false : true;
                        const isLocked =
                          level === 0 && (!!accessKey || isPremiumLabel) && !isAccessAllowed;

                        const content = (
                          <>
                            {menuItem.icon ? (
                              <i
                                className={cn(
                                  menuItem.icon,
                                  "text-sm",
                                  isActive ? "text-primary" : "text-muted-foreground"
                                )}
                                aria-hidden="true"
                              />
                            ) : null}
                            <span>{menuItem.label}</span>
                            {isLocked ? (
                              <i className="fa-solid fa-lock ml-auto text-xs text-muted-foreground" aria-hidden="true" />
                            ) : hasChildren ? (
                              isOpen ? (
                                <i className="fa-solid fa-chevron-down ml-auto text-xs text-muted-foreground" aria-hidden="true" />
                              ) : (
                                <i className="fa-solid fa-chevron-right ml-auto text-xs text-muted-foreground" aria-hidden="true" />
                              )
                            ) : null}
                          </>
                        );

                        const handleClick = () => {
                          if (isLocked) {
                            toast("Módulo premium indisponível", {
                              description: "Este módulo não está incluído na assinatura atual.",
                            });
                            return;
                          }
                          if (hasChildren) {
                            toggleMenu(menuKey);
                            return;
                          }
                          setLocation(menuItem.path);
                        };

                        if (level === 0) {
                          return (
                            <SidebarMenuItem key={menuItem.path}>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={handleClick}
                                tooltip={menuItem.label}
                                className={cn(
                                  "h-10 transition-all font-normal",
                                  isLocked && "opacity-60 cursor-not-allowed"
                                )}
                                aria-disabled={isLocked}
                              >
                                {content}
                              </SidebarMenuButton>
                              {hasChildren && isOpen && !isLocked ? (
                                <SidebarMenuSub>
                                  {menuItem.children?.map(child =>
                                    renderMenuItem(child, level + 1)
                                  )}
                                </SidebarMenuSub>
                              ) : null}
                            </SidebarMenuItem>
                          );
                        }

                        return (
                          <SidebarMenuSubItem key={menuItem.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                            >
                              <button
                                type="button"
                                onClick={handleClick}
                                className="w-full text-left"
                              >
                                {content}
                              </button>
                            </SidebarMenuSubButton>
                            {hasChildren && isOpen ? (
                              <SidebarMenuSub>
                                {menuItem.children?.map(child =>
                                  renderMenuItem(child, level + 1)
                                )}
                              </SidebarMenuSub>
                            ) : null}
                          </SidebarMenuSubItem>
                        );
                      };

                      return renderMenuItem(item, 0);
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>

          <SidebarFooter className="p-3">
            {switchable ? (
              <Button
                variant="outline"
                className="mb-3 w-full justify-center gap-2 group-data-[collapsible=icon]:hidden"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <i className="fa-solid fa-sun text-sm" aria-hidden="true" />
                ) : (
                  <i className="fa-solid fa-moon text-sm" aria-hidden="true" />
                )}
                <span>{theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
              </Button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {switchable ? (
                  <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                    {theme === "dark" ? (
                      <i className="fa-solid fa-sun mr-2 text-sm" aria-hidden="true" />
                    ) : (
                      <i className="fa-solid fa-moon mr-2 text-sm" aria-hidden="true" />
                    )}
                    <span>{theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2 text-sm" aria-hidden="true" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {!isMobile && (
          <div className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-[5px] border border-border bg-background" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">
                  {activeMenuItem?.label ?? "Dashboard"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Acompanhe as atividades mais recentes
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <i
                  className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Buscar no painel"
                  className="h-9 w-56 pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Notificações"
                >
                  <i className="fa-solid fa-bell text-sm" aria-hidden="true" />
                </Button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] text-sm font-semibold transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground disabled:border-[#e0e0e0] disabled:text-[#424242] disabled:bg-[#fcfbfb] size-10 h-9 w-9"
                  aria-label="Configurações"
                  onClick={() => setLocation("/admin/modules")}
                >
                  <i className="fa-solid fa-gear text-sm" aria-hidden="true" />
                </button>
                {switchable ? (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={toggleTheme}
                    aria-label="Alternar tema"
                  >
                    {theme === "dark" ? (
                      <i className="fa-solid fa-sun text-sm" aria-hidden="true" />
                    ) : (
                      <i className="fa-solid fa-moon text-sm" aria-hidden="true" />
                    )}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? "Menu"}
                  </span>
                </div>
              </div>
            </div>
            {switchable ? (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={toggleTheme}
                aria-label="Alternar tema"
              >
                {theme === "dark" ? (
                  <i className="fa-solid fa-sun text-sm" aria-hidden="true" />
                ) : (
                  <i className="fa-solid fa-moon text-sm" aria-hidden="true" />
                )}
              </Button>
            ) : null}
          </div>
        )}
        <main className="flex-1 p-4 sm:p-6 page-fade-in">{children}</main>
      </SidebarInset>
    </>
  );
}
