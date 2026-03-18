# BHSIS App (antigo marmitex-system)

## Objetivo (CRM)
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
cp .env.example .env
pnpm dev
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

## Porta
- Compose: `3000`.

## Observações de migração
Todos os módulos e telas devem ser renomeados semanticamente para CRM (ex.: pedidos -> oportunidades/tickets; clientes -> contatos/contas). O nome do app passa a ser **BHSIS**.
