# Containers do Projeto (Detalhado)

Este documento detalha cada container, com imagem, portas, variáveis, volumes, healthchecks e dependências.

## Stack CRM (local) — `docker/docker-compose.yml`

### postgres
Função: banco principal PostgreSQL/PostGIS usado pelos serviços do CRM.

Configuração:
```txt
image: postgis/postgis:15-3.3
container_name: delivery-postgres
ports: 5433:5432
volumes: postgres-data:/var/lib/postgresql/data
healthcheck: pg_isready -U postgres -d delivery
```
Variáveis:
```env
POSTGRES_DB=delivery
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```
Dependências: nenhuma.

### redis
Função: cache/filas (BullMQ) usado por API e workers.

Configuração:
```txt
image: redis:7
container_name: delivery-redis
ports: 6380:6379
healthcheck: redis-cli -h localhost ping
```
Variáveis: nenhuma.
Dependências: nenhuma.

### graphhopper
Função: motor de roteirização (VRP). Requer import de dados OSM.

Configuração:
```txt
image: swatrider/graphhopper:latest
container_name: delivery-graphhopper
ports: 8989:8989
command: server /data/brazil-latest.osm.pbf
volumes: ./graphhopper/data:/data
healthcheck: ls /data/*.osm-gh
```
Variáveis:
```env
MAX_HEAP_SIZE=6g
```
Dependências:
- postgres (healthy)

### traccar
Função: servidor externo de rastreamento (opcional). Deve encaminhar eventos para o tracking-service.

Configuração:
```txt
image: traccar/traccar:latest
container_name: delivery-traccar
ports: 8082:8082
volumes: ./traccar/conf:/opt/traccar/conf
healthcheck: wget -qO- http://localhost:8082/
```
Variáveis:
```env
TZ=America/Sao_Paulo
```
Dependências:
- postgres (healthy)

### api-core
Função: API REST + WebSocket (NestJS). Swagger em `/docs`.

Configuração:
```txt
image: rodolfobragas/bhsis:api-core-v1.0.0
container_name: delivery-api-core
ports: 4000:4000
healthcheck: wget -qO- http://localhost:4000/dashboard/resumo
```
Variáveis:
```env
PORT=4000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=delivery
GRAPHOPPER_VRP_URL=http://graphhopper:8989/vrp
REDIS_HOST=redis
REDIS_PORT=6379
TRACCAR_WEBHOOK_SECRET=changeme
```
Dependências:
- postgres (healthy)
- redis (healthy)
- graphhopper (healthy)

### routing-service
Função: worker de rotas (BullMQ + Graphhopper VRP).

Configuração:
```txt
image: rodolfobragas/bhsis:routing-service-v1.0.0
container_name: delivery-routing-service
ports: 3021:3001
healthcheck: wget -qO- http://localhost:3001/health
```
Variáveis:
```env
PORT=3001
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=delivery
REDIS_HOST=redis
REDIS_PORT=6379
GRAPHOPPER_VRP_URL=http://graphhopper:8989/vrp
BHSIS_API_URL=http://bhsis:3000
BHSIS_SERVICE_TOKEN=changeme
```
Dependências:
- postgres (healthy)
- redis (healthy)
- graphhopper (healthy)

### tracking-service
Função: ingestão de posições e emissão via Socket.IO.

Configuração:
```txt
image: rodolfobragas/bhsis:tracking-service-v1.0.0
container_name: delivery-tracking-service
ports: 3002:3002
healthcheck: wget -qO- http://localhost:3002/health
```
Variáveis:
```env
PORT=3002
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=delivery
REDIS_HOST=redis
REDIS_PORT=6379
TRACCAR_WEBHOOK_SECRET=changeme
BHSIS_API_URL=http://bhsis:3000
BHSIS_SERVICE_TOKEN=changeme
```
Dependências:
- postgres (healthy)
- redis (healthy)

### notification-service
Função: worker de notificações (fila `notificacoes.cliente`).

Configuração:
```txt
image: rodolfobragas/bhsis:notification-service-v1.0.0
container_name: delivery-notification-service
ports: 3010:3010
healthcheck: wget -qO- http://localhost:3010/health
```
Variáveis:
```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
API_CORE_URL=http://api-core:4000
```
Dependências:
- redis (healthy)
- api-core (healthy)

### dashboard-web
Função: dashboard React/Leaflet.

Configuração:
```txt
image: rodolfobragas/bhsis:dashboard-web-v1.0.0
container_name: delivery-dashboard-web
ports: 4173:4173
```
Dependências:
- api-core (healthy)
- tracking-service (healthy)

### motoboy-app (field app)
Função: PWA leve para agentes/visitas.

Configuração:
```txt
image: rodolfobragas/bhsis:motoboy-app-v1.0.0
container_name: delivery-motoboy-app
ports: 4174:4174
```
Dependências:
- api-core (healthy)
- tracking-service (healthy)

### bhsis (app principal CRM)
Função: UI principal do CRM (módulo Food funcional; demais módulos placeholder).

