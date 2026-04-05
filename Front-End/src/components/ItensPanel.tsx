import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { Item, Pedido, Produto } from "../types";
import { itemAvulsoPayload, validateItemAvulso } from "../validation";
import { formatarDataPedido, moeda } from "../util";

const vazio = {
  quantidade: "1",
  valorItem: "1",
  pedidoId: "",
  produtoId: "",
};

export function ItensPanel() {
  const [itens, setItens] = useState<Item[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null,
  );
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState(vazio);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setMensagem(null);
    try {
      const [its, peds, prods] = await Promise.all([
        api.itens.listar(),
        api.pedidos.listar(),
        api.produtos.listar(),
      ]);
      setItens(its);
      setPedidos(peds);
      setProdutos(prods);
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Falha ao carregar.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  function novo() {
    setEditandoId(null);
    setForm(vazio);
    setMensagem(null);
  }

  async function carregarEdicao(id: number) {
    setCarregando(true);
    setMensagem(null);
    try {
      const it = await api.itens.buscar(id);
      setEditandoId(id);
      setForm({
        quantidade: String(it.quantidade),
        valorItem: String(it.valorItem),
        pedidoId: String(it.pedidoId ?? it.pedido?.id ?? ""),
        produtoId: String(it.produto?.id ?? ""),
      });
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Item não encontrado.",
      });
    } finally {
      setCarregando(false);
    }
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const err = validateItemAvulso(form);
    if (err) {
      setMensagem({ tipo: "erro", texto: err });
      return;
    }
    const payload = itemAvulsoPayload(form);
    setCarregando(true);
    setMensagem(null);
    try {
      if (editandoId != null) {
        await api.itens.atualizar(editandoId, payload);
        setMensagem({ tipo: "ok", texto: "Item atualizado." });
      } else {
        await api.itens.criar(payload);
        setMensagem({ tipo: "ok", texto: "Item criado." });
      }
      novo();
      await recarregar();
    } catch (ex) {
      setMensagem({
        tipo: "erro",
        texto: ex instanceof Error ? ex.message : "Erro ao salvar item.",
      });
    } finally {
      setCarregando(false);
    }
  }

  async function remover(id: number) {
    if (!window.confirm("Excluir este item?")) return;
    setCarregando(true);
    try {
      await api.itens.deletar(id);
      if (editandoId === id) novo();
      setMensagem({ tipo: "ok", texto: "Item excluído." });
      await recarregar();
    } catch (ex) {
      setMensagem({
        tipo: "erro",
        texto: ex instanceof Error ? ex.message : "Erro ao excluir.",
      });
    } finally {
      setCarregando(false);
    }
  }

  function nomeProduto(id?: number) {
    if (id == null) return "—";
    return produtos.find((p) => p.id === id)?.nome ?? `#${id}`;
  }

  return (
    <section className="panel">
      <header className="panel__head">
        <h2>Itens (linhas avulsas)</h2>
        <p className="muted">
          Cada item liga um pedido a um produto. Quantidade inteira &gt; 0; valor &gt; 0. Para
          vários itens de uma vez, use a tela de Pedidos.
        </p>
      </header>

      {mensagem && (
        <div className={mensagem.tipo === "erro" ? "banner banner--erro" : "banner banner--ok"}>
          {mensagem.texto}
        </div>
      )}

      <form className="form-grid form-grid--2" onSubmit={salvar}>
        <label>
          Pedido
          <select
            value={form.pedidoId}
            onChange={(e) => setForm({ ...form, pedidoId: e.target.value })}
          >
            <option value="">Selecione…</option>
            {pedidos.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} — {formatarDataPedido(p.data as unknown)} — {moeda(p.valorTotal)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Produto
          <select
            value={form.produtoId}
            onChange={(e) => setForm({ ...form, produtoId: e.target.value })}
          >
            <option value="">Selecione…</option>
            {produtos.map((pr) => (
              <option key={pr.id} value={pr.id}>
                #{pr.id} — {pr.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantidade
          <input
            type="number"
            min="1"
            step="1"
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
          />
        </label>
        <label>
          Valor do item
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.valorItem}
            onChange={(e) => setForm({ ...form, valorItem: e.target.value })}
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={carregando}>
            {editandoId != null ? "Atualizar item" : "Cadastrar item"}
          </button>
          {editandoId != null && (
            <button type="button" className="btn" onClick={novo}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pedido</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 && (
              <tr>
                <td colSpan={6} className="muted">
                  {carregando ? "Carregando…" : "Nenhum item."}
                </td>
              </tr>
            )}
            {itens.map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.pedidoId ?? it.pedido?.id ?? "—"}</td>
                <td>{nomeProduto(it.produto?.id)}</td>
                <td>{it.quantidade}</td>
                <td>{moeda(it.valorItem)}</td>
                <td className="cell-actions">
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => it.id != null && carregarEdicao(it.id)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => it.id != null && remover(it.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
