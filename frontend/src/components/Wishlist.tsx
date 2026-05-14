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
            console.error("Wishlist error:", error);
        }
    };

    return (
        <div className="product-card">
            <div className="product-card-image">
                <img src={product.imageUrl} alt={product.name} />
                <button 
                    onClick={toggleWishlist}
                    className="wishlist-btn-overlay"
                    title={isFavorite ? "Remove from list" : "Add to wishlist"}
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>

            <div className="product-card-info">
                <h3>{product.name}</h3>
                
                <p className="price">
                    {Number(product.price).toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                </p>
                
                <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                    {product.stock > 0 ? "In Stock" : "On Demand"}
                </p>

                <button className="btn-add-cart" disabled={product.stock === 0} style={{ width: '100%', marginTop: '10px' }}>
                    Add to cart
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
            setError('Error loading wishlist');
            setLoading(false);
        });
    }, [customer]);

    if (!customer) return <div className="wishlist-page" style={{ padding: "40px", textAlign: "center" }}><p>You must log in to see your wishlist.</p></div>;
    if (loading) return <div className="wishlist-page" style={{ padding: "40px", textAlign: "center" }}><p>Loading wishlist...</p></div>;
    if (error) return <div className="wishlist-page" style={{ padding: "40px", textAlign: "center", color: "red" }}><p>{error}</p></div>;

    return (
        <div className="wishlist-page" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>My Wishlist</h2>
            {wishlist.length === 0 ? (
                <p style={{ textAlign: "center" }}>Your wishlist is empty.</p>
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