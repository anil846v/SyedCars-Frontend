import { useState } from 'react';
import { enquiriesApi } from '../utils/api';

export default function Contact() {
  const [form,    setForm]    = useState({ name:'', phone:'', email:'', address:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true); setError('');
    try {
      await enquiriesApi.submit(form); // car_id omitted = general contact
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-ink-2 border border-ink-4 rounded-md px-4 py-3 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold transition-colors";

  return (
    <section className="section">
      <div className="container max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl text-white font-normal mb-3">Contact Us</h1>
        <p className="text-smoke mb-10">Have a question or want to visit our showroom? Reach out below.</p>

        {sent ? (
          <div className="text-center py-20 bg-ink-2 border border-ink-4 rounded-lg">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="font-display text-2xl text-emerald mb-2">Message Sent!</h2>
            <p className="text-smoke">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-ink-2 border border-ink-4 rounded-lg p-8">
            {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Name *</label>
                <input value={form.name} onChange={f('name')} placeholder="Your Name" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Phone *</label>
                <input value={form.phone} onChange={f('phone')} placeholder="9876543210" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Email</label>
              <input type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Address</label>
              <input value={form.address} onChange={f('address')} placeholder="Your city / locality" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Message *</label>
              <textarea value={form.message} onChange={f('message')} placeholder="How can we help you?" rows={4} required className={`${inputClass} resize-none`} />
            </div>
            <button type="submit" disabled={sending}
              className="bg-gold text-ink font-medium py-3 rounded-md text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50">
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
