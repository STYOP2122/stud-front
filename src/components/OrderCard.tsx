import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { ORDER_STATUS_LABELS, WORK_TYPE_LABELS } from '../types';
import { bidsLabel } from '../utils/format';

interface Props {
  order: Order;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function OrderCard({ order }: Props) {
  return (
    <Link to={`/orders/${order.id}`} className="order-card">
      <div className="order-card__header">
        <span className="order-card__type">{WORK_TYPE_LABELS[order.workType]}</span>
        <div className="order-card__badges">
          {order.isPrivate && <span className="private-badge">🔒 Приватный</span>}
          <span className={`status status--${order.status}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>
      <h3 className="order-card__title">{order.title}</h3>
      <p className="order-card__desc">{order.description}</p>
      <div className="order-card__meta">
        <span className="order-card__subject">{order.subject}</span>
        <span className="order-card__budget">{formatPrice(order.budget)}</span>
      </div>
      <div className="order-card__footer">
        <span>До {formatDate(order.deadline)}</span>
        <span>{bidsLabel(order.bidsCount)}</span>
      </div>
    </Link>
  );
}
