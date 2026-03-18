# Design System Completo para Projeto Web

## 1. Introdução

Este documento detalha o **Design System** completo para o seu novo projeto web, servindo como a fonte central de verdade para todos os aspectos visuais e interativos. Um Design System é uma coleção de princípios, diretrizes, padrões e componentes reutilizáveis que garantem a consistência, a eficiência e a escalabilidade do design e desenvolvimento de produtos digitais.

**Benefícios de um Design System:**
*   **Consistência e Coerência:** Garante uma experiência de usuário unificada em todas as plataformas e funcionalidades.
*   **Eficiência e Velocidade:** Acelera o processo de design e desenvolvimento através da reutilização de componentes e padrões.
*   **Qualidade e Manutenibilidade:** Eleva o padrão de design e facilita a manutenção e evolução do produto.
*   **Colaboração Aprimorada:** Facilita a comunicação e o alinhamento entre equipes de design, desenvolvimento e produto.

## 2. Princípios de Design

Os seguintes princípios devem guiar todas as decisões de design e desenvolvimento dentro deste sistema:

*   **Clareza:** A informação deve ser apresentada de forma direta, compreensível e sem ambiguidades, priorizando a funcionalidade.
*   **Usabilidade:** A interface deve ser intuitiva, fácil de aprender e eficiente, permitindo que os usuários realizem suas tarefas com o mínimo esforço.
*   **Modernidade:** Adotar uma estética contemporânea, limpa e profissional, que transmita confiança e inovação.
*   **Consistência:** Manter padrões visuais e de interação rigorosos em todos os elementos e fluxos do sistema.
*   **Responsividade:** Assegurar que a experiência seja fluida e otimizada em qualquer dispositivo ou tamanho de tela.
*   **Acessibilidade:** Projetar e desenvolver para que o sistema seja utilizável por pessoas com diversas habilidades e necessidades.

## 3. Fundamentos Visuais

### 3.1. Cores

A paleta de cores é a base da identidade visual, transmitindo a personalidade da marca e fornecendo feedback visual. a paleta foca em tons de azul para interatividade e neutros para o conteúdo, com cores de feedback claras.

#### 3.1.1. Paleta Principal

| Categoria       | Nome da Cor     | Código HEX | RGB (Exemplo)       | Uso Semântico                                                    |
| :-------------- | :-------------- | :--------- | :------------------ | :--------------------------------------------------------------- |
| **Primárias**   | Azul Principal  | `#1D50DC`  | `rgb(29, 80, 220)`  | Ações primárias, botões principais, cabeçalhos, links ativos.    |
|                 | Azul Secundário | `#4A7FEA`  | `rgb(74, 127, 234)` | Estados de hover/foco para elementos primários, gráficos, destaques secundários. |
| **Neutras**     | Branco Fundo    | `#FCFBFB`  | `rgb(252, 251, 251)`| Fundo principal da aplicação, cards, modais, painéis.            |
|                 | Cinza Claro     | `#E0E0E0`  | `rgb(224, 224, 224)`| Bordas de componentes, divisores, fundos de seções secundárias, estados desabilitados. |
|                 | Cinza Texto     | `#424242`  | `rgb(66, 66, 66)`   | Texto principal, títulos, rótulos de formulário.                 |
|                 | Cinza Escuro    | `#212121`  | `rgb(33, 33, 33)`   | Texto de alto contraste, ícones importantes, elementos de destaque. |

#### 3.1.2. Paleta de Feedback

| Categoria       | Nome da Cor     | Código HEX | RGB (Exemplo)       | Uso Semântico                                                    |
| :-------------- | :-------------- | :--------- | :------------------ | :--------------------------------------------------------------- |
| **Sucesso**     | Verde Sucesso   | `#4CAF50`  | `rgb(76, 175, 80)`  | Mensagens de sucesso, ícones de confirmação, indicadores positivos. |
| **Erro**        | Vermelho Erro   | `#F44336`  | `rgb(244, 67, 54)`  | Mensagens de erro, validação de formulários, ações destrutivas.  |
| **Aviso**       | Amarelo Aviso   | `#FFC107`  | `rgb(255, 193, 7)`  | Mensagens de alerta, notificações de atenção, status pendente.   |
| **Informação**  | Azul Informação | `#2196F3`  | `rgb(33, 150, 243)` | Mensagens informativas, dicas, tutoriais.                        |

### 3.2. Tipografia

A tipografia define a hierarquia e a legibilidade do conteúdo. A fonte `Roboto` é a escolha principal, complementada por `"Helvetica Neue"` e `sans-serif` para máxima compatibilidade e clareza.

