import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <nav className={`navbar ${open ? 'open' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="navbar-logo" onClick={handleClose}>
          Loopify
        </Link>

        <button
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label="Toggle menú"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links ${open ? 'show' : ''}`}>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={handleClose}
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            className={
              location.pathname.startsWith('/productos') ? 'active' : ''
            }
            onClick={handleClose}
          >
            Productos
          </Link>
          <Link
            to="/cart"
            className={location.pathname === '/cart' ? 'active' : ''}
            onClick={handleClose}
          >
            Carrito
          </Link>
          <Link
            to="/contacto"
            className={location.pathname === '/contacto' ? 'active' : ''}
            onClick={handleClose}
          >
            Contacto
          </Link>
          {/* 👉 Nueva sección Admin */}
          <Link
            to="/admin"
            className={location.pathname.startsWith('/admin') ? 'active' : ''}
            onClick={handleClose}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
