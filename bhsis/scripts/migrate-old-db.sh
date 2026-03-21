#!/usr/bin/env bash
set -euo pipefail

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump não encontrado. Instale o cliente PostgreSQL." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql não encontrado. Instale o cliente PostgreSQL." >&2
  exit 1
fi

OLD_DATABASE_URL="${DATABASE_URL_OLD:-${DATABASE_URL:-}}"
if [[ -z "${OLD_DATABASE_URL}" ]]; then
  echo "Defina DATABASE_URL_OLD (ou DATABASE_URL) apontando para o banco antigo." >&2
  exit 1
fi

if [[ -z "${DATABASE_URL_AUTH:-}" ]]; then
  echo "Defina DATABASE_URL_AUTH apontando para auth_db." >&2
  exit 1
fi

if [[ -z "${DATABASE_URL_FOOD:-}" ]]; then
  echo "Defina DATABASE_URL_FOOD apontando para food_db." >&2
  exit 1
fi

psql "$DATABASE_URL_AUTH" -v ON_ERROR_STOP=1 <<'SQL'
SET search_path = bhsis, public;
TRUNCATE TABLE "ModuleAccess", "Session", "Module", "User" CASCADE;
SQL

psql "$DATABASE_URL_FOOD" -v ON_ERROR_STOP=1 <<'SQL'
SET search_path = bhsis, public;
TRUNCATE TABLE
  "OrderItem",
  "Delivery",
  "EventoEntrega",
  "PosicaoMotoboy",
  "Rota",
  "Order",
  "Motoboy",
  "StockMovement",
  "StockAlert",
  "InventoryItem",
  "Product",
  "Recipe",
  "Customer"
CASCADE;
SQL

# Auth tables
for table in 'bhsis."User"' 'bhsis."Module"' 'bhsis."ModuleAccess"' 'bhsis."Session"'; do
  echo "Migrando $table -> auth_db"
  pg_dump --data-only --column-inserts --table="$table" "$OLD_DATABASE_URL" | psql "$DATABASE_URL_AUTH" -v ON_ERROR_STOP=1
done

# Food tables (ordem respeitando dependências)
FOOD_TABLES=(
  'bhsis."Customer"'
  'bhsis."Recipe"'
  'bhsis."Product"'
  'bhsis."InventoryItem"'
  'bhsis."StockAlert"'
  'bhsis."StockMovement"'
  'bhsis."Motoboy"'
  'bhsis."Order"'
  'bhsis."OrderItem"'
  'bhsis."Delivery"'
  'bhsis."EventoEntrega"'
  'bhsis."PosicaoMotoboy"'
  'bhsis."Rota"'
)

for table in "${FOOD_TABLES[@]}"; do
  echo "Migrando $table -> food_db"
  pg_dump --data-only --column-inserts --table="$table" "$OLD_DATABASE_URL" | psql "$DATABASE_URL_FOOD" -v ON_ERROR_STOP=1
done

echo "Migração concluída."
