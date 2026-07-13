export type ProfileSection =
  | 'main'
  | 'settings'
  | 'finance'
  | 'specializations'
  | 'portfolio'
  | 'services'
  | 'bonuses';

const SECTION_PATHS: Record<string, ProfileSection> = {
  '/profile': 'main',
  '/profile/settings': 'settings',
  '/profile/finance': 'finance',
  '/profile/specializations': 'specializations',
  '/profile/portfolio': 'portfolio',
  '/profile/services': 'services',
  '/profile/bonuses': 'bonuses',
};

export function getProfileSection(pathname: string): ProfileSection | null {
  return SECTION_PATHS[pathname] ?? null;
}

export const PROFILE_SECTION_LABELS: Record<ProfileSection, string> = {
  main: 'Профиль',
  settings: 'Настройки',
  finance: 'Финансы',
  specializations: 'Специализации',
  portfolio: 'Портфолио',
  services: 'Платные услуги',
  bonuses: 'Бонусы',
};

export const SECTION_IDS: Record<ProfileSection, string> = {
  main: 'section-main',
  settings: 'section-settings',
  finance: 'section-finance',
  specializations: 'section-specializations',
  portfolio: 'section-portfolio',
  services: 'section-services',
  bonuses: 'section-bonuses',
};
