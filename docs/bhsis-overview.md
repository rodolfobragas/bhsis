# BHSIS Overview

## Visao geral
O BHSIS e um CRM completo construido sobre uma arquitetura modular. O sistema unifica cadastro de clientes, gestao de contas, pipeline, atendimentos, atividades e integracoes em um ecossistema composto por apps web e microservicos.

## Modulos e responsabilidades
- **BHSIS App (antigo marmitex-system)**: aplicacao principal do CRM com autenticacao, gerenciamento e operacoes do dia a dia.
- **API Core**: back-end principal com endpoints REST, WebSocket e Swagger.
- **Dashboard Web**: painel analitico e de monitoramento para liderancas e operacoes.
- **Field App (antigo motoboy-app)**: app leve para agentes de campo, visitas e tarefas externas.
- **Notification Service**: processamento assincrono de notificacoes por filas.
- **Tracking Service**: tracking em tempo real de agentes e eventos em campo.
- **Routing Service**: otimizacao de rotas e agendas quando o modulo de field service estiver ativo.
- **Database**: scripts de migrations e seeds para PostgreSQL/PostGIS.
- **Docker Stack**: orquestracao da pilha completa para ambientes locais.

## Tecnologias principais
- **Node.js / TypeScript**
- **NestJS** (API Core)
- **React + Vite** (Frontends)
- **Prisma / TypeORM** (ORM)
- **PostgreSQL/PostGIS**
- **Redis + BullMQ**
- **Socket.IO**
- **Docker**

## Arquitetura resumida
```
[Frontends]
- bhsis-app (web principal)
- dashboard-web
- field-app

[Backend]
- api-core (REST/WS)
- tracking-service (WS)
- routing-service (worker)
- notification-service (worker)

[Infra]
- postgres/postgis
- redis
```

## Ports principais (docker-compose)
- `3000` BHSIS App
- `4000` API Core
- `4173` Dashboard Web
- `4174` Field App
- `3002` Tracking Service
- `3021` Routing Service
- `3010` Notification Service

## Documentacao por modulo
- `docs/bhsis-app.md`
- `docs/bhsis-api-core.md`
- `docs/bhsis-dashboard-web.md`
- `docs/bhsis-field-app.md`
- `docs/bhsis-notification-service.md`
- `docs/bhsis-tracking-service.md`
- `docs/bhsis-routing-service.md`
- `docs/bhsis-database.md`
- `docs/bhsis-docker.md`
