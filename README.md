# Gestão de Pedidos (ORM / JPA)

**PUC Minas** — Engenharia de Software 2  
**Autor:** Davi Cândido de Almeida

## O que é

Sistema simples de **pedidos** com **produtos** e **itens**. O back-end é uma API REST em **Java (Spring Boot + JPA/Hibernate)**. O front-end é uma página em **React** para cadastrar, listar, editar e excluir dados.

Pastas: `Back-End/` (API) e `Front-End/` (interface).

## O que precisa

- **Java 21** e **Maven** (o projeto traz o wrapper `./mvnw` na pasta `Back-End`).
- **Node.js** e **npm** para rodar o front.
- **PostgreSQL** configurado em `Back-End/src/main/resources/application.properties` **ou**, para testar sem instalar Postgres, use o perfil **`dev`** (banco H2 em memória — ver abaixo).

## Como subir e testar

### 1) API (Back-End)

Terminal na pasta `Back-End`:

```bash
./mvnw spring-boot:run
```

Com **PostgreSQL** indisponível na máquina, use:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

A API fica em **http://localhost:8080**. Endpoints principais: `/produtos`, `/pedidos`, `/itens`.

**Testes automatizados** (JUnit):

```bash
./mvnw test
```

### 2) Interface (Front-End)

Outro terminal, na pasta `Front-End`:

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente **http://localhost:5173**). A API precisa estar rodando na porta **8080** (ou ajuste `VITE_API_BASE` num arquivo `.env` — veja `.env.example`).

Ordem sugerida na tela: cadastrar **produtos**, depois **pedidos** (e itens, se usar essa aba).
