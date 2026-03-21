# BHSIS Docker Stack

## Objetivo
Orquestrar a pilha do BHSIS (backend + banco + redis) via Docker Compose para desenvolvimento local.

## Arquivos
- `bhsis/docker-compose.yml`: stack local do BHSIS (backend + postgres + redis).
- `bhsis/docker-entrypoint-initdb.d/01-init-dbs.sql`: cria bancos e schema `bhsis` por módulo.

## Subir a stack
```bash
cd bhsis
docker compose up -d --build
```

## Serviços e portas (stack BHSIS)
- `postgres`: 5432 (bancos por módulo)
- `redis`: 6379
- `bhsis-backend`: 3001

## Variáveis importantes (backend)
- `DATABASE_URL_AUTH=postgresql://bhsis:bhsis_password@postgres:5432/auth_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_FOOD=postgresql://bhsis:bhsis_password@postgres:5432/food_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_WEB=postgresql://bhsis:bhsis_password@postgres:5432/web_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_AGRO=postgresql://bhsis:bhsis_password@postgres:5432/agro_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_SALOES=postgresql://bhsis:bhsis_password@postgres:5432/saloes_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_CLINICAS=postgresql://bhsis:bhsis_password@postgres:5432/clinicas_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_SHOP=postgresql://bhsis:bhsis_password@postgres:5432/shop_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_PET=postgresql://bhsis:bhsis_password@postgres:5432/pet_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_WMS=postgresql://bhsis:bhsis_password@postgres:5432/wms_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_OFICINAS=postgresql://bhsis:bhsis_password@postgres:5432/oficinas_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_ESCOLAS=postgresql://bhsis:bhsis_password@postgres:5432/escolas_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_FROTA=postgresql://bhsis:bhsis_password@postgres:5432/frota_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_VAREJO=postgresql://bhsis:bhsis_password@postgres:5432/varejo_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_IGREJAS=postgresql://bhsis:bhsis_password@postgres:5432/igrejas_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `DATABASE_URL_IMOBILIARIAS=postgresql://bhsis:bhsis_password@postgres:5432/imobiliarias_db?options=-c%20search_path%3Dbhsis%2Cpublic`
- `REDIS_URL=redis://redis:6379`
- `JWT_SECRET` (defina para produção)

## Imagens publicadas
- `rodolfobragas/bhsis-backend:v2.0.1`
- `rodolfobragas/bhsis-postgres:v2.0.1`
- `rodolfobragas/bhsis-redis:v2.0.1`

## Observações
- Para ambiente de desenvolvimento fora do Docker, crie `bhsis/.env` com as mesmas `DATABASE_URL_*`, apontando para `localhost`.
- Auth e módulos não compartilham banco. Dados entre módulos devem ser acessados via API.
