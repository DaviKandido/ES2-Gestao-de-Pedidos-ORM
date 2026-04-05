import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { Produto } from "../types";
import { produtoPayloadFromForm, validateProduto } from "../validation";
import { formatarDataPedido, moeda } from "../util";

const vazio = {
  nome: "",
  preco: "",
  estoque: "",
  voltagem: "",
  dataValidade: "",
};

export function ProdutosPanel() {
  const [lista, setLista] = useState<Produto[]>([]);
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
      setLista(await api.produtos.listar());
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Falha ao listar produtos.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  function iniciarNovo() {
    setEditandoId(null);
    setForm(vazio);
    setMensagem(null);
  }

  function preencherEdicao(p: Produto) {
    setEditandoId(p.id ?? null);
    setForm({
      nome: p.nome ?? "",
      preco: String(p.preco ?? ""),
      estoque: String(p.estoque ?? ""),
      voltagem: p.voltagem != null ? String(p.voltagem) : "",
      dataValidade: formatarDataPedido(p.dataValidade as unknown),
    });
    setMensagem(null);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const err = validateProduto(form);
    if (err) {
      setMensagem({ tipo: "erro", texto: err });
      return;
    }
    const payload = produtoPayloadFromForm(form);
    setCarregando(true);
    setMensagem(null);
    try {
      if (editandoId != null) {
        await api.produtos.atualizar(editandoId, { ...payload, id: editandoId });
        setMensagem({ tipo: "ok", texto: "Produto atualizado." });
      } else {
        await api.produtos.criar(payload);
        setMensagem({ tipo: "ok", texto: "Produto cadastrado." });
      }
      setForm(vazio);
      setEditandoId(null);
      await recarregar();
    } catch (ex) {
      setMensagem({
        tipo: "erro",
        texto: ex instanceof Error ? ex.message : "Erro ao salvar.",
      });
    } finally {
      setCarregando(false);
    }
  }

  async function remover(id: number) {
    if (!window.confirm("Excluir este produto? Itens que o referenciam podem impedir a exclusão.")) {
      return;
    }
    setCarregando(true);
    setMensagem(null);
    try {
      await api.produtos.deletar(id);
      if (editandoId === id) iniciarNovo();
      setMensagem({ tipo: "ok", texto: "Produto excluído." });
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

  return (
    <section className="panel">
      <header className="panel__head">
        <h2>Produtos</h2>
        <p className="muted">
          Nome obrigatório; preço &gt; 0; estoque inteiro ≥ 0; voltagem e validade opcionais.
        </p>
      </header>

      {mensagem && (
        <div className={mensagem.tipo === "erro" ? "banner banner--erro" : "banner banner--ok"}>
          {mensagem.texto}
        </div>
      )}

      <form className="form-grid" onSubmit={salvar}>
        <label>
          Nome
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            autoComplete="off"
          />
        </label>
        <label>
          Preço
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
          />
        </label>
        <label>
          Estoque
          <input
            type="number"
            step="1"
            min="0"
            value={form.estoque}
            onChange={(e) => setForm({ ...form, estoque: e.target.value })}
          />
        </label>
        <label>
          Voltagem (opcional)
          <input
            type="number"
            step="1"
            min="1"
            placeholder="Ex.: 110 ou 220"
            value={form.voltagem}
            onChange={(e) => setForm({ ...form, voltagem: e.target.value })}
          />
        </label>
        <label>
          Validade (opcional)
          <input
            type="date"
            value={form.dataValidade}
            onChange={(e) => setForm({ ...form, dataValidade: e.target.value })}
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={carregando}>
            {editandoId != null ? "Atualizar" : "Cadastrar"}
          </button>
          {editandoId != null && (
            <button type="button" className="btn" onClick={iniciarNovo}>
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
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Voltagem</th>
              <th>Validade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={7} className="muted">
                  {carregando ? "Carregando…" : "Nenhum produto."}
                </td>
              </tr>
            )}
            {lista.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{moeda(p.preco)}</td>
                <td>{p.estoque}</td>
                <td>{p.voltagem ?? "—"}</td>
                <td>{formatarDataPedido(p.dataValidade as unknown) || "—"}</td>
                <td className="cell-actions">
                  <button type="button" className="btn small" onClick={() => preencherEdicao(p)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => p.id != null && remover(p.id)}
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
