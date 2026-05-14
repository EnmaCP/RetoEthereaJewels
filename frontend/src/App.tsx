import { useEffect, useState } from 'react'
import type { Product } from './types'
import { ProductCard } from './components/productCard'
import { useNavigate } from 'react-router-dom';
import type { CartItem } from './types';
import { useUser } from './components/UserContext';
import { productosAPI } from './services/apiService';
import videoPresentation from './components/imagen/videopresentation.mp4';
import cartIcon from './components/imagen/cart2.png';

function App() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Estados para carruseles
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);

  const { customer, loading } = useUser();

  const loadData = async () => {
    try {
      const [productsData] = await Promise.all([
        productosAPI.getAll()
      ]);
      
      const actualCollections = await fetch('http://localhost:3000/api/colecciones').then(res => res.json()).catch(() => []);
      setCollections(actualCollections);

      const mappedProducts: Product[] = productsData.map((p: any) => ({
        id: p.id,
        name: p.nombre,
        description: p.descripcion || "",
        price: Number(p.precio_base),
        category: p.nombre_coleccion || "General",
        stock: 10,
        imageUrl: p.image_url || p.imagen_url || `https://placehold.co/200x200?text=${encodeURIComponent(p.nombre)}`,
        active: p.activo !== false,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = (product: Product): void => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="home-content-wrapper">
      <section className="hero-section">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src={videoPresentation} type="video/mp4" />
        </video>
        
        <div className="hero-overlay-content">
          <span className="hero-subtitle">High Jewelry Atelier</span>
          <h1 className="hero-title">Welcome to Etherea Jewelry</h1>
          <p className="hero-desc">Where timeless elegance meets personal expression.</p>
          <button className="hero-cta" onClick={() => navigate('/catalogue')}>Explore the Collection</button>
        </div>
      </section>

      {/* Categories/Collections Section */}
      <section className="modern-categories-section">
        <div className="section-header-centered">
          <h2 className="modern-section-title">Exclusive Collections</h2>
          <p className="modern-section-subtitle">Curated designs for every milestone</p>
        </div>
        <div className="modern-categories-grid">
          {collections.map((c) => (
            <div 
              key={c.id} 
              className="modern-category-card" 
              onClick={() => navigate(`/catalogue?collection=${c.id}`)}
              style={{ 
                backgroundImage: `url(${c.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'})` 
              }}
            >
              <div className="modern-category-overlay">
                <div className="modern-category-info">
                  <h3>{c.nombre}</h3>
                  <span className="modern-explore-btn">Discover More</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals boutique grid */}
      <section className="modern-new-arrivals-boutique">
        <div className="boutique-header">
          <h2 className="modern-section-title">New Arrivals</h2>
          <p className="modern-section-subtitle">Discover our latest hand-crafted pieces</p>
        </div>
        
        <div className="boutique-grid">
          {products.slice(0, 4).map((product, index) => (
            <div key={product.id} className={`boutique-item item-${index}`}>
              <div className="boutique-image-container" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.imageUrl} alt={product.name} />
                <div className="boutique-overlay">
                   <span>View Detail</span>
                </div>
              </div>
              <div className="boutique-info">
                <h3>{product.name}</h3>
                <p className="boutique-price">{product.price}€</p>
                <button 
                  className="boutique-add-btn"
                  disabled={product.stock === 0 || product.active === false}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection Highlight */}
      {collections.length > 0 && (
        <section className="modern-featured-highlight">
          <div className="modern-highlight-split">
            <div className="modern-highlight-info">
              <span className="highlight-label">Limited Edition</span>
              <h2 className="highlight-name">{collections[0].nombre}</h2>
              <p className="highlight-desc">{collections[0].descripcion || "Discover the intricate craftsmanship and timeless beauty of our flagship collection."}</p>
              <button className="modern-btn-highlight" onClick={() => navigate(`/catalogue?collection=${collections[0].id}`)}>View Full Collection</button>
            </div>
            <div className="modern-highlight-grid">
               {products.filter(p => p.category === collections[0].nombre).slice(0, 3).map(p => (
                 <div key={p.id} className="modern-mini-card" onClick={() => navigate(`/product/${p.id}`)}>
                    <img src={p.imageUrl} alt={p.name} />
                    <div className="modern-mini-info">
                      <h4>{p.name}</h4>
                      <span>{p.price}€</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
