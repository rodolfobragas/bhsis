## 1. Módulo: Cadastros

### 1.1. Submódulo: Participante

**Nome do módulo:** Participante
**Descrição geral:** Gerencia o cadastro de clientes, fornecedores, transportadores, colaboradores, contadores e motoristas do sistema.
**Funcionalidades principais:**
*   Cadastrar novo participante (cliente, fornecedor, transportador, colaborador, contador, motorista).
*   Consultar participantes existentes.
*   Gerenciar cargos.
*   Gerenciar grupos de participantes.
*   Associar vendedor a cliente.
*   Gerar relatório de crédito.
*   Gerar relatório de aniversariantes.
*   Realizar manutenção de participantes.
**Perfis de usuário envolvidos:** Administrador, Vendedor, Operador, entre outros que necessitem gerenciar informações de participantes.
**Fluxo de uso:**
1.  Acessar o menu "Cadastros".
2.  Selecionar o submenu "Participante".
3.  Para cadastrar, clicar em "Cadastrar". Preencher os campos obrigatórios como Nome/Razão Social, Tipo (Física/Jurídica), CPF/CNPJ, Situação (Ativo/Inativo/Bloqueado) e outros dados relevantes como endereço, telefone, e-mail, cargo, regime tributário, data de nascimento, PIS/INSS, SUFRAMA, etc.
4.  Para consultar, clicar em "Consultar". Utilizar filtros como nome, tipo, situação, etc., para localizar o participante desejado.
**Campos e dados manipulados:**
*   **Principal:** Nome/Razão Social, Nome Fantasia, Grupo, Tipo (Física/Jurídica), CPF, CNPJ, Tipo Contribuinte, Inscrição Estadual, Inscrição Municipal, Situação (Ativo/Inativo/Bloqueado), Cargo, Regime Tributário, Data de Nascimento, Número PIS/INSS, SUFRAMA, Consumidor Final, Revenda, Estrangeiro, Operadora de Cartão/Instituição Financeira.
*   **Endereços:** Logradouro, Número, Complemento, Bairro, CEP, Cidade, Estado, País.
*   **Telefones:** Tipo de Telefone, Número.
*   **E-mails:** Tipo de E-mail, Endereço de E-mail.
*   **Campos Adicionais:** Campos personalizados para informações extras.
*   **Observação Interna:** Campo para anotações internas.
*   **Informações Adicionais:** Informações complementares.
*   **Reforma Tributária - IBS:** Informações relacionadas à reforma tributária.
**Regras de negócio identificadas:**
*   Campos obrigatórios: Nome/Razão Social, Tipo, Situação.
*   Validação de CPF/CNPJ conforme o Tipo de Pessoa (Física/Jurídica).
*   Permissões de acesso baseadas no perfil do usuário (ex: "Usuário Demonstração não tem permissão para cadastrar novos participantes!").
**Integrações com outros módulos ou sistemas:** Não identificado explicitamente, mas presume-se integração com módulos de Faturamento, Financeiro e Relatórios.
**Possíveis erros ou validações observadas:** Mensagem de erro ao tentar cadastrar sem permissão.
**Observações adicionais:** O módulo permite um controle detalhado das informações dos participantes, essencial para diversas operações do sistema.

### 1.2. Submódulo: Produto

**Nome do módulo:** Produto
**Descrição geral:** Gerencia o cadastro de produtos, categorias e informações comerciais.
**Funcionalidades principais:**
* Cadastrar produtos.
* Consultar produtos com filtros.
* Atualizar/inativar produtos.
* Consultas rápidas e busca de preços.
**Perfis de usuário envolvidos:** Administrador, Operador.
**Fluxo de uso:** acessar Cadastros > Produto, escolher cadastrar/consultar.
**Campos e dados manipulados:** SKU, categoria, preço, receita associada, status.
**Regras de negócio identificadas:** SKU único, preço obrigatório, validações de categoria.
**Integrações com outros módulos:** Estoque, Pedidos, Relatórios.