**Família de Fontes:** `Roboto, "Helvetica Neue", sans-serif`

**Escala Tipográfica:**

| Tipo          | Tamanho (px) | Peso (Font Weight) | Line Height (em) | Uso                                                              |
| :------------ | :----------- | :----------------- | :--------------- | :--------------------------------------------------------------- |
| Título H1     | 36px         | Bold (700)         | 1.2              | Títulos de página principais, dashboards.                        |
| Título H2     | 28px         | Semi-Bold (600)    | 1.3              | Títulos de seções principais.                                    |
| Título H3     | 22px         | Medium (500)       | 1.4              | Subtítulos, títulos de componentes, modais.                      |
| Título H4     | 18px         | Medium (500)       | 1.5              | Títulos de cards, itens de lista importantes.                    |
| Corpo Grande  | 16px         | Regular (400)      | 1.6              | Parágrafos de texto principal, descrições longas.                |
| Corpo Padrão  | 14px         | Regular (400)      | 1.6              | Itens de menu, rótulos de formulário, texto de tabelas, corpo de texto padrão. |
| Corpo Pequeno | 12px         | Regular (400)      | 1.6              | Textos auxiliares, legendas, informações de rodapé, metadados.   |

### 3.3. Espaçamento

Uma escala de espaçamento consistente, baseada em múltiplos de 8px, é crucial para criar hierarquia visual, legibilidade e harmonia no layout.

| Variável      | Valor (px) | Uso                                                              |
| :------------ | :--------- | :--------------------------------------------------------------- |
| `spacing-xxs` | 2px        | Espaçamento mínimo para elementos muito pequenos.                |
| `spacing-xs`  | 4px        | Espaçamento entre ícones e texto, elementos inline.              |
| `spacing-sm`  | 8px        | Espaçamento padrão entre elementos de formulário, itens de lista. |
| `spacing-md`  | 16px       | Espaçamento entre seções menores, padding interno de componentes. |
| `spacing-lg`  | 24px       | Espaçamento entre seções maiores, margens de blocos de conteúdo. |
| `spacing-xl`  | 32px       | Espaçamento entre grandes blocos de conteúdo, seções de página.  |
| `spacing-xxl` | 48px       | Margens externas de página, grandes divisões de layout.          |
| `spacing-xxxl`| 64px       | Espaçamento para seções hero, grandes separações.                |

### 3.4. Ícones

A biblioteca **Font Awesome** é a referência para todos os ícones do sistema, garantindo uma vasta gama de opções, escalabilidade vetorial e consistência visual. Os ícones devem ser usados para complementar o texto, indicar ações ou categorizar informações, sempre com clareza e propósito.

**Diretrizes de Uso:**
*   **Propósito:** Cada ícone deve ter um propósito claro e ser facilmente reconhecível.
*   **Tamanho:** Utilizar tamanhos consistentes dentro de um contexto (ex: todos os ícones de menu têm o mesmo tamanho).
*   **Cor:** A cor dos ícones deve seguir a paleta de cores do Design System, geralmente `Cinza Texto` ou `Azul Principal` para interativos.
*   **Alinhamento:** Garantir alinhamento adequado com o texto ou outros elementos.

### 3.5. Grid e Layout

Um sistema de grid flexível, baseado em 12 colunas, é recomendado para organizar o conteúdo de forma responsiva e alinhada. Isso permite que os elementos se ajustem harmoniosamente em diferentes tamanhos de tela.

**Breakpoints Sugeridos:**

| Dispositivo | Largura Mínima | Uso                                                              |
| :---------- | :------------- | :--------------------------------------------------------------- |
| Mobile      | 320px          | Smartphones (portrait)                                           |
| Tablet      | 768px          | Tablets (portrait), smartphones (landscape)                      |
| Desktop     | 1024px         | Laptops, desktops pequenos                                       |
| Large       | 1440px         | Desktops maiores, monitores de alta resolução                     |

## 4. Componentes

Esta seção detalha os componentes reutilizáveis do sistema, suas variações, estados e diretrizes de uso.

### 4.1. Botões

Botões são elementos interativos que permitem aos usuários realizar ações. Devem ter estados visuais claros para normal, hover, active, focus e disabled.

#### 4.1.1. Tipos de Botões

*   **Primário:** Para a ação mais importante em uma tela. (Ex: Salvar, Confirmar, Entrar)
    *   **Fundo:** `Azul Principal` (`#1D50DC`)
    *   **Texto:** `Branco Fundo` (`#FCFBFB`)
    *   **Borda:** `border-radius: 5px`
    *   **Hover:** Fundo `Azul Secundário` (`#4A7FEA`)
    *   **Disabled:** Fundo `Cinza Claro` (`#E0E0E0`), Texto `Cinza Texto` (`#424242`)
