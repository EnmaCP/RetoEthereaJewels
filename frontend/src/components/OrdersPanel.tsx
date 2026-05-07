import { useEffect, useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "#ffb641ff",    
  processing: "#58bcffff", 
  shipped: "#d670ffff",    
  delivered: "#2ecc9fff",  
  cancelled: "#e74c3c"   
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = () => {
    fetch("http://localhost:3000/api/orders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar pedidos");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchOrders();
      } else {
        alert("Error al actualizar el estado");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="orders-panel">
      <h2>Panel de Gestión de Pedidos</h2>
      <table className="orders-table">
        <thead>
          <tr className="orders-table-header">
            <th>#</th>
            <th>Cliente (ID)</th> 
            <th>Estado</th>
            <th>Total</th>
            <th>Dirección</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{order.id}</td>
              <td>{order.customer_id || "N/A"}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">En proceso</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
              <td>${order.total ? Number(order.total).toFixed(2) : "0.00"}</td>
              <td>{order.address}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}