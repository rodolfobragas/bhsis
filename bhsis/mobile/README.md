# BHSIS Mobile (Estrutura Inicial)

Este diretório prepara a base para os apps móveis da Fase 6.

## Escopo inicial
- **Cliente**: cardápio, pedido, pagamento e rastreamento.
- **Garçom**: mesas, pedidos e status de preparo.
- **Cozinha**: KDS mobile, tempos e alertas.

## Próximos passos
1. Definir stack (Expo + React Native recomendado).
2. Estruturar monorepo ou apps separados:
   - `apps/customer`
   - `apps/waiter`
   - `apps/kitchen`
3. Conectar com APIs existentes (`/api/*`) e WebSocket.
4. Definir push notifications e modo offline.
