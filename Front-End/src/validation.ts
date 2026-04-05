import type { LinhaItemForm, Pedido, Produto } from "./types";

const trim = (s: string) => s.trim();

export function validateProduto(input: {
  nome: string;
  preco: string;
  estoque: string;
  voltagem: string;
  dataValidade: string;
}): string | null {
  if (!trim(input.nome)) {
    return "Nome é obrigatório.";
  }
  const preco = Number(input.preco);
  if (Number.isNaN(preco) || preco <= 0) {
    return "Preço deve ser um número maior que zero.";
  }
  const estoque = Number(input.estoque);
  if (!Number.isInteger(estoque) || estoque < 0) {
    return "Estoque deve ser um número inteiro maior ou igual a zero.";
  }
  if (trim(input.voltagem)) {
    const v = Number(input.voltagem);
    if (!Number.isInteger(v) || v <= 0) {
      return "Voltagem deve ser um inteiro positivo ou ficar em branco.";
    }
  }
  return null;
}

export function produtoPayloadFromForm(input: {
  nome: string;
  preco: string;
  estoque: string;
  voltagem: string;
  dataValidade: string;
}): Produto {
  const voltagemStr = trim(input.voltagem);
  const dataStr = trim(input.dataValidade);
  return {
    nome: trim(input.nome),
    preco: Number(input.preco),
    estoque: Number(input.estoque),
    voltagem: voltagemStr ? Number(voltagemStr) : null,
    dataValidade: dataStr ? dataStr : null,
  };
}

export function validatePedidoCabecalho(input: {
  data: string;
  valorTotal: string;
}): string | null {
  if (!trim(input.data)) {
    return "Data do pedido é obrigatória.";
  }
  const total = Number(input.valorTotal);
  if (Number.isNaN(total) || total < 0) {
    return "Valor total deve ser um número maior ou igual a zero.";
  }
  return null;
}

export function validateLinhasItens(
  linhas: LinhaItemForm[],
  permitirVazio: boolean,
): string | null {
  if (linhas.length === 0) {
    return permitirVazio ? null : "Inclua pelo menos um item.";
  }
  for (let i = 0; i < linhas.length; i++) {
    const q = Number(linhas[i].quantidade);
    if (!Number.isInteger(q) || q <= 0) {
      return `Linha ${i + 1}: quantidade deve ser inteiro maior que zero.`;
    }
    const v = Number(linhas[i].valorItem);
    if (Number.isNaN(v) || v <= 0) {
      return `Linha ${i + 1}: valor do item deve ser maior que zero.`;
    }
    if (!trim(linhas[i].produtoId)) {
      return `Linha ${i + 1}: selecione um produto.`;
    }
    const pid = Number(linhas[i].produtoId);
    if (!Number.isInteger(pid) || pid <= 0) {
      return `Linha ${i + 1}: produto inválido.`;
    }
  }
  return null;
}

export function pedidoPayloadFromForm(
  data: string,
  valorTotal: string,
  linhas: LinhaItemForm[],
): Pedido {
  const itens = linhas.map((l) => ({
    quantidade: Number(l.quantidade),
    valorItem: Number(l.valorItem),
    produto: { id: Number(l.produtoId) },
  }));
  return {
    data: trim(data),
    valorTotal: Number(valorTotal),
    itens,
  };
}

export function validateItemAvulso(input: {
  quantidade: string;
  valorItem: string;
  pedidoId: string;
  produtoId: string;
}): string | null {
  const q = Number(input.quantidade);
  if (!Number.isInteger(q) || q <= 0) {
    return "Quantidade deve ser inteiro maior que zero.";
  }
  const v = Number(input.valorItem);
  if (Number.isNaN(v) || v <= 0) {
    return "Valor do item deve ser maior que zero.";
  }
  if (!trim(input.pedidoId)) {
    return "Pedido é obrigatório.";
  }
  const pid = Number(input.pedidoId);
  if (!Number.isInteger(pid) || pid <= 0) {
    return "Pedido inválido.";
  }
  if (!trim(input.produtoId)) {
    return "Produto é obrigatório.";
  }
  const prid = Number(input.produtoId);
  if (!Number.isInteger(prid) || prid <= 0) {
    return "Produto inválido.";
  }
  return null;
}

export function itemAvulsoPayload(input: {
  quantidade: string;
  valorItem: string;
  pedidoId: string;
  produtoId: string;
}) {
  return {
    quantidade: Number(input.quantidade),
    valorItem: Number(input.valorItem),
    pedido: { id: Number(input.pedidoId) },
    produto: { id: Number(input.produtoId) },
  };
}
