import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import './CheckoutPage.css';

export function CheckoutPage() {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const saved = sessionStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

   const handleCheckout = () => {
        if (cart.length === 0) {
            alert("There are no products in the cart");
            return;
        }

        if (!address.trim()) {
            alert("Please, write your address");
            return;
        }
        
        fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include",
            body: JSON.stringify({
                items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: item.product.price
                })),
                address: address,
            })
        })
        .then(async (res) => {
            const data = await res.json();
            
            if (!res.ok) {
                if (res.status === 409) {
                    throw new Error(data.error); 
                }
                throw new Error("Error processing order");
            }
            return data;
        })
        .then((data) => {
            console.log("Order completed", data);
            alert(`Order completed successfully. Order number: ${data.order?.id || 'Unknown'}`);
            setCart([]);
            setAddress("");
            sessionStorage.removeItem("cart");
            navigate("/mis-pedidos");
        })
        .catch(err => {
            alert(err.message); 
        });
        
    }

    return (
        <div className="checkout-wrapper">
            <h1>Finalizar Compra</h1>

            <div className="checkout-container">
                <div className="cart-section">
                    <h2 className="checkout-section-title">Your cart</h2>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '1.2rem' }}>Cart is empty</p>
                            <button className="btn-back" onClick={() => navigate("/")}>&larr; Back to shop</button>
                        </div>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item.product.id} className="cart-item">
                                    <span className="cart-item-name">{item.product.name} <span style={{color: '#888'}}>x {item.quantity}</span></span>
                                    <span className="cart-item-price">Subtotal: {(item.product.price * item.quantity).toFixed(2)}€</span>
                                </div>
                            ))}
                            <div className="cart-total">Total: {total.toFixed(2)}€</div>
                        </>
                    )}
                </div>
                
                <div className="address-section">
                    <h2 className="checkout-section-title">Shipping Address</h2>
                    <input 
                        type="text" 
                        className="address-input"
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="Ej: Calle Violeta Parra 9, Zaragoza"
                    />
                </div>
                
                <div className="checkout-actions">
                    <button className="btn-back" onClick={() => navigate("/")}>&larr; Continue shopping</button>
                    <button 
                        className="btn-complete-order"
                        onClick={handleCheckout} 
                        disabled={!address.trim() || cart.length === 0}
                    >
                        Confirm and pay
                    </button>
                </div>
            </div>
        </div>
    );
}