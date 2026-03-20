import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import apiService from "@/services/api";
import { toast } from "sonner";

type ModuleItem = {
  id: string;
  key: string;
  label: string;
  description?: string | null;
  premium: boolean;
  active: boolean;
  accesses: { role: string; enabled: boolean }[];
};

type ModuleRole = "ADMIN" | "MANAGER" | "KITCHEN" | "ATTENDANT" | "CUSTOMER";

const ROLE_LABELS: { role: ModuleRole; label: string }[] = [
  { role: "ADMIN", label: "Admin" },
  { role: "MANAGER", label: "Gerente" },
  { role: "KITCHEN", label: "Cozinha" },
  { role: "ATTENDANT", label: "Atendimento" },
  { role: "CUSTOMER", label: "Cliente" },
];

export default function AdminModuleAccess() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [pendingModules, setPendingModules] = useState<ModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [tierFilter, setTierFilter] = useState<"all" | "premium" | "standard">("all");
  const [groupBy, setGroupBy] = useState<"status" | "tier" | "none">("status");

  const normalizeAccesses = (items: ModuleItem[]) =>
    items.map((module) => {
      const accessMap = new Map(
        module.accesses.map((access) => [access.role, access.enabled])
      );
      return {
        ...module,
        accesses: ROLE_LABELS.map(({ role }) => ({
          role,
          enabled: accessMap.get(role) ?? false,
        })),
      };
    });

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getModules();
      const normalized = normalizeAccesses(data);
      setModules(normalized);
      setPendingModules(normalized);
    } catch (error) {
      toast.error("Falha ao carregar módulos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleToggleModule = (id: string, active: boolean) => {
    setPendingModules((prev) => prev.map((item) => (item.id === id ? { ...item, active } : item)));
  };

  const handleToggleAccess = (moduleId: string, role: ModuleRole, enabled: boolean) => {
    setPendingModules((prev) =>
      prev.map((item) => {
        if (item.id !== moduleId) return item;
        return {
          ...item,
          accesses: item.accesses.map((access) =>
            access.role === role ? { ...access, enabled } : access
          ),
        };
      })
    );
  };

  const hasAccessChanges = (current: ModuleItem, pending: ModuleItem) => {
    if (current.accesses.length !== pending.accesses.length) return true;
    return pending.accesses.some((access) => {
      const currentAccess = current.accesses.find((item) => item.role === access.role);
      return (currentAccess?.enabled ?? false) !== access.enabled;
    });
  };

  const hasPendingChanges = useMemo(() => {
    if (modules.length !== pendingModules.length) return true;
    return pendingModules.some((pending) => {
      const current = modules.find((item) => item.id === pending.id);
      if (!current) return true;
      return current.active !== pending.active || hasAccessChanges(current, pending);
    });
  }, [modules, pendingModules]);

  const handleSaveConfig = async () => {
    if (!hasPendingChanges) return;
    try {
      setIsSavingConfig(true);
      const updates = pendingModules.filter((pending) => {
        const current = modules.find((item) => item.id === pending.id);
        return !current || current.active !== pending.active;
      });
      const accessUpdates = pendingModules.filter((pending) => {
        const current = modules.find((item) => item.id === pending.id);
        if (!current) return pending.accesses.length > 0;
        return hasAccessChanges(current, pending);
      });
      await Promise.all(
        [
          ...updates.map((module) =>
            apiService.updateModule(module.id, {
              key: module.key,
              label: module.label,
              description: module.description ?? null,
              premium: module.premium,
              active: module.active,
            })
          ),
          ...accessUpdates.map((module) =>
            apiService.updateModuleAccess(
              module.id,
              module.accesses.map((access) => ({
                role: access.role,
                enabled: access.enabled,
              }))
            )
          ),
        ]
      );
      toast.success("Configurações atualizadas");
      loadModules();
    } catch (error) {
      toast.error("Falha ao salvar configurações");
      console.error(error);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const filteredModules = useMemo(() => {
    const query = search.trim().toLowerCase();
    return pendingModules.filter((module) => {
      if (statusFilter === "active" && !module.active) return false;
      if (statusFilter === "inactive" && module.active) return false;
      if (tierFilter === "premium" && !module.premium) return false;
      if (tierFilter === "standard" && module.premium) return false;
      if (!query) return true;
      return (
        module.label.toLowerCase().includes(query) ||
        module.key.toLowerCase().includes(query) ||
        (module.description ?? "").toLowerCase().includes(query)
      );
    });
  }, [pendingModules, search, statusFilter, tierFilter]);

  const groupedModules = useMemo(() => {
    if (groupBy === "status") {
      return [
        { title: "Ativos", items: filteredModules.filter((module) => module.active) },
        { title: "Inativos", items: filteredModules.filter((module) => !module.active) },
      ];
    }
    if (groupBy === "tier") {
      return [
        { title: "Premium", items: filteredModules.filter((module) => module.premium) },
        { title: "Padrão", items: filteredModules.filter((module) => !module.premium) },
      ];
    }
    return [{ title: "Todos", items: filteredModules }];
  }, [filteredModules, groupBy]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Painel de Acesso a Módulos</CardTitle>
          <CardDescription>
            Configure quais módulos estão ativos e gerencie a assinatura do cliente.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Módulos cadastrados</CardTitle>
          <CardDescription>Habilite ou desabilite módulos e salve as configurações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLoading && pendingModules.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                onClick={handleSaveConfig}
                disabled={!hasPendingChanges || isSavingConfig}
              >
                {isSavingConfig ? "Salvando..." : "Salvar configurações"}
              </Button>
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-[1.2fr_auto_auto] md:items-center">
            <div>
              <label className="text-xs text-muted-foreground">Busca</label>
              <Input
                className="mt-2"
                placeholder="Filtrar por nome, chave ou descrição"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Status</p>
              <ToggleGroup
                type="single"
                value={statusFilter}
                onValueChange={(value) => setStatusFilter((value as typeof statusFilter) || "all")}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="all">Todos</ToggleGroupItem>
                <ToggleGroupItem value="active">Ativos</ToggleGroupItem>
                <ToggleGroupItem value="inactive">Inativos</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Assinatura</p>
              <ToggleGroup
                type="single"
                value={tierFilter}
                onValueChange={(value) => setTierFilter((value as typeof tierFilter) || "all")}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="all">Todos</ToggleGroupItem>
                <ToggleGroupItem value="premium">Premium</ToggleGroupItem>
                <ToggleGroupItem value="standard">Padrão</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Agrupar por</p>
              <ToggleGroup
                type="single"
                value={groupBy}
                onValueChange={(value) => setGroupBy((value as typeof groupBy) || "status")}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="status">Status</ToggleGroupItem>
                <ToggleGroupItem value="tier">Assinatura</ToggleGroupItem>
                <ToggleGroupItem value="none">Nenhum</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <p className="text-xs text-muted-foreground">
              Exibindo {filteredModules.length} de {pendingModules.length} módulos
            </p>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando módulos...</p>
          ) : pendingModules.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum módulo cadastrado.</p>
          ) : filteredModules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum módulo encontrado com os filtros atuais.
            </p>
          ) : (
            groupedModules.map((group) => (
              <div key={group.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{group.title}</p>
                  <span className="text-xs text-muted-foreground">{group.items.length} módulos</span>
                </div>
                {group.items.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhum módulo neste grupo.</p>
                ) : (
                  group.items.map((module) => (
                    <div
                      key={module.id}
                      className="flex flex-col gap-3 rounded-lg border border-input p-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {module.label}{" "}
                          <span className="text-xs text-muted-foreground">({module.key})</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {module.premium ? "Premium" : "Padrão"} • {module.active ? "Ativo" : "Inativo"}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {ROLE_LABELS.map(({ role, label }) => {
                            const access = module.accesses.find((item) => item.role === role);
                            const enabled = access?.enabled ?? false;
                            return (
                              <div
                                key={`${module.id}-${role}`}
                                className="flex items-center gap-2 rounded-full border border-input px-3 py-1 text-xs"
                              >
                                <span className="text-muted-foreground">{label}</span>
                                <Switch
                                  checked={enabled}
                                  onCheckedChange={(checked) =>
                                    handleToggleAccess(module.id, role, checked)
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2 md:w-56">
                        <div>
                          <p className="text-xs text-muted-foreground">Disponibilidade</p>
                          <p className="text-sm font-medium">
                            {module.active ? "Habilitado" : "Desabilitado"}
                          </p>
                        </div>
                        <Switch
                          checked={module.active}
                          onCheckedChange={(checked) => handleToggleModule(module.id, checked)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))
          )}
          {!isLoading && pendingModules.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                onClick={handleSaveConfig}
                disabled={!hasPendingChanges || isSavingConfig}
              >
                {isSavingConfig ? "Salvando..." : "Salvar configurações"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
