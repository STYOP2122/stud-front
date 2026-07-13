import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import ConversationPage from './pages/ConversationPage';
import CreateOrderPage from './pages/CreateOrderPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MessagesPage from './pages/MessagesPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import { ROUTER_BASENAME } from './config';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchMe } from './store/authSlice';

function AppRoutes() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="users/:id" element={<UserProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="my-orders/*" element={<MyOrdersPage />} />
          <Route path="create-order" element={<CreateOrderPage />} />
          <Route path="profile/*" element={<ProfilePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:id" element={<ConversationPage />} />
          <Route path="orders/favorites" element={<OrdersPage />} />
          <Route path="orders/shop" element={<OrdersPage />} />
          <Route path="orders/partners" element={<OrdersPage />} />
          <Route path="orders/promo" element={<OrdersPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <AppRoutes />
    </BrowserRouter>
  );
}
