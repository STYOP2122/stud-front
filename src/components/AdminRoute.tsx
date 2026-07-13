import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';

export default function AdminRoute() {
  const { user, token } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== UserRole.Admin) return <Navigate to="/" replace />;
  return <Outlet />;
}
