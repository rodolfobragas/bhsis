## Documentação da Implantação do Sistema (BHSIS)

### Visão geral
O BHSIS está organizado como um painel administrativo único. O módulo **Food** é o mais completo hoje (pedidos, pagamentos, cupons, fidelidade, mesas e alertas). Os demais módulos estão estruturados no menu e muitos ainda usam telas placeholder; a implementação completa (UI, lógica e integrações) está em evolução.

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
1. `Food` – Status: Em andamento. Fluxos principais estão ativos; revisar estabilidade e cobertura. Responsável: equipe BHSIS.
2. `Cadastro` – Status: Em andamento. Interfaces existem; falta integração total com APIs. Próximo passo: conectar cada submenu às APIs. Responsável: time de UI.
3. `Faturamento/Financeiro/PDV` – Status: Em andamento. Estrutura de menus pronta; implementar regras fiscais/financeiras e integrações. Responsável: engenharia fiscal/financeira.
4. `Infraestrutura Docker` – Status: Concluído. Stack local em `bhsis/docker-compose.yml`. Responsável: DevOps.
5. `Documentação & Roadmap` – Status: Em andamento. Atualizar doc conforme releases e mudanças.

### Roadmap para implantação
1. **Fase 1 (curto prazo)** – Integrar `Cadastro`, `PDV` e `Entrada de Nota` com APIs e validações.
2. **Fase 2 (médio prazo)** – Implementar regras fiscais (NFe/NFSe/CTe, boletos).
3. **Fase 3 (médio prazo)** – Completar Estoque, Produção, Delivery, Relatórios com dados reais.
4. **Fase 4 (contínuo)** – Melhorias de UX, testes automatizados e releases versionadas.

### Próximos passos recomendados
- Documentar endpoints críticos e alinhar responsáveis por módulo.
- Priorizar integração real de `Cadastro`, `PDV`, `Financeiro` e `Faturamento`.
- Padronizar releases (tag + documentação).