Configuração:
```txt
image: rodolfobragas/bhsis:bhsis-v1.0.35
build: ../bhsis
container_name: delivery-bhsis
ports: 3000:3000
healthcheck: wget -qO- http://localhost:3000/health
```
Variáveis:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/bhsis_db?options=-c%20search_path%3Dfood_db%2Cweb_db%2Cpublic
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
BHSIS_SERVICE_TOKEN=changeme
SERVICE_TOKEN=changeme
NODE_ENV=production
VITE_APP_ID=bhsis
JWT_SECRET=changeme
OAUTH_SERVER_URL=https://oauth.example.com
OWNER_OPEN_ID=owner123
BUILT_IN_FORGE_API_URL=https://forge.example.com
BUILT_IN_FORGE_API_KEY=forgekey
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}
STRIPE_SUCCESS_URL=${STRIPE_SUCCESS_URL:-}
STRIPE_CANCEL_URL=${STRIPE_CANCEL_URL:-}
STRIPE_CURRENCY=${STRIPE_CURRENCY:-brl}
```
Dependências:
- postgres (healthy)
- redis (healthy)

### Volumes (stack CRM)
```txt
postgres-data
```

## Stack CRM (hub) — `docker/docker-compose.hub.yml`
Mesma topologia e variáveis da stack local, porém sem `build` e usando imagens já publicadas. Diferença principal:

- `bhsis` usa `rodolfobragas/bhsis:bhsis-v1.0.10`.
- O restante permanece igual ao compose local (imagens `*-v1.0.0`).

## Stack BHSIS isolada — `bhsis/docker-compose.yml`
Usada quando você quer subir apenas o BHSIS monolito com Postgres e Redis próprios.

### postgres
Função: banco isolado do BHSIS.

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
POSTGRES_USER=bhsis
POSTGRES_PASSWORD=bhsis_password
POSTGRES_DB=bhsis
```
Dependências: nenhuma.

### redis
Função: cache/filas isoladas do BHSIS.

Configuração:
```txt
image: redis:7-alpine
container_name: bhsis-redis
ports: 6379:6379
volumes: redis_data:/data
healthcheck: redis-cli ping
```
Variáveis: nenhuma.
Dependências: nenhuma.

### backend (BHSIS isolado)
Função: backend do BHSIS rodando em produção (pnpm start).

Configuração:
```txt
build: ./Dockerfile
container_name: bhsis-backend
ports: 3001:3001
command: pnpm start
extra_hosts: host.docker.internal:host-gateway
```
Variáveis:
```env
DATABASE_URL=postgresql://bhsis:bhsis_password@postgres:5432/bhsis_db?options=-c%20search_path%3Dfood_db%2Cweb_db%2Cpublic
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
OAUTH_SERVER_URL=http://host.docker.internal:3000
NODE_ENV=production
PORT=3001
JWT_SECRET=dev-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```
Dependências:
- postgres (healthy)
- redis (healthy)

### Volumes (stack isolada)
```txt
postgres_data
redis_data
```

### Network (stack isolada)
```txt
name: bhsis-network
```

## Portas principais (referência rápida)
```txt
3000  BHSIS App (CRM principal)
3001  BHSIS Backend isolado
3002  Tracking Service
3010  Notification Service
3021  Routing Service
4000  API Core
4173  Dashboard Web
4174  Field App (Motoboy)
5432  Postgres (stack isolada)
5433  Postgres (stack CRM)
6379  Redis (stack isolada)
6380  Redis (stack CRM)
8082  Traccar
8989  Graphhopper
```

## Observações operacionais
- Graphhopper só fica healthy quando existem arquivos `.osm-gh` em `docker/graphhopper/data`.
- Traccar precisa de forwarding para `http://tracking-service:3002/tracking/update` com `TRACCAR_WEBHOOK_SECRET`.
- A stack CRM e a stack isolada do BHSIS usam bancos e Redis diferentes.

## Diagrama de relacionamento (Mermaid)

### Stack CRM (local)
```mermaid
graph TD
  subgraph Infra
    PG[(Postgres/PostGIS 5433:5432)]
    REDIS[(Redis 6380:6379)]
    GH[Graphhopper 8989:8989]
    TR[Traccar 8082:8082]
  end

  subgraph Backend
    API[api-core 4000:4000]
    ROUTE[routing-service 3021:3001]
    TRACK[tracking-service 3002:3002]
    NOTIF[notification-service 3010:3010]
    BHSIS[bhsis app 3000:3000]
  end

  subgraph Frontends
    DASH[dashboard-web 4173:4173]
    FIELD[motoboy-app 4174:4174]
  end

  PG --> API
  PG --> ROUTE
  PG --> TRACK
  PG --> BHSIS

  REDIS --> API
  REDIS --> ROUTE
  REDIS --> TRACK
  REDIS --> NOTIF
  REDIS --> BHSIS

  GH --> API
  GH --> ROUTE

  TR --> TRACK

  API --> NOTIF
  BHSIS --> ROUTE
  BHSIS --> TRACK

  API --> DASH
  TRACK --> DASH

  API --> FIELD
  TRACK --> FIELD
```

### Stack BHSIS isolada
```mermaid
graph TD
  PGI[(bhsis-postgres 5432:5432)] --> BAPP[bhsis-backend 3001:3001]
  REDISI[(bhsis-redis 6379:6379)] --> BAPP
```
