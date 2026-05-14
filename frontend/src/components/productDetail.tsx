
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productDetail.css";

interface Variant {
    id: number;
    material: string;
    precio_extra: number;
    stock: number;
    url_imagen?: string;
    imagen_url?: string;
    image_url?: string;
}

interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen_url?: string;
    image_url?: string;
}

interface CartItem {
    product: {
        id: number; // Aquí guardaremos el ID de la VARIANTE
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
    material: string;
}

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // 1. Cargar datos básicos del producto
        fetch(`http://localhost:3000/api/productos/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error("Error al cargar producto:", err));

        // 2. Cargar las variantes (materiales, stock, etc.)
        fetch(`http://localhost:3000/api/productos/variantes/${id}`)
            .then(res => res.json())
            .then(data => {
                setVariants(data);
                if (data.length > 0) {
                    setSelectedVariant(data[0]); // Seleccionamos la primera por defecto
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar variantes:", err);
                setLoading(false);
            });
    }, [id]);

    const addToCartFromDetail = (): void => {
        // 1. Verificación Crítica: Si no hay variante, no se añade nada
        if (!selectedVariant) {
            alert("Por favor, selecciona un material (Oro, Plata, etc.) antes de añadir al carrito.");
            return;
        }

        const saved = sessionStorage.getItem("cart");
        let currentCart: CartItem[] = saved ? JSON.parse(saved) : [];


        const precioBase = Number(product.precio_base || 0);
        const precioExtra = Number(selectedVariant.precio_extra || 0);
        const precioFinal = precioBase + precioExtra;

        const itemToAdd: CartItem = {
            product: {
                // ENVIAMOS EL ID DE LA VARIANTE, NO DEL PRODUCTO
                id: selectedVariant.id,
                name: product.nombre,
                price: precioFinal,
                image: (selectedVariant.url_imagen || selectedVariant.imagen_url || selectedVariant.image_url) ? (selectedVariant.url_imagen || selectedVariant.imagen_url || selectedVariant.image_url) : (product.image_url || product.imagen_url || "")
            },
            quantity: 1,
            material: selectedVariant.material
        };




        const existingIndex = currentCart.findIndex(i => i.product.id === itemToAdd.product.id);

        if (existingIndex !== -1) {
            currentCart[existingIndex].quantity += 1;
        } else {
            currentCart.push(itemToAdd);
        }

        sessionStorage.setItem("cart", JSON.stringify(currentCart));

        // Avisar al Header para que actualice el contador de la cesta
        window.dispatchEvent(new Event("cartUpdated"));
        alert(`¡${product.nombre} (${selectedVariant.material}) añadido al carrito!`);
    };

    if (loading) return (
        <div className="product-loading">
            <div className="spinner"></div>
            <p>Preparando tu joya...</p>
        </div>
    );

    if (!product) return (
        <div className="product-error">
            <h2>Vaya, no hemos encontrado esa joya</h2>
            <button onClick={() => navigate('/')}>Volver al catálogo</button>
        </div>
    );

    const precioBase = Number(product?.precio_base || 0);
    const precioExtra = Number(selectedVariant?.precio_extra || 0);
    const precioMostrar = (precioBase + precioExtra).toFixed(2);

    return (
        <div className="product-detail-container">
            <div className="product-detail-grid">
                {/* Columna Izquierda: Imagen */}
                <div className="product-image-section">
                    <div className="image-wrapper">
                        <img 
                            src={(selectedVariant?.url_imagen || selectedVariant?.imagen_url || selectedVariant?.image_url) ? (selectedVariant?.url_imagen || selectedVariant?.imagen_url || selectedVariant?.image_url) : (product.image_url || product.imagen_url || `https://placehold.co/600x600?text=${encodeURIComponent(product.nombre)}`)} 
                            alt={product.nombre} 
                            className="main-product-image" 
                        />
                    </div>
                </div>

                {/* Columna Derecha: Info y Selección */}
                <div className="product-info-section">
                    <div className="product-header">
                        <h1 className="product-title">{product.nombre}</h1>
                        <div className="price-tag">{precioMostrar}€</div>
                    </div>

                    <div className="product-description">
                        <span className="section-label">Descripción</span>
                        <p>{product.descripcion}</p>
                    </div>

                    <div className="variants-section">
                        <span className="section-label">Material</span>
                        <div className="material-options">
                            {variants.map(v => (
                                <button
                                    key={v.id}
                                    className={`material-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                                    onClick={() => setSelectedVariant(v)}
                                >
                                    <span className="material-dot" style={{ backgroundColor: getMaterialColor(v.material) }}></span>
                                    {v.material}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="stock-info">
                        {selectedVariant && (
                            <div className={`stock-badge ${selectedVariant.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                                <span className="stock-dot"></span>
                                {selectedVariant.stock > 0
                                    ? `En stock: ${selectedVariant.stock} unidades`
                                    : "Agotado"}
                            </div>
                        )}
                    </div>

                    <div className="actions-section">
                        <button
                            className="product-detail-add-btn"
                            onClick={addToCartFromDetail}
                            disabled={!selectedVariant || selectedVariant.stock <= 0}
                        >
                            Añadir a la cesta
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </button>
                        <button className="btn-go-back" onClick={() => navigate(-1)}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getMaterialColor(material: string) {
    const m = material.toLowerCase();
    if (m.includes("oro") && m.includes("rosa")) return "#e7accf";
    if (m.includes("oro")) return "#d4af37";
    if (m.includes("plata")) return "#c0c0c0";
    if (m.includes("diamante")) return "#e5e5e5";
    return "#333";
}
