import { useState, useRef } from "react";
import "./Contacto.css";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ ok: false, error: "" });
  const honeypotRef = useRef(null); // campo oculto anti-bots

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!EMAIL_RE.test(form.email)) return "Ingresá un email válido.";
    if (form.mensaje.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ok: false, error: "" });

    // honeypot: si tiene contenido, es bot
    if (honeypotRef.current?.value) return;

    const err = validate();
    if (err) {
      setStatus({ ok: false, error: err });
      return;
    }

    try {
      setSending(true);

      // 👉 acá podrías hacer fetch a tu backend
      // await fetch("/api/contact", { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })

      // Simulación
      await new Promise((r) => setTimeout(r, 900));

      setStatus({ ok: true, error: "" });
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch (e2) {
      setStatus({ ok: false, error: "No pudimos enviar tu mensaje. Probá de nuevo." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contacto-container">
      <div className="contacto-card" role="region" aria-labelledby="ct-title">
        <h2 id="ct-title">📬 Contactanos</h2>
        <p className="ct-sub">¿Tenés dudas? Escribinos y te respondemos a la brevedad.</p>

        <form className="contacto-form" onSubmit={onSubmit} noValidate>
          {/* honeypot, escondido a usuarios reales */}
          <input
            ref={honeypotRef}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hp"
            aria-hidden="true"
          />

          <div className="form-group">
            <label htmlFor="nombre">Nombre <span className="req">*</span></label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={onChange}
              disabled={sending}
              aria-required="true"
              aria-invalid={!!status.error && !form.nombre.trim()}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span className="req">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={onChange}
              disabled={sending}
              aria-required="true"
              aria-invalid={!!status.error && !EMAIL_RE.test(form.email)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje <span className="req">*</span></label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              placeholder="Contanos en qué te podemos ayudar"
              value={form.mensaje}
              onChange={onChange}
              disabled={sending}
              aria-required="true"
              aria-invalid={!!status.error && form.mensaje.trim().length < 10}
            />
          </div>

          {status.error && (
            <div className="form-alert error" role="alert">
              {status.error}
            </div>
          )}
          {status.ok && (
            <div className="form-alert success" role="status">
              ✅ ¡Gracias por escribirnos! Te contactaremos pronto.
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={sending}
            aria-busy={sending}
          >
            {sending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>

      <div className="contacto-info" aria-label="Información de contacto">
        <h3>📍 Información de contacto</h3>
        <p>
          📧 <a href="mailto:info@loopify.com">info@loopify.com</a>
        </p>
        <p>
          📱{" "}
          <a href="https://wa.me/59812345678" target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </a>
        </p>
        <p>📍 Montevideo, Uruguay</p>
      </div>
    </div>
  );
}
