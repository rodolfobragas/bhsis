# Tracking Service

Microserviço dedicado ao rastreamento em tempo real dos motoboys. Ele consome webhooks do Traccar, grava posições em PostgreSQL/PostGIS, publica eventos via WebSocket e envia jobs de notificação.

## Endpoints
| Método | Caminho | Propósito |
| ------ | ------- | --------- |
| POST | `/tracking/update` | Webhook Traccar com `deviceId`, `latitude`, `longitude`, `speed`, `timestamp`. |
| POST | `/motoboy/localizacao` | Atualização manual enviada pelo app do motoboy (contém `motoboyId`). |
| GET | `/health` | Health check simples para orquestração. |

## WebSocket em tempo real
- URL: `http://<host>:<port>/realtime/socket.io`
- Evento emitido: `posicao-motoboy` com payload `{ motoboyId, latitude, longitude, speed, timestamp }`

## Filas
- `notificacoes.cliente`: job é disparado quando o status for `em_entrega`, permitindo que o Notification Service envie alertas ao cliente mais adiante.

## Configuração
Copie o `.env.example` e ajuste as conexões com PostgreSQL, Redis e Traccar.

## Inicialização
```bash
cp .env.example .env
npm install
npm run dev
```

O serviço roda na porta `3002` por padrão.
