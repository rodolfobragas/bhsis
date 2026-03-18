# BHSIS API Core

## Objetivo (CRM)
Serviço central de APIs REST e WebSocket. No contexto CRM, concentra dados mestres (contatos, contas, tickets), integrações e eventos em tempo real para o ecossistema BHSIS.

## Responsabilidades
- Expor endpoints REST usados pelos frontends.
- Consolidar regras de negócio e orquestração de módulos.
- Publicar eventos em tempo real via WebSocket.
- Documentação automática via Swagger (`/docs`).

## Tecnologias
- NestJS
- TypeORM
- Swagger (OpenAPI)
- WebSocket (Socket.IO)
- Redis (BullMQ para filas)
- PostgreSQL/PostGIS

## Estrutura
- `src/`: módulos, controllers e providers.
- `tsconfig*.json`: build/TypeScript.
- `Dockerfile`: build de imagem.

## Execução local
```bash
cp .env.example .env
npm install
npm run start:dev
```

## Build
```bash
npm run build
npm run start
```

## Variáveis de ambiente (principais)
- `DATABASE_*`: conexão com PostgreSQL/PostGIS.
- `REDIS_*`: Redis para filas.
- `GRAPHOPPER_VRP_URL`: endpoint de roteirização (se usado).
- `TRACCAR_WEBHOOK_SECRET`: validação de webhooks (se usado).
- `PORT`: porta do serviço (padrão 4000 no docker-compose).

## Porta e endpoints
- Porta padrão no compose: `4000`.
- Swagger: `http://localhost:4000/docs`.
- WebSocket: namespace de tracking em `/tracking` (para dashboards em tempo real).

## Observações de migração
Os nomes e endpoints originalmente de entrega devem ser reinterpretados para entidades CRM (ex.: entregas -> tickets/atividades, motoboy -> agente/representante).
