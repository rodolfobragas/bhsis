import prisma from "../config/database";
import { UserRole } from "@prisma/client";

export type ModuleInput = {
  key: string;
  label: string;
  description?: string | null;
  premium?: boolean;
  active?: boolean;
  accesses?: { role: UserRole; enabled: boolean }[];
};

const DEFAULT_MODULES: ModuleInput[] = [
  { key: "food", label: "Food", premium: true },
  { key: "agro", label: "Agro", premium: true },
  { key: "saloes", label: "Salões", premium: true },
  { key: "clinicas", label: "Clínicas", premium: true },
  { key: "shop", label: "Shop", premium: true },
  { key: "pet", label: "Pet", premium: true },
  { key: "cadastro", label: "Cadastro" },
  { key: "faturamento", label: "Faturamento" },
  { key: "pdv", label: "PDV" },
  { key: "financeiro", label: "Financeiro" },
  { key: "fiscal", label: "Fiscal" },
  { key: "estoque", label: "Estoque" },
  { key: "producao", label: "Produção" },
  { key: "delivery", label: "Delivery" },
  { key: "relatorios", label: "Relatórios" },
];

const DEFAULT_ACCESS_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.KITCHEN,
  UserRole.ATTENDANT,
  UserRole.CUSTOMER,
];

class ModuleService {
  async listModules() {
    await this.ensureDefaults();
    return prisma.module.findMany({
      orderBy: { label: "asc" },
      include: { accesses: true },
    });
  }

  async listAccessForRole(role: UserRole) {
    await this.ensureDefaults();
    const modules = await prisma.module.findMany({
      where: { active: true },
      include: { accesses: { where: { role } } },
      orderBy: { label: "asc" },
    });

    return modules.map((module) => ({
      key: module.key,
      label: module.label,
      premium: module.premium,
      active: module.active,
      enabled: module.accesses[0]?.enabled ?? false,
    }));
  }

  async createModule(input: ModuleInput) {
    const accesses = input.accesses ?? this.buildDefaultAccesses();
    return prisma.module.create({
      data: {
        key: input.key,
        label: input.label,
        description: input.description ?? null,
        premium: input.premium ?? false,
        active: input.active ?? true,
        accesses: {
          create: accesses.map((access) => ({
            role: access.role,
            enabled: access.enabled,
          })),
        },
      },
      include: { accesses: true },
    });
  }

  async updateModule(id: string, input: ModuleInput) {
    return prisma.module.update({
      where: { id },
      data: {
        key: input.key,
        label: input.label,
        description: input.description ?? null,
        premium: input.premium ?? false,
        active: input.active ?? true,
      },
      include: { accesses: true },
    });
  }

  async updateModuleAccess(id: string, accesses: { role: UserRole; enabled: boolean }[]) {
    const module = await prisma.module.findUnique({ where: { id } });
    if (!module) throw new Error("Module not found");

    for (const access of accesses) {
      await prisma.moduleAccess.upsert({
        where: {
          moduleId_role: {
            moduleId: id,
            role: access.role,
          },
        },
        update: {
          enabled: access.enabled,
        },
        create: {
          moduleId: id,
          role: access.role,
          enabled: access.enabled,
        },
      });
    }

    return prisma.module.findUnique({ where: { id }, include: { accesses: true } });
  }

  async deleteModule(id: string) {
    return prisma.module.delete({ where: { id } });
  }

  private buildDefaultAccesses() {
    return DEFAULT_ACCESS_ROLES.map((role) => ({
      role,
      enabled: role === UserRole.ADMIN,
    }));
  }

  private async ensureDefaults() {
    const count = await prisma.module.count();
    if (count > 0) return;

    for (const module of DEFAULT_MODULES) {
      await this.createModule(module);
    }
  }
}

export default new ModuleService();
