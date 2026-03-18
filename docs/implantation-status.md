# Status de Implantação Multi-IA

**Progresso estimado: 79% (Dashboard summary validado e imagem Marmitex v1.0.0 empurrada para o hub; Traccar/Graphhopper seguem como bloqueios finais).**

## Objetivo
Este documento funciona como uma linha do tempo e checklist legível por humanos e modelos de IA. Ele responde às perguntas:
- Em qual módulo estamos trabalhando agora?
- O que falta fazer antes de avançar?
- Quais dependências ou bloqueios existem?

Modelos devem atualizar apenas os blocos correspondentes às áreas que tocam, sempre respeitando as convenções abaixo.

## Convenções obrigatórias (Para IA / humano)
1. Status devem usar apenas os valores escalonados: `Não iniciado`, `Em andamento`, `Bloqueado`, `Concluído`, `Aguardando revisão`.
2. Toda atualização precisa de timestamp ISO 8601 (ex.: `2026-03-16T16:53:00Z`) e o responsável.
3. Quando um módulo muda de status ou recebe novo próximo passo, registre a alteração em `## Notas recentes` com data e contexto.
4. Cada tabela segue a mesma ordem (módulo, objetivo, status, dependências, próximo passo, responsável, atualização).

## Painel de acompanhamento (checklist)
- [ ] **API Core** – Status: Em andamento. A rota `/api/dashboard/summary` entrega totais, pedidos/receita e tempo médio no schema principal; resta completar a documentação (Swagger) e validar o health-check junto com os sockets que alimentam o dashboard.
- [ ] **Routing Service** – Status: Em andamento. Workers `rotas.otimizar` calculam `ordem_rota`/`status` para as entregas, mas os eventos ainda não disparam notificações reais nem atualizam o tracking em tempo real; integrar as filas com `notification-service` e disparar eventos `rota.proxima`.
- [ ] **Tracking Service** – Status: Em andamento. `/tracking/update` persiste `posicoes_motoboy` e o broadcast agora inclui `deliveries` consultando o schema `public`; falta validar o webhook real do Traccar e o payload completo no dashboard/PWA.
- [ ] **Notification Service** – Status: Em andamento. O worker trata `rota.proxima`/`status.atualizado` e busca dados faltantes via API Core (`/entregas/:id`); falta validar os canais com dados reais do Traccar.
- [ ] **Dashboard Web** – Status: Em andamento. Consome `posicao-motoboy` via socket, porém o payload atual não traz `deliveries`, então a lista de entregas fica vazia; precisa do evento enriquecido para renderizar `ordem_rota` e `status` conforme especificado.
- [ ] **Motoboy App (PWA)** – Status: Em andamento. A PWA exige `deliveries` atualizadas no socket para corrigir `status`/`ordemRota` localmente; enquanto o tracking service não envia esse dado, os botões INICIAR/ENTREGA CONCLUÍDA apenas alteram o estado local.
- [ ] **Infraestrutura Docker Compose** – Status: Bloqueado. Os health-checks e `docker/.env.example` continuam em vigor, o `docker compose -f docker/docker-compose.yml build` reconstruiu as imagens e `rodolfobragas/bhsis:marmitex-system-v1.0.0` foi enviado ao Docker Hub, mas o Graphhopper ainda depende dos arquivos `.osm.pbf`/`.osm-gh` e o Traccar segue com `event.forward.enable=false` sem webhook configurado para o `tracking-service`.
- [ ] **Integração Marmitex System** – Status: Em andamento. Marmitex sobe isolado no Compose e pode evoluir como backend completo, porém o fluxo de delivery do API Core foi padronizado no schema `public` para manter a stack operando sem dependência do Prisma.
- [x] **Dados** – Status: Concluído. Migrations e seeds aplicados no Postgres com dados para MG/Itabirito.

