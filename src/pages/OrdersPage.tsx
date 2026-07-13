import { useEffect, useState } from 'react';
import { ordersApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import OrderListItem from '../components/OrderListItem';
import type { Order } from '../types';
import { OrderStatus, WorkType, WORK_TYPE_LABELS } from '../types';

type Tab = 'all' | 'rated' | 'unrated' | 'hidden';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [workType, setWorkType] = useState<WorkType | ''>('');
  const [section, setSection] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const [advanced, setAdvanced] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.list({
        search: search || undefined,
        subject: subject || undefined,
        workType: workType !== '' ? workType : undefined,
        status: OrderStatus.Open,
      });
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [search, subject, workType]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'all', label: 'ВСЕ', count: orders.length },
    { id: 'rated', label: 'ОЦЕНЁННЫЕ' },
    { id: 'unrated', label: 'НЕ ОЦЕНЁННЫЕ', count: orders.length },
    { id: 'hidden', label: 'СКРЫТЫЕ' },
  ];

  return (
    <div className="page page--studwork">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Заказы' }]} />
      <h1 className="page__title">Заказы</h1>

      <div className="search-panel">
        <input
          type="text"
          className="search-panel__input"
          placeholder="Поиск по ключевым словам"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-panel__filters">
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Все разделы</option>
            <option value="human">Гуманитарные</option>
            <option value="tech">Технические</option>
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Все предметы</option>
            <option value="IT">IT</option>
            <option value="Экономика">Экономика</option>
            <option value="История">История</option>
          </select>
          <select value={workType} onChange={(e) => setWorkType(e.target.value === '' ? '' : Number(e.target.value) as WorkType)}>
            <option value="">Все виды работ</option>
            {Object.entries(WORK_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="search-panel__actions">
          <button type="button" className="btn btn--primary" onClick={load}>Найти</button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => { setSearch(''); setSubject(''); setWorkType(''); setSection(''); }}
          >
            Сбросить
          </button>
        </div>
        <button
          type="button"
          className="search-panel__advanced"
          onClick={() => setAdvanced(!advanced)}
        >
          {advanced ? '▲' : '▼'} Расширенный поиск
        </button>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tabs__item ${tab === t.id ? 'tabs__item--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count != null && <span className="tabs__count">{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : orders.length === 0 ? (
        <div className="empty">Заказов не найдено</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
