# BHSIS Docker Stack

## Objetivo (CRM)
Orquestrar a pilha completa do BHSIS (API, apps e serviços auxiliares) via Docker Compose.

## Arquivos
- `docker/docker-compose.yml`: stack local.
- `docker/docker-compose.hub.yml`: stack consumindo imagens do Docker Hub.
- `docker/graphhopper/`: dados de roteamento (quando usado).
- `docker/traccar/`: configuração do Traccar (quando usado).

## Subir a stack
```bash
cd docker
docker compose up -d
```

## Serviços e portas (compose local)
- `postgres`: 5433
- `redis`: 6380
- `api-core`: 4000
- `routing-service`: 3021
- `tracking-service`: 3002
- `notification-service`: 3010
- `dashboard-web`: 4173
- `motoboy-app`: 4174
- `bhsis` (antigo marmitex-system): 3000

## Observações
- Em ambiente CRM, os serviços de roteamento e tracking podem ser usados como módulos de visitas/field service.
- Ajustes de CORS e variáveis devem ser feitos nos `.env` de cada módulo.
