import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ShieldCheck, Trash2, UserPlus, RefreshCw, ToggleLeft, ToggleRight, Eye, EyeOff, Mail, Phone, MapPin, User, Lock, KeyRound } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';

// Dark-theme classes for the page cards
const inputClass  = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2.5 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors";
const labelClass  = "block text-xs font-mono uppercase tracking-wider text-smoke mb-1.5";

// Light-theme classes for modals (Modal background is white #fff)
const mInput = "w-full bg-gray-50 border border-gray-200 rounded-lg py-3 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors";
const mLabel = "block text-sm font-medium text-gray-500 mb-2";
// Inline styles used everywhere to avoid Tailwind class specificity conflicts
const mPad  = { paddingLeft: 40, paddingRight: 12 };
const mPadR = { paddingLeft: 40, paddingRight: 44 };
const mIconSt  = { position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' };
const mEyeSt   = { position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', padding:2, display:'flex', alignItems:'center' };

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null); // 'create' | 'edit' | 'profile' | 'password'
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState({});
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');
  const [meData,       setMeData]       = useState(null);
  const [showPw,          setShowPw]          = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [showEditPw,      setShowEditPw]      = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [isMobile,     setIsMobile]     = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.listUsers();
      setUsers(res.users || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    authApi.me().then(setMeData).catch(() => {});
  }, [loadUsers]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openCreate = () => {
    setForm({ username: '', email: '', password: '', phone_no: '', address: '' });
    setError(''); setSuccess(''); setModal('create');
  };

  const openView = (u) => {
    setSelected(u);
    setModal('view');
  };

  const openEdit = (u) => {
    setSelected(u);
    setForm({ username: u.username, email: u.email, phone_no: u.phone_no || '', address: u.address || '', new_password: '', confirm_password: '' });
    setShowEditPw(false); setShowEditConfirm(false);
    setError(''); setSuccess(''); setModal('edit');
  };

  const openProfile = () => {
    setForm({
      username: meData?.username || '',
      email:    meData?.email    || '',
      phone_no: meData?.phone_no || '',
      address:  meData?.address  || '',
    });
    setError(''); setSuccess(''); setModal('profile');
  };

  const openPassword = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError(''); setSuccess(''); setModal('password');
  };

  const save = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      if (modal === 'create') {
        if (!form.username || !form.email || !form.password) {
          setError('Username, email and password are required.'); setSaving(false); return;
        }
        await authApi.createUser(form);
        toast.success('User created successfully.');
        setModal(null);
        loadUsers();
      } else if (modal === 'edit') {
        if (form.new_password) {
          if (form.new_password.length < 8) { setError('Password must be at least 8 characters.'); setSaving(false); return; }
          if (form.new_password !== form.confirm_password) { setError('Passwords do not match.'); setSaving(false); return; }
        }
        const payload = { username: form.username, email: form.email, phone_no: form.phone_no, address: form.address };
        if (form.new_password) payload.password = form.new_password;
        await authApi.updateUser(selected.id, payload);
        toast.success('User updated.');
        setModal(null);
        loadUsers();
      } else if (modal === 'profile') {
        await authApi.updateProfile(form);
        setMeData(prev => ({ ...prev, ...form }));
        toast.success('Profile updated.');
        setModal(null);
      } else if (modal === 'password') {
        if (form.newPassword !== form.confirmPassword) {
          setError('Passwords do not match.'); setSaving(false); return;
        }
        await authApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
        toast.success('Password changed successfully.');
        setModal(null);
      }
    } catch (e) {
      setError(e.message || 'Operation failed');
      toast.error(e.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u) => {
    try {
      await authApi.updateUser(u.id, { is_active: !u.is_active });
      toast.success(u.is_active ? 'User deactivated' : 'User activated');
      loadUsers();
    } catch (e) {
      setError(e.message);
      toast.error(e.message || 'Failed to update user status');
    }
  };

  const deleteUser = async (u) => {
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    try {
      await authApi.deleteUser(u.id);
      toast.success(`User "${u.username}" deleted`);
      loadUsers();
    } catch (e) {
      setError(e.message);
      toast.error(e.message || 'Failed to delete user');
    }
  };

  const me = meData || currentUser;

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader
        title="User Management"
        sub="Create sub-users and manage admin accounts"
        action={<Button variant="primary" size="sm" onClick={openCreate}><UserPlus size={15} className="mr-1" /> Create User</Button>}
      />

      {success && (
        <div className="bg-emerald/10 border border-emerald/30 rounded-md px-4 py-3 text-emerald text-sm">{success}</div>
      )}
      {error && !modal && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Your Account Card ── */}
        <div className="bg-ink-2 border border-ink-4 rounded-lg p-6" style={{ alignSelf: 'start' }}>
          <h2 className="font-display text-lg text-white font-normal mb-5 flex items-center gap-2">
            <span className="text-gold">◈</span> Your Account
          </h2>
          {me ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-glow border border-gold-dark text-gold flex items-center justify-center text-xl font-bold">
                  {me.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-white font-medium">{me.username}</p>
                  <p className="text-smoke text-xs font-mono mt-0.5">{me.email}</p>
                  <Badge variant="gold" className="mt-1">Full Admin</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ink-4 text-sm">
                {[['Phone', me.phone_no], ['Address', me.address]].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-smoke text-xs font-mono uppercase tracking-wide mb-0.5">{l}</p>
                    <p className="text-mist">{v || '—'}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={openProfile}
                  className="flex-1 py-2 bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-md text-xs transition-colors">
                  ✎ Edit Profile
                </button>
                <button onClick={openPassword}
                  className="flex-1 py-2 bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-md text-xs transition-colors">
                  🔑 Change Password
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-ink-4 rounded w-3/4" />
              <div className="h-4 bg-ink-4 rounded w-1/2" />
            </div>
          )}
        </div>

        {/* ── Sub-users list ── */}
        <div className="lg:col-span-2 bg-ink-2 border border-ink-4 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-white font-normal flex items-center gap-2">
              <span className="text-gold">◉</span> Sub-Users
            </h2>
            <button onClick={loadUsers} className="text-smoke hover:text-white transition-colors" title="Refresh">
              <RefreshCw size={15} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-ink-4 rounded animate-pulse" />
              ))}
            </div>
          ) : users.filter(u => u.id !== currentUser?.id).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus size={36} className="text-smoke mb-3" />
              <p className="text-smoke text-sm">No sub-users yet.</p>
              <p className="text-ink-5 text-xs mt-1">Create users and assign them page privileges.</p>
              <button onClick={openCreate}
                className="mt-4 px-4 py-2 bg-gold/10 border border-gold/30 text-gold rounded-md text-sm hover:bg-gold/20 transition-colors">
                + Create First User
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {users.filter(u => u.id !== currentUser?.id).map(u => (
                <div key={u.id} className="flex items-center gap-4 bg-ink-3 rounded-lg px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-ink-4 border border-ink-5 text-smoke flex items-center justify-center text-sm font-bold shrink-0">
                    {u.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate">{u.username}</p>
                      {!u.is_active && <Badge variant="smoke">Inactive</Badge>}
                      {u.permissions !== null ? (
                        <Badge variant="blue">Staff</Badge>
                      ) : (
                        <Badge variant="gold">Admin</Badge>
                      )}
                    </div>
                    <p className="text-smoke text-xs font-mono truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to="/admin/privileges" state={{ userId: u.id }}
                      title="Manage Privileges"
                      className="p-1.5 text-smoke hover:text-gold transition-colors">
                      <ShieldCheck size={16} />
                    </Link>
                    <button onClick={() => openView(u)} title="View Details"
                      className="p-1.5 text-smoke hover:text-blue-400 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => openEdit(u)} title="Edit"
                      className="p-1.5 text-smoke hover:text-white transition-colors text-xs">
                      ✎
                    </button>
                    <button onClick={() => toggleActive(u)} title={u.is_active ? 'Deactivate' : 'Activate'}
                      className="p-1.5 text-smoke hover:text-gold transition-colors">
                      {u.is_active ? <ToggleRight size={16} className="text-emerald" /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => deleteUser(u)} title="Delete"
                      className="p-1.5 text-smoke hover:text-crimson transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create User Modal ── */}
      <Modal isOpen={modal === 'create'} onClose={() => { setModal(null); setShowPw(false); }} title="Create New User" size="md">
        {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', color:'#DC2626', fontSize:'0.875rem', marginBottom:14 }}>{error}</div>}
        <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'#FFF8F0', border:'1px solid #FDDCB5', borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
          <UserPlus size={16} style={{ color:'#FF5A09', marginTop:1, flexShrink:0 }} />
          <p style={{ fontSize:'0.82rem', color:'#6B4C32', margin:0, lineHeight:1.5 }}>
            Fill in the details below. After creating, visit <strong style={{ color:'#FF5A09' }}>Privileges</strong> to assign page access for this user.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16 }}>
          <div style={{ gridColumn:'1 / -1' }}>
            <label className={mLabel}>Username <span style={{ color:'#EF4444' }}>*</span></label>
            <div style={{ position:'relative' }}>
              <User size={16} style={mIconSt} />
              <input value={form.username||''} onChange={f('username')} placeholder="e.g. john_staff" className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>Email <span style={{ color:'#EF4444' }}>*</span></label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={mIconSt} />
              <input type="email" value={form.email||''} onChange={f('email')} placeholder="staff@syedcars.com" className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>Password <span style={{ color:'#EF4444' }}>*</span></label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={mIconSt} />
              <input type={showPw ? 'text' : 'password'} value={form.password||''} onChange={f('password')} placeholder="Min 8 characters" className={mInput} style={mPadR} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={mEyeSt}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className={mLabel}>Phone</label>
            <div style={{ position:'relative' }}>
              <Phone size={16} style={mIconSt} />
<input
  type="tel"
  value={form.phone_no || ''}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ''); // remove non-numbers
    f('phone_no')({
      target: {
        name: 'phone_no',
        value: onlyNumbers
      }
    });
  }}
  placeholder="e.g. 9177565639"
  className={mInput}
  style={mPad}
   maxLength={10}
