import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useUser } from './UserContext';

export function WishlistCard({ product, onRemove }: { product: Product, onRemove?: () => void }) {
    const [isFavorite, setIsFavorite] = useState(true);
    
    const toggleWishlist = async () => {
        try {
            if (isFavorite) {
                await fetch(`http://localhost:3000/api/wishlist/${product.id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                setIsFavorite(false);
                if (onRemove) onRemove();
            } else {   
                await fetch("http://localhost:3000/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ id_producto: product.id })
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error en wishlist:", error);
        }
    };

    return(
        <div className="product-card">
            <div className="product-image-container" style={{ position: "relative" }}>
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    style={{ width: "100%", borderRadius: "8px" }}
                />
                
                <button 
                    onClick={toggleWishlist}
                    className="wishlist-btn"
                    style={{ 
                        position: "absolute", 
                        top: "10px", 
                        right: "10px", 
                        background: "transparent", 
                        border: "none", 
                        fontSize: "1.5rem", 
                        cursor: "pointer" 
                    }}
                    title={isFavorite ? "Quitar de la lista" : "Añadir a la lista de deseos"}
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>

            <div className="product-info" style={{ marginTop: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>
                
                <p className="price" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {Number(product.price).toFixed(2)} €
                </p>
                
                <p className="stock" style={{ color: product.stock > 0 ? "green" : "orange" }}>
                    {product.stock > 0 ? "Disponible en taller" : "Por encargo (Bajo demanda)"}
                </p>

                <button className="btn-cart" disabled={product.stock === 0}>
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
}

export function Wishlist() {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { customer } = useUser();

    useEffect(() => {
        if (!customer) {
            setLoading(false);
            return;
        }

        fetch('http://localhost:3000/api/wishlist', {
            credentials: 'include'
        })
        .then(res => {
            if (!res.ok) throw new Error('Error fetching wishlist');
            return res.json();
        })
        .then(data => {
            setWishlist(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError('Error al cargar la lista de deseos');
            setLoading(false);
        });
    }, [customer]);

    if (!customer) return <div className="wishlist-page" style={{ padding: "40px", textAlign: "center" }}><p>Debes iniciar sesión para ver tu lista de deseos.</p></div>;
    if (loading) return <div className="wishlist-page" style={{ padding: "40px", textAlign: "center" }}><p>Cargando lista de deseos...</p></div>;
    if (error) return <div className="wishlist-page" style={{ padding: "40px", textAlign: "center", color: "red" }}><p>{error}</p></div>;

    return (
        <div className="wishlist-page" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Mi Lista de Deseos</h2>
            {wishlist.length === 0 ? (
                <p style={{ textAlign: "center" }}>Tu lista de deseos está vacía.</p>
            ) : (
                <div className="products-grid">
                    {wishlist.map(product => (
                        <WishlistCard 
                            key={product.id} 
                            product={product} 
                            onRemove={() => {
                                setWishlist(prev => prev.filter(p => p.id !== product.id));
                            }} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}