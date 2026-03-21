# Deployment Tracking

Última atualização: 2026-03-21

## Mudanças recentes
- Separação de bancos por módulo (Auth + Food + demais módulos com DB próprio).
- Auth isolado em `auth_db` e acessos entre módulos via API.
- Prisma separado por módulo com `schema.prisma` e migrations independentes.
- Backend buildado em CJS (`dist/index.cjs`) para compatibilidade com Prisma em Docker.
- Busca no menu lateral e ordenação alfabética de módulos/sub-módulos.
- Imagens Docker publicadas no Docker Hub com tag `v2.0.1`.

## Checklist de deploy (BHSIS)
1. Provisionar Postgres com bancos: `auth_db`, `food_db`, `web_db`, `agro_db`, `saloes_db`, `clinicas_db`, `shop_db`, `pet_db`, `wms_db`, `oficinas_db`, `escolas_db`, `frota_db`, `varejo_db`, `igrejas_db`, `imobiliarias_db`.
2. Garantir schema `bhsis` em cada banco.
3. Exportar variáveis `DATABASE_URL_*` (ver `.env.example`).
4. Rodar `pnpm prisma:generate`.
5. Rodar `pnpm prisma:migrate:deploy` (auth + food).
6. Subir backend com `pnpm start` ou Docker.

## Imagens publicadas
- `rodolfobragas/bhsis-backend:v2.0.1`
- `rodolfobragas/bhsis-postgres:v2.0.1`
- `rodolfobragas/bhsis-redis:v2.0.1`

## Observações
- Não acessar dados de outro módulo por DB. Use API interna/externa.
- Migrações existentes do monolito foram separadas em `bhsis/prisma/auth` e `bhsis/prisma/food`.
