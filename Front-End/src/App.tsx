import { useState } from "react";
import { ProdutosPanel } from "./components/ProdutosPanel";
import { PedidosPanel } from "./components/PedidosPanel";
import { ItensPanel } from "./components/ItensPanel";

type Aba = "produtos" | "pedidos" | "itens";

const base = () =>
  (import.meta.env.VITE_API_BASE ?? "http://localhost:8080").replace(/\/$/, "");

export default function App() {
  const [aba, setAba] = useState<Aba>("produtos");

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Gestão de pedidos</h1>
          <p className="muted">CRUD alinhado à API Spring — validação no formulário antes de enviar.</p>
        </div>
        <nav className="tabs" aria-label="Seções">
          <button
            type="button"
            className={aba === "produtos" ? "tab tab--on" : "tab"}
            onClick={() => setAba("produtos")}
          >
            Produtos
          </button>
          <button
            type="button"
            className={aba === "pedidos" ? "tab tab--on" : "tab"}
            onClick={() => setAba("pedidos")}
          >
            Pedidos
          </button>
          <button
            type="button"
            className={aba === "itens" ? "tab tab--on" : "tab"}
            onClick={() => setAba("itens")}
          >
            Itens
          </button>
        </nav>
      </header>

      <main className="main">
        {aba === "produtos" && <ProdutosPanel />}
        {aba === "pedidos" && <PedidosPanel />}
        {aba === "itens" && <ItensPanel />}
      </main>

      <footer className="footer muted">
        API: <code>{base()}</code> — defina <code>VITE_API_BASE</code> no arquivo <code>.env</code> se
        necessário.
      </footer>
    </div>
  );
}
