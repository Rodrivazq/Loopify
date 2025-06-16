
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#222',
      color: '#fff'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>
        Loopify
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>Inicio</Link>
        <Link to="/productos" style={{ textDecoration: 'none', color: '#fff' }}>Productos</Link>
        <Link to="/cart" style={{ textDecoration: 'none', color: '#fff' }}>Carrito</Link>
      </div>
    </nav>
  )
}

export default Navbar
