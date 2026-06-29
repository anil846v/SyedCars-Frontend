import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsapp from './FloatingWhatsapp';

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: isHome ? 0 : 72 }}>
        <Outlet />
      </main>
            <FloatingWhatsapp />

      <Footer />
    </>
  );
}
