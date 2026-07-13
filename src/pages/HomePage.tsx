import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="hero">
      <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">
            Биржа студенческих работ
          </h1>
          <p className="hero__subtitle">
            Размещайте заказы на курсовые, дипломы и рефераты — или зарабатывайте,
            выполняя работы для других студентов.
          </p>
          <div className="hero__actions">
            <Link to="/orders" className="btn btn--primary btn--lg">
              Смотреть заказы
            </Link>
            <Link to="/register" className="btn btn--outline btn--lg">
              Начать работу
            </Link>
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-card__icon">📝</div>
            <h3>Для заказчиков</h3>
            <p>Создайте заказ, укажите тему и бюджет — исполнители сами предложат цену и сроки.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">💼</div>
            <h3>Для исполнителей</h3>
            <p>Откликайтесь на интересные заказы, ведите переписку и зарабатывайте на знаниях.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">⭐</div>
            <h3>Рейтинги и отзывы</h3>
            <p>Выбирайте проверенных авторов по рейтингу и отзывам других заказчиков.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
