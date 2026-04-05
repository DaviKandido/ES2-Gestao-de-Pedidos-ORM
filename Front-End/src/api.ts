import type { Item, Pedido, Produto } from "./types";

const base = () =>
  (import.meta.env.VITE_API_BASE ?? "http://localhost:8080").replace(/\/$/, "");

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  if (!res.ok) {
    if (!text) {
      throw new Error(res.statusText);
    }
    try {
      const body = JSON.parse(text) as { erro?: string };
      throw new Error(body.erro ?? text);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(text);
      }
      throw e;
    }
  }
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export const api = {
  produtos: {
    listar: () =>
      fetch(`${base()}/produtos`).then((r) => handleResponse<Produto[]>(r)),
    buscar: (id: number) =>
      fetch(`${base()}/produtos/${id}`).then((r) => handleResponse<Produto>(r)),
    criar: (body: Produto) =>
      fetch(`${base()}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => handleResponse<Produto>(r)),
    atualizar: (id: number, body: Produto) =>
      fetch(`${base()}/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => handleResponse<Produto>(r)),
    deletar: (id: number) =>
      fetch(`${base()}/produtos/${id}`, { method: "DELETE" }).then((r) =>
        handleResponse<void>(r),
      ),
  },
  pedidos: {
    listar: () =>
      fetch(`${base()}/pedidos`).then((r) => handleResponse<Pedido[]>(r)),
    buscar: (id: number) =>
      fetch(`${base()}/pedidos/${id}`).then((r) => handleResponse<Pedido>(r)),
    criar: (body: Pedido) =>
      fetch(`${base()}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => handleResponse<Pedido>(r)),
    atualizar: (id: number, body: Pedido) =>
      fetch(`${base()}/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => handleResponse<Pedido>(r)),
    deletar: (id: number) =>
      fetch(`${base()}/pedidos/${id}`, { method: "DELETE" }).then((r) =>
        handleResponse<void>(r),
      ),
  },
  itens: {
    listar: () =>
      fetch(`${base()}/itens`).then((r) => handleResponse<Item[]>(r)),
    buscar: (id: number) =>
      fetch(`${base()}/itens/${id}`).then((r) => handleResponse<Item>(r)),
    criar: (body: Item) =>
      fetch(`${base()}/itens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => handleResponse<Item>(r)),
    atualizar: (id: number, body: Item) =>
      fetch(`${base()}/itens/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => handleResponse<Item>(r)),
    deletar: (id: number) =>
      fetch(`${base()}/itens/${id}`, { method: "DELETE" }).then((r) =>
        handleResponse<void>(r),
      ),
  },
};
