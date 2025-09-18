import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "./Home.css";

const categories = [
  { name: "Guitarras", icon: "🎸" },
  { name: "Teclados", icon: "🎹" },
  { name: "Micrófonos", icon: "🎤" },
  { name: "Auriculares", icon: "🎧" },
  { name: "Baterías", icon: "🥁" },
];

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n || 0);

// Fisher–Yates
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState([]); // aleatorios desde DB
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const hoverRef = useRef(false);

  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // --- carga inicial + polling opcional ---
  useEffect(() => {
    let alive = true;
    let pollId;

    const load = async () => {
      try {
        setLoading(true);
        const data = await api.listProducts();        // ← SIEMPRE DB
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
        setErr("");
      } catch (e) {
        if (!alive) return;
        setItems([]); // si falla, no mostramos locales
        setErr("No se pudieron cargar los destacados.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    // 🔁 Polling cada 90s para reflejar cambios de DB sin recargar
    pollId = setInterval(load, 90_000);

    // ♻️ Revalidar al volver a la pestaña
    const onVis = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      clearInterval(pollId);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // cada vez que cambian los items (DB), elegimos aleatorios
  useEffect(() => {
    if (!items.length) {
      setFeatured([]);
      setCurrent(0);
      return;
    }
    const pool = shuffle(items);
    const pick = pool.slice(0, Math.min(8, pool.length));
    setFeatured(pick);
    setCurrent(0);
  }, [items]);

  // autoplay
  useEffect(() => {
    if (!featured.length || prefersReduced) return;
    const id = setInterval(() => {
      if (!hoverRef.current) {
        setCurrent((c) => (c + 1) % featured.length);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [featured.length, prefersReduced]);

  const prev = () => setCurrent((c) => (c - 1 + featured.length) % featured.length);
  const next = () => setCurrent((c) => (c + 1) % featured.length);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero" onKeyDown={onKey}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Loopify</h1>
            <p>Transformá tu música con los mejores equipos de estudio y performance.</p>
            <Link to="/productos">
              <button className="hero-btn">Ver todos los productos</button>
            </Link>
          </div>
          <img src="/consoladj2.png" alt="Controlador MIDI" className="hero-img" loading="eager" />
        </div>
      </section>

      {/* DESTACADOS (desde DB) */}
      <section className="carousel-section" aria-labelledby="destacados-title">
        <h2 id="destacados-title">🔥 Destacados de la semana</h2>

        {loading && <p>Cargando destacados…</p>}
        {err && !loading && <p style={{ color: "#b3261e" }}>{err}</p>}

        {!loading && featured.length > 0 && (
          <>
            <div
              className="carousel"
              onMouseEnter={() => (hoverRef.current = true)}
              onMouseLeave={() => (hoverRef.current = false)}
            >
              <button className="carousel-btn left" onClick={prev} aria-label="Producto anterior">◀</button>

              <div className="carousel-item" role="group" aria-roledescription="slide">
                <img
                  src={featured[current].imageUrl || featured[current].image || "/placeholder.png"}
                  alt={featured[current].name}
                  loading="lazy"
                />
                <h4 className="ci-title">{featured[current].name}</h4>
                <p className="ci-price">{fmt(featured[current].price)}</p>
              <Link to={`/producto/${featured[current]._id}`}>
                <button className="btn-secondary">Ver más</button>
              </Link>
              </div>

              <button className="carousel-btn right" onClick={next} aria-label="Siguiente producto">▶</button>
            </div>

            <div className="carousel-dots" role="tablist" aria-label="Paginación de destacados">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${current === idx ? "active" : ""}`}
                  onClick={() => setCurrent(idx)}
                  role="tab"
                  aria-selected={current === idx}
                  aria-label={`Ir al destacado ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {!loading && featured.length === 0 && <p>No hay productos destacados aún.</p>}
      </section>

      {/* CATEGORÍAS */}
      <section className="categories-section" aria-labelledby="cats-title">
        <h3 id="cats-title">Categorías</h3>
        <div className="categories">
          {categories.map((cat) => (
            <Link
              to={`/productos?categoria=${encodeURIComponent(cat.name)}`}
              key={cat.name}
              className="category-card"
            >
              <span className="icon" aria-hidden="true">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h3>¿Buscás algo especial?</h3>
        <p>Contactanos y te asesoramos para encontrar el instrumento perfecto para vos.</p>
        <Link to="/contacto"><button className="btn-primary">Contacto</button></Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Loopify · Tu tienda de confianza</p>
        <div className="footer-links">
          <a href="mailto:info@loopify.com">info@loopify.com</a><span>|</span>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a><span>|</span>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </footer>
    </div>
  );
}
