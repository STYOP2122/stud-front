import { JOURNAL_TOPICS } from '../data/journalTopics';

export default function JournalPanel() {
  return (
    <aside className="journal">
      <h3 className="journal__title">Темы журнала</h3>
      <ul className="journal__list">
        {JOURNAL_TOPICS.map((topic) => (
          <li key={topic.id} className="journal__item">
            <a href="#" className="journal__link" onClick={(e) => e.preventDefault()}>
              <span className="journal__topic-title">{topic.title}</span>
              <span className="journal__meta">
                <span>{topic.date}</span>
                <span className="journal__comments">💬 {topic.comments}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
