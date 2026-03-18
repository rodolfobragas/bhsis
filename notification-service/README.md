
> **BHSIS CRM**: Este módulo foi reorientado para o CRM **BHSIS**.
> Documentação atualizada: `docs/bhsis-notification-service.md`.
>
> O conteúdo abaixo é legado e serve apenas como referência histórica.

# Notification Service

Serviço responsável por processar notificações aos clientes via filas BullMQ.

## Filas consumidas
- `notificacoes.cliente`: recebe payloads com `motoboyId`, `entregaId`, `phone`, `deviceId`, `status` e `message`.

## Canais
- WhatsApp e SMS (mesmo texto para ambos).
- Push Notification (envia dados para clientes logados).

## Execução
```
cp .env.example .env
npm install
npm run dev
```

O serviço expõe `/health` e consome automaticamente jobs, logando mensagens para acompanhamento manual.

## Dependências
- API Core em `API_CORE_URL` para resolver telefone de cliente quando faltante.
