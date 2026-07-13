import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { ORDER_STATUS_LABELS, WORK_TYPE_LABELS } from '../types';
import { bidsLabel } from '../utils/format';
import UserAvatar from './UserAvatar';

interface Props {
  order: Order;
  variant?: 'browse' | 'my';
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number) {
  if (price <= 0) return 'Договорная цена';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function OrderListItem({ order, variant = 'browse' }: Props) {
  return (
    <article className="order-item">
      <div className="order-item__main">
        <div className="order-item__top">
          <Link to={`/orders/${order.id}`} className="order-item__title">
            {order.title}
          </Link>
          <div className="order-item__actions-top">
            {order.isPrivate && <span className="order-item__tag order-item__tag--private">🔒</span>}
            <button type="button" className="order-item__icon-btn" title="Скрыть">👁</button>
            <button type="button" className="order-item__icon-btn" title="В избранное">☆</button>
          </div>
        </div>

        <div className="order-item__meta">
          <span>{formatDate(order.createdAt)}</span>
          <span className="order-item__dot">·</span>
          <span>{WORK_TYPE_LABELS[order.workType]} / {order.subject}</span>
          <span className="order-item__dot">·</span>
          <span>до {formatDate(order.deadline)}</span>
        </div>

        <div className="order-item__footer">
          <div className="order-item__customer">
            <UserAvatar user={order.customer} size="sm" />
            <span>{order.customer.name}</span>
          </div>
          <div className="order-item__stats">
            <span>👁 {(order.id * 17) % 90 + 10}</span>
            <span>💬 {bidsLabel(order.bidsCount)}</span>
          </div>
        </div>
      </div>

      <div className="order-item__side">
        <div className="order-item__price">{formatPrice(order.budget)}</div>
        <span className={`order-item__status status status--${order.status}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
        <Link to={`/orders/${order.id}`} className="btn btn--primary btn--sm order-item__bid">
          {variant === 'my' ? 'Открыть' : 'Сделать ставку'}
        </Link>
      </div>
    </article>
  );
}
