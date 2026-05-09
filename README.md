# Módulo de Gestão Comercial — ERP

Módulo comercial de um ERP com três partes interligadas: cadastro de produtos, cadastro de formas de pagamento e gestão de pedidos com pagamento vinculado. Usa Redux para manter o estado durante a navegação.

## Decisões técnicas

- O projeto foi criado com Vite, React e TypeScript para manter setup simples e rápido.
- O estado global foi centralizado com Redux Toolkit, conforme solicitado no teste.
- Os dados iniciais foram definidos em arquivos mockados, já que não há API real.
- As validações dos formulários foram feitas com Zod integrado ao React Hook Form.
- Funções de formatação e cálculo foram isoladas em utils para facilitar testes unitários.
- O Ant Design foi usado para acelerar a construção de tabelas, formulários, tags, layout e steps.
- O foco principal foi entregar o fluxo funcional completo antes de melhorias visuais.