/>             </div>
          </div>
          <div>
            <label className={mLabel}>Address</label>
            <div style={{ position:'relative' }}>
              <MapPin size={16} style={mIconSt} />
              <input value={form.address||''} onChange={f('address')} placeholder="City, State" className={mInput} style={mPad} />
            </div>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:16, borderTop:'1px solid #F3F4F6', marginTop:20 }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Creating…' : 'Create User'}</Button>
        </div>
      </Modal>

      {/* ── View User Modal ── */}
      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={`User — ${selected?.username}`} size="sm">
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, paddingBottom:16, borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#1D4ED8)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', fontWeight:700, flexShrink:0 }}>
                {selected.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p style={{ fontWeight:600, color:'#111', fontSize:'1rem', margin:'0 0 2px' }}>{selected.username}</p>
                <p style={{ fontSize:'0.82rem', color:'#6B7280', margin:'0 0 8px', fontFamily:"'Space Mono',monospace" }}>{selected.email}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Badge variant={selected.is_active ? 'green' : 'smoke'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge>
                  <Badge variant={selected.permissions !== null ? 'blue' : 'gold'}>{selected.permissions !== null ? 'Staff' : 'Admin'}</Badge>
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                ['Phone',   selected.phone_no || '—'],
                ['Address', selected.address  || '—'],
                ['Created', selected.created_at ? new Date(selected.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p style={{ fontSize:'0.7rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.08em', color:'#9CA3AF', marginBottom:4 }}>{label}</p>
                  <p style={{ fontSize:'0.875rem', color:'#111', fontWeight:500 }}>{val}</p>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:12, borderTop:'1px solid #F3F4F6' }}>
              <Button variant="ghost" onClick={() => setModal(null)}>Close</Button>
              <Button variant="primary" onClick={() => openEdit(selected)}>Edit User</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit User Modal ── */}
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setShowEditPw(false); setShowEditConfirm(false); }} title={`Edit — ${selected?.username}`} size="md">
        {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', color:'#DC2626', fontSize:'0.875rem', marginBottom:14 }}>{error}</div>}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16 }}>
          <div>
            <label className={mLabel}>Username</label>
            <div style={{ position:'relative' }}>
              <User size={16} style={mIconSt} />
              <input value={form.username||''} onChange={f('username')} className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>Email</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={mIconSt} />
              <input type="email" value={form.email||''} onChange={f('email')} className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>Phone</label>
            <div style={{ position:'relative' }}>
              <Phone size={16} style={mIconSt} />
              <input
                type="tel"
                value={form.phone_no || ''}
                onChange={(e) => { const v = e.target.value.replace(/\D/g,''); f('phone_no')({ target:{ value:v } }); }}
                placeholder="e.g. 9177565639"
                className={mInput}
                style={mPad}
                maxLength={10}
              />
            </div>
          </div>
          <div>
            <label className={mLabel}>Address</label>
            <div style={{ position:'relative' }}>
              <MapPin size={16} style={mIconSt} />
              <input value={form.address||''} onChange={f('address')} className={mInput} style={mPad} />
            </div>
          </div>
          {/* Password change section */}
          <div style={{ gridColumn:'1 / -1', display:'flex', alignItems:'center', gap:8, margin:'4px 0 4px' }}>
            <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
            <span style={{ fontSize:'0.68rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.1em', color:'#9CA3AF', whiteSpace:'nowrap' }}>Change Password (optional)</span>
            <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
          </div>
          <div>
            <label className={mLabel}>New Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={mIconSt} />
              <input type={showEditPw ? 'text' : 'password'} value={form.new_password||''} onChange={f('new_password')} placeholder="Leave blank to keep unchanged" className={mInput} style={mPadR} />
              <button type="button" onClick={() => setShowEditPw(p => !p)} style={mEyeSt}>
                {showEditPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className={mLabel}>Confirm New Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={mIconSt} />
              <input type={showEditConfirm ? 'text' : 'password'} value={form.confirm_password||''} onChange={f('confirm_password')} placeholder="Repeat new password" className={mInput} style={mPadR} />
              <button type="button" onClick={() => setShowEditConfirm(p => !p)} style={mEyeSt}>
                {showEditConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.confirm_password && form.new_password && (
              <p style={{ fontSize:'0.75rem', marginTop:6, fontFamily:"'Space Mono',monospace", color: form.new_password === form.confirm_password ? '#16A34A' : '#DC2626' }}>
                {form.new_password === form.confirm_password ? '✓ Passwords match' : '✕ Passwords do not match'}
              </p>
            )}
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:16, borderTop:'1px solid #F3F4F6', marginTop:18 }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </Modal>

      {/* ── Edit Profile Modal ── */}
      <Modal isOpen={modal === 'profile'} onClose={() => setModal(null)} title="Edit Your Profile" size="md">
        {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', color:'#DC2626', fontSize:'0.875rem', marginBottom:14 }}>{error}</div>}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, paddingBottom:20, borderBottom:'1px solid #F3F4F6' }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#FF5A09,#e04e00)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:700, flexShrink:0 }}>
            {(form.username || me?.username)?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p style={{ fontWeight:600, color:'#111', fontSize:'1rem', margin:'0 0 2px' }}>{form.username || me?.username}</p>
            <p style={{ fontSize:'0.82rem', color:'#282829', margin:'0 0 6px', fontFamily:"'Space Mono',monospace" }}>{form.email || me?.email}</p>
            <Badge variant="gold">Full Admin</Badge>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16 }}>
          <div>
            <label className={mLabel}>Username</label>
            <div style={{ position:'relative' }}>
              <User size={16} style={mIconSt} />
              <input value={form.username||''} onChange={f('username')} className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>Email</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={mIconSt} />
              <input type="email" value={form.email||''} onChange={f('email')} className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>Phone</label>
            <div style={{ position:'relative' }}>
              <Phone size={16} style={mIconSt} />
<input
  type="tel"
  value={form.phone_no || ''}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ''); // remove non-numbers
    f('phone_no')({
      target: {
        name: 'phone_no',
        value: onlyNumbers
      }
    });
  }}
  placeholder="e.g. 9177565639"
  className={mInput}
  style={mPad}
   maxLength={10}
