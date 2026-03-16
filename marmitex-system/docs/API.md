# Documentação da API Marmitex

## Base URL

```
http://localhost:3001/api
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
