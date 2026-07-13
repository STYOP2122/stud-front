import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { bidsApi, conversationsApi, filesApi, messagesApi, ordersApi, reviewsApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import { AttachmentList, FileUpload } from '../components/Attachments';
import ProBadge from '../components/ProBadge';
import UserAvatar from '../components/UserAvatar';
import { useAppSelector } from '../store/hooks';
import type { Message, OrderDetail } from '../types';
import { ORDER_STATUS_LABELS, UserRole, WORK_TYPE_LABELS } from '../types';

function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chatFiles, setChatFiles] = useState<File[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const orderId = Number(id);

  const loadOrder = async () => {
    try {
      setOrder(await ordersApi.get(orderId));
    } catch {
      setError('Заказ не найден или нет доступа');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      setMessages(await messagesApi.list(orderId));
    } catch { /* no access */ }
  };

  useEffect(() => { loadOrder(); }, [orderId]);

  useEffect(() => {
    if (order && user && (order.customer.id === user.id || order.executor?.id === user.id)) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [order, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBid = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await bidsApi.create(orderId, {
        price: Number(bidPrice),
        daysToComplete: Number(bidDays),
        message: bidMessage,
      });
      setBidPrice(''); setBidDays(''); setBidMessage('');
      await loadOrder();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка');
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    if (!confirm('Принять этот отклик?')) return;
    setOrder(await ordersApi.acceptBid(orderId, bidId));
  };

  const handleComplete = async () => {
    if (!confirm('Отметить заказ как выполненный?')) return;
    setOrder(await ordersApi.complete(orderId));
  };

  const handleCancel = async () => {
    if (!confirm('Отменить заказ?')) return;
    setOrder(await ordersApi.cancel(orderId));
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !chatFiles.length) return;
    const msg = await messagesApi.send(orderId, newMessage, chatFiles);
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    setChatFiles([]);
  };

  const handleReview = async (e: FormEvent) => {
    e.preventDefault();
    await reviewsApi.create(orderId, { rating: reviewRating, comment: reviewComment });
    await loadOrder();
  };

  const handleUploadFile = async (files: File[]) => {
    for (const f of files) await filesApi.uploadOrder(orderId, f);
    await loadOrder();
  };

  const handleMessageUser = async (userId: number) => {
    const conv = await conversationsApi.getOrCreate(userId);
    navigate(`/messages/${conv.id}`);
  };

  if (loading) return <div className="page page--studwork loading">Загрузка...</div>;
  if (error || !order) return <div className="page page--studwork empty">{error || 'Не найдено'}</div>;

  const isCustomer = user?.id === order.customer.id;
  const isExecutor = user?.id === order.executor?.id;
  const isInvited = user?.id === order.invitedExecutor?.id;
  const canBid =
    user?.role === UserRole.Executor &&
    order.status === 0 &&
    !order.bids.some((b) => b.executor.id === user.id) &&
    (!order.isPrivate || isInvited);
  const canChat = user && (isCustomer || isExecutor) && order.status !== 3;
  const hasMyBid = user && order.bids.some((b) => b.executor.id === user.id);

  return (
    <div className="page page--studwork">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Заказы', to: '/orders' }, { label: order.title }]} />
      <Link to="/orders" className="back-link">← Все заказы</Link>

      <div className="order-detail">
        <div className="order-detail__main">
          <div className="order-detail__badges">
            <span className="order-card__type">{WORK_TYPE_LABELS[order.workType]}</span>
            {order.isPrivate && <span className="private-badge">🔒 Приватный</span>}
            <span className={`status status--${order.status}`}>{ORDER_STATUS_LABELS[order.status]}</span>
          </div>

          <h1>{order.title}</h1>
          <p className="order-detail__desc">{order.description}</p>

          <div className="order-detail__info">
            <div><strong>Предмет:</strong> {order.subject}</div>
            <div><strong>Бюджет:</strong> {formatPrice(order.budget)}</div>
            <div><strong>Дедлайн:</strong> {formatDate(order.deadline)}</div>
            <div className="order-detail__user-row">
              <strong>Заказчик:</strong>
              <Link to={`/users/${order.customer.id}`} className="inline-user">
                <UserAvatar user={order.customer} size="sm" />
                {order.customer.name}
              </Link>
              {user && user.id !== order.customer.id && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => handleMessageUser(order.customer.id)}>
                  Написать
                </button>
              )}
            </div>
            {order.invitedExecutor && (
              <div className="order-detail__user-row">
                <strong>Приглашён:</strong>
                <Link to={`/users/${order.invitedExecutor.id}`} className="inline-user">
                  <UserAvatar user={order.invitedExecutor} size="sm" />
                  {order.invitedExecutor.name}
                  {order.invitedExecutor.isPro && <ProBadge />}
                </Link>
              </div>
            )}
            {order.executor && (
              <div className="order-detail__user-row">
                <strong>Исполнитель:</strong>
                <Link to={`/users/${order.executor.id}`} className="inline-user">
                  <UserAvatar user={order.executor} size="sm" />
                  {order.executor.name}
                  {order.executor.isPro && <ProBadge />}
                </Link>
                <span>★ {order.executor.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {order.attachments.length > 0 && (
            <section className="panel">
              <h2>Файлы заказа</h2>
              <AttachmentList attachments={order.attachments} />
            </section>
          )}

          {(isCustomer || isExecutor || isInvited) && order.status !== 3 && (
            <section className="panel">
              <h2>Добавить файл</h2>
              <FileUpload onUpload={handleUploadFile} label="Загрузить файл" />
            </section>
          )}

          {isCustomer && order.status === 0 && (
            <button type="button" className="btn btn--danger" onClick={handleCancel}>Отменить заказ</button>
          )}
          {isExecutor && order.status === 1 && (
            <button type="button" className="btn btn--primary" onClick={handleComplete}>Завершить работу</button>
          )}
        </div>

        <div className="order-detail__sidebar">
          <section className="panel">
            <h2>Отклики ({order.bids.length})</h2>
            {order.bids.length === 0 ? (
              <p className="muted">Пока нет откликов</p>
            ) : (
              <div className="bids-list">
                {order.bids.map((bid) => (
                  <div key={bid.id} className={`bid-card ${bid.isAccepted ? 'bid-card--accepted' : ''}`}>
                    <div className="bid-card__header">
                      <Link to={`/users/${bid.executor.id}`} className="inline-user">
                        <UserAvatar user={bid.executor} size="sm" />
                        <strong>{bid.executor.name}</strong>
                        {bid.executor.isPro && <ProBadge />}
                      </Link>
                      <span>★ {bid.executor.rating.toFixed(1)}</span>
                    </div>
                    <p>{bid.message}</p>
                    <div className="bid-card__meta">
                      <span>{formatPrice(bid.price)}</span>
                      <span>{bid.daysToComplete} дн.</span>
                    </div>
                    {isCustomer && order.status === 0 && (
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => handleAcceptBid(bid.id)}>
                        Принять
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {canBid && (
            <section className="panel">
              <h2>Откликнуться</h2>
              <form onSubmit={handleBid} className="form">
                <label className="form__field">Ваша цена (₽)
                  <input type="number" value={bidPrice} onChange={(e) => setBidPrice(e.target.value)} required min={100} />
                </label>
                <label className="form__field">Срок (дней)
                  <input type="number" value={bidDays} onChange={(e) => setBidDays(e.target.value)} required min={1} />
                </label>
                <label className="form__field">Сообщение
                  <textarea value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} required rows={3} />
                </label>
                <button type="submit" className="btn btn--primary btn--full">Отправить отклик</button>
              </form>
            </section>
          )}

          {order.isPrivate && user?.role === UserRole.Executor && !isInvited && !isExecutor && !hasMyBid && (
            <div className="alert alert--error">Это приватный заказ — откликаться может только приглашённый исполнитель</div>
          )}

          {hasMyBid && order.status === 0 && (
            <div className="alert alert--success">Вы уже откликнулись на этот заказ</div>
          )}
        </div>
      </div>

      {canChat && (
        <section className="panel chat-panel">
          <h2>Переписка по заказу</h2>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender.id === user?.id ? 'chat-message--own' : ''}`}>
                <div className="chat-message__author">{msg.sender.name}</div>
                {msg.text && <div className="chat-message__text">{msg.text}</div>}
                <AttachmentList attachments={msg.attachments} />
                <div className="chat-message__time">{formatDate(msg.createdAt)}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chat-compose">
            <FileUpload onUpload={(f) => setChatFiles((prev) => [...prev, ...f])} label="Фото / файл" />
            {chatFiles.length > 0 && (
              <div className="file-upload__previews">
                {chatFiles.map((f, i) => <span key={i} className="file-upload__preview">{f.name}</span>)}
              </div>
            )}
            <div className="chat-input">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Написать сообщение..." />
              <button type="submit" className="btn btn--primary">Отправить</button>
            </div>
          </form>
        </section>
      )}

      {isCustomer && order.status === 2 && !order.review && (
        <section className="panel">
          <h2>Оставить отзыв</h2>
          <form onSubmit={handleReview} className="form form--wide">
            <label className="form__field">Оценка
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </label>
            <label className="form__field">Комментарий
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} />
            </label>
            <button type="submit" className="btn btn--primary">Отправить отзыв</button>
          </form>
        </section>
      )}

      {order.review && (
        <section className="panel">
          <h2>Отзыв</h2>
          <div className="review">
            <div className="review__rating">{'★'.repeat(order.review.rating)}</div>
            {order.review.comment && <p>{order.review.comment}</p>}
            <span className="muted">— {order.review.fromUser.name}</span>
          </div>
        </section>
      )}
    </div>
  );
}
