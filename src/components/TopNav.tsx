import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { useMobileNav } from '../context/MobileNavContext';
import { UserRole, USER_ROLE_LABELS } from '../types';
import ProBadge from './ProBadge';
import UserAvatar from './UserAvatar';

interface TopLink {
  to: string;
  label: string;
  highlight?: boolean;
  matchPaths?: string[];
}

const TOP_LINKS: TopLink[] = [
  { to: '/orders', label: 'Заказы', highlight: true },
  { to: '/orders', label: 'Эксперты' },
  { to: '/orders', label: 'Магазин' },
  { to: '/profile/portfolio', label: 'Портфолио', highlight: true, matchPaths: ['/profile/portfolio'] },
  { to: '/orders', label: 'Журнал' },
  { to: '/orders', label: 'Справочник' },
  { to: '/orders', label: 'Вопросы' },
  { to: '/orders', label: 'FAQ' },
  { to: '/orders', label: 'Контакты' },
];

function isTopLinkActive(link: TopLink, pathname: string): boolean {
  if (!link.highlight) return false;
  if (link.matchPaths) return link.matchPaths.includes(pathname);
  if (link.label === 'Заказы') {
    return pathname === '/orders' || /^\/orders\/\d+$/.test(pathname);
  }
  return pathname === link.to;
}

export default function TopNav({ showSidebarToggle = false }: { showSidebarToggle?: boolean }) {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { toggleSidebar } = useMobileNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [menuMobile, setMenuMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const openMenu = () => {
    const isMobile = window.innerWidth < 640;
    setMenuMobile(isMobile);

    if (!isMobile) {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPos({
          top: rect.bottom + 8,
          right: Math.max(8, window.innerWidth - rect.right),
        });
      }
    }
    setMenuOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    dispatch(logout());
    navigate('/');
  };

  const handleMenuNav = () => closeMenu();

  return (
    <header className="topnav">
      <div className="topnav__inner">
        <div className="topnav__start">
          {showSidebarToggle && (
            <button
              type="button"
              className="topnav__burger"
              onClick={toggleSidebar}
              aria-label="Открыть меню"
            >
              ☰
            </button>
          )}
          <Link to="/orders" className="topnav__logo">
            <span className="topnav__logo-icon">📚</span>
            <span className="topnav__logo-text">StudWork</span>
          </Link>
        </div>

        <nav className="topnav__links" aria-label="Основная навигация">
          {TOP_LINKS.map((link) => {
            const active = isTopLinkActive(link, pathname);
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`topnav__link ${active ? 'topnav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="topnav__actions">
          <button type="button" className="topnav__icon-btn" title="Поиск">🔍</button>

          {user ? (
            <>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `topnav__icon-btn ${isActive || pathname.startsWith('/messages/') ? 'topnav__icon-btn--active' : ''}`
                }
                title="Сообщения"
              >
                💬
              </NavLink>
              <button type="button" className="topnav__icon-btn" title="Уведомления">🔔</button>

              {user.isPro ? (
                <span className="topnav__pro-outline"><ProBadge /></span>
              ) : user.role === UserRole.Executor && (
                <span className="topnav__pro-outline topnav__pro-outline--inactive">PRO</span>
              )}

              <div className="topnav__balance-wrap">
                <button
                  ref={triggerRef}
                  type="button"
                  className="topnav__balance"
                  onClick={() => (menuOpen ? closeMenu() : openMenu())}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <span>0 ₽</span>
                  <UserAvatar user={user} size="sm" />
                </button>

                {menuOpen &&
                  createPortal(
                    <>
                      <div className="user-menu-backdrop" onClick={closeMenu} aria-hidden />
                      <div
                        ref={menuRef}
                        className={`user-menu ${menuMobile ? 'user-menu--sheet' : ''}`}
                        style={menuMobile ? undefined : { top: menuPos.top, right: menuPos.right }}
                        role="menu"
                      >
                        <div className="user-menu__header">
                          <UserAvatar user={user} size="md" />
                          <div>
                            <div className="user-menu__name">
                              {user.name}
                              {user.isPro && <ProBadge variant="outline" />}
                            </div>
                            <div className="user-menu__role">{USER_ROLE_LABELS[user.role]}</div>
                          </div>
                        </div>

                        <div className="user-menu__balance">
                          <div className="user-menu__balance-row user-menu__balance-row--green">
                            <span>💵 Доступно к выводу</span>
                            <strong>0 ₽</strong>
                          </div>
                          <div className="user-menu__balance-row user-menu__balance-row--red">
                            <span>🔒 Заблокировано</span>
                            <strong>0 ₽</strong>
                          </div>
                        </div>

                        <nav className="user-menu__links">
                          <Link to="/profile" className="user-menu__link" role="menuitem" onClick={handleMenuNav}>
                            👤 Мой профиль
                          </Link>
                          <Link to="/profile/settings" className="user-menu__link" role="menuitem" onClick={handleMenuNav}>
                            ⚙️ Настройки
                          </Link>
                          <Link to="/profile/finance" className="user-menu__link" role="menuitem" onClick={handleMenuNav}>
                            💰 Финансы
                          </Link>
                          <Link to="/my-orders" className="user-menu__link" role="menuitem" onClick={handleMenuNav}>
                            📋 Мои заказы
                          </Link>
                        </nav>

                        <button type="button" className="user-menu__logout" onClick={handleLogout}>
                          Выйти
                        </button>
                      </div>
                    </>,
                    document.body
                  )}
              </div>

              <button
                type="button"
                className="topnav__icon-btn topnav__icon-btn--hide-mobile"
                onClick={handleLogout}
                title="Выйти"
              >
                ⎋
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn--ghost btn--sm">Войти</NavLink>
              <NavLink to="/register" className="btn btn--primary btn--sm">Регистрация</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
