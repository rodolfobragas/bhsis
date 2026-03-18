## Documentação da Implantação do Sistema

### Visão geral
O Marmitex System está organizado como um painel administrativo único, com o módulo **Food** já funcional (pedidos, mesas, cupons, fidelidade, pagamentos e alertas). Os outros módulos já foram estruturados na sidebar e entregam rotas placeholder; sua implementação completa (UI, lógica e integrações) ainda está em andamento.

### Módulos entregues (interface + placeholder)
- Food (funcional): Dashboard, Pedidos, Pagamentos, Alertas, Fidelidade, Cupons, Mesas.
- Cadastro: Produto, Participante, Fiscal, Financeiro, Caixa Venda, Usuário, Veículo, Setor.
- Faturamento: Notas Fiscais Eletrônicas/NFSe/Fiscal (MDFe, CTe, CTe OS), Orçamento, Condicional, Pedido de Venda, Ordem de Serviço, Venda Futura, Venda Externa, Geração/Reajuste Contrato, Romaneiro, Importação XML.
- PDV: Caixa, Vendas, Configuração.
- Entrada de Nota: Cadastro, Consulta, Importações, Tributação.
- Documentos Recebidos, Assinador, Financeiro, Fiscal, Estoque, Produção, Delivery, Relatórios.

### Módulos em desenvolvimento
- Financeiro (fluxos reais de caixa/boletos/lancamentos/integrações).
- Faturamento (execução das regras fiscais, emissão/integração NFCe/NFe/CTe).
- Entrada de Nota e PDV (sincronização com back-end, NFCe real, contingências).
- Documentos Recebidos, Pedido de Compra, Assinador, Estoque, Produção, Delivery e Relatórios (camadas de dados e lógica ainda pendentes).

### Checklist atual (estado + responsável)
1. `Food` – Status: Concluído. Deploy em produção; monitorar erros operacionais. Responsável: equipe Marmitex.
2. `Cadastro` – Status: Em andamento. Interfaces existenciais; falta conectar APIs e validações. Próximo passo: conectar cada submenu às APIs. Responsável: time de UI.
3. `Faturamento/Financeiro/PDV` – Status: Em andamento. Estrutura de menus pronta; implementar regras fiscais, emissão de documentos e integrações com os serviços financeiros. Próximo passo: conectar com a API típica (NFe, NFCe, boletos). Responsável: engenharia fiscal/financeira.
4. `Infraestrutura Docker` – Status: Concluído. Compose com imagens atualizadas até `marmitex-system-v1.0.26`; lembrar de versionar imagem a cada release.
5. `Documentação & Roadmap` – Status: Em andamento. Atualizar roadmap com novas prioridades conforme implementações avança; revisar `docs/system-implementation.md`.

### Roadmap para implantação
1. **Fase 1 (até +2 semanas)** – Criar integração real de `Cadastro`, `PDV` e `Entrada de Nota` com APIs (autenticação, persistência). Validar fluxos de auth e dados do backend atual. Dependência: APIs existentes do Marmitex.
2. **Fase 2 (até +4 semanas)** – Implementar regras de emissão fiscal (NFe/NFSe/CTe, boletos). Harmonizar menus de Faturamento/Financeiro com fluxos fiscais reais. Dependência: certificados digitais, Webservices da SEFAZ e bancos.
3. **Fase 3 (até +6 semanas)** – Completar módulos restantes (Estoques, Produção, Delivery, Relatórios) com dados reais; adicionar monitoramento e testes integrados. Dependência: dados de inventário, infra de tracking.
4. **Fase 4 (contínuo)** – Entrega incremental de melhorias visuais (experiências mobile), testes automatizados e deploy de novas imagens Docker a cada release.

### Próximos passos recomendados
- Documentar endpoints críticos (API Core, tracking, PDV) e alinhar com times responsáveis.
- Criar tickets para conectar cada submenu aos dados reais, priorizando os módulos de maior impacto (PDV/Financeiro/Faturamento).
- Estabelecer rotina de release (ex.: versão Docker + documentação) para manter o `docs/system-implementation.md` e o `docker-compose` em sincronia.
