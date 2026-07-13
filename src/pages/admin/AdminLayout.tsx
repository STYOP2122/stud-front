import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { adminApi } from '../../api/client';
import type { AdminStats } from '../../types';

export default function AdminLayout() {
  const location = useLocation();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.stats().then(setStats);
  }, [location.pathname]);

  const nav = [
    { to: '/admin', label: 'Обзор', exact: true },
    { to: '/admin/users', label: 'Пользователи' },
    { to: '/admin/orders', label: 'Заказы' },
  ];

  return (
    <div className="container page admin-page">
      <div className="page__header">
        <h1>Админ-панель</h1>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav__link ${
                  (item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to))
                    ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {stats && (
            <div className="admin-sidebar__stats">
              <div>👥 {stats.totalUsers}</div>
              <div>📋 {stats.totalOrders}</div>
              <div>⭐ PRO: {stats.proUsers}</div>
            </div>
          )}
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
