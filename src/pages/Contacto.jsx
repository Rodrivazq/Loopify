import { useState } from "react";
import "./Contacto.css";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías conectar con backend o servicio de envío
    setEnviado(true);
    setForm({ nombre: "", email: "", mensaje: "" });
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <div className="contacto-container">
      <div className="contacto-card">
        <h2>📬 Contactanos</h2>
        <p>¿Tenés dudas o querés saber más? Escribinos, te respondemos enseguida.</p>

        <form className="contacto-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Contanos en qué te podemos ayudar"
            />
          </div>

          <button type="submit" className="btn-primary">Enviar mensaje</button>

          {enviado && (
            <p className="enviado-msg">✅ ¡Gracias por escribirnos! Te contactaremos pronto.</p>
          )}
        </form>
      </div>

      <div className="contacto-info">
        <h3>📍 Información de contacto</h3>
        <p>📧 <a href="mailto:info@loopify.com">info@loopify.com</a></p>
        <p>📱 <a href="https://wa.me/59812345678" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></p>
        <p>📍 Montevideo, Uruguay</p>
      </div>
    </div>
  );
}
