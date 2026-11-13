# Vice News

Portal brasileiro de notícias e conteúdo sobre **GTA VI**, desenvolvido com React, TypeScript e ASP.NET Core.

O projeto tem como objetivo oferecer uma experiência editorial moderna, rápida e responsiva para acompanhar notícias, rumores, vazamentos, informações, curiosidades e guias relacionados ao próximo título da Rockstar Games.

> Projeto independente e não afiliado à Rockstar Games.

## Sobre o projeto

O **Vice News** é um projeto Full Stack desenvolvido com foco na construção de um portal de conteúdo completo, abrangendo desde a identidade visual e experiência do usuário até a arquitetura do Back End, gerenciamento de dados e integração entre aplicações.

A identidade visual combina uma interface **dark editorial** com elementos inspirados na atmosfera de Vice City, utilizando tons de rosa, roxo e laranja como cores de destaque.

O projeto conta com uma aplicação Front End integrada a uma API própria, responsável pelo processamento das operações e persistência dos dados.

## Tecnologias

### Front End
- React
- TypeScript
- Vite
- CSS Modules
- Lucide React

### Back End
- C#
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- API REST

## Funcionalidades

### Portal e conteúdo
- Interface editorial responsiva com identidade visual própria.
- Página inicial com organização de conteúdos e notícias.
- Páginas dedicadas à apresentação de notícias e guias.
- Navegação entre as diferentes áreas do portal.

### Módulo de veículos

Módulo dedicado ao catálogo de veículos de GTA VI, integrado ao Back End e ao banco de dados.

- Listagem de veículos cadastrados.
- Integração com API para consulta e gerenciamento dos dados.
- Cadastro de veículos por meio de formulário dinâmico.
- Preview em tempo real do card durante o preenchimento do formulário.
- Edição de veículos existentes, com formulário previamente preenchido.
- Exclusão de veículos com confirmação de segurança.
- Gerenciamento de informações como fabricante, categoria, tags, preço, descrição, imagem e atributos do veículo.
- Operações administrativas de criação, edição e exclusão.

## Estrutura do projeto

### Front End

```text
src/
├── api/
├── assets/
├── components/
├── config/
├── data/
├── hooks/
├── lib/
├── pages/
├── App.tsx
├── main.tsx
├── routes.tsx
└── index.css
```

A aplicação é organizada em módulos, separando páginas, componentes reutilizáveis, integração com a API, configurações, hooks e recursos compartilhados.

### Back End

Desenvolvido em ASP.NET Core Web API, responsável pelas regras de negócio, comunicação com o banco de dados e disponibilização dos recursos por meio de endpoints REST.

A persistência dos dados é realizada com PostgreSQL, utilizando Entity Framework Core como ORM.

## Objetivos do projeto

- Aplicar conceitos de desenvolvimento Full Stack.
- Desenvolver uma arquitetura organizada e de fácil manutenção.
- Trabalhar com integração entre React e ASP.NET Core.
- Aplicar operações CRUD e persistência de dados.
- Desenvolver interfaces administrativas e formulários dinâmicos.
- Trabalhar com modelagem de dados e relacionamento entre entidades.
- Construir uma aplicação próxima de um cenário real de desenvolvimento.

## Status

**Em desenvolvimento.**

O portal já conta com a estrutura inicial de Front End, integração com o Back End e módulo de veículos com listagem, cadastro, edição e exclusão administrativa.

Novas funcionalidades e módulos de gerenciamento de conteúdo estão em desenvolvimento.
