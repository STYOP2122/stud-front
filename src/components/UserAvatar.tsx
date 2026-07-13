import { mediaUrl } from '../config';
import type { User } from '../types';

interface Props {
  user?: Pick<User, 'name' | 'isPro' | 'avatarUrl'> | null;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizes = { sm: 32, md: 40, lg: 64 };

export default function UserAvatar({ user, size = 'md', showName = false }: Props) {
  const px = sizes[size];
  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ?? '?';
  const avatarSrc = mediaUrl(user?.avatarUrl);

  return (
    <div className={`user-avatar user-avatar--${size}`}>
      {avatarSrc ? (
        <img src={avatarSrc} alt={user?.name} width={px} height={px} />
      ) : (
        <span className="user-avatar__initials">{initials}</span>
      )}
      {showName && user && <span className="user-avatar__name">{user.name}</span>}
    </div>
  );
}
