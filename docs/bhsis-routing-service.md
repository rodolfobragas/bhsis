# BHSIS Routing Service

## Objetivo (CRM)
Worker de otimização de rotas e agendas para visitas de campo (quando o módulo de field service estiver ativo).

## Tecnologias
- Node.js
- Express
- BullMQ
- Redis
- PostgreSQL/PostGIS
- GraphHopper (VRP)

## Execução local
```bash
cp .env.example .env
npm install
npm run dev
```

## Endpoints
- `/health`

## Variáveis de ambiente
- `DATABASE_*`, `REDIS_*`, `GRAPHOPPER_VRP_URL`
