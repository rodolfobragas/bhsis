# Guia de Deploy - BHSIS

## 🚀 Opções de Deploy

Este guia cobre as opções mais populares para fazer deploy do BHSIS em produção.

---

## 1️⃣ Deploy em Heroku

### Pré-requisitos

- Conta no Heroku
- Heroku CLI instalado
- Git configurado

### Passos

```bash
# 1. Login no Heroku
heroku login

# 2. Crie uma aplicação
heroku create seu-app-name

# 3. Configure variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set FRONTEND_URL=https://seu-app-name.herokuapp.com

# 4. Adicione PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# 5. Adicione Redis
heroku addons:create heroku-redis:premium-0

# 6. Deploy
git push heroku main

# 7. Execute migrações
heroku run npx prisma migrate deploy

# 8. Visualize logs
heroku logs --tail
```

---

## 2️⃣ Deploy em Railway

### Pré-requisitos

- Conta no Railway
- Railway CLI instalado

### Passos

```bash
# 1. Login no Railway
railway login

# 2. Crie um novo projeto
railway init

# 3. Configure variáveis de ambiente
railway variable set NODE_ENV production
railway variable set JWT_SECRET $(openssl rand -hex 32)

# 4. Adicione PostgreSQL
railway add --plugin postgresql

# 5. Adicione Redis
railway add --plugin redis

# 6. Deploy
railway up

# 7. Visualize logs
railway logs
```

---

## 3️⃣ Deploy em AWS (EC2 + RDS)

### Pré-requisitos

- Conta AWS
- AWS CLI configurado
- Chave SSH para EC2

### Passos

#### 1. Crie uma instância EC2

```bash
# Use Ubuntu 22.04 LTS
# Tipo: t3.medium (recomendado)
# Security Group: Abra portas 22, 80, 443, 3001
```

#### 2. Configure a instância

```bash
# SSH na instância
ssh -i sua-chave.pem ubuntu@seu-ip-publico

# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale dependências
sudo apt install -y nodejs npm postgresql-client redis-tools git nginx certbot python3-certbot-nginx

# Instale pnpm
npm install -g pnpm

# Clone o repositório
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis

# Instale dependências
pnpm install --prod
```

#### 3. Configure RDS (PostgreSQL)

```bash
# No console AWS:
# 1. Crie uma instância RDS PostgreSQL
# 2. Anote o endpoint
# 3. Configure security groups para aceitar conexões da EC2

# Teste a conexão
psql -h seu-rds-endpoint.amazonaws.com -U admin -d bhsis
```

#### 4. Configure ElastiCache (Redis)

```bash
# No console AWS:
# 1. Crie um cluster Redis
# 2. Anote o endpoint
# 3. Configure security groups
```

#### 5. Configure variáveis de ambiente

```bash
# Crie .env
cat > .env << EOF
DATABASE_URL=postgresql://admin:senha@seu-rds-endpoint.amazonaws.com:5432/bhsis
REDIS_URL=redis://seu-redis-endpoint.amazonaws.com:6379
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-dominio.com
LOG_LEVEL=info
EOF
```

#### 6. Execute migrações

```bash
npx prisma migrate deploy
```

#### 7. Configure PM2

```bash
# Instale PM2 globalmente
sudo npm install -g pm2

# Crie arquivo de configuração
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'bhsis-api',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Inicie com PM2
pnpm build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 8. Configure Nginx

```bash
# Crie configuração Nginx
sudo tee /etc/nginx/sites-available/bhsis << EOF
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Ative o site
sudo ln -s /etc/nginx/sites-available/bhsis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 9. Configure SSL com Let's Encrypt

```bash
sudo certbot --nginx -d seu-dominio.com
```

---

## 4️⃣ Deploy em DigitalOcean

### Pré-requisitos

- Conta DigitalOcean
- Droplet criado (Ubuntu 22.04)

### Passos

```bash
# SSH no Droplet
ssh root@seu-droplet-ip

# Atualize o sistema
apt update && apt upgrade -y

# Instale dependências
apt install -y nodejs npm postgresql redis-server git nginx certbot python3-certbot-nginx

# Instale pnpm
npm install -g pnpm

# Clone e configure (similar ao AWS)
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis
pnpm install --prod

# Configure PostgreSQL local
sudo -u postgres createdb bhsis
sudo -u postgres psql -c "CREATE USER bhsis WITH PASSWORD 'senha_segura';"
sudo -u postgres psql -c "ALTER ROLE bhsis WITH CREATEDB;"

# Configure .env
cat > .env << EOF
DATABASE_URL=postgresql://bhsis:senha_segura@localhost:5432/bhsis
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-dominio.com
EOF

# Execute migrações
npx prisma migrate deploy

# Configure PM2 e Nginx (como no AWS)
```

---

## 5️⃣ Deploy com Docker em VPS

### Pré-requisitos

- VPS com Docker instalado
- Docker Compose instalado

### Passos

```bash
# SSH no VPS
ssh usuario@seu-vps-ip

# Clone o repositório
git clone https://github.com/seu-usuario/bhsis.git
cd bhsis

# Configure .env para produção
cat > .env << EOF
DATABASE_URL=postgresql://bhsis:senha_segura@postgres:5432/bhsis
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-dominio.com
EOF

# Inicie os serviços
docker-compose -f docker-compose.prod.yml up -d

# Verifique status
docker-compose ps

# Visualize logs
docker-compose logs -f backend
```

**docker-compose.prod.yml**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: bhsis
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: bhsis
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  backend:
    image: seu-usuario/bhsis:latest
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://bhsis:${DB_PASSWORD}@postgres:5432/bhsis
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 📊 Monitoramento em Produção

### Health Checks

```bash
# Monitore a saúde da aplicação
curl https://seu-dominio.com/health

# Configure alertas para respostas não-200
```

### Logs

```bash
# Visualize logs em tempo real
tail -f logs/combined.log

# Busque erros
grep ERROR logs/error.log
```

### Performance

```bash
# Monitore uso de memória
free -h

# Monitore uso de CPU
top

# Monitore conexões de banco de dados
psql -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

---

## 🔄 CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install -g pnpm && pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: seu-app-name
          heroku_email: seu-email@example.com
```

---

## 🔒 Checklist de Segurança

- [ ] JWT_SECRET é uma string aleatória forte
- [ ] DATABASE_URL usa HTTPS/SSL
- [ ] Redis está protegido com senha
- [ ] Firewall está configurado corretamente
- [ ] CORS está restrito a domínios conhecidos
- [ ] Rate limiting está ativado
- [ ] Logs estão sendo monitorados
- [ ] Backups automáticos estão configurados
- [ ] SSL/TLS está ativado (HTTPS)
- [ ] Variáveis sensíveis não estão no git

---

## 📞 Troubleshooting

### Aplicação não inicia

```bash
# Verifique logs
pm2 logs

# Verifique conexão com banco
psql $DATABASE_URL -c "SELECT 1;"

# Verifique conexão com Redis
redis-cli -u $REDIS_URL ping
```

### Alta latência

```bash
# Verifique índices do banco
psql $DATABASE_URL -c "\d+ orders"

# Verifique cache Redis
redis-cli -u $REDIS_URL INFO stats
```

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-14
