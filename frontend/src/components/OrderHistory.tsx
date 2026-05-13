import { useState, useEffect } from "react";
import { useUser } from "./UserContext"; // Importamos tu contexto de usuario
import "./OrderHistory.css";

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "orange",
  PAGADO: "blue",
  ENTREGADO: "green",
  CANCELADO: "red",
};

interface Order {
  id: number;
  status: string;
  total: number;
  address: string;
  created_at: string;
}

interface OrderItem {
  name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderDetail extends Order {
  items: OrderItem[];
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { customer } = useUser(); 

  useEffect(() => {
    if (!customer) {
      setLoading(false);
      return; 
    }

    const endpoint = (customer.role === "admin" || customer.role === "employee")
      ? "http://localhost:3000/api/orders"
      : "http://localhost:3000/api/orders/my";

    fetch(endpoint, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Error when loading the orders.");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => {
        console.error(err);
        setError("Error when loading the orders.");
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [customer]); 

  const handleOrderClick = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Error when loading the order detail.");
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error(err);
      alert("Error when loading the order detail.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="order-history">
      <h2>My Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th># (ID)</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                onClick={() => handleOrderClick(order.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{order.id}</td>
                <td className="order-status" style={{ color: STATUS_COLORS[order.status] || "black", fontWeight: "bold" }}>
                  {order.status}
                </td>
                <td>${order.total ? Number(order.total).toFixed(2) : "0.00"}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="order-detail" style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc" }}>
          <h3>Order #{selectedOrder.id} details</h3>
          
          <ul className="order-detail-list" style={{ listStyle: "none", padding: 0 }}>
            {selectedOrder.items.map((item, idx) => (
              <li key={idx} className="order-detail-item" style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} width="50" className="order-detail-img" style={{ borderRadius: "5px" }} />
                ) : (
                  <div className="order-detail-img-placeholder" style={{ width: "50px", height: "50px", backgroundColor: "#eee" }} />
                )}
                <div className="order-detail-info">
                  <strong>{item.name}</strong>
                  <div className="order-detail-meta" style={{ fontSize: "0.9em", color: "#555" }}>
                    Quantity: {item.quantity} | Unit price: ${Number(item.unit_price).toFixed(2)}
                  </div>
                </div>
                <div className="order-detail-price" style={{ marginLeft: "auto", fontWeight: "bold" }}>
                  ${Number(item.subtotal).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}