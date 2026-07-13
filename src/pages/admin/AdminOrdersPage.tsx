import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/client';
import type { Order } from '../../types';
import { ORDER_STATUS_LABELS } from '../../types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminApi.orders().then(setOrders).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить заказ?')) return;
    await adminApi.deleteOrder(id);
    load();
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <h2>Все заказы</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Заказчик</th>
              <th>Статус</th>
              <th>Приватный</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>
                  <Link to={`/orders/${o.id}`}>{o.title}</Link>
                </td>
                <td>{o.customer.name}</td>
                <td>{ORDER_STATUS_LABELS[o.status]}</td>
                <td>{o.isPrivate ? '🔒' : '—'}</td>
                <td>
                  <button type="button" className="btn btn--sm btn--danger" onClick={() => handleDelete(o.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
