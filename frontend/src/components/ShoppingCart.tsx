import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import { useUser } from './UserContext';
import './ShoppingCart.css';
import remove from "../components/imagen/delete1.png";

function ShoppingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const { customer } = useUser();
  useEffect(() => {
    //Guardar carrito en basede datos
    if (customer !== null) {
      const data = {
        id_carrito: customer.id,
        id_variante: cart.map(item => item.product.id),
        cantidad: cart.map(item => item.quantity)
      };
    }
    window.dispatchEvent(new Event("cartUpdated"));
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

  const removeFromCart = (id: number): void => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  // Calcular total del carrito local
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="cart-page-container">
      <div className="cart-items-column">

        {cart.length === 0 ? (
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
                  <span className="cart-item-price">{item.product.price}€</span>
                </div>
                <p className='cart-item-description'>{item.product.description}</p>

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
        )}
      </div>

      <div className="cart-summary-column">
        <h2 className="summary-title">Summary of order</h2>

        <div className="summary-items">
          {cart.map((item) => (
            <div key={item.product.id} className="summary-item">
              <span className="summary-item-name">{item.product.name}</span>
              <span className="summary-item-qty">x{item.quantity}</span>
              <button
                className="summary-item-remove"
                onClick={() => removeFromCart(item.product.id)}
              >
                <img src={remove} alt="Remove" style={{ width: '20px', height: '20px', verticalAlign: 'middle' }} />
              </button>
            </div>
          ))}
        </div>

        <div className="summary-subtotal">
          <span>Subtotal</span>
          <span className="subtotal-amount">{total.toFixed(2)}€</span>
        </div>

        <button
          className="btn-checkout-black"
          disabled={cart.length === 0}
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
