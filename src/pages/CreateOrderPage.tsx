import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filesApi, ordersApi, usersApi } from '../api/client';
import Breadcrumbs from '../components/Breadcrumbs';
import ProBadge from '../components/ProBadge';
import UserAvatar from '../components/UserAvatar';
import { WorkType, WORK_TYPE_LABELS, UserRole } from '../types';
import type { User } from '../types';

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState<WorkType>(WorkType.Coursework);
  const [subject, setSubject] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [invitedExecutorId, setInvitedExecutorId] = useState<number | null>(null);
  const [executorSearch, setExecutorSearch] = useState('');
  const [executors, setExecutors] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isPrivate && executorSearch.length >= 2) {
      const timer = setTimeout(() => {
        usersApi.search({ search: executorSearch, role: UserRole.Executor })
          .then(setExecutors);
      }, 300);
      return () => clearTimeout(timer);
    }
    setExecutors([]);
  }, [executorSearch, isPrivate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const order = await ordersApi.create({
        title,
        description,
        workType,
        subject,
        budget: Number(budget),
        deadline: new Date(deadline).toISOString(),
        isPrivate,
        invitedExecutorId: isPrivate ? invitedExecutorId ?? undefined : undefined,
      });

      for (const file of files) {
        await filesApi.uploadOrder(order.id, file);
      }

      navigate(`/orders/${order.id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Не удалось создать заказ';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--studwork">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Создать заказ' }]} />
      <h1 className="page__title">Создать заказ</h1>

      <form onSubmit={handleSubmit} className="form form--wide">
        {error && <div className="alert alert--error">{error}</div>}

        <label className="form__field">
          Название
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label className="form__field">
          Описание
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} />
        </label>

        <div className="form__row">
          <label className="form__field">
            Тип работы
            <select value={workType} onChange={(e) => setWorkType(Number(e.target.value) as WorkType)}>
              {Object.entries(WORK_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="form__field">
            Предмет
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </label>
        </div>

        <div className="form__row">
          <label className="form__field">
            Бюджет (₽)
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required min={100} />
          </label>
          <label className="form__field">
            Дедлайн
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </label>
        </div>

        <div className="panel private-order-panel">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => {
                setIsPrivate(e.target.checked);
                if (!e.target.checked) setInvitedExecutorId(null);
              }}
            />
            <span>🔒 Приватный заказ (только для выбранного исполнителя)</span>
          </label>

          {isPrivate && (
            <div className="private-order-picker">
              <label className="form__field">
                Найти исполнителя
                <input
                  type="text"
                  value={executorSearch}
                  onChange={(e) => setExecutorSearch(e.target.value)}
                  placeholder="Введите имя..."
                />
              </label>
              {executors.length > 0 && (
                <div className="executor-picker">
                  {executors.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      className={`executor-picker__item ${invitedExecutorId === ex.id ? 'active' : ''}`}
                      onClick={() => setInvitedExecutorId(ex.id)}
                    >
                      <UserAvatar user={ex} size="sm" />
                      <span>{ex.name}</span>
                      {ex.isPro && <ProBadge />}
                      <span className="muted">★ {ex.rating.toFixed(1)}</span>
                    </button>
                  ))}
                </div>
              )}
              {invitedExecutorId && (
                <p className="alert alert--success">Исполнитель выбран</p>
              )}
            </div>
          )}
        </div>

        <label className="form__field">
          Прикрепить файлы (ТЗ, методичка...)
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          {files.length > 0 && (
            <div className="file-upload__previews">
              {files.map((f, i) => <span key={i} className="file-upload__preview">{f.name}</span>)}
            </div>
          )}
        </label>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading || (isPrivate && !invitedExecutorId)}
        >
          {loading ? 'Создание...' : 'Опубликовать заказ'}
        </button>
      </form>
    </div>
  );
}