## Quadro de status parseável (módulo por módulo)
| ID | Módulo | Objetivo | Status | Dependências | Próximo passo | Responsável | Última atualização |
|----|--------|----------|--------|--------------|---------------|-------------|---------------------|
| 1 | API Core | API REST NestJS com endpoints de entregas, rotas, rastreamento, Swagger e WebSocket, incluindo `/api/dashboard/summary` para métricas do painel. | Em andamento | PostgreSQL+PostGIS, Redis, Graphhopper, Tracking Service | Documentar o dashboard e ampliar para ordersByHour/topProducts antes de formalizar a observabilidade do health-check. | Codex | 2026-03-17T02:45:55Z |
| 2 | Routing Service | Worker Node + BullMQ que consulta Graphhopper VRP, atualiza `ordem_rota` e foca em filas `rotas.otimizar`. | Em andamento | Graphhopper VRP, Redis, PostgreSQL | Implementar integração HTTP com Graphhopper, payload de entregas em lote e persistência das rotas otimizadas. | Codex | 2026-03-16T16:53:00Z |
| 3 | Tracking Service | Endpoint `/tracking/update`, captura webhook Traccar, grava `posicoes_motoboy` e notifica socket. | Em andamento | Traccar, Redis/BullMQ, PostGIS, Notification Worker | O serviço consulta entregas direto no schema `public` e inclui `deliveries` no socket; falta validar webhook do Traccar e payload final. | Codex | 2026-03-16T23:59:00Z |
| 4 | Notification Service | Worker BullMQ desacoplado (WhatsApp/SMS/Push) que envia mensagens ao cliente. | Em andamento | Redis, Tracking Service, Routing Service, API Core | Worker formata mensagens para `rota.proxima`/`status.atualizado` e busca dados faltantes via API Core (`/entregas/:id`). | Codex | 2026-03-16T23:59:00Z |
| 5 | Dashboard Web | React + Vite + Leaflet exibindo mapa com motoboys e métricas. | Em andamento | API Core, Tracking Service, tiles OpenStreetMap | Consome `posicao-motoboy` (espera `deliveries` com `ordem_rota`/`status`), mas o payload emitido atualmente carece desses campos e a lista de entregas fica vazia; aguarda o tracking-service enriquecer os eventos em tempo real. | Codex | 2026-03-16T21:00:00Z |
| 6 | Motoboy App (PWA) | PWA com login, rota ordenada e botões de estado (INICIAR/ENTREGA CONCLUÍDA). | Em andamento | API Core, Tracking Service, Routing Service | PWA espera receber `deliveries` em cada socket `posicao-motoboy` para atualizar `ordemRota`/`status`; sem esse payload enriquecido o aplicativo apenas reflete os dados trazidos pelo `GET /entregas`. | Codex | 2026-03-16T21:00:00Z |
| 7 | Infraestrutura Docker Compose | Compose com PostgreSQL/PostGIS, Redis, Traccar, Graphhopper e serviços. | Bloqueado | Volumes `docker/graphhopper/data`, `docker/traccar/conf`, Redis/Postgres habilitados | Health-checks existem, o `docker compose -f docker/docker-compose.yml build` recompôs as imagens, mas o Graphhopper continua a exigir import manual dos arquivos `.osm.pbf` e `.osm-gh`, e o Traccar permanece com `event.forward.enable=false` sem o webhook apontando para o `tracking-service`, impedindo que o webhook real seja recebido; precisa documentar esses passos e habilitar o forwarding antes de fechar o quadro. | Codex | 2026-03-16T21:24:54Z |
| 8 | Dados | Migrations PostGIS, seeds iniciais para motoboys/clientes/entregas. | Concluído | API Core, PostgreSQL | Monitorar integridade dos registros gerados, preparar seeds adicionais se necessário e manter scripts úteis. | Codex | 2026-03-16T19:05:00Z |
| 9 | Integração Marmitex | Incorporação do backend Marmitex para unificar pedidos e entrega em um só projeto (`/marmitex-system`), agora com dashboard administrativo consumindo `/api/dashboard/summary`. | Em andamento | Marmitex (Express/Prisma/Next), Docker Compose | Iniciar fase 8 (CI/CD/monitoramento); Stripe adiado na fase 5. | Codex | 2026-03-17T10:43:19Z |

## Checklist de implementação atual

