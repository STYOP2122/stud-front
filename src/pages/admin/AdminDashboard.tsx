import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import type { AdminStats } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.stats().then(setStats);
  }, []);

  if (!stats) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <h2>Обзор</h2>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalUsers}</div>
          <div className="stat-card__label">Пользователей</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalOrders}</div>
          <div className="stat-card__label">Заказов</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.openOrders}</div>
          <div className="stat-card__label">Открытых</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.proUsers}</div>
          <div className="stat-card__label">PRO</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.bannedUsers}</div>
          <div className="stat-card__label">Заблокировано</div>
        </div>
      </div>
    </div>
  );
}
