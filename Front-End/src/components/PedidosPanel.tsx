import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { LinhaItemForm, Pedido, Produto } from "../types";
import {
  pedidoPayloadFromForm,
  validateLinhasItens,
  validatePedidoCabecalho,
} from "../validation";
import { formatarDataPedido, moeda } from "../util";

const linhaVazia = (): LinhaItemForm => ({
  quantidade: "1",
  valorItem: "1",
  produtoId: "",
});

export function PedidosPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null,
  );
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [data, setData] = useState("");
  const [valorTotal, setValorTotal] = useState("0");
  const [linhas, setLinhas] = useState<LinhaItemForm[]>([]);

  const recarregarTudo = useCallback(async () => {
    setCarregando(true);
    setMensagem(null);
    try {
      const [peds, prods] = await Promise.all([
        api.pedidos.listar(),
        api.produtos.listar(),
      ]);
      setPedidos(peds);
      setProdutos(prods);
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Falha ao carregar dados.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregarTudo();
  }, [recarregarTudo]);

  function novo() {
    setEditandoId(null);
    setData(new Date().toISOString().slice(0, 10));
    setValorTotal("0");
    setLinhas([]);
    setMensagem(null);
  }

  function adicionarLinha() {
    setLinhas((l) => [...l, linhaVazia()]);
  }

  function removerLinha(i: number) {
    setLinhas((l) => l.filter((_, idx) => idx !== i));
  }

  function atualizarLinha(i: number, patch: Partial<LinhaItemForm>) {
    setLinhas((l) => l.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  async function carregarParaEdicao(id: number) {
    setCarregando(true);
    setMensagem(null);
    try {
      const p = await api.pedidos.buscar(id);
      setEditandoId(id);
      setData(formatarDataPedido(p.data as unknown));
      setValorTotal(String(p.valorTotal ?? 0));
      if (p.itens?.length) {
        setLinhas(
          p.itens.map((it) => ({
            quantidade: String(it.quantidade),
            valorItem: String(it.valorItem),
            produtoId: it.produto?.id != null ? String(it.produto.id) : "",
          })),
        );
      } else {
        setLinhas([]);
      }
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Pedido não encontrado.",
      });
    } finally {
      setCarregando(false);
    }
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const errCab = validatePedidoCabecalho({ data, valorTotal });
    if (errCab) {
      setMensagem({ tipo: "erro", texto: errCab });
      return;
    }
    const errLin = validateLinhasItens(linhas, true);
    if (errLin) {
      setMensagem({ tipo: "erro", texto: errLin });
      return;
    }
    const payload = pedidoPayloadFromForm(data, valorTotal, linhas);
    setCarregando(true);
    setMensagem(null);
    try {
      if (editandoId != null) {
        await api.pedidos.atualizar(editandoId, { ...payload, id: editandoId });
        setMensagem({ tipo: "ok", texto: "Pedido atualizado." });
      } else {
        await api.pedidos.criar(payload);
        setMensagem({ tipo: "ok", texto: "Pedido criado." });
      }
      novo();
      await recarregarTudo();
    } catch (ex) {
      setMensagem({
        tipo: "erro",
        texto: ex instanceof Error ? ex.message : "Erro ao salvar pedido.",
      });
    } finally {
      setCarregando(false);
    }
  }

  async function removerPedido(id: number) {
    if (!window.confirm("Excluir este pedido e seus itens em cascata?")) return;
    setCarregando(true);
    try {
      await api.pedidos.deletar(id);
      if (editandoId === id) novo();
      setMensagem({ tipo: "ok", texto: "Pedido excluído." });
      await recarregarTudo();
    } catch (ex) {
      setMensagem({
        tipo: "erro",
        texto: ex instanceof Error ? ex.message : "Erro ao excluir.",
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="panel">
      <header className="panel__head">
        <h2>Pedidos</h2>
        <p className="muted">
          Data e valor total obrigatórios. Itens opcionais: cada um exige produto, quantidade
          inteira &gt; 0 e valor &gt; 0.
        </p>
      </header>

      {mensagem && (
        <div className={mensagem.tipo === "erro" ? "banner banner--erro" : "banner banner--ok"}>
          {mensagem.texto}
        </div>
      )}

      <div className="toolbar">
        <button type="button" className="btn primary" onClick={novo}>
          Novo pedido
        </button>
      </div>

      <form className="stack" onSubmit={salvar}>
        <div className="form-grid form-grid--2">
          <label>
            Data
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
          </label>
          <label>
            Valor total
            <input
              type="number"
              step="0.01"
              min="0"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
            />
          </label>
        </div>

        <div className="subpanel">
          <div className="subpanel__title">
            <h3>Itens do pedido</h3>
            <button type="button" className="btn small" onClick={adicionarLinha}>
              + Linha
            </button>
          </div>
          {linhas.length === 0 && (
            <p className="muted">Nenhuma linha — o pedido será salvo só com cabeçalho.</p>
          )}
          {linhas.map((row, i) => (
            <div key={i} className="linha-item">
              <label>
                Produto
                <select
                  value={row.produtoId}
                  onChange={(e) => atualizarLinha(i, { produtoId: e.target.value })}
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
                Qtd
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={row.quantidade}
                  onChange={(e) => atualizarLinha(i, { quantidade: e.target.value })}
                />
              </label>
              <label>
                Valor item
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={row.valorItem}
                  onChange={(e) => atualizarLinha(i, { valorItem: e.target.value })}
                />
              </label>
              <button type="button" className="btn small danger" onClick={() => removerLinha(i)}>
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={carregando}>
            {editandoId != null ? "Salvar pedido" : "Criar pedido"}
          </button>
        </div>
      </form>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Valor total</th>
              <th>Itens</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  {carregando ? "Carregando…" : "Nenhum pedido."}
                </td>
              </tr>
            )}
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{formatarDataPedido(p.data as unknown)}</td>
                <td>{moeda(p.valorTotal)}</td>
                <td>{p.itens?.length ?? 0}</td>
                <td className="cell-actions">
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => p.id != null && carregarParaEdicao(p.id)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => p.id != null && removerPedido(p.id)}
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
