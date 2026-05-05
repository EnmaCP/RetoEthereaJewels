import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

    if (loading) return <p>Cargando producto...</p>;

    return (
        <div className="admin-container">
            <h2>Editar Producto</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input name="name" value={form.name} onChange={handleChange} required />

                <label>Precio:</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required />

                <label>Stock:</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required />

                <label>URL Imagen:</label>
                <input name="image_url" value={form.image_url} onChange={handleChange} />

                <label>Activo:</label>
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
}