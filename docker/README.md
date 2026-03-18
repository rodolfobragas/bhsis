
> **BHSIS CRM**: Este módulo foi reorientado para o CRM **BHSIS**.
> Documentação atualizada: `docs/bhsis-docker.md`.
>
> O conteúdo abaixo é legado e serve apenas como referência histórica.

# Infraestrutura Docker

Este diretório agrupa o `docker-compose` que orquestra toda a pilha de microsserviços e dependências.

## Passos pré-execução
1. **Baixar dados do GraphHopper (Brasil)**:
   ```bash
   cd docker/graphhopper
   chmod +x download-brazil.sh
   ./download-brazil.sh
   ```
   O script baixa o `.osm.pbf` e injeta no contêiner oficial para gerar o roteamento.

2. **Configurar webhook do Traccar**
   Após o primeiro `docker compose up`, acesse `http://localhost:8082` (usuário padrão `admin`/`admin`).
   No menu `Web Hooks`, crie uma nova integração apontando para `http://tracking-service:3002/tracking/update` e inclua os dados esperados (`deviceId`, `latitude`, `longitude`, `speed`, `timestamp`).

## Rodar a stack completa (Docker Hub v1.0.0)
```bash
cd docker
docker compose up -d
```

## Rodar a stack usando Docker Hub (v1.0.0)
```bash
cd docker
docker compose -f docker-compose.hub.yml up -d
```

## Banco de dados
- Execute os scripts em `../database/run-migrations.sh` e `../database/run-seeds.sh` após o container PostgreSQL estar saudável.
- Use as mesmas variáveis definidas em `api-core/.env.example` para `PGHOST/PORT/USER/PASSWORD/DATABASE`.

## Serviços levantados
- `postgres`: banco com PostGIS.
- `redis`: fila compartilhada por BullMQ.
- `graphhopper`: cálculo de rotas (porta 8989).
- `traccar`: rastreamento GPS (porta 8082).
- `api-core`: REST API NestJS e Swagger (`/docs`).
- `routing-service`: worker que consome `rotas.otimizar`.
- `tracking-service`: webhook do Traccar e Socket.io em `/realtime`.
- `notification-service`: worker de notificações (WhatsApp/SMS/push simulados).
- `dashboard-web`: painel React em `http://localhost:4173`.
- `motoboy-app`: PWA em `http://localhost:4174`.

## Observações
- Os aplicativos frontend assumem que a API Core está em `http://localhost:4000` e o tracking service em `http://localhost:3002`.
- As filas BullMQ utilizam o Redis compartilhado (`redis:6379`).
- O `notification-service` consulta a API Core (`/entregas/:id`) quando precisa enriquecer mensagens com telefone do cliente.
- Eventuais problemas de CORS devem ser tratados nas aplicações (já habilitei `app.enableCors()` no NestJS e nos sockets).