*   **Secundário:** Para ações de menor prioridade ou alternativas. (Ex: Cancelar, Voltar, Editar)
    *   **Fundo:** `Branco Fundo` (`#FCFBFB`)
    *   **Texto:** `Azul Principal` (`#1D50DC`)
    *   **Borda:** `1px` sólido `Azul Principal` (`#1D50DC`), `border-radius: 5px`
    *   **Hover:** Fundo `Azul Principal` (`#1D50DC`), Texto `Branco Fundo` (`#FCFBFB`)
*   **Perigo:** Para ações destrutivas ou irreversíveis. (Ex: Excluir, Remover)
    *   **Fundo:** `Vermelho Erro` (`#F44336`)
    *   **Texto:** `Branco Fundo` (`#FCFBFB`)
    *   **Borda:** `border-radius: 5px`
    *   **Hover:** Fundo `darken(Vermelho Erro, 10%)`
*   **Texto (Link):** Para ações que se parecem mais com links, mas funcionam como botões.
    *   **Fundo:** Transparente
    *   **Texto:** `Azul Principal` (`#1D50DC`)
    *   **Hover:** Texto `Azul Secundário` (`#4A7FEA`)

#### 4.1.2. Tamanhos

*   **Pequeno:** `height: 32px`, `padding: spacing-sm spacing-md`
*   **Médio (Padrão):** `height: 40px`, `padding: spacing-sm spacing-lg`
*   **Grande:** `height: 48px`, `padding: spacing-md spacing-xl`

### 4.2. Campos de Formulário (Inputs)

Campos de entrada de dados são essenciais para a interação do usuário. Devem ser claros, acessíveis e fornecer feedback visual.

#### 4.2.1. Input de Texto (Text, Email, Password, Number)

*   **Fundo:** `Branco Fundo` (`#FCFBFB`)
*   **Borda:** `1px` sólido `Cinza Claro` (`#E0E0E0`)
*   **Focus:** Borda `1px` sólido `Azul Principal` (`#1D50DC`)
*   **Texto (Placeholder/Valor):** `Cinza Texto` (`#424242`)
*   **Arredondamento:** `border-radius: 5px`
*   **Altura Padrão:** `40px`
*   **Label:** Acima do campo, `Corpo Padrão`, `Cinza Texto`.
*   **Mensagens de Validação:** Abaixo do campo, `Corpo Pequeno`, `Vermelho Erro` ou `Verde Sucesso`.

#### 4.2.2. Select (Dropdown)

*   Estilo similar ao input de texto, com um ícone de seta para baixo.
*   Estados de hover e focus claros.

#### 4.2.3. Checkbox e Radio Button

*   Design simples e claro, com feedback visual ao ser selecionado.
*   Alinhamento com o texto do rótulo.

### 4.3. Cards/Painéis

Cards são contêineres versáteis para agrupar informações relacionadas, como os widgets do dashboard.

*   **Fundo:** `Branco Fundo` (`#FCFBFB`)
*   **Borda:** `1px` sólido `Cinza Claro` (`#E0E0E0`)
*   **Sombra:** Leve `box-shadow` para dar profundidade e separação (ex: `0px 2px 4px rgba(0, 0, 0, 0.05)`)
*   **Arredondamento:** `border-radius: 5px`
*   **Padding:** `spacing-md` (16px) interno como padrão.
*   **Header (Opcional):** Título (`Título H4`), ícones de ação (ex: configurações, fechar).

### 4.4. Navegação

#### 4.4.1. Barra Superior (Header)

*   **Fundo:** `Azul Principal` (`#1D50DC`) ou `Branco Fundo` (`#FCFBFB`) com uma leve `box-shadow`.
*   **Altura:** `64px`.
*   **Elementos:**
    *   **Logo/Nome da Empresa:** No canto superior esquerdo.
    *   **Campo de Busca Global:** Centralizado ou à direita, com ícone de lupa.
    *   **Ícones de Ação Rápida:** Notificações, compromissos, configurações do dashboard .
    *   **Menu de Usuário/Avatar:** No canto superior direito, com dropdown para `Alterar Senha`, `Dispositivos Conectados`, `Logout`.

#### 4.4.2. Menu Lateral (Sidebar)

