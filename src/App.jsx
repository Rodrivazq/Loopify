import AdminProducts from './pages/AdminProducts';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemListContainer from './components/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer';
import Cart from './pages/Cart';
import Checkout from './components/CheckOut';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Confirmacion from './components/Confirmacion';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ItemListContainer />} />
          <Route path="/producto/:id" element={<ItemDetailContainer />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin" element={<AdminProducts />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
