import { useEffect, useState } from 'react'
import type { Product } from './types'
import { ProductCard } from './components/productCard'
import { useNavigate } from 'react-router-dom';
import type { CartItem } from './types';
import { useUser } from './components/UserContext';
import { productosAPI, authAPI } from './services/apiService';
import videoPresentation from './components/imagen/videopresentation.mp4';

function App() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("")

  const { customer, setCustomer, loading, setLoading } = useUser();

  const loadData = async () => {
    try {
      const [productsData, collectionsData] = await Promise.all([
        productosAPI.getAll(),
        productosAPI.getAll() // Reusing for collections if not available or fetching specifically
      ]);
      
      // In a real app we would use coleccionesAPI.getAll()
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
        active: p.active !== false,
      }));
      setProducts(mappedProducts);
      setFeaturedProducts(mappedProducts.slice(0, 5)); // Just take the first 5 for featured
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await productosAPI.create({
        nombre: newName,
        precio_base: parseFloat(newPrice),
        descripcion: newDescription || undefined,
        id_coleccion: newCategory ? parseInt(newCategory) : undefined,
        image_url: newImageUrl || undefined
      });
      setNewName("");
      setNewPrice("");
      setNewCategory("");
      setNewStock("");
      setNewDescription("");
      setNewImageUrl("");
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el producto");
    }
  };

  const handleUpdateStock = async (id: number, currentStock: number): Promise<void> => {
    const input = window.prompt(`Stock actual: ${currentStock}. Nuevo stock (Nota: esto ahora se gestiona en variantes):`);
    if (input === null) return;
    const newStock = parseInt(input);
    if (isNaN(newStock) || newStock < 0) {
      alert("El stock debe ser un número mayor o igual a 0");
      return;
    }
    // As stock is now in variante, this might need further refactoring later
    // We update it through the API just in case it is supported
    try {
      await productosAPI.update(id, { stock: newStock });
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("¿Seguro que quieres borrar este producto?")) return;
    
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

    try {
      await productosAPI.delete(id);
    } catch (error) {
      console.error("Error:", error);
      loadProducts(); // revert optimistically deleted item
    }
  };

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

  useEffect(() =>{
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src={videoPresentation} type="video/mp4" />
        </video>
        
        <div className="hero-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Welcome to Etherea Jewelry</h1>
          <p style={{ fontSize: '1.5rem', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>Make jewelry your own</p>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="featured-carousel-section">
        <h2 className="section-title">Destacados</h2>
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
            {featuredProducts.map((p) => (
              <div key={p.id} className="carousel-slide" onClick={() => navigate(`/product/${p.id}`)}>
                <img src={p.imageUrl} alt={p.name} />
                <div className="carousel-info">
                  <h3>{p.name}</h3>
                  <p>{p.price}€</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn prev" onClick={() => setCarouselIndex(prev => (prev === 0 ? featuredProducts.length - 1 : prev - 1))}>❮</button>
          <button className="carousel-btn next" onClick={() => setCarouselIndex(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}>❯</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Categorías</h2>
        <div className="categories-grid">
          {collections.map((c) => (
            <div 
              key={c.id} 
              className="category-card" 
              onClick={() => navigate(`/catalogue?collection=${c.id}`)}
              style={{ 
                backgroundImage: `url(${c.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'})` 
              }}
            >
              <div className="category-overlay">
                <h3>{c.nombre}</h3>
                <p>Explorar colección</p>
              </div>
            </div>
          ))}
        </div>
      </section>

          {customer?.role === "admin" && (
            <div className="formulario-producto">
              <h3>Añadir producto</h3>
              <form onSubmit={handleSubmit} className="topbar-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre:</label>
                  <input type="text" id="name" name="name" value={newName} onChange={e => setNewName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descripción:</label>
                  <input type="text" id="description" name="description" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Precio:</label>
                  <input type="text" id="price" name="price" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Categoría:</label>
                  <input type="text" id="category" name="category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock:</label>
                  <input type="text" id="stock" name="stock" value={newStock} onChange={e => setNewStock(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl">Imagen:</label>
                  <input type="text" id="imageUrl" name="imageUrl" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
                </div>
                <div className="form-group btn-group">
                  <button type="submit">Añadir</button>
                </div>

              </form>
            </div>
          )}

      <section className="all-products-section">
        <h2 className="section-title">Nuestra Colección</h2>
        <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-item-wrapper">
                <ProductCard product={product} onSelect={(id) => navigate(`/product/${id}`)} />

                <button title="Añadir al carrito" className="btn-add-to-cart" disabled={product.stock === 0 || product.active == false}
                  onClick={() => addToCart(product)}>
                  🛒
                </button>

                <div className="product-actions">
                  {(customer?.role === "admin" || customer?.role === "employee") && (
                    <button className='editarStock' title="Editar stock"
                      onClick={() => handleUpdateStock(product.id, product.stock)}>
                      ✏️
                    </button>
                  )}

                  {customer?.role === "admin" && (
                    <button title="Borrar" className="btn-danger"
                      onClick={() => handleDelete(product.id)}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
      </section>
    </>
  );
}

export default App
