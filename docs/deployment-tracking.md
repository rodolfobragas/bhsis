# Deployment Tracking & Process Guide

> **Nota**: Este documento refere-se à stack legada de delivery/motoboy.  
> Para o BHSIS atual, use `docs/bhsis-app.md`, `docs/bhsis-docker.md`, `docs/bhsis-database.md` e `docs/containers.md`.

## Objetivo
Este documento orienta a implantação do sistema de gestão de entregas modulado para motoboys. Ele deve ser atualizado por qualquer modelo/tecnico que trabalhar no projeto para indicar exatamente em que estágio estamos e quais entregas ainda faltam.

## Como manter o rastreio (multi-IA friendly)
1. **Status Padronizado** – use apenas os rótulos: `Não iniciado`, `Em andamento`, `Bloqueado`, `Concluído`, `Aguardando revisão`. Nenhum outro termo deve ser usado na coluna "Status".
2. **Timestamp e Responsável** – toda alteração em uma linha deve ser acompanhada de data (formato ISO 8601) e nome/identificador do agente humano/IA responsável.
3. **Atualização Atômica** – se apenas um campo muda (ex.: próximo passo ou dependência), atualize apenas ele e documente a mudança na seção “Notas recentes”.
4. **Formato Legível/Parseável** – tabelas e listas seguem Markdown simples; colunas fixas facilitam o parsing. Sistemas automatizados podem escanear a primeira tabela e ler colunas nomeadas consistentemente.

## Visão geral do pipeline de implantação
| Módulo | Descrição | Status | Dependências | Próximos passos | Última atualização |
| ------ | --------- | ------ | ------------ | --------------- | ------------------ |
| API Core (NestJS) | API REST com endpoints de entregas, rotas, motoboys e dashboard, documentada com Swagger. | Em andamento | PostgreSQL, PostGIS, Redis, Graphhopper, Traccar | scaffold NestJS + entidades + Swagger | 2026-03-16T12:00:00Z (Codex) |
| Routing Service | Serviço dedicado a otimização usando Graphhopper VRP e BullMQ. | Em andamento | API Core, Graphhopper, Redis | scaffold Node.js + integração Graphhopper DRP | 2026-03-16T13:15:00Z (Codex) |
| Tracking Service | Consumidor dos webhooks do Traccar que grava posições e emite eventos WebSocket. | Em andamento | Traccar, Redis/BullMQ, PostGIS | endpoint /tracking/update, WebSocket e fila de notificações | 2026-03-16T15:10:00Z (Codex) |
| Notification Service | Serviço desacoplado que envia notificações por WhatsApp/SMS/push e processa filas. | Em andamento | Redis/BullMQ, API Core | scaffolding de worker BullMQ + canais WhatsApp/SMS/push | 2026-03-16T16:05:00Z (Codex) |
| Dashboard Web (React + Vite) | Frontend com Leaflet, métricas em tempo real e integração WebSocket. | Em andamento | API Core (WebSocket/REST), mapas OSM | Layout inicial, conexão socket e tiles OSM | 2026-03-16T17:00:00Z (Codex) |
| Motoboy App (PWA) | Aplicação PWA para motoboys com rotas ordenadas, status e notificações. | Em andamento | API Core, Routing Service, Tracking Service | PWA com login, botões e service worker | 2026-03-16T17:00:00Z (Codex) |
| Infraestrutura (Docker Compose) | Ambientes containers (Postgres/PostGIS, Redis, Traccar, Graphhopper, microserviços, frontend). | Em andamento | Imagens oficiais, configuração de redes | docker-compose completo + scripts auxiliares | 2026-03-16T17:30:00Z (Codex) |
| Dados (migrations & seed) | Migrations para as tabelas principais + scripts de seed. | Em andamento | API Core, PostgreSQL | criar migrations, fixtures e seeds | 2026-03-16T18:10:00Z (Codex) |

## Dependências externas e integrações
- **Traccar (GPS)** – precisa de container que aponte webhook para `POST /tracking/update`; configure credenciais por ambiente.
- **Graphhopper VRP** – rodar container com dados do Brasil; a API de roteirização é consumida pelo `routing-service` via BullMQ/HTTP.
- **OpenStreetMap** – usado pelos frontends (dashboard + PWA) via Leaflet; tiles servidos pelo providers compatíveis (ex.: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).

## Filas e Processamento assíncrono
Use Redis + BullMQ para:
- Recalcular rotas pendentes ou quando status muda.
- Enfileirar notificações (WhatsApp/SMS/push) para clientes.
- Processar webhooks/tracking sem bloquear API.

Cada serviço que utiliza filas deve documentar o nome da fila e o payload esperado (ex.: `rotas.otimizar`, `notificacoes.cliente`).

## Observações operacionais
- O `docker compose up` deve levantar todos os containers na ordem correta; o `docker/` deve conter Dockerfiles e scripts auxiliares.
- Documente as variáveis de ambiente necessárias por serviço em arquivos `.env.example` dentro de cada diretório de serviço.
- Cada serviço deve expor health check básico (`/health` ou equivalente) para facilitar orquestração.

