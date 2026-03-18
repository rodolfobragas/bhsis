
> **BHSIS CRM**: Este módulo foi reorientado para o CRM **BHSIS**.
> Documentação atualizada: `docs/bhsis-database.md`.
>
> O conteúdo abaixo é legado e serve apenas como referência histórica.

# Estrutura do Banco e Scripts

Use os scripts abaixo para preparar o banco PostgreSQL/PostGIS antes de iniciar os microsserviços.

## Pré-requisitos
- PostgreSQL com suporte a PostGIS (Imagem `postgis/postgis` no Docker Compose configurado em `docker/docker-compose.yml`).
- Comando `psql` acessível no host (incluído na imagem do container ou no seu ambiente).

## Execução
1. Copie ou defina variáveis de ambiente (mesmas do `.env.example` do `api-core`):
   ```bash
   export PGHOST=localhost
   export PGPORT=5432
   export PGUSER=postgres
   export PGPASSWORD=postgres
   export PGDATABASE=delivery
   ```
2. Rode as migrations:
   ```bash
   cd database
   chmod +x run-migrations.sh run-seeds.sh
   ./run-migrations.sh
   ```
3. Após as migrations, aplique os seeds (opcional no primeiro deploy):
   ```bash
   ./run-seeds.sh
   ```

## Conteúdo
- `migrations/001-init.sql` cria as tabelas principais, extensões PostGIS e constraints.
- `seeds/seed-basic.sql` insere motoboys, clientes e entregas de exemplo.
- `run-migrations.sh` e `run-seeds.sh` são wrappers para aplicar todos os arquivos ordenadamente.
