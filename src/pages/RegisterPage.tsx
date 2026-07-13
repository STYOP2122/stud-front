import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearError, register } from '../store/authSlice';
import { UserRole } from '../types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Customer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) navigate('/orders');
  }, [token, navigate]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(register({ name, email, password, role }));
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h1>Регистрация</h1>

        <form onSubmit={handleSubmit} className="form">
          {error && <div className="alert alert--error">{error}</div>}

          <label className="form__field">
            Имя
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ваше имя"
            />
          </label>

          <label className="form__field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form__field">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <div className="form__field">
            <span>Я хочу</span>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-toggle__btn ${role === UserRole.Customer ? 'active' : ''}`}
                onClick={() => setRole(UserRole.Customer)}
              >
                Заказывать работы
              </button>
              <button
                type="button"
                className={`role-toggle__btn ${role === UserRole.Executor ? 'active' : ''}`}
                onClick={() => setRole(UserRole.Executor)}
              >
                Выполнять работы
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Регистрация...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="auth-card__footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
