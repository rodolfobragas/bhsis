# Documentação da API BHSIS

## Base URL

```
http://localhost:3000/api
```

## Autenticação

Todas as requisições (exceto login/register) devem incluir o token JWT no header:

```
Authorization: Bearer {token}
```

---

## Autenticação

### Registrar Usuário

**POST** `/auth/register`

```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "João Silva"
}
```

**Resposta (201)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "João Silva",
    "role": "CUSTOMER"
  }
}
```

### Login

**POST** `/auth/login`

```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "João Silva",
    "role": "ATTENDANT"
  }
}
```

### Obter Usuário Atual

**GET** `/auth/me`

**Resposta (200)**:
```json
{
  "user": {
    "userId": "uuid",
    "email": "usuario@example.com",
    "role": "ATTENDANT"
  }
}
```

---

## Pedidos

### Listar Pedidos

**GET** `/orders?status=PENDING&skip=0&take=50`

**Query Parameters**:
- `status` (optional): PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
- `skip` (optional): Número de registros a pular (padrão: 0)
- `take` (optional): Número de registros a retornar (padrão: 50)

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "orderNumber": "ORD-1234567890",
    "customerId": "uuid",
    "status": "PENDING",
    "subtotal": 100.00,
    "tax": 10.00,
    "total": 110.00,
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "quantity": 2,
        "unitPrice": 50.00,
        "total": 100.00
      }
    ],
    "createdAt": "2026-03-14T20:30:00Z"
  }
]
```

### Criar Pedido

**POST** `/orders`

**Body**:
```json
{
  "customerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "notes": "Sem cebola"
}
```

**Resposta (201)**:
```json
{
  "id": "uuid",
  "orderNumber": "ORD-1234567890",
  "customerId": "uuid",
  "status": "PENDING",
  "total": 110.00,
  "items": [...],
  "createdAt": "2026-03-14T20:30:00Z"
}
```

### Obter Pedido

**GET** `/orders/:id`

**Resposta (200)**:
```json
{
  "id": "uuid",
  "orderNumber": "ORD-1234567890",
  "customerId": "uuid",
  "status": "PENDING",
  "total": 110.00,
  "items": [...],
  "customer": {...},
  "createdAt": "2026-03-14T20:30:00Z"
}
```

---

## Pagamentos (Stripe)

### Criar sessão de checkout

**POST** `/payments/checkout-session`

**Body**:
```json
{
  "orderId": "uuid"
}
```

**Resposta (200)**:
```json
{
  "paymentId": "uuid",
  "sessionId": "cs_test_123",
  "url": "https://checkout.stripe.com/..."
}
```

### Criar Payment Intent

**POST** `/payments/intent`

**Body**:
```json
{
  "orderId": "uuid"
}
```

**Resposta (200)**:
```json
{
  "paymentId": "uuid",
  "clientSecret": "pi_123_secret_456",
  "paymentIntentId": "pi_123"
}
```

### Listar pagamentos de um pedido

**GET** `/payments/orders/:orderId`

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "orderId": "uuid",
    "status": "SUCCEEDED",
    "amount": 11000,
    "currency": "brl",
    "stripePaymentIntentId": "pi_123",
    "createdAt": "2026-03-17T12:00:00Z"
  }
]
```

---

## Fidelidade

### Listar níveis de fidelidade

**GET** `/loyalty/tiers`

**Resposta (200)**:
```json
[
  {
    "tier": "BRONZE",
    "minEarned": 0,
    "benefits": ["Pontos base por compra"]
  }
]
```

### Obter conta de fidelidade do cliente

**GET** `/loyalty/customers/:customerId`

**Resposta (200)**:
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "pointsBalance": 120,
  "totalEarned": 300,
  "totalRedeemed": 180,
  "tier": "SILVER"
}
```

### Listar transações de fidelidade

**GET** `/loyalty/customers/:customerId/transactions`

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "type": "EARN",
    "points": 50,
    "notes": "Pontos por pedido entregue",
    "createdAt": "2026-03-17T12:00:00Z"
  }
]
```

### Ajustar pontos manualmente

**POST** `/loyalty/customers/:customerId/adjust`

**Body**:
```json
{
  "points": -10,
  "notes": "Correção"
}
```

**Resposta (200)**:
```json
{
  "success": true
}
```

---

## Mesas

### Listar mesas

**GET** `/tables`

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Mesa 01",
    "capacity": 4,
    "status": "AVAILABLE",
    "location": "Salão principal",
    "active": true,
    "occupiedSince": null,
    "totalOccupiedMinutes": 120,
    "turnovers": 3
  }
]
```

### Criar mesa

**POST** `/tables`

**Body**:
```json
{
  "name": "Mesa 02",
  "capacity": 2,
  "status": "AVAILABLE",
  "location": "Varanda"
}
```

### Atualizar mesa

**PUT** `/tables/:id`

### Atualizar status

**PATCH** `/tables/:id/status`

**Body**:
```json
{
  "status": "OCCUPIED"
}
```

### Desativar mesa

**DELETE** `/tables/:id`

### Listar pagamentos (filtro por período)

