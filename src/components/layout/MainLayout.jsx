import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { cx } from '../../utils/helpers';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={cx("min-h-screen", isHome ? "" : "pt-[72px]")}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
