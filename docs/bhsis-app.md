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
- `prisma/`: schemas e migrations por módulo.
- `drizzle/`: artefatos auxiliares (quando usados).

## Execução local
```bash
pnpm install
pnpm dev
```

### Variáveis de ambiente (dev)
Crie `bhsis/.env` com:
```env
DATABASE_URL_AUTH=postgresql://bhsis:bhsis_password@localhost:5432/auth_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_FOOD=postgresql://bhsis:bhsis_password@localhost:5432/food_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_WEB=postgresql://bhsis:bhsis_password@localhost:5432/web_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_AGRO=postgresql://bhsis:bhsis_password@localhost:5432/agro_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_SALOES=postgresql://bhsis:bhsis_password@localhost:5432/saloes_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_CLINICAS=postgresql://bhsis:bhsis_password@localhost:5432/clinicas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_SHOP=postgresql://bhsis:bhsis_password@localhost:5432/shop_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_PET=postgresql://bhsis:bhsis_password@localhost:5432/pet_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_WMS=postgresql://bhsis:bhsis_password@localhost:5432/wms_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_OFICINAS=postgresql://bhsis:bhsis_password@localhost:5432/oficinas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_ESCOLAS=postgresql://bhsis:bhsis_password@localhost:5432/escolas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_FROTA=postgresql://bhsis:bhsis_password@localhost:5432/frota_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_VAREJO=postgresql://bhsis:bhsis_password@localhost:5432/varejo_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_IGREJAS=postgresql://bhsis:bhsis_password@localhost:5432/igrejas_db?options=-c%20search_path%3Dbhsis%2Cpublic
DATABASE_URL_IMOBILIARIAS=postgresql://bhsis:bhsis_password@localhost:5432/imobiliarias_db?options=-c%20search_path%3Dbhsis%2Cpublic
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
PORT=3000
FRONTEND_URL=http://localhost:3000
OAUTH_SERVER_URL=http://localhost:3000
```

## Prisma
- Gere clients: `pnpm prisma:generate`.
- Aplique migrations: `pnpm prisma:migrate:deploy` (auth + food).

## Build
```bash
pnpm build
pnpm start
```

## Variáveis de ambiente (principais)
- `DATABASE_URL_*`
- `REDIS_*`
- `JWT_SECRET`
- `PORT`

## Portas
- Dev (`pnpm dev`): 3000
- Docker backend: 3001

## Observações de migração
Todos os módulos e telas devem ser renomeados semanticamente para CRM (ex.: pedidos -> oportunidades/tickets; clientes -> contatos/contas). O nome do app passa a ser **BHSIS**.
