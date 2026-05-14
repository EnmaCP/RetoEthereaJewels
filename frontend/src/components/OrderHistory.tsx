import { useState, useEffect } from "react";
import { useUser } from "./UserContext"; 
import "./OrderHistory.css";



interface Order {
  id: number;
  estado: string; 
  total: number;
  direccion: string; 
  created_at: string;
}

interface OrderItem {
  nombre: string; 
  image_url: string;
  cantidad: number; 
  precio_unitario: number; 
  subtotal: number;
}

interface OrderDetail extends Order {
  items: OrderItem[];
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { customer } = useUser(); 

  useEffect(() => {
    if (!customer) {
      setLoading(false);
      return; 
    }

    fetch("http://localhost:3000/api/orders/my", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
  const mappedOrders = data.map((o: any) => ({
    id: o.id,
    estado: o.estado,
    total: Number(o.total_calculado || o.total || 0),
    direccion: o.direccion,
    created_at: o.created_at
  }));
  setOrders(mappedOrders);
  setLoading(false);
})
      .catch(() => setLoading(false));
  }, [customer]);

  const fetchOrderDetail = (orderId: number) => {
    fetch(`http://localhost:3000/api/orders/${orderId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSelectedOrder(data);
      });
  };

  if (loading) return <div className="loading-etherea">Loading your history...</div>;

  return (
    <div className="order-history-wrapper">
      <div className="history-header">
        <h2 className="history-title">My Orders</h2>
        <p className="history-subtitle">Manage and review your Etherea purchases</p>
      </div>
      
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">✧</div>
            <p>You haven't placed any orders yet.</p>
            <button className="btn-shop-now" onClick={() => window.location.href = '/'}>Explore Collection</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-main">
                  <div className="order-id">
                    <span className="label">Order</span>
                    <span className="value">#{order.id}</span>
                  </div>
                  <div className="order-date">
                    <span className="label">Date</span>
                    <span className="value">{new Date(order.created_at).toLocaleDateString('en-IE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="order-status-box">
                    <span className="label">Status</span>
                    <span className={`status-badge ${order.estado.toLowerCase()}`}>
                      {order.estado}
                    </span>
                  </div>
                  <div className="order-total">
                    <span className="label">Total</span>
                    <span className="value">{Number(order.total).toFixed(2)}€</span>
                  </div>
                  <div className="order-actions">
                    <button className="btn-details" onClick={() => fetchOrderDetail(order.id)}>
                      Details
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="shipping-info">
                <h4>Shipping address</h4>
                <p>{selectedOrder.direccion}</p>
              </div>

              <div className="items-section">
                <h4>Items</h4>
                <div className="items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <div className="item-image">
                        <img src={item.image_url} alt={item.nombre} />
                      </div>
                      <div className="item-info">
                        <p className="item-name">{item.nombre}</p>
                        <p className="item-qty">{item.cantidad} x {Number(item.precio_unitario).toFixed(2)}€</p>
                      </div>
                      <div className="item-subtotal">
                        {Number(item.subtotal).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <div className="total-row">
                  <span>Total Paid</span>
                  <span className="total-amount">{Number(selectedOrder.total).toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}