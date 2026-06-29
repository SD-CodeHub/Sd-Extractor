import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers, addMember, toggleStatus, deleteMember, clearAdminSession } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FiGrid, FiUsers, FiUserPlus, FiSearch, 
  FiActivity, FiShieldOff, FiClock, FiTrash2, 
  FiPower, FiLogOut, FiCalendar, FiCheckCircle 
} from 'react-icons/fi';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', plan: 'monthly', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await getMembers();
      setMembers(data);
    } catch (err) { toast.error('Failed to load members'); }
  };

  const handleLogout = () => {
    clearAdminSession();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleAdd = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await addMember(form);

    // Show success toast with key + copy button
    toast.success(
      (t) => (
        <div className="flex flex-col gap-3 w-full">
          <div className="font-semibold text-lg">Member Added Successfully!</div>
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg">
            <span className="font-mono text-indigo-700 tracking-wide">
              {data.licenseKey}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.licenseKey);
                toast.success('License key copied to clipboard!', { id: t.id });
              }}
              className="text-sm bg-white px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition"
            >
              Copy Key
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Key is inactive until payment & manual activation
          </div>
        </div>
      ),
      {
        duration: 8000,           // stay visible longer
        position: "top-center",   // centered for emphasis
        style: {
          maxWidth: "420px",
          padding: "16px 20px",
        },
      }
    );

    // Reset form and refresh list
    setForm({ name: '', email: '', mobile: '', plan: 'monthly', password: '' });
    fetchMembers();
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to add member');
  } finally {
    setLoading(false);
  }
};

  const stats = {
    total: members.length,
    active: members.filter(m => m.is_active && (!m.expiry_date || new Date(m.expiry_date) > new Date())).length,
    blocked: members.filter(m => !m.is_active && m.activated_at).length,
    expired: members.filter(m => m.expiry_date && new Date(m.expiry_date) < new Date()).length
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.license_key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Toaster position="top-right" />

      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8 text-xl font-black tracking-tighter border-b border-slate-800">
          SD<span className="text-indigo-400"> EXTRACTOR</span>
          <p className="text-[10px] text-slate-500 tracking-[0.3em] font-bold mt-1 uppercase">Admin · by SD CodeHub</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <SidebarLink icon={<FiGrid/>} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<FiUsers/>} label="Manage Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarLink icon={<FiUserPlus/>} label="Add New Member" active={activeTab === 'add'} onClick={() => setActiveTab('add')} />
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-rose-400 hover:bg-rose-500/10 transition-all uppercase text-xs tracking-widest"
          >
            <FiLogOut className="text-lg" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-10 overflow-x-hidden">
        
        {/* TAB: DASHBOARD OVERVIEW */}
       {/* TAB: DASHBOARD OVERVIEW */}
{activeTab === 'dashboard' && (
  <div className="space-y-8 animate-in fade-in duration-700">
    {/* Header Section */}
    <header className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">System Metrics</h1>
        <p className="text-slate-500 mt-1 text-lg">Real-time performance of SD Extractor.</p>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Server: Operational</span>
      </div>
    </header>

    {/* Top Row: Primary Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="Total Members" value={stats.total} icon={<FiUsers/>} color="bg-indigo-600" shadow="shadow-indigo-100" />
      <StatCard label="Active Licenses" value={stats.active} icon={<FiActivity/>} color="bg-emerald-500" shadow="shadow-emerald-100" />
      <StatCard label="Blocked Keys" value={stats.blocked} icon={<FiShieldOff/>} color="bg-rose-500" shadow="shadow-rose-100" />
      <StatCard label="Expired" value={stats.expired} icon={<FiClock/>} color="bg-amber-500" shadow="shadow-amber-100" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* NEW: PLAN DISTRIBUTION CARD */}
      <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="mb-10">
          <h3 className="font-bold text-2xl text-slate-900">Subscription Mix</h3>
          <p className="text-slate-400 text-sm">Revenue distribution by plan type</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Progress Circles for Plans */}
          <div className="space-y-8">
            <div className="group">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition">Monthly Plan</span>
                <span className="text-xs font-bold text-slate-900">{members.filter(m => m.plan === 'monthly').length} Users</span>
              </div>
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(members.filter(m => m.plan === 'monthly').length / (stats.total || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-amber-500 transition">Annual Plan</span>
                <span className="text-xs font-bold text-slate-900">{members.filter(m => m.plan === 'yearly').length} Users</span>
              </div>
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(members.filter(m => m.plan === 'yearly').length / (stats.total || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Large Summary Stat */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Est. Annual Revenue</div>
             <div className="text-4xl font-black text-slate-900 italic">
               ₹{((members.filter(m => m.plan === 'monthly').length * 199) + (members.filter(m => m.plan === 'yearly').length * 1699)).toLocaleString()}
             </div>
             <p className="text-[10px] text-indigo-500 font-bold mt-4 uppercase tracking-tighter">Gross Projection</p>
          </div>
        </div>
      </div>

      {/* Side Card: Recent Activity Log */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
        <h3 className="font-bold text-xl text-slate-900 mb-6">Recent Activity</h3>
        <div className="flex-1 space-y-6">
          {members.slice(0, 5).map((m, i) => (
            <div key={i} className="flex items-start gap-4 animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                <FiCheckCircle size={16}/>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{m.name || 'Anonymous'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${m.plan === 'yearly' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {m.plan}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{formatDate(m.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FiUsers className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm italic font-light tracking-tight">Waiting for first activation...</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setActiveTab('users')}
          className="w-full mt-6 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition shadow-lg shadow-slate-200"
        >
          View Full Database
        </button>
      </div>
    </div>

    {/* Bottom Row: Quick Status Banner */}
    <div className="bg-black rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-all duration-700"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-black mb-2 italic">Enterprise Provisioning</h2>
        <p className="text-indigo-100 font-medium opacity-80">Generate the new user and help them to Grow </p>
      </div>
      <button 
        onClick={() => setActiveTab('add')}
        className="relative z-10 px-10 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-all shadow-xl text-sm uppercase tracking-widest"
      >
        Add Users
      </button>
    </div>
  </div>
)}

        {/* TAB: USER LIST (RESTORING ALL FIELDS) */}
        {activeTab === 'users' && (
          <div className="space-y-6">
             <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">User Database</h1>
                <div className="relative w-96">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search name, email, or key..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </header>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="p-5">User Details</th>
                        <th className="p-5">Mobile</th>
                        <th className="p-5">License Key</th>
                        <th className="p-5">Plan</th>
                        <th className="p-5">Created At</th>
                        <th className="p-5">Activated At</th>
                        <th className="p-5">Expiry Date</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px] divide-y divide-slate-50">
                      {filteredMembers.map(m => {
                        const expired = m.expiry_date && new Date(m.expiry_date) < new Date();
                        return (
                          <tr key={m._id} className="hover:bg-slate-50/50 transition">
                            <td className="p-5">
                              <div className="font-bold text-slate-900">{m.name || 'N/A'}</div>
                              <div className="text-xs text-slate-400">{m.email}</div>
                            </td>
                            <td className="p-5 font-medium text-slate-600">{m.mobile || '-'}</td>
                            <td className="p-5 font-mono text-[11px] text-indigo-600 bg-indigo-50/30 px-2 py-1 rounded inline-block mt-4 ml-4 uppercase tracking-tighter">
                              {m.license_key}
                            </td>
                            <td className="p-5"><span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase">{m.plan}</span></td>
                            <td className="p-5 text-slate-400">{formatDate(m.created_at)}</td>
                            <td className="p-5 text-slate-400">{formatDate(m.activated_at)}</td>
                            <td className={`p-5 font-bold ${expired ? 'text-rose-500' : 'text-slate-600'}`}>
                                {m.expiry_date ? formatDate(m.expiry_date) : 'Pending'}
                            </td>
                            <td className="p-5">
                               <StatusBadge member={m} />
                            </td>
                            <td className="p-5">
                              <div className="flex justify-center gap-3">
                                <button 
                                  onClick={() => toggleStatus(m._id, !m.is_active)}
                                  className={`p-2 rounded-lg transition ${m.is_active ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                  title={m.is_active ? "Block User" : "Activate User"}
                                >
                                  <FiPower size={18}/>
                                </button>
                                <button 
                                  onClick={() => { if(confirm('Delete permanently?')) deleteMember(m._id); }}
                                  className="p-2 text-slate-300 hover:text-rose-600 transition"
                                >
                                  <FiTrash2 size={18}/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ADD NEW */}
        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <header className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
              <p className="text-slate-500 mt-1">Input user information to provision a new license.</p>
            </header>

            <form onSubmit={handleAdd} className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-xl space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Full Name" value={form.name} onChange={(v) => setForm({...form, name: v})} placeholder="Ex: Rahul Sharma" />
                <InputGroup label="Mobile Number" value={form.mobile} onChange={(v) => setForm({...form, mobile: v})} placeholder="+91 98XXX XXX..." />
              </div>
              <InputGroup label="Email Address" type="email" value={form.email} onChange={(v) => setForm({...form, email: v})} placeholder="user@sdcodehub.com" />

              <InputGroup label="Login Password" type="password" value={form.password} onChange={(v) => setForm({...form, password: v})} placeholder="Set a password for the user (min 6 chars)" />

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Select Plan Duration</label>
                <select 
                  value={form.plan} 
                  onChange={(e) => setForm({...form, plan: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-slate-700 appearance-none"
                >
                  <option value="monthly">Monthly Access (30 Days)</option>
                  <option value="yearly">Yearly Access (365 Days)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Generate License Key"}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[14px] tracking-tight">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ member }) {
  const expired = member.expiry_date && new Date(member.expiry_date) < new Date();
  if (expired) return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase">Expired</span>;
  if (!member.is_active) return <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-black uppercase">Blocked</span>;
  if (member.is_active) return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase">Active</span>;
  return <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase">Pending</span>;
}

function InputGroup({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="w-full">
      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700"
        required
      />
    </div>
  );
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}