import { Outlet } from 'react-router-dom';
import AppLayout from './AppLayout';

export default function Layout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
