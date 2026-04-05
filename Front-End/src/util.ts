/** Normaliza data vinda da API (string ISO ou array do Jackson em versões antigas). */
export function formatarDataPedido(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") {
    return val.length >= 10 ? val.slice(0, 10) : val;
  }
  if (Array.isArray(val) && val.length >= 3) {
    const [y, m, d] = val as number[];
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  return String(val);
}

export const moeda = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );
