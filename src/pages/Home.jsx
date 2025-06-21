import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import "./Home.css";

const categories = [
  { name: "Guitarras", icon: "🎸" },
  { name: "Teclados", icon: "🎹" },
  { name: "Micrófonos", icon: "🎤" },
  { name: "Auriculares", icon: "🎧" },
  { name: "Baterías", icon: "🥁" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setTimeout(() => {
      setCurrent((current + 1) % products.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Loopify</h1>
            <p>Transformá tu música con los mejores equipos de estudio y performance.</p>
            <Link to="/productos">
              <button className="hero-btn">Ver todos los productos</button>
            </Link>
          </div>
          <img
            src="/public/consoladj2.png"
            alt="Controlador MIDI"
            className="hero-img"
          />
        </div>
      </section>

      {/* Carousel de productos destacados */}
      <section className="carousel-section">
        <h2>🔥 Destacados de la semana</h2>
        {products.length > 0 && (
          <>
            <div className="carousel">
              <button
                className="carousel-btn left"
                onClick={() => setCurrent((current - 1 + products.length) % products.length)}
              >
                ◀
              </button>
              <div className="carousel-item">
                <img src={products[current].image} alt={products[current].name} />
                <h4>{products[current].name}</h4>
                <p>${products[current].price}</p>
                <Link to={`/producto/${products[current].id}`}>
                  <button className="btn-secondary">Ver más</button>
                </Link>
              </div>
              <button
                className="carousel-btn right"
                onClick={() => setCurrent((current + 1) % products.length)}
              >
                ▶
              </button>
            </div>
            <div className="carousel-dots">
              {products.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${current === idx ? "active" : ""}`}
                  onClick={() => setCurrent(idx)}
                ></span>
              ))}
            </div>
          </>
        )}
        {products.length === 0 && <p>No hay productos destacados aún.</p>}
      </section>

      {/* Categorías rápidas */}
      <section className="categories-section">
        <h3>Categorías</h3>
        <div className="categories">
          {categories.map((cat) => (
            <Link
              to={`/productos?categoria=${encodeURIComponent(cat.name)}`}
              key={cat.name}
              className="category-card"
            >
              <span className="icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="cta-section">
        <h3>¿Buscás algo especial?</h3>
        <p>Contactanos y te asesoramos para encontrar el instrumento perfecto para vos.</p>
        <Link to="/contacto">
          <button className="btn-primary">Contacto</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Loopify · Tu tienda de confianza</p>
        <div className="footer-links">
          <a href="mailto:info@loopify.com">info@loopify.com</a>
          <span>|</span>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <span>|</span>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
      </footer>
    </div>
  );
}
