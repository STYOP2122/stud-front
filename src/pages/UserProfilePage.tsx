import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationsApi, usersApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import ProBadge from '../components/ProBadge';
import UserAvatar from '../components/UserAvatar';
import { useAppSelector } from '../store/hooks';
import type { User } from '../types';
import { USER_ROLE_LABELS } from '../types';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.get(Number(id))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMessage = async () => {
    if (!user) return;
    const conv = await conversationsApi.getOrCreate(user.id);
    navigate(`/messages/${conv.id}`);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!user) return <div className="empty">Пользователь не найден</div>;

  const registered = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
  const skillList = user.skills ? user.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="page page--studwork">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: user.name }]} />

      <div className="profile-header">
        <div className="profile-header__left">
          <UserAvatar user={user} size="lg" />
          <div>
            <h1 className="profile-header__name">
              {user.name}
              {user.isPro && <ProBadge variant="outline" />}
            </h1>
            <div className="profile-header__online">
              <span className="online-dot" /> сейчас онлайн
            </div>
          </div>
        </div>
        <div className="profile-header__ratings">
          <div className="rating-card">
            <div className="rating-card__icon">🏆</div>
            <div className="rating-card__value">{user.rating.toFixed(0)}</div>
            <div className="rating-card__label">Рейтинг автора</div>
          </div>
          <div className="rating-card">
            <div className="rating-card__icon">🏆</div>
            <div className="rating-card__value">0</div>
            <div className="rating-card__label">Рейтинг заказчика</div>
          </div>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="profile-info-item">
          <span className="profile-info-item__label">Имя пользователя</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-item__label">Роль</span>
          <span>{USER_ROLE_LABELS[user.role]}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-item__label">Зарегистрирован</span>
          <span>{registered}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-item__label">Выполнено работ</span>
          <span>{user.completedOrders}</span>
        </div>
      </div>

      {user.bio && (
        <section className="sw-section">
          <h2 className="sw-section__title">О себе</h2>
          <p className="profile-bio">{user.bio}</p>
        </section>
      )}

      {skillList.length > 0 && (
        <section className="sw-section">
          <h2 className="sw-section__title">Специализация <span className="sw-section__badge">{skillList.length}</span></h2>
          <div className="skills-tags">
            {skillList.map((s) => <span key={s} className="skill-tag">{s}</span>)}
          </div>
        </section>
      )}

      {user.portfolioUrl && (
        <section className="sw-section">
          <h2 className="sw-section__title">Портфолио</h2>
          <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer">{user.portfolioUrl}</a>
        </section>
      )}

      {currentUser && currentUser.id !== user.id && (
        <button type="button" className="btn btn--primary" onClick={handleMessage}>
          Написать сообщение
        </button>
      )}
    </div>
  );
}
