# BHSIS App (antigo marmitex-system)

## Objetivo
Aplicação principal do BHSIS. Reúne autenticação, gestão de clientes, pipeline e operações em um único painel web. Substitui o propósito original de restaurante e passa a representar o núcleo do CRM.

## Tecnologias
- React + Vite (frontend)
- Node.js (backend)
- Prisma (ORM)
- Redis (cache/filas)
- WebSocket para tempo real
- Tailwind CSS

## Estrutura
- `client/`: frontend web.
- `server/`: backend HTTP e WebSocket.
- `shared/`: modelos e utilitários compartilhados.
- `prisma/`: schema e migrations.
- `drizzle/`: artefatos auxiliares (quando usados).

## Execução local
```bash
pnpm install
pnpm dev
```

### Variáveis de ambiente (dev)
Crie `bhsis/.env` com:
```env
DATABASE_URL=postgresql://bhsis:bhsis_password@localhost:5432/bhsis?options=-c%20search_path%3Dbhsis%2Cpublic
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
PORT=3000
FRONTEND_URL=http://localhost:3000
OAUTH_SERVER_URL=http://localhost:3000
```

## Build
```bash
pnpm build
pnpm start
```

## Variáveis de ambiente (principais)
- `DATABASE_URL`
- `REDIS_*`
- `JWT_SECRET`
- `PORT`

## Portas
- Dev (`pnpm dev`): 3000
- Docker backend: 3001

## Observações de migração
Todos os módulos e telas devem ser renomeados semanticamente para CRM (ex.: pedidos -> oportunidades/tickets; clientes -> contatos/contas). O nome do app passa a ser **BHSIS**.
