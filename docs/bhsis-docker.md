# BHSIS Docker Stack

## Objetivo
Orquestrar a pilha do BHSIS (backend + banco + redis) via Docker Compose para desenvolvimento local.

## Arquivos
- `bhsis/docker-compose.yml`: stack local do BHSIS (backend + postgres + redis).
- `docker/docker-compose.yml`: stack legada/infra estendida (routing/tracking/etc), use apenas se precisar desses serviços.

## Subir a stack
```bash
cd bhsis
docker compose up -d --build
```

## Serviços e portas (stack BHSIS)
- `postgres`: 5432 (DB `bhsis`, schema `bhsis`)
- `redis`: 6379
- `bhsis-backend`: 3001

## Variáveis importantes (backend)
- `DATABASE_URL=postgresql://bhsis:bhsis_password@postgres:5432/bhsis?options=-c%20search_path%3Dbhsis%2Cpublic`
- `REDIS_URL=redis://redis:6379`
- `JWT_SECRET` (defina para produção)

## Observações
- Para ambiente de desenvolvimento fora do Docker, crie `bhsis/.env` usando os mesmos parâmetros de `DATABASE_URL` acima, apontando para `localhost`.