**GET** `/payments?from=2026-03-01&to=2026-03-31`

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "orderId": "uuid",
    "status": "SUCCEEDED",
    "amount": 11000,
    "currency": "brl",
    "createdAt": "2026-03-17T12:00:00Z"
  }
]
```

### Webhook Stripe

**POST** `/payments/webhook`

> Requer `STRIPE_WEBHOOK_SECRET` configurado e assinatura `stripe-signature`.

### Reembolsar pagamento

**POST** `/payments/:paymentId/refund`

**Body (opcional)**:
```json
{
  "amount": 25.5
}
```

**Resposta (200)**:
```json
{
  "refundId": "re_123",
  "status": "succeeded",
  "amount": 2550,
  "currency": "brl"
}
```

### Relatório de receita

**GET** `/payments/report?from=2026-03-01&to=2026-03-31`

**Resposta (200)**:
```json
{
  "currency": "brl",
  "gross": 120000,
  "refunded": 5000,
  "net": 115000,
  "succeededCount": 12,
  "refundedCount": 1,
  "from": "2026-03-01T00:00:00.000Z",
  "to": "2026-03-31T23:59:59.000Z"
}
```

### Atualizar Status do Pedido

**PATCH** `/orders/:id/status`

**Body**:
```json
{
  "status": "PREPARING"
}
```

**Resposta (200)**:
```json
{
  "id": "uuid",
  "status": "PREPARING",
  "updatedAt": "2026-03-14T20:35:00Z"
}
```

### Cancelar Pedido

**POST** `/orders/:id/cancel`

**Resposta (200)**:
```json
{
  "id": "uuid",
  "status": "CANCELLED",
  "updatedAt": "2026-03-14T20:40:00Z"
}
```

---

## Produtos

### Listar Produtos

**GET** `/products?category=Bebidas&skip=0&take=50`

**Query Parameters**:
- `category` (optional): Filtrar por categoria
- `skip` (optional): Número de registros a pular
- `take` (optional): Número de registros a retornar

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Marmita de Frango",
    "sku": "MARM-001",
    "category": "Marmitas",
    "price": 25.00,
    "active": true,
    "createdAt": "2026-03-14T20:00:00Z"
  }
]
```

### Criar Produto

**POST** `/products` (Requer role: ADMIN)

**Body**:
```json
{
  "name": "Marmita de Frango",
  "sku": "MARM-001",
  "category": "Marmitas",
  "price": 25.00,
  "recipeId": "uuid"
}
```

**Resposta (201)**:
```json
{
  "id": "uuid",
  "name": "Marmita de Frango",
  "sku": "MARM-001",
  "category": "Marmitas",
  "price": 25.00,
  "createdAt": "2026-03-14T20:00:00Z"
}
```

### Obter Produto

**GET** `/products/:id`

**Resposta (200)**:
```json
{
  "id": "uuid",
  "name": "Marmita de Frango",
  "sku": "MARM-001",
  "category": "Marmitas",
  "price": 25.00,
  "recipe": {...},
  "inventoryItems": [...]
}
```

### Atualizar Produto

**PUT** `/products/:id` (Requer role: ADMIN)

**Body**:
```json
{
  "price": 28.00
}
```

**Resposta (200)**:
```json
{
  "id": "uuid",
  "price": 28.00,
  "updatedAt": "2026-03-14T20:45:00Z"
}
```

### Deletar Produto

**DELETE** `/products/:id` (Requer role: ADMIN)

**Resposta (200)**:
```json
{
  "id": "uuid",
  "active": false
}
```

---

## Clientes

### Listar Clientes

**GET** `/customers?skip=0&take=50`

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11999999999",
    "address": "Rua A, 123",
    "city": "São Paulo",
    "state": "SP",
    "active": true,
    "createdAt": "2026-03-14T20:00:00Z"
  }
]
```

### Criar Cliente

**POST** `/customers`

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "address": "Rua A, 123",
  "city": "São Paulo",
  "state": "SP"
}
```

**Resposta (201)**:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "createdAt": "2026-03-14T20:00:00Z"
}
```

### Obter Cliente

**GET** `/customers/:id`

**Resposta (200)**:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "orders": [...]
}
```

### Atualizar Cliente

**PUT** `/customers/:id`

**Body**:
```json
{
  "phone": "11988888888"
}
```

**Resposta (200)**:
```json
{
  "id": "uuid",
  "phone": "11988888888",
  "updatedAt": "2026-03-14T20:45:00Z"
}
```

### Deletar Cliente

**DELETE** `/customers/:id`

**Resposta (200)**:
```json
{
  "id": "uuid",
  "active": false
}
```

---

## Inventário

### Listar Inventário

**GET** `/inventory?productId=uuid`

**Query Parameters**:
- `productId` (optional): Filtrar por produto

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "quantity": 50,
    "minQuantity": 10,
    "maxQuantity": 100,
    "unit": "un",
    "product": {...},
    "movements": [...]
  }
]
```

### Atualizar Estoque

**POST** `/inventory/update` (Requer role: ADMIN, MANAGER)

**Body**:
```json
{
  "productId": "uuid",
  "quantity": 10,
  "reason": "Reabastecimento"
}
```

**Resposta (200)**:
```json
{
  "productId": "uuid",
  "quantity": 60
}
```

### Listar Alertas de Estoque

**GET** `/inventory/alerts` (Requer role: ADMIN, MANAGER)

**Resposta (200)**:
```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "alertType": "LOW_STOCK",
    "quantity": 5,
    "resolved": false,
    "product": {...}
  }
]
```

### Resolver Alerta

**POST** `/inventory/alerts/:id/resolve` (Requer role: ADMIN, MANAGER)

**Resposta (200)**:
```json
{
  "id": "uuid",
  "resolved": true,
  "resolvedAt": "2026-03-14T20:50:00Z"
}
```

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

## Rate Limiting

Limite: 100 requisições por minuto por IP

## Versionamento

API versão: v1
