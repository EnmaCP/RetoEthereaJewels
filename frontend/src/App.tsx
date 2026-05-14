import { useEffect, useState } from 'react'
import type { Product } from './types'
import { ProductCard } from './components/productCard'
import { useNavigate } from 'react-router-dom';
import type { CartItem } from './types';
import { useUser } from './components/UserContext';
import { productosAPI, authAPI } from './services/apiService';
import videoPresentation from './components/imagen/videopresentation.mp4';
import edit from './components/imagen/edit.png';
import trash from './components/imagen/delete1.png';
import settings from './components/imagen/setting2.png';
import cartIcon from './components/imagen/cart2.png';

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
      loadData();
    } catch (error) {
      console.error("Error:", error);
      alert("Error while creating the product");
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
      loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

    try {
      await productosAPI.delete(id);
    } catch (error) {
      console.error("Error:", error);
      loadData(); // revert optimistically deleted item
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
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  if (loading) return <div>Loading...</div>;

  const renderProductGrid = (title: string, productsToRender: Product[]) => {
    if (productsToRender.length === 0) return null;
    return (
      <section className="all-products-section">
        <h2 className="section-title">{title}</h2>
        <div className="products-grid">
          {productsToRender.map((product) => (
            <div key={product.id} className="product-item-wrapper">
              <ProductCard product={product} onSelect={(id) => navigate(`/product/${id}`)} />

              <button title="Añadir al carrito" className="btn-add-to-cart" disabled={product.stock === 0 || product.active == false}
                onClick={() => addToCart(product)}>
                <img src={cartIcon} style={{ width: '20px', height: '20px' }} alt="carrito" />
              </button>

              <div className="product-actions">
                {(customer?.role === "admin" || customer?.role === "employee") && (
                  <button className='editarStock' title="Editar stock"
                    onClick={() => handleUpdateStock(product.id, product.stock)}>
                    <img src={edit} />
                  </button>
                )}

                {customer?.role === "admin" && (
                  <button className='editarStock' title="Editar producto"
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                    <img src={settings} />
                  </button>
                )}

                {customer?.role === "admin" && (
                  <button title="Borrar" className="btn-danger"
                    onClick={() => handleDelete(product.id)}>
                    <img src={trash} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

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

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Collections</h2>
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
                <p>Explore collection</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Grid */}
      {renderProductGrid("New Arrivals", [...products].reverse().slice(0, 4))}

      {/* Specific Collection Grid */}
      {collections.length > 0 && renderProductGrid(collections[0].nombre, products.filter(p => p.category === collections[0].nombre).slice(0, 4))}
    </>
  );
}

export default App
