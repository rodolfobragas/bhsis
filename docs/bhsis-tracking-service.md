# BHSIS Tracking Service

## Objetivo (CRM)
Serviço de tracking em tempo real para agentes de campo/visitas, publicando eventos via WebSocket.

## Tecnologias
- Node.js
- Express
- Socket.IO
- TypeORM
- Redis
- PostgreSQL/PostGIS

## Endpoints
- `POST /tracking/update`
- `POST /motoboy/localizacao`
- `GET /health`

## WebSocket
- `http://<host>:3002/realtime/socket.io`
- Evento: `posicao-motoboy` (deve ser interpretado como posição do agente/representante)

## Execução local
```bash
cp .env.example .env
npm install
npm run dev
```

## Porta
- Compose: `3002`.
