# API Core - Delivery System

A API Core reúne os endpoints REST do sistema: gerenciamento de entregas, roteirizacao, rastreamento em tempo real e dashboard. O serviço e construído com NestJS, TypeORM e expose Swagger em `/docs`.

## Como iniciar
1. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Instale as dependencias:
   ```bash
   npm install
   ```
3. Execute em modo dev (necessita Postgres/PostGIS, Redis, Graphhopper, Traccar):
   ```bash
   npm run start:dev
   ```
4. Para compilar:
   ```bash
   npm run build
   npm run start
   ```

## Variaveis de ambiente (veja `.env.example`)
- `DATABASE_*`: conexao com PostgreSQL/PostGIS
- `GRAPHOPPER_VRP_URL`: endpoint do serviço de roteirizacao (ex.: `http://graphhopper:8989/vrp`)
- `REDIS_*`: Redis usado por filas BullMQ
- `TRACCAR_WEBHOOK_SECRET`: chave para validar webhooks (a validar no futuro)

## Endpoints principais
| Metodo | Caminho | Descricao |
| ------ | ------- | --------- |
| POST | `/entregas` | Criar entrega ligada a cliente/motoboy (status pendente). |
| GET | `/entregas` | Listar entregas com relacoes (cliente, motoboy). |
| GET | `/entregas/:id` | Buscar entrega. |
| POST | `/rotas/otimizar` | Enviar grupo de entregas para Graphhopper VRP e salvar ordem. |
| POST | `/motoboy/localizacao` | Receber posicao enviada pelo app (motoboy). |
| POST | `/tracking/update` | Webhook do Traccar (deviceId). |
| GET | `/motoboys` | Listar motoboys. |
| GET | `/dashboard/resumo` | Resumo de status, metricas e trafego.

## WebSocket
- Namespace: `/tracking`
- Evento emitido: `posicao-motoboy` (payload com `motoboyId`, `latitude`, `longitude`, `speed`, `timestamp`). Use no dashboard para atualizar o mapa em tempo real.

## Swagger
A documentacao Swagger esta acessivel em `/docs` apos iniciar a API (porta configurada em `PORT`).

## Proximos passos
- Adicionar migrations TypeORM para as tabelas principais.
- Implementar validacoes de seguranca (auth, validacao de webhooks).
- Criar worker separado que consome arquivo `rottas.otimizar` de BullMQ.
