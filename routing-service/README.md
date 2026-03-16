# Routing Service

Serviço responsável por consumir jobs da fila `rotas.otimizar`, consultar o Graphhopper VRP com os pontos e persistir a ordem otimizada no banco Postgres/PostGIS.

## Fluxo
1. O API Core enfileira entregas no Redis (`rotas.otimizar`).
2. O worker deste serviço processa o job, consulta Graphhopper e atualiza `entregas.ordem_rota` + salva um registro em `rotas`.
3. Falhas são registradas para análise e podem reprocessar automaticamente.

## Como executar
```bash
cp .env.example .env
npm install
npm run dev
```

## Dependências
- PostgreSQL/PostGIS (mesmo banco do API Core)
- Redis (mesma instância usada pelo BullMQ)
- Graphhopper com VRP preparado para o Brasil (variável `GRAPHOPPER_VRP_URL`)

## Monitoramento
- Worker BullMQ loga conclusão e falhas via console.
- Endpoint `/health` expõe um health check simples para orquestradores.