- [ ] API Core – REST, Swagger e WebSocket funcionando com PostgreSQL/PostGIS, Redis, Graphhopper e tracking. 
- [ ] Routing Service – Worker BullMQ integrado ao Graphhopper VRP, atualizando `ordem_rota` e enfileirando notificações. 
- [ ] Tracking Service – `/tracking/update` recebendo webhook do Traccar, gravando posições e emitindo dados via Socket.io/Bull; confirmar dados reais via Traccar e as entregas ativas no payload `posicao-motoboy`.
- [ ] Notification Service – BullMQ enviando WhatsApp/SMS/Push (mock) com templates e retries. 
- [ ] Dashboard Web – React + Leaflet consumindo APIs e sockets, mostrando motoboys e métricas em tempo real. 
- [ ] Motoboy App (PWA) – Login, rota ordenada, navegação externa e botões de estado. 
- [ ] Infraestrutura Docker Compose – Postgres/PostGIS, Redis, Traccar, Graphhopper, APIs, frontends e health-checks prontos; `docker compose -f docker/docker-compose.yml build` foi executado, mas os containers ainda precisam ser iniciados depois de preparar os dados `.osm.pbf/.osm-gh` e habilitar o forwarding do Traccar ao `tracking-service`.
- [ ] Integração Marmitex System – Repositório Marmitex copiado para o workspace `delivery-system`, mantido isolado até alinhar modelos Prisma com o fluxo de delivery. 
- [x] Dados – Migrations PostGIS e seeds executados para motoboys/clientes/entregas. 

- `2026-03-16T19:01:13Z (Codex)`: Graphhopper import concluído, CH preparado e servidor HTTP :8989 pronto após o recorte regional de Itabirito. O container segue em execução para atender ao VRP.  
- `2026-03-16T19:02:00Z (Codex)`: `docker compose up -d` lançado novamente com o mapeamento Postgres em 5433 e Redis em 6380 para evitar conflitos locais; API, Tracking, Routing e frontends subiram com sucesso.  
- `2026-03-16T19:03:00Z (Codex)`: Migration `001-init.sql` e `seed-basic.sql` aplicados diretamente no container Postgres (`psql -U postgres -d delivery`) para criar tabelas (`motoboys`, `clientes`, `entregas`, `rotas`, `posicoes_motoboy`, `eventos_entrega`) e dados iniciais. 
- `2026-03-16T19:11:00Z (Codex)`: `POST /entregas` e `GET /entregas`/`/entregas/{id}` confirmados dentro do container `api-core`; as respostas incluem `cliente`/`motoboy` populados e suportam lat/long como strings (`IsDecimal`).  
- `2026-03-16T19:16:00Z (Codex)`: Seed atualizado para coordenadas em Itabirito (MG) e tabelas resemadas para que o Graphhopper local tenha cobertura dos pontos usados.  
- `2026-03-16T19:20:00Z (Codex)`: `POST /rotas/otimizar` enfileirou job `rotas.otimizar`, o worker acionou fallback rodando `/route` do Graphhopper para calcular distâncias e, após o job, entregas receberam `ordem_rota` (1/2) e status `na_rota`.  
- `2026-03-16T19:10:56Z (Codex)`: POST `/entregas` via request Node executado dentro do container da API retornou 201 e inseriu nova entrega; os campos `latitude`/`longitude` precisam chegar como string para satisfazer o validador `IsDecimal`. 

