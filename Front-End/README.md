# Front-End — Gestão de pedidos

Interface web para o CRUD da API Spring Boot (`Produto`, `Pedido`, `Item`), com validação no cliente alinhada às regras do backend.

## Pré-requisitos

- Node.js 20+ (recomendado)
- Back-End em execução (por padrão `http://localhost:8080`)

## Como rodar

```bash
cd Front-End
npm install
npm run dev
```

Abra o endereço indicado no terminal (geralmente `http://localhost:5173`).

## API base

Por padrão o front usa `http://localhost:8080`. Para outro host:

1. Copie `.env.example` para `.env`
2. Ajuste `VITE_API_BASE`, por exemplo: `VITE_API_BASE=https://seu-servidor.com`

O Back-End precisa permitir CORS para a origem do Vite (já configurado para `localhost` e `127.0.0.1` em qualquer porta).

## Estrutura (manutenção)

| Caminho | Função |
|--------|--------|
| `src/api.ts` | Chamadas HTTP à API |
| `src/types.ts` | Tipos dos recursos |
| `src/validation.ts` | Regras de formulário (espelho das validações JPA) |
| `src/components/*Panel.tsx` | Telas por entidade |
| `src/util.ts` | Formatação de data/moeda |

## Build de produção

```bash
npm run build
```

Arquivos estáticos em `dist/` — sirva com nginx, Apache ou hospede em bucket/CDN apontando `VITE_API_BASE` para a API em produção.
