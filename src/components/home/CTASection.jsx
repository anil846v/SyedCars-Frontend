import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="bg-ink py-16 border-t border-ink-4">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Text */}
        <div>
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-smoke mb-3">READY TO DRIVE?</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3rem)] font-light text-white leading-tight mb-4">
            Your Perfect Car<br />
            Is Waiting
          </h2>
          <p className="text-smoke text-[0.92rem] leading-[1.65] mb-8">
            Explore our curated inventory or list your car for sale today.
            Our team ensures a smooth, transparent transaction.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/cars" className="px-6 py-3 bg-gold-light text-gold-dark font-semibold text-[0.85rem] rounded-sm tracking-wide transition-all duration-300 hover:bg-gold hover:text-true-white hover:shadow-[0_0_20px_rgba(195,225,41,0.2)]">
              Browse Cars
            </Link>
            <Link to="/contact" className="px-6 py-3 border border-orange-brand text-orange-brand font-semibold text-[0.85rem] rounded-sm tracking-wide transition-all duration-300 hover:bg-orange-brand hover:text-true-white">
              Sell Your Car
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[1.6/1] md:aspect-[1.5/1] shadow-md border border-ink-4">
          <img
            src="https://images.unsplash.com/photo-1600706432502-75a0e2e31986?w=800&q=80"
            alt="Bugatti Chiron"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

      </div>
    </section>
  );
}
