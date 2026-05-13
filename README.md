# Módulo de Gestão Comercial — ERP

Aplicação desenvolvida como teste técnico para a vaga de Desenvolvedor Front-end React JS.

O projeto simula um módulo comercial de ERP com cadastro de produtos, cadastro de formas de pagamento e gestão de pedidos com pagamento vinculado. Os dados são mockados e mantidos em estado global com Redux Toolkit durante a navegação.

## Índice

- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Como clonar e rodar o projeto](#como-clonar-e-rodar-o-projeto)
- [Como rodar os testes](#como-rodar-os-testes)
- [Scripts disponíveis](#scripts-disponíveis)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Decisões técnicas](#decisões-técnicas)
- [Observações sobre a entrega](#observações-sobre-a-entrega)

## Tecnologias

- React
- TypeScript
- Vite
- Ant Design
- Redux Toolkit
- React Hook Form
- Zod
- date-fns
- Vitest
- React Router DOM

## Requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js
- npm

## Como clonar e rodar o projeto

Clone o repositório:
```bash
git clone https://github.com/felipegangorra/brajan-erp-frontend.git
```

Acesse a pasta do projeto:
```bash
cd brajan-erp-frontend
```

Instale as dependências:
```bash
npm install
```

Execute o ambiente de desenvolvimento:
```bash
npm run dev
```

A aplicação ficará disponível em:

```bash
http://localhost:5173/
```

## Como rodar os testes

Execute:
```bash
npm run test
```

## Como validar o projeto

Para validar a entrega localmente, execute:
```bash
npm run lint
```

```bash
npm run test
```

```bash
npm run build
```

Esses comandos verificam:

- lint do projeto;
- testes unitários;
- build de produção com TypeScript.

## Scripts disponíveis

### `npm run dev`

Inicia o ambiente de desenvolvimento com Vite.

### `npm run build`

Executa a checagem TypeScript e gera a versão de produção.

### `npm run preview`

Executa o preview local da build de produção.

### `npm run lint`

Executa a análise de lint.

### `npm run test`

Executa os testes unitários com Vitest.

## Funcionalidades implementadas

### Produtos

- Listagem de produtos
- Cadastro de novo produto
- Validação de formulário com Zod
- Inativação de produto
- Uso de produtos ativos na criação de pedidos

### Formas de pagamento

- Listagem de formas de pagamento
- Cadastro de nova forma de pagamento
- Validação de formulário com Zod
- Inativação de forma de pagamento
- Regra de parcelas:
  - cartão de crédito permite até o número máximo configurado;
  - demais formas ficam fixadas em 1 parcela.

### Pedidos

- Listagem de pedidos
- Filtro por nome do cliente
- Filtro por status do pedido
- Cálculo dinâmico do total do pedido
- Exibição de status de pagamento completo ou pendente
- Criação de novo pedido em duas etapas:
  - itens do pedido;
  - pagamentos.
- Seleção de produtos ativos
- Preenchimento automático de preço e unidade
- Cálculo de subtotal por item
- Cálculo de total geral
- Seleção de formas de pagamento ativas
- Cálculo de valor por parcela
- Validação de soma dos pagamentos com o total do pedido
- Bloqueio de formas de pagamento duplicadas no mesmo pedido
- Salvamento do pedido no Redux

### Testes

Foram implementados testes unitários para funções utilitárias:

- formatação de data;
- formatação de moeda;
- cálculo de total do pedido;
- cálculo de valor por parcela;
- validação de pagamento completo.

## Estrutura do projeto

```txt
src/
├── app/
│   ├── hooks.ts
│   └── store.ts
│
├── components/
│   └── AppLayout/
│
├── features/
│   ├── orders/
│   ├── payment-methods/
│   └── products/
│
├── mocks/
│   ├── orders.ts
│   ├── paymentMethods.ts
│   └── products.ts
│
├── routes/
│   └── AppRoutes.tsx
│
├── schemas/
│   ├── orderSchema.ts
│   ├── paymentMethodSchema.ts
│   └── productSchema.ts
│
├── types/
│   ├── order.ts
│   ├── payment-method.ts
│   └── product.ts
│
├── utils/
│   └── formatters.ts
│
└── __tests__/
    └── formatters.test.ts
```

## Rotas

```txt
/                    Redireciona para /orders
/products            Listagem de produtos
/products/new        Cadastro de produto
/payment-methods     Listagem de formas de pagamento
/payment-methods/new Cadastro de forma de pagamento
/orders              Listagem de pedidos
/orders/new          Criação de pedido
```

## Decisões técnicas

- O projeto foi criado com Vite, React e TypeScript para manter uma base simples, rápida e adequada ao escopo do teste.
- O estado global foi centralizado com Redux Toolkit, conforme solicitado.
- Os dados iniciais foram definidos em arquivos mockados, já que não há API real.
- As validações dos formulários foram feitas com Zod integrado ao React Hook Form.
- As funções de formatação, cálculo de totais e validação de pagamento foram isoladas em `utils` para facilitar testes unitários.
- O Ant Design foi usado para acelerar a construção de tabelas, formulários, tags, layout, menu lateral e steps.
- O fluxo principal foi priorizado antes de melhorias visuais ou funcionalidades bônus.
- A comparação entre total do pedido e total pago é feita em centavos para reduzir problemas com ponto flutuante em JavaScript.

## Observações sobre a entrega

Algumas ações de interface, como edição e detalhes de pedido, foram mantidas como botões visíveis, porém desabilitados, pois o escopo do teste não define rotas específicas para essas funcionalidades.