## Tarefas ativas e checkpoints por módulo
1. **API Core** – Definir entidades `motoboys`, `clientes`, `entregas`, `rotas`, `posicoes_motoboy`, `eventos_entrega`; ligar NestJS com TypeORM e PostGIS; frases de status; `swagger` e `websocket` finalizados.
2. **Routing Service** – Preparar payload com entregas pendentes, chamar Graphhopper VRP, retornar `ordem_rota`, enfileirar notificação da próxima entrega.
3. **Tracking Service** – Criar consumidor de webhook `/tracking/update`, validar `deviceId` e `TRACCAR_WEBHOOK_SECRET`, gravar `posicoes_motoboy`, emitir socket e enfileirar recalculo quando necessário; próximo passo é validar o fluxo com Traccar real e confirmar `deliveries` no evento `posicao-motoboy`.
4. **Notification Service** – Configurar filas do BullMQ (`notificacoes.cliente`), handlers para WhatsApp/SMS/Push, templates e retries; aguardar os gatilhos vindos do tracking e routing para disparar `rota.proxima` e `status.atualizado` com os ids corretos.
5. **Dashboard Web** – Implementar Leaflet + mapa, WebSocket para motoboys transitando, métricas calculadas em realtime.
6. **Motoboy App** – Login rápido (token JWT), exibir rota ordenada e permitir navegação, manipular botões de status e chamar notificação do cliente; depende do fluxo `posicao-motoboy` enriquecido para ajustar `status`/`ordemRota` em tempo real.
7. **Infraestrutura** – Garantir `docker compose up --build` puxe imagens, `graphhopper` tenha dados do Brasil (os arquivos `.osm.pbf`/`.osm-gh` precisam ser baixados antes) e o `traccar` esteja configurado com webhook/forwarding para `tracking-service`; documentar este fluxo e atualizar as dependências conexas (`redis`, `postgres`).
8. **Dados** – Usar `database/migrations` com PostGIS (extensões `postgis`, `postgis_topology`), seeds de demo, e script `database/run-migrations.sh` para aplicar tudo.
9. **Integração Marmitex** – Adaptar os models Prisma, socket events e filas do Marmitex System para consumirem o módulo de rastreio/notifications e garantir que o backend (`server/index.ts`) levante junto com os microsserviços (tracking, routing, notification).

- [x] `npm install --legacy-peer-deps` em todos os serviços (executado 2026-03-16T16:51:00Z).  
- [x] Baixar `brazil-latest.osm.pbf` do Geofabrik (arquivo já em `docker/graphhopper/data`).  
- [x] Extrair `itabirito.osm.pbf` com `osmconvert` e gerar o grafo local (`itabirito.osm-gh`).  

- `2026-03-16T18:46:00Z (Codex)`: recorte de Itabirito (raio ~30 km) gerado com `osmconvert -b=-43.912,-20.412,-43.332,-19.866 --complete-ways` e importado com `JAVA_TOOL_OPTIONS=-Xms1g -Xmx4g bash old/minyan.sh -f --file=/graphhopper/data/itabirito.osm.pbf`; `itabirito.osm-gh` agora está disponível em `docker/graphhopper/data`.
- `2026-03-16T18:26:00Z (Codex)`: redirecionado foco para Minas Gerais; rodei `REGION_PATH=south-america/brazil-latest.osm.pbf IMPORT_ON_DOWNLOAD=0 docker/graphhopper/download-brazil.sh` para baixar o PBF completo e poder recortar somente Minas com `osmconvert` + `old/minyan.sh`.
- `2026-03-16T17:07:00Z (Codex)`: iniciada importação do Graphhopper com `old/minyan.sh -f --file=brazil-latest.osm.pbf`; os arquivos `.osm-gh` estão sendo gerados em `docker/graphhopper/data` e o container será interrompido após o processo.
- `2026-03-16T16:51:00Z (Codex)`: recreadas dependências com `npm install --legacy-peer-deps` em `api-core`, `routing-service`, `tracking-service`, `notification-service`, `dashboard-web`, `motoboy-app` dentro de containers Node 20 Alpine.
- `2026-03-16T16:22:00Z (Codex)`: iniciado `docker/graphhopper/download-brazil.sh`; o arquivo `brazil-latest.osm.pbf` está sendo transferido (~1,9 GB) e, ao finalizar o download, o import automático será disparado pelo próprio script.

## Como atualizar este quadro
1. Copie a linha da tabela do módulo que mudou de status e atualize `Status`, `Próximo passo`, `Responsável` e `Última atualização` (ISO + identificador).  
2. Acrescente a data e contexto em `## Notas recentes` (ex.: `2026-03-16T17:05:00Z (Codex): Graphhopper import concluído, arquivo salvo em docker/graphhopper/data`).  
3. Sempre mantenha o `Checklist urgente` consistente com o estado atual; risque o item com `[x]` quando concluído.  
4. Se identificar bloqueio externo (ex.: download lento, serviço offline), adicione novo bloco `## Bloqueios` com descrição e traceback breve.

