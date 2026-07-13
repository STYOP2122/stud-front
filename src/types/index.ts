export const UserRole = {
  Customer: 0,
  Executor: 1,
  Admin: 2,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OrderStatus = {
  Open: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const WorkType = {
  Essay: 0,
  Coursework: 1,
  Diploma: 2,
  Report: 3,
  Presentation: 4,
  Other: 5,
} as const;
export type WorkType = (typeof WorkType)[keyof typeof WorkType];

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  skills: string | null;
  portfolioUrl: string | null;
  city: string | null;
  isPro: boolean;
  isBanned: boolean;
  rating: number;
  completedOrders: number;
  createdAt: string;
}

export interface Attachment {
  id: number;
  fileName: string;
  url: string;
  contentType: string;
  size: number;
  isImage: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  title: string;
  description: string;
  workType: WorkType;
  subject: string;
  budget: number;
  deadline: string;
  status: OrderStatus;
  isPrivate: boolean;
  invitedExecutor: User | null;
  createdAt: string;
  customer: User;
  executor: User | null;
  bidsCount: number;
}

export interface Bid {
  id: number;
  price: number;
  message: string;
  daysToComplete: number;
  isAccepted: boolean;
  createdAt: string;
  executor: User;
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  fromUser: User;
}

export interface OrderDetail extends Omit<Order, 'bidsCount'> {
  bids: Bid[];
  attachments: Attachment[];
  review: Review | null;
}

export interface Message {
  id: number;
  text: string;
  createdAt: string;
  sender: User;
  attachments: Attachment[];
}

export interface Conversation {
  id: number;
  otherUser: User;
  lastMessageText: string | null;
  lastMessageAt: string;
}

export interface DirectMessage {
  id: number;
  text: string;
  createdAt: string;
  sender: User;
  attachments: Attachment[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  openOrders: number;
  proUsers: number;
  bannedUsers: number;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isPro: boolean;
  isBanned: boolean;
  rating: number;
  completedOrders: number;
  createdAt: string;
}

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  [WorkType.Essay]: 'Реферат / Эссе',
  [WorkType.Coursework]: 'Курсовая',
  [WorkType.Diploma]: 'Диплом',
  [WorkType.Report]: 'Отчёт',
  [WorkType.Presentation]: 'Презентация',
  [WorkType.Other]: 'Другое',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Open]: 'Открыт',
  [OrderStatus.InProgress]: 'В работе',
  [OrderStatus.Completed]: 'Завершён',
  [OrderStatus.Cancelled]: 'Отменён',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Customer]: 'Заказчик',
  [UserRole.Executor]: 'Исполнитель',
  [UserRole.Admin]: 'Администратор',
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function fileUrl(url: string): string {
  if (url.startsWith('http')) return url;
  const origin = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}
