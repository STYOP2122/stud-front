import { Link, useLocation } from 'react-router-dom';
import { useMobileNav } from '../context/MobileNavContext';
import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { toggleSidebar } = useMobileNav();
  const { user } = useAppSelector((s) => s.auth);
  const path = normalizePath(pathname);

  const isOrders =
    path === '/orders' ||
    path.startsWith('/orders/') ||
    path === '/my-orders' ||
    path.startsWith('/my-orders/');

  const isMessages = path === '/messages' || path.startsWith('/messages/');
  const isProfile = path === '/profile' || path.startsWith('/profile/');

  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      <Link
        to="/orders"
        className={`mobile-bottom-nav__item ${isOrders ? 'mobile-bottom-nav__item--active' : ''}`}
      >
        <span className="mobile-bottom-nav__icon">📋</span>
        <span className="mobile-bottom-nav__label">Заказы</span>
      </Link>

      {user ? (
        <>
          <Link
            to="/messages"
            className={`mobile-bottom-nav__item ${isMessages ? 'mobile-bottom-nav__item--active' : ''}`}
          >
            <span className="mobile-bottom-nav__icon">💬</span>
            <span className="mobile-bottom-nav__label">Чат</span>
          </Link>

          {user.role === UserRole.Customer ? (
            <Link
              to="/create-order"
              className={`mobile-bottom-nav__item mobile-bottom-nav__item--accent ${
                path === '/create-order' ? 'mobile-bottom-nav__item--active' : ''
              }`}
            >
              <span className="mobile-bottom-nav__icon">➕</span>
              <span className="mobile-bottom-nav__label">Заказ</span>
            </Link>
          ) : (
            <Link
              to="/profile"
              className={`mobile-bottom-nav__item ${isProfile ? 'mobile-bottom-nav__item--active' : ''}`}
            >
              <span className="mobile-bottom-nav__icon">👤</span>
              <span className="mobile-bottom-nav__label">Профиль</span>
            </Link>
          )}

          <button
            type="button"
            className="mobile-bottom-nav__item"
            onClick={toggleSidebar}
            aria-label="Открыть меню"
          >
            <span className="mobile-bottom-nav__icon">☰</span>
            <span className="mobile-bottom-nav__label">Меню</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="mobile-bottom-nav__item">
            <span className="mobile-bottom-nav__icon">🔑</span>
            <span className="mobile-bottom-nav__label">Войти</span>
          </Link>
          <Link to="/register" className="mobile-bottom-nav__item mobile-bottom-nav__item--accent">
            <span className="mobile-bottom-nav__icon">✨</span>
            <span className="mobile-bottom-nav__label">Регистрация</span>
          </Link>
        </>
      )}
    </nav>
  );
}