## Notas recentes
- 2026-03-18T11:38:28Z (Codex): Faturamento recebeu submenu de Condicional com rotas placeholder para cadastro, consulta e produtos em condicional.
- 2026-03-18T03:03:03Z (Codex): Faturamento recebeu submenu de Orçamento com rotas placeholder para cadastro, consulta e produtos reservados.
- 2026-03-18T03:02:06Z (Codex): Faturamento recebeu submenu de Conhecimento de Transporte - OS com rotas placeholder para emissão, consulta e correção.
- 2026-03-18T03:00:38Z (Codex): Faturamento recebeu submenus de Manifesto de Documentos (MDFe) e Conhecimento de Transporte (CTe) com rotas placeholder específicas.
- 2026-03-18T02:56:19Z (Codex): Faturamento recebeu submenus de Notas Fiscais Eletrônicas e Notas Fiscais de Serviço com novas rotas placeholder (NFe/NFSe).
- 2026-03-18T02:36:17Z (Codex): Cadastro ganhou novos submenus e rotas placeholder para Fiscal, Financeiro, Caixa Venda, Usuário, Veículos e Setor, incluindo páginas dedicadas para cada opção.
- 2026-03-18T02:26:48Z (Codex): Cadastro → Participante ganhou submenu com Cadastras, Consultar, Cargo, Grupo, Vendedor x Cliente, Relatório de Crédito, Relatório de Aniversariantes e Manutenção de Participantes (rotas placeholder).
- 2026-03-18T02:16:56Z (Codex): Cadastro → Produto ganhou submenu com Cadastrar, Consultar, Busca Preço e Consulta Rápida (rotas placeholder).
- 2026-03-18T02:04:18Z (Codex): Estrutura do sistema consolidada: módulo Food marcado como funcional e demais módulos como em desenvolvimento (placeholders).
- 2026-03-18T01:54:42Z (Codex): Desativei o service worker por padrão (VITE_ENABLE_SW=false) para evitar cache antigo e corrigi import do ícone do menu PDV.
- 2026-03-18T01:36:37Z (Codex): Atualizado cache do service worker do Marmitex para evitar assets antigos (menu completo não aparecia).
- 2026-03-18T01:27:46Z (Codex): Reorganizado o menu do Marmitex com módulo FOOD agrupando Dashboard, Pedidos, Pagamentos, Alertas, Fidelidade, Cupons e Mesas.
- 2026-03-17T23:23:19Z (Codex): Novos módulos no Marmitex (PDV, Entrada de Nota, Documentos Recebidos, Pedido de Compra, Assinador, Financeiro, Fiscal, Estoque, Produção, Delivery e Relatórios) com submenus e rotas placeholder adicionados.
- 2026-03-17T22:54:25Z (Codex): Módulo FATURAMENTO adicionado ao menu lateral do Marmitex com submenus fiscais/operacionais e rotas placeholder dedicadas.
- 2026-03-17T22:47:45Z (Codex): Imagem `rodolfobragas/bhsis:marmitex-system-v1.0.11` publicada no Docker Hub e `docker/docker-compose.yml` atualizado para usar o novo tag.
- 2026-03-17T22:40:14Z (Codex): Menu lateral do Marmitex recebeu módulo CADASTRO expansível com subitens (Produto, Participante, Fiscal, Financeiro, Caixa Venda, Usuário, Veículo, Setor) e rotas placeholder dedicadas.
- 2026-03-17T14:20:00Z (Codex): Fidelidade recebeu níveis/benefícios e notificações; mesas passaram a registrar ocupação/turnover no admin.
- 2026-03-17T13:03:47Z (Codex): PWA básica habilitada (manifest + service worker) e estrutura inicial de app mobile documentada.
- 2026-03-17T12:58:07Z (Codex): Fase 6 (UX/UI) com responsividade, animações leves, feedback visual e ajustes de acessibilidade (labels/alerta) concluídos.
- 2026-03-17T12:47:14Z (Codex): Imagem `marmitex-system-v1.0.9` publicada com menu Pagamentos, histórico e reembolsos; toggle de tema habilitado.
- 2026-03-17T12:42:53Z (Codex): Fase 6 iniciada: tema claro/escuro habilitado com toggle no layout e nova página de Pagamentos no admin (histórico + reembolsos).
- 2026-03-17T12:25:20Z (Codex): Implementados reembolsos Stripe, relatório de receita e histórico de pagamentos no admin (dialog na tela de pedidos).
- 2026-03-17T12:13:15Z (Codex): Integração Stripe adicionada (PaymentIntent/Checkout Session, webhook, tabela de pagamentos, paymentStatus no pedido e botão de cobrança no admin).
- 2026-03-17T11:22:54Z (Codex): Corrigido o login/admin: client agora usa `/api` no mesmo host (evita apontar para porta errada) e o guard de permissões compara roles sem diferenciar maiúsculas/minúsculas; imagem `rodolfobragas/bhsis:marmitex-system-v1.0.6` construída para refletir o ajuste.
- 2026-03-17T10:56:54Z (Codex): `prisma db push` aplicado após detectar drift, sincronizando schema `marmitex`; smoke test HTTP ok (health/products/recipes).
- 2026-03-17T10:54:43Z (Codex): `pnpm prisma migrate deploy` executado apontando para Postgres local (5433) com schema `marmitex`; sem migrações pendentes.
- 2026-03-17T10:43:19Z (Codex): Testes executados e imagem `rodolfobragas/bhsis:marmitex-system-v1.0.4` publicada; compose atualizado.
- 2026-03-17T10:39:48Z (Codex): Tratamento de erros/retry no client, KDS via WebSocket real e receitas integradas ao backend (inclui cálculo de ingredientes por pedido).
- 2026-03-17T10:30:32Z (Codex): Integração do painel admin com API real (auth, produtos, clientes, pedidos, inventário e alertas).
- 2026-03-17T03:48:58Z (Codex): Testes executados e imagem `rodolfobragas/bhsis:marmitex-system-v1.0.3` publicada após concluir Fase 5 (cupons/fidelidade/mesas).
- 2026-03-17T03:44:07Z (Codex): Fase 5 finalizada para cupons, fidelidade e mesas com rotas/API + telas admin; Stripe marcado como adiado.
- 2026-03-17T03:30:13Z (Codex): Nova imagem `rodolfobragas/bhsis:marmitex-system-v1.0.2` publicada após concluir Fase 4 e rodar `pnpm test`; compose atualizado.
- 2026-03-17T03:27:15Z (Codex): Fase 4 do Marmitex finalizada com filtros, métricas de conversão/ticket, analytics operacionais, relatórios expandidos e agendamento simples de CSV.
- 2026-03-17T03:13:54Z (Codex): `pnpm test` executado no Marmitex (vitest ok) e imagem `rodolfobragas/bhsis:marmitex-system-v1.0.1` construída e enviada ao Docker Hub; compose atualizado para o novo tag.
- 2026-03-17T03:07:11Z (Codex): Adicionada sidebar admin expansível/recolhível e aplicada em todas as rotas admin (dashboard, pedidos, produtos, clientes, inventário, receitas, alertas).
- 2026-03-17T03:01:42Z (Codex): Relatórios PDF/Excel (CSV) adicionados ao dashboard Marmitex; fase 4 concluída no escopo de gráficos + exportação.
- 2026-03-17T02:57:11Z (Codex): Painel administrativo do Marmitex passou a renderizar pedidos por hora e top produtos (fase 4 concluída, faltam relatórios PDF/Excel).
- 2026-03-17T02:45:55Z (Codex): `/api/dashboard/summary` testado no container `delivery-marmitex-system` reconstruído com `rodolfobragas/bhsis:marmitex-system-v1.0.0`, o push para o Docker Hub foi concluído e a documentação/roadmap refletem o novo status do dashboard.
- 2026-03-16T23:59:00Z (Codex): Padronizei o fluxo de entregas no schema `public` (API Core + routing/tracking/notification) e removi a dependência direta do Marmitex API nos microsserviços de delivery; o socket `posicao-motoboy` volta a carregar `deliveries` do banco principal.
- 2026-03-16T19:39:11Z (Codex): `POST /tracking/update` (device-carlos) aceitou lat/long como strings e criou o registro `posicoes_motoboy`, comprovando que o webhook persiste posições e emite `posicao-motoboy` com os dados enviados.
- 2026-03-16T19:41:06Z (Codex): Notification worker agora formata a mensagem com o tipo do job (`rota.proxima`, `cliente.proximo`, `status.atualizado`) e loga o payload; um job `rota.proxima` com `phone`, `deviceId` e `entregaId` disparou WhatsApp/SMS/Push simulados com “Sua entrega será a próxima…” e o console reportou o canal.
- 2026-03-16T19:43:37Z (Codex): Atualizei o painel de acompanhamento e os próximos passos para Tracking Service e Notification Service, destacando o enriquecimento do evento socket e a entrega “Sua entrega será a próxima…” nas filas.
- 2026-03-16T19:55:00Z (Codex): A auditoria do socket `posicao-motoboy` confirmou que o payload atual não traz `deliveries` com `ordem_rota`/`status`, de modo que o dashboard e o PWA continuam mostrando “Sem entregas ativas” e mantêm apenas a posição bruta.
- 2026-03-16T20:15:50Z (Codex): Refinei a infraestrutura Docker Compose com health-checks para Postgres/Redis/Graphhopper/Traccar/API/Routing/Tracking/Notification, adicionei `docker/.env.example` e o `docker/traccar/conf/traccar.xml` mínimo; o `docs/implantation-status.md` agora documenta dependências e passos finais.
- 2026-03-16T20:52:00Z (Codex): Revisão do Dashboard Web/PWA confirmou que ambos consomem `posicao-motoboy` esperando o array `deliveries` com `ordem_rota` e `status`; enquanto o tracking-service não envia essa estrutura, as interfaces continuam mostrando “Sem entregas ativas”.
- 2026-03-16T21:05:00Z (Codex): Ao revisar o Docker Compose verifiquei que os health-checks estão presentes, mas o Graphhopper depende de import manual dos arquivos `.osm.pbf` e `.osm-gh`, e o Traccar ainda usa `event.forward.enable=false` sem apontar o webhook para `tracking-service`, o que bloqueia a recepção automática dos dados do Traccar.
- 2026-03-16T21:50:00Z (Codex): O tracking-service agora invoca o Marmitex REST (`/api/deliveries`) via `marmitex.client`, registra posições em cada entrega ativa e emite `deliveries` no evento `posicao-motoboy`. Isso garante que dashboard e PWA recebam `ordem_rota`/`status` diretamente do backend compartilhado.
- 2026-03-16T21:55:00Z (Codex): O middleware de autenticação aceita o `x-service-token` do ambiente e as rotas de delivery foram expostas com filtros/posições para integrar os workers (tracking/routing/notification). Saúde do socket e do serviço de delivery estão documentadas na stack unificada.
- 2026-03-16T21:40:00Z (Codex): Serviço `delivery` foi implementado (`/server/services/delivery.service.ts`) com eventos `delivery:*`, eventos armazenados (`EventoEntrega`) e APIs que criam atualizam status e gravam posições.
- 2026-03-16T21:42:00Z (Codex): `setupWebSocketEvents` agora cobre os eventos `delivery:created`, `delivery:status-updated`, `delivery:position` e `delivery:next`, e as rotas `/api/deliveries` foram registradas no gateway Express para expor o novo fluxo.
- 2026-03-16T21:40:00Z (Codex): Prisma do Marmitex foi atualizado com as tabelas motoboy/entrega/evento/rota/posição, preparando a base para que os dados de tracking compartilhem o mesmo banco.
- 2026-03-16T21:42:00Z (Codex): O WebSocket agora expõe `delivery:created`, `delivery:status-updated`, `delivery:position` e `delivery:next`, retransmitindo para `role:ADMIN`, `role:ATTENDANT` e os usuários ligados aos motoboys.
- 2026-03-16T21:50:00Z (Codex): Tracking e routing services utilizam o `/api/deliveries` do Marmitex via `marmitex.client`, enviando posições e atualizando status com o token `x-service-token` e enriquecendo o socket `posicao-motoboy` com `deliveries`.
- 2026-03-16T22:05:00Z (Codex): Docker Compose foi atualizado para incluir o backend Marmitex (`delivery-marmitex-system`) com a mesma Postgres/Redis, os microsserviços agora partilham `MARMITEX_API_URL`/`MARMITEX_SERVICE_TOKEN` e há health-check no novo serviço.
- 2026-03-16T21:25:00Z (Codex): Copiei o repositório Marmitex System para `delivery-system/marmitex-system` e passei a considerar esse diretório como o oficial do projeto; isso permite avançar com a integração das filas/orders/tracking dentro do mesmo workspace.
- 2026-03-16T21:24:54Z (Codex): Executado `docker compose -f docker/docker-compose.yml build` no workspace atual para regenerar as imagens das APIs, workers e frontends (Node 20/Vite/Prisma) e confirmar que os artefatos conseguem ser produzidos; falta subir os containers com `docker compose up` depois de garantir os arquivos `.osm.pbf`/`.osm-gh` do Graphhopper e o webhook `event.forward` do Traccar apontando para o `tracking-service`.
- 2026-03-16T22:46:45Z (Codex): A sincronização Prisma apontou `public.Delivery` e o `tracking-service` caiu com `relation "public"."Delivery" does not exist`; criei o schema `marmitex` e as tabelas existem lá, porém o `search_path` não inclui `marmitex`, então as migrações/queries continuam buscando no schema `public` e não encontram os registros. Até corrigirmos esse `search_path` (ou ajustarmos o `schema` do datasource) o tracking-service não consegue recuperar as entregas ordenadas e os sockets seguem vazios.
- 2026-03-16T23:23:03Z (Codex): Adicionei a migration `20260316231355_add_delivery_models` (Motoboy/Delivery/Evento/Posicao/Rota) e os hooks que enfileiram `rota.proxima`/`status.atualizado`, mas o backend Marmitex continua tentando ler `public.Delivery` porque o Prisma Client efetivamente fica no schema `public`; a chamada `GET /api/deliveries` segue falhando com `relation "public"."Delivery" does not exist`, impedindo que o tracking-service receba `deliveries` com `ordem_rota`/`status`.
- 2026-03-16T23:33:51Z (Codex): Atualizei o percentual e checklist do documento; ao revisar o Docker Compose (health-checks, `docker/.env.example`, dependências Traccar/Graphhopper/Redis) confirmei que os checks cobrem Postgres/Redis/Graphhopper/Traccar/API, mas o Graphhopper continua travado até ter os arquivos `.osm.pbf`/`.osm-gh` disponíveis e o `.env` ainda não expõe a variável `TRACCAR_EVENT_FORWARD_URL`/`events.forward.url`, portanto documentei esses bloqueios no quadro.

