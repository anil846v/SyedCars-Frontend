// Testimonials are static — no backend endpoint; kept as curated content
const TESTIMONIALS = [
  {
    id: 1,
    text: "Bought my BMW 5 Series through Syed Cars and the entire process was seamless. Full documentation, transparent pricing, zero hassle.",
    name: "Ravi Kumar",
    role: "Business Owner, Madanapalle",
    avatar: "RK",
    rating: 5,
  },
  {
    id: 2,
    text: "Sold my Mercedes through them in less than a week. Fair commission, great exposure, and they handled everything professionally.",
    name: "Fatima Begum",
    role: "Teacher, Chittoor",
    avatar: "FB",
    rating: 5,
  },
  {
    id: 3,
    text: "The team was honest about the car's condition and history. Exactly what you want when buying a pre-owned luxury vehicle.",
    name: "Suresh Reddy",
    role: "Software Engineer, Bangalore",
    avatar: "SR",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="section bg-ink">
      <div className="container">
        <div className="mb-12">
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-2">Customer Stories</p>
          <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-light text-white">What Our Clients <em className="italic text-mist">Say</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-ink-2 border border-ink-4 rounded-lg p-7 flex flex-col gap-4 transition-colors duration-300 hover:border-gold-dark">
              <div className="text-gold text-[0.9rem] tracking-[2px]">{'★'.repeat(t.rating)}</div>
              <p className="font-display text-[1.05rem] italic text-mist leading-[1.7] flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gold-glow border border-gold-dark text-gold flex items-center justify-center text-[0.78rem] font-bold font-mono shrink-0">{t.avatar}</div>
                <div>
                  <p className="text-[0.875rem] font-semibold text-white">{t.name}</p>
                  <p className="text-[0.75rem] text-smoke font-mono">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
