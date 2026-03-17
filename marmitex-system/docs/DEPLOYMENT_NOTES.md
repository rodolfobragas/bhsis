# Notas de Implantação — Marmitex System

## Erros encontrados durante o deploy
1. **Instalação falha por falta do patch `wouter@3.7.1`**
   - O Dockerfile não copiava `patches/` antes do `pnpm install`, então a dependência não era corrigida e o instalador abortava. ✅ Correção: adicionamos um `COPY patches ./patches` antes de cada instalação.
2. **`pnpm prisma generate` falha no Node 18**
   - O pacote `zeptomatch` é ESM e o Prisma Dev depende dele, portanto a execução com Node 18 gerava `ERR_REQUIRE_ESM`. ✅ Correção: passamos a usar `node:20-alpine` em ambos os estágios e executamos `pnpm prisma generate` somente depois de copiar o schema.
3. **Runtime não encontrava `node_modules/.prisma`**
   - O Prisma gera o cliente dentro de `node_modules/.pnpm/.../.prisma`; copiar `/app/node_modules/.prisma` falhava porque o diretório original estava mais profundo. ✅ Correção: após gerar o cliente criamos um symlink absoluto `node_modules/.prisma -> /app/node_modules/.pnpm/.../.prisma`, permitindo o `COPY --from=builder` no estágio final.
4. **Bundle de produção importava dev-deps (`@builder.io/vite-plugin-jsx-loc`, `vite`, etc.)**
   - `server/_core/index.ts` importava `setupVite` de forma estática, e o esbuild bundlizou `vite.config.ts` junto com o servidor. ✅ Correção: movemos `serveStatic` para um novo arquivo e importamos `setupVite` dinamicamente apenas em desenvolvimento. Também ajustamos o script de build de `esbuild` com `--external:./vite` para não incluí-lo no `dist`.
5. **Compose rodava em modo dev (com `pnpm dev`) e montava volumes**
   - No container runtime o tsx/watch faltava e a aplicação quebrava. ✅ Correção: rodamos `NODE_ENV=production`, `pnpm start` e removemos os binds do volume para usar o build já gerado.
6. **PostgreSQL apontava para volume legado da versão 16**
   - O volume continha dados compatíveis apenas com 16; ao iniciar a imagem 15 ele falhava. ✅ Correção: `docker compose down -v` e reinicialização limpa permitiram rodar PostgreSQL 15 normalmente.
7. **Aviso em runtime sobre `OAUTH_SERVER_URL` ausente**
   - O backend loga que a variável não foi configurada; ainda não está definida no compose. → Continua como lembrete até ser preenchida.
8. **Stripe requer variáveis de ambiente específicas**
   - Sem `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`, os endpoints de pagamento retornam erro. ✅ Correção: variáveis adicionadas no compose e rota `/api/payments/webhook` configurada com body raw.

## Correções aplicadas
- Dockerfile atualizado (Node 20, cópia do `patches`, geração do Prisma client após copiar o schema, link para `.prisma`).
- Nova estrutura `server/_core/serveStatic.ts`, carregamento dinâmico de `setupVite` no desenvolvimento e externalização do `./vite` no `esbuild`.
- `docker-compose.yml` agora publica apenas `NODE_ENV=production` e executa `pnpm start`, mantendo Postgres e Redis como serviços definidos.
- Executado `docker compose up --build` e `docker compose up -d` para validar toda a stack (Postgres/Redis/backend) em produção.
- Stripe integrado com endpoints `/api/payments/*`, webhook e tabela `Payment` no Prisma.
- Reembolsos Stripe disponíveis via `/api/payments/:paymentId/refund` e relatório agregado em `/api/payments/report`.

## Sugestões de melhoria contínua
1. **Gerenciar variáveis sensíveis em `.env` e referenciá-las via `env_file` no compose**, reduzindo checks faltantes (JWT, OAuth, URLs externas).
2. **Adicionar endpoints `/healthz` e `/readyz` ao backend** e configurar healthchecks no compose para garantir detectabilidade automática de falhas.
3. **Criar um estágio intermediário de dependências** no Dockerfile que instala tudo e gera o Prisma client antes de copiar a fonte, diminuindo rebuilds ao modificar apenas código.
4. **Documentar esse processo no README/CHANGELOG** para que novos contribuidores saibam rapidamente quais ajustes são obrigatórios ao subir a stack.

*Stack operacional em `docker compose up -d`: Postgres, Redis e backend rodando (`NODE_ENV=production`, `pnpm start`).*
