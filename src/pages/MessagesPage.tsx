import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { conversationsApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import type { Conversation } from '../types';
import ProBadge from '../components/ProBadge';
import UserAvatar from '../components/UserAvatar';

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conversationsApi.list()
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page page--studwork">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Сообщения' }]} />
      <h1 className="page__title">Сообщения</h1>
      <p className="page__subtitle muted">Личная переписка с пользователями</p>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : conversations.length === 0 ? (
        <div className="empty">
          <p>Нет диалогов</p>
          <p className="muted">Напишите пользователю из его профиля или со страницы заказа</p>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map((conv) => (
            <Link key={conv.id} to={`/messages/${conv.id}`} className="conversation-item">
              <UserAvatar user={conv.otherUser} size="md" />
              <div className="conversation-item__content">
                <div className="conversation-item__header">
                  <span className="conversation-item__name">
                    {conv.otherUser.name}
                    {conv.otherUser.isPro && <ProBadge />}
                  </span>
                  <span className="conversation-item__time">{formatDate(conv.lastMessageAt)}</span>
                </div>
                <p className="conversation-item__preview">
                  {conv.lastMessageText || 'Нет сообщений'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
