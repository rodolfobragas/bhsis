# Containers do Projeto (Atualizado)

Este documento descreve os containers usados no **BHSIS** e diferencia a stack principal (atual) da stack legada/infra estendida.

## Stack BHSIS (atual) — `bhsis/docker-compose.yml`

### postgres
Função: banco principal do BHSIS.

Configuração:
```txt
image: postgres:15-alpine
container_name: bhsis-postgres
ports: 5432:5432
volumes: postgres_data:/var/lib/postgresql/data
healthcheck: pg_isready -U bhsis
```
Variáveis:
```env
POSTGRES_DB=bhsis
POSTGRES_USER=bhsis
POSTGRES_PASSWORD=bhsis_password
```
Observações:
- Schema usado: `bhsis`
- O `DATABASE_URL` do backend precisa apontar para esse banco e schema.

### redis
Função: cache/filas (BullMQ).

Configuração:
```txt
image: redis:7-alpine
container_name: bhsis-redis
ports: 6379:6379
healthcheck: redis-cli ping
```

### backend (BHSIS)
Função: API REST + WebSocket + frontend buildado (produção).

Configuração:
```txt
build: bhsis/Dockerfile
container_name: bhsis-backend
ports: 3001:3001
```
Variáveis principais:
```env
DATABASE_URL=postgresql://bhsis:bhsis_password@postgres:5432/bhsis?options=-c%20search_path%3Dbhsis%2Cpublic
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Stack estendida/legada — `docker/docker-compose.yml`
Use apenas se precisar de `routing-service`, `tracking-service`, `notification-service`, Graphhopper, etc.  
Essa stack não é necessária para o BHSIS básico.

## Dica de uso
- Para desenvolvimento rápido: `pnpm dev` (porta 3000).
- Para validar produção: `docker compose up -d --build` (porta 3001).
