# Implantation Status

Última atualização: 2026-03-20

## Módulos
- Web: estrutura criada (menu + DB scaffolding). Funcionalidade em progresso.
- Agro: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Salões: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Clínicas: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Shop: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Pet: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Logística WMS: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Oficinas: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Escolas: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Frota: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Varejo: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Igrejas: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.
- Imobiliárias: estrutura criada (menu + DB scaffolding). Funcionalidade pendente.

## Notas
- Cada módulo possui banco dedicado (um `DATABASE_URL` por módulo).
- Auth é isolado em `auth_db` e dados entre módulos devem ser acessados via API.
