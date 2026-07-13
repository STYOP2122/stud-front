import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { conversationsApi } from '../api/client';
import { useAppSelector } from '../store/hooks';
import { AttachmentList, FileUpload } from '../components/Attachments';
import ProBadge from '../components/ProBadge';
import UserAvatar from '../components/UserAvatar';
import type { Conversation, DirectMessage } from '../types';

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((s) => s.auth);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [otherUser, setOtherUser] = useState<Conversation['otherUser'] | null>(null);
  const [text, setText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const convId = Number(id);

  const load = async () => {
    const [msgs, convs] = await Promise.all([
      conversationsApi.getMessages(convId),
      conversationsApi.list(),
    ]);
    setMessages(msgs);
    const conv = convs.find((c) => c.id === convId);
    if (conv) setOtherUser(conv.otherUser);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => conversationsApi.getMessages(convId).then(setMessages), 4000);
    return () => clearInterval(interval);
  }, [convId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !pendingFiles.length) return;
    const msg = await conversationsApi.send(convId, text, pendingFiles);
    setMessages((prev) => [...prev, msg]);
    setText('');
    setPendingFiles([]);
  };

  if (loading) return <div className="page page--studwork loading">Загрузка...</div>;

  return (
    <div className="page page--studwork">
      <Link to="/messages" className="back-link">← Все диалоги</Link>

      {otherUser && (
        <div className="chat-header">
          <Link to={`/users/${otherUser.id}`} className="chat-header__user">
            <UserAvatar user={otherUser} size="md" />
            <span>
              {otherUser.name}
              {otherUser.isPro && <ProBadge />}
            </span>
          </Link>
        </div>
      )}

      <section className="panel chat-panel">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.sender.id === user?.id ? 'chat-message--own' : ''}`}
            >
              <div className="chat-message__author">{msg.sender.name}</div>
              {msg.text && <div className="chat-message__text">{msg.text}</div>}
              <AttachmentList attachments={msg.attachments} />
              <div className="chat-message__time">{formatDate(msg.createdAt)}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-compose">
          <FileUpload
            onUpload={(files) => setPendingFiles((prev) => [...prev, ...files])}
            label="Фото / файл"
          />
          {pendingFiles.length > 0 && (
            <div className="file-upload__previews">
              {pendingFiles.map((f, i) => (
                <span key={i} className="file-upload__preview">{f.name}</span>
              ))}
            </div>
          )}
          <div className="chat-input">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Написать сообщение..."
            />
            <button type="submit" className="btn btn--primary">Отправить</button>
          </div>
        </form>
      </section>
    </div>
  );
}
