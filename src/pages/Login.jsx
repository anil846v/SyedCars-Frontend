import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [show, setShow]   = useState(false);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-5"
         style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.06) 0%, transparent 60%), var(--ink)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="Syed Cars" className="h-10 w-auto" />
            <span className="font-display text-2xl text-white font-normal">Syed <strong className="text-gold font-bold">Cars</strong></span>
          </Link>
          <p className="text-smoke text-sm mt-3 font-mono tracking-wide">Admin Dashboard Access</p>
        </div>

        {/* Card */}
        <div className="bg-ink-2 border border-ink-4 rounded-lg p-8">
          <h1 className="font-display text-2xl text-white font-normal mb-1">Welcome back</h1>
          <p className="text-smoke text-sm mb-7">Sign in to manage your listings.</p>

          {error && (
            <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => f('email', e.target.value)}
                placeholder="admin@syedcars.com"
                required
                className="w-full bg-ink border border-ink-4 rounded-md px-4 py-3 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-smoke mb-2">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => f('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-ink border border-ink-4 rounded-md px-4 py-3 pr-12 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-smoke hover:text-white transition-colors text-xs font-mono">
                  {show ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gold text-ink font-medium py-3 rounded-md text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-4">
            <Link to="/admin/login#forgot" className="text-xs text-smoke font-mono hover:text-gold transition-colors">
              Forgot password? Contact system admin
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-ink-5 font-mono mt-6">
          <Link to="/" className="hover:text-smoke transition-colors">← Back to public site</Link>
        </p>
      </div>
    </div>
  );
}
