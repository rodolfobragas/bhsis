# BHSIS Database

## Objetivo
O BHSIS usa **um banco por módulo**. O Auth é isolado em `auth_db` e os módulos acessam dados de outros módulos via **API**, não via banco.

## Estrutura
- `bhsis/prisma/auth/schema.prisma`: Auth (users, roles, modules, access).
- `bhsis/prisma/food/schema.prisma`: domínio Food.
- `bhsis/prisma/<modulo>/schema.prisma`: scaffolding por módulo.
- `bhsis/prisma/auth/migrations/`: migrations do Auth.
- `bhsis/prisma/food/migrations/`: migrations do Food.

## Primeiro setup (local)
1. Suba o Postgres via Docker (`bhsis/docker-compose.yml`).
2. O script de init cria os bancos e o schema `bhsis` automaticamente.
3. Gere clients Prisma:
```bash
cd bhsis
pnpm prisma:generate
```
4. Aplique migrations (Auth + Food):
```bash
cd bhsis
pnpm prisma:migrate:deploy
```

## Observações
- Cada módulo tem um `DATABASE_URL_*` (veja `.env.example`).
- Não acesse tabelas de outro módulo direto no banco. Use API.
- O schema `bhsis` é obrigatório em todos os bancos.

## Migração do banco antigo
Se você já tinha o banco monolítico, use o script abaixo para mover os dados:
```bash
cd bhsis
export DATABASE_URL_OLD="postgresql://usuario:senha@localhost:5432/bhsis?options=-c%20search_path%3Dbhsis%2Cpublic"
export DATABASE_URL_AUTH="postgresql://usuario:senha@localhost:5432/auth_db?options=-c%20search_path%3Dbhsis%2Cpublic"
export DATABASE_URL_FOOD="postgresql://usuario:senha@localhost:5432/food_db?options=-c%20search_path%3Dbhsis%2Cpublic"
./scripts/migrate-old-db.sh
```
