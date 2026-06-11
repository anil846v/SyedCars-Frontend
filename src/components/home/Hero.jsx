import { Link, useNavigate } from 'react-router-dom';
import CarFilters from '../cars/CarFilters';
import heroCar from "../../assets/hero.png";

export default function Hero() {
  const navigate = useNavigate();

  const handleFilter = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#f8f9fa] via-[#ffffff] to-[#f3f4f6]">
        {/* Orange glow behind car — larger and more visible */}
        <div className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-[#FF6B00]/8 blur-3xl" />

        {/* Hero car — bigger, grounded slightly lower */}
        <img
          src={heroCar}
          alt="Hero Car"
          className="absolute right-[-0%] top-[43%] -translate-y-1/2 w-[98%] max-w-[1200px] object-contain"
        />
      </div>

      {/* Content */}
      
      <div className="container relative z-10 pt-24 pb-24 py-16 max-w-[1000px]">
<div className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-[#FF6B00] mt-11 animate-fade-up">          <span className="text-[#FF6B00] text-sm">✦</span>
          Madanapalle's Premier Pre-Owned Auto Marketplace
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.08] text-[#111111] mb-6 animate-[fadeUp_0.6s_0.1s_ease_both] tracking-[-0.01em]">
          Drive Your Dream,<br />
          <span className="text-[#FF6B00] font-normal">Own It Today.</span>
        </h1>

        <p className="text-[1.05rem] text-[#111111]/80 leading-[1.75] max-w-[560px] mb-10 animate-[fadeUp_0.6s_0.2s_ease_both]">
          Premium collection of verified, insurance-active luxury automobiles.
          Transparent pricing. 100% verified cars. Documentation guaranteed.
        </p>

        <div className="flex mb-16 animate-[fadeUp_0.6s_0.3s_ease_both]">
          <Link
            to="/cars"
            className="inline-flex items-center justify-center gap-2 px-8 py-[0.85rem] bg-[#FF6B00] text-white font-bold text-[0.9rem] rounded-sm tracking-wide transition-all duration-300 hover:bg-[#e05e00] hover:shadow-[0_0_24px_rgba(255,107,0,0.35)] hover:-translate-y-[2px]"
          >
            Browse All Cars ➔
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 animate-[fadeUp_0.6s_0.4s_ease_both]">
          {/* Stat 1 */}
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[#FF6B00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <div>
              <div className="text-lg font-bold text-[#111111] leading-tight">500+</div>
              <div className="text-[0.7rem] text-[#111111]/70 font-mono uppercase tracking-wider">Verified Cars</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[#FF6B00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <div className="text-lg font-bold text-[#111111] leading-tight">100%</div>
              <div className="text-[0.7rem] text-[#111111]/70 font-mono uppercase tracking-wider">Transparent</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[#FF6B00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-lg font-bold text-[#111111] leading-tight">Best</div>
              <div className="text-[0.7rem] text-[#111111]/70 font-mono uppercase tracking-wider">Prices</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[#FF6B00] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <div>
              <div className="text-lg font-bold text-[#111111] leading-tight">Top</div>
              <div className="text-[0.7rem] text-[#111111]/70 font-mono uppercase tracking-wider">Rated by Customers</div>
            </div>
          </div>
        </div>

        {/* Horizontal Car Filter */}
        <div className="mt-12 w-full animate-[fadeUp_0.6s_0.5s_ease_both]">
          <CarFilters layout="horizontal" onFilter={handleFilter} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-[var(--container-pad)] z-10 flex flex-col items-center gap-2 animate-[fadeIn_1s_1s_ease_both]">
        <span className="w-[1px] h-12 bg-gradient-to-b from-transparent to-neutral-400 animate-pulse" />
        <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-neutral-400 [writing-mode:vertical-lr]">scroll</span>
      </div>
    </section>
  );
}