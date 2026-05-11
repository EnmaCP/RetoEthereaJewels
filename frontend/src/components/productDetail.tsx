import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { NotFound } from "./NotFound";
import "./productDetail.css";
import type { CartItem } from '../types';
import type { Review } from '../types';
import { productosAPI, reviewsAPI } from '../services/apiService';

export function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const addToCartFromDetail = (product: Product): void => {
        const saved = sessionStorage.getItem("cart");
        let currentCart: CartItem[] = saved ? JSON.parse(saved) : [];

        const existing = currentCart.find(i => i.product.id === product.id);

        if (existing) {
            currentCart = currentCart.map(i =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            currentCart = [...currentCart, { product, quantity: 1 }];
        }

        // Guardar el nuevo carrito actualizado en sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(currentCart));
        // Actualizar el estado local para mantener coherencia en este componente
        setCart(currentCart);

        alert("¡Producto añadido al carrito correctamente!");
    };

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        productosAPI.getById(Number(id))
            .then(data => {
                const mappedProduct: Product = {
                    id: data.id,
                    name: data.nombre,
                    description: data.descripcion || "",
                    price: Number(data.precio_base),
                    category: data.nombre_coleccion || "General",
                    stock: 10, // Stock se maneja en variante
                    imageUrl: data.image_url || data.imagen_url || `https://placehold.co/200x200?text=${encodeURIComponent(data.nombre)}`,
                    active: data.active !== false,
                };
                setProduct(mappedProduct);
                setIsLoading(false);
            })
            .catch(() => {
                setHasError(true);
                setIsLoading(false);
            });
    }, [id]);

    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");

    const fetchReviews = () => {
        if (!id) return;
        reviewsAPI.getByProducto(Number(id))
            .then(data => {
                if (Array.isArray(data)) {
                    const mappedReviews = data.map((r: any) => ({
                        id: r.id,
                        rating: r.valoracion,
                        comment: r.comentario,
                        created_at: r.created_at,
                        username: "Usuario",
                    }));
                    setReviews(mappedReviews);
                } else {
                    setReviews([]);
                }
            })
            .catch(() => setReviews([]));
    };

    useEffect(() => {
        fetchReviews();
    }, [id]);

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        reviewsAPI.create({
            id_producto: Number(id),
            id_usuario: 1, // usuario simulado
            valoracion: rating,
            titulo: "Reseña",
            comentario: comment
        })
            .then(() => {
                fetchReviews();
                setComment("");
                setRating(5);
            })
            .catch((err) => console.error("Error al crear reseña:", err));
    };


    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando detalles del producto...</div>;
    }

    if (hasError || !product) {
        return <NotFound />;
    }

    return (
        <div className="product-page-wrapper">
            <div className="product-detail-card">
                <div className="product-image-box">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-details-box">
                    <button className="btn-favorite">♡</button>
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-desc">{product.description}</p>

                    <div className="product-colors">
                        <button className="color-btn silver"></button>
                        <button className="color-btn rose-gold"></button>
                        <button className="color-btn gold selected"></button>
                    </div>

                    <div className="product-bottom-row">
                        <button className="btn-personalize">PERSONALIZAR</button>
                        <div className="price-cart-col">
                            <span className="product-price-large">{product.price}€</span>
                            <button className="btn-add-cart" onClick={() => addToCartFromDetail(product)} disabled={product.stock === 0}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-actions-extra">
                <button className="product-detail_back" onClick={() => navigate('/')}>Volver al catálogo</button>
            </div>

            <div className="reviews-section">
                <h3>Reseñas</h3>
                {reviews.length > 0 ? (
                    <ul className="reviews-list">
                        {reviews.map(r => (
                            <li key={r.id}>
                                <strong>{r.username || "User"}</strong> - <span style={{ color: "gold" }}>{"★".repeat(r.rating)}</span>{"☆".repeat(5 - r.rating)}
                                <p>{r.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews yet.</p>
                )}

                <form onSubmit={submitReview} className="review-form">
                    <h4>Leave your review</h4>
                    <label>
                        Valoración:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} estrela{n > 1 ? 's' : ''}</option>)}
                        </select>
                    </label>
                    <label>
                        Comment:
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                    </label>
                    <button type="submit">Send review</button>
                </form>
            </div>
        </div>
    );
}
/*
import type { Product } from "../types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productDetail.css";

/*
interface ProductDetailProps {
    product: Product;
    onClose?: () => void;
}
   

export function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
    }, [id]);

    if (!product) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="product-detail">
            <img className="product-image" src={product.imageUrl} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">{product.price}</p>
            <p className={`product-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stock > 0 ? `En Stock - ${product.stock} unidades` : "Sin Stock- 0 unidades"}
            </p>
            <button className="product-detail_back" onClick={() => navigate('/')}>Volver al catálogo</button>
        </div>
    );
}
*/