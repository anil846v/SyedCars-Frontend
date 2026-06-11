import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-ink-2 border-t border-ink-4 pt-20">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 pb-12">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="font-display text-[1.5rem] font-light text-white flex items-center gap-2.5 mb-4">
            <img src={logo} alt="Syed Cars Logo" className="h-8 w-auto object-contain" />
            <span className="font-medium tracking-tight">Syed <strong className="font-bold text-gold">Cars</strong></span>
          </div>
          <p className="text-[0.875rem] text-smoke leading-[1.7] mb-5">
            Madanapalle's trusted marketplace for<br />
            premium pre-owned automobiles.
          </p>
          <div className="flex flex-col gap-[0.4rem]">
            <a href="tel:+916300365539" className="text-[0.85rem] text-mist transition-colors duration-150 font-mono hover:text-gold">+91 63003 65539</a>
            <a href="tel:+919177565639" className="text-[0.85rem] text-mist transition-colors duration-150 font-mono hover:text-gold">+91 91775 65639</a>
            <a href="mailto:hello@syedcars.in" className="text-[0.85rem] text-mist transition-colors duration-150 font-mono hover:text-gold mt-1">hello@syedcars.in</a>
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-4">Browse</h4>
          <nav className="flex flex-col gap-[0.6rem]">
            <Link to="/cars" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">All Cars</Link>
            <Link to="/cars?fuel=Petrol" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Petrol Cars</Link>
            <Link to="/cars?fuel=Diesel" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Diesel Cars</Link>
            <Link to="/cars?fuel=Hybrid" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Hybrid / EV</Link>
          </nav>
        </div>

        <div className="col-span-1">
          <h4 className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-4">Company</h4>
          <nav className="flex flex-col gap-[0.6rem]">
            <Link to="/about" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">About Us</Link>
            <Link to="/contact" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Contact</Link>
            <Link to="/contact" className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">List Your Car</Link>
          </nav>
        </div>

        <div className="col-span-1">
          <h4 className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-4">Legal</h4>
          <nav className="flex flex-col gap-[0.6rem]">
            <span className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Privacy Policy</span>
            <span className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Terms of Service</span>
            <span className="text-[0.875rem] text-smoke cursor-pointer transition-colors duration-150 block hover:text-mist">Disclaimer</span>
          </nav>
        </div>
      </div>

      <div className="border-t border-ink-4 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[0.78rem] text-smoke font-mono leading-[1.8]">
              © {new Date().getFullYear()} Syed Cars. All rights reserved. Madanapalle, Andhra Pradesh.
            </p>
            <p className="text-[0.78rem] text-smoke font-mono leading-[1.8]" style={{ opacity: 0.4 }}>
              All prices are indicative and subject to negotiation.
            </p>
          </div>
          <div className="flex items-center gap-4 text-smoke text-xl">
            <a href="https://wa.me/916300365539" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="WhatsApp">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.03-5.118-2.905-6.993-1.876-1.875-4.357-2.905-6.993-2.907-5.441 0-9.865 4.422-9.869 9.866-.001 1.636.45 3.238 1.311 4.654l-.99 3.612 3.703-.97zM17.487 14.4c-.27-.137-1.604-.792-1.852-.882-.25-.09-.431-.137-.61.137-.18.27-.697.882-.857 1.058-.16.177-.32.197-.59.06-.27-.137-1.144-.422-2.183-1.348-.807-.72-1.353-1.61-1.512-1.883-.16-.27-.016-.417.118-.552.122-.122.27-.315.405-.473.137-.158.18-.27.27-.45.09-.18.046-.338-.021-.473-.069-.137-.61-1.472-.837-2.013-.22-.53-.443-.457-.61-.466-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.74.348-.253.279-.968.948-.968 2.31 0 1.361.99 2.674 1.13 2.86.137.184 1.948 2.973 4.72 4.17 1.258.544 2.02.7 2.766.589.824-.123 1.604-.656 1.83-1.288.225-.63.225-1.17.157-1.288-.07-.117-.25-.18-.52-.317z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
