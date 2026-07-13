import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  onClickOutside: () => void,
  enabled = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClickOutside, enabled]);

  return ref;
}
