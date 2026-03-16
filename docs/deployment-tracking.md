# Deployment Tracking & Process Guide

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
- 2026-03-16T14:00:00Z (Codex): completado scaffold do routing service com worker BullMQ, Graphhopper e health check.
- 2026-03-16T12:05:00Z (Codex): iniciado scaffold do api-core NestJS com endpoints basicos e estrutura de modulos.
- 2026-03-16T13:17:00Z (Codex): começando implementação do routing service para integrar com Graphhopper e filas BullMQ.
- 2026-03-16T15:20:00Z (Codex): tracking service concluído com webhook Traccar, endpoint motoboy/localizacao, websockets e fila de notificações.
- 2026-03-16T16:10:00Z (Codex): notification service criado com worker BullMQ e canais simulados (WhatsApp/SMS/push).
- 2026-03-16T17:35:00Z (Codex): frontends dashboard e motoboy prontos em Vite e infraestrutura Docker Compose com Graphhopper, Traccar e serviços principais.
- 2026-03-16T18:15:00Z (Codex): iniciados migrations e seeds SQL para PostGIS, com scripts de execução para iniciar o banco.

> **Dica**: Mantenha esta documentação viva. Um novo bloco deve ser adicionado ao final sempre que uma IA ou desenvolvedor concluir um passo crítico ou esbarrar em um bloqueio.
