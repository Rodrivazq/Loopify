import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './pages/Cart'
import Checkout from './components/CheckOut'

function App() {
  return (
    <><h1 className="text-4xl text-red-500 font-bold">Hola Tailwind</h1>

      <div className="bg-blue-500 text-white text-xl p-6 rounded-lg shadow-lg">
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<h2 style={{ padding: '1rem' }}>Inicio</h2>} />
                <Route path="/productos" element={<ItemListContainer />} />
                <Route path="/producto/:id" element={<ItemDetailContainer />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  )
}

export default App
