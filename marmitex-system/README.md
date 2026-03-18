# Marmitex System

Um sistema completo de gerenciamento de restaurante com painel administrativo, pedidos em tempo real e Kitchen Display System (KDS).

## 🎯 Funcionalidades

- **Autenticação e Autorização**: Sistema JWT com roles (Admin, Manager, Kitchen, Attendant, Customer)
- **Gerenciamento de Pedidos**: Criação, atualização e rastreamento de pedidos em tempo real
- **Gerenciamento de Clientes**: CRUD completo de clientes
- **Gerenciamento de Produtos**: Catálogo de produtos com categorias e receitas
- **Gerenciamento de Estoque**: Controle de inventário com alertas de baixo estoque
- **Kitchen Display System (KDS)**: Tela em tempo real para a cozinha
- **Painel Administrativo**: Interface completa para gerenciamento
- **Módulo Cadastro (expansível)**: Itens de cadastro agrupados no menu lateral (Produto, Participante, Fiscal, Financeiro, Caixa Venda, Usuário, Veículo, Setor)
- **Módulo Faturamento (expansível)**: Emissão fiscal, documentos de transporte, orçamentos e vendas com submenus dedicados
- **Módulo PDV (expansível)**: Caixa, vendas e configurações do ponto de venda
- **Módulo Entrada de Nota (expansível)**: Cadastro, consulta, importação XML e tributação de NFe de entrada
- **Módulo Documentos Recebidos (expansível)**: Consultas, importações e manifestação de NFe/CTe recebidas
- **Módulo Pedido de Compra (expansível)**: Cadastro, consulta e cotação de compras
- **Módulo Assinador (expansível)**: Painel de assinaturas
- **Módulo Financeiro (expansível)**: Caixa, lançamentos, boletos, conciliações e controle financeiro
- **Módulo Fiscal (expansível)**: Lançamentos, arquivos fiscais, inventário e gestão de documentos
- **Módulo Estoque (expansível)**: Entradas, saídas, análises e ajustes de estoque
- **Módulo Produção (expansível)**: Ordens de produção, geração e matérias-primas
- **Módulo Delivery (expansível)**: Painel, entregadores e QR Code
- **Módulo Relatórios (expansível)**: Gerenciais, fiscais, financeiros e operacionais
- **Módulo Food (expansível)**: Dashboard, pedidos, pagamentos, alertas, fidelidade, cupons e mesas em um único agrupamento
- **WebSocket em Tempo Real**: Atualizações instantâneas entre sistemas
- **Service Worker**: Desativado por padrão (habilite com `VITE_ENABLE_SW=true` se quiser cache).
- **Cache com Redis**: Otimização de performance

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│          Frontend (Next.js) + KDS (React)       │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│     Backend API (Express.js) + WebSocket        │
│  ┌──────────────────────────────────────────┐   │
│  │  Auth | Orders | Products | Inventory   │   │
│  └──────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──┐  ┌──────▼──┐  ┌─────▼────┐
│PostgreSQL│  │ Redis   │  │  Queues  │
└──────────┘  └─────────┘  └──────────┘
```

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- pnpm (gerenciador de pacotes)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/marmitex-system.git
cd marmitex-system
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o banco de dados

```bash
# Crie um arquivo .env com as variáveis de ambiente
cp .env.example .env

# Atualize as credenciais do banco de dados
# DATABASE_URL="postgresql://user:password@localhost:5432/marmitex"
```

### 4. Execute as migrações

```bash
npx prisma migrate deploy
```

### 5. Inicie o servidor

```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

## 📚 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual

### Pedidos

- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar novo pedido
- `GET /api/orders/:id` - Obter detalhes do pedido
- `PATCH /api/orders/:id/status` - Atualizar status do pedido
- `POST /api/orders/:id/cancel` - Cancelar pedido

### Produtos

- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar novo produto
- `GET /api/products/:id` - Obter detalhes do produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Clientes

- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Criar novo cliente
- `GET /api/customers/:id` - Obter detalhes do cliente
- `PUT /api/customers/:id` - Atualizar cliente
- `DELETE /api/customers/:id` - Deletar cliente

### Inventário

- `GET /api/inventory` - Listar inventário
- `POST /api/inventory/update` - Atualizar estoque
- `GET /api/inventory/alerts` - Listar alertas de estoque
- `POST /api/inventory/alerts/:id/resolve` - Resolver alerta

## 🔐 Roles e Permissões

| Role | Permissões |
|------|-----------|
| **ADMIN** | Acesso total ao sistema |
| **MANAGER** | Gerenciamento de estoque e relatórios |
| **KITCHEN** | Visualização e atualização de pedidos (KDS) |
| **ATTENDANT** | Criação e gerenciamento de pedidos |
| **CUSTOMER** | Visualização de próprios pedidos |

## 🔄 Fluxo de Pedido

1. **Criação**: Atendente cria novo pedido no painel
2. **Confirmação**: Sistema valida estoque e confirma pedido
3. **Notificação**: WebSocket notifica KDS em tempo real
4. **Preparação**: Cozinha marca como "em preparação"
5. **Pronto**: Cozinha marca como "pronto"
6. **Entrega**: Atendente marca como "entregue"

## 📊 Banco de Dados

### Principais Tabelas

- **User**: Usuários do sistema
- **Customer**: Clientes
- **Product**: Produtos/itens do cardápio
- **Recipe**: Receitas associadas aos produtos
- **Order**: Pedidos
- **OrderItem**: Itens dentro de um pedido
- **InventoryItem**: Estoque de produtos
- **StockMovement**: Histórico de movimentações
- **StockAlert**: Alertas de estoque

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com cobertura
pnpm test:coverage
```

## 📝 Logging

Os logs são armazenados em:
- `logs/error.log` - Erros
- `logs/combined.log` - Todos os logs

## 🚢 Deploy

### Docker

```bash
# Build da imagem
docker build -t marmitex-system .

# Executar container
docker run -p 3001:3001 marmitex-system
```

### Docker Compose

```bash
docker-compose up -d
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

## 🗺️ Roadmap

- [ ] Integração com sistemas de pagamento
- [ ] Aplicativo mobile
- [ ] Relatórios avançados
- [ ] Integração com delivery
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-14
