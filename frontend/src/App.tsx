import { useEffect, useState } from 'react'
import type { Product } from './types'
import { ProductCard } from './components/productCard'
import { useNavigate } from 'react-router-dom';
import type { CartItem } from './types';
import { useUser } from './components/UserContext';
import videoPresentation from './components/imagen/videopresentation.mp4';


function App() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("")

  const { customer, setCustomer, loading, setLoading } = useUser();

  const loadProducts = () => {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error loading products:", error));
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No hay sesión activa");
      })
      .then((data) => setCustomer(data.customer))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, [setCustomer, setLoading]);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({
        name: newName,
        price: parseFloat(newPrice),
        description: newDescription || undefined,
        category: newCategory || undefined,
        stock: newStock ? parseInt(newStock) : undefined,
        imageUrl: newImageUrl || undefined
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error " + res.status);
        return res.json();
      })
      .then(() => {
        setNewName("");
        setNewPrice("");
        setNewCategory("");
        setNewStock("");
        setNewDescription("");
        setNewImageUrl("");
        loadProducts();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUpdateStock = (id: number, currentStock: number): void => {
    const input = window.prompt(`Stock actual: ${currentStock}. Nuevo stock:`);
    if (input === null) return;
    const newStock = parseInt(input);
    if (isNaN(newStock) || newStock < 0) {
      alert("El stock debe ser un número mayor o igual a 0");
      return;
    }
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error del servidor: " + res.status);
        return res.json();
      })
      .then(() => loadProducts())
      .catch((error) => console.error("Error:", error));
  };

  const handleDelete = (id: number): void => {
    if (!window.confirm("¿Seguro que quieres borrar este producto?")) return;
    
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

    fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE", credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Error del servidor: " + res.status);
        return res.json();
      })
      .catch((error) => console.error("Error:", error));
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
    </>
  );
}

export default App
