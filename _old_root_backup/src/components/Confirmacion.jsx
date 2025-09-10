import { useLocation, Link } from 'react-router-dom';
import './Confirmacion.css';

const Confirmacion = () => {
  const location = useLocation();
  const orden = location.state?.orden;

  return (
    <div className="confirmacion-container">
      <h2>¡Gracias por tu compra!</h2>
      <p className="confirmacion-msj">
        Hemos recibido tu pedido.<br/>
        <b>En breve nos pondremos en contacto para coordinar la entrega.</b>
      </p>

      {orden && (
        <div className="confirmacion-detalle">
          <h4>Resumen de tu compra:</h4>
          <ul>
            {orden.items.map(item => (
              <li key={item.id}>
                <span>{item.name}</span> x{item.quantity} - <b>${item.price * item.quantity}</b>
              </li>
            ))}
          </ul>
          <div className="confirmacion-total">
            <span>Total abonado:</span>
            <span className="checkout-total">${orden.total}</span>
          </div>
        </div>
      )}

      <Link to="/productos" className="volver-link" style={{marginTop: '2rem'}}>← Volver al catálogo</Link>
    </div>
  );
};

export default Confirmacion;
