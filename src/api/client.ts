import axios from 'axios';
import type {
  AdminStats,
  AdminUser,
  Attachment,
  AuthResponse,
  Bid,
  Conversation,
  DirectMessage,
  Message,
  Order,
  OrderDetail,
  OrderStatus,
  Review,
  User,
  UserRole,
  WorkType,
} from '../types';
import { API_ORIGIN } from '../config';

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; password: string; name: string; role: UserRole }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  me: () => api.get<User>('/auth/me').then((r) => r.data),
};

export const ordersApi = {
  list: (params?: { status?: OrderStatus; workType?: WorkType; subject?: string; search?: string }) =>
    api.get<Order[]>('/orders', { params }).then((r) => r.data),

  my: () => api.get<Order[]>('/orders/my').then((r) => r.data),

  get: (id: number) => api.get<OrderDetail>(`/orders/${id}`).then((r) => r.data),

  create: (data: {
    title: string;
    description: string;
    workType: WorkType;
    subject: string;
    budget: number;
    deadline: string;
    isPrivate?: boolean;
    invitedExecutorId?: number;
  }) => api.post<Order>('/orders', data).then((r) => r.data),

  acceptBid: (orderId: number, bidId: number) =>
    api.post<OrderDetail>(`/orders/${orderId}/accept-bid/${bidId}`).then((r) => r.data),

  complete: (orderId: number) =>
    api.post<OrderDetail>(`/orders/${orderId}/complete`).then((r) => r.data),

  cancel: (orderId: number) =>
    api.post<OrderDetail>(`/orders/${orderId}/cancel`).then((r) => r.data),
};

export const bidsApi = {
  create: (orderId: number, data: { price: number; message: string; daysToComplete: number }) =>
    api.post<Bid>(`/bids/order/${orderId}`, data).then((r) => r.data),
};

export const messagesApi = {
  list: (orderId: number) =>
    api.get<Message[]>(`/messages/order/${orderId}`).then((r) => r.data),

  send: (orderId: number, text: string, files?: File[]) => {
    const form = new FormData();
    if (text) form.append('text', text);
    files?.forEach((f) => form.append('files', f));
    return api.post<Message>(`/messages/order/${orderId}`, form).then((r) => r.data);
  },
};

export const conversationsApi = {
  list: () => api.get<Conversation[]>('/conversations').then((r) => r.data),

  getOrCreate: (userId: number) =>
    api.post<Conversation>(`/conversations/with/${userId}`).then((r) => r.data),

  getMessages: (id: number) =>
    api.get<DirectMessage[]>(`/conversations/${id}/messages`).then((r) => r.data),

  send: (id: number, text: string, files?: File[]) => {
    const form = new FormData();
    if (text) form.append('text', text);
    files?.forEach((f) => form.append('files', f));
    return api.post<DirectMessage>(`/conversations/${id}/messages`, form).then((r) => r.data);
  },
};

export const filesApi = {
  listOrder: (orderId: number) =>
    api.get<Attachment[]>(`/files/order/${orderId}`).then((r) => r.data),

  uploadOrder: (orderId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<Attachment>(`/files/order/${orderId}`, form).then((r) => r.data);
  },

  delete: (id: number) => api.delete(`/files/${id}`),
};

export const reviewsApi = {
  create: (orderId: number, data: { rating: number; comment?: string }) =>
    api.post<Review>(`/reviews/order/${orderId}`, data).then((r) => r.data),
};

export const usersApi = {
  search: (params?: { search?: string; role?: UserRole }) =>
    api.get<User[]>('/users', { params }).then((r) => r.data),

  get: (id: number) => api.get<User>(`/users/${id}`).then((r) => r.data),

  updateProfile: (data: {
    name: string;
    bio?: string;
    phone?: string;
    skills?: string;
    portfolioUrl?: string;
    city?: string;
  }) => api.put<User>('/users/profile', data).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<User>('/users/avatar', form).then((r) => r.data);
  },
};

export const adminApi = {
  stats: () => api.get<AdminStats>('/admin/stats').then((r) => r.data),

  users: () => api.get<AdminUser[]>('/admin/users').then((r) => r.data),

  orders: () => api.get<Order[]>('/admin/orders').then((r) => r.data),

  setPro: (id: number, isPro: boolean) =>
    api.put<AdminUser>(`/admin/users/${id}/pro`, { isPro }).then((r) => r.data),

  setBan: (id: number, isBanned: boolean) =>
    api.put<AdminUser>(`/admin/users/${id}/ban`, { isBanned }).then((r) => r.data),

  setRole: (id: number, role: UserRole) =>
    api.put<AdminUser>(`/admin/users/${id}/role`, role, {
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.data),

  deleteOrder: (id: number) => api.delete(`/admin/orders/${id}`),
};

export default api;
