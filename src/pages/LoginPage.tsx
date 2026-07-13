import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearError, login } from '../store/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) navigate('/orders');
  }, [token, navigate]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h1>Вход</h1>
        <p className="auth-card__hint">
          Тестовые аккаунты: customer@test.com / executor@test.com / admin@test.com (пароль: 123456)
        </p>

        <form onSubmit={handleSubmit} className="form">
          {error && <div className="alert alert--error">{error}</div>}

          <label className="form__field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
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

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-card__footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
