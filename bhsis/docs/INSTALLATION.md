# Guia de Instalação - BHSIS

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: versão 18 ou superior
- **PostgreSQL**: versão 12 ou superior
- **Redis**: versão 6 ou superior
- **pnpm**: versão 8 ou superior (gerenciador de pacotes)
- **Git**: para clonar o repositório

### Verificar Versões

```bash
node --version
npm --version
pnpm --version
psql --version
redis-cli --version
```

---

## 🚀 Instalação Local

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis
```

### 2. Instale as Dependências

```bash
pnpm install
```

### 3. Configure o Banco de Dados

#### Opção A: PostgreSQL Local

```bash
# Crie um banco de dados
createdb bhsis

# Configure a URL de conexão
export DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/bhsis"
```

#### Opção B: Docker

```bash
# Inicie o PostgreSQL com Docker
docker run --name bhsis-postgres \
  -e POSTGRES_USER=bhsis \
  -e POSTGRES_PASSWORD=bhsis_password \
  -e POSTGRES_DB=bhsis \
  -p 5432:5432 \
  -d postgres:15-alpine

# Configure a URL
export DATABASE_URL="postgresql://bhsis:bhsis_password@localhost:5432/bhsis"
```

### 4. Configure o Redis

#### Opção A: Redis Local

```bash
# Inicie o Redis
redis-server

# Configure a URL
export REDIS_URL="redis://localhost:6379"
```

#### Opção B: Docker

```bash
# Inicie o Redis com Docker
docker run --name bhsis-redis \
  -p 6379:6379 \
  -d redis:7-alpine

# Configure a URL
export REDIS_URL="redis://localhost:6379"
```

### 5. Configure Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

**Variáveis obrigatórias**:

```env
DATABASE_URL=postgresql://bhsis:bhsis_password@localhost:5432/bhsis
REDIS_URL=redis://localhost:6379
JWT_SECRET=sua-chave-secreta-super-segura
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 6. Execute as Migrações do Banco de Dados

```bash
# Aplique as migrações
npx prisma migrate deploy

# (Opcional) Abra o Prisma Studio para visualizar os dados
npx prisma studio
```

### 7. Inicie o Servidor

```bash
# Desenvolvimento com hot-reload
pnpm dev

# Produção
pnpm build
pnpm start
```

O servidor estará disponível em `http://localhost:3001`

---

## 🐳 Instalação com Docker Compose

A forma mais fácil de começar é usar Docker Compose, que configura PostgreSQL, Redis e o backend automaticamente.

### Pré-requisitos

- Docker
- Docker Compose

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis

# 2. Inicie os serviços
docker-compose up -d

# 3. Verifique o status
docker-compose ps

# 4. Visualize os logs
docker-compose logs -f backend
```

O servidor estará disponível em `http://localhost:3001`

### Comandos Úteis

```bash
# Parar os serviços
docker-compose down

# Remover volumes (limpar dados)
docker-compose down -v

# Reconstruir imagens
docker-compose up -d --build

# Executar comando no container
docker-compose exec backend pnpm prisma studio
```

---

## 📦 Instalação em Produção

### 1. Prepare o Servidor

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale dependências
sudo apt install -y nodejs npm postgresql redis-server
```

### 2. Clone e Configure

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis

# Instale dependências
pnpm install --prod

# Configure variáveis de ambiente
cp .env.example .env
nano .env
```

**Configuração de Produção**:

```env
DATABASE_URL=postgresql://user:password@db-host:5432/bhsis
REDIS_URL=redis://redis-host:6379
JWT_SECRET=gere-uma-chave-segura-com-openssl
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-dominio.com
LOG_LEVEL=info
```

### 3. Execute as Migrações

```bash
npx prisma migrate deploy
```

### 4. Build e Start

```bash
# Build
pnpm build

# Inicie com PM2 (gerenciador de processos)
npm install -g pm2
pm2 start dist/index.js --name "bhsis-api"

# Salve a configuração
pm2 save
pm2 startup
```

### 5. Configure Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name api.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Configure SSL com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.seu-dominio.com
```

---

## 🧪 Verificar a Instalação

### Health Check

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "timestamp": "2026-03-14T20:30:00Z"
}
```

### Testar Autenticação

```bash
# Registrar usuário
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Teste User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

---

## 🔧 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
# Regenere o cliente Prisma
npx prisma generate
```

### Erro: "Connection refused" (PostgreSQL)

```bash
# Verifique se o PostgreSQL está rodando
sudo systemctl status postgresql

# Ou com Docker
docker ps | grep postgres
```

### Erro: "Connection refused" (Redis)

```bash
# Verifique se o Redis está rodando
redis-cli ping

# Ou com Docker
docker ps | grep redis
```

### Erro: "EACCES: permission denied"

```bash
# Verifique permissões
ls -la logs/

# Crie o diretório se não existir
mkdir -p logs
chmod 755 logs
```

---

## 📚 Próximos Passos

1. **Crie um usuário admin**:
   ```bash
   npx ts-node scripts/create-admin.ts
   ```

2. **Importe dados de exemplo**:
   ```bash
   npx ts-node scripts/seed.ts
   ```

3. **Configure o frontend**: Veja a documentação do frontend

4. **Configure o KDS**: Veja a documentação do KDS

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `logs/combined.log`
2. Abra uma issue no GitHub
3. Entre em contato com o time de desenvolvimento

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-14
