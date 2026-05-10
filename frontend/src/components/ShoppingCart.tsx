import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import { useUser } from './UserContext';
import { carritoAPI } from '../services/apiService';
import './ShoppingCart.css';

interface CarritoItem {
  id: number;
  id_carrito: number;
  id_variante: number;
  cantidad: number;
  precio_final?: number;
}

function ShoppingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartItems, setCartItems] = useState<CarritoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { customer } = useUser();

  // Cargar el carrito del backend si el usuario está logueado
  const loadCartFromBackend = async () => {
    if (!customer) return;

    setIsLoading(true);
    try {
      const items = await carritoAPI.getByUsuario(customer.id);
      setCartItems(items);
    } catch (err: any) {
      console.error(err);
      setError('Error loading cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartFromBackend();
  }, [customer]);

  // Guardar carrito local en sessionStorage
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Actualizar cantidad (carrito local)
  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Actualizar cantidad en backend (si está logueado)
  const handleUpdateQuantityBackend = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItemBackend(itemId);
      return;
    }

    try {
      await carritoAPI.updateItem(itemId, newQuantity);
      setCartItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, cantidad: newQuantity } : item
      ));
    } catch (err: any) {
      console.error(err);
      setError('Error updating item');
    }
  };

  // Eliminar del carrito local
  const removeFromCart = (id: number): void => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  // Eliminar del carrito backend
  const handleRemoveItemBackend = async (itemId: number) => {
    try {
      await carritoAPI.removeItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      console.error(err);
      setError('Error removing item');
    }
  };

  // Calcular total del carrito local
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Calcular total del carrito backend
  const totalBackend = cartItems.reduce((acc, item) => {
    return acc + (item.precio_final || 0) * item.cantidad;
  }, 0);

  // Determinar qué carrito mostrar
  const currentTotal = customer ? totalBackend : total;

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <div className="cart-page-container">
      <div className="cart-items-column">
        {error && <div className="error-message">{error}</div>}

        {customer ? (
          cartItems.length === 0 ? (
            <p>Cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image-wrapper">
                  <div className="cart-item-placeholder-image">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                      <line x1="0" y1="0" x2="100" y2="100" stroke="#888" strokeWidth="2"/>
                      <line x1="100" y1="0" x2="0" y2="100" stroke="#888" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h2 className="cart-item-title">Product Variant #{item.id_variante}</h2>
                    <span className="cart-item-price">{item.precio_final || 0}€</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleUpdateQuantityBackend(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => handleUpdateQuantityBackend(item.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItemBackend(item.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          cart.length === 0 ? (
            <p>The cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="cart-item-card">
                <div className="cart-item-image-wrapper">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
                  ) : (
                    <div className="cart-item-placeholder-image">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="#888" strokeWidth="2"/>
                        <line x1="100" y1="0" x2="0" y2="100" stroke="#888" strokeWidth="2"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h2 className="cart-item-title">{item.product.name}</h2>
                    <p className='cart-item-description'>{item.product.description}</p>
                    <span className="cart-item-price">{item.product.price}€</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button onClick={() => handleUpdateQuantity(item.product.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.product.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>

      <div className="cart-summary-column">
        <h2 className="summary-title">
          {customer ? 'Carrito de compra (Backend)' : 'Carrito de compra (Local)'}
        </h2>

        <div className="summary-items">
          {customer ? (
            cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span className="summary-item-name">Producto Variante #{item.id_variante}</span>
                <span className="summary-item-qty">x{item.cantidad}</span>
              </div>
            ))
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="summary-item">
                <span className="summary-item-name">{item.product.name}</span>
                <span className="summary-item-qty">x{item.quantity}</span>
                <button
                  className="summary-item-remove"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="summary-subtotal">
          <span>Subtotal</span>
          <span className="subtotal-amount">{currentTotal.toFixed(2)}€</span>
        </div>

        <button
          className="btn-checkout-black"
          disabled={(customer ? cartItems.length : cart.length) === 0}
          onClick={() => {
            if (customer !== null) {
              navigate('/checkout');
            } else {
              navigate('/login');
            }
          }}
        >
          {customer ? 'Proceed to Payment' : 'Log in to pay'}
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