## Checklist de Implantação (atualize conforme concluído)
1. [ ] Scaffold inicial dos microserviços (NestJS, Node, etc.)
2. [ ] Configuração do banco PostgreSQL com PostGIS e migrations base
3. [ ] Integração com Graphhopper (VRP) e Traccar (webhook)
4. [ ] Implementação das filas Redis/BullMQ e workers
5. [ ] Frontend React com Leaflet + WebSocket em tempo real
6. [ ] PWA do motoboy com roteiros e botões principais
7. [ ] Documentação Swagger e README com instruções completas
8. [ ] Docker Compose orquestrando tudo + scripts de seed
9. [ ] Testes básicos de fluxo (registro de entrega, roteirização, tracking)

## Como colaborar com múltiplos AIs ou squad
- Antes de iniciar a implementação de um módulo, atualize o status na tabela principal com data e responsável.
- Cada commit ou alteração significativa deve incluir referência à linha/número do módulo atualizado e o número da issue/tarefa (quando houver).
- Use observações em `## Notas recentes` para registrar bloqueios, dúvidas ou decisões.

## Notas recentes
- 2026-03-17T14:20:00Z (Codex): Fidelidade ganhou níveis/benefícios + notificações e mesas agora registram ocupação/turnover no painel.
- 2026-03-17T13:03:47Z (Codex): PWA básica (manifest + SW) adicionada e estrutura inicial do app mobile documentada.
- 2026-03-17T12:58:07Z (Codex): Fase 6 UX/UI concluída (responsividade, animações leves, feedback e acessibilidade básica).
- 2026-03-17T12:47:14Z (Codex): Imagem v1.0.9 publicada com menu Pagamentos, histórico e reembolsos; tema com toggle.
- 2026-03-17T12:42:53Z (Codex): Fase 6 iniciada com tema light/dark (toggle) e menu Pagamentos + página de histórico/reembolso.
- 2026-03-17T12:25:20Z (Codex): Reembolso Stripe + relatório de receita + histórico de pagamentos (UI) implementados.
- 2026-03-17T12:13:15Z (Codex): Stripe integrado no Marmitex (session/intent + webhook + tabela payments + paymentStatus em pedidos).
- 2026-03-17T11:22:54Z (Codex): Login admin corrigido (client aponta para `/api` no mesmo host; verificação de role agora é case-insensitive) e nova imagem `rodolfobragas/bhsis:marmitex-system-v1.0.6` preparada para deploy.
- 2026-03-16T14:00:00Z (Codex): completado scaffold do routing service com worker BullMQ, Graphhopper e health check.
- 2026-03-16T12:05:00Z (Codex): iniciado scaffold do api-core NestJS com endpoints basicos e estrutura de modulos.
- 2026-03-16T13:17:00Z (Codex): começando implementação do routing service para integrar com Graphhopper e filas BullMQ.
- 2026-03-16T15:20:00Z (Codex): tracking service concluído com webhook Traccar, endpoint motoboy/localizacao, websockets e fila de notificações.
- 2026-03-16T16:10:00Z (Codex): notification service criado com worker BullMQ e canais simulados (WhatsApp/SMS/push).
- 2026-03-16T17:35:00Z (Codex): frontends dashboard e motoboy prontos em Vite e infraestrutura Docker Compose com Graphhopper, Traccar e serviços principais.
- 2026-03-16T18:15:00Z (Codex): iniciados migrations e seeds SQL para PostGIS, com scripts de execução para iniciar o banco.
- 2026-03-17T03:13:54Z (Codex): testes vitest executados no Marmitex e imagem `rodolfobragas/bhsis:marmitex-system-v1.0.1` publicada no Docker Hub; docker compose atualizado.
- 2026-03-17T03:27:15Z (Codex): Fase 4 do Marmitex finalizada (filtros, analytics, relatórios e auto-refresh) e documentação atualizada.
- 2026-03-17T03:30:13Z (Codex): nova imagem `rodolfobragas/bhsis:marmitex-system-v1.0.2` publicada após testes; docker compose atualizado.
- 2026-03-17T03:44:07Z (Codex): Fase 5 concluída para cupons, fidelidade e mesas (Stripe adiado); rotas e telas administrativas adicionadas.
- 2026-03-17T03:48:58Z (Codex): testes executados e imagem `rodolfobragas/bhsis:marmitex-system-v1.0.3` publicada no Docker Hub.
- 2026-03-17T10:30:32Z (Codex): admin integrado ao backend real (auth, produtos, clientes, pedidos, inventário e alertas).
- 2026-03-17T10:39:48Z (Codex): KDS conectado ao WebSocket real, receitas integradas ao backend e client com retry/timeout/erros HTTP.
- 2026-03-17T10:43:19Z (Codex): testes executados e imagem `rodolfobragas/bhsis:marmitex-system-v1.0.4` publicada no Docker Hub; compose atualizado.
- 2026-03-17T10:54:43Z (Codex): migrations Prisma aplicadas contra Postgres local (5433); nenhuma pendente.
- 2026-03-17T10:56:54Z (Codex): drift detectado no Prisma; `db push` sincronizou schema `marmitex` e endpoints de health/products/recipes responderam 200.

> **Dica**: Mantenha esta documentação viva. Um novo bloco deve ser adicionado ao final sempre que uma IA ou desenvolvedor concluir um passo crítico ou esbarrar em um bloqueio.