*   **Fundo:** `Branco Fundo` (`#FCFBFB`) ou `Cinza Claro` (`#E0E0E0`) para contraste.
*   **Largura:** `240px` (expandido) e `64px` (colapsado).
*   **Itens de Menu:**
    *   **Estrutura:** Ícone + Texto (`Corpo Padrão`).
    *   **Estados:**
        *   **Normal:** Texto `Cinza Texto`.
        *   **Hover:** Fundo `Azul Secundário` (`#4A7FEA`) com texto `Branco Fundo` ou fundo `Cinza Claro` com texto `Azul Principal`.
        *   **Ativo:** Fundo `Azul Principal` (`#1D50DC`) com texto `Branco Fundo`.
    *   **Submenus:** Devem ser expansíveis/colapsáveis com animação suave, mantendo a hierarquia visual através de indentação e ícones de seta.

### 4.5. Alertas e Mensagens de Feedback

Componentes para exibir mensagens de sucesso, erro, aviso ou informação ao usuário.

*   **Estrutura:** Ícone (Font Awesome) + Título (opcional) + Mensagem.
*   **Cores:** Utilizar as cores da `Paleta de Feedback` para o fundo e/ou texto, com ícones correspondentes.
*   **Posicionamento:** Geralmente no topo da tela (para globais) ou próximo ao elemento relevante (para validação de formulário).
*   **Ações:** Botão de fechar (X) opcional.

### 4.6. Tabelas

Para exibição de dados tabulares de forma clara e organizada.

*   **Estilo:** Linhas zebradas (opcional), bordas sutis, cabeçalhos fixos (para tabelas longas).
*   **Tipografia:** `Corpo Padrão` para o conteúdo, `Corpo Padrão` (Bold/Medium) para cabeçalhos.
*   **Interatividade:** Ordenação de colunas, paginação, filtros.

### 4.7. Modais (Dialogs)

Para exibir conteúdo ou solicitar interação sem navegar para uma nova página.

*   **Overlay:** Fundo escuro semitransparente que cobre o restante da tela.
*   **Estrutura:** Título (`Título H3`), conteúdo, botões de ação (primário/secundário).
*   **Fechamento:** Botão 'X' no canto superior direito e/ou clique fora do modal.

## 5. Diretrizes de Uso e Boas Práticas

### 5.1. Acessibilidade (WCAG)

O sistema deve ser acessível a todos os usuários, independentemente de suas habilidades. Seguir as diretrizes WCAG (Web Content Accessibility Guidelines) é fundamental.

*   **Contraste de Cores:** Garantir que o contraste entre texto e fundo atenda aos requisitos mínimos (AA ou AAA).
*   **Navegação por Teclado:** Todos os elementos interativos devem ser navegáveis e operáveis via teclado.
*   **Textos Alternativos:** Fornecer descrições (`alt text`) para todas as imagens e elementos não textuais.
*   **Semântica HTML:** Utilizar tags HTML de forma semântica para estruturar o conteúdo e melhorar a compreensão por tecnologias assistivas (leitores de tela).
*   **Estados de Foco:** Garantir que os estados de foco (`:focus`) sejam claramente visíveis para todos os elementos interativos.

### 5.2. Responsividade (Mobile-First)

O design e o desenvolvimento devem adotar uma abordagem **mobile-first**, garantindo que a interface seja totalmente funcional e esteticamente agradável em dispositivos móveis, tablets e desktops. O layout deve se adaptar fluidamente aos diferentes tamanhos de tela usando os breakpoints definidos.

### 5.3. Tom de Voz e Linguagem

*   **Claro e Conciso:** Usar uma linguagem direta e fácil de entender.
*   **Consistente:** Manter o mesmo tom e terminologia em toda a aplicação.
*   **Prestativo:** Guiar o usuário de forma útil, especialmente em mensagens de erro ou ajuda.
*   **Profissional:** Manter um tom formal, mas amigável.

### 5.4. Boas Práticas de UX/UI

*   **Feedback Visual:** Fornecer feedback imediato ao usuário sobre suas ações (ex: loading states, mensagens de sucesso).
*   **Hierarquia Visual:** Usar tamanho, cor e espaçamento para guiar o olho do usuário e destacar informações importantes.
*   **Consistência de Interação:** Padrões de interação devem ser previsíveis e consistentes.
*   **Minimizar Carga Cognitiva:** Evitar sobrecarregar o usuário com muitas informações ou opções simultaneamente.

## 6. Conclusão

Este Design System é um documento vivo e deve ser aprimorado e expandido conforme o projeto evolui. Ele fornece uma base sólida para construir um sistema web coeso, eficiente e com uma excelente experiência de usuário. A adesão a estas diretrizes garantirá a consistência e a qualidade do produto final. Recomenda-se a utilização de ferramentas como Storybook para documentação interativa de componentes e Figma/Sketch para prototipagem e design colaborativo.
