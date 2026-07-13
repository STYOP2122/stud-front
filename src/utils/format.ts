export function pluralize(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

export function bidsLabel(count: number): string {
  return `${count} ${pluralize(count, 'отклик', 'отклика', 'откликов')}`;
}
