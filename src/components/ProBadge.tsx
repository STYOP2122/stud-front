interface Props {
  className?: string;
  variant?: 'filled' | 'outline';
}

export default function ProBadge({ className = '', variant = 'filled' }: Props) {
  return (
    <span
      className={`pro-badge pro-badge--${variant} ${className}`}
      title="PRO исполнитель"
    >
      PRO
    </span>
  );
}
