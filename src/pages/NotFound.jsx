import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center">
      <div className="text-center p-8">
        <p className="font-display text-[clamp(6rem,15vw,10rem)] font-light text-ink-5 leading-none -mb-2">404</p>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-light text-white mb-4">Page Not <em className="italic text-gold">Found</em></h1>
        <p className="text-[0.95rem] text-smoke mb-10 max-w-[400px] mx-auto">
          The road you were looking for doesn't exist. Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="px-8 py-3 bg-gold text-ink font-bold rounded-sm text-[0.9rem] transition-all duration-300 hover:bg-gold-light">Go Home</Link>
          <Link to="/cars" className="px-8 py-3 border border-ink-5 text-mist rounded-sm text-[0.9rem] transition-all duration-300 hover:border-smoke hover:text-white">Browse Cars</Link>
        </div>
      </div>
    </div>
  );
}
