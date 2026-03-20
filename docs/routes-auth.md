# Rotas após login (BHSIS)

Este documento lista as rotas que exigem autenticação e quais roles são necessárias.

## Autenticação
- `GET /api/auth/me` — autenticado

## Orders
- `POST /api/orders` — `ATTENDANT`, `ADMIN`
- `GET /api/orders` — autenticado
- `GET /api/orders/:id` — autenticado
- `PATCH /api/orders/:id/status` — `KITCHEN`, `ADMIN`
- `POST /api/orders/:id/cancel` — `ATTENDANT`, `ADMIN`

## Products
- `POST /api/products` — `ADMIN`
- `GET /api/products` — autenticado
- `GET /api/products/:id` — autenticado
- `PUT /api/products/:id` — `ADMIN`
- `DELETE /api/products/:id` — `ADMIN`

## Customers
- `POST /api/customers` — autenticado
- `GET /api/customers` — autenticado
- `GET /api/customers/:id` — autenticado
- `PUT /api/customers/:id` — autenticado
- `DELETE /api/customers/:id` — autenticado

## Inventory
- `GET /api/inventory` — autenticado
- `POST /api/inventory/update` — `ADMIN`, `MANAGER`
- `GET /api/inventory/alerts` — `ADMIN`, `MANAGER`
- `POST /api/inventory/alerts/:id/resolve` — `ADMIN`, `MANAGER`

## Coupons
- `POST /api/coupons` — `ADMIN`
- `GET /api/coupons` — `ADMIN`
- `GET /api/coupons/validate` — autenticado
- `GET /api/coupons/:id` — `ADMIN`
- `PUT /api/coupons/:id` — `ADMIN`
- `DELETE /api/coupons/:id` — `ADMIN`

## Loyalty
- `GET /api/loyalty/tiers` — `ADMIN`, `MANAGER`
- `GET /api/loyalty/customers/:customerId` — `ADMIN`, `MANAGER`
- `GET /api/loyalty/customers/:customerId/transactions` — `ADMIN`, `MANAGER`
- `POST /api/loyalty/customers/:customerId/adjust` — `ADMIN`, `MANAGER`

## Tables
- `POST /api/tables` — `ADMIN`, `MANAGER`
- `GET /api/tables` — `ADMIN`, `MANAGER`
- `GET /api/tables/:id` — `ADMIN`, `MANAGER`
- `PUT /api/tables/:id` — `ADMIN`, `MANAGER`
- `PATCH /api/tables/:id/status` — `ADMIN`, `MANAGER`
- `DELETE /api/tables/:id` — `ADMIN`, `MANAGER`

## Recipes
- `POST /api/recipes` — `ADMIN`, `MANAGER`
- `GET /api/recipes` — autenticado
- `GET /api/recipes/:id` — autenticado
- `PUT /api/recipes/:id` — `ADMIN`, `MANAGER`
- `DELETE /api/recipes/:id` — `ADMIN`, `MANAGER`

## Payments
- `POST /api/payments/checkout-session` — `ADMIN`, `ATTENDANT`, `CUSTOMER`
- `POST /api/payments/intent` — `ADMIN`, `ATTENDANT`, `CUSTOMER`
- `GET /api/payments` — `ADMIN`, `MANAGER`
- `GET /api/payments/orders/:orderId` — `ADMIN`, `ATTENDANT`
- `POST /api/payments/:paymentId/refund` — `ADMIN`, `MANAGER`
- `GET /api/payments/report` — `ADMIN`, `MANAGER`

## Rotas públicas (sem login)
- `GET /health`
- `GET /api/dashboard/summary`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/payments/webhook`
- `GET /api/oauth/callback`
