import { useCart } from '../context/CartProvider'; // (Importamos nuestro contexto para acceder a los datos del carrito)
import { FaShoppingCart } from 'react-icons/fa'; // (Ícono de carrito de compras)
import { Link } from 'react-router-dom'; // (Para que al hacer clic lleve al carrito)

const CartWidget = () => {
  const { cartQuantity } = useCart(); // (Obtenemos la cantidad total de productos)

  return (
    <Link
      to="/cart"
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
    >
      <FaShoppingCart size={24} color="white" />
      {cartQuantity > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
          }}
        >
          {cartQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartWidget;
