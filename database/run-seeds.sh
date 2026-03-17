#!/bin/sh
set -e

PGHOST=${PGHOST:-localhost}
PGPORT=${PGPORT:-5432}
PGUSER=${PGUSER:-postgres}
PGPASSWORD=${PGPASSWORD:-postgres}
PGDATABASE=${PGDATABASE:-delivery}
POSTGRES_CONTAINER=${POSTGRES_CONTAINER:-delivery-postgres}

run_psql() {
  if command -v psql >/dev/null 2>&1; then
    PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$1"
  else
    docker exec -i "$POSTGRES_CONTAINER" psql -U "$PGUSER" -d "$PGDATABASE" < "$1"
  fi
}

for seed in $(ls -1 seeds/*.sql | sort); do
  echo "Aplicando seed $seed"
  run_psql "$seed"
done
