import { Link, NavLink, useLocation } from 'react-router-dom';
import { useMobileNav } from '../context/MobileNavContext';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: number;
  badgeColor?: 'blue' | 'green';
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/orders/favorites', label: 'Избранное', icon: '⭐' },
  { to: '/profile', label: 'Профиль', icon: '👤' },
  { to: '/profile/settings', label: 'Настройки', icon: '⚙️' },
  { to: '/profile/finance', label: 'Финансы', icon: '💰' },
  { to: '/profile/specializations', label: 'Специализации', icon: '🎓', badge: 20, badgeColor: 'blue', roles: [UserRole.Executor] },
  { to: '/my-orders', label: 'Календарь заказов', icon: '📅' },
  { to: '/my-orders/stats', label: 'Статистика', icon: '📊' },
  { to: '/messages', label: 'Претензии', icon: '💬' },
  { to: '/orders/shop', label: 'Мой магазин', icon: '🛒', roles: [UserRole.Executor] },
  { to: '/profile/portfolio', label: 'Моё портфолио', icon: '💼', roles: [UserRole.Executor] },
  { to: '/profile/services', label: 'Платные услуги', icon: '📋' },
  { to: '/profile/bonuses', label: 'Бонусы', icon: '🎁', badge: 1, badgeColor: 'green' },
  { to: '/orders/partners', label: 'Партнёрам', icon: '🤝' },
  { to: '/orders/promo', label: 'Промокоды', icon: '🏷️' },
];

/** Нормализует путь (без завершающего слэша) */
function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Точное совпадение пути; для /messages — включая вложенные диалоги */
function isItemActive(item: NavItem, pathname: string): boolean {
  const path = normalizePath(pathname);

  if (item.to === '/messages') {
    return path === '/messages' || path.startsWith('/messages/');
  }
  // Профиль — только главная, без вложенных /profile/...
  if (item.to === '/profile') {
    return path === '/profile';
  }
  return path === item.to;
}

export default function Sidebar() {
  const { user } = useAppSelector((s) => s.auth);
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { sidebarOpen, closeSidebar } = useMobileNav();

  const filtered = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__mobile-header">
        <span className="sidebar__mobile-title">Меню</span>
        <button type="button" className="sidebar__close" onClick={closeSidebar} aria-label="Закрыть меню">
          ✕
        </button>
      </div>
      {user?.role === UserRole.Customer && (
        <NavLink
          to="/create-order"
          className={({ isActive }) => `sidebar__cta ${isActive ? 'sidebar__cta--active' : ''}`}
          onClick={closeSidebar}
        >
          Разместить заказ
        </NavLink>
      )}

      {!user && (
        <NavLink to="/register" className="sidebar__cta" onClick={closeSidebar}>
          Разместить заказ
        </NavLink>
      )}

      <nav className="sidebar__nav">
        {filtered.map((item) => {
          const active = isItemActive(item, pathname);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
              onClick={(e) => {
                (e.currentTarget as HTMLAnchorElement).blur();
                closeSidebar();
              }}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
              {item.badge != null && (
                <span className={`sidebar__badge sidebar__badge--${item.badgeColor ?? 'blue'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {user?.role === UserRole.Admin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `sidebar__link sidebar__link--admin ${isActive ? 'sidebar__link--active' : ''}`
          }
          onClick={closeSidebar}
        >
          <span className="sidebar__icon">🛡️</span>
          <span className="sidebar__label">Админ-панель</span>
        </NavLink>
      )}

      <div className="sidebar__footer">
        <label className="sidebar__theme">
          <span>{isDark ? 'Тёмная тема' : 'Светлая тема'}</span>
          <button
            type="button"
            className={`toggle ${isDark ? 'toggle--on' : ''}`}
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label="Переключить тему"
          />
        </label>
        <div className="sidebar__feedback">
          <span>😊</span>
          <span>Что можно улучшить на этой странице?</span>
        </div>
      </div>
    </aside>
  );
}
