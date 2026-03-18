# BHSIS Dashboard Web

## Objetivo (CRM)
Dashboard web para gestão de clientes, contas, pipeline e indicadores. Consome a API Core e eventos em tempo real.

## Tecnologias
- React
- Vite
- Leaflet (mapas)
- Socket.IO client
- Axios

## Estrutura
- `src/`: páginas, componentes e hooks.
- `public/`: assets estáticos.
- `vite.config.ts`: configuração do build.

## Execução local
```bash
cp .env.example .env
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Integrações
- API Core: métricas e dados do CRM.
- Tracking Service: eventos em tempo real (quando habilitado).

## Porta
- Compose: `4173`.
