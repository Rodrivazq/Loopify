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
    // Aquí podrías enviar el form por email/service/backend
    setEnviado(true);
    setForm({ nombre: "", email: "", mensaje: "" });
    setTimeout(() => setEnviado(false), 3500);
  };

  return (
    <div className="contacto-container">
      <h2>Contacto</h2>
      <p>¿Querés hacer una consulta? Escribinos y te respondemos a la brevedad.</p>
      <form className="contacto-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mensaje
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            required
            rows={5}
          />
        </label>
        <button type="submit" className="btn-primary">
          Enviar
        </button>
        {enviado && <p className="enviado-msg">¡Mensaje enviado! Nos pondremos en contacto pronto.</p>}
      </form>
      <div className="contacto-info">
        <p>📧 <a href="mailto:info@loopify.com">info@loopify.com</a></p>
        <p>📱 <a href="https://wa.me/59812345678" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
        <p>📍 Montevideo, Uruguay</p>
      </div>
    </div>
  );
}
