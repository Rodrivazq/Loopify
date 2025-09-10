import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ItemList from "./ItemList";
import { api } from "../services/api";
import "./ItemListContainer.css";

export default function ItemListContainer() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Filtros UI
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState(""); // debounced
  const [cat, setCat] = useState("Todos");
  const [order, setOrder] = useState("price-asc");

  // Lee ?categoria= de la URL (categorías rápidas)
  const [sp] = useSearchParams();
  useEffect(() => {
    const fromURL = sp.get("categoria");
    if (fromURL) setCat(fromURL);
  }, [sp]);

  // Debounce para la búsqueda (mejor UX)
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 300);
    return () => clearTimeout(t);
  }, [qInput]);

  // Carga desde API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const [p, c] = await Promise.all([api.listProducts(), api.getCategories()]);
        setItems(p); // p[i] ya incluye category?.name (por include: { category: true })
        setCats([{ id: 0, name: "Todos" }, ...c.sort((a, b) => a.name.localeCompare(b.name))]);
      } catch (e) {
        console.error(e);
        setErr("No se pudo cargar el catálogo");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Aplica filtros en memoria
  const filtered = useMemo(() => {
    let data = [...items];

    if (cat && cat !== "Todos") {
      data = data.filter(
        (p) => (p.category?.name || "").toLowerCase() === cat.toLowerCase()
      );
    }

    if (q) {
      const s = q.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          (p.description || "").toLowerCase().includes(s)
      );
    }

    switch (order) {
      case "price-asc":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        data.sort((a, b) => b.price - a.price);
        break;
      case "name":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return data;
  }, [items, q, cat, order]);

  return (
    <div className="cat-wrap">
      <header className="cat-header">
        <h2>Catálogo de productos</h2>
        {!loading && (
          <span className="cat-count">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </header>

      {/* Filtros */}
      <section className="filters">
        <label className="field">
          <span className="field-label">Buscar</span>
          <input
            aria-label="Buscar productos"
            placeholder="Buscar por nombre o descripción"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="input"
          />
        </label>

        <label className="field">
          <span className="field-label">Categoría</span>
          <select
            aria-label="Filtrar por categoría"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="input"
          >
            {cats.map((c) => (
              <option key={`${c.id}-${c.name}`}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Orden</span>
          <select
            aria-label="Ordenar"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="input"
          >
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A–Z</option>
          </select>
        </label>
      </section>

      {err && <p className="cat-error">{err}</p>}

      {loading ? (
        <div className="cat-skeleton">
          <div className="skel-card" />
          <div className="skel-card" />
          <div className="skel-card" />
        </div>
      ) : filtered.length ? (
        <ItemList products={filtered} />
      ) : (
        <div className="cat-empty">
          <p>😕 No encontramos productos con esos filtros.</p>
          <button className="btn-clear" onClick={() => { setQInput(""); setCat("Todos"); setOrder("price-asc"); }}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
