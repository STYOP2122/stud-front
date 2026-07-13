import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import type { AdminUser } from '../../types';
import { USER_ROLE_LABELS, UserRole } from '../../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminApi.users().then(setUsers).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const togglePro = async (user: AdminUser) => {
    await adminApi.setPro(user.id, !user.isPro);
    load();
  };

  const toggleBan = async (user: AdminUser) => {
    if (!confirm(user.isBanned ? 'Разблокировать?' : 'Заблокировать пользователя?')) return;
    await adminApi.setBan(user.id, !user.isBanned);
    load();
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <h2>Пользователи</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>PRO</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={u.isBanned ? 'row--banned' : ''}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{USER_ROLE_LABELS[u.role]}</td>
                <td>{u.isPro ? '✅' : '—'}</td>
                <td>{u.isBanned ? '🚫 Заблокирован' : 'Активен'}</td>
                <td className="admin-table__actions">
                  {u.role !== UserRole.Admin && (
                    <>
                      <button type="button" className="btn btn--sm btn--ghost" onClick={() => togglePro(u)}>
                        {u.isPro ? 'Снять PRO' : 'Выдать PRO'}
                      </button>
                      <button type="button" className="btn btn--sm btn--danger" onClick={() => toggleBan(u)}>
                        {u.isBanned ? 'Разблок.' : 'Блок'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
