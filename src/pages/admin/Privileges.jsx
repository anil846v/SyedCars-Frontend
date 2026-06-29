import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { authApi } from '../../utils/api';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Button from '../../components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';

// Pages shown as rows in the matrix
const PAGES = [
  { key: 'dashboard',   label: 'Dashboard'         },
  { key: 'cars',        label: 'Cars'              },
  { key: 'owners',      label: 'Owners'            },
  { key: 'sale-requests', label: 'Sale-Requests'       },
  { key: 'enquiries',   label: 'Enquiries'         },
  { key: 'sold-cars',   label: 'Sold Cars'         },
  { key: 'commissions', label: 'Commissions'       },
  // { key: 'repairs',     label: 'Repairs'           },
  // { key: 'users',       label: 'Users & Privileges'},
];

// Operations shown as columns
const OPS = ['view', 'add', 'update', 'delete'];
const OP_LABELS = { view: 'View', add: 'Add', update: 'Update', delete: 'Delete' };
const OP_COLORS = { view: '#3B82F6', add: '#10B981', update: '#F59E0B', delete: '#EF4444' };

function defaultPerms() {
  const p = {};
  for (const page of PAGES) {
    p[page.key] = { view: false, add: false, update: false, delete: false };
  }
  return p;
}

function normalisePerms(raw) {
  const base = defaultPerms();
  if (!raw) return base;
  for (const page of PAGES) {
    if (typeof raw[page.key] === 'boolean') {
      // Migrate old flat boolean → new nested structure
      base[page.key] = { view: raw[page.key], add: raw[page.key], update: raw[page.key], delete: raw[page.key] };
    } else if (raw[page.key] && typeof raw[page.key] === 'object') {
      base[page.key] = { ...base[page.key], ...raw[page.key] };
    }
  }
  return base;
}

