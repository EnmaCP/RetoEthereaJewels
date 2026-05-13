import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProductPage.css';

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        name: "", description: "", price: 0,
        stock: 0, image_url: "", active: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(r => r.json())
            .then(data => {
                setForm(data);
                setLoading(false);
            })
            .catch(err => console.error("Error cargando producto:", err));
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        const newValue = 
            type === "checkbox" ? checked : 
            type === "number" ? Number(value) : 
            value;

        setForm({ ...form, [name]: newValue as any });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form)
            });
            
            if (res.ok) {
                navigate(-1); // Vuelve a la página anterior
            } else {
                alert("Error al guardar");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="edit-product-container">
            <div className="edit-product-card">
                <h2>Editing Product</h2>
                <form className="edit-product-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Price:</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Stock:</label>
                        <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Imagen URL:</label>
                        <input name="image_url" value={form.image_url} onChange={handleChange} />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>Active:</label>
                        <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                    </div>

                    <button type="submit" className="submit-button">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
}