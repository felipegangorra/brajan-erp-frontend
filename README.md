# Módulo de Gestão Comercial — ERP

A aplicação simula um módulo comercial de ERP com cadastro de produtos, cadastro de formas de pagamento e gestão de pedidos com pagamento vinculado. Usa Redux para manter o estado durante a navegação.

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

## Requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js
- npm

## Como rodar o projeto

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

## Scripts disponíveis

```bash
npm run dev
```

Inicia o ambiente de desenvolvimento com Vite.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run preview
```

Executa o preview da build de produção.

```bash
npm run lint
```

Executa a análise de lint.

```bash
npm run test
```

Executa os testes com Vitest.

## Funcionalidades previstas

- Cadastro e listagem de produtos
- Cadastro e listagem de formas de pagamento
- Listagem de pedidos
- Criação de novo pedido em duas etapas
- Validação de formulários com Zod
- Estado global com Redux Toolkit
- Cálculo dinâmico de totais
- Validação de pagamentos vinculados ao total do pedido
- Testes unitários para funções utilitárias

## Estrutura planejada

```txt
src/
├── app/
├── components/
├── features/
├── mocks/
├── routes/
├── schemas/
├── types/
├── utils/
└── __tests__/
```

## Decisões técnicas

- O projeto foi criado com Vite, React e TypeScript para manter setup simples e rápido.
- O estado global foi centralizado com Redux Toolkit, conforme solicitado no teste.
- Os dados iniciais foram definidos em arquivos mockados, já que não há API real.
- As validações dos formulários foram feitas com Zod integrado ao React Hook Form.
- Funções de formatação e cálculo foram isoladas em utils para facilitar testes unitários.
- O Ant Design foi usado para acelerar a construção de tabelas, formulários, tags, layout e steps.
- O foco principal foi entregar o fluxo funcional completo antes de melhorias visuais.