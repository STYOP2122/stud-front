import { useLocation } from 'react-router-dom';

import { MobileNavProvider, useMobileNav } from '../context/MobileNavContext';

import JournalPanel from './JournalPanel';

import MobileBottomNav from './MobileBottomNav';

import Sidebar from './Sidebar';

import TopNav from './TopNav';



const MINIMAL_PATHS = ['/', '/login', '/register'];



interface Props {

  children: React.ReactNode;

}



function ShellContent({ children, showJournal }: { children: React.ReactNode; showJournal: boolean }) {

  const { sidebarOpen, closeSidebar } = useMobileNav();



  return (

    <>

      <TopNav showSidebarToggle />

      <div className="shell">

        <Sidebar />

        {sidebarOpen && (

          <button

            type="button"

            className="sidebar-backdrop"

            onClick={closeSidebar}

            aria-label="Закрыть меню"

          />

        )}

        <main className="shell__main">{children}</main>

        {showJournal && <JournalPanel />}

      </div>

      <MobileBottomNav />

    </>

  );

}



export default function AppLayout({ children }: Props) {

  const { pathname } = useLocation();

  const isMinimal = MINIMAL_PATHS.includes(pathname);

  const isAdmin = pathname.startsWith('/admin');

  const showJournal = !isMinimal && !isAdmin && !pathname.startsWith('/messages/');

  const useShell = !isMinimal && !isAdmin;



  return (

    <MobileNavProvider>

      <div className={`app ${useShell ? 'app--shell' : ''}`}>

        {isMinimal && (

          <>

            <TopNav />

            <main className="main main--minimal">{children}</main>

          </>

        )}



        {isAdmin && (

          <>

            <TopNav />

            <main className="main main--admin">{children}</main>

          </>

        )}



        {useShell && <ShellContent showJournal={showJournal}>{children}</ShellContent>}

      </div>

    </MobileNavProvider>

  );

}

