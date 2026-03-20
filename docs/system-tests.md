# Testes de Sistema (BHSIS)

## Pré-requisitos
- Docker e Docker Compose instalados.
- Stack local ativa (`bhsis/docker-compose.yml`).

## Subir a stack
```bash
cd bhsis
docker compose up --build -d
```

## Aplicar migrations
```bash
cd bhsis
DATABASE_URL="postgresql://bhsis:bhsis_password@localhost:5432/bhsis?options=-c%20search_path%3Dbhsis%2Cpublic" pnpm prisma migrate deploy
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
