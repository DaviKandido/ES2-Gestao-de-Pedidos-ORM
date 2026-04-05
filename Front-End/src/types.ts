/** Alinhado aos DTOs JSON da API Spring */

export type Produto = {
  id?: number;
  nome: string;
  preco: number;
  estoque: number;
  voltagem?: number | null;
  dataValidade?: string | null;
};

export type Item = {
  id?: number;
  quantidade: number;
  valorItem: number;
  pedido?: { id: number };
  produto?: { id?: number; nome?: string; preco?: number };
  pedidoId?: number;
};

export type Pedido = {
  id?: number;
  data: string;
  valorTotal: number;
  itens?: Item[] | null;
};

/** Linha editável de item de pedido (formulário) */
export type LinhaItemForm = {
  quantidade: string;
  valorItem: string;
  produtoId: string;
};