## Bloqueios e dependências externas
- Grafos regionais: `docker/graphhopper/data` precisa receber o `brazil-latest.osm.pbf` (ou outro recorte válido) e gerar o `.osm-gh` via `old/minyan.sh`; o health-check `ls /data/*.osm-gh` validado no `docker compose` permanece `unhealthy` enquanto esses arquivos não existirem, então a renderização do VRP fica bloqueada e o serviço não responde. O `docker/.env.example` documenta o host/pass do Graphhopper, mas ainda não lista os passos para baixar/importar o `.osm.pbf`/`.osm-gh`.
- Traccar não encaminha eventos ao tracking-service por padrão porque `event.forward.enable` segue como `false` e não há `events.forward.url`; é necessário habilitar o forwarding via painel (ou definir `TRACCAR_EVENT_FORWARD_URL` no `.env`) com o `TRACCAR_WEBHOOK_SECRET` correto para que o POST /tracking/update receba dados reais. O compose já inclui `traccar` e o health-check verifica o serviço, mas a configuração do webhook precisa ser aplicada manualmente antes que o tracking-service receba eventos.
- Redis e Postgres precisam estar `healthy` antes de iniciar BullMQ; os health-checks agora garantem a ordem e os frontends dependem de `api-core` e `tracking-service` também saudáveis.
- Tokens de serviço: o Marmitex System depende de `SERVICE_TOKEN`; manter esse valor consistente apenas se a integração com os microsserviços for reativada.
- Prisma/migrations: o Marmitex System usa o schema `marmitex`, enquanto o fluxo de entregas do API Core foi padronizado no schema `public`. Manter isolamento até a integração formal.

> Este documento garante que qualquer modelo de IA consiga inspecionar o estado do projeto, entender o que falta e quem é o responsável antes de tocar seu módulo. Atualize-o toda vez que fizer um commit ou alterar o fluxo.
