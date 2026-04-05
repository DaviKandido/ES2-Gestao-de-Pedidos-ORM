# Gestão de Pedidos — Persistência com ORM (JPA / Hibernate)

**Pontifícia Universidade Católica de Minas Gerais (PUC Minas)** · **Curso:** Ciência da Computação  
**Disciplina:** Engenharia de Software 2  
**Autores:** *(informe os nomes da equipe)*

## 📌 Sobre o Projeto

Este repositório implementa um **sistema de gestão de pedidos** com persistência relacional via **ORM**, demonstrando mapeamento objeto-relacional na prática.

O **Back-End** é uma API **REST** em **Java** com **Spring Boot** e **Spring Data JPA** (Hibernate como provedor), expondo CRUD completo para as entidades de domínio. O **Front-End** é uma aplicação web em **React** + **TypeScript** + **Vite**, permitindo cadastrar, listar, editar e excluir dados pela interface, com validação alinhada às regras da API.

O modelo de domínio inclui:

* **Produto:** dados gerais (nome, preço, estoque), com campos opcionais para **voltagem** (ex.: eletrônicos) e **data de validade** (ex.: perecíveis), persistidos na mesma entidade/tabela.
* **Pedido:** data, valor total e coleção de **itens**; persistência com **cascade** e **orphan removal** nos itens filhos.
* **Item:** quantidade, valor da linha e associações **N..1** com `Pedido` e `Produto`, refletindo o relacionamento **1..N** entre pedido e itens.

Há tratamento centralizado de erros (recurso não encontrado, validação Bean Validation, integridade referencial) e configuração de **CORS** para consumo do front em ambiente de desenvolvimento.

---

## 🛠️ Tecnologias Utilizadas

### Back-End

* **Linguagem:** Java 21  
* **Build / dependências:** Maven  
* **Framework:** Spring Boot 4 (Web MVC, Data JPA, Validation)  
* **ORM:** Hibernate (via `spring-boot-starter-data-jpa`)  
* **Banco de dados:** PostgreSQL (ex.: Neon); perfil opcional com **H2** em memória para desenvolvimento/testes  
* **Utilitários:** Lombok  

### Front-End

* **React** 19 · **TypeScript** · **Vite**  
* Comunicação com a API via `fetch`, tipos e validação em módulos dedicados (`Front-End/src`)

---

## 📁 Estrutura do Repositório

```
ES2-Gestao-de-Pedidos-ORM/
├── Back-End/                 # API Spring Boot (pom.xml na pasta)
│   └── src/main/java/...     # Controllers, modelos JPA, repositórios, exceções, CORS
├── Front-End/                # SPA React (npm install / npm run dev)
└── README.md                 # Este arquivo
```

---

## ⚙️ Configuração do Ambiente

### Banco de dados (Back-End)

1. Crie um banco **PostgreSQL** acessível pela aplicação (local, Docker ou serviço gerenciado como Neon).  
2. Ajuste `Back-End/src/main/resources/application.properties` com **URL**, **usuário** e **senha** do banco (ou use variáveis de ambiente, se o time padronizar assim).  
3. Com `spring.jpa.hibernate.ddl-auto=update`, o Hibernate cria/atualiza o esquema conforme as entidades.

**Desenvolvimento sem PostgreSQL local:** na pasta `Back-End` é possível usar o perfil `dev` (H2), por exemplo:

```bash
cd Back-End
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

*(Requer `application-dev.properties` e dependência H2 conforme configurado no projeto.)*

### Front-End

Na pasta `Front-End`, copie `.env.example` para `.env` se precisar alterar a URL da API. O padrão é `http://localhost:8080` (`VITE_API_BASE`).

---

## 🚀 Como Executar

### Back-End (API)

Na pasta `Back-End`:

```bash
./mvnw spring-boot:run
```

Ou, na IDE: executar a classe `com.GestaoDePedidos.ORM.OrmApplication`.

A API sobe em **http://localhost:8080** (porta padrão), com endpoints como `/produtos`, `/pedidos` e `/itens`.

Testes:

```bash
./mvnw test
```

### Front-End

```bash
cd Front-End
npm install
npm run dev
```

Abra o endereço exibido no terminal (em geral **http://localhost:5173**). Mantenha o Back-End em execução.

Build estático de produção:

```bash
cd Front-End
npm run build
```

---

## 🖥️ Funcionalidades

### API (REST)

| Recurso   | Operações |
|-----------|-----------|
| **Produtos** | `GET/POST` em `/produtos`; `GET/PUT/DELETE` em `/produtos/{id}` |
| **Pedidos**  | `GET/POST` em `/pedidos`; `GET/PUT/DELETE` em `/pedidos/{id}` — criação/edição podem incluir **itens** com referência ao `id` do produto |
| **Itens**    | `GET/POST` em `/itens`; `GET/PUT/DELETE` em `/itens/{id}` — exige `pedido` e `produto` com `id` |

Regras principais espelhadas no front: nome de produto obrigatório; preço &gt; 0; estoque ≥ 0; quantidade inteira &gt; 0 e valor do item &gt; 0; valor total do pedido ≥ 0; data do pedido obrigatória.

### Interface web

* Abas **Produtos**, **Pedidos** e **Itens** com formulários e tabelas.  
* Validação antes do envio; mensagens de erro retornadas pela API exibidas ao usuário.  
* Confirmação antes de exclusões.

---

## 📄 Licença

Consulte o arquivo `LICENSE` na raiz do repositório, se aplicável.
