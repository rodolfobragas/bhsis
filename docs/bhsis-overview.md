# BHSIS Overview

## Visao geral
O BHSIS e um CRM modular com uma aplicacao web unica que inclui backend e frontend no mesmo projeto. 
O sistema centraliza autenticacao, cadastros, operacoes e modulos configuraveis por perfil.

## Modulos e responsabilidades
- **BHSIS App**: aplicacao principal (web + API) com autenticação, gestão e operações.
- **Database**: migrations Prisma para PostgreSQL (schema `bhsis`).
- **Redis**: cache/filas internas (quando habilitado).
- **Docker Stack**: orquestra backend + banco + redis para ambiente local.

## Tecnologias principais
- **Node.js / TypeScript**
- **React + Vite** (frontend)
- **Express + Socket.IO** (backend)
- **Prisma** (ORM)
- **PostgreSQL**
- **Redis**
- **Docker**

## Arquitetura resumida
```
[App]
- bhsis (frontend + backend)

[Infra]
- postgres
- redis
```

## Ports principais
- Dev (pnpm dev): `3000`
- Docker backend: `3001`
- Postgres: `5432`
- Redis: `6379`

## Documentacao principal
- `docs/bhsis-app.md`
- `docs/bhsis-database.md`
- `docs/bhsis-docker.md`
- `docs/containers.md`