### 1.3. Submódulo: Fiscal

**Nome do módulo:** Fiscal
**Descrição geral:** Cadastros fiscais e regras tributárias básicas.
**Funcionalidades principais:**
* CFOP, CST ICMS, regras fiscais, natureza de operação.
* Informações complementares e integrações.
**Perfis de usuário envolvidos:** Administrador, Fiscal.
**Fluxo de uso:** acessar Cadastros > Fiscal e selecionar item desejado.
**Campos e dados manipulados:** códigos fiscais, regras, descrições e parâmetros.
**Regras de negócio identificadas:** códigos únicos e validações conforme legislação.
**Integrações com outros módulos:** Faturamento, Relatórios.

### 1.4. Submódulo: Financeiro

**Nome do módulo:** Financeiro
**Descrição geral:** Cadastros de base financeira e parâmetros de cobrança.
**Funcionalidades principais:**
* Bandeiras, contas bancárias, histórico padrão.
* Centro de custo, forma de pagamento, plano de contas.
* Parâmetros de convênio/boleto.
**Perfis de usuário envolvidos:** Administrador, Financeiro.
**Fluxo de uso:** acessar Cadastros > Financeiro e selecionar item desejado.
**Campos e dados manipulados:** contas, taxas, parâmetros bancários e formas de pagamento.
**Regras de negócio identificadas:** validação de contas e duplicidades.
**Integrações com outros módulos:** PDV, Faturamento, Relatórios.

### 1.5. Submódulo: Caixa Venda

**Nome do módulo:** Caixa Venda
**Descrição geral:** Cadastros relacionados à operação de caixa e ponto de venda.
**Funcionalidades principais:**
* Cadastrar e consultar caixas de venda.
**Perfis de usuário envolvidos:** Administrador, Operador.
**Fluxo de uso:** acessar Cadastros > Caixa Venda.
**Campos e dados manipulados:** identificação, status, operador responsável.
**Regras de negócio identificadas:** caixa único por unidade/turno.
**Integrações com outros módulos:** PDV, Financeiro.

### 1.6. Submódulo: Usuário

**Nome do módulo:** Usuário
**Descrição geral:** Gestão de usuários e permissões.
**Funcionalidades principais:**
* Cadastrar e consultar usuários.
* Definir grupos e permissões.
**Perfis de usuário envolvidos:** Administrador.
**Fluxo de uso:** acessar Cadastros > Usuário.
**Campos e dados manipulados:** nome, e-mail, role, status e grupos.
**Regras de negócio identificadas:** e-mail único, permissões por perfil.
**Integrações com outros módulos:** todos os módulos que exigem autenticação.

### 1.7. Submódulo: Veículos

**Nome do módulo:** Veículos
**Descrição geral:** Gestão de frota e associação com clientes.
**Funcionalidades principais:**
* Cadastrar e consultar veículos.
* Associar veículos a clientes.
* Cadastrar/consultar cores.
**Perfis de usuário envolvidos:** Administrador, Logística.
**Fluxo de uso:** acessar Cadastros > Veículos.
**Campos e dados manipulados:** placa, modelo, cor, proprietário.
**Regras de negócio identificadas:** placa única, status do veículo.
**Integrações com outros módulos:** Delivery, Relatórios.

### 1.8. Submódulo: Setor

**Nome do módulo:** Setor
**Descrição geral:** Cadastro de setores organizacionais.
**Funcionalidades principais:**
* Cadastrar e consultar setores.
**Perfis de usuário envolvidos:** Administrador.
**Fluxo de uso:** acessar Cadastros > Setor.
**Campos e dados manipulados:** nome do setor, responsável, status.
**Regras de negócio identificadas:** nomes únicos por unidade.
**Integrações com outros módulos:** Usuários, Produção, Relatórios.
