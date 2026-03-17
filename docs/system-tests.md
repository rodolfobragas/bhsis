# Testes de Sistema (Smoke + Integração)

## Pré-requisitos
- Docker e Docker Compose instalados.
- Dados do Graphhopper disponíveis em `docker/graphhopper/data` (veja `docker/README.md`).

## Subir a stack
```bash
cd docker
docker compose up --build -d
```

## Aplicar migrations e seeds
```bash
cd ../database
./run-migrations.sh
./run-seeds.sh
```

## Health checks
```bash
curl -s http://localhost:4000/dashboard/resumo
curl -s http://localhost:3001/health
curl -s http://localhost:3002/health
curl -s http://localhost:3010/health
curl -s http://localhost:3000/api/dashboard/summary
```

## Fluxo mínimo de entrega
```bash
# criar entrega
curl -s -X POST http://localhost:4000/entregas \
  -H 'Content-Type: application/json' \
  -d '{"clienteId":"<uuid>","motoboyId":"<uuid>","latitude":"-20.5200","longitude":"-43.7500","endereco":"Rua Teste"}'

# listar entregas
curl -s http://localhost:4000/entregas

# enfileirar otimização de rota
curl -s -X POST http://localhost:4000/rotas/otimizar \
  -H 'Content-Type: application/json' \
  -d '{"motoboyId":"<uuid>","entregaIds":["<uuid>"]}'
```

## Tracking (simulado)
```bash
curl -s -X POST http://localhost:3002/motoboy/localizacao \
  -H 'Content-Type: application/json' \
  -d '{"motoboyId":"<uuid>","latitude":-20.5200,"longitude":-43.7500,"speed":30,"status":"em_entrega"}'
```

## Observação
Se o Traccar estiver habilitado, configure o webhook para `http://tracking-service:3002/tracking/update` e repita o fluxo acima com `deviceId`.
