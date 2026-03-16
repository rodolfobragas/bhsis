# Guia de Contribuição

Obrigado por considerar contribuir para o Marmitex System! Este documento fornece diretrizes e instruções para contribuir.

## Código de Conduta

Todos os contribuidores devem seguir nosso Código de Conduta:

- Seja respeitoso com os outros
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

## Como Contribuir

### Reportando Bugs

Antes de criar um relatório de bug, verifique se o problema já foi reportado. Se você encontrar um bug:

1. **Use um título descritivo** para o issue
2. **Descreva os passos exatos** para reproduzir o problema
3. **Forneça exemplos específicos** para demonstrar os passos
4. **Descreva o comportamento observado** e o que você esperava ver
5. **Inclua screenshots** se possível
6. **Mencione sua configuração** (SO, versão do Node.js, etc.)

### Sugerindo Melhorias

Sugestões de melhorias são bem-vindas! Para sugerir uma melhoria:

1. **Use um título descritivo**
2. **Forneça uma descrição detalhada** da melhoria sugerida
3. **Liste alguns exemplos** de como a melhoria seria útil
4. **Mencione outras aplicações** que implementam funcionalidades similares

### Pull Requests

- Siga os estilos de código do projeto
- Inclua testes apropriados
- Atualize a documentação conforme necessário
- Termine todos os arquivos com uma nova linha

## Processo de Desenvolvimento

### 1. Fork e Clone

```bash
git clone https://github.com/seu-usuario/marmitex-system.git
cd marmitex-system
```

### 2. Crie uma Branch

```bash
git checkout -b feature/sua-feature
```

Use nomes descritivos para branches:
- `feature/nova-funcionalidade`
- `fix/correcao-bug`
- `docs/atualizacao-documentacao`

### 3. Faça suas Mudanças

- Escreva código limpo e bem documentado
- Siga as convenções de código do projeto
- Adicione testes para novas funcionalidades
- Mantenha commits atômicos e bem descritos

### 4. Teste suas Mudanças

```bash
# Executar testes
pnpm test

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

### 5. Commit e Push

```bash
git add .
git commit -m "Descrição clara do que foi feito"
git push origin feature/sua-feature
```

### 6. Abra um Pull Request

- Descreva claramente o que foi mudado
- Referencie issues relacionadas
- Explique a motivação por trás das mudanças
- Inclua screenshots se relevante

## Padrões de Código

### TypeScript

- Use tipos explícitos quando possível
- Evite `any` a menos que absolutamente necessário
- Mantenha interfaces bem documentadas

### Exemplo:

```typescript
interface UserDTO {
  /** Email do usuário */
  email: string;
  
  /** Nome completo */
  name: string;
  
  /** Função do usuário no sistema */
  role: UserRole;
}
```

### Naming Conventions

- **Arquivos**: `kebab-case` (ex: `auth.service.ts`)
- **Classes**: `PascalCase` (ex: `AuthService`)
- **Funções**: `camelCase` (ex: `getUserById`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_RETRIES`)

### Estrutura de Pastas

```
server/
├── config/          # Configurações
├── middleware/      # Middlewares Express
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── websocket/       # Eventos WebSocket
└── index.ts         # Arquivo principal
```

## Commits

Use mensagens de commit claras e descritivas:

```
feat: adicionar novo endpoint de pedidos
fix: corrigir validação de email
docs: atualizar documentação da API
test: adicionar testes para serviço de autenticação
refactor: reorganizar estrutura de pastas
```

## Documentação

- Documente funções públicas com JSDoc
- Mantenha o README atualizado
- Adicione exemplos quando apropriado
- Documente mudanças significativas em CHANGELOG.md

## Exemplo de JSDoc:

```typescript
/**
 * Cria um novo pedido
 * @param data - Dados do pedido
 * @returns Pedido criado
 * @throws {Error} Se o cliente não existir
 */
async function createOrder(data: CreateOrderDTO): Promise<Order> {
  // implementação
}
```

## Revisão de Código

Todos os PRs devem ser revisados por pelo menos um mantenedor. Esperamos:

- Código limpo e bem testado
- Documentação adequada
- Sem conflitos com a branch principal
- Testes passando

## Dúvidas?

Sinta-se livre para:
- Abrir uma issue com a tag `question`
- Entrar em contato com os mantenedores
- Verificar a documentação existente

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT.

---

Obrigado por contribuir para tornar o Marmitex System melhor! 🎉
