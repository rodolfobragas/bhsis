# Guia de Instalação - BHSIS

## 📋 Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- pnpm 8+
- Git

## 🚀 Instalação Local

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis
```

### 2. Instale dependências
```bash
pnpm install
```

### 3. Configure banco e Redis
A stack usa **um banco por módulo**. O modo mais simples é subir via Docker Compose:
```bash
docker compose up -d
```

Se preferir Postgres local, crie os bancos:
- `auth_db`, `food_db`, `web_db`, `agro_db`, `saloes_db`, `clinicas_db`, `shop_db`, `pet_db`, `wms_db`, `oficinas_db`, `escolas_db`, `frota_db`, `varejo_db`, `igrejas_db`, `imobiliarias_db`.

Garanta o schema `bhsis` em cada DB.

### 4. Configure variáveis de ambiente
```bash
cp .env.example .env
nano .env
```

Variáveis obrigatórias:
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
JWT_SECRET=sua-chave-secreta-super-segura
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 5. Gere clients e migrations
```bash
pnpm prisma:generate
pnpm prisma:migrate:deploy
```

### 6. Inicie o servidor
```bash
pnpm dev
```

Servidor em `http://localhost:3001`.

## 🐳 Instalação com Docker Compose
```bash
cd bhsis
docker compose up -d --build
```

## Observações
- Auth é isolado em `auth_db`.
- Módulos não acessam DB de outros módulos. Use API.
