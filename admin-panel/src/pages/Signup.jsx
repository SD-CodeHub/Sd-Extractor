import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { signup, saveSession } from '../services/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signup(form);
      saveSession(data.token, data.user);
      toast.success('Account created!');
      navigate('/app');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white font-sans antialiased px-4 py-10">
      <Toaster position="top-center" />

      <button onClick={() => navigate('/')} className="mb-8 text-2xl font-black tracking-tighter text-center">
        SD<span className="text-indigo-400"> EXTRACTOR</span>
        <span className="block text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase -mt-1">by SD CodeHub</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white text-slate-900 p-10 rounded-[2rem] shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create your account</h2>
            <p className="text-slate-500 font-light">Sign up to request access to SD Extractor.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field icon={<FiUser />} placeholder="Full name" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />
            <Field icon={<FiMail />} type="email" placeholder="Gmail address" value={form.email}
              onChange={(v) => setForm({ ...form, email: v })} />
            <Field icon={<FiPhone />} placeholder="Mobile number" value={form.mobile}
              onChange={(v) => setForm({ ...form, mobile: v })} required={false} />
            <Field icon={<FiLock />} type="password" placeholder="Password (min 6 chars)" value={form.password}
              onChange={(v) => setForm({ ...form, password: v })} />

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center group disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/user-login" className="font-bold text-indigo-600 hover:underline">Log in</Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-300 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, type = 'text', placeholder, value, onChange, required = true }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        type={type}
        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-base"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
