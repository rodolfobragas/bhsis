# Testes de Sistema (BHSIS)

## Pré-requisitos
- Docker e Docker Compose instalados.
- Stack local ativa (`bhsis/docker-compose.yml`).

## Subir a stack
```bash
cd bhsis
docker compose up --build -d
```

## Gerar clients Prisma
```bash
cd bhsis
pnpm prisma:generate
```

## Aplicar migrations (Auth + Food)
```bash
cd bhsis
pnpm prisma:migrate:deploy
```

## Health check
```bash
curl -s http://localhost:3001/health
```

## Fluxo mínimo (auth + produtos)
Requer `jq` instalado para extrair o token.
```bash
# registrar usuário
curl -s -X POST http://localhost:3001/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@bhsis.local","password":"123456","name":"Admin"}'

# login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@bhsis.local","password":"123456"}' | jq -r .token)

# criar produto
curl -s -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Produto Teste","sku":"SKU-001","category":"Geral","price":9.9}'
```
