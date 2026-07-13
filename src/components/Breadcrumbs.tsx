import { Link } from 'react-router-dom';

interface Props {
  items: { label: string; to?: string }[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="breadcrumbs__sep"> / </span>}
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="breadcrumbs__current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
