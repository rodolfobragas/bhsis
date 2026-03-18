
> **BHSIS CRM**: Este módulo foi reorientado para o CRM **BHSIS**.
> Documentação atualizada: `docs/bhsis-dashboard-web.md`.
>
> O conteúdo abaixo é legado e serve apenas como referência histórica.

# Dashboard Web

Painel em React + Vite que exibe métricas, lista de entregas e exibe os motoboys em um mapa Leaflet atualizado via Socket.io.

## Execução
```
cp .env.example .env
npm install
npm run dev
```

## Tecnologias
- React + Vite
- Leaflet para mapas usando tiles do OpenStreetMap
- Socket.io-client para receber posições em tempo real
- Axios para consumir `/dashboard/resumo`