/>            </div>
          </div>
          <div>
            <label className={mLabel}>Address</label>
            <div style={{ position:'relative' }}>
              <MapPin size={16} style={mIconSt} />
              <input value={form.address||''} onChange={f('address')} placeholder="City, State" className={mInput} style={mPad} />
            </div>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:16, borderTop:'1px solid #F3F4F6', marginTop:18 }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</Button>
        </div>
      </Modal>

      {/* ── Change Password Modal ── */}
      <Modal isOpen={modal === 'password'} onClose={() => { setModal(null); setShowNew(false); setShowConfirm(false); }} title="Change Password" size="sm">
        {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', color:'#DC2626', fontSize:'0.875rem', marginBottom:14 }}>{error}</div>}
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'#F0F9FF', border:'1px solid #BAE6FD', borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
          <KeyRound size={16} style={{ color:'#0284C7', flexShrink:0 }} />
          <p style={{ fontSize:'0.82rem', color:'#0C4A6E', margin:0 }}>Choose a strong password with at least 8 characters.</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label className={mLabel}>Current Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={mIconSt} />
              <input type="password" value={form.currentPassword||''} onChange={f('currentPassword')} placeholder="••••••••" className={mInput} style={mPad} />
            </div>
          </div>
          <div>
            <label className={mLabel}>New Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={mIconSt} />
              <input type={showNew ? 'text' : 'password'} value={form.newPassword||''} onChange={f('newPassword')} placeholder="Min 8 characters" className={mInput} style={mPadR} />
              <button type="button" onClick={() => setShowNew(p => !p)} style={mEyeSt}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.newPassword && (
              <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ display:'flex', gap:4, flex:1 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ height:4, flex:1, borderRadius:4, transition:'background 0.2s',
                      background: form.newPassword.length >= i * 2
                        ? form.newPassword.length < 6 ? '#EF4444'
                          : form.newPassword.length < 10 ? '#F59E0B' : '#10B981'
                        : '#E5E7EB'
                    }} />
                  ))}
                </div>
                <span style={{ fontSize:'0.7rem', fontFamily:"'Space Mono',monospace", color:'#6B7280' }}>
                  {form.newPassword.length < 6 ? 'Weak' : form.newPassword.length < 10 ? 'Fair' : 'Strong'}
                </span>
              </div>
            )}
          </div>
          <div>
            <label className={mLabel}>Confirm New Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={mIconSt} />
              <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword||''} onChange={f('confirmPassword')} placeholder="••••••••" className={mInput} style={mPadR} />
              <button type="button" onClick={() => setShowConfirm(p => !p)} style={mEyeSt}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.confirmPassword && form.newPassword && (
              <p style={{ fontSize:'0.75rem', marginTop:6, fontFamily:"'Space Mono',monospace", color: form.newPassword === form.confirmPassword ? '#16A34A' : '#DC2626' }}>
                {form.newPassword === form.confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
              </p>
            )}
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:16, borderTop:'1px solid #F3F4F6', marginTop:20 }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Updating…' : 'Change Password'}</Button>
        </div>
      </Modal>
    </div>
  );
}
