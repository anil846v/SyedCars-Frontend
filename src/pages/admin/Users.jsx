/**
 * Users page — the backend exposes no dedicated user-list endpoint.
 * What IS available: create-admin (POST /api/auth/create-admin),
 * update-profile (PUT /api/auth/update-profile) and change-password.
 * We surface those actions here and store a local session list for UI.
 * The currently-logged-in user data comes from /api/auth/me.
 */
import { useState, useEffect } from 'react';
import { authApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const ROLE_VARIANT = { ADMIN: 'gold', OWNER: 'blue', CUSTOMER: 'smoke' };

export default function AdminUsers() {
  const { user: currentUser } = useAuth();

  const [meData,       setMeData]       = useState(null);
  const [loadingMe,    setLoadingMe]    = useState(true);
  const [modal,        setModal]        = useState(null); // 'profile' | 'password' | 'create'
  const [form,         setForm]         = useState({});
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState('');
  const [successMsg,   setSuccessMsg]   = useState('');

  useEffect(() => {
    authApi.me()
      .then(res => setMeData(res))
      .catch(() => {})
      .finally(() => setLoadingMe(false));
  }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openProfile = () => {
    setForm({
      username: meData?.username || '',
      email:    meData?.email    || '',
      phone_no: meData?.phone_no || '',
      address:  meData?.address  || '',
    });
    setFormError(''); setSuccessMsg(''); setModal('profile');
  };

  const openPassword = () => {
    setForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    setFormError(''); setSuccessMsg(''); setModal('password');
  };

  const openCreate = () => {
    setForm({ username:'', email:'', password:'', phone_no:'', address:'' });
    setFormError(''); setSuccessMsg(''); setModal('create');
  };

  const save = async () => {
    setSaving(true); setFormError(''); setSuccessMsg('');
    try {
      if (modal === 'profile') {
        const res = await authApi.updateProfile(form);
        setMeData(res.user ?? res);
        setSuccessMsg('Profile updated successfully.');
        setModal(null);
      } else if (modal === 'password') {
        if (form.newPassword !== form.confirmPassword) {
          setFormError('New passwords do not match.'); setSaving(false); return;
        }
        await authApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
        setSuccessMsg('Password changed successfully.');
        setModal(null);
      } else if (modal === 'create') {
        await authApi.login; // verify shape
        // uses POST /api/auth/create-admin
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/create-admin`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('sc_admin_token')}` },
            body: JSON.stringify({ ...form, role: 'ADMIN' }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create admin');
        setSuccessMsg(`Admin "${form.username}" created successfully.`);
        setModal(null);
      }
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2.5 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-wider text-smoke mb-1.5";

  const user = meData || currentUser;

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader
        title="User Management"
        sub="Manage admin accounts and your profile"
        action={<Button variant="primary" size="sm" onClick={openCreate}>+ Create Admin</Button>}
      />

      {successMsg && (
        <div className="bg-emerald/10 border border-emerald/30 rounded-md px-4 py-3 text-emerald text-sm">{successMsg}</div>
      )}

      {/* Note about user management scope */}
      <div className="bg-ink-2 border border-ink-4/60 rounded-lg px-5 py-4 flex items-start gap-3">
        <span className="text-gold text-lg shrink-0 mt-0.5">ℹ</span>
        <div className="text-sm text-smoke leading-relaxed">
          <span className="text-mist font-medium">User management scope: </span>
          The current backend exposes admin-level actions only. You can manage your own profile,
          change your password, and create additional admin accounts. Customer and owner accounts
          are auto-created when enquiries or car listings are submitted.
        </div>
      </div>

      {/* Current Admin Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ink-2 border border-ink-4 rounded-lg p-6">
          <h2 className="font-display text-lg text-white font-normal mb-5 flex items-center gap-2">
            <span className="text-gold">◈</span> Your Account
          </h2>

          {loadingMe ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-ink-4 rounded w-3/4" />
              <div className="h-4 bg-ink-4 rounded w-1/2" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold-glow border border-gold-dark text-gold flex items-center justify-center text-2xl font-bold">
                  {user.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{user.username}</h3>
                    <Badge variant={ROLE_VARIANT[user.role] || 'smoke'}>{user.role}</Badge>
                  </div>
                  <p className="text-smoke text-sm font-mono mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ink-4 text-sm">
                {[
                  ['Phone', user.phone_no],
                  ['Address', user.address],
                  ['Status', user.is_active ? 'Active' : 'Inactive'],
                  ['Member since', user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-smoke text-xs font-mono uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-mist">{val || '—'}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={openProfile}
                  className="flex-1 py-2.5 bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-md text-sm transition-colors">
                  ✎ Edit Profile
                </button>
                <button onClick={openPassword}
                  className="flex-1 py-2.5 bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-md text-sm transition-colors">
                  🔑 Change Password
                </button>
              </div>
            </div>
          ) : (
            <p className="text-smoke text-sm">Could not load user data.</p>
          )}
        </div>

        {/* Create Admin Info Card */}
        <div className="bg-ink-2 border border-ink-4 rounded-lg p-6">
          <h2 className="font-display text-lg text-white font-normal mb-5 flex items-center gap-2">
            <span className="text-gold">◉</span> Admin Access
          </h2>
          <p className="text-smoke text-sm leading-relaxed mb-5">
            Create additional admin accounts for staff who need access to this dashboard. 
            Admin accounts have full access to all listings, enquiries, and commissions.
          </p>
          <div className="space-y-3 text-sm">
            {[
              { icon:'⊞', label:'Full car management', desc:'Add, edit, update status' },
              { icon:'◎', label:'Enquiry access', desc:'View and manage all enquiries' },
              { icon:'◇', label:'Commission tracking', desc:'Record and manage payments' },
              { icon:'◉', label:'Owner management', desc:'View and edit seller details' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 bg-ink-3 rounded-md px-4 py-3">
                <span className="text-gold shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-smoke text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={openCreate}
            className="w-full mt-5 py-2.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-md text-sm transition-colors">
            + Create New Admin Account
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={modal === 'profile'} onClose={() => setModal(null)} title="Edit Profile" size="md">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['username','Username','admin'],['email','Email','admin@syedcars.com'],['phone_no','Phone','9876543210'],['address','Address','Hyderabad']].map(([k,label,ph]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} className={inputClass} />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={modal === 'password'} onClose={() => setModal(null)} title="Change Password" size="sm">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        <div className="flex flex-col gap-4">
          {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([k,label]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input type="password" value={form[k]||''} onChange={f(k)} placeholder="••••••••" className={inputClass} />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Change Password'}</Button>
        </div>
      </Modal>

      {/* Create Admin Modal */}
      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Create Admin Account" size="md">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['username','Username','newadmin'],['email','Email','staff@syedcars.com'],['phone_no','Phone','9876543210'],['address','Address','Madanapalle']].map(([k,label,ph]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} className={inputClass} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass}>Password</label>
            <input type="password" value={form.password||''} onChange={f('password')} placeholder="Min 8 characters" className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Creating…' : 'Create Admin'}</Button>
        </div>
      </Modal>
    </div>
  );
}
