import { useState } from 'react';
import { enquiriesApi } from '../../utils/api';

export default function ContactSection() {
  const [form,    setForm]    = useState({ name:'', phone:'', email:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true); setError('');
    try {
      await enquiriesApi.submit(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-ink border border-ink-4/70 rounded-md px-4 py-3 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold transition-colors";

  return (
    <section className="section bg-ink-2">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Get In Touch</p>
            <h2 className="font-display text-4xl md:text-5xl text-white font-normal mb-6">Talk to Us</h2>
            <p className="text-smoke leading-relaxed mb-8">
              Looking for a specific car? Have a vehicle to sell? Reach out and we'll connect with you promptly.
            </p>
            <div className="space-y-4 text-sm">
              {[
                { icon:'📞', label:'Phone', value:'+91 98765 43210' },
                { icon:'✉', label:'Email', value:'contact@syedcars.com' },
                { icon:'📍', label:'Location', value:'Madanapalle, Andhra Pradesh' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-full bg-gold-glow border border-gold-dark text-gold flex items-center justify-center shrink-0 text-base">{item.icon}</span>
                  <div>
                    <p className="text-smoke text-xs font-mono uppercase tracking-wide">{item.label}</p>
                    <p className="text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ink border border-ink-4 rounded-lg p-7">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-display text-2xl text-emerald mb-2">Message Sent!</h3>
                <p className="text-smoke">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-display text-xl text-white font-normal mb-2">Send us a message</h3>
                {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-3 py-2 text-crimson text-sm">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input value={form.name} onChange={f('name')} placeholder="Name *" required className={inputClass} />
                  <input value={form.phone} onChange={f('phone')} placeholder="Phone *" required className={inputClass} />
                </div>
                <input type="email" value={form.email} onChange={f('email')} placeholder="Email (optional)" className={inputClass} />
                <textarea value={form.message} onChange={f('message')} placeholder="Your message…" rows={4} required className={`${inputClass} resize-none`} />
                <button type="submit" disabled={sending}
                  className="mt-2 bg-gold text-ink font-medium py-3 rounded-md text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50">
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
