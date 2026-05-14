import { useEffect, useState, type FormEvent } from 'react'
import type { Product, CartItem } from '../types'
import { ProductCard } from './productCard'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from './UserContext';
import { productosAPI, authAPI } from '../services/apiService';
import edit from '../components/imagen/edit.png';
import trash from '../components/imagen/delete1.png';
import settings from '../components/imagen/setting2.png';
import cartIcon from '../components/imagen/cart2.png';
export default function Catalogue() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("")

  const [searchParams] = useSearchParams();
  const filterText = searchParams.get('search') || "";
  const [filterCategory, setFilterCategory] = useState("");

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
        active: p.activo !== false,
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
        id_coleccion: newCollection ? parseInt(newCollection) : undefined,
        image_url: newImageUrl || undefined
      });
      setNewName("");
      setNewPrice("");
      setNewCollection("");
      setNewStock("");
      setNewDescription("");
      setNewImageUrl("");
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating product");
    }
  };

  const handleUpdateStock = async (id: number, currentStock: number): Promise<void> => {
    const input = window.prompt(`Stock actual: ${currentStock}. Nuevo stock:`);
    if (input === null) return;
    const newStock = parseInt(input);
    if (isNaN(newStock) || newStock < 0) {
      alert("Stock must be greater than 0");
      return;
    }
    try {
      await productosAPI.update(id, { stock: newStock });
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating stock");
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

    try {
      await productosAPI.delete(id);
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting product");
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

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  if (loading) return <div>Loading...</div>;

  const categories = Array.from(new Set(products.map(p => p.category)));
  const filteredProducts = products.filter(p => {
    const matchesText = p.name.toLowerCase().includes(filterText.toLowerCase()) || p.description.toLowerCase().includes(filterText.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    return matchesText && matchesCategory;
  });

  return (
    <>

      {customer?.role === "admin" && (
        <div className="formulario-producto">
          <h3>Add product</h3>
          <form onSubmit={handleSubmit} className="topbar-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input type="text" id="description" name="description" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input type="text" id="price" name="price" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="collection">Collection name:</label>
              <input type="text" id="collection" name="collection" value={newCollection} onChange={e => setNewCollection(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock:</label>
              <input type="text" id="stock" name="stock" value={newStock} onChange={e => setNewStock(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image:</label>
              <input type="text" id="imageUrl" name="imageUrl" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
            </div>
            <div className="form-group btn-group">
              <button type="submit">Add</button>
            </div>
          </form>
        </div>
      )}

      <div className="modern-catalogue-controls">
        <div className="controls-header">
          {filterText ? (
            <div className="search-info">
              <span>Showing results for <strong>"{filterText}"</strong></span>
              <button className="btn-clear-search" onClick={() => navigate('/catalogue')}>Clear</button>
            </div>
          ) : (
            <h1 className="catalogue-title">Our Collections</h1>
          )}
        </div>

        <div className="filter-bar">
          <div className="category-pills">
            <button 
              className={`pill ${filterCategory === "" ? "active" : ""}`} 
              onClick={() => setFilterCategory("")}
            >
              All Pieces
            </button>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`pill ${filterCategory === cat ? "active" : ""}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-wrapper">
             <span className="sort-label">Sort by:</span>
             <select className="minimal-select">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
             </select>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item-wrapper">
            <ProductCard product={product} onSelect={(id) => navigate(`/product/${id}`)} />

            <button title="Add to cart" className="btn-add-to-cart" disabled={product.stock === 0 || product.active == false}
              onClick={() => addToCart(product)}>
              <img src={cartIcon} style={{ width: '20px', height: '20px' }} alt="cart" />
            </button>

            <div className="product-actions">
              {(customer?.role === "admin" || customer?.role === "employee") && (
                <button className='editarStock' title="Edit stock"
                  onClick={() => handleUpdateStock(product.id, product.stock)}>
                  <img src={edit} />
                </button>
              )}

              {customer?.role === "admin" && (
                <button className='editarStock' title="Edit product"
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                  <img src={settings} />
                </button>
              )}

              {customer?.role === "admin" && (
                <button title="Delete" className="btn-danger"
                  onClick={() => handleDelete(product.id)}>
                  <img src={trash} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

