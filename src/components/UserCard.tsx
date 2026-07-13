import type { User } from '../types';
import ProBadge from './ProBadge';
import UserAvatar from './UserAvatar';

interface Props {
  user: Pick<User, 'name' | 'isPro' | 'avatarUrl' | 'rating'>;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserCard({ user, subtitle, size = 'md' }: Props) {
  return (
    <div className="user-card">
      <UserAvatar user={user} size={size} />
      <div className="user-card__info">
        <div className="user-card__name">
          {user.name}
          {user.isPro && <ProBadge />}
        </div>
        {subtitle && <div className="user-card__subtitle">{subtitle}</div>}
        {'rating' in user && (
          <div className="user-card__rating">★ {user.rating.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
}
