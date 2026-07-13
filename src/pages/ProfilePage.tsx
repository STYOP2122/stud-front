import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usersApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import ProBadge from '../components/ProBadge';
import UserAvatar from '../components/UserAvatar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMe } from '../store/authSlice';
import { UserRole } from '../types';
import {
  getProfileSection,
  PROFILE_SECTION_LABELS,
  SECTION_IDS,
  type ProfileSection,
} from '../utils/profileSections';

export default function ProfilePage() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const section = getProfileSection(pathname);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio ?? '');
      setPhone(user.phone ?? '');
      setSkills(user.skills ?? '');
      setPortfolioUrl(user.portfolioUrl ?? '');
      setCity(user.city ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (section === null) {
      if (pathname !== '/profile' && pathname.startsWith('/profile')) {
        navigate('/profile', { replace: true });
      }
      return;
    }

    if (section === 'settings' || section === 'specializations') {
      setEditing(true);
    } else {
      setEditing(false);
    }

    const id = SECTION_IDS[section];
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(timer);
  }, [section, pathname, navigate]);

  if (!user) return null;
  if (section === null && pathname !== '/profile') return null;

  const activeSection: ProfileSection = section ?? 'main';

  const registered = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });

  const skillList = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersApi.updateProfile({ name, bio, phone, skills, portfolioUrl, city });
      await dispatch(fetchMe());
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await usersApi.uploadAvatar(file);
    await dispatch(fetchMe());
  };

  return (
    <div className="page page--studwork">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Профиль', to: '/profile' },
          ...(activeSection !== 'main' ? [{ label: PROFILE_SECTION_LABELS[activeSection] }] : []),
        ]}
      />

      {/* Шапка профиля */}
      <div id={SECTION_IDS.main} className="profile-header">
        <div className="profile-header__left">
          <div className="profile-header__avatar-wrap">
            <UserAvatar user={user} size="lg" />
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
            <button type="button" className="profile-header__avatar-edit" onClick={() => fileRef.current?.click()}>
              ✎
            </button>
          </div>
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

      {/* Инфо-сетка */}
      <div className="profile-info-grid">
        <div className="profile-info-item">
          <span className="profile-info-item__label">Имя пользователя</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-item__label">Рабочий статус</span>
          <span>Нет статуса <button type="button" className="icon-btn">✎</button></span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-item__label">Зарегистрирован</span>
          <span>{registered}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-item__label">Отзывы о работе</span>
          <span>👍 0 &nbsp; 👎 0</span>
        </div>
      </div>

      {/* О себе / настройки */}
      <section id={SECTION_IDS.settings} className="sw-section">
        <h2 className="sw-section__title">{activeSection === 'settings' ? 'Настройки профиля' : 'О себе'}</h2>
        {editing ? (
          <form onSubmit={handleSubmit} className="form">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={8} className="sw-textarea" />
            <div className="form__row">
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Город" />
            </div>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Навыки через запятую" />
            <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="Портфолио URL" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" required />
            <div className="form__actions">
              <button type="submit" className="btn btn--primary" disabled={loading}>Сохранить</button>
              <button type="button" className="btn btn--secondary" onClick={() => setEditing(false)}>Отмена</button>
            </div>
          </form>
        ) : (
          <>
            <div className="sw-section__body">
              {bio ? (
                <p className="profile-bio">{bio}</p>
              ) : (
                <p className="muted">Расскажите о себе — нажмите «Редактировать»</p>
              )}
            </div>
            <button type="button" className="btn btn--primary sw-section__edit" onClick={() => setEditing(true)}>
              ✎ Редактировать
            </button>
          </>
        )}
      </section>

      {/* Специализации */}
      {user.role === UserRole.Executor && (
        <section id={SECTION_IDS.specializations} className="sw-section">
          <h2 className="sw-section__title">
            Специализация
            {skillList.length > 0 && <span className="sw-section__badge">{skillList.length}</span>}
          </h2>
          <div className="skills-tags">
            {skillList.length > 0 ? skillList.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            )) : (
              <p className="muted">Добавьте навыки в профиле</p>
            )}
          </div>
        </section>
      )}

      {/* Платные услуги */}
      {user.role === UserRole.Executor && (
        <section id={SECTION_IDS.services} className="sw-section">
          <h2 className="sw-section__title">Платные услуги</h2>
          <div className="paid-services">
            <div className="paid-card">
              <div className="paid-card__icon paid-card__icon--pro">PRO</div>
              <div className="paid-card__title">PRO-аккаунт на 2 дня</div>
              <button type="button" className="btn btn--primary btn--sm">Выбрать</button>
            </div>
            <div className="paid-card paid-card--selected">
              <div className="paid-card__icon">✓</div>
              <div className="paid-card__title">Рекомендуемая ставка</div>
              <button type="button" className="btn btn--secondary btn--sm" disabled>Выбран</button>
            </div>
            <div className="paid-card paid-card--selected">
              <div className="paid-card__icon">👁</div>
              <div className="paid-card__title">Скрытая ставка</div>
              <button type="button" className="btn btn--secondary btn--sm" disabled>Выбран</button>
            </div>
          </div>
          <button type="button" className="btn btn--primary" style={{ marginTop: 12 }}>Мои бонусы</button>
        </section>
      )}

      {/* Заказы и работы */}
      <section className="sw-section">
        <h2 className="sw-section__title">Заказы и работы</h2>
        <div className="mini-cards">
          <Link to="/my-orders" className="mini-card">
            <span className="mini-card__label">Заказы</span>
            <span className="mini-card__value muted">Перейти →</span>
          </Link>
          <Link to="/my-orders" className="mini-card">
            <span className="mini-card__label">Работы</span>
            <span className="mini-card__value">{user.completedOrders} выполнено</span>
          </Link>
          <Link to="/my-orders" className="mini-card">
            <span className="mini-card__label">Отклики</span>
            <span className="mini-card__value muted">Не выбран</span>
          </Link>
        </div>
      </section>

      {/* Портфолио */}
      <section id={SECTION_IDS.portfolio} className="sw-section">
        <h2 className="sw-section__title">Портфолио</h2>
        <p className="muted">
          {portfolioUrl
            ? <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">{portfolioUrl}</a>
            : 'Вы не добавили работы в портфолио. Для размещения работы нажмите на кнопку'}
        </p>
        <button type="button" className="btn btn--success">+ Добавить работу</button>
      </section>

      {/* Финансы */}
      <section id={SECTION_IDS.finance} className="sw-section">
        <h2 className="sw-section__title">Финансы</h2>
        <p className="muted">Баланс: 0 ₽ · Доступно к выводу: 0 ₽</p>
        <p className="muted">Раздел в разработке — скоро появится пополнение и вывод средств.</p>
      </section>

      {/* Бонусы */}
      <section id={SECTION_IDS.bonuses} className="sw-section">
        <h2 className="sw-section__title">Бонусы</h2>
        <p className="muted">У вас 1 доступный бонус. Раздел в разработке.</p>
      </section>

      {/* Активность */}
      <section className="sw-section">
        <h2 className="sw-section__title">Активность</h2>
        <div className="activity-tabs">
          {['ЖУРНАЛ', 'КОММЕНТАРИИ', 'СТАТЬИ', 'ВОПРОСЫ', 'ОТВЕТЫ', 'ТЕСТЫ'].map((t, i) => (
            <button key={t} type="button" className={`activity-tabs__item ${i === 0 ? 'active' : ''}`}>{t}</button>
          ))}
        </div>
        <button type="button" className="btn btn--success" style={{ marginBottom: 12 }}>+ Добавить новую тему</button>
        <p className="muted">Активность данного типа отсутствует</p>
      </section>

      <Link to={`/users/${user.id}`} className="btn btn--outline" style={{ marginTop: 16 }}>
        Публичный профиль
      </Link>
    </div>
  );
}