function Tick({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 24, height: 24, borderRadius: 5,
        background: checked ? '#FF5A09' : '#F3F4F6',
        border: checked ? '2px solid #FF5A09' : '2px solid #D1D5DB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
        margin: 'auto',
      }}
      title={checked ? 'Click to remove' : 'Click to grant'}
    >
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export default function AdminPrivileges() {
  const toast = useToast();
  const location = useLocation();
  const preselectedId = location.state?.userId ?? null;

  const [users,    setUsers]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [perms,    setPerms]    = useState(defaultPerms());
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.listUsers();
      // Show only sub-users (permissions !== null)
      const list = (res.users || []).filter(u => u.permissions !== null);
      setUsers(list);
      if (preselectedId) {
        const found = list.find(u => u.id === preselectedId);
        if (found) doSelect(found);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedId]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const doSelect = (u) => {
    setSelected(u);
    setPerms(normalisePerms(u.permissions));
    setError(''); setSuccess('');
  };

  const toggle = (pageKey, op) =>
    setPerms(p => ({ ...p, [pageKey]: { ...p[pageKey], [op]: !p[pageKey][op] } }));

  const toggleRow = (pageKey) => {
    const anyOn = OPS.some(op => perms[pageKey][op]);
    setPerms(p => ({ ...p, [pageKey]: Object.fromEntries(OPS.map(op => [op, !anyOn])) }));
  };

  const toggleCol = (op) => {
    const anyOn = PAGES.some(pg => perms[pg.key][op]);
    setPerms(p => {
      const next = { ...p };
      PAGES.forEach(pg => { next[pg.key] = { ...next[pg.key], [op]: !anyOn }; });
      return next;
    });
  };

  const selectAll = () => {
    const p = {};
    PAGES.forEach(pg => { p[pg.key] = { view: true, add: true, update: true, delete: true }; });
    setPerms(p);
  };
  const clearAll = () => setPerms(defaultPerms());

  const save = async () => {
    if (!selected) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      await authApi.updatePermissions(selected.id, { permissions: perms });
      setSuccess(`Privileges saved for ${selected.username}.`);
      toast.success(`Privileges saved for ${selected.username}!`);
      setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, permissions: perms } : u));
      setSelected(prev => ({ ...prev, permissions: perms }));
    } catch (e) {
      setError(e.message || 'Failed to save');
      toast.error(e.message || 'Failed to save privileges');
    } finally {
      setSaving(false);
    }
  };

  // Count granted operations for display
  const grantedCount = (u) => {
    if (!u.permissions) return 0;
    const norm = normalisePerms(u.permissions);
    return PAGES.reduce((sum, pg) => sum + OPS.filter(op => norm[pg.key][op]).length, 0);
  };
  const totalOps = PAGES.length * OPS.length;

  /* ─── Styles ─── */
  const S = {
    card: {
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
    },
    cardHead: {
      padding: '14px 18px', borderBottom: '1px solid #F3F4F6',
      fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: '#111', fontWeight: 500,
    },
    userBtn: (active) => ({
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
      background: active ? 'rgba(255,90,9,0.06)' : 'transparent',
      border: active ? '1px solid rgba(255,90,9,0.25)' : '1px solid transparent',
      transition: 'all 0.15s', width: '100%', textAlign: 'left',
    }),
    avatar: (active) => ({
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      background: active ? 'rgba(255,90,9,0.12)' : '#F3F4F6',
      border: active ? '1px solid rgba(255,90,9,0.3)' : '1px solid #E5E7EB',
      color: active ? '#FF5A09' : '#9CA3AF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.85rem', fontWeight: 700,
    }),
    th: {
      padding: '10px 6px', fontSize: '0.72rem', fontFamily: "'Space Mono',monospace",
      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
      color: '#6B7280', textAlign: 'center', background: '#F9FAFB',
    },
    td: {
      padding: '8px 6px', textAlign: 'center', borderBottom: '1px solid #F3F4F6',
    },
    rowLabel: {
      padding: '10px 16px', fontSize: '0.875rem', color: '#111', fontWeight: 500,
      borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap', background: '#fff',
    },
  };

  return (
    <div style={{ padding: isMobile ? '16px 14px 56px' : '28px 28px 56px', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', color: '#111', fontWeight: 400, marginBottom: 4 }}>
          Privileges
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#343639' }}>
          Control page-level access for each staff user — set which operations they can perform.
        </p>
      </div>

      {error   && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#DC2626', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', color: '#059669', fontSize: '0.875rem', marginBottom: 16 }}>{success}</div>}

      <div className="priv-layout">

        {/* ── Left: User List ── */}
        <div style={S.card}>
          <div style={{ ...S.cardHead, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Select User</span>
            <button onClick={loadUsers} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }} title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>
          <div style={{ padding: 8 }}>
            {loading ? (
              <div style={{ padding: 16 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ height: 46, background: '#F3F4F6', borderRadius: 8, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem' }}>
                <p style={{ marginBottom: 4 }}>No staff users yet.</p>
                <p style={{ fontSize: '0.78rem' }}>Go to Users → Create User first.</p>
              </div>
            ) : (
              users.map(u => {
                const isActive = selected?.id === u.id;
                const g = grantedCount(u);
                return (
                  <button key={u.id} onClick={() => doSelect(u)} style={S.userBtn(isActive)}>
                    <div style={S.avatar(isActive)}>
                      {u.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.username}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: 0 }}>
                        {g}/{totalOps} permissions
                        {!u.is_active && ' · Inactive'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Permission Matrix ── */}
        <div style={S.card}>
          {!selected ? (
            <div style={{ padding: '80px 24px', textAlign: 'center', color: '#3c3e41' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🛡</div>
              <p style={{ fontSize: '0.875rem' }}>Select a user on the left to configure their privileges.</p>
            </div>
          ) : (
            <>
              {/* Matrix Header */}
              <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: '#111', fontWeight: 500 }}>
                    {selected.username}
                  </span>
                  {!isMobile && <span style={{ fontSize: '0.78rem', color: '#37393d', marginLeft: 8 }}>— Page Permissions</span>}
                  {isMobile && <p style={{ fontSize: '0.72rem', color: '#37393d', margin: '2px 0 0' }}>Page Permissions</p>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={selectAll}
                    style={{ padding: isMobile ? '5px 10px' : '6px 14px', fontSize: '0.75rem', border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#374151', transition: 'all 0.15s' }}>
                    Enable All
                  </button>
                  <button onClick={clearAll}
                    style={{ padding: isMobile ? '5px 10px' : '6px 14px', fontSize: '0.75rem', border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#374151', transition: 'all 0.15s' }}>
                    Disable All
                  </button>
                </div>
              </div>

              {/* Matrix Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: 180 }} />
                    {OPS.map(op => <col key={op} style={{ width: 100 }} />)}
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={{ ...S.th, textAlign: 'left', paddingLeft: 16 }}>
                        Page
                      </th>
                      {OPS.map(op => (
                        <th key={op} style={S.th}>
                          <button
                            onClick={() => toggleCol(op)}
                            title={`Toggle all ${op}`}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: OP_COLORS[op], padding: 0 }}
                          >
                            {OP_LABELS[op]}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PAGES.map((pg, i) => {
                      const rowEnabled = OPS.some(op => perms[pg.key][op]);
                      return (
                        <tr key={pg.key} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                          <td style={{ ...S.rowLabel, background: 'inherit' }}>
                            <button
                              onClick={() => toggleRow(pg.key)}
                              title="Toggle all for this page"
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '0.875rem', color: rowEnabled ? '#111' : '#6B7280',
                                fontWeight: rowEnabled ? 600 : 400,
                                padding: 0, fontFamily: "'DM Sans',sans-serif",
                                display: 'flex', alignItems: 'center', gap: 6,
                              }}
                            >
                              <span style={{
                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                background: rowEnabled ? '#FF5A09' : '#D1D5DB',
                              }} />
                              {pg.label}
                            </button>
                          </td>
                          {OPS.map(op => (
                            <td key={op} style={S.td}>
                              <Tick
                                checked={!!perms[pg.key][op]}
                                onChange={() => toggle(pg.key, op)}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend + Save */}
              <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', gap: isMobile ? 12 : 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  {OPS.map(op => (
                    <div key={op} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: OP_COLORS[op], flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{OP_LABELS[op]}</span>
                    </div>
                  ))}
                  {!isMobile && <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>— Click a column header to toggle the full column; click the page name to toggle its row.</span>}
                </div>
                <Button variant="primary" onClick={save} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Privileges'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
