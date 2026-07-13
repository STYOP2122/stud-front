import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { USER_ROLE_LABELS, UserRole } from '../types';
import ProBadge from './ProBadge';
import UserAvatar from './UserAvatar';

export default function Header() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo">
          <span className="logo__icon">📚</span>
          StudWork
        </Link>

        <nav className="nav">
          <NavLink to="/orders" className="nav__link">Заказы</NavLink>
          {user && (
            <>
              <NavLink to="/messages" className="nav__link">Сообщения</NavLink>
              <NavLink to="/my-orders" className="nav__link">Мои заказы</NavLink>
            </>
          )}
          {user?.role === UserRole.Customer && (
            <NavLink to="/create-order" className="nav__link nav__link--accent">
              + Создать заказ
            </NavLink>
          )}
          {user?.role === UserRole.Admin && (
            <NavLink to="/admin" className="nav__link nav__link--admin">Админ</NavLink>
          )}
        </nav>

        <div className="header__actions">
          {user ? (
            <>
              <Link to="/profile" className="user-badge">
                <UserAvatar user={user} size="sm" />
                <span className="user-badge__meta">
                  <span className="user-badge__name">
                    {user.name}
                    {user.isPro && <ProBadge />}
                  </span>
                  <span className="user-badge__role">{USER_ROLE_LABELS[user.role]}</span>
                </span>
              </Link>
              <button type="button" className="btn btn--ghost" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Войти</Link>
              <Link to="/register" className="btn btn--primary">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
