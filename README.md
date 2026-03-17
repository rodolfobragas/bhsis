# Sistema Delivery para Motoboys

Projeto modular com microserviços containerizados para gerenciar entregas, roteirização automática e rastreamento em tempo real.

## Componentes principais
- `api-core`: NestJS com API REST, TypeORM, Swagger e WebSocket (gateway tracking).
- `routing-service`: worker BullMQ que chama o Graphhopper VRP e salva a ordem das entregas.
- `tracking-service`: webhook do Traccar e socket em tempo real emitindo `posicao-motoboy`.
- `notification-service`: worker BullMQ para WhatsApp/SMS/push (mock) via fila `notificacoes.cliente`.
- `dashboard-web`: frontend React + Leaflet que consome `/dashboard/resumo` e rastreia motoboys.
- `motoboy-app`: PWA com login simples, lista ordenada, botões `INICIAR ENTREGA` e `ENTREGA CONCLUÍDA` e serviço worker.
- `docker/`: Compose para PostgreSQL/PostGIS, Redis, Traccar, Graphhopper e todos os serviços.
- `database/`: migrations PostGIS, seeds mínimos e scripts de execução.
- `docs/`: guia de implantação colaborativo para múltiplas IAs.
- `marmitex-system`: backend completo de restaurante (opcional no fluxo de delivery atual).

## Fluxo mínimo de implantação
1. Rodar `docker/graphhopper/download-brazil.sh` (baixa e importa dados do Brasil no Graphhopper).
2. Subir a stack com `docker/docker-compose.yml`
3. Após o Postgres estar pronto, executar `database/run-migrations.sh` e `database/run-seeds.sh`.
4. Configurar o webhook do Traccar (`http://tracking-service:3002/tracking/update`).
5. Consumir frontends em `http://localhost:4173` (dashboard) e `http://localhost:4174` (app do motoboy).
6. Usar Swagger em `http://localhost:4000/docs`, monitoring/Socket em `http://localhost:3002/realtime`.

## Observações
- Todas as aplicações usam as variáveis definidas em `.env.example`; adapte para produção.
- Mantenha `docs/deployment-tracking.md` atualizada para coordenar múltiplos agentes.

## Monitoramento de implantação
- Consulte `docs/implantation-status.md` para saber o status atual de cada módulo, quem está trabalhando nele e quais dependências/sentidos ainda faltam; atualize esta planilha sempre que concluir uma etapa crítica.

- O grafo `itabirito.osm-gh` foi criado com os dados extraídos via `osmconvert` e está disponível em `docker/graphhopper/data`; basta montar o volume e usar o comando `server /data/itabirito.osm.pbf` no compose para rodar apenas Itabirito.

## Dados Graphhopper regionais
- `docker/graphhopper/download-brazil.sh` agora aceita `REGION_PATH` (default `south-america/brazil-southeast.osm.pbf`, mas pode ser `south-america/brazil-latest.osm.pbf` para recortes).  
- Para focar somente em Minas Gerais, baixe o PBF completo e execute `docker run ... osmconvert /graphhopper/data/brazil-latest.osm.pbf -b=-51,-22,-39,-14 --complete-ways -o=/graphhopper/data/minas-gerais.osm.pbf`, depois rode `bash old/minyan.sh -f --file=/graphhopper/data/minas-gerais.osm.pbf` dentro da imagem `swatrider/graphhopper:latest` com `JAVA_TOOL_OPTIONS=-Xms1g -Xmx4g`.  
