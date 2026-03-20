# BHSIS Database

## Objetivo
Banco PostgreSQL usado pelo BHSIS (schema `bhsis`) com migrations Prisma.

## Estrutura
- `bhsis/prisma/schema.prisma`: schema com `schemas = ["bhsis"]`.
- `bhsis/prisma/migrations/`: migrations SQL.

## Primeiro setup (local)
1. Suba o Postgres via Docker (`bhsis/docker-compose.yml`).
2. Crie o schema:
```bash
docker exec bhsis-postgres psql -U bhsis -d bhsis -c "CREATE SCHEMA IF NOT EXISTS bhsis;"
```
3. Aplique migrations:
```bash
cd bhsis
DATABASE_URL="postgresql://bhsis:bhsis_password@localhost:5432/bhsis?options=-c%20search_path%3Dbhsis%2Cpublic" pnpm prisma migrate deploy
```

## Observações
- Se estiver rodando o backend no Docker, o `DATABASE_URL` já aponta para o banco dentro do container.
- O schema `bhsis` é obrigatório (as migrations não o criam automaticamente).
