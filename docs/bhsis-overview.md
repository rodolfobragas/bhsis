# BHSIS Overview

## Visao geral
O BHSIS e um CRM modular com uma aplicacao web unica que inclui backend e frontend no mesmo projeto. 
O sistema centraliza autenticacao, cadastros, operacoes e modulos configuraveis por perfil.

## Estado atual (2026-03-21)
- Backend em Docker operando em `http://localhost:3001`.
- Auth e Food em bancos separados.
- Menu lateral com busca e ordenação alfabética.

## Modulos e responsabilidades
- **BHSIS App**: aplicacao principal (web + API) com autenticação, gestão e operações.
- **Database**: um banco por módulo (Auth isolado em `auth_db`).
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
- postgres (um DB por módulo)
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
