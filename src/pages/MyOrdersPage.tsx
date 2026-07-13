import { useEffect, useState } from 'react';
import { ordersApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import OrderListItem from '../components/OrderListItem';
import type { Order } from '../types';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.my()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page page--studwork">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Мои заказы' }]} />
      <h1 className="page__title">Мои заказы</h1>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : orders.length === 0 ? (
        <div className="empty">У вас пока нет заказов</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} variant="my" />
          ))}
        </div>
      )}
    </div>
  );
}
