import { useEffect, useState, type FormEvent } from 'react'
import type { Product, CartItem } from '../types'
import { ProductCard } from './productCard'
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { productosAPI, authAPI } from '../services/apiService';


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

  const loadProducts = async () => {
    try {
      const data = await productosAPI.getAll();
      const mappedProducts: Product[] = data.map((p: any) => ({
        id: p.id,
        name: p.nombre,
        description: p.descripcion || "",
        price: Number(p.precio_base),
        category: p.nombre_coleccion || "General",
        stock: 10, // Default stock as it moved to variante table
        imageUrl: p.image_url || p.imagen_url || `https://placehold.co/200x200?text=${encodeURIComponent(p.nombre)}`,
        active: p.active !== false,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };



  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
    const input = window.prompt(`Stock actual: ${currentStock}. Nuevo stock:`);
    if (input === null) return;
    const newStock = parseInt(input);
    if (isNaN(newStock) || newStock < 0) {
      alert("El stock debe ser un número mayor o igual a 0");
      return;
    }
    try {
      await productosAPI.update(id, { stock: newStock });
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el stock");
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("¿Seguro que quieres borrar este producto?")) return;
    
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

    try {
      await productosAPI.delete(id);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al borrar el producto");
      loadProducts();
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
