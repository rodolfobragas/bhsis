# Containers do Projeto (Atualizado)

Este documento descreve os containers usados no **BHSIS**.

## Stack BHSIS (atual) — `bhsis/docker-compose.yml`

### postgres
Função: Postgres com **um banco por módulo**.

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
POSTGRES_DB=auth_db
POSTGRES_USER=bhsis
POSTGRES_PASSWORD=bhsis_password
```
Observações:
- O init script `bhsis/docker-entrypoint-initdb.d/01-init-dbs.sql` cria os bancos e o schema `bhsis`.
- Auth, Food e demais módulos têm bancos separados.

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
DATABASE_URL_AUTH=postgresql://bhsis:bhsis_password@postgres:5432/auth_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_FOOD=postgresql://bhsis:bhsis_password@postgres:5432/food_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_WEB=postgresql://bhsis:bhsis_password@postgres:5432/web_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_AGRO=postgresql://bhsis:bhsis_password@postgres:5432/agro_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_SALOES=postgresql://bhsis:bhsis_password@postgres:5432/saloes_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_CLINICAS=postgresql://bhsis:bhsis_password@postgres:5432/clinicas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_SHOP=postgresql://bhsis:bhsis_password@postgres:5432/shop_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_PET=postgresql://bhsis:bhsis_password@postgres:5432/pet_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_WMS=postgresql://bhsis:bhsis_password@postgres:5432/wms_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_OFICINAS=postgresql://bhsis:bhsis_password@postgres:5432/oficinas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_ESCOLAS=postgresql://bhsis:bhsis_password@postgres:5432/escolas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_FROTA=postgresql://bhsis:bhsis_password@postgres:5432/frota_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_VAREJO=postgresql://bhsis:bhsis_password@postgres:5432/varejo_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_IGREJAS=postgresql://bhsis:bhsis_password@postgres:5432/igrejas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_IMOBILIARIAS=postgresql://bhsis:bhsis_password@postgres:5432/imobiliarias_db?options=-c%20search_path%3Dbhsis%2Cpublic
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Dica de uso
- Para desenvolvimento rápido: `pnpm dev` (porta 3000).
- Para validar produção: `docker compose up -d --build` (porta 3001).
