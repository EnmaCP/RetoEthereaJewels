
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
        imageUrl: string;
    };
    quantity: number;
    material: string;
    personalization?: {
        url_foto?: string;
        texto_grabado?: string;
    };
}

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Estados para personalización
    const [showPersonalize, setShowPersonalize] = useState(false);
    const [persoFoto, setPersoFoto] = useState("");
    const [persoTexto, setPersoTexto] = useState("");
    const [persoGuardada, setPersoGuardada] = useState(false);

    useEffect(() => {
        if (!id) return;

        // 1. Cargar datos básicos del producto
        fetch(`http://localhost:3000/api/productos/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error("Error loading product:", err));

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
                console.error("Error loading variants:", err);
                setLoading(false);
            });
    }, [id]);

    const addToCartFromDetail = (): void => {
        // 1. Verificación Crítica: Si no hay variante, no se añade nada
        if (!selectedVariant) {
            alert("Please select a material (Gold, Silver, etc.) before adding to cart.");
            return;
        }

        const saved = sessionStorage.getItem("cart");
        let currentCart: CartItem[] = saved ? JSON.parse(saved) : [];


        const precioBase = Number(product.precio_base || 0);
        const precioExtra = Number(selectedVariant.precio_extra || 0);
        const precioPerso = persoGuardada ? 5.00 : 0;
        const precioFinal = precioBase + precioExtra + precioPerso;

        const itemToAdd: CartItem = {
            product: {
                // ENVIAMOS EL ID DE LA VARIANTE, NO DEL PRODUCTO
                id: selectedVariant.id,
                name: product.nombre,
                price: precioFinal,
                imageUrl: (selectedVariant.url_imagen || selectedVariant.imagen_url || selectedVariant.image_url) ? (selectedVariant.url_imagen || selectedVariant.imagen_url || selectedVariant.image_url) : (product.image_url || product.imagen_url || "")
            },
            quantity: 1,
            material: selectedVariant.material,
            personalization: persoGuardada ? {
                url_foto: persoFoto,
                texto_grabado: persoTexto
            } : undefined
        };

        // Para items personalizados, los tratamos como únicos (no agrupamos por ID si tienen distinta personalización)
        const existingIndex = currentCart.findIndex(i => 
            i.product.id === itemToAdd.product.id && 
            JSON.stringify(i.personalization) === JSON.stringify(itemToAdd.personalization)
        );

        if (existingIndex !== -1) {
            currentCart[existingIndex].quantity += 1;
        } else {
            currentCart.push(itemToAdd);
        }

        sessionStorage.setItem("cart", JSON.stringify(currentCart));

        // Avisar al Header para que actualice el contador de la cesta
        window.dispatchEvent(new Event("cartUpdated"));
        alert(`${product.nombre} (${selectedVariant.material})${persoGuardada ? " personalized" : ""} added to cart!`);
    };

    const handleConfirmPerso = async () => {
        if (!selectedVariant) return;
        
        try {
            const res = await fetch("http://localhost:3000/api/detalle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_variante: selectedVariant.id,
                    url_foto: persoFoto,
                    texto_grabado: persoTexto,
                    fuente_seleccionada: "luxury-script",
                    precio_extra: 5.00 // Precio extra por personalizar
                })
            });
            
            if (res.ok) {
                setPersoGuardada(true);
                setShowPersonalize(false);
                alert("Personalization saved successfully (+5.00€)");
            }
        } catch (error) {
            console.error("Error saving personalization:", error);
        }
    };

    if (loading) return (
        <div className="product-loading">
            <div className="spinner"></div>
            <p>Preparing your piece...</p>
        </div>
    );

    if (!product) return (
        <div className="product-error">
            <h2>Oops, we couldn't find that piece</h2>
            <button onClick={() => navigate('/')}>Back to catalogue</button>
        </div>
    );

    const precioBase = Number(product?.precio_base || 0);
    const precioExtra = Number(selectedVariant?.precio_extra || 0);
    const precioPerso = persoGuardada ? 5.00 : 0;
    const precioMostrar = (precioBase + precioExtra + precioPerso).toFixed(2);

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
                        <span className="section-label">Description</span>
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
                                    ? `In stock: ${selectedVariant.stock} units`
                                    : "Out of stock"}
                            </div>
                        )}
                    </div>

                    <div className="actions-section">
                        {!persoGuardada && (
                            <button 
                                className="btn-personalize-outline"
                                onClick={() => setShowPersonalize(!showPersonalize)}
                            >
                                {showPersonalize ? "Close Personalization" : "Add Personalization (+5€)"}
                            </button>
                        )}
                        
                        {showPersonalize && (
                            <div className="personalize-form">
                                <div className="form-group">
                                    <label>Image/Photo URL:</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://..." 
                                        value={persoFoto}
                                        onChange={(e) => setPersoFoto(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Text to engrave:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Your message here..." 
                                        value={persoTexto}
                                        onChange={(e) => setPersoTexto(e.target.value)}
                                    />
                                </div>
                                <button className="btn-confirm-perso" onClick={handleConfirmPerso}>
                                    Confirm Design
                                </button>
                            </div>
                        )}

                        {persoGuardada && (
                            <div className="perso-applied-badge">
                                ✓ Personalization applied
                                <button className="btn-remove-perso" onClick={() => setPersoGuardada(false)}>Remove</button>
                            </div>
                        )}

                        <button
                            className="product-detail-add-btn"
                            onClick={addToCartFromDetail}
                            disabled={!selectedVariant || selectedVariant.stock <= 0}
                        >
                            Add to cart
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </button>
                        <button className="btn-go-back" onClick={() => navigate(-1)}>
                            Back
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
