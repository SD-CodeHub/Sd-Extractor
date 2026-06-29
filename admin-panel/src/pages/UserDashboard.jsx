import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiLogOut, FiCheckCircle, FiClock, FiXCircle, FiAlertTriangle,
  FiDownload, FiKey, FiCopy, FiHome
} from 'react-icons/fi';
import { getMyLicenses, requestAccess, getCurrentUser, clearSession } from '../services/api';

// Direct download of the packed extension (served from /public). Once the
// extension is published, you can swap this for the Chrome Web Store URL.
const DOWNLOAD_URL = '/sd-extractor.zip';

const STATUS = {
  active:  { label: 'Active',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <FiCheckCircle /> },
  pending: { label: 'Pending Verification', cls: 'bg-amber-50 text-amber-600 border-amber-100', icon: <FiClock /> },
  blocked: { label: 'Blocked', cls: 'bg-rose-50 text-rose-600 border-rose-100', icon: <FiXCircle /> },
  expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: <FiAlertTriangle /> },
};

export default function UserDashboard() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState('monthly');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) { navigate('/user-login'); return; }
    setMobile(user.mobile || '');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const { data } = await getMyLicenses();
      setLicenses(data);
    } catch (err) {
      if (err.response?.status === 401) { clearSession(); navigate('/user-login'); }
      else toast.error('Failed to load your licenses');
    } finally {
      setLoading(false);
    }
  };

  const current = licenses[0];                       // most recent
  const inProgress = current && ['pending', 'active'].includes(current.status);

  const handleLogout = () => { clearSession(); navigate('/'); };

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestAccess({ plan, mobile });
      toast.success('Request submitted! Awaiting admin verification.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success('License key copied!');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Toaster position="top-right" />

      {/* Top bar */}
      <header className="bg-slate-900 px-8 py-5 flex justify-between items-center sticky top-0 z-40">
        <button onClick={() => navigate('/')} className="text-xl font-black tracking-tighter text-white text-left">
          SD<span className="text-indigo-400"> EXTRACTOR</span>
          <span className="block text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase -mt-0.5">My Account · by SD CodeHub</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-300 hover:bg-white/10 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition">
            <FiHome /> Home
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-rose-400 hover:bg-rose-500/10 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition">
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-black tracking-tight">Hi, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="text-slate-500 mt-1">{user?.email}</p>
        </div>

        {loading ? (
          <div className="text-slate-400 py-20 text-center">Loading…</div>
        ) : (
          <>
            {/* CURRENT LICENSE / STATUS */}
            {current ? (
              <CurrentLicenseCard license={current} onCopy={copyKey} />
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500">You don't have a license yet. Request access below to get started.</p>
              </div>
            )}

            {/* DOWNLOAD — always available. The extension installs for anyone,
                but stays locked until the license key is verified inside it. */}
            <div className="bg-black rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black italic mb-1">Get the extension</h2>
                <p className="text-indigo-100/80 text-sm">
                  {current?.status === 'active'
                    ? 'Download it, open it, and paste your license key to unlock extraction.'
                    : "Download it now — it will work as soon as your license is activated above."}
                </p>
              </div>
              <a href={DOWNLOAD_URL} download
                className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition text-sm uppercase tracking-widest flex items-center gap-2">
                <FiDownload /> Download Extension
              </a>
            </div>

            {/* REQUEST FORM */}
            {!inProgress && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold mb-1">Request access</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Choose a plan and submit. An admin will verify and activate your license.
                </p>
                <form onSubmit={handleRequest} className="grid sm:grid-cols-3 gap-4 items-end">
                  <label className="sm:col-span-1">
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Mobile</span>
                    <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91…"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </label>
                  <label className="sm:col-span-1">
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Plan</span>
                    <select value={plan} onChange={(e) => setPlan(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold">
                      <option value="monthly">Monthly (30 days)</option>
                      <option value="yearly">Yearly (365 days)</option>
                    </select>
                  </label>
                  <button type="submit" disabled={submitting}
                    className="sm:col-span-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition disabled:opacity-50">
                    {submitting ? 'Submitting…' : 'Submit Request'}
                  </button>
                </form>
              </div>
            )}

            {/* HISTORY */}
            {licenses.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold px-8 pt-6 pb-2">History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="p-5">License Key</th>
                        <th className="p-5">Plan</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Requested</th>
                        <th className="p-5">Activated</th>
                        <th className="p-5">Expires</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {licenses.map((l) => (
                        <tr key={l._id}>
                          <td className="p-5 font-mono text-[12px] text-indigo-600">{l.license_key}</td>
                          <td className="p-5 uppercase text-xs font-bold">{l.plan}</td>
                          <td className="p-5"><StatusBadge status={l.status} /></td>
                          <td className="p-5 text-slate-400">{fmt(l.requested_at || l.created_at)}</td>
                          <td className="p-5 text-slate-400">{fmt(l.activated_at)}</td>
                          <td className="p-5 text-slate-400">{fmt(l.expiry_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function CurrentLicenseCard({ license, onCopy }) {
  const s = STATUS[license.status] || STATUS.pending;
  const messages = {
    pending: 'Your request is in. An admin needs to verify and activate it before you can use the extension.',
    active: 'Your license is active. Use the key below inside the extension to start extracting.',
    blocked: 'This license has been blocked. Please contact the admin.',
    expired: 'Your plan has expired. Request a new plan below to continue.',
  };
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Current License</p>
          <div className="flex items-center gap-3">
            <FiKey className="text-slate-400" />
            <span className="font-mono text-lg text-indigo-600">{license.license_key}</span>
            <button onClick={() => onCopy(license.license_key)}
              className="text-slate-400 hover:text-indigo-600 transition" title="Copy key">
              <FiCopy />
            </button>
          </div>
        </div>
        <StatusBadge status={license.status} big />
      </div>
      <p className="mt-5 text-slate-500 text-sm leading-relaxed flex items-start gap-2">
        <span className="text-lg mt-0.5">{s.icon}</span>
        {messages[license.status]}
      </p>
    </div>
  );
}

function StatusBadge({ status, big }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase ${s.cls} ${big ? 'px-4 py-2 text-xs' : 'px-3 py-1 text-[10px]'}`}>
      {s.icon} {s.label}
    </span>
  );
}

function fmt(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}
