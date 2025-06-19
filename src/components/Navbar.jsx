import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Loopify
      </Link>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>
        <Link to="/productos" className={location.pathname.startsWith('/productos') ? 'active' : ''}>Productos</Link>
        <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>Carrito</Link>
        <Link to="/contacto" className={location.pathname === '/contacto' ? 'active' : ''}>Contacto</Link>
      </div>
    </nav>
  );
};

export default Navbar;

