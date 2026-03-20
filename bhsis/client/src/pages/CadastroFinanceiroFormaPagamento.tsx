import CadastroModuleShell from "@/components/cadastro/CadastroModuleShell";

export default function CadastroFinanceiroFormaPagamento() {
  return (
    <CadastroModuleShell
      title="Cadastro - Financeiro - Forma de Pagamento"
      description="Cadastro de formas de pagamento."
      sections={[
        {
          title: "Objetivo",
          items: [
            "Padronizar o cadastro e garantir consistencia dos dados.",
            "Registrar informacoes essenciais do modulo.",
          ],
        },
        {
          title: "Operacoes",
          items: [
            "Cadastrar novos registros.",
            "Consultar e filtrar registros existentes.",
            "Atualizar e inativar dados quando necessario.",
          ],
        },
        {
          title: "Validacoes",
          items: [
            "Campos obrigatorios devem ser preenchidos.",
            "Validar formatos e duplicidades criticas.",
          ],
        },
        {
          title: "Integracoes",
          items: [
            "Conectar com APIs e relatorios relacionados.",
            "Sincronizar com modulos dependentes.",
          ],
        },
      ]}
    />
  );
}
