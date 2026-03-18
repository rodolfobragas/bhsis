
> **BHSIS CRM**: Este módulo foi reorientado para o CRM **BHSIS**.
> Documentação atualizada: `docs/bhsis-field-app.md`.
>
> O conteúdo abaixo é legado e serve apenas como referência histórica.

# App do Motoboy

PWA pensada para motoboys com login simples, lista ordenada por rota, botões "Iniciar" e "Entregar" e atalho para Google Maps.

## Instalação
```
cp .env.example .env
npm install
npm run dev
```

O serviço worker `service-worker.js` garante cache básico para simular funcionamento offline.
