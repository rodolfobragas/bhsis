# BHSIS Notification Service

## Objetivo (CRM)
Processar notificações assíncronas (e-mail, SMS, WhatsApp, push) para clientes, leads e usuários internos.

## Tecnologias
- Node.js
- Express
- BullMQ
- Redis

## Filas
- `notificacoes.cliente`: payloads com eventos e dados de contato.

## Execução local
```bash
cp .env.example .env
npm install
npm run dev
```

## Endpoints
- `/health`

## Variáveis de ambiente
- `REDIS_HOST`, `REDIS_PORT`
- `API_CORE_URL`
