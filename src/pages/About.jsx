const TEAM = [
  { name: 'Rajesh Sharma', role: 'Founder & CEO', initials: 'RS', bio: '15+ years in the automobile industry across Madanapalle and Mumbai.' },
  { name: 'Priya Nair', role: 'Head of Sales', initials: 'PN', bio: 'Expert in luxury vehicle valuation and customer advisory.' },
  { name: 'Vikram Rao', role: 'Documentation Lead', initials: 'VR', bio: 'Specialist in RTO processes, insurance and vehicle transfers.' },
];

const MILESTONES = [
  { year: '2018', event: 'Syed Cars founded in Madanapalle with a focus on premium pre-owned cars.' },
  { year: '2020', event: 'Expanded to serve all of Andhra Pradesh. Crossed 100 verified listings.' },
  { year: '2022', event: 'Launched digital enquiry system. Served 500+ customers.' },
  { year: '2024', event: 'Reached ₹50Cr+ in total transactions. Team of 12 professionals.' },
];

export default function About() {
  return (
    <div className="page-enter pb-0">
      {/* Hero */}
      <div className="bg-ink-2 border-b border-ink-4 py-20 pb-16">
        <div className="container">
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-2">Our Story</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-light text-white mb-5">About <em className="italic text-gold">Syed Cars</em></h1>
          <p className="text-[1.05rem] text-mist leading-[1.75] max-w-[560px]">
            Born in Madanapalle, built on trust. We exist to make buying and selling
            pre-owned luxury cars a transparent, confident, and enjoyable experience.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section bg-ink">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-2">Our Mission</p>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light text-white mb-8">Transparency First,<br /><em className="italic text-mist">Always</em></h2>
              <p className="text-smoke text-[0.95rem] leading-[1.8]">
                The pre-owned car market is riddled with information asymmetry. Buyers don't know
                what they're getting, and sellers don't get fair value. Syed Cars was built to fix that.
              </p>
              <p className="text-smoke text-[0.95rem] leading-[1.8] mt-4">
                Every listing on Syed Cars shows the complete picture — real odometer readings,
                verified insurance details, accurate engine and chassis numbers, and honest pricing
                benchmarked against the current market.
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80" alt="Cars" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-ink/40 to-transparent" />
              <div className="absolute bottom-6 left-6 bg-ink/80 backdrop-blur-md border border-gold-dark rounded-md px-5 py-3">
                <span className="block font-display text-[1.5rem] text-gold font-medium">₹50Cr+</span>
                <span className="text-[0.72rem] text-smoke font-mono uppercase tracking-wider">Total Transactions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-ink-2">
        <div className="container">
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-2">Our Journey</p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light text-white mb-8">Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex flex-col">
                <div className="font-display text-[1.75rem] font-light text-gold mb-3">{m.year}</div>
                <div className="flex items-center mb-3 h-5">
                  <div className="w-3 h-3 rounded-full bg-gold shrink-0" />
                  {i < MILESTONES.length - 1 && <div className="flex-1 h-[1px] bg-ink-5 ml-2 hidden md:block" />}
                </div>
                <div className="text-[0.875rem] text-smoke leading-[1.65] pr-6">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-ink">
        <div className="container">
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-gold mb-2">The People</p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light text-white mb-8">Meet the <em className="italic text-mist">Team</em></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-ink-2 border border-ink-4 rounded-lg px-6 py-8 text-center transition-colors duration-300 hover:border-gold-dark">
                <div className="w-16 h-16 rounded-full bg-gold-glow border-2 border-gold-dark text-gold text-[1.1rem] font-bold font-mono flex items-center justify-center mx-auto mb-4">{member.initials}</div>
                <h3 className="font-display text-[1.2rem] font-medium text-white mb-1">{member.name}</h3>
                <p className="font-mono text-[0.72rem] tracking-wider uppercase text-gold mb-3">{member.role}</p>
                <p className="text-[0.85rem] text-smoke leading-[1.65]">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
