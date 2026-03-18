# BHSIS Database

## Objetivo (CRM)
Scripts de migração e seed para o banco PostgreSQL/PostGIS usado pelos serviços do BHSIS.

## Estrutura
- `migrations/`: scripts SQL versionados.
- `seeds/`: dados de exemplo.
- `run-migrations.sh`: aplica migrations.
- `run-seeds.sh`: aplica seeds.

## Execução
```bash
cd database
chmod +x run-migrations.sh run-seeds.sh
./run-migrations.sh
./run-seeds.sh
```

## Variáveis necessárias
Usa as mesmas variáveis do `.env` do API Core:
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.
