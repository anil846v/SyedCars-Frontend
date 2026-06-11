const REASONS = [
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Verified Listings',
    desc: 'Every car undergoes thorough verification for documents, inspection & history.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Transparent Pricing',
    desc: 'No hidden fees. No inflated prices. What you see is what you pay.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'End-to-End Assistance',
    desc: 'From test drive to paperwork, we handle everything for you.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Insurance Active',
    desc: 'All cars come with valid insurance for your peace of mind.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section bg-ink-2">
      <div className="container">
        <div className="max-w-[560px] mb-14">
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-2">Why Syed Cars</p>
          <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-light text-white leading-[1.12] mb-4">
            The Smarter Way to Buy or Sell
          </h2>
          <p className="text-smoke text-[0.95rem] leading-[1.7] whitespace-pre-line">
            Trusted by 1000+ customers across India.
            {"\n"}We make every car transaction simple, safe and smart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((reason, i) => (
            <div key={i} className="bg-ink-2 border border-ink-4 rounded-lg px-6 py-7 transition-all duration-300 hover:border-gold hover:shadow-md hover:-translate-y-[2px] cursor-default">
              <div className="w-12 h-12 bg-gold-glow border border-gold/10 rounded-md flex items-center justify-center mb-5">
                {reason.icon}
              </div>
              <h3 className="font-display text-[1.2rem] font-medium text-white mb-[0.6rem]">{reason.title}</h3>
              <p className="text-[0.875rem] text-smoke leading-[1.65]">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